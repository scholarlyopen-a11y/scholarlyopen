export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wrccglyypgxtuikrupkh.supabase.co"
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyY2NnbHl5cGd4dHVpa3J1cGtoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODg2NjUzNSwiZXhwIjoyMTA0NDQyNTM1fQ.H6xldZUHFnoTUajtmGdoI_E59cDh3xEADVzPiUj0L2Y"
const BUCKET = "editorial360_data"
const FILE_PATH = "reviews.json"

export interface StoredReview {
  id: string
  paperId: string
  reviewerName: string
  reviewerEmail?: string
  status: "Pending Moderation" | "Released" | "Archived"
  originality: number
  methodology: number
  clarity: number
  significance: number
  commentsAuthor: string
  commentsEditor?: string
  recommendation: string
  sanitizedCommentsAuthor?: string
  moderationNotes?: string
  createdAt?: string
  updatedAt?: string
}

const DEFAULT_REVIEWS: StoredReview[] = [
  {
    id: "REV-FB-SAM-01",
    paperId: "SOMED-26-RW01",
    reviewerName: "Dr. Praveen Nagula",
    reviewerEmail: "praveen.nagula@hospital.org",
    status: "Released",
    originality: 5,
    methodology: 4,
    clarity: 5,
    significance: 5,
    commentsAuthor: "Comprehensive healthcare operations framework for acute aortic dissection. Section 3 on ED triage protocols is outstanding. Recommend minor expansion on pediatric dissection differentials in Section 4.2.",
    commentsEditor: "Strong clinical operations manuscript. Recommended for Acceptance with minor technical clarifications.",
    recommendation: "Accept with Minor Revisions",
    sanitizedCommentsAuthor: "Comprehensive healthcare operations framework for acute aortic dissection. Section 3 on ED triage protocols is outstanding. Recommend minor expansion on pediatric dissection differentials in Section 4.2.",
    createdAt: "2026-09-28T14:20:00Z"
  },
  {
    id: "REV-FB-SAM-02",
    paperId: "SOMED-26-RW01",
    reviewerName: "Dr. Ragab Aziza",
    reviewerEmail: "ragab.aziza@medcenter.edu",
    status: "Released",
    originality: 4,
    methodology: 4,
    clarity: 4,
    significance: 5,
    commentsAuthor: "The multidisciplinary workflow proposed addresses critical diagnostic latency in emergency settings. Suggest adding a high-resolution flowchart for rapid surgical consultation pathway.",
    commentsEditor: "Methodologically sound and operationally impactful. Strongly support publication.",
    recommendation: "Accept with Minor Revisions",
    sanitizedCommentsAuthor: "The multidisciplinary workflow proposed addresses critical diagnostic latency in emergency settings. Suggest adding a high-resolution flowchart for rapid surgical consultation pathway.",
    createdAt: "2026-09-29T09:15:00Z"
  }
]

// Helper: Fetch reviews from Supabase PostgreSQL table or Cloud Storage
async function getStoredReviews(): Promise<StoredReview[]> {
  // 1. Try Supabase Cloud Storage
  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${FILE_PATH}?t=${Date.now()}`, {
      cache: "no-store"
    })
    if (res.ok) {
      const data = await res.json()
      if (data && Array.isArray(data.reviews)) {
        return data.reviews
      }
    }
  } catch (e) {
    console.warn("Supabase storage fetch reviews warning:", e)
  }

  // 2. Try Supabase REST table `reviews`
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/reviews?select=*&order=created_at.desc`, {
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json"
      },
      cache: "no-store"
    })
    if (res.ok) {
      const dbReviews = await res.json()
      if (Array.isArray(dbReviews) && dbReviews.length > 0) {
        return dbReviews.map((r: any) => ({
          id: r.id,
          paperId: r.paper_id,
          reviewerName: r.reviewer_name || "Anonymous Referee",
          reviewerEmail: r.reviewer_email || "",
          status: (r.status as any) || "Pending Moderation",
          originality: r.originality || 4,
          methodology: r.methodology || 4,
          clarity: r.clarity || 4,
          significance: r.significance || 4,
          commentsAuthor: r.comments_author || "",
          commentsEditor: r.comments_editor || "",
          recommendation: r.recommendation || "Minor Revisions",
          sanitizedCommentsAuthor: r.sanitized_comments_author || r.comments_author || "",
          createdAt: r.created_at || new Date().toISOString()
        }))
      }
    }
  } catch (e) {
    console.warn("Supabase rest fetch reviews warning:", e)
  }

  return DEFAULT_REVIEWS
}

