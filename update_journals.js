
const fs = require("fs");
const path = require("path");

const journals = [
  "ai-safety-governance",
  "biology",
  "chemistry",
  "clinical-ai-digital-health",
  "data-science",
  "engineering",
  "environmental-science",
  "quantum-engineering",
  "social-sciences-humanities",
  "social-sciences-open",
  "space-resources-orbital-economy",
  "synthetic-biology-bio-design"
];

// 1. Append editors
const editorsPath = path.join(__dirname, "lib", "data", "editors.ts");
let editorsContent = fs.readFileSync(editorsPath, "utf-8");

let newEditors = "";

for (const j of journals) {
  newEditors += `  {
    slug: "position-open-${j}-ae-1",
    name: "Position Open",
    role: "Associate Editor",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "${j}",
  },
  {
    slug: "position-open-${j}-ae-2",
    name: "Position Open",
    role: "Associate Editor",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "${j}",
  },
  {
    slug: "position-open-${j}-ebm-1",
    name: "Position Open",
    role: "Editorial Board Member",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "${j}",
  },
  {
    slug: "position-open-${j}-ebm-2",
    name: "Position Open",
    role: "Editorial Board Member",
    affiliation: "Seeking qualified experts in this field.",
    specialization: "Editorial Board",
    journalSlug: "${j}",
  },
`;
}

// Remove the closing bracket and append
editorsContent = editorsContent.replace(/]\s*$/, "");
if (!editorsContent.endsWith(",\n")) {
  editorsContent += ",\n";
}
editorsContent += newEditors + "]\n";

fs.writeFileSync(editorsPath, editorsContent);

// 2. Update page.tsx for all journals
const allJournals = [
  ...journals,
  "decarbonization-carbon-tech",
  "medicine"
];

for (const j of allJournals) {
  const pagePath = path.join(__dirname, "app", "journals", j, "page.tsx");
  if (!fs.existsSync(pagePath)) continue;

  let pageContent = fs.readFileSync(pagePath, "utf-8");

  // If already updated, skip the page modifications
  if (pageContent.includes("const journalEditors = ")) continue;
  if (pageContent.includes("const editorialBoard = ")) continue;

  // For most pages:
  const oldFilterRegex = new RegExp(`const associateEditors = editors\\.filter\\(e => e\\.journalSlug === "${j}"\\)`);
  if (oldFilterRegex.test(pageContent)) {
    pageContent = pageContent.replace(
      oldFilterRegex,
      `const journalEditors = editors.filter(e => e.journalSlug === "${j}")
  const associateEditors = journalEditors.filter(e => e.role === "Associate Editor")
  const editorialBoard = journalEditors.filter(e => e.role === "Editorial Board Member")`
    );
  }

  // Update props
  if (pageContent.includes("associateEditors={associateEditors}")) {
    pageContent = pageContent.replace(
      "associateEditors={associateEditors}",
      "associateEditors={associateEditors}\n      editorialBoard={editorialBoard}"
    );
  }

  fs.writeFileSync(pagePath, pageContent);
}

console.log("Done updating journals and editors data.");

