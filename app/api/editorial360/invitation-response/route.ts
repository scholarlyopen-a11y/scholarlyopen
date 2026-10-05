export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { getStoredDisapproved, saveStoredDisapproved, DisapprovedCandidateRecord } from "../disapproved-candidates/route"
import { getJournalReplyTo } from "@/lib/data/journal-contacts"

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
  status?: string
  jmApproved?: boolean
  watchlistFlagged?: boolean
  flagReason?: string
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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wrccglyypgxtuikrupkh.supabase.co"
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyY2NnbHl5cGd4dHVpa3J1cGtoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODg2NjUzNSwiZXhwIjoyMTA0NDQyNTM1fQ.H6xldZUHFnoTUajtmGdoI_E59cDh3xEADVzPiUj0L2Y"
const BUCKET = "editorial360_data"
const RESPONSES_FILE = "invitation-responses.json"
const EDITORS_FILE = "editorial-board-onboarding.json"
const REVIEWERS_FILE = "reviewer-records.json"
const SENT_FILE = "sent-invitations.json"

const EDITORS_FILE_PATH = path.join(process.cwd(), "lib", "data", "editorial-board-onboarding.json")
const REVIEWERS_FILE_PATH = path.join(process.cwd(), "lib", "data", "reviewer-records.json")
const SENT_FILE_PATH = path.join(process.cwd(), "lib", "data", "sent-invitations.json")
const LOCAL_RESPONSES_PATH = path.join(process.cwd(), "lib", "data", "invitation-responses.json")

async function getStoredResponses(): Promise<InvitationResponseRecord[]> {
  // 1. Try Supabase Cloud Storage (primary)
  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${RESPONSES_FILE}?t=${Date.now()}`, {
      cache: "no-store"
    })
    if (res.ok) {
      const data = await res.json()
      if (data && Array.isArray(data.responses)) {
        return data.responses
      }
    }
  } catch (e) {
    console.warn("Supabase fetch invitation-responses warning:", e)
  }

  // 2. Fallback to local file
  try {
    if (fs.existsSync(LOCAL_RESPONSES_PATH)) {
      const raw = fs.readFileSync(LOCAL_RESPONSES_PATH, "utf-8")
      const parsed = JSON.parse(raw)
      if (parsed && Array.isArray(parsed.responses)) {
        return parsed.responses
      }
    }
  } catch (e) {}

  return responseStore
}

async function saveStoredResponses(responses: InvitationResponseRecord[]): Promise<boolean> {
  let ok = false
  // 1. Save to Supabase Cloud Storage
  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${RESPONSES_FILE}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        "x-upsert": "true"
      },
      body: JSON.stringify({ responses, lastUpdated: new Date().toISOString() })
    })
    ok = res.ok
  } catch (e) {
    console.error("Supabase save invitation-responses error:", e)
  }

  // 2. Save locally for dev fallback
  try {
    const dir = path.dirname(LOCAL_RESPONSES_PATH)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(LOCAL_RESPONSES_PATH, JSON.stringify({ responses }, null, 2), "utf-8")
  } catch (e) {}

  return ok
}

async function getStoredEditors(): Promise<any[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${EDITORS_FILE}?t=${Date.now()}`, { cache: "no-store" })
    if (res.ok) {
      const parsed = await res.json()
      if (parsed && Array.isArray(parsed.onboardedEditors)) return parsed.onboardedEditors
    }
  } catch (e) {}
  try {
    if (fs.existsSync(EDITORS_FILE_PATH)) {
      const raw = fs.readFileSync(EDITORS_FILE_PATH, "utf-8")
      const parsed = JSON.parse(raw)
      if (parsed && Array.isArray(parsed.onboardedEditors)) return parsed.onboardedEditors
    }
  } catch (e) {}
  return []
}

