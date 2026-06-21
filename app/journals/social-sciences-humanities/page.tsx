import { UsersRound } from "lucide-react"
import { JournalPage } from "@/components/journal-page"
import { articles } from "@/lib/data/articles"


export default function SocialSciencesPage() {
  return (
    <JournalPage
      title="Scholarly Open: Social Sciences & Humanities"
      description="Research exploring social systems, history, culture, behavior, and societal change through rigorous interdisciplinary scholarship."
      heroDescription="A Gold Open Access journal committed to FAIR social science and humanities research, inclusive scholarship, and evidence-based policy impact."
      heroIcon={<UsersRound className="h-8 w-8 text-primary" />}
      scopeAreas={[
        "Social policy, governance, and law",
        "Historical analyses and cultural heritage",
        "Philosophy, ethics, and human values",
        "Literature, media, and language studies",
        "Migration, mobility, and globalization",
        "Digital society, technology, and inequality",
        "Environmental and social justice",
        "Economic behavior and labor markets",
        "Education and learning systems",
        "Civic participation and democracy",
      ]}
      sectionTopics={[
        "Sociology",
        "History & Archaeology",
        "Philosophy & Ethics",
        "Literature & Cultural Studies",
        "Political Science & Public Policy",
        "Psychology & Cognitive Sciences",
        "Economics & Development Studies",
        "Linguistics & Communication",
      ]}
      mainHighlights={[
        { title: "Policy Relevance", description: "Research with direct implications for public policy and social innovation." },
        { title: "Global Perspectives", description: "Comparative studies from communities around the world." },
        { title: "Fair and Open Research", description: "FAIR-friendly publication standards that support reuse and transparency." },
      ]}
      sampleArticles={articles.filter(a => a.journalSlug === "social-sciences-humanities")}
      journalSlug="social-sciences-humanities"
    />
  )
}
