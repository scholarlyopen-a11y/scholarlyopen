export const runtime = "nodejs"

import { NextResponse } from "next/server"

// Supabase Storage upload endpoint for manuscript files, revision documents, etc.
// Files are uploaded to the 'manuscripts' Supabase Storage bucket via REST API.
// A permanent public URL is returned, stored in the manuscripts table,
// making the file visible to all users regardless of browser/device.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wrccglyypgxtuikrupkh.supabase.co"
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const BUCKET = "manuscripts"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const manuscriptId = (formData.get("manuscriptId") as string) || `upload-${Date.now()}`
    const fileType = (formData.get("fileType") as string) || "manuscript"

    if (!file) {
      return NextResponse.json({ ok: false, error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/msword",
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { ok: false, error: `Unsupported file type: ${file.type}. Please upload DOCX, PDF, or image files.` },
        { status: 400 }
      )
    }

    // Max 50MB
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { ok: false, error: "File too large. Maximum file size is 50 MB." },
        { status: 400 }
      )
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
    const storagePath = `${manuscriptId}/${fileType}_${Date.now()}_${safeName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage via REST API
    const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${storagePath}`
    const uploadRes = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": file.type,
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
        "x-upsert": "true",
      },
      body: buffer,
    })

    if (!uploadRes.ok) {
      const errText = await uploadRes.text()
      console.error("Supabase storage upload error:", errText)
      return NextResponse.json(
        { ok: false, error: `Storage upload failed: ${errText}` },
        { status: 500 }
      )
    }

    // Build public URL
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`

    return NextResponse.json({
      ok: true,
      fileUrl: publicUrl,
      fileName: file.name,
      fileSize: file.size < 1024 * 1024
        ? `${Math.round(file.size / 1024)} KB`
        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      storagePath,
    })
  } catch (error: any) {
    console.error("File upload error:", error)
    return NextResponse.json(
      { ok: false, error: error.message || "File upload failed" },
      { status: 500 }
    )
  }
}
