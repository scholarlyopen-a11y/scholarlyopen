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
      return "Engineering"
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
    recipient = process.env.SUBMISSIONS_TO ?? "scholarlyopen@gmail.com"
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
  const title = safeText(formData.get("title"), 240)
  const abstract = safeText(formData.get("abstract"), 12000)
  const agreed = safeText(formData.get("agreed"), 10)

  if (!firstName || !lastName || !authorEmail || !affiliation || !discipline || !title || !abstract) {
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

  const subject = `Manuscript submission: ${title} (${journalLabel(discipline)})`

  const text = [
    `Submission request via Scholarly Open website`,
    ``,
    `Corresponding author`,
    `- Name: ${[firstName, lastName].filter(Boolean).join(" ")}`,
    `- Email: ${authorEmail}`,
    `- Institution: ${affiliation}`,
    ``,
    `Manuscript`,
    `- Target journal: ${journalLabel(discipline)}`,
    `- Title: ${title}`,
    `- Abstract:`,
    abstract,
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

  await transporter.sendMail({
    from: smtpFrom,
    to: recipient,
    replyTo: authorEmail,
    subject,
    text,
    attachments,
  })

  return Response.json({ ok: true })
}

