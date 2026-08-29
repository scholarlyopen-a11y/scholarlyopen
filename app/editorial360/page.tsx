"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
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
  ChevronLeft,
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
  CheckCircle2,
  Globe,
  Building2,
  MapPin,
  Share2,
  FileDown,
  Download,
  Edit3,
  RotateCcw,
  Zap,
  Layers,
  Receipt,
  FolderOpen,
  SearchCode,
  Wallet,
  FileCheck2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ReviewerWorkspace, ReviewAssessmentData } from "@/components/reviewer-workspace"
import { JournalManagerWorkspace } from "@/components/journal-manager-workspace"
import { EditorWorkspace } from "@/components/editor-workspace"

type UserRole = "admin" | "author" | "reviewer" | "editor" | "im" | "ria" | "jm"

// Manuscript mock data structure
interface Manuscript {
  id: string
  title: string
  journal: string
  status: "Draft" | "Awaiting Initial Check" | "Submitted" | "Under Review" | "Revision Required" | "Revision Under Evaluation" | "Accepted" | "Rejected"
  date: string
  reviewers: string[]
  integrityStatus: "Clean" | "Flagged" | "Unchecked"
  plagiarismScore?: number
  aiScore?: number
  authorFirstName?: string
  authorLastName?: string
  authorName?: string
  authorEmail?: string
  authorAffiliation?: string
  authorCountry?: string
  authorOrcid?: string
  coAuthors?: string
  articleType?: string
  submissionStage?: string
  abstract?: string
  keywords?: string
  fileName?: string
  fileSize?: string
  coverLetter?: string
  ethicsIrb?: string
  fundingGrant?: string
  dataDoi?: string
  editorAssigned?: boolean
  assignedEditorName?: string
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
  authorProfile?: {
    name: string
    title: string
    institution: string
    country: string
    orcid: string
    specialization: string
    photoUrl?: string
    isOrcidVerified?: boolean
  }
  onExploreBadges?: () => void
}

