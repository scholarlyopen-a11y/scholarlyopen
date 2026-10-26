export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

import { readEditorialData, writeEditorialData } from "@/lib/editorial-storage"

const FILE_PATH = "disapproved-candidates.json"

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
  const data = await readEditorialData<{ disapproved: DisapprovedCandidateRecord[] }>(FILE_PATH, { disapproved: [] })
  return Array.isArray(data?.disapproved) ? data.disapproved : []
}

export async function saveStoredDisapproved(records: DisapprovedCandidateRecord[]): Promise<void> {
  const payload = {
    disapproved: records,
    lastUpdated: new Date().toISOString()
  }
  await writeEditorialData(FILE_PATH, payload)
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
