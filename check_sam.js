
const fs = require("fs");
let content = fs.readFileSync("lib/data/editors.ts", "utf-8");
const start = content.indexOf(`slug: "sam-lee"`);
const end = content.indexOf(`personalPublications:`, start);
console.log(content.substring(start, end));

