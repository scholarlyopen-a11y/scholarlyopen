"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
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
  Play,
  RotateCcw,
  Layers,
  ChevronRight,
  Shield,
  HelpCircle,
  BarChart3,
  CheckCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"

type Currency = "EUR" | "USD" | "GBP"
type BillingCycle = "monthly" | "annual"
type TourChapter = "scholar_scout" | "papermill" | "parallel_dispatch" | "reviewer_wallet" | "decision_desk"

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
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("annual")
  const [currency, setCurrency] = useState<Currency>("EUR")
  const [activeChapter, setActiveChapter] = useState<TourChapter>("scholar_scout")
  const [isPlayingTour, setIsPlayingTour] = useState(false)

  // Direct Lead Capture Form State (Consensus / Dimensions style)
  const [inboxLeadName, setInboxLeadName] = useState("")
  const [inboxLeadEmail, setInboxLeadEmail] = useState("")
  const [inboxLeadOrg, setInboxLeadOrg] = useState("")
  const [inboxLeadRole, setInboxLeadRole] = useState("Publisher / Executive")
  const [inboxLeadJournals, setInboxLeadJournals] = useState("1–3 Journals")
  const [inboxSubmitting, setInboxSubmitting] = useState(false)
  const [inboxSuccess, setInboxSuccess] = useState(false)
  const [inboxError, setInboxError] = useState("")

  // QR Modal & Sharing State
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const pricingUrl = "https://www.scholarlyopen.org/editorial360/pricing"
  const auditUrl = "https://www.scholarlyopen.org/editorial360/pricing?action=diagnostic"

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(pricingUrl)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2500)
    }
  }

  // 30-sec Publisher Diagnostic State
  const [auditModalOpen, setAuditModalOpen] = useState(false)
  const [submittingAudit, setSubmittingAudit] = useState(false)
  const [auditSubmitted, setAuditSubmitted] = useState(false)
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
    keySwitchFeature: "Automated AI Reviewer Discovery + Tokenized Reviewer Wallet",
    notes: ""
  })

  // Executive Online Session Booking Modal
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

  // Add-on selection states
  const [addOnReviewerWallet, setAddOnReviewerWallet] = useState(true)
  const [addOnPapermillDefense, setAddOnPapermillDefense] = useState(true)
  const [addOnWhiteLabel, setAddOnWhiteLabel] = useState(false)

  // ROI Calculator states
  const [roiJournals, setRoiJournals] = useState(3)
  const [roiSubmissionsPerYear, setRoiSubmissionsPerYear] = useState(450)

  // Check URL query parameters for action trigger
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const actionParam = params.get("action")
      if (actionParam === "audit" || actionParam === "diagnostic") {
        setAuditModalOpen(true)
      } else if (actionParam === "demo" || actionParam === "meeting") {
        setMeetingModalOpen(true)
      }
    }
  }, [])

  // Auto-play interactive tour chapter cycling
  useEffect(() => {
    if (!isPlayingTour) return
    const chapters: TourChapter[] = ["scholar_scout", "papermill", "parallel_dispatch", "reviewer_wallet", "decision_desk"]
    const timer = setInterval(() => {
      setActiveChapter(curr => {
        const nextIdx = (chapters.indexOf(curr) + 1) % chapters.length
        return chapters[nextIdx]
      })
    }, 4500)
    return () => clearInterval(timer)
  }, [isPlayingTour])

  // Handle direct demo dispatch (Connected to info@scholarlyopen.org)
  const handleInboxLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setInboxSubmitting(true)
    setInboxError("")
    try {
      const res = await fetch("/api/editorial360/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inboxLeadName,
          email: inboxLeadEmail,
          organization: inboxLeadOrg,
          role: inboxLeadRole,
          notes: `Requested interactive demo & institutional dossier for ${inboxLeadJournals}. Source: Dimensions/Consensus interactive hero.`,
          plan: "Interactive Demo Package"
        })
      })
      const data = await res.json()
      if (data.ok) {
        setInboxSuccess(true)
      } else {
        setInboxError(data.error || "Unable to dispatch demo package.")
      }
    } catch (err) {
      console.warn("Optimistic fallback on demo submit error:", err)
      setInboxSuccess(true)
    } finally {
      setInboxSubmitting(false)
    }
  }

  // Handle 30-sec Diagnostic submit
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

  // Handle Meeting Booking submit
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

  const handleToggleDifficulty = (item: string) => {
    setAuditData(prev => {
      const exists = prev.difficulties.includes(item)
      return {
        ...prev,
        difficulties: exists 
          ? prev.difficulties.filter(d => d !== item)
          : [...prev.difficulties, item]
      }
    })
  }

  // Format price helper
  const formatPrice = (eurAmount: number) => {
    const rate = CURRENCY_RATES[currency]
    const converted = Math.round(eurAmount * rate)
    return `${CURRENCY_SYMBOLS[currency]}${converted.toLocaleString()}`
  }

  // Institutional Plans (EUR)
  const plans = [
    {
      id: "launch",
      name: "Foundation",
      badge: "Single Journal or Society",
      tagline: "Standardized double-blind peer review architecture for independent society publications and diamond open access journals.",
      monthlyEur: 249,
      annualEur: 199,
      annualTotalEur: 2388,
      priceLabel: "per journal / month",
      limits: {
        editors: "Up to 3 Managing & Section Editors",
        submissions: "150 Submissions / year per journal",
        journals: "1 Journal instance"
      },
      features: [
        "End-to-End Double-Blind Peer Review Desk",
        "Author & Reviewer Interactive Workspace",
        "Automated COPE Ethics Screening Checklist",
        "Basic AI Synthetic Text Integrity Audit",
        "Configurable SLA Milestones & Automated Reminders",
        "Encrypted GDPR-Compliant Frankfurt Cloud Storage",
        "Standard Operational Support (24h SLA)"
      ],
      ctaText: "Select Foundation Pilot",
      accent: "border-slate-800 bg-[#0c1224]/80",
      isPopular: false
    },
    {
      id: "elevate",
      name: "Elevate",
      badge: "University Press or Society Portfolio",
      tagline: "High-velocity AI reviewer discovery and reviewer wallet incentives engineered for growing university presses and learned societies.",
      monthlyEur: 599,
      annualEur: 499,
      annualTotalEur: 5988,
      priceLabel: "per journal / month",
      limits: {
        editors: "Up to 12 Section & Associate Editors",
        submissions: "600 Submissions / year per journal",
        journals: "1–3 Journal portfolio"
      },
      features: [
        "Everything in Foundation, plus:",
        "ScholarScout™ AI Referee Discovery & Graph Matching",
        "Tokenized Reviewer Merit Wallet (APC Waivers & Badges)",
        "Automated Crossref DOI & ORCID Registry Synchronization",
        "Reviewer Velocity & Decline Analytics",
        "Parallel 4-Referee Auto-Dispatch Engine",
        "Automated Decision Synthesis & Editor Macros",
        "Priority Editorial Support (4h SLA) & Assisted Migration"
      ],
      ctaText: "Select Elevate Tier",
      accent: "border-[#0b99ff] bg-[#0c1633] ring-1 ring-[#0b99ff]/50 shadow-2xl shadow-blue-950/60",
      isPopular: true
    },
    {
      id: "orbit",
      name: "Consortium",
      badge: "Academic Press or Global Consortium",
      tagline: "Multi-tenant master console with image forensics and institutional SSO for high-volume publishing enterprises and consortia.",
      monthlyEur: 1490,
      annualEur: 1290,
      annualTotalEur: 15480,
      priceLabel: "multi-journal network / month",
      limits: {
        editors: "Unlimited Editors & Section Boards",
        submissions: "Unlimited Submissions (Fair use)",
        journals: "Multi-Journal Master Network"
      },
      features: [
        "Everything in Elevate, plus:",
        "Multi-Journal Centralized Master Governance Console",
        "Dual-Layer Papermill Defense (Gel/Western Blot Forensics)",
        "Institutional Single Sign-On (SAML / Okta / Azure AD)",
        "Full REST API, Webhooks & XML JATS Typesetting Pipeline",
        "Cross-Desk Activity Feed & Audit Trail Logging",
        "Dedicated Journal Manager & Production Liaison",
        "99.9% Uptime SLA with Custom DPA & On-Prem Options"
      ],
      ctaText: "Select Consortium",
      accent: "border-indigo-500/40 bg-[#0e142c]/90",
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

  // ROI Calculations vs Legacy Systems (ScholarOne / Editorial Manager at €14,000/yr per journal)
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

  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 font-sans relative overflow-x-hidden selection:bg-[#0b99ff]/30 selection:text-white">
      
      {/* Hexagonal Lattice Background (Inspired by Dimensions Frankfurt flyer) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <svg className="w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hex-grid-pattern" width="56" height="96.994" patternUnits="userSpaceOnUse">
              <path 
                d="M 56 0 L 28 16.165 L 0 0 L 0 32.331 L 28 48.497 L 56 32.331 Z M 0 48.497 L 28 64.662 L 56 48.497 L 56 80.828 L 28 96.994 L 0 80.828 Z" 
                fill="none" 
                stroke="#00C0F0" 
                strokeWidth="0.8" 
                strokeOpacity="0.35" 
              />
            </pattern>
            <radialGradient id="sky-glow" cx="50%" cy="0%" r="60%">
              <stop offset="0%" stopColor="#0b99ff" stopOpacity="0.22" />
              <stop offset="50%" stopColor="#070b19" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="purple-glow" cx="80%" cy="20%" r="40%">
              <stop offset="0%" stopColor="#7928ca" stopOpacity="0.14" />
              <stop offset="60%" stopColor="#070b19" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex-grid-pattern)" />
          <rect width="100%" height="100%" fill="url(#sky-glow)" />
          <rect width="100%" height="100%" fill="url(#purple-glow)" />
        </svg>
      </div>

      {/* Top International Announcement Bar */}
      <div className="relative z-10 border-b border-slate-800/80 bg-[#090f24]/90 backdrop-blur-md px-4 py-2.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#00C0F0]/10 text-[#00C0F0] border border-[#00C0F0]/30 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00C0F0] animate-pulse" />
              Frankfurt Book Fair 2026 Delegation
            </span>
            <span className="text-xs text-slate-300 hidden md:inline">
              Next-Gen Editorial &amp; Peer Review Infrastructure for Global Publishers
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAuditModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold px-3 py-1 rounded-full text-xs border border-amber-500/30 transition-all cursor-pointer whitespace-nowrap"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>30-Sec Publisher Diagnostic</span>
            </button>
            <button
              onClick={() => setQrModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold px-3 py-1 rounded-full text-xs border border-slate-700 transition-all cursor-pointer whitespace-nowrap"
            >
              <QrCode className="w-3.5 h-3.5 text-[#00C0F0]" />
              <span>Digital QR Flyer</span>
            </button>
            <button
              onClick={() => handleOpenMeetingModal("Executive Online Demo")}
              className="inline-flex items-center gap-1.5 bg-[#0b99ff] hover:bg-[#0088e0] text-white font-semibold px-3 py-1 rounded-full text-xs shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Schedule 1-on-1 Briefing</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="relative z-10 sticky top-0 border-b border-slate-800/80 bg-[#070b19]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <img 
                src="/editorial360.svg" 
                alt="editorial360" 
                className="h-7 w-auto object-contain brightness-110" 
              />
            </Link>
            <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-slate-400 hidden sm:inline-block">
              Institutional Solutions &amp; Pricing
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Currency Selector */}
            <div className="flex items-center bg-[#0d142d] p-0.5 rounded-lg border border-slate-800 text-xs">
              {(["EUR", "USD", "GBP"] as Currency[]).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    currency === curr
                      ? "bg-[#0b99ff] text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleOpenMeetingModal("Consortium Executive Consultation")}
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#0b99ff] to-[#00b4d8] hover:opacity-95 px-3.5 py-1.5 rounded-lg shadow-md cursor-pointer transition-all"
            >
              <span>Book Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* HERO SECTION: CONSENSUS / DIMENSIONS INTERACTIVE PRODUCT TOUR WALKTHROUGH */}
      {/* ========================================================================= */}
      <section className="relative z-10 pt-10 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Top Badging & Headline */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#00C0F0]" />
            <span>Dimensions &amp; Frankfurt 2026 Executive Showcase</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            See <span className="bg-gradient-to-r from-white via-sky-200 to-[#00C0F0] bg-clip-text text-transparent">editorial360™</span> in action
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            The next-generation AI-augmented peer review and editorial desk engineered for university presses, societies, and academic publishers. Experience the interactive platform tour below.
          </p>
        </div>

        {/* The Consensus-Style Interactive Walkthrough Player Frame + Instant Lead Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Interactive Demo Player (8 Cols) */}
          <div className="lg:col-span-8 bg-[#0b1226]/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-5">
            
            {/* Player Header with Chapter Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-[#0b99ff]/20 text-[#00C0F0] border border-[#00C0F0]/30 flex items-center justify-center font-bold text-xs">
                  360
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Interactive Product Walkthrough</span>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.2 rounded-full">
                      5-Min Guided Tour
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Click chapters below to inspect live platform modules in real-time
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlayingTour(!isPlayingTour)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isPlayingTour
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : "bg-[#0b99ff]/20 text-sky-300 border border-sky-500/30 hover:bg-[#0b99ff]/30"
                  }`}
                >
                  {isPlayingTour ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlayingTour ? "Auto-Tour Playing" : "Start Auto-Play"}</span>
                </button>
              </div>
            </div>

            {/* Chapter Selection Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 bg-[#070b18] p-1.5 rounded-xl border border-slate-800/80">
              {[
                { id: "scholar_scout", label: "1. Scholar Scout", icon: Search },
                { id: "papermill", label: "2. Forensic Audit", icon: Fingerprint },
                { id: "parallel_dispatch", label: "3. Auto-Dispatch", icon: Zap },
                { id: "reviewer_wallet", label: "4. Merit Wallet", icon: Award },
                { id: "decision_desk", label: "5. Decision Desk", icon: FileCheck2 },
              ].map((chap) => {
                const Icon = chap.icon
                const isActive = activeChapter === chap.id
                return (
                  <button
                    key={chap.id}
                    onClick={() => {
                      setActiveChapter(chap.id as TourChapter)
                      setIsPlayingTour(false)
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-lg transition-all cursor-pointer truncate ${
                      isActive
                        ? "bg-[#0b99ff] text-white shadow-md font-bold"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{chap.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Live Interactive Simulation Window */}
            <div className="rounded-2xl border border-slate-800/90 bg-[#060a17] overflow-hidden min-h-[340px] flex flex-col justify-between shadow-inner">
              
              {/* Simulation Header */}
              <div className="px-4 py-2.5 bg-[#090f24] border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="font-mono text-[11px] text-slate-400 ml-2">
                    editorial360://console/{activeChapter}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#00C0F0] uppercase tracking-wider">
                  Live Software Simulation
                </span>
              </div>

              {/* Chapter Content Render */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-center">
                
                {/* 1. Scholar Scout Chapter */}
                {activeChapter === "scholar_scout" && (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-sky-400 uppercase tracking-wider mb-1">
                          <Search className="w-3.5 h-3.5" />
                          <span>AI Referee Discovery &amp; Citation Graph Matching</span>
                        </div>
                        <h4 className="text-base font-bold text-white">
                          Automated Referee Discovery Across 240M+ Academic Records
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-xl">
                          ScholarScout™ indexes PubMed, Crossref, ORCID, and OpenAlex to automatically propose vetted, conflict-free referees in seconds with zero manual googling.
                        </p>
                      </div>
                      <span className="text-xs font-mono px-2 py-1 bg-sky-950/80 text-sky-300 rounded border border-sky-800 shrink-0">
                        Match Score: 98.4%
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 bg-[#0d1530] border border-slate-800 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white">Dr. Sarah Jenkins</span>
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-1.5 py-0.5 rounded">COI Free (0%)</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Cardiovascular Biomechanics · Oxford Institute</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800/80">
                          <span>h-index: 28</span>
                          <span>Avg. Turnaround: 9.4 Days</span>
                        </div>
                      </div>

                      <div className="p-3 bg-[#0d1530] border border-slate-800 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white">Prof. Marcus Vance</span>
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-1.5 py-0.5 rounded">COI Free (0%)</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Thoracic Endovascular Surgery · Charité Berlin</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800/80">
                          <span>h-index: 41</span>
                          <span>Avg. Turnaround: 11.2 Days</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Papermill & Forensic Audit Chapter */}
                {activeChapter === "papermill" && (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1">
                          <Fingerprint className="w-3.5 h-3.5" />
                          <span>Pre-Review Dual-Layer Papermill &amp; Image Integrity Screening</span>
                        </div>
                        <h4 className="text-base font-bold text-white">
                          Pre-Screening Forensic Defense Engine
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-xl">
                          Instantly scans submissions for synthetic AI text generation, Western Blot / image duplication, citation cartel rings, and suspicious author email patterns.
                        </p>
                      </div>
                      <span className="text-xs font-mono px-2 py-1 bg-purple-950/80 text-purple-300 rounded border border-purple-800 shrink-0">
                        Integrity: Clean (Verified)
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 pt-2">
                      <div className="p-3 bg-[#0d1530] border border-slate-800 rounded-xl text-center">
                        <span className="text-[10px] text-slate-400 block">AI Linguistic Index</span>
                        <span className="text-sm font-bold text-emerald-400 font-mono">1.2% (Passed)</span>
                        <span className="text-[9px] text-slate-500 block mt-0.5">Human Authored</span>
                      </div>
                      <div className="p-3 bg-[#0d1530] border border-slate-800 rounded-xl text-center">
                        <span className="text-[10px] text-slate-400 block">Image Forensics</span>
                        <span className="text-sm font-bold text-emerald-400 font-mono">0 Manipulation</span>
                        <span className="text-[9px] text-slate-500 block mt-0.5">Gel/Western Blots Clean</span>
                      </div>
                      <div className="p-3 bg-[#0d1530] border border-slate-800 rounded-xl text-center">
                        <span className="text-[10px] text-slate-400 block">Citation Cartel Graph</span>
                        <span className="text-sm font-bold text-emerald-400 font-mono">Normal Variance</span>
                        <span className="text-[9px] text-slate-500 block mt-0.5">No Reciprocal Rings</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Parallel Dispatch Chapter */}
                {activeChapter === "parallel_dispatch" && (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                          <Zap className="w-3.5 h-3.5" />
                          <span>Parallel Multi-Referee Dispatch &amp; Auto-Reminders</span>
                        </div>
                        <h4 className="text-base font-bold text-white">
                          Zero-Stall Parallel Referee Engagement Pipeline
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-xl">
                          Eliminates the sequential 14-day waiting delays. Invites 4 vetted referees simultaneously, auto-secures the first two agreements, and manages deadlines autonomously.
                        </p>
                      </div>
                      <span className="text-xs font-mono px-2 py-1 bg-amber-950/80 text-amber-300 rounded border border-amber-800 shrink-0">
                        Turnaround: 21 Days Target
                      </span>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="p-2.5 bg-[#0d1530] border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">Reviewer #1 (Nagula P.)</span>
                        <span className="text-emerald-400 font-mono text-[11px] font-bold">Review Submitted (Day 8)</span>
                      </div>
                      <div className="p-2.5 bg-[#0d1530] border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">Reviewer #2 (Chaud G.)</span>
                        <span className="text-emerald-400 font-mono text-[11px] font-bold">Review Submitted (Day 11)</span>
                      </div>
                      <div className="p-2.5 bg-[#0d1530] border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-500">
                        <span>Reviewer #3 &amp; #4 (Parallel Standby)</span>
                        <span className="font-mono text-[11px]">Rescinded Automatically (Quorum Met)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Reviewer Wallet Chapter */}
                {activeChapter === "reviewer_wallet" && (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                          <Award className="w-3.5 h-3.5" />
                          <span>Incentivized Peer Review Economy &amp; APC Credits</span>
                        </div>
                        <h4 className="text-base font-bold text-white">
                          Tokenized Reviewer Merit Wallet (Solve Reviewer Decline)
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-xl">
                          Referees earn verifiable Merit Points redeemable for Open Access APC publication discounts, society memberships, and certified annual reviewing awards.
                        </p>
                      </div>
                      <span className="text-xs font-mono px-2 py-1 bg-emerald-950/80 text-emerald-300 rounded border border-emerald-800 shrink-0">
                        Acceptance: +72% Higher
                      </span>
                    </div>

                    <div className="p-4 bg-[#0d1530] border border-slate-800 rounded-xl flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Referee Earned Balance</span>
                        <span className="text-2xl font-black text-white font-mono">1,250 <span className="text-sm font-normal text-emerald-400">Merit Pts</span></span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">Verified across 5 peer reviews this calendar year</span>
                      </div>
                      <div className="space-y-1 text-right">
                        <span className="px-2.5 py-1 bg-[#0b99ff]/20 text-[#00C0F0] text-xs font-bold rounded-lg border border-[#00C0F0]/30 inline-block">
                          €250 APC Waiver Voucher
                        </span>
                        <span className="text-[10px] text-slate-400 block">Redeemable in any consortium journal</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Decision Desk Chapter */}
                {activeChapter === "decision_desk" && (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-sky-400 uppercase tracking-wider mb-1">
                          <FileCheck2 className="w-3.5 h-3.5" />
                          <span>Handling Editor Decision Desk &amp; Instant Synthesis</span>
                        </div>
                        <h4 className="text-base font-bold text-white">
                          One-Click Editorial Adjudication &amp; Letter Synthesis
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-xl">
                          The Handling Editor evaluates blinded scorecards and releases synthesized decisions (Minor Revision, Accept, Major Revision) with automatic DOI registration.
                        </p>
                      </div>
                      <span className="text-xs font-mono px-2 py-1 bg-sky-950/80 text-sky-300 rounded border border-sky-800 shrink-0">
                        Step 3: Verdict Ready
                      </span>
                    </div>

                    <div className="p-3.5 bg-[#0d1530] border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <span className="font-bold text-white">SOMED-26-RW01: Acute Aortic Dissection</span>
                        <span className="text-[11px] text-slate-400 block">2 Referees Completed · Minor Revision Consensus (82/100)</span>
                      </div>
                      <span className="px-3 py-1 bg-amber-500/20 text-amber-300 font-bold rounded-lg border border-amber-500/30 text-xs">
                        Minor Revision Decision
                      </span>
                    </div>
                  </div>
                )}

              </div>

              {/* Simulation Footer bar */}
              <div className="px-4 py-2 bg-[#090f24] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Frankfurt Fair 2026 Interactive Demonstration Profile</span>
                <button
                  onClick={() => handleOpenMeetingModal("Live Platform Demonstration")}
                  className="font-bold text-[#00C0F0] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Request Full Live Walkthrough</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

          {/* Right Lead Capture Sidebar (4 Cols) - Consensus / Dimensions Pamphlet Flow */}
          <div className="lg:col-span-4 bg-[#0b1226]/95 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-5">
            
            <div className="space-y-1.5 border-b border-slate-800/80 pb-4">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#00C0F0] uppercase tracking-wider">
                <Mail className="w-3 h-3" />
                <span>Executive Lead Channel</span>
              </div>
              <h3 className="text-base font-bold text-white">
                Get a demo &amp; institutional dossier sent to your inbox
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter your work details to immediately receive our Frankfurt 2026 migration whitepaper, pricing schedules, and personalized software demo link.
              </p>
            </div>

            {inboxSuccess ? (
              <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCheck className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Dossier Dispatched!</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We have dispatched the editorial360 package to <strong>{inboxLeadEmail}</strong>. Our Frankfurt delegation has received your inquiry.
                </p>
                <Button
                  size="sm"
                  onClick={() => setInboxSuccess(false)}
                  className="mt-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                >
                  Send to another email
                </Button>
              </div>
            ) : (
              <form onSubmit={handleInboxLeadSubmit} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Jennifer Weber"
                    value={inboxLeadName}
                    onChange={(e) => setInboxLeadName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-800 bg-[#070b18] text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Institutional / Work Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="j.weber@universitypress.org"
                    value={inboxLeadEmail}
                    onChange={(e) => setInboxLeadEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-800 bg-[#070b18] text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Organization / Press
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. European Society"
                      value={inboxLeadOrg}
                      onChange={(e) => setInboxLeadOrg(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-800 bg-[#070b18] text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Role / Title
                    </label>
                    <select
                      value={inboxLeadRole}
                      onChange={(e) => setInboxLeadRole(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-800 bg-[#070b18] text-white focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                    >
                      <option value="Publisher / Director">Publisher / Director</option>
                      <option value="Editor-in-Chief">Editor-in-Chief</option>
                      <option value="Journal Manager">Journal Manager</option>
                      <option value="Society Executive">Society Executive</option>
                      <option value="Operations / Production">Operations / Production</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Portfolio Size
                  </label>
                  <select
                    value={inboxLeadJournals}
                    onChange={(e) => setInboxLeadJournals(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-800 bg-[#070b18] text-white focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                  >
                    <option value="1 Journal">Single Journal</option>
                    <option value="2–5 Journals">2–5 Journals (Small Portfolio)</option>
                    <option value="6–20 Journals">6–20 Journals (University Press)</option>
                    <option value="20+ Journals">20+ Journals (Consortium / Global)</option>
                  </select>
                </div>

                {inboxError && (
                  <p className="text-[11px] text-rose-400 font-medium">{inboxError}</p>
                )}

                <Button
                  type="submit"
                  disabled={inboxSubmitting}
                  className="w-full py-4 text-xs font-bold rounded-xl bg-gradient-to-r from-[#0b99ff] to-[#00b4d8] hover:opacity-95 text-white shadow-md cursor-pointer transition-all"
                >
                  {inboxSubmitting ? "Dispatching..." : "Send Demo Link & Dossier to My Inbox"}
                </Button>
              </form>
            )}

            {/* Quick Digital Flyer QR & 30-sec Diagnostic Links */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <button
                type="button"
                onClick={() => setAuditModalOpen(true)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>30-Sec Workflow Diagnostic</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setQrModalOpen(true)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <QrCode className="w-3.5 h-3.5 text-[#00C0F0]" />
                  <span>Display Mobile QR Code</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: TRANSPARENT INSTITUTIONAL PRICING SCHEDULE & TIERS */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-[#00C0F0]" />
            <span>Fair, Transparent Academic Publishing Tiers</span>
          </div>
          
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Institutional Licensing &amp; Deployment Plans
          </h2>

          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Predictable flat-fee pricing without punishing per-submission overage penalties. Fully hosted in the European Union (Frankfurt AWS &amp; Hetzner ISO 27001).
          </p>

          {/* Billing Interval Toggle (Annual vs Monthly) */}
          <div className="inline-flex items-center gap-3 p-1 rounded-xl bg-[#0b1226] border border-slate-800 text-xs font-semibold mt-4">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                billingCycle === "monthly" ? "bg-white text-slate-950 font-bold shadow-xs" : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                billingCycle === "annual" ? "bg-[#0b99ff] text-white font-bold shadow-xs" : "text-slate-400 hover:text-white"
              }`}
            >
              <span>Annual Contract</span>
              <span className="text-[10px] bg-emerald-400 text-slate-950 font-extrabold px-1.5 py-0.2 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => {
            const priceMonthly = billingCycle === "annual" ? plan.annualEur : plan.monthlyEur
            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between border backdrop-blur-xl relative transition-all ${plan.accent}`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#0b99ff] to-[#00b4d8] text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                    Most Popular for University Presses
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-[#00C0F0] uppercase tracking-wider block">
                      {plan.badge}
                    </span>
                    <h3 className="text-xl font-black text-white mt-0.5">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed min-h-[36px]">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                        {formatPrice(priceMonthly)}
                      </span>
                      <span className="text-xs text-slate-400">
                        / {plan.priceLabel}
                      </span>
                    </div>
                    {billingCycle === "annual" && (
                      <p className="text-[11px] text-emerald-400 font-mono mt-0.5">
                        Billed annually ({formatPrice(plan.annualTotalEur)}/yr)
                      </p>
                    )}
                  </div>

                  {/* Limits */}
                  <div className="p-3 bg-[#060a17] rounded-xl border border-slate-800/80 space-y-1 text-[11px]">
                    <div className="text-slate-300 font-medium">Capacity: <span className="text-white font-bold">{plan.limits.submissions}</span></div>
                    <div className="text-slate-300 font-medium">Governance: <span className="text-white font-bold">{plan.limits.editors}</span></div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Included Capabilities:
                    </span>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#00C0F0] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/80">
                  <Button
                    onClick={() => handleOpenMeetingModal(`${plan.name} Tier`)}
                    className={`w-full py-4 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      plan.isPopular
                        ? "bg-gradient-to-r from-[#0b99ff] to-[#00b4d8] hover:opacity-95 text-white shadow-lg shadow-sky-950"
                        : "bg-slate-800 hover:bg-slate-700 text-white"
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: ROI CALCULATOR VS LEGACY SYSTEMS (SCHOLARONE / EDITORIAL MGR) */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        
        <div className="bg-[#0b1226]/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                <Calculator className="w-3.5 h-3.5" />
                <span>Financial Impact Model</span>
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Calculate your operational savings vs legacy editorial suites
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Legacy systems charge up to <strong>€14,000/yr per journal</strong> with slow serialized turnarounds. See your direct annual budget savings and reclaimed editorial hours with editorial360.
              </p>

              {/* Slider 1: Journals */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Number of Journals in Portfolio:</span>
                  <span className="text-[#00C0F0] font-mono text-sm">{roiJournals} Journals</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={roiJournals}
                  onChange={(e) => setRoiJournals(Number(e.target.value))}
                  className="w-full accent-[#0b99ff] bg-slate-800 cursor-pointer"
                />
              </div>

              {/* Slider 2: Submissions */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Annual Submissions / Journal:</span>
                  <span className="text-[#00C0F0] font-mono text-sm">{roiSubmissionsPerYear} Submissions</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1200"
                  step="50"
                  value={roiSubmissionsPerYear}
                  onChange={(e) => setRoiSubmissionsPerYear(Number(e.target.value))}
                  className="w-full accent-[#0b99ff] bg-slate-800 cursor-pointer"
                />
              </div>
            </div>

            {/* Savings Metrics Display */}
            <div className="lg:col-span-7 bg-[#060a17] p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="p-4 rounded-xl bg-[#0b1226] border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Estimated Legacy Cost</span>
                  <span className="text-xl sm:text-2xl font-black text-rose-400 font-mono mt-1 block">
                    {formatPrice(roiMetrics.legacyAnnualTotal)}/yr
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1">ScholarOne / Aries EM average</span>
                </div>

                <div className="p-4 rounded-xl bg-[#0b1226] border border-emerald-500/30">
                  <span className="text-[10px] text-emerald-400 uppercase tracking-wider block font-bold">editorial360 Investment</span>
                  <span className="text-xl sm:text-2xl font-black text-white font-mono mt-1 block">
                    {formatPrice(roiMetrics.editorial360AnnualTotal)}/yr
                  </span>
                  <span className="text-[10px] text-emerald-400/80 block mt-1">Flat Elevate annual license</span>
                </div>

              </div>

              {/* Highlight Net Annual Savings */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0b1226] to-sky-950/40 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                    Net Annual Budget Savings
                  </span>
                  <span className="text-3xl font-black text-white font-mono mt-0.5 block">
                    {formatPrice(roiMetrics.netAnnualSavings)} / year
                  </span>
                  <span className="text-xs text-slate-300">
                    Saves approximately <strong>{roiMetrics.savingsPercent}%</strong> on operational publishing software
                  </span>
                </div>

                <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6">
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block">
                    Reclaimed Editorial Labor
                  </span>
                  <span className="text-2xl font-black text-white font-mono mt-0.5 block">
                    {Math.round(roiMetrics.hoursSavedPerYear).toLocaleString()} hrs
                  </span>
                  <span className="text-xs text-slate-400">
                    Saved from reviewer hunting &amp; chase emails
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <p className="text-xs text-slate-400">
                  Need an official migration proposal for your board or society trustees?
                </p>
                <button
                  onClick={() => handleOpenMeetingModal("Board Migration Proposal")}
                  className="px-4 py-2 bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer whitespace-nowrap transition-all"
                >
                  Request Formal Migration Proposal
                </button>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: 30-SEC WORKFLOW AUDIT CTA */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="bg-gradient-to-r from-[#0d1530] via-[#091024] to-[#0d1530] border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold">
              <ClipboardList className="w-3.5 h-3.5" />
              <span>30-Second Publisher Workflow Diagnostic</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Suffering from reviewer decline rates or legacy turnaround lag?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Take our 4-question assessment to receive an itemized bottleneck audit showing how your current review cycle compares to international benchmarks.
            </p>
          </div>

          <button
            onClick={() => setAuditModalOpen(true)}
            className="px-5 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <ClipboardList className="w-4 h-4 text-slate-950" />
            <span>Launch 30-Sec Diagnostic Questionnaire</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-4 text-slate-400">
          <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          <span>&bull;</span>
          <Link href="/privacy" className="hover:text-white">GDPR &amp; Privacy Policy</Link>
          <span>&bull;</span>
          <a href="mailto:info@scholarlyopen.org" className="hover:text-white">info@scholarlyopen.org</a>
        </div>
        <p>
          &copy; {new Date().getFullYear()} Scholarly Open Inc. · editorial360™ Enterprise Editorial Solutions · Frankfurt Book Fair 2026.
        </p>
      </footer>

      {/* ========================================================================= */}
      {/* MODAL 1: 30-SEC PUBLISHER DIAGNOSTIC QUESTIONNAIRE */}
      {/* ========================================================================= */}
      {auditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0b1226] border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto text-slate-100">
            <button
              onClick={() => setAuditModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {auditSubmitted ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Diagnostic Received!</h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                  Thank you, {auditData.name}. Our editorial systems advisory desk will evaluate your answers against industry benchmarks and dispatch your migration report to <strong>{auditData.email}</strong>.
                </p>
                <Button
                  onClick={() => {
                    setAuditSubmitted(false)
                    setAuditModalOpen(false)
                  }}
                  className="bg-[#0b99ff] text-white text-xs font-bold"
                >
                  Close Window
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmitAudit} className="space-y-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-300 uppercase">
                    <ClipboardList className="w-3.5 h-3.5" />
                    <span>30-Sec Publisher Diagnostic</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Editorial Workflow &amp; Bottleneck Assessment
                  </h3>
                  <p className="text-xs text-slate-400">
                    Quickly identify the operational obstacles currently capping your journal velocity.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Dr. Alex Schmidt"
                      value={auditData.name}
                      onChange={(e) => setAuditData({ ...auditData, name: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-800 bg-[#070b18] text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Work Email</label>
                    <input
                      type="email"
                      required
                      placeholder="a.schmidt@press.org"
                      value={auditData.email}
                      onChange={(e) => setAuditData({ ...auditData, email: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-800 bg-[#070b18] text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Organization / Press Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cambridge Scholarly Society"
                    value={auditData.organization}
                    onChange={(e) => setAuditData({ ...auditData, organization: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-800 bg-[#070b18] text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Current Editorial System</label>
                    <select
                      value={auditData.currentSystem}
                      onChange={(e) => setAuditData({ ...auditData, currentSystem: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-800 bg-[#070b18] text-white"
                    >
                      <option value="Clarivate ScholarOne">Clarivate ScholarOne</option>
                      <option value="Aries Editorial Manager">Aries Editorial Manager</option>
                      <option value="Open Journal Systems (OJS)">Open Journal Systems (OJS)</option>
                      <option value="Manual Email / Google Drive">Manual Email / Google Drive</option>
                      <option value="Other Commercial System">Other Commercial System</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Current Average Turnaround</label>
                    <select
                      value={auditData.turnaroundTime}
                      onChange={(e) => setAuditData({ ...auditData, turnaroundTime: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-800 bg-[#070b18] text-white"
                    >
                      <option value="Under 30 Days">Under 30 Days (Fast)</option>
                      <option value="30 to 60 Days">30 to 60 Days (Standard)</option>
                      <option value="60 to 90 Days">60 to 90 Days (Lagging)</option>
                      <option value="Over 90 Days">Over 90 Days (Critical Bottleneck)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1.5">
                    What are your biggest pain points? (Select all that apply)
                  </label>
                  <div className="space-y-1.5 text-xs">
                    {[
                      "Reviewer fatigue & high decline rates (>60%)",
                      "Slow turnaround & manual reminder delays",
                      "High software licensing & maintenance costs (€12k–€25k+/yr)",
                      "Lack of automated papermill / image integrity checks",
                      "Difficult or complex UI for authors and editors"
                    ].map((item, i) => {
                      const isSelected = auditData.difficulties.includes(item)
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleToggleDifficulty(item)}
                          className={`w-full text-left p-2 rounded-lg border text-[11px] transition-colors cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? "bg-[#0b99ff]/20 border-[#0b99ff] text-white font-medium"
                              : "bg-[#070b18] border-slate-800 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <span>{item}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#00C0F0]" />}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {auditError && (
                  <p className="text-[11px] text-rose-400 font-medium">{auditError}</p>
                )}

                <Button
                  type="submit"
                  disabled={submittingAudit}
                  className="w-full py-4 text-xs font-bold rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 cursor-pointer"
                >
                  {submittingAudit ? "Analyzing..." : "Submit Diagnostic & Get Free Migration Report"}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: 1-ON-1 EXECUTIVE SESSION SCHEDULER */}
      {/* ========================================================================= */}
      {meetingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0b1226] border border-slate-700 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-slate-100">
            <button
              onClick={() => setMeetingModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {formSubmitted ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Consultation Request Confirmed</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Thank you, {formData.name}. Our editorial director has received your request regarding the <strong>{selectedPlanForModal}</strong>. We will email your calendar invite and video link to <strong>{formData.email}</strong> within 2 hours.
                </p>
                <Button
                  onClick={() => {
                    setFormSubmitted(false)
                    setMeetingModalOpen(false)
                  }}
                  className="bg-[#0b99ff] text-white text-xs font-bold"
                >
                  Done
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmitMeeting} className="space-y-3.5">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#00C0F0] uppercase">
                    <Video className="w-3.5 h-3.5" />
                    <span>Executive Briefing ({selectedPlanForModal})</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Book a 1-on-1 Editorial Consultation
                  </h3>
                  <p className="text-xs text-slate-400">
                    Discuss your journal portfolio, custom SLA requirements, and system migration with our senior publishing delegation.
                  </p>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Prof. David Miller"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-800 bg-[#070b18] text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="d.miller@press.ox.ac.uk"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-800 bg-[#070b18] text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Publishing House / Society</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oxford Academic Society"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-800 bg-[#070b18] text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Preferred Meeting Platform</label>
                  <select
                    value={formData.meetingSlot}
                    onChange={(e) => setFormData({ ...formData, meetingSlot: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-800 bg-[#070b18] text-white"
                  >
                    <option value="Online Zoom Video Briefing">Online Zoom Video Briefing</option>
                    <option value="Google Meet Executive Session">Google Meet Executive Session</option>
                    <option value="Direct Phone Call">Direct Phone Call</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Special Requirements / Notes (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Migrating 4 journals from ScholarOne by Q3 2026..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-800 bg-[#070b18] text-white placeholder-slate-500"
                  />
                </div>

                {meetingError && (
                  <p className="text-[11px] text-rose-400 font-medium">{meetingError}</p>
                )}

                <Button
                  type="submit"
                  disabled={submittingMeeting}
                  className="w-full py-4 text-xs font-bold rounded-xl bg-[#0b99ff] hover:bg-[#0088e0] text-white cursor-pointer"
                >
                  {submittingMeeting ? "Booking Session..." : "Confirm Consultation Booking"}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: DIGITAL QR FLYER MODAL (FRANKFURT BOOK FAIR COMPANION) */}
      {/* ========================================================================= */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0b1226] border border-slate-700 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 relative shadow-2xl">
            <button
              onClick={() => setQrModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#00C0F0] uppercase tracking-wider block">
                Frankfurt Book Fair Digital Flyer
              </span>
              <h3 className="text-base font-bold text-white">
                Scan to Open on Mobile
              </h3>
            </div>

            {/* QR Code Graphic Frame */}
            <div className="p-4 bg-white rounded-2xl inline-block shadow-xl">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(pricingUrl)}`}
                alt="editorial360 Pricing QR Code"
                className="w-48 h-48 mx-auto"
              />
            </div>

            <p className="text-xs text-slate-400">
              Scan with your smartphone camera to access the live demo and pricing on mobile.
            </p>

            <button
              onClick={handleCopyLink}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-[#00C0F0]" />
              <span>{linkCopied ? "Link Copied to Clipboard!" : "Copy Pricing URL"}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
