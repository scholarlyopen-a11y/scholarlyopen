import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Database, Search, Archive, CheckCircle, Globe, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Archiving & Indexing | Scholarly Open",
  description: "Learn about our archiving partners, indexing databases, and commitment to long-term preservation of scholarly content.",
}

const indexingServices = [
  {
    category: "Major Databases",
    services: [
      { name: "Crossref", status: "pending" },
      { name: "Google Scholar", status: "pending" },
      { name: "Microsoft Academic", status: "pending" },
      { name: "Semantic Scholar", status: "pending" },
    ],
  },
  {
    category: "Discovery Services",
    services: [
      { name: "DOAJ (Directory of Open Access Journals)", status: "pending" },
      { name: "Dimensions", status: "pending" },
      { name: "OpenAIRE", status: "pending" },
      { name: "BASE (Bielefeld Academic Search Engine)", status: "pending" },
    ],
  },
  {
    category: "Discipline-Specific",
    services: [
      { name: "PubMed / MEDLINE", status: "pending" },
      { name: "Scopus", status: "pending" },
      { name: "Web of Science", status: "pending" },
      { name: "JSTOR", status: "planned" },
    ],
  },
]

const archivingPartners = [
  {
    name: "CLOCKSS",
    description: "Community-governed archive providing long-term preservation through a global network of redundant nodes.",
    status: "In Progress",
  },
  {
    name: "LOCKSS",
    description: "Libraries preserve and provide access to material through distributed digital preservation.",
    status: "In Progress",
  },
  {
    name: "Portico",
    description: "Digital preservation service ensuring perpetual access to electronic scholarly content.",
    status: "In Progress",
  },
  {
    name: "Internet Archive",
    description: "Non-profit library providing free access to archived web content including scholarly articles.",
    status: "In Progress",
  },
]

const identifiers = [
  {
    icon: Database,
    title: "DOI",
    description: "Every article receives a unique Digital Object Identifier (DOI) through Crossref, ensuring permanent identification and linking.",
  },
  {
    icon: Search,
    title: "ORCID",
    description: "We encourage authors to link their ORCID iDs to properly attribute their work and connect to their research portfolio.",
  },
  {
    icon: Archive,
    title: "ISSN",
    description: "Each journal has a unique International Standard Serial Number for reliable identification in databases and catalogues.",
  },
]

export default function ArchivingIndexingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-muted/30 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
                Archiving & Indexing
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                We are committed to ensuring the long-term preservation and discoverability of all published content through partnerships with leading archiving services and indexing databases.
              </p>
            </div>
          </div>
        </section>

        {/* Commitment */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="text-sm font-medium text-primary uppercase tracking-wider">Our Commitment</span>
                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                  Preserving the Scholarly Record
                </h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  As a responsible publisher, we recognize our obligation to ensure that published research remains accessible for future generations. We work with multiple archiving partners to provide redundant, geographically distributed preservation.
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Our commitment to discoverability means working continuously to expand our indexing coverage, making it easier for researchers worldwide to find and cite our published content.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4 shrink-0">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Global Access</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Content indexed in major international databases for worldwide discovery
                  </p>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4 shrink-0">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Secure Preservation</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Multiple redundant archives ensure content survives any single point of failure
                  </p>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4 shrink-0">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Persistent IDs</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    DOIs and other identifiers ensure permanent, reliable citation links
                  </p>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4 shrink-0">
                    <Archive className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Format Preservation</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Articles archived in multiple formats including XML, PDF, and HTML
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Indexing */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Indexing & Abstracting</h2>
              <p className="mt-4 text-muted-foreground">
                Our journals are indexed in and abstracted by the following services to maximize discoverability.
              </p>
            </div>
            <div className="grid gap-8 lg:grid-cols-3">
              {indexingServices.map((category) => (
                <Card key={category.category}>
                  <CardHeader>
                    <CardTitle>{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.services.map((service) => (
                        <li key={service.name} className="flex items-center justify-between">
                          <span className="text-sm">{service.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            service.status === 'active' 
                              ? 'bg-primary/10 text-primary' 
                              : service.status === 'pending'
                              ? 'bg-accent/10 text-accent'
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {service.status === 'active' ? 'Active' : service.status === 'pending' ? 'Pending' : 'Planned'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="mt-8 text-sm text-muted-foreground text-center">
              We are actively working to expand our indexing coverage. Our current focus is on services that are pending or planned while we grow the journal portfolio.
            </p>
          </div>
        </section>

        {/* Archiving Partners */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Archiving Partners</h2>
              <p className="mt-4 text-muted-foreground">
                We work with leading digital preservation services to ensure long-term access to our published content.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {archivingPartners.map((partner) => (
                <div key={partner.name} className="p-6 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">{partner.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      partner.status === 'Active' 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-accent/10 text-accent'
                    }`}>
                      {partner.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{partner.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Identifiers */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Persistent Identifiers</h2>
              <p className="mt-4 text-muted-foreground">
                We use standardized identifiers to ensure reliable discovery and citation of content.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {identifiers.map((item) => (
                <div key={item.title} className="bg-background rounded-lg border border-border p-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Metadata */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight text-center">Metadata Standards</h2>
              <p className="mt-4 text-muted-foreground text-center">
                We follow industry-standard metadata practices to ensure interoperability and discoverability.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Crossref Metadata</h4>
                    <p className="text-sm text-muted-foreground">Full article metadata deposited with Crossref including references and funding information</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">JATS XML</h4>
                    <p className="text-sm text-muted-foreground">Articles available in Journal Article Tag Suite format for machine readability</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">OAI-PMH</h4>
                    <p className="text-sm text-muted-foreground">Metadata harvestable through the Open Archives Initiative Protocol</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Schema.org</h4>
                    <p className="text-sm text-muted-foreground">Structured data markup for enhanced search engine visibility</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-secondary text-secondary-foreground">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-20">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Publish With Confidence
              </h2>
              <p className="mt-4 text-lg text-secondary-foreground/80">
                Your research will be preserved and discoverable for generations to come.
              </p>
              <div className="mt-8">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/submit">
                    Submit Your Research
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
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
