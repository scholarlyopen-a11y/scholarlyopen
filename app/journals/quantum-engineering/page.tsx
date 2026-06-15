import { Atom } from "lucide-react"
import { JournalPage } from "@/components/journal-page"
import type { Article } from "@/components/article-card"

const sampleArticles: Article[] = [
  {
    id: "qe-2026-001",
    title: "Reducing Decoherence in Silicon-Based Spin Qubits via Isotopic Purification",
    authors: ["Dr. Thomas Sterling", "Prof. Mei-Ling Zhou"],
    abstract: "This paper demonstrates a fabrication method for silicon-28 spin qubits that reduces environmental spin noise and yields a twofold increase in coherence time.",
    keywords: ["Spin Qubits", "Decoherence", "Silicon Nanotechnology", "Quantum Hardware"],
    doi: "10.12345/qe.2026.001",
    publishedDate: "2026-03-22",
    articleType: "research",
  },
  {
    id: "qe-2026-002",
    title: "A Scalable Compiler Architecture for Topological Quantum Computers",
    authors: ["Dr. Fiona MacLeod", "Dr. Alan Turing Jr."],
    abstract: "We present a software-level compilation stack that translates logical quantum gates into braiding trajectories, optimizing topological error-correcting codes.",
    keywords: ["Quantum Compiler", "Topological Quantum Computing", "Error Correction", "Software Stack"],
    doi: "10.12345/qe.2026.002",
    publishedDate: "2026-04-30",
    articleType: "research",
  },
]

export default function QuantumEngineeringPage() {
  return (
    <JournalPage
      title="Scholarly Open: Quantum Engineering"
      description="Translation of quantum science into practical hardware, cryptography, and application architectures."
      heroDescription="A Gold Open Access journal highlighting peer-reviewed progress in superconducting qubits, quantum sensors, quantum networks, and compiler design."
      heroIcon={<Atom className="h-8 w-8 text-primary" />}
      scopeAreas={[
        "Design and fabrication of solid-state, trapped-ion, and photonic qubits",
        "Cryogenic and control electronics for quantum processors",
        "Quantum error correction (QEC) protocols and physical integration",
        "Quantum compilers, classical-quantum hybrid software stacks",
        "Quantum key distribution (QKD) and post-quantum network hardware",
        "High-sensitivity quantum sensors and metrology instruments",
        "Application-layer algorithms and NISQ-era hardware co-design",
      ]}
      sectionTopics={[
        "Processor Fabrication & Materials",
        "Cryogenic & Control Infrastructure",
        "Error Correction & Decoupling",
        "Software, Compilation & Algorithms",
        "Networking & Cryptography",
        "Sensors & Quantum Metrology",
      ]}
      mainHighlights={[
        { title: "Hardware Focus", description: "Prioritizes practical hardware developments, manufacturing scalability, and engineering integration." },
        { title: "Co-Design Paradigm", description: "Bridges hardware, control theory, and compiler layers for full-stack optimization." },
        { title: "FAIR Quantum Data", description: "Supports deposition of raw calibration data, pulse sequences, and hardware schematics." },
      ]}
      sampleArticles={sampleArticles}
      journalSlug="quantum-engineering"
    />
  )
}
