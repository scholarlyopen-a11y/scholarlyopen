"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"

export default function PrivacyPolicyPage() {
  const { t } = useLanguage()

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.title = `${t("footer.privacy")} | Scholarly Open`
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
                {t("footer.privacy")}
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                {t("privacy.heroSubtitle")}
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                {t("privacy.lastUpdated")}
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-3xl px-4 lg:px-8">
            <div className="prose prose-gray max-w-none">
              
              <h2 className="text-2xl font-bold mt-8 mb-4">{t("privacy.controller.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("privacy.controller.desc")}
              </p>
              <address className="not-italic text-muted-foreground mb-6 p-4 bg-muted/50 rounded-lg whitespace-pre-line">
                {t("privacy.controller.addr")}
              </address>

              <h2 className="text-2xl font-bold mt-8 mb-4">{t("privacy.data.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("privacy.data.desc")}
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3">{t("privacy.data.provide.title")}</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>{t("privacy.data.provide.li1")}</li>
                <li>{t("privacy.data.provide.li2")}</li>
                <li>{t("privacy.data.provide.li3")}</li>
                <li>{t("privacy.data.provide.li4")}</li>
                <li>{t("privacy.data.provide.li5")}</li>
              </ul>
              <h3 className="text-xl font-semibold mt-6 mb-3">{t("privacy.data.auto.title")}</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>{t("privacy.data.auto.li1")}</li>
                <li>{t("privacy.data.auto.li2")}</li>
                <li>{t("privacy.data.auto.li3")}</li>
                <li>{t("privacy.data.auto.li4")}</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">{t("privacy.data.basis.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("privacy.data.basis.desc")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>{t("privacy.data.basis.li1")}</li>
                <li>{t("privacy.data.basis.li2")}</li>
                <li>{t("privacy.data.basis.li3")}</li>
                <li>{t("privacy.data.basis.li4")}</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">{t("privacy.use.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("privacy.use.desc")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>{t("privacy.use.li1")}</li>
                <li>{t("privacy.use.li2")}</li>
                <li>{t("privacy.use.li3")}</li>
                <li>{t("privacy.use.li4")}</li>
                <li>{t("privacy.use.li5")}</li>
                <li>{t("privacy.use.li6")}</li>
                <li>{t("privacy.use.li7")}</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">{t("privacy.sharing.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("privacy.sharing.desc")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>{t("privacy.sharing.li1")}</li>
                <li>{t("privacy.sharing.li2")}</li>
                <li>{t("privacy.sharing.li3")}</li>
                <li>{t("privacy.sharing.li4")}</li>
                <li>{t("privacy.sharing.li5")}</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                {t("privacy.sharing.noSell")}
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">{t("privacy.transfers.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("privacy.transfers.desc")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>{t("privacy.transfers.li1")}</li>
                <li>{t("privacy.transfers.li2")}</li>
                <li>{t("privacy.transfers.li3")}</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">{t("privacy.retention.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("privacy.retention.desc")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>{t("privacy.retention.li1")}</li>
                <li>{t("privacy.retention.li2")}</li>
                <li>{t("privacy.retention.li3")}</li>
                <li>{t("privacy.retention.li4")}</li>
                <li>{t("privacy.retention.li5")}</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">{t("privacy.rights.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("privacy.rights.desc")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>{t("privacy.rights.li1")}</li>
                <li>{t("privacy.rights.li2")}</li>
                <li>{t("privacy.rights.li3")}</li>
                <li>{t("privacy.rights.li4")}</li>
                <li>{t("privacy.rights.li5")}</li>
                <li>{t("privacy.rights.li6")}</li>
                <li>{t("privacy.rights.li7")}</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                {t("privacy.rights.contact")}
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">{t("privacy.cookies.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("privacy.cookies.desc1")}
              </p>
              <p className="text-muted-foreground mb-4">
                {t("privacy.cookies.desc2")}
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">{t("privacy.security.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("privacy.security.desc")}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>{t("privacy.security.li1")}</li>
                <li>{t("privacy.security.li2")}</li>
                <li>{t("privacy.security.li3")}</li>
                <li>{t("privacy.security.li4")}</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">{t("privacy.complaints.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("privacy.complaints.desc")}
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">{t("privacy.changes.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("privacy.changes.desc")}
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">{t("privacy.contact.title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("privacy.contact.desc")}
              </p>
              <address className="not-italic text-muted-foreground p-4 bg-muted/50 rounded-lg whitespace-pre-line">
                {t("privacy.contact.addr")}
              </address>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
