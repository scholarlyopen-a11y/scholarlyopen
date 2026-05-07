import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Privacy Policy | PeerRex",
  description: "Privacy policy and data protection information for PeerRex.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-muted/30 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
                Privacy Policy
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                This privacy policy explains how PeerRex collects, uses, and protects your personal data in accordance with the General Data Protection Regulation (GDPR) and German data protection laws.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Last updated: January 2024
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-3xl px-4 lg:px-8">
            <div className="prose prose-gray max-w-none">
              
              <h2 className="text-2xl font-bold mt-8 mb-4">1. Data Controller</h2>
              <p className="text-muted-foreground mb-4">
                The data controller responsible for processing your personal data is:
              </p>
              <address className="not-italic text-muted-foreground mb-6 p-4 bg-muted/50 rounded-lg">
                PeerRex<br />
                International Open Access Publisher<br />
                Email: abbas.qurasani+privacy-scholarisch@gmail.com
              </address>

              <h2 className="text-2xl font-bold mt-8 mb-4">2. Data We Collect</h2>
              <p className="text-muted-foreground mb-4">
                We collect and process the following categories of personal data:
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Information You Provide</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Name, email address, and institutional affiliation when creating an account</li>
                <li>Manuscript submissions and associated author information</li>
                <li>Correspondence with our editorial team</li>
                <li>Payment information for Article Processing Charges</li>
                <li>Reviewer reports and editorial communications</li>
              </ul>
              <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>IP address and browser information</li>
                <li>Pages visited and time spent on our website</li>
                <li>Referring website information</li>
                <li>Device type and operating system</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">3. Legal Basis for Processing</h2>
              <p className="text-muted-foreground mb-4">
                We process your personal data based on the following legal grounds under GDPR Article 6:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li><strong>Contract performance (Art. 6(1)(b)):</strong> Processing necessary to fulfill our publishing services</li>
                <li><strong>Legitimate interests (Art. 6(1)(f)):</strong> Improving our services and website functionality</li>
                <li><strong>Legal obligations (Art. 6(1)(c)):</strong> Compliance with tax and record-keeping requirements</li>
                <li><strong>Consent (Art. 6(1)(a)):</strong> Marketing communications and optional cookies</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">4. How We Use Your Data</h2>
              <p className="text-muted-foreground mb-4">
                Your personal data is used for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Processing and managing manuscript submissions</li>
                <li>Communicating about the peer review process</li>
                <li>Publishing articles and maintaining the scholarly record</li>
                <li>Processing payments and issuing invoices</li>
                <li>Sending service-related notifications</li>
                <li>Improving our website and services</li>
                <li>Complying with legal and regulatory requirements</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">5. Data Sharing</h2>
              <p className="text-muted-foreground mb-4">
                We may share your personal data with:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li><strong>Peer reviewers:</strong> Anonymized manuscript content for review</li>
                <li><strong>Indexing services:</strong> Published article metadata</li>
                <li><strong>Payment processors:</strong> For secure payment processing</li>
                <li><strong>Service providers:</strong> Hosting, email, and analytics services</li>
                <li><strong>Legal authorities:</strong> When required by law</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                We do not sell your personal data to third parties.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">6. International Data Transfers</h2>
              <p className="text-muted-foreground mb-4">
                Some of our service providers may be located outside the European Economic Area (EEA). When we transfer data outside the EEA, we ensure appropriate safeguards are in place, including:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>EU Standard Contractual Clauses</li>
                <li>Adequacy decisions by the European Commission</li>
                <li>Binding Corporate Rules where applicable</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">7. Data Retention</h2>
              <p className="text-muted-foreground mb-4">
                We retain your personal data for as long as necessary to fulfill the purposes for which it was collected:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li><strong>Published articles:</strong> Permanently (part of the scholarly record)</li>
                <li><strong>Account information:</strong> Duration of account plus 3 years</li>
                <li><strong>Rejected manuscripts:</strong> 2 years after rejection</li>
                <li><strong>Financial records:</strong> 10 years (German tax law requirement)</li>
                <li><strong>Website analytics:</strong> 26 months</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">8. Your Rights</h2>
              <p className="text-muted-foreground mb-4">
                Under GDPR, you have the following rights regarding your personal data:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Erasure:</strong> Request deletion of your data (with limitations)</li>
                <li><strong>Restriction:</strong> Limit processing of your data</li>
                <li><strong>Portability:</strong> Receive your data in a structured format</li>
                <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
                <li><strong>Withdraw consent:</strong> Where processing is based on consent</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                To exercise these rights, please contact us at abbas.qurasani+privacy-scholarisch@gmail.com.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">9. Cookies</h2>
              <p className="text-muted-foreground mb-4">
                We use cookies and similar technologies on our website. Essential cookies are necessary for the website to function. Analytics and preference cookies are only used with your consent.
              </p>
              <p className="text-muted-foreground mb-4">
                You can manage your cookie preferences through our cookie banner or your browser settings.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">10. Security</h2>
              <p className="text-muted-foreground mb-4">
                We implement appropriate technical and organizational measures to protect your personal data, including:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Access controls and authentication</li>
                <li>Regular security assessments</li>
                <li>Staff training on data protection</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">11. Complaints</h2>
              <p className="text-muted-foreground mb-4">
                If you believe we have not handled your personal data correctly, you have the right to lodge a complaint with a supervisory authority in your jurisdiction. Please contact us at abbas.qurasani+privacy-scholarisch@gmail.com and we will assist you in identifying the appropriate authority.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">12. Changes to This Policy</h2>
              <p className="text-muted-foreground mb-4">
                We may update this privacy policy from time to time. We will notify you of significant changes by posting a notice on our website or sending you an email.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">13. Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this privacy policy or our data practices, please contact:
              </p>
              <address className="not-italic text-muted-foreground p-4 bg-muted/50 rounded-lg">
                Data Protection Officer<br />
                PeerRex<br />
                Email: abbas.qurasani+privacy-scholarisch@gmail.com
              </address>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
