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
  photoUrl?: string
  staffRole?: string
  department?: string
  officeLocation?: string
  updatedAt?: string
}

import { readEditorialData, writeEditorialData } from "@/lib/editorial-storage"

const FILE_PATH = "users.json"

const DEFAULT_USERS: StoredUserRecord[] = [
  {
    id: "USR-JM",
    name: "Noor F.",
    email: "info@scholarlyopen.org",
    role: "jm",
    affiliation: "Journal Management & Publishing Operations",
    country: "Germany",
    status: "Active",
    staffRole: "Editorial Manager & Publishing Coordinator",
    department: "Journal Management & Publishing Operations",
    officeLocation: "Mainz Editorial Office & Global Desk",
    createdAt: "2026-01-15T10:00:00.000Z"
  },
  {
    id: "USR-JM2",
    name: "Noor F.",
    email: "manager@scholarlyopen.org",
    role: "jm",
    affiliation: "Journal Management & Publishing Operations",
    country: "Germany",
    status: "Active",
    staffRole: "Editorial Manager & Publishing Coordinator",
    department: "Journal Management & Publishing Operations",
    officeLocation: "Mainz Editorial Office & Global Desk",
    createdAt: "2026-01-15T10:00:00.000Z"
  },
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

async function getStoredUsers(): Promise<StoredUserRecord[]> {
  const parsed = await readEditorialData<{ users: StoredUserRecord[] }>(FILE_PATH, { users: DEFAULT_USERS })
  return Array.isArray(parsed?.users) && parsed.users.length > 0 ? parsed.users : DEFAULT_USERS
}

async function saveStoredUsers(users: StoredUserRecord[]) {
  await writeEditorialData(FILE_PATH, { users, updatedAt: new Date().toISOString() })
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")
    const role = searchParams.get("role")

    let users = await getStoredUsers()

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
      status = "Active",
      photoUrl,
      staffRole,
      department,
      officeLocation
    } = body

    if (!name || !email) {
      return NextResponse.json({ success: false, error: "Name and email are required" }, { status: 400 })
    }

    const cleanEmail = email.trim().toLowerCase()

    // Integrity check: if candidate identity was disapproved by JM, deny registration
    try {
      const data = await readEditorialData<{ disapproved: any[] }>("disapproved-candidates.json", { disapproved: [] })
      if (data && Array.isArray(data.disapproved)) {
        const match = data.disapproved.find((d: any) => d.email && d.email.toLowerCase() === cleanEmail)
        if (match) {
          return NextResponse.json({
            success: false,
            error: "This applicant identity is currently flagged by the Journal Manager and cannot register an active account."
          }, { status: 403 })
        }
      }
    } catch (e) {}

    const currentUsers = await getStoredUsers()
    const existingIndex = currentUsers.findIndex(u => u.email.toLowerCase() === cleanEmail)

    const newRecord: StoredUserRecord = {
      id: existingIndex >= 0 ? currentUsers[existingIndex].id : `USR-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      email: cleanEmail,
      role,
      affiliation: affiliation.trim(),
      country: country.trim(),
      orcid: orcid.trim(),
      status,
      createdAt: existingIndex >= 0 ? currentUsers[existingIndex].createdAt : new Date().toISOString(),
      passwordHash: password ? `auth_hash_${Buffer.from(password.trim()).toString("base64")}` : (existingIndex >= 0 ? currentUsers[existingIndex].passwordHash : undefined),
      photoUrl: photoUrl !== undefined ? photoUrl : (existingIndex >= 0 ? currentUsers[existingIndex].photoUrl : undefined),
      staffRole: staffRole !== undefined ? staffRole : (existingIndex >= 0 ? currentUsers[existingIndex].staffRole : undefined),
      department: department !== undefined ? department : (existingIndex >= 0 ? currentUsers[existingIndex].department : undefined),
      officeLocation: officeLocation !== undefined ? officeLocation : (existingIndex >= 0 ? currentUsers[existingIndex].officeLocation : undefined),
      updatedAt: new Date().toISOString()
    }

    let updatedUsers: StoredUserRecord[]
    if (existingIndex >= 0) {
      updatedUsers = [...currentUsers]
      updatedUsers[existingIndex] = { ...updatedUsers[existingIndex], ...newRecord }
    } else {
      updatedUsers = [newRecord, ...currentUsers]
    }

    await saveStoredUsers(updatedUsers)

    return NextResponse.json({ success: true, user: newRecord })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { email } = body
    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    const cleanEmail = email.trim().toLowerCase()
    const currentUsers = await getStoredUsers()
    const existingIndex = currentUsers.findIndex(u => u.email.toLowerCase() === cleanEmail)

    const existingUser = existingIndex >= 0 ? currentUsers[existingIndex] : {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: body.name || cleanEmail.split("@")[0],
      email: cleanEmail,
      role: body.role || "author",
      status: "Active",
      createdAt: new Date().toISOString()
    }

    const updatedUser: StoredUserRecord = {
      ...existingUser,
      ...(body.name ? { name: body.name.trim() } : {}),
      ...(body.role ? { role: body.role } : {}),
      ...(body.affiliation !== undefined ? { affiliation: body.affiliation.trim() } : {}),
      ...(body.country !== undefined ? { country: body.country.trim() } : {}),
      ...(body.orcid !== undefined ? { orcid: body.orcid.trim() } : {}),
      ...(body.photoUrl !== undefined ? { photoUrl: body.photoUrl } : {}),
      ...(body.staffRole !== undefined ? { staffRole: body.staffRole } : {}),
      ...(body.department !== undefined ? { department: body.department } : {}),
      ...(body.officeLocation !== undefined ? { officeLocation: body.officeLocation } : {}),
      ...(body.password ? { passwordHash: `auth_hash_${Buffer.from(body.password.trim()).toString("base64")}` } : {}),
      updatedAt: new Date().toISOString()
    }

    let updatedUsers: StoredUserRecord[]
    if (existingIndex >= 0) {
      updatedUsers = [...currentUsers]
      updatedUsers[existingIndex] = updatedUser
    } else {
      updatedUsers = [updatedUser, ...currentUsers]
    }

    await saveStoredUsers(updatedUsers)

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")?.trim().toLowerCase()
    const id = searchParams.get("id")

    if (!email && !id) {
      return NextResponse.json({ success: false, error: "Email or ID is required" }, { status: 400 })
    }

    let users = await getStoredUsers()
    users = users.filter(u => {
      if (email && u.email.toLowerCase() === email) return false
      if (id && u.id === id) return false
      return true
    })

    await saveStoredUsers(users)
    return NextResponse.json({ success: true, total: users.length })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
