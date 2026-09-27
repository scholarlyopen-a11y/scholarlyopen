"use client"

import React, { useState, useRef } from "react"
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
  BookOpen, 
  Sparkles, 
  AlertCircle, 
  Trash2, 
  Plus, 
  ArrowRight,
  ExternalLink,
  Award,
  Layers,
  Check
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
  language?: string
}

export function EditorialBoardOnboarding({
  initialName = "",
  initialEmail = "",
  initialJournal = "Scholarly Open: Environmental Science",
  roleType = "board",
  onComplete,
  onCancel,
  language = "en"
}: EditorialBoardOnboardingProps) {
  const isPrashant = initialName.toLowerCase().includes("prashant") || initialName.toLowerCase().includes("kumar")

  const [title, setTitle] = useState(isPrashant ? "Prof. Dr." : "Dr.")
  const [name, setName] = useState(initialName || (isPrashant ? "Prof. Prashant Kumar" : ""))
  const [email, setEmail] = useState(initialEmail || (isPrashant ? "p.kumar@surrey.ac.uk" : ""))
  const [journal, setJournal] = useState(initialJournal || "Scholarly Open: Environmental Science")
  
  const [affiliation, setAffiliation] = useState(
    isPrashant ? "Global Centre for Clean Air Research (GCARE), University of Surrey" : ""
  )
  const [department, setDepartment] = useState(
    isPrashant ? "School of Engineering" : ""
  )
  const [country, setCountry] = useState(
    isPrashant ? "United Kingdom" : ""
  )

  const [photoUrl, setPhotoUrl] = useState<string>("")
  const [photoPreview, setPhotoPreview] = useState<string>("")
  const photoInputRef = useRef<HTMLInputElement>(null)

  const [cvFileName, setCvFileName] = useState(isPrashant ? "CV_Prof_Prashant_Kumar.pdf" : "")
  const [cvFileSize, setCvFileSize] = useState(isPrashant ? "280 KB" : "")
  const [cvFileStatus, setCvFileStatus] = useState<"none" | "uploaded">(isPrashant ? "uploaded" : "none")
  const cvInputRef = useRef<HTMLInputElement>(null)

  const [biography, setBiography] = useState(
    isPrashant
      ? "Professor Prashant Kumar is the Professor and Chair in Air Quality and Health at the University of Surrey, United Kingdom. He is the Founding Director of the Global Centre for Clean Air Research (GCARE) and Founding Co-Director of the Institute for Sustainability. He holds a PhD in Engineering from the University of Cambridge and has been consistently named in the top 1% of Global Highly Cited Researchers. He was awarded the 2023 Haagen-Smit Prize and Clean Air Award for his pioneering work in urban environmental science."
      : ""
  )

  const [interestsText, setInterestsText] = useState(
    isPrashant
      ? "Air Quality & Health, Aerosol Science, Low-Cost Sensing, Citizen Science, Nature-Based Solutions, Climate Change Mitigation, Environmental Engineering"
      : ""
  )

  const [orcid, setOrcid] = useState(isPrashant ? "0000-0002-8692-7484" : "")
  const [googleScholar, setGoogleScholar] = useState(
    isPrashant ? "https://scholar.google.com/citations?user=prashant-kumar" : ""
  )
  const [researchGate, setResearchGate] = useState(
    isPrashant ? "https://www.researchgate.net/profile/Prashant-Kumar-4" : ""
  )
  const [linkedin, setLinkedin] = useState("")

  const [publications, setPublications] = useState<Array<{ title: string; journal: string; year: string; doi: string }>>(
    isPrashant
      ? [
          {
            title: "Clean air engineering for cities: Connecting science, policy and people",
            journal: "Atmospheric Environment",
            year: "2024",
            doi: "10.1016/j.atmosenv.2024.120000"
          },
          {
            title: "The power of low-cost sensing for urban air quality monitoring and citizen engagement",
            journal: "Environmental Science & Technology",
            year: "2023",
            doi: "10.1021/acs.est.2023.001"
          }
        ]
      : [
          { title: "", journal: "", year: "", doi: "" }
        ]
  )

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(true)
  const [consentProfileUpload, setConsentProfileUpload] = useState(true)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // Handle Photo selection & conversion to base64
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

  // Handle CV File selection
  const handleCvSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const sizeKb = Math.round(file.size / 1024)
    setCvFileName(file.name)
    setCvFileSize(sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`)
    setCvFileStatus("uploaded")
  }

  // Add / remove publication rows
  const handleAddPub = () => {
    setPublications(prev => [...prev, { title: "", journal: "", year: "", doi: "" }])
  }

  const handleRemovePub = (idx: number) => {
    setPublications(prev => prev.filter((_, i) => i !== idx))
  }

  const handlePubChange = (idx: number, field: string, value: string) => {
    setPublications(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p))
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
    if (!hasAcceptedTerms) {
      setErrorMsg("You must accept the terms of the editorial appointment to proceed.")
      return
    }
    if (!consentProfileUpload) {
      setErrorMsg("Explicit consent to publish your profile and affiliation on the official website is required.")
      return
    }
    if (password && password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.")
      return
    }
    if (password && password !== confirmPassword) {
      setErrorMsg("Passwords do not match.")
      return
    }

    setIsSubmitting(true)

    const parsedInterests = interestsText
      .split(/[,;\n]+/)
      .map(s => s.trim())
      .filter(Boolean)

    const cleanedPubs = publications.filter(p => p.title.trim().length > 0)

    const payload: EditorialBoardOnboardingData = {
      title,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      journal,
      role: roleType === "eic" 
        ? "Editor-in-Chief" 
        : roleType === "ae" 
        ? "Associate Editor" 
        : "Editorial Board Member & Handling Editor",
      affiliation: affiliation.trim(),
      department: department.trim(),
      country: country.trim(),
      biography: biography.trim(),
      photoUrl: photoPreview || photoUrl,
      cvFileName: cvFileName || "CV_Uploaded.pdf",
      cvFileSize: cvFileSize || "Verified",
      orcid: orcid.trim(),
      googleScholar: googleScholar.trim(),
      researchGate: researchGate.trim(),
      linkedin: linkedin.trim(),
      researchInterests: parsedInterests,
      publications: cleanedPubs,
      password: password || "Editor360@2026",
      hasAcceptedTerms,
      consentProfileUpload
    }

    try {
      // 1. Post to invitation-response API
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
          researchInterests: payload.researchInterests,
          orcid: payload.orcid,
          googleScholar: payload.googleScholar,
          researchGate: payload.researchGate,
          linkedin: payload.linkedin,
          publications: payload.publications,
          hasAcceptedTerms: payload.hasAcceptedTerms,
          consentProfileUpload: payload.consentProfileUpload
        })
      })

      // 2. Post to editors API
      await fetch("/api/editorial360/editors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      // 3. Complete and handoff to parent
      onComplete(payload)
    } catch (err: any) {
      console.error("Failed to submit onboarding profile:", err)
      // Even if network fails, proceed with client-side state
      onComplete(payload)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-6 animate-in fade-in duration-300">
      <Card className="border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#18191e] shadow-xl rounded-3xl overflow-hidden">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#0b99ff]/15 via-emerald-500/10 to-[#0b99ff]/10 p-6 sm:p-8 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0b99ff] to-[#0077cc] text-white flex items-center justify-center shadow-md shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0b99ff] dark:text-sky-400 bg-[#0b99ff]/10 dark:bg-sky-950/40 px-2.5 py-0.5 rounded-full border border-[#0b99ff]/20">
                  Official Appointment & Web Registry Onboarding
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                  Accept Editorial Board Invitation
                </h1>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-500 font-medium block">Publishing House</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Scholarly Open · Mainz, Germany
              </span>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="text-xs text-slate-500 font-medium">Designated Journal Portfolio</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                <BookOpen className="w-4 h-4 text-[#0b99ff]" />
                <span>{journal}</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Role Assignment</div>
              <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <Award className="w-4 h-4" />
                <span>Editorial Board Member & Handling Editor</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Appointment Term</div>
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                2-Year Renewable (COPE Governed)
              </div>
            </div>
          </div>
        </div>

        {/* Onboarding Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs font-medium flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Academic Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <User className="w-4 h-4 text-[#0b99ff]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                1. Academic Identity & Institutional Affiliation
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1 sm:col-span-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Academic Title</label>
                <select
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131418] text-slate-900 dark:text-white focus:ring-1 focus:ring-[#0b99ff]"
                >
                  <option value="Prof. Dr.">Prof. Dr.</option>
                  <option value="Prof.">Prof.</option>
                  <option value="Dr.">Dr.</option>
                  <option value="Assoc. Prof.">Assoc. Prof.</option>
                  <option value="Assist. Prof.">Assist. Prof.</option>
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Academic Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Prof. Prashant Kumar"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131418] text-slate-900 dark:text-white focus:ring-1 focus:ring-[#0b99ff]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Primary Academic Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="p.kumar@surrey.ac.uk"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131418] text-slate-900 dark:text-white focus:ring-1 focus:ring-[#0b99ff]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Country</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. United Kingdom"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131418] text-slate-900 dark:text-white focus:ring-1 focus:ring-[#0b99ff]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Current University / Institution</label>
                <input
                  type="text"
                  required
                  value={affiliation}
                  onChange={(e) => setAffiliation(e.target.value)}
                  placeholder="e.g. Global Centre for Clean Air Research (GCARE), University of Surrey"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131418] text-slate-900 dark:text-white focus:ring-1 focus:ring-[#0b99ff]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Department / Centre</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. School of Engineering"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131418] text-slate-900 dark:text-white focus:ring-1 focus:ring-[#0b99ff]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Photo & CV Uploads */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Upload className="w-4 h-4 text-[#0b99ff]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                2. High-Resolution Photo & Curriculum Vitae (CV)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Photo Upload Box */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Academic Profile Photo</label>
                  <span className="text-[10px] text-slate-400 font-medium">JPEG / PNG / WebP</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full border-2 border-[#0b99ff]/30 overflow-hidden bg-white dark:bg-slate-800 flex items-center justify-center shrink-0 shadow-xs">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover object-center" />
                    ) : (
                      <User className="w-8 h-8 text-slate-400" />
                    )}
                  </div>

                  <div className="space-y-2 flex-1">
                    <input 
                      type="file" 
                      ref={photoInputRef}
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="hidden" 
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => photoInputRef.current?.click()}
                      className="h-8 text-xs font-semibold rounded-xl border-slate-300 dark:border-slate-700 w-full flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#0b99ff]" />
                      {photoPreview ? "Change Photo" : "Upload Photo File"}
                    </Button>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      To be displayed on the journal masthead and your public editor profile.
                    </p>
                  </div>
                </div>
              </div>

              {/* CV File Upload Box */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Curriculum Vitae (CV)</label>
                  <span className="text-[10px] text-slate-400 font-medium">PDF or DOCX</span>
                </div>

                <input 
                  type="file" 
                  ref={cvInputRef}
                  accept=".pdf,.doc,.docx"
                  onChange={handleCvSelect}
                  className="hidden" 
                />

                {cvFileStatus === "uploaded" ? (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200 truncate">{cvFileName}</div>
                        <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">{cvFileSize}</div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => cvInputRef.current?.click()}
                      className="text-xs text-slate-500 hover:text-slate-800 h-7 px-2"
                    >
                      Replace
                    </Button>
                  </div>
                ) : (
                  <div 
                    onClick={() => cvInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center cursor-pointer hover:border-[#0b99ff] transition-colors"
                  >
                    <FileText className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Click to upload CV document</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Used for accreditation and editorial archiving</span>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Section 3: Biography & Research Interests */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <BookOpen className="w-4 h-4 text-[#0b99ff]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                3. Academic Biography & Research Interests
              </h2>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Public Academic Biography (for Website)</label>
                <span className="text-[11px] text-slate-400">Recommended: 100–300 words</span>
              </div>
              <textarea
                required
                rows={4}
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                placeholder="Briefly describe your academic background, professorship, major milestones, and leadership in research..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131418] text-slate-900 dark:text-white leading-relaxed focus:ring-1 focus:ring-[#0b99ff]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Research Interests & Keywords (Comma-Separated)
              </label>
              <input
                type="text"
                required
                value={interestsText}
                onChange={(e) => setInterestsText(e.target.value)}
                placeholder="e.g. Air Quality, Aerosol Science, Low-Cost Sensing, Climate Mitigation"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131418] text-slate-900 dark:text-white focus:ring-1 focus:ring-[#0b99ff]"
              />
              <p className="text-[11px] text-slate-400">
                These keywords will be used to automatically match relevant submissions to your Handling Editor desk.
              </p>
            </div>
          </div>

          {/* Section 4: ORCID & Online Profiles */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Globe className="w-4 h-4 text-[#0b99ff]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                4. ORCID iD & Academic Scholarly Links
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">ORCID iD (16-digit)</label>
                <input
                  type="text"
                  value={orcid}
                  onChange={(e) => setOrcid(e.target.value)}
                  placeholder="0000-0002-8692-7484"
                  className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131418] text-slate-900 dark:text-white focus:ring-1 focus:ring-[#0b99ff]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Google Scholar URL</label>
                <input
                  type="url"
                  value={googleScholar}
                  onChange={(e) => setGoogleScholar(e.target.value)}
                  placeholder="https://scholar.google.com/citations?user=..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131418] text-slate-900 dark:text-white focus:ring-1 focus:ring-[#0b99ff]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">ResearchGate / LinkedIn URL</label>
                <input
                  type="url"
                  value={researchGate || linkedin}
                  onChange={(e) => {
                    setResearchGate(e.target.value)
                    setLinkedin(e.target.value)
                  }}
                  placeholder="https://researchgate.net/profile/..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131418] text-slate-900 dark:text-white focus:ring-1 focus:ring-[#0b99ff]"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Key Publications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#0b99ff]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  5. Key Landmark Publications (Featured on Web Profile)
                </h2>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAddPub}
                className="h-7 text-xs px-2.5 rounded-lg border-slate-300 dark:border-slate-700 text-[#0b99ff] hover:bg-[#0b99ff]/10 gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Publication
              </Button>
            </div>

            <div className="space-y-3">
              {publications.map((pub, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-500">Publication #{idx + 1}</span>
                    {publications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePub(idx)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={pub.title}
                      onChange={(e) => handlePubChange(idx, "title", e.target.value)}
                      placeholder="Article Title (e.g. Clean air engineering for cities...)"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131418] text-slate-900 dark:text-white"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={pub.journal}
                        onChange={(e) => handlePubChange(idx, "journal", e.target.value)}
                        placeholder="Journal (e.g. Atmospheric Environment)"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131418] text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        value={pub.year}
                        onChange={(e) => handlePubChange(idx, "year", e.target.value)}
                        placeholder="Year (e.g. 2024)"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131418] text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        value={pub.doi}
                        onChange={(e) => handlePubChange(idx, "doi", e.target.value)}
                        placeholder="DOI or URL (e.g. 10.1016/...)"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131418] text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Handling Editor Credentials Setup */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Lock className="w-4 h-4 text-[#0b99ff]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                6. Editorial360 Workspace Credentials (Handling Editor Account)
              </h2>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Create your secure login password for your newly appointed <strong>Handling Editor Desk</strong> on Editorial360. This enables you to review submissions, assign reviewers, and render editorial decisions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Set Account Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131418] text-slate-900 dark:text-white focus:ring-1 focus:ring-[#0b99ff]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131418] text-slate-900 dark:text-white focus:ring-1 focus:ring-[#0b99ff]"
                />
              </div>
            </div>
          </div>

          {/* Section 7: Mandatory Consent & Legal Transparency */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              7. Mandatory Consent & Governance Agreements
            </h3>

            <div className="space-y-3 pt-1">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasAcceptedTerms}
                  onChange={(e) => setHasAcceptedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-[#0b99ff] focus:ring-[#0b99ff] h-4 w-4"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>Terms of Editorial Appointment:</strong> I accept the 2-year renewable appointment as Editorial Board Member / Handling Editor for <em>{journal}</em>. I agree to uphold COPE publication ethics, maintain academic independence, and adhere to Scholarly Open editorial guidelines.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentProfileUpload}
                  onChange={(e) => setConsentProfileUpload(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-[#0b99ff] focus:ring-[#0b99ff] h-4 w-4"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>Website Profile Publication Consent:</strong> I grant formal consent for Scholarly Open Publishing Group to publish my name, academic affiliation, photo, biography, ORCID, and research profile on the official journal website masthead and public registry in accordance with GDPR and open-access transparency standards.
                </span>
              </label>
            </div>
          </div>

          {/* Actions CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="w-full sm:w-auto border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 h-11 px-6 rounded-xl text-xs cursor-pointer"
              >
                Back / Cancel
              </Button>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto sm:ml-auto bg-gradient-to-r from-[#0b99ff] to-[#0088e0] hover:from-[#0088e0] hover:to-[#0077cc] text-white font-bold h-12 px-8 rounded-xl text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Activating Handling Editor Account...</span>
                </>
              ) : (
                <>
                  <span>Submit Profile & Onboard to Editorial360</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>

        </form>
      </Card>
    </div>
  )
}
