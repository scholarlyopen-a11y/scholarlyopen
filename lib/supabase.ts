// Supabase Cloud Database Client for Editorial360
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wrccglyypgxtuikrupkh.supabase.co"
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyY2NnbHl5cGd4dHVpa3J1cGtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4NjY1MzUsImV4cCI6MjEwNDQ0MjUzNX0.NoW6vkygKvmF8sIJmHAYPmvPmEKXqJ_m_ugt1lhPOIg"
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY

export interface DbManuscript {
  id: string
  title: string
  journal: string
  status: string
  date?: string
  author_first_name?: string
  author_last_name?: string
  author_name?: string
  author_email?: string
  author_affiliation?: string
  author_country?: string
  author_orcid?: string
  co_authors?: string
  article_type?: string
  submission_stage?: string
  abstract?: string
  keywords?: string
  file_name?: string
  file_size?: string
  cover_letter?: string
  ethics_irb?: string
  funding_grant?: string
  data_doi?: string
  integrity_status?: string
  plagiarism_score?: number
  ai_score?: number
  editor_assigned?: boolean
  assigned_editor_name?: string
  reviewers?: string[]
  created_at?: string
  updated_at?: string
}

export interface DbReview {
  id: string
  paper_id: string
  reviewer_name?: string
  reviewer_email?: string
  status?: string
  originality?: number
  methodology?: number
  clarity?: number
  significance?: number
  comments_author?: string
  comments_editor?: string
  recommendation?: string
  moderation_status?: string
  sanitized_comments_author?: string
  created_at?: string
}

// Server-side helper to fetch all manuscripts
export async function getDbManuscripts(): Promise<DbManuscript[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/manuscripts?select=*&order=created_at.desc`, {
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!res.ok) {
      console.warn("Supabase fetch manuscripts status:", res.status)
      return []
    }

    return await res.json()
  } catch (error) {
    console.error("Error fetching manuscripts from Supabase:", error)
    return []
  }
}

// Server-side helper to insert or update a manuscript
export async function upsertDbManuscript(manuscript: Partial<DbManuscript>): Promise<DbManuscript | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/manuscripts`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify(manuscript),
      cache: "no-store",
    })

    if (!res.ok) {
      const err = await res.text()
      console.error("Supabase upsert manuscript error:", res.status, err)
      return null
    }

    const data = await res.json()
    return Array.isArray(data) ? data[0] : data
  } catch (error) {
    console.error("Error saving manuscript to Supabase:", error)
    return null
  }
}

// Server-side helper to update manuscript status
export async function updateDbManuscriptStatus(id: string, updates: Partial<DbManuscript>): Promise<boolean> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/manuscripts?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ ...updates, updated_at: new Date().toISOString() }),
      cache: "no-store",
    })

    return res.ok
  } catch (error) {
    console.error("Error updating manuscript in Supabase:", error)
    return false
  }
}
