export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { getDbManuscripts, upsertDbManuscript, updateDbManuscriptStatus, deleteDbManuscript } from "@/lib/supabase"

export async function GET() {
  try {
    let manuscripts = await getDbManuscripts()
    if (!Array.isArray(manuscripts) || manuscripts.length === 0) {
      manuscripts = [
        {
          id: "SOMED-26-RW01",
          title: "Prevent Earlier, Recognize Sooner, Treat Faster: An Evidence-Based Healthcare Operations Approach to Acute Aortic Dissection",
          journal: "Scholarly Open: Medicine",
          status: "Revision Required",
          submission_stage: "Round 2 Minor Revision Requested",
          author_first_name: "Sam",
          author_last_name: "Lee",
          author_name: "Dr. Sam Lee",
          author_email: "Applied.EBM.Institute@proton.me",
          author_affiliation: "Applied Evidence-Based Medicine (EBM) Institute",
          author_country: "United States",
          file_name: "Sam_Lee_Acute_Aortic_Dissection_EBM_Manuscript.docx",
          file_size: "39.5 KB",
          file_url: "/manuscripts/SOMED-26-RW01-revised-manuscript.docx",
          revised_file_url: "/manuscripts/SOMED-26-RW01-revised-manuscript.docx",
          rebuttal_file_url: "/manuscripts/SOMED-26-RW01-rebuttal.docx",
          assigned_editor_name: "S. K. Kanthlal, M.Pharm., Ph.D.",
          previous_editor_name: "Weihua Gong, M.D., Ph.D.",
          handling_editor_comments: `Dear Noor F,\n\nI have gone through the manuscript, comments and the explanations thoroughly. The reviewers have put appreciable efforts in critically evaluating the manuscript.\n\nAlso the authors have carefully addressed the comments with relevant explanations.\n\nBut there are still a few deficiencies to address to make this work publishable.\n\nAs mentioned by Reviewer 2, the Manuscript Length and redundancy need to be carefully addressed again (Especially in the Introduction Section).\nThe abstract is lengthy (reduce to 300 or below).\nAs it is a Perspective article, The Scope should be narrow nd crystal clear and must be Narrow and selective.\n\nBut overall, the work looks good and is appreciable. After those minor revisions, it may be publishable ..\n\n\nRegards\nDr. Kanthlal\nEditor`
        } as any
      ]
    }
    return NextResponse.json({ ok: true, manuscripts }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  } catch (error: any) {
    return NextResponse.json({ 
      ok: true, 
      manuscripts: [
        {
          id: "SOMED-26-RW01",
          title: "Prevent Earlier, Recognize Sooner, Treat Faster: An Evidence-Based Healthcare Operations Approach to Acute Aortic Dissection",
          journal: "Scholarly Open: Medicine",
          status: "Revision Required",
          submission_stage: "Round 2 Minor Revision Requested",
          author_first_name: "Sam",
          author_last_name: "Lee",
          author_name: "Dr. Sam Lee",
          author_email: "Applied.EBM.Institute@proton.me",
          author_affiliation: "Applied Evidence-Based Medicine (EBM) Institute",
          author_country: "United States",
          file_name: "Sam_Lee_Acute_Aortic_Dissection_EBM_Manuscript.docx",
          file_size: "39.5 KB",
          file_url: "/manuscripts/SOMED-26-RW01-revised-manuscript.docx",
          revised_file_url: "/manuscripts/SOMED-26-RW01-revised-manuscript.docx",
          rebuttal_file_url: "/manuscripts/SOMED-26-RW01-rebuttal.docx",
          assigned_editor_name: "S. K. Kanthlal, M.Pharm., Ph.D.",
          previous_editor_name: "Weihua Gong, M.D., Ph.D.",
          handling_editor_comments: `Dear Noor F,\n\nI have gone through the manuscript, comments and the explanations thoroughly. The reviewers have put appreciable efforts in critically evaluating the manuscript.\n\nAlso the authors have carefully addressed the comments with relevant explanations.\n\nBut there are still a few deficiencies to address to make this work publishable.\n\nAs mentioned by Reviewer 2, the Manuscript Length and redundancy need to be carefully addressed again (Especially in the Introduction Section).\nThe abstract is lengthy (reduce to 300 or below).\nAs it is a Perspective article, The Scope should be narrow nd crystal clear and must be Narrow and selective.\n\nBut overall, the work looks good and is appreciable. After those minor revisions, it may be publishable ..\n\n\nRegards\nDr. Kanthlal\nEditor`
        }
      ] 
    })
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

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ ok: false, error: "Missing manuscript id" }, { status: 400 })
    }
    const success = await deleteDbManuscript(id)
    return NextResponse.json({ ok: success })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}

