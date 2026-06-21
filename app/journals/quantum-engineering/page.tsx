import { Atom } from "lucide-react"
import { JournalPage } from "@/components/journal-page"
import { articles } from "@/lib/data/articles"

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
      sampleArticles={articles.filter(a => a.journalSlug === "quantum-engineering")}
      journalSlug="quantum-engineering"
    />
  )
}
