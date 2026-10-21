export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export interface OnboardedEditorRecord {
  id: string
  slug?: string
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
  scopusId?: string
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

function sanitizeEditorRecords(rawList: OnboardedEditorRecord[]): OnboardedEditorRecord[] {
  const seenKeys = new Set<string>()
  const result: OnboardedEditorRecord[] = []

  for (const ed of rawList) {
    // Drop old duplicate ID EBM-2274
    if (ed.id === "EBM-2274") continue

    const normName = (ed.name || "").toLowerCase()
    const normSlug = (ed.id || ed.name || "").toLowerCase()
    const isAbdelmonsef = normName.includes("abdelmonsef") || normName.includes("aboubakr") || normSlug.includes("abdelmonsef")

    if (isAbdelmonsef) {
      if (seenKeys.has("aboubakr-haredi-abdelmonsef")) continue
      seenKeys.add("aboubakr-haredi-abdelmonsef")
      result.push({
        ...ed,
        id: "EBM-ABDELMONSEF",
        name: "Aboubakr Haredi Abdelmonsef Ahmed, Ph.D.",
        role: "Associate Editor",
        journal: "Scholarly Open: Chemistry",
        journalSlug: "chemistry",
        affiliation: "Chemistry Department, Faculty of Science, Qena University, Qena, Egypt",
        photoUrl: "/images/editors/aboubakr-abdelmonsef.png",
        orcid: "0000-0002-4616-0224",
        scopusId: "57191850843",
        linkedin: "https://www.linkedin.com/in/dr-aboubakr-h-abdelmonsef",
        email: "aboubakr.ahmed@sci.svu.edu.eg",
        status: "Active Handling Editor",
        jmApproved: true
      })
      continue
    }

    const isRabea = normName.includes("rabea") || normSlug.includes("rabea")
    if (isRabea) {
      ed.photoUrl = "/images/editors/ahmed-magdy-rabea.jpg"
    }

    const key = (ed.id || ed.email || ed.name).toLowerCase()
    if (seenKeys.has(key)) continue
    seenKeys.add(key)
    result.push(ed)
  }

  return result
}

async function getStoredEditors(): Promise<OnboardedEditorRecord[]> {
  let cloudEditors: OnboardedEditorRecord[] = []
  let localEditors: OnboardedEditorRecord[] = []

  // 1. Try Supabase Cloud Storage
  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${FILE_PATH}?t=${Date.now()}`, {
      cache: "no-store"
    })
    if (res.ok) {
      const parsed = await res.json()
      if (parsed && Array.isArray(parsed.onboardedEditors)) {
        cloudEditors = sanitizeEditorRecords(parsed.onboardedEditors)
      }
    }
  } catch (e) {
    console.warn("Supabase fetch editors warning:", e)
  }

  // 2. Fallback / local file
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, "utf-8")
      const parsed = JSON.parse(raw)
      if (parsed && Array.isArray(parsed.onboardedEditors)) {
        localEditors = sanitizeEditorRecords(parsed.onboardedEditors)
      }
    }
  } catch (e) {
    console.error("Error reading editorial-board-onboarding.json:", e)
  }

  // Overlay local over cloud so verified master records take precedence
  const map = new Map<string, OnboardedEditorRecord>()
  for (const ed of cloudEditors) {
    const key = (ed.id || ed.slug || ed.email || "").toLowerCase().trim()
    if (key) map.set(key, ed)
  }
  for (const ed of localEditors) {
    const key = (ed.id || ed.slug || ed.email || "").toLowerCase().trim()
    if (key) {
      const existing = map.get(key)
      map.set(key, { ...existing, ...ed })
    }
  }

  const merged = Array.from(map.values())
  if (merged.length > 0) {
    saveStoredEditors(merged).catch(() => {})
    return merged
  }

  return localEditors
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
