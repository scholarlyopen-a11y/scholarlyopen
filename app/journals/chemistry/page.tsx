import { Beaker } from "lucide-react"
import { JournalPage } from "@/components/journal-page"
import { articles } from "@/lib/data/articles"

export default function ChemistryPage() {
  return (
    <JournalPage
      title="Scholarly Open: Chemistry"
      description="Research in chemical sciences, materials, catalysis, and sustainable chemical technologies."
      heroDescription="A Gold Open Access journal focused on FAIR chemical research that supports sustainable innovation and materials discovery."
      heroIcon={<Beaker className="h-8 w-8 text-primary" />}
      scopeAreas={[
        "Catalysis and reaction engineering",
        "Materials chemistry",
        "Green and sustainable chemistry",
        "Analytical methods",
        "Computational chemistry",
        "Biophysical chemistry",
        "Energy materials",
        "Chemical synthesis",
      ]}
      sectionTopics={[
        "Organic Chemistry",
        "Inorganic Chemistry",
        "Analytical Chemistry",
        "Physical Chemistry",
        "Materials Chemistry",
        "Computational Chemistry",
        "Green Chemistry",
        "Catalysis",
        "Conservation Biology",
      ]}
      mainHighlights={[
        { title: "Sustainable Innovation", description: "Highlighting chemistry solutions for energy, climate and materials." },
        { title: "Data-Driven Results", description: "Encourages detailed data reporting for reproducibility." },
        { title: "Cross-Disciplinary Research", description: "Connects chemistry with biology, engineering, and environmental science." },
      ]}
      sampleArticles={articles.filter(a => a.journalSlug === "chemistry")}
      journalSlug="chemistry"
    />
  )
}
