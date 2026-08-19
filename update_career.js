
const fs = require("fs");
let content = fs.readFileSync("lib/data/editors.ts", "utf-8");

const blockStart = content.indexOf(`slug: "william-harrison"`);
if (blockStart !== -1) {
  const timelineStart = content.indexOf(`timeline: [`, blockStart);
  const timelineEnd = content.indexOf(`],`, timelineStart);
  
  if (timelineStart !== -1 && timelineEnd !== -1) {
    const existingTimeline = content.substring(timelineStart + 11, timelineEnd);
    
    const newCareerEntries = `
      { year: "2019 - Present", title: "Associate Professor of Political Science", description: "Fairmont State University", type: "career" },
      { year: "2016 - Present", title: "Assistant Professor Of Political Science", description: "Fairmont State University", type: "career" },
      { year: "2013 - 2016", title: "Visiting Assistant Professor of Political Science", description: "Fairmont State University", type: "career" },
      { year: "2012 - 2012", title: "Adjunct Professor", description: "Pierpont Community and Technical College", type: "career" },
      { year: "2009 - 2010", title: "Research Assistant", description: "West Virginia University", type: "career" },
      { year: "2008 - 2009", title: "Student Teacher", description: "West Virginia University", type: "career" },
      { year: "2007 - 2007", title: "Student Teacher", description: "West Virginia University", type: "career" },
      { year: "2002 - 2006", title: "Office Manager/Legal Assistant", description: "Joseph J. Mainiero, Esq.", type: "career" },`;
      
    const updatedTimeline = existingTimeline + newCareerEntries;
    
    content = content.substring(0, timelineStart + 11) + updatedTimeline + content.substring(timelineEnd);
    
    fs.writeFileSync("lib/data/editors.ts", content);
    console.log("Timeline updated successfully!");
  } else {
    console.log("Could not find timeline array.");
  }
} else {
  console.log("Could not find william-harrison block.");
}

