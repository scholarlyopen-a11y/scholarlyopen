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
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { generateBrandedEmailHtml, interpolateTokens, DEFAULT_EMAIL_TEMPLATES } from "@/lib/email-templates"

export interface EmailDispatchConfig {
  isOpen: boolean
  templateId?: string
  recipientEmail: string
  recipientName: string
  defaultSubject?: string
  defaultBody?: string
  paperId?: string
  paperTitle?: string
  journal?: string
  actionLabel?: string
  actionUrl?: string
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
        acceptUrl: `https://www.scholarlyopen.org/editorial360?action=accept&id=${config.paperId || ''}`,
        declineUrl: `https://www.scholarlyopen.org/editorial360?action=decline&id=${config.paperId || ''}`,
        editorName: "Editorial Office",
        customMessage: "",
        dueDate: "within 14 calendar days"
      }

      // Subject
      if (config.defaultSubject) {
        setSubject(interpolateTokens(config.defaultSubject, tokens))
      } else if (templateDef) {
        setSubject(interpolateTokens(templateDef.defaultSubject, tokens))
      } else {
        setSubject(`Editorial Update: ${config.paperId || ''} - ${config.journal || 'Scholarly Open'}`)
      }

      // Body
      if (config.defaultBody) {
        setBodyText(interpolateTokens(config.defaultBody, tokens))
      } else if (templateDef) {
        setBodyText(interpolateTokens(templateDef.defaultBody, tokens))
      } else {
        setBodyText(`Dear ${config.recipientName || 'Colleague'},\n\nWe are contacting you regarding manuscript ${config.paperId || ''} (${config.paperTitle || ''}).`)
      }

      setRecipientEmail(config.recipientEmail)
      setActiveTab("compose")
      setErrorMsg(null)
      setIsSending(false)
    }
  }, [config.isOpen, config.templateId, config.recipientEmail, config.recipientName, config.defaultSubject, config.defaultBody, config.paperId, config.paperTitle, config.journal])

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
      recipientName: config.recipientName
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
                {isDe ? "Empfänger:" : "Recipient:"}
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {config.recipientName}
              </span>
            </div>

            <div>
              <span className="font-semibold text-slate-500 dark:text-slate-400 block text-[11px]">
                {isDe ? "Empfänger-E-Mail:" : "Recipient Email:"}
              </span>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full mt-0.5 px-2 py-1 text-xs bg-white dark:bg-[#18191e] border border-slate-200 dark:border-[#272832] rounded text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
              />
            </div>

            <div className="sm:col-span-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-200/60 dark:border-[#272832] pt-2 mt-1">
              <div>
                <span className="font-semibold">CC: </span>
                <span className="font-mono text-slate-600 dark:text-slate-300">scholarlyopen@gmail.com</span>
              </div>
              <div>
                <span className="font-semibold">Manuscript: </span>
                <span className="font-mono text-[#0b99ff]">{config.paperId || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* TAB 1: COMPOSE / EDIT */}
          {activeTab === "compose" && (
            <div className="space-y-3">
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
