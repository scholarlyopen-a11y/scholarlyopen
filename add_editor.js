
const fs = require("fs");

let content = fs.readFileSync("lib/data/editors.ts", "utf-8");

const oldEditorRegex = /\{\s*slug:\s*"position-open-social-sciences-humanities-ae-1"[\s\S]*?journalSlug:\s*"social-sciences-humanities",\s*\},/;

const newEditor = `{
    slug: "william-harrison",
    name: "William Harrison, Ph.D.",
    role: "Associate Editor",
    affiliation: "Associate Professor of Political Science, Fairmont State University",
    specialization: "International Relations, Political Psychology, and American Government",
    image: "/images/editors/Bill-Harrison.jpg",
    journalSlug: "social-sciences-humanities",
    orcid: "0009-0003-5885-0112",
    bio: [
      "Dr. William Harrison is an Associate Professor of Political Science at Fairmont State University.",
      "His research focuses on the disproportionate voting power in the United States, religious influence on international and American politics, in-group/out-group dichotomy, and non-governmental organizations.",
      "His dissertation explored 'Foreign Christian Influence on Developing World Domestic Social Policy', analyzing whether foreign groups are more able to influence policy in countries with lower state capacity."
    ],
    education: [
      "Ph.D., West Virginia University, Political Science, 2012",
      "M.A., West Virginia University, Political Science, 2010",
      "M.A., Alliant International University, International Relations, 2002",
      "B.A., New York University, Political Science, 1995"
    ],
    experience: [
      "Associate Professor of Political Science, Fairmont State University",
      "Adjunct Professor: American Government, Pierpont Community and Technical College, 2012",
      "Graduate Instructor & Teaching Assistant, West Virginia University, 2007-2009",
      "Research Assistant, West Virginia University, 2006-2010"
    ],
    publications: [
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
  },`;

if (oldEditorRegex.test(content)) {
  content = content.replace(oldEditorRegex, newEditor);
  fs.writeFileSync("lib/data/editors.ts", content);
  console.log("Success");
} else {
  console.log("Not found");
}

