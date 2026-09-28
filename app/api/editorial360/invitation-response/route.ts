export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

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
  affiliation?: string
  department?: string
  country?: string
  biography?: string
  photoUrl?: string
  cvFileName?: string
  cvFileSize?: string
  researchInterests?: string[]
  orcid?: string
  googleScholar?: string
  researchGate?: string
  linkedin?: string
  publications?: any[]
  hasAcceptedTerms?: boolean
  consentProfileUpload?: boolean
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

const EDITORS_FILE_PATH = path.join(process.cwd(), "lib", "data", "editorial-board-onboarding.json")
const REVIEWERS_FILE_PATH = path.join(process.cwd(), "lib", "data", "reviewer-records.json")
const SENT_FILE_PATH = path.join(process.cwd(), "lib", "data", "sent-invitations.json")

function updateSentInvitationStatus(candidateEmail: string, candidateName: string) {
  try {
    if (fs.existsSync(SENT_FILE_PATH)) {
      const raw = fs.readFileSync(SENT_FILE_PATH, "utf-8")
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed.sentInvitations)) {
        let matched = false
        parsed.sentInvitations = parsed.sentInvitations.map((item: any) => {
          const matchEmail = candidateEmail && item.recipientEmail && item.recipientEmail.toLowerCase() === candidateEmail.toLowerCase()
          const cleanCandName = (candidateName || "").replace(/^(Prof\.|Dr\.|Associate Prof\.|Assoc\.|Mr\.|Ms\.)\s*/i, "").trim().toLowerCase()
          const cleanRecipName = (item.recipientName || "").replace(/^(Prof\.|Dr\.|Associate Prof\.|Assoc\.|Mr\.|Ms\.)\s*/i, "").trim().toLowerCase()
          const matchName = cleanCandName.length > 2 && (cleanCandName.includes(cleanRecipName) || cleanRecipName.includes(cleanCandName))

          if (matchEmail || matchName) {
            matched = true
            return {
              ...item,
              status: "Accepted",
              acceptedAt: new Date().toISOString()
            }
          }
          return item
        })
        if (matched) {
          fs.writeFileSync(SENT_FILE_PATH, JSON.stringify(parsed, null, 2), "utf-8")
        }
      }
    }
  } catch (e) {
    console.error("Error updating sent invitation status:", e)
  }
}

function saveEditorToDisk(editor: any) {
  try {
    let list: any[] = []
    if (fs.existsSync(EDITORS_FILE_PATH)) {
      const raw = fs.readFileSync(EDITORS_FILE_PATH, "utf-8")
      const parsed = JSON.parse(raw)
      list = Array.isArray(parsed.onboardedEditors) ? parsed.onboardedEditors : []
    }
    const idx = list.findIndex(e => e.email && editor.email && e.email.toLowerCase() === editor.email.toLowerCase())
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...editor }
    } else {
      list.unshift(editor)
    }
    fs.writeFileSync(EDITORS_FILE_PATH, JSON.stringify({ onboardedEditors: list }, null, 2), "utf-8")
  } catch (e) {
    console.error("Error saving editor to disk:", e)
  }
}

function updateReviewerOnDisk(email: string, name: string, credId?: string) {
  try {
    if (fs.existsSync(REVIEWERS_FILE_PATH)) {
      const raw = fs.readFileSync(REVIEWERS_FILE_PATH, "utf-8")
      const parsed = JSON.parse(raw)
      let changed = false
      if (Array.isArray(parsed.tests)) {
        parsed.tests = parsed.tests.map((t: any) => {
          if (t.candidateEmail?.toLowerCase() === email.toLowerCase()) {
            changed = true
            return { ...t, status: "Passed - Account Active" }
          }
          return t
        })
      }
      if (Array.isArray(parsed.registeredReviewers)) {
        const existing = parsed.registeredReviewers.find((r: any) => r.email?.toLowerCase() === email.toLowerCase())
        if (!existing && email) {
          changed = true
          parsed.registeredReviewers.unshift({
            id: `REV-REG-${Date.now().toString().slice(-4)}`,
            name,
            email,
            status: "Active",
            activeTasks: 0,
            maxTasks: 3,
            matchScore: 95,
            specialization: "Academic Peer Review",
            discipline: "Sciences",
            institution: "Academic Institution",
            completedReviews: 0,
            onTimeRate: 100,
            credentialId: credId || "CERT-SO-2026-CLAIMED",
            keywords: ["peer review", "academic research"]
          })
        }
      }
      if (changed) {
        fs.writeFileSync(REVIEWERS_FILE_PATH, JSON.stringify(parsed, null, 2), "utf-8")
      }
    }
  } catch (e) {
    console.error("Error updating reviewer on disk:", e)
  }
}

