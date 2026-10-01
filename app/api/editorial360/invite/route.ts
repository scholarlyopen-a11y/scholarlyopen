export const runtime = "nodejs"

import nodemailer from "nodemailer"
import { getJournalReplyTo, DEFAULT_EDITORIAL_EMAIL } from "@/lib/data/journal-contacts"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wrccglyypgxtuikrupkh.supabase.co"
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyY2NnbHl5cGd4dHVpa3J1cGtoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODg2NjUzNSwiZXhwIjoyMTA0NDQyNTM1fQ.H6xldZUHFnoTUajtmGdoI_E59cDh3xEADVzPiUj0L2Y"
const BUCKET = "editorial360_data"
const SENT_FILE = "sent-invitations.json"

function requiredEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing ${name}`)
  }
  return value
}

function asNumber(value: string) {
  const n = Number(value)
  return Number.isFinite(n) ? n : undefined
}

function safeText(value: unknown, max = 5000) {
  const str = String(value ?? "").trim()
  if (str.length <= max) return str
  return str.slice(0, max)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const type = safeText(body.type, 50) // "reviewer" | "editor"
    const recipientEmail = safeText(body.email, 200)
    const recipientName = safeText(body.name, 120)
    const manuscriptId = safeText(body.manuscriptId, 100)
    const manuscriptTitle = safeText(body.manuscriptTitle, 300)
    const journalName = safeText(body.journalName, 200)
    const customNote = safeText(body.customNote, 2000)

    if (!type || !recipientEmail || !manuscriptId || !manuscriptTitle) {
      return Response.json({ ok: false, error: "Missing required invitation details." }, { status: 400 })
    }

    let smtpHost: string
    let smtpPort: number
    let smtpUser: string
    let smtpPass: string
    let smtpFrom: string

    try {
      smtpHost = requiredEnv("SMTP_HOST")
      smtpPort = asNumber(requiredEnv("SMTP_PORT")) ?? 587
      smtpUser = requiredEnv("SMTP_USER")
      smtpPass = requiredEnv("SMTP_PASS")
      smtpFrom = requiredEnv("SMTP_FROM")
    } catch {
      // Return simulated success in local development environment without SMTP
      console.log(`[SIMULATED EMAIL] Sent ${type} invitation to ${recipientEmail} for ${manuscriptId}`)
      return Response.json({ ok: true, simulated: true })
    }

    const isReviewer = type === "reviewer"
    const subject = isReviewer
      ? `[Scholarly Open] Peer Review Invitation: "${manuscriptTitle}" (${manuscriptId})`
      : `[Scholarly Open] Editorial Assignment: "${manuscriptTitle}" (${manuscriptId})`

    const replyToEmail = getJournalReplyTo(journalName)
    const activeSenderEmail = process.env.FORCE_SINGLE_SENDER === "true"
      ? (process.env.EDITORIAL_SENDER_EMAIL || DEFAULT_EDITORIAL_EMAIL)
      : replyToEmail
    const senderFrom = `"${journalName || "Scholarly Open"}" <${activeSenderEmail}>`

    const text = isReviewer
      ? [
          `Dear ${recipientName || "Colleague"},`,
          ``,
          `You have been invited by the Editorial Board of ${journalName || "Scholarly Open"} to review the following manuscript:`,
          ``,
          `Title: ${manuscriptTitle}`,
          `Manuscript ID: ${manuscriptId}`,
          `Journal: ${journalName}`,
          ``,
          customNote ? `Message from Editor:\n"${customNote}"\n` : ``,
          `REVIEWER ACTIONS:`,
          `Please access the editorial360 workspace to view the abstract and accept or decline this invitation:`,
          `https://scholarlyopen.org/editorial360?action=accept&id=${manuscriptId}&journal=${encodeURIComponent(journalName)}&email=${encodeURIComponent(recipientEmail)}`,
          `To decline: https://scholarlyopen.org/editorial360?action=decline&id=${manuscriptId}&journal=${encodeURIComponent(journalName)}&email=${encodeURIComponent(recipientEmail)}`,
          ``,
          `Thank you for contributing your expertise to scientific peer review.`,
          ``,
          `Best regards,`,
          `Editorial Board | ${journalName || "Scholarly Open"}`,
          replyToEmail,
        ].join("\n")
      : [
          `Dear ${recipientName || "Editor"},`,
          ``,
          `You have been assigned as the Handling Editor for manuscript ${manuscriptId} in ${journalName || "Scholarly Open"}.`,
          ``,
          `Title: ${manuscriptTitle}`,
          `Manuscript ID: ${manuscriptId}`,
          ``,
          `EDITORIAL ACTIONS:`,
          `Please access editorial360 to assign peer reviewers and conduct the initial evaluation:`,
          `https://scholarlyopen.org/editorial360?manuscriptId=${manuscriptId}&role=editor`,
          ``,
          `Best regards,`,
          `Managing Editor | ${journalName || "Scholarly Open"}`,
          replyToEmail,
        ].join("\n")

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    await transporter.sendMail({
      from: senderFrom,
      to: recipientEmail,
      replyTo: replyToEmail,
      sender: activeSenderEmail,
      envelope: {
        from: activeSenderEmail,
        to: [recipientEmail]
      },
      subject,
      text,
    })

    // Also persist dispatched invitation to Supabase Cloud Storage
    try {
      let sentList: any[] = []
      const cloudRes = await fetch(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${SENT_FILE}?t=${Date.now()}`, {
        cache: "no-store"
      })
      if (cloudRes.ok) {
        const cloudData = await cloudRes.json()
        if (cloudData && Array.isArray(cloudData.sentInvitations)) {
          sentList = cloudData.sentInvitations
        }
      }

      const newSent = {
        id: `INV-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        recipientName,
        recipientEmail,
        journal: journalName || "Scholarly Open",
        campaignType: isReviewer ? "reviewer_invitation" : "editor_invitation",
        subject,
        body: text,
        status: "Delivered",
        manuscriptId,
        manuscriptTitle
      }

      sentList.unshift(newSent)

      await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${SENT_FILE}`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          "Content-Type": "application/json",
          "x-upsert": "true"
        },
        body: JSON.stringify({ sentInvitations: sentList, lastUpdated: new Date().toISOString() })
      })
    } catch (saveErr) {
      console.warn("Could not save to sent-invitations in Supabase:", saveErr)
    }

    return Response.json({ ok: true })
  } catch (err) {
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed to dispatch invitation email." },
      { status: 500 }
    )
  }
}
