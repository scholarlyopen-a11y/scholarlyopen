export const runtime = "nodejs"
// Force clean Vercel build to load updated environment variables

import nodemailer from "nodemailer"
import { validateSubmissionAntiSpam, getClientIp, isSuspiciousEmail } from "@/lib/anti-spam"

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
  const ip = getClientIp(request)
  let smtpHost: string | undefined
  let smtpPort: number | undefined
  let smtpUser: string | undefined
  let smtpPass: string | undefined
  let smtpFrom: string | undefined
  let recipient: string | undefined

  try {
    smtpHost = requiredEnv("SMTP_HOST")
    smtpPort = asNumber(requiredEnv("SMTP_PORT")) ?? 587
    smtpUser = requiredEnv("SMTP_USER")
    smtpPass = requiredEnv("SMTP_PASS")
    smtpFrom = requiredEnv("SMTP_FROM")
    recipient = process.env.TRAINING_TO ?? "training@scholarlyopen.org"
  } catch (err) {
    // Graceful fallback for local development if SMTP keys are not configured.
    console.warn("SMTP credentials are not configured. Registration will be simulated locally.")
  }

  try {
    const body = await request.json()
    const { name, email, courseTitle, includeCert, website_hp, _form_ts, human_verification_token } = body

    if (!name || !email || !courseTitle) {
      return Response.json({ ok: false, error: "Missing required fields." }, { status: 400 })
    }

    // Anti-Spam & Bot Validation Check
    const spamCheck = validateSubmissionAntiSpam({
      honeypot: website_hp,
      formTimestamp: _form_ts,
      email,
      name,
      messageOrTitle: courseTitle,
      ip,
      verificationToken: human_verification_token,
    })

    if (spamCheck.isSpam) {
      if (spamCheck.action === "silent_drop") {
        return Response.json({ ok: true })
      }
      return Response.json({ ok: false, error: "Too many requests. Please wait a moment." }, { status: 429 })
    }

    const registrationDetails = `
=========================================
Webinar Registration Confirmation
=========================================
Hello ${name},

Thank you for registering for the upcoming Scholarly Open webinar:
"${courseTitle}"

Status: Confirmed
Price: FREE
Include Certificate of Completion: ${includeCert ? "Yes (Free)" : "No"}

Meeting details (Zoom / Google Meet link) will be emailed to you 24 hours prior to the live session.

If you have any questions, please contact our support team at training@scholarlyopen.org.

Best regards,
The Scholarly Open Team
https://scholarlyopen.org
=========================================
`

    const adminDetails = `
New Webinar Registration Received:
----------------------------------
Webinar: ${courseTitle}
Registrant Name: ${name}
Registrant Email: ${email}
Certificate Requested: ${includeCert ? "Yes" : "No"}
Registration Date: ${new Date().toISOString()}
`

    // If SMTP is NOT configured, simulate the email sending to the terminal console
    if (!smtpHost || !smtpUser || !smtpPass || !smtpFrom) {
      console.log("\n[SIMULATED EMAIL SENT TO USER (" + email + ")]:\n", registrationDetails)
      console.log("\n[SIMULATED EMAIL SENT TO ADMIN (" + (recipient || "training@scholarlyopen.org") + ")]:\n", adminDetails)
      return Response.json({ ok: true, simulated: true })
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

    // Send confirmation to the user (only if verified valid address)
    if (!isSuspiciousEmail(email)) {
      try {
        await transporter.sendMail({
          from: smtpFrom,
          to: email,
          subject: `Webinar Registration Confirmed: ${courseTitle}`,
          text: registrationDetails,
        })
      } catch (err) {
        console.warn("Failed to send webinar confirmation email to user:", err)
      }
    }

    // Send notification to admin
    const adminRecipient = (recipient && recipient.trim() !== "") ? recipient.trim() : "training@scholarlyopen.org"
    await transporter.sendMail({
      from: smtpFrom,
      to: adminRecipient,
      subject: `New Webinar Registration: ${courseTitle}`,
      text: adminDetails,
    })

    return Response.json({ ok: true })
  } catch (error) {
    console.error("Error processing webinar registration:", error)
    return Response.json({ ok: false, error: "Internal Server Error" }, { status: 500 })
  }
}
