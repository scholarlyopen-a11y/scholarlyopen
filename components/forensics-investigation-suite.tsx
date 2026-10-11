"use client"

import React, { useState, useMemo } from "react"
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Sliders,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FlipHorizontal,
  Eye,
  Check,
  CheckCheck,
  Mail,
  Download,
  ExternalLink,
  Layers,
  Database,
  Code2,
  Cpu,
  UserX,
  Sparkles,
  Search,
  Split,
  FileCheck2,
  RefreshCw,
  X
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export interface ForensicsSuiteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  manuscript: {
    id: string
    title: string
    journal: string
    date?: string
    authorName?: string
    authorEmail?: string
    assignedEditorName?: string
    plagiarismScore?: number
    aiScore?: number
    integrityStatus?: string
  } | null
  onEscalateToRia?: (paperId: string, notes?: string) => void
  onQueryAuthor?: (paperId: string, letter?: string) => void
  onClearFlag?: (paperId: string) => void
  language?: "en" | "de"
}

export function ForensicsInvestigationSuite({
  open,
  onOpenChange,
  manuscript,
  onEscalateToRia,
  onQueryAuthor,
  onClearFlag,
  language = "en"
}: ForensicsSuiteProps) {
  const isDe = language === "de"
  const [activeTab, setActiveTab] = useState<"summary" | "figure_compare" | "text_compare" | "papermill" | "open_data">("summary")
  const [viewMode, setViewMode] = useState<"tabbed" | "all_sections">("tabbed")
  
  // Figure Comparator States
  const [figureZoom, setFigureZoom] = useState<number>(1)
  const [figureRotation, setFigureRotation] = useState<number>(0)
  const [isFlippedH, setIsFlippedH] = useState<boolean>(false)
  const [isInvertedContrast, setIsInvertedContrast] = useState<boolean>(false)
  const [overlayOpacity, setOverlayOpacity] = useState<number>(50)
  const [compareMode, setCompareMode] = useState<"side_by_side" | "overlay">("side_by_side")
  const [selectedPanel, setSelectedPanel] = useState<"figure2_blot" | "figure4_microscopy">("figure2_blot")
  
  // Action status message
  const [actionStatus, setActionStatus] = useState<string | null>(null)

  if (!manuscript) return null

  const plag = typeof manuscript.plagiarismScore === "number" ? manuscript.plagiarismScore : (manuscript.id === "SOMED-26-RW01" ? 3.4 : 12)
  const ai = typeof manuscript.aiScore === "number" ? manuscript.aiScore : (manuscript.id === "SOMED-26-RW01" ? 1.2 : 8)
  const isFlagged = Boolean(manuscript.integrityStatus === "Flagged" || (typeof manuscript.plagiarismScore === "number" && manuscript.plagiarismScore > 15) || (typeof manuscript.aiScore === "number" && manuscript.aiScore > 30))

  // Dynamically configure tabs:
  // For clean / non-flagged articles, Side-by-Side comparator is invalid and omitted to avoid crowding.
  const availableTabs = useMemo(() => {
    const list = [
      { id: "summary", label: isDe ? "Übersicht & Radar" : "Overview & Radar", icon: Layers },
      { id: "papermill", label: isDe ? "Papermill-Alarm" : "Papermill Alarm", icon: AlertTriangle },
      { id: "open_data", label: isDe ? "Open Data & FAIR" : "Open Data & FAIR Code", icon: Database },
    ]
    if (isFlagged) {
      list.splice(1, 0, 
        { id: "figure_compare", label: isDe ? "Bild-Prüfung" : "Figure Inspection", icon: Split },
        { id: "text_compare", label: isDe ? "Text-Abgleich" : "Text Match", icon: FileText }
      )
    }
    return list
  }, [isDe, isFlagged])

  // Demo figure forensic data based on manuscript ID
  const isMicroscopyIssue = manuscript.id.includes("BIO") || manuscript.id.includes("MED")
  const papermillRisk = plag > 30 ? 68 : 12 // percentage
  const fairDataScore = 84 // percentage

  const torturedPhrasesFound = [
    { original: "counterfeit consciousness", intended: "artificial intelligence", section: "Introduction §1.2" },
    { original: "colossal data architecture", intended: "big data architecture", section: "Methodology §2.1" },
    { original: "irregular medical condition", intended: "disease pathology", section: "Abstract" }
  ]

  const verifiedDataRepositories = [
    { name: "Zenodo Open Archive", doi: "10.5281/zenodo.10842910", type: "Raw Instrument CSV & FASTQ", status: "Verified Accessible" },
    { name: "GitHub Reproducibility Package", url: "https://github.com/scholarly-open-repro/pipeline-v2", type: "Jupyter Notebook & Dockerfile", status: "Executable Env Detected" }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[92vh] bg-white dark:bg-[#18191e] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-sans rounded-2xl p-6 flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <DialogHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center justify-between gap-3 pr-6">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl border ${
                isFlagged 
                  ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50" 
                  : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50"
              }`}>
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-2">
                  <span>{isDe ? "Forensisches Prüf-Dossier & Integritäts-Suite" : "Forensic Investigation & Integrity Dossier"}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isFlagged 
                      ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800" 
                      : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                  }`}>
                    {isFlagged ? "Audit Flagged" : "Screening Clean"}
                  </span>
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 mt-0.5">
                  {manuscript.journal} • {manuscript.id} • {manuscript.authorName || "Corresponding Author"}
                </DialogDescription>
              </div>
            </div>
            
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-[#0b99ff] bg-[#0b99ff]/10 px-2.5 py-1 rounded-md border border-[#0b99ff]/20">
                {manuscript.id}
              </span>
            </div>
          </div>
        </DialogHeader>

        {/* Action Status Notification Toast */}
        {actionStatus && (
          <div className="mt-2 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-blue-900 dark:text-blue-200 text-xs flex items-center gap-2 font-medium shrink-0 animate-in fade-in">
            <CheckCheck className="h-4 w-4 text-[#0b99ff] shrink-0" />
            <span>{actionStatus}</span>
          </div>
        )}

        {/* Tab & View Mode Switcher */}
        <div className="pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {availableTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = (activeTab === tab.id || (!isFlagged && (activeTab === "figure_compare" || activeTab === "text_compare") && tab.id === "summary")) && viewMode === "tabbed"
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id as any)
                    setViewMode("tabbed")
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#0b99ff] text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* View Mode Switcher: Tabbed vs All Sections */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("tabbed")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === "tabbed"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Layers className="h-3 w-3" />
              <span>Tabs</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("all_sections")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === "all_sections"
                  ? "bg-white dark:bg-slate-800 text-[#0b99ff] shadow-2xs font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <FileCheck2 className="h-3 w-3" />
              <span>All Sections (Full Report)</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto py-3 pr-1 space-y-4 text-xs [scrollbar-width:thin]">
          
          {/* ================= TAB 1 / SECTION 1: SUMMARY & RADAR ================= */}
          {(viewMode === "all_sections" || activeTab === "summary" || (!isFlagged && (activeTab === "figure_compare" || activeTab === "text_compare"))) && (
            <div className="space-y-4">
              {viewMode === "all_sections" && (
                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#0b99ff]">Section 1</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">• Overview &amp; 5-Segment Integrity Radar</span>
                </div>
              )}
              {/* Manuscript Quick Brief */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Title & Attribution</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{manuscript.title}</h4>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3 pt-0.5">
                  <span>Author: <strong className="text-slate-700 dark:text-slate-300">{manuscript.authorName || "Author"}</strong></span>
                  <span>•</span>
                  <span>Editor: <strong className="text-slate-700 dark:text-slate-300">{manuscript.assignedEditorName || "Handling Editor"}</strong></span>
                </div>
              </div>

              {/* 5-Segment Integrity Radar Scorecard */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {/* 1. Plagiarism */}
                <div className="p-3 rounded-xl bg-white dark:bg-[#15161b] border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">iThenticate / Text</span>
                  <div className={`text-xl font-black tabular-nums ${plag > 20 ? "text-red-500" : "text-slate-800 dark:text-slate-200"}`}>
                    {plag}%
                  </div>
                  <span className="text-[10px] text-slate-500 block leading-tight">{plag > 20 ? "Exceeds 20% limit" : "Within limits"}</span>
                </div>

                {/* 2. AI Content */}
                <div className="p-3 rounded-xl bg-white dark:bg-[#15161b] border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">AI Synthesis</span>
                  <div className={`text-xl font-black tabular-nums ${ai > 30 ? "text-amber-500" : "text-slate-800 dark:text-slate-200"}`}>
                    {ai}%
                  </div>
                  <span className="text-[10px] text-slate-500 block leading-tight">{ai > 30 ? "Stylometric variance" : "Human generated"}</span>
                </div>

                {/* 3. Figure Forensics */}
                <div className="p-3 rounded-xl bg-white dark:bg-[#15161b] border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Figure Audit</span>
                  <div className={`text-xl font-black ${isFlagged ? "text-amber-500" : "text-emerald-600 dark:text-emerald-400"}`}>
                    {isFlagged ? "Suspect" : "Clean"}
                  </div>
                  <span className="text-[10px] text-slate-500 block leading-tight">4 panels analyzed</span>
                </div>

                {/* 4. Papermill Risk */}
                <div className="p-3 rounded-xl bg-white dark:bg-[#15161b] border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Papermill Alarm</span>
                  <div className={`text-xl font-black tabular-nums ${papermillRisk > 40 ? "text-red-500" : "text-emerald-600 dark:text-emerald-400"}`}>
                    {papermillRisk}%
                  </div>
                  <span className="text-[10px] text-slate-500 block leading-tight">{papermillRisk > 40 ? "Elevated Risk" : "Low Risk"}</span>
                </div>

                {/* 5. FAIR Data */}
                <div className="p-3 rounded-xl bg-white dark:bg-[#15161b] border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">FAIR Data Index</span>
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {fairDataScore}%
                  </div>
                  <span className="text-[10px] text-slate-500 block leading-tight">Zenodo link verified</span>
                </div>
              </div>

              {/* Integrity Diagnosis Narrative */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-[#0b99ff]" />
                    <span>Algorithmic Pre-Flight Diagnostic Analysis</span>
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">COPE Core Practices Standard</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
                  Automated pre-flight screening verified the manuscript against Crossref, arXiv, Figshare, and the international retractions database. 
                  {plag > 20 
                    ? " Elevated text similarity detected against prior preprint deposit. Examine the side-by-side text comparator below."
                    : " All primary figures, raw datasets, and author network signatures comply with international publication standards."}
                </p>
              </div>
            </div>
          )}

          {/* ================= TAB 2: SIDE-BY-SIDE FIGURE COMPARATOR (FLAGGED ONLY) ================= */}
          {Boolean(isFlagged && (viewMode === "all_sections" || activeTab === "figure_compare")) && (
            <div className="space-y-4 pt-2">
              {viewMode === "all_sections" && (
                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-xs uppercase tracking-wider text-rose-500">Section 4A</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">• Target Figure Forensic Comparator</span>
                </div>
              )}
              {/* Comparator Controls Toolbar */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Target Panel:</span>
                  <select
                    value={selectedPanel}
                    onChange={(e) => setSelectedPanel(e.target.value as any)}
                    className="text-xs bg-white dark:bg-[#15161b] border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
                  >
                    <option value="figure2_blot">Figure 2B vs Figure 4D (Western Blot Strip Duplication)</option>
                    <option value="figure4_microscopy">Figure 3A vs Control Panel (Microscopy Tile Contrast Overlap)</option>
                  </select>
                </div>

                {/* Inspection Manipulation Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setFigureZoom(prev => Math.min(prev + 0.25, 2.5))}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#15161b] hover:bg-slate-100 text-slate-700 dark:text-slate-300"
                    title="Zoom In"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setFigureZoom(prev => Math.max(prev - 0.25, 0.75))}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#15161b] hover:bg-slate-100 text-slate-700 dark:text-slate-300"
                    title="Zoom Out"
                  >
                    <ZoomOut className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setFigureRotation(prev => (prev + 90) % 360)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#15161b] hover:bg-slate-100 text-slate-700 dark:text-slate-300"
                    title="Rotate 90°"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFlippedH(prev => !prev)}
                    className={`p-1.5 rounded-lg border text-slate-700 dark:text-slate-300 ${isFlippedH ? "bg-[#0b99ff]/10 border-[#0b99ff] text-[#0b99ff]" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-[#15161b]"}`}
                    title="Flip Horizontal"
                  >
                    <FlipHorizontal className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsInvertedContrast(prev => !prev)}
                    className={`px-2 py-1 text-[11px] font-semibold rounded-lg border ${isInvertedContrast ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-[#15161b] text-slate-700 dark:text-slate-300"}`}
                  >
                    Invert Contrast
                  </button>

                  <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1" />

                  {/* Mode Toggle */}
                  <div className="flex items-center p-0.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setCompareMode("side_by_side")}
                      className={`px-2 py-0.5 rounded-md font-semibold transition-all ${compareMode === "side_by_side" ? "bg-white dark:bg-[#15161b] text-slate-900 dark:text-white shadow-2xs" : "text-slate-500"}`}
                    >
                      Side-by-Side
                    </button>
                    <button
                      type="button"
                      onClick={() => setCompareMode("overlay")}
                      className={`px-2 py-0.5 rounded-md font-semibold transition-all ${compareMode === "overlay" ? "bg-white dark:bg-[#15161b] text-slate-900 dark:text-white shadow-2xs" : "text-slate-500"}`}
                    >
                      Overlay Diff
                    </button>
                  </div>
                </div>
              </div>

              {/* Side-by-Side Canvas View */}
              {compareMode === "side_by_side" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: Submitted Figure */}
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950 p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">Panel A: Submitted Figure 2B</span>
                      <span className="text-[10px] font-mono text-slate-400">Primary Manuscript File</span>
                    </div>
                    <div className="h-56 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center relative border border-slate-800">
                      {/* Simulated Forensic Gel Band Canvas */}
                      <div 
                        className="w-full h-full flex flex-col justify-center items-center gap-3 p-4 transition-transform duration-200"
                        style={{
                          transform: `scale(${figureZoom}) rotate(${figureRotation}deg) scaleX(${isFlippedH ? -1 : 1})`,
                          filter: isInvertedContrast ? "invert(1)" : "none"
                        }}
                      >
                        <div className="w-48 h-6 bg-slate-800 rounded flex items-center justify-around px-2 border border-slate-700">
                          <div className="w-6 h-3 bg-slate-400 rounded-xs blur-[0.5px]" />
                          <div className="w-8 h-3.5 bg-slate-200 rounded-xs blur-[0.5px]" />
                          <div className="w-6 h-3 bg-slate-400 rounded-xs blur-[0.5px]" />
                          <div className="w-10 h-4 bg-slate-100 rounded-xs shadow-xs" />
                        </div>
                        <div className="w-48 h-6 bg-slate-800 rounded flex items-center justify-around px-2 border border-slate-700">
                          <div className="w-5 h-2.5 bg-slate-500 rounded-xs" />
                          <div className="w-7 h-3 bg-slate-300 rounded-xs" />
                          <div className="w-5 h-2.5 bg-slate-500 rounded-xs" />
                          <div className="w-9 h-3.5 bg-slate-200 rounded-xs" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded">
                        Original Strip (p-AKT / GAPDH)
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex justify-between">
                      <span>Dimensions: 1420 × 420 px</span>
                      <span>EXIF: Stripped · sRGB</span>
                    </div>
                  </div>

                  {/* Right: Suspect Comparison Panel / Prior Literature */}
                  <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/20 dark:bg-amber-950/20 p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-700 dark:text-amber-400">Panel B: Figure 4D (Suspect Correlation)</span>
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded border border-amber-300">
                        94% Structural Match
                      </span>
                    </div>
                    <div className="h-56 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center relative border border-slate-800">
                      <div 
                        className="w-full h-full flex flex-col justify-center items-center gap-3 p-4 transition-transform duration-200"
                        style={{
                          transform: `scale(${figureZoom})`,
                          filter: isInvertedContrast ? "invert(1)" : "none"
                        }}
                      >
                        <div className="w-48 h-6 bg-slate-800 rounded flex items-center justify-around px-2 border border-amber-500/80 ring-1 ring-amber-500/50">
                          <div className="w-6 h-3 bg-slate-400 rounded-xs blur-[0.5px]" />
                          <div className="w-8 h-3.5 bg-slate-200 rounded-xs blur-[0.5px]" />
                          <div className="w-6 h-3 bg-slate-400 rounded-xs blur-[0.5px]" />
                          <div className="w-10 h-4 bg-slate-100 rounded-xs shadow-xs" />
                        </div>
                        <div className="w-48 h-6 bg-slate-800 rounded flex items-center justify-around px-2 border border-slate-700 opacity-60">
                          <div className="w-5 h-2.5 bg-slate-500 rounded-xs" />
                          <div className="w-7 h-3 bg-slate-300 rounded-xs" />
                          <div className="w-5 h-2.5 bg-slate-500 rounded-xs" />
                          <div className="w-9 h-3.5 bg-slate-200 rounded-xs" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 left-2 text-[10px] font-mono text-amber-400 bg-black/70 px-2 py-0.5 rounded border border-amber-500/40">
                        Duplicated Band Detected (180° Rotated)
                      </span>
                    </div>
                    <div className="text-[11px] text-amber-700 dark:text-amber-300 flex justify-between">
                      <span>Feature Map: SIFT Correlation &gt; 0.94</span>
                      <span>Confidence: High</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Overlay Diff Mode */
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Overlay Blending Opacity:</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={overlayOpacity}
                      onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                      className="flex-1 accent-[#0b99ff] cursor-pointer"
                    />
                    <span className="font-mono text-xs font-bold w-10 text-right">{overlayOpacity}%</span>
                  </div>

                  <div className="h-64 bg-slate-950 rounded-xl overflow-hidden relative border border-slate-800 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center opacity-80">
                      <div className="w-72 h-8 bg-slate-800 rounded flex items-center justify-around px-2 border border-cyan-500">
                        <div className="w-10 h-4 bg-cyan-400 rounded-xs blur-[0.5px]" />
                        <div className="w-12 h-5 bg-cyan-200 rounded-xs blur-[0.5px]" />
                        <div className="w-10 h-4 bg-cyan-400 rounded-xs blur-[0.5px]" />
                      </div>
                    </div>
                    <div 
                      className="absolute inset-0 flex items-center justify-center transition-opacity"
                      style={{ opacity: overlayOpacity / 100 }}
                    >
                      <div className="w-72 h-8 bg-slate-800 rounded flex items-center justify-around px-2 border border-red-500">
                        <div className="w-10 h-4 bg-red-400 rounded-xs blur-[0.5px]" />
                        <div className="w-12 h-5 bg-red-200 rounded-xs blur-[0.5px]" />
                        <div className="w-10 h-4 bg-red-400 rounded-xs blur-[0.5px]" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 text-[10px] font-mono text-slate-300 bg-black/80 px-2 py-0.5 rounded">
                      Cyan = Panel A · Red = Panel B · White = Identical Overlap
                    </span>
                  </div>
                </div>
              )}

              {/* Forensic Expert Recommendation */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
                <strong>Forensic Inspector Observation:</strong> Band topology in Lane 4 of Figure 2B correlates directly with Figure 4D with high pixel similarity. It is recommended to request uncropped, unedited raw blot autoradiographs from the author team prior to peer review.
              </div>
            </div>
          )}

          {/* ================= TAB 3: SIDE-BY-SIDE TEXT MATCH (FLAGGED ONLY) ================= */}
          {Boolean(isFlagged && (viewMode === "all_sections" || activeTab === "text_compare")) && (
            <div className="space-y-4 pt-2">
              {viewMode === "all_sections" && (
                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-xs uppercase tracking-wider text-rose-500">Section 4B</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">• Text Duplication &amp; Overlap Engine</span>
                </div>
              )}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Text Overlap Engine</span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Identified Source: SSRN Working Paper 2024 / arXiv:2409.11029</h4>
                </div>
                <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/60 px-2.5 py-1 rounded-md border border-red-200 dark:border-red-900">
                  {plag}% Verbatim Match
                </span>
              </div>

              {/* Split Side-by-Side Text Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Submitted Manuscript Passage */}
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15161b] space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">Submitted Manuscript (Section 2.1)</span>
                    <span className="text-[10px] text-slate-400 font-mono">Lines 142–168</span>
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2 bg-slate-50 dark:bg-[#121316] p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    <p>
                      In this empirical investigation, we employ high-dimensional panel regressions across international cohorts.
                      <mark className="bg-red-200 dark:bg-red-950/80 text-red-900 dark:text-red-200 px-1 rounded font-medium">
                        The structural estimators were calibrated against exogenous shock shocks across four regional economic zones, controlling for fixed capital variances and labor mobility indices.
                      </mark>
                      Subsequent diagnostic tests confirmed the validity of the instrumental variable identification strategy.
                    </p>
                  </div>
                </div>

                {/* Prior Published Source */}
                <div className="p-3.5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/20 dark:bg-red-950/20 space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-red-100 dark:border-red-900/40">
                    <span className="font-bold text-red-700 dark:text-red-400 text-xs">Preprint / External Deposit (2024)</span>
                    <span className="text-[10px] text-red-500 font-mono">SSRN-4819210 §3</span>
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2 bg-white dark:bg-[#121316] p-3 rounded-lg border border-red-200/80 dark:border-red-900/40">
                    <p>
                      Earlier studies neglected cross-border frictions. 
                      <mark className="bg-red-200 dark:bg-red-950/80 text-red-900 dark:text-red-200 px-1 rounded font-medium">
                        The structural estimators were calibrated against exogenous shock shocks across four regional economic zones, controlling for fixed capital variances and labor mobility indices.
                      </mark>
                      Our primary specification confirms that labor elasticity remains robust across models.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 4 / SECTION 2: PAPERMILL & AUTHOR NETWORK ================= */}
          {(viewMode === "all_sections" || activeTab === "papermill") && (
            <div className="space-y-4 pt-2">
              {viewMode === "all_sections" && (
                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#0b99ff]">Section 2</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">• Papermill Alarm &amp; Fabricated Network Detector</span>
                </div>
              )}
              {/* Papermill Risk Meter */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span className="font-bold text-slate-900 dark:text-white">Papermill Alarm & Fabricated Network Detector</span>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    papermillRisk > 40 
                      ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-300" 
                      : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300"
                  }`}>
                    {papermillRisk > 40 ? "Elevated Papermill Risk (68%)" : "Low Risk Profile (12%)"}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Screening algorithm scans for known papermill fingerprints: machine-translated tortured phrases, disposable domain registration clusters, citation cartels, and post-submission author additions.
                </p>
              </div>

              {/* Tortured Phrases Box */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15161b] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-[#0b99ff]" />
                    <span>Tortured Phrases & Synonym Spinning Scanner</span>
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">3 phrases detected</span>
                </div>

                <div className="space-y-2">
                  {torturedPhrasesFound.map((phrase, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono text-red-600 dark:text-red-400 font-bold">"{phrase.original}"</span>
                        <span className="text-slate-400 mx-1.5">→ Standard:</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">"{phrase.intended}"</span>
                      </div>
                      <span className="text-[10px] text-slate-400 bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {phrase.section}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Author Network & Disposable Email Check */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15161b] space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Author Email Domain</span>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Institutional / Verified ({manuscript.authorEmail || "Verified"})
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">Not listed on disposable or suspicious domain registries</span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15161b] space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Citation Cartel Check</span>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Normal Citation Distribution
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">Self-citation rate at 4.2% (Standard threshold: &lt;15%)</span>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 5 / SECTION 3: OPEN DATA & FAIR CODE ================= */}
          {(viewMode === "all_sections" || activeTab === "open_data") && (
            <div className="space-y-4 pt-2">
              {viewMode === "all_sections" && (
                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#0b99ff]">Section 3</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">• FAIR Data &amp; Reproducible Code Audit</span>
                </div>
              )}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-bold text-slate-900 dark:text-white">FAIR Data & Reproducible Code Audit</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                    FAIR Score: {fairDataScore}% (Pass)
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Automated verification detects Data Availability Statements (DAS), validates public repository DOIs (Zenodo, Dryad, Figshare, OSF), and verifies computational code packages.
                </p>
              </div>

              {/* Detected Repositories List */}
              <div className="space-y-2.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Verified Open Access Deposits</span>
                <div className="space-y-2">
                  {verifiedDataRepositories.map((repo, i) => (
                    <div key={i} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15161b] flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">{repo.name}</span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {repo.doi ? `DOI: ${repo.doi}` : repo.url}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500">{repo.type}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900 flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        {repo.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Computational Reproducibility Badge */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <Code2 className="h-5 w-5 text-[#0b99ff]" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Dockerfile & Environment Manifest Present</span>
                    <span className="text-[11px] text-slate-500">Dependencies pinned via requirements.txt with Python 3.11 container specs.</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#0b99ff]">Reproducible ✓</span>
              </div>
            </div>
          )}

          {/* ================= ALL SECTIONS VERIFICATION BADGE (FOR CLEAN ARTICLES) ================= */}
          {viewMode === "all_sections" && !isFlagged && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between gap-3 pt-3">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold text-xs text-emerald-900 dark:text-emerald-200">
                    {isDe ? "Integritätsprüfung zertifiziert: Alle Abschnitte mängelfrei" : "Research Integrity Certified Clean: All Sections Passed"}
                  </div>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    {isDe ? "COPE Core Practices Standard erfüllt. Keine Beanstandungen bei Figuren, Daten oder Autorenschaft." : "COPE Core Practices standards fulfilled. Zero figure duplications, verified raw datasets, and authentic author network."}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900 px-2.5 py-1 rounded-md border border-emerald-300 dark:border-emerald-800 shrink-0">
                100% Compliant ✓
              </span>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <DialogFooter className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between sm:justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                if (onEscalateToRia) onEscalateToRia(manuscript.id)
                setActionStatus(`✓ Case ${manuscript.id} escalated to Research Integrity Advisor (RIA).`)
              }}
              className="h-8 text-xs font-bold bg-[#0b99ff] hover:bg-[#0088e0] text-white rounded-xl px-3 cursor-pointer shadow-xs"
            >
              <ShieldAlert className="h-3.5 w-3.5 mr-1" />
              Escalate to RIA
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (onQueryAuthor) onQueryAuthor(manuscript.id)
                setActionStatus(`✓ Formal forensic query dispatched to ${manuscript.authorName || "Author"}.`)
              }}
              className="h-8 text-xs font-semibold bg-white dark:bg-[#18191e] border border-slate-200 dark:border-slate-800 rounded-xl px-3 cursor-pointer text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Mail className="h-3.5 w-3.5 mr-1 text-[#0b99ff]" />
              Query Author
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (onClearFlag) onClearFlag(manuscript.id)
                setActionStatus(`✓ Integrity audit cleared for ${manuscript.id}. Certified clean.`)
              }}
              className="h-8 text-xs font-semibold bg-white dark:bg-[#18191e] border border-slate-200 dark:border-slate-800 rounded-xl px-3 cursor-pointer text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
            >
              <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" />
              Clear Flag (Certified)
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs font-semibold h-8 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18191e] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            Close
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}
