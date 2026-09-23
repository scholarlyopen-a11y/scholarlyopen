export interface EmailTemplatePlaceholder {
  key: string
  label: string
  description: string
  example: string
}

export interface EmailTemplateDefinition {
  id: string
  name: string
  category: "reviewers" | "authors" | "decisions" | "production" | "board"
  description: string
  defaultSubject: string
  defaultBody: string
  actionLabel?: string
  actionUrlPlaceholder?: string
  includeEditorial360Logo?: boolean
  placeholders: EmailTemplatePlaceholder[]
}

export const COMMON_PLACEHOLDERS: EmailTemplatePlaceholder[] = [
  { key: "recipientName", label: "Recipient Name", description: "Full name of the recipient", example: "Dr. Evelyn Vane" },
  { key: "paperId", label: "Manuscript ID", description: "Assigned manuscript identifier", example: "SOEAS-26-RS102" },
  { key: "paperTitle", label: "Manuscript Title", description: "Full title of the paper", example: "Deep Generative Modeling for Single-Cell Transcriptomics" },
  { key: "journal", label: "Journal Name", description: "Name of the journal", example: "Scholarly Open: Medicine & Applied Sciences" },
  { key: "portalUrl", label: "editorial360 Portal URL", description: "Direct link to login/portal", example: "https://www.scholarlyopen.org/editorial360" },
  { key: "editorName", label: "Editor Name", description: "Name of the handling editor or EiC", example: "Prof. Aris Thorne" },
  { key: "customMessage", label: "Custom Message / Specific Note", description: "User-specific instructions or remarks", example: "Please provide high-resolution figures and revised COI statement." },
  { key: "dueDate", label: "Target Due Date", description: "Submission or review deadline", example: "within 14 calendar days" }
]

