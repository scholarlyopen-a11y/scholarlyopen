"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  Check, 
  AlertCircle, 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  Users, 
  Eye, 
  Plus, 
  Send, 
  AlertTriangle, 
  Cpu, 
  BarChart3, 
  Settings, 
  ShieldAlert, 
  LogOut, 
  ExternalLink, 
  ArrowRight, 
  RefreshCw, 
  X, 
  ChevronRight, 
  FileCheck, 
  ThumbsUp, 
  UserPlus,
  Bell,
  Sliders,
  Sparkles,
  Search,
  BookOpen,
  Sun,
  Moon,
  Inbox,
  Archive,
  MessageSquareOff,
  MessageSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type UserRole = "admin" | "author" | "reviewer" | "editor" | "ria" | "jm"

// Manuscript mock data structure
interface Manuscript {
  id: string
  title: string
  journal: string
  status: "Draft" | "Awaiting Initial Check" | "Under Review" | "Revision Required" | "Revision Under Evaluation" | "Accepted" | "Rejected"
  date: string
  reviewers: string[]
  integrityStatus: "Clean" | "Flagged" | "Unchecked"
  plagiarismScore?: number
  aiScore?: number
}

// Review Invitation mock data
interface ReviewInvitation {
  id: string
  title: string
  journal: string
  deadline: string
  abstract: string
}

// Active Review mock data
interface ActiveReview {
  id: string
  title: string
  journal: string
  deadline: string
  status: "Pending" | "In Progress" | "Completed"
  recommendation?: string
}

// Integrity Alert mock data
interface IntegrityAlert {
  id: string
  paperId: string
  title: string
  journal: string
  type: "Plagiarism Match" | "AI Content Index" | "Figure Duplication"
  score: string
  detail: string
  severity: "info" | "warning" | "critical"
  status: "Flagged" | "Escalated" | "Cleared"
}

// Workspace User registry data
interface WorkspaceUser {
  id: string
  name: string
  email: string
  role: UserRole
  activeTasks: number
  status: "Active" | "Pending Invitation"
}

