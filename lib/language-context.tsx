"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type Language = "en" | "de"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

export const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About",
    "nav.journals": "Journals",
    "nav.forAuthors": "For Authors",
    "nav.policies": "Policies",
    "nav.editorialBoard": "Editorial Board",
    "nav.contact": "Contact",
    "nav.submitManuscript": "Submit Manuscript",
    "nav.authorGuidelines": "Author Guidelines",
    "nav.apcFees": "APC & Fees",
    "nav.aimsScope": "Aims & Scope",
    "nav.peerReview": "Peer Review Process",
    "nav.publicationEthics": "Publication Ethics",
    "nav.openAccess": "Open Access Policy",
    "nav.goldOA": "Gold Open Access",
    "nav.hybridOA": "Hybrid Open Access",
    
    // Brand
    "brand.name": "Scholarly Open",
    "brand.tagline": "Where Research Meets FAIR Principles",
    "brand.description": "An international open-access publisher dedicated to advancing knowledge through rigorous peer review and open access.",
    
    // Hero Section
    "hero.title": "Advancing Knowledge Through Open Access",
    "hero.subtitle": "Scholarly Open is an international open-access publisher committed to disseminating high-quality research in Artificial Intelligence, Clinical Medicine, Environmental Science, Data Science, Engineering, and Social Sciences through Gold open access.",
    "hero.cta.submit": "Submit Your Research",
    "hero.cta.learn": "Learn More",
    
    // Stats
    "stats.openAccess": "Open Access",
    "stats.journals": "Journals",
    "stats.reach": "Reach",
    "stats.guidelines": "Guidelines",
    
    // Journals Section
    "journals.title": "Our Journals",
    "journals.subtitle": "We publish high-quality research across seven peer-reviewed journals, all offering Gold open access.",
    "journals.viewJournal": "View Journal",
    "journals.bio.title": "Scholarly Open: Biology",
    "journals.bio.description": "Experimental and translational biology spanning molecular, cellular, and systems research.",
    "journals.chem.title": "Scholarly Open: Chemistry",
    "journals.chem.description": "Research in chemical sciences, materials, catalysis, and sustainable chemical technologies.",
    "journals.med.title": "Scholarly Open: Medicine",
    "journals.med.description": "Clinical research, translational medicine, and healthcare innovations that advance patient outcomes.",
    "journals.ds.title": "Scholarly Open: Data Science",
    "journals.ds.description": "Data-driven research, AI-enabled analytics, statistical methods, and computational science.",
    "journals.eng.title": "Scholarly Open: Engineering",
    "journals.eng.description": "Applied engineering research across infrastructure, energy, robotics, and systems innovation.",
    "journals.env.title": "Scholarly Open: Environmental Science",
    "journals.env.description": "Interdisciplinary research in climate science, sustainability, ecosystems, and environmental policy.",
    "journals.ss.title": "Scholarly Open: Social Sciences",
    "journals.ss.description": "Research in society, behavior, policy, and interdisciplinary social science inquiry.",
    
    // Features
    "features.title": "Why Publish With Us",
    "features.subtitle": "We combine academic rigor with modern publishing practices to maximize the impact of your research.",
    "features.openAccess.title": "Open Access",
    "features.openAccess.description": "All articles freely available to readers worldwide with no subscription barriers.",
    "features.peerReview.title": "Rigorous Peer Review",
    "features.peerReview.description": "Expert-led double-blind peer review ensuring the highest quality standards.",
    "features.rapidPublication.title": "Rapid Publication",
    "features.rapidPublication.description": "Efficient editorial process with fast turnaround from submission to publication.",
    "features.editorialBoard.title": "International Editorial Board",
    "features.editorialBoard.description": "Distinguished scholars from leading institutions across the globe.",
    
    // Open Access Models
    "oaModels.title": "Open Access Publishing",
    "oaModels.subtitle": "Publishing Model",
    "oaModels.description": "We publish open access journals with immediate, permanent availability under Creative Commons licensing.",
    "oaModels.gold.title": "Gold Open Access",
    "oaModels.gold.description": "All articles are immediately and permanently free to access upon publication under a Creative Commons license.",
    "oaModels.hybrid.title": "Creative Commons Licensing",
    "oaModels.hybrid.description": "Clear reuse rights with standard open licenses (e.g., CC BY 4.0) to maximize distribution and impact.",
    "oaModels.learnMore": "Learn About Our OA Policy",
    "oaModels.accessible": "Making research accessible to all",
    "oaModels.fromMainz": "Connecting researchers worldwide",
    
    // CTA Section
    "cta.title": "Ready to Share Your Research?",
    "cta.subtitle": "Join researchers worldwide who trust Scholarly Open to publish their work with integrity and impact.",
    "cta.submit": "Submit Manuscript",
    "cta.guidelines": "Author Guidelines",
    
    // Footer
    "footer.journals": "Journals",
    "footer.forAuthors": "For Authors",
    "footer.aboutUs": "About Us",
    "footer.policies": "Policies",
    "footer.copyright": "Scholarly Open i.G. All rights reserved.",
    "footer.privacy": "Privacy Policy",
    "footer.impressum": "Impressum",
    "footer.archiving": "Archiving & Indexing",
    
    // Compliance
    "compliance.title": "Compliance & Standards",
    "compliance.doaj": "DOAJ Compliant",
    "compliance.cope": "Open Access Standards",
    "compliance.crossref": "CrossRef Registered",
    "compliance.ccby": "CC BY 4.0",
    "compliance.issn": "ISSN Registered",
    "compliance.oaspa": "OASPA Member",
    
    // Editorial Board
    "editorial.title": "Editorial Board",
    "editorial.subtitle": "Our distinguished editorial board comprises leading scholars from renowned institutions worldwide, ensuring the highest standards of peer review and editorial excellence.",
    "editorial.editorInChief": "Editor-in-Chief",
    "editorial.seniorEditors": "Senior Editors",
    "editorial.seniorEditorsSubtitle": "Our senior editors lead the editorial direction for each of our core disciplines.",
    "editorial.boardMembers": "Editorial Board Members",
    "editorial.boardMembersSubtitle": "Our editorial board members bring diverse expertise from institutions around the world.",
    "editorial.joinTeam": "Join Our Editorial Team",
    "editorial.joinTeamSubtitle": "We are always looking for distinguished scholars to join our editorial board. If you are interested in contributing to the advancement of open access, we would love to hear from you.",
    "editorial.expressInterest": "Express Interest",
    
    // About Page
    "about.title": "About Scholarly Open",
    "about.subtitle": "Scholarly Open is an international open-access publisher dedicated to advancing knowledge through rigorous peer review and open access.",
    
    // Contact
    "contact.title": "Contact Us",
    "contact.subtitle": "Get in touch with our editorial team.",
    
    // Articles
    "articles.title": "Articles",
    "articles.latest": "Latest Articles",
    "articles.sampleTitle": "Sample Articles",
    "articles.sampleNote": "These article outlines are illustrative examples for our launch journals.",
    "articles.viewAll": "View All Articles",
    "articles.readMore": "Read More",
    "articles.published": "Published",
    "articles.doi": "DOI",
    "articles.keywords": "Keywords",
    "articles.abstract": "Abstract",
    "articles.fullText": "Full Text",
    "articles.pdf": "Download PDF",
    "articles.cite": "Cite",
    
    // Language Toggle
    "language.en": "English",
    "language.de": "Deutsch",
  },
  de: {
    // Navigation
    "nav.home": "Startseite",
    "nav.about": "Über uns",
    "nav.journals": "Zeitschriften",
    "nav.forAuthors": "Für Autoren",
    "nav.policies": "Richtlinien",
    "nav.editorialBoard": "Redaktionsbeirat",
    "nav.contact": "Kontakt",
    "nav.submitManuscript": "Manuskript einreichen",
    "nav.authorGuidelines": "Autorenrichtlinien",
    "nav.apcFees": "APC & Gebühren",
    "nav.aimsScope": "Ziele & Umfang",
    "nav.peerReview": "Peer-Review-Verfahren",
    "nav.publicationEthics": "Publikationsethik",
    "nav.openAccess": "Open-Access-Richtlinie",
    "nav.goldOA": "Gold Open Access",
    "nav.hybridOA": "Hybrid Open Access",
    
    // Brand
    "brand.name": "Scholarly Open",
    "brand.tagline": "Wo Forschung auf FAIR-Prinzipien trifft",
    "brand.description": "Ein internationaler Open-Access-Verlag, der sich der Förderung von Wissen durch rigoroses Peer-Review und offenen Zugang verschrieben hat.",
    
    // Hero Section
    "hero.title": "Wissen fördern durch Open Access",
    "hero.subtitle": "Scholarly Open ist ein internationaler Open-Access-Verlag, der sich der Verbreitung hochwertiger Forschung in den Bereichen Künstliche Intelligenz, Klinische Medizin, Umweltwissenschaften, Data Science, Ingenieurwesen und Sozialwissenschaften durch Gold-Open-Access verschrieben hat.",
    "hero.cta.submit": "Ihre Forschung einreichen",
    "hero.cta.learn": "Mehr erfahren",
    
    // Stats
    "stats.openAccess": "Open Access",
    "stats.journals": "Zeitschriften",
    "stats.reach": "Reichweite",
    "stats.guidelines": "Richtlinien",
    
    // Journals Section
    "journals.title": "Unsere Zeitschriften",
    "journals.subtitle": "Wir veröffentlichen hochwertige Forschung in sieben peer-reviewed Zeitschriften mit vollständigem Gold-Open-Access.",
    "journals.viewJournal": "Zeitschrift ansehen",
    "journals.bio.title": "Scholarly Open: Biology",
    "journals.bio.description": "Experimentelle und translationale Biologie von molekularer bis systemischer Ebene.",
    "journals.chem.title": "Scholarly Open: Chemistry",
    "journals.chem.description": "Forschung in Chemie, Materialien, Katalyse und nachhaltiger Chemietechnik.",
    "journals.med.title": "Scholarly Open: Medicine",
    "journals.med.description": "Klinische Forschung, translationale Medizin und Innovationen im Gesundheitswesen.",
    "journals.ds.title": "Scholarly Open: Data Science",
    "journals.ds.description": "Datengetriebene Forschung, KI-gestützte Analytik, Statistik und rechnergestützte Wissenschaft.",
    "journals.eng.title": "Scholarly Open: Engineering",
    "journals.eng.description": "Angewandte Ingenieurswissenschaften in Infrastruktur, Energie, Robotik und Systeminnovation.",
    "journals.env.title": "Scholarly Open: Environmental Science",
    "journals.env.description": "Interdisziplinäre Forschung zu Klima, Nachhaltigkeit, Ökosystemen und Umweltpolitik.",
    "journals.ss.title": "Scholarly Open: Social Sciences",
    "journals.ss.description": "Forschung zu Gesellschaft, Verhalten, Politik und interdisziplinären Sozialwissenschaften.",
    
    // Features
    "features.title": "Warum bei uns veröffentlichen",
    "features.subtitle": "Wir verbinden akademische Strenge mit modernen Publikationspraktiken, um die Wirkung Ihrer Forschung zu maximieren.",
    "features.openAccess.title": "Open Access",
    "features.openAccess.description": "Alle Artikel weltweit frei zugänglich ohne Abonnementbarrieren.",
    "features.peerReview.title": "Rigoroses Peer-Review",
    "features.peerReview.description": "Expertengeführtes doppelblindes Peer-Review für höchste Qualitätsstandards.",
    "features.rapidPublication.title": "Schnelle Veröffentlichung",
    "features.rapidPublication.description": "Effizienter Redaktionsprozess mit schneller Bearbeitung von der Einreichung bis zur Veröffentlichung.",
    "features.editorialBoard.title": "Internationaler Redaktionsbeirat",
    "features.editorialBoard.description": "Angesehene Wissenschaftler von führenden Institutionen weltweit.",
    
    // Open Access Models
    "oaModels.title": "Open-Access-Veröffentlichung",
    "oaModels.subtitle": "Publikationsmodell",
    "oaModels.description": "Wir veröffentlichen Open-Access-Zeitschriften mit sofortiger, dauerhafter Verfügbarkeit unter Creative-Commons-Lizenzen.",
    "oaModels.gold.title": "Gold Open Access",
    "oaModels.gold.description": "Alle Artikel sind unmittelbar und dauerhaft unter einer Creative-Commons-Lizenz kostenlos zugänglich.",
    "oaModels.hybrid.title": "Creative-Commons-Lizenzierung",
    "oaModels.hybrid.description": "Klare Nutzungsrechte durch Standardlizenzen (z.B. CC BY 4.0) für maximale Verbreitung und Wirkung.",
    "oaModels.learnMore": "Mehr über unsere OA-Richtlinie",
    "oaModels.accessible": "Forschung für alle zugänglich machen",
    "oaModels.fromMainz": "Forscher weltweit verbinden",
    
    // CTA Section
    "cta.title": "Bereit, Ihre Forschung zu teilen?",
    "cta.subtitle": "Schließen Sie sich Forschern weltweit an, die Scholarly Open vertrauen, um ihre Arbeit mit Integrität und Wirkung zu veröffentlichen.",
    "cta.submit": "Manuskript einreichen",
    "cta.guidelines": "Autorenrichtlinien",
    
    // Footer
    "footer.journals": "Zeitschriften",
    "footer.forAuthors": "Für Autoren",
    "footer.aboutUs": "Über uns",
    "footer.policies": "Richtlinien",
    "footer.copyright": "Scholarly Open i.G. Alle Rechte vorbehalten.",
    "footer.privacy": "Datenschutz",
    "footer.impressum": "Impressum",
    "footer.archiving": "Archivierung & Indexierung",
    
    // Compliance
    "compliance.title": "Compliance & Standards",
    "compliance.doaj": "DOAJ-konform",
    "compliance.cope": "Open-Access-Standards",
    "compliance.crossref": "CrossRef-registriert",
    "compliance.ccby": "CC BY 4.0",
    "compliance.issn": "ISSN-registriert",
    "compliance.oaspa": "OASPA-Mitglied",
    
    // Editorial Board
    "editorial.title": "Redaktionsbeirat",
    "editorial.subtitle": "Unser angesehener Redaktionsbeirat besteht aus führenden Wissenschaftlern renommierter Institutionen weltweit und gewährleistet höchste Standards bei Peer-Review und redaktioneller Exzellenz.",
    "editorial.editorInChief": "Chefredakteur",
    "editorial.seniorEditors": "Leitende Redakteure",
    "editorial.seniorEditorsSubtitle": "Unsere leitenden Redakteure leiten die redaktionelle Ausrichtung für jede unserer Kerndisziplinen.",
    "editorial.boardMembers": "Redaktionsbeiratsmitglieder",
    "editorial.boardMembersSubtitle": "Unsere Redaktionsbeiratsmitglieder bringen vielfältige Expertise von Institutionen weltweit mit.",
    "editorial.joinTeam": "Werden Sie Teil unseres Redaktionsteams",
    "editorial.joinTeamSubtitle": "Wir suchen stets angesehene Wissenschaftler für unseren Redaktionsbeirat. Wenn Sie an der Förderung offenen Zugangs interessiert sind, würden wir gerne von Ihnen hören.",
    "editorial.expressInterest": "Interesse bekunden",
    
    // About Page
    "about.title": "Über Scholarly Open",
    "about.subtitle": "Scholarly Open ist ein internationaler Open-Access-Verlag, der sich der Förderung von Wissen durch rigoroses Peer-Review und offenen Zugang verschrieben hat.",
    
    // Contact
    "contact.title": "Kontaktieren Sie uns",
    "contact.subtitle": "Nehmen Sie Kontakt mit unserem Redaktionsteam auf.",
    
    // Articles
    "articles.title": "Artikel",
    "articles.latest": "Neueste Artikel",    "articles.sampleTitle": "Beispielartikel",
    "articles.sampleNote": "Diese Artikelangaben dienen als illustrative Beispiele für den Start unserer Zeitschriften.",    "articles.viewAll": "Alle Artikel anzeigen",
    "articles.readMore": "Weiterlesen",
    "articles.published": "Veröffentlicht",
    "articles.doi": "DOI",
    "articles.keywords": "Schlagwörter",
    "articles.abstract": "Zusammenfassung",
    "articles.fullText": "Volltext",
    "articles.pdf": "PDF herunterladen",
    "articles.cite": "Zitieren",
    
    // Language Toggle
    "language.en": "English",
    "language.de": "Deutsch",
  },
} as const

// Default translation function for SSR
const defaultT = (key: string): string => {
  const keys = translations.en as Record<string, string>
  return keys[key] || key
}

// Default context value for SSR
const defaultContextValue: LanguageContextType = {
  language: "en",
  setLanguage: () => {},
  t: defaultT,
}

const LanguageContext = createContext<LanguageContextType>(defaultContextValue)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    const stored = localStorage.getItem("scholarly-open-language") as Language
    if (stored && (stored === "en" || stored === "de")) {
      setLanguageState(stored)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("scholarly-open-language", lang)
  }

  const t = (key: string): string => {
    const keys = translations[language] as Record<string, string>
    return keys[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

