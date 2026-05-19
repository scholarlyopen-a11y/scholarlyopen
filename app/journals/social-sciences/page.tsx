import { Users } from "lucide-react"
import { JournalPage } from "@/components/journal-page"
import type { Article } from "@/components/article-card"

const sampleArticles: Article[] = [
  {
    id: "ss-2025-001",
    title: "Participatory Policy Design for Urban Climate Resilience",
    authors: ["Dr. Julia Meier", "Prof. Daniel Vogel"],
    abstract: "This article examines participatory policy frameworks that strengthen urban climate resilience through community-led decision making and social inclusion.",
    keywords: ["Urban policy", "Climate resilience", "Public participation", "Social justice"],
    doi: "10.12345/ss.2025.001",
    publishedDate: "2025-01-10",
    articleType: "research",
  },
  {
    id: "ss-2025-002",
    title: "Digital Inequality and Education Access in the 21st Century",
    authors: ["Dr. Nina Alvarez", "Dr. Samuel Kofi"],
    abstract: "We analyze how digital divides shape educational outcomes across diverse populations and propose pathways to equitable access in emerging learning systems.",
    keywords: ["Digital inequality", "Education", "Access", "Social policy"],
    doi: "10.12345/ss.2025.002",
    publishedDate: "2025-02-28",
    articleType: "review",
  },
  {
    id: "ss-2025-003",
    title: "Migration, Labor Markets, and Social Cohesion in Europe",
    authors: ["Prof. Marie Laurent", "Dr. Tobias Schneider"],
    abstract: "This study evaluates migration flows, labor market integration, and social cohesion policies across European economies with implications for inclusive governance.",
    keywords: ["Migration", "Labor", "Social cohesion", "Europe"],
    doi: "10.12345/ss.2025.003",
    publishedDate: "2025-03-21",
    articleType: "research",
  },
]

export default function SocialSciencesPage() {
  return (
    <JournalPage
      title="Scholarly Open: Social Sciences"
      description="Research exploring social systems, policy, behavior, and societal change through rigorous interdisciplinary scholarship."
      heroDescription="A Gold Open Access journal committed to FAIR social science research, inclusive scholarship, and evidence-based policy impact."
      heroIcon={<Users className="h-8 w-8" />}
      scopeAreas={[
        "Social policy and governance",
        "Migration and mobility",
        "Digital society and inequality",
        "Environmental justice",
        "Health and social care systems",
        "Economic behavior and labor markets",
        "Education and learning",
        "Civic participation and democracy",
      ]}
      mainHighlights={[
        { title: "Policy Relevance", description: "Research with direct implications for public policy and social innovation." },
        { title: "Global Perspectives", description: "Comparative studies from communities around the world." },
        { title: "Fair and Open Research", description: "FAIR-friendly publication standards that support reuse and transparency." },
      ]}
      sampleArticles={sampleArticles}
      journalSlug="social-sciences"
    />
  )
}
