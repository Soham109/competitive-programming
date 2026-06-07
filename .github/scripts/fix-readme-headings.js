// Rewrite README H1s to official display names (CF API + CSES_NAMES).
const fs = require('fs');
const path = require('path');
const { sanitizeReadmeMd } = require('../../docs/sanitize-md.js');

function splitWords(s) {
  return s
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
}

async function loadCFNames() {
  const res = await fetch('https://codeforces.com/api/problemset.problems');
  if (!res.ok) return {};
  const json = await res.json();
  if (json.status !== 'OK') return {};
  const map = {};
  for (const p of json.result.problems) {
    map[`${p.contestId}${p.index}`.toUpperCase()] = p.name;
  }
  return map;
}

function loadCsesNames() {
  global.window = {};
  eval(fs.readFileSync('docs/cses-categories.js', 'utf8'));
  return window.CSES_NAMES || {};
}

async function main() {
  const cfNames = await loadCFNames();
  const csesNames = loadCsesNames();
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

  for (const dir of ['codeforces', 'cses']) {
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.md')) continue;
      const base = f.replace(/\.md$/, '');
      const p = path.join(dir, f);
      let title = base;
      if (dir === 'codeforces') title = cfNames[base.toUpperCase()] || base;
      if (dir === 'cses') title = csesNames[norm(base)] || splitWords(base);

      let md = fs.readFileSync(p, 'utf8');
      md = md.replace(/^# .+\r?\n/m, `# ${title}\r\n`);
      md = sanitizeReadmeMd(md);
      fs.writeFileSync(p, md);
      console.log(`${p} -> ${title}`);
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
