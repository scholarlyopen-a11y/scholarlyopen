import { Leaf } from "lucide-react"
import { JournalPage } from "@/components/journal-page"
import { articles } from "@/lib/data/articles"

export default function BiologyPage() {
  return (
    <JournalPage
      title="Scholarly Open: Biology"
      description="Experimental and translational biology spanning molecular, cellular, and systems research."
      heroDescription="A Gold Open Access journal showcasing FAIR biological research with strong links to reproducibility and translational impact."
      heroIcon={<Leaf className="h-8 w-8 text-primary" />}
      scopeAreas={[
        "Molecular and cellular biology",
        "Systems biology and physiology",
        "Genomics and proteomics",
        "Ecology and biodiversity",
        "Biotechnology and synthetic biology",
        "Evolutionary biology",
        "Translational research",
        "Conservation biology",
      ]}
      sectionTopics={[
        "Molecular Biology",
        "Cell Biology",
        "Genetics & Genomics",
        "Microbiology",
        "Ecology",
        "Evolutionary Biology",
        "Biotechnology",
      ]}
      mainHighlights={[
        { title: "Translational Impact", description: "Bridges fundamental biology and applied research for health and environment." },
        { title: "Reproducible Data", description: "Encourages open data and clear methods for reuse." },
        { title: "Interdisciplinary Growth", description: "Connects life science disciplines across scales and systems." },
      ]}
      sampleArticles={articles.filter(a => a.journalSlug === "biology")}
      journalSlug="biology"
    />
  )
}
