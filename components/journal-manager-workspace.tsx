"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  Users, 
  BarChart3, 
  Archive, 
  Clock, 
  Check, 
  X, 
  Search, 
  Download, 
  Send, 
  Eye, 
  UserPlus, 
  Compass,
  Sparkles,
  BookOpen, 
  Upload,
  FileDown,
  AlertCircle,
  Lock,
  MessageSquare,
  List,
  Kanban,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Sliders,
  RotateCcw,
  FileCheck2,
  CheckCircle2,
  ArrowUpRight,
  CheckCheck,
  Mail,
  Layers,
  XCircle,
  FileX,
  Bell,
  TrendingUp,
  Globe,
  Calendar,
  Filter,
  Activity,
  Award,
  FileSpreadsheet,
  PieChart,
  Zap,
  Building2,
  Edit3,
  ExternalLink,
  History,
  Server,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  UserX
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CrossDeskActivityFeed, CrossDeskNotification } from "./cross-desk-activity-feed"
import { generateBrandedEmailHtml } from "@/lib/email-templates"
import { EmailDispatchDialog, EmailDispatchConfig } from "./email-dispatch-dialog"
import { OFFICIAL_JOURNALS, getJournalReplyTo } from "@/lib/data/journal-contacts"
import { REGIONAL_COUNTRY_GROUPS, GLOBAL_COUNTRIES } from "@/lib/data/countries"

export interface SentEmailRecord {
  id: string
  timestamp: string
  recipientName: string
  recipientEmail: string
  journal: string
  campaignType: "call_for_papers" | "ebm" | "eic" | "associate_editor" | string
  subject: string
  body: string
  status: "Delivered" | "Dispatched" | "Simulated"
}

export interface ReviewerHistoryItem {
  id: string
  paperId: string
  paperTitle?: string
  journal?: string
  reviewerName: string
  reviewerEmail: string
  invitedDate: string
  status: "Invited" | "Accepted" | "Declined" | "Completed"
  deadline?: string
  declineReason?: string
  declineReferral?: string
  respondedAt?: string
}

export interface JmManuscript {
  id: string
  title: string
  journal: string
  status: "Draft" | "Awaiting Initial Check" | "Submitted" | "Under Review" | "Revision Required" | "Revision Under Evaluation" | "Accepted" | "Rejected"
  date: string
  reviewers: string[]
  integrityStatus: "Clean" | "Flagged" | "Unchecked" | "Breach Confirmed" | "Raw Data Requested" | "Inquiry Dispatched" | string
  plagiarismScore?: number
  aiScore?: number
  authorName?: string
  authorEmail?: string
  authorAffiliation?: string
  authorOrcid?: string
  abstract?: string
  keywords?: string
  assignedEditorName?: string
  articleType?: string
  proofStatus?: "Pending Upload" | "Pending Author Sign-off" | "Approved by Author ✓"
  submissionStage?: string
  fileName?: string
  fileSize?: string
  fileUrl?: string
  revisedFileName?: string
  revisedFileSize?: string
  revisedFileUrl?: string
  revisionDate?: string
  updatedAt?: string
  lastActivity?: string
  dataDoi?: string
  coverLetter?: string
  ethicsIrb?: string
  fundingGrant?: string
}

export interface JmReviewFeedback {
  id: string
  paperId: string
  reviewerName: string
  originality: number
  methodology?: number
  clarity?: number
  significance?: number
  commentsAuthor: string
  commentsEditor: string
  recommendation: string
  status: "Pending Moderation" | "Released"
  sanitizedCommentsAuthor?: string
  originalComments?: string
}

export interface JmReviewer {
  id: string
  name: string
  email: string
  status: "Active" | "Busy" | "Inactive"
  activeTasks: number
  maxTasks: number
  matchScore: number
  specialization: string
  discipline: string
  orcid: string
  completedReviews: number
  onTimeRate: number
  keywords?: string[]
}

export interface JmArchiveLog {
  id: string
  paperId: string
  actor: string
  action: string
  timestamp: string
  details: string
}

interface JournalManagerWorkspaceProps {
  language?: "en" | "de"
  activeTab?: string
  onTabChange?: (tab: string) => void
  manuscripts: JmManuscript[]
  onUpdateManuscriptStatus?: (paperId: string, newStatus: string) => void
  onAssignEditor?: (paperId: string, editorName: string) => void
  reviews?: JmReviewFeedback[]
  onReleaseComments?: (reviewId: string, sanitizedText: string) => void
  archiveLogs?: JmArchiveLog[]
  notifications?: CrossDeskNotification[]
  onAddNotification?: (notif: any) => void
  user?: {
    name?: string
    role?: string
    email?: string
    office?: string
    country?: string
    photoUrl?: string
  }
}

