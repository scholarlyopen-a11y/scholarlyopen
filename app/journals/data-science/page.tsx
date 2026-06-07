import { Cpu } from "lucide-react"
import { JournalPage } from "@/components/journal-page"
import type { Article } from "@/components/article-card"

const sampleArticles: Article[] = [
  {
    id: "ds-2025-001",
    title: "Explainable AI for Fair Decision Support Systems",
    authors: ["Dr. Lara Kim", "Prof. Tobias Neumann"],
    abstract: "This article evaluates explainable AI models in decision support systems and their contribution to fairness and stakeholder trust.",
    keywords: ["Explainable AI", "Fairness", "Decision support", "Data science"],
    doi: "10.12345/ds.2025.001",
    publishedDate: "2025-01-18",
    articleType: "research",
  },
  {
    id: "ds-2025-002",
    title: "Data-Driven Public Health Models for Pandemic Preparedness",
    authors: ["Dr. Emma Wagner", "Dr. Daniel Osei"],
    abstract: "We present data-driven modeling methods to support pandemic preparedness and public health planning with robust uncertainty quantification.",
    keywords: ["Public health", "Data modeling", "Pandemic preparedness", "Statistical analysis"],
    doi: "10.12345/ds.2025.002",
    publishedDate: "2025-02-22",
    articleType: "review",
  },
  {
    id: "ds-2025-003",
    title: "Federated Learning for Privacy-Preserving Healthcare Analytics",
    authors: ["Prof. Dr. Lena Sørensen", "Dr. Amir Ghani"],
    abstract: "This study explores federated learning architectures for healthcare analytics that preserve patient privacy while supporting collaborative model development.",
    keywords: ["Federated learning", "Privacy", "Healthcare analytics", "Machine learning"],
    doi: "10.12345/ds.2025.003",
    publishedDate: "2025-03-09",
    articleType: "methodology",
  },
  {
    id: "ds-2025-004",
    title: "Bringing Citations and Usage Metrics Together to Make Data Count",
    authors: ["Dr. Helena Cousijn", "Patricia Cruse", "Daniella Lowenberg"],
    abstract: "This paper presents the framework and initial outcomes of the Make Data Count initiative, establishing standard metrics for tracking data citations, views, and downloads across repositories.",
    keywords: ["Open data", "Data citation", "Metadata quality", "Scientometrics"],
    doi: "10.12345/ds.2025.004",
    publishedDate: "2025-04-12",
    articleType: "methodology",
  },
]

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
      sampleArticles={sampleArticles}
      journalSlug="data-science"
    />
  )
}
