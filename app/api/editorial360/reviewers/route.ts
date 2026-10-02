export const runtime = "nodejs"

import { NextResponse } from "next/server"

export interface ReviewerHistoryItem {
  id: string
  paperId: string
  paperTitle?: string
  journal?: string
  reviewerName: string
  reviewerEmail: string
  invitedDate: string
  status: "Invited" | "Accepted" | "Declined" | "Completed"
  deadline?: string
  declineReason?: string
  declineReferral?: string
  respondedAt?: string
  // Reviewer Recognition & Incentives
  pointsAwarded?: number
  qualityRating?: number
  timeliness?: "on_time" | "early" | "delayed"
  incentiveType?: "apc_waiver_25" | "apc_waiver_50" | "certificate" | "honorarium"
  voucherCode?: string
  editorCommendation?: string
  awardedAt?: string
  awardedBy?: string
}

// In-memory store for reviewer invitations dispatched during active session (seeded with active records)
const DEFAULT_REVIEWER_HISTORY: ReviewerHistoryItem[] = [
  {
    id: "REV-HIST-PN-01",
    paperId: "SOMED-26-RW01",
    paperTitle: "Prevent Earlier, Recognize Sooner, Treat Faster: An Evidence-Based Healthcare Operations Approach to Acute Aortic Dissection",
    journal: "Scholarly Open: Medicine",
    reviewerName: "Dr. Praveen Nagula",
    reviewerEmail: "drpraveennagula@gmail.com",
    invitedDate: "2026-08-15",
    status: "Completed",
    deadline: "2026-08-29",
    respondedAt: "2026-08-28"
  },
  {
    id: "REV-HIST-RA-02",
    paperId: "SOMED-26-RW01",
    paperTitle: "Prevent Earlier, Recognize Sooner, Treat Faster: An Evidence-Based Healthcare Operations Approach to Acute Aortic Dissection",
    journal: "Scholarly Open: Medicine",
    reviewerName: "Dr. Ragab Aziza",
    reviewerEmail: "ragabaziza61@gmail.com",
    invitedDate: "2026-08-15",
    status: "Accepted",
    deadline: "2026-08-29",
    respondedAt: "2026-08-16"
  },
  {
    id: "REV-HIST-GB-03",
    paperId: "SOMED-26-RW01",
    paperTitle: "Prevent Earlier, Recognize Sooner, Treat Faster: An Evidence-Based Healthcare Operations Approach to Acute Aortic Dissection",
    journal: "Scholarly Open: Medicine",
    reviewerName: "Guo B",
    reviewerEmail: "guo.baolei@zs-hospital.sh.cn",
    invitedDate: "2026-10-01",
    status: "Invited",
    deadline: "2026-10-15"
  },
  {
    id: "REV-HIST-BS-04",
    paperId: "SOMED-26-RW01",
    paperTitle: "Prevent Earlier, Recognize Sooner, Treat Faster: An Evidence-Based Healthcare Operations Approach to Acute Aortic Dissection",
    journal: "Scholarly Open: Medicine",
    reviewerName: "Bokhari S",
    reviewerEmail: "bokharsa@rwjms.rutgers.edu",
    invitedDate: "2026-10-01",
    status: "Invited",
    deadline: "2026-10-15"
  },
  {
    id: "REV-HIST-QL-05",
    paperId: "SOMED-26-RW01",
    paperTitle: "Prevent Earlier, Recognize Sooner, Treat Faster: An Evidence-Based Healthcare Operations Approach to Acute Aortic Dissection",
    journal: "Scholarly Open: Medicine",
    reviewerName: "Quéro L",
    reviewerEmail: "laurent.quero@aphp.fr",
    invitedDate: "2026-10-01",
    status: "Invited",
    deadline: "2026-10-15"
  },
  {
    id: "REV-HIST-PL-06",
    paperId: "SOMED-26-RW01",
    paperTitle: "Prevent Earlier, Recognize Sooner, Treat Faster: An Evidence-Based Healthcare Operations Approach to Acute Aortic Dissection",
    journal: "Scholarly Open: Medicine",
    reviewerName: "Pezzi L",
    reviewerEmail: "reviewer@scholarlyopen.org",
    invitedDate: "2026-10-01",
    status: "Invited",
    deadline: "2026-10-15"
  },
  {
    id: "REV-HIST-WX-07",
    paperId: "SOMED-26-RW01",
    paperTitle: "Prevent Earlier, Recognize Sooner, Treat Faster: An Evidence-Based Healthcare Operations Approach to Acute Aortic Dissection",
    journal: "Scholarly Open: Medicine",
    reviewerName: "Wang X",
    reviewerEmail: "wxiaozeng@163.com",
    invitedDate: "2026-10-01",
    status: "Invited",
    deadline: "2026-10-15"
  },
  {
    id: "REV-HIST-WB-08",
    paperId: "SOMED-26-RW01",
    paperTitle: "Prevent Earlier, Recognize Sooner, Treat Faster: An Evidence-Based Healthcare Operations Approach to Acute Aortic Dissection",
    journal: "Scholarly Open: Medicine",
    reviewerName: "Wang B",
    reviewerEmail: "wangbindl@hotmail.com",
    invitedDate: "2026-10-01",
    status: "Invited",
    deadline: "2026-10-15"
  },
  {
    id: "REV-HIST-ZW-09",
    paperId: "SOMED-26-RW01",
    paperTitle: "Prevent Earlier, Recognize Sooner, Treat Faster: An Evidence-Based Healthcare Operations Approach to Acute Aortic Dissection",
    journal: "Scholarly Open: Medicine",
    reviewerName: "Zhong W",
    reviewerEmail: "wuzhong71@scu.edu.cn",
    invitedDate: "2026-10-01",
    status: "Invited",
    deadline: "2026-10-15"
  },
  {
    id: "REV-HIST-YS-10",
    paperId: "SOMED-26-RW01",
    paperTitle: "Prevent Earlier, Recognize Sooner, Treat Faster: An Evidence-Based Healthcare Operations Approach to Acute Aortic Dissection",
    journal: "Scholarly Open: Medicine",
    reviewerName: "Yidan Sun",
    reviewerEmail: "yidan.sun@wustl.edu",
    invitedDate: "2026-10-01",
    status: "Invited",
    deadline: "2026-10-15"
  },
  {
    id: "REV-HIST-PDL-11",
    paperId: "SOMED-26-RW01",
    paperTitle: "Prevent Earlier, Recognize Sooner, Treat Faster: An Evidence-Based Healthcare Operations Approach to Acute Aortic Dissection",
    journal: "Scholarly Open: Medicine",
    reviewerName: "P. de Leeuw",
    reviewerEmail: "p.deleeuw@mumc.nl",
    invitedDate: "2026-10-01",
    status: "Invited",
    deadline: "2026-10-15"
  },
  {
    id: "REV-HIST-CD-12",
    paperId: "SOMED-26-RW01",
    paperTitle: "Prevent Earlier, Recognize Sooner, Treat Faster: An Evidence-Based Healthcare Operations Approach to Acute Aortic Dissection",
    journal: "Scholarly Open: Medicine",
    reviewerName: "Claire Dupond",
    reviewerEmail: "claire.dupond@sorbonne-universite.fr",
    invitedDate: "2026-10-01",
    status: "Invited",
    deadline: "2026-10-15"
  }
]

