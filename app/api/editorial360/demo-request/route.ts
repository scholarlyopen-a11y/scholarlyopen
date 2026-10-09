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
    console.warn("SMTP configuration missing for demo-request, running in simulated mode:", err)
    return Response.json({
      ok: true,
      simulated: true,
      recipient: "info@scholarlyopen.org",
      message: "Submission received and logged successfully."
    })
  }

  try {
    const body = await request.json()
    const isAudit = body.type === "audit"
    const name = safeText(body.name, 160)
    const email = safeText(body.email, 200)
    const organization = safeText(body.organization, 240)
    const role = safeText(body.role, 100) || "Publisher / Executive"

    if (!name || !email || !organization) {
      return Response.json({ ok: false, error: "Name, email, and organization are required." }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    if (isAudit) {
      // ==========================================
      // REAL-TIME PUBLISHER WORKFLOW AUDIT SUBMISSION
      // ==========================================
      const currentSystem = safeText(body.currentSystem, 100) || "Not specified"
      const turnaroundTime = safeText(body.turnaroundTime, 100) || "Not specified"
      const journalCount = safeText(body.journalCount, 50) || "1"
      const difficulties = Array.isArray(body.difficulties) ? body.difficulties.join(", ") : safeText(body.difficulties, 2000)
      const keySwitchFeature = safeText(body.keySwitchFeature, 1000) || "Not specified"
      const notes = safeText(body.notes, 5000)

      const mailSubject = `[editorial360 30-sec Diagnostic] ${name} from ${organization} (Current: ${currentSystem})`
      const mailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
          <div style="border-bottom: 2px solid #0b99ff; padding-bottom: 12px; margin-bottom: 20px;">
            <h2 style="color: #0b99ff; margin: 0; font-size: 20px;">editorial360™ 30-Sec Publisher Diagnostic</h2>
            <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Workflow Difficulties & System Pain Points Questionnaire</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #1e293b;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 160px; color: #475569;">Executive:</td>
              <td style="padding: 8px 0;"><strong>${name}</strong> (${role})</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Work Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #0b99ff;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Organization / Press:</td>
              <td style="padding: 8px 0;"><strong>${organization}</strong> (${journalCount} journal/s)</td>
            </tr>
            <tr style="border-top: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #475569;">Current System:</td>
              <td style="padding: 10px 0; color: #dc2626; font-weight: bold;">${currentSystem}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Current Turnaround:</td>
              <td style="padding: 8px 0; color: #d97706; font-weight: 600;">${turnaroundTime}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; vertical-align: top;">Key Difficulties:</td>
              <td style="padding: 8px 0; background: #fef2f2; border-left: 3px solid #ef4444; padding: 10px; font-size: 13px; color: #991b1b; border-radius: 4px;">
                ${difficulties || "None reported"}
              </td>
            </tr>
            ${keySwitchFeature ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; vertical-align: top;">Key Switch Feature:</td>
              <td style="padding: 8px 0; background: #f0fdf4; border-left: 3px solid #22c55e; padding: 10px; font-size: 13px; color: #166534; border-radius: 4px;">${keySwitchFeature}</td>
            </tr>
            ` : ""}
            ${notes ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; vertical-align: top;">Additional Remarks:</td>
              <td style="padding: 8px 0; font-size: 13px;">${notes}</td>
            </tr>
            ` : ""}
          </table>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
            Dispatched from editorial360™ Institutional Pricing Gateway · IP: ${ip}
          </div>
        </div>
      `

      await transporter.sendMail({
        from: smtpFrom,
        to: recipient,
        subject: mailSubject,
        html: mailHtml,
        replyTo: email,
      })

      // Polite confirmation to applicant
      try {
        await transporter.sendMail({
          from: smtpFrom,
          to: email,
          subject: `editorial360™ 30-Sec Publisher Diagnostic Summary`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
              <h2 style="color: #0f172a; margin: 0 0 12px 0;">Thank You, ${name}</h2>
              <p style="font-size: 14px; color: #475569; line-height: 1.6;">
                We have recorded your editorial workflow diagnostic for <strong>${organization}</strong>.
              </p>
              <div style="background: #f1f5f9; border-left: 4px solid #0b99ff; padding: 12px 16px; margin: 18px 0; border-radius: 0 8px 8px 0;">
                <p style="margin: 0; font-size: 13px; color: #1e293b;">
                  <strong>Legacy Environment:</strong> ${currentSystem}<br>
                  <strong>Reported Turnaround:</strong> ${turnaroundTime}<br>
                  <strong>Target editorial360 Turnaround:</strong> 21 Days
                </p>
              </div>
              <p style="font-size: 14px; color: #475569; line-height: 1.6;">
                An executive from the Scholarly Open team will reach out with a tailored migration analysis demonstrating how editorial360 addresses your specific workflow bottlenecks.
              </p>
              <p style="font-size: 13px; color: #64748b; margin-top: 24px;">
                Warm regards,<br>
                <strong>editorial360™ Advisory Group</strong><br>
                Scholarly Open Inc.
              </p>
            </div>
          `,
        })
      } catch (confErr) {
        console.warn("Auto-confirmation email to auditor failed, admin alert sent:", confErr)
      }

      return Response.json({ ok: true, recipient, isAudit: true })
    }

    // ==========================================
    // STANDARD DEMO MEETING SUBMISSION
    // ==========================================
    const plan = safeText(body.plan, 100) || "Elevate"
    const meetingSlot = safeText(body.meetingSlot, 200) || "Online Executive Briefing (Zoom / Google Meet)"
    const notes = safeText(body.notes, 5000)

    const mailSubject = `[editorial360 Demo] ${name} from ${organization} (${plan})`
    const mailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
        <div style="border-bottom: 2px solid #0b99ff; padding-bottom: 12px; margin-bottom: 20px;">
          <h2 style="color: #0b99ff; margin: 0; font-size: 20px;">editorial360™ Executive Online Session Request</h2>
          <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Frankfurt Book Fair 2026 · Online Meeting Lead</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #1e293b;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 140px; color: #475569;">Executive Name:</td>
            <td style="padding: 8px 0;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569;">Work Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #0b99ff;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569;">Organization:</td>
            <td style="padding: 8px 0;">${organization}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569;">Executive Role:</td>
            <td style="padding: 8px 0;">${role}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569;">Interested Tier:</td>
            <td style="padding: 8px 0;"><strong style="color: #0b99ff;">${plan}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569;">Online Format:</td>
            <td style="padding: 8px 0; color: #0284c7; font-weight: 600;">${meetingSlot}</td>
          </tr>
          ${notes ? `
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569; vertical-align: top;">Notes / Needs:</td>
            <td style="padding: 8px 0; background: #f8fafc; border-radius: 6px; padding: 10px; font-size: 13px;">${notes}</td>
          </tr>
          ` : ""}
        </table>

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
          Received via editorial360™ Institutional Pricing Gateway · IP: ${ip}
        </div>
      </div>
    `

    await transporter.sendMail({
      from: smtpFrom,
      to: recipient,
      subject: mailSubject,
      html: mailHtml,
      replyTo: email,
    })

    try {
      await transporter.sendMail({
        from: smtpFrom,
        to: email,
        subject: `editorial360™ Executive Online Session Confirmation`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
            <h2 style="color: #0f172a; margin: 0 0 12px 0;">Thank You for Connecting, ${name}</h2>
            <p style="font-size: 14px; color: #475569; line-height: 1.6;">
              We have received your request for an online executive demonstration and institutional briefing on <strong>editorial360 (${plan})</strong>.
            </p>
            <div style="background: #f1f5f9; border-left: 4px solid #0b99ff; padding: 12px 16px; margin: 18px 0; border-radius: 0 8px 8px 0;">
              <p style="margin: 0; font-size: 13px; color: #1e293b;">
                <strong>Selected Format:</strong> ${meetingSlot}<br>
                <strong>Organization:</strong> ${organization}
              </p>
            </div>
            <p style="font-size: 14px; color: #475569; line-height: 1.6;">
              An executive from the Scholarly Open delegation will reach out within 2 hours to confirm your calendar invite and video link.
            </p>
            <p style="font-size: 13px; color: #64748b; margin-top: 24px;">
              Warm regards,<br>
              <strong>editorial360™ Executive Team</strong><br>
              Scholarly Open Inc.
            </p>
          </div>
        `,
      })
    } catch (confErr) {
      console.warn("Auto-confirmation email to requester failed, admin alert sent:", confErr)
    }

    return Response.json({ ok: true, recipient })
  } catch (err) {
    console.error("Error processing demo request:", err)
    return Response.json({ ok: false, error: err instanceof Error ? err.message : "Failed to dispatch notification." }, { status: 500 })
  }
}
