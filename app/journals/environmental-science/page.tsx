import { Globe } from "lucide-react"
import { JournalPage } from "@/components/journal-page"
import type { Article } from "@/components/article-card"

const sampleArticles: Article[] = [
  {
    id: "env-2025-001",
    title: "Climate Adaptation Strategies for Coastal Ecosystems",
    authors: ["Dr. Sophia Lange", "Prof. Dr. Daniel Meyer"],
    abstract: "This study examines climate adaptation strategies for protecting coastal ecosystems and communities from rising sea levels and extreme weather.",
    keywords: ["Climate adaptation", "Coastal ecosystems", "Environmental science", "Resilience"],
    doi: "10.12345/env.2025.001",
    publishedDate: "2025-01-25",
    articleType: "research",
  },
  {
    id: "env-2025-002",
    title: "Circular Economy Pathways for Reducing Plastic Waste",
    authors: ["Dr. Nina Schmidt", "Dr. Marco Rossi"],
    abstract: "We analyze circular economy approaches that reduce plastic waste through design, recycling, and systems-level policy interventions.",
    keywords: ["Circular economy", "Plastic waste", "Sustainability", "Environmental policy"],
    doi: "10.12345/env.2025.002",
    publishedDate: "2025-02-14",
    articleType: "research",
  },
  {
    id: "env-2025-003",
    title: "Urban Biodiversity and Ecosystem Services in Green Cities",
    authors: ["Prof. Dr. Lena Fischer", "Dr. Omar Hassan"],
    abstract: "This review explores the role of urban biodiversity in delivering ecosystem services and supporting resilient green cities.",
    keywords: ["Urban biodiversity", "Ecosystem services", "Green cities", "Conservation"],
    doi: "10.12345/env.2025.003",
    publishedDate: "2025-03-07",
    articleType: "review",
  },
]

export default function EnvironmentalSciencePage() {
  return (
    <JournalPage
      title="Scholarly Open: Environmental Science"
      description="Interdisciplinary research in climate science, sustainability, ecosystems, and environmental policy."
      heroDescription="A Gold Open Access journal dedicated to FAIR environmental research that supports climate action, stewardship, and sustainable development."
      heroIcon={<Globe className="h-8 w-8" />}
      scopeAreas={[
        "Climate science and adaptation",
        "Sustainability and circular economy",
        "Ecosystem services",
        "Environmental policy",
        "Conservation biology",
        "Water and air quality",
        "Natural resource management",
        "Urban ecology",
      ]}
      sectionTopics={[
        "Climate Science",
        "Sustainability",
        "Ecology",
        "Environmental Chemistry",
        "Water & Air Quality",
        "Conservation",
        "Natural Resource Management",
        "Urban Ecology",
      ]}
      mainHighlights={[
        { title: "Climate Action", description: "Research shaping policy and practice for a sustainable future." },
        { title: "Systemic Solutions", description: "Connects science, policy, and communities for environmental resilience." },
        { title: "Open Data", description: "Supports reproducible environmental data and transparent reporting." },
      ]}
      sampleArticles={sampleArticles}
      journalSlug="environmental-science"
    />
  )
}
