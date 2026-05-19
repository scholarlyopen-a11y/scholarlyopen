import { Leaf } from "lucide-react"
import { JournalPage } from "@/components/journal-page"
import type { Article } from "@/components/article-card"

const sampleArticles: Article[] = [
  {
    id: "bio-2025-001",
    title: "Single-Cell Transcriptomics Reveals Novel Mechanisms in Plant Root Development",
    authors: ["Dr. Anika Hoffmann", "Prof. Clara Rossi"],
    abstract: "This study uses single-cell transcriptomics to map gene expression dynamics during root development, revealing new regulators of cell differentiation.",
    keywords: ["Single-cell", "Plant biology", "Development", "Transcriptomics"],
    doi: "10.12345/bio.2025.001",
    publishedDate: "2025-01-20",
    articleType: "research",
  },
  {
    id: "bio-2025-002",
    title: "Microbiome Composition and Host Immunity in Marine Ecosystems",
    authors: ["Dr. Sofia Martínez", "Dr. Lars Jensen"],
    abstract: "We analyze microbial community dynamics and host immune responses across coastal marine populations, with implications for ecosystem health.",
    keywords: ["Microbiome", "Immunity", "Marine biology", "Ecosystems"],
    doi: "10.12345/bio.2025.002",
    publishedDate: "2025-02-11",
    articleType: "review",
  },
  {
    id: "bio-2025-003",
    title: "CRISPR-Based Tools for Targeted Genetic Engineering in Crop Improvement",
    authors: ["Prof. Dr. Nina Patel", "Dr. Jonas Weiss"],
    abstract: "This paper explores CRISPR-Cas approaches for precise genome editing in major crops, enabling traits for resilience and nutritional quality.",
    keywords: ["CRISPR", "Genetic engineering", "Crops", "Biotechnology"],
    doi: "10.12345/bio.2025.003",
    publishedDate: "2025-03-05",
    articleType: "methodology",
  },
]

export default function BiologyPage() {
  return (
    <JournalPage
      title="Scholarly Open: Biology"
      description="Experimental and translational biology spanning molecular, cellular, and systems research."
      heroDescription="A Gold Open Access journal showcasing FAIR biological research with strong links to reproducibility and translational impact."
      heroIcon={<Leaf className="h-8 w-8" />}
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
      mainHighlights={[
        { title: "Translational Impact", description: "Bridges fundamental biology and applied research for health and environment." },
        { title: "Reproducible Data", description: "Encourages open data and clear methods for reuse." },
        { title: "Interdisciplinary Growth", description: "Connects life science disciplines across scales and systems." },
      ]}
      sampleArticles={sampleArticles}
      journalSlug="biology"
    />
  )
}
