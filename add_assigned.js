
const fs = require("fs");
let content = fs.readFileSync("lib/data/editors.ts", "utf-8");

const start = content.indexOf(`slug: "william-harrison"`);
if (start !== -1) {
  const specIndex = content.indexOf(`expertise: [`, start);
  const insertIndex = specIndex;
  
  const assigned = `assignedSections: [
      "International Relations",
      "Political Psychology",
      "American Government"
    ],
    `;

  content = content.substring(0, insertIndex) + assigned + content.substring(insertIndex);
  fs.writeFileSync("lib/data/editors.ts", content);
  console.log("Assigned sections added successfully!");
}

