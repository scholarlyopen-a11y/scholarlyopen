import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AlertCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Impressum | Scholarisch",
  description: "Legal notice and company information for Scholarisch as required by German law.",
}

export default function ImpressumPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-muted/30 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
                Impressum
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Legal notice in accordance with Section 5 TMG (German Telemedia Act) and Section 55 RStV (German Interstate Broadcasting Treaty).
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
                    <h2 className="text-lg font-semibold text-foreground">Gründungsphase (i.G.)</h2>
                    <p className="mt-2 text-muted-foreground">
                      Scholarisch befindet sich derzeit in der Gründungsphase (in Gründung / i.G.). Die formelle Eintragung ins Handelsregister sowie die Beantragung der Umsatzsteuer-Identifikationsnummer erfolgen nach Abschluss der organisatorischen Aufbauphase. Bis zur vollständigen Registrierung handelt es sich um ein Einzelunternehmen unter der Verantwortung der unten genannten Person.
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Scholarisch is currently in the founding phase (in Gründung / i.G.). Formal registration in the commercial register and application for the VAT identification number will take place after the organizational setup phase is completed. Until full registration, this is a sole proprietorship under the responsibility of the person named below.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Company Information */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Angaben gemäß § 5 TMG</h2>
                <div className="p-6 bg-muted/50 rounded-lg border border-border">
                  <p className="font-semibold text-lg">Scholarisch i.G.</p>
                  <p className="text-sm text-muted-foreground mt-1">(in Gründung / under formation)</p>
                  <p className="mt-4 text-muted-foreground">
                    International Open Access Publisher
                  </p>
                </div>
              </div>

              {/* Responsible Person */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Verantwortliche Person</h2>
                <div className="p-6 bg-muted/50 rounded-lg border border-border">
                  <p className="font-semibold text-foreground">Abbas Qurasani</p>
                  <p className="text-muted-foreground mt-2">
                    Inhaber und verantwortlich für den gesamten Inhalt
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    (Owner and responsible for all content)
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Kontakt</h2>
                <div className="p-6 bg-muted/50 rounded-lg border border-border space-y-2 text-muted-foreground">
                  <p><strong className="text-foreground">E-Mail:</strong> info@scholarisch.com</p>
                  <p><strong className="text-foreground">Website:</strong> www.scholarisch.com</p>
                </div>
              </div>

              {/* Registration Status */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Registrierungsstatus</h2>
                <div className="p-6 bg-muted/50 rounded-lg border border-border space-y-4 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Handelsregistereintragung:</strong><br />
                    In Vorbereitung. Die Eintragung erfolgt nach Abschluss der Gründungsphase.
                  </p>
                  <p className="text-sm">
                    (Commercial register entry: In preparation. Registration will be completed after the founding phase.)
                  </p>
                  <p>
                    <strong className="text-foreground">Umsatzsteuer-ID:</strong><br />
                    Wird nach der Gewerbeanmeldung beim zuständigen Finanzamt beantragt.
                  </p>
                  <p className="text-sm">
                    (VAT ID: Will be applied for at the responsible tax office after business registration.)
                  </p>
                </div>
              </div>

              {/* Editorial Responsibility */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
                <div className="p-6 bg-muted/50 rounded-lg border border-border">
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Abbas Qurasani</strong><br />
                    Scholarisch i.G.
                  </p>
                </div>
              </div>

              {/* EU Dispute Resolution */}
              <div>
                <h2 className="text-2xl font-bold mb-4">EU-Streitschlichtung</h2>
                <div className="p-6 bg-muted/50 rounded-lg border border-border text-muted-foreground">
                  <p className="mb-4">
                    Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
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
                    Unsere E-Mail-Adresse finden Sie oben im Impressum.
                  </p>
                </div>
              </div>

              {/* Consumer Dispute Resolution */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
                <div className="p-6 bg-muted/50 rounded-lg border border-border text-muted-foreground">
                  <p>
                    Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                  </p>
                </div>
              </div>

              {/* Liability for Content */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Haftung für Inhalte</h2>
                <div className="p-6 bg-muted/50 rounded-lg border border-border text-muted-foreground space-y-4">
                  <p>
                    Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                  </p>
                  <p>
                    Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                  </p>
                </div>
              </div>

              {/* Liability for Links */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Haftung für Links</h2>
                <div className="p-6 bg-muted/50 rounded-lg border border-border text-muted-foreground space-y-4">
                  <p>
                    Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
                  </p>
                  <p>
                    Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
                  </p>
                </div>
              </div>

              {/* Copyright */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Urheberrecht</h2>
                <div className="p-6 bg-muted/50 rounded-lg border border-border text-muted-foreground space-y-4">
                  <p>
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
                  </p>
                  <p>
                    Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
                  </p>
                  <p>
                    <strong className="text-foreground">Hinweis:</strong> Die in unseren Zeitschriften veröffentlichten Artikel unterliegen den jeweiligen Creative Commons Lizenzen und können entsprechend der Lizenzbedingungen weiterverwendet werden.
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
