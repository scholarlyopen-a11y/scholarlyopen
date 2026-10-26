export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

import { readEditorialData } from "@/lib/editorial-storage"

const SENT_FILE = "sent-invitations.json"
const EDITORS_FILE = "editorial-board-onboarding.json"

async function getSentInvitations(): Promise<any[]> {
  const data = await readEditorialData<{ sentInvitations: any[] }>(SENT_FILE, { sentInvitations: [] })
  return Array.isArray(data?.sentInvitations) ? data.sentInvitations : []
}

async function getOnboardedEditors(): Promise<any[]> {
  const data = await readEditorialData<{ onboardedEditors: any[] }>(EDITORS_FILE, { onboardedEditors: [] })
  return Array.isArray(data?.onboardedEditors) ? data.onboardedEditors : []
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