function UserProfileHeaderCard({ role, authorProfile, onExploreBadges }: UserProfileHeaderProps) {
  const { language } = useLanguage()

  const getRoleConfig = (role: UserRole) => {
    const isDe = language === "de"
    switch (role) {
      case "jm":
        return {
          photo: "/images/manager-photo.png",
          name: "Sarah Jenkins, M.S.",
          title: isDe ? "Journal-Betriebsleiterin & Leiterin der Qualitätsprüfung" : "Journal Operations Manager & Quality Desk Lead",
          interestsLabel: isDe ? "Betrieblicher Schwerpunkt" : "Operational Scope",
          interests: isDe ? "Publikationsethik, Peer-Review-Moderation, COI-Sicherheit" : "Publication Ethics, Peer Review Moderation, COI Security",
          alertText: isDe ? "Sicherheits-Moderationshinweis: Prüfen Sie Gutachterkommentare vor der Freigabe auf unangemessene Sprache oder vertrauliche Autorenangaben." : "Safety Moderation Notice: Audit reviewer comments for inflammatory language or direct PII before releasing to authors.",
          alertIcon: Lightbulb,
          metricsTitle: isDe ? "Betriebs- & Moderationskennzahlen" : "Operations & Moderation Metrics",
          metrics: [
            { icon: Clock, value: "1.8 " + (isDe ? "Tage" : "days"), label: isDe ? "DURCHSCHN. MODERATIONSZEIT" : "AVG MODERATION TIME" },
            { icon: ShieldCheck, value: "99.2%", label: isDe ? "SICHERHEITS-FREIGABERATE" : "SAFETY CLEARANCE RATE" },
            { icon: MessageSquare, value: "312", label: isDe ? "MODERIERTE GUTACHTEN" : "REVIEWS MODERATED" },
            { icon: MessageSquareOff, value: "2", label: isDe ? "IN MODERATION AUSSTEHEND" : "PENDING IN MODERATION" },
            { icon: TrendingUp, value: isDe ? "Top 1%" : "Top 1%", label: isDe ? "BETRIEBSRANG" : "OPERATIONS RANK" }
          ]
        }
      case "editor":
        return {
          photo: "/images/editor-photo.png",
          name: "Prof. Aris Thorne",
          title: isDe ? "Leitender Herausgeber & Professor für Politikwissenschaft" : "Managing Editor & Professor of Political Science",
          interestsLabel: isDe ? "Redaktioneller Schwerpunkt" : "Editorial Scope",
          interests: isDe ? "Öffentliche Ordnung, Internationale Beziehungen, Governance-Systeme" : "Public Policy, International Relations, Governance Systems",
          alertText: isDe ? "Redaktionelle Richtlinie: Stellen Sie sicher, dass mindestens zwei Doppelblind-Gutachten vorliegen, bevor die endgültige Entscheidung getroffen wird." : "Editorial Guideline: Ensure at least two double-blind peer evaluations are received before logging final decision.",
          alertIcon: Lightbulb,
          metricsTitle: isDe ? "Redaktionelle Portfolio-Kennzahlen" : "Editorial Portfolio Metrics",
          metrics: [
            { icon: Clock, value: "12.4 " + (isDe ? "Tage" : "days"), label: isDe ? "DURCHSCHN. ENTSCHEIDUNGSZEIT" : "DECISION LATENCY (AVG)" },
            { icon: ShieldCheck, value: "96%", label: isDe ? "BEIRATS-AUDIT-ERGEBNIS" : "BOARD AUDIT SCORE" },
            { icon: FileText, value: "86", label: isDe ? "BEARBEITETE ARTIKEL" : "PAPERS HANDLED" },
            { icon: Inbox, value: "4", label: isDe ? "AKTIVE WARTESCHLANGE" : "ACTIVE QUEUE LOAD" },
            { icon: TrendingUp, value: "Top 3%", label: isDe ? "HERAUSGEBER-PERZENTIL" : "EDITOR PERCENTILE" }
          ]
        }
      case "reviewer":
        return {
          photo: "/images/reviewer-photo.png",
          name: "Dr. Alex Johnson",
          title: isDe ? "Senior Researcher, KI-Ethik" : "Senior Researcher, AI Ethics",
          interestsLabel: isDe ? "Forschungsschwerpunkte" : "Research Interests",
          interests: isDe ? "KI-Voreingenommenheit, Datenschutz, Algorithmische Fairness" : "AI Bias, Data Privacy, Algorithmic Fairness",
          alertText: isDe ? "Achten Sie auf KI-Artefakte in Text und Grafiken: vage Formulierungen, inkonsistente Formatierungen, fehlende Maßstabsbalken..." : "Watch for AI artifacts in both text and visuals: vague language, inconsistent formatting, missing scale bars...",
          alertIcon: Lightbulb,
          metricsTitle: isDe ? "Gutachter-Kennzahlen" : "Reviewer Metrics",
          metrics: [
            { icon: Clock, value: "3 " + (isDe ? "Tage" : "days"), label: isDe ? "DURCHSCHN. BEARBEITUNGSZEIT" : "TIME TO COMPLETE (AVG)" },
            { icon: Star, value: "95%", label: isDe ? "HOCHQUALITATIVE GUTACHTEN" : "REVIEWS RATED HIGH QUALITY" },
            { icon: Flag, value: "7", label: isDe ? "INTEGRITÄTS-HINWEISE" : "INTEGRITY FLAGS RAISED" },
            { icon: Award, value: "3", label: isDe ? "VERDIENTE ABZEICHEN" : "BADGES EARNED" },
            { icon: TrendingUp, value: "Top 12%", label: isDe ? "PERZENTIL-WERT" : "PERCENTILE SCORE" }
          ]
        }
      case "author":
        return {
          photo: authorProfile?.photoUrl || "",
          name: authorProfile?.name || "Dr. Evelyn Vane",
          title: authorProfile?.title || (isDe ? "Senior-Forscherin & Fachbereichsleitung" : "Senior Researcher & Faculty Lead"),
          institution: authorProfile?.institution || (isDe ? "Institut für Fortgeschrittene Medizinische Wissenschaften" : "Institute of Advanced Medical Sciences"),
          country: authorProfile?.country || (isDe ? "Vereinigte Staaten" : "United States"),
          interestsLabel: isDe ? "Forschungsschwerpunkt" : "Research Focus",
          interests: authorProfile?.specialization || (isDe ? "Kardiologie, Klinische KI, Diagnostische Bildgebung" : "Cardiology, Clinical AI, Diagnostic Imaging"),
          orcid: authorProfile?.orcid || "0000-0002-1825-0097",
          alertText: isDe 
            ? `Autoren-Tipp: Ihre verifizierte ORCID iD (${authorProfile?.orcid || "0000-0002-1825-0097"}) synchronisiert Veröffentlichungen automatisch mit CrossRef und Scopus.`
            : `Author Tip: Your verified ORCID iD (${authorProfile?.orcid || "0000-0002-1825-0097"}) automatically syncs publications with CrossRef and Scopus.`,
          alertIcon: Lightbulb,
          metricsTitle: isDe ? "Autoren-Leistungskennzahlen" : "Author Performance Metrics",
          metrics: [
            { icon: Clock, value: "4.5 " + (isDe ? "Tage" : "days"), label: isDe ? "REVISIONS-BEARBEITUNGSZEIT" : "REVISION TURNAROUND" },
            { icon: Star, value: "88%", label: isDe ? "ANNAHMERATE & RIGOR" : "ACCEPTANCE RIGOR RATE" },
            { icon: FileText, value: "12", label: isDe ? "VERÖFFENTLICHTE ARTIKEL" : "PUBLISHED PAPERS" },
            { icon: CheckSquare, value: "3", label: isDe ? "AKTIVE EINREICHUNGEN" : "ACTIVE SUBMISSIONS" },
            { icon: TrendingUp, value: "Top 10%", label: isDe ? "AUTOREN-PERZENTIL" : "AUTHOR PERCENTILE" }
          ]
        }
      case "ria":
        return {
          photo: "/images/ria-photo.png",
          name: "Dr. Marcus Vance",
          title: isDe ? "Berater für Forschungsintegrität & Forensik-Analyst" : "Research Integrity Advisor & Forensics Analyst",
          interestsLabel: isDe ? "Forensik-Spezialisierung" : "Forensics Specialization",
          interests: isDe ? "Bildduplikation, KI-Inhaltsforensik, COI-Verifizierung" : "Image Duplication, AI Content Forensics, COI Verification",
          alertText: isDe ? "Integritätswarnung: Automatische Prüfungen haben Bildduplikationen und hohe KI-Werte in der aktiven Warteschlange gemeldet." : "Integrity Alert: Algorithmic detection flagged figure duplication and high AI content index in active queue.",
          alertIcon: Lightbulb,
          metricsTitle: isDe ? "Forensik- & Integritätskennzahlen" : "Forensics & Integrity Metrics",
          metrics: [
            { icon: Clock, value: "0.9 " + (isDe ? "Tage" : "days"), label: isDe ? "HINWEIS-BEARBEITUNGSZEIT" : "ALERT RESOLUTION TIME" },
            { icon: Cpu, value: "99.8%", label: isDe ? "ERKENNUNGSPRÄZISION" : "DETECTION PRECISION" },
            { icon: ShieldAlert, value: "148", label: isDe ? "FORENSIK-AUDITS" : "FORENSIC AUDITS" },
            { icon: AlertTriangle, value: "2", label: isDe ? "GEMELDETE HINWEISE" : "FLAGGED ALERTS" },
            { icon: TrendingUp, value: "Top 2%", label: isDe ? "INTEGRITÄTSRANG" : "INTEGRITY RANK" }
          ]
        }
      case "admin":
      default:
        return {
          photo: "/images/admin-photo.png",
          name: isDe ? "Systemadministrator" : "System Administrator",
          title: isDe ? "Chef-Plattformarchitekt & Node-Admin" : "Chief Platform Architect & Node Admin",
          interestsLabel: isDe ? "Systembereich" : "System Scope",
          interests: isDe ? "Knotenbetrieb, Benutzersicherheits-Registry, Workflow-Schema" : "Node Operations, User Security Registry, Workflow Schema",
          alertText: isDe ? "Systemstatus: Alle 320 vorgerenderten Arbeitsbereichsknoten online. 99,99% Systemverfügbarkeit in allen regionalen Clustern." : "System Status: All 320 prerendered workspace nodes online. 99.99% system uptime maintained across regional clusters.",
          alertIcon: Lightbulb,
          metricsTitle: isDe ? "System- & Architekturkennzahlen" : "System & Architecture Metrics",
          metrics: [
            { icon: Cpu, value: "99.99%", label: isDe ? "KNOTEN-VERFÜGBARKEIT" : "NODE UPTIME" },
            { icon: Lock, value: "100%", label: isDe ? "SICHERHEITSSCHEMATA" : "SECURITY SCHEMAS" },
            { icon: Settings, value: "1.4k", label: isDe ? "SYSTEMAKTIONEN PROTOKOLLIERT" : "SYSTEM ACTIONS LOGGED" },
            { icon: ShieldCheck, value: "0", label: isDe ? "SICHERHEITSVORFÄLLE" : "SECURITY BREACHES" },
            { icon: TrendingUp, value: "Top 1%", label: isDe ? "SUPERUSER-RANG" : "SUPERUSER RANK" }
          ]
        }
    }
  }
  const config = getRoleConfig(role)
  const isDe = language === "de"

  return (
    <div className="bg-white dark:bg-[#18191e] border border-slate-200/80 dark:border-[#272832] rounded-3xl p-6 sm:p-8 shadow-2xs transition-all">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Block: Avatar & Bio */}
        <div className="lg:col-span-5 space-y-4">
          <div className="w-20 h-20 rounded-full border-2 border-slate-200 dark:border-[#272832] bg-gradient-to-tr from-[#0b99ff] to-[#0077cc] text-white flex items-center justify-center font-bold text-2xl overflow-hidden shadow-xs">
            {config.photo ? (
              <img src={config.photo} alt={config.name} className="w-full h-full object-cover" />
            ) : (
              <span>{config.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</span>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {config.name}
            </h3>

            {/* 3 Uniform Lines: Title, Institution, Country */}
            <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
              {config.title && (
                <p>{config.title}</p>
              )}
              {role === "author" && (
                <>
                  <p>{authorProfile?.institution || (isDe ? "Institut für Fortgeschrittene Medizinische Wissenschaften" : "Institute of Advanced Medical Sciences")}</p>
                  <p>{authorProfile?.country || (isDe ? "Vereinigte Staaten" : "United States")}</p>
                </>
              )}
            </div>

            {/* Minimalist Official Green / Grey ORCID Symbol */}
            {config.orcid && (
              <div className="pt-1">
                {authorProfile?.isOrcidVerified !== false ? (
                  <div className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
                    <span className="h-4 w-4 rounded-full bg-[#A6CE39] text-white flex items-center justify-center font-bold text-[10px] tracking-tighter shrink-0 shadow-2xs">
                      iD
                    </span>
                    <span>{config.orcid}</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500 font-normal">
                    <span className="h-4 w-4 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-[10px] tracking-tighter shrink-0">
                      iD
                    </span>
                    <span>{config.orcid}</span>
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">({isDe ? "Nicht verifiziert" : "Unverified"})</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Research Focus as interactive button-like tags */}
          {config.interests && (
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-[#272832]">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                {config.interestsLabel}
              </span>
              <div className="flex flex-wrap gap-2">
                {config.interests.split(',').map((topic, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-slate-100 dark:bg-[#15161b] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#272832] hover:border-[#0b99ff]/50 hover:bg-[#0b99ff]/5 hover:text-[#0b99ff] transition-all cursor-default shadow-2xs"
                  >
                    {topic.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Block: Publication Credits & Recognition Badges */}
        <div className="lg:col-span-7 space-y-5 lg:pl-6 lg:border-l border-slate-100 dark:border-[#272832]">
          
          {/* Publication Credits Row */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                {isDe ? "Publikations-Gutschriften & Erlass" : "Publication Credits"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <Check className="h-3.5 w-3.5 text-emerald-600" /> {isDe ? "Stufe 2 · 25% Erlass" : "Tier 2 · 25% Waiver"}
              </span>
            </div>

            {/* Minimal 3-Stat Card */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-200/70 dark:border-[#272832]">
              <div>
                <span className="text-xs uppercase font-semibold text-slate-400 block tracking-wider">{isDe ? "Gutachten" : "Reviews"}</span>
                <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5 block">{isDe ? "12 Abgeschlossen" : "12 Completed"}</span>
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-slate-400 block tracking-wider">{isDe ? "Bearbeitung" : "Turnaround"}</span>
                <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5 block">{isDe ? "4,5 Tage Ø" : "4.5d Avg"}</span>
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-slate-400 block tracking-wider">{isDe ? "Nächste Stufe" : "Next Tier"}</span>
                <span className="text-sm sm:text-base font-bold text-[#0b99ff] mt-0.5 block">{isDe ? "In 2 Gutachten" : "In 2 Reviews"}</span>
              </div>
            </div>

            {/* Action Link */}
            <div className="flex justify-end">
              <button
                onClick={() => onExploreBadges && onExploreBadges()}
                type="button"
                className="text-sm font-semibold text-[#0b99ff] hover:text-[#0088e0] dark:hover:text-[#38bdf8] flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {isDe ? "Erlassrichtlinie & Stufen ansehen" : "View Waiver Policy & Tiers"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 3 Prominent Recognition Badges (Boxless & Enlarged) */}
          <div className="pt-3 border-t border-slate-100 dark:border-[#272832] space-y-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              {isDe ? "Redaktionelle Anerkennungs-Abzeichen" : "Editorial Recognition Badges"}
            </span>
            <div className="grid grid-cols-3 gap-3 text-center">
              
              {/* Badge 1: Top Contributor */}
              <div className="flex flex-col items-center justify-center space-y-1.5 py-1">
                <div className="h-12 w-12 rounded-full bg-[#0b99ff]/15 text-[#0b99ff] flex items-center justify-center shadow-xs">
                  <Star className="h-6 w-6 fill-[#0b99ff]/30 text-[#0b99ff]" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white block leading-tight">{isDe ? "Top-Beitragende(r)" : "Top Contributor"}</span>
                  <span className="text-xs text-slate-400 font-normal mt-0.5 block">{isDe ? "Top 5% Gutachter" : "Top 5% Reviewer"}</span>
                </div>
              </div>

              {/* Badge 2: Fast Responder */}
              <div className="flex flex-col items-center justify-center space-y-1.5 py-1">
                <div className="h-12 w-12 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                  <Award className="h-6 w-6 fill-emerald-500/30 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white block leading-tight">{isDe ? "Schnelle Reaktion" : "Fast Responder"}</span>
                  <span className="text-xs text-slate-400 font-normal mt-0.5 block">{isDe ? "< 5 Tage Bearbeitung" : "< 5d Turnaround"}</span>
                </div>
              </div>

              {/* Badge 3: Integrity Champion */}
              <div className="flex flex-col items-center justify-center space-y-1.5 py-1">
                <div className="h-12 w-12 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
                  <ShieldCheck className="h-6 w-6 fill-indigo-500/30 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white block leading-tight">{isDe ? "Integritäts-Leitung" : "Integrity Lead"}</span>
                  <span className="text-xs text-slate-400 font-normal mt-0.5 block">{isDe ? "100% Verifiziert" : "100% Verified"}</span>
                </div>
              </div>

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
      if (urlRole && ["admin", "author", "reviewer", "editor", "im", "ria", "jm"].includes(urlRole)) {
        setRole(urlRole)
        setRegRole(urlRole === "reviewer" ? "reviewer" : "author")
      }
      if (urlMode && ["login", "register"].includes(urlMode)) {
        setMode(urlMode)
      }
      // Load any author submissions persisted in browser storage
      try {
        const stored = localStorage.getItem("editorial360_manuscripts")
        if (stored) {
          const parsed = JSON.parse(stored) as Manuscript[]
          if (Array.isArray(parsed) && parsed.length > 0) {
            setManuscripts(prev => {
              const existingIds = new Set(prev.map(p => p.id))
              const newItems = parsed.filter(p => !existingIds.has(p.id))
              return [...newItems, ...prev]
            })
          }
        }
      } catch (err) {
        console.error("Failed to load saved manuscripts from localStorage", err)
      }
    }
  }, [])

  // Mock Databases in state for interactivity
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([
    {
      id: "SOMED-26-RW108",
      title: "Advances in Type 1 Diabetes Ocular Remote Tele-Health Screening",
      journal: "Scholarly Open: Medicine",
      status: "Awaiting Initial Check",
      date: "2026-08-23",
      reviewers: [],
      integrityStatus: "Clean",
      plagiarismScore: 3,
      aiScore: 6,
      authorFirstName: "Evelyn",
      authorLastName: "Vane",
      authorName: "Dr. Evelyn Vane",
      authorEmail: "e.vane@scholarlyopen.org",
      authorAffiliation: "Institute of Advanced Medical Sciences",
      authorCountry: "United States",
      authorOrcid: "0000-0002-1825-0097",
      coAuthors: "Prof. Michael H. Klein, Dr. Lauren Bailey",
      articleType: "Original Research",
      submissionStage: "Initial Submission",
      abstract: "Evaluation of non-mydriatic fundus tele-screening protocols and automated convolutional neural networks for early detection of diabetic retinopathy in juvenile Type 1 Diabetes cohorts across rural clinical centers.",
      keywords: "Type 1 Diabetes, Tele-Health, Retinopathy, Ocular Screening, Deep Learning",
      fileName: "T1D_Ocular_TeleHealth_Manuscript.pdf",
      fileSize: "3.4 MB",
      coverLetter: "Dear Editor-in-Chief,\n\nWe are pleased to submit our original research article titled \"Advances in Type 1 Diabetes Ocular Remote Tele-Health Screening\" for publication consideration in Scholarly Open: Medicine.\n\nSincerely,\nDr. Evelyn Vane",
      ethicsIrb: "IRB-MED-2026-T1D-092",
      fundingGrant: "NIH-EY-2026-4401",
      dataDoi: "doi.org/10.5281/zenodo.882910",
      editorAssigned: false
    },
    {
      id: "SOMED-26-RW101",
      title: "Clinical Evaluation of AI-Driven Diagnostic Imaging in Cardiovascular Medicine",
      journal: "Scholarly Open: Medicine",
      status: "Awaiting Initial Check",
      date: "2026-08-18",
      reviewers: [],
      integrityStatus: "Clean",
      plagiarismScore: 5,
      aiScore: 12,
      authorFirstName: "Evelyn",
      authorLastName: "Vane",
      authorName: "Dr. Evelyn Vane",
      authorEmail: "e.vane@scholarlyopen.org",
      authorAffiliation: "Institute of Advanced Medical Sciences",
      authorOrcid: "0000-0002-1825-0097",
      coAuthors: "Prof. Aris Thorne, Dr. Sarah Lin",
      articleType: "Original Research",
      submissionStage: "Initial Submission",
      abstract: "Comprehensive investigation into high-throughput predictive deep learning frameworks for diagnostic cardiology and automated ECG analysis. By leveraging a multi-center cohort of over 45,000 clinical records, we demonstrate that neural ensemble architectures achieve 98.4% diagnostic concordance with senior electrophysiologists.",
      keywords: "Cardiology, Deep Learning, ECG Analysis, Clinical AI",
      fileName: "Clinical_AI_Cardio_Manuscript.pdf",
      fileSize: "2.8 MB",
      ethicsIrb: "IRB-MED-2026-081-V1",
      fundingGrant: "NIH-HL-2026-9901",
      dataDoi: "doi.org/10.5281/zenodo.108921",
      editorAssigned: false
    },
    {
      id: "SOEAS-26-RS102",
      title: "Machine Learning Approaches in Renewable Energy Forecasting",
      journal: "Engineering & Applied Sciences",
      status: "Under Review",
      date: "2026-05-12",
      reviewers: ["Dr. Evelyn Vane"],
      integrityStatus: "Clean",
      plagiarismScore: 8,
      aiScore: 12,
      authorFirstName: "Marcus",
      authorLastName: "Vance",
      authorName: "Dr. Marcus Vance",
      authorEmail: "m.vance@scholarlyopen.org",
      authorAffiliation: "Center for Sustainable Energy Technology",
      authorOrcid: "0000-0004-7711-2093",
      coAuthors: "Dr. Clara Zhang",
      articleType: "Original Research",
      submissionStage: "Initial Submission",
      abstract: "Evaluating peer-to-peer carbon offset mechanisms, microgrid validation protocols, and distributed energy transaction ledger architectures under fluctuating load conditions in municipal infrastructures.",
      keywords: "Renewable Energy, Machine Learning, Smart Grids",
      fileName: "Renewable_Energy_ML_V1.pdf",
      fileSize: "3.1 MB",
      ethicsIrb: "Exempt / Non-human Subject Research",
      fundingGrant: "EU-Horizon-2026-8812",
      dataDoi: "doi.org/10.5281/zenodo.220194",
      editorAssigned: true,
      assignedEditorName: "Prof. Clara Zhang"
    },
    {
      id: "SOSSH-26-SRW103",
      title: "Socio-Economic Impacts of Urban Green Spaces in Moderate Climates",
      journal: "Social Sciences & Humanities",
      status: "Revision Required",
      date: "2026-05-28",
      reviewers: ["Prof. Aris Thorne"],
      integrityStatus: "Clean",
      plagiarismScore: 11,
      aiScore: 5,
      authorFirstName: "Sarah",
      authorLastName: "Jenkins",
      authorName: "Dr. Sarah Jenkins",
      authorEmail: "s.jenkins@scholarlyopen.org",
      authorAffiliation: "Department of Urban Studies & Environment",
      authorOrcid: "0000-0001-5524-8891",
      coAuthors: "Prof. David Miller",
      articleType: "Original Research",
      submissionStage: "Revised Submission",
      abstract: "Assessing empirical wellbeing indices and socio-spatial equity across public park access in European metropolitan areas using multi-wave panel data.",
      keywords: "Urban Sociology, Green Space, Wellbeing, Spatial Equity",
      fileName: "Urban_Green_Spaces_Revision.docx",
      fileSize: "1.9 MB",
      ethicsIrb: "IRB-SSH-2026-044",
      fundingGrant: "DFG-URB-2025-019",
      dataDoi: "Available upon reasonable request",
      editorAssigned: true,
      assignedEditorName: "Prof. Aris Thorne"
    },
    {
      id: "SOEAS-26-RS104",
      title: "A Security Framework for Decentralized Ledgers in Public Records",
      journal: "Engineering & Applied Sciences",
      status: "Accepted",
      date: "2026-04-01",
      reviewers: ["Dr. Evelyn Vane", "Dr. Marcus Vance"],
      integrityStatus: "Clean",
      plagiarismScore: 4,
      aiScore: 3,
      authorFirstName: "Aris",
      authorLastName: "Thorne",
      authorName: "Prof. Aris Thorne",
      authorEmail: "a.thorne@scholarlyopen.org",
      authorAffiliation: "Institute for Distributed Systems & Cryptography",
      authorOrcid: "0000-0003-9912-4011",
      coAuthors: "Dr. Evelyn Vane",
      articleType: "Original Research",
      submissionStage: "Initial Submission",
      abstract: "Novel consensus integrity protocol with formal zero-knowledge validation for tamper-proof public record registries.",
      keywords: "Cryptography, Distributed Ledgers, Public Records, Security",
      fileName: "Decentralized_Ledgers_Final.pdf",
      fileSize: "2.2 MB",
      ethicsIrb: "Not Applicable",
      fundingGrant: "NSF-SEC-2025-771",
      dataDoi: "doi.org/10.5281/zenodo.998412",
      editorAssigned: true,
      assignedEditorName: "Prof. Clara Zhang"
    },
    {
      id: "SOEAS-26-TR105",
      title: "Synthesizing Biodegradable Polymers for Soft Robotics",
      journal: "Engineering & Applied Sciences",
      status: "Awaiting Initial Check",
      date: "2026-06-05",
      reviewers: [],
      integrityStatus: "Unchecked",
      authorFirstName: "Clara",
      authorLastName: "Zhang",
      authorName: "Prof. Clara Zhang",
      authorEmail: "c.zhang@scholarlyopen.org",
      authorAffiliation: "School of Materials Science & Engineering",
      authorOrcid: "0000-0002-4411-9022",
      coAuthors: "Dr. Marcus Vance",
      articleType: "Methodology Paper",
      submissionStage: "Initial Submission",
      abstract: "Scalable synthesis protocol of bio-compatible elastomers with high tensile elastic modulus suitable for underwater soft robotics actuation.",
      keywords: "Biopolymers, Soft Robotics, Materials Synthesis",
      fileName: "Biodegradable_Polymers_Report.pdf",
      fileSize: "4.5 MB",
      ethicsIrb: "None declared / Not applicable",
      fundingGrant: "No external funding declared",
      dataDoi: "Available upon reasonable request",
      editorAssigned: false
    },
    {
      id: "SOEAS-26-RS106",
      title: "Optimization of Silicon Anodes for Lithium-Ion Batteries",
      journal: "Engineering & Applied Sciences",
      status: "Under Review",
      date: "2026-06-02",
      reviewers: [],
      integrityStatus: "Flagged",
      plagiarismScore: 18,
      aiScore: 88,
      authorFirstName: "Robert",
      authorLastName: "Lang",
      authorName: "Prof. Robert Lang",
      authorEmail: "r.lang@scholarlyopen.org",
      authorAffiliation: "Electrochemical Energy Institute",
      authorOrcid: "0000-0001-8822-6719",
      coAuthors: "None declared",
      articleType: "Original Research",
      submissionStage: "Initial Submission",
      abstract: "Nanostructured silicon-carbon composite design to mitigate volumetric expansion during lithiation cycling.",
      keywords: "Silicon Anodes, Battery Technology, Electrochemistry",
      fileName: "Silicon_Anodes_Manuscript.pdf",
      fileSize: "3.7 MB",
      ethicsIrb: "Not Applicable",
      fundingGrant: "DOE-BATT-2026-102",
      dataDoi: "doi.org/10.5281/zenodo.773121",
      editorAssigned: true,
      assignedEditorName: "Prof. Clara Zhang"
    },
    {
      id: "SOSSH-26-SRW107",
      title: "Gender Wage Disparity: A Multi-Country Meta-Analysis",
      journal: "Social Sciences & Humanities",
      status: "Under Review",
      date: "2026-06-04",
      reviewers: [],
      integrityStatus: "Flagged",
      plagiarismScore: 34,
      aiScore: 15,
      authorFirstName: "Helen",
      authorLastName: "Vance",
      authorName: "Dr. Helen Vance",
      authorEmail: "h.vance@scholarlyopen.org",
      authorAffiliation: "Institute of Social Economics & Labor Policy",
      authorOrcid: "0000-0002-3399-5510",
      coAuthors: "Prof. David Miller",
      articleType: "Review Article",
      submissionStage: "Initial Submission",
      abstract: "Harmonized econometric meta-analysis of adjusted gender wage gaps across 42 OECD countries between 2010 and 2024.",
      keywords: "Labor Economics, Gender Pay Gap, Meta-Analysis, Public Policy",
      fileName: "Gender_Wage_Disparity_Review.docx",
      fileSize: "1.6 MB",
      ethicsIrb: "Exempt - Secondary Data Analysis",
      fundingGrant: "ILO-RES-2025-09",
      dataDoi: "Available upon reasonable request",
      editorAssigned: true,
      assignedEditorName: "Prof. Aris Thorne"
    }
  ])

  const [reviewInvitations, setReviewInvitations] = useState<ReviewInvitation[]>([
    {
      id: "SOENG-26-RS001",
      title: "Decentralized Federated Learning on Non-IID Medical Data",
      journal: "Engineering & Applied Sciences",
      deadline: "2026-06-25",
      abstract: "This paper proposes a novel framework for federated learning in decentralized healthcare environments. By utilizing differential privacy and a custom weight aggregation protocol, we demonstrate high diagnostic accuracy across non-IID datasets without compromising patient confidentiality."
    }
  ])

  const [activeReviews, setActiveReviews] = useState<ActiveReview[]>([
    {
      id: "SOSOC-26-RV002",
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
      paperId: "SOMED-26-RW101",
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
      paperId: "SOEAS-26-RS106",
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
      paperId: "SOSSH-26-SRW107",
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
      paperId: "SOEAS-26-RS102",
      actor: "Prof. Aris Thorne (Editor)",
      action: "Decision Logged",
      timestamp: "2026-06-01 10:24",
      details: "Manuscript accepted for publication after review verification."
    },
    {
      id: "LOG-101",
      paperId: "SOSSH-26-SRW103",
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
  const [newFirstName, setNewFirstName] = useState("Evelyn")
  const [newLastName, setNewLastName] = useState("Vane")
  const [newAuthorEmail, setNewAuthorEmail] = useState("e.vane@scholarlyopen.org")
  const [newAuthorAffiliation, setNewAuthorAffiliation] = useState("Institute of Advanced Medical Sciences")
  const [newAuthorCountry, setNewAuthorCountry] = useState("United States")
  const [newAuthorOrcid, setNewAuthorOrcid] = useState("0000-0002-1825-0097")
  const [newArticleType, setNewArticleType] = useState("Original Research")
  const [newTitle, setNewTitle] = useState("")
  const [newJournal, setNewJournal] = useState("Scholarly Open: Medicine")
  const [newSubmissionStage, setNewSubmissionStage] = useState("Initial Submission")
  const [newAbstract, setNewAbstract] = useState("")
  const [newKeywords, setNewKeywords] = useState("")
  const [newCoAuthors, setNewCoAuthors] = useState("")
  const [newEthicsIrb, setNewEthicsIrb] = useState("")
  const [newFundingGrant, setNewFundingGrant] = useState("")
  const [newDataDoi, setNewDataDoi] = useState("")
  const [submissionFile, setSubmissionFile] = useState<File | null>(null)
  const [submissionFileName, setSubmissionFileName] = useState<string>("")
  const [submissionFileSize, setSubmissionFileSize] = useState<string>("")
  const [newCoverLetter, setNewCoverLetter] = useState<string>("")
  const [apcAgreementChecked, setApcAgreementChecked] = useState<boolean>(true)
  const [ethicsAgreementChecked, setEthicsAgreementChecked] = useState<boolean>(true)
  const [rightsAgreementChecked, setRightsAgreementChecked] = useState<boolean>(true)
  const [isRevisionDialogOpen, setIsRevisionDialogOpen] = useState<boolean>(false)
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

  // Active sub-page tab for JM / Editor / Author / Reviewer
  const [activeJmTab, setActiveJmTab] = useState<string>("board")
  const [activeEditorTab, setActiveEditorTab] = useState<string>("desk")
  const [activeAuthorTab, setActiveAuthorTab] = useState<"dashboard" | "submissions" | "scorecard" | "plagiarism" | "feedback" | "recognition" | "career">("dashboard")
  const [activeReviewerTab, setActiveReviewerTab] = useState<"overview" | "portfolio" | "forensics" | "wallet" | "certificate">("overview")
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [userStatus, setUserStatus] = useState<"online" | "offline">("online")
  const [isTranslationMenuOpen, setIsTranslationMenuOpen] = useState(false)
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false)

  // Interactive Upwork-Style Author Dashboard States
  const [authorSubView, setAuthorSubView] = useState<"feed" | "table">("feed")
  const [authorFilter, setAuthorFilter] = useState<"all" | "under_review" | "revision_required" | "accepted">("all")
  const [authorSearchTerm, setAuthorSearchTerm] = useState<string>("")
  const [authorCurrentPage, setAuthorCurrentPage] = useState<number>(1)
  // Pagination state for all other role queues
  const [jmModerationPage, setJmModerationPage] = useState<number>(1)
  const [jmArchivesPage, setJmArchivesPage] = useState<number>(1)
  const [jmReviewerDbPage, setJmReviewerDbPage] = useState<number>(1)
  const [editorFeedbackPage, setEditorFeedbackPage] = useState<number>(1)
  const [reviewerAssignmentsPage, setReviewerAssignmentsPage] = useState<number>(1)
  const [reviewerInvitationsPage, setReviewerInvitationsPage] = useState<number>(1)

  // Interactive Plagiarism Scan States
  const [selectedScanPaperId, setSelectedScanPaperId] = useState<string>("SOMED-26-RW101")
  const [isScanningPlagiarism, setIsScanningPlagiarism] = useState<boolean>(false)
  const [scanProgress, setScanProgress] = useState<number>(0)
  const [scanCompletedSuccess, setScanCompletedSuccess] = useState<boolean>(false)
  const [showAnnotatedText, setShowAnnotatedText] = useState<boolean>(true)
  const [segmentResolutions, setSegmentResolutions] = useState<Record<string, "accepted" | "marked-own" | "cite-source" | "will-rephrase" | null>>({})
  const handleResolveSegment = (id: string, action: "accepted" | "marked-own" | "cite-source" | "will-rephrase") => {
    setSegmentResolutions(prev => ({ ...prev, [id]: prev[id] === action ? null : action }))
  }

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

  // APC Waiver Claim States
  const [selectedWaiverPaperId, setSelectedWaiverPaperId] = useState<string>("SOMED-26-RW101")
  const [isClaimingWaiver, setIsClaimingWaiver] = useState<boolean>(false)
  const [waiverClaimSuccess, setWaiverClaimSuccess] = useState<boolean>(false)
  const [copiedVoucher, setCopiedVoucher] = useState<boolean>(false)

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

  const handleDownloadAcademicRecordPdf = () => {
    if (typeof window === "undefined") return
    const authorName = profFullName ? (profFullName.startsWith("Dr.") ? profFullName : `Dr. ${profFullName}`) : "Dr. Evelyn Vane"
    const rank = profRank || (language === "de" ? "Senior-Forscher & Fakultätsleiter" : "Senior Researcher & Faculty Lead")
    const institution = profInstitution || "Institute of Advanced Medical Sciences"
    const country = profCountry || "United States"
    const orcid = isOrcidVerified ? "0009-0004-7721-9982" : "Unverified"
    const dateStr = new Date().toISOString().split("T")[0]

    const origin = typeof window !== "undefined" ? window.location.origin : ""

    const printWindow = window.open("", "_blank", "width=850,height=1000")
    if (!printWindow) {
      window.print()
      return
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Academic Record - ${authorName}</title>
        <style>
          @page { size: A4; margin: 16mm 18mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; margin: 0; padding: 24px; line-height: 1.45; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0b99ff; padding-bottom: 14px; margin-bottom: 18px; }
          .logo-box { display: flex; align-items: center; gap: 10px; }
          .logo-img { height: 38px; width: auto; }
          .logo { font-size: 20px; font-weight: 800; color: #0b99ff; letter-spacing: -0.5px; }
          .logo span { color: #0f172a; }
          .doc-title { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; text-align: right; }
          .doc-id { font-size: 11px; font-weight: 600; color: #0f172a; margin-top: 2px; }
          .profile-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; margin-bottom: 16px; display: flex; justify-content: space-between; }
          .name { font-size: 16px; font-weight: 800; color: #0f172a; }
          .affil { font-size: 12px; color: #475569; margin-top: 2px; }
          .orcid { font-size: 11px; color: #6a9a1f; font-weight: 600; margin-top: 4px; }
          .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 18px; }
          .stat-box { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; text-align: center; }
          .stat-val { font-size: 18px; font-weight: 800; color: #0b99ff; }
          .stat-lbl { font-size: 9px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-top: 2px; }
          .section-title { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #0f172a; letter-spacing: 0.5px; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 18px; font-size: 11px; }
          th { background: #f1f5f9; font-weight: 700; text-align: left; padding: 6px 8px; border: 1px solid #e2e8f0; font-size: 10px; text-transform: uppercase; }
          td { padding: 6px 8px; border: 1px solid #e2e8f0; color: #334155; vertical-align: top; }
          .pub-title { font-weight: 700; color: #0f172a; margin-bottom: 2px; }
          .pub-meta { font-size: 10px; color: #64748b; }
          .badge { display: inline-block; padding: 1px 6px; border-radius: 4px; font-size: 9px; font-weight: 600; background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
          .footer { margin-top: 24px; padding-top: 10px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between; font-size: 9px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo-box">
            <img src="${origin}/logo-full.svg" alt="Scholarly Open" class="logo-img" onerror="this.src='${origin}/logo-mark.svg'" />
            <div>
              <div style="font-size: 10px; color: #64748b; margin-top: 2px;">Verified Academic Record & Research Impact Dossier</div>
            </div>
          </div>
          <div>
            <div class="doc-title">Official Academic Transcript</div>
            <div class="doc-id">DOC-ID: SO-REC-2026-98741</div>
            <div style="font-size: 10px; color: #64748b;">Issued: ${dateStr}</div>
          </div>
        </div>

        <div class="profile-card">
          <div>
            <div class="name">${authorName}</div>
            <div class="affil">${rank} · ${institution}, ${country}</div>
            <div class="orcid">✓ ORCID iD: ${orcid} (Verified)</div>
          </div>
          <div style="text-align: right; font-size: 10px; color: #64748b;">
            <div><b>Publisher:</b> Scholarly Open</div>
            <div><b>Indexing:</b> Crossref · DOAJ · Scopus</div>
            <div><b>Integrity Status:</b> Verified / Good Standing</div>
          </div>
        </div>

        <div class="section-title">Key Academic Impact Metrics</div>
        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-val">5</div>
            <div class="stat-lbl">Published Articles</div>
          </div>
          <div class="stat-box">
            <div class="stat-val">120</div>
            <div class="stat-lbl">Total Citations</div>
          </div>
          <div class="stat-box">
            <div class="stat-val">4 · 3</div>
            <div class="stat-lbl">h-index · i10-index</div>
          </div>
          <div class="stat-box">
            <div class="stat-val">12</div>
            <div class="stat-lbl">Peer Reviews (Tier 2)</div>
          </div>
        </div>

        <div class="section-title">Verified Published Articles & Indexing</div>
        <table>
          <thead>
            <tr>
              <th style="width: 55%;">Publication Title & DOI</th>
              <th style="width: 25%;">Journal</th>
              <th style="width: 10%; text-align: center;">Year</th>
              <th style="width: 10%; text-align: right;">Citations</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="pub-title">A Security Framework for Decentralized Ledgers in Public Records</div>
                <div class="pub-meta">DOI: 10.5555/so.2026.102 · <span class="badge">Open Access</span></div>
              </td>
              <td>Engineering & Applied Sciences</td>
              <td style="text-align: center;">2026</td>
              <td style="text-align: right; font-weight: bold; color: #0b99ff;">42</td>
            </tr>
            <tr>
              <td>
                <div class="pub-title">Machine Learning Approaches in Renewable Energy Forecasting</div>
                <div class="pub-meta">DOI: 10.5555/so.2026.081 · <span class="badge">Open Access</span></div>
              </td>
              <td>Engineering & Applied Sciences</td>
              <td style="text-align: center;">2026</td>
              <td style="text-align: right; font-weight: bold; color: #0b99ff;">38</td>
            </tr>
            <tr>
              <td>
                <div class="pub-title">Ethical Dimensions of AI-Assisted Clinical Decision Support</div>
                <div class="pub-meta">DOI: 10.5555/so.2025.047 · <span class="badge">Open Access</span></div>
              </td>
              <td>Medicine & Health Sciences</td>
              <td style="text-align: center;">2025</td>
              <td style="text-align: right; font-weight: bold; color: #0b99ff;">27</td>
            </tr>
            <tr>
              <td>
                <div class="pub-title">Federated Learning Privacy Guarantees Under Byzantine Faults</div>
                <div class="pub-meta">DOI: 10.5555/so.2025.039 · <span class="badge">Open Access</span></div>
              </td>
              <td>Engineering & Applied Sciences</td>
              <td style="text-align: center;">2025</td>
              <td style="text-align: right; font-weight: bold; color: #0b99ff;">13</td>
            </tr>
          </tbody>
        </table>

        <div class="section-title">Annual Citation Breakdown</div>
        <table>
          <thead>
            <tr>
              <th style="text-align: center;">2019</th>
              <th style="text-align: center;">2020</th>
              <th style="text-align: center;">2021</th>
              <th style="text-align: center;">2022</th>
              <th style="text-align: center;">2023</th>
              <th style="text-align: right;">Total Verified</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: center;">12</td>
              <td style="text-align: center;">22</td>
              <td style="text-align: center;">35</td>
              <td style="text-align: center;">30</td>
              <td style="text-align: center;">45</td>
              <td style="text-align: right; font-weight: 800; color: #0b99ff;">120 Citations</td>
            </tr>
          </tbody>
        </table>

        <div class="footer">
          <div>Certified by Scholarly Open Editorial Board · Crossref Member #10.5555</div>
          <div>Verification Hash: SHA256:7f8a9e4b1c2d0f3e · Valid for Grants & Tenure Filing</div>
        </div>
      </body>
      </html>
    `)
    printWindow.document.close()
    setTimeout(() => {
      try {
        printWindow.focus()
        printWindow.print()
      } catch (err) {
        console.error("Print error:", err)
      }
    }, 350)
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
    { id: "admin", label: "Admin", placeholder: "admin@scholarlyopen.org" },
    { id: "jm", label: "Journal Manager", placeholder: "manager@scholarlyopen.org" },
    { id: "author", label: "Author", placeholder: "author@scholarlyopen.org" },
    { id: "reviewer", label: "Reviewer", placeholder: "reviewer@scholarlyopen.org" },
    { id: "editor", label: "Editor", placeholder: "editor@scholarlyopen.org" },
    { id: "im", label: "Integrity Manager", placeholder: "im@scholarlyopen.org" },
  ]

  // First-Time Profile Builder States
  const [isAuthorProfileSetupOpen, setIsAuthorProfileSetupOpen] = useState(false)
  const [isAuthorProfileCompleted, setIsAuthorProfileCompleted] = useState(true)
  const [profFullName, setProfFullName] = useState("Dr. Evelyn Vane")
  const [profRank, setProfRank] = useState("Senior Researcher & Faculty Lead")
  const [profInstitution, setProfInstitution] = useState("Institute of Advanced Medical Sciences")
  const [profCountry, setProfCountry] = useState("United Kingdom")
  const [profOrcid, setProfOrcid] = useState("0000-0002-1825-0097")
  const [profSpecialization, setProfSpecialization] = useState("Cardiology, Clinical AI, Diagnostic Imaging")
  const [profPhotoUrl, setProfPhotoUrl] = useState<string>("")
  const [profReviewOptIn, setProfReviewOptIn] = useState(true)
  const [isOrcidVerified, setIsOrcidVerified] = useState(true)
  const [isSyncingOrcid, setIsSyncingOrcid] = useState(false)
  const [orcidSyncMessage, setOrcidSyncMessage] = useState("")

  // Journal Manager in-house staff profile states
  const [jmFullName, setJmFullName] = useState("Sarah Jenkins")
  const [jmStaffRole, setJmStaffRole] = useState("Editorial Manager")
  const [jmDepartment, setJmDepartment] = useState("Editorial & Publishing Operations")
  const [jmOfficeLocation, setJmOfficeLocation] = useState("Scholarly Open Headquarters (Basel / London)")
  const [jmDeskEmail, setJmDeskEmail] = useState("scholarlyopen@gmail.com")
  const [jmCcReminders, setJmCcReminders] = useState(true)
  const [jmIntegrityAlerts, setJmIntegrityAlerts] = useState(true)

  // Handling Editor / Editor-in-Chief profile states
  const [editorName, setEditorName] = useState("Prof. Aris Thorne")
  const [editorRank, setEditorRank] = useState("Professor & Editor-in-Chief")
  const [editorInstitution, setEditorInstitution] = useState("Charité – Universitätsmedizin Berlin")
  const [editorCountry, setEditorCountry] = useState("Germany")
  const [editorJournal, setEditorJournal] = useState("Scholarly Open: Medicine & Applied Sciences")
  const [editorEmail, setEditorEmail] = useState("a.thorne@scholarlyopen.org")
  const [editorPhotoUrl, setEditorPhotoUrl] = useState("")
  const [editorOrcid, setEditorOrcid] = useState("0000-0002-9842-1102")

  const handleSyncWithOrcid = (targetOrcid?: string) => {
    const orcidToSync = targetOrcid || profOrcid
    if (!orcidToSync || orcidToSync.trim().length < 8) {
      setOrcidSyncMessage("Please enter a valid 16-digit ORCID iD first.")
      return
    }
    setIsSyncingOrcid(true)
    setOrcidSyncMessage("")

    setTimeout(() => {
      setIsSyncingOrcid(false)
      if (orcidToSync.includes("1825") || orcidToSync.includes("0097")) {
        setProfFullName("Dr. Evelyn Vane")
        setProfInstitution("Institute of Advanced Medical Sciences")
        setProfCountry("United States")
        setProfRank("Senior Researcher & Faculty Lead")
        setProfSpecialization("Cardiology, Clinical AI, Diagnostic Imaging")
      } else if (orcidToSync.includes("1122") || orcidToSync.includes("3344")) {
        setProfFullName("Dr. Alex Johnson")
        setProfInstitution("Oxford Institute for Ethics in AI")
        setProfCountry("United Kingdom")
        setProfRank("Senior Researcher")
        setProfSpecialization("AI Ethics, Machine Learning, Data Privacy")
      } else if (orcidToSync.includes("8765") || orcidToSync.includes("4321")) {
        setProfFullName("Prof. Aris Thorne")
        setProfInstitution("Heidelberg Center for Governance")
        setProfCountry("Germany")
        setProfRank("Professor")
        setProfSpecialization("Public Policy, Governance Systems")
      } else {
        setProfFullName(profFullName || "Dr. Verified Researcher")
        setProfInstitution(profInstitution || "Stanford University School of Medicine")
        setProfCountry(profCountry || "United States")
        setProfSpecialization(profSpecialization || "Open Access & Interdisciplinary Science")
      }
      setOrcidSyncMessage("✓ Verified ORCID record fetched & synced successfully!")
    }, 600)
  }

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
      if (typeof window !== "undefined") {
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
      setIsAuthorProfileCompleted(true)
      if (providerName === "ORCID iD") {
        setEmail("evelyn.vane@orcid-verified.org")
        setProfFullName("Dr. Evelyn Vane")
        setProfOrcid("0000-0002-1825-0097")
        setProfInstitution("Institute of Advanced Medical Sciences")
        setProfCountry("United States")
        setProfRank("Senior Researcher & Faculty Lead")
        setProfSpecialization("Cardiology, Clinical AI, Diagnostic Imaging")
        setSuccess("Authenticated via verified ORCID iD (0000-0002-1825-0097)! Profile synced.")
      } else {
        setEmail(`author.${providerName.toLowerCase().replace(/[^a-z0-9]/g, "")}@scholarlyopen.org`)
        setSuccess(`Authenticated via ${providerName}!`)
      }
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search)
        if (params.get("action") === "submit") {
          setIsSubmitWizardOpen(true)
        }
      }
    }, 800)
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

  const handleNewSubmissionSubmit = () => {
    if (!newTitle || !newAbstract) return

    const shortYear = new Date().getFullYear().toString().slice(-2)
    const randomNum = Math.floor(Math.random() * 800) + 100
    const journalPrefix = newJournal.includes("Medicine") 
      ? "SOMED" 
      : newJournal.includes("Biology") 
      ? "SOBIO" 
      : newJournal.includes("Engineering") 
      ? "SOEAS" 
      : newJournal.includes("Social") 
      ? "SOSSH" 
      : "SO"
    const newMsId = `${journalPrefix}-${shortYear}-RW${randomNum}`
    const authorFullName = `${newFirstName.trim()} ${newLastName.trim()}`.trim() || profFullName || "Dr. Evelyn Vane"

    const newMs: Manuscript = {
      id: newMsId,
      title: newTitle,
      journal: newJournal,
      status: "Awaiting Initial Check",
      date: new Date().toISOString().split('T')[0],
      reviewers: [],
      integrityStatus: "Unchecked",
      authorFirstName: newFirstName,
      authorLastName: newLastName,
      authorName: authorFullName,
      authorEmail: newAuthorEmail || email || "e.vane@scholarlyopen.org",
      authorAffiliation: newAuthorAffiliation || profInstitution || "Institute of Advanced Medical Sciences",
      authorCountry: newAuthorCountry || profCountry || "United States",
      authorOrcid: newAuthorOrcid || profOrcid || "0000-0002-1825-0097",
      coAuthors: newCoAuthors || "None declared",
      articleType: newArticleType || "Original Research",
      submissionStage: newSubmissionStage || "Initial Submission",
      abstract: newAbstract,
      keywords: newKeywords,
      fileName: submissionFileName || "Main_Manuscript.pdf",
      fileSize: submissionFileSize || "2.4 MB",
      coverLetter: newCoverLetter,
      ethicsIrb: newEthicsIrb.trim() ? newEthicsIrb.trim() : "None declared / Not applicable",
      fundingGrant: newFundingGrant.trim() ? newFundingGrant.trim() : "No external funding declared",
      dataDoi: newDataDoi.trim() ? newDataDoi.trim() : "Available upon reasonable request",
      editorAssigned: false,
      assignedEditorName: undefined
    }

    setManuscripts(prev => {
      const updated = [newMs, ...prev]
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("editorial360_manuscripts", JSON.stringify(updated))
        }
      } catch (e) {
        console.error("Failed to save submission to localStorage", e)
      }
      return updated
    })
    setIsSubmitWizardOpen(false)
    setNewTitle("")
    setNewAbstract("")
    setNewKeywords("")
    setNewCoAuthors("")
    setNewEthicsIrb("")
    setNewFundingGrant("")
    setNewDataDoi("")
    setNewAuthorCountry("United States")
    setNewCoverLetter("")
    setSubmissionFile(null)
    setSubmissionFileName("")
    setSubmissionFileSize("")
    setSubmitStep(1)
    setSuccess(language === "de" 
      ? `Manuskript ${newMsId} erfolgreich eingereicht! Eingangsbestätigung an ${authorFullName} versendet.` 
      : `Manuscript ${newMsId} submitted successfully! Confirmation sent to ${authorFullName}.`)
  }

  const handleUploadRevision = () => {
    setManuscripts(prev => {
      const updated: Manuscript[] = prev.map(m => m.id === revisionPaperId ? { ...m, status: "Revision Under Evaluation" as const } : m)
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("editorial360_manuscripts", JSON.stringify(updated))
        }
      } catch (e) {
        console.error("Failed to save revision to localStorage", e)
      }
      return updated
    })
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

  const handleAcceptReviewInvitation = (invId: string, autoDeadline?: string, reminders?: { days5: boolean; hours48: boolean }) => {
    const inv = reviewInvitations.find(i => i.id === invId)
    if (!inv) return
    
    const deadlineToSet = autoDeadline || inv.deadline
    // Add to active reviews
    const newActRev: ActiveReview = {
      id: `REV-2026-${Math.floor(Math.random() * 100) + 20}`,
      title: inv.title,
      journal: inv.journal,
      deadline: deadlineToSet,
      status: "In Progress"
    }
    setActiveReviews(prev => [...prev, newActRev])
    setReviewInvitations(prev => prev.filter(i => i.id !== invId))
    setSuccess(language === "de"
      ? `Begutachtung angenommen! Abgabetermin auf ${deadlineToSet} festgelegt. Automatische Erinnerungen aktiv.`
      : `Review invitation accepted! Submission deadline scheduled for ${deadlineToSet}. Automated reminders armed.`
    )
  }

  const handleDeclineReviewInvitation = (invId: string, reason?: string, recommendation?: { name: string; email: string; affiliation: string; note: string }) => {
    const inv = reviewInvitations.find(i => i.id === invId)
    setReviewInvitations(prev => prev.filter(i => i.id !== invId))
    
    if (recommendation && recommendation.name) {
      const newLog: ArchiveLog = {
        id: `LOG-${Math.floor(Math.random() * 100) + 300}`,
        paperId: inv ? inv.id : "INV-2026",
        actor: "Dr. Marcus Vance (Reviewer)",
        action: "Review Declined & Peer Recommended",
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        details: `Reason: ${reason || "Workload"}. Recommended alternative: ${recommendation.name} (${recommendation.email}, ${recommendation.affiliation}) - Notes: "${recommendation.note}".`
      }
      setArchiveLogs(prev => [newLog, ...prev])
      setSuccess(language === "de"
        ? `Absage registriert. Empfehlung für ${recommendation.name} wurde an den zuständigen Editor weitergeleitet.`
        : `Decline recorded. Your peer recommendation for ${recommendation.name} was forwarded to the Handling Editor.`
      )
    } else {
      setSuccess(language === "de" ? "Begutachtungsanfrage abgelehnt." : "Review invitation declined.")
    }
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

  const handleSubmitReviewScorecard = (scorecardData?: ReviewAssessmentData) => {
    if (scorecardData) {
      // Complete active review
      setActiveReviews(prev => 
        prev.map(r => r.id === scorecardData.paperId ? { ...r, status: "Completed", recommendation: scorecardData.recommendation } : r)
      )
      
      const newReview: ReviewFeedback = {
        id: `REV-FB-${Math.floor(Math.random() * 1000) + 200}`,
        paperId: scorecardData.manuscriptId || "MS-2026-081",
        reviewerName: "Dr. Marcus Vance",
        originality: scorecardData.priorityRating <= 3 ? 5 : 4,
        methodology: 4,
        clarity: 4,
        significance: 4,
        commentsAuthor: scorecardData.generalCommentsAuthor + (scorecardData.specificCommentsAuthor ? `\n\nSpecific Line Critiques:\n${scorecardData.specificCommentsAuthor}` : ""),
        commentsEditor: scorecardData.confidentialCommentsEditor || "Assessment submitted via Electronic Reviewer Assessment Form.",
        recommendation: scorecardData.recommendation,
        status: "Pending Moderation"
      }
      setReviews(prev => [...prev, newReview])
      
      const newLog: ArchiveLog = {
        id: `LOG-${Math.floor(Math.random() * 100) + 200}`,
        paperId: scorecardData.manuscriptId || "MS-2026-081",
        actor: "Dr. Marcus Vance (Reviewer)",
        action: "Electronic Assessment Form Submitted",
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        details: `10-Point Questionnaire completed. Priority: ${scorecardData.priorityRating}/10. Verdict: "${scorecardData.recommendation}". COPE Certified. Routed to Editor Quality Endorsement Gate.`
      }
      setArchiveLogs(prev => [newLog, ...prev])
      setSuccess(language === "de"
        ? "Begutachtung erfolgreich übermittelt! +12 Gutachter-Punkte gutgeschrieben (Vorbehaltlich Editor-Freigabe)."
        : "Evaluation successfully submitted! +12 Reviewer Points credited to your wallet (Pending Editor sign-off)."
      )
      setIsReviewFormOpen(false)
      return
    }

    // Complete active review in Reviewer list (fallback)
    setActiveReviews(prev => 
      prev.map(r => r.id === reviewPaperId ? { ...r, status: "Completed", recommendation: reviewRecommendation } : r)
    )
    
    const activeRevObj = activeReviews.find(r => r.id === reviewPaperId)
    if (activeRevObj) {
      const targetPaper = manuscripts.find(m => m.title === activeRevObj.title)
      const paperId = targetPaper ? targetPaper.id : "MS-2026-081"
      
      const newReview: ReviewFeedback = {
        id: `REV-FB-${Math.floor(Math.random() * 1000) + 200}`,
        paperId: paperId,
        reviewerName: "Dr. Evelyn Vane",
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
                        <label htmlFor="role-select" className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                          {language === "de" ? "Rolle auswählen" : "Select Role"}
                        </label>
                        <div className="relative">
                          <select
                            id="role-select"
                            value={role === "ria" ? "im" : role}
                            onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0b99ff] focus:border-transparent transition-all cursor-pointer shadow-2xs appearance-none pr-9"
                          >
                            {roles.map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
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
                        className="w-full bg-[#0b99ff] hover:bg-[#0088e0] text-white font-bold py-2.5 rounded-md shadow transition-all active:scale-[0.98] cursor-pointer text-sm"
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

            {/* Theme, Translation, Notification & User Profile Actions */}
            <div className="flex items-center gap-2.5">
              
              {/* Author Quick Badges in Header */}
              {role === "author" && (
                <div className="hidden md:flex items-center gap-2 mr-1">
                  {/* Active Submissions Counter Badge */}
                  <button
                    type="button"
                    onClick={() => setActiveAuthorTab("submissions")}
                    className="inline-flex items-center gap-2 h-8 px-3 rounded-lg text-xs bg-slate-100/90 hover:bg-slate-200/80 dark:bg-[#1c1e26] dark:hover:bg-[#252834] text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-[#2b2d38] transition-all cursor-pointer shadow-2xs group"
                    title={language === "de" ? "Zu aktiven Einreichungen springen" : "Go to Active Submissions"}
                  >
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0b99ff] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0b99ff]" />
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                      {manuscripts.filter(m => m.status.includes("Review") || m.status === "Awaiting Initial Check" || m.status === "Revision Required").length}
                    </span>
                    <span className="font-medium text-slate-600 dark:text-slate-300">
                      {language === "de" ? "Aktive Einreichungen" : "Active Submissions"}
                    </span>
                  </button>

                  {/* Official ORCID Identity Badge */}
                  <a
                    href={`https://orcid.org/${profOrcid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 h-8 px-3 rounded-lg text-xs bg-slate-100/90 hover:bg-slate-200/80 dark:bg-[#1c1e26] dark:hover:bg-[#252834] text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-[#2b2d38] transition-all cursor-pointer shadow-2xs group"
                    title={language === "de" ? "Verifiziertes ORCID-Profil aufrufen" : "View Verified ORCID Record"}
                  >
                    <span className="h-4 w-4 rounded-full bg-[#A6CE39] text-white flex items-center justify-center font-bold text-[9px] tracking-tighter shrink-0 shadow-2xs">
                      iD
                    </span>
                    <span className="text-xs font-semibold tabular-nums text-slate-700 dark:text-slate-200 tracking-tight">
                      {profOrcid}
                    </span>
                    <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
                  </a>
                </div>
              )}

              {/* Reviewer Quick Badges in Header */}
              {role === "reviewer" && (
                <div className="hidden md:flex items-center gap-2 mr-1">
                  {/* Active Review Capacity Badge */}
                  <div
                    className="inline-flex items-center gap-2 h-8 px-3 rounded-lg text-xs bg-slate-100/90 dark:bg-[#1c1e26] text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-[#2b2d38] shadow-2xs select-none"
                    title={language === "de" ? "Gutachter-Verfügbarkeit & Kapazität" : "Reviewer Availability & Capacity"}
                  >
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      {language === "de" ? "Aktiv (2 Artikel/Mo. max)" : "Active (2 papers/mo max)"}
                    </span>
                  </div>

                  {/* Official ORCID Identity Badge for Reviewer */}
                  <a
                    href="https://orcid.org/0000-0004-7711-2093"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 h-8 px-3 rounded-lg text-xs bg-slate-100/90 hover:bg-slate-200/80 dark:bg-[#1c1e26] dark:hover:bg-[#252834] text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-[#2b2d38] transition-all cursor-pointer shadow-2xs group"
                    title={language === "de" ? "Verifiziertes ORCID-Profil aufrufen" : "View Verified ORCID Record"}
                  >
                    <span className="h-4 w-4 rounded-full bg-[#A6CE39] text-white flex items-center justify-center font-bold text-[9px] tracking-tighter shrink-0 shadow-2xs">
                      iD
                    </span>
                    <span className="text-xs font-semibold tabular-nums text-slate-700 dark:text-slate-200 tracking-tight">
                      0000-0004-7711-2093
                    </span>
                    <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
                  </a>
                </div>
              )}

              {/* 1. Dark/Light Mode Toggle */}
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`flex items-center justify-center h-9 w-9 rounded-xl transition-all duration-200 cursor-pointer shadow-xs ${
                  mounted && theme === "dark"
                    ? "bg-[#18191e] border border-[#2b2d3a] text-amber-400 hover:bg-[#22242c] hover:border-[#3b3e4f]"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
                title={mounted && theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                aria-label="Toggle Theme"
              >
                {mounted && theme === "dark" ? (
                  <Sun className="h-4.5 w-4.5 text-amber-400 fill-amber-400/20 transition-transform duration-200 hover:rotate-45" />
                ) : (
                  <Moon className="h-4.5 w-4.5 text-slate-700 fill-slate-700/10 transition-transform duration-200 hover:-rotate-12" />
                )}
              </button>

              {/* 2. Translation Icon & Menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsTranslationMenuOpen(!isTranslationMenuOpen)
                    setIsNotificationMenuOpen(false)
                    setIsUserMenuOpen(false)
                  }}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#20222a] px-2.5 py-1.5 h-auto rounded-full cursor-pointer transition-all"
                  title={language === "de" ? "Plattform übersetzen" : "Translate Platform"}
                >
                  <Globe className="h-4 w-4 text-[#0b99ff]" />
                  <span className="text-xs font-semibold uppercase">{language}</span>
                </Button>

                {isTranslationMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white dark:bg-[#18191e] border border-slate-200 dark:border-[#272832] shadow-xl p-1.5 z-50 animate-in fade-in duration-150">
                    <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {language === "de" ? "Sprache wählen" : "Select Language"}
                    </div>
                    {[
                      { code: "en", label: "English (EN)" },
                      { code: "de", label: "Deutsch (DE)" },
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lang.code as any)
                          setIsTranslationMenuOpen(false)
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-left transition-all cursor-pointer ${
                          language === lang.code
                            ? "bg-[#0b99ff]/10 text-[#0b99ff] font-semibold"
                            : "text-slate-700 dark:text-slate-300 font-normal hover:bg-slate-100 dark:hover:bg-[#20222a]"
                        }`}
                      >
                        <span>{lang.label}</span>
                        {language === lang.code && <Check className="h-3.5 w-3.5 text-[#0b99ff]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Notification Icon Bell */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsNotificationMenuOpen(!isNotificationMenuOpen)
                    setIsTranslationMenuOpen(false)
                    setIsUserMenuOpen(false)
                  }}
                  className="relative cursor-pointer hover:bg-slate-100 dark:hover:bg-[#20222a] p-2 rounded-full transition-all text-slate-500 dark:text-slate-300"
                  title={language === "de" ? "Benachrichtigungen" : "Notifications"}
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#18191e] animate-pulse" />
                </button>

                {isNotificationMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-[#18191e] border border-slate-200 dark:border-[#272832] shadow-2xl p-4 z-50 animate-in fade-in duration-150 text-left">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#272832]">
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                        {language === "de" ? "Arbeitsbereich-Mitteilungen" : "Workspace Notifications"}
                      </h4>
                      <span className="text-[11px] font-semibold bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">
                        {language === "de" ? "3 Neu" : "3 New"}
                      </span>
                    </div>
                    <div 
                      className="py-2 space-y-2 max-h-64 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-100 dark:border-[#272832] text-xs">
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {language === "de" ? "Neues Manuskript eingereicht" : "New Manuscript Submitted"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                          {language === "de" ? "SOMED-26-RW101 wartet auf Erstprüfung." : "SOMED-26-RW101 awaiting initial evaluation."}
                        </p>
                        <span className="text-[11px] text-slate-400 mt-1 block">
                          {language === "de" ? "vor 10 Min." : "10 mins ago"}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-100 dark:border-[#272832] text-xs">
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {language === "de" ? "Integritäts-Audit-Hinweis" : "Integrity Audit Alert"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                          {language === "de" ? "Integritätsmanager hat Plagiatsprüfungsergebnisse verifiziert." : "Integrity Manager verified plagiarism check results."}
                        </p>
                        <span className="text-[11px] text-slate-400 mt-1 block">
                          {language === "de" ? "vor 1 Std." : "1 hour ago"}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-100 dark:border-[#272832] text-xs">
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {language === "de" ? "Gutachter-Einladung angenommen" : "Review Invitation Accepted"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                          {language === "de" ? "Dr. Marcus Vance hat das Gutachten für MS-2026-118 angenommen." : "Dr. Marcus Vance accepted review task for MS-2026-118."}
                        </p>
                        <span className="text-[11px] text-slate-400 mt-1 block">
                          {language === "de" ? "vor 3 Std." : "3 hours ago"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="h-6 w-[1px] bg-slate-200 dark:bg-[#272832] mx-0.5" />

              {/* 4. Modern User Round Avatar with Green & Grey Online/Offline Dot */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(!isUserMenuOpen)
                    setIsTranslationMenuOpen(false)
                    setIsNotificationMenuOpen(false)
                  }}
                  className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-[#20222a] transition-all cursor-pointer select-none"
                >
                  <div className="relative flex h-8 w-8 items-center justify-center shrink-0">
                    <div className="h-full w-full rounded-full bg-black dark:bg-zinc-900 text-white font-bold text-xs shadow-xs uppercase overflow-hidden flex items-center justify-center ring-2 ring-white dark:ring-[#272832]">
                      {role === "editor" && editorPhotoUrl ? (
                        <img src={editorPhotoUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : profPhotoUrl ? (
                        <img src={profPhotoUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span>{role === "editor" ? (editorName ? editorName.replace(/^Prof\.\s*|^Dr\.\s*/i, '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : "AT") : role === "jm" ? (jmFullName ? jmFullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : "SJ") : role === "author" ? (profFullName ? profFullName.replace(/^Dr\.\s*/i, '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : "EV") : role === "reviewer" ? "MV" : (role === "im" || role === "ria") ? "IM" : "SO"}</span>
                      )}
                    </div>
                    {/* Full unclipped Online (Green) / Offline (Grey) Status Dot */}
                    <span 
                      className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-white dark:ring-[#121316] z-10 transition-colors ${
                        userStatus === "online" ? "bg-emerald-500" : "bg-slate-400"
                      }`}
                      title={`Status: ${userStatus === "online" ? "Online" : "Offline"}`}
                    />
                  </div>
                  <div className="hidden lg:flex flex-col text-left pr-1">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                      {role === "editor" ? editorName : role === "jm" ? (jmFullName || "Sarah Jenkins") : role === "author" ? profFullName : role === "reviewer" ? "Dr. Marcus Vance" : (role === "im" || role === "ria") ? "Dr. Helen Vance" : "Editorial360 Admin"}
                    </span>
                    <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                      {role === "editor"
                        ? editorRank
                        : role === "jm" 
                        ? jmStaffRole
                        : role === "reviewer" 
                        ? (language === "de" ? "Fachgutachter" : "Expert Reviewer") 
                        : role === "author" 
                        ? (language === "de" ? "Hauptautor" : "Principal Author") 
                        : (role === "im" || role === "ria") 
                        ? (language === "de" ? "Integritätsmanager" : "Integrity Manager") 
                        : "System Admin"}
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden lg:block" />
                </button>

                {/* Interactive User Profile Dropdown Popover */}
                {isUserMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-[#18191e] border border-slate-200 dark:border-[#272832] shadow-2xl p-4 z-50 animate-in fade-in duration-200"
                  >
                    {/* User Header */}
                    <div className="flex items-start gap-3 pb-3 border-b border-slate-100 dark:border-[#272832]">
                      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#0b99ff] to-[#0077cc] text-white font-bold text-xs shadow-xs uppercase overflow-hidden">
                        {role === "editor" && editorPhotoUrl ? (
                          <img src={editorPhotoUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : profPhotoUrl ? (
                          <img src={profPhotoUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span>{role === "editor" ? (editorName ? editorName.replace(/^Prof\.\s*|^Dr\.\s*/i, '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : "AT") : role === "jm" ? (jmFullName ? jmFullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : "SJ") : role === "author" ? (profFullName ? profFullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : "EV") : role === "reviewer" ? "MV" : (role === "im" || role === "ria") ? "IM" : "SO"}</span>
                        )}
                        <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-[#18191e] ${userStatus === "online" ? "bg-emerald-500" : "bg-slate-400"}`} />
                      </div>
                      <div className="space-y-0.5 overflow-hidden text-left flex-1">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {role === "editor" ? editorName : role === "jm" ? (jmFullName || "Sarah Jenkins") : role === "author" ? profFullName : role === "reviewer" ? "Dr. Marcus Vance" : (role === "im" || role === "ria") ? "Dr. Helen Vance" : "Editorial360 Admin"}
                        </h4>
                        <p className="text-[11px] font-normal text-slate-500 dark:text-slate-400 truncate">{role === "editor" ? editorEmail : role === "jm" ? jmDeskEmail : email}</p>
                        <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#0b99ff]/10 text-[#0b99ff] border border-[#0b99ff]/20">
                          {role === "editor"
                            ? editorRank
                            : role === "jm" 
                            ? jmStaffRole
                            : role === "reviewer" 
                            ? (language === "de" ? "Fachgutachter" : "Expert Reviewer") 
                            : role === "author" 
                            ? (language === "de" ? "Verifizierter Autor" : "Verified Author") 
                            : (role === "im" || role === "ria") 
                            ? (language === "de" ? "Integritätsmanager" : "Integrity Manager") 
                            : "System Admin"}
                        </span>
                      </div>
                    </div>

                    {/* Presence Status Segmented Toggle */}
                    <div className="py-2 px-3 my-2.5 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-100 dark:border-[#272832] flex items-center justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-400 font-semibold">
                        {language === "de" ? "Status" : "Presence"}
                      </span>
                      <div className="flex items-center bg-white dark:bg-[#18191e] p-0.5 rounded-lg border border-slate-200 dark:border-[#272832] shadow-2xs">
                        <button
                          type="button"
                          onClick={() => setUserStatus("online")}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                            userStatus === "online"
                              ? "bg-emerald-500 text-white shadow-xs"
                              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${userStatus === "online" ? "bg-white" : "bg-emerald-500"}`} />
                          Online
                        </button>
                        <button
                          type="button"
                          onClick={() => setUserStatus("offline")}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                            userStatus === "offline"
                              ? "bg-slate-600 text-white shadow-xs"
                              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${userStatus === "offline" ? "bg-white" : "bg-slate-400"}`} />
                          Offline
                        </button>
                      </div>
                    </div>

                    {/* Action Links */}
                    <div className="py-1 space-y-1 text-left">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          setIsAuthorProfileSetupOpen(true)
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#20222a] transition-colors cursor-pointer"
                      >
                        <User className="h-4 w-4 text-[#0b99ff]" />
                        {language === "de" ? "Profileinstellungen" : "Profile Settings"}
                      </button>

                      {role === "author" && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false)
                            setIsSubmitWizardOpen(true)
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#20222a] transition-colors cursor-pointer"
                        >
                          <Plus className="h-4 w-4 text-emerald-500" />
                          {language === "de" ? "Neues Manuskript einreichen" : "Submit New Manuscript"}
                        </button>
                      )}
                    </div>

                    {/* Sign Out Button */}
                    <div className="pt-2 mt-1 border-t border-slate-100 dark:border-[#272832]">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          setIsLoggedIn(false)
                          setSuccess(language === "de" ? "Sie wurden sicher abgemeldet." : "You have been securely signed out.")
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        {language === "de" ? "Abmelden" : "Sign Out"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
            {/* Responsive Left Sidebar Navigation Tabs */}
            <aside className="w-full md:w-68 lg:w-72 bg-white dark:bg-[#15161b] border-b md:border-b-0 md:border-r border-slate-200 dark:border-[#272832] p-4 md:p-5 flex flex-col justify-between shrink-0 transition-colors">
              <div className="space-y-4 md:space-y-6">

                {/* Left Navigation Links matching screenshot */}
                <div 
                  className="flex md:flex-col items-center md:items-stretch gap-1.5 overflow-x-auto md:overflow-x-hidden pb-2 md:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {(role === "author" || role === "admin") && (
                    <button 
                      type="button"
                      onClick={() => {
                        if (role === "author") setActiveAuthorTab("dashboard")
                      }}
                      className={`flex items-center gap-2.5 px-3.5 py-2.5 text-sm rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        activeAuthorTab === "dashboard"
                          ? "bg-slate-100 dark:bg-[#1e2027] text-[#0b99ff] dark:text-sky-400 font-semibold"
                          : "text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1e2027]"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <LayoutDashboard className="h-4 w-4" />
                        {role === "author" 
                          ? (language === "de" ? "Autoren-Dashboard" : "Author Dashboard") 
                          : (language === "de" ? "Übersichts-Hub" : "Overview Hub")}
                      </span>
                    </button>
                  )}

                  {role === "reviewer" && (
                    <>
                      <button 
                        type="button"
                        onClick={() => setActiveReviewerTab("overview")}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 text-sm rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeReviewerTab === "overview"
                            ? "bg-slate-100 dark:bg-[#1e2027] text-[#0b99ff] dark:text-sky-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1e2027]"
                        }`}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>{language === "de" ? "Dashboard Übersicht" : "Dashboard Overview"}</span>
                      </button>

                      <button 
                        type="button"
                        onClick={() => setActiveReviewerTab("portfolio")}
                        className={`flex items-center justify-between gap-2.5 px-3.5 py-2.5 text-sm rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeReviewerTab === "portfolio"
                            ? "bg-slate-100 dark:bg-[#1e2027] text-[#0b99ff] dark:text-sky-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1e2027]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <FolderOpen className="h-4 w-4" />
                          <span>{language === "de" ? "Begutachtungs-Portfolio" : "Review Portfolio"}</span>
                        </div>
                        {activeReviews.length > 0 && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                            {activeReviews.length}
                          </span>
                        )}
                      </button>

                      <button 
                        type="button"
                        onClick={() => setActiveReviewerTab("forensics")}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 text-sm rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeReviewerTab === "forensics"
                            ? "bg-slate-100 dark:bg-[#1e2027] text-[#0b99ff] dark:text-sky-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1e2027]"
                        }`}
                      >
                        <SearchCode className="h-4 w-4" />
                        <span>{language === "de" ? "KI- & Papier-Forensik" : "AI & Paper Forensics"}</span>
                      </button>

                      <button 
                        type="button"
                        onClick={() => setActiveReviewerTab("wallet")}
                        className={`flex items-center justify-between gap-2.5 px-3.5 py-2.5 text-sm rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeReviewerTab === "wallet"
                            ? "bg-slate-100 dark:bg-[#1e2027] text-[#0b99ff] dark:text-sky-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1e2027]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Wallet className="h-4 w-4" />
                          <span>{language === "de" ? "APC-Credit-Wallet" : "APC Credit Wallet"}</span>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0b99ff]/10 text-[#0b99ff] font-bold">
                          35 Pts
                        </span>
                      </button>

                      <button 
                        type="button"
                        onClick={() => setActiveReviewerTab("certificate")}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 text-sm rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeReviewerTab === "certificate"
                            ? "bg-slate-100 dark:bg-[#1e2027] text-[#0b99ff] dark:text-sky-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1e2027]"
                        }`}
                      >
                        <FileCheck2 className="h-4 w-4" />
                        <span>{language === "de" ? "Zertifikat & CV-Export" : "Verified CV & Certificate"}</span>
                      </button>
                    </>
                  )}

                  {role === "author" && (
                    <>
                      <button 
                        type="button"
                        onClick={() => setActiveAuthorTab("submissions")}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 text-sm rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeAuthorTab === "submissions"
                            ? "bg-slate-100 dark:bg-[#1e2027] text-[#0b99ff] dark:text-sky-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1e2027]"
                        }`}
                      >
                        <FileText className="h-4 w-4" />
                        {language === "de" ? "Einreichungs-Manager" : "Submission Manager"}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setActiveAuthorTab("scorecard")}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 text-sm rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeAuthorTab === "scorecard"
                            ? "bg-slate-100 dark:bg-[#1e2027] text-[#0b99ff] dark:text-sky-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1e2027]"
                        }`}
                      >
                        <CheckSquare className="h-4 w-4" />
                        {language === "de" ? "Bereitschafts-Scorecard" : "Readiness Scorecard"}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setActiveAuthorTab("plagiarism")}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 text-sm rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeAuthorTab === "plagiarism"
                            ? "bg-slate-100 dark:bg-[#1e2027] text-[#0b99ff] dark:text-sky-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1e2027]"
                        }`}
                      >
                        <ShieldCheck className="h-4 w-4" />
                        {language === "de" ? "KI- & Plagiatsprüfung" : "AI & Plagiarism Scan"}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setActiveAuthorTab("recognition")}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 text-sm rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeAuthorTab === "recognition"
                            ? "bg-slate-100 dark:bg-[#1e2027] text-[#0b99ff] dark:text-sky-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1e2027]"
                        }`}
                      >
                        <Award className="h-4 w-4" />
                        {language === "de" ? "Erlasse & Abzeichen" : "Waivers & Badges"}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setActiveAuthorTab("career")}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 text-sm rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeAuthorTab === "career"
                            ? "bg-slate-100 dark:bg-[#1e2027] text-[#0b99ff] dark:text-sky-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1e2027]"
                        }`}
                      >
                        <TrendingUp className="h-4 w-4" />
                        {language === "de" ? "Karriere-Dashboard" : "Career Dashboard"}
                      </button>
                    </>
                  )}

                  {role === "jm" && (
                    <>
                      <button 
                        type="button"
                        onClick={() => setActiveJmTab("board")}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 text-sm rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeJmTab === "board"
                            ? "bg-slate-100 dark:bg-[#1e2027] text-[#0b99ff] dark:text-sky-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1e2027]"
                        }`}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        {language === "de" ? "Journal-Manager" : "Journal Manager"}
                      </button>

                      <button 
                        type="button"
                        onClick={() => setActiveJmTab("moderation")}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 text-sm rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeJmTab === "moderation"
                            ? "bg-slate-100 dark:bg-[#1e2027] text-[#0b99ff] dark:text-sky-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1e2027]"
                        }`}
                      >
                        <MessageSquareOff className="h-4 w-4" />
                        {language === "de" ? "Gutachten-Moderation" : "Comment Moderation"}
                      </button>

                      <button 
                        type="button"
                        onClick={() => setActiveJmTab("users")}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 text-sm rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeJmTab === "users"
                            ? "bg-slate-100 dark:bg-[#1e2027] text-[#0b99ff] dark:text-sky-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1e2027]"
                        }`}
                      >
                        <Users className="h-4 w-4" />
                        {language === "de" ? "Gutachter-Registry & Last" : "Reviewer Registry"}
                      </button>

                      <button 
                        type="button"
                        onClick={() => setActiveJmTab("checks")}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 text-sm rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeJmTab === "checks"
                            ? "bg-slate-100 dark:bg-[#1e2027] text-[#0b99ff] dark:text-sky-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1e2027]"
                        }`}
                      >
                        <CheckSquare className="h-4 w-4" />
                        {language === "de" ? "Publikationsprüfungen & DOI" : "Publishing & DOI Dispatch"}
                      </button>

                      <button 
                        type="button"
                        onClick={() => setActiveJmTab("analytics")}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 text-sm rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeJmTab === "analytics"
                            ? "bg-slate-100 dark:bg-[#1e2027] text-[#0b99ff] dark:text-sky-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1e2027]"
                        }`}
                      >
                        <BarChart3 className="h-4 w-4" />
                        {language === "de" ? "Portfolio-Analysen" : "Portfolio Analytics"}
                      </button>

                      <button 
                        type="button"
                        onClick={() => setActiveJmTab("archives")}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 text-sm rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeJmTab === "archives"
                            ? "bg-slate-100 dark:bg-[#1e2027] text-[#0b99ff] dark:text-sky-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1e2027]"
                        }`}
                      >
                        <Archive className="h-4 w-4" />
                        {language === "de" ? "Kommunikations-Archive" : "Audit Archives"}
                      </button>
                    </>
                  )}

                  {role === "editor" && (
                    <>
                      <button 
                        type="button"
                        onClick={() => setActiveEditorTab("desk")}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 text-sm rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeEditorTab === "desk"
                            ? "bg-slate-100 dark:bg-[#1e2027] text-[#0b99ff] dark:text-sky-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1e2027]"
                        }`}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        {language === "de" ? "Redaktionstisch & Pipeline" : "Editorial Desk & Pipeline"}
                      </button>

                      <button 
                        type="button"
                        onClick={() => setActiveEditorTab("tracker")}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 text-sm rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeEditorTab === "tracker"
                            ? "bg-slate-100 dark:bg-[#1e2027] text-[#0b99ff] dark:text-sky-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1e2027]"
                        }`}
                      >
                        <Clock className="h-4 w-4" />
                        {language === "de" ? "Gutachten-Tracking" : "Reviewer Progress"}
                      </button>

                      <button 
                        type="button"
                        onClick={() => setActiveEditorTab("decision")}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 text-sm rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeEditorTab === "decision"
                            ? "bg-slate-100 dark:bg-[#1e2027] text-[#0b99ff] dark:text-sky-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1e2027]"
                        }`}
                      >
                        <CheckSquare className="h-4 w-4" />
                        {language === "de" ? "Entscheidungszentrum" : "Decision Central"}
                      </button>

                      <button 
                        type="button"
                        onClick={() => setActiveEditorTab("analytics")}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 text-sm rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeEditorTab === "analytics"
                            ? "bg-slate-100 dark:bg-[#1e2027] text-[#0b99ff] dark:text-sky-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1e2027]"
                        }`}
                      >
                        <Award className="h-4 w-4" />
                        {language === "de" ? "Redaktionsmetriken & Impact" : "Editorial Impact & Metrics"}
                      </button>

                      <button 
                        type="button"
                        onClick={() => setActiveEditorTab("integrity")}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 text-sm rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeEditorTab === "integrity"
                            ? "bg-slate-100 dark:bg-[#1e2027] text-[#0b99ff] dark:text-sky-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1e2027]"
                        }`}
                      >
                        <ShieldCheck className="h-4 w-4" />
                        {language === "de" ? "Integrität & Forensik" : "Integrity & Forensics"}
                      </button>

                      <button 
                        type="button"
                        onClick={() => setActiveEditorTab("collections")}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 text-sm rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeEditorTab === "collections"
                            ? "bg-slate-100 dark:bg-[#1e2027] text-[#0b99ff] dark:text-sky-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1e2027]"
                        }`}
                      >
                        <BookOpen className="h-4 w-4" />
                        {language === "de" ? "Sonderhefte" : "Special Collections"}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="pt-4 border-t border-slate-200 dark:border-[#272832]">
                <div className="flex items-center gap-2 px-1 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                  <span>Editorial360 v4.2</span>
                </div>
              </div>
            </aside>

            {/* Main scrollable body workspace content */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-100/50 dark:bg-[#121316] transition-colors">
              <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-300">
                
                {/* Banner Status Header (Admin Only) */}
                {role === "admin" && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-[#272832] pb-3">
                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        {language === "de" ? "Admin-Konsole" : "Admin Console"}
                      </h2>
                    </div>

                    {/* Header Actions */}
                    <div className="flex items-center gap-3">
                      <Button 
                        onClick={() => setIsInviteUserOpen(true)}
                        className="bg-[#0b99ff] hover:bg-[#0b8ceb] text-white font-bold flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm cursor-pointer text-xs"
                      >
                        <UserPlus className="h-4 w-4" />
                        Invite Workspace User
                      </Button>
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* A. ROLE DASHBOARD DETAILS DISPLAY PANEL                   */}
                {/* ========================================================= */}

                {/* ================= 1. JOURNAL MANAGER (JM) ================= */}
                {role === "jm" && (
                  <JournalManagerWorkspace
                    language={language}
                    activeTab={activeJmTab}
                    onTabChange={setActiveJmTab}
                    manuscripts={manuscripts as any}
                    onUpdateManuscriptStatus={(id, st) => {
                      setManuscripts(prev => prev.map(m => m.id === id ? { ...m, status: st as any } : m))
                    }}
                    onAssignEditor={(id, ed) => {
                      setManuscripts(prev => prev.map(m => m.id === id ? { ...m, assignedEditorName: ed.split(" (")[0], editorAssigned: true } : m))
                    }}
                    reviews={reviews as any}
                    onReleaseComments={(revId, sanitizedText) => {
                      setReviews(prev => prev.map(r => r.id === revId ? { ...r, status: "Released", sanitizedCommentsAuthor: sanitizedText } : r))
                    }}
                    archiveLogs={archiveLogs as any}
                    user={{
                      name: jmFullName,
                      role: jmStaffRole,
                      email: jmDeskEmail,
                      office: jmOfficeLocation,
                      country: profCountry,
                      photoUrl: profPhotoUrl
                    }}
                  />
                )}

                {/* ================= 2. EDITOR WORKSPACE ================= */}
                {role === "editor" && (
                  <EditorWorkspace
                    language={language}
                    activeTab={activeEditorTab}
                    onTabChange={setActiveEditorTab}
                    manuscripts={manuscripts as any}
                    onUpdateManuscriptStatus={(id, st) => {
                      setManuscripts(prev => prev.map(m => m.id === id ? { ...m, status: st as any } : m))
                    }}
                    user={{
                      name: editorName,
                      title: editorRank,
                      email: editorEmail,
                      journal: editorJournal,
                      institution: editorInstitution,
                      country: editorCountry,
                      photoUrl: editorPhotoUrl
                    }}
                  />
                )}

                {/* ================= 3. REVIEWER WORKSPACE ================= */}
                {role === "reviewer" && (
                  <ReviewerWorkspace
                    language={language}
                    user={{
                      name: regName || (email.includes("reviewer") ? "Dr. Marcus Vance" : (regName || "Dr. Marcus Vance")),
                      email: email || regEmail || "m.vance@university-charite.de",
                      orcid: regOrcid || (email.includes("reviewer") ? "0000-0004-7711-2093" : ""),
                      institution: "Charité – Universitätsmedizin Berlin"
                    }}
                    reviewInvitations={reviewInvitations}
                    activeReviews={activeReviews}
                    activeTab={activeReviewerTab}
                    onTabChange={setActiveReviewerTab}
                    onAcceptInvitation={handleAcceptReviewInvitation}
                    onDeclineInvitation={handleDeclineReviewInvitation}
                    onSubmitScorecard={handleSubmitReviewScorecard}
                  />
                )}

                {/* ================= 4. AUTHOR WORKSPACE ================= */}
                {role === "author" && (() => {
                  const isDe = language === "de"
                  // Deduplicate manuscripts array by ID and Title to guarantee clean unique list
                  const uniqueManuscripts = Array.from(
                    new Map(manuscripts.map(m => [m.id ? m.id : m.title, m])).values()
                  )

                  const translateStatus = (st: string) => {
                    if (!isDe) return st
                    switch (st) {
                      case "Accepted": return "Angenommen"
                      case "Revision Required": return "Überarbeitung erforderlich"
                      case "Under Review": return "In Begutachtung"
                      case "Awaiting Initial Check": return "Wartet auf Erstprüfung"
                      case "With Editor": return "Beim Herausgeber"
                      default: return st
                    }
                  }

                  return (
                    <div className="space-y-6">
                      {/* Unverified ORCID Notice Banner (Tiered Gatekeeping) */}
                      {!isOrcidVerified && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 shadow-2xs">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                              <AlertCircle className="h-5 w-5" />
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                {isDe ? "ORCID-Verifizierung ausstehend" : "ORCID Verification Pending"}
                              </h4>
                              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                                {isDe 
                                  ? "Ihr Konto ist aktiv mit vorläufigen Einreichungsrechten. Authentifizieren Sie Ihre ORCID iD für die automatische Crossref DOI-Indexierung." 
                                  : "Your account is active with provisional submission rights. Authenticate your ORCID iD to enable 1-click Crossref DOI indexing."}
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={() => {
                              setIsOrcidVerified(true)
                              setSuccess(isDe ? "ORCID authentifiziert! Verifizierte Anmeldedaten mit Crossref Registry verknüpft." : "ORCID authenticated! Verified credentials linked with Crossref Registry.")
                            }}
                            className="bg-[#A6CE39] hover:bg-[#95bc2f] text-white font-bold text-xs px-3.5 py-1.5 h-auto rounded-lg shadow-xs shrink-0 cursor-pointer flex items-center gap-1.5"
                          >
                            <span className="font-mono text-[10px] bg-black/20 px-1 rounded">iD</span>
                            {isDe ? "ORCID authentifizieren" : "Authenticate ORCID"}
                          </Button>
                        </div>
                      )}

                      {/* ========================================================================= */}
                      {/* UPWORK-INSPIRED AUTHOR DASHBOARD HERO & WORKSPACE                         */}
                      {/* ========================================================================= */}

                      {/* ========================================================================= */}
                      {/* BESPOKE AUTHOR DASHBOARD HERO & WORKSPACE                                 */}
                      {/* ========================================================================= */}

                      {/* 1. Welcoming Hero Banner — Clean Academic Editorial Header */}
                      <div className="p-6 rounded-2xl bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] shadow-xs relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0b99ff] via-sky-400 to-[#0077cc]" />
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#0b99ff] dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-1 rounded-md border border-sky-200/70 dark:border-sky-800/60">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#0b99ff]" />
                                {isDe ? "Autoren-Arbeitsbereich" : "Author Workspace"}
                              </span>
                              <span className="text-xs font-normal text-slate-400 dark:text-slate-500">
                                · {new Date().toLocaleDateString(isDe ? "de-DE" : "en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                              {isDe ? `Willkommen, ${profFullName}` : `Welcome, ${profFullName}`}
                            </h2>
                            <p className="text-sm font-normal text-slate-500 dark:text-slate-400">
                              {isDe 
                                ? "Verwalten Sie Ihre Einreichungen, verfolgen Sie Peer-Reviews und synchronisieren Sie Ihre ORCID-Publikationsakte." 
                                : "Manage submissions, track peer evaluations in real-time, and monitor publication milestones."}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                            <Button
                              onClick={() => setIsSubmitWizardOpen(true)}
                              className="bg-[#0b99ff] hover:bg-[#0077cc] text-white font-semibold text-sm px-4 py-2.5 h-auto rounded-xl shadow-xs cursor-pointer flex items-center gap-2 transition-all"
                            >
                              <Plus className="h-4 w-4" />
                              <span>{isDe ? "Manuskript einreichen" : "Submit Manuscript"}</span>
                            </Button>
                            <button
                              type="button"
                              onClick={() => setIsBadgeModalOpen(true)}
                              className="bg-slate-50 hover:bg-slate-100 dark:bg-[#20222a] dark:hover:bg-[#272935] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#272832] font-semibold text-sm px-4 py-2.5 rounded-xl cursor-pointer transition-colors shadow-2xs flex items-center gap-2"
                            >
                              <Award className="h-4 w-4 text-[#0b99ff]" />
                              <span>{isDe ? "Waiver & Badges" : "Waiver & Badges"}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* 2. Overview Tab: Unified Metrics Bar, Horizontal Overview & Full-Width Submissions */}
                      {(activeAuthorTab === "dashboard" || activeAuthorTab === "submissions") && (
                        <div className="space-y-6">
                          
                          {/* 1. Unified 4-Segment Metric Bar (1 Single Sleek Console Box) */}
                          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] shadow-xs">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-[#272832]">
                              
                              {/* 1. Submissions */}
                              <div className="space-y-1 sm:pr-4 pb-3 sm:pb-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                                    {isDe ? "Einreichungen" : "Submissions"}
                                  </span>
                                  <FileText className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                                </div>
                                <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white tabular-nums">
                                  {uniqueManuscripts.length}
                                </div>
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
                                  {uniqueManuscripts.filter(m => m.status === "Accepted").length} {isDe ? "veröffentlicht" : "published"}
                                </span>
                              </div>

                              {/* 2. Under Review */}
                              <div className="space-y-1 sm:px-4 pb-3 sm:pb-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                                    {isDe ? "In Prüfung" : "Under Review"}
                                  </span>
                                  <Clock className="h-4 w-4 text-[#0b99ff]" />
                                </div>
                                <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white tabular-nums">
                                  {uniqueManuscripts.filter(m => m.status.includes("Review") || m.status === "Awaiting Initial Check").length}
                                </div>
                                <span className="text-xs font-semibold text-[#0b99ff] dark:text-sky-400 block">
                                  {isDe ? "In Begutachtung" : "In peer evaluation"}
                                </span>
                              </div>

                              {/* 3. Revisions */}
                              <div className="space-y-1 sm:px-4 pt-3 sm:pt-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                                    {isDe ? "Überarbeitung" : "Revisions"}
                                  </span>
                                  <AlertCircle className="h-4 w-4 text-amber-500" />
                                </div>
                                <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white tabular-nums">
                                  {uniqueManuscripts.filter(m => m.status === "Revision Required").length}
                                </div>
                                <span className={`text-xs font-semibold block ${uniqueManuscripts.filter(m => m.status === "Revision Required").length > 0 ? "text-amber-600 dark:text-amber-400" : "text-slate-500"}`}>
                                  {uniqueManuscripts.filter(m => m.status === "Revision Required").length > 0 ? (isDe ? "Aktion nötig" : "Action required") : (isDe ? "Keine ausstehend" : "None pending")}
                                </span>
                              </div>

                              {/* 4. APC Waiver */}
                              <div className="space-y-1 sm:pl-4 pt-3 sm:pt-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                                    {isDe ? "APC-Erlass" : "APC Waiver"}
                                  </span>
                                  <Check className="h-4 w-4 text-emerald-500" />
                                </div>
                                <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white tabular-nums">
                                  25%
                                </div>
                                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block">
                                  {isDe ? "Stufe 2 aktiv" : "Tier 2 active"}
                                </span>
                              </div>

                            </div>
                          </div>

                          {/* 2. Horizontal 3-Card Overview Grid (Profile, Credits, Readiness) */}
                          {activeAuthorTab === "dashboard" && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                              
                              {/* 1. Author Profile Card */}
                              <Card className="bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] p-5 shadow-xs flex flex-col justify-between">
                                <div className="space-y-3.5">
                                  <div className="flex items-start gap-3.5">
                                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black dark:bg-zinc-900 text-white font-bold text-sm uppercase overflow-hidden shadow-2xs mt-0.5 ring-2 ring-slate-200/80 dark:ring-[#272832]">
                                      {profPhotoUrl ? (
                                        <img src={profPhotoUrl} alt="Avatar" className="w-full h-full object-cover" />
                                      ) : (
                                        <span>{profFullName ? profFullName.replace(/^Dr\.\s*/i, '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : "EV"}</span>
                                      )}
                                    </div>
                                    <div className="min-w-0 flex-1 space-y-0.5">
                                      <div className="flex items-center justify-between">
                                        <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white truncate">
                                          {profFullName}
                                        </h3>
                                        <button
                                          type="button"
                                          onClick={() => setIsAuthorProfileSetupOpen(true)}
                                          className="text-xs font-semibold text-[#0b99ff] hover:text-[#0077cc] cursor-pointer ml-1 shrink-0 transition-colors"
                                        >
                                          {isDe ? "Bearbeiten" : "Edit"}
                                        </button>
                                      </div>
                                      <p className="text-xs font-normal text-slate-500 dark:text-slate-400">
                                        {profRank}
                                      </p>
                                      <p className="text-xs font-normal text-slate-700 dark:text-slate-300 leading-snug break-words pt-0.5" title={`${profInstitution}, ${profCountry}`}>
                                        {profInstitution}
                                      </p>
                                      <p className="text-[11px] font-normal text-slate-400 dark:text-slate-500">
                                        {profCountry}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Research Specializations */}
                                  {profSpecialization && (
                                    <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-[#272832]">
                                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                                        {isDe ? "Forschungsschwerpunkte" : "Research Topics"}
                                      </span>
                                      <div className="flex flex-wrap gap-1.5">
                                        {profSpecialization.split(',').map((topic, i) => (
                                          <span 
                                            key={i} 
                                            className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#131418] text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-[#272832]"
                                          >
                                            {topic.trim()}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Profile Completeness */}
                                <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-[#131418] border border-slate-100 dark:border-[#272832] space-y-2 mt-3">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="font-medium text-slate-700 dark:text-slate-300">
                                      {isDe ? "Profil-Vollständigkeit" : "Profile Completeness"}
                                    </span>
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">100%</span>
                                  </div>
                                  <div className="w-full bg-slate-200/80 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-emerald-500 h-full w-full rounded-full" />
                                  </div>
                                  <div className="flex items-center justify-between pt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                                    <span className="font-normal">
                                      {isDe ? "Autorenakte verifiziert" : "Academic record verified"}
                                    </span>
                                    <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                      <CheckCircle2 className="h-3.5 w-3.5" />
                                      {isDe ? "Verifiziert" : "Verified"}
                                    </span>
                                  </div>
                                </div>
                              </Card>

                              {/* 2. Publication Credits & Waiver */}
                              <Card className="bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] p-5 shadow-xs flex flex-col justify-between">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#272832] pb-2.5">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                                      {isDe ? "Publikations-Credits" : "Publication Credits"}
                                    </h3>
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200/70 dark:border-emerald-800/60">
                                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                                      Tier 2 Active
                                    </span>
                                  </div>

                                  <div className="space-y-2 text-xs">
                                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/70 dark:bg-[#131418] border border-slate-100 dark:border-[#272832]">
                                      <span className="font-normal text-slate-600 dark:text-slate-400">
                                        {isDe ? "APC-Rabatt (Waiver)" : "APC Waiver Grant"}
                                      </span>
                                      <span className="font-bold text-[#0b99ff] tabular-nums text-sm">25%</span>
                                    </div>

                                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/70 dark:bg-[#131418] border border-slate-100 dark:border-[#272832]">
                                      <span className="font-normal text-slate-600 dark:text-slate-400">
                                        {isDe ? "Abgeschlossene Gutachten" : "Reviews Completed"}
                                      </span>
                                      <span className="font-bold text-slate-900 dark:text-white tabular-nums text-sm">12</span>
                                    </div>

                                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/70 dark:bg-[#131418] border border-slate-100 dark:border-[#272832]">
                                      <span className="font-normal text-slate-600 dark:text-slate-400">
                                        {isDe ? "Ø Bearbeitungszeit" : "Avg. Turnaround"}
                                      </span>
                                      <span className="font-bold text-slate-900 dark:text-white tabular-nums text-sm">4.5 {isDe ? "Tage" : "Days"}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="pt-3 border-t border-slate-100 dark:border-[#272832]">
                                  <button
                                    onClick={() => setIsBadgeModalOpen(true)}
                                    className="w-full text-center text-xs font-semibold text-[#0b99ff] hover:underline cursor-pointer py-1 flex items-center justify-center gap-1"
                                  >
                                    <span>{isDe ? "Erlass-Richtlinien & Stufen" : "View Waiver Policy & Tiers"}</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </Card>

                              {/* 3. Submission Readiness Card */}
                              <Card className="bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] p-5 shadow-xs flex flex-col justify-between">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#272832] pb-2.5">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                                      <CheckSquare className="h-4 w-4 text-[#0b99ff]" />
                                      <span>{isDe ? "Einreichungs-Bereitschaft" : "Submission Readiness"}</span>
                                    </h3>
                                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200/70 dark:border-emerald-800/60 tabular-nums">
                                      80% Ready
                                    </span>
                                  </div>

                                  <div className="space-y-2 text-xs">
                                    <div className="p-2.5 rounded-lg bg-slate-50/70 dark:bg-[#131418] border border-slate-100 dark:border-[#272832] flex items-center justify-between">
                                      <span className="font-medium text-slate-700 dark:text-slate-300">
                                        {isDe ? "Autorenschaft & ORCID" : "Authorship & ORCIDs"}
                                      </span>
                                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    </div>

                                    <div className="p-2.5 rounded-lg bg-slate-50/70 dark:bg-[#131418] border border-slate-100 dark:border-[#272832] flex items-center justify-between">
                                      <span className="font-medium text-slate-700 dark:text-slate-300">
                                        {isDe ? "Ethik & Interessenkonflikte" : "Ethics & COI Disclosure"}
                                      </span>
                                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    </div>

                                    <div className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/40 flex items-center justify-between">
                                      <span className="font-medium text-amber-900 dark:text-amber-200">
                                        {isDe ? "Grafiken (300 DPI Vektor)" : "Figures (300 DPI Vector)"}
                                      </span>
                                      <span className="h-4 w-4 rounded-full bg-amber-200/80 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-bold text-[10px] flex items-center justify-center">!</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="pt-3 border-t border-slate-100 dark:border-[#272832]">
                                  <button
                                    onClick={() => setActiveAuthorTab("scorecard")}
                                    className="w-full text-center text-xs font-semibold text-[#0b99ff] hover:underline cursor-pointer py-1 flex items-center justify-center gap-1"
                                  >
                                    <span>{isDe ? "Vollständige Scorecard öffnen" : "Open Full Readiness Scorecard"}</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </Card>

                            </div>
                          )}

                          {/* 3. Full-Width Submissions Manager Panel */}
                          <Card className="bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] overflow-hidden shadow-xs w-full">
                            
                            {/* Responsive Tab Strip */}
                            <div className="border-b border-slate-200 dark:border-[#272832] px-4 sm:px-6 pt-3 bg-slate-50/70 dark:bg-[#14151a]">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-1.5 overflow-x-auto min-w-0 flex-1 [scrollbar-width:none]">
                                  {[
                                    { id: "all", label: isDe ? "Alle Einreichungen" : "All Submissions", count: uniqueManuscripts.length },
                                    { id: "under_review", label: isDe ? "In Begutachtung" : "Under Review", count: uniqueManuscripts.filter(m => m.status.includes("Review") || m.status === "Awaiting Initial Check").length },
                                    { id: "revision_required", label: isDe ? "Revision nötig" : "Revisions", count: uniqueManuscripts.filter(m => m.status === "Revision Required").length },
                                    { id: "accepted", label: isDe ? "Angenommen" : "Accepted", count: uniqueManuscripts.filter(m => m.status === "Accepted").length },
                                  ].map((tab) => {
                                    const isActive = authorFilter === tab.id
                                    return (
                                      <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setAuthorFilter(tab.id as any)}
                                        className={`pb-2.5 px-3.5 text-sm whitespace-nowrap shrink-0 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                                          isActive
                                            ? "border-[#0b99ff] font-semibold text-slate-900 dark:text-white"
                                            : "border-transparent font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                                        }`}
                                      >
                                        <span>{tab.label}</span>
                                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold tabular-nums ${
                                          isActive 
                                            ? "bg-[#0b99ff]/10 text-[#0b99ff] dark:text-sky-400 border border-[#0b99ff]/20" 
                                            : "bg-slate-200/70 dark:bg-[#20222a] text-slate-600 dark:text-slate-400"
                                        }`}>
                                          {tab.count}
                                        </span>
                                      </button>
                                    )
                                  })}
                                </div>

                                {/* View Switcher: Feed vs Table */}
                                <div className="flex items-center gap-1.5 pb-2.5 self-end sm:self-auto">
                                  <div className="flex items-center p-0.5 rounded-lg bg-slate-200/80 dark:bg-[#20222a] border border-slate-200/50 dark:border-[#272832]">
                                    <button
                                      type="button"
                                      onClick={() => setAuthorSubView("feed")}
                                      className={`px-3 py-1.5 rounded-md text-xs transition-all cursor-pointer ${
                                        authorSubView === "feed"
                                          ? "bg-white dark:bg-[#18191e] font-semibold text-slate-900 dark:text-white shadow-2xs"
                                          : "font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                      }`}
                                    >
                                      {isDe ? "Karten" : "Cards"}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setAuthorSubView("table")}
                                      className={`px-3 py-1.5 rounded-md text-xs transition-all cursor-pointer ${
                                        authorSubView === "table"
                                          ? "bg-white dark:bg-[#18191e] font-semibold text-slate-900 dark:text-white shadow-2xs"
                                          : "font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                      }`}
                                    >
                                      {isDe ? "Tabelle" : "Table"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Search Input */}
                            <div className="p-4 border-b border-slate-100 dark:border-[#272832] bg-white dark:bg-[#18191e]">
                              <div className="relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                  type="text"
                                  value={authorSearchTerm}
                                  onChange={(e) => setAuthorSearchTerm(e.target.value)}
                                  placeholder={isDe ? "Nach Manuskripttitel, Fachzeitschrift oder ID suchen..." : "Search by manuscript title, journal, or submission ID..."}
                                  className="w-full pl-10 pr-8 py-2.5 text-sm font-normal rounded-xl border border-slate-200 dark:border-[#272832] bg-slate-50/70 dark:bg-[#131418] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0b99ff] focus:border-[#0b99ff] transition-all"
                                />
                                {authorSearchTerm && (
                                  <button 
                                    onClick={() => setAuthorSearchTerm("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Author Submission Stream (Feed vs Table) */}
                            {(() => {
                              const filteredManuscripts = uniqueManuscripts.filter(m => {
                                const matchesFilter = 
                                  authorFilter === "all" ? true :
                                  authorFilter === "under_review" ? (m.status.includes("Review") || m.status === "Awaiting Initial Check") :
                                  authorFilter === "revision_required" ? (m.status === "Revision Required") :
                                  authorFilter === "accepted" ? (m.status === "Accepted") : true

                                const matchesSearch = 
                                  m.title.toLowerCase().includes(authorSearchTerm.toLowerCase()) ||
                                  m.journal.toLowerCase().includes(authorSearchTerm.toLowerCase()) ||
                                  m.id.toLowerCase().includes(authorSearchTerm.toLowerCase())

                                return matchesFilter && matchesSearch
                              })

                              const pageSize = 10
                              const totalItems = filteredManuscripts.length
                              const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
                              const safeCurrentPage = Math.min(Math.max(1, authorCurrentPage), totalPages)
                              const startIndex = (safeCurrentPage - 1) * pageSize
                              const paginatedManuscripts = filteredManuscripts.slice(startIndex, startIndex + pageSize)

                              return (
                                <div>
                                  {filteredManuscripts.length === 0 ? (
                                    <div className="p-12 text-center space-y-3">
                                      <FileText className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
                                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        {isDe ? "Keine Manuskripte in dieser Kategorie gefunden." : "No manuscripts found matching your criteria."}
                                      </p>
                                    </div>
                                  ) : authorSubView === "feed" ? (
                                    <div className="divide-y divide-slate-100 dark:divide-[#272832]">
                                      {paginatedManuscripts.map((m) => {
                                        const isAccepted = m.status === "Accepted"
                                        const isRevision = m.status === "Revision Required"
                                        const isReview = m.status.includes("Review") || m.status === "Awaiting Initial Check"

                                        return (
                                          <div 
                                            key={m.id}
                                            className="p-5 hover:bg-slate-50/60 dark:hover:bg-[#1e2027]/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                          >
                                            <div className="space-y-1.5 min-w-0 flex-1">
                                              <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-xs font-semibold tabular-nums px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#131418] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#272832]">
                                                  {m.id}
                                                </span>
                                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                                  {m.journal} · {m.date}
                                                </span>
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-medium border ${
                                                  isAccepted ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60" :
                                                  isRevision ? "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60" :
                                                  isReview ? "bg-sky-50 dark:bg-sky-950/50 text-[#0b99ff] dark:text-sky-300 border-sky-200/80 dark:border-sky-800/60" :
                                                  "bg-slate-100 dark:bg-[#15161b] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#272832]"
                                                }`}>
                                                  <span className={`h-1.5 w-1.5 rounded-full ${
                                                    isAccepted ? "bg-emerald-500" :
                                                    isRevision ? "bg-amber-500" :
                                                    isReview ? "bg-[#0b99ff]" : "bg-slate-400"
                                                  }`} />
                                                  {translateStatus(m.status)}
                                                </span>
                                              </div>
                                              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                                                {m.title}
                                              </h4>
                                              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                                                {m.abstract}
                                              </p>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                              {isRevision ? (
                                                <Button
                                                  onClick={() => {
                                                    setRevisionPaperId(m.id)
                                                    setIsRevisionDialogOpen(true)
                                                  }}
                                                  className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs px-4 py-2 rounded-xl cursor-pointer shadow-2xs transition-colors flex items-center gap-1.5"
                                                >
                                                  <Upload className="h-3.5 w-3.5" />
                                                  <span>{isDe ? "Revision einreichen" : "Submit Revision"}</span>
                                                </Button>
                                              ) : (
                                                <Button
                                                  onClick={() => {
                                                    setSelectedManuscriptDetails(m)
                                                    setIsManuscriptDetailsOpen(true)
                                                  }}
                                                  variant="outline"
                                                  className="border border-slate-200 dark:border-[#272832] bg-white dark:bg-[#18191e] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#23252e] hover:text-slate-900 dark:hover:text-white font-semibold text-xs px-4 py-2 rounded-xl cursor-pointer transition-colors shadow-2xs flex items-center gap-1.5"
                                                >
                                                  <Eye className="h-3.5 w-3.5" />
                                                  <span>{isDe ? "Dossier ansehen" : "View Dossier"}</span>
                                                </Button>
                                              )}
                                            </div>
                                          </div>
                                        )
                                      })}
                                    </div>
                                  ) : (
                                    /* Table View */
                                    <div className="overflow-x-auto">
                                      <table className="w-full text-left border-collapse">
                                        <thead>
                                          <tr className="border-b border-slate-200 dark:border-[#272832] bg-slate-50/70 dark:bg-[#14151a] text-xs font-semibold text-slate-500 dark:text-slate-400">
                                            <th className="px-4 py-3 font-semibold">ID</th>
                                            <th className="px-4 py-3 font-semibold">Title</th>
                                            <th className="px-4 py-3 font-semibold">Journal</th>
                                            <th className="px-4 py-3 font-semibold">Status</th>
                                            <th className="px-4 py-3 font-semibold text-right">Action</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-[#272832] text-xs">
                                          {paginatedManuscripts.map((m) => {
                                            const isAccepted = m.status === "Accepted"
                                            const isRevision = m.status === "Revision Required"
                                            const isReview = m.status.includes("Review") || m.status === "Awaiting Initial Check"

                                            return (
                                              <tr 
                                                key={m.id}
                                                className="hover:bg-slate-50/60 dark:hover:bg-[#1e2027]/40 transition-colors"
                                              >
                                                <td className="px-4 py-3.5 whitespace-nowrap font-semibold tabular-nums text-slate-900 dark:text-white">
                                                  {m.id}
                                                </td>
                                                <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-white max-w-xs md:max-w-md lg:max-w-lg">
                                                  <div className="line-clamp-1" title={m.title}>
                                                    {m.title}
                                                  </div>
                                                </td>
                                                <td className="px-4 py-3.5 font-normal text-sm text-slate-600 dark:text-slate-400">
                                                  {m.journal}
                                                </td>
                                                <td className="px-4 py-3.5 whitespace-nowrap">
                                                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                                                    isAccepted ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60" :
                                                    isRevision ? "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60" :
                                                    isReview ? "bg-sky-50 dark:bg-sky-950/50 text-[#0b99ff] dark:text-sky-300 border-sky-200/80 dark:border-sky-800/60" :
                                                    "bg-slate-100 dark:bg-[#15161b] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#272832]"
                                                  }`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${
                                                      isAccepted ? "bg-emerald-500" :
                                                      isRevision ? "bg-amber-500" :
                                                      isReview ? "bg-[#0b99ff]" : "bg-slate-400"
                                                    }`} />
                                                    {translateStatus(m.status)}
                                                  </span>
                                                </td>
                                                <td className="px-4 py-3.5 text-right whitespace-nowrap">
                                                  {isRevision ? (
                                                    <button
                                                      type="button"
                                                      onClick={() => {
                                                        setRevisionPaperId(m.id)
                                                        setIsRevisionDialogOpen(true)
                                                      }}
                                                      className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg cursor-pointer shadow-2xs transition-colors"
                                                    >
                                                      {isDe ? "Überarbeiten" : "Revise"}
                                                    </button>
                                                  ) : (
                                                    <button 
                                                      type="button"
                                                      onClick={() => {
                                                        setSelectedManuscriptDetails(m)
                                                        setIsManuscriptDetailsOpen(true)
                                                      }}
                                                      className="inline-flex items-center justify-center border border-slate-200 dark:border-[#272832] bg-white dark:bg-[#18191e] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#23252e] hover:text-slate-900 dark:hover:text-white font-semibold text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors shadow-2xs"
                                                    >
                                                      {isDe ? "Details" : "View"}
                                                    </button>
                                                  )}
                                                </td>
                                              </tr>
                                            )
                                          })}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}

                                  {/* Pagination Footer (Bottom Right Controls) */}
                                  {totalItems > 10 && (
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-slate-100 dark:border-[#272832] bg-slate-50/50 dark:bg-[#131418] text-xs">
                                      <div className="font-normal text-slate-500 dark:text-slate-400">
                                        {isDe 
                                          ? `Zeige ${startIndex + 1}–${Math.min(startIndex + pageSize, totalItems)} von ${totalItems} Einreichungen`
                                          : `Showing ${startIndex + 1}–${Math.min(startIndex + pageSize, totalItems)} of ${totalItems} submissions`}
                                      </div>

                                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                                        <button
                                          type="button"
                                          disabled={safeCurrentPage === 1}
                                          onClick={() => setAuthorCurrentPage(prev => Math.max(1, prev - 1))}
                                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#272832] bg-white dark:bg-[#18191e] font-medium text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-[#20222a] transition-all cursor-pointer shadow-2xs"
                                          aria-label="Previous Page"
                                        >
                                          <ChevronLeft className="h-3.5 w-3.5" />
                                          <span>{isDe ? "Zurück" : "Prev"}</span>
                                        </button>

                                        {/* Page Numbers */}
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                          <button
                                            key={pageNum}
                                            type="button"
                                            onClick={() => setAuthorCurrentPage(pageNum)}
                                            className={`h-7 w-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                                              safeCurrentPage === pageNum
                                                ? "bg-[#0b99ff] text-white shadow-2xs"
                                                : "border border-slate-200 dark:border-[#272832] bg-white dark:bg-[#18191e] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#20222a]"
                                            }`}
                                          >
                                            {pageNum}
                                          </button>
                                        ))}

                                        <button
                                          type="button"
                                          disabled={safeCurrentPage === totalPages}
                                          onClick={() => setAuthorCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#272832] bg-white dark:bg-[#18191e] font-medium text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-[#20222a] transition-all cursor-pointer shadow-2xs"
                                          aria-label="Next Page"
                                        >
                                          <span>{isDe ? "Weiter" : "Next"}</span>
                                          <ChevronRight className="h-3.5 w-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )
                            })()}
                          </Card>

                        </div>
                      )}

                      {/* 2. READINESS SCORECARD TAB VIEW */}
                      {activeAuthorTab === "scorecard" && (
                        <Card className="bg-white dark:bg-[#18191e] border border-slate-200 dark:border-[#272832] p-6 space-y-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#272832] pb-4">
                            <div>
                              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <CheckSquare className="h-4 w-4 text-[#0b99ff] shrink-0" />
                                <span>{isDe ? "Bereitschafts-Scorecard vor Einreichung" : "Submission Readiness Scorecard"}</span>
                              </h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {isDe 
                                  ? "Automatische Konformitätsprüfung Ihres Manuskripts vor der redaktionellen Begutachtung." 
                                  : "Pre-submission manuscript compliance check before editorial review."}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-xs font-semibold px-3 py-1 rounded-full border whitespace-nowrap shrink-0 ${
                                isFigureFixed 
                                  ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200" 
                                  : "text-amber-600 bg-amber-50 dark:bg-amber-950/60 border-amber-200"
                              }`}>
                                {isFigureFixed 
                                  ? (isDe ? "5 / 5 Prüfpunkte bestanden (100% Bereit)" : "5 / 5 Checklist Items Passed (100% Ready)") 
                                  : (isDe ? "4 / 5 Prüfpunkte bestanden (80% Bereit)" : "4 / 5 Checklist Items Passed (80% Ready)")}
                              </span>
                            </div>
                          </div>

                          {/* Pre-Submission Draft File Upload Dropzone */}
                          <div className="space-y-3">
                            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                              {isDe ? "Entwurfsdatei für Vorabprüfung hochladen" : "Upload Draft File for Pre-Submission Audit"}
                            </h4>

                            <label className="border-2 border-dashed border-slate-300 dark:border-[#272832] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 dark:bg-[#131418] hover:bg-slate-100 dark:hover:bg-[#1e2027] transition-all text-center group">
                              <input 
                                type="file" 
                                onChange={handleScorecardFileUpload}
                                accept=".pdf,.docx,.doc,.tex,.zip"
                                className="hidden" 
                              />
                              <Upload className="h-8 w-8 text-[#0b99ff] mb-2 group-hover:scale-110 transition-transform" />
                              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                {scorecardFileName 
                                  ? (isDe ? `Hochgeladen: ${scorecardFileName}` : `Uploaded: ${scorecardFileName}`) 
                                  : (isDe ? "Klicken zum Durchsuchen oder Datei hierher ziehen (.pdf, .docx, .tex)" : "Click to Browse or Drag & Drop Manuscript File (.pdf, .docx, .tex)")}
                              </span>
                              <span className="text-[11px] text-slate-400 mt-1">
                                {isDe 
                                  ? "Führt automatische Prüfungen für Grafiken (300 DPI), Referenzen (APA7), Ethik und Metadaten durch." 
                                  : "Runs automated compliance check for figures (300 DPI), references (APA7), ethics, and metadata."}
                              </span>
                            </label>

                            {/* Live Audit Simulation Banner */}
                            {isAuditingScorecard && (
                              <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 space-y-2 animate-in fade-in">
                                <div className="flex items-center justify-between text-xs font-semibold text-[#0b99ff]">
                                  <span>
                                    {isDe ? "Prüfe Grafiken, Referenzen und Metadatenkonformität..." : "Auditing manuscript figures, references, and metadata compliance..."}
                                  </span>
                                  <span>{scorecardAuditProgress}%</span>
                                </div>
                                <div className="w-full bg-sky-200 dark:bg-sky-900 rounded-full h-1.5 overflow-hidden">
                                  <div className="bg-[#0b99ff] h-full transition-all duration-300 rounded-full" style={{ width: `${scorecardAuditProgress}%` }} />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Interactive Scorecard Checklist Items */}
                          <div className="space-y-4 pt-2">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                              {isDe ? "Automatisches Prüfprotokoll" : "Automated Checklist Audit Log"}
                            </h4>

                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-200 dark:border-[#272832] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                <div>
                                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                    {isDe ? "Autorenschaft & Affiliationen verifiziert" : "Authorship & Affiliations Verification"}
                                  </h4>
                                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                    {isDe ? "Alle Koautoren mit gültigen ORCID iDs und Institutionsangaben hinterlegt." : "All co-authors listed with valid ORCID IDs and institutional affiliations."}
                                  </p>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-lg shrink-0 whitespace-nowrap">
                                {isDe ? "Verifiziert" : "Verified"}
                              </span>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-200 dark:border-[#272832] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                <div>
                                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                    {isDe ? "Ethik- & Interessenkonflikt-Erklärung" : "Ethics & Conflict of Interest Statement"}
                                  </h4>
                                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                    {isDe ? "Referenznummer der Ethikkommissionsgenehmigung beigefügt." : "Ethics board approval reference number attached."}
                                  </p>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-lg shrink-0 whitespace-nowrap">
                                {isDe ? "Verifiziert" : "Verified"}
                              </span>
                            </div>

                            {/* Conditional Figure Quality Warning vs Verified */}
                            {isFigureFixed ? (
                              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-200 dark:border-[#272832] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                  <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                      {isDe ? "Grafik- & Tabellenqualitätsstandard" : "Figure & Table Quality Standard"}
                                    </h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                      {isDe ? "Hochauflösende Vektorgrafiken bestätigt (300 DPI Druckstandard konform)." : "High-resolution vector figures verified (300 DPI print standard compliant)."}
                                    </p>
                                  </div>
                                </div>
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-lg shrink-0 whitespace-nowrap">
                                  {isDe ? "Behoben & Verifiziert ✓" : "Fixed & Verified ✓"}
                                </span>
                              </div>
                            ) : (
                              <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                                  <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                      {isDe ? "Grafik- & Tabellenqualitätsstandard" : "Figure & Table Quality Standard"}
                                    </h4>
                                    <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">
                                      {isDe ? "Abbildung 2 hat eine Auflösung von 150 DPI (mindestens 300 DPI empfohlen)." : "Figure 2 resolution is 150 DPI (Minimum 300 DPI recommended for print production)."}
                                    </p>
                                  </div>
                                </div>
                                
                                {/* Direct File Upload Trigger */}
                                <label className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer shrink-0 whitespace-nowrap shadow-2xs transition-all">
                                  <Upload className="h-4 w-4" />
                                  <span>{isDe ? "300 DPI Grafik hochladen" : "Upload 300 DPI Figure"}</span>
                                  <input 
                                    type="file" 
                                    accept=".png,.tiff,.tif,.eps,.svg,.pdf,.jpg,.jpeg"
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        setIsFigureFixed(true)
                                      }
                                    }}
                                    className="hidden" 
                                  />
                                </label>
                              </div>
                            )}

                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-200 dark:border-[#272832] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                <div>
                                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                    {isDe ? "Datenverfügbarkeitserklärung" : "Data Availability Statement"}
                                  </h4>
                                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                    {isDe ? "Öffentlicher Repositorium-DOI für Begleitdaten hinterlegt." : "Public repository DOI provided for supporting dataset."}
                                  </p>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-lg shrink-0 whitespace-nowrap">
                                {isDe ? "Verifiziert" : "Verified"}
                              </span>
                            </div>
                          </div>
                        </Card>
                      )}

                      {/* 3. AI & PLAGIARISM SCAN TAB VIEW (CLEAN & MINIMALIST) */}
                      {activeAuthorTab === "plagiarism" && (() => {
                        const selectedPaper = uniqueManuscripts.find(m => m.id === selectedScanPaperId) || uniqueManuscripts[0] || {
                          id: "SOMED-26-RW101",
                          title: "Clinical Evaluation of AI-Driven Diagnostic Imaging in Cardiovascular Medicine",
                          journal: "Scholarly Open Medicine",
                        }

                        return (
                          <Card className="bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] p-5 sm:p-6 space-y-6 shadow-xs">
                            
                            {/* Header Toolbar */}
                            <div className="border-b border-slate-100 dark:border-[#272832] pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="space-y-1">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                  {isDe ? "KI- & Textähnlichkeitsprüfung" : "AI & Text Similarity Scan"}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  {isDe 
                                    ? "Integritätsaudit über Crossref Similarity Check & iThenticate Datenbanken." 
                                    : "Dual-engine screening powered by Crossref Similarity Check & iThenticate."}
                                </p>
                              </div>

                              <div className="flex flex-wrap items-center gap-2.5">
                                <select 
                                  value={selectedScanPaperId}
                                  onChange={(e) => {
                                    setSelectedScanPaperId(e.target.value)
                                    setScanCompletedSuccess(false)
                                  }}
                                  className="bg-slate-50 dark:bg-[#15161b] border border-slate-200 dark:border-[#272832] text-xs font-medium rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 outline-none max-w-xs cursor-pointer"
                                >
                                  {uniqueManuscripts.map(m => (
                                    <option key={m.id} value={m.id}>
                                      {m.id}: {m.title.slice(0, 32)}...
                                    </option>
                                  ))}
                                </select>

                                <Button 
                                  onClick={handleRunPlagiarismScan}
                                  disabled={isScanningPlagiarism}
                                  className="bg-[#0b99ff] hover:bg-[#0077cc] text-white text-xs font-semibold px-3.5 py-2 h-auto rounded-lg cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0 shadow-2xs"
                                >
                                  {isScanningPlagiarism 
                                    ? (isDe ? "Prüfe Text..." : "Scanning...") 
                                    : (isDe ? "Scan wiederholen" : "Run New Scan")}
                                </Button>
                              </div>
                            </div>

                            {/* Live Scanning Progress Overlay */}
                            {isScanningPlagiarism && (
                              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-200 dark:border-[#272832] space-y-2 animate-in fade-in">
                                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                                  <span>{isDe ? "Prüfe Manuskript gegen 120M+ Artikel..." : "Scanning manuscript against Crossref repository..."}</span>
                                  <span className="tabular-nums">{scanProgress}%</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                  <div className="bg-[#0b99ff] h-full transition-all duration-300 rounded-full" style={{ width: `${scanProgress}%` }} />
                                </div>
                              </div>
                            )}

                            {/* 1. Executive Summary & Refined Donut Visual */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#131418] border border-slate-100 dark:border-[#272832] grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                              
                              {/* Left: Sleek Minimalist Donut Ring */}
                              <div className="md:col-span-4 flex flex-col items-center justify-center">
                                <div className="relative h-28 w-28 flex items-center justify-center">
                                  <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                                    <circle cx="18" cy="18" r="13.5" fill="none" className="stroke-slate-200 dark:stroke-[#20222a]" strokeWidth="3.5" />
                                    {/* Text match arc (5.4%) */}
                                    <circle cx="18" cy="18" r="13.5" fill="none" className="stroke-[#0b99ff]" strokeWidth="3.5" strokeDasharray="6 94" strokeLinecap="round" />
                                    {/* AI Content arc (3.1%) */}
                                    <circle cx="18" cy="18" r="13.5" fill="none" className="stroke-sky-400" strokeWidth="3.5" strokeDasharray="4 96" strokeDashoffset="-8" strokeLinecap="round" />
                                  </svg>
                                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <span className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">5.4%</span>
                                    <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Overlap</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                                  <span className="flex items-center gap-1.5 font-medium">
                                    <span className="h-2 w-2 rounded-full bg-[#0b99ff]" /> {isDe ? "Text: 5.4%" : "Text Overlap (5.4%)"}
                                  </span>
                                  <span className="flex items-center gap-1.5 font-medium">
                                    <span className="h-2 w-2 rounded-full bg-sky-400" /> {isDe ? "KI: 3.1%" : "AI Synthesized (3.1%)"}
                                  </span>
                                </div>
                              </div>

                              {/* Right: 4 Clean KPI Stat Cards */}
                              <div className="md:col-span-8 grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-white dark:bg-[#18191e] border border-slate-200/80 dark:border-[#272832] space-y-0.5">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                    {isDe ? "Ähnlichkeitsindex" : "Similarity Score"}
                                  </span>
                                  <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tabular-nums">5.4%</div>
                                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium block">
                                    {isDe ? "Unter Schwellenwert (<15%)" : "Passed (<15% threshold)"}
                                  </span>
                                </div>

                                <div className="p-3 rounded-xl bg-white dark:bg-[#18191e] border border-slate-200/80 dark:border-[#272832] space-y-0.5">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                    {isDe ? "KI-Synthese" : "AI Content"}
                                  </span>
                                  <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tabular-nums">3.1%</div>
                                  <span className="text-[11px] text-slate-500 font-medium block">
                                    {isDe ? "Standard-Methodenwert" : "Typical methods baseline"}
                                  </span>
                                </div>

                                <div className="p-3 rounded-xl bg-white dark:bg-[#18191e] border border-slate-200/80 dark:border-[#272832] space-y-0.5">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                    {isDe ? "Quellenabgleich" : "Matched Sources"}
                                  </span>
                                  <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tabular-nums">3 Repositories</div>
                                  <span className="text-[11px] text-slate-500 font-medium block">
                                    PubMed, IEEE, arXiv
                                  </span>
                                </div>

                                <div className="p-3 rounded-xl bg-white dark:bg-[#18191e] border border-slate-200/80 dark:border-[#272832] space-y-0.5">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                    {isDe ? "Integritätsstatus" : "Integrity Status"}
                                  </span>
                                  <div className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400">Clean ✓</div>
                                  <span className="text-[11px] text-slate-400 font-medium block">
                                    COPE Guidelines Compliant
                                  </span>
                                </div>
                              </div>

                            </div>

                            {/* 2. Matched Sources Table */}
                            <div className="space-y-2 pt-1">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 block">
                                {isDe ? "Gefundene Quellenreferenzen" : "Matched Sources Breakdown"}
                              </span>

                              <div className="rounded-xl border border-slate-200/80 dark:border-[#272832] overflow-x-auto [scrollbar-width:thin]">
                                <table className="w-full min-w-[550px] text-left text-xs">
                                  <thead className="bg-slate-50 dark:bg-[#131418] text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200/80 dark:border-[#272832]">
                                    <tr>
                                      <th className="px-4 py-2.5">{isDe ? "Datenbankquelle" : "Source Repository"}</th>
                                      <th className="px-4 py-2.5">{isDe ? "Typ" : "Type"}</th>
                                      <th className="px-4 py-2.5">{isDe ? "Übereinstimmung" : "Overlap"}</th>
                                      <th className="px-4 py-2.5 text-right">{isDe ? "Klassifikation" : "Classification"}</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 dark:divide-[#272832] text-slate-700 dark:text-slate-300">
                                    <tr>
                                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">PubMed Central Open Access Repository</td>
                                      <td className="px-4 py-3 text-slate-500">Journal Article</td>
                                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">2.1%</td>
                                      <td className="px-4 py-3 text-right">
                                        <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-[#131418] px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-[#272832]">
                                          Permitted Reference
                                        </span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">IEEE Xplore Digital Library Database</td>
                                      <td className="px-4 py-3 text-slate-500">Conference Proceeding</td>
                                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">1.4%</td>
                                      <td className="px-4 py-3 text-right">
                                        <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-[#131418] px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-[#272832]">
                                          Citation Cited
                                        </span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">arXiv Preprints Server</td>
                                      <td className="px-4 py-3 text-slate-500">Author Preprint</td>
                                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">0.9%</td>
                                      <td className="px-4 py-3 text-right">
                                        <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-[#131418] px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-[#272832]">
                                          Author Self-Preprint
                                        </span>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* 3. Flagged Text Segments & Declaration (Clean & Compact) */}
                            <div className="space-y-3 pt-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 block">
                                    {isDe ? "Markierte Textstellen zur Autoren-Erklärung" : "Flagged Text Segments & Declarations"}
                                  </span>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    {isDe
                                      ? "Bestätigen Sie den Kontext markierter Sätze für den verantwortlichen Editor."
                                      : "Optional: Declare domain standard phrasing or prior preprint citation to the handling editor."}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setShowAnnotatedText(v => !v)}
                                  className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                                >
                                  {showAnnotatedText ? (isDe ? "Ausblenden" : "Collapse") : (isDe ? "Anzeigen" : "Expand Segments (5)")}
                                </button>
                              </div>

                              {showAnnotatedText && (
                                <div className="rounded-xl border border-slate-200/80 dark:border-[#272832] divide-y divide-slate-100 dark:divide-[#272832] overflow-hidden bg-white dark:bg-[#18191e]">
                                  {[
                                    {
                                      id: "s1",
                                      type: "AI Synthesis",
                                      text: "The integration of large language model architectures has demonstrated significant capacity to autonomously generate contextually coherent scientific text across various disciplinary domains.",
                                      context: "Introduction · Para 2",
                                    },
                                    {
                                      id: "s2",
                                      type: "Text Overlap",
                                      text: "Decentralized ledger technology provides immutable, tamper-evident record-keeping that eliminates dependency on central trusted authorities for transaction verification.",
                                      context: "Background · Para 1",
                                    },
                                    {
                                      id: "s3",
                                      type: "Text Overlap",
                                      text: "Smart contracts executed on Ethereum-compatible blockchains automate agreement enforcement without requiring third-party intermediaries.",
                                      context: "Methods · Para 4",
                                    },
                                  ].map((seg) => {
                                    const res = segmentResolutions[seg.id]
                                    return (
                                      <div key={seg.id} className="p-3.5 sm:p-4 space-y-2">
                                        <div className="flex items-center justify-between gap-2">
                                          <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#131418] px-2 py-0.5 rounded border border-slate-200/80 dark:border-[#272832]">
                                              {seg.type}
                                            </span>
                                            <span className="text-[11px] text-slate-400">{seg.context}</span>
                                          </div>
                                          {res && (
                                            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                              <span>✓</span>
                                              <span>
                                                {res === "marked-own" 
                                                  ? (isDe ? "Als eigenes Originalwerk deklariert" : "Declared as own original writing") 
                                                  : res === "accepted" 
                                                  ? (isDe ? "Als Fachstandard-Formulierung bestätigt" : "Confirmed standard field phrasing")
                                                  : (isDe ? "Wird in Revision umformuliert" : "Will rephrase in revision")}
                                              </span>
                                            </span>
                                          )}
                                        </div>

                                        <p className={`text-xs italic pl-3 border-l-2 py-0.5 transition-colors ${
                                          res === "will-rephrase"
                                            ? "border-amber-400 text-amber-900 dark:text-amber-200 bg-amber-50/40 dark:bg-amber-950/20 rounded-r-md"
                                            : res === "marked-own"
                                            ? "border-sky-400 text-slate-800 dark:text-slate-200"
                                            : res === "accepted"
                                            ? "border-slate-400 text-slate-700 dark:text-slate-300"
                                            : "border-slate-200 dark:border-[#272832] text-slate-700 dark:text-slate-300"
                                        }`}>
                                          &ldquo;{seg.text}&rdquo;
                                        </p>

                                        {!res ? (
                                          <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                            <button
                                              type="button"
                                              onClick={() => handleResolveSegment(seg.id, "marked-own")}
                                              className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-[#0b99ff] dark:text-sky-300 border border-sky-200/80 dark:border-sky-800/60 transition-colors cursor-pointer"
                                            >
                                              {isDe ? "Eigenes Werk" : "Declare Own Writing"}
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => handleResolveSegment(seg.id, "accepted")}
                                              className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-100 dark:bg-[#1e2027] hover:bg-slate-200 dark:hover:bg-[#272832] text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-[#272832] transition-colors cursor-pointer"
                                            >
                                              {isDe ? "Standard-Formulierung" : "Standard Field Phrasing"}
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => handleResolveSegment(seg.id, "will-rephrase")}
                                              className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 transition-colors cursor-pointer"
                                            >
                                              {isDe ? "Wird umformuliert" : "Will Rephrase in Revision"}
                                            </button>
                                          </div>
                                        ) : (
                                          <button
                                            type="button"
                                            onClick={() => handleResolveSegment(seg.id, res)}
                                            className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline cursor-pointer"
                                          >
                                            {isDe ? "Erklärung zurücksetzen" : "Reset declaration"}
                                          </button>
                                        )}
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                            </div>

                            {/* Footer Action */}
                            <div className="pt-2 flex justify-end">
                              <button
                                type="button"
                                onClick={() => alert(isDe ? `Lade Crossref-Ähnlichkeitszertifikat PDF für ${selectedPaper.id} herunter...` : `Downloading Crossref Similarity Check Certificate PDF for ${selectedPaper.id}...`)}
                                className="inline-flex items-center gap-1.5 border border-[#0b99ff]/30 dark:border-sky-800/60 bg-sky-50/70 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-[#0b99ff] dark:text-sky-300 font-semibold text-xs px-3.5 py-2 rounded-lg cursor-pointer transition-colors shadow-2xs"
                              >
                                <Download className="h-3.5 w-3.5" />
                                <span>{isDe ? "Ähnlichkeitszertifikat herunterladen (PDF)" : "Download Similarity Certificate (PDF)"}</span>
                              </button>
                            </div>

                          </Card>
                        )
                      })()}

                      {/* 4. WAIVERS & BADGES TAB VIEW */}
                      {activeAuthorTab === "recognition" && (
                        <Card className="bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] p-5 sm:p-6 space-y-6 shadow-xs">
                          
                          {/* ── Hub Header ── */}
                          <div className="border-b border-slate-100 dark:border-[#272832] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                {isDe ? "APC-Erlasse & Abzeichen" : "Waivers & Badges"}
                              </h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {isDe 
                                  ? "Lösen Sie Ihren Gutschein ein, um den Betrag während der Zahlung von der APC abzuziehen." 
                                  : "Claim your waiver voucher to subtract the discount from the principle APC during payment checkout."}
                              </p>
                            </div>

                            <Button 
                              onClick={handleSyncOrcid}
                              disabled={isOrcidSyncing}
                              className="bg-[#0b99ff] hover:bg-[#0077cc] text-white text-xs font-semibold px-3.5 py-2 h-auto rounded-lg cursor-pointer whitespace-nowrap shrink-0 shadow-2xs flex items-center gap-2"
                            >
                              <RefreshCw className={`h-3.5 w-3.5 ${isOrcidSyncing ? "animate-spin" : ""}`} />
                              <span>
                                {isOrcidSyncing 
                                  ? (isDe ? "Synchronisiere ORCID..." : "Syncing...") 
                                  : (isDe ? "Mit ORCID synchronisieren" : "Sync with ORCID")}
                              </span>
                            </Button>
                          </div>

                          {/* ── 1. APC WAIVER VOUCHER & CLAIM CTA ── */}
                          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#131418] border border-slate-200/80 dark:border-[#272832] space-y-4">
                            
                            {/* Summary Strip */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="p-3 rounded-xl bg-white dark:bg-[#18191e] border border-slate-200/80 dark:border-[#272832] space-y-0.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                  {isDe ? "Erlass-Stufe" : "Waiver Standing"}
                                </span>
                                <div className="text-sm font-bold text-slate-900 dark:text-white">
                                  {isDe ? "Stufe 2 · 25% APC-Erlass" : "Tier 2 · 25% APC Waiver"}
                                </div>
                                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium block">
                                  {isDe ? "12 Gutachten verifiziert" : "12 peer reviews verified"}
                                </span>
                              </div>

                              <div className="p-3 rounded-xl bg-white dark:bg-[#18191e] border border-slate-200/80 dark:border-[#272832] space-y-0.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                  {isDe ? "Verfügbarer Erlassbetrag" : "Available Discount"}
                                </span>
                                <div className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                                  €650.00 EUR
                                </div>
                                <span className="text-[11px] text-slate-500 font-medium block">
                                  {isDe ? "Wird von Haupt-APC abgezogen" : "Subtracted from principle APC"}
                                </span>
                              </div>

                              <div className="p-3 rounded-xl bg-white dark:bg-[#18191e] border border-slate-200/80 dark:border-[#272832] space-y-0.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                  {isDe ? "Gutschein-Code" : "Voucher Code"}
                                </span>
                                <div className="flex items-center justify-between gap-1 pt-0.5">
                                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                    SO-WAIVER-2026-98X
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (typeof navigator !== "undefined") {
                                        navigator.clipboard.writeText("SO-WAIVER-2026-98X")
                                        setCopiedVoucher(true)
                                        setTimeout(() => setCopiedVoucher(false), 1500)
                                      }
                                    }}
                                    className="text-[10px] font-bold text-[#0b99ff] hover:text-[#0077cc] bg-sky-50 dark:bg-sky-950/60 px-2 py-1 rounded border border-sky-200/80 dark:border-sky-800/60 transition-colors cursor-pointer"
                                  >
                                    {copiedVoucher ? (isDe ? "Kopiert!" : "Copied!") : (isDe ? "Kopieren" : "Copy")}
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* ── Claim & Deduct from Principle APC ── */}
                            <div className="p-4 rounded-xl bg-white dark:bg-[#18191e] border border-slate-200/80 dark:border-[#272832] space-y-3">
                              <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                  {isDe ? "Gutschein auf Manuskript anwenden" : "Apply Voucher to Manuscript Invoice"}
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                  {isDe 
                                    ? "Wählen Sie Ihr Manuskript aus. Der Erlass von 650 € (oder 25%) wird während der Zahlungsabwicklung direkt von der Haupt-APC abgezogen." 
                                    : "Select your manuscript. The €650 discount (or 25% waiver) will be subtracted directly from the principle APC during checkout."}
                                </p>
                              </div>

                              {waiverClaimSuccess && (
                                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between animate-in fade-in">
                                  <span>
                                    {isDe 
                                      ? `✓ 25% APC-Erlass (650 €) erfolgreich auf ${selectedWaiverPaperId} verbucht. Betrag wird bei Zahlung abgezogen.` 
                                      : `✓ 25% APC Waiver (€650 discount) logged for ${selectedWaiverPaperId}. Amount will be subtracted during APC payment.`}
                                  </span>
                                </div>
                              )}

                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-0.5">
                                <select
                                  value={selectedWaiverPaperId}
                                  onChange={(e) => {
                                    setSelectedWaiverPaperId(e.target.value)
                                    setWaiverClaimSuccess(false)
                                  }}
                                  className="flex-1 bg-slate-50 dark:bg-[#131418] border border-slate-200 dark:border-[#272832] text-xs font-medium rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                                >
                                  {uniqueManuscripts.map(m => (
                                    <option key={m.id} value={m.id}>
                                      {m.id}: {m.title.slice(0, 45)}... ({m.journal})
                                    </option>
                                  ))}
                                </select>

                                <Button
                                  onClick={() => {
                                    setIsClaimingWaiver(true)
                                    setTimeout(() => {
                                      setIsClaimingWaiver(false)
                                      setWaiverClaimSuccess(true)
                                    }, 600)
                                  }}
                                  disabled={isClaimingWaiver}
                                  className="bg-[#0b99ff] hover:bg-[#0077cc] text-white text-xs font-bold px-4 py-2 h-auto rounded-lg cursor-pointer whitespace-nowrap shrink-0 shadow-2xs transition-all"
                                >
                                  {isClaimingWaiver 
                                    ? (isDe ? "Buche Erlass..." : "Applying Voucher...") 
                                    : (isDe ? "650 € Erlass anwenden" : "Apply €650 Voucher")}
                                </Button>
                              </div>

                              <div className="pt-2 border-t border-slate-100 dark:border-[#272832] flex flex-wrap items-center justify-between gap-2 text-[11px]">
                                <button
                                  type="button"
                                  onClick={() => alert(isDe ? `Lade APC-Erlasszertifikat PDF für Code SO-WAIVER-2026-98X herunter...` : `Downloading APC Waiver Certificate PDF for SO-WAIVER-2026-98X...`)}
                                  className="text-[#0b99ff] hover:underline font-semibold cursor-pointer inline-flex items-center gap-1"
                                >
                                  <Download className="h-3 w-3" />
                                  <span>{isDe ? "Erlass-Zertifikat herunterladen (PDF)" : "Download Waiver Certificate (PDF)"}</span>
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => alert(isDe ? "Härtefallantrag für institutionellen Erlass geöffnet." : "Institutional hardship waiver application form initiated.")}
                                  className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline cursor-pointer"
                                >
                                  {isDe ? "LMIC / Härtefall-Erlass beantragen" : "Request LMIC / Hardship Waiver"}
                                </button>
                              </div>
                            </div>

                          </div>

                          {/* ── 2. VERIFIED CONTRIBUTOR BADGES ── */}
                          <div className="space-y-3 pt-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                                  {isDe ? "Verifizierte wissenschaftliche Abzeichen" : "Verified Contributor Badges"}
                                </h4>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  {isDe ? "4 aktive Abzeichen für Gutachten und Open-Science-Standards." : "4 active badges for peer review rigor and open science compliance."}
                                </p>
                              </div>

                              {/* Single Clean Social Share Group */}
                              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                                <a
                                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://scholarlyopen.org/author/evelyn-vane")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 dark:bg-[#131418] dark:hover:bg-[#20222a] text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-[#272832] text-[11px] font-medium transition-colors cursor-pointer"
                                  title="Share to LinkedIn"
                                >
                                  <Linkedin className="h-3 w-3 text-[#0077b5]" />
                                  <span>LinkedIn</span>
                                </a>

                                <a
                                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Check out my verified researcher badges on Scholarly Open! https://scholarlyopen.org/author/evelyn-vane")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 dark:bg-[#131418] dark:hover:bg-[#20222a] text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-[#272832] text-[11px] font-medium transition-colors cursor-pointer"
                                  title="Share to X"
                                >
                                  <Share2 className="h-3 w-3 text-slate-700 dark:text-slate-300" />
                                  <span>X</span>
                                </a>

                                <button
                                  type="button"
                                  onClick={() => {
                                    if (typeof navigator !== "undefined") {
                                      navigator.clipboard.writeText("https://scholarlyopen.org/author/evelyn-vane")
                                      alert(isDe ? "Profil-Link kopiert!" : "Badge profile link copied!")
                                    }
                                  }}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 dark:bg-[#131418] dark:hover:bg-[#20222a] text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-[#272832] text-[11px] font-medium transition-colors cursor-pointer"
                                  title="Copy Link"
                                >
                                  <Link2 className="h-3 w-3 text-slate-500" />
                                  <span>Link</span>
                                </button>
                              </div>
                            </div>

                            {/* Clean 2x2 Badge Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              
                              {/* 1. Top Reviewer */}
                              <div className="p-3.5 rounded-xl bg-white dark:bg-[#18191e] border border-slate-200/80 dark:border-[#272832] flex items-start gap-3">
                                <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                  <Star className="h-4 w-4 text-amber-500 fill-amber-500/20" />
                                </div>
                                <div className="min-w-0 flex-1 space-y-0.5">
                                  <div className="flex items-center justify-between gap-1">
                                    <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">Top Reviewer 2026</h5>
                                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200/80 dark:border-emerald-800/60 shrink-0">
                                      ✓ Verified
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                                    {isDe ? "12 Begutachtungen in den besten 10% Antwortzeit." : "12 peer reviews completed in top 10% turnaround bracket."}
                                  </p>
                                </div>
                              </div>

                              {/* 2. Ethics & Rigor */}
                              <div className="p-3.5 rounded-xl bg-white dark:bg-[#18191e] border border-slate-200/80 dark:border-[#272832] flex items-start gap-3">
                                <div className="h-8 w-8 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                  <ShieldCheck className="h-4 w-4 text-[#0b99ff]" />
                                </div>
                                <div className="min-w-0 flex-1 space-y-0.5">
                                  <div className="flex items-center justify-between gap-1">
                                    <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">Ethics & Rigor Verified</h5>
                                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200/80 dark:border-emerald-800/60 shrink-0">
                                      ✓ Verified
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                                    {isDe ? "Volle COPE-Konformität und null Beanstandungen." : "Full COPE compliance and zero retraction or integrity flags."}
                                  </p>
                                </div>
                              </div>

                              {/* 3. Open Data Champion */}
                              <div className="p-3.5 rounded-xl bg-white dark:bg-[#18191e] border border-slate-200/80 dark:border-[#272832] flex items-start gap-3">
                                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                  <BookOpen className="h-4 w-4 text-indigo-500" />
                                </div>
                                <div className="min-w-0 flex-1 space-y-0.5">
                                  <div className="flex items-center justify-between gap-1">
                                    <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">Open Data Champion</h5>
                                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200/80 dark:border-emerald-800/60 shrink-0">
                                      ✓ Verified
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                                    {isDe ? "Hinterlegte offene Datensätze mit öffentlichen DOIs." : "Deposited open research datasets with verified public DOIs."}
                                  </p>
                                </div>
                              </div>

                              {/* 4. Rapid Revision Responder */}
                              <div className="p-3.5 rounded-xl bg-white dark:bg-[#18191e] border border-slate-200/80 dark:border-[#272832] flex items-start gap-3">
                                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                  <Clock className="h-4 w-4 text-emerald-600" />
                                </div>
                                <div className="min-w-0 flex-1 space-y-0.5">
                                  <div className="flex items-center justify-between gap-1">
                                    <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">Rapid Revision Responder</h5>
                                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200/80 dark:border-emerald-800/60 shrink-0">
                                      ✓ Verified
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                                    {isDe ? "Einreichung überarbeiteter Manuskripte in <5 Tagen." : "Submitting author revisions within an average of 4.5 days."}
                                  </p>
                                </div>
                              </div>

                            </div>

                            {/* Clean Milestone Progress Strip */}
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#131418] border border-slate-200/70 dark:border-[#272832] space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                  {isDe ? "Nächste Stufe: 50% APC-Erlass (Stufe 3)" : "Next Milestone: 50% APC Waiver (Tier 3)"}
                                </span>
                                <span className="text-slate-500 dark:text-slate-400 font-medium tabular-nums">
                                  {isDe ? "Noch 1 Gutachten erforderlich (75%)" : "1 more review needed (75% completed)"}
                                </span>
                              </div>
                              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-[#0b99ff] h-full rounded-full w-3/4" />
                              </div>
                            </div>
                          </div>

                          {/* ── 3. TRANSPARENT ACTIVITY LEDGER ── */}
                          <div className="space-y-2 pt-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 block">
                              {isDe ? "Erlass- & Beitrags-Historie" : "Contribution & Waiver History"}
                            </span>

                            <div className="rounded-xl border border-slate-200/80 dark:border-[#272832] overflow-x-auto [scrollbar-width:thin]">
                              <table className="w-full min-w-[550px] text-left text-xs">
                                <thead className="bg-slate-50 dark:bg-[#131418] text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200/80 dark:border-[#272832]">
                                  <tr>
                                    <th className="px-4 py-2.5">{isDe ? "Datum" : "Date"}</th>
                                    <th className="px-4 py-2.5">{isDe ? "Beitrag" : "Contribution"}</th>
                                    <th className="px-4 py-2.5">{isDe ? "Erlasswert" : "Waiver Value"}</th>
                                    <th className="px-4 py-2.5 text-right">{isDe ? "Status" : "Status"}</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-[#272832] text-slate-700 dark:text-slate-300">
                                  <tr>
                                    <td className="px-4 py-3 text-slate-500">2026-08-15</td>
                                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">Peer Review Completed (SOMED-26-094)</td>
                                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">+€150 EUR (+10% Waiver)</td>
                                    <td className="px-4 py-3 text-right">
                                      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-[#131418] px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-[#272832]">
                                        Applied
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="px-4 py-3 text-slate-500">2026-06-20</td>
                                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">Early-Bird Revision Submission (&lt;5 Days)</td>
                                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">+€200 EUR</td>
                                    <td className="px-4 py-3 text-right">
                                      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-[#131418] px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-[#272832]">
                                        Applied
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="px-4 py-3 text-slate-500">2026-04-10</td>
                                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">Guest Editor for Special Issue (SI-2026-AI)</td>
                                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">+€300 EUR</td>
                                    <td className="px-4 py-3 text-right">
                                      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-[#131418] px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-[#272832]">
                                        Applied
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>

                        </Card>
                      )}

                      {/* 6. CAREER DASHBOARD TAB VIEW */}
                      {activeAuthorTab === "career" && (
                        <div className="space-y-5">
                          
                          {/* ── Top Hero Header Card ── */}
                          <Card className="bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] p-5 sm:p-6 shadow-xs">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                              
                              {/* Author Identity */}
                              <div className="flex items-center gap-4">
                                <div className="h-13 w-13 rounded-full bg-black dark:bg-zinc-900 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-2xs ring-2 ring-slate-200/80 dark:ring-[#272832] overflow-hidden">
                                  {profPhotoUrl ? (
                                    <img src={profPhotoUrl} alt="Avatar" className="w-full h-full object-cover" />
                                  ) : (
                                    <span>{profFullName ? profFullName.replace(/^Dr\.\s*/i, '').split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase() : "EV"}</span>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                      {profFullName ? (profFullName.startsWith("Dr.") ? profFullName : `Dr. ${profFullName}`) : "Dr. Evelyn Vane"}
                                    </h3>
                                    {isOrcidVerified && (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#A6CE39]/10 text-[#6a9a1f] dark:text-[#A6CE39] border border-[#A6CE39]/30">
                                        <span className="font-bold text-[9px] bg-[#A6CE39]/20 px-1 rounded">iD</span>
                                        {isDe ? "ORCID Verifiziert" : "ORCID Verified"}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    {profRank || (isDe ? "Senior-Forscher & Fakultätsleiter" : "Senior Researcher & Faculty Lead")}
                                    {profInstitution ? ` · ${profInstitution}` : ""}
                                    {profCountry ? `, ${profCountry}` : ""}
                                  </p>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                                <button
                                  type="button"
                                  onClick={handleDownloadAcademicRecordPdf}
                                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200/80 dark:bg-[#131418] dark:hover:bg-[#20222a] text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-[#272832] text-xs font-semibold transition-colors cursor-pointer"
                                >
                                  <Download className="h-3.5 w-3.5 text-[#0b99ff]" />
                                  <span>{isDe ? "Akademischer Bericht (PDF)" : "Download Record (PDF)"}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    if (typeof navigator !== "undefined") {
                                      navigator.clipboard.writeText("https://scholarlyopen.org/author/evelyn-vane")
                                      alert(isDe ? "Profil-Link kopiert!" : "Researcher profile link copied!")
                                    }
                                  }}
                                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200/80 dark:bg-[#131418] dark:hover:bg-[#20222a] text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-[#272832] text-xs font-semibold transition-colors cursor-pointer"
                                >
                                  <Link2 className="h-3.5 w-3.5 text-slate-500" />
                                  <span>{isDe ? "Profil-Link" : "Copy Link"}</span>
                                </button>
                              </div>

                            </div>

                            {/* Key Stats Strip */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-slate-100 dark:border-[#272832]">
                              <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-[#131418] border border-slate-100 dark:border-[#272832]">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{isDe ? "Artikel" : "Articles Published"}</span>
                                <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">5</div>
                                <span className="text-[10px] text-emerald-600 font-medium">100% Open Access</span>
                              </div>

                              <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-[#131418] border border-slate-100 dark:border-[#272832]">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{isDe ? "Gesamtzitate" : "Total Citations"}</span>
                                <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">120</div>
                                <span className="text-[10px] text-slate-500 font-medium">Crossref Indexed</span>
                              </div>

                              <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-[#131418] border border-slate-100 dark:border-[#272832]">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">h-index / i10-index</span>
                                <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">4 · 3</div>
                                <span className="text-[10px] text-slate-500 font-medium">Verified Metric</span>
                              </div>

                              <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-[#131418] border border-slate-100 dark:border-[#272832]">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{isDe ? "Gutachter-Stufe" : "Reviewer Tier"}</span>
                                <div className="text-base font-bold text-[#0b99ff] mt-0.5">{isDe ? "Stufe 2 · 25% Erlass" : "Tier 2 (25% Waiver)"}</div>
                                <span className="text-[10px] text-emerald-600 font-medium">12 Reviews Completed</span>
                              </div>
                            </div>
                          </Card>

                          {/* ── 2-Column Balanced Workspace ── */}
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                            
                            {/* Left Column (5 Cols): Citation Trends & Metrics */}
                            <div className="lg:col-span-5 space-y-5">
                              
                              {/* Citations by Year Card */}
                              <Card className="bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] p-5 space-y-4 shadow-xs">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                    {isDe ? "Zitate nach Jahr" : "Citations by Year"}
                                  </h4>
                                  <span className="text-[10px] text-slate-400">2019–2023 · Crossref</span>
                                </div>

                                {/* Compact Bar Chart */}
                                <div className="h-36 flex items-end justify-between gap-2.5 pt-4 pb-1 border-b border-slate-100 dark:border-[#272832]">
                                  {[
                                    { year: "2019", count: 12, pct: 28 },
                                    { year: "2020", count: 22, pct: 48 },
                                    { year: "2021", count: 35, pct: 75 },
                                    { year: "2022", count: 30, pct: 65 },
                                    { year: "2023", count: 45, pct: 96 },
                                  ].map((bar) => (
                                    <div key={bar.year} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 tabular-nums">
                                        {bar.count}
                                      </span>
                                      <div
                                        className="w-full max-w-[32px] bg-[#0b99ff] hover:bg-[#0077cc] rounded-t-md transition-all duration-200 cursor-pointer"
                                        style={{ height: `${bar.pct}%` }}
                                        title={`${bar.year}: ${bar.count} Citations`}
                                      />
                                      <span className="text-[10px] font-medium text-slate-400 pt-1">
                                        {bar.year}
                                      </span>
                                    </div>
                                  ))}
                                </div>

                                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                                  <span>{isDe ? "Wachstumstrend:" : "Growth Trajectory:"}</span>
                                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">+275% (2019–2023)</span>
                                </div>
                              </Card>

                              {/* Research Discipline & Impact Summary */}
                              <Card className="bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] p-5 space-y-3 shadow-xs">
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                  {isDe ? "Wissenschaftlicher Einfluss" : "Research Impact Summary"}
                                </h4>
                                <div className="space-y-2 text-xs">
                                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-[#272832]">
                                    <span className="text-slate-500">{isDe ? "Feld-Perzentil" : "Discipline Field Rank"}</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">Top 8% in Medical AI</span>
                                  </div>
                                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-[#272832]">
                                    <span className="text-slate-500">{isDe ? "Ø Zitate pro Artikel" : "Avg. Citations / Article"}</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">24.0 Citations</span>
                                  </div>
                                  <div className="flex items-center justify-between py-1">
                                    <span className="text-slate-500">{isDe ? "Daten-Hinterlegungsrate" : "Data Sharing Compliance"}</span>
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">100% FAIR Compliant</span>
                                  </div>
                                </div>
                              </Card>

                            </div>

                            {/* Right Column (7 Cols): Verified Publications */}
                            <div className="lg:col-span-7">
                              <Card className="bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] p-5 space-y-4 shadow-xs">
                                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#272832] pb-3">
                                  <div>
                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                      {isDe ? "Verifizierte Publikationen" : "Verified Published Articles"}
                                    </h4>
                                    <p className="text-[11px] text-slate-400">
                                      {isDe ? "Vollständig indexiert in DOAJ, Scopus & Crossref." : "Indexed in DOAJ, Scopus, Crossref & Web of Science."}
                                    </p>
                                  </div>
                                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-[#131418] px-2 py-0.5 rounded border border-slate-200 dark:border-[#272832]">
                                    4 {isDe ? "Artikel" : "Articles"}
                                  </span>
                                </div>

                                <div className="divide-y divide-slate-100 dark:divide-[#272832]">
                                  {[
                                    { title: "A Security Framework for Decentralized Ledgers in Public Records", journal: "Engineering & Applied Sciences", doi: "10.5555/so.2026.102", citations: 42, year: "2026" },
                                    { title: "Machine Learning Approaches in Renewable Energy Forecasting", journal: "Engineering & Applied Sciences", doi: "10.5555/so.2026.081", citations: 38, year: "2026" },
                                    { title: "Ethical Dimensions of AI-Assisted Clinical Decision Support", journal: "Medicine & Health Sciences", doi: "10.5555/so.2025.047", citations: 27, year: "2025" },
                                    { title: "Federated Learning Privacy Guarantees Under Byzantine Faults", journal: "Engineering & Applied Sciences", doi: "10.5555/so.2025.039", citations: 13, year: "2025" },
                                  ].map((pub, i) => (
                                    <div key={i} className="py-3.5 space-y-1.5 first:pt-0 last:pb-0 group">
                                      <div className="flex items-start justify-between gap-3">
                                        <h5 className="text-xs font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#0b99ff] transition-colors">
                                          {pub.title}
                                        </h5>
                                        <span className="text-[11px] font-semibold text-[#0b99ff] bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded border border-sky-200/70 dark:border-sky-800/60 shrink-0 whitespace-nowrap">
                                          {pub.citations} {isDe ? "Zitate" : "Citations"}
                                        </span>
                                      </div>

                                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                                        <span className="font-medium text-slate-700 dark:text-slate-300">Scholarly Open: {pub.journal}</span>
                                        <span>·</span>
                                        <span>{pub.year}</span>
                                        <span>·</span>
                                        <span className="text-[#0b99ff]">DOI: {pub.doi}</span>
                                        <span>·</span>
                                        <span className="text-emerald-600 font-medium">Open Access</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </Card>
                            </div>

                          </div>

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
                                <span className="text-[10px] text-slate-400 whitespace-nowrap">Manuscript ID: {alert.paperId}</span>
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
            <DialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 sm:max-w-xl p-6 transition-colors shadow-2xl rounded-2xl">
              <DialogHeader className="pb-1 space-y-1">
                <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  {language === "de" ? "Manuskript einreichen" : "Submit Manuscript"}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                  {language === "de" 
                    ? "Schritt-für-Schritt-Einreichungsportal für das Peer-Review-Verfahren."
                    : "Complete the submission steps to submit your research for peer review."}
                </DialogDescription>
              </DialogHeader>

              {/* Clean Stepper Tabs */}
              <div className="grid grid-cols-4 gap-1.5 pt-2 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                {[
                  { step: 1, label: language === "de" ? "Autor & Journal" : "Author & Journal" },
                  { step: 2, label: language === "de" ? "Titel & Abstract" : "Title & Abstract" },
                  { step: 3, label: language === "de" ? "Datei & Brief" : "File & Letter" },
                  { step: 4, label: language === "de" ? "Bestätigung" : "Declarations" },
                ].map((s) => (
                  <div
                    key={s.step}
                    className={`flex items-center justify-center sm:justify-start gap-1.5 py-1 px-1.5 rounded-md transition-all ${
                      submitStep === s.step
                        ? "bg-sky-50 dark:bg-sky-950/40 text-[#0b99ff] font-semibold"
                        : submitStep > s.step
                        ? "text-emerald-600 dark:text-emerald-400 font-medium"
                        : "text-slate-400 dark:text-slate-500 font-normal"
                    }`}
                  >
                    <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      submitStep === s.step
                        ? "bg-[#0b99ff] text-white shadow-xs"
                        : submitStep > s.step
                        ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                    }`}>
                      {submitStep > s.step ? "✓" : s.step}
                    </span>
                    <span className="hidden sm:inline text-[11px] truncate">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* STEP 1: Corresponding Author Information & Discipline */}
              {submitStep === 1 && (
                <div className="space-y-3.5 py-1 text-xs">
                  
                  {/* Subtle Corresponding Author Banner */}
                  <div className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-200/70 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {language === "de" ? "Korrespondierender Autor: " : "Corresponding Author: "}
                    </span>
                    {language === "de"
                      ? "Hauptkontakt für redaktionelle Mitteilungen, Gutachtenberichte und Korrekturfahnen."
                      : "Primary contact for all editorial decisions, reviewer reports, and production proofs."}
                  </div>

                  {/* First & Last Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        {language === "de" ? "Vorname *" : "First Name *"}
                      </label>
                      <input
                        type="text"
                        value={newFirstName}
                        onChange={(e) => setNewFirstName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]/20 focus:border-[#0b99ff] transition-all"
                        placeholder="e.g. Evelyn"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        {language === "de" ? "Nachname *" : "Last Name *"}
                      </label>
                      <input
                        type="text"
                        value={newLastName}
                        onChange={(e) => setNewLastName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]/20 focus:border-[#0b99ff] transition-all"
                        placeholder="e.g. Vane"
                        required
                      />
                    </div>
                  </div>

                  {/* Email & Country */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        {language === "de" ? "Akademische E-Mail-Adresse *" : "Academic Email Address *"}
                      </label>
                      <input
                        type="email"
                        value={newAuthorEmail}
                        onChange={(e) => setNewAuthorEmail(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]/20 focus:border-[#0b99ff] transition-all"
                        placeholder="e.g. e.vane@university.edu"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        {language === "de" ? "Land / Region *" : "Country / Region *"}
                      </label>
                      <select
                        value={newAuthorCountry}
                        onChange={(e) => setNewAuthorCountry(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]/20 focus:border-[#0b99ff] transition-all"
                        required
                      >
                        <option value="United States">United States</option>
                        <option value="Germany">Germany (Deutschland)</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Switzerland">Switzerland (Schweiz)</option>
                        <option value="Austria">Austria (Österreich)</option>
                        <option value="Canada">Canada</option>
                        <option value="France">France</option>
                        <option value="Netherlands">Netherlands</option>
                        <option value="Australia">Australia</option>
                        <option value="Japan">Japan</option>
                        <option value="Sweden">Sweden</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Italy">Italy</option>
                        <option value="Spain">Spain</option>
                        <option value="China">China</option>
                        <option value="India">India</option>
                        <option value="Brazil">Brazil</option>
                        <option value="South Korea">South Korea</option>
                        <option value="Other / International">Other / International</option>
                      </select>
                    </div>
                  </div>

                  {/* Institution / Affiliation */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      {language === "de" ? "Institution / Universitätsaffiliation *" : "Institution / Affiliation *"}
                    </label>
                    <input
                      type="text"
                      value={newAuthorAffiliation}
                      onChange={(e) => setNewAuthorAffiliation(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]/20 focus:border-[#0b99ff] transition-all"
                      placeholder="e.g. Stanford University School of Medicine"
                      required
                    />
                  </div>

                  {/* Target Journal */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      {language === "de" ? "Zielzeitschrift / Disziplin *" : "Target Journal / Discipline *"}
                    </label>
                    <select
                      value={newJournal}
                      onChange={(e) => setNewJournal(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]/20 focus:border-[#0b99ff] transition-all"
                    >
                      <optgroup label="Core Disciplinary Series">
                        <option value="Scholarly Open: Medicine">Scholarly Open: Medicine</option>
                        <option value="Scholarly Open: Biology">Scholarly Open: Biology</option>
                        <option value="Scholarly Open: Chemistry">Scholarly Open: Chemistry</option>
                        <option value="Scholarly Open: Engineering & Applied Sciences">Scholarly Open: Engineering & Applied Sciences</option>
                        <option value="Scholarly Open: Social Sciences & Humanities">Scholarly Open: Social Sciences & Humanities</option>
                        <option value="Scholarly Open: Social Sciences Open">Scholarly Open: Social Sciences Open</option>
                        <option value="Scholarly Open: Environmental Science">Scholarly Open: Environmental Science</option>
                      </optgroup>
                      <optgroup label="Emerging Frontiers Series">
                        <option value="Scholarly Open: Clinical AI & Digital Health">Scholarly Open: Clinical AI & Digital Health</option>
                        <option value="Scholarly Open: AI Safety & Governance">Scholarly Open: AI Safety & Governance</option>
                        <option value="Scholarly Open: Data Science & Analytics">Scholarly Open: Data Science & Analytics</option>
                        <option value="Scholarly Open: Decarbonization & Carbon Tech">Scholarly Open: Decarbonization & Carbon Tech</option>
                        <option value="Scholarly Open: Quantum Engineering">Scholarly Open: Quantum Engineering</option>
                        <option value="Scholarly Open: Synthetic Biology & Bio-Design">Scholarly Open: Synthetic Biology & Bio-Design</option>
                        <option value="Scholarly Open: Space Resources & Orbital Economy">Scholarly Open: Space Resources & Orbital Economy</option>
                      </optgroup>
                    </select>
                  </div>

                  {/* Submission Stage & Article Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        {language === "de" ? "Einreichungsphase *" : "Submission Stage *"}
                      </label>
                      <select
                        value={newSubmissionStage}
                        onChange={(e) => setNewSubmissionStage(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]/20 focus:border-[#0b99ff] transition-all"
                      >
                        <option value="Initial Submission">Initial Submission</option>
                        <option value="Revised Submission">Revised Submission</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        {language === "de" ? "Artikelkategorie / Typ *" : "Article Category / Type *"}
                      </label>
                      <select
                        value={newArticleType}
                        onChange={(e) => setNewArticleType(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]/20 focus:border-[#0b99ff] transition-all"
                      >
                        <optgroup label="Research-based Articles">
                          <option value="Original Research">Original Research</option>
                          <option value="Brief Research Report">Brief Research Report</option>
                          <option value="Research Protocols">Research Protocols</option>
                          <option value="Research Clinical Trials Protocol">Research Clinical Trials Protocol</option>
                          <option value="Research Letter">Research Letter</option>
                          <option value="Observational Study">Observational Study</option>
                          <option value="Study Protocol / Data Article">Study Protocol / Data Article</option>
                        </optgroup>
                        <optgroup label="Review-based Articles">
                          <option value="Review">Review Article</option>
                          <option value="Systematic Review & Meta-Analysis">Systematic Review & Meta-Analysis</option>
                          <option value="Scoping Review">Scoping Review</option>
                          <option value="Mini Review">Mini Review</option>
                          <option value="Book Review">Book Review</option>
                        </optgroup>
                        <optgroup label="Case-based Articles">
                          <option value="Case Report">Case Report</option>
                          <option value="Case Series">Case Series</option>
                          <option value="Technical Report">Technical Report</option>
                          <option value="Clinical Image / Video Article">Clinical Image / Video Article</option>
                        </optgroup>
                        <optgroup label="Short Communications & Other">
                          <option value="Short Communication">Short Communication</option>
                          <option value="Method / Software Article">Method / Software Article</option>
                          <option value="Perspective Article">Perspective Article</option>
                          <option value="Commentary">Commentary</option>
                          <option value="Opinion">Opinion</option>
                          <option value="Editorial">Editorial</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>

                </div>
              )}

              {/* STEP 2: Manuscript Title, Abstract & Declarations */}
              {submitStep === 2 && (
                <div className="space-y-3.5 py-1 text-xs">
                  
                  {/* Manuscript Title */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      {language === "de" ? "Manuskripttitel *" : "Manuscript Title *"}
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]/20 focus:border-[#0b99ff] transition-all"
                      placeholder="e.g. Deep Reinforcement Learning for Diagnostic Cardiology"
                      required
                    />
                  </div>

                  {/* Abstract */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        {language === "de" ? "Zusammenfassung / Abstract *" : "Abstract Overview *"}
                      </label>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {newAbstract ? `${newAbstract.trim().split(/\s+/).filter(Boolean).length} / 300 words` : "0 / 300 words"}
                      </span>
                    </div>
                    <textarea
                      value={newAbstract}
                      onChange={(e) => setNewAbstract(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]/20 focus:border-[#0b99ff] resize-none transition-all"
                      placeholder="Paste complete abstract summarizing Background, Methods, Results, and Conclusions..."
                      required
                    />
                  </div>

                  {/* Keywords & Co-Authors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        {language === "de" ? "Schlüsselwörter (Keywords)" : "Keywords"}
                      </label>
                      <input
                        type="text"
                        value={newKeywords}
                        onChange={(e) => setNewKeywords(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]/20 focus:border-[#0b99ff] transition-all"
                        placeholder="comma-separated (e.g. AI, Cardiology, Imaging)"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        {language === "de" ? "Koautoren (Co-Authors)" : "Co-Authors (Optional)"}
                      </label>
                      <input
                        type="text"
                        value={newCoAuthors}
                        onChange={(e) => setNewCoAuthors(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]/20 focus:border-[#0b99ff] transition-all"
                        placeholder="e.g. Prof. Aris Thorne, Dr. Sarah Lin"
                      />
                    </div>
                  </div>

                  {/* Declarations: Ethics IRB, Funding & Data DOI */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200/70 dark:border-slate-800 rounded-xl space-y-2.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                      {language === "de" ? "Wissenschaftliche Erklärungen & Offenlegungen (Optional)" : "Declarations & Disclosures (Optional)"}
                    </span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="space-y-1">
                        <label className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                          Ethics Approval / IRB #
                        </label>
                        <input
                          type="text"
                          value={newEthicsIrb}
                          onChange={(e) => setNewEthicsIrb(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                          placeholder="e.g. IRB-2026-081"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                          Grant / Funding Support
                        </label>
                        <input
                          type="text"
                          value={newFundingGrant}
                          onChange={(e) => setNewFundingGrant(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                          placeholder="e.g. NIH-HL-2026"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                          Data DOI / Repository
                        </label>
                        <input
                          type="text"
                          value={newDataDoi}
                          onChange={(e) => setNewDataDoi(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                          placeholder="e.g. doi.org/10.5281/..."
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* STEP 3: File Upload & Cover Letter */}
              {submitStep === 3 && (
                <div className="space-y-4 py-1 text-xs">
                  
                  {/* File Upload Box */}
                  <div 
                    onClick={() => {
                      const input = document.getElementById("manuscript-file-input") as HTMLInputElement
                      if (input) input.click()
                    }}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
                    onDrop={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        const file = e.dataTransfer.files[0]
                        setSubmissionFile(file)
                        setSubmissionFileName(file.name)
                        const sizeKb = Math.round(file.size / 1024)
                        setSubmissionFileSize(sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`)
                      }
                    }}
                    className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all ${
                      submissionFileName 
                        ? "border-emerald-500/60 bg-emerald-50/40 dark:bg-emerald-950/20" 
                        : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-[#0b99ff] hover:bg-sky-50/20"
                    }`}
                  >
                    <input
                      id="manuscript-file-input"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0]
                          setSubmissionFile(file)
                          setSubmissionFileName(file.name)
                          const sizeKb = Math.round(file.size / 1024)
                          setSubmissionFileSize(sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`)
                        }
                      }}
                    />

                    {submissionFileName ? (
                      <div className="flex flex-col items-center text-center space-y-1.5">
                        <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                          <FileText className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white break-all max-w-sm">
                            {submissionFileName}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {submissionFileSize || "2.4 MB"} · {language === "de" ? "Bereit zum Hochladen" : "Ready for submission"}
                          </p>
                        </div>
                        <div className="pt-1 flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                            <Check className="h-3.5 w-3.5" /> {language === "de" ? "Datei verknüpft" : "File attached"}
                          </span>
                          <span className="text-slate-300 dark:text-slate-600">·</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSubmissionFile(null)
                              setSubmissionFileName("")
                              setSubmissionFileSize("")
                            }}
                            className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 underline cursor-pointer"
                          >
                            {language === "de" ? "Entfernen" : "Remove"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center space-y-1.5">
                        <div className="h-9 w-9 rounded-lg bg-sky-500/10 flex items-center justify-center text-[#0b99ff]">
                          <Upload className="h-4.5 w-4.5" />
                        </div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                          {language === "de" ? "Manuskriptdatei auswählen oder hierher ziehen" : "Click to select manuscript file or drag & drop"}
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">
                          {language === "de" ? "Formate: PDF, DOCX, DOC (Max. 50 MB)" : "Supported formats: PDF, DOCX, DOC (Max 50MB)"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Dedicated Cover Letter Space */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        {language === "de" ? "Anschreiben an die Schriftleitung" : "Cover Letter to the Editor-in-Chief"}
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const author = `${newFirstName} ${newLastName}`.trim() || profFullName || "Dr. Evelyn Vane"
                          const title = newTitle || "Our Research Manuscript"
                          const journal = newJournal || "Scholarly Open"
                          setNewCoverLetter(
                            `Dear Editor-in-Chief,\n\nWe are pleased to submit our original research article titled "${title}" for publication consideration in ${journal}.\n\nThis work reports significant findings on modern methodology, rigorous data modeling, and practical applications. We confirm that this manuscript represents original research, has not been published previously, and is not currently under consideration by any other journal.\n\nAll co-authors have reviewed and approved this version for submission. We look forward to your evaluation.\n\nSincerely,\n${author}`
                          )
                        }}
                        className="text-[11px] font-semibold text-[#0b99ff] hover:text-[#0077cc] hover:underline cursor-pointer inline-flex items-center gap-1"
                      >
                        <FileText className="h-3 w-3" />
                        <span>{language === "de" ? "Vorlage einfügen" : "Auto-Fill Template"}</span>
                      </button>
                    </div>
                    
                    <textarea
                      value={newCoverLetter}
                      onChange={(e) => setNewCoverLetter(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]/20 focus:border-[#0b99ff] resize-none transition-all"
                      placeholder={
                        language === "de"
                          ? "Sehr geehrte Schriftleitung, hiermit reichen wir unser Originalmanuskript ein..."
                          : "Dear Editor-in-Chief, we are pleased to submit our original research manuscript..."
                      }
                    />
                  </div>

                </div>
              )}

              {/* STEP 4: Disclosures & Checklist Agreement */}
              {submitStep === 4 && (
                <div className="space-y-3 py-1 text-xs">
                  
                  {/* 1. Conflict of Interest Disclosure */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200/70 dark:border-slate-800 rounded-xl space-y-1">
                    <div className="flex items-start gap-2.5">
                      <ShieldCheck className="h-4 w-4 text-[#0b99ff] shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-xs font-semibold text-slate-900 dark:text-white">
                          {language === "de" ? "Interessenkonflikt- & Originalitätserklärung" : "Conflict of Interest & Originality Declaration"}
                        </h5>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5">
                          {language === "de"
                            ? "Ich erkläre, dass alle finanziellen und institutionellen Beziehungen offengelegt wurden und dieses Manuskript unveröffentlichte Originalforschung darstellt."
                            : "I declare that all financial, institutional, and personal relationships that could influence the work are disclosed. The manuscript contains original research not under consideration elsewhere."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 2. APC & Waiver Policy Disclosure */}
                  <div className="p-3 bg-sky-50/50 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-800/40 rounded-xl space-y-1">
                    <div className="flex items-start gap-2.5">
                      <Receipt className="h-4 w-4 text-[#0b99ff] shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h5 className="text-xs font-semibold text-slate-900 dark:text-white">
                            {language === "de" ? "Artikelbearbeitungsgebühr (APC) & Erlassrichtlinie" : "Article Processing Charge (APC) & Waiver Policy"}
                          </h5>
                          <span className="text-[10px] font-bold text-[#0b99ff] bg-sky-100 dark:bg-sky-900/60 px-2 py-0.5 rounded">
                            €2,600 EUR
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5">
                          {language === "de"
                            ? "Scholarly Open ist Gold Open Access. Die APC von 2.600 € fällt nur bei endgültiger Annahme an (keine Einreichungsgebühr). Aktive Gutachter-Gutscheine oder institutionelle Erlasse werden vor der Rechnungsstellung direkt abgezogen."
                            : "Scholarly Open operates on a Gold Open Access model. The standard APC of €2,600 EUR is payable only upon final acceptance (no submission fee). Contributor waivers or institutional funding agreements are deducted prior to invoice checkout."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 3. Rights Retention & Open Access CC-BY 4.0 */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200/70 dark:border-slate-800 rounded-xl space-y-1">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-xs font-semibold text-slate-900 dark:text-white">
                          {language === "de" ? "Rechtevorbehalt & Open Access (CC-BY 4.0)" : "Rights Retention & Open Access (CC-BY 4.0)"}
                        </h5>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5">
                          {language === "de"
                            ? "Autoren behalten das uneingeschränkte Urheberrecht unter der Creative Commons Namensnennung 4.0 International (CC-BY 4.0) Lizenz."
                            : "Authors retain unrestricted copyright of published works under the Creative Commons Attribution 4.0 International (CC-BY 4.0) license."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Required Agreement Checkboxes */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-start gap-2.5">
                      <input 
                        id="ethics-disclosure-check" 
                        type="checkbox" 
                        checked={ethicsAgreementChecked}
                        onChange={(e) => setEthicsAgreementChecked(e.target.checked)}
                        className="h-4 w-4 mt-0.5 text-[#0b99ff] focus:ring-[#0b99ff] border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131418] rounded cursor-pointer"
                      />
                      <label htmlFor="ethics-disclosure-check" className="text-xs text-slate-700 dark:text-slate-300 font-medium cursor-pointer select-none leading-relaxed">
                        {language === "de" 
                          ? "Ich stimme den Autorenrichtlinien, den Publikationsethik-Regeln und den APC-Richtlinien von Scholarly Open zu."
                          : "I confirm that I have read and agree to the Author Guidelines, Publication Ethics, Open Access, and APC Fees policies."}
                      </label>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <input 
                        id="coauthor-approval-check" 
                        type="checkbox" 
                        checked={apcAgreementChecked}
                        onChange={(e) => setApcAgreementChecked(e.target.checked)}
                        className="h-4 w-4 mt-0.5 text-[#0b99ff] focus:ring-[#0b99ff] border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131418] rounded cursor-pointer"
                      />
                      <label htmlFor="coauthor-approval-check" className="text-xs text-slate-700 dark:text-slate-300 font-medium cursor-pointer select-none leading-relaxed">
                        {language === "de" 
                          ? "Ich bestätige, dass alle Koautoren diese Einreichung und die Erklärungen freigegeben haben."
                          : "I verify that all listed co-authors have approved this manuscript version and all declared information."}
                      </label>
                    </div>
                  </div>

                </div>
              )}

              <DialogFooter className="gap-2 sm:gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                {submitStep > 1 && (
                  <button 
                    type="button"
                    onClick={() => setSubmitStep(prev => prev - 1)}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    {language === "de" ? "Zurück" : "Back"}
                  </button>
                )}
                {submitStep < 4 ? (
                  <Button 
                    type="button"
                    onClick={() => {
                      if (submitStep === 1 && (!newFirstName || !newLastName || !newAuthorEmail || !newAuthorAffiliation)) {
                        alert("Please fill in the required Corresponding Author fields.")
                        return
                      }
                      if (submitStep === 2 && (!newTitle || !newAbstract)) {
                        alert("Please provide the Manuscript Title and Abstract before proceeding.")
                        return
                      }
                      if (submitStep === 3 && !submissionFileName) {
                        setSubmissionFileName("Manuscript_Document.pdf")
                        setSubmissionFileSize("2.4 MB")
                      }
                      setSubmitStep(prev => prev + 1)
                    }}
                    className="bg-[#0b99ff] hover:bg-[#0077cc] text-white font-semibold text-xs px-5 py-2 rounded-lg cursor-pointer transition-all shadow-xs"
                  >
                    {language === "de" ? "Nächster Schritt" : "Next Step"}
                  </Button>
                ) : (
                  <Button 
                    type="button"
                    disabled={!ethicsAgreementChecked || !apcAgreementChecked}
                    onClick={handleNewSubmissionSubmit}
                    className="bg-[#0b99ff] hover:bg-[#0077cc] disabled:opacity-50 text-white font-semibold text-xs px-5 py-2 rounded-lg cursor-pointer transition-all shadow-xs"
                  >
                    {language === "de" ? "Bestätigen & Einreichen" : "Confirm & Submit Manuscript"}
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
                  Select peer reviewers to evaluate manuscript ID: {assignPaperId}
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
                  Select your formal decision verdict for manuscript ID: {decisionPaperId}
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
                  className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold text-xs cursor-pointer"
                >
                  Agree & Request Access
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* 11. ROLE-AWARE PROFILE SETTINGS MODAL */}
          <Dialog open={isAuthorProfileSetupOpen} onOpenChange={setIsAuthorProfileSetupOpen}>
            <DialogContent className="bg-white dark:bg-[#18191e] border border-slate-200 dark:border-[#272832] text-slate-900 dark:text-slate-100 sm:max-w-md transition-colors p-6">
              <DialogHeader className="pb-1">
                <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="h-4 w-4 text-[#0b99ff]" />
                  {role === "jm" 
                    ? (language === "de" ? "Journal Manager Profil (Intern)" : "Journal Manager Staff Profile")
                    : (language === "de" ? "Profileinstellungen" : "Profile Settings")
                  }
                </DialogTitle>
                {role !== "jm" && (
                  <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                    {language === "de" ? "Verwalten Sie Ihre akademischen Profildaten und Affiliationen." : "Manage your verified academic profile, ORCID iD, and institutional affiliations."}
                  </DialogDescription>
                )}
              </DialogHeader>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault()
                  setIsAuthorProfileCompleted(true)
                  setIsAuthorProfileSetupOpen(false)
                  setSuccess(language === "de" ? "Profil erfolgreich gespeichert! Dashboard aktualisiert." : "Profile saved successfully! Dashboard updated.")
                  if (typeof window !== "undefined") {
                    const params = new URLSearchParams(window.location.search)
                    if (params.get("action") === "submit") {
                      setIsSubmitWizardOpen(true)
                    }
                  }
                }} 
                className="space-y-3.5 pt-2"
              >
                {/* Compact Minimal Avatar Row */}
                <div className="flex items-center gap-3.5 pb-1">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden bg-black dark:bg-zinc-900 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm ring-2 ring-slate-200 dark:ring-[#272832]">
                    {role === "editor" && editorPhotoUrl ? (
                      <img src={editorPhotoUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : profPhotoUrl ? (
                      <img src={profPhotoUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span>{role === "editor" ? (editorName ? editorName.replace(/^Prof\.\s*|^Dr\.\s*/i, '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : "AT") : role === "jm" ? (jmFullName ? jmFullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : "SJ") : (profFullName ? profFullName.replace(/^Dr\.\s*/i, '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : "EV")}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#20222a] dark:hover:bg-[#272935] text-slate-800 dark:text-slate-200 transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs">
                      <Upload className="h-3.5 w-3.5 text-[#0b99ff]" /> 
                      {language === "de" ? "Foto hochladen" : "Upload Photo"}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onloadend = () => {
                              if (role === "editor") {
                                setEditorPhotoUrl(reader.result as string)
                              } else {
                                setProfPhotoUrl(reader.result as string)
                              }
                            }
                            reader.readAsDataURL(file)
                          }
                        }} 
                      />
                    </label>
                    {((role === "editor" && editorPhotoUrl) || profPhotoUrl) && (
                      <button
                        type="button"
                        onClick={() => {
                          if (role === "editor") setEditorPhotoUrl("")
                          else setProfPhotoUrl("")
                        }}
                        className="px-2.5 py-1.5 text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                      >
                        {language === "de" ? "Entfernen" : "Remove"}
                      </button>
                    )}
                  </div>
                </div>

                {role === "jm" ? (
                  /* ========================================================= */
                  /* JOURNAL MANAGER IN-HOUSE EMPLOYEE PROFILE FIELDS          */
                  /* ========================================================= */
                  <>
                    {/* Full Name & Staff Role */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          {language === "de" ? "Vollständiger Name *" : "Full Name *"}
                        </label>
                        <input
                          type="text"
                          required
                          value={jmFullName}
                          onChange={(e) => setJmFullName(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#131418] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                          placeholder="Sarah Jenkins"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          {language === "de" ? "Funktion / Rolle" : "Staff Role"}
                        </label>
                        <select
                          value={jmStaffRole}
                          onChange={(e) => setJmStaffRole(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#131418] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                        >
                          <option value="Editorial Associate">{language === "de" ? "Redaktionsreferent" : "Editorial Associate"}</option>
                          <option value="Editorial Assistant">{language === "de" ? "Redaktionsassistent" : "Editorial Assistant"}</option>
                          <option value="Editorial Manager">{language === "de" ? "Redaktionsleiter" : "Editorial Manager"}</option>
                          <option value="Head of Journals Operations">{language === "de" ? "Leiter Verlags- & Zeitschriftenbetrieb" : "Head of Journals Operations"}</option>
                        </select>
                      </div>
                    </div>

                    {/* Publisher Office & Country */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          {language === "de" ? "Verlagsbüro" : "Publishing Office"}
                        </label>
                        <input
                          type="text"
                          value={jmOfficeLocation}
                          onChange={(e) => setJmOfficeLocation(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#131418] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                          placeholder="Scholarly Open Headquarters (Basel / London)"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          {language === "de" ? "Standort (Land) *" : "Operating Country *"}
                        </label>
                        <select
                          required
                          value={profCountry}
                          onChange={(e) => setProfCountry(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#131418] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                        >
                          <option value="Germany">{language === "de" ? "Deutschland" : "Germany"}</option>
                          <option value="Switzerland">{language === "de" ? "Schweiz" : "Switzerland"}</option>
                          <option value="Austria">{language === "de" ? "Österreich" : "Austria"}</option>
                          <option value="United Kingdom">{language === "de" ? "Vereinigtes Königreich" : "United Kingdom"}</option>
                          <option value="France">{language === "de" ? "Frankreich" : "France"}</option>
                          <option value="Italy">{language === "de" ? "Italien" : "Italy"}</option>
                          <option value="Spain">{language === "de" ? "Spanien" : "Spain"}</option>
                          <option value="Netherlands">{language === "de" ? "Niederlande" : "Netherlands"}</option>
                          <option value="Belgium">{language === "de" ? "Belgien" : "Belgium"}</option>
                          <option value="Sweden">{language === "de" ? "Schweden" : "Sweden"}</option>
                          <option value="Norway">{language === "de" ? "Norwegen" : "Norway"}</option>
                          <option value="Denmark">{language === "de" ? "Dänemark" : "Denmark"}</option>
                          <option value="Finland">{language === "de" ? "Finnland" : "Finland"}</option>
                          <option value="Ireland">{language === "de" ? "Irland" : "Ireland"}</option>
                          <option value="Portugal">{language === "de" ? "Portugal" : "Portugal"}</option>
                          <option value="Poland">{language === "de" ? "Polen" : "Poland"}</option>
                          <option value="Greece">{language === "de" ? "Griechenland" : "Greece"}</option>
                          <option value="Czech Republic">{language === "de" ? "Tschechien" : "Czech Republic"}</option>
                          <option value="Hungary">{language === "de" ? "Ungarn" : "Hungary"}</option>
                          <option value="Romania">{language === "de" ? "Rumänien" : "Romania"}</option>
                          <option value="Bulgaria">{language === "de" ? "Bulgarien" : "Bulgaria"}</option>
                          <option value="Croatia">{language === "de" ? "Kroatien" : "Croatia"}</option>
                          <option value="Slovakia">{language === "de" ? "Slowakei" : "Slovakia"}</option>
                          <option value="Slovenia">{language === "de" ? "Slowenien" : "Slovenia"}</option>
                          <option value="Estonia">{language === "de" ? "Estland" : "Estonia"}</option>
                          <option value="Latvia">{language === "de" ? "Lettland" : "Latvia"}</option>
                          <option value="Lithuania">{language === "de" ? "Litauen" : "Lithuania"}</option>
                          <option value="Luxembourg">{language === "de" ? "Luxemburg" : "Luxembourg"}</option>
                          <option value="Iceland">{language === "de" ? "Island" : "Iceland"}</option>
                          <option value="Cyprus">{language === "de" ? "Zypern" : "Cyprus"}</option>
                          <option value="Malta">{language === "de" ? "Malta" : "Malta"}</option>
                          <option value="India">{language === "de" ? "Indien" : "India"}</option>
                          <option value="United States">{language === "de" ? "Vereinigte Staaten" : "United States"}</option>
                          <option value="Canada">{language === "de" ? "Kanada" : "Canada"}</option>
                          <option value="Australia">{language === "de" ? "Australien" : "Australia"}</option>
                        </select>
                      </div>
                    </div>

                    {/* Official Desk Email */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        {language === "de" ? "Offizielle Desk-E-Mail *" : "Official Desk Email *"}
                      </label>
                      <input
                        type="email"
                        required
                        value={jmDeskEmail}
                        onChange={(e) => setJmDeskEmail(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#131418] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                        placeholder="scholarlyopen@gmail.com"
                      />
                    </div>

                    {/* In-House Operational Notification Channels */}
                    <div className="space-y-2 pt-1.5 border-t border-slate-100 dark:border-[#272832]">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        {language === "de" ? "Automatische Desk-Benachrichtigungen" : "Automated Desk Notification Channels"}
                      </span>
                      
                      <label className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={jmCcReminders}
                          onChange={(e) => setJmCcReminders(e.target.checked)}
                          className="h-3.5 w-3.5 mt-0.5 text-[#0b99ff] focus:ring-[#0b99ff] border-slate-300 rounded cursor-pointer"
                        />
                        <span>
                          {language === "de" ? "Immer Kopie an Desk-E-Mail (scholarlyopen@gmail.com) bei Gutachter-Erinnerungen senden" : "Always CC desk email (scholarlyopen@gmail.com) on reviewer reminders & nudges"}
                        </span>
                      </label>

                      <label className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={jmIntegrityAlerts}
                          onChange={(e) => setJmIntegrityAlerts(e.target.checked)}
                          className="h-3.5 w-3.5 mt-0.5 text-[#0b99ff] focus:ring-[#0b99ff] border-slate-300 rounded cursor-pointer"
                        />
                        <span>
                          {language === "de" ? "Sofortige Warnung bei Überschreitung der Ähnlichkeits-/KI-Grenzwerte (>15%)" : "Real-time alerts on automated forensic pre-scan integrity flags (>15% similarity)"}
                        </span>
                      </label>
                    </div>
                  </>
                ) : (
                  /* ========================================================= */
                  /* AUTHOR / RESEARCHER / REVIEWER / EDITOR ACADEMIC FIELDS   */
                  /* ========================================================= */
                  <>
                    {/* Full Name & Academic Title */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          {language === "de" ? "Vollständiger Name *" : "Full Name *"}
                        </label>
                        <input
                          type="text"
                          required
                          value={role === "editor" ? editorName : profFullName}
                          onChange={(e) => {
                            if (role === "editor") setEditorName(e.target.value)
                            else setProfFullName(e.target.value)
                          }}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#131418] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                          placeholder={role === "editor" ? "Prof. Aris Thorne" : "Dr. Evelyn Vane"}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          {language === "de" ? "Akademischer Titel / Rolle" : "Academic Title / Role"}
                        </label>
                        <select
                          value={role === "editor" ? editorRank : profRank}
                          onChange={(e) => {
                            if (role === "editor") setEditorRank(e.target.value)
                            else setProfRank(e.target.value)
                          }}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#131418] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                        >
                          <option value="Professor & Editor-in-Chief">{language === "de" ? "Professor & Chefredakteur" : "Professor & Editor-in-Chief"}</option>
                          <option value="Senior Researcher & Faculty Lead">{language === "de" ? "Leitender Wissenschaftler & Fakultätsleitung" : "Senior Researcher & Faculty Lead"}</option>
                          <option value="Professor">Professor</option>
                          <option value="Associate Professor">{language === "de" ? "Außerordentlicher Professor" : "Associate Professor"}</option>
                          <option value="Assistant Professor">{language === "de" ? "Assistenzprofessor" : "Assistant Professor"}</option>
                          <option value="Senior Researcher">{language === "de" ? "Leitender Forscher" : "Senior Researcher"}</option>
                          <option value="Postdoctoral Fellow">{language === "de" ? "Postdoktorand" : "Postdoctoral Fellow"}</option>
                          <option value="PhD Researcher">{language === "de" ? "Doktorand" : "PhD Researcher"}</option>
                        </select>
                      </div>
                    </div>

                    {/* Institution */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        {language === "de" ? "Institution / Universität *" : "Institution *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={role === "editor" ? editorInstitution : profInstitution}
                        onChange={(e) => {
                          if (role === "editor") setEditorInstitution(e.target.value)
                          else setProfInstitution(e.target.value)
                        }}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#131418] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                        placeholder="Charité – Universitätsmedizin Berlin"
                      />
                    </div>

                    {/* Country */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        {language === "de" ? "Land *" : "Country *"}
                      </label>
                      <select
                        required
                        value={role === "editor" ? editorCountry : profCountry}
                        onChange={(e) => {
                          if (role === "editor") setEditorCountry(e.target.value)
                          else setProfCountry(e.target.value)
                        }}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#131418] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                      >
                        <option value="Germany">{language === "de" ? "Deutschland" : "Germany"}</option>
                        <option value="Switzerland">{language === "de" ? "Schweiz" : "Switzerland"}</option>
                        <option value="Austria">{language === "de" ? "Österreich" : "Austria"}</option>
                        <option value="United Kingdom">{language === "de" ? "Vereinigtes Königreich" : "United Kingdom"}</option>
                        <option value="France">{language === "de" ? "Frankreich" : "France"}</option>
                        <option value="Italy">{language === "de" ? "Italien" : "Italy"}</option>
                        <option value="Spain">{language === "de" ? "Spanien" : "Spain"}</option>
                        <option value="Netherlands">{language === "de" ? "Niederlande" : "Netherlands"}</option>
                        <option value="Belgium">{language === "de" ? "Belgien" : "Belgium"}</option>
                        <option value="Sweden">{language === "de" ? "Schweden" : "Sweden"}</option>
                        <option value="Norway">{language === "de" ? "Norwegen" : "Norway"}</option>
                        <option value="Denmark">{language === "de" ? "Dänemark" : "Denmark"}</option>
                        <option value="Finland">{language === "de" ? "Finnland" : "Finland"}</option>
                        <option value="Ireland">{language === "de" ? "Irland" : "Ireland"}</option>
                        <option value="Portugal">{language === "de" ? "Portugal" : "Portugal"}</option>
                        <option value="Poland">{language === "de" ? "Polen" : "Poland"}</option>
                        <option value="Greece">{language === "de" ? "Griechenland" : "Greece"}</option>
                        <option value="Czech Republic">{language === "de" ? "Tschechien" : "Czech Republic"}</option>
                        <option value="Hungary">{language === "de" ? "Ungarn" : "Hungary"}</option>
                        <option value="Romania">{language === "de" ? "Rumänien" : "Romania"}</option>
                        <option value="Bulgaria">{language === "de" ? "Bulgarien" : "Bulgaria"}</option>
                        <option value="Croatia">{language === "de" ? "Kroatien" : "Croatia"}</option>
                        <option value="Slovakia">{language === "de" ? "Slowakei" : "Slovakia"}</option>
                        <option value="Slovenia">{language === "de" ? "Slowenien" : "Slovenia"}</option>
                        <option value="Estonia">{language === "de" ? "Estland" : "Estonia"}</option>
                        <option value="Latvia">{language === "de" ? "Lettland" : "Latvia"}</option>
                        <option value="Lithuania">{language === "de" ? "Litauen" : "Lithuania"}</option>
                        <option value="Luxembourg">{language === "de" ? "Luxemburg" : "Luxembourg"}</option>
                        <option value="Iceland">{language === "de" ? "Island" : "Iceland"}</option>
                        <option value="Cyprus">{language === "de" ? "Zypern" : "Cyprus"}</option>
                        <option value="Malta">{language === "de" ? "Malta" : "Malta"}</option>
                        <option value="India">{language === "de" ? "Indien" : "India"}</option>
                        <option value="United States">{language === "de" ? "Vereinigte Staaten" : "United States"}</option>
                        <option value="Canada">{language === "de" ? "Kanada" : "Canada"}</option>
                        <option value="Australia">{language === "de" ? "Australien" : "Australia"}</option>
                      </select>
                    </div>

                    {/* ORCID iD with subtle sync & check */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          ORCID iD *
                        </label>
                        <button
                          type="button"
                          onClick={() => handleSyncWithOrcid()}
                          disabled={isSyncingOrcid}
                          className="text-[11px] font-semibold text-[#0b99ff] hover:text-[#0088e0] flex items-center gap-1 cursor-pointer disabled:opacity-50 transition-colors"
                        >
                          <RefreshCw className={`h-3 w-3 ${isSyncingOrcid ? "animate-spin" : ""}`} />
                          {isSyncingOrcid ? (language === "de" ? "Synchronisiere..." : "Syncing...") : (language === "de" ? "Von ORCID abgleichen" : "Sync from ORCID")}
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          pattern="^\d{4}-\d{4}-\d{4}-[\dX]{4}$"
                          value={role === "editor" ? editorOrcid : profOrcid}
                          onChange={(e) => {
                            if (role === "editor") setEditorOrcid(e.target.value)
                            else setProfOrcid(e.target.value)
                            setOrcidSyncMessage("")
                          }}
                          className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#131418] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff] pr-8"
                          placeholder={role === "editor" ? "0000-0002-9842-1102" : "0000-0002-1825-0097"}
                        />
                        {orcidSyncMessage.startsWith("✓") && (
                          <Check className="h-4 w-4 text-emerald-500 absolute right-2.5 top-1/2 -translate-y-1/2" />
                        )}
                      </div>
                    </div>

                    {/* Research Topics */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        {language === "de" ? "Forschungsschwerpunkte" : "Research Topics"}
                      </label>
                      <input
                        type="text"
                        value={profSpecialization}
                        onChange={(e) => setProfSpecialization(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-[#272832] bg-white dark:bg-[#131418] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                        placeholder="Cardiology, Clinical AI, Diagnostic Imaging"
                      />
                    </div>

                    {/* Peer Review Checkbox */}
                    <div className="flex items-center pt-0.5">
                      <input 
                        id="prof-review-optin"
                        type="checkbox"
                        checked={profReviewOptIn}
                        onChange={(e) => setProfReviewOptIn(e.target.checked)}
                        className="h-3.5 w-3.5 text-[#0b99ff] focus:ring-[#0b99ff] border-slate-300 rounded cursor-pointer"
                      />
                      <label htmlFor="prof-review-optin" className="ml-2 block text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                        {language === "de" ? "Für Begutachtungseinladungen zur Verfügung stehen" : "Opt-in for peer review invitations"}
                      </label>
                    </div>
                  </>
                )}

                <DialogFooter className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-[#0b99ff] hover:bg-[#0b8ceb] text-white font-semibold text-xs py-2.5 rounded-lg shadow cursor-pointer transition-all"
                  >
                    {language === "de" ? "Profil speichern" : "Save Profile"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* 11. AUTHOR: EDITORIAL CONTRIBUTION POLICY MODAL */}
          <Dialog open={isBadgeModalOpen} onOpenChange={setIsBadgeModalOpen}>
            <DialogContent className="bg-white dark:bg-[#18191e] border border-slate-200 dark:border-[#272832] text-slate-900 dark:text-slate-100 sm:max-w-xl transition-colors p-6">
              <DialogHeader className="pb-1">
                <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#0b99ff]" />
                  {language === "de" ? "Publikations-Förderstufen & Kriterien" : "Publication Credit Tiers & Criteria"}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                  {language === "de" 
                    ? "Institutionelle Publikationszuschüsse für verifizierte Begutachtungsleistungen und schnelle Bearbeitungszeiten." 
                    : "Institutional publication grants awarded for verified peer review contributions and turnaround timeliness."}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-1">
                {/* Clean Criteria Table */}
                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-[#272832]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-[#131418] text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200 dark:border-[#272832]">
                      <tr>
                        <th className="px-3.5 py-2.5">{language === "de" ? "Stufe" : "Tier"}</th>
                        <th className="px-3.5 py-2.5">{language === "de" ? "Zuschuss" : "Grant"}</th>
                        <th className="px-3.5 py-2.5">{language === "de" ? "Gutachten" : "Reviews"}</th>
                        <th className="px-3.5 py-2.5">{language === "de" ? "Dauer" : "Speed"}</th>
                        <th className="px-3.5 py-2.5">{language === "de" ? "Integrität" : "Integrity"}</th>
                        <th className="px-3.5 py-2.5 text-right">{language === "de" ? "Status" : "Status"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#272832] font-normal">
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-[#1e2027]">
                        <td className="px-3.5 py-2.5 font-semibold text-slate-900 dark:text-white">Tier 1</td>
                        <td className="px-3.5 py-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">10%</td>
                        <td className="px-3.5 py-2.5 text-slate-600 dark:text-slate-300">3+</td>
                        <td className="px-3.5 py-2.5 text-slate-500">&lt; 7 {language === "de" ? "Tage" : "Days"}</td>
                        <td className="px-3.5 py-2.5 text-slate-500">{language === "de" ? "Einwandfrei" : "Clean"}</td>
                        <td className="px-3.5 py-2.5 text-right text-emerald-600 font-semibold">{language === "de" ? "Qualifiziert" : "Qualified"}</td>
                      </tr>
                      <tr className="bg-sky-50/60 dark:bg-sky-950/30 border-l-2 border-l-[#0b99ff]">
                        <td className="px-3.5 py-2.5 font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                          Tier 2
                          <span className="h-1.5 w-1.5 rounded-full bg-[#0b99ff]" />
                        </td>
                        <td className="px-3.5 py-2.5 text-[#0b99ff] font-semibold">25%</td>
                        <td className="px-3.5 py-2.5 text-slate-900 dark:text-white font-semibold">10+</td>
                        <td className="px-3.5 py-2.5 text-slate-700 dark:text-slate-300">&lt; 5 {language === "de" ? "Tage" : "Days"}</td>
                        <td className="px-3.5 py-2.5 text-slate-700 dark:text-slate-300">{language === "de" ? "Einwandfrei" : "Clean"}</td>
                        <td className="px-3.5 py-2.5 text-right">
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#0b99ff] text-white">{language === "de" ? "Aktiv" : "Active"}</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-[#1e2027]">
                        <td className="px-3.5 py-2.5 font-semibold text-slate-900 dark:text-white">Tier 3</td>
                        <td className="px-3.5 py-2.5 text-slate-600 dark:text-slate-300 font-semibold">50%</td>
                        <td className="px-3.5 py-2.5 text-slate-600 dark:text-slate-300">20+</td>
                        <td className="px-3.5 py-2.5 text-slate-500">&lt; 4 {language === "de" ? "Tage" : "Days"}</td>
                        <td className="px-3.5 py-2.5 text-slate-500">{language === "de" ? "Einwandfrei" : "Clean"}</td>
                        <td className="px-3.5 py-2.5 text-right text-[#0b99ff] font-semibold">{language === "de" ? "Noch 2 Gutachten" : "2 Away"}</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-[#1e2027]">
                        <td className="px-3.5 py-2.5 font-semibold text-slate-900 dark:text-white">Tier 4</td>
                        <td className="px-3.5 py-2.5 text-slate-600 dark:text-slate-300 font-semibold">100%</td>
                        <td className="px-3.5 py-2.5 text-slate-600 dark:text-slate-300">40+ / Board</td>
                        <td className="px-3.5 py-2.5 text-slate-500">&lt; 3 {language === "de" ? "Tage" : "Days"}</td>
                        <td className="px-3.5 py-2.5 text-slate-500">{language === "de" ? "Einwandfrei" : "Clean"}</td>
                        <td className="px-3.5 py-2.5 text-right text-slate-400">Senior</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Footer Note */}
                <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-normal">
                  {language === "de" 
                    ? "Förderzuschüsse werden bei Annahme des Manuskripts automatisch angerechnet. Integritätsfälle oder verspätete Berichte setzen die Stufenqualifikation zurück." 
                    : "Grant waivers are automatically applied upon manuscript acceptance. Integrity cases or delayed reports reset the tier qualification."}
                </p>
              </div>

              <DialogFooter className="pt-2">
                <Button 
                  onClick={() => setIsBadgeModalOpen(false)} 
                  variant="outline"
                  className="w-full text-xs font-semibold py-2 rounded-lg cursor-pointer"
                >
                  {language === "de" ? "Schließen" : "Close"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* 12. AUTHOR: MINIMALIST & CLEAN MANUSCRIPT DOSSIER */}
          <Dialog open={isManuscriptDetailsOpen} onOpenChange={setIsManuscriptDetailsOpen}>
            <DialogContent className="bg-white dark:bg-[#18191e] border border-slate-200 dark:border-[#272832] text-slate-900 dark:text-slate-100 sm:max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden shadow-xl transition-colors">
              {/* Header */}
              <DialogHeader className="p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-[#272832] space-y-2 shrink-0 text-left">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold tabular-nums px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#131418] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#272832]">
                      {selectedManuscriptDetails?.id}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedManuscriptDetails?.journal} · {selectedManuscriptDetails?.date}
                    </span>
                  </div>
                  {selectedManuscriptDetails && (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold border ${
                      selectedManuscriptDetails.status === "Accepted"
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60"
                        : selectedManuscriptDetails.status === "Revision Required"
                        ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60"
                        : "bg-slate-100 dark:bg-[#131418] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#272832]"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        selectedManuscriptDetails.status === "Accepted" ? "bg-emerald-500" :
                        selectedManuscriptDetails.status === "Revision Required" ? "bg-amber-500" : "bg-[#0b99ff]"
                      }`} />
                      {selectedManuscriptDetails.status}
                    </span>
                  )}
                </div>
                <DialogTitle className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {selectedManuscriptDetails?.title || "Manuscript Dossier"}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                  <span>Double-Blind Peer Review · Referee and author identities masked</span>
                </DialogDescription>
              </DialogHeader>

              {/* Dossier Body */}
              {selectedManuscriptDetails && (
                <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs [scrollbar-width:thin]">
                  
                  {/* 1. Linear Minimalist Timeline */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 block">
                      {language === "de" ? "Meilensteine & Redaktionsstatus" : "Editorial Progress & Milestones"}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {/* Step 1: Ingest Check */}
                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#131418] border border-slate-100 dark:border-[#272832] flex items-center gap-2.5">
                        <span className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                          1
                        </span>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 dark:text-white truncate">Ingest Check</div>
                          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Passed</p>
                        </div>
                      </div>

                      {/* Step 2: Editor Assignment */}
                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#131418] border border-slate-100 dark:border-[#272832] flex items-center gap-2.5">
                        <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          (selectedManuscriptDetails.editorAssigned || selectedManuscriptDetails.assignedEditorName)
                            ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"
                            : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400"
                        }`}>
                          2
                        </span>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 dark:text-white truncate">Editor</div>
                          <p className={`text-[11px] font-medium truncate ${
                            (selectedManuscriptDetails.editorAssigned || selectedManuscriptDetails.assignedEditorName)
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-amber-600 dark:text-amber-400"
                          }`}>
                            {selectedManuscriptDetails.assignedEditorName || (selectedManuscriptDetails.editorAssigned ? "Assigned" : "Unassigned")}
                          </p>
                        </div>
                      </div>

                      {/* Step 3: Peer Review */}
                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#131418] border border-slate-100 dark:border-[#272832] flex items-center gap-2.5">
                        <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          selectedManuscriptDetails.reviewers.length > 0
                            ? "bg-sky-100 dark:bg-sky-950 text-[#0b99ff] dark:text-sky-400"
                            : "bg-slate-200 dark:bg-[#272832] text-slate-600 dark:text-slate-400"
                        }`}>
                          3
                        </span>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 dark:text-white truncate">Peer Review</div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium truncate">
                            {selectedManuscriptDetails.reviewers.length > 0 
                              ? `${selectedManuscriptDetails.reviewers.length} Reviewer(s)`
                              : "Not Started"}
                          </p>
                        </div>
                      </div>

                      {/* Step 4: Decision */}
                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#131418] border border-slate-100 dark:border-[#272832] flex items-center gap-2.5">
                        <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          selectedManuscriptDetails.status === "Accepted"
                            ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"
                            : selectedManuscriptDetails.status === "Revision Required"
                            ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400"
                            : "bg-slate-200 dark:bg-[#272832] text-slate-600 dark:text-slate-400"
                        }`}>
                          4
                        </span>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 dark:text-white truncate">Decision</div>
                          <p className="text-[11px] text-slate-500 font-medium truncate">
                            {selectedManuscriptDetails.status === "Accepted"
                              ? "Accepted"
                              : selectedManuscriptDetails.status === "Revision Required"
                              ? "Revision Required"
                              : selectedManuscriptDetails.status === "Rejected"
                              ? "Rejected"
                              : "Pending (~2-4 Wks)"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Compact 2-Column Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    
                    {/* Left: Authorship & Abstract */}
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 block">
                          {language === "de" ? "Autoren & Affiliation" : "Authors & Affiliation"}
                        </span>
                        <div className="space-y-1 text-slate-700 dark:text-slate-300">
                          <p className="font-bold text-slate-900 dark:text-white">
                            {selectedManuscriptDetails.authorName || "Dr. Author"} <span className="text-slate-500 font-normal">(Corresponding)</span>
                          </p>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400">
                            {selectedManuscriptDetails.authorAffiliation || "Institutional Affiliation"}
                            {selectedManuscriptDetails.authorCountry ? ` · ${selectedManuscriptDetails.authorCountry}` : ""}
                          </p>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Email:</span> {selectedManuscriptDetails.authorEmail || "author@scholarlyopen.org"}
                          </p>
                          {selectedManuscriptDetails.authorOrcid && (
                            <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                              ORCID: {selectedManuscriptDetails.authorOrcid}
                            </p>
                          )}
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 pt-1">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Co-Authors:</span> {selectedManuscriptDetails.coAuthors || "None declared"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 block">
                          Abstract
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed line-clamp-4 hover:line-clamp-none transition-all">
                          {selectedManuscriptDetails.abstract || "No abstract summary provided."}
                        </p>
                        {selectedManuscriptDetails.keywords && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Keywords:</span> {selectedManuscriptDetails.keywords}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Files & Governance */}
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 block">
                          {language === "de" ? "Dateien" : "Files"}
                        </span>
                        <div className="space-y-1.5">
                          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#131418] border border-slate-100 dark:border-[#272832] flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 dark:text-white truncate">
                                {selectedManuscriptDetails.fileName || "Main_Manuscript.pdf"}
                              </p>
                              <p className="text-[10px] text-slate-400 font-medium">
                                {selectedManuscriptDetails.fileSize || "2.4 MB"} · Primary Document
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => alert(`Downloading ${selectedManuscriptDetails.fileName || "Main_Manuscript.pdf"}`)}
                              className="inline-flex items-center gap-1 text-xs font-bold text-[#0b99ff] hover:text-[#0077cc] dark:hover:text-sky-300 bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200/70 dark:border-sky-800/50 px-2.5 py-1 rounded-md transition-all cursor-pointer shrink-0"
                            >
                              <Download className="h-3 w-3" />
                              <span>Download</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 block">
                          {language === "de" ? "Erklärungen & Offenlegungen" : "Declarations & Disclosures"}
                        </span>
                        <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                          <p>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Ethics IRB:</span> {selectedManuscriptDetails.ethicsIrb || "None declared / Not applicable"}
                          </p>
                          <p>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Grant Funding:</span> {selectedManuscriptDetails.fundingGrant || "No external funding declared"}
                          </p>
                          <p>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Data DOI / Repository:</span>{" "}
                            {selectedManuscriptDetails.dataDoi?.startsWith("http") || selectedManuscriptDetails.dataDoi?.startsWith("doi.org") ? (
                              <span className="text-[#0b99ff] font-medium">{selectedManuscriptDetails.dataDoi}</span>
                            ) : (
                              <span>{selectedManuscriptDetails.dataDoi || "Available upon reasonable request"}</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* Clean Footer */}
              <div className="p-4 px-6 border-t border-slate-100 dark:border-[#272832] flex items-center justify-between gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => alert(`Downloading submission dossier for ${selectedManuscriptDetails?.id}...`)}
                  className="inline-flex items-center gap-1.5 border border-[#0b99ff]/30 dark:border-sky-800/60 bg-sky-50/70 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-[#0b99ff] dark:text-sky-300 font-semibold text-xs px-3.5 py-1.5 rounded-lg cursor-pointer transition-colors shadow-2xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Package (.zip)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsManuscriptDetailsOpen(false)}
                  className="bg-slate-900 hover:bg-black dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-medium text-xs px-4 py-1.5 rounded-lg cursor-pointer transition-colors"
                >
                  {language === "de" ? "Schließen" : "Close"}
                </button>
              </div>
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
