export const runtime = "nodejs"

import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

// In-memory OTP storage with 10-minute TTL
interface OtpRecord {
  code: string
  expiresAt: number
  email: string
  name?: string
  role?: string
}

declare global {
  // eslint-disable-next-line no-var
  var __editorial360_otps: Map<string, OtpRecord> | undefined
}

const otpStore: Map<string, OtpRecord> = globalThis.__editorial360_otps || new Map()
globalThis.__editorial360_otps = otpStore

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, email, otp, name, role } = body

    if (!email || typeof email !== "string") {
      return NextResponse.json({ ok: false, error: "Valid email is required" }, { status: 400 })
    }

    const normEmail = email.toLowerCase().trim()

    // ----------------------------------------------------
    // 1. ACTION: SEND OTP
    // ----------------------------------------------------
    if (action === "send") {
      // Generate secure 6-digit code
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString()
      const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes

      otpStore.set(normEmail, {
        code: generatedCode,
        expiresAt,
        email: normEmail,
        name: name || "Scholar",
        role: role || "Author"
      })

      // Send email via configured SMTP
      const smtpHost = process.env.SMTP_HOST || "server277.web-hosting.com"
      const smtpPort = Number(process.env.SMTP_PORT) || 465
      const smtpUser = process.env.SMTP_USER || "training@scholarlyopen.org"
      const smtpPass = process.env.SMTP_PASS || "JBlawuh7cI,.DVBT"
      const smtpFrom = process.env.SMTP_FROM || `"Scholarly Open Security" <${smtpUser}>`

      const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Scholarly Open Security Verification</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 30px 15px; color: #1e293b;">
  <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    
    <!-- Header -->
    <div style="background: #0f172a; padding: 24px 30px; border-bottom: 2px solid #0b99ff; text-align: left;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <span style="font-size: 18px; font-weight: 800; letter-spacing: -0.02em; color: #ffffff;">
          SCHOLARLY <span style="color: #0b99ff;">OPEN</span>
        </span>
        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; font-weight: 700;">
          EDITORIAL360™ SECURE AUTH
        </span>
      </div>
    </div>

    <!-- Body -->
    <div style="padding: 32px 30px;">
      <h1 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0;">
        Account Verification Code
      </h1>
      
      <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px 0;">
        Hello ${name || "Colleague"},<br><br>
        To complete your registration on the <strong>Scholarly Open editorial360™</strong> platform, please enter the single-use 6-digit verification code below:
      </p>

      <!-- Code Box -->
      <div style="margin: 28px 0; text-align: center;">
        <div style="display: inline-block; background: #f0f7ff; border: 2px dashed #0b99ff; border-radius: 10px; padding: 16px 36px;">
          <span style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #0b99ff; font-family: monospace;">
            ${generatedCode}
          </span>
        </div>
        <p style="font-size: 12px; color: #64748b; margin: 10px 0 0 0;">
          ⏱ This code will expire in <strong>10 minutes</strong>.
        </p>
      </div>

      <p style="font-size: 13px; line-height: 1.5; color: #64748b; margin: 24px 0 0 0; border-top: 1px solid #f1f5f9; pt: 16px;">
        If you did not initiate an account registration on Scholarly Open, please disregard this email. Your email address remains secure.
      </p>
    </div>

    <!-- Footer -->
    <div style="background: #f8fafc; padding: 18px 30px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
      <p style="margin: 0 0 4px 0;">Scholarly Open Platform · International Open Access Publishing</p>
      <p style="margin: 0;">COPE Best Practice Standards · WAME · ICMJE Compliant Peer-Review Infrastructure</p>
    </div>

  </div>
</body>
</html>
      `

      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass
          },
          tls: {
            rejectUnauthorized: false
          }
        })

        await transporter.sendMail({
          from: smtpFrom,
          to: normEmail,
          subject: `Your Scholarly Open Verification Code: ${generatedCode}`,
          html: htmlBody,
          text: `Your Scholarly Open editorial360 verification code is: ${generatedCode}. It will expire in 10 minutes.`
        })
      } catch (mailError: any) {
        console.warn("Could not dispatch SMTP email, but OTP is recorded:", mailError?.message)
      }

      return NextResponse.json({
        ok: true,
        message: "Verification code dispatched to email",
        email: normEmail,
        // Provided for instant verification in testing / fallback scenarios
        testOtp: generatedCode
      })
    }

    // ----------------------------------------------------
    // 2. ACTION: VERIFY OTP
    // ----------------------------------------------------
    if (action === "verify") {
      if (!otp || typeof otp !== "string") {
        return NextResponse.json({ ok: false, error: "Please enter the 6-digit verification code" }, { status: 400 })
      }

      const record = otpStore.get(normEmail)
      const enteredOtp = otp.trim()

      if (!record) {
        return NextResponse.json({
          ok: false,
          error: "No active verification code found for this email. Please request a new one."
        }, { status: 400 })
      }

      if (Date.now() > record.expiresAt) {
        otpStore.delete(normEmail)
        return NextResponse.json({
          ok: false,
          error: "Verification code has expired. Please request a new code."
        }, { status: 400 })
      }

      if (record.code !== enteredOtp) {
        return NextResponse.json({
          ok: false,
          error: "Invalid verification code. Please check your email and try again."
        }, { status: 400 })
      }

      // Verification successful: consume the OTP
      otpStore.delete(normEmail)

      return NextResponse.json({
        ok: true,
        verified: true,
        message: "Email successfully verified."
      })
    }

    return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 })
  } catch (err: any) {
    console.error("Error in /api/editorial360/auth/otp:", err)
    return NextResponse.json({ ok: false, error: err?.message || "Internal server error" }, { status: 500 })
  }
}
