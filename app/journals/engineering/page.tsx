import { Settings } from "lucide-react"
import { JournalPage } from "@/components/journal-page"
import type { Article } from "@/components/article-card"

const sampleArticles: Article[] = [
  {
    id: "eng-2025-001",
    title: "Smart Infrastructure Design for Resilient Cities",
    authors: ["Dr. Michael Braun", "Prof. Elena Schmidt"],
    abstract: "This paper presents smart infrastructure design strategies to improve urban resilience, sustainability, and adaptability in cities.",
    keywords: ["Smart infrastructure", "Resilient cities", "Civil engineering", "Sustainability"],
    doi: "10.12345/eng.2025.001",
    publishedDate: "2025-01-28",
    articleType: "research",
  },
  {
    id: "eng-2025-002",
    title: "Renewable Energy Systems Optimization using Digital Twins",
    authors: ["Dr. Amina Farouk", "Dr. Jonas Meier"],
    abstract: "We explore the use of digital twin technology to optimize renewable energy systems and improve operational efficiency.",
    keywords: ["Digital twins", "Renewable energy", "Systems optimization", "Engineering"],
    doi: "10.12345/eng.2025.002",
    publishedDate: "2025-02-10",
    articleType: "research",
  },
  {
    id: "eng-2025-003",
    title: "Robotics and Automation for Sustainable Manufacturing",
    authors: ["Prof. Dr. Mia Keller", "Dr. Samuel Chen"],
    abstract: "This review highlights robotics and automation approaches that increase efficiency and sustainability in modern manufacturing systems.",
    keywords: ["Robotics", "Automation", "Manufacturing", "Sustainability"],
    doi: "10.12345/eng.2025.002",
    publishedDate: "2025-03-16",
    articleType: "review",
  },
]

export default function EngineeringPage() {
  return (
    <JournalPage
      title="Scholarly Open: Engineering"
      description="Applied engineering research across infrastructure, energy, robotics, and systems innovation."
      heroDescription="A Gold Open Access journal publishing FAIR engineering research that supports sustainable systems and technological progress."
      heroIcon={<Settings className="h-8 w-8" />}
      scopeAreas={[
        "Infrastructure and civil engineering",
        "Energy systems",
        "Robotics and automation",
        "Sustainable manufacturing",
        "Systems engineering",
        "Materials and mechanics",
        "Environmental engineering",
        "Smart systems and IoT",
      ]}
      mainHighlights={[
        { title: "Sustainable Systems", description: "Engineering research focused on environmental and societal resilience." },
        { title: "Technology Impact", description: "Prioritizes practical solutions for real-world challenges." },
        { title: "Interdisciplinary Design", description: "Connects engineering with science, policy, and sustainability." },
      ]}
      sampleArticles={sampleArticles}
      journalSlug="engineering"
    />
  )
}
