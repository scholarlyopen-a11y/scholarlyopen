export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const DATA_FILE_PATH = path.join(process.cwd(), "lib", "data", "sent-invitations.json")

function getStoredSent(): any[] {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, "utf-8")
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed.sentInvitations) ? parsed.sentInvitations : []
    }
  } catch (e) {
    console.error("Error reading sent-invitations.json:", e)
  }
  return []
}

function saveStoredSent(items: any[]) {
  try {
    const dir = path.dirname(DATA_FILE_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify({ sentInvitations: items }, null, 2), "utf-8")
  } catch (e) {
    console.error("Error writing sent-invitations.json:", e)
  }
}

export async function GET() {
  const sent = getStoredSent()
  return NextResponse.json({ ok: true, sentInvitations: sent })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const current = getStoredSent()
    const newItems = Array.isArray(body) ? body : [body]
    
    // Deduplicate by id or (recipientEmail + subject + same day)
    const existingIds = new Set(current.map(c => c.id))
    const toAdd = newItems.filter(item => !existingIds.has(item.id))
    
    const updated = [...toAdd, ...current]
    saveStoredSent(updated)
    return NextResponse.json({ ok: true, count: updated.length })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Failed to save sent invitation" }, { status: 500 })
  }
}
