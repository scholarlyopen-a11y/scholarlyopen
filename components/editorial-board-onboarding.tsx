"use client"

import React, { useState, useEffect, useRef } from "react"
import { 
  ShieldCheck, 
  Upload, 
  FileText, 
  CheckCircle2, 
  User, 
  Mail, 
  Building2, 
  Globe, 
  Lock, 
  AlertCircle, 
  ArrowRight,
  ExternalLink,
  BookOpen,
  Calendar,
  Check,
  Eye,
  EyeOff
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export interface EditorialBoardOnboardingData {
  title: string
  name: string
  email: string
  journal: string
  role: string
  affiliation: string
  department: string
  country: string
  biography: string
  photoUrl: string
  cvFileName: string
  cvFileSize: string
  cvBase64?: string
  orcid: string
  googleScholar: string
  researchGate: string
  linkedin: string
  researchInterests: string[]
  publications: Array<{ title: string; journal: string; year: string; doi: string }>
  password: string
  hasAcceptedTerms: boolean
  consentProfileUpload: boolean
}

interface EditorialBoardOnboardingProps {
  initialName?: string
  initialEmail?: string
  initialJournal?: string
  roleType?: "board" | "ae" | "eic"
  onComplete: (data: EditorialBoardOnboardingData) => void
  onCancel?: () => void
  onSignInClick?: () => void
  language?: string
}

export function EditorialBoardOnboarding({
  initialName = "",
  initialEmail = "",
  initialJournal = "",
  roleType = "board",
  onComplete,
  onCancel,
  onSignInClick,
  language = "en"
}: EditorialBoardOnboardingProps) {
  const [title, setTitle] = useState("Prof.")
  const [name, setName] = useState(initialName || "")
  const [email, setEmail] = useState(initialEmail || "")
  const [journal, setJournal] = useState(initialJournal || "Scholarly Open: Medicine")
  
  const [affiliation, setAffiliation] = useState("")
  const [department, setDepartment] = useState("")
  const [country, setCountry] = useState("")

  const [photoUrl, setPhotoUrl] = useState<string>("")
  const [photoPreview, setPhotoPreview] = useState<string>("")
  const photoInputRef = useRef<HTMLInputElement>(null)

  const [cvFileName, setCvFileName] = useState("")
  const [cvFileSize, setCvFileSize] = useState("")
  const [cvBase64, setCvBase64] = useState<string>("")
  const [cvFileStatus, setCvFileStatus] = useState<"none" | "uploaded">("none")
  const cvInputRef = useRef<HTMLInputElement>(null)

  const [biography, setBiography] = useState("")
  const [interestsText, setInterestsText] = useState("")
  const [orcid, setOrcid] = useState("")
  const [googleScholar, setGoogleScholar] = useState("")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false)
  const [consentProfileUpload, setConsentProfileUpload] = useState(true)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  
  // Single-use security & already accepted check
  const [isVerifying, setIsVerifying] = useState(true)
  const [alreadyAccepted, setAlreadyAccepted] = useState(false)
  const [acceptedDate, setAcceptedDate] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    async function verifyLink() {
      try {
        const queryParams = new URLSearchParams()
        if (name) queryParams.set("name", name)
        if (email) queryParams.set("email", email)
        if (journal) queryParams.set("journal", journal)
        if (typeof window !== "undefined") {
          const urlParams = new URLSearchParams(window.location.search)
          const token = urlParams.get("token") || urlParams.get("invite")
          if (token) queryParams.set("token", token)
        }

        const res = await fetch(`/api/editorial360/invitation-verify?${queryParams.toString()}`)
        if (res.ok) {
          const data = await res.json()
          if (!isMounted) return

          if (data.alreadyAccepted) {
            setAlreadyAccepted(true)
            setAcceptedDate(data.acceptedAt || new Date().toISOString())
          }

          if (data.invite) {
            if (data.invite.journal && !journal) {
              setJournal(data.invite.journal)
            }
            if (data.invite.recipientEmail && !email) {
              setEmail(data.invite.recipientEmail)
            }
          }
        }
      } catch (e) {
        console.warn("Could not verify invitation token status:", e)
      } finally {
        if (isMounted) setIsVerifying(false)
      }
    }

    verifyLink()
    return () => {
      isMounted = false
    }
  }, [name, email, journal])

  // Handle Photo selection
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload an image file (PNG, JPG, or WebP)")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setPhotoPreview(dataUrl)
      setPhotoUrl(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  // Handle CV selection
  const handleCvSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const sizeKb = Math.round(file.size / 1024)
    setCvFileName(file.name)
    setCvFileSize(sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`)
    setCvFileStatus("uploaded")

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setCvBase64(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  // Submit onboarding
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    if (!name.trim()) {
      setErrorMsg("Please provide your full academic name.")
      return
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please provide a valid institutional email address.")
      return
    }
    if (!affiliation.trim()) {
      setErrorMsg("Please provide your primary academic affiliation / university.")
      return
    }
    if (!password.trim() || password.length < 6) {
      setErrorMsg("Please create an account password of at least 6 characters.")
      return
    }
    if (password !== confirmPassword) {
      setErrorMsg("Account passwords do not match.")
      return
    }
    if (!hasAcceptedTerms) {
      setErrorMsg("You must accept the terms of the editorial appointment to proceed.")
      return
    }
    if (!consentProfileUpload) {
      setErrorMsg("Consent to display your name and affiliation on the journal masthead is required.")
      return
    }

    setIsSubmitting(true)

    const parsedInterests = interestsText
      .split(/[,;\n]+/)
      .map(s => s.trim())
      .filter(Boolean)

    const roleString = roleType === "eic" 
      ? "Editor-in-Chief" 
      : roleType === "ae" 
      ? "Associate Editor" 
      : "Editorial Board Member & Handling Editor"

    const payload: EditorialBoardOnboardingData = {
      title,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      journal,
      role: roleString,
      affiliation: affiliation.trim(),
      department: department.trim(),
      country: country.trim(),
      biography: biography.trim(),
      photoUrl: photoPreview || photoUrl,
      cvFileName: cvFileName.trim(),
      cvFileSize: cvFileSize.trim(),
      cvBase64: cvBase64 || undefined,
      orcid: orcid.trim(),
      googleScholar: googleScholar.trim(),
      researchGate: "",
      linkedin: "",
      researchInterests: parsedInterests,
      publications: [],
      password: password.trim(),
      hasAcceptedTerms,
      consentProfileUpload
    }

    try {
      // 1. Post to invitation-response API (records live response, attaches CV & notifies Journal Manager Desk)
      await fetch("/api/editorial360/invitation-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: roleType,
          candidateName: payload.name,
          candidateEmail: payload.email,
          journal: payload.journal,
          decision: "yes",
          affiliation: payload.affiliation,
          department: payload.department,
          country: payload.country,
          biography: payload.biography,
          photoUrl: payload.photoUrl,
          cvFileName: payload.cvFileName,
          cvFileSize: payload.cvFileSize,
          cvBase64: payload.cvBase64,
          researchInterests: payload.researchInterests,
          orcid: payload.orcid,
          googleScholar: payload.googleScholar,
          hasAcceptedTerms: payload.hasAcceptedTerms,
          consentProfileUpload: payload.consentProfileUpload
        })
      })

      // 2. Post to editors API (registers editor in official registry pending JM approval)
      await fetch("/api/editorial360/editors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      // 3. Mark completed and transition
      onComplete(payload)
    } catch (err: any) {
      console.error("Failed to submit onboarding profile:", err)
      onComplete(payload)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Already accepted screen (Single-use enforcement)
  if (alreadyAccepted) {
    return (
      <div className="w-full max-w-2xl mx-auto py-12 px-4 sm:px-6 animate-in fade-in duration-300">
        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18191e] shadow-sm rounded-xl overflow-hidden">
          <div className="p-8 text-center space-y-5">
            <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 dark:bg-blue-950/40 text-[#0b99ff] flex items-center justify-center border border-blue-100 dark:border-blue-900/50">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <Check className="w-3.5 h-3.5" />
                <span>Appointment Confirmed & Onboarded</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Editorial Board Appointment Active
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                Thank you, <strong>{name}</strong>. Your acceptance for <strong>{journal}</strong> has been officially recorded. This invitation link was single-use and your account credentials are now active.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 rounded-lg p-4 border border-slate-200 dark:border-slate-800 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500 font-medium">Designated Journal:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{journal}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500 font-medium">Role:</span>
                <span className="font-semibold text-slate-900 dark:text-white">Editorial Board Member & Handling Editor</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Recorded:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {acceptedDate ? new Date(acceptedDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "Active"}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                onClick={onSignInClick || onCancel}
                className="w-full sm:w-auto bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-semibold h-10 px-6 rounded-lg cursor-pointer"
              >
                Sign In to editorial360
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-10 px-4 sm:px-6 animate-in fade-in duration-200 font-sans text-slate-900 dark:text-slate-100">
      
      {/* Publisher Clean Card */}
      <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18191e] shadow-sm rounded-xl overflow-hidden">
        
        {/* Header: Publisher Standard */}
        <div className="px-6 py-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18191e]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <img 
                src="/editorial360.svg" 
                alt="editorial360" 
                className="h-7 w-auto" 
              />
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                Scholarly Open Editorial Office
              </span>
            </div>

            <div className="text-xs text-slate-500">
              Mainz, Germany
            </div>
          </div>

          <div className="pt-4 space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Editorial Board Appointment Acceptance
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Please review and confirm your academic details to complete your appointment for <span className="font-semibold text-slate-800 dark:text-slate-200">{journal}</span>.
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-[11px] text-slate-600 dark:text-slate-400">
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Role:</span>{" "}
                {roleType === "eic" ? "Editor-in-Chief" : roleType === "ae" ? "Associate Editor" : "Editorial Board Member & Handling Editor"}
              </div>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Term:</span> 2-Year Renewable (COPE-Governed)
              </div>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Privileges:</span> 25% APC Remission & Editor Honorarium
              </div>
            </div>
          </div>
        </div>

        {/* Clean Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-7">
          
          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Academic Details */}
          <div className="space-y-3.5">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Academic Identity & Affiliation
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
              <div className="space-y-1 sm:col-span-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Title</label>
                <select
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131418] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                >
                  <option value="Prof.">Prof.</option>
                  <option value="Prof. Dr.">Prof. Dr.</option>
                  <option value="Dr.">Dr.</option>
                  <option value="Assoc. Prof.">Assoc. Prof.</option>
                  <option value="Assist. Prof.">Assist. Prof.</option>
                </select>
              </div>

              <div className="space-y-1 sm:col-span-3">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Full Academic Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Prof. Sanna Järvelä"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131418] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Primary Institutional Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131418] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Country</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Finland, United Kingdom, Germany"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131418] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">University / Institution</label>
                <input
                  type="text"
                  required
                  value={affiliation}
                  onChange={(e) => setAffiliation(e.target.value)}
                  placeholder="e.g. University of Oulu"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131418] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Faculty / Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Faculty of Education, LET Unit"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131418] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                />
              </div>
            </div>
          </div>

          {/* 2. Research Profile & ORCID */}
          <div className="space-y-3.5">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Research Scope & Scholarly Profile
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>ORCID iD</span>
                  <span className="text-[10px] text-slate-400">16-digit</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[#a6ce39] font-bold text-xs select-none">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#a6ce39] inline-block" />
                    <span className="text-[10px] text-slate-400 font-mono">id/</span>
                  </div>
                  <input
                    type="text"
                    value={orcid}
                    onChange={(e) => setOrcid(e.target.value)}
                    placeholder="0000-0001-6223-366X"
                    className="w-full pl-12 pr-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131418] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Google Scholar / Academic URL (Optional)</label>
                <input
                  type="url"
                  value={googleScholar}
                  onChange={(e) => setGoogleScholar(e.target.value)}
                  placeholder="https://scholar.google.com/citations?user=..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131418] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Primary Keywords & Research Areas
              </label>
              <input
                type="text"
                required
                value={interestsText}
                onChange={(e) => setInterestsText(e.target.value)}
                placeholder="e.g. AI in Education, Learning Analytics, Medicine, Clinical Trials"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131418] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
              />
              <p className="text-[11px] text-slate-400">Used by the editorial office to match relevant manuscripts for handling.</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Brief Academic Biography (for Journal Masthead)
              </label>
              <textarea
                rows={3}
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                placeholder="Brief summary of academic appointments, chairships, research focus, and notable honors..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131418] text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
              />
            </div>
          </div>

          {/* 3. Supporting Documents */}
          <div className="space-y-3.5">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Supporting Documents
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* CV File Upload */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200">Curriculum Vitae (CV)</span>
                  <span className="text-[10px] text-slate-400">PDF or DOCX</span>
                </div>

                <input 
                  type="file" 
                  ref={cvInputRef}
                  accept=".pdf,.doc,.docx"
                  onChange={handleCvSelect}
                  className="hidden" 
                />

                {cvFileStatus === "uploaded" ? (
                  <div className="p-2.5 rounded-md bg-white dark:bg-[#18191e] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="w-4 h-4 text-[#0b99ff] shrink-0" />
                      <div className="truncate text-xs font-medium text-slate-900 dark:text-white">{cvFileName}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => cvInputRef.current?.click()}
                      className="text-xs text-[#0b99ff] hover:underline font-semibold shrink-0 cursor-pointer ml-2"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => cvInputRef.current?.click()}
                    className="w-full py-2.5 px-3 border border-dashed border-slate-300 dark:border-slate-700 rounded-md text-center hover:border-[#0b99ff] transition-colors cursor-pointer text-xs text-slate-600 dark:text-slate-400"
                  >
                    Attach CV document
                  </button>
                )}
              </div>

              {/* Profile Photo */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Profile Photo (Recommended)</span>
                  <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400">Recommended for masthead avatar & public listing</span>
                </div>

                <input 
                  type="file" 
                  ref={photoInputRef}
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden" 
                />

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800 flex items-center justify-center shrink-0">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => photoInputRef.current?.click()}
                    className="h-8 text-xs font-medium border-slate-200 dark:border-slate-800 rounded-md cursor-pointer"
                  >
                    {photoPreview ? "Change Photo" : "Upload Photo"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 4. editorial360 Credentials */}
          <div className="space-y-3.5">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                editorial360 Portal Access
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Set a secure password to access your handling editor desk on the editorial360 portal.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-3 pr-9 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131418] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-3 pr-9 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131418] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5"
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Acceptance & Ethics Declaration */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={hasAcceptedTerms}
                onChange={(e) => setHasAcceptedTerms(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-[#0b99ff] focus:ring-[#0b99ff] h-4 w-4"
              />
              <span className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                I accept the appointment to the Editorial Board of <strong>{journal}</strong> and agree to uphold COPE publication ethics, declare conflicts of interest, and maintain editorial rigor.
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={consentProfileUpload}
                onChange={(e) => setConsentProfileUpload(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-[#0b99ff] focus:ring-[#0b99ff] h-4 w-4"
              />
              <span className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                I consent to the publication of my name, affiliation, and academic profile on the journal masthead in accordance with international open-access standards.
              </span>
            </label>
          </div>

          {/* Actions CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            {onSignInClick ? (
              <button
                type="button"
                onClick={onSignInClick}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline cursor-pointer"
              >
                Already have an account? Sign in to editorial360
              </button>
            ) : onCancel ? (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="text-xs font-semibold border-slate-200 dark:border-slate-800 h-9 px-4 rounded-lg cursor-pointer"
              >
                Back / Cancel
              </Button>
            ) : <div />}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-[#0b99ff] hover:bg-[#0088e0] text-white font-semibold h-10 px-6 rounded-lg text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Acceptance...</span>
                </>
              ) : (
                <>
                  <span>Accept Appointment & Activate Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </Button>
          </div>

        </form>
      </Card>

      <div className="text-center text-[11px] text-slate-400 mt-6">
        Scholarly Open Publishing Group · Mainz, Germany · COPE Guidelines Governed · All Rights Reserved
      </div>
    </div>
  )
}
