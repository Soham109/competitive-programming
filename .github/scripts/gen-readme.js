const fs = require('fs');

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const MODEL = process.env.MODEL || 'gpt-4o'; // override via MODEL env (e.g. o1, DeepSeek-R1-0528)
const MODELS_ENDPOINT = 'https://models.inference.ai.azure.com/chat/completions';

const filePath = process.argv[2];
if (!filePath) { console.error('Usage: node gen-readme.js <path>'); process.exit(1); }

const parts = filePath.split('/');
const platform = parts[0];
const filename = parts[parts.length - 1];
const basename = filename.replace(/\.[^.]+$/, '');
const mdPath = filePath.replace(/\.[^.]+$/, '.md');

if (basename === 'Template') { console.log('Skipping Template'); process.exit(0); }
if (fs.existsSync(mdPath)) { console.log(`README exists: ${mdPath}`); process.exit(0); }

const code = fs.readFileSync(filePath, 'utf8').trim();

// ---------------------------------------------------------------------------
// Small fetch helpers (timeout + retry, never throw to caller)
// ---------------------------------------------------------------------------
async function fetchWithTimeout(url, opts = {}, ms = 25000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, { ...opts, signal: ctrl.signal }); }
  finally { clearTimeout(t); }
}

async function safeGet(url, opts = {}, ms = 25000, tries = 2) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetchWithTimeout(url, opts, ms);
      if (res.ok) return res;
    } catch (_) { /* retry */ }
    await new Promise(r => setTimeout(r, 1500 * (i + 1)));
  }
  return null;
}

// Read any page as clean markdown via the free Jina Reader proxy.
async function jinaRead(targetUrl) {
  const res = await safeGet('https://r.jina.ai/' + targetUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; readme-bot)' },
  }, 30000, 3);
  if (!res) return null;
  const text = await res.text();
  if (!text || text.length < 80) return null;
  // Trim the proxy's header lines and cap length to control tokens.
  let body = text
    .replace(/^Title:.*$/m, '')
    .replace(/^URL Source:.*$/m, '')
    .replace(/^Markdown Content:\s*/m, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  if (body.length > 7000) body = body.slice(0, 7000) + '\n...[statement truncated]';
  return body;
}

// ---------------------------------------------------------------------------
// Per-platform problem context
// ---------------------------------------------------------------------------
async function codeforcesContext() {
  const m = basename.match(/^(\d+)([A-Z]\d?)$/i);
  if (!m) {
    return { label: 'Codeforces', url: 'https://codeforces.com/problemset', statement: null, meta: null };
  }
  const contest = m[1], index = m[2].toUpperCase();
  const url = `https://codeforces.com/problemset/problem/${contest}/${index}`;

  // Metadata from the official API (name, rating, tags) — not Cloudflare-blocked.
  let meta = null;
  const api = await safeGet('https://codeforces.com/api/problemset.problems',
    { headers: { 'User-Agent': 'Mozilla/5.0' } }, 30000, 2);
  if (api) {
    try {
      const data = await api.json();
      const p = data.result.problems.find(x => String(x.contestId) === contest && x.index === index);
      if (p) meta = { name: p.name, rating: p.rating, tags: p.tags };
    } catch (_) {}
  }

  const statement = await jinaRead(url);
  return { label: 'Codeforces', url, statement, meta };
}

async function csesContext() {
  // Files are named by problem title; resolve title -> task id from the index.
  let id = null;
  // Normalize to alphanumeric-only so any filename style matches the title:
  // "Weird Algorithm", "weirdalgorithm", "WeirdAlgorithm", "weird_algorithm" -> "weirdalgorithm".
  const norm = (s) => s.toLowerCase().replace(/&amp;/g, '&').replace(/[^a-z0-9]/g, '');
  const target = norm(basename);
  const idx = await safeGet('https://cses.fi/problemset/', { headers: { 'User-Agent': 'Mozilla/5.0' } }, 20000, 2);
  if (idx) {
    const html = await idx.text();
    const re = /href="\/problemset\/task\/(\d+)"[^>]*>([^<]+)</g;
    let m;
    while ((m = re.exec(html))) {
      if (norm(m[2]) === target) { id = m[1]; break; }
    }
  }
  const url = id ? `https://cses.fi/problemset/task/${id}` : 'https://cses.fi/problemset/';
  const statement = id ? await jinaRead(url) : null;
  return { label: 'CSES', url, statement, meta: null };
}

