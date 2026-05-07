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

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ ok: false, error: "Disabled in production." }, { status: 403 })
  }

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
    recipient = process.env.CONTACT_TO ?? "abbas.qurasani+info-scholarisch@gmail.com"
  } catch (err) {
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : "Email service not configured." },
      { status: 503 },
    )
  }

  const body = (await request.json().catch(() => null)) as { to?: string } | null
  const to = body?.to?.trim() || recipient

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
    from: smtpFrom,
    to,
    subject: "Scholarisch SMTP Test",
    text: "SMTP configuration is working. This is a local test email from the project.",
  })

  return Response.json({ ok: true, sentTo: to })
}
