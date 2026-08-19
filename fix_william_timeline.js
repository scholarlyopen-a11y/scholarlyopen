
const fs = require("fs");
let content = fs.readFileSync("lib/data/editors.ts", "utf-8");

const start = content.indexOf(`slug: "william-harrison"`);
if (start !== -1) {
  const blockStart = content.lastIndexOf("{", start);
  const blockEnd = content.indexOf("personalPublications:", start);
  const fullBlockEnd = content.indexOf("]", blockEnd) + 1; // End of personalPublications array
  const veryEnd = content.indexOf("}", fullBlockEnd) + 1; // End of object

  const oldBlock = content.substring(blockStart, veryEnd);

  // We rewrite the entire object to be completely sure everything is perfect and ascending
  const newBlock = `{
    slug: "william-harrison",
    name: "William H. Harrison, Ph.D",
    role: "Editorial Board Member",
    affiliation: "College of Liberal Arts\\nFairmont State University, USA",
    specialization: "International Relations, Political Psychology, and American Government",
    imageUrl: "/images/editors/william-harrison.jpg",
    journalSlug: "social-sciences-humanities",
    orcid: "0009-0003-5885-0112",
    linkedin: "https://www.linkedin.com/in/william-harrison-ph-d-08444117/",
    biography: "Dr. William Harrison is a Professor of Political Science at Fairmont State University. His research focuses on the disproportionate voting power in the United States, religious influence on international and American politics, in-group/out-group dichotomy, and non-governmental organizations. His dissertation explored 'Foreign Christian Influence on Developing World Domestic Social Policy', analyzing whether foreign groups are more able to influence policy in countries with lower state capacity.",
    timeline: [
      { year: "1995", title: "B.A., Political Science", description: "New York University", type: "education" },
      { year: "2002 - 2006", title: "Office Manager/Legal Assistant", description: "Joseph J. Mainiero, Esq.", type: "career" },
      { year: "2002", title: "M.A., International Relations", description: "Alliant International University", type: "education" },
      { year: "2007 - 2007", title: "Student Teacher", description: "West Virginia University", type: "career" },
      { year: "2008 - 2009", title: "Student Teacher", description: "West Virginia University", type: "career" },
      { year: "2009 - 2010", title: "Research Assistant", description: "West Virginia University", type: "career" },
      { year: "2010", title: "M.A., Political Science", description: "West Virginia University", type: "education" },
      { year: "2012", title: "Ph.D., Political Science", description: "West Virginia University", type: "education" },
      { year: "2012 - 2012", title: "Adjunct Professor", description: "Pierpont Community and Technical College", type: "career" },
      { year: "2013 - 2016", title: "Visiting Assistant Professor of Political Science", description: "Fairmont State University", type: "career" },
      { year: "2016 - Present", title: "Assistant Professor Of Political Science", description: "Fairmont State University", type: "career" },
      { year: "2019 - Present", title: "Associate Professor of Political Science", description: "Fairmont State University", type: "career" },
      { year: "2026", title: "Joined Scholarly Open", description: "Appointed as Editorial Board Member for Scholarly Open: Social Sciences & Humanities.", type: "milestone" }
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

  content = content.replace(oldBlock, newBlock);
  fs.writeFileSync("lib/data/editors.ts", content);
  console.log("Success");
}

