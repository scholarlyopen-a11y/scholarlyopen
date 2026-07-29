import { Stethoscope } from "lucide-react"
import { JournalPage } from "@/components/journal-page"
import { articles } from "@/lib/data/articles"
import { editors } from "@/lib/data/editors"

export default function MedicinePage() {
  const associateEditors = editors.filter(e => e.journalSlug === "medicine" && (e.role === "Associate Editor" || e.role === "Editor-in-Chief"))
  const editorialBoard = editors.filter(e => e.journalSlug === "medicine" && e.role === "Editorial Board Member")

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
        "Surgery and transplant medicine",
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
        "Organ Transplantation",
      ]}
      mainHighlights={[
        { title: "Patient-Centered Research", description: "Work that improves clinical outcomes and healthcare delivery." },
        { title: "Transparent Methodology", description: "Supports open protocols and reproducible clinical science." },
        { title: "Collaborative Care", description: "Highlights multidisciplinary approaches to health innovation." },
      ]}
      sampleArticles={articles.filter(a => a.journalSlug === "medicine")}
      journalSlug="medicine"
      associateEditors={associateEditors.length > 0 ? associateEditors : undefined}
      editorialBoard={editorialBoard.length > 0 ? editorialBoard : undefined}
    />
  )
}
