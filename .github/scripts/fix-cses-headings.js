const fs = require('fs');
const path = require('path');

global.window = {};
eval(fs.readFileSync('docs/cses-categories.js', 'utf8'));
const names = window.CSES_NAMES;
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

function splitWords(s) {
  return s
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
}

function title(base) {
  return names[norm(base)] || splitWords(base);
}

for (const f of fs.readdirSync('cses')) {
  if (!f.endsWith('.md')) continue;
  const base = f.replace(/\.md$/, '');
  const p = path.join('cses', f);
  const md = fs.readFileSync(p, 'utf8');
  const t = title(base);
  const fixed = md.replace(/^# .+\r?\n/m, `# ${t}\r\n`);
  if (fixed !== md) {
    fs.writeFileSync(p, fixed);
    console.log(`${base} -> ${t}`);
  }
}
