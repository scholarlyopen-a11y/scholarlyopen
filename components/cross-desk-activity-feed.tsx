"use client"

import React, { useState } from "react"
import {
  Bell,
  ShieldAlert,
  Mail,
  FileText,
  Clock,
  Search,
  AlertTriangle,
  Check,
  Layers,
  Scale,
  Inbox,
  Copy,
  CheckCheck,
  Eye
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"

export interface CrossDeskNotification {
  id: string
  timestamp: string
  paperId: string
  paperTitle: string
  journal: string
  type: "im_escalation" | "im_flag" | "eic_desk_reject" | "eic_inquiry" | "eic_raw_data" | "eic_cleared" | "jm_assignment" | "decision_completed"
  severity: "urgent" | "high" | "normal" | "info"
  actorName: string
  actorRole: "Research Integrity Office" | "Editor-in-Chief" | "Journal Manager Desk" | "Editorial Office"
  headline: string
  summary: string
  dispatchedLetter?: string
  recipient?: string
  isRead?: boolean
}

interface CrossDeskActivityFeedProps {
  language: "en" | "de"
  currentRole?: "jm" | "editor" | "im" | "ria" | "admin"
  notifications: CrossDeskNotification[]
  onMarkAsRead?: (id: string) => void
  onMarkAllAsRead?: () => void
  onViewPaperDossier?: (paperId: string) => void
}

export function CrossDeskActivityFeed({
  language,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onViewPaperDossier
}: CrossDeskActivityFeedProps) {
  const isDe = language === "de"
  const [filterType, setFilterType] = useState<"all" | "escalations" | "rulings" | "letters">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedJournal, setSelectedJournal] = useState("all")
  const [selectedLetterModal, setSelectedLetterModal] = useState<CrossDeskNotification | null>(null)
  const [selectedDossierModal, setSelectedDossierModal] = useState<CrossDeskNotification | null>(null)
  const [copied, setCopied] = useState(false)

  const filteredList = notifications.filter(notif => {
    if (selectedJournal !== "all") {
      if (!notif.journal.toLowerCase().includes(selectedJournal.toLowerCase())) {
        return false
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchesSearch = 
        notif.paperId.toLowerCase().includes(q) ||
        notif.paperTitle.toLowerCase().includes(q) ||
        notif.headline.toLowerCase().includes(q) ||
        notif.actorName.toLowerCase().includes(q)
      if (!matchesSearch) return false
    }

    if (filterType === "escalations") {
      return notif.type === "im_escalation" || notif.type === "im_flag"
    }
    if (filterType === "rulings") {
      return notif.type === "eic_desk_reject" || notif.type === "eic_cleared" || notif.type === "decision_completed"
    }
    if (filterType === "letters") {
      return notif.type === "eic_inquiry" || notif.type === "eic_raw_data" || notif.type === "eic_desk_reject"
    }
    return true
  })

  const urgentCount = notifications.filter(n => n.severity === "urgent").length
  const rulingsCount = notifications.filter(n => n.type === "eic_desk_reject" || n.type === "eic_cleared" || n.type === "decision_completed").length
  const unreadCount = notifications.filter(n => !n.isRead).length
  const lettersCount = notifications.filter(n => !!n.dispatchedLetter).length

  const handleCopyLetter = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderTypeBadge = (item: CrossDeskNotification) => {
    if (item.severity === "urgent" || item.type === "im_escalation") {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40">
          <ShieldAlert className="h-3 w-3" />
          {isDe ? "Dringend" : "Action Required"}
        </span>
      )
    }
    if (item.type === "eic_desk_reject" || item.type === "eic_cleared" || item.type === "decision_completed") {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
          <Scale className="h-3 w-3" />
          {isDe ? "Entscheid" : "Decision"}
        </span>
      )
    }
    if (item.type === "eic_inquiry" || item.type === "eic_raw_data" || item.dispatchedLetter) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800/60">
          <Mail className="h-3 w-3" />
          {isDe ? "Korrespondenz" : "Correspondence"}
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
        <Bell className="h-3 w-3" />
        {isDe ? "Aktivität" : "Activity"}
      </span>
    )
  }

  return (
    <div className="space-y-4">
      {/* 1. Top Control Bar: Search & Journal Filter (Matches Submission Pipeline) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#18191e] p-3.5 rounded-2xl border border-slate-200/90 dark:border-[#272832] shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isDe ? "Nach ID, Titel oder Person filtern..." : "Search activity by MS-ID, title, or author..."}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0b99ff]"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedJournal}
            onChange={(e) => setSelectedJournal(e.target.value)}
            className="w-full sm:w-auto text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0b99ff] cursor-pointer"
          >
            <option value="all">All Journals</option>
            <option value="Medicine">Scholarly Open: Medicine</option>
            <option value="Engineering">Engineering & Applied Sciences</option>
            <option value="Social">Social Sciences & Humanities</option>
            <option value="Decarbonization">Decarbonization & Carbon Tech</option>
          </select>

          {unreadCount > 0 && onMarkAllAsRead && (
            <Button
              variant="outline"
              size="sm"
              onClick={onMarkAllAsRead}
              className="h-8 text-xs font-semibold whitespace-nowrap border-slate-200 dark:border-slate-800 px-3 rounded-xl cursor-pointer"
            >
              <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" />
              {isDe ? "Alle gelesen" : "Mark all read"}
            </Button>
          )}
        </div>
      </div>

      {/* 2. Filter Pills (Matches Submission Pipeline Stage Filter Pills) */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { key: "all", label: isDe ? "Alle" : "All", count: notifications.length },
          { key: "escalations", label: isDe ? "Handlungsbedarf" : "Action Required", count: urgentCount, isAlert: urgentCount > 0 },
          { key: "rulings", label: isDe ? "Entscheidungen" : "Decisions", count: rulingsCount },
          { key: "letters", label: isDe ? "Korrespondenz" : "Correspondence", count: lettersCount }
        ].map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilterType(tab.key as any)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              filterType === tab.key
                ? (tab as any).isAlert
                  ? "bg-red-600 text-white border-red-600 shadow-xs"
                  : "bg-[#0b99ff] text-white border-[#0b99ff] shadow-xs"
                : (tab as any).isAlert
                ? "bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/40"
                : "bg-white dark:bg-[#18191e] text-slate-600 dark:text-slate-400 border-slate-200/90 dark:border-[#272832] hover:border-slate-300"
            }`}
          >
            {(tab as any).isAlert && <ShieldAlert className="h-3.5 w-3.5 text-current" />}
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              filterType === tab.key
                ? "bg-white/20 text-white"
                : (tab as any).isAlert
                ? "bg-red-200 dark:bg-red-900/60 text-red-800 dark:text-red-200"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 3. Full-Width Clean Table (Matches Submission Pipeline) */}
      <Card className="bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[920px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="px-5 py-3.5 whitespace-nowrap w-[170px]">Manuscript ID & Date</th>
                <th className="px-5 py-3.5 min-w-[280px]">Event & Manuscript</th>
                <th className="px-5 py-3.5 whitespace-nowrap w-[160px]">Category</th>
                <th className="px-5 py-3.5 whitespace-nowrap w-[220px]">Initiated By</th>
                <th className="px-4 py-3.5 whitespace-nowrap text-center min-w-[200px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <Inbox className="h-6 w-6 text-slate-300 dark:text-slate-600 mb-1" />
                      <span>{isDe ? "Keine Aktivitäten für diese Auswahl gefunden." : "No activity records found matching your filter."}</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => {
                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-900/50 transition-colors ${
                        !item.isRead ? "bg-[#0b99ff]/[0.02] dark:bg-sky-950/[0.05]" : ""
                      }`}
                    >
                      {/* 1. Manuscript ID & Time */}
                      <td className="px-5 py-4 align-top w-[170px] whitespace-nowrap">
                        <div className="flex flex-col items-start space-y-1">
                          <span className="font-bold text-[#0b99ff] bg-[#0b99ff]/10 px-2.5 py-0.5 rounded-md inline-block whitespace-nowrap border border-[#0b99ff]/20">
                            {item.paperId}
                          </span>
                          <div className="text-slate-400 text-[11px] font-medium px-0.5 whitespace-nowrap flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {item.timestamp}
                          </div>
                          {!item.isRead && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#0b99ff] text-white">
                              New
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 2. Event & Manuscript */}
                      <td className="px-5 py-4 align-top min-w-[280px]">
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                            {item.headline}
                          </h4>
                          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            {item.journal}
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                            {item.summary}
                          </p>
                          <div className="text-[11px] text-slate-400 font-normal pt-0.5">
                            Target: <span className="font-medium text-slate-700 dark:text-slate-300">"{item.paperTitle}"</span>
                          </div>
                        </div>
                      </td>

                      {/* 3. Category */}
                      <td className="px-5 py-4 align-top w-[160px] whitespace-nowrap">
                        {renderTypeBadge(item)}
                      </td>

                      {/* 4. Initiated By */}
                      <td className="px-5 py-4 align-top text-xs w-[220px]">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-800 dark:text-slate-200">
                            {item.actorName}
                          </div>
                          <div className="text-slate-400 text-[11px]">
                            {item.actorRole}
                          </div>
                        </div>
                      </td>

                      {/* 5. Actions */}
                      <td className="px-4 py-4 align-top text-center min-w-[200px]">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {item.dispatchedLetter && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedLetterModal(item)}
                              className="h-8 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 border-slate-200 dark:border-slate-800 px-2.5 rounded-lg cursor-pointer"
                            >
                              <Mail className="h-3.5 w-3.5 mr-1 text-[#0b99ff]" />
                              {isDe ? "Brief" : "Letter"}
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (onViewPaperDossier) {
                                onViewPaperDossier(item.paperId)
                              } else {
                                setSelectedDossierModal(item)
                              }
                            }}
                            className="h-8 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 border-slate-200 dark:border-slate-800 px-2.5 rounded-lg cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5 mr-1 text-[#0b99ff]" />
                            {isDe ? "Details" : "Details"}
                          </Button>

                          {!item.isRead && onMarkAsRead && (
                            <Button
                              size="sm"
                              onClick={() => onMarkAsRead(item.id)}
                              className="h-8 text-xs font-bold bg-[#0b99ff] hover:bg-[#0088e0] text-white px-2.5 rounded-lg cursor-pointer"
                            >
                              <Check className="h-3.5 w-3.5 mr-1" />
                              {isDe ? "Gelesen" : "Read"}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 4. View Dispatched Letter Dialog (Matches Workspace Dialogs) */}
      <Dialog open={!!selectedLetterModal} onOpenChange={(open) => !open && setSelectedLetterModal(null)}>
        <DialogContent className="sm:max-w-xl bg-white dark:bg-[#18191e] border border-slate-200 dark:border-[#272832] rounded-2xl p-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#0b99ff]" />
              {isDe ? "Mitteilungskopie" : "Official Dispatch Copy"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {selectedLetterModal?.paperId} — {selectedLetterModal?.paperTitle}
            </DialogDescription>
          </DialogHeader>

          {selectedLetterModal && (
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Sender</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{selectedLetterModal.actorName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Recipient</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{selectedLetterModal.recipient || "Corresponding Author"}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    {isDe ? "Nachricht" : "Message Body"}
                  </span>
                  {selectedLetterModal.dispatchedLetter && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyLetter(selectedLetterModal.dispatchedLetter || "")}
                      className="h-6 text-xs gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <CheckCheck className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-3.5 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                  {selectedLetterModal.dispatchedLetter || "No letter body available."}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedLetterModal(null)}
              className="text-xs font-semibold h-8 px-4 rounded-xl border-slate-200 dark:border-slate-800 cursor-pointer"
            >
              {isDe ? "Schließen" : "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 5. Manuscript & Activity Quick Dossier Modal */}
      <Dialog open={!!selectedDossierModal} onOpenChange={(open) => !open && setSelectedDossierModal(null)}>
        <DialogContent className="sm:max-w-xl bg-white dark:bg-[#18191e] border border-slate-200 dark:border-[#272832] rounded-2xl p-6">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-[#0b99ff] bg-[#0b99ff]/10 px-2.5 py-0.5 rounded-md border border-[#0b99ff]/20">
                {selectedDossierModal?.paperId}
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                {selectedDossierModal?.timestamp}
              </span>
            </div>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white pt-1">
              {selectedDossierModal?.paperTitle}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {selectedDossierModal?.journal}
            </DialogDescription>
          </DialogHeader>

          {selectedDossierModal && (
            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Activity Event:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedDossierModal.headline}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Initiated By:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedDossierModal.actorName} ({selectedDossierModal.actorRole})</span>
                </div>
                {selectedDossierModal.recipient && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Target / Assignee:</span>
                    <span className="font-semibold text-[#0b99ff]">{selectedDossierModal.recipient}</span>
                  </div>
                )}
                <div className="text-xs text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                  {selectedDossierModal.summary}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDossierModal(null)}
              className="text-xs font-semibold h-8 px-4 rounded-xl border-slate-200 dark:border-slate-800 cursor-pointer"
            >
              {isDe ? "Schließen" : "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