export const DEFAULT_EMAIL_TEMPLATES: EmailTemplateDefinition[] = [
  {
    id: "invitation",
    name: "Peer Review Invitation",
    category: "reviewers",
    description: "Dispatched to prospective reviewers requesting double-blind peer evaluation.",
    defaultSubject: "Review Invitation: {{paperId}} - {{paperTitle}}",
    defaultBody: `Dear {{recipientName}},

You have been invited to serve as an expert peer reviewer for the following manuscript submitted to {{journal}}:

Manuscript ID: {{paperId}}
Title: {{paperTitle}}

{{customMessage}}

This evaluation will be conducted under double-blind peer review standards in full compliance with COPE guidelines. We kindly request that you complete your evaluation within 14 calendar days of acceptance.

Please use the buttons below to accept or decline this invitation:`,
    actionLabel: "Accept Review Invitation",
    actionUrlPlaceholder: "{{portalUrl}}?action=accept&id={{paperId}}",
    placeholders: [
      ...COMMON_PLACEHOLDERS,
      { key: "acceptUrl", label: "Accept URL", description: "One-click review acceptance URL", example: "https://www.scholarlyopen.org/editorial360?action=accept" },
      { key: "declineUrl", label: "Decline URL", description: "One-click review decline URL", example: "https://www.scholarlyopen.org/editorial360?action=decline" }
    ]
  },
  {
    id: "reviewer_reminder",
    name: "Reviewer Deadline Reminder",
    category: "reviewers",
    description: "Polite nudge sent to reviewers when a review deadline is approaching or pending.",
    defaultSubject: "Reminder: Peer Review Pending for {{paperId}}",
    defaultBody: `Dear {{recipientName}},

This is a polite reminder regarding your double-blind peer review for manuscript {{paperId}} ({{paperTitle}}) submitted to {{journal}}.

{{customMessage}}

Your timely assessment is essential to maintain rapid, rigorous editorial turnaround for the authors. If you require a brief deadline extension or encounter any technical difficulties, please let us know immediately.

You can access your reviewer scorecard through the link below:`,
    actionLabel: "Access Reviewer Scorecard",
    actionUrlPlaceholder: "{{portalUrl}}",
    placeholders: COMMON_PLACEHOLDERS
  },
  {
    id: "reviewer_welcome",
    name: "Reviewer Registry Welcome",
    category: "reviewers",
    description: "Sent to newly invited or onboarded reviewers added to the verified reviewer pool.",
    defaultSubject: "Welcome to the editorial360 verified reviewer registry",
    defaultBody: `Dear {{recipientName}},

Welcome to editorial360's verified reviewer registry. Your academic profile has been registered in the {{journal}} peer evaluation pool.

As a registered reviewer, you will receive invitation requests carefully matched to your discipline, keywords, and publication history. You maintain complete control over your workload and may set sabbatical periods at any time.

Thank you for supporting transparent, rigorous open-access peer review.`,
    actionLabel: "Access Reviewer Dashboard",
    actionUrlPlaceholder: "{{portalUrl}}",
    placeholders: COMMON_PLACEHOLDERS
  },
  {
    id: "workspace_invite",
    name: "Workspace Member Invitation",
    category: "reviewers",
    description: "Official administrative invitation dispatched to scholars and editors to join editorial360 workspace.",
    defaultSubject: "Official Invitation: Join the editorial360 Workspace as {{role}} - Scholarly Open",
    defaultBody: `Dear {{recipientName}},

You have been formally invited by the System Administration team at Scholarly Open to join the editorial360 publishing workspace.

Role Assignment: {{role}}
Scope / Portfolio: {{journal}}
Designated Email: {{recipientEmail}}

As an active {{role}} in the editorial360 ecosystem, you will have access to real-time manuscript queues, double-blind peer review tools, and automated editorial decision support adhering to COPE ethical standards.

Please use the secure button below to accept this invitation, complete your profile, and activate your workspace credentials:`,
    actionLabel: "Accept Invitation & Activate Account",
    actionUrlPlaceholder: "{{portalUrl}}?action=activate_invite&role={{roleKey}}&email={{recipientEmail}}&name={{recipientName}}",
    includeEditorial360Logo: true,
    placeholders: [
      ...COMMON_PLACEHOLDERS,
      { key: "role", label: "Assigned Role", description: "Designated role in workspace", example: "Peer Reviewer" },
      { key: "roleKey", label: "Role Identifier Key", description: "System role slug (e.g. reviewer, editor)", example: "reviewer" },
      { key: "recipientEmail", label: "Recipient Email Address", description: "Invitee email address", example: "c.zhang@scholarlyopen.org" }
    ]
  },
  {
    id: "submission_ack",
    name: "Author Submission Acknowledgment",
    category: "authors",
    description: "Sent immediately to the corresponding author upon new manuscript submission.",
    defaultSubject: "Submission Acknowledgment: {{paperId}} - {{paperTitle}}",
    defaultBody: `Dear {{recipientName}},

Thank you for submitting your manuscript to {{journal}}.

Manuscript ID: {{paperId}}
Title: {{paperTitle}}

Your paper has entered technical pre-check triage with the Journal Manager. You can track real-time editorial workflow milestones, review reports, and timeline benchmarks through your Author Workspace.

We will keep you informed as your manuscript advances through the double-blind peer review process.`,
    actionLabel: "Track Submission Status",
    actionUrlPlaceholder: "{{portalUrl}}",
    placeholders: COMMON_PLACEHOLDERS
  },
  {
    id: "precheck_query",
    name: "Technical Pre-Check Query",
    category: "authors",
    description: "Dispatched by Journal Manager when technical corrections or formatting fixes are required.",
    defaultSubject: "Technical Pre-Check Query: Action Required for {{paperId}}",
    defaultBody: `Dear {{recipientName}},

Thank you for submitting manuscript {{paperId}} ({{paperTitle}}) to {{journal}}.

During the initial technical pre-check by our editorial office, the following item(s) require your attention before the paper can proceed to editorial triage:

{{customMessage}}

Please log into your editorial360 Author Workspace and upload the corrected files or supplementary statements.`,
    actionLabel: "Upload Corrected Files",
    actionUrlPlaceholder: "{{portalUrl}}",
    placeholders: COMMON_PLACEHOLDERS
  },
  {
    id: "author_reminder",
    name: "Author Revision Reminder",
    category: "authors",
    description: "Nudge sent to author when revision and rebuttal submission is pending or due.",
    defaultSubject: "Reminder: Revision & Rebuttal Due for {{paperId}}",
    defaultBody: `Dear {{recipientName}},

This is a friendly reminder that the revision and rebuttal for your manuscript {{paperId}} ({{paperTitle}}) submitted to {{journal}} are currently pending.

{{customMessage}}

Please ensure that you upload your clean manuscript files, tracked-changes version, and point-by-point response to reviewer evaluations through the Author Portal.

If you require an extension to complete additional experimental validation or data re-analysis, please reply to this email or request an extension in the portal.`,
    actionLabel: "Upload Revised Manuscript",
    actionUrlPlaceholder: "{{portalUrl}}",
    placeholders: COMMON_PLACEHOLDERS
  },
  {
    id: "moderation_released",
    name: "Peer Review Reports Released",
    category: "authors",
    description: "Notification sent to author when anonymized peer reviews are moderated and made available.",
    defaultSubject: "Peer Review Reports Released for {{paperId}}",
    defaultBody: `Dear {{recipientName}},

The double-blind peer review evaluations for your manuscript {{paperId}} ({{paperTitle}}) submitted to {{journal}} have been moderated and released.

{{customMessage}}

You can now review the detailed reports and scorecards from the reviewers in your Author Workspace to prepare your revised manuscript and rebuttal letter.`,
    actionLabel: "View Review Reports",
    actionUrlPlaceholder: "{{portalUrl}}",
    placeholders: COMMON_PLACEHOLDERS
  },
  {
    id: "decision_accept",
    name: "Editorial Decision: Formal Acceptance",
    category: "decisions",
    description: "Official decision letter notifying the author that their manuscript has been accepted for publication.",
    defaultSubject: "Formal Acceptance Notice: {{paperId}} - {{paperTitle}}",
    defaultBody: `Dear {{recipientName}},

We are pleased to inform you that following comprehensive double-blind peer evaluation and editorial review, your manuscript has been formally ACCEPTED for publication in {{journal}}.

Manuscript ID: {{paperId}}
Title: {{paperTitle}}

{{customMessage}}

Next Steps:
1. Our production office will prepare your galley proofs and JATS XML archival packages.
2. A formal Crossref DOI will be registered upon final proof approval.
3. You will receive proofreading instructions within 5 business days.

Congratulations on the publication of your valuable scholarly contribution.

Sincerely,
{{editorName}}
Editor-in-Chief, {{journal}}`,
    actionLabel: "View Decision Dossier",
    actionUrlPlaceholder: "{{portalUrl}}",
    placeholders: COMMON_PLACEHOLDERS
  },
  {
    id: "decision_minor",
    name: "Editorial Decision: Minor Revision",
    category: "decisions",
    description: "Official decision letter requesting minor revisions and rebuttal from the author.",
    defaultSubject: "Editorial Decision: Minor Revision Required for {{paperId}}",
    defaultBody: `Dear {{recipientName}},

Thank you for submitting your manuscript to {{journal}}. The reviewers have evaluated your work and recommended MINOR REVISIONS prior to formal acceptance.

Manuscript ID: {{paperId}}
Title: {{paperTitle}}

{{customMessage}}

Please address the itemized reviewer comments and submit your revised manuscript along with a point-by-point rebuttal letter within 14 calendar days.

Sincerely,
{{editorName}}
Handling Editor, {{journal}}`,
    actionLabel: "Submit Revised Manuscript",
    actionUrlPlaceholder: "{{portalUrl}}",
    placeholders: COMMON_PLACEHOLDERS
  },
  {
    id: "decision_major",
    name: "Editorial Decision: Major Revision / Resubmit",
    category: "decisions",
    description: "Official decision letter requesting substantial revisions, additional analysis, or resubmission.",
    defaultSubject: "Editorial Decision: Major Revisions Required for {{paperId}}",
    defaultBody: `Dear {{recipientName}},

The peer evaluation for your manuscript submitted to {{journal}} is now complete. While the core findings show promise, the reviewers have identified substantial methodological and analytical areas requiring MAJOR REVISIONS.

Manuscript ID: {{paperId}}
Title: {{paperTitle}}

{{customMessage}}

Please review the detailed feedback and submit a thoroughly revised manuscript, revised data figures, and a point-by-point response letter within 28 calendar days.

Sincerely,
{{editorName}}
Handling Editor, {{journal}}`,
    actionLabel: "Submit Revisions & Rebuttal",
    actionUrlPlaceholder: "{{portalUrl}}",
    placeholders: COMMON_PLACEHOLDERS
  },
  {
    id: "decision_reject",
    name: "Editorial Decision: Formal Decline / Rejection",
    category: "decisions",
    description: "Official decision letter notifying the author that the manuscript cannot be accepted.",
    defaultSubject: "Editorial Decision: {{paperId}} - {{paperTitle}}",
    defaultBody: `Dear {{recipientName}},

Thank you for submitting your manuscript {{paperId}} ({{paperTitle}}) to {{journal}}.

Following rigorous double-blind peer evaluation and editorial assessment, we regret to inform you that we are unable to accept your manuscript for publication in this journal.

{{customMessage}}

We thank you for considering {{journal}} and wish you success in placing your work elsewhere.

Sincerely,
{{editorName}}
Editor-in-Chief, {{journal}}`,
    actionLabel: "View Evaluation Summary",
    actionUrlPlaceholder: "{{portalUrl}}",
    placeholders: COMMON_PLACEHOLDERS
  },
  {
    id: "doi_published",
    name: "Publication & DOI Notice",
    category: "production",
    description: "Sent upon final production publication with assigned Crossref DOI.",
    defaultSubject: "Publication Notice & DOI Registration: {{paperId}}",
    defaultBody: `Dear {{recipientName}},

We are pleased to announce that your article has been published online in {{journal}}!

Manuscript ID: {{paperId}}
Title: {{paperTitle}}

{{customMessage}}

Your article is now permanently archived and indexed under Open Access CC BY 4.0 licensing. You may share the link freely with your colleagues and institution.

Thank you for choosing {{journal}} as the home for your scholarly research.`,
    actionLabel: "View Published Article",
    actionUrlPlaceholder: "{{portalUrl}}",
    placeholders: COMMON_PLACEHOLDERS
  },
  {
    id: "ebm_invite",
    name: "Editorial Board Member (EBM) Invitation",
    category: "board",
    description: "Official invitation dispatched to scholars to join the journal Editorial Board.",
    defaultSubject: "Invitation to Join the Editorial Board: {{journal}}",
    defaultBody: `Dear {{recipientName}},

In recognition of your outstanding scholarship and research leadership, the Editorial Leadership of {{journal}} cordially invites you to join our distinguished Editorial Board as an Editorial Board Member (EBM).

As an Editorial Board Member, you will play a vital role in maintaining the journal's academic rigor and strategic direction.
Key responsibilities include:
• Providing expert, timely reviews for submitted manuscripts within your field (approximately 1–2 per quarter).
• Upholding COPE publication ethics and academic integrity in all decisions.
• Supporting the journal's scope, quality, and strategic development.
• Promoting the journal and encouraging high-quality submissions through academic and professional networks.
• Contributing your own high-quality scholarly work where appropriate.
• Mentoring young scientists in the peer-review process.

Term & Benefits:
• Initial 2-year renewable appointment.
• 25% discount on Article Processing Charges (APCs) for your own submissions.
• Full academic independence and official recognition on the journal masthead and web registry.

We would be honored by your acceptance. Please use the button below to confirm your appointment.`,
    actionLabel: "Accept Editorial Board Invitation",
    actionUrlPlaceholder: "https://www.scholarlyopen.org/editorial360?action=accept_board&name={{recipientName}}",
    placeholders: COMMON_PLACEHOLDERS
  },
  {
    id: "ebm_invite_de",
    name: "Editorial Board Invitation (Bilingual / German Intro)",
    category: "board",
    description: "Bilinguale Einladung mit deutscher Einführung (Arbeitssprache Englisch) für Wissenschaftler im DACH-Raum.",
    defaultSubject: "[Einladung / Invitation] Editorial Board Member: {{journal}}",
    defaultBody: `Sehr geehrte(r) Frau/Herr {{recipientName}},

im Namen des Editorial Leadership von {{journal}} und des Verlags Scholarly Open (Berlin/Deutschland) möchten wir Sie aufgrund Ihrer anerkannten Expertise herzlich einladen, unserem internationalen Editorial Board als Editorial Board Member (EBM) beizutreten.

📌 Wichtiger Hinweis zur Arbeitssprache:
Bitte beachten Sie, dass die offizielle Arbeitssprache der Zeitschrift, das Manuskript-Handling sowie alle Veröffentlichungen und Begutachtungsprozesse ausschließlich auf Englisch geführt werden (Working language & publications: English).

Nachfolgend finden Sie die formalen Aufgaben, Konditionen (u. a. 2-jährige erneuerbare Ernennung, 25% APC-Ermäßigung für eigene Einreichungen) sowie die Richtlinien gemäß COPE-Standards auf Englisch:
────────────────────────────────────────────────────
Dear {{recipientName}},

In recognition of your outstanding scholarship and research leadership, the Editorial Leadership of {{journal}} cordially invites you to join our distinguished Editorial Board as an Editorial Board Member (EBM).

Key Responsibilities & Scope:
• Providing expert, timely reviews for submitted manuscripts within your field (approx. 1–2 per quarter).
• Upholding COPE publication ethics and academic integrity in all editorial decisions.
• Supporting the journal's scope, quality, and strategic development.
• Contributing your own scholarly work where appropriate.

Term & Benefits:
• Initial 2-year renewable appointment.
• 25% discount on Article Processing Charges (APCs) for your own submissions.
• Full academic independence and official recognition on the journal masthead and web registry.

We would be honored by your acceptance. Please use the button below to confirm your appointment.`,
    actionLabel: "Accept Editorial Board Invitation",
    actionUrlPlaceholder: "https://www.scholarlyopen.org/editorial360?action=accept_board&name={{recipientName}}",
    placeholders: COMMON_PLACEHOLDERS
  },
  {
    id: "eic_invite",
    name: "Editor-in-Chief (EiC) Leadership Invitation",
    category: "board",
    description: "Executive invitation to renowned scholars to lead a journal portfolio as Editor-in-Chief.",
    defaultSubject: "Leadership Appointment: Invitation to Serve as Editor-in-Chief for {{journal}}",
    defaultBody: `Dear {{recipientName}},

The Executive Publishing Board of Scholarly Open is currently seeking a visionary academic leader to serve as Editor-in-Chief (EiC) for {{journal}}.

Given your distinguished track record and international recognition in your discipline, the nominations committee has unanimously selected you as a leading candidate for this pivotal leadership post.

As Editor-in-Chief, you will guide the strategic and editorial direction of the journal.
Key responsibilities include:
• Overseeing the peer-review process and making final decisions on manuscript acceptance.
• Collaborating with the internal editorial office to uphold strict ethical standards and COPE academic integrity.
• Leading journal development initiatives and proposing new strategic directions.
• Serving as the primary ambassador for the journal within the academic community.

Term & Benefits:
• Initial 2-year renewable appointment.
• 25% discount on Article Processing Charges (APCs) for your own submissions.
• Full academic independence and permanent recognition on the journal masthead and web registry.

We would welcome an initial discussion regarding this appointment.`,
    actionLabel: "Express Interest in Leadership Post",
    actionUrlPlaceholder: "https://www.scholarlyopen.org/editorial360?action=eic_inquiry&name={{recipientName}}",
    placeholders: COMMON_PLACEHOLDERS
  },
  {
    id: "eic_invite_de",
    name: "Editor-in-Chief Invitation (Bilingual / German Intro)",
    category: "board",
    description: "Bilinguale Einladung zur Chefredaktion mit deutscher Einführung (Arbeitssprache Englisch).",
    defaultSubject: "[Berufung / Appointment] Editor-in-Chief Leadership: {{journal}}",
    defaultBody: `Sehr geehrte(r) Frau/Herr {{recipientName}},

das Executive Publishing Board von Scholarly Open (Berlin/Deutschland) sucht für die Fachzeitschrift {{journal}} eine herausragende wissenschaftliche Führungspersönlichkeit für die Position des Editor-in-Chief (Chefredakteur/in). In Anbetracht Ihrer herausragenden wissenschaftlichen Reputation möchten wir Sie sehr gerne für diese leitende Funktion anfragen.

📌 Wichtiger Hinweis zur Arbeitssprache:
Die offizielle Publikations- und Arbeitssprache der Zeitschrift, alle redaktionellen Entscheidungen sowie die Kommunikation im Begutachtungsverfahren werden vollständig auf Englisch geführt (Working language & publications: English).

Nachfolgend finden Sie das Anforderungsprofil, die redaktionellen Leitlinien und die Rahmenbedingungen der Position auf Englisch:
────────────────────────────────────────────────────
Dear {{recipientName}},

The Executive Publishing Board of Scholarly Open is currently seeking a visionary academic leader to serve as Editor-in-Chief (EiC) for {{journal}}.

Given your distinguished track record and international recognition, the nominations committee has selected you as a leading candidate for this pivotal leadership post.

Key Responsibilities:
• Overseeing the peer-review process and making final decisions on manuscript acceptance.
• Collaborating with the editorial office to uphold strict ethical standards and COPE academic integrity.
• Leading journal development initiatives and proposing new strategic directions.

Term & Benefits:
• Initial 2-year renewable appointment.
• 25% discount on Article Processing Charges (APCs) for your own submissions.
• Full academic independence and permanent recognition on the journal masthead.

We would welcome an initial discussion regarding this appointment.`,
    actionLabel: "Express Interest in Leadership Post",
    actionUrlPlaceholder: "https://www.scholarlyopen.org/editorial360?action=eic_inquiry&name={{recipientName}}",
    placeholders: COMMON_PLACEHOLDERS
  },
  {
    id: "author_invite_cfp",
    name: "Call for Papers: Author Submission Invitation",
    category: "authors",
    description: "Dispatched to authors inviting submission of original research or reviews for the founding volume.",
    defaultSubject: "Call for Papers: Founding Volume Submission Invitation for {{journal}}",
    defaultBody: `Dear {{recipientName}},

On behalf of the editorial office of {{journal}}, we have followed your influential scholarship with great admiration.

{{journal}} is currently assembling high-impact original research articles, reviews, and rapid communications for our Founding Inaugural Volume. This foundational issue is pivotal in securing international ISSN registration and establishing our baseline citation record for upcoming indexing applications (DOAJ, Crossref, and major bibliographic registries).

In alignment with our official APC & Waiver Policy:
• Inaugural 50% Launch Discount: All accepted manuscripts in 2026 automatically receive a 50% fee discount across our entire portfolio.
• Equitable Waivers: Authors from World Bank-classified low-income countries receive a 100% full fee waiver; discretionary hardship waivers are available for unfunded researchers.
• Rigorous Double-Blind Peer Review: Expedited initial decision target within 14 days.
• Immediate Gold Open Access: Published under Creative Commons CC BY 4.0 with Crossref DOI registration upon acceptance.

Given your distinguished track record, we cordially invite you and your research team to contribute your latest findings to this founding milestone volume.

Please use the button below to submit your manuscript to our editorial desk.`,
    actionLabel: "Submit Manuscript",
    actionUrlPlaceholder: "https://www.scholarlyopen.org/submit",
    placeholders: COMMON_PLACEHOLDERS
  },
  {
    id: "author_invite_cfp_de",
    name: "Call for Papers (Bilingual / German Intro)",
    category: "authors",
    description: "Autoren-Einladung für den DACH-Raum mit deutscher Einleitung (Einreichung & Review auf Englisch).",
    defaultSubject: "[Call for Papers / Einladung] Founding Volume: {{journal}}",
    defaultBody: `Sehr geehrte(r) Frau/Herr {{recipientName}},

im Namen der Redaktion von {{journal}} (Scholarly Open, Berlin) verfolgen wir Ihre Forschungsarbeiten mit großem Interesse. Wir möchten Sie und Ihr Forschungsteam herzlich einladen, ein Originalmanuskript oder Review für unseren kommenden Gründungsband (Inaugural Volume) einzureichen.

📌 Wichtiger Hinweis zur Publikationssprache:
Bitte beachten Sie, dass alle Manuskripte, der gesamte Begutachtungsprozess sowie die finalen Open-Access-Publikationen (CC BY 4.0) auf Englisch verfasst sein müssen (Working language & publications: English).

Für den Gründungsband 2026 bieten wir einen 50%igen Erlass der Publikationsgebühren (APC) sowie ein zügiges Double-Blind Peer Review mit einer Ersteinschätzung innerhalb von 14 Tagen. Nachfolgend finden Sie alle Details und Einreichungsrichtlinien auf Englisch:
────────────────────────────────────────────────────
Dear {{recipientName}},

On behalf of the editorial office of {{journal}}, we have followed your influential scholarship with great admiration.

{{journal}} is currently assembling high-impact original research articles and reviews for our Founding Inaugural Volume.

Key Features & APC Policy:
• Inaugural 50% Launch Discount: All accepted manuscripts in 2026 receive an automatic 50% discount; full waivers available for unfunded researchers.
• Rigorous Double-Blind Peer Review: Expedited initial decision within 14 days.
• Immediate Gold Open Access: Published under CC BY 4.0 with Crossref DOI upon acceptance.
• Author Retention of Rights: You retain 100% copyright over your work and raw datasets.

We cordially invite you and your research team to submit your manuscript for consideration.`,
    actionLabel: "Submit Manuscript",
    actionUrlPlaceholder: "https://www.scholarlyopen.org/submit",
    placeholders: COMMON_PLACEHOLDERS
  },
  {
    id: "reviewer_invite_de",
    name: "Peer Review Invitation (Bilingual / German Intro)",
    category: "reviewers",
    description: "Gutachter-Einladung mit deutscher Einleitung (Gutachten & Manuskript auf Englisch).",
    defaultSubject: "[Peer Review Einladung / Review Invitation] {{paperId}} - {{paperTitle}}",
    defaultBody: `Sehr geehrte(r) Frau/Herr {{recipientName}},

das Editorial Office von {{journal}} (Scholarly Open, Berlin) lädt Sie hiermit herzlich ein, das nachfolgende wissenschaftliche Manuskript im Rahmen unseres Double-Blind Peer Review Verfahrens als Gutachter/in zu evaluieren.

📌 Wichtiger Hinweis zur Arbeitssprache:
Das Manuskript, der strukturierte Begutachtungsbogen und alle Kommentare an Autoren und Herausgeber sind in englischer Sprache verfasst und zu beantworten (Working language & evaluation reports: English).

Nachfolgend finden Sie die Manuskript-Details sowie die Links zur Bestätigung oder Ablehnung auf Englisch:
────────────────────────────────────────────────────
Dear {{recipientName}},

You have been invited to serve as an expert peer reviewer for the following manuscript submitted to {{journal}}:

Manuscript ID: {{paperId}}
Title: {{paperTitle}}

{{customMessage}}

This evaluation will be conducted under double-blind peer review standards in full compliance with COPE guidelines. We kindly request that you complete your evaluation within 14 calendar days of acceptance.

Please use the buttons below to accept or decline this invitation:`,
    actionLabel: "Accept Review Invitation",
    actionUrlPlaceholder: "{{portalUrl}}?action=accept&id={{paperId}}",
    placeholders: [
      ...COMMON_PLACEHOLDERS,
      { key: "acceptUrl", label: "Accept URL", description: "One-click review acceptance URL", example: "https://www.scholarlyopen.org/editorial360?action=accept" },
      { key: "declineUrl", label: "Decline URL", description: "One-click review decline URL", example: "https://www.scholarlyopen.org/editorial360?action=decline" }
    ]
  }
]

