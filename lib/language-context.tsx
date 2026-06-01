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
    "footer.ccbyStatement": "All content is published under CC BY 4.0.",
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
    
    // Journal Page
    "journal.about": "About the Journal",
    "journal.aboutText": "Scholarly Open publishes highly relevant and FAIR-aligned research across our journals. We focus on transparent processes, rapid dissemination, and strong author support.",
    "journal.scope": "Scope & Coverage",
    "journal.sections": "Journal Sections",
    "journal.submitTo": "Submit to",
    "journal.submitText": "Please review our author guidelines and prepare your manuscript according to our submission requirements. We welcome original research, reviews, and methodological contributions that support FAIR scholarship.",
    "journal.startSubmission": "Start Submission",
    
    // About Page Content
    "about.heroTitle": "About Scholarly Open",
    "about.heroSubtitle": "We are an international open-access publisher committed to advancing scholarly communication through innovative publishing practices and unwavering commitment to research integrity.",
    "about.ourMission": "Our Mission",
    "about.missionTitle": "Democratizing Knowledge",
    "about.missionP1": "Our mission is to facilitate the global dissemination of high-quality research by providing open access to peer-reviewed scholarly articles. We believe that knowledge should not be constrained by financial or geographical barriers.",
    "about.missionP2": "We work with researchers, institutions, and funders worldwide to ensure that important discoveries in Artificial Intelligence, Clinical Medicine, Sustainability, Data Science, and Engineering reach the audiences who need them most.",
    "about.ourVision": "Our Vision",
    "about.visionTitle": "A More Open Future",
    "about.visionP1": "We envision a world where all scholarly research is freely accessible, where researchers are recognized for their contributions, and where the advancement of human knowledge benefits everyone equally.",
    "about.visionP2": "Through continuous innovation in publishing technology and processes, we strive to create a sustainable and equitable publishing ecosystem that serves the global research community.",
    
    "about.valuesTitle": "Our Core Values",
    "about.valuesSub": "These principles guide everything we do at Scholarly Open.",
    "about.value1.title": "Integrity",
    "about.value1.desc": "We uphold the highest ethical standards in scholarly publishing, ensuring transparency and accountability in all our processes.",
    "about.value2.title": "Openness",
    "about.value2.desc": "We believe knowledge should be freely accessible to all, breaking down barriers to scientific and scholarly information.",
    "about.value3.title": "Excellence",
    "about.value3.desc": "We are committed to publishing only the highest quality research through rigorous peer review and editorial oversight.",
    "about.value4.title": "Global Impact",
    "about.value4.desc": "We connect researchers across borders, fostering international collaboration and knowledge exchange.",

    "about.journeyTitle": "Our Journey",
    "about.journeySub": "Scholarly Open is a new publishing initiative. We are currently building our journal portfolio, refining our processes, and preparing our first open access publications.",
    "about.time1.title": "Foundation",
    "about.time1.desc": "Scholarly Open was established with a vision to transform scholarly publishing.",
    "about.time2.title": "Building Our Team",
    "about.time2.desc": "We assembled an editorial team, advisory board, and publishing partners to launch our journal portfolio.",
    "about.time3.title": "Developing Workflows",
    "about.time3.desc": "We are putting in place FAIR workflows, open access processes, and author support systems.",
    "about.time4.title": "Preparing for Launch",
    "about.time4.desc": "Our first journals are being prepared for publication, with compliance and indexing efforts underway.",

    "about.reachTitle": "Serving Researchers Worldwide",
    "about.reachP1": "Scholarly Open is dedicated to connecting researchers across the globe. We work with authors, reviewers, and institutions from every continent to advance scholarly communication.",
    "about.reachP2": "Our international editorial board and global network of peer reviewers ensure that research from all regions receives the attention and rigorous evaluation it deserves.",
    "about.communityTitle": "Join Our Community",
    "about.communitySub": "Whether as an author, reviewer, or editorial board member, we welcome your participation in advancing open scholarship.",
    "about.communitySubmit": "Submit Your Research",
    
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
    "footer.ccbyStatement": "Alle Inhalte werden unter CC BY 4.0 veröffentlicht.",
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
    
    // Journal Page
    "journal.about": "Über diese Zeitschrift",
    "journal.aboutText": "Scholarly Open veröffentlicht hochrelevante und FAIR-konforme Forschung in allen unseren Zeitschriften. Wir konzentrieren uns auf transparente Prozesse, schnelle Verbreitung und starke Unterstützung für Autoren.",
    "journal.scope": "Ziele & Reichweite",
    "journal.sections": "Zeitschriftenrubriken",
    "journal.submitTo": "Einreichen bei",
    "journal.submitText": "Bitte lesen Sie unsere Autorenrichtlinien und bereiten Sie Ihr Manuskript gemäß unseren Einreichungsanforderungen vor. Wir begrüßen Originalarbeiten, Reviews und methodische Beiträge, die das FAIR-Wissenschaftsprinzip unterstützen.",
    "journal.startSubmission": "Einreichung starten",
    
    // About Page Content
    "about.heroTitle": "Über Scholarly Open",
    "about.heroSubtitle": "Wir sind ein internationaler Open-Access-Verlag, der sich dafür einsetzt, die wissenschaftliche Kommunikation durch innovative Publikationspraktiken und ein unerschütterliches Engagement für die Integrität der Forschung voranzutreiben.",
    "about.ourMission": "Unsere Mission",
    "about.missionTitle": "Wissen demokratisieren",
    "about.missionP1": "Unsere Mission ist es, die weltweite Verbreitung hochwertiger Forschung durch den offenen Zugang zu peer-reviewed wissenschaftlichen Artikeln zu erleichtern. Wir glauben, dass Wissen nicht durch finanzielle oder geografische Barrieren eingeschränkt werden sollte.",
    "about.missionP2": "Wir arbeiten mit Forschern, Institutionen und Geldgebern weltweit zusammen, um sicherzustellen, dass wichtige Entdeckungen in den Bereichen Künstliche Intelligenz, Klinische Medizin, Nachhaltigkeit, Data Science und Ingenieurwesen die Zielgruppen erreichen, die sie am dringendsten benötigen.",
    "about.ourVision": "Unsere Vision",
    "about.visionTitle": "Eine offenere Zukunft",
    "about.visionP1": "Wir visionieren eine Welt, in der die gesamte wissenschaftliche Forschung frei zugänglich ist, in der Forscher für ihre Beiträge anerkannt werden und in der der Fortschritt des menschlichen Wissens allen gleichermaßen zugutekommt.",
    "about.visionP2": "Durch kontinuierliche Innovation bei Publikationstechnologien und -prozessen streben wir danach, ein nachhaltiges und gerechtes Publikations-Ökosystem zu schaffen, das der globalen Forschungsgemeinschaft dient.",
    
    "about.valuesTitle": "Unsere Grundwerte",
    "about.valuesSub": "Diese Prinzipien leiten alles, was wir bei Scholarly Open tun.",
    "about.value1.title": "Integrität",
    "about.value1.desc": "Wir wahren die höchsten ethischen Standards im wissenschaftlichen Publizieren und gewährleisten Transparenz und Rechenschaftspflicht in all unseren Prozessen.",
    "about.value2.title": "Offenheit",
    "about.value2.desc": "Wir glauben, dass Wissen für alle frei zugänglich sein sollte, und bauen Barrieren für wissenschaftliche und akademische Informationen ab.",
    "about.value3.title": "Exzellenz",
    "about.value3.desc": "Wir verpflichten uns, nur qualitativ hochwertigste Forschung durch strenges Peer-Review und redaktionelle Aufsicht zu veröffentlichen.",
    "about.value4.title": "Globale Wirkung",
    "about.value4.desc": "Wir verbinden Forscher über Grenzen hinweg und fördern die internationale Zusammenarbeit und den Wissensaustausch.",

    "about.journeyTitle": "Unsere Reise",
    "about.journeySub": "Scholarly Open ist eine neue Publikationsinitiative. Wir bauen derzeit unser Zeitschriftenportfolio auf, verfeinern unsere Prozesse und bereiten unsere ersten Open-Access-Publikationen vor.",
    "about.time1.title": "Gründung",
    "about.time1.desc": "Scholarly Open wurde mit einer Vision zur Transformation des wissenschaftlichen Publizierens gegründet.",
    "about.time2.title": "Unser Team aufbauen",
    "about.time2.desc": "Wir haben ein Redaktionsteam, einen Beirat und Verlagspartner zusammengestellt, um unser Zeitschriftenportfolio auf den Weg zu bringen.",
    "about.time3.title": "Workflows entwickeln",
    "about.time3.desc": "Wir etablieren FAIR-Workflows, Open-Access-Prozesse und Systeme zur Unterstützung von Autoren.",
    "about.time4.title": "Vorbereitung auf den Launch",
    "about.time4.desc": "Unsere ersten Zeitschriften werden für die Veröffentlichung vorbereitet, Compliance- und Indexierungsbemühungen sind im Gange.",

    "about.reachTitle": "Forschern weltweit dienen",
    "about.reachP1": "Scholarly Open widmet sich der Verbindung von Forschern auf der ganzen Welt. Wir arbeiten mit Autoren, Gutachtern und Institutionen aus allen Kontinenten zusammen, um die wissenschaftliche Kommunikation voranzutreiben.",
    "about.reachP2": "Unser internationaler Redaktionsbeirat und unser globales Netzwerk von Peer-Reviewern stellen sicher, dass Forschung aus allen Regionen die Aufmerksamkeit und strenge Bewertung erhält, die sie verdient.",
    "about.communityTitle": "Treten Sie unserer Gemeinschaft bei",
    "about.communitySub": "Ob als Autor, Gutachter oder Mitglied des Redaktionsbeirats – wir begrüßen Ihre Teilnahme an der Förderung der offenen Wissenschaft.",
    "about.communitySubmit": "Ihre Forschung einreichen",
    
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
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname
      const isDeDomain = hostname.endsWith(".de") || hostname.includes("localhost.de")
      
      const stored = localStorage.getItem("scholarly-open-language") as Language
      if (isDeDomain) {
        setLanguageState("de")
      } else if (stored && (stored === "en" || stored === "de")) {
        setLanguageState(stored)
      } else {
        setLanguageState("en")
      }
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("scholarly-open-language", lang)

    if (typeof window !== "undefined") {
      const hostname = window.location.hostname
      const pathname = window.location.pathname
      const search = window.location.search

      // Support local domain simulation (localhost.de) vs general localhost
      const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1") || hostname.includes("10.")
      const isLocalDeSim = hostname === "localhost.de"

      if (lang === "de" && !hostname.endsWith(".de") && !isLocalDeSim) {
        if (!isLocalhost) {
          window.location.href = `https://scholarlyopen.de${pathname}${search}`
        }
      } else if (lang === "en" && (hostname.endsWith(".de") || isLocalDeSim)) {
        if (!isLocalhost || isLocalDeSim) {
          const targetHost = isLocalDeSim ? "localhost" : "scholarlyopen.com"
          const protocol = isLocalDeSim ? "http" : "https"
          const port = isLocalDeSim ? ":3000" : ""
          window.location.href = `${protocol}://${targetHost}${port}${pathname}${search}`
        }
      }
    }
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

