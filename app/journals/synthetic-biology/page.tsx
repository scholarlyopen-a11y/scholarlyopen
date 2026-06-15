import { Dna } from "lucide-react"
import { JournalPage } from "@/components/journal-page"
import type { Article } from "@/components/article-card"

const sampleArticles: Article[] = [
  {
    id: "syn-2026-001",
    title: "Enzymatic Synthesis of Bio-Polyesters in Cell-Free Systems: Optimizing Yield and Crystallinity",
    authors: ["Dr. Hannah Schmidt", "Prof. Jean-Marc Petit"],
    abstract: "This article introduces a cell-free enzymatic cascade for producing sustainable polyesters, bypassing cellular toxicity limits and optimizing polymer length.",
    keywords: ["Cell-Free Systems", "Enzymatic Synthesis", "Bio-Polyesters", "Biomaterials"],
    doi: "10.12345/syn.2026.001",
    publishedDate: "2026-03-05",
    articleType: "research",
  },
  {
    id: "syn-2026-002",
    title: "Precision Gene Editing of Senescent Human Fibroblasts via CRISPR-Cas12a Ribonucleoproteins",
    authors: ["Dr. Clara Vanhoutte", "Dr. Alexander Thorne"],
    abstract: "We evaluate transfection parameters for editing senescent cells in vitro, achieving high target-site accuracy with zero off-target insertions.",
    keywords: ["CRISPR-Cas12a", "Cellular Senescence", "Gene Editing", "Senolytics"],
    doi: "10.12345/syn.2026.002",
    publishedDate: "2026-05-12",
    articleType: "research",
  },
]

export default function SyntheticBiologyPage() {
  return (
    <JournalPage
      title="Scholarly Open: Synthetic Biology & Bio-Design"
      description="De novo bio-design, CRISPR therapeutics, cell-free biomanufacturing, and metabolic pathways."
      heroDescription="A Gold Open Access journal publishing breakthrough peer-reviewed research in cellular reprogramming, genetic tools, cell-free bio-production, and engineering of life."
      heroIcon={<Dna className="h-8 w-8 text-primary" />}
      scopeAreas={[
        "De novo design of synthetic genomes, circuits, and metabolic networks",
        "CRISPR-Cas systems and precision genome editing innovations",
        "Cell-free transcription-translation (TX-TL) and biomanufacturing platforms",
        "Directed evolution and automated high-throughput strain selection",
        "DNA-based data storage and bio-computational logic gates",
        "Biosensors and diagnostics using engineered cells or enzymes",
        "Bioethics, biosecurity, and safety guidelines for synthetic organisms",
      ]}
      sectionTopics={[
        "Genetic Circuits & Programming",
        "Genome Editing & Engineering",
        "Cell-Free Systems & Biomanufacturing",
        "Directed Evolution & Selection",
        "Bio-Computing & DNA Storage",
        "Biosensors & Molecular Devices",
        "Bioethics & Biosecurity",
      ]}
      mainHighlights={[
        { title: "FAIR Sequence Data", description: "Mandates deposition of plasmid maps, FASTA sequences, and cloning protocols." },
        { title: "Industry & Translation", description: "Bridges basic synthetic biology and industrial biomanufacturing applications." },
        { title: "Rapid Turnaround", description: "Efficient and expert peer review by active bio-design practitioners." },
      ]}
      sampleArticles={sampleArticles}
      journalSlug="synthetic-biology"
    />
  )
}
