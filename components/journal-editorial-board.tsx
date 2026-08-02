"use client"

import { Mail, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { slugify } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useLanguage } from "@/lib/language-context"

export interface EditorMember {
  id?: string
  name: string
  role: string
  affiliation: string
  specialization: string
  imageUrl?: string
  email?: string
  orcid?: string
  assignedSections?: string[]
  expertise?: string[]
  totalReviews?: number
  avgScore?: number
  acceptedRate?: number
  ethicsFlags?: number
  reviewTimeAvg?: number
  highQualityRatio?: number
  percentile?: number
  badges?: string[]
}

interface JournalEditorialBoardProps {
  editorInChief: EditorMember
  associateEditors: EditorMember[]
  editorialBoard: EditorMember[]
}

function EditorCard({ editor, featured = false }: { editor: EditorMember; featured?: boolean }) {
  const initials = editor.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  
  return (
    <Card className={`border-none shadow-none bg-transparent relative flex flex-col items-center text-center p-2 ${
      featured ? "bg-secondary/5 rounded-2xl p-4" : ""
    }`}>
      {editor.imageUrl ? (
        <img 
          src={editor.imageUrl} 
          alt={editor.name} 
          className="h-32 w-32 rounded-full object-cover object-center shrink-0 mb-3" 
        />
      ) : (
        <div className="h-32 w-32 rounded-full flex items-center justify-center shrink-0 bg-secondary text-secondary-foreground font-bold mb-3">
          <span className="text-4xl">{initials}</span>
        </div>
      )}
      
      <div className="flex flex-col items-center w-full">
        <h4 className="text-lg font-bold text-foreground mb-1">{editor.name}</h4>
        <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed mb-4">{editor.affiliation}</p>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-auto px-6 text-xs font-semibold border-secondary/50 text-secondary-foreground hover:bg-secondary hover:text-secondary-foreground transition-all">
              View Editorial Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto border-border bg-background">
            <DialogHeader>
              <div className="flex items-center gap-4 border-b border-border pb-4">
                {editor.imageUrl ? (
                  <img 
                    src={editor.imageUrl} 
                    alt={editor.name} 
                    className="h-14 w-14 rounded-full object-cover object-center shrink-0 ring-1 ring-slate-900/10 shadow-sm" 
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full flex items-center justify-center shrink-0 bg-secondary text-secondary-foreground font-bold">
                    <span className="text-lg">{initials}</span>
                  </div>
                )}
                <div className="min-w-0 text-left">
                  <DialogTitle className="text-lg font-bold text-foreground">{editor.name}</DialogTitle>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">{editor.role}</p>
                  <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line">{editor.affiliation}</p>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Specialization</h4>
                <p className="text-sm text-foreground">{editor.specialization}</p>
              </div>

              {editor.assignedSections && editor.assignedSections.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Assigned Sections</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {editor.assignedSections.map(sec => (
                      <Badge key={sec} variant="outline" className="bg-secondary/15 text-secondary-foreground border-secondary/30 text-[11px] px-2 py-0.5 font-normal">
                        {sec}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {editor.expertise && editor.expertise.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Areas of Expertise</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {editor.expertise.map(exp => (
                      <Link href={`/topics/${slugify(exp)}`} key={exp}>
                        <Badge variant="outline" className="bg-accent/10 text-accent-foreground border-accent/25 text-[11px] px-2 py-0.5 font-normal hover:bg-accent/20 transition-colors cursor-pointer">
                          {exp}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {editor.badges && editor.badges.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Recognitions</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {editor.badges.map(b => (
                      <Badge key={b} variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] px-2 py-0.5 font-semibold uppercase tracking-wider">
                        {b}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-border pt-4 flex flex-col gap-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact Information</h4>
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-1">
                  {editor.email && (
                    <a 
                      href={`mailto:${editor.email}`}
                      className="inline-flex items-center text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Mail className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      {editor.email}
                    </a>
                  )}
                  {editor.orcid && (
                    <a 
                      href={`https://orcid.org/${editor.orcid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      <span className="inline-flex items-center justify-center bg-muted text-muted-foreground rounded-sm text-[8px] font-bold h-3.5 px-1 mr-1.5">ID</span>
                      ORCID: {editor.orcid}
                    </a>
                  )}
                </div>
              </div>

              {editor.slug && (
                <div className="border-t border-border pt-4 mt-4">
                  <Button size="sm" className="w-full text-xs font-semibold" asChild>
                    <Link href={`/editors/${editor.slug}`}>
                      View Full Profile Page
                      <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  )
}

function BoardMemberRow({ editor }: { editor: EditorMember }) {
  const initials = editor.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-start text-left w-full gap-4 p-4 rounded-lg bg-muted/20 hover:bg-muted/40 border border-border hover:border-primary/30 transition-all cursor-pointer">
          {editor.imageUrl ? (
            <img 
              src={editor.imageUrl} 
              alt={editor.name} 
              className="h-10 w-10 rounded-full object-cover object-center shrink-0 ring-1 ring-slate-900/10 shadow-sm" 
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shrink-0 font-bold">
              <span className="text-sm">{initials}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2">
              <h4 className="font-semibold text-sm text-foreground">{editor.name}</h4>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 whitespace-pre-line">{editor.affiliation}</p>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto border-border bg-background">
        <DialogHeader>
          <div className="flex items-center gap-4 border-b border-border pb-4">
            {editor.imageUrl ? (
              <img 
                src={editor.imageUrl} 
                alt={editor.name} 
                className="h-14 w-14 rounded-full object-cover object-center shrink-0" 
              />
            ) : (
              <div className="h-14 w-14 rounded-full flex items-center justify-center shrink-0 bg-secondary text-secondary-foreground font-bold">
                <span className="text-lg">{initials}</span>
              </div>
            )}
            <div className="min-w-0 text-left">
              <DialogTitle className="text-lg font-bold text-foreground">{editor.name}</DialogTitle>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">{editor.role}</p>
              <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line">{editor.affiliation}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Specialization</h4>
            <p className="text-sm text-foreground">{editor.specialization}</p>
          </div>

          {editor.assignedSections && editor.assignedSections.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Assigned Sections</h4>
              <div className="flex flex-wrap gap-1.5">
                {editor.assignedSections.map(sec => (
                  <Badge key={sec} variant="outline" className="bg-secondary/15 text-secondary-foreground border-secondary/30 text-[11px] px-2 py-0.5 font-normal">
                    {sec}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {editor.expertise && editor.expertise.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Areas of Expertise</h4>
              <div className="flex flex-wrap gap-1.5">
                {editor.expertise.map(exp => (
                  <Link href={`/topics/${slugify(exp)}`} key={exp}>
                    <Badge variant="outline" className="bg-accent/10 text-accent-foreground border-accent/25 text-[11px] px-2 py-0.5 font-normal hover:bg-accent/20 transition-colors cursor-pointer">
                      {exp}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {editor.badges && editor.badges.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Recognitions</h4>
              <div className="flex flex-wrap gap-1.5">
                {editor.badges.map(b => (
                  <Badge key={b} variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] px-2 py-0.5 font-semibold uppercase tracking-wider">
                    {b}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-border pt-4 flex flex-col gap-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact Information</h4>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-1">
              {editor.email && (
                <a 
                  href={`mailto:${editor.email}`}
                  className="inline-flex items-center text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  {editor.email}
                </a>
              )}
              {editor.orcid && (
                <a 
                  href={`https://orcid.org/${editor.orcid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <span className="inline-flex items-center justify-center bg-muted text-muted-foreground rounded-sm text-[8px] font-bold h-3.5 px-1 mr-1.5">ID</span>
                  ORCID: {editor.orcid}
                </a>
              )}
            </div>
          </div>

          {editor.slug && (
            <div className="border-t border-border pt-4 mt-4 w-full">
              <Button size="sm" className="w-full text-xs font-semibold" asChild>
                <Link href={`/editors/${editor.slug}`}>
                  View Full Profile Page
                  <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function JournalEditorialBoard({ 
  editorInChief, 
  associateEditors = [], 
  editorialBoard = [] 
}: JournalEditorialBoardProps) {
  const { t } = useLanguage()

  const displayEic = editorInChief || {
    name: "Position open",
    role: "Editor-in-Chief",
    affiliation: "Under formation",
    specialization: "Currently appointing",
  }

  return (
    <div className="space-y-12">
      {/* Editor-in-Chief */}
      <div>
        <h3 className="text-xl font-semibold mb-6">{t("editorial.editorInChief")}</h3>
        <div className="max-w-md">
          <EditorCard editor={displayEic} featured />
        </div>
      </div>
      
      {/* Associate Editors */}
      {associateEditors.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-6">{t("editorial.seniorEditors")}</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {associateEditors.map((editor, index) => (
              <EditorCard key={`${editor.role}-${index}`} editor={editor} />
            ))}
          </div>
        </div>
      )}
      
      {/* Editorial Board */}
      {editorialBoard.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-6">{t("editorial.boardMembers")}</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {editorialBoard.map((editor, index) => (
              <EditorCard key={`${editor.role}-${index}`} editor={editor} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}




