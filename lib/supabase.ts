// Supabase Cloud Database Client for Editorial360 with Local Persistence Fallback
import fs from "fs"
import path from "path"
import { getActiveSupabaseUrl, getActiveSupabaseAnonKey, getActiveSupabaseServiceKey } from "@/lib/supabase-config"

const SUPABASE_URL = getActiveSupabaseUrl()
const SUPABASE_ANON_KEY = getActiveSupabaseAnonKey()
const SUPABASE_SERVICE_KEY = getActiveSupabaseServiceKey()


const LOCAL_MANUSCRIPTS_FILE = path.join(process.cwd(), "lib", "data", "manuscripts.json")

// Circuit breaker to avoid spamming restricted/sleeping Supabase instances
let lastRestrictedTime = 0
const RESTRICTION_COOLDOWN_MS = 60000 // Check at most once per minute if restricted

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
  file_url?: string
  revised_file_url?: string
  rebuttal_file_url?: string
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

// Helpers for local filesystem fallback
function getLocalManuscripts(): DbManuscript[] {
  try {
    if (fs.existsSync(LOCAL_MANUSCRIPTS_FILE)) {
      const data = fs.readFileSync(LOCAL_MANUSCRIPTS_FILE, "utf-8")
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed)) {
        return parsed.map((m: any) => {
          let file_url = m.file_url
          if (!file_url) {
            if (m.id === "SOCHEM-26-RW101" || m.title?.toLowerCase().includes("mof")) {
              file_url = "https://lfnwqbzcwticwdjowsmv.supabase.co/storage/v1/object/public/manuscripts/SOCHEM-26-RW101/manuscript-MOFs_FV.docx"
            } else if (m.id === "SOMED-26-RW01" || m.title?.toLowerCase().includes("prevent earlier") || m.title?.toLowerCase().includes("acute aortic")) {
              file_url = "/manuscripts/SOMED-26-RW01-revised-manuscript.docx"
            } else if (m.file_name) {
              file_url = `/manuscripts/${m.file_name}`
            }
          }
          return { ...m, file_url }
        })
      }
    }
  } catch (e) {
    console.warn("Could not read local manuscripts file:", e)
  }
  return [
    {
      id: "SOMED-26-RW01",
      title: "Prevent Earlier, Recognize Sooner, Treat Faster: An Evidence-Based Healthcare Operations Approach to Acute Aortic Dissection",
      journal: "Scholarly Open: Medicine",
      status: "Revision Under Evaluation",
      submission_stage: "Revision Under Evaluation",
      author_first_name: "Sam",
      author_last_name: "Lee",
      author_name: "Dr. Sam Lee",
      author_email: "Applied.EBM.Institute@proton.me",
      author_affiliation: "Applied Evidence-Based Medicine (EBM) Institute",
      author_country: "United States",
      file_name: "Sam_Lee_Acute_Aortic_Dissection_EBM_Manuscript.docx",
      file_size: "39.5 KB",
      file_url: "/manuscripts/SOMED-26-RW01-revised-manuscript.docx",
      revised_file_url: "/manuscripts/SOMED-26-RW01-revised-manuscript.docx",
      rebuttal_file_url: "/manuscripts/SOMED-26-RW01-rebuttal.docx",
      assigned_editor_name: "Weihua Gong, M.D., Ph.D.",
      date: "2026-09-27",
      integrity_status: "Clean",
      plagiarism_score: 4,
      ai_score: 2,
      created_at: "2026-09-27T10:00:00Z",
      updated_at: new Date().toISOString()
    },
    {
      id: "SOCHEM-26-RW101",
      title: "Recent advances in the application of MOF-based adsorbents for toxic dye removal from wastewater and their mechanism",
      journal: "Scholarly Open: Chemistry",
      status: "Awaiting Initial Check",
      submission_stage: "Initial Submission",
      author_first_name: "Francis",
      author_last_name: "Verpoort",
      author_name: "Francis Verpoort",
      author_email: "francis@whut.edu.cn",
      author_affiliation: "Wuhan University of Technology, Department of Materials Science and Engineering",
      author_country: "China",
      author_orcid: "0000-0002-5184-5500",
      co_authors: "Maira Aslam, Laiba, Muhammad Zain Ashiq, Ayesha Noreen, Muhammad Imtiaz",
      article_type: "Review",
      file_name: "manuscript-MOFs_FV.docx",
      file_size: "4.4 MB",
      file_url: "/manuscripts/SOCHEM-26-RW101-manuscript.docx",
      ethics_irb: "None declared / Not applicable",
      funding_grant: "No external funding declared",
      data_doi: "Available upon reasonable request",
      integrity_status: "Clean",
      plagiarism_score: 0,
      ai_score: 0,
      editor_assigned: false,
      assigned_editor_name: undefined,
      reviewers: [],
      created_at: "2026-11-27T07:42:53.666Z",
      updated_at: new Date().toISOString()
    }
  ]
}

