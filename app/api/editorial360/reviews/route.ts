export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { readEditorialData, writeEditorialData } from "@/lib/editorial-storage"

const FILE_PATH = "reviews.json"

export interface StoredReview {
  id: string
  paperId: string
  reviewerName: string
  reviewerEmail?: string
  status: "Pending Moderation" | "Released" | "Archived"
  originality: number
  methodology: number
  clarity: number
  significance: number
  commentsAuthor: string
  commentsEditor?: string
  recommendation: string
  sanitizedCommentsAuthor?: string
  moderationNotes?: string
  createdAt?: string
  updatedAt?: string
}

const DEFAULT_REVIEWS: StoredReview[] = [
  {
    id: "REV-FB-1793887143406-386",
    paperId: "SOMED-26-RW01",
    reviewerName: "Dr. German J. Chaud",
    reviewerEmail: "germanchaud@gmail.com",
    status: "Pending Moderation",
    originality: 5,
    methodology: 4,
    clarity: 4,
    significance: 4,
    commentsAuthor: `General comments to the Author(s):
The authors have made substantial efforts to address the concerns raised during the initial review. The revised manuscript demonstrates significant improvements in scientific organization, methodological transparency, clinical relevance, and the integration of contemporary evidence regarding acute aortic dissection management.

I particularly appreciate the expanded discussion of regional aortic networks, interhospital transfer, specialized aortic centers, and multidisciplinary emergency response. These additions strengthen the clinical relevance of the proposed framework.

The clarification that EBM-IRRF represents an evidence-informed conceptual proposal, rather than a validated clinical intervention, is appropriate. The distinction between clinical decision-making authority and organizational accountability is also clearly established.

Most of my original concerns have therefore been satisfactorily addressed.

Nevertheless, three issues require further attention before publication.

Specific Line Critiques:
1. Accuracy of scientific references: Several inconsistencies remain between in-text citations and their corresponding bibliography entries, including references supporting evidence-based medicine principles, the Donabedian model, implementation science, and regional transfer strategies. For example, reference 5 is used to support general evidence-based medicine principles, while reference 6 is incorrectly associated with the Donabedian framework in Table 4. A comprehensive verification of all references and their correspondence with the manuscript is necessary.

2. Manuscript length and redundancy: Although the manuscript has been reorganized, substantial repetition remains across the Introduction, Literature Review, Results, and Discussion. Considering its classification as a Perspective Article, further condensation would improve scientific clarity, readability, and the presentation of the principal conceptual contribution.

3. Originality and potential clinical applicability: The proposed EBM-IRRF incorporates several established elements of contemporary acute aortic dissection management, including specialized aortic teams, regional referral networks, standardized emergency pathways, and multidisciplinary coordination. The authors should more explicitly distinguish the incremental contribution of EBM-IRRF from previously published Aorta Code programs and established regional systems. A concise description of its distinctive operational features and proposed evaluation criteria would strengthen the manuscript without requiring additional empirical data at this stage.

Overall assessment: The revised manuscript addresses a clinically important topic and demonstrates meaningful improvements following peer review. The authors have appropriately acknowledged the conceptual nature of the proposed framework and the need for prospective validation. I consider the manuscript potentially suitable for publication after the remaining issues concerning reference accuracy, concision, and conceptual differentiation have been satisfactorily addressed.

Final recommendation: Major Revision.`,
    commentsEditor: `The authors have clarified that the revised manuscript is a conceptual Perspective Article involving no original patient-level data or statistical analyses.

However, documentation associated with the previous submission described ethics approval, participant consent, and supplementary statistical analyses.

I recommend that the editorial office verify whether these materials were formally withdrawn, superseded, or submitted in error, and confirm that the final submission is internally consistent.

This request is intended to ensure methodological and administrative transparency and does not imply scientific misconduct.`,
    recommendation: "Re-review and Accept with Major Changes",
    sanitizedCommentsAuthor: `General comments to the Author(s):
The authors have made substantial efforts to address the concerns raised during the initial review. The revised manuscript demonstrates significant improvements in scientific organization, methodological transparency, clinical relevance, and the integration of contemporary evidence regarding acute aortic dissection management.

I particularly appreciate the expanded discussion of regional aortic networks, interhospital transfer, specialized aortic centers, and multidisciplinary emergency response. These additions strengthen the clinical relevance of the proposed framework.

The clarification that EBM-IRRF represents an evidence-informed conceptual proposal, rather than a validated clinical intervention, is appropriate. The distinction between clinical decision-making authority and organizational accountability is also clearly established.

Most of my original concerns have therefore been satisfactorily addressed.

Nevertheless, three issues require further attention before publication.

Specific Line Critiques:
1. Accuracy of scientific references: Several inconsistencies remain between in-text citations and their corresponding bibliography entries, including references supporting evidence-based medicine principles, the Donabedian model, implementation science, and regional transfer strategies. For example, reference 5 is used to support general evidence-based medicine principles, while reference 6 is incorrectly associated with the Donabedian framework in Table 4. A comprehensive verification of all references and their correspondence with the manuscript is necessary.

2. Manuscript length and redundancy: Although the manuscript has been reorganized, substantial repetition remains across the Introduction, Literature Review, Results, and Discussion. Considering its classification as a Perspective Article, further condensation would improve scientific clarity, readability, and the presentation of the principal conceptual contribution.

3. Originality and potential clinical applicability: The proposed EBM-IRRF incorporates several established elements of contemporary acute aortic dissection management, including specialized aortic teams, regional referral networks, standardized emergency pathways, and multidisciplinary coordination. The authors should more explicitly distinguish the incremental contribution of EBM-IRRF from previously published Aorta Code programs and established regional systems. A concise description of its distinctive operational features and proposed evaluation criteria would strengthen the manuscript without requiring additional empirical data at this stage.

Overall assessment: The revised manuscript addresses a clinically important topic and demonstrates meaningful improvements following peer review. The authors have appropriately acknowledged the conceptual nature of the proposed framework and the need for prospective validation. I consider the manuscript potentially suitable for publication after the remaining issues concerning reference accuracy, concision, and conceptual differentiation have been satisfactorily addressed.

Final recommendation: Major Revision.`,
    createdAt: "2026-11-05T13:59:35.050Z",
    updatedAt: "2026-11-05T13:59:35.050Z"
  },
  {
    id: "REV-FB-PN02-ROUND2",
    paperId: "SOMED-26-RW01",
    reviewerName: "Dr. Praveen Nagula",
    reviewerEmail: "drpraveennagula@gmail.com",
    status: "Pending Moderation",
    originality: 4,
    methodology: 3,
    clarity: 4,
    significance: 4,
    commentsAuthor: `PEER REVIEW & EVALUATION REPORT (ROUND 2)
Scholarly Journal Editorial Assessment
Manuscript ID: SOMED-26-RW01.docx
Manuscript Title: Prevent Earlier, Recognize Sooner, Treat Faster: A Proposed Evidence-Based Medicine–Integrated Rapid Response Framework (EBM-IRRF) for Acute Aortic Dissection
Article Type: Perspective / Conceptual Framework Article
Target Field: Cardiovascular Medicine, Emergency Care, Healthcare Operations & Implementation Science

Editorial Recommendation: Major Revision
The manuscript addresses a vital emergency cardiovascular challenge with strong theoretical rigor. However, substantial conceptual, methodological, and structural refinements are required before peer-reviewed publication.

1. EXECUTIVE SUMMARY
This manuscript tackles a critically important challenge in emergency cardiovascular medicine—mitigating preventable delays in the diagnosis, interhospital transfer, and definitive surgical management of Acute Aortic Dissection (AAD). The authors synthesize contemporary clinical guidelines (ACC/AHA 2022, ESC 2024), healthcare quality frameworks (Donabedian Model), and implementation science concepts (CFIR) to propose an Evidence-Based Medicine–Integrated Rapid Response Framework (EBM-IRRF).
While the conceptual ambition and writing quality are commendable, the paper currently suffers from theoretical over-modularization, procedural friction within hyperacute workflows, pseudo-systematic methodological presentation, and excessive textual redundancy. Address these core concerns prior to publication.

2. CORE CONCEPTUAL & THEORETICAL CRITIQUES
2.1. Framework Redundancy and Incremental Value:
The manuscript repackages well-established emergency cardiovascular protocols (e.g., Code Aorta, Regional Aortic Care Networks, and early CT angiography protocols) into a novel seven-component acronym. To justify publication in a scholarly journal, the authors must clearly articulate what EBM-IRRF achieves that existing pathways do not already accomplish. Merely appending operational terminology to established clinical guidelines creates conceptual inflation rather than new scientific insight.

2.2. Logistical Contradiction of 'Third-Party EBM Consultation':
In Component 5, the framework introduces an 'optional independent third-party EBM consultation mechanism' for complex cases. In hyperacute Stanford Type A dissection—where mortality escalates by 1% to 2% per hour from symptom onset—introducing an external evidence-appraisal layer presents a severe operational paradox. Although the text states that consultation 'must not delay emergency treatment,' it offers no realistic protocol for how external consultation can occur in real time without creating decision-making friction, cognitive overload, or legal liability during an emergency operation.

2.3. Over-Reliance on Author-Defined Methodologies ('SBSR'):
Section 3.1 relies heavily on Systems-Based Scientific Reasoning (SBSR) as its core theoretical paradigm. Because SBSR is an author-defined concept rather than a validated implementation science methodology, using it to justify a non-systematic literature review creates artificial complexity. The manuscript would gain substantial credibility by anchoring its rationale strictly within established implementation science frameworks, such as the Consolidated Framework for Implementation Research (CFIR) and the Donabedian Structure–Process–Outcome model.

3. METHODOLOGICAL & STRUCTURAL REFINEMENTS
3.1. Misalignment in Methodology Presentation:
Section 3 (Materials and Methods) uses terminology suggestive of a systematic review (e.g., 'literature search strategy,' 'evidence selection,' and 'evaluations') without adhering to PRISMA guidelines, prospective registration, or formal risk-of-bias assessments. The methodology should be simplified to reflect a narrative perspective and evidence synthesis, avoiding pseudo-systematic phrasing that invites reviewer critique regarding selection bias.

3.2. Textual Redundancy and Disclaimers:
The manuscript repeatedly inserts defensive caveats (e.g., 'the framework remains unvalidated,' 'efficacy is unproven,' 'no original patient data were collected') more than a dozen times across the Abstract, Methods, Results, and Discussion. While scientific honesty is essential, this repetition disrupts prose flow. All disclaimers should be consolidated into a single, dedicated 'Scope and Limitations' subsection in the Discussion.

3.3. Question-Driven Rationale Compression:
Section 1.4 poses nine detailed research questions. In a Perspective manuscript, presenting nine exploratory questions consumes substantial space without providing empirical answers in the Results. These nine items should be compressed into three overarching scientific themes.

4. ACTIONABLE REVISION PLAN
• [CRITICAL] Component 5 & Workflow: Reframe 'Third-Party EBM Consultation' strictly to post-acute/longitudinal surveillance (Components 1 & 4), or explicitly restrict it to asynchronous quality audits to prevent hyperacute surgical delays.
• [CRITICAL] Section 1 & Introduction: Explicitly define EBM-IRRF as an operational implementation overlay for existing ACC/AHA/ESC guidelines, establishing its distinct value proposition over Code Aorta.
• [MAJOR] Section 3 (Methods): Remove pseudo-systematic terminology. Replace the detailed justification of 'SBSR' with a streamlined narrative review methodology grounded in CFIR and Donabedian models.
• [MAJOR] Section 1.4 (Questions): Consolidate the 9 exploratory questions into 3 core scientific themes: (1) Operational Integration, (2) Multidisciplinary Coordination, and (3) Digital/AI Triage Support.
• [MINOR] Table 5 (Evaluation): Reorganize proposed evaluation indicators strictly according to Donabedian categories (Structure, Process, Outcome) for theoretical consistency.
• [MINOR] Entire Manuscript: Consolidate recurring 'unvalidated status' disclaimers into a unified 'Limitations and Safety Safeguards' section in the Discussion.

5. CONCLUDING REMARK
The proposed framework holds potential to organize complex emergency care workflows for acute aortic dissection. Addressing these conceptual, methodological, and structural concerns will make the manuscript suitable for publication in a high-impact open-access medical journal.`,
    commentsEditor: `Dear Noor F.,

I have reviewed the article. My comments are in the attached PDF file.
I used AI to review the manuscript in detail, and I have gone through the comments.
They are genuine and need consideration for a good outcome of the manuscript before publication.

Thank you.
Kindly acknowledge receipt of the mail.`,
    recommendation: "Major Revision",
    sanitizedCommentsAuthor: `PEER REVIEW & EVALUATION REPORT (ROUND 2)
Scholarly Journal Editorial Assessment
Manuscript ID: SOMED-26-RW01.docx
Manuscript Title: Prevent Earlier, Recognize Sooner, Treat Faster: A Proposed Evidence-Based Medicine–Integrated Rapid Response Framework (EBM-IRRF) for Acute Aortic Dissection
Article Type: Perspective / Conceptual Framework Article
Target Field: Cardiovascular Medicine, Emergency Care, Healthcare Operations & Implementation Science

Editorial Recommendation: Major Revision
The manuscript addresses a vital emergency cardiovascular challenge with strong theoretical rigor. However, substantial conceptual, methodological, and structural refinements are required before peer-reviewed publication.

1. EXECUTIVE SUMMARY
This manuscript tackles a critically important challenge in emergency cardiovascular medicine—mitigating preventable delays in the diagnosis, interhospital transfer, and definitive surgical management of Acute Aortic Dissection (AAD). The authors synthesize contemporary clinical guidelines (ACC/AHA 2022, ESC 2024), healthcare quality frameworks (Donabedian Model), and implementation science concepts (CFIR) to propose an Evidence-Based Medicine–Integrated Rapid Response Framework (EBM-IRRF).
While the conceptual ambition and writing quality are commendable, the paper currently suffers from theoretical over-modularization, procedural friction within hyperacute workflows, pseudo-systematic methodological presentation, and excessive textual redundancy. Address these core concerns prior to publication.

2. CORE CONCEPTUAL & THEORETICAL CRITIQUES
2.1. Framework Redundancy and Incremental Value:
The manuscript repackages well-established emergency cardiovascular protocols (e.g., Code Aorta, Regional Aortic Care Networks, and early CT angiography protocols) into a novel seven-component acronym. To justify publication in a scholarly journal, the authors must clearly articulate what EBM-IRRF achieves that existing pathways do not already accomplish. Merely appending operational terminology to established clinical guidelines creates conceptual inflation rather than new scientific insight.

2.2. Logistical Contradiction of 'Third-Party EBM Consultation':
In Component 5, the framework introduces an 'optional independent third-party EBM consultation mechanism' for complex cases. In hyperacute Stanford Type A dissection—where mortality escalates by 1% to 2% per hour from symptom onset—introducing an external evidence-appraisal layer presents a severe operational paradox. Although the text states that consultation 'must not delay emergency treatment,' it offers no realistic protocol for how external consultation can occur in real time without creating decision-making friction, cognitive overload, or legal liability during an emergency operation.

2.3. Over-Reliance on Author-Defined Methodologies ('SBSR'):
Section 3.1 relies heavily on Systems-Based Scientific Reasoning (SBSR) as its core theoretical paradigm. Because SBSR is an author-defined concept rather than a validated implementation science methodology, using it to justify a non-systematic literature review creates artificial complexity. The manuscript would gain substantial credibility by anchoring its rationale strictly within established implementation science frameworks, such as the Consolidated Framework for Implementation Research (CFIR) and the Donabedian Structure–Process–Outcome model.

3. METHODOLOGICAL & STRUCTURAL REFINEMENTS
3.1. Misalignment in Methodology Presentation:
Section 3 (Materials and Methods) uses terminology suggestive of a systematic review (e.g., 'literature search strategy,' 'evidence selection,' and 'evaluations') without adhering to PRISMA guidelines, prospective registration, or formal risk-of-bias assessments. The methodology should be simplified to reflect a narrative perspective and evidence synthesis, avoiding pseudo-systematic phrasing that invites reviewer critique regarding selection bias.

3.2. Textual Redundancy and Disclaimers:
The manuscript repeatedly inserts defensive caveats (e.g., 'the framework remains unvalidated,' 'efficacy is unproven,' 'no original patient data were collected') more than a dozen times across the Abstract, Methods, Results, and Discussion. While scientific honesty is essential, this repetition disrupts prose flow. All disclaimers should be consolidated into a single, dedicated 'Scope and Limitations' subsection in the Discussion.

3.3. Question-Driven Rationale Compression:
Section 1.4 poses nine detailed research questions. In a Perspective manuscript, presenting nine exploratory questions consumes substantial space without providing empirical answers in the Results. These nine items should be compressed into three overarching scientific themes.

4. ACTIONABLE REVISION PLAN
• [CRITICAL] Component 5 & Workflow: Reframe 'Third-Party EBM Consultation' strictly to post-acute/longitudinal surveillance (Components 1 & 4), or explicitly restrict it to asynchronous quality audits to prevent hyperacute surgical delays.
• [CRITICAL] Section 1 & Introduction: Explicitly define EBM-IRRF as an operational implementation overlay for existing ACC/AHA/ESC guidelines, establishing its distinct value proposition over Code Aorta.
• [MAJOR] Section 3 (Methods): Remove pseudo-systematic terminology. Replace the detailed justification of 'SBSR' with a streamlined narrative review methodology grounded in CFIR and Donabedian models.
• [MAJOR] Section 1.4 (Questions): Consolidate the 9 exploratory questions into 3 core scientific themes: (1) Operational Integration, (2) Multidisciplinary Coordination, and (3) Digital/AI Triage Support.
• [MINOR] Table 5 (Evaluation): Reorganize proposed evaluation indicators strictly according to Donabedian categories (Structure, Process, Outcome) for theoretical consistency.
• [MINOR] Entire Manuscript: Consolidate recurring 'unvalidated status' disclaimers into a unified 'Limitations and Safety Safeguards' section in the Discussion.

5. CONCLUDING REMARK
The proposed framework holds potential to organize complex emergency care workflows for acute aortic dissection. Addressing these conceptual, methodological, and structural concerns will make the manuscript suitable for publication in a high-impact open-access medical journal.`,
    createdAt: "2026-11-06T08:10:00.000Z",
    updatedAt: "2026-11-06T08:10:00.000Z"
  },
  {
    id: "REV-FB-SAM-01",
    paperId: "SOMED-26-RW01",
    reviewerName: "Dr. Praveen Nagula",
    reviewerEmail: "drpraveennagula@gmail.com",
    status: "Released",
    originality: 3,
    methodology: 3,
    clarity: 3,
    significance: 3,
    commentsAuthor: `General comments to the Author(s):
The review article to be concised. Tables to be provided.

Specific comments to the Author(s):
1. too low references for a review article
2. what has been changed over the years in the management to be mentioned
3. the manuscript to be neatly structured to have a good orientation for the reader regarding the topic
4. no figures were provided
5. atleast tables to be there`,
    commentsEditor: "Reviewer evaluated submission via Electronic Assessment Form (RAF). Priority rating: 6/10. Recommendation: Re-write and Re-submit.",
    recommendation: "Re-write and Re-submit",
    sanitizedCommentsAuthor: `General comments to the Author(s):
The review article to be concised. Tables to be provided.

Specific comments to the Author(s):
1. too low references for a review article
2. what has been changed over the years in the management to be mentioned
3. the manuscript to be neatly structured to have a good orientation for the reader regarding the topic
4. no figures were provided
5. atleast tables to be there`,
    createdAt: "2026-08-28T14:20:00Z"
  },
  {
    id: "REV-FB-1791559472514-816",
    paperId: "SOMED-26-RW01",
    reviewerName: "Chaud GJ",
    reviewerEmail: "germanchaud@gmail.com",
    status: "Released",
    originality: 4,
    methodology: 4,
    clarity: 4,
    significance: 4,
    commentsAuthor: `General comments to the Author(s):
This manuscript addresses an important and frequently underestimated challenge in cardiovascular medicine: the need to approach acute aortic dissection (AAD) not only as a surgical emergency but also as a time-dependent healthcare systems challenge.

The proposed Evidence-Based Integrated Rapid Aortic Response Framework (EB-IRARF) offers a potentially valuable perspective by integrating prevention, early recognition, multidisciplinary coordination, organizational preparedness, and continuous quality improvement.

The manuscript's principal strength is its recognition that successful treatment depends not only on clinical expertise but also on the ability of healthcare systems to deliver that expertise without unnecessary delay.

However, several methodological and conceptual issues require clarification before the manuscript can be considered for publication.

Specific comments to the Author(s):
1. Clarification of manuscript type and methodology: The manuscript is presented as a scholarly perspective and describes an evidence-based synthesis. However, no structured methodology for identifying, selecting, or evaluating the literature is provided. Define as a narrative perspective or include reproducible search methodology.
2. Inconsistencies between manuscript and supplementary materials: Explicitly states no original patient-level data analyzed, yet supplementary materials describe ROC curves, propensity-score matching, and anonymized dataset. Clarify whether supplementary analyses belong to this submission or withdraw them.
3. Ethics approval and informed consent: Accompanied ethics statement reports institutional approval and written informed consent, whereas manuscript describes no original human-subject research. Clarify approved research and role of participants.
4. Greater emphasis on regional aortic networks and interhospital transfer: Frame intrahospital organization around regional referral networks, rapid CT sharing, and interhospital transfer protocols (Early recognition → definitive imaging → specialist consultation → immediate referral → coordinated transfer → definitive treatment).
5. Prioritization of clinically relevant interventions: Separate established clinical priorities (rapid imaging, hemodynamic stabilization, surgery) from conceptual proposals (real-time EBM consultation, AI integration, executive escalation).
6. Hospital leadership and executive escalation: Implement tiered escalation based on predefined operational barriers rather than routine executive activation for every suspected case.
7. Public awareness and reference to Senator Lindsey Graham: Substantially shorten Author's Note and present the event as contextual motivation for examining systemic improvements without speculating on individual clinical care.
8. Framework validation and measurable outcomes: Define explicit implementation and evaluation strategy with measurable performance indicators (time to diagnosis, transfer duration, mortality).`,
    commentsEditor: `Dear Editor-in-Chief,

Thank you for the opportunity to review this manuscript.

The authors address an important topic: the organization of healthcare systems for the prevention, recognition, and timely treatment of acute aortic dissection.

I recommend Major Revision, conditional upon satisfactory clarification of the supplementary data and ethics documentation.

If these discrepancies cannot be adequately resolved, the manuscript's scientific and ethical suitability for publication should be reconsidered.

Sincerely,
Dr. Chaud GJ`,
    recommendation: "Re-review and Accept with Major Changes",
    sanitizedCommentsAuthor: `General comments to the Author(s):
This manuscript addresses an important and frequently underestimated challenge in cardiovascular medicine: the need to approach acute aortic dissection (AAD) not only as a surgical emergency but also as a time-dependent healthcare systems challenge.

The proposed Evidence-Based Integrated Rapid Aortic Response Framework (EB-IRARF) offers a potentially valuable perspective by integrating prevention, early recognition, multidisciplinary coordination, organizational preparedness, and continuous quality improvement.

The manuscript's principal strength is its recognition that successful treatment depends not only on clinical expertise but also on the ability of healthcare systems to deliver that expertise without unnecessary delay.

However, several methodological and conceptual issues require clarification before the manuscript can be considered for publication.

Specific comments to the Author(s):
1. Clarification of manuscript type and methodology: The manuscript is presented as a scholarly perspective and describes an evidence-based synthesis. However, no structured methodology for identifying, selecting, or evaluating the literature is provided. Define as a narrative perspective or include reproducible search methodology.
2. Inconsistencies between manuscript and supplementary materials: Explicitly states no original patient-level data analyzed, yet supplementary materials describe ROC curves, propensity-score matching, and anonymized dataset. Clarify whether supplementary analyses belong to this submission or withdraw them.
3. Ethics approval and informed consent: Accompanied ethics statement reports institutional approval and written informed consent, whereas manuscript describes no original human-subject research. Clarify approved research and role of participants.
4. Greater emphasis on regional aortic networks and interhospital transfer: Frame intrahospital organization around regional referral networks, rapid CT sharing, and interhospital transfer protocols (Early recognition → definitive imaging → specialist consultation → immediate referral → coordinated transfer → definitive treatment).
5. Prioritization of clinically relevant interventions: Separate established clinical priorities (rapid imaging, hemodynamic stabilization, surgery) from conceptual proposals (real-time EBM consultation, AI integration, executive escalation).
6. Hospital leadership and executive escalation: Implement tiered escalation based on predefined operational barriers rather than routine executive activation for every suspected case.
7. Public awareness and reference to Senator Lindsey Graham: Substantially shorten Author's Note and present the event as contextual motivation for examining systemic improvements without speculating on individual clinical care.
8. Framework validation and measurable outcomes: Define explicit implementation and evaluation strategy with measurable performance indicators (time to diagnosis, transfer duration, mortality).`,
    createdAt: "2026-10-09T15:24:33.340Z"
  }
]

