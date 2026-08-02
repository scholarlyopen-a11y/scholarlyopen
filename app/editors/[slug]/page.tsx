import { notFound } from "next/navigation"
import Link from "next/link"
import { 
  Mail, ExternalLink, ArrowLeft, BookOpen, GraduationCap, 
  Quote, Layers, Activity, Send, Award, Calendar, ChevronRight
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { editors } from "@/lib/data/editors"
import { articles } from "@/lib/data/articles"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { slugify } from "@/lib/utils"

interface EditorPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return editors.map((editor) => ({
    slug: editor.slug,
  }))
}

export async function generateMetadata({ params }: EditorPageProps) {
  const { slug } = await params
  const editor = editors.find((e) => e.slug === slug)
  if (!editor) return {}

  const titleText = `Dr. ${editor.name} | ${editor.role} | Scholarly Open`
  const descText = `${editor.name} is an ${editor.role} at Scholarly Open (${editor.affiliation}), specializing in ${editor.specialization.toLowerCase()}`

  return {
    title: titleText,
    description: descText,
    openGraph: {
      title: titleText,
      description: descText,
      type: "profile",
      url: `https://scholarlyopen.org/editors/${editor.slug}`,
      images: [
        {
          url: editor.imageUrl || "/images/default-avatar.png",
          width: 600,
          height: 600,
          alt: editor.name,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titleText,
      description: descText,
      images: [editor.imageUrl || "/images/default-avatar.png"],
    }
  }
}

export default async function EditorProfilePage({ params }: EditorPageProps) {
  const { slug } = await params
  const editor = editors.find((e) => e.slug === slug)
  
  if (!editor) {
    notFound()
  }

  // Get articles published in this editor's journal
  const relatedArticles = articles.filter(a => a.journalSlug === editor.journalSlug)
  const initials = editor.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const lastName = editor.name.split(',')[0].trim().split(' ').pop()

  const welcomeMessage = editor.welcomeMessage || `Welcoming submissions in ${editor.specialization}.`
  
  const stats = editor.stats || [
    { label: "Status", value: "Accepting Submissions", description: "Open for peer-review assignment" },
    { label: "Review Speed", value: "~30 Days", description: "Average time to decision" },
    { label: "Standard", value: "Rigorous Double-Blind", description: "Ensuring academic excellence" }
  ]
  
  const timeline = editor.timeline || [
    { year: "Career", title: "Joined Editorial Board", description: `Serving as ${editor.role} at Scholarly Open.`, type: "milestone" as const }
  ]

  // Generate structured Person metadata for Google Search
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": editor.orcid ? `https://orcid.org/${editor.orcid}` : undefined,
    "name": editor.name,
    "jobTitle": editor.role,
    "worksFor": [
      {
        "@type": "Organization",
        "name": editor.affiliation
      },
      {
        "@type": "Organization",
        "name": "Scholarly Open",
        "url": "https://scholarlyopen.org"
      }
    ],
    "memberOf": {
      "@type": "AcademicJournal",
      "name": "Scholarly Open: Decarbonization & Carbon Tech",
      "url": `https://scholarlyopen.org/journals/${editor.journalSlug}`
    },
    "identifier": editor.orcid ? {
      "@type": "PropertyValue",
      "name": "ORCID",
      "value": editor.orcid
    } : undefined,
    "description": editor.specialization,
    "sameAs": [
      editor.orcid ? `https://orcid.org/${editor.orcid}` : null,
      editor.googleScholar,
      editor.researchGate
    ].filter(Boolean)
  }


  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 text-foreground">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Header />
      
      <main className="flex-1 pb-20">
        {/* Back navigation banner */}
        <div className="border-b border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md sticky top-14 z-40">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <Link 
              href={`/journals/${editor.journalSlug}`} 
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors gap-2 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Journal
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <span>Journal</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-semibold">{editor.name}</span>
            </div>
          </div>
        </div>

        {/* Profile Layout */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3 items-start">
            
            {/* Left Sidebar - Glassmorphic Card */}
            <div className="space-y-8">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-lg rounded-3xl p-8 flex flex-col items-center text-center space-y-6">
                
                {/* Photo with Premium Halo Ring */}
                <div className="relative group">
                  {editor.imageUrl ? (
                    <img 
                      src={editor.imageUrl} 
                      alt={editor.name} 
                      className="relative h-32 w-32 rounded-full object-cover object-center bg-slate-200 dark:bg-slate-800 ring-1 ring-slate-900/10 shadow-sm" 
                    />
                  ) : (
                    <div className="relative h-32 w-32 rounded-full bg-secondary text-secondary-foreground font-bold flex items-center justify-center text-4xl shadow-inner">
                      {initials}
                    </div>
                  )}
                </div>

                {/* Identity */}
                <div className="space-y-2.5">
                  <h1 className={`${
                    editor.name.length > 25 
                      ? "text-xl lg:text-lg xl:text-xl" 
                      : "text-2xl lg:text-xl xl:text-2xl"
                  } font-bold tracking-tight text-slate-900 dark:text-slate-50`}>
                    {editor.name}
                  </h1>
                  <div className="flex justify-center gap-2 flex-wrap">
                    <Badge className="bg-primary/10 text-primary border-0 font-bold uppercase tracking-wider text-[10px] px-2.5 py-0.5">
                      {editor.role}
                    </Badge>
                    {editor.badges?.map(b => (
                      <Badge key={b} className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-0 font-bold uppercase tracking-wider text-[10px] px-2.5 py-0.5">
                        {b}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground font-medium px-4 whitespace-pre-line">{editor.affiliation}</p>
                </div>

                <div className="w-full border-t border-slate-100 dark:border-slate-800/60" />

                {/* Editorial Philosophy Quote */}
                <div className="relative p-5 rounded-2xl bg-primary/5 border border-primary/10 overflow-hidden text-left w-full">
                  <Quote className="absolute -right-2 -bottom-2 h-16 w-16 text-primary/10 rotate-180 transform" />
                  <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5" /> Editorial Vision
                  </h4>
                  <p className="text-xs text-foreground/90 italic leading-relaxed relative z-10">
                    "{welcomeMessage}"
                  </p>
                </div>

                <div className="w-full border-t border-slate-100 dark:border-slate-800/60" />

                {/* Research Profile Links */}
                <div className="space-y-3 text-left w-full">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest pl-1">Academic Profiles</h3>
                  
                  {editor.orcid && (
                    <a 
                      href={`https://orcid.org/${editor.orcid}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all text-sm text-muted-foreground"
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="bg-primary/10 text-primary rounded-md text-[9px] font-extrabold h-4.5 px-2 flex items-center border border-primary/20">ORCID</span>
                        <span>ORCID Registry</span>
                      </span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}

                  {editor.googleScholar && (
                    <a 
                      href={editor.googleScholar} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all text-sm text-muted-foreground"
                    >
                      <span className="flex items-center gap-2.5">
                        <GraduationCap className="h-4.5 w-4.5 text-muted-foreground" />
                        <span>Google Scholar</span>
                      </span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}

                  {editor.researchGate && (
                    <a 
                      href={editor.researchGate} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all text-sm text-muted-foreground"
                    >
                      <span className="flex items-center gap-2.5">
                        <BookOpen className="h-4.5 w-4.5 text-muted-foreground" />
                        <span>ResearchGate</span>
                      </span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}

                  {editor.email && (
                    <a 
                      href={`mailto:${editor.email}`}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all text-sm text-muted-foreground"
                    >
                      <span className="flex items-center gap-2.5">
                        <Mail className="h-4.5 w-4.5 text-muted-foreground" />
                        <span>Email Contact</span>
                      </span>
                      <Mail className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right Main Panel */}
            <div className="lg:col-span-2 space-y-10">
              
              {/* Quick Metrics Dashboard */}
              <div className="grid gap-6 sm:grid-cols-3">
                {stats.map((stat, idx) => (
                  <div key={idx} className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 p-6 shadow-xs hover:shadow-md transition-all group pl-8">
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent/40 group-hover:bg-accent transition-all duration-300"></div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                    <p className="text-lg font-extrabold text-slate-800 dark:text-slate-200 mt-2 tracking-tight flex items-center gap-2">
                      {stat.label === "Status" && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                      )}
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 leading-snug">{stat.description}</p>
                  </div>
                ))}
              </div>

              {/* Specialization Scope */}
              <section className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
                  <Activity className="h-4 w-4" /> Focus Domain
                </h3>
                <p className="text-base text-foreground font-medium leading-relaxed">{editor.specialization}</p>
              </section>

              {/* Editorial Mandate / Assigned Sections & Expertise */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-l-4 border-accent pl-3">
                  <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Editorial Mandate</h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  
                  {/* Managed Sections */}
                  {editor.assignedSections && editor.assignedSections.length > 0 && (
                    <div className="p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 space-y-3.5 shadow-xs">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                        <Layers className="h-4 w-4 text-primary" /> Managed Sections
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {editor.assignedSections.map(sec => (
                          <Badge key={sec} className="bg-primary/5 text-primary border border-primary/20 hover:bg-primary/10 text-xs px-2.5 py-1 font-medium transition-colors">
                            {sec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Specialist Expertise Tags */}
                   {editor.expertise && editor.expertise.length > 0 && (
                    <div className="p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 space-y-3.5 shadow-xs">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                        <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-500" /> Specialist Expertise
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {editor.expertise.map(exp => (
                          <Link href={`/topics/${slugify(exp)}`} key={exp}>
                            <Badge variant="outline" className="hover:bg-emerald-600 hover:text-white dark:hover:text-slate-950 border-slate-200 dark:border-slate-800 hover:border-emerald-600 dark:hover:border-emerald-500 text-xs px-2.5 py-1 font-medium cursor-pointer transition-all">
                              {exp}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Biography Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 border-l-4 border-accent pl-3">
                  <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Biography</h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground space-y-4 leading-relaxed text-sm">
                  {editor.biography ? (
                    editor.biography.split('\n\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))
                  ) : (
                    <p>Biography is currently under compilation.</p>
                  )}
                </div>
              </section>

              {/* Selected Publications Section */}
              {editor.personalPublications && editor.personalPublications.length > 0 && (
                <section className="space-y-6">
                  <div className="flex items-center gap-2 border-l-4 border-accent pl-3">
                    <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Selected Publications</h2>
                  </div>
                  {editor.publicationsNote && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-slate-900/70 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 italic leading-relaxed">
                      <span className="font-semibold not-italic text-slate-800 dark:text-slate-200 mr-1">Author Name Note:</span>
                      {editor.publicationsNote}
                    </p>
                  )}
                  <div className="space-y-4">
                    {editor.personalPublications.map((pub, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-900/85 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col justify-between gap-3 group">
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug group-hover:text-primary transition-colors">
                            {pub.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            <span className="font-semibold text-slate-600 dark:text-slate-400">{pub.journal}</span> • <span>{pub.year}</span>
                          </p>
                        </div>
                        {pub.link && (
                          <a 
                            href={pub.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center text-xs font-semibold text-primary hover:underline gap-1 w-fit"
                          >
                            View Source <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Academic Timeline / Roadmap */}
              <section className="space-y-6">
                <div className="flex items-center gap-2 border-l-4 border-accent pl-3">
                  <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Academic Roadmap</h2>
                </div>

                <div className="relative pl-6 border-l border-slate-200 dark:border-slate-800 space-y-8 ml-3">
                  {timeline.map((item, index) => (
                    <div key={index} className="relative group">
                      {/* Timeline node */}
                      <div className={`absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-background dark:border-slate-950 transition-all duration-300 flex items-center justify-center shadow-xs ${
                        item.type === "education"
                          ? "bg-primary border-primary/20 scale-110"
                          : "bg-slate-300 dark:bg-slate-700 group-hover:bg-accent group-hover:border-accent/40 group-hover:scale-125"
                      }`}>
                        {item.type === "milestone" && (
                          <div className="h-1 w-1 rounded-full bg-white"></div>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest ${
                          item.type === "education"
                            ? "bg-primary/10 text-primary"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}>
                          {item.year}
                        </span>
                        <h4 className={`text-sm font-bold flex items-center gap-1.5 transition-colors ${
                          item.type === "education"
                            ? "text-primary group-hover:text-primary-dark"
                            : "text-slate-800 dark:text-slate-100 group-hover:text-accent"
                        }`}>
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Manuscript Submission CTA */}
              <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-primary/5 p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-2.5 text-center md:text-left">
                  <h3 className="text-lg font-bold text-foreground">Submit Your Research to Dr. {lastName}</h3>
                  <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
                    Dr. {lastName} is welcoming original submissions and proposal reviews in {editor.specialization.toLowerCase()}. Submit now to receive high-quality peer review and rapid publication.
                  </p>
                </div>
                <Button asChild className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-all hover:scale-[1.02] cursor-pointer">
                  <a href={`mailto:submissions@scholarlyopen.org?subject=Manuscript Submission Proposal - ${editor.journalSlug}`}>
                    <Send className="h-4 w-4 mr-2" />
                    Propose Manuscript
                  </a>
                </Button>
              </div>

              {/* Contributions Section */}
              <section className="space-y-6 pt-4">
                <div className="flex justify-between items-end flex-wrap gap-4 border-l-4 border-accent pl-3 w-full">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Scholarly Open Contributions</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Editorial activity and publication history
                    </p>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-0 font-semibold uppercase tracking-wider text-[10px] px-2.5 py-0.5">
                    Active Board Member
                  </Badge>
                </div>

                {/* Direct submissions status message (Realistic Mock Clean State) */}
                <div className="p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/10 text-center space-y-2">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Dr. {lastName} joined our board as a founding {editor.role} in 2026.
                  </p>
                  <p className="text-xs text-muted-foreground max-w-lg mx-auto leading-relaxed">
                    While the editorial board is actively coordinating upcoming peer reviews, handled manuscripts will appear here once publication rounds conclude.
                  </p>
                </div>
              </section>

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