/**
 * Generates an initial German-language introduction for invitations (EBM, EIC, Authors, Reviewers).
 * Clarifies politely that while this initial outreach is in German, all academic work,
 * manuscript handling, peer review, and publishing are strictly in English.
 */
export function getBilingualGermanIntro(
  type: "ebm" | "eic" | "author" | "reviewer" | "general",
  recipientName: string,
  journal: string,
  extra?: { specialty?: string; institution?: string; paperId?: string }
): string {
  const salutation = recipientName ? `Sehr geehrte(r) Frau/Herr ${recipientName},` : "Sehr geehrte Kolleginnen und Kollegen,"
  const specialtyStr = extra?.specialty ? ` im Bereich ${extra.specialty}` : ""
  const instStr = extra?.institution ? ` an der ${extra.institution}` : ""

  if (type === "ebm") {
    return `${salutation}

im Namen des Editorial Leadership von ${journal} und des Verlags Scholarly Open (Berlin/Deutschland) möchten wir Sie aufgrund Ihrer anerkannten Expertise${specialtyStr}${instStr} herzlich einladen, unserem internationalen Editorial Board als Editorial Board Member (EBM) beizutreten.

📌 Wichtiger Hinweis zur Arbeitssprache:
Bitte beachten Sie, dass die offizielle Arbeitssprache der Zeitschrift, das Manuskript-Handling sowie alle Veröffentlichungen und Begutachtungsprozesse ausschließlich auf Englisch geführt werden (Working language & publications: English).

Nachfolgend finden Sie die formalen Aufgaben, Konditionen (u. a. 2-jährige erneuerbare Ernennung, 25% APC-Ermäßigung für eigene Einreichungen) sowie die Richtlinien gemäß COPE-Standards auf Englisch:
────────────────────────────────────────────────────`
  }

  if (type === "eic") {
    return `${salutation}

das Executive Publishing Board von Scholarly Open (Berlin/Deutschland) sucht für die Zeitschrift ${journal} eine herausragende wissenschaftliche Führungspersönlichkeit für die Position des Editor-in-Chief (Chefredakteur/in). In Anbetracht Ihrer herausragenden wissenschaftlichen Laufbahn${specialtyStr}${instStr} möchten wir Sie sehr gerne für diese leitende Funktion anfragen.

📌 Wichtiger Hinweis zur Arbeitssprache:
Die offizielle Publikations- und Arbeitssprache der Zeitschrift, alle redaktionellen Entscheidungen sowie die Kommunikation im Begutachtungsverfahren werden vollständig auf Englisch geführt (Working language & publications: English).

Nachfolgend finden Sie das Anforderungsprofil, die redaktionellen Leitlinien und die Rahmenbedingungen der Position auf Englisch:
────────────────────────────────────────────────────`
  }

  if (type === "author") {
    return `${salutation}

im Namen der Redaktion von ${journal} (Scholarly Open, Berlin) verfolgen wir Ihre Forschungsarbeiten${specialtyStr}${instStr} mit großem Interesse. Wir möchten Sie und Ihr Forschungsteam herzlich einladen, ein Originalmanuskript oder Review für unseren kommenden Gründungsband (Inaugural Volume) einzureichen.

📌 Wichtiger Hinweis zur Publikationssprache:
Bitte beachten Sie, dass alle Manuskripte, der gesamte Begutachtungsprozess sowie die finalen Open-Access-Publikationen (CC BY 4.0) auf Englisch verfasst sein müssen (Working language & publications: English).

Für den Gründungsband 2026 bieten wir einen 50%igen Erlass der Publikationsgebühren (APC) sowie ein zügiges Double-Blind Peer Review mit einer Ersteinschätzung innerhalb von 14 Tagen. Nachfolgend finden Sie alle Details und Einreichungsrichtlinien auf Englisch:
────────────────────────────────────────────────────`
  }

  if (type === "reviewer") {
    return `${salutation}

das Editorial Office von ${journal} (Scholarly Open, Berlin) lädt Sie hiermit herzlich ein, ein eingereichtes Fachmanuskript im Rahmen unseres Double-Blind Peer Review Verfahrens als Gutachter/in zu evaluieren.

📌 Wichtiger Hinweis zur Arbeitssprache:
Das Manuskript, der strukturierte Begutachtungsbogen und alle Kommentare an Autoren und Herausgeber sind in englischer Sprache verfasst und zu beantworten (Working language & evaluation reports: English).

Nachfolgend finden Sie den Titel des Manuskripts, die Zusammenfassung sowie die Links zur Bestätigung oder Ablehnung der Begutachtung auf Englisch:
────────────────────────────────────────────────────`
  }

  return `${salutation}

wir kontaktieren Sie im Namen von ${journal} (Scholarly Open, Berlin/Deutschland). Bitte beachten Sie, dass die Arbeitssprache unserer Fachzeitschriften und aller Begutachtungsprozesse Englisch ist. Nachfolgend finden Sie alle relevanten Details:
────────────────────────────────────────────────────`
}

