// Canonical Editorial Constants for Rounds, Historical Baselines, and Handling Editor Directives

export interface RafRecord {
  reviewerName: string
  reviewerEmail: string
  manuscriptId: string
  manuscriptTitle: string
  manuscriptType: string
  typeOfReview: string
  journal: string
  dueDate: string
  submittedDate: string
  keyWords: string
  structure: {
    lengthOfArticle: string
    numberOfTables: string
    numberOfFigures: string
  }
  priorityRating: number
  generalComments: string
  specificComments: string[]
  confidentialCommentsEditor: string
  recommendation: string
  status: string
}

export const PRAVEEN_NAGULA_R1_RAF: RafRecord = {
  reviewerName: "Dr. Praveen Nagula",
  reviewerEmail: "drpraveennagula@gmail.com",
  manuscriptId: "SOMED-26-RW01",
  manuscriptTitle: "Prevent Earlier, Recognize Sooner, Treat Faster: An Evidence-Based Healthcare Operations Approach to Acute Aortic Dissection",
  manuscriptType: "PERSPECTIVE / REVIEW ARTICLE",
  typeOfReview: "DOUBLE-BLINDED (ROUND 1 INITIAL REVIEW)",
  journal: "Scholarly Open: Medicine",
  dueDate: "Completed (Round 1)",
  submittedDate: "2026-08-28",
  keyWords: "Acute Aortic Dissection; Emergency Medicine; Healthcare Operations; Quality Improvement",
  structure: {
    lengthOfArticle: "too long",
    numberOfTables: "needs tables",
    numberOfFigures: "none provided"
  },
  priorityRating: 6,
  generalComments: "General comments to the Author(s):\nThe review article to be concised. Tables to be provided.",
  specificComments: [
    "too low references for a review article",
    "what has been changed over the years in the management to be mentioned",
    "the manuscript to be neatly structured to have a good orientation for the reader regarding the topic",
    "no figures were provided",
    "atleast tables to be there"
  ],
  confidentialCommentsEditor: "Reviewer evaluated submission via Electronic Assessment Form (RAF). Priority rating: 6/10. Recommendation: Re-write and Re-submit.",
  recommendation: "Re-write and Re-submit",
  status: "Completed (Round 1 Archived - Locked)"
}

export const CHAUD_GJ_R1_RAF: RafRecord = {
  reviewerName: "Dr. German J. Chaud",
  reviewerEmail: "germanchaud@gmail.com",
  manuscriptId: "SOMED-26-RW01",
  manuscriptTitle: "Prevent Earlier, Recognize Sooner, Treat Faster: An Evidence-Based Healthcare Operations Approach to Acute Aortic Dissection",
  manuscriptType: "PERSPECTIVE / REVIEW ARTICLE",
  typeOfReview: "DOUBLE-BLINDED (ROUND 1 INITIAL REVIEW)",
  journal: "Scholarly Open: Medicine",
  dueDate: "Completed (Round 1)",
  submittedDate: "2026-10-09",
  keyWords: "Acute Aortic Dissection; Emergency Cardiovascular Care; Regional Networks; Implementation Science",
  structure: {
    lengthOfArticle: "too long",
    numberOfTables: "needs tables",
    numberOfFigures: "needs simplified diagram"
  },
  priorityRating: 4,
  generalComments: "This manuscript addresses an important and frequently underestimated challenge in cardiovascular medicine: the need to approach acute aortic dissection (AAD) not only as a surgical emergency but also as a time-dependent healthcare systems challenge.\n\nThe proposed Evidence-Based Integrated Rapid Aortic Response Framework (EB-IRARF) offers a potentially valuable perspective by integrating prevention, early recognition, multidisciplinary coordination, organizational preparedness, and continuous quality improvement.\n\nThe manuscript's principal strength is its recognition that successful treatment depends not only on clinical expertise but also on the ability of healthcare systems to deliver that expertise without unnecessary delay.\n\nHowever, several methodological and conceptual issues require clarification before the manuscript can be considered for publication.",
  specificComments: [
    "Clarification of manuscript type and methodology: Define as a narrative perspective or include reproducible search methodology.",
    "Inconsistencies between manuscript and supplementary materials: Clarify whether supplementary analyses belong to this submission or withdraw them.",
    "Ethics approval and informed consent: Accompanied ethics statement reports institutional approval whereas manuscript describes no original human-subject research.",
    "Greater emphasis on regional aortic networks and interhospital transfer: Frame intrahospital organization around regional referral networks, rapid CT sharing, and interhospital transfer protocols.",
    "Prioritization of clinically relevant interventions: Separate established clinical priorities from conceptual proposals.",
    "Hospital leadership and executive escalation: Implement tiered escalation based on predefined operational barriers.",
    "Public awareness and reference to Senator Lindsey Graham: Substantially shorten Author's Note and present the event as contextual motivation.",
    "Framework validation and measurable outcomes: Define explicit implementation and evaluation strategy with measurable performance indicators."
  ],
  confidentialCommentsEditor: "Dear Editor-in-Chief,\n\nI recommend Major Revision, conditional upon satisfactory clarification of the supplementary data and ethics documentation.",
  recommendation: "Re-review and Accept with Major Changes",
  status: "Completed (Round 1 Archived - Locked)"
}

export const KANTHLAL_HANDLING_EDITOR_DIRECTIVE = {
  editorName: "Dr. S. K. Kanthlal, M.Pharm., Ph.D.",
  editorRole: "2nd Handling Editor (Assigned in succession after Dr. Weihua Gong)",
  editorAffiliation: "Kerala University of Health Sciences, Kerala, India",
  editorEmail: "lalpharm@gmail.com",
  recipient: "Noor F (Journal Manager) & Dr. Sam Lee (Author)",
  manuscriptId: "SOMED-26-RW01",
  date: "2026-11-16",
  verdict: "Minor Revision Required (Pre-Publication Refinements)",
  summaryRequirements: [
    "Address Manuscript Length and eliminate remaining redundancy (Especially in the Introduction Section).",
    "Reduce the Abstract length to 300 words or below.",
    "Narrow and crystal-clarify the scope to be selective and tightly focused as a Perspective Article."
  ],
  rawEmailText: `Dear Noor F,

I have gone through the manuscript, comments and the explanations thoroughly. The reviewers have put appreciable efforts in critically evaluating the manuscript. 

Also the authors have carefully addressed the comments with relevant explanations. 

But there are still a few deficiencies to address to make this work publishable. 

As mentioned by Reviewer 2, the Manuscript Length and redundancy need to be carefully addressed again (Especially in the Introduction Section). 
The abstract is lengthy (reduce to 300 or below). 
As it is a Perspective article, The Scope should be narrow nd crystal clear and must be Narrow and selective.

But overall, the work looks good and is appreciable. After those minor revisions, it may be publishable .. 


Regards
Dr. Kanthlal
Editor`
}
