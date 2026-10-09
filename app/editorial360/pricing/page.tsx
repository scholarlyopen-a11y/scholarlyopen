"use client"

import { useState, useMemo, useEffect } from "react"
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
  Award, 
  FileCheck2, 
  Lock, 
  Sliders, 
  TrendingUp, 
  Briefcase,
  X, 
  CheckCircle2, 
  KeyRound,
  AlertCircle,
  Sun,
  Moon,
  QrCode,
  Copy,
  Download,
  Share2,
  ExternalLink,
  Laptop,
  Eye,
  CheckCircle,
  FileText,
  Search,
  Fingerprint,
  Cpu,
  Mail,
  Clock,
  Video,
  ClipboardList,
  AlertTriangle,
  Flame,
  HelpCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"

type Currency = "EUR" | "USD" | "GBP"
type BillingCycle = "monthly" | "annual"
type ShowcaseTab = "scholar_scout" | "parallel_dispatch" | "paper_mill" | "reviewer_wallet"

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

// Valid VIP Passcodes for Frankfurt Book Fair 2026 investors and publishing executives
const VALID_ACCESS_CODES = [
  "FRANKFURT2026",
  "FBF26",
  "FBF2026",
  "INVESTOR360",
  "VIP360",
  "SCHOLARLY2026",
  "EDITORIAL360"
]

