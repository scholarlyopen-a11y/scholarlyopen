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
  ExternalLink
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
    scenario: "A manuscript has several grammatical awkward phrases in the discussion section, although the experimental data is sound.",
    question: "Which of the following comments represents professional, constructive peer-review phrasing?",
    options: [
      {
        id: "a",
        text: "The English is terrible and almost unreadable. The authors clearly need a native speaker to rewrite the entire text.",
        isCorrect: false,
        explanation: "Unprofessional and demoralizing. COPE guidelines strictly advise against disparaging personal remarks on language."
      },
      {
        id: "b",
        text: "While the experimental findings are promising, the manuscript would benefit from thorough language editing to enhance clarity, particularly in Section 4 where several complex sentences obscure the interpretation.",
        isCorrect: true,
        explanation: "Constructive, objective, and pinpoints the exact section needing refinement without hostile language."
      },
      {
        id: "c",
        text: "Rejected immediately due to non-standard phrasing in lines 120–145.",
        isCorrect: false,
        explanation: "Flawed language alone in early drafts should never be the sole basis for summary rejection if the scientific methodology is rigorous."
      },
      {
        id: "d",
        text: "I do not understand why the authors used passive voice. Rewrite it all in active voice or withdraw the paper.",
        isCorrect: false,
        explanation: "Prescriptive stylistic preference rather than academic assessment."
      }
    ]
  },
  {
    id: 2,
    category: "Academic English & Tone",
    scenario: "An author's conclusion states that their algorithm is '100% infallible and superior to every existing solution on Earth.'",
    question: "How should a certified referee professionally critique this overstatement in academic English?",
    options: [
      {
        id: "a",
        text: "The authors are making ridiculous and completely untrue claims that prove they are novices in this field.",
        isCorrect: false,
        explanation: "Ad hominem attacks violate COPE reviewer codes."
      },
      {
        id: "b",
        text: "The claims in the abstract regarding universal superiority appear overgeneralized. It is recommended to temper the conclusions and discuss the specific parameter boundaries and limitations observed in Table 2.",
        isCorrect: true,
        explanation: "Encourages scientific modesty, precise bounding, and references the empirical data directly."
      },
      {
        id: "c",
        text: "I disagree with the authors because my own algorithm performs better.",
        isCorrect: false,
        explanation: "Lacks objective scientific critique and centers the reviewer's ego."
      },
      {
        id: "d",
        text: "Delete lines 45–50 immediately.",
        isCorrect: false,
        explanation: "Arbitrary command without reasoning or academic justification."
      }
    ]
  },
  {
    id: 3,
    category: "Academic English & Tone",
    scenario: "You notice that the manuscript relies heavily on colloquial idioms (e.g., 'a rule of thumb', 'touch and go', 'gut feeling').",
    question: "What is the appropriate recommendation in formal scholarly discourse?",
    options: [
      {
        id: "a",
        text: "Suggest replacing informal idioms with standardized technical terminology and empirical thresholds to maintain archival precision.",
        isCorrect: true,
        explanation: "Accurate: international scientific discourse requires disambiguated, formal terminology."
      },
      {
        id: "b",
        text: "Ignore it completely because readers will understand the colloquialisms anyway.",
        isCorrect: false,
        explanation: "Idioms create severe translation and comprehension barriers for non-native global readers."
      },
      {
        id: "c",
        text: "Report the paper for research misconduct.",
        isCorrect: false,
        explanation: "Informal phrasing is an editorial style issue, not research misconduct."
      },
      {
        id: "d",
        text: "Demand the authors translate the entire paper into Latin.",
        isCorrect: false,
        explanation: "Irrelevant and nonsensical."
      }
    ]
  },

  // Category 2: COPE Ethics & Integrity
  {
    id: 4,
    category: "COPE Ethics & Integrity",
    scenario: "While reviewing a blinded manuscript, you recognize that the research directly competes with a grant proposal you are currently writing, and you personally know the lead author.",
    question: "According to the Committee on Publication Ethics (COPE), what is your mandatory obligation?",
    options: [
      {
        id: "a",
        text: "Proceed with the review quickly and give a harsh evaluation to delay their publication.",
        isCorrect: false,
        explanation: "Severe ethical violation (sabotage and breach of confidentiality)."
      },
      {
        id: "b",
        text: "Disclose the direct conflict of interest to the Handling Editor immediately and recuse yourself from reviewing.",
        isCorrect: true,
        explanation: "COPE mandates immediate disclosure and recusal when a competitive or personal conflict of interest compromises impartiality."
      },
      {
        id: "c",
        text: "Download the dataset for your own lab's research before declining the invitation.",
        isCorrect: false,
        explanation: "Blatant breach of reviewer confidentiality and intellectual property theft."
      },
      {
        id: "d",
        text: "Continue reviewing as long as you do not tell your department head.",
        isCorrect: false,
        explanation: "Conflicts must be declared formally to the editorial office, not concealed."
      }
    ]
  },
  {
    id: 5,
    category: "COPE Ethics & Integrity",
    scenario: "You notice that 4 paragraphs in the literature review match an existing published paper verbatim without quotation marks, though the source is listed in the bibliography.",
    question: "How should this suspected text overlap be handled by a reviewer?",
    options: [
      {
        id: "a",
        text: "Accuse the author publicly on LinkedIn of fraud and intellectual theft.",
        isCorrect: false,
        explanation: "Breaches confidentiality and due process."
      },
      {
        id: "b",
        text: "Flag the specific overlapping passages confidentially to the Handling Editor, cite the matching publication, and let the editorial office initiate similarity forensics.",
        isCorrect: true,
        explanation: "Reviewers must report potential plagiarism confidentially to the editor with evidence, allowing the journal to follow COPE flowcharts."
      },
      {
        id: "c",
        text: "Ignore it since the source is mentioned in the bibliography anyway.",
        isCorrect: false,
        explanation: "Verbatim copying without quotation marks or attribution is plagiarism regardless of bibliography entry."
      },
      {
        id: "d",
        text: "Secretly email the corresponding author directly to demand an explanation.",
        isCorrect: false,
        explanation: "Reviewers must never contact authors directly during double-blind or single-blind review."
      }
    ]
  },
  {
    id: 6,
    category: "COPE Ethics & Integrity",
    scenario: "You are reviewing a paper and realize that adding 3 citations to your own previously published papers would increase your personal h-index, even though they are only tangentially related.",
    question: "Under COPE guidelines regarding coercive citations, what is the ethical rule?",
    options: [
      {
        id: "a",
        text: "It is acceptable as long as you disguise your recommendation by suggesting 1 other paper.",
        isCorrect: false,
        explanation: "Coercive self-citation is an explicit breach of reviewer ethics."
      },
      {
        id: "b",
        text: "Reviewers must never suggest adding citations to their own work primarily to inflate citation metrics; any suggested citation must be demonstrably essential to the paper's scientific validity.",
        isCorrect: true,
        explanation: "COPE strictly prohibits reviewers from exploiting their position for citation gaming or personal metric manipulation."
      },
      {
        id: "c",
        text: "Publishers require reviewers to cite themselves at least twice per report.",
        isCorrect: false,
        explanation: "Completely false."
      },
      {
        id: "d",
        text: "It is allowed if the paper is submitted under an Open Access license.",
        isCorrect: false,
        explanation: "Licensing model has zero bearing on citation ethics."
      }
    ]
  },
  {
    id: 7,
    category: "COPE Ethics & Integrity",
    scenario: "A manuscript contains Western blot images where two different protein bands across separate experimental conditions appear identical under magnification, suggesting figure manipulation.",
    question: "What is the referee's proper course of action?",
    options: [
      {
        id: "a",
        text: "Note the specific figure panels, explain the image duplication concern in the Confidential Comments to the Editor, and request raw unprocessed blot scans.",
        isCorrect: true,
        explanation: "Protects integrity while providing actionable evidence confidentially to the handling editor."
      },
      {
        id: "b",
        text: "Assume it was an innocent clerical error and approve the manuscript.",
        isCorrect: false,
        explanation: "Neglects research integrity; image duplication is a primary indicator of data fabrication."
      },
      {
        id: "c",
        text: "Delete the figure and tell the author to publish without it.",
        isCorrect: false,
        explanation: "Reviewers cannot alter author submissions."
      },
      {
        id: "d",
        text: "Post the images on public forums before the editor has evaluated the case.",
        isCorrect: false,
        explanation: "Violates the confidentiality of unpublished peer review."
      }
    ]
  },

  // Category 3: Methodological Rigor & Reporting Quality
  {
    id: 8,
    category: "Methodological Rigor",
    scenario: "A clinical study tests a new treatment on 6 patients without a control group or power calculation, but claims 'statistically proven universal therapeutic efficacy.'",
    question: "Which methodological critique is most critical for the referee to raise?",
    options: [
      {
        id: "a",
        text: "The sample size (n=6) is critically underpowered to establish general efficacy, and the lack of a control or randomized cohort precludes causal inference. The claim must be downgraded to a preliminary pilot observation.",
        isCorrect: true,
        explanation: "Accurately identifies sample power deficiencies, absence of control, and unwarranted causal claims."
      },
      {
        id: "b",
        text: "The paper is too short; make it 20 pages longer.",
        isCorrect: false,
        explanation: "Page length is not a metric of scientific validity."
      },
      {
        id: "c",
        text: "Six patients is plenty for universal clinical claims in medicine.",
        isCorrect: false,
        explanation: "Scientifically invalid and dangerous."
      },
      {
        id: "d",
        text: "Recommend using pie charts instead of bar charts.",
        isCorrect: false,
        explanation: "Superficial formatting remark that ignores severe statistical flaws."
      }
    ]
  },
  {
    id: 9,
    category: "Methodological Rigor",
    scenario: "A machine learning manuscript reports a 99.8% classification accuracy, but fails to provide the train/test split methodology, code repository link, or baseline dataset description.",
    question: "How should a rigorous peer reviewer evaluate this submission?",
    options: [
      {
        id: "a",
        text: "Accept immediately because 99.8% is an outstanding metric.",
        isCorrect: false,
        explanation: "High metrics without verifiable reproducibility protocols are frequently the result of data leakage or overfitting."
      },
      {
        id: "b",
        text: "Request detailed cross-validation methodology, test set isolation protocols, and open code/dataset availability to verify reproducibility according to FAIR data principles.",
        isCorrect: true,
        explanation: "Essential for modern AI and data science peer review; prevents reproducibility crises."
      },
      {
        id: "c",
        text: "Ask the authors to run their model on a quantum computer.",
        isCorrect: false,
        explanation: "Irrelevant and non-actionable."
      },
      {
        id: "d",
        text: "Reject because 99.8% is too high to be real, without asking for clarification.",
        isCorrect: false,
        explanation: "Unjustified summary dismissal without giving the opportunity to substantiate experimental rigor."
      }
    ]
  },
  {
    id: 10,
    category: "Methodological Rigor",
    scenario: "An author reports p-values of p=0.049 across 15 separate hypothesis tests without applying any correction for multiple comparisons (e.g., Bonferroni or False Discovery Rate).",
    question: "What is the key scientific concern?",
    options: [
      {
        id: "a",
        text: "High risk of Type I error (false positives) due to p-hacking or multiplicity; authors must report adjusted p-values and effect sizes with 95% confidence intervals.",
        isCorrect: true,
        explanation: "Standard statistical best practice to prevent misleading claims resulting from multiple testing."
      },
      {
        id: "b",
        text: "Any p-value below 0.05 is mathematically guaranteed to be true regardless of how many tests are performed.",
        isCorrect: false,
        explanation: "Statistical fallacy."
      },
      {
        id: "c",
        text: "P-values are banned in all scientific journals.",
        isCorrect: false,
        explanation: "False; they require correct contextual reporting and multiplicity adjustments."
      },
      {
        id: "d",
        text: "Authors should change p=0.049 to p=0.001 to look more impressive.",
        isCorrect: false,
        explanation: "Encouraging data falsification."
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
  const [selectedDiscipline, setSelectedDiscipline] = useState("medicine")
  
  // Exam progress
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [credentialId, setCredentialId] = useState("")

  // Shuffle & pick 10 questions on start
  const startExam = (e: React.FormEvent) => {
    e.preventDefault()
    if (!candidateName.trim() || !candidateEmail.trim()) return

    // Deterministic shuffle of the bank
    const shuffled = [...QUESTION_BANK].sort(() => 0.5 - Math.random())
    setQuestions(shuffled)
    setCurrentIndex(0)
    setUserAnswers({})
    setTimeLeft(15 * 60)
    setIsTimerRunning(true)
    setStep("exam")
    
    // Generate simulated permanent credential ID
    const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase()
    setCredentialId(`SO-REV-${new Date().getFullYear()}-${randomHex}`)
  }

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

    // Persist passed credential to localStorage for editorial360 sync
    if (typeof window !== "undefined") {
      if (isPassed) {
        const record = {
          name: candidateName || "Dr. Marcus Vance",
          email: candidateEmail || "reviewer@scholarlyopen.org",
          discipline: selectedDiscipline,
          credentialId,
          percentage,
          passedAt: new Date().toISOString(),
          reviewsDone: 0
        }
        localStorage.setItem("scholarlyopen_passed_reviewer_gateway", JSON.stringify(record))
      }
    }

    // Server-side audit log for Admin tracking
    fetch("/api/editorial360/reviewer-tests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        candidateName: candidateName || "Dr. Candidate",
        candidateEmail: candidateEmail || "candidate@university.edu",
        discipline: selectedDiscipline,
        institution: candidateAffiliation || "Academic Institution",
        score: percentage,
        totalQuestions: questions.length,
        passed: isPassed,
        credentialId: isPassed ? credentialId : undefined,
        status: isPassed ? "Passed - Pending Account" : "Failed Threshold"
      })
    }).catch(err => console.error("Failed to log reviewer test:", err))
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
                  <CardTitle className="text-xl">Candidate Details</CardTitle>
                  <CardDescription className="text-xs">
                    Please provide the exact name and credentials you wish to appear on your verified digital Certificate of Qualification.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={startExam} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">Full Academic Name & Title</label>
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
                        <label className="text-xs font-semibold text-foreground">Academic Institutional Email</label>
                        <input
                          type="email"
                          required
                          value={candidateEmail}
                          onChange={(e) => setCandidateEmail(e.target.value)}
                          placeholder="m.vance@university.edu"
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">Institution / Affiliation</label>
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
                        <label className="text-xs font-semibold text-foreground">Primary Field of Expertise</label>
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

                    <div className="p-4 rounded-lg bg-muted/40 border border-border text-xs text-muted-foreground leading-relaxed">
                      By proceeding, you attest that you will complete this assessment independently without unauthorized proxy participation, adhering to COPE ethical tenets.
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button type="submit" size="lg" className="font-semibold text-sm gap-2 cursor-pointer">
                        Begin 15-Minute Assessment <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* STEP 2: ACTIVE TIMED EXAM */}
          {step === "exam" && currentQ && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Exam Header: Timer + Progress */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border shadow-xs">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                  <span className="hidden sm:inline-block text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {currentQ.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-sm font-bold bg-muted px-3 py-1.5 rounded-lg border border-border">
                  <Clock className={`h-4 w-4 ${timeLeft < 180 ? "text-destructive animate-pulse" : "text-primary"}`} />
                  <span className={timeLeft < 180 ? "text-destructive" : "text-foreground"}>
                    {formatTime(timeLeft)}
                  </span>
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
                  
                  {/* Account Creation Security Gate Callout */}
                  <div className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        <h4 className="font-bold text-sm text-amber-900 dark:text-amber-200">
                          Step 2 Required: Activate Account on Editorial360 to Unlock Official Certificate
                        </h4>
                      </div>
                      <p className="text-xs text-amber-800/80 dark:text-amber-300/80 max-w-2xl leading-relaxed">
                        To protect credential authenticity and prevent fraudulent use, official downloadable certificates and peer-review matching status are issued directly within your verified Editorial360 Reviewer Account.
                      </p>
                    </div>

                    <Button asChild className="bg-[#0b99ff] hover:bg-[#0088e0] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shrink-0 cursor-pointer">
                      <Link href={`/editorial360?action=claim_reviewer&name=${encodeURIComponent(candidateName || 'Reviewer')}&email=${encodeURIComponent(candidateEmail || '')}&cred=${credentialId}`}>
                        Create Account & Unlock Certificate &rarr;
                      </Link>
                    </Button>
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
                            <Clock className="h-3.5 w-3.5" /> Pending Account Activation
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Next Step CTA Card */}
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-[#0b99ff]/10 to-primary/5 border border-[#0b99ff]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-sm text-[#0b99ff] dark:text-sky-400">Ready to Review & Earn Merit Honoraria?</h4>
                      <p className="text-xs text-muted-foreground max-w-xl">
                        Register or sign in to your Editorial360 account to link your verified credential, unlock official high-res PDF certificate export, and access the €35–€50 honoraria wallet.
                      </p>
                    </div>
                    <Button asChild size="sm" className="bg-[#0b99ff] hover:bg-[#0088e0] text-white font-bold gap-1.5 shrink-0 px-4 py-2 rounded-xl shadow-sm">
                      <Link href={`/editorial360?action=claim_reviewer&name=${encodeURIComponent(candidateName || 'Reviewer')}&email=${encodeURIComponent(candidateEmail || '')}&cred=${credentialId}`}>
                        Proceed to Editorial360 <ArrowRight className="h-4 w-4" />
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