async function saveEditorToCloud(editor: any) {
  try {
    const list = await getStoredEditors()
    const idx = list.findIndex(e => e.email && editor.email && e.email.toLowerCase() === editor.email.toLowerCase())
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...editor }
    } else {
      list.unshift(editor)
    }
    await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${EDITORS_FILE}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        "x-upsert": "true"
      },
      body: JSON.stringify({ onboardedEditors: list, lastUpdated: new Date().toISOString() })
    })
    try {
      fs.writeFileSync(EDITORS_FILE_PATH, JSON.stringify({ onboardedEditors: list }, null, 2), "utf-8")
    } catch {}
  } catch (e) {
    console.error("Error saving editor to cloud:", e)
  }
}

async function updateSentInvitationStatus(candidateEmail: string, candidateName: string) {
  try {
    let sentList: any[] = []
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${SENT_FILE}?t=${Date.now()}`, { cache: "no-store" })
    if (res.ok) {
      const parsed = await res.json()
      if (parsed && Array.isArray(parsed.sentInvitations)) sentList = parsed.sentInvitations
    }
    if (sentList.length === 0 && fs.existsSync(SENT_FILE_PATH)) {
      const raw = fs.readFileSync(SENT_FILE_PATH, "utf-8")
      const parsed = JSON.parse(raw)
      if (parsed && Array.isArray(parsed.sentInvitations)) sentList = parsed.sentInvitations
    }

    let matched = false
    sentList = sentList.map((item: any) => {
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
      await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${SENT_FILE}`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          "Content-Type": "application/json",
          "x-upsert": "true"
        },
        body: JSON.stringify({ sentInvitations: sentList, lastUpdated: new Date().toISOString() })
      })
      try {
        fs.writeFileSync(SENT_FILE_PATH, JSON.stringify({ sentInvitations: sentList }, null, 2), "utf-8")
      } catch {}
    }
  } catch (e) {
    console.error("Error updating sent invitation status in cloud:", e)
  }
}

async function updateReviewerInCloud(email: string, name: string, credId?: string, isApproved = false) {
  try {
    let recs: { tests: any[]; registeredReviewers: any[] } = { tests: [], registeredReviewers: [] }
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${REVIEWERS_FILE}?t=${Date.now()}`, { cache: "no-store" })
    if (res.ok) {
      const parsed = await res.json()
      if (parsed) {
        recs.tests = Array.isArray(parsed.tests) ? parsed.tests : []
        recs.registeredReviewers = Array.isArray(parsed.registeredReviewers) ? parsed.registeredReviewers : []
      }
    }
    if (recs.tests.length === 0 && fs.existsSync(REVIEWERS_FILE_PATH)) {
      const raw = fs.readFileSync(REVIEWERS_FILE_PATH, "utf-8")
      const parsed = JSON.parse(raw)
      recs.tests = Array.isArray(parsed.tests) ? parsed.tests : []
      recs.registeredReviewers = Array.isArray(parsed.registeredReviewers) ? parsed.registeredReviewers : []
    }

    let changed = false
    recs.tests = recs.tests.map((t: any) => {
      if (t.candidateEmail?.toLowerCase() === email.toLowerCase()) {
        changed = true
        return { ...t, status: isApproved ? "Passed - Account Active" : "Pending JM Approval", jmApproved: isApproved }
      }
      return t
    })

    if (isApproved) {
      const existing = recs.registeredReviewers.find((r: any) => r.email?.toLowerCase() === email.toLowerCase())
      if (!existing && email) {
        changed = true
        recs.registeredReviewers.unshift({
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
      await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${REVIEWERS_FILE}`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          "Content-Type": "application/json",
          "x-upsert": "true"
        },
        body: JSON.stringify({ ...recs, lastUpdated: new Date().toISOString() })
      })
      try {
        fs.writeFileSync(REVIEWERS_FILE_PATH, JSON.stringify(recs, null, 2), "utf-8")
      } catch {}
    }
  } catch (e) {
    console.error("Error updating reviewer in cloud:", e)
  }
}