// Helper: Save reviews to Supabase Cloud Storage & Postgres REST
async function saveStoredReviews(reviews: StoredReview[]) {
  // 1. Save to Supabase Cloud Storage
  try {
    await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${FILE_PATH}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        "x-upsert": "true"
      },
      body: JSON.stringify({ reviews, updatedAt: new Date().toISOString() })
    })
  } catch (err) {
    console.error("Supabase save reviews storage error:", err)
  }

  // 2. Upsert into Supabase Postgres `reviews` table
  try {
    const payload = reviews.map(r => ({
      id: r.id,
      paper_id: r.paperId,
      reviewer_name: r.reviewerName,
      reviewer_email: r.reviewerEmail,
      status: r.status,
      originality: r.originality,
      methodology: r.methodology,
      clarity: r.clarity,
      significance: r.significance,
      comments_author: r.commentsAuthor,
      comments_editor: r.commentsEditor,
      recommendation: r.recommendation,
      sanitized_comments_author: r.sanitizedCommentsAuthor
    }))

    await fetch(`${SUPABASE_URL}/rest/v1/reviews`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates"
      },
      body: JSON.stringify(payload)
    })
  } catch (e) {
    console.warn("Supabase upsert reviews table warning:", e)
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const paperId = searchParams.get("paperId")

    let reviews = await getStoredReviews()

    if (paperId) {
      const cleanPaperId = paperId.toLowerCase().trim()
      reviews = reviews.filter(r => r.paperId && r.paperId.toLowerCase().trim() === cleanPaperId)
    }

    return NextResponse.json({ ok: true, reviews, total: reviews.length })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      id = `REV-FB-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      paperId,
      reviewerName,
      reviewerEmail,
      originality = 4,
      methodology = 4,
      clarity = 4,
      significance = 4,
      commentsAuthor = "",
      commentsEditor = "",
      recommendation = "Minor Revisions",
      status = "Pending Moderation",
      sanitizedCommentsAuthor = ""
    } = body

    if (!paperId || !reviewerName) {
      return NextResponse.json({ ok: false, error: "paperId and reviewerName are required" }, { status: 400 })
    }

    const currentReviews = await getStoredReviews()
    const existingIndex = currentReviews.findIndex(r => r.id === id || (r.paperId.toLowerCase() === paperId.toLowerCase() && r.reviewerName.toLowerCase() === reviewerName.toLowerCase()))

    const newRecord: StoredReview = {
      id: existingIndex >= 0 ? currentReviews[existingIndex].id : id,
      paperId,
      reviewerName,
      reviewerEmail,
      originality: Number(originality) || 4,
      methodology: Number(methodology) || 4,
      clarity: Number(clarity) || 4,
      significance: Number(significance) || 4,
      commentsAuthor,
      commentsEditor,
      recommendation,
      status: (status as any) || "Pending Moderation",
      sanitizedCommentsAuthor: sanitizedCommentsAuthor || commentsAuthor,
      createdAt: existingIndex >= 0 ? currentReviews[existingIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    let updatedReviews: StoredReview[]
    if (existingIndex >= 0) {
      updatedReviews = [...currentReviews]
      updatedReviews[existingIndex] = { ...updatedReviews[existingIndex], ...newRecord }
    } else {
      updatedReviews = [newRecord, ...currentReviews]
    }

    await saveStoredReviews(updatedReviews)

    return NextResponse.json({ ok: true, review: newRecord })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { id, paperId, reviewerName, sanitizedCommentsAuthor, status, commentsEditor, moderationNotes } = body

    if (!id && (!paperId || !reviewerName)) {
      return NextResponse.json({ ok: false, error: "id or (paperId and reviewerName) required to patch review" }, { status: 400 })
    }

    let currentReviews = await getStoredReviews()
    let found = false

    currentReviews = currentReviews.map(r => {
      const matchId = id && r.id === id
      const matchKey = paperId && reviewerName && r.paperId.toLowerCase() === paperId.toLowerCase() && r.reviewerName.toLowerCase() === reviewerName.toLowerCase()
      if (matchId || matchKey) {
        found = true
        return {
          ...r,
          sanitizedCommentsAuthor: sanitizedCommentsAuthor !== undefined ? sanitizedCommentsAuthor : r.sanitizedCommentsAuthor,
          status: status || r.status,
          commentsEditor: commentsEditor !== undefined ? commentsEditor : r.commentsEditor,
          moderationNotes: moderationNotes !== undefined ? moderationNotes : r.moderationNotes,
          updatedAt: new Date().toISOString()
        }
      }
      return r
    })

    if (!found && id) {
      // Create released placeholder if missing
      currentReviews.push({
        id,
        paperId: paperId || "SOMED-26-RW01",
        reviewerName: reviewerName || "Verified Referee",
        status: status || "Released",
        originality: 4,
        methodology: 4,
        clarity: 4,
        significance: 4,
        commentsAuthor: sanitizedCommentsAuthor || "",
        sanitizedCommentsAuthor: sanitizedCommentsAuthor || "",
        recommendation: "Minor Revisions",
        createdAt: new Date().toISOString()
      })
    }

    await saveStoredReviews(currentReviews)

    return NextResponse.json({ ok: true, message: "Review updated in Supabase" })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
