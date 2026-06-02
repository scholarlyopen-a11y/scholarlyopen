"use client"

import { useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AlertCircle } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export default function ImpressumPage() {
  const { t } = useLanguage()

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.title = `${t("footer.impressum")} | Scholarly Open`
    }
  }, [t])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-muted/30 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
                {t("footer.impressum")}
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                {t("impressum.heroSubtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-3xl px-4 lg:px-8">
            <div className="space-y-12">

              {/* Status Notice */}
              <div className="p-6 bg-secondary/30 rounded-lg border border-secondary">
                <div className="flex gap-4">
                  <AlertCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{t("impressum.warningTitle")}</h2>
                    <p className="mt-2 text-muted-foreground">
                      {t("impressum.warningDesc1")}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t("impressum.warningDesc2")}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Company Information */}
              <div>
                <h2 className="text-2xl font-bold mb-4">{t("impressum.tmgTitle")}</h2>
                <div className="p-6 bg-muted/50 rounded-lg border border-border">
                  <p className="font-semibold text-lg">{t("impressum.tmgCompany")}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t("impressum.tmgPhase")}</p>
                  <p className="mt-4 text-muted-foreground">
                    {t("impressum.tmgPub")}
                  </p>
                </div>
              </div>

              {/* Responsible Persons */}
              <div>
                <h2 className="text-2xl font-bold mb-4">{t("impressum.ownersTitle")}</h2>
                <div className="p-6 bg-muted/50 rounded-lg border border-border space-y-4">
                  <div>
                    <p className="font-semibold text-foreground">Herr Gregor Fefer</p>
                    <p className="text-muted-foreground mt-2">{t("impressum.ownerRole")}</p>
                    <p className="text-sm text-muted-foreground mt-1">{t("impressum.ownerRoleSub")}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Herr M. Abbas Qurasani</p>
                    <p className="text-muted-foreground mt-2">{t("impressum.ownerRole")}</p>
                    <p className="text-sm text-muted-foreground mt-1">{t("impressum.ownerRoleSub")}</p>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div>
                <h2 className="text-2xl font-bold mb-4">{t("impressum.contactTitle")}</h2>
                <div className="p-6 bg-muted/50 rounded-lg border border-border space-y-2 text-muted-foreground">
                  <p><strong className="text-foreground">{t("impressum.contactEmail")}</strong> info@scholarlyopen.org</p>
                  <p><strong className="text-foreground">{t("impressum.contactWebsite")}</strong> www.scholarlyopen.org</p>
                </div>
              </div>

              {/* Registration Status */}
              <div>
                <h2 className="text-2xl font-bold mb-4">{t("impressum.statusTitle")}</h2>
                <div className="p-6 bg-muted/50 rounded-lg border border-border space-y-4 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">{t("impressum.statusHR")}</strong><br />
                    {t("impressum.statusHRSub")}
                  </p>
                  <p>
                    <strong className="text-foreground">{t("impressum.statusVat")}</strong><br />
                    {t("impressum.statusVatSub")}
                  </p>
                </div>
              </div>

              {/* Editorial Responsibility */}
              <div>
                <h2 className="text-2xl font-bold mb-4">{t("impressum.rstvTitle")}</h2>
                <div className="p-6 bg-muted/50 rounded-lg border border-border">
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Herr Gregor Fefer</strong><br />
                    Scholarly Open i.G.
                  </p>
                  <p className="text-muted-foreground mt-4">
                    <strong className="text-foreground">Herr M. Abbas Qurasani</strong><br />
                    Scholarly Open i.G.
                  </p>
                </div>
              </div>

              {/* EU Dispute Resolution */}
              <div>
                <h2 className="text-2xl font-bold mb-4">{t("impressum.disputeTitle")}</h2>
                <div className="p-6 bg-muted/50 rounded-lg border border-border text-muted-foreground">
                  <p className="mb-4">
                    {t("impressum.disputeDesc1")}
                  </p>
                  <p className="mb-4">
                    <a 
                      href="https://ec.europa.eu/consumers/odr/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      https://ec.europa.eu/consumers/odr/
                    </a>
                  </p>
                  <p>
                    {t("impressum.disputeDesc2")}
                  </p>
                </div>
              </div>

              {/* Consumer Dispute Resolution */}
              <div>
                <h2 className="text-2xl font-bold mb-4">{t("impressum.consumerTitle")}</h2>
                <div className="p-6 bg-muted/50 rounded-lg border border-border text-muted-foreground">
                  <p>
                    {t("impressum.consumerDesc")}
                  </p>
                </div>
              </div>

              {/* Liability for Content */}
              <div>
                <h2 className="text-2xl font-bold mb-4">{t("impressum.liabContentTitle")}</h2>
                <div className="p-6 bg-muted/50 rounded-lg border border-border text-muted-foreground space-y-4">
                  <p>
                    {t("impressum.liabContentDesc1")}
                  </p>
                  <p>
                    {t("impressum.liabContentDesc2")}
                  </p>
                </div>
              </div>

              {/* Liability for Links */}
              <div>
                <h2 className="text-2xl font-bold mb-4">{t("impressum.liabLinksTitle")}</h2>
                <div className="p-6 bg-muted/50 rounded-lg border border-border text-muted-foreground space-y-4">
                  <p>
                    {t("impressum.liabLinksDesc1")}
                  </p>
                  <p>
                    {t("impressum.liabLinksDesc2")}
                  </p>
                </div>
              </div>

              {/* Copyright */}
              <div>
                <h2 className="text-2xl font-bold mb-4">{t("impressum.copyrightTitle")}</h2>
                <div className="p-6 bg-muted/50 rounded-lg border border-border text-muted-foreground space-y-4">
                  <p>
                    {t("impressum.copyrightDesc1")}
                  </p>
                  <p>
                    {t("impressum.copyrightDesc2")}
                  </p>
                  <p>
                    {t("impressum.copyrightDesc3")}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