export async function GET() {
  let diskResponses: InvitationResponseRecord[] = []
  try {
    if (fs.existsSync(EDITORS_FILE_PATH)) {
      const raw = fs.readFileSync(EDITORS_FILE_PATH, "utf-8")
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed.onboardedEditors)) {
        diskResponses = parsed.onboardedEditors.map((e: any) => ({
          id: e.id || `RESP-${Date.now()}`,
          type: (e.role && e.role.toLowerCase().includes("chief")) ? "eic" : (e.role && e.role.toLowerCase().includes("associate")) ? "ae" : "board",
          candidateName: e.name,
          candidateEmail: e.email,
          journal: e.journal,
          decision: "yes" as const,
          credentialId: e.id,
          timestamp: e.acceptedAt || new Date().toISOString(),
          notes: "Editorial Board Member onboarded via verified portal",
          affiliation: e.affiliation,
          department: e.department,
          country: e.country,
          biography: e.biography,
          photoUrl: e.photoUrl,
          cvFileName: e.cvFileName,
          cvFileSize: e.cvFileSize,
          researchInterests: e.researchInterests,
          orcid: e.orcid,
          googleScholar: e.googleScholar,
          linkedin: e.linkedin,
          hasAcceptedTerms: e.hasAcceptedTerms,
          consentProfileUpload: e.consentProfileUpload,
          jmApproved: Boolean(e.jmApproved),
          status: e.status || (e.jmApproved ? "Active Handling Editor" : "Pending JM Approval")
        }))
      }
    }
  } catch (err) {
    console.error("Error reading disk onboarded editors in GET:", err)
  }

  // Merge in-memory and disk records avoiding duplicates
  const combined = [...diskResponses]
  for (const resp of responseStore) {
    if (!combined.some(c => (c.candidateEmail && resp.candidateEmail && c.candidateEmail.toLowerCase() === resp.candidateEmail.toLowerCase()) || c.id === resp.id)) {
      combined.push(resp)
    }
  }

  return NextResponse.json({
    success: true,
    responses: combined,
    total: combined.length
  })
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const email = searchParams.get("email")

    if (!id && !email) {
      return NextResponse.json({ success: false, error: "ID or email required" }, { status: 400 })
    }

    // Clean in-memory
    responseStore = responseStore.filter(r => {
      if (id && r.id === id) return false
      if (email && r.candidateEmail && r.candidateEmail.toLowerCase() === email.toLowerCase()) return false
      return true
    })

    // Clean disk
    if (fs.existsSync(EDITORS_FILE_PATH)) {
      const raw = fs.readFileSync(EDITORS_FILE_PATH, "utf-8")
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed.onboardedEditors)) {
        parsed.onboardedEditors = parsed.onboardedEditors.filter((e: any) => {
          if (id && e.id === id) return false
          if (email && e.email && e.email.toLowerCase() === email.toLowerCase()) return false
          return true
        })
        fs.writeFileSync(EDITORS_FILE_PATH, JSON.stringify(parsed, null, 2), "utf-8")
      }
    }

    if (fs.existsSync(REVIEWERS_FILE_PATH)) {
      const raw = fs.readFileSync(REVIEWERS_FILE_PATH, "utf-8")
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed.registeredReviewers)) {
        parsed.registeredReviewers = parsed.registeredReviewers.filter((r: any) => {
          if (id && r.id === id) return false
          if (email && r.email && r.email.toLowerCase() === email.toLowerCase()) return false
          return true
        })
        fs.writeFileSync(REVIEWERS_FILE_PATH, JSON.stringify(parsed, null, 2), "utf-8")
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
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
      notes = "",
      affiliation = "",
      department = "",
      country = "",
      biography = "",
      photoUrl = "",
      cvFileName = "",
      cvFileSize = "",
      cvBase64 = "",
      researchInterests = [],
      orcid = "",
      googleScholar = "",
      researchGate = "",
      linkedin = "",
      publications = [],
      hasAcceptedTerms = true,
      consentProfileUpload = true
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
      notes: notes || `Action logged via editorial360 invitation link (${type}: ${decision})`,
      affiliation,
      department,
      country,
      biography,
      photoUrl,
      cvFileName,
      cvFileSize,
      researchInterests: Array.isArray(researchInterests) ? researchInterests : [],
      orcid,
      googleScholar,
      researchGate,
      linkedin,
      publications: Array.isArray(publications) ? publications : [],
      hasAcceptedTerms: !!hasAcceptedTerms,
      consentProfileUpload: !!consentProfileUpload
    }

    responseStore = [newRecord, ...responseStore]

    // Persist editor onboarding data
    if (type === "board" || type === "ae" || type === "eic") {
      saveEditorToDisk({
        id: `EBM-${Date.now().toString().slice(-4)}`,
        name: candidateName,
        email: candidateEmail,
        role: type === "eic" ? "Editor-in-Chief" : type === "ae" ? "Associate Editor" : "Editorial Board Member & Handling Editor",
        journal,
        journalSlug: journal.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        affiliation: affiliation || "Academic Institution",
        department,
        country,
        specialization: Array.isArray(researchInterests) && researchInterests.length > 0 ? researchInterests.join(", ") : "Academic Research",
        researchInterests: Array.isArray(researchInterests) ? researchInterests : [],
        biography,
        photoUrl,
        cvFileName,
        cvFileSize,
        orcid,
        googleScholar,
        researchGate,
        linkedin,
        publications: Array.isArray(publications) ? publications : [],
        hasAcceptedTerms: !!hasAcceptedTerms,
        consentProfileUpload: !!consentProfileUpload,
        status: "Pending JM Approval",
        jmApproved: false,
        acceptedAt: new Date().toISOString()
      })
      updateSentInvitationStatus(candidateEmail, candidateName)
    }

    // If reviewer claim, update reviewer on disk
    if (type === "reviewer_claim" && candidateEmail) {
      updateReviewerOnDisk(candidateEmail, candidateName, credentialId)
    }

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
          : "Editorial Board Member & Handling Editor"

        const subject = type === "reviewer_claim"
          ? `[${journal}] [Reviewer Gateway Active] ${candidateName} (${credentialId || "Certified"})`
          : `[${journal}] Editorial Board Acceptance: ${candidateName} (${roleLabel})`

        const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <div style="border-bottom: 3px solid #0b99ff; padding-bottom: 16px; margin-bottom: 20px;">
              <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #0b99ff; margin-bottom: 4px;">
                ${journal}
              </div>
              <h2 style="color: #0f172a; margin: 0 0 6px 0; font-size: 20px;">editorial360 Notification: Appointment & Profile Acceptance</h2>
              <span style="display: inline-block; background-color: #ecfdf5; color: #047857; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 9999px; border: 1px solid #a7f3d0;">
                Official Consent & Profile Submitted
              </span>
            </div>
            
            <p style="font-size: 14px; color: #334155; line-height: 1.7;">
              <strong>Scholar / Candidate:</strong> ${candidateName}<br>
              <strong>Email:</strong> ${candidateEmail || "Provided during activation"}<br>
              <strong>Role / Category:</strong> ${roleLabel}<br>
              <strong>Journal Portfolio:</strong> ${journal}<br>
              <strong>Affiliation:</strong> ${affiliation || "Academic Institution"}${department ? ` (${department})` : ""}${country ? `, ${country}` : ""}<br>
              ${orcid ? `<strong>ORCID iD:</strong> <a href="https://orcid.org/${orcid}" style="color: #0b99ff;">${orcid}</a><br>` : ""}
              ${cvFileName ? `<strong>Uploaded CV:</strong> ${cvFileName} (${cvFileSize || "Uploaded"})<br>` : ""}
              ${photoUrl ? `<strong>Photo:</strong> High-resolution profile photo attached<br>` : ""}
              ${Array.isArray(researchInterests) && researchInterests.length > 0 ? `<strong>Research Interests:</strong> ${researchInterests.join(", ")}<br>` : ""}
              <strong>Decision / Action:</strong> ${decision.toUpperCase()}<br>
              ${credentialId ? `<strong>Credential ID:</strong> ${credentialId}<br>` : ""}
              <strong>Website Profile Upload Consent:</strong> ${consentProfileUpload ? "Granted (GDPR Compliant)" : "Pending"}<br>
              <strong>Terms Accepted:</strong> ${hasAcceptedTerms ? "Yes (COPE & Rigor Standards)" : "No"}<br>
              <strong>Timestamp:</strong> ${new Date().toUTCString()}
            </p>

            ${biography ? `
              <div style="background-color: #f8fafc; border-left: 3px solid #0b99ff; padding: 12px 16px; margin: 16px 0; border-radius: 0 8px 8px 0;">
                <strong style="color: #1e293b; font-size: 13px;">Academic Biography:</strong>
                <p style="color: #475569; font-size: 13px; line-height: 1.6; margin: 6px 0 0 0;">${biography}</p>
              </div>
            ` : ""}

            <div style="background-color: #f1f5f9; padding: 12px; border-radius: 8px; font-size: 12px; color: #64748b; margin-top: 20px;">
              This record has been synchronized into the editorial360 Handling Editor & Reviewer registry and is ready for assignment in the Journal Manager desk.
            </div>
          </div>
        `

        const attachments: any[] = []
        if (cvBase64) {
          try {
            const rawBase64 = cvBase64.includes(";base64,") ? cvBase64.split(";base64,")[1] : cvBase64
            attachments.push({
              filename: cvFileName || `${candidateName.replace(/[^a-zA-Z0-9]/g, '_')}_CV.pdf`,
              content: Buffer.from(rawBase64, "base64")
            })
          } catch (attErr) {
            console.warn("Could not encode CV attachment:", attErr)
          }
        }

        await transporter.sendMail({
          from: `"editorial360 Notifications" <${from}>`,
          to: "info@scholarlyopen.org",
          replyTo: candidateEmail || "info@scholarlyopen.org",
          subject,
          html: htmlContent,
          attachments
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

