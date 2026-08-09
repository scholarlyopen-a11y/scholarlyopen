export interface EditorMember {
  slug: string
  name: string
  role: string
  affiliation: string
  specialization: string
  imageUrl?: string
  email?: string
  orcid?: string
  linkedin?: string
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
  publicationsNote?: string
}

export const editors: EditorMember[] = [
  {
    slug: "mohamed-eletmany",
    name: "Mohamed R. Eletmany, Ph.D.",
    role: "Associate Editor",
    affiliation: "South Valley University, Egypt",
    specialization: "Polymer chemistry, sustainable textile dyeing, molecular modeling (DFT), and surface modifications.",
    email: "editor.dcct@scholarlyopen.org",
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
    affiliation: "Shanghai Jiao Tong\nUniversity School of Medicine, China",
    specialization: "Gastrointestinal tumors, organ transplantation",
    email: "editor.med@scholarlyopen.org",
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
  },
  {
    slug: "sam-lee",
    name: "Sam Lee, M.D., Ph.D.",
    role: "Editorial Board Member",
    affiliation: "College of Doctoral Studies\nGrand Canyon University, USA",
    specialization: "Healthcare Administration, Operations and Management; Health Services Research; Medicine & Evidence-Based Medicine",
    email: "editor.med@scholarlyopen.org",
    orcid: "0009-0009-6801-4031",
    imageUrl: "/images/editors/sam-lee.png",
    assignedSections: [
      "Healthcare Administration & Quality",
      "Evidence-Based Medicine",
      "Health Services Research",
      "Clinical Operations & Analytics"
    ],
    expertise: [
      "Hospital Quality Improvement",
      "Patient Safety",
      "Predictive Analytics",
      "Healthcare Data Analytics",
      "Artificial Intelligence in Healthcare",
      "Cancer Research",
      "Neuroscience",
      "Quantitative Research"
    ],
    badges: ["Founding Member"],
    journalSlug: "medicine",
    welcomeMessage: "As an Editorial Board Member for Scholarly Open: Medicine, I am dedicated to advancing evidence-based healthcare, health outcomes research, and healthcare quality improvement. I welcome high-impact research evaluating clinical effectiveness, healthcare operations, predictive analytics, and evidence synthesis.",
    stats: [
      { label: "Status", value: "Accepting Submissions", description: "Ready to review manuscripts" },
      { label: "Avg. Turnaround", value: "21 Days", description: "From assignment to review completion" },
      { label: "Review Standard", value: "Rigorous Double-Blind", description: "Ensuring evidence-based standards" }
    ],
    timeline: [
      {
        year: "1995",
        title: "M.Sc. in Surgery",
        description: "Shanghai Jiao Tong University School of Medicine (SJTUSM), Shanghai, China. Awarded Outstanding Master's Thesis Award.",
        type: "education"
      },
      {
        year: "1998",
        title: "Ph.D. in Surgery (Medical Sciences)",
        description: "Shanghai Jiao Tong University School of Medicine (SJTUSM), Shanghai, China. Awarded Ph.D. Candidate Scholarship & NSFC Grant.",
        type: "education"
      },
      {
        year: "1998-2000",
        title: "General Surgeon & Assistant Professor",
        description: "Shanghai Institute of Digestive Surgery, Shanghai Ruijin Hospital. Over 10 years of clinical surgical practice.",
        type: "career"
      },
      {
        year: "2000-2002",
        title: "NIH Postdoctoral Fellow",
        description: "National Institutes of Health (NIH), Bethesda, MD, USA. U.S.–China Exchange Scholar in cancer biology and epigenetics.",
        type: "career"
      },
      {
        year: "2002-2005",
        title: "NIH Research Scholar Fellowship",
        description: "Eunice Kennedy Shriver National Institute of Child Health and Human Development (NICHD), NIH, Bethesda, MD, USA.",
        type: "career"
      },
      {
        year: "2005-2007",
        title: "Research Associate in Molecular Pharmacology",
        description: "St. Jude Children's Research Hospital, Memphis, TN, USA. Investigated anticancer agent mechanisms targeting topoisomerases.",
        type: "career"
      },
      {
        year: "2007-2016",
        title: "Research Associate in Genetics & Neurobiology",
        description: "University of Tennessee Health Science Center (UTHSC), Memphis, TN, USA. Created BXD mouse brain RNA-seq dataset for UCSC Genome Browser.",
        type: "career"
      },
      {
        year: "2023-Present",
        title: "Founder & Chief EBM Scientist",
        description: "Applied Clinical EBM Institute (ACEI), Honolulu, HI, USA. Leading quantitative health services research and evidence synthesis.",
        type: "career"
      },
      {
        year: "2024-Present",
        title: "DHA Candidate & Principal Investigator",
        description: "College of Doctoral Studies, Grand Canyon University, Phoenix, AZ / Honolulu, HI, USA.",
        type: "education"
      },
      {
        year: "2026",
        title: "Joined Scholarly Open",
        description: "Appointed as Editorial Board Member for Scholarly Open: Medicine.",
        type: "milestone"
      }
    ],
    biography: `Dr. Sam Lee, MD, PhD, DHA Candidate, is an accomplished physician-scientist, healthcare administrator, and evidence-based medicine researcher with over 30 years of clinical, academic, and biomedical research experience across the United States, China, and international healthcare systems. He currently serves as Principal Investigator at Grand Canyon University and is the Founder and Chief EBM Scientist at the Applied Clinical EBM Institute (ACEI) in Honolulu, Hawaii.

Currently a Doctor of Health Administration (DHA) candidate at the College of Doctoral Studies, Grand Canyon University (Phoenix, AZ / Honolulu, HI), Dr. Lee's doctoral research focuses on hospital-level organizational factors associated with risk-standardized mortality rates among U.S. acute care hospitals using publicly available CMS datasets.

Dr. Lee earned his M.D. equivalent and completed surgical specialization at Shanghai Ruijin Hospital, affiliated with Shanghai Jiao Tong University School of Medicine (SJTUSM), practicing as a licensed General Surgeon for over ten years. He holds a Master of Science (M.Sc.) and a Ph.D. in Surgery (Medical Sciences) from SJTUSM. He conducted postdoctoral biomedical research as an NIH Postdoctoral Fellow and Research Scholar at the National Institutes of Health (NIH / NICHD / NIAID) in Bethesda, MD, and served as a Research Associate at St. Jude Children's Research Hospital and the University of Tennessee Health Science Center (UTHSC).

His broad research portfolio spans evidence-based medicine (EBM), health services research, quantitative data analysis, healthcare quality improvement, cancer biology, epigenetics, and neurogenomics. Dr. Lee co-discovered Kynurenine Aminotransferase III (KAT III) and pioneered the first publicly searchable RNA-seq transcriptomic dataset for BXD mouse brains in the UCSC Genome Browser.`,
    publicationsNote: "Due to a legal name change, publications appear under his former name ZhengSheng Li and are indexed as Li, Z. or Li, D. Both names refer to the same author.",
    personalPublications: [
      {
        title: "A transposon in COMT generates mRNA variants and causes widespread expression and behavioral differences among mice",
        journal: "PLoS ONE",
        year: "2010",
        link: "https://doi.org/10.1371/journal.pone.0012181"
      },
      {
        title: "Joint mouse-human phenome-wide association to test gene function and disease risk",
        journal: "Nature Communications",
        year: "2016",
        link: "https://doi.org/10.1038/ncomms10464"
      },
      {
        title: "Using Yeast Tools to Dissect the Action of Anticancer Drugs: Mechanisms of Enzyme Inhibition and Cell Killing by Agents Targeting Topoisomerases",
        journal: "Yeast as a Tool in Cancer Research (Springer)",
        year: "2007",
        link: "https://link.springer.com/chapter/10.1007/978-1-4020-5963-6_16"
      },
      {
        title: "A promoter polymorphism in the Per3 gene is associated with alcohol and stress response",
        journal: "Translational Psychiatry",
        year: "2012",
        link: "https://www.nature.com/articles/tp201171"
      }
    ]
  },
  {
    slug: "position-open-carbon-ae-1",
    name: "Position Open",
    role: "Associate Editor",
    affiliation: "Seeking experts in decarbonization and carbon tech.",
    specialization: "Carbon Conversion & Utilization",
    journalSlug: "decarbonization-carbon-tech",
  },
  {
    slug: "position-open-carbon-ae-2",
    name: "Position Open",
    role: "Associate Editor",
    affiliation: "Seeking experts in decarbonization and carbon tech.",
    specialization: "Carbon Conversion & Utilization",
    journalSlug: "decarbonization-carbon-tech",
  },
  {
    slug: "position-open-carbon-ebm-1",
    name: "Position Open",
    role: "Editorial Board Member",
    affiliation: "Seeking experts in decarbonization and carbon tech.",
    specialization: "Carbon Conversion & Utilization",
    journalSlug: "decarbonization-carbon-tech",
  },
  {
    slug: "position-open-carbon-ebm-2",
    name: "Position Open",
    role: "Editorial Board Member",
    affiliation: "Seeking experts in decarbonization and carbon tech.",
    specialization: "Carbon Conversion & Utilization",
    journalSlug: "decarbonization-carbon-tech",
  },
  {
    slug: "position-open-med-ae-1",
    name: "Position Open",
    role: "Associate Editor",
    affiliation: "Seeking qualified experts in clinical medicine and surgery.",
    specialization: "Medicine & Health Sciences",
    journalSlug: "medicine",
  },
  {
    slug: "position-open-med-ae-2",
    name: "Position Open",
    role: "Associate Editor",
    affiliation: "Seeking qualified experts in clinical medicine and surgery.",
    specialization: "Medicine & Health Sciences",
    journalSlug: "medicine",
  },
  {
    slug: "justice-kofi-boakye-appiah",
    name: "Justice Kofi Boakye-Appiah, M.D., Ph.D.",
    role: "Editorial Board Member",
    affiliation: "Exploratory Medicine and Pharmacology,\nEli Lilly and Company, USA",
    specialization: "Obesity and chronic weight management",
    email: "editor.med@scholarlyopen.org",
    orcid: "0000-0002-5741-5165",
    linkedin: "https://www.linkedin.com/in/justice-kofi-boakye-appiah-md-phd-2a54baa1",
    googleScholar: "https://scholar.google.com/citations?user=fKlSDgQAAAAJ&hl=en",
    imageUrl: "/images/editors/justice-kofi-boakye-appiah.jpg",
    journalSlug: "medicine",
    assignedSections: [
      "Obesity & Chronic Weight Management",
      "Cardiometabolic Health & Endocrinology",
      "Clinical Pharmacology & Exploratory Medicine"
    ],
    expertise: [
      "Obesity and chronic weight management",
      "Cardiometabolic Health",
      "Clinical Pharmacology",
      "GLP-1 Therapeutics",
      "Vaccinology & Infectious Diseases",
      "Translational Medicine"
    ],
    badges: ["Founding Member"],
    welcomeMessage: "As an Editorial Board Member for Scholarly Open: Medicine, I am committed to advancing translational research, clinical pharmacology, and evidence-based interventions in cardiometabolic health and chronic weight management to improve global patient outcomes.",
    stats: [
      { label: "Status", value: "Accepting Submissions", description: "Ready to review manuscripts" },
      { label: "Avg. Turnaround", value: "21 Days", description: "From assignment to review completion" },
      { label: "Review Standard", value: "Rigorous Double-Blind", description: "Ensuring clinical excellence" }
    ],
    timeline: [
      {
        year: "2011",
        title: "BSc. Human Biology",
        description: "School of Medical Sciences, Kwame Nkrumah University of Science and Technology (KNUST), Kumasi, Ghana.",
        type: "education"
      },
      {
        year: "2014",
        title: "MD (Bachelor of Medicine, Bachelor of Surgery)",
        description: "Kwame Nkrumah University of Science and Technology (KNUST), Kumasi, Ghana.",
        type: "education"
      },
      {
        year: "2014-2016",
        title: "Physician Research Scientist / Sub-Investigator",
        description: "Kumasi Center for Collaborative Research into Tropical Medicine (KCCR), Ghana.",
        type: "career"
      },
      {
        year: "2020",
        title: "PhD in Infection and Immunity",
        description: "Institute for Infection and Immunity, St George's University of London, UK.",
        type: "education"
      },
      {
        year: "2020-2021",
        title: "Clinical Research Fellow / Sub-Investigator",
        description: "COVID-19 Vaccines & Therapeutics Clinical Trials, NIHR / University College London Hospital, UK.",
        type: "career"
      },
      {
        year: "2021-2024",
        title: "Associate Director, Vaccines Clinical R&D",
        description: "Pfizer. Lead clinician and Medical Monitor for Phase 1, 2/3 pediatric and adult COVID-19 vaccine candidates.",
        type: "career"
      },
      {
        year: "2024-Present",
        title: "Senior Director, Clinical Pharmacologist",
        description: "Exploratory Medicine and Pharmacology (E.M.P), Eli Lilly and Company, USA. Leading early-phase human studies in cardiometabolic health and obesity.",
        type: "career"
      },
      {
        year: "2025",
        title: "Postgraduate Certificate in Clinical Pharmacology",
        description: "Postgraduate Certificate in Clinical Pharmacology, Drug Development and Regulation, Tufts University, USA.",
        type: "education"
      },
      {
        year: "2026",
        title: "Joined Scholarly Open",
        description: "Appointed as Editorial Board Member for Scholarly Open: Medicine.",
        type: "milestone"
      }
    ],
    biography: `Dr. Justice Kofi Boakye-Appiah, M.D., Ph.D., is a physician-scientist and Senior Director, Clinical Pharmacologist in Exploratory Medicine and Pharmacology (E.M.P) at Eli Lilly and Company. He possesses broad expertise spanning pre-clinical, translational, early, and late Phase drug development, with a primary focus on cardiometabolic health (including obesity, diabetes, and liver disease) as well as infectious diseases, immunology, and vaccinology.

At Eli Lilly and Company, Dr. Boakye-Appiah leads early-phase (Clinical Pharmacology) human studies to establish safety, mechanism of action, and proof of concept for novel drug candidates, including GLP-1 based compounds and first-in-class siRNA molecules within the cardiometabolic portfolio. Prior to joining Eli Lilly, he served as Associate Director of Vaccines Clinical Research and Development at Pfizer, where he led research and development teams as Lead Clinician and Medical Monitor for pivotal Phase 1, 2, and 3 COVID-19 vaccine clinical trials, including the pediatric BNT162b2 Omicron vaccine.

Dr. Boakye-Appiah earned his M.D. (MBChB) and B.Sc. in Human Biology from Kwame Nkrumah University of Science and Technology (KNUST) in Ghana, and completed his Ph.D. in Infection and Immunity at St George's University of London. He also holds a Postgraduate Certificate in Clinical Pharmacology, Drug Development and Regulation from Tufts University. His research has been published in premier international medical journals, including The Lancet, PLoS Neglected Tropical Diseases, and the Journal of the Pediatric Infectious Diseases Society.`,
    personalPublications: [
      {
        title: "A composite subunit vaccine confers full protection against Buruli ulcer disease in the mouse footpad model of Mycobacterium ulcerans infection",
        journal: "PLoS Neglected Tropical Diseases",
        year: "2025",
        link: "https://doi.org/10.1371/journal.pntd.0012710"
      },
      {
        title: "Bivalent Omicron BA.4/BA.5 BNT162b2 Vaccine in 6-Month- to <12-Year-Olds",
        journal: "Journal of the Pediatric Infectious Diseases Society",
        year: "2024",
        link: "https://doi.org/10.1093/jpids/piae062"
      },
      {
        title: "Rifampicin and clarithromycin (extended release) versus rifampicin and streptomycin for limited Buruli ulcer lesions: a randomised, open-label, non-inferiority phase 3 trial",
        journal: "The Lancet",
        year: "2020",
        link: "https://doi.org/10.1016/S0140-6736(20)30047-7"
      },
      {
        title: "High prevalence of multidrug-resistant tuberculosis among patients with rifampicin resistance using gene Xpert mycobacterium tuberculosis/rifampicin in Ghana",
        journal: "International Journal of Mycobacteriology",
        year: "2016",
        link: "https://www.sciencedirect.com/science/article/pii/S2212553116300024"
      }
    ]
  },
  {
    slug: "position-open-med-ebm-2",
    name: "Position Open",
    role: "Editorial Board Member",
    affiliation: "Seeking qualified experts in clinical medicine and surgery.",
    specialization: "Medicine & Health Sciences",
    journalSlug: "medicine",
  }
,
  {
    slug: "position-open-ai-safety-governance-ae-1",
    name: "Position Open",
    role: "Associate Editor",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "ai-safety-governance",
  },
  {
    slug: "position-open-ai-safety-governance-ae-2",
    name: "Position Open",
    role: "Associate Editor",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "ai-safety-governance",
  },
  {
    slug: "position-open-ai-safety-governance-ebm-1",
    name: "Position Open",
    role: "Editorial Board Member",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "ai-safety-governance",
  },
  {
    slug: "position-open-ai-safety-governance-ebm-2",
    name: "Position Open",
    role: "Editorial Board Member",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "ai-safety-governance",
  },
  {
    slug: "position-open-biology-ae-1",
    name: "Position Open",
    role: "Associate Editor",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "biology",
  },
  {
    slug: "position-open-biology-ae-2",
    name: "Position Open",
    role: "Associate Editor",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "biology",
  },
  {
    slug: "position-open-biology-ebm-1",
    name: "Position Open",
    role: "Editorial Board Member",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "biology",
  },
  {
    slug: "position-open-biology-ebm-2",
    name: "Position Open",
    role: "Editorial Board Member",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "biology",
  },
  {
    slug: "position-open-chemistry-ae-1",
    name: "Position Open",
    role: "Associate Editor",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "chemistry",
  },
  {
    slug: "position-open-chemistry-ae-2",
    name: "Position Open",
    role: "Associate Editor",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "chemistry",
  },
  {
    slug: "position-open-chemistry-ebm-1",
    name: "Position Open",
    role: "Editorial Board Member",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "chemistry",
  },
  {
    slug: "position-open-chemistry-ebm-2",
    name: "Position Open",
    role: "Editorial Board Member",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "chemistry",
  },
  {
    slug: "position-open-clinical-ai-digital-health-ae-1",
    name: "Position Open",
    role: "Associate Editor",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "clinical-ai-digital-health",
  },
  {
    slug: "position-open-clinical-ai-digital-health-ae-2",
    name: "Position Open",
    role: "Associate Editor",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "clinical-ai-digital-health",
  },
  {
    slug: "position-open-clinical-ai-digital-health-ebm-1",
    name: "Position Open",
    role: "Editorial Board Member",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "clinical-ai-digital-health",
  },
  {
    slug: "position-open-clinical-ai-digital-health-ebm-2",
    name: "Position Open",
    role: "Editorial Board Member",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "clinical-ai-digital-health",
  },
  {
    slug: "position-open-data-science-ae-1",
    name: "Position Open",
    role: "Associate Editor",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "data-science",
  },
  {
    slug: "position-open-data-science-ae-2",
    name: "Position Open",
    role: "Associate Editor",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "data-science",
  },
  {
    slug: "position-open-data-science-ebm-1",
    name: "Position Open",
    role: "Editorial Board Member",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "data-science",
  },
  {
    slug: "position-open-data-science-ebm-2",
    name: "Position Open",
    role: "Editorial Board Member",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "data-science",
  },
  {
    slug: "position-open-engineering-ae-1",
    name: "Position Open",
    role: "Associate Editor",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "engineering",
  },
  {
    slug: "position-open-engineering-ae-2",
    name: "Position Open",
    role: "Associate Editor",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "engineering",
  },
  {
    slug: "position-open-engineering-ebm-1",
    name: "Position Open",
    role: "Editorial Board Member",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "engineering",
  },
  {
    slug: "position-open-engineering-ebm-2",
    name: "Position Open",
    role: "Editorial Board Member",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "engineering",
  },
  {
    slug: "position-open-environmental-science-ae-1",
    name: "Position Open",
    role: "Associate Editor",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "environmental-science",
  },
  {
    slug: "position-open-environmental-science-ae-2",
    name: "Position Open",
    role: "Associate Editor",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "environmental-science",
  },
  {
    slug: "position-open-environmental-science-ebm-1",
    name: "Position Open",
    role: "Editorial Board Member",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "environmental-science",
  },
  {
    slug: "position-open-environmental-science-ebm-2",
    name: "Position Open",
    role: "Editorial Board Member",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "environmental-science",
  },
  {
    slug: "position-open-quantum-engineering-ae-1",
    name: "Position Open",
    role: "Associate Editor",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "quantum-engineering",
  },
  {
    slug: "position-open-quantum-engineering-ae-2",
    name: "Position Open",
    role: "Associate Editor",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "quantum-engineering",
  },
  {
    slug: "position-open-quantum-engineering-ebm-1",
    name: "Position Open",
    role: "Editorial Board Member",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "quantum-engineering",
  },
  {
    slug: "position-open-quantum-engineering-ebm-2",
    name: "Position Open",
    role: "Editorial Board Member",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "quantum-engineering",
  },
  {
    slug: "william-harrison",
    name: "William H. Harrison, Ph.D",
    role: "Editorial Board Member",
    affiliation: "College of Liberal Arts\nFairmont State University, USA",
    specialization: "International Relations, Political Psychology, and American Government",
    assignedSections: [
      "International Relations",
      "Political Psychology",
      "American Government"
    ],
    expertise: [
      "Disproportionate voting power",
      "Religious Influence",
      "In-Group/Out-group dichotomy",
      "Non-Governmental Organizations"
    ],
    imageUrl: "/images/editors/william-harrison.jpg",
    journalSlug: "social-sciences-humanities",
    orcid: "0009-0003-5885-0112",
    linkedin: "https://www.linkedin.com/in/william-harrison-ph-d-08444117/",
    biography: "Dr. William Harrison is a Professor of Political Science at Fairmont State University. His research focuses on the disproportionate voting power in the United States, religious influence on international and American politics, in-group/out-group dichotomy, and non-governmental organizations. His dissertation explored 'Foreign Christian Influence on Developing World Domestic Social Policy', analyzing whether foreign groups are more able to influence policy in countries with lower state capacity.",
    timeline: [
      { year: "1995", title: "B.A., Political Science", description: "New York University", type: "education" },
      { year: "2002 - 2006", title: "Office Manager/Legal Assistant", description: "Joseph J. Mainiero, Esq.", type: "career" },
      { year: "2002", title: "M.A., International Relations", description: "Alliant International University", type: "education" },
      { year: "2007 - 2007", title: "Student Teacher", description: "West Virginia University", type: "career" },
      { year: "2008 - 2009", title: "Student Teacher", description: "West Virginia University", type: "career" },
      { year: "2009 - 2010", title: "Research Assistant", description: "West Virginia University", type: "career" },
      { year: "2010", title: "M.A., Political Science", description: "West Virginia University", type: "education" },
      { year: "2012", title: "Ph.D., Political Science", description: "West Virginia University", type: "education" },
      { year: "2012 - 2012", title: "Adjunct Professor", description: "Pierpont Community and Technical College", type: "career" },
      { year: "2013 - 2016", title: "Visiting Assistant Professor of Political Science", description: "Fairmont State University", type: "career" },
      { year: "2016 - Present", title: "Assistant Professor Of Political Science", description: "Fairmont State University", type: "career" },
      { year: "2019 - Present", title: "Associate Professor of Political Science", description: "Fairmont State University", type: "career" },
      { year: "2026", title: "Joined Scholarly Open", description: "Appointed as Editorial Board Member for Scholarly Open: Social Sciences & Humanities.", type: "milestone" }
    ],
    personalPublications: [
      {
        title: "Is the West Wobbling on its Democratic Pedestal",
        journal: "Two Day Hybrid International Conference on Democracy, Governance, and Sustainability",
        year: "2024"
      },
      {
        title: "2023 The Earth as a New Small Town",
        journal: "Southern Political Science Association Annual Conference",
        year: "2024"
      },
      {
        title: "Structural Regionalism in the United Nations Human Rights Council",
        journal: "North Eastern Political Science Association Annual Conference",
        year: "2021"
      },
      {
        title: "It's a Matter of Definition",
        journal: "Southern Political Science Association Annual Conference",
        year: "2018"
      },
      {
        title: "Roots of Green",
        journal: "Northeastern Political Science Association Annual Conference",
        year: "2016"
      }
    ]
  },
  {
    slug: "position-open-social-sciences-humanities-ae-2",
    name: "Position Open",
    role: "Associate Editor",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "social-sciences-humanities",
  },
  {
    slug: "position-open-social-sciences-humanities-ebm-1",
    name: "Position Open",
    role: "Editorial Board Member",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "social-sciences-humanities",
  },
  {
    slug: "position-open-social-sciences-humanities-ebm-2",
    name: "Position Open",
    role: "Editorial Board Member",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "social-sciences-humanities",
  },
  {
    slug: "position-open-social-sciences-open-ae-1",
    name: "Position Open",
    role: "Associate Editor",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "social-sciences-open",
  },
  {
    slug: "position-open-social-sciences-open-ae-2",
    name: "Position Open",
    role: "Associate Editor",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "social-sciences-open",
  },
  {
    slug: "position-open-social-sciences-open-ebm-1",
    name: "Position Open",
    role: "Editorial Board Member",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "social-sciences-open",
  },
  {
    slug: "position-open-social-sciences-open-ebm-2",
    name: "Position Open",
    role: "Editorial Board Member",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "social-sciences-open",
  },
  {
    slug: "position-open-space-resources-orbital-economy-ae-1",
    name: "Position Open",
    role: "Associate Editor",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "space-resources-orbital-economy",
  },
  {
    slug: "position-open-space-resources-orbital-economy-ae-2",
    name: "Position Open",
    role: "Associate Editor",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "space-resources-orbital-economy",
  },
  {
    slug: "position-open-space-resources-orbital-economy-ebm-1",
    name: "Position Open",
    role: "Editorial Board Member",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "space-resources-orbital-economy",
  },
  {
    slug: "position-open-space-resources-orbital-economy-ebm-2",
    name: "Position Open",
    role: "Editorial Board Member",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "space-resources-orbital-economy",
  },
  {
    slug: "position-open-synthetic-biology-bio-design-ae-1",
    name: "Position Open",
    role: "Associate Editor",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "synthetic-biology-bio-design",
  },
  {
    slug: "position-open-synthetic-biology-bio-design-ae-2",
    name: "Position Open",
    role: "Associate Editor",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "synthetic-biology-bio-design",
  },
  {
    slug: "position-open-synthetic-biology-bio-design-ebm-1",
    name: "Position Open",
    role: "Editorial Board Member",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "synthetic-biology-bio-design",
  },
  {
    slug: "position-open-synthetic-biology-bio-design-ebm-2",
    name: "Position Open",
    role: "Editorial Board Member",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "synthetic-biology-bio-design",
  },
]
