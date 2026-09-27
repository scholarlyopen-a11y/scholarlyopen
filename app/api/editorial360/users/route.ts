export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export interface StoredUserRecord {
  id: string
  name: string
  email: string
  role: string
  affiliation?: string
  country?: string
  orcid?: string
  status: string
  createdAt: string
  passwordHash?: string
}

const DATA_FILE_PATH = path.join(process.cwd(), "lib", "data", "users.json")

function getStoredUsers(): StoredUserRecord[] {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, "utf-8")
      const parsed = JSON.parse(raw)
      if (parsed && Array.isArray(parsed.users)) {
        return parsed.users
      }
    }
  } catch (e) {
    console.error("Error reading users.json:", e)
  }
  return [
    {
      id: "USR-01",
      name: "Dr. Marcus Vance",
      email: "m.vance@scholarlyopen.org",
      role: "reviewer",
      affiliation: "Scholarly Open Verified Reviewer Community",
      country: "United Kingdom",
      status: "Active",
      createdAt: "2026-01-15T10:00:00.000Z"
    },
    {
      id: "USR-02",
      name: "Prof. Aris Thorne",
      email: "a.thorne@scholarlyopen.org",
      role: "editor",
      affiliation: "Charité – Universitätsmedizin Berlin",
      country: "Germany",
      status: "Active",
      createdAt: "2026-01-15T10:00:00.000Z"
    }
  ]
}

function saveStoredUsers(users: StoredUserRecord[]) {
  try {
    const dir = path.dirname(DATA_FILE_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify({ users }, null, 2), "utf-8")
  } catch (e) {
    console.error("Error saving users.json:", e)
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")
    const role = searchParams.get("role")

    let users = getStoredUsers()

    if (email) {
      users = users.filter(u => u.email.toLowerCase() === email.toLowerCase())
    }
    if (role) {
      users = users.filter(u => u.role.toLowerCase() === role.toLowerCase())
    }

    return NextResponse.json({ success: true, users, total: users.length })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      name,
      email,
      role = "author",
      affiliation = "",
      country = "",
      orcid = "",
      password = "",
      status = "Active"
    } = body

    if (!name || !email) {
      return NextResponse.json({ success: false, error: "Name and email are required" }, { status: 400 })
    }

    const currentUsers = getStoredUsers()
    const existingIndex = currentUsers.findIndex(u => u.email.toLowerCase() === email.toLowerCase())

    const newRecord: StoredUserRecord = {
      id: existingIndex >= 0 ? currentUsers[existingIndex].id : `USR-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      affiliation: affiliation.trim(),
      country: country.trim(),
      orcid: orcid.trim(),
      status,
      createdAt: existingIndex >= 0 ? currentUsers[existingIndex].createdAt : new Date().toISOString(),
      passwordHash: password ? `auth_hash_${Buffer.from(password).toString("base64").slice(0, 12)}` : undefined
    }

    let updatedUsers: StoredUserRecord[]
    if (existingIndex >= 0) {
      updatedUsers = [...currentUsers]
      updatedUsers[existingIndex] = { ...updatedUsers[existingIndex], ...newRecord }
    } else {
      updatedUsers = [newRecord, ...currentUsers]
    }

    saveStoredUsers(updatedUsers)

    return NextResponse.json({ success: true, user: newRecord })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
