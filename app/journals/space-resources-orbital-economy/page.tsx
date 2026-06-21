import { Rocket } from "lucide-react"
import { JournalPage } from "@/components/journal-page"
import { articles } from "@/lib/data/articles"

export default function SpaceResourcesPage() {
  return (
    <JournalPage
      title="Scholarly Open: Space Resources & Orbital Economy"
      description="In-situ lunar/asteroid resource utilization, space logistics, orbital debris, and space law."
      heroDescription="A Gold Open Access journal publishing peer-reviewed research in space extraction technologies (ISRU), orbital infrastructure, space debris mitigation, and policy."
      heroIcon={<Rocket className="h-8 w-8 text-primary" />}
      scopeAreas={[
        "In-situ resource utilization (ISRU) on the Moon, Mars, and asteroids",
        "Regolith processing, excavation, and sintering for space construction",
        "Extraction of lunar water ice and propellant manufacturing",
        "Space logistics, orbital refueling, and transportation architectures",
        "Orbital debris tracking, remediation, and recycling systems",
        "Space economics, commercialization models, and risk management",
        "International space law, policy frameworks, and planetary protection",
      ]}
      sectionTopics={[
        "ISRU Extraction & Processing",
        "Off-World Materials & Construction",
        "Propellants & Fueling Infrastructure",
        "Orbital Mechanics & Logistics",
        "Debris Remediation & Recycling",
        "Space Policy, Law & Economics",
      ]}
      mainHighlights={[
        { title: "Off-World Scaling", description: "Dedicated to the engineering and physics required to sustain human presence off-world." },
        { title: "Policy & Tech Integration", description: "Bridges state-of-the-art space systems engineering with international space law and diplomacy." },
        { title: "Open Flight Data", description: "Encourages the sharing of orbital telemetry, simulated environmental datasets, and regolith mechanical specs." },
      ]}
      sampleArticles={articles.filter(a => a.journalSlug === "space-resources-orbital-economy")}
      journalSlug="space-resources-orbital-economy"
    />
  )
}
