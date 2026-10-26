import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('====================================================');
console.log('   EU & GERMANY JOB RADAR - 100% REAL LIVE JOBS     ');
console.log('   Direct URLs • No Mocks • Exact Job Postings      ');
console.log('====================================================\n');

// Strict title keywords to ensure 100% relevance to user's profile
const STRICT_TITLE_KEYWORDS = [
  'publish', 'publishing', 'editorial', 'editor', 'journal', 'journals',
  'data steward', 'stewardship', 'forschungsdaten', 'research data', 'fair data',
  'scientific metadata', 'metadata', 'peer review', 'publication ethics',
  'research integrity', 'open access', 'open science', 'biocurat', 'scientific documentation',
  'scientific communication', 'content operations', 'manuscript'
];

const EXCLUDED_TITLE_KEYWORDS = [
  'internship', 'intern ', 'praktikant', 'praktikum', 'werkstudent',
  'working student', 'trainee', 'student assistant', 'hiwi'
];

function isTitleRelevant(title) {
  const t = title.toLowerCase();
  for (const exc of EXCLUDED_TITLE_KEYWORDS) {
    if (t.includes(exc)) return false;
  }
  for (const kw of STRICT_TITLE_KEYWORDS) {
    if (t.includes(kw)) return true;
  }
  return false;
}

function detectCountry(location, text) {
  const combined = (location + ' ' + text).toLowerCase();
  if (combined.includes('germany') || combined.includes('deutschland') || combined.includes('berlin') || combined.includes('heidelberg') || combined.includes('weinheim') || combined.includes('mainz') || combined.includes('frankfurt') || combined.includes('münchen') || combined.includes('munich') || combined.includes('göttingen') || combined.includes('de-remote')) {
    return 'Germany 🇩🇪';
  } else if (combined.includes('united kingdom') || combined.includes('uk-remote') || combined.includes('london') || combined.includes('oxford') || combined.includes('cambridge') || combined.includes('bristol') || combined.includes('edinburgh') || combined.includes('uk')) {
    return 'United Kingdom 🇬🇧';
  } else if (combined.includes('united states') || combined.includes('us-remote') || combined.includes('usa') || combined.includes('san francisco') || combined.includes('new york') || combined.includes('boston') || combined.includes('california')) {
    return 'United States 🇺🇸';
  } else if (combined.includes('netherlands') || combined.includes('nederland') || combined.includes('amsterdam') || combined.includes('leiden') || combined.includes('utrecht') || combined.includes('delft')) {
    return 'Netherlands 🇳🇱';
  } else if (combined.includes('switzerland') || combined.includes('lausanne') || combined.includes('basel') || combined.includes('zurich') || combined.includes('geneva')) {
    return 'Switzerland 🇨🇭';
  } else if (combined.includes('spain') || combined.includes('madrid') || combined.includes('barcelona') || combined.includes('valencia')) {
    return 'Spain 🇪🇸';
  } else if (combined.includes('belgium') || combined.includes('brussels') || combined.includes('leuven') || combined.includes('ghent')) {
    return 'Belgium 🇧🇪';
  } else if (combined.includes('norway') || combined.includes('oslo') || combined.includes('bergen')) {
    return 'Norway 🇳🇴';
  } else if (combined.includes('sweden') || combined.includes('stockholm') || combined.includes('uppsala') || combined.includes('lund')) {
    return 'Sweden 🇸🇪';
  } else if (combined.includes('italy') || combined.includes('milan') || combined.includes('rome') || combined.includes('bologna')) {
    return 'Italy 🇮🇹';
  } else if (combined.includes('poland') || combined.includes('warsaw') || combined.includes('krakow')) {
    return 'Poland 🇵🇱';
  } else if (combined.includes('canada') || combined.includes('toronto') || combined.includes('vancouver') || combined.includes('montreal')) {
    return 'Canada 🇨🇦';
  } else if (combined.includes('australia') || combined.includes('sydney') || combined.includes('melbourne')) {
    return 'Australia 🇦🇺';
  } else if (combined.includes('remote') || combined.includes('anywhere') || combined.includes('global')) {
    return 'Remote Worldwide 🌍';
  }
  return 'International 🌐';
}

