import onboardedData from "./editorial-board-onboarding.json"

export interface EditorMember {
  slug: string
  name: string
  role: string
  affiliation: string
  specialization: string
  imageUrl?: string
  email?: string
  orcid?: string
  scopusId?: string
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
  editorialRoles?: string[]
  honors?: string[]
  publicationsNote?: string
}

const baseEditors: EditorMember[] = [
  {
    slug: "francis-verpoort",
    name: "Francis Verpoort, Ph.D.",
    role: "Editor-in-Chief",
    affiliation: "State Key Laboratory of Advanced Technology for Material Synthesis and Processing, Wuhan University of Technology, China",
    specialization: "Organometallic chemistry, Metal-Organic Frameworks (MOFs), Porous-Organic Polymers, catalysis, clean energy, and CO₂ capture.",
    email: "editor.chem@scholarlyopen.org",
    orcid: "0000-0002-5184-5500",
    scopusId: "7004225244",
    googleScholar: "https://scholar.google.com/citations?user=gxwFIAYAAAAJ&hl=eng",
    imageUrl: "/images/editors/francis-verpoort.png",
    journalSlug: "chemistry",
    assignedSections: [
      "Coordination & Organometallic Chemistry",
      "Metal-Organic Frameworks (MOFs) & Porous Polymers",
      "Heterogeneous & Homogeneous Catalysis",
      "CO₂ Capture, Conversion & Clean Energy",
      "Functional Hybrid Materials"
    ],
    expertise: [
      "Organometallic Chemistry",
      "Metal-Organic Frameworks (MOFs)",
      "Porous-Organic Polymers",
      "Catalysis",
      "Clean Energy",
      "CO₂ Capture",
      "Functional Materials",
      "Nanocatalysis"
    ],
    badges: [
      "Academician EASA",
      "Academician RNAS",
      "Academician AMC",
      "FRSC",
      "FICS",
      "Top 2% Scientist",
      "Highly Cited Researcher"
    ],
    welcomeMessage: "As Editor-in-Chief of Scholarly Open: Chemistry, my commitment is to advance groundbreaking discoveries in molecular architecture, sustainable catalysis, and functional materials through rigorous, transparent, and rapid peer review. We warmly invite authors worldwide to contribute original works shaping modern chemistry.",
    stats: [
      { label: "H-Index", value: "84", description: "Google Scholar Citation Index" },
      { label: "Citations", value: "25,000+", description: "Global Scientific Citations" },
      { label: "Publications", value: "500+", description: "Peer-reviewed journal papers" },
      { label: "Patents", value: "21", description: "International & commercialized patents" }
    ],
    editorialRoles: [
      "Editor-in-Chief, Chemistry Africa (Springer-Nature, 2019–present)",
      "Editor-in-Chief, Nanocatalysis (Frontiers, 2020–present)",
      "Editor, Applied Organometallic Chemistry (Wiley, 2008–present)",
      "Editor, Frontiers in Chemistry (2019–present)",
      "Editorial Board, Inorganics (MDPI, 2017–present)",
      "Editorial Board, Catalysts (MDPI, 2020–present)",
      "Editorial Board, Molecules (MDPI, 2020–present)",
      "Editorial Board, Applied Sciences (MDPI, 2019–present)",
      "Editorial Board, Advances in Materials Research (2017–present)",
      "Editorial Board, Journal of Chemistry Letters (2021–present)",
      "Advisory Board, Journal of Chemistry and Material Sciences (2024–present)",
      "Advisory Board, Frontiers in Chemical Sciences (2024–present)"
    ],
    honors: [
      "Academician of the European Academy of Sciences and Arts (EASA, 2021)",
      "Academician of the Russian Academy of Natural Sciences (RNAS, 2022)",
      "Academician of the Mexican Academy of Sciences (AMC, 2022)",
      "Academician of the World Academy of Sustainable Development",
      "National Distinguished Expert, People's Republic of China (2012)",
      "High-level Expert of the Russian Federation (2015)",
      "Appointed Officer of the Order of Leopold II by King Albert II of Belgium (2010)",
      "Elected Fellow of the Royal Society of Chemistry (FRSC, 2020)",
      "Elected Fellow of the Indian Chemical Society (FICS, 2021)",
      "Elected Fellow of the Royal Society of Arts (FRSA, 2019)",
      "Dr. Basudev Banerjee Memorial Award (Indian Chemical Society, 2019)",
      "\"Chime\" Award from Hubei Province, China (2023)",
      "Director General, World Industrial Technology Organization (WITO)",
      "Jury Chair, International Expert Council of the Palladium Global Science Award (2025)",
      "Top 2% Scientist in the World, Stanford University (5 consecutive years)",
      "Elsevier China Highly Cited Researcher (2024)"
    ],
    timeline: [
      {
        year: "1985",
        title: "B.Sc. in Industrial Chemistry",
        description: "Technical University Brugge-Oostende, Belgium (Graduated with Great Distinction).",
        type: "education"
      },
      {
        year: "1989",
        title: "B.Sc. in Chemistry",
        description: "Katholieke Universiteit Leuven (KU Leuven), Belgium.",
        type: "education"
      },
      {
        year: "1991",
        title: "M.Sc. in Inorganic Chemistry",
        description: "Ghent University, Belgium.",
        type: "education"
      },
      {
        year: "1996",
        title: "Ph.D. in Organometallics & Catalysis",
        description: "Ghent University, Belgium. Appointed Assistant Professor the same year.",
        type: "education"
      },
      {
        year: "2006",
        title: "Full Professor & Lab Director",
        description: "Promoted to Full Professor at Ghent University; Head of Lab of Organometallics and Catalysis; CEO & Founder of ViaCatt (2004–2007).",
        type: "career"
      },
      {
        year: "2010",
        title: "Officer of the Order of Leopold II",
        description: "Conferred by King Albert II of Belgium for outstanding services to the nation.",
        type: "milestone"
      },
      {
        year: "2011",
        title: "Chair Professor at Wuhan University of Technology",
        description: "State Key Laboratory of Advanced Technology for Material Synthesis and Processing; Director of Functional Hybrid Materials Laboratory.",
        type: "career"
      },
      {
        year: "2012",
        title: "National Distinguished Expert of China",
        description: "Selected under the National High-Level Talents Special Support Plan.",
        type: "milestone"
      },
      {
        year: "2019–2022",
        title: "Elected to Multiple Academies & Fellowships",
        description: "Elected Academician of EASA (2021), RNAS (2022), and AMC (2022); Fellow of RSC (2020) and ICS (2021); Banerjee Award (2019).",
        type: "milestone"
      },
      {
        year: "2023–2025",
        title: "Chime Award & WITO Director General",
        description: "Awarded Chime Award (Hubei); Director General of WITO; Elected Jury Chair of the Palladium Global Science Award (2025).",
        type: "milestone"
      },
      {
        year: "2026",
        title: "Editor-in-Chief, Scholarly Open: Chemistry",
        description: "Appointed to lead Scholarly Open: Chemistry and shape the international journal's editorial strategy and research scope.",
        type: "milestone"
      }
    ],
    biography: `Prof. Francis Verpoort, Chair Professor, State Key Laboratory of Advanced Technology for Material Synthesis and Processing, Wuhan University of Technology, China Professor Joint Institute of Chemical Research (FFMiEN), Peoples Friendship University of Russia (RUDN University), Moscow, Russia Prof. Francis Verpoort is a distinguished expert in organometallic chemistry and functional materials. He leads the Laboratory of Functional Hybrid Materials at Wuhan University of Technology and is the founder and CEO of SAIS Ltd, a company specializing in chemistry, materials, and engineering solutions. In addition to his research, Prof. Verpoort plays an active role in scientific publishing. He serves as the Editor of Applied Organometallic Chemistry, Editor-in-Chief of Chemistry Africa and Nanocatalysis, and is a member of the editorial boards of several other prestigious journals. His research focuses on organometallic chemistry, Metal-Organic Frameworks (MOFs), and Porous-Organic Polymers, with applications in catalysis, clean energy, and CO₂ capture. He has received numerous prestigious accolades, including the Dr. Basudev Banerjee Memorial Award and the “Chime” Award from Hubei Province, China. He also holds fellowships from the Royal Society of Chemistry, the Indian Chemical Society, and the International Engineering and Technology Institute. Prof. Francis Verpoort serves as Director General of the World Industrial Technology Organization (WITO), a global non-profit platform dedicated to advancing industrial technology innovation, cross-sector collaboration, and sustainable development worldwide. In 2025, he was also elected as Jury Chair of the International Expert Council of the Palladium Global Science Award (PGSA) In recognition of his outstanding contributions to science and technology, Prof. Verpoort has been elected as a member of the European Academy of Sciences and Arts, the Russian Academy of Natural Sciences, and the Mexican Academy of Sciences. Additionally, he has been designated a "National Distinguished Expert" in the People’s Republic of China.`,
    personalPublications: [
      {
        title: "Mechanism and Performance of Melamine-Based Metal-Free Organic Polymers with Modulated Nitrogen Structures for Catalyzing CO2 Cycloaddition",
        journal: "Catalysts",
        year: "2026",
        doi: "10.3390/catal16020143",
        link: "https://doi.org/10.3390/catal16020143"
      },
      {
        title: "Facile molten salt synthesis of Co@ NC catalysts enables highly efficient HMF-to-FDCA conversion under mild conditions",
        journal: "Chemical Engineering Journal",
        year: "2026",
        doi: "10.1016/j.cej.2026.172617",
        link: "https://doi.org/10.1016/j.cej.2026.172617"
      },
      {
        title: "Nature-inspired diatomic Zn-Cu pairs trigger active two OH*-involved oxygen reduction reaction",
        journal: "Nano Energy",
        year: "2025",
        doi: "10.1016/j.nanoen.2025.110861",
        link: "https://doi.org/10.1016/j.nanoen.2025.110861"
      },
      {
        title: "The Nature of Structural Defects in ZIF-8 Revealed with 1H and 31P MAS NMR and X-Ray Absorption Spectroscopy",
        journal: "Angewandte Chemie International Edition",
        year: "2025",
        doi: "10.1002/anie.202414823",
        link: "https://doi.org/10.1002/anie.202414823"
      },
      {
        title: "Metal–organic frameworks: versatile heterogeneous catalysts for efficient catalytic organic transformations",
        journal: "Chemical Society Reviews",
        year: "2015",
        doi: "10.1039/C4CS00395K",
        link: "https://doi.org/10.1039/C4CS00395K"
      },
      {
        title: "Metal organic frameworks mimicking natural enzymes: a structural and functional analogy",
        journal: "Chemical Society Reviews",
        year: "2016",
        doi: "10.1039/C6CS00047A",
        link: "https://doi.org/10.1039/C6CS00047A"
      },
      {
        title: "Rational Design of Holey 2D non-layered Transition Metal Carbide/Nitride Heterostructure Nanosheets for Highly Efficient Water Oxidation",
        journal: "Advanced Energy Materials",
        year: "2019",
        doi: "10.1002/aenm.201803768",
        link: "https://doi.org/10.1002/aenm.201803768"
      },
      {
        title: "Ruthenium-Based Olefin Metathesis Catalysts Derived from Alkynes",
        journal: "Chemical Reviews",
        year: "2010",
        doi: "10.1021/cr900346r",
        link: "https://doi.org/10.1021/cr900346r"
      }
    ]
  },
  {
    slug: "francesco-cacciola",
    name: "Francesco Cacciola, Ph.D.",
    role: "Associate Editor",
    affiliation: "Food Chemistry (SSD CHIM/10) at the University of Messina, Messina, Italy",
    specialization: "Conventional and innovative LC techniques (fast LC, LC×LC) and coupled techniques (LC×LC-MS, LC×LC-MS/MS) for the study of bioactive compounds in complex natural matrices.",
    email: "editor.chem@scholarlyopen.org",
    orcid: "0000-0003-1296-7633",
    imageUrl: "/images/editors/francesco-cacciola.png",
    journalSlug: "chemistry",
    biography: "Prof. Dr. Francesco Cacciola is Full Professor in Food Chemistry (starting from 01/10/2024) at the Dipartimento di Scienze Chimiche, Biologiche, Farmaceutiche ed Ambientali of the University of Messina, Italy. Born in Messina in December 1980, he got his High School Scientific Diploma in Messina in July 1999 (final mark: 100/100) and afterwards graduated in Pharmacy with 110/110 cum laude at the University of Messina in 2004, discussing a thesis entitled \"Micro/HPLC/ESI/MS for the determination of anthocyanins in red wines\". After graduation, from February 2005 to August 2006, he was visiting guest at the Department of Analytical Chemistry of the Faculty of Chemical Technology at the University of Pardubice (Czech Republic) for a stage sponsored by an international project (International Research Training Network) called \"Training Young Researchers in Miniaturized Comprehensive Liquid Chromatography\" (Acronym Com-Chrom) (Contract No. HPRN-CT-2001-00180) and by \"Bonino-Pulejo Foundation\" under the supervision of Prof. Ing. Pavel Jandera, DrSc. He developed innovative analytical methods for the two-dimensional separation of polyphenols in beverages and plant extracts. In December 2005 he obtained the qualification to be a pharmacist.\n\nHe received his Ph.D. in \"Food and Safety Chemistry\" at the University of Messina in 2009, defending a thesis entitled \"Employment of High Resolution HPLC Techniques for the Analysis of Complex Matrices\". In 2009 he was awarded a scholarship to work for one year as post-doctoral fellow at the Center for Food Safety and Applied Nutrition (CFSAN), Food and Drug Administration (FDA) in College Park, Maryland, USA, under the supervision of Dr. Jeanne Rader. During his research stay, he worked on the characterization of bioactive compounds contained in Stevia rebaudiana extracts by two-dimensional liquid chromatography. From February 2011 to January 2012, he was awarded a scholarship by the Society Chromaleont s.r.l., a spin-off of the University of Messina, for the characterization of polyphenols and the investigation of innovative stationary phases. These researches were performed at the Dipartimento Farmaco-Chimico according to the convention between such Society and \"The Mediterranean Separation Foundation Research and Training Center\" belonging to the Dipartimento Farmaco-Chimico of the University of Messina. He currently teaches several courses devoted to Food Chemistry at the University of Messina.\n\nHe won the \"Young Researchers award\" in 2008 for the scientific productivity carried out in 2007. He also won two travel grants to attend the \"National Symposium on Food Chemistry\" in Perugia (Italy) in 2008 and \"HPLC 2009\" in Dresden (Germany) in 2009, respectively. In September 2018, the international scientific journal \"The Analytical Scientist\" included him in the international list of the 40 most influential scientists \"under 40\" in the Analytical Sciences (Analytical Scientist's 2018 Power List \"Top 40 under 40\") for the application of advanced analytical techniques to the characterization of food and natural products. From 2018: Listed among the Top Italian Scientists according to Google Scholar Database (with h-index >= 30). From 2023, he has been included in the list, made by Stanford University and Elsevier, among the top 2% of Scientists from all over the world in \"Chemistry\". According to Research.com, for the 2026 Edition of Ranking of Best Scientists in the field of Chemistry, he has been ranked 459 in Italy and 13075 in the world.\n\nUp to September 8th, 2026, he is author and co-author of 291 articles published (275 in indexed international scientific journals), 16 book chapters edited by international publishers, 5 abstracts in international journals and 3 in-extenso contributions in national symposia. He is also author and co-author of 156 oral (32 invited lectures) and 147 poster communications in national and international symposia.\n\nBibliometric Parameters (as of September 2026):\n• Total citations: 10,970 (Google Scholar); 8,272 (Scopus)\n• H-Index: 56 (Google Scholar); 49 (Scopus)\n• Total Impact Factor: 1,074 (reference IF 2025; 935 publication year IF)\n• Average Impact Factor: 4.0 (3.4 publication year IF)",
    expertise: [
      "Conventional & innovative LC techniques (fast LC, LC×LC)",
      "Coupled techniques (LC×LC-MS, LC×LC-MS/MS)",
      "Food chemistry",
      "Bioactive compounds in complex natural matrices",
      "Polyphenols & carotenoids",
      "Lipidomics (triacylglycerols & phospholipids)",
      "Phytochemistry & metabolomics",
      "Food quality, authenticity & safety"
    ],
    badges: [
      "Full Professor",
      "Top 2% Scientist",
      "Top 40 under 40",
      "Top Italian Scientists"
    ],
    stats: [
      { label: "Citations", value: "10,970+", description: "Google Scholar (8,272 on Scopus)" },
      { label: "H-Index", value: "56", description: "Google Scholar (49 on Scopus)" },
      { label: "Publications", value: "291+", description: "275 indexed international journal papers" },
      { label: "Impact Factor", value: "1,074", description: "Cumulative Journal Impact Factor" }
    ],
    honors: [
      "Full Professor in Food Chemistry (SSD CHIM/10), University of Messina (2024–present)",
      "Stanford University & Elsevier Top 2% Scientist in Chemistry (2023–present)",
      "The Analytical Scientist's 2018 Power List: Top 40 Under 40 in Analytical Sciences",
      "Ranked #459 in Italy & #13,075 Worldwide in Chemistry (Research.com 2026)",
      "Listed among Top Italian Scientists (Google Scholar Database, h-index ≥ 30)",
      "Young Researchers Award (2008)"
    ],
    editorialRoles: [
      "Associate Editor, Molecules (MDPI, 2026–present; Editorial Board 2019–2026)",
      "Editorial Advisory Board, Chemistry & Biodiversity (Wiley, 2026–present)",
      "Editorial Board, Journal of Chromatography A (Elsevier, 2025–present)",
      "Editorial Board, International Journal of Food Properties (Taylor & Francis, 2026–present)",
      "Editorial Board, Journal of Essential Oil Research (Taylor & Francis, 2017–present)",
      "Member of the President's Technical Secretariat, Italian Chemical Society (SCI, 2026–2028)",
      "Associate Editor, Scholarly Open: Chemistry (2026–present)"
    ],
    timeline: [
      {
        year: "2004",
        title: "Master Degree in Pharmacy (Laurea)",
        description: "Graduated with 110/110 magna cum laude at the University of Messina, defending a thesis on Micro-HPLC-ESI-MS determination of anthocyanins in red wines.",
        type: "education"
      },
      {
        year: "2005",
        title: "Licensed Pharmacist Qualification",
        description: "Passed the Italian National State Board Examination, obtaining professional qualification as a Pharmacist.",
        type: "milestone"
      },
      {
        year: "2005–2006",
        title: "Visiting Scholar, University of Pardubice (Czech Republic)",
        description: "Stage funded by the EU 'Com-Chrom' network (HPRN-CT-2001-00180) and Bonino-Pulejo Foundation under Prof. Ing. Pavel Jandera, developing 2D-LC separation methods for polyphenols.",
        type: "education"
      },
      {
        year: "2009",
        title: "Ph.D. in Food Chemistry and Safety",
        description: "Doctorate awarded by the University of Messina, defending a doctoral thesis entitled 'Employment of High Resolution HPLC Techniques for the Analysis of Complex Matrices'.",
        type: "education"
      },
      {
        year: "2009–2010",
        title: "Visiting Post-Doctoral Fellow, U.S. FDA (CFSAN)",
        description: "Awarded scholarship at the Center for Food Safety and Applied Nutrition, U.S. Food and Drug Administration (College Park, MD, USA) under Dr. Jeanne Rader, characterizing bioactive compounds in Stevia rebaudiana.",
        type: "career"
      },
      {
        year: "2011–2012",
        title: "Post-Doctoral Fellow, Chromaleont S.r.l. & Univ. of Messina",
        description: "Research scholarship with University of Messina spin-off Chromaleont S.r.l. and the Mediterranean Separation Foundation on polyphenols and innovative stationary phases.",
        type: "career"
      },
      {
        year: "2012–2017",
        title: "Assistant Professor in Food Chemistry (SSD CHIM/10)",
        description: "Faculty appointment (RTD-A and RTD-B Tenure Track) in Food Chemistry at the University of Messina, teaching food analysis and advanced chromatographic instrumentation.",
        type: "career"
      },
      {
        year: "2017–2024",
        title: "Associate Professor in Food Chemistry (SSD CHIM/10)",
        description: "Tenured Associate Professor at the Department of Chemical, Biological, Pharmaceutical and Environmental Sciences, University of Messina.",
        type: "career"
      },
      {
        year: "2018",
        title: "The Analytical Scientist's 'Top 40 Under 40'",
        description: "Included in the international Power List of the 40 most influential analytical scientists under 40 worldwide; also recognized among Top Italian Scientists (h-index ≥ 30).",
        type: "milestone"
      },
      {
        year: "2023–Present",
        title: "Stanford/Elsevier World's Top 2% Scientist",
        description: "Ranked among the top 2% of scientists globally in Chemistry; ranked #459 in Italy by Research.com (2026).",
        type: "milestone"
      },
      {
        year: "2024–Present",
        title: "Full Professor in Food Chemistry (SSD CHIM/10)",
        description: "Full Professor at the Department of Chemical, Biological, Pharmaceutical and Environmental Sciences, University of Messina.",
        type: "career"
      },
      {
        year: "2026",
        title: "Associate Editor, Scholarly Open: Chemistry",
        description: "Appointed Associate Editor overseeing food chemistry, analytical separations, and natural product characterization.",
        type: "milestone"
      }
    ],
    personalPublications: [
      {
        title: "Scouting of different separation strategies for phenolic compounds in comprehensive two-dimensional liquid chromatography",
        journal: "Journal of Chromatography A",
        year: "2026",
        doi: "10.1016/j.chroma.2025.466654",
        link: "https://doi.org/10.1016/j.chroma.2025.466654"
      },
      {
        title: "QSRR-based insights into the chromatographic behaviour of phenolic derivatives on biomimetic stationary phases",
        journal: "Journal of Chromatography A",
        year: "2026",
        doi: "10.1016/j.chroma.2026.466967",
        link: "https://doi.org/10.1016/j.chroma.2026.466967"
      },
      {
        title: "Phenolic Profiling of Olive (Olea europaea L. cv. Nocellara Messinese) Samples by Comprehensive 2D Liquid Chromatography",
        journal: "ChemFoodChem",
        year: "2026",
        doi: "10.1002/cfch.70009",
        link: "https://doi.org/10.1002/cfch.70009"
      },
      {
        title: "Exploring Bioactive Polyphenolic Compounds in Food and Natural Real-World Samples II: Molecular Diversity, Functionality, and Future Directions",
        journal: "Molecules",
        year: "2026",
        doi: "10.3390/molecules31030537",
        link: "https://doi.org/10.3390/molecules31030537"
      },
      {
        title: "Comprehensive two-dimensional liquid chromatography as a powerful tool for the analysis of food and food products",
        journal: "TrAC Trends in Analytical Chemistry",
        year: "2020",
        doi: "10.1016/j.trac.2020.115894",
        link: "https://doi.org/10.1016/j.trac.2020.115894"
      },
      {
        title: "Complementary analytical liquid chromatography methods for the characterization of aqueous phase from pyrolysis of lignocellulosic biomasses",
        journal: "Analytical Chemistry",
        year: "2014",
        doi: "10.1021/ac5038957",
        link: "https://doi.org/10.1021/ac5038957"
      },
      {
        title: "High performance characterization of triacylglycerols in milk and milk-related samples by liquid chromatography and mass spectrometry",
        journal: "Journal of Chromatography A",
        year: "2014",
        doi: "10.1016/j.chroma.2014.07.073",
        link: "https://doi.org/10.1016/j.chroma.2014.07.073"
      },
      {
        title: "Potential of comprehensive chromatography in food analysis",
        journal: "TrAC Trends in Analytical Chemistry",
        year: "2013",
        doi: "10.1016/j.trac.2013.07.008",
        link: "https://doi.org/10.1016/j.trac.2013.07.008"
      },
      {
        title: "Mass spectrometry detection in comprehensive liquid chromatography: Basic concepts, instrumental aspects, applications and trends",
        journal: "Mass Spectrometry Reviews",
        year: "2012",
        doi: "10.1002/mas.20353",
        link: "https://doi.org/10.1002/mas.20353"
      },
      {
        title: "Online comprehensive RPLC × RPLC with mass spectrometry detection for the analysis of proteome samples",
        journal: "Analytical Chemistry",
        year: "2011",
        doi: "10.1021/ac102656b",
        link: "https://doi.org/10.1021/ac102656b"
      },
      {
        title: "Employing ultra high pressure liquid chromatography as the second dimension in a comprehensive two-dimensional system for analysis of Stevia rebaudiana extracts",
        journal: "Journal of Chromatography A",
        year: "2011",
        doi: "10.1016/j.chroma.2010.08.081",
        link: "https://doi.org/10.1016/j.chroma.2010.08.081"
      },
      {
        title: "Comprehensive two-dimensional liquid chromatography to quantify polyphenols in red wines",
        journal: "Journal of Chromatography A",
        year: "2009",
        doi: "10.1016/j.chroma.2009.04.001",
        link: "https://doi.org/10.1016/j.chroma.2009.04.001"
      },
      {
        title: "Comprehensive multidimensional liquid chromatography: Theory and applications",
        journal: "Journal of Chromatography A",
        year: "2008",
        doi: "10.1016/j.chroma.2007.06.074",
        link: "https://doi.org/10.1016/j.chroma.2007.06.074"
      }
    ]
  },
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
    slug: "prashant-kumar",
    name: "Prof. Prashant Kumar",
    role: "Editorial Board Member",
    affiliation: "Global Centre for Clean Air Research (GCARE), School of Engineering, University of Surrey, UK",
    specialization: "Air quality, aerosol science, low-cost sensing, nature-based solutions, and climate change mitigation.",
    email: "editor.environsci@scholarlyopen.org",
    orcid: "0000-0002-8692-7484",
    researchGate: "https://www.researchgate.net/profile/Prashant-Kumar-4",
    googleScholar: "https://scholar.google.com/citations?user=prashant-kumar",
    assignedSections: [
      "Water and air quality",
      "Climate science and adaptation",
      "Urban ecology"
    ],
    expertise: [
      "Air Quality & Health",
      "Aerosol Science & Nanoparticles",
      "Low-Cost Sensing",
      "Citizen Science",
      "Nature-Based Solutions",
      "Climate Change Mitigation",
      "Environmental Engineering"
    ],
    badges: ["Top 1% Highly Cited Researcher", "Haagen-Smit Prize Winner"],
    journalSlug: "environmental-science",
    welcomeMessage: "As an Editorial Board Member and Handling Editor for Scholarly Open: Environmental Science, I am committed to advancing rigorous, peer-reviewed open science addressing real-world environmental challenges, atmospheric health, and sustainable solutions worldwide.",
    stats: [
      { label: "Status", value: "Accepting Submissions", description: "Handling editor ready for peer evaluation" },
      { label: "Citations", value: "35,000+", description: "Highly cited in Environmental Science & Technology" },
      { label: "Review Standard", value: "COPE Compliant", description: "Transparent, rigorous peer review" }
    ],
    biography: `Professor Prashant Kumar is the Professor and Chair in Air Quality and Health at the University of Surrey, United Kingdom. He is the Founding Director of the Global Centre for Clean Air Research (GCARE) and Founding Co-Director of the university's pan-university Institute for Sustainability. He holds a PhD in Engineering from the University of Cambridge and has been consistently named in the top 1% of Global Highly Cited Researchers. Winner of the 2023 Haagen-Smit Prize and the Clean Air Award for his transformative contributions to environmental science and urban air quality.`,
    personalPublications: [
      {
        title: "Clean air engineering for cities: Connecting science, policy and people",
        journal: "Atmospheric Environment",
        year: "2024",
        doi: "10.1016/j.atmosenv.2024.120000"
      },
      {
        title: "The power of low-cost sensing for urban air quality monitoring and citizen engagement",
        journal: "Environmental Science & Technology",
        year: "2023",
        doi: "10.1021/acs.est.2023.001"
      }
    ]
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
    slug: "celeste-chamberland",
    name: "Celeste Chamberland, Ph.D.",
    role: "Editorial Board Member",
    affiliation: "College of Humanities, Education & Social Sciences\nRoosevelt University, USA",
    specialization: "Early Modern Europe and the History of Medicine",
    email: "editor.socsci@scholarlyopen.org",
    orcid: "0009-0004-3810-5163",
    googleScholar: "https://scholar.google.com/citations?user=IlUtNqcAAAAJ&hl=en",
    imageUrl: "/images/editors/celeste-chamberland.jpg",
    journalSlug: "social-sciences-humanities",
    assignedSections: [
      "History of Medicine & Surgery",
      "Early Modern European History",
      "Gender, Race & Cultural History"
    ],
    expertise: [
      "History of Surgery",
      "Sixteenth-century England",
      "Gender Studies",
      "History of Addiction",
      "Drugs and Pharmacy"
    ],
    badges: ["Founding Member"],
    welcomeMessage: "As an Editorial Board Member for Scholarly Open: Social Sciences & Humanities, I am committed to supporting rigorous interdisciplinary research that explores historical perspectives on medicine, society, gender, and culture to deepen our understanding of the human condition.",
    stats: [
      { label: "Status", value: "Accepting Submissions", description: "Ready to review manuscripts" },
      { label: "Avg. Turnaround", value: "21 Days", description: "From assignment to review completion" },
      { label: "Review Standard", value: "Rigorous Double-Blind", description: "Ensuring academic excellence" }
    ],
    timeline: [
      {
        year: "1995",
        title: "B.A. in History",
        description: "University of New Brunswick, Canada.",
        type: "education"
      },
      {
        year: "1997",
        title: "M.A. in History",
        description: "Concordia University, Montreal, Canada.",
        type: "education"
      },
      {
        year: "2004",
        title: "Ph.D. in History",
        description: "University of California, Davis, USA.",
        type: "education"
      },
      {
        year: "2005 – Present",
        title: "Professor of History & Program Director",
        description: "Appointed to Roosevelt University faculty in 2005; currently Professor of History, Director of History & International Studies Programs, and Faculty Trustee.",
        type: "career"
      },
      {
        year: "2026",
        title: "Joined Scholarly Open",
        description: "Appointed as Editorial Board Member for Scholarly Open: Social Sciences & Humanities.",
        type: "milestone"
      }
    ],
    biography: `Dr. Celeste Chamberland, Ph.D., is a Professor of History and Program Director for the History and International Studies Programs at Roosevelt University in Chicago. She is a scholar of the history of medicine, early modern Europe, and the Atlantic world, with a specialized emphasis on gender, race, and cultural history.

Dr. Chamberland’s published research focuses on gender and the professionalization of surgery, as well as the history of mental illness in the sixteenth and seventeenth centuries. Her current research interests explore the relationship between masculinity, medical moralizing, and the proto-medicalization of addiction within the context of emergent global capitalism. She teaches courses spanning world history, the history of public health, medical racism, drugs in world history, epidemics, and gender and power in the Atlantic world.

Dr. Chamberland earned her Ph.D. in History from the University of California, Davis, her M.A. from Concordia University in Montreal, and her B.A. from the University of New Brunswick. Her research has been widely published in leading journals such as Social History of Medicine, History of Education Quarterly, Sixteenth Century Journal, and Journal of the History of Medicine and Allied Sciences.`,
    personalPublications: [
      {
        title: "Partners or Practitioners: Women and the Management of Surgical Households in Early Modern London",
        journal: "Social History of Medicine",
        year: "2011",
        link: "https://doi.org/10.1093/shm/hkq057"
      },
      {
        title: "Between the Hall and the Market: William Clowes and Surgical Self-Fashioning in Elizabethan London",
        journal: "Sixteenth Century Journal",
        year: "2010",
        link: "https://doi.org/10.1086/scj27867638"
      },
      {
        title: "Honor, Brotherhood, and the Corporate Ethos of the London Barber-Surgeons' Company, 1570–1640",
        journal: "Journal of the History of Medicine and Allied Sciences",
        year: "2009",
        link: "https://academic.oup.com/jhmas/article-abstract/64/3/300/750429"
      }
    ]
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

// Dynamically integrate verified onboarded Editorial Board Members from editorial-board-onboarding.json
const onboardedList: EditorMember[] = (
  Array.isArray((onboardedData as any)?.onboardedEditors)
    ? (onboardedData as any).onboardedEditors
        .filter((o: any) => o.jmApproved === true)
        .map((o: any) => {
        const cleanSlug = (o.name || "editor")
          .toLowerCase()
          .replace(/^prof\.\s*|^dr\.\s*|^assoc\.\s*prof\.\s*/i, "")
          .replace(/,\s*(ph\.?d\.?|m\.?d\.?|d\.?sc\.?|eng\.?d\.?)/i, "")
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")

        let jSlug = o.journalSlug
        if (!jSlug && o.journal) {
          jSlug = o.journal.toLowerCase().replace("scholarly open:", "").trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
        }

        const matchingBase = baseEditors.find(be => be.slug === cleanSlug || be.name.toLowerCase() === o.name.toLowerCase())

        return {
          ...matchingBase,
          slug: cleanSlug,
          name: o.name,
          role: o.role || matchingBase?.role || "Editorial Board Member",
          affiliation: o.affiliation || matchingBase?.affiliation || "University / Academic Institution",
          specialization: o.specialization || matchingBase?.specialization || (Array.isArray(o.researchInterests) ? o.researchInterests.join(", ") : "Academic Peer Review & Research"),
          imageUrl: o.photoUrl || matchingBase?.imageUrl || undefined,
          email: jSlug === "chemistry" ? "editor.chem@scholarlyopen.org" : (o.email && o.email.endsWith("@scholarlyopen.org") ? o.email : (jSlug ? `editor.${jSlug.replace(/[^a-z0-9]/g, "")}@scholarlyopen.org` : "info@scholarlyopen.org")),
          orcid: o.orcid || matchingBase?.orcid || undefined,
          scopusId: o.scopusId || matchingBase?.scopusId || undefined,
          googleScholar: o.googleScholar || matchingBase?.googleScholar || undefined,
          linkedin: o.linkedin || matchingBase?.linkedin || undefined,
          biography: o.biography || matchingBase?.biography || undefined,
          expertise: Array.isArray(o.researchInterests) && o.researchInterests.length > 0 ? o.researchInterests : matchingBase?.expertise,
          journalSlug: jSlug || matchingBase?.journalSlug,
          badges: matchingBase?.badges || ["Verified Board Member", "COPE Ethics Verified"],
          timeline: matchingBase?.timeline,
          stats: matchingBase?.stats,
          personalPublications: matchingBase?.personalPublications,
          editorialRoles: matchingBase?.editorialRoles,
          honors: matchingBase?.honors,
          welcomeMessage: matchingBase?.welcomeMessage
        }
      })
    : []
)

export const editors: EditorMember[] = [
  ...onboardedList,
  ...baseEditors.filter(be => !onboardedList.some(ol => {
    if (ol.name.toLowerCase() === be.name.toLowerCase()) return true
    if (ol.journalSlug === be.journalSlug && be.name === "Position Open") {
      const isOlEic = ol.role?.toLowerCase().includes("chief")
      const isBeEic = be.role?.toLowerCase().includes("chief")
      const isOlAe = ol.role?.toLowerCase().includes("associate")
      const isBeAe = be.role?.toLowerCase().includes("associate")
      if (isOlEic && isBeEic) return true
      if (isOlAe && isBeAe) return true
      return false
    }
    return false
  }))
]
