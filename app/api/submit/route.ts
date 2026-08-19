export const runtime = "nodejs"

import nodemailer from "nodemailer"

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
    case "data-science":
      return "Data Science"
    case "engineering":
      return "Engineering & Applied Sciences"
    case "environmental-science":
      return "Environmental Science"
    case "clinical-ai-digital-health":
      return "Clinical AI & Digital Health"
    case "ai-safety-governance":
      return "AI Safety & Governance"
    case "decarbonization-carbon-tech":
      return "Decarbonization & Carbon Tech"
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
  switch (discipline?.toLowerCase().trim()) {
    case "medicine":
    case "med":
      return "SOMED"
    case "social-sciences":
    case "social-sciences-humanities":
    case "ssh":
      return "SOSSH"
    case "biology":
    case "bio":
      return "SOBIO"
    case "chemistry":
    case "chem":
      return "SOCHEM"
    case "data-science":
    case "dsa":
      return "SODSA"
    case "engineering":
    case "eas":
      return "SOEAS"
    case "environmental-science":
    case "env":
      return "SOENV"
    case "clinical-ai-digital-health":
    case "cai":
      return "SOCAI"
    case "ai-safety-governance":
    case "ais":
      return "SOAIS"
    case "decarbonization-carbon-tech":
    case "dct":
      return "SODCT"
    case "quantum-engineering":
    case "qe":
      return "SOQE"
    case "synthetic-biology-bio-design":
    case "sbd":
      return "SOSBD"
    case "space-resources-orbital-economy":
    case "sre":
      return "SOSRE"
    default:
      return "SO" + (discipline || "GEN").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3)
  }
}

function getArticleTypeCode(articleType: string): string {
  const typeStr = (articleType || "").toLowerCase()
  if (typeStr.includes("review")) return "RW"
  if (typeStr.includes("case")) return "CS"
  if (typeStr.includes("perspective") || typeStr.includes("commentary")) return "PR"
  if (typeStr.includes("short") || typeStr.includes("letter")) return "SC"
  if (typeStr.includes("editorial")) return "ED"
  return "RES"
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
  const seqNum = String(Math.floor(1 + Math.random() * 99)).padStart(2, "0")
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
    `1. Initial Quality Check: Our Editorial Office will conduct an initial formatting and ethical integrity check.`,
    `2. Handling Editor Assignment: An Associate Editor will be assigned to manage peer review.`,
    `3. Peer Review: Your manuscript will be evaluated by independent peer reviewers.`,
    ``,
    `You can track the progress of your peer review, view reviewer comments, and upload revisions anytime in our Editorial360 workspace:`,
    `https://scholarlyopen.org/editorial360?manuscriptId=${trackingId}`,
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
  await transporter.sendMail({
    from: smtpFrom,
    to: recipient,
    replyTo: authorEmail,
    subject,
    text,
    attachments,
  })

  // 2. Send automated confirmation email directly to the submitter/registrant's email
  try {
    await transporter.sendMail({
      from: smtpFrom,
      to: authorEmail,
      subject: authorConfirmationSubject,
      text: authorConfirmationText,
    })
  } catch (authorMailErr) {
    console.error("Failed to send author confirmation email:", authorMailErr)
  }

  return Response.json({ ok: true, trackingId })
}


