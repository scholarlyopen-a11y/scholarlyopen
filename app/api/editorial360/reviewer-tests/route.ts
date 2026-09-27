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
  status: "Passed - Pending Account" | "Passed - Account Active" | "Failed Threshold"
  credentialId?: string
  date: string
  timestamp: string
  orcid?: string
  notes?: string
}

const DATA_FILE_PATH = path.join(process.cwd(), "lib", "data", "reviewer-records.json")

function getStoredRecords(): { tests: ReviewerTestRecord[]; registeredReviewers: any[] } {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, "utf-8")
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

function saveStoredRecords(data: { tests: ReviewerTestRecord[]; registeredReviewers: any[] }) {
  try {
    const dir = path.dirname(DATA_FILE_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8")
  } catch (e) {
    console.error("Error saving reviewer-records.json:", e)
  }
}

export async function GET() {
  const { tests } = getStoredRecords()
  return NextResponse.json({
    success: true,
    tests,
    total: tests.length,
    passedCount: tests.filter(t => t.passed).length,
    pendingAccountCount: tests.filter(t => t.status === "Passed - Pending Account").length
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
      orcid
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
      status: status || (isPassed ? "Passed - Pending Account" : "Failed Threshold"),
      credentialId: credentialId || (isPassed ? `CERT-SO-2026-${Math.floor(1000 + Math.random() * 9000)}` : undefined),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      timestamp: new Date().toISOString(),
      orcid: orcid || "",
      notes: isPassed ? "Qualified via Reviewer Gateway assessment." : "Assessment threshold not met."
    }

    const store = getStoredRecords()
    const existingIndex = store.tests.findIndex(t => t.candidateEmail.toLowerCase() === candidateEmail.toLowerCase())
    if (existingIndex >= 0) {
      store.tests[existingIndex] = { ...store.tests[existingIndex], ...newRecord }
    } else {
      store.tests = [newRecord, ...store.tests]
    }

    // If passed, also automatically register/update them in registeredReviewers so JM sees them immediately
    if (isPassed) {
      const revIndex = store.registeredReviewers.findIndex((r: any) => r.email.toLowerCase() === candidateEmail.toLowerCase())
      const reviewerEntry = {
        id: revIndex >= 0 ? store.registeredReviewers[revIndex].id : `REV-REG-${Date.now().toString().slice(-4)}`,
        name: candidateName,
        email: candidateEmail,
        status: "Active",
        activeTasks: 0,
        maxTasks: 3,
        matchScore: Math.min(99, Math.max(80, score || 85)),
        specialization: `${discipline ? discipline.replace("-", " ") : "Academic"} Peer Review`,
        discipline: discipline || "General Sciences",
        institution: institution || "Academic Institution",
        orcid: orcid || "",
        completedReviews: 0,
        onTimeRate: 100,
        credentialId: newRecord.credentialId,
        keywords: [discipline || "sciences", "peer review", "academic research"]
      }

      if (revIndex >= 0) {
        store.registeredReviewers[revIndex] = { ...store.registeredReviewers[revIndex], ...reviewerEntry }
      } else {
        store.registeredReviewers = [reviewerEntry, ...store.registeredReviewers]
      }
    }

    saveStoredRecords(store)

    return NextResponse.json({ success: true, record: newRecord })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { id, candidateEmail, status } = body

    const store = getStoredRecords()
    store.tests = store.tests.map(test => {
      if ((id && test.id === id) || (candidateEmail && test.candidateEmail.toLowerCase() === candidateEmail.toLowerCase())) {
        return { ...test, status: status || "Passed - Account Active" }
      }
      return test
    })

    saveStoredRecords(store)

    return NextResponse.json({ success: true, tests: store.tests })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
