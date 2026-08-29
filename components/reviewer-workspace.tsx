"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  AlertCircle, 
  Send, 
  FileText, 
  Award, 
  Sparkles, 
  ThumbsUp, 
  ThumbsDown, 
  UserPlus, 
  ChevronRight, 
  Check, 
  X, 
  Bell, 
  Lock, 
  AlertTriangle,
  Info,
  Layers,
  Zap,
  Target,
  LayoutDashboard,
  FolderOpen,
  SearchCode,
  Wallet,
  FileCheck2,
  Download,
  ExternalLink,
  BookOpen,
  HelpCircle,
  BarChart2,
  ChevronDown,
  GraduationCap,
  ArrowRight,
  FileDown,
  Eye,
  Calculator,
  SlidersHorizontal,
  Tag,
  Building,
  Globe,
  UserCheck,
  Save,
  CheckCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export interface ReviewerProfile {
  title: string
  name: string
  email: string
  institution: string
  department: string
  country: string
  orcid: string
  scholarUrl: string
  primaryDiscipline: string
  subDisciplines: string[]
  keywords: string[]
  maxReviewsPerMonth: number
  preferredTurnaround: number
  availabilityStatus: "Available" | "Sabbatical"
  sabbaticalUntil?: string
  coiAcknowledged: boolean
  isCompleted: boolean
}

export const DISCIPLINE_DATA: Record<string, { labelEn: string; labelDe: string; subDisciplines: string[]; keywords: string[] }> = {
  "medicine": {
    labelEn: "Medicine & Clinical Health",
    labelDe: "Medizin & Klinische Forschung",
    subDisciplines: ["Cardiology", "Oncology & Hematology", "Immunology & Infectious Disease", "Neurology & Psychiatry", "Radiology & Imaging", "Public Health & Epidemiology"],
    keywords: ["CRISPR", "Clinical Trials", "Cardiovascular Imaging", "Biomarkers", "Immunotherapy", "Randomized Controlled Trials", "mRNA Vaccines", "Pharmacovigilance", "Pathology"]
  },
  "biology": {
    labelEn: "Biology & Life Sciences",
    labelDe: "Biologie & Lebenswissenschaften",
    subDisciplines: ["Molecular Biology", "Genetics & Genomics", "Microbiology & Virology", "Biochemistry", "Cell Biology", "Ecology & Evolution"],
    keywords: ["Gene Editing", "Proteomics", "Single-Cell RNA-seq", "Epigenetics", "Microbiome", "Cellular Signaling", "Phylogenetics", "Structural Biology"]
  },
  "computer_science": {
    labelEn: "Computer Science & AI",
    labelDe: "Informatik & Künstliche Intelligenz",
    subDisciplines: ["Artificial Intelligence & ML", "Data Science & Big Data", "Cybersecurity & Cryptography", "Computer Vision & NLP", "Software Engineering & Systems"],
    keywords: ["Large Language Models", "Deep Learning", "Federated Learning", "Transformers", "Neural Networks", "Explainable AI", "Blockchain", "Autonomous Systems"]
  },
  "engineering": {
    labelEn: "Engineering & Applied Sciences",
    labelDe: "Ingenieurwissenschaften & Angewandte Technik",
    subDisciplines: ["Electrical & Electronic Eng", "Mechanical & Aerospace", "Materials Science & Nanotech", "Civil & Environmental Eng", "Chemical Engineering"],
    keywords: ["Renewable Energy", "Photovoltaics", "Nanomaterials", "Smart Grids", "Robotics", "Additive Manufacturing", "Fluid Dynamics", "Composite Materials"]
  },
  "chemistry": {
    labelEn: "Chemistry & Materials Science",
    labelDe: "Chemie & Materialwissenschaften",
    subDisciplines: ["Organic Chemistry", "Inorganic & Organometallics", "Physical & Theoretical Chem", "Analytical Chemistry", "Polymer Chemistry"],
    keywords: ["Catalysis", "Spectroscopy", "Polymer Synthesis", "Drug Design", "Green Chemistry", "Nanostructures", "Electrochemistry", "Mass Spectrometry"]
  },
  "social_sciences": {
    labelEn: "Social Sciences & Humanities",
    labelDe: "Sozial- & Geisteswissenschaften",
    subDisciplines: ["Economics & Finance", "Education & Pedagogy", "Psychology & Behavioral Science", "Sociology & Political Science", "Bioethics & Medical Law"],
    keywords: ["Behavioral Economics", "Qualitative Research", "Public Policy", "Digital Pedagogy", "Health Disparities", "Research Ethics", "Social Media Analytics"]
  }
}

export interface ReviewInvitationItem {
  id: string
  title: string
  journal: string
  deadline: string
  abstract: string
  manuscriptType?: string
  manuscriptId?: string
}

export interface ActiveReviewItem {
  id: string
  title: string
  journal: string
  deadline: string
  status: "Pending" | "In Progress" | "Completed"
  recommendation?: string
  daysLeft?: number
  manuscriptId?: string
  wordCount?: string
  tablesCount?: string
  figuresCount?: string
  completedDate?: string
  integrityScore?: string
}

interface ReviewerWorkspaceProps {
  language: string
  reviewInvitations: ReviewInvitationItem[]
  activeReviews: ActiveReviewItem[]
  user?: {
    name?: string
    email?: string
    orcid?: string
    institution?: string
  }
  initialProfile?: Partial<ReviewerProfile>
  onSaveProfile?: (profile: ReviewerProfile) => void
  activeTab?: "overview" | "portfolio" | "forensics" | "wallet" | "certificate"
  onTabChange?: (tab: "overview" | "portfolio" | "forensics" | "wallet" | "certificate") => void
  onAcceptInvitation: (invId: string, autoDeadline: string, reminders: { days5: boolean; hours48: boolean }) => void
  onDeclineInvitation: (invId: string, reason: string, recommendation?: { name: string; email: string; affiliation: string; note: string }) => void
  onSubmitScorecard: (scorecardData: ReviewAssessmentData) => void
}

export interface ReviewAssessmentData {
  paperId: string
  manuscriptId: string
  title: string
  journal: string
  articleLength: string
  tablesCount: string
  figuresCount: string
  questionnaire: Record<string, "yes" | "no" | "na">
  questionnaireNotes: Record<string, string>
  priorityRating: number
  generalCommentsAuthor: string
  specificCommentsAuthor: string
  confidentialCommentsEditor: string
  recommendation: "Accept without any Changes" | "Re-review and Accept with Minor Changes" | "Re-review and Accept with Major Changes" | "Re-write and Re-submit" | "Reject"
  willingToReviewRevision: "Yes" | "No"
  coiDisclosure: "None" | "Yes"
  coiDetails: string
  copeCertified: boolean
  aiAuthenticityScore: number
}

const QUESTIONNAIRE_ITEMS = [
  { id: "q1_mission", label: "Does the manuscript fit into the mission and scope of the journal?" },
  { id: "q2_originality", label: "Does the manuscript contain original and significant information to justify publication?" },
  { id: "q3_abstract", label: "Does the abstract clearly and accurately describe the content of the article?" },
  { id: "q4_irb", label: "Is the information on Institutional Review Board (IRB) / Ethics approval explicitly stated?" },
  { id: "q5_problem", label: "Is the scientific problem significant and concisely stated in the introduction?" },
  { id: "q6_lit_review", label: "Does the literature review follow the specific aims of the study?" },
  { id: "q7_methods", label: "Are the experimental and/or theoretical methods described comprehensively?" },
  { id: "q8_discussion", label: "Are the discussion interpretations and conclusions justified by the results of the study?" },
  { id: "q9_references", label: "Is adequate and balanced reference made to other current work in the field?" },
  { id: "q10_language", label: "Are the scientific language, grammar, and syntax acceptable for publication?" }
]

function getFormattedReviewerName(title?: string, name?: string): string {
  const rawName = (name || "Marcus Vance").trim()
  const rawTitle = (title || "").trim()
  if (!rawTitle) return rawName
  const titleRegex = /^(prof\.?\s*dr\.?|dr\.?|assoc\.?\s*prof\.?|assist\.?\s*prof\.?|md|phd)\s+/i
  if (titleRegex.test(rawName)) {
    return rawName
  }
  return `${rawTitle} ${rawName}`
}

