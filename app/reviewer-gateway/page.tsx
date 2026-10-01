"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  BookOpen, 
  Award, 
  ArrowRight, 
  RotateCcw, 
  Check, 
  X, 
  FileText, 
  Globe, 
  ChevronRight,
  Printer,
  Share2,
  ExternalLink,
  ShieldAlert,
  EyeOff,
  Lock,
  Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"

interface Question {
  id: number
  category: "Academic English & Tone" | "COPE Ethics & Integrity" | "Methodological Rigor"
  scenario: string
  question: string
  options: {
    id: string
    text: string
    isCorrect: boolean
    explanation: string
  }[]
}

const QUESTION_BANK: Question[] = [
  // Category 1: Academic English & Tone
  {
    id: 1,
    category: "Academic English & Tone",
    scenario: "A manuscript exhibits several awkward and convoluted sentence constructions in the discussion section, though the underlying laboratory data is reproducible and sound.",
    question: "Which of the following comments represents professional, constructive peer-review phrasing in academic English?",
    options: [
      {
        id: "a",
        text: "The grammatical construction throughout the discussion is excessively convoluted; the authors must engage professional editorial assistance before resubmission.",
        isCorrect: false,
        explanation: "Overly harsh and dismissive. Reviewers should highlight specific passages and provide constructive direction."
      },
      {
        id: "b",
        text: "While experimental data is solid, the manuscript requires targeted language editing in Section 4 to resolve complex phrasing and clarify key interpretations.",
        isCorrect: true,
        explanation: "Exemplary academic tone: recognizes empirical rigor, isolates the section needing improvement, and maintains respectful collegiality."
      },
      {
        id: "c",
        text: "Summary rejection is warranted because syntactic inconsistencies in the discussion prevent reviewers from verifying whether the stated hypotheses are supported.",
        isCorrect: false,
        explanation: "Language flaws alone in sound experimental manuscripts should prompt constructive revision rather than summary dismissal."
      },
      {
        id: "d",
        text: "The authors should replace all passive voice constructions across Section 4 with active voice formulations to meet the standard archival conventions of the journal.",
        isCorrect: false,
        explanation: "Enforces subjective stylistic preferences rather than evaluating clarity and scientific precision."
      }
    ]
  },
  {
    id: 2,
    category: "Academic English & Tone",
    scenario: "An author's conclusion asserts that their newly developed neural network architecture is 'entirely flawless, completely superior, and unrivaled by all existing computational models.'",
    question: "How should an accredited referee objectively critique this overstatement in formal scholarly discourse?",
    options: [
      {
        id: "a",
        text: "The hyperbolic conclusions presented in the final paragraph demonstrate that the authors lack adequate familiarity with established benchmarks in the domain.",
        isCorrect: false,
        explanation: "Unprofessional ad hominem critique that questions author competence rather than addressing empirical boundaries."
      },
      {
        id: "b",
        text: "The conclusions regarding universal superiority appear overgeneralized; please temper these claims by detailing boundary conditions and parameter trade-offs.",
        isCorrect: true,
        explanation: "Accurate and rigorous: encourages scientific modesty, requires explicit boundaries, and guides authors toward empirical precision."
      },
      {
        id: "c",
        text: "The authors must delete all claims of computational superiority and explicitly state that existing benchmark algorithms perform equally well under noise.",
        isCorrect: false,
        explanation: "Prescriptive overreach that dictates author conclusions rather than requesting objective qualification."
      },
      {
        id: "d",
        text: "I cannot endorse this submission because my own previously published neural architecture achieves comparable classification metrics with lower latency.",
        isCorrect: false,
        explanation: "Egocentric review comment that lacks impartial evaluation and risks compromising double-blind confidentiality."
      }
    ]
  },
  {
    id: 3,
    category: "Academic English & Tone",
    scenario: "A submitted paper frequently employs informal colloquial phrases such as 'a rule of thumb', 'touch and go', and 'gut feeling' when describing experimental parameter selection.",
    question: "What is the appropriate academic recommendation to uphold international archival standards?",
    options: [
      {
        id: "a",
        text: "Recommend replacing informal idioms with standardized technical terminology and quantifiable heuristic thresholds to preserve global archival precision.",
        isCorrect: true,
        explanation: "Correct: formal scientific literature requires precise, unambiguous definitions to ensure international reproducibility."
      },
      {
        id: "b",
        text: "Permit the colloquial expressions because international readers can generally deduce practical meaning from the surrounding experimental context.",
        isCorrect: false,
        explanation: "Colloquialisms create ambiguity, translation errors, and comprehension barriers for global scholarship."
      },
      {
        id: "c",
        text: "Report the manuscript to the editorial office for immediate ethical investigation regarding unprofessional scientific communication standards.",
        isCorrect: false,
        explanation: "Informal phrasing is a stylistic and editorial matter, not research misconduct or an ethical breach."
      },
      {
        id: "d",
        text: "Instruct the authors to formalize their text by converting all informal expressions into verbatim Latin nomenclature across the methodology.",
        isCorrect: false,
        explanation: "Inappropriate stylistic demand that does not enhance methodological clarity."
      }
    ]
  },

  // Category 2: COPE Ethics & Integrity
  {
    id: 4,
    category: "COPE Ethics & Integrity",
    scenario: "While evaluating a double-blind manuscript, you realize that the research directly competes with your lab's active grant application, and you identify the lead author as a former collaborator.",
    question: "Under the Committee on Publication Ethics (COPE) core practices, what is your mandatory obligation?",
    options: [
      {
        id: "a",
        text: "Complete the evaluation swiftly with stringent scoring criteria to ensure competitive equilibrium for your research group's pending grant.",
        isCorrect: false,
        explanation: "Gross ethical violation: exploiting reviewer status to delay or prejudice competing scholarship."
      },
      {
        id: "b",
        text: "Disclose the competitive and personal conflict of interest immediately to the Handling Editor and recuse yourself from further evaluation.",
        isCorrect: true,
        explanation: "COPE mandates immediate declaration and recusal whenever financial, personal, or competitive conflicts compromise impartiality."
      },
      {
        id: "c",
        text: "Proceed with the review provided that you do not discuss the competing findings with laboratory members until official journal publication.",
        isCorrect: false,
        explanation: "Concealing a known conflict of interest compromises the integrity and independence of the peer review process."
      },
      {
        id: "d",
        text: "Download the experimental protocol and raw datasets for archival verification before declining the formal invitation to review the paper.",
        isCorrect: false,
        explanation: "Blatant breach of reviewer confidentiality and intellectual property misappropriation."
      }
    ]
  },
  {
    id: 5,
    category: "COPE Ethics & Integrity",
    scenario: "You identify four verbatim paragraphs in the literature review that match a previously published paper without quotation marks, though the source is cited at the end of the section.",
    question: "How must this potential text overlap be handled in accordance with COPE publishing standards?",
    options: [
      {
        id: "a",
        text: "Notify the corresponding author via direct email to request immediate clarification and replacement of the disputed introductory paragraphs.",
        isCorrect: false,
        explanation: "Referees must never contact authors directly; all communications must proceed through the editorial desk."
      },
      {
        id: "b",
        text: "Report the specific overlapping passages confidentially to the Handling Editor with the citation to allow standard similarity forensics.",
        isCorrect: true,
        explanation: "Appropriate protocol: provides confidential evidence to the handling editor to initiate formal similarity investigation."
      },
      {
        id: "c",
        text: "Overlook the verbatim passages because citing the reference in the bibliography satisfies conventional academic attribution requirements.",
        isCorrect: false,
        explanation: "Verbatim copying without quotes or quotation formatting constitutes plagiarism regardless of bibliography citation."
      },
      {
        id: "d",
        text: "Publish a public inquiry on academic social networks regarding the duplication to protect scientific integrity prior to editorial ruling.",
        isCorrect: false,
        explanation: "Breaches confidentiality obligations regarding unpublished manuscript materials."
      }
    ]
  },
  {
    id: 6,
    category: "COPE Ethics & Integrity",
    scenario: "You are preparing your peer review report and consider suggesting that the authors cite three of your own recent publications that are only tangentially related to the manuscript's topic.",
    question: "Under COPE guidelines regarding coercive citation practices, what is the referee's ethical boundary?",
    options: [
      {
        id: "a",
        text: "Reviewers may recommend self-citations provided they also suggest an equal number of foundational papers published by other research teams.",
        isCorrect: false,
        explanation: "Coercive self-citation remains unethical regardless of whether other papers are simultaneously mentioned."
      },
      {
        id: "b",
        text: "Reviewers must never request citations to their own work to artificially inflate citation metrics; citations must be scientifically indispensable.",
        isCorrect: true,
        explanation: "COPE strictly forbids referees from using review reports to game citations or enhance personal impact metrics."
      },
      {
        id: "c",
        text: "Self-citations are permitted without editorial justification whenever a paper is submitted under an open-access Creative Commons license.",
        isCorrect: false,
        explanation: "Publishing models (Open Access or subscription) have no bearing on peer review citation ethics."
      },
      {
        id: "d",
        text: "Reviewers are encouraged by publishing standards to incorporate at least two relevant self-citations per report to establish domain expertise.",
        isCorrect: false,
        explanation: "Completely untrue; peer reviewers are appointed on established merit, not to insert self-citations."
      }
    ]
  },
  {
    id: 7,
    category: "COPE Ethics & Integrity",
    scenario: "A biological study features Western blot figure panels where two distinct protein bands across separate control lanes appear duplicate under magnification, suggesting potential manipulation.",
    question: "What is the proper, COPE-compliant course of action for the evaluating referee?",
    options: [
      {
        id: "a",
        text: "Document the duplicated figure regions confidentially in Comments to Editor and recommend requesting high-resolution unprocessed raw blot scans.",
        isCorrect: true,
        explanation: "Provides objective, confidential evidence to the editor while upholding the integrity of the peer review workflow."
      },
      {
        id: "b",
        text: "Assume an accidental clerical error during figure assembly and advise the authors in public comments to substitute an alternative blot panel.",
        isCorrect: false,
        explanation: "Neglects research integrity; image duplication is a major red flag that requires editorial verification."
      },
      {
        id: "c",
        text: "Unilaterally reject the manuscript for fraud without notifying the handling editor or providing verifiable visual evidence of duplication.",
        isCorrect: false,
        explanation: "Editorial offices, not individual reviewers, hold the jurisdiction to investigate and adjudicate fraud allegations."
      },
      {
        id: "d",
        text: "Post the magnified figure panels anonymously on public post-publication forums to crowd-source independent forensic image verification.",
        isCorrect: false,
        explanation: "Direct violation of manuscript confidentiality and COPE reviewer confidentiality agreements."
      }
    ]
  },

  // Category 3: Methodological Rigor & Reporting Quality
  {
    id: 8,
    category: "Methodological Rigor",
    scenario: "A clinical pilot investigation evaluates a novel cardiovascular intervention in a cohort of 6 patients without a control arm or power calculation, claiming 'statistically proven universal efficacy.'",
    question: "Which methodological assessment must the referee prioritize in their evaluation report?",
    options: [
      {
        id: "a",
        text: "The sample size (n=6) lacks statistical power and the absence of a control cohort precludes causal inference; findings must be framed as a pilot.",
        isCorrect: true,
        explanation: "Accurately targets statistical underpowering, lack of control arm, and unsubstantiated causal generalizations."
      },
      {
        id: "b",
        text: "The experimental cohort is statistically sufficient for definitive therapeutic claims provided that parametric Student's t-tests were executed.",
        isCorrect: false,
        explanation: "Scientifically unsound; n=6 without controls cannot establish causal efficacy regardless of t-test computations."
      },
      {
        id: "c",
        text: "The manuscript should be accepted on the condition that the authors expand the discussion section by at least fifteen pages of background context.",
        isCorrect: false,
        explanation: "Arbitrary length additions do not remediate fundamental experimental underpowering or absent controls."
      },
      {
        id: "d",
        text: "The study design is adequate for clinical translation, but all bar chart visualizations must be converted into high-density violin plot graphs.",
        isCorrect: false,
        explanation: "Focuses on superficial visualization formatting while ignoring fatal clinical methodology flaws."
      }
    ]
  },
  {
    id: 9,
    category: "Methodological Rigor",
    scenario: "A deep learning paper reports 99.8% diagnostic accuracy on medical images, but omits the training/test split protocol, cross-validation parameters, and open repository code link.",
    question: "How should an accredited referee evaluate this computational submission?",
    options: [
      {
        id: "a",
        text: "Accept the manuscript without delay because achieving 99.8% classification accuracy represents a definitive benchmark breakthrough in the domain.",
        isCorrect: false,
        explanation: "Uncritical acceptance of high metrics without verification protocols invites data leakage and reproducibility failures."
      },
      {
        id: "b",
        text: "Request detailed cross-validation methodology, test set isolation protocols, and open code availability to verify reproducibility under FAIR rules.",
        isCorrect: true,
        explanation: "Essential for modern AI peer review: requires proof against data leakage, partition isolation, and open reproducibility."
      },
      {
        id: "c",
        text: "Reject the submission summarily because any machine learning accuracy metric exceeding 95% indicates unverifiable mathematical impossibility.",
        isCorrect: false,
        explanation: "Arbitrary summary rejection without requesting methodological details denies authors due process."
      },
      {
        id: "d",
        text: "Require the authors to re-run their deep learning models on specialized quantum processing hardware to confirm stability under thermal variance.",
        isCorrect: false,
        explanation: "Irrelevant and non-actionable technical demand that fails to address standard train/test leakage."
      }
    ]
  },
  {
    id: 10,
    category: "Methodological Rigor",
    scenario: "An author performs 15 independent statistical significance tests on a single clinical dataset and reports unadjusted p-values ranging between 0.041 and 0.049 as definitive discoveries.",
    question: "What critical statistical concern must the reviewer raise regarding these reported findings?",
    options: [
      {
        id: "a",
        text: "Multiplicity generates high risk of Type I false positive discovery; authors must report adjusted p-values and effect sizes with 95% confidence intervals.",
        isCorrect: true,
        explanation: "Standard statistical rigor: multiple testing inflates false positive error rates, necessitating FDR/Bonferroni corrections and effect sizes."
      },
      {
        id: "b",
        text: "All unadjusted p-values below the 0.05 threshold confirm genuine biological significance regardless of how many simultaneous hypothesis tests are performed.",
        isCorrect: false,
        explanation: "Classic statistical fallacy: cumulative Type I error increases significantly with multiple comparisons."
      },
      {
        id: "c",
        text: "The authors should adjust the significance threshold by arbitrarily dividing all computed p-values by two to substantiate the strength of evidence.",
        isCorrect: false,
        explanation: "Mathematically invalid adjustment that distorts statistical inference."
      },
      {
        id: "d",
        text: "Statistical hypothesis testing should be discarded entirely from the manuscript in favor of subjective qualitative observation of cohort trends.",
        isCorrect: false,
        explanation: "Unscientific recommendation; quantitative empirical studies require rigorous, adjusted inferential statistics."
      }
    ]
  }
]

