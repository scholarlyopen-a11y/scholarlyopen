import { Settings } from "lucide-react"
import { JournalPage } from "@/components/journal-page"
import { articles } from "@/lib/data/articles"
import { editors } from "@/lib/data/editors"

export default function EngineeringPage() {
  const journalEditors = editors.filter(e => e.journalSlug === "engineering")
  const associateEditors = journalEditors.filter(e => e.role === "Associate Editor")
  const editorialBoard = journalEditors.filter(e => e.role === "Editorial Board Member")

  return (
    <JournalPage
      title="Scholarly Open: Engineering"
      description="Applied engineering research across infrastructure, energy, robotics, and systems innovation."
      heroDescription="A Gold Open Access journal publishing FAIR engineering research that supports sustainable systems and technological progress."
      heroIcon={<Settings className="h-8 w-8 text-primary" />}
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
      sectionTopics={[
        "Mechanical Engineering",
        "Electrical Engineering",
        "Civil Engineering",
        "Chemical Engineering",
        "Computer Engineering",
        "Robotics",
        "Materials Engineering",
        "Energy Systems",
        "Industrial Engineering",
      ]}
      mainHighlights={[
        { title: "Sustainable Systems", description: "Engineering research focused on environmental and societal resilience." },
        { title: "Technology Impact", description: "Prioritizes practical solutions for real-world challenges." },
        { title: "Interdisciplinary Design", description: "Connects engineering with science, policy, and sustainability." },
      ]}
      sampleArticles={articles.filter(a => a.journalSlug === "engineering")}
      journalSlug="engineering"
      associateEditors={associateEditors}
      editorialBoard={editorialBoard}
    />
  )
}
