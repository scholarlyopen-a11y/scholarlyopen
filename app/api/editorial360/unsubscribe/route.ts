export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wrccglyypgxtuikrupkh.supabase.co"
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyY2NnbHl5cGd4dHVpa3J1cGtoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODg2NjUzNSwiZXhwIjoyMTA0NDQyNTM1fQ.H6xldZUHFnoTUajtmGdoI_E59cDh3xEADVzPiUj0L2Y"
const BUCKET = "editorial360_data"
const FILE_PATH = "unsubscribed.json"

export interface UnsubscribeRecord {
  email: string
  journal?: string
  timestamp: string
  reason?: string
}

let memoryCache: UnsubscribeRecord[] = []

async function getStoredUnsubscribed(): Promise<UnsubscribeRecord[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${FILE_PATH}?t=${Date.now()}`, {
      cache: "no-store"
    })
    if (res.ok) {
      const data = await res.json()
      if (data && Array.isArray(data.unsubscribed)) {
        memoryCache = data.unsubscribed
        return data.unsubscribed
      }
    }
  } catch (e) {
    console.warn("Supabase fetch unsubscribed warning:", e)
  }
  return memoryCache
}

async function saveStoredUnsubscribed(list: UnsubscribeRecord[]): Promise<void> {
  memoryCache = list
  try {
    await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${FILE_PATH}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        "x-upsert": "true"
      },
      body: JSON.stringify({ unsubscribed: list, updatedAt: new Date().toISOString() })
    })
  } catch (err) {
    console.error("Supabase save unsubscribed error:", err)
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = (searchParams.get("email") || "").trim().toLowerCase()
  const journal = searchParams.get("journal") || "All Journals"
  const format = searchParams.get("format")

  let list = await getStoredUnsubscribed()

  if (format === "json") {
    return NextResponse.json({
      success: true,
      unsubscribed: list
    })
  }

  if (email) {
    if (!list.some(u => u.email === email)) {
      list.push({
        email,
        journal,
        timestamp: new Date().toISOString(),
        reason: "User unsubscribed via email link"
      })
      await saveStoredUnsubscribed(list)
    }

    // Return HTML confirmation page
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribe Confirmation - Scholarly Open</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; color: #1e293b; margin: 0; padding: 40px 20px; display: flex; align-items: center; justify-content: center; min-height: 80vh; }
    .card { max-width: 520px; width: 100%; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 36px 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); text-align: center; }
    .icon { width: 54px; height: 54px; border-radius: 50%; background: #ecfdf5; color: #059669; display: flex; align-items: center; justify-content: center; font-size: 26px; margin: 0 auto 20px auto; }
    h1 { font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 10px 0; }
    p { font-size: 14px; line-height: 1.6; color: #64748b; margin: 0 0 20px 0; }
    .highlight { background: #f1f5f9; border-radius: 8px; padding: 10px 14px; font-family: monospace; font-size: 13px; color: #334155; display: inline-block; margin-bottom: 24px; word-break: break-all; }
    .btn { display: inline-block; background: #0b99ff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; }
    .footer { font-size: 11px; color: #94a3b8; margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 18px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">✓</div>
    <h1>You Have Been Unsubscribed</h1>
    <p>Your email address has been removed from future editorial invitations and calls for papers for <strong>${journal}</strong>.</p>
    <div class="highlight">${email}</div>
    <div>
      <a href="https://www.scholarlyopen.org" class="btn">Return to Scholarly Open</a>
    </div>
    <div class="footer">
      Scholarly Open Publishing Group • Mainz, Germany<br>
      Adhering to COPE Ethical Standards & CAN-SPAM / GDPR Regulations
    </div>
  </div>
</body>
</html>`

    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    })
  }

  return NextResponse.json({
    success: true,
    unsubscribed: list
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = (body.email || "").trim().toLowerCase()
    const journal = body.journal || "All Journals"
    const reason = body.reason || "Manual opt-out by Journal Manager"

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    let list = await getStoredUnsubscribed()

    if (body.action === "remove") {
      list = list.filter(u => u.email !== email)
      await saveStoredUnsubscribed(list)
      return NextResponse.json({ success: true, action: "removed", email })
    }

    if (!list.some(u => u.email === email)) {
      list.push({
        email,
        journal,
        timestamp: new Date().toISOString(),
        reason
      })
      await saveStoredUnsubscribed(list)
    }

    return NextResponse.json({
      success: true,
      action: "added",
      record: { email, journal, reason, timestamp: new Date().toISOString() }
    })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
