export const runtime = "nodejs"

import nodemailer from "nodemailer"

import { validateSubmissionAntiSpam, getClientIp, isSuspiciousEmail, checkRateLimit } from "@/lib/anti-spam"
import { upsertDbManuscript } from "@/lib/supabase"
import { getJournalReplyTo } from "@/lib/data/journal-contacts"
import { generateBrandedEmailHtml } from "@/lib/email-templates"

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024

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

function journalLabel(value: string) {
  switch (value) {
    case "social-sciences":
    case "social-sciences-humanities":
      return "Social Sciences & Humanities"
    case "biology":
      return "Biology"
    case "chemistry":
      return "Chemistry"
    case "medicine":
      return "Medicine"
    case "engineering":
      return "Engineering & Applied Sciences"
    case "environmental-science":
      return "Environmental Science"
    case "clinical-ai-digital-health":
      return "Clinical AI & Digital Health"
    case "ai-safety-governance":
      return "AI Safety & Governance"
    case "quantum-engineering":
      return "Quantum Engineering"
    case "synthetic-biology-bio-design":
      return "Synthetic Biology & Bio-Design"
    case "space-resources-orbital-economy":
      return "Space Resources & Orbital Economy"
    default:
      return value || "Unspecified"
  }
}

function getJournalShortCode(discipline: string): string {
  const d = (discipline || "").toLowerCase().trim()
  if (d.includes("medicine") || d === "med") return "SOMED"
  if (d.includes("chemistry") || d === "chem") return "SOCHEM"
  if (d.includes("biology") || d === "bio") return "SOBIO"
  if (d.includes("social") || d.includes("ssh")) return "SOSSH"
  if (d.includes("engineering") || d.includes("eas")) return "SOEAS"
  if (d.includes("environmental") || d.includes("env")) return "SOENV"
  if (d.includes("clinical-ai") || d.includes("clinical ai") || d.includes("digital health") || d.includes("cai")) return "SOCAI"
  if (d.includes("ai-safety") || d.includes("ai safety") || d.includes("governance") || d.includes("ais")) return "SOAIS"
  if (d.includes("quantum") || d.includes("qe")) return "SOQE"
  if (d.includes("synthetic") || d.includes("bio-design") || d.includes("sbd")) return "SOSBD"
  if (d.includes("space") || d.includes("orbital") || d.includes("sre")) return "SOSRE"
  if (d.includes("decarbonization") || d.includes("dec")) return "SODEC"
  return "SOCHEM"
}

