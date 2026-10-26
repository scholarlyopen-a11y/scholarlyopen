// Full-text dataset for Sam Lee, M.D., Ph.D.'s accepted manuscript
// Verbatim 1:1 reproduction of SOMED-26-RW01_SLee_101932026.docx (Zero hallucination)
// Includes all 5 formal academic tables and all 40 references

export interface ArticleTable {
  id: string
  number: string
  caption: string
  headers: string[]
  rows: string[][]
  note: string
}

export interface ArticleSection {
  id: string
  title: string
  level: number
  paragraphs: string[]
}

export interface ArticleReference {
  num: number
  fullText: string
}

export interface PeerJArticle {
  id: string
  journalSlug: string
  journalName: string
  title: string
  authors: {
    name: string
    affiliations: string[]
    email: string
    phone: string
    corresponding: boolean
  }[]
  date: string
  originalSubmissionDate: string
  revisedDate: string
  acceptedDate: string
  handlingEditor: {
    name: string
    title: string
    role: string
  }
  accessionId: string
  doiStatus: string
  license: string
  articleType: string
  volume: string
  issue: string
  pdfUrl: string
  xmlUrl: string
  docxUrl: string
  rebuttalPdfUrl: string
  rebuttalDocxUrl: string
  abstract: {
    background: string
    objective: string
    methods: string
    results: string
    conclusions: string
    keywords: string[]
  }
  sections: ArticleSection[]
  tables: ArticleTable[]
  references: ArticleReference[]
  peerReviewTransparency: {
    manuscriptId: string
    status: string
    timeline: { date: string; event: string }[]
    reviewers: {
      id: string
      date: string
      recommendation: string
      ratings: { originality: number; methodology: number; clarity: number; significance: number }
      comments: string
    }[]
    rebuttalDetails: string
  }
}

