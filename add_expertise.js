
const fs = require("fs");
let content = fs.readFileSync("lib/data/editors.ts", "utf-8");

const start = content.indexOf(`slug: "william-harrison"`);
if (start !== -1) {
  // Find where to insert expertise (e.g. after specialization)
  const specIndex = content.indexOf(`specialization:`, start);
  const insertIndex = content.indexOf(`\n`, specIndex) + 1;
  
  const expertise = `    expertise: [
      "Disproportionate voting power",
      "Religious Influence",
      "In-Group/Out-group dichotomy",
      "Non-Governmental Organizations"
    ],
`;

  content = content.substring(0, insertIndex) + expertise + content.substring(insertIndex);
  fs.writeFileSync("lib/data/editors.ts", content);
  console.log("Expertise added successfully!");
}

