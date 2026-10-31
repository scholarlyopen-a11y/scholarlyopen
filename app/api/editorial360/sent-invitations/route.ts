export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

import { readEditorialData, writeEditorialData, isCloudRestricted } from "@/lib/editorial-storage"

const FILE_PATH = "sent-invitations.json"

// Helper: Read sent invitations using unified storage layer with local file fallback
async function getStoredSent(): Promise<any[]> {
  const data = await readEditorialData<{ sentInvitations: any[] }>(FILE_PATH, { sentInvitations: [] })
  return Array.isArray(data?.sentInvitations) ? data.sentInvitations : []
}

// Helper: Save sent invitations using unified storage layer with local file fallback
async function saveStoredSent(items: any[]): Promise<boolean> {
  return await writeEditorialData(FILE_PATH, { sentInvitations: items, lastUpdated: new Date().toISOString() })
}


export async function GET() {
  const sent = await getStoredSent()
  return NextResponse.json({
    ok: true,
    sentInvitations: sent,
    count: sent.length,
    cloudOnline: !isCloudRestricted()
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const current = await getStoredSent()
    const newItems = Array.isArray(body) ? body : [body]

    // Deduplicate by ID and (recipientEmail + subject)
    const existingIds = new Set(current.map(c => c.id))
    const existingKeys = new Set(current.map(c => `${(c.recipientEmail || "").toLowerCase()}::${c.subject || ""}`))

    const toAdd = newItems.filter(item => {
      if (item.id && existingIds.has(item.id)) return false
      const key = `${(item.recipientEmail || "").toLowerCase()}::${item.subject || ""}`
      if (existingKeys.has(key)) return false
      return true
    })

    const updated = [...toAdd, ...current]
    await saveStoredSent(updated)

    return NextResponse.json({ ok: true, count: updated.length, added: toAdd.length })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Failed to save sent invitation" }, { status: 500 })
  }
}
