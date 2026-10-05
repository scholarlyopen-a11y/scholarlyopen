export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export interface OnboardedEditorRecord {
  id: string
  name: string
  email: string
  role: string
  journal: string
  journalSlug?: string
  affiliation: string
  department?: string
  country?: string
  specialization?: string
  researchInterests?: string[]
  biography?: string
  photoUrl?: string
  cvFileName?: string
  cvFileSize?: string
  orcid?: string
  googleScholar?: string
  researchGate?: string
  linkedin?: string
  publications?: Array<{ title: string; journal?: string; year?: string; doi?: string }>
  hasAcceptedTerms: boolean
  consentProfileUpload: boolean
  status: string
  jmApproved?: boolean
  acceptedAt: string
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wrccglyypgxtuikrupkh.supabase.co"
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyY2NnbHl5cGd4dHVpa3J1cGtoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODg2NjUzNSwiZXhwIjoyMTA0NDQyNTM1fQ.H6xldZUHFnoTUajtmGdoI_E59cDh3xEADVzPiUj0L2Y"
const BUCKET = "editorial360_data"
const FILE_PATH = "editorial-board-onboarding.json"

const DATA_FILE_PATH = path.join(process.cwd(), "lib", "data", "editorial-board-onboarding.json")

async function getStoredEditors(): Promise<OnboardedEditorRecord[]> {
  // 1. Try Supabase Cloud Storage
  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${FILE_PATH}?t=${Date.now()}`, {
      cache: "no-store"
    })
    if (res.ok) {
      const parsed = await res.json()
      if (parsed && Array.isArray(parsed.onboardedEditors)) {
        return parsed.onboardedEditors
      }
    }
  } catch (e) {
    console.warn("Supabase fetch editors warning:", e)
  }

  // 2. Fallback to local file
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, "utf-8")
      const parsed = JSON.parse(raw)
      if (parsed && Array.isArray(parsed.onboardedEditors)) {
        return parsed.onboardedEditors
      }
    }
  } catch (e) {
    console.error("Error reading editorial-board-onboarding.json:", e)
  }
  return []
}

async function saveStoredEditors(editors: OnboardedEditorRecord[]) {
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
      body: JSON.stringify({ onboardedEditors: editors, lastUpdated: new Date().toISOString() })
    })
  } catch (e) {
    console.error("Supabase save editors error:", e)
  }

  // 2. Local fallback
  try {
    const dir = path.dirname(DATA_FILE_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify({ onboardedEditors: editors }, null, 2), "utf-8")
  } catch (e) {
    // Non-fatal on Vercel
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")
    const journal = searchParams.get("journal")

    let editors = await getStoredEditors()

    if (email) {
      editors = editors.filter(e => e.email.toLowerCase() === email.toLowerCase())
    }
    if (journal) {
      const jLower = journal.toLowerCase()
      editors = editors.filter(e => 
        (e.journal && e.journal.toLowerCase().includes(jLower)) ||
        (e.journalSlug && e.journalSlug.toLowerCase() === jLower)
      )
    }

    return NextResponse.json({ success: true, editors, total: editors.length })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      name,
      email,
      role = "Editorial Board Member & Handling Editor",
      journal = "Scholarly Open",
      affiliation,
      department,
      country,
      specialization,
      researchInterests = [],
      biography,
      photoUrl,
      cvFileName,
      cvFileSize,
      orcid,
      googleScholar,
      researchGate,
      linkedin,
      publications = [],
      hasAcceptedTerms = true,
      consentProfileUpload = true,
      jmApproved = false
    } = body

    if (!name || !email) {
      return NextResponse.json({ success: false, error: "Name and email are required" }, { status: 400 })
    }

    const currentEditors = await getStoredEditors()
    const existingIndex = currentEditors.findIndex(e => e.email.toLowerCase() === email.toLowerCase())

    const newRecord: OnboardedEditorRecord = {
      id: existingIndex >= 0 ? currentEditors[existingIndex].id : `EBM-${Date.now().toString().slice(-4)}`,
      name,
      email,
      role,
      journal,
      journalSlug: journal.toLowerCase().replace("scholarly open:", "").trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      affiliation: affiliation || "Academic Institution",
      department: department || "",
      country: country || "",
      specialization: specialization || (researchInterests.length > 0 ? researchInterests.join(", ") : "Academic Research"),
      researchInterests: Array.isArray(researchInterests) ? researchInterests : [],
      biography: biography || "",
      photoUrl: photoUrl || "",
      cvFileName: cvFileName || "",
      cvFileSize: cvFileSize || "",
      orcid: orcid || "",
      googleScholar: googleScholar || "",
      researchGate: researchGate || "",
      linkedin: linkedin || "",
      publications: Array.isArray(publications) ? publications : [],
      hasAcceptedTerms: !!hasAcceptedTerms,
      consentProfileUpload: !!consentProfileUpload,
      status: jmApproved ? "Active Handling Editor" : "Pending JM Approval",
      jmApproved: Boolean(jmApproved),
      acceptedAt: new Date().toISOString()
    }

    let updatedEditors: OnboardedEditorRecord[]
    if (existingIndex >= 0) {
      updatedEditors = [...currentEditors]
      updatedEditors[existingIndex] = newRecord
    } else {
      updatedEditors = [newRecord, ...currentEditors]
    }

    await saveStoredEditors(updatedEditors)

    return NextResponse.json({ success: true, record: newRecord })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { id, email, jmApproved, status } = body

    const currentEditors = await getStoredEditors()
    const index = currentEditors.findIndex(e => (id && e.id === id) || (email && e.email.toLowerCase() === email.toLowerCase()))

    if (index < 0) {
      return NextResponse.json({ success: false, error: "Editor not found" }, { status: 404 })
    }

    if (typeof jmApproved === "boolean") {
      currentEditors[index].jmApproved = jmApproved
      currentEditors[index].status = jmApproved ? "Active Handling Editor" : "Pending JM Approval"
    }
    if (status) {
      currentEditors[index].status = status
    }

    await saveStoredEditors(currentEditors)
    return NextResponse.json({ success: true, record: currentEditors[index] })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const email = searchParams.get("email")

    if (!id && !email) {
      return NextResponse.json({ success: false, error: "ID or email required to delete" }, { status: 400 })
    }

    let currentEditors = await getStoredEditors()
    currentEditors = currentEditors.filter(e => {
      if (id && e.id === id) return false
      if (email && e.email.toLowerCase() === email.toLowerCase()) return false
      return true
    })

    await saveStoredEditors(currentEditors)
    return NextResponse.json({ success: true, remaining: currentEditors.length })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
