export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { getStoredDisapproved, saveStoredDisapproved, DisapprovedCandidateRecord } from "../disapproved-candidates/route"

export interface ReviewerTestRecord {
  id: string
  candidateName: string
  candidateEmail: string
  discipline: string
  institution: string
  department?: string
  score: number
  totalQuestions: number
  passed: boolean
  status: "Passed - Pending Account" | "Passed - Account Active" | "Pending JM Approval" | "Failed Threshold" | "Rejected" | "Disapproved - Access Blocked"
  credentialId?: string
  date: string
  timestamp: string
  orcid?: string
  cvFileName?: string
  cvFileSize?: string
  cvBase64?: string
  jmApproved?: boolean
  isFlagged?: boolean
  flagReason?: string
  notes?: string
}

import { readEditorialData, writeEditorialData } from "@/lib/editorial-storage"

const FILE_PATH = "reviewer-records.json"

async function getStoredRecords(): Promise<{ tests: ReviewerTestRecord[]; registeredReviewers: any[] }> {
  let tests: ReviewerTestRecord[] = []
  let registeredReviewers: any[] = []

  try {
    const parsed = await readEditorialData<{ tests?: ReviewerTestRecord[]; registeredReviewers?: any[] }>(FILE_PATH, { tests: [], registeredReviewers: [] })
    if (parsed) {
      if (Array.isArray(parsed.tests)) tests = parsed.tests
      if (Array.isArray(parsed.registeredReviewers)) registeredReviewers = parsed.registeredReviewers
    }
  } catch (e) {
    console.error("Error reading reviewer-records:", e)
  }

  // Cross-reference with Integrity Watchlist
  let disapprovedList: any[] = []
  try {
    disapprovedList = await getStoredDisapproved()
  } catch (e) {}

  const finalTests = tests.map(test => {
    const isDisapproved = disapprovedList.some(d => 
      (d.email && test.candidateEmail && d.email.toLowerCase() === test.candidateEmail.toLowerCase()) ||
      (d.id && test.id && d.id.toLowerCase() === test.id.toLowerCase())
    )
    if (isDisapproved) {
      return {
        ...test,
        status: "Disapproved - Access Blocked" as const,
        jmApproved: false,
        passed: false,
        isFlagged: true,
        flagReason: "Disapproved by Journal Manager (Integrity Watchlist)"
      }
    }
    return test
  })

  const finalReviewers = registeredReviewers.filter(r => {
    const isDisapproved = disapprovedList.some(d => 
      (d.email && r.email && d.email.toLowerCase() === r.email.toLowerCase())
    )
    return !isDisapproved
  })

  return { tests: finalTests, registeredReviewers: finalReviewers }
}

async function saveStoredRecords(data: { tests: ReviewerTestRecord[]; registeredReviewers: any[] }): Promise<boolean> {
  return await writeEditorialData(FILE_PATH, { ...data, lastUpdated: new Date().toISOString() })
}

