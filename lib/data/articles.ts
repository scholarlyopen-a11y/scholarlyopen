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
}

export function isSampleArticle(article: { doi?: string; id?: string }): boolean {
  return false
}

export const articles: Article[] = [
  {
    "id": "SOMED-26-RW01",
    "title": "Prevent Earlier, Recognize Sooner, Treat Faster: A Proposed Evidence-Based Medicine–Integrated Rapid Response Framework (EBM-IRRF) for Acute Aortic Dissection",
    "authors": [
      "Sam Lee, M.D., Ph.D."
    ],
    "abstract": "Acute aortic dissection (AAD) remains a rapidly fatal cardiovascular emergency despite major advances in diagnostic imaging, perioperative management, intensive care, and cardiovascular surgery. This scholarly perspective proposes an Evidence-Based Medicine–Integrated Rapid Response Framework (EBM-IRRF) synthesizing contemporary clinical guidelines, major observational studies, and systems thinking across seven complementary healthcare operations strategies spanning the continuum of care from home and primary care to emergency treatment and long-term follow-up.",
    "keywords": [
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
    "doi": "Pending Crossref Deposit (Identifier: SOMED-26-RW01)",
    "publishedDate": "2026-10-26",
    "articleType": "perspective",
    "journalSlug": "medicine",
    "section": "Cardiology & Healthcare Operations",
    "pdfUrl": "/manuscripts/SOMED-26-RW01-revised-manuscript.pdf",
    "isUnpublishedProof": true
  }
];
