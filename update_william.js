
const fs = require("fs");
let content = fs.readFileSync("lib/data/editors.ts", "utf-8");

content = content.replace(
  /name:\s*"William Harrison, Ph\.D\.",/,
  `name: "William H. Harrison, Ph.D",`
);

content = content.replace(
  /affiliation:\s*"Professor of Political Science, Fairmont State University",/,
  `affiliation: "College of Liberal Arts,\\nFairmont State University, USA",`
);

// We only want to replace the role for William Harrison, so let"s do a more careful replace.
// We can find his block first.
const blockStart = content.indexOf(`slug: "william-harrison"`);
if (blockStart !== -1) {
  const blockEnd = content.indexOf(`}`, blockStart);
  let block = content.substring(blockStart, blockEnd);
  block = block.replace(/role:\s*"Associate Editor"/, `role: "Editorial Board Member"`);
  content = content.substring(0, blockStart) + block + content.substring(blockEnd);
  fs.writeFileSync("lib/data/editors.ts", content);
  console.log("Updated successfully");
} else {
  console.log("Could not find block");
}

