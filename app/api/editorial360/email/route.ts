export const runtime = "nodejs"

import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

interface EmailPayload {
  to: string
  subject: string
  template: "invitation" | "submission_ack" | "decision" | "moderation_released" | "doi_published" | "reviewer_welcome" | "precheck_query" | "reviewer_reminder"
  recipientName: string
  paperId?: string
  paperTitle?: string
  customMessage?: string
  journal?: string
}

function generateEmailHtml(payload: EmailPayload) {
  const { template, recipientName, paperId = "N/A", paperTitle = "Manuscript", customMessage, journal = "Scholarly Open" } = payload
  const currentYear = new Date().getFullYear()

  let bodyContent = ""

  if (template === "invitation") {
    bodyContent = `
      <p style="font-size: 14px; line-height: 1.6; color: #334155;">Dear ${recipientName},</p>
      <p style="font-size: 14px; line-height: 1.6; color: #334155;">
        You have been invited to serve as an expert peer reviewer for the following manuscript submitted to <strong>${journal}</strong>:
      </p>
      <div style="background-color: #f8fafc; border-left: 4px solid #0b99ff; padding: 14px 16px; margin: 18px 0; border-radius: 4px;">
        <div style="font-size: 11px; font-weight: bold; color: #0b99ff; text-transform: uppercase;">Manuscript ID: ${paperId}</div>
        <div style="font-size: 15px; font-weight: bold; color: #0f172a; margin-top: 4px;">${paperTitle}</div>
      </div>
      <p style="font-size: 14px; line-height: 1.6; color: #334155;">
        ${customMessage || "This evaluation will be conducted under double-blind peer review standards in full compliance with COPE guidelines."}
      </p>
      <div style="margin: 24px 0;">
        <a href="http://localhost:3000/editorial360?action=accept&id=${paperId}" style="background-color: #0b99ff; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 13px; display: inline-block; margin-right: 12px;">Accept Invitation</a>
        <a href="http://localhost:3000/editorial360?action=decline&id=${paperId}" style="background-color: #f1f5f9; color: #475569; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 13px; display: inline-block;">Decline</a>
      </div>
    `
  } else if (template === "reviewer_welcome") {
    bodyContent = `
      <p style="font-size: 14px; line-height: 1.6; color: #334155;">Dear ${recipientName},</p>
      <p style="font-size: 14px; line-height: 1.6; color: #334155;">
        Welcome to the <strong>Scholarly Open Verified Reviewer Registry</strong>. Your academic profile has been registered in the <strong>${journal}</strong> peer evaluation pool.
      </p>
      <div style="background-color: #f8fafc; border-left: 4px solid #0b99ff; padding: 14px 16px; margin: 18px 0; border-radius: 4px;">
        <div style="font-size: 12px; font-weight: bold; color: #0f172a;">Editorial360 Reviewer Access</div>
        <div style="font-size: 13px; color: #475569; margin-top: 4px;">You will receive double-blind peer review invitations matching your discipline and keywords. You can manage your workload or set sabbatical leave at any time.</div>
      </div>
      <div style="margin: 24px 0;">
        <a href="http://localhost:3000/editorial360" style="background-color: #0b99ff; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 13px; display: inline-block;">Access Reviewer Portal</a>
      </div>
    `
  } else if (template === "precheck_query") {
    bodyContent = `
      <p style="font-size: 14px; line-height: 1.6; color: #334155;">Dear ${recipientName},</p>
      <p style="font-size: 14px; line-height: 1.6; color: #334155;">
        Thank you for submitting manuscript <strong>${paperId} (${paperTitle})</strong> to <strong>${journal}</strong>.
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #334155;">
        During the initial technical pre-check by the Journal Manager, the following item(s) require your attention before the paper can proceed to editorial triage:
      </p>
      <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 14px 16px; margin: 18px 0; border-radius: 4px;">
        <div style="font-size: 13px; color: #92400e; font-weight: 500;">
          ${customMessage || "Please provide higher resolution figures and ensure the ethics/COI declaration statement is attached."}
        </div>
      </div>
      <p style="font-size: 14px; line-height: 1.6; color: #334155;">
        Please log into the Editorial360 portal to upload the corrected files.
      </p>
      <div style="margin: 24px 0;">
        <a href="http://localhost:3000/editorial360" style="background-color: #0b99ff; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 13px; display: inline-block;">Upload Corrected Files</a>
      </div>
    `
  } else if (template === "reviewer_reminder") {
    bodyContent = `
      <p style="font-size: 14px; line-height: 1.6; color: #334155;">Dear ${recipientName},</p>
      <p style="font-size: 14px; line-height: 1.6; color: #334155;">
        This is a polite reminder regarding your double-blind peer review for manuscript <strong>${paperId} (${paperTitle})</strong> submitted to <strong>${journal}</strong>.
      </p>
      <div style="background-color: #f8fafc; border-left: 4px solid #0b99ff; padding: 14px 16px; margin: 18px 0; border-radius: 4px;">
        <div style="font-size: 13px; color: #0f172a; font-weight: 500;">
          ${customMessage || "We kindly request you to complete your scorecard report or let us know if you require a deadline extension."}
        </div>
      </div>
      <div style="margin: 24px 0;">
        <a href="http://localhost:3000/editorial360" style="background-color: #0b99ff; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 13px; display: inline-block;">Submit Review Report</a>
      </div>
    `
  } else if (template === "decision") {
    bodyContent = `
      <p style="font-size: 14px; line-height: 1.6; color: #334155;">Dear ${recipientName},</p>
      <p style="font-size: 14px; line-height: 1.6; color: #334155;">
        A formal editorial decision has been rendered for your manuscript submitted to <strong>${journal}</strong>:
      </p>
      <div style="background-color: #f8fafc; border-left: 4px solid #0b99ff; padding: 14px 16px; margin: 18px 0; border-radius: 4px;">
        <div style="font-size: 11px; font-weight: bold; color: #0b99ff; text-transform: uppercase;">Manuscript ID: ${paperId}</div>
        <div style="font-size: 15px; font-weight: bold; color: #0f172a; margin-top: 4px;">${paperTitle}</div>
      </div>
      <div style="font-family: monospace; font-size: 13px; line-height: 1.6; color: #1e293b; background-color: #f1f5f9; padding: 16px; border-radius: 6px; white-space: pre-line;">
        ${customMessage || "Please log into the Editorial360 portal to review the decision report."}
      </div>
    `
  } else if (template === "moderation_released") {
    bodyContent = `
      <p style="font-size: 14px; line-height: 1.6; color: #334155;">Dear ${recipientName},</p>
      <p style="font-size: 14px; line-height: 1.6; color: #334155;">
        The double-blind peer review reports for your manuscript <strong>${paperId} (${paperTitle})</strong> have been moderated and released to your Author Workspace.
      </p>
      <div style="margin: 20px 0;">
        <a href="http://localhost:3000/editorial360" style="background-color: #0b99ff; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 13px; display: inline-block;">View Review Reports</a>
      </div>
    `
  } else {
    bodyContent = `
      <p style="font-size: 14px; line-height: 1.6; color: #334155;">Dear ${recipientName},</p>
      <p style="font-size: 14px; line-height: 1.6; color: #334155;">
        Your manuscript <strong>${paperId}</strong> has been successfully processed in the <strong>${journal}</strong> editorial pipeline.
      </p>
    `
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${payload.subject}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 30px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <div style="background-color: #ffffff; padding: 20px 24px; border-bottom: 2px solid #0b99ff; display: flex; align-items: center; justify-content: space-between;">
          <div style="font-size: 20px; font-weight: 800; color: #0f172a;">Scholarly <span style="color: #0b99ff;">Open</span></div>
          <div style="font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase;">Editorial360 Platform</div>
        </div>
        <div style="padding: 28px 24px;">
          ${bodyContent}
        </div>
        <div style="background-color: #f8fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
          Scholarly Open Editorial Registry • Germany & Global Publishing Office<br>
          Double-Blind Peer Review • COPE Standard Compliance • © ${currentYear} Scholarly Open
        </div>
      </div>
    </body>
    </html>
  `
}

export async function POST(req: Request) {
  try {
    const body: EmailPayload = await req.json()
    const html = generateEmailHtml(body)

    let sentViaSmtp = false
    let messageId = `MSG-SIM-${Date.now()}`

    // Check if SMTP environment variables exist
    const smtpHost = process.env.SMTP_HOST
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      })

      const info = await transporter.sendMail({
        from: `"${body.journal || 'Scholarly Open'}" <${smtpUser}>`,
        to: body.to,
        cc: "scholarlyopen@gmail.com",
        subject: body.subject,
        html: html
      })

      sentViaSmtp = true
      messageId = info.messageId
    }

    return NextResponse.json({
      success: true,
      sentViaSmtp,
      messageId,
      recipient: body.to,
      cc: "scholarlyopen@gmail.com",
      subject: body.subject,
      renderedHtml: html,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error("Editorial360 email dispatch error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to dispatch email" },
      { status: 500 }
    )
  }
}
