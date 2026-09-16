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
}

// In-memory store for active session with mock data pre-populated
const globalReviewerHistory: ReviewerHistoryItem[] = [
  {
    id: "REV-HIST-01",
    paperId: "SOEAS-26-RS102",
    paperTitle: "Generative Diffusion Models for High-Entropy Alloys",
    journal: "Scholarly Open: Engineering & Applied Sciences",
    reviewerName: "Dr. Evelyn Vane",
    reviewerEmail: "e.vane@university-medical.edu",
    invitedDate: "2026-08-20",
    status: "Completed",
    deadline: "2026-09-03",
    respondedAt: "2026-08-21"
  },
  {
    id: "REV-HIST-02",
    paperId: "SOEAS-26-RS102",
    paperTitle: "Generative Diffusion Models for High-Entropy Alloys",
    journal: "Scholarly Open: Engineering & Applied Sciences",
    reviewerName: "Dr. Marcus Vance",
    reviewerEmail: "m.vance@university-charite.de",
    invitedDate: "2026-08-20",
    status: "Completed",
    deadline: "2026-09-03",
    respondedAt: "2026-08-21"
  },
  {
    id: "REV-HIST-03",
    paperId: "SOMED-26-RW101",
    paperTitle: "Advances in Type 1 Diabetes Ocular Remote Tele-Health Screening",
    journal: "Scholarly Open: Medicine",
    reviewerName: "Dr. Evelyn Vane",
    reviewerEmail: "e.vane@university-medical.edu",
    invitedDate: "2026-08-28",
    status: "Accepted",
    deadline: "2026-09-11",
    respondedAt: "2026-08-28"
  },
  {
    id: "REV-HIST-04",
    paperId: "SOSSH-26-SRW107",
    paperTitle: "Gender Wage Disparity: A Multi-Country Meta-Analysis",
    journal: "Scholarly Open: Social Sciences & Humanities",
    reviewerName: "Prof. Hiroshi Tanaka",
    reviewerEmail: "h.tanaka@tokyo-institute.ac.jp",
    invitedDate: "2026-08-25",
    status: "Invited",
    deadline: "2026-09-08"
  }
]

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const paperId = searchParams.get("paperId")
    const email = searchParams.get("email")

    let results = [...globalReviewerHistory]
    if (paperId) {
      results = results.filter(r => r.paperId.toLowerCase() === paperId.toLowerCase())
    }
    if (email) {
      results = results.filter(r => r.reviewerEmail.toLowerCase() === email.toLowerCase())
    }

    return NextResponse.json({ ok: true, history: results })
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
