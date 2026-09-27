"use client"

import { useEffect } from "react"
import { Compass, ExternalLink } from "lucide-react"

export default function ScholarScoutRedirectPage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.replace("/editorial360?tab=scout")
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#131418] flex items-center justify-center p-6 text-center font-sans">
      <div className="max-w-md w-full bg-white dark:bg-[#18191e] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm space-y-5">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#0b99ff]/10 text-[#0b99ff] flex items-center justify-center border border-[#0b99ff]/20">
          <Compass className="w-7 h-7 animate-spin duration-1000" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Opening Scholar Scout...
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Connecting to the precision scholarly talent discovery and outreach suite on editorial360.
          </p>
        </div>
        <div>
          <a
            href="/editorial360?tab=scout"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Launch Scholar Scout</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}
