export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"

export interface InvitationResponseRecord {
  id: string
  type: "eic" | "ae" | "board" | "reviewer_claim"
  candidateName: string
  candidateEmail?: string
  journal?: string
  decision: "yes" | "conditional" | "no" | "claimed"
  credentialId?: string
  timestamp: string
  notes?: string
}

let responseStore: InvitationResponseRecord[] = [
  {
    id: "RESP-1001",
    type: "reviewer_claim",
    candidateName: "Dr. Wenxiong Sun (孙文雄)",
    candidateEmail: "102500216@hbut.edu.cn",
    journal: "Scholarly Open: Engineering & Applied Sciences",
    decision: "claimed",
    credentialId: "CERT-SO-2026-9088",
    timestamp: "2026-09-23T21:40:00Z",
    notes: "Reviewer profile activated via Reviewer Gateway qualification."
  }
]

export async function GET() {
  return NextResponse.json({
    success: true,
    responses: responseStore,
    total: responseStore.length
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      type = "board",
      candidateName,
      candidateEmail = "",
      journal = "Scholarly Open",
      decision = "yes",
      credentialId = "",
      notes = ""
    } = body

    if (!candidateName) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 })
    }

    const newRecord: InvitationResponseRecord = {
      id: `RESP-${Date.now().toString().slice(-4)}`,
      type,
      candidateName,
      candidateEmail,
      journal,
      decision,
      credentialId,
      timestamp: new Date().toISOString(),
      notes: notes || `Action logged via Editorial360 invitation link (${type}: ${decision})`
    }

    responseStore = [newRecord, ...responseStore]

    // Send email alert to Journal Manager Desk if SMTP is configured
    try {
      const host = process.env.SMTP_HOST
      const port = Number(process.env.SMTP_PORT) || 587
      const user = process.env.SMTP_USER
      const pass = process.env.SMTP_PASS
      const from = process.env.SMTP_FROM || user

      if (host && user && pass) {
        const nodemailerModule = await import("nodemailer")
        const nodemailerInstance = nodemailerModule.default || nodemailerModule
        const transporter = nodemailerInstance.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass }
        })

        const roleLabel = type === "eic" 
          ? "Editor-in-Chief" 
          : type === "ae" 
          ? "Associate Editor" 
          : type === "reviewer_claim" 
          ? "Certified Peer Reviewer" 
          : "Editorial Board Member"

        const subject = type === "reviewer_claim"
          ? `[Reviewer Active] ${candidateName} completed Gateway Onboarding (${credentialId || "Certified"})`
          : `[Invitation Confirmed] ${candidateName} accepted ${roleLabel} for ${journal}`

        const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <div style="border-bottom: 2px solid #0b99ff; padding-bottom: 12px; margin-bottom: 16px;">
              <h2 style="color: #0f172a; margin: 0; font-size: 18px;">Editorial360 Notification: Appointment & Onboarding</h2>
            </div>
            <p style="font-size: 14px; color: #334155; line-height: 1.6;">
              <strong>Scholar / Candidate:</strong> ${candidateName}<br>
              <strong>Email:</strong> ${candidateEmail || "Provided during activation"}<br>
              <strong>Role / Category:</strong> ${roleLabel}<br>
              <strong>Journal Portfolio:</strong> ${journal}<br>
              <strong>Decision / Action:</strong> ${decision.toUpperCase()}<br>
              ${credentialId ? `<strong>Credential ID:</strong> ${credentialId}<br>` : ""}
              <strong>Timestamp:</strong> ${new Date().toUTCString()}
            </p>
            <div style="background-color: #f8fafc; padding: 12px; border-radius: 6px; font-size: 12px; color: #64748b;">
              This notification was generated automatically by Editorial360 Unified Editorial Management.
            </div>
          </div>
        `

        await transporter.sendMail({
          from: `"Editorial360 Notifications" <${from}>`,
          to: "info@scholarlyopen.org",
          replyTo: candidateEmail || "info@scholarlyopen.org",
          subject,
          html: htmlContent
        })
      }
    } catch (mailErr) {
      console.warn("Could not dispatch notification email:", mailErr)
    }

    return NextResponse.json({ success: true, record: newRecord })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