async function getContext() {
  try {
    if (platform === 'codeforces') return await codeforcesContext();
    if (platform === 'cses') return await csesContext();
  } catch (_) {}
  const label = platform.charAt(0).toUpperCase() + platform.slice(1);
  return { label, url: '', statement: null, meta: null };
}

// ---------------------------------------------------------------------------
// Prompt
// ---------------------------------------------------------------------------
const FORMAT_RULES = `
Produce EXACTLY these sections and nothing else:

# {TITLE}

> [Problem on {LABEL}]({URL})

## Idea
2-5 sentences. State the SINGLE key observation that cracks the problem and WHY it is true (the "aha"): an invariant, a divisibility fact, a greedy exchange argument, a reformulation, etc. Name any non-obvious math fact explicitly. Do NOT describe code structure here.

## Approach
A derivation, not a code walkthrough. Lead the reader from the observation to the algorithm: what quantity is tracked, what choices exist, why the method is correct and sufficient. Numbered list of 3-6 GENUINE reasoning steps. Each step starts DIRECTLY with the substance — do NOT prefix steps with a bold label like "**Count constraints:**" or "**Validate:**". Every step must carry justification ("because...", "this guarantees...", "it suffices to..."). BANNED narration: "read the input", "initialize a variable", "loop over the array", "call the function", "print the answer".

## Complexity
- **Time:** $O(\\cdot)$ — one clause tied to the real bottleneck.
- **Space:** $O(\\cdot)$ — one clause.

## Notes
ONLY if there is a genuine non-obvious implementation detail (overflow cast, why a small bound suffices, indexing trap, modular trick). Omit the whole section otherwise.

HARD RULES:
- LaTeX for EVERY variable, formula, index, modulus and complexity: $p_i$, $O(n \\log n)$, $S + 2a + 6b \\equiv 0 \\pmod 9$. Never raw math.
- Allowed macros: \\cdot \\log \\sqrt{} \\leq \\geq \\in \\pmod{} \\equiv \\lceil \\rceil \\lfloor \\rfloor \\sum \\frac{}{}.
- Reference real variable/function names from the code in \`backticks\` when pointing at something concrete.
- CRITICAL — inline code spans: every backtick that opens a code span MUST be closed with a backtick. NEVER use $ to close a backtick span. WRONG: \`dp[0] = 0$. CORRECT: \`dp[0] = 0\`.
- CRITICAL — dollar signs: $...$ is for mathematical expressions ONLY. Never put English prose, conjunctions, or plain words inside dollar signs. WRONG: $since zero coins are needed$ or $remains equal to$. CORRECT: $dp[x] = 0$.
- Be direct and technical. No filler ("We can observe that", "It is clear", "Simply", "Note that").
- Output ONLY the markdown starting at "# {TITLE}". Do NOT wrap it in code fences.`;

const GOLD = `
=== GOLD-STANDARD EXAMPLE (explains WHY, not WHAT) ===
# 2218D

> [Problem on Codeforces](https://codeforces.com/problemset/problem/2218/D)

## Idea

Generate the first primes and pair up consecutive ones. For each position $i$ the answer uses the product $p_i \\cdot p_{i+1}$, which guarantees the required pairwise property while keeping every value distinct.

## Approach

1. Build a list of primes with trial division.
2. Collect $n + 1$ primes so every index $i$ has a valid $p_{i+1}$.
3. Output $p_i \\cdot p_{i+1}$ for $i \\in [0, n)$, using \`long long\` to avoid overflow.

## Complexity

- **Time:** $O(n \\sqrt{p})$ where $p$ is the $(n+1)$-th prime — dominated by trial division.
- **Space:** $O(n)$ for the prime list.

## Notes

- Multiply with \`1LL\` before the second operand to stay in 64-bit range.
=== END EXAMPLE ===`;