/**
 * Replace placeholders like {{paperId}} in a text string
 */
export function interpolateTokens(text: string, tokens: Record<string, string>): string {
  if (!text) return ""
  return text.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (match, key) => {
    return tokens[key] !== undefined ? tokens[key] : match
  })
}

/**
 * Generates full responsive HTML email matching Scholarly Open corporate branding
 */
export function generateBrandedEmailHtml(options: {
  subject: string
  bodyText: string
  actionLabel?: string
  actionUrl?: string
  secondaryActionLabel?: string
  secondaryActionUrl?: string
  journal?: string
  paperId?: string
  paperTitle?: string
  recipientName?: string
  baseUrl?: string
  includeEditorial360Logo?: boolean
}): string {
  const {
    subject,
    bodyText,
    actionLabel,
    actionUrl,
    secondaryActionLabel,
    secondaryActionUrl,
    journal = "Scholarly Open",
    paperId,
    paperTitle,
    recipientName = "Colleague",
    baseUrl = "https://www.scholarlyopen.org",
    includeEditorial360Logo = false
  } = options

  const currentYear = new Date().getFullYear()

  // Format paragraphs nicely
  const formattedBody = bodyText
    .split(/\n\n+/)
    .map(para => {
      const trimmed = para.trim()
      if (!trimmed) return ""
      // Format lines with line breaks
      const withBreaks = trimmed.replace(/\n/g, "<br>")
      return `<p style="font-size: 14px; line-height: 1.65; color: #334155; margin: 0 0 16px 0;">${withBreaks}</p>`
    })
    .join("")

  // Optional highlight box if paper ID/title are specified
  const paperBox = (paperId && paperTitle) ? `
    <div style="background-color: #f8fafc; border-left: 4px solid #0b99ff; padding: 14px 18px; margin: 18px 0 22px 0; border-radius: 4px;">
      <div style="font-size: 11px; font-weight: 700; color: #0b99ff; text-transform: uppercase; letter-spacing: 0.5px;">Manuscript Reference: ${paperId}</div>
      <div style="font-size: 15px; font-weight: 700; color: #0f172a; margin-top: 4px; line-height: 1.4;">${paperTitle}</div>
    </div>
  ` : ""

  // Action button(s)
  let actionButtonsHtml = ""
  if (actionLabel && actionUrl) {
    actionButtonsHtml = `
      <div style="margin: 28px 0 20px 0;">
        <a href="${actionUrl}" style="background-color: #0b99ff; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 2px 4px rgba(11, 153, 255, 0.2);">
          ${actionLabel}
        </a>
        ${secondaryActionLabel && secondaryActionUrl ? `
          <a href="${secondaryActionUrl}" style="background-color: #f1f5f9; color: #475569; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-block; margin-left: 10px;">
            ${secondaryActionLabel}
          </a>
        ` : ""}
      </div>
    `
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 32px 12px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px -2px rgba(0,0,0,0.06);">
    <!-- Brand Header with Real Logos / Masthead -->
    <div style="background-color: #ffffff; padding: 20px 28px; border-bottom: 2px solid #0b99ff;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; width: 100%;">
        <tr>
          <td valign="middle" align="left" style="text-align: left; vertical-align: middle;">
            <a href="${baseUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
              <img src="${baseUrl}/logo-full-color.svg" alt="Scholarly Open" height="36" style="height: 36px; max-height: 36px; width: auto; max-width: 175px; display: block; border: 0;" onerror="this.src='/logo-full-color.svg'" />
            </a>
            <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 6px;">
              ${journal}
            </div>
          </td>
          <td valign="middle" align="right" style="text-align: right; vertical-align: middle;">
            ${includeEditorial360Logo ? `
              <a href="${baseUrl}/editorial360" target="_blank" style="text-decoration: none; display: inline-block;">
                <img src="${baseUrl}/editorial360.svg" alt="editorial360" height="28" style="height: 28px; max-height: 28px; width: auto; max-width: 140px; display: block; border: 0;" onerror="this.src='/editorial360.svg'" />
              </a>
            ` : `
              <div style="text-align: right; display: inline-block;">
                <span style="display: inline-block; padding: 4px 10px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 10px; font-weight: 700; color: #475569; letter-spacing: 0.5px; text-transform: uppercase;">
                  Editorial Office
                </span>
                <div style="font-size: 10px; color: #94a3b8; margin-top: 3px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                  Official Masthead
                </div>
              </div>
            `}
          </td>
        </tr>
      </table>
    </div>

    <!-- Email Body -->
    <div style="padding: 32px 28px 24px 28px;">
      ${paperBox}
      ${formattedBody}
      ${actionButtonsHtml}
    </div>

    <!-- Corporate / Compliance Footer -->
    <div style="background-color: #f8fafc; padding: 22px 28px; border-top: 1px solid #e2e8f0; font-size: 11px; line-height: 1.6; color: #64748b; text-align: center;">
      <div style="font-weight: 700; color: #475569; margin-bottom: 4px; font-size: 11px;">
        Scholarly Open Editorial Office • International Open Access Publishing
      </div>
      <div style="color: #64748b;">
        Rigorous Double-Blind Peer Review • Committee on Publication Ethics (COPE) Standards<br>
        &copy; ${currentYear} Scholarly Open • Open Access CC BY 4.0 • editorial360 Platform
      </div>
      <div style="margin-top: 8px;">
        <a href="${baseUrl}/editorial360" style="color: #0b99ff; text-decoration: none; font-weight: 600;">Access editorial360 Portal</a> • 
        <a href="${baseUrl}/about" style="color: #64748b; text-decoration: none;">Ethics &amp; Malpractice Policies</a>
      </div>
    </div>
  </div>
</body>
</html>`
}
