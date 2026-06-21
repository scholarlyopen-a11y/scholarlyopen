import { Cpu } from "lucide-react"
import { JournalPage } from "@/components/journal-page"
import { articles } from "@/lib/data/articles"

export default function DataSciencePage() {
  return (
    <JournalPage
      title="Scholarly Open: Data Science"
      description="Data-driven research, AI-enabled analytics, statistical methods, and computational science."
      heroDescription="A Gold Open Access journal advancing FAIR data science research with strong emphasis on transparency, ethics, and practical impact."
      heroIcon={<Cpu className="h-8 w-8 text-primary" />}
      scopeAreas={[
        "Machine learning and AI",
        "Big data analytics",
        "Statistical modeling",
        "Data ethics and privacy",
        "Visualization and interpretation",
        "Computational science",
        "Decision support systems",
        "Reproducible data workflows",
        "Open data, metadata, and scientific metrics",
      ]}
      sectionTopics={[
        "Machine Learning",
        "Artificial Intelligence",
        "Big Data",
        "Statistics",
        "Data Ethics",
        "Computational Modeling",
        "NLP",
        "Computer Vision",
        "Reproducible Workflows",
        "Open Data, Metadata & Metrics",
      ]}
      mainHighlights={[
        { title: "Ethical AI", description: "Supports data science that is transparent, accountable, and fair." },
        { title: "Applied Insights", description: "Bridges theory and practice in real-world data applications." },
        { title: "Open Data", description: "Encourages datasets and code sharing for reuse and collaboration." },
      ]}
      sampleArticles={articles.filter(a => a.journalSlug === "data-science")}
      journalSlug="data-science"
    />
  )
}
