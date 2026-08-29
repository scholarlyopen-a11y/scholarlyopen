"use client"

import { useState } from "react"
import { 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  Users, 
  Clock, 
  Check, 
  X, 
  Search, 
  Filter, 
  ArrowRight, 
  Download, 
  Send, 
  Eye, 
  SlidersHorizontal, 
  CheckCircle2, 
  Plus, 
  MessageSquareOff, 
  Bell, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles,
  BookOpen,
  Award,
  ChevronRight,
  FileCheck2,
  Lock,
  Tag,
  Mail,
  Edit3,
  HelpCircle,
  FolderPlus,
  Calendar,
  Layers,
  CheckCircle,
  ExternalLink,
  MessageSquare,
  TrendingUp,
  BarChart3,
  PieChart,
  Shield,
  Zap,
  Star,
  Activity,
  UserCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { JmManuscript, JmReviewer } from "./journal-manager-workspace"

interface EditorWorkspaceProps {
  language: "en" | "de"
  activeTab?: string
  onTabChange?: (tab: string) => void
  manuscripts: JmManuscript[]
  onUpdateManuscriptStatus?: (paperId: string, newStatus: JmManuscript["status"]) => void
  user?: {
    name: string
    title: string
    email: string
    journal: string
    institution?: string
    country?: string
    photoUrl?: string
    orcid?: string
  }
}

interface EditorialDecisionDraft {
  paperId: string
  verdict: "Accept" | "Minor Revision" | "Major Revision" | "Reject & Resubmit" | "Reject"
  confidentialNotes: string
  letterContent: string
  notifyCoAuthors: boolean
}

interface SpecialCollectionItem {
  id: string
  title: string
  journal: string
  guestEditors: string
  deadline: string
  status: "Open" | "In Review" | "Closed"
  submissionsCount: number
  description: string
}

const REVIEWER_COMMENTS_SAMPLE: Record<string, { rev1: string; rev2: string }> = {
  default: {
    rev1: `[Reviewer #1 Evaluation Report]
Recommendation: Accept with Minor Revisions
Comments to Author:
1. In Section 3.2, please clarify the sample size calculation and confidence interval in Table 2.
2. Enhance the resolution of Figure 3 (immunohistochemistry staining) to 300 DPI.
3. Address minor typographical discrepancies in Section 4.1.`,
    rev2: `[Reviewer #2 Evaluation Report]
Recommendation: Minor Revisions
Comments to Author:
1. Expand on the clinical translation limitations in the Discussion section.
2. Ensure the raw data availability repository link is provided in the Data Availability Statement.`
  },
  major: {
    rev1: `[Reviewer #1 Evaluation Report]
Recommendation: Major Revision
Comments to Author:
1. The control cohort needs additional validation against the external reference dataset.
2. Re-evaluate the staining protocol described in Methods subsection B; current controls appear insufficient.
3. Statistical significance testing must include false discovery rate (FDR) corrections for multiple comparisons.`,
    rev2: `[Reviewer #2 Evaluation Report]
Recommendation: Major Revision
Comments to Author:
1. Please provide full supplementary source data tables for all in vitro dosage response curves.
2. The mechanistic conclusion drawn in Figure 5 is premature without knockdown confirmation.`
  }
}

function getDecisionLetterTemplate(verdict: string, editorName: string, journalName: string) {
  const isEicVerdict = verdict === "Accept" || verdict === "Reject"
  const roleTitle = isEicVerdict ? "Editor-in-Chief" : "Handling Editor"
  const cleanJournal = journalName || "Scholarly Open"

  if (verdict === "Accept") {
    return `Dear Author,

We are pleased to inform you that following comprehensive peer evaluation, your manuscript has been formally ACCEPTED for publication in ${cleanJournal}.

Next Steps:
1. Our production office will prepare the galley proofs and JATS XML.
2. A formal Crossref DOI will be generated upon proof approval.

Congratulations on the publication of your valuable scholarly work.

Sincerely,
${editorName}
${roleTitle}, ${cleanJournal}`
  }

  if (verdict === "Minor Revision") {
    return `Dear Author,

Thank you for submitting your manuscript to ${cleanJournal}. The reviewers have evaluated your work and found significant merit, but recommend MINOR REVISIONS prior to formal acceptance.

Please address the itemized reviewer comments provided below and submit your revised manuscript along with a point-by-point rebuttal letter within 14 calendar days.

======================================================================
ITEMIZED REVIEWER EVALUATIONS & COMMENTS:

${REVIEWER_COMMENTS_SAMPLE.default.rev1}

${REVIEWER_COMMENTS_SAMPLE.default.rev2}
======================================================================

Sincerely,
${editorName}
${roleTitle}, ${cleanJournal}`
  }

  if (verdict === "Major Revision" || verdict === "Reject & Resubmit") {
    return `Dear Author,

The peer evaluation for your manuscript is now complete. While the core concept is sound, the reviewers have identified substantial methodological and analytical areas requiring MAJOR REVISIONS.

Please review the detailed feedback below and submit a thoroughly revised version, revised data figures, and a point-by-point response letter within 28 calendar days.

======================================================================
ITEMIZED REVIEWER EVALUATIONS & COMMENTS:

${REVIEWER_COMMENTS_SAMPLE.major.rev1}

${REVIEWER_COMMENTS_SAMPLE.major.rev2}
======================================================================

Sincerely,
${editorName}
${roleTitle}, ${cleanJournal}`
  }

  return `Dear Author,

Thank you for submitting your manuscript to ${cleanJournal}. Following careful peer evaluation and editorial assessment, we regret to inform you that we are unable to accept your manuscript for publication in this journal.

We thank you for considering ${cleanJournal} and wish you success in placing your work elsewhere.

Sincerely,
${editorName}
${roleTitle}, ${cleanJournal}`
}

const INITIAL_COLLECTIONS: SpecialCollectionItem[] = [
  {
    id: "SC-2026-01",
    title: "Next-Generation CRISPR Diagnostics & In Vivo Cellular Editing",
    journal: "Scholarly Open: Medicine & Applied Sciences",
    guestEditors: "Prof. Aris Thorne (Germany), Prof. Elena Rostova (Sweden)",
    deadline: "Nov 30, 2026",
    status: "Open",
    submissionsCount: 6,
    description: "Invited research exploring targeted base editing, prime editing tools, and clinical diagnostic translation in human therapeutics."
  },
  {
    id: "SC-2026-02",
    title: "Decarbonized Urban Logistics and Zero-Emission Heavy Transport",
    journal: "Scholarly Open: Decarbonization & Clean Tech",
    guestEditors: "Dr. Marcus Vance (UK), Dr. Tobias Becker (Germany)",
    deadline: "Dec 15, 2026",
    status: "Open",
    submissionsCount: 4,
    description: "State-of-the-art battery chemistries, megawatt charging infrastructure, and hydrogen fuel cell fleet integrations."
  }
]

export function EditorWorkspace({
  language,
  activeTab = "desk",
  onTabChange,
  manuscripts: initialManuscripts,
  onUpdateManuscriptStatus,
  user = {
    name: "Prof. Aris Thorne",
    title: "Editor-in-Chief & Managing Editor",
    email: "a.thorne@scholarlyopen.org",
    journal: "Scholarly Open: Medicine & Applied Sciences",
    institution: "Charité – Universitätsmedizin Berlin",
    country: "Germany",
    orcid: "0000-0002-9842-1102"
  }
}: EditorWorkspaceProps) {
  const isDe = language === "de"

  const [manuscripts, setManuscripts] = useState<JmManuscript[]>(initialManuscripts)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedJournal, setSelectedJournal] = useState("all")
  const [selectedStageFilter, setSelectedStageFilter] = useState<"all" | "triage" | "review" | "revision" | "decision">("all")

  // Selected paper for decision
  const [selectedPaperForDecision, setSelectedPaperForDecision] = useState<JmManuscript | null>(null)
  const [decisionVerdict, setDecisionVerdict] = useState<EditorialDecisionDraft["verdict"]>("Minor Revision")
  const [decisionLetter, setDecisionLetter] = useState(getDecisionLetterTemplate("Minor Revision", user.name, user.journal))
  const [confidentialNotes, setConfidentialNotes] = useState("")

  // Selected paper for Reviewer Assignment
  const [selectedPaperForReviewers, setSelectedPaperForReviewers] = useState<JmManuscript | null>(null)
  const [selectedReviewerNames, setSelectedReviewerNames] = useState<string[]>(["Dr. Marcus Vance"])

  // Detail Drawer
  const [selectedPaperForDetail, setSelectedPaperForDetail] = useState<JmManuscript | null>(null)

  // Forensic Integrity Inspector Modal
  const [selectedPaperForIntegrity, setSelectedPaperForIntegrity] = useState<JmManuscript | null>(null)

  // Escalate to Integrity Manager (IM) Modal
  const [selectedPaperForImEscalation, setSelectedPaperForImEscalation] = useState<JmManuscript | null>(null)
  const [escalationReason, setEscalationReason] = useState<string>("plagiarism")
  const [escalationNotes, setEscalationNotes] = useState<string>("")

  // Live Reviewer Nudging Tracker
  const [nudgedReviewers, setNudgedReviewers] = useState<string[]>([])

  // JM Assistance Request Modal
  const [selectedPaperForJmHelp, setSelectedPaperForJmHelp] = useState<JmManuscript | null>(null)
  const [jmHelpType, setJmHelpType] = useState<string>("chase_reviewers")
  const [jmHelpNote, setJmHelpNote] = useState<string>("")

  // Special Collections
  const [collections, setCollections] = useState<SpecialCollectionItem[]>(INITIAL_COLLECTIONS)
  const [isNewCollectionOpen, setIsNewCollectionOpen] = useState(false)
  const [newCollectionTitle, setNewCollectionTitle] = useState("")
  const [newCollectionJournal, setNewCollectionJournal] = useState(user.journal || "Scholarly Open: Medicine & Applied Sciences")
  const [newCollectionGuestEditors, setNewCollectionGuestEditors] = useState("")
  const [newCollectionDeadline, setNewCollectionDeadline] = useState("2026-12-31")
  const [newCollectionDesc, setNewCollectionDesc] = useState("")

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Filter counts
  const triageCount = manuscripts.filter(m => m.status === "Awaiting Initial Check" || m.status === "Submitted" || m.status === "Draft").length
  const reviewCount = manuscripts.filter(m => m.status === "Under Review" || m.status === "Revision Under Evaluation").length
  const revisionCount = manuscripts.filter(m => m.status === "Revision Required").length
  const decisionCount = manuscripts.filter(m => m.status === "Accepted" || m.status === "Rejected").length

  // Filtered Papers
  const filteredPapers = manuscripts.filter(m => {
    const matchesJournal = selectedJournal === "all" || m.journal.toLowerCase().includes(selectedJournal.toLowerCase())
    const matchesSearch = !searchQuery ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.authorName && m.authorName.toLowerCase().includes(searchQuery.toLowerCase()))

    let matchesStage = true
    if (selectedStageFilter === "triage") {
      matchesStage = m.status === "Awaiting Initial Check" || m.status === "Submitted" || m.status === "Draft"
    } else if (selectedStageFilter === "review") {
      matchesStage = m.status === "Under Review" || m.status === "Revision Under Evaluation"
    } else if (selectedStageFilter === "revision") {
      matchesStage = m.status === "Revision Required"
    } else if (selectedStageFilter === "decision") {
      matchesStage = m.status === "Accepted" || m.status === "Rejected"
    }

    return matchesJournal && matchesSearch && matchesStage
  })

  // Handlers
  const handleOpenDecisionModal = (paper: JmManuscript) => {
    setSelectedPaperForDecision(paper)
    setDecisionVerdict("Minor Revision")
    setDecisionLetter(getDecisionLetterTemplate("Minor Revision", user.name, paper.journal || user.journal))
    setConfidentialNotes("")
  }

  const handleVerdictChange = (v: EditorialDecisionDraft["verdict"]) => {
    setDecisionVerdict(v)
    const templateKey = v === "Reject & Resubmit" ? "Major Revision" : v
    setDecisionLetter(getDecisionLetterTemplate(templateKey, user.name, selectedPaperForDecision?.journal || user.journal))
  }

  const handleSubmitDecision = () => {
    if (!selectedPaperForDecision) return

    let nextStatus: JmManuscript["status"] = "Under Review"
    if (decisionVerdict === "Accept") nextStatus = "Accepted"
    else if (decisionVerdict === "Minor Revision" || decisionVerdict === "Major Revision" || decisionVerdict === "Reject & Resubmit") nextStatus = "Revision Required"
    else if (decisionVerdict === "Reject") nextStatus = "Rejected"

    const updated = manuscripts.map(m => {
      if (m.id === selectedPaperForDecision.id) {
        return { ...m, status: nextStatus }
      }
      return m
    })
    setManuscripts(updated)
    if (onUpdateManuscriptStatus) onUpdateManuscriptStatus(selectedPaperForDecision.id, nextStatus)

    triggerToast(isDe ? `Redaktionelle Entscheidung '${decisionVerdict}' erfolgreich übermittelt!` : `Editorial decision '${decisionVerdict}' dispatched to author!`)
    setSelectedPaperForDecision(null)
  }

  const handleAssignReviewersSubmit = () => {
    if (!selectedPaperForReviewers) return
    const updated = manuscripts.map(m => {
      if (m.id === selectedPaperForReviewers.id) {
        return {
          ...m,
          status: "Under Review" as const,
          reviewers: selectedReviewerNames
        }
      }
      return m
    })
    setManuscripts(updated)
    if (onUpdateManuscriptStatus) onUpdateManuscriptStatus(selectedPaperForReviewers.id, "Under Review")

    triggerToast(isDe ? "Gutachter-Einladungen versendet!" : "Peer reviewer invitations dispatched!")
    setSelectedPaperForReviewers(null)
  }

  const handleCreateCollectionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCollectionTitle.trim()) return

    const newCol: SpecialCollectionItem = {
      id: `SC-2026-0${collections.length + 1}`,
      title: newCollectionTitle.trim(),
      journal: newCollectionJournal,
      guestEditors: newCollectionGuestEditors.trim() || `${user.name} (Lead Editor)`,
      deadline: newCollectionDeadline,
      status: "Open",
      submissionsCount: 0,
      description: newCollectionDesc.trim() || "Thematic collection dedicated to breakthrough research."
    }

    setCollections([newCol, ...collections])
    setIsNewCollectionOpen(false)
    setNewCollectionTitle("")
    setNewCollectionGuestEditors("")
    setNewCollectionDesc("")
    triggerToast(isDe ? "Neues Sonderheft erfolgreich veröffentlicht!" : "New Special Issue collection created & published!")
  }

  return (
    <div className="space-y-6 font-sans">

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between shadow-sm animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-600 hover:text-emerald-800 text-xs font-bold cursor-pointer">✕</button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. RICH HEADER CARD (INSPIRED BY AUTHOR/EDITOR IDENTITY & CREDENTIALS)    */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-2xl border border-slate-200/90 dark:border-[#272832] bg-white dark:bg-[#18191e] shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative h-13 w-13 rounded-full overflow-hidden bg-gradient-to-tr from-[#0b99ff] to-[#0077cc] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-md ring-2 ring-slate-200 dark:ring-[#272832]">
              {user.photoUrl ? (
                <img src={user.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{user.name ? user.name.replace(/^Prof\.\s*|^Dr\.\s*/i, '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : "AT"}</span>
              )}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight">
                  {user.name}
                </h2>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#0b99ff]/10 text-[#0b99ff] border border-[#0b99ff]/20">
                  {user.title || (isDe ? "Leitender Herausgeber" : "Professor & Editor-in-Chief")}
                </span>
                
                {/* Verified ORCID Badge */}
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#a6ce39] bg-[#a6ce39]/10 px-2.5 py-0.5 rounded-md border border-[#a6ce39]/30">
                  <span className="h-2 w-2 rounded-full bg-[#a6ce39]" />
                  ORCID: {user.orcid || "0000-0002-9842-1102"} ✓
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{user.journal}</span>
                <span className="text-slate-300 dark:text-slate-700 select-none">|</span>
                <span>{user.institution || "Charité – Universitätsmedizin Berlin"}{user.country ? ` (${user.country})` : ""}</span>
                <span className="text-slate-300 dark:text-slate-700 select-none">|</span>
                <span className="text-[#0b99ff] font-medium">{user.email}</span>
              </div>
            </div>
          </div>

          {/* Header Right Desk Status Badge (Matching JM Clean Style) */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-900/30 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Active Editorial Desk · Top 5% Speed
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. COMPACT 4-STAT METRIC STRIP (JM-STYLE CLEAN ROW)                       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl shadow-xs">
        <div className="space-y-1 pr-4 lg:border-r border-slate-100 dark:border-[#272832]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Manuscripts on Desk
          </span>
          <div className="text-lg font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
            {manuscripts.length} <span className="text-xs font-medium text-slate-500">Total Papers</span>
          </div>
          <span className="text-xs font-medium text-slate-500 block">Assigned editorial portfolio</span>
        </div>

        <div className="space-y-1 px-0 lg:px-4 lg:border-r border-slate-100 dark:border-[#272832]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Awaiting Desk Triage
          </span>
          <div className="text-lg font-bold tracking-tight text-amber-600 dark:text-amber-400 tabular-nums">
            {triageCount} <span className="text-xs font-medium text-amber-500">Pending Review</span>
          </div>
          <span className="text-xs font-medium text-slate-500 block">Needs reviewer allocation</span>
        </div>

        <div className="space-y-1 pr-4 lg:px-4 lg:border-r border-slate-100 dark:border-[#272832]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Active Peer Review
          </span>
          <div className="text-lg font-bold tracking-tight text-[#0b99ff] tabular-nums">
            {reviewCount} <span className="text-xs font-medium text-[#0b99ff]">In Evaluation</span>
          </div>
          <span className="text-xs font-medium text-slate-500 block">Scorecards in progress</span>
        </div>

        <div className="space-y-1 pl-0 lg:pl-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Avg Turnaround Speed
          </span>
          <div className="text-lg font-bold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
            14.2 <span className="text-xs font-medium text-emerald-500">Days (Fast)</span>
          </div>
          <span className="text-xs font-medium text-slate-500 block">Benchmark &lt; 21.0 days</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: EDITORIAL DESK & PIPELINE                                          */}
      {/* ========================================================================= */}
      {(activeTab === "desk" || activeTab === "overview") && (
        <div className="space-y-4">
          
          {/* Clean JM-Style Search, Subject Selector & Small Filter Tabs */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] space-y-3 shadow-xs">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full">
                <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isDe ? "Nach Manuscript ID, Titel oder Autor suchen..." : "Search manuscripts by ID, title, or author..."}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#131418] border border-slate-200 dark:border-[#272832] rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedJournal}
                  onChange={(e) => setSelectedJournal(e.target.value)}
                  className="px-3 py-2 bg-slate-50 dark:bg-[#131418] border border-slate-200 dark:border-[#272832] rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0b99ff] w-full sm:w-auto"
                >
                  <option value="all">{isDe ? "Alle Fachzeitschriften" : "All Subject Areas"}</option>
                  <option value="medicine">Scholarly Open: Medicine</option>
                  <option value="engineering">Engineering & Applied Sciences</option>
                  <option value="social">Social Sciences & Humanities</option>
                  <option value="decarbonization">Decarbonization & Clean Tech</option>
                </select>

                <span className="text-xs text-slate-500 font-medium px-2.5 py-1.5 bg-slate-100 dark:bg-[#20222a] rounded-xl border border-slate-200/80 dark:border-[#272832] whitespace-nowrap hidden sm:inline-block">
                  {filteredPapers.length} {isDe ? "Manuskripte" : "Papers"}
                </span>
              </div>
            </div>

            {/* Small Clickable Stage Filter Tabs (Just like JM Workspace) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 pt-2 border-t border-slate-100 dark:border-[#272832]">
              {[
                { id: "all", label: isDe ? "Alle Manuskripte" : "All Manuscripts", count: manuscripts.length },
                { id: "triage", label: isDe ? "Desk Triage" : "Desk Triage", count: triageCount },
                { id: "review", label: isDe ? "In Begutachtung" : "Under Review", count: reviewCount },
                { id: "revision", label: isDe ? "In Überarbeitung" : "In Revision", count: revisionCount },
                { id: "decision", label: isDe ? "Entschieden" : "Decisions Completed", count: decisionCount }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedStageFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedStageFilter === tab.id
                      ? "bg-[#0b99ff] text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-[#1e2027] dark:hover:bg-[#252833] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    selectedStageFilter === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 dark:bg-[#272832] text-slate-700 dark:text-slate-300"
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Manuscripts List */}
          <div className="space-y-3">
            {filteredPapers.map((paper) => {
              const isTriage = paper.status === "Awaiting Initial Check" || paper.status === "Submitted" || paper.status === "Draft"
              const isRevisedSubmitted = paper.status === "Revision Under Evaluation" || (paper as any).submissionStage === "Revised Submission"
              const isReviewing = paper.status === "Under Review"
              const isRevision = paper.status === "Revision Required"
              const isAccepted = paper.status === "Accepted"

              return (
                <Card key={paper.id} className="p-4 sm:p-5 bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl space-y-3.5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 flex-wrap text-xs">
                      <span className="font-bold text-[#0b99ff] bg-[#0b99ff]/10 px-2 py-0.5 rounded-md border border-[#0b99ff]/20 whitespace-nowrap">
                        {paper.id}
                      </span>
                      <span className="text-slate-400 dark:text-slate-600">•</span>
                      <span className="text-slate-600 dark:text-slate-300 font-semibold">{paper.journal}</span>
                      <span className="text-slate-400 dark:text-slate-600">•</span>
                      <span className="text-slate-500 dark:text-slate-400">Submitted {paper.date}</span>
                    </div>

                    <div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                        isTriage ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/40" :
                        isRevisedSubmitted ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shadow-2xs" :
                        isReviewing ? "bg-sky-50 text-[#0b99ff] dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200/80 dark:border-sky-900/40" :
                        isRevision ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/40" :
                        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-900/40"
                      }`}>
                        {isRevisedSubmitted ? "Revised Submitted ✓" : isRevision ? "Author Revising" : paper.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{paper.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Author: <strong className="text-slate-700 dark:text-slate-300">{paper.authorName || "Dr. Marcus Vance"}</strong> · {paper.authorAffiliation || "Charité – Universitätsmedizin Berlin"}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-200/80 dark:border-[#272832] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="text-slate-600 dark:text-slate-400">
                        Assigned Reviewers: <span className="font-semibold text-slate-800 dark:text-slate-200">{paper.reviewers && paper.reviewers.length > 0 ? paper.reviewers.join(", ") : (isTriage ? "None assigned yet" : "Dr. Marcus Vance (Scorecard Complete), Prof. Elena Rostova (In Review)")}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setSelectedPaperForIntegrity(paper)}
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/30 text-[11px] font-semibold hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                          Plagiarism: 4% · AI Index: 2% (Passed)
                        </button>
                        <span className="text-[11px] text-slate-400">· COPE Ethics Verified ✓</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <Button
                        onClick={() => setSelectedPaperForDetail(paper)}
                        variant="outline"
                        className="text-xs h-8 px-3 border-slate-300 dark:border-[#272832] text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-[#1e2027] cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1 text-slate-500" />
                        {isDe ? "Volltext" : "Inspect"}
                      </Button>

                      {/* Request JM Help */}
                      <Button
                        onClick={() => {
                          setSelectedPaperForJmHelp(paper)
                          setJmHelpType("chase_reviewers")
                          setJmHelpNote("")
                        }}
                        variant="outline"
                        className="text-xs h-8 px-2.5 border-slate-300 dark:border-[#272832] text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-[#1e2027] cursor-pointer"
                        title="Coordinate with Journal Manager desk"
                      >
                        <MessageSquare className="h-3.5 w-3.5 mr-1 text-[#0b99ff]" />
                        JM Assistance
                      </Button>

                      {isTriage && (
                        <Button
                          onClick={() => {
                            setSelectedPaperForReviewers(paper)
                            setSelectedReviewerNames(["Dr. Marcus Vance", "Prof. Elena Rostova"])
                          }}
                          className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-semibold h-8 px-3.5 cursor-pointer shadow-xs"
                        >
                          <Users className="h-3.5 w-3.5 mr-1" />
                          {isDe ? "Gutachter zuweisen" : "Assign Reviewers"}
                        </Button>
                      )}

                      {!isTriage && !isAccepted && (
                        <Button
                          onClick={() => handleOpenDecisionModal(paper)}
                          className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-semibold h-8 px-3.5 cursor-pointer shadow-xs"
                        >
                          <CheckSquare className="h-3.5 w-3.5 mr-1" />
                          {isDe ? "Entscheidung fällen" : "Render Decision"}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: LIVE REVIEW TRACKER                                                */}
      {/* ========================================================================= */}
      {activeTab === "tracker" && (
        <Card className="bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-[#272832]">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isDe ? "Gutachten-Tracking" : "Reviewer Progress & Reminders"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isDe ? "Überwachen Sie den Rücklauf der Gutachten und versenden Sie Erinnerungen mit einem Klick." : "Monitor individual reviewer scorecards and dispatch deadline reminders with one click."}
            </p>
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            {manuscripts.filter(m => m.status === "Under Review" || m.status === "Revision Required").map((m) => (
              <div key={m.id} className="p-4 rounded-xl border border-slate-200/90 dark:border-[#272832] bg-white dark:bg-[#131418] space-y-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0b99ff] bg-[#0b99ff]/10 px-2 py-0.5 rounded border border-[#0b99ff]/20 whitespace-nowrap">{m.id}</span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{m.title}</h4>
                  </div>
                  <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-2.5 py-0.5 rounded-full border border-sky-200 dark:border-sky-800 whitespace-nowrap">
                    Cycle Target: 14 Days
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/10 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">Reviewer 1: Dr. Marcus Vance</div>
                      <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Scorecard Complete (Minor Revisions)</div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">100% ✓</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/10 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">Reviewer 2: Prof. Elena Rostova</div>
                      <div className="text-[11px] text-amber-600 font-semibold mt-0.5">Evaluation in Progress (Due in 4 days)</div>
                    </div>
                    {nudgedReviewers.includes(`${m.id}-rev2`) ? (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                        <Check className="h-3.5 w-3.5" /> Nudged (Cc: Desk)
                      </span>
                    ) : (
                      <Button
                        onClick={() => {
                          setNudgedReviewers(prev => [...prev, `${m.id}-rev2`])
                          triggerToast("Official deadline reminder dispatched to Prof. Elena Rostova (Cc: Journal Manager Desk).")
                        }}
                        variant="outline"
                        className="text-xs h-7.5 px-3 border-amber-300 text-amber-700 dark:text-amber-300 hover:bg-amber-100 cursor-pointer"
                      >
                        <Bell className="h-3 w-3 mr-1" />
                        {isDe ? "Erinnern" : "Nudge"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DECISION CENTRAL                                                   */}
      {/* ========================================================================= */}
      {activeTab === "decision" && (
        <Card className="bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-[#272832]">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isDe ? "Entscheidungszentrum" : "Decision Central"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isDe ? "Wählen Sie ein begutachtetes Manuskript aus, um das formelle Entscheidungsschreiben zu erstellen." : "Select an evaluated manuscript to review reviewer feedback and issue a formal publishing decision."}
            </p>
          </div>

          <div className="p-4 sm:p-5 space-y-3">
            {manuscripts.map((m) => (
              <div key={m.id} className="p-4 rounded-xl border border-slate-200/90 dark:border-[#272832] bg-white dark:bg-[#131418] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[#0b99ff] bg-[#0b99ff]/10 px-2 py-0.5 rounded border border-[#0b99ff]/20 whitespace-nowrap">{m.id}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">{m.journal}</span>
                    <span className="text-slate-400">•</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Status: {m.status}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{m.title}</h4>
                  <div className="text-[11px] text-slate-500">Author: {m.authorName || "Dr. Marcus Vance"}</div>
                </div>

                <div className="shrink-0">
                  <Button
                    onClick={() => handleOpenDecisionModal(m)}
                    className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-semibold h-8.5 px-4 cursor-pointer shadow-xs"
                  >
                    <Edit3 className="h-3.5 w-3.5 mr-1.5" />
                    {isDe ? "Entscheidungsbrief erstellen" : "Draft Decision Letter"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: EDITORIAL IMPACT & PERFORMANCE METRICS (FROM USER DASHBOARD DESIGN) */}
      {/* ========================================================================= */}
      {activeTab === "analytics" && (
        <div className="space-y-5">
          {/* Main 4 Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl shadow-xs">
            <div className="space-y-1 pr-4 lg:border-r border-slate-100 dark:border-[#272832]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Total Decisions Rendered
              </span>
              <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
                124 <span className="text-xs font-medium text-slate-500">Papers</span>
              </div>
              <span className="text-xs font-medium text-emerald-600 block">↑ 18% vs previous cycle</span>
            </div>

            <div className="space-y-1 px-0 lg:px-4 lg:border-r border-slate-100 dark:border-[#272832]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Avg. First Decision Speed
              </span>
              <div className="text-2xl font-bold tracking-tight text-[#0b99ff] tabular-nums">
                14.2 <span className="text-xs font-medium text-slate-500">Days</span>
              </div>
              <span className="text-xs font-medium text-slate-500 block">Global Benchmark: 35.0 Days</span>
            </div>

            <div className="space-y-1 pr-4 lg:px-4 lg:border-r border-slate-100 dark:border-[#272832]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Acceptance Ratio
              </span>
              <div className="text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400 tabular-nums">
                24.5% <span className="text-xs font-medium text-slate-500">Selective</span>
              </div>
              <span className="text-xs font-medium text-slate-500 block">High citation caliber</span>
            </div>

            <div className="space-y-1 pl-0 lg:pl-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Editorial Standing
              </span>
              <div className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400 tabular-nums">
                Top 5% <span className="text-xs font-medium text-slate-500">Tier</span>
              </div>
              <span className="text-xs font-medium text-emerald-600 block">Publishing Excellence Award</span>
            </div>
          </div>

          {/* Detailed Resolution Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Desk Triage Reject</span>
                <span className="font-bold text-rose-600">38.0% (47 Papers)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-[#131418] h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: "38%" }} />
              </div>
              <span className="text-[11px] text-slate-400 block">Filtered at initial scope & ethics check</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Post-Review Rejection</span>
                <span className="font-bold text-amber-600">37.5% (46 Papers)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-[#131418] h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: "37.5%" }} />
              </div>
              <span className="text-[11px] text-slate-400 block">Rejected following expert scorecards</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Formal Acceptance</span>
                <span className="font-bold text-emerald-600">24.5% (31 Papers)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-[#131418] h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: "24.5%" }} />
              </div>
              <span className="text-[11px] text-slate-400 block">Published & DOI assigned</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: INTEGRITY & FORENSIC SUITE                                         */}
      {/* ========================================================================= */}
      {activeTab === "integrity" && (
        <Card className="bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-[#272832]">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              {isDe ? "Integritäts- & Forensik-Zentrum" : "Integrity & Forensics Suite"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isDe ? "Automatische Plagiatsprüfung, KI-Erkennung und Bildforensik." : "Automated similarity scans, AI detection, and image forensics."}
            </p>
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/10 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Avg. Similarity Index</span>
                <span className="text-xl font-bold text-emerald-600">4.2%</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Threshold: &lt;15%</span>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/10 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">AI Text Confidence</span>
                <span className="text-xl font-bold text-emerald-600">2.1%</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Threshold: &lt;10%</span>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/10 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Image Forensics</span>
                <span className="text-xl font-bold text-emerald-600">100% Passed</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">No spliced figures</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Desk Manuscript Forensic Clearance Log:</h4>
              {manuscripts.map((m) => (
                <div key={m.id} className="p-3.5 rounded-xl border border-slate-200/80 dark:border-[#272832] bg-slate-50 dark:bg-[#131418] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0b99ff]">{m.id}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{m.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">Author: {m.authorName || "Dr. Marcus Vance"}</div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      Sim: 4% · AI: 2% ✓
                    </span>
                    <Button
                      onClick={() => setSelectedPaperForIntegrity(m)}
                      variant="outline"
                      className="text-xs h-7.5 px-2.5"
                    >
                      Report
                    </Button>
                    <Button
                      onClick={() => setSelectedPaperForImEscalation(m)}
                      variant="outline"
                      className="text-xs h-7.5 px-2.5 border-rose-300 text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 cursor-pointer"
                    >
                      <AlertCircle className="h-3 w-3 mr-1 text-rose-500" />
                      Escalate to IM & JM
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: SPECIAL ISSUES & THEMES                                            */}
      {/* ========================================================================= */}
      {activeTab === "collections" && (
        <Card className="bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-[#272832] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isDe ? "Sonderhefte & Sammlungen" : "Special Collections"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isDe ? "Verwalten Sie thematische Sonderbände und Gastherausgeber-Gremien." : "Manage thematic Call-for-Papers and guest editor panels on trending topics."}
              </p>
            </div>
            <Button
              onClick={() => setIsNewCollectionOpen(true)}
              className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-semibold h-8.5 px-3.5 cursor-pointer shadow-xs shrink-0"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              {isDe ? "Neues Sonderheft" : "+ New Collection"}
            </Button>
          </div>

          <div className="p-4 sm:p-5 space-y-3.5 text-xs">
            {collections.map((col) => (
              <div key={col.id} className="p-4 rounded-xl border border-slate-200/90 dark:border-[#272832] bg-white dark:bg-[#131418] space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0b99ff] uppercase tracking-wider text-[10px] bg-[#0b99ff]/10 px-2 py-0.5 rounded border border-[#0b99ff]/20">
                    {col.id} · Submissions Open
                  </span>
                  <span className="text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 text-[11px]">
                    {col.submissionsCount} Manuscripts Received
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {col.title}
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-xs">
                  {col.description}
                </p>
                <div className="pt-2 border-t border-slate-100 dark:border-[#272832] flex items-center justify-between text-[11px] text-slate-500">
                  <span>Guest Editors: <strong className="text-slate-700 dark:text-slate-300">{col.guestEditors}</strong></span>
                  <span>Deadline: <strong className="text-slate-700 dark:text-slate-300">{col.deadline}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ================= MODAL: EDITORIAL DECISION DRAWER ================= */}
      <Dialog open={!!selectedPaperForDecision} onOpenChange={(open) => !open && setSelectedPaperForDecision(null)}>
        <DialogContent className="bg-white dark:bg-[#18191e] border border-slate-200 dark:border-[#272832] text-slate-900 dark:text-slate-100 sm:max-w-2xl rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-[#0b99ff]" />
              {isDe ? "Formelle redaktionelle Entscheidung formulieren" : "Render Editorial Decision"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {selectedPaperForDecision?.id}: {selectedPaperForDecision?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Verdict Selection */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                {isDe ? "Entscheidungs-Verdikt auswählen:" : "Select Decision Verdict:"}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: "Accept", label: "Accept", color: "text-emerald-600 border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40" },
                  { key: "Minor Revision", label: "Minor Revision", color: "text-[#0b99ff] border-sky-300 bg-sky-50 dark:bg-sky-950/40" },
                  { key: "Major Revision", label: "Major Revision", color: "text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/40" },
                  { key: "Reject", label: "Reject", color: "text-rose-600 border-rose-300 bg-rose-50 dark:bg-rose-950/40" }
                ].map((v) => (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => handleVerdictChange(v.key as any)}
                    className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                      decisionVerdict === v.key ? `${v.color} ring-2 ring-[#0b99ff]/50` : "border-slate-200 dark:border-[#272832] bg-slate-50 dark:bg-[#131418] text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Letter Content with Reviewer Reports Built In */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  {isDe ? "Offizieller Entscheidungsbrief (an Autor versendet):" : "Official Decision Letter (Dispatched to Author):"}
                </label>
                {(decisionVerdict === "Minor Revision" || decisionVerdict === "Major Revision") && (
                  <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    ✓ Anonymized Double-Blind Reviewer Reports Included
                  </span>
                )}
              </div>
              <textarea
                rows={10}
                value={decisionLetter}
                onChange={(e) => setDecisionLetter(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#131418] text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-[#0b99ff] focus:outline-none"
              />
            </div>

            {/* Confidential Notes */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                {isDe ? "Vertrauliche redaktionelle Notizen (nur intern sichtbar):" : "Confidential Editorial Notes (Internal archive only):"}
              </label>
              <input
                type="text"
                value={confidentialNotes}
                onChange={(e) => setConfidentialNotes(e.target.value)}
                placeholder="E.g. Reviewer 1 recommended acceptance subject to figure 4 clarifications."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#131418] text-xs focus:ring-2 focus:ring-[#0b99ff] focus:outline-none"
              />
            </div>
          </div>

          <DialogFooter className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#272832]">
            <Button
              onClick={() => setSelectedPaperForDecision(null)}
              variant="outline"
              className="text-xs h-8.5 cursor-pointer"
            >
              {isDe ? "Abbrechen" : "Cancel"}
            </Button>
            <Button
              onClick={handleSubmitDecision}
              className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-semibold h-8.5 px-4 shadow-xs cursor-pointer"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" />
              {isDe ? "Entscheidung übermitteln" : "Dispatch Decision"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: ASSIGN REVIEWERS ================= */}
      <Dialog open={!!selectedPaperForReviewers} onOpenChange={(open) => !open && setSelectedPaperForReviewers(null)}>
        <DialogContent className="bg-white dark:bg-[#18191e] border border-slate-200 dark:border-[#272832] text-slate-900 dark:text-slate-100 sm:max-w-lg rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-[#0b99ff]" />
              {isDe ? "Fachgutachter für Peer-Review auswählen" : "Select Peer Reviewers for Manuscript"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {selectedPaperForReviewers?.id}: {selectedPaperForReviewers?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300">
              Auto-matched reviewers based on abstract keywords: <em>Cardiology, Diagnostics, AI Imaging</em>
            </div>

            <div className="space-y-2">
              {["Dr. Marcus Vance (Match: 98% · Active: 2/3)", "Prof. Elena Rostova (Match: 94% · Active: 1/2)", "Dr. Tobias Becker (Match: 91% · Active: 3/3)"].map((revName, idx) => {
                const pureName = revName.split(" (")[0]
                const isSelected = selectedReviewerNames.includes(pureName)
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedReviewerNames(prev =>
                        isSelected ? prev.filter(n => n !== pureName) : [...prev, pureName]
                      )
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected ? "border-[#0b99ff] bg-[#0b99ff]/10" : "border-slate-200 dark:border-[#272832] bg-white dark:bg-[#131418]"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{pureName}</div>
                      <div className="text-[11px] text-slate-500">{revName.split(" (")[1]?.replace(")", "")}</div>
                    </div>
                    <input type="checkbox" checked={isSelected} readOnly className="rounded text-[#0b99ff]" />
                  </div>
                )
              })}
            </div>
          </div>

          <DialogFooter className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#272832]">
            <Button
              onClick={() => setSelectedPaperForReviewers(null)}
              variant="outline"
              className="text-xs h-8.5 cursor-pointer"
            >
              {isDe ? "Abbrechen" : "Cancel"}
            </Button>
            <Button
              onClick={handleAssignReviewersSubmit}
              className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-semibold h-8.5 px-4 shadow-xs cursor-pointer"
            >
              {isDe ? "Einladungen absenden" : "Dispatch Invitations"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: DETAIL INSPECT ================= */}
      <Dialog open={!!selectedPaperForDetail} onOpenChange={(open) => !open && setSelectedPaperForDetail(null)}>
        <DialogContent className="bg-white dark:bg-[#18191e] border border-slate-200 dark:border-[#272832] text-slate-900 dark:text-slate-100 sm:max-w-xl rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
              {selectedPaperForDetail?.id}: {selectedPaperForDetail?.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {selectedPaperForDetail?.journal} · Submitted {selectedPaperForDetail?.date}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-200 dark:border-[#272832] space-y-1.5">
              <div><strong>Author:</strong> {selectedPaperForDetail?.authorName || "Dr. Marcus Vance"}</div>
              <div><strong>Institution:</strong> {selectedPaperForDetail?.authorAffiliation || "Charité – Universitätsmedizin Berlin"}</div>
              <div><strong>Status:</strong> <span className="font-bold text-[#0b99ff]">{selectedPaperForDetail?.status}</span></div>
            </div>

            <div className="space-y-1">
              <strong className="text-slate-700 dark:text-slate-300">Abstract:</strong>
              <p className="text-slate-600 dark:text-slate-300 italic leading-relaxed bg-slate-50 dark:bg-[#131418] p-3 rounded-xl border border-slate-200 dark:border-[#272832] text-[11px]">
                {selectedPaperForDetail?.abstract || "This study demonstrates automated, reproducible methodologies for clinical trial evaluation and open data integrity verification."}
              </p>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#272832]">
            <Button
              onClick={() => setSelectedPaperForDetail(null)}
              className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-semibold h-8.5 px-4 cursor-pointer"
            >
              {isDe ? "Schließen" : "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: INTEGRITY PRE-SCAN INSPECTOR ================= */}
      <Dialog open={!!selectedPaperForIntegrity} onOpenChange={(open) => !open && setSelectedPaperForIntegrity(null)}>
        <DialogContent className="bg-white dark:bg-[#18191e] border border-slate-200 dark:border-[#272832] text-slate-900 dark:text-slate-100 sm:max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              Automated Integrity & Forensic Report
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Manuscript ID: {selectedPaperForIntegrity?.id}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Similarity Index</span>
                <span className="text-lg font-bold text-emerald-600">4% (Clear)</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">AI Text Prob.</span>
                <span className="text-lg font-bold text-emerald-600">2% (Human)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-200 dark:border-[#272832] space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Figure Image Forensics:</span>
                <span className="font-bold text-emerald-600">No manipulation detected ✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">COPE Ethics Declaration:</span>
                <span className="font-bold text-emerald-600">Verified ✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Competing Interests:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">None Declared ✓</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-[#272832]">
            <Button
              onClick={() => {
                const paper = selectedPaperForIntegrity
                setSelectedPaperForIntegrity(null)
                if (paper) setSelectedPaperForImEscalation(paper)
              }}
              variant="outline"
              className="text-xs h-8.5 px-3 border-rose-300 text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 cursor-pointer"
            >
              <AlertCircle className="h-3.5 w-3.5 mr-1 text-rose-500" />
              Escalate to IM & JM
            </Button>
            <Button
              onClick={() => setSelectedPaperForIntegrity(null)}
              className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-semibold h-8.5 px-4 cursor-pointer"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: ESCALATE TO INTEGRITY MANAGER (IM) ================= */}
      <Dialog open={!!selectedPaperForImEscalation} onOpenChange={(open) => !open && setSelectedPaperForImEscalation(null)}>
        <DialogContent className="bg-white dark:bg-[#18191e] border border-slate-200 dark:border-[#272832] text-slate-900 dark:text-slate-100 sm:max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-rose-600" />
              Escalate Misconduct Case to IM & JM
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Formally refer {selectedPaperForImEscalation?.id} to Research Integrity Officer (IM: Dr. Helen Vance) with CC to Journal Manager Desk (JM: scholarlyopen@gmail.com).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-300 space-y-1">
              <strong className="block font-bold">COPE Protocol Administrative Action:</strong>
              <span>This action places the manuscript on formal investigation hold while the Research Integrity Unit conducts forensic verification.</span>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Misconduct / Breach Category *</label>
              <select
                value={escalationReason}
                onChange={(e) => setEscalationReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#131418] text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                <option value="plagiarism">Severe Text Plagiarism / Duplicate Publication (&gt;20%)</option>
                <option value="papermill">Suspected Paper Mill / Fabricated Data Patterns</option>
                <option value="ai_unauthorized">Undisclosed AI Synthetic Text Generation</option>
                <option value="image_manipulation">Western Blot / Microscopy Figure Manipulation</option>
                <option value="authorship_coi">Ghost Authorship / Undisclosed Competing Interest</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Editor Evidence / Investigation Notes *</label>
              <textarea
                rows={3}
                required
                value={escalationNotes}
                onChange={(e) => setEscalationNotes(e.target.value)}
                placeholder="E.g. Figure 3 Western blot lanes 2 and 4 show duplicated background noise. High overlap with PMC8921102."
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#131418] text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-200 dark:border-[#272832] text-[11px] text-slate-500 space-y-0.5">
              <div>• <strong>Integrity Lead:</strong> Dr. Helen Vance (Research Integrity Manager)</div>
              <div>• <strong>Publishing Desk:</strong> Journal Manager (scholarlyopen@gmail.com)</div>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#272832]">
            <Button
              onClick={() => setSelectedPaperForImEscalation(null)}
              variant="outline"
              className="text-xs h-8.5 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedPaperForImEscalation) {
                  const updated = manuscripts.map(m => m.id === selectedPaperForImEscalation.id ? { ...m, status: "Under Integrity Investigation" as any } : m)
                  setManuscripts(updated)
                  if (onUpdateManuscriptStatus) onUpdateManuscriptStatus(selectedPaperForImEscalation.id, "Under Integrity Investigation" as any)
                }
                triggerToast("Case escalated to Integrity Manager (Dr. Helen Vance) and Journal Manager Desk. Integrity hold applied.")
                setSelectedPaperForImEscalation(null)
                setEscalationNotes("")
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold h-8.5 px-4 shadow-xs cursor-pointer"
            >
              <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
              Escalate to IM & JM
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: JM ASSISTANCE REQUEST ================= */}
      <Dialog open={!!selectedPaperForJmHelp} onOpenChange={(open) => !open && setSelectedPaperForJmHelp(null)}>
        <DialogContent className="bg-white dark:bg-[#18191e] border border-slate-200 dark:border-[#272832] text-slate-900 dark:text-slate-100 sm:max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-[#0b99ff]" />
              Request Journal Manager Assistance
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Notify the in-house Publishing Desk (scholarlyopen@gmail.com) for {selectedPaperForJmHelp?.id}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Assistance Task:</label>
              <select
                value={jmHelpType}
                onChange={(e) => setJmHelpType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#131418] text-xs focus:ring-2 focus:ring-[#0b99ff] focus:outline-none"
              >
                <option value="chase_reviewers">Send Official JM Reminder to Overdue Reviewers</option>
                <option value="find_reviewers">Recommend Additional Reviewers from Global Pool</option>
                <option value="format_check">Request Author Technical & Figure Sanitization</option>
                <option value="apc_check">Verify Institutional APC Waiver & Funding</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Optional Editorial Notes:</label>
              <textarea
                rows={3}
                value={jmHelpNote}
                onChange={(e) => setJmHelpNote(e.target.value)}
                placeholder="E.g. Reviewer 2 is 4 days overdue, please send priority reminder."
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#131418] text-xs focus:ring-2 focus:ring-[#0b99ff] focus:outline-none"
              />
            </div>
          </div>

          <DialogFooter className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#272832]">
            <Button
              onClick={() => setSelectedPaperForJmHelp(null)}
              variant="outline"
              className="text-xs h-8.5 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                triggerToast(`Request dispatched to Journal Manager Desk (scholarlyopen@gmail.com)`)
                setSelectedPaperForJmHelp(null)
              }}
              className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-semibold h-8.5 px-4 shadow-xs cursor-pointer"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" />
              Dispatch to Desk
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: CREATE NEW SPECIAL COLLECTION ================= */}
      <Dialog open={isNewCollectionOpen} onOpenChange={setIsNewCollectionOpen}>
        <DialogContent className="bg-white dark:bg-[#18191e] border border-slate-200 dark:border-[#272832] text-slate-900 dark:text-slate-100 sm:max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderPlus className="h-4 w-4 text-[#0b99ff]" />
              {isDe ? "Neues thematisches Sonderheft anlegen" : "Create New Special Collection"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {isDe ? "Veröffentlichen Sie einen neuen Call for Papers für Ihre Zeitschrift." : "Launch and publish a new Call-for-Papers and invite guest editor submissions."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateCollectionSubmit} className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                {isDe ? "Titel des Sonderhefts *" : "Collection Title *"}
              </label>
              <input
                type="text"
                required
                value={newCollectionTitle}
                onChange={(e) => setNewCollectionTitle(e.target.value)}
                placeholder="E.g. AI Innovations in Oncological Image Processing"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#131418] text-xs focus:ring-2 focus:ring-[#0b99ff] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                {isDe ? "Zielzeitschrift *" : "Host Journal *"}
              </label>
              <select
                value={newCollectionJournal}
                onChange={(e) => setNewCollectionJournal(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#131418] text-xs focus:ring-2 focus:ring-[#0b99ff] focus:outline-none"
              >
                <option value="Scholarly Open: Medicine & Applied Sciences">Scholarly Open: Medicine & Applied Sciences</option>
                <option value="Scholarly Open: Engineering & Applied Sciences">Scholarly Open: Engineering & Applied Sciences</option>
                <option value="Scholarly Open: Social Sciences & Humanities">Scholarly Open: Social Sciences & Humanities</option>
                <option value="Scholarly Open: Decarbonization & Clean Tech">Scholarly Open: Decarbonization & Clean Tech</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  {isDe ? "Gastherausgeber *" : "Guest Editors *"}
                </label>
                <input
                  type="text"
                  required
                  value={newCollectionGuestEditors}
                  onChange={(e) => setNewCollectionGuestEditors(e.target.value)}
                  placeholder="Prof. Aris Thorne, Dr. Jane Smith"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#131418] text-xs focus:ring-2 focus:ring-[#0b99ff] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  {isDe ? "Einreichungsfrist *" : "Submission Deadline *"}
                </label>
                <input
                  type="date"
                  required
                  value={newCollectionDeadline}
                  onChange={(e) => setNewCollectionDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#131418] text-xs focus:ring-2 focus:ring-[#0b99ff] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                {isDe ? "Thematische Beschreibung / Call for Papers:" : "Theme Scope & Call-for-Papers Description:"}
              </label>
              <textarea
                rows={3}
                value={newCollectionDesc}
                onChange={(e) => setNewCollectionDesc(e.target.value)}
                placeholder="Describe scope, targeted methodologies, and submission criteria..."
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#131418] text-xs focus:ring-2 focus:ring-[#0b99ff] focus:outline-none"
              />
            </div>

            <DialogFooter className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#272832]">
              <Button
                type="button"
                onClick={() => setIsNewCollectionOpen(false)}
                variant="outline"
                className="text-xs h-8.5 cursor-pointer"
              >
                {isDe ? "Abbrechen" : "Cancel"}
              </Button>
              <Button
                type="submit"
                className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-semibold h-8.5 px-4 shadow-xs cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                {isDe ? "Sonderheft veröffentlichen" : "Publish Collection"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  )
}
