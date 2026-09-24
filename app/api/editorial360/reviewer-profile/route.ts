export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"

export interface StoredReviewerProfile {
  title: string
  name: string
  email: string
  photoUrl?: string
  badges?: string[]
  institution: string
  department?: string
  country?: string
  orcid?: string
  scholarUrl?: string
  primaryDiscipline: string
  subDisciplines: string[]
  keywords: string[]
  maxReviewsPerMonth: number
  preferredTurnaround: number
  availabilityStatus: "Available" | "Busy" | "Sabbatical"
  sabbaticalUntil?: string
  coiAcknowledged: boolean
  isCompleted: boolean
  credentialId?: string
  gatewayScore?: number
  accountStatus?: string
  paymentMethod?: string
  paymentAccount?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export interface ProfileAuditSummary {
  completionPercentage: number
  filledFields: { key: string; label: string; value: any }[]
  missingFields: { key: string; label: string; tip: string }[]
}

// Global serverless in-memory registry of reviewer profiles
let reviewerProfileStore: Record<string, StoredReviewerProfile> = {
  "102500216@hbut.edu.cn": {
    title: "Dr.",
    name: "Dr. Wenxiong Sun (孙文雄)",
    email: "102500216@hbut.edu.cn",
    institution: "Hubei University of Technology",
    department: "School of Materials and Chemical Engineering",
    country: "China",
    orcid: "0009-0002-8812-4190",
    scholarUrl: "",
    photoUrl: "",
    badges: ["Gateway Certified (92%)", "COPE Ethics Verified", "Fast Turnaround"],
    primaryDiscipline: "engineering",
    subDisciplines: ["Materials Science", "Nanotechnology", "Composite Materials"],
    keywords: [
      "Nanomaterials",
      "Smart Grids",
      "Additive Manufacturing",
      "Composite Materials",
      "Fluid Dynamics"
    ],
    maxReviewsPerMonth: 2,
    preferredTurnaround: 14,
    availabilityStatus: "Available",
    sabbaticalUntil: "",
    coiAcknowledged: true,
    isCompleted: true,
    credentialId: "CERT-SO-2026-9088",
    gatewayScore: 92,
    accountStatus: "Passed - Account Active",
    paymentMethod: "Wise",
    paymentAccount: "102500216@hbut.edu.cn",
    notes: "Verified Referee via Reviewer Gateway (Sep 23, 2026). Specialized in engineering materials & nanotechnology.",
    createdAt: "2026-09-23T21:40:00Z",
    updatedAt: "2026-09-23T21:45:00Z"
  },
  "e.rostova@karolinska.se": {
    title: "Dr.",
    name: "Dr. Elena Rostova",
    email: "e.rostova@karolinska.se",
    institution: "Karolinska Institute",
    department: "Department of Oncology",
    country: "Sweden",
    orcid: "0000-0002-9182-3321",
    scholarUrl: "https://scholar.google.com/citations?user=rostova-e",
    photoUrl: "",
    badges: ["Top Reviewer 2026", "Gateway Certified (90%)"],
    primaryDiscipline: "medicine",
    subDisciplines: ["Oncology", "Clinical Trials"],
    keywords: ["CRISPR", "Clinical Trials", "Immunotherapy", "Biomarkers"],
    maxReviewsPerMonth: 3,
    preferredTurnaround: 14,
    availabilityStatus: "Available",
    coiAcknowledged: true,
    isCompleted: true,
    credentialId: "CERT-SO-2026-9812",
    gatewayScore: 90,
    accountStatus: "Passed - Account Active",
    createdAt: "2026-09-22T14:32:00Z"
  },
  "m.vance@university-charite.de": {
    title: "Dr.",
    name: "Dr. Marcus Vance",
    email: "m.vance@university-charite.de",
    institution: "Charité – Universitätsmedizin Berlin",
    department: "Department of Cardiology & Vascular Medicine",
    country: "Germany",
    orcid: "0000-0004-7711-2093",
    scholarUrl: "https://scholar.google.com/citations?user=vance-m",
    photoUrl: "",
    badges: ["Top Reviewer 2026", "Fast Turnaround", "COPE Certified", "5-Star Rigor"],
    primaryDiscipline: "medicine",
    subDisciplines: ["Cardiology", "Cardiovascular Imaging", "Biomarkers"],
    keywords: ["CRISPR", "Cardiovascular Imaging", "AI Diagnostics", "Randomized Controlled Trials", "Echocardiography"],
    maxReviewsPerMonth: 2,
    preferredTurnaround: 14,
    availabilityStatus: "Available",
    coiAcknowledged: true,
    isCompleted: true,
    credentialId: "CERT-SO-2026-7711",
    gatewayScore: 95,
    accountStatus: "Passed - Account Active",
    createdAt: "2026-09-20T10:00:00Z"
  }
}

export function analyzeProfileCompletion(profile: StoredReviewerProfile): ProfileAuditSummary {
  const fieldsToCheck = [
    { key: "name", label: "Full Name", tip: "Add official title and full name" },
    { key: "email", label: "Email Address", tip: "Institutional academic email" },
    { key: "institution", label: "Affiliation", tip: "University or research laboratory" },
    { key: "department", label: "Department", tip: "Faculty or department name" },
    { key: "country", label: "Country", tip: "Geographic location" },
    { key: "orcid", label: "ORCID iD", tip: "Connect verified 16-digit ORCID" },
    { key: "scholarUrl", label: "Google Scholar", tip: "Link to published bibliography" },
    { key: "primaryDiscipline", label: "Primary Discipline", tip: "Select subject domain" },
    { key: "subDisciplines", label: "Sub-Disciplines", tip: "Choose specific sub-fields" },
    { key: "keywords", label: "Keywords", tip: "Add at least 3 research keywords" },
    { key: "maxReviewsPerMonth", label: "Monthly Capacity", tip: "Set maximum manuscript review load" },
    { key: "preferredTurnaround", label: "Turnaround Window", tip: "Set preferred days to complete review" },
    { key: "availabilityStatus", label: "Availability Status", tip: "Mark Available / Busy / Sabbatical" },
    { key: "coiAcknowledged", label: "COPE Ethics Check", tip: "Acknowledge conflict of interest policy" }
  ]

  const filledFields: { key: string; label: string; value: any }[] = []
  const missingFields: { key: string; label: string; tip: string }[] = []

  for (const item of fieldsToCheck) {
    const val = (profile as any)[item.key]
    let isFilled = false

    if (Array.isArray(val)) {
      isFilled = val.length > 0
    } else if (typeof val === "boolean") {
      isFilled = val === true
    } else if (typeof val === "number") {
      isFilled = val > 0
    } else if (typeof val === "string") {
      isFilled = val.trim().length > 0
    }

    if (isFilled) {
      filledFields.push({ key: item.key, label: item.label, value: val })
    } else {
      missingFields.push({ key: item.key, label: item.label, tip: item.tip })
    }
  }

  const completionPercentage = Math.round((filledFields.length / fieldsToCheck.length) * 100)

  return {
    completionPercentage,
    filledFields,
    missingFields
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")

    if (email) {
      const normalizedEmail = email.toLowerCase().trim()
      let profile = reviewerProfileStore[normalizedEmail]

      // Fallback matching by partial email
      if (!profile) {
        const found = Object.values(reviewerProfileStore).find(
          p => p.email.toLowerCase() === normalizedEmail
        )
        if (found) profile = found
      }

      if (!profile) {
        return NextResponse.json(
          {
            ok: false,
            found: false,
            message: `No reviewer profile found for ${email}`
          },
          { status: 404 }
        )
      }

      const audit = analyzeProfileCompletion(profile)
      return NextResponse.json({
        ok: true,
        found: true,
        profile,
        audit
      })
    }

    // Return list of all profiles with audit summaries
    const profilesWithAudit = Object.values(reviewerProfileStore).map(p => ({
      profile: p,
      audit: analyzeProfileCompletion(p)
    }))

    return NextResponse.json({
      ok: true,
      count: profilesWithAudit.length,
      reviewers: profilesWithAudit
    })
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to fetch reviewer profiles" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = body.email?.toLowerCase().trim()

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "Reviewer email is required to update profile." },
        { status: 400 }
      )
    }

    const existing = reviewerProfileStore[email] || {
      title: body.title || "Dr.",
      name: body.name || "Reviewer Candidate",
      email,
      institution: body.institution || "Academic Institution",
      primaryDiscipline: body.primaryDiscipline || "engineering",
      subDisciplines: body.subDisciplines || [],
      keywords: body.keywords || [],
      maxReviewsPerMonth: body.maxReviewsPerMonth ?? 2,
      preferredTurnaround: body.preferredTurnaround ?? 14,
      availabilityStatus: body.availabilityStatus || "Available",
      coiAcknowledged: body.coiAcknowledged ?? true,
      isCompleted: true,
      createdAt: new Date().toISOString()
    }

    const updatedProfile: StoredReviewerProfile = {
      ...existing,
      ...body,
      email,
      updatedAt: new Date().toISOString()
    }

    reviewerProfileStore[email] = updatedProfile

    const audit = analyzeProfileCompletion(updatedProfile)

    return NextResponse.json({
      ok: true,
      message: "Profile saved successfully.",
      profile: updatedProfile,
      audit
    })
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to save reviewer profile" },
      { status: 500 }
    )
  }
}
