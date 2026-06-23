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
    name: "Mohamed R. Eletmany, Ph.D.",
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

  },
  {
    slug: "weihua-gong",
    name: "Weihua Gong, M.D., Ph.D.",
    role: "Associate Editor",
    affiliation: "Shanghai Jiao Tong University School of Medicine, China",
    specialization: "Gastrointestinal tumors, organ transplantation",
    email: "126010@sh9hospital.org.cn",
    orcid: "0000-0002-0213-7313",
    imageUrl: "/images/editors/weihua-gong.jpg",
    assignedSections: [
      "Gastrointestinal Oncology",
      "Organ Transplantation & Surgery"
    ],
    expertise: [
      "GI surgeries",
      "Gastrointestinal Tumors",
      "Organ Transplantation",
      "General Surgery",
      "Gastric Cancer",
      "Translational Medicine"
    ],
    badges: ["Founding Member"],
    journalSlug: "medicine",
    welcomeMessage: "I am pleased to welcome submissions that explore innovative approaches in gastrointestinal surgery, clinical oncology, and organ transplantation. Scholarly Open: Medicine is committed to advancing clinical practice and translational research to improve patient care globally.",
    stats: [
      { label: "Status", value: "Accepting Submissions", description: "Ready to assign reviewers" },
      { label: "Avg. Turnaround", value: "28 Days", description: "From submission to initial decision" },
      { label: "Review Standard", value: "Rigorous Double-Blind", description: "Ensuring clinical excellence" }
    ],
    timeline: [
      {
        year: "1999",
        title: "M.D. in Clinical Medicine",
        description: "Nankai University, Tianjin, China.",
        type: "education"
      },
      {
        year: "2008",
        title: "Ph.D. in Medical Sciences",
        description: "Charité-University Berlin, Germany (Magna Cum Laude).",
        type: "education"
      },
      {
        year: "2009-2012",
        title: "Research Fellow in Transplantation",
        description: "Beth Israel Deaconess Medical Center, Harvard Medical School, Boston, USA.",
        type: "career"
      },
      {
        year: "2021",
        title: "Appointed Professor",
        description: "Zhejiang University School of Medicine, China.",
        type: "career"
      },
      {
        year: "2023",
        title: "Chief Physician",
        description: "Second Affiliated Hospital of Zhejiang University School of Medicine, China.",
        type: "career"
      },
      {
        year: "2026",
        title: "Chair of General Surgery",
        description: "Department of General Surgery, Shanghai Ninth People's Hospital, Shanghai Jiao Tong University School of Medicine, China.",
        type: "career"
      },
      {
        year: "2026",
        title: "Joined Scholarly Open",
        description: "Appointed as Associate Editor for Medicine, overseeing clinical medicine, surgery, and transplantation.",
        type: "milestone"
      }
    ],
    biography: `Dr. Weihua Gong, M.D., Ph.D., is a highly distinguished surgeon and researcher who currently serves as the Chair of the Department of General Surgery at the Shanghai Ninth People's Hospital, affiliated with the Shanghai Jiao Tong University School of Medicine. Previously, he was a Professor and Chief Physician at the Second Affiliated Hospital of Zhejiang University School of Medicine, where he also served as the Vice-chairman of the Department of Surgery and the Division of GI Surgery.

Dr. Gong completed his M.D. and Master of Clinical Science at Nankai University in China, and earned his Ph.D. (Magna Cum Laude) from Charité-University Berlin (a joint school of Berlin Free University and Humboldt University) in Germany in 2008. He completed postdoctoral training and research fellowships at the Department of Surgery, University of California, Los Angeles (UCLA) and the Transplant Institute at Beth Israel Deaconess Medical Center, Harvard Medical School in Boston.

With over two decades of clinical and research experience, Dr. Gong has established himself as a leading authority in gastrointestinal tumors, organ transplantation, and GI surgeries. He is the Principal Investigator for numerous major research grants, including several from the National Natural Science Foundation of China (NSFC) and the Zhejiang Province Leading Earth Goose Program. He has authored or co-authored over 100 research papers in leading international journals (such as Autophagy, J Thorac Cardiovasc Surg, Transplantation, and Cancer Research) and has edited several books on gastric cancer, transplant medicine, and surgical cases. Dr. Gong is also an active member of professional bodies like the Chinese Surgeon Association and the International Gastric Cancer Association (IGCA).`,
    personalPublications: [
      {
        title: "Dual-Positive Gastric Cancer Co-expressing AFP and CEA: An Aggressive Subtype Defined by Unique Clinical and Biological Profiles",
        journal: "Clinical and Experimental Medicine",
        year: "2026",
        link: "https://doi.org/10.1007/s10238-026-02175-7"
      },
      {
        title: "Suppression of fibroblastic activity prolongs cardiac transplant survival through targeting their ATG5 expression",
        journal: "Journal of Thoracic and Cardiovascular Surgery",
        year: "2026",
        link: "https://doi.org/10.1016/j.jtcvs.2026.03.593"
      },
      {
        title: "Helicobacter pylori reversing the landscape of neoadjuvant immunotherapy for microsatellite stable gastric cancer: a multicenter cohort study",
        journal: "BMC Medicine",
        year: "2025",
        link: "https://doi.org/10.1186/s12916-025-04047-5"
      },
      {
        title: "Measuring lysosome damage and lysophagy in vivo",
        journal: "Autophagy",
        year: "2026",
        link: "https://doi.org/10.1080/15548627.2025.2608974"
      },
      {
        title: "Evolution of HER2 expression after neoadjuvant therapy in locally advanced gastric cancer",
        journal: "iScience",
        year: "2025",
        link: "https://doi.org/10.1016/j.isci.2025.112710"
      }
    ]
  }
]
