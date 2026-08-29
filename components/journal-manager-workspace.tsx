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
  Sliders,
  RotateCcw,
  FileCheck2,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export interface JmManuscript {
  id: string
  title: string
  journal: string
  status: "Draft" | "Awaiting Initial Check" | "Submitted" | "Under Review" | "Revision Required" | "Revision Under Evaluation" | "Accepted" | "Rejected"
  date: string
  reviewers: string[]
  integrityStatus: "Clean" | "Flagged" | "Unchecked"
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
}

export interface JmReviewFeedback {
  id: string
  paperId: string
  reviewerName: string
  originality: number
  methodology: number
  clarity: number
  significance: number
  commentsAuthor: string
  commentsEditor: string
  recommendation: string
  status: "Pending Moderation" | "Released"
  sanitizedCommentsAuthor?: string
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
  user
}: JournalManagerWorkspaceProps) {
  const isDe = language === "de"

  // Stage filter for Submissions Pipeline
  const [selectedStageFilter, setSelectedStageFilter] = useState<"all" | "triage" | "review" | "decision" | "accepted">("all")

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedJournal, setSelectedJournal] = useState("all")
  
  // Assign Modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [selectedManuscript, setSelectedManuscript] = useState<JmManuscript | null>(null)
  const [selectedEditor, setSelectedEditor] = useState("Prof. Aris Thorne")
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>([])
  
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
      if (selectedStageFilter === "decision" || (selectedStageFilter as string) === "revisions") {
        return matchesSearch && matchesJournal && (m.status === "Revision Required" || m.status === "Revision Under Evaluation")
      }
      if (selectedStageFilter === "accepted") {
        return matchesSearch && matchesJournal && (m.status === "Accepted" || m.status === "Rejected")
      }

      return matchesSearch && matchesJournal
    })
  }, [initialManuscripts, searchTerm, selectedJournal, selectedStageFilter])

  // Pipeline columns
  const initialTriageList = initialManuscripts.filter(m => m.status === "Awaiting Initial Check" || m.status === "Submitted" || m.status === "Draft")
  const underReviewList = initialManuscripts.filter(m => m.status === "Under Review")
  const revisionList = initialManuscripts.filter(m => m.status === "Revision Required" || m.status === "Revision Under Evaluation")
  const decisionPendingList = revisionList
  const acceptedList = initialManuscripts.filter(m => m.status === "Accepted" || m.status === "Rejected")

  // Handle open Assign Modal
  const handleOpenAssign = (ms: JmManuscript) => {
    setSelectedManuscript(ms)
    setSelectedReviewers(ms.reviewers || [])
    setIsAssignModalOpen(true)
  }

  // Handle instant confirm assignment
  const handleConfirmAssignment = () => {
    if (!selectedManuscript) return
    const msId = selectedManuscript.id
    const msTitle = selectedManuscript.title
    const msJournal = selectedManuscript.journal
    const editor = selectedEditor
    const reviewers = [...selectedReviewers]

    // Close modal immediately with 0ms lag
    setIsAssignModalOpen(false)

    if (onAssignEditor) {
      onAssignEditor(msId, editor)
    }

    if (onUpdateManuscriptStatus) {
      onUpdateManuscriptStatus(msId, "Under Review")
    }

    // Fire email dispatches asynchronously in the background
    Promise.all(reviewers.map(revName => {
      const revObj = reviewersList.find(x => x.name === revName)
      const targetEmail = revObj ? revObj.email : "reviewer@scholarlyopen.org"
      return fetch("/api/editorial360/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: targetEmail,
          recipientName: revName,
          subject: `Review Invitation: ${msId} - ${msTitle.slice(0, 50)}...`,
          template: "invitation",
          paperId: msId,
          paperTitle: msTitle,
          journal: msJournal
        })
      }).catch(e => console.error(e))
    }))
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

    // Close modal immediately with 0ms lag
    setIsModModalOpen(false)

    if (onReleaseComments) {
      onReleaseComments(revId, editedText)
    }

    // Send author notification in background
    const targetPaper = initialManuscripts.find(m => m.id === paperId)
    const authorEmail = targetPaper?.authorEmail || "author@university.edu"
    const authorName = targetPaper?.authorName || "Author"

    fetch("/api/editorial360/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: authorEmail,
        recipientName: authorName,
        subject: `Review Comments Released: ${paperId}`,
        template: "moderation_released",
        paperId: paperId,
        paperTitle: targetPaper?.title || "Manuscript",
        journal: targetPaper?.journal
      })
    }).catch(e => console.error(e))
  }

  // Handle Return to Author for Correction (Pre-Review Query)
  const handleSendPrecheckQuery = () => {
    if (!selectedManuscript) return
    const msId = selectedManuscript.id
    const msTitle = selectedManuscript.title
    const authorEmail = selectedManuscript.authorEmail || "author@university.edu"
    const authorName = selectedManuscript.authorName || "Author"
    const message = queryAuthorMessage || "Please provide high-resolution figures and a signed ethics/COI declaration statement."

    setIsQueryAuthorOpen(false)
    setIsPreQualityModalOpen(false)
    setQueryAuthorMessage("")

    // Update status to Revision Required or Pre-Check Query
    if (onUpdateManuscriptStatus) {
      onUpdateManuscriptStatus(msId, "Revision Required")
    }

    // Send email notification to author with CC to journal
    fetch("/api/editorial360/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: authorEmail,
        recipientName: authorName,
        subject: `Technical Pre-Check Query: Action Required for ${msId}`,
        template: "precheck_query",
        paperId: msId,
        paperTitle: msTitle,
        customMessage: message,
        journal: selectedManuscript.journal
      })
    }).catch(e => console.error(e))
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

    setNudgedReviewers(prev => ({ ...prev, [revName]: true }))

    fetch("/api/editorial360/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: targetEmail,
        recipientName: revName,
        subject: `Reminder: Double-Blind Review for ${trackingManuscript.id}`,
        template: "reviewer_reminder",
        paperId: trackingManuscript.id,
        paperTitle: trackingManuscript.title,
        journal: trackingManuscript.journal,
        customMessage: "This is a friendly reminder that your review scorecard is due. Please let us know if you require any assistance or an extension."
      })
    }).catch(e => console.error(e))
  }

  // Handle Reviewer Deadline Extension
  const handleExtendReviewer = (revName: string) => {
    setExtendedDays(prev => ({ ...prev, [revName]: (prev[revName] || 0) + 7 }))
  }

  // Handle Reviewer Deadline Extension Reset / Undo
  const handleResetReviewerExtension = (revName: string) => {
    setExtendedDays(prev => ({ ...prev, [revName]: 0 }))
  }

  // Helper for rendering Stage Pill Badge in List View
  const renderStageBadge = (ms: JmManuscript) => {
    if (ms.status === "Awaiting Initial Check" || ms.status === "Submitted" || ms.status === "Draft") {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/80 dark:border-amber-900/30 whitespace-nowrap">
          Initial Triage
        </span>
      )
    }
    if (ms.status === "Under Review") {
      const isOverdue = ms.id === "SOSSH-26-SRW107"
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
    if (ms.status === "Revision Under Evaluation" || (ms as any).submissionStage === "Revised Submission") {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 whitespace-nowrap shadow-2xs">
          Revised Submitted ✓
        </span>
      )
    }
    if (ms.status === "Revision Required") {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/30 whitespace-nowrap">
          Author Revising
        </span>
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
            {user?.photoUrl ? (
              <img src={user.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span>{user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : "SJ"}</span>
            )}
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
            ● Active Operations Desk
          </span>
        </div>
      </div>

      {/* 1. Standard Unified 4-Stat Metric Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl shadow-xs">
        <div className="space-y-1 pr-4 lg:border-r border-slate-100 dark:border-[#272832]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Total Submissions
          </span>
          <div className="text-lg font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
            {initialManuscripts.length} <span className="text-xs font-medium text-slate-500">Manuscripts</span>
          </div>
          <span className="text-xs font-medium text-slate-500 block">Active registry volume</span>
        </div>

        <div className="space-y-1 px-0 lg:px-4 lg:border-r border-slate-100 dark:border-[#272832]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Pending Editor Assignment
          </span>
          <div className="text-lg font-bold tracking-tight text-orange-600 dark:text-orange-400 tabular-nums">
            {initialTriageList.length} <span className="text-xs font-medium text-orange-500">Awaiting Triage</span>
          </div>
          <span className="text-xs font-medium text-slate-500 block">Requires Handling Editor allocation</span>
        </div>

        <div className="space-y-1 pr-4 lg:px-4 lg:border-r border-slate-100 dark:border-[#272832]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Under Active Review
          </span>
          <div className="text-lg font-bold tracking-tight text-[#0b99ff] tabular-nums">
            {underReviewList.length} <span className="text-xs font-medium text-[#0b99ff]">In Progress</span>
          </div>
          <span className="text-xs font-medium text-slate-500 block">Double-blind peer review</span>
        </div>

        <div className="space-y-1 pl-0 lg:pl-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Avg Turnaround Latency
          </span>
          <div className="text-lg font-bold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
            18.4 <span className="text-xs font-medium text-emerald-500">Days (On Target)</span>
          </div>
          <span className="text-xs font-medium text-slate-500 block">Benchmark &lt; 21.0 days</span>
        </div>
      </div>

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
              { key: "all", label: "All Manuscripts", count: initialManuscripts.length },
              { key: "triage", label: "Initial Triage", count: initialTriageList.length },
              { key: "review", label: "Under Review", count: underReviewList.length },
              { key: "revisions", label: "Revisions & Re-Evaluations", count: revisionList.length },
              { key: "accepted", label: "In Production", count: acceptedList.length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setSelectedStageFilter(tab.key as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  selectedStageFilter === tab.key
                    ? "bg-[#0b99ff] text-white border-[#0b99ff] shadow-xs"
                    : "bg-white dark:bg-[#18191e] text-slate-600 dark:text-slate-400 border-slate-200/90 dark:border-[#272832] hover:border-slate-300"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  selectedStageFilter === tab.key ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Full-Width Clean Table */}
          <Card className="bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                    <th className="px-5 py-3.5 whitespace-nowrap w-[170px]">Manuscript ID & Date</th>
                    <th className="px-5 py-3.5 min-w-[280px]">Title & Journal</th>
                    <th className="px-5 py-3.5 whitespace-nowrap w-[160px]">Pipeline Stage</th>
                    <th className="px-5 py-3.5 whitespace-nowrap w-[240px]">Editor & Reviewers</th>
                    <th className="px-5 py-3.5 whitespace-nowrap text-center w-[220px]">Actions</th>
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
                      const isAccepted = ms.status === "Accepted" || ms.status === "Rejected"

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
                                  DOI: <span className="font-medium text-slate-700 dark:text-slate-300">10.59236/soeas.2026.104</span>
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
                          <td className="px-5 py-4 align-top text-center w-[220px] whitespace-nowrap">
                            <div className="flex items-center justify-center gap-2">
                              {isTriage && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedManuscript(ms)
                                      setIsPreQualityModalOpen(true)
                                    }}
                                    className="h-8 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 border-slate-200 dark:border-slate-800 px-3 rounded-lg cursor-pointer"
                                  >
                                    <Eye className="h-3.5 w-3.5 mr-1 text-[#0b99ff]" />
                                    Pre-Check
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleOpenAssign(ms)}
                                    className="h-8 text-xs font-bold bg-[#0b99ff] hover:bg-[#0088e0] text-white px-3.5 rounded-lg cursor-pointer"
                                  >
                                    Assign Editor
                                  </Button>
                                </>
                              )}

                              {isUnderReview && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setTrackingManuscript(ms)
                                      setIsTrackModalOpen(true)
                                    }}
                                    className="h-8 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 border-slate-200 dark:border-slate-800 px-3 rounded-lg cursor-pointer"
                                  >
                                    <Clock className="h-3.5 w-3.5 mr-1 text-[#0b99ff]" />
                                    Track
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      if (onUpdateManuscriptStatus) onUpdateManuscriptStatus(ms.id, "Revision Required")
                                    }}
                                    className="h-8 text-xs font-bold border-amber-300 text-amber-600 hover:bg-amber-50 dark:border-amber-900/50 dark:text-amber-400 px-3 rounded-lg cursor-pointer"
                                  >
                                    Req. Revision
                                  </Button>
                                </>
                              )}

                              {isRevision && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedRevisionManuscript(ms)
                                      setSelectedRound2Reviewers(ms.reviewers && ms.reviewers.length > 0 ? ms.reviewers : ["Prof. Aris Thorne", "Dr. Evelyn Vane"])
                                      setEditorRoutingNote(`Revised version of ${ms.id} has been submitted by ${ms.authorName || 'Author'}. File completeness verified. Routed to Handling Editor for final evaluation.`)
                                      setRevisionActionSuccess(null)
                                      setIsRevisionModalOpen(true)
                                    }}
                                    className="h-8 text-xs font-bold bg-[#0b99ff] hover:bg-[#0088e0] text-white px-3.5 rounded-lg cursor-pointer shadow-2xs"
                                  >
                                    <Sliders className="h-3.5 w-3.5 mr-1" />
                                    Manage Revision
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedRevisionManuscript(ms)
                                      setRevisionActionSuccess(null)
                                      setIsRevisionModalOpen(true)
                                    }}
                                    className="h-8 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 border-slate-200 dark:border-slate-800 px-2.5 rounded-lg cursor-pointer"
                                  >
                                    <Eye className="h-3.5 w-3.5 mr-1 text-[#0b99ff]" />
                                    Rebuttal
                                  </Button>
                                </>
                              )}

                              {isAccepted && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setGalleyManuscript(ms)
                                      setIsGalleyModalOpen(true)
                                    }}
                                    className="h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 rounded-lg cursor-pointer"
                                  >
                                    <FileText className="h-3.5 w-3.5 mr-1" />
                                    Galley Proof
                                  </Button>
                                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-900/30">
                                    Published
                                  </span>
                                </>
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
      {/* 3. COMMENT MODERATION DESK                                                */}
      {/* ========================================================================= */}
      {activeTab === "moderation" && (
        <Card className="bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Review Comment Moderation Desk</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Vet and sanitize reviewer feedback comments before releasing them to authors.</p>
          </div>

          <div className="p-6 space-y-4">
            {initialReviews.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs font-semibold">
                All submitted reviewer feedback has been audited and released. No pending items.
              </div>
            ) : (
              initialReviews.map((rev) => {
                const targetPaper = initialManuscripts.find(m => m.id === rev.paperId)
                const isReleased = rev.status === "Released"

                return (
                  <div key={rev.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isReleased 
                            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30"
                            : "bg-orange-100 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400 border border-orange-200 dark:border-orange-900/30"
                        }`}>
                          {isReleased ? "Released" : "Pending Release"}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">Manuscript ID: {rev.paperId}</span>
                        <span className="text-[11px] text-slate-400">| Reviewer: <strong className="text-slate-600 dark:text-slate-300 font-semibold">{rev.reviewerName}</strong></span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{targetPaper?.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 italic">
                        &ldquo;{rev.sanitizedCommentsAuthor || rev.commentsAuthor}&rdquo;
                      </p>
                    </div>

                    <Button
                      onClick={() => handleOpenModeration(rev)}
                      size="sm"
                      className="bg-[#0b99ff] hover:bg-[#0088e0] text-white font-bold text-xs shrink-0 cursor-pointer h-8 px-4 rounded-lg"
                    >
                      {isReleased ? "View Record" : "Vet Comments"}
                    </Button>
                  </div>
                )
              })
            )}
          </div>
        </Card>
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
                    Email: {rev.email} | Active Load: {rev.activeTasks} papers
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
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Publishing & DOI Dispatch</h3>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Acceptance Rate
            </span>
            <div className="text-lg font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
              21.8%
            </div>
            <span className="text-xs font-medium text-slate-500 block">Double-Blind Peer Review Threshold</span>
          </Card>

          <Card className="p-5 bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Plagiarism Check Status
            </span>
            <div className="text-lg font-bold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
              100% Clean
            </div>
            <span className="text-xs font-medium text-slate-500 block">All submissions verified</span>
          </Card>

          <Card className="p-5 bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Avg Decision Turnaround
            </span>
            <div className="text-lg font-bold tracking-tight text-[#0b99ff] tabular-nums">
              18.4 Days
            </div>
            <span className="text-xs font-medium text-slate-500 block">Within benchmark target</span>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. AUDIT ARCHIVES                                                         */}
      {/* ========================================================================= */}
      {activeTab === "archives" && (
        <Card className="bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Audit Archives</h3>
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
      {/* MODAL 1: ASSIGN EDITOR & REVIEWERS                                        */}
      {/* ========================================================================= */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="max-w-xl bg-white dark:bg-[#18191e] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-sans">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
              Assign Editor & Reviewers
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {selectedManuscript?.id}: {selectedManuscript?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Handling Editor
              </label>
              <select
                value={selectedEditor}
                onChange={(e) => setSelectedEditor(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-[#0b99ff]"
              >
                <option value="Prof. Aris Thorne">Prof. Aris Thorne (Managing Editor)</option>
                <option value="Prof. Clara Zhang">Prof. Clara Zhang (Section Editor)</option>
                <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins (Operations Lead)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Select Peer Reviewers
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {reviewersList.map((rev) => {
                  const isChecked = selectedReviewers.includes(rev.name)
                  return (
                    <div 
                      key={rev.id} 
                      onClick={() => {
                        setSelectedReviewers(prev => 
                          prev.includes(rev.name) ? prev.filter(r => r !== rev.name) : [...prev, rev.name]
                        )
                      }}
                      className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                        isChecked 
                          ? "bg-[#0b99ff]/10 border-[#0b99ff] text-slate-900 dark:text-white" 
                          : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={isChecked} onChange={() => {}} className="rounded text-[#0b99ff]" />
                        <span className="font-bold">{rev.name}</span>
                        <span className="text-slate-400">({rev.specialization})</span>
                      </div>
                      <span className="text-xs text-slate-400">{rev.status}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAssignModalOpen(false)}
              className="text-xs font-semibold border-slate-200 dark:border-slate-800 h-8 px-3.5 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmAssignment}
              disabled={selectedReviewers.length === 0}
              className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-bold h-8 px-4 rounded-lg"
            >
              Assign & Send Invitations
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 2: MANUAL PRE-CHECK & FILE DOWNLOADS                                 */}
      {/* ========================================================================= */}
      <Dialog open={isPreQualityModalOpen} onOpenChange={setIsPreQualityModalOpen}>
        <DialogContent className="max-w-2xl bg-white dark:bg-[#18191e] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-sans">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex flex-wrap items-center justify-between gap-2 pr-6">
              <span>Manuscript Pre-Check & Forensic Inspection</span>
              <span className="text-xs font-bold text-[#0b99ff] bg-[#0b99ff]/10 px-2.5 py-0.5 rounded-md border border-[#0b99ff]/20">
                {selectedManuscript?.id}
              </span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {selectedManuscript?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* 1. Automated Integrity & Forensic Suite */}
            <div className="space-y-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#0b99ff]" />
                  Automated Integrity & Forensic Pre-Scan Suite:
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/30">
                  All Systems Passed ✓
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {/* Plagiarism */}
                <div className="p-3 rounded-lg bg-white dark:bg-[#18191e] border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Similarity Index</div>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    4.2% <span className="text-[10px] text-slate-400 font-normal">(&lt; 15% limit)</span>
                  </div>
                  <div className="text-[10px] text-slate-500">iThenticate / Crossref verified</div>
                </div>

                {/* AI Text Detector */}
                <div className="p-3 rounded-lg bg-white dark:bg-[#18191e] border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Text Probability</div>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    1.8% <span className="text-[10px] text-slate-400 font-normal">(Human Author)</span>
                  </div>
                  <div className="text-[10px] text-slate-500">No synthetic markers detected</div>
                </div>

                {/* AI Image & Figure Forensics */}
                <div className="p-3 rounded-lg bg-white dark:bg-[#18191e] border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Image / Figure Scan</div>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    Clean <span className="text-[10px] text-slate-400 font-normal">(4 Panels)</span>
                  </div>
                  <div className="text-[10px] text-slate-500">No splicing or clone tampering</div>
                </div>
              </div>
            </div>

            {/* Download Files List for JM */}
            <div className="space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Submitted Manuscript Files:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href="/downloads/Scholarly_Open_Manuscript_Template.txt"
                  download={`${selectedManuscript?.id || "Manuscript"}_Main_Document.pdf`}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-[#0b99ff] transition-all text-slate-700 dark:text-slate-300 font-medium"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#0b99ff]" />
                    <span>Main Manuscript (PDF)</span>
                  </div>
                  <Download className="h-3.5 w-3.5 text-slate-400" />
                </a>

                <a
                  href="/downloads/Scholarly_Open_Author_Checklist.txt"
                  download={`${selectedManuscript?.id || "Manuscript"}_Figures_Tables.zip`}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-[#0b99ff] transition-all text-slate-700 dark:text-slate-300 font-medium"
                >
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-[#0b99ff]" />
                    <span>Figures & Tables (ZIP)</span>
                  </div>
                  <Download className="h-3.5 w-3.5 text-slate-400" />
                </a>

                <a
                  href="/downloads/Scholarly_Open_Author_Checklist.txt"
                  download={`${selectedManuscript?.id || "Manuscript"}_Supplementary.pdf`}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-[#0b99ff] transition-all text-slate-700 dark:text-slate-300 font-medium"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#0b99ff]" />
                    <span>Supplementary File</span>
                  </div>
                  <Download className="h-3.5 w-3.5 text-slate-400" />
                </a>

                <a
                  href="/downloads/Scholarly_Open_Author_Checklist.txt"
                  download={`${selectedManuscript?.id || "Manuscript"}_Ethics_Declaration.pdf`}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-[#0b99ff] transition-all text-slate-700 dark:text-slate-300 font-medium"
                >
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-emerald-500" />
                    <span>Ethics & COI Declaration</span>
                  </div>
                  <Download className="h-3.5 w-3.5 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Manual Check list */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Journal Manager Manual Verification Checklist:
              </span>
              <div className="space-y-2">
                {[
                  { key: "manuscriptFile", label: "Manuscript format & double-blind anonymization verified" },
                  { key: "figuresTables", label: "High-resolution figures & clear captions present" },
                  { key: "supplementary", label: "Data availability & supplementary materials complete" },
                  { key: "ethicsDeclaration", label: "IRB approval and ethics declaration signed" },
                  { key: "scopeFit", label: "Scope & aim matches journal discipline" }
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={preCheckChecks[item.key]} 
                      onChange={() => setPreCheckChecks(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                      className="rounded text-[#0b99ff]"
                    />
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsQueryAuthorOpen(true)}
              className="text-xs font-semibold text-amber-600 border-amber-300 hover:bg-amber-50 dark:border-amber-900/40 h-8 px-3.5 rounded-lg"
            >
              <AlertCircle className="h-3.5 w-3.5 mr-1" />
              Return to Author (Files Missing)
            </Button>
            <Button
              size="sm"
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
              Return Manuscript for Author Correction
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
      {/* MODAL 3: MINIMALIST SANITIZE & RELEASE COMMENTS                           */}
      {/* ========================================================================= */}
      <Dialog open={isModModalOpen} onOpenChange={setIsModModalOpen}>
        <DialogContent className="max-w-xl bg-white dark:bg-[#18191e] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-sans">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
              Sanitize Review Comments
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Manuscript ID: {moderatingReview?.paperId} • Reviewer: {moderatingReview?.reviewerName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Author-Facing Review Comments (Editable by JM)
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
              className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-bold h-8 px-4 rounded-lg"
            >
              Release Comments to Author
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
              <span>Galley Proof & Production File</span>
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
              <span>Peer Review Progress & Reviewer Tracking</span>
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

            {/* Reviewers Progress List */}
            <div className="space-y-3">
              <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
                Assigned Reviewer Milestones & Actions:
              </span>

              {(trackingManuscript?.reviewers || ["Dr. Evelyn Vane", "Dr. Marcus Vance"]).map((revName) => {
                const isSubmitted = revName === "Dr. Evelyn Vane"
                const isOverdue = trackingManuscript?.id === "SOSSH-26-SRW107" || revName === "Prof. Hiroshi Tanaka"
                const isNudged = nudgedReviewers[revName]
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
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/30 whitespace-nowrap">
                            Report Submitted ✓
                          </span>
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

                      {!isSubmitted && (
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleNudgeReviewer(revName)}
                            disabled={isNudged}
                            className={`h-8 text-xs font-bold px-3 rounded-lg cursor-pointer whitespace-nowrap ${
                              isNudged 
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800" 
                                : isOverdue 
                                  ? "bg-red-50 border-red-300 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:border-red-900" 
                                  : "border-amber-300 text-amber-600 hover:bg-amber-50 dark:border-amber-900/40"
                            }`}
                          >
                            {isNudged ? "✓ Reminder Dispatched" : isOverdue ? "🚨 Send Urgent Nudge" : "🔔 Send Reminder (Nudge)"}
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
                      )}
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {isSubmitted ? (
                        <span>Scorecard: <strong className="text-slate-700 dark:text-slate-300 font-semibold">4.8 / 5.0</strong> • Minor Revision recommended</span>
                      ) : isOverdue ? (
                        <span className="text-red-600 dark:text-red-400 font-medium">Deadline was 2026-08-22 (3 days overdue) • Follow-up reminder required</span>
                      ) : (
                        <span>Invitation accepted • Target report due: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{targetDeadlineDate}</strong></span>
                      )}
                    </div>
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
        <DialogContent className="max-w-2xl bg-white dark:bg-[#18191e] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-sans max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#0b99ff] bg-[#0b99ff]/10 px-2.5 py-0.5 rounded-md border border-[#0b99ff]/20 text-xs">
                  {selectedRevisionManuscript?.id}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200/80">
                  Revision Received (v2.0)
                </span>
              </div>
            </div>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white mt-2">
              {selectedRevisionManuscript?.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Journal: <span className="font-medium text-slate-700 dark:text-slate-300">{selectedRevisionManuscript?.journal}</span> • 
              Author: <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedRevisionManuscript?.authorName || "Dr. Sarah Jenkins"}</span>
            </DialogDescription>
          </DialogHeader>

          {revisionActionSuccess ? (
            <div className="p-5 my-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 rounded-xl text-center space-y-3 animate-in fade-in duration-200">
              <div className="h-10 w-10 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                <Check className="h-6 w-6" />
              </div>
              <div className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">
                {revisionActionSuccess}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Audit archives updated and automated email dispatch notifications delivered.
              </p>
              <Button
                size="sm"
                onClick={() => {
                  setIsRevisionModalOpen(false)
                  setRevisionActionSuccess(null)
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg cursor-pointer"
              >
                Done
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-2 text-xs">
              {/* 1. File Vault: Revised Docs & Rebuttal */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">
                    Uploaded Revision Files & Artifacts:
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> All Required Files Present
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Clean Manuscript PDF */}
                  <a
                    href="/downloads/Scholarly_Open_Manuscript_Template.txt"
                    download={`${selectedRevisionManuscript?.id || "Manuscript"}_Clean_Revision_v2.pdf`}
                    className="flex items-center justify-between p-2.5 bg-white dark:bg-[#18191e] border border-slate-200 dark:border-slate-800 rounded-lg hover:border-[#0b99ff]/50 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileCheck2 className="h-4 w-4 text-[#0b99ff] shrink-0" />
                      <div className="truncate text-left">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">Clean Revised PDF</div>
                        <div className="text-[10px] text-slate-400">2.4 MB • Complete Layout</div>
                      </div>
                    </div>
                    <Download className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#0b99ff] shrink-0" />
                  </a>

                  {/* Tracked Changes DOCX */}
                  <a
                    href="/downloads/Scholarly_Open_Manuscript_Template.txt"
                    download={`${selectedRevisionManuscript?.id || "Manuscript"}_Tracked_Changes.docx`}
                    className="flex items-center justify-between p-2.5 bg-white dark:bg-[#18191e] border border-slate-200 dark:border-slate-800 rounded-lg hover:border-[#0b99ff]/50 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="h-4 w-4 text-purple-500 shrink-0" />
                      <div className="truncate text-left">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">Tracked Changes (Markup)</div>
                        <div className="text-[10px] text-slate-400">1.8 MB • DOCX with diffs</div>
                      </div>
                    </div>
                    <Download className="h-3.5 w-3.5 text-slate-400 group-hover:text-purple-500 shrink-0" />
                  </a>
                </div>
              </div>

              {/* 2. Point-by-Point Author Rebuttal Letter */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-[#0b99ff]" /> Author Point-by-Point Rebuttal:
                  </span>
                  <span className="text-[10px] text-slate-400">Submitted: 2026-06-03</span>
                </div>

                <div className="p-3 bg-white dark:bg-[#14151a] border border-slate-200/80 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans text-xs max-h-36 overflow-y-auto space-y-2">
                  <p className="font-medium text-slate-900 dark:text-white">
                    Dear Handling Editor ({selectedRevisionManuscript?.assignedEditorName || "Prof. Aris Thorne"}) and Reviewers:
                  </p>
                  <p>
                    &ldquo;We thank Reviewer 1 for the insightful comments on our multi-country wage disparity panel dataset. We have thoroughly revised Section 3, added sensitivity checks for 2024 OECD metrics in Table 4, and corrected all formatting anomalies. Tracked changes are highlighted in red in the attached DOCX.&rdquo;
                  </p>
                  <div className="text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-1.5">
                    <strong>Specific Responses:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-0.5">
                      <li>Comment 1 (Econometric models): Addressed in Section 3.2. Equations (4)-(7) revised.</li>
                      <li>Comment 2 (Tone & Clarifications): Revised paragraph 3 in Discussion to objective framing.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 3. Triage & Dispatch Routing Options */}
              <div className="space-y-3 pt-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider block">
                  Select Workflow Action for this Revision:
                </span>

                <div className="grid grid-cols-1 gap-2.5">
                  {/* Action 1: Forward to Handling Editor for Decision */}
                  <div className="p-3 bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/40 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4 text-[#0b99ff]" />
                        <span className="font-bold text-slate-900 dark:text-white text-xs">
                          Option 1: Forward to Handling Editor for Re-Evaluation & Decision
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-[#0b99ff] bg-[#0b99ff]/10 px-2 py-0.5 rounded">
                        Standard Minor Revision Flow
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Routes the updated draft and author response directly to <strong>{selectedRevisionManuscript?.assignedEditorName || "Prof. Aris Thorne"}</strong> to render the final acceptance or minor decision.
                    </p>
                    <div className="flex justify-end pt-1">
                      <Button
                        size="sm"
                        onClick={() => {
                          if (selectedRevisionManuscript && onUpdateManuscriptStatus) {
                            onUpdateManuscriptStatus(selectedRevisionManuscript.id, "Revision Under Evaluation")
                            setRevisionActionSuccess(`✓ Manuscript ${selectedRevisionManuscript.id} successfully forwarded to Handling Editor (${selectedRevisionManuscript.assignedEditorName || "Prof. Aris Thorne"}) for re-evaluation & decision.`)
                          }
                        }}
                        className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-bold h-8 px-4 rounded-lg cursor-pointer"
                      >
                        <Send className="h-3.5 w-3.5 mr-1" />
                        Forward to Editor ({selectedRevisionManuscript?.assignedEditorName?.split(' ')[0] || "Editor"})
                      </Button>
                    </div>
                  </div>

                  {/* Action 2: Dispatch for Round 2 Re-Review */}
                  <div className="p-3 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <RotateCcw className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <span className="font-bold text-slate-900 dark:text-white text-xs">
                          Option 2: Dispatch to Reviewers for Round 2 Peer Review
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-purple-700 bg-purple-100 dark:bg-purple-900/40 px-2 py-0.5 rounded">
                        Major Revision Re-Review
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Dispatches the revised manuscript and rebuttal to willing Round 1 reviewers:
                    </p>
                    
                    {/* Willing Reviewers Selector */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {["Prof. Aris Thorne", "Dr. Evelyn Vane"].map(rev => (
                        <label key={rev} className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white dark:bg-[#18191e] border border-purple-200 dark:border-purple-900/40 text-xs text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedRound2Reviewers.includes(rev)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedRound2Reviewers(prev => [...prev, rev])
                              else setSelectedRound2Reviewers(prev => prev.filter(r => r !== rev))
                            }}
                            className="rounded text-purple-600"
                          />
                          <span>{rev} (Willing to re-review)</span>
                        </label>
                      ))}
                    </div>

                    <div className="flex justify-end pt-1">
                      <Button
                        size="sm"
                        onClick={() => {
                          if (selectedRevisionManuscript && onUpdateManuscriptStatus) {
                            onUpdateManuscriptStatus(selectedRevisionManuscript.id, "Under Review")
                            setRevisionActionSuccess(`✓ Round 2 re-review invitations dispatched to ${selectedRound2Reviewers.join(", ")} (14-day turnaround target).`)
                          }
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold h-8 px-4 rounded-lg cursor-pointer"
                      >
                        <RotateCcw className="h-3.5 w-3.5 mr-1" />
                        Dispatch Round 2 Re-Review
                      </Button>
                    </div>
                  </div>

                  {/* Action 3: Direct Acceptance */}
                  <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-600" />
                        <span className="font-bold text-slate-900 dark:text-white text-xs">
                          Option 3: Final Acceptance & Dispatch to Production
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded">
                        All Revisions Approved
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Immediately signs off on the revised manuscript, updates status to <strong>Accepted</strong>, and schedules typeset galley proof generation.
                    </p>
                    <div className="flex justify-end pt-1">
                      <Button
                        size="sm"
                        onClick={() => {
                          if (selectedRevisionManuscript && onUpdateManuscriptStatus) {
                            onUpdateManuscriptStatus(selectedRevisionManuscript.id, "Accepted")
                            setRevisionActionSuccess(`✓ Manuscript ${selectedRevisionManuscript.id} has been Accepted for publication. Moved to production and galley proofing.`)
                          }
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-8 px-4 rounded-lg cursor-pointer"
                      >
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Accept Manuscript
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-row items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsRevisionModalOpen(false)
                setIsQueryAuthorOpen(true)
              }}
              className="text-xs font-semibold text-amber-600 border-amber-300 hover:bg-amber-50 dark:border-amber-900/40 h-8 px-3.5 rounded-lg"
            >
              <AlertCircle className="h-3.5 w-3.5 mr-1" />
              Request Further Author Corrections
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRevisionModalOpen(false)}
              className="text-xs font-semibold border-slate-200 dark:border-slate-800 h-8 px-3.5 rounded-lg"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
