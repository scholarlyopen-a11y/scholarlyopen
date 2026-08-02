import { Dna } from "lucide-react"
import { JournalPage } from "@/components/journal-page"
import { articles } from "@/lib/data/articles"
import { editors } from "@/lib/data/editors"

export default function SyntheticBiologyPage() {
  const journalEditors = editors.filter(e => e.journalSlug === "synthetic-biology-bio-design")
  const associateEditors = journalEditors.filter(e => e.role === "Associate Editor")
  const editorialBoard = journalEditors.filter(e => e.role === "Editorial Board Member")

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
      sampleArticles={articles.filter(a => a.journalSlug === "synthetic-biology-bio-design")}
      journalSlug="synthetic-biology-bio-design"
      associateEditors={associateEditors}
      editorialBoard={editorialBoard}
    />
  )
}
