
const fs = require("fs");

let content = fs.readFileSync("lib/data/editors.ts", "utf-8");

// First, add linkedin?: string to EditorMember if it doesn"t exist
if (!content.includes("linkedin?: string")) {
  content = content.replace("orcid?: string", "orcid?: string\n  linkedin?: string");
}

// Now replace the entire william-harrison block
const oldWilliamRegex = /\{\s*slug:\s*"william-harrison"[\s\S]*?\]\s*\}/;

const newWilliam = `{
    slug: "william-harrison",
    name: "William Harrison, Ph.D.",
    role: "Associate Editor",
    affiliation: "Professor of Political Science, Fairmont State University",
    specialization: "International Relations, Political Psychology, and American Government",
    imageUrl: "/images/editors/william-harrison.jpg",
    journalSlug: "social-sciences-humanities",
    orcid: "0009-0003-5885-0112",
    linkedin: "https://www.linkedin.com/in/william-harrison-ph-d-08444117/",
    biography: "Dr. William Harrison is a Professor of Political Science at Fairmont State University. His research focuses on the disproportionate voting power in the United States, religious influence on international and American politics, in-group/out-group dichotomy, and non-governmental organizations. His dissertation explored 'Foreign Christian Influence on Developing World Domestic Social Policy', analyzing whether foreign groups are more able to influence policy in countries with lower state capacity.",
    timeline: [
      { year: "2012", title: "Ph.D., Political Science", description: "West Virginia University", type: "education" },
      { year: "2010", title: "M.A., Political Science", description: "West Virginia University", type: "education" },
      { year: "2002", title: "M.A., International Relations", description: "Alliant International University", type: "education" },
      { year: "1995", title: "B.A., Political Science", description: "New York University", type: "education" }
    ],
    personalPublications: [
      {
        title: "Is the West Wobbling on its Democratic Pedestal",
        journal: "Two Day Hybrid International Conference on Democracy, Governance, and Sustainability",
        year: "2024"
      },
      {
        title: "2023 The Earth as a New Small Town",
        journal: "Southern Political Science Association Annual Conference",
        year: "2024"
      },
      {
        title: "Structural Regionalism in the United Nations Human Rights Council",
        journal: "North Eastern Political Science Association Annual Conference",
        year: "2021"
      },
      {
        title: "It's a Matter of Definition",
        journal: "Southern Political Science Association Annual Conference",
        year: "2018"
      },
      {
        title: "Roots of Green",
        journal: "Northeastern Political Science Association Annual Conference",
        year: "2016"
      }
    ]
  }`;

if (oldWilliamRegex.test(content)) {
  content = content.replace(oldWilliamRegex, newWilliam);
  fs.writeFileSync("lib/data/editors.ts", content);
  console.log("Replaced successfully!");
} else {
  console.log("Could not find old block.");
}

