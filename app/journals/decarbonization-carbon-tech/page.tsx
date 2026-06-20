import { Wind } from "lucide-react"
import { JournalPage } from "@/components/journal-page"
import type { Article } from "@/components/article-card"

const sampleArticles: Article[] = [
  {
    id: "dec-2026-001",
    title: "Enhancing CO2 Adsorption Capacity in Metal-Organic Frameworks via Amine Functionalization",
    authors: ["Dr. Lucas Mercier", "Prof. Sophie Dubois"],
    abstract: "This study presents a novel synthesis method for functionalized MOFs, showing a 35% increase in carbon dioxide capture capacity under ambient flue gas conditions.",
    keywords: ["Metal-Organic Frameworks", "Carbon Capture", "Adsorption", "Materials Science"],
    doi: "10.12345/dec.2026.001",
    publishedDate: "2026-02-15",
    articleType: "research",
  },
  {
    id: "dec-2026-002",
    title: "Lifecycle Carbon Accounting of Offshore Kelp Sinking for Marine Carbon Dioxide Removal",
    authors: ["Dr. Ryan O'Connor", "Dr. Yuki Sato"],
    abstract: "We conduct a cradle-to-grave lifecycle assessment of kelp aquaculture and deep-sea deposition, verifying net carbon removal efficiency and cost-per-ton metrics.",
    keywords: ["Ocean Carbon Dioxide Removal", "Lifecycle Assessment", "Kelp Aquaculture", "Climate Tech"],
    doi: "10.12345/dec.2026.002",
    publishedDate: "2026-05-10",
    articleType: "research",
  },
]

const associateEditors = [
  {
    name: "Mohamed Ramadan Eletmany",
    role: "Associate Editor",
    affiliation: "South Valley University, Egypt",
    specialization: "Polymer chemistry, sustainable textile dyeing, molecular modeling (DFT), and surface modifications.",
    email: "mohamed.eletmany@sci.svu.edu.eg",
    orcid: "0000-0003-4868-4678",
    imageUrl: "/images/editors/mohamed-eletmany.jpg",
    assignedSections: [
      "Carbon Utilization & Conversion",
      "Industrial Decarbonization"
    ],
    expertise: [
      "Polymer Chemistry",
      "Sustainable Dyeing",
      "Molecular Modeling (DFT)",
      "Solar Cells (DSSCs)",
      "Surface Chemistry"
    ],
    badges: ["Founding Member"]
  }
]

export default function DecarbonizationPage() {
  return (
    <JournalPage
      title="Scholarly Open: Decarbonization & Carbon Tech"
      description="Engineered climate solutions, carbon capture, utilization, storage, and net-zero technologies."
      heroDescription="A Gold Open Access journal showcasing peer-reviewed innovation in carbon capture (CCUS), carbon removal, hydrogen economy, and industrial emissions reduction."
      heroIcon={<Wind className="h-8 w-8 text-primary" />}
      scopeAreas={[
        "Carbon capture technologies (flue gas and direct air capture)",
        "Carbon utilization and conversion (fuels, chemicals, materials)",
        "Carbon storage and mineralization (geological, ocean, soils)",
        "Hydrogen production (green, blue), storage, and transport",
        "Industrial electrification and high-temperature heat decarbonization",
        "Lifecycle carbon accounting, greenhouse gas auditing, and LCA protocols",
        "Climate engineering policy, carbon markets, and regulatory compliance",
      ]}
      sectionTopics={[
        "Carbon Capture (Point-Source & DAC)",
        "Carbon Utilization & Conversion",
        "Carbon Storage & Minerals",
        "Hydrogen & Alternative Fuels",
        "Industrial Decarbonization",
        "LCA & Carbon Accounting",
        "Climate Tech Policy & Economics",
      ]}
      mainHighlights={[
        { title: "Solutions-Oriented", description: "Focuses on scalable technologies and actionable engineering plans to achieve Net-Zero." },
        { title: "Rigorous LCA Audit", description: "Requires detailed lifecycle carbon footprint analysis for all experimental engineering submissions." },
        { title: "Cross-Sector Bridge", description: "Connects chemical engineers, environmental scientists, and climate policymakers." },
      ]}
      sampleArticles={sampleArticles}
      journalSlug="decarbonization-carbon-tech"
      associateEditors={associateEditors}
    />
  )
}