export default function Editorial360PricingPage() {
  const { theme, setTheme } = useTheme()
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("annual")
  const [currency, setCurrency] = useState<Currency>("EUR")

  // Platform Showcase Tab
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<ShowcaseTab>("scholar_scout")

  // Access Gate state
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [accessCodeInput, setAccessCodeInput] = useState("")
  const [accessError, setAccessError] = useState("")
  const [requestAccessModalOpen, setRequestAccessModalOpen] = useState(false)
  const [requestSubmitted, setRequestSubmitted] = useState(false)

  // QR Modal & Sharing State
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const vipUrl = "https://www.scholarlyopen.org/editorial360/pricing?code=FRANKFURT2026"
  const auditUrl = "https://www.scholarlyopen.org/editorial360/pricing?code=FRANKFURT2026&action=diagnostic"

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(vipUrl)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2500)
    }
  }

  // 30-sec Publisher Diagnostic Questionnaire State
  const [auditModalOpen, setAuditModalOpen] = useState(false)
  const [submittingAudit, setSubmittingAudit] = useState(false)
  const [auditSubmitted, setAuditSubmitted] = useState(false)
  const [auditCopied, setAuditCopied] = useState(false)
  const [auditError, setAuditError] = useState("")
  const [auditData, setAuditData] = useState({
    name: "",
    email: "",
    organization: "",
    role: "Journal Manager / Editor-in-Chief",
    journalCount: "1-3 Journals",
    currentSystem: "Clarivate ScholarOne",
    turnaroundTime: "60 to 90 Days",
    difficulties: [
      "Reviewer fatigue & high decline rates (>60%)",
      "Slow turnaround & manual reminder delays",
      "High software licensing & maintenance costs (€12k–€25k+/yr)"
    ],
    keySwitchFeature: "",
    notes: ""
  })

  const handleCopyAuditLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(auditUrl)
      setAuditCopied(true)
      setTimeout(() => setAuditCopied(false), 2500)
    }
  }

  const handleToggleDifficulty = (item: string) => {
    setAuditData(prev => {
      const exists = prev.difficulties.includes(item)
      if (exists) {
        return { ...prev, difficulties: prev.difficulties.filter(d => d !== item) }
      } else {
        return { ...prev, difficulties: [...prev.difficulties, item] }
      }
    })
  }

  const handleSubmitAudit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittingAudit(true)
    setAuditError("")
    try {
      const res = await fetch("/api/editorial360/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "audit",
          ...auditData
        })
      })
      const data = await res.json()
      if (data.ok) {
        setAuditSubmitted(true)
      } else {
        setAuditError(data.error || "Unable to submit audit.")
      }
    } catch (err) {
      console.warn("Optimistic fallback on audit submit error:", err)
      setAuditSubmitted(true)
    } finally {
      setSubmittingAudit(false)
    }
  }

  // Add-on selection states
  const [addOnReviewerWallet, setAddOnReviewerWallet] = useState(true)
  const [addOnPapermillDefense, setAddOnPapermillDefense] = useState(true)
  const [addOnWhiteLabel, setAddOnWhiteLabel] = useState(false)

  // ROI Calculator states
  const [roiJournals, setRoiJournals] = useState(3)
  const [roiSubmissionsPerYear, setRoiSubmissionsPerYear] = useState(450)

  // Frankfurt Meeting Request Modal (Online Only)
  const [meetingModalOpen, setMeetingModalOpen] = useState(false)
  const [selectedPlanForModal, setSelectedPlanForModal] = useState("Elevate")
  const [submittingMeeting, setSubmittingMeeting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [meetingError, setMeetingError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    role: "Publisher / Executive",
    meetingSlot: "Online Executive Briefing (Zoom / Google Meet)",
    notes: ""
  })

  // Check URL query parameters or localStorage for existing unlock & action trigger
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.sessionStorage.getItem("editorial360_vip_unlocked")
      if (stored === "true") {
        setIsUnlocked(true)
      }

      const params = new URLSearchParams(window.location.search)
      const codeFromUrl = params.get("code") || params.get("access") || params.get("pass")
      if (codeFromUrl && VALID_ACCESS_CODES.includes(codeFromUrl.trim().toUpperCase())) {
        setIsUnlocked(true)
        window.sessionStorage.setItem("editorial360_vip_unlocked", "true")
      }

      const actionParam = params.get("action")
      if (actionParam === "audit" || actionParam === "diagnostic") {
        setAuditModalOpen(true)
      }
    }
  }, [])

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    const cleaned = accessCodeInput.trim().toUpperCase()
    if (VALID_ACCESS_CODES.includes(cleaned)) {
      setIsUnlocked(true)
      setAccessError("")
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("editorial360_vip_unlocked", "true")
      }
    } else {
      setAccessError("Invalid VIP Access Code. Please enter the passcode provided by the Scholarly Open team.")
    }
  }

  // Format price helper
  const formatPrice = (eurAmount: number) => {
    const rate = CURRENCY_RATES[currency]
    const converted = Math.round(eurAmount * rate)
    return `${CURRENCY_SYMBOLS[currency]}${converted.toLocaleString()}`
  }

  // Base pricing figures (EUR) - Updated per requirements
  const plans = [
    {
      id: "launch",
      name: "Launch",
      badge: "Small OA or independent journal",
      tagline: "Designed for independent societies and emerging diamond open access journal launches.",
      monthlyEur: 249,
      annualEur: 199, // at least 199 EUR per journal
      annualTotalEur: 2388,
      priceLabel: "per journal",
      limits: {
        editors: "Up to 3 Managing & Section Editors",
        submissions: "150 Submissions / year per journal",
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
      ctaText: "Select Launch Pilot",
      accent: "border-slate-200 dark:border-slate-800",
      isPopular: false
    },
    {
      id: "elevate",
      name: "Elevate",
      badge: "University publisher or society",
      tagline: "Designed for university presses, learned societies, and active mid-sized academic publishers.",
      monthlyEur: 599,
      annualEur: 499, // €499/mo per journal billed annually
      annualTotalEur: 5988,
      priceLabel: "per journal",
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
      ctaText: "Select Elevate",
      accent: "border-[#0b99ff] ring-2 ring-[#0b99ff]/30 dark:ring-[#0b99ff]/40 shadow-xl",
      isPopular: true
    },
    {
      id: "orbit",
      name: "Orbit",
      badge: "Academic publisher or consortium",
      tagline: "Full-scale editorial infrastructure for academic publishing houses and university consortia.",
      monthlyEur: 1490,
      annualEur: 1290, // €1,290/mo billed annually
      annualTotalEur: 15480,
      priceLabel: "multi-journal setup",
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
      ctaText: "Select Enterprise",
      accent: "border-purple-300 dark:border-purple-800/80",
      isPopular: false
    }
  ]

  // Add-ons calculations
  const addOnPrices = {
    reviewerWallet: { monthlyEur: 250, annualEur: 199 },
    papermillDefense: { monthlyEur: 300, annualEur: 249 },
    whiteLabel: { monthlyEur: 120, annualEur: 99 }
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
    const editorial360AnnualPerJournal = 5988 // Elevate annual per journal
    const editorial360AnnualTotal = roiJournals * editorial360AnnualPerJournal
    const netAnnualSavings = legacyAnnualTotal - editorial360AnnualTotal
    const savingsPercent = Math.round((netAnnualSavings / legacyAnnualTotal) * 100)
    const hoursSavedPerYear = roiJournals * roiSubmissionsPerYear * 3.5
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
    setMeetingError("")
  }

  // Real API dispatch to info@scholarlyopen.org
  const handleSubmitMeeting = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittingMeeting(true)
    setMeetingError("")
    try {
      const res = await fetch("/api/editorial360/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          plan: selectedPlanForModal
        })
      })
      const data = await res.json()
      if (data.ok) {
        setFormSubmitted(true)
      } else {
        setMeetingError(data.error || "Unable to dispatch request.")
      }
    } catch (err) {
      console.warn("Optimistic fallback on submission error:", err)
      setFormSubmitted(true)
    } finally {
      setSubmittingMeeting(false)
    }
  }

  // ==========================================
  // VIEW A: ACCESS CODE GATE (WHEN NOT UNLOCKED)
  // ==========================================
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0c0d12] text-slate-900 dark:text-slate-100 font-sans flex flex-col justify-between">
        
        {/* Minimal Header */}
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#12131a]/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 hover:opacity-90">
              <img 
                src="/editorial360.svg" 
                alt="editorial360" 
                className="h-7 w-auto object-contain brightness-100 dark:brightness-110" 
              />
            </Link>
            <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Executive Portal
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAuditModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/20 transition-all cursor-pointer shadow-2xs"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Take Workflow Audit</span>
            </button>
            <button
              onClick={() => setQrModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b99ff] bg-[#0b99ff]/10 hover:bg-[#0b99ff]/20 px-3 py-1.5 rounded-lg border border-[#0b99ff]/20 transition-all cursor-pointer shadow-2xs"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Show QR Pass</span>
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-8 w-8 px-0 text-slate-600 dark:text-slate-300"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        {/* Access Code Form Box */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-white dark:bg-[#15161e] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#0b99ff]/10 text-[#0b99ff] border border-[#0b99ff]/20 flex items-center justify-center shadow-xs">
                <KeyRound className="w-6 h-6" />
              </div>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-extrabold uppercase tracking-widest text-slate-600 dark:text-slate-300">
                <span>Frankfurt Book Fair 2026 · Online Executive Portal</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                editorial360 Institutional Pricing
              </h1>
              
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                This pricing schedule and executive online demonstration are reserved for accredited university press directors, society leaders, and investors.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Enter VIP Access Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. FRANKFURT2026"
                    value={accessCodeInput}
                    onChange={(e) => {
                      setAccessCodeInput(e.target.value)
                      setAccessError("")
                    }}
                    className="w-full text-sm font-mono tracking-wider uppercase px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b99ff] transition-all"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                </div>
                {accessError && (
                  <p className="text-xs text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{accessError}</span>
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full py-5 rounded-xl bg-[#0b99ff] hover:bg-[#0883dc] text-white font-bold text-xs shadow-md cursor-pointer transition-all"
              >
                <span>Unlock Pricing Schedule & Tiers</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </form>

            {/* Quick QR & 30-sec Diagnostic Buttons */}
            <div className="pt-2 text-center space-y-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setAuditModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-950/60 px-4 py-2.5 rounded-xl border border-amber-200 dark:border-amber-800 transition-all cursor-pointer shadow-2xs"
              >
                <ClipboardList className="w-4 h-4 text-amber-500" />
                <span>Take 30-sec Publisher Diagnostic</span>
              </button>

              <button
                type="button"
                onClick={() => setQrModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#0b99ff] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-2xs"
              >
                <QrCode className="w-4 h-4 text-[#0b99ff]" />
                <span>Display Mobile QR Code (For Scanning)</span>
              </button>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Need an immediate passcode or online session?{" "}
                <button
                  type="button"
                  onClick={() => setRequestAccessModalOpen(true)}
                  className="font-bold text-[#0b99ff] hover:underline cursor-pointer"
                >
                  Schedule Online Session →
                </button>
              </p>
            </div>

          </div>
        </main>

        {/* Minimal Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 py-4 px-4 text-center text-xs text-slate-400">
          <span>&copy; {new Date().getFullYear()} Scholarly Open Inc. · All rights reserved by editorial360.</span>
        </footer>

      </div>
    )
  }

  // ==========================================
  // VIEW B: FULL UNLOCKED PRICING & PITCH SCHEDULE
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c0d12] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      
      {/* Top Floating Announcement Bar: Frankfurt Book Fair 2026 */}
      <div className="bg-[#0A192F] text-slate-200 border-b border-slate-800 px-4 py-2.5 text-xs sm:text-sm font-medium shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <span className="bg-blue-500/15 text-blue-300 border border-blue-400/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
              VIP Passcode Verified
            </span>
            <span className="font-semibold text-xs sm:text-sm text-slate-100">
              Frankfurt Book Fair 2026 · Online Executive Partner Sessions
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAuditModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3 py-1 rounded-full text-xs shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>30-sec Publisher Diagnostic</span>
            </button>
            <button
              onClick={() => setQrModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-medium px-3 py-1 rounded-full text-xs border border-slate-700 transition-all cursor-pointer whitespace-nowrap"
            >
              <QrCode className="w-3.5 h-3.5 text-[#0b99ff]" />
              <span>Show QR Code</span>
            </button>
            <button
              onClick={() => handleOpenMeetingModal("Frankfurt Fair VIP Demo")}
              className="inline-flex items-center gap-1.5 bg-[#0b99ff] hover:bg-[#0883dc] text-white font-semibold px-3 py-1 rounded-full text-xs shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Schedule Online Briefing</span>
            </button>
            <button
              onClick={() => {
                setIsUnlocked(false)
                if (typeof window !== "undefined") {
                  window.sessionStorage.removeItem("editorial360_vip_unlocked")
                }
              }}
              className="text-slate-400 hover:text-slate-200 text-[11px] underline ml-1 cursor-pointer"
            >
              Lock
            </button>
          </div>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#12131a]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <img 
                src="/editorial360.svg" 
                alt="editorial360" 
                className="h-7 w-auto object-contain brightness-100 dark:brightness-110" 
              />
            </Link>
            <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 hidden sm:inline-block">
              Business Model & Pricing
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Publisher Diagnostic Button in Nav */}
            <button
              onClick={() => setAuditModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-950/60 px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-800 transition-all cursor-pointer shadow-2xs"
            >
              <ClipboardList className="w-3.5 h-3.5 text-amber-500" />
              <span>30-sec Diagnostic</span>
            </button>

            {/* Show QR Code button */}
            <button
              onClick={() => setQrModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b99ff] bg-[#0b99ff]/10 hover:bg-[#0b99ff]/20 px-3 py-1.5 rounded-lg border border-[#0b99ff]/20 transition-all cursor-pointer shadow-2xs"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">QR Pass</span>
            </button>

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
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-12 pb-6 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Business Model & Pricing
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Modern editorial management & peer review infrastructure engineered for velocity, paper-mill fraud defense, and verified reviewer recognition.
        </p>

        {/* Billing Cycle Switcher */}
        <div className="pt-2 flex items-center justify-center">
          <div className="inline-flex items-center bg-slate-200/80 dark:bg-slate-850 p-1.5 rounded-2xl border border-slate-300/80 dark:border-slate-750 shadow-inner">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Monthly Billing
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
                Save ~20%
              </span>
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium italic">
          Prices per journal, annual billing, plus VAT
        </p>
      </section>

      {/* ========================================================================= */}
      {/* 30-SEC PUBLISHER DIAGNOSTIC CTA BANNER */}
      {/* ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="rounded-2xl bg-[#0A192F] border border-blue-900/60 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2.5 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 text-[11px] font-bold uppercase tracking-wider border border-blue-400/20">
              <ClipboardList className="w-3.5 h-3.5" />
              <span>International Publisher Diagnostic · 30-Second Institutional Benchmark</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              What bottlenecks are you facing in your editorial workflow?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Complete our 30-second diagnostic. Flag where your workflow experiences friction (referee decline rates, slow turnaround, paper-mill risks, or high licensing fees) to view your real-time benchmark against editorial360.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto shrink-0 z-10">
            <button
              onClick={() => setAuditModalOpen(true)}
              className="bg-[#0b99ff] hover:bg-[#0883dc] text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
            >
              <ClipboardList className="w-4 h-4" />
              <span>Take 30-sec Publisher Diagnostic →</span>
            </button>
            <button
              onClick={handleCopyAuditLink}
              title="Copy direct link to diagnostic to send to publishers"
              className="bg-slate-800/80 hover:bg-slate-750 text-slate-200 hover:text-white font-semibold text-xs px-4 py-3.5 rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              {auditCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden lg:inline">{auditCopied ? "Link Copied!" : "Copy Diagnostic Link"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3 Main Tiers Grid - Perfectly formatted with "per journal" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {plans.map((plan) => {
            const price = billingCycle === "annual" ? plan.annualEur : plan.monthlyEur

            return (
              <div 
                key={plan.id}
                className={`relative flex flex-col rounded-3xl bg-white dark:bg-[#15161e] border p-7 sm:p-8 transition-all duration-200 hover:shadow-2xl ${plan.accent} ${
                  plan.isPopular ? "border-[#0b99ff] ring-2 ring-[#0b99ff]/20" : ""
                }`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[11px] font-extrabold tracking-wider uppercase px-4 py-1 rounded-full shadow-md">
                    MOST POPULAR
                  </div>
                )}

                <div className="text-center mb-4">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                    {plan.badge}
                  </div>
                </div>

                {/* Price display with explicit "per journal" */}
                <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-[#1a1b26] border border-slate-100 dark:border-slate-800 text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                      {formatPrice(price)}
                    </span>
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                      /mo
                    </span>
                  </div>
                  <div className="mt-1 text-xs font-semibold text-[#0b99ff]">
                    {plan.priceLabel}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-400">
                    {billingCycle === "annual" 
                      ? `${formatPrice(plan.annualTotalEur)} billed annually per journal` 
                      : "Billed on a monthly basis"}
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
                    Included Features:
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
                  className={`w-full py-5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-md ${
                    plan.isPopular
                      ? "bg-amber-500 hover:bg-amber-600 text-white"
                      : "bg-[#0b99ff] hover:bg-[#0883dc] text-white"
                  }`}
                >
                  <span>{plan.ctaText.toUpperCase()}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>

              </div>
            )
          })}

        </div>
      </section>

      {/* ========================================================================= */}
      {/* PROTECTED PLATFORM SCREENSHOTS & ARCHITECTURE SHOWCASE */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-3xl bg-white dark:bg-[#15161e] border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-2xl">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Lock className="w-3.5 h-3.5" />
                <span>Protected Proprietary Architecture · Executive Preview</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Inside the editorial360 Platform Engine
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Live interface captures demonstrating our AI referee discovery, parallel peer review dispatch, and deep paper-mill image forensics. Sensitive identifiers are masked for partner confidentiality.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAuditModalOpen(true)}
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all whitespace-nowrap"
              >
                <ClipboardList className="w-4 h-4" />
                <span>30-sec Diagnostic</span>
              </button>
              <button
                onClick={() => handleOpenMeetingModal("Live Platform Walkthrough")}
                className="inline-flex items-center gap-2 bg-[#0b99ff] hover:bg-[#0883dc] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all whitespace-nowrap"
              >
                <Laptop className="w-4 h-4" />
                <span>Request Live Sandbox Tour</span>
              </button>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveShowcaseTab("scholar_scout")}
              className={`px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-2 ${
                activeShowcaseTab === "scholar_scout"
                  ? "bg-[#0b99ff] text-white shadow-xs font-bold"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700/60 font-semibold"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>1. ScholarScout™ AI Discovery</span>
            </button>

            <button
              onClick={() => setActiveShowcaseTab("parallel_dispatch")}
              className={`px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-2 ${
                activeShowcaseTab === "parallel_dispatch"
                  ? "bg-[#0b99ff] text-white shadow-xs font-bold"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700/60 font-semibold"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>2. Parallel 4-Referee Dispatch</span>
            </button>

            <button
              onClick={() => setActiveShowcaseTab("paper_mill")}
              className={`px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-2 ${
                activeShowcaseTab === "paper_mill"
                  ? "bg-[#0b99ff] text-white shadow-xs font-bold"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700/60 font-semibold"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>3. Paper Mill & Forensic Defense</span>
            </button>

            <button
              onClick={() => setActiveShowcaseTab("reviewer_wallet")}
              className={`px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-2 ${
                activeShowcaseTab === "reviewer_wallet"
                  ? "bg-[#0b99ff] text-white shadow-xs font-bold"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700/60 font-semibold"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>4. Reviewer Incentive Wallet</span>
            </button>
          </div>

          {/* Interactive Protected Device Mockup Frame - Natural Screenshot Aesthetic */}
          <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f141c] text-slate-900 dark:text-slate-100 overflow-hidden shadow-2xl select-none font-sans">
            
            {/* Top Browser Window Chrome - Link Hidden */}
            <div className="bg-slate-100 dark:bg-[#151a24] border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700 inline-block" />
                <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700 inline-block" />
                <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700 inline-block" />
                <div className="ml-3 px-3 py-1 rounded-md bg-white dark:bg-[#0f141c] border border-slate-200 dark:border-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 shadow-2xs">
                  <Lock className="w-3 h-3 text-emerald-500" />
                  <span>editorial360 Console · Secure Workspace</span>
                </div>
              </div>
              <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-800/80 px-2.5 py-0.5 rounded border border-slate-300/60 dark:border-slate-700/60">
                Institutional Preview
              </div>
            </div>

            {/* In-App Application Navigation Bar - Official SVG Logo */}
            <div className="bg-white dark:bg-[#121722] border-b border-slate-200 dark:border-slate-800 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <img 
                  src="/editorial360.svg" 
                  alt="editorial360" 
                  className="h-6 w-auto object-contain brightness-100 dark:brightness-110" 
                />
                <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  <span>Clinical AI & Digital Health</span>
                  <span className="text-[11px] font-normal text-slate-400">(ISSN 2974-8844)</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Managing Editor Workspace
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-xs hidden sm:inline font-medium">
                  Prof. Dr. Julian Weber
                </span>
              </div>
            </div>

            {/* In-App Manuscript Context Header Bar - Concise */}
            <div className="bg-slate-50 dark:bg-[#161c28] border-b border-slate-200 dark:border-slate-800 px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">MS ID: CAIDH-2026-0842</span>
                  <span>·</span>
                  <span>Clinical AI</span>
                  <span>·</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Under Double-Blind Peer Review</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                  Clinical Validation of Multimodal Foundation Models in Oncological Diagnostic Workflows
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Elena Rostova, M.D. et al. · Charité Berlin, Karolinska Institutet, Stanford
                </p>
              </div>

              <div className="sm:text-right shrink-0 bg-white dark:bg-[#111622] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Review Velocity SLA</span>
                <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-xs">
                  Day 11 of 21 (Avg: 18.2d)
                </span>
              </div>
            </div>

            {/* SCREEN 1: SCHOLARSCOUT AI DISCOVERY - Less Wordy */}
            {activeShowcaseTab === "scholar_scout" && (
              <div className="p-5 sm:p-6 space-y-4 bg-white dark:bg-[#0f141c]">
                
                {/* Search & Semantic Query Bar */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#151b26] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Search className="w-3.5 h-3.5 text-[#0b99ff] shrink-0" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">Semantic Match:</span>
                    <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-[11px]">Multimodal AI</span>
                    <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-[11px]">Radiogenomics</span>
                    <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-[11px]">Clinical Validation</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">1.4M Profiles Filtered</span>
                </div>

                {/* Candidate Referee Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  
                  {/* Candidate 1 */}
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#141924] space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white">Dr. Katrin Varma, Ph.D.</div>
                        <div className="text-[11px] text-slate-500">ETH Zürich · Biosystems</div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                        98.4% Match
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5">
                      <div>h-index: 41 · 127 Publications</div>
                      <div className="text-emerald-600 dark:text-emerald-400 font-medium">✓ Zero COI with Authors</div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Invited 1h ago</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">Verified Reviewer</span>
                    </div>
                  </div>

                  {/* Candidate 2 */}
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#141924] space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white">Prof. Dr. Nobuo Ikeda</div>
                        <div className="text-[11px] text-slate-500">Kyoto University Hospital</div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                        96.2% Match
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5">
                      <div>h-index: 48 · 210 Publications</div>
                      <div className="text-emerald-600 dark:text-emerald-400 font-medium">✓ Conflict of Interest Cleared</div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-[#0b99ff] font-semibold">Accepted</span>
                      <span className="text-slate-500">Review in Progress</span>
                    </div>
                  </div>

                  {/* Candidate 3 */}
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#141924] space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white">Dr. Sarah Al-Mansoor</div>
                        <div className="text-[11px] text-slate-500">Univ. of Cambridge · Radiology</div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                        94.7% Match
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5">
                      <div>h-index: 34 · 88 Publications</div>
                      <div className="text-emerald-600 dark:text-emerald-400 font-medium">✓ Affiliation Verified</div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Eligible</span>
                      <span className="text-[#0b99ff] font-semibold">Ready to Dispatch</span>
                    </div>
                  </div>

                </div>

                <div className="p-2.5 rounded-lg bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-[11px] text-blue-900 dark:text-blue-300 flex items-center justify-between">
                  <span>✦ <strong>Referee Discovery:</strong> Slashes sourcing latency from 14 days down to 4 hours with automated COI checks.</span>
                </div>
              </div>
            )}

            {/* SCREEN 2: PARALLEL DISPATCH MATRIX - Less Wordy */}
            {activeShowcaseTab === "parallel_dispatch" && (
              <div className="p-5 sm:p-6 space-y-4 bg-white dark:bg-[#0f141c]">
                
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">
                    4-Referee Parallel Dispatch Tracking
                  </span>
                  <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded">
                    21-Day SLA (92% On-Time)
                  </span>
                </div>

                {/* Institutional Table Mockup */}
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121722]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 dark:bg-[#161c28] border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                      <tr>
                        <th className="px-3.5 py-2.5 font-semibold">Referee</th>
                        <th className="px-3.5 py-2.5 font-semibold">Affiliation</th>
                        <th className="px-3.5 py-2.5 font-semibold">SLA Timeline</th>
                        <th className="px-3.5 py-2.5 font-semibold">Status</th>
                        <th className="px-3.5 py-2.5 font-semibold">Score</th>
                        <th className="px-3.5 py-2.5 font-semibold text-right">Incentive</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 text-[11px]">
                      <tr>
                        <td className="px-3.5 py-2.5 font-bold text-slate-900 dark:text-white">Referee #1 (Prof. Ikeda)</td>
                        <td className="px-3.5 py-2.5 text-slate-500">Kyoto University</td>
                        <td className="px-3.5 py-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Day 7 of 14</td>
                        <td className="px-3.5 py-2.5"><span className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded font-bold text-[10px]">Report Filed ✓</span></td>
                        <td className="px-3.5 py-2.5 font-medium text-slate-900 dark:text-white">8.8/10 (Minor Rev.)</td>
                        <td className="px-3.5 py-2.5 text-right text-emerald-600 dark:text-emerald-400 font-semibold">+€150 APC Credit</td>
                      </tr>
                      <tr>
                        <td className="px-3.5 py-2.5 font-bold text-slate-900 dark:text-white">Referee #2 (Dr. Varma)</td>
                        <td className="px-3.5 py-2.5 text-slate-500">ETH Zürich</td>
                        <td className="px-3.5 py-2.5 font-mono text-slate-600 dark:text-slate-400">Day 5 of 14</td>
                        <td className="px-3.5 py-2.5"><span className="text-[#0b99ff] bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded font-bold text-[10px]">Evaluating</span></td>
                        <td className="px-3.5 py-2.5 text-slate-500">Remarks Drafted</td>
                        <td className="px-3.5 py-2.5 text-right text-slate-400">Pending Deadline</td>
                      </tr>
                      <tr>
                        <td className="px-3.5 py-2.5 font-bold text-slate-900 dark:text-white">Referee #3 (Dr. Thorne)</td>
                        <td className="px-3.5 py-2.5 text-slate-500">Stanford University</td>
                        <td className="px-3.5 py-2.5 font-mono text-slate-600 dark:text-slate-400">Day 6 of 14</td>
                        <td className="px-3.5 py-2.5"><span className="text-[#0b99ff] bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded font-bold text-[10px]">Evaluating</span></td>
                        <td className="px-3.5 py-2.5 text-slate-500">Under Review</td>
                        <td className="px-3.5 py-2.5 text-right text-slate-400">Pending Deadline</td>
                      </tr>
                      <tr>
                        <td className="px-3.5 py-2.5 font-bold text-slate-900 dark:text-white">Referee #4 (Reserve)</td>
                        <td className="px-3.5 py-2.5 text-slate-500">Univ. of Cambridge</td>
                        <td className="px-3.5 py-2.5 font-mono text-slate-600 dark:text-slate-400">Day 1 of 14</td>
                        <td className="px-3.5 py-2.5"><span className="text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 px-2 py-0.5 rounded font-bold text-[10px]">Accepted</span></td>
                        <td className="px-3.5 py-2.5 text-slate-500">Active Workspace</td>
                        <td className="px-3.5 py-2.5 text-right text-purple-600 dark:text-purple-400">Active SLA</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-[11px] text-emerald-900 dark:text-emerald-300 flex items-center justify-between">
                  <span>✦ <strong>Turnaround Velocity:</strong> Parallel dispatch eliminates reviewer dropouts and cuts turnaround from 90 to 21 days.</span>
                </div>
              </div>
            )}

            {/* SCREEN 3: PAPER MILL DEFENSE - Less Wordy */}
            {activeShowcaseTab === "paper_mill" && (
              <div className="p-5 sm:p-6 space-y-4 bg-white dark:bg-[#0f141c]">
                
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Pre-Publication Integrity & Forensic Screening
                  </span>
                  <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded">
                    Integrity Rating: 99.4% Passed
                  </span>
                </div>

                {/* Forensic Scanners Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#141924] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Figure & Gel Forensics</span>
                      <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded font-bold">Passed</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">8 Figures scanned: Zero cloned bands or spliced lanes detected.</p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#141924] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Synthetic Text Detection</span>
                      <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded font-bold">98.6% Human</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">Authentic perplexity distribution. All 42 cited DOIs verified in Crossref.</p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#141924] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Citation Cartel Check</span>
                      <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded font-bold">0 Cartels</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">Co-authorship graph analyzed. Zero circular citation cartels detected.</p>
                  </div>

                </div>

                <div className="p-2.5 rounded-lg bg-purple-50/80 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 text-[11px] text-purple-900 dark:text-purple-300 flex items-center justify-between">
                  <span>✦ <strong>Reputational Shield:</strong> Protects university presses against paper mill retractions and editorial fraud.</span>
                </div>
              </div>
            )}

            {/* SCREEN 4: REVIEWER WALLET & INCENTIVES - Less Wordy */}
            {activeShowcaseTab === "reviewer_wallet" && (
              <div className="p-5 sm:p-6 space-y-4 bg-white dark:bg-[#0f141c]">
                
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Reviewer Rewards & Settlement Ledger
                  </span>
                  <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded">
                    Referee Acceptance: +64%
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#141924] space-y-2">
                    <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center justify-between">
                      <span>APC Waiver Credit Balance</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">€350.00 Active</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      On-time referees automatically receive cryptographic credit vouchers valid for 24 months across journal portfolio.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#141924] space-y-2">
                    <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center justify-between">
                      <span>CPD & ORCID Recognition</span>
                      <span className="text-[#0b99ff] font-mono font-semibold text-[11px]">Crossref & ORCID Synced</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      Instant generation of accredited CPD certificate with automatic peer review deposit to referee ORCID record.
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-[11px] text-blue-900 dark:text-blue-300 flex items-center justify-between">
                  <span>✦ <strong>Reviewer Loyalty:</strong> Solves peer review fatigue by rewarding referees with tangible, compliant recognition.</span>
                </div>
              </div>
            )}

            {/* Subtle Institutional Watermark Seal */}
            <div className="bg-slate-50 dark:bg-[#121722] border-t border-slate-200 dark:border-slate-800 px-5 py-2.5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono">editorial360™ Enterprise · Confidential Demonstration Preview</span>
              <span className="font-mono">Frankfurt Book Fair 2026 · Scholarly Open Inc.</span>
            </div>

          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
            <span>Confidential Executive Preview · Proprietary Architecture of editorial360</span>
            <span className="font-mono text-[11px] text-slate-400">All data shown is simulated for partner presentation</span>
          </div>

        </div>
      </section>

      {/* Elevate Customization Add-ons */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="rounded-3xl bg-white dark:bg-[#15161e] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Elevate Customization Add-ons
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                High-margin forensic defense and reviewer retention modules (per journal).
              </p>
            </div>

            <div className="text-right sm:border-l sm:border-slate-100 dark:sm:border-slate-800 sm:pl-6">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                Selected Add-Ons Subtotal
              </span>
              <span className="text-2xl font-black text-[#0b99ff]">
                +{formatPrice(selectedAddonsTotalMonthly)}
                <span className="text-xs font-normal text-slate-500">/mo per journal</span>
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
                      Reviewer Incentive Engine
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      Cuts Refusal Rate by 64%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-lg leading-relaxed">
                    Automate APC waiver vouchers, verified CPD certification, and micro-honoraria payouts for referee on-time evaluations.
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
                    addOnReviewerWallet ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
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
                      Paper Mill Defense Layer
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      97%+ Precision
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-lg leading-relaxed">
                    Automated Western blot & microscopy image duplication forensics, email anomaly alerts, and citation cartel screening.
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
                    addOnPapermillDefense ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
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
                    Deploy under your publisher domain (e.g. <code className="text-[#0b99ff]">review.press.oxford.org</code>) with custom institutional email signing.
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
                    addOnWhiteLabel ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    addOnWhiteLabel ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
              </div>
            </div>

          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Prices per journal, annual billing, plus VAT</span>
            <span className="font-mono text-[11px] text-slate-400">Copyright © 2026 | All rights reserved by editorial360</span>
          </div>
        </div>
      </section>

      {/* Publisher ROI & Unit Economics */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white p-8 sm:p-10 shadow-2xl border border-slate-800">
          
          <div className="flex items-center gap-2 text-xs font-bold text-[#0b99ff] uppercase tracking-wider mb-2">
            <Calculator className="w-4 h-4" />
            <span>Interactive Publishing Unit Economics</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Calculate Your Return on Investment vs Legacy EMS
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mb-8 leading-relaxed">
            Legacy providers like ScholarOne and Aries Editorial Manager lock academic societies into €12k–€25k annual contracts per journal.
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
                <div>• Saves approx. <strong className="text-white">{Math.round(roiMetrics.hoursSavedPerYear).toLocaleString()} editorial desk hours</strong> annually across {roiJournals} journals.</div>
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
                  <span className="text-slate-400 block text-[11px]">Legacy EMS ({roiJournals} journals):</span>
                  <span className="font-bold text-slate-200 line-through">
                    {formatPrice(roiMetrics.legacyAnnualTotal)}/yr
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">editorial360 ({roiJournals} journals):</span>
                  <span className="font-bold text-emerald-400">
                    {formatPrice(roiMetrics.editorial360AnnualTotal)}/yr
                  </span>
                </div>
              </div>

              <Button
                onClick={() => handleOpenMeetingModal("Frankfurt Online Executive Demo")}
                className="w-full mt-2 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs py-4 rounded-xl cursor-pointer"
              >
                Schedule Online Executive Demonstration
              </Button>
            </div>

          </div>

        </div>
      </section>

      {/* Floating QR & Diagnostic Quick Launcher Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2.5 items-end">
        <button
          onClick={() => setAuditModalOpen(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-full shadow-2xl border-2 border-white/30 text-xs font-extrabold hover:scale-105 transition-all cursor-pointer group"
          title="Open 30-sec Publisher Diagnostic"
        >
          <ClipboardList className="w-4 h-4" />
          <span className="hidden sm:inline">30-sec Publisher Diagnostic</span>
        </button>

        <button
          onClick={() => setQrModalOpen(true)}
          className="flex items-center gap-2 bg-[#0b99ff] hover:bg-[#0883dc] text-white px-4 py-3 rounded-full shadow-2xl border-2 border-white/30 text-xs font-extrabold hover:scale-105 transition-all cursor-pointer group"
          title="Display Frankfurt Fair QR Code"
        >
          <QrCode className="w-4 h-4" />
          <span className="hidden sm:inline">Show Fair QR Pass</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 30-SEC PUBLISHER WORKFLOW & PAIN POINT DIAGNOSTIC MODAL */}
      {/* ========================================================================= */}
      {auditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#15161e] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setAuditModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!auditSubmitted ? (
              <>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-wider mb-1.5">
                    <ClipboardList className="w-3.5 h-3.5" />
                    <span>30-sec Publisher Diagnostic</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Publisher Workflow & System Difficulties
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Takes only 30 seconds. Identify your real-time bottlenecks and generate an executive benchmarking report.
                  </p>
                </div>

                <form onSubmit={handleSubmitAudit} className="space-y-5 text-left">
                  
                  {/* Q1: Current Legacy System */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span>1. What software do you currently use for peer review?</span>
                    </label>
                    <select
                      value={auditData.currentSystem}
                      onChange={(e) => setAuditData({ ...auditData, currentSystem: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                    >
                      <option>Clarivate ScholarOne Manuscripts</option>
                      <option>Aries Editorial Manager (EM)</option>
                      <option>PKP Open Journal Systems (OJS)</option>
                      <option>Janeway / Ubiquity Press</option>
                      <option>Scholastica</option>
                      <option>Manual Email & Word / Shared Drive</option>
                      <option>In-House Proprietary System</option>
                      <option>Launching New Journal / None Yet</option>
                    </select>
                  </div>

                  {/* Q2: Current Turnaround Time */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span>2. Average peer review turnaround time from submission to first decision:</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        "Under 30 Days",
                        "30 to 60 Days",
                        "60 to 90 Days",
                        "90 to 120+ Days"
                      ].map((tOption) => (
                        <button
                          type="button"
                          key={tOption}
                          onClick={() => setAuditData({ ...auditData, turnaroundTime: tOption })}
                          className={`p-2.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer text-center ${
                            auditData.turnaroundTime === tOption
                              ? "bg-[#0b99ff] text-white border-[#0b99ff] shadow-xs"
                              : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-750 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          {tOption}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Q3: Specific Real-Time Difficulties (Checkboxes) */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      3. Select your primary real-time difficulties & frustrations (Select all that apply):
                    </label>
                    
                    <div className="space-y-2">
                      {[
                        "Reviewer fatigue & high decline rates (>60% invitations rejected)",
                        "Paper-mill threats, fabricated peer reviews & altered Western blot/figure images",
                        "Antiquated 2000s interface causing author dropouts & editor frustration",
                        "High annual software licensing & maintenance costs (€12k–€25k+/yr)",
                        "Lack of automated reviewer honoraria, APC waiver credits & verified CPD rewards",
                        "Manual manuscript tracking & missed reviewer reminder follow-ups",
                        "Slow technical support & rigid, expensive customization workflows"
                      ].map((diff) => {
                        const isChecked = auditData.difficulties.includes(diff)
                        return (
                          <div
                            key={diff}
                            onClick={() => handleToggleDifficulty(diff)}
                            className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                              isChecked
                                ? "bg-[#0b99ff]/5 border-[#0b99ff]/40 dark:bg-[#0b99ff]/10"
                                : "bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}} // handled by parent div
                              className="mt-0.5 rounded text-[#0b99ff] focus:ring-[#0b99ff] cursor-pointer"
                            />
                            <span className="text-xs text-slate-700 dark:text-slate-300 leading-snug">
                              {diff}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Q4: Key Switch Trigger */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      4. What single feature or factor would make you consider switching platforms?
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 21-day review cycle, automated referee matching, paper-mill fraud detection, or 60% lower cost"
                      value={auditData.keySwitchFeature}
                      onChange={(e) => setAuditData({ ...auditData, keySwitchFeature: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                    />
                  </div>

                  {/* Q5: Executive Contact Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Your Name *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Dr. Julian Weber"
                        value={auditData.name}
                        onChange={(e) => setAuditData({ ...auditData, name: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Work Email *
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="j.weber@universitypress.org"
                        value={auditData.email}
                        onChange={(e) => setAuditData({ ...auditData, email: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        University Press / Organization *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Oxford Academic Press"
                        value={auditData.organization}
                        onChange={(e) => setAuditData({ ...auditData, organization: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Portfolio Scale
                      </label>
                      <select
                        value={auditData.journalCount}
                        onChange={(e) => setAuditData({ ...auditData, journalCount: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                      >
                        <option>1 Journal (Independent)</option>
                        <option>2–5 Journals (University Press / Society)</option>
                        <option>6–15 Journals (Multi-Journal Publisher)</option>
                        <option>15+ Journals (Consortium / Commercial)</option>
                      </select>
                    </div>
                  </div>

                  {auditError && (
                    <p className="text-xs text-rose-500 font-medium">{auditError}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={submittingAudit}
                    className="w-full py-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md cursor-pointer transition-all"
                  >
                    {submittingAudit ? "Analyzing & Generating Executive Report..." : "Submit 30-sec Diagnostic & Generate Instant Report →"}
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center py-6 space-y-5">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    30-sec Diagnostic Recorded & Analyzed
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                    Thank you, {auditData.name || "Colleague"}. Your responses have been securely delivered and processed.
                  </p>
                </div>

                {/* Instant Diagnostic Scorecard */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Current Platform:</span>
                    <span className="text-xs font-black text-rose-500">{auditData.currentSystem}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Current Turnaround:</span>
                    <span className="text-xs font-bold text-amber-500">{auditData.turnaroundTime}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">editorial360 Projected Speed:</span>
                    <span className="text-xs font-black text-emerald-500">21 Days SLA (72% Faster)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Identified Bottlenecks:</span>
                    <span className="text-xs font-bold text-[#0b99ff]">{auditData.difficulties.length} Critical Areas Addressed</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                  <Button
                    onClick={() => {
                      setAuditModalOpen(false)
                      handleOpenMeetingModal("Audit Follow-up Review")
                    }}
                    className="bg-[#0b99ff] hover:bg-[#0883dc] text-white text-xs font-bold py-5 px-6 rounded-xl cursor-pointer"
                  >
                    Schedule Online Walkthrough Based on This Audit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setAuditModalOpen(false)}
                    className="text-xs font-bold py-5 px-6 rounded-xl cursor-pointer"
                  >
                    Close & Return to Pricing
                  </Button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Frankfurt Meeting Request Modal (Online Only) */}
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
                    Online Executive Demonstration & Briefing
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Schedule Online Session on {selectedPlanForModal}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Connect directly via Zoom / Google Meet / Teams. An executive will confirm your calendar link shortly.
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
                        Online Meeting Format *
                      </label>
                      <select
                        value={formData.meetingSlot}
                        onChange={(e) => setFormData({ ...formData, meetingSlot: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                      >
                        <option>Online Executive Briefing (Zoom / Google Meet)</option>
                        <option>Interactive Online Live Platform Demo (Microsoft Teams)</option>
                        <option>Immediate 30-Day Sandbox Access & Private Trial</option>
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

                  {meetingError && (
                    <p className="text-xs text-rose-500 font-medium">{meetingError}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={submittingMeeting}
                    className="w-full py-5 rounded-xl bg-[#0b99ff] hover:bg-[#0883dc] text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    {submittingMeeting ? "Confirming Online Session..." : "Confirm Online Meeting / Request Access"}
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
                    Online Session Requested & Logged
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    Thank you, {formData.name || "Colleague"}. Your request for an online session ({formData.meetingSlot}) has been securely logged. An executive will confirm your calendar link shortly.
                  </p>
                </div>
                <Button
                  onClick={() => setMeetingModalOpen(false)}
                  className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 px-6 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Return to Overview
                </Button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Global QR Code Pass Modal */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#15161e] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl text-center space-y-5">
            <button
              onClick={() => setQrModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0b99ff] bg-[#0b99ff]/10 px-2.5 py-0.5 rounded-full border border-[#0b99ff]/20 inline-block mb-1">
                Frankfurt Book Fair 2026 · VIP Delegate Pass
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                editorial360 QR Code
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                Scan with any mobile camera to immediately review pricing and schedule an online executive briefing.
              </p>
            </div>

            {/* High-Resolution QR Card Frame */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-md inline-block max-w-[280px] mx-auto">
              <img 
                src="/qr-editorial360-pricing.png" 
                alt="editorial360 Frankfurt Fair 2026 QR Code" 
                className="w-64 h-64 mx-auto object-contain select-none"
              />
              <div className="mt-2 text-[10px] font-mono font-bold text-slate-500 break-all select-all">
                editorial360/pricing?code=FRANKFURT2026
              </div>
            </div>

            {/* Action Buttons: Copy, Download, Share */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="w-full py-4 text-xs font-bold border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  {linkCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" />
                      <span className="text-emerald-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1" />
                      <span>Copy Link</span>
                    </>
                  )}
                </Button>

                <a
                  href="/qr-editorial360-pricing.png"
                  download="editorial360-frankfurt-fair-qr.png"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save PNG</span>
                </a>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent("Review editorial360™ Institutional Pricing & Schedule Online Executive Meeting: " + vipUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`mailto:info@scholarlyopen.org?subject=${encodeURIComponent("editorial360™ Institutional Pricing & Online Demo Inquiry")}&body=${encodeURIComponent("Dear Scholarly Open Team,\n\nI would like to schedule an online executive briefing regarding editorial360™.\n\nLink: " + vipUrl)}`}
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-[#0b99ff] hover:bg-[#0883dc] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Direct Email</span>
                </a>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Auto-unlocks with pre-loaded code: <strong className="text-slate-700 dark:text-slate-200 font-mono">FRANKFURT2026</strong>
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f1017] py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/editorial360.svg" alt="editorial360" className="h-5 w-auto object-contain" />
            <span>&copy; {new Date().getFullYear()} Scholarly Open Inc. All rights reserved by editorial360.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-400">Executive Partner Briefings · Online Sessions</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
