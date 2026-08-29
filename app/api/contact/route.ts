export const runtime = "nodejs"

import nodemailer from "nodemailer"

import { validateSubmissionAntiSpam, getClientIp } from "@/lib/anti-spam"

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

function subjectLabel(value: string) {
  switch (value) {
    case "submission":
      return "Manuscript Submission"
    case "review":
      return "Peer Review Status"
    case "apc":
      return "APC / Payment"
    case "technical":
      return "Technical Issue"
    case "editorial":
      return "Editorial Board"
    case "ethics":
      return "Research Integrity & Ethics Concerns"
    case "partnership":
      return "Partnership / Collaboration"
    default:
      return "Other"
  }
}

export async function POST(request: Request) {
  const ip = getClientIp(request)
  let smtpHost: string
  let smtpPort: number
  let smtpUser: string
  let smtpPass: string
  let smtpFrom: string
  let recipient: string

  try {
    smtpHost = requiredEnv("SMTP_HOST")
    smtpPort = asNumber(requiredEnv("SMTP_PORT")) ?? 587
    smtpUser = requiredEnv("SMTP_USER")
    smtpPass = requiredEnv("SMTP_PASS")
    smtpFrom = requiredEnv("SMTP_FROM")
    const envContact = process.env.INFO_TO ?? process.env.CONTACT_TO
    recipient = (envContact && !envContact.includes("training@scholarlyopen.org")) ? envContact : "info@scholarlyopen.org"
  } catch (err) {
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : "Email service not configured." },
      { status: 503 },
    )
  }

  const formData = await request.formData()
  const fullName = safeText(formData.get("name"), 160)
  const email = safeText(formData.get("email"), 200)
  const affiliation = safeText(formData.get("affiliation"), 240)
  const subject = safeText(formData.get("subject"), 80)
  const message = safeText(formData.get("message"), 12000)
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
    messageOrTitle: message,
    ip,
    verificationToken,
  })

  if (spamCheck.isSpam) {
    if (spamCheck.action === "silent_drop") {
      // Return synthetic success so spambots don't adjust attack strategies
      return Response.json({ ok: true })
    }
    return Response.json({ ok: false, error: "Too many requests. Please wait a moment." }, { status: 429 })
  }

  if (!fullName || !email || !subject || !message) {
    return Response.json({ ok: false, error: "Missing required fields." }, { status: 400 })
  }

  if (privacy !== "true") {
    return Response.json({ ok: false, error: "Privacy consent is required." }, { status: 400 })
  }

  const mailSubject = `Contact inquiry: ${subjectLabel(subject)}`
  const text = [
    "New contact inquiry via Scholarly Open website",
    "",
    `Name: ${fullName}`,
    `Email: ${email}`,
    `Institution: ${affiliation || "Not provided"}`,
    `Category: ${subjectLabel(subject)}`,
    "",
    "Message:",
    message,
  ].join("\n")

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    tls: {
      rejectUnauthorized: false
    }
  })

  const adminRecipient = (recipient && recipient.trim() !== "" && !recipient.includes("training@scholarlyopen.org")) ? recipient.trim() : "info@scholarlyopen.org"
  await transporter.sendMail({
    from: smtpFrom,
    to: adminRecipient,
    replyTo: email,
    subject: mailSubject,
    text,
  })

  return Response.json({ ok: true })
}

