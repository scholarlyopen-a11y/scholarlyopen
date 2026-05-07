import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Unlock, Globe, RefreshCw, FileText, Scale, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Open Access Policy | PeerRex",
  description: "Learn about our commitment to open access publishing, licensing options, and how we make research freely available worldwide.",
}

const benefits = [
  {
    icon: Globe,
    title: "Global Reach",
    description: "Open access articles reach a wider audience, including researchers, practitioners, policymakers, and the general public worldwide.",
  },
  {
    icon: RefreshCw,
    title: "Increased Citations",
    description: "Studies show that open access articles receive more citations and have greater research impact than subscription-only content.",
  },
  {
    icon: FileText,
    title: "Immediate Access",
    description: "Research is available immediately upon publication with no embargo period, accelerating the pace of scientific discovery.",
  },
  {
    icon: Users,
    title: "Public Benefit",
    description: "Publicly funded research becomes publicly available, maximizing the societal return on investment in science.",
  },
]

const models = [
  {
    title: "Gold Open Access",
    badge: "Primary Model",
    description: "Articles are published immediately open access under a Creative Commons license. The author or their institution pays an Article Processing Charge (APC) to cover publication costs.",
    features: [
      "Immediate open access upon publication",
      "CC BY 4.0 license by default",
      "Full copyright retained by authors",
      "Indexed in major databases",
      "Permanent free access",
    ],
  },
  {
    title: "Hybrid Open Access",
    badge: "Alternative",
    description: "Authors can choose to make individual articles open access in otherwise subscription-based journals by paying an APC.",
    features: [
      "Open access option in subscription journals",
      "Same CC BY licensing options",
      "Author choice at acceptance",
      "Meets funder OA requirements",
      "Wider journal selection",
    ],
  },
]

export default function OpenAccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-muted/30 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
                Open Access Policy
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                PeerRex is committed to open access publishing. We believe that scientific knowledge should be freely available to everyone, everywhere, to accelerate research and benefit society.
              </p>
            </div>
          </div>
        </section>

        {/* What is Open Access */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="text-sm font-medium text-primary uppercase tracking-wider">About Open Access</span>
                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                  Knowledge Without Barriers
                </h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Open access (OA) means that research outputs are distributed online, free of cost and free of most copyright and licensing restrictions. Anyone can read, download, copy, distribute, print, search, or link to the full text of these articles.
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  We support the principles of the Budapest Open Access Initiative (2002) and believe that removing access barriers to scholarly literature accelerates research, enriches education, and enables new forms of collaboration.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="h-48 w-48 rounded-full bg-primary/10 flex items-center justify-center">
                    <Unlock className="h-24 w-24 text-primary" />
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-background border border-border rounded-lg p-4 shadow-lg">
                    <p className="text-sm font-medium">Free to Read</p>
                    <p className="text-sm font-medium">Free to Reuse</p>
                    <p className="text-sm font-medium">Free to Share</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Benefits of Open Access</h2>
              <p className="mt-4 text-muted-foreground">
                Open access publishing offers significant advantages for authors, readers, and society.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="bg-background rounded-lg border border-border p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">{benefit.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OA Models */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Our Open Access Models</h2>
              <p className="mt-4 text-muted-foreground">
                We offer both Gold and Hybrid open access options to accommodate different author and funder requirements.
              </p>
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              {models.map((model) => (
                <Card key={model.title} className="relative overflow-hidden">
                  <div className="absolute top-4 right-4">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {model.badge}
                    </span>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-2xl">{model.title}</CardTitle>
                    <CardDescription className="text-base mt-2">{model.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {model.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Licensing */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Licensing</h2>
                <p className="mt-4 text-muted-foreground mb-8">
                  We use Creative Commons licenses to define how published content can be reused, ensuring clarity for both authors and readers.
                </p>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-background border-2 border-primary">
                    <div className="flex items-center gap-2 mb-2">
                      <Scale className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold">CC BY 4.0 (Default)</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This license allows others to distribute, remix, adapt, and build upon your work, even commercially, as long as they credit you for the original creation. This is the most accommodating license offered and is recommended for maximum dissemination.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-background border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Scale className="h-5 w-5 text-muted-foreground" />
                      <h4 className="font-semibold">CC BY-NC 4.0</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Similar to CC BY, but limits reuse to non-commercial purposes. Available upon request in specific circumstances.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-background border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Scale className="h-5 w-5 text-muted-foreground" />
                      <h4 className="font-semibold">CC BY-NC-ND 4.0</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      The most restrictive license, allowing only non-commercial redistribution with no derivatives. Available in exceptional cases.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Author Rights</h2>
                <p className="mt-4 text-muted-foreground mb-8">
                  At PeerRex, authors retain copyright of their work. Here&apos;s what this means for you:
                </p>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-background border border-border">
                    <h4 className="font-semibold">Copyright Retention</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Authors retain full copyright ownership of their work. We only request a license to publish.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-background border border-border">
                    <h4 className="font-semibold">Self-Archiving</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Authors may deposit the published version in institutional repositories and other platforms immediately upon publication.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-background border border-border">
                    <h4 className="font-semibold">Reuse</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Authors may reuse their work in future publications, presentations, and teaching materials without seeking permission.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-background border border-border">
                    <h4 className="font-semibold">Third-Party Permissions</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      For figures or text from third-party sources, authors are responsible for obtaining appropriate permissions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Funder Compliance */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight">Funder Compliance</h2>
              <p className="mt-4 text-muted-foreground">
                Our open access policies are designed to comply with the requirements of major research funders.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="font-medium">Plan S</p>
                  <p className="text-sm text-muted-foreground">cOAlition S</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="font-medium">Horizon Europe</p>
                  <p className="text-sm text-muted-foreground">European Commission</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="font-medium">DFG</p>
                  <p className="text-sm text-muted-foreground">German Research Foundation</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="font-medium">Wellcome Trust</p>
                  <p className="text-sm text-muted-foreground">UK Funder</p>
                </div>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                If your funder has specific requirements not listed here, please contact us to discuss compliance options.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-20">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Publish Open Access With Us
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Join the open access movement and make your research freely available to the world.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/submit">
                    Submit Your Research
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  <Link href="/apc-fees">View APC Information</Link>
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
