export const runtime = "nodejs"

import nodemailer from "nodemailer"
import { getJournalReplyTo, DEFAULT_EDITORIAL_EMAIL } from "@/lib/data/journal-contacts"

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

    return Response.json({ ok: true })
  } catch (err) {
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed to dispatch invitation email." },
      { status: 500 }
    )
  }
}