const globalReviewerHistory: ReviewerHistoryItem[] = [...DEFAULT_REVIEWER_HISTORY]

import fs from "fs"
import path from "path"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wrccglyypgxtuikrupkh.supabase.co"
const BUCKET = "editorial360_data"
const FILE_PATH = "reviewer-records.json"
const RECORDS_FILE_PATH = path.join(process.cwd(), "lib", "data", "reviewer-records.json")

async function getRegisteredReviewers(): Promise<any[]> {
  // 1. Try Supabase Cloud Storage
  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${FILE_PATH}?t=${Date.now()}`, {
      cache: "no-store"
    })
    if (res.ok) {
      const parsed = await res.json()
      if (parsed && Array.isArray(parsed.registeredReviewers)) {
        return parsed.registeredReviewers
      }
    }
  } catch (e) {
    console.warn("Supabase fetch registeredReviewers warning:", e)
  }

  // 2. Fallback to local file
  try {
    if (fs.existsSync(RECORDS_FILE_PATH)) {
      const raw = fs.readFileSync(RECORDS_FILE_PATH, "utf-8")
      const parsed = JSON.parse(raw)
      if (parsed && Array.isArray(parsed.registeredReviewers)) {
        return parsed.registeredReviewers
      }
    }
  } catch (e) {
    console.error("Error reading registeredReviewers:", e)
  }
  return []
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const paperId = searchParams.get("paperId")
    const email = searchParams.get("email")

    let results = [...globalReviewerHistory]

    // Read persistent sent review invitations from Supabase storage / local file
    try {
      let sentList: any[] = []
      const res = await fetch(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/sent-invitations.json?t=${Date.now()}`, { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        if (data && Array.isArray(data.sentInvitations)) {
          sentList = data.sentInvitations
        }
      } else {
        const localSentPath = path.join(process.cwd(), "lib", "data", "sent-invitations.json")
        if (fs.existsSync(localSentPath)) {
          const parsed = JSON.parse(fs.readFileSync(localSentPath, "utf-8"))
          if (Array.isArray(parsed?.sentInvitations)) sentList = parsed.sentInvitations
        }
      }

      for (const s of sentList) {
        // Exclude all non-review outreach campaigns (EiC, Editorial Board, Associate Editor, Authors, ECR Masterclass, etc.)
        const isNonReview = 
          s.campaignType === "eic" ||
          s.campaignType === "ebm" ||
          s.campaignType === "board" ||
          s.campaignType === "associate_editor" ||
          s.campaignType === "call_for_papers" ||
          s.campaignType === "author" ||
          s.campaignType === "ecr_masterclass" ||
          s.campaignType === "ecr_author_waiver" ||
          (s.subject && (
            s.subject.toLowerCase().includes("editor-in-chief") ||
            s.subject.toLowerCase().includes("leadership appointment") ||
            s.subject.toLowerCase().includes("editorial board") ||
            s.subject.toLowerCase().includes("associate editor") ||
            s.subject.toLowerCase().includes("call for papers") ||
            s.subject.toLowerCase().includes("waiver")
          ))

        if (isNonReview) continue

        // Must be an explicit reviewer invitation
        const isReviewInv = 
          s.campaignType === "reviewer_invitation" || 
          s.campaignType === "reviewer" ||
          s.campaignType === "ecr_reviewer" ||
          (s.subject && s.subject.toLowerCase().includes("review invitation"))

        // Must have an explicit manuscript ID associated with it (NEVER fallback to SOMED-26-RW01)
        const matchPid = (s.paperId && s.paperId !== "SO-POOL-2026" ? s.paperId : null) || 
          (s.subject ? s.subject.match(/([A-Z]{3,5}-\d{2}-[A-Z0-9]+)/)?.[1] : null)

        if (isReviewInv && matchPid && s.recipientName && s.recipientEmail) {
          const exists = results.some(r => 
            r.reviewerEmail.toLowerCase() === s.recipientEmail.toLowerCase() &&
            r.paperId.toLowerCase() === matchPid.toLowerCase()
          )
          if (!exists) {
            results.push({
              id: s.id || `SENT-REV-${Date.now()}-${s.recipientEmail}`,
              paperId: matchPid,
              paperTitle: s.paperTitle || s.subject?.split(" - ")?.[1] || "Manuscript",
              journal: s.journal || "Scholarly Open",
              reviewerName: s.recipientName,
              reviewerEmail: s.recipientEmail,
              invitedDate: s.timestamp ? s.timestamp.split("T")[0] : "2026-10-01",
              status: "Invited",
              deadline: "2026-10-15"
            })
          }
        }
      }
    } catch (e) {
      console.warn("Could not sync sent invitations in reviewers route:", e)
    }

    if (paperId) {
      const pid = paperId.toLowerCase().trim()
      results = results.filter(r => {
        const rPid = r.paperId.toLowerCase().trim()
        return rPid === pid || 
          (pid.includes("rw01") && rPid.includes("rw01")) ||
          (pid.includes("rw820") && (rPid.includes("rw820") || rPid.includes("rw01")))
      })
    }
    if (email) {
      results = results.filter(r => r.reviewerEmail.toLowerCase() === email.toLowerCase())
    }

    const registeredReviewers = await getRegisteredReviewers()

    return NextResponse.json({ ok: true, history: results, registeredReviewers })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { paperId, paperTitle, journal, reviewerName, reviewerEmail } = body

    if (!paperId || !reviewerName || !reviewerEmail) {
      return NextResponse.json({ ok: false, error: "Missing required invitation fields." }, { status: 400 })
    }

    // Check if entry already exists
    const existingIndex = globalReviewerHistory.findIndex(
      r => r.paperId.toLowerCase() === paperId.toLowerCase() && r.reviewerEmail.toLowerCase() === reviewerEmail.toLowerCase()
    )

    const deadlineDate = new Date()
    deadlineDate.setDate(deadlineDate.getDate() + 14)
    const deadlineStr = deadlineDate.toISOString().split("T")[0]
    const todayStr = new Date().toISOString().split("T")[0]

    const newRecord: ReviewerHistoryItem = {
      id: `REV-HIST-${Date.now()}`,
      paperId,
      paperTitle: paperTitle || "Manuscript",
      journal: journal || "Scholarly Open",
      reviewerName,
      reviewerEmail,
      invitedDate: todayStr,
      status: "Invited",
      deadline: deadlineStr
    }

    if (existingIndex >= 0) {
      globalReviewerHistory[existingIndex] = {
        ...globalReviewerHistory[existingIndex],
        ...newRecord,
        status: "Invited",
        invitedDate: todayStr
      }
    } else {
      globalReviewerHistory.unshift(newRecord)
    }

    // Persist to Supabase Cloud Storage sent-invitations.json
    try {
      const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyY2NnbHl5cGd4dHVpa3J1cGtoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODg2NjUzNSwiZXhwIjoyMTA0NDQyNTM1fQ.H6xldZUHFnoTUajtmGdoI_E59cDh3xEADVzPiUj0L2Y"
      const sentItem = {
        id: newRecord.id,
        recipientName: reviewerName,
        recipientEmail: reviewerEmail,
        paperId: paperId,
        paperTitle: paperTitle || "Manuscript",
        journal: journal || "Scholarly Open",
        subject: `Review Invitation: ${paperId} - ${paperTitle || "Manuscript"}`,
        campaignType: "reviewer_invitation",
        timestamp: new Date().toISOString(),
        status: "Delivered"
      }
      
      const getRes = await fetch(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/sent-invitations.json?t=${Date.now()}`, { cache: "no-store" })
      let currentSent: any[] = []
      if (getRes.ok) {
        const d = await getRes.json()
        if (Array.isArray(d?.sentInvitations)) currentSent = d.sentInvitations
      }
      if (!currentSent.some(s => s.recipientEmail?.toLowerCase() === reviewerEmail.toLowerCase() && s.paperId === paperId)) {
        currentSent.unshift(sentItem)
        await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/sent-invitations.json`, {
          method: "POST",
          headers: {
            apikey: SUPABASE_SERVICE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
            "Content-Type": "application/json",
            "x-upsert": "true"
          },
          body: JSON.stringify({ sentInvitations: currentSent })
        })
      }
    } catch (e) {
      console.warn("Could not persist to Supabase in reviewers POST:", e)
    }

    return NextResponse.json({ ok: true, record: newRecord })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { paperId, reviewerEmail, action, declineReason, declineReferral, deadline, reason } = body

    if (!paperId || !reviewerEmail || !action) {
      return NextResponse.json({ ok: false, error: "Missing paperId, reviewerEmail, or action." }, { status: 400 })
    }

    const todayStr = new Date().toISOString().split("T")[0]
    const itemIndex = globalReviewerHistory.findIndex(
      r => r.paperId.toLowerCase() === paperId.toLowerCase() && r.reviewerEmail.toLowerCase() === reviewerEmail.toLowerCase()
    )

    if (action === "award_incentive") {
      const { pointsAwarded, qualityRating, timeliness, incentiveType, voucherCode, editorCommendation, awardedBy } = body
      if (itemIndex >= 0) {
        const existing = globalReviewerHistory[itemIndex]
        globalReviewerHistory[itemIndex] = {
          ...existing,
          status: "Completed",
          pointsAwarded: pointsAwarded ?? existing.pointsAwarded ?? 15,
          qualityRating: qualityRating ?? existing.qualityRating ?? 5,
          timeliness: timeliness ?? existing.timeliness ?? "on_time",
          incentiveType: incentiveType ?? existing.incentiveType ?? "apc_waiver_25",
          voucherCode: voucherCode ?? existing.voucherCode,
          editorCommendation: editorCommendation ?? existing.editorCommendation,
          awardedAt: todayStr,
          awardedBy: awardedBy || "Handling Editor"
        }
        return NextResponse.json({ ok: true, record: globalReviewerHistory[itemIndex] })
      } else {
        const created: ReviewerHistoryItem = {
          id: `REV-HIST-${Date.now()}`,
          paperId,
          paperTitle: body.paperTitle || "Manuscript",
          journal: body.journal || "Scholarly Open",
          reviewerName: body.reviewerName || reviewerEmail.split("@")[0],
          reviewerEmail,
          invitedDate: todayStr,
          status: "Completed",
          respondedAt: todayStr,
          pointsAwarded: pointsAwarded || 15,
          qualityRating: qualityRating || 5,
          timeliness: timeliness || "on_time",
          incentiveType: incentiveType || "apc_waiver_25",
          voucherCode: voucherCode || `REV-WAV25-${Date.now().toString().slice(-6)}`,
          editorCommendation,
          awardedAt: todayStr,
          awardedBy: awardedBy || "Handling Editor"
        }
        globalReviewerHistory.unshift(created)
        return NextResponse.json({ ok: true, record: created })
      }
    }

    const newStatus = action === "accept" ? "Accepted" : action === "decline" ? "Declined" : "Invited"

    if (itemIndex >= 0) {
      const existing = globalReviewerHistory[itemIndex]
      const updatedStatus = action === "update_deadline" ? existing.status : newStatus
      globalReviewerHistory[itemIndex] = {
        ...existing,
        status: updatedStatus,
        declineReason: action === "decline" ? (declineReason || "Unavailable") : existing.declineReason,
        declineReferral: action === "decline" ? (declineReferral || undefined) : existing.declineReferral,
        respondedAt: action === "update_deadline" ? (existing.respondedAt || todayStr) : todayStr,
        deadline: deadline || existing.deadline
      }
      return NextResponse.json({ ok: true, record: globalReviewerHistory[itemIndex] })
    } else {
      // Create new record with this response
      const deadlineDate = new Date()
      deadlineDate.setDate(deadlineDate.getDate() + 14)

      const created: ReviewerHistoryItem = {
        id: `REV-HIST-${Date.now()}`,
        paperId,
        paperTitle: body.paperTitle || "Manuscript",
        journal: body.journal || "Scholarly Open",
        reviewerName: body.reviewerName || reviewerEmail.split("@")[0],
        reviewerEmail,
        invitedDate: todayStr,
        status: action === "update_deadline" ? "Accepted" : newStatus,
        declineReason: action === "decline" ? (declineReason || "Unavailable") : undefined,
        declineReferral: action === "decline" ? (declineReferral || undefined) : undefined,
        respondedAt: todayStr,
        deadline: deadline || deadlineDate.toISOString().split("T")[0]
      }
      globalReviewerHistory.unshift(created)
      return NextResponse.json({ ok: true, record: created })
    }
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}