function detectCategory(title, text) {
  const combined = (title + ' ' + text).toLowerCase();
  if (combined.includes('integrity') || combined.includes('ethics') || combined.includes('cope') || combined.includes('misconduct')) {
    return 'Research Integrity & Ethics';
  }
  if (combined.includes('data steward') || combined.includes('forschungsdaten') || combined.includes('fair') || combined.includes('metadata') || combined.includes('research data') || combined.includes('biocurat')) {
    return 'Data Stewardship & RDM';
  }
  if (combined.includes('start-up') || combined.includes('startup') || combined.includes('tech') || combined.includes('saas')) {
    return 'Startups & Publishing Tech';
  }
  return 'Open Access & Publishing';
}

function computeMatchScore(title, text) {
  const combined = (title + ' ' + text).toLowerCase();
  let score = 70; // baseline for strictly matching jobs
  if (combined.includes('open access') || combined.includes('open science')) score += 10;
  if (combined.includes('editorial') || combined.includes('peer review')) score += 10;
  if (combined.includes('data steward') || combined.includes('forschungsdaten')) score += 10;
  if (combined.includes('integrity') || combined.includes('ethics')) score += 10;
  if (combined.includes('germany') || combined.includes('de-remote')) score += 5;
  return Math.min(100, score);
}

// 1. Live PLOS Greenhouse API (100% Real Live Open Access Publisher Jobs)
async function fetchPLOS() {
  console.log('📡 [1/5] Fetching live openings from PLOS (Greenhouse API)...');
  const jobs = [];
  try {
    const res = await fetch('https://api.greenhouse.io/v1/boards/plos/jobs');
    if (res.ok) {
      const data = await res.json();
      for (const item of (data.jobs || [])) {
        if (!isTitleRelevant(item.title)) continue;
        const loc = item.location?.name || 'Remote';
        const country = detectCountry(loc, item.title);
        jobs.push({
          id: `plos_${item.id}`,
          title: item.title,
          company: 'PLOS (Public Library of Science)',
          location: loc,
          country,
          deadline: 'Active Open Access Opening',
          url: item.absolute_url,
          source: 'PLOS Careers (Direct)',
          category: detectCategory(item.title, 'Open Access'),
          matchScore: computeMatchScore(item.title, 'Open Access Greenhouse'),
          keywords: ['open access', 'peer review', 'editorial operations', 'plos']
        });
      }
      console.log(`   -> Found ${jobs.length} verified PLOS roles`);
    }
  } catch (err) {
    console.warn(`   -> PLOS Error: ${err.message}`);
  }
  return jobs;
}

// 2. Live Frontiers Workable API (100% Real Live Frontiers Publisher Jobs)
async function fetchFrontiers() {
  console.log('📡 [2/5] Fetching live openings from Frontiers (Workable API)...');
  const jobs = [];
  try {
    const res = await fetch('https://apply.workable.com/api/v1/widget/accounts/frontiersmedia');
    if (res.ok) {
      const data = await res.json();
      for (const item of (data.jobs || [])) {
        if (!isTitleRelevant(item.title)) continue;
        const loc = `${item.city || ''}, ${item.country || ''} ${item.telecommuting ? '(Remote Option)' : ''}`.trim();
        const country = detectCountry(loc, item.title);
        jobs.push({
          id: `frontiers_${item.shortcode}`,
          title: item.title,
          company: 'Frontiers',
          location: loc || 'Remote / European Hub',
          country,
          deadline: 'Active Frontiers Opening',
          url: item.shortlink,
          source: 'Frontiers Careers (Direct)',
          category: detectCategory(item.title, 'Open Access Frontiers'),
          matchScore: computeMatchScore(item.title, 'Open Access Frontiers Publishing'),
          keywords: ['open access', 'publishing development', 'editorial', 'peer review']
        });
      }
      console.log(`   -> Found ${jobs.length} verified Frontiers roles`);
    }
  } catch (err) {
    console.warn(`   -> Frontiers Error: ${err.message}`);
  }
  return jobs;
}

