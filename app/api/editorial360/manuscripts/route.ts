export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { getDbManuscripts, upsertDbManuscript, updateDbManuscriptStatus } from "@/lib/supabase"

export async function GET() {
  try {
    const manuscripts = await getDbManuscripts()
    return NextResponse.json({ ok: true, manuscripts })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const saved = await upsertDbManuscript(body)
    if (!saved) {
      return NextResponse.json({ ok: false, error: "Failed to persist manuscript in Supabase" }, { status: 500 })
    }
    return NextResponse.json({ ok: true, manuscript: saved })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, ...updates } = await req.json()
    if (!id) {
      return NextResponse.json({ ok: false, error: "Missing manuscript id" }, { status: 400 })
    }
    const success = await updateDbManuscriptStatus(id, updates)
    return NextResponse.json({ ok: success })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}
