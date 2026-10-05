export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wrccglyypgxtuikrupkh.supabase.co"
const BUCKET = "editorial360_data"
const SENT_FILE = "sent-invitations.json"
const EDITORS_FILE = "editorial-board-onboarding.json"

const SENT_FILE_PATH = path.join(process.cwd(), "lib", "data", "sent-invitations.json")
const EDITORS_FILE_PATH = path.join(process.cwd(), "lib", "data", "editorial-board-onboarding.json")

async function getSentInvitations(): Promise<any[]> {
  // 1. Try Supabase Cloud Storage
  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${SENT_FILE}?t=${Date.now()}`, { cache: "no-store" })
    if (res.ok) {
      const parsed = await res.json()
      if (parsed && Array.isArray(parsed.sentInvitations)) return parsed.sentInvitations
    }
  } catch (e) {}

  // 2. Local fallback
  try {
    if (fs.existsSync(SENT_FILE_PATH)) {
      const raw = fs.readFileSync(SENT_FILE_PATH, "utf-8")
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed.sentInvitations) ? parsed.sentInvitations : []
    }
  } catch (e) {
    console.error("Error reading sent invitations:", e)
  }
  return []
}

async function getOnboardedEditors(): Promise<any[]> {
  // 1. Try Supabase Cloud Storage
  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${EDITORS_FILE}?t=${Date.now()}`, { cache: "no-store" })
    if (res.ok) {
      const parsed = await res.json()
      if (parsed && Array.isArray(parsed.onboardedEditors)) return parsed.onboardedEditors
    }
  } catch (e) {}

  // 2. Local fallback
  try {
    if (fs.existsSync(EDITORS_FILE_PATH)) {
      const raw = fs.readFileSync(EDITORS_FILE_PATH, "utf-8")
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed.onboardedEditors) ? parsed.onboardedEditors : []
    }
  } catch (e) {
    console.error("Error reading onboarded editors:", e)
  }
  return []
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get("token") || searchParams.get("invite") || ""
  const name = searchParams.get("name") || ""
  const email = searchParams.get("email") || ""
  const journal = searchParams.get("journal") || ""

  const [sentList, editorsList] = await Promise.all([
    getSentInvitations(),
    getOnboardedEditors()
  ])

  // 1. Find matching invitation record
  let matchedInvite: any = null

  if (token) {
    matchedInvite = sentList.find(s => s.id === token || s.token === token)
  }

  if (!matchedInvite && email) {
    matchedInvite = sentList.find(s => s.recipientEmail && s.recipientEmail.toLowerCase() === email.toLowerCase())
  }

  if (!matchedInvite && name) {
    const cleanName = name.replace(/^(Prof\.|Dr\.|Associate Prof\.|Assoc\.|Mr\.|Ms\.)\s*/i, "").trim().toLowerCase()
    matchedInvite = sentList.find(s => {
      const sName = (s.recipientName || "").replace(/^(Prof\.|Dr\.|Associate Prof\.|Assoc\.|Mr\.|Ms\.)\s*/i, "").trim().toLowerCase()
      return sName.length > 2 && (sName.includes(cleanName) || cleanName.includes(sName))
    })
  }

  // 2. Check if already accepted
  let existingEditor: any = null
  if (matchedInvite?.recipientEmail) {
    existingEditor = editorsList.find(e => e.email?.toLowerCase() === matchedInvite.recipientEmail.toLowerCase())
  }
  if (!existingEditor && email) {
    existingEditor = editorsList.find(e => e.email?.toLowerCase() === email.toLowerCase())
  }
  if (!existingEditor && name) {
    const cleanName = name.replace(/^(Prof\.|Dr\.|Associate Prof\.|Assoc\.|Mr\.|Ms\.)\s*/i, "").trim().toLowerCase()
    existingEditor = editorsList.find(e => {
      const eName = (e.name || "").replace(/^(Prof\.|Dr\.|Associate Prof\.|Assoc\.|Mr\.|Ms\.)\s*/i, "").trim().toLowerCase()
      return eName.length > 2 && (eName.includes(cleanName) || cleanName.includes(eName))
    })
  }

  const redo = searchParams.get("redo") === "true" || searchParams.get("reset") === "true" || searchParams.get("force") === "true"

  // Only lock as alreadyAccepted if the editor has already been formally approved by Journal Manager
  // or is active, and redo/force was not requested. If pending approval, let them update/re-complete!
  const isApproved = existingEditor?.jmApproved === true || existingEditor?.status === "Active Handling Editor"
  const alreadyAccepted = !redo && (isApproved || (matchedInvite?.status === "Accepted" && isApproved))

  return NextResponse.json({
    ok: true,
    alreadyAccepted,
    acceptedAt: existingEditor?.acceptedAt || matchedInvite?.acceptedAt || null,
    invite: matchedInvite ? {
      id: matchedInvite.id,
      recipientName: matchedInvite.recipientName,
      recipientEmail: matchedInvite.recipientEmail,
      journal: matchedInvite.journal || journal,
      campaignType: matchedInvite.campaignType || "ebm",
      status: matchedInvite.status || (alreadyAccepted ? "Accepted" : "Delivered")
    } : null,
    editor: existingEditor ? {
      name: existingEditor.name,
      email: existingEditor.email,
      journal: existingEditor.journal,
      role: existingEditor.role,
      affiliation: existingEditor.affiliation,
      acceptedAt: existingEditor.acceptedAt
    } : null
  })
}
