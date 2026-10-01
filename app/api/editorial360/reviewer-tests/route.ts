export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

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
  status: "Passed - Pending Account" | "Passed - Account Active" | "Pending JM Approval" | "Failed Threshold" | "Rejected"
  credentialId?: string
  date: string
  timestamp: string
  orcid?: string
  cvFileName?: string
  cvFileSize?: string
  cvBase64?: string
  jmApproved?: boolean
  notes?: string
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wrccglyypgxtuikrupkh.supabase.co"
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyY2NnbHl5cGd4dHVpa3J1cGtoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODg2NjUzNSwiZXhwIjoyMTA0NDQyNTM1fQ.H6xldZUHFnoTUajtmGdoI_E59cDh3xEADVzPiUj0L2Y"
const BUCKET = "editorial360_data"
const FILE_PATH = "reviewer-records.json"

const LOCAL_DATA_PATH = path.join(process.cwd(), "lib", "data", "reviewer-records.json")

async function getStoredRecords(): Promise<{ tests: ReviewerTestRecord[]; registeredReviewers: any[] }> {
  // 1. Try Supabase Cloud Storage (primary)
  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${FILE_PATH}?t=${Date.now()}`, {
      cache: "no-store"
    })
    if (res.ok) {
      const parsed = await res.json()
      if (parsed && (Array.isArray(parsed.tests) || Array.isArray(parsed.registeredReviewers))) {
        return {
          tests: Array.isArray(parsed.tests) ? parsed.tests : [],
          registeredReviewers: Array.isArray(parsed.registeredReviewers) ? parsed.registeredReviewers : []
        }
      }
    }
  } catch (e) {
    console.warn("Supabase fetch reviewer-records warning:", e)
  }

  // 2. Fallback to local file
  try {
    if (fs.existsSync(LOCAL_DATA_PATH)) {
      const raw = fs.readFileSync(LOCAL_DATA_PATH, "utf-8")
      const parsed = JSON.parse(raw)
      return {
        tests: Array.isArray(parsed.tests) ? parsed.tests : [],
        registeredReviewers: Array.isArray(parsed.registeredReviewers) ? parsed.registeredReviewers : []
      }
    }
  } catch (e) {
    console.error("Error reading reviewer-records.json:", e)
  }
  return { tests: [], registeredReviewers: [] }
}

async function saveStoredRecords(data: { tests: ReviewerTestRecord[]; registeredReviewers: any[] }): Promise<boolean> {
  let cloudSuccess = false
  // 1. Save to Supabase Cloud Storage
  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${FILE_PATH}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        "x-upsert": "true"
      },
      body: JSON.stringify({ ...data, lastUpdated: new Date().toISOString() })
    })
    cloudSuccess = res.ok
  } catch (e) {
    console.error("Supabase save reviewer-records error:", e)
  }

  // 2. Save locally for dev environment fallback
  try {
    const dir = path.dirname(LOCAL_DATA_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(LOCAL_DATA_PATH, JSON.stringify(data, null, 2), "utf-8")
  } catch (e) {
    // Non-fatal in cloud lambdas
  }

  return cloudSuccess
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

    const isPassed = passed ?? (score >= 80)
    const newRecord: ReviewerTestRecord = {
      id: `TEST-${Date.now().toString().slice(-4)}`,
      candidateName,
      candidateEmail,
      discipline: discipline || "general",
      institution: institution || "Academic Institution",
      department: department || "",
      score: score || 0,
      totalQuestions,
      passed: isPassed,
      // Default to Pending JM Approval so unverified candidates must be vetted before activation
      status: status || (isPassed ? "Pending JM Approval" : "Failed Threshold"),
      credentialId: credentialId || (isPassed ? `SO-REV-${new Date().getFullYear()}-${Math.random().toString(16).substring(2, 8).toUpperCase()}` : undefined),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      timestamp: new Date().toISOString(),
      orcid: orcid || "",
      cvFileName: cvFileName || "",
      cvFileSize: cvFileSize || "",
      cvBase64: cvBase64 || "",
      jmApproved: false,
      notes: isPassed ? "Qualified via Reviewer Gateway assessment. Pending JM institutional & CV verification." : "Assessment threshold not met."
    }

    const store = await getStoredRecords()
    const existingIndex = store.tests.findIndex(t => t.candidateEmail.toLowerCase() === candidateEmail.toLowerCase())
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
    const { id, candidateEmail, status, jmApproved } = body

    const store = await getStoredRecords()
    let updatedCandidate: any = null

    store.tests = store.tests.map(test => {
      if ((id && test.id === id) || (candidateEmail && test.candidateEmail.toLowerCase() === candidateEmail.toLowerCase())) {
        const isApproved = jmApproved !== undefined ? jmApproved : (status === "Passed - Account Active" || status === "Active Referee")
        const newStatus = status || (isApproved ? "Passed - Account Active" : "Pending JM Approval")
        updatedCandidate = {
          ...test,
          jmApproved: isApproved,
          status: newStatus
        }
        return updatedCandidate
      }
      return test
    })

    // If approved by JM, ensure they are registered in registeredReviewers
    if (updatedCandidate && (updatedCandidate.jmApproved || status === "Passed - Account Active")) {
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
    } else if (updatedCandidate && jmApproved === false) {
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