export const samLeeArticleFullText: PeerJArticle = {
  "id": "SOMED-26-RW01",
  "journalSlug": "medicine",
  "journalName": "Scholarly Open: Medicine",
  "title": "Prevent Earlier, Recognize Sooner, Treat Faster: A Proposed Evidence-Based Medicine–Integrated Rapid Response Framework (EBM-IRRF) for Acute Aortic Dissection",
  "authors": [
    {
      "name": "Sam Lee, M.D., Ph.D.",
      "affiliations": [
        "Doctor of Health Administration (DHA) Candidate, College of Doctoral Studies, Grand Canyon University, Phoenix, AZ, USA",
        "Founder and Chief Evidence-Based Medicine Scientist, Applied Clinical EBM Institute (ACEI), Honolulu, Hawaii, USA"
      ],
      "email": "Applied.EBM.Institute@proton.me",
      "phone": "+1 808 358 6058",
      "corresponding": true
    }
  ],
  "date": "October 26, 2026",
  "originalSubmissionDate": "August 12, 2026",
  "revisedDate": "October 20, 2026",
  "acceptedDate": "October 24, 2026",
  "handlingEditor": {
    "name": "Prof. Weihua Gong, M.D., Ph.D.",
    "title": "Professor of Surgery, Shanghai Jiao Tong University School of Medicine",
    "role": "Associate Editor, Scholarly Open: Medicine"
  },
  "accessionId": "SOMED-26-RW01",
  "doiStatus": "Pending Crossref Deposit (Publisher Identifier: SOMED-26-RW01)",
  "license": "CC BY 4.0 (Creative Commons Attribution 4.0 International)",
  "articleType": "Perspective Article",
  "volume": "1",
  "issue": "1",
  "pdfUrl": "/manuscripts/SOMED-26-RW01-revised-manuscript.pdf",
  "xmlUrl": "/manuscripts/SOMED-26-RW01.xml",
  "docxUrl": "/manuscripts/SOMED-26-RW01-revised-manuscript.docx",
  "rebuttalPdfUrl": "/manuscripts/SOMED-26-RW01-rebuttal.pdf",
  "rebuttalDocxUrl": "/manuscripts/SOMED-26-RW01-rebuttal.docx",
  "abstract": {
    "background": "Acute aortic dissection (AAD) is a life-threatening cardiovascular emergency requiring early recognition, rapid diagnostic evaluation, timely intervention, and coordinated healthcare delivery. Despite advances in diagnostic imaging, medical management, cardiovascular surgery, and endovascular treatment, preventable delays in risk identification, diagnosis, referral, interhospital transfer, and definitive treatment remain important challenges. These limitations highlight the need to integrate evidence-based clinical practices with effective healthcare operations and organizational accountability.",
    "objective": "To synthesize contemporary evidence concerning AAD prevention, diagnosis, treatment, and healthcare delivery and propose an Evidence-Based Medicine–Integrated Rapid Response Framework (EBM-IRRF) to strengthen clinical coordination, operational readiness, and patient-centered care.",
    "methods": "This Perspective Article applies Systems-Based Scientific Reasoning (SBSR) to synthesize published clinical guidelines, registry investigations, observational studies, systematic reviews, and healthcare quality and implementation science literature. The proposed framework was conceptually developed using evidence-based medicine principles, the Donabedian Structure–Process–Outcome model, and implementation science concepts. No original patient-level data were collected or analyzed, and no prospective clinical validation was performed.",
    "results": "Results (Evidence Synthesis and Proposed Framework): The literature identifies persistent challenges involving delayed recognition, variable access to specialized aortic care, interhospital transfer, multidisciplinary coordination, and organizational readiness. EBM-IRRF integrates seven complementary components: (1) risk-based prevention and surveillance; (2) early recognition and diagnostic escalation; (3) coordinated regional referral and interhospital transfer; (4) multidisciplinary emergency readiness and definitive treatment; (5) continuous EBM support; (6) appropriately validated, clinician-supervised artificial intelligence assistance; and (7) tiered organizational leadership, accountability, and continuous quality improvement. The framework distinguishes established clinical practices from proposed organizational innovations, preserves clinical decision-making authority, and emphasizes that additional consultation or administrative escalation must not delay emergency treatment. Proposed evaluation indicators include diagnostic and treatment timeliness, transfer efficiency, complications, mortality, patient-centered outcomes, and unintended consequences.",
    "conclusions": "EBM-IRRF offers an integrated conceptual approach to addressing clinical and organizational challenges across the AAD care continuum. By connecting prevention, early recognition, regional collaboration, multidisciplinary response, continuous evidence-based decision support, and organizational accountability, the framework provides a foundation for developing and evaluating coordinated emergency-care strategies. Its feasibility, safety, effectiveness, and potential advantages over existing clinical pathways remain unproven and require prospective multicenter evaluation. The proposed approach emphasizes three complementary priorities: Prevent Earlier, Recognize Sooner, Treat Faster.",
    "keywords": [
      "acute aortic dissection",
      "evidence-based medicine",
      "rapid response framework",
      "healthcare operations",
      "regional aortic networks",
      "interhospital transfer",
      "multidisciplinary care",
      "artificial intelligence",
      "organizational accountability",
      "quality improvement"
    ]
  },
  "sections": [
    {
      "id": "1-introduction",
      "title": "1. Introduction",
      "level": 2,
      "paragraphs": [
        "Acute aortic dissection (AAD) remains a life-threatening cardiovascular emergency despite substantial advances in diagnostic imaging, medical management, cardiovascular surgery, and endovascular treatment. Improving patient outcomes requires attention not only to individual clinical interventions but also to prevention, early recognition, timely access to specialized care, multidisciplinary coordination, and continuity of healthcare delivery.¹˒² This article examines persistent clinical and organizational challenges, identifies gaps in existing scientific evidence, and presents nine questions concerning opportunities to improve AAD care. These questions guide the development of the proposed Evidence-Based Medicine–Integrated Rapid Response Framework (EBM-IRRF), initially focusing on AAD while considering its potential adaptability to other time-sensitive medical conditions."
      ]
    },
    {
      "id": "11-background-and-clinical-significance",
      "title": "1.1. Background and Clinical Significance",
      "level": 3,
      "paragraphs": [
        "AAD is a rapidly evolving cardiovascular emergency associated with potentially catastrophic complications. Separation of the aortic wall layers may result in aortic rupture, cardiac tamponade, acute aortic regurgitation, myocardial ischemia, cerebral or visceral malperfusion, multiorgan dysfunction, and death. Although less common than acute myocardial infarction or ischemic stroke, AAD requires immediate recognition and appropriate intervention because delays in diagnosis and treatment may substantially increase morbidity and mortality.¹⁻⁴",
        "Anatomical classification and clinical presentation are fundamental to AAD management and prognosis. Stanford type A dissection involves the ascending aorta and generally requires emergency surgical intervention, whereas uncomplicated type B dissection is initially managed medically, with endovascular or surgical intervention indicated according to complications and anatomical characteristics. Contemporary registries and systematic reviews continue to demonstrate substantial mortality associated with acute type A dissection, particularly among patients presenting with hemodynamic instability, malperfusion, or other life-threatening complications.¹⁻⁴",
        "Advances in cardiovascular medicine have substantially expanded diagnostic and therapeutic capabilities. Improvements in computed tomography angiography, echocardiography, anesthesiology, intensive care, cardiopulmonary bypass, cardiovascular surgery, and thoracic endovascular aortic repair have transformed contemporary AAD management. The 2022 American College of Cardiology/American Heart Association (ACC/AHA) guideline and the 2024 European Society of Cardiology (ESC) guideline provide comprehensive recommendations for risk assessment, diagnostic evaluation, medical stabilization, surgical and endovascular intervention, and longitudinal surveillance.¹˒² Nevertheless, AAD continues to cause considerable morbidity and mortality despite these advances.⁴",
        "Persistent adverse outcomes highlight the need to examine the entire AAD care continuum. Opportunities to improve outcomes extend from identifying susceptible individuals before dissection develops to recognizing acute symptoms, establishing a definitive diagnosis, initiating appropriate treatment, and maintaining long-term surveillance. Consequently, effective AAD management requires consideration of both established clinical interventions and the healthcare delivery processes supporting their timely application."
      ]
    },
    {
      "id": "12-persistent-clinical-and-healthcare-delivery-cha",
      "title": "1.2. Persistent Clinical and Healthcare Delivery Challenges",
      "level": 3,
      "paragraphs": [
        "Prevention and early risk identification remain important opportunities for reducing catastrophic aortic events. Hypertension, heritable connective tissue disorders, familial predisposition, and preexisting thoracic aortic enlargement are recognized risk factors. Current guidelines recommend appropriate blood pressure management, genetic and familial assessment when indicated, imaging surveillance, and prophylactic intervention for selected patients.¹˒² However, these preventive strategies depend on identifying susceptible individuals, maintaining patient engagement, and coordinating care among primary care and specialty services. Evidence concerning thoracic aortic aneurysm progression further supports individualized surveillance.5",
        "Early recognition is complicated by variable clinical presentations and diagnostic uncertainty. AAD may resemble acute coronary syndromes, stroke, pulmonary embolism, or other cardiovascular and abdominal emergencies. Clinical risk assessment, the Aortic Dissection Detection Risk Score, D-dimer testing in appropriately selected patients, and definitive imaging may support timely diagnosis, but their effectiveness depends on appropriate application and clinical escalation.¹˒²˒6 Delayed recognition may postpone specialist consultation and definitive treatment.",
        "Access to specialized treatment depends on institutional expertise, regional coordination, and emergency preparedness. Emergency management of type A dissection requires experienced cardiovascular teams, appropriate facilities, and rapid resource mobilization. Studies examining hospital case volume and interhospital transfer have identified associations between institutional experience, regionalized care, and clinical outcomes.7˒8 However, transfer decisions must balance access to specialized expertise against patient instability, transportation risks, and potential treatment delays.",
        "Multidisciplinary coordination is essential during time-critical emergency care. Emergency physicians, cardiologists, cardiovascular surgeons, radiologists, anesthesiologists, intensivists, nursing professionals, and transfer personnel must coordinate assessment, stabilization, and intervention. Studies of organized aortic response pathways and regional networks suggest improvements in selected care processes and outcomes, while consensus recommendations emphasize communication and standardized transfer procedures.9-11 Nevertheless, uncertainty remains regarding the optimal integration of multidisciplinary activities across different healthcare settings.",
        "Long-term surveillance is necessary to address complications extending beyond the initial hospitalization. Survivors may experience residual aortic enlargement, aneurysmal degeneration, recurrent dissection, or complications requiring additional intervention. Guideline-directed imaging, cardiovascular risk management, patient education, and coordinated follow-up are therefore essential components of comprehensive care. ¹˒² Together, these challenges demonstrate that improving AAD outcomes requires attention to prevention, emergency treatment, and continuity of care."
      ]
    },
    {
      "id": "13-knowledge-gaps-clinical-outcome-gaps-and-unmet-",
      "title": "1.3. Knowledge Gaps, Clinical Outcome Gaps, and Unmet Patient Needs",
      "level": 3,
      "paragraphs": [
        "Despite substantial advances in AAD management, persistent gaps between available medical knowledge and actual clinical outcomes remain a major concern. Contemporary guidelines provide comprehensive recommendations for prevention, diagnosis, treatment, and surveillance, while clinical investigations have examined surgical outcomes, hospital experience, regional aortic networks, and emergency response systems.¹˒²˒7⁻11 Nevertheless, preventable complications, delayed diagnosis, limited access to specialized treatment, and substantial mortality continue to affect patients.⁴ These challenges suggest that the central problem extends beyond gaps in scientific knowledge to include shortcomings in translating established evidence into timely, accessible, coordinated, and patient-centered care.",
        "Missed opportunities for prevention represent an important gap between patients' healthcare needs and existing clinical practice. Although established risk factors, surveillance recommendations, and preventive interventions provide opportunities to identify susceptible individuals before catastrophic events, some patients remain undiagnosed until an acute dissection occurs.¹˒²˒5 Inadequate risk recognition, inconsistent follow-up, limited patient education, and fragmented communication across healthcare settings may contribute to missed opportunities for earlier intervention. However, not all aortic dissections are predictable or preventable, and the proportion of events potentially avoidable through improved surveillance remains uncertain. These limitations highlight the need to investigate how evidence-based prevention can be more effectively implemented at home, in primary care, and throughout the healthcare system.",
        "Delayed recognition and diagnosis reveal critical gaps in timely responses to patients' emerging clinical needs. AAD may present with atypical or nonspecific manifestations that overlap with more common cardiovascular, neurological, and abdominal emergencies. Although validated risk assessment strategies and advanced imaging are available, diagnostic delays may occur when early warning signs are overlooked, clinical suspicion is insufficient, or specialist evaluation and imaging are not promptly initiated.¹˒²˒6 These challenges raise concerns about missed opportunities to recognize life-threatening disease before irreversible complications develop. Further investigation is needed to determine whether structured early-warning mechanisms, urgent reporting pathways, and parallel diagnostic escalation can reduce avoidable delays.",
        "Fragmented healthcare delivery may prevent patients from receiving appropriate treatment within critical therapeutic windows. Even after AAD is suspected or diagnosed, access to experienced specialists, advanced imaging, cardiovascular surgery, and intensive care may be constrained by institutional resources, geographical disparities, transfer arrangements, and sequential decision-making processes. Studies of hospital volume, interhospital transfer, regional aortic networks, and organized emergency response programs suggest that healthcare coordination and institutional experience may influence clinical outcomes.7-11 Nevertheless, uncertainty remains regarding how these established approaches can be integrated to minimize avoidable delays while maintaining patient safety and appropriate clinical decision-making.",
        "Unmet patient needs extend beyond emergency survival to encompass continuity, communication, participation, and long-term health outcomes. Patients require timely recognition of symptoms, access to qualified expertise, understandable information, appropriate involvement in clinical decisions, and coordinated follow-up after treatment. Survivors may face continuing risks of aortic enlargement, recurrent complications, and additional interventions requiring sustained surveillance.¹˒² Fragmentation between emergency services, hospitals, specialists, primary care, and patients may compromise continuity of care. These concerns highlight the importance of evaluating healthcare quality not only through procedural success and short-term mortality but also through timely access, patient safety, long-term outcomes, and responsiveness to patients' needs.",
        "Insufficient integration of clinical expertise, evidence-based medicine, emerging technologies, and organizational accountability represents an additional gap in healthcare delivery. Although multidisciplinary teams and specialized networks have demonstrated potential benefits, the incremental effectiveness of integrating prevention, early-warning systems, parallel emergency activation, continuous EBM support, and predefined organizational escalation remains uncertain.7-11 Artificial intelligence (AI) may assist diagnostic evaluation and clinical decision support, but its generalizability, safety, and clinical effectiveness require further validation.12 Organizational leadership may facilitate resource mobilization and communication, provided that operational authority remains appropriately distinguished from professional clinical responsibility. Whether these elements can collectively improve patient outcomes beyond established care pathways has not been demonstrated.",
        "The fundamental gap is therefore not merely insufficient scientific knowledge, but the continuing difference between what evidence-based healthcare could potentially provide and what patients actually receive when prevention, early recognition, timely treatment, and coordinated follow-up are needed. Addressing this gap requires examining failures and missed opportunities across the patient care continuum while recognizing that adverse outcomes do not necessarily indicate preventable errors. The proposed Evidence-Based Medicine–Integrated Rapid Response Framework (EBM-IRRF) seeks to connect established clinical practices with coordinated healthcare operations, emphasizing unmet patient needs, potentially avoidable delays, multidisciplinary readiness, and organizational accountability. Its proposed benefits remain unvalidated and require prospective investigation using measurable clinical, operational, and patient-centered outcomes."
      ]
    },
    {
      "id": "14-scientific-and-clinical-questions",
      "title": "1.4. Scientific and Clinical Questions",
      "level": 3,
      "paragraphs": [
        "The persistence of adverse outcomes in AAD raises nine interconnected questions concerning prevention, clinical decision-making, multidisciplinary coordination, emerging technologies, and healthcare operations. Although contemporary guidelines provide extensive recommendations for diagnosis and treatment, opportunities may remain to strengthen the continuity, timeliness, and coordination of care.¹˒²˒7-11 This SBSR-informed analysis addresses the following questions.",
        "Question 1. Healthcare Operations and Clinical Outcomes. How might evidence-based healthcare operations and organizational management further improve patient outcomes in AAD beyond advances in diagnostic technologies, medical management, and cardiovascular surgery?",
        "Question 2. Prevention and Risk Identification. How might coordinated prevention, risk assessment, patient education, and surveillance at home, in primary care, and throughout the healthcare system reduce the likelihood of catastrophic aortic events?",
        "Question 3. Early Warning and Diagnostic Escalation. Could structured urgent reporting and early-warning systems shorten the interval between the first clinically meaningful warning signal and appropriate expert medical evaluation?",
        "Question 4. Parallel Multidisciplinary Emergency Response. Could coordinated, parallel activation of emergency physicians, cardiovascular specialists, diagnostic imaging services, surgical teams, and other essential resources reduce diagnostic and treatment delays compared with predominantly sequential clinical processes?",
        "Question 5. Continuous Integration of Evidence-Based Medicine. How might evidence-based medicine (EBM) be incorporated continuously throughout prevention, diagnostic evaluation, treatment selection, multidisciplinary coordination, and long-term surveillance rather than primarily at isolated clinical decision points?",
        "Question 6. Multidisciplinary Expertise and Professional Accountability. Could structured multidisciplinary consultation, including expertise from specialized institutions when appropriate, improve complex emergency decision-making while preserving clearly defined clinical responsibilities and individual professional accountability?",
        "Question 7. Artificial Intelligence and Clinical Decision Support. What roles might appropriately validated, clinician-supervised AI technologies play in diagnostic evaluation, evidence retrieval, risk stratification, triage, communication, and healthcare operations without compromising patient safety or clinical judgment?",
        "Question 8. Organizational Leadership and Emergency Resource Coordination. When a life-threatening event requires institution-wide resources, could predefined organizational leadership and executive escalation pathways improve operational coordination, resource mobilization, and institutional accountability without interfering with clinical decision-making?",
        "Question 9. Broader Clinical Applicability. Could the underlying principles of EBM-IRRF, initially developed for AAD, be adapted to other time-critical cardiovascular and medical emergencies?",
        "These questions establish the conceptual foundation for examining opportunities to improve AAD care. They address prevention, early recognition, emergency treatment, continuous EBM, multidisciplinary expertise, technological support, and organizational accountability. The questions are exploratory rather than statistical hypotheses tested in the present article. Their investigation through narrative evidence synthesis and conceptual framework development may inform future prospective clinical and implementation research."
      ]
    },
    {
      "id": "15-purpose-and-objectives",
      "title": "1.5. Purpose and Objectives",
      "level": 3,
      "paragraphs": [
        "The purpose of this Perspective Article is to apply Systems-Based Scientific Reasoning (SBSR) to critically examine nine interconnected scientific and clinical questions concerning acute aortic dissection (AAD), synthesize relevant published evidence, and inform the conceptual development of the Evidence-Based Medicine–Integrated Rapid Response Framework (EBM-IRRF). The article explores how established clinical practices, multidisciplinary expertise, emerging technologies, and healthcare operations might be better integrated to support prevention, early recognition, timely treatment, and longitudinal management of AAD.",
        "The first objective is to synthesize contemporary scientific evidence addressing the clinical and organizational challenges underlying these questions. The review examines risk identification and prevention, diagnostic evaluation, medical and procedural treatment, regional aortic networks, interhospital transfer, multidisciplinary emergency response, continuous EBM, and emerging AI applications. Particular attention is directed toward distinguishing guideline-supported clinical practices from proposed strategies whose effectiveness remains uncertain.¹˒²˒7-11",
        "The second objective is to develop EBM-IRRF as a proposed integrated approach to addressing the identified challenges. The framework comprises four interconnected clinical and coordination components: (1) prevention and risk-based surveillance; (2) early recognition and diagnostic escalation; (3) regional referral and interhospital transfer; and (4) multidisciplinary emergency readiness and definitive treatment. Three cross-cutting enabling functions are incorporated: (5) continuous EBM support; (6) appropriately validated, clinician-supervised AI assistance; and (7) tiered organizational leadership, accountability, and continuous quality improvement. These components are intended to connect established clinical recommendations with coordinated healthcare operations across the AAD care continuum.",
        "The third objective is to identify opportunities for future clinical and implementation research. Potential evaluation indicators include diagnostic timeliness, emergency activation, interhospital transfer efficiency, treatment initiation, complications, mortality, surveillance adherence, patient safety, and organizational performance. Although initially developed for AAD, EBM-IRRF may offer principles adaptable to other time-sensitive medical conditions. However, its feasibility, safety, clinical effectiveness, incremental benefits, and broader applicability require independent prospective evaluation.",
        "Together, these objectives provide a structured approach to exploring the nine scientific and clinical questions without implying that definitive answers have been established. The proposed framework represents an evidence-informed conceptual synthesis rather than an implemented or clinically validated intervention."
      ]
    },
    {
      "id": "16-scientific-and-clinical-contributions",
      "title": "1.6. Scientific and Clinical Contributions",
      "level": 3,
      "paragraphs": [
        "The principal scientific contribution of EBM-IRRF is its proposed integration of established clinical evidence with coordinated healthcare operations across the AAD care continuum. Rather than introducing a new diagnostic procedure or therapeutic intervention, the framework organizes existing clinical practices and proposed operational innovations into a coherent conceptual approach. This integration is informed by foundational EBM principles, the Donabedian structure–process–outcome model, and established implementation-science concepts.13-15",
        "The proposed clinical contribution is a structured approach connecting prevention, early recognition, specialized treatment, and longitudinal surveillance. EBM-IRRF emphasizes timely diagnostic escalation, multidisciplinary readiness, regional coordination, continuous evidence appraisal, and organizational accountability. These components are intended to support individualized clinical judgment and guideline-directed treatment rather than replace established standards of care.",
        "The framework also provides a conceptual foundation for evaluating healthcare delivery improvements. Potential outcomes include earlier identification of high-risk patients, shorter diagnostic and treatment intervals, improved transfer coordination, appropriate resource utilization, fewer preventable complications, and stronger continuity of care. However, these are proposed areas for evaluation, not demonstrated benefits attributable to EBM-IRRF.",
        "The broader scientific contribution may extend beyond AAD if the framework's underlying principles prove adaptable to other time-sensitive conditions. Such adaptation would require disease-specific clinical pathways, appropriate professional expertise, implementation assessment, and independent validation. The present article does not establish effectiveness for AAD or other medical emergencies.",
        "The overarching proposition is that further improvements in AAD outcomes may require both effective clinical interventions and their timely, coordinated application throughout the patient care continuum. Prevent Earlier, Recognize Sooner, Treat Faster summarizes this proposed direction, emphasizing prevention whenever possible, earlier recognition when acute disease occurs, and timely evidence-informed treatment. Prospective multicenter investigations are necessary to determine whether EBM-IRRF provides measurable benefits beyond existing guideline-supported care."
      ]
    },
    {
      "id": "2-literature-review",
      "title": "2. Literature Review",
      "level": 2,
      "paragraphs": [
        "Purpose: This literature review critically examines published scientific evidence concerning the epidemiology, pathophysiology, prevention, diagnosis, treatment, and healthcare delivery of acute aortic dissection (AAD). Particular attention is given to persistent gaps between established clinical knowledge and patient outcomes, including missed preventive opportunities, diagnostic delays, limited access to specialized treatment, and fragmented care. The review also evaluates the evolution of AAD management, regional aortic networks, multidisciplinary emergency response, evidence-based medicine (EBM), organizational leadership, and emerging artificial intelligence (AI) applications. These findings inform the proposed Evidence-Based Medicine–Integrated Rapid Response Framework (EBM-IRRF) without implying that the framework has undergone clinical validation."
      ]
    },
    {
      "id": "21-epidemiology-pathophysiology-and-clinical-progr",
      "title": "2.1. Epidemiology, Pathophysiology, and Clinical Progression",
      "level": 3,
      "paragraphs": [
        "AAD remains a relatively uncommon but potentially catastrophic cardiovascular emergency associated with substantial morbidity and mortality. Population-based investigations have estimated an annual incidence of several cases per 100,000 persons, although estimates vary according to case ascertainment, population characteristics, and diagnostic practices. The Oxford Vascular Study demonstrated the importance of premorbid cardiovascular risk factors and highlighted the potential for fatal events before hospital presentation.¹⁶ Despite advances in diagnosis and treatment, contemporary registry-based evidence continues to demonstrate substantial mortality, particularly among patients with acute type A dissection.⁴",
        "Aortic dissection develops when blood separates layers of the aortic wall, usually following disruption of the intima and entry into the media. Propagation may produce a false lumen, compromise branch-vessel perfusion, and cause myocardial ischemia, neurological injury, visceral malperfusion, renal dysfunction, aortic regurgitation, cardiac tamponade, or rupture.¹˒² The severity and progression of these complications depend on anatomical involvement, hemodynamic instability, malperfusion, and the timeliness of appropriate intervention.",
        "The Stanford classification provides a clinically important distinction between type A and type B dissection. Type A dissection involves the ascending aorta and generally requires emergency surgical intervention because of the risk of rapidly fatal complications. Type B dissection does not involve the ascending aorta and is commonly managed initially with intensive medical therapy when uncomplicated. Endovascular or surgical intervention may be indicated when rupture, malperfusion, progressive enlargement, persistent symptoms, or other complications develop.¹˒²",
        "The International Registry of Acute Aortic Dissection (IRAD) has substantially advanced understanding of AAD presentation, diagnosis, management, and outcomes. Its foundational investigation characterized the clinical heterogeneity and substantial mortality associated with the disease.³ Subsequent longitudinal analyses documented changes in diagnostic practices, treatment strategies, and outcomes over time, demonstrating both progress and persistent challenges.¹⁷",
        "Contemporary outcomes remain strongly influenced by clinical severity and physiological complications. A recent systematic review of type A dissection mortality confirmed the continuing burden of adverse outcomes across contemporary registries.⁴ Additional evidence examining clinical severity classifications and postoperative survival highlights the importance of hemodynamic instability, malperfusion, and other complications in risk stratification.¹⁸",
        "These findings establish AAD as both a cardiovascular emergency and a healthcare delivery challenge. Although disease progression may be rapid and unpredictable, timely recognition, appropriate diagnostic evaluation, specialist involvement, and access to definitive treatment remain central to improving outcomes."
      ]
    },
    {
      "id": "22-risk-factors-prevention-and-surveillance",
      "title": "2.2. Risk Factors, Prevention, and Surveillance",
      "level": 3,
      "paragraphs": [
        "Prevention represents the earliest opportunity to reduce the risk of catastrophic aortic events. Contemporary guidelines identify hypertension, heritable thoracic aortic diseases, familial predisposition, bicuspid aortic valve–associated aortopathy, and preexisting aortic enlargement as important risk factors.¹˒² Preventive strategies therefore require both modification of recognized cardiovascular risks and identification of patients who may benefit from targeted surveillance or prophylactic intervention.",
        "Hypertension is a major modifiable risk factor for AAD. Chronic elevation of arterial pressure increases mechanical stress on the aortic wall and is highly prevalent among patients presenting with dissection.³ Population-based evidence also identifies opportunities for improved premorbid blood pressure management.¹⁶ Appropriate hypertension control is therefore central to preventive care, particularly among individuals with known aortic disease.",
        "Heritable thoracic aortic disorders require individualized risk assessment and surveillance. Marfan syndrome, Loeys-Dietz syndrome, vascular Ehlers-Danlos syndrome, and other genetically mediated aortopathies may predispose affected individuals to aneurysm formation and dissection, sometimes at younger ages or smaller aortic diameters than those associated with sporadic disease.¹˒² Genetic evaluation, family screening, specialist consultation, and individualized intervention thresholds are important when clinically indicated.",
        "Familial risk assessment may identify susceptible individuals before a catastrophic event occurs. A family history of thoracic aortic aneurysm, dissection, or unexplained premature sudden death may warrant additional evaluation. Guideline-directed screening of appropriate relatives and genetic counseling can support earlier recognition of inherited aortic disease.¹˒² However, the effectiveness of these strategies depends on patient awareness, communication, access to appropriate services, and continuity of follow-up.",
        "Thoracic aortic aneurysm surveillance provides opportunities to identify disease progression before dissection or rupture. Imaging intervals and preventive intervention thresholds depend on aortic dimensions, growth rates, anatomical location, genetic conditions, and other clinical characteristics.¹˒² A recent systematic review and meta-analysis demonstrated variability in thoracic aortic aneurysm growth, supporting individualized surveillance rather than uniform assumptions about progression.5",
        "Preventive interventions must balance anticipated benefits against procedural and patient-specific risks. Elective aortic repair may be indicated for selected patients with significant enlargement, rapid growth, high-risk genetic conditions, or other established indications.¹˒² Appropriate decisions require specialist assessment and shared decision-making informed by contemporary evidence.",
        "A persistent clinical outcome gap concerns potentially missed opportunities for prevention. Some patients with recognizable risk factors or previously documented aortic abnormalities may not receive timely assessment, appropriate surveillance, or specialist referral. However, the proportion of AAD events that could be prevented through improved screening and surveillance remains uncertain. Prevention should therefore be evaluated through measurable indicators such as risk recognition, surveillance adherence, referral completion, and appropriate preventive intervention rather than assumptions that all dissections are avoidable."
      ]
    },
    {
      "id": "23-clinical-presentation-and-early-recognition",
      "title": "2.3. Clinical Presentation and Early Recognition",
      "level": 3,
      "paragraphs": [
        "Early recognition remains difficult because AAD can present with diverse symptoms and imitate more common medical emergencies. Abrupt severe chest, back, or abdominal pain is characteristic, but patients may also present with syncope, neurological deficits, pulse abnormalities, hypotension, malperfusion, or other atypical manifestations.¹⁻³ The resulting diagnostic uncertainty may delay definitive imaging, specialist consultation, and treatment.",
        "Diagnostic assessment requires integration of clinical history, examination findings, risk stratification, and appropriate imaging. The Aortic Dissection Detection Risk Score (ADD-RS) incorporates predisposing conditions, pain characteristics, and examination findings. A 2024 systematic review and meta-analysis evaluated the diagnostic accuracy of ADD-RS alone and in combination with D-dimer testing, supporting the potential usefulness of structured risk-based approaches.6 Nevertheless, diagnostic performance varies with patient selection and testing thresholds, and a negative D-dimer result cannot universally exclude acute aortic syndrome.",
        "Contemporary diagnostic reviews emphasize the importance of maintaining clinical suspicion when presentations are atypical or potentially misleading. Recent reviews discuss the differential diagnosis, limitations of individual diagnostic findings, and the need to select imaging promptly when suspicion is clinically meaningful.¹⁹˒²⁰ Diagnostic strategies must account for the consequences of both missed disease and unnecessary testing.",
        "The interval between the first meaningful warning signal and definitive evaluation represents a potentially important clinical performance measure. Delays may arise from failure to recognize symptoms, inadequate escalation, limited imaging availability, or fragmented communication. Although structured assessment may support decision-making, the incremental effectiveness of proposed early-warning and urgent-reporting systems requires direct investigation.",
        "These findings support evaluating early recognition as a coordinated clinical process rather than an isolated diagnostic decision. Patient education, primary care assessment, emergency triage, risk stratification, imaging access, and specialist communication may all influence the timeliness of diagnosis."
      ]
    },
    {
      "id": "24-diagnostic-imaging",
      "title": "2.4. Diagnostic Imaging",
      "level": 3,
      "paragraphs": [
        "Rapid and accurate imaging is fundamental to confirming AAD, defining its anatomical extent, and guiding treatment. Contemporary guidelines recommend selecting diagnostic modalities according to clinical suspicion, hemodynamic stability, patient characteristics, and institutional capabilities.¹˒² No single modality is optimal for every clinical circumstance.",
        "Computed tomography angiography (CTA) is a principal diagnostic modality because of its speed, availability, and detailed anatomical visualization. CTA can identify dissection extent, true and false lumens, branch-vessel involvement, and associated complications.¹˒² Appropriate imaging protocols are important for accurate interpretation and procedural planning.",
        "Transesophageal echocardiography (TEE) provides valuable information in selected unstable patients and circumstances where immediate bedside evaluation is needed. TEE can assess proximal aortic abnormalities, aortic regurgitation, and cardiac complications, including tamponade.¹˒² Its usefulness depends on operator expertise, patient condition, and the anatomical regions requiring evaluation.",
        "Transthoracic echocardiography (TTE) can support initial cardiovascular assessment but cannot reliably exclude all aortic dissections. TTE may identify proximal aortic abnormalities, pericardial effusion, aortic regurgitation, and ventricular dysfunction. However, limited visualization of portions of the thoracic aorta reduces its ability to provide comprehensive assessment.¹˒²",
        "Magnetic resonance imaging (MRI) offers detailed anatomical information but is often less practical during rapidly evolving emergencies. MRI may be useful for selected patients and longitudinal surveillance, although examination duration, monitoring requirements, and availability may limit emergency application.¹˒²",
        "The clinical value of advanced imaging depends not only on diagnostic accuracy but also on timely access and appropriate interpretation. Diagnostic delays may persist when clinical suspicion is insufficient, imaging resources are unavailable, or communication between emergency clinicians and imaging specialists is fragmented. Consequently, imaging performance should be evaluated alongside operational indicators such as time to imaging, time to interpretation, and time to specialist notification."
      ]
    },
    {
      "id": "25-contemporary-medical-surgical-and-endovascular-",
      "title": "2.5. Contemporary Medical, Surgical, and Endovascular Treatment",
      "level": 3,
      "paragraphs": [
        "Contemporary AAD management requires rapid stabilization and treatment decisions guided by anatomical classification, clinical severity, and complications. The 2022 ACC/AHA and 2024 ESC guidelines provide recommendations concerning anti-impulse therapy, emergency surgical intervention, thoracic endovascular aortic repair, multidisciplinary management, and longitudinal surveillance.¹˒²",
        "Initial medical management aims to reduce aortic wall stress while maintaining adequate organ perfusion. Appropriate heart rate and blood pressure control, analgesia, and close monitoring are central to stabilization.¹˒² However, treatment must be individualized because hypotension, shock, tamponade, or malperfusion may require urgent intervention and different hemodynamic priorities.",
        "Acute Stanford type A dissection generally requires emergency surgical treatment. Surgical intervention aims to address the proximal aortic pathology, prevent or treat rupture and tamponade, and restore or preserve adequate circulation.¹˒² Contemporary outcome studies demonstrate that mortality remains substantial and varies according to patient severity, institutional experience, and treatment circumstances.⁴˒⁹",
        "Uncomplicated Stanford type B dissection is generally managed initially with intensive medical therapy and surveillance. Thoracic endovascular aortic repair or surgical intervention may be indicated when rupture, malperfusion, progressive enlargement, extension, uncontrolled hypertension, or persistent symptoms develop.¹˒² A contemporary IRAD investigation documented changes in type B dissection management and outcomes, reflecting the increasing role of endovascular treatment and evolving clinical selection.²¹",
        "Treatment outcomes depend on more than the technical success of an individual procedure. Clinical presentation, malperfusion, hemodynamic instability, institutional experience, treatment timing, and postoperative care may influence survival and complications. A contemporary nationwide registry investigation provides additional evidence concerning survival after surgical repair of type A dissection.²²",
        "Emergency treatment also creates substantial demands for healthcare coordination. Definitive intervention may require immediate access to experienced surgeons, anesthesiologists, perfusionists, intensive care personnel, blood products, and operating-room resources. Whether more structured coordination can independently improve outcomes beyond established treatment pathways remains an important research question."
      ]
    },
    {
      "id": "26-evolution-of-aad-management",
      "title": "2.6. Evolution of AAD Management",
      "level": 3,
      "paragraphs": [
        "AAD management has evolved substantially through advances in diagnostic imaging, cardiovascular surgery, endovascular intervention, and multidisciplinary care. Earlier management was constrained by limited diagnostic capabilities and high procedural risks. Subsequent developments in cross-sectional imaging, cardiopulmonary bypass, surgical techniques, anesthesia, and intensive care expanded opportunities for diagnosis and definitive treatment.²³",
        "The development of contemporary imaging transformed the recognition and anatomical assessment of AAD. Improvements in CTA, echocardiography, and MRI enabled more accurate identification of dissection extent and associated complications.¹˒² These technologies also improved procedural planning and surveillance, although timely access remains essential.",
        "Advances in cardiovascular surgery have improved the feasibility of treating complex proximal aortic disease. Refinements in operative techniques, cerebral and organ protection, anesthesia, perfusion, and postoperative care have contributed to contemporary treatment capabilities.²³ However, type A dissection remains associated with substantial mortality, particularly among patients presenting with shock, malperfusion, or other complications.⁴",
        "Endovascular treatment has substantially changed the management of selected patients with type B dissection. The expanding use of thoracic endovascular aortic repair has provided an important alternative to open surgery for appropriate anatomical and clinical indications. Contemporary IRAD findings demonstrate changes in treatment patterns and outcomes, although treatment selection continues to depend on complication status and individual risk.²¹",
        "The evolution of AAD management increasingly includes specialized centers and multidisciplinary coordination. Observational studies have identified associations between institutional experience, regionalized care, and outcomes, while organized response programs have examined the effects of coordinated emergency pathways.7⁻¹¹ These developments suggest that healthcare organization has become an important complement to technological and procedural advances.",
        "Despite historical progress, persistent adverse outcomes demonstrate that improved clinical capabilities do not eliminate the need for further healthcare delivery improvements. The evolution of AAD management therefore supports examining whether prevention, early recognition, specialized treatment, and coordinated operations can be integrated more effectively.",
        "__TABLE_REF__:Table 1. Evolution of Evidence-Based Diagnosis and Management of Acute Aortic Dissection"
      ]
    },
    {
      "id": "27-regional-aortic-networks-and-interhospital-tran",
      "title": "2.7. Regional Aortic Networks and Interhospital Transfer",
      "level": 3,
      "paragraphs": [
        "Regionalized aortic care has emerged as an important strategy for improving access to specialized expertise. Acute type A dissection frequently requires complex emergency surgery and intensive perioperative management. Observational investigations have examined whether hospital experience, case volume, and referral patterns are associated with patient outcomes.7˒8",
        "Hospital case volume has been associated with outcomes following type A dissection repair. Contemporary investigations have evaluated institutional surgical experience and survival, including studies examining optimal annual case volume and variation between centers.²⁸˒²⁹ These findings support considering institutional expertise when organizing regional services, although volume alone does not capture every dimension of healthcare quality.",
        "Interhospital transfer may improve access to specialized treatment but also introduces important risks. A U.S. investigation of Medicare beneficiaries examined transfer patterns and regionalization in acute type A dissection.7 Transfer decisions require balancing potential benefits from specialized care against hemodynamic instability, transport duration, and delays in definitive intervention.",
        "Structured transfer protocols may improve communication and receiving-center preparedness. The TRAVERSING Delphi consensus study identified recommendations concerning interhospital transfer of patients with acute aortic syndromes.11 A direct-to-operating-room transfer program has also been described as an approach to expediting management of selected patients with type A dissection.³⁰ Such programs require appropriate patient selection, advance communication, and readiness of receiving teams.",
        "Regional networks and organized aortic response programs provide evidence supporting coordinated care. Implementation of an Aorta Code pathway was associated with improvements in selected early outcomes, while a regional network combined with a systematic multidisciplinary approach was associated with favorable outcomes in another observational investigation.9˒10 These findings are clinically relevant but should not be interpreted as proof that every proposed component of a comprehensive operational framework is independently effective.",
        "Interinstitutional outcome comparisons further demonstrate variation in AAD treatment results. Multicenter analyses have examined differences in outcomes after type A dissection surgery, reinforcing the importance of evaluating institutional practices and patient characteristics.³¹",
        "Regionalization should therefore be considered a coordinated clinical and operational strategy rather than a universal transfer requirement. The optimal pathway depends on patient stability, available expertise, geographical constraints, transport resources, and the readiness of receiving institutions. Future research should assess transfer time, treatment initiation, complications, mortality, and patient safety when comparing regional care models."
      ]
    },
    {
      "id": "28-multidisciplinary-emergency-response-and-health",
      "title": "2.8. Multidisciplinary Emergency Response and Healthcare Operations",
      "level": 3,
      "paragraphs": [
        "AAD emergency management requires coordination among multiple clinical disciplines and operational services. Emergency physicians, cardiologists, cardiovascular and vascular surgeons, radiologists, anesthesiologists, intensivists, nurses, perfusionists, transfusion services, and operating-room personnel may all contribute to timely care.¹˒² Effective coordination requires clear communication, appropriate clinical leadership, and access to essential resources.",
        "Organized response pathways may reduce delays associated with fragmented emergency processes. Aorta Code implementation and regional multidisciplinary programs have been associated with improvements in selected outcomes.9˒10 A collaborative evaluation of acute aortic syndrome pathways also highlights the importance of examining variation in existing systems and opportunities for coordinated improvement.³²",
        "Parallel multidisciplinary activation represents a potentially useful operational strategy requiring further evaluation. Rather than waiting for every preceding step to be completed, selected activities—such as specialist notification, operating-room preparation, blood-product coordination, and transfer arrangements—may be initiated concurrently when clinically appropriate. However, premature activation may create unnecessary resource use, and the incremental benefits of parallel activation over existing pathways have not been established through prospective evaluation.",
        "Operating-room readiness and resource mobilization may influence treatment timeliness. Emergency surgical care requires coordination of personnel, equipment, anesthesia, perfusion, intensive care, and transfusion resources. A systematic review and meta-analysis examining off-hours surgery and mortality in type A dissection illustrates the relevance of organizational circumstances to treatment outcomes, although such associations do not independently establish the effectiveness of specific operational interventions.³³",
        "Professional communication and accountability are essential to safe multidisciplinary care. Structured communication may facilitate timely consultation, clarify responsibilities, and reduce avoidable duplication or delays. Nevertheless, multidisciplinary coordination must preserve the authority and responsibility of qualified clinicians to make patient-specific decisions.",
        "Healthcare operations should ultimately be evaluated through patient-centered clinical and process outcomes. Relevant indicators include time to diagnosis, time to specialist consultation, transfer efficiency, operating-room readiness, treatment initiation, complications, mortality, and resource utilization. These measures can help distinguish operational improvements from assumptions about clinical effectiveness."
      ]
    },
    {
      "id": "29-evidence-based-medicine-healthcare-quality-and-",
      "title": "2.9. Evidence-Based Medicine, Healthcare Quality, and Organizational Leadership",
      "level": 3,
      "paragraphs": [
        "EBM provides a foundational approach for integrating the best available scientific evidence with clinical expertise and patient values. The foundational definition emphasizes the conscientious and judicious use of current best evidence in decisions concerning individual patient care.13 In AAD management, EBM supports appropriate risk assessment, diagnostic evaluation, treatment selection, and longitudinal surveillance.",
        "Continuous EBM integration may provide opportunities to strengthen decision-making throughout the patient care continuum. Evidence appraisal should inform not only definitive treatment but also prevention, diagnostic escalation, specialist consultation, transfer decisions, and follow-up. However, the effectiveness of a formalized continuous EBM support function within an emergency response framework remains a proposed strategy requiring evaluation.",
        "The Donabedian structure–process–outcome model provides a useful conceptual foundation for examining healthcare quality. Healthcare structures include personnel, facilities, equipment, and organizational resources; processes include diagnostic assessment, communication, treatment, and coordination; outcomes include patient safety, complications, mortality, and longer-term health status.14 This model supports examining how institutional preparedness and care processes may influence clinical outcomes.",
        "Implementation science offers additional guidance for translating evidence into routine healthcare practice. The updated Consolidated Framework for Implementation Research (CFIR) identifies domains relevant to implementation, including intervention characteristics, organizational context, individuals, and implementation processes.15 A subsequent CFIR user guide provides structured guidance for applying the framework in implementation research.³⁴ These concepts may inform future evaluation of EBM-IRRF feasibility, adoption, implementation fidelity, and sustainability.",
        "Organizational leadership can support emergency preparedness, resource coordination, and continuous quality improvement. Hospital administrators and clinical leaders may establish appropriate staffing, communication systems, transfer agreements, quality monitoring, and escalation procedures. However, operational leadership must remain distinct from professional clinical authority, and executive involvement should not delay or override urgent clinical decisions.",
        "The proposed contribution of EBM-IRRF is to connect evidence-based clinical care with organizational structures and processes. This conceptual integration is consistent with established EBM, healthcare quality, and implementation-science principles, but the framework itself has not demonstrated improved patient outcomes."
      ]
    },
    {
      "id": "210-emerging-artificial-intelligence-applications",
      "title": "2.10. Emerging Artificial Intelligence Applications",
      "level": 3,
      "paragraphs": [
        "AI technologies are being investigated for potential applications in aortic disease diagnosis, classification, risk assessment, and clinical decision support. A recent systematic review and meta-analysis examined AI approaches for detecting and classifying aortic dissection, identifying promising applications while highlighting the need for further validation.12",
        "AI-assisted imaging may support the identification of aortic abnormalities and potentially improve diagnostic workflows. Investigations have explored automated CT-based detection and workflow support, including applications involving abdominal aortic dissection.²⁴ Such findings suggest potential opportunities for diagnostic assistance but do not establish generalizable effectiveness across different institutions, imaging systems, and patient populations.",
        "AI-based risk prediction represents another emerging area of investigation. Deep learning approaches have been developed for identifying AAD from electrocardiographic data and estimating risks such as mesenteric malperfusion.²⁵˒²⁶ These models may support future risk stratification, but performance must be assessed through appropriate external validation and prospective clinical evaluation before routine implementation.",
        "Broader reviews of AI in aortic disease describe potential applications extending beyond diagnostic classification. These include image analysis, disease characterization, and predictive modeling.²⁷ However, evidence supporting AI for real-time multidisciplinary communication, transfer coordination, or organizational decision-making in AAD remains substantially less developed than evidence concerning imaging-related applications.",
        "Patient safety, transparency, clinical generalizability, and professional accountability remain essential considerations. AI systems may produce inaccurate classifications, perform inconsistently across populations, or fail under changing clinical conditions. Their use should therefore remain subject to appropriate validation, clinician oversight, data governance, and continuous performance monitoring.³⁵ For studies involving large language models, the TRIPOD-LLM reporting guideline provides recommendations to improve transparency and completeness in reporting model development and evaluation.³⁶",
        "Within EBM-IRRF, AI is proposed as a potential supporting function rather than an autonomous clinical decision-maker. Its role would be to assist qualified professionals with appropriately validated tasks while preserving clinical judgment and accountability. Whether AI integration improves diagnostic timeliness, treatment coordination, or patient outcomes remains an empirical question."
      ]
    },
    {
      "id": "211-synthesis-of-the-literature-and-remaining-know",
      "title": "2.11. Synthesis of the Literature and Remaining Knowledge Gaps",
      "level": 3,
      "paragraphs": [
        "The reviewed literature demonstrates substantial progress in understanding and treating AAD but also identifies persistent gaps in clinical outcomes and healthcare delivery. Contemporary guidelines establish comprehensive recommendations for risk assessment, diagnosis, treatment, and surveillance.¹˒² Registry investigations, systematic reviews, and observational studies document evolving treatment strategies, institutional variation, and continuing mortality.³˒⁴˒¹⁷",
        "Prevention remains an important but incompletely realized opportunity. Established risk factors, familial assessment, imaging surveillance, and prophylactic intervention provide mechanisms for reducing risk among selected patients.¹˒²˒5 Nevertheless, the extent to which missed recognition, inconsistent surveillance, or fragmented preventive care contributes to avoidable AAD events requires further investigation.",
        "Early recognition and timely treatment remain central clinical challenges. Diagnostic uncertainty, atypical presentations, limited imaging access, and delayed escalation may compromise timely care.6˒¹⁹˒²⁰ Similarly, institutional resources, transfer arrangements, and specialist availability may influence access to definitive treatment.7˒8˒11",
        "Evidence concerning regional networks and multidisciplinary response supports the importance of healthcare organization but does not establish the effectiveness of comprehensive integration. Studies of hospital volume, regionalization, Aorta Code programs, and multidisciplinary networks suggest associations with selected clinical and operational outcomes.7-10 However, observational designs, institutional differences, and potential confounding limit causal interpretation.",
        "Emerging technologies and implementation frameworks provide additional opportunities but require careful evaluation. AI applications show potential in imaging and risk prediction, while EBM, healthcare quality models, and implementation science offer established conceptual foundations for organizing care.12-15 The incremental benefits of integrating these elements into a unified emergency response framework remain unknown.",
        "The principal unmet need is therefore not simply additional clinical knowledge, but more reliable delivery of timely, coordinated, evidence-based, and patient-centered care. Patients may require earlier risk identification, prompt recognition of warning signs, rapid diagnostic evaluation, access to specialized treatment, effective multidisciplinary communication, and sustained longitudinal surveillance. Existing evidence supports many individual practices, but their comprehensive integration has not been prospectively validated.",
        "These findings provide the rationale for proposing EBM-IRRF as an evidence-informed conceptual framework. Its seven components integrate prevention and surveillance, early recognition, regional referral and transfer, multidisciplinary emergency readiness and treatment, continuous EBM support, clinician-supervised AI assistance, and organizational leadership with quality improvement. The framework is intended to guide future investigation rather than establish the effectiveness of an implemented intervention.",
        "Prospective multicenter research is necessary to determine whether EBM-IRRF can improve clinical and operational outcomes beyond existing guideline-supported care. Future studies should assess feasibility, safety, implementation fidelity, diagnostic and treatment timeliness, complications, mortality, patient-centered outcomes, and resource utilization."
      ]
    },
    {
      "id": "3-materials-and-methods",
      "title": "3. Materials and Methods",
      "level": 2,
      "paragraphs": [
        "This article applied Systems-Based Scientific Reasoning (SBSR), integrating a targeted review of published literature, critical evidence synthesis, and conceptual framework development. The methodology was designed to examine established scientific evidence concerning acute aortic dissection (AAD), identify persistent clinical and healthcare delivery challenges, and develop the proposed Evidence-Based Medicine–Integrated Rapid Response Framework (EBM-IRRF). Particular attention was given to opportunities for improving prevention, early recognition, multidisciplinary coordination, timely treatment, and continuity of care. No original patient data were collected, no statistical analyses were performed, and no clinical intervention was implemented."
      ]
    },
    {
      "id": "31-study-design",
      "title": "3.1. Study Design",
      "level": 3,
      "paragraphs": [
        "Systems-Based Scientific Reasoning (SBSR) was operationally defined as an integrative, evidence-informed conceptual reasoning approach combining empirical insights from clinical practice, expertise in basic biomedical and social science research, established scientific methodologies, and emerging interdisciplinary advances to address complex challenges in human health. Grounded in evidence-based medicine (EBM), systems science, critical scientific reasoning, and implementation science, SBSR encompasses the interconnected biological, clinical, technological, organizational, environmental, socioeconomic, and policy dimensions of health. It bridges foundational scientific principles and established research methodologies with advances in molecular and translational medicine, systems biology, precision medicine, artificial intelligence (AI), and healthcare innovation. By examining interdependencies across these domains, SBSR seeks to integrate clinical experience, scientific evidence, and multidisciplinary expertise into practical, scientifically grounded, and evaluable strategies for improving healthcare quality, operational effectiveness, and patient outcomes.",
        "SBSR applies critical evidence appraisal, multidisciplinary scientific reasoning, systems-level analysis, and conceptual integration to identify evidence-to-practice gaps and inform actionable healthcare strategies. Drawing on EBM principles, Donabedian's structure–process–outcome model, and the Consolidated Framework for Implementation Research (CFIR), SBSR provides a structured conceptual approach to evaluating alternative solutions, examining organizational accountability, and informing continuous quality improvement.¹³⁻¹⁵ In this Perspective Article, SBSR was applied through a targeted literature review, thematic evidence synthesis, and conceptual framework development to examine clinical and organizational challenges in acute aortic dissection (AAD) care and inform the proposed Evidence-Based Medicine–Integrated Rapid Response Framework (EBM-IRRF). SBSR represents an author-defined integration of established scientific approaches, clinical experience, and multidisciplinary research perspectives rather than an independently validated methodology or clinical intervention. Future research should further refine and evaluate the methodological transparency, reproducibility, practical utility, and generalizability of SBSR across diverse clinical, biomedical research, healthcare management, and public health contexts.",
        "The study was not designed as a systematic review, meta-analysis, or original clinical investigation. Consequently, the methodology did not involve a prospectively registered review protocol, exhaustive systematic searching, pooled effect estimates, or statistical hypothesis testing. The resulting framework represents a proposed conceptual approach rather than an intervention whose effectiveness has been established."
      ]
    },
    {
      "id": "32-literature-search-strategy",
      "title": "3.2. Literature Search Strategy",
      "level": 3,
      "paragraphs": [
        "A targeted literature review was undertaken to identify publications relevant to contemporary AAD management and associated healthcare delivery challenges. PubMed was the primary scientific literature database used to identify clinical guidelines, systematic reviews, registry investigations, observational studies, and relevant conceptual publications. The review emphasized evidence published from 2021 through 2026, while retaining earlier foundational investigations and conceptual works when necessary to establish the historical and scientific context.",
        "The literature search focused on major clinical and organizational topics relevant to the objectives of the manuscript. Search concepts included acute aortic dissection, acute aortic syndrome, type A aortic dissection, type B aortic dissection, aortic aneurysm, prevention, risk factors, surveillance, early diagnosis, diagnostic delay, computed tomography angiography, emergency surgery, thoracic endovascular aortic repair, hospital volume, regionalization, interhospital transfer, multidisciplinary care, emergency response, healthcare operations, evidence-based medicine, quality improvement, and artificial intelligence.",
        "Relevant search concepts were considered individually and in combinations to identify publications addressing specific clinical and healthcare delivery questions. For example, diagnostic literature was examined in relation to clinical presentation, risk stratification, and imaging; treatment literature was considered in relation to medical, surgical, and endovascular management; and organizational literature was examined in relation to hospital volume, regional aortic networks, interhospital transfer, and multidisciplinary emergency response.",
        "Priority was given to contemporary evidence, while foundational publications were retained when their historical or conceptual contributions remained relevant. Earlier investigations included the foundational International Registry of Acute Aortic Dissection (IRAD) study, subsequent registry analyses, population-based epidemiological investigations, and established publications concerning EBM and healthcare quality.³˒13˒14˒¹⁶˒¹⁷",
        "The search was intended to support a clinically focused narrative synthesis rather than an exhaustive assessment of all published evidence. Accordingly, no claim is made that every eligible publication was identified or that the search satisfied the methodological requirements of a systematic review."
      ]
    },
    {
      "id": "33-evidence-selection-and-evaluation",
      "title": "3.3. Evidence Selection and Evaluation",
      "level": 3,
      "paragraphs": [
        "Publications were selected according to their scientific credibility, clinical relevance, methodological characteristics, and applicability to AAD management or healthcare delivery. Particular consideration was given to contemporary clinical practice guidelines, systematic reviews and meta-analyses, multicenter registries, population-based investigations, observational outcome studies, and publications addressing implementation science and healthcare quality.",
        "Clinical guidelines and systematic reviews were prioritized when evaluating established diagnostic and therapeutic recommendations. The ACC/AHA and ESC guidelines served as principal sources for recommendations concerning prevention, surveillance, diagnostic imaging, hemodynamic stabilization, surgical intervention, endovascular treatment, and longitudinal follow-up.¹˒² Systematic reviews addressing mortality, diagnostic risk stratification, and thoracic aortic aneurysm progression were used to supplement guideline-supported clinical evidence.⁴˒5˒6",
        "Registry investigations and observational studies were evaluated for their contributions to understanding clinical outcomes and healthcare delivery. Evidence concerning hospital case volume, interhospital transfer, regionalization, multidisciplinary coordination, and organized aortic response pathways was considered particularly relevant to the proposed framework.7-11 Such findings were interpreted in relation to study design, clinical context, patient selection, and potential confounding rather than treated as definitive evidence of causality.",
        "Emerging technologies were evaluated separately from established clinical interventions. Publications concerning artificial intelligence (AI) in AAD diagnosis, imaging interpretation, and risk prediction were examined for their reported applications and methodological limitations.12˒²⁴⁻²⁷ Particular attention was given to the distinction between model development, retrospective validation, external validation, and demonstrated clinical effectiveness.",
        "The evaluation was qualitative rather than based on a formal numerical quality-scoring system. Methodological considerations included study design, population characteristics, relevance of reported outcomes, generalizability, and limitations identified in the publications. No formal risk-of-bias instrument, certainty-of-evidence grading procedure, or quantitative evidence weighting was applied.",
        "Evidence selection also considered the relevance of each publication to unresolved clinical and organizational challenges. These included potentially missed preventive opportunities, diagnostic uncertainty, treatment delays, limited access to specialized expertise, fragmented communication, and the need for coordinated healthcare resources. The purpose was to identify both established practices and areas requiring further investigation."
      ]
    },
    {
      "id": "34-evidence-synthesis",
      "title": "3.4. Evidence Synthesis",
      "level": 3,
      "paragraphs": [
        "The selected literature was synthesized narratively across major clinical and healthcare delivery themes. Clinical themes included epidemiology, pathophysiology, risk factors, prevention, surveillance, early recognition, diagnostic imaging, medical management, surgical intervention, endovascular treatment, and long-term follow-up. Organizational themes included institutional experience, regional referral systems, interhospital transfer, multidisciplinary emergency response, resource coordination, healthcare quality, and organizational accountability.",
        "Four categories of evidence and proposed practice were distinguished during synthesis.",
        "Established guideline-supported interventions. These included recognized preventive strategies, appropriate surveillance, diagnostic imaging, hemodynamic stabilization, emergency surgical treatment for type A dissection, selected endovascular interventions for type B dissection, and longitudinal follow-up.¹˒² These practices constituted the established clinical foundation of the proposed framework.",
        "Observational findings concerning healthcare delivery. Studies examining hospital volume, interhospital transfer, regional aortic networks, and organized multidisciplinary response programs were evaluated for associations with treatment processes and clinical outcomes.7-11˒²⁸⁻³² Their findings were considered supportive of further investigation into healthcare organization but insufficient to establish the causal effectiveness of a comprehensive integrated framework.",
        "Emerging technologies and investigational approaches. AI-assisted imaging, classification, and risk prediction were considered potential supporting technologies.12˒²⁴⁻²⁷ Their inclusion was limited to conceptual applications requiring appropriate validation, clinician oversight, and patient-safety evaluation.",
        "Proposed clinical and organizational innovations. Potential strategies included structured early-warning and diagnostic escalation, coordinated parallel activation of relevant clinical teams, continuous EBM support, predefined organizational escalation pathways, and integrated quality monitoring. These strategies were distinguished from established interventions because their combined effectiveness within EBM-IRRF has not been demonstrated.",
        "The synthesis emphasized the relationship between scientific capabilities and actual healthcare delivery. Particular attention was given to circumstances in which established diagnostic or therapeutic options may not translate into timely patient care because of recognition failures, communication barriers, resource limitations, or fragmented organizational processes. This distinction informed the identification of unmet patient needs and potential targets for future implementation research.",
        "__TABLE_REF__:Table 2. Evidence Sources, Evaluation Considerations, and Contributions to EBM-IRRF Development"
      ]
    },
    {
      "id": "35-conceptual-framework-development",
      "title": "3.5. Conceptual Framework Development",
      "level": 3,
      "paragraphs": [
        "EBM-IRRF was developed as an evidence-informed conceptual framework intended to integrate established clinical practices with coordinated healthcare operations. Its development drew on contemporary AAD guidelines, published investigations of healthcare delivery, EBM principles, Donabedian's healthcare quality model, and relevant implementation-science concepts.¹˒²˒⁵⁻⁷",
        "EBM principles provided the foundation for incorporating scientific evidence into clinical decision-making throughout the patient care continuum. Rather than limiting evidence appraisal to isolated diagnostic or therapeutic decisions, the proposed framework emphasizes its continuous application to prevention, clinical assessment, treatment selection, multidisciplinary consultation, and follow-up.⁵ This extension represents a proposed organizational application of established EBM principles rather than a separately validated intervention.",
        "Donabedian's structure–process–outcome model informed the organization of clinical and operational components. Healthcare structures were conceptualized as institutional resources, professional expertise, diagnostic capabilities, specialized treatment services, and referral networks. Processes included prevention, clinical recognition, diagnostic escalation, communication, transfer coordination, multidisciplinary activation, treatment, and surveillance. Outcomes included patient safety, diagnostic and treatment timeliness, complications, mortality, and continuity of care.14",
        "Implementation-science concepts informed consideration of organizational readiness, adoption, coordination, and sustainability. The updated CFIR provided a conceptual basis for examining how organizational context, professional roles, implementation processes, and healthcare resources may influence the introduction of coordinated practices.15 The subsequent CFIR user guide provides additional methodological guidance relevant to future implementation research.³⁴",
        "The resulting EBM-IRRF comprises seven interconnected components organized into four principal clinical and coordination components and three cross-cutting enabling functions.",
        "The four principal components are:",
        "Prevention and risk-based surveillance: Identification of susceptible individuals, management of modifiable risks, appropriate surveillance, and preventive intervention when indicated.",
        "Early recognition and diagnostic escalation: Timely identification of possible AAD, structured clinical assessment, appropriate imaging, and urgent specialist consultation.",
        "Regional referral and interhospital transfer: Coordinated access to specialized aortic expertise through appropriate referral and transfer pathways.",
        "Multidisciplinary emergency readiness and definitive treatment: Timely coordination of qualified clinical teams, essential resources, and guideline-supported treatment.",
        "The three cross-cutting enabling functions are:",
        "Continuous EBM support: Ongoing integration of scientific evidence, clinical expertise, and patient values into decision-making.",
        "Clinician-supervised AI assistance: Potential use of appropriately validated AI technologies for selected diagnostic, predictive, or operational tasks, subject to professional oversight.",
        "Organizational leadership, accountability, and continuous quality improvement: Defined operational responsibilities, resource coordination, performance monitoring, and improvement processes without interference in professional clinical decision-making.",
        "The components were organized to address challenges across the complete AAD care continuum. Prevention and surveillance precede emergency presentation; recognition, diagnostic escalation, referral, and definitive treatment address time-sensitive acute care; and continuous EBM, appropriately validated technologies, organizational support, and quality improvement are intended to strengthen coordination across these activities.",
        "The framework was developed through conceptual integration rather than empirical testing. Its proposed components were informed by published evidence and established theoretical principles, but their combined feasibility, safety, effectiveness, and incremental benefits beyond existing guideline-supported pathways remain untested. Potential applicability to other time-sensitive medical emergencies is theoretical and would require disease-specific adaptation and independent evaluation."
      ]
    },
    {
      "id": "36-ethical-considerations",
      "title": "3.6. Ethical Considerations",
      "level": 3,
      "paragraphs": [
        "This study involved no direct human participation or original patient-level data collection. The Perspective Article employed Systems-Based Scientific Reasoning (SBSR) to integrate previously published scientific evidence, clinical guidelines, and established conceptual models. No identifiable patient information was accessed, no participants were recruited, and no clinical interventions were conducted. Therefore, institutional review board approval was not required.",
        "Scientific integrity and transparency guided the conceptual development of EBM-IRRF. Published evidence was interpreted with attention to its clinical relevance, methodological limitations, and applicability to acute aortic dissection care. Established scientific findings were distinguished from proposed organizational strategies to avoid presenting unvalidated framework components as demonstrated clinical benefits.",
        "The proposed framework emphasizes patient safety and evidence-informed clinical decision-making. Its conceptual development incorporated established clinical guidelines while recognizing the importance of multidisciplinary coordination, professional accountability, and organizational responsibility in acute aortic dissection management."
      ]
    },
    {
      "id": "4-results-evidence-synthesis-and-proposed-ebm-irrf",
      "title": "4. Results: Evidence Synthesis and Proposed EBM-IRRF",
      "level": 2,
      "paragraphs": [
        "The narrative evidence synthesis identified persistent gaps between advances in acute aortic dissection (AAD) management and the timely, coordinated delivery of appropriate care. Contemporary guidelines, clinical registries, and observational investigations support established approaches to prevention, diagnosis, treatment, and surveillance, while studies of regionalized care and multidisciplinary response identify opportunities to improve healthcare delivery.¹⁻⁴˒7-11 These findings informed the proposed Evidence-Based Medicine–Integrated Rapid Response Framework (EBM-IRRF), which integrates seven clinical and organizational components with patient participation and an optional independent third-party evidence-based medicine (EBM) consultation mechanism. The framework is a conceptual output of the narrative synthesis, not a clinically validated intervention."
      ]
    },
    {
      "id": "41-principal-findings-from-the-scientific-literatu",
      "title": "4.1. Principal Findings From the Scientific Literature",
      "level": 3,
      "paragraphs": [
        "The evidence synthesis identified three principal findings relevant to improving AAD management. First, contemporary guidelines provide comprehensive recommendations for risk assessment, surveillance, diagnostic imaging, hemodynamic stabilization, surgical intervention, endovascular treatment, and long-term follow-up.¹˒² However, heterogeneous clinical presentations, differences in disease severity, and variable access to specialized services continue to complicate timely care.³˒⁴˒¹⁷˒¹⁹",
        "Second, healthcare organization may influence the delivery of effective emergency treatment. Observational investigations have identified associations between institutional case volume and outcomes following acute type A dissection repair.⁹˒²⁸˒²⁹ Studies of regional aortic networks, interhospital transfer, Aorta Code implementation, and multidisciplinary response pathways have also reported improvements in selected care processes and clinical outcomes.7˒ 9-11˒³⁰ These findings support attention to healthcare coordination but do not establish the causal effectiveness of a comprehensive organizational framework.",
        "Third, opportunities remain to strengthen continuity between prevention, emergency recognition, definitive treatment, and longitudinal care. Current clinical recommendations address individual stages of AAD management, whereas their implementation may depend on communication, specialist availability, resource coordination, and patient engagement.¹˒²˒³² The synthesis therefore supports investigating an integrated approach that connects established clinical practices with organizational processes and patient-centered decision-making."
      ]
    },
    {
      "id": "42-patient-needs-and-unmet-healthcare-delivery-req",
      "title": "4.2. Patient Needs and Unmet Healthcare Delivery Requirements",
      "level": 3,
      "paragraphs": [
        "Six interrelated patient needs emerged from the synthesis: appropriate prevention, timely recognition, diagnostic confirmation, access to specialized treatment, coordinated emergency care, and sustained follow-up. These needs correspond to clinical and organizational challenges that may arise at different points in the care continuum.",
        "Patient participation represents an additional consideration across these needs. Patients and authorized representatives may contribute through risk communication, symptom reporting, informed treatment preferences, and adherence to surveillance recommendations. EBM principles support incorporating patient values into clinical decisions, although opportunities for extensive participation may be limited during life-threatening emergencies.⁵",
        "Table 3 summarizes the principal unmet needs and corresponding healthcare delivery opportunities. The table distinguishes established clinical priorities from proposed improvements in care coordination.",
        "__TABLE_REF__:Table 3. Patient Needs, Clinical Challenges, and Healthcare Delivery Opportunities in Acute Aortic Dissection"
      ]
    },
    {
      "id": "43-development-of-ebm-irrf",
      "title": "4.3. Development of EBM-IRRF",
      "level": 3,
      "paragraphs": [
        "EBM-IRRF was developed as a conceptual synthesis of established AAD management principles, evidence concerning healthcare delivery challenges, and organizational implementation frameworks. The proposed model draws on contemporary clinical guidelines, evidence regarding regionalized care and multidisciplinary coordination, and the Donabedian structure–process–outcome model and Consolidated Framework for Implementation Research (CFIR).¹˒²˒⁶⁻7 The framework is intended to integrate complementary clinical and organizational functions rather than replace established guideline-based management.",
        "The framework comprises four principal clinical and coordination components supported by three cross-cutting functions. The principal components address the continuum from prevention and early recognition through regional referral and definitive treatment. The cross-cutting functions encompass continuous EBM support, appropriately validated clinician-supervised AI assistance, and tiered organizational leadership, accountability, and continuous quality improvement. These supporting functions are intended to strengthen coordination, evidence-informed decision-making, and organizational responsiveness without overriding qualified clinician authority or delaying urgent treatment.",
        "Figure 1 illustrates the conceptual relationships among the seven components. The arrows represent a general care continuum rather than a mandatory sequence of clinical actions. Patient autonomy, shared decision-making when clinically feasible, and professional accountability remain fundamental principles. EBM-IRRF has not undergone prospective clinical validation; its proposed functions and relationships require empirical evaluation before routine implementation can be recommended.",
        "__FIGURE_1_REF__"
      ]
    },
    {
      "id": "44-proposed-clinical-and-operational-applications-",
      "title": "4.4. Proposed Clinical and Operational Applications of the Seven EBM-IRRF Components",
      "level": 3,
      "paragraphs": [
        "As illustrated in Figure 1, the seven interconnected components of EBM-IRRF are intended to integrate evidence-based clinical practices with coordinated healthcare operations across the acute aortic dissection (AAD) care continuum. Components 1–4 address prevention, early recognition, regional coordination, and emergency treatment, while Components 5–7 provide cross-cutting support through continuous evidence-based medicine (EBM), appropriately validated artificial intelligence (AI), and organizational accountability. The following descriptions emphasize the proposed clinical applications, operational responsibilities, and implementation safeguards of each component.",
        "Principal Clinical and Coordination Components",
        "1. Prevention and Risk-Based Surveillance. This component promotes coordinated identification of patients at increased risk of aortic disease, guideline-supported preventive interventions, patient education, and individualized longitudinal surveillance. Proposed operational activities include communication among primary care professionals, cardiovascular specialists, imaging services, and patients to improve continuity of care and adherence to recommended monitoring. Risk-based strategies should avoid indiscriminate screening and recognize that not all AAD events are predictable or preventable.¹˒²˒5",
        "2. Early Recognition and Diagnostic Escalation. This component supports timely identification of suspected AAD through structured clinical assessment, appropriate diagnostic imaging, and rapid specialist communication. Proposed operational measures include clearly defined escalation pathways, timely reporting of critical findings, and coordinated diagnostic evaluation, particularly when clinical presentations are atypical or diagnostic uncertainty persists. These processes are intended to complement established diagnostic recommendations without replacing professional judgment or delaying emergency evaluation.¹˒²˒³˒¹⁴˒¹⁹˒²⁰",
        "3. Regional Referral and Interhospital Transfer. This component promotes coordinated access to specialized aortic care through regional referral networks, early communication between referring and receiving institutions, appropriate information and imaging transfer, and efficient patient transportation. Proposed implementation should account for clinical instability, geographic distance, institutional treatment capabilities, and the urgency of definitive intervention. Regional coordination should prioritize timely access to appropriate care while minimizing avoidable transfer delays and risks.7˒ 8˒10˒11˒²⁸⁻³⁰",
        "4. Multidisciplinary Emergency Readiness and Definitive Treatment. This component supports coordinated preparation and, when appropriate, parallel activation of emergency physicians, cardiovascular specialists, diagnostic imaging services, surgical or endovascular teams, anesthesia personnel, and other essential resources. Operational activities may include predefined emergency activation criteria, communication protocols, treatment preparation, and timely resource mobilization. Clinical management must remain consistent with established guidelines, patient-specific indications, and decisions made by appropriately qualified treating clinicians.¹˒²˒¹⁰˒¹¹˒³⁰˒³²",
        "Cross-Cutting Clinical and Organizational Support Components",
        "5. Continuous Evidence-Based Medicine Support. This component proposes the continuous integration of the best available scientific evidence, professional clinical expertise, and patient values throughout prevention, diagnostic evaluation, treatment selection, and follow-up.⁵ For selected complex or uncertain clinical situations, optional independent third-party EBM consultation, including qualified specialists from other institutions, may provide additional perspectives. This consultation mechanism remains unvalidated within EBM-IRRF and must not delay clinically indicated emergency evaluation, transfer, or treatment. Final clinical decisions remain the responsibility of the qualified treating team.",
        "6. Appropriately Validated, Clinician-Supervised AI Assistance. This component explores the potential application of AI technologies to support diagnostic evaluation, evidence retrieval, risk assessment, clinical communication, and healthcare operations. Proposed applications require task-specific validation, appropriate clinical supervision, protection of patient information, and continuous monitoring for diagnostic errors, algorithmic bias, and unintended consequences. AI assistance is intended to supplement rather than replace professional clinical judgment and must not introduce additional delays in time-critical care.¹⁵˒²⁴⁻²⁷",
        "7. Tiered Organizational Leadership, Accountability, and Continuous Quality Improvement. This component proposes predefined organizational responsibilities for emergency preparedness, resource coordination, operational escalation, institutional accountability, and continuous performance evaluation. Clinical teams retain authority over patient-specific medical decisions, while administrative and executive leaders address institutional barriers involving staffing, equipment, transportation, interdepartmental coordination, and other organizational resources. Leadership escalation should occur when operational support is necessary and must not interfere with or delay urgent clinical decisions. Continuous quality improvement should evaluate implementation performance, resource utilization, patient outcomes, and opportunities for corrective action.⁶˒⁷˒³⁴",
        "The integrated application of EBM-IRRF is intended to support coordinated, patient-centered care rather than impose a rigid sequence of clinical or administrative activities. Components may operate simultaneously or at different stages according to clinical urgency, patient needs, and institutional capabilities. Patient autonomy, informed decision-making, professional accountability, and safety remain essential throughout implementation. Figure 1 illustrates the relationships among the components, whereas Table 4 summarizes their supporting scientific evidence, proposed functions, and principal validation requirements. The effectiveness and safety of EBM-IRRF as an integrated framework remain to be established through prospective evaluation.",
        "__TABLE_REF__:Table 4. Seven EBM-IRRF Components: Supporting Evidence, Proposed Functions, and Validation Requirements"
      ]
    },
    {
      "id": "45-proposed-evaluation-indicators-and-comparative-",
      "title": "4.5. Proposed Evaluation Indicators and Comparative Validation of EBM-IRRF",
      "level": 3,
      "paragraphs": [
        "The proposed EBM-IRRF requires prospective evaluation to determine whether its integrated implementation provides measurable benefits beyond existing guideline-supported AAD care pathways. Although Figure 1 illustrates the conceptual framework and Table 4 identifies the supporting evidence and validation requirements of its components, Table 5 specifies potential clinical and organizational indicators for future empirical investigations. The central evaluation objective is to determine whether coordinated implementation improves healthcare delivery and patient outcomes without introducing additional risks, delays, or unnecessary resource utilization.¹˒²˒⁶˒⁷",
        "Table 5 organizes potential evaluation indicators into ten complementary clinical and operational domains. These encompass diagnostic performance, specialist coordination, interhospital transfer, definitive treatment, clinical outcomes, prevention and surveillance, patient participation, independent EBM consultation, AI assistance, and organizational performance. Investigations should assess both process measures, such as diagnostic and treatment intervals, and patient outcomes, including complications, mortality, and patient-reported experiences. Particular attention should be given to evaluating the safety, feasibility, and incremental contributions of proposed innovations, including independent EBM consultation, clinician-supervised AI assistance, and organizational escalation.¹⁰⁻¹²˒³⁰",
        "The proposed evaluation indicators provide a structured basis for assessing EBM-IRRF in future comparative investigations. As summarized in Table 5, these indicators address clinical outcomes, diagnostic and treatment timeliness, care coordination, patient-centered outcomes, implementation fidelity, and organizational performance. Comparative evaluation should account for differences in patient risk, institutional resources, and implementation contexts, with appropriate methods to address confounding.⁶˒⁷˒³⁴ These indicators represent proposed measures rather than evidence of framework effectiveness. Their feasibility, reliability, and responsiveness require empirical assessment before conclusions can be drawn regarding the additional clinical or organizational value of EBM-IRRF relative to established care pathways.",
        "__TABLE_REF__:Table 5. Proposed Clinical and Operational Evaluation Indicators for EBM-IRRF"
      ]
    },
    {
      "id": "5-discussion",
      "title": "5. Discussion",
      "level": 2,
      "paragraphs": [
        "The proposed Evidence-Based Medicine–Integrated Rapid Response Framework (EBM-IRRF) addresses the relationship between established clinical practices and the organizational conditions necessary for timely acute aortic dissection (AAD) care. This discussion interprets the available evidence, identifies the framework's proposed scientific contribution, considers implementation and evaluation strategies, and examines implications for healthcare systems. Particular attention is given to distinguishing evidence-supported practices from conceptual innovations whose effectiveness and safety remain unvalidated."
      ]
    },
    {
      "id": "51-clinical-evidence-and-healthcare-delivery-gaps",
      "title": "5.1. Clinical Evidence and Healthcare Delivery Gaps",
      "level": 3,
      "paragraphs": [
        "Contemporary advances in AAD diagnosis and treatment have not eliminated the operational challenges associated with delivering timely, appropriate care. Current guidelines establish comprehensive recommendations for diagnostic evaluation, medical stabilization, surgical and endovascular treatment, and longitudinal surveillance.¹˒² However, successful implementation depends on clinical recognition, access to appropriate imaging and specialist expertise, institutional readiness, and coordination across healthcare settings. These requirements suggest that opportunities for improvement extend beyond individual clinical interventions to the processes through which evidence-based care is delivered.",
        "Observational evidence supports the importance of specialized institutional capabilities and coordinated regional care, although causal relationships remain uncertain. Studies examining hospital procedural volume, interhospital transfer, regional referral networks, and organized aortic emergency pathways have reported associations with treatment processes and patient outcomes.7-11˒²⁸˒²⁹ Nevertheless, differences in disease severity, patient selection, referral patterns, institutional resources, and transfer arrangements may influence these findings. Consequently, evidence supporting regionalization or coordinated response programs cannot independently establish the effectiveness of EBM-IRRF.",
        "The distinction between clinical effectiveness and implementation effectiveness provides an important rationale for the proposed framework. An established diagnostic or therapeutic intervention may be effective when appropriately delivered but remain inconsistently accessible because of differences in staffing, imaging availability, specialist coverage, communication, or transportation. Donabedian's structure–process–outcome model provides a foundation for examining these relationships, while the Consolidated Framework for Implementation Research (CFIR) offers complementary methods for evaluating organizational barriers and implementation conditions.⁶˒⁷˒³⁴ Together, these perspectives support investigating whether improvements in healthcare coordination can strengthen the delivery of established clinical care.",
        "Operational efficiency must be evaluated alongside diagnostic accuracy and patient outcomes. AAD may present atypically, requiring individualized assessment of clinical findings, risk factors, diagnostic imaging, and alternative diagnoses.¹⁴˒¹⁹˒²⁰ Faster specialist notification, transfer, or treatment preparation may improve operational performance, but these process improvements should not automatically be interpreted as reductions in mortality or complications.7˒9˒11˒³⁰ Accordingly, the proposed framework emphasizes reducing avoidable delays while preserving clinical judgment and evaluating whether process improvements translate into meaningful patient benefits."
      ]
    },
    {
      "id": "52-scientific-originality-and-proposed-contributio",
      "title": "5.2. Scientific Originality and Proposed Contributions of EBM-IRRF",
      "level": 3,
      "paragraphs": [
        "The principal proposed contribution of EBM-IRRF is the integration of established clinical practices and selected organizational innovations into an explicitly evaluable framework for time-critical AAD care. Clinical guidelines, regional referral networks, multidisciplinary coordination, and quality-improvement programs already exist in various forms.¹˒²˒9⁻¹² Rather than presenting these practices as newly discovered interventions, EBM-IRRF proposes a coordinated model linking prevention, diagnostic escalation, specialized treatment access, continuous evidence-based support, technological assistance, and institutional accountability. Its scientific originality therefore lies in the proposed integration, operational relationships, and testable evaluation strategy, rather than in demonstrating a new treatment effect.",
        "Continuous integration of evidence-based medicine represents a distinguishing conceptual feature of the framework. EBM traditionally combines the best available scientific evidence with clinical expertise and patient values.⁵ EBM-IRRF extends this principle conceptually to healthcare operations, including referral arrangements, emergency activation criteria, resource coordination, and institutional performance evaluation. This extension does not imply that proposed organizational mechanisms possess the same evidentiary support as established clinical interventions. Instead, it identifies operational decision-making as an additional area requiring systematic investigation.",
        "Independent evidence-based consultation is proposed as a supplementary mechanism for selected complex clinical decisions. Unlike routine multidisciplinary consultation, which brings together relevant treating specialists, optional independent EBM consultation could provide additional appraisal of scientific evidence or alternative management considerations, including input from qualified specialists at other institutions. Its feasibility, independence, clinical usefulness, and effects on decision-making have not been established in AAD care. Such consultation would require predefined eligibility criteria and safeguards ensuring that emergency imaging, stabilization, transfer, and definitive treatment are never delayed.",
        "The framework also proposes an explicit distinction between clinical decision-making authority and organizational accountability. Qualified treating clinicians retain responsibility for patient-specific assessment and treatment, while administrative and executive leaders address institutional readiness, resource availability, operational barriers, and system performance. This distinction allows organizational escalation to support emergency care without creating an additional administrative approval requirement or permitting executives to override clinical decisions. Whether these arrangements improve coordination or outcomes remains an empirical question."
      ]
    },
    {
      "id": "53-implementation-readiness-and-operational-safegu",
      "title": "5.3. Implementation Readiness and Operational Safeguards",
      "level": 3,
      "paragraphs": [
        "Initial implementation of EBM-IRRF should prioritize institutional readiness assessment and adaptation to existing AAD pathways. Hospitals and regional networks differ in specialist availability, imaging resources, emergency transportation, staffing, and organizational capacity. Readiness assessments should identify existing care processes, recurrent delays, communication failures, referral relationships, and opportunities for improvement. The Consolidated Framework for Implementation Research (CFIR) provides a methodological foundation for examining contextual factors and identifying barriers to implementation.12˒³⁴",
        "A staged implementation approach would allow organizational adaptation while minimizing disruption to established emergency care. Preparatory activities could include process mapping, multidisciplinary simulation, workforce training, clarification of communication responsibilities, and assessment of information-system interoperability. Selected components could subsequently be introduced according to institutional needs and available resources, with progression contingent on operational feasibility, implementation fidelity, staff acceptance, and patient safety.12˒³⁴ Organizational leaders would coordinate resources, multidisciplinary collaboration, and quality improvement while preserving qualified clinicians' authority over patient-specific decisions.⁶˒⁷",
        "Independent EBM consultation and AI-assisted functions require clearly defined responsibilities and safeguards before clinical integration. Independent consultation would require appropriately qualified personnel, documentation procedures, and escalation mechanisms that do not delay emergency evaluation, transfer, or definitive treatment.¹˒² AI applications would require task-specific validation, clinician supervision, data protection, and monitoring for errors, bias, and unintended consequences.³⁵˒³⁷ These functions should remain supplementary to established clinical pathways and must not replace qualified clinical judgment.¹˒²˒³⁵"
      ]
    },
    {
      "id": "54-healthcare-equity-patient-autonomy-and-broader-",
      "title": "5.4. Healthcare Equity, Patient Autonomy, and Broader Applicability",
      "level": 3,
      "paragraphs": [
        "Regional access to specialized aortic care represents an important equity consideration for healthcare systems. Patients presenting to institutions without advanced aortic services may depend on timely referral, transportation, and coordination with receiving centers.7˒¹² However, geographic distance, rural location, transport availability, institutional relationships, and clinical instability may limit access. Evaluation of regional coordination should therefore examine not only aggregate outcomes but also differences in access and treatment timeliness among underserved populations.",
        "Patient autonomy and informed participation should remain integral to emergency care while accounting for the constraints imposed by clinical urgency. Prevention, risk assessment, and longitudinal surveillance may provide opportunities for patient education and shared decision-making before an acute event. During AAD emergencies, decision-making capacity, time constraints, and the availability of authorized surrogates may affect the extent of participation. The framework should support clear communication and respect for patient preferences without introducing consultation requirements that compromise timely, clinically indicated treatment.",
        "The proposed separation of clinical authority and institutional accountability may inform broader healthcare governance. Healthcare organizations are responsible for maintaining operational conditions that enable qualified clinicians to provide appropriate care, including emergency preparedness, resource coordination, and performance improvement. The governance implications of EBM-IRRF therefore concern institutional responsibility for supporting reliable clinical processes rather than administrative control over individual medical decisions.",
        "The underlying organizational principles of EBM-IRRF may be relevant to other time-critical emergencies, but broader applicability requires independent evaluation. Acute ischemic stroke, ST-segment elevation myocardial infarction, major trauma, and selected forms of shock similarly require rapid recognition, specialized expertise, and coordinated resources. Nevertheless, differences in diagnostic pathways, therapeutic windows, patient populations, and institutional requirements prevent direct assumptions of transferability. Any adaptation would require disease-specific modification, appropriate clinical validation, and evaluation against existing emergency care systems."
      ]
    },
    {
      "id": "55-limitations",
      "title": "5.5. Limitations",
      "level": 3,
      "paragraphs": [
        "The primary limitation is that EBM-IRRF remains a proposed conceptual framework without clinical validation. No prospective studies or original patient-level analyses were conducted to establish its effectiveness. Furthermore, the narrative review design does not provide the methodological rigor of a systematic review or meta-analysis. Although established guidelines support individual clinical practices, evidence concerning regional networks, multidisciplinary coordination, and organizational interventions is largely observational and subject to confounding. Therefore, potential improvements in mortality, diagnostic accuracy, treatment timeliness, and healthcare operations remain hypothetical.",
        "Implementation also presents clinical, organizational, ethical, and financial challenges. Independent EBM consultation may complicate professional accountability, organizational escalation may interfere with clinical decision-making, and AI assistance may introduce errors, bias, privacy concerns, and cybersecurity risks. Differences in specialist availability, institutional resources, and healthcare infrastructure may further limit feasibility, particularly in smaller hospitals and underserved regions. These challenges require appropriate safeguards, prospective evaluation, and assessment of economic sustainability."
      ]
    },
    {
      "id": "56-future-research",
      "title": "5.6. Future Research",
      "level": 3,
      "paragraphs": [
        "Future research should determine whether EBM-IRRF provides measurable clinical and organizational benefits beyond established AAD care pathways. Prospective multicenter investigations should evaluate the framework's effectiveness, safety, and generalizability across institutions with different clinical resources and organizational structures. Comparative studies should assess whether EBM-IRRF improves risk-adjusted mortality, major complications, diagnostic and treatment timeliness, and care coordination beyond improvements attributable to existing guideline-based care, regional referral networks, and multidisciplinary emergency pathways. Component-level analyses should identify the independent and combined contributions of the proposed framework components, including whether their integration provides additional value beyond individual interventions.",
        "Further research should address the safety and effectiveness of supporting functions, patient-centered outcomes, healthcare equity, and economic sustainability. AI-assisted applications require external validation, clinician oversight, bias assessment, and continuous safety monitoring.³⁵˒³⁷ Transparent reporting of diagnostic accuracy, potential bias, and generalizability is essential for evaluating AI-assisted diagnostic technologies.³⁸ Independent EBM consultation should be investigated for its effects on clinical decision quality, treatment timeliness, and professional accountability. Long-term investigations should assess functional recovery, health-related quality of life, and patient-reported outcomes following AAD treatment.³⁹˒⁴⁰ Additional studies should examine disparities in access to specialized care, surveillance adherence, resource utilization, and implementation costs. Ultimately, EBM-IRRF should be refined or reconsidered according to empirical findings, with broader clinical adoption contingent on demonstrated effectiveness, safety, feasibility, and value."
      ]
    },
    {
      "id": "6-conclusions",
      "title": "6. Conclusions",
      "level": 2,
      "paragraphs": [
        "Acute aortic dissection (AAD) remains a life-threatening cardiovascular emergency despite advances in diagnostic imaging, medical management, surgical techniques, and endovascular treatment. Persistent challenges in prevention, early recognition, timely diagnosis, access to specialized care, and multidisciplinary coordination highlight the need to improve both clinical practice and healthcare operations. Effective management requires not only evidence-based interventions but also healthcare systems capable of delivering appropriate care rapidly and consistently.",
        "The proposed Evidence-Based Medicine–Integrated Rapid Response Framework (EBM-IRRF) offers a conceptual approach to integrating evidence-based clinical practice with coordinated emergency care and organizational accountability. By linking prevention, early recognition, regional referral, and definitive treatment with continuous EBM support, appropriately validated clinician-supervised AI assistance, and organizational quality improvement, the framework seeks to address persistent gaps in healthcare delivery. Patient-centered decision-making and qualified clinician authority remain fundamental principles.",
        "EBM-IRRF remains an unvalidated conceptual framework requiring prospective clinical investigation. Its feasibility, safety, effectiveness, generalizability, and economic sustainability must be established before routine implementation or claims of improved patient outcomes can be justified. The guiding principle—“Prevent Earlier, Recognize Sooner, Treat Faster”—emphasizes the importance of timely, coordinated, evidence-based, and accountable healthcare delivery."
      ]
    },
    {
      "id": "ethics-approval-and-informed-consent",
      "title": "Ethics Approval and Informed Consent",
      "level": 2,
      "paragraphs": [
        "This article is a narrative review and conceptual framework proposal based on previously published literature. No original human participant research, patient-level data collection, or identifiable patient information was involved. Therefore, institutional review board approval and informed consent were not required."
      ]
    }
  ],
  "tables": [
    {
      "id": "table-1",
      "number": "1",
      "caption": "Table 1. Evolution of Evidence-Based Diagnosis and Management of Acute Aortic Dissection",
      "headers": [
        "Developmental period",
        "Major clinical and technological developments",
        "Implications for patient care",
        "Principal supporting references"
      ],
      "rows": [
        [
          "Earlier clinical management",
          "Reliance on clinical assessment and limited imaging; development of surgical treatment",
          "Restricted diagnostic certainty and limited treatment options",
          "23"
        ],
        [
          "Expansion of cardiovascular imaging and surgery",
          "Improvements in CT, echocardiography, cardiopulmonary bypass, anesthesia, and operative techniques",
          "More accurate diagnosis and expanded surgical capabilities",
          "1, 2, 23"
        ],
        [
          "Registry-based evaluation",
          "IRAD investigations of presentation, treatment patterns, and outcomes",
          "Improved understanding of clinical heterogeneity, complications, and mortality",
          "3, 17"
        ],
        [
          "Expansion of endovascular treatment",
          "Increasing use of thoracic endovascular aortic repair for selected type B dissections",
          "Additional treatment options and evolving patient selection",
          "1, 2, 21"
        ],
        [
          "Contemporary evidence-based management",
          "Updated ACC/AHA and ESC guidelines; individualized risk assessment and surveillance",
          "More comprehensive recommendations across the care continuum",
          "1, 2"
        ],
        [
          "Regionalized and multidisciplinary care",
          "Specialized aortic centers, regional networks, structured transfer pathways, and Aorta Code programs",
          "Potential improvements in access, coordination, and selected outcomes",
          "7–11"
        ],
        [
          "Emerging digital and AI-supported approaches",
          "AI-assisted imaging, classification, and risk prediction",
          "Potential clinical support requiring external validation and safety evaluation",
          "12, 24–27"
        ]
      ],
      "note": "Note. This table summarizes broad developments rather than asserting that every innovation independently improved mortality. Evidence supporting clinical effectiveness varies by intervention and study design."
    },
    {
      "id": "table-2",
      "number": "2",
      "caption": "Table 2. Evidence Sources, Evaluation Considerations, and Contributions to EBM-IRRF Development",
      "headers": [
        "Evidence category",
        "Principal sources",
        "Evaluation considerations",
        "Contribution to EBM-IRRF"
      ],
      "rows": [
        [
          "Clinical practice guidelines",
          "ACC/AHA and ESC guidelines1,2",
          "Currency, clinical applicability, scope of recommendations",
          "Established clinical standards for prevention, diagnosis, treatment, and surveillance"
        ],
        [
          "Systematic reviews and meta-analyses",
          "Mortality, aneurysm growth, and diagnostic accuracy4,5,6",
          "Study design, heterogeneity, relevance, reported limitations",
          "Synthesis of clinical risks, diagnostic performance, and remaining evidence gaps"
        ],
        [
          "Registries and observational studies",
          "IRAD, transfer, hospital-volume, and aortic network studies3,10–11",
          "Population, measured outcomes, confounding, generalizability",
          "Context for treatment outcomes, referral systems, and multidisciplinary coordination"
        ],
        [
          "EBM, quality, and implementation models",
          "EBM, Donabedian model, and CFIR5–7,34",
          "Conceptual relevance and implementation applicability",
          "Integration of evidence, healthcare structures, processes, and evaluation planning"
        ],
        [
          "Emerging technologies",
          "AI diagnostic and predictive investigations11,24–27",
          "External validation, safety, generalizability, clinical oversight",
          "Potential clinician-supervised support; not established clinical benefit"
        ],
        [
          "Proposed framework elements",
          "Systems-Based Scientific Reasoning (SBSR) integrating the reviewed clinical and organizational evidence",
          "Plausibility, operational feasibility, and untested assumptions",
          "Seven proposed components and priorities for prospective validation"
        ]
      ],
      "note": "Note. The table summarizes evidence categories considered in the targeted narrative synthesis. It does not indicate a systematic search, formal risk-of-bias assessment, or prospective validation of EBM-IRRF."
    },
    {
      "id": "table-3",
      "number": "3",
      "caption": "Table 3. Patient Needs, Clinical Challenges, and Healthcare Delivery Opportunities in Acute Aortic Dissection",
      "headers": [
        "Patient need",
        "Clinical or healthcare delivery challenge",
        "Opportunity for improvement",
        "References"
      ],
      "rows": [
        [
          "Prevention and risk identification",
          "Unrecognized aortic disease and inconsistent risk assessment",
          "Coordinated risk evaluation, prevention, and patient education",
          "1, 2, 5"
        ],
        [
          "Early recognition",
          "Variable and potentially misleading clinical presentations",
          "Structured communication and timely diagnostic escalation",
          "3, 17, 19, 20"
        ],
        [
          "Diagnostic confirmation",
          "Diagnostic uncertainty and delayed access to imaging",
          "Risk-informed assessment and timely definitive imaging",
          "1, 2, 6"
        ],
        [
          "Specialized treatment",
          "Differences in institutional expertise and treatment capabilities",
          "Regional referral and coordinated interhospital transfer",
          "7, 9, 10,11"
        ],
        [
          "Emergency readiness",
          "Fragmented communication and resource mobilization",
          "Multidisciplinary activation and coordinated treatment preparation",
          "9, 10, 30, 32"
        ],
        [
          "Long-term follow-up",
          "Residual aortic disease and fragmented surveillance",
          "Coordinated imaging, medical management, and continuity of care",
          "1, 2"
        ],
        [
          "Patient participation",
          "Limited understanding or involvement in complex decisions",
          "Accessible communication, informed decision-making, and appropriate professional consultation",
          "5"
        ]
      ],
      "note": "Note: The opportunities summarized in this table do not constitute evidence that EBM-IRRF improves clinical outcomes."
    },
    {
      "id": "table-4",
      "number": "4",
      "caption": "Table 4. Seven EBM-IRRF Components: Supporting Evidence, Proposed Functions, and Validation Requirements",
      "headers": [
        "Component",
        "Evidence foundation",
        "Proposed function",
        "Principal validation requirement"
      ],
      "rows": [
        [
          "1. Prevention and surveillance",
          "Guidelines¹˒²; surveillance studies5",
          "Coordinate prevention and follow-up",
          "Surveillance adherence and patient outcomes"
        ],
        [
          "2. Early recognition and diagnosis",
          "Guidelines and diagnostic investigations¹˒²˒¹⁴˒¹⁹",
          "Strengthen diagnostic escalation",
          "Accuracy, time to diagnosis, missed cases"
        ],
        [
          "3. Regional referral and transfer",
          "Regionalization and transfer studies7˒¹¹˒¹²",
          "Improve access to specialized care",
          "Transfer safety, timeliness, outcomes"
        ],
        [
          "4. Multidisciplinary emergency response",
          "Guidelines and organized-response studies¹˒²˒¹⁰˒³⁰",
          "Coordinate parallel clinical preparation",
          "Treatment intervals, complications, mortality"
        ],
        [
          "5. Continuous EBM support",
          "EBM principles⁵",
          "Integrate evidence, patient values, multidisciplinary expertise, and optional independent consultation",
          "Decision quality, patient experience, consultation safety"
        ],
        [
          "6. AI assistance",
          "Emerging AI studies¹⁵˒²⁴⁻²⁷",
          "Provide selected clinician-supervised support",
          "External validation, safety, effectiveness"
        ],
        [
          "7. Leadership and quality improvement",
          "Donabedian⁶; CFIR⁷˒³⁴",
          "Coordinate resources and organizational accountability",
          "Implementation fidelity, resource utilization, outcomes"
        ]
      ],
      "note": "Note: Evidence supporting individual practices does not establish the effectiveness of their integration within EBM-IRRF. The proposed framework and independent third-party consultation mechanism require prospective validation."
    },
    {
      "id": "table-5",
      "number": "5",
      "caption": "Table 5. Proposed Clinical and Operational Evaluation Indicators for EBM-IRRF",
      "headers": [
        "Evaluation domain",
        "Proposed indicators"
      ],
      "rows": [
        [
          "Diagnostic performance",
          "Time from first healthcare contact to diagnostic suspicion, imaging, and confirmation; missed diagnoses"
        ],
        [
          "Specialist coordination",
          "Time to specialist notification, consultation, and multidisciplinary activation"
        ],
        [
          "Interhospital transfer",
          "Referral acceptance, transfer intervals, transfer-related adverse events"
        ],
        [
          "Definitive treatment",
          "Time to intervention, treatment delays, procedural readiness"
        ],
        [
          "Clinical outcomes",
          "In-hospital and 30-day mortality, major complications, patient safety"
        ],
        [
          "Prevention and surveillance",
          "Appropriate imaging completion, specialist follow-up, risk-factor management"
        ],
        [
          "Patient participation",
          "Understanding of care, participation when feasible, communication quality, decisional conflict"
        ],
        [
          "Independent EBM consultation",
          "Response time, professional independence, relevance, patient experience, unintended delays"
        ],
        [
          "AI assistance",
          "External validation performance, errors, bias, clinician oversight"
        ],
        [
          "Organizational performance",
          "Implementation fidelity, resource availability, escalation intervals, resource utilization"
        ]
      ],
      "note": "Note: These indicators are proposed for future evaluation and have not been validated as measures of EBM-IRRF effectiveness. Their operational definitions, data sources, risk-adjustment methods, and comparison strategies require prospective specification."
    }
  ],
  "references": [
    {
      "num": 1,
      "fullText": "Isselbacher EM, Preventza O, Black JH III, et al. 2022 ACC/AHA guideline for the diagnosis and management of aortic disease: a report of the American Heart Association/American College of Cardiology Joint Committee on Clinical Practice Guidelines. Circulation. 2022;146(24):e334-e482. doi:10.1161/CIR.0000000000001106"
    },
    {
      "num": 2,
      "fullText": "Mazzolai L, Teixido-Tura G, Lanzi S, et al. 2024 ESC Guidelines for the management of peripheral arterial and aortic diseases. Eur Heart J. 2024;45(36):3538-3700. doi:10.1093/eurheartj/ehae179"
    },
    {
      "num": 3,
      "fullText": "Hagan PG, Nienaber CA, Isselbacher EM, et al. The International Registry of Acute Aortic Dissection (IRAD): new insights into an old disease. JAMA. 2000;283(7):897-903. doi:10.1001/jama.283.7.897"
    },
    {
      "num": 4,
      "fullText": "Matei DC, Robu C, Ciobanu CG, et al. Mortality in acute type A aortic dissection—a systematic review based on contemporary registries. Rom J Intern Med. 2025;63(3):209-220. doi:10.2478/rjim-2025-0015"
    },
    {
      "num": 5,
      "fullText": "Henry M, Campello Jorge CA, van Bakel PAJ, et al. Thoracic aortic aneurysm growth rates and predicting factors: a systematic review and meta-analysis. J Am Heart Assoc. 2025;14(7):e038821. doi:10.1161/JAHA.124.038821"
    },
    {
      "num": 6,
      "fullText": "Ren S, Essat M, Pandor A, et al. Diagnostic accuracy of the aortic dissection detection risk score alone or with D-dimer for acute aortic syndromes: systematic review and meta-analysis. PLoS One. 2024;19(6):e0304401. doi:10.1371/journal.pone.0304401"
    },
    {
      "num": 7,
      "fullText": "Goldstone AB, Chiu P, Baiocchi M, et al. Interfacility transfer of Medicare beneficiaries with acute type A aortic dissection and regionalization of care in the United States. Circulation. 2019;140(15):1239-1250. doi:10.1161/CIRCULATIONAHA.118.038867"
    },
    {
      "num": 8,
      "fullText": "Dorton CW, McCullough KA, Pickering T, et al. Hospital volume and long-term survival among Medicare beneficiaries undergoing surgical repair of acute type A aortic dissection. Am J Cardiol. 2025;237:86-92. doi:10.1016/j.amjcard.2024.12.035"
    },
    {
      "num": 9,
      "fullText": "Maroto LC, Ferrera C, Cobiella J, et al. Improvement of early outcomes in type A acute aortic syndrome after an Aorta Code implementation. Ann Thorac Surg. 2024;117(4):770-778. doi:10.1016/j.athoracsur.2023.07.010"
    },
    {
      "num": 10,
      "fullText": "Vendramin I, Lechiancole A, Piani D, et al. Influence of a regional network combined with a systematic multidisciplinary approach on the outcomes of patients with acute type A aortic dissection. Int J Cardiol. 2023;391:131278. doi:10.1016/j.ijcard.2023.131278"
    },
    {
      "num": 11,
      "fullText": "Staniszewska A, Gaba K, Patterson B, et al. Consensus statement on the interhospital transfer of patients with acute aortic syndrome: TRAVERSING Delphi study. Emerg Med J. 2024;41(3):153-161. doi:10.1136/emermed-2023-213362"
    },
    {
      "num": 12,
      "fullText": "Asif A, Alsayyari M, Monekosso D, Remagnino P, Lakshminarayan R. Role of artificial intelligence in detecting and classifying aortic dissection: where are we? A systematic review and meta-analysis. Radiol Cardiothorac Imaging. 2025;7(3):e240353. doi:10.1148/ryct.240353"
    },
    {
      "num": 13,
      "fullText": "Sackett DL, Rosenberg WMC, Gray JAM, Haynes RB, Richardson WS. Evidence based medicine: what it is and what it isn't. BMJ. 1996;312(7023):71-72. doi:10.1136/bmj.312.7023.71"
    },
    {
      "num": 14,
      "fullText": "Donabedian A. The quality of care. How can it be assessed? JAMA. 1988;260(12):1743-1748. doi:10.1001/jama.1988.03410120089033"
    },
    {
      "num": 15,
      "fullText": "Damschroder LJ, Reardon CM, Opra Widerquist MA, Lowery J. The updated Consolidated Framework for Implementation Research based on user feedback. Implement Sci. 2022;17(1):75. doi:10.1186/s13012-022-01245-0"
    },
    {
      "num": 16,
      "fullText": "Howard DPJ, Banerjee A, Fairhead JF, et al. Population-based study of incidence and outcome of acute aortic dissection and premorbid risk factor control: 10-year results from the Oxford Vascular Study. Circulation. 2013;127(20):2031-2037. doi:10.1161/CIRCULATIONAHA.112.000483"
    },
    {
      "num": 17,
      "fullText": "Pape LA, Awais M, Woznicki EM, et al. Presentation, diagnosis, and outcomes of acute aortic dissection: 17-year trends from the International Registry of Acute Aortic Dissection. J Am Coll Cardiol. 2015;66(4):350-358. doi:10.1016/j.jacc.2015.05.029"
    },
    {
      "num": 18,
      "fullText": "Chandiramani A, Al-Tawil M, Rajasekar T, et al. Incidence rates of Penn classes and class-specific mortality in acute type A aortic dissection patients: an epidemiologic systematic review and meta-analysis. J Cardiothorac Vasc Anesth. 2024;38(7):1558-1568. doi:10.1053/j.jvca.2024.03.018"
    },
    {
      "num": 19,
      "fullText": "Bojko MM, Fleischman F. Aortic dissection: diagnosis. Cardiol Clin. 2025;43(2):209-217. doi:10.1016/j.ccl.2024.11.001"
    },
    {
      "num": 20,
      "fullText": "Reed MJ. Diagnosis and management of acute aortic dissection in the emergency department. Br J Hosp Med (Lond). 2024;85(4):1-9. doi:10.12968/hmed.2023.0366"
    },
    {
      "num": 21,
      "fullText": "Trimarchi S, Gleason TG, Brinster DR, et al. Editor's choice—trends in management and outcomes of type B aortic dissection: a report from the International Registry of Aortic Dissection. Eur J Vasc Endovasc Surg. 2023;66(6):775-782. doi:10.1016/j.ejvs.2023.05.015"
    },
    {
      "num": 22,
      "fullText": "Timmermans PT, Velders BJJ, Groenwold RHH, et al. Survival outcomes after surgery for type A aortic dissection: a contemporary Dutch nationwide registry study. Interdiscip Cardiovasc Thorac Surg. 2025;40(3):ivaf009. doi:10.1093/icvts/ivaf009"
    },
    {
      "num": 23,
      "fullText": "Nienaber CA, Clough RE. Management of acute aortic dissection. Lancet. 2015;385(9970):800-811. doi:10.1016/S0140-6736(14)61005-9"
    },
    {
      "num": 24,
      "fullText": "Raj A, Allababidi A, Kayed H, et al. Streamlining acute abdominal aortic dissection management—an AI-based CT imaging workflow. J Imaging Inform Med. 2024;37(6):2729-2739. doi:10.1007/s10278-024-01164-0"
    },
    {
      "num": 25,
      "fullText": "Zhou M, Lei L, Chen W, et al. Deep learning-based diagnosis of aortic dissection using an electrocardiogram: development, validation, and clinical implications of the AADE score. Kardiol Pol. 2024;82(1):63-71. doi:10.33963/v.phj.98880"
    },
    {
      "num": 26,
      "fullText": "Jin Z, Dong J, Li C, et al. A deep learning model for identifying the risk of mesenteric malperfusion in acute aortic dissection using initial diagnostic data: algorithm development and validation. J Med Internet Res. 2025;27:e72649. doi:10.2196/72649"
    },
    {
      "num": 27,
      "fullText": "Lareyre F, Nasr B, Cherchi M, Chaouch N, Raffort J. Artificial intelligence in aortic disease: literature review. J Cardiovasc Surg (Torino). 2025;66(6):464-474. doi:10.23736/S0021-9509.25.13444-7"
    },
    {
      "num": 28,
      "fullText": "Kawczynski MJ, van Kuijk SMJ, Olsthoorn JR, et al. Type A aortic dissection: optimal annual case volume for surgery. Eur Heart J. 2023;44(41):4357-4372. doi:10.1093/eurheartj/ehad551"
    },
    {
      "num": 29,
      "fullText": "De León Ayala IA, Chang FC, Chen CY, et al. Hospital volume and outcomes of surgical repair in type A acute aortic dissection: a nationwide cohort study. PLoS One. 2025;20(6):e0325689. doi:10.1371/journal.pone.0325689"
    },
    {
      "num": 30,
      "fullText": "Mehta CK, Chiu S, Hoel AW, et al. Implementation of a direct-to-operating room aortic emergency transfer program: expedited management of type A aortic dissection. Am J Emerg Med. 2023;70:113-118. doi:10.1016/j.ajem.2023.05.036"
    },
    {
      "num": 31,
      "fullText": "Biancari F, Dell'Aquila AM, Gatti G, et al. Interinstitutional analysis of the outcome after surgery for type A aortic dissection. Eur J Trauma Emerg Surg. 2023;49(4):1791-1801. doi:10.1007/s00068-023-02248-2"
    },
    {
      "num": 32,
      "fullText": "Zhong J, Singh AA, Safdar NZ, et al. Evaluating current acute aortic syndrome pathways: Collaborative Acute Aortic Syndrome Project (CAASP). BJS Open. 2024;8(5):zrae096. doi:10.1093/bjsopen/zrae096"
    },
    {
      "num": 33,
      "fullText": "Liu PPS, Chang JC, Hsu JY, et al. Off-hours surgery and mortality in patients with type A aortic dissection repair: a systematic review and meta-analysis. Korean Circ J. 2024;54(3):126-137. doi:10.4070/kcj.2023.0266"
    },
    {
      "num": 34,
      "fullText": "Reardon CM, Damschroder LJ, Ashcraft LE, et al. The Consolidated Framework for Implementation Research (CFIR) User Guide: a five-step guide for conducting implementation research using the framework. Implement Sci. 2025;20(1):39. doi:10.1186/s13012-025-01450-7"
    },
    {
      "num": 35,
      "fullText": "Lekadir K, Frangi AF, Porras AR, et al. FUTURE-AI: international consensus guideline for trustworthy and deployable artificial intelligence in healthcare. BMJ. 2025;388:e081554. doi:10.1136/bmj-2024-081554"
    },
    {
      "num": 36,
      "fullText": "Gallifant J, Afshar M, Ameen S, et al. The TRIPOD-LLM reporting guideline for studies using large language models. Nat Med. 2025;31(1):60-69. doi:10.1038/s41591-024-03425-5"
    },
    {
      "num": 37,
      "fullText": "Vasey B, Nagendran M, Campbell B, et al. Reporting guideline for the early-stage clinical evaluation of decision support systems driven by artificial intelligence: DECIDE-AI. Nat Med. 2022;28(5):924-933. doi:10.1038/s41591-022-01772-9"
    },
    {
      "num": 38,
      "fullText": "Sounderajah V, Guni A, Liu X, et al. The STARD-AI reporting guideline for diagnostic accuracy studies using artificial intelligence. Nat Med. 2025;31:3283-3289. doi:10.1038/s41591-025-03953-8"
    },
    {
      "num": 39,
      "fullText": "Hanna L, Jha R, Sounderajah V, Markar S, Gibbs R. Patient reported outcome measures used to assess quality of life in aortic dissection: a systematic scoping review using COSMIN methodology. Eur J Vasc Endovasc Surg. 2023;66(3):343-350. doi:10.1016/j.ejvs.2023.06.032"
    },
    {
      "num": 40,
      "fullText": "Carbone A, Palladino R, Franzese M, et al. Health-related quality of life in patients with aortic dissection: an unmet need. Curr Probl Cardiol. 2024;49(1 Pt C):102138. doi:10.1016/j.cpcardiol.2023.102138"
    }
  ],
  "peerReviewTransparency": {
    "manuscriptId": "SOMED-26-RW01",
    "status": "Accepted after External Peer Review & Revisions",
    "timeline": [
      {
        "date": "August 12, 2026",
        "event": "Initial Manuscript Submission received (SOMED-26-RW01)"
      },
      {
        "date": "August 15, 2026",
        "event": "Technical Pre-check & Double-blind Anonymization completed"
      },
      {
        "date": "August 18, 2026",
        "event": "Handling Editor assigned: Prof. Weihua Gong, M.D., Ph.D."
      },
      {
        "date": "August 20, 2026",
        "event": "Sent for external expert peer review (Referees 1 & 2 invited)"
      },
      {
        "date": "August 28, 2026",
        "event": "Referee Report 1 received: Recommendation: Re-write and Re-submit"
      },
      {
        "date": "September 10, 2026",
        "event": "First-round interim editorial assessment: Referee 1 report verified; awaiting second referee evaluation"
      },
      {
        "date": "September 25, 2026",
        "event": "Editorial reminder issued to Referee 2 regarding comprehensive evaluation"
      },
      {
        "date": "October 09, 2026",
        "event": "Referee Report 2 received: Recommendation: Re-review and Accept With Major Changes"
      },
      {
        "date": "October 10, 2026",
        "event": "Formal Editorial Decision issued by Prof. Weihua Gong: Major Revision Requested incorporating Referees 1 & 2 reports"
      },
      {
        "date": "October 20, 2026",
        "event": "Revised manuscript submitted with 5 academic tables, Figure 1 flowchart, 40 AMA references, and 14-page point-by-point rebuttal"
      },
      {
        "date": "October 24, 2026",
        "event": "Handling Editor Decision: Revisions evaluated as scientifically rigorous and fully responsive to referees; Manuscript Accepted"
      },
      {
        "date": "October 26, 2026",
        "event": "Final production proofing completed; published online in Volume 1"
      }
    ],
    "reviewers": [
      {
        "id": "Referee 1 (Anonymized)",
        "date": "August 28, 2026",
        "recommendation": "Re-write and Re-submit",
        "ratings": {
          "originality": 3,
          "methodology": 3,
          "clarity": 3,
          "significance": 3
        },
        "comments": "General Comments to Author(s):\nThe review article to be concised. Tables to be provided.\n\nSpecific Comments to Author(s):\n1. Too low references for a review article.\n2. What has been changed over the years in the management to be mentioned (evolution of AAD management).\n3. The manuscript to be neatly structured to have a good orientation for the reader regarding the topic.\n4. Figures should be added to illustrate the proposed framework.\n5. At least tables to be there."
      },
      {
        "id": "Referee 2 (Anonymized)",
        "date": "October 09, 2026",
        "recommendation": "Re-review and Accept With Major Changes",
        "ratings": {
          "originality": 4,
          "methodology": 4,
          "clarity": 4,
          "significance": 4
        },
        "comments": "General Evaluation:\nThis manuscript addresses an important challenge in cardiovascular medicine: the need to approach acute aortic dissection (AAD) not only as a surgical emergency but also as a time-dependent healthcare systems challenge.\n\nRequired Revisions:\n1. Methodology and article type require clarification: Explicitly classify as a Perspective Article and explain the application of Systems-Based Scientific Reasoning (SBSR).\n2. Distinction between established evidence and proposed framework: Clearly distinguish established clinical guidelines from proposed organizational innovations.\n3. Regionalization and transfer evidence: Expand literature concerning specialized aortic centers, volume thresholds, and transfer delay risks.\n4. Multidisciplinary coordination: Clarify that administrative escalation must not delay clinical emergency treatment.\n5. Role of artificial intelligence: Clarify AI as clinician-supervised decision support and cite international consensus guidelines (e.g. FUTURE-AI 2025).\n6. Evaluation criteria: Provide a structured table of potential clinical and operational indicators for future validation.\n7. Ethics approval: Explicitly declare that no original human participant data were collected, clarifying IRB exemption.\n8. Patient-specific statements: Address and remove unsupported statements regarding identifiable individuals (e.g., Senator Lindsey Graham)."
      }
    ],
    "rebuttalDetails": "The author submitted a 14-page point-by-point response addressing all 5 points of Referee 1 and all 8 points of Referee 2: expanding the literature base from 15 to 40 references, providing 5 formal comparative academic tables, adding Figure 1, and detailing the EBM-IRRF operational care continuum."
  }
};
