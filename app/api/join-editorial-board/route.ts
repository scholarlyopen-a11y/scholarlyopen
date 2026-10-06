export const runtime = "nodejs"

import fs from "fs"
import path from "path"
import nodemailer from "nodemailer"
import { validateSubmissionAntiSpam, getClientIp } from "@/lib/anti-spam"

function asNumber(value: string | undefined) {
  if (!value) return undefined
  const n = Number(value)
  return Number.isFinite(n) ? n : undefined
}

function safeText(value: unknown, max = 5000) {
  const str = String(value ?? "").trim()
  if (str.length <= max) return str
  return str.slice(0, max)
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wrccglyypgxtuikrupkh.supabase.co"
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyY2NnbHl5cGd4dHVpa3J1cGtoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODg2NjUzNSwiZXhwIjoyMTA0NDQyNTM1fQ.H6xldZUHFnoTUajtmGdoI_E59cDh3xEADVzPiUj0L2Y"
const BUCKET = "editorial360_data"
const RESPONSES_FILE = "invitation-responses.json"
const LOCAL_RESPONSES_PATH = path.join(process.cwd(), "lib", "data", "invitation-responses.json")

async function recordApplicationInDatabase(record: any) {
  let existingResponses: any[] = []

  // 1. Fetch current responses
  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${RESPONSES_FILE}?t=${Date.now()}`, {
      cache: "no-store"
    })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data?.responses)) {
        existingResponses = data.responses
      }
    }
  } catch (e) {
    console.warn("Supabase fetch warning in join-editorial-board:", e)
  }

  if (existingResponses.length === 0) {
    try {
      if (fs.existsSync(LOCAL_RESPONSES_PATH)) {
        const raw = fs.readFileSync(LOCAL_RESPONSES_PATH, "utf-8")
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed?.responses)) {
          existingResponses = parsed.responses
        }
      }
    } catch (e) {}
  }

  // Update or append
  const idx = existingResponses.findIndex(r => r.candidateEmail?.toLowerCase() === record.candidateEmail?.toLowerCase())
  if (idx >= 0) {
    existingResponses[idx] = { ...existingResponses[idx], ...record }
  } else {
    existingResponses.unshift(record)
  }

  // Save locally
  try {
    const dir = path.dirname(LOCAL_RESPONSES_PATH)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(LOCAL_RESPONSES_PATH, JSON.stringify({ responses: existingResponses, lastUpdated: new Date().toISOString() }, null, 2), "utf-8")
  } catch (e) {
    console.error("Local file write error in join-editorial-board:", e)
  }

  // Save to Supabase Cloud Storage
  try {
    await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${RESPONSES_FILE}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        "x-upsert": "true"
      },
      body: JSON.stringify({ responses: existingResponses, lastUpdated: new Date().toISOString() })
    })
  } catch (e) {
    console.warn("Supabase save error in join-editorial-board:", e)
  }
}

export async function POST(request: Request) {
  const ip = getClientIp(request)
  const formData = await request.formData()

  const fullName = safeText(formData.get("name"), 160)
  const email = safeText(formData.get("email"), 200)
  const affiliation = safeText(formData.get("affiliation"), 240)
  const role = safeText(formData.get("role"), 80)
  const journal = safeText(formData.get("journal"), 100)
  const expertise = safeText(formData.get("expertise"), 5000)
  const cvUrl = safeText(formData.get("cvUrl"), 500)
  const privacy = safeText(formData.get("privacy"), 10)
  const honeypot = safeText(formData.get("website_hp") || formData.get("website") || formData.get("fax_hp"), 100)
  const formTimestamp = safeText(formData.get("_form_ts"), 50)
  const verificationToken = safeText(formData.get("human_verification_token"), 500)

  // Anti-Spam & Bot Validation Check
  const spamCheck = validateSubmissionAntiSpam({
    honeypot,
    formTimestamp,
    email,
    name: fullName,
    messageOrTitle: expertise,
    ip,
    verificationToken,
  })

  if (spamCheck.isSpam) {
    if (spamCheck.action === "silent_drop") {
      return Response.json({ ok: true })
    }
    return Response.json({ ok: false, error: "Too many requests. Please wait a moment." }, { status: 429 })
  }

  if (!fullName || !email || !role || !journal || !expertise) {
    return Response.json({ ok: false, error: "Missing required fields." }, { status: 400 })
  }

  if (privacy !== "true") {
    return Response.json({ ok: false, error: "Privacy consent is required." }, { status: 400 })
  }

  // 1. Immediately record in Database so JM sees the application
  const cleanSlug = fullName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
  const appType = role.toLowerCase().includes("chief") ? "eic" : role.toLowerCase().includes("associate") ? "ae" : "ebm"
  const credentialId = `EBM-${fullName.replace(/^(Prof\.|Dr\.|Assoc\.)\s*/i, "").trim().split(" ")[0].toUpperCase()}`
  
  const appRecord = {
    id: `RESP-APP-${Date.now()}`,
    slug: cleanSlug,
    type: appType,
    candidateName: fullName,
    candidateEmail: email,
    journal: journal.startsWith("Scholarly Open:") ? journal : `Scholarly Open: ${journal.charAt(0).toUpperCase() + journal.slice(1)}`,
    decision: "yes",
    credentialId,
    timestamp: new Date().toISOString(),
    notes: `Application via website. Role: ${role}. Expertise: ${expertise.slice(0, 300)}...`,
    affiliation: affiliation || "Not provided",
    orcid: cvUrl.includes("orcid") ? cvUrl.split("orcid.org/").pop()?.replace("my-orcid?orcid=", "") : undefined,
    status: "Pending JM Approval",
    jmApproved: false,
    hasAcceptedTerms: true,
    consentProfileUpload: true
  }

  await recordApplicationInDatabase(appRecord)

  // 2. Dispatch Email Notification (with safe error handling so email server failure does not break the submission)
  try {
    const smtpHost = process.env.SMTP_HOST
    const smtpPort = asNumber(process.env.SMTP_PORT) ?? 587
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    const smtpFrom = process.env.SMTP_FROM || `"Scholarly Open" <info@scholarlyopen.org>`
    const envContact = process.env.INFO_TO ?? process.env.CONTACT_TO
    const recipient = (envContact && !envContact.includes("training@scholarlyopen.org")) ? envContact : "info@scholarlyopen.org"

    if (smtpHost && smtpUser && smtpPass) {
      const cvFile = formData.get("cvFile") as File | null
      const attachments = []
      if (cvFile && cvFile.size > 0) {
        const arrayBuffer = await cvFile.arrayBuffer()
        attachments.push({
          filename: cvFile.name,
          content: Buffer.from(arrayBuffer),
        })
      }

      const mailSubject = `Editorial Board Application: ${role} - ${journal}`
      const text = [
        "New Editorial Board Application via Scholarly Open website",
        "",
        `Name: ${fullName}`,
        `Email: ${email}`,
        `Institution: ${affiliation || "Not provided"}`,
        `Role Applied For: ${role}`,
        `Journal of Interest: ${journal}`,
        `CV/Profile Link: ${cvUrl || "Not provided"}`,
        "",
        "Area of Expertise:",
        expertise,
      ].join("\n")

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
        tls: { rejectUnauthorized: false }
      })

      await transporter.sendMail({
        from: smtpFrom,
        to: recipient.trim(),
        replyTo: email,
        subject: mailSubject,
        text,
        attachments,
      })
    }
  } catch (err) {
    console.warn("SMTP email notification warning in join-editorial-board:", err)
  }

  return Response.json({ ok: true, id: appRecord.id })
}
