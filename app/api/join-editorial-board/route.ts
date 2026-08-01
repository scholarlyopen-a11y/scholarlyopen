export const runtime = "nodejs"

import nodemailer from "nodemailer"

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
  const role = safeText(formData.get("role"), 80)
  const journal = safeText(formData.get("journal"), 100)
  const expertise = safeText(formData.get("expertise"), 5000)
  const cvUrl = safeText(formData.get("cvUrl"), 500)
  const privacy = safeText(formData.get("privacy"), 10)
  
  const cvFile = formData.get("cvFile") as File | null

  if (!fullName || !email || !role || !journal || !expertise) {
    return Response.json({ ok: false, error: "Missing required fields." }, { status: 400 })
  }

  if (privacy !== "true") {
    return Response.json({ ok: false, error: "Privacy consent is required." }, { status: 400 })
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

  const attachments = []
  if (cvFile && cvFile.size > 0) {
    const arrayBuffer = await cvFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    attachments.push({
      filename: cvFile.name,
      content: buffer,
    })
  }

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
    attachments,
  })

  return Response.json({ ok: true })
}
