import { Shield } from "lucide-react"
import { JournalPage } from "@/components/journal-page"
import type { Article } from "@/components/article-card"

const sampleArticles: Article[] = [
  {
    id: "ais-2026-001",
    title: "Eliciting Latent Knowledge: Probing Internal Representations of Large Language Models",
    authors: ["Dr. Evelyn Vance", "Dr. Charles Zhang"],
    abstract: "This paper introduces a probing framework to extract factual beliefs and latent reasoning paths from LLMs, addressing hallucination and alignment.",
    keywords: ["AI Alignment", "Latent Knowledge", "Probing", "Transparency"],
    doi: "10.12345/ais.2026.001",
    publishedDate: "2026-03-10",
    articleType: "research",
  },
  {
    id: "ais-2026-002",
    title: "Evaluating Multi-Agent Coordination under Conflict: A Safety Benchmarking Sandbox",
    authors: ["Prof. Julian Alistair", "Dr. Hana Tanaka"],
    abstract: "We present a sandbox environment to evaluate coordination and negotiation safety in multi-agent networks, outlining systemic risks.",
    keywords: ["Multi-Agent Systems", "Safety Benchmark", "Coordination", "Governance"],
    doi: "10.12345/ais.2026.002",
    publishedDate: "2026-05-02",
    articleType: "research",
  },
]

export default function AISafetyPage() {
  return (
    <JournalPage
      title="Scholarly Open: AI Safety & Governance"
      description="Research on AI alignment, safety evaluations, policy frameworks, and algorithmic governance."
      heroDescription="A Gold Open Access journal providing a peer-reviewed forum for scientific advances in alignment, monitoring, security, and global policy for frontier models."
      heroIcon={<Shield className="h-8 w-8 text-primary" />}
      scopeAreas={[
        "AI alignment methodology and reinforcement learning from human feedback (RLHF)",
        "Scalable oversight, reward hacking, and specification gaming",
        "Mechanistic interpretability and model probing",
        "Evals and safety benchmarking for frontier models",
        "Cybersecurity, jailbreaking, and model robustness",
        "Global AI policy, treaties, and governance frameworks",
        "Societal impacts, misuse prevention, and structural AI risks",
      ]}
      sectionTopics={[
        "Alignment Theory",
        "Interpretability & Probing",
        "Safety Benchmarking",
        "Robustness & Adversarial ML",
        "AI Policy & Regulation",
        "Societal & Systemic Risks",
      ]}
      mainHighlights={[
        { title: "Rigor & Peer Review", description: "Brings formal peer review to a field dominated by quick-publish preprint servers." },
        { title: "Policy & Technical Synergy", description: "Publishes both technical safety research and policy/governance frameworks." },
        { title: "Fast-Track Review", description: "Ensures rapid publication cycles to keep pace with state-of-the-art AI advancements." },
      ]}
      sampleArticles={sampleArticles}
      journalSlug="ai-safety"
    />
  )
}