// Helper: Fetch reviews from storage layer with local file fallback
async function getStoredReviews(): Promise<StoredReview[]> {
  const data = await readEditorialData<{ reviews: StoredReview[] }>(FILE_PATH, { reviews: DEFAULT_REVIEWS })
  if (data && Array.isArray(data.reviews) && data.reviews.length > 0) {
    return data.reviews
  }
  return DEFAULT_REVIEWS
}

// Helper: Save reviews to storage layer with local file fallback
async function saveStoredReviews(reviews: StoredReview[]) {
  await writeEditorialData(FILE_PATH, { reviews, updatedAt: new Date().toISOString() })
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const paperId = searchParams.get("paperId")

    let reviews = await getStoredReviews()

    if (paperId) {
      const cleanPaperId = paperId.toLowerCase().trim()
      reviews = reviews.filter(r => r.paperId && r.paperId.toLowerCase().trim() === cleanPaperId)
    }

    return NextResponse.json({ ok: true, reviews, total: reviews.length })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      id = `REV-FB-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      paperId,
      reviewerName,
      reviewerEmail,
      originality = 4,
      methodology = 4,
      clarity = 4,
      significance = 4,
      commentsAuthor = "",
      commentsEditor = "",
      recommendation = "Minor Revisions",
      status = "Pending Moderation",
      sanitizedCommentsAuthor = ""
    } = body

    if (!paperId || !reviewerName) {
      return NextResponse.json({ ok: false, error: "paperId and reviewerName are required" }, { status: 400 })
    }

    const currentReviews = await getStoredReviews()
    const existingIndex = currentReviews.findIndex(r => r.id === id || (r.paperId.toLowerCase() === paperId.toLowerCase() && r.reviewerName.toLowerCase() === reviewerName.toLowerCase()))

    const newRecord: StoredReview = {
      id: existingIndex >= 0 ? currentReviews[existingIndex].id : id,
      paperId,
      reviewerName,
      reviewerEmail,
      originality: Number(originality) || 4,
      methodology: Number(methodology) || 4,
      clarity: Number(clarity) || 4,
      significance: Number(significance) || 4,
      commentsAuthor,
      commentsEditor,
      recommendation,
      status: (status as any) || "Pending Moderation",
      sanitizedCommentsAuthor: sanitizedCommentsAuthor || commentsAuthor,
      createdAt: existingIndex >= 0 ? currentReviews[existingIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    let updatedReviews: StoredReview[]
    if (existingIndex >= 0) {
      updatedReviews = [...currentReviews]
      updatedReviews[existingIndex] = { ...updatedReviews[existingIndex], ...newRecord }
    } else {
      updatedReviews = [newRecord, ...currentReviews]
    }

    await saveStoredReviews(updatedReviews)

    return NextResponse.json({ ok: true, review: newRecord })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { id, paperId, reviewerName, sanitizedCommentsAuthor, status, commentsEditor, moderationNotes } = body

    if (!id && (!paperId || !reviewerName)) {
      return NextResponse.json({ ok: false, error: "id or (paperId and reviewerName) required to patch review" }, { status: 400 })
    }

    let currentReviews = await getStoredReviews()
    let found = false

    currentReviews = currentReviews.map(r => {
      const matchId = id && r.id === id
      const matchKey = paperId && reviewerName && r.paperId.toLowerCase() === paperId.toLowerCase() && r.reviewerName.toLowerCase() === reviewerName.toLowerCase()
      if (matchId || matchKey) {
        found = true
        return {
          ...r,
          sanitizedCommentsAuthor: sanitizedCommentsAuthor !== undefined ? sanitizedCommentsAuthor : r.sanitizedCommentsAuthor,
          status: status || r.status,
          commentsEditor: commentsEditor !== undefined ? commentsEditor : r.commentsEditor,
          moderationNotes: moderationNotes !== undefined ? moderationNotes : r.moderationNotes,
          updatedAt: new Date().toISOString()
        }
      }
      return r
    })

    if (!found && id) {
      // Create released placeholder if missing
      currentReviews.push({
        id,
        paperId: paperId || "SOMED-26-RW01",
        reviewerName: reviewerName || "Verified Referee",
        status: status || "Released",
        originality: 4,
        methodology: 4,
        clarity: 4,
        significance: 4,
        commentsAuthor: sanitizedCommentsAuthor || "",
        sanitizedCommentsAuthor: sanitizedCommentsAuthor || "",
        recommendation: "Minor Revisions",
        createdAt: new Date().toISOString()
      })
    }

    await saveStoredReviews(currentReviews)

    return NextResponse.json({ ok: true, message: "Review updated in Supabase" })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
