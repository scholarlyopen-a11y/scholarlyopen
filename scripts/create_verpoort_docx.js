const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function escapeXml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function makeParagraph(text, options = {}) {
  const { bold = false, italic = false, size = 24, align = "both", spaceBefore = 120, spaceAfter = 120, color = "000000", heading = false } = options;
  let pPr = `<w:pPr>`;
  if (align) pPr += `<w:jc w:val="${align}"/>`;
  pPr += `<w:spacing w:before="${spaceBefore}" w:after="${spaceAfter}" w:line="276" w:lineRule="auto"/>`;
  pPr += `</w:pPr>`;

  let rPr = `<w:rPr>`;
  rPr += `<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>`;
  if (bold) rPr += `<w:b/>`;
  if (italic) rPr += `<w:i/>`;
  if (color) rPr += `<w:color w:val="${color}"/>`;
  rPr += `<w:sz w:val="${size}"/>`;
  rPr += `</w:rPr>`;

  return `<w:p>${pPr}<w:r>${rPr}<w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p>`;
}

const docXmlHeader = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" mc:Ignorable="w14">
<w:body>`;

const docXmlFooter = `
<w:sectPr>
  <w:pgSz w:w="12240" w:h="15840"/>
  <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
  <w:cols w:space="720"/>
  <w:docGrid w:linePitch="360"/>
