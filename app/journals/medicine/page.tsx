import { Stethoscope } from "lucide-react"
import { JournalPage } from "@/components/journal-page"
import type { Article } from "@/components/article-card"

const sampleArticles: Article[] = [
  {
    id: "med-2025-001",
    title: "Telehealth Adoption and Clinical Outcomes in Rural Care Settings",
    authors: ["Dr. Miriam Schultz", "Dr. Lucas Wong"],
    abstract: "This study evaluates the impact of telehealth adoption on clinical outcomes and patient satisfaction in rural health systems.",
    keywords: ["Telehealth", "Rural health", "Clinical outcomes", "Digital health"],
    doi: "10.12345/med.2025.001",
    publishedDate: "2025-01-14",
    articleType: "research",
  },
  {
    id: "med-2025-002",
    title: "Precision Oncology Biomarkers for Personalized Cancer Therapy",
    authors: ["Dr. Amina Farah", "Prof. Henry Vogel"],
    abstract: "We assess emerging precision oncology biomarkers and their use in tailoring personalized cancer therapies for improved patient outcomes.",
    keywords: ["Precision medicine", "Oncology", "Biomarkers", "Personalized therapy"],
    doi: "10.12345/med.2025.002",
    publishedDate: "2025-02-06",
    articleType: "review",
  },
  {
    id: "med-2025-003",
    title: "Integrating Behavioral Health into Primary Care: A Systems Approach",
    authors: ["Dr. Elena Park", "Dr. Markus Fischer"],
    abstract: "This article presents a systems-based model for integrating behavioral health services into primary care practices to support mental health and chronic disease management.",
    keywords: ["Behavioral health", "Primary care", "Systems approach", "Health integration"],
    doi: "10.12345/med.2025.003",
    publishedDate: "2025-03-01",
    articleType: "methodology",
  },
]

export default function MedicinePage() {
  return (
    <JournalPage
      title="Scholarly Open: Medicine"
      description="Clinical research, translational medicine, and healthcare innovations that advance patient outcomes."
      heroDescription="A Gold Open Access journal supporting FAIR clinical research and innovation across medicine, public health, and clinical systems."
      heroIcon={<Stethoscope className="h-8 w-8 text-primary" />}
      scopeAreas={[
        "Clinical medicine and therapy",
        "Public health and epidemiology",
        "Precision medicine",
        "Health systems and services",
        "Digital health",
        "Health policy and equity",
        "Medical technology",
        "Translational research",
      ]}
      sectionTopics={[
        "Cardiology",
        "Neurology",
        "Oncology",
        "Gynecology & Obstetrics",
        "Pediatrics",
        "Psychiatry",
        "Surgery",
        "Public Health",
        "Physiotherapy & Rehabilitation",
        "Medical Imaging",
        "Emergency Medicine",
        "Pharmacology",
      ]}
      mainHighlights={[
        { title: "Patient-Centered Research", description: "Work that improves clinical outcomes and healthcare delivery." },
        { title: "Transparent Methodology", description: "Supports open protocols and reproducible clinical science." },
        { title: "Collaborative Care", description: "Highlights multidisciplinary approaches to health innovation." },
      ]}
      sampleArticles={sampleArticles}
      journalSlug="medicine"
    />
  )
}
