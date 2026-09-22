export const runtime = "nodejs"

import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { generateBrandedEmailHtml, interpolateTokens, DEFAULT_EMAIL_TEMPLATES } from "@/lib/email-templates"
import { getJournalReplyTo, DEFAULT_EDITORIAL_EMAIL } from "@/lib/data/journal-contacts"

interface EmailPayload {
  to: string
  subject?: string
  customSubject?: string
  template?: string
  recipientName?: string
  paperId?: string
  paperTitle?: string
  customMessage?: string
  customBody?: string
  customHtml?: string
  journal?: string
  actionLabel?: string
  actionUrl?: string
  fromEmail?: string
  senderName?: string
  role?: string
  includeEditorial360Logo?: boolean
}

export async function POST(req: Request) {
  try {
    const body: EmailPayload = await req.json()
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.scholarlyopen.org"
    const journal = body.journal || "Scholarly Open"
    const recipientName = body.recipientName || "Colleague"
    const paperId = body.paperId || "N/A"
    const paperTitle = body.paperTitle || "Manuscript"

    let finalSubject = body.customSubject || body.subject || ""
    let finalHtml = body.customHtml || ""

    // If full custom HTML was not provided directly, render it using template definition
    if (!finalHtml) {
      const templateDef = DEFAULT_EMAIL_TEMPLATES.find(t => t.id === body.template)
      
      const roleDisplayName = body.role 
        ? (body.role === "reviewer" ? "Peer Reviewer" : body.role === "editor" ? "Section Editor" : body.role === "ria" ? "Quality Check Admin (QC Admin)" : body.role === "jm" ? "Journal Manager" : body.role === "author" ? "Contributing Author" : body.role)
        : "Workspace Member"

      const tokens: Record<string, string> = {
        recipientName,
        recipientEmail: body.to,
        paperId,
        paperTitle,
        journal,
        role: roleDisplayName,
        roleKey: body.role || "member",
        portalUrl: `${baseUrl}/editorial360`,
        acceptUrl: `${baseUrl}/editorial360?action=accept&id=${paperId}&journal=${encodeURIComponent(journal)}&email=${encodeURIComponent(body.to)}&name=${encodeURIComponent(recipientName)}`,
        declineUrl: `${baseUrl}/editorial360?action=decline&id=${paperId}&journal=${encodeURIComponent(journal)}&email=${encodeURIComponent(body.to)}&name=${encodeURIComponent(recipientName)}`,
        editorName: "Editorial Office",
        customMessage: body.customMessage || "",
        dueDate: "within 14 calendar days"
      }

      if (!finalSubject) {
        if (templateDef) {
          finalSubject = interpolateTokens(templateDef.defaultSubject, tokens)
        } else {
          finalSubject = `Update regarding ${paperId} - ${journal}`
        }
      }

      let bodyText = body.customBody || ""
      if (!bodyText && templateDef) {
        bodyText = interpolateTokens(templateDef.defaultBody, tokens)
      } else if (!bodyText) {
        bodyText = `Dear ${recipientName},\n\nThis is an official communication from ${journal} regarding manuscript ${paperId} (${paperTitle}).\n\n${body.customMessage || ""}\n\nPlease access the editorial360 portal for details.`
      }

      const actionLabel = body.actionLabel || (templateDef?.actionLabel || "Access editorial360 Portal")
      let rawActionUrl = body.actionUrl || (templateDef?.actionUrlPlaceholder ? interpolateTokens(templateDef.actionUrlPlaceholder, tokens) : `${baseUrl}/editorial360`)
      if (rawActionUrl.includes("action=accept") && !rawActionUrl.includes("email=")) {
        rawActionUrl += `&email=${encodeURIComponent(body.to)}&name=${encodeURIComponent(recipientName)}&journal=${encodeURIComponent(journal)}`
      }

      let secondaryActionLabel: string | undefined
      let secondaryActionUrl: string | undefined
      if (body.template === "invitation") {
        secondaryActionLabel = "Decline"
        secondaryActionUrl = `${baseUrl}/editorial360?action=decline&id=${paperId}&journal=${encodeURIComponent(journal)}&email=${encodeURIComponent(body.to)}&name=${encodeURIComponent(recipientName)}`
      }

      const includeEditorial360Logo = body.includeEditorial360Logo ?? templateDef?.includeEditorial360Logo ?? false

      finalHtml = generateBrandedEmailHtml({
        subject: finalSubject,
        bodyText,
        actionLabel,
        actionUrl: rawActionUrl,
        secondaryActionLabel,
        secondaryActionUrl,
        journal,
        paperId: paperId !== "N/A" ? paperId : undefined,
        paperTitle: paperTitle !== "Manuscript" ? paperTitle : undefined,
        recipientName,
        baseUrl,
        includeEditorial360Logo
      })
    }

    if (!finalSubject) {
      finalSubject = `editorial360 Notification: ${journal}`
    }

    let sentViaSmtp = false
    let messageId = `MSG-SIM-${Date.now()}`

    // Check if SMTP environment variables exist
    const smtpHost = process.env.SMTP_HOST
    const smtpPort = Number(process.env.SMTP_PORT) || 587
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS

    // Designated sender email. Prioritizes explicit fromEmail (e.g. editorial@scholarlyopen.org)
    // or falls back to journal-specific address or DEFAULT_EDITORIAL_EMAIL
    const designatedEmail = body.fromEmail || (body.template === "workspace_invite" ? DEFAULT_EDITORIAL_EMAIL : getJournalReplyTo(journal))

    const activeSenderEmail = process.env.FORCE_SINGLE_SENDER === "true"
      ? (process.env.EDITORIAL_SENDER_EMAIL || DEFAULT_EDITORIAL_EMAIL)
      : designatedEmail

    const senderDisplayName = body.senderName || (body.template === "workspace_invite" ? "Scholarly Open Editorial Office" : `"${journal} Editorial Office"`)
    const formattedFrom = `"${senderDisplayName}" <${activeSenderEmail}>`
    const replyToEmail = body.fromEmail || designatedEmail || DEFAULT_EDITORIAL_EMAIL

    if (smtpHost && smtpUser && smtpPass && body.to) {
      const isSecure = smtpPort === 465 || process.env.SMTP_SECURE === "true"
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: isSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass
        },
        tls: {
          rejectUnauthorized: false
        }
      })

      const info = await transporter.sendMail({
        from: formattedFrom,
        to: body.to,
        cc: "scholarlyopen@gmail.com",
        replyTo: replyToEmail,
        subject: finalSubject,
        html: finalHtml
      })

      sentViaSmtp = true
      messageId = info.messageId
    }

    return NextResponse.json({
      success: true,
      sentViaSmtp,
      messageId,
      recipient: body.to,
      senderEmail: activeSenderEmail,
      from: formattedFrom,
      replyTo: replyToEmail,
      cc: "scholarlyopen@gmail.com",
      subject: finalSubject,
      renderedHtml: finalHtml,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error("Editorial360 email dispatch error:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error?.message || "Failed to dispatch email",
        code: error?.code || "EMAIL_DISPATCH_ERROR" 
      },
      { status: 500 }
    )
  }
}
