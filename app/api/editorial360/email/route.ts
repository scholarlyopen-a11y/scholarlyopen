export const runtime = "nodejs"

import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { generateBrandedEmailHtml, interpolateTokens, DEFAULT_EMAIL_TEMPLATES } from "@/lib/email-templates"

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
      
      const tokens: Record<string, string> = {
        recipientName,
        paperId,
        paperTitle,
        journal,
        portalUrl: `${baseUrl}/editorial360`,
        acceptUrl: `${baseUrl}/editorial360?action=accept&id=${paperId}&email=${encodeURIComponent(body.to)}&name=${encodeURIComponent(recipientName)}`,
        declineUrl: `${baseUrl}/editorial360?action=decline&id=${paperId}&email=${encodeURIComponent(body.to)}&name=${encodeURIComponent(recipientName)}`,
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
        bodyText = `Dear ${recipientName},\n\nThis is an official communication from ${journal} regarding manuscript ${paperId} (${paperTitle}).\n\n${body.customMessage || ""}\n\nPlease access the Editorial360 portal for details.`
      }

      const actionLabel = body.actionLabel || (templateDef?.actionLabel || "Access Editorial360 Portal")
      let rawActionUrl = body.actionUrl || (templateDef?.actionUrlPlaceholder ? interpolateTokens(templateDef.actionUrlPlaceholder, tokens) : `${baseUrl}/editorial360`)
      if (rawActionUrl.includes("action=accept") && !rawActionUrl.includes("email=")) {
        rawActionUrl += `&email=${encodeURIComponent(body.to)}&name=${encodeURIComponent(recipientName)}`
      }

      let secondaryActionLabel: string | undefined
      let secondaryActionUrl: string | undefined
      if (body.template === "invitation") {
        secondaryActionLabel = "Decline"
        secondaryActionUrl = `${baseUrl}/editorial360?action=decline&id=${paperId}&email=${encodeURIComponent(body.to)}&name=${encodeURIComponent(recipientName)}`
      }

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
        baseUrl
      })
    }

    if (!finalSubject) {
      finalSubject = `Editorial360 Notification: ${journal}`
    }

    let sentViaSmtp = false
    let messageId = `MSG-SIM-${Date.now()}`

    // Check if SMTP environment variables exist
    const smtpHost = process.env.SMTP_HOST
    const smtpPort = Number(process.env.SMTP_PORT) || 587
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    const smtpFrom = process.env.SMTP_FROM || smtpUser

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

      const formattedFrom = smtpFrom?.includes("<") 
        ? smtpFrom 
        : `"${journal}" <${smtpFrom}>`

      const info = await transporter.sendMail({
        from: formattedFrom,
        to: body.to,
        cc: "scholarlyopen@gmail.com",
        replyTo: smtpFrom,
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
