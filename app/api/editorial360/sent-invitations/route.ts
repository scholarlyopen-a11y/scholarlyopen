export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wrccglyypgxtuikrupkh.supabase.co"
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyY2NnbHl5cGd4dHVpa3J1cGtoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODg2NjUzNSwiZXhwIjoyMTA0NDQyNTM1fQ.H6xldZUHFnoTUajtmGdoI_E59cDh3xEADVzPiUj0L2Y"
const BUCKET = "editorial360_data"
const FILE_PATH = "sent-invitations.json"

const LOCAL_DATA_PATH = path.join(process.cwd(), "lib", "data", "sent-invitations.json")

// Helper: Read sent invitations from Supabase Cloud Storage (primary) or local file (fallback)
async function getStoredSent(): Promise<any[]> {
  // 1. Try Supabase Cloud Storage (persistent across all Vercel lambdas & users)
  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${FILE_PATH}?t=${Date.now()}`, {
      cache: "no-store"
    })
    if (res.ok) {
      const data = await res.json()
      if (data && Array.isArray(data.sentInvitations)) {
        return data.sentInvitations
      }
    }
  } catch (e) {
    console.warn("Supabase fetch sent-invitations warning:", e)
  }

  // 2. Fallback to local file if available
  try {
    if (fs.existsSync(LOCAL_DATA_PATH)) {
      const raw = fs.readFileSync(LOCAL_DATA_PATH, "utf-8")
      const parsed = JSON.parse(raw)
      if (parsed && Array.isArray(parsed.sentInvitations)) {
        return parsed.sentInvitations
      }
    }
  } catch (e) {
    console.error("Local read sent-invitations error:", e)
  }

  return []
}

// Helper: Save sent invitations to Supabase Cloud Storage (primary) and local file (secondary)
async function saveStoredSent(items: any[]): Promise<boolean> {
  let cloudSuccess = false

  // 1. Save to Supabase Cloud Storage
  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${FILE_PATH}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        "x-upsert": "true"
      },
      body: JSON.stringify({ sentInvitations: items, lastUpdated: new Date().toISOString() })
    })
    cloudSuccess = res.ok
    if (!res.ok) {
      console.warn("Supabase save sent-invitations status:", res.status, await res.text().catch(() => ""))
    }
  } catch (e) {
    console.error("Supabase save sent-invitations error:", e)
  }

  // 2. Also save to local file for dev environment
  try {
    const dir = path.dirname(LOCAL_DATA_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(LOCAL_DATA_PATH, JSON.stringify({ sentInvitations: items }, null, 2), "utf-8")
  } catch (e) {
    // Non-fatal on Vercel read-only filesystem
  }

  return cloudSuccess
}

export async function GET() {
  const sent = await getStoredSent()
  return NextResponse.json({ ok: true, sentInvitations: sent, count: sent.length })
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
