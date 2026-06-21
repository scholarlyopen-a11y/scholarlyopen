export interface Article {
  id: string
  title: string
  authors: string[]
  abstract: string
  keywords: string[]
  doi: string
  publishedDate: string
  articleType: "research" | "review" | "methodology" | "editorial"
  journalSlug: string
}

export const articles: Article[] = [
  {
    "id": "ais-2026-001",
    "title": "Eliciting Latent Knowledge: Probing Internal Representations of Large Language Models",
    "authors": [
      "Dr. Evelyn Vance",
      "Dr. Charles Zhang"
    ],
    "abstract": "This paper introduces a probing framework to extract factual beliefs and latent reasoning paths from LLMs, addressing hallucination and alignment.",
    "keywords": [
      "AI Alignment",
      "Latent Knowledge",
      "Probing",
      "Transparency"
    ],
    "doi": "10.12345/ais.2026.001",
    "publishedDate": "2026-03-10",
    "articleType": "research",
    "journalSlug": "ai-safety-governance"
  },
  {
    "id": "ais-2026-002",
    "title": "Evaluating Multi-Agent Coordination under Conflict: A Safety Benchmarking Sandbox",
    "authors": [
      "Prof. Julian Alistair",
      "Dr. Hana Tanaka"
    ],
    "abstract": "We present a sandbox environment to evaluate coordination and negotiation safety in multi-agent networks, outlining systemic risks.",
    "keywords": [
      "Multi-Agent Systems",
      "Safety Benchmark",
      "Coordination",
      "Governance"
    ],
    "doi": "10.12345/ais.2026.002",
    "publishedDate": "2026-05-02",
    "articleType": "research",
    "journalSlug": "ai-safety-governance"
  },
  {
    "id": "bio-2025-001",
    "title": "Single-Cell Transcriptomics Reveals Novel Mechanisms in Plant Root Development",
    "authors": [
      "Dr. Anika Hoffmann",
      "Prof. Clara Rossi"
    ],
    "abstract": "This study uses single-cell transcriptomics to map gene expression dynamics during root development, revealing new regulators of cell differentiation.",
    "keywords": [
      "Single-cell",
      "Plant biology",
      "Development",
      "Transcriptomics"
    ],
    "doi": "10.12345/bio.2025.001",
    "publishedDate": "2025-01-20",
    "articleType": "research",
    "journalSlug": "biology"
  },
  {
    "id": "bio-2025-002",
    "title": "Microbiome Composition and Host Immunity in Marine Ecosystems",
    "authors": [
      "Dr. Sofia Martínez",
      "Dr. Lars Jensen"
    ],
    "abstract": "We analyze microbial community dynamics and host immune responses across coastal marine populations, with implications for ecosystem health.",
    "keywords": [
      "Microbiome",
      "Immunity",
      "Marine biology",
      "Ecosystems"
    ],
    "doi": "10.12345/bio.2025.002",
    "publishedDate": "2025-02-11",
    "articleType": "review",
    "journalSlug": "biology"
  },
  {
    "id": "bio-2025-003",
    "title": "CRISPR-Based Tools for Targeted Genetic Engineering in Crop Improvement",
    "authors": [
      "Prof. Dr. Nina Patel",
      "Dr. Jonas Weiss"
    ],
    "abstract": "This paper explores CRISPR-Cas approaches for precise genome editing in major crops, enabling traits for resilience and nutritional quality.",
    "keywords": [
      "CRISPR",
      "Genetic engineering",
      "Crops",
      "Biotechnology"
    ],
    "doi": "10.12345/bio.2025.003",
    "publishedDate": "2025-03-05",
    "articleType": "methodology",
    "journalSlug": "biology"
  },
  {
    "id": "chem-2025-001",
    "title": "Catalytic Conversion of Biomass-Derived Feedstocks into Sustainable Chemicals",
    "authors": [
      "Dr. Elena Novak",
      "Prof. Martin Klein"
    ],
    "abstract": "This work presents an efficient catalytic process for transforming biomass-derived substrates into value-added chemicals with reduced energy consumption.",
    "keywords": [
      "Catalysis",
      "Sustainable chemistry",
      "Biomass",
      "Green chemistry"
    ],
    "doi": "10.12345/chem.2025.001",
    "publishedDate": "2025-01-30",
    "articleType": "research",
    "journalSlug": "chemistry"
  },
  {
    "id": "chem-2025-002",
    "title": "Nanostructured Materials for Next-Generation Energy Storage",
    "authors": [
      "Dr. Aisha Khatri",
      "Dr. Peter van Dijk"
    ],
    "abstract": "We design and characterize nanostructured electrode materials that enable enhanced charge density and lifetime in high-performance energy storage devices.",
    "keywords": [
      "Nanomaterials",
      "Energy storage",
      "Materials chemistry",
      "Nanotechnology"
    ],
    "doi": "10.12345/chem.2025.002",
    "publishedDate": "2025-02-18",
    "articleType": "research",
    "journalSlug": "chemistry"
  },
  {
    "id": "chem-2025-003",
    "title": "Computational Chemistry for Predicting Reaction Pathways in Sustainable Synthesis",
    "authors": [
      "Prof. Dr. Mei Lin",
      "Dr. Christoph Bauer"
    ],
    "abstract": "This article evaluates computational modeling methods to predict reaction mechanisms and optimize routes for sustainable synthetic chemistry.",
    "keywords": [
      "Computational chemistry",
      "Reaction mechanisms",
      "Sustainability",
      "Modeling"
    ],
    "doi": "10.12345/chem.2025.002",
    "publishedDate": "2025-03-12",
    "articleType": "review",
    "journalSlug": "chemistry"
  },
  {
    "id": "clai-2026-001",
    "title": "Clinical Validation of an AI Diagnostic Tool for Automated Mammography in Diverse Patient Cohorts",
    "authors": [
      "Dr. Sarah Jenkins",
      "Prof. Kenji Takahashi"
    ],
    "abstract": "This study validates a deep learning diagnostic system for mammography screening, showing robust sensitivity and specificity across multicenter datasets.",
    "keywords": [
      "Artificial Intelligence",
      "Mammography",
      "Breast Cancer",
      "Clinical Validation"
    ],
    "doi": "10.12345/clai.2026.001",
    "publishedDate": "2026-04-12",
    "articleType": "research",
    "journalSlug": "clinical-ai-digital-health"
  },
  {
    "id": "clai-2026-002",
    "title": "Integrating LLM Copilots in Electronic Health Record Workflows: A Randomized Usability Trial",
    "authors": [
      "Dr. Maya Lin",
      "Dr. David Vance"
    ],
    "abstract": "We evaluate the impact of LLM-assisted documentation in EHR systems, showing substantial reductions in administrative burden and high clinician satisfaction.",
    "keywords": [
      "Large Language Models",
      "EHR",
      "Clinical Workflow",
      "Usability"
    ],
    "doi": "10.12345/clai.2026.002",
    "publishedDate": "2026-05-18",
    "articleType": "research",
    "journalSlug": "clinical-ai-digital-health"
  },
  {
    "id": "ds-2025-001",
    "title": "Explainable AI for Fair Decision Support Systems",
    "authors": [
      "Dr. Lara Kim",
      "Prof. Tobias Neumann"
    ],
    "abstract": "This article evaluates explainable AI models in decision support systems and their contribution to fairness and stakeholder trust.",
    "keywords": [
      "Explainable AI",
      "Fairness",
      "Decision support",
      "Data science"
    ],
    "doi": "10.12345/ds.2025.001",
    "publishedDate": "2025-01-18",
    "articleType": "research",
    "journalSlug": "data-science"
  },
  {
    "id": "ds-2025-002",
    "title": "Data-Driven Public Health Models for Pandemic Preparedness",
    "authors": [
      "Dr. Emma Wagner",
      "Dr. Daniel Osei"
    ],
    "abstract": "We present data-driven modeling methods to support pandemic preparedness and public health planning with robust uncertainty quantification.",
    "keywords": [
      "Public health",
      "Data modeling",
      "Pandemic preparedness",
      "Statistical analysis"
    ],
    "doi": "10.12345/ds.2025.002",
    "publishedDate": "2025-02-22",
    "articleType": "review",
    "journalSlug": "data-science"
  },
  {
    "id": "ds-2025-003",
    "title": "Federated Learning for Privacy-Preserving Healthcare Analytics",
    "authors": [
      "Prof. Dr. Lena Sørensen",
      "Dr. Amir Ghani"
    ],
    "abstract": "This study explores federated learning architectures for healthcare analytics that preserve patient privacy while supporting collaborative model development.",
    "keywords": [
      "Federated learning",
      "Privacy",
      "Healthcare analytics",
      "Machine learning"
    ],
    "doi": "10.12345/ds.2025.003",
    "publishedDate": "2025-03-09",
    "articleType": "methodology",
    "journalSlug": "data-science"
  },
  {
    "id": "ds-2025-004",
    "title": "Bringing Citations and Usage Metrics Together to Make Data Count",
    "authors": [
      "Dr. Helena Cousijn",
      "Patricia Cruse",
      "Daniella Lowenberg"
    ],
    "abstract": "This paper presents the framework and initial outcomes of the Make Data Count initiative, establishing standard metrics for tracking data citations, views, and downloads across repositories.",
    "keywords": [
      "Open data",
      "Data citation",
      "Metadata quality",
      "Scientometrics"
    ],
    "doi": "10.12345/ds.2025.004",
    "publishedDate": "2025-04-12",
    "articleType": "methodology",
    "journalSlug": "data-science"
  },
  {
    "id": "dec-2026-001",
    "title": "Enhancing CO2 Adsorption Capacity in Metal-Organic Frameworks via Amine Functionalization",
    "authors": [
      "Dr. Lucas Mercier",
      "Prof. Sophie Dubois"
    ],
    "abstract": "This study presents a novel synthesis method for functionalized MOFs, showing a 35% increase in carbon dioxide capture capacity under ambient flue gas conditions.",
    "keywords": [
      "Metal-Organic Frameworks",
      "Carbon Capture",
      "Adsorption",
      "Materials Science"
    ],
    "doi": "10.12345/dec.2026.001",
    "publishedDate": "2026-02-15",
    "articleType": "research",
    "journalSlug": "decarbonization-carbon-tech"
  },
  {
    "id": "dec-2026-002",
    "title": "Lifecycle Carbon Accounting of Offshore Kelp Sinking for Marine Carbon Dioxide Removal",
    "authors": [
      "Dr. Ryan O'Connor",
      "Dr. Yuki Sato"
    ],
    "abstract": "We conduct a cradle-to-grave lifecycle assessment of kelp aquaculture and deep-sea deposition, verifying net carbon removal efficiency and cost-per-ton metrics.",
    "keywords": [
      "Ocean Carbon Dioxide Removal",
      "Lifecycle Assessment",
      "Kelp Aquaculture",
      "Climate Tech"
    ],
    "doi": "10.12345/dec.2026.002",
    "publishedDate": "2026-05-10",
    "articleType": "research",
    "journalSlug": "decarbonization-carbon-tech"
  },
  {
    "id": "eng-2025-001",
    "title": "Smart Infrastructure Design for Resilient Cities",
    "authors": [
      "Dr. Michael Braun",
      "Prof. Elena Schmidt"
    ],
    "abstract": "This paper presents smart infrastructure design strategies to improve urban resilience, sustainability, and adaptability in cities.",
    "keywords": [
      "Smart infrastructure",
      "Resilient cities",
      "Civil engineering",
      "Sustainability"
    ],
    "doi": "10.12345/eng.2025.001",
    "publishedDate": "2025-01-28",
    "articleType": "research",
    "journalSlug": "engineering"
  },
  {
    "id": "eng-2025-002",
    "title": "Renewable Energy Systems Optimization using Digital Twins",
    "authors": [
      "Dr. Amina Farouk",
      "Dr. Jonas Meier"
    ],
    "abstract": "We explore the use of digital twin technology to optimize renewable energy systems and improve operational efficiency.",
    "keywords": [
      "Digital twins",
      "Renewable energy",
      "Systems optimization",
      "Engineering"
    ],
    "doi": "10.12345/eng.2025.002",
    "publishedDate": "2025-02-10",
    "articleType": "research",
    "journalSlug": "engineering"
  },
  {
    "id": "eng-2025-003",
    "title": "Robotics and Automation for Sustainable Manufacturing",
    "authors": [
      "Prof. Dr. Mia Keller",
      "Dr. Samuel Chen"
    ],
    "abstract": "This review highlights robotics and automation approaches that increase efficiency and sustainability in modern manufacturing systems.",
    "keywords": [
      "Robotics",
      "Automation",
      "Manufacturing",
      "Sustainability"
    ],
    "doi": "10.12345/eng.2025.002",
    "publishedDate": "2025-03-16",
    "articleType": "review",
    "journalSlug": "engineering"
  },
  {
    "id": "env-2025-001",
    "title": "Climate Adaptation Strategies for Coastal Ecosystems",
    "authors": [
      "Dr. Sophia Lange",
      "Prof. Dr. Daniel Meyer"
    ],
    "abstract": "This study examines climate adaptation strategies for protecting coastal ecosystems and communities from rising sea levels and extreme weather.",
    "keywords": [
      "Climate adaptation",
      "Coastal ecosystems",
      "Environmental science",
      "Resilience"
    ],
    "doi": "10.12345/env.2025.001",
    "publishedDate": "2025-01-25",
    "articleType": "research",
    "journalSlug": "environmental-science"
  },
  {
    "id": "env-2025-002",
    "title": "Circular Economy Pathways for Reducing Plastic Waste",
    "authors": [
      "Dr. Nina Schmidt",
      "Dr. Marco Rossi"
    ],
    "abstract": "We analyze circular economy approaches that reduce plastic waste through design, recycling, and systems-level policy interventions.",
    "keywords": [
      "Circular economy",
      "Plastic waste",
      "Sustainability",
      "Environmental policy"
    ],
    "doi": "10.12345/env.2025.002",
    "publishedDate": "2025-02-14",
    "articleType": "research",
    "journalSlug": "environmental-science"
  },
  {
    "id": "env-2025-003",
    "title": "Urban Biodiversity and Ecosystem Services in Green Cities",
    "authors": [
      "Prof. Dr. Lena Fischer",
      "Dr. Omar Hassan"
    ],
    "abstract": "This review explores the role of urban biodiversity in delivering ecosystem services and supporting resilient green cities.",
    "keywords": [
      "Urban biodiversity",
      "Ecosystem services",
      "Green cities",
      "Conservation"
    ],
    "doi": "10.12345/env.2025.003",
    "publishedDate": "2025-03-07",
    "articleType": "review",
    "journalSlug": "environmental-science"
  },
  {
    "id": "med-2025-001",
    "title": "Telehealth Adoption and Clinical Outcomes in Rural Care Settings",
    "authors": [
      "Dr. Miriam Schultz",
      "Dr. Lucas Wong"
    ],
    "abstract": "This study evaluates the impact of telehealth adoption on clinical outcomes and patient satisfaction in rural health systems.",
    "keywords": [
      "Telehealth",
      "Rural health",
      "Clinical outcomes",
      "Digital health"
    ],
    "doi": "10.12345/med.2025.001",
    "publishedDate": "2025-01-14",
    "articleType": "research",
    "journalSlug": "medicine"
  },
  {
    "id": "med-2025-002",
    "title": "Precision Oncology Biomarkers for Personalized Cancer Therapy",
    "authors": [
      "Dr. Amina Farah",
      "Prof. Henry Vogel"
    ],
    "abstract": "We assess emerging precision oncology biomarkers and their use in tailoring personalized cancer therapies for improved patient outcomes.",
    "keywords": [
      "Precision medicine",
      "Oncology",
      "Biomarkers",
      "Personalized therapy"
    ],
    "doi": "10.12345/med.2025.002",
    "publishedDate": "2025-02-06",
    "articleType": "review",
    "journalSlug": "medicine"
  },
  {
    "id": "med-2025-003",
    "title": "Integrating Behavioral Health into Primary Care: A Systems Approach",
    "authors": [
      "Dr. Elena Park",
      "Dr. Markus Fischer"
    ],
    "abstract": "This article presents a systems-based model for integrating behavioral health services into primary care practices to support mental health and chronic disease management.",
    "keywords": [
      "Behavioral health",
      "Primary care",
      "Systems approach",
      "Health integration"
    ],
    "doi": "10.12345/med.2025.003",
    "publishedDate": "2025-03-01",
    "articleType": "methodology",
    "journalSlug": "medicine"
  },
  {
    "id": "qe-2026-001",
    "title": "Reducing Decoherence in Silicon-Based Spin Qubits via Isotopic Purification",
    "authors": [
      "Dr. Thomas Sterling",
      "Prof. Mei-Ling Zhou"
    ],
    "abstract": "This paper demonstrates a fabrication method for silicon-28 spin qubits that reduces environmental spin noise and yields a twofold increase in coherence time.",
    "keywords": [
      "Spin Qubits",
      "Decoherence",
      "Silicon Nanotechnology",
      "Quantum Hardware"
    ],
    "doi": "10.12345/qe.2026.001",
    "publishedDate": "2026-03-22",
    "articleType": "research",
    "journalSlug": "quantum-engineering"
  },
  {
    "id": "qe-2026-002",
    "title": "A Scalable Compiler Architecture for Topological Quantum Computers",
    "authors": [
      "Dr. Fiona MacLeod",
      "Dr. Alan Turing Jr."
    ],
    "abstract": "We present a software-level compilation stack that translates logical quantum gates into braiding trajectories, optimizing topological error-correcting codes.",
    "keywords": [
      "Quantum Compiler",
      "Topological Quantum Computing",
      "Error Correction",
      "Software Stack"
    ],
    "doi": "10.12345/qe.2026.002",
    "publishedDate": "2026-04-30",
    "articleType": "research",
    "journalSlug": "quantum-engineering"
  },
  {
    "id": "ss-2025-001",
    "title": "Participatory Policy Design for Urban Climate Resilience",
    "authors": [
      "Dr. Julia Meier",
      "Prof. Daniel Vogel"
    ],
    "abstract": "This article examines participatory policy frameworks that strengthen urban climate resilience through community-led decision making and social inclusion.",
    "keywords": [
      "Urban policy",
      "Climate resilience",
      "Public participation",
      "Social justice"
    ],
    "doi": "10.12345/ss.2025.001",
    "publishedDate": "2025-01-10",
    "articleType": "research",
    "section": "Political Science & Public Policy",
    "journalSlug": "social-sciences-humanities"
  },
  {
    "id": "ss-2025-002",
    "title": "Digital Inequality and Education Access in the 21st Century",
    "authors": [
      "Dr. Nina Alvarez",
      "Dr. Samuel Kofi"
    ],
    "abstract": "We analyze how digital divides shape educational outcomes across diverse populations and propose pathways to equitable access in emerging learning systems.",
    "keywords": [
      "Digital inequality",
      "Education",
      "Access",
      "Social policy"
    ],
    "doi": "10.12345/ss.2025.002",
    "publishedDate": "2025-02-28",
    "articleType": "review",
    "section": "Sociology",
    "journalSlug": "social-sciences-humanities"
  },
  {
    "id": "ss-2025-003",
    "title": "Migration, Labor Markets, and Social Cohesion in Europe",
    "authors": [
      "Prof. Marie Laurent",
      "Dr. Tobias Schneider"
    ],
    "abstract": "This study evaluates migration flows, labor market integration, and social cohesion policies across European economies with implications for inclusive governance.",
    "keywords": [
      "Migration",
      "Labor",
      "Social cohesion",
      "Europe"
    ],
    "doi": "10.12345/ss.2025.003",
    "publishedDate": "2025-03-21",
    "articleType": "research",
    "section": "Economics & Development Studies",
    "journalSlug": "social-sciences-humanities"
  },
  {
    "id": "sjo-2024-001",
    "title": "Attention Mechanisms in Transformer Networks: A Comprehensive Analysis of Self-Attention Variations",
    "authors": [
      "Dr. Chen Wei",
      "Prof. James Miller",
      "Dr. Yuki Tanaka"
    ],
    "abstract": "This study provides an in-depth analysis of attention mechanism variations in transformer architectures. We examine computational efficiency, interpretability, and performance trade-offs across multiple attention types, providing guidelines for practitioners.",
    "keywords": [
      "Transformers",
      "Attention mechanisms",
      "Neural networks",
      "NLP",
      "Deep learning"
    ],
    "doi": "10.12345/sjo.2024.001",
    "publishedDate": "2024-03-15",
    "articleType": "research",
    "pdfUrl": "#",
    "journalSlug": "social-sciences-open"
  },
  {
    "id": "sjo-2024-002",
    "title": "Ethical Considerations in Large Language Model Deployment: A Framework for Responsible AI",
    "authors": [
      "Prof. Sarah Anderson",
      "Dr. Marcus Chen"
    ],
    "abstract": "We present a comprehensive framework for addressing ethical concerns in LLM deployment, covering bias mitigation, transparency, accountability, and fairness. Our framework integrates technical and governance approaches with evidence from real-world implementations.",
    "keywords": [
      "AI ethics",
      "Language models",
      "Responsible AI",
      "Fairness",
      "Governance"
    ],
    "doi": "10.12345/sjo.2024.002",
    "publishedDate": "2024-02-28",
    "articleType": "research",
    "pdfUrl": "#",
    "journalSlug": "social-sciences-open"
  },
  {
    "id": "sjo-2024-003",
    "title": "Computer Vision for Medical Imaging: A Systematic Review of Deep Learning Applications",
    "authors": [
      "Dr. Emma Rodriguez",
      "Prof. Klaus Mueller"
    ],
    "abstract": "This systematic review synthesizes findings from 156 studies on deep learning applications in medical imaging. We identify key algorithms, datasets, and challenges while proposing standardized evaluation metrics for clinical deployment.",
    "keywords": [
      "Computer vision",
      "Medical imaging",
      "Deep learning",
      "CNN",
      "Systematic review"
    ],
    "doi": "10.12345/sjo.2024.003",
    "publishedDate": "2024-01-20",
    "articleType": "review",
    "pdfUrl": "#",
    "journalSlug": "social-sciences-open"
  },
  {
    "id": "sr-2026-001",
    "title": "Microwave Sintering of Lunar Regolith Simulant under Vacuum Conditions for Construction",
    "authors": [
      "Dr. Evelyn Stone",
      "Prof. Marcus Vance"
    ],
    "abstract": "This paper evaluates microwave heating parameters to sinter JSC-1A lunar simulant in high vacuum, assessing compressive strength for lunar habitat building.",
    "keywords": [
      "Lunar Regolith",
      "Microwave Sintering",
      "Lunar Construction",
      "ISRU"
    ],
    "doi": "10.12345/sr.2026.001",
    "publishedDate": "2026-04-02",
    "articleType": "research",
    "journalSlug": "space-resources-orbital-economy"
  },
  {
    "id": "sr-2026-002",
    "title": "Legal Frameworks for Asteroid Mining: Resolving Ownership of Space-Derived Resources",
    "authors": [
      "Dr. Claire D'Amboise",
      "Prof. Richard Alvarez"
    ],
    "abstract": "We analyze international space law under the Artemis Accords, proposing a multilateral licensing framework to regulate property rights on asteroid minerals.",
    "keywords": [
      "Space Law",
      "Artemis Accords",
      "Asteroid Mining",
      "Property Rights"
    ],
    "doi": "10.12345/sr.2026.002",
    "publishedDate": "2026-05-20",
    "articleType": "research",
    "journalSlug": "space-resources-orbital-economy"
  },
  {
    "id": "syn-2026-001",
    "title": "Enzymatic Synthesis of Bio-Polyesters in Cell-Free Systems: Optimizing Yield and Crystallinity",
    "authors": [
      "Dr. Hannah Schmidt",
      "Prof. Jean-Marc Petit"
    ],
    "abstract": "This article introduces a cell-free enzymatic cascade for producing sustainable polyesters, bypassing cellular toxicity limits and optimizing polymer length.",
    "keywords": [
      "Cell-Free Systems",
      "Enzymatic Synthesis",
      "Bio-Polyesters",
      "Biomaterials"
    ],
    "doi": "10.12345/syn.2026.001",
    "publishedDate": "2026-03-05",
    "articleType": "research",
    "journalSlug": "synthetic-biology-bio-design"
  },
  {
    "id": "syn-2026-002",
    "title": "Precision Gene Editing of Senescent Human Fibroblasts via CRISPR-Cas12a Ribonucleoproteins",
    "authors": [
      "Dr. Clara Vanhoutte",
      "Dr. Alexander Thorne"
    ],
    "abstract": "We evaluate transfection parameters for editing senescent cells in vitro, achieving high target-site accuracy with zero off-target insertions.",
    "keywords": [
      "CRISPR-Cas12a",
      "Cellular Senescence",
      "Gene Editing",
      "Senolytics"
    ],
    "doi": "10.12345/syn.2026.002",
    "publishedDate": "2026-05-12",
    "articleType": "research",
    "journalSlug": "synthetic-biology-bio-design"
  }
];