function saveLocalManuscripts(manuscripts: DbManuscript[]) {
  try {
    const dir = path.dirname(LOCAL_MANUSCRIPTS_FILE)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(LOCAL_MANUSCRIPTS_FILE, JSON.stringify(manuscripts, null, 2), "utf-8")
  } catch (e) {
    console.warn("Could not save to local manuscripts file:", e)
  }
}

// Server-side helper to fetch all manuscripts
export async function getDbManuscripts(): Promise<DbManuscript[]> {
  const now = Date.now()
  if (now - lastRestrictedTime < RESTRICTION_COOLDOWN_MS) {
    return getLocalManuscripts()
  }

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
      if (res.status === 402 || res.status === 429) {
        lastRestrictedTime = now
      }
      return getLocalManuscripts()
    }

    const remote = await res.json()
    if (Array.isArray(remote) && remote.length > 0) {
      // Ensure file_url and file paths are populated for each manuscript
      const enriched = remote.map((m: any) => {
        let file_url = m.file_url
        if (!file_url) {
          if (m.id === "SOCHEM-26-RW101" || m.title?.toLowerCase().includes("mof")) {
            file_url = "https://lfnwqbzcwticwdjowsmv.supabase.co/storage/v1/object/public/manuscripts/SOCHEM-26-RW101/manuscript-MOFs_FV.docx"
          } else if (m.id === "SOMED-26-RW01" || m.title?.toLowerCase().includes("prevent earlier") || m.title?.toLowerCase().includes("acute aortic")) {
            file_url = "/manuscripts/SOMED-26-RW01-revised-manuscript.docx"
          } else if (m.file_name) {
            file_url = `/manuscripts/${m.file_name}`
          }
        }
        return {
          ...m,
          file_url,
          revised_file_url: m.revised_file_url || (m.id === "SOMED-26-RW01" ? "/manuscripts/SOMED-26-RW01-revised-manuscript.docx" : undefined),
          rebuttal_file_url: m.rebuttal_file_url || (m.id === "SOMED-26-RW01" ? "/manuscripts/SOMED-26-RW01-rebuttal.docx" : undefined)
        }
      })
      // Sync local file with enriched records
      saveLocalManuscripts(enriched)
      return enriched
    }
  } catch (error) {
    lastRestrictedTime = now
    console.warn("Supabase fetch fallback to local:", error)
  }
  return getLocalManuscripts()
}

// Server-side helper to insert or update a manuscript
export async function upsertDbManuscript(manuscript: Partial<DbManuscript>): Promise<DbManuscript | null> {
  const localList = getLocalManuscripts()
  const existingIdx = localList.findIndex(m => m.id === manuscript.id)
  const fullRecord: DbManuscript = {
    ...(existingIdx >= 0 ? localList[existingIdx] : {}),
    ...manuscript,
    id: manuscript.id || `MANUSCRIPT-${Date.now()}`,
    title: manuscript.title || "Untitled Manuscript",
    journal: manuscript.journal || "Scholarly Open",
    status: manuscript.status || "Under Review",
    updated_at: new Date().toISOString()
  } as DbManuscript

  if (existingIdx >= 0) {
    localList[existingIdx] = fullRecord
  } else {
    localList.unshift(fullRecord)
  }
  saveLocalManuscripts(localList)

  // Try to sync to Supabase if not on restriction cooldown
  const now = Date.now()
  if (now - lastRestrictedTime >= RESTRICTION_COOLDOWN_MS) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/manuscripts`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates,return=representation",
        },
        body: JSON.stringify(fullRecord),
        cache: "no-store",
      })

      if (!res.ok && (res.status === 402 || res.status === 429)) {
        lastRestrictedTime = now
      } else if (res.ok) {
        const data = await res.json()
        return Array.isArray(data) ? data[0] : data
      }
    } catch (e) {
      console.warn("Could not sync upsert to Supabase, persisted locally:", e)
    }
  }

  return fullRecord
}

// Server-side helper to update manuscript status
export async function updateDbManuscriptStatus(id: string, updates: Partial<DbManuscript>): Promise<boolean> {
  const localList = getLocalManuscripts()
  const idx = localList.findIndex(m => m.id === id)
  if (idx >= 0) {
    localList[idx] = {
      ...localList[idx],
      ...updates,
      updated_at: new Date().toISOString()
    }
    saveLocalManuscripts(localList)
  }

  const now = Date.now()
  if (now - lastRestrictedTime >= RESTRICTION_COOLDOWN_MS) {
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

      if (!res.ok && (res.status === 402 || res.status === 429)) {
        lastRestrictedTime = now
      }
      return true
    } catch (e) {
      console.warn("Supabase update error, persisted locally:", e)
    }
  }

  return true
}

// Server-side helper to delete a manuscript
export async function deleteDbManuscript(id: string): Promise<boolean> {
  const localList = getLocalManuscripts().filter(m => m.id !== id)
  saveLocalManuscripts(localList)

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/manuscripts?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      cache: "no-store",
    })
  } catch (e) {}

  return true
}
