import { HeartPulse } from "lucide-react"
import { JournalPage } from "@/components/journal-page"
import type { Article } from "@/components/article-card"

const sampleArticles: Article[] = [
  {
    id: "clai-2026-001",
    title: "Clinical Validation of an AI Diagnostic Tool for Automated Mammography in Diverse Patient Cohorts",
    authors: ["Dr. Sarah Jenkins", "Prof. Kenji Takahashi"],
    abstract: "This study validates a deep learning diagnostic system for mammography screening, showing robust sensitivity and specificity across multicenter datasets.",
    keywords: ["Artificial Intelligence", "Mammography", "Breast Cancer", "Clinical Validation"],
    doi: "10.12345/clai.2026.001",
    publishedDate: "2026-04-12",
    articleType: "research",
  },
  {
    id: "clai-2026-002",
    title: "Integrating LLM Copilots in Electronic Health Record Workflows: A Randomized Usability Trial",
    authors: ["Dr. Maya Lin", "Dr. David Vance"],
    abstract: "We evaluate the impact of LLM-assisted documentation in EHR systems, showing substantial reductions in administrative burden and high clinician satisfaction.",
    keywords: ["Large Language Models", "EHR", "Clinical Workflow", "Usability"],
    doi: "10.12345/clai.2026.002",
    publishedDate: "2026-05-18",
    articleType: "research",
  },
]

export default function ClinicalAIPage() {
  return (
    <JournalPage
      title="Scholarly Open: Clinical AI & Digital Health"
      description="Clinical applications of machine learning, digital health systems, and computational diagnostics."
      heroDescription="A Gold Open Access journal publishing peer-reviewed research at the intersection of computer science, medical devices, and clinical patient care."
      heroIcon={<HeartPulse className="h-8 w-8 text-primary" />}
      scopeAreas={[
        "Machine learning in medical imaging and diagnostics",
        "Clinical decision support systems (CDSS)",
        "Large language models (LLMs) in clinical workflows",
        "Wearable devices and remote patient monitoring",
        "Digital therapeutics and mobile health (mHealth)",
        "Biomedical signal processing and telemetry",
        "AI ethics, bias, and regulatory compliance in healthcare",
        "Epidemiological modeling and public health informatics",
      ]}
      sectionTopics={[
        "Medical Imaging AI",
        "Clinical NLP & Documentation",
        "Wearable Technology & Sensors",
        "Digital Therapeutics",
        "Decision Support Systems",
        "Ethics & Bias in Clinical AI",
        "Health Informatics & Infrastructure",
      ]}
      mainHighlights={[
        { title: "Clinical Validity First", description: "All published AI models must demonstrate real-world clinical utility and rigorous validation." },
        { title: "Open & Auditable Code", description: "Encourages authors to share code, weights, and replication scripts for transparency." },
        { title: "Interdisciplinary Focus", description: "Bridges the gap between computer science innovators and practicing clinicians." },
      ]}
      sampleArticles={sampleArticles}
      journalSlug="clinical-ai"
    />
  )
}