export async function GET() {
  const { tests } = await getStoredRecords()
  return NextResponse.json({
    success: true,
    tests,
    total: tests.length,
    passedCount: tests.filter(t => t.passed).length,
    pendingAccountCount: tests.filter(t => t.status === "Pending JM Approval" || t.status === "Passed - Pending Account").length
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { 
      candidateName, 
      candidateEmail, 
      discipline, 
      institution, 
      department,
      score, 
      totalQuestions = 10, 
      passed, 
      credentialId,
      status,
      orcid,
      cvFileName,
      cvFileSize,
      cvBase64
    } = body

    if (!candidateName || !candidateEmail) {
      return NextResponse.json({ success: false, error: "Candidate name and email required" }, { status: 400 })
    }

    const cleanEmail = candidateEmail.trim().toLowerCase()
    const cleanOrcid = (orcid || "").trim()

    const disapprovedList = await getStoredDisapproved()
    const matchDisapproved = disapprovedList.find(d => 
      (d.email && d.email.toLowerCase() === cleanEmail) || 
      (cleanOrcid && d.orcid && d.orcid === cleanOrcid)
    )

    const isPassed = !matchDisapproved && (passed ?? (score >= 80))
    const initialStatus: ReviewerTestRecord["status"] = matchDisapproved
      ? "Disapproved - Access Blocked"
      : (status || (isPassed ? "Pending JM Approval" : "Failed Threshold"))

    const newRecord: ReviewerTestRecord = {
      id: `TEST-${Date.now().toString().slice(-4)}`,
      candidateName,
      candidateEmail: cleanEmail,
      discipline: discipline || "general",
      institution: institution || "Academic Institution",
      department: department || "",
      score: score || 0,
      totalQuestions,
      passed: isPassed,
      // Default to Pending JM Approval so unverified candidates must be vetted before activation
      status: initialStatus,
      credentialId: credentialId || (isPassed ? `SO-REV-${new Date().getFullYear()}-${Math.random().toString(16).substring(2, 8).toUpperCase()}` : undefined),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      timestamp: new Date().toISOString(),
      orcid: cleanOrcid,
      cvFileName: cvFileName || "",
      cvFileSize: cvFileSize || "",
      cvBase64: cvBase64 || "",
      jmApproved: false,
      isFlagged: Boolean(matchDisapproved),
      flagReason: matchDisapproved ? `Flagged on Integrity Watchlist: Previously Disapproved on ${new Date(matchDisapproved.disapprovedAt).toLocaleDateString()}` : undefined,
      notes: matchDisapproved
        ? "⚠️ INTEGRITY ALERT: Candidate identity previously disapproved by Journal Manager. Access is blocked."
        : (isPassed ? "Qualified via Reviewer Gateway assessment. Pending JM institutional & CV verification." : "Assessment threshold not met.")
    }

    const store = await getStoredRecords()
    const existingIndex = store.tests.findIndex(t => t.candidateEmail.toLowerCase() === cleanEmail)
    if (existingIndex >= 0) {
      store.tests[existingIndex] = { ...store.tests[existingIndex], ...newRecord }
    } else {
      store.tests = [newRecord, ...store.tests]
    }

    await saveStoredRecords(store)

    return NextResponse.json({ success: true, record: newRecord })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { id, candidateEmail, status, jmApproved, action, reason, notes } = body

    const store = await getStoredRecords()
    let updatedCandidate: any = null

    const isDisapproving = status === "Disapproved - Access Blocked" || status === "Rejected" || action === "disapprove" || (jmApproved === false && status === "Disapproved")

    store.tests = store.tests.map(test => {
      if ((id && test.id === id) || (candidateEmail && test.candidateEmail.toLowerCase() === candidateEmail.toLowerCase())) {
        let isApproved = jmApproved !== undefined ? jmApproved : (status === "Passed - Account Active" || status === "Active Referee")
        let newStatus = status || (isApproved ? "Passed - Account Active" : "Pending JM Approval")

        if (isDisapproving) {
          isApproved = false
          newStatus = "Disapproved - Access Blocked"
        }

        updatedCandidate = {
          ...test,
          jmApproved: isApproved,
          status: newStatus,
          isFlagged: isDisapproving ? true : test.isFlagged,
          flagReason: isDisapproving ? (reason || "Disapproved by Journal Manager") : test.flagReason,
          notes: isDisapproving ? `⚠️ Candidate disapproved on ${new Date().toLocaleDateString()} by Journal Manager.` : test.notes
        }
        return updatedCandidate
      }
      return test
    })

    // If candidate was disapproved, permanently register in watchlist
    if (updatedCandidate && isDisapproving) {
      const currentWatchlist = await getStoredDisapproved()
      const filtered = currentWatchlist.filter(d => d.email.toLowerCase() !== updatedCandidate.candidateEmail.toLowerCase())
      await saveStoredDisapproved([
        {
          id: `WATCH-${Date.now().toString().slice(-6)}`,
          name: updatedCandidate.candidateName,
          email: updatedCandidate.candidateEmail.toLowerCase(),
          orcid: updatedCandidate.orcid,
          institution: updatedCandidate.institution,
          credentialId: updatedCandidate.credentialId,
          disapprovedAt: new Date().toISOString(),
          disapprovedBy: "Journal Manager",
          status: "Disapproved",
          reason: reason || "Identity unverified / Disapproved by Journal Manager",
          notes: notes || undefined
        },
        ...filtered
      ])

      // Ensure they are removed from registeredReviewers
      store.registeredReviewers = store.registeredReviewers.filter(
        (r: any) => !r.email || r.email.toLowerCase() !== updatedCandidate.candidateEmail.toLowerCase()
      )
    }

    // If approved by JM, ensure they are registered in registeredReviewers
    if (updatedCandidate && (updatedCandidate.jmApproved || status === "Passed - Account Active") && !isDisapproving) {
      const email = updatedCandidate.candidateEmail
      const revIndex = store.registeredReviewers.findIndex((r: any) => r.email && r.email.toLowerCase() === email.toLowerCase())
      const reviewerEntry = {
        id: revIndex >= 0 ? store.registeredReviewers[revIndex].id : `REV-REG-${Date.now().toString().slice(-4)}`,
        name: updatedCandidate.candidateName,
        email: updatedCandidate.candidateEmail,
        status: "Active",
        activeTasks: 0,
        maxTasks: 3,
        matchScore: Math.min(99, Math.max(80, updatedCandidate.score || 90)),
        specialization: `${updatedCandidate.discipline ? updatedCandidate.discipline.replace("-", " ") : "Academic"} Peer Review`,
        discipline: updatedCandidate.discipline || "General Sciences",
        institution: updatedCandidate.institution || "Academic Institution",
        orcid: updatedCandidate.orcid || "",
        completedReviews: 0,
        onTimeRate: 100,
        credentialId: updatedCandidate.credentialId || "CERT-SO-2026-CLAIMED",
        keywords: [updatedCandidate.discipline || "sciences", "peer review", "academic research"]
      }

      if (revIndex >= 0) {
        store.registeredReviewers[revIndex] = { ...store.registeredReviewers[revIndex], ...reviewerEntry }
      } else {
        store.registeredReviewers.unshift(reviewerEntry)
      }
    } else if (updatedCandidate && jmApproved === false && !isDisapproving) {
      // If approval is revoked, set reviewer entry status to Inactive / Pending
      store.registeredReviewers = store.registeredReviewers.map((r: any) => {
        if (r.email && updatedCandidate.candidateEmail && r.email.toLowerCase() === updatedCandidate.candidateEmail.toLowerCase()) {
          return { ...r, status: "Pending Verification" }
        }
        return r
      })
    }

    await saveStoredRecords(store)

    return NextResponse.json({ success: true, tests: store.tests, registeredReviewers: store.registeredReviewers })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")?.trim().toLowerCase()
    const id = searchParams.get("id")

    if (!email && !id) {
      return NextResponse.json({ success: false, error: "Email or ID is required" }, { status: 400 })
    }

    const store = await getStoredRecords()
    let removedCandidate: any = null

    store.tests = store.tests.filter(t => {
      const match = (email && t.candidateEmail.toLowerCase() === email) || (id && t.id === id)
      if (match) removedCandidate = t
      return !match
    })

    store.registeredReviewers = store.registeredReviewers.filter((r: any) => {
      return !((email && r.email && r.email.toLowerCase() === email) || (id && r.id === id))
    })

    await saveStoredRecords(store)

    // If candidate was deleted, preserve them in the disapproved / watchlist registry
    if (removedCandidate) {
      const currentWatchlist = await getStoredDisapproved()
      const exists = currentWatchlist.some(w => w.email.toLowerCase() === removedCandidate.candidateEmail.toLowerCase())
      if (!exists) {
        await saveStoredDisapproved([
          {
            id: `WATCH-${Date.now().toString().slice(-6)}`,
            name: removedCandidate.candidateName,
            email: removedCandidate.candidateEmail.toLowerCase(),
            orcid: removedCandidate.orcid,
            institution: removedCandidate.institution,
            credentialId: removedCandidate.credentialId,
            disapprovedAt: new Date().toISOString(),
            disapprovedBy: "Journal Manager",
            status: "Purged / Watchlisted",
            reason: "Purged / Deleted from active desk by Journal Manager",
            notes: "Automatic retention on integrity watchlist following record purge"
          },
          ...currentWatchlist
        ])
      }
    }

    return NextResponse.json({ success: true, tests: store.tests, registeredReviewers: store.registeredReviewers })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

