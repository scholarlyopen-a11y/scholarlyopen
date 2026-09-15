// Official Journal Contact & Editorial Desk Reply-To Mapping for editorial360

export const JOURNAL_REPLY_TO_MAP: Record<string, string> = {
  // Exact table entries
  "Scholarly Open: Social Sciences & Humanities": "editor.socsci@scholarlyopen.org",
  "Social Sciences & Humanities": "editor.socsci@scholarlyopen.org",
  "Social Sciences": "editor.socsci@scholarlyopen.org",
  "Scholarly Open: Social Sciences Open": "editor.socsci@scholarlyopen.org",

  "Scholarly Open: Biology": "editor.bio@scholarlyopen.org",
  "Biology": "editor.bio@scholarlyopen.org",
  "Scholarly Open: Biology & Life Sciences": "editor.bio@scholarlyopen.org",

  "Scholarly Open: Chemistry": "editor.chem@scholarlyopen.org",
  "Chemistry": "editor.chem@scholarlyopen.org",

  "Scholarly Open: Medicine": "editor.med@scholarlyopen.org",
  "Medicine": "editor.med@scholarlyopen.org",
  "Scholarly Open: Medicine & Health Sciences": "editor.med@scholarlyopen.org",

  "Scholarly Open: Data Science": "editor.datasci@scholarlyopen.org",
  "Data Science": "editor.datasci@scholarlyopen.org",
  "Scholarly Open: Data Science & Analytics": "editor.datasci@scholarlyopen.org",

  "Scholarly Open: Engineering": "editor.engg@scholarlyopen.org",
  "Engineering": "editor.engg@scholarlyopen.org",
  "Scholarly Open: Engineering & Applied Sciences": "editor.engg@scholarlyopen.org",
  "Engineering & Applied Sciences": "editor.engg@scholarlyopen.org",

  "Scholarly Open: Environmental Science": "editor.environsci@scholarlyopen.org",
  "Environmental Science": "editor.environsci@scholarlyopen.org",

  "Scholarly Open: Clinical AI & Digital Health": "editor.caidh@scholarlyopen.org",
  "Clinical AI & Digital Health": "editor.caidh@scholarlyopen.org",

  "Scholarly Open: AI Safety & Governance": "editor.aisg@scholarlyopen.org",
  "AI Safety & Governance": "editor.aisg@scholarlyopen.org",

  "Scholarly Open: Decarbonization & Carbon Tech": "editor.dcct@scholarlyopen.org",
  "Decarbonization & Carbon Tech": "editor.dcct@scholarlyopen.org",

  "Scholarly Open: Quantum Engineering": "editor.qe@scholarlyopen.org",
  "Quantum Engineering": "editor.qe@scholarlyopen.org",

  "Scholarly Open: Synthetic Biology & Bio-Design": "editor.sbbd@scholarlyopen.org",
  "Synthetic Biology & Bio-Design": "editor.sbbd@scholarlyopen.org",

  "Scholarly Open: Space Resources & Orbital Economy": "editor.sroe@scholarlyopen.org",
  "Space Resources & Orbital Economy": "editor.sroe@scholarlyopen.org",
}

export const DEFAULT_EDITORIAL_EMAIL = "editorial@scholarlyopen.org"

/**
 * Returns the designated Reply-To email for a given journal.
 * Falls back to editorial@scholarlyopen.org if not found.
 */
export function getJournalReplyTo(journalName?: string): string {
  if (!journalName) return DEFAULT_EDITORIAL_EMAIL
  const trimmed = journalName.trim()
  if (JOURNAL_REPLY_TO_MAP[trimmed]) {
    return JOURNAL_REPLY_TO_MAP[trimmed]
  }

  // Case-insensitive / partial match fallback
  const lower = trimmed.toLowerCase()
  for (const [key, email] of Object.entries(JOURNAL_REPLY_TO_MAP)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return email
    }
  }

  return DEFAULT_EDITORIAL_EMAIL
}
