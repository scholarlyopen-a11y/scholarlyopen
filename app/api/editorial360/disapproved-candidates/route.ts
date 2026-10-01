export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wrccglyypgxtuikrupkh.supabase.co"
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyY2NnbHl5cGd4dHVpa3J1cGtoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODg2NjUzNSwiZXhwIjoyMTA0NDQyNTM1fQ.H6xldZUHFnoTUajtmGdoI_E59cDh3xEADVzPiUj0L2Y"
const BUCKET = "editorial360_data"
const FILE_PATH = "disapproved-candidates.json"
const LOCAL_DATA_PATH = path.join(process.cwd(), "lib", "data", "disapproved-candidates.json")

export interface DisapprovedCandidateRecord {
  id: string
  name: string
  email: string
  orcid?: string
  institution?: string
  credentialId?: string
  disapprovedAt: string
  disapprovedBy?: string
  status: "Disapproved" | "Revoked" | "Purged / Watchlisted"
  reason?: string
  notes?: string
}

export async function getStoredDisapproved(): Promise<DisapprovedCandidateRecord[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${FILE_PATH}?t=${Date.now()}`, {
      cache: "no-store"
    })
    if (res.ok) {
      const data = await res.json()
      if (data && Array.isArray(data.disapproved)) {
        return data.disapproved
      }
    }
  } catch (e) {
    console.warn("Supabase fetch disapproved candidates warning:", e)
  }

  try {
    if (fs.existsSync(LOCAL_DATA_PATH)) {
      const raw = fs.readFileSync(LOCAL_DATA_PATH, "utf-8")
      const data = JSON.parse(raw)
      if (data && Array.isArray(data.disapproved)) {
        return data.disapproved
      }
    }
  } catch (e) {}

  return []
}

export async function saveStoredDisapproved(records: DisapprovedCandidateRecord[]): Promise<void> {
  const payload = {
    disapproved: records,
    lastUpdated: new Date().toISOString()
  }

  try {
    await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${FILE_PATH}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        "x-upsert": "true"
      },
      body: JSON.stringify(payload)
    })
  } catch (e) {
    console.error("Supabase save disapproved candidates error:", e)
  }

  try {
    fs.writeFileSync(LOCAL_DATA_PATH, JSON.stringify(payload, null, 2), "utf-8")
  } catch (e) {}
}

export async function GET() {
  const records = await getStoredDisapproved()
  return NextResponse.json({ success: true, disapproved: records, total: records.length })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, orcid, institution, credentialId, reason, status = "Disapproved", notes } = body

    if (!email) {
      return NextResponse.json({ success: false, error: "Candidate email is required" }, { status: 400 })
    }

    const records = await getStoredDisapproved()
    const cleanEmail = email.trim().toLowerCase()
    const existingIndex = records.findIndex(r => r.email.toLowerCase() === cleanEmail)

    const newRecord: DisapprovedCandidateRecord = {
      id: existingIndex >= 0 ? records[existingIndex].id : `WATCH-${Date.now().toString().slice(-6)}`,
      name: name || (existingIndex >= 0 ? records[existingIndex].name : "Unknown Candidate"),
      email: cleanEmail,
      orcid: orcid || (existingIndex >= 0 ? records[existingIndex].orcid : undefined),
      institution: institution || (existingIndex >= 0 ? records[existingIndex].institution : undefined),
      credentialId: credentialId || (existingIndex >= 0 ? records[existingIndex].credentialId : undefined),
      disapprovedAt: new Date().toISOString(),
      disapprovedBy: "Journal Manager",
      status: status || "Disapproved",
      reason: reason || "Identity unverified / Disapproved by JM",
      notes: notes || undefined
    }

    let updatedRecords: DisapprovedCandidateRecord[]
    if (existingIndex >= 0) {
      updatedRecords = [...records]
      updatedRecords[existingIndex] = { ...updatedRecords[existingIndex], ...newRecord }
    } else {
      updatedRecords = [newRecord, ...records]
    }

    await saveStoredDisapproved(updatedRecords)
    return NextResponse.json({ success: true, record: newRecord, total: updatedRecords.length })
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

    let records = await getStoredDisapproved()
    records = records.filter(r => {
      if (email && r.email.toLowerCase() === email) return false
      if (id && r.id === id) return false
      return true
    })

    await saveStoredDisapproved(records)
    return NextResponse.json({ success: true, total: records.length })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