export default function ReviewerGatewayPage() {
  const { t } = useLanguage()

  // State
  const [step, setStep] = useState<"intro" | "exam" | "results">("intro")
  const [candidateName, setCandidateName] = useState("")
  const [candidateEmail, setCandidateEmail] = useState("")
  const [candidateAffiliation, setCandidateAffiliation] = useState("")
  const [candidateDepartment, setCandidateDepartment] = useState("")
  const [candidateOrcid, setCandidateOrcid] = useState("")
  const [candidateKeywords, setCandidateKeywords] = useState("")
  const [cvFileName, setCvFileName] = useState("")
  const [cvFileSize, setCvFileSize] = useState("")
  const [cvBase64, setCvBase64] = useState("")
  const [selectedDiscipline, setSelectedDiscipline] = useState("medicine")
  const [formError, setFormError] = useState<string | null>(null)
  
  // Exam progress
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [credentialId, setCredentialId] = useState("")

  // Anti-cheating & proctoring suite states
  const [tabSwitchCount, setTabSwitchCount] = useState(0)
  const [proctorAlert, setProctorAlert] = useState<string | null>(null)

  // Handle CV file selection & base64 conversion
  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 12 * 1024 * 1024) {
      setFormError("CV file size exceeds 12 MB limit. Please select a smaller document.")
      return
    }

    const sizeFormatted = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`

    setCvFileName(file.name)
    setCvFileSize(sizeFormatted)
    setFormError(null)

    const reader = new FileReader()
    reader.onload = () => {
      setCvBase64(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Shuffle & pick 10 questions on start
  const startExam = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!candidateName.trim() || !candidateEmail.trim() || !candidateAffiliation.trim()) {
      setFormError("Please provide your full legal academic name, institutional email, and university affiliation.")
      return
    }

    if (!candidateDepartment.trim()) {
      setFormError("Please enter your academic department, faculty, and current position.")
      return
    }

    // Validate 16-digit ORCID format
    const orcidClean = candidateOrcid.trim()
    const orcidRegex = /^\d{4}-\d{4}-\d{4}-[\dX]{4}$/
    if (!orcidClean) {
      setFormError("ORCID iD is required for COPE publication integrity and reviewer attribution.")
      return
    }
    if (!orcidRegex.test(orcidClean)) {
      setFormError("Please enter a valid 16-digit ORCID iD in the format: 0000-0002-1825-0097")
      return
    }

    if (!cvBase64) {
      setFormError("Please upload your Curriculum Vitae (PDF or Word document). Institutional CV verification is mandatory before reviewer credentials are issued.")
      return
    }

    // Deterministic shuffle of the bank
    const shuffled = [...QUESTION_BANK].sort(() => 0.5 - Math.random())
    setQuestions(shuffled)
    setCurrentIndex(0)
    setUserAnswers({})
    setTimeLeft(15 * 60)
    setIsTimerRunning(true)
    setTabSwitchCount(0)
    setProctorAlert(null)
    setStep("exam")
    
    // Generate simulated permanent credential ID
    const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase()
    setCredentialId(`SO-REV-${new Date().getFullYear()}-${randomHex}`)
  }

  // Active exam security & proctoring event listeners
  useEffect(() => {
    if (step !== "exam") return

    // 1. Tab visibility / window focus loss detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => {
          const next = prev + 1
          setProctorAlert(`Proctor Alert #${next}: Tab switch or background switch detected. Navigating away from the active exam is logged in your qualification dossier.`)
          return next
        })
      }
    }

    const handleBlur = () => {
      setTabSwitchCount(prev => {
        const next = prev + 1
        setProctorAlert(`Proctor Warning: Window focus lost (${next}/3 recorded). Please remain within the assessment window.`)
        return next
      })
    }

    // 2. Keyboard blocking: PrintScreen, devtools (F12, Ctrl+Shift+I/J/C), source (Ctrl+U), print (Ctrl+P)
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen
      if (e.key === "PrintScreen") {
        e.preventDefault()
        setProctorAlert("Proctor Security: Screen capture attempts (PrintScreen) are disabled during the live assessment.")
        return false
      }

      // Ctrl+P or Cmd+P (Print)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault()
        setProctorAlert("Proctor Security: Printing the examination document is prohibited.")
        return false
      }

      // DevTools: F12 or Ctrl+Shift+I / J / C
      if (
        e.key === "F12" ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "j", "c"].includes(e.key.toLowerCase())) ||
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "u")
      ) {
        e.preventDefault()
        setProctorAlert("Proctor Security: Inspecting page elements and developer tooling is strictly forbidden.")
        return false
      }

      // Copy / Cut shortcuts: Ctrl+C / Cmd+C, Ctrl+X
      if ((e.ctrlKey || e.metaKey) && ["c", "x"].includes(e.key.toLowerCase())) {
        e.preventDefault()
        setProctorAlert("Proctor Security: Copying exam scenarios or answer text is disabled.")
        return false
      }
    }

    // 3. Context menu blocking
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      setProctorAlert("Proctor Security: Right-click context menu is disabled during the assessment.")
    }

    // 4. Copy/Cut event listeners
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault()
      setProctorAlert("Proctor Security: Clipboard extraction is blocked.")
    }

    window.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("blur", handleBlur)
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("contextmenu", handleContextMenu)
    window.addEventListener("copy", handleCopy)

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("blur", handleBlur)
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("contextmenu", handleContextMenu)
      window.removeEventListener("copy", handleCopy)
    }
  }, [step])

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            setIsTimerRunning(false)
            setStep("results")
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isTimerRunning, timeLeft])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const handleSelectOption = (questionId: number, optionId: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }))
  }

  const handleFinishExam = () => {
    setIsTimerRunning(false)
    setStep("results")

    let correctCount = 0
    questions.forEach(q => {
      const chosen = userAnswers[q.id]
      const opt = q.options.find(o => o.id === chosen)
      if (opt && opt.isCorrect) correctCount += 1
    })
    const percentage = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0
    const isPassed = percentage >= 80

    // Server-side audit log for Admin tracking (persisted to Supabase)
    fetch("/api/editorial360/reviewer-tests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        candidateName: candidateName || "Dr. Candidate",
        candidateEmail: candidateEmail || "candidate@university.edu",
        discipline: selectedDiscipline,
        institution: candidateAffiliation || "Academic Institution",
        department: candidateDepartment || "",
        orcid: candidateOrcid || "",
        cvFileName,
        cvFileSize,
        cvBase64,
        score: percentage,
        totalQuestions: questions.length,
        passed: isPassed,
        credentialId: isPassed ? credentialId : undefined,
        status: isPassed ? "Pending JM Approval" : "Failed Threshold"
      })
    }).catch(err => console.error("Failed to log reviewer test:", err))

    // Submit formal application / claim to the Journal Manager Desk
    if (isPassed) {
      fetch("/api/editorial360/invitation-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "reviewer_claim",
          candidateName,
          candidateEmail,
          journal: "Scholarly Open",
          decision: "claimed",
          credentialId,
          affiliation: candidateAffiliation,
          department: candidateDepartment,
          orcid: candidateOrcid,
          cvFileName,
          cvFileSize,
          cvBase64,
          researchInterests: candidateKeywords ? candidateKeywords.split(",").map(k => k.trim()).filter(Boolean) : [selectedDiscipline],
          status: "Pending JM Approval",
          jmApproved: false,
          notes: `Reviewer Gateway assessment completed (${percentage}%). Candidate submitted dossier for JM vetting.`
        })
      }).catch(err => console.error("Failed to record reviewer application:", err))
    }
  }

  // Scoring
  const scoreStats = useMemo(() => {
    if (questions.length === 0) return { total: 0, correct: 0, percentage: 0, passed: false, categoryScores: {} }
    
    let correctCount = 0
    const catStats: Record<string, { total: number, correct: number }> = {}

    questions.forEach(q => {
      if (!catStats[q.category]) {
        catStats[q.category] = { total: 0, correct: 0 }
      }
      catStats[q.category].total += 1

      const chosenOptionId = userAnswers[q.id]
      const chosenOption = q.options.find(o => o.id === chosenOptionId)
      if (chosenOption && chosenOption.isCorrect) {
        correctCount += 1
        catStats[q.category].correct += 1
      }
    })

    const percentage = Math.round((correctCount / questions.length) * 100)
    const passed = percentage >= 80 // 80% passing standard

    return {
      total: questions.length,
      correct: correctCount,
      percentage,
      passed,
      categoryScores: catStats
    }
  }, [questions, userAnswers])

  const currentQ = questions[currentIndex]

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          {/* STEP 1: INTRO & CANDIDATE REGISTRATION */}
          {step === "intro" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="text-center max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-semibold text-primary mb-4">
                  <ShieldCheck className="h-4 w-4" /> Reviewer Gateway
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Certified Peer Reviewer Assessment
                </h1>
                <p className="mt-4 text-muted-foreground text-sm sm:text-base leading-relaxed">
                  In accordance with our Plan S transparency commitments and COPE standards, independent referee candidates must demonstrate mastery of constructive academic English, publication ethics, and methodological rigor.
                </p>
              </div>

              {/* Assessment Specification Grid */}
              <div className="grid sm:grid-cols-3 gap-4">
                <Card className="border-border bg-card/60">
                  <CardContent className="p-5 flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">15 Minutes</h4>
                      <p className="text-xs text-muted-foreground mt-1">Timed countdown. 10 randomized scenario-based questions.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card/60">
                  <CardContent className="p-5 flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">80% Passing Score</h4>
                      <p className="text-xs text-muted-foreground mt-1">Evaluates constructive phrasing, COPE ethics, and rigor.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card/60">
                  <CardContent className="p-5 flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Honoraria Access</h4>
                      <p className="text-xs text-muted-foreground mt-1">Unlocks immediate eligibility for our €35–€50 reward pool.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Candidate Info Form */}
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-[#0b99ff]" />
                    <CardTitle className="text-xl">Candidate Vetting & Accreditation Dossier</CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    In compliance with COPE research integrity guidelines and Plan S standards, referee candidates must provide verified institutional affiliations, an ORCID iD, and an academic CV prior to assessment qualification.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {formError && (
                    <div className="mb-5 p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-start gap-2 animate-in fade-in">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <div>
                        <strong>Verification Error: </strong>
                        {formError}
                      </div>
                    </div>
                  )}

                  <form onSubmit={startExam} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                          <span>Full Academic Name & Title *</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={candidateName}
                          onChange={(e) => setCandidateName(e.target.value)}
                          placeholder="e.g., Dr. Marcus Vance, Ph.D."
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                          <span>Academic Institutional Email *</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={candidateEmail}
                          onChange={(e) => setCandidateEmail(e.target.value)}
                          placeholder="m.vance@university.edu"
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <span className="text-[10px] text-muted-foreground">Free webmails (@gmail, @yahoo) require secondary institutional proof.</span>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">University / Institution *</label>
                        <input
                          type="text"
                          required
                          value={candidateAffiliation}
                          onChange={(e) => setCandidateAffiliation(e.target.value)}
                          placeholder="e.g., University of Oxford / Max Planck Institute"
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">Department & Position *</label>
                        <input
                          type="text"
                          required
                          value={candidateDepartment}
                          onChange={(e) => setCandidateDepartment(e.target.value)}
                          placeholder="e.g., Dept. of Materials Science, Associate Professor"
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                          <span>Verified ORCID iD *</span>
                          {candidateOrcid && /^\d{4}-\d{4}-\d{4}-[\dX]{4}$/.test(candidateOrcid.trim()) && (
                            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Valid Format
                            </span>
                          )}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={candidateOrcid}
                            onChange={(e) => setCandidateOrcid(e.target.value)}
                            placeholder="0000-0002-1825-0097"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground">16-digit persistent digital identifier (https://orcid.org/...)</span>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">Primary Field of Expertise *</label>
                        <select
                          value={selectedDiscipline}
                          onChange={(e) => setSelectedDiscipline(e.target.value)}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="medicine">Medicine & Health Sciences</option>
                          <option value="biology">Biology & Life Sciences</option>
                          <option value="chemistry">Chemistry & Materials</option>
                          <option value="clinical-ai">Clinical AI & Digital Health</option>
                          <option value="ai-safety">AI Safety & Governance</option>
                          <option value="data-science">Data Science & Computing</option>
                          <option value="engineering">Engineering & Physical Sciences</option>
                          <option value="social-sciences">Social Sciences & Humanities</option>
                          <option value="environmental">Environmental Sciences & Decarbonization</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Research Keywords / Subspecialties *</label>
                      <input
                        type="text"
                        required
                        value={candidateKeywords}
                        onChange={(e) => setCandidateKeywords(e.target.value)}
                        placeholder="e.g., Nanostructured materials, thin films, electrochemistry, machine learning"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <span className="text-[10px] text-muted-foreground">Comma-separated terms used for automated COPE referee matching algorithms.</span>
                    </div>

                    {/* Mandatory Curriculum Vitae (CV) Upload */}
                    <div className="space-y-2 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40">
                      <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <FileText className="h-4 w-4 text-[#0b99ff]" />
                          <span>Curriculum Vitae (CV) Upload * (Required for Institutional Vetting)</span>
                        </span>
                        {cvFileName && (
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                            Attached: {cvFileName} ({cvFileSize})
                          </span>
                        )}
                      </label>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        To eliminate predatory referee entries and verify academic tenure, candidates must attach a recent CV detailing peer-reviewed publications and institutional appointments.
                      </p>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleCvChange}
                        className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#0b99ff] file:text-white hover:file:bg-[#0088e0] cursor-pointer"
                      />
                    </div>

                    <div className="p-4 rounded-lg bg-muted/40 border border-border text-xs text-muted-foreground leading-relaxed">
                      <strong>Governance Notice:</strong> By proceeding, you attest that you will complete this assessment independently. Passing this assessment qualifies your application for <strong>Journal Manager review & approval</strong>. Accounts and referee privileges are not activated until credential verification is complete.
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button type="submit" size="lg" className="font-semibold text-sm gap-2 cursor-pointer bg-[#0b99ff] hover:bg-[#0088e0] text-white">
                        Submit Dossier & Begin Assessment <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* STEP 2: ACTIVE TIMED EXAM */}
          {step === "exam" && currentQ && (
            <>
              {/* Security Diagonal Watermark Overlays */}
              <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center opacity-[0.035] rotate-[-25deg] text-xs sm:text-base font-black tracking-widest text-foreground uppercase select-none overflow-hidden">
                SCHOLARLY OPEN PROCTORING • VERIFIED EXAM SESSION • {candidateName || "CANDIDATE"} • {credentialId} • CONFIDENTIAL TEST BANK
              </div>

              <div 
                onContextMenu={(e) => { e.preventDefault(); setProctorAlert("Proctor Security: Right-click context menu is disabled during the exam.") }}
                onCopy={(e) => { e.preventDefault(); setProctorAlert("Proctor Security: Copying exam scenarios or answers is disabled.") }}
                onCut={(e) => { e.preventDefault(); setProctorAlert("Proctor Security: Clipboard actions are disabled.") }}
                className="space-y-6 animate-in fade-in duration-200 select-none relative z-10"
              >
                {/* Proctor Security Alert Banner */}
                {proctorAlert && (
                  <div className="p-4 rounded-xl bg-destructive/10 border-2 border-destructive/30 text-destructive flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in text-xs font-semibold shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <ShieldAlert className="h-5 w-5 shrink-0 animate-bounce" />
                      <span>{proctorAlert}</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setProctorAlert(null)}
                      className="border-destructive/30 hover:bg-destructive/20 text-destructive text-xs font-bold h-7 px-3 cursor-pointer shrink-0 self-end sm:self-auto"
                    >
                      Acknowledge & Continue
                    </Button>
                  </div>
                )}
                
                {/* Exam Header: Timer + Progress + Proctor Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-card border border-border shadow-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Question {currentIndex + 1} of {questions.length}
                    </span>
                    <span className="hidden sm:inline-block text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {currentQ.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* Proctor Active Badge */}
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <Shield className="h-3.5 w-3.5" /> Proctor Active
                    </span>

                    {tabSwitchCount > 0 && (
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        tabSwitchCount >= 3 
                          ? "bg-destructive/10 text-destructive border border-destructive/30 animate-pulse" 
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      }`}>
                        <EyeOff className="h-3 w-3" /> Focus Lost: {tabSwitchCount}/3
                      </span>
                    )}

                    {/* Countdown Timer */}
                    <div className="flex items-center gap-2 font-mono text-sm font-bold bg-muted px-3 py-1.5 rounded-lg border border-border ml-1">
                      <Clock className={`h-4 w-4 ${timeLeft < 180 ? "text-destructive animate-pulse" : "text-primary"}`} />
                      <span className={timeLeft < 180 ? "text-destructive" : "text-foreground"}>
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>

              {/* Active Question Card */}
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-4">
                  <div className="sm:hidden text-xs font-semibold text-primary mb-2">
                    {currentQ.category}
                  </div>
                  <div className="p-3.5 rounded-lg bg-muted/40 border border-border/70 text-xs sm:text-sm text-foreground/85 leading-relaxed font-mono">
                    <span className="font-semibold text-primary uppercase text-[11px] block mb-1">Scenario:</span>
                    {currentQ.scenario}
                  </div>
                  <CardTitle className="text-base sm:text-lg font-bold mt-4 leading-snug">
                    {currentQ.question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-2">
                  {currentQ.options.map((opt) => {
                    const isSelected = userAnswers[currentQ.id] === opt.id
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOption(currentQ.id, opt.id)}
                        className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? "bg-primary/10 border-primary shadow-xs text-foreground font-medium"
                            : "bg-background hover:bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold ${
                          isSelected ? "bg-primary text-primary-foreground border-primary" : "border-muted-foreground/40 text-muted-foreground"
                        }`}>
                          {opt.id.toUpperCase()}
                        </div>
                        <div className="flex-1 leading-relaxed">
                          {opt.text}
                        </div>
                      </button>
                    )
                  })}

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-6 mt-4 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentIndex === 0}
                      onClick={() => setCurrentIndex(prev => prev - 1)}
                      className="cursor-pointer"
                    >
                      Previous
                    </Button>

                    <div className="flex items-center gap-2">
                      {currentIndex < questions.length - 1 ? (
                        <Button
                          size="sm"
                          onClick={() => setCurrentIndex(prev => prev + 1)}
                          disabled={!userAnswers[currentQ.id]}
                          className="cursor-pointer font-semibold gap-1.5"
                        >
                          Next Question <ChevronRight className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={handleFinishExam}
                          disabled={Object.keys(userAnswers).length < questions.length}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-4 cursor-pointer"
                        >
                          Submit Final Assessment
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Question Navigation Bubbles */}
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {questions.map((q, idx) => {
                  const answered = !!userAnswers[q.id]
                  const isCurrent = idx === currentIndex
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-8 w-8 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isCurrent 
                          ? "ring-2 ring-primary ring-offset-2 bg-primary text-primary-foreground" 
                          : answered 
                            ? "bg-primary/20 text-primary border border-primary/30" 
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  )
                })}
              </div>
            </div>
            </>
          )}

          {/* STEP 3: RESULTS & CERTIFICATE */}
          {step === "results" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Score Banner */}
              <Card className={`border ${scoreStats.passed ? "border-primary/40 bg-primary/5" : "border-destructive/30 bg-destructive/5"}`}>
                <CardContent className="p-8 text-center space-y-4">
                  <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                    scoreStats.passed ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"
                  }`}>
                    {scoreStats.passed ? <CheckCircle2 className="h-8 w-8" /> : <AlertCircle className="h-8 w-8" />}
                  </div>

                  <div>
                    <span className={`text-xs font-bold uppercase tracking-widest ${scoreStats.passed ? "text-primary" : "text-destructive"}`}>
                      {scoreStats.passed ? "Assessment Passed (Rigor Qualified)" : "Passing Threshold Not Met"}
                    </span>
                    <h2 className="text-3xl font-bold tracking-tight mt-1">
                      {scoreStats.percentage}% Score ({scoreStats.correct} / {scoreStats.total} Correct)
                    </h2>
                    <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto leading-relaxed">
                      {scoreStats.passed
                        ? "Congratulations! You have satisfied the standardized criteria for English comprehension, constructive peer review framing, and COPE publication ethics."
                        : "The passing threshold for Scholarly Open certification is 80%. You may review the explanations below and re-attempt the assessment in 7 days."}
                    </p>
                  </div>

                  {/* Category Breakdown Badges */}
                  <div className="grid sm:grid-cols-3 gap-3 pt-4 max-w-2xl mx-auto text-left">
                    {Object.entries(scoreStats.categoryScores).map(([category, stats]) => {
                      const catPct = Math.round((stats.correct / stats.total) * 100)
                      return (
                        <div key={category} className="p-3 rounded-lg bg-background border border-border">
                          <span className="text-[11px] font-semibold text-muted-foreground block truncate">{category}</span>
                          <span className="text-base font-bold text-foreground mt-0.5 block">{catPct}% ({stats.correct}/{stats.total})</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* IF PASSED: THE OFFICIAL VERIFIABLE CERTIFICATE */}
              {scoreStats.passed && (
                <div className="space-y-5">
                  
                  {/* Journal Manager Vetting Gate Callout */}
                  <div className="p-6 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 animate-in fade-in">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
                        <h4 className="font-bold text-sm text-amber-900 dark:text-amber-200">
                          Assessment Passed ({scoreStats.percentage}%) — Application Under Journal Manager Vetting
                        </h4>
                      </div>
                      <p className="text-xs text-amber-800/80 dark:text-amber-300/80 max-w-2xl leading-relaxed">
                        In strict accordance with COPE research integrity guidelines and Plan S governance, referee accounts are <strong>never activated automatically</strong>. Your complete accreditation dossier (Institution: <strong>{candidateAffiliation}</strong>, Department: <strong>{candidateDepartment}</strong>, ORCID: <strong>{candidateOrcid || "Pending"}</strong>, and Uploaded CV: <strong>{cvFileName || "Attached"}</strong>) has been securely synchronized with the Journal Management Office.
                      </p>
                      <p className="text-xs text-amber-900 dark:text-amber-200 font-semibold pt-1">
                        The Journal Manager (Noor F. · info@scholarlyopen.org) will independently verify your institutional tenure before granting editorial360 manuscript assignment access. You will receive an official notification once approved.
                      </p>
                    </div>

                    <div className="shrink-0 flex flex-col sm:items-end gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40">
                        <Clock className="h-3.5 w-3.5" /> Pending JM Approval
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        Dossier ID: {credentialId}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                      <Award className="h-5 w-5 text-primary" /> Certificate Preview (Watermarked & Protected)
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                      Preview Copy · Non-Transferable
                    </span>
                  </div>

                  {/* High-End Certificate Card with Anti-Screenshot Deterrent */}
                  <div 
                    onContextMenu={(e) => e.preventDefault()}
                    className="select-none relative p-8 sm:p-12 rounded-2xl border-4 border-primary/20 bg-card shadow-lg text-center overflow-hidden"
                  >
                    {/* Security Diagonal Watermark Overlays */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10 rotate-[-25deg] text-xs sm:text-lg font-black tracking-widest text-slate-900 dark:text-white uppercase select-none">
                      PREVIEW ONLY • ACTIVATION REQUIRED ON EDITORIAL360 • SCHOLARLY OPEN
                    </div>

                    {/* Background Seal Watermark */}
                    <div className="absolute -right-16 -bottom-16 opacity-5 pointer-events-none">
                      <Award className="h-80 w-80 text-primary" />
                    </div>

                    <div className="space-y-6 relative z-10">
                      <div className="flex items-center justify-center">
                        <img 
                          src="/logo-full-color.svg" 
                          alt="Scholarly Open" 
                          className="h-12 sm:h-14 w-auto object-contain dark:hidden"
                          onError={(e) => {
                            ;(e.currentTarget as HTMLImageElement).src = '/logo-full.svg'
                          }}
                        />
                        <img 
                          src="/logo-full.svg" 
                          alt="Scholarly Open" 
                          className="h-12 sm:h-14 w-auto object-contain hidden dark:block"
                        />
                      </div>

                      <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-3 py-1 rounded-full text-xs font-bold text-primary tracking-widest uppercase">
                        Scholarly Open Standards Board
                      </div>

                      <div>
                        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">
                          Certificate of Peer Review Qualification
                        </h2>
                        <p className="text-xs text-muted-foreground mt-1 tracking-wider uppercase font-mono">
                          Credential ID: {credentialId} • Issued: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </p>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        This certifies that
                      </p>

                      <h3 className="text-2xl sm:text-3xl font-bold text-primary font-serif">
                        {candidateName || "Dr. Candidate"}
                      </h3>

                      <p className="text-xs sm:text-sm text-foreground/80 max-w-xl mx-auto leading-relaxed">
                        has successfully completed the <strong>Reviewer Gateway Assessment</strong>, demonstrating verified competence in academic English phrasing, COPE research integrity guidelines, and methodological evaluation in <strong>{selectedDiscipline.replace("-", " ").toUpperCase()}</strong>.
                      </p>

                      <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                        <div className="text-left">
                          <span className="block font-semibold text-foreground">editorial360 Governance Framework</span>
                          <span className="block text-[11px]">COPE Guidelines & Plan S Compliant</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full text-xs">
                            <Clock className="h-3.5 w-3.5" /> Pending Institutional Vetting & JM Approval
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Next Step CTA Card */}
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-[#0b99ff]/10 to-primary/5 border border-[#0b99ff]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-sm text-[#0b99ff] dark:text-sky-400">Application Registered in editorial360 Registry</h4>
                      <p className="text-xs text-muted-foreground max-w-xl">
                        Your qualification dossier (CV, ORCID iD, and Institutional Affiliation) has been logged in the Journal Manager desk. Once our editorial office completes institutional vetting, you will receive an official notification to activate your referee desk.
                      </p>
                    </div>
                    <Button asChild size="sm" variant="outline" className="border-[#0b99ff]/40 text-[#0b99ff] hover:bg-[#0b99ff]/10 font-bold gap-1.5 shrink-0 px-4 py-2 rounded-xl cursor-pointer">
                      <Link href="/">
                        Return to Homepage <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )}

              {/* Review Question Explanations */}
              <div className="space-y-4 pt-6 border-t border-border">
                <h3 className="text-lg font-bold">Detailed Question Review & Explanations</h3>
                
                <div className="space-y-4">
                  {questions.map((q, idx) => {
                    const chosenOptId = userAnswers[q.id]
                    const chosenOpt = q.options.find(o => o.id === chosenOptId)
                    const correctOpt = q.options.find(o => o.isCorrect)
                    const isUserCorrect = chosenOpt?.isCorrect

                    return (
                      <Card key={q.id} className="border-border">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-semibold text-muted-foreground">
                              Question {idx + 1} ({q.category})
                            </span>
                            {isUserCorrect ? (
                              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded">
                                <Check className="h-3 w-3" /> Correct
                              </span>
                            ) : (
                              <span className="text-xs font-bold text-destructive flex items-center gap-1 bg-destructive/10 px-2 py-0.5 rounded">
                                <X className="h-3 w-3" /> Incorrect
                              </span>
                            )}
                          </div>
                          <CardTitle className="text-sm font-bold mt-1 leading-snug">
                            {q.question}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-xs">
                          <div className="p-2.5 rounded bg-muted/30 border border-border">
                            <span className="font-semibold block text-foreground mb-0.5">Your Answer:</span>
                            <span className={isUserCorrect ? "text-emerald-700 dark:text-emerald-300" : "text-destructive font-medium"}>
                              {chosenOpt?.text || "No answer selected"}
                            </span>
                          </div>

                          {!isUserCorrect && (
                            <div className="p-2.5 rounded bg-emerald-500/5 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                              <span className="font-semibold block mb-0.5">Correct Answer:</span>
                              <span>{correctOpt?.text}</span>
                            </div>
                          )}

                          <p className="text-muted-foreground pt-1 italic">
                            <strong>Rationale:</strong> {correctOpt?.explanation}
                          </p>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                <div className="flex justify-center pt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setStep("intro")
                      setUserAnswers({})
                    }} 
                    className="gap-2 text-xs"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Re-take Assessment
                  </Button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}
