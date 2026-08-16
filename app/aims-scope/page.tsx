import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Brain, Leaf, Beaker, Microscope, Settings, Globe, CheckCircle, Stethoscope, Cpu, Sprout, UsersRound, HeartPulse, Shield, Wind, Atom, Dna, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Aims & Scope | Scholarly Open",
  description: "Discover the aims, scope, and research areas covered by Scholarly Open journals.",
}

const disciplines = [
  {
    icon: UsersRound,
    title: "Social Sciences & Humanities",
    description: "Our social sciences and humanities journal publishes research that advances understanding of human society, history, culture, behavior, and institutions.",
    areas: [
      "Sociology and Social Policy",
      "History, Philosophy, and Ethics",
      "Literature and Cultural Studies",
      "Linguistics and Language Studies",
      "Political Science and International Relations",
      "Economics and Development Studies",
      "Psychology and Behavioral Sciences",
      "Communication and Media Studies",
    ],
    color: "primary",
  },
  {
    icon: Leaf,
    title: "Biology",
    description: "Our biology journal publishes research on living systems, ecology, and biological innovations.",
    areas: [
      "Molecular and Cellular Biology",
      "Ecology and Evolution",
      "Genetics and Genomics",
      "Conservation Biology",
      "Developmental Biology",
      "Systems Biology",
      "Biotechnology",
      "Environmental Biology",
    ],
    color: "green",
  },
  {
    icon: Beaker,
    title: "Chemistry",
    description: "Our chemistry journal publishes research on chemical science, materials, and sustainable technologies.",
    areas: [
      "Analytical Chemistry",
      "Organic and Inorganic Chemistry",
      "Materials Science",
      "Physical Chemistry",
      "Chemical Engineering",
      "Sustainable Chemistry",
      "Catalysis and Reaction Mechanisms",
      "Environmental Chemistry",
    ],
    color: "yellow",
  },
  {
    icon: Stethoscope,
    title: "Medicine",
    description: "Our medical journal publishes research that improves human health through clinical, translational, and public health studies.",
    areas: [
      "Clinical Medicine and Diagnostics",
      "Public Health and Epidemiology",
      "Biomedical Research",
      "Pharmaceutical Sciences",
      "Nursing and Allied Health",
      "Mental Health and Psychiatry",
      "Global Health and Health Policy",
      "Medical Education",
    ],
    color: "accent",
  },
  {
    icon: Cpu,
    title: "Data Science",
    description: "Our data science journal publishes research on AI, analytics, and FAIR data practices.",
    areas: [
      "Machine Learning and AI",
      "Data Mining and Visualization",
      "Statistical Modeling",
      "Reproducible Research",
      "Big Data Systems",
      "Ethics in Data Science",
      "Open Data, Metadata & Metrics",
      "Computational Methods",
    ],
    color: "primary",
  },
  {
    icon: Sprout,
    title: "Environmental Science",
    description: "Our environmental science journal publishes research on ecosystems, sustainability, and climate resilience.",
    areas: [
      "Climate Change and Adaptation",
      "Sustainability Science",
      "Ecosystem Services",
      "Environmental Monitoring",
      "Conservation Science",
      "Water and Air Quality",
      "Renewable Energy",
      "Environmental Policy",
    ],
    color: "accent",
  },
  {
    icon: Settings,
    title: "Engineering & Applied Sciences",
    description: "Our engineering and applied sciences journal publishes research on sustainable systems, infrastructure, applied physics, materials, and technology innovation.",
    areas: [
      "Civil and Structural Engineering",
      "Electrical and Mechanical Systems",
      "Sustainable Infrastructure",
      "Biomedical Engineering",
      "Materials and Manufacturing",
      "Robotics and Automation",
      "Energy Systems",
      "Systems Design",
    ],
    color: "chart-3",
  },
  {
    icon: HeartPulse,
    title: "Clinical AI & Digital Health",
    description: "Our Clinical AI and Digital Health journal publishes research on clinical machine learning, digital therapeutics, and medical diagnostic integrations.",
    areas: [
      "Machine learning in medical imaging and diagnostics",
      "Clinical decision support systems (CDSS)",
      "Large language models (LLMs) in clinical workflows",
      "Wearable devices and remote patient monitoring",
      "Digital therapeutics and mobile health (mHealth)",
      "Biomedical signal processing and telemetry",
      "AI ethics, bias, and regulatory compliance in healthcare",
      "Epidemiological modeling and public health informatics",
    ],
    color: "green",
  },
  {
    icon: Shield,
    title: "AI Safety & Governance",
    description: "Our AI Safety and Governance journal publishes research on AI alignment, mechanistic interpretability, safety evaluations, and international policy.",
    areas: [
      "AI alignment methodology and reinforcement learning from human feedback (RLHF)",
      "Scalable oversight, reward hacking, and specification gaming",
      "Mechanistic interpretability and model probing",
      "Evals and safety benchmarking for frontier models",
      "Cybersecurity, jailbreaking, and model robustness",
      "Global AI policy, treaties, and governance frameworks",
      "Societal impacts, misuse prevention, and structural AI risks",
    ],
    color: "primary",
  },
  {
    icon: Wind,
    title: "Decarbonization & Carbon Tech",
    description: "Our Decarbonization and Carbon Tech journal publishes research on engineered climate solutions, carbon capture, hydrogen economy, and net-zero industrial systems.",
    areas: [
      "Carbon capture technologies (flue gas and direct air capture)",
      "Carbon utilization and conversion (fuels, chemicals, materials)",
      "Carbon storage and mineralization (geological, ocean, soils)",
      "Hydrogen production (green, blue), storage, and transport",
      "Industrial electrification and high-temperature heat decarbonization",
      "Lifecycle carbon accounting, greenhouse gas auditing, and LCA protocols",
      "Climate engineering policy, carbon markets, and regulatory compliance",
    ],
    color: "accent",
  },
  {
    icon: Atom,
    title: "Quantum Engineering",
    description: "Our Quantum Engineering journal publishes research on solid-state qubits, cryogenic control systems, error correction, and quantum compiler architectures.",
    areas: [
      "Design and fabrication of solid-state, trapped-ion, and photonic qubits",
      "Cryogenic and control electronics for quantum processors",
      "Quantum error correction (QEC) protocols and physical integration",
      "Quantum compilers, classical-quantum hybrid software stacks",
      "Quantum key distribution (QKD) and post-quantum network hardware",
      "High-sensitivity quantum sensors and metrology instruments",
      "Application-layer algorithms and NISQ-era hardware co-design",
    ],
    color: "chart-3",
  },
  {
    icon: Dna,
    title: "Synthetic Biology & Bio-Design",
    description: "Our Synthetic Biology and Bio-Design journal publishes research on de novo genome design, CRISPR diagnostics, cell-free biomanufacturing, and bio-computing.",
    areas: [
      "De novo design of synthetic genomes, circuits, and metabolic networks",
      "CRISPR-Cas systems and precision genome editing innovations",
      "Cell-free transcription-translation (TX-TL) and biomanufacturing platforms",
      "Directed evolution and automated high-throughput strain selection",
      "DNA-based data storage and bio-computational logic gates",
      "Biosensors and diagnostics using engineered cells or enzymes",
      "Bioethics, biosecurity, and safety guidelines for synthetic organisms",
    ],
    color: "green",
  },
  {
    icon: Rocket,
    title: "Space Resources & Orbital Economy",
    description: "Our Space Resources and Orbital Economy journal publishes research on off-world resource extraction (ISRU), regolith construction, space logistics, and space law.",
    areas: [
      "In-situ resource utilization (ISRU) on the Moon, Mars, and asteroids",
      "Regolith processing, excavation, and sintering for space construction",
      "Extraction of lunar water ice and propellant manufacturing",
      "Space logistics, orbital refueling, and transportation architectures",
      "Orbital debris tracking, remediation, and recycling systems",
      "Space economics, commercialization models, and risk management",
      "International space law, policy frameworks, and planetary protection",
    ],
    color: "yellow",
  },
]

