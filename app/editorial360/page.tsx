"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useLanguage } from "@/lib/language-context"
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
  ChevronDown, 
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
  MessageSquare,
  Lightbulb,
  Clock,
  Star,
  Flag,
  Award,
  TrendingUp,
  Target,
  Trophy,
  Upload,
  Link2,
  Linkedin,
  Activity,
  CheckCircle2
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

// Co-Review Invitation mock data
interface CoReviewInvitation {
  id: string
  paperId: string
  title: string
  journal: string
  inviterName: string
  status: "Pending Disclosure" | "Cleared" | "Flagged"
}

// Integrity Alert mock data
interface IntegrityAlert {
  id: string
  paperId: string
  title: string
  journal: string
  type: "Plagiarism Match" | "AI Content Index" | "Figure Duplication" | "Co-Reviewer COI Check"
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
  coReviewerName?: string
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


// Role Profile & Gamification Data Definitions
interface ProfileMetric {
  label: string
  value: string
  subtext: string
  icon: any
  color: string
}

interface RoleProfileData {
  name: string
  initials: string
  title: string
  affiliation: string
  orcid: string
  level: string
  levelNum: number
  rankNum: number
  activeTaskCount: string
  interests: string[]
  badges: string[]
  nextBadgeTitle: string
  nextBadgeGoal: string
  progressPercent: number
  metrics: ProfileMetric[]
}

function getRoleProfileData(role: UserRole): RoleProfileData {
  switch (role) {
    case "author":
      return {
        name: "Jane Doe",
        initials: "JD",
        title: "Senior Researcher, AI Ethics",
        affiliation: "Institute for Ethical AI, Cambridge, MA",
        orcid: "0000-1234-5678",
        level: "Level 4 Principal Author",
        levelNum: 4,
        rankNum: 14,
        activeTaskCount: "3 Active Submissions",
        interests: ["AI Ethics", "Machine Learning", "Data Privacy", "Autonomous Systems"],
        badges: ["Quality Contributor", "Fast Responder", "Ethics Verified"],
        nextBadgeTitle: "Integrity Champion",
        nextBadgeGoal: "Complete 3 more ethics disclosures & revisions to unlock!",
        progressPercent: 75,
        metrics: [
          { label: "Turnaround Speed", value: "4.5 Days", subtext: "Top 10% Revision Speed", icon: Clock, color: "text-amber-500" },
          { label: "Acceptance Rate", value: "88%", subtext: "Verified High Rigor", icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Completed Papers", value: "12 Published", subtext: "120 Total Citations", icon: FileText, color: "text-[#0b99ff]" },
          { label: "Active Submissions", value: "3 Active", subtext: "1 Under Review", icon: Target, color: "text-indigo-500" },
          { label: "Peer Percentile", value: "Top 10%", subtext: "Level 4 Author Rank", icon: Trophy, color: "text-purple-500" }
        ]
      }
    case "reviewer":
      return {
        name: "Dr. Evelyn Vane",
        initials: "EV",
        title: "Senior Peer Reviewer & Associate Professor",
        affiliation: "Dept of Computer Science & AI Systems",
        orcid: "0000-0002-1825-0097",
        level: "Level 5 Master Reviewer",
        levelNum: 5,
        rankNum: 8,
        activeTaskCount: "2 Active Reviews Assigned",
        interests: ["Renewable Energy", "Machine Learning", "Neural Networks", "Optimization"],
        badges: ["Precision Reviewer", "Fast Responder", "Top 10% Rank", "Double-Blind Legend"],
        nextBadgeTitle: "Reviewer Master",
        nextBadgeGoal: "Complete 3 more double-blind reviews to unlock!",
        progressPercent: 82,
        metrics: [
          { label: "Review Turnaround", value: "3.2 Days", subtext: "Top 5% Speed Rank", icon: Clock, color: "text-emerald-500" },
          { label: "Review Quality", value: "94%", subtext: "Editor Rigor Score", icon: Star, color: "text-amber-500" },
          { label: "Completed Reviews", value: "42 Reviews", subtext: "Across 4 Journals", icon: CheckSquare, color: "text-[#0b99ff]" },
          { label: "Active Load", value: "2 Assigned", subtext: "1 In Progress", icon: Activity, color: "text-[#0b99ff]" },
          { label: "Reviewer Percentile", value: "Top 5%", subtext: "Level 5 Reviewer Rank", icon: Trophy, color: "text-[#0b99ff]" }
        ]
      }
    case "editor":
      return {
        name: "Prof. Aris Thorne",
        initials: "AT",
        title: "Managing Editor & Professor of Political Science",
        affiliation: "School of Public Policy & International Affairs",
        orcid: "0000-0003-9182-4410",
        level: "Level 5 Managing Editor",
        levelNum: 5,
        rankNum: 3,
        activeTaskCount: "4 Manuscripts Under Evaluation",
        interests: ["International Relations", "Political Psychology", "American Government", "Policy Analysis"],
        badges: ["Master Moderator", "Fast Decisioner", "High Rigor Editor", "Editorial Fellow"],
        nextBadgeTitle: "Editorial Board Chair",
        nextBadgeGoal: "Process 5 more manuscript decisions this cycle!",
        progressPercent: 90,
        metrics: [
          { label: "Decision Latency", value: "12.4 Days", subtext: "Sub-to-Decision Speed", icon: Zap, color: "text-amber-500" },
          { label: "Decision Accuracy", value: "96%", subtext: "Board Audit Score", icon: ShieldCheck, color: "text-emerald-500" },
          { label: "Papers Handled", value: "86 Papers", subtext: "Lifetime Portfolio", icon: BookOpen, color: "text-[#0b99ff]" },
          { label: "Queue Load", value: "4 Assigned", subtext: "2 Awaiting Assignment", icon: Layers, color: "text-indigo-500" },
          { label: "Editor Percentile", value: "Top 3%", subtext: "Level 5 Managing Rank", icon: Trophy, color: "text-purple-500" }
        ]
      }
    case "jm":
      return {
        name: "Sarah Jenkins, M.S.",
        initials: "SJ",
        title: "Journal Operations Manager & Quality Desk Lead",
        affiliation: "Scholarly Open Central Editorial Desk",
        orcid: "0000-0001-5524-8891",
        level: "Level 6 Operations Lead",
        levelNum: 6,
        rankNum: 1,
        activeTaskCount: "2 Pending Moderation Tasks",
        interests: ["Publication Ethics", "Peer Review Moderation", "Journal Analytics", "COI Security"],
        badges: ["Operations Maestro", "Rigor Guardian", "Zero Backlog", "Safety Officer"],
        nextBadgeTitle: "Chief Operations Fellow",
        nextBadgeGoal: "Audit 10 more reviewer feedback packages!",
        progressPercent: 65,
        metrics: [
          { label: "Moderation Time", value: "1.8 Days", subtext: "Redaction & Release", icon: Clock, color: "text-emerald-500" },
          { label: "Safety Clearance", value: "99.2%", subtext: "COI & Redaction Rigor", icon: ShieldCheck, color: "text-emerald-500" },
          { label: "Reviews Moderated", value: "312 Items", subtext: "All Journals Managed", icon: MessageSquare, color: "text-[#0b99ff]" },
          { label: "Active Queue", value: "2 Pending", subtext: "Vetting Required", icon: MessageSquareOff, color: "text-orange-500" },
          { label: "Manager Rank", value: "Top 1%", subtext: "Level 6 Operations Lead", icon: Trophy, color: "text-[#0b99ff]" }
        ]
      }
    case "ria":
      return {
        name: "Dr. Marcus Vance",
        initials: "MV",
        title: "Research Integrity Advisor & Forensics Analyst",
        affiliation: "Center for Publication Ethics & Algorithmic Audit",
        orcid: "0000-0004-7711-2093",
        level: "Level 5 Integrity Specialist",
        levelNum: 5,
        rankNum: 2,
        activeTaskCount: "2 Active Forensics Alerts",
        interests: ["AI Content Indexing", "Plagiarism Forensics", "Figure Duplication", "COI Verification"],
        badges: ["Forensic Hawk", "Plagiarism Shield", "AI Auditor", "Rigor Specialist"],
        nextBadgeTitle: "Master Forensics Officer",
        nextBadgeGoal: "Resolve 4 more flagged integrity alerts!",
        progressPercent: 70,
        metrics: [
          { label: "Alert Resolution", value: "0.9 Days", subtext: "Forensics Audit Speed", icon: Zap, color: "text-emerald-500" },
          { label: "Detection Precision", value: "99.8%", subtext: "Similarity Index Precision", icon: Cpu, color: "text-indigo-500" },
          { label: "Audits Completed", value: "148 Audits", subtext: "Cross-Journal Index", icon: ShieldAlert, color: "text-rose-500" },
          { label: "Active Alerts", value: "2 Flagged", subtext: "Under Forensic Inspection", icon: AlertTriangle, color: "text-amber-500" },
          { label: "Integrity Rank", value: "Top 2%", subtext: "Level 5 Specialist Rank", icon: Trophy, color: "text-purple-500" }
        ]
      }
    default:
      return {
        name: "System Administrator",
        initials: "SA",
        title: "Chief Platform Architect & Node Admin",
        affiliation: "Scholarly Open Infrastructure Group",
        orcid: "0000-0000-0000-0001",
        level: "Level 10 System Superuser",
        levelNum: 10,
        rankNum: 1,
        activeTaskCount: "All Workspace Nodes Active",
        interests: ["Node Operations", "User Registry", "Security Protocols", "Workflow Schema"],
        badges: ["System Architect", "Security Master", "Uptime Champion"],
        nextBadgeTitle: "Infrastructure Master",
        nextBadgeGoal: "Maintain 99.99% Uptime across 320 prerendered routes!",
        progressPercent: 98,
        metrics: [
          { label: "Node Uptime", value: "99.99%", subtext: "Zero Downtime Recorded", icon: Zap, color: "text-emerald-500" },
          { label: "Node Security", value: "100%", subtext: "Verified Permissions Schema", icon: Lock, color: "text-[#0b99ff]" },
          { label: "Workspace Actions", value: "1.4k Logged", subtext: "System Audit Logs", icon: Settings, color: "text-purple-500" },
          { label: "Security Breaches", value: "0 Incidents", subtext: "All Systems Secure", icon: ShieldCheck, color: "text-emerald-500" },
          { label: "System Rank", value: "Top 1%", subtext: "Level 10 Superuser", icon: Trophy, color: "text-amber-500" }
        ]
      }
  }
}

interface UserProfileHeaderProps {
  role: UserRole
}

function UserProfileHeaderCard({ role }: UserProfileHeaderProps) {
  const getRoleConfig = (role: UserRole) => {
    switch (role) {
      case "jm":
        return {
          photo: "/images/manager-photo.png",
          name: "Sarah Jenkins, M.S.",
          title: "Journal Operations Manager & Quality Desk Lead",
          interestsLabel: "Operational Scope",
          interests: "Publication Ethics, Peer Review Moderation, COI Security",
          alertText: "Safety Moderation Notice: Audit reviewer comments for inflammatory language or direct PII before releasing to authors.",
          alertIcon: Lightbulb,
          metricsTitle: "Operations & Moderation Metrics",
          metrics: [
            { icon: Clock, value: "1.8 days", label: "AVG MODERATION TIME" },
            { icon: ShieldCheck, value: "99.2%", label: "SAFETY CLEARANCE RATE" },
            { icon: MessageSquare, value: "312", label: "REVIEWS MODERATED" },
            { icon: MessageSquareOff, value: "2", label: "PENDING IN MODERATION" },
            { icon: TrendingUp, value: "Top 1%", label: "OPERATIONS RANK" }
          ]
        }
      case "editor":
        return {
          photo: "/images/editor-photo.png",
          name: "Prof. Aris Thorne",
          title: "Managing Editor & Professor of Political Science",
          interestsLabel: "Editorial Scope",
          interests: "Public Policy, International Relations, Governance Systems",
          alertText: "Editorial Guideline: Ensure at least two double-blind peer evaluations are received before logging final decision.",
          alertIcon: Lightbulb,
          metricsTitle: "Editorial Portfolio Metrics",
          metrics: [
            { icon: Clock, value: "12.4 days", label: "DECISION LATENCY (AVG)" },
            { icon: ShieldCheck, value: "96%", label: "BOARD AUDIT SCORE" },
            { icon: FileText, value: "86", label: "PAPERS HANDLED" },
            { icon: Inbox, value: "4", label: "ACTIVE QUEUE LOAD" },
            { icon: TrendingUp, value: "Top 3%", label: "EDITOR PERCENTILE" }
          ]
        }
      case "reviewer":
        return {
          photo: "/images/reviewer-photo.png",
          name: "Dr. Alex Johnson",
          title: "Senior Researcher, AI Ethics",
          interestsLabel: "Research Interests",
          interests: "AI Bias, Data Privacy, Algorithmic Fairness",
          alertText: "Watch for AI artifacts in both text and visuals: vague language, inconsistent formatting, missing scale bars...",
          alertIcon: Lightbulb,
          metricsTitle: "Reviewer Metrics",
          metrics: [
            { icon: Clock, value: "3 days", label: "TIME TO COMPLETE (AVG)" },
            { icon: Star, value: "95%", label: "REVIEWS RATED HIGH QUALITY" },
            { icon: Flag, value: "7", label: "INTEGRITY FLAGS RAISED" },
            { icon: Award, value: "3", label: "BADGES EARNED" },
            { icon: TrendingUp, value: "Top 12%", label: "PERCENTILE SCORE" }
          ]
        }
      case "author":
        return {
          photo: "/images/author-photo.png",
          name: "Jane Doe",
          title: "Senior Researcher & Principal Author",
          interestsLabel: "Research Focus",
          interests: "Machine Learning, Data Privacy, Autonomous Systems",
          alertText: "Author Tip: Ensure ORCID iD is verified to automatically sync published articles with CrossRef and Scopus.",
          alertIcon: Lightbulb,
          metricsTitle: "Author Performance Metrics",
          metrics: [
            { icon: Clock, value: "4.5 days", label: "REVISION TURNAROUND" },
            { icon: Star, value: "88%", label: "ACCEPTANCE RIGOR RATE" },
            { icon: FileText, value: "12", label: "PUBLISHED PAPERS" },
            { icon: CheckSquare, value: "3", label: "ACTIVE SUBMISSIONS" },
            { icon: TrendingUp, value: "Top 10%", label: "AUTHOR PERCENTILE" }
          ]
        }
      case "ria":
        return {
          photo: "/images/ria-photo.png",
          name: "Dr. Marcus Vance",
          title: "Research Integrity Advisor & Forensics Analyst",
          interestsLabel: "Forensics Specialization",
          interests: "Image Duplication, AI Content Forensics, COI Verification",
          alertText: "Integrity Alert: Algorithmic detection flagged figure duplication and high AI content index in active queue.",
          alertIcon: Lightbulb,
          metricsTitle: "Forensics & Integrity Metrics",
          metrics: [
            { icon: Clock, value: "0.9 days", label: "ALERT RESOLUTION TIME" },
            { icon: Cpu, value: "99.8%", label: "DETECTION PRECISION" },
            { icon: ShieldAlert, value: "148", label: "FORENSIC AUDITS" },
            { icon: AlertTriangle, value: "2", label: "FLAGGED ALERTS" },
            { icon: TrendingUp, value: "Top 2%", label: "INTEGRITY RANK" }
          ]
        }
      case "admin":
      default:
        return {
          photo: "/images/admin-photo.png",
          name: "System Administrator",
          title: "Chief Platform Architect & Node Admin",
          interestsLabel: "System Scope",
          interests: "Node Operations, User Security Registry, Workflow Schema",
          alertText: "System Status: All 320 prerendered workspace nodes online. 99.99% system uptime maintained across regional clusters.",
          alertIcon: Lightbulb,
          metricsTitle: "System & Architecture Metrics",
          metrics: [
            { icon: Cpu, value: "99.99%", label: "NODE UPTIME" },
            { icon: Lock, value: "100%", label: "SECURITY SCHEMAS" },
            { icon: Settings, value: "1.4k", label: "SYSTEM ACTIONS LOGGED" },
            { icon: ShieldCheck, value: "0", label: "SECURITY BREACHES" },
            { icon: TrendingUp, value: "Top 1%", label: "SUPERUSER RANK" }
          ]
        }
    }
  }
  const config = getRoleConfig(role)

  return (
    <div className="bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xs transition-all">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Block: Avatar & Bio */}
        <div className="lg:col-span-5 space-y-4">
          <div className="w-20 h-20 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 font-bold text-2xl overflow-hidden shadow-xs">
            {config.photo ? (
              <img src={config.photo} alt={config.name} className="w-full h-full object-cover" />
            ) : (
              <span>{config.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {config.name}
            </h3>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {config.title}
            </p>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong className="text-slate-800 dark:text-slate-200 font-bold">{config.interestsLabel}:</strong> {config.interests}
          </p>
        </div>

        {/* Right Block: Contributor Recognition & Badges & Metrics */}
        <div className="lg:col-span-7 space-y-5 lg:pl-6 lg:border-l border-slate-100 dark:border-slate-900">
          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Contributor Recognition
            </h4>
            
            <div className="mt-3 space-y-1">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Badges Earned
              </span>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-50 dark:bg-sky-950/60 text-[#0b99ff] border border-sky-200/60 dark:border-sky-800/60 inline-flex items-center gap-1.5 shadow-2xs">
                  <Star className="h-3.5 w-3.5 text-sky-500" />
                  Quality Contributor
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-50 dark:bg-sky-950/60 text-[#0b99ff] border border-sky-200/60 dark:border-sky-800/60 inline-flex items-center gap-1.5 shadow-2xs">
                  <Award className="h-3.5 w-3.5 text-sky-500" />
                  Fast Responder
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Next Badge: Integrity Champion</span>
                <span className="text-emerald-600 dark:text-emerald-400">70%</span>
              </div>
              
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div className="bg-emerald-500 h-full w-[70%] rounded-full transition-all duration-500" />
              </div>
              
              <p className="text-xs text-slate-400 font-medium">
                Complete 3 more ethics reviews to unlock!
              </p>
            </div>

            <div className="pt-3">
              <Button 
                onClick={() => onExploreBadges && onExploreBadges()}
                type="button"
                className="bg-[#0b99ff] hover:bg-[#0b8ceb] text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-md cursor-pointer transition-all"
              >
                Explore Badges
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default function Editorial360Page() {
  const { language, setLanguage } = useLanguage()
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
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const urlRole = params.get("role") as UserRole
      const urlMode = params.get("mode") as "login" | "register"
      if (urlRole && ["admin", "author", "reviewer", "editor", "ria", "jm"].includes(urlRole)) {
        setRole(urlRole)
        setRegRole(urlRole === "reviewer" ? "reviewer" : "author")
      }
      if (urlMode && ["login", "register"].includes(urlMode)) {
        setMode(urlMode)
      }
    }
  }, [])

  // Mock Databases in state for interactivity
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([
    {
      id: "SOMED-26-RW01",
      title: "Clinical Evaluation of AI-Driven Diagnostic Imaging in Cardiovascular Medicine",
      journal: "Scholarly Open: Medicine",
      status: "Awaiting Initial Check",
      date: "2026-08-18",
      reviewers: [],
      integrityStatus: "Clean",
      plagiarismScore: 5,
      aiScore: 12
    },
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
    { name: "Scholarly Open: Engineering & Applied Sciences", code: "EAS", submissions: 142, latency: 22, status: "Active", editorInChief: "Prof. Clara Zhang" },
    { name: "Scholarly Open: Social Sciences & Humanities", code: "SSH", submissions: 98, latency: 26, status: "Active", editorInChief: "Prof. Aris Thorne" },
    { name: "Scholarly Open: Social Sciences Open", code: "SSO", submissions: 54, latency: 24, status: "Active", editorInChief: "Dr. Evelyn Vane" },
    { name: "Scholarly Open: Biology", code: "BIO", submissions: 62, latency: 20, status: "Active", editorInChief: "Dr. Helen Vance" },
    { name: "Scholarly Open: Chemistry", code: "CHEM", submissions: 75, latency: 21, status: "Active", editorInChief: "Prof. Robert Lang" },
    { name: "Scholarly Open: Medicine", code: "MED", submissions: 110, latency: 25, status: "Active", editorInChief: "Dr. Sarah Jenkins" },
    { name: "Scholarly Open: Data Science & Analytics", code: "DSA", submissions: 48, latency: 18, status: "Active", editorInChief: "Dr. Marcus Vance" },
    { name: "Scholarly Open: Environmental Science", code: "ENV", submissions: 43, latency: 19, status: "Active", editorInChief: "Prof. David Miller" },
    { name: "Scholarly Open: Clinical AI & Digital Health", code: "CAI", submissions: 89, latency: 15, status: "Active", editorInChief: "Dr. Alex Johnson" },
    { name: "Scholarly Open: AI Safety & Governance", code: "AIS", submissions: 94, latency: 16, status: "Active", editorInChief: "Dr. Marcus Vance" },
    { name: "Scholarly Open: Decarbonization & Carbon Tech", code: "DCT", submissions: 37, latency: 23, status: "Active", editorInChief: "Prof. Clara Zhang" },
    { name: "Scholarly Open: Quantum Engineering", code: "QE", submissions: 29, latency: 17, status: "Active", editorInChief: "Prof. Aris Thorne" },
    { name: "Scholarly Open: Synthetic Biology & Bio-Design", code: "SBD", submissions: 51, latency: 20, status: "Active", editorInChief: "Dr. Evelyn Vane" },
    { name: "Scholarly Open: Space Resources & Orbital Economy", code: "SRE", submissions: 33, latency: 28, status: "Active", editorInChief: "Prof. David Miller" }
  ])

  // Dialog and Wizard control states
  const [isSubmitWizardOpen, setIsSubmitWizardOpen] = useState(false)
  const [submitStep, setSubmitStep] = useState(1)
  const [newTitle, setNewTitle] = useState("")
  const [newJournal, setNewJournal] = useState("Scholarly Open: Engineering & Applied Sciences")
  const [newSubmissionStage, setNewSubmissionStage] = useState("Initial Submission")
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

  // Morressier-inspired Stage Filter & Search States
  const [manuscriptSearch, setManuscriptSearch] = useState("")
  const [manuscriptStageFilter, setManuscriptStageFilter] = useState<"all" | "inbox" | "review" | "revision" | "decided">("all")
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban")

  const filteredManuscripts = manuscripts.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(manuscriptSearch.toLowerCase()) ||
      m.id.toLowerCase().includes(manuscriptSearch.toLowerCase()) ||
      m.journal.toLowerCase().includes(manuscriptSearch.toLowerCase()) ||
      m.reviewers.some((r) => r.toLowerCase().includes(manuscriptSearch.toLowerCase()))

    if (!matchesSearch) return false

    if (manuscriptStageFilter === "inbox") return m.status === "Awaiting Initial Check" || m.status === "Submitted" || m.reviewers.length === 0
    if (manuscriptStageFilter === "review") return m.status === "Under Review"
    if (manuscriptStageFilter === "revision") return m.status === "Revision Required"
    if (manuscriptStageFilter === "decided") return m.status === "Accepted" || m.status === "Rejected"
    return true
  })

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

  // Co-Reviewing States
  const [coReviewInvitations, setCoReviewInvitations] = useState<CoReviewInvitation[]>([
    {
      id: "COREV-1",
      paperId: "REV-2026-12",
      title: "Climate Adaptation Strategies in Coastal Communities",
      journal: "Social Sciences & Humanities",
      inviterName: "Dr. Evelyn Vane",
      status: "Pending Disclosure"
    }
  ])
  const [isInviteCoReviewerOpen, setIsInviteCoReviewerOpen] = useState(false)
  const [inviteCoRevPaperId, setInviteCoRevPaperId] = useState("")
  const [coRevName, setCoRevName] = useState("")
  const [coRevEmail, setCoRevEmail] = useState("")
  const [coRevAffiliation, setCoRevAffiliation] = useState("")

  const [isCoRevDisclosureOpen, setIsCoRevDisclosureOpen] = useState(false)
  const [activeCoRevId, setActiveCoRevId] = useState("")
  const [coRevConfidentiality, setCoRevConfidentiality] = useState(false)
  const [coRevNoCOI, setCoRevNoCOI] = useState(false)
  const [isCoRevAcknowledged, setIsCoRevAcknowledged] = useState(false)

  // Moderation Dialog states
  const [isModerationOpen, setIsModerationOpen] = useState(false)
  const [moderatingReviewId, setModeratingReviewId] = useState("")
  const [modRedactdComments, setModRedactdComments] = useState("")

  // Admin settings toggles
  const [doubleBlind, setDoubleBlind] = useState(true)
  const [autoIntegrity, setAutoIntegrity] = useState(true)
  const [orcidRequired, setOrcidRequired] = useState(false)

  // Active sub-page tab for JM / Editor / Author
  const [activeJmTab, setActiveJmTab] = useState<"board" | "moderation" | "archives" | "users">("board")
  const [activeAuthorTab, setActiveAuthorTab] = useState<"dashboard" | "submissions" | "scorecard" | "plagiarism" | "feedback" | "recognition" | "career">("dashboard")
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  // Interactive Plagiarism Scan States
  const [selectedScanPaperId, setSelectedScanPaperId] = useState<string>("SOMED-26-RW01")
  const [isScanningPlagiarism, setIsScanningPlagiarism] = useState<boolean>(false)
  const [scanProgress, setScanProgress] = useState<number>(0)
  const [scanCompletedSuccess, setScanCompletedSuccess] = useState<boolean>(false)

  const handleRunPlagiarismScan = () => {
    setIsScanningPlagiarism(true)
    setScanProgress(15)
    setScanCompletedSuccess(false)
    
    const timer = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setIsScanningPlagiarism(false)
          setScanCompletedSuccess(true)
          return 100
        }
        return prev + 25
      })
    }, 350)
  }

  // Interactive Readiness Scorecard Upload States
  const [scorecardFileName, setScorecardFileName] = useState<string>("")
  const [isAuditingScorecard, setIsAuditingScorecard] = useState<boolean>(false)
  const [scorecardAuditProgress, setScorecardAuditProgress] = useState<number>(0)
  const [isFigureFixed, setIsFigureFixed] = useState<boolean>(false)

  // Interactive Author Modals & Search States
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState<boolean>(false)
  const [isManuscriptDetailsOpen, setIsManuscriptDetailsOpen] = useState<boolean>(false)
  const [selectedManuscriptDetails, setSelectedManuscriptDetails] = useState<Manuscript | null>(null)
  
  // Feedback Portal Submission States
  const [authorResponseText, setAuthorResponseText] = useState<string>("")
  const [isSubmittingResponse, setIsSubmittingResponse] = useState<boolean>(false)
  const [responseSubmittedSuccess, setResponseSubmittedSuccess] = useState<boolean>(false)

  // ORCID Sync State
  const [isOrcidSyncing, setIsOrcidSyncing] = useState<boolean>(false)
  const [orcidLastSynced, setOrcidLastSynced] = useState<string>("2026-08-18 19:45 UTC")

  const handleSyncOrcid = () => {
    setIsOrcidSyncing(true)
    setTimeout(() => {
      setIsOrcidSyncing(false)
      setOrcidLastSynced("Synced Just Now ✓")
    }, 1200)
  }

  const handleScorecardFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setScorecardFileName(file.name)
      setIsAuditingScorecard(true)
      setScorecardAuditProgress(20)
      
      const timer = setInterval(() => {
        setScorecardAuditProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer)
            setIsAuditingScorecard(false)
            return 100
          }
          return prev + 20
        })
      }, 300)
    }
  }

  const roles: { id: UserRole; label: string; placeholder: string }[] = [
    { id: "jm", label: "Journal Manager", placeholder: "manager@scholarlyopen.org" },
    { id: "editor", label: "Editor", placeholder: "editor@scholarlyopen.org" },
    { id: "reviewer", label: "Reviewer", placeholder: "reviewer@scholarlyopen.org" },
    { id: "author", label: "Author", placeholder: "author@scholarlyopen.org" },
    { id: "ria", label: "RIA (Research Integrity Advisor)", placeholder: "ria@scholarlyopen.org" },
    { id: "admin", label: "Admin", placeholder: "admin@scholarlyopen.org" },
  ]

  // First-Time Author Profile Builder States
  const [isAuthorProfileSetupOpen, setIsAuthorProfileSetupOpen] = useState(false)
  const [isAuthorProfileCompleted, setIsAuthorProfileCompleted] = useState(false)
  const [profFullName, setProfFullName] = useState("Dr. Evelyn Vane")
  const [profRank, setProfRank] = useState("Senior Researcher & Faculty Lead")
  const [profInstitution, setProfInstitution] = useState("Institute of Advanced Medical Sciences")
  const [profCountry, setProfCountry] = useState("United States")
  const [profOrcid, setProfOrcid] = useState("0000-0002-1825-0097")
  const [profSpecialization, setProfSpecialization] = useState("Cardiology, Clinical AI, Diagnostic Imaging")
  const [profReviewOptIn, setProfReviewOptIn] = useState(true)

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
      if (role === "author" && !isAuthorProfileCompleted) {
        setIsAuthorProfileSetupOpen(true)
      } else if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search)
        if (params.get("action") === "submit") {
          setIsSubmitWizardOpen(true)
        }
      }
    }, 1000)
  }

  const handleSsoLogin = (providerName: string) => {
    setLoading(true)
    setError("")
    setSuccess(`Connecting to ${providerName}...`)

    setTimeout(() => {
      setLoading(false)
      setIsLoggedIn(true)
      setRole("author")
      setEmail(`author.${providerName.toLowerCase().replace(/[^a-z0-9]/g, "")}@scholarlyopen.org`)
      setSuccess(`Authenticated via ${providerName}! Please complete your author profile.`)
      if (!isAuthorProfileCompleted) {
        setIsAuthorProfileSetupOpen(true)
      } else if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search)
        if (params.get("action") === "submit") {
          setIsSubmitWizardOpen(true)
        }
      }
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

  const handleInviteCoReviewer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!coRevName || !coRevEmail || !coRevAffiliation) return
    const newInv: CoReviewInvitation = {
      id: `COREV-${Math.floor(Math.random() * 1000)}`,
      paperId: inviteCoRevPaperId,
      title: "Manuscript Under Review",
      journal: "Engineering & Applied Sciences",
      inviterName: "User",
      status: "Pending Disclosure"
    }
    setCoReviewInvitations(prev => [...prev, newInv])
    setIsInviteCoReviewerOpen(false)
    setCoRevName("")
    setCoRevEmail("")
    setCoRevAffiliation("")
  }

  const handleSubmitCoRevDisclosure = () => {
    if (!coRevConfidentiality || !coRevNoCOI) return
    
    const isFlagged = coRevEmail.includes("author-institution.edu")
    
    if (isFlagged) {
      setCoReviewInvitations(prev => prev.map(inv => 
        inv.id === activeCoRevId ? { ...inv, status: "Flagged" } : inv
      ))
      const newAlert: IntegrityAlert = {
        id: `ALT-${Math.floor(Math.random() * 1000)}`,
        paperId: "REV-2026-12", 
        title: "Climate Adaptation Strategies",
        journal: "Social Sciences",
        type: "Co-Reviewer COI Check",
        score: "Match",
        detail: `Co-Reviewer ${coRevEmail} institutional domain matches an author.`,
        severity: "critical",
        status: "Flagged"
      }
      setIntegrityAlerts(prev => [...prev, newAlert])
    } else {
      setCoReviewInvitations(prev => prev.map(inv => 
        inv.id === activeCoRevId ? { ...inv, status: "Cleared" } : inv
      ))
      setIsCoRevAcknowledged(true)
    }
    setIsCoRevDisclosureOpen(false)
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
        coReviewerName: isCoRevAcknowledged ? "Dr. Alex Johnson (Co-Reviewer)" : undefined,
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
              
              {/* Login Container Header */}
              <div className="flex flex-col items-center text-center">
                {/* Light Font EN | DE Language Switcher Above Login */}
                <div className="flex items-center justify-center gap-1.5 text-xs font-light text-slate-400 select-none mb-2">
                  <button
                    type="button"
                    onClick={() => setLanguage("en")}
                    className={`transition-colors cursor-pointer ${
                      language === "en"
                        ? "font-semibold text-[#0b99ff]"
                        : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-light"
                    }`}
                  >
                    EN
                  </button>
                  <span className="text-slate-300 dark:text-slate-700 font-light">|</span>
                  <button
                    type="button"
                    onClick={() => setLanguage("de")}
                    className={`transition-colors cursor-pointer ${
                      language === "de"
                        ? "font-semibold text-[#0b99ff]"
                        : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-light"
                    }`}
                  >
                    DE
                  </button>
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
                  {mode === "login" 
                    ? (language === "de" ? "Anmelden" : "Login") 
                    : (language === "de" ? "Konto erstellen" : "Create account")}
                </h1>

                <div className="flex h-10 w-auto items-center justify-center my-2 hover:scale-105 transition-all">
                  <img 
                    src="/editorial360.svg" 
                    alt="Editorial360" 
                    className="h-full w-auto object-contain" 
                  />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {language === "de" ? "Oder " : "Or "}
                  <button
                    type="button"
                    onClick={() => toggleMode(mode === "login" ? "register" : "login")}
                    className="text-[#0b99ff] hover:underline font-bold focus:outline-none cursor-pointer"
                  >
                    {mode === "login" 
                      ? (language === "de" ? "Neues Konto erstellen" : "Create account") 
                      : (language === "de" ? "Mit bestehendem Konto anmelden" : "Sign in to existing account")}
                  </button>
                </p>
              </div>

              {/* Login/Registration Card container */}
              <Card className="border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl bg-white dark:bg-slate-950 overflow-hidden relative transition-all">
                <div className="h-1.5 w-full bg-[#0b99ff]" />
                
                {mode === "login" ? (
                  // ================= LOGIN FORM =================
                  <form onSubmit={handleLogin} className="pt-6">
                    <CardContent className="space-y-4 px-6 py-2">
                      {error && (
                        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-xs font-medium border border-red-200 dark:border-red-900/30">
                          {error}
                        </div>
                      )}
                      {success && (
                        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 text-xs font-medium border border-green-200 dark:border-green-900/30">
                          {success}
                        </div>
                      )}

                      {/* Role Select Dropdown */}
                      <div className="space-y-1">
                        <label htmlFor="role-select" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {language === "de" ? "Rolle auswählen" : "Select Role"}
                        </label>
                        <select
                          id="role-select"
                          value={role}
                          onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                          className="w-full px-3.5 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff] transition-all cursor-pointer font-medium"
                        >
                          {roles.map((r) => (
                            <option key={r.id} value={r.id}>
                              {language === "de"
                                ? (r.id === "jm" ? "Zeitschriften-Manager" : r.id === "editor" ? "Redakteur" : r.id === "reviewer" ? "Gutachter" : r.id === "author" ? "Autor" : r.id === "ria" ? "RIA (Integritätsberater)" : "Administrator")
                                : r.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Email Address */}
                      <div className="space-y-1">
                        <label htmlFor="email" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {language === "de" ? "E-Mail-Adresse" : "Email"}
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3.5 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff] transition-all"
                          placeholder={language === "de" ? "E-Mail-Adresse eingeben" : "Email address"}
                        />
                      </div>

                      {/* Password */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label htmlFor="password" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {language === "de" ? "Passwort" : "Password"}
                          </label>
                          <Link
                            href="#"
                            className="text-xs text-[#0b99ff] hover:underline"
                          >
                            {language === "de" ? "Passwort vergessen?" : "Forgot email or password?"}
                          </Link>
                        </div>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="current-password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-3.5 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff] transition-all"
                          placeholder={language === "de" ? "Passwort eingeben" : "Password"}
                        />
                      </div>

                      {/* Remember me */}
                      <div className="flex items-center pt-0.5">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 rounded border-slate-300 text-[#0b99ff] focus:ring-[#0b99ff] cursor-pointer"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-600 dark:text-slate-400 select-none cursor-pointer">
                          {language === "de" ? "Angemeldet bleiben" : "Remember me"}
                        </label>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex flex-col gap-3 px-6 pb-6 pt-2">
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-[#0066a2] hover:bg-[#005588] text-white font-bold py-2.5 rounded-md shadow transition-all active:scale-[0.98] cursor-pointer text-sm"
                      >
                        {loading 
                          ? (language === "de" ? "Wird authentifiziert..." : "Authenticating...") 
                          : (language === "de" ? "Anmelden" : "Login")}
                      </Button>

                      <button
                        type="button"
                        onClick={() => setSuccess(language === "de" ? "Magic-Link wurde per E-Mail gesendet!" : "Magic sign-in link sent to your email!")}
                        className="w-full text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#0b99ff] py-1.5 transition-all text-center cursor-pointer"
                      >
                        {language === "de" ? "Mit Direktlink anmelden" : "Switch to login with link"}
                      </button>
                      
                      {/* PeerJ-Inspired SSO Social Bar */}
                      <div className="w-full pt-1">
                        <div className="relative flex py-1.5 items-center">
                          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                          <span className="flex-shrink mx-3 text-xs text-slate-400 font-medium">Or sign in with</span>
                          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                        </div>

                        <div className="grid grid-cols-6 gap-2 pt-2">
                          {/* Apple */}
                          <button
                            type="button"
                            title="Sign in with Apple"
                            onClick={() => handleSsoLogin("Apple")}
                            className="flex items-center justify-center h-10 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-sm cursor-pointer"
                          >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.14-1.9-14.4-6.1-3.69-3.04-7.69-7.85-12.01-14.44-6.3-9.59-11.25-20.35-14.85-32.28-3.6-11.93-5.4-23.32-5.4-34.17 0-15.84 4.11-28.79 12.33-38.86 8.22-10.07 18.52-15.19 30.9-15.35 4.93 0 10.15 1.15 15.67 3.44 5.52 2.29 9.39 3.44 11.61 3.44 1.95 0 5.86-1.15 11.73-3.44 5.87-2.29 10.83-3.34 14.89-3.16 10.74.52 19.64 4.54 26.7 12.06 7.06 7.52 11.39 16.59 13 27.21-11.3 6.84-16.81 16.32-16.53 28.45.28 10.66 4.31 19.46 12.09 26.4 3.73 3.34 8.01 5.92 12.84 7.74-2.73 7.84-6.4 15.67-11.01 23.49zM119.22 31.86c0-6.72 2.45-13.16 7.35-19.32 4.9-6.16 11.08-9.88 18.54-11.16.63 7.15-1.63 13.88-6.78 20.19-5.15 6.31-11.45 9.94-18.9 10.89-.06-.2-.11-.4-.21-.6z"/>
                            </svg>
                          </button>
                          
                          {/* ORCID / Facebook */}
                          <button
                            type="button"
                            title="Sign in with ORCID"
                            onClick={() => handleSsoLogin("ORCID iD")}
                            className="flex items-center justify-center h-10 rounded-md border border-emerald-300 dark:border-emerald-800 bg-[#A6CE39] text-white hover:opacity-90 transition-all shadow-sm cursor-pointer"
                          >
                            <span className="font-bold text-xs tracking-tighter">iD</span>
                          </button>

                          {/* GitHub */}
                          <button
                            type="button"
                            title="Sign in with GitHub"
                            onClick={() => handleSsoLogin("GitHub")}
                            className="flex items-center justify-center h-10 rounded-md border border-slate-200 dark:border-slate-800 bg-[#24292e] text-white hover:bg-[#1b1f23] transition-all shadow-sm cursor-pointer"
                          >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
                              <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                            </svg>
                          </button>

                          {/* Google */}
                          <button
                            type="button"
                            title="Sign in with Google"
                            onClick={() => handleSsoLogin("Google")}
                            className="flex items-center justify-center h-10 rounded-md border border-slate-200 dark:border-slate-800 bg-white text-slate-800 hover:bg-slate-50 dark:bg-slate-900 dark:text-white transition-all shadow-sm cursor-pointer"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                            </svg>
                          </button>

                          {/* Microsoft */}
                          <button
                            type="button"
                            title="Sign in with Microsoft"
                            onClick={() => handleSsoLogin("Microsoft")}
                            className="flex items-center justify-center h-10 rounded-md border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900 transition-all shadow-sm cursor-pointer"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 23 23">
                              <path fill="#f35325" d="M1 1h10v10H1z"/>
                              <path fill="#81bc06" d="M12 1h10v10H12z"/>
                              <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                              <path fill="#ffba08" d="M12 12h10v10H12z"/>
                            </svg>
                          </button>

                          {/* LinkedIn */}
                          <button
                            type="button"
                            title="Sign in with LinkedIn"
                            onClick={() => handleSsoLogin("LinkedIn")}
                            className="flex items-center justify-center h-10 rounded-md border border-blue-200 dark:border-blue-900 bg-[#0077b5] text-white hover:opacity-90 transition-all shadow-sm cursor-pointer"
                          >
                            <Linkedin className="w-4 h-4 fill-current" />
                          </button>
                        </div>
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

            {/* Theme, Language & User Actions */}
            <div className="flex items-center gap-2.5">
              {/* Light Minimal EN | DE Language Switcher */}
              <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 select-none">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`transition-colors cursor-pointer ${
                    language === "en"
                      ? "font-bold text-[#0b99ff]"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  EN
                </button>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <button
                  type="button"
                  onClick={() => setLanguage("de")}
                  className={`transition-colors cursor-pointer ${
                    language === "de"
                      ? "font-bold text-[#0b99ff]"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  DE
                </button>
              </div>

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

              {/* Modern User Round Avatar Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer select-none"
                >
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-[#0b99ff] to-[#005588] text-white font-black text-xs shadow-md uppercase ring-2 ring-white dark:ring-slate-900">
                    {role === "author" ? "EV" : role === "jm" ? "SJ" : role === "editor" ? "AT" : role === "reviewer" ? "MV" : "SO"}
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950" />
                  </div>
                  <div className="hidden lg:flex flex-col text-left pr-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                      {role === "author" ? profFullName : role === "jm" ? "Dr. Sarah Jenkins" : role === "editor" ? "Prof. Aris Thorne" : role === "reviewer" ? "Dr. Marcus Vance" : "Editorial360 Admin"}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                      {role === "jm" ? "Journal Manager" : role === "editor" ? "Managing Editor" : role === "reviewer" ? "Expert Reviewer" : role === "author" ? "Principal Author" : role === "ria" ? "Integrity Advisor" : "System Admin"}
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden lg:block" />
                </button>

                {/* Interactive User Profile Dropdown Popover */}
                {isUserMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in duration-200"
                  >
                    {/* User Header */}
                    <div className="flex items-start gap-3 pb-3 border-b border-slate-100 dark:border-slate-900">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#0b99ff] to-[#005588] text-white font-black text-sm shadow-md uppercase">
                        {role === "author" ? "EV" : role === "jm" ? "SJ" : role === "editor" ? "AT" : role === "reviewer" ? "MV" : "SO"}
                      </div>
                      <div className="space-y-0.5 overflow-hidden text-left">
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                          {role === "author" ? profFullName : role === "jm" ? "Dr. Sarah Jenkins" : role === "editor" ? "Prof. Aris Thorne" : role === "reviewer" ? "Dr. Marcus Vance" : "Editorial360 Admin"}
                        </h4>
                        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">{email}</p>
                        <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0b99ff]/10 text-[#0b99ff] border border-[#0b99ff]/20">
                          {role === "jm" ? "Journal Operations Lead" : role === "editor" ? "Managing Editor" : role === "reviewer" ? "Expert Reviewer" : role === "author" ? "Verified Author (ORCID Synced)" : role === "ria" ? "Research Integrity Advisor" : "System Admin"}
                        </span>
                      </div>
                    </div>

                    {/* User Details & ORCID */}
                    <div className="py-3 space-y-2 text-xs text-left border-b border-slate-100 dark:border-slate-900">
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span className="font-semibold">Institution:</span>
                        <span className="font-bold text-slate-900 dark:text-slate-200 truncate max-w-[170px]">{profInstitution}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span className="font-semibold">ORCID iD:</span>
                        <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Check className="h-3 w-3" /> {profOrcid}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span className="font-semibold">Domain:</span>
                        <span className="font-bold text-slate-900 dark:text-slate-200 truncate max-w-[170px]">{profSpecialization}</span>
                      </div>
                    </div>

                    {/* Quick Action Links */}
                    <div className="py-2 space-y-1 text-left">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          setIsAuthorProfileSetupOpen(true)
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                      >
                        <User className="h-4 w-4 text-[#0b99ff]" />
                        Edit Researcher Profile
                      </button>

                      {role === "author" && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false)
                            setIsSubmitWizardOpen(true)
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                        >
                          <Plus className="h-4 w-4 text-emerald-500" />
                          Submit New Manuscript
                        </button>
                      )}
                    </div>

                    {/* Sign Out Button */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-900">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          setIsLoggedIn(false)
                          setSuccess("You have been securely signed out.")
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out of Editorial360
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
            {/* Responsive Left Sidebar Navigation Tabs */}
            <aside className="w-full md:w-64 bg-white dark:bg-slate-950 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-4 md:p-5 flex flex-col justify-between shrink-0 transition-colors">
              <div className="space-y-4 md:space-y-6">
                
                {/* Active Journal Node Info */}
                <div className="space-y-1 hidden sm:block">
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider block">
                    Institutional Node
                  </span>
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-2.5 rounded-xl transition-colors">
                    <BookOpen className="h-4 w-4 text-[#0b99ff]" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      scholarlyopen.org
                    </span>
                  </div>
                </div>

                {/* Left Navigation Links matching screenshot */}
                <div className="flex md:flex-col items-center md:items-stretch gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider hidden md:block mb-2 px-1">
                    Navigation
                  </span>
                  
                  <button 
                    type="button"
                    onClick={() => {
                      if (role === "author") setActiveAuthorTab("dashboard")
                      else setActiveJmTab("board")
                    }}
                    className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      (role === "author" ? activeAuthorTab === "dashboard" : activeJmTab === "board")
                        ? "bg-sky-500/10 text-[#0b99ff] border border-sky-500/20 shadow-2xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <LayoutDashboard className="h-4 w-4" />
                      {role === "author" ? "Author Dashboard" : role === "jm" ? "Journal Manager" : role === "editor" ? "Editorial Desk" : role === "reviewer" ? "Reviewer Center" : "Overview Hub"}
                    </span>
                  </button>

                  {role === "author" && (
                    <>
                      <button 
                        type="button"
                        onClick={() => setActiveAuthorTab("submissions")}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeAuthorTab === "submissions"
                            ? "bg-sky-500/10 text-[#0b99ff] border border-sky-500/20 shadow-2xs font-bold"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
                        }`}
                      >
                        <FileText className="h-4 w-4" />
                        Submission Manager
                      </button>
                      <button 
                        type="button"
                        onClick={() => setActiveAuthorTab("scorecard")}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeAuthorTab === "scorecard"
                            ? "bg-sky-500/10 text-[#0b99ff] border border-sky-500/20 shadow-2xs font-bold"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
                        }`}
                      >
                        <CheckSquare className="h-4 w-4" />
                        Readiness Scorecard
                      </button>
                      <button 
                        type="button"
                        onClick={() => setActiveAuthorTab("plagiarism")}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeAuthorTab === "plagiarism"
                            ? "bg-sky-500/10 text-[#0b99ff] border border-sky-500/20 shadow-2xs font-bold"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
                        }`}
                      >
                        <Search className="h-4 w-4" />
                        Plagiarism Scan
                      </button>
                      <button 
                        type="button"
                        onClick={() => setActiveAuthorTab("feedback")}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeAuthorTab === "feedback"
                            ? "bg-sky-500/10 text-[#0b99ff] border border-sky-500/20 shadow-2xs font-bold"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
                        }`}
                      >
                        <MessageSquare className="h-4 w-4" />
                        Feedback Portal
                      </button>
                      <button 
                        type="button"
                        onClick={() => setActiveAuthorTab("recognition")}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeAuthorTab === "recognition"
                            ? "bg-sky-500/10 text-[#0b99ff] border border-sky-500/20 shadow-2xs font-bold"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
                        }`}
                      >
                        <Award className="h-4 w-4" />
                        Contributor Recognition
                      </button>
                      <button 
                        type="button"
                        onClick={() => setActiveAuthorTab("career")}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeAuthorTab === "career"
                            ? "bg-sky-500/10 text-[#0b99ff] border border-sky-500/20 shadow-2xs font-bold"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
                        }`}
                      >
                        <TrendingUp className="h-4 w-4" />
                        Career Dashboard
                      </button>
                    </>
                  )}

                  {role === "jm" && (
                    <>
                      <button 
                        type="button"
                        onClick={() => setActiveJmTab("board")}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeJmTab === "board"
                            ? "bg-sky-500/10 text-[#0b99ff] border border-sky-500/20 shadow-2xs font-bold"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
                        }`}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Submissions Kanban Board
                      </button>

                      <button 
                        type="button"
                        onClick={() => setActiveJmTab("moderation")}
                        className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeJmTab === "moderation"
                            ? "bg-sky-500/10 text-[#0b99ff] border border-sky-500/20 shadow-2xs"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Users className="h-4 w-4" />
                          Assign Reviewers & Workloads
                        </span>
                      </button>

                      <button 
                        type="button"
                        onClick={() => setActiveJmTab("checks")}
                        className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeJmTab === "checks"
                            ? "bg-sky-500/10 text-[#0b99ff] border border-sky-500/20 shadow-2xs"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <CheckSquare className="h-4 w-4" />
                          Publishing Checks & Pre-Flight
                        </span>
                      </button>

                      <button 
                        type="button"
                        onClick={() => setActiveJmTab("analytics")}
                        className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeJmTab === "analytics"
                            ? "bg-sky-500/10 text-[#0b99ff] border border-sky-500/20 shadow-2xs"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <BarChart3 className="h-4 w-4" />
                          Portfolio & Integrity Analytics
                        </span>
                      </button>

                      <button 
                        type="button"
                        onClick={() => setActiveJmTab("users")}
                        className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeJmTab === "users"
                            ? "bg-sky-500/10 text-[#0b99ff] border border-sky-500/20 shadow-2xs"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Users className="h-4 w-4" />
                          Reviewer Registry
                        </span>
                      </button>

                      <button 
                        type="button"
                        onClick={() => setActiveJmTab("archives")}
                        className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeJmTab === "archives"
                            ? "bg-sky-500/10 text-[#0b99ff] border border-sky-500/20 shadow-2xs"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Archive className="h-4 w-4" />
                          Communication Archives
                        </span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 px-1 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                  <span>Editorial360 v4.2</span>
                </div>
              </div>
            </aside>

            {/* Main scrollable body workspace content */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-100/50 dark:bg-slate-900/60 transition-colors">
              <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-300">
                
                {/* Banner Status Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                      {role === "jm" && "Journal Operations"}
                      {role === "editor" && "Editorial Desk"}
                      {role === "reviewer" && "Review Center"}
                      {role === "author" && "My Submissions"}
                      {role === "ria" && "Integrity Desk"}
                      {role === "admin" && "Admin Console"}
                    </h2>
                  </div>

                  {/* Header Actions */}
                  <div className="flex items-center gap-3">
                  
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
                </div>

                {/* ========================================================= */}
                {/* A. ROLE DASHBOARD DETAILS DISPLAY PANEL                   */}
                {/* ========================================================= */}

                {/* ================= 1. JOURNAL MANAGER (JM) ================= */}
                {role === "jm" && (
                  <div className="space-y-6">
                    <UserProfileHeaderCard role="jm" />
                    {/* JM Sleek Stat Summary Bar */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-2xs">
                      <div className="space-y-1 pr-4 lg:border-r border-slate-100 dark:border-slate-900">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Moderation</span>
                          <MessageSquareOff className="h-4 w-4 text-orange-500" />
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                          {reviews.filter(r => r.status === "Pending Moderation").length}
                        </div>
                        <span className="text-[10px] text-orange-500 font-medium block">Awaiting safety vetting release</span>
                      </div>

                      <div className="space-y-1 px-0 lg:px-4 lg:border-r border-slate-100 dark:border-slate-900">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Reviewers</span>
                          <Users className="h-4 w-4 text-[#0b99ff]" />
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                          {users.filter(u => u.role === "reviewer").length}
                        </div>
                        <span className="text-[10px] text-emerald-500 font-medium block">Verified peer evaluation pool</span>
                      </div>

                      <div className="space-y-1 pr-4 lg:px-4 lg:border-r border-slate-100 dark:border-slate-900">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Registered Papers</span>
                          <FileText className="h-4 w-4 text-slate-400" />
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                          {manuscripts.length}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium block">Total submissions logged</span>
                      </div>

                      <div className="space-y-1 pl-0 lg:pl-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Decided Volume</span>
                          <Check className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                          {manuscripts.filter(m => m.status === "Accepted" || m.status === "Rejected").length}
                        </div>
                        <span className="text-[10px] text-emerald-500 font-medium block">Decisions posted to archives</span>
                      </div>
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
                    <UserProfileHeaderCard role="editor" />
                    {/* Editor Sleek Stat Summary Bar */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-2xs">
                      <div className="space-y-1 pr-4 lg:border-r border-slate-100 dark:border-slate-900">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Awaiting Assigning</span>
                          <Bell className="h-4 w-4 text-orange-500" />
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                          {manuscripts.filter(m => m.status === "Awaiting Initial Check").length}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium block">Pending peer-review assignments</span>
                      </div>

                      <div className="space-y-1 px-0 lg:px-4 lg:border-r border-slate-100 dark:border-slate-900">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Review Process</span>
                          <FileText className="h-4 w-4 text-[#0b99ff]" />
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                          {manuscripts.filter(m => m.status === "Under Review" || m.status === "Revision Under Evaluation").length}
                        </div>
                        <span className="text-[10px] text-[#0b99ff] font-medium block">Currently in reviewer hands</span>
                      </div>

                      <div className="space-y-1 pr-4 lg:px-4 lg:border-r border-slate-100 dark:border-slate-900">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Moderation Desk</span>
                          <MessageSquareOff className="h-4 w-4 text-amber-500" />
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                          {reviews.filter(r => r.status === "Pending Moderation").length}
                        </div>
                        <span className="text-[10px] text-amber-500 font-medium block">Comments needing vetting</span>
                      </div>

                      <div className="space-y-1 pl-0 lg:pl-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg Turnaround Latency</span>
                          <ClockWidget />
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">24.2d</div>
                        <span className="text-[10px] text-emerald-500 font-medium block">Below target of 25.0 days</span>
                      </div>
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
                  </div>
                )}

                {/* ================= 3. REVIEWER WORKSPACE ================= */}
                {role === "reviewer" && (
                  <div className="space-y-6">
                    <UserProfileHeaderCard role="reviewer" />

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
                {role === "author" && (() => {
                  // Deduplicate manuscripts array by ID and Title to guarantee clean unique list
                  const uniqueManuscripts = Array.from(
                    new Map(manuscripts.map(m => [m.id ? m.id : m.title, m])).values()
                  )

                  return (
                    <div className="space-y-6">
                      <UserProfileHeaderCard 
                        role="author" 
                        onExploreBadges={() => setIsBadgeModalOpen(true)} 
                      />

                      {/* Author Sleek Stat Summary Bar */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-2xs">
                        <div className="space-y-1 pr-4 lg:border-r border-slate-100 dark:border-slate-900">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Submissions</span>
                            <FileText className="h-4 w-4 text-[#0b99ff]" />
                          </div>
                          <div className="text-2xl font-black text-slate-900 dark:text-white">
                            {uniqueManuscripts.length}
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium block">
                            {uniqueManuscripts.filter(m => m.status === "Accepted").length} papers successfully published
                          </span>
                        </div>

                        <div className="space-y-1 px-0 lg:px-4 lg:border-r border-slate-100 dark:border-slate-900">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Under Evaluation</span>
                            <RefreshCw className="h-4 w-4 text-[#0b99ff]" />
                          </div>
                          <div className="text-2xl font-black text-slate-900 dark:text-white">
                            {uniqueManuscripts.filter(m => m.status.includes("Review") || m.status === "Awaiting Initial Check").length}
                          </div>
                          <span className="text-[10px] text-[#0b99ff] font-medium block">In active evaluation pipeline</span>
                        </div>

                        <div className="space-y-1 pr-4 lg:px-4 lg:border-r border-slate-100 dark:border-slate-900">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Revisions Required</span>
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                          </div>
                          <div className="text-2xl font-black text-slate-900 dark:text-white">
                            {uniqueManuscripts.filter(m => m.status === "Revision Required").length}
                          </div>
                          <span className="text-[10px] text-orange-500 font-medium block">Needs correction response</span>
                        </div>

                        <div className="space-y-1 pl-0 lg:pl-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Co-Authorship Invites</span>
                            <Users className="h-4 w-4 text-slate-400" />
                          </div>
                          <div className="text-2xl font-black text-slate-900 dark:text-white">0</div>
                          <span className="text-[10px] text-slate-400 font-medium block">Zero pending affiliations</span>
                        </div>
                      </div>

                      {/* 1. OVERVIEW DASHBOARD VIEW */}
                      {(activeAuthorTab === "dashboard" || activeAuthorTab === "submissions") && (
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                          
                          {/* Submission Manager Table */}
                          <div className={activeAuthorTab === "submissions" ? "xl:col-span-12" : "xl:col-span-8"}>
                            <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors h-full">
                              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between items-center">
                                <div>
                                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Submission Manager</h3>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage and track the validation pipeline for your research papers.</p>
                                </div>
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
                                    {uniqueManuscripts.map((m) => (
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
                                              onClick={() => {
                                                setSelectedManuscriptDetails(m)
                                                setIsManuscriptDetailsOpen(true)
                                              }}
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

                          {/* Submission Readiness Scorecard Card */}
                          {activeAuthorTab === "dashboard" && (
                            <div className="xl:col-span-4">
                              <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                  <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                                    <CheckSquare className="h-4 w-4 text-[#0b99ff]" />
                                    Submission Readiness Scorecard
                                  </h3>
                                  <span className="text-xs font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200">
                                    80% Ready
                                  </span>
                                </div>

                                <div className="space-y-3 text-xs">
                                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                    <div>
                                      <span className="font-bold text-slate-800 dark:text-slate-200">Metadata & Authorship Complete</span>
                                      <p className="text-[10px] text-slate-400">All co-author ORCIDs & affiliations verified</p>
                                    </div>
                                  </div>

                                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                    <div>
                                      <span className="font-bold text-slate-800 dark:text-slate-200">Ethics & COI Declaration Signed</span>
                                      <p className="text-[10px] text-slate-400">Institutional ethics clearance verified</p>
                                    </div>
                                  </div>

                                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40">
                                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                    <div>
                                      <span className="font-bold text-amber-900 dark:text-amber-200">References & Figures Formatting</span>
                                      <p className="text-[10px] text-amber-700 dark:text-amber-400">Ensure vector figures meet 300 DPI target</p>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            </div>
                          )}

                        </div>
                      )}

                      {/* 2. READINESS SCORECARD TAB VIEW */}
                      {activeAuthorTab === "scorecard" && (
                        <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 space-y-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                            <div>
                              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <CheckSquare className="h-5 w-5 text-[#0b99ff]" />
                                Submission Readiness Scorecard
                              </h3>
                              <p className="text-xs text-slate-500 mt-1">Pre-submission manuscript compliance check before editorial review.</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-sm font-black px-3 py-1 rounded-full border ${
                                isFigureFixed 
                                  ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200" 
                                  : "text-amber-600 bg-amber-50 dark:bg-amber-950/60 border-amber-200"
                              }`}>
                                {isFigureFixed ? "5 / 5 Checklist Items Passed (100% Ready)" : "4 / 5 Checklist Items Passed (80% Ready)"}
                              </span>
                            </div>
                          </div>

                          {/* Pre-Submission Draft File Upload Dropzone */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              Upload Draft File for Pre-Submission Audit
                            </h4>

                            <label className="border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all text-center group">
                              <input 
                                type="file" 
                                onChange={handleScorecardFileUpload}
                                accept=".pdf,.docx,.doc,.tex,.zip"
                                className="hidden" 
                              />
                              <Upload className="h-8 w-8 text-[#0b99ff] mb-2 group-hover:scale-110 transition-transform" />
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                {scorecardFileName ? `Uploaded: ${scorecardFileName}` : "Click to Browse or Drag & Drop Manuscript File (.pdf, .docx, .tex)"}
                              </span>
                              <span className="text-[10px] text-slate-400 mt-1">
                                Runs automated compliance check for figures (300 DPI), references (APA7), ethics, and metadata.
                              </span>
                            </label>

                            {/* Live Audit Simulation Banner */}
                            {isAuditingScorecard && (
                              <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 space-y-2 animate-in fade-in">
                                <div className="flex items-center justify-between text-xs font-bold text-[#0b99ff]">
                                  <span>Auditing manuscript figures, references, and metadata compliance...</span>
                                  <span>{scorecardAuditProgress}%</span>
                                </div>
                                <div className="w-full bg-sky-200 dark:bg-sky-900 rounded-full h-2 overflow-hidden">
                                  <div className="bg-[#0b99ff] h-full transition-all duration-300 rounded-full" style={{ width: `${scorecardAuditProgress}%` }} />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Interactive Scorecard Checklist Items */}
                          <div className="space-y-4 pt-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              Automated Checklist Audit Log
                            </h4>

                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                <div>
                                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Authorship & Affiliations Verification</h4>
                                  <p className="text-xs text-slate-500">All co-authors listed with valid ORCID IDs and institutional affiliations.</p>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">Verified</span>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                <div>
                                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Ethics & Conflict of Interest Statement</h4>
                                  <p className="text-xs text-slate-500">Ethics board approval reference number attached.</p>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">Verified</span>
                            </div>

                            {/* Conditional Figure Quality Warning vs Verified */}
                            {isFigureFixed ? (
                              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                  <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Figure & Table Quality Standard</h4>
                                    <p className="text-xs text-slate-500">High-resolution vector figures verified (300 DPI print standard compliant).</p>
                                  </div>
                                </div>
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">Fixed & Verified</span>
                              </div>
                            ) : (
                              <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                                  <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Figure & Table Quality Standard</h4>
                                    <p className="text-xs text-amber-700 dark:text-amber-400">Figure 2 resolution is 150 DPI (Minimum 300 DPI recommended for print production).</p>
                                  </div>
                                </div>
                                <Button 
                                  onClick={() => {
                                    setIsFigureFixed(true)
                                    alert("High-resolution 300 DPI vector figure uploaded! Quality standard passed.")
                                  }}
                                  size="sm" 
                                  className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold cursor-pointer shrink-0"
                                >
                                  Upload 300 DPI Figure
                                </Button>
                              </div>
                            )}

                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                <div>
                                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Data Availability Statement</h4>
                                  <p className="text-xs text-slate-500">Public repository DOI provided for supporting dataset.</p>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">Verified</span>
                            </div>
                          </div>
                        </Card>
                      )}

                      {/* 3. PLAGIARISM SCAN TAB VIEW */}
                      {activeAuthorTab === "plagiarism" && (() => {
                        const selectedPaper = uniqueManuscripts.find(m => m.id === selectedScanPaperId) || uniqueManuscripts[0] || manuscripts[0]
                        const plagiarismVal = selectedPaper?.plagiarismScore || 5.2

                        return (
                          <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                              <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                  <Search className="h-5 w-5 text-[#0b99ff]" />
                                  Plagiarism & Text Similarity Scan
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">Crossref & iThenticate automated manuscript text similarity verification report.</p>
                              </div>

                              <div className="flex flex-wrap items-center gap-3">
                                {/* Manuscript Selector Dropdown */}
                                <select 
                                  value={selectedScanPaperId}
                                  onChange={(e) => {
                                    setSelectedScanPaperId(e.target.value)
                                    setScanCompletedSuccess(false)
                                  }}
                                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 outline-none"
                                >
                                  {uniqueManuscripts.map(m => (
                                    <option key={m.id} value={m.id}>
                                      {m.id}: {m.title.slice(0, 35)}...
                                    </option>
                                  ))}
                                </select>

                                <Button 
                                  onClick={handleRunPlagiarismScan}
                                  disabled={isScanningPlagiarism}
                                  size="sm" 
                                  className="bg-[#0b99ff] hover:bg-[#0b8ceb] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                                >
                                  {isScanningPlagiarism ? "Scanning Text..." : "Run New Similarity Check"}
                                </Button>
                              </div>
                            </div>

                            {/* Live Scanning Progress Overlay Banner */}
                            {isScanningPlagiarism && (
                              <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 space-y-2 animate-in fade-in">
                                <div className="flex items-center justify-between text-xs font-bold text-[#0b99ff]">
                                  <span>Scanning manuscript against 120M+ Crossref & PubMed articles...</span>
                                  <span>{scanProgress}%</span>
                                </div>
                                <div className="w-full bg-sky-200 dark:bg-sky-900 rounded-full h-2 overflow-hidden">
                                  <div className="bg-[#0b99ff] h-full transition-all duration-300 rounded-full" style={{ width: `${scanProgress}%` }} />
                                </div>
                              </div>
                            )}

                            {scanCompletedSuccess && (
                              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                  <Check className="h-4 w-4 text-emerald-600" />
                                  Similarity check completed successfully. 0 integrity flags detected.
                                </span>
                                <span className="text-[10px] text-emerald-600 uppercase font-extrabold">Verified Clean</span>
                              </div>
                            )}

                            {/* Summary Metrics Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className={`p-4 rounded-xl border space-y-1 ${
                                plagiarismVal > 15 
                                  ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800" 
                                  : "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800"
                              }`}>
                                <span className={`text-xs font-bold uppercase ${plagiarismVal > 15 ? "text-rose-600" : "text-emerald-600"}`}>Overall Similarity Index</span>
                                <div className={`text-3xl font-black ${plagiarismVal > 15 ? "text-rose-700 dark:text-rose-300" : "text-emerald-700 dark:text-emerald-300"}`}>{plagiarismVal}%</div>
                                <span className={`text-[10px] font-medium ${plagiarismVal > 15 ? "text-rose-600" : "text-emerald-600"}`}>
                                  {plagiarismVal > 15 ? "High Similarity (Needs Review)" : "Clean (Threshold < 15%)"}
                                </span>
                              </div>

                              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                                <span className="text-xs font-bold text-slate-400 uppercase">Selected Manuscript</span>
                                <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{selectedPaper.title}</div>
                                <span className="text-[10px] text-[#0b99ff] font-semibold">{selectedPaper.journal}</span>
                              </div>

                              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                                <span className="text-xs font-bold text-slate-400 uppercase">Scan Timestamp</span>
                                <div className="text-sm font-bold text-slate-900 dark:text-white">2026-08-18 19:45 UTC</div>
                                <span className="text-[10px] text-emerald-600 font-medium">Crossref Similarity Check API v3</span>
                              </div>
                            </div>

                            {/* Matched Source Repository Breakdown Table */}
                            <div className="space-y-3 pt-2">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
                                <span>Matched Database Sources</span>
                                <span className="text-xs text-slate-400 font-normal">Crossref & iThenticate Index</span>
                              </h4>

                              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                <table className="w-full text-left text-xs">
                                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
                                    <tr>
                                      <th className="px-4 py-2.5">Source Repository</th>
                                      <th className="px-4 py-2.5">Publication Type</th>
                                      <th className="px-4 py-2.5">Match %</th>
                                      <th className="px-4 py-2.5 text-right">Status</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-medium text-slate-700 dark:text-slate-300">
                                    <tr>
                                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">PubMed Central Open Access Repository</td>
                                      <td className="px-4 py-3 text-slate-500">Journal Article</td>
                                      <td className="px-4 py-3 font-bold text-[#0b99ff]">2.1%</td>
                                      <td className="px-4 py-3 text-right"><span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Permitted Reference</span></td>
                                    </tr>
                                    <tr>
                                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">IEEE Xplore Digital Library Database</td>
                                      <td className="px-4 py-3 text-slate-500">Conference Proceedings</td>
                                      <td className="px-4 py-3 font-bold text-[#0b99ff]">1.4%</td>
                                      <td className="px-4 py-3 text-right"><span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Permitted Citation</span></td>
                                    </tr>
                                    <tr>
                                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">arXiv Computer Science Preprints</td>
                                      <td className="px-4 py-3 text-slate-500">Author Preprint</td>
                                      <td className="px-4 py-3 font-bold text-[#0b99ff]">0.9%</td>
                                      <td className="px-4 py-3 text-right"><span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Self-Preprint</span></td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Download PDF Verification Report */}
                            <div className="flex justify-end pt-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-xs font-bold flex items-center gap-2 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer"
                                onClick={() => alert(`Downloading Crossref Similarity Check Certificate PDF for ${selectedPaper.id}...`)}
                              >
                                Download Similarity Certificate (PDF)
                              </Button>
                            </div>

                          </Card>
                        )
                      })()}

                      {/* 4. FEEDBACK PORTAL TAB VIEW */}
                      {activeAuthorTab === "feedback" && (
                        <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 space-y-6">
                          <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-[#0b99ff]" />
                                Peer Review Feedback & Decision Desk
                              </h3>
                              <p className="text-xs text-slate-500 mt-1">Reviewer evaluation reports, editorial decisions, and revision response form.</p>
                            </div>
                          </div>

                          {responseSubmittedSuccess && (
                            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-between">
                              <span className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-emerald-600" />
                                Author point-by-point response and revised manuscript successfully submitted! Pipeline status updated to &ldquo;Revision Under Evaluation&rdquo;.
                              </span>
                            </div>
                          )}

                          <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-orange-600 uppercase">Editorial Decision: Minor Revision Required (MS-2026-094)</span>
                                <span className="text-xs text-slate-400">Due: 2026-09-01</span>
                              </div>
                              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic bg-white dark:bg-slate-900 p-3 rounded-lg border border-orange-100 dark:border-orange-900/30">
                                &ldquo;The manuscript presents novel methodology. Please address Reviewer 2&rsquo;s comments regarding sample size justification and update Figure 3.&rdquo;
                              </p>

                              {/* Interactive Point-by-Point Author Response Form */}
                              <div className="space-y-3 pt-2">
                                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                                  Point-by-Point Author Response to Reviewers
                                </label>
                                <textarea
                                  value={authorResponseText}
                                  onChange={(e) => setAuthorResponseText(e.target.value)}
                                  rows={4}
                                  className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-[#0b99ff] outline-none"
                                  placeholder="Type your response addressing each reviewer query here (e.g. We thank the reviewer for the comment. As suggested, we updated Figure 3 and added sample size calculations on page 4)..."
                                />

                                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2 cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl">
                                    <Upload className="h-4 w-4 text-[#0b99ff]" />
                                    <span>Attach Revised Manuscript (.docx, .pdf)</span>
                                    <input type="file" className="hidden" accept=".pdf,.docx,.doc" />
                                  </label>

                                  <Button 
                                    onClick={() => {
                                      if (!authorResponseText.trim()) {
                                        alert("Please enter your point-by-point response before submitting.")
                                        return
                                      }
                                      setIsSubmittingResponse(true)
                                      setTimeout(() => {
                                        setIsSubmittingResponse(false)
                                        setResponseSubmittedSuccess(true)
                                        // Update status of MS-2026-094 to Revision Under Evaluation
                                        setManuscripts(prev => prev.map(m => m.id === "MS-2026-094" ? { ...m, status: "Under Review" } : m))
                                      }, 800)
                                    }}
                                    disabled={isSubmittingResponse}
                                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-2 px-4 rounded-xl cursor-pointer"
                                  >
                                    {isSubmittingResponse ? "Submitting Revision..." : "Submit Response & Revision"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      )}

                      {/* 5. CONTRIBUTOR RECOGNITION TAB VIEW */}
                      {activeAuthorTab === "recognition" && (
                        <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 space-y-6">
                          <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Award className="h-5 w-5 text-[#0b99ff]" />
                                Contributor Recognition & Badges
                              </h3>
                              <p className="text-xs text-slate-500 mt-1">Academic contributor achievements, peer review credits, and ORCID badge sync.</p>
                            </div>

                            <Button 
                              onClick={handleSyncOrcid}
                              disabled={isOrcidSyncing}
                              size="sm"
                              className="bg-[#0b99ff] hover:bg-[#0b8ceb] text-white text-xs font-bold cursor-pointer"
                            >
                              {isOrcidSyncing ? "Syncing ORCID..." : `Sync with ORCID (${orcidLastSynced})`}
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[#0b99ff] font-bold text-sm">
                                  <Star className="h-4 w-4" /> Quality Contributor
                                </div>
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Active</span>
                              </div>
                              <p className="text-xs text-slate-500">Awarded for publishing high-impact peer-reviewed manuscripts with zero integrity flags.</p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[#0b99ff] font-bold text-sm">
                                  <Award className="h-4 w-4" /> Fast Responder
                                </div>
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Active</span>
                              </div>
                              <p className="text-xs text-slate-500">Awarded for submitting peer review revisions within 5 calendar days.</p>
                            </div>
                          </div>
                        </Card>
                      )}

                      {/* 6. CAREER DASHBOARD TAB VIEW */}
                      {activeAuthorTab === "career" && (
                        <div className="space-y-6">
                          <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 space-y-6">
                            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-[#0b99ff]" />
                                Scholarly Career & Impact Metrics
                              </h3>
                              <p className="text-xs text-slate-500 mt-1">Track citations, article downloads, and Altmetric attention indices across your publications.</p>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                                <span className="text-xs font-bold text-slate-400 uppercase">Total Citations</span>
                                <div className="text-2xl font-black text-slate-900 dark:text-white">120</div>
                                <span className="text-[10px] text-emerald-600 font-semibold">+18 this quarter</span>
                              </div>

                              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                                <span className="text-xs font-bold text-slate-400 uppercase">h-index</span>
                                <div className="text-2xl font-black text-slate-900 dark:text-white">8</div>
                                <span className="text-[10px] text-slate-500 font-semibold">i10-index: 6</span>
                              </div>

                              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                                <span className="text-xs font-bold text-slate-400 uppercase">PDF Downloads</span>
                                <div className="text-2xl font-black text-slate-900 dark:text-white">3,420</div>
                                <span className="text-[10px] text-[#0b99ff] font-semibold">Across 5 journals</span>
                              </div>

                              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                                <span className="text-xs font-bold text-slate-400 uppercase">ORCID Status</span>
                                <div className="text-sm font-bold text-emerald-600">Synced ✓</div>
                                <span className="text-[10px] text-slate-500 font-semibold">0000-1234-5678</span>
                              </div>
                            </div>
                          </Card>
                        </div>
                      )}

                    </div>
                  )
                })()}

                {/* ================= 5. RESEARCH INTEGRITY ADVISOR (QC Admin) ================= */}
                {role === "ria" && (
                  <div className="space-y-6">
                    <UserProfileHeaderCard role="ria" />
                    {/* QC Admin Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Flagged Cases</CardTitle>
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">
                            {integrityAlerts.filter(a => a.status === "Flagged").length}
                          </div>
                          <span className="text-[10px] text-red-500 dark:text-red-400 font-semibold block mt-1">Requires technical review</span>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Audited Submissions</CardTitle>
                          <FileText className="h-4 w-4 text-[#0b99ff]" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">156</div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">Verified on automated ingest</span>
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
                          <span className="text-[10px] text-slate-555 dark:text-slate-405 block mt-1">Sub-second checksum parsing</span>
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
                                <span className="text-[#0b99ff] font-bold">
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
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold italic">
                                  Resolved ({alert.status})
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
                    <UserProfileHeaderCard role="admin" />
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
        </div>
      )}

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
                      <optgroup label="Core Disciplinary Series">
                        <option value="Scholarly Open: Engineering & Applied Sciences">Scholarly Open: Engineering & Applied Sciences</option>
                        <option value="Scholarly Open: Social Sciences & Humanities">Scholarly Open: Social Sciences & Humanities</option>
                        <option value="Scholarly Open: Social Sciences Open">Scholarly Open: Social Sciences Open</option>
                        <option value="Scholarly Open: Biology">Scholarly Open: Biology</option>
                        <option value="Scholarly Open: Chemistry">Scholarly Open: Chemistry</option>
                        <option value="Scholarly Open: Medicine">Scholarly Open: Medicine</option>
                        <option value="Scholarly Open: Environmental Science">Scholarly Open: Environmental Science</option>
                      </optgroup>
                      <optgroup label="Emerging Frontiers Series">
                        <option value="Scholarly Open: Data Science & Analytics">Scholarly Open: Data Science & Analytics</option>
                        <option value="Scholarly Open: Clinical AI & Digital Health">Scholarly Open: Clinical AI & Digital Health</option>
                        <option value="Scholarly Open: AI Safety & Governance">Scholarly Open: AI Safety & Governance</option>
                        <option value="Scholarly Open: Decarbonization & Carbon Tech">Scholarly Open: Decarbonization & Carbon Tech</option>
                        <option value="Scholarly Open: Quantum Engineering">Scholarly Open: Quantum Engineering</option>
                        <option value="Scholarly Open: Synthetic Biology & Bio-Design">Scholarly Open: Synthetic Biology & Bio-Design</option>
                        <option value="Scholarly Open: Space Resources & Orbital Economy">Scholarly Open: Space Resources & Orbital Economy</option>
                      </optgroup>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Submission Type / Stage</label>
                    <select
                      value={newSubmissionStage}
                      onChange={(e) => setNewSubmissionStage(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                    >
                      <option value="Initial Submission">Initial Submission</option>
                      <option value="Revised Submission">Revised Submission</option>
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

          {/* 9. REVIEWER: INVITE CO-REVIEWER MODAL */}
          <Dialog open={isInviteCoReviewerOpen} onOpenChange={setIsInviteCoReviewerOpen}>
            <DialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 sm:max-w-md transition-colors">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-[#0b99ff]" />
                  Invite Co-Reviewer
                </DialogTitle>
                <DialogDescription className="text-slate-500 dark:text-slate-400">
                  Formally invite a colleague or Early Career Researcher to co-review this manuscript. They must pass a COI check before accessing the paper.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleInviteCoReviewer} className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Co-Reviewer Full Name</label>
                  <input
                    type="text"
                    required
                    value={coRevName}
                    onChange={(e) => setCoRevName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                    placeholder="e.g. Dr. Alex Johnson"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Institutional Email</label>
                  <input
                    type="email"
                    required
                    value={coRevEmail}
                    onChange={(e) => setCoRevEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                    placeholder="a.johnson@university.edu"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Primary Affiliation</label>
                  <input
                    type="text"
                    required
                    value={coRevAffiliation}
                    onChange={(e) => setCoRevAffiliation(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                    placeholder="e.g. Department of Engineering, State University"
                  />
                </div>

                <DialogFooter className="pt-2">
                  <Button 
                    type="button" 
                    onClick={() => setIsInviteCoReviewerOpen(false)}
                    variant="ghost" 
                    className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-[#0b99ff] hover:bg-[#0b8ceb] text-white font-bold cursor-pointer"
                  >
                    Send Secure Invitation
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* 10. CO-REVIEWER: MANDATORY ETHICS DISCLOSURE MODAL */}
          <Dialog open={isCoRevDisclosureOpen} onOpenChange={setIsCoRevDisclosureOpen}>
            <DialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 sm:max-w-md transition-colors">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-purple-600" />
                  Mandatory Ethics & COI Disclosure
                </DialogTitle>
                <DialogDescription className="text-slate-500 dark:text-slate-400">
                  Before accessing the manuscript abstract and files, you must agree to the confidentiality terms and declare no Conflicts of Interest.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-2">
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded space-y-4">
                  <div className="flex items-start gap-3">
                    <input 
                      id="corev-confidentiality" 
                      type="checkbox" 
                      checked={coRevConfidentiality}
                      onChange={(e) => setCoRevConfidentiality(e.target.checked)}
                      className="h-4 w-4 mt-0.5 text-purple-600 focus:ring-purple-600 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded cursor-pointer"
                    />
                    <label htmlFor="corev-confidentiality" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer font-medium leading-relaxed">
                      <strong>Confidentiality Agreement:</strong> I agree to keep all unpublished manuscript data strictly confidential and will not use it for personal research until publication.
                    </label>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <input 
                      id="corev-nocoi" 
                      type="checkbox" 
                      checked={coRevNoCOI}
                      onChange={(e) => setCoRevNoCOI(e.target.checked)}
                      className="h-4 w-4 mt-0.5 text-purple-600 focus:ring-purple-600 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded cursor-pointer"
                    />
                    <label htmlFor="corev-nocoi" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer font-medium leading-relaxed">
                      <strong>Conflict of Interest (COI) Declaration:</strong> I declare that I have no financial, institutional, or personal relationship with the authors that could bias my review.
                    </label>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button 
                  onClick={() => setIsCoRevDisclosureOpen(false)}
                  variant="ghost" 
                  className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                >
                  Decline Invitation
                </Button>
                <Button 
                  onClick={handleSubmitCoRevDisclosure}
                  disabled={!coRevConfidentiality || !coRevNoCOI}
                  className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold cursor-pointer"
                >
                  Agree & Request Access
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* 11. FIRST-TIME AUTHOR PROFILE BUILDER MODAL */}
          <Dialog open={isAuthorProfileSetupOpen} onOpenChange={setIsAuthorProfileSetupOpen}>
            <DialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 sm:max-w-md transition-colors">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-[#0b99ff]" />
                  Author Profile
                </DialogTitle>
                <DialogDescription className="text-slate-500 dark:text-slate-400 text-xs">
                  Set up your ORCID and affiliation details to get started.
                </DialogDescription>
              </DialogHeader>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault()
                  setIsAuthorProfileCompleted(true)
                  setIsAuthorProfileSetupOpen(false)
                  setSuccess("Profile saved successfully!")
                  if (typeof window !== "undefined") {
                    const params = new URLSearchParams(window.location.search)
                    if (params.get("action") === "submit") {
                      setIsSubmitWizardOpen(true)
                    }
                  }
                }} 
                className="space-y-3 py-1"
              >
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={profFullName}
                      onChange={(e) => setProfFullName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                      placeholder="Dr. Evelyn Vane"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Title</label>
                    <select
                      value={profRank}
                      onChange={(e) => setProfRank(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                    >
                      <option value="Professor">Professor</option>
                      <option value="Associate Professor">Associate Professor</option>
                      <option value="Assistant Professor">Assistant Professor</option>
                      <option value="Senior Researcher">Senior Researcher</option>
                      <option value="Postdoctoral Fellow">Postdoctoral Fellow</option>
                      <option value="PhD Researcher">PhD Researcher</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Institution *</label>
                    <input
                      type="text"
                      required
                      value={profInstitution}
                      onChange={(e) => setProfInstitution(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                      placeholder="Harvard Medical School"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Country *</label>
                    <input
                      type="text"
                      required
                      value={profCountry}
                      onChange={(e) => setProfCountry(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                      placeholder="United States"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">ORCID iD</label>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Verified Sync</span>
                  </div>
                  <input
                    type="text"
                    value={profOrcid}
                    onChange={(e) => setProfOrcid(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-mono rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                    placeholder="0000-0002-1825-0097"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Research Topics</label>
                  <input
                    type="text"
                    value={profSpecialization}
                    onChange={(e) => setProfSpecialization(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                    placeholder="Cardiology, Clinical AI"
                  />
                </div>

                <div className="flex items-center pt-1">
                  <input 
                    id="prof-review-optin"
                    type="checkbox"
                    checked={profReviewOptIn}
                    onChange={(e) => setProfReviewOptIn(e.target.checked)}
                    className="h-3.5 w-3.5 text-[#0b99ff] focus:ring-[#0b99ff] border-slate-300 rounded cursor-pointer"
                  />
                  <label htmlFor="prof-review-optin" className="ml-2 block text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                    Opt-in for peer review invitations
                  </label>
                </div>

                <DialogFooter className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-[#0b99ff] hover:bg-[#0b8ceb] text-white font-bold text-xs py-2 rounded-md shadow cursor-pointer"
                  >
                    Save Profile
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* 11. AUTHOR: EXPLORE BADGES MODAL */}
          <Dialog open={isBadgeModalOpen} onOpenChange={setIsBadgeModalOpen}>
            <DialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 sm:max-w-md transition-colors">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-[#0b99ff]" />
                  Academic Contributor Badges
                </DialogTitle>
                <DialogDescription className="text-slate-500 dark:text-slate-400">
                  Earn badges by maintaining high peer review response speed, publishing integrity, and open-access data sharing.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-2">
                <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-[#0b99ff]" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Quality Contributor</h4>
                      <p className="text-[10px] text-slate-500">Published 3+ papers without any integrity warnings.</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">Earned ✓</span>
                </div>

                <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-[#0b99ff]" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Fast Responder</h4>
                      <p className="text-[10px] text-slate-500">Submitted manuscript revisions within 5 calendar days.</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">Earned ✓</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-amber-500" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Integrity Champion</h4>
                      <p className="text-[10px] text-slate-500">Complete 3 more ethics disclosures & peer reviews.</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded">70% Progress</span>
                </div>
              </div>

              <DialogFooter>
                <Button 
                  onClick={() => setIsBadgeModalOpen(false)} 
                  className="bg-[#0b99ff] hover:bg-[#0b8ceb] text-white font-bold text-xs cursor-pointer"
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* 12. AUTHOR: MANUSCRIPT DETAILS MODAL */}
          <Dialog open={isManuscriptDetailsOpen} onOpenChange={setIsManuscriptDetailsOpen}>
            <DialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 sm:max-w-lg transition-colors">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#0b99ff]" />
                  Manuscript Record: {selectedManuscriptDetails?.id}
                </DialogTitle>
                <DialogDescription className="text-slate-500 dark:text-slate-400">
                  Full editorial pipeline metadata, assigned peer reviewers, and status log.
                </DialogDescription>
              </DialogHeader>

              {selectedManuscriptDetails && (
                <div className="space-y-4 py-2 text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-400 uppercase text-[10px]">Manuscript Title</span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{selectedManuscriptDetails.title}</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="font-bold text-slate-400 uppercase text-[10px] block">Target Journal</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{selectedManuscriptDetails.journal}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-400 uppercase text-[10px] block">Current Pipeline Status</span>
                      <span className="font-bold text-[#0b99ff]">{selectedManuscriptDetails.status}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-slate-400 uppercase text-[10px]">Submission Date & Reference</span>
                    <p className="text-slate-700 dark:text-slate-300 font-semibold">{selectedManuscriptDetails.date} (Automated Ingest Validated)</p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-slate-400 uppercase text-[10px]">Assigned Peer Reviewers</span>
                    <p className="text-slate-700 dark:text-slate-300 font-medium">
                      {selectedManuscriptDetails.reviewers.length > 0 ? selectedManuscriptDetails.reviewers.join(", ") : "Assigned Editorial Desk Handling Editor"}
                    </p>
                  </div>
                </div>
              )}

              <DialogFooter className="flex flex-row justify-between items-center w-full">
                <Button 
                  onClick={() => alert(`Downloading PDF Manuscript package for ${selectedManuscriptDetails?.id}...`)} 
                  variant="outline" 
                  className="text-xs font-bold border-slate-200 dark:border-slate-800 cursor-pointer"
                >
                  Download PDF Package
                </Button>
                <Button 
                  onClick={() => setIsManuscriptDetailsOpen(false)} 
                  className="bg-[#0b99ff] hover:bg-[#0b8ceb] text-white font-bold text-xs cursor-pointer"
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

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