function getArticleTypeCode(articleType: string): string {
  const typeStr = (articleType || "").toLowerCase().trim()

  // 1. Clinical trial / protocols / specialized research
  if (typeStr.includes("clinical trial") || typeStr.includes("rctp")) return "RCTP"
  if (typeStr.includes("research protocol") || typeStr.includes("protocol")) return "RP"
  if (typeStr.includes("brief research") || typeStr.includes("brr")) return "BRR"
  if (typeStr.includes("research letter")) return "RL"
  if (typeStr.includes("observational study") || typeStr.includes("observational")) return "OS"
  if (typeStr.includes("retrospective study") || typeStr.includes("retrospective")) return "RTS"

  // 2. Reviews
  if (typeStr.includes("systematic review")) return "SRW"
  if (typeStr.includes("literature review")) return "LRW"
  if (typeStr.includes("book review")) return "BRW"
  if (typeStr.includes("mini review")) return "MRW"
  if (typeStr.includes("case review")) return "CRW"
  if (typeStr.includes("review")) return "RW"

  // 3. Case-based types
  if (typeStr.includes("case series")) return "CSR"
  if (typeStr.includes("case studies") || typeStr.includes("case study")) return "CS"
  if (typeStr.includes("case report")) return "CR"

  // 4. Letters / Communications / Opinions / Editorial types
  if (typeStr.includes("letter to the editor") || typeStr.includes("letter to editor")) return "LTE"
  if (typeStr.includes("short communication")) return "SC"
  if (typeStr.includes("commentary")) return "COM"
  if (typeStr.includes("hypothesis")) return "HYP"
  if (typeStr.includes("perspective")) return "PR"
  if (typeStr.includes("opinion")) return "OP"
  if (typeStr.includes("illustration")) return "IL"
  if (typeStr.includes("conference proceeding") || typeStr.includes("proceedings")) return "CP"
  if (typeStr.includes("technical report")) return "TR"
  if (typeStr.includes("errata") || typeStr.includes("erratum") || typeStr.includes("corrigendum")) return "ER"
  if (typeStr.includes("editorial")) return "ED"

  // 5. Default Research
  if (typeStr.includes("research") || typeStr.includes("original")) return "RS"

  return "RS"
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
    recipient = process.env.SUBMISSIONS_TO ?? "info@scholarlyopen.org"
  } catch (err) {
    return Response.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Email service not configured.",
      },
      { status: 503 },
    )
  }

  const formData = await request.formData()

  const firstName = safeText(formData.get("firstName"), 120)
  const lastName = safeText(formData.get("lastName"), 120)
  const authorEmail = safeText(formData.get("email"), 200)
  const affiliation = safeText(formData.get("affiliation"), 240)
  const discipline = safeText(formData.get("discipline"), 80)
  const submissionStage = safeText(formData.get("submissionStage"), 100) || "Initial Submission"
  const articleType = safeText(formData.get("articleType"), 100)
  const title = safeText(formData.get("title"), 240)
  const abstract = safeText(formData.get("abstract"), 12000)
  const agreed = safeText(formData.get("agreed"), 10)
  const honeypot = safeText(formData.get("website_hp") || formData.get("website") || formData.get("fax_hp"), 100)
  const formTimestamp = safeText(formData.get("_form_ts"), 50)
  const verificationToken = safeText(formData.get("human_verification_token"), 500)

  // Anti-Spam & Automated Bot Defense
  const spamCheck = validateSubmissionAntiSpam({
    honeypot,
    formTimestamp,
    email: authorEmail,
    name: `${firstName} ${lastName}`.trim(),
    messageOrTitle: `${title} ${abstract}`.trim(),
    affiliation,
    ip,
    verificationToken,
    requireVerification: false,
  })

  if (spamCheck.isSpam) {
    console.warn(`[Submit Anti-Spam] Bot submission dropped (${spamCheck.reason}) from IP ${ip}`)
    // Silent drop: Return success so bots do not retry or mutate payloads,
    // but DO NOT send any notification emails and DO NOT write to database!
    return Response.json({ ok: true, trackingId: "SO-BOT-FILTERED" })
  }

  // Anti-Spam Rate Limit Check
  if (ip && ip !== "unknown") {
    const rateCheck = checkRateLimit(ip, 12, 10 * 60 * 1000)
    if (rateCheck.isLimited) {
      return Response.json({ ok: false, error: "Too many submission attempts. Please wait a few minutes." }, { status: 429 })
    }
  }

  if (!firstName || !lastName || !authorEmail || !affiliation || !discipline || !articleType || !title || !abstract) {
    return Response.json({ ok: false, error: "Missing required fields." }, { status: 400 })
  }

  if (agreed !== "true") {
    return Response.json({ ok: false, error: "Agreement is required." }, { status: 400 })
  }

  const file = formData.get("manuscript")
  if (file && typeof file === "string") {
    return Response.json({ ok: false, error: "Invalid file payload." }, { status: 400 })
  }

  if (file instanceof File && file.size > MAX_FILE_SIZE_BYTES) {
    return Response.json({ ok: false, error: "File too large (max 25MB)." }, { status: 413 })
  }

  const journalCode = getJournalShortCode(discipline)
  const yr = new Date().getFullYear().toString().slice(-2)
  const typeCode = getArticleTypeCode(articleType)
  const seqNum = String(Math.floor(101 + Math.random() * 899))
  const trackingId = `${journalCode}-${yr}-${typeCode}${seqNum}`
  const subject = `[${trackingId}] Manuscript submission (${submissionStage}): [${articleType}] ${title} (${journalLabel(discipline)})`

  const text = [
    `Submission request via Scholarly Open website`,
    `Manuscript Tracking ID: ${trackingId}`,
    `Submission Type / Stage: ${submissionStage}`,
    ``,
    `Corresponding author`,
    `- Name: ${[firstName, lastName].filter(Boolean).join(" ")}`,
    `- Email: ${authorEmail}`,
    `- Institution: ${affiliation}`,
    ``,
    `Manuscript`,
    `- Target journal: ${journalLabel(discipline)}`,
    `- Submission Stage: ${submissionStage}`,
    `- Article Type: ${articleType}`,
    `- Title: ${title}`,
    `- Abstract:`,
    abstract,
  ].join("\n")

  const authorConfirmationSubject = `[Scholarly Open] Submission Received: "${title}" (ID: ${trackingId})`
  const authorConfirmationText = [
    `Dear ${firstName} ${lastName},`,
    ``,
    `Thank you for submitting your manuscript to Scholarly Open: ${journalLabel(discipline)}.`,
    ``,
    `Your submission has been registered under Tracking ID: ${trackingId}`,
    `Title: ${title}`,
    `Journal: ${journalLabel(discipline)}`,
    `Date Received: ${new Date().toISOString().split("T")[0]}`,
    ``,
    `WHAT HAPPENS NEXT?`,
    `1. Initial Quality Check: Our Editorial Office will conduct an initial formatting, ethical compliance, and plagiarism screening within 24-48 hours.`,
    `2. Handling Editor Assignment: A Handling Editor specialized in your research discipline will oversee independent peer review.`,
    `3. Peer Review: Your manuscript will be evaluated by independent expert referees.`,
    ``,
    `Please quote your Tracking ID (${trackingId}) in all correspondence with the editorial office.`,
    ``,
    `Best regards,`,
    `Editorial Office | Scholarly Open`,
    `info@scholarlyopen.org`,
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
      rejectUnauthorized: false,
    },
  })

  const attachments =
    file instanceof File && file.size > 0
      ? [
          {
            filename: file.name || "manuscript",
            content: Buffer.from(await file.arrayBuffer()),
            contentType: file.type || undefined,
          },
        ]
      : []

  // 1. Send notification to editorial office
  try {
    await transporter.sendMail({
      from: smtpFrom,
      to: recipient,
      replyTo: authorEmail,
      envelope: {
        from: smtpUser,
        to: [recipient, "scholarlyopen@gmail.com"],
      },
      subject,
      text,
      attachments,
    })
    console.log(`[Submit] Editorial notification sent for ${trackingId}`)
  } catch (editorialErr) {
    console.error(`[Submit] Failed to send editorial notification for ${trackingId}:`, editorialErr)
  }

  // 2. Send automated confirmation email directly to the submitter/registrant's email
  try {
    const journalTitle = journalLabel(discipline)
    const journalEmail = getJournalReplyTo(journalTitle)
    const authorFrom = `"${journalTitle} Editorial Office" <${journalEmail}>`

    const trackingUrl = `https://www.scholarlyopen.org/editorial360?manuscriptId=${encodeURIComponent(trackingId)}&email=${encodeURIComponent(authorEmail)}`

    const authorConfirmationBodyText = [
      `Dear ${firstName} ${lastName},`,
      ``,
      `Thank you for submitting your manuscript to Scholarly Open: ${journalTitle}. Your submission has been securely registered in our editorial system under Tracking ID: ${trackingId}.`,
      ``,
      `WHAT HAPPENS NEXT?`,
      `1. Initial Quality Check: Our Editorial Office will conduct an initial formatting, ethical compliance, and plagiarism screening within 24-48 hours.`,
      `2. Handling Editor Assignment: A Handling Editor specialized in your research discipline will oversee independent peer review.`,
      `3. Peer Review: Independent expert reviewers will evaluate your manuscript.`,
      ``,
      `You can monitor real-time editorial workflow milestones, review reports, and timeline benchmarks directly inside your dedicated editorial360 Author Workspace using the link below:`,
      ``,
      `Please quote your Tracking ID (${trackingId}) in all correspondence with the editorial office at ${journalEmail} or info@scholarlyopen.org.`,
    ].join("\n")

    const authorHtml = generateBrandedEmailHtml({
      subject: authorConfirmationSubject,
      bodyText: authorConfirmationBodyText,
      journal: `Scholarly Open: ${journalTitle}`,
      paperId: trackingId,
      paperTitle: title,
      recipientName: `${firstName} ${lastName}`.trim() || "Author",
      recipientEmail: authorEmail,
      baseUrl: "https://www.scholarlyopen.org",
      actionLabel: "Access editorial360 Author Workspace",
      actionUrl: trackingUrl,
      includeEditorial360Logo: true,
    })

    const defaultCc = "scholarlyopen@gmail.com"
    const authorCc = authorEmail.toLowerCase() !== defaultCc ? [defaultCc] : []

    const authorInfo = await transporter.sendMail({
      from: authorFrom,
      replyTo: journalEmail,
      to: authorEmail,
      envelope: {
        from: smtpUser, // Mandatory for Namecheap cPanel authentication
        to: [authorEmail, ...authorCc],
      },
      subject: authorConfirmationSubject,
      text: authorConfirmationText,
      html: authorHtml,
    })
    console.log(`[Submit] Author confirmation successfully sent for ${trackingId}:`, authorInfo.messageId)
  } catch (authorMailErr) {
    console.error(`[Submit] Failed to send author confirmation email for ${trackingId}:`, authorMailErr)
  }

  // 3. Persist submission in live Supabase cloud database
  try {
    await upsertDbManuscript({
      id: trackingId,
      title,
      journal: journalLabel(discipline),
      status: "Awaiting Initial Check",
      date: new Date().toISOString().split("T")[0],
      author_first_name: firstName,
      author_last_name: lastName,
      author_name: `${firstName} ${lastName}`.trim(),
      author_email: authorEmail,
      author_affiliation: affiliation,
      article_type: articleType,
      submission_stage: submissionStage,
      abstract,
      file_name: file instanceof File ? file.name : "manuscript.pdf",
      file_size: file instanceof File ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : "Unspecified",
      integrity_status: "Clean",
      editor_assigned: false,
    })
  } catch (dbErr) {
    console.warn("Could not save to Supabase from public submit:", dbErr)
  }

  return Response.json({ ok: true, trackingId })
}


