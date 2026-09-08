"use client"

import { useState, useMemo } from "react"
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
  BookOpen, 
  Upload,
  FileDown,
  AlertCircle,
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
  Sparkles,
  Calendar,
  Filter,
  Activity,
  Award,
  FileSpreadsheet,
  PieChart,
  Zap,
  Building2,
  Edit3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CrossDeskActivityFeed, CrossDeskNotification } from "./cross-desk-activity-feed"
import { generateBrandedEmailHtml } from "@/lib/email-templates"

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
  const [jmOpenAlexResults, setJmOpenAlexResults] = useState<any[] | null>(null)
  const [isJmSearchingOpenAlex, setIsJmSearchingOpenAlex] = useState(false)
  const [jmOpenAlexQuery, setJmOpenAlexQuery] = useState("")

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
      onCancel: () => setDispatchDialogConfig(prev => ({ ...prev, isOpen: false }))
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
        return matchesSearch && matchesJournal && (m.integrityStatus === "Flagged" || (m.plagiarismScore && m.plagiarismScore > 15) || (m.aiScore && m.aiScore > 30))
      }

      return matchesSearch && matchesJournal
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
  const integrityCasesList = initialManuscripts.filter(m => m.integrityStatus === "Flagged" || (m.plagiarismScore && m.plagiarismScore > 15) || (m.aiScore && m.aiScore > 30))

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
      const revObj = reviewersList.find(x => x.name === revName)
      const targetEmail = revObj ? revObj.email : "reviewer@scholarlyopen.org"
      const personalizedBody = assignEmailBody.replace(/\{\{recipientName\}\}/g, revName)

      const renderedHtml = generateBrandedEmailHtml({
        subject: assignEmailSubject,
        bodyText: personalizedBody,
        actionLabel: "Accept Review Invitation",
        actionUrl: "https://www.scholarlyopen.org/editorial360",
        secondaryActionLabel: "Decline Invitation",
        secondaryActionUrl: "https://www.scholarlyopen.org/editorial360?action=decline",
        journal: msJournal,
        paperId: msId,
        paperTitle: msTitle,
        recipientName: revName
      })

      return fetch("/api/editorial360/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: targetEmail,
          recipientName: revName,
          customSubject: assignEmailSubject,
          customHtml: renderedHtml,
          paperId: msId,
          paperTitle: msTitle,
          journal: msJournal
        })
      }).catch(e => console.error("Invitation email dispatch error:", e))
    }))

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

  // Handle instant Confirm Moderation Release
  const handleConfirmModerationRelease = () => {
    if (!moderatingReview) return
    const revId = moderatingReview.id
    const paperId = moderatingReview.paperId
    const editedText = modEditedComments

    setIsModModalOpen(false)

    triggerConfirm({
      title: "Save & Approve Sanitized Remarks?",
      message: `Are you sure you want to approve and save these sanitized peer review remarks for manuscript ${paperId}? These remarks will be saved to the manuscript file and bundled into the official Decision Letter sent to the author.`,
      confirmButtonLabel: "Yes, Save & Approve",
      confirmColorClass: "bg-[#0b99ff] hover:bg-[#0088e0]",
      onConfirm: () => {
        if (onReleaseComments) {
          onReleaseComments(revId, editedText)
        }
        setApprovedReviewRemarks(prev => ({
          ...prev,
          [moderatingReview.reviewerName]: true,
          [revId]: true
        }))
        setEditorPromptSuccess(`✓ Remarks for ${moderatingReview.reviewerName} vetted, approved & saved to manuscript dossier.`)
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
      defaultBody: `Dear ${authorName},\n\nThank you for submitting manuscript ${msId} (${msTitle}) to ${selectedManuscript.journal}.\n\nDuring the initial technical pre-check by our editorial office, the following item(s) require your attention before the paper can proceed to editorial triage:\n\n${message}\n\nPlease log into the Editorial360 portal to upload the corrected files.`,
      onConfirmSend: async (data) => {
        setIsQueryAuthorOpen(false)
        setIsPreQualityModalOpen(false)
        setQueryAuthorMessage("")

        if (onUpdateManuscriptStatus) {
          onUpdateManuscriptStatus(msId, "Revision Required")
        }

        await fetch("/api/editorial360/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: data.recipientEmail,
            customSubject: data.subject,
            customHtml: data.renderedHtml,
            journal: selectedManuscript.journal,
            paperId: msId,
            paperTitle: msTitle,
            recipientName: authorName
          })
        }).catch(e => console.error(e))

        setDispatchDialogConfig(prev => ({ ...prev, isOpen: false }))
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
      onConfirmSend: async (data) => {
        setNudgedReviewers(prev => ({ ...prev, [revName]: true }))
        await fetch("/api/editorial360/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: data.recipientEmail,
            customSubject: data.subject,
            customHtml: data.renderedHtml,
            journal: trackingManuscript.journal,
            paperId: trackingManuscript.id,
            paperTitle: trackingManuscript.title,
            recipientName: revName
          })
        }).catch(e => console.error(e))
        setDispatchDialogConfig(prev => ({ ...prev, isOpen: false }))
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
      onConfirmSend: async (data) => {
        setAuthorNudged(prev => ({ ...prev, [ms.id]: true }))
        await fetch("/api/editorial360/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: data.recipientEmail,
            customSubject: data.subject,
            customHtml: data.renderedHtml,
            journal: ms.journal,
            paperId: ms.id,
            paperTitle: ms.title,
            recipientName: authorName
          })
        }).catch(e => console.error(e))

        setEditorPromptSuccess(`✓ Revision reminder email dispatched to ${authorName}.`)
        setTimeout(() => setEditorPromptSuccess(null), 6000)
        setDispatchDialogConfig(prev => ({ ...prev, isOpen: false }))
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
    if (selectedStageFilter === "integrity" || ms.integrityStatus === "Flagged" || (ms.plagiarismScore && ms.plagiarismScore > 15) || (ms.aiScore && ms.aiScore > 30)) {
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

  return (
    <div className="space-y-6 font-sans">
      
      {/* 0. Dynamic In-House Journal Manager Desk Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="relative h-11 w-11 rounded-full overflow-hidden bg-gradient-to-tr from-[#0b99ff] to-[#0077cc] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm ring-2 ring-slate-200 dark:ring-[#272832]">
            <span>{user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : "SJ"}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                {user?.name || "Sarah Jenkins"}
              </h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#0b99ff]/10 text-[#0b99ff] border border-[#0b99ff]/20">
                {user?.role || "Editorial Manager"}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {user?.office || "Scholarly Open Headquarters (Basel / London)"} • {user?.country || "Germany"} • <span className="text-[#0b99ff] font-medium">{user?.email || "scholarlyopen@gmail.com"}</span>
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

                              {(selectedStageFilter === "integrity" || ms.integrityStatus === "Flagged" || (ms.plagiarismScore && ms.plagiarismScore > 15) || (ms.aiScore && ms.aiScore > 30)) && (
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
      {/* 4. REVIEWER REGISTRY                                                      */}
      {/* ========================================================================= */}
      {activeTab === "users" && (
        <Card className="bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Reviewer Registry</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Directory listing of vetted peer reviewers and availability status.</p>
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
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="font-bold text-slate-900 dark:text-white block text-xs">
                    Invite External Expert by Email:
                  </span>
                  
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={customRevName}
                      onChange={(e) => setCustomRevName(e.target.value)}
                      placeholder="Full Name (e.g. Prof. David Miller)"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#18191e] text-xs focus:ring-2 focus:ring-[#0b99ff] focus:outline-none"
                    />
                    <input
                      type="email"
                      value={customRevEmail}
                      onChange={(e) => setCustomRevEmail(e.target.value)}
                      placeholder="Institutional Email (e.g. d.miller@ox.ac.uk)"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#18191e] text-xs focus:ring-2 focus:ring-[#0b99ff] focus:outline-none"
                    />
                    <input
                      type="text"
                      value={customRevAffiliation}
                      onChange={(e) => setCustomRevAffiliation(e.target.value)}
                      placeholder="Institution / Specialty (e.g. University of Oxford)"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#18191e] text-xs focus:ring-2 focus:ring-[#0b99ff] focus:outline-none"
                    />

                    <Button
                      type="button"
                      onClick={() => {
                        if (!customRevName || !customRevEmail) {
                          alert("Please enter both Name and Email.")
                          return
                        }
                        setSelectedReviewers(prev => [...prev, customRevName])
                        setCustomRevName("")
                        setCustomRevEmail("")
                        setCustomRevAffiliation("")
                      }}
                      className="w-full bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-semibold h-8 rounded-xl cursor-pointer"
                    >
                      Add to Selection List
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Review Invitation Email Template & Customization */}
            <div className="space-y-3 pt-3 border-t border-slate-200/80 dark:border-[#272832]">
              {/* Template Header with Edit / Live Preview Tabs */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-[#0b99ff]/10 text-[#0b99ff] flex items-center justify-center font-bold">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <label className="font-bold text-xs text-slate-900 dark:text-white block leading-tight">
                      {isDe ? "Gutachter-Einladungs-E-Mail-Vorlage" : "Review Invitation Email Template (Dispatched to Reviewers)"}
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {isDe ? "Direkt im Popup editierbar vor dem Zuweisen" : "Directly editable within popup prior to dispatch"}
                    </span>
                  </div>
                </div>

                {/* Sub-Tabs: Edit Template / Live Preview */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#131418] p-1 rounded-xl border border-slate-200/80 dark:border-[#272832]">
                  <button
                    type="button"
                    onClick={() => setAssignEmailTab("edit")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      assignEmailTab === "edit"
                        ? "bg-white dark:bg-[#1f2027] text-[#0b99ff] shadow-xs"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    <Edit3 className="h-3 w-3" />
                    {isDe ? "Text anpassen" : "Edit Letter"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssignEmailTab("preview")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      assignEmailTab === "preview"
                        ? "bg-white dark:bg-[#1f2027] text-[#0b99ff] shadow-xs"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    <Eye className="h-3 w-3" />
                    {isDe ? "E-Mail Vorschau" : "Live Email Preview"}
                  </button>
                </div>
              </div>

              {/* Subject Line & Target Recipients Info */}
              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      {isDe ? "Einladungs-Betreffzeile:" : "Invitation Subject Line:"}
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">CC: scholarlyopen@gmail.com</span>
                  </div>
                  <input
                    type="text"
                    value={assignEmailSubject}
                    onChange={(e) => setAssignEmailSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#18191e] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#0b99ff] focus:outline-none"
                  />
                </div>

                <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900 text-[11px] text-sky-800 dark:text-sky-300 flex items-center justify-between">
                  <span>
                    <strong>{selectedReviewers.length} Reviewer(s) targeted:</strong> {selectedReviewers.join(", ") || "None selected yet"}
                  </span>
                  <span className="text-[10px] text-sky-600 dark:text-sky-400">
                    Auto-personalized with &#123;&#123;recipientName&#125;&#125;
                  </span>
                </div>
              </div>

              {/* Body Edit or Preview */}
              {assignEmailTab === "edit" ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      {isDe ? "Einladungs-Text (frei anpassbar):" : "Invitation Letter Body (Fully Customizable):"}
                    </label>
                    <span className="text-[10px] text-slate-400">
                      Supports markdown &amp; paragraphs
                    </span>
                  </div>
                  <textarea
                    rows={9}
                    value={assignEmailBody}
                    onChange={(e) => setAssignEmailBody(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#18191e] text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-[#0b99ff] focus:outline-none leading-relaxed"
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-[#0b99ff]" />
                      {isDe ? "Formatierte Vorschau (wie vom Gutachter empfangen):" : "Rendered HTML Preview (Reviewer's Inbox View):"}
                    </label>
                    <span className="text-[10px] font-semibold text-[#0b99ff] bg-[#0b99ff]/10 px-2 py-0.5 rounded border border-[#0b99ff]/20">
                      Scholarly Open Template
                    </span>
                  </div>
                  <div className="rounded-xl border border-slate-200 dark:border-[#272832] overflow-hidden bg-slate-100 dark:bg-slate-950 p-2 shadow-inner">
                    <iframe
                      title="Review Invitation Email Preview"
                      srcDoc={generateBrandedEmailHtml({
                        subject: assignEmailSubject,
                        bodyText: assignEmailBody.replace(/\{\{recipientName\}\}/g, selectedReviewers[0] || "Dr. Reviewer"),
                        actionLabel: "Accept Review Invitation",
                        actionUrl: "https://www.scholarlyopen.org/editorial360",
                        secondaryActionLabel: "Decline Invitation",
                        secondaryActionUrl: "https://www.scholarlyopen.org/editorial360?action=decline",
                        journal: selectedManuscript?.journal || "Scholarly Open",
                        paperId: selectedManuscript?.id,
                        paperTitle: selectedManuscript?.title,
                        recipientName: selectedReviewers[0] || "Dr. Reviewer"
                      })}
                      className="w-full h-[320px] bg-white rounded-lg border border-slate-200 dark:border-slate-800"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 font-medium">
              Selected: <strong className="text-[#0b99ff]">{selectedReviewers.length} Reviewers</strong>
            </span>
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
              const isFlagged = selectedManuscript?.integrityStatus === "Flagged" || (selectedManuscript?.plagiarismScore && selectedManuscript.plagiarismScore > 15) || (selectedManuscript?.aiScore && selectedManuscript.aiScore > 30)
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
                  href="/downloads/Scholarly_Open_Manuscript_Template.txt"
                  download={`${selectedManuscript?.id || "Manuscript"}_Main_Document.pdf`}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-[#0b99ff] transition-all text-slate-700 dark:text-slate-300 font-medium"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="h-3.5 w-3.5 text-[#0b99ff] shrink-0" />
                    <span className="truncate">Main Manuscript (PDF)</span>
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
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
              Moderate Comments
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Manuscript ID: {moderatingReview?.paperId} • Reviewer: {moderatingReview?.reviewerName} • Approved remarks will be bundled into the Handling Editor&apos;s official decision letter.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Author-Facing Review Comments (Editable / Sanitizable by JM)
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
              className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-bold h-8 px-4 rounded-lg cursor-pointer"
            >
              Save & Approve Remarks
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

            {/* Reviewers Progress List */}
            <div className="space-y-3">
              <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
                Assigned Reviewer Milestones & Reports:
              </span>

              {(trackingManuscript?.reviewers || ["Dr. Evelyn Vane", "Dr. Marcus Vance"]).map((revName) => {
                const isSubmitted = revName === "Dr. Evelyn Vane" || (trackingManuscript?.id === "SOEAS-26-RS102" && (revName === "Dr. Marcus Vance" || revName === "Dr. Evelyn Vane"))
                const isOverdue = trackingManuscript?.id === "SOSSH-26-SRW107" || revName === "Prof. Hiroshi Tanaka"
                const isNudged = nudgedReviewers[revName]
                const isRemarksApproved = !!approvedReviewRemarks[revName]
                const baseDays = trackingManuscript?.id === "SOEAS-26-RS106" ? 5 : 11
                const extraDays = extendedDays[revName] || 0
                const remainingDays = baseDays + extraDays

                const baseDate = trackingManuscript?.id === "SOEAS-26-RS106" ? new Date("2026-08-30") : new Date("2026-09-04")
                const targetDate = new Date(baseDate)
                targetDate.setDate(targetDate.getDate() + extraDays)
                const targetDeadlineDate = targetDate.toISOString().split("T")[0]

                return (
                  <div 
                    key={revName}
                    className={`p-4 rounded-xl border transition-all space-y-2.5 ${
                      isOverdue 
                        ? "bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/40" 
                        : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">
                          {revName}
                        </h4>
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
                            In Progress (Due in {remainingDays}d)
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
                            const revObj: JmReviewFeedback = {
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
                              Edit Remarks
                            </>
                          ) : (
                            <>
                              <MessageSquare className="h-3.5 w-3.5 mr-1 text-[#0b99ff]" />
                              Vet Remarks
                            </>
                          )}
                        </Button>
                      )}
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {isSubmitted ? (
                        <span>Scorecard: <strong className="text-slate-700 dark:text-slate-300 font-semibold">4.8 / 5.0</strong> • Recommendation: <strong className="text-[#0b99ff]">Minor Revision</strong></span>
                      ) : isOverdue ? (
                        <span className="text-red-600 dark:text-red-400 font-medium">Deadline was 2026-08-22 (3 days overdue) • Follow-up reminder required</span>
                      ) : (
                        <span>Invitation accepted • Target report due: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{targetDeadlineDate}</strong></span>
                      )}
                    </div>

                    {isSubmitted && (
                      <div className="p-2.5 bg-white dark:bg-[#121316] border border-slate-200/80 dark:border-slate-800 rounded-lg text-[11px] text-slate-600 dark:text-slate-400 italic">
                        &ldquo;The methodology is rigorous and well-supported. Minor clarifications required in Section 4.&rdquo;
                      </div>
                    )}
                  </div>
                )
              })}
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
                  href="/downloads/Scholarly_Open_Manuscript_Template.txt"
                  download={`${selectedRevisionManuscript?.id || "Manuscript"}_Clean_Revision.pdf`}
                  className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-[#0b99ff]/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCheck2 className="h-4 w-4 text-[#0b99ff] shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">Clean Revised PDF</span>
                  </div>
                  <Download className="h-3.5 w-3.5 text-slate-400 shrink-0" />
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
                            actorName: user?.name || "Sarah Jenkins",
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
                            actorName: user?.name || "Sarah Jenkins",
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

    </div>
  )
}