function buildPrompt(ctx) {
  const title = (ctx.meta && ctx.meta.name) ? ctx.meta.name : basename;
  const rules = FORMAT_RULES
    .replace(/\{LABEL\}/g, ctx.label)
    .replace(/\{URL\}/g, ctx.url)
    .replace(/\{TITLE\}/g, title);
  let header;
  let problemBlock = '';

  if (ctx.statement) {
    header = `You are a strong competitive programmer writing an editorial-quality README. You are given the ACTUAL problem statement and the accepted solution. Ground every claim in the statement; explain the real insight and how one arrives at it.`;
    problemBlock = `\n=== PROBLEM STATEMENT (${ctx.label} ${basename}) ===\n${ctx.statement}\n=== END STATEMENT ===\n`;
  } else {
    header = `You are a strong competitive programmer writing an editorial-quality README. The full statement could not be fetched, so REVERSE-ENGINEER what the problem asks from the code and metadata, then explain the insight and how one arrives at it.`;
  }
  if (ctx.meta) {
    problemBlock += `\nProblem metadata — name: "${ctx.meta.name}"` +
      (ctx.meta.rating ? `, rating: ${ctx.meta.rating}` : '') +
      (ctx.meta.tags && ctx.meta.tags.length ? `, tags: [${ctx.meta.tags.join(', ')}]` : '') + `\n`;
  }

  return `${header}\n${GOLD}\n${problemBlock}\n=== ACCEPTED SOLUTION CODE ===\n\`\`\`cpp\n${code}\n\`\`\`\n${rules}`;
}

// ---------------------------------------------------------------------------
// Model call (retry on rate limit / transient error)
// ---------------------------------------------------------------------------
function cleanOutput(text) {
  let out = text.trim();
  out = out.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();   // reasoning models
  out = out.replace(/^```(?:markdown|md)?\s*\n/, '').replace(/\n```\s*$/, '').trim(); // outer fence
  // Try exact basename first (fallback for non-CF titles), then any H1
  const exact = out.indexOf(`# ${basename}`);
  if (exact > 0) { out = out.slice(exact).trim(); }
  else {
    const h1 = out.search(/^# /m);
    if (h1 > 0) out = out.slice(h1).trim();
  }
  return out;
}

async function callModel(prompt) {
  for (let attempt = 0; attempt < 3; attempt++) {
    let res;
    try {
      res = await fetchWithTimeout(MODELS_ENDPOINT, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 1500,
          temperature: 0.4,
          messages: [{ role: 'user', content: prompt }],
        }),
      }, 60000);
    } catch (e) {
      console.error(`attempt ${attempt}: network error`, e.message);
      await new Promise(r => setTimeout(r, 3000 * (attempt + 1)));
      continue;
    }
    if (res.status === 429 || res.status >= 500) {
      console.error(`attempt ${attempt}: HTTP ${res.status}, backing off`);
      await new Promise(r => setTimeout(r, 5000 * (attempt + 1)));
      continue;
    }
    const data = await res.json();
    if (!res.ok || !data.choices) { console.error('API error:', JSON.stringify(data)); return null; }
    return cleanOutput(data.choices[0].message.content);
  }
  return null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const ctx = await getContext();
  console.log(`Context for ${basename}: statement=${ctx.statement ? 'yes' : 'no'}, meta=${ctx.meta ? 'yes' : 'no'}, model=${MODEL}`);
  const readme = await callModel(buildPrompt(ctx));
  if (!readme || !readme.startsWith('# ')) {
    console.error(`Failed to produce a valid README for ${basename}`);
    process.exit(1);
  }
  fs.writeFileSync(mdPath, readme + '\n');
  console.log(`Generated: ${mdPath}`);
}

main().catch(e => { console.error(e); process.exit(1); });