</w:sectPr>
</w:body>
</w:document>`;

function generateDocXml(blinded = false) {
  let body = "";

  // Journal Banner
  body += makeParagraph("SCHOLARLY OPEN: CHEMISTRY • REVIEW ARTICLE", { bold: true, size: 20, color: "0B99FF", align: "left", spaceBefore: 0, spaceAfter: 100 });
  body += makeParagraph(`Manuscript Tracking ID: SOCHEM-26-RW101 | Received: 27 November 2026`, { italic: true, size: 18, color: "666666", align: "left", spaceBefore: 0, spaceAfter: 300 });

  // Title
  body += makeParagraph("Recent advances in the application of MOF-based adsorbents for toxic dye removal from wastewater and their mechanism", {
    bold: true,
    size: 32,
    align: "left",
    spaceBefore: 100,
    spaceAfter: 200
  });

  // Authors & Affiliations
  if (!blinded) {
    body += makeParagraph("Francis Verpoort 1,2,3,*, Maira Aslam 1, Laiba 1, Muhammad Zain Ashiq 1, Ayesha Noreen 1, Muhammad Imtiaz 1", {
      bold: true,
      size: 22,
      align: "left",
      spaceBefore: 100,
      spaceAfter: 100
    });

    body += makeParagraph("1 State Key Laboratory of Advanced Technology for Materials Synthesis and Processing, Wuhan University of Technology, Wuhan 430070, China\n2 National Research Tomsk Polytechnic University, Lenin Avenue 30, Tomsk 634050, Russia\n3 Ghent University, Global Campus Songdo, 119 Songdomunhwa-ro, Yeonsu-gu, Incheon 21985, South Korea", {
      italic: true,
      size: 18,
      color: "444444",
      align: "left",
      spaceBefore: 50,
      spaceAfter: 150
    });

    body += makeParagraph("* Corresponding Author: Prof. Dr. Francis Verpoort (francis@whut.edu.cn) | ORCID: 0000-0002-5184-5500", {
      bold: false,
      italic: true,
      size: 18,
      color: "333333",
      align: "left",
      spaceBefore: 50,
      spaceAfter: 300
    });
  } else {
    body += makeParagraph("[Author names, affiliations, and institutional identifiers blinded for peer review]", {
      italic: true,
      bold: true,
      size: 20,
      color: "888888",
      align: "left",
      spaceBefore: 100,
      spaceAfter: 300
    });
  }

  // Abstract Heading
  body += makeParagraph("ABSTRACT", { bold: true, size: 24, align: "left", spaceBefore: 200, spaceAfter: 100, color: "0B99FF" });
  body += makeParagraph("The increasing influx of pollutants from various sources continues to complicate wastewater treatment processes. Over the past few decades, water contamination has surged, presenting one of the most challenging environmental issues globally. Understanding the underlying chemistry is essential for identifying structural characteristics that can be adjusted to enhance material properties. This review systematically consolidates and critically examines recent breakthroughs (2018-2024) in the use of notable MOF families, such as ZIFs, MILs, and UiO-series, for the removal of cationic (e.g., Methylene Blue) and anionic (e.g., Congo Red) dyes. We focus on understanding the main adsorption mechanisms, including electrostatic interactions, π-π stacking, hydrogen bonding, and coordinative interactions, which frequently work together. Our study demonstrates that several of these MOFs have extraordinary adsorption capabilities, often exceeding 1000 mg/g, and reach equilibrium in minutes. Furthermore, we assess the important characteristics of MOF stability and regeneration potential, focusing on frameworks that maintain high efficiency across repeated adsorption-desorption cycles. It represents comparison tables for various adsorbents (MOFs) for cationic and anionic dye removal, their adsorption capacity, efficiency, reusability, optimum pH, and temperature. However, it offers insight into current trends in MOF adsorption of dyes and discusses thoroughly factors affecting the dye adsorption on MOFs and mechanisms for removing the dyes from MOFs. This critical review lays out a clear path for future research aimed at practical implementation, concluding that although MOFs constitute a paradigm change in adsorption science, their translational potential is still limited by scalability and cost issues.", {
    italic: false,
    size: 20,
    align: "both",
    spaceBefore: 80,
    spaceAfter: 160
  });

  // Keywords
  body += makeParagraph("Keywords: Metal-organic frameworks (MOFs); Dye adsorption; Wastewater treatment; Cationic dyes; Anionic dyes; Adsorption mechanism; UiO-66; ZIF-8; MIL-101.", {
    bold: true,
    size: 20,
    align: "left",
    spaceBefore: 80,
    spaceAfter: 300
  });

  // Section 1: Introduction
  body += makeParagraph("1. INTRODUCTION", { bold: true, size: 24, align: "left", spaceBefore: 300, spaceAfter: 120, color: "000000" });
  body += makeParagraph("Water contamination by toxic synthetic organic dyes discharged from textile, printing, paper, and pharmaceutical manufacturing poses an urgent ecological and public health threat worldwide. Synthetic dyes such as cationic methylene blue (MB), crystal violet (CV), and anionic Congo red (CR) and methyl orange (MO) exhibit intense coloration, high chemical persistence, and pronounced mutagenic or carcinogenic properties. Traditional wastewater treatment technologies, such as coagulation, chemical oxidation, and biological degradation, frequently suffer from high operating costs, incomplete degradation, secondary sludge production, and poor efficiency toward complex aromatic dyes.", {
    size: 22,
    align: "both",
    spaceBefore: 60,
    spaceAfter: 120
  });
  body += makeParagraph("Among remediation strategies, adsorption remains the method of choice due to its simplicity, cost efficiency, high removal capacity, and absence of toxic secondary byproducts. In recent years, Metal-Organic Frameworks (MOFs)—crystalline coordination polymers constructed from metal nodes linked by polydentate organic ligands—have garnered unprecedented attention as next-generation adsorbents. With colossal specific surface areas (typically exceeding 1,000–6,000 m²/g), tailorable pore topologies, and tuneable surface chemistry, MOFs offer dramatic performance advantages over activated carbons, zeolites, and polymeric resins.", {
    size: 22,
    align: "both",
    spaceBefore: 60,
    spaceAfter: 120
  });

  // Section 2: Archetypal MOF Families
  body += makeParagraph("2. ARCHETYPAL MOF FAMILIES FOR AQUEOUS DYE REMOVAL", { bold: true, size: 24, align: "left", spaceBefore: 300, spaceAfter: 120, color: "000000" });
  body += makeParagraph("2.1 Zeolitic Imidazolate Frameworks (ZIFs): ZIF-8 and ZIF-67 exhibit exceptional thermal and hydrochemical stability across a wide pH envelope. Functionalizing ZIF surfaces through ligand exchange or postsynthetic modification enhances electrostatic affinity towards both anionic and cationic chromophores.", {
    size: 22,
    align: "both",
    spaceBefore: 60,
    spaceAfter: 120
  });
  body += makeParagraph("2.2 Materials of Institut Lavoisier (MILs): MIL-101(Cr/Fe) and MIL-53 frameworks possess open metal sites (Lewis acid centers) and dual pore sizes, providing rapid diffusion pathways and superior loading capacities exceeding 1,200 mg/g for methylene blue and acid orange 7.", {
    size: 22,
    align: "both",
    spaceBefore: 60,
    spaceAfter: 120
  });
  body += makeParagraph("2.3 Universitetet i Oslo (UiO) Series: UiO-66 and its derivatives (-NH2, -SO3H, -COOH) constructed with Zr6 clusters deliver benchmark chemical durability in acidic and saline environments, preventing structural collapse in industrial wastewater streams.", {
    size: 22,
    align: "both",
    spaceBefore: 60,
    spaceAfter: 120
  });

  // Section 3: Adsorption Mechanisms
  body += makeParagraph("3. MECHANISTIC PATHWAYS GOVERNING DYE ADSORPTION", { bold: true, size: 24, align: "left", spaceBefore: 300, spaceAfter: 120, color: "000000" });
  body += makeParagraph("Adsorption of chromophores onto MOFs rarely proceeds via a single isolated interaction. Instead, a cooperative synergy among multiple molecular mechanisms dominates:", {
    size: 22,
    align: "both",
    spaceBefore: 60,
    spaceAfter: 80
  });
  body += makeParagraph("• Electrostatic Interactions: The point of zero charge (pH_PZC) of the MOF relative to solution pH dictates surface charge. At pH > pH_PZC, deprotonated framework sites strongly attract cationic dyes, whereas acidic pH promotes protonation and anionic dye capture.", {
    size: 22,
    align: "both",
    spaceBefore: 40,
    spaceAfter: 60
  });
  body += makeParagraph("• π–π Stacking / π-Complexation: Delocalized π-electrons from aromatic linker rings (e.g., terephthalate, imidazolate) interact strongly with conjugated aromatic rings of dye molecules.", {
    size: 22,
    align: "both",
    spaceBefore: 40,
    spaceAfter: 60
  });
  body += makeParagraph("• Hydrogen Bonding: Amino, hydroxyl, and carboxyl functionalities present on functionalized linkers participate in robust H-bonding networks with nitrogen/oxygen heteroatoms on dye frameworks.", {
    size: 22,
    align: "both",
    spaceBefore: 40,
    spaceAfter: 60
  });
  body += makeParagraph("• Coordinative Bond Formation: Exposed coordinatively unsaturated metal sites act as Lewis acids, directly binding electron-rich sulfonate, carboxylate, or amine groups.", {
    size: 22,
    align: "both",
    spaceBefore: 40,
    spaceAfter: 120
  });

  // Section 4: Reusability & Scalability
  body += makeParagraph("4. REUSABILITY, KINETICS, AND TRANSLATIONAL CHALLENGES", { bold: true, size: 24, align: "left", spaceBefore: 300, spaceAfter: 120, color: "000000" });
  body += makeParagraph("Regeneration and structural integrity over repeated adsorption-desorption cycles represent the litmus test for real-world application. Washing with mild ethanolic or acidic solutions enables >90% recovery across 5–10 cycles for UiO-66 and MIL-101. However, widespread deployment faces engineering hurdles: high organic linker costs, solvent-intensive synthesis, microcrystalline powder handling, and hydraulic pressure drops in fixed-bed reactors. Continuous-flow shaping into beads, aerogels, and composite membranes represents the vanguard of ongoing research.", {
    size: 22,
    align: "both",
    spaceBefore: 60,
    spaceAfter: 120
  });

  // Section 5: Conclusions
  body += makeParagraph("5. CONCLUSIONS AND FUTURE PERSPECTIVES", { bold: true, size: 24, align: "left", spaceBefore: 300, spaceAfter: 120, color: "000000" });
  body += makeParagraph("Metal-organic frameworks have fundamentally transformed adsorption science, demonstrating extraordinary dye uptake kinetics and capacities unattainable by conventional sorbents. Future efforts must prioritize green, solvent-free synthesis methods, life-cycle environmental assessments, and integration into continuous multi-stage industrial wastewater treatment systems.", {
    size: 22,
    align: "both",
    spaceBefore: 60,
    spaceAfter: 200
  });

  // Declarations
  body += makeParagraph("DECLARATIONS & ETHICS STATEMENTS", { bold: true, size: 22, align: "left", spaceBefore: 200, spaceAfter: 100 });
  body += makeParagraph("Ethics Approval: Not applicable. No human participants or vertebrate animal models were involved in this study.\nConsent for Publication: All co-authors have reviewed and approved the final submission.\nAvailability of Data & Materials: All datasets analyzed during this study are included within the published article and supplementary files.\nCompeting Interests: The authors declare that they have no competing financial or personal interests.\nFunding: No external funding was received for this study. Article Processing Charge is fully waived under the Scholarly Open Inaugural Fellowship Grant.", {
    italic: true,
    size: 18,
    color: "555555",
    align: "both",
    spaceBefore: 40,
    spaceAfter: 200
  });

  return docXmlHeader + body + docXmlFooter;
}

// 1. Unzip SOMED-26-RW01-manuscript.docx into scripts/temp_docx
const tempDir = path.join(__dirname, 'temp_docx');
const tempZip = path.join(__dirname, 'temp.zip');
const sourceDocx = path.resolve('public/manuscripts/SOMED-26-RW01-manuscript.docx');

if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

fs.copyFileSync(sourceDocx, tempZip);
execSync(`powershell -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::ExtractToDirectory('${tempZip}', '${tempDir}')"`);
fs.unlinkSync(tempZip);

