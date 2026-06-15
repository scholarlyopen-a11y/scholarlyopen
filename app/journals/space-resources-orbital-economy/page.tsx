import { Rocket } from "lucide-react"
import { JournalPage } from "@/components/journal-page"
import type { Article } from "@/components/article-card"

const sampleArticles: Article[] = [
  {
    id: "sr-2026-001",
    title: "Microwave Sintering of Lunar Regolith Simulant under Vacuum Conditions for Construction",
    authors: ["Dr. Evelyn Stone", "Prof. Marcus Vance"],
    abstract: "This paper evaluates microwave heating parameters to sinter JSC-1A lunar simulant in high vacuum, assessing compressive strength for lunar habitat building.",
    keywords: ["Lunar Regolith", "Microwave Sintering", "Lunar Construction", "ISRU"],
    doi: "10.12345/sr.2026.001",
    publishedDate: "2026-04-02",
    articleType: "research",
  },
  {
    id: "sr-2026-002",
    title: "Legal Frameworks for Asteroid Mining: Resolving Ownership of Space-Derived Resources",
    authors: ["Dr. Claire D'Amboise", "Prof. Richard Alvarez"],
    abstract: "We analyze international space law under the Artemis Accords, proposing a multilateral licensing framework to regulate property rights on asteroid minerals.",
    keywords: ["Space Law", "Artemis Accords", "Asteroid Mining", "Property Rights"],
    doi: "10.12345/sr.2026.002",
    publishedDate: "2026-05-20",
    articleType: "research",
  },
]

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
      sampleArticles={sampleArticles}
      journalSlug="space-resources-orbital-economy"
    />
  )
}
