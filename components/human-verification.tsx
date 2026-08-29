"use client"

import { useState, useEffect, useId } from "react"
import { ShieldCheck, CheckCircle2, RefreshCw, AlertCircle } from "lucide-react"

interface HumanVerificationProps {
  /** Optional callback triggered when verification status changes */
  onVerified?: (isVerified: boolean) => void
  /** Optional custom class names */
  className?: string
}

function generateSimpleMath() {
  const a = Math.floor(Math.random() * 8) + 2 // 2 to 9
  const b = Math.floor(Math.random() * 8) + 1 // 1 to 8
  return { a, b, answer: a + b }
}

export function HumanVerification({ onVerified, className = "" }: HumanVerificationProps) {
  const [challenge, setChallenge] = useState<{ a: number; b: number; answer: number } | null>(null)
  const [userAnswer, setUserAnswer] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [token, setToken] = useState<string>("")
  const [isOpen, setIsOpen] = useState(false)
  const inputId = useId()

  useEffect(() => {
    setChallenge(generateSimpleMath())
  }, [])

  const handleRefresh = () => {
    setChallenge(generateSimpleMath())
    setUserAnswer("")
    setErrorMsg(null)
  }

  const handleVerify = (e: React.MouseEvent | React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setErrorMsg(null)

    if (!challenge) return

    const parsed = parseInt(userAnswer.trim(), 10)
    if (isNaN(parsed)) {
      setErrorMsg("Please enter a number.")
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      if (parsed === challenge.answer) {
        setIsVerified(true)
        setIsOpen(false)
        setIsLoading(false)

        // Generate client verification token
        const payload = {
          t: Date.now(),
          c: `${challenge.a}+${challenge.b}`,
          v: "human_confirmed",
          s: Math.random().toString(36).substring(2, 10),
        }
        const b64Token = typeof window !== "undefined" ? btoa(JSON.stringify(payload)) : ""
        setToken(b64Token)
        onVerified?.(true)
      } else {
        setIsLoading(false)
        setErrorMsg("Incorrect answer. Please try again.")
        handleRefresh()
      }
    }, 400)
  }

  return (
    <div className={`rounded-xl border border-border/80 bg-muted/20 p-4 transition-all hover:border-primary/30 ${className}`}>
      {/* Hidden input field for form payload */}
      <input type="hidden" name="human_verification_token" value={token} />

      {!isVerified ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Anti-Spam Security Check</p>
                <p className="text-[11px] text-muted-foreground">Verify that you are a human researcher / visitor</p>
              </div>
            </div>

            {!isOpen && (
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center justify-center rounded-lg border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors cursor-pointer"
              >
                Verify
              </button>
            )}
          </div>

          {isOpen && challenge && (
            <div className="mt-3 rounded-lg border border-border bg-background p-3.5 space-y-3 animate-in fade-in-50 duration-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">
                  Security question: What is <strong className="text-primary font-bold text-sm">{challenge.a} + {challenge.b}</strong> ?
                </span>
                <button
                  type="button"
                  onClick={handleRefresh}
                  title="New question"
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id={inputId}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleVerify(e)
                    }
                  }}
                  placeholder="Enter answer"
                  className="w-28 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-primary"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={isLoading || !userAnswer.trim()}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {isLoading ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-1.5 text-[11px] text-destructive font-medium">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Human Verification Completed</p>
              <p className="text-[10px] text-muted-foreground">Scholarly Open Anti-Bot Security Protected</p>
            </div>
          </div>
          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
            Verified
          </span>
        </div>
      )}
    </div>
  )
}
