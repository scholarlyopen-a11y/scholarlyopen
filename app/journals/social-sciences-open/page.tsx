"use client"

import { Brain } from "lucide-react"
import { JournalPage } from "@/components/journal-page"
import type { Article } from "@/components/article-card"
import type { EditorMember } from "@/components/journal-editorial-board"

const scopeAreas = [
  "Artificial Intelligence & Machine Learning",
  "Neural Networks & Deep Learning",
  "Natural Language Processing",
  "Computer Vision",
  "AI Ethics & Responsible AI",
  "Robotics & Automation",
  "Knowledge Representation",
  "AI Applications & Systems",
  "Quantum Computing",
  "Human-AI Interaction",
]

const sampleArticles: Article[] = [
  {
    id: "sjo-2024-001",
    title: "Attention Mechanisms in Transformer Networks: A Comprehensive Analysis of Self-Attention Variations",
    authors: ["Dr. Chen Wei", "Prof. James Miller", "Dr. Yuki Tanaka"],
    abstract: "This study provides an in-depth analysis of attention mechanism variations in transformer architectures. We examine computational efficiency, interpretability, and performance trade-offs across multiple attention types, providing guidelines for practitioners.",
    keywords: ["Transformers", "Attention mechanisms", "Neural networks", "NLP", "Deep learning"],
    doi: "10.12345/sjo.2024.001",
    publishedDate: "2024-03-15",
    articleType: "research",
    pdfUrl: "#",
  },
  {
    id: "sjo-2024-002",
    title: "Ethical Considerations in Large Language Model Deployment: A Framework for Responsible AI",
    authors: ["Prof. Sarah Anderson", "Dr. Marcus Chen"],
    abstract: "We present a comprehensive framework for addressing ethical concerns in LLM deployment, covering bias mitigation, transparency, accountability, and fairness. Our framework integrates technical and governance approaches with evidence from real-world implementations.",
    keywords: ["AI ethics", "Language models", "Responsible AI", "Fairness", "Governance"],
    doi: "10.12345/sjo.2024.002",
    publishedDate: "2024-02-28",
    articleType: "research",
    pdfUrl: "#",
  },
  {
    id: "sjo-2024-003",
    title: "Computer Vision for Medical Imaging: A Systematic Review of Deep Learning Applications",
    authors: ["Dr. Emma Rodriguez", "Prof. Klaus Mueller"],
    abstract: "This systematic review synthesizes findings from 156 studies on deep learning applications in medical imaging. We identify key algorithms, datasets, and challenges while proposing standardized evaluation metrics for clinical deployment.",
    keywords: ["Computer vision", "Medical imaging", "Deep learning", "CNN", "Systematic review"],
    doi: "10.12345/sjo.2024.003",
    publishedDate: "2024-01-20",
    articleType: "review",
    pdfUrl: "#",
  },
]

const editorInChief: EditorMember = {
  name: "Prof. Dr. Geoffrey Hinton",
  role: "Editor-in-Chief",
  affiliation: "Vector Institute, Canada",
  specialization: "Deep Learning & Neural Networks",
  email: "abbas.qurasani+social-sciences-journal-scholarisch@gmail.com",
  orcid: "0000-0001-2345-6789",
}

const associateEditors: EditorMember[] = [
  {
    name: "Prof. Dr. Yann LeCun",
    role: "Associate Editor",
    affiliation: "Meta AI, USA",
    specialization: "Computer Vision & Deep Learning",
    orcid: "0000-0002-3456-7890",
  },
  {
    name: "Prof. Dr. Yoshua Bengio",
    role: "Associate Editor",
    affiliation: "University of Montreal, Canada",
    specialization: "Machine Learning & AI",
    orcid: "0000-0003-4567-8901",
  },
  {
    name: "Prof. Dr. Fei-Fei Li",
    role: "Associate Editor",
    affiliation: "Stanford University, USA",
    specialization: "Computer Vision & Human-Centered AI",
    orcid: "0000-0004-5678-9012",
  },
]

const editorialBoard: EditorMember[] = [
  {
    name: "Prof. Dr. Stuart Russell",
    role: "Board Member",
    affiliation: "UC Berkeley, USA",
    specialization: "AI Safety & Alignment",
  },
  {
    name: "Prof. Dr. Demis Hassabis",
    role: "Board Member",
    affiliation: "DeepMind, UK",
    specialization: "Neuroscience-Inspired AI",
  },
  {
    name: "Dr. Kate Crawford",
    role: "Board Member",
    affiliation: "Microsoft Research, USA",
    specialization: "AI Ethics & Governance",
  },
  {
    name: "Prof. Dr. Michael Jordan",
    role: "Board Member",
    affiliation: "UC Berkeley, USA",
    specialization: "Machine Learning",
  },
  {
    name: "Prof. Dr. Dario Amodei",
    role: "Board Member",
    affiliation: "Anthropic, USA",
    specialization: "Large Language Models",
  },
  {
    name: "Dr. Timnit Gebru",
    role: "Board Member",
    affiliation: "DAIR, USA",
    specialization: "AI Bias & Fairness",
  },
]

export default function SocialSciencesOpenPage() {
  return (
    <JournalPage
      title="Scholarly Open Journal of Artificial Intelligence"
      description="Rigorous peer-reviewed research in artificial intelligence, machine learning, deep learning, computer vision, and neural networks."
      heroDescription="A Gold Open Access journal advancing the boundaries of intelligent systems, neural networks, and responsible artificial intelligence research."
      heroIcon={<Brain className="h-8 w-8 text-primary" />}
      scopeAreas={scopeAreas}
      sectionTopics={[
        "Neural Networks",
        "Machine Learning",
        "Natural Language Processing",
        "Computer Vision",
        "AI Ethics & Governance",
        "Robotics & Control Systems",
      ]}
      mainHighlights={[
        { title: "Cutting-Edge Scope", description: "Bridges fundamental neural network theory with real-world machine learning systems." },
        { title: "Rigorous Standards", description: "Led by pioneers of deep learning to ensure the highest scientific quality." },
        { title: "Reproducible AI", description: "Encourages the sharing of code, datasets, and model weights." },
      ]}
      sampleArticles={sampleArticles}
      journalSlug="social-sciences-open"
      editorInChief={editorInChief}
      associateEditors={associateEditors}
      editorialBoard={editorialBoard}
    />
  )
}