export async function GET() {
  const [cloudResponses, editors] = await Promise.all([
    getStoredResponses(),
    getStoredEditors()
  ])

  const editorResponses: InvitationResponseRecord[] = editors.map((e: any) => ({
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

  // Merge responses without duplicates
  const combined = [...cloudResponses]
  for (const er of editorResponses) {
    if (!combined.some(c => (c.candidateEmail && er.candidateEmail && c.candidateEmail.toLowerCase() === er.candidateEmail.toLowerCase()) || c.id === er.id)) {
      combined.push(er)
    }
  }

  // Ensure every response has a clean, non-empty credentialId
  const normalizedResponses = combined.map(r => {
    let credId = (r.credentialId || "").trim()
    if (!credId) {
      if (r.candidateName && r.candidateName.toLowerCase().includes("verpoort")) {
        credId = "EBM-VERPOORT"
      } else if (r.candidateName && r.candidateName.toLowerCase().includes("cacciola")) {
        credId = "EBM-CACCIOLA"
      } else if (r.type === "reviewer_claim") {
        credId = `SO-REV-2026-${(r.id || "").replace(/[^a-zA-Z0-9]/g, "").slice(-4).toUpperCase() || "CLAIMED"}`
      } else {
        const cleanName = (r.candidateName || "EDITOR")
          .replace(/^(Prof\.|Dr\.|Associate Prof\.|Assoc\.|Mr\.|Ms\.)\s*/i, "")
          .trim()
          .split(" ")[0]
          .replace(/[^a-zA-Z0-9]/g, "")
          .toUpperCase()
        credId = `EBM-${cleanName || "2026"}`
      }
    }
    return { ...r, credentialId: credId }
  })

  return NextResponse.json({
    success: true,
    responses: normalizedResponses,
    total: normalizedResponses.length
  })
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { id, candidateEmail, email, jmApproved, status, action, reason, notes } = body
    const targetEmail = (candidateEmail || email || "").toLowerCase().trim()

    let responses = await getStoredResponses()
    let updated = false
    let targetRecord: any = null

    const isDisapproving = status === "Disapproved - Access Blocked" || status === "Rejected" || action === "disapprove" || (jmApproved === false && status === "Disapproved")

    responses = responses.map(r => {
      const matchEmail = targetEmail && r.candidateEmail && r.candidateEmail.toLowerCase() === targetEmail
      const matchId = id && r.id === id
      if (matchEmail || matchId) {
        updated = true
        targetRecord = r
        let nextApproved = jmApproved !== undefined ? jmApproved : !r.jmApproved
        let nextStatus = status || (nextApproved ? (r.type === "reviewer_claim" ? "Active Referee" : "Active Handling Editor") : "Pending JM Approval")

        if (isDisapproving) {
          nextApproved = false
          nextStatus = "Disapproved - Access Blocked"
        }

        return {
          ...r,
          jmApproved: nextApproved,
          status: nextStatus,
          watchlistFlagged: isDisapproving ? true : r.watchlistFlagged,
          flagReason: isDisapproving ? (reason || "Disapproved by Journal Manager") : r.flagReason
        }
      }
      return r
    })

    if (updated) {
      await saveStoredResponses(responses)
      if (targetEmail) {
        await updateReviewerInCloud(targetEmail, "", undefined, isDisapproving ? false : Boolean(jmApproved))
      }

      if (targetRecord && isDisapproving) {
        const currentWatchlist = await getStoredDisapproved()
        const filtered = currentWatchlist.filter(d => d.email.toLowerCase() !== targetRecord.candidateEmail.toLowerCase())
        await saveStoredDisapproved([
          {
            id: `WATCH-${Date.now().toString().slice(-6)}`,
            name: targetRecord.candidateName,
            email: targetRecord.candidateEmail.toLowerCase(),
            orcid: targetRecord.orcid,
            institution: targetRecord.affiliation,
            credentialId: targetRecord.credentialId,
            disapprovedAt: new Date().toISOString(),
            disapprovedBy: "Journal Manager",
            status: "Disapproved",
            reason: reason || "Disapproved by Journal Manager",
            notes: notes || undefined
          },
          ...filtered
        ])
      }
    }

    return NextResponse.json({ success: true, responses })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const email = searchParams.get("email")?.toLowerCase().trim()

    if (!id && !email) {
      return NextResponse.json({ success: false, error: "ID or email required" }, { status: 400 })
    }

    // Clean cloud responses & save to watchlist
    let responses = await getStoredResponses()
    let removedRecord: any = null

    responses = responses.filter(r => {
      const matchId = id && r.id === id
      const matchEmail = email && r.candidateEmail && r.candidateEmail.toLowerCase() === email
      if (matchId || matchEmail) {
        removedRecord = r
        return false
      }
      return true
    })
    await saveStoredResponses(responses)

    // Clean editors
    const editors = (await getStoredEditors()).filter(e => {
      if (id && e.id === id) return false
      if (email && e.email && e.email.toLowerCase() === email) return false
      return true
    })
    await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${EDITORS_FILE}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        "x-upsert": "true"
      },
      body: JSON.stringify({ onboardedEditors: editors, lastUpdated: new Date().toISOString() })
    })

    // Retain purged candidate on integrity watchlist so future attempts are caught
    if (removedRecord && removedRecord.candidateEmail) {
      const currentWatchlist = await getStoredDisapproved()
      const exists = currentWatchlist.some(w => w.email.toLowerCase() === removedRecord.candidateEmail.toLowerCase())
      if (!exists) {
        await saveStoredDisapproved([
          {
            id: `WATCH-${Date.now().toString().slice(-6)}`,
            name: removedRecord.candidateName,
            email: removedRecord.candidateEmail.toLowerCase(),
            orcid: removedRecord.orcid,
            institution: removedRecord.affiliation,
            credentialId: removedRecord.credentialId,
            disapprovedAt: new Date().toISOString(),
            disapprovedBy: "Journal Manager",
            status: "Purged / Watchlisted",
            reason: "Purged from active onboarding desk by Journal Manager",
            notes: "Automatic retention on integrity watchlist following record purge"
          },
          ...currentWatchlist
        ])
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

    // Mandatory checks for editorial board onboarding
    if (type === "eic" || type === "ae" || type === "board") {
      if (!biography || biography.trim().length < 50) {
        return NextResponse.json({ 
          success: false, 
          error: "Academic Biography (minimum 50 characters) is required for editorial board appointment." 
        }, { status: 400 })
      }
      if (!cvFileName && !cvBase64) {
        return NextResponse.json({ 
          success: false, 
          error: "A Curriculum Vitae (CV) document (PDF or DOCX) is mandatory for editorial board appointment." 
        }, { status: 400 })
      }
    }

    const cleanEmail = (candidateEmail || "").trim().toLowerCase()
    const cleanOrcid = (orcid || "").trim()

    const disapprovedList = await getStoredDisapproved()
    const matchDisapproved = disapprovedList.find(d => 
      (d.email && d.email.toLowerCase() === cleanEmail) || 
      (cleanOrcid && d.orcid && d.orcid === cleanOrcid)
    )

    const initialStatus = matchDisapproved
      ? "Disapproved - Access Blocked"
      : (type === "reviewer_claim" ? "Pending JM Vetting" : "Pending JM Approval")

    const newRecord: InvitationResponseRecord = {
      id: `RESP-${Date.now().toString().slice(-4)}`,
      type,
      candidateName,
      candidateEmail: cleanEmail,
      journal,
      decision: matchDisapproved ? "no" : decision,
      credentialId,
      timestamp: new Date().toISOString(),
      notes: matchDisapproved
        ? "⚠️ INTEGRITY ALERT: Candidate on watchlist (Previously Disapproved by Journal Manager)."
        : (notes || `Action logged via editorial360 invitation link (${type}: ${decision})`),
      affiliation,
      department,
      country,
      biography,
      photoUrl,
      cvFileName,
      cvFileSize,
      researchInterests: Array.isArray(researchInterests) ? researchInterests : [],
      orcid: cleanOrcid,
      googleScholar,
      researchGate,
      linkedin,
      publications: Array.isArray(publications) ? publications : [],
      hasAcceptedTerms: !!hasAcceptedTerms,
      consentProfileUpload: !!consentProfileUpload,
      status: initialStatus,
      jmApproved: false,
      watchlistFlagged: Boolean(matchDisapproved),
      flagReason: matchDisapproved ? `Flagged on Integrity Watchlist: Previously Disapproved on ${new Date(matchDisapproved.disapprovedAt).toLocaleDateString()}` : undefined
    }

    responseStore = [newRecord, ...responseStore]

    // 1. Persist response in Supabase Cloud Storage
    try {
      const currentResponses = await getStoredResponses()
      const filtered = currentResponses.filter(r => {
        if (candidateEmail && r.candidateEmail && r.candidateEmail.toLowerCase() === candidateEmail.toLowerCase()) return false
        return true
      })
      await saveStoredResponses([newRecord, ...filtered])
    } catch (saveErr) {
      console.error("Failed to save response to Supabase:", saveErr)
    }

    // 2. Persist editor onboarding data
    if (type === "board" || type === "ae" || type === "eic") {
      await saveEditorToCloud({
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
      await updateSentInvitationStatus(candidateEmail, candidateName)
    }

    // 3. If reviewer claim, update reviewer in Supabase
    if (type === "reviewer_claim" && candidateEmail) {
      await updateReviewerInCloud(candidateEmail, candidateName, credentialId, false)
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
              ${orcid ? `<strong>ORCID iD:</strong> <a href="https://orcid.org/${orcid}" style="color: #0b99ff;" target="_blank">${orcid}</a><br>` : ""}
              ${googleScholar ? `<strong>Google Scholar:</strong> <a href="${googleScholar}" style="color: #0b99ff;" target="_blank">${googleScholar}</a><br>` : ""}
              ${cvFileName ? `<strong>Uploaded CV:</strong> <span style="font-weight: bold; color: #0f172a;">${cvFileName}</span> (${cvFileSize || "Attached"})<br>` : ""}
              ${Array.isArray(researchInterests) && researchInterests.length > 0 ? `<strong>Research Interests:</strong> <span style="color: #0b99ff; font-weight: 600;">${researchInterests.join(", ")}</span><br>` : ""}
              <strong>Decision / Action:</strong> ${decision.toUpperCase()}<br>
              ${credentialId ? `<strong>Credential ID:</strong> ${credentialId}<br>` : ""}
              <strong>Website Profile Upload Consent:</strong> ${consentProfileUpload ? "Granted (GDPR Compliant)" : "Pending"}<br>
              <strong>Terms Accepted:</strong> ${hasAcceptedTerms ? "Yes (COPE & Rigor Standards)" : "No"}<br>
              <strong>Timestamp:</strong> ${new Date().toUTCString()}
            </p>

            ${photoUrl ? `
              <div style="margin: 16px 0; padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; display: inline-block;">
                <strong style="display: block; margin-bottom: 8px; font-size: 12px; color: #1e293b;">Candidate Profile Photo:</strong>
                <img src="${photoUrl}" alt="${candidateName}" style="width: 130px; height: 130px; object-fit: cover; border-radius: 8px; border: 2px solid #0b99ff; display: block;" />
              </div>
            ` : ""}

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

        const targetJournalEmail = getJournalReplyTo(journal)
        await transporter.sendMail({
          from: `"editorial360 Notifications" <${from}>`,
          to: "info@scholarlyopen.org",
          cc: `scholarlyopen@gmail.com, ${targetJournalEmail}`,
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

