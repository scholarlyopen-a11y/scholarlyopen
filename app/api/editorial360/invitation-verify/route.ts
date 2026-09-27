export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const SENT_FILE_PATH = path.join(process.cwd(), "lib", "data", "sent-invitations.json")
const EDITORS_FILE_PATH = path.join(process.cwd(), "lib", "data", "editorial-board-onboarding.json")

function getSentInvitations(): any[] {
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

function getOnboardedEditors(): any[] {
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

  const sentList = getSentInvitations()
  const editorsList = getOnboardedEditors()

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

  const alreadyAccepted = !!existingEditor || matchedInvite?.status === "Accepted"

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
