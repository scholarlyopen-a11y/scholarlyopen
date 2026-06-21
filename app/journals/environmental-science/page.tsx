import { Sprout } from "lucide-react"
import { JournalPage } from "@/components/journal-page"
import { articles } from "@/lib/data/articles"

export default function EnvironmentalSciencePage() {
  return (
    <JournalPage
      title="Scholarly Open: Environmental Science"
      description="Interdisciplinary research in climate science, sustainability, ecosystems, and environmental policy."
      heroDescription="A Gold Open Access journal dedicated to FAIR environmental research that supports climate action, stewardship, and sustainable development."
      heroIcon={<Sprout className="h-8 w-8 text-primary" />}
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
      sampleArticles={articles.filter(a => a.journalSlug === "environmental-science")}
      journalSlug="environmental-science"
    />
  )
}
