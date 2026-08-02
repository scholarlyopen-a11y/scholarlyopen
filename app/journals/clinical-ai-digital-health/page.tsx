import { HeartPulse } from "lucide-react"
import { JournalPage } from "@/components/journal-page"
import { articles } from "@/lib/data/articles"
import { editors } from "@/lib/data/editors"

export default function ClinicalAIPage() {
  const journalEditors = editors.filter(e => e.journalSlug === "clinical-ai-digital-health")
  const associateEditors = journalEditors.filter(e => e.role === "Associate Editor")
  const editorialBoard = journalEditors.filter(e => e.role === "Editorial Board Member")

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
      sampleArticles={articles.filter(a => a.journalSlug === "clinical-ai-digital-health")}
      journalSlug="clinical-ai-digital-health"
      associateEditors={associateEditors}
      editorialBoard={editorialBoard}
    />
  )
}
