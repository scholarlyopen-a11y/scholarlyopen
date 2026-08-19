
const fs = require("fs");
let content = fs.readFileSync("lib/data/editors.ts", "utf-8");

content = content.replace(
  /type:\s*"education"\s*\}\s*\{\s*year:\s*"2019 - Present"/g,
  `type: "education" },\n      { year: "2019 - Present"`
);

fs.writeFileSync("lib/data/editors.ts", content);
console.log("Comma fixed");

