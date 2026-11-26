export interface Article {
  id: string
  title: string
  authors: string[]
  abstract: string
  keywords: string[]
  doi: string
  publishedDate: string
  articleType: "research" | "review" | "methodology" | "editorial" | "perspective"
  journalSlug: string
  section?: string
  pdfUrl?: string
  isUnpublishedProof?: boolean
  lifecycleStatus?: "published" | "under_review" | "revision_requested" | "accepted"
  trackId?: string
  submissionDate?: string
  handlingEditor?: string
  handlingEditorSlug?: string
  reviewRound?: number
  reviewStatusText?: string
  peerReviewMode?: "two-stage" | "double-blind" | "open"
  openScienceBadges?: {
    openData?: string
    openCode?: string
    preprintDoi?: string
    preregistration?: string
  }
}

export function isSampleArticle(article: { doi?: string; id?: string }): boolean {
  return false
}

// Live articles stream (supports both published Version of Record and open submissions Under Review)
export const articles: Article[] = [
  {
    id: "SOMED-26-RW01",
    title: "Prevent Earlier, Recognize Sooner, Treat Faster: A Proposed Evidence-Based Medicine–Integrated Rapid Response Framework (EBM-IRRF) for Acute Aortic Dissection",
    authors: [
      "Sam Lee, M.D., Ph.D."
    ],
    abstract: "Acute aortic dissection (AAD) remains a rapidly fatal cardiovascular emergency despite major advances in diagnostic imaging, perioperative management, intensive care, and cardiovascular surgery. This scholarly perspective proposes an Evidence-Based Medicine–Integrated Rapid Response Framework (EBM-IRRF) synthesizing contemporary clinical guidelines, major observational studies, and systems thinking across seven complementary healthcare operations strategies spanning the continuum of care from home and primary care to emergency treatment and long-term follow-up.",
    keywords: [
      "Acute Aortic Dissection",
      "Evidence-Based Medicine",
      "Rapid Response Framework",
      "Healthcare Operations",
      "Regional Aortic Networks",
      "Interhospital Transfer",
      "Multidisciplinary Care",
      "Artificial Intelligence",
      "Organizational Accountability",
      "Quality Improvement"
    ],
    doi: "Pending Editorial Decision (Track: SOMED-26-RW01)",
    publishedDate: "2026-10-26",
    submissionDate: "2026-10-26",
    articleType: "perspective",
    journalSlug: "medicine",
    section: "Cardiology & Healthcare Operations",
    pdfUrl: "/manuscripts/SOMED-26-RW01-revised-manuscript.pdf",
    lifecycleStatus: "under_review",
    trackId: "SOMED-26-RW01",
    handlingEditor: "Karez Namiq, M.D. M.Sc",
    handlingEditorSlug: "karez-namiq",
    reviewRound: 1,
    reviewStatusText: "Under Peer Review · Round 1",
    peerReviewMode: "two-stage",
    openScienceBadges: {
      preprintDoi: "SO-PREPRINT-2026-SOMED01",
      openData: "https://zenodo.org"
    },
    isUnpublishedProof: false
  }
];

// Preserved for legacy reference
export const pendingEvaluationArticles: Article[] = articles.filter(a => a.lifecycleStatus === "under_review");
