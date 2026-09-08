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
  ArrowLeft,
  Download, 
  Send, 
  Eye, 
  SlidersHorizontal, 
  CheckCircle2, 
  Plus, 
  MessageSquareOff, 
  Bell, 
  ShieldCheck, 
  ShieldAlert,
  AlertCircle, 
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
  UserCheck,
  UserPlus,
  Files,
  Coins
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { JmManuscript, JmReviewer } from "./journal-manager-workspace"
import { CrossDeskActivityFeed, CrossDeskNotification } from "./cross-desk-activity-feed"
import { generateBrandedEmailHtml } from "@/lib/email-templates"

interface EditorWorkspaceProps {
  language: "en" | "de"
  activeTab?: string
  onTabChange?: (tab: string) => void
  manuscripts: JmManuscript[]
  onUpdateManuscriptStatus?: (paperId: string, newStatus: JmManuscript["status"]) => void
  integrityAlerts?: any[]
  onResolveIntegrity?: (alertId: string, action: "clear" | "escalate") => void
  notifications?: any[]
  onAddNotification?: (notif: any) => void
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

function getEthicsDecisionLetterTemplate(
  action: "inquiry" | "raw_data" | "clear" | "desk_reject",
  alert: any,
  editorName: string,
  journal: string
): string {
  const paperId = alert?.paperId || "MANUSCRIPT"
  const title = alert?.title || "Submitted Manuscript"
  const cleanJournal = journal || "Scholarly Open"
  const notes = alert?.escalationNotes || "Forensic indicators flagged by Research Integrity Office."
  const modality = alert?.type || "Integrity Review"
  const score = alert?.score || "Flagged"

  if (action === "desk_reject") {
    return `Dear Corresponding Author,

Manuscript ID: ${paperId}
Title: "${title}"
Journal: ${cleanJournal}

Thank you for your submission to ${cleanJournal}.

Following formal editorial triage and forensic analysis conducted by our Research Integrity Office, significant ethical concerns were identified regarding ${modality} (${score}).

In accordance with Committee on Publication Ethics (COPE) guidelines and our journal policies, we regret to inform you that your manuscript cannot be accepted and has been desk-rejected.

Investigator Summary:
${notes}

This editorial decision is final.

Sincerely,
${editorName}
Editor-in-Chief, ${cleanJournal}`
  }

  if (action === "raw_data") {
    return `Dear Corresponding Author,

Manuscript ID: ${paperId}
Title: "${title}"
Journal: ${cleanJournal}

Thank you for submitting your manuscript to ${cleanJournal}.

In accordance with our Open Science Data Integrity policy and editorial triage protocols, our Research Integrity Office requires original, uncropped, and unprocessed raw data files corresponding to the experiments in your manuscript.

Specific Request:
${notes}

Please upload the complete raw data packages directly to the submission portal within 14 calendar days.

Sincerely,
${editorName}
Editor-in-Chief, ${cleanJournal}`
  }

  if (action === "inquiry") {
    return `Dear Corresponding Author,

Manuscript ID: ${paperId}
Title: "${title}"
Journal: ${cleanJournal}

During pre-publication screening of your manuscript for ${cleanJournal}, our Research Integrity Office identified areas requiring formal author clarification regarding ${modality} (${score}).

Summary of Findings:
${notes}

Please provide a formal written explanation and itemized response to these points within 14 calendar days via the editorial portal.

Sincerely,
${editorName}
Editor-in-Chief, ${cleanJournal}`
  }

  return ""
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
  integrityAlerts = [],
  onResolveIntegrity,
  notifications = [],
  onAddNotification,
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
  const [selectedStageFilter, setSelectedStageFilter] = useState<"all" | "triage" | "review" | "revision" | "decision" | "integrity">("all")
  const [reviewSubFilter, setReviewSubFilter] = useState<"all" | "ready" | "in_progress">("all")

  // EiC IM Escalation Review Modal State
  const [selectedEscalationAlert, setSelectedEscalationAlert] = useState<any | null>(null)
  const [eicDecisionAction, setEicDecisionAction] = useState<"inquiry" | "raw_data" | "clear" | "desk_reject">("inquiry")
  const [eicDecisionComment, setEicDecisionComment] = useState<string>("")
  const [eicRulingLetter, setEicRulingLetter] = useState<string>("")

  const handleOpenEscalationAlert = (alert: any) => {
    setSelectedEscalationAlert(alert)
    const initialAction = alert?.escalationRecommendation === "desk_reject" ? "desk_reject" : alert?.escalationRecommendation === "raw_data" ? "raw_data" : "inquiry"
    setEicDecisionAction(initialAction)
    setEicRulingLetter(getEthicsDecisionLetterTemplate(initialAction, alert, user.name, alert.journal || user.journal))
  }

  // Selected paper for decision
  const [selectedPaperForDecision, setSelectedPaperForDecision] = useState<JmManuscript | null>(null)
  const [decisionVerdict, setDecisionVerdict] = useState<EditorialDecisionDraft["verdict"]>("Minor Revision")
  const [decisionLetter, setDecisionLetter] = useState(getDecisionLetterTemplate("Minor Revision", user.name, user.journal))
  const [decisionSubject, setDecisionSubject] = useState("")
  const [decisionAuthorEmail, setDecisionAuthorEmail] = useState("")
  const [isDecisionSending, setIsDecisionSending] = useState(false)
  const [decisionTab, setDecisionTab] = useState<"edit" | "preview">("edit")
  const [confidentialNotes, setConfidentialNotes] = useState("")
  const [expandedReviewerScorecard, setExpandedReviewerScorecard] = useState<"rev1" | "rev2" | null>(null)

  // Selected paper for Reviewer Assignment
  const [selectedPaperForReviewers, setSelectedPaperForReviewers] = useState<JmManuscript | null>(null)
  const [selectedReviewerNames, setSelectedReviewerNames] = useState<string[]>(["Dr. Marcus Vance"])
  const [reviewerSourceTab, setReviewerSourceTab] = useState<"matched" | "suggested" | "external">("matched")
  const [customRevName, setCustomRevName] = useState("")
  const [customRevEmail, setCustomRevEmail] = useState("")
  const [customRevAffiliation, setCustomRevAffiliation] = useState("")
  const [externalReviewersList, setExternalReviewersList] = useState<{name: string, email: string, affiliation: string}[]>([])
  const [editingReviewerIndex, setEditingReviewerIndex] = useState<number | null>(null)

  // Assign Reviewer Invitation Email Template State
  const [assignEmailSubject, setAssignEmailSubject] = useState("")
  const [assignEmailBody, setAssignEmailBody] = useState("")
  const [assignEmailTab, setAssignEmailTab] = useState<"edit" | "preview">("edit")
  const [isAssignSending, setIsAssignSending] = useState(false)

  // Live Reviewer Progress Popup Modal State
  const [selectedPaperForReviewTracking, setSelectedPaperForReviewTracking] = useState<JmManuscript | null>(null)
  const [isTrackerScorecardExpanded, setIsTrackerScorecardExpanded] = useState(false)

  // Revision Evaluation Studio State
  const [selectedRevisionForEvaluation, setSelectedRevisionForEvaluation] = useState<JmManuscript | null>(null)
  const [revisionTab, setRevisionTab] = useState<"rebuttal" | "diff" | "reports">("rebuttal")

  // OpenAI / Global Scholars Sourcing Engine State
  const [isSearchingOpenAI, setIsSearchingOpenAI] = useState(false)
  const [openAiResults, setOpenAiResults] = useState<any[] | null>(null)
  const [openAiCustomTopic, setOpenAiCustomTopic] = useState("")
  const [openAiDomainTopics, setOpenAiDomainTopics] = useState<string[]>([])
  const [openAiSourceInfo, setOpenAiSourceInfo] = useState<string>("")

  const handleFetchOpenAiReviewers = async (paper: JmManuscript, customTopic?: string) => {
    setIsSearchingOpenAI(true)
    try {
      const res = await fetch("/api/editorial360/match-reviewers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: paper.title,
          abstract: paper.abstract,
          keywords: paper.keywords,
          authorName: paper.authorName,
          authorAffiliation: paper.authorAffiliation,
          journal: paper.journal,
          query: customTopic || openAiCustomTopic
        })
      })
      if (res.ok) {
        const data = await res.json()
        setOpenAiResults(data.reviewers || [])
        setOpenAiDomainTopics(data.domainTopics || [])
        setOpenAiSourceInfo(data.source || "Global Scholars Graph")
        triggerToast("✓ Global scholars search completed.")
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsSearchingOpenAI(false)
    }
  }

  // Detail Drawer / Full Article & Dossier Inspector
  const [selectedPaperForDetail, setSelectedPaperForDetail] = useState<JmManuscript | null>(null)
  const [inspectTab, setInspectTab] = useState<"article" | "files" | "cover_letter" | "compliance">("article")

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
      confirmButtonLabel: config.confirmButtonLabel || (isDe ? "Ja, Fortfahren" : "Yes, Proceed"),
      confirmColorClass: config.confirmColorClass || "bg-[#0b99ff] hover:bg-[#0088e0]",
      onConfirm: config.onConfirm
    })
  }

  const [newCollectionTitle, setNewCollectionTitle] = useState("")
  const [newCollectionJournal, setNewCollectionJournal] = useState(user.journal || "Scholarly Open: Medicine & Applied Sciences")
  const [newCollectionGuestEditors, setNewCollectionGuestEditors] = useState("")
  const [newCollectionDeadline, setNewCollectionDeadline] = useState("2026-12-31")
  const [newCollectionDesc, setNewCollectionDesc] = useState("")

  // Reviewer Audit & Dynamic Honorarium Scoring State
  const [scoringReviewerData, setScoringReviewerData] = useState<{
    paperId: string
    paperTitle: string
    reviewerKey: string
    reviewerName: string
    recommendation: string
    submissionDate: string
    paymentMethod: "Wise" | "PayPal" | "Payoneer"
    paymentAccount: string
    rigorScore: number
    editorNotes: string
  } | null>(null)

  const [approvedHonoraria, setApprovedHonoraria] = useState<Record<string, {
    score: number
    amount: number
    paymentMethod: "Wise" | "PayPal" | "Payoneer"
    paymentAccount: string
    approvedAt: string
  }>>({
    "SOEAS-26-RS102-rev1": {
      score: 95,
      amount: 46.25,
      paymentMethod: "Wise",
      paymentAccount: "vance.retina@u-tokyo.ac.jp",
      approvedAt: "2026-06-08"
    }
  })

  // Dynamic formula: Base €35 at 80% score, scaled to €50 maximum cap at 100% score; below 80% is 0
  const calculateReviewerHonorarium = (score: number): number => {
    if (score < 80) return 0
    const calculated = 35 + ((score - 80) / 20) * 15
    return Math.min(50, Math.round(calculated * 100) / 100)
  }

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Filter counts (Synchronized 1:1 with Journal Manager Workspace)
  const triageCount = manuscripts.filter(m => m.status === "Awaiting Initial Check" || m.status === "Submitted" || m.status === "Draft").length
  const reviewCount = manuscripts.filter(m => m.status === "Under Review").length
  const revisionCount = manuscripts.filter(m => m.status === "Revision Required" || m.status === "Revision Under Evaluation").length
  const decisionCount = manuscripts.filter(m => m.status === "Accepted" || m.status === "Rejected").length

  const readyForVerdictCount = manuscripts.filter(m => m.status === "Under Review" && (m.id === "SOEAS-26-RS102" || (m.reviewers && m.reviewers.length > 1 && m.reviewers.every(r => r === "Dr. Evelyn Vane" || r === "Dr. Marcus Vance")))).length
  const inProgressReviewCount = manuscripts.filter(m => m.status === "Under Review" && !(m.id === "SOEAS-26-RS102" || (m.reviewers && m.reviewers.length > 1 && m.reviewers.every(r => r === "Dr. Evelyn Vane" || r === "Dr. Marcus Vance")))).length
  const escalatedPaperIds = (integrityAlerts || []).filter(a => a.status === "Escalated").map(a => a.paperId)
  const integrityCount = manuscripts.filter(m => escalatedPaperIds.includes(m.id) || m.integrityStatus === "Flagged" || (Number(m.plagiarismScore) > 15) || (Number(m.aiScore) > 30)).length
  const escalatedCount = integrityCount

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
      matchesStage = m.status === "Under Review"
      if (matchesStage && reviewSubFilter === "ready") {
        matchesStage = m.id === "SOEAS-26-RS102" || (m.reviewers && m.reviewers.length > 1 && m.reviewers.every(r => r === "Dr. Evelyn Vane" || r === "Dr. Marcus Vance"))
      } else if (matchesStage && reviewSubFilter === "in_progress") {
        matchesStage = !(m.id === "SOEAS-26-RS102" || (m.reviewers && m.reviewers.length > 1 && m.reviewers.every(r => r === "Dr. Evelyn Vane" || r === "Dr. Marcus Vance")))
      }
    } else if (selectedStageFilter === "revision") {
      matchesStage = m.status === "Revision Required" || m.status === "Revision Under Evaluation"
    } else if (selectedStageFilter === "decision") {
      matchesStage = m.status === "Accepted" || m.status === "Rejected"
    } else if (selectedStageFilter === "integrity" || (selectedStageFilter as string) === "ethics") {
      matchesStage = Boolean(escalatedPaperIds.includes(m.id) || m.integrityStatus === "Flagged" || (Number(m.plagiarismScore) > 15) || (Number(m.aiScore) > 30))
    }

    return matchesJournal && matchesSearch && matchesStage
  })

  const getDecisionSubject = (v: string, paperId: string, paperTitle: string) => {
    if (v === "Accept") return `Formal Acceptance Notice: ${paperId} - ${paperTitle}`
    if (v === "Minor Revision") return `Editorial Decision: Minor Revision Required for ${paperId}`
    if (v === "Major Revision" || v === "Reject & Resubmit") return `Editorial Decision: Major Revisions Required for ${paperId}`
    return `Editorial Decision: ${paperId} - ${paperTitle}`
  }

  // Handlers
  const handleOpenDecisionModal = (paper: JmManuscript) => {
    setSelectedPaperForDecision(paper)
    setDecisionVerdict("Minor Revision")
    setDecisionLetter(getDecisionLetterTemplate("Minor Revision", user.name, paper.journal || user.journal))
    setDecisionSubject(getDecisionSubject("Minor Revision", paper.id, paper.title))
    setDecisionAuthorEmail(paper.authorEmail || "author@university.edu")
    setConfidentialNotes("")
    setDecisionTab("edit")
  }

  const handleVerdictChange = (v: EditorialDecisionDraft["verdict"]) => {
    setDecisionVerdict(v)
    const templateKey = v === "Reject & Resubmit" ? "Major Revision" : v
    setDecisionLetter(getDecisionLetterTemplate(templateKey, user.name, selectedPaperForDecision?.journal || user.journal))
    if (selectedPaperForDecision) {
      setDecisionSubject(getDecisionSubject(v, selectedPaperForDecision.id, selectedPaperForDecision.title))
    }
  }

  const handleSubmitDecision = async () => {
    if (!selectedPaperForDecision) return

    setIsDecisionSending(true)
    const paperId = selectedPaperForDecision.id
    const journalName = selectedPaperForDecision.journal || user.journal
    const authorEmail = decisionAuthorEmail || selectedPaperForDecision.authorEmail || "author@university.edu"
    const authorName = selectedPaperForDecision.authorName || "Author"

    let nextStatus: JmManuscript["status"] = "Under Review"
    if (decisionVerdict === "Accept") nextStatus = "Accepted"
    else if (decisionVerdict === "Minor Revision" || decisionVerdict === "Major Revision" || decisionVerdict === "Reject & Resubmit") nextStatus = "Revision Required"
    else if (decisionVerdict === "Reject") nextStatus = "Rejected"

    const updated = manuscripts.map(m => {
      if (m.id === paperId) {
        return { ...m, status: nextStatus }
      }
      return m
    })
    setManuscripts(updated)
    if (onUpdateManuscriptStatus) onUpdateManuscriptStatus(paperId, nextStatus)

    // Generate branded HTML for the edited decision letter
    const renderedHtml = generateBrandedEmailHtml({
      subject: decisionSubject,
      bodyText: decisionLetter,
      actionLabel: decisionVerdict === "Accept" ? "View Publication Dossier" : "Submit Revised Manuscript",
      actionUrl: "https://www.scholarlyopen.org/editorial360",
      journal: journalName,
      paperId,
      paperTitle: selectedPaperForDecision.title,
      recipientName: authorName
    })

    // Dispatch email via SMTP
    await fetch("/api/editorial360/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: authorEmail,
        customSubject: decisionSubject,
        customHtml: renderedHtml,
        journal: journalName,
        paperId,
        paperTitle: selectedPaperForDecision.title,
        recipientName: authorName
      })
    }).catch(e => console.error("Decision email dispatch error:", e))

    setIsDecisionSending(false)
    triggerToast(isDe ? `Redaktionelle Entscheidung '${decisionVerdict}' erfolgreich per E-Mail übermittelt!` : `Editorial decision '${decisionVerdict}' dispatched via email to author!`)
    setSelectedPaperForDecision(null)
  }

  const onTriggerSubmitDecision = () => {
    if (!selectedPaperForDecision) return
    triggerConfirm({
      title: isDe ? "Redaktionelle Entscheidung bestätigen?" : "Confirm Editorial Decision & Email Dispatch?",
      message: isDe
        ? `Möchten Sie die Entscheidung '${decisionVerdict}' für Manuskript ${selectedPaperForDecision.id} offiziell bestätigen und den Entscheidungsbrief direkt an ${decisionAuthorEmail || selectedPaperForDecision.authorEmail || "den Autor"} versenden?`
        : `Are you sure you want to finalize the '${decisionVerdict}' decision for manuscript ${selectedPaperForDecision.id} and dispatch this email letter to ${decisionAuthorEmail || selectedPaperForDecision.authorEmail || "author"}?`,
      confirmButtonLabel: isDe ? "Ja, Entscheidung & E-Mail versenden" : "Yes, Dispatch Decision & Email",
      confirmColorClass: "bg-[#0b99ff] hover:bg-[#0088e0]",
      onConfirm: handleSubmitDecision
    })
  }

  const handleOpenReviewersModal = (paper: JmManuscript) => {
    setSelectedPaperForReviewers(paper)
    const defaultRevs = paper.reviewers && paper.reviewers.length > 0 ? paper.reviewers : ["Dr. Marcus Vance", "Prof. Elena Rostova"]
    setSelectedReviewerNames(defaultRevs)
    const initialSubject = `Review Invitation: ${paper.id} - ${paper.title}`
    const initialBody = `Dear {{recipientName}},

You have been invited to serve as an expert peer reviewer for the following manuscript submitted to ${paper.journal || user.journal}:

Manuscript ID: ${paper.id}
Title: ${paper.title}

We would be grateful if you could provide your expert assessment on the originality, methodology, and data integrity of this work. This evaluation is conducted under double-blind peer review standards in full compliance with COPE guidelines.

We kindly request that you complete your evaluation within 14 calendar days of acceptance.

Please use the buttons below to access your reviewer scorecard or confirm your availability.`

    setAssignEmailSubject(initialSubject)
    setAssignEmailBody(initialBody)
    setAssignEmailTab("edit")
  }

  const handleAssignReviewersSubmit = async () => {
    if (!selectedPaperForReviewers) return
    setIsAssignSending(true)
    const paper = selectedPaperForReviewers
    const paperId = paper.id
    const journalName = paper.journal || user.journal

    const updated = manuscripts.map(m => {
      if (m.id === paperId) {
        return {
          ...m,
          status: "Under Review" as const,
          reviewers: selectedReviewerNames
        }
      }
      return m
    })
    setManuscripts(updated)
    if (onUpdateManuscriptStatus) onUpdateManuscriptStatus(paperId, "Under Review")

    // Dispatch customized review invitation emails
    await Promise.all(selectedReviewerNames.map(async (revName) => {
      const extRev = externalReviewersList.find(x => x.name === revName)
      const targetEmail = extRev ? extRev.email : "reviewer@scholarlyopen.org"
      const personalizedBody = assignEmailBody.replace(/\{\{recipientName\}\}/g, revName)

      const renderedHtml = generateBrandedEmailHtml({
        subject: assignEmailSubject,
        bodyText: personalizedBody,
        actionLabel: "Accept Review Invitation",
        actionUrl: "https://www.scholarlyopen.org/editorial360",
        secondaryActionLabel: "Decline Invitation",
        secondaryActionUrl: "https://www.scholarlyopen.org/editorial360?action=decline",
        journal: journalName,
        paperId: paperId,
        paperTitle: paper.title,
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
          paperId: paperId,
          paperTitle: paper.title,
          journal: journalName
        })
      }).catch(e => console.error("Editor assign email dispatch error:", e))
    }))

    setIsAssignSending(false)
    triggerToast(isDe ? "Gutachter-Einladungen erfolgreich versendet!" : "Peer reviewer invitations dispatched!")
    setSelectedPaperForReviewers(null)
  }

  const onTriggerAssignReviewers = () => {
    if (!selectedPaperForReviewers) return
    triggerConfirm({
      title: isDe ? "Gutachter-Einladungen bestätigen?" : "Confirm Reviewer Invitations?",
      message: isDe
        ? `Möchten Sie die Einladungen zur Begutachtung an ${selectedReviewerNames.join(", ")} für Manuskript ${selectedPaperForReviewers.id} versenden?`
        : `Are you sure you want to dispatch review invitations to ${selectedReviewerNames.join(", ")} for manuscript ${selectedPaperForReviewers.id}?`,
      confirmButtonLabel: isDe ? "Ja, Einladungen senden" : "Yes, Dispatch Invitations",
      confirmColorClass: "bg-[#0b99ff] hover:bg-[#0088e0]",
      onConfirm: handleAssignReviewersSubmit
    })
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
      {/* 1. CLEAN EDITOR IDENTITY & DESK PROFILE (NO DUPLICATE ORCID / STATS)      */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-2xl border border-slate-200/90 dark:border-[#272832] bg-white dark:bg-[#18191e] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative h-13 w-13 rounded-2xl overflow-hidden bg-gradient-to-tr from-[#0b99ff] to-[#0077cc] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-md ring-2 ring-slate-200 dark:ring-[#272832]">
              <span>{user.name ? user.name.replace(/^Prof\.\s*|^Dr\.\s*/i, '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : "AT"}</span>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight">
                  {user.name}
                </h2>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#0b99ff]/10 text-[#0b99ff] border border-[#0b99ff]/20">
                  {user.title || (isDe ? "Leitender Herausgeber" : "Professor & Editor-in-Chief")}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{user.journal}</span>
                <span className="text-slate-300 dark:text-slate-700 select-none">|</span>
                <span>{user.institution || "Charité – Universitätsmedizin Berlin"}{user.country ? ` (${user.country})` : ""}</span>
                <span className="text-slate-300 dark:text-slate-700 select-none">|</span>
                <span className="text-[#0b99ff] font-medium">{user.email}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {isDe ? "Redaktion aktiv" : "Active Desk"}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 0. IM ETHICS ESCALATION ALERT BANNER                                      */}
      {/* ========================================================================= */}
      {(() => {
        const escalatedAlerts = (integrityAlerts || []).filter(a => a.status === "Escalated")
        if (escalatedAlerts.length === 0) return null
        return (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-500/10 via-amber-500/10 to-red-500/10 border border-red-200 dark:border-red-900/50 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 shrink-0">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    {isDe ? "Ethik-Eskalation" : "Integrity Escalation"}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white">
                    {escalatedAlerts.length} {escalatedAlerts.length === 1 ? "Case" : "Cases"}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Dr. Helen Vance (IM) has submitted confidential forensic findings requiring Editor-in-Chief ruling.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                onClick={() => handleOpenEscalationAlert(escalatedAlerts[0])}
                className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold h-8 px-3.5 cursor-pointer shadow-xs"
              >
                Review IM Brief
              </Button>
            </div>
          </div>
        )
      })()}

      {/* ========================================================================= */}
      {/* 1. COMPACT 4-STAT METRIC STRIP (JM-STYLE CLEAN ROW)                       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl shadow-xs">
        <div className="space-y-1 pr-4 lg:border-r border-slate-100 dark:border-[#272832]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Submissions
          </span>
          <div className="text-lg font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
            {manuscripts.length} <span className="text-xs font-medium text-slate-500">Total Papers</span>
          </div>
          <span className="text-xs font-medium text-slate-500 block">Assigned editorial portfolio</span>
        </div>

        <div className="space-y-1 px-0 lg:px-4 lg:border-r border-slate-100 dark:border-[#272832]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Awaiting Triage
          </span>
          <div className="text-lg font-bold tracking-tight text-amber-600 dark:text-amber-400 tabular-nums">
            {triageCount} <span className="text-xs font-medium text-amber-500">Pending Review</span>
          </div>
          <span className="text-xs font-medium text-slate-500 block">Needs reviewer allocation</span>
        </div>

        <div className="space-y-1 pr-4 lg:px-4 lg:border-r border-slate-100 dark:border-[#272832]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            In Review
          </span>
          <div className="text-lg font-bold tracking-tight text-[#0b99ff] tabular-nums">
            {reviewCount} <span className="text-xs font-medium text-[#0b99ff]">In Evaluation</span>
          </div>
          <span className="text-xs font-medium text-slate-500 block">Scorecards in progress</span>
        </div>

        <div className="space-y-1 pl-0 lg:pl-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Turnaround Time
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

            {/* Small Clickable Stage Filter Tabs (Synchronized 1:1 with JM Workspace) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 pt-2 border-t border-slate-100 dark:border-[#272832]">
              {[
                { id: "all", label: isDe ? "Alle" : "All", count: manuscripts.length },
                { id: "triage", label: isDe ? "Triage" : "Triage", count: triageCount },
                { id: "review", label: isDe ? "In Prüfung" : "In Review", count: reviewCount },
                { id: "revision", label: isDe ? "Revisionen" : "Revisions", count: revisionCount },
                { id: "decision", label: isDe ? "Entschieden" : "Decided", count: decisionCount },
                { id: "integrity", label: isDe ? "Integrität" : "Integrity", count: integrityCount, isAlert: true }
              ].map((tab: any) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedStageFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedStageFilter === tab.id
                      ? tab.isAlert ? "bg-red-600 text-white shadow-xs" : "bg-[#0b99ff] text-white shadow-xs"
                      : tab.isAlert
                      ? "bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-[#1e2027] dark:hover:bg-[#252833] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {tab.isAlert && <ShieldAlert className="h-3.5 w-3.5 text-current" />}
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    selectedStageFilter === tab.id
                      ? "bg-white/20 text-white"
                      : tab.isAlert ? "bg-red-200 dark:bg-red-900/60 text-red-800 dark:text-red-200" : "bg-slate-200 dark:bg-[#272832] text-slate-700 dark:text-slate-300"
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Sub-Filter for Under Review (Ready for Verdict vs Active Evaluations) */}
            {selectedStageFilter === "review" && (
              <div className="flex items-center gap-2 pt-2.5 border-t border-slate-100 dark:border-[#272832] text-xs flex-wrap">
                <span className="text-[11px] font-semibold text-slate-500">Evaluation Status:</span>
                <button
                  type="button"
                  onClick={() => setReviewSubFilter("all")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    reviewSubFilter === "all"
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-[#1e2027] dark:hover:bg-[#252833] text-slate-600 dark:text-slate-400"
                  }`}
                >
                  All Under Review ({reviewCount})
                </button>
                <button
                  type="button"
                  onClick={() => setReviewSubFilter("ready")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    reviewSubFilter === "ready"
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Ready for Verdict ({readyForVerdictCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReviewSubFilter("in_progress")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    reviewSubFilter === "in_progress"
                      ? "bg-amber-600 text-white shadow-2xs"
                      : "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 hover:bg-amber-100 border border-amber-200 dark:border-amber-800"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>Active Evaluations ({inProgressReviewCount})</span>
                </button>
              </div>
            )}
          </div>

          {/* Manuscripts List */}
          <div className="space-y-3">
            {filteredPapers.map((paper) => {
              const isTriage = paper.status === "Awaiting Initial Check" || paper.status === "Submitted" || paper.status === "Draft"
              const isRevisedSubmitted = paper.status === "Revision Under Evaluation" || (paper as any).submissionStage === "Revised Submission"
              const isReviewing = paper.status === "Under Review"
              const isRevision = paper.status === "Revision Required"
              const isAccepted = paper.status === "Accepted"
              const isRejected = paper.status === "Rejected"
              const isReviewsComplete = paper.id === "SOEAS-26-RS102" || (paper.reviewers && paper.reviewers.length > 1 && paper.reviewers.every(r => r === "Dr. Evelyn Vane" || r === "Dr. Marcus Vance"))

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
                        isRejected ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200/80 dark:border-red-900/40" :
                        isAccepted ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-900/40" :
                        isTriage ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/40" :
                        isRevisedSubmitted ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shadow-2xs" :
                        isReviewing ? "bg-sky-50 text-[#0b99ff] dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200/80 dark:border-sky-900/40" :
                        isRevision ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/40" :
                        "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      }`}>
                        {isRejected ? "Desk Rejected ✕" :
                         isAccepted ? "Accepted · In Production ✓" :
                         isRevisedSubmitted ? "Revised Submitted ✓" :
                         isRevision ? "Author Revising (Due in 12d)" :
                         paper.status}
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
                        Assigned Reviewers: <span className="font-semibold text-slate-800 dark:text-slate-200">{paper.reviewers && paper.reviewers.length > 0 ? paper.reviewers.join(", ") : (isTriage ? "None assigned yet" : "Dr. Marcus Vance, Prof. Elena Rostova")}</span>
                      </div>
                      {(() => {
                        const matchingEscalation = (integrityAlerts || []).find(a => a.paperId === paper.id && a.status === "Escalated")
                        if (matchingEscalation) {
                          return (
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                type="button"
                                onClick={() => handleOpenEscalationAlert(matchingEscalation)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 text-[11px] font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors cursor-pointer"
                              >
                                <ShieldAlert className="h-3.5 w-3.5 text-red-600" />
                                ⚠️ Escalated by IM ({matchingEscalation.type}: {matchingEscalation.score}) · Review Brief
                              </button>
                              <span className="text-[11px] text-red-500 font-medium">· EiC Ruling Required</span>
                            </div>
                          )
                        }
                        const isFlagged = Boolean(paper.integrityStatus === "Flagged" || (Number(paper.plagiarismScore) > 15) || (Number(paper.aiScore) > 30))
                        if (isFlagged) {
                          return (
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                type="button"
                                onClick={() => setSelectedPaperForIntegrity(paper)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 text-[11px] font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors cursor-pointer"
                              >
                                <ShieldAlert className="h-3.5 w-3.5 text-red-600" />
                                ⚠️ Plagiarism: {paper.plagiarismScore || 18}% · AI Index: {paper.aiScore || 42}% (Flagged)
                              </button>
                              <span className="text-[11px] text-red-500 font-medium">· Scrutiny Required</span>
                            </div>
                          )
                        }
                        return (
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              type="button"
                              onClick={() => setSelectedPaperForIntegrity(paper)}
                              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/30 text-[11px] font-semibold hover:bg-emerald-100 transition-colors cursor-pointer"
                            >
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                              Plagiarism: {paper.plagiarismScore || 4}% · AI Index: {paper.aiScore || 2}% (Passed)
                            </button>
                            <span className="text-[11px] text-slate-400">· COPE Ethics Verified ✓</span>
                          </div>
                        )
                      })()}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      {!isAccepted && !isRejected && (
                        <Button
                          onClick={() => setSelectedPaperForDetail(paper)}
                          variant="outline"
                          className="text-xs h-8 px-3 border-slate-300 dark:border-[#272832] text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-[#1e2027] cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1 text-slate-500" />
                          {isDe ? "Volltext" : "Inspect"}
                        </Button>
                      )}

                      {Boolean((paper.integrityStatus === "Flagged" || (Number(paper.plagiarismScore) > 15) || (Number(paper.aiScore) > 30)) && !isAccepted && !isRejected) && (
                        <Button
                          onClick={() => setSelectedPaperForIntegrity(paper)}
                          variant="outline"
                          className="text-xs h-8 px-3 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 bg-red-50/50 hover:bg-red-100/50 cursor-pointer font-semibold"
                        >
                          <ShieldAlert className="h-3.5 w-3.5 mr-1 text-red-600" />
                          {isDe ? "Forensik" : "Forensics"}
                        </Button>
                      )}

                      {isTriage && (
                        <Button
                          onClick={() => handleOpenReviewersModal(paper)}
                          className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-semibold h-8 px-3.5 cursor-pointer shadow-xs"
                        >
                          <Users className="h-3.5 w-3.5 mr-1" />
                          {isDe ? "Gutachter zuweisen" : "Assign Reviewers"}
                        </Button>
                      )}

                      {isReviewing && !isReviewsComplete && (
                        <Button
                          onClick={() => setSelectedPaperForReviewTracking(paper)}
                          className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs font-semibold h-8 px-3.5 cursor-pointer shadow-2xs"
                        >
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {paper.id === "SOEAS-26-RS106" ? "1/2 Reviews In · Track" : "0/1 Reviews In · Track"}
                        </Button>
                      )}

                      {isReviewing && isReviewsComplete && (
                        <Button
                          onClick={() => handleOpenDecisionModal(paper)}
                          className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-bold h-8 px-3.5 cursor-pointer shadow-xs"
                        >
                          <CheckSquare className="h-3.5 w-3.5 mr-1" />
                          2/2 In · Render Decision
                        </Button>
                      )}

                      {isRevision && (
                        <Button
                          onClick={() => {
                            triggerConfirm({
                              title: "Send Revision Reminder to Author?",
                              message: `Are you sure you want to dispatch a revision reminder email to ${paper.authorName || 'Author'} for manuscript ${paper.id}?`,
                              confirmButtonLabel: "Yes, Send Reminder",
                              confirmColorClass: "bg-[#0b99ff] hover:bg-[#0088e0]",
                              onConfirm: () => {
                                triggerToast(`✓ Revision reminder email dispatched to ${paper.authorName || 'Author'}.`)
                              }
                            })
                          }}
                          variant="outline"
                          className="h-8 text-xs font-semibold px-2.5 rounded-lg cursor-pointer whitespace-nowrap transition-all shadow-2xs border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18191e] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80"
                        >
                          <Bell className="h-3.5 w-3.5 mr-1 text-[#0b99ff]" />
                          {isDe ? "Autor erinnern" : "Remind Author"}
                        </Button>
                      )}

                      {isRevisedSubmitted && (
                        <Button
                          onClick={() => setSelectedRevisionForEvaluation(paper)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-8 px-3.5 cursor-pointer shadow-xs"
                        >
                          <CheckSquare className="h-3.5 w-3.5 mr-1" />
                          {isDe ? "Revidierte Version prüfen" : "Evaluate Revision"}
                        </Button>
                      )}

                      {(isAccepted || isRejected) && (
                        <Button
                          onClick={() => setSelectedPaperForDetail(paper)}
                          variant="outline"
                          className="text-xs h-8 px-3.5 border-slate-300 dark:border-[#272832] text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-[#1e2027] cursor-pointer font-semibold"
                        >
                          <FileText className="h-3.5 w-3.5 mr-1.5 text-[#0b99ff]" />
                          {isDe ? "Dossier ansehen" : "View Dossier"}
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
      {/* TAB 2: LIVE REVIEW TRACKER (MATCHING JM DESK & COPE WORKFLOW)             */}
      {/* ========================================================================= */}
      {activeTab === "tracker" && (
        <Card className="bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-[#272832] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-[#131418]/60">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#0b99ff]" />
                {isDe ? "Gutachten-Tracking" : "Review Tracker"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isDe ? "Überwachen Sie aktive Scorecards, verlängern Sie Fristen oder senden Sie Mahnungen." : "Monitor reviewer scorecards in real time, grant extensions, or dispatch reminders."}
              </p>
            </div>
            <span className="text-xs font-semibold text-[#0b99ff] bg-[#0b99ff]/10 px-3 py-1.5 rounded-xl border border-[#0b99ff]/20 shrink-0">
              {manuscripts.filter(m => m.status === "Under Review").length} {isDe ? "Aktive Begutachtungen" : "Active Manuscripts Under Review"}
            </span>
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            {manuscripts.filter(m => m.status === "Under Review").map((m) => {
              const isAllReviewsIn = m.id === "SOEAS-26-RS102"
              const isSingleReviewer = m.id === "SOSSH-26-SRW107"

              return (
                <div key={m.id} className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-[#272832] bg-white dark:bg-[#131418] space-y-4 shadow-2xs">
                  
                  {/* Manuscript Header Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-[#272832] pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className="font-bold text-[#0b99ff] bg-[#0b99ff]/10 px-2.5 py-0.5 rounded-md border border-[#0b99ff]/20 whitespace-nowrap">
                          {m.id}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="font-medium text-slate-600 dark:text-slate-300">{m.journal}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500">Submitted {m.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{m.title}</h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isAllReviewsIn ? (
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5 shadow-2xs">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                          2/2 Scorecards Complete
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-2.5 py-1 rounded-full border border-sky-200 dark:border-sky-800">
                          Cycle Target: 14 Days
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dynamic Reviewer Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    
                    {/* Reviewer 1 */}
                    <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                          <span>Reviewer 1: Dr. Marcus Vance</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold">Verified</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-medium">Wise Rail</span>
                        </div>
                        <div className="text-[11px] text-emerald-600 font-semibold">
                          Scorecard Complete · Recommendation: Minor Revision
                        </div>
                        <div className="text-[10px] text-slate-400">Evaluated on {m.date} · 5/5 Criteria Completed</div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {approvedHonoraria[`${m.id}-rev1`] ? (
                          <div className="flex items-center gap-1.5 bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 px-2.5 py-1 rounded-lg">
                            <Coins className="h-3.5 w-3.5 text-emerald-600" />
                            <div className="text-right leading-none">
                              <span className="text-[10px] font-extrabold text-emerald-800 dark:text-emerald-200 block">
                                €{approvedHonoraria[`${m.id}-rev1`].amount.toFixed(2)} EUR
                              </span>
                              <span className="text-[9px] text-emerald-600 font-medium">
                                Score: {approvedHonoraria[`${m.id}-rev1`].score}% ({approvedHonoraria[`${m.id}-rev1`].paymentMethod})
                              </span>
                            </div>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => setScoringReviewerData({
                              paperId: m.id,
                              paperTitle: m.title,
                              reviewerKey: `${m.id}-rev1`,
                              reviewerName: "Dr. Marcus Vance",
                              recommendation: "Minor Revision",
                              submissionDate: m.date,
                              paymentMethod: "Wise",
                              paymentAccount: "vance.retina@u-tokyo.ac.jp",
                              rigorScore: 92,
                              editorNotes: "Constructive feedback on baseline calibration parameters."
                            })}
                            className="h-7 px-2.5 text-xs bg-[#0b99ff] hover:bg-[#0088e0] text-white font-semibold rounded-lg shadow-xs cursor-pointer"
                          >
                            <Coins className="h-3 w-3 mr-1" />
                            Audit & Score (€35–€50)
                          </Button>
                        )}
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 px-2 py-1 rounded-lg border border-emerald-300 dark:border-emerald-800">
                          100% ✓
                        </span>
                      </div>
                    </div>

                    {/* Reviewer 2 (or completed for SOEAS-26-RS102) */}
                    {isAllReviewsIn ? (
                      <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                            <span>Reviewer 2: Dr. Evelyn Vane</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold">Verified</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium">PayPal Rail</span>
                          </div>
                          <div className="text-[11px] text-emerald-600 font-semibold">
                            Scorecard Complete · Recommendation: Accept
                          </div>
                          <div className="text-[10px] text-slate-400">Evaluated on 2026-06-08 · 5/5 Criteria Completed</div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {approvedHonoraria[`${m.id}-rev2`] ? (
                            <div className="flex items-center gap-1.5 bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 px-2.5 py-1 rounded-lg">
                              <Coins className="h-3.5 w-3.5 text-emerald-600" />
                              <div className="text-right leading-none">
                                <span className="text-[10px] font-extrabold text-emerald-800 dark:text-emerald-200 block">
                                  €{approvedHonoraria[`${m.id}-rev2`].amount.toFixed(2)} EUR
                                </span>
                                <span className="text-[9px] text-emerald-600 font-medium">
                                  Score: {approvedHonoraria[`${m.id}-rev2`].score}% ({approvedHonoraria[`${m.id}-rev2`].paymentMethod})
                                </span>
                              </div>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => setScoringReviewerData({
                                paperId: m.id,
                                paperTitle: m.title,
                                reviewerKey: `${m.id}-rev2`,
                                reviewerName: "Dr. Evelyn Vane",
                                recommendation: "Accept",
                                submissionDate: "2026-06-08",
                                paymentMethod: "PayPal",
                                paymentAccount: "evelyn.vane@oxford.ac.uk",
                                rigorScore: 96,
                                editorNotes: "Comprehensive literature contextualization and thorough validation."
                              })}
                              className="h-7 px-2.5 text-xs bg-[#0b99ff] hover:bg-[#0088e0] text-white font-semibold rounded-lg shadow-xs cursor-pointer"
                            >
                              <Coins className="h-3 w-3 mr-1" />
                              Audit & Score (€35–€50)
                            </Button>
                          )}
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 px-2 py-1 rounded-lg border border-emerald-300 dark:border-emerald-800">
                            100% ✓
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/10 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-900 dark:text-white">
                            Reviewer 2: {isSingleReviewer ? "Prof. Hiroshi Tanaka" : "Prof. Elena Rostova"}
                          </div>
                          <div className="text-[11px] text-amber-600 font-semibold">
                            Evaluation in Progress · Due in 4 days
                          </div>
                          <div className="text-[10px] text-slate-400">Double-Blind Invitation Accepted</div>
                        </div>

                        <div className="flex items-center gap-2">
                          {nudgedReviewers.includes(`${m.id}-rev2`) ? (
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                              <Check className="h-3.5 w-3.5" /> Nudged (Cc: Desk)
                            </span>
                          ) : (
                            <Button
                              onClick={() => {
                                const revName = isSingleReviewer ? "Prof. Hiroshi Tanaka" : "Prof. Elena Rostova"
                                triggerConfirm({
                                  title: "Send Reviewer Deadline Reminder?",
                                  message: `Are you sure you want to dispatch an official double-blind peer review reminder email to ${revName} for manuscript ${m.id}? A formal notification will also be logged at the Journal Manager Desk.`,
                                  confirmButtonLabel: "Yes, Send Reminder",
                                  confirmColorClass: "bg-[#0b99ff] hover:bg-[#0088e0]",
                                  onConfirm: () => {
                                    setNudgedReviewers(prev => [...prev, `${m.id}-rev2`])
                                    triggerToast(`✓ Official deadline reminder email dispatched to ${revName}.`)
                                  }
                                })
                              }}
                              variant="outline"
                              className="text-xs h-8 px-3 border-amber-300 text-amber-700 dark:text-amber-300 hover:bg-amber-100 cursor-pointer shadow-2xs font-semibold"
                            >
                              <Bell className="h-3.5 w-3.5 mr-1 text-amber-600" />
                              {isDe ? "Erinnern" : "Nudge"}
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Prominent Action Banner for Completed Reviews */}
                  {isAllReviewsIn && (
                    <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5">
                        <span className="font-bold text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-[#0b99ff]" />
                          All Peer Evaluations Received — Ready for Editorial Verdict
                        </span>
                        <p className="text-[11px] text-blue-800 dark:text-blue-300">
                          Both reviewers have submitted complete scorecards. You can now compose the formal Decision Letter.
                        </p>
                      </div>

                      <Button
                        onClick={() => handleOpenDecisionModal(m)}
                        className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-bold h-8.5 px-4 rounded-xl shadow-xs cursor-pointer shrink-0"
                      >
                        <Edit3 className="h-3.5 w-3.5 mr-1.5" />
                        {isDe ? "Entscheidungsbrief erstellen" : "Draft Decision Letter"}
                      </Button>
                    </div>
                  )}

                </div>
              )
            })}
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
              {isDe ? "Entscheidungen" : "Decisions"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isDe ? "Wählen Sie ein begutachtetes Manuskript aus, um das formelle Entscheidungsschreiben zu erstellen." : "Select an evaluated manuscript to review feedback and issue a publishing decision."}
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
                Decisions Rendered
              </span>
              <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
                124 <span className="text-xs font-medium text-slate-500">Papers</span>
              </div>
              <span className="text-xs font-medium text-emerald-600 block">↑ 18% vs previous cycle</span>
            </div>

            <div className="space-y-1 px-0 lg:px-4 lg:border-r border-slate-100 dark:border-[#272832]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                First Decision Speed
              </span>
              <div className="text-2xl font-bold tracking-tight text-[#0b99ff] tabular-nums">
                14.2 <span className="text-xs font-medium text-slate-500">Days</span>
              </div>
              <span className="text-xs font-medium text-slate-500 block">Benchmark: 35.0 Days</span>
            </div>

            <div className="space-y-1 pr-4 lg:px-4 lg:border-r border-slate-100 dark:border-[#272832]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Acceptance Rate
              </span>
              <div className="text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400 tabular-nums">
                24.5% <span className="text-xs font-medium text-slate-500">Selective</span>
              </div>
              <span className="text-xs font-medium text-slate-500 block">High citation caliber</span>
            </div>

            <div className="space-y-1 pl-0 lg:pl-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Standing
              </span>
              <div className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400 tabular-nums">
                Top 5% <span className="text-xs font-medium text-slate-500">Tier</span>
              </div>
              <span className="text-xs font-medium text-emerald-600 block">Publishing Excellence</span>
            </div>
          </div>

          {/* Detailed Resolution Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Desk Reject</span>
                <span className="font-bold text-rose-600">38.0% (47 Papers)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-[#131418] h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: "38%" }} />
              </div>
              <span className="text-[11px] text-slate-400 block">Scope & ethics check</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Post-Review Reject</span>
                <span className="font-bold text-amber-600">37.5% (46 Papers)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-[#131418] h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: "37.5%" }} />
              </div>
              <span className="text-[11px] text-slate-400 block">Scorecard evaluations</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Acceptance</span>
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
      {/* TAB 0: NOTIFICATIONS & ACTIVITY (COMMON ACROSS JM, EDITOR, IM)             */}
      {/* ========================================================================= */}
      {activeTab === "activity" && (
        <CrossDeskActivityFeed
          language={language}
          currentRole="editor"
          notifications={notifications || []}
          onViewPaperDossier={(paperId) => {
            let match = manuscripts.find(m => m.id === paperId)
            if (!match) {
              const notif = (notifications || []).find(n => n.paperId === paperId)
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
            if (match) setSelectedPaperForDetail(match)
          }}
        />
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

      {/* ================= MODAL: LIVE REVIEWER TRACKER POPUP ================= */}
      <Dialog open={!!selectedPaperForReviewTracking} onOpenChange={(open) => !open && setSelectedPaperForReviewTracking(null)}>
        <DialogContent className="bg-white dark:bg-[#18191e] border border-slate-200 dark:border-[#272832] text-slate-900 dark:text-slate-100 sm:max-w-xl rounded-2xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Review Progress</span>
              <span className="text-xs font-bold text-[#0b99ff] bg-[#0b99ff]/10 px-2.5 py-0.5 rounded border border-[#0b99ff]/20">
                {selectedPaperForReviewTracking?.id}
              </span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 line-clamp-1">
              {selectedPaperForReviewTracking?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Summary Progress Bar */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-200 dark:border-[#272832] space-y-2">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-slate-700 dark:text-slate-300">
                  {selectedPaperForReviewTracking?.id === "SOEAS-26-RS106" ? "1 of 2 Reviews Complete" : "0 of 1 Reviews Complete"}
                </span>
                <span className="text-[#0b99ff]">
                  {selectedPaperForReviewTracking?.id === "SOEAS-26-RS106" ? "50%" : "Pending"}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#0b99ff] h-full rounded-full transition-all duration-500"
                  style={{ width: selectedPaperForReviewTracking?.id === "SOEAS-26-RS106" ? "50%" : "20%" }}
                />
              </div>
            </div>

            {/* Reviewers List */}
            <div className="space-y-2">
              <span className="font-bold text-slate-700 dark:text-slate-300 block text-xs">
                Assigned Reviewers:
              </span>

              {/* Reviewer 1 */}
              <div className={`p-3 rounded-xl border transition-all ${
                isTrackerScorecardExpanded
                  ? "border-[#0b99ff] bg-sky-50/40 dark:bg-sky-950/20 shadow-2xs"
                  : "border-slate-200 dark:border-[#272832] bg-white dark:bg-[#131418]"
              }`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 dark:text-white">Reviewer 1 (Dr. Marcus Vance)</span>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200">
                      Completed ✓
                    </span>
                  </div>
                  <Button
                    onClick={() => setIsTrackerScorecardExpanded(!isTrackerScorecardExpanded)}
                    variant="outline"
                    className={`text-xs h-7.5 px-3 shrink-0 cursor-pointer font-semibold ${
                      isTrackerScorecardExpanded ? "border-[#0b99ff] text-[#0b99ff] bg-sky-50 dark:bg-sky-950/50" : ""
                    }`}
                  >
                    {isTrackerScorecardExpanded ? "Hide Scorecard ▲" : "View Scorecard ▼"}
                  </Button>
                </div>

                {isTrackerScorecardExpanded && (
                  <div className="space-y-2.5 mt-3 pt-2.5 border-t border-sky-200/60 dark:border-sky-800/40 animate-in fade-in duration-150 text-xs">
                    {/* Detailed Score Matrix */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white dark:bg-[#131418] border border-slate-200 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 text-[11px] block font-medium">Novelty</span>
                        <strong className="text-slate-900 dark:text-white text-xs font-bold mt-0.5 block">4.5 / 5.0</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white dark:bg-[#131418] border border-slate-200 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 text-[11px] block font-medium">Methodology</span>
                        <strong className="text-slate-900 dark:text-white text-xs font-bold mt-0.5 block">4.0 / 5.0</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white dark:bg-[#131418] border border-slate-200 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 text-[11px] block font-medium">Data Quality</span>
                        <strong className="text-slate-900 dark:text-white text-xs font-bold mt-0.5 block">4.5 / 5.0</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white dark:bg-[#131418] border border-slate-200 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 text-[11px] block font-medium">Clarity</span>
                        <strong className="text-slate-900 dark:text-white text-xs font-bold mt-0.5 block">4.5 / 5.0</strong>
                      </div>
                    </div>

                    {/* Comments to Author */}
                    <div className="space-y-1">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                        Comments to Author:
                      </span>
                      <div className="p-3 rounded-xl bg-white dark:bg-[#131418] border border-slate-200 dark:border-slate-800 space-y-1.5 text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                        <p>1. Benchmarking against baseline datasets is sound and persuasive.</p>
                        <p>2. Expand dynamic range annotations on Figure 3 (Panels B & C) for contrast.</p>
                        <p>3. Clarify sample preparation conditions and variance controls in Section 3.2.</p>
                      </div>
                    </div>

                    {/* Confidential Comments to Handling Editor */}
                    <div className="space-y-1">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                        Confidential Editor Notes:
                      </span>
                      <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs italic leading-relaxed">
                        &ldquo;Methodology is sound. Requested additions to Figure 3 and Section 3.2 are minor and should not require external re-review.&rdquo;
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Reviewer 2 */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-[#272832] bg-white dark:bg-[#131418] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900 dark:text-white">Reviewer 2 (Prof. Elena Rostova)</span>
                  <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded border border-amber-200">
                    Due in 4d
                  </span>
                </div>
                <Button
                  onClick={() => {
                    triggerConfirm({
                      title: "Send Reminder to Reviewer 2?",
                      message: "Send a progress reminder email to Prof. Elena Rostova?",
                      confirmButtonLabel: "Send Reminder",
                      confirmColorClass: "bg-amber-500 hover:bg-amber-600",
                      onConfirm: () => triggerToast("✓ Progress reminder sent to Prof. Elena Rostova.")
                    })
                  }}
                  variant="outline"
                  className="text-xs h-7.5 px-3 border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300 shrink-0 cursor-pointer"
                >
                  Nudge
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-slate-100 dark:border-[#272832] pt-3 flex flex-row items-center justify-between sm:justify-between w-full">
            <Button
              onClick={() => {
                const paper = selectedPaperForReviewTracking
                setSelectedPaperForReviewTracking(null)
                if (paper) {
                  handleOpenReviewersModal(paper)
                }
              }}
              variant="outline"
              className="text-xs h-8 px-3 cursor-pointer"
            >
              <UserPlus className="h-3.5 w-3.5 mr-1" />
              Assign Reviewer
            </Button>
            <Button
              onClick={() => setSelectedPaperForReviewTracking(null)}
              className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-semibold h-8 px-4 cursor-pointer"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: EDITORIAL DECISION DRAWER ================= */}
      <Dialog open={!!selectedPaperForDecision} onOpenChange={(open) => !open && setSelectedPaperForDecision(null)}>
        <DialogContent className="bg-white dark:bg-[#18191e] border border-slate-200 dark:border-[#272832] text-slate-900 dark:text-slate-100 sm:max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-[#0b99ff]" />
              {isDe ? "Formelle redaktionelle Entscheidung formulieren" : "Render Editorial Decision"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {selectedPaperForDecision?.id}: {selectedPaperForDecision?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs max-h-[65vh] overflow-y-auto pr-1">
            
            {/* 1. Submitted Peer Review Reports */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-200 dark:border-[#272832] space-y-2.5">
              <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                <span>Peer Review Evaluations</span>
                <span className="text-[11px] font-semibold text-[#0b99ff] bg-[#0b99ff]/10 px-2 py-0.5 rounded border border-[#0b99ff]/20">
                  Consensus: Minor Revision
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {/* Reviewer 1 */}
                <div className={`p-3 rounded-xl border transition-all ${
                  expandedReviewerScorecard === "rev1" 
                    ? "border-[#0b99ff] bg-sky-50/50 dark:bg-sky-950/20 shadow-xs" 
                    : "border-slate-200 dark:border-[#272832] bg-white dark:bg-[#18191e] hover:border-slate-300"
                }`}>
                  <div className="flex items-center justify-between font-bold flex-wrap gap-2">
                    <span className="text-slate-900 dark:text-white">
                      Reviewer 1 (Dr. Marcus Vance)
                    </span>
                    <button
                      type="button"
                      onClick={() => setExpandedReviewerScorecard(expandedReviewerScorecard === "rev1" ? null : "rev1")}
                      className="text-[11px] font-bold text-[#0b99ff] hover:underline cursor-pointer"
                    >
                      {expandedReviewerScorecard === "rev1" ? "Hide Details ▲" : "View Details ▼"}
                    </button>
                  </div>

                  {expandedReviewerScorecard === "rev1" && (
                    <div className="space-y-2.5 mt-3 pt-2.5 border-t border-sky-200/60 dark:border-sky-800/40 animate-in fade-in duration-150">
                      {/* Detailed Score Matrix */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-white dark:bg-[#131418] border border-slate-200 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] block font-medium">Novelty</span>
                          <strong className="text-slate-900 dark:text-white text-xs font-bold mt-0.5 block">4.5 / 5.0</strong>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white dark:bg-[#131418] border border-slate-200 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] block font-medium">Methodology</span>
                          <strong className="text-slate-900 dark:text-white text-xs font-bold mt-0.5 block">4.0 / 5.0</strong>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white dark:bg-[#131418] border border-slate-200 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] block font-medium">Data Quality</span>
                          <strong className="text-slate-900 dark:text-white text-xs font-bold mt-0.5 block">4.5 / 5.0</strong>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white dark:bg-[#131418] border border-slate-200 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] block font-medium">Clarity</span>
                          <strong className="text-slate-900 dark:text-white text-xs font-bold mt-0.5 block">4.5 / 5.0</strong>
                        </div>
                      </div>

                      {/* Comments to Author */}
                      <div className="space-y-1">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                          Comments to Author:
                        </span>
                        <div className="p-3 rounded-xl bg-white dark:bg-[#131418] border border-slate-200 dark:border-slate-800 space-y-1.5 text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                          <p>1. Benchmarking against baseline datasets is sound and persuasive.</p>
                          <p>2. Expand dynamic range annotations on Figure 3 (Panels B & C) for contrast.</p>
                          <p>3. Clarify sample preparation conditions and variance controls in Section 3.2.</p>
                        </div>
                      </div>

                      {/* Confidential Comments to Handling Editor */}
                      <div className="space-y-1">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                          Confidential Editor Notes:
                        </span>
                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs italic leading-relaxed">
                          &ldquo;Methodology is sound. Requested additions to Figure 3 and Section 3.2 are minor and should not require external re-review.&rdquo;
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reviewer 2 */}
                <div className={`p-3 rounded-xl border transition-all ${
                  expandedReviewerScorecard === "rev2" 
                    ? "border-[#0b99ff] bg-sky-50/50 dark:bg-sky-950/20 shadow-xs" 
                    : "border-slate-200 dark:border-[#272832] bg-white dark:bg-[#18191e] hover:border-slate-300"
                }`}>
                  <div className="flex items-center justify-between font-bold flex-wrap gap-2">
                    <span className="text-slate-900 dark:text-white">
                      Reviewer 2 (Prof. Elena Rostova)
                    </span>
                    <button
                      type="button"
                      onClick={() => setExpandedReviewerScorecard(expandedReviewerScorecard === "rev2" ? null : "rev2")}
                      className="text-[11px] font-bold text-[#0b99ff] hover:underline cursor-pointer"
                    >
                      {expandedReviewerScorecard === "rev2" ? "Hide Details ▲" : "View Details ▼"}
                    </button>
                  </div>

                  {expandedReviewerScorecard === "rev2" && (
                    <div className="space-y-2.5 mt-3 pt-2.5 border-t border-sky-200/60 dark:border-sky-800/40 animate-in fade-in duration-150">
                      {/* Detailed Score Matrix */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-white dark:bg-[#131418] border border-slate-200 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] block font-medium">Novelty</span>
                          <strong className="text-slate-900 dark:text-white text-xs font-bold mt-0.5 block">4.0 / 5.0</strong>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white dark:bg-[#131418] border border-slate-200 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] block font-medium">Methodology</span>
                          <strong className="text-slate-900 dark:text-white text-xs font-bold mt-0.5 block">4.5 / 5.0</strong>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white dark:bg-[#131418] border border-slate-200 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] block font-medium">Data Quality</span>
                          <strong className="text-slate-900 dark:text-white text-xs font-bold mt-0.5 block">5.0 / 5.0</strong>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white dark:bg-[#131418] border border-slate-200 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] block font-medium">Clarity</span>
                          <strong className="text-slate-900 dark:text-white text-xs font-bold mt-0.5 block">4.5 / 5.0</strong>
                        </div>
                      </div>

                      {/* Comments to Author */}
                      <div className="space-y-1">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                          Comments to Author:
                        </span>
                        <div className="p-3 rounded-xl bg-white dark:bg-[#131418] border border-slate-200 dark:border-slate-800 space-y-1.5 text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                          <p>1. Significant clinical implications for pediatric cohorts with practical utility.</p>
                          <p>2. Explicitly report demographic cohort age ranges and standard deviations in Table 2.</p>
                          <p>3. Resolve typographic inconsistencies in the discussion section on page 8.</p>
                        </div>
                      </div>

                      {/* Confidential Comments to Handling Editor */}
                      <div className="space-y-1">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                          Confidential Editor Notes:
                        </span>
                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs italic leading-relaxed">
                          &ldquo;Strong paper with high citation potential. No ethical or data issues observed. Recommend publication once Table 2 is expanded.&rdquo;
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Verdict Selection */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                {isDe ? "Entscheidungs-Verdikt:" : "Decision Verdict:"}
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

            {/* 3. Official Decision Letter */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-[#272832]">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <h4 className="font-semibold text-xs text-slate-900 dark:text-white">
                    {isDe ? "Entscheidungsschreiben" : "Editorial Decision Letter"}
                  </h4>
                </div>

                {/* Sub-Tabs: Edit Letter / Preview */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#131418] p-0.5 rounded-lg border border-slate-200/80 dark:border-[#272832]">
                  <button
                    type="button"
                    onClick={() => setDecisionTab("edit")}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                      decisionTab === "edit"
                        ? "bg-white dark:bg-[#1f2027] text-slate-900 dark:text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    {isDe ? "Bearbeiten" : "Edit Letter"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecisionTab("preview")}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                      decisionTab === "preview"
                        ? "bg-white dark:bg-[#1f2027] text-slate-900 dark:text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    {isDe ? "Vorschau" : "Preview"}
                  </button>
                </div>
              </div>

              {/* Recipient & Subject Line Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                      {isDe ? "Empfänger (Autor):" : "Author Email (To):"}
                    </label>
                    <span className="text-[10px] text-slate-400">CC: scholarlyopen@gmail.com</span>
                  </div>
                  <input
                    type="email"
                    value={decisionAuthorEmail}
                    onChange={(e) => setDecisionAuthorEmail(e.target.value)}
                    placeholder="author@university.edu"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#131418] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#0b99ff] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                    {isDe ? "Betreff:" : "Subject:"}
                  </label>
                  <input
                    type="text"
                    value={decisionSubject}
                    onChange={(e) => setDecisionSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#131418] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#0b99ff] focus:outline-none"
                  />
                </div>
              </div>

              {/* Body: Edit Mode OR Live Branded Preview Mode */}
              {decisionTab === "edit" ? (
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                    {isDe ? "Schreiben:" : "Letter Body:"}
                  </label>
                  <textarea
                    rows={12}
                    value={decisionLetter}
                    onChange={(e) => setDecisionLetter(e.target.value)}
                    className="w-full p-3 rounded-lg border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#131418] text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-[#0b99ff] focus:outline-none leading-relaxed"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                    {isDe ? "Vorschau:" : "Email Preview:"}
                  </label>
                  <div className="rounded-lg border border-slate-200 dark:border-[#272832] overflow-hidden bg-slate-50 dark:bg-slate-950 p-2">
                    <iframe
                      title="Decision Email Preview"
                      srcDoc={generateBrandedEmailHtml({
                        subject: decisionSubject,
                        bodyText: decisionLetter,
                        actionLabel: decisionVerdict === "Accept" ? "View Publication Dossier" : "Submit Revised Manuscript",
                        actionUrl: "https://www.scholarlyopen.org/editorial360",
                        journal: selectedPaperForDecision?.journal || user.journal,
                        paperId: selectedPaperForDecision?.id,
                        paperTitle: selectedPaperForDecision?.title,
                        recipientName: selectedPaperForDecision?.authorName || "Author"
                      })}
                      className="w-full h-[360px] bg-white rounded border border-slate-200 dark:border-slate-800"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confidential Notes (Internal Only) */}
            <div className="space-y-1">
              <label className="font-medium text-slate-700 dark:text-slate-300 text-xs">
                {isDe ? "Vertrauliche Notizen (nur intern):" : "Confidential Notes (Internal):"}
              </label>
              <input
                type="text"
                value={confidentialNotes}
                onChange={(e) => setConfidentialNotes(e.target.value)}
                placeholder="E.g. Reviewer 1 recommended acceptance subject to figure 4 clarifications."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#131418] text-xs focus:ring-2 focus:ring-[#0b99ff] focus:outline-none"
              />
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-[#272832] w-full flex-wrap">
            <div>
              {(selectedPaperForDecision?.status?.toLowerCase().includes("revision") || 
                selectedPaperForDecision?.submissionStage?.toLowerCase().includes("revis") || 
                selectedPaperForDecision?.id === "SOSSH-26-SRW103") && (
                <Button
                  onClick={() => {
                    const paper = selectedPaperForDecision
                    setSelectedPaperForDecision(null)
                    if (paper) {
                      setSelectedRevisionForEvaluation(paper)
                    }
                  }}
                  variant="outline"
                  disabled={isDecisionSending}
                  className="text-xs h-8.5 cursor-pointer font-semibold text-slate-700 dark:text-slate-300"
                >
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                  {isDe ? "Zurück zur Revisionsprüfung" : "Back to Evaluate Revision"}
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setSelectedPaperForDecision(null)}
                variant="outline"
                disabled={isDecisionSending}
                className="text-xs h-8.5 cursor-pointer"
              >
                {isDe ? "Abbrechen" : "Cancel"}
              </Button>
              <Button
                onClick={onTriggerSubmitDecision}
                disabled={isDecisionSending}
                className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-semibold h-8.5 px-4 shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                {isDecisionSending ? (
                  <>
                    <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isDe ? "Wird versendet..." : "Dispatching Email..."}</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5 mr-1" />
                    <span>{isDe ? "Entscheidung & E-Mail versenden" : "Dispatch Decision & Send Email"}</span>
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: REVISION EVALUATION ================= */}
      <Dialog open={!!selectedRevisionForEvaluation} onOpenChange={(open) => !open && setSelectedRevisionForEvaluation(null)}>
        <DialogContent className="bg-white dark:bg-[#18191e] border border-slate-200 dark:border-[#272832] text-slate-900 dark:text-slate-100 sm:max-w-2xl rounded-2xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between gap-2 flex-wrap">
              <span>{isDe ? "Revisionsprüfung" : "Evaluate Revision"}</span>
              <span className="text-xs font-bold text-[#0b99ff] bg-[#0b99ff]/10 px-2.5 py-0.5 rounded border border-[#0b99ff]/20">
                {selectedRevisionForEvaluation?.id} · R1 Revision
              </span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 line-clamp-1">
              {selectedRevisionForEvaluation?.title}
            </DialogDescription>
          </DialogHeader>

          {/* Sub-Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-[#131418] rounded-xl border border-slate-200 dark:border-[#272832] text-xs">
            <button
              type="button"
              onClick={() => setRevisionTab("rebuttal")}
              className={`py-2 px-2 rounded-lg font-bold transition-all text-center cursor-pointer whitespace-nowrap ${
                revisionTab === "rebuttal"
                  ? "bg-[#0b99ff] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Author Rebuttal
            </button>
            <button
              type="button"
              onClick={() => setRevisionTab("diff")}
              className={`py-2 px-2 rounded-lg font-bold transition-all text-center cursor-pointer whitespace-nowrap ${
                revisionTab === "diff"
                  ? "bg-[#0b99ff] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Revised Files & Diff
            </button>
            <button
              type="button"
              onClick={() => setRevisionTab("reports")}
              className={`py-2 px-2 rounded-lg font-bold transition-all text-center cursor-pointer whitespace-nowrap ${
                revisionTab === "reports"
                  ? "bg-[#0b99ff] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              R1 Scorecards Ref
            </button>
          </div>

          <div className="space-y-3 py-1 text-xs max-h-[50vh] overflow-y-auto">
            
            {/* TAB 1: AUTHOR REBUTTAL */}
            {revisionTab === "rebuttal" && (
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-200 dark:border-[#272832] flex items-center justify-between text-xs">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    Author Response Letter (All 4 remarks addressed)
                  </div>
                  <Button
                    onClick={() => triggerToast("✓ Downloading complete author rebuttal letter PDF...")}
                    variant="outline"
                    className="text-xs h-7 px-2.5 cursor-pointer font-semibold"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download Letter
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-[#272832] bg-white dark:bg-[#131418] space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                      <span className="text-[#0b99ff]">Point 1: Baseline Calibration (Reviewer 1)</span>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.2 rounded font-semibold border border-emerald-200">Resolved ✓</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 italic text-[11px]">
                      &ldquo;We thank Reviewer 1. We re-calibrated baseline measurements across the 48-hour longitudinal window and updated Figure 3 and Section 3.2.&rdquo;
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 dark:border-[#272832] bg-white dark:bg-[#131418] space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                      <span className="text-[#0b99ff]">Point 2: Figure 3 Print Contrast (Reviewer 1)</span>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.2 rounded font-semibold border border-emerald-200">Resolved ✓</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 italic text-[11px]">
                      &ldquo;Expanded annotations and enhanced dynamic range across Panels B and C in high-resolution vector format.&rdquo;
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 dark:border-[#272832] bg-white dark:bg-[#131418] space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                      <span className="text-[#0b99ff]">Point 3: Demographic Stratification (Reviewer 2)</span>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.2 rounded font-semibold border border-emerald-200">Resolved ✓</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 italic text-[11px]">
                      &ldquo;Added Supplementary Table S2 detailing demographic cohort stratification criteria across urban and regional clinics.&rdquo;
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 dark:border-[#272832] bg-white dark:bg-[#131418] space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                      <span className="text-[#0b99ff]">Point 4: Typographic Corrections (Reviewer 2)</span>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.2 rounded font-semibold border border-emerald-200">Resolved ✓</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 italic text-[11px]">
                      &ldquo;Corrected bibliographic and typographical inconsistencies on page 8 as noted.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: REVISED FILES & DIFF (WITH DIRECT DOWNLOAD ACTIONS) */}
            {revisionTab === "diff" && (
              <div className="space-y-2">
                {[
                  { name: "Revised_Manuscript_Clean_R1.pdf", type: "Clean Manuscript PDF", size: "2.4 MB" },
                  { name: "Track_Changes_Comparison_Doc.pdf", type: "Marked-Up Redline Diff", size: "2.8 MB" },
                  { name: "Supplementary_Table_S2_Stratification.xlsx", type: "Supplemental Dataset", size: "420 KB" }
                ].map((file, i) => (
                  <div key={i} className="p-3 rounded-xl border border-slate-200 dark:border-[#272832] bg-white dark:bg-[#131418] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <FileText className="h-4 w-4 text-[#0b99ff] shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-xs">{file.name}</div>
                        <div className="text-[11px] text-slate-500">{file.type} · {file.size}</div>
                      </div>
                    </div>
                    <Button
                      onClick={() => triggerToast(`✓ Downloading ${file.name}...`)}
                      variant="outline"
                      className="text-xs h-7.5 px-3 shrink-0 cursor-pointer font-semibold"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: ROUND 1 SCORECARDS REFERENCE */}
            {revisionTab === "reports" && (
              <div className="space-y-2">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-[#272832] bg-white dark:bg-[#131418] space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                    <span>Reviewer 1 (Dr. Marcus Vance)</span>
                    <span className="text-[10px] font-semibold text-[#0b99ff] bg-[#0b99ff]/10 px-2 py-0.2 rounded border border-[#0b99ff]/20">Minor Revision</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    &ldquo;High scientific rigor. Recommend minor revisions to baseline calibration parameters in Figure 3 and Section 3.2.&rdquo;
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-[#272832] bg-white dark:bg-[#131418] space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                    <span>Reviewer 2 (Prof. Elena Rostova)</span>
                    <span className="text-[10px] font-semibold text-[#0b99ff] bg-[#0b99ff]/10 px-2 py-0.2 rounded border border-[#0b99ff]/20">Minor Revision</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    &ldquo;Suggest adding demographic breakdown table to substantiate cohort claims and fixing minor typos on page 8.&rdquo;
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-[#272832] flex-wrap">
            <Button
              onClick={() => setSelectedRevisionForEvaluation(null)}
              variant="outline"
              className="text-xs h-8.5 cursor-pointer"
            >
              Close
            </Button>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  triggerConfirm({
                    title: "Dispatch to Round 2?",
                    message: `Send revised manuscript back to reviewers for final evaluation?`,
                    confirmButtonLabel: "Dispatch Round 2",
                    confirmColorClass: "bg-amber-600 hover:bg-amber-700",
                    onConfirm: () => {
                      setSelectedRevisionForEvaluation(null)
                      triggerToast("✓ Manuscript dispatched to Round 2.")
                    }
                  })
                }}
                variant="outline"
                className="text-xs h-8.5 border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300 cursor-pointer font-semibold"
              >
                Dispatch Round 2
              </Button>

              <Button
                onClick={() => {
                  const paper = selectedRevisionForEvaluation
                  setSelectedRevisionForEvaluation(null)
                  if (paper) {
                    handleOpenDecisionModal(paper)
                  }
                }}
                className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-semibold h-8.5 px-4 cursor-pointer"
              >
                Render Verdict
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: ASSIGN REVIEWERS (MULTI-SOURCE SOURCING) ================= */}
      <Dialog open={!!selectedPaperForReviewers} onOpenChange={(open) => !open && setSelectedPaperForReviewers(null)}>
        <DialogContent className="bg-white dark:bg-[#18191e] border border-slate-200 dark:border-[#272832] text-slate-900 dark:text-slate-100 sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between gap-2">
              <span>{isDe ? "Fachgutachter zuweisen" : "Assign Reviewers"}</span>
              <span className="text-xs font-bold text-[#0b99ff] bg-[#0b99ff]/10 px-2.5 py-0.5 rounded border border-[#0b99ff]/20">
                {selectedPaperForReviewers?.id}
              </span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 line-clamp-1">
              {selectedPaperForReviewers?.title}
            </DialogDescription>
          </DialogHeader>

          {/* Sourcing Mode Switcher */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-[#131418] rounded-xl border border-slate-200 dark:border-[#272832] text-xs">
            <button
              type="button"
              onClick={() => setReviewerSourceTab("matched")}
              className={`py-1.5 px-2 rounded-lg font-semibold transition-all text-center cursor-pointer text-xs ${
                reviewerSourceTab === "matched"
                  ? "bg-[#0b99ff] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Editorial Board
            </button>
            <button
              type="button"
              onClick={() => {
                setReviewerSourceTab("suggested")
                if (!openAiResults && selectedPaperForReviewers) {
                  handleFetchOpenAiReviewers(selectedPaperForReviewers)
                }
              }}
              className={`py-1.5 px-2 rounded-lg font-semibold transition-all text-center cursor-pointer text-xs ${
                reviewerSourceTab === "suggested"
                  ? "bg-[#0b99ff] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Global Scholars
            </button>
            <button
              type="button"
              onClick={() => setReviewerSourceTab("external")}
              className={`py-1.5 px-2 rounded-lg font-semibold transition-all text-center cursor-pointer text-xs ${
                reviewerSourceTab === "external"
                  ? "bg-[#0b99ff] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Invite External
            </button>
          </div>

          <div className="space-y-3 py-1 text-xs max-h-[50vh] overflow-y-auto pr-1">
            
            {/* TAB 1: EDITORIAL BOARD */}
            {reviewerSourceTab === "matched" && (
              <div className="space-y-2">
                <div className="space-y-1.5">
                  {[
                    { name: "Dr. Marcus Vance", affil: "Charité Berlin", active: "2 active reviews", spec: "Computational Cardiology" },
                    { name: "Prof. Elena Rostova", affil: "ETH Zürich", active: "1 active review", spec: "Ophthalmic Neural Networks" },
                    { name: "Dr. Tobias Becker", affil: "Karolinska Institutet", active: "3 active · High Load", spec: "Clinical Tele-Screening" }
                  ].map((rev, idx) => {
                    const isSelected = selectedReviewerNames.includes(rev.name)
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedReviewerNames(prev =>
                            isSelected ? prev.filter(n => n !== rev.name) : [...prev, rev.name]
                          )
                        }}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected 
                            ? "border-[#0b99ff] bg-[#0b99ff]/10 text-slate-900 dark:text-white" 
                            : "border-slate-200 dark:border-[#272832] bg-slate-50 dark:bg-[#131418] hover:border-slate-300"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-slate-900 dark:text-white text-xs">{rev.name}</span>
                            <span className="text-[11px] font-medium text-[#0b99ff] bg-[#0b99ff]/10 px-2 py-0.2 rounded">
                              {rev.active}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500">{rev.spec} · {rev.affil}</div>
                        </div>
                        <input type="checkbox" checked={isSelected} readOnly className="rounded text-[#0b99ff] h-4 w-4 shrink-0" />
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: GLOBAL SCHOLARS (CLEAN MINIMAL METADATA) */}
            {reviewerSourceTab === "suggested" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 w-full">
                  <div className="relative flex-1 min-w-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={openAiCustomTopic}
                      onChange={(e) => setOpenAiCustomTopic(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          if (selectedPaperForReviewers) {
                            handleFetchOpenAiReviewers(selectedPaperForReviewers, openAiCustomTopic)
                          }
                        }
                      }}
                      placeholder="Search global scholars by topic or name..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                    />
                  </div>
                  <Button
                    type="button"
                    disabled={isSearchingOpenAI}
                    onClick={() => selectedPaperForReviewers && handleFetchOpenAiReviewers(selectedPaperForReviewers, openAiCustomTopic)}
                    className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-semibold h-8 px-4 rounded-xl cursor-pointer shadow-xs shrink-0"
                  >
                    {isSearchingOpenAI ? "Searching..." : "Search"}
                  </Button>
                </div>

                {isSearchingOpenAI && (
                  <div className="p-4 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                    <span className="h-4 w-4 border-2 border-[#0b99ff] border-t-transparent rounded-full animate-spin" />
                    <span>Searching global scholars graph...</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  {(openAiResults || [
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
                    const isSelected = selectedReviewerNames.includes(rev.name)
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedReviewerNames(prev =>
                            isSelected ? prev.filter(n => n !== rev.name) : [...prev, rev.name]
                          )
                        }}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected ? "border-[#0b99ff] bg-[#0b99ff]/10" : "border-slate-200 dark:border-[#272832] bg-slate-50 dark:bg-[#131418] hover:border-slate-300"
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

                        <input type="checkbox" checked={isSelected} readOnly className="rounded text-[#0b99ff] h-4 w-4 shrink-0" />
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: INVITE EXTERNAL SPECIALIST */}
            {reviewerSourceTab === "external" && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-200 dark:border-[#272832] space-y-3">
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
                              affiliation: customRevAffiliation.trim() || "External Specialist"
                            }
                            setExternalReviewersList(updatedList)
                            setSelectedReviewerNames(prev => prev.map(n => n === oldName ? newName : n))
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
                            affiliation: customRevAffiliation.trim() || "External Specialist"
                          }
                          setExternalReviewersList(prev => [...prev, newRev])
                          setSelectedReviewerNames(prev => prev.includes(newRev.name) ? prev : [...prev, newRev.name])
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
                    <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-[#272832]">
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
                          const isCurrentlySelected = selectedReviewerNames.includes(rev.name)
                          return (
                            <div
                              key={idx}
                              onClick={() => {
                                setSelectedReviewerNames(prev =>
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
                                  : "border-slate-200 dark:border-[#272832] bg-white dark:bg-[#14151a] hover:border-slate-300"
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
                                    setSelectedReviewerNames(prev => prev.filter(n => n !== revToRemove.name))
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

            {/* Assistance Banner */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-200 dark:border-[#272832] flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800 dark:text-slate-200">Need help finding niche reviewers?</span>
                <p className="text-[11px] text-slate-500">The Journal Manager Desk can source verified experts.</p>
              </div>
              <Button
                type="button"
                onClick={() => {
                  if (selectedPaperForReviewers) {
                    setSelectedPaperForJmHelp(selectedPaperForReviewers)
                    setSelectedPaperForReviewers(null)
                  }
                }}
                variant="outline"
                className="text-xs h-7.5 px-3 border-[#0b99ff] text-[#0b99ff] hover:bg-[#0b99ff]/10 font-semibold cursor-pointer shrink-0 ml-2"
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Ask JM Desk
              </Button>
            </div>

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
                        bodyText: assignEmailBody.replace(/\{\{recipientName\}\}/g, selectedReviewerNames[0] || "Dr. Reviewer"),
                        actionLabel: "Accept Review Invitation",
                        actionUrl: "https://www.scholarlyopen.org/editorial360",
                        secondaryActionLabel: "Decline Invitation",
                        secondaryActionUrl: "https://www.scholarlyopen.org/editorial360?action=decline",
                        journal: selectedPaperForReviewers?.journal || user.journal,
                        paperId: selectedPaperForReviewers?.id,
                        paperTitle: selectedPaperForReviewers?.title,
                        recipientName: selectedReviewerNames[0] || "Dr. Reviewer"
                      })}
                      className="w-full h-[320px] bg-white rounded border border-slate-200 dark:border-slate-800"
                    />
                  </div>
                </div>
              )}
            </div>

          </div>

          <DialogFooter className="flex flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-[#272832]">
            <div className="flex items-center gap-2 flex-wrap max-w-[65%]">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                Selected ({selectedReviewerNames.length}):
              </span>
              {selectedReviewerNames.length === 0 ? (
                <span className="text-xs text-slate-400 italic">None selected yet</span>
              ) : (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedReviewerNames.map((name) => (
                    <span
                      key={name}
                      className="inline-flex items-center gap-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700"
                    >
                      <span className="max-w-[130px] truncate font-medium">{name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedReviewerNames(prev => prev.filter(n => n !== name))
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
                onClick={() => setSelectedPaperForReviewers(null)}
                variant="outline"
                disabled={isAssignSending}
                className="text-xs h-8.5 cursor-pointer"
              >
                {isDe ? "Abbrechen" : "Cancel"}
              </Button>
              <Button
                onClick={onTriggerAssignReviewers}
                disabled={selectedReviewerNames.length === 0 || isAssignSending}
                className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-semibold h-8.5 px-4 shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {isAssignSending ? (
                  <>
                    <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Assigning & Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5 mr-1" />
                    <span>{isDe ? "Zuweisen & Einladungen senden" : "Assign & Dispatch Invitations"}</span>
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: FULL EDITORIAL INSPECT & DOSSIER VIEWER ================= */}
      <Dialog 
        open={!!selectedPaperForDetail} 
        onOpenChange={(open) => {
          if (!open) {
            setSelectedPaperForDetail(null)
            setInspectTab("article")
          }
        }}
      >
        <DialogContent className="bg-white dark:bg-[#18191e] border border-slate-200 dark:border-[#272832] text-slate-900 dark:text-slate-100 max-w-4xl max-h-[90vh] flex flex-col rounded-2xl p-0 overflow-hidden shadow-2xl">
          
          {/* Modal Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-[#272832] bg-slate-50/70 dark:bg-[#131418]/80 flex items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1 pr-6">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="font-bold text-[#0b99ff] bg-[#0b99ff]/10 px-2.5 py-0.5 rounded-md border border-[#0b99ff]/20">
                  {selectedPaperForDetail?.id}
                </span>
                <span className="font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#20222a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#272832]">
                  {selectedPaperForDetail?.articleType || "Original Research"}
                </span>
                <span className="text-slate-400">•</span>
                <span className="font-medium text-slate-600 dark:text-slate-300">{selectedPaperForDetail?.journal}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-400">Submitted {selectedPaperForDetail?.date}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {selectedPaperForDetail?.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                <span>Author: <strong className="text-slate-800 dark:text-slate-200">{selectedPaperForDetail?.authorName || "Dr. Evelyn Vane"}</strong></span>
                {selectedPaperForDetail?.authorAffiliation && (
                  <>
                    <span>·</span>
                    <span>{selectedPaperForDetail.authorAffiliation}</span>
                  </>
                )}
                {selectedPaperForDetail?.authorOrcid && (
                  <a 
                    href={`https://orcid.org/${selectedPaperForDetail.authorOrcid}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#A6CE39] hover:underline"
                  >
                    <span>iD {selectedPaperForDetail.authorOrcid}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/50">
                  COI & Affiliation Verified (Double-Blind to Reviewers)
                </span>
              </div>
            </div>
          </div>

          {/* Segmented Responsive 4-Tab Control Bar (Fits 100% inside popup box) */}
          {(() => {
            const matchingAlert = (integrityAlerts || []).find(a => a.paperId === selectedPaperForDetail?.id)
            const hasIntegrityRecord = !!matchingAlert || selectedPaperForDetail?.integrityStatus === "Breach Confirmed" || selectedPaperForDetail?.integrityStatus === "Flagged" || (selectedPaperForDetail?.status === "Rejected" && selectedPaperForDetail?.id === "SOEAS-26-RS106")

            return (
              <>
                <div className="px-6 py-2.5 border-b border-slate-100 dark:border-[#272832] bg-white dark:bg-[#18191e]">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-100 dark:bg-[#131418] rounded-xl border border-slate-200/80 dark:border-[#272832]">
                    {[
                      { id: "article", label: isDe ? "Manuskript & Text" : "Manuscript & Text", icon: BookOpen },
                      { id: "files", label: isDe ? "Dateien & Assets" : "Files & Assets (4)", icon: FileText },
                      { id: "cover_letter", label: isDe ? "Begleitschreiben" : "Cover Letter", icon: Mail },
                      { 
                        id: "compliance", 
                        label: hasIntegrityRecord ? (isDe ? "Ethik & IM Audit" : "Ethics & IM Audit") : (isDe ? "Ethik & Compliance" : "Ethics & Compliance"), 
                        icon: hasIntegrityRecord ? ShieldAlert : ShieldCheck, 
                        badge: hasIntegrityRecord ? "Audit" : "✓",
                        isAlert: hasIntegrityRecord
                      }
                    ].map(tab => {
                      const Icon = tab.icon
                      const isActive = inspectTab === tab.id
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setInspectTab(tab.id as any)}
                          className={`flex items-center justify-center gap-1.5 py-2 px-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                            isActive
                              ? tab.isAlert ? "bg-red-600 text-white shadow-xs" : "bg-[#0b99ff] text-white shadow-xs"
                              : tab.isAlert
                              ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
                              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-[#1e2027]"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{tab.label}</span>
                          {tab.badge && (
                            <span className={`text-[10px] px-1 py-0.2 rounded font-bold ${
                              isActive ? "bg-white/20 text-white" : tab.isAlert ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" : "text-emerald-600 dark:text-emerald-400"
                            }`}>
                              {tab.badge}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Scrollable Modal Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-h-[60vh]">
                  
                  {/* TAB 1: ARTICLE & FULL-TEXT PREVIEW */}
                  {inspectTab === "article" && (
                    <div className="space-y-6">
                      
                      {/* Structured Abstract Box */}
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-200/80 dark:border-[#272832] space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                          Structured Abstract
                        </span>
                        <p className="text-xs text-slate-800 dark:text-slate-200 italic leading-relaxed">
                          {selectedPaperForDetail?.abstract || "Evaluation of non-mydriatic fundus tele-screening protocols and automated convolutional neural networks for early detection of diabetic retinopathy in juvenile Type 1 Diabetes cohorts across rural clinical centers."}
                        </p>
                        {selectedPaperForDetail?.keywords && (
                          <div className="pt-2 border-t border-slate-200/50 dark:border-[#272832]/50 flex items-center gap-2 flex-wrap text-[11px]">
                            <span className="font-bold text-slate-500">Keywords:</span>
                            {selectedPaperForDetail.keywords.split(",").map((kw: string, i: number) => (
                              <span key={i} className="px-2 py-0.5 rounded-md bg-white dark:bg-[#1e2027] border border-slate-200 dark:border-[#272832] text-slate-700 dark:text-slate-300 font-medium">
                                {kw.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Structured Full Manuscript Reading Sections */}
                      <div className="space-y-5">
                        <div className="space-y-1.5">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-[#272832] pb-1">
                            <span>1. Introduction & Scientific Background</span>
                          </h4>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                            Early identification of progressive microvascular complications in metabolic cohorts remains one of the preeminent clinical challenges in preventative endocrinology and precision diagnostics. Contemporary guidelines mandate annual examinations, yet patient compliance in distributed and community settings frequently drops below 40% due to geographic constraints and limited subspecialist capacity.
                          </p>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                            This study proposes and benchmarks an asynchronous, high-throughput tele-screening pipeline utilizing multi-field non-mydriatic digital fundus photography paired with a calibrated deep convolutional neural network architecture validated across multi-center cohorts.
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-[#272832] pb-1">
                            <span>2. Materials, Study Design & Methodology</span>
                          </h4>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                            A prospective observational cohort of patients aged 8 to 22 years diagnosed with Type 1 Diabetes (minimum disease duration ≥ 3 years) was recruited across seven regional healthcare hubs between January 2024 and March 2026. High-resolution 45-degree macula- and disc-centered images were acquired using standardized non-mydriatic tabletop cameras operated by certified allied health personnel.
                          </p>
                          <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#131418] border border-slate-200 dark:border-[#272832] font-mono text-[11px] text-slate-600 dark:text-slate-400">
                            Primary Model Architecture: DenseNet-121 ensemble with attention-gated feature pyramids trained with cosine-annealed cross-entropy loss and test-time augmentation.
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-[#272832] pb-1">
                            <span>3. Results & Empirical Evaluation</span>
                          </h4>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                            Across 2,418 evaluable patient encounters, the automated tele-screening algorithm achieved an area under the receiver operating characteristic curve (AUROC) of 0.982 (95% CI: 0.974–0.989) for referable disease, with 94.7% sensitivity and 96.1% specificity when benchmarked against panel consensus adjudicated by three independent fellowship-trained retina specialists.
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-[#272832] pb-1">
                            <span>4. Discussion & Editorial Conclusion</span>
                          </h4>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                            The findings illustrate that automated, tele-enabled triage platforms can dramatically increase screening compliance without sacrificing diagnostic accuracy. Future iterations will integrate longitudinal biomarker telemetry and edge-computing inference directly on handheld capture devices.
                          </p>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB 2: SUBMITTED FILES & DOCUMENTS */}
                  {inspectTab === "files" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white text-xs">
                          Submitted Files & Primary Assets:
                        </span>
                        <span className="text-slate-400 text-[11px]">All files virus-checked & certified</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        
                        {/* Main Manuscript File */}
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-200 dark:border-[#272832] flex items-center justify-between hover:border-[#0b99ff] transition-all">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center font-bold text-xs shrink-0">
                              PDF
                            </div>
                            <div className="space-y-0.5 overflow-hidden">
                              <h5 className="font-bold text-slate-900 dark:text-white truncate text-xs">
                                {selectedPaperForDetail?.fileName || `${selectedPaperForDetail?.id}_Manuscript.pdf`}
                              </h5>
                              <p className="text-[11px] text-slate-400">
                                {selectedPaperForDetail?.fileSize || "3.4 MB"} · Main Manuscript Document
                              </p>
                            </div>
                          </div>
                          <a
                            href="/downloads/Scholarly_Open_Manuscript_Template.txt"
                            download={`${selectedPaperForDetail?.id || "Manuscript"}_Main_Document.pdf`}
                            className="p-2 rounded-lg bg-white dark:bg-[#1e2027] border border-slate-200 dark:border-[#272832] text-slate-700 dark:text-slate-300 hover:text-[#0b99ff] transition-colors"
                            title="Download Main Document"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </div>

                        {/* Supplementary Datasets */}
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-200 dark:border-[#272832] flex items-center justify-between hover:border-[#0b99ff] transition-all">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                              XLSX
                            </div>
                            <div className="space-y-0.5 overflow-hidden">
                              <h5 className="font-bold text-slate-900 dark:text-white truncate text-xs">
                                Supplementary_Cohort_Metrics.xlsx
                              </h5>
                              <p className="text-[11px] text-slate-400">
                                1.2 MB · Raw Baseline Tables
                              </p>
                            </div>
                          </div>
                          <a
                            href="/downloads/Scholarly_Open_Author_Checklist.txt"
                            download={`${selectedPaperForDetail?.id || "Manuscript"}_Supplementary_Data.xlsx`}
                            className="p-2 rounded-lg bg-white dark:bg-[#1e2027] border border-slate-200 dark:border-[#272832] text-slate-700 dark:text-slate-300 hover:text-[#0b99ff] transition-colors"
                            title="Download Supplementary Data"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </div>

                        {/* High-Res Figures Archive */}
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-200 dark:border-[#272832] flex items-center justify-between hover:border-[#0b99ff] transition-all">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-xs shrink-0">
                              ZIP
                            </div>
                            <div className="space-y-0.5 overflow-hidden">
                              <h5 className="font-bold text-slate-900 dark:text-white truncate text-xs">
                                Figures_Plates_300DPI.zip
                              </h5>
                              <p className="text-[11px] text-slate-400">
                                14.8 MB · 6 Vector Figures
                              </p>
                            </div>
                          </div>
                          <a
                            href="/downloads/Rights_Retention_Cover_Letter_Template.txt"
                            download={`${selectedPaperForDetail?.id || "Manuscript"}_Figures_Archive.zip`}
                            className="p-2 rounded-lg bg-white dark:bg-[#1e2027] border border-slate-200 dark:border-[#272832] text-slate-700 dark:text-slate-300 hover:text-[#0b99ff] transition-colors"
                            title="Download Figures Archive"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </div>

                        {/* Zenodo Open Data Repository */}
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-200 dark:border-[#272832] flex items-center justify-between hover:border-[#0b99ff] transition-all">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-sky-500/10 text-[#0b99ff] flex items-center justify-center font-bold text-xs shrink-0">
                              DOI
                            </div>
                            <div className="space-y-0.5 overflow-hidden">
                              <h5 className="font-bold text-slate-900 dark:text-white truncate text-xs">
                                Zenodo Open Science Data Repository
                              </h5>
                              <p className="text-[11px] text-[#0b99ff]">
                                {selectedPaperForDetail?.dataDoi || "doi.org/10.5281/zenodo.882910"}
                              </p>
                            </div>
                          </div>
                          <a
                            href={`https://${selectedPaperForDetail?.dataDoi || "doi.org/10.5281/zenodo.882910"}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-lg bg-white dark:bg-[#1e2027] border border-slate-200 dark:border-[#272832] text-slate-700 dark:text-slate-300 hover:text-[#0b99ff] transition-colors"
                            title="Open Zenodo Data"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>

                      </div>

                      <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 text-blue-900 dark:text-blue-300 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Download className="h-4 w-4 text-[#0b99ff]" />
                          <span>Download complete submission archive (.ZIP package with all raw documents & figures)</span>
                        </div>
                        <a
                          href="/downloads/Scholarly_Open_Manuscript_Template.txt"
                          download={`${selectedPaperForDetail?.id || "Manuscript"}_Complete_Dossier.zip`}
                          className="font-bold text-xs text-white bg-[#0b99ff] hover:bg-[#0088e0] px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
                        >
                          Download Dossier (.ZIP)
                        </a>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: COVER LETTER */}
                  {inspectTab === "cover_letter" && (
                    <div className="space-y-4">
                      <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-200/80 dark:border-[#272832] space-y-4">
                        <div className="border-b border-slate-200/60 dark:border-[#272832] pb-3 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Official Submission Cover Letter</span>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            To: Managing Editor, {selectedPaperForDetail?.journal}
                          </h4>
                        </div>

                        <div className="space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line font-serif">
                          {selectedPaperForDetail?.coverLetter || `Dear Editor-in-Chief,\n\nWe are pleased to submit our original research article titled "${selectedPaperForDetail?.title}" for publication consideration in ${selectedPaperForDetail?.journal}.\n\nThis work presents novel empirical insights and open clinical frameworks that directly align with your journal's scope. We confirm that this manuscript represents original work, has not been published previously, and is not currently under consideration by any other journal.\n\nAll authors have reviewed the final draft, agreed to its submission, and disclosed all relevant funding grants and institutional approvals.\n\nSincerely,\n${selectedPaperForDetail?.authorName || "Dr. Evelyn Vane"}\n${selectedPaperForDetail?.authorAffiliation || "Institute of Advanced Medical Sciences"}`}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: DECLARATIONS & COMPLIANCE / INTEGRITY AUDIT */}
                  {inspectTab === "compliance" && (
                    <div className="space-y-4">
                      {/* IM Escalation & Forensic Audit Box */}
                      {hasIntegrityRecord && (
                        <div className="p-4.5 rounded-xl bg-red-50/60 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 space-y-3">
                          <div className="flex items-center justify-between gap-2 border-b border-red-200/70 dark:border-red-900/40 pb-2.5">
                            <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                              <ShieldAlert className="h-4.5 w-4.5 text-red-600" />
                              <span className="font-bold text-xs uppercase tracking-wider">
                                Research Integrity Office (IM) Forensic Audit Record
                              </span>
                            </div>
                            <span className="text-[11px] font-bold text-red-600 bg-red-100 dark:bg-red-950 px-2 py-0.5 rounded border border-red-200 dark:border-red-900/30">
                              {matchingAlert?.escalationPriority ? `${matchingAlert.escalationPriority.toUpperCase()} PRIORITY` : "ESCALATED AUDIT"}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div className="p-2.5 rounded-lg bg-white/80 dark:bg-[#18191e] border border-red-100 dark:border-red-900/20">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">Lead Investigator</span>
                              <span className="font-bold text-slate-900 dark:text-white">
                                {matchingAlert?.escalatedBy || "Dr. Helen Vance (Research Integrity Manager)"}
                              </span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-white/80 dark:bg-[#18191e] border border-red-100 dark:border-red-900/20">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">Modality & Score</span>
                              <span className="font-bold text-red-600 dark:text-red-400">
                                {matchingAlert?.type || "AI Content Index"} ({matchingAlert?.score || "88% Probability"})
                              </span>
                            </div>
                          </div>

                          <div className="p-3 rounded-lg bg-white/90 dark:bg-[#18191e] border border-red-100 dark:border-red-900/20 space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-slate-700 dark:text-slate-300">IM Confidential Findings:</span>
                              <span className="text-[10px] text-slate-400">{matchingAlert?.escalatedAt || "Today"}</span>
                            </div>
                            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                              {matchingAlert?.escalationNotes || "Elevated AI probability (88% Probability) detected in Methodology. Recommend 14-day author inquiry for LLM disclosure."}
                            </p>
                          </div>

                          <div className="p-3 rounded-lg bg-white/90 dark:bg-[#18191e] border border-red-100 dark:border-red-900/20 space-y-1">
                            <span className="font-semibold text-slate-700 dark:text-slate-300 block text-xs">
                              EiC Adjudication & Action Taken:
                            </span>
                            <div className="flex items-center gap-2 text-xs font-semibold">
                              {selectedPaperForDetail?.status === "Rejected" ? (
                                <span className="inline-flex items-center gap-1.5 text-red-700 dark:text-red-400">
                                  <X className="h-3.5 w-3.5 text-red-600" />
                                  Direct Desk Rejection for Ethics Misconduct (Adjudicated by Prof. Aris Thorne)
                                </span>
                              ) : selectedPaperForDetail?.integrityStatus === "Raw Data Requested" ? (
                                <span className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                                  14-Day Formal Raw Data Request Dispatched to Authors
                                </span>
                              ) : selectedPaperForDetail?.integrityStatus === "Inquiry Dispatched" ? (
                                <span className="inline-flex items-center gap-1.5 text-sky-700 dark:text-sky-400">
                                  <Send className="h-3.5 w-3.5 text-[#0b99ff]" />
                                  Formal Ethics Inquiry Dispatched to Corresponding Author
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                                  Ethics Flag Cleared & Certified Compliant
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Standard Declarations Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-200 dark:border-[#272832] space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Institutional Review Board (IRB) / Ethics</span>
                          <p className="font-semibold text-slate-900 dark:text-white text-xs">
                            {selectedPaperForDetail?.ethicsIrb || "IRB-MED-2026-T1D-092 (Approved)"}
                          </p>
                          <p className="text-[11px] text-slate-500">Informed consent obtained from all participating subjects.</p>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-200 dark:border-[#272832] space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Funding & Research Grants</span>
                          <p className="font-semibold text-slate-900 dark:text-white text-xs">
                            {selectedPaperForDetail?.fundingGrant || "NIH-EY-2026-4401 · National Institutes of Health"}
                          </p>
                          <p className="text-[11px] text-slate-500">Funders played no role in study design or data collection.</p>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-200 dark:border-[#272832] space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Conflict of Interest (COI)</span>
                          <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                            No Competing Financial Interests Declared ✓
                          </p>
                          <p className="text-[11px] text-slate-500">All co-authors signed standard ICMJE conflict forms.</p>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-200 dark:border-[#272832] space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Automated Pre-Flight Integrity</span>
                          <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                            Plagiarism: {selectedPaperForDetail?.plagiarismScore || 4}% · AI Index: {selectedPaperForDetail?.aiScore || 2}% (Vetted ✓)
                          </p>
                          <p className="text-[11px] text-slate-500">Vetted against Crossref & iThenticate databases.</p>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </>
            )
          })()}

          {/* Modal Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-[#272832] bg-slate-50/70 dark:bg-[#131418]/80 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <a
                href="/downloads/Scholarly_Open_Manuscript_Template.txt"
                download={`${selectedPaperForDetail?.id || "Manuscript"}_Main_Document.pdf`}
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#0b99ff] bg-white dark:bg-[#1e2027] border border-slate-200 dark:border-[#272832] px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <Download className="h-4 w-4 text-[#0b99ff]" />
                <span>Download PDF</span>
              </a>

              <Button
                onClick={() => {
                  const paper = selectedPaperForDetail
                  setSelectedPaperForDetail(null)
                  if (paper) {
                    setSelectedPaperForJmHelp(paper)
                    setJmHelpType("chase_reviewers")
                    setJmHelpNote("")
                  }
                }}
                variant="outline"
                className="text-xs h-9 px-3 border-slate-200 dark:border-[#272832] text-slate-700 dark:text-slate-300 hover:text-[#0b99ff] cursor-pointer"
              >
                <MessageSquare className="h-3.5 w-3.5 mr-1.5 text-[#0b99ff]" />
                <span>Contact JM Desk</span>
              </Button>
            </div>

            <Button
              onClick={() => {
                setSelectedPaperForDetail(null)
                setInspectTab("article")
              }}
              className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-bold h-9 px-5 rounded-xl cursor-pointer shadow-xs"
            >
              {isDe ? "Schließen" : "Close"}
            </Button>
          </div>

        </DialogContent>
      </Dialog>

      {/* ================= MODAL: EIC IM ESCALATION BRIEF & RULING ================= */}
      <Dialog open={!!selectedEscalationAlert} onOpenChange={(open) => !open && setSelectedEscalationAlert(null)}>
        <DialogContent className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 sm:max-w-lg rounded-xl p-6 shadow-xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-red-600 dark:text-red-400" />
              Integrity Escalation Review
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Review confidential findings from the Research Integrity Office and submit an editorial ruling.
            </DialogDescription>
          </DialogHeader>

          {selectedEscalationAlert && (
            <div className="space-y-4 pt-1 text-xs">
              {/* Compact Reference Header */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{selectedEscalationAlert.paperId}</span>
                  <span className="text-[11px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-2 py-0.5 rounded border border-red-200 dark:border-red-900/30">
                    {selectedEscalationAlert.type} ({selectedEscalationAlert.score})
                  </span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                  {selectedEscalationAlert.title}
                </div>
              </div>

              {/* IM Forensic Note */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs gap-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                    Investigator Brief · <span className="font-normal text-slate-500">{selectedEscalationAlert?.escalatedBy?.replace(/\s*\(.*\)/, "") || "Dr. Helen Vance"} (IM)</span>
                  </span>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {selectedEscalationAlert.escalatedAt || "Today"}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs leading-relaxed">
                  {selectedEscalationAlert.escalationNotes || "Integrity alert referred for Editor-in-Chief review."}
                </div>
              </div>

              {/* Editorial Decision Selector */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Editorial Ruling
                </label>
                <select
                  value={eicDecisionAction}
                  onChange={(e) => {
                    const act = e.target.value as any
                    setEicDecisionAction(act)
                    setEicRulingLetter(getEthicsDecisionLetterTemplate(act, selectedEscalationAlert, user.name, selectedEscalationAlert.journal || user.journal))
                  }}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-[#0b99ff] cursor-pointer"
                >
                  <option value="inquiry">Send 14-Day Formal Ethics Inquiry to Authors</option>
                  <option value="raw_data">Request Original Uncropped Raw Data Files</option>
                  <option value="desk_reject">Issue Immediate Desk Rejection for Misconduct</option>
                  <option value="clear">Dismiss Integrity Flag & Resume Peer Review</option>
                </select>
              </div>

              {/* Official Letter Preview & Customization (Visible when an author-facing action is selected) */}
              {eicDecisionAction !== "clear" ? (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-[#0b99ff]" />
                      <span>Official Email Notification to Author (Editable Preview)</span>
                    </label>
                    <span className="text-[11px] text-slate-400">COPE-compliant template</span>
                  </div>
                  <textarea
                    rows={6}
                    value={eicRulingLetter}
                    onChange={(e) => setEicRulingLetter(e.target.value)}
                    className="w-full p-3 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Recipient: <strong>Corresponding Author & Co-Authors</strong></span>
                    <span>CC: <strong>Journal Manager, Integrity Office</strong></span>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-xs">
                  ✓ <strong>Internal Action:</strong> The integrity flag will be cleared and the manuscript certified compliant. No rejection/inquiry email will be sent to the authors, and standard peer review will proceed.
                </div>
              )}

              {/* Optional Comment to Author / Internal Audit */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Internal Editorial Remarks (Optional)
                </label>
                <input
                  type="text"
                  value={eicDecisionComment}
                  onChange={(e) => setEicDecisionComment(e.target.value)}
                  placeholder="Internal audit notes for editorial file..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedEscalationAlert(null)}
                  className="text-xs h-8 px-3 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    if (!selectedEscalationAlert) return
                    const alert = selectedEscalationAlert
                    const paperId = alert.paperId

                    let actionLabel = ""
                    let confirmMsg = ""
                    let confirmColor = "bg-[#0b99ff] hover:bg-[#0088e0]"

                    if (eicDecisionAction === "clear") {
                      actionLabel = "Dismiss Flag & Resume Review"
                      confirmMsg = `Are you sure you want to dismiss the integrity alert for manuscript ${paperId} and certify it as clean?`
                      confirmColor = "bg-emerald-600 hover:bg-emerald-700"
                    } else if (eicDecisionAction === "desk_reject") {
                      actionLabel = "Desk Reject for Misconduct"
                      confirmMsg = `Are you sure you want to issue an immediate desk rejection for manuscript ${paperId} due to ethics/integrity breach?`
                      confirmColor = "bg-red-600 hover:bg-red-700"
                    } else if (eicDecisionAction === "raw_data") {
                      actionLabel = "Dispatch Raw Data Request"
                      confirmMsg = `Are you sure you want to request original uncropped raw data files from the authors of manuscript ${paperId} (14-day deadline)?`
                    } else {
                      actionLabel = "Dispatch Ethics Inquiry"
                      confirmMsg = `Are you sure you want to send a formal 14-day ethics inquiry letter to the corresponding author of manuscript ${paperId}?`
                    }

                    setSelectedEscalationAlert(null)

                    triggerConfirm({
                      title: `Confirm Ruling: ${actionLabel}?`,
                      message: confirmMsg,
                      confirmButtonLabel: `Yes, Execute Ruling`,
                      confirmColorClass: confirmColor,
                      onConfirm: () => {
                        if (onResolveIntegrity) onResolveIntegrity(alert.id, "clear")

                        if (eicDecisionAction === "clear") {
                          setManuscripts(prev => prev.map(m => m.id === paperId ? { ...m, integrityStatus: "Clean", status: "Under Review" } : m))
                          if (onUpdateManuscriptStatus) onUpdateManuscriptStatus(paperId, "Under Review")
                          if (onAddNotification) {
                            onAddNotification({
                              paperId: paperId,
                              paperTitle: alert.title,
                              journal: alert.journal || user.journal,
                              type: "eic_cleared",
                              severity: "normal",
                              actorName: `${user.name} (${user.title || "Editor-in-Chief"})`,
                              actorRole: "Editor-in-Chief",
                              headline: `Ethics Flag Cleared`,
                              summary: `Ethics flag dismissed for ${paperId}.`,
                              recipient: "Journal Manager & Research Integrity Office"
                            })
                          }
                          triggerToast(`✓ Ethics flag dismissed. Manuscript ${paperId} certified clean.`)
                        } else if (eicDecisionAction === "desk_reject") {
                          setManuscripts(prev => prev.map(m => m.id === paperId ? { ...m, integrityStatus: "Breach Confirmed", status: "Rejected" } : m))
                          if (onUpdateManuscriptStatus) onUpdateManuscriptStatus(paperId, "Rejected")
                          if (onAddNotification) {
                            onAddNotification({
                              paperId: paperId,
                              paperTitle: alert.title,
                              journal: alert.journal || user.journal,
                              type: "eic_desk_reject",
                              severity: "urgent",
                              actorName: `${user.name} (${user.title || "Editor-in-Chief"})`,
                              actorRole: "Editor-in-Chief",
                              headline: `Desk Rejection Issued`,
                              summary: `Desk rejection issued for ${paperId}.`,
                              dispatchedLetter: eicRulingLetter,
                              recipient: "Corresponding Author & Co-Authors"
                            })
                          }
                          triggerToast(`✓ Manuscript ${paperId} desk rejected.`)
                        } else if (eicDecisionAction === "raw_data") {
                          setManuscripts(prev => prev.map(m => m.id === paperId ? { ...m, integrityStatus: "Raw Data Requested", status: "Revision Required" } : m))
                          if (onUpdateManuscriptStatus) onUpdateManuscriptStatus(paperId, "Revision Required")
                          if (onAddNotification) {
                            onAddNotification({
                              paperId: paperId,
                              paperTitle: alert.title,
                              journal: alert.journal || user.journal,
                              type: "eic_raw_data",
                              severity: "high",
                              actorName: `${user.name} (${user.title || "Editor-in-Chief"})`,
                              actorRole: "Editor-in-Chief",
                              headline: `Raw Data Requested`,
                              summary: `Raw data request sent for ${paperId}.`,
                              dispatchedLetter: eicRulingLetter,
                              recipient: "Corresponding Author"
                            })
                          }
                          triggerToast(`✓ Raw data request dispatched for ${paperId}.`)
                        } else {
                          setManuscripts(prev => prev.map(m => m.id === paperId ? { ...m, integrityStatus: "Inquiry Dispatched", status: "Revision Required" } : m))
                          if (onUpdateManuscriptStatus) onUpdateManuscriptStatus(paperId, "Revision Required")
                          if (onAddNotification) {
                            onAddNotification({
                              paperId: paperId,
                              paperTitle: alert.title,
                              journal: alert.journal || user.journal,
                              type: "eic_inquiry",
                              severity: "high",
                              actorName: `${user.name} (${user.title || "Editor-in-Chief"})`,
                              actorRole: "Editor-in-Chief",
                              headline: `Author Inquiry Sent`,
                              summary: `Inquiry letter regarding ${alert.type} sent for ${paperId}.`,
                              dispatchedLetter: eicRulingLetter,
                              recipient: "Corresponding Author"
                            })
                          }
                          triggerToast(`✓ Formal ethics inquiry letter dispatched for ${paperId}.`)
                        }
                      }
                    })
                  }}
                  className="bg-[#0b99ff] hover:bg-[#0088e0] text-white font-semibold text-xs h-8 px-4 cursor-pointer shadow-xs"
                >
                  Submit Ruling
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: INTEGRITY PRE-SCAN INSPECTOR ================= */}
      <Dialog open={!!selectedPaperForIntegrity} onOpenChange={(open) => !open && setSelectedPaperForIntegrity(null)}>
        <DialogContent className="bg-white dark:bg-[#18191e] border border-slate-200 dark:border-[#272832] text-slate-900 dark:text-slate-100 sm:max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {(selectedPaperForIntegrity?.integrityStatus === "Flagged" || (selectedPaperForIntegrity?.plagiarismScore || 0) > 15 || (selectedPaperForIntegrity?.aiScore || 0) > 30) ? (
                <ShieldAlert className="h-5 w-5 text-red-600" />
              ) : (
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
              )}
              Automated Integrity & Forensic Report
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Manuscript ID: {selectedPaperForIntegrity?.id} · {selectedPaperForIntegrity?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className={`p-3 rounded-xl border text-center ${
                (selectedPaperForIntegrity?.plagiarismScore || 0) > 15
                  ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/40"
                  : "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/40"
              }`}>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Similarity Index</span>
                <span className={`text-lg font-bold ${
                  (selectedPaperForIntegrity?.plagiarismScore || 0) > 15 ? "text-red-600" : "text-emerald-600"
                }`}>
                  {selectedPaperForIntegrity?.plagiarismScore ?? 4}% { (selectedPaperForIntegrity?.plagiarismScore || 0) > 15 ? "(Flagged)" : "(Clear)" }
                </span>
              </div>
              <div className={`p-3 rounded-xl border text-center ${
                (selectedPaperForIntegrity?.aiScore || 0) > 30
                  ? "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/40"
                  : "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/40"
              }`}>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">AI Text Prob.</span>
                <span className={`text-lg font-bold ${
                  (selectedPaperForIntegrity?.aiScore || 0) > 30 ? "text-amber-600" : "text-emerald-600"
                }`}>
                  {selectedPaperForIntegrity?.aiScore ?? 2}% { (selectedPaperForIntegrity?.aiScore || 0) > 30 ? "(Elevated AI)" : "(Human)" }
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-200 dark:border-[#272832] space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Figure Image Forensics:</span>
                <span className={`font-bold ${selectedPaperForIntegrity?.id === "SOSSH-26-SRW107" ? "text-red-600" : "text-emerald-600"}`}>
                  {selectedPaperForIntegrity?.id === "SOSSH-26-SRW107" ? "Potential duplication flagged ⚠️" : "No manipulation detected ✓"}
                </span>
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
      {/* ========================================================================= */}
      {/* CONFIRMATION POPUP DIALOG FOR EDITOR                                       */}
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
              {isDe ? "Nein, Abbrechen" : "No, Cancel"}
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

      {/* ================= MODAL: REVIEWER AUDIT & HONORARIUM SCORING ================= */}
      <Dialog open={!!scoringReviewerData} onOpenChange={(open) => !open && setScoringReviewerData(null)}>
        <DialogContent className="bg-white dark:bg-[#18191e] border border-slate-200 dark:border-[#272832] text-slate-900 dark:text-slate-100 sm:max-w-lg rounded-2xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Coins className="h-5 w-5 text-[#0b99ff]" />
              Audit Reviewer Quality & Approve Honorarium
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Manuscript: {scoringReviewerData?.paperId} · Reviewer: {scoringReviewerData?.reviewerName}
            </DialogDescription>
          </DialogHeader>

          {scoringReviewerData && (
            <div className="space-y-4 py-2 text-xs">
              {/* Referee Overview Bar */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-200 dark:border-[#272832] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Referee Recommendation:</span>
                  <span className="font-bold text-[#0b99ff] bg-[#0b99ff]/10 px-2 py-0.5 rounded border border-[#0b99ff]/20">
                    {scoringReviewerData.recommendation}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Submission Timeliness:</span>
                  <span className="text-slate-700 dark:text-slate-300">{scoringReviewerData.submissionDate} (Within 14-Day Cycle ✓)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Qualification & English Level:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">COPE Verified Gateway (≥ 80%) ✓</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800 pt-1.5 mt-1.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Designated Payout Rail:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      {scoringReviewerData.paymentMethod}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400 font-mono text-[11px]">{scoringReviewerData.paymentAccount}</span>
                  </div>
                </div>
              </div>

              {/* Rigor Score Slider & Input */}
              <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-bold text-slate-900 dark:text-white text-xs block">
                      Handling Editor Rigor Score (0–100%)
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Evaluates depth, methodology validation, and actionability for authors.
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={scoringReviewerData.rigorScore}
                      onChange={(e) => {
                        const val = Math.max(0, Math.min(100, Number(e.target.value) || 0))
                        setScoringReviewerData(prev => prev ? { ...prev, rigorScore: val } : null)
                      }}
                      className="w-16 px-2 py-1 text-right font-bold text-sm rounded-lg border border-blue-300 dark:border-blue-800 bg-white dark:bg-[#131418] text-[#0b99ff] focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                    />
                    <span className="font-bold text-slate-600 dark:text-slate-400">%</span>
                  </div>
                </div>

                <input
                  type="range"
                  min={50}
                  max={100}
                  value={scoringReviewerData.rigorScore}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    setScoringReviewerData(prev => prev ? { ...prev, rigorScore: val } : null)
                  }}
                  className="w-full h-2 bg-blue-200 dark:bg-blue-900 rounded-lg appearance-none cursor-pointer accent-[#0b99ff]"
                />

                {/* Score Bracket & Dynamic Calculation Card */}
                <div className="p-3 rounded-lg bg-white dark:bg-[#131418] border border-blue-200/80 dark:border-blue-900/40 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Calculated Honorarium</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xl font-extrabold ${scoringReviewerData.rigorScore >= 80 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"}`}>
                        €{calculateReviewerHonorarium(scoringReviewerData.rigorScore).toFixed(2)} EUR
                      </span>
                      {scoringReviewerData.rigorScore >= 80 && (
                        <span className="text-[10px] text-slate-500 font-medium">(Capped at €50.00 EUR max)</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Rigor Status</span>
                    {scoringReviewerData.rigorScore >= 95 ? (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Exceptional (€50 Cap)</span>
                    ) : scoringReviewerData.rigorScore >= 85 ? (
                      <span className="text-xs font-bold text-[#0b99ff]">High Rigor (Approved)</span>
                    ) : scoringReviewerData.rigorScore >= 80 ? (
                      <span className="text-xs font-bold text-amber-600">Meets Baseline (€35)</span>
                    ) : (
                      <span className="text-xs font-bold text-rose-600">Ineligible (&lt;80% COPE)</span>
                    )}
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 leading-relaxed">
                  Formula: Base €35.00 at 80% score + scaled up to €50.00 EUR maximum cap for 100% score. Payouts are routed exclusively via <strong>Wise</strong>, <strong>PayPal</strong>, or <strong>Payoneer</strong>.
                </div>
              </div>

              {/* Editor Comments for Reviewer */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Handling Editor Feedback Note to Reviewer
                </label>
                <textarea
                  rows={2}
                  value={scoringReviewerData.editorNotes}
                  onChange={(e) => setScoringReviewerData(prev => prev ? { ...prev, editorNotes: e.target.value } : null)}
                  placeholder="Optional constructive comments regarding report quality..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-[#272832] bg-white dark:bg-[#131418] text-xs focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-[#272832]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setScoringReviewerData(null)}
              className="text-xs h-8.5 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!scoringReviewerData || scoringReviewerData.rigorScore < 80}
              onClick={() => {
                if (!scoringReviewerData) return
                const amount = calculateReviewerHonorarium(scoringReviewerData.rigorScore)
                setApprovedHonoraria(prev => ({
                  ...prev,
                  [scoringReviewerData.reviewerKey]: {
                    score: scoringReviewerData.rigorScore,
                    amount: amount,
                    paymentMethod: scoringReviewerData.paymentMethod,
                    paymentAccount: scoringReviewerData.paymentAccount,
                    approvedAt: new Date().toISOString().split("T")[0]
                  }
                }))
                triggerToast(`✓ Quality score (${scoringReviewerData.rigorScore}%) approved: €${amount.toFixed(2)} EUR honorarium authorized via ${scoringReviewerData.paymentMethod} for ${scoringReviewerData.reviewerName}.`)
                setScoringReviewerData(null)
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-8.5 px-4 rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Check className="h-3.5 w-3.5 mr-1.5" />
              Approve & Authorize Honorarium (€{scoringReviewerData ? calculateReviewerHonorarium(scoringReviewerData.rigorScore).toFixed(2) : "0.00"} EUR)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
