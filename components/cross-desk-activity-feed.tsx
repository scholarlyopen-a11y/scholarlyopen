"use client"

import React, { useState } from "react"
import {
  Bell,
  ShieldAlert,
  ShieldCheck,
  Mail,
  FileText,
  CheckCircle2,
  Clock,
  User,
  ExternalLink,
  Eye,
  Filter,
  Search,
  AlertTriangle,
  Check,
  Layers,
  ArrowRight
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
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
  currentRole: "jm" | "editor" | "im" | "ria" | "admin"
  notifications: CrossDeskNotification[]
  onMarkAsRead?: (id: string) => void
  onMarkAllAsRead?: () => void
  onViewPaperDossier?: (paperId: string) => void
}

export function CrossDeskActivityFeed({
  language,
  currentRole,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onViewPaperDossier
}: CrossDeskActivityFeedProps) {
  const isDe = language === "de"
  const [filterType, setFilterType] = useState<"all" | "escalations" | "rulings" | "letters">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLetterModal, setSelectedLetterModal] = useState<CrossDeskNotification | null>(null)

  const filteredList = notifications.filter(notif => {
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
  const rulingsCount = notifications.filter(n => n.type === "eic_desk_reject" || n.type === "eic_cleared").length
  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      {/* 1. Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-[#0b99ff] to-emerald-500" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0b99ff] dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-1 rounded-md border border-sky-200/70 dark:border-sky-800/60">
                <Bell className="h-3.5 w-3.5" />
                {isDe ? "Gemeinsamer Redaktions-Aktivitätsfeed" : "Cross-Desk Notifications & Activity Feed"}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#20222a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#272832]">
                {currentRole === "jm" ? "Journal Manager Desk" : currentRole === "editor" ? "Editor-in-Chief Desk" : "Research Integrity Office"}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {isDe ? "Redaktionsmitteilungen & Dispatches" : "Editorial Dispatches & Integrity Audits"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {isDe
                ? "Gemeinsamer Benachrichtigungs-Kanal für Journal Manager (JM), Herausgeber (EiC) und Integritätsmanagerin (IM)."
                : "Synchronized cross-desk activity feed mandatorily connecting Journal Managers, Editors-in-Chief, and Research Integrity."}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {unreadCount > 0 && onMarkAllAsRead && (
              <Button
                variant="outline"
                size="sm"
                onClick={onMarkAllAsRead}
                className="text-xs font-semibold h-8 border-slate-200 dark:border-[#272832] cursor-pointer"
              >
                <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                {isDe ? "Alle als gelesen markieren" : "Mark All as Read"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Quick Stat Strips */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 sm:p-5 bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl shadow-xs">
        <div className="space-y-1 pr-4 border-r border-slate-100 dark:border-[#272832]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            {isDe ? "Gesamte Mitteilungen" : "Total Dispatches"}
          </span>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {notifications.length}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Logged across all desks</span>
        </div>

        <div className="space-y-1 pr-4 sm:border-r border-slate-100 dark:border-[#272832]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 block">
            {isDe ? "Dringende IM-Eskalationen" : "Urgent IM Escalations"}
          </span>
          <div className="text-xl font-bold text-red-600 dark:text-red-400">
            {urgentCount}
          </div>
          <span className="text-[11px] text-red-600/80 font-medium">EiC adjudication required</span>
        </div>

        <div className="space-y-1 pr-4 border-r border-slate-100 dark:border-[#272832]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            {isDe ? "EiC Rulings & Entscheide" : "EiC Rulings Executed"}
          </span>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {rulingsCount}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Desk rejections & orders</span>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            {isDe ? "Ungelesen" : "Unread Notifications"}
          </span>
          <div className="text-xl font-bold text-[#0b99ff]">
            {unreadCount}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Mandatory JM broadcast</span>
        </div>
      </div>

      {/* 3. Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white dark:bg-[#18191e] border border-slate-200/90 dark:border-[#272832] rounded-2xl shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: isDe ? "Alle Aktivitäten" : "All Activity" },
            { id: "escalations", label: isDe ? "⚠️ IM-Eskalationen" : "⚠️ IM Escalations" },
            { id: "rulings", label: isDe ? "⚖️ EiC-Entscheide" : "⚖️ EiC Decisions & Rulings" },
            { id: "letters", label: isDe ? "✉️ Dispatched Letters" : "✉️ Dispatched Letters" },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                filterType === tab.id
                  ? "bg-[#0b99ff] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#20222a]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder={isDe ? "Nach Manuskript ID / Titel filtern..." : "Filter by MS-ID or title..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-[#272832] bg-slate-50 dark:bg-[#131418] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b99ff]"
          />
        </div>
      </div>

      {/* 4. Notification Items Feed */}
      <div className="space-y-3">
        {filteredList.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-[#18191e] border border-slate-200 dark:border-[#272832] rounded-2xl text-slate-500 text-xs">
            {isDe ? "Keine Mitteilungen für diesen Filter gefunden." : "No notifications found matching your search filter."}
          </div>
        ) : (
          filteredList.map((item) => {
            const isUrgent = item.severity === "urgent"
            const isHigh = item.severity === "high"
            const isDeskReject = item.type === "eic_desk_reject"
            const isEscalation = item.type === "im_escalation"

            return (
              <Card
                key={item.id}
                className={`p-4 sm:p-5 rounded-2xl transition-all border shadow-xs ${
                  isUrgent
                    ? "bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/40 hover:border-red-300"
                    : isHigh
                    ? "bg-amber-50/30 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 hover:border-amber-300"
                    : "bg-white dark:bg-[#18191e] border-slate-200/90 dark:border-[#272832] hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5 flex-1">
                    {/* Actor Icon Badge */}
                    <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                      isUrgent
                        ? "bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400"
                        : isHigh
                        ? "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
                        : isDeskReject
                        ? "bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
                        : "bg-sky-100 dark:bg-sky-950/60 text-[#0b99ff]"
                    }`}>
                      {isUrgent || isEscalation ? (
                        <ShieldAlert className="h-5 w-5" />
                      ) : isDeskReject ? (
                        <AlertTriangle className="h-5 w-5" />
                      ) : (
                        <Bell className="h-5 w-5" />
                      )}
                    </div>

                    <div className="space-y-1.5 flex-1">
                      {/* Top Metadata Strip */}
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className="font-bold text-[#0b99ff] bg-[#0b99ff]/10 px-2 py-0.5 rounded border border-[#0b99ff]/20">
                          {item.paperId}
                        </span>
                        <span className="font-semibold text-slate-600 dark:text-slate-400">
                          {item.journal}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.timestamp}
                        </span>
                        {isUrgent && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white">
                            Mandatory JM Alert
                          </span>
                        )}
                        {!item.isRead && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#0b99ff] text-white">
                            New
                          </span>
                        )}
                      </div>

                      {/* Headline & Summary */}
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {item.headline}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {item.summary}
                      </p>

                      {/* Paper Title & Initiator Attribution */}
                      <div className="pt-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-3 flex-wrap">
                        <span>Target MS: <strong className="text-slate-800 dark:text-slate-200">"{item.paperTitle}"</strong></span>
                        <span>•</span>
                        <span>Initiated by: <strong className="text-slate-800 dark:text-slate-200">{item.actorName}</strong> ({item.actorRole})</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 self-end sm:self-start">
                    {item.dispatchedLetter && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedLetterModal(item)}
                        className="text-xs h-8 px-3 border-slate-200 dark:border-[#272832] text-slate-700 dark:text-slate-300 hover:text-[#0b99ff] cursor-pointer"
                      >
                        <Mail className="h-3.5 w-3.5 mr-1 text-[#0b99ff]" />
                        {isDe ? "Brief-Kopie einsehen" : "View Dispatched Letter"}
                      </Button>
                    )}

                    {onViewPaperDossier && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewPaperDossier(item.paperId)}
                        className="text-xs h-8 px-3 border-slate-200 dark:border-[#272832] text-slate-700 dark:text-slate-300 hover:text-[#0b99ff] cursor-pointer"
                      >
                        <FileText className="h-3.5 w-3.5 mr-1 text-[#0b99ff]" />
                        {isDe ? "Dossier öffnen" : "View Dossier"}
                      </Button>
                    )}

                    {!item.isRead && onMarkAsRead && (
                      <button
                        type="button"
                        onClick={() => onMarkAsRead(item.id)}
                        className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline cursor-pointer"
                      >
                        {isDe ? "Als erledigt markieren" : "Acknowledge"}
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>

      {/* 5. View Dispatched Letter Dialog */}
      <Dialog open={!!selectedLetterModal} onOpenChange={(open) => !open && setSelectedLetterModal(null)}>
        <DialogContent className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 sm:max-w-xl rounded-2xl p-6 shadow-2xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#0b99ff]" />
              {isDe ? "Offizielle E-Mail / Brief-Kopie" : "Official Editorial Dispatch Copy"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Archived copy of the formal communication dispatched to the corresponding author.
            </DialogDescription>
          </DialogHeader>

          {selectedLetterModal && (
            <div className="space-y-4 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">{selectedLetterModal.paperId}</span>
                  <span className="text-[11px] text-slate-500">{selectedLetterModal.timestamp}</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  {selectedLetterModal.paperTitle}
                </div>
                <div className="pt-1 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Sender: <strong>{selectedLetterModal.actorName}</strong></span>
                  <span>Recipient: <strong>Corresponding Author & Co-Authors</strong></span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Dispatched Communication Body
                </span>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                  {selectedLetterModal.dispatchedLetter || "No letter body available for this event."}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  onClick={() => setSelectedLetterModal(null)}
                  className="bg-[#0b99ff] hover:bg-[#0088e0] text-white text-xs font-bold h-8 px-4 rounded-xl cursor-pointer"
                >
                  {isDe ? "Schließen" : "Close"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
