export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"

import { readEditorialData, writeEditorialData } from "@/lib/editorial-storage"

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
  const data = await readEditorialData<{ payouts: StoredPayoutRequest[] }>(FILE_PATH, { payouts: DEFAULT_PAYOUTS })
  return Array.isArray(data?.payouts) && data.payouts.length > 0 ? data.payouts : DEFAULT_PAYOUTS
}

async function saveStoredPayouts(payouts: StoredPayoutRequest[]): Promise<void> {
  await writeEditorialData(FILE_PATH, { payouts, updatedAt: new Date().toISOString() })
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