// 2. Write regular document.xml
const targetDocXml = path.join(tempDir, 'word', 'document.xml');
fs.writeFileSync(targetDocXml, generateDocXml(false), 'utf8');

// 3. Re-zip to public/manuscripts/SOCHEM-26-RW101-manuscript.docx and manuscript-MOFs_FV.docx
const outDocx1 = path.resolve('public/manuscripts/SOCHEM-26-RW101-manuscript.docx');
const outDocx2 = path.resolve('public/manuscripts/manuscript-MOFs_FV.docx');

if (fs.existsSync(outDocx1)) fs.unlinkSync(outDocx1);
if (fs.existsSync(outDocx2)) fs.unlinkSync(outDocx2);

execSync(`powershell -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('${tempDir}', '${outDocx1}')"`);
fs.copyFileSync(outDocx1, outDocx2);

// 4. Create blinded version
const outDocxBlinded = path.resolve('public/manuscripts/SOCHEM-26-RW101-manuscript-blinded.docx');
if (fs.existsSync(outDocxBlinded)) fs.unlinkSync(outDocxBlinded);

fs.writeFileSync(targetDocXml, generateDocXml(true), 'utf8');
execSync(`powershell -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('${tempDir}', '${outDocxBlinded}')"`);

console.log("Successfully created:");
console.log("- " + outDocx1);
console.log("- " + outDocx2);
console.log("- " + outDocxBlinded);

// Cleanup tempDir
fs.rmSync(tempDir, { recursive: true, force: true });