// Review Feedback and Comments Moderation data
interface ReviewFeedback {
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

// Reviewer suggestions structure with categorised states
interface ReviewerSuggestion {
  name: string
  email: string
  status: "Active" | "Busy" | "Inactive"
  activeTasks: number
  matchScore: number
  specialization: string
}

// Journal Archive Communications log
interface ArchiveLog {
  id: string
  paperId: string
  actor: string
  action: string
  timestamp: string
  details: string
}

interface JournalInfo {
  name: string
  code: string
  submissions: number
  latency: number // average days to decision
  status: "Active" | "Maintenance"
  editorInChief: string
}

export default function Editorial360Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mode, setMode] = useState<"login" | "register">("login")
  const [role, setRole] = useState<UserRole>("jm")
  const [email, setEmail] = useState("manager@scholarlyopen.org")
  const [password, setPassword] = useState("password123")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  // Registration States
  const [regName, setRegName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regOrcid, setRegOrcid] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regRole, setRegRole] = useState<"author" | "reviewer">("author")

  // Theme states
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock Databases in state for interactivity
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([
    {
      id: "MS-2026-081",
      title: "Machine Learning Approaches in Renewable Energy Forecasting",
      journal: "Engineering & Applied Sciences",
      status: "Under Review",
      date: "2026-05-12",
      reviewers: ["Dr. Evelyn Vane"],
      integrityStatus: "Clean",
      plagiarismScore: 8,
      aiScore: 12
    },
    {
      id: "MS-2026-094",
      title: "Socio-Economic Impacts of Urban Green Spaces in Moderate Climates",
      journal: "Social Sciences & Humanities",
      status: "Revision Required",
      date: "2026-05-28",
      reviewers: ["Prof. Aris Thorne"],
      integrityStatus: "Clean",
      plagiarismScore: 11,
      aiScore: 5
    },
    {
      id: "MS-2026-102",
      title: "A Security Framework for Decentralized Ledgers in Public Records",
      journal: "Engineering & Applied Sciences",
      status: "Accepted",
      date: "2026-04-01",
      reviewers: ["Dr. Evelyn Vane", "Dr. Marcus Vance"],
      integrityStatus: "Clean",
      plagiarismScore: 4,
      aiScore: 3
    },
    {
      id: "MS-2026-115",
      title: "Synthesizing Biodegradable Polymers for Soft Robotics",
      journal: "Engineering & Applied Sciences",
      status: "Awaiting Initial Check",
      date: "2026-06-05",
      reviewers: [],
      integrityStatus: "Unchecked"
    },
    {
      id: "MS-2026-118",
      title: "Optimization of Silicon Anodes for Lithium-Ion Batteries",
      journal: "Engineering & Applied Sciences",
      status: "Under Review",
      date: "2026-06-02",
      reviewers: [],
      integrityStatus: "Flagged",
      plagiarismScore: 18,
      aiScore: 88
    },
    {
      id: "MS-2026-121",
      title: "Gender Wage Disparity: A Multi-Country Meta-Analysis",
      journal: "Social Sciences & Humanities",
      status: "Under Review",
      date: "2026-06-04",
      reviewers: [],
      integrityStatus: "Flagged",
      plagiarismScore: 34,
      aiScore: 15
    }
  ])

  const [reviewInvitations, setReviewInvitations] = useState<ReviewInvitation[]>([
    {
      id: "INV-2026-88",
      title: "Decentralized Federated Learning on Non-IID Medical Data",
      journal: "Engineering & Applied Sciences",
      deadline: "2026-06-25",
      abstract: "This paper proposes a novel framework for federated learning in decentralized healthcare environments. By utilizing differential privacy and a custom weight aggregation protocol, we demonstrate high diagnostic accuracy across non-IID datasets without compromising patient confidentiality."
    }
  ])

  const [activeReviews, setActiveReviews] = useState<ActiveReview[]>([
    {
      id: "REV-2026-12",
      title: "Climate Adaptation Strategies in Coastal Communities",
      journal: "Social Sciences & Humanities",
      deadline: "2026-06-18",
      status: "In Progress"
    }
  ])

  const [reviews, setReviews] = useState<ReviewFeedback[]>([
    {
      id: "REV-FB-01",
      paperId: "MS-2026-094",
      reviewerName: "Prof. Aris Thorne",
      originality: 3,
      methodology: 4,
      clarity: 3,
      significance: 4,
      commentsAuthor: "The authors should expand the section on green spaces to detail the specific local climate conditions. The statistical modeling is reasonable but needs more clear equations.",
      commentsEditor: "A solid study overall. The author is capable of these modifications.",
      recommendation: "Minor Revision",
      status: "Released",
      sanitizedCommentsAuthor: "The authors should expand the section on green spaces to detail the specific local climate conditions. The statistical modeling is reasonable but needs more clear equations."
    },
    {
      id: "REV-FB-02",
      paperId: "MS-2026-081",
      reviewerName: "Dr. Evelyn Vane",
      originality: 4,
      methodology: 4,
      clarity: 4,
      significance: 5,
      commentsAuthor: "This machine learning framework is highly innovative. However, the author used some extremely harsh words in section 4 criticizing the previous studies, calling them 'foolish and completely flawed'. This should be sanitized before author sees it.",
      commentsEditor: "Excellent paper, but please edit out the reviewer's reference to the author's tone or vice-versa, and the criticisms in paragraph 3.",
      recommendation: "Minor Revision",
      status: "Pending Moderation"
    }
  ])

  const [integrityAlerts, setIntegrityAlerts] = useState<IntegrityAlert[]>([
    {
      id: "ALT-001",
      paperId: "MS-2026-118",
      title: "Optimization of Silicon Anodes for Lithium-Ion Batteries",
      journal: "Engineering & Applied Sciences",
      type: "AI Content Index",
      score: "88% Probability",
      detail: "Statistical signature mismatch in 'Methodology' suggests large-language model generation.",
      severity: "warning",
      status: "Flagged"
    },
    {
      id: "ALT-002",
      paperId: "MS-2026-121",
      title: "Gender Wage Disparity: A Multi-Country Meta-Analysis",
      journal: "Social Sciences & Humanities",
      type: "Plagiarism Match",
      score: "34% Similarity",
      detail: "Overlap of 34% detected with 'International Labor Statistics Review (2024)' in Intro and Results sections.",
      severity: "critical",
      status: "Flagged"
    }
  ])

  const [users, setUsers] = useState<WorkspaceUser[]>([
    { id: "USR-01", name: "Dr. Evelyn Vane", email: "e.vane@scholarlyopen.org", role: "reviewer", activeTasks: 2, status: "Active" },
    { id: "USR-02", name: "Dr. Marcus Vance", email: "m.vance@scholarlyopen.org", role: "reviewer", activeTasks: 1, status: "Active" },
    { id: "USR-03", name: "Prof. Aris Thorne", email: "a.thorne@scholarlyopen.org", role: "editor", activeTasks: 4, status: "Active" },
    { id: "USR-04", name: "Dr. Sarah Jenkins", email: "s.jenkins@scholarlyopen.org", role: "ria", activeTasks: 2, status: "Active" },
    { id: "USR-05", name: "Prof. David Miller", email: "d.miller@scholarlyopen.org", role: "editor", activeTasks: 0, status: "Pending Invitation" }
  ])

  const [archiveLogs, setArchiveLogs] = useState<ArchiveLog[]>([
    {
      id: "LOG-100",
      paperId: "MS-2026-102",
      actor: "Prof. Aris Thorne (Editor)",
      action: "Decision Logged",
      timestamp: "2026-06-01 10:24",
      details: "Manuscript accepted for publication after review verification."
    },
    {
      id: "LOG-101",
      paperId: "MS-2026-094",
      actor: "Sarah Jenkins (Journal Manager)",
      action: "Review Verified & Released",
      timestamp: "2026-06-03 14:15",
      details: "Released sanitized review feedback by Prof. Aris Thorne to the principal author."
    }
  ])

  // Exact 5 suggested reviewer options categorized by status
  const reviewerSuggestions: ReviewerSuggestion[] = [
    { name: "Dr. Evelyn Vane", email: "e.vane@scholarlyopen.org", status: "Active", activeTasks: 0, matchScore: 98, specialization: "Renewable Energy Systems, ML" },
    { name: "Dr. Marcus Vance", email: "m.vance@scholarlyopen.org", status: "Busy", activeTasks: 2, matchScore: 91, specialization: "Power Grid Optimization" },
    { name: "Prof. Aris Thorne", email: "a.thorne@scholarlyopen.org", status: "Active", activeTasks: 1, matchScore: 85, specialization: "Data Analytics, Climatology" },
    { name: "Dr. Sarah Jenkins", email: "s.jenkins@scholarlyopen.org", status: "Inactive", activeTasks: 0, matchScore: 78, specialization: "Algorithms, Signal Processing" },
    { name: "Prof. Clara Zhang", email: "c.zhang@scholarlyopen.org", status: "Busy", activeTasks: 3, matchScore: 95, specialization: "Biodegradable Polymers" },
  ]

  const [journals, setJournals] = useState<JournalInfo[]>([
    { name: "Engineering & Applied Sciences", code: "EAS", submissions: 142, latency: 22, status: "Active", editorInChief: "Prof. Clara Zhang" },
    { name: "Social Sciences & Humanities", code: "SSH", submissions: 98, latency: 26, status: "Active", editorInChief: "Prof. Aris Thorne" },
    { name: "Social Sciences Open", code: "SSO", submissions: 54, latency: 24, status: "Active", editorInChief: "Dr. Evelyn Vane" },
    { name: "Data Science", code: "DS", submissions: 48, latency: 18, status: "Active", editorInChief: "Dr. Marcus Vance" }
  ])

  // Dialog and Wizard control states
  const [isSubmitWizardOpen, setIsSubmitWizardOpen] = useState(false)
  const [submitStep, setSubmitStep] = useState(1)
  const [newTitle, setNewTitle] = useState("")
  const [newJournal, setNewJournal] = useState("Engineering & Applied Sciences")
  const [newAbstract, setNewAbstract] = useState("")
  const [newKeywords, setNewKeywords] = useState("")

  const [isRevisionDialogOpen, setIsRevisionDialogOpen] = useState(false)
  const [revisionPaperId, setRevisionPaperId] = useState("")
  
  const [isInviteUserOpen, setIsInviteUserOpen] = useState(false)
  const [inviteName, setInviteName] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<UserRole>("reviewer")

  const [isAssignReviewerOpen, setIsAssignReviewerOpen] = useState(false)
  const [assignPaperId, setAssignPaperId] = useState("")

  const [isDecisionOpen, setIsDecisionOpen] = useState(false)
  const [decisionPaperId, setDecisionPaperId] = useState("")
  const [decisionType, setDecisionType] = useState<"Accepted" | "Rejected" | "Revision Required">("Accepted")
  const [decisionNote, setDecisionNote] = useState("")

  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false)
  const [reviewPaperId, setReviewPaperId] = useState("")
  const [scoreOriginality, setScoreOriginality] = useState(4)
  const [scoreMethodology, setScoreMethodology] = useState(4)
  const [scoreClarity, setScoreClarity] = useState(4)
  const [scoreSignificance, setScoreSignificance] = useState(4)
  const [reviewFeedback, setReviewFeedback] = useState("")
  const [reviewRecommendation, setReviewRecommendation] = useState("Accept")

  const [isForensicsOpen, setIsForensicsOpen] = useState(false)
  const [activeAlertId, setActiveAlertId] = useState("")

  // Moderation Dialog states
  const [isModerationOpen, setIsModerationOpen] = useState(false)
  const [moderatingReviewId, setModeratingReviewId] = useState("")
  const [modRedactdComments, setModRedactdComments] = useState("")

  // Admin settings toggles
  const [doubleBlind, setDoubleBlind] = useState(true)
  const [autoIntegrity, setAutoIntegrity] = useState(true)
  const [orcidRequired, setOrcidRequired] = useState(false)

  // Active sub-page tab for JM / Editor
  const [activeJmTab, setActiveJmTab] = useState<"moderation" | "archives" | "users">("moderation")

  const roles: { id: UserRole; label: string; placeholder: string }[] = [
    { id: "jm", label: "Journal Manager", placeholder: "manager@scholarlyopen.org" },
    { id: "editor", label: "Editor", placeholder: "editor@scholarlyopen.org" },
    { id: "reviewer", label: "Reviewer", placeholder: "reviewer@scholarlyopen.org" },
    { id: "author", label: "Author", placeholder: "author@scholarlyopen.org" },
    { id: "ria", label: "QC Admin", placeholder: "ria@scholarlyopen.org" },
    { id: "admin", label: "Admin", placeholder: "admin@scholarlyopen.org" },
  ]

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }
    setLoading(true)
    setError("")
    setSuccess("")
    
    // Successful simulation login
    setTimeout(() => {
      setLoading(false)
      setIsLoggedIn(true)
      setSuccess("Successfully authenticated into the Editorial360 workspace.")
    }, 1000)
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (!regName || !regEmail || !regPassword) {
      setError("Please fill in all required fields")
      return
    }
    setLoading(true)
    setError("")
    setSuccess("")

    setTimeout(() => {
      setLoading(false)
      setSuccess("Account request approved! You can now log in using your credentials.")
      // Add user to the registry
      const newUser: WorkspaceUser = {
        id: `USR-${Math.floor(Math.random() * 100) + 10}`,
        name: regName,
        email: regEmail,
        role: regRole,
        activeTasks: 0,
        status: "Active"
      }
      setUsers(prev => [...prev, newUser])
      setMode("login")
      setRole(regRole)
      setEmail(regEmail)
    }, 1200)
  }

  const handleRoleChange = (selectedRole: UserRole) => {
    setRole(selectedRole)
    setError("")
    setSuccess("")
    const matchedRole = roles.find(r => r.id === selectedRole)
    if (matchedRole) {
      setEmail(matchedRole.placeholder)
    }
  }

  const handleQuickSwitch = (newRole: UserRole) => {
    setRole(newRole)
    setError("")
    setSuccess("")
    const matchedRole = roles.find(r => r.id === newRole)
    if (matchedRole) {
      setEmail(matchedRole.placeholder)
    }
  }

  const toggleMode = (targetMode: "login" | "register") => {
    setMode(targetMode)
    setError("")
    setSuccess("")
  }

  // Workflow Handlers
  const handleNewSubmissionSubmit = () => {
    if (!newTitle || !newAbstract) return

    const newMs: Manuscript = {
      id: `MS-2026-${Math.floor(Math.random() * 100) + 120}`,
      title: newTitle,
      journal: newJournal,
      status: "Awaiting Initial Check",
      date: new Date().toISOString().split('T')[0],
      reviewers: [],
      integrityStatus: "Unchecked"
    }

    setManuscripts(prev => [newMs, ...prev])
    setIsSubmitWizardOpen(false)
    setNewTitle("")
    setNewAbstract("")
    setNewKeywords("")
    setSubmitStep(1)
  }

  const handleUploadRevision = () => {
    setManuscripts(prev => 
      prev.map(m => m.id === revisionPaperId ? { ...m, status: "Revision Under Evaluation" } : m)
    )
    setIsRevisionDialogOpen(false)
  }

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteName || !inviteEmail) return
    const newUser: WorkspaceUser = {
      id: `USR-${Math.floor(Math.random() * 100) + 10}`,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      activeTasks: 0,
      status: "Pending Invitation"
    }
    setUsers(prev => [...prev, newUser])
    setIsInviteUserOpen(false)
    setInviteName("")
    setInviteEmail("")
  }

  const handleAssignReviewer = (reviewerName: string) => {
    setManuscripts(prev => 
      prev.map(m => {
        if (m.id === assignPaperId) {
          const exists = m.reviewers.includes(reviewerName)
          const updatedReviewers = exists 
            ? m.reviewers.filter(r => r !== reviewerName) 
            : [...m.reviewers, reviewerName]
          const newStatus = updatedReviewers.length > 0 ? "Under Review" : "Awaiting Initial Check"
          return { ...m, reviewers: updatedReviewers, status: newStatus as any }
        }
        return m
      })
    )
  }

  const handleMakeDecision = () => {
    setManuscripts(prev => 
      prev.map(m => m.id === decisionPaperId ? { ...m, status: decisionType } : m)
    )
    
    // Log in archives
    const activePaper = manuscripts.find(m => m.id === decisionPaperId)
    const newLog: ArchiveLog = {
      id: `LOG-${Math.floor(Math.random() * 100) + 200}`,
      paperId: decisionPaperId,
      actor: `${email.split('@')[0]} (Editor)`,
      action: `Decision logged: ${decisionType}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      details: `Verdict logged for manuscript '${activePaper?.title}'. Author response notification dispatched.`
    }
    setArchiveLogs(prev => [newLog, ...prev])
    setIsDecisionOpen(false)
    setDecisionNote("")
  }

  const handleAcceptReviewInvitation = (invId: string) => {
    const inv = reviewInvitations.find(i => i.id === invId)
    if (!inv) return
    
    // Add to active reviews
    const newActRev: ActiveReview = {
      id: `REV-2026-${Math.floor(Math.random() * 100) + 20}`,
      title: inv.title,
      journal: inv.journal,
      deadline: inv.deadline,
      status: "In Progress"
    }
    setActiveReviews(prev => [...prev, newActRev])
    setReviewInvitations(prev => prev.filter(i => i.id !== invId))
  }

  const handleDeclineReviewInvitation = (invId: string) => {
    setReviewInvitations(prev => prev.filter(i => i.id !== invId))
  }

  const handleSubmitReviewScorecard = () => {
    // Complete active review in Reviewer list
    setActiveReviews(prev => 
      prev.map(r => r.id === reviewPaperId ? { ...r, status: "Completed", recommendation: reviewRecommendation } : r)
    )
    
    const activeRevObj = activeReviews.find(r => r.id === reviewPaperId)
    if (activeRevObj) {
      // Find matching paper id
      const targetPaper = manuscripts.find(m => m.title === activeRevObj.title)
      const paperId = targetPaper ? targetPaper.id : "MS-2026-081"
      
      // Submit a review feedback entry (starts as Pending Moderation)
      const newReview: ReviewFeedback = {
        id: `REV-FB-${Math.floor(Math.random() * 1000) + 200}`,
        paperId: paperId,
        reviewerName: "Dr. Evelyn Vane", // Active reviewer
        originality: scoreOriginality,
        methodology: scoreMethodology,
        clarity: scoreClarity,
        significance: scoreSignificance,
        commentsAuthor: reviewFeedback,
        commentsEditor: "Reviewer submitted comments via portal.",
        recommendation: reviewRecommendation,
        status: "Pending Moderation"
      }
      setReviews(prev => [...prev, newReview])
      
      // Add to archive logs
      const newLog: ArchiveLog = {
        id: `LOG-${Math.floor(Math.random() * 100) + 200}`,
        paperId: paperId,
        actor: "Dr. Evelyn Vane (Reviewer)",
        action: "Review Comments Submitted",
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        details: "Evaluation scorecard logged. Routed to Journal Manager/Editor Moderation desk."
      }
      setArchiveLogs(prev => [newLog, ...prev])
    }
    
    setIsReviewFormOpen(false)
    setReviewFeedback("")
  }

  const handleOpenModeration = (reviewId: string) => {
    const rev = reviews.find(r => r.id === reviewId)
    if (rev) {
      setModeratingReviewId(reviewId)
      setModRedactdComments(rev.commentsAuthor)
      setIsModerationOpen(true)
    }
  }

  const handleApproveAndReleaseFeedback = () => {
    // Release review feedback to author (changes status and saves edited text)
    setReviews(prev => 
      prev.map(r => r.id === moderatingReviewId 
        ? { ...r, status: "Released", sanitizedCommentsAuthor: modRedactdComments } 
        : r
      )
    )

    const revObj = reviews.find(r => r.id === moderatingReviewId)
    if (revObj) {
      // Log interaction in archives
      const newLog: ArchiveLog = {
        id: `LOG-${Math.floor(Math.random() * 100) + 200}`,
        paperId: revObj.paperId,
        actor: `${email.split('@')[0]} (Moderator)`,
        action: "Review Verified & Released",
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        details: `Redactd and released review comments by ${revObj.reviewerName} to author.`
      }
      setArchiveLogs(prev => [newLog, ...prev])
      
      // Change target manuscript status to Revision Required to simulate active flow
      setManuscripts(prev => 
        prev.map(m => m.id === revObj.paperId ? { ...m, status: "Revision Required" } : m)
      )
    }

    setIsModerationOpen(false)
  }

  const handleResolveIntegrity = (alertId: string, action: "escalate" | "clear") => {
    setIntegrityAlerts(prev => 
      prev.map(a => {
        if (a.id === alertId) {
          return { ...a, status: action === "escalate" ? "Escalated" : "Cleared" }
        }
        return a
      })
    )
    
    const alert = integrityAlerts.find(a => a.id === alertId)
    if (alert) {
      setManuscripts(prev => 
        prev.map(m => {
          if (m.id === alert.paperId) {
            return { 
              ...m, 
              integrityStatus: action === "escalate" ? "Flagged" : "Clean",
              status: action === "clear" ? "Awaiting Initial Check" : m.status
            }
          }
          return m
        })
      )
    }
    setIsForensicsOpen(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-all font-sans">
      
      {!isLoggedIn ? (
        // ==========================================
        // 1. SIGN IN & REGISTRATION VIEW
        // ==========================================
        <>
          <Header />
          <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0b99ff]/5 via-transparent to-transparent">
            <div className="w-full max-w-md space-y-8 animate-in fade-in duration-300">
              
              {/* Brand Logo Header */}
              <div className="flex flex-col items-center text-center">
                <div className="flex h-14 w-auto items-center justify-center mb-5 hover:scale-105 transition-all">
                  <img 
                    src="/editorial360.svg" 
                    alt="editorial360 Logo" 
                    className="h-full w-auto object-contain" 
                  />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {mode === "login" ? "Workspace Sign In" : "Register Workspace Account"}
                </h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm font-medium">
                  {mode === "login" 
                    ? "Access the secure peer review workspace to manage editorial operations."
                    : "Create a verified account to submit papers or evaluate manuscripts."
                  }
                </p>
              </div>

              {/* Login/Registration Card container */}
              <Card className="border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl bg-white dark:bg-slate-950 overflow-hidden relative transition-all">
                <div className="h-1.5 w-full bg-[#0b99ff]" />
                
                <CardHeader className="space-y-1 px-6 pt-6 pb-4">
                  <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                    <ShieldCheck className="h-5 w-5 text-[#0b99ff]" />
                    {mode === "login" ? "Security Portal" : "Account Setup"}
                  </CardTitle>
                  <CardDescription className="text-slate-500 dark:text-slate-400">
                    {mode === "login" 
                      ? "Select your portal role and enter your credentials."
                      : "Reviewers and Authors can register. Managers/Editors are manually assigned."
                    }
                  </CardDescription>
                </CardHeader>
                
                {mode === "login" ? (
                  // ================= LOGIN FORM =================
                  <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4 px-6 py-2">
                      {error && (
                        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-sm border border-red-200 dark:border-red-900/30 animate-in fade-in duration-200">
                          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                          <span>{error}</span>
                        </div>
                      )}
                      {success && (
                        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 text-sm border border-green-200 dark:border-green-900/30 animate-in fade-in duration-200">
                          <Check className="h-4 w-4 shrink-0 text-green-600" />
                          <span>{success}</span>
                        </div>
                      )}

                      {/* Dropdown Role Selector */}
                      <div className="space-y-1.5">
                        <label htmlFor="role-select" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Access Portal Role
                        </label>
                        <select
                          id="role-select"
                          value={role}
                          onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                          className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0b99ff] transition-all cursor-pointer font-medium"
                        >
                          {roles.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Email address field */}
                      <div className="space-y-1.5">
                        <label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Email address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                            <Mail className="h-4 w-4" />
                          </div>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0b99ff] transition-all"
                            placeholder="editor@scholarlyopen.org"
                          />
                        </div>
                      </div>

                      {/* Password field */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Password
                          </label>
                          <Link
                            href="#"
                            className="text-xs font-semibold text-[#0b99ff] hover:underline"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                            <Lock className="h-4 w-4" />
                          </div>
                          <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0b99ff] transition-all"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>

                      {/* Remember Session checkbox */}
                      <div className="flex items-center pt-1">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-[#0b99ff] focus:ring-[#0b99ff] cursor-pointer bg-white dark:bg-slate-900"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-xs font-semibold text-slate-500 dark:text-slate-400 select-none cursor-pointer">
                          Remember my session on this device
                        </label>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex flex-col gap-3.5 px-6 pb-6 pt-3">
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-[#0b99ff] hover:bg-[#0b8ceb] text-white font-bold py-2 rounded-md shadow-md transition-all active:scale-[0.98] cursor-pointer"
                      >
                        {loading ? `Authenticating ${role.toUpperCase()}...` : `Sign In as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
                      </Button>
                      
                      <div className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Need access to publish or review?{" "}
                        <button 
                          type="button" 
                          onClick={() => toggleMode("register")}
                          className="text-[#0b99ff] hover:underline font-bold focus:outline-none cursor-pointer"
                        >
                          Register Workspace Account
                        </button>
                      </div>
                    </CardFooter>
                  </form>
                ) : (
                  // ================= REGISTRATION FORM =================
                  <form onSubmit={handleRegister}>
                    <CardContent className="space-y-4 px-6 py-2">
                      {error && (
                        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-red-50 dark:bg-red-955/20 text-red-700 dark:text-red-400 text-sm border border-red-200 dark:border-red-900/30 animate-in fade-in duration-200">
                          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                          <span>{error}</span>
                        </div>
                      )}

                      {/* Role selection tab button group */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Select Workspace Role
                        </label>
                        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() => setRegRole("author")}
                            className={`py-1.5 rounded-md text-xs font-bold transition-all text-center tracking-wide cursor-pointer ${
                              regRole === "author"
                                ? "bg-[#0b99ff] text-white shadow-sm"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                          >
                            Author Profile
                          </button>
                          <button
                            type="button"
                            onClick={() => setRegRole("reviewer")}
                            className={`py-1.5 rounded-md text-xs font-bold transition-all text-center tracking-wide cursor-pointer ${
                              regRole === "reviewer"
                                ? "bg-[#0b99ff] text-white shadow-sm"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                          >
                            Reviewer Panel
                          </button>
                        </div>
                      </div>

                      {/* Full Name input */}
                      <div className="space-y-1.5">
                        <label htmlFor="reg-name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                            <User className="h-4 w-4" />
                          </div>
                          <input
                            id="reg-name"
                            type="text"
                            required
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0b99ff] transition-all"
                            placeholder="Dr. Sarah Jenkins"
                          />
                        </div>
                      </div>

                      {/* Institutional Email Address input */}
                      <div className="space-y-1.5">
                        <label htmlFor="reg-email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Institutional Email
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                            <Mail className="h-4 w-4" />
                          </div>
                          <input
                            id="reg-email"
                            type="email"
                            required
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0b99ff] transition-all"
                            placeholder="s.jenkins@university.edu"
                          />
                        </div>
                      </div>

                      {/* ORCID identifier (optional) */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label htmlFor="reg-orcid" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            ORCID iD
                          </label>
                          <span className="text-xs text-slate-400 dark:text-slate-500 font-bold bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">Recommended</span>
                        </div>
                        <input
                          id="reg-orcid"
                          type="text"
                          value={regOrcid}
                          onChange={(e) => setRegOrcid(e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0b99ff] transition-all"
                          placeholder="0000-0002-1825-0097"
                        />
                      </div>

                      {/* Password input */}
                      <div className="space-y-1.5">
                        <label htmlFor="reg-pass" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Account Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                            <Lock className="h-4 w-4" />
                          </div>
                          <input
                            id="reg-pass"
                            type="password"
                            required
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0b99ff] transition-all"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex flex-col gap-3.5 px-6 pb-6 pt-3">
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-[#0b99ff] hover:bg-[#0b8ceb] text-white font-bold py-2 rounded-md shadow-md transition-all active:scale-[0.98] cursor-pointer"
                      >
                        {loading ? "Registering account..." : `Register Workspace Profile`}
                      </Button>
                      
                      <div className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Already have a workspace account?{" "}
                        <button 
                          type="button" 
                          onClick={() => toggleMode("login")}
                          className="text-[#0b99ff] hover:underline font-bold focus:outline-none cursor-pointer"
                        >
                          Sign In here
                        </button>
                      </div>
                    </CardFooter>
                  </form>
                )}
              </Card>
              
              <div className="text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
                <p>
                  By logging in, you agree to Scholarly Open's{" "}
                  <Link href="/privacy" className="underline hover:text-slate-600 dark:hover:text-slate-400">
                    Privacy Policy
                  </Link>{" "}
                  and secure COI guidelines.
                </p>
              </div>

            </div>
          </main>
          <Footer />
        </>
      ) : (
        // ==========================================
        // 2. DASHBOARD WORKSPACE MAIN VIEW
        // ==========================================
        <div className="flex-1 flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
          
          {/* Workspace Sticky Top Navigation */}
          <header className="sticky top-0 z-45 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-850 px-4 py-3 flex items-center justify-between shadow-sm transition-colors duration-200">
            
            {/* Logo area */}
            <div className="flex items-center gap-3">
              <Link href="/editorial360" className="flex items-center gap-2 hover:opacity-90">
                <img 
                  src="/editorial360.svg" 
                  alt="editorial360 Logo" 
                  className="h-7 w-auto object-contain brightness-100 dark:brightness-110" 
                />
              </Link>
              <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#0b99ff] bg-[#0b99ff]/10 px-2 py-0.5 rounded border border-[#0b99ff]/20 hidden sm:inline-block">
                Workspace
              </span>
            </div>

            {/* Quick Switch Panel (The Floating Tool) */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-1.5 py-1 gap-1 max-w-full overflow-x-auto shadow-inner transition-colors">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 px-2 uppercase tracking-wide hidden md:inline">
                Simulate Role:
              </span>
              {(["jm", "editor", "reviewer", "author", "ria", "admin"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handleQuickSwitch(r)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all tracking-wide cursor-pointer ${
                    role === r 
                      ? "bg-[#0b99ff] text-white shadow-sm ring-1 ring-white/10" 
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  {r === "jm" ? "Manager" : r}
                </button>
              ))}
            </div>

            {/* Theme & User Actions */}
            <div className="flex items-center gap-3">
              {/* Light/Dark Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 p-2 h-auto rounded-full cursor-pointer"
                title="Toggle Light/Dark Mode"
              >
                {mounted && theme === "dark" ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />}
              </Button>

              <div className="relative cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-full transition-all text-slate-500 dark:text-slate-300">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-950 " />
              </div>
              
              <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800" />

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#0b99ff] to-[#0b99ff]/50 text-white font-extrabold text-xs shadow-md uppercase">
                  {role.substring(0, 2)}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    {role === "jm" ? "Journal Manager" : role === "editor" ? "Managing Editor" : role === "reviewer" ? "Expert Reviewer" : role === "author" ? "Principal Author" : role === "ria" ? "Integrity Advisor" : "System Admin"}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {email}
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsLoggedIn(false)
                  setSuccess("You have been securely signed out.")
                }}
                className="text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 p-2 h-auto cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>

          <div className="flex-1 flex overflow-hidden">
            
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-slate-50 dark:bg-slate-950/80 border-r border-slate-200 dark:border-slate-800/80 p-5 flex flex-col justify-between hidden md:flex shrink-0 transition-colors">
              <div className="space-y-6">
                
                {/* Active Workspace Info */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 dark:text-slate-500 tracking-widest block">
                    Institutional Node
                  </span>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg transition-colors">
                    <BookOpen className="h-4 w-4 text-[#0b99ff]" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                      scholarlyopen.org
                    </span>
                  </div>
                </div>

                {/* Sidebar Navigation Links */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 dark:text-slate-500 tracking-widest block mb-2 px-1">
                    Workspace Nav
                  </span>
                  
                  {/* Journal Manager Sidebar tabs */}
                  {role === "jm" && (
                    <>
                      <button 
                        onClick={() => setActiveJmTab("moderation")}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-lg transition-all border ${
                          activeJmTab === "moderation"
                            ? "bg-[#0b99ff]/10 text-[#0b99ff] border-[#0b99ff]/20"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border-transparent"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Inbox className="h-4 w-4" />
                          Review Moderation Desk
                        </span>
                        {reviews.filter(r => r.status === "Pending Moderation").length > 0 && (
                          <span className="h-2 w-2 rounded-full bg-red-500 " />
                        )}
                      </button>
                      <button 
                        onClick={() => setActiveJmTab("archives")}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-lg transition-all border ${
                          activeJmTab === "archives"
                            ? "bg-[#0b99ff]/10 text-[#0b99ff] border-[#0b99ff]/20"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border-transparent"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Archive className="h-4 w-4" />
                          Communication Archives
                        </span>
                      </button>
                      <button 
                        onClick={() => setActiveJmTab("users")}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-lg transition-all border ${
                          activeJmTab === "users"
                            ? "bg-[#0b99ff]/10 text-[#0b99ff] border-[#0b99ff]/20"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border-transparent"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Users className="h-4 w-4" />
                          Reviewer Registry
                        </span>
                      </button>
                    </>
                  )}

                  {/* Other Roles navigation list */}
                  {role !== "jm" && (
                    <button className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-lg bg-[#0b99ff]/10 text-[#0b99ff] border border-[#0b99ff]/20">
                      <span className="flex items-center gap-2.5">
                        <LayoutDashboard className="h-4 w-4" />
                        Overview Hub
                      </span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  )}

                  {role === "admin" && (
                    <>
                      <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
                        <Users className="h-4 w-4" />
                        Workspace Registry
                      </button>
                      <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
                        <Sliders className="h-4 w-4" />
                        Journal Schema
                      </button>
                      <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
                        <Settings className="h-4 w-4" />
                        Workflow Config
                      </button>
                    </>
                  )}

                  {role === "author" && (
                    <>
                      <button 
                        onClick={() => setIsSubmitWizardOpen(true)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                      >
                        <Plus className="h-4 w-4 text-[#0b99ff]" />
                        Submit New Paper
                      </button>
                      <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
                        <FileCheck className="h-4 w-4" />
                        Co-Authorship Invites
                      </button>
                    </>
                  )}

                  {role === "reviewer" && (
                    <>
                      <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
                        <CheckSquare className="h-4 w-4" />
                        Pending Requests
                      </button>
                      <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
                        <ThumbsUp className="h-4 w-4" />
                        Review History
                      </button>
                    </>
                  )}

                  {role === "editor" && (
                    <>
                      <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-[#0b99ff] bg-[#0b99ff]/5 border border-[#0b99ff]/10">
                        <FileText className="h-4 w-4" />
                        Manuscript Queue
                      </button>
                      <button 
                        onClick={() => {
                          setActiveJmTab("users")
                          // Swap role temporarily to JM to access registry list
                          setRole("jm")
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                      >
                        <Users className="h-4 w-4" />
                        Reviewer Database
                      </button>
                    </>
                  )}

                  {role === "ria" && (
                    <>
                      <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-[#0b99ff] bg-[#0b99ff]/5 border border-[#0b99ff]/10">
                        <ShieldAlert className="h-4 w-4" />
                        Integrity Alerts
                      </button>
                      <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
                        <Cpu className="h-4 w-4" />
                        AI Analytics
                      </button>
                    </>
                  )}

                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800/80">
                <div className="flex items-center gap-2 px-1 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wide">
                  <span>Version 4.2.2-stable</span>
                </div>
              </div>
            </aside>

            {/* Main scrollable body workspace content */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-100/50 dark:bg-slate-900/60 transition-colors">
              <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
                
                {/* Banner Status Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                      {role === "jm" && "Journal Management Console"}
                      {role === "editor" && "Editorial Decision Matrix"}
                      {role === "reviewer" && "Peer Review Board Panel"}
                      {role === "author" && "Author Manuscript Workspace"}
                      {role === "ria" && "Research Integrity Forensics Center"}
                      {role === "admin" && "Administrative System Console"}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {role === "jm" && "Redact peer reviewer comments, manage author releases, and audit journal archives."}
                      {role === "editor" && "Monitor incoming submissions, assign reviewer pools, and post final manuscript decisions."}
                      {role === "reviewer" && "Review assigned submissions, complete evaluations metrics, and sign recommendation logs."}
                      {role === "author" && "Track submission stages, respond to evaluations, and upload manuscript drafts."}
                      {role === "ria" && "Audit algorithmic similarity index logs, investigate AI content warnings, and review figure reuse flags."}
                      {role === "admin" && "Manage institutional nodes, review permissions schema, and user directory registries."}
                    </p>
                  </div>
                  
                  {role === "author" && (
                    <Button 
                      onClick={() => setIsSubmitWizardOpen(true)}
                      className="bg-[#0b99ff] hover:bg-[#0b8ceb] text-white font-bold flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      Submit New Manuscript
                    </Button>
                  )}
                  {role === "admin" && (
                    <Button 
                      onClick={() => setIsInviteUserOpen(true)}
                      className="bg-[#0b99ff] hover:bg-[#0b8ceb] text-white font-bold flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg cursor-pointer"
                    >
                      <UserPlus className="h-4 w-4" />
                      Invite Workspace User
                    </Button>
                  )}
                </div>

                {/* ========================================================= */}
                {/* A. ROLE DASHBOARD DETAILS DISPLAY PANEL                   */}
                {/* ========================================================= */}

                {/* ================= 1. JOURNAL MANAGER (JM) ================= */}
                {role === "jm" && (
                  <div className="space-y-6">
                    {/* JM Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pending Moderation</CardTitle>
                          <MessageSquareOff className="h-4 w-4 text-orange-500 " />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">
                            {reviews.filter(r => r.status === "Pending Moderation").length}
                          </div>
                          <span className="text-[10px] text-orange-500 dark:text-orange-400 font-semibold block mt-1">
                            Awaiting safety vetting release
                          </span>
                        </CardContent>
                      </Card>

                      <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Active Reviewers</CardTitle>
                          <Users className="h-4 w-4 text-[#0b99ff]" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">
                            {users.filter(u => u.role === "reviewer").length}
                          </div>
                          <span className="text-[10px] text-green-600 dark:text-green-400 font-semibold block mt-1">
                            Verified peer evaluation pool
                          </span>
                        </CardContent>
                      </Card>

                      <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Registered Papers</CardTitle>
                          <FileText className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">
                            {manuscripts.length}
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium block mt-1">
                            Total submissions logged
                          </span>
                        </CardContent>
                      </Card>

                      <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Decided Volume</CardTitle>
                          <Check className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">
                            {manuscripts.filter(m => m.status === "Accepted" || m.status === "Rejected").length}
                          </div>
                          <span className="text-[10px] text-green-600 dark:text-green-400 font-semibold block mt-1">
                            Decisions posted to archives
                          </span>
                        </CardContent>
                      </Card>
                    </div>

                    {/* JM Tabbed content views */}
                    {activeJmTab === "moderation" && (
                      <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">Review Comment Moderation Desk</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Vet and sanitize reviewer feedback comments before releasing them to authors to protect against direct unmoderated feedback release.</p>
                        </div>
                        
                        <div className="p-5 space-y-4">
                          {reviews.filter(r => r.status === "Pending Moderation").length === 0 ? (
                            <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs font-semibold">
                              All submitted reviewer assessments have been audited and released. No pending items.
                            </div>
                          ) : (
                            reviews.filter(r => r.status === "Pending Moderation").map((rev) => {
                              const targetPaper = manuscripts.find(m => m.id === rev.paperId)
                              return (
                                <div key={rev.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                  <div className="space-y-1.5">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900/30 ">
                                        Pending Release
                                      </span>
                                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Paper ID: {rev.paperId}</span>
                                      <span className="text-[10px] text-slate-400">| Reviewer: <strong>{rev.reviewerName}</strong></span>
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{targetPaper?.title}</h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 italic">
                                      &ldquo;{rev.commentsAuthor}&rdquo;
                                    </p>
                                  </div>
                                  <Button
                                    onClick={() => handleOpenModeration(rev.id)}
                                    size="sm"
                                    className="bg-[#0b99ff] hover:bg-[#0b8ceb] text-white font-bold text-xs shrink-0 cursor-pointer"
                                  >
                                    Vet Comments
                                  </Button>
                                </div>
                              )
                            })
                          )}
                        </div>
                      </Card>
                    )}

                    {activeJmTab === "archives" && (
                      <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">Journal Communication & Activity Archives</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Audit log record keeper tracking decision alerts, reviewer comments edits, and author communications.</p>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase">
                                <th className="px-5 py-3">Timestamp</th>
                                <th className="px-5 py-3">Paper ID</th>
                                <th className="px-5 py-3">Actor Node</th>
                                <th className="px-5 py-3">Action logged</th>
                                <th className="px-5 py-3">Record Details</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                              {archiveLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/50">
                                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                                  <td className="px-5 py-3 font-bold text-[#0b99ff]">{log.paperId}</td>
                                  <td className="px-5 py-3 text-slate-700 dark:text-slate-300">{log.actor}</td>
                                  <td className="px-5 py-3 whitespace-nowrap">
                                    <span className="bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded text-[10px] font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                                      {log.action}
                                    </span>
                                  </td>
                                  <td className="px-5 py-3 text-slate-600 dark:text-slate-400 max-w-sm truncate hover:text-clip">{log.details}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </Card>
                    )}

                    {activeJmTab === "users" && (
                      <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
                          <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Reviewer Database</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Directory listing of suggestions for editor assignment matching.</p>
                          </div>
                        </div>
                        <div className="p-4 space-y-4">
                          {reviewerSuggestions.map((rev, idx) => (
                            <div key={idx} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{rev.name}</h4>
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                    rev.status === "Active" ? "bg-green-100 dark:bg-green-950/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900/30" :
                                    rev.status === "Busy" ? "bg-yellow-100 dark:bg-yellow-950/20 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/30" :
                                    "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                                  }`}>
                                    {rev.status}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  Specialization: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{rev.specialization}</strong>
                                </p>
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                                  Email: {rev.email} | Match Fit: <span className="text-[#0b99ff] font-bold">{rev.matchScore}%</span>
                                </div>
                              </div>
                              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded">
                                Active Load: {rev.activeTasks} papers
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}

                  </div>
                )}

                {/* ================= 2. EDITOR WORKSPACE ================= */}
                {role === "editor" && (
                  <div className="space-y-6">
                    {/* Editor Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Awaiting Assigning</CardTitle>
                          <Bell className="h-4 w-4 text-orange-500 " />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">
                            {manuscripts.filter(m => m.status === "Awaiting Initial Check").length}
                          </div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">Pending peer-review assignments</span>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Active Review Process</CardTitle>
                          <FileText className="h-4 w-4 text-[#0b99ff]" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">
                            {manuscripts.filter(m => m.status === "Under Review" || m.status === "Revision Under Evaluation").length}
                          </div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">Currently in reviewer hands</span>
                        </CardContent>
                      </Card>

                      <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pending Moderation Desk</CardTitle>
                          <MessageSquareOff className="h-4 w-4 text-amber-500 " />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">
                            {reviews.filter(r => r.status === "Pending Moderation").length}
                          </div>
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block mt-1">Comments needing vetting</span>
                        </CardContent>
                      </Card>

                      <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Avg Turnaround Latency</CardTitle>
                          <ClockWidget />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">24.2d</div>
                          <span className="text-[10px] text-green-600 dark:text-green-400 font-semibold block mt-1">Below target of 25.0 days</span>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Reviews pending release desk in Editor view */}
                    {reviews.filter(r => r.status === "Pending Moderation").length > 0 && (
                      <Card className="bg-white dark:bg-slate-950 border border-amber-200 dark:border-amber-900/30 overflow-hidden relative">
                        <div className="h-1 w-full bg-amber-500" />
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-850 flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              <MessageSquareOff className="h-4.5 w-4.5 text-amber-500" />
                              Review Feedback Vetting Required
                            </h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Vet reviewer comments before releasing them to the author dashboard.</p>
                          </div>
                        </div>
                        <div className="p-4.5 space-y-3">
                          {reviews.filter(r => r.status === "Pending Moderation").map((rev) => (
                            <div key={rev.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/60 p-3 rounded border border-slate-200 dark:border-slate-800 text-xs">
                              <div>
                                <span className="font-semibold text-slate-700 dark:text-slate-300">Feedback by {rev.reviewerName}</span>
                                <p className="text-[11px] text-slate-400 italic truncate max-w-lg mt-0.5">&ldquo;{rev.commentsAuthor}&rdquo;</p>
                              </div>
                              <Button
                                onClick={() => handleOpenModeration(rev.id)}
                                size="sm"
                                className="bg-[#0b99ff] hover:bg-[#0b8ceb] text-white text-[10px] font-bold h-7 cursor-pointer"
                              >
                                Moderate Comments
                              </Button>
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}

                    {/* Editorial Inbox Table */}
                    <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
                      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Manuscript Pipeline Queue</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Assign reviewer pools and log academic publication decisions.</p>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase">
                              <th className="px-5 py-3">ID / Submission Date</th>
                              <th className="px-5 py-3">Manuscript Details</th>
                              <th className="px-5 py-3">Assigned Reviewers</th>
                              <th className="px-5 py-3">Integrity Flags</th>
                              <th className="px-5 py-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-850 font-medium">
                            {manuscripts.map((m) => (
                              <tr key={m.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors">
                                <td className="px-5 py-4 whitespace-nowrap">
                                  <div className="font-bold text-slate-900 dark:text-white">{m.id}</div>
                                  <div className="text-[10px] text-slate-400">{m.date}</div>
                                </td>
                                <td className="px-5 py-4 max-w-xs">
                                  <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{m.title}</div>
                                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">{m.journal}</div>
                                </td>
                                <td className="px-5 py-4">
                                  <div className="space-y-1">
                                    {m.reviewers.length === 0 ? (
                                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold italic">Unassigned</span>
                                    ) : (
                                      m.reviewers.map((rev, idx) => (
                                        <div key={idx} className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                                          <div className="h-1.5 w-1.5 rounded-full bg-[#0b99ff]" />
                                          {rev}
                                        </div>
                                      ))
                                    )}
                                  </div>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    m.integrityStatus === "Clean" ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20" :
                                    m.integrityStatus === "Flagged" ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 " :
                                    "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700"
                                  }`}>
                                    {m.integrityStatus}
                                  </span>
                                </td>
                                <td className="px-5 py-4 text-right whitespace-nowrap space-x-1.5">
                                  {m.status !== "Accepted" && m.status !== "Rejected" && (
                                    <>
                                      <Button 
                                        onClick={() => {
                                          setAssignPaperId(m.id)
                                          setIsAssignReviewOpen(true)
                                        }}
                                        size="sm"
                                        className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold cursor-pointer"
                                      >
                                        Assign
                                      </Button>
                                      
                                      <Button 
                                        onClick={() => {
                                          setDecisionPaperId(m.id)
                                          setIsDecisionOpen(true)
                                        }}
                                        size="sm"
                                        className="bg-[#0b99ff] hover:bg-[#0b8ceb] text-white font-bold text-xs cursor-pointer"
                                      >
                                        Decision
                                      </Button>
                                    </>
                                  )}
                                  {(m.status === "Accepted" || m.status === "Rejected") && (
                                    <span className="text-slate-400 dark:text-slate-500 font-semibold italic text-xs pr-4">Processed</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  </div>
                )}

                {/* ================= 3. REVIEWER WORKSPACE ================= */}
                {role === "reviewer" && (
                  <div className="space-y-6">
                    {/* Reviewer Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pending Review Invites</CardTitle>
                          <Bell className="h-4 w-4 text-orange-500 " />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">{reviewInvitations.length}</div>
                          <span className="text-[10px] text-orange-500 dark:text-orange-400 font-semibold block mt-1">Awaiting invitation response</span>
                        </CardContent>
                      </Card>

                      <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Active Review Tasks</CardTitle>
                          <FileText className="h-4 w-4 text-[#0b99ff]" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">
                            {activeReviews.filter(r => r.status === "In Progress").length}
                          </div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">Under investigation scorecard</span>
                        </CardContent>
                      </Card>

                      <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Completed Assessments</CardTitle>
                          <Check className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">14</div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">Thank you for your academic service</span>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Pending Review Invitations */}
                    {reviewInvitations.length > 0 && (
                      <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                        <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                          <span className="bg-[#0b99ff]/10 text-[#0b99ff] border border-[#0b99ff]/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                            Invitation Alert
                          </span>
                          <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">Review Invitation Request</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Please review the scientific abstract and indicate your willingness to complete this review task.</p>
                        </div>
                        
                        {reviewInvitations.map((inv) => (
                          <div key={inv.id} className="space-y-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4.5 rounded-lg">
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{inv.journal}</span>
                                <span className="text-[10px] font-semibold text-red-500 dark:text-red-400">Deadline: {inv.deadline}</span>
                              </div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{inv.title}</h4>
                            </div>
                            
                            <div className="space-y-1 bg-white dark:bg-slate-950 p-3 rounded border border-slate-200 dark:border-slate-800/80">
                              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Abstract Draft:</span>
                              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">{inv.abstract}</p>
                            </div>

                            <div className="flex gap-3 pt-1">
                              <Button 
                                onClick={() => handleAcceptReviewInvitation(inv.id)}
                                className="bg-[#0b99ff] hover:bg-[#0b8ceb] text-white font-bold text-xs px-4 cursor-pointer"
                              >
                                Accept & Evaluate
                              </Button>
                              <Button 
                                onClick={() => handleDeclineReviewInvitation(inv.id)}
                                variant="ghost" 
                                className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold cursor-pointer"
                              >
                                Decline Review
                              </Button>
                            </div>
                          </div>
                        ))}
                      </Card>
                    )}

                    {/* Active Reviews List */}
                    <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden">
                      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Review Portfolio</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Assigned papers that require academic peer evaluation scorecards.</p>
                      </div>
                      <div className="p-4 space-y-4">
                        {activeReviews.length === 0 ? (
                          <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-xs">No active review assignments. Accept an invitation above.</div>
                        ) : (
                          activeReviews.map((rev) => (
                            <div key={rev.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">{rev.journal}</span>
                                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                                    rev.status === "Completed" ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-[#0b99ff]/10 text-[#0b99ff]"
                                  }`}>
                                    {rev.status}
                                  </span>
                                </div>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{rev.title}</h4>
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                                  Target Assessment Date: {rev.deadline} {rev.recommendation && `| Recommended: ${rev.recommendation}`}
                                </div>
                              </div>
                              
                              <div>
                                {rev.status === "In Progress" ? (
                                  <Button 
                                    onClick={() => {
                                      setReviewPaperId(rev.id)
                                      setIsReviewFormOpen(true)
                                    }}
                                    className="bg-[#0b99ff] hover:bg-[#0b8ceb] text-white font-bold text-xs cursor-pointer"
                                  >
                                    Start Evaluation
                                  </Button>
                                ) : (
                                  <span className="text-xs font-semibold text-green-600 dark:text-green-400 flex items-center gap-1.5">
                                    <Check className="h-4 w-4" /> Assessment Submitted
                                  </span>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </Card>
                  </div>
                )}

                {/* ================= 4. AUTHOR WORKSPACE ================= */}
                {role === "author" && (
                  <div className="space-y-6">
                    {/* Author stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Submissions</CardTitle>
                          <FileText className="h-4 w-4 text-[#0b99ff]" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">5</div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">3 papers successfully published</span>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Under Evaluation</CardTitle>
                          <RefreshCw className="h-4 w-4 text-[#0b99ff] animate-spin" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">1</div>
                          <span className="text-[10px] text-[#0b99ff] font-semibold block mt-1">In peer review evaluation</span>
                        </CardContent>
                      </Card>

                      <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Revisions Required</CardTitle>
                          <AlertTriangle className="h-4 w-4 text-orange-500 " />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">1</div>
                          <span className="text-[10px] text-orange-500 dark:text-orange-400 font-semibold block mt-1">Needs correction response</span>
                        </CardContent>
                      </Card>

                      <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Co-Authorship Invites</CardTitle>
                          <Users className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">0</div>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">Zero pending affiliations</span>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Author Manuscripts Table */}
                    <div className="flex flex-col xl:flex-row gap-6">
                      <div className="flex-1 w-full xl:w-2/3">
                    <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors h-full">
                      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between items-center">
                        <div>
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">My Scholarly Manuscripts</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage and track the validation pipeline for your research papers.</p>
                        </div>
                        <Button 
                          onClick={() => setIsSubmitWizardOpen(true)}
                          size="sm"
                          className="bg-[#0b99ff] hover:bg-[#0b8ceb] text-white text-xs font-bold cursor-pointer"
                        >
                          Submit Paper
                        </Button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase">
                              <th className="px-5 py-3">ID / Submission Date</th>
                              <th className="px-5 py-3">Manuscript Details</th>
                              <th className="px-5 py-3">Target Journal</th>
                              <th className="px-5 py-3">Pipeline Status</th>
                              <th className="px-5 py-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-850 font-medium">
                            {manuscripts.map((m) => (
                              <tr key={m.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors">
                                <td className="px-5 py-4 whitespace-nowrap">
                                  <div className="font-bold text-slate-900 dark:text-white">{m.id}</div>
                                  <div className="text-[10px] text-slate-400">{m.date}</div>
                                </td>
                                <td className="px-5 py-4 max-w-sm">
                                  <div className="font-bold text-slate-900 dark:text-white line-clamp-1 hover:line-clamp-none transition-all cursor-pointer">
                                    {m.title}
                                  </div>
                                </td>
                                <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                                  {m.journal}
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                    m.status === "Accepted" ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20" :
                                    m.status === "Revision Required" ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20" :
                                    m.status === "Under Review" ? "bg-[#0b99ff]/10 text-[#0b99ff] border border-[#0b99ff]/20" :
                                    "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                                  }`}>
                                    {m.status}
                                  </span>
                                </td>
                                <td className="px-5 py-4 text-right whitespace-nowrap">
                                  {m.status === "Revision Required" ? (
                                    <Button 
                                      onClick={() => {
                                        setRevisionPaperId(m.id)
                                        setIsRevisionDialogOpen(true)
                                      }}
                                      size="sm"
                                      className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs cursor-pointer"
                                    >
                                      Submit Revision
                                    </Button>
                                  ) : (
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                                    >
                                      View Details
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                      </div>
                      <div className="w-full xl:w-1/3 min-w-[300px]">
                        <AuthorCareerMetrics />
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= 5. RESEARCH INTEGRITY ADVISOR (QC Admin) ================= */}
                {role === "ria" && (
                  <div className="space-y-6">
                    {/* QC Admin Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Flagged Cases</CardTitle>
                          <AlertTriangle className="h-4 w-4 text-red-500 " />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">
                            {integrityAlerts.filter(a => a.status === "Flagged").length}
                          </div>
                          <span className="text-[10px] text-red-500 dark:text-red-400 font-semibold block mt-1">Requires forensic investigation</span>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Audited Submissions</CardTitle>
                          <FileText className="h-4 w-4 text-[#0b99ff]" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">156</div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">Checked on automated ingest</span>
                        </CardContent>
                      </Card>

                      <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">False Positive Rate</CardTitle>
                          <CheckSquare className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">2.1%</div>
                          <span className="text-[10px] text-green-600 dark:text-green-400 font-semibold block mt-1">Well within calibration target</span>
                        </CardContent>
                      </Card>

                      <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">AI Integrity Scan Latency</CardTitle>
                          <Cpu className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">4.8s</div>
                          <span className="text-[10px] text-slate-550 dark:text-slate-405 block mt-1">Sub-second checksum parsing</span>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Integrity Alert Queue Cards */}
                    <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
                      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Integrity Forensic Alert Queue</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Investigate flagged text similarity, generative AI probability indices, or figure duplication logs.</p>
                      </div>
                      
                      <div className="p-5 space-y-4">
                        {integrityAlerts.map((alert) => (
                          <div 
                            key={alert.id} 
                            className={`p-4.5 rounded-lg bg-slate-50 dark:bg-slate-900 border flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all ${
                              alert.status !== "Flagged" ? "opacity-50" : "hover:border-slate-300 dark:hover:border-slate-700"
                            } ${
                              alert.status === "Flagged" && alert.severity === "critical" ? "border-red-500/30 bg-red-500/5" : 
                              alert.status === "Flagged" && alert.severity === "warning" ? "border-yellow-500/30 bg-yellow-500/5" : "border-slate-200 dark:border-slate-800"
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${
                                  alert.severity === "critical" ? "bg-red-500/15 text-red-500 dark:text-red-400 border border-red-500/20" :
                                  alert.severity === "warning" ? "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20" :
                                  "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                                }`}>
                                  {alert.severity} Risk
                                </span>
                                <span className="text-[10px] uppercase font-bold text-slate-500">{alert.journal}</span>
                                <span className="text-[10px] text-slate-400">Paper ID: {alert.paperId}</span>
                              </div>
                              
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{alert.title}</h4>
                              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl">{alert.detail}</p>
                              
                              <div className="flex items-center gap-3 pt-1 text-[11px]">
                                <span className="text-[#0b99ff] font-bold flex items-center gap-1">
                                  <ShieldAlert className="h-3.5 w-3.5" />
                                  {alert.type}: {alert.score}
                                </span>
                                <span className="text-slate-300 dark:text-slate-700">|</span>
                                <span className="text-slate-500 dark:text-slate-400 font-medium">Status: <strong className="text-slate-600 dark:text-slate-300 font-bold uppercase">{alert.status}</strong></span>
                              </div>
                            </div>

                            <div className="shrink-0 flex items-center gap-2">
                              {alert.status === "Flagged" ? (
                                <>
                                  <Button
                                    onClick={() => {
                                      setActiveAlertId(alert.id)
                                      setIsForensicsOpen(true)
                                    }}
                                    className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-350 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-100 border border-slate-300 dark:border-slate-700 text-xs font-bold cursor-pointer"
                                  >
                                    Investigate Case
                                  </Button>
                                </>
                              ) : (
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold italic flex items-center gap-1">
                                  <Check className="h-4 w-4 text-green-500" /> Resolved ({alert.status})
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                )}

                {/* ================= 6. ADMIN SYSTEM WORKSPACE ================= */}
                {role === "admin" && (
                  <div className="space-y-6">
                    {/* Admin stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Submissions</CardTitle>
                          <FileText className="h-4 w-4 text-[#0b99ff]" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">342</div>
                          <span className="text-[10px] text-green-600 dark:text-green-400 font-semibold flex items-center gap-1 mt-1">
                            +12% increase this quarter
                          </span>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Active Reviewers</CardTitle>
                          <Users className="h-4 w-4 text-[#0b99ff]" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">118</div>
                          <span className="text-[10px] text-slate-555 dark:text-slate-400 font-medium block mt-1">
                            84 verified with ORCID
                          </span>
                        </CardContent>
                      </Card>

                      <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Active Journals</CardTitle>
                          <BookOpen className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">4</div>
                          <span className="text-[10px] text-slate-555 dark:text-slate-400 font-medium block mt-1">
                            Indexed & Managed
                          </span>
                        </CardContent>
                      </Card>

                      <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Integrity Index</CardTitle>
                          <ShieldCheck className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">99.8%</div>
                          <span className="text-[10px] text-orange-500 font-semibold flex items-center gap-1 mt-1">
                            2 pending alerts flagged
                          </span>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Configuration Settings */}
                      <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 lg:col-span-1 space-y-4 transition-colors">
                        <div>
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">Workflow Automation</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Toggle global system operations policies.</p>
                        </div>
                        
                        <div className="space-y-4.5 pt-2">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">Double-Blind Review</label>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Hide identities of authors/reviewers.</span>
                            </div>
                            <input 
                              type="checkbox" 
                              checked={doubleBlind}
                              onChange={(e) => setDoubleBlind(e.target.checked)}
                              className="h-4 w-4 text-[#0b99ff] focus:ring-[#0b99ff] border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 cursor-pointer rounded"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">Pre-flight Integrity Scans</label>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Trigger plagiarism/AI checkers on submission.</span>
                            </div>
                            <input 
                              type="checkbox" 
                              checked={autoIntegrity}
                              onChange={(e) => setAutoIntegrity(e.target.checked)}
                              className="h-4 w-4 text-[#0b99ff] focus:ring-[#0b99ff] border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 cursor-pointer rounded"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">Mandatory ORCID Registry</label>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Block registration without verified ORCID.</span>
                            </div>
                            <input 
                              type="checkbox" 
                              checked={orcidRequired}
                              onChange={(e) => setOrcidRequired(e.target.checked)}
                              className="h-4 w-4 text-[#0b99ff] focus:ring-[#0b99ff] border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 cursor-pointer rounded"
                            />
                          </div>
                        </div>

                        <div className="pt-2">
                          <Button className="w-full bg-[#0b99ff] hover:bg-[#0b8ceb] text-white font-bold text-xs cursor-pointer">
                            Save Configurations
                          </Button>
                        </div>
                      </Card>

                      {/* Workspace Registry Directory */}
                      <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 lg:col-span-2 overflow-hidden transition-colors">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                          <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Workspace Registry</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">System access logs for all active administrators, editors, and reviewers.</p>
                          </div>
                          <Button 
                            onClick={() => setIsInviteUserOpen(true)}
                            size="sm"
                            className="bg-[#0b99ff]/10 hover:bg-[#0b99ff]/20 text-[#0b99ff] border border-[#0b99ff]/30 text-xs font-bold cursor-pointer"
                          >
                            Add Member
                          </Button>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase">
                                <th className="px-5 py-3">Member Name</th>
                                <th className="px-5 py-3">Assigned Role</th>
                                <th className="px-5 py-3 text-center">Active Load</th>
                                <th className="px-5 py-3">Account Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                              {users.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors">
                                  <td className="px-5 py-3.5">
                                    <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                                    <div className="text-[10px] text-slate-500 dark:text-slate-400">{u.email}</div>
                                  </td>
                                  <td className="px-5 py-3.5">
                                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md uppercase bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                                      {u.role === "jm" ? "Manager" : u.role}
                                    </span>
                                  </td>
                                  <td className="px-5 py-3.5 text-center font-bold text-slate-700 dark:text-slate-200">
                                    {u.activeTasks} items
                                  </td>
                                  <td className="px-5 py-3.5">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      u.status === "Active" 
                                        ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20" 
                                        : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20 "
                                    }`}>
                                      {u.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </Card>

                    </div>

                    {/* Managed Journals Directory Table */}
                    <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors mt-6">
                      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Managed Journals Directory</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Track submission volumes, average decision latencies, and editor-in-chief assignments for active peer journals.</p>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase">
                              <th className="px-5 py-3">Journal Name</th>
                              <th className="px-5 py-3 text-center">Acronym</th>
                              <th className="px-5 py-3 text-center">Submissions Volume</th>
                              <th className="px-5 py-3 text-center">Avg Turnaround Latency</th>
                              <th className="px-5 py-3">Editor-in-Chief</th>
                              <th className="px-5 py-3">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                            {journals.map((j, idx) => (
                              <tr key={idx} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors">
                                <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">{j.name}</td>
                                <td className="px-5 py-3.5 text-center font-bold text-[#0b99ff]">{j.code}</td>
                                <td className="px-5 py-3.5 text-center text-slate-700 dark:text-slate-350">{j.submissions} articles</td>
                                <td className="px-5 py-3.5 text-center text-slate-700 dark:text-slate-350">{j.latency} days</td>
                                <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300">{j.editorInChief}</td>
                                <td className="px-5 py-3.5">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                                    {j.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>

                  </div>
                )}

              </div>
            </main>

          </div>

          {/* ================= ======================================= */}
          {/* DIALOGS AND MODAL POPUPS                                  */}
          {/* ================= ======================================= */}

          {/* 1. JM: SANITIZE / EDIT & RELEASE COMMENTS DIALOG */}
          <Dialog open={isModerationOpen} onOpenChange={setIsModerationOpen}>
            <DialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 sm:max-w-lg transition-colors">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-[#0b99ff]" />
                  Vet & Redact Reviewer Comments
                </DialogTitle>
                <DialogDescription className="text-slate-500 dark:text-slate-400">
                  Reviews are held securely. You can modify comments to remove hostile phrasing or CoI signals before releasing them to the author.
                </DialogDescription>
              </DialogHeader>

              {reviews.find(r => r.id === moderatingReviewId) && (() => {
                const activeRev = reviews.find(r => r.id === moderatingReviewId)!
                return (
                  <div className="space-y-4 py-2 text-xs font-semibold">
                    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 p-3.5 rounded space-y-1.5 font-medium">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Original Reviewer Comments (To Author)</span>
                      <p className="text-slate-700 dark:text-slate-350 italic leading-relaxed">&ldquo;{activeRev.commentsAuthor}&rdquo;</p>
                      
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800/60 flex justify-between text-[10px] text-slate-400">
                        <span>Originality Fit Score: {activeRev.originality}/5</span>
                        <span>Recommendation: <strong className="text-[#0b99ff] uppercase">{activeRev.recommendation}</strong></span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Redactd Comments (Visible to Author)</label>
                      <textarea
                        value={modRedactdComments}
                        onChange={(e) => setModRedactdComments(e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                        placeholder="Modify comments to render them academic and constructive..."
                      />
                      <span className="text-[9px] text-slate-400 block leading-tight">Vetting log history records edits for accountability. These changes are saved in the journal archives.</span>
                    </div>

                    <DialogFooter className="pt-2">
                      <Button
                        onClick={() => setIsModerationOpen(false)}
                        variant="ghost"
                        className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleApproveAndReleaseFeedback}
                        className="bg-[#0b99ff] hover:bg-[#0b8ceb] text-white font-bold cursor-pointer"
                      >
                        Approve & Release to Author
                      </Button>
                    </DialogFooter>
                  </div>
                )
              })()}
            </DialogContent>
          </Dialog>

          {/* 2. AUTHOR: SUBMIT MANUSCRIPT STEPPER MODAL */}
          <Dialog open={isSubmitWizardOpen} onOpenChange={setIsSubmitWizardOpen}>
            <DialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 sm:max-w-xl transition-colors">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#0b99ff]" />
                  Submit New Manuscript Draft
                </DialogTitle>
                <DialogDescription className="text-slate-500 dark:text-slate-400">
                  Follow the step-by-step submission portal. Fields are validated dynamically.
                </DialogDescription>
              </DialogHeader>

              {/* Stepper progress indicator */}
              <div className="grid grid-cols-4 gap-2 py-2 text-center text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">
                <div className={`${submitStep >= 1 ? "text-[#0b99ff]" : ""}`}>1. Metadata</div>
                <div className={`${submitStep >= 2 ? "text-[#0b99ff]" : ""}`}>2. File Upload</div>
                <div className={`${submitStep >= 3 ? "text-[#0b99ff]" : ""}`}>3. Co-Authors</div>
                <div className={`${submitStep >= 4 ? "text-[#0b99ff]" : ""}`}>4. Disclosure</div>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-[#0b99ff] transition-all duration-300"
                  style={{ width: `${(submitStep / 4) * 100}%` }}
                />
              </div>

              {submitStep === 1 && (
                <div className="space-y-4 py-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Peer Journal</label>
                    <select
                      value={newJournal}
                      onChange={(e) => setNewJournal(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                    >
                      <option>Engineering & Applied Sciences</option>
                      <option>Social Sciences & Humanities</option>
                      <option>Social Sciences Open</option>
                      <option>Data Science</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Manuscript Title</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                      placeholder="e.g. Deep Reinforcement Learning for Grid Operations"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Abstract Summary</label>
                    <textarea
                      value={newAbstract}
                      onChange={(e) => setNewAbstract(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0b99ff] resize-none animate-none"
                      placeholder="Input the complete abstract overview..."
                    />
                  </div>
                </div>
              )}

              {submitStep === 2 && (
                <div className="space-y-4 py-8 text-center">
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-8 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center cursor-pointer hover:border-[#0b99ff] transition-colors">
                    <FileText className="h-10 w-10 text-[#0b99ff] mb-3" />
                    <span className="text-xs font-bold text-slate-650 dark:text-slate-300">Click to select manuscript PDF</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Only .pdf format accepted (Max 24MB)</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center text-[10px] text-green-600 dark:text-green-400">
                    <Check className="h-3.5 w-3.5" /> Simulated PDF file successfully linked: <i>draft_manuscript.pdf</i>
                  </div>
                </div>
              )}

              {submitStep === 3 && (
                <div className="space-y-4 py-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Co-Author Academic Emails</label>
                    <input
                      type="text"
                      value={newKeywords}
                      onChange={(e) => setNewKeywords(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                      placeholder="comma-separated emails (e.g. p.miller@university.edu)"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">Co-authors will automatically receive invitation links requesting affiliation verification before peer-review assignment is initialized.</p>
                </div>
              )}

              {submitStep === 4 && (
                <div className="space-y-4 py-4">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md">
                    <div className="flex items-start gap-2.5">
                      <ShieldCheck className="h-5 w-5 text-[#0b99ff] shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h5 className="text-xs font-bold text-[#0b99ff]">Conflict of Interest Disclosure</h5>
                        <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">I declare that all financial, institutional, and personal conflict of interest details have been disclosed in the cover letter. I verify the manuscript contains original research.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input 
                      id="disclosure-check" 
                      type="checkbox" 
                      defaultChecked
                      className="h-4 w-4 text-[#0b99ff] focus:ring-[#0b99ff] border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded cursor-pointer animate-none"
                    />
                    <label htmlFor="disclosure-check" className="text-xs text-slate-500 dark:text-slate-400 font-semibold cursor-pointer select-none">
                      I agree to Scholarly Open Code of Conduct
                    </label>
                  </div>
                </div>
              )}

              <DialogFooter className="gap-2 sm:gap-0">
                {submitStep > 1 && (
                  <Button 
                    type="button"
                    onClick={() => setSubmitStep(prev => prev - 1)}
                    variant="ghost"
                    className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                  >
                    Back
                  </Button>
                )}
                {submitStep < 4 ? (
                  <Button 
                    type="button"
                    onClick={() => setSubmitStep(prev => prev + 1)}
                    className="bg-[#0b99ff] hover:bg-[#0b8ceb] text-white font-bold cursor-pointer"
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button 
                    type="button"
                    onClick={handleNewSubmissionSubmit}
                    className="bg-[#0b99ff] hover:bg-[#0b8ceb] text-white font-bold cursor-pointer"
                  >
                    Confirm & Submit
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* 3. AUTHOR: REVISION VIEW & SUBMIT MODAL */}
          <Dialog open={isRevisionDialogOpen} onOpenChange={setIsRevisionDialogOpen}>
            <DialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 sm:max-w-md transition-colors">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">Upload Revised Manuscript</DialogTitle>
                <DialogDescription className="text-slate-500 dark:text-slate-400">
                  Review moderated feedback and upload corrected files.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-2 text-xs font-semibold">
                
                {/* Secure moderated reviewer feedback section */}
                <div className="space-y-1.5 p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider block">Released Reviewer Comments</span>
                  {reviews.filter(r => r.paperId === revisionPaperId && r.status === "Released").length === 0 ? (
                    <p className="text-slate-500 dark:text-slate-400 italic font-medium leading-normal">
                      Review comments are currently undergoing editorial moderation and will be released shortly.
                    </p>
                  ) : (
                    reviews.filter(r => r.paperId === revisionPaperId && r.status === "Released").map((rev) => (
                      <div key={rev.id} className="space-y-1 pt-1">
                        <span className="text-[10px] text-slate-700 dark:text-slate-300 font-bold">Reviewer Recommendation: {rev.recommendation}</span>
                        <p className="text-slate-650 dark:text-slate-350 italic leading-relaxed font-medium">
                          &ldquo;{rev.sanitizedCommentsAuthor || rev.commentsAuthor}&rdquo;
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Point-by-point Response Letter</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0b99ff] resize-none"
                    placeholder="Briefly state modifications made in response to reviewers..."
                  />
                </div>
                
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-6 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center cursor-pointer hover:border-[#0b99ff]">
                  <FileText className="h-8 w-8 text-[#0b99ff] mb-2" />
                  <span className="text-xs font-bold text-slate-650 dark:text-slate-300">Select revised PDF manuscript</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">draft_revised_V2.pdf</span>
                </div>
              </div>

              <DialogFooter>
                <Button 
                  onClick={() => setIsRevisionDialogOpen(false)}
                  variant="ghost"
                  className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUploadRevision}
                  className="bg-[#0b99ff] hover:bg-[#0b8ceb] text-white font-bold cursor-pointer"
                >
                  Submit Revision File
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* 4. ADMIN: INVITE USER MODAL */}
          <Dialog open={isInviteUserOpen} onOpenChange={setIsInviteUserOpen}>
            <DialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 sm:max-w-md transition-colors">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-[#0b99ff]" />
                  Invite Workspace Member
                </DialogTitle>
                <DialogDescription className="text-slate-500 dark:text-slate-400">
                  Send an automatic system invitation link to a verified academic colleague.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleInviteUser} className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Invite Role Assignment</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                  >
                    <option value="editor">Editor</option>
                    <option value="reviewer">Reviewer</option>
                    <option value="ria">Quality Check Admin (QC Admin)</option>
                    <option value="jm">Journal Manager</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                  <input
                    type="text"
                    required
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                    placeholder="e.g. Prof. Clara Zhang"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Institutional Email</label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                    placeholder="c.zhang@scholarlyopen.org"
                  />
                </div>

                <DialogFooter className="pt-2">
                  <Button 
                    type="button" 
                    onClick={() => setIsInviteUserOpen(false)}
                    variant="ghost" 
                    className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-[#0b99ff] hover:bg-[#0b8ceb] text-white font-bold cursor-pointer"
                  >
                    Send Invitation
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* 5. EDITOR: ASSIGN REVIEWERS MODAL WITH ACTIVE/INACTIVE/BUSY GROUPINGS */}
          <Dialog open={isAssignReviewerOpen} onOpenChange={setIsAssignReviewerOpen}>
            <DialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 sm:max-w-md transition-colors">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#0b99ff]" />
                  Reviewer Pool Assignment
                </DialogTitle>
                <DialogDescription className="text-slate-500 dark:text-slate-400">
                  Select peer reviewers to evaluate paper ID: {assignPaperId}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Search className="h-3.5 w-3.5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Filter reviewers by keyword specialization..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                  />
                </div>

                <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                  
                  {/* Category A: Active Suggestions */}
                  <div className="space-y-2">
                    <h5 className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Active & Available Suggestions</h5>
                    {reviewerSuggestions.filter(s => s.status === "Active").map((reviewer, idx) => {
                      const currentPaper = manuscripts.find(m => m.id === assignPaperId)
                      const isAssigned = currentPaper?.reviewers.includes(reviewer.name) || false
                      return (
                        <div key={idx} className="flex items-center justify-between p-2.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              {reviewer.name}
                              <span className="text-[9px] px-1 py-0.5 rounded bg-green-100 dark:bg-green-950/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900/10">Active</span>
                            </div>
                            <div className="text-[9px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
                              Fit: <strong className="text-green-600 dark:text-green-400">{reviewer.matchScore}%</strong> | Load: {reviewer.activeTasks} papers
                            </div>
                            <div className="text-[9px] text-slate-400 italic font-medium">{reviewer.specialization}</div>
                          </div>
                          <Button 
                            onClick={() => handleAssignReviewer(reviewer.name)}
                            size="sm"
                            className={`text-[10px] font-bold py-1 px-3 cursor-pointer ${
                              isAssigned 
                                ? "bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30" 
                                : "bg-[#0b99ff]/10 hover:bg-[#0b99ff]/20 text-[#0b99ff] border border-[#0b99ff]/30"
                            }`}
                          >
                            {isAssigned ? "Remove" : "Assign"}
                          </Button>
                        </div>
                      )
                    })}
                  </div>

                  {/* Category B: Busy Suggestions */}
                  <div className="space-y-2">
                    <h5 className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Busy / Reviewing (High load)</h5>
                    {reviewerSuggestions.filter(s => s.status === "Busy").map((reviewer, idx) => {
                      const currentPaper = manuscripts.find(m => m.id === assignPaperId)
                      const isAssigned = currentPaper?.reviewers.includes(reviewer.name) || false
                      return (
                        <div key={idx} className="flex items-center justify-between p-2.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              {reviewer.name}
                              <span className="text-[9px] px-1 py-0.5 rounded bg-yellow-100 dark:bg-yellow-950/20 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/10">Busy</span>
                            </div>
                            <div className="text-[9px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
                              Fit: <strong className="text-yellow-600 dark:text-yellow-400">{reviewer.matchScore}%</strong> | Load: {reviewer.activeTasks} papers
                            </div>
                            <div className="text-[9px] text-slate-400 italic font-medium">{reviewer.specialization}</div>
                          </div>
                          <Button 
                            onClick={() => handleAssignReviewer(reviewer.name)}
                            size="sm"
                            className={`text-[10px] font-bold py-1 px-3 cursor-pointer ${
                              isAssigned 
                                ? "bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30" 
                                : "bg-[#0b99ff]/10 hover:bg-[#0b99ff]/20 text-[#0b99ff] border border-[#0b99ff]/30"
                            }`}
                          >
                            {isAssigned ? "Remove" : "Assign"}
                          </Button>
                        </div>
                      )
                    })}
                  </div>

                  {/* Category C: Inactive Suggestions */}
                  <div className="space-y-2">
                    <h5 className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Inactive (Unavailable)</h5>
                    {reviewerSuggestions.filter(s => s.status === "Inactive").map((reviewer, idx) => {
                      return (
                        <div key={idx} className="flex items-center justify-between p-2.5 rounded bg-slate-55 dark:bg-slate-955 opacity-60 border border-slate-200 dark:border-slate-800">
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              {reviewer.name}
                              <span className="text-[9px] px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">Inactive</span>
                            </div>
                            <div className="text-[9px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
                              On Sabbatical Leave | Fit: {reviewer.matchScore}%
                            </div>
                            <div className="text-[9px] text-slate-400 italic font-medium">{reviewer.specialization}</div>
                          </div>
                          <Button 
                            disabled
                            size="sm"
                            className="bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 text-[10px] font-bold py-1 px-3"
                          >
                            Unavailable
                          </Button>
                        </div>
                      )
                    })}
                  </div>

                </div>
              </div>

              <DialogFooter>
                <Button 
                  onClick={() => setIsAssignReviewerOpen(false)}
                  className="bg-[#0b99ff] hover:bg-[#0b8ceb] text-white font-bold cursor-pointer"
                >
                  Done
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* 6. EDITOR: LOG DECISION MODAL */}
          <Dialog open={isDecisionOpen} onOpenChange={setIsDecisionOpen}>
            <DialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 sm:max-w-md transition-colors">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-[#0b99ff]" />
                  Log Editorial Decision
                </DialogTitle>
                <DialogDescription className="text-slate-500 dark:text-slate-400">
                  Select your formal decision verdict for paper ID: {decisionPaperId}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Decision Outcome</label>
                  <select
                    value={decisionType}
                    onChange={(e) => setDecisionType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                  >
                    <option value="Accepted">Accept Manuscript</option>
                    <option value="Revision Required">Request Revisions</option>
                    <option value="Rejected">Reject Submission</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Official Editorial Dispatch Notes</label>
                  <textarea
                    value={decisionNote}
                    onChange={(e) => setDecisionNote(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0b99ff] resize-none animate-none"
                    placeholder="Input detailed justification to send to authors..."
                  />
                </div>
              </div>

              <DialogFooter>
                <Button 
                  onClick={() => setIsDecisionOpen(false)}
                  variant="ghost"
                  className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleMakeDecision}
                  className="bg-[#0b99ff] hover:bg-[#0b8ceb] text-white font-bold cursor-pointer"
                >
                  Post Verdict
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* 7. REVIEWER: SCORECARD EVALUATION FORM */}
          <Dialog open={isReviewFormOpen} onOpenChange={setIsReviewFormOpen}>
            <DialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 sm:max-w-lg transition-colors">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-[#0b99ff]" />
                  Peer Evaluation Scorecard
                </DialogTitle>
                <DialogDescription className="text-slate-500 dark:text-slate-400">
                  Assess original contribution metrics. Values directly notify handling editor.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-2 max-h-96 overflow-y-auto pr-1">
                
                {/* Scorecard Star metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Scientific Originality</label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button 
                          key={val} 
                          type="button" 
                          onClick={() => setScoreOriginality(val)}
                          className={`text-sm font-bold h-6.5 w-6.5 rounded flex items-center justify-center transition-all cursor-pointer ${
                            scoreOriginality >= val ? "bg-[#0b99ff] text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-450 hover:bg-slate-200 dark:hover:bg-slate-700"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Methodology Quality</label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button 
                          key={val} 
                          type="button" 
                          onClick={() => setScoreMethodology(val)}
                          className={`text-sm font-bold h-6.5 w-6.5 rounded flex items-center justify-center transition-all cursor-pointer ${
                            scoreMethodology >= val ? "bg-[#0b99ff] text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-450 hover:bg-slate-200 dark:hover:bg-slate-700"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Presentation & Clarity</label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button 
                          key={val} 
                          type="button" 
                          onClick={() => setScoreClarity(val)}
                          className={`text-sm font-bold h-6.5 w-6.5 rounded flex items-center justify-center transition-all cursor-pointer ${
                            scoreClarity >= val ? "bg-[#0b99ff] text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-450 hover:bg-slate-200 dark:hover:bg-slate-700"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Scientific Rigor</label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button 
                          key={val} 
                          type="button" 
                          onClick={() => setScoreSignificance(val)}
                          className={`text-sm font-bold h-6.5 w-6.5 rounded flex items-center justify-center transition-all cursor-pointer ${
                            scoreSignificance >= val ? "bg-[#0b99ff] text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-450 hover:bg-slate-200 dark:hover:bg-slate-700"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Written Evaluation Feedback (Moderated by JM/Editor before Author view)</label>
                  <textarea
                    value={reviewFeedback}
                    onChange={(e) => setReviewFeedback(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0b99ff] resize-none"
                    placeholder="Input detailed review comments..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Review Recommendation</label>
                  <select
                    value={reviewRecommendation}
                    onChange={(e) => setReviewRecommendation(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                  >
                    <option value="Accept">Accept as Draft</option>
                    <option value="Minor Revision">Recommend Minor Revision</option>
                    <option value="Major Revision">Recommend Major Revision</option>
                    <option value="Reject">Reject Submission</option>
                  </select>
                </div>
              </div>

              <DialogFooter>
                <Button 
                  onClick={() => setIsReviewFormOpen(false)}
                  variant="ghost"
                  className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitReviewScorecard}
                  className="bg-[#0b99ff] hover:bg-[#0b8ceb] text-white font-bold cursor-pointer"
                >
                  Submit Assessment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* 8. QC Admin: INTEGRITY FORENSICS INVESTIGATION MODAL */}
          <Dialog open={isForensicsOpen} onOpenChange={setIsForensicsOpen}>
            <DialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 sm:max-w-lg transition-colors">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-red-500 dark:text-red-400 flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 " />
                  QC Admin Integrity Forensics Suite
                </DialogTitle>
                <DialogDescription className="text-slate-500 dark:text-slate-400">
                  Analyze algorithmic scan metrics for case file reference {activeAlertId}.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-2">
                {integrityAlerts.find(a => a.id === activeAlertId) && (() => {
                  const alert = integrityAlerts.find(a => a.id === activeAlertId)!
                  return (
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550">{alert.journal}</span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{alert.title}</h4>
                      </div>

                      <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-950 p-3.5 rounded border border-slate-200 dark:border-slate-800">
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Check Modality</span>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{alert.type}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Algorithmic Score</span>
                          <span className="text-xs font-bold text-red-500 dark:text-red-400">{alert.score}</span>
                        </div>
                      </div>

                      {/* Forensics graphs */}
                      <div className="space-y-2.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Analysis Scan Breakdown</span>
                        <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-3 rounded border border-slate-200 dark:border-slate-800 text-xs">
                          {alert.type === "AI Content Index" ? (
                            <>
                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px] text-slate-700 dark:text-slate-300">
                                  <span>LLM Generated Probability</span>
                                  <span className="text-red-500 font-bold">88%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-yellow-500 to-red-500" style={{ width: "88%" }} />
                                </div>
                              </div>
                              <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-relaxed pt-1.5">
                                Scanned passages match predictable LLM structural parameters. Focus flagged segments on: <i>Methodology (Paragraphs 3-6)</i>.
                              </p>
                            </>
                          ) : (
                            <>
                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px] text-slate-700 dark:text-slate-300">
                                  <span>Direct Similarity Match</span>
                                  <span className="text-red-500 font-bold">34%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-red-500" style={{ width: "34%" }} />
                                </div>
                              </div>
                              <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-relaxed pt-1.5">
                                Matched sources: <i>International Labor Statistics Review (2024) (21% similarity)</i>, <i>SSRN Working Paper 10928 (13% similarity)</i>.
                              </p>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end gap-2.5 pt-2">
                        <Button
                          onClick={() => handleResolveIntegrity(alert.id, "clear")}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs cursor-pointer"
                        >
                          Clear Flag (Approve)
                        </Button>
                        <Button
                          onClick={() => handleResolveIntegrity(alert.id, "escalate")}
                          className="bg-red-650 hover:bg-red-700 text-white font-bold text-xs cursor-pointer"
                        >
                          Escalate Case to EIC
                        </Button>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </DialogContent>
          </Dialog>

        </div>
      )}

    </div>
  )
}

// Custom widgets for mock elements
function ClockWidget() {
  return (
    <div className="flex items-center gap-1">
      <RefreshCw className="h-4 w-4 text-[#0b99ff] shrink-0" />
    </div>
  )
}


// User Profile Header Component
function UserProfileHeader({ role }: { role: string }) {
  if (role === 'admin') return null;

  const getProfileData = () => {
    switch (role) {
      case 'author':
        return {
          name: 'Jane Doe',
          title: 'Senior Researcher, AI Ethics',
          orcid: '0000-1234-5678',
          avatar: '/images/avatar_jane.png',
          stats: [
            { label: 'Active Submissions', value: '3' },
          ],
          badges: ['Quality Contributor', 'Fast Responder'],
          nextBadge: 'Integrity Champion',
          interests: 'AI Ethics, Machine Learning, Data Privacy, Autonomous Systems',
        };
      case 'editor':
        return {
          name: 'Prof. Aris Thorne',
          title: 'Managing Editor, Social Sciences',
          orcid: '0000-8765-4321',
          avatar: '/images/avatar_alex.png',
          stats: [
            { label: 'Submissions Handled', value: '124' },
            { label: 'Acceptance Rate', value: '60%' },
            { label: 'Avg Turnaround', value: '7 Days' },
            { label: 'Pending Decisions', value: '4' },
          ],
        };
      case 'reviewer':
        return {
          name: 'Dr. Alex Johnson',
          title: 'Senior Researcher, AI Ethics',
          orcid: '0000-1122-3344',
          avatar: '/images/avatar_alex.png',
          stats: [
            { label: 'Avg Turnaround', value: '3 Days' },
            { label: 'Quality Score', value: '92%' },
            { label: 'Completed Reviews', value: '7' },
            { label: 'Overdue Reviews', value: '3' },
            { label: 'Reviewer Tier', value: 'Top 10%' },
          ],
        };
      case 'jm':
        return {
          name: 'Sarah Jenkins',
          title: 'Senior Journal Manager',
          orcid: '0000-9988-7766',
          avatar: '/images/avatar_jane.png',
          stats: [
            { label: 'Managed Journals', value: '3' },
            { label: 'Active Articles', value: '45' },
            { label: 'Resolved Issues', value: '112' },
          ],
        };
      case 'ria':
      case 'qc':
        return {
          name: 'Dr. Marcus Webb',
          title: 'Quality Control & Integrity Admin',
          orcid: '0000-5544-3322',
          avatar: '/images/avatar_alex.png',
          stats: [
            { label: 'Audited Manuscripts', value: '340' },
            { label: 'Flags Resolved', value: '89' },
            { label: 'Avg Audit Time', value: '2 Days' },
          ],
        };
      default:
        return null;
    }
  };

  const data = getProfileData();
  if (!data) return null;

  return (
    <div className="mb-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col md:flex-row gap-6 items-start shadow-sm">
      <div className="flex items-center gap-4 min-w-[250px]">
        <img src={data.avatar} alt={data.name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 dark:border-slate-800" />
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{data.name}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{data.title}</p>
          <a href="#" className="text-[10px] text-[#0b99ff] hover:underline mt-1 inline-flex items-center gap-1">
            ORCID: {data.orcid}
          </a>
        </div>
      </div>
      
      <div className="flex-1 w-full border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-4 md:pt-0 md:pl-6 flex flex-wrap gap-4">
        {data.stats.map((stat, i) => (
          <div key={i} className="flex-1 min-w-[100px] bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
            <div className="text-xl font-black text-slate-700 dark:text-slate-300">{stat.value}</div>
            <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      {role === 'author' && data.interests && (
        <div className="w-full md:w-auto md:max-w-[250px] border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-4 md:pt-0 md:pl-6 space-y-3">
          <div>
            <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Interests</h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{data.interests}</p>
          </div>
          {data.badges && (
             <div>
               <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Badges Earned</h4>
               <div className="flex flex-wrap gap-1.5 mt-1">
                 {data.badges.map(b => (
                   <span key={b} className="text-[9px] font-bold bg-[#0b99ff]/10 text-[#0b99ff] px-2 py-0.5 rounded-full border border-[#0b99ff]/20">{b}</span>
                 ))}
               </div>
               <div className="text-[10px] text-slate-500 mt-2">Next: <strong className="text-slate-700 dark:text-slate-300">{data.nextBadge}</strong></div>
               <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                 <div className="h-full bg-green-500 w-[70%]"></div>
               </div>
             </div>
          )}
        </div>
      )}
    </div>
  );
}

function AuthorCareerMetrics() {
  return (
    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Career Dashboard</h4>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="text-center p-3 border border-slate-200 dark:border-slate-800 rounded-lg">
             <div className="text-2xl font-black text-slate-800 dark:text-slate-200">5</div>
             <div className="text-[9px] font-bold text-slate-500 uppercase mt-1">Published Papers</div>
          </div>
          <div className="text-center p-3 border border-slate-200 dark:border-slate-800 rounded-lg">
             <div className="text-2xl font-black text-slate-800 dark:text-slate-200">120</div>
             <div className="text-[9px] font-bold text-slate-500 uppercase mt-1">Total Citations</div>
          </div>
          <div className="text-center p-3 border border-slate-200 dark:border-slate-800 rounded-lg col-span-2">
             <div className="text-2xl font-black text-slate-800 dark:text-slate-200">3</div>
             <div className="text-[9px] font-bold text-slate-500 uppercase mt-1">Journals Published In</div>
          </div>
        </div>
        
        <div className="mt-auto">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">Citations by Year</h4>
          <div className="flex items-end justify-between h-24 gap-1">
             {[40, 60, 80, 75, 100].map((h, i) => (
                <div key={i} className="w-full bg-[#0b99ff] hover:bg-[#0b8ceb] rounded-t-sm transition-all" style={{height: h + "%"}}></div>
             ))}
          </div>
          <div className="flex justify-between text-[9px] font-medium text-slate-400 mt-2">
             <span>2020</span>
             <span>2021</span>
             <span>2022</span>
             <span>2023</span>
             <span>2024</span>
          </div>
        </div>
        
        <button className="w-full mt-5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0b99ff] font-bold text-xs py-2 rounded transition-colors">
          View Full Career Report
        </button>
      </div>
    </div>
  );
}
