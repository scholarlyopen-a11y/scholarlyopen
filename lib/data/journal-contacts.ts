// Official 13 Journals Contact & Sender Mapping for Scholarly Open and editorial360

export interface OfficialJournal {
  name: string
  shortName: string
  email: string
  category?: string
}

export const OFFICIAL_JOURNALS: OfficialJournal[] = [
  {
    name: "Scholarly Open: Social Sciences & Humanities",
    shortName: "Social Sciences & Humanities",
    email: "editor.socsci@scholarlyopen.org",
    category: "Humanities & Social Sciences"
  },
  {
    name: "Scholarly Open: Biology",
    shortName: "Biology",
    email: "editor.bio@scholarlyopen.org",
    category: "Life Sciences"
  },
  {
    name: "Scholarly Open: Chemistry",
    shortName: "Chemistry",
    email: "editor.chem@scholarlyopen.org",
    category: "Physical Sciences"
  },
  {
    name: "Scholarly Open: Medicine",
    shortName: "Medicine",
    email: "editor.med@scholarlyopen.org",
    category: "Medical & Health"
  },
  {
    name: "Scholarly Open: Data Science",
    shortName: "Data Science",
    email: "editor.datasci@scholarlyopen.org",
    category: "Computer Science & AI"
  },
  {
    name: "Scholarly Open: Engineering",
    shortName: "Engineering",
    email: "editor.engg@scholarlyopen.org",
    category: "Engineering"
  },
  {
    name: "Scholarly Open: Environmental Science",
    shortName: "Environmental Science",
    email: "editor.environsci@scholarlyopen.org",
    category: "Earth & Environmental"
  },
  {
    name: "Scholarly Open: Clinical AI & Digital Health",
    shortName: "Clinical AI & Digital Health",
    email: "editor.caidh@scholarlyopen.org",
    category: "Applied Health & AI"
  },
  {
    name: "Scholarly Open: AI Safety & Governance",
    shortName: "AI Safety & Governance",
    email: "editor.aisg@scholarlyopen.org",
    category: "AI & Policy"
  },
  {
    name: "Scholarly Open: Decarbonization & Carbon Tech",
    shortName: "Decarbonization & Carbon Tech",
    email: "editor.dcct@scholarlyopen.org",
    category: "Climate & Energy"
  },
  {
    name: "Scholarly Open: Quantum Engineering",
    shortName: "Quantum Engineering",
    email: "editor.qe@scholarlyopen.org",
    category: "Quantum & Physics"
  },
  {
    name: "Scholarly Open: Synthetic Biology & Bio-Design",
    shortName: "Synthetic Biology & Bio-Design",
    email: "editor.sbbd@scholarlyopen.org",
    category: "Biotechnology"
  },
  {
    name: "Scholarly Open: Space Resources & Orbital Economy",
    shortName: "Space Resources & Orbital Economy",
    email: "editor.sroe@scholarlyopen.org",
    category: "Aerospace & Economy"
  }
]