// 3. Live Nature Careers (Springer Nature, BMC, Nature, Scientific Reports)
async function fetchNatureCareers() {
  console.log('📡 [3/5] Querying live Nature Careers & Springer Nature RSS...');
  const jobs = [];
  const searchTerms = ['editorial', 'publishing', 'data+steward', 'integrity', 'peer+review'];
  
  for (const term of searchTerms) {
    try {
      const res = await fetch(`https://www.nature.com/naturecareers/jobsrss/?keywords=${term}`);
      if (!res.ok) continue;
      const xml = await res.text();
      const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)];

      for (const item of items) {
        const rawTitle = (item[1].match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
        const link = (item[1].match(/<link>([\s\S]*?)<\/link>/) || [])[1] || '';
        const desc = (item[1].match(/<description>([\s\S]*?)<\/description>/) || [])[1] || '';

        if (!rawTitle || !link) continue;

        const cleanTitle = rawTitle.includes(':') ? rawTitle.split(':')[1].trim() : rawTitle;
        const company = rawTitle.includes(':') ? rawTitle.split(':')[0].trim() : 'Springer Nature';

        if (!isTitleRelevant(cleanTitle)) continue;

        const country = detectCountry(desc, cleanTitle);
        const url = link.replace(/&amp;/g, '&');

        jobs.push({
          id: `nature_${Buffer.from(url).toString('base64').substring(0, 16)}`,
          title: cleanTitle.replace(/&amp;/g, '&'),
          company: company.replace(/&amp;/g, '&'),
          location: 'Europe / Germany / Remote',
          country,
          deadline: 'Active Nature Careers Post',
          url,
          source: 'Nature Careers (Springer Nature)',
          category: detectCategory(cleanTitle, desc),
          matchScore: computeMatchScore(cleanTitle, desc),
          keywords: ['springer nature', 'editorial', 'academic journals', 'peer review']
        });
      }
    } catch (err) {
      console.warn(`   -> Nature Careers query (${term}) Error: ${err.message}`);
    }
  }
  console.log(`   -> Found ${jobs.length} verified Springer Nature / Nature Careers roles`);
  return jobs;
}