export function JournalManagerWorkspace({
  language = "en",
  activeTab = "board",
  onTabChange,
  manuscripts: initialManuscripts = [],
  onUpdateManuscriptStatus,
  onAssignEditor,
  reviews: initialReviews = [],
  onReleaseComments,
  archiveLogs: initialLogs = [],
  notifications = [],
  onAddNotification,
  user
}: JournalManagerWorkspaceProps) {
  const isDe = language === "de"

  // Stage filter for Submissions Pipeline
  const [selectedStageFilter, setSelectedStageFilter] = useState<"all" | "triage" | "review" | "revisions" | "decisions" | "production" | "integrity">("all")
  const [isDecisionLetterModalOpen, setIsDecisionLetterModalOpen] = useState(false)
  const [viewingDecisionManuscript, setViewingDecisionManuscript] = useState<JmManuscript | null>(null)

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedJournal, setSelectedJournal] = useState("all")
  
  // Analytics Dashboard State
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<"30d" | "quarter" | "ytd" | "all">("quarter")
  const [analyticsJournalFilter, setAnalyticsJournalFilter] = useState<string>("all")
  const [analyticsExportStatus, setAnalyticsExportStatus] = useState<string | null>(null)
  
  // Assign Modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [selectedManuscript, setSelectedManuscript] = useState<JmManuscript | null>(null)
  const [selectedEditor, setSelectedEditor] = useState("Prof. Aris Thorne")
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>([])
  const [jmReviewerSourceTab, setJmReviewerSourceTab] = useState<"matched" | "suggested" | "external">("matched")
  const [customRevName, setCustomRevName] = useState("")
  const [customRevEmail, setCustomRevEmail] = useState("")
  const [customRevAffiliation, setCustomRevAffiliation] = useState("")
  const [externalReviewersList, setExternalReviewersList] = useState<{ name: string; email: string; affiliation: string }[]>([])
  const [editingReviewerIndex, setEditingReviewerIndex] = useState<number | null>(null)
  const [jmOpenAlexResults, setJmOpenAlexResults] = useState<any[] | null>(null)
  const [isJmSearchingOpenAlex, setIsJmSearchingOpenAlex] = useState(false)
  const [jmOpenAlexQuery, setJmOpenAlexQuery] = useState("")

  // Scholar Scout (Lead Finder & Editorial Outreach Suite) State
  const [scoutKeyword, setScoutKeyword] = useState("Artificial Intelligence in Medicine")
  const [scoutTargetJournal, setScoutTargetJournal] = useState("Scholarly Open: Medicine")
  const [scoutCountry, setScoutCountry] = useState<string>("all")
  const [scoutCampaignType, setScoutCampaignType] = useState<"call_for_papers" | "ebm" | "eic" | "associate_editor" | "follow_up" | "ecr_reviewer" | "ecr_masterclass" | "ecr_author_waiver">("call_for_papers")
  const [scoutViewMode, setScoutViewMode] = useState<"list" | "cards">("list")
  const [scoutSubTab, setScoutSubTab] = useState<"finder" | "ecr" | "history">("finder")
  const [scoutLimit, setScoutLimit] = useState<number>(25)
  const [scoutPage, setScoutPage] = useState<number>(1)
  const [scoutTotalResults, setScoutTotalResults] = useState<number>(142)
  const [editingScholarEmailIndex, setEditingScholarEmailIndex] = useState<number | null>(null)
  const [viewingHistoryEmail, setViewingHistoryEmail] = useState<SentEmailRecord | null>(null)

  // Reviewer Registry & History Tracking States
  const [paperReviewerHistory, setPaperReviewerHistory] = useState<ReviewerHistoryItem[]>([])
  const [globalReviewerHistory, setGlobalReviewerHistory] = useState<ReviewerHistoryItem[]>([])
  const [reviewerRegistryTab, setReviewerRegistryTab] = useState<"directory" | "history" | "ecr" | "gateway">("directory")
  const [isLoadingPaperHistory, setIsLoadingPaperHistory] = useState(false)

  // Reviewer Gateway Tests & Onboarding State
  const [gatewayTests, setGatewayTests] = useState<any[]>([])
  const [gatewayResponses, setGatewayResponses] = useState<any[]>([])
  const [isLoadingGateway, setIsLoadingGateway] = useState(false)
  const [gatewaySearch, setGatewaySearch] = useState("")

  // Reviewer Profile Inspection State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [selectedReviewerData, setSelectedReviewerData] = useState<{
    profile: any
    audit: any
  } | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)

  const handleOpenReviewerProfile = async (email: string, fallbackCandidate?: any) => {
    setIsLoadingProfile(true)
    setIsProfileModalOpen(true)
    try {
      const res = await fetch(`/api/editorial360/reviewer-profile?email=${encodeURIComponent(email)}`)
      if (res.ok) {
        const data = await res.json()
        if (data.ok && data.profile) {
          setSelectedReviewerData({ profile: data.profile, audit: data.audit })
          return
        }
      }
      // Fallback if not found on server
      const synthetic = {
        title: "Dr.",
        name: fallbackCandidate?.candidateName || "Referee",
        email: email,
        institution: fallbackCandidate?.institution || "Academic Institution",
        department: "Faculty of Science & Engineering",
        country: "International",
        primaryDiscipline: fallbackCandidate?.discipline || "engineering",
        subDisciplines: ["Applied Research"],
        keywords: ["Academic Peer Review", "Methodology"],
        maxReviewsPerMonth: 2,
        preferredTurnaround: 14,
        availabilityStatus: "Available",
        coiAcknowledged: true,
        credentialId: fallbackCandidate?.credentialId,
        gatewayScore: fallbackCandidate?.score,
        accountStatus: fallbackCandidate?.status || "Active"
      }
      setSelectedReviewerData({
        profile: synthetic,
        audit: {
          completionPercentage: 70,
          filledFields: [
            { key: "name", label: "Full Name", value: synthetic.name },
            { key: "email", label: "Email Address", value: synthetic.email },
            { key: "institution", label: "Affiliation", value: synthetic.institution }
          ],
          missingFields: [
            { key: "orcid", label: "ORCID iD", tip: "Connect verified 16-digit ORCID" },
            { key: "keywords", label: "Keywords", tip: "Add specific research keywords" }
          ]
        }
      })
    } catch (err) {
      console.error("Failed to load reviewer profile:", err)
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const fetchGatewayData = async () => {
    setIsLoadingGateway(true)
    try {
      const [testsRes, respRes] = await Promise.all([
        fetch("/api/editorial360/reviewer-tests"),
        fetch("/api/editorial360/invitation-response")
      ])
      if (testsRes.ok) {
        const d = await testsRes.json()
        if (d.success && Array.isArray(d.tests)) setGatewayTests(d.tests)
      }
      if (respRes.ok) {
        const r = await respRes.json()
        if (r.success && Array.isArray(r.responses)) setGatewayResponses(r.responses)
      }
    } catch (e) {
      console.error("Error loading gateway tests:", e)
    } finally {
      setIsLoadingGateway(false)
    }
  }

  // Early Career Researcher (ECR Talent Hub: bioRxiv / medRxiv / arXiv / OpenAlex) State
  const [ecrSource, setEcrSource] = useState<"all" | "biorxiv" | "medrxiv" | "arxiv" | "openalex">("all")
  const [ecrKeyword, setEcrKeyword] = useState("Biomedical Engineering & AI Preprints")
  const [ecrResults, setEcrResults] = useState<any[]>([])
  const [isEcrScouting, setIsEcrScouting] = useState(false)
  const [ecrSelectedNames, setEcrSelectedNames] = useState<string[]>([])
  const [ecrCampaignType, setEcrCampaignType] = useState<"ecr_reviewer" | "ecr_masterclass" | "ecr_author_waiver">("ecr_reviewer")

  // Sent Emails History (Audit Log) with LocalStorage persistence
  const [sentEmailsHistory, setSentEmailsHistory] = useState<SentEmailRecord[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("editorial360_scout_sent_history")
        if (saved) return JSON.parse(saved)
      } catch (e) {
        console.error("Failed to load sent emails history:", e)
      }
    }
    return [
      {
        id: "SENT-1092",
        timestamp: "2026-09-20T14:22:00Z",
        recipientName: "Prof. Hiroshi Tanaka",
        recipientEmail: "h.tanaka@tokyo-institute.ac.jp",
        journal: "Scholarly Open: Medicine",
        campaignType: "call_for_papers",
        subject: "Call for Papers: Founding Volume Submission Invitation for Scholarly Open: Medicine",
        body: "Dear Prof. Hiroshi Tanaka,\n\nOn behalf of the editorial office of Scholarly Open: Medicine, we have followed your influential scholarship in Non-Mydriatic Fundus Tele-Screening Protocols & AI Triage with great admiration.\n\nScholarly Open: Medicine is currently assembling high-impact original research articles for our Founding Inaugural Volume. This foundational issue is pivotal in securing international ISSN registration and establishing our baseline citation record for upcoming indexing applications.\n\nIn alignment with our official APC & Waiver Policy:\n• Inaugural 50% Launch Discount: All accepted manuscripts in 2026 automatically receive a 50% fee discount across our portfolio.\n• Low-Income Waivers: Authors from World Bank low-income countries receive 100% full fee waivers; discretionary hardship waivers are available for unfunded researchers.\n• Rigorous Double-Blind Peer Review with 14-day rapid turnaround target.\n\nSincerely,\nNoor F.\nJournal Management Office",
        status: "Delivered"
      },
      {
        id: "SENT-1091",
        timestamp: "2026-09-20T11:05:00Z",
        recipientName: "Prof. Claire Dupond",
        recipientEmail: "c.dupond@sorbonne-universite.fr",
        journal: "Scholarly Open: Medicine",
        campaignType: "ebm",
        subject: "Invitation to Join the Editorial Board: Scholarly Open: Medicine",
        body: "Dear Prof. Claire Dupond,\n\nIn recognition of your outstanding scholarship at Sorbonne Université, we cordially invite you to join our Editorial Board.\n\nTerm & Benefits: Initial 2-year appointment, 25% discount on APCs for your own submissions, full academic independence and masthead recognition.\n\nSincerely,\nNoor F.\nEditorial Office",
        status: "Delivered"
      },
      {
        id: "SENT-1090",
        timestamp: "2026-09-19T16:45:00Z",
        recipientName: "Prof. Alexander Wright",
        recipientEmail: "a.wright@materials.ox.ac.uk",
        journal: "Scholarly Open: Engineering & Applied Sciences",
        campaignType: "associate_editor",
        subject: "Editorial Invitation: Associate Editor Appointment for Scholarly Open: Engineering & Applied Sciences",
        body: "Dear Prof. Alexander Wright,\n\nWe cordially invite you to join us as an Associate Editor for Scholarly Open: Engineering & Applied Sciences.\n\nTerm & Benefits: Initial 2-year appointment, 25% discount on APCs, recognition on journal masthead.\n\nSincerely,\nNoor F.\nEditorial Office",
        status: "Delivered"
      }
    ]
  })

  // Dynamic Safe Dispatch Quota Meter (250/day per journal mailbox, 3,250/day across all 13 journals)
  const quotaInfo = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0]
    const todayEmails = sentEmailsHistory.filter(e => e.timestamp && e.timestamp.startsWith(todayStr))
    
    if (scoutTargetJournal === "all") {
      const maxQuota = 13 * 250 // 3,250 total capacity across all 13 official journal mailboxes
      const sentCount = todayEmails.length
      const percentage = Math.min(100, Math.max(sentCount > 0 ? 4 : 0, Math.round((sentCount / maxQuota) * 100)))
      return {
        label: "Portfolio Dispatch Rail (13 Desks)",
        sentCount,
        maxQuota,
        percentage,
        isWarning: sentCount > 650,
        isCaution: sentCount > 400,
        subtext: "Deliverability target: ≤50/day per desk (650 total) to prevent blacklisting (server limit: 3,250/day)."
      }
    } else {
      const officialJ = OFFICIAL_JOURNALS.find(j => j.name === scoutTargetJournal)
      const deskName = officialJ ? officialJ.shortName : scoutTargetJournal.replace("Scholarly Open: ", "")
      const maxQuota = 250 // Safe server ceiling for this specific mailbox
      const sentCount = todayEmails.filter(e => {
        if (!e.journal) return false
        return e.journal.toLowerCase().includes(deskName.toLowerCase()) || 
               scoutTargetJournal.toLowerCase().includes(e.journal.toLowerCase())
      }).length
      const percentage = Math.min(100, Math.max(sentCount > 0 ? 4 : 0, Math.round((sentCount / maxQuota) * 100)))
      return {
        label: `${deskName} Mailbox Rail`,
        sentCount,
        maxQuota,
        percentage,
        isWarning: sentCount > 50,
        isCaution: sentCount > 35,
        subtext: `Deliverability target: ≤50/day for ${officialJ ? officialJ.email : 'this mailbox'} (server limit: 250/day).`
      }
    }
  }, [sentEmailsHistory, scoutTargetJournal])

  const [scoutResults, setScoutResults] = useState<any[]>([
    {
      name: "Prof. Juhani Knuuti",
      institution: "Turku PET Centre, University of Turku & Turku University Hospital (Finland)",
      email: "jknuuti@utu.fi",
      orcid: "0000-0001-9494-0994",
      specialty: "Nuclear Medicine, Cardiovascular Imaging & Molecular Imaging",
      metrics: "480+ papers · 28,000+ citations · h-index: 82",
      editorialRationale: "Head of Turku PET Centre; international authority in myocardial perfusion and clinical telemetry.",
      country: "Finland",
      verificationStatus: "✓ Scraped from Source Paper",
      emailSource: "extracted"
    },
    {
      name: "Prof. Sanna Järvelä",
      institution: "University of Oulu · Department of Educational Sciences (Finland)",
      email: "sanna.jarvela@oulu.fi",
      orcid: "0000-0001-6223-3668",
      specialty: "AI in Education, Self-Regulated Learning & Multimodal Learning Analytics",
      metrics: "160+ papers · 14,000+ citations · h-index: 54",
      editorialRationale: "Leading researcher on AI-augmented learning systems and physiological learning analytics.",
      country: "Finland",
      verificationStatus: "✓ Scraped from Source Paper",
      emailSource: "extracted"
    },
    {
      name: "Dr. Sarah Jenkins",
      institution: "University of Edinburgh · Centre for Medical Informatics (UK)",
      email: "s.jenkins@ed.ac.uk",
      orcid: "0000-0001-9921-3481",
      specialty: "Deep Learning Medical Image Triaging & AUROC Benchmarking",
      metrics: "19 papers · 540 citations · h-index: 11",
      editorialRationale: "Expert in deep convolutional neural network validation across decentralized community telemetry.",
      country: "United Kingdom",
      verificationStatus: "✓ Scraped from Source Paper",
      emailSource: "extracted"
    },
    {
      name: "Dr. Yidan Sun",
      institution: "Washington University School of Medicine in St. Louis · Department of Genetics (USA)",
      email: "yidan.sun@wustl.edu",
      orcid: "0000-0002-3190-8411",
      specialty: "High-Order Enhancer Hubs, Nanopore-HiChIP & Kinetic Buffering",
      metrics: "bioRxiv Lead Author · 2026 Preprint · 145 citations",
      editorialRationale: "First author on Nanopore-HiChIP and transcriptional compensation; verified genomic expertise.",
      country: "United States",
      verificationStatus: "✓ Scraped from Source Paper",
      emailSource: "extracted"
    },
    {
      name: "Prof. Dr. Peter W. de Leeuw",
      institution: "Maastricht University Medical Center · Department of Internal Medicine (Netherlands)",
      email: "p.deleeuw@mumc.nl",
      orcid: "0000-0002-9988-1123",
      specialty: "Hypertension, Cardiovascular Pharmacotherapy & Primary Care",
      metrics: "medRxiv First Author · 2026 Preprint · 1,420 citations",
      editorialRationale: "Lead investigator on primary care clinical stratification study; exceptional referee.",
      country: "Netherlands",
      verificationStatus: "✓ Scraped from Source Paper",
      emailSource: "extracted"
    }
  ])
  const [isScouting, setIsScouting] = useState(false)
  const [scoutSelectedNames, setScoutSelectedNames] = useState<string[]>([])
  const [scoutSuccessMessage, setScoutSuccessMessage] = useState<string | null>(null)

  // Unsubscribed / Do Not Contact Registry state
  const [unsubscribedList, setUnsubscribedList] = useState<{ email: string; journal?: string; timestamp: string; reason?: string }[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("editorial360_unsubscribed_list")
        if (saved) return JSON.parse(saved)
      } catch (e) {
        console.error("Failed to load unsubscribed list:", e)
      }
    }
    return [
      { email: "optout-sample@university.edu", journal: "All Journals", timestamp: "2026-09-21T09:30:00Z", reason: "Direct opt-out request" }
    ]
  })

  // Dismissed / Skipped candidate emails or names (e.g. deceased or not suitable)
  const [dismissedCandidates, setDismissedCandidates] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("editorial360_dismissed_candidates")
        if (saved) return JSON.parse(saved)
      } catch (e) {
        console.error("Failed to load dismissed candidates:", e)
      }
    }
    return []
  })

  const [sentAuditSubTab, setSentAuditSubTab] = useState<"sent_emails" | "unsubscribed">("sent_emails")
  const [newUnsubEmail, setNewUnsubEmail] = useState("")
  const [newUnsubReason, setNewUnsubReason] = useState("")
  const [isAddUnsubModalOpen, setIsAddUnsubModalOpen] = useState(false)

  // Sync unsubscribed list with backend API on mount
  useEffect(() => {
    fetch("/api/editorial360/unsubscribe?format=json")
      .then(res => res.json())
      .then(data => {
        if (data.unsubscribed && Array.isArray(data.unsubscribed) && data.unsubscribed.length > 0) {
          setUnsubscribedList(prev => {
            const existing = new Set(prev.map(u => u.email.toLowerCase()))
            const merged = [...prev]
            for (const item of data.unsubscribed) {
              if (item.email && !existing.has(item.email.toLowerCase())) {
                existing.add(item.email.toLowerCase())
                merged.push(item)
              }
            }
            try {
              if (typeof window !== "undefined") {
                localStorage.setItem("editorial360_unsubscribed_list", JSON.stringify(merged))
              }
            } catch (e) {}
            return merged
          })
        }
      })
      .catch(() => {})
  }, [])

  // Automatically switch scoutSubTab to history when activeTab is "sent"
  useEffect(() => {
    if (activeTab === "sent") {
      setScoutSubTab("history")
    }
  }, [activeTab])

  // Active Scout Candidates dynamically filtered against Sent History, Unsubscribed List, and Dismissed Candidates
  const activeScoutResults = useMemo(() => {
    const sentEmailsSet = new Set(sentEmailsHistory.map(s => (s.recipientEmail || "").trim().toLowerCase()))
    const sentNamesSet = new Set(sentEmailsHistory.map(s => (s.recipientName || "").trim().toLowerCase()))
    const unsubSet = new Set(unsubscribedList.map(u => (u.email || "").trim().toLowerCase()))
    const dismissedSet = new Set(dismissedCandidates.map(d => d.trim().toLowerCase()))

    return scoutResults.filter(s => {
      const email = (s.email || "").trim().toLowerCase()
      const name = (s.name || "").trim().toLowerCase()
      const isSent = (email && sentEmailsSet.has(email)) || (name && sentNamesSet.has(name))
      const isUnsub = email && unsubSet.has(email)
      const isDismissed = (email && dismissedSet.has(email)) || (name && dismissedSet.has(name))
      return !isSent && !isUnsub && !isDismissed
    })
  }, [scoutResults, sentEmailsHistory, unsubscribedList, dismissedCandidates])

  // Active ECR Candidates dynamically filtered
  const activeEcrResults = useMemo(() => {
    const sentEmailsSet = new Set(sentEmailsHistory.map(s => (s.recipientEmail || "").trim().toLowerCase()))
    const sentNamesSet = new Set(sentEmailsHistory.map(s => (s.recipientName || "").trim().toLowerCase()))
    const unsubSet = new Set(unsubscribedList.map(u => (u.email || "").trim().toLowerCase()))
    const dismissedSet = new Set(dismissedCandidates.map(d => d.trim().toLowerCase()))

    return ecrResults.filter(r => {
      const email = (r.email || "").trim().toLowerCase()
      const name = (r.name || "").trim().toLowerCase()
      const isSent = (email && sentEmailsSet.has(email)) || (name && sentNamesSet.has(name))
      const isUnsub = email && unsubSet.has(email)
      const isDismissed = (email && dismissedSet.has(email)) || (name && dismissedSet.has(name))
      return !isSent && !isUnsub && !isDismissed
    })
  }, [ecrResults, sentEmailsHistory, unsubscribedList, dismissedCandidates])

  const handleDismissCandidate = (scholar: any, reason = "Dismissed by Journal Manager") => {
    const key = (scholar.email || scholar.name || "").trim().toLowerCase()
    if (!key) return
    setDismissedCandidates(prev => {
      if (prev.includes(key)) return prev
      const updated = [...prev, key]
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("editorial360_dismissed_candidates", JSON.stringify(updated))
        }
      } catch (e) {}
      return updated
    })
    setScoutSuccessMessage(`Candidate "${scholar.name || scholar.email}" dismissed and removed from candidate pool.`)
    setTimeout(() => setScoutSuccessMessage(null), 4000)
  }

  const handleAddUnsubscribe = (emailToAdd: string, reason = "Manual entry by Journal Manager") => {
    const clean = emailToAdd.trim().toLowerCase()
    if (!clean || !clean.includes("@")) return
    const newRecord = {
      email: clean,
      journal: scoutTargetJournal,
      timestamp: new Date().toISOString(),
      reason
    }
    setUnsubscribedList(prev => {
      if (prev.some(u => u.email === clean)) return prev
      const updated = [newRecord, ...prev]
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("editorial360_unsubscribed_list", JSON.stringify(updated))
        }
      } catch (e) {}
      return updated
    })
    fetch("/api/editorial360/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRecord)
    }).catch(e => console.error("Unsubscribe sync error:", e))

    setScoutSuccessMessage(`Added "${clean}" to Do-Not-Contact list. They will never receive future invitations.`)
    setIsAddUnsubModalOpen(false)
    setNewUnsubEmail("")
    setNewUnsubReason("")
    setTimeout(() => setScoutSuccessMessage(null), 4000)
  }

  const handleRemoveUnsubscribe = (emailToRemove: string) => {
    const clean = emailToRemove.trim().toLowerCase()
    setUnsubscribedList(prev => {
      const updated = prev.filter(u => u.email !== clean)
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("editorial360_unsubscribed_list", JSON.stringify(updated))
        }
      } catch (e) {}
      return updated
    })
    fetch("/api/editorial360/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: clean, action: "remove" })
    }).catch(e => console.error("Unsubscribe remove error:", e))

    setScoutSuccessMessage(`Removed "${clean}" from Do-Not-Contact list.`)
    setTimeout(() => setScoutSuccessMessage(null), 3000)
  }

  const handleUpdateScholarEmail = (index: number, newEmail: string) => {
    setScoutResults(prev => {
      const copy = [...prev]
      copy[index] = { ...copy[index], email: newEmail.trim(), isCustomEmail: true }
      return copy
    })
  }

  const handleUpdateEcrEmail = (index: number, newEmail: string) => {
    setEcrResults(prev => {
      const copy = [...prev]
      copy[index] = { ...copy[index], email: newEmail.trim(), isCustomEmail: true }
      return copy
    })
  }

  const handleSearchScoutScholars = async (queryToSearch?: string, pageToSearch = 1, limitToSearch = scoutLimit, countryToSearch = scoutCountry) => {
    const term = (queryToSearch !== undefined ? queryToSearch : scoutKeyword).trim()
    if (!term) return
    setIsScouting(true)
    try {
      const res = await fetch("/api/editorial360/match-reviewers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customQuery: term,
          journal: scoutTargetJournal,
          country: countryToSearch,
          page: pageToSearch,
          limit: limitToSearch
        })
      })
      if (res.ok) {
        const data = await res.json()
        if (data.reviewers && data.reviewers.length > 0) {
          setScoutResults(data.reviewers)
          if (data.totalResults) setScoutTotalResults(data.totalResults)
          setScoutPage(pageToSearch)
        }
      }
    } catch (err) {
      console.error("Scout search error:", err)
    } finally {
      setIsScouting(false)
    }
  }

  const handleSearchEcrScholars = async (termToSearch?: string, srcToSearch = ecrSource, countryToSearch = scoutCountry) => {
    const term = (termToSearch !== undefined ? termToSearch : ecrKeyword).trim()
    setIsEcrScouting(true)
    try {
      const res = await fetch("/api/editorial360/match-reviewers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isEcr: true,
          ecrSource: srcToSearch,
          customQuery: term || "biomedical engineering artificial intelligence",
          journal: scoutTargetJournal,
          country: countryToSearch,
          limit: 25
        })
      })
      if (res.ok) {
        const data = await res.json()
        if (data.reviewers && data.reviewers.length > 0) {
          setEcrResults(data.reviewers)
        }
      }
    } catch (err) {
      console.error("ECR Scout search error:", err)
    } finally {
      setIsEcrScouting(false)
    }
  }

  // Load initial ECR results when scout sub-tab switches to "ecr" or reviewer registry switches to "ecr"
  useEffect(() => {
    if ((scoutSubTab === "ecr" || reviewerRegistryTab === "ecr") && ecrResults.length === 0) {
      handleSearchEcrScholars()
    }
  }, [scoutSubTab, reviewerRegistryTab])

  // Load Reviewer Gateway & Candidate data
  useEffect(() => {
    fetchGatewayData()
  }, [])

  useEffect(() => {
    if (reviewerRegistryTab === "gateway") {
      fetchGatewayData()
    }
  }, [reviewerRegistryTab])

  const handleDispatchScoutOutreach = (scholar: any, campaign: "call_for_papers" | "ebm" | "eic" | "associate_editor" | "follow_up" | "ecr_reviewer" | "ecr_masterclass" | "ecr_author_waiver") => {
    const journalName = scoutTargetJournal === "all" ? "Scholarly Open" : scoutTargetJournal
    const scholarName = scholar.name || "Distinguished Colleague"
    const scholarEmail = scholar.email || "colleague@university.edu"
    const specialty = scholar.specialty || "your research discipline"
    const institution = scholar.institution || "your institution"

    let defaultSubject = ""
    let defaultBody = ""
    let actionLabel = ""
    let actionUrl = "https://www.scholarlyopen.org/editorial360"

    if (campaign === "call_for_papers") {
      defaultSubject = `Call for Papers: Founding Volume Submission Invitation for ${journalName}`
      actionLabel = "Submit Manuscript"
      actionUrl = "https://www.scholarlyopen.org/submit"
      defaultBody = `Dear ${scholarName},\n\nOn behalf of the editorial office of ${journalName}, we have followed your influential scholarship in ${specialty} with great admiration.\n\n${journalName} is currently assembling high-impact original research articles, reviews, and rapid communications for our Founding Inaugural Volume. This foundational issue is pivotal in securing international ISSN registration and establishing our baseline citation record for upcoming indexing applications (DOAJ, Crossref, and major bibliographic registries).\n\nIn alignment with our official APC & Waiver Policy:\n• Inaugural 50% Launch Discount: All accepted manuscripts in 2026 automatically receive a 50% fee discount across our entire portfolio.\n• Equitable Waivers: Authors from World Bank-classified low-income countries receive a 100% full fee waiver. Researchers without grant or institutional backing are eligible to apply for discretionary financial hardship waivers.\n• Rigorous Double-Blind Peer Review: Expedited initial decision target within 14 days.\n• Immediate Gold Open Access: Published under Creative Commons CC BY 4.0 with Crossref DOI registration upon acceptance.\n\nGiven your distinguished track record, we cordially invite you and your research team to contribute your latest findings to this founding milestone volume.\n\nPlease use the button below to review our author guidelines or submit your manuscript to our editorial desk.\n\nSincerely,\nNoor F.\nJournal Management Office\n${journalName}\nScholarly Open Publishing Group`
    } else if (campaign === "ebm") {
      defaultSubject = `Invitation to Join the Editorial Board: ${journalName}`
      actionLabel = "Accept Editorial Board Invitation"
      actionUrl = `https://www.scholarlyopen.org/editorial360?action=accept_board&name=${encodeURIComponent(scholarName)}`
      defaultBody = `Dear ${scholarName},\n\nIn recognition of your outstanding scholarship and research leadership at ${institution} in ${specialty}, the Editorial Leadership of ${journalName} cordially invites you to join our distinguished Editorial Board as an Editorial Board Member (EBM).\n\nAs an Editorial Board Member, you will play a vital role in maintaining the journal's academic rigor and strategic direction.\nKey responsibilities include:\n• Providing expert, timely reviews for submitted manuscripts within your field (approximately 1–2 per quarter).\n• Upholding COPE publication ethics and academic integrity in all decisions.\n• Supporting the journal's scope, quality, and strategic development.\n• Promoting the journal and encouraging high-quality submissions through academic and professional networks.\n• Contributing your own high-quality scholarly work where appropriate.\n• Mentoring young scientists in the peer-review process.\n\nTerm & Benefits:\n• Initial 2-year renewable appointment.\n• 25% discount on Article Processing Charges (APCs) for your own submissions.\n• Full academic independence and official recognition on the journal masthead and web registry.\n• Receive a performance-based honorarium for each handled article (for more information, see: https://www.scholarlyopen.org/peer-review).\n\nWe would be honored by your acceptance.\n\nSincerely,\nNoor F.\nEditorial Office\n${journalName}\nScholarly Open Publishing Group`
    } else if (campaign === "eic") {
      defaultSubject = `Leadership Appointment: Invitation to Serve as Editor-in-Chief for ${journalName}`
      actionLabel = "Confirm EiC Appointment (Yes)"
      actionUrl = `https://www.scholarlyopen.org/editorial360?action=eic_decision&decision=yes&name=${encodeURIComponent(scholarName)}`
      defaultBody = `Dear ${scholarName},\n\nThe Executive Publishing Board of Scholarly Open is currently seeking a visionary academic leader to serve as Editor-in-Chief (EiC) for ${journalName}.\n\nGiven your distinguished track record at ${institution} and international recognition in ${specialty}, the nominations committee has unanimously selected you as a leading candidate for this pivotal leadership post.\n\nAs Editor-in-Chief, you will guide the strategic and editorial direction of the journal.\nKey responsibilities include:\n• Overseeing the peer-review process and making final decisions on manuscript acceptance.\n• Collaborating with the internal editorial office to uphold strict ethical standards and COPE academic integrity.\n• Leading journal development initiatives, special issues, and strategic scope expansion.\n• Serving as the primary ambassador for the journal within the academic community.\n• Encouraging high-quality submissions and contributing your own scholarly work where appropriate.\n\nTerm & Benefits:\n• Initial 2-year renewable appointment.\n• 25% discount on Article Processing Charges (APCs) for your own submissions.\n• Full academic independence and permanent recognition on the journal masthead and web registry.\n• Receive a performance-based honorarium for each handled article (for more information, see the link: https://www.scholarlyopen.org/peer-review).\n\nWe kindly ask for your decision regarding this appointment:\n1. Accept (Yes): Confirm your acceptance using the button below.\n2. Conditional (Maybe): If you would like to explore specific arrangements or time commitments, simply reply to this email.\n3. Decline (No) / Suggestions: If you cannot accept at this time, we would greatly appreciate your recommendation of an esteemed colleague.\n\nSincerely,\nNoor F.\nExecutive Editorial Committee\nScholarly Open Publishing Group`
    } else if (campaign === "follow_up") {
      defaultSubject = `Follow-up: Academic Collaboration & Editorial Invitation for ${journalName}`
      actionLabel = "Review Previous Invitation"
      actionUrl = `https://www.scholarlyopen.org/editorial360`
      defaultBody = `Dear ${scholarName},\n\nI hope this message finds you well.\n\nI am writing to gently follow up on our previous correspondence regarding ${journalName}. We recognize how demanding your research, clinical, and teaching commitments are at ${institution}, and wanted to ensure our prior invitation did not get lost in your inbox.\n\nGiven your prominent expertise in ${specialty}, we remain very enthusiastic about collaborating with your research team. Depending on your current priorities, we would be delighted to:\n1. Consider your latest research for our Founding Inaugural Volume (with our 50% launch discount and full low-income/hardship waiver provisions).\n2. Welcome you to our international editorial board.\n\nPlease let us know if you have any questions or if you would be open to a brief discussion.\n\nThank you for your time and continued dedication to advancing open science.\n\nSincerely,\nNoor F.\nEditorial Management Office\n${journalName}\nScholarly Open Publishing Group`
    } else if (campaign === "associate_editor") {
      defaultSubject = `Editorial Invitation: Associate Editor Appointment for ${journalName}`
      actionLabel = "Accept Associate Editor Role"
      actionUrl = `https://www.scholarlyopen.org/editorial360?action=accept_ae&name=${encodeURIComponent(scholarName)}`
      defaultBody = `Dear ${scholarName},\n\n${journalName} is expanding its editorial leadership to support increasing submission volumes in ${specialty}. In recognition of your authoritative scholarship at ${institution}, we would be delighted to invite you to join us as an Associate Editor.\n\nIn this role, you will support the Editor-in-Chief by managing the peer-review process for assigned manuscripts within your domain (approximately 1–2 manuscripts per month).\nKey responsibilities include:\n• Managing the peer review process, including identifying and inviting qualified reviewers.\n• Evaluating reviewer reports and formulating detailed editorial recommendations.\n• Upholding ethical standards and academic integrity in all decisions.\n• Promoting the journal and encouraging high-quality submissions within your network.\n• Mentoring Early Career Editorial Board members through transparent co-reviewing.\n\nTerm & Benefits:\n• Initial 2-year renewable appointment.\n• 25% discount on Article Processing Charges (APCs) for your own submissions.\n• Full academic independence and official recognition on the journal masthead.\n• Receive a performance-based honorarium for each handled article (for more information, see: https://www.scholarlyopen.org/peer-review).\n\nPlease let us know if you would be delighted to accept this appointment.\n\nSincerely,\nNoor F.\nEditorial Office\n${journalName}\nScholarly Open Publishing Group`
    } else if (campaign === "ecr_reviewer") {
      defaultSubject = `Invitation to Peer Review & Early Career Reviewer Track: ${journalName}`
      actionLabel = "Accept Review Invitation & Claim Merit Credit"
      actionUrl = `https://www.scholarlyopen.org/editorial360?action=accept_ecr_review&name=${encodeURIComponent(scholarName)}`
      defaultBody = `Dear ${scholarName},\n\nWe recently came across your compelling scholarship in ${specialty}, originating from ${institution}.\n\nAt ${journalName}, we are actively dedicated to opening doors for Early Career Researchers (ECRs), postdoctoral fellows, and advanced doctoral investigators. We believe that emerging scholars provide some of the most thorough, constructive, and forward-looking evaluations in academic publishing.\n\nWe cordially invite you to join our active Peer Reviewer Community. By joining this reviewer cohort, you will benefit from:\n• Fast-Track "Level 1 Verified Reviewer" status on your Editorial360 public profile.\n• Official Reviewer Certificate of Excellence with Crossref / ORCID peer-review verification for your academic CV.\n• 15 Merit Points deposited into your Reviewer Wallet upon report submission (redeemable for 25% or 50% APC fee waivers on future submissions).\n• Transparent Co-Reviewing: You are encouraged to collaborate with a senior colleague or mentor if desired, with both contributors receiving official recognition.\n\nWe would be honored to count you among our expert reviewers.\n\nPlease click the button below to confirm your interest and select your primary sub-discipline keywords.\n\nWarm regards,\nNoor F.\nEditorial Management Office\n${journalName}\nScholarly Open Publishing Group`
    } else if (campaign === "ecr_masterclass") {
      defaultSubject = `Complimentary Invitation: Certified Peer Reviewer Masterclass (${journalName})`
      actionLabel = "Register for Masterclass (Free Admission)"
      actionUrl = `https://www.scholarlyopen.org/editorial360?action=register_masterclass&name=${encodeURIComponent(scholarName)}`
      defaultBody = `Dear ${scholarName},\n\nOn behalf of ${journalName} and the Scholarly Open Editorial Board, we are pleased to offer you a sponsored, complimentary registration for our upcoming "Certified Peer Reviewer Masterclass".\n\nRecognizing your emerging scholarship at ${institution} in ${specialty}, our editorial leadership has nominated you for this targeted professional development initiative.\n\nMasterclass Highlights:\n• Live & On-Demand Interactive Modules: COPE publication ethics, detecting image/data anomalies, statistical rigor evaluation, and writing constructive author-facing feedback.\n• Direct Mentorship from Journal Editors: Learn firsthand what Editors-in-Chief look for when weighing reviewer recommendations.\n• Credentials & Incentives: Participants who complete the masterclass receive an official "Certified Peer Reviewer" credential badge, priority reviewer assignment in ${journalName}, and a 25 Merit Points voucher towards author publication fee waivers.\n\nThis registration is fully sponsored by our Open Science Equity Fund (registration fee 100% waived).\n\nPlease click below to reserve your complimentary place.\n\nBest regards,\nNoor F.\nReviewer Education Committee\n${journalName}\nScholarly Open Publishing Group`
    } else if (campaign === "ecr_author_waiver") {
      defaultSubject = `Founding Author Invitation: Publish Your Preprint in ${journalName} (50% Launch Waiver)`
      actionLabel = "Submit Preprint Manuscript"
      actionUrl = "https://www.scholarlyopen.org/submit"
      defaultBody = `Dear ${scholarName},\n\nWe recently reviewed your preprint${scholar.preprintTitle ? ` ("${scholar.preprintTitle}")` : ""} and were impressed by the originality and methodological rigor demonstrated by your research team at ${institution}.\n\nAs you consider permanent journal venues for this work, we cordially invite you to submit your manuscript for peer review in ${journalName}.\n\nWhy Publish Your Preprint with Scholarly Open?\n• Inaugural 50% Fee Discount: As an Early Career lead author, your submission will automatically qualify for our 50% APC fee waiver, with full hardship waivers available for unfunded researchers.\n• Rapid Double-Blind Peer Review: Expedited initial editorial decision within 14 days by specialists in ${specialty}.\n• Immediate Gold Open Access: Published under Creative Commons CC BY 4.0 with Crossref DOI registration, indexed across international open discovery engines.\n• Author Retention of Rights: You retain 100% copyright over your work and raw datasets.\n\nWe would be thrilled to feature your cutting-edge findings in our upcoming volume.\n\nPlease use the link below to submit your manuscript or review our author guidelines.\n\nSincerely,\nNoor F.\nJournal Management Office\n${journalName}\nScholarly Open Publishing Group`
    }

    openEmailDispatch({
      templateId: campaign,
      recipientEmail: scholarEmail,
      recipientName: scholarName,
      recipientCountry: scholar.country || (scoutCountry !== "all" ? scoutCountry : undefined),
      journal: journalName,
      actionLabel,
      actionUrl,
      defaultSubject,
      defaultBody,
      onConfirmSend: async (data: any) => {
        const res = await fetch("/api/editorial360/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: data.recipientEmail,
            recipientName: scholarName,
            customSubject: data.subject,
            customBody: data.bodyText,
            customHtml: data.renderedHtml,
            journal: journalName,
            fromEmail: getJournalReplyTo(journalName),
            senderName: `${journalName} Editorial Office`
          })
        })

        const resData = await res.json().catch(() => null)
        if (!res.ok || !resData?.success) {
          throw new Error(resData?.error || `Email dispatch failed (HTTP ${res.status}). Please check SMTP configuration.`)
        }

        // Save into sent history log
        const sentRecord: SentEmailRecord = {
          id: `SENT-${Date.now().toString().slice(-4)}`,
          timestamp: new Date().toISOString(),
          recipientName: scholarName,
          recipientEmail: data.recipientEmail,
          journal: journalName,
          campaignType: campaign,
          subject: data.subject,
          body: data.renderedHtml || data.bodyText || "",
          status: resData.sentViaSmtp ? "Delivered" : "Simulated"
        }

        setSentEmailsHistory(prev => {
          const next = [sentRecord, ...prev]
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem("editorial360_scout_sent_history", JSON.stringify(next))
            } catch (e) {}
          }
          return next
        })

        // Immediately remove candidate from active results so they disappear from current view and avoid duplicate outreach
        const lowerEmail = (data.recipientEmail || "").trim().toLowerCase()
        setScoutResults(prev => prev.filter(s => (s.email || "").trim().toLowerCase() !== lowerEmail && s.name !== scholarName))
        setEcrResults(prev => prev.filter(r => (r.email || "").trim().toLowerCase() !== lowerEmail && r.name !== scholarName))
        setScoutSelectedNames(prev => prev.filter(name => name !== scholarName))
        setEcrSelectedNames(prev => prev.filter(name => name !== scholarName))

        const smtpNotice = resData.sentViaSmtp ? " via SMTP" : " (Simulated)"
        setScoutSuccessMessage(`✓ Official invitation for ${scholarName} (${campaign.replace(/_/g, ' ').toUpperCase()}) dispatched to ${data.recipientEmail}${smtpNotice}. Candidate moved to Sent tab.`)
        setTimeout(() => setScoutSuccessMessage(null), 7000)
        setDispatchDialogConfig((prev: EmailDispatchConfig) => ({ ...prev, isOpen: false }))
      }
    })
  }

  // Handle batch dispatching to multiple selected scholars in Leads or ECR
  const handleBatchDispatchScoutOutreach = async (
    scholars: any[],
    campaign: "call_for_papers" | "ebm" | "eic" | "associate_editor" | "follow_up" | "ecr_reviewer" | "ecr_masterclass" | "ecr_author_waiver"
  ) => {
    if (!scholars || scholars.length === 0) return
    if (scholars.length === 1) {
      handleDispatchScoutOutreach(scholars[0], campaign)
      return
    }

    const journalName = scoutTargetJournal === "all" ? "Scholarly Open" : scoutTargetJournal
    const campaignTitle = campaign.replace(/_/g, " ").toUpperCase()

    const confirmed = typeof window !== "undefined"
      ? window.confirm(`Dispatch ${campaignTitle} invitations to all ${scholars.length} selected scholars via SMTP?`)
      : true
    if (!confirmed) return

    let successCount = 0
    let failCount = 0

    for (const scholar of scholars) {
      const scholarName = scholar.name || "Distinguished Colleague"
      const scholarEmail = scholar.email
      if (!scholarEmail) continue

      const specialty = scholar.specialty || "your research discipline"
      const institution = scholar.institution || "your institution"

      let defaultSubject = ""
      let defaultBody = ""
      let actionLabel = ""
      let actionUrl = "https://www.scholarlyopen.org/editorial360"

      if (campaign === "call_for_papers") {
        defaultSubject = `Call for Papers: Founding Volume Submission Invitation for ${journalName}`
        actionLabel = "Submit Manuscript"
        actionUrl = "https://www.scholarlyopen.org/submit"
        defaultBody = `Dear ${scholarName},\n\nOn behalf of the editorial office of ${journalName}, we cordially invite you to contribute your latest scholarship in ${specialty} to our Founding Inaugural Volume.\n\nAccepted articles qualify for our inaugural 50% launch discount and full low-income hardship waivers.\n\nSincerely,\nNoor F.\nJournal Management Office\n${journalName}\nScholarly Open Publishing Group`
      } else if (campaign === "ebm") {
        defaultSubject = `Invitation to Join the Editorial Board: ${journalName}`
        actionLabel = "Accept Editorial Board Invitation"
        actionUrl = `https://www.scholarlyopen.org/editorial360?action=accept_board&name=${encodeURIComponent(scholarName)}`
        defaultBody = `Dear ${scholarName},\n\nIn recognition of your outstanding research leadership at ${institution} in ${specialty}, the Editorial Leadership of ${journalName} cordially invites you to join our Editorial Board as an Editorial Board Member (EBM).\n\nTerm & Benefits:\n• Initial 2-year renewable appointment.\n• 25% discount on Article Processing Charges (APCs) for your own submissions.\n• Full academic independence and official recognition on the journal masthead.\n• Receive a performance-based honorarium for each handled article (for more information, see: https://www.scholarlyopen.org/peer-review).\n\nSincerely,\nNoor F.\nEditorial Office\n${journalName}\nScholarly Open Publishing Group`
      } else if (campaign === "eic") {
        defaultSubject = `Leadership Appointment: Invitation to Serve as Editor-in-Chief for ${journalName}`
        actionLabel = "Confirm EiC Appointment (Yes)"
        actionUrl = `https://www.scholarlyopen.org/editorial360?action=eic_decision&decision=yes&name=${encodeURIComponent(scholarName)}`
        defaultBody = `Dear ${scholarName},\n\nThe Executive Publishing Board of Scholarly Open is currently seeking a visionary academic leader to serve as Editor-in-Chief (EiC) for ${journalName}.\n\nKey responsibilities include:\n• Overseeing the peer-review process and making final decisions on manuscript acceptance.\n• Collaborating with the internal editorial office to uphold strict ethical standards and COPE academic integrity.\n• Leading journal development initiatives, special issues, and strategic scope expansion.\n• Serving as the primary ambassador for the journal within the academic community.\n• Encouraging high-quality submissions and contributing your own scholarly work where appropriate.\n\nTerm & Benefits:\n• Initial 2-year renewable appointment.\n• 25% discount on Article Processing Charges (APCs) for your own submissions.\n• Full academic independence and permanent recognition on the journal masthead and web registry.\n• Receive a performance-based honorarium for each handled article (for more information, see the link: https://www.scholarlyopen.org/peer-review).\n\nWe kindly ask for your decision regarding this appointment:\n1. Accept (Yes): Confirm your acceptance via the link below.\n2. Conditional (Maybe): If you would like to explore arrangements or time commitments, simply reply to this email.\n3. Decline (No) / Suggestions: Please let us know or recommend an esteemed colleague.\n\nSincerely,\nNoor F.\nExecutive Editorial Committee\nScholarly Open Publishing Group`
      } else if (campaign === "associate_editor") {
        defaultSubject = `Editorial Invitation: Associate Editor Appointment for ${journalName}`
        actionLabel = "Accept Associate Editor Role"
        actionUrl = `https://www.scholarlyopen.org/editorial360?action=accept_ae&name=${encodeURIComponent(scholarName)}`
        defaultBody = `Dear ${scholarName},\n\n${journalName} cordially invites you to join us as an Associate Editor for ${specialty}.\n\nTerm & Benefits:\n• Initial 2-year renewable appointment.\n• 25% discount on Article Processing Charges (APCs) for your own submissions.\n• Full academic independence and official recognition on the journal masthead.\n• Receive a performance-based honorarium for each handled article (for more information, see: https://www.scholarlyopen.org/peer-review).\n\nSincerely,\nNoor F.\nEditorial Office\n${journalName}\nScholarly Open Publishing Group`
      } else if (campaign === "ecr_reviewer") {
        defaultSubject = `Invitation to Peer Review & Early Career Reviewer Track: ${journalName}`
        actionLabel = "Accept Review Invitation & Claim Merit Credit"
        actionUrl = `https://www.scholarlyopen.org/editorial360?action=accept_ecr_review&name=${encodeURIComponent(scholarName)}`
        defaultBody = `Dear ${scholarName},\n\nWe recently came across your scholarship in ${specialty}, originating from ${institution}.\n\nAt ${journalName}, we are actively dedicated to opening doors for Early Career Researchers (ECRs). We cordially invite you to join our active Peer Reviewer Community with Level 1 Verified Reviewer status and official ORCID verification.\n\nWarm regards,\nNoor F.\nEditorial Management Office\n${journalName}\nScholarly Open Publishing Group`
      } else if (campaign === "ecr_masterclass") {
        defaultSubject = `Complimentary Invitation: Certified Peer Reviewer Masterclass (${journalName})`
        actionLabel = "Register for Masterclass (Free Admission)"
        actionUrl = `https://www.scholarlyopen.org/editorial360?action=register_masterclass&name=${encodeURIComponent(scholarName)}`
        defaultBody = `Dear ${scholarName},\n\nOn behalf of ${journalName}, we are pleased to offer you a complimentary sponsored registration for our upcoming "Certified Peer Reviewer Masterclass".\n\nBest regards,\nNoor F.\nReviewer Education Committee\n${journalName}\nScholarly Open Publishing Group`
      } else if (campaign === "ecr_author_waiver") {
        defaultSubject = `Founding Author Invitation: Publish Your Preprint in ${journalName} (50% Launch Waiver)`
        actionLabel = "Submit Preprint Manuscript"
        actionUrl = "https://www.scholarlyopen.org/submit"
        defaultBody = `Dear ${scholarName},\n\nWe cordially invite you to submit your preprint research to ${journalName} with an immediate 50% early career fee discount.\n\nSincerely,\nNoor F.\nJournal Management Office\n${journalName}\nScholarly Open Publishing Group`
      } else {
        defaultSubject = `Editorial Invitation: ${journalName}`
        actionLabel = "Access Editorial Portal"
        actionUrl = "https://www.scholarlyopen.org/editorial360"
        defaultBody = `Dear ${scholarName},\n\nOfficial communication regarding academic collaboration with ${journalName}.\n\nSincerely,\nNoor F.\nEditorial Office\n${journalName}`
      }

      const renderedHtml = generateBrandedEmailHtml({
        subject: defaultSubject,
        bodyText: defaultBody,
        actionLabel,
        actionUrl,
        journal: journalName,
        recipientName: scholarName
      })

      try {
        const res = await fetch("/api/editorial360/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: scholarEmail,
            recipientName: scholarName,
            customSubject: defaultSubject,
            customBody: defaultBody,
            customHtml: renderedHtml,
            journal: journalName,
            fromEmail: getJournalReplyTo(journalName),
            senderName: `${journalName} Editorial Office`
          })
        })

        const resData = await res.json().catch(() => null)
        if (res.ok && resData?.success) {
          successCount++
          const sentRecord: SentEmailRecord = {
            id: `SENT-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 100)}`,
            timestamp: new Date().toISOString(),
            recipientName: scholarName,
            recipientEmail: scholarEmail,
            journal: journalName,
            campaignType: campaign,
            subject: defaultSubject,
            body: renderedHtml,
            status: resData.sentViaSmtp ? "Delivered" : "Simulated"
          }
          setSentEmailsHistory(prev => {
            const next = [sentRecord, ...prev]
            try {
              localStorage.setItem("editorial360_scout_sent_history", JSON.stringify(next))
            } catch (e) {}
            return next
          })

          const lowerEmail = scholarEmail.trim().toLowerCase()
          setScoutResults(prev => prev.filter(s => (s.email || "").trim().toLowerCase() !== lowerEmail && s.name !== scholarName))
          setEcrResults(prev => prev.filter(r => (r.email || "").trim().toLowerCase() !== lowerEmail && r.name !== scholarName))
        } else {
          failCount++
        }
      } catch (err) {
        console.error("Batch dispatch error for scholar:", scholarEmail, err)
        failCount++
      }
    }

    setEcrSelectedNames([])
    setScoutSelectedNames([])
    setScoutSuccessMessage(
      `✓ Dispatched ${successCount} invitation(s) via SMTP${failCount > 0 ? ` (${failCount} failed)` : ""}.`
    )
    setTimeout(() => setScoutSuccessMessage(null), 8000)
  }

  // Assign Team Modal Invitation Email Template State
  const [assignEmailSubject, setAssignEmailSubject] = useState("")
  const [assignEmailBody, setAssignEmailBody] = useState("")
  const [assignEmailTab, setAssignEmailTab] = useState<"edit" | "preview">("edit")
  const [isAssignSending, setIsAssignSending] = useState(false)

  const handleFetchJmOpenAlexReviewers = async (paper?: JmManuscript | null, query?: string) => {
    setIsJmSearchingOpenAlex(true)
    try {
      const res = await fetch("/api/editorial360/match-reviewers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: paper?.title,
          abstract: paper?.abstract,
          keywords: paper?.keywords,
          authorName: paper?.authorName,
          authorAffiliation: paper?.authorAffiliation,
          journal: paper?.journal,
          customQuery: query
        })
      })
      if (res.ok) {
        const data = await res.json()
        if (data.reviewers && data.reviewers.length > 0) {
          setJmOpenAlexResults(data.reviewers)
        }
      }
    } catch (e) {
      console.error("OpenAlex fetch error:", e)
    } finally {
      setIsJmSearchingOpenAlex(false)
    }
  }
  
  // Manual Pre-Check Modal
  const [isPreQualityModalOpen, setIsPreQualityModalOpen] = useState(false)
  const [isQueryAuthorOpen, setIsQueryAuthorOpen] = useState(false)
  const [queryAuthorMessage, setQueryAuthorMessage] = useState("")
  const [preCheckChecks, setPreCheckChecks] = useState<Record<string, boolean>>({
    manuscriptFile: true,
    figuresTables: true,
    supplementary: true,
    ethicsDeclaration: true,
    scopeFit: true
  })
  const allChecksComplete = Object.values(preCheckChecks).every(Boolean)

  // Moderation Modal
  const [isModModalOpen, setIsModModalOpen] = useState(false)
  const [moderatingReview, setModeratingReview] = useState<JmReviewFeedback | null>(null)
  const [modEditedComments, setModEditedComments] = useState("")

  // Galley Proof Modal
  const [isGalleyModalOpen, setIsGalleyModalOpen] = useState(false)
  const [galleyManuscript, setGalleyManuscript] = useState<JmManuscript | null>(null)
  const [uploadedGalleyFileName, setUploadedGalleyFileName] = useState<string | null>(null)

  // Track Review Modal
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false)
  const [trackingManuscript, setTrackingManuscript] = useState<JmManuscript | null>(null)
  const [nudgedReviewers, setNudgedReviewers] = useState<Record<string, boolean>>({})
  const [extendedDays, setExtendedDays] = useState<Record<string, number>>({})

  // Fetch paper-specific reviewer history when Track Modal opens
  useEffect(() => {
    if (isTrackModalOpen && trackingManuscript?.id) {
      setIsLoadingPaperHistory(true)
      fetch(`/api/editorial360/reviewers?paperId=${encodeURIComponent(trackingManuscript.id)}`)
        .then(res => res.json())
        .then(data => {
          if (data?.ok && Array.isArray(data.history)) {
            setPaperReviewerHistory(data.history)
          }
        })
        .catch(e => console.error("Failed to load paper reviewer history:", e))
        .finally(() => setIsLoadingPaperHistory(false))
    }
  }, [isTrackModalOpen, trackingManuscript?.id])

  // Fetch global reviewer history for the Registry view
  useEffect(() => {
    if (activeTab === "users") {
      fetch("/api/editorial360/reviewers")
        .then(res => res.json())
        .then(data => {
          if (data?.ok && Array.isArray(data.history)) {
            setGlobalReviewerHistory(data.history)
          }
        })
        .catch(e => console.error("Failed to load global reviewer history:", e))
    }
  }, [activeTab, reviewerRegistryTab])

  // Dedicated Forensics Investigation Modal
  const [isForensicsModalOpen, setIsForensicsModalOpen] = useState(false)
  const [forensicsManuscript, setForensicsManuscript] = useState<JmManuscript | null>(null)
  const [forensicActionStatus, setForensicActionStatus] = useState<string | null>(null)

  // Reviewer Registry List
  const [reviewersList, setReviewersList] = useState<JmReviewer[]>([
    {
      id: "REV-REG-01",
      name: "Dr. Evelyn Vane",
      email: "e.vane@university-medical.edu",
      status: "Active",
      activeTasks: 1,
      maxTasks: 3,
      matchScore: 98,
      specialization: "AI Diagnostics, Clinical Imaging, Oncology",
      discipline: "Medicine",
      orcid: "0000-0002-1825-0097",
      completedReviews: 18,
      onTimeRate: 98,
      keywords: ["ai diagnostics", "clinical imaging", "oncology", "cardiovascular", "machine learning"]
    },
    {
      id: "REV-REG-02",
      name: "Dr. Marcus Vance",
      email: "m.vance@university-charite.de",
      status: "Busy",
      activeTasks: 2,
      maxTasks: 2,
      matchScore: 94,
      specialization: "Renewable Energy, Silicon Anodes, Battery Engineering",
      discipline: "Engineering",
      orcid: "0000-0004-7711-2093",
      completedReviews: 24,
      onTimeRate: 100,
      keywords: ["renewable energy", "silicon anodes", "battery", "energy storage", "polymers"]
    },
    {
      id: "REV-REG-03",
      name: "Prof. Hiroshi Tanaka",
      email: "h.tanaka@tokyo-institute.ac.jp",
      status: "Active",
      activeTasks: 0,
      maxTasks: 3,
      matchScore: 91,
      specialization: "Urban Planning, Green Spaces, Socio-Economics",
      discipline: "Social Sciences",
      orcid: "0000-0001-9284-7719",
      completedReviews: 12,
      onTimeRate: 94,
      keywords: ["urban green spaces", "socio-economic", "urban planning", "public policy"]
    },
    {
      id: "REV-REG-04",
      name: "Prof. Elena Rostova",
      email: "e.rostova@sorbonne-universite.fr",
      status: "Inactive",
      activeTasks: 0,
      maxTasks: 2,
      matchScore: 82,
      specialization: "Decentralized Ledgers, Cryptographic Security",
      discipline: "Engineering",
      orcid: "0000-0002-6019-3388",
      completedReviews: 15,
      onTimeRate: 92,
      keywords: ["decentralized ledgers", "blockchain", "security", "cryptography"]
    }
  ])

  // Register Reviewer Modal
  const [isAddReviewerOpen, setIsAddReviewerOpen] = useState(false)
  const [newRevName, setNewRevName] = useState("")
  const [newRevEmail, setNewRevEmail] = useState("")
  const [newRevSpecialty, setNewRevSpecialty] = useState("")
  const [newRevDiscipline, setNewRevDiscipline] = useState("Medicine")
  const [newRevOrcid, setNewRevOrcid] = useState("")

  // Revision Triage & Control Modal States
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false)
  const [selectedRevisionManuscript, setSelectedRevisionManuscript] = useState<JmManuscript | null>(null)
  const [selectedRound2Reviewers, setSelectedRound2Reviewers] = useState<string[]>([])
  const [editorRoutingNote, setEditorRoutingNote] = useState("")
  const [revisionActionSuccess, setRevisionActionSuccess] = useState<string | null>(null)
  const [editorPromptSuccess, setEditorPromptSuccess] = useState<string | null>(null)
  const [approvedReviewRemarks, setApprovedReviewRemarks] = useState<Record<string, boolean>>({})
  const [promptedEditors, setPromptedEditors] = useState<Record<string, boolean>>({})
  const [authorNudged, setAuthorNudged] = useState<Record<string, boolean>>({})
  const [authorExtendedDays, setAuthorExtendedDays] = useState<Record<string, number>>({})

  // Are-You-Sure Confirmation Dialog State
  const [confirmDialogState, setConfirmDialogState] = useState<{
    isOpen: boolean
    title: string
    message: string
    confirmButtonLabel: string
    confirmColorClass: string
    onConfirm: () => void
  }>({
    isOpen: false,
    title: "",
    message: "",
    confirmButtonLabel: "Yes, Proceed",
    confirmColorClass: "bg-[#0b99ff] hover:bg-[#0088e0]",
    onConfirm: () => {}
  })

  const triggerConfirm = (config: {
    title: string
    message: string
    confirmButtonLabel?: string
    confirmColorClass?: string
    onConfirm: () => void
  }) => {
    setConfirmDialogState({
      isOpen: true,
      title: config.title,
      message: config.message,
      confirmButtonLabel: config.confirmButtonLabel || "Yes, Proceed",
      confirmColorClass: config.confirmColorClass || "bg-[#0b99ff] hover:bg-[#0088e0]",
      onConfirm: config.onConfirm
    })
  }

  // Email Dispatch Review & Edit Dialog State
  const [dispatchDialogConfig, setDispatchDialogConfig] = useState<EmailDispatchConfig>({
    isOpen: false,
    recipientEmail: "",
    recipientName: "",
    onConfirmSend: async () => {},
    onCancel: () => {}
  })

  const openEmailDispatch = (config: Omit<EmailDispatchConfig, "isOpen" | "onCancel">) => {
    setDispatchDialogConfig({
      ...config,
      isOpen: true,
      onCancel: () => setDispatchDialogConfig((prev: EmailDispatchConfig) => ({ ...prev, isOpen: false }))
    })
  }

  // Filtered manuscripts
  const filteredManuscripts = useMemo(() => {
    return initialManuscripts.map(m => {
      // Ensure SOEAS-26-RS102 has 2 reviewers under Prof. Clara Zhang
      if (m.id === "SOEAS-26-RS102") {
        return {
          ...m,
          assignedEditorName: "Prof. Clara Zhang",
          reviewers: ["Dr. Evelyn Vane", "Dr. Marcus Vance"]
        }
      }
      // Ensure SOSSH-26-SRW107 is flagged with overdue reviewer under Prof. Aris Thorne
      if (m.id === "SOSSH-26-SRW107") {
        return {
          ...m,
          assignedEditorName: "Prof. Aris Thorne",
          reviewers: ["Prof. Hiroshi Tanaka"]
        }
      }
      // Ensure SOEAS-26-RS106 has active reviewers under Prof. Clara Zhang
      if (m.id === "SOEAS-26-RS106") {
        return {
          ...m,
          assignedEditorName: "Prof. Clara Zhang",
          reviewers: ["Dr. Evelyn Vane", "Prof. Elena Rostova"]
        }
      }
      return m
    }).filter(m => {
      const matchesSearch = searchTerm === "" || 
        m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.authorName && m.authorName.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesJournal = selectedJournal === "all" || 
        m.journal.toLowerCase().includes(selectedJournal.toLowerCase())

      // Stage filter
      if (selectedStageFilter === "triage") {
        return matchesSearch && matchesJournal && (m.status === "Awaiting Initial Check" || m.status === "Submitted" || m.status === "Draft")
      }
      if (selectedStageFilter === "review") {
        return matchesSearch && matchesJournal && m.status === "Under Review"
      }
      if (selectedStageFilter === "revisions" || (selectedStageFilter as string) === "revision") {
        return matchesSearch && matchesJournal && (m.status === "Revision Required" || m.status === "Revision Under Evaluation")
      }
      if (selectedStageFilter === "decisions" || (selectedStageFilter as string) === "decision") {
        return matchesSearch && matchesJournal && (m.status === "Accepted" || m.status === "Rejected" || (m.status as string) === "Declined")
      }
      if (selectedStageFilter === "production" || (selectedStageFilter as string) === "accepted") {
        return matchesSearch && matchesJournal && (m.status === "Accepted" || (m.status as string) === "In Production" || (m.status as string) === "Published") && m.status !== "Rejected" && (m.status as string) !== "Declined"
      }
      if (selectedStageFilter === "integrity") {
        return matchesSearch && matchesJournal && Boolean(m.integrityStatus === "Flagged" || (Number(m.plagiarismScore) > 15) || (Number(m.aiScore) > 30))
      }

      return matchesSearch && matchesJournal
    }).sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.lastActivity || a.revisionDate || a.date || 0).getTime()
      const timeB = new Date(b.updatedAt || b.lastActivity || b.revisionDate || b.date || 0).getTime()
      return timeB - timeA
    })
  }, [initialManuscripts, searchTerm, selectedJournal, selectedStageFilter])

  // Pipeline columns & counts
  const initialTriageList = initialManuscripts.filter(m => m.status === "Awaiting Initial Check" || m.status === "Submitted" || m.status === "Draft")
  const underReviewList = initialManuscripts.filter(m => m.status === "Under Review")
  const revisionList = initialManuscripts.filter(m => m.status === "Revision Required" || m.status === "Revision Under Evaluation")
  const decisionPendingList = revisionList
  const decisionsList = initialManuscripts.filter(m => m.status === "Accepted" || m.status === "Rejected" || (m.status as string) === "Declined")
  const productionList = initialManuscripts.filter(m => (m.status === "Accepted" || (m.status as string) === "In Production" || (m.status as string) === "Published") && m.status !== "Rejected" && (m.status as string) !== "Declined")
  const acceptedList = productionList
  const integrityCasesList = initialManuscripts.filter(m => Boolean(m.integrityStatus === "Flagged" || (Number(m.plagiarismScore) > 15) || (Number(m.aiScore) > 30)))

  // Handle open Assign Modal
  const handleOpenAssign = (ms: JmManuscript) => {
    setSelectedManuscript(ms)
    setSelectedReviewers(ms.reviewers || [])
    const initialSubject = `Review Invitation: ${ms.id} - ${ms.title}`
    const initialBody = `Dear {{recipientName}},

You have been invited to serve as an expert peer reviewer for the following manuscript submitted to ${ms.journal}:

Manuscript ID: ${ms.id}
Title: ${ms.title}

We would be grateful if you could provide your expert assessment on the originality, methodology, and data integrity of this work. This evaluation is conducted under double-blind peer review standards in full compliance with COPE guidelines.

We kindly request that you complete your evaluation within 14 calendar days of acceptance.

Please use the buttons below to access your reviewer scorecard or confirm your availability.`

    setAssignEmailSubject(initialSubject)
    setAssignEmailBody(initialBody)
    setAssignEmailTab("edit")
    setIsAssignModalOpen(true)
  }

  // Handle confirm assignment
  const handleConfirmAssignment = async () => {
    if (!selectedManuscript) return
    const msId = selectedManuscript.id
    const msTitle = selectedManuscript.title
    const msJournal = selectedManuscript.journal
    const editor = selectedEditor
    const reviewers = [...selectedReviewers]

    setIsAssignSending(true)
    if (onAssignEditor) onAssignEditor(msId, editor)
    if (onUpdateManuscriptStatus) onUpdateManuscriptStatus(msId, "Under Review")

    // Dispatch custom edited invitation emails to all selected reviewers
    await Promise.all(reviewers.map(async (revName) => {
      const extObj = externalReviewersList.find(x => x.name === revName)
      const revObj = reviewersList.find(x => x.name === revName)
      const targetEmail = extObj ? extObj.email : (revObj ? revObj.email : "reviewer@scholarlyopen.org")
      const personalizedBody = assignEmailBody.replace(/\{\{recipientName\}\}/g, revName)

      const acceptLink = `https://www.scholarlyopen.org/editorial360?action=accept&id=${encodeURIComponent(msId)}&journal=${encodeURIComponent(msJournal)}&email=${encodeURIComponent(targetEmail)}&name=${encodeURIComponent(revName)}`
      const declineLink = `https://www.scholarlyopen.org/editorial360?action=decline&id=${encodeURIComponent(msId)}&journal=${encodeURIComponent(msJournal)}&email=${encodeURIComponent(targetEmail)}&name=${encodeURIComponent(revName)}`

      const renderedHtml = generateBrandedEmailHtml({
        subject: assignEmailSubject,
        bodyText: personalizedBody,
        actionLabel: "Accept Review Invitation",
        actionUrl: acceptLink,
        secondaryActionLabel: "Decline Invitation",
        secondaryActionUrl: declineLink,
        journal: msJournal,
        paperId: msId,
        paperTitle: msTitle,
        recipientName: revName
      })

      // Record invitation in tracking store
      fetch("/api/editorial360/reviewers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paperId: msId,
          paperTitle: msTitle,
          journal: msJournal,
          reviewerName: revName,
          reviewerEmail: targetEmail
        })
      }).catch(e => console.error("Reviewer record error:", e))

      return fetch("/api/editorial360/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: targetEmail,
          recipientName: revName,
          customSubject: assignEmailSubject,
          customBody: personalizedBody,
          customHtml: renderedHtml,
          paperId: msId,
          paperTitle: msTitle,
          journal: msJournal
        })
      }).catch(e => console.error("Invitation email dispatch error:", e))
    }))

    // Refresh reviewer history cache immediately
    fetch("/api/editorial360/reviewers")
      .then(res => res.json())
      .then(data => {
        if (data?.ok && Array.isArray(data.history)) {
          setGlobalReviewerHistory(data.history)
          if (trackingManuscript?.id) {
            setPaperReviewerHistory(data.history.filter((h: any) => h.paperId.toLowerCase() === trackingManuscript.id.toLowerCase()))
          }
        }
      })
      .catch(e => console.error("Error refreshing reviewer history:", e))

    setIsAssignSending(false)
    setIsAssignModalOpen(false)
    setEditorPromptSuccess(isDe 
      ? `✓ Team zugewiesen und Einladungs-E-Mails an ${reviewers.length} Gutachter versendet!` 
      : `✓ Team allocated and review invitations dispatched to ${reviewers.length} reviewer(s)!`)
    setTimeout(() => setEditorPromptSuccess(null), 6000)
  }

  // Handle Open Moderation
  const handleOpenModeration = (rev: JmReviewFeedback) => {
    setModeratingReview(rev)
    setModEditedComments(rev.sanitizedCommentsAuthor || rev.commentsAuthor)
    setIsModModalOpen(true)
  }

  // Handle instant Confirm Moderation Release & Dispatch to Handling Editor
  const handleConfirmModerationRelease = () => {
    if (!moderatingReview) return
    const revId = moderatingReview.id
    const paperId = moderatingReview.paperId
    const editedText = modEditedComments
    const reviewerName = moderatingReview.reviewerName

    setIsModModalOpen(false)

    triggerConfirm({
      title: "Sanitize & Dispatch Remarks to Handling Editor?",
      message: `Are you sure you want to approve and dispatch these sanitized remarks for manuscript ${paperId}? Once dispatched, the Handling Editor will be granted access to view the comments and formulate the official decision letter.`,
      confirmButtonLabel: "Yes, Sanitize & Dispatch to Editor",
      confirmColorClass: "bg-[#0b99ff] hover:bg-[#0088e0]",
      onConfirm: () => {
        if (onReleaseComments) {
          onReleaseComments(revId, editedText)
        }
        setApprovedReviewRemarks(prev => ({
          ...prev,
          [reviewerName]: true,
          [revId]: true
        }))

        if (onAddNotification) {
          onAddNotification({
            id: `NOTIF-${Date.now()}`,
            timestamp: "Just now",
            paperId: paperId,
            paperTitle: `Manuscript ${paperId}`,
            journal: "Scholarly Open",
            sender: "Journal Manager Office",
            type: "review_complete",
            title: `Review Comments Dispatched for ${paperId}`,
            message: `Sanitized remarks for ${reviewerName} have been vetted and released to the Handling Editor. Comments are now unlocked in Editor Workspace.`,
            priority: "high"
          })
        }

        setEditorPromptSuccess(`✓ Remarks for ${reviewerName} sanitized & dispatched to Handling Editor. Handling Editor can now view comments.`)
        setTimeout(() => setEditorPromptSuccess(null), 6000)
      }
    })
  }

  // Handle Return to Author for Correction (Pre-Review Query)
  const handleSendPrecheckQuery = () => {
    if (!selectedManuscript) return
    const msId = selectedManuscript.id
    const msTitle = selectedManuscript.title
    const authorEmail = selectedManuscript.authorEmail || "author@university.edu"
    const authorName = selectedManuscript.authorName || "Author"
    const message = queryAuthorMessage || "Please provide high-resolution figures and a signed ethics/COI declaration statement."

    openEmailDispatch({
      templateId: "precheck_query",
      recipientEmail: authorEmail,
      recipientName: authorName,
      paperId: msId,
      paperTitle: msTitle,
      journal: selectedManuscript.journal,
      actionLabel: "Upload Corrected Files",
      actionUrl: "https://www.scholarlyopen.org/editorial360",
      defaultSubject: `Technical Pre-Check Query: Action Required for ${msId}`,
      defaultBody: `Dear ${authorName},\n\nThank you for submitting manuscript ${msId} (${msTitle}) to ${selectedManuscript.journal}.\n\nDuring the initial technical pre-check by our editorial office, the following item(s) require your attention before the paper can proceed to editorial triage:\n\n${message}\n\nPlease log into the editorial360 portal to upload the corrected files.`,
      onConfirmSend: async (data: any) => {
        setIsQueryAuthorOpen(false)
        setIsPreQualityModalOpen(false)
        setQueryAuthorMessage("")

        if (onUpdateManuscriptStatus) {
          onUpdateManuscriptStatus(msId, "Revision Required")
        }

        const res = await fetch("/api/editorial360/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: data.recipientEmail,
            customSubject: data.subject,
            customBody: data.bodyText,
            customHtml: data.renderedHtml,
            journal: selectedManuscript.journal,
            paperId: msId,
            paperTitle: msTitle,
            recipientName: authorName
          })
        })
        const resData = await res.json().catch(() => null)
        if (!res.ok || !resData?.success) {
          throw new Error(resData?.error || `Email dispatch failed (HTTP ${res.status})`)
        }

        setDispatchDialogConfig((prev: EmailDispatchConfig) => ({ ...prev, isOpen: false }))
      }
    })
  }

  // Handle Reviewer Status Cycling (Active -> Sabbatical -> Inactive -> Active)
  const handleCycleReviewerStatus = (revId: string) => {
    setReviewersList(prev => prev.map(r => {
      if (r.id === revId) {
        let nextStatus: "Active" | "Busy" | "Inactive" = "Active"
        if (r.status === "Active") nextStatus = "Busy"
        else if (r.status === "Busy") nextStatus = "Inactive"
        else if (r.status === "Inactive") nextStatus = "Active"
        return { ...r, status: nextStatus }
      }
      return r
    }))
  }

  // Handle Register New Reviewer
  const handleAddReviewer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRevName || !newRevEmail) return

    const revName = newRevName
    const revEmail = newRevEmail
    const revSpec = newRevSpecialty || "General Academic Research"
    const revDisc = newRevDiscipline
    const revOrcid = newRevOrcid || "0000-0002-1825-0097"

    const newRev: JmReviewer = {
      id: `REV-REG-${Math.floor(Math.random() * 90) + 10}`,
      name: revName,
      email: revEmail,
      status: "Active",
      activeTasks: 0,
      maxTasks: 3,
      matchScore: 88,
      specialization: revSpec,
      discipline: revDisc,
      orcid: revOrcid,
      completedReviews: 0,
      onTimeRate: 100,
      keywords: revSpec.split(",").map(k => k.trim().toLowerCase())
    }

    setReviewersList(prev => [newRev, ...prev])
    setIsAddReviewerOpen(false)
    setNewRevName("")
    setNewRevEmail("")
    setNewRevSpecialty("")
    setNewRevOrcid("")

    // Send Welcome Email to newly invited reviewer
    fetch("/api/editorial360/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: revEmail,
        recipientName: revName,
        subject: "Welcome to the Scholarly Open Reviewer Registry",
        template: "reviewer_welcome",
        journal: "Scholarly Open"
      })
    }).catch(e => console.error(e))
  }

  // Handle Reviewer Reminder Nudge
  const handleNudgeReviewer = (revName: string) => {
    if (!trackingManuscript) return
    const revObj = reviewersList.find(x => x.name === revName)
    const targetEmail = revObj ? revObj.email : "reviewer@scholarlyopen.org"

    openEmailDispatch({
      templateId: "reviewer_reminder",
      recipientEmail: targetEmail,
      recipientName: revName,
      paperId: trackingManuscript.id,
      paperTitle: trackingManuscript.title,
      journal: trackingManuscript.journal,
      actionLabel: "Access Reviewer Scorecard",
      actionUrl: "https://www.scholarlyopen.org/editorial360",
      defaultSubject: `Reminder: Double-Blind Review Pending for ${trackingManuscript.id}`,
      defaultBody: `Dear ${revName},\n\nThis is a friendly reminder regarding your double-blind peer review for manuscript ${trackingManuscript.id} (${trackingManuscript.title}) submitted to ${trackingManuscript.journal}.\n\nWe kindly request that you complete your scorecard report or let us know if you require a deadline extension.\n\nThank you for supporting rigorous peer review.`,
      onConfirmSend: async (data: any) => {
        setNudgedReviewers(prev => ({ ...prev, [revName]: true }))
        const res = await fetch("/api/editorial360/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: data.recipientEmail,
            customSubject: data.subject,
            customBody: data.bodyText,
            customHtml: data.renderedHtml,
            journal: trackingManuscript.journal,
            paperId: trackingManuscript.id,
            paperTitle: trackingManuscript.title,
            recipientName: revName
          })
        })
        const resData = await res.json().catch(() => null)
        if (!res.ok || !resData?.success) {
          throw new Error(resData?.error || `Email dispatch failed (HTTP ${res.status})`)
        }
        setDispatchDialogConfig((prev: EmailDispatchConfig) => ({ ...prev, isOpen: false }))
      }
    })
  }

  // Handle Reviewer Deadline Extension
  const handleExtendReviewer = (revName: string) => {
    setExtendedDays(prev => ({ ...prev, [revName]: (prev[revName] || 0) + 7 }))
  }

  // Handle Reviewer Deadline Extension Reset / Undo
  const handleResetReviewerExtension = (revName: string) => {
    setExtendedDays(prev => ({ ...prev, [revName]: 0 }))
  }

  // Handle Author Revision Reminder Nudge
  const handleNudgeAuthor = (ms: JmManuscript) => {
    const authorEmail = ms.authorEmail || "author@university.edu"
    const authorName = ms.authorName || "Author"

    openEmailDispatch({
      templateId: "author_reminder",
      recipientEmail: authorEmail,
      recipientName: authorName,
      paperId: ms.id,
      paperTitle: ms.title,
      journal: ms.journal,
      actionLabel: "Upload Revised Manuscript",
      actionUrl: "https://www.scholarlyopen.org/editorial360",
      defaultSubject: `Reminder: Revision & Rebuttal Due for ${ms.id}`,
      defaultBody: `Dear ${authorName},\n\nThis is a friendly reminder that the revision and rebuttal for your manuscript ${ms.id} (${ms.title}) submitted to ${ms.journal} are currently pending.\n\nPlease upload your revised manuscript, tracked-changes version, and point-by-point rebuttal letter through the Author Portal.\n\nIf you require an extension to complete additional data analysis, please reply to this notice.`,
      onConfirmSend: async (data: any) => {
        setAuthorNudged(prev => ({ ...prev, [ms.id]: true }))
        const res = await fetch("/api/editorial360/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: data.recipientEmail,
            customSubject: data.subject,
            customBody: data.bodyText,
            customHtml: data.renderedHtml,
            journal: ms.journal,
            paperId: ms.id,
            paperTitle: ms.title,
            recipientName: authorName
          })
        })
        const resData = await res.json().catch(() => null)
        if (!res.ok || !resData?.success) {
          throw new Error(resData?.error || `Email dispatch failed (HTTP ${res.status})`)
        }

        setEditorPromptSuccess(`✓ Revision reminder email dispatched to ${authorName}.`)
        setTimeout(() => setEditorPromptSuccess(null), 6000)
        setDispatchDialogConfig((prev: EmailDispatchConfig) => ({ ...prev, isOpen: false }))
      }
    })
  }

  // Handle Author Deadline Extension
  const handleExtendAuthorDeadline = (msId: string) => {
    setAuthorExtendedDays(prev => ({ ...prev, [msId]: (prev[msId] || 0) + 14 }))
    setEditorPromptSuccess(`✓ Revision deadline extended by +14 days for ${msId}.`)
    setTimeout(() => setEditorPromptSuccess(null), 6000)
  }

  // Handle Reset Author Deadline Extension
  const handleResetAuthorExtension = (msId: string) => {
    setAuthorExtendedDays(prev => ({ ...prev, [msId]: 0 }))
  }

  // Helper for rendering Stage Pill Badge in List View
  const renderStageBadge = (ms: JmManuscript) => {
    if (selectedStageFilter === "integrity" || ms.integrityStatus === "Flagged" || (Number(ms.plagiarismScore) > 15) || (Number(ms.aiScore) > 30)) {
      return (
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 whitespace-nowrap shadow-2xs">
            <ShieldAlert className="h-3 w-3 text-red-600" />
            Integrity Flagged
          </span>
          <span className="text-[11px] font-semibold text-red-600 dark:text-red-400 block px-0.5 whitespace-nowrap">
            Plag: {ms.plagiarismScore || 0}% • AI: {ms.aiScore || 0}%
          </span>
        </div>
      )
    }
    if (ms.status === "Awaiting Initial Check" || ms.status === "Submitted" || ms.status === "Draft") {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/80 dark:border-amber-900/30 whitespace-nowrap">
          Initial Triage
        </span>
      )
    }
    if (ms.status === "Under Review") {
      const isOverdue = ms.id === "SOSSH-26-SRW107"
      const isReviewsComplete = ms.id === "SOEAS-26-RS102" || (ms.reviewers && ms.reviewers.length > 0 && ms.reviewers.every(r => r === "Dr. Evelyn Vane" || r === "Dr. Marcus Vance"))
      const isPrompted = !!promptedEditors[ms.id]

      if (isPrompted) {
        return (
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700 whitespace-nowrap shadow-2xs">
              <Check className="h-3 w-3 text-indigo-600" />
              Editor Prompted ✓
            </span>
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 block px-0.5 whitespace-nowrap">
              Decision Pending
            </span>
          </div>
        )
      }

      if (isReviewsComplete) {
        return (
          <div className="space-y-1">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/50 whitespace-nowrap shadow-2xs">
              Reviews In (Decision Pending)
            </span>
            <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 block px-0.5 whitespace-nowrap">
              2/2 Reports Complete
            </span>
          </div>
        )
      }

      return (
        <div className="space-y-1">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-[#0b99ff]/10 text-[#0b99ff] border border-[#0b99ff]/20 whitespace-nowrap">
            Under Review
          </span>
          <span className={`text-[11px] font-bold block px-0.5 whitespace-nowrap ${
            isOverdue ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
          }`}>
            {isOverdue ? "Overdue (3d)" : `Due in ${ms.id === "SOEAS-26-RS106" ? "5d" : "11d"}`}
          </span>
        </div>
      )
    }
    if (ms.status === "Revision Under Evaluation") {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 whitespace-nowrap shadow-2xs">
          Revised Submitted ✓
        </span>
      )
    }
    if (ms.status === "Revision Required") {
      const extraDays = authorExtendedDays[ms.id] || 0
      const remainingDays = 12 + extraDays
      return (
        <div className="space-y-1">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/30 whitespace-nowrap">
            Author Revising
          </span>
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 block px-0.5 whitespace-nowrap">
            Due in {remainingDays}d
          </span>
        </div>
      )
    }
    if (ms.status === "Rejected" || (ms.status as string) === "Declined") {
      return (
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 whitespace-nowrap shadow-2xs">
            <XCircle className="h-3 w-3 text-rose-600 dark:text-rose-400" />
            Declined ✗
          </span>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block px-0.5 whitespace-nowrap">
            Decision Dispatched
          </span>
        </div>
      )
    }
    if (ms.status === "Accepted") {
      return (
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 whitespace-nowrap shadow-2xs">
            <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
            {selectedStageFilter === "production" ? "DOI Assigned ✓" : "Accepted ✓"}
          </span>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block px-0.5 whitespace-nowrap">
            {selectedStageFilter === "production" ? "Ready for Publishing" : "Ready for Production"}
          </span>
        </div>
      )
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-900/30 whitespace-nowrap">
        DOI Assigned ✓
      </span>
    )
  }

  // =========================================================================
  // RENDER ECR TALENT HUB & INVITATIONS SUITE
  // =========================================================================
  const renderEcrTalentHub = () => {
    return (
      <div className="space-y-5">
        {/* 1. Header Banner & Mission (Standard Clean UI) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-[#0b99ff] border border-sky-100 dark:border-sky-900/40">
                  <GraduationCap className="h-4 w-4" />
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                  ECR Talent Hub
                </h4>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  bioRxiv · medRxiv · arXiv
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                Source and invite preprint lead authors for peer review, training masterclasses, and submissions.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Reviewer Incentive</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1 mt-0.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  +15 to +25 Pts / Review
                </span>
              </div>
            </div>
          </div>

          {/* Source Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <span>Source:</span>
            </span>
            {[
              { id: "all", label: "All Repositories", count: activeEcrResults.length || "12+" },
              { id: "biorxiv", label: "bioRxiv", count: activeEcrResults.filter(r => r.ecrSource === "bioRxiv").length || "Bio" },
              { id: "medrxiv", label: "medRxiv", count: activeEcrResults.filter(r => r.ecrSource === "medRxiv").length || "Med" },
              { id: "arxiv", label: "arXiv", count: activeEcrResults.filter(r => r.ecrSource === "arXiv").length || "AI/CS" },
              { id: "openalex", label: "OpenAlex ECR", count: activeEcrResults.filter(r => r.ecrSource === "OpenAlex ECR").length || "ECR" }
            ].map(src => (
              <button
                key={src.id}
                type="button"
                onClick={() => {
                  setEcrSource(src.id as any)
                  handleSearchEcrScholars(ecrKeyword, src.id as any)
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border ${
                  ecrSource === src.id
                    ? "bg-[#0b99ff] text-white border-[#0b99ff] shadow-xs"
                    : "bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                }`}
              >
                <span>{src.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  ecrSource === src.id ? "bg-white/20 text-white" : "bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                }`}>
                  {src.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Interactive Search & Journal Target Suite */}
        <div className="p-4 rounded-xl border border-slate-200/90 dark:border-[#272832] bg-white dark:bg-[#18191e] space-y-3 shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={ecrKeyword}
                onChange={(e) => setEcrKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearchEcrScholars()
                }}
                placeholder="Search ECR preprints by keyword, gene, technology, or author..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-[#131418] border border-slate-200 dark:border-[#272832] rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={scoutTargetJournal}
                onChange={(e) => setScoutTargetJournal(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-[#131418] border border-slate-200 dark:border-[#272832] rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0b99ff] cursor-pointer"
              >
                <option value="all">All Scholarly Open Journals (13 Desks)</option>
                {OFFICIAL_JOURNALS.map((j) => (
                  <option key={j.name} value={j.name}>
                    {j.name} ({j.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                value={scoutCountry}
                onChange={(e) => {
                  const newCountry = e.target.value
                  setScoutCountry(newCountry)
                  handleSearchEcrScholars(undefined, undefined, newCountry)
                }}
                className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-[#131418] border border-slate-200 dark:border-[#272832] rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0b99ff] cursor-pointer"
                title="Filter by country or region"
              >
                <optgroup label="🌍 Regional Groupings">
                  {REGIONAL_COUNTRY_GROUPS.map((g) => (
                    <option key={g.code} value={g.code}>
                      {g.flag} {g.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="🌐 All Countries (A - Z)">
                  {GLOBAL_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name} ({c.code.toUpperCase()})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div className="md:col-span-2">
              <Button
                onClick={() => handleSearchEcrScholars()}
                disabled={isEcrScouting}
                className="w-full h-10 text-xs font-bold bg-[#0b99ff] hover:bg-[#0088e0] text-white rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isEcrScouting ? (
                  <>
                    <RotateCcw className="h-3.5 w-3.5 animate-spin" />
                    <span>Scouting...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-3.5 w-3.5" />
                    <span>Search ECRs</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Batch Actions Bar (When items selected) */}
          {ecrSelectedNames.length > 0 && (
            <div className="p-3 rounded-xl bg-[#0b99ff]/10 border border-[#0b99ff]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0b99ff] bg-[#0b99ff]/20 px-2.5 py-0.5 rounded-full">
                  {ecrSelectedNames.length} Candidates Selected
                </span>
                <button
                  onClick={() => setEcrSelectedNames([])}
                  className="text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline cursor-pointer"
                >
                  Clear
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  size="sm"
                  onClick={() => {
                    const scholarsToInvite = activeEcrResults.filter(r => ecrSelectedNames.includes(r.name))
                    if (scholarsToInvite.length > 0) {
                      handleBatchDispatchScoutOutreach(scholarsToInvite, "ecr_reviewer")
                    }
                  }}
                  className="h-8 text-xs font-bold bg-[#0b99ff] hover:bg-[#0088e0] text-white rounded-lg cursor-pointer"
                >
                  <UserPlus className="h-3.5 w-3.5 mr-1" />
                  Invite Reviewers ({ecrSelectedNames.length})
                </Button>

                <Button
                  size="sm"
                  onClick={() => {
                    const scholarsToInvite = activeEcrResults.filter(r => ecrSelectedNames.includes(r.name))
                    if (scholarsToInvite.length > 0) {
                      handleBatchDispatchScoutOutreach(scholarsToInvite, "ecr_masterclass")
                    }
                  }}
                  className="h-8 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer"
                >
                  <GraduationCap className="h-3.5 w-3.5 mr-1" />
                  Invite to Masterclass
                </Button>

                <Button
                  size="sm"
                  onClick={() => {
                    const scholarsToInvite = activeEcrResults.filter(r => ecrSelectedNames.includes(r.name))
                    if (scholarsToInvite.length > 0) {
                      handleBatchDispatchScoutOutreach(scholarsToInvite, "ecr_author_waiver")
                    }
                  }}
                  className="h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5 mr-1" />
                  Call for Papers (50% Waiver)
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Candidate Cards Grid */}
        {activeEcrResults.length === 0 && !isEcrScouting ? (
          <div className="p-12 text-center bg-white dark:bg-[#18191e] rounded-2xl border border-slate-200/90 dark:border-[#272832] space-y-3">
            <GraduationCap className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No ECR preprints found matching "{ecrKeyword}"
            </div>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Try broader keywords like "machine learning", "oncology", "materials", or select "All Repositories".
            </p>
            <Button
              onClick={() => {
                setEcrKeyword("Biomedical Engineering & AI Preprints")
                handleSearchEcrScholars("Biomedical Engineering & AI Preprints", "all")
              }}
              variant="outline"
              size="sm"
              className="text-xs rounded-xl"
            >
              Reset to Recommended ECR Pool
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeEcrResults.map((candidate, idx) => {
              const isSelected = ecrSelectedNames.includes(candidate.name)
              const sourceBadgeColor = 
                candidate.ecrSource === "bioRxiv" ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900/40" :
                candidate.ecrSource === "medRxiv" ? "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-900/40" :
                candidate.ecrSource === "arXiv" ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900/40" :
                "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-900/40"

              return (
                <div
                  key={candidate.name + idx}
                  className={`p-4 rounded-2xl border transition-all space-y-3.5 shadow-2xs ${
                    isSelected
                      ? "border-[#0b99ff] bg-[#0b99ff]/[0.02] dark:bg-sky-950/[0.08] ring-1 ring-[#0b99ff]"
                      : "border-slate-200/90 dark:border-[#272832] bg-white dark:bg-[#18191e] hover:border-slate-300"
                  }`}
                >
                  {/* Top Bar: Source + Career Stage + Verification Status + Checkbox */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sourceBadgeColor}`}>
                        {candidate.ecrSource || "Preprint"}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                        {candidate.careerStage || "Early Career Researcher"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/40">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        <span>{candidate.verificationStatus || "Verified Archival Record"}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDismissCandidate(candidate)}
                        className="h-6 w-6 p-0 text-slate-400 hover:text-rose-600 hover:border-rose-300 dark:hover:border-rose-900 rounded-md cursor-pointer transition-colors"
                        title="Dismiss candidate (deceased or unsuitable)"
                      >
                        <UserX className="h-3 w-3" />
                      </Button>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEcrSelectedNames(prev => [...prev, candidate.name])
                            } else {
                              setEcrSelectedNames(prev => prev.filter(n => n !== candidate.name))
                            }
                          }}
                          className="rounded border-slate-300 text-[#0b99ff] focus:ring-[#0b99ff]"
                        />
                        <span className="text-[11px] text-slate-400 select-none">Select</span>
                      </label>
                    </div>
                  </div>

                  {/* Scholar Info with Clickable ORCID and Google Scholar Cross-Verification */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h5 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {candidate.name}
                      </h5>
                      {candidate.orcid && (
                        <a
                          href={candidate.orcidUrl || `https://orcid.org/${candidate.orcid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 transition-colors shrink-0 group cursor-pointer"
                          title="Verify researcher in ORCID Public Registry"
                        >
                          <span className="font-bold text-emerald-600">iD</span>
                          <span>ORCID: {candidate.orcid}</span>
                          <ExternalLink className="h-2.5 w-2.5 opacity-60 group-hover:opacity-100" />
                        </a>
                      )}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {candidate.institution}
                    </div>
                    {/* Harvested Contact Email Box (Editable) */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Contact Email:
                        </span>
                        {candidate.isCustomEmail ? (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            ✓ Confirmed
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            ✓ Scraped from Source Paper
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="email"
                          value={candidate.email || ""}
                          onChange={(e) => handleUpdateEcrEmail(idx, e.target.value)}
                          placeholder="author@university.edu"
                          className="w-full text-xs font-mono pl-3 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                          title="Click to edit or paste confirmed email"
                        />
                        <Edit3 className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                      </div>
                      <div className="flex items-center justify-between gap-2 pt-0.5 flex-wrap">
                        <a
                          href={`https://www.google.com/search?q=${encodeURIComponent(`${candidate.name} ${candidate.institution || ''} email contact`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#0b99ff] hover:underline bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-800/60"
                          title="Search faculty directory or lab webpage for official email"
                        >
                          <Search className="h-2.5 w-2.5" />
                          <span>Search Faculty Email</span>
                          <ExternalLink className="h-2 w-2" />
                        </a>
                        <a
                          href={`https://scholar.google.com/scholar?q=${encodeURIComponent(`${candidate.name} ${candidate.institution ? candidate.institution.split("·")[0].trim() : ""}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 dark:text-slate-400 hover:text-[#0b99ff] hover:underline cursor-pointer"
                          title="Cross-verify scholar publications and citations on Google Scholar"
                        >
                          <Search className="h-2.5 w-2.5" />
                          <span>Google Scholar ↗</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Preprint / Research Work Details with Direct Verified Source Link */}
                  {candidate.preprintTitle && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-200/80 dark:border-[#272832] space-y-2 text-xs">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between gap-2 flex-wrap">
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5 text-[#0b99ff]" />
                          <span>Preprint Work ({candidate.preprintDate || "2026"})</span>
                        </span>
                        {candidate.preprintDoi && (
                          <a
                            href={
                              candidate.sourceUrl ||
                              (candidate.preprintDoi.startsWith("arXiv:")
                                ? `https://arxiv.org/abs/${candidate.preprintDoi.replace("arXiv:", "")}`
                                : `https://doi.org/${candidate.preprintDoi}`)
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[#0b99ff] hover:text-[#0077cc] hover:underline inline-flex items-center gap-1 truncate max-w-[200px] cursor-pointer"
                            title={`Open ${candidate.preprintDoi} directly on official repository`}
                          >
                            <span>{candidate.preprintDoi}</span>
                            <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                          </a>
                        )}
                      </div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                        "{candidate.preprintTitle}"
                      </p>

                      {/* Prominent Cross-Verification Source Bar */}
                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          Repository: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{candidate.ecrSource || "Open Archive"}</strong>
                        </span>
                        <a
                          href={
                            candidate.sourceUrl ||
                            (candidate.preprintDoi?.startsWith("arXiv:")
                              ? `https://arxiv.org/abs/${candidate.preprintDoi.replace("arXiv:", "")}`
                              : `https://doi.org/${candidate.preprintDoi}`)
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-[#0b99ff] hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800/60 text-[11px] font-bold transition-all shadow-2xs group cursor-pointer"
                        >
                          <ExternalLink className="h-3 w-3 text-[#0b99ff]" />
                          <span>View {candidate.ecrSource || "Preprint"} Source ↗</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Specialty & Rationale */}
                  <div className="space-y-1 text-xs">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      <strong className="text-slate-700 dark:text-slate-300">Field:</strong> {candidate.specialty}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      <strong className="text-slate-700 dark:text-slate-300">Metrics:</strong> {candidate.metrics}
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 italic bg-amber-50/50 dark:bg-amber-950/20 p-2 rounded-lg border border-amber-200/50 dark:border-amber-900/20">
                      💡 {candidate.editorialRationale}
                    </div>
                  </div>

                  {/* 3 Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 dark:border-[#272832] grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleDispatchScoutOutreach(candidate, "ecr_reviewer")}
                      className="h-8 text-xs font-bold bg-[#0b99ff] hover:bg-[#0088e0] text-white rounded-xl shadow-2xs cursor-pointer"
                    >
                      <UserPlus className="h-3 w-3 mr-1" />
                      Invite Reviewer
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleDispatchScoutOutreach(candidate, "ecr_masterclass")}
                      className="h-8 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-2xs cursor-pointer"
                    >
                      <GraduationCap className="h-3 w-3 mr-1" />
                      Masterclass
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleDispatchScoutOutreach(candidate, "ecr_author_waiver")}
                      className="h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-2xs cursor-pointer"
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Call for Papers
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* 0. Dynamic In-House Journal Manager Desk Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="relative h-11 w-11 rounded-full overflow-hidden bg-gradient-to-tr from-[#0b99ff] to-[#0077cc] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm ring-2 ring-slate-200 dark:ring-[#272832]">
            <span>{user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : "NF"}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                {user?.name || "Noor F."}
              </h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#0b99ff]/10 text-[#0b99ff] border border-[#0b99ff]/20">
                {user?.role || "Editorial Manager"}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {user?.office || "Scholarly Open Headquarters (Mainz, Germany)"} • {user?.country || "Germany"} • <span className="text-[#0b99ff] font-medium">{user?.email || "scholarlyopen@gmail.com"}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-900/30">
            ● Active Desk
          </span>
        </div>
      </div>

      {/* 1. Standard Unified 4-Stat Metric Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl shadow-xs">
        <div className="space-y-1 pr-4 lg:border-r border-slate-100 dark:border-[#272832]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Submissions
          </span>
          <div className="text-lg font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
            {initialManuscripts.length} <span className="text-xs font-medium text-slate-500">Manuscripts</span>
          </div>
          <span className="text-xs font-medium text-slate-500 block">Active registry volume</span>
        </div>

        <div className="space-y-1 px-0 lg:px-4 lg:border-r border-slate-100 dark:border-[#272832]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Pending Assignment
          </span>
          <div className="text-lg font-bold tracking-tight text-orange-600 dark:text-orange-400 tabular-nums">
            {initialTriageList.length} <span className="text-xs font-medium text-orange-500">Awaiting Triage</span>
          </div>
          <span className="text-xs font-medium text-slate-500 block">Requires Editor allocation</span>
        </div>

        <div className="space-y-1 pr-4 lg:px-4 lg:border-r border-slate-100 dark:border-[#272832]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Under Review
          </span>
          <div className="text-lg font-bold tracking-tight text-[#0b99ff] tabular-nums">
            {underReviewList.length} <span className="text-xs font-medium text-[#0b99ff]">In Progress</span>
          </div>
          <span className="text-xs font-medium text-slate-500 block">Double-blind peer review</span>
        </div>

        <div className="space-y-1 pl-0 lg:pl-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Turnaround Time
          </span>
          <div className="text-lg font-bold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
            18.4 <span className="text-xs font-medium text-emerald-500">Days (On Target)</span>
          </div>
          <span className="text-xs font-medium text-slate-500 block">Benchmark &lt; 21.0 days</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 0: NOTIFICATIONS & ACTIVITY (COMMON ACROSS JM, EDITOR, IM)             */}
      {/* ========================================================================= */}
      {activeTab === "activity" && (
        <CrossDeskActivityFeed
          language={language}
          currentRole="jm"
          notifications={notifications}
          onViewPaperDossier={(paperId) => {
            let match = initialManuscripts.find(m => m.id === paperId)
            if (!match) {
              const notif = notifications.find(n => n.paperId === paperId)
              match = {
                id: paperId,
                title: notif?.paperTitle || "Submitted Manuscript",
                journal: notif?.journal || "Social Sciences & Humanities",
                status: "Under Review",
                date: "2026-06-03",
                reviewers: ["Prof. Aris Thorne", "Prof. Hiroshi Tanaka"],
                integrityStatus: "Clean",
                authorName: "Dr. Elena Rostova",
                authorEmail: "e.rostova@urbanresearch.org",
                authorAffiliation: "Department of Urban Planning & Social Geography",
                assignedEditorName: "Prof. Aris Thorne",
                abstract: "Spatial analysis and econometric evaluation of park accessibility across 14 European metropolitan regions assessing socio-economic disparity indexes.",
                keywords: "Urban Planning, Green Spaces, Socio-Spatial Equity"
              } as JmManuscript
            }
            setSelectedManuscript(match)
            setIsAssignModalOpen(true)
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* 2. SUBMISSIONS PIPELINE (UNIFIED LIST VIEW)                               */}
      {/* ========================================================================= */}
      {activeTab === "board" && (
        <div className="space-y-4">
          {/* Top Control Bar: Search & Journal Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#18191e] p-3.5 rounded-2xl border border-slate-200/90 dark:border-[#272832] shadow-xs">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search manuscripts by ID, title, or author..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
              />
            </div>
            
            <div className="w-full sm:w-auto">
              <select
                value={selectedJournal}
                onChange={(e) => setSelectedJournal(e.target.value)}
                className="w-full sm:w-auto text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
              >
                <option value="all">All Journals</option>
                <option value="Medicine">Scholarly Open: Medicine</option>
                <option value="Engineering">Engineering & Applied Sciences</option>
                <option value="Social">Social Sciences & Humanities</option>
                <option value="Decarbonization">Decarbonization & Carbon Tech</option>
              </select>
            </div>
          </div>

          {/* Stage Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { key: "all", label: isDe ? "Alle" : "All", count: initialManuscripts.length },
              { key: "triage", label: isDe ? "Triage" : "Triage", count: initialTriageList.length },
              { key: "review", label: isDe ? "In Begutachtung" : "In Review", count: underReviewList.length },
              { key: "revisions", label: isDe ? "Revisionen" : "Revisions", count: revisionList.length },
              { key: "decisions", label: isDe ? "Entscheidungen" : "Decisions", count: decisionsList.length },
              { key: "production", label: isDe ? "Produktion" : "Production", count: productionList.length },
              { key: "integrity", label: isDe ? "Integrität" : "Integrity", count: integrityCasesList.length, isAlert: true }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setSelectedStageFilter(tab.key as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  selectedStageFilter === tab.key
                    ? (tab as any).isAlert
                      ? "bg-red-600 text-white border-red-600 shadow-xs"
                      : "bg-[#0b99ff] text-white border-[#0b99ff] shadow-xs"
                    : (tab as any).isAlert
                    ? "bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/40"
                    : "bg-white dark:bg-[#18191e] text-slate-600 dark:text-slate-400 border-slate-200/90 dark:border-[#272832] hover:border-slate-300"
                }`}
              >
                {(tab as any).isAlert && <ShieldAlert className="h-3.5 w-3.5 text-current" />}
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  selectedStageFilter === tab.key
                    ? "bg-white/20 text-white"
                    : (tab as any).isAlert
                    ? "bg-red-200 dark:bg-red-900/60 text-red-800 dark:text-red-200"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Full-Width Clean Table */}
          <Card className="bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs min-w-[920px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                    <th className="px-4 py-3.5 whitespace-nowrap w-[150px]">ID & Date</th>
                    <th className="px-4 py-3.5 min-w-[260px]">Manuscript</th>
                    <th className="px-4 py-3.5 whitespace-nowrap w-[150px]">Stage</th>
                    <th className="px-4 py-3.5 whitespace-nowrap w-[200px]">Assignment</th>
                    <th className="px-4 py-3.5 whitespace-nowrap text-center min-w-[220px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredManuscripts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-slate-400 font-medium">
                        No manuscripts found matching your search or filters.
                      </td>
                    </tr>
                  ) : (
                    filteredManuscripts.map((ms) => {
                      const isTriage = ms.status === "Awaiting Initial Check" || ms.status === "Submitted" || ms.status === "Draft"
                      const isUnderReview = ms.status === "Under Review"
                      const isRevision = ms.status === "Revision Required" || ms.status === "Revision Under Evaluation"
                      const isAccepted = ms.status === "Accepted"
                      const isDeclined = ms.status === "Rejected" || (ms.status as string) === "Declined"
                      const isDecided = isAccepted || isDeclined

                      return (
                        <tr key={ms.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/50 transition-colors">
                          
                          {/* 1. ID & Date */}
                          <td className="px-5 py-4 align-top w-[170px] whitespace-nowrap">
                            <div className="flex flex-col items-start space-y-1">
                              <span className="font-bold text-[#0b99ff] bg-[#0b99ff]/10 px-2.5 py-0.5 rounded-md inline-block whitespace-nowrap border border-[#0b99ff]/20">
                                {ms.id}
                              </span>
                              <div className="text-slate-400 text-[11px] font-medium px-0.5 whitespace-nowrap">{ms.date}</div>
                            </div>
                          </td>

                          {/* 2. Title & Journal */}
                          <td className="px-5 py-4 align-top min-w-[280px]">
                            <div className="space-y-1">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                                {ms.title}
                              </h4>
                              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                {ms.journal}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                Author: <span className="font-semibold text-slate-700 dark:text-slate-300">{ms.authorName || "Principal Author"}</span>
                              </div>
                              {isAccepted && (
                                <div className="text-[11px] text-slate-500 font-normal pt-0.5">
                                  DOI: <span className="font-medium text-slate-700 dark:text-slate-300">10.59236/{ms.journal.toLowerCase().includes("medicine") ? "somed" : "soeas"}.2026.{ms.id.slice(-3)}</span>
                                </div>
                              )}
                              {isDeclined && (
                                <div className="text-[11px] text-rose-500 dark:text-rose-400 font-medium pt-0.5">
                                  Outcome: Formal Decision Dispatched (Declined)
                                </div>
                              )}
                            </div>
                          </td>

                          {/* 3. Stage Badge */}
                          <td className="px-5 py-4 align-top w-[160px] whitespace-nowrap">
                            {renderStageBadge(ms)}
                          </td>

                          {/* 4. Editor & Reviewers */}
                          <td className="px-5 py-4 align-top text-xs w-[240px]">
                            {isTriage ? (
                              <span className="text-slate-400 italic">Unassigned (Awaiting allocation)</span>
                            ) : (
                              <div className="space-y-1">
                                <div>
                                  <span className="text-slate-400 font-medium">Editor:</span>{" "}
                                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                                    {ms.assignedEditorName || "Prof. Clara Zhang"}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-slate-400 font-medium">Reviewers:</span>{" "}
                                  <span className="font-semibold text-[#0b99ff]">
                                    {ms.reviewers?.join(", ") || "Dr. Evelyn Vane, Dr. Marcus Vance"}
                                  </span>
                                </div>
                              </div>
                            )}
                          </td>

                          {/* 5. Actions (Centered) */}
                          <td className="px-4 py-4 align-top text-center min-w-[220px]">
                            <div className="flex items-center justify-center gap-1.5 flex-wrap">
                              {isTriage && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedManuscript(ms)
                                      setIsPreQualityModalOpen(true)
                                    }}
                                    className="h-8 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 border-slate-200 dark:border-slate-800 px-2.5 rounded-lg cursor-pointer"
                                  >
                                    <Eye className="h-3.5 w-3.5 mr-1 text-[#0b99ff]" />
                                    Pre-Check
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleOpenAssign(ms)}
                                    className="h-8 text-xs font-bold bg-[#0b99ff] hover:bg-[#0088e0] text-white px-3 rounded-lg cursor-pointer"
                                  >
                                    Assign
                                  </Button>
                                </>
                              )}

                              {isUnderReview && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setTrackingManuscript(ms)
                                    setIsTrackModalOpen(true)
                                  }}
                                  className="h-8 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 border-slate-200 dark:border-slate-800 px-2.5 rounded-lg cursor-pointer"
                                >
                                  <Clock className="h-3.5 w-3.5 mr-1 text-[#0b99ff]" />
                                  Track Review
                                </Button>
                              )}

                              {Boolean(selectedStageFilter === "integrity" || ms.integrityStatus === "Flagged" || (Number(ms.plagiarismScore) > 15) || (Number(ms.aiScore) > 30)) && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setForensicsManuscript(ms)
                                    setForensicActionStatus(null)
                                    setIsForensicsModalOpen(true)
                                  }}
                                  className="h-8 text-xs font-bold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 border-red-200 dark:border-red-800 px-2.5 rounded-lg cursor-pointer"
                                >
                                  <ShieldAlert className="h-3.5 w-3.5 mr-1 text-red-600" />
                                  Forensics
                                </Button>
                              )}

                              {ms.status === "Revision Required" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleNudgeAuthor(ms)}
                                  disabled={!!authorNudged[ms.id]}
                                  className={`h-8 text-xs font-semibold px-2.5 rounded-lg cursor-pointer whitespace-nowrap transition-all shadow-2xs ${
                                    authorNudged[ms.id]
                                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18191e] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80"
                                  }`}
                                >
                                  {authorNudged[ms.id] ? (
                                    <>
                                      <Check className="h-3.5 w-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />
                                      {isDe ? "Erinnert" : "Reminded"}
                                    </>
                                  ) : (
                                    <>
                                      <Bell className="h-3.5 w-3.5 mr-1 text-[#0b99ff]" />
                                      {isDe ? "Autor erinnern" : "Remind Author"}
                                    </>
                                  )}
                                </Button>
                              )}

                              {ms.status === "Revision Under Evaluation" && (
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedRevisionManuscript(ms)
                                    setSelectedRound2Reviewers(ms.reviewers && ms.reviewers.length > 0 ? ms.reviewers : ["Prof. Aris Thorne", "Dr. Evelyn Vane"])
                                    setEditorRoutingNote(`Revised version of ${ms.id} has been submitted by ${ms.authorName || 'Author'}. File completeness verified. Routed to Handling Editor for final evaluation.`)
                                    setRevisionActionSuccess(null)
                                    setIsRevisionModalOpen(true)
                                  }}
                                  className="h-8 text-xs font-bold bg-[#0b99ff] hover:bg-[#0088e0] text-white px-4 rounded-lg cursor-pointer shadow-2xs"
                                >
                                  <Sliders className="h-3.5 w-3.5 mr-1.5" />
                                  Manage Revision
                                </Button>
                              )}

                              {/* Decision Letter Button for Decided Manuscripts */}
                              {isDecided && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setViewingDecisionManuscript(ms)
                                    setIsDecisionLetterModalOpen(true)
                                  }}
                                  className="h-8 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 border-slate-200 dark:border-slate-800 px-2.5 rounded-lg cursor-pointer"
                                >
                                  <FileCheck2 className="h-3.5 w-3.5 mr-1 text-[#0b99ff]" />
                                  Decision Letter
                                </Button>
                              )}

                              {isAccepted && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setGalleyManuscript(ms)
                                      setIsGalleyModalOpen(true)
                                    }}
                                    className="h-8 text-xs font-bold bg-[#0b99ff] hover:bg-[#0088e0] text-white px-3.5 rounded-lg cursor-pointer shadow-2xs"
                                  >
                                    <FileText className="h-3.5 w-3.5 mr-1" />
                                    Galley Proof
                                  </Button>
                                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-900/30">
                                    Published
                                  </span>
                                </>
                              )}

                              {isDeclined && (
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                                  Archived
                                </span>
                              )}
                            </div>
                          </td>

                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SCHOLAR SCOUT (LEAD FINDER & EDITORIAL OUTREACH SUITE)                 */}
      {/* ========================================================================= */}
      {(activeTab === "scout" || activeTab === "sent") && (
        <div className="space-y-5 animate-in fade-in duration-200">
          
          {/* Header Banner: Clean, Standardized, International Scholarly Style */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] shadow-xs relative overflow-hidden space-y-4">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0b99ff] via-sky-400 to-[#0077cc]" />
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0b99ff] dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-0.5 rounded-md border border-sky-200/70 dark:border-sky-800/60">
                    <Compass className="h-3.5 w-3.5 text-[#0b99ff]" />
                    Talent Discovery
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    250M+ Open Scholarly Graph
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Scholar Scout
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                  Precision scholarly talent discovery, editorial recruitment, and author outreach suite.
                </p>
              </div>

              {/* Dynamic Daily Safe Dispatch Quota Meter */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 min-w-[260px] space-y-1.5 shrink-0">
                <div className="flex items-center justify-between text-xs gap-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 truncate max-w-[150px]" title={quotaInfo.label}>
                    <Server className="h-3.5 w-3.5 text-[#0b99ff] shrink-0" />
                    <span className="truncate">{quotaInfo.label}</span>
                  </span>
                  <span className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded shrink-0 ${
                    quotaInfo.isWarning ? "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300" :
                    quotaInfo.isCaution ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300" :
                    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                  }`}>
                    {quotaInfo.sentCount.toLocaleString()} / {quotaInfo.maxQuota.toLocaleString()} sent today
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      quotaInfo.isWarning ? "bg-rose-500" :
                      quotaInfo.isCaution ? "bg-amber-500" :
                      "bg-emerald-500"
                    }`}
                    style={{ width: `${quotaInfo.percentage}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  {quotaInfo.subtext}
                </p>
              </div>
            </div>

            {/* Sub-tab Navigation */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setScoutSubTab("finder")}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                  scoutSubTab === "finder"
                    ? "bg-[#0b99ff] text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Compass className="h-3.5 w-3.5" />
                <span>Lead Finder</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setScoutSubTab("ecr")
                  if (ecrResults.length === 0) handleSearchEcrScholars()
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                  scoutSubTab === "ecr"
                    ? "bg-[#0b99ff] text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <GraduationCap className="h-3.5 w-3.5" />
                <span>ECR Talent Hub</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  scoutSubTab === "ecr" ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                }`}>
                  Preprints
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setScoutSubTab("history")
                  setSentAuditSubTab("sent_emails")
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                  scoutSubTab === "history" && sentAuditSubTab === "sent_emails"
                    ? "bg-[#0b99ff] text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <History className="h-3.5 w-3.5" />
                <span>Sent Items</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 dark:bg-white/10 font-mono">
                  {sentEmailsHistory.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setScoutSubTab("history")
                  setSentAuditSubTab("unsubscribed")
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                  scoutSubTab === "history" && sentAuditSubTab === "unsubscribed"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <UserX className="h-3.5 w-3.5 text-rose-500" />
                <span>Do Not Contact</span>
                {unsubscribedList.length > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    scoutSubTab === "history" && sentAuditSubTab === "unsubscribed"
                      ? "bg-white/20 text-white"
                      : "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300"
                  }`}>
                    {unsubscribedList.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {scoutSuccessMessage && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-2xs animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{scoutSuccessMessage}</span>
              </div>
              <button onClick={() => setScoutSuccessMessage(null)} className="text-xs font-bold cursor-pointer hover:opacity-75">✕</button>
            </div>
          )}

          {/* ===================== SUBTAB 1: SCHOLAR LEAD FINDER ===================== */}
          {scoutSubTab === "finder" && (
            <>
              {/* Search & Campaign Control Suite */}
              <Card className="bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl p-5 shadow-xs space-y-4">
                
                {/* Top Row: Search Input + 13 Official Journals Dropdown + Country Filter + Page Size Limit */}
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={scoutKeyword}
                      onChange={(e) => setScoutKeyword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleSearchScoutScholars()
                        }
                      }}
                      placeholder="Enter research topic, keywords or scholar name (e.g. Oncology, Silicon Anodes, CRISPR)..."
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0b99ff] focus:border-[#0b99ff]"
                    />
                  </div>

                  {/* 13 Official Journals Dropdown */}
                  <div className="w-full md:w-72 shrink-0">
                    <select
                      value={scoutTargetJournal}
                      onChange={(e) => setScoutTargetJournal(e.target.value)}
                      className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                      title="Select official journal desk for outreach"
                    >
                      <option value="all">All Journals (General Portfolio)</option>
                      {OFFICIAL_JOURNALS.map((j) => (
                        <option key={j.name} value={j.name}>
                          {j.name} ({j.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Country / Region Filter Dropdown */}
                  <div className="w-full md:w-56 shrink-0">
                    <select
                      value={scoutCountry}
                      onChange={(e) => {
                        const newCountry = e.target.value
                        setScoutCountry(newCountry)
                        handleSearchScoutScholars(undefined, 1, scoutLimit, newCountry)
                      }}
                      className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0b99ff] font-medium cursor-pointer"
                      title="Filter scholar harvest by country or region"
                    >
                      <optgroup label="🌍 Regional Groupings">
                        {REGIONAL_COUNTRY_GROUPS.map((g) => (
                          <option key={g.code} value={g.code}>
                            {g.flag} {g.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="🌐 All Countries (A - Z)">
                        {GLOBAL_COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.name} ({c.code.toUpperCase()})
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* Search Limit Dropdown */}
                  <div className="w-full md:w-28 shrink-0">
                    <select
                      value={scoutLimit}
                      onChange={(e) => {
                        const newLimit = parseInt(e.target.value, 10)
                        setScoutLimit(newLimit)
                        handleSearchScoutScholars(undefined, 1, newLimit, scoutCountry)
                      }}
                      className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                      title="Result batch limit per search"
                    >
                      <option value="10">10 / pg</option>
                      <option value="25">25 / pg</option>
                      <option value="50">50 / pg</option>
                      <option value="100">100 / pg</option>
                    </select>
                  </div>

                  <Button
                    type="button"
                    disabled={isScouting}
                    onClick={() => handleSearchScoutScholars()}
                    className="w-full md:w-auto bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-bold h-10 px-5 rounded-xl cursor-pointer shadow-xs shrink-0 flex items-center justify-center gap-2"
                  >
                    {isScouting ? (
                      <>
                        <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Extracting Scholars...</span>
                      </>
                    ) : (
                      <>
                        <Search className="h-3.5 w-3.5" />
                        <span>Extract Scholars</span>
                      </>
                    )}
                  </Button>
                </div>

                {/* Quick Topic Chips */}
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">Popular:</span>
                  {[
                    "Cardiology & Tele-health",
                    "Battery Materials & Electrochemistry",
                    "AI Diagnostics & Medical Imaging",
                    "Climate Economics & Urban Policy",
                    "Quantum Cryptography & Security",
                    "CRISPR & Gene Therapy",
                    "Space Propulsion & Orbital Economy"
                  ].map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => {
                        setScoutKeyword(topic)
                        handleSearchScoutScholars(topic)
                      }}
                      className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                    >
                      {topic}
                    </button>
                  ))}
                </div>

                {/* Campaign Mode Bar: Clean, Full-Width, Perfectly Aligned */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Campaign Invitation Mode:
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Templates automatically adapt with official journal terms
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                    {[
                      { id: "call_for_papers", label: "Call for Papers", icon: FileText },
                      { id: "ebm", label: "Editorial Board (EBM)", icon: Users },
                      { id: "eic", label: "Editor-in-Chief (EiC)", icon: Award },
                      { id: "associate_editor", label: "Associate Editor", icon: BookOpen },
                      { id: "follow_up", label: "Follow-Up Invite", icon: RotateCcw },
                    ].map((c) => {
                      const isSelected = scoutCampaignType === c.id
                      const IconComp = c.icon
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setScoutCampaignType(c.id as any)}
                          className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 justify-center ${
                            isSelected
                              ? "bg-white dark:bg-[#18191e] text-[#0b99ff] shadow-xs border border-slate-200 dark:border-slate-700 font-bold"
                              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40"
                          }`}
                        >
                          <IconComp className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{c.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </Card>

              {/* Results Section with View Mode Switcher (List vs Cards) */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Scholar Candidates ({activeScoutResults.length})
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Topic: &ldquo;{scoutKeyword}&rdquo;
                    </span>
                    {scoutCountry !== "all" && (
                      <span className="text-[11px] text-[#0b99ff] font-semibold bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-800 flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        <span>Region: {
                          scoutCountry === "dach" ? "🇩🇪🇦🇹🇨🇭 DACH" :
                          scoutCountry === "nordic" ? "🇸🇪🇳🇴🇩🇰🇫🇮 Nordic" :
                          scoutCountry === "eu" ? "🇪🇺 European Union" :
                          (GLOBAL_COUNTRIES.find(c => c.code === scoutCountry)?.name || scoutCountry.toUpperCase())
                        }</span>
                      </span>
                    )}
                    <span className="text-[11px] text-emerald-600 font-medium bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      OpenAlex &amp; ROR Verified Affiliations
                    </span>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-medium">View:</span>
                    <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <button
                        type="button"
                        onClick={() => setScoutViewMode("list")}
                        className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                          scoutViewMode === "list"
                            ? "bg-white dark:bg-[#18191e] text-[#0b99ff] shadow-xs"
                            : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <List className="h-3.5 w-3.5" />
                        <span>List / Table</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setScoutViewMode("cards")}
                        className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                          scoutViewMode === "cards"
                            ? "bg-white dark:bg-[#18191e] text-[#0b99ff] shadow-xs"
                            : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <Kanban className="h-3.5 w-3.5" />
                        <span>Cards</span>
                      </button>
                    </div>
                  </div>
                </div>

                {activeScoutResults.length === 0 ? (
                  <Card className="p-12 text-center bg-white dark:bg-[#18191e] border border-slate-200 dark:border-[#272832] rounded-2xl space-y-3">
                    <Compass className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {scoutResults.length > 0 ? "All candidates on this page have been contacted or dismissed" : "No active scholars found for this query"}
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      {scoutResults.length > 0 
                        ? `All scholars on Page ${scoutPage} have been contacted or dismissed. Use the pagination controls below to explore subsequent pages.`
                        : "All previously contacted scholars have been moved to the Sent tab to prevent duplicate outreach. Try broader research keywords or reset your filters."}
                    </p>
                  </Card>
                ) : scoutViewMode === "list" ? (
                  /* ================= HIGH-DENSITY LIST / TABLE VIEW ================= */
                  <Card className="bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            <th className="py-3 px-4 min-w-[220px]">Scholar &amp; Institution</th>
                            <th className="py-3 px-3 min-w-[170px]">Profile &amp; ORCID</th>
                            <th className="py-3 px-3 min-w-[240px]">Specialty &amp; Focus</th>
                            <th className="py-3 px-3 min-w-[230px]">Email &amp; Online Verification</th>
                            <th className="py-3 px-4 text-right min-w-[150px]">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                          {activeScoutResults.map((scholar, idx) => {
                            const campaignLabel = 
                              scoutCampaignType === "call_for_papers" ? "Send CFP" :
                              scoutCampaignType === "ebm" ? "Invite EBM" :
                              scoutCampaignType === "eic" ? "Nominate EiC" :
                              scoutCampaignType === "follow_up" ? "Send Follow-Up" : "Invite AE"

                            const cleanOrcid = (scholar.orcid || "").replace(/^https?:\/\/orcid\.org\//, "")

                            return (
                              <tr 
                                key={idx}
                                className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors"
                              >
                                {/* Scholar & Institution */}
                                <td className="py-3.5 px-4 align-top">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="font-bold text-slate-900 dark:text-white">
                                        {scholar.name}
                                      </span>
                                      {scholar.country && (
                                        <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                          {scholar.country}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                                      {scholar.institution}
                                    </p>
                                  </div>
                                </td>

                                {/* Academic Profile & ORCID */}
                                <td className="py-3.5 px-3 align-top">
                                  <div className="space-y-1.5">
                                    {cleanOrcid ? (
                                      <a
                                        href={`https://orcid.org/${cleanOrcid}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors"
                                      >
                                        <span className="font-bold bg-[#A6CE39] text-white px-1 rounded text-[9px]">iD</span>
                                        <span>{cleanOrcid}</span>
                                        <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                                      </a>
                                    ) : (
                                      <span className="text-[10px] text-slate-400 italic">No ORCID listed</span>
                                    )}
                                    <div className="text-[11px] font-semibold text-[#0b99ff]">
                                      {scholar.metrics || "Active Researcher"}
                                    </div>
                                  </div>
                                </td>

                                {/* Specialty & Rationale */}
                                <td className="py-3.5 px-3 align-top">
                                  <div className="space-y-1">
                                    <p className="font-medium text-slate-800 dark:text-slate-200 line-clamp-2 leading-relaxed">
                                      {scholar.specialty}
                                    </p>
                                    {scholar.editorialRationale && (
                                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-2 leading-snug">
                                        &ldquo;{scholar.editorialRationale}&rdquo;
                                      </p>
                                    )}
                                  </div>
                                </td>

                                {/* Email & Online Verification Links */}
                                <td className="py-3.5 px-3 align-top">
                                  <div className="space-y-1.5">
                                    <div className="relative">
                                      <input
                                        type="email"
                                        value={scholar.email || ""}
                                        onChange={(e) => handleUpdateScholarEmail(idx, e.target.value)}
                                        placeholder="scholar@university.edu"
                                        className="w-full text-[11px] font-mono pl-2 pr-6 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0b99ff] focus:border-[#0b99ff]"
                                        title="Click to edit or paste confirmed email"
                                      />
                                      <Edit3 className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
                                    </div>
                                    
                                    {/* 1-Click Verification Links */}
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <a
                                        href={`https://www.google.com/search?q=${encodeURIComponent(scholar.name + ' ' + (scholar.institution || '') + ' email contact')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#0b99ff] hover:underline bg-sky-50 dark:bg-sky-950/40 px-1.5 py-0.5 rounded border border-sky-200 dark:border-sky-800/60"
                                        title="Search faculty directory or lab webpage for official email"
                                      >
                                        <span>Faculty Search</span>
                                        <ExternalLink className="h-2.5 w-2.5" />
                                      </a>

                                      <a
                                        href={`https://scholar.google.com/scholar?q=${encodeURIComponent(scholar.name + ' ' + (scholar.institution || ''))}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:underline bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700"
                                        title="View Google Scholar profile"
                                      >
                                        <span>Scholar</span>
                                        <ExternalLink className="h-2.5 w-2.5" />
                                      </a>

                                      {scholar.isCustomEmail ? (
                                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                          ✓ JM Confirmed
                                        </span>
                                      ) : scholar.emailSource === "extracted" || scholar.verificationStatus?.includes("Scraped") ? (
                                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                          ✓ Scraped from Source Paper
                                        </span>
                                      ) : scholar.emailSource === "institutional_domain" ? (
                                        <span className="text-[10px] font-semibold text-sky-600 dark:text-sky-400">
                                          ✓ Verified Domain
                                        </span>
                                      ) : (
                                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                          ✓ Scraped from Source Paper
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </td>

                                {/* Quick Action */}
                                <td className="py-3.5 px-4 align-top text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleDismissCandidate(scholar)}
                                      className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:border-rose-300 dark:hover:border-rose-900 rounded-lg cursor-pointer transition-colors"
                                      title="Dismiss candidate (deceased or unsuitable)"
                                    >
                                      <UserX className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => handleDispatchScoutOutreach(scholar, scoutCampaignType)}
                                      className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-bold h-8 px-3 rounded-lg cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                                    >
                                      <Send className="h-3 w-3" />
                                      <span>{campaignLabel}</span>
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                ) : (
                  /* ================= CARDS GRID VIEW ================= */
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {activeScoutResults.map((scholar, idx) => {
                      const campaignLabel = 
                        scoutCampaignType === "call_for_papers" ? "Invite to Submit Paper" :
                        scoutCampaignType === "ebm" ? "Invite as EBM" :
                        scoutCampaignType === "eic" ? "Nominate as EiC" :
                        scoutCampaignType === "follow_up" ? "Send Follow-Up" : "Invite as Associate Editor"

                      const cleanOrcid = (scholar.orcid || "").replace(/^https?:\/\/orcid\.org\//, "")

                      return (
                        <Card 
                          key={idx}
                          className="p-4 bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl shadow-xs flex flex-col justify-between space-y-3.5 hover:border-slate-300"
                        >
                          <div className="space-y-2.5">
                            {/* Header: Name + ORCID */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-0.5 min-w-0 flex-1">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                  {scholar.name}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1" title={scholar.institution}>
                                  {scholar.institution}
                                </p>
                              </div>
                              {cleanOrcid && (
                                <a
                                  href={`https://orcid.org/${cleanOrcid}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0"
                                >
                                  <span className="font-bold bg-[#A6CE39] text-white px-1 rounded text-[9px]">iD</span>
                                  <span>{cleanOrcid}</span>
                                </a>
                              )}
                            </div>

                            {/* Specialty Tags */}
                            <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 space-y-1">
                              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Domain &amp; Metrics:</span>
                              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 line-clamp-2">
                                {scholar.specialty}
                              </p>
                              <div className="text-[11px] font-semibold text-[#0b99ff] pt-0.5">
                                {scholar.metrics || "Active Researcher"}
                              </div>
                            </div>

                            {/* Verified Contact Email (Editable) */}
                            <div className="space-y-1.5">
                              <div className="relative">
                                <input
                                  type="email"
                                  value={scholar.email || ""}
                                  onChange={(e) => handleUpdateScholarEmail(idx, e.target.value)}
                                  className="w-full text-xs font-mono pl-3 pr-7 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                                />
                                <Edit3 className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                              </div>
                              <div className="flex items-center gap-2">
                                <a
                                  href={`https://www.google.com/search?q=${encodeURIComponent(scholar.name + ' ' + (scholar.institution || '') + ' email contact')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] font-semibold text-[#0b99ff] hover:underline flex items-center gap-0.5"
                                >
                                  <span>Faculty Search</span>
                                  <ExternalLink className="h-2.5 w-2.5" />
                                </a>
                                {scholar.isCustomEmail ? (
                                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                    ✓ JM Confirmed
                                  </span>
                                ) : scholar.emailSource === "extracted" || scholar.verificationStatus?.includes("Scraped") ? (
                                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                    ✓ Scraped from Source Paper
                                  </span>
                                ) : scholar.emailSource === "institutional_domain" ? (
                                  <span className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold">
                                    ✓ Verified Domain
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                    ✓ Scraped from Source Paper
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Card Action Button */}
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDismissCandidate(scholar)}
                                className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:border-rose-300 dark:hover:border-rose-900 rounded-lg cursor-pointer transition-colors"
                                title="Dismiss candidate (deceased or unsuitable)"
                              >
                                <UserX className="h-3.5 w-3.5" />
                              </Button>
                              <span className="text-[11px] font-medium text-slate-400">
                                {scholar.country ? `${scholar.country} · ` : ""}COPE Vetted
                              </span>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleDispatchScoutOutreach(scholar, scoutCampaignType)}
                              className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-bold h-8 px-3.5 rounded-lg cursor-pointer flex items-center gap-1.5 shadow-2xs"
                            >
                              <Send className="h-3 w-3" />
                              <span>{campaignLabel}</span>
                            </Button>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                )}

                {/* Pagination Controls Bar */}
                {scoutResults.length > 0 && (() => {
                  const totalPages = Math.max(1, Math.ceil(scoutTotalResults / scoutLimit))
                  const startRecord = (scoutPage - 1) * scoutLimit + 1
                  const endRecord = Math.min(scoutPage * scoutLimit, scoutTotalResults)

                  // Generate smart page numbers array (up to 7 items)
                  const getPageNumbers = () => {
                    if (totalPages <= 7) {
                      return Array.from({ length: totalPages }, (_, i) => i + 1)
                    }
                    if (scoutPage <= 4) {
                      return [1, 2, 3, 4, 5, "...", totalPages]
                    }
                    if (scoutPage >= totalPages - 3) {
                      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
                    }
                    return [1, "...", scoutPage - 1, scoutPage, scoutPage + 1, "...", totalPages]
                  }

                  const pages = getPageNumbers()

                  return (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-white dark:bg-[#18191e] border border-slate-200/80 dark:border-[#272832] rounded-2xl shadow-xs">
                      {/* Left: Summary text */}
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <span>
                          Showing <strong className="text-slate-900 dark:text-white font-mono">{startRecord}</strong> to{" "}
                          <strong className="text-slate-900 dark:text-white font-mono">{endRecord}</strong> of{" "}
                          <strong className="text-slate-900 dark:text-white font-mono">{scoutTotalResults.toLocaleString()}</strong> candidates
                        </span>
                        <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
                        <span className="hidden sm:inline font-medium">Page {scoutPage} of {totalPages}</span>
                      </div>

                      {/* Right: Pagination buttons */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Previous Button */}
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={scoutPage <= 1 || isScouting}
                          onClick={() => handleSearchScoutScholars(undefined, scoutPage - 1, scoutLimit)}
                          className="h-8 px-2.5 text-xs font-semibold rounded-lg border-slate-200 dark:border-slate-800 disabled:opacity-40 cursor-pointer"
                        >
                          <ChevronLeft className="h-3.5 w-3.5 mr-0.5" />
                          <span>Previous</span>
                        </Button>

                        {/* Numbered Page Buttons */}
                        {pages.map((p, pIdx) => {
                          if (p === "...") {
                            return (
                              <span key={`ellipsis-${pIdx}`} className="px-2 py-1 text-xs text-slate-400 font-bold">
                                ...
                              </span>
                            )
                          }
                          const pageNum = Number(p)
                          const isCurrent = pageNum === scoutPage
                          return (
                            <button
                              key={pageNum}
                              type="button"
                              disabled={isScouting}
                              onClick={() => handleSearchScoutScholars(undefined, pageNum, scoutLimit)}
                              className={`h-8 min-w-[32px] px-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                                isCurrent
                                  ? "bg-[#0b99ff] text-white shadow-2xs"
                                  : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                              }`}
                            >
                              {pageNum}
                            </button>
                          )
                        })}

                        {/* Next Button */}
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={scoutPage >= totalPages || isScouting}
                          onClick={() => handleSearchScoutScholars(undefined, scoutPage + 1, scoutLimit)}
                          className="h-8 px-2.5 text-xs font-semibold rounded-lg border-slate-200 dark:border-slate-800 disabled:opacity-40 cursor-pointer"
                        >
                          <span>Next</span>
                          <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                        </Button>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </>
          )}

          {/* ===================== SUBTAB: ECR TALENT HUB (bioRxiv / medRxiv / arXiv) ===================== */}
          {scoutSubTab === "ecr" && renderEcrTalentHub()}

          {/* ===================== SUBTAB 2: SENT ITEMS & DO-NOT-CONTACT REGISTRY ===================== */}
          {scoutSubTab === "history" && (
            <Card className="bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl p-6 shadow-xs space-y-5">
              {/* Header with Sub-tab Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {sentAuditSubTab === "sent_emails" ? (
                      <>
                        <History className="h-4 w-4 text-[#0b99ff]" />
                        <span>Dispatched Outreach History &amp; Audit Log</span>
                      </>
                    ) : (
                      <>
                        <UserX className="h-4 w-4 text-rose-500" />
                        <span>Unsubscribed / Do-Not-Contact Registry</span>
                      </>
                    )}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {sentAuditSubTab === "sent_emails"
                      ? "Immutable tracking record of all recruitment, EiC nominations, and Call for Papers emails sent via Editorial360."
                      : "Strict suppression list. Anyone on this list is permanently blocked from receiving invitations across all journal desks."}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setSentAuditSubTab("sent_emails")}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                        sentAuditSubTab === "sent_emails"
                          ? "bg-white dark:bg-[#18191e] text-[#0b99ff] shadow-xs font-bold"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <History className="h-3.5 w-3.5" />
                      <span>Sent Emails ({sentEmailsHistory.length})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSentAuditSubTab("unsubscribed")}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                        sentAuditSubTab === "unsubscribed"
                          ? "bg-white dark:bg-[#18191e] text-rose-600 dark:text-rose-400 shadow-xs font-bold"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <UserX className="h-3.5 w-3.5 text-rose-500" />
                      <span>Do Not Contact ({unsubscribedList.length})</span>
                    </button>
                  </div>

                  {sentAuditSubTab === "unsubscribed" && (
                    <Button
                      size="sm"
                      onClick={() => setIsAddUnsubModalOpen(true)}
                      className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold h-8 px-3 rounded-lg cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <UserX className="h-3.5 w-3.5" />
                      <span>+ Add Email to Opt-Out</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* View 1: Sent Emails History Table */}
              {sentAuditSubTab === "sent_emails" && (
                <>
                  {sentEmailsHistory.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 text-xs">
                      No outreach emails dispatched yet. Search candidates and send invitations to populate this audit log.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            <th className="py-3 px-4 min-w-[140px]">Date / Time</th>
                            <th className="py-3 px-4 min-w-[180px]">Recipient Scholar</th>
                            <th className="py-3 px-4 min-w-[200px]">Journal Desk</th>
                            <th className="py-3 px-3 min-w-[130px]">Campaign Type</th>
                            <th className="py-3 px-4 min-w-[220px]">Subject</th>
                            <th className="py-3 px-3 min-w-[90px]">Status</th>
                            <th className="py-3 px-4 text-right min-w-[160px]">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                          {sentEmailsHistory.map((record) => {
                            const dateFormatted = record.timestamp 
                              ? new Date(record.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                              : "Recent"

                            return (
                              <tr key={record.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors">
                                <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                                  {dateFormatted}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="space-y-0.5">
                                    <span className="font-bold text-slate-900 dark:text-white block">
                                      {record.recipientName}
                                    </span>
                                    <span className="text-[11px] font-mono text-slate-500 truncate block">
                                      {record.recipientEmail}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                                  <div className="space-y-0.5">
                                    <span className="font-semibold text-slate-900 dark:text-white block">
                                      {record.journal}
                                    </span>
                                    <span className="text-[11px] font-mono text-[#0b99ff] block">
                                      {getJournalReplyTo(record.journal)}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-3">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                    record.campaignType === "call_for_papers" ? "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200 dark:border-sky-800" :
                                    record.campaignType === "eic" ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800" :
                                    record.campaignType === "ebm" ? "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800" :
                                    record.campaignType === "follow_up" ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800" :
                                    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                                  }`}>
                                    {record.campaignType.replace(/_/g, " ")}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-slate-600 dark:text-slate-300 truncate max-w-[240px]" title={record.subject}>
                                  {record.subject}
                                </td>
                                <td className="py-3 px-3">
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                                    <Check className="h-3 w-3 text-emerald-600" />
                                    {record.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        handleDispatchScoutOutreach(
                                          {
                                            name: record.recipientName,
                                            email: record.recipientEmail,
                                            institution: record.journal,
                                            specialty: "your research field"
                                          },
                                          "follow_up"
                                        )
                                      }}
                                      className="h-7 text-[11px] font-semibold px-2.5 rounded-lg border-sky-200 dark:border-sky-800 text-[#0b99ff] hover:bg-sky-50 dark:hover:bg-sky-950/40 cursor-pointer flex items-center gap-1"
                                      title="Send a polite follow-up reminder"
                                    >
                                      <RotateCcw className="h-3 w-3" />
                                      Follow-up
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setViewingHistoryEmail(record)}
                                      className="h-7 text-[11px] font-semibold px-2.5 rounded-lg border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                                    >
                                      <Eye className="h-3 w-3 mr-1" />
                                      View
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}

              {/* View 2: Unsubscribed / Do-Not-Contact Registry */}
              {sentAuditSubTab === "unsubscribed" && (
                <div className="space-y-4">
                  {/* Anti-Spam Compliance Banner */}
                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-0.5 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                      <strong className="font-bold block">Strict Anti-Spam &amp; Solicitation Suppression (CAN-SPAM / GDPR Compliant)</strong>
                      <p className="text-[11px] text-amber-800/90 dark:text-amber-300">
                        When a scholar unsubscribes via the 1-click link in any invitation email or requests opt-out, their email address is automatically registered here. The system filters these addresses out of Lead Finder and ECR candidate queries, ensuring Journal Managers never accidentally contact them again.
                      </p>
                    </div>
                  </div>

                  {unsubscribedList.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 text-xs">
                      No scholars have unsubscribed yet. Any future opt-out requests will appear here automatically.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            <th className="py-3 px-4 min-w-[220px]">Suppressed Scholar Email</th>
                            <th className="py-3 px-4 min-w-[180px]">Journal Scope</th>
                            <th className="py-3 px-4 min-w-[140px]">Date Logged</th>
                            <th className="py-3 px-4 min-w-[200px]">Opt-Out Reason / Source</th>
                            <th className="py-3 px-4 text-right min-w-[140px]">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                          {unsubscribedList.map((item, idx) => {
                            const dateStr = item.timestamp
                              ? new Date(item.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                              : "Active"

                            return (
                              <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors">
                                <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                                  <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                                    <span>{item.email}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">
                                    {item.journal || "All Journals"}
                                  </span>
                                </td>
                                <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                                  {dateStr}
                                </td>
                                <td className="py-3 px-4 text-slate-600 dark:text-slate-300 text-[11px]">
                                  {item.reason || "1-Click Web Unsubscribe"}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      if (typeof window !== "undefined" && window.confirm(`Remove ${item.email} from Do-Not-Contact list? They will again be eligible for invitations.`)) {
                                        handleRemoveUnsubscribe(item.email)
                                      }
                                    }}
                                    className="h-7 text-[11px] font-semibold px-2.5 rounded-lg border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                                    title="Allow contacting this scholar again"
                                  >
                                    Remove &amp; Restore
                                  </Button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </Card>
          )}

        </div>
      )}
      {activeTab === "users" && (
        <Card className="bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {reviewerRegistryTab === "directory" 
                  ? "Reviewer Registry" 
                  : reviewerRegistryTab === "ecr" 
                  ? "Early Career Researcher (ECR) Invitations" 
                  : reviewerRegistryTab === "gateway"
                  ? "Reviewer Gateway Onboarding & Assessments"
                  : "Reviewer History"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {reviewerRegistryTab === "directory"
                  ? "Directory listing of vetted peer reviewers and availability status."
                  : reviewerRegistryTab === "ecr"
                  ? "Source and invite emerging scholars and preprint lead authors from bioRxiv, medRxiv, and arXiv."
                  : reviewerRegistryTab === "gateway"
                  ? "Scholars who completed the Reviewer Gateway qualification test (≥80%) and registered referee accounts."
                  : "Complete dispatch, acceptance, and declination log across all journal desks."}
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setReviewerRegistryTab("directory")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    reviewerRegistryTab === "directory"
                      ? "bg-white dark:bg-[#18191e] text-[#0b99ff] shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Active Pool ({reviewersList.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReviewerRegistryTab("gateway")
                    fetchGatewayData()
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                    reviewerRegistryTab === "gateway"
                      ? "bg-white dark:bg-[#18191e] text-[#0b99ff] shadow-xs font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Award className="h-3.5 w-3.5 text-[#0b99ff]" />
                  <span>Gateway Onboarding</span>
                  {gatewayTests.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#0b99ff]/10 text-[#0b99ff] font-bold">
                      {gatewayTests.length}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReviewerRegistryTab("ecr")
                    if (ecrResults.length === 0) handleSearchEcrScholars()
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                    reviewerRegistryTab === "ecr"
                      ? "bg-white dark:bg-[#18191e] text-indigo-600 dark:text-indigo-400 shadow-xs font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <GraduationCap className="h-3.5 w-3.5 text-indigo-500" />
                  <span>ECR Invitations</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReviewerRegistryTab("history")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    reviewerRegistryTab === "history"
                      ? "bg-white dark:bg-[#18191e] text-[#0b99ff] shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Reviewer History ({globalReviewerHistory.length})
                </button>
              </div>

              <Button
                onClick={() => setIsAddReviewerOpen(true)}
                size="sm"
                className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer h-8 px-3.5 rounded-lg"
              >
                <UserPlus className="h-4 w-4" />
                Invite Reviewer
              </Button>
            </div>
          </div>

          {reviewerRegistryTab === "gateway" ? (
            <div className="p-5 space-y-6 font-sans">
              {/* Summary KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Assessments</span>
                  <span className="text-xl font-bold text-slate-900 dark:text-white mt-0.5 block">{gatewayTests.length}</span>
                </div>
                <div className="p-3.5 rounded-xl border border-[#0b99ff]/30 bg-[#0b99ff]/5 dark:bg-[#0b99ff]/10">
                  <span className="text-[11px] font-semibold text-[#0b99ff] uppercase tracking-wider block">Passed (≥80%)</span>
                  <span className="text-xl font-bold text-[#0b99ff] mt-0.5 block">
                    {gatewayTests.filter(t => t.passed).length}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20">
                  <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider block">Accounts Active</span>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5 block">
                    {gatewayTests.filter(t => t.status === "Passed - Account Active").length}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/20">
                  <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block">Responses Dispatched</span>
                  <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 block">
                    {gatewayResponses.length}
                  </span>
                </div>
              </div>

              {/* Search & Actions Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search candidate, email, institution, or credential..."
                    value={gatewaySearch}
                    onChange={(e) => setGatewaySearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131418] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={fetchGatewayData}
                    className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-slate-600 dark:text-slate-300 cursor-pointer"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${isLoadingGateway ? "animate-spin" : ""}`} />
                    Refresh
                  </button>
                  <Link
                    href="/reviewer-gateway"
                    target="_blank"
                    className="px-3 py-1.5 text-xs font-bold bg-[#0b99ff] hover:bg-[#0088e0] text-white rounded-xl shadow-xs transition-colors flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open Gateway Portal
                  </Link>
                </div>
              </div>

              {/* Candidates Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-[#131418] shadow-xs">
                <div className="px-4 py-3 bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#0b99ff]" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Gateway Onboarding & Assessment Records
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Threshold: ≥80% Required for Peer Evaluation Privileges
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 text-slate-500 font-semibold">
                        <th className="py-3 px-4 whitespace-nowrap min-w-[220px]">Candidate / Scholar</th>
                        <th className="py-3 px-4 whitespace-nowrap min-w-[220px]">Affiliation & Field</th>
                        <th className="py-3 px-4 whitespace-nowrap">Assessment Score</th>
                        <th className="py-3 px-4 whitespace-nowrap">Verification Credential</th>
                        <th className="py-3 px-4 whitespace-nowrap">Account Status</th>
                        <th className="py-3 px-4 text-right whitespace-nowrap">Date</th>
                        <th className="py-3 px-4 text-center whitespace-nowrap">Profile</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {gatewayTests
                        .filter(t => {
                          if (!gatewaySearch.trim()) return true
                          const q = gatewaySearch.toLowerCase()
                          return (
                            t.candidateName?.toLowerCase().includes(q) ||
                            t.candidateEmail?.toLowerCase().includes(q) ||
                            t.institution?.toLowerCase().includes(q) ||
                            t.credentialId?.toLowerCase().includes(q)
                          )
                        })
                        .map(test => {
                          const isDrSun = test.candidateEmail === "102500216@hbut.edu.cn"
                          return (
                            <tr 
                              key={test.id} 
                              className={`hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors ${
                                isDrSun ? "bg-[#0b99ff]/5 font-medium" : ""
                              }`}
                            >
                              <td className="py-3.5 px-4 align-middle">
                                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2 whitespace-nowrap">
                                  <span>{test.candidateName}</span>
                                  {isDrSun && (
                                    <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0b99ff]/10 text-[#0b99ff] border border-[#0b99ff]/30 whitespace-nowrap">
                                      Registered Referee
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 whitespace-nowrap">{test.candidateEmail}</div>
                              </td>
                              <td className="py-3.5 px-4 align-middle">
                                <div className="text-slate-800 dark:text-slate-200 font-medium whitespace-nowrap">{test.institution}</div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 capitalize whitespace-nowrap">{test.discipline?.replace("-", " ")}</div>
                              </td>
                              <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                                <span className={`inline-flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap ${
                                  test.passed
                                    ? "bg-[#0b99ff]/10 text-[#0b99ff] border border-[#0b99ff]/30"
                                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                                }`}>
                                  {test.passed ? <CheckCircle2 className="w-3.5 h-3.5 text-[#0b99ff]" /> : <XCircle className="w-3.5 h-3.5 text-rose-500" />}
                                  {test.score}%
                                </span>
                              </td>
                              <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                                {test.credentialId ? (
                                  <span className="font-mono text-[11px] font-semibold text-[#0b99ff] bg-[#0b99ff]/10 px-2.5 py-1 rounded-md border border-[#0b99ff]/25 whitespace-nowrap">
                                    {test.credentialId}
                                  </span>
                                ) : (
                                  <span className="text-slate-400 italic text-[11px] whitespace-nowrap">Pending passing</span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${
                                  test.status === "Passed - Account Active"
                                    ? "bg-[#0b99ff]/10 text-[#0b99ff] border border-[#0b99ff]/30"
                                    : test.status === "Passed - Pending Account"
                                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700"
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                    test.status === "Passed - Account Active"
                                      ? "bg-[#0b99ff]"
                                      : test.status === "Passed - Pending Account"
                                      ? "bg-amber-500"
                                      : "bg-slate-400"
                                  }`} />
                                  {test.status}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 align-middle text-right text-slate-500 text-[11px] whitespace-nowrap">
                                {test.date}
                              </td>
                              <td className="py-3.5 px-4 align-middle text-center whitespace-nowrap">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleOpenReviewerProfile(test.candidateEmail, test)}
                                  className="h-7 text-[11px] font-semibold px-2.5 rounded-lg border-slate-300 dark:border-slate-700 hover:border-[#0b99ff] hover:text-[#0b99ff] hover:bg-[#0b99ff]/5 transition-all gap-1.5 cursor-pointer shadow-2xs"
                                >
                                  <Eye className="w-3.5 h-3.5 text-[#0b99ff]" />
                                  <span>Profile</span>
                                </Button>
                              </td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Incoming Official Responses Desk */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-[#131418] shadow-xs">
                <div className="px-4 py-3 bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#0b99ff]" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Official Invitation & Onboarding Responses Desk
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Real-time acceptances from EiC, AE, Board & Reviewer claims
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 text-slate-500 font-semibold">
                        <th className="py-3 px-4 whitespace-nowrap min-w-[200px]">Scholar / Appointee</th>
                        <th className="py-3 px-4 whitespace-nowrap">Role Appointment</th>
                        <th className="py-3 px-4 whitespace-nowrap">Journal Portfolio</th>
                        <th className="py-3 px-4 whitespace-nowrap">Decision / Status</th>
                        <th className="py-3 px-4 whitespace-nowrap">Credential</th>
                        <th className="py-3 px-4 text-right whitespace-nowrap">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {gatewayResponses.map((resp: any) => (
                        <tr key={resp.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                          <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                            <div className="font-bold text-slate-900 dark:text-white">{resp.candidateName}</div>
                            {resp.candidateEmail && (
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{resp.candidateEmail}</div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {resp.type === "eic" 
                                ? "Editor-in-Chief" 
                                : resp.type === "ae" 
                                ? "Associate Editor" 
                                : resp.type === "reviewer_claim" 
                                ? "Certified Referee" 
                                : "Editorial Board Member"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 align-middle whitespace-nowrap text-slate-600 dark:text-slate-400">
                            {resp.journal}
                          </td>
                          <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${
                              resp.decision === "yes" || resp.decision === "claimed"
                                ? "bg-[#0b99ff]/10 text-[#0b99ff] border border-[#0b99ff]/30"
                                : resp.decision === "conditional"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                resp.decision === "yes" || resp.decision === "claimed"
                                  ? "bg-[#0b99ff]"
                                  : resp.decision === "conditional"
                                  ? "bg-amber-500"
                                  : "bg-rose-500"
                              }`} />
                              {resp.decision.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                            {resp.credentialId ? (
                              <span className="font-mono text-[11px] font-semibold text-[#0b99ff] bg-[#0b99ff]/10 px-2.5 py-1 rounded-md border border-[#0b99ff]/25">
                                {resp.credentialId}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic text-[11px]">—</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 align-middle text-right text-slate-400 text-[11px] whitespace-nowrap">
                            {resp.timestamp ? new Date(resp.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : reviewerRegistryTab === "ecr" ? (
            <div className="p-5">
              {renderEcrTalentHub()}
            </div>
          ) : reviewerRegistryTab === "history" ? (
            <div className="p-5 space-y-5">
              {/* Summary KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Dispatched</span>
                  <span className="text-xl font-bold text-slate-900 dark:text-white mt-0.5 block">{globalReviewerHistory.length}</span>
                </div>
                <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20">
                  <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">Accepted / Active</span>
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                    {globalReviewerHistory.filter(h => h.status === "Accepted" || h.status === "Completed").length}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20">
                  <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider block">Declined</span>
                  <span className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-0.5 block">
                    {globalReviewerHistory.filter(h => h.status === "Declined").length}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20">
                  <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">Pending Response</span>
                  <span className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5 block">
                    {globalReviewerHistory.filter(h => h.status === "Invited").length}
                  </span>
                </div>
              </div>

              {/* Reviewer History Table */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-slate-500 uppercase tracking-wider text-[11px]">
                      <th className="px-4 py-3 font-semibold">Manuscript & Journal</th>
                      <th className="px-4 py-3 font-semibold">Reviewer</th>
                      <th className="px-4 py-3 font-semibold">Dispatched</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Details / Feedback</th>
                      <th className="px-4 py-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {globalReviewerHistory.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-slate-400 italic">
                          No reviewer invitations logged yet. Dispatched review requests will appear here.
                        </td>
                      </tr>
                    ) : (
                      globalReviewerHistory.map((item) => {
                        const targetMs = initialManuscripts.find(m => m.id && m.id.toLowerCase() === item.paperId.toLowerCase())

                        return (
                          <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                            <td className="px-4 py-3.5">
                              <span className="font-bold text-[#0b99ff] bg-[#0b99ff]/10 px-2 py-0.5 rounded border border-[#0b99ff]/20 text-[11px]">
                                {item.paperId}
                              </span>
                              <div className="font-semibold text-slate-900 dark:text-white mt-1 line-clamp-1 max-w-[220px]" title={item.paperTitle}>
                                {item.paperTitle || targetMs?.title || "Manuscript"}
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                {item.journal || targetMs?.journal || "Scholarly Open"}
                              </div>
                            </td>

                            <td className="px-4 py-3.5">
                              <div className="font-bold text-slate-900 dark:text-white">{item.reviewerName}</div>
                              <div className="text-[11px] text-slate-500">{item.reviewerEmail}</div>
                            </td>

                            <td className="px-4 py-3.5 whitespace-nowrap text-slate-500">
                              {item.invitedDate}
                            </td>

                            <td className="px-4 py-3.5 whitespace-nowrap">
                              {item.status === "Declined" ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold text-rose-700 bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800">
                                  <X className="h-3 w-3" /> Declined
                                </span>
                              ) : item.status === "Accepted" ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800">
                                  <Check className="h-3 w-3" /> Accepted
                                </span>
                              ) : item.status === "Completed" ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold text-indigo-700 bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-800">
                                  <CheckCircle2 className="h-3 w-3" /> Report Submitted
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold text-amber-700 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800">
                                  <Clock className="h-3 w-3" /> Pending
                                </span>
                              )}
                            </td>

                            <td className="px-4 py-3.5 max-w-[260px]">
                              {item.status === "Declined" ? (
                                <div className="space-y-0.5 text-[11px]">
                                  <div className="text-rose-700 dark:text-rose-400 font-medium">
                                    <strong>Reason:</strong> {item.declineReason || "Unavailable"}
                                  </div>
                                  {item.declineReferral && (
                                    <div className="text-slate-500 italic">
                                      Referral: {item.declineReferral}
                                    </div>
                                  )}
                                </div>
                              ) : item.status === "Accepted" ? (
                                <span className="text-[11px] text-emerald-600 font-medium">
                                  Turnaround Target: 14 days {item.deadline ? `(Due: ${item.deadline})` : ""}
                                </span>
                              ) : item.status === "Completed" ? (
                                <span className="text-[11px] text-indigo-600 font-medium">
                                  Evaluation logged & ready for moderation
                                </span>
                              ) : (
                                <span className="text-[11px] text-slate-400">
                                  Awaiting reviewer response
                                </span>
                              )}
                            </td>

                            <td className="px-4 py-3.5 text-right whitespace-nowrap">
                              {item.status === "Declined" ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    if (targetMs) handleOpenAssign(targetMs)
                                  }}
                                  className="h-7 text-[11px] font-semibold text-[#0b99ff] border-[#0b99ff]/30 hover:bg-[#0b99ff]/10 cursor-pointer"
                                >
                                  <UserPlus className="h-3 w-3 mr-1" />
                                  Assign Alternative
                                </Button>
                              ) : item.status === "Invited" ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleNudgeReviewer(item.reviewerName)}
                                  className="h-7 text-[11px] font-semibold border-slate-200 dark:border-slate-800 cursor-pointer"
                                >
                                  <Bell className="h-3 w-3 mr-1 text-[#0b99ff]" />
                                  Nudge
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    if (targetMs) {
                                      setTrackingManuscript(targetMs)
                                      setIsTrackModalOpen(true)
                                    }
                                  }}
                                  className="h-7 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 cursor-pointer"
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  Track
                                </Button>
                              )}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {reviewersList.map((rev) => (
                <div 
                  key={rev.id} 
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block h-2 w-2 rounded-full ${
                        rev.status === "Active" ? "bg-emerald-500" : rev.status === "Busy" ? "bg-amber-500" : "bg-slate-400"
                      }`} />
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{rev.name}</h4>
                      <span className="text-[11px] font-bold text-[#0b99ff] bg-[#0b99ff]/10 px-2 py-0.5 rounded border border-[#0b99ff]/20">
                        ({rev.activeTasks || (rev.name === "Dr. Marcus Vance" ? 2 : rev.name === "Dr. Evelyn Vane" ? 1 : 0)} active reviews)
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        rev.status === "Active" ? "bg-green-100 text-green-600 border border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30" :
                        rev.status === "Busy" ? "bg-yellow-100 text-yellow-600 border border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900/30" :
                        "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400"
                      }`}>
                        {rev.status === "Active" ? "Active" : rev.status === "Busy" ? "Sabbatical" : "Inactive"}
                      </span>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{rev.orcid}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Specialization: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{rev.specialization}</strong>
                    </p>
                    <div className="text-xs text-slate-400">
                      Email: {rev.email} | Active Capacity: {rev.activeTasks || (rev.name === "Dr. Marcus Vance" ? 2 : rev.name === "Dr. Evelyn Vane" ? 1 : 0)} / {rev.maxTasks} papers
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCycleReviewerStatus(rev.id)}
                      className="text-xs font-semibold border-slate-200 dark:border-slate-800 cursor-pointer h-8 px-3 rounded-lg"
                    >
                      {rev.status === "Active" ? "Set Sabbatical" : rev.status === "Busy" ? "Set Inactive" : "Set Active"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 5. PUBLISHING & DOI DISPATCH                                              */}
      {/* ========================================================================= */}
      {activeTab === "checks" && (
        <Card className="bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Publishing & DOIs</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage galley proofs and register Crossref DOIs for accepted manuscripts.</p>
          </div>

          <div className="p-6 space-y-4">
            {acceptedList.map((ms) => (
              <div key={ms.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#0b99ff] bg-[#0b99ff]/10 px-2 py-0.5 rounded-md border border-[#0b99ff]/20">
                      {ms.id}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-md uppercase tracking-wider border border-emerald-200 dark:border-emerald-900/30">
                      Crossref Ready
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{ms.title}</h4>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Author: <span className="font-semibold text-slate-700 dark:text-slate-300">{ms.authorName || "Prof. Aris Thorne"}</span> • DOI: <span className="font-semibold text-slate-700 dark:text-slate-300">10.59236/soeas.2026.104</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setGalleyManuscript(ms)
                      setIsGalleyModalOpen(true)
                    }}
                    className="h-8 text-xs font-semibold border-slate-200 dark:border-slate-800 cursor-pointer px-3.5 rounded-lg"
                  >
                    <FileText className="h-3.5 w-3.5 mr-1 text-[#0b99ff]" />
                    Galley Proof
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => {
                      alert(`Crossref DOI registered for ${ms.id} (10.59236/soeas.2026.104)`)
                    }}
                    className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-bold cursor-pointer h-8 px-3.5 rounded-lg"
                  >
                    <Send className="h-3.5 w-3.5 mr-1" />
                    Dispatch DOI
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 6. PORTFOLIO & INTEGRITY ANALYTICS                                        */}
      {/* ========================================================================= */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          
          {/* A. Strategic Control & Filter Bar */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3.5 p-4 rounded-2xl bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] shadow-xs">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                {isDe ? "Portfolio-Analytik" : "Portfolio Analytics"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isDe 
                  ? "Durchsatz, Begutachtungszeiten und Journal-Metriken."
                  : "Throughput velocity, peer review turnaround, and journal health."}
              </p>
            </div>

            {/* Filter Controls & Exports in Clean Single Row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 shrink-0">
              {/* Timeframe Selector */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
                {[
                  { key: "30d", label: "30D" },
                  { key: "quarter", label: "Q3 2026" },
                  { key: "ytd", label: "YTD" },
                  { key: "all", label: "All" }
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setAnalyticsTimeframe(t.key as any)}
                    className={`px-2.5 py-1 text-xs rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      analyticsTimeframe === t.key
                        ? "bg-white dark:bg-[#18191e] text-slate-900 dark:text-white shadow-2xs font-bold"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white font-semibold"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Journal Scope Selector */}
              <select
                value={analyticsJournalFilter}
                onChange={(e) => setAnalyticsJournalFilter(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0b99ff] shrink-0"
              >
                <option value="all">All Journals</option>
                <option value="Medicine">Medicine</option>
                <option value="Engineering">Engineering</option>
                <option value="Social">Social Sciences</option>
                <option value="Decarbonization">Decarbonization</option>
              </select>

              {/* Export Buttons */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setAnalyticsExportStatus("✓ Raw CSV Dataset exported successfully.")
                  setTimeout(() => setAnalyticsExportStatus(null), 4000)
                }}
                className="h-8 text-xs font-semibold border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18191e] hover:bg-slate-50 text-slate-700 dark:text-slate-300 px-2.5 rounded-xl cursor-pointer shadow-2xs shrink-0 whitespace-nowrap"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 mr-1 text-[#0b99ff]" />
                Export CSV
              </Button>

              <a
                href="/downloads/Rights_Retention_Cover_Letter_Template.txt"
                download="ScholarlyOpen_Executive_Editorial_Report_Q3_2026.pdf"
                className="inline-flex items-center h-8 text-xs font-bold bg-[#0b99ff] hover:bg-[#0088e0] text-white px-3 rounded-xl cursor-pointer shadow-xs transition-colors shrink-0 whitespace-nowrap"
              >
                <Download className="h-3.5 w-3.5 mr-1" />
                Audit Report (.pdf)
              </a>
            </div>
          </div>

          {/* Feedback banner if exported */}
          {analyticsExportStatus && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-medium flex items-center gap-2">
              <CheckCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{analyticsExportStatus}</span>
            </div>
          )}

          {/* B. Executive KPI Velocity Matrix (4 Sleek Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Acceptance Rate */}
            <Card className="p-5 bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Acceptance Rate
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  Top Tier
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
                  21.8%
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  -1.4%
                </span>
              </div>
              <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Desk Rejected:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">14.2%</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Post-Review Rejected:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">64.0%</span>
                </div>
              </div>
            </Card>

            {/* Card 2: Turnaround Latency */}
            <Card className="p-5 bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Decision Turnaround
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  ● On Target
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-[#0b99ff] tabular-nums">
                  18.4 Days
                </span>
                <span className="text-xs text-slate-400">
                  vs 21.0d Goal
                </span>
              </div>
              <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Triage:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">3.2 Days</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Peer Review:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">12.8 Days</span>
                </div>
              </div>
            </Card>

            {/* Card 3: Reviewer On-Time Rate */}
            <Card className="p-5 bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Reviewer On-Time
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  91.4%
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
                  2.4 Reviews
                </span>
                <span className="text-xs text-slate-400">
                  / Paper Avg
                </span>
              </div>
              <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Reviewer Pool:</span>
                  <span className="font-semibold text-[#0b99ff]">148 Scholars</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Acceptance Rate:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">94.2%</span>
                </div>
              </div>
            </Card>

            {/* Card 4: Integrity & First-Pass Pass Rate */}
            <Card className="p-5 bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Integrity Rate
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  100% Verified
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
                  97.2% Clean
                </span>
                <span className="text-xs text-slate-400">
                  First-Pass
                </span>
              </div>
              <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>RIA Cases:</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">2.8% (3 Cases)</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Preprint Matched:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">100% Ingested</span>
                </div>
              </div>
            </Card>
          </div>

          {/* C. Submissions Funnel & Editorial Lifecycle Stages */}
          <Card className="p-6 bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Submissions Funnel
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Conversion metrics and dwell times across pipeline stages.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                164 Submissions (Q3 2026)
              </span>
            </div>

            {/* Funnel Visual Steps */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              {[
                { stage: "1. Intake", count: 164, pct: "100%", time: "0.0d", desc: "Submitted", color: "bg-slate-900 dark:bg-white text-white dark:text-slate-900" },
                { stage: "2. Triage", count: 142, pct: "86.6%", time: "3.2d", desc: "Passed pre-check", color: "bg-[#0b99ff] text-white" },
                { stage: "3. Peer Review", count: 118, pct: "72.0%", time: "12.8d", desc: "Under review", color: "bg-indigo-600 text-white" },
                { stage: "4. Revisions", count: 62, pct: "37.8%", time: "11.2d", desc: "Author revision", color: "bg-purple-600 text-white" },
                { stage: "5. Decisions", count: 36, pct: "21.8%", time: "18.4d", desc: "Accepted", color: "bg-emerald-600 text-white" },
                { stage: "6. Production", count: 36, pct: "100%", time: "3.1d", desc: "DOI minted", color: "bg-emerald-700 text-white" }
              ].map((step, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      {step.stage}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {step.time}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
                      {step.count}
                    </span>
                    <span className="text-xs font-bold text-[#0b99ff]">
                      {step.pct}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${step.color.split(" ")[0]}`}
                      style={{ width: step.pct }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* D. Journal Portfolio Comparative Performance Matrix */}
          <Card className="bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Journal Performance
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Volume, turnaround velocity, and citation projections.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                ● 100% DOI Sync
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[840px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                    <th className="px-5 py-3.5">Journal & ISSN</th>
                    <th className="px-4 py-3.5">Submissions</th>
                    <th className="px-4 py-3.5">Accept Rate</th>
                    <th className="px-4 py-3.5">Turnaround</th>
                    <th className="px-4 py-3.5">CiteScore</th>
                    <th className="px-4 py-3.5">DOI Status</th>
                    <th className="px-4 py-3.5 text-center">Health</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {[
                    {
                      name: "Scholarly Open: Medicine",
                      issn: "ISSN 2940-1022",
                      subs: 48,
                      growth: "+18%",
                      acceptRate: "24.2%",
                      speed: "16.8 Days",
                      citeScore: "4.8",
                      doiStatus: "100% Active",
                      health: "Optimal"
                    },
                    {
                      name: "Engineering & Applied Sciences",
                      issn: "ISSN 2940-1030",
                      subs: 62,
                      growth: "+24%",
                      acceptRate: "19.4%",
                      speed: "18.2 Days",
                      citeScore: "5.2",
                      doiStatus: "100% Active",
                      health: "Optimal"
                    },
                    {
                      name: "Social Sciences & Humanities",
                      issn: "ISSN 2940-1049",
                      subs: 36,
                      growth: "+12%",
                      acceptRate: "22.2%",
                      speed: "20.4 Days",
                      citeScore: "3.9",
                      doiStatus: "100% Active",
                      health: "Target Range"
                    },
                    {
                      name: "Decarbonization & Carbon Tech",
                      issn: "ISSN 2940-1057",
                      subs: 28,
                      growth: "+32%",
                      acceptRate: "17.9%",
                      speed: "17.5 Days",
                      citeScore: "6.1",
                      doiStatus: "100% Active",
                      health: "Optimal"
                    }
                  ].map((j, i) => (
                    <tr key={i} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900 dark:text-white text-xs">{j.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{j.issn}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-bold text-slate-900 dark:text-white tabular-nums">{j.subs} Papers</div>
                        <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{j.growth} YoY</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                          {j.acceptRate}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-bold text-[#0b99ff] tabular-nums">{j.speed}</div>
                        <div className="text-[10px] text-slate-400">&lt;21d Target</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-bold text-slate-900 dark:text-white tabular-nums">
                          {j.citeScore}
                        </div>
                        <div className="text-[10px] text-slate-400">Projected</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                          {j.doiStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          {j.health}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* E. Two-Column Operational Split: Editorial Board Load & Global Authorship */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: Handling Editor Workload & Capacity Radar */}
            <Card className="p-6 bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Editor Workload
                </h4>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  0 Bottlenecks
                </span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    name: "Prof. Clara Zhang",
                    title: "Editor-in-Chief • Engineering",
                    active: 4,
                    max: 6,
                    speed: "16.2d",
                    onTime: "100%",
                    avatar: "CZ"
                  },
                  {
                    name: "Prof. Aris Thorne",
                    title: "Senior Handling Editor • Medicine",
                    active: 3,
                    max: 5,
                    speed: "18.1d",
                    onTime: "98%",
                    avatar: "AT"
                  },
                  {
                    name: "Prof. Hiroshi Tanaka",
                    title: "Associate Editor • Social Sciences",
                    active: 2,
                    max: 5,
                    speed: "19.4d",
                    onTime: "96%",
                    avatar: "HT"
                  }
                ].map((ed, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#0b99ff] to-[#0077cc] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                          {ed.avatar}
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white">{ed.name}</h5>
                          <p className="text-[10px] text-slate-400">{ed.title}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                          {ed.active} / {ed.max} Active
                        </span>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{ed.onTime} on-time</p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0b99ff]"
                        style={{ width: `${(ed.active / ed.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Right: Global Authorship Demographics & Open Access Reach */}
            <Card className="p-6 bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Global Reach & OA
                </h4>
                <span className="text-[10px] font-bold text-[#0b99ff] bg-[#0b99ff]/10 px-2 py-0.5 rounded border border-[#0b99ff]/20">
                  CC-BY 4.0 Gold OA
                </span>
              </div>

              {/* Geographic Distribution Breakdown */}
              <div className="space-y-2.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Author Origins (Q3 2026)
                </div>
                {[
                  { region: "Europe (UK, Germany, Switzerland)", pct: 38, count: "62 papers", color: "bg-[#0b99ff]" },
                  { region: "North America (United States, Canada)", pct: 34, count: "56 papers", color: "bg-indigo-600" },
                  { region: "Asia-Pacific (Japan, Singapore, Australia)", pct: 22, count: "36 papers", color: "bg-emerald-600" },
                  { region: "Latin America & Africa", pct: 6, count: "10 papers", color: "bg-amber-600" }
                ].map((geo, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-700 dark:text-slate-300 font-medium truncate pr-2">{geo.region}</span>
                      <span className="font-bold text-slate-900 dark:text-white tabular-nums shrink-0">{geo.pct}% ({geo.count})</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full ${geo.color}`} style={{ width: `${geo.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Global Readership Highlights */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-0.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Total Readership</span>
                  <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums">48,290+</div>
                  <span className="text-[10px] text-slate-500">PDF downloads</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-0.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Citations</span>
                  <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">OpenAlex Active</div>
                  <span className="text-[10px] text-slate-500">Crossref synced</span>
                </div>
              </div>
            </Card>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. AUDIT ARCHIVES                                                         */}
      {/* ========================================================================= */}
      {activeTab === "archives" && (
        <Card className="bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Audit Logs</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Log of editorial actions and releases.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="px-5 py-3.5 whitespace-nowrap">Timestamp</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Manuscript ID</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Actor</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Action</th>
                  <th className="px-5 py-3.5 min-w-[280px]">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {initialLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                    <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="px-5 py-3.5 font-bold text-[#0b99ff] whitespace-nowrap">{log.paperId}</td>
                    <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300 whitespace-nowrap">{log.actor}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400 min-w-[280px]">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ASSIGN EDITOR & REVIEWERS (MULTI-SOURCE SOURCING)                */}
      {/* ========================================================================= */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#18191e] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-sans rounded-2xl p-6 flex flex-col shadow-2xl">
          <DialogHeader className="pb-1">
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between gap-2">
              <span>Assign Team</span>
              <span className="text-xs font-bold text-[#0b99ff] bg-[#0b99ff]/10 px-2.5 py-0.5 rounded border border-[#0b99ff]/20">
                {selectedManuscript?.id}
              </span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 line-clamp-1">
              {selectedManuscript?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-1 text-xs overflow-y-auto pr-1">
            {/* Handling Editor Selector */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Handling Editor:
              </label>
              <select
                value={selectedEditor}
                onChange={(e) => setSelectedEditor(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-[#0b99ff]"
              >
                <option value="Prof. Aris Thorne">Prof. Aris Thorne (3 active papers · Managing Editor)</option>
                <option value="Prof. Clara Zhang">Prof. Clara Zhang (1 active paper · Section Editor)</option>
                <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins (0 active papers · Available)</option>
              </select>
            </div>

            {/* Sourcing Mode Switcher */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-[#131418] rounded-xl border border-slate-200 dark:border-[#272832] text-xs">
              <button
                type="button"
                onClick={() => setJmReviewerSourceTab("matched")}
                className={`py-1.5 px-2 rounded-lg font-semibold transition-all text-center cursor-pointer text-xs ${
                  jmReviewerSourceTab === "matched"
                    ? "bg-[#0b99ff] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                Editorial Board
              </button>
              <button
                type="button"
                onClick={() => {
                  setJmReviewerSourceTab("suggested")
                  if (!jmOpenAlexResults && selectedManuscript) {
                    handleFetchJmOpenAlexReviewers(selectedManuscript)
                  }
                }}
                className={`py-1.5 px-2 rounded-lg font-semibold transition-all text-center cursor-pointer text-xs ${
                  jmReviewerSourceTab === "suggested"
                    ? "bg-[#0b99ff] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                Global Scholars
              </button>
              <button
                type="button"
                onClick={() => setJmReviewerSourceTab("external")}
                className={`py-1.5 px-2 rounded-lg font-semibold transition-all text-center cursor-pointer text-xs ${
                  jmReviewerSourceTab === "external"
                    ? "bg-[#0b99ff] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                Invite External
              </button>
            </div>

            {/* TAB 1: EDITORIAL BOARD */}
            {jmReviewerSourceTab === "matched" && (
              <div className="space-y-2">
                <div className="space-y-1.5">
                  {reviewersList.map((rev) => {
                    const isChecked = selectedReviewers.includes(rev.name)
                    const activeCount = rev.activeTasks || (rev.name === "Dr. Marcus Vance" ? 2 : rev.name === "Dr. Evelyn Vane" ? 1 : 0)
                    return (
                      <div 
                        key={rev.id} 
                        onClick={() => {
                          setSelectedReviewers(prev => 
                            prev.includes(rev.name) ? prev.filter(r => r !== rev.name) : [...prev, rev.name]
                          )
                        }}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                          isChecked 
                            ? "bg-[#0b99ff]/10 border-[#0b99ff] text-slate-900 dark:text-white" 
                            : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-slate-900 dark:text-white">{rev.name}</span>
                            <span className="text-[11px] font-medium text-[#0b99ff] bg-[#0b99ff]/10 px-2 py-0.2 rounded">
                              {activeCount} active {activeCount === 1 ? "review" : "reviews"}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500">{rev.specialization}</div>
                        </div>
                        <input type="checkbox" checked={isChecked} onChange={() => {}} className="rounded text-[#0b99ff] h-4 w-4 shrink-0" />
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: GLOBAL SCHOLARS (CLEAN MINIMAL METADATA) */}
            {jmReviewerSourceTab === "suggested" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 w-full">
                  <div className="relative flex-1 min-w-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={jmOpenAlexQuery}
                      onChange={(e) => setJmOpenAlexQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleFetchJmOpenAlexReviewers(selectedManuscript, jmOpenAlexQuery)
                        }
                      }}
                      placeholder="Search global scholars by topic or name..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                    />
                  </div>
                  <Button
                    type="button"
                    disabled={isJmSearchingOpenAlex}
                    onClick={() => handleFetchJmOpenAlexReviewers(selectedManuscript, jmOpenAlexQuery)}
                    className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-semibold h-8 px-4 rounded-xl cursor-pointer shadow-xs shrink-0"
                  >
                    {isJmSearchingOpenAlex ? "Searching..." : "Search"}
                  </Button>
                </div>

                {isJmSearchingOpenAlex && (
                  <div className="p-4 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                    <span className="h-4 w-4 border-2 border-[#0b99ff] border-t-transparent rounded-full animate-spin" />
                    <span>Searching global scholars graph...</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  {(jmOpenAlexResults || [
                    {
                      name: "Prof. Hiroshi Tanaka",
                      institution: "University of Tokyo (Japan)",
                      specialty: "Juvenile Diabetes Retinopathy",
                      metrics: "42 papers · 1,420 citations"
                    },
                    {
                      name: "Dr. Sarah Jenkins",
                      institution: "University of Edinburgh (UK)",
                      specialty: "Deep Learning Clinical Triage",
                      metrics: "19 papers · 540 citations"
                    },
                    {
                      name: "Prof. Claire Dupond",
                      institution: "Sorbonne Université (France)",
                      specialty: "Microvascular Biomarkers",
                      metrics: "31 papers · 890 citations"
                    }
                  ]).map((rev, idx) => {
                    const isChecked = selectedReviewers.includes(rev.name)
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedReviewers(prev =>
                            isChecked ? prev.filter(n => n !== rev.name) : [...prev, rev.name]
                          )
                        }}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isChecked ? "border-[#0b99ff] bg-[#0b99ff]/10" : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-slate-300"
                        }`}
                      >
                        <div className="space-y-0.5 pr-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-slate-900 dark:text-white text-xs">{rev.name}</span>
                            <span className="text-[11px] text-slate-500">· {rev.institution}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 flex-wrap">
                            <span className="text-slate-700 dark:text-slate-300 font-medium">{rev.specialty}</span>
                            <span>•</span>
                            <span className="text-[#0b99ff] font-medium">{rev.metrics}</span>
                          </div>
                        </div>
                        <input type="checkbox" checked={isChecked} onChange={() => {}} className="rounded text-[#0b99ff] h-4 w-4 shrink-0" />
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: INVITE EXTERNAL */}
            {jmReviewerSourceTab === "external" && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-white block text-xs">
                      {editingReviewerIndex !== null ? "Edit External Expert Details:" : "Invite External Expert by Email:"}
                    </span>
                    {editingReviewerIndex !== null && (
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                        Editing Reviewer #{editingReviewerIndex + 1}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={customRevName}
                      onChange={(e) => setCustomRevName(e.target.value)}
                      placeholder="Full Name (e.g. Prof. David Miller)"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#18191e] text-xs focus:ring-2 focus:ring-[#0b99ff] focus:outline-none"
                    />
                    <input
                      type="email"
                      value={customRevEmail}
                      onChange={(e) => setCustomRevEmail(e.target.value)}
                      placeholder="Institutional Email (e.g. d.miller@ox.ac.uk)"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#18191e] text-xs focus:ring-2 focus:ring-[#0b99ff] focus:outline-none"
                    />
                    <input
                      type="text"
                      value={customRevAffiliation}
                      onChange={(e) => setCustomRevAffiliation(e.target.value)}
                      placeholder="Institution / Specialty (e.g. University of Oxford)"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#18191e] text-xs focus:ring-2 focus:ring-[#0b99ff] focus:outline-none"
                    />

                    {editingReviewerIndex !== null ? (
                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          type="button"
                          onClick={() => {
                            if (!customRevName.trim() || !customRevEmail.trim()) {
                              alert("Please enter both Name and Email.")
                              return
                            }
                            const oldName = externalReviewersList[editingReviewerIndex].name
                            const newName = customRevName.trim()
                            const updatedList = [...externalReviewersList]
                            updatedList[editingReviewerIndex] = {
                              name: newName,
                              email: customRevEmail.trim(),
                              affiliation: customRevAffiliation.trim()
                            }
                            setExternalReviewersList(updatedList)
                            setSelectedReviewers(prev => prev.map(n => n === oldName ? newName : n))
                            setEditingReviewerIndex(null)
                            setCustomRevName("")
                            setCustomRevEmail("")
                            setCustomRevAffiliation("")
                          }}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-8 rounded-lg cursor-pointer"
                        >
                          Update Reviewer Details
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingReviewerIndex(null)
                            setCustomRevName("")
                            setCustomRevEmail("")
                            setCustomRevAffiliation("")
                          }}
                          className="px-3 text-xs font-medium h-8 rounded-lg cursor-pointer border-slate-300 dark:border-slate-700"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => {
                          if (!customRevName.trim() || !customRevEmail.trim()) {
                            alert("Please enter both Name and Email.")
                            return
                          }
                          const newRev = {
                            name: customRevName.trim(),
                            email: customRevEmail.trim(),
                            affiliation: customRevAffiliation.trim()
                          }
                          setExternalReviewersList(prev => [...prev, newRev])
                          setSelectedReviewers(prev => prev.includes(newRev.name) ? prev : [...prev, newRev.name])
                          setCustomRevName("")
                          setCustomRevEmail("")
                          setCustomRevAffiliation("")
                        }}
                        className="w-full bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-semibold h-8 rounded-lg cursor-pointer"
                      >
                        Add to Selection List
                      </Button>
                    )}
                  </div>

                  {/* Added External Experts List */}
                  {externalReviewersList.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                          Added External Experts ({externalReviewersList.length}):
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Click to select / deselect for invitation
                        </span>
                      </div>
                      <div className="space-y-1.5 max-h-52 overflow-y-auto pr-0.5">
                        {externalReviewersList.map((rev, idx) => {
                          const isCurrentlySelected = selectedReviewers.includes(rev.name)
                          return (
                            <div
                              key={idx}
                              onClick={() => {
                                setSelectedReviewers(prev =>
                                  isCurrentlySelected
                                    ? prev.filter(n => n !== rev.name)
                                    : [...prev, rev.name]
                                )
                              }}
                              className={`p-2.5 rounded-lg border flex items-center justify-between gap-2.5 transition-all cursor-pointer ${
                                editingReviewerIndex === idx
                                  ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20"
                                  : isCurrentlySelected
                                  ? "border-[#0b99ff] bg-[#0b99ff]/10 text-slate-900 dark:text-white"
                                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#14151a] hover:border-slate-300"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                <input
                                  type="checkbox"
                                  checked={isCurrentlySelected}
                                  onChange={() => {}}
                                  className="rounded text-[#0b99ff] h-4 w-4 shrink-0 cursor-pointer"
                                />
                                <div className="min-w-0 flex-1 space-y-0.5">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                                      {rev.name}
                                    </span>
                                    <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${
                                      isCurrentlySelected
                                        ? "text-[#0b99ff] bg-[#0b99ff]/15 font-semibold"
                                        : "text-slate-500 bg-slate-100 dark:bg-slate-800"
                                    }`}>
                                      {isCurrentlySelected ? "✓ Selected to Invite" : "External Expert"}
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-slate-500 truncate flex items-center gap-1.5 flex-wrap">
                                    <span>{rev.email}</span>
                                    {rev.affiliation && (
                                      <>
                                        <span>·</span>
                                        <span>{rev.affiliation}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setEditingReviewerIndex(idx)
                                    setCustomRevName(rev.name)
                                    setCustomRevEmail(rev.email)
                                    setCustomRevAffiliation(rev.affiliation)
                                  }}
                                  className="px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-[#0b99ff] hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    const revToRemove = externalReviewersList[idx]
                                    setExternalReviewersList(prev => prev.filter((_, i) => i !== idx))
                                    setSelectedReviewers(prev => prev.filter(n => n !== revToRemove.name))
                                    if (editingReviewerIndex === idx) {
                                      setEditingReviewerIndex(null)
                                      setCustomRevName("")
                                      setCustomRevEmail("")
                                      setCustomRevAffiliation("")
                                    }
                                  }}
                                  className="px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors cursor-pointer border border-rose-200 dark:border-rose-900/50"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reviewer Invitation Letter */}
            <div className="space-y-3 pt-3 border-t border-slate-200/80 dark:border-[#272832]">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <h4 className="font-semibold text-xs text-slate-900 dark:text-white">
                    {isDe ? "Gutachter-Einladungsschreiben" : "Reviewer Invitation Letter"}
                  </h4>
                </div>

                {/* Sub-Tabs: Edit Letter / Preview */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#131418] p-0.5 rounded-lg border border-slate-200/80 dark:border-[#272832]">
                  <button
                    type="button"
                    onClick={() => setAssignEmailTab("edit")}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                      assignEmailTab === "edit"
                        ? "bg-white dark:bg-[#1f2027] text-slate-900 dark:text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    {isDe ? "Bearbeiten" : "Edit Letter"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssignEmailTab("preview")}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                      assignEmailTab === "preview"
                        ? "bg-white dark:bg-[#1f2027] text-slate-900 dark:text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    {isDe ? "Vorschau" : "Preview"}
                  </button>
                </div>
              </div>

              {/* Subject Line */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                    {isDe ? "Betreff:" : "Subject:"}
                  </label>
                  <span className="text-[10px] text-slate-400">CC: scholarlyopen@gmail.com</span>
                </div>
                <input
                  type="text"
                  value={assignEmailSubject}
                  onChange={(e) => setAssignEmailSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#18191e] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#0b99ff] focus:outline-none"
                />
              </div>

              {/* Body Edit or Preview */}
              {assignEmailTab === "edit" ? (
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                    {isDe ? "Schreiben:" : "Letter Body:"}
                  </label>
                  <textarea
                    rows={9}
                    value={assignEmailBody}
                    onChange={(e) => setAssignEmailBody(e.target.value)}
                    className="w-full p-3 rounded-lg border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#18191e] text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-[#0b99ff] focus:outline-none leading-relaxed"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                    {isDe ? "Vorschau:" : "Email Preview:"}
                  </label>
                  <div className="rounded-lg border border-slate-200 dark:border-[#272832] overflow-hidden bg-slate-50 dark:bg-slate-950 p-2">
                    <iframe
                      title="Review Invitation Email Preview"
                      srcDoc={generateBrandedEmailHtml({
                        subject: assignEmailSubject,
                        bodyText: assignEmailBody.replace(/\{\{recipientName\}\}/g, selectedReviewers[0] || "Dr. Reviewer"),
                        actionLabel: "Accept Review Invitation",
                        actionUrl: `https://www.scholarlyopen.org/editorial360?action=accept&id=${encodeURIComponent(selectedManuscript?.id || '')}&journal=${encodeURIComponent(selectedManuscript?.journal || '')}`,
                        secondaryActionLabel: "Decline Invitation",
                        secondaryActionUrl: `https://www.scholarlyopen.org/editorial360?action=decline&id=${encodeURIComponent(selectedManuscript?.id || '')}&journal=${encodeURIComponent(selectedManuscript?.journal || '')}`,
                        journal: selectedManuscript?.journal || "Scholarly Open",
                        paperId: selectedManuscript?.id,
                        paperTitle: selectedManuscript?.title,
                        recipientName: selectedReviewers[0] || "Dr. Reviewer"
                      })}
                      className="w-full h-[320px] bg-white rounded border border-slate-200 dark:border-slate-800"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 flex-wrap max-w-[65%]">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                Selected ({selectedReviewers.length}):
              </span>
              {selectedReviewers.length === 0 ? (
                <span className="text-xs text-slate-400 italic">None selected yet</span>
              ) : (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedReviewers.map((name) => (
                    <span
                      key={name}
                      className="inline-flex items-center gap-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700"
                    >
                      <span className="max-w-[130px] truncate font-medium">{name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedReviewers(prev => prev.filter(n => n !== name))
                          setExternalReviewersList(prev => prev.filter(r => r.name !== name))
                          if (editingReviewerIndex !== null && externalReviewersList[editingReviewerIndex]?.name === name) {
                            setEditingReviewerIndex(null)
                            setCustomRevName("")
                            setCustomRevEmail("")
                            setCustomRevAffiliation("")
                          }
                        }}
                        className="text-slate-400 hover:text-rose-500 cursor-pointer text-xs font-bold leading-none ml-0.5"
                        title="Remove reviewer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={isAssignSending}
                onClick={() => setIsAssignModalOpen(false)}
                className="text-xs font-semibold border-slate-200 dark:border-slate-800 h-8 px-3 rounded-lg cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmAssignment}
                disabled={selectedReviewers.length === 0 || isAssignSending}
                className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-bold h-8 px-4 rounded-lg cursor-pointer flex items-center gap-1.5"
              >
                {isAssignSending ? (
                  <>
                    <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Assigning & Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3 w-3 mr-1" />
                    <span>Assign & Dispatch Invitations</span>
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 2: PRE-CHECK QUALITY ASSESSMENT                                     */}
      {/* ========================================================================= */}
      <Dialog open={isPreQualityModalOpen} onOpenChange={setIsPreQualityModalOpen}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] bg-white dark:bg-[#18191e] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-sans rounded-2xl p-5 flex flex-col shadow-2xl">
          <DialogHeader className="pb-1">
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between gap-2 pr-6">
              <span>Pre-Check</span>
              <span className="text-xs font-bold text-[#0b99ff] bg-[#0b99ff]/10 px-2.5 py-0.5 rounded border border-[#0b99ff]/20">
                {selectedManuscript?.id}
              </span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 line-clamp-1">
              {selectedManuscript?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-1 text-xs overflow-y-auto pr-1">
            {/* 1. Automated Integrity & Forensic Pre-Scan Suite */}
            {(() => {
              const isFlagged = Boolean(selectedManuscript?.integrityStatus === "Flagged" || (Number(selectedManuscript?.plagiarismScore) > 15) || (Number(selectedManuscript?.aiScore) > 30))
              const plag = selectedManuscript?.plagiarismScore ?? 4.2
              const ai = selectedManuscript?.aiScore ?? 1.8
              const figureStatus = isFlagged ? "Flagged (Review Req)" : "Clean (4 Panels)"

              return (
                <div className={`space-y-2 p-3 rounded-xl border ${
                  isFlagged 
                    ? "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40" 
                    : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                }`}>
                  <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200 text-xs">
                    <span className="flex items-center gap-1.5">
                      {isFlagged ? <ShieldAlert className="h-3.5 w-3.5 text-red-600" /> : <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />}
                      <span>Automated Integrity Pre-Scan</span>
                    </span>
                    {isFlagged ? (
                      <button
                        type="button"
                        onClick={() => {
                          setForensicsManuscript(selectedManuscript)
                          setForensicActionStatus(null)
                          setIsForensicsModalOpen(true)
                        }}
                        className="text-[10px] font-bold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-950/60 hover:bg-red-200 px-2 py-0.5 rounded border border-red-300 dark:border-red-800 cursor-pointer flex items-center gap-1 transition-all"
                      >
                        <span>Audit Flagged (Open Forensics)</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </button>
                    ) : (
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.2 rounded border border-emerald-200 dark:border-emerald-900/30">
                        All Systems Passed ✓
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {/* Plagiarism */}
                    <div className="p-2 rounded-lg bg-white dark:bg-[#18191e] border border-slate-200 dark:border-slate-800">
                      <div className="text-[10px] text-slate-400 font-medium">Similarity</div>
                      <div className={`text-xs font-bold mt-0.5 ${plag > 15 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                        {plag}% <span className="text-[10px] text-slate-400 font-normal">{plag > 15 ? "(>15% Alert)" : "(<15%)"}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">iThenticate / Crossref</div>
                    </div>

                    {/* AI Text Detector */}
                    <div className="p-2 rounded-lg bg-white dark:bg-[#18191e] border border-slate-200 dark:border-slate-800">
                      <div className="text-[10px] text-slate-400 font-medium">AI Text</div>
                      <div className={`text-xs font-bold mt-0.5 ${ai > 30 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                        {ai}% <span className="text-[10px] text-slate-400 font-normal">{ai > 30 ? "(Elevated)" : "(Human)"}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">{ai > 30 ? "Synthetic markers" : "No synthetic markers"}</div>
                    </div>

                    {/* AI Image & Figure Forensics */}
                    <div className="p-2 rounded-lg bg-white dark:bg-[#18191e] border border-slate-200 dark:border-slate-800">
                      <div className="text-[10px] text-slate-400 font-medium">Figure Scan</div>
                      <div className={`text-xs font-bold mt-0.5 ${isFlagged ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                        {figureStatus}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">{isFlagged ? "Review raw blots" : "No clone tampering"}</div>
                    </div>
                  </div>
                </div>
              )
            })()}

            {/* Download Files List for JM */}
            <div className="space-y-1.5">
              <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                Submitted Manuscript Files:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={selectedManuscript?.fileUrl || selectedManuscript?.revisedFileUrl || "/downloads/Scholarly_Open_Manuscript_Template.txt"}
                  download={selectedManuscript?.fileName || `${selectedManuscript?.id || "Manuscript"}_Main_Document.pdf`}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-[#0b99ff] transition-all text-slate-700 dark:text-slate-300 font-medium"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="h-3.5 w-3.5 text-[#0b99ff] shrink-0" />
                    <div className="truncate">
                      <span className="truncate block">
                        {selectedManuscript?.fileName || "Main Manuscript (PDF)"}
                      </span>
                      {selectedManuscript?.fileSize && (
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {selectedManuscript.fileSize}
                        </span>
                      )}
                    </div>
                  </div>
                  <Download className="h-3 w-3 text-slate-400 shrink-0 ml-1" />
                </a>

                <a
                  href="/downloads/Scholarly_Open_Author_Checklist.txt"
                  download={`${selectedManuscript?.id || "Manuscript"}_Figures_Tables.zip`}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-[#0b99ff] transition-all text-slate-700 dark:text-slate-300 font-medium"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Download className="h-3.5 w-3.5 text-[#0b99ff] shrink-0" />
                    <span className="truncate">Figures & Tables (ZIP)</span>
                  </div>
                  <Download className="h-3 w-3 text-slate-400 shrink-0 ml-1" />
                </a>

                <a
                  href="/downloads/Scholarly_Open_Author_Checklist.txt"
                  download={`${selectedManuscript?.id || "Manuscript"}_Supplementary.pdf`}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-[#0b99ff] transition-all text-slate-700 dark:text-slate-300 font-medium"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="h-3.5 w-3.5 text-[#0b99ff] shrink-0" />
                    <span className="truncate">Supplementary File</span>
                  </div>
                  <Download className="h-3 w-3 text-slate-400 shrink-0 ml-1" />
                </a>

                <a
                  href="/downloads/Scholarly_Open_Author_Checklist.txt"
                  download={`${selectedManuscript?.id || "Manuscript"}_Ethics_Declaration.pdf`}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-[#0b99ff] transition-all text-slate-700 dark:text-slate-300 font-medium"
                >
                  <div className="flex items-center gap-2 truncate">
                    <CheckSquare className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">Ethics & COI Form</span>
                  </div>
                  <Download className="h-3 w-3 text-slate-400 shrink-0 ml-1" />
                </a>
              </div>
            </div>

            {/* Manual Check list */}
            <div className="space-y-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                Verification Checklist:
              </span>
              <div className="space-y-1.5">
                {[
                  { key: "manuscriptFile", label: "Format & double-blind anonymization verified" },
                  { key: "figuresTables", label: "High-resolution figures & clear captions present" },
                  { key: "supplementary", label: "Data availability & supplementary materials complete" },
                  { key: "ethicsDeclaration", label: "IRB approval and ethics declaration signed" },
                  { key: "scopeFit", label: "Scope & aim matches journal discipline" }
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-slate-300 transition-all text-xs">
                    <input 
                      type="checkbox" 
                      checked={preCheckChecks[item.key]} 
                      onChange={() => setPreCheckChecks(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                      className="rounded text-[#0b99ff] h-3.5 w-3.5 shrink-0"
                    />
                    <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-row items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsQueryAuthorOpen(true)}
              className="text-xs font-semibold text-amber-700 dark:text-amber-300 border-amber-300 hover:bg-amber-50 dark:border-amber-900/40 h-8 px-3 rounded-lg cursor-pointer"
            >
              <AlertCircle className="h-3.5 w-3.5 mr-1 text-amber-500" />
              Return to Author
            </Button>
            <Button
              size="sm"
              disabled={!allChecksComplete}
              onClick={() => {
                if (selectedManuscript) {
                  handleOpenAssign(selectedManuscript)
                  setIsPreQualityModalOpen(false)
                }
              }}
              className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-bold h-8 px-4 rounded-lg"
            >
              Pass Pre-Check & Proceed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 2B: RETURN TO AUTHOR PRE-CHECK QUERY                                 */}
      {/* ========================================================================= */}
      <Dialog open={isQueryAuthorOpen} onOpenChange={setIsQueryAuthorOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-[#18191e] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-sans">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
              Return to Author
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Notify the author about missing files or formatting issues.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Correction Instructions for Author
              </label>
              <textarea
                rows={4}
                value={queryAuthorMessage}
                onChange={(e) => setQueryAuthorMessage(e.target.value)}
                placeholder="E.g., Please provide high-resolution TIFF/EPS figures and ensure author names are removed from the main manuscript for double-blind review."
                className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-[#0b99ff]"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsQueryAuthorOpen(false)}
              className="text-xs font-semibold border-slate-200 dark:border-slate-800 h-8 px-3.5 rounded-lg"
            >
              Back
            </Button>
            <Button
              size="sm"
              onClick={handleSendPrecheckQuery}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold h-8 px-4 rounded-lg"
            >
              <Send className="h-3.5 w-3.5 mr-1" />
              Dispatch Query to Author
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 3: SANITIZE & APPROVE REVIEW REMARKS                                */}
      {/* ========================================================================= */}
      <Dialog open={isModModalOpen} onOpenChange={setIsModModalOpen}>
        <DialogContent className="max-w-xl bg-white dark:bg-[#18191e] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-sans">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#0b99ff]" />
              Sanitize & Dispatch Review Comments to Handling Editor
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Manuscript ID: {moderatingReview?.paperId} • Reviewer: {moderatingReview?.reviewerName}
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs space-y-1">
            <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              Handling Editor Access Gate
            </div>
            <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
              Unless and until the Journal Manager dispatches the comments after sanitizing them, the Handling Editor cannot see them. Please review the text below to remove unblinded identity clues, harsh phrasing, or personal remarks before releasing.
            </p>
          </div>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Author-Facing Review Comments (Sanitizable by JM)</span>
                <span className="text-[10px] text-slate-400 font-normal">Editable</span>
              </label>
              <textarea
                rows={5}
                value={modEditedComments}
                onChange={(e) => setModEditedComments(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-[#0b99ff] leading-relaxed font-sans"
              />
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg space-y-1 text-slate-600 dark:text-slate-400">
              <span className="text-xs font-bold uppercase text-slate-400">Confidential Editor Note (Not Released to Author)</span>
              <p className="italic text-xs">&ldquo;{moderatingReview?.commentsEditor || "Methodology is sound; language in section 4 needs polishing."}&rdquo;</p>
            </div>
          </div>

          <DialogFooter className="flex flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModModalOpen(false)}
              className="text-xs font-semibold border-slate-200 dark:border-slate-800 h-8 px-3.5 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmModerationRelease}
              className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-bold h-8 px-4 rounded-lg cursor-pointer flex items-center gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              Sanitize & Dispatch to Handling Editor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 4: GALLEY PROOF & PRODUCTION FILE                                    */}
      {/* ========================================================================= */}
      <Dialog open={isGalleyModalOpen} onOpenChange={setIsGalleyModalOpen}>
        <DialogContent className="max-w-2xl bg-white dark:bg-[#18191e] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-sans">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Galley Proof</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/30">
                CC-BY 4.0 Open Access
              </span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {galleyManuscript?.id}: {galleyManuscript?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Galley Preview Sheet */}
            <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-2 flex justify-between items-center text-xs">
                <span className="font-extrabold text-[#0b99ff]">Scholarly Open</span>
                <span className="text-slate-400">DOI: 10.59236/soeas.2026.104</span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {galleyManuscript?.title}
              </h3>

              <div className="text-slate-600 dark:text-slate-400 text-xs">
                Author: {galleyManuscript?.authorName || "Dr. Evelyn Vane"} • Status: <span className="font-bold text-emerald-600">Approved by Author ✓</span>
              </div>

              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                {galleyManuscript?.abstract || "This study demonstrates significant advances in open access scientific methodology."}
              </p>
            </div>

            {/* Upload Typeset Galley PDF Option */}
            <div className="p-4 bg-white dark:bg-[#121316] border border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Upload Formatted Typeset Galley PDF</div>
                <div className="text-xs text-slate-400">Upload the final layout with formatted tables, references and DOI stamp.</div>
                {uploadedGalleyFileName && (
                  <div className="text-xs font-bold text-emerald-600 mt-1">✓ {uploadedGalleyFileName}</div>
                )}
              </div>

              <label className="shrink-0 bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-bold px-3.5 py-2 rounded-lg cursor-pointer flex items-center gap-1.5 h-8">
                <Upload className="h-3.5 w-3.5" />
                Upload PDF
                <input 
                  type="file" 
                  accept=".pdf" 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadedGalleyFileName(e.target.files[0].name)
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <DialogFooter className="flex flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsGalleyModalOpen(false)}
              className="text-xs font-semibold border-slate-200 dark:border-slate-800 h-8 px-3.5 rounded-lg"
            >
              Close
            </Button>
            <a
              href="/downloads/Scholarly_Open_Manuscript_Template.txt"
              download={`${galleyManuscript?.id || "Manuscript"}_Galley_Proof.pdf`}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 h-8"
            >
              <Download className="h-3.5 w-3.5" />
              Download Galley PDF
            </a>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 5: REGISTER REVIEWER                                                */}
      {/* ========================================================================= */}
      <Dialog open={isAddReviewerOpen} onOpenChange={setIsAddReviewerOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-[#18191e] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-sans">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
              Invite Reviewer
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Add a peer reviewer to the active registry pool and send an invitation.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddReviewer} className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Full Name</label>
              <input
                type="text"
                required
                value={newRevName}
                onChange={(e) => setNewRevName(e.target.value)}
                placeholder="Dr. Julia Sterling"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Institutional Email</label>
              <input
                type="email"
                required
                value={newRevEmail}
                onChange={(e) => setNewRevEmail(e.target.value)}
                placeholder="j.sterling@university.edu"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">ORCID iD</label>
              <input
                type="text"
                value={newRevOrcid}
                onChange={(e) => setNewRevOrcid(e.target.value)}
                placeholder="0000-0002-1825-0097"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Specialization</label>
              <input
                type="text"
                value={newRevSpecialty}
                onChange={(e) => setNewRevSpecialty(e.target.value)}
                placeholder="AI Diagnostics, Clinical Imaging"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-slate-100"
              />
            </div>

            <DialogFooter className="flex flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddReviewerOpen(false)}
                className="text-xs font-semibold border-slate-200 dark:border-slate-800 h-8 px-3.5 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-bold h-8 px-4 rounded-lg"
              >
                Invite Reviewer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 6: PEER REVIEW PROGRESS & REVIEWER TRACKING                         */}
      {/* ========================================================================= */}
      <Dialog open={isTrackModalOpen} onOpenChange={setIsTrackModalOpen}>
        <DialogContent className="max-w-3xl bg-white dark:bg-[#18191e] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-sans">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex flex-wrap items-center justify-between gap-2 pr-6">
              <span>Review Tracker</span>
              <span className="text-xs font-bold text-[#0b99ff] bg-[#0b99ff]/10 px-2.5 py-0.5 rounded-md border border-[#0b99ff]/20">
                {trackingManuscript?.id}
              </span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {trackingManuscript?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Handling Editor Info */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-slate-400 font-medium block text-[11px] uppercase tracking-wider">Handling Editor</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{trackingManuscript?.assignedEditorName || "Prof. Clara Zhang"}</span>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded border border-emerald-200 dark:border-emerald-900/30">
                Managing Active Round
              </span>
            </div>

            {/* 2/2 Complete Banner with Prompt Editor Action */}
            {(trackingManuscript?.id === "SOEAS-26-RS102" || (trackingManuscript?.reviewers && trackingManuscript.reviewers.length > 0 && trackingManuscript.reviewers.every(r => r === "Dr. Evelyn Vane" || r === "Dr. Marcus Vance"))) && (
              <div className="p-3.5 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-xs">
                      All Assigned Reviews Completed (2/2)
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Peer review reports logged and ready for {trackingManuscript?.assignedEditorName || "Prof. Clara Zhang"}&apos;s official verdict.
                    </div>
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => {
                    triggerConfirm({
                      title: "Prompt Handling Editor for Decision?",
                      message: `Are you sure you want to notify Handling Editor (${trackingManuscript?.assignedEditorName || "Prof. Clara Zhang"}) that all 2/2 reviewer evaluations are in and prompt for the official verdict?`,
                      confirmButtonLabel: "Yes, Prompt Editor",
                      confirmColorClass: "bg-purple-600 hover:bg-purple-700",
                      onConfirm: () => {
                        if (trackingManuscript) {
                          setPromptedEditors(prev => ({ ...prev, [trackingManuscript.id]: true }))
                        }
                        setEditorPromptSuccess(`✓ Automated alert dispatched to Handling Editor (${trackingManuscript?.assignedEditorName || "Prof. Clara Zhang"}). Pipeline status updated to 'Editor Prompted'.`)
                        setTimeout(() => setEditorPromptSuccess(null), 6000)
                      }
                    })
                  }}
                  className={`text-xs font-bold h-8 px-3.5 rounded-lg cursor-pointer shrink-0 transition-all ${
                    promptedEditors[trackingManuscript?.id || ""]
                      ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700 hover:bg-indigo-100"
                      : "bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                  }`}
                >
                  {promptedEditors[trackingManuscript?.id || ""] ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1 text-indigo-600" />
                      Editor Prompted ✓
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5 mr-1" />
                      Prompt Editor for Decision
                    </>
                  )}
                </Button>
              </div>
            )}

            {editorPromptSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold rounded-xl flex items-center justify-between shadow-2xs">
                <span>{editorPromptSuccess}</span>
                <button onClick={() => setEditorPromptSuccess(null)} className="text-xs font-bold cursor-pointer">✕</button>
              </div>
            )}

            {/* Reviewer History */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#0b99ff]" />
                  <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs uppercase tracking-wider">
                    Reviewer History
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {(() => {
                      const list = paperReviewerHistory.length > 0 
                        ? paperReviewerHistory 
                        : (trackingManuscript?.reviewers || ["Dr. Evelyn Vane", "Dr. Marcus Vance"]).map((r, i) => ({
                            id: `mock-${i}`,
                            paperId: trackingManuscript?.id || "",
                            reviewerName: r,
                            reviewerEmail: r === "Dr. Evelyn Vane" ? "e.vane@university-medical.edu" : (r === "Dr. Marcus Vance" ? "m.vance@university-charite.de" : "reviewer@scholarlyopen.org"),
                            invitedDate: "2026-08-20",
                            status: (r === "Dr. Evelyn Vane" || (trackingManuscript?.id === "SOEAS-26-RS102" && r === "Dr. Marcus Vance") ? "Completed" : "Accepted") as any
                          }))
                      return `${list.length} logged`
                    })()}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (trackingManuscript) {
                        setIsTrackModalOpen(false)
                        handleOpenAssign(trackingManuscript)
                      }
                    }}
                    className="h-7 text-[11px] font-semibold border-slate-200 dark:border-slate-800 cursor-pointer"
                  >
                    <UserPlus className="h-3 w-3 mr-1 text-[#0b99ff]" />
                    Invite Reviewer
                  </Button>
                </div>
              </div>

              {(() => {
                const displayList: {
                  id: string
                  name: string
                  email: string
                  invitedDate: string
                  status: "Invited" | "Accepted" | "Declined" | "Completed"
                  deadline?: string
                  declineReason?: string
                  declineReferral?: string
                }[] = paperReviewerHistory.length > 0
                  ? paperReviewerHistory.map(h => ({
                      id: h.id,
                      name: h.reviewerName,
                      email: h.reviewerEmail,
                      invitedDate: h.invitedDate,
                      status: h.status,
                      deadline: h.deadline,
                      declineReason: h.declineReason,
                      declineReferral: h.declineReferral
                    }))
                  : (trackingManuscript?.reviewers || ["Dr. Evelyn Vane", "Dr. Marcus Vance"]).map((revName, idx) => ({
                      id: `REV-FALLBACK-${idx}`,
                      name: revName,
                      email: revName === "Dr. Evelyn Vane" ? "e.vane@university-medical.edu" : (revName === "Dr. Marcus Vance" ? "m.vance@university-charite.de" : "reviewer@scholarlyopen.org"),
                      invitedDate: "2026-08-20",
                      status: (revName === "Dr. Evelyn Vane" || (trackingManuscript?.id === "SOEAS-26-RS102" && revName === "Dr. Marcus Vance") ? "Completed" : "Accepted") as any,
                      deadline: "2026-09-04"
                    }))

                return displayList.map((rev) => {
                  const revName = rev.name
                  const isDeclined = rev.status === "Declined"
                  const isInvitedOnly = rev.status === "Invited"

                  // Match any real submitted review from initialReviews
                  const matchedReview = initialReviews.find(r => 
                    (r.paperId?.toLowerCase() === trackingManuscript?.id?.toLowerCase() || (r as any).manuscriptId?.toLowerCase() === trackingManuscript?.id?.toLowerCase()) &&
                    (r.reviewerName?.toLowerCase().includes(revName.toLowerCase()) || revName.toLowerCase().includes(r.reviewerName?.toLowerCase()) || !r.reviewerName)
                  ) || (initialReviews.length === 1 && (initialReviews[0].paperId?.toLowerCase() === trackingManuscript?.id?.toLowerCase() || (initialReviews[0] as any).manuscriptId?.toLowerCase() === trackingManuscript?.id?.toLowerCase()) ? initialReviews[0] : undefined)

                  const isSubmitted = !!matchedReview || rev.status === "Completed" || revName === "Dr. Evelyn Vane" || (trackingManuscript?.id === "SOEAS-26-RS102" && (revName === "Dr. Marcus Vance" || revName === "Dr. Evelyn Vane"))
                  const isOverdue = !isDeclined && !isInvitedOnly && (trackingManuscript?.id === "SOSSH-26-SRW107" || revName === "Prof. Hiroshi Tanaka")
                  const isRemarksApproved = !!approvedReviewRemarks[revName] || !!(matchedReview && (matchedReview.status === ("Approved" as any) || matchedReview.status === "Released" || approvedReviewRemarks[matchedReview.id]))
                  const isNudged = !!nudgedReviewers[revName]
                  const baseDays = trackingManuscript?.id === "SOEAS-26-RS106" ? 5 : 11
                  const extraDays = extendedDays[revName] || 0
                  const remainingDays = baseDays + extraDays

                  const baseDate = trackingManuscript?.id === "SOEAS-26-RS106" ? new Date("2026-08-30") : new Date("2026-09-04")
                  const targetDate = new Date(baseDate)
                  targetDate.setDate(targetDate.getDate() + extraDays)
                  const targetDeadlineDate = rev.deadline || targetDate.toISOString().split("T")[0]

                  // Compute display score & recommendation from matched review if available
                  const mrAny = matchedReview as any
                  const displayScore = mrAny?.scores 
                    ? ((mrAny.scores.novelty + mrAny.scores.methodology + mrAny.scores.clarity + mrAny.scores.significance) / 4).toFixed(1)
                    : (matchedReview?.originality ? `${matchedReview.originality}.0` : "4.8")
                  const displayRecommendation = matchedReview?.recommendation || "Minor Revision"
                  const displayQuote = matchedReview?.sanitizedCommentsAuthor || matchedReview?.commentsAuthor || "The methodology is rigorous and well-supported. Minor clarifications required in Section 4."

                  if (isDeclined) {
                    return (
                      <div 
                        key={rev.id || revName}
                        className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20 space-y-2.5 transition-all animate-in fade-in"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">
                                {revName}
                              </h4>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                {rev.email} · Invited on {rev.invitedDate}
                              </div>
                            </div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold text-rose-700 bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 whitespace-nowrap">
                              <X className="h-3 w-3" /> Declined
                            </span>
                          </div>

                          <Button
                            size="sm"
                            onClick={() => {
                              if (trackingManuscript) {
                                setIsTrackModalOpen(false)
                                handleOpenAssign(trackingManuscript)
                              }
                            }}
                            className="h-8 text-xs font-semibold bg-[#0b99ff] hover:bg-[#0088e0] text-white px-3 rounded-lg cursor-pointer whitespace-nowrap"
                          >
                            <UserPlus className="h-3.5 w-3.5 mr-1" />
                            Invite Replacement
                          </Button>
                        </div>

                        <div className="p-2.5 bg-white/80 dark:bg-slate-900/80 border border-rose-200/80 dark:border-rose-900/30 rounded-lg text-xs space-y-1">
                          <div className="text-slate-700 dark:text-slate-300">
                            <strong className="text-rose-700 dark:text-rose-400 font-semibold">Decline Reason:</strong> {rev.declineReason || "Schedule conflict / heavy review workload"}
                          </div>
                          {rev.declineReferral && (
                            <div className="text-slate-600 dark:text-slate-400 text-[11px]">
                              <strong className="text-slate-700 dark:text-slate-300 font-medium">Recommended Colleague:</strong> {rev.declineReferral}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  }

                  if (isInvitedOnly) {
                    return (
                      <div 
                        key={rev.id || revName}
                        className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/10 space-y-2.5 transition-all animate-in fade-in"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">
                                {revName}
                              </h4>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                {rev.email} · Dispatched on {rev.invitedDate}
                              </div>
                            </div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold text-amber-700 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 whitespace-nowrap">
                              <Clock className="h-3 w-3" /> Invited (Pending Response)
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleNudgeReviewer(revName)}
                              disabled={isNudged}
                              className={`h-8 text-xs font-semibold px-3 rounded-lg cursor-pointer whitespace-nowrap transition-all shadow-2xs ${
                                isNudged 
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" 
                                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18191e] text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                              }`}
                            >
                              {isNudged ? (
                                <>
                                  <Check className="h-3.5 w-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />
                                  Reminder Dispatched
                                </>
                              ) : (
                                <>
                                  <Bell className="h-3.5 w-3.5 mr-1 text-[#0b99ff]" />
                                  Send Reminder
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Invitation sent · Awaiting reviewer acceptance or decline via portal.
                        </div>
                      </div>
                    )
                  }

                  return (
                    <div 
                      key={rev.id || revName}
                      className={`p-4 rounded-xl border transition-all space-y-2.5 ${
                        isOverdue 
                          ? "bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/40" 
                          : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">
                              {revName}
                            </h4>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {rev.email}
                            </div>
                          </div>
                          {isSubmitted ? (
                            <div className="flex items-center gap-1.5">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/30 whitespace-nowrap">
                                Report Submitted ✓
                              </span>
                              {isRemarksApproved && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 whitespace-nowrap animate-in fade-in">
                                  <Check className="h-3 w-3" />
                                  Remarks Approved
                                </span>
                              )}
                            </div>
                          ) : isOverdue ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 whitespace-nowrap">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse"></span>
                              ⚠ Overdue by 3d
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold text-[#0b99ff] bg-[#0b99ff]/10 border border-[#0b99ff]/20 whitespace-nowrap">
                              Accepted (Due in {remainingDays}d)
                            </span>
                          )}
                        </div>

                        {!isSubmitted ? (
                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleNudgeReviewer(revName)}
                              disabled={isNudged}
                              className={`h-8 text-xs font-semibold px-3 rounded-lg cursor-pointer whitespace-nowrap transition-all shadow-2xs ${
                                isNudged 
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" 
                                  : isOverdue 
                                    ? "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:border-rose-900/50 dark:text-rose-300" 
                                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18191e] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80"
                              }`}
                            >
                              {isNudged ? (
                                <>
                                  <Check className="h-3.5 w-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />
                                  Reminder Dispatched
                                </>
                              ) : isOverdue ? (
                                <>
                                  <AlertCircle className="h-3.5 w-3.5 mr-1 text-rose-600 dark:text-rose-400" />
                                  Send Urgent Nudge
                                </>
                              ) : (
                                <>
                                  <Bell className="h-3.5 w-3.5 mr-1 text-[#0b99ff]" />
                                  Send Reminder
                                </>
                              )}
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleExtendReviewer(revName)}
                              className="h-8 text-xs font-semibold border-slate-200 dark:border-slate-800 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 px-2.5 whitespace-nowrap"
                            >
                              +7d Extension
                            </Button>

                            {extraDays > 0 && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleResetReviewerExtension(revName)}
                                title="Reset / Undo added days"
                                className="h-8 text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 px-2 rounded-lg cursor-pointer whitespace-nowrap"
                              >
                                ↺ Reset
                              </Button>
                            )}
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const revObj: JmReviewFeedback = matchedReview ? {
                                id: matchedReview.id,
                                paperId: trackingManuscript?.id || matchedReview.paperId,
                                reviewerName: matchedReview.reviewerName || revName,
                                originalComments: matchedReview.originalComments || matchedReview.commentsAuthor || "",
                                sanitizedCommentsAuthor: matchedReview.sanitizedCommentsAuthor || matchedReview.commentsAuthor || "",
                                commentsAuthor: matchedReview.commentsAuthor || "",
                                commentsEditor: matchedReview.commentsEditor || "",
                                recommendation: matchedReview.recommendation || "Minor Revision",
                                originality: (matchedReview as any).originality || ((matchedReview as any).scores ? Math.round(((matchedReview as any).scores.novelty + (matchedReview as any).scores.methodology + (matchedReview as any).scores.clarity + (matchedReview as any).scores.significance) / 4) : 5),
                                status: (matchedReview.status as any) || "Pending Moderation"
                              } : {
                                id: `REV-FB-${revName.replace(/\s+/g, '')}`,
                                paperId: trackingManuscript?.id || "SOEAS-26-RS102",
                                reviewerName: revName,
                                originalComments: "The methodology is rigorous and well-supported. Minor clarifications required in Section 4.",
                                sanitizedCommentsAuthor: "The methodology is rigorous and well-supported. Minor clarifications required in Section 4.",
                                commentsAuthor: "The methodology is rigorous and well-supported. Minor clarifications required in Section 4.",
                                commentsEditor: "Solid paper. Recommend minor revision.",
                                recommendation: "Minor Revision",
                                originality: 5,
                                status: "Pending Moderation"
                              }
                              handleOpenModeration(revObj)
                            }}
                            className={`h-7.5 text-xs font-bold px-3 rounded-lg cursor-pointer shrink-0 transition-all ${
                              isRemarksApproved
                                ? "text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                                : "text-[#0b99ff] border-[#0b99ff]/30 hover:bg-sky-50 dark:hover:bg-sky-950/30"
                            }`}
                          >
                            {isRemarksApproved ? (
                              <>
                                <MessageSquare className="h-3.5 w-3.5 mr-1 text-slate-500" />
                                Edit Sanitized Remarks
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="h-3.5 w-3.5 mr-1 text-[#0b99ff]" />
                                Sanitize & Dispatch
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {isSubmitted ? (
                          <div className="flex items-center gap-2 flex-wrap pt-0.5">
                            <span>Scorecard: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{displayScore} / 5.0</strong> • Recommendation: <strong className="text-[#0b99ff]">{displayRecommendation}</strong></span>
                            {isRemarksApproved ? (
                              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                                ✓ Sanitized & Dispatched to Editor
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                                <Lock className="h-2.5 w-2.5" />
                                Pending JM Sanitization (Editor Locked)
                              </span>
                            )}
                          </div>
                        ) : isOverdue ? (
                          <span className="text-red-600 dark:text-red-400 font-medium">Deadline was 2026-08-22 (3 days overdue) • Follow-up reminder required</span>
                        ) : (
                          <span>Invitation accepted • Target report due: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{targetDeadlineDate}</strong></span>
                        )}
                      </div>

                      {isSubmitted && (
                        <div className="p-2.5 bg-white dark:bg-[#121316] border border-slate-200/80 dark:border-slate-800 rounded-lg text-[11px] text-slate-600 dark:text-slate-400 italic">
                          &ldquo;{displayQuote}&rdquo;
                        </div>
                      )}
                    </div>
                  )
                })
              })()}
            </div>
          </div>

          <DialogFooter className="flex flex-row items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsTrackModalOpen(false)
                if (trackingManuscript) handleOpenAssign(trackingManuscript)
              }}
              className="text-xs font-semibold border-slate-200 dark:border-slate-800 h-8 px-3.5 rounded-lg text-[#0b99ff]"
            >
              <UserPlus className="h-3.5 w-3.5 mr-1" />
              Invite Alternate Reviewer
            </Button>
            <Button
              size="sm"
              onClick={() => setIsTrackModalOpen(false)}
              className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-bold h-8 px-4 rounded-lg"
            >
              Close Tracker
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 7: REVISION CONTROL & TRIAGE DISPATCH                                */}
      {/* ========================================================================= */}
      <Dialog open={isRevisionModalOpen} onOpenChange={setIsRevisionModalOpen}>
        <DialogContent className="max-w-xl bg-white dark:bg-[#18191e] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-sans max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0b99ff] bg-[#0b99ff]/10 px-2.5 py-0.5 rounded-md border border-[#0b99ff]/20 text-xs">
                  {selectedRevisionManuscript?.id}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/80">
                  Revision Received (v2)
                </span>
              </div>
            </div>
            <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white mt-2">
              {selectedRevisionManuscript?.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {selectedRevisionManuscript?.journal} • Author: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{selectedRevisionManuscript?.authorName || "Dr. Sarah Jenkins"}</strong>
            </DialogDescription>
          </DialogHeader>

          {revisionActionSuccess ? (
            <div className="p-4 my-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 rounded-xl text-center space-y-2 animate-in fade-in duration-200">
              <div className="h-8 w-8 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                <Check className="h-5 w-5" />
              </div>
              <div className="font-bold text-emerald-800 dark:text-emerald-300 text-xs">
                {revisionActionSuccess}
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setIsRevisionModalOpen(false)
                  setRevisionActionSuccess(null)
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-1 rounded-lg cursor-pointer"
              >
                Done
              </Button>
            </div>
          ) : (
            <div className="space-y-3.5 py-2 text-xs">
              {/* 1. File Downloads */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={selectedRevisionManuscript?.revisedFileUrl || selectedRevisionManuscript?.fileUrl || "/downloads/Scholarly_Open_Manuscript_Template.txt"}
                  download={selectedRevisionManuscript?.revisedFileName || selectedRevisionManuscript?.fileName || `${selectedRevisionManuscript?.id || "Manuscript"}_Clean_Revision.pdf`}
                  className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-[#0b99ff]/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCheck2 className="h-4 w-4 text-[#0b99ff] shrink-0" />
                    <div className="truncate">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                        {selectedRevisionManuscript?.revisedFileName || selectedRevisionManuscript?.fileName || "Clean Revised PDF"}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {selectedRevisionManuscript?.revisedFileSize || selectedRevisionManuscript?.fileSize || "2.8 MB"}
                      </span>
                    </div>
                  </div>
                  <Download className="h-3.5 w-3.5 text-slate-400 shrink-0 ml-1" />
                </a>

                <a
                  href="/downloads/Scholarly_Open_Manuscript_Template.txt"
                  download={`${selectedRevisionManuscript?.id || "Manuscript"}_Tracked_Changes.docx`}
                  className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-purple-400 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="h-4 w-4 text-purple-500 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">Tracked Changes</span>
                  </div>
                  <Download className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                </a>
              </div>

              {/* 2. Point-by-Point Author Rebuttal */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5">
                <div className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                  Author Rebuttal & Point-by-Point Response:
                </div>
                <div className="p-2.5 bg-white dark:bg-[#14151a] border border-slate-200/80 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 text-xs max-h-28 overflow-y-auto leading-relaxed">
                  &ldquo;We thank Reviewer 1 for the insightful feedback. We have thoroughly revised Section 3, added sensitivity checks for 2024 OECD metrics in Table 4, and corrected all formatting anomalies. Tracked changes are highlighted in the attached document.&rdquo;
                </div>
              </div>

              {/* 3. Streamlined Actions */}
              <div className="space-y-2 pt-1">
                <span className="font-bold text-slate-700 dark:text-slate-300 text-xs block">
                  Select Action:
                </span>

                {/* Action 1: Forward to Handling Editor */}
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl gap-3">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-xs">
                      Forward to Handling Editor
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Route to {selectedRevisionManuscript?.assignedEditorName || "Prof. Aris Thorne"} for evaluation & decision.
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      triggerConfirm({
                        title: "Forward to Handling Editor?",
                        message: `Are you sure you would like to forward revised manuscript ${selectedRevisionManuscript?.id} to Handling Editor (${selectedRevisionManuscript?.assignedEditorName || "Prof. Aris Thorne"}) for re-evaluation & decision?`,
                        confirmButtonLabel: "Yes, Forward to Editor",
                        confirmColorClass: "bg-[#0b99ff] hover:bg-[#0088e0]",
                        onConfirm: () => {
                          if (selectedRevisionManuscript && onUpdateManuscriptStatus) {
                            onUpdateManuscriptStatus(selectedRevisionManuscript.id, "Revision Under Evaluation")
                            setRevisionActionSuccess(`✓ Manuscript ${selectedRevisionManuscript.id} forwarded to Handling Editor (${selectedRevisionManuscript.assignedEditorName || "Prof. Aris Thorne"}).`)
                          }
                        }
                      })
                    }}
                    className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-bold h-8 px-3.5 rounded-lg cursor-pointer shrink-0"
                  >
                    <Send className="h-3.5 w-3.5 mr-1" />
                    Forward to Editor
                  </Button>
                </div>

                {/* Action 2: Dispatch Round 2 Review */}
                <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-xs">
                        Dispatch for Round 2 Peer Review
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Send to willing reviewers for re-assessment (14-day turnaround).
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        triggerConfirm({
                          title: "Dispatch Round 2 Review?",
                          message: `Are you sure you would like to dispatch Round 2 peer review invitations to ${selectedRound2Reviewers.join(" and ")}?`,
                          confirmButtonLabel: "Yes, Dispatch Review",
                          confirmColorClass: "bg-purple-600 hover:bg-purple-700",
                          onConfirm: () => {
                            if (selectedRevisionManuscript && onUpdateManuscriptStatus) {
                              onUpdateManuscriptStatus(selectedRevisionManuscript.id, "Under Review")
                              setRevisionActionSuccess(`✓ Round 2 re-review invitations dispatched to ${selectedRound2Reviewers.join(", ")}.`)
                            }
                          }
                        })
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold h-8 px-3.5 rounded-lg cursor-pointer shrink-0"
                    >
                      <RotateCcw className="h-3.5 w-3.5 mr-1" />
                      Dispatch Review
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                    {["Prof. Aris Thorne", "Dr. Evelyn Vane"].map(rev => (
                      <label key={rev} className="inline-flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedRound2Reviewers.includes(rev)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedRound2Reviewers(prev => [...prev, rev])
                            else setSelectedRound2Reviewers(prev => prev.filter(r => r !== rev))
                          }}
                          className="rounded text-purple-600"
                        />
                        <span>{rev} (Willing)</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Action 3: Direct Accept */}
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl gap-3">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-xs">
                      Final Accept & Advance to Production
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Approve all revisions and move to galley proof typesetting.
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      triggerConfirm({
                        title: "Accept Manuscript?",
                        message: `Are you sure you would like to accept manuscript ${selectedRevisionManuscript?.id} for publication and schedule typeset galley proofing?`,
                        confirmButtonLabel: "Yes, Accept Paper",
                        confirmColorClass: "bg-emerald-600 hover:bg-emerald-700",
                        onConfirm: () => {
                          if (selectedRevisionManuscript && onUpdateManuscriptStatus) {
                            onUpdateManuscriptStatus(selectedRevisionManuscript.id, "Accepted")
                            setRevisionActionSuccess(`✓ Manuscript ${selectedRevisionManuscript.id} has been Accepted for publication.`)
                          }
                        }
                      })
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-8 px-3.5 rounded-lg cursor-pointer shrink-0"
                  >
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Accept Manuscript
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-row items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                triggerConfirm({
                  title: "Request Author Corrections?",
                  message: `Are you sure you want to return manuscript ${selectedRevisionManuscript?.id} to the author for further corrections or missing files?`,
                  confirmButtonLabel: "Yes, Request Corrections",
                  confirmColorClass: "bg-amber-600 hover:bg-amber-700",
                  onConfirm: () => {
                    setIsRevisionModalOpen(false)
                    setIsQueryAuthorOpen(true)
                  }
                })
              }}
              className="text-xs font-semibold text-amber-600 border-amber-300 hover:bg-amber-50 dark:border-amber-900/40 h-8 px-3 rounded-lg"
            >
              <AlertCircle className="h-3.5 w-3.5 mr-1" />
              Request Corrections
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRevisionModalOpen(false)}
              className="text-xs font-semibold border-slate-200 dark:border-slate-800 h-8 px-3 rounded-lg"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 8: ARE-YOU-SURE CONFIRMATION POPUP DIALOG                            */}
      {/* ========================================================================= */}
      <Dialog open={confirmDialogState.isOpen} onOpenChange={(open) => setConfirmDialogState(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent className="max-w-md bg-white dark:bg-[#18191e] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-sans shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-[#0b99ff]" />
              {confirmDialogState.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600 dark:text-slate-400 pt-2 leading-relaxed">
              {confirmDialogState.message}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-row items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmDialogState(prev => ({ ...prev, isOpen: false }))}
              className="text-xs font-semibold border-slate-200 dark:border-slate-800 h-8 px-3.5 rounded-lg cursor-pointer"
            >
              No, Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                const action = confirmDialogState.onConfirm
                setConfirmDialogState(prev => ({ ...prev, isOpen: false }))
                if (action) action()
              }}
              className={`text-white text-xs font-bold h-8 px-4 rounded-lg cursor-pointer ${confirmDialogState.confirmColorClass}`}
            >
              {confirmDialogState.confirmButtonLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* REVIEWER PROFILE INSPECTOR DIALOG                                         */}
      {/* ========================================================================= */}
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#18191e] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-sans rounded-2xl p-6 shadow-2xl">
          <DialogHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between gap-3">
              <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[#0b99ff]" />
                Reviewer Profile
              </DialogTitle>
              {selectedReviewerData?.profile?.credentialId && (
                <span className="font-mono text-[11px] font-semibold text-[#0b99ff] bg-[#0b99ff]/10 px-2.5 py-0.5 rounded-full border border-[#0b99ff]/25 shrink-0">
                  {selectedReviewerData.profile.credentialId}
                </span>
              )}
            </div>
            <DialogDescription className="text-xs text-slate-500">
              Verified referee records, research keywords, and profile completeness.
            </DialogDescription>
          </DialogHeader>

          {isLoadingProfile ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-500 gap-2">
              <RotateCcw className="w-5 h-5 animate-spin text-[#0b99ff]" />
              <span className="text-xs">Loading referee profile...</span>
            </div>
          ) : selectedReviewerData ? (
            <div className="space-y-5 pt-3 text-xs">
              {/* Scholar Header Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#0b99ff]/10 text-[#0b99ff] border border-[#0b99ff]/20 font-bold flex items-center justify-center text-sm uppercase shrink-0">
                    {selectedReviewerData.profile.name
                      ? selectedReviewerData.profile.name.replace(/^(Dr\.|Prof\.)\s+/i, "").slice(0, 2)
                      : "RV"}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{selectedReviewerData.profile.name}</span>
                      {selectedReviewerData.profile.gatewayScore && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {selectedReviewerData.profile.gatewayScore}% Score
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      {selectedReviewerData.profile.email}
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
                      {selectedReviewerData.profile.institution}
                      {selectedReviewerData.profile.department ? ` · ${selectedReviewerData.profile.department}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-1.5 shrink-0">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0b99ff]/10 text-[#0b99ff] border border-[#0b99ff]/30">
                    <CheckCircle2 className="w-3 h-3 text-[#0b99ff]" />
                    {selectedReviewerData.profile.accountStatus || "Active Referee"}
                  </span>
                  {selectedReviewerData.profile.country && (
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {selectedReviewerData.profile.country}
                    </span>
                  )}
                </div>
              </div>

              {/* Research Keywords */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#0b99ff]" />
                    Research Keywords
                  </h4>
                  <span className="text-[10px] text-slate-500">
                    {selectedReviewerData.profile.keywords?.length || 0} registered keywords
                  </span>
                </div>
                {selectedReviewerData.profile.keywords && selectedReviewerData.profile.keywords.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800">
                    {selectedReviewerData.profile.keywords.map((kw: string, i: number) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0b99ff]" />
                        {kw}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-lg border border-dashed border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-xs">
                    No research keywords added yet.
                  </div>
                )}
              </div>

              {/* Profile Completeness */}
              <div className="space-y-1.5 p-3.5 rounded-xl bg-[#0b99ff]/5 border border-[#0b99ff]/20">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    Profile Completeness
                  </span>
                  <span className="font-bold text-[#0b99ff] text-xs">
                    {selectedReviewerData.audit?.completionPercentage || 80}% Complete
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#0b99ff] transition-all duration-500"
                    style={{ width: `${selectedReviewerData.audit?.completionPercentage || 80}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                  <span>{selectedReviewerData.audit?.filledFields?.length || 0} fields completed</span>
                  <span>{selectedReviewerData.audit?.missingFields?.length || 0} fields missing</span>
                </div>
              </div>

              {/* Two Column Grid: Filled Details vs Missing Fields */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Completed Details */}
                <div className="space-y-2 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 bg-white dark:bg-slate-900/40">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Completed Information
                  </h4>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">Discipline</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">
                        {selectedReviewerData.profile.primaryDiscipline?.replace("-", " ")}
                      </span>
                    </div>
                    {selectedReviewerData.profile.subDisciplines?.length > 0 && (
                      <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500">Sub-Fields</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200 text-right">
                          {selectedReviewerData.profile.subDisciplines.join(", ")}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">ORCID</span>
                      <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                        {selectedReviewerData.profile.orcid || "Not connected"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">Monthly Capacity</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {selectedReviewerData.profile.maxReviewsPerMonth || 2} papers / mo
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">Turnaround Window</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {selectedReviewerData.profile.preferredTurnaround || 14} days
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">Availability</span>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">
                        {selectedReviewerData.profile.availabilityStatus || "Available"}
                      </span>
                    </div>
                    {selectedReviewerData.profile.paymentMethod && (
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Honoraria Payout</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {selectedReviewerData.profile.paymentMethod}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Missing / Unfilled Fields */}
                <div className="space-y-2 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 bg-white dark:bg-slate-900/40">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                    Pending Fields
                  </h4>
                  {selectedReviewerData.audit?.missingFields?.length > 0 ? (
                    <div className="space-y-2 text-[11px]">
                      {selectedReviewerData.audit.missingFields.map((f: any, i: number) => (
                        <div key={i} className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/20">
                          <div className="font-semibold text-amber-800 dark:text-amber-300">{f.label}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">{f.tip}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-slate-500 text-xs">
                      All required profile fields have been completed!
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500 text-xs">No profile data available.</div>
          )}

          <DialogFooter className="flex flex-row items-center justify-between gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (selectedReviewerData?.profile?.email) {
                  navigator.clipboard.writeText(selectedReviewerData.profile.email)
                }
              }}
              className="text-xs font-semibold border-slate-200 dark:border-slate-800 h-8 px-3 rounded-lg gap-1.5 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              Copy Email
            </Button>
            <Button
              size="sm"
              onClick={() => setIsProfileModalOpen(false)}
              className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-bold h-8 px-4 rounded-lg cursor-pointer"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 9: DEDICATED INTEGRITY FORENSICS INVESTIGATION SUITE                 */}
      {/* ========================================================================= */}
      <Dialog open={isForensicsModalOpen} onOpenChange={setIsForensicsModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] bg-white dark:bg-[#18191e] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-sans rounded-2xl p-6 flex flex-col shadow-2xl overflow-hidden">
          <DialogHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between gap-3 pr-6">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    Forensic Dossier
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500 mt-0.5">
                    Similarity scans, synthetic text detection & figure forensics
                  </DialogDescription>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                {forensicsManuscript?.id || "SOSSH-26-SRW107"}
              </span>
            </div>
          </DialogHeader>

          {forensicsManuscript && (() => {
            const plag = forensicsManuscript.plagiarismScore || 34
            const ai = forensicsManuscript.aiScore || 15
            const isCriticalPlag = plag > 25
            const isHighAi = ai > 50

            return (
              <div className="space-y-4 py-3 text-xs overflow-y-auto pr-1">
                {/* Paper Summary Box */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/90 dark:border-slate-800 space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {forensicsManuscript.journal} • Submitted {forensicsManuscript.date}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {forensicsManuscript.title}
                  </h4>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap pt-0.5">
                    <span>Corresponding Author: <strong className="text-slate-700 dark:text-slate-300">{forensicsManuscript.authorName || "Dr. Helen Vance"}</strong></span>
                    <span>•</span>
                    <span>Assigned Editor: <strong className="text-slate-700 dark:text-slate-300">{forensicsManuscript.assignedEditorName || "Prof. Aris Thorne"}</strong></span>
                  </div>
                </div>

                {/* Status / Action Notification Banner */}
                {forensicActionStatus && (
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 flex items-center gap-2 font-medium">
                    <CheckCheck className="h-4 w-4 shrink-0 text-slate-600 dark:text-slate-400" />
                    <span>{forensicActionStatus}</span>
                  </div>
                )}

                {/* Primary Violation Alert Card (Subtle & Clean) */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      <span>
                        {isCriticalPlag 
                          ? `Flag: ${plag}% Text Overlap Detected`
                          : isHighAi 
                          ? `Flag: ${ai}% Synthetic Text Probability`
                          : `Integrity Anomaly Flag`}
                      </span>
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                      Review Needed
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {isCriticalPlag
                      ? `Algorithmic cross-reference against Crossref, arXiv, and SSRN indicates verbatim phrasing in Literature Review & Empirical Estimation (Sections 2.1–3.4) matching a 2024 repository deposit without formal quotation marks.`
                      : isHighAi
                      ? `Stylometric entropy scan detected structural repetitive patterns in Methodology (Paragraphs 3-6) exceeding standard baseline threshold.`
                      : `Automated scan identified potential figure contrast alterations and unverified preprint citations.`}
                  </p>
                </div>

                {/* 3 Metric Breakdown Grid (Restrained Neutral Styling) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Similarity */}
                  <div className="p-3 rounded-xl bg-white dark:bg-[#15161b] border border-slate-200/90 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">iThenticate Scan</span>
                      <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-700">
                        {plag > 15 ? "Over Limit" : "Passed"}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {plag}%
                    </div>
                    <div className="text-[11px] text-slate-500 leading-tight">
                      Matched: SSRN-2024-8120 & arXiv
                    </div>
                  </div>

                  {/* AI Content */}
                  <div className="p-3 rounded-xl bg-white dark:bg-[#15161b] border border-slate-200/90 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">AI Probability</span>
                      <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-700">
                        {ai > 30 ? "Elevated" : "Low Risk"}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {ai}%
                    </div>
                    <div className="text-[11px] text-slate-500 leading-tight">
                      Stylometric syntax variance
                    </div>
                  </div>

                  {/* Figure & Image Forensics */}
                  <div className="p-3 rounded-xl bg-white dark:bg-[#15161b] border border-slate-200/90 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Figure Forensics</span>
                      <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-700">
                        Inspected
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      4 Panels
                    </div>
                    <div className="text-[11px] text-slate-500 leading-tight">
                      No clone stamp / tampering
                    </div>
                  </div>
                </div>

                {/* Author Notes & Preprint Attribution */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/90 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">Author Declaration & Preprint Note</span>
                    <span className="text-[10px] text-slate-400 font-medium">Provided at Submission</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed italic bg-white dark:bg-[#18191e] p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    "A preliminary working draft was shared on SSRN in late 2024. The empirical dataset, regressions, and conclusions submitted here have been substantially expanded and are proprietary to this author team."
                  </p>
                </div>

                {/* Operational Quick Actions (Restrained, Professional) */}
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Editorial & Forensic Next Steps
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        if (onAddNotification) {
                          onAddNotification({
                            paperId: forensicsManuscript.id,
                            paperTitle: forensicsManuscript.title,
                            journal: forensicsManuscript.journal,
                            type: "im_escalation",
                            severity: "urgent",
                            actorName: user?.name || "Noor F.",
                            actorRole: "Journal Manager Desk",
                            headline: "Forensic Escalation Submitted",
                            summary: `Escalated ${forensicsManuscript.id} (${plag}% similarity) to Research Integrity Office for formal review.`,
                            recipient: "Research Integrity Advisor"
                          })
                        }
                        setForensicActionStatus(`✓ Case ${forensicsManuscript.id} officially escalated to Research Integrity Advisor (RIA).`)
                      }}
                      className="h-8 text-xs font-bold bg-[#0b99ff] hover:bg-[#0088e0] text-white rounded-xl px-3.5 cursor-pointer shadow-xs"
                    >
                      <ShieldAlert className="h-3.5 w-3.5 mr-1" />
                      Escalate to RIA
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (onAddNotification) {
                          onAddNotification({
                            paperId: forensicsManuscript.id,
                            paperTitle: forensicsManuscript.title,
                            journal: forensicsManuscript.journal,
                            type: "eic_inquiry",
                            severity: "high",
                            actorName: user?.name || "Noor F.",
                            actorRole: "Journal Manager Desk",
                            headline: "Author Clarification Dispatched",
                            summary: `Requested formal citation clarification and uncropped raw files for ${forensicsManuscript.id}.`,
                            dispatchedLetter: `Dear ${forensicsManuscript.authorName || "Author"},\n\nPlease provide formal clarification regarding the ${plag}% text overlap identified by our automated forensic scans.\n\nSincerely,\nEditorial Office`,
                            recipient: forensicsManuscript.authorName || "Corresponding Author"
                          })
                        }
                        setForensicActionStatus(`✓ Formal inquiry dispatched to ${forensicsManuscript.authorName || "Author"}.`)
                      }}
                      className="h-8 text-xs font-semibold bg-white dark:bg-[#18191e] border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 cursor-pointer text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-2xs"
                    >
                      <Mail className="h-3.5 w-3.5 mr-1 text-[#0b99ff]" />
                      Query Author
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setForensicActionStatus(`✓ Flag cleared for ${forensicsManuscript.id}. Preprint attribution verified authentic.`)
                      }}
                      className="h-8 text-xs font-semibold bg-white dark:bg-[#18191e] border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 cursor-pointer text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-2xs"
                    >
                      <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                      Clear Flag (Verified)
                    </Button>
                  </div>
                </div>
              </div>
            )
          })()}

          <DialogFooter className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between sm:justify-between">
            <a
              href="/downloads/Rights_Retention_Cover_Letter_Template.txt"
              download={`${forensicsManuscript?.id || "Manuscript"}_Forensics_Audit_Report.pdf`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Full Forensic Audit (.pdf)</span>
            </a>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsForensicsModalOpen(false)}
              className="text-xs font-semibold h-8 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18191e] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer shadow-2xs"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 10: FORMAL EDITORIAL DECISION LETTER VIEWER                         */}
      {/* ========================================================================= */}
      <Dialog open={isDecisionLetterModalOpen} onOpenChange={setIsDecisionLetterModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] bg-white dark:bg-[#18191e] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-sans rounded-2xl p-6 flex flex-col shadow-2xl overflow-hidden">
          <DialogHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between gap-3 pr-6">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#0b99ff]/10 text-[#0b99ff] border border-[#0b99ff]/20">
                  <FileCheck2 className="h-4 w-4" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    Decision Record
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500 mt-0.5">
                    Official correspondence, reviewer recommendations & editorial verdict
                  </DialogDescription>
                </div>
              </div>
              <span className="text-xs font-bold text-[#0b99ff] bg-[#0b99ff]/10 px-2.5 py-1 rounded-md border border-[#0b99ff]/20 whitespace-nowrap">
                {viewingDecisionManuscript?.id || "MS-DECISION"}
              </span>
            </div>
          </DialogHeader>

          {viewingDecisionManuscript && (() => {
            const isAccepted = viewingDecisionManuscript.status === "Accepted"
            const isDeclined = viewingDecisionManuscript.status === "Rejected" || (viewingDecisionManuscript.status as string) === "Declined"

            const defaultAcceptLetter = `Dear ${viewingDecisionManuscript.authorName || "Author"},\n\nWe are pleased to inform you that following comprehensive peer evaluation, your manuscript titled "${viewingDecisionManuscript.title}" has been formally ACCEPTED for publication in ${viewingDecisionManuscript.journal}.\n\nNext Steps:\n1. Our production office will prepare the galley proofs and JATS XML.\n2. A formal Crossref DOI (10.59236/${viewingDecisionManuscript.journal.toLowerCase().includes("medicine") ? "somed" : "soeas"}.2026.${viewingDecisionManuscript.id.slice(-3)}) has been reserved.\n\nCongratulations on the publication of your valuable scholarly work.\n\nSincerely,\n${viewingDecisionManuscript.assignedEditorName || "Prof. Clara Zhang"}\nEditor-in-Chief, ${viewingDecisionManuscript.journal}`

            const defaultDeclineLetter = `Dear ${viewingDecisionManuscript.authorName || "Author"},\n\nThank you for giving us the opportunity to consider your manuscript titled "${viewingDecisionManuscript.title}" for publication in ${viewingDecisionManuscript.journal}.\n\nFollowing detailed editorial assessment and peer evaluation, the editorial board has determined that the submission falls outside our current thematic scope and methodological prioritization requirements. We are therefore unable to accept the paper for publication in this journal.\n\nWe thank you for considering ${viewingDecisionManuscript.journal} and wish you every success in placing this work with a more specialized venue.\n\nSincerely,\n${viewingDecisionManuscript.assignedEditorName || "Prof. Clara Zhang"}\nHandling Editor, ${viewingDecisionManuscript.journal}`

            return (
              <div className="space-y-4 py-3 text-xs overflow-y-auto pr-1">
                {/* Manuscript Meta Box */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/90 dark:border-slate-800 space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {viewingDecisionManuscript.journal} • Final Decision Archive
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {viewingDecisionManuscript.title}
                  </h4>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap pt-0.5">
                    <span>Author: <strong className="text-slate-700 dark:text-slate-300">{viewingDecisionManuscript.authorName || "Principal Author"}</strong></span>
                    <span>•</span>
                    <span>Deciding Editor: <strong className="text-slate-700 dark:text-slate-300">{viewingDecisionManuscript.assignedEditorName || "Prof. Clara Zhang"}</strong></span>
                  </div>
                </div>

                {/* Verdict Banner */}
                <div className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
                  isAccepted
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
                    : "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-200"
                }`}>
                  <div className="flex items-center gap-2">
                    {isAccepted ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    )}
                    <span className="font-bold text-xs">
                      {isAccepted
                        ? "Editorial Verdict: ACCEPTED FOR PUBLICATION (Galley Proofs & DOI Assigned)"
                        : "Editorial Verdict: DECLINED / OUT OF SCOPE (Rejection Notice Dispatched)"}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-current">
                    {isAccepted ? "Published" : "Archived"}
                  </span>
                </div>

                {/* Dispatched Correspondence Letter */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                      Official Dispatched Decision Letter
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Signed by {viewingDecisionManuscript.assignedEditorName || "Editor"}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 font-mono text-[11px] leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap select-all">
                    {isAccepted ? defaultAcceptLetter : defaultDeclineLetter}
                  </div>
                </div>

                {/* Reviewer Evaluation Summary */}
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                    Peer Review Panel Consensus
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#15161b] border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Reviewer 1</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          isAccepted ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                        }`}>
                          {isAccepted ? "Accept" : "Decline"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 italic">
                        {isAccepted ? "\"Methodological rigor verified. Clear contribution to literature.\"" : "\"Insufficient empirical validation against out-of-sample data.\""}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#15161b] border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Reviewer 2</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          isAccepted ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                        }`}>
                          {isAccepted ? "Accept" : "Major Issues"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 italic">
                        {isAccepted ? "\"Well written with sound technical analysis.\"" : "\"The core premise has limited novelty in present formulation.\""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}

          <DialogFooter className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between sm:justify-between">
            <a
              href="/downloads/Rights_Retention_Cover_Letter_Template.txt"
              download={`${viewingDecisionManuscript?.id || "Manuscript"}_Official_Decision_Letter.txt`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0b99ff] hover:underline"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Decision Letter (.txt)</span>
            </a>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDecisionLetterModalOpen(false)}
              className="text-xs font-semibold h-8 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18191e] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer shadow-2xs"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review & Edit Email Dispatch Dialog */}
      <EmailDispatchDialog language={language} config={dispatchDialogConfig} />

      {/* Sent Email History Record Viewer Modal */}
      <Dialog open={!!viewingHistoryEmail} onOpenChange={(open) => !open && setViewingHistoryEmail(null)}>
        <DialogContent className="max-w-2xl bg-white dark:bg-[#18191e] border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
          {viewingHistoryEmail && (
            <div className="space-y-4">
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-50 text-[#0b99ff] dark:bg-sky-950/50 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                    {viewingHistoryEmail.campaignType.replace(/_/g, " ")}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {viewingHistoryEmail.id}
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <Check className="h-2.5 w-2.5" />
                    {viewingHistoryEmail.status}
                  </span>
                </div>
                <DialogTitle className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {viewingHistoryEmail.subject}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                  Dispatched to {viewingHistoryEmail.recipientName} ({viewingHistoryEmail.recipientEmail}) on{" "}
                  {new Date(viewingHistoryEmail.timestamp).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                </DialogDescription>
              </DialogHeader>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Target Journal:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{viewingHistoryEmail.journal}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Recipient Email:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{viewingHistoryEmail.recipientEmail}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 max-h-[350px] overflow-y-auto space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Dispatched Email Content:
                </span>
                <div className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                  {viewingHistoryEmail.body}
                </div>
              </div>

              <DialogFooter className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewingHistoryEmail(null)}
                  className="text-xs font-semibold h-8 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18191e] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Scholar to Do-Not-Contact / Unsubscribed List Modal */}
      <Dialog open={isAddUnsubModalOpen} onOpenChange={setIsAddUnsubModalOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-[#18191e] border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserX className="h-5 w-5 text-rose-500" />
              <span>Add to Do-Not-Contact Registry</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Register a scholar's email address to suppress all future automated and manual invitations across editorial desks.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Scholar Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                placeholder="colleague@university.edu"
                value={newUnsubEmail}
                onChange={(e) => setNewUnsubEmail(e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Reason / Source
              </label>
              <input
                type="text"
                placeholder="e.g. Replied asking to be removed from mailing list"
                value={newUnsubReason}
                onChange={(e) => setNewUnsubReason(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          <DialogFooter className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddUnsubModalOpen(false)
                setNewUnsubEmail("")
                setNewUnsubReason("")
              }}
              className="text-xs font-semibold h-8 px-3 rounded-lg border-slate-200 dark:border-slate-800"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!newUnsubEmail.trim() || !newUnsubEmail.includes("@")}
              onClick={() => handleAddUnsubscribe(newUnsubEmail, newUnsubReason || "Manual entry by Journal Manager")}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold h-8 px-4 rounded-lg cursor-pointer disabled:opacity-40"
            >
              Save to Blocklist
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
