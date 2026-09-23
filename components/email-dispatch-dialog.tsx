"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Mail,
  Send,
  Eye,
  Edit3,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  FileText,
  Globe
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { generateBrandedEmailHtml, interpolateTokens, DEFAULT_EMAIL_TEMPLATES, getBilingualGermanIntro } from "@/lib/email-templates"
import { getJournalReplyTo } from "@/lib/data/journal-contacts"

export interface EmailDispatchConfig {
  isOpen: boolean
  templateId?: string
  recipientEmail: string
  recipientName: string
  recipientCountry?: string
  defaultSubject?: string
  defaultBody?: string
  paperId?: string
  paperTitle?: string
  journal?: string
  actionLabel?: string
  actionUrl?: string
  includeEditorial360Logo?: boolean
  onConfirmSend: (finalData: {
    subject: string
    bodyText: string
    renderedHtml: string
    recipientEmail: string
  }) => Promise<void> | void
  onCancel: () => void
}

interface EmailDispatchDialogProps {
  language?: "en" | "de"
  config: EmailDispatchConfig
}

export function EmailDispatchDialog({ language = "en", config }: EmailDispatchDialogProps) {
  const isDe = language === "de"

  const [activeTab, setActiveTab] = useState<"compose" | "preview">("compose")
  const [subject, setSubject] = useState("")
  const [bodyText, setBodyText] = useState("")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [languagePreset, setLanguagePreset] = useState<"en" | "de">("en")

  const getTemplateCategory = (templateId?: string): "ebm" | "eic" | "author" | "reviewer" | "general" => {
    if (!templateId) return "general"
    const lower = templateId.toLowerCase()
    if (lower.includes("ebm") || lower.includes("board")) return "ebm"
    if (lower.includes("eic") || lower.includes("chief")) return "eic"
    if (lower.includes("paper") || lower.includes("author") || lower.includes("waiver") || lower.includes("submission")) return "author"
    if (lower.includes("reviewer") || lower.includes("review") || lower.includes("invitation")) return "reviewer"
    return "general"
  }

  const handleSwitchLanguagePreset = (preset: "en" | "de") => {
    setLanguagePreset(preset)
    const category = getTemplateCategory(config.templateId)
    const separator = "────────────────────────────────────────────────────"

    if (preset === "de") {
      if (!bodyText.includes(separator)) {
        const intro = getBilingualGermanIntro(
          category,
          config.recipientName,
          config.journal || "Scholarly Open",
          { paperId: config.paperId }
        )
        setBodyText(`${intro}\n\n${bodyText}`)
        if (!subject.includes("[Einladung") && !subject.includes("[Berufung") && !subject.includes("[Call for Papers")) {
          const prefix = category === "eic" ? "[Berufung / Appointment] " : category === "author" ? "[Call for Papers / Einladung] " : "[Einladung / Invitation] "
          setSubject(`${prefix}${subject}`)
        }
      }
    } else {
      if (bodyText.includes(separator)) {
        const parts = bodyText.split(separator)
        if (parts.length > 1) {
          setBodyText(parts[1].trim())
        }
        setSubject(subject.replace(/^\[[^\]]+\]\s*/, ""))
      }
    }
  }

  // Initialize or update fields when dialog opens
  useEffect(() => {
    if (config.isOpen) {
      const templateDef = DEFAULT_EMAIL_TEMPLATES.find(t => t.id === config.templateId)

      const tokens: Record<string, string> = {
        recipientName: config.recipientName || "Colleague",
        paperId: config.paperId || "N/A",
        paperTitle: config.paperTitle || "Submitted Manuscript",
        journal: config.journal || "Scholarly Open",
        portalUrl: "https://www.scholarlyopen.org/editorial360",
        acceptUrl: `https://www.scholarlyopen.org/editorial360?action=accept&id=${encodeURIComponent(config.paperId || '')}&journal=${encodeURIComponent(config.journal || '')}&email=${encodeURIComponent(config.recipientEmail || '')}&name=${encodeURIComponent(config.recipientName || '')}`,
        declineUrl: `https://www.scholarlyopen.org/editorial360?action=decline&id=${encodeURIComponent(config.paperId || '')}&journal=${encodeURIComponent(config.journal || '')}&email=${encodeURIComponent(config.recipientEmail || '')}&name=${encodeURIComponent(config.recipientName || '')}`,
        editorName: "Editorial Office",
        customMessage: "",
        dueDate: "within 14 calendar days"
      }

      // Subject
      let initialSubject = ""
      if (config.defaultSubject) {
        initialSubject = interpolateTokens(config.defaultSubject, tokens)
      } else if (templateDef) {
        initialSubject = interpolateTokens(templateDef.defaultSubject, tokens)
      } else {
        initialSubject = `Editorial Update: ${config.paperId || ''} - ${config.journal || 'Scholarly Open'}`
      }

      // Body
      let initialBody = ""
      if (config.defaultBody) {
        initialBody = interpolateTokens(config.defaultBody, tokens)
      } else if (templateDef) {
        initialBody = interpolateTokens(templateDef.defaultBody, tokens)
      } else {
        initialBody = `Dear ${config.recipientName || 'Colleague'},\n\nWe are contacting you regarding manuscript ${config.paperId || ''} (${config.paperTitle || ''}).`
      }

      // Auto-detect DACH / German context from recipient email or country
      const emailDomain = (config.recipientEmail || "").toLowerCase().trim()
      const c = (config.recipientCountry || "").toLowerCase().trim()
      const isGermanTarget =
        language === "de" ||
        ["de", "at", "ch", "germany", "deutschland", "austria", "österreich", "switzerland", "schweiz", "dach"].includes(c) ||
        emailDomain.endsWith(".de") ||
        emailDomain.endsWith(".at") ||
        emailDomain.endsWith(".ch")

      const category = getTemplateCategory(config.templateId)

      if (isGermanTarget) {
        setLanguagePreset("de")
        const intro = getBilingualGermanIntro(
          category,
          config.recipientName || "Kollege",
          config.journal || "Scholarly Open",
          { paperId: config.paperId }
        )
        setBodyText(`${intro}\n\n${initialBody}`)
        const prefix = category === "eic" ? "[Berufung / Appointment] " : category === "author" ? "[Call for Papers / Einladung] " : "[Einladung / Invitation] "
        if (!initialSubject.startsWith("[")) {
          setSubject(`${prefix}${initialSubject}`)
        } else {
          setSubject(initialSubject)
        }
      } else {
        setLanguagePreset("en")
        setBodyText(initialBody)
        setSubject(initialSubject)
      }

      setRecipientEmail(config.recipientEmail)
      setActiveTab("compose")
      setErrorMsg(null)
      setIsSending(false)
    }
  }, [config.isOpen, config.templateId, config.recipientEmail, config.recipientName, config.recipientCountry, config.defaultSubject, config.defaultBody, config.paperId, config.paperTitle, config.journal, language])

  // Generate preview HTML
  const renderedHtml = useMemo(() => {
    return generateBrandedEmailHtml({
      subject,
      bodyText,
      actionLabel: config.actionLabel,
      actionUrl: config.actionUrl || "https://www.scholarlyopen.org/editorial360",
      journal: config.journal || "Scholarly Open",
      paperId: config.paperId,
      paperTitle: config.paperTitle,
      recipientName: config.recipientName,
      includeEditorial360Logo: config.includeEditorial360Logo ?? false
    })
  }, [subject, bodyText, config])

  const handleSend = async () => {
    if (!recipientEmail || !subject.trim()) {
      setErrorMsg(isDe ? "Bitte geben Sie einen Empfänger und Betreff an." : "Please provide both a recipient and subject line.")
      return
    }

    setIsSending(true)
    setErrorMsg(null)

    try {
      await config.onConfirmSend({
        subject,
        bodyText,
        renderedHtml,
        recipientEmail
      })
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to dispatch email")
      setIsSending(false)
    }
  }

  if (!config.isOpen) return null

  return (
    <Dialog open={config.isOpen} onOpenChange={(open) => { if (!open) config.onCancel() }}>
      <DialogContent className="sm:max-w-2xl bg-white dark:bg-[#18191e] border-slate-200 dark:border-[#272832] p-0 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 pb-3 border-b border-slate-100 dark:border-[#272832] bg-slate-50/70 dark:bg-[#141518]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-[#0b99ff] to-[#0077cc] text-white flex items-center justify-center font-bold shadow-2xs">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                  {isDe ? "E-Mail prüfen & anpassen vor dem Versand" : "Review & Customize Email Before Dispatch"}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                  {isDe ? "Passen Sie Betreff oder Text für diesen Vorgang an." : "Edit the subject or personal message before sending."}
                </DialogDescription>
              </div>
            </div>

            {/* Sub-Tabs */}
            <div className="flex items-center bg-slate-200/80 dark:bg-[#20222a] p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setActiveTab("compose")}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  activeTab === "compose"
                    ? "bg-white dark:bg-[#18191e] text-[#0b99ff] shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                <Edit3 className="h-3 w-3" />
                <span>{isDe ? "Verfassen" : "Compose"}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  activeTab === "preview"
                    ? "bg-white dark:bg-[#18191e] text-[#0b99ff] shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                <Eye className="h-3 w-3" />
                <span>{isDe ? "Vorschau" : "Preview"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-3.5 max-h-[65vh] overflow-y-auto">
          {/* Metadata Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-[#20222a] p-3 rounded-xl border border-slate-200/80 dark:border-[#272832]">
            <div>
              <span className="font-semibold text-slate-500 dark:text-slate-400 block text-[11px]">
                {isDe ? "Absender (Offizielle Journal-Mail):" : "Sending From (Official Journal Desk):"}
              </span>
              <div className="font-bold text-slate-900 dark:text-white truncate">
                {config.journal || "Scholarly Open"}
              </div>
              <span className="font-mono text-[11px] text-[#0b99ff] font-semibold">
                {getJournalReplyTo(config.journal)}
              </span>
            </div>

            <div>
              <span className="font-semibold text-slate-500 dark:text-slate-400 block text-[11px]">
                {isDe ? "Empfänger:" : "Recipient:"}
              </span>
              <div className="font-bold text-slate-900 dark:text-white truncate">
                {config.recipientName}
              </div>
              <span className="text-[11px] text-slate-400">
                Direct Scholar Outreach
              </span>
            </div>

            <div className="sm:col-span-2">
              <span className="font-semibold text-slate-500 dark:text-slate-400 block text-[11px]">
                {isDe ? "Empfänger-E-Mail (anpassbar):" : "Recipient Email (Customizable):"}
              </span>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full mt-0.5 px-2.5 py-1.5 text-xs bg-white dark:bg-[#18191e] border border-slate-200 dark:border-[#272832] rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
              />
            </div>

            <div className="sm:col-span-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-200/60 dark:border-[#272832] pt-2 mt-1">
              <div>
                <span className="font-semibold">CC: </span>
                <span className="font-mono text-slate-600 dark:text-slate-300">scholarlyopen@gmail.com</span>
              </div>
              <div>
                <span className="font-semibold">Reply-To: </span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">{getJournalReplyTo(config.journal)}</span>
              </div>
            </div>
          </div>

          {/* TAB 1: COMPOSE / EDIT */}
          {activeTab === "compose" && (
            <div className="space-y-3">
              {/* Language Preset Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-[#20222a] border border-slate-200 dark:border-[#272832]">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <Globe className="h-3.5 w-3.5 text-[#0b99ff] shrink-0" />
                  <span>{isDe ? "Sprachmodus für diesen Empfänger:" : "Language Preset for Scholar:"}</span>
                  <span className="text-[11px] font-normal text-muted-foreground hidden sm:inline">
                    {isDe ? "(Deutsche Einleitung, Fachtext auf Englisch)" : "(German intro + English academic core)"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSwitchLanguagePreset("en")}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      languagePreset === "en"
                        ? "bg-white dark:bg-[#18191e] text-[#0b99ff] shadow-2xs border border-slate-200 dark:border-[#272832]"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    🇬🇧 English
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSwitchLanguagePreset("de")}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      languagePreset === "de"
                        ? "bg-emerald-500 text-white shadow-2xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    🇩🇪 Deutsch (Bilingual Intro)
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isDe ? "Betreffzeile" : "Subject Line"}
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-[#20222a] border border-slate-200 dark:border-[#272832] rounded-lg text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isDe ? "Nachrichtentext (Freitext oder Vorlage)" : "Message Body (Editable for this recipient)"}
                </label>
                <textarea
                  rows={9}
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  className="w-full p-3 text-xs font-mono leading-relaxed bg-white dark:bg-[#20222a] border border-slate-200 dark:border-[#272832] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
                />
              </div>
            </div>
          )}

          {/* TAB 2: LIVE HTML PREVIEW */}
          {activeTab === "preview" && (
            <div className="border border-slate-200 dark:border-[#272832] rounded-xl overflow-hidden bg-slate-100 dark:bg-black/30 p-2 flex justify-center">
              <iframe
                srcDoc={renderedHtml}
                title="Email Preview"
                className="w-full h-[360px] bg-white rounded-lg shadow-xs border-0"
              />
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-700 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-[#141518] border-t border-slate-100 dark:border-[#272832] flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={config.onCancel}
            disabled={isSending}
            className="text-xs"
          >
            {isDe ? "Abbrechen" : "Cancel"}
          </Button>

          <Button
            size="sm"
            disabled={isSending || !recipientEmail}
            onClick={handleSend}
            className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-semibold px-5"
          >
            {isSending ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                {isDe ? "Wird versendet..." : "Dispatching via SMTP..."}
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5 mr-1.5" />
                {isDe ? "E-Mail jetzt senden" : "Send Email via SMTP"}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
