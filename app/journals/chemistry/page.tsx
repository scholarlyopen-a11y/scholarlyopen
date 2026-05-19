import { Beaker } from "lucide-react"
import { JournalPage } from "@/components/journal-page"
import type { Article } from "@/components/article-card"

const sampleArticles: Article[] = [
  {
    id: "chem-2025-001",
    title: "Catalytic Conversion of Biomass-Derived Feedstocks into Sustainable Chemicals",
    authors: ["Dr. Elena Novak", "Prof. Martin Klein"],
    abstract: "This work presents an efficient catalytic process for transforming biomass-derived substrates into value-added chemicals with reduced energy consumption.",
    keywords: ["Catalysis", "Sustainable chemistry", "Biomass", "Green chemistry"],
    doi: "10.12345/chem.2025.001",
    publishedDate: "2025-01-30",
    articleType: "research",
  },
  {
    id: "chem-2025-002",
    title: "Nanostructured Materials for Next-Generation Energy Storage",
    authors: ["Dr. Aisha Khatri", "Dr. Peter van Dijk"],
    abstract: "We design and characterize nanostructured electrode materials that enable enhanced charge density and lifetime in high-performance energy storage devices.",
    keywords: ["Nanomaterials", "Energy storage", "Materials chemistry", "Nanotechnology"],
    doi: "10.12345/chem.2025.002",
    publishedDate: "2025-02-18",
    articleType: "research",
  },
  {
    id: "chem-2025-003",
    title: "Computational Chemistry for Predicting Reaction Pathways in Sustainable Synthesis",
    authors: ["Prof. Dr. Mei Lin", "Dr. Christoph Bauer"],
    abstract: "This article evaluates computational modeling methods to predict reaction mechanisms and optimize routes for sustainable synthetic chemistry.",
    keywords: ["Computational chemistry", "Reaction mechanisms", "Sustainability", "Modeling"],
    doi: "10.12345/chem.2025.002",
    publishedDate: "2025-03-12",
    articleType: "review",
  },
]

export default function ChemistryPage() {
  return (
    <JournalPage
      title="Scholarly Open: Chemistry"
      description="Research in chemical sciences, materials, catalysis, and sustainable chemical technologies."
      heroDescription="A Gold Open Access journal focused on FAIR chemical research that supports sustainable innovation and materials discovery."
      heroIcon={<Beaker className="h-8 w-8" />}
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
      sampleArticles={sampleArticles}
      journalSlug="chemistry"
    />
  )
}