export function ReviewerWorkspace({
  language,
  reviewInvitations,
  activeReviews,
  user,
  initialProfile,
  onSaveProfile,
  activeTab = "overview",
  onTabChange,
  onAcceptInvitation,
  onDeclineInvitation,
  onSubmitScorecard
}: ReviewerWorkspaceProps) {
  const isDe = language === "de"

  // Reviewer Profile State & Onboarding
  const [profile, setProfile] = useState<ReviewerProfile>(() => {
    return {
      title: initialProfile?.title || "Dr.",
      name: user?.name || initialProfile?.name || "Marcus Vance",
      email: user?.email || initialProfile?.email || "m.vance@university-charite.de",
      institution: user?.institution || initialProfile?.institution || "Charité – Universitätsmedizin Berlin",
      department: initialProfile?.department || "Department of Cardiology & Vascular Medicine",
      country: initialProfile?.country || "Germany",
      orcid: user?.orcid || initialProfile?.orcid || "0000-0004-7711-2093",
      scholarUrl: initialProfile?.scholarUrl || "https://scholar.google.com/citations?user=vance-m",
      primaryDiscipline: initialProfile?.primaryDiscipline || "medicine",
      subDisciplines: initialProfile?.subDisciplines || ["Cardiology", "Cardiovascular Imaging", "Biomarkers"],
      keywords: initialProfile?.keywords || ["CRISPR", "Cardiovascular Imaging", "AI Diagnostics", "Randomized Controlled Trials", "Echocardiography"],
      maxReviewsPerMonth: initialProfile?.maxReviewsPerMonth ?? 2,
      preferredTurnaround: initialProfile?.preferredTurnaround ?? 14,
      availabilityStatus: initialProfile?.availabilityStatus || "Available",
      sabbaticalUntil: initialProfile?.sabbaticalUntil || "",
      coiAcknowledged: initialProfile?.coiAcknowledged ?? true,
      isCompleted: initialProfile?.isCompleted ?? true
    }
  })

  // Profile Modal Form States
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileStep, setProfileStep] = useState<1 | 2 | 3 | 4>(1)
  const [formTitle, setFormTitle] = useState(profile.title)
  const [formName, setFormName] = useState(profile.name)
  const [formEmail, setFormEmail] = useState(profile.email)
  const [formInstitution, setFormInstitution] = useState(profile.institution)
  const [formDepartment, setFormDepartment] = useState(profile.department)
  const [formCountry, setFormCountry] = useState(profile.country)
  const [formOrcid, setFormOrcid] = useState(profile.orcid)
  const [formScholarUrl, setFormScholarUrl] = useState(profile.scholarUrl)
  const [formPrimaryDiscipline, setFormPrimaryDiscipline] = useState(profile.primaryDiscipline)
  const [formSubDisciplines, setFormSubDisciplines] = useState<string[]>(profile.subDisciplines)
  const [formKeywords, setFormKeywords] = useState<string[]>(profile.keywords)
  const [formKeywordInput, setFormKeywordInput] = useState("")
  const [formMaxReviews, setFormMaxReviews] = useState(profile.maxReviewsPerMonth)
  const [formTurnaround, setFormTurnaround] = useState(profile.preferredTurnaround)
  const [formAvailability, setFormAvailability] = useState(profile.availabilityStatus)
  const [formSabbaticalUntil, setFormSabbaticalUntil] = useState(profile.sabbaticalUntil || "")
  const [formCoiChecked, setFormCoiChecked] = useState(profile.coiAcknowledged)
  const [formCopeChecked, setFormCopeChecked] = useState(true)
  const [profileSavedToast, setProfileSavedToast] = useState(false)
  const [isFirstTimeOnboarding, setIsFirstTimeOnboarding] = useState(false)

  // One-time automatic popup on first login
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userKey = `so_reviewer_onboarded_${user?.email || "default"}`
      const hasOnboarded = localStorage.getItem(userKey)
      if (!hasOnboarded) {
        setIsFirstTimeOnboarding(true)
        setShowProfileModal(true)
      }
    }
  }, [user?.email])

  const markOnboarded = () => {
    if (typeof window !== "undefined") {
      const userKey = `so_reviewer_onboarded_${user?.email || "default"}`
      localStorage.setItem(userKey, "true")
      setIsFirstTimeOnboarding(false)
    }
  }

  // Sub-filter inside Portfolio tab
  const [portfolioFilter, setPortfolioFilter] = useState<"all" | "in_progress" | "invitations" | "completed">("all")

  // Wallet & Gamification state
  const [points, setPoints] = useState(35)
  const [reviewsDone, setReviewsDone] = useState(3)
  const [walletExpiryDays, setWalletExpiryDays] = useState(312)
  const [calcReviews, setCalcReviews] = useState(4)
  const [certViewMode, setCertViewMode] = useState<"certificate" | "cv">("certificate")

  // Modals state
  const [selectedInvForAccept, setSelectedInvForAccept] = useState<ReviewInvitationItem | null>(null)
  const [selectedInvForDecline, setSelectedInvForDecline] = useState<ReviewInvitationItem | null>(null)
  const [selectedReviewForEval, setSelectedReviewForEval] = useState<ActiveReviewItem | null>(null)
  const [selectedPackageRev, setSelectedPackageRev] = useState<ActiveReviewItem | null>(null)
  const [isDownloadingZip, setIsDownloadingZip] = useState(false)

  // Misconduct Escalation State (IM / Handling Editor)
  const [selectedEscalateRev, setSelectedEscalateRev] = useState<ActiveReviewItem | null>(null)
  const [escalateTarget, setEscalateTarget] = useState<"both" | "integrity_manager" | "handling_editor">("both")
  const [misconductType, setMisconductType] = useState<string>("figure_manipulation")
  const [misconductSeverity, setMisconductSeverity] = useState<"high_urgent" | "medium_discretion">("high_urgent")
  const [misconductEvidence, setMisconductEvidence] = useState("")
  const [misconductPageRefs, setMisconductPageRefs] = useState("")
  const [misconductCopeCheck, setMisconductCopeCheck] = useState(false)
  const [isSubmittingEscalation, setIsSubmittingEscalation] = useState(false)
  const [escalatedPaperIds, setEscalatedPaperIds] = useState<Record<string, boolean>>({})

  // Forensics manuscript selector state
  const [selectedForensicPaperId, setSelectedForensicPaperId] = useState<string>(
    activeReviews[0]?.id || "SOMED-26-RS001"
  )

  // Acceptance Modal Form State
  const [autoDeadlineDays, setAutoDeadlineDays] = useState(14)
  const [reminder5Days, setReminder5Days] = useState(true)
  const [reminder48Hours, setReminder48Hours] = useState(true)
  const [acceptCopeCertified, setAcceptCopeCertified] = useState(false)
  const [acceptCalendarSynced, setAcceptCalendarSynced] = useState(false)

  // Decline Modal Form State
  const [declineReason, setDeclineReason] = useState<string>("workload")
  const [declineColleagueName, setDeclineColleagueName] = useState("")
  const [declineColleagueEmail, setDeclineColleagueEmail] = useState("")
  const [declineColleagueAffiliation, setDeclineColleagueAffiliation] = useState("")
  const [declineColleagueNote, setDeclineColleagueNote] = useState("")

  // Collapsible Fraud Guide in Forensics tab
  const [isFraudGuideExpanded, setIsFraudGuideExpanded] = useState(false)

  // Forensic Analysis Profiles lookup
  const FORENSIC_PROFILES: Record<string, {
    aiScore: string
    aiStatus: string
    aiConfidence: string
    figureScore: string
    figureStatus: string
    figureDetails: string
    citationScore: string
    citationStatus: string
    citationDetails: string
    irbStatus: string
    irbDetails: string
  }> = {
    "SOMED-26-RS001": {
      aiScore: "4% Probability",
      aiStatus: "Clean ✓",
      aiConfidence: "Natural perplexity & human phrasing confirmed across all 14 pages.",
      figureScore: "100% Original",
      figureStatus: "Clean ✓",
      figureDetails: "6 Figures scanned at 300+ DPI. Zero pixel cloning or contrast anomalies.",
      citationScore: "Verified Network",
      citationStatus: "Balanced",
      citationDetails: "42 References checked against Crossref. No citation cartel or reciprocal padding.",
      irbStatus: "IRB Approved",
      irbDetails: "Explicit ethics statement: Protocol #IRB-2026-MED-8491 on record."
    },
    "SOENG-26-RS002": {
      aiScore: "6% Probability",
      aiStatus: "Clean ✓",
      aiConfidence: "Low linguistic synthetics. Mathematical derivations and theorems verified.",
      figureScore: "100% Vector Clean",
      figureStatus: "Clean ✓",
      figureDetails: "8 Architecture diagrams and latency plots verified without duplicate panels.",
      citationScore: "Verified Network",
      citationStatus: "Balanced",
      citationDetails: "38 References in IEEE & arXiv corpora. Normal self-citation ratio (4.2%).",
      irbStatus: "Exempt / Computational",
      irbDetails: "Public open-source benchmark datasets utilized (CIFAR-100, FedMNIST)."
    },
    "SOSOC-26-RV003": {
      aiScore: "3% Probability",
      aiStatus: "Clean ✓",
      aiConfidence: "High natural lexical richness. Primary qualitative field surveys detected.",
      figureScore: "100% Clean",
      figureStatus: "Clean ✓",
      figureDetails: "4 Geographical GIS maps verified with standard spatial projections.",
      citationScore: "Verified Network",
      citationStatus: "Balanced",
      citationDetails: "56 References across multidisciplinary urban planning literature.",
      irbStatus: "IRB Approved",
      irbDetails: "Participant consent protocols verified under Ethics Review Board Ref #2026-SOC-104."
    }
  }

  // Electronic Assessment Form State
  const [answers, setAnswers] = useState<Record<string, "yes" | "no" | "na">>({
    q1_mission: "yes",
    q2_originality: "yes",
    q3_abstract: "yes",
    q4_irb: "yes",
    q5_problem: "yes",
    q6_lit_review: "yes",
    q7_methods: "yes",
    q8_discussion: "yes",
    q9_references: "yes",
    q10_language: "yes"
  })
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [priorityRating, setPriorityRating] = useState<number>(3)
  const [articleLength, setArticleLength] = useState("6,450 words / 14 pages")
  const [tablesCount, setTablesCount] = useState("4 Tables")
  const [figuresCount, setFiguresCount] = useState("6 Figures")
  const [generalComments, setGeneralComments] = useState("")
  const [specificComments, setSpecificComments] = useState("")
  const [editorConfidentialComments, setEditorConfidentialComments] = useState("")
  const [recommendation, setRecommendation] = useState<"Accept without any Changes" | "Re-review and Accept with Minor Changes" | "Re-review and Accept with Major Changes" | "Re-write and Re-submit" | "Reject">("Re-review and Accept with Minor Changes")
  const [willingRevision, setWillingRevision] = useState<"Yes" | "No">("Yes")
  const [coiStatus, setCoiStatus] = useState<"None" | "Yes">("None")
  const [coiDetails, setCoiDetails] = useState("")
  const [evalCopeCheck, setEvalCopeCheck] = useState(false)
  const [evalError, setEvalError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Profile Action Handlers
  const handleOpenProfileModal = () => {
    setFormTitle(profile.title)
    setFormName(profile.name)
    setFormEmail(profile.email)
    setFormInstitution(profile.institution)
    setFormDepartment(profile.department)
    setFormCountry(profile.country)
    setFormOrcid(profile.orcid)
    setFormScholarUrl(profile.scholarUrl)
    setFormPrimaryDiscipline(profile.primaryDiscipline)
    setFormSubDisciplines(profile.subDisciplines)
    setFormKeywords(profile.keywords)
    setFormMaxReviews(profile.maxReviewsPerMonth)
    setFormTurnaround(profile.preferredTurnaround)
    setFormAvailability(profile.availabilityStatus)
    setFormSabbaticalUntil(profile.sabbaticalUntil || "")
    setFormCoiChecked(profile.coiAcknowledged)
    setProfileStep(1)
    setShowProfileModal(true)
  }

  const handleAddKeyword = (kw?: string) => {
    const tag = (kw || formKeywordInput).trim()
    if (tag && !formKeywords.includes(tag)) {
      setFormKeywords(prev => [...prev, tag])
      setFormKeywordInput("")
    }
  }

  const handleRemoveKeyword = (tagToRemove: string) => {
    setFormKeywords(prev => prev.filter(t => t !== tagToRemove))
  }

  const handleToggleSubDiscipline = (sub: string) => {
    if (formSubDisciplines.includes(sub)) {
      setFormSubDisciplines(prev => prev.filter(s => s !== sub))
    } else {
      setFormSubDisciplines(prev => [...prev, sub])
    }
  }

  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const updated: ReviewerProfile = {
      title: formTitle,
      name: formName,
      email: formEmail,
      institution: formInstitution,
      department: formDepartment,
      country: formCountry,
      orcid: formOrcid,
      scholarUrl: formScholarUrl,
      primaryDiscipline: formPrimaryDiscipline,
      subDisciplines: formSubDisciplines,
      keywords: formKeywords,
      maxReviewsPerMonth: formMaxReviews,
      preferredTurnaround: formTurnaround,
      availabilityStatus: formAvailability,
      sabbaticalUntil: formAvailability === "Sabbatical" ? formSabbaticalUntil : "",
      coiAcknowledged: formCoiChecked,
      isCompleted: true
    }
    setProfile(updated)
    markOnboarded()
    if (onSaveProfile) {
      onSaveProfile(updated)
    }
    setShowProfileModal(false)
    setProfileSavedToast(true)
    setTimeout(() => setProfileSavedToast(false), 4000)
  }

  // Calculate tier
  const currentTier = points >= 100 ? "Platinum" : points >= 50 ? "Gold" : points >= 30 ? "Silver" : "Bronze"
  const currentDiscount = points >= 100 ? 100 : points >= 50 ? 50 : points >= 30 ? 30 : points >= 10 ? 10 : 0

  const getCalculatedDate = (days: number) => {
    const d = new Date()
    d.setDate(d.getDate() + days)
    return d.toISOString().split("T")[0]
  }

  const handleOpenAccept = (inv: ReviewInvitationItem) => {
    setSelectedInvForAccept(inv)
    setAcceptCopeCertified(false)
    setAcceptCalendarSynced(false)
  }

  const handleConfirmAccept = () => {
    if (!selectedInvForAccept) return
    const calculatedDeadline = getCalculatedDate(autoDeadlineDays)
    onAcceptInvitation(selectedInvForAccept.id, calculatedDeadline, {
      days5: reminder5Days,
      hours48: reminder48Hours
    })
    setSelectedInvForAccept(null)
  }

  const handleOpenDecline = (inv: ReviewInvitationItem) => {
    setSelectedInvForDecline(inv)
    setDeclineReason("workload")
    setDeclineColleagueName("")
    setDeclineColleagueEmail("")
    setDeclineColleagueAffiliation("")
    setDeclineColleagueNote("")
  }

  const handleConfirmDecline = () => {
    if (!selectedInvForDecline) return
    const rec = declineColleagueName.trim()
      ? {
          name: declineColleagueName.trim(),
          email: declineColleagueEmail.trim(),
          affiliation: declineColleagueAffiliation.trim(),
          note: declineColleagueNote.trim()
        }
      : undefined
    onDeclineInvitation(selectedInvForDecline.id, declineReason, rec)
    setSelectedInvForDecline(null)
  }

  const handleOpenEscalate = (rev: ActiveReviewItem) => {
    setSelectedEscalateRev(rev)
    setEscalateTarget("both")
    setMisconductType("figure_manipulation")
    setMisconductSeverity("high_urgent")
    setMisconductEvidence("")
    setMisconductPageRefs("")
    setMisconductCopeCheck(false)
  }

  const handleConfirmEscalation = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEscalateRev) return
    if (!misconductCopeCheck) {
      alert(isDe ? "Bitte bestätigen Sie die COPE-Schutz- und Sorgfaltserklärung." : "Please certify the COPE ethical disclosure declaration.")
      return
    }
    if (misconductEvidence.trim().length < 20) {
      alert(isDe ? "Bitte beschreiben Sie die Bedenken ausführlicher (mind. 20 Zeichen)." : "Please describe your integrity concern in more detail (minimum 20 characters).")
      return
    }

    setIsSubmittingEscalation(true)
    setTimeout(() => {
      setIsSubmittingEscalation(false)
      const targetLabel = escalateTarget === "both" 
        ? (isDe ? "Integritäts-Manager (IM), zuständigen Editor & Journal Manager (JM als Kopie)" : "Integrity Manager (IM), Handling Editor & Journal Manager (JM - CC copy)") 
        : escalateTarget === "integrity_manager" 
        ? (isDe ? "Integritäts-Manager (IM) & Journal Manager (JM als Kopie)" : "Integrity Manager (IM) & Journal Manager (JM - CC copy)") 
        : (isDe ? "zuständigen Editor & Journal Manager (JM als Kopie)" : "Handling Editor & Journal Manager (JM - CC copy)")
      
      setEscalatedPaperIds(prev => ({
        ...prev,
        [selectedEscalateRev.id]: true,
        [selectedEscalateRev.manuscriptId || ""]: true
      }))

      const successMsg = isDe 
        ? `Fehlverhaltensmeldung für [${selectedEscalateRev.manuscriptId || selectedEscalateRev.id}] wurde vertraulich an ${targetLabel} übermittelt. Der Begutachtungsprozess wurde für eine formelle Prüfung pausiert.`
        : `Confidential misconduct escalation for [${selectedEscalateRev.manuscriptId || selectedEscalateRev.id}] has been dispatched to ${targetLabel}. Editorial progression is now flagged for forensic investigation.`
      
      alert(successMsg)
      setSelectedEscalateRev(null)
    }, 600)
  }

  const handleOpenEval = (rev: ActiveReviewItem) => {
    setSelectedReviewForEval(rev)
    setEvalError("")
    setGeneralComments("")
    setSpecificComments("")
    setEditorConfidentialComments("")
    setEvalCopeCheck(false)
  }

  const handleSubmitEvaluation = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReviewForEval) return

    if (!evalCopeCheck) {
      setEvalError(isDe ? "Bitte bestätigen Sie die Vertraulichkeitserklärung gemäß COPE." : "Please certify the COPE confidentiality and Anti-AI declaration.")
      return
    }

    if (generalComments.trim().length < 30) {
      setEvalError(isDe ? "Bitte geben Sie ausführlichere allgemeine Kommentare ein (mindestens 30 Zeichen)." : "Please enter more substantive general comments (minimum 30 characters).")
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      const payload: ReviewAssessmentData = {
        paperId: selectedReviewForEval.id,
        manuscriptId: selectedReviewForEval.manuscriptId || selectedReviewForEval.id || "SOMED-26-RS001",
        title: selectedReviewForEval.title,
        journal: selectedReviewForEval.journal,
        articleLength,
        tablesCount,
        figuresCount,
        questionnaire: answers,
        questionnaireNotes: notes,
        priorityRating,
        generalCommentsAuthor: generalComments,
        specificCommentsAuthor: specificComments,
        confidentialCommentsEditor: editorConfidentialComments,
        recommendation,
        willingToReviewRevision: willingRevision,
        coiDisclosure: coiStatus,
        coiDetails,
        copeCertified: evalCopeCheck,
        aiAuthenticityScore: 97
      }

      onSubmitScorecard(payload)
      setPoints(prev => Math.min(100, prev + 12))
      setReviewsDone(prev => prev + 1)
      setSelectedReviewForEval(null)
    }, 600)
  }

  const handlePrintCertificate = () => {
    const printWindow = window.open("", "_blank", "width=850,height=750")
    if (!printWindow) return

    const origin = typeof window !== "undefined" ? window.location.origin : ""

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Scholarly Open • Certificate of Verified Peer Review</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
          .cert-box { border: 8px double #166534; padding: 40px; text-align: center; border-radius: 4px; position: relative; }
          .logo-container { margin-bottom: 20px; display: flex; justify-content: center; align-items: center; }
          .logo-wrap { display: inline-flex; align-items: center; gap: 12px; }
          .logo-img { height: 50px; width: auto; }
          .logo-text { font-size: 26px; font-weight: 900; color: #132415; letter-spacing: -0.5px; }
          .logo-text span { color: #F6BB14; }
          h1 { color: #166534; font-size: 24px; text-transform: uppercase; margin: 16px 0 4px; letter-spacing: 2px; }
          h2 { font-size: 14px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; }
          .recipient { font-size: 24px; font-weight: bold; margin: 24px 0 10px; color: #0f172a; border-bottom: 2px solid #e2e8f0; display: inline-block; padding-bottom: 5px; }
          .body-text { font-size: 14px; max-width: 600px; margin: 0 auto 26px; color: #334155; }
          .meta-table { width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 13px; text-align: left; }
          .meta-table th, .meta-table td { border: 1px solid #cbd5e1; padding: 10px 14px; }
          .meta-table th { background: #f8fafc; font-weight: bold; color: #334155; }
          .seal-row { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 36px; padding-top: 18px; border-top: 1px solid #e2e8f0; }
          .seal { border: 2px solid #166534; padding: 8px 16px; font-size: 11px; font-weight: bold; color: #166534; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <div class="cert-box">
          <div class="logo-container">
            <div class="logo-wrap">
              <img src="${origin}/logo-mark.svg" alt="Scholarly Open" class="logo-img" onerror="this.src='${origin}/logo-mark-01.png'" />
              <div class="logo-text">Scholarly <span>Open</span></div>
            </div>
          </div>
          <h1>Certificate of Peer Review</h1>
          <h2>Official Publisher Verification</h2>
          <div class="recipient">Dr. Marcus Vance</div>
          <div class="body-text">
            This official credential certifies that the scholar named above has completed verified, editor-endorsed scientific peer evaluations in full compliance with COPE standards and Scholarly Open ethical guidelines.
          </div>
          <table class="meta-table">
            <tr>
              <th>Manuscript ID</th>
              <th>Verified Review Title</th>
              <th>Journal</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
            <tr>
              <td><strong>SOENG-26-RS001</strong></td>
              <td>Decentralized Federated Learning on Non-IID Data</td>
              <td>Engineering & Applied Sciences</td>
              <td>2026-08-20</td>
              <td>Completed & Released</td>
            </tr>
            <tr>
              <td><strong>SOMED-26-CR002</strong></td>
              <td>Clinical Evaluation of AI Diagnostics in Cardiology</td>
              <td>Scholarly Open: Medicine</td>
              <td>2026-06-12</td>
              <td>Completed & Released</td>
            </tr>
            <tr>
              <td><strong>SOSOC-26-RV003</strong></td>
              <td>Socio-Economic Impacts of Urban Green Spaces</td>
              <td>Social Sciences & Humanities</td>
              <td>2026-05-28</td>
              <td>Completed & Released</td>
            </tr>
          </table>
          <div class="seal-row">
            <div style="text-align: left; font-size: 12px; color: #64748b;">
              <div>Verified ORCID Record: <strong>0000-0004-7711-2093</strong></div>
              <div>Digital Certificate Hash: <strong>SHA256:88a109fe2c041</strong></div>
            </div>
            <div class="seal">Certified Editorial Board Seal</div>
          </div>
        </div>
      </body>
      </html>
    `)
    printWindow.document.close()
    setTimeout(() => {
      printWindow.focus()
      printWindow.print()
    }, 400)
  }

  const handlePrintCV = () => {
    const printWindow = window.open("", "_blank", "width=900,height=900")
    if (!printWindow) return

    const origin = typeof window !== "undefined" ? window.location.origin : ""
    const dateStr = new Date().toISOString().split("T")[0]

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Academic Peer Review Curriculum Vitae • Dr. Marcus Vance</title>
        <style>
          @page { size: A4; margin: 16mm 18mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; padding: 24px; line-height: 1.5; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #166534; padding-bottom: 14px; margin-bottom: 20px; }
          .logo-wrap { display: inline-flex; align-items: center; gap: 10px; }
          .logo-img { height: 42px; width: auto; }
          .logo-text { font-size: 22px; font-weight: 900; color: #132415; }
          .logo-text span { color: #F6BB14; }
          .doc-badge { text-align: right; font-size: 11px; color: #64748b; }
          .doc-badge strong { color: #0f172a; font-size: 12px; display: block; }
          .profile-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; }
          .name { font-size: 18px; font-weight: 800; color: #0f172a; }
          .affil { font-size: 12px; color: #475569; margin-top: 2px; }
          .orcid { font-size: 11px; color: #166534; font-weight: 600; margin-top: 4px; }
          .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
          .stat-box { border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; text-align: center; background: #fff; }
          .stat-val { font-size: 22px; font-weight: 800; color: #166534; }
          .stat-lbl { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-top: 2px; }
          .section-title { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin: 18px 0 10px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; }
          th { background: #f1f5f9; padding: 8px 10px; border: 1px solid #e2e8f0; text-align: left; font-size: 10px; text-transform: uppercase; font-weight: 700; }
          td { padding: 8px 10px; border: 1px solid #e2e8f0; color: #334155; }
          .badge { display: inline-block; padding: 1px 6px; border-radius: 4px; font-size: 9px; font-weight: 600; background: #ecfdf5; color: #059669; }
          .footer { margin-top: 28px; padding-top: 12px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo-wrap">
            <img src="${origin}/logo-mark.svg" alt="Scholarly Open" class="logo-img" onerror="this.src='${origin}/logo-mark-01.png'" />
            <div class="logo-text">Scholarly <span>Open</span></div>
          </div>
          <div class="doc-badge">
            <strong>OFFICIAL PEER REVIEW DOSSIER</strong>
            Issued: ${dateStr} · Verifier ID: SO-REV-CV-2026
          </div>
        </div>

        <div class="profile-card">
          <div>
            <div class="name">Dr. Marcus Vance</div>
            <div class="affil">Senior Peer Reviewer · Cardiology & Applied Sciences</div>
            <div class="orcid">✓ ORCID iD: 0000-0004-7711-2093 (Verified & Synced)</div>
          </div>
          <div style="text-align: right; font-size: 11px; color: #64748b;">
            <div><strong>Publisher:</strong> Scholarly Open</div>
            <div><strong>Ethics Standard:</strong> COPE Certified Reviewer</div>
            <div><strong>Standing:</strong> Excellent / Senior Contributor</div>
          </div>
        </div>

        <div class="section-title">Lifetime Peer Review Impact Metrics</div>
        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-val">12</div>
            <div class="stat-lbl">Completed Reviews</div>
          </div>
          <div class="stat-box">
            <div class="stat-val">4.9 / 5.0</div>
            <div class="stat-lbl">Editor Rigor Score</div>
          </div>
          <div class="stat-box">
            <div class="stat-val">9.2 Days</div>
            <div class="stat-lbl">Avg Turnaround Time</div>
          </div>
          <div class="stat-box">
            <div class="stat-val">4 Journals</div>
            <div class="stat-lbl">Core Disciplines</div>
          </div>
        </div>

        <div class="section-title">Verified Editorial Review Record</div>
        <table>
          <thead>
            <tr>
              <th style="width: 20%;">Manuscript ID</th>
              <th style="width: 45%;">Manuscript Title</th>
              <th style="width: 20%;">Journal</th>
              <th style="width: 15%;">Completed Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>SOENG-26-RS001</strong></td>
              <td>Decentralized Federated Learning on Non-IID Data</td>
              <td>Engineering & Applied Sciences</td>
              <td>2026-08-20</td>
            </tr>
            <tr>
              <td><strong>SOMED-26-CR002</strong></td>
              <td>Clinical Evaluation of AI Diagnostics in Cardiology</td>
              <td>Scholarly Open: Medicine</td>
              <td>2026-06-12</td>
            </tr>
            <tr>
              <td><strong>SOSOC-26-RV003</strong></td>
              <td>Socio-Economic Impacts of Urban Green Spaces</td>
              <td>Social Sciences & Humanities</td>
              <td>2026-05-28</td>
            </tr>
            <tr>
              <td><strong>SOMED-25-RS119</strong></td>
              <td>Pharmacokinetic Optimization of Targeted Nanocarriers</td>
              <td>Scholarly Open: Medicine</td>
              <td>2025-11-14</td>
            </tr>
            <tr>
              <td><strong>SODEC-25-CT044</strong></td>
              <td>Electrochemical Direct Air Capture via Solid Sorbents</td>
              <td>Decarbonization & Carbon Tech</td>
              <td>2025-09-03</td>
            </tr>
          </tbody>
        </table>

        <div class="footer">
          <div>Verified Record Timestamp: ${dateStr} · Cryptographic Hash: SHA256:88a109fe2c041</div>
          <div>Scholarly Open Editorial Registry • Germany & Global Publishing Office</div>
        </div>
      </body>
      </html>
    `)
    printWindow.document.close()
    setTimeout(() => {
      printWindow.focus()
      printWindow.print()
    }, 400)
  }

  const filteredActiveReviews = activeReviews.filter(rev => {
    if (portfolioFilter === "in_progress") return rev.status === "In Progress" || rev.status === "Pending"
    if (portfolioFilter === "completed") return rev.status === "Completed"
    return true
  })

  return (
    <div className="space-y-6">

      {/* ================= TAB 1: OVERVIEW ================= */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          
          {/* Profile Saved Toast Notification */}
          {profileSavedToast && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-semibold">
                  {isDe 
                    ? "Gutachterprofil & Matching-Präferenzen erfolgreich aktualisiert!" 
                    : "Reviewer profile & manuscript matching criteria updated successfully!"}
                </span>
              </div>
              <button 
                onClick={() => setProfileSavedToast(false)}
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 text-xs font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* Top Summary Banner */}
          <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {getFormattedReviewerName(profile.title, profile.name)}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {profile.department ? `${profile.department} · ` : ""}{profile.institution} ({profile.country})
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  onClick={handleOpenProfileModal}
                  variant="outline"
                  className="text-xs h-8 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                  {isDe ? "Profil anpassen" : "Edit Profile & Matching"}
                </Button>
                <Button 
                  onClick={() => onTabChange && onTabChange("wallet")}
                  variant="outline" 
                  className="text-xs h-8 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  <Wallet className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                  {points} Pts ({currentDiscount}% Off)
                </Button>
                <Button 
                  onClick={() => {
                    setCertViewMode("cv")
                    onTabChange && onTabChange("certificate")
                  }}
                  className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-semibold h-8 px-3.5 cursor-pointer shadow-xs"
                >
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  {isDe ? "CV / Zertifikat" : "Export CV PDF"}
                </Button>
              </div>
            </div>

            {/* Active Matching Tags Row */}
            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] font-medium text-slate-400 mr-1 flex items-center gap-1">
                <Tag className="h-3 w-3 text-slate-400" />
                {isDe ? "Fachgebiete:" : "Matching Topics:"}
              </span>
              <span className="font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px] border border-slate-200 dark:border-slate-700">
                {DISCIPLINE_DATA[profile.primaryDiscipline]?.[isDe ? "labelDe" : "labelEn"] || profile.primaryDiscipline}
              </span>
              {profile.keywords.slice(0, 5).map((kw, i) => (
                <span key={i} className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200/80 dark:border-slate-800">
                  #{kw}
                </span>
              ))}
              {profile.keywords.length > 5 && (
                <button 
                  onClick={handleOpenProfileModal}
                  className="text-[10px] font-semibold text-[#0b99ff] hover:underline cursor-pointer"
                >
                  +{profile.keywords.length - 5} {isDe ? "weitere" : "more"}
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Active Reviewer Tier</span>
              <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{currentTier} ({currentDiscount}% Off)</div>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Average Turnaround</span>
              <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">11.4 Days</div>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">On-Time Delivery</span>
              <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">100% On Schedule</div>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Verified Evaluations</span>
              <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{reviewsDone} Manuscripts</div>
            </div>
          </div>

          {/* Reviewer Academy & Masterclasses Hub */}
          <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-slate-200/70 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-700 dark:text-slate-300">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-semibold text-slate-900 dark:text-white text-xs">
                  {isDe ? "Gutachter-Akademie & Weiterbildung" : "Reviewer Academy & Masterclasses"}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-2xl">
                  {isDe 
                    ? "Kurse zu konstruktivem Feedback, COPE-Ethik und KI-Forensik." 
                    : "Sharpen your peer-review rigor with specialized courses in constructive author feedback, COPE ethics, and synthetic image forensics."}
                </p>
              </div>
            </div>

            <Link
              href="/trainings"
              className="text-xs font-semibold text-[#0b99ff] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>{isDe ? "Kurse ansehen" : "Explore Masterclasses"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Pending Invitations Alert Block */}
          {reviewInvitations.length > 0 && (
            <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
              <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#0b99ff]" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    {isDe ? "Ausstehende Begutachtungsanfrage" : "Pending Review Invitation"}
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Standard 14 Days</span>
              </div>

              <div className="p-4 space-y-3">
                {reviewInvitations.map((inv) => (
                  <div key={inv.id} className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#0b99ff]">{inv.journal}</span>
                      <span className="text-slate-400 font-mono text-[11px]">MS ID: {inv.manuscriptId || inv.id}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {inv.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                      {inv.abstract}
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        onClick={() => handleOpenAccept(inv)}
                        className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-semibold px-3.5 py-1.5 h-auto cursor-pointer rounded shadow-xs"
                      >
                        <Check className="h-3.5 w-3.5 mr-1" />
                        {isDe ? "Annehmen & Frist setzen" : "Accept & Set Deadline"}
                      </Button>
                      <Button
                        onClick={() => handleOpenDecline(inv)}
                        variant="outline"
                        className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold px-3 py-1.5 h-auto cursor-pointer rounded"
                      >
                        <X className="h-3.5 w-3.5 mr-1" />
                        {isDe ? "Ablehnen" : "Decline"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Active Assignments Quick Table */}
          <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
            <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {isDe ? "Laufende Begutachtungen" : "Active Review Assignments"}
              </h3>
              {onTabChange && (
                <button 
                  onClick={() => onTabChange("portfolio")} 
                  className="text-xs text-[#0b99ff] hover:underline font-semibold cursor-pointer"
                >
                  {isDe ? "Alle anzeigen" : "View All Portfolio"} →
                </button>
              )}
            </div>

            <div className="p-4 space-y-3">
              {activeReviews.filter(r => r.status === "In Progress" || r.status === "Pending").map((rev) => {
                const forensicData = FORENSIC_PROFILES[rev.manuscriptId || rev.id] || FORENSIC_PROFILES["SOMED-26-RS001"]
                const isEscalated = !!(escalatedPaperIds[rev.id] || escalatedPaperIds[rev.manuscriptId || ""])
                return (
                  <div 
                    key={rev.id} 
                    className={`p-3.5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                      isEscalated 
                        ? "border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20" 
                        : "border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{rev.journal}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.2 rounded">
                          Due in 11 days ({rev.deadline})
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
                          <ShieldCheck className="h-3 w-3 text-emerald-600" />
                          AI: {forensicData?.aiScore || "4%"} · Figures: Clean ✓
                        </span>
                        {isEscalated && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-700">
                            <AlertTriangle className="h-3 w-3 text-amber-600" />
                            {isDe ? "Eskaliert" : "Escalated to IM"}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{rev.title}</h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedPackageRev(rev)}
                        className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold px-2.5 py-1.5 h-auto cursor-pointer rounded"
                        title={isDe ? "Blinded PDF & Begleitdaten herunterladen" : "Download Blinded Manuscript PDF & Data"}
                      >
                        <FileDown className="h-3.5 w-3.5 mr-1 text-slate-500" />
                        {isDe ? "Manuskript-Paket" : "Blinded Package"}
                      </Button>
                      
                      {!isEscalated ? (
                        <Button
                          variant="outline"
                          onClick={() => handleOpenEscalate(rev)}
                          className="border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-xs font-semibold px-2.5 py-1.5 h-auto cursor-pointer rounded"
                          title={isDe ? "Fehlverhalten an Editor / IM melden" : "Escalate misconduct to Handling Editor or Integrity Manager"}
                        >
                          <AlertTriangle className="h-3.5 w-3.5 mr-1 text-amber-600 dark:text-amber-400" />
                          {isDe ? "Fehlverhalten melden" : "Escalate"}
                        </Button>
                      ) : null}

                      <Button
                        onClick={() => handleOpenEval(rev)}
                        className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-semibold px-3 py-1.5 h-auto cursor-pointer rounded shadow-xs"
                      >
                        <FileText className="h-3.5 w-3.5 mr-1" />
                        {isDe ? "Gutachten ausfüllen" : "Open Assessment Form"}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      )}

      {/* ================= TAB 2: PORTFOLIO & ARCHIVE ================= */}
      {activeTab === "portfolio" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isDe ? "Begutachtungs-Portfolio & Archiv" : "Review Portfolio & Assessment History"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isDe ? "Verwalten Sie aktive Begutachtungen und sehen Sie archivierte Berichte ein." : "Track in-progress evaluations and inspect past verified review reports."}
              </p>
            </div>

            {/* Sub-filter chips */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded border border-slate-200 dark:border-slate-800 text-xs font-medium">
              <button
                onClick={() => setPortfolioFilter("all")}
                className={`px-2.5 py-1 rounded cursor-pointer ${portfolioFilter === "all" ? "bg-white dark:bg-slate-800 font-bold text-slate-900 dark:text-white shadow-2xs" : "text-slate-600 dark:text-slate-400"}`}
              >
                {isDe ? "Alle" : "All"} ({activeReviews.length})
              </button>
              <button
                onClick={() => setPortfolioFilter("in_progress")}
                className={`px-2.5 py-1 rounded cursor-pointer ${portfolioFilter === "in_progress" ? "bg-white dark:bg-slate-800 font-bold text-slate-900 dark:text-white shadow-2xs" : "text-slate-600 dark:text-slate-400"}`}
              >
                {isDe ? "In Bearbeitung" : "In Progress"}
              </button>
              <button
                onClick={() => setPortfolioFilter("completed")}
                className={`px-2.5 py-1 rounded cursor-pointer ${portfolioFilter === "completed" ? "bg-white dark:bg-slate-800 font-bold text-slate-900 dark:text-white shadow-2xs" : "text-slate-600 dark:text-slate-400"}`}
              >
                {isDe ? "Abgeschlossen" : "Completed"}
              </button>
            </div>
          </div>

          <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredActiveReviews.map((rev) => {
                const forensicData = FORENSIC_PROFILES[rev.manuscriptId || rev.id] || FORENSIC_PROFILES["SOMED-26-RS001"]
                const isEscalated = !!(escalatedPaperIds[rev.id] || escalatedPaperIds[rev.manuscriptId || ""])
                return (
                  <div key={rev.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold text-[#0b99ff] dark:text-[#0b99ff] uppercase">{rev.journal}</span>
                        <span className="text-slate-300">•</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          rev.status === "Completed" 
                            ? "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400" 
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400"
                        }`}>
                          {rev.status === "Completed" ? (isDe ? "Abgeschlossen" : "Completed & Verified") : (isDe ? "In Bearbeitung" : "In Progress")}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                          AI: {forensicData?.aiScore || "4%"} · Figures: Clean ✓
                        </span>
                        {isEscalated && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-700">
                            <AlertTriangle className="h-3 w-3 text-amber-600" />
                            {isDe ? "Eskaliert (IM-Prüfung)" : "Escalated to IM"}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{rev.title}</h4>
                      
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {rev.status === "Completed" ? (
                          <span>{isDe ? "Empfehlung:" : "Verdict:"} <strong>{rev.recommendation || "Minor Revision"}</strong> • {isDe ? "Geprüft von Editor" : "Signed off by Handling Editor"}</span>
                        ) : (
                          <span>{isDe ? "Frist:" : "Deadline:"} <strong>{rev.deadline}</strong> (11 {isDe ? "Tage verbleibend" : "days remaining"})</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedPackageRev(rev)}
                        className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold px-2.5 py-1.5 h-auto cursor-pointer rounded"
                      >
                        <FileDown className="h-3.5 w-3.5 mr-1 text-[#0b99ff]" />
                        {isDe ? "Paket" : "Package"}
                      </Button>

                      {rev.status === "In Progress" || rev.status === "Pending" ? (
                        <>
                          {!isEscalated && (
                            <Button
                              variant="outline"
                              onClick={() => handleOpenEscalate(rev)}
                              className="border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-xs font-semibold px-2.5 py-1.5 h-auto cursor-pointer rounded"
                            >
                              <AlertTriangle className="h-3.5 w-3.5 mr-1 text-amber-600" />
                              {isDe ? "Melden" : "Escalate"}
                            </Button>
                          )}
                          <Button
                            onClick={() => handleOpenEval(rev)}
                            className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-semibold px-3 py-1.5 h-auto cursor-pointer rounded"
                          >
                            <FileText className="h-3.5 w-3.5 mr-1" />
                            {isDe ? "Formular öffnen" : "Open Assessment"}
                          </Button>
                        </>
                      ) : (
                        <span className="text-xs font-semibold text-green-600 dark:text-green-400 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4" /> {isDe ? "Im Archiv hinterlegt" : "Archived in ORCID"}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      )}

      {/* ================= TAB 3: AI & PAPER FORENSICS ================= */}
      {activeTab === "forensics" && (() => {
        const activeProfile = FORENSIC_PROFILES[selectedForensicPaperId] || FORENSIC_PROFILES["SOMED-26-RS001"]
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isDe ? "KI- & Manuskript-Forensik-Dashboard" : "Paper Forensics & Synthetic Content Analyzer"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isDe ? "Automatische Integritätsprüfungen zur Unterstützung von Gutachtern vor der Bewertung." : "Automated integrity scans assisting reviewers in identifying synthetic text and data anomalies."}
                </p>
              </div>

              {/* Manuscript Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                  {isDe ? "Manuskript:" : "Manuscript:"}
                </span>
                <select
                  value={selectedForensicPaperId}
                  onChange={(e) => setSelectedForensicPaperId(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                >
                  <option value="SOMED-26-RS001">SOMED-26-RS001 (AI Diagnostics Cardiology)</option>
                  <option value="SOENG-26-RS002">SOENG-26-RS002 (Federated Learning Non-IID)</option>
                  <option value="SOSOC-26-RV003">SOSOC-26-RV003 (Urban Green Spaces Socio-Economic)</option>
                </select>
              </div>
            </div>

            {/* Misconduct Escalation Quick Action Banner */}
            <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold text-amber-950 dark:text-amber-200">
                    {isDe ? "Integritätsbedenken oder Fälschungsvorwürfe?" : "Suspected Image Manipulation or Research Misconduct?"}
                  </div>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300">
                    {isDe 
                      ? "Leiten Sie diesen Fall direkt an den Integrity Manager (IM) oder den zuständigen Editor weiter (COPE-Whistleblower-Schutz)."
                      : "Directly escalate forensic evidence to the Integrity Manager (IM) and Handling Editor under COPE whistleblower protections."}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => {
                  const rev = activeReviews.find(r => r.id === selectedForensicPaperId || r.manuscriptId === selectedForensicPaperId) || activeReviews[0]
                  if (rev) handleOpenEscalate(rev)
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-2 h-auto cursor-pointer shrink-0 rounded shadow-xs"
              >
                <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                {isDe ? "An IM / Editor eskalieren" : "Escalate to IM / Editor"}
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-lg shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] uppercase font-bold text-slate-400">AI Linguistic Index</div>
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-950/40 px-1.5 py-0.2 rounded">
                    {activeProfile.aiStatus}
                  </span>
                </div>
                <div className="text-xl font-bold text-green-600 dark:text-green-400 mt-1">{activeProfile.aiScore}</div>
                <p className="text-[11px] text-slate-500 mt-1">{activeProfile.aiConfidence}</p>
              </Card>

              <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-lg shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Image & Figure Forensics</div>
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-950/40 px-1.5 py-0.2 rounded">
                    {activeProfile.figureStatus}
                  </span>
                </div>
                <div className="text-xl font-bold text-green-600 dark:text-green-400 mt-1">{activeProfile.figureScore}</div>
                <p className="text-[11px] text-slate-500 mt-1">{activeProfile.figureDetails}</p>
              </Card>

              <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-lg shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Citation & COI Graph</div>
                  <span className="text-[10px] font-bold text-[#0b99ff] bg-sky-50 dark:bg-sky-950/40 px-1.5 py-0.2 rounded">
                    {activeProfile.citationStatus}
                  </span>
                </div>
                <div className="text-xl font-bold text-[#0b99ff] dark:text-[#0b99ff] mt-1">{activeProfile.citationScore}</div>
                <p className="text-[11px] text-slate-500 mt-1">{activeProfile.citationDetails}</p>
              </Card>
            </div>

            {/* Collapsible Paper Mill Spotting Checklist */}
            <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => setIsFraudGuideExpanded(!isFraudGuideExpanded)}
                className="w-full p-4 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#0b99ff] dark:text-[#0b99ff]" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {isDe ? "COPE-Leitfaden: Wie man Paper-Mill-Muster & gefälschte Daten erkennt" : "COPE Quick-Guide: How to Spot Paper Mills & Fabricated Data"}
                  </span>
                </div>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isFraudGuideExpanded ? "rotate-180" : ""}`} />
              </button>

              {isFraudGuideExpanded && (
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-xs space-y-2.5 text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-950">
                  <div className="flex items-start gap-2">
                    <span className="text-[#0b99ff] font-bold">•</span>
                    <div><strong>Generic Western Blots / Micrographs:</strong> Check for duplicated background noise or identical bands reused across different experimental conditions.</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#0b99ff] font-bold">•</span>
                    <div><strong>Irrelevant Keyword Stuffing:</strong> Paper mills often insert disconnected medical keywords to artificially inflate indexing matches.</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#0b99ff] font-bold">•</span>
                    <div><strong>Non-Institutional Email Addresses:</strong> Verify whether corresponding authors use free webmail instead of verified institutional academic domains.</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#0b99ff] font-bold">•</span>
                    <div><strong>Unrealistic Patient Sample Sizes:</strong> Scrutinize clinical studies reporting massive participant numbers without clear multi-center IRB documentation.</div>
                  </div>
                </div>
              )}
            </Card>

            {/* Forensics Training Banner */}
            <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-[#0b99ff] dark:text-[#0b99ff]" />
                <span className="text-slate-700 dark:text-slate-300">
                  {isDe 
                    ? "Möchten Sie mehr über die Erkennung manipulierter Grafiken lernen?" 
                    : "Want hands-on practice identifying manipulated images and synthetic datasets?"}
                </span>
              </div>
              <Link
                href="/trainings"
                className="text-[#0b99ff] dark:text-[#0b99ff] font-semibold hover:underline flex items-center gap-1 shrink-0"
              >
                <span>{isDe ? "Training starten" : "Take Masterclass"}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        )
      })()}

      {/* ================= TAB 4: APC CREDIT WALLET ================= */}
      {activeTab === "wallet" && (
        <div className="space-y-4">
          
          {/* Main Vault Card */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 space-y-6 shadow-xs">
            
            {/* Header: Balance & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                    {points}
                  </span>
                  <span className="text-xs font-bold text-slate-400">/ 100 PTS</span>
                </div>

                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

                <div>
                  <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    Silver Tier · 30% APC Waiver
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    ORCID: 0000-0004-7711-2093 · 312 Days Left
                  </div>
                </div>
              </div>

              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 sm:text-right">
                <span>{100 - points} pts to 100% Free Waiver</span>
              </div>
            </div>

            {/* Clean Green Progress Track with Points */}
            <div className="space-y-3 pt-1">
              {/* The Green Progress Bar */}
              <div className="relative py-2">
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500" 
                    style={{ width: `${points}%` }} 
                  />
                </div>

                {/* Milestone Node Points on the Bar */}
                <div className="relative flex justify-between text-[11px] pt-2 font-medium">
                  <div className="text-left">
                    <span className="block font-bold text-slate-900 dark:text-white">0</span>
                    <span className="text-[10px] text-slate-400">Start</span>
                  </div>

                  <div className="text-center">
                    <span className="block font-bold text-emerald-700 dark:text-emerald-400">10 Pts</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-500 font-medium">Bronze (10%)</span>
                  </div>

                  <div className="text-center">
                    <span className="block font-bold text-emerald-800 dark:text-emerald-300">30 Pts</span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">Silver (30% Active)</span>
                  </div>

                  <div className="text-center">
                    <span className="block font-bold text-slate-600 dark:text-slate-400">50 Pts</span>
                    <span className="text-[10px] text-slate-400">Gold (50%)</span>
                  </div>

                  <div className="text-right">
                    <span className="block font-bold text-slate-600 dark:text-slate-400">100 Pts</span>
                    <span className="text-[10px] text-slate-400">Platinum (100%)</span>
                  </div>
                </div>
              </div>

              {/* 4 Minimal Tier Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
                  <div className="text-slate-400 text-[10px] font-semibold">10 PTS</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Bronze</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">10% APC Waiver</div>
                </div>

                <div className="p-3 rounded-lg border-2 border-emerald-600 dark:border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 text-xs">
                  <div className="text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">30 PTS · ACTIVE</div>
                  <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">Silver</div>
                  <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">30% APC Waiver</div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
                  <div className="text-slate-400 text-[10px] font-semibold">50 PTS</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Gold</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">50% APC Waiver</div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
                  <div className="text-slate-400 text-[10px] font-semibold">100 PTS</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Platinum</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">100% Free Waiver</div>
                </div>
              </div>
            </div>

            {/* Points Guide */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <div className="font-bold text-slate-900 dark:text-white">+10 Base Points</div>
                <div className="text-[11px] text-slate-500">Editor-endorsed peer review evaluation</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <div className="font-bold text-emerald-700 dark:text-emerald-400">+2.5 On-Time Bonus</div>
                <div className="text-[11px] text-slate-500">Submitted within agreed 14-day window</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <div className="font-bold text-emerald-700 dark:text-emerald-400">+2.5 Quality Bonus</div>
                <div className="text-[11px] text-slate-500">5-Star rigor score endorsed by editor</div>
              </div>
            </div>

            {/* Compact Annual Calculator */}
            <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">Annual Contribution Simulator</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">{calcReviews} Reviews / Year</span>
              </div>
              <input
                type="range"
                min={1}
                max={12}
                value={calcReviews}
                onChange={(e) => setCalcReviews(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-1">
                <div className="p-2 bg-white dark:bg-slate-950 rounded border border-slate-200/80 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Credits</div>
                  <div className="font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">€{calcReviews * 50}</div>
                </div>
                <div className="p-2 bg-white dark:bg-slate-950 rounded border border-slate-200/80 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Waiver Rate</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">{Math.min(100, Math.round((calcReviews * 50 / 1500) * 100))}%</div>
                </div>
                <div className="p-2 bg-white dark:bg-slate-950 rounded border border-slate-200/80 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Grant Value</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">€{calcReviews * 50}</div>
                </div>
                <div className="p-2 bg-white dark:bg-slate-950 rounded border border-slate-200/80 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Service</div>
                  <div className="font-bold text-slate-700 dark:text-slate-300 mt-0.5">{calcReviews * 6} hrs</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ================= TAB 5: CERTIFICATE & PEER REVIEW CV EXPORT ================= */}
      {activeTab === "certificate" && (
        <div className="space-y-5">
          
          {/* Header & Sub-Tab Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isDe ? "Verifiziertes Gutachter-Zertifikat & Akademischer CV" : "Verified Reviewer Certificate & Academic CV"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isDe ? "Offizielle Nachweise und vollständiges Gutachter-Dossier für Berufungsverfahren, Tenure und Fördermittel." : "Official verification credentials and comprehensive peer review dossier for tenure, promotion, and grant filings."}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold shadow-2xs shrink-0">
              <button
                type="button"
                onClick={() => setCertViewMode("certificate")}
                className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                  certViewMode === "certificate" 
                    ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs font-bold border border-slate-200/80 dark:border-slate-700" 
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>{isDe ? "Offizielles Zertifikat" : "Official Certificate"}</span>
              </button>
              <button
                type="button"
                onClick={() => setCertViewMode("cv")}
                className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                  certViewMode === "cv" 
                    ? "bg-white dark:bg-slate-900 text-[#0b99ff] dark:text-sky-400 shadow-xs font-bold border border-slate-200/80 dark:border-slate-700" 
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <FileText className="h-4 w-4 text-[#0b99ff]" />
                <span>{isDe ? "Akademischer Reviewer-CV" : "Peer Review Academic CV"}</span>
              </button>
            </div>
          </div>

          {/* VIEW 1: OFFICIAL CERTIFICATE */}
          {certViewMode === "certificate" && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  onClick={handlePrintCertificate}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  {isDe ? "Offizielles Zertifikat drucken (PDF)" : "Print Official Certificate (PDF)"}
                </Button>
              </div>

              {/* Certificate Card with Green & Yellow Logo */}
              <Card className="bg-white dark:bg-slate-950 border-4 border-double border-emerald-700/80 dark:border-emerald-600/80 rounded-2xl p-8 sm:p-10 shadow-sm space-y-6 text-center max-w-2xl mx-auto relative overflow-hidden">
                
                {/* Official Brand Logo - Green Mark with Yellow Open */}
                <div className="flex items-center justify-center gap-3">
                  <img 
                    src="/logo-mark.svg" 
                    alt="Scholarly Open" 
                    className="h-12 w-auto object-contain"
                    onError={(e) => {
                      ;(e.currentTarget as HTMLImageElement).src = '/logo-mark-01.png'
                    }}
                  />
                  <div className="text-2xl font-black text-[#132415] dark:text-white tracking-tight">
                    Scholarly <span className="text-[#F6BB14]">Open</span>
                  </div>
                </div>

                <div className="text-[11px] uppercase tracking-widest text-emerald-800 dark:text-emerald-400 font-bold">
                  Official Editorial Board Verification
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Certificate of Verified Peer Review
                </h2>

                <div className="inline-block border-b-2 border-emerald-600 pb-1 text-lg font-bold text-slate-900 dark:text-slate-100">
                  Dr. Marcus Vance
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                  This official credential confirms that Dr. Marcus Vance has completed verified, editor-endorsed scientific peer evaluations in full compliance with COPE standards and Scholarly Open ethical guidelines.
                </p>

                <div className="max-w-md mx-auto text-left text-xs border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-900/50 space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Verified ORCID Record:</span>
                    <strong className="text-slate-900 dark:text-white font-mono">0000-0004-7711-2093</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Completed Reviews:</span>
                    <strong className="text-slate-900 dark:text-white">3 Verified Manuscripts (2026)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Crossref Review Activity:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-bold">Synced & Timestamped ✓</strong>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Hash: SHA256:88a109fe2c041</span>
                  <span className="font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">Editorial Board Certified Seal</span>
                </div>
              </Card>
            </div>
          )}

          {/* VIEW 2: COMPREHENSIVE PEER REVIEW ACADEMIC CV & IMPACT DOSSIER */}
          {certViewMode === "cv" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  <span>Tenure-Ready Academic Dossier · Synchronized with ORCID and Web of Science</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      const orcidData = JSON.stringify({
                        scholar: "Dr. Marcus Vance",
                        orcid: "0000-0004-7711-2093",
                        publisher: "Scholarly Open",
                        verifiedReviews: [
                          { id: "SOENG-26-RS001", journal: "Engineering & Applied Sciences", date: "2026-08-20", type: "review", blind: "double-blind" },
                          { id: "SOMED-26-CR002", journal: "Scholarly Open: Medicine", date: "2026-06-12", type: "review", blind: "double-blind" },
                          { id: "SOSOC-26-RV003", journal: "Social Sciences & Humanities", date: "2026-05-28", type: "review", blind: "double-blind" }
                        ]
                      }, null, 2)
                      const blob = new Blob([orcidData], { type: "application/json" })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement("a")
                      a.href = url
                      a.download = "Dr_Marcus_Vance_PeerReview_ORCID_Record.json"
                      a.click()
                    }}
                    variant="outline"
                    className="text-xs font-semibold px-3 py-2 cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>{isDe ? "ORCID JSON Exportieren" : "Export ORCID (JSON)"}</span>
                  </Button>

                  <Button
                    onClick={handlePrintCV}
                    className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-bold px-4 py-2 cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>{isDe ? "Akademischen CV drucken (PDF)" : "Print Academic CV (PDF)"}</span>
                  </Button>
                </div>
              </div>

              {/* Complete Academic CV Layout */}
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
                
                {/* CV Header with Green & Yellow Logo */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b-2 border-[#166534] dark:border-emerald-600">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/logo-mark.svg" 
                      alt="Scholarly Open" 
                      className="h-10 w-auto object-contain"
                      onError={(e) => {
                        ;(e.currentTarget as HTMLImageElement).src = '/logo-mark-01.png'
                      }}
                    />
                    <div className="text-xl font-black text-[#132415] dark:text-white">
                      Scholarly <span className="text-[#F6BB14]">Open</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right text-xs">
                    <div className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                      Academic Peer Review Dossier
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Verifier ID: SO-REV-CV-2026 · Updated 2026-08-24
                    </div>
                  </div>
                </div>

                {/* Scholar Profile Card */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Dr. Marcus Vance, MD, PhD</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Senior Peer Reviewer · Cardiology & Applied Computational Sciences</p>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-semibold font-mono">
                      <span>✓ ORCID: 0000-0004-7711-2093</span>
                      <span>•</span>
                      <span>WoS: WOS-REV-2026-9812</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-wrap gap-2 text-[11px]">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                      COPE Certified Reviewer
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-bold">
                      Lead Reviewer Tier
                    </span>
                  </div>
                </div>

                {/* Lifetime Summary Metrics */}
                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-700 dark:text-slate-300">
                    Lifetime Peer Review Summary Metrics
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
                      <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">12</div>
                      <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">Completed Reviews</div>
                    </div>
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
                      <div className="text-2xl font-extrabold text-[#0b99ff] dark:text-[#0b99ff]">4.9 / 5.0</div>
                      <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">Editorial Rigor Score</div>
                    </div>
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
                      <div className="text-2xl font-extrabold text-slate-900 dark:text-white">9.2 Days</div>
                      <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">Avg Turnaround Time</div>
                    </div>
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
                      <div className="text-2xl font-extrabold text-slate-900 dark:text-white">4 Journals</div>
                      <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">Core Disciplines</div>
                    </div>
                  </div>
                </div>

                {/* Journal Contributions Breakdown */}
                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-700 dark:text-slate-300">
                    Disciplinary Portfolio Contributions
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40">
                      <div className="font-bold text-slate-900 dark:text-white">Scholarly Open: Medicine</div>
                      <div className="text-[11px] text-slate-500">6 Reviews · Lead Reviewer</div>
                    </div>
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40">
                      <div className="font-bold text-slate-900 dark:text-white">Engineering & Applied Sciences</div>
                      <div className="text-[11px] text-slate-500">3 Reviews · Senior Reviewer</div>
                    </div>
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40">
                      <div className="font-bold text-slate-900 dark:text-white">Social Sciences & Humanities</div>
                      <div className="text-[11px] text-slate-500">2 Reviews · Reviewer</div>
                    </div>
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40">
                      <div className="font-bold text-slate-900 dark:text-white">Decarbonization & Clean Tech</div>
                      <div className="text-[11px] text-slate-500">1 Review · Expert Contributor</div>
                    </div>
                  </div>
                </div>

                {/* Verified Manuscript Activity Log Table */}
                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-700 dark:text-slate-300">
                    Verified Chronological Review Activity Log
                  </h4>
                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100/80 dark:bg-slate-900 text-slate-700 dark:text-slate-300 uppercase text-[10px] font-bold">
                        <tr>
                          <th className="p-3 border-b border-slate-200 dark:border-slate-800">Manuscript ID</th>
                          <th className="p-3 border-b border-slate-200 dark:border-slate-800">Title</th>
                          <th className="p-3 border-b border-slate-200 dark:border-slate-800">Journal</th>
                          <th className="p-3 border-b border-slate-200 dark:border-slate-800">Completed Date</th>
                          <th className="p-3 border-b border-slate-200 dark:border-slate-800">Protocol</th>
                          <th className="p-3 border-b border-slate-200 dark:border-slate-800">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        <tr>
                          <td className="p-3 font-mono font-bold text-[#0b99ff] dark:text-[#0b99ff]">SOENG-26-RS001</td>
                          <td className="p-3 font-medium text-slate-900 dark:text-white">Decentralized Federated Learning on Non-IID Data</td>
                          <td className="p-3 text-slate-600 dark:text-slate-400">Engineering & Applied Sciences</td>
                          <td className="p-3 text-slate-500">2026-08-20</td>
                          <td className="p-3 text-slate-500">Double-Blind</td>
                          <td className="p-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">Verified ✓</span></td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-[#0b99ff] dark:text-[#0b99ff]">SOMED-26-CR002</td>
                          <td className="p-3 font-medium text-slate-900 dark:text-white">Clinical Evaluation of AI Diagnostics in Cardiology</td>
                          <td className="p-3 text-slate-600 dark:text-slate-400">Scholarly Open: Medicine</td>
                          <td className="p-3 text-slate-500">2026-06-12</td>
                          <td className="p-3 text-slate-500">Double-Blind</td>
                          <td className="p-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">Verified ✓</span></td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-[#0b99ff] dark:text-[#0b99ff]">SOSOC-26-RV003</td>
                          <td className="p-3 font-medium text-slate-900 dark:text-white">Socio-Economic Impacts of Urban Green Spaces</td>
                          <td className="p-3 text-slate-600 dark:text-slate-400">Social Sciences & Humanities</td>
                          <td className="p-3 text-slate-500">2026-05-28</td>
                          <td className="p-3 text-slate-500">Double-Blind</td>
                          <td className="p-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">Verified ✓</span></td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-[#0b99ff] dark:text-[#0b99ff]">SOMED-25-RS119</td>
                          <td className="p-3 font-medium text-slate-900 dark:text-white">Pharmacokinetic Optimization of Targeted Nanocarriers</td>
                          <td className="p-3 text-slate-600 dark:text-slate-400">Scholarly Open: Medicine</td>
                          <td className="p-3 text-slate-500">2025-11-14</td>
                          <td className="p-3 text-slate-500">Double-Blind</td>
                          <td className="p-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">Verified ✓</span></td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-[#0b99ff] dark:text-[#0b99ff]">SODEC-25-CT044</td>
                          <td className="p-3 font-medium text-slate-900 dark:text-white">Electrochemical Direct Air Capture via Solid Sorbents</td>
                          <td className="p-3 text-slate-600 dark:text-slate-400">Decarbonization & Carbon Tech</td>
                          <td className="p-3 text-slate-500">2025-09-03</td>
                          <td className="p-3 text-slate-500">Double-Blind</td>
                          <td className="p-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">Verified ✓</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
                  <div>Digital Cryptographic Hash: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">SHA256:88a109fe2c041</span></div>
                  <div>Scholarly Open Editorial Registry • Germany & Global Publishing</div>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* ================= MODAL 1: ACCEPT INVITATION & AUTO-DEADLINE ================= */}
      <Dialog open={!!selectedInvForAccept} onOpenChange={(open) => !open && setSelectedInvForAccept(null)}>
        <DialogContent className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 sm:max-w-lg rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#0b99ff] dark:text-[#0b99ff]" />
              {isDe ? "Begutachtung annehmen & Frist festlegen" : "Accept Assignment & Configure Schedule"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              {isDe ? "Prüfen Sie den Abgabetermin und aktivieren Sie automatische Erinnerungen." : "Review target delivery timeline, auto-reminders, and confidentiality commitment."}
            </DialogDescription>
          </DialogHeader>

          {selectedInvForAccept && (
            <div className="space-y-4 py-2 text-xs">
              <div className="p-3 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-500 font-semibold">{selectedInvForAccept.journal}</div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">{selectedInvForAccept.title}</div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  {isDe ? "Berechneter Abgabetermin (Standard 14 Tage):" : "Calculated Submission Deadline:"}
                </label>
                <div className="flex items-center gap-2">
                  <input 
                    type="date"
                    value={getCalculatedDate(autoDeadlineDays)}
                    readOnly
                    className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 font-semibold text-slate-800 dark:text-slate-200 text-xs"
                  />
                  <span className="text-[11px] text-slate-500 whitespace-nowrap">
                    ({autoDeadlineDays} {isDe ? "Tage ab heute" : "days from today"})
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                  {isDe ? "Automatische Benachrichtigungen & Kalender-Sync:" : "Automated Reminders & Calendar Sync:"}
                </span>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={reminder5Days}
                    onChange={(e) => setReminder5Days(e.target.checked)}
                    className="mt-0.5 h-3.5 w-3.5 rounded text-[#0b99ff] focus:ring-[#0b99ff]"
                  />
                  <span className="text-slate-600 dark:text-slate-300">
                    {isDe ? "Sanfte Erinnerung 5 Tage vor Abgabetermin per E-Mail" : "Gentle email reminder 5 days before deadline"}
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={reminder48Hours}
                    onChange={(e) => setReminder48Hours(e.target.checked)}
                    className="mt-0.5 h-3.5 w-3.5 rounded text-[#0b99ff] focus:ring-[#0b99ff]"
                  />
                  <span className="text-slate-600 dark:text-slate-300">
                    {isDe ? "Dringende Erinnerung 48 Stunden vor Fälligkeit" : "Priority reminder notice 48 hours before due date"}
                  </span>
                </label>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setAcceptCalendarSynced(true)}
                    className="text-xs font-semibold text-[#0b99ff] dark:text-[#0b99ff] hover:underline flex items-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    {acceptCalendarSynced 
                      ? (isDe ? "✓ Im Kalender vorgemerkt (.ics exportiert)" : "✓ Calendar entry pre-configured (.ics ready)") 
                      : (isDe ? "Zu Google Kalender / Outlook (.ics) hinzufügen" : "Add to Google Calendar / Outlook (.ics)")}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-400">
                  <ShieldCheck className="h-4 w-4" />
                  <span>{isDe ? "COPE-Vertraulichkeit & Anti-KI-Erklärung" : "COPE Confidentiality & Anti-AI Declaration"}</span>
                </div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={acceptCopeCertified}
                    onChange={(e) => setAcceptCopeCertified(e.target.checked)}
                    className="mt-0.5 h-3.5 w-3.5 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-[11px] text-amber-900 dark:text-amber-300 leading-tight">
                    {isDe 
                      ? "Ich versichere, dass ich dieses unveröffentlichte Manuskript nicht in öffentliche generative KI-Modelle (wie ChatGPT) hochlade und die Autorendaten strikt vertraulich behandle."
                      : "I confirm that I will not upload this unpublished manuscript to public generative AI tools (such as ChatGPT), and will uphold strict author confidentiality under COPE standards."}
                  </span>
                </label>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button 
              onClick={() => setSelectedInvForAccept(null)}
              variant="ghost"
              className="text-xs font-semibold cursor-pointer"
            >
              {isDe ? "Abbrechen" : "Cancel"}
            </Button>
            <Button
              onClick={handleConfirmAccept}
              disabled={!acceptCopeCertified}
              className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              {isDe ? "Verbindlich annehmen" : "Confirm Acceptance"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL 2: DECLINE INVITATION & RECOMMEND PEER ================= */}
      <Dialog open={!!selectedInvForDecline} onOpenChange={(open) => !open && setSelectedInvForDecline(null)}>
        <DialogContent className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 sm:max-w-lg rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              {isDe ? "Begutachtung ablehnen & Kollegen empfehlen" : "Decline Review & Recommend Peer"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              {isDe ? "Geben Sie kurz den Grund an und schlagen Sie optional qualifizierte Fachkollegen vor." : "State your reason for declining and optionally suggest alternative domain experts for the editor."}
            </DialogDescription>
          </DialogHeader>

          {selectedInvForDecline && (
            <div className="space-y-4 py-2 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  {isDe ? "Grund für die Ablehnung:" : "Reason for declining:"}
                </label>
                <select
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs focus:ring-1 focus:ring-[#0b99ff]"
                >
                  <option value="workload">{isDe ? "Hohe Arbeitsbelastung / Keine Zeit in den nächsten 3 Wochen" : "Heavy workload / Insufficient time in the next 3 weeks"}</option>
                  <option value="scope">{isDe ? "Außerhalb meines direkten Fachgebiets" : "Outside my direct technical expertise"}</option>
                  <option value="coi">{isDe ? "Interessenkonflikt mit Autoren oder Institut" : "Conflict of Interest (COI) with authors or institution"}</option>
                  <option value="leave">{isDe ? "Forschungsfreisemester / Urlaub" : "Academic leave / sabbatical"}</option>
                  <option value="other">{isDe ? "Sonstiger Grund" : "Other"}</option>
                </select>
              </div>

              <div className="p-3.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-xs">
                    {isDe ? "Empfehlung alternativer Gutachter (Optional)" : "Suggest Alternate Reviewers (Optional)"}
                  </span>
                  <span className="text-[10px] text-slate-400">{isDe ? "Hilft dem Editor" : "Helps the editor"}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input 
                    type="text"
                    placeholder={isDe ? "Name des Kollegen" : "Colleague Full Name"}
                    value={declineColleagueName}
                    onChange={(e) => setDeclineColleagueName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                  />
                  <input 
                    type="email"
                    placeholder={isDe ? "Akademische E-Mail" : "Academic Email"}
                    value={declineColleagueEmail}
                    onChange={(e) => setDeclineColleagueEmail(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                  />
                </div>

                <input 
                  type="text"
                  placeholder={isDe ? "Institution / Universität" : "Institution / University affiliation"}
                  value={declineColleagueAffiliation}
                  onChange={(e) => setDeclineColleagueAffiliation(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                />

                <input 
                  type="text"
                  placeholder={isDe ? "Kurzer Hinweis zur Eignung" : "Brief suitability note"}
                  value={declineColleagueNote}
                  onChange={(e) => setDeclineColleagueNote(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button 
              onClick={() => setSelectedInvForDecline(null)}
              variant="ghost"
              className="text-xs font-semibold cursor-pointer"
            >
              {isDe ? "Abbrechen" : "Cancel"}
            </Button>
            <Button
              onClick={handleConfirmDecline}
              className="bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-semibold cursor-pointer"
            >
              {isDe ? "Ablehnung übermitteln" : "Submit Decline & Recommendation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL 3: FULL ELECTRONIC REVIEWER ASSESSMENT FORM ================= */}
      <Dialog open={!!selectedReviewForEval} onOpenChange={(open) => !open && setSelectedReviewForEval(null)}>
        <DialogContent className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg p-0">
          <form onSubmit={handleSubmitEvaluation}>
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-950 z-10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                  Scholarly Open • Electronic Reviewer’s Assessment
                </span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedReviewForEval?.title}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                  <ShieldCheck className="h-3 w-3" />
                  AI Index: Clean (3%)
                </span>
              </div>
            </div>

            <div className="p-6 space-y-6 text-xs">
              {evalError && (
                <div className="p-3 rounded bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 font-semibold text-xs">
                  {evalError}
                </div>
              )}

              {/* Section 1: Manuscript Meta & Structural Verification */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide border-b border-slate-200 dark:border-slate-800 pb-1.5">
                  1. {isDe ? "Manuskript-Struktur & Grunddaten" : "Manuscript Structure & Details"}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-600 dark:text-slate-400">{isDe ? "Artikelumfang:" : "Length of article:"}</label>
                    <input 
                      type="text" 
                      value={articleLength} 
                      onChange={(e) => setArticleLength(e.target.value)} 
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-600 dark:text-slate-400">{isDe ? "Anzahl Tabellen:" : "Number of Tables:"}</label>
                    <input 
                      type="text" 
                      value={tablesCount} 
                      onChange={(e) => setTablesCount(e.target.value)} 
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-600 dark:text-slate-400">{isDe ? "Anzahl Abbildungen:" : "Number of Figures:"}</label>
                    <input 
                      type="text" 
                      value={figuresCount} 
                      onChange={(e) => setFiguresCount(e.target.value)} 
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: 10-Point Questionnaire Matrix */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide border-b border-slate-200 dark:border-slate-800 pb-1.5">
                  2. {isDe ? "Gutachter-Fragebogen (10 Kriterien)" : "Reviewer Questionnaire"}
                </h3>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {QUESTIONNAIRE_ITEMS.map((item, idx) => (
                    <div key={item.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="text-slate-800 dark:text-slate-200 font-medium pr-2">
                        <span className="text-slate-400 dark:text-slate-500 mr-1.5 font-bold">{idx + 1}.</span>
                        {item.label}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {(["yes", "no", "na"] as const).map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setAnswers(prev => ({ ...prev, [item.id]: val }))}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                              answers[item.id] === val 
                                ? val === "yes" 
                                  ? "bg-green-600 text-white" 
                                  : val === "no" 
                                  ? "bg-red-600 text-white" 
                                  : "bg-slate-700 text-white"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                          >
                            {val === "na" ? "N/A" : val}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Publishing Priority Rating */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide">
                    3. {isDe ? "Publikations-Priorität (1 = Höchste, 10 = Geringste Priorität):" : "Publishing Priority Rating (1 = Highest, 10 = Lowest):"}
                  </label>
                  <span className="font-bold text-[#0b99ff] dark:text-[#0b99ff] text-sm">
                    {isDe ? "Stufe" : "Score"}: {priorityRating} / 10
                  </span>
                </div>

                <div className="grid grid-cols-10 gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPriorityRating(num)}
                      className={`py-2 rounded font-bold text-xs transition-colors cursor-pointer ${
                        priorityRating === num
                          ? "bg-[#0b99ff] text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 4: Comments to Authors */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide border-b border-slate-200 dark:border-slate-800 pb-1.5">
                  4. {isDe ? "Gutachter-Kommentare für den/die Autor(en)" : "Comments to Author(s)"}
                </h3>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    {isDe ? "Allgemeine Kommentare (Gesamteinschätzung, Stärken, Hauptaussagen):" : "General comments to the Author(s):"}
                  </label>
                  <textarea
                    rows={3}
                    value={generalComments}
                    onChange={(e) => setGeneralComments(e.target.value)}
                    placeholder={isDe ? "Fassen Sie die Hauptstärken und übergeordneten Verbesserungsbereiche zusammen..." : "Summarize the primary contribution, core strengths, and general structural feedback..."}
                    className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs resize-none focus:ring-1 focus:ring-[#0b99ff]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    {isDe ? "Spezifische / Zeilengenaue Anmerkungen (Methoden, Gleichungen, Tabellen):" : "Specific line-by-line comments to the Author(s):"}
                  </label>
                  <textarea
                    rows={4}
                    value={specificComments}
                    onChange={(e) => setSpecificComments(e.target.value)}
                    placeholder={isDe ? "z.B. Seite 4, Zeile 112: Genauere Erläuterung der Stichprobenzusammensetzung erforderlich..." : "e.g. Page 4, line 112: Clarify statistical degrees of freedom in Table 2..."}
                    className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs resize-none focus:ring-1 focus:ring-[#0b99ff]"
                  />
                </div>
              </div>

              {/* Section 5: Confidential Remarks for Handling Editor */}
              <div className="space-y-1 p-3 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs">
                  <Lock className="h-3.5 w-3.5 text-slate-500" />
                  <span>{isDe ? "Vertrauliche Bemerkungen für den zuständigen Editor (Nicht für Autoren sichtbar):" : "Confidential Remarks to Handling Editor (Not visible to authors):"}</span>
                </div>
                <textarea
                  rows={2}
                  value={editorConfidentialComments}
                  onChange={(e) => setEditorConfidentialComments(e.target.value)}
                  placeholder={isDe ? "Optionale vertrauliche Hinweise an den Editor bezüglich methodischer Bedenken..." : "Optional private notes to the handling editor regarding ethical concerns or candid publishability..."}
                  className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs resize-none focus:ring-1 focus:ring-[#0b99ff]"
                />
              </div>

              {/* Misconduct Escalation Callout in Evaluation Form */}
              <div className="p-3.5 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                  <div className="space-y-0.5">
                    <div className="font-bold text-amber-900 dark:text-amber-200">
                      {isDe ? "Verdacht auf schwerwiegendes Fehlverhalten oder Paper Mill?" : "Suspect Research Misconduct, Data Fabrication, or Paper Mill?"}
                    </div>
                    <p className="text-[11px] text-amber-800 dark:text-amber-300">
                      {isDe 
                        ? "Eskalieren Sie diesen Fall direkt an den Integritäts-Manager (IM) und den zuständigen Editor unter COPE-Whistleblower-Schutz."
                        : "Escalate confidentially to the Integrity Manager (IM) and Handling Editor under COPE whistleblower protections."}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    if (selectedReviewForEval) {
                      handleOpenEscalate(selectedReviewForEval)
                    }
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 h-auto cursor-pointer shrink-0 rounded shadow-xs"
                >
                  <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                  {isDe ? "Fehlverhalten melden" : "Escalate to IM / Editor"}
                </Button>
              </div>

              {/* Section 6: Recommendation Verdict */}
              <div className="space-y-2">
                <label className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide block">
                  5. {isDe ? "Abschließende Gutachter-Empfehlung (Recommendation):" : "Final Recommendation:"}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    "Accept without any Changes",
                    "Re-review and Accept with Minor Changes",
                    "Re-review and Accept with Major Changes",
                    "Re-write and Re-submit",
                    "Reject"
                  ].map((rec) => (
                    <label 
                      key={rec}
                      className={`flex items-center gap-2 p-2.5 rounded border text-xs cursor-pointer transition-colors ${
                        recommendation === rec 
                          ? "border-[#0b99ff] bg-[#0b99ff]/5 dark:bg-[#0b99ff]/10 font-bold text-slate-900 dark:text-white" 
                          : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="recommendation" 
                        value={rec} 
                        checked={recommendation === rec} 
                        onChange={() => setRecommendation(rec as any)}
                        className="text-[#0b99ff] focus:ring-[#0b99ff]"
                      />
                      <span>{rec}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Section 7: Mandatory Disclosures */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {isDe ? "Wären Sie bereit, eine überarbeitete Fassung (Revision) zu begutachten?" : "Would you be willing to review a revision of this manuscript?"}
                  </span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="radio" 
                        name="willingRevision" 
                        value="Yes" 
                        checked={willingRevision === "Yes"} 
                        onChange={() => setWillingRevision("Yes")} 
                      />
                      <span>{isDe ? "Ja" : "Yes"}</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="radio" 
                        name="willingRevision" 
                        value="No" 
                        checked={willingRevision === "No"} 
                        onChange={() => setWillingRevision("No")} 
                      />
                      <span>{isDe ? "Nein" : "No"}</span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {isDe ? "Offenlegung von Interessenkonflikten (COI):" : "Conflict of Interest (COI) disclosure:"}
                  </span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="radio" 
                        name="coiStatus" 
                        value="None" 
                        checked={coiStatus === "None"} 
                        onChange={() => setCoiStatus("None")} 
                      />
                      <span>{isDe ? "Keine Interessenkonflikte (None)" : "None"}</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="radio" 
                        name="coiStatus" 
                        value="Yes" 
                        checked={coiStatus === "Yes"} 
                        onChange={() => setCoiStatus("Yes")} 
                      />
                      <span>{isDe ? "Ja, vorhanden" : "Yes declared"}</span>
                    </label>
                  </div>
                </div>

                <div className="p-3 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={evalCopeCheck}
                      onChange={(e) => setEvalCopeCheck(e.target.checked)}
                      className="mt-0.5 h-3.5 w-3.5 rounded text-[#0b99ff] focus:ring-[#0b99ff]"
                    />
                    <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                      {isDe 
                        ? "Ich bestätige, dass dieses Gutachten meine eigene unabhängige wissenschaftliche Bewertung darstellt und alle ethischen Standards (COPE) eingehalten wurden."
                        : "I certify that this assessment is my own independent evaluation, free of unauthorized AI generation, and adheres to COPE peer-review ethics."}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
              <Button
                type="button"
                onClick={() => setSelectedReviewForEval(null)}
                variant="ghost"
                className="text-xs font-semibold cursor-pointer"
              >
                {isDe ? "Schließen / Entwurf speichern" : "Save Draft & Close"}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-bold px-5 py-2 cursor-pointer"
              >
                {isSubmitting 
                  ? (isDe ? "Wird übermittelt..." : "Submitting...") 
                  : (isDe ? "Gutachten einreichen (+12 Pkt)" : "Submit Evaluation (+12 Pts)")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL 4: BLINDED MANUSCRIPT PACKAGE DOWNLOAD ================= */}
      <Dialog open={!!selectedPackageRev} onOpenChange={(open) => !open && setSelectedPackageRev(null)}>
        <DialogContent className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 sm:max-w-lg rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileDown className="h-4 w-4 text-[#0b99ff] dark:text-[#0b99ff]" />
              {isDe ? "Blinded Manuskript-Paket herunterladen" : "Blinded Manuscript File Package"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              {isDe 
                ? "Vertrauliche, anonymisierte Dokumente für das Doppelblind-Gutachten."
                : "Confidential, anonymized documents pre-sanitized for double-blind review."}
            </DialogDescription>
          </DialogHeader>

          {selectedPackageRev && (
            <div className="space-y-3.5 py-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#0b99ff] dark:text-[#0b99ff]">{selectedPackageRev.journal}</span>
                  <span className="text-slate-400">ID: {selectedPackageRev.manuscriptId || selectedPackageRev.id}</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">{selectedPackageRev.title}</h4>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider block">
                  {isDe ? "Enthaltene anonymisierte Dateien:" : "Included Blinded Files:"}
                </span>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-red-500" />
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">Blinded_Manuscript_FullText.pdf</div>
                        <div className="text-[10px] text-slate-400">Main text · 14 Pages · Anonymized (Authors/PII Redacted)</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">2.4 MB</span>
                  </div>

                  <div className="p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-emerald-500" />
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">Supplementary_Tables_Figures.pdf</div>
                        <div className="text-[10px] text-slate-400">High-res vector figures (300 DPI) & Extended Datasets</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">8.1 MB</span>
                  </div>

                  <div className="p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-[#0b99ff]" />
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">IRB_Ethics_Statement_Redacted.pdf</div>
                        <div className="text-[10px] text-slate-400">Institutional Review Board protocol clearance certification</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">410 KB</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 flex items-start gap-2 text-[11px] text-amber-800 dark:text-amber-300">
                <Lock className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span>
                  {isDe 
                    ? "Vertraulichkeitserinnerung: Diese Dateien sind ausschließlich für Ihre Begutachtung bestimmt und dürfen nicht an Dritte weitergegeben werden."
                    : "Strict Confidentiality: These files are provided solely for peer review. Redistribution, sharing, or uploading to public tools is prohibited."}
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button 
              onClick={() => setSelectedPackageRev(null)}
              variant="ghost"
              className="text-xs font-semibold cursor-pointer"
            >
              {isDe ? "Schließen" : "Close"}
            </Button>
            <Button
              onClick={() => {
                setIsDownloadingZip(true)
                setTimeout(() => {
                  setIsDownloadingZip(false)
                  const alertMsg = isDe 
                    ? "Blinded Manuskript-Paket heruntergeladen (PDF + Begleitdaten)!" 
                    : "Blinded manuscript package downloaded (PDF + Supplementary Data)!"
                  alert(alertMsg)
                  setSelectedPackageRev(null)
                }, 700)
              }}
              className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-bold px-4 py-2 cursor-pointer flex items-center gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              <span>
                {isDownloadingZip 
                  ? (isDe ? "Wird gepackt..." : "Archiving...") 
                  : (isDe ? "Komplettes Paket herunterladen (.ZIP)" : "Download Full Package (.ZIP)")}
              </span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL 5: MISCONDUCT & ETHICS ESCALATION DIALOG ================= */}
      <Dialog open={!!selectedEscalateRev} onOpenChange={(open) => !open && setSelectedEscalateRev(null)}>
        <DialogContent className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 sm:max-w-xl rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              {isDe ? "Wissenschaftliches Fehlverhalten / Ethik-Eskalation" : "Research Integrity & Misconduct Escalation"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              {isDe 
                ? "Vertrauliche Meldung gemäß COPE-Leitlinien an den Integrity Manager, den Editor und den Journal Manager (JM)."
                : "Confidential escalation dispatched directly to the Integrity Manager, Handling Editor, and Journal Manager (JM)."}
            </DialogDescription>
          </DialogHeader>

          {selectedEscalateRev && (
            <form onSubmit={handleConfirmEscalation} className="space-y-4 py-2 text-xs">
              {/* Manuscript Summary */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#0b99ff] dark:text-[#0b99ff]">{selectedEscalateRev.journal}</span>
                  <span className="font-mono text-slate-400">ID: {selectedEscalateRev.manuscriptId || selectedEscalateRev.id}</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">{selectedEscalateRev.title}</h4>
              </div>

              {/* Journal Manager CC Info Notice */}
              <div className="p-2.5 rounded-lg bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/50 flex items-center gap-2 text-[11px] text-sky-800 dark:text-sky-300">
                <Info className="h-4 w-4 shrink-0 text-[#0b99ff]" />
                <span>
                  <strong>{isDe ? "Journal Manager (JM) Kopie:" : "Journal Manager (JM) Routing:"}</strong> {isDe 
                    ? "Eine Prüfkopie wird automatisch an den Journal Manager (JM) gesendet, um formelle Prozesspausen und Archivierung sicherzustellen." 
                    : "A formal compliance copy is automatically sent to the Journal Manager (JM) for editorial hold management and audit logging."}
                </span>
              </div>

              {/* 1. Recipient Target */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 dark:text-slate-200 text-xs block">
                  1. {isDe ? "Empfänger der primären Untersuchung:" : "Primary Investigation Recipient:"}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors flex items-center gap-2 ${
                    escalateTarget === "both" 
                      ? "border-[#0b99ff] bg-[#0b99ff]/5 dark:bg-[#0b99ff]/10 font-bold text-slate-900 dark:text-white" 
                      : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  }`}>
                    <input 
                      type="radio" 
                      name="escalateTarget" 
                      value="both" 
                      checked={escalateTarget === "both"} 
                      onChange={() => setEscalateTarget("both")} 
                    />
                    <span>{isDe ? "IM + Editor (CC: JM)" : "IM + Editor (CC: JM)"}</span>
                  </label>

                  <label className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors flex items-center gap-2 ${
                    escalateTarget === "integrity_manager" 
                      ? "border-[#0b99ff] bg-[#0b99ff]/5 dark:bg-[#0b99ff]/10 font-bold text-slate-900 dark:text-white" 
                      : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  }`}>
                    <input 
                      type="radio" 
                      name="escalateTarget" 
                      value="integrity_manager" 
                      checked={escalateTarget === "integrity_manager"} 
                      onChange={() => setEscalateTarget("integrity_manager")} 
                    />
                    <span>{isDe ? "IM Only (CC: JM)" : "IM Only (CC: JM)"}</span>
                  </label>

                  <label className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors flex items-center gap-2 ${
                    escalateTarget === "handling_editor" 
                      ? "border-[#0b99ff] bg-[#0b99ff]/5 dark:bg-[#0b99ff]/10 font-bold text-slate-900 dark:text-white" 
                      : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  }`}>
                    <input 
                      type="radio" 
                      name="escalateTarget" 
                      value="handling_editor" 
                      checked={escalateTarget === "handling_editor"} 
                      onChange={() => setEscalateTarget("handling_editor")} 
                    />
                    <span>{isDe ? "Editor Only (CC: JM)" : "Editor Only (CC: JM)"}</span>
                  </label>
                </div>
              </div>

              {/* 2. Misconduct Classification */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 dark:text-slate-200 text-xs block">
                  2. {isDe ? "Kategorie des vermuteten Fehlverhaltens:" : "Suspected Misconduct Classification:"}
                </label>
                <select
                  value={misconductType}
                  onChange={(e) => setMisconductType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-semibold focus:ring-1 focus:ring-[#0b99ff]"
                >
                  <option value="figure_manipulation">{isDe ? "Bild- & Grafik-Manipulation (Duplizierung, Band-Splicing, Retusche)" : "Image & Figure Manipulation (Pixel cloning, Western blot splicing)"}</option>
                  <option value="paper_mill">{isDe ? "Verdacht auf Paper Mill / Ghost-Autorenschaft" : "Paper Mill / Ghost Authorship Syndicate"}</option>
                  <option value="data_fabrication">{isDe ? "Erfundene oder statistisch unplausible Daten" : "Fabricated Data / Statistically Impossible Results"}</option>
                  <option value="plagiarism">{isDe ? "Schweres Plagiat / Text-Recycling ohne Zitation" : "Plagiarism & Redundant Text Recycling"}</option>
                  <option value="coi_violation">{isDe ? "Verschwiegener schwerer Interessenkonflikt" : "Undisclosed Commercial / Institutional Conflict of Interest"}</option>
                  <option value="unethical_irb">{isDe ? "Fehlende Ethik-Genehmigung / Unethische Probanden-Rekrutierung" : "Missing IRB Approval / Unethical Human/Animal Protocols"}</option>
                  <option value="other">{isDe ? "Sonstige schwerwiegende Publikationsethik-Verletzung" : "Other Severe COPE Ethical Violation"}</option>
                </select>
              </div>

              {/* 3. Urgency / Action Requested */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 dark:text-slate-200 text-xs block">
                  3. {isDe ? "Dringlichkeit & Handlungsempfehlung:" : "Severity & Requested Editorial Action:"}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors flex items-center gap-2 ${
                    misconductSeverity === "high_urgent" 
                      ? "border-red-500 bg-red-50/50 dark:bg-red-950/20 font-bold text-red-900 dark:text-red-200" 
                      : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  }`}>
                    <input 
                      type="radio" 
                      name="misconductSeverity" 
                      value="high_urgent" 
                      checked={misconductSeverity === "high_urgent"} 
                      onChange={() => setMisconductSeverity("high_urgent")} 
                    />
                    <span>{isDe ? "Sofortiger Begutachtungsstopp empfohlen" : "Immediate Review Freeze Requested"}</span>
                  </label>

                  <label className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors flex items-center gap-2 ${
                    misconductSeverity === "medium_discretion" 
                      ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 font-bold text-amber-900 dark:text-amber-200" 
                      : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  }`}>
                    <input 
                      type="radio" 
                      name="misconductSeverity" 
                      value="medium_discretion" 
                      checked={misconductSeverity === "medium_discretion"} 
                      onChange={() => setMisconductSeverity("medium_discretion")} 
                    />
                    <span>{isDe ? "Hinweis zur Prüfung (Begutachtung fortsetzen)" : "Discretionary Note (Continue Review)"}</span>
                  </label>
                </div>
              </div>

              {/* 4. Specific Locations & References */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800 dark:text-slate-200 text-xs block">
                  4. {isDe ? "Betroffene Abbildungen / Seitenzahlen / Tabellen:" : "Specific Locations (Page, Figure, or Table references):"}
                </label>
                <input
                  type="text"
                  value={misconductPageRefs}
                  onChange={(e) => setMisconductPageRefs(e.target.value)}
                  placeholder={isDe ? "z.B. Abbildung 3B (identisch zu Abb. 1A) und Seite 8, Tabelle 3" : "e.g. Figure 3B duplicated from Fig 1A with inverted contrast; Page 8 Table 3"}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-[#0b99ff]"
                />
              </div>

              {/* 5. Detailed Evidence */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800 dark:text-slate-200 text-xs block">
                  5. {isDe ? "Ausführliche Begründung & Beweishinweise:" : "Detailed Evidence & Integrity Findings:"}
                </label>
                <textarea
                  rows={3}
                  value={misconductEvidence}
                  onChange={(e) => setMisconductEvidence(e.target.value)}
                  placeholder={isDe ? "Beschreiben Sie die auffälligen Muster, Unstimmigkeiten oder methodischen Fälschungsmerkmale..." : "Detail the anomalies, duplicate background noise, mathematical impossibilities, or suspected paper mill characteristics..."}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs resize-none focus:ring-1 focus:ring-[#0b99ff]"
                  required
                />
              </div>

              {/* 6. COPE Protection Declaration */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={misconductCopeCheck}
                    onChange={(e) => setMisconductCopeCheck(e.target.checked)}
                    className="mt-0.5 h-3.5 w-3.5 rounded text-amber-600 focus:ring-amber-500"
                    required
                  />
                  <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                    {isDe 
                      ? "Ich bestätige, dass diese Meldung nach bestem wissenschaftlichen Wissen erfolgt. Meine Identität als Gutachter wird gemäß den COPE-Whistleblower-Richtlinien streng vertraulich geschützt."
                      : "I confirm this report is submitted in good faith on objective scientific grounds. My identity is strictly protected under COPE whistleblower guidelines."}
                  </span>
                </label>
              </div>

              <DialogFooter className="gap-2 pt-2">
                <Button 
                  type="button"
                  onClick={() => setSelectedEscalateRev(null)}
                  variant="ghost"
                  className="text-xs font-semibold cursor-pointer"
                >
                  {isDe ? "Abbrechen" : "Cancel"}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingEscalation}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-5 py-2 cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>
                    {isSubmittingEscalation 
                    ? (isDe ? "Wird übermittelt..." : "Dispatching...") 
                    : (isDe ? "Eskalation vertraulich einreichen" : "Submit Confidential Escalation")}
                  </span>
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ================= REVIEWER ONBOARDING & PROFILE SETUP MODAL ================= */}
      <Dialog 
        open={showProfileModal} 
        onOpenChange={(open) => {
          if (!open) markOnboarded()
          setShowProfileModal(open)
        }}
      >
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto p-0 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl bg-white dark:bg-slate-950 overflow-hidden">
          
          {/* Editorial360 Light Sky Blue Top Accent Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#0b99ff] via-sky-400 to-[#0088e0]" />

          {/* Modal Header */}
          <div className="px-6 pt-5 pb-3 border-b border-slate-200 dark:border-slate-800">
            <DialogTitle className="text-base font-semibold text-slate-900 dark:text-white">
              {isDe ? "Gutachterprofil einrichten" : "Reviewer Profile Setup"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isDe 
                ? "Geben Sie Ihre akademische Affiliation, Fachgebiete und Verfügbarkeit für Manuskriptzuweisungen an." 
                : "Set your academic affiliation, subject expertise, and review availability for manuscript matching."}
            </DialogDescription>

            {/* Step Navigation Tabs with Light Sky Blue Active Border */}
            <div className="flex items-center gap-4 mt-3 pt-2 text-xs">
              {[
                { step: 1, labelEn: "1. Affiliation", labelDe: "1. Affiliation" },
                { step: 2, labelEn: "2. Expertise", labelDe: "2. Fachgebiete" },
                { step: 3, labelEn: "3. Capacity", labelDe: "3. Kapazität" },
                { step: 4, labelEn: "4. Ethics", labelDe: "4. Ethik" },
              ].map(st => (
                <button
                  key={st.step}
                  type="button"
                  onClick={() => setProfileStep(st.step as 1 | 2 | 3 | 4)}
                  className={`pb-1.5 border-b-2 text-xs transition-colors cursor-pointer ${
                    profileStep === st.step
                      ? "border-[#0b99ff] text-[#0b99ff] font-semibold"
                      : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  }`}
                >
                  {isDe ? st.labelDe : st.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSaveProfile} className="p-6 space-y-4 pt-4">

            {/* STEP 1: Academic Identity & Affiliation */}
            {profileStep === 1 && (
              <div className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {isDe ? "Akad. Titel" : "Academic Title"}
                    </label>
                    <select
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-[#0b99ff] focus:border-[#0b99ff]"
                    >
                      <option value="Prof. Dr.">Prof. Dr.</option>
                      <option value="Dr.">Dr. / PhD</option>
                      <option value="Assoc. Prof.">Assoc. Prof.</option>
                      <option value="Assist. Prof.">Assist. Prof.</option>
                      <option value="MD">MD</option>
                      <option value="MD, PhD">MD, PhD</option>
                      <option value="Postdoctoral Fellow">Postdoctoral Fellow</option>
                      <option value="Senior Scientist">Senior Scientist</option>
                      <option value="MSc">MSc / Researcher</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {isDe ? "Vollständiger Name *" : "Full Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Dr. Marcus Vance"
                      className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-[#0b99ff] focus:border-[#0b99ff]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {isDe ? "Institutionelle E-Mail *" : "Institutional Email *"}
                    </label>
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="m.vance@university.edu"
                      className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-[#0b99ff] focus:border-[#0b99ff]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {isDe ? "Land / Region *" : "Country / Region *"}
                    </label>
                    <select
                      value={formCountry}
                      onChange={(e) => setFormCountry(e.target.value)}
                      className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-[#0b99ff] focus:border-[#0b99ff]"
                    >
                      <option value="Germany">Germany</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Switzerland">Switzerland</option>
                      <option value="Austria">Austria</option>
                      <option value="Canada">Canada</option>
                      <option value="France">France</option>
                      <option value="Netherlands">Netherlands</option>
                      <option value="Australia">Australia</option>
                      <option value="Japan">Japan</option>
                      <option value="Sweden">Sweden</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Other">Other / International</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {isDe ? "Institution / Universität *" : "Institution / University *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={formInstitution}
                      onChange={(e) => setFormInstitution(e.target.value)}
                      placeholder="e.g. Charité – Universitätsmedizin Berlin"
                      className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-[#0b99ff] focus:border-[#0b99ff]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {isDe ? "Fachbereich / Institut" : "Department / Division"}
                    </label>
                    <input
                      type="text"
                      value={formDepartment}
                      onChange={(e) => setFormDepartment(e.target.value)}
                      placeholder="e.g. Department of Cardiology"
                      className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-[#0b99ff] focus:border-[#0b99ff]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      ORCID iD
                    </label>
                    <input
                      type="text"
                      value={formOrcid}
                      onChange={(e) => setFormOrcid(e.target.value)}
                      placeholder="0000-0004-7711-2093"
                      className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#0b99ff] focus:border-[#0b99ff]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {isDe ? "Google Scholar / Scopus Profil" : "Google Scholar / Scopus Link"}
                    </label>
                    <input
                      type="url"
                      value={formScholarUrl}
                      onChange={(e) => setFormScholarUrl(e.target.value)}
                      placeholder="https://scholar.google.com/citations?user=..."
                      className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-[#0b99ff] focus:border-[#0b99ff]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Subject Areas & Matching Keywords */}
            {profileStep === 2 && (
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {isDe ? "Hauptfachdisziplin *" : "Primary Scientific Discipline *"}
                  </label>
                  <select
                    value={formPrimaryDiscipline}
                    onChange={(e) => {
                      setFormPrimaryDiscipline(e.target.value)
                      if (DISCIPLINE_DATA[e.target.value]) {
                        setFormSubDisciplines(DISCIPLINE_DATA[e.target.value].subDisciplines.slice(0, 3))
                      }
                    }}
                    className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-[#0b99ff] focus:border-[#0b99ff]"
                  >
                    {Object.entries(DISCIPLINE_DATA).map(([key, disc]) => (
                      <option key={key} value={key}>
                        {isDe ? disc.labelDe : disc.labelEn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sub-Disciplines Chips */}
                {DISCIPLINE_DATA[formPrimaryDiscipline] && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                      {isDe ? "Spezialisierte Teilbereiche:" : "Sub-Disciplines:"}
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {DISCIPLINE_DATA[formPrimaryDiscipline].subDisciplines.map((sub, i) => {
                        const isSelected = formSubDisciplines.includes(sub)
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleToggleSubDiscipline(sub)}
                            className={`text-xs px-2.5 py-0.5 rounded border transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-[#0b99ff] text-white border-[#0b99ff] font-medium shadow-2xs"
                                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-[#0b99ff]/60"
                            }`}
                          >
                            {isSelected ? "✓ " : "+ "}{sub}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Keyword Tagger */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                    {isDe ? "Forschungsschlagwörter (Keywords):" : "Research Keywords:"}
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formKeywordInput}
                      onChange={(e) => setFormKeywordInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddKeyword()
                        }
                      }}
                      placeholder={isDe ? "Schlagwort eingeben und Enter drücken..." : "Type keyword and press Enter..."}
                      className="flex-1 px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-[#0b99ff] focus:border-[#0b99ff]"
                    />
                    <Button
                      type="button"
                      onClick={() => handleAddKeyword()}
                      variant="outline"
                      className="text-xs px-3 h-8 border-[#0b99ff] text-[#0b99ff] hover:bg-sky-50 dark:hover:bg-sky-950/40 cursor-pointer font-medium"
                    >
                      {isDe ? "Hinzufügen" : "Add"}
                    </Button>
                  </div>

                  {/* Active Tags */}
                  <div className="p-2 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 min-h-[36px] flex flex-wrap items-center gap-1.5">
                    {formKeywords.length === 0 ? (
                      <span className="text-xs text-slate-400">
                        {isDe ? "Keine Schlagwörter hinzugefügt." : "No keywords added yet."}
                      </span>
                    ) : (
                      formKeywords.map((kw, i) => (
                        <span 
                          key={i} 
                          className="inline-flex items-center gap-1 text-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 shadow-2xs"
                        >
                          {kw}
                          <button
                            type="button"
                            onClick={() => handleRemoveKeyword(kw)}
                            className="text-slate-400 hover:text-red-500 ml-0.5 cursor-pointer font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  {/* Keyword Suggestions */}
                  {DISCIPLINE_DATA[formPrimaryDiscipline] && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[11px] text-slate-500 block">
                        {isDe ? "Empfohlene Keywords:" : "Suggested keywords:"}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {DISCIPLINE_DATA[formPrimaryDiscipline].keywords.map((sugKw, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleAddKeyword(sugKw)}
                            disabled={formKeywords.includes(sugKw)}
                            className={`text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                              formKeywords.includes(sugKw)
                                ? "opacity-40 bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent cursor-not-allowed"
                                : "bg-sky-50 dark:bg-sky-950/40 text-[#0b99ff] border-sky-200 dark:border-sky-800/80 hover:bg-sky-100 dark:hover:bg-sky-900/60"
                            }`}
                          >
                            + {sugKw}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: Workload Capacity & Availability */}
            {profileStep === 3 && (
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                    {isDe ? "Verfügbarkeit:" : "Availability Status:"}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className={`p-2.5 rounded border cursor-pointer text-xs flex items-center gap-2 ${
                      formAvailability === "Available"
                        ? "border-[#0b99ff] bg-sky-50/60 dark:bg-sky-950/30 font-medium text-slate-900 dark:text-white"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                    }`}>
                      <input
                        type="radio"
                        name="formAvailability"
                        value="Available"
                        checked={formAvailability === "Available"}
                        onChange={() => setFormAvailability("Available")}
                        className="text-[#0b99ff] accent-[#0b99ff]"
                      />
                      <span>{isDe ? "Aktiv & Verfügbar" : "Active & Available"}</span>
                    </label>

                    <label className={`p-2.5 rounded border cursor-pointer text-xs flex items-center gap-2 ${
                      formAvailability === "Sabbatical"
                        ? "border-[#0b99ff] bg-sky-50/60 dark:bg-sky-950/30 font-medium text-slate-900 dark:text-white"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                    }`}>
                      <input
                        type="radio"
                        name="formAvailability"
                        value="Sabbatical"
                        checked={formAvailability === "Sabbatical"}
                        onChange={() => setFormAvailability("Sabbatical")}
                        className="text-[#0b99ff] accent-[#0b99ff]"
                      />
                      <span>{isDe ? "Forschungssemester / Pause" : "On Sabbatical / Leave"}</span>
                    </label>
                  </div>
                </div>

                {formAvailability === "Sabbatical" && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                      {isDe ? "Wieder verfügbar ab:" : "Available from (Date):"}
                    </label>
                    <input
                      type="date"
                      value={formSabbaticalUntil}
                      onChange={(e) => setFormSabbaticalUntil(e.target.value)}
                      className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                    {isDe ? "Maximale Begutachtungen (pro Monat):" : "Maximum Workload (Papers per Month):"}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setFormMaxReviews(num)}
                        className={`py-2 rounded border text-center text-xs transition-colors cursor-pointer ${
                          formMaxReviews === num
                            ? "border-[#0b99ff] bg-sky-50 dark:bg-sky-950/50 text-[#0b99ff] font-semibold"
                            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-400"
                        }`}
                      >
                        {num} {isDe ? "Artikel" : "papers"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                    {isDe ? "Bevorzugte Begutachtungsdauer:" : "Preferred Review Turnaround:"}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { days: 7, labelEn: "7 Days", labelDe: "7 Tage" },
                      { days: 14, labelEn: "14 Days", labelDe: "14 Tage" },
                      { days: 21, labelEn: "21 Days", labelDe: "21 Tage" },
                    ].map(win => (
                      <button
                        key={win.days}
                        type="button"
                        onClick={() => setFormTurnaround(win.days)}
                        className={`py-2 rounded border text-center text-xs transition-colors cursor-pointer ${
                          formTurnaround === win.days
                            ? "border-[#0b99ff] bg-sky-50 dark:bg-sky-950/50 text-[#0b99ff] font-semibold"
                            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-400"
                        }`}
                      >
                        {isDe ? win.labelDe : win.labelEn}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Ethics & Compliance */}
            {profileStep === 4 && (
              <div className="space-y-3.5">
                <div className="space-y-2.5">
                  <label className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-start gap-2.5 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={formCoiChecked}
                      onChange={(e) => setFormCoiChecked(e.target.checked)}
                      className="mt-0.5 h-3.5 w-3.5 rounded text-[#0b99ff] accent-[#0b99ff]"
                      required
                    />
                    <div className="space-y-0.5">
                      <strong className="text-slate-900 dark:text-white block font-medium">
                        {isDe ? "Interessenkonflikt-Erklärung" : "Conflict of Interest Declaration"}
                      </strong>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                        {isDe 
                          ? "Ich erkläre, Einladungen bei Ko-Autorenschaft, institutioneller Verflechtung oder Wettbewerbskonflikten abzulehnen."
                          : "I agree to recuse myself from reviewing manuscripts where institutional, personal, or financial conflicts exist."}
                      </p>
                    </div>
                  </label>

                  <label className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-start gap-2.5 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={formCopeChecked}
                      onChange={(e) => setFormCopeChecked(e.target.checked)}
                      className="mt-0.5 h-3.5 w-3.5 rounded text-[#0b99ff] accent-[#0b99ff]"
                      required
                    />
                    <div className="space-y-0.5">
                      <strong className="text-slate-900 dark:text-white block font-medium">
                        {isDe ? "Vertraulichkeitserklärung & COPE-Richtlinien" : "Confidentiality & COPE Compliance"}
                      </strong>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                        {isDe 
                          ? "Ich behandle Manuskripte streng vertraulich und lade sie nicht in externe KI-Dienste hoch."
                          : "I agree to treat all submitted manuscripts as strictly confidential and not upload them to third-party public services."}
                      </p>
                    </div>
                  </label>
                </div>

                {/* Simple Summary */}
                <div className="p-3 rounded border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    {isDe ? "Profilübersicht:" : "Profile Summary:"}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-[11px] grid grid-cols-2 gap-1">
                    <div><strong>Name:</strong> {formTitle} {formName}</div>
                    <div><strong>Discipline:</strong> {DISCIPLINE_DATA[formPrimaryDiscipline]?.[isDe ? "labelDe" : "labelEn"]}</div>
                    <div><strong>Institution:</strong> {formInstitution}</div>
                    <div><strong>Capacity:</strong> {formMaxReviews} {isDe ? "Artikel/Mo" : "papers/mo"}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Dialog Navigation Footer */}
            <DialogFooter className="flex flex-row items-center justify-between gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div>
                {profileStep > 1 && (
                  <Button
                    type="button"
                    onClick={() => setProfileStep((prev) => (prev - 1) as 1 | 2 | 3 | 4)}
                    variant="ghost"
                    className="text-xs h-8 cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    ← {isDe ? "Zurück" : "Back"}
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={() => {
                    markOnboarded()
                    setShowProfileModal(false)
                  }}
                  variant="ghost"
                  className="text-xs h-8 text-slate-500 cursor-pointer"
                >
                  {isDe 
                    ? (isFirstTimeOnboarding ? "Überspringen" : "Schließen") 
                    : (isFirstTimeOnboarding ? "Skip" : "Cancel")}
                </Button>

                {profileStep < 4 ? (
                  <Button
                    type="button"
                    onClick={() => setProfileStep((prev) => (prev + 1) as 1 | 2 | 3 | 4)}
                    className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-semibold px-4 h-8 cursor-pointer shadow-xs"
                  >
                    {isDe ? "Weiter" : "Next"} →
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-semibold px-4 h-8 cursor-pointer shadow-xs"
                  >
                    {isDe ? "Profil speichern" : "Save Profile"}
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

