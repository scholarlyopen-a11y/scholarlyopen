"use client"

import Link from "next/link"
import { ArrowRight, Check, HelpCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"

const apcDetails = [
  {
    journal: "Social Sciences & Humanities Journal",
    regularAPC: "1,200",
    currency: "EUR",
    includes: [
      "Full Gold open access publication",
      "Peer review coordination",
      "Professional copyediting",
      "XML and PDF production",
      "DOI assignment",
      "Indexing and archiving",
      "Unlimited article length",
    ],
  },
  {
    journal: "Biology Journal",
    regularAPC: "1,450",
    currency: "EUR",
    includes: [
      "Full Gold open access publication",
      "Peer review coordination",
      "Professional copyediting",
      "XML and PDF production",
      "DOI assignment",
      "Indexing and archiving",
      "Figures and data presentation support",
    ],
  },
  {
    journal: "Chemistry Journal",
    regularAPC: "1,450",
    currency: "EUR",
    includes: [
      "Full Gold open access publication",
      "Peer review coordination",
      "Professional copyediting",
      "XML and PDF production",
      "DOI assignment",
      "Indexing and archiving",
      "Chemical structure and equation support",
    ],
  },
  {
    journal: "Medicine Journal",
    regularAPC: "2,200",
    currency: "EUR",
    includes: [
      "Full Gold open access publication",
      "Peer review coordination",
      "Professional copyediting",
      "XML and PDF production",
      "DOI assignment",
      "Indexing and archiving",
      "MEDLINE formatting",
    ],
  },
  {
    journal: "Data Science Journal",
    regularAPC: "1,350",
    currency: "EUR",
    includes: [
      "Full Gold open access publication",
      "Peer review coordination",
      "Professional copyediting",
      "XML and PDF production",
      "DOI assignment",
      "Indexing and archiving",
      "Code and dataset availability support",
    ],
  },
  {
    journal: "Engineering Journal",
    regularAPC: "1,350",
    currency: "EUR",
    includes: [
      "Full Gold open access publication",
      "Peer review coordination",
      "Professional copyediting",
      "XML and PDF production",
      "DOI assignment",
      "Indexing and archiving",
      "Technical figure and schematic support",
    ],
  },
  {
    journal: "Environmental Science Journal",
    regularAPC: "1,300",
    currency: "EUR",
    includes: [
      "Full Gold open access publication",
      "Peer review coordination",
      "Professional copyediting",
      "XML and PDF production",
      "DOI assignment",
      "Indexing and archiving",
      "Data visualization and sustainability support",
    ],
  },
]

const waiverEligibility = [
  {
    category: "Low-Income Countries",
    discount: "100% waiver",
    description: "Authors from World Bank-classified low-income countries are eligible for full APC waivers.",
  },
  {
    category: "Lower-Middle Income Countries",
    discount: "50% discount",
    description: "Authors from lower-middle income countries receive a 50% reduction in APCs.",
  },
  {
    category: "Financial Hardship",
    discount: "Case-by-case",
    description: "Authors without institutional or grant funding may apply for discretionary waivers.",
  },
  {
    category: "Editorial Board Members",
    discount: "25% discount",
    description: "Active editorial board members receive a discount on APCs for their own submissions.",
  },
]

export default function APCFeesPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-muted/30 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
                {t("nav.apcFees")}
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Transparent pricing for open access publication. We offer competitive APCs with waiver programs to ensure research from all backgrounds can be published.
              </p>
            </div>
          </div>
        </section>

        {/* How APCs Work */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-3xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Understanding APCs</h2>
              <p className="mt-4 text-muted-foreground">
                Article Processing Charges (APCs) are fees charged to authors or their institutions to cover the costs of open access publication. APCs allow us to make articles freely available to readers worldwide while maintaining high editorial and production standards.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                    <Info className="h-4 w-4 text-primary" />
                  </div>
                  When is the APC charged?
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  APCs are only charged after your manuscript has been accepted for publication following peer review. There are no submission or review fees.
                </p>
              </div>
              <div className="p-6 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center gap-2 font-semibold">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                    <Info className="h-4 w-4 text-primary" />
                  </div>
                  What does the APC cover?
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  The APC covers peer review management, copyediting, typesetting, DOI registration, hosting, archiving, and ongoing accessibility.
                </p>
              </div>
              <div className="p-6 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center gap-2 font-semibold">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                    <Info className="h-4 w-4 text-primary" />
                  </div>
                  Who pays the APC?
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  APCs can be paid by authors, their institutions, research funders, or through institutional agreements. Many funders allow APCs as legitimate research costs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* APC Rates */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Current APC Rates</h2>
              <p className="mt-4 text-muted-foreground">
                Our APCs vary by discipline to reflect the different costs and services involved. These rates apply across our portfolio of seven Scholarly Open journals.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {apcDetails.map((item) => (
                <Card key={item.journal} className="relative overflow-hidden">
                  <CardHeader>
                    <CardTitle>{item.journal}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{item.currency} {item.regularAPC}</span>
                      <span className="text-muted-foreground ml-2">per article</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Includes:</p>
                    <ul className="space-y-2">
                      {item.includes.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="mt-8 text-sm text-muted-foreground text-center">
              All prices exclude VAT where applicable. Institutional agreements may provide different rates.
            </p>
          </div>
        </section>

        {/* Waivers & Discounts */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Fee Waivers & Discounts</h2>
              <p className="mt-4 text-muted-foreground">
                We are committed to making open access publishing accessible to researchers worldwide, regardless of their financial situation.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {waiverEligibility.map((waiver) => (
                <div key={waiver.category} className="p-6 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{waiver.category}</h3>
                    <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {waiver.discount}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{waiver.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 p-6 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">How to Apply for a Waiver</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Waiver requests should be made at the time of submission through our online submission system. 
                    Please provide details about your funding situation and eligibility category. 
                    Waiver decisions are made independently of editorial decisions and will not affect the peer review process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Information */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Payment Methods</h2>
                <p className="mt-4 text-muted-foreground mb-8">
                  We offer flexible payment options to accommodate different institutional requirements.
                </p>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-background border border-border">
                    <h4 className="font-medium">Credit Card</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Visa, Mastercard, and American Express accepted through our secure payment portal.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-background border border-border">
                    <h4 className="font-medium">Bank Transfer</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Invoice payment via SEPA or international wire transfer. Bank details provided upon acceptance.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-background border border-border">
                    <h4 className="font-medium">Institutional Agreements</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Check if your institution has an agreement with us for centralized billing.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Funder Compliance</h2>
                <p className="mt-4 text-muted-foreground mb-8">
                  Our open access policies comply with major research funder mandates.
                </p>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-background border border-border">
                    <h4 className="font-medium">Plan S / cOAlition S</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Our Gold OA journals are fully compliant with Plan S requirements.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-background border border-border">
                    <h4 className="font-medium">EU Horizon Europe</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      APCs are eligible costs under Horizon Europe grants.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-background border border-border">
                    <h4 className="font-medium">DFG (German Research Foundation)</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Eligible for DFG open access publication funding.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-background border border-border">
                    <h4 className="font-medium">Wellcome Trust & Other Funders</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      CC BY licensing meets requirements of most major research funders.
                    </p>
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
                {t("apc.questionsTitle")}
              </h2>
              <p className="mt-4 text-lg text-secondary-foreground/80">
                {t("apc.questionsDesc")}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/submit">
                    {t("nav.submitManuscript")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">
                    {t("nav.contact")}
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
