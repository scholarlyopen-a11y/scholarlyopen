const fs = require('fs');
const path = require('path');
const root = process.cwd();
const files = [];
function collect(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) collect(p);
    else if (/\.(tsx|ts)$/.test(entry.name) && p.includes(path.join('app'))) files.push(p);
  });
}
collect(path.join(root, 'app'));
const keys = new Set();
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const re = /t\(\s*['\"]([^'\"]+)['\"]\s*\)/g;
  let m;
  while ((m = re.exec(content))) keys.add(m[1]);
});
const lang = fs.readFileSync(path.join(root, 'lib', 'language-context.tsx'), 'utf8');
const deMatch = lang.match(/de:\s*\{([\s\S]*?)\}\s*\}\s*as const/);
const deKeys = new Set();
if (deMatch) {
  const body = deMatch[1];
  const re = /['\"]([^'\"]+)['\"]\s*:/g;
  let m;
  while ((m = re.exec(body))) deKeys.add(m[1]);
}
const missing = [...keys].filter(k => !deKeys.has(k));
console.log('keys used in app pages:', keys.size);
console.log('de translation keys:', deKeys.size);
console.log('missing keys:', missing.length);
missing.slice(0, 50).forEach(k => console.log(k));
