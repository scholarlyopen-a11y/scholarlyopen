import { Shield } from "lucide-react"
import { JournalPage } from "@/components/journal-page"
import { articles } from "@/lib/data/articles"

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
      sampleArticles={articles.filter(a => a.journalSlug === "ai-safety-governance")}
      journalSlug="ai-safety-governance"
    />
  )
}
