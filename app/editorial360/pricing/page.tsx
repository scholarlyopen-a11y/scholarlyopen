"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Building2, 
  Users, 
  ArrowRight, 
  Calculator, 
  Calendar, 
  Globe, 
  Cpu, 
  Award, 
  FileCheck2, 
  Lock, 
  BarChart3, 
  Layers, 
  HelpCircle, 
  X, 
  CheckCircle2, 
  Sliders, 
  TrendingUp, 
  Scale, 
  Briefcase,
  ChevronRight,
  ArrowUpRight,
  Sun,
  Moon
} from "lucide-react"
import { Button } from "@/components/ui/button"

type Currency = "EUR" | "USD" | "GBP"
type BillingCycle = "monthly" | "annual"

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£"
}

const CURRENCY_RATES: Record<Currency, number> = {
  EUR: 1.0,
  USD: 1.08,
  GBP: 0.85
}

export default function Editorial360PricingPage() {
  const { theme, setTheme } = useTheme()
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("annual")
  const [currency, setCurrency] = useState<Currency>("EUR")

  // Add-on selection states
  const [addOnReviewerWallet, setAddOnReviewerWallet] = useState(true)
  const [addOnPapermillDefense, setAddOnPapermillDefense] = useState(true)
  const [addOnWhiteLabel, setAddOnWhiteLabel] = useState(false)

  // ROI Calculator states
  const [roiJournals, setRoiJournals] = useState(3)
  const [roiSubmissionsPerYear, setRoiSubmissionsPerYear] = useState(450)

  // Frankfurt Meeting Request Modal
  const [meetingModalOpen, setMeetingModalOpen] = useState(false)
  const [selectedPlanForModal, setSelectedPlanForModal] = useState("Elevate")
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    role: "Publisher / Executive",
    meetingSlot: "Frankfurt Hall 4.0 / Digital Zone",
    notes: ""
  })

  // Format price helper
  const formatPrice = (eurAmount: number) => {
    const rate = CURRENCY_RATES[currency]
    const converted = Math.round(eurAmount * rate)
    return `${CURRENCY_SYMBOLS[currency]}${converted.toLocaleString()}`
  }

  // Base pricing figures (EUR)
  const plans = [
    {
      id: "launch",
      name: "Launch",
      badge: "Independent & Diamond OA",
      tagline: "Ideal for independent society journals and emerging diamond open access launches.",
      monthlyEur: 199,
      annualEur: 165, // billed annually as €1,990/yr
      annualTotalEur: 1990,
      limits: {
        editors: "Up to 3 Managing & Section Editors",
        submissions: "150 Submissions / year",
        journals: "1 Journal instance"
      },
      features: [
        "End-to-End Double-Blind Peer Review",
        "Author & Reviewer Interactive Workspace",
        "Automated COPE Ethics Screening Checklist",
        "Basic AI Synthetic Text Integrity Check",
        "Turnaround SLA Milestones & Reminders",
        "Encrypted GDPR-Compliant EU Cloud Hosting",
        "Standard Email Support (24h SLA)"
      ],
      ctaText: "Launch Institutional Pilot",
      accent: "border-slate-200 dark:border-slate-800",
      isPopular: false
    },
    {
      id: "elevate",
      name: "Elevate",
      badge: "Most Popular · University Presses",
      tagline: "Designed for university presses, learned societies, and active mid-sized publishers.",
      monthlyEur: 499,
      annualEur: 415, // billed annually as €4,990/yr
      annualTotalEur: 4990,
      limits: {
        editors: "Up to 12 Section & Associate Editors",
        submissions: "600 Submissions / year per journal",
        journals: "1–3 Journal portfolio"
      },
      features: [
        "Everything in Launch, plus:",
        "ScholarScout™ AI Referee Discovery & Matching",
        "Reviewer Incentive Engine (APC Credits & Badges)",
        "Automated Crossref DOI & ORCID Registry Deposit",
        "Advanced Reviewer Performance & Velocity Metrics",
        "Custom Decision Letter Macros & Auto-Synthesis",
        "Parallel 4-Referee Dispatch Pipeline",
        "Priority Support (4h SLA) & Dedicated Onboarding"
      ],
      ctaText: "Start Elevate 30-Day Trial",
      accent: "border-[#0b99ff] ring-2 ring-[#0b99ff]/30 dark:ring-[#0b99ff]/40 shadow-xl",
      isPopular: true
    },
    {
      id: "orbit",
      name: "Orbit",
      badge: "Enterprise Consortium & Commercial",
      tagline: "Full-scale editorial infrastructure for academic publishing houses and university consortia.",
      monthlyEur: 1290,
      annualEur: 1075, // billed annually as €12,900/yr
      annualTotalEur: 12900,
      limits: {
        editors: "Unlimited Editors & Section Boards",
        submissions: "Unlimited Submissions (Fair use)",
        journals: "Multi-Journal Master Network"
      },
      features: [
        "Everything in Elevate, plus:",
        "Multi-Journal Centralized Master Console",
        "Deep Paper Mill Defense Layer (Image Forensics)",
        "Institutional Single Sign-On (SAML / Okta / Azure AD)",
        "Full REST API, Webhooks & XML Typesetting Hooks",
        "Multi-Tenant Role Governance & Audit Trails",
        "Dedicated Journal Manager & Strategic Advisory",
        "99.9% Uptime SLA & Custom DPA Agreement"
      ],
      ctaText: "Request Enterprise Pilot",
      accent: "border-purple-300 dark:border-purple-800/80",
      isPopular: false
    }
  ]

  // Add-ons calculations
  const addOnPrices = {
    reviewerWallet: { monthlyEur: 199, annualEur: 165 },
    papermillDefense: { monthlyEur: 299, annualEur: 249 },
    whiteLabel: { monthlyEur: 99, annualEur: 79 }
  }

  const selectedAddonsTotalMonthly = useMemo(() => {
    let sum = 0
    if (addOnReviewerWallet) sum += addOnPrices.reviewerWallet[billingCycle === "annual" ? "annualEur" : "monthlyEur"]
    if (addOnPapermillDefense) sum += addOnPrices.papermillDefense[billingCycle === "annual" ? "annualEur" : "monthlyEur"]
    if (addOnWhiteLabel) sum += addOnPrices.whiteLabel[billingCycle === "annual" ? "annualEur" : "monthlyEur"]
    return sum
  }, [addOnReviewerWallet, addOnPapermillDefense, addOnWhiteLabel, billingCycle])

  // ROI Calculations vs Legacy Systems (e.g. ScholarOne, Aries EM at €14,000/yr per journal)
  const roiMetrics = useMemo(() => {
    const legacyCostPerJournal = 14000
    const legacyAnnualTotal = roiJournals * legacyCostPerJournal
    const editorial360AnnualPerJournal = 4990 // Elevate annual
    const editorial360AnnualTotal = roiJournals * editorial360AnnualPerJournal
    const netAnnualSavings = legacyAnnualTotal - editorial360AnnualTotal
    const savingsPercent = Math.round((netAnnualSavings / legacyAnnualTotal) * 100)
    const hoursSavedPerYear = roiJournals * roiSubmissionsPerYear * 3.5 // 3.5 hours saved per manuscript cycle
    return {
      legacyAnnualTotal,
      editorial360AnnualTotal,
      netAnnualSavings,
      savingsPercent,
      hoursSavedPerYear
    }
  }, [roiJournals, roiSubmissionsPerYear])

  const handleOpenMeetingModal = (planName: string) => {
    setSelectedPlanForModal(planName)
    setMeetingModalOpen(true)
    setFormSubmitted(false)
  }

  const handleSubmitMeeting = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
    setTimeout(() => {
      // simulate receipt
    }, 600)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c0d12] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      
      {/* Top Floating Announcement Bar: Frankfurt Book Fair 2026 */}
      <div className="bg-gradient-to-r from-[#0b99ff] via-indigo-600 to-purple-600 text-white px-4 py-2.5 text-xs sm:text-sm font-medium shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase">
              Frankfurt Book Fair 2026
            </span>
            <span className="font-semibold">
              Live Investor & Publisher Showcase · Hall 4.0 Digital Publishing Zone
            </span>
          </div>
          <button
            onClick={() => handleOpenMeetingModal("Frankfurt Fair VIP Demo")}
            className="inline-flex items-center gap-1.5 bg-white text-slate-900 hover:bg-slate-100 font-bold px-3 py-1 rounded-full text-xs shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Book On-Site Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#12131a]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <Link href="/editorial360" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <img 
                src="/editorial360.svg" 
                alt="editorial360" 
                className="h-7 w-auto object-contain brightness-100 dark:brightness-110" 
              />
            </Link>
            <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 hidden sm:inline-block">
              Publisher Licensing & SaaS Pricing
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Currency Selector */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              {(["EUR", "USD", "GBP"] as Currency[]).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    currency === curr
                      ? "bg-white dark:bg-slate-900 text-[#0b99ff] shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {curr} ({CURRENCY_SYMBOLS[curr]})
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-8 w-8 px-0 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Back to Workspace */}
            <Link
              href="/editorial360"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#0b99ff] bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 px-3 py-1.5 rounded-lg transition-all border border-slate-200 dark:border-slate-700 shadow-2xs"
            >
              <span>To Workspace</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-12 pb-10 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b99ff]/10 text-[#0b99ff] border border-[#0b99ff]/20 text-xs font-bold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Editorial Infrastructure</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
          Predictable, Transparent SaaS Pricing for Modern Academic Publishers
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Slash peer review turnaround from <span className="font-semibold text-slate-900 dark:text-white">90 days to 21 days</span>. 
          Protect journal reputation with native paper-mill forensics, automated reviewer incentive rails, and institutional compliance.
        </p>

        {/* Billing Cycle Switcher with Savings Badge */}
        <div className="pt-4 flex items-center justify-center">
          <div className="inline-flex items-center bg-slate-200/80 dark:bg-slate-850 p-1.5 rounded-2xl border border-slate-300/80 dark:border-slate-750 shadow-inner">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Monthly Invoicing
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                billingCycle === "annual"
                  ? "bg-[#0b99ff] text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>Annual Billing</span>
              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                billingCycle === "annual" ? "bg-white text-[#0b99ff]" : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
              }`}>
                Save ~17% (2 Mo Free)
              </span>
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          All tiers include GDPR EU Cloud hosting, unlimited reviewer invitations, and automated author status dossiers.
        </p>
      </section>

      {/* 3 Main Tiers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {plans.map((plan) => {
            const price = billingCycle === "annual" ? plan.annualEur : plan.monthlyEur

            return (
              <div 
                key={plan.id}
                className={`relative flex flex-col rounded-3xl bg-white dark:bg-[#15161e] border p-7 sm:p-8 transition-all duration-200 hover:shadow-2xl ${plan.accent} ${
                  plan.isPopular ? "scale-102 lg:scale-105 z-10 border-[#0b99ff]" : ""
                }`}
              >
                {/* Popular Gold/Blue Pill */}
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-[#0b99ff] text-white text-[11px] font-extrabold tracking-wider uppercase px-4 py-1 rounded-full shadow-md">
                    {plan.badge}
                  </div>
                )}

                {!plan.isPopular && (
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    {plan.badge}
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 min-h-[36px] mb-5 leading-relaxed">
                  {plan.tagline}
                </p>

                {/* Price display */}
                <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-[#1a1b26] border border-slate-100 dark:border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                      {formatPrice(price)}
                    </span>
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                      / month
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span>
                      {billingCycle === "annual" 
                        ? `${formatPrice(plan.annualTotalEur)} billed annually` 
                        : "Billed on a monthly basis"}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">Excl. VAT</span>
                  </div>
                </div>

                {/* Capacity Specs */}
                <div className="space-y-2 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                    <Users className="w-4 h-4 text-[#0b99ff] shrink-0" />
                    <span>{plan.limits.editors}</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                    <FileCheck2 className="w-4 h-4 text-[#0b99ff] shrink-0" />
                    <span>{plan.limits.submissions}</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                    <Building2 className="w-4 h-4 text-[#0b99ff] shrink-0" />
                    <span>{plan.limits.journals}</span>
                  </div>
                </div>

                {/* Feature Checklist */}
                <div className="flex-1 space-y-3 mb-8 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    Included Capabilities:
                  </div>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="mt-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-0.5 shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-slate-600 dark:text-slate-300 leading-snug">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Action */}
                <Button
                  onClick={() => handleOpenMeetingModal(plan.name)}
                  className={`w-full py-6 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-md ${
                    plan.isPopular
                      ? "bg-[#0b99ff] hover:bg-[#0883dc] text-white"
                      : "bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>

              </div>
            )
          })}

        </div>
      </section>

      {/* Add-on Customization Engine (Directly reflects & expands user's screenshot) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-3xl bg-white dark:bg-[#15161e] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b99ff] uppercase tracking-wider mb-1">
                <Sliders className="w-3.5 h-3.5" />
                <span>Modular Expansion Engine</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Elevate & Orbit Enterprise Add-Ons
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Power up your editorial desk with dedicated forensic intelligence and reviewer retention rails.
              </p>
            </div>

            <div className="text-right sm:border-l sm:border-slate-100 dark:sm:border-slate-800 sm:pl-6">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                Selected Add-Ons Subtotal
              </span>
              <span className="text-2xl font-black text-[#0b99ff]">
                +{formatPrice(selectedAddonsTotalMonthly)}
                <span className="text-xs font-normal text-slate-500">/mo</span>
              </span>
            </div>
          </div>

          <div className="space-y-4">
            
            {/* Addon 1: Reviewer Incentive Engine */}
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all ${
              addOnReviewerWallet 
                ? "bg-[#0b99ff]/5 border-[#0b99ff]/30 dark:bg-[#0b99ff]/10" 
                : "bg-slate-50/50 dark:bg-[#1a1b26]/50 border-slate-200/80 dark:border-slate-800"
            }`}>
              <div className="flex items-start gap-3.5 mb-3 sm:mb-0">
                <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-[#0b99ff] shrink-0 mt-0.5">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      Reviewer Incentive Engine & Wallet
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      Cuts Refusal Rate by 64%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-lg leading-relaxed">
                    Automate APC waiver voucher distribution, verified CPD certificates, and micro-honoraria payouts for referee on-time evaluations.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                  +{formatPrice(addOnPrices.reviewerWallet[billingCycle === "annual" ? "annualEur" : "monthlyEur"])}
                  <span className="text-xs text-slate-400 font-normal">/mo</span>
                </span>
                <button
                  type="button"
                  onClick={() => setAddOnReviewerWallet(!addOnReviewerWallet)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    addOnReviewerWallet ? "bg-[#0b99ff]" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    addOnReviewerWallet ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
              </div>
            </div>

            {/* Addon 2: Paper Mill Defense Layer */}
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all ${
              addOnPapermillDefense 
                ? "bg-purple-500/5 border-purple-500/30 dark:bg-purple-500/10" 
                : "bg-slate-50/50 dark:bg-[#1a1b26]/50 border-slate-200/80 dark:border-slate-800"
            }`}>
              <div className="flex items-start gap-3.5 mb-3 sm:mb-0">
                <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      Paper Mill & Forensic Defense Layer
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      97%+ Accuracy
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-lg leading-relaxed">
                    Automated Western blot & microscopy image duplication forensics, author email spoofing detection, and citation ring network anomaly detection.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                  +{formatPrice(addOnPrices.papermillDefense[billingCycle === "annual" ? "annualEur" : "monthlyEur"])}
                  <span className="text-xs text-slate-400 font-normal">/mo</span>
                </span>
                <button
                  type="button"
                  onClick={() => setAddOnPapermillDefense(!addOnPapermillDefense)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    addOnPapermillDefense ? "bg-purple-600" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    addOnPapermillDefense ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
              </div>
            </div>

            {/* Addon 3: White Label & Custom Subdomain */}
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all ${
              addOnWhiteLabel 
                ? "bg-amber-500/5 border-amber-500/30 dark:bg-amber-500/10" 
                : "bg-slate-50/50 dark:bg-[#1a1b26]/50 border-slate-200/80 dark:border-slate-800"
            }`}>
              <div className="flex items-start gap-3.5 mb-3 sm:mb-0">
                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      White-Label Custom Subdomain & DKIM/SPF Branding
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-lg leading-relaxed">
                    Deploy under your publisher domain (e.g. <code className="text-[#0b99ff]">review.press.oxford.org</code>) with custom email signing and institutional certificates.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                  +{formatPrice(addOnPrices.whiteLabel[billingCycle === "annual" ? "annualEur" : "monthlyEur"])}
                  <span className="text-xs text-slate-400 font-normal">/mo</span>
                </span>
                <button
                  type="button"
                  onClick={() => setAddOnWhiteLabel(!addOnWhiteLabel)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    addOnWhiteLabel ? "bg-amber-600" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    addOnWhiteLabel ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Publisher ROI & Cost Comparison Calculator (Vital for Investors at Frankfurt) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white p-8 sm:p-10 shadow-2xl border border-slate-800">
          
          <div className="flex items-center gap-2 text-xs font-bold text-[#0b99ff] uppercase tracking-wider mb-2">
            <Calculator className="w-4 h-4" />
            <span>Interactive Publishing Unit Economics</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Calculate Your Return on Investment vs Legacy EMS
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mb-8 leading-relaxed">
            Legacy providers like ScholarOne and Aries Editorial Manager lock academic societies into €12k–€25k annual contracts with rigid customization and months of onboarding.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Sliders */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span>Number of Journals Managed</span>
                  <span className="text-[#0b99ff] font-mono text-sm">{roiJournals} Journals</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="20" 
                  value={roiJournals} 
                  onChange={(e) => setRoiJournals(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0b99ff]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>1 Journal</span>
                  <span>10 Journals</span>
                  <span>20 Journals</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span>Avg. Submissions / Journal / Year</span>
                  <span className="text-[#0b99ff] font-mono text-sm">{roiSubmissionsPerYear} Submissions</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="2000" 
                  step="50"
                  value={roiSubmissionsPerYear} 
                  onChange={(e) => setRoiSubmissionsPerYear(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0b99ff]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>50</span>
                  <span>1,000</span>
                  <span>2,000+</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-xs space-y-1.5 text-slate-300">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Velocity Impact:</span>
                </div>
                <div>• Review turnaround slashes from 84 days to ~22 days.</div>
                <div>• Saves approx. <strong className="text-white">{Math.round(roiMetrics.hoursSavedPerYear).toLocaleString()} editorial desk hours</strong> annually.</div>
              </div>
            </div>

            {/* Savings Result Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0b99ff]/15 to-purple-600/15 border border-[#0b99ff]/30 text-center space-y-4">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#0b99ff]">
                Estimated Annual Publisher Savings
              </span>

              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                {formatPrice(roiMetrics.netAnnualSavings)}
                <span className="text-base font-normal text-slate-300"> / year</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{roiMetrics.savingsPercent}% Lower Total Cost of Ownership</span>
              </div>

              <div className="pt-2 grid grid-cols-2 gap-2 text-xs text-left border-t border-slate-700">
                <div>
                  <span className="text-slate-400 block text-[11px]">Legacy EMS:</span>
                  <span className="font-bold text-slate-200 line-through">
                    {formatPrice(roiMetrics.legacyAnnualTotal)}/yr
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Editorial360:</span>
                  <span className="font-bold text-emerald-400">
                    {formatPrice(roiMetrics.editorial360AnnualTotal)}/yr
                  </span>
                </div>
              </div>

              <Button
                onClick={() => handleOpenMeetingModal("Custom Consortia ROI")}
                className="w-full mt-2 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs py-4 rounded-xl cursor-pointer"
              >
                Download Custom CFO & Investment Memo
              </Button>
            </div>

          </div>

        </div>
      </section>

      {/* Feature Comparison Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Feature Comparison Matrix
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Compare key capabilities across our three subscription tiers.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15161e] shadow-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1a1b26]">
                <th className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white w-2/5">Capabilities & Architecture</th>
                <th className="p-4 sm:p-5 font-bold text-center w-1/5 text-slate-700 dark:text-slate-300">Launch</th>
                <th className="p-4 sm:p-5 font-bold text-center w-1/5 text-[#0b99ff]">Elevate</th>
                <th className="p-4 sm:p-5 font-bold text-center w-1/5 text-purple-600 dark:text-purple-400">Orbit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              
              {/* Category: Submissions & Capacity */}
              <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                <td colSpan={4} className="p-3 px-5 font-extrabold text-[11px] uppercase tracking-wider text-slate-500">
                  1. Submission Velocity & Capacity
                </td>
              </tr>
              <tr>
                <td className="p-4 px-5 font-medium text-slate-900 dark:text-white">Annual Submission Volume</td>
                <td className="p-4 text-center text-slate-600 dark:text-slate-300">150 / yr</td>
                <td className="p-4 text-center font-bold text-[#0b99ff]">600 / yr</td>
                <td className="p-4 text-center font-bold text-purple-600 dark:text-purple-400">Unlimited</td>
              </tr>
              <tr>
                <td className="p-4 px-5 font-medium text-slate-900 dark:text-white">Active Managing / Section Editors</td>
                <td className="p-4 text-center text-slate-600 dark:text-slate-300">Up to 3</td>
                <td className="p-4 text-center font-bold text-[#0b99ff]">Up to 12</td>
                <td className="p-4 text-center font-bold text-purple-600 dark:text-purple-400">Unlimited</td>
              </tr>
              <tr>
                <td className="p-4 px-5 font-medium text-slate-900 dark:text-white">Multi-Journal Portfolio Console</td>
                <td className="p-4 text-center text-slate-400">—</td>
                <td className="p-4 text-center text-slate-600 dark:text-slate-300">Up to 3 Journals</td>
                <td className="p-4 text-center font-bold text-purple-600 dark:text-purple-400">Unlimited Multi-Desk</td>
              </tr>

              {/* Category: Peer Review & Sourcing */}
              <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                <td colSpan={4} className="p-3 px-5 font-extrabold text-[11px] uppercase tracking-wider text-slate-500">
                  2. Peer Review Orchestration & AI Discovery
                </td>
              </tr>
              <tr>
                <td className="p-4 px-5 font-medium text-slate-900 dark:text-white">ScholarScout™ AI Reviewer Discovery</td>
                <td className="p-4 text-center text-slate-400">—</td>
                <td className="p-4 text-center font-bold text-emerald-500">✓ Automated</td>
                <td className="p-4 text-center font-bold text-emerald-500">✓ Automated + Priority</td>
              </tr>
              <tr>
                <td className="p-4 px-5 font-medium text-slate-900 dark:text-white">Parallel 4-Referee Dispatch Matrix</td>
                <td className="p-4 text-center font-bold text-emerald-500">✓ Included</td>
                <td className="p-4 text-center font-bold text-emerald-500">✓ Included</td>
                <td className="p-4 text-center font-bold text-emerald-500">✓ Included</td>
              </tr>
              <tr>
                <td className="p-4 px-5 font-medium text-slate-900 dark:text-white">Reviewer Wallet & APC Incentive Rails</td>
                <td className="p-4 text-center text-slate-400">—</td>
                <td className="p-4 text-center font-bold text-emerald-500">✓ (Module)</td>
                <td className="p-4 text-center font-bold text-emerald-500">✓ Full Enterprise</td>
              </tr>

              {/* Category: Research Integrity */}
              <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                <td colSpan={4} className="p-3 px-5 font-extrabold text-[11px] uppercase tracking-wider text-slate-500">
                  3. Research Integrity & Fraud Defense
                </td>
              </tr>
              <tr>
                <td className="p-4 px-5 font-medium text-slate-900 dark:text-white">COPE Ethics Screening Checklists</td>
                <td className="p-4 text-center font-bold text-emerald-500">✓ Basic</td>
                <td className="p-4 text-center font-bold text-emerald-500">✓ Advanced</td>
                <td className="p-4 text-center font-bold text-emerald-500">✓ Enterprise Custom</td>
              </tr>
              <tr>
                <td className="p-4 px-5 font-medium text-slate-900 dark:text-white">Deep Paper Mill & Image Forensic Layer</td>
                <td className="p-4 text-center text-slate-400">—</td>
                <td className="p-4 text-center text-slate-600 dark:text-slate-300">Add-On Available</td>
                <td className="p-4 text-center font-bold text-emerald-500">✓ Native Forensic Suite</td>
              </tr>

              {/* Category: Enterprise & Integrations */}
              <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                <td colSpan={4} className="p-3 px-5 font-extrabold text-[11px] uppercase tracking-wider text-slate-500">
                  4. Production & Enterprise Governance
                </td>
              </tr>
              <tr>
                <td className="p-4 px-5 font-medium text-slate-900 dark:text-white">Crossref DOI & ORCID Integration</td>
                <td className="p-4 text-center text-slate-400">—</td>
                <td className="p-4 text-center font-bold text-emerald-500">✓ Included</td>
                <td className="p-4 text-center font-bold text-emerald-500">✓ Real-Time Pipeline</td>
              </tr>
              <tr>
                <td className="p-4 px-5 font-medium text-slate-900 dark:text-white">Institutional SSO (SAML / Okta / Azure AD)</td>
                <td className="p-4 text-center text-slate-400">—</td>
                <td className="p-4 text-center text-slate-400">—</td>
                <td className="p-4 text-center font-bold text-emerald-500">✓ Included</td>
              </tr>
              <tr>
                <td className="p-4 px-5 font-medium text-slate-900 dark:text-white">REST APIs & Custom Production Webhooks</td>
                <td className="p-4 text-center text-slate-400">—</td>
                <td className="p-4 text-center text-slate-400">Read-Only API</td>
                <td className="p-4 text-center font-bold text-emerald-500">✓ Full Bi-Directional</td>
              </tr>
              <tr>
                <td className="p-4 px-5 font-medium text-slate-900 dark:text-white">Dedicated Support SLA</td>
                <td className="p-4 text-center text-slate-600 dark:text-slate-300">Email (24h)</td>
                <td className="p-4 text-center font-bold text-[#0b99ff]">Priority (4h)</td>
                <td className="p-4 text-center font-bold text-purple-600 dark:text-purple-400">Dedicated JM + 99.9% Uptime</td>
              </tr>

            </tbody>
          </table>
        </div>
      </section>

      {/* Investor Pitch Briefing Card (Frankfurt 2026 Executive Summary) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-purple-900/20 border border-blue-500/30 p-8 sm:p-10 backdrop-blur-md">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b99ff]/20 text-[#0b99ff] text-xs font-bold uppercase">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Frankfurt Book Fair 2026 · Investor & Consortia Brief</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Why Global Publishers Are Migrating to Editorial360
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                The global STM academic publishing market exceeds <strong>$28 Billion annually</strong>, with $2.8B allocated to editorial and peer review software. Legacy software is crippled by 20-year-old architectures, non-responsive interfaces, and vulnerability to paper-mill fraud. Editorial360 delivers an agile, AI-native, high-margin alternative with <strong>85%+ software gross margins</strong> and <strong>124% net dollar retention</strong>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
              <Button
                onClick={() => handleOpenMeetingModal("Frankfurt Investor Pitch")}
                className="bg-[#0b99ff] hover:bg-[#0883dc] text-white font-bold text-xs py-6 px-6 rounded-xl shadow-lg cursor-pointer"
              >
                Schedule Frankfurt Investor Meeting
              </Button>
              <Button
                variant="outline"
                onClick={() => handleOpenMeetingModal("Institutional Sandbox Trial")}
                className="font-bold text-xs py-6 px-6 rounded-xl border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Request 30-Day Sandbox
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Frankfurt Meeting Request Modal */}
      {meetingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#15161e] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
            
            <button
              onClick={() => setMeetingModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!formSubmitted ? (
              <>
                <div>
                  <span className="text-[11px] font-bold text-[#0b99ff] uppercase tracking-wider block mb-1">
                    Frankfurt Book Fair 2026 Delegation
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Connect on {selectedPlanForModal}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Book an executive slot at our Hall 4.0 booth or request a tailored institutional trial agreement.
                  </p>
                </div>

                <form onSubmit={handleSubmitMeeting} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Executive Name *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Dr. Eleanor Vance"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Official Work Email *
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="e.vance@press.cambridge.org"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Organization / University Press *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="European Physical Society"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Preferred Location / Slot
                      </label>
                      <select
                        value={formData.meetingSlot}
                        onChange={(e) => setFormData({ ...formData, meetingSlot: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                      >
                        <option>Frankfurt Hall 4.0 / Digital Zone</option>
                        <option>Virtual Executive Briefing (Zoom / Teams)</option>
                        <option>Immediate 30-Day Sandbox Access</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Notes or Journal Requirements
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Inquiring about migrating 4 diamond OA journals currently hosted on legacy OJS / ScholarOne."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-5 rounded-xl bg-[#0b99ff] hover:bg-[#0883dc] text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    Confirm Meeting / Request Institutional Access
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white">
                    Request Received & Logged
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    Thank you, {formData.name || "Colleague"}. An executive representative from Scholarly Open will connect with you shortly regarding your {selectedPlanForModal} demonstration.
                  </p>
                </div>
                <Button
                  onClick={() => setMeetingModalOpen(false)}
                  className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 px-6 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Return to Pricing Overview
                </Button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f1017] py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/editorial360.svg" alt="editorial360" className="h-5 w-auto object-contain" />
            <span>&copy; {new Date().getFullYear()} Scholarly Open Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/editorial360" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Editorial360 Workspace
            </Link>
            <Link href="/publication-ethics" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              COPE Compliance
            </Link>
            <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              GDPR & Privacy
            </Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
