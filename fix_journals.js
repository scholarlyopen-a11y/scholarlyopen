
const fs = require("fs");
const path = require("path");

const journalsPath = path.join(__dirname, "app", "journals");
const dirs = fs.readdirSync(journalsPath, { withFileTypes: true })
  .filter(d => d.isDirectory() && !d.name.startsWith("["))
  .map(d => d.name);

for (const dir of dirs) {
  if (dir === "decarbonization-carbon-tech" || dir === "medicine" || dir === "social-sciences-open") continue;

  const pagePath = path.join(journalsPath, dir, "page.tsx");
  if (!fs.existsSync(pagePath)) continue;

  let pageContent = fs.readFileSync(pagePath, "utf-8");

  // 1. Add import { editors }
  if (!pageContent.includes("import { editors }")) {
    pageContent = pageContent.replace(
      /import { articles } from "@\/lib\/data\/articles"([\s\n]+)/,
      `import { articles } from "@/lib/data/articles"\nimport { editors } from "@/lib/data/editors"$1`
    );
  }

  // 2. Add filter logic inside the component
  const exportDefaultMatch = pageContent.match(/export default function \w+\(\) {\s*\n/);
  if (exportDefaultMatch && !pageContent.includes("const journalEditors")) {
    const filterLogic = `  const journalEditors = editors.filter(e => e.journalSlug === "${dir}")
  const associateEditors = journalEditors.filter(e => e.role === "Associate Editor")
  const editorialBoard = journalEditors.filter(e => e.role === "Editorial Board Member")\n\n`;
    pageContent = pageContent.replace(
      exportDefaultMatch[0],
      exportDefaultMatch[0] + filterLogic
    );
  }

  // 3. Add props to JournalPage
  if (!pageContent.includes("associateEditors={associateEditors}")) {
    pageContent = pageContent.replace(
      /journalSlug="(.*?)"\s*\n\s*\/>/,
      `journalSlug="$1"\n      associateEditors={associateEditors}\n      editorialBoard={editorialBoard}\n    />`
    );
  }

  fs.writeFileSync(pagePath, pageContent);
}

// Fix social-sciences-open double board prop issue
const ssoPath = path.join(journalsPath, "social-sciences-open", "page.tsx");
if (fs.existsSync(ssoPath)) {
  let sso = fs.readFileSync(ssoPath, "utf-8");
  sso = sso.replace(/editorialBoard={editorialBoard}\n\s*editorialBoard={editorialBoard}/g, "editorialBoard={editorialBoard}");
  fs.writeFileSync(ssoPath, sso);
}

console.log("Done fixing journals.");