const aims = [
  {
    title: "Advance Knowledge",
    description: "Publish high-quality, peer-reviewed research that contributes significantly to scholarly understanding in our focus disciplines.",
  },
  {
    title: "Promote Open Access",
    description: "Ensure research is freely available to readers worldwide, breaking down barriers to scientific and scholarly information.",
  },
  {
    title: "Foster Collaboration",
    description: "Create platforms that connect researchers across disciplines and borders, encouraging interdisciplinary dialogue.",
  },
  {
    title: "Uphold Ethics",
    description: "Maintain the highest standards of publication ethics and research integrity in all our editorial processes.",
  },
  {
    title: "Support Authors",
    description: "Provide excellent author services, including efficient peer review, professional editing, and wide dissemination.",
  },
  {
    title: "Serve Society",
    description: "Publish research that addresses real-world challenges and contributes to the betterment of human society.",
  },
]

export default function AimsScopePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-muted/30 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
                Aims & Scope
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Scholarly Open is dedicated to publishing impactful research across our 13 journals (comprising our 7 Core Series and 6 Emerging Frontiers Series), serving the global scholarly community through open access.
              </p>
            </div>
          </div>
        </section>

        {/* Our Aims */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Our Aims</h2>
              <p className="mt-4 text-muted-foreground">
                Our publishing activities are guided by these core objectives.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {aims.map((aim) => (
                <div key={aim.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{aim.title}</h3>
                    <p className="mt-1.5 text-base text-muted-foreground leading-relaxed">{aim.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Disciplines */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Research Areas</h2>
              <p className="mt-4 text-muted-foreground">
                We publish peer-reviewed research across thirteen scholarly disciplines spanning our Core and Emerging Frontiers portfolios, covering a wide range of specialized areas and interdisciplinary topics.
              </p>
            </div>
            <div className="space-y-12">
              {disciplines.map((discipline) => (
                <Card key={discipline.title} className="overflow-hidden">
                  <CardHeader className="bg-background">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full flex items-center justify-center bg-primary/10 text-primary shrink-0">
                        <discipline.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{discipline.title}</CardTitle>
                        <CardDescription className="mt-2 text-base">{discipline.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                      Areas of Focus
                    </h4>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {discipline.areas.map((area) => (
                        <div key={area} className="flex items-center gap-2 text-sm">
                          <div className={`h-1.5 w-1.5 rounded-full ${
                            discipline.color === 'primary' ? 'bg-primary' :
                            discipline.color === 'accent' ? 'bg-accent' :
                            discipline.color === 'secondary' ? 'bg-secondary' :
                            discipline.color === 'yellow' ? 'bg-yellow-500' :
                            discipline.color === 'green' ? 'bg-green-500' :
                            'bg-chart-3'
                          }`} />
                          {area}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Submission Types */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Article Types</h2>
              <p className="mt-4 text-muted-foreground">
                We welcome various types of scholarly contributions.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="p-6 rounded-lg border border-border">
                <h3 className="font-semibold text-lg">Original Research</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Full-length articles reporting new findings from original empirical or theoretical research.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border">
                <h3 className="font-semibold text-lg">Review Articles</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Comprehensive reviews synthesizing current knowledge on specific topics within our scope.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border">
                <h3 className="font-semibold text-lg">Short Communications</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Brief reports of significant preliminary findings or novel methodological approaches.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border">
                <h3 className="font-semibold text-lg">Case Studies</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Detailed examinations of specific cases that provide broader insights for the field.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border">
                <h3 className="font-semibold text-lg">Perspectives</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Opinion pieces and commentaries on important developments in the field.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border">
                <h3 className="font-semibold text-lg">Data Papers</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Papers describing datasets made publicly available for reuse by the research community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-secondary text-secondary-foreground">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-20">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to Submit Your Research?
              </h2>
              <p className="mt-4 text-lg text-secondary-foreground/80">
                If your research falls within our scope, we invite you to submit your manuscript for consideration.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/submit">
                    Submit Manuscript
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/author-guidelines">Author Guidelines</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
