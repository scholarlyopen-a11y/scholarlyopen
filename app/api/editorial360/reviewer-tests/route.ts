import { NextResponse } from "next/server"

export interface ReviewerTestRecord {
  id: string
  candidateName: string
  candidateEmail: string
  discipline: string
  institution: string
  score: number
  totalQuestions: number
  passed: boolean
  status: "Passed - Pending Account" | "Passed - Account Active" | "Failed Threshold"
  credentialId?: string
  date: string
  timestamp: string
  notes?: string
}

// In-memory persistent cache for serverless lifetime
let reviewerTestStore: ReviewerTestRecord[] = [
  {
    id: "TEST-2026-9040",
    candidateName: "Dr. Wenxiong Sun (孙文雄)",
    candidateEmail: "102500216@hbut.edu.cn",
    discipline: "engineering-materials",
    institution: "Hubei University of Technology",
    score: 92,
    totalQuestions: 10,
    passed: true,
    status: "Passed - Account Active",
    credentialId: "CERT-SO-2026-9088",
    date: "Sep 23, 2026",
    timestamp: "2026-09-23T21:40:00Z",
    notes: "Completed Reviewer Gateway onboarding and assessment (92%). Verified referee on Editorial360."
  },
  {
    id: "TEST-2026-9041",
    candidateName: "Dr. Elena Rostova",
    candidateEmail: "e.rostova@karolinska.se",
    discipline: "medicine",
    institution: "Karolinska Institute · Department of Oncology",
    score: 90,
    totalQuestions: 10,
    passed: true,
    status: "Passed - Account Active",
    credentialId: "CERT-SO-2026-9812",
    date: "Sep 22, 2026",
    timestamp: "2026-09-22T14:32:00Z",
    notes: "Completed Editorial360 reviewer onboarding. ORCID linked."
  },
  {
    id: "TEST-2026-9042",
    candidateName: "Dr. Kenji Takahashi",
    candidateEmail: "k-takahashi@u-tokyo.ac.jp",
    discipline: "applied-sciences",
    institution: "University of Tokyo · Department of Precision Engineering",
    score: 85,
    totalQuestions: 10,
    passed: true,
    status: "Passed - Pending Account",
    credentialId: "CERT-SO-2026-9813",
    date: "Sep 22, 2026",
    timestamp: "2026-09-22T17:15:00Z",
    notes: "Passed assessment with 85%. Awaiting Editorial360 account creation."
  },
  {
    id: "TEST-2026-9043",
    candidateName: "Prof. Sarah O'Connor",
    candidateEmail: "soconnor@tcd.ie",
    discipline: "humanities",
    institution: "Trinity College Dublin · Centre for Digital Humanities",
    score: 70,
    totalQuestions: 10,
    passed: false,
    status: "Failed Threshold",
    date: "Sep 21, 2026",
    timestamp: "2026-09-21T11:05:00Z",
    notes: "Did not meet 80% passing threshold (70%). Eligible for re-test in 7 days."
  },
  {
    id: "TEST-2026-9044",
    candidateName: "Dr. Tariq Al-Mansoor",
    candidateEmail: "t.almansoor@kfupm.edu.sa",
    discipline: "energy-materials",
    institution: "KFUPM · Center for Clean Energy & Decarbonization",
    score: 95,
    totalQuestions: 10,
    passed: true,
    status: "Passed - Pending Account",
    credentialId: "CERT-SO-2026-9814",
    date: "Sep 22, 2026",
    timestamp: "2026-09-22T18:40:00Z",
    notes: "Passed assessment with 95%. Automated invite to Editorial360 sent."
  }
]

export async function GET() {
  return NextResponse.json({
    success: true,
    tests: reviewerTestStore,
    total: reviewerTestStore.length,
    passedCount: reviewerTestStore.filter(t => t.passed).length,
    pendingAccountCount: reviewerTestStore.filter(t => t.status === "Passed - Pending Account").length
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
      score, 
      totalQuestions = 10, 
      passed, 
      credentialId,
      status
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
      score: score || 0,
      totalQuestions,
      passed: isPassed,
      status: status || (isPassed ? "Passed - Pending Account" : "Failed Threshold"),
      credentialId: credentialId || (isPassed ? `CERT-SO-2026-${Math.floor(1000 + Math.random() * 9000)}` : undefined),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      timestamp: new Date().toISOString()
    }

    // Prepend new record
    reviewerTestStore = [newRecord, ...reviewerTestStore]

    return NextResponse.json({ success: true, record: newRecord })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { id, candidateEmail, status } = body

    reviewerTestStore = reviewerTestStore.map(test => {
      if ((id && test.id === id) || (candidateEmail && test.candidateEmail.toLowerCase() === candidateEmail.toLowerCase())) {
        return { ...test, status: status || "Passed - Account Active" }
      }
      return test
    })

    return NextResponse.json({ success: true, tests: reviewerTestStore })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
