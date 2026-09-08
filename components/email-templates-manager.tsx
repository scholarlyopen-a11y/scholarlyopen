"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import {
  Mail,
  Search,
  Check,
  RotateCcw,
  Eye,
  Edit3,
  Send,
  Sparkles,
  Info,
  Copy,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Layers,
  FileText,
  AlertCircle,
  CheckCircle2,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  DEFAULT_EMAIL_TEMPLATES, 
  EmailTemplateDefinition, 
  COMMON_PLACEHOLDERS, 
  interpolateTokens, 
  generateBrandedEmailHtml 
} from "@/lib/email-templates"

interface EmailTemplatesManagerProps {
  language: "en" | "de"
  currentUserEmail?: string
}

export function EmailTemplatesManager({ language, currentUserEmail = "scholarlyopen@gmail.com" }: EmailTemplatesManagerProps) {
  const isDe = language === "de"

  // Storage key
  const STORAGE_KEY = "editorial360_custom_email_templates_v1"

  // Load custom templates from localStorage with fallback to defaults
  const [templates, setTemplates] = useState<EmailTemplateDefinition[]>(DEFAULT_EMAIL_TEMPLATES)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("invitation")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<"edit" | "preview" | "tokens">("edit")

  // Form states for the selected template
  const [editingSubject, setEditingSubject] = useState("")
  const [editingBody, setEditingBody] = useState("")
  const [editingActionLabel, setEditingActionLabel] = useState("")
  const [isSaved, setIsSaved] = useState(false)
  const [customizedIds, setCustomizedIds] = useState<Set<string>>(new Set())

  // Test Email Modal State
  const [isTestModalOpen, setIsTestModalOpen] = useState(false)
  const [testRecipient, setTestRecipient] = useState(currentUserEmail)
  const [isSendingTest, setIsSendingTest] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  const bodyTextareaRef = useRef<HTMLTextAreaElement>(null)

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with default definitions to preserve structure
          const merged = DEFAULT_EMAIL_TEMPLATES.map(def => {
            const found = parsed.find((p: any) => p.id === def.id)
            if (found) {
              return {
                ...def,
                defaultSubject: found.defaultSubject || def.defaultSubject,
                defaultBody: found.defaultBody || def.defaultBody,
                actionLabel: found.actionLabel !== undefined ? found.actionLabel : def.actionLabel
              }
            }
            return def
          })
          setTemplates(merged)

          // Track which ones have been customized
          const customSet = new Set<string>()
          parsed.forEach((p: any) => {
            const def = DEFAULT_EMAIL_TEMPLATES.find(d => d.id === p.id)
            if (def && (def.defaultSubject !== p.defaultSubject || def.defaultBody !== p.defaultBody)) {
              customSet.add(p.id)
            }
          })
          setCustomizedIds(customSet)
        }
      }
    } catch (e) {
      console.warn("Failed to parse custom templates from localStorage:", e)
    }
  }, [])

  // Active template lookup
  const activeTemplate = useMemo(() => {
    return templates.find(t => t.id === selectedTemplateId) || templates[0]
  }, [templates, selectedTemplateId])

  // Sync form inputs when active template changes
  useEffect(() => {
    if (activeTemplate) {
      setEditingSubject(activeTemplate.defaultSubject)
      setEditingBody(activeTemplate.defaultBody)
      setEditingActionLabel(activeTemplate.actionLabel || "")
      setIsSaved(false)
    }
  }, [activeTemplate.id])

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.defaultSubject.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCat = selectedCategory === "all" || t.category === selectedCategory
      return matchesSearch && matchesCat
    })
  }, [templates, searchQuery, selectedCategory])

  // Insert token at cursor in the body textarea
  const handleInsertToken = (tokenKey: string) => {
    const textarea = bodyTextareaRef.current
    const tokenStr = `{{${tokenKey}}}`
    if (!textarea) {
      setEditingBody(prev => prev + " " + tokenStr)
      return
    }

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const current = editingBody
    const updated = current.substring(0, start) + tokenStr + current.substring(end)
    setEditingBody(updated)

    // Restore cursor position after inserted token
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + tokenStr.length, start + tokenStr.length)
    }, 0)
  }

  // Save current template changes
  const handleSaveTemplate = () => {
    const updated = templates.map(t => {
      if (t.id === activeTemplate.id) {
        return {
          ...t,
          defaultSubject: editingSubject,
          defaultBody: editingBody,
          actionLabel: editingActionLabel
        }
      }
      return t
    })

    setTemplates(updated)
    setCustomizedIds(prev => new Set(prev).add(activeTemplate.id))
    setIsSaved(true)

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (e) {
      console.error("Failed to save template to localStorage:", e)
    }

    setTimeout(() => setIsSaved(false), 3000)
  }

  // Reset current template to factory default
  const handleResetCurrentTemplate = () => {
    const factoryDef = DEFAULT_EMAIL_TEMPLATES.find(t => t.id === activeTemplate.id)
    if (!factoryDef) return

    setEditingSubject(factoryDef.defaultSubject)
    setEditingBody(factoryDef.defaultBody)
    setEditingActionLabel(factoryDef.actionLabel || "")

    const updated = templates.map(t => t.id === activeTemplate.id ? factoryDef : t)
    setTemplates(updated)

    setCustomizedIds(prev => {
      const next = new Set(prev)
      next.delete(activeTemplate.id)
      return next
    })

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (e) {}

    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  // Reset ALL templates to factory defaults
  const handleResetAllTemplates = () => {
    if (confirm(isDe ? "Alle Vorlagen auf Werkseinstellungen zurücksetzen?" : "Reset all email templates to original system defaults?")) {
      setTemplates(DEFAULT_EMAIL_TEMPLATES)
      setCustomizedIds(new Set())
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch (e) {}
      const cur = DEFAULT_EMAIL_TEMPLATES.find(t => t.id === activeTemplate.id) || DEFAULT_EMAIL_TEMPLATES[0]
      setEditingSubject(cur.defaultSubject)
      setEditingBody(cur.defaultBody)
      setEditingActionLabel(cur.actionLabel || "")
    }
  }

  // Sample data for live preview
  const sampleTokens: Record<string, string> = {
    recipientName: "Dr. Evelyn Vane",
    paperId: "SOEAS-26-RS102",
    paperTitle: "Deep Generative Modeling for Single-Cell Transcriptomics Analysis",
    journal: "Scholarly Open: Medicine & Applied Sciences",
    portalUrl: "https://www.scholarlyopen.org/editorial360",
    acceptUrl: "https://www.scholarlyopen.org/editorial360?action=accept&id=SOEAS-26-RS102",
    declineUrl: "https://www.scholarlyopen.org/editorial360?action=decline&id=SOEAS-26-RS102",
    editorName: "Prof. Aris Thorne",
    customMessage: "Please verify that the sample cohort statistics match Table 3 and upload the updated supplementary files.",
    dueDate: "within 14 calendar days"
  }

  // Generate live preview HTML
  const renderedPreviewHtml = useMemo(() => {
    const previewSubject = interpolateTokens(editingSubject, sampleTokens)
    const previewBody = interpolateTokens(editingBody, sampleTokens)
    const rawActionUrl = activeTemplate.actionUrlPlaceholder ? interpolateTokens(activeTemplate.actionUrlPlaceholder, sampleTokens) : "https://www.scholarlyopen.org/editorial360"

    return generateBrandedEmailHtml({
      subject: previewSubject,
      bodyText: previewBody,
      actionLabel: editingActionLabel || undefined,
      actionUrl: rawActionUrl,
      journal: sampleTokens.journal,
      paperId: sampleTokens.paperId,
      paperTitle: sampleTokens.paperTitle,
      recipientName: sampleTokens.recipientName
    })
  }, [editingSubject, editingBody, editingActionLabel, activeTemplate])

  // Handle Send Test Email
  const handleSendTestEmail = async () => {
    if (!testRecipient) return
    setIsSendingTest(true)
    setTestResult(null)

    try {
      const previewSubject = interpolateTokens(editingSubject, sampleTokens)
      const previewBody = interpolateTokens(editingBody, sampleTokens)
      const rawActionUrl = activeTemplate.actionUrlPlaceholder ? interpolateTokens(activeTemplate.actionUrlPlaceholder, sampleTokens) : "https://www.scholarlyopen.org/editorial360"

      const res = await fetch("/api/editorial360/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: testRecipient,
          customSubject: `[TEST EMAIL] ${previewSubject}`,
          customBody: previewBody,
          actionLabel: editingActionLabel || undefined,
          actionUrl: rawActionUrl,
          paperId: sampleTokens.paperId,
          paperTitle: sampleTokens.paperTitle,
          recipientName: sampleTokens.recipientName,
          journal: sampleTokens.journal
        })
      })

      const data = await res.json()
      if (data.success) {
        setTestResult({
          success: true,
          message: data.sentViaSmtp 
            ? `✓ Real test email dispatched successfully via cPanel SMTP to ${testRecipient} (Message-ID: ${data.messageId || 'OK'})!`
            : `✓ Test email processed (SMTP not configured in current environment, simulated successfully for ${testRecipient}).`
        })
      } else {
        setTestResult({
          success: false,
          message: `Error sending test: ${data.error || "Unknown error"}`
        })
      }
    } catch (e: any) {
      setTestResult({
        success: false,
        message: `Network error sending test: ${e.message}`
      })
    } finally {
      setIsSendingTest(false)
    }
  }

  const categoryLabels: Record<string, { en: string; de: string }> = {
    all: { en: "All Templates", de: "Alle Vorlagen" },
    reviewers: { en: "Reviewer Communications", de: "Gutachter-Kommunikation" },
    authors: { en: "Author Communications", de: "Autoren-Kommunikation" },
    decisions: { en: "Editorial Decisions", de: "Redaktionelle Entscheidungen" },
    production: { en: "Production & DOIs", de: "Produktion & DOIs" }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-[#0b99ff] to-[#0077cc] text-white flex items-center justify-center font-bold shadow-sm shrink-0">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                {isDe ? "E-Mail-Vorlagen-Studio" : "Email Templates Studio"}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0b99ff]/10 text-[#0b99ff] border border-[#0b99ff]/20 uppercase">
                {isDe ? "Live Anpassbar" : "Live Customizable"}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isDe 
                ? "Überprüfen, bearbeiten und testen Sie alle automatisierten und manuellen E-Mail-Vorlagen in Editorial360."
                : "View, customize, and test all automated and manual email templates dispatched across the editorial lifecycle."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetAllTemplates}
            className="text-xs text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#272832] hover:bg-slate-100 dark:hover:bg-[#20222a]"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            {isDe ? "Alle zurücksetzen" : "Reset All Defaults"}
          </Button>

          <Button
            size="sm"
            onClick={() => {
              setTestResult(null)
              setIsTestModalOpen(true)
            }}
            className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-semibold shadow-xs"
          >
            <Send className="h-3.5 w-3.5 mr-1.5" />
            {isDe ? "Test-E-Mail senden" : "Send Test Email"}
          </Button>
        </div>
      </div>

      {/* Main Grid: Left Template Selector, Right Customization Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sidebar: Filter & Template List */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border-slate-200/90 dark:border-[#272832] bg-white dark:bg-[#18191e] shadow-xs">
            <CardHeader className="p-4 pb-3 border-b border-slate-100 dark:border-[#272832]">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isDe ? "Vorlage suchen..." : "Search templates..."}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-[#20222a] border border-slate-200 dark:border-[#272832] rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {Object.keys(categoryLabels).map((catKey) => {
                  const isActive = selectedCategory === catKey
                  return (
                    <button
                      key={catKey}
                      onClick={() => setSelectedCategory(catKey)}
                      className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                        isActive
                          ? "bg-[#0b99ff] text-white font-semibold shadow-2xs"
                          : "bg-slate-100 dark:bg-[#20222a] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {isDe ? categoryLabels[catKey].de : categoryLabels[catKey].en}
                    </button>
                  )
                })}
              </div>
            </CardHeader>

            {/* Template Items */}
            <CardContent className="p-2 space-y-1 max-h-[600px] overflow-y-auto">
              {filteredTemplates.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  {isDe ? "Keine Vorlagen gefunden." : "No templates match your search."}
                </div>
              ) : (
                filteredTemplates.map((tpl) => {
                  const isSelected = tpl.id === selectedTemplateId
                  const isCustomized = customizedIds.has(tpl.id)

                  return (
                    <button
                      key={tpl.id}
                      onClick={() => setSelectedTemplateId(tpl.id)}
                      className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-sky-50/80 dark:bg-sky-950/30 border-[#0b99ff]/50 shadow-2xs"
                          : "bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-[#20222a]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold text-xs text-slate-900 dark:text-white line-clamp-1">
                          {tpl.name}
                        </div>
                        {isCustomized ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 shrink-0">
                            {isDe ? "Angepasst" : "Custom"}
                          </span>
                        ) : (
                          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#20222a] text-slate-500 dark:text-slate-400 shrink-0">
                            {isDe ? "Standard" : "Preset"}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {tpl.description}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] text-[#0b99ff] font-medium uppercase tracking-wider">
                          {tpl.category}
                        </span>
                        <span className="text-[10px] text-slate-400">•</span>
                        <span className="text-[10px] text-slate-400 font-mono truncate">
                          {tpl.id}
                        </span>
                      </div>
                    </button>
                  )
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Pane: Editor & Live Preview */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="border-slate-200/90 dark:border-[#272832] bg-white dark:bg-[#18191e] shadow-xs">
            
            {/* Top Bar of Active Template */}
            <CardHeader className="p-5 pb-4 border-b border-slate-100 dark:border-[#272832]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {activeTemplate.name}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-[#20222a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#272832]">
                      ID: {activeTemplate.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {activeTemplate.description}
                  </p>
                </div>

                {/* Sub-Tabs: Edit vs Preview vs Tokens */}
                <div className="flex items-center bg-slate-100 dark:bg-[#20222a] p-1 rounded-xl shrink-0">
                  <button
                    onClick={() => setActiveTab("edit")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      activeTab === "edit"
                        ? "bg-white dark:bg-[#18191e] text-[#0b99ff] shadow-2xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>{isDe ? "Vorlage anpassen" : "Customize"}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("preview")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      activeTab === "preview"
                        ? "bg-white dark:bg-[#18191e] text-[#0b99ff] shadow-2xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>{isDe ? "Live-Vorschau" : "Live Preview"}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("tokens")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      activeTab === "tokens"
                        ? "bg-white dark:bg-[#18191e] text-[#0b99ff] shadow-2xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{isDe ? "Platzhalter (Tokens)" : "Dynamic Tokens"}</span>
                  </button>
                </div>
              </div>
            </CardHeader>

            {/* TAB 1: EDIT TEMPLATE */}
            {activeTab === "edit" && (
              <CardContent className="p-6 space-y-5">
                {/* Subject Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isDe ? "E-Mail-Betreffzeile" : "Email Subject Line"}
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {editingSubject.length} {isDe ? "Zeichen" : "chars"}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={editingSubject}
                    onChange={(e) => setEditingSubject(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-[#20222a] border border-slate-200 dark:border-[#272832] rounded-lg text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                  />
                </div>

                {/* Dynamic Token Quick Injector Chips */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3 text-[#0b99ff]" />
                      {isDe ? "Klicken, um Token in Text einzufügen:" : "Click to insert placeholder token:"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("tokens")}
                      className="text-[11px] text-[#0b99ff] hover:underline"
                    >
                      {isDe ? "Alle Tokens anzeigen →" : "View all tokens →"}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-slate-50 dark:bg-[#20222a] border border-slate-200/80 dark:border-[#272832]">
                    {activeTemplate.placeholders.slice(0, 7).map((p) => (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => handleInsertToken(p.key)}
                        title={p.description}
                        className="text-[11px] font-mono px-2 py-1 rounded-md bg-white dark:bg-[#18191e] border border-slate-200 dark:border-[#272832] text-[#0b99ff] hover:bg-[#0b99ff] hover:text-white transition-all cursor-pointer shadow-2xs"
                      >
                        + &#123;&#123;{p.key}&#125;&#125;
                      </button>
                    ))}
                  </div>
                </div>

                {/* Body Textarea */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isDe ? "E-Mail-Haupttext (Absätze werden formatiert)" : "Email Body Content (Formatted into paragraphs)"}
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {editingBody.split(/\s+/).filter(Boolean).length} {isDe ? "Wörter" : "words"}
                    </span>
                  </div>
                  <textarea
                    ref={bodyTextareaRef}
                    rows={12}
                    value={editingBody}
                    onChange={(e) => setEditingBody(e.target.value)}
                    className="w-full p-3.5 text-xs font-sans leading-relaxed bg-slate-50 dark:bg-[#20222a] border border-slate-200 dark:border-[#272832] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b99ff] font-mono"
                  />
                </div>

                {/* Action Button Label */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isDe ? "Aktions-Schaltflächentext" : "Action Button Label"}
                    </label>
                    <input
                      type="text"
                      value={editingActionLabel}
                      onChange={(e) => setEditingActionLabel(e.target.value)}
                      placeholder="e.g., Access Editorial360 Portal"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#20222a] border border-slate-200 dark:border-[#272832] rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isDe ? "Aktions-URL-Ziel" : "Action URL Target"}
                    </label>
                    <input
                      type="text"
                      disabled
                      value={activeTemplate.actionUrlPlaceholder || "https://www.scholarlyopen.org/editorial360"}
                      className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-[#1c1d22] border border-slate-200 dark:border-[#272832] rounded-lg text-slate-500 dark:text-slate-400 font-mono"
                    />
                  </div>
                </div>
              </CardContent>
            )}

            {/* TAB 2: LIVE PREVIEW */}
            {activeTab === "preview" && (
              <CardContent className="p-6">
                <div className="border border-slate-200 dark:border-[#272832] rounded-2xl overflow-hidden shadow-xs bg-slate-50 dark:bg-[#121316]">
                  {/* Mock Email Client Toolbar */}
                  <div className="bg-slate-100 dark:bg-[#1c1d22] px-4 py-3 border-b border-slate-200 dark:border-[#272832] space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">From: </span>
                        <span>{sampleTokens.journal} &lt;editorial@scholarlyopen.org&gt;</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Preview Mode (Sample Data)</span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      <span className="font-bold text-slate-900 dark:text-white">To: </span>
                      <span>{sampleTokens.recipientName} &lt;e.vane@university.edu&gt;</span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      <span className="font-bold text-slate-900 dark:text-white">CC: </span>
                      <span className="font-mono text-[11px]">scholarlyopen@gmail.com</span>
                    </div>

                    <div className="text-xs font-semibold text-slate-900 dark:text-white pt-1">
                      <span className="font-bold text-slate-500">Subject: </span>
                      <span>{interpolateTokens(editingSubject, sampleTokens)}</span>
                    </div>
                  </div>

                  {/* Rendered HTML inside an iframe sandbox */}
                  <div className="p-4 bg-slate-200/50 dark:bg-black/40 flex justify-center">
                    <iframe
                      srcDoc={renderedPreviewHtml}
                      title="Email Preview"
                      className="w-full max-w-[640px] h-[580px] bg-white rounded-xl shadow-md border-0"
                    />
                  </div>
                </div>
              </CardContent>
            )}

            {/* TAB 3: TOKENS REFERENCE */}
            {activeTab === "tokens" && (
              <CardContent className="p-6 space-y-4">
                <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/40 text-xs text-sky-800 dark:text-sky-300 flex items-start gap-2.5">
                  <Info className="h-4 w-4 shrink-0 mt-0.5 text-[#0b99ff]" />
                  <div>
                    <span className="font-bold">{isDe ? "Dynamische Platzhalter" : "Dynamic Placeholders"}</span>:
                    {" "}{isDe 
                      ? "Tokens werden beim tatsächlichen E-Mail-Versand automatisch mit den echten Daten des jeweiligen Artikels und Empfängers ersetzt."
                      : "Tokens enclosed in double braces (e.g., {{paperId}}) are dynamically populated at dispatch time with authentic manuscript, author, and reviewer data."}
                  </div>
                </div>

                <div className="border border-slate-200 dark:border-[#272832] rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 dark:bg-[#20222a] border-b border-slate-200 dark:border-[#272832]">
                      <tr>
                        <th className="p-3 font-bold text-slate-700 dark:text-slate-300">{isDe ? "Platzhalter" : "Placeholder Token"}</th>
                        <th className="p-3 font-bold text-slate-700 dark:text-slate-300">{isDe ? "Bezeichnung" : "Name & Purpose"}</th>
                        <th className="p-3 font-bold text-slate-700 dark:text-slate-300">{isDe ? "Beispielwert" : "Sample Output"}</th>
                        <th className="p-3 text-right font-bold text-slate-700 dark:text-slate-300">{isDe ? "Aktion" : "Action"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#272832]">
                      {activeTemplate.placeholders.map((p) => (
                        <tr key={p.key} className="hover:bg-slate-50 dark:hover:bg-[#20222a]/50">
                          <td className="p-3 font-mono text-[#0b99ff] font-semibold">
                            &#123;&#123;{p.key}&#125;&#125;
                          </td>
                          <td className="p-3 text-slate-700 dark:text-slate-300">
                            <div className="font-medium">{p.label}</div>
                            <div className="text-[11px] text-slate-400">{p.description}</div>
                          </td>
                          <td className="p-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                            {p.example}
                          </td>
                          <td className="p-3 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                handleInsertToken(p.key)
                                setActiveTab("edit")
                              }}
                              className="text-[11px] text-[#0b99ff] hover:bg-sky-50 dark:hover:bg-sky-950/40 h-7"
                            >
                              + {isDe ? "Einfügen" : "Insert"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            )}

            {/* Bottom Action Footer */}
            <CardFooter className="p-5 border-t border-slate-100 dark:border-[#272832] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-[#141518]">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetCurrentTemplate}
                  className="text-xs text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#272832] hover:bg-slate-100 dark:hover:bg-[#20222a]"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                  {isDe ? "Diese Vorlage zurücksetzen" : "Reset This Template"}
                </Button>
              </div>

              <div className="flex items-center gap-3">
                {isSaved && (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold animate-in fade-in">
                    <CheckCircle2 className="h-4 w-4" />
                    {isDe ? "Änderungen gespeichert!" : "Customizations saved!"}
                  </span>
                )}

                <Button
                  size="sm"
                  onClick={handleSaveTemplate}
                  className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-semibold px-5 shadow-xs"
                >
                  <Check className="h-4 w-4 mr-1.5" />
                  {isDe ? "Änderungen speichern" : "Save Changes"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Send Real Test Email Modal */}
      <Dialog open={isTestModalOpen} onOpenChange={setIsTestModalOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-[#18191e] border-slate-200 dark:border-[#272832]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Send className="h-4 w-4 text-[#0b99ff]" />
              {isDe ? "Echte Test-E-Mail senden" : "Send Live Test Email"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              {isDe 
                ? "Senden Sie eine formatierte Test-E-Mail an ein beliebiges Postfach, um die Zustellung über Ihren cPanel-SMTP-Server zu testen."
                : "Dispatch a real test email with this template to verify inbox delivery, formatting, and responsiveness through your configured SMTP server."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isDe ? "Empfänger-E-Mail-Adresse" : "Recipient Email Address"}
              </label>
              <input
                type="email"
                value={testRecipient}
                onChange={(e) => setTestRecipient(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-[#20222a] border border-slate-200 dark:border-[#272832] rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
              />
              <p className="text-[11px] text-slate-400">
                {isDe ? "Kopie (CC) geht immer an scholarlyopen@gmail.com" : "A confirmation CC is automatically sent to scholarlyopen@gmail.com"}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#20222a] border border-slate-200 dark:border-[#272832] space-y-1 text-xs">
              <div className="font-semibold text-slate-900 dark:text-white">
                {isDe ? "Ausgewählte Vorlage: " : "Selected Template: "}
                <span className="text-[#0b99ff]">{activeTemplate.name}</span>
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px] line-clamp-1">
                Subject: {interpolateTokens(editingSubject, sampleTokens)}
              </div>
            </div>

            {testResult && (
              <div className={`p-3 rounded-xl border text-xs ${
                testResult.success 
                  ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                  : "bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300"
              }`}>
                {testResult.message}
              </div>
            )}
          </div>

          <DialogFooter className="flex items-center justify-between sm:justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTestModalOpen(false)}
              className="text-xs"
            >
              {isDe ? "Schließen" : "Close"}
            </Button>

            <Button
              size="sm"
              disabled={isSendingTest || !testRecipient}
              onClick={handleSendTestEmail}
              className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-semibold"
            >
              {isSendingTest ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  {isDe ? "Wird versendet..." : "Dispatching..."}
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5 mr-1.5" />
                  {isDe ? "Test jetzt absenden" : "Send Test Now"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
