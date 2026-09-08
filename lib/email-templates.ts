export interface EmailTemplatePlaceholder {
  key: string
  label: string
  description: string
  example: string
}

export interface EmailTemplateDefinition {
  id: string
  name: string
  category: "reviewers" | "authors" | "decisions" | "production"
  description: string
  defaultSubject: string
  defaultBody: string
  actionLabel?: string
  actionUrlPlaceholder?: string
  placeholders: EmailTemplatePlaceholder[]
}

export const COMMON_PLACEHOLDERS: EmailTemplatePlaceholder[] = [
  { key: "recipientName", label: "Recipient Name", description: "Full name of the recipient", example: "Dr. Evelyn Vane" },
  { key: "paperId", label: "Manuscript ID", description: "Assigned manuscript identifier", example: "SOEAS-26-RS102" },
  { key: "paperTitle", label: "Manuscript Title", description: "Full title of the paper", example: "Deep Generative Modeling for Single-Cell Transcriptomics" },
  { key: "journal", label: "Journal Name", description: "Name of the journal", example: "Scholarly Open: Medicine & Applied Sciences" },
  { key: "portalUrl", label: "Editorial360 Portal URL", description: "Direct link to login/portal", example: "https://www.scholarlyopen.org/editorial360" },
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
    defaultSubject: "Welcome to the Scholarly Open Reviewer Registry",
    defaultBody: `Dear {{recipientName}},

Welcome to the Scholarly Open Verified Reviewer Registry. Your academic profile has been registered in the {{journal}} peer evaluation pool.

As a registered reviewer, you will receive invitation requests carefully matched to your discipline, keywords, and publication history. You maintain complete control over your workload and may set sabbatical periods at any time.

Thank you for supporting transparent, rigorous open-access peer review.`,
    actionLabel: "Access Reviewer Dashboard",
    actionUrlPlaceholder: "{{portalUrl}}",
    placeholders: COMMON_PLACEHOLDERS
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

Please log into your Editorial360 Author Workspace and upload the corrected files or supplementary statements.`,
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
  }
]

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
    baseUrl = "https://www.scholarlyopen.org"
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
    <!-- Brand Header -->
    <div style="background-color: #ffffff; padding: 22px 28px; border-bottom: 2px solid #0b99ff; display: flex; align-items: center; justify-content: space-between;">
      <div>
        <div style="font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">
          Scholarly <span style="color: #0b99ff;">Open</span>
        </div>
        <div style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px;">
          ${journal}
        </div>
      </div>
      <div style="text-align: right;">
        <span style="font-size: 10px; font-weight: 700; color: #0b99ff; background-color: #eff6ff; padding: 4px 8px; border-radius: 4px; border: 1px solid #bfdbfe; text-transform: uppercase;">
          Editorial360 System
        </span>
      </div>
    </div>

    <!-- Email Body -->
    <div style="padding: 32px 28px 24px 28px;">
      ${paperBox}
      ${formattedBody}
      ${actionButtonsHtml}
    </div>

    <!-- Corporate / Compliance Footer -->
    <div style="background-color: #f8fafc; padding: 20px 28px; border-top: 1px solid #e2e8f0; font-size: 11px; line-height: 1.6; color: #64748b; text-align: center;">
      <div style="font-weight: 600; color: #475569; margin-bottom: 4px;">
        Scholarly Open Editorial Platform • Germany & Global Publishing Registry
      </div>
      <div>
        Double-Blind Peer Review • Committee on Publication Ethics (COPE) Standards<br>
        © ${currentYear} Scholarly Open. All rights reserved. • Open Access CC BY 4.0
      </div>
      <div style="margin-top: 8px;">
        <a href="${baseUrl}/editorial360" style="color: #0b99ff; text-decoration: none; font-weight: 500;">Access Editorial360 Portal</a> • 
        <a href="${baseUrl}/about" style="color: #64748b; text-decoration: none;">Ethics & Malpractice Policies</a>
      </div>
    </div>
  </div>
</body>
</html>`
}
