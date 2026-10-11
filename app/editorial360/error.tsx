"use client"

import { useEffect } from "react"
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function Editorial360Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("editorial360 runtime error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#121317] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white dark:bg-[#18191e] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl text-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Workspace Session Refresh
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            A temporary component state discrepancy occurred. You can restore your session or return to the main dashboard.
          </p>
          {error?.message && (
            <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-100 dark:border-slate-800 mt-2 truncate">
              {error.message}
            </p>
          )}
        </div>
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.reload()
              } else {
                reset()
              }
            }}
            className="flex-1 py-2 px-4 rounded-xl bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reload Workspace</span>
          </button>
          <Link
            href="/"
            className="py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18191e] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
