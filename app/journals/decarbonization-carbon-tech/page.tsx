import { Wind } from "lucide-react"
import { JournalPage } from "@/components/journal-page"
import { articles } from "@/lib/data/articles"
import { editors } from "@/lib/data/editors"

export default function DecarbonizationPage() {
  const associateEditors = editors.filter(e => e.journalSlug === "decarbonization-carbon-tech")
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
      sampleArticles={articles.filter(a => a.journalSlug === "decarbonization-carbon-tech")}
      journalSlug="decarbonization-carbon-tech"
      associateEditors={associateEditors}
    />
  )
}
