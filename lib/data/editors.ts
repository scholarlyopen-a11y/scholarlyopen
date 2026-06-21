export interface EditorMember {
  slug: string
  name: string
  role: string
  affiliation: string
  specialization: string
  imageUrl?: string
  email?: string
  orcid?: string
  researchGate?: string
  googleScholar?: string
  biography?: string
  assignedSections?: string[]
  expertise?: string[]
  badges?: string[]
  journalSlug?: string // associated journal
  welcomeMessage?: string
  timeline?: {
    year: string
    title: string
    description: string
    type: "education" | "career" | "milestone"
  }[]
  stats?: {
    label: string
    value: string
    description: string
  }[]
  personalPublications?: {
    title: string
    journal: string
    year: string
    doi?: string
    link?: string
  }[]
}

export const editors: EditorMember[] = [
  {
    slug: "mohamed-eletmany",
    name: "Mohamed Ramadan Eletmany",
    role: "Associate Editor",
    affiliation: "South Valley University, Egypt",
    specialization: "Polymer chemistry, sustainable textile dyeing, molecular modeling (DFT), and surface modifications.",
    email: "mohamed.eletmany@sci.svu.edu.eg",
    orcid: "0000-0003-4868-4678",
    researchGate: "https://www.researchgate.net/profile/Mohamed-Eletmany",
    googleScholar: "https://scholar.google.com.eg/citations?user=tP25O2kAAAAJ&hl=ar",
    imageUrl: "/images/editors/mohamed-eletmany.jpg",
    assignedSections: [
      "Carbon Utilization & Conversion",
      "Industrial Decarbonization"
    ],
    expertise: [
      "Polymer Chemistry",
      "Green Chemistry",
      "Sustainable Processing",
      "Molecular Modeling (DFT)",
      "Solar Cells (DSSCs)",
      "Surface Chemistry"
    ],
    badges: ["Founding Member"],
    journalSlug: "decarbonization-carbon-tech",
    welcomeMessage: "As an associate editor, my goal is to foster a rigorous, constructive, and transparent peer-review environment. I invite researchers to submit original research and reviews in sustainable polymers, organic synthesis, and computational chemistry to help accelerate the global transition to a net-zero future.",
    stats: [
      { label: "Status", value: "Accepting Submissions", description: "Ready to assign reviewers" },
      { label: "Avg. Turnaround", value: "24 Days", description: "From submission to initial decision" },
      { label: "Review Standard", value: "Rigorous Double-Blind", description: "Ensuring top-tier academic quality" }
    ],
    timeline: [
      {
        year: "2009",
        title: "B.Sc. in Chemistry (Honors)",
        description: "Faculty of Science, South Valley University, Qena, Egypt. Graduated with top honors.",
        type: "education"
      },
      {
        year: "2015",
        title: "M.Sc. in Organic Chemistry",
        description: "South Valley University. Thesis on organic synthesis and photophysical characterization of advanced dye materials.",
        type: "education"
      },
      {
        year: "2024",
        title: "Ph.D. in Fiber and Polymer Science/Chemistry",
        description: "North Carolina State University (NCSU), USA. Doctoral research focused on green graft polymerization and sustainable materials.",
        type: "education"
      },
      {
        year: "2026",
        title: "Joined Scholarly Open",
        description: "Appointed as founding Associate Editor for Decarbonization & Carbon Tech, leading polymer and carbon conversion sections.",
        type: "milestone"
      }
    ],
    biography: `Dr. Mohamed Ramadan Eletmany is an Assistant Professor of Polymer Chemistry in the Department of Chemistry, Faculty of Science, South Valley University, Qena, Egypt. He specializes in Organic Chemistry, with a strong focus on fiber, dye, and polymer chemistry. He received his B.Sc. in Chemistry with honors from South Valley University in 2009 and his M.Sc. in Organic Chemistry in 2015. He earned his Ph.D. in Fiber and Polymer Science/Chemistry from North Carolina State University, USA, in 2024, where his doctoral research focused on the graft polymerization of multifunctional cyclic quaternary ammonium salts into cotton for sustainable dyeing.

Dr. Mohamed’s research interests span sustainable textile dyeing and finishing, polymer and fiber surface modification, molecular engineering, dye-sensitized solar cells, photophysics, electrochemistry, and computational chemistry, including DFT, TD-DFT, molecular dynamics, and Ab-initio molecular dynamics. His work integrates experimental synthesis, molecular modeling, materials characterization, and sustainable processing technologies to develop advanced dyes, polymers, and functional textile materials.

He has extensive research and technical experience in cotton dyeing and finishing, cationization of cotton, plasma- and UV-induced graft polymerization, antimicrobial textile finishes, halogen-free flame-retardant systems, water- and oil-repellent functional coatings, and color yield and fastness evaluation. His research has contributed to sustainable dyeing approaches aimed at reducing water, energy, salt, alkali, and effluent generation in textile processing.

Dr. Mohamed has participated in several national and international research projects and conferences and has authored and co-authored numerous peer-reviewed publications in organic chemistry, polymer chemistry, textile science, green chemistry, computational chemistry, and dye-sensitized solar cell research. As a journal editor, he brings broad interdisciplinary expertise in organic synthesis, polymeric materials, textile chemistry, sustainable dyeing technologies, molecular modeling, and functional materials, supporting rigorous peer review and the advancement of high-quality scientific research.`,
    personalPublications: [
      {
        title: "Push–pull carbazole twin dyads as efficient sensitizers/co-sensitizers for DSSC application: effect of various anchoring groups on photovoltaic performance",
        journal: "Journal of Materials Chemistry C",
        year: "2025",
        link: "https://doi.org/10.1039/D4TC04612A"
      },
      {
        title: "Plant starch extraction, modification, and green applications: a review",
        journal: "Environmental Chemistry Letters",
        year: "2024",
        link: "https://doi.org/10.1007/s10311-024-01753-z"
      },
      {
        title: "Concise Review of Nanomaterial Synthesis and Applications in Metal Sulphides",
        journal: "International Journal of Current Research in Science, Engineering & Technology",
        year: "2023",
        link: "https://urfpublishers.com/journal/ijcrset/open-access/concise-review-of-nanomaterial-synthesis-and-applications-in-metal-sulphides.pdf"
      },
      {
        title: "Nanotechnology-Enhanced Stem Cell Therapeutics: From Delivery and Tracking to Functional Augmentation and Regenerative Outcomes",
        journal: "International Journal of Drug Delivery Technology",
        year: "2024",
        link: "https://doi.org/10.25258/ijddt.16.48s.142"
      }
    ]

  }

]