export const JOURNAL_REPLY_TO_MAP: Record<string, string> = {
  // 1. Social Sciences & Humanities
  "Scholarly Open: Social Sciences & Humanities": "editor.socsci@scholarlyopen.org",
  "Social Sciences & Humanities": "editor.socsci@scholarlyopen.org",
  "Social Sciences": "editor.socsci@scholarlyopen.org",
  "Scholarly Open: Social Sciences Open": "editor.socsci@scholarlyopen.org",

  // 2. Biology
  "Scholarly Open: Biology": "editor.bio@scholarlyopen.org",
  "Biology": "editor.bio@scholarlyopen.org",
  "Scholarly Open: Biology & Life Sciences": "editor.bio@scholarlyopen.org",
  "Biology & Life Sciences": "editor.bio@scholarlyopen.org",

  // 3. Chemistry
  "Scholarly Open: Chemistry": "editor.chem@scholarlyopen.org",
  "Chemistry": "editor.chem@scholarlyopen.org",
  "Scholarly Open: Chemistry & Materials Science": "editor.chem@scholarlyopen.org",
  "Chemistry & Materials Science": "editor.chem@scholarlyopen.org",

  // 4. Medicine
  "Scholarly Open: Medicine": "editor.med@scholarlyopen.org",
  "Medicine": "editor.med@scholarlyopen.org",
  "Scholarly Open: Medicine & Health Sciences": "editor.med@scholarlyopen.org",
  "Medicine & Health Sciences": "editor.med@scholarlyopen.org",

  // 5. Data Science
  "Scholarly Open: Data Science": "editor.datasci@scholarlyopen.org",
  "Data Science": "editor.datasci@scholarlyopen.org",
  "Scholarly Open: Data Science & Artificial Intelligence": "editor.datasci@scholarlyopen.org",
  "Scholarly Open: Data Science & Analytics": "editor.datasci@scholarlyopen.org",
  "Data Science & Analytics": "editor.datasci@scholarlyopen.org",

  // 6. Engineering
  "Scholarly Open: Engineering": "editor.engg@scholarlyopen.org",
  "Engineering": "editor.engg@scholarlyopen.org",
  "Scholarly Open: Engineering & Applied Sciences": "editor.engg@scholarlyopen.org",
  "Engineering & Applied Sciences": "editor.engg@scholarlyopen.org",

  // 7. Environmental Science
  "Scholarly Open: Environmental Science": "editor.environsci@scholarlyopen.org",
  "Environmental Science": "editor.environsci@scholarlyopen.org",
  "Scholarly Open: Environmental Science & Sustainability": "editor.environsci@scholarlyopen.org",
  "Environmental Science & Sustainability": "editor.environsci@scholarlyopen.org",

  // 8. Clinical AI & Digital Health
  "Scholarly Open: Clinical AI & Digital Health": "editor.caidh@scholarlyopen.org",
  "Clinical AI & Digital Health": "editor.caidh@scholarlyopen.org",

  // 9. AI Safety & Governance
  "Scholarly Open: AI Safety & Governance": "editor.aisg@scholarlyopen.org",
  "AI Safety & Governance": "editor.aisg@scholarlyopen.org",

  // 10. Decarbonization & Carbon Tech
  "Scholarly Open: Decarbonization & Carbon Tech": "editor.dcct@scholarlyopen.org",
  "Decarbonization & Carbon Tech": "editor.dcct@scholarlyopen.org",

  // 11. Quantum Engineering
  "Scholarly Open: Quantum Engineering": "editor.qe@scholarlyopen.org",
  "Quantum Engineering": "editor.qe@scholarlyopen.org",

  // 12. Synthetic Biology & Bio-Design
  "Scholarly Open: Synthetic Biology & Bio-Design": "editor.sbbd@scholarlyopen.org",
  "Synthetic Biology & Bio-Design": "editor.sbbd@scholarlyopen.org",

  // 13. Space Resources & Orbital Economy
  "Scholarly Open: Space Resources & Orbital Economy": "editor.sroe@scholarlyopen.org",
  "Space Resources & Orbital Economy": "editor.sroe@scholarlyopen.org",
}

export const DEFAULT_EDITORIAL_EMAIL = "editorial@scholarlyopen.org"

/**
 * Returns the designated sender / reply-to email for a given journal.
 * Matches exact name, shortName, or aliases before falling back to default.
 */
export function getJournalReplyTo(journalName?: string): string {
  if (!journalName) return DEFAULT_EDITORIAL_EMAIL
  const trimmed = journalName.trim()
  if (JOURNAL_REPLY_TO_MAP[trimmed]) {
    return JOURNAL_REPLY_TO_MAP[trimmed]
  }

  // Exact match against OFFICIAL_JOURNALS
  const found = OFFICIAL_JOURNALS.find(
    j => j.name.toLowerCase() === trimmed.toLowerCase() || 
         j.shortName.toLowerCase() === trimmed.toLowerCase()
  )
  if (found) return found.email

  // Case-insensitive / partial match fallback
  const lower = trimmed.toLowerCase()
  for (const [key, email] of Object.entries(JOURNAL_REPLY_TO_MAP)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return email
    }
  }

  return DEFAULT_EDITORIAL_EMAIL
}

/**
 * Resolves full OfficialJournal object by name or alias
 */
export function getOfficialJournal(journalName?: string): OfficialJournal | undefined {
  if (!journalName) return undefined
  const email = getJournalReplyTo(journalName)
  return OFFICIAL_JOURNALS.find(j => j.email === email)
}
