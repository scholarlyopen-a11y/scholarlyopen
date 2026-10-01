export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wrccglyypgxtuikrupkh.supabase.co"
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyY2NnbHl5cGd4dHVpa3J1cGtoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODg2NjUzNSwiZXhwIjoyMTA0NDQyNTM1fQ.H6xldZUHFnoTUajtmGdoI_E59cDh3xEADVzPiUj0L2Y"
const BUCKET = "editorial360_data"
const FILE_PATH = "payout-requests.json"

export interface StoredPayoutRequest {
  id: string
  reviewerName: string
  reviewerEmail: string
  institution?: string
  manuscriptId?: string
  amount: number
  option: string
  details: string
  requestedAt: string
  status: "Pending" | "Approved" | "Paid" | "Rejected"
}

const DEFAULT_PAYOUTS: StoredPayoutRequest[] = [
  {
    id: "SO-PAY-8821",
    reviewerName: "Dr. Marcus Vance",
    reviewerEmail: "m.vance@university-charite.de",
    institution: "Charité – Universitätsmedizin Berlin",
    manuscriptId: "SOMED-26-RW01",
    amount: 50,
    option: "bank",
    details: "Wise | Account Email: m.vance@university-charite.de | Recipient: Dr. Marcus Vance",
    requestedAt: "2026-09-29",
    status: "Pending"
  }
]

async function getStoredPayouts(): Promise<StoredPayoutRequest[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${FILE_PATH}?t=${Date.now()}`, {
      cache: "no-store"
    })
    if (res.ok) {
      const data = await res.json()
      if (data && Array.isArray(data.payouts)) {
        return data.payouts
      }
    }
  } catch (e) {
    console.warn("Supabase fetch payouts warning:", e)
  }
  return DEFAULT_PAYOUTS
}

async function saveStoredPayouts(payouts: StoredPayoutRequest[]): Promise<void> {
  try {
    await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${FILE_PATH}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        "x-upsert": "true"
      },
      body: JSON.stringify({ payouts, updatedAt: new Date().toISOString() })
    })
  } catch (err) {
    console.error("Supabase save payouts error:", err)
  }
}

export async function GET() {
  const payouts = await getStoredPayouts()
  return NextResponse.json({ ok: true, payouts, count: payouts.length })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const current = await getStoredPayouts()
    const newRecord: StoredPayoutRequest = {
      id: body.id || `SO-PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      reviewerName: body.reviewerName || "Academic Referee",
      reviewerEmail: body.reviewerEmail || "reviewer@scholarlyopen.org",
      institution: body.institution || "Academic Institution",
      manuscriptId: body.manuscriptId || "SOMED-26-RW01",
      amount: body.amount ?? 50,
      option: body.option || "bank",
      details: body.details || "",
      requestedAt: body.requestedAt || new Date().toISOString().split("T")[0],
      status: body.status || "Pending"
    }

    const updated = [newRecord, ...current.filter(p => p.id !== newRecord.id)]
    await saveStoredPayouts(updated)

    return NextResponse.json({ ok: true, payout: newRecord })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Failed to save payout request" }, { status: 500 })
  }
}
