"use client"

import { Mail } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"

export interface EditorMember {
  name: string
  role: string
  affiliation: string
  specialization: string
  email?: string
  orcid?: string
}

interface JournalEditorialBoardProps {
  editorInChief: EditorMember
  associateEditors: EditorMember[]
  editorialBoard: EditorMember[]
}

function EditorCard({ editor, featured = false }: { editor: EditorMember; featured?: boolean }) {
  const initials = editor.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  
  return (
    <Card className={featured ? "border-primary/30" : "border-border"}>
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className={`h-14 w-14 rounded-full flex items-center justify-center shrink-0 ${
            featured ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
          }`}>
            <span className="text-lg font-bold">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base">{editor.name}</CardTitle>
            <CardDescription className="text-sm font-medium text-primary mt-0.5">
              {editor.role}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground">{editor.affiliation}</p>
        <p className="text-sm text-accent mt-1">{editor.specialization}</p>
        {editor.email && (
          <a 
            href={`mailto:${editor.email}`}
            className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground mt-2 transition-colors"
          >
            <Mail className="h-3 w-3 mr-1" />
            {editor.email}
          </a>
        )}
        {editor.orcid && (
          <a 
            href={`https://orcid.org/${editor.orcid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs text-muted-foreground hover:text-foreground mt-1 transition-colors"
          >
            ORCID: {editor.orcid}
          </a>
        )}
      </CardContent>
    </Card>
  )
}

function BoardMemberRow({ editor }: { editor: EditorMember }) {
  const initials = editor.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <span className="text-sm font-semibold text-primary">{initials}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm">{editor.name}</h4>
        <p className="text-xs text-muted-foreground">{editor.affiliation}</p>
        <p className="text-xs text-accent mt-0.5">{editor.specialization}</p>
      </div>
    </div>
  )
}

export function JournalEditorialBoard({ 
  editorInChief, 
  associateEditors, 
  editorialBoard 
}: JournalEditorialBoardProps) {
  const { t } = useLanguage()
  
  return (
    <div className="space-y-12">
      {/* Editor-in-Chief */}
      <div>
        <h3 className="text-xl font-semibold mb-6">{t("editorial.editorInChief")}</h3>
        <div className="max-w-md">
          <EditorCard editor={editorInChief} featured />
        </div>
      </div>
      
      {/* Associate Editors */}
      <div>
        <h3 className="text-xl font-semibold mb-6">{t("editorial.seniorEditors")}</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {associateEditors.map((editor) => (
            <EditorCard key={editor.name} editor={editor} />
          ))}
        </div>
      </div>
      
      {/* Editorial Board */}
      <div>
        <h3 className="text-xl font-semibold mb-6">{t("editorial.boardMembers")}</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {editorialBoard.map((editor) => (
            <BoardMemberRow key={editor.name} editor={editor} />
          ))}
        </div>
      </div>
    </div>
  )
}