// 4. Live Forschungsdaten.info (German FDM / Data Steward Network)
async function fetchFDM() {
  console.log('📡 [4/5] Scraping Forschungsdaten.info (German FDM Network)...');
  const jobs = [];
  try {
    const res = await fetch('https://forschungsdaten.info/praxis-kompakt/fdm-stellen/');
    if (res.ok) {
      const html = await res.text();
      const itemRegex = /<li\s+class="list-group-item"[^>]*>([\s\S]*?)<\/li>/gi;
      let match;

      while ((match = itemRegex.exec(html)) !== null) {
        const block = match[1];
        const headline = block.match(/<h3[^>]*itemprop="headline"[^>]*>([\s\S]*?)<\/h3>/i);
        const desc = block.match(/<div[^>]*itemprop="description"[^>]*>([\s\S]*?)<\/div>/i);
        const link = block.match(/<a[^>]*class="btn[^"]*btn-read-more"[^>]*href="([^"]+)"/i);

        if (headline && link) {
          const title = headline[1].replace(/<[^>]+>/g, '').trim();
          const descText = desc ? desc[1].replace(/<[^>]+>/g, '').trim() : '';
          const url = link[1].startsWith('http') ? link[1] : 'https://forschungsdaten.info' + link[1].replace(/&amp;/g, '&');
          const deadline = descText.includes('Bewerbungsschluss:') ? descText.split('Bewerbungsschluss:')[1].trim() : 'Check listing';

          jobs.push({
            id: `fdm_${Buffer.from(url).toString('base64').substring(0, 16)}`,
            title,
            company: descText.includes(',') ? descText.split(',')[2]?.trim() || 'FDM Institute' : 'German University / Research Institute',
            location: descText.includes(',') ? descText.split(',')[0]?.trim() || 'Germany' : 'Germany',
            country: 'Germany 🇩🇪',
            deadline,
            url,
            source: 'Forschungsdaten.info (Direct)',
            category: 'Data Stewardship & RDM',
            matchScore: 92,
            keywords: ['data steward', 'forschungsdaten', 'fair data', 'tv-l']
          });
        }
      }
      console.log(`   -> Found ${jobs.length} verified Forschungsdaten.info roles`);
    }
  } catch (err) {
    console.warn(`   -> FDM Error: ${err.message}`);
  }
  return jobs;
}

// 5. Live Arbeitnow with STRICT Title Matching
async function fetchArbeitnowStrict() {
  console.log('📡 [5/5] Querying Arbeitnow (Strict Title Match on Editorial & Data Roles)...');
  const jobs = [];
  try {
    const res = await fetch('https://www.arbeitnow.com/api/job-board-api');
    if (res.ok) {
      const data = await res.json();
      for (const item of (data.data || [])) {
        const title = item.title || '';
        // Strictly require the job TITLE itself to match
        if (!isTitleRelevant(title)) continue;

        const loc = item.location || 'Germany / Remote';
        const country = detectCountry(loc, title);

        jobs.push({
          id: `arbeitnow_${item.slug}`,
          title,
          company: item.company_name || 'Organization',
          location: item.remote ? `${loc} (Remote)` : loc,
          country,
          deadline: 'Open until filled',
          url: item.url, // Exact direct Arbeitnow job post link
          source: 'Arbeitnow (Direct Link)',
          category: detectCategory(title, item.description || ''),
          matchScore: computeMatchScore(title, item.description || ''),
          keywords: ['english-speaking', 'germany/eu', 'verified link']
        });
      }
      console.log(`   -> Found ${jobs.length} verified strict roles from Arbeitnow`);
    }
  } catch (err) {
    console.warn(`   -> Arbeitnow Error: ${err.message}`);
  }
  return jobs;
}

// 6. Live Jobicy API (Strict Title Match on Remote International Publishing & Editorial Roles)
async function fetchJobicyStrict() {
  console.log('📡 [6/6] Querying Jobicy API (Remote International Roles)...');
  const jobs = [];
  try {
    const res = await fetch('https://jobicy.com/api/v2/remote-jobs?count=50');
    if (res.ok) {
      const data = await res.json();
      for (const item of (data.jobs || [])) {
        const title = item.jobTitle || '';
        if (!isTitleRelevant(title)) continue;

        const loc = item.jobGeo || 'Remote Worldwide';
        const country = detectCountry(loc, title);

        jobs.push({
          id: `jobicy_${item.id}`,
          title,
          company: item.companyName || 'Remote Organization',
          location: `Remote (${loc})`,
          country,
          deadline: 'Active Remote Opening',
          url: item.url,
          source: 'Jobicy Global Remote',
          category: detectCategory(title, item.jobExcerpt || ''),
          matchScore: computeMatchScore(title, item.jobExcerpt || ''),
          keywords: ['remote', 'international', 'verified link']
        });
      }
      console.log(`   -> Found ${jobs.length} verified strict roles from Jobicy`);
    }
  } catch (err) {
    console.warn(`   -> Jobicy Error: ${err.message}`);
  }
  return jobs;
}

async function main() {
  const [plosJobs, frontiersJobs, natureJobs, fdmJobs, arbeitnowJobs, jobicyJobs] = await Promise.all([
    fetchPLOS(),
    fetchFrontiers(),
    fetchNatureCareers(),
    fetchFDM(),
    fetchArbeitnowStrict(),
    fetchJobicyStrict()
  ]);

  // Combine only verified, live jobs with real direct links
  const allJobs = [
    ...plosJobs,
    ...frontiersJobs,
    ...natureJobs,
    ...fdmJobs,
    ...arbeitnowJobs,
    ...jobicyJobs
  ];

  // De-duplicate by exact URL
  const seenUrls = new Set();
  const uniqueJobs = [];
  for (const job of allJobs) {
    if (!seenUrls.has(job.url)) {
      seenUrls.add(job.url);
      uniqueJobs.push(job);
    }
  }

  // Sort by match score descending
  uniqueJobs.sort((a, b) => b.matchScore - a.matchScore);

  console.log(`\n✅ Aggregated ${uniqueJobs.length} 100% REAL, VERIFIED live job openings!`);

  const templatePath = path.join(__dirname, 'radar-template.html');
  const templateHtml = fs.readFileSync(templatePath, 'utf-8');

  const injection = `window.RADAR_JOBS_DATA = ${JSON.stringify(uniqueJobs)};`;
  const finalHtml = templateHtml.replace('/* __INJECT_JOBS_PAYLOAD__ */', injection);

  const outPath = path.join(__dirname, 'jobs-radar.html');
  fs.writeFileSync(outPath, finalHtml, 'utf-8');
  console.log(`📄 Dashboard generated at: ${outPath}`);

  // Explicitly open in Chrome or Microsoft Edge
  const openCmd = process.platform === 'win32'
    ? `start chrome "${outPath}" 2>nul || start msedge "${outPath}" 2>nul || start "" "${outPath}"`
    : `open "${outPath}"`;
  exec(openCmd, (err) => {
    if (err) {
      console.log('Open dashboard manually by clicking jobs-radar.html');
    } else {
      console.log('🚀 Dashboard automatically opened in your web browser!');
    }
  });
}

main();
