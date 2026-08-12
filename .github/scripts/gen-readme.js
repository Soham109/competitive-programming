const fs = require('fs');
const { execFile } = require('child_process');
const { sanitizeReadmeMd } = require('../../docs/sanitize-md.js');

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
// Generation runs through the Claude Code CLI in headless mode, authenticated
// with CLAUDE_CODE_OAUTH_TOKEN so it draws on the Claude subscription rather
// than metered API credits. GitHub Models (the previous backend) is retired.
const MODEL = process.env.MODEL || 'sonnet'; // alias or full model id
const CLI_TIMEOUT_MS = Number(process.env.CLAUDE_TIMEOUT_MS || 180000);

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

// Cheap pre-filter for unsolved stubs (template boilerplate, solve() not written
// yet), so we don't spend a model call to be told the same thing. Every real
// solution prints an answer, so no output statement means it isn't finished.
// The model applies its own SKIP judgement for subtler cases.
if (!/\b(cout|printf|puts)\b/.test(code)) {
  console.log(`Skipping ${basename}: no output statement, looks like an unsolved stub`);
  process.exit(0);
}

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
  let name = null;
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
      if (norm(m[2]) === target) { id = m[1]; name = m[2].trim(); break; }
    }
  }
  if (!name) {
    try {
      const src = fs.readFileSync('docs/cses-categories.js', 'utf8');
      const block = src.match(/window\.CSES_NAMES = (\{[\s\S]*?\});/);
      if (block) {
        const names = JSON.parse(block[1]);
        name = names[target] || null;
      }
    } catch (_) {}
  }
  const url = id ? `https://cses.fi/problemset/task/${id}` : 'https://cses.fi/problemset/';
  const statement = id ? await jinaRead(url) : null;
  return { label: 'CSES', url, statement, meta: name ? { name } : null };
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
A derivation, not a code walkthrough. Lead the reader from the observation to the algorithm, covering what quantity is tracked, what choices exist, and why the method is correct and sufficient. Numbered list of 3-6 GENUINE reasoning steps. Each step starts DIRECTLY with the substance, with no bold label prefix like "**Count constraints:**" or "**Validate:**". Every step must carry justification ("because...", "this guarantees...", "it suffices to...").

Never state control flow BARE. Naming what the code does is fine, and often necessary, but every
mechanic must arrive attached to the reason it is correct or the reason it is enough.
- BARE, banned: "Fix a left endpoint and set the running total to zero."
- BARE, banned: "Grow the right pointer, adding the next element to the sum at each step."
- GOOD: "For each starting index we extend the window one element at a time and carry the sum
  forward. Recomputing each window from scratch would cost a factor of $n$ more, and carrying it
  forward loses nothing, because extending the window by one position only ever adds a single term."
Also banned outright, with or without justification, because they carry no information at all:
"read the input", "initialize a variable", "call the function", "print the answer".

Do NOT allocate one numbered step per loop or per line of code. Steps are units of REASONING, not
units of syntax. A plain nested scan is ONE step ("we try every starting position and extend the
window rightwards, because..."), never three steps for the outer loop, the inner loop and the update.
No step may open by setting up a loop variable or a counter. Open with the idea, and mention the
variable later in the sentence if it helps. If the algorithm is genuinely simple, THREE well-argued
steps beat six padded ones. Where the real content is a case analysis, give each case its own step
or sub-bullet, since that is where a reader actually needs help.

## Complexity
- **Time:** $O(\\cdot)$ — one clause tied to the real bottleneck.
- **Space:** $O(\\cdot)$ — one clause.

## Notes
ONLY if there is a genuine non-obvious implementation detail (overflow cast, why a small bound suffices, indexing trap, modular trick). Omit the whole section otherwise.

GROUNDING — the single most important rule. This documents ONE SPECIFIC solution, not the problem:
- Describe the algorithm THIS code actually implements. If the code solves the problem in a way that is
  unusual, suboptimal, or not the textbook approach, document what it does, not what it "should" do.
- If several correct approaches exist (say DP vs greedy vs two-pointer), the editorial must describe the
  one in the code and must not mention the others as though they were used.
- Every claim in Approach must be traceable to a real line of the given code. Name the actual variables,
  arrays and functions the author chose. If you cannot point at the code for a step, do not write it.
- Do NOT import steps from a canonical editorial you happen to know for this problem. An accurate write-up
  of a strange solution is correct; a polished write-up of a solution that is not in the file is wrong.
- If the code does NOT implement a working solution (an empty or unfinished \`solve()\`, only scratch
  comments, input parsing with no algorithm or output), then reply with EXACTLY the single word SKIP and
  nothing else. Never reconstruct a solution from the statement to fill the gap.

HARD RULES:
- LaTeX for EVERY variable, formula, index, modulus and complexity: $p_i$, $O(n \\log n)$, $S + 2a + 6b \\equiv 0 \\pmod 9$. Never raw math.
- Allowed macros: \\cdot \\log \\sqrt{} \\leq \\geq \\in \\pmod{} \\equiv \\lceil \\rceil \\lfloor \\rfloor \\sum \\frac{}{}.
- Reference real variable/function names from the code in \`backticks\` when pointing at something concrete.
- CRITICAL — inline code spans: every backtick that opens a code span MUST be closed with a backtick. NEVER use $ to close a backtick span. WRONG: \`dp[0] = 0$. CORRECT: \`dp[0] = 0\`.
- CRITICAL — dollar signs: $...$ is for mathematical expressions ONLY. Never put English prose, conjunctions, or plain words inside dollar signs. WRONG: $since zero coins are needed$ or $remains equal to$. CORRECT: $dp[x] = 0$.
- Be direct and technical. No filler ("We can observe that", "It is clear", "Simply", "Note that").
- Output ONLY the markdown starting at "# {TITLE}". Do NOT wrap it in code fences.

PERSON — these are the repo owner's own notes on their own solution:
- Write in first person plural ("we") or plain imperative ("sort the array", "walk the prefix sums").
  This is how every real editorial reads.
- NEVER refer to whoever wrote the code in the third person. The words "the author", "the writer",
  "the programmer", "the submitter", "the solution's author" must not appear. There is no third party
  here, and describing the reader to themselves is the clearest possible sign the text was generated.
- NEVER comment on how the code came to be, or on anything that is not live code. Do not mention
  commented-out blocks, abandoned attempts, scratch notes, earlier drafts, what was "first tried",
  or what the code "avoids doing". Document what the working code does, nothing about its history.
  WRONG: "the commented-out two-pointer attempt shows the author first tried a linear approach"
  RIGHT: (say nothing at all about it)
- Do not praise or judge the solution ("this elegant trick", "a clever choice", "cleanly handles").

VOICE — warm, explanatory, unhurried. Teach the reasoning to someone seeing the problem for the
first time. Full connected sentences that carry the reader from one thought to the next, NOT
compressed technical shorthand:
- Explain the chain of reasoning out loud. Sentences that link ideas are exactly right here, so
  "This is because...", "Thus...", "which means...", "so..." and "The key insight is that..." are
  all encouraged. Never strip a sentence down until it only makes sense to someone who already
  knows the answer.
- WRONG (too compressed): "The condition $\\sum r_i > 100t$ is the same as $\\sum (r_i - 100) > 0$."
  RIGHT (explains it): "A window counts as an attack when its sum beats $100$ per element. This is
  because the threshold grows with the window length, so subtracting $100$ from every value turns a
  moving target into a fixed one."
- Prefer a flowing paragraph over clipped fragments. Do not chase variety by inserting short blunt
  sentences; let each sentence run as long as the idea genuinely needs.
- NO COLONS in prose. A colon mid-sentence is a strong tell that text was machine-written.
  WRONG: "The trick is this: sort the array first."   RIGHT: "The trick is to sort the array first."
  WRONG: "Two cases arise: the even case and the odd case."   RIGHT: "Two cases arise, one even and one odd."
  WRONG: "**Key idea:** the sum is invariant."   RIGHT: "The key idea is that the sum never changes."
  The ONLY colons allowed in the whole document are the "**Time:**" and "**Space:**" labels in Complexity.
- NO em-dashes (—) in prose. Use a comma, a full stop, or restructure the sentence.
- Never use "Moreover", "Furthermore", "Additionally", "It is worth noting", "Importantly",
  "leverage", "utilize", "delve", "crucial", "robust", "seamless". These are filler, unlike the
  genuine connectives above, which carry meaning.
- Do not restate a point you already made in different words to pad a paragraph. Say it once.

LATEX CRITICAL RULES — violations cause visible rendering bugs in the browser:
- $...$ must contain ONLY a valid LaTeX math expression: variables, formulas, indices, complexities.
  NEVER put English prose inside $...$: no $since$, $if we$, $the sum of$, $output -1$.
- Every $ must be CLOSED on the SAME LINE. A sentence must never have an unmatched $.
- NEVER place a backtick (\`) immediately adjacent to a $ sign with no space between them.
  BAD:  \`dp[0]\`$since the answer is $0$   GOOD: \`dp[0]\` since the answer is $0$
  BAD:  $n$\`arr\`                            GOOD: $n$ elements in \`arr\`
- Pick ONE style per concept in each sentence: either $dp[i]$ (LaTeX) or \`dp[i]\` (code span). Never both for the same thing in the same clause.
- NEVER put LaTeX commands inside backticks. WRONG: \`\\pmod{10^9+7}\` or \`dp[i - c_j] \\pmod{10^9 + 7}\`. CORRECT: $\\pmod{10^9+7}$ or $dp[i - c_j] \\pmod{10^9 + 7}$.
- NEVER use \\\\text{} or \\\\texttt{} for code variable names. WRONG: $a \\geq \\text{last\\_end}$ or $\\texttt{sum}$. CORRECT: $a \\geq$ \`last_end\` or \`sum\`.
- Sanity check before outputting: delete all $...$. The remaining prose must be grammatically correct English.`;

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
    header = `You are a strong competitive programmer documenting THIS AUTHOR'S OWN accepted solution. You are given the ACTUAL problem statement and the author's code. Your job is to explain the insight behind the algorithm that is actually written in that code, and how one arrives at it. You are not writing a general editorial for the problem.`;
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
  // Try exact basename first, then any H1 (CF titles may use problem name instead of id)
  const exact = out.indexOf(`# ${basename}`);
  if (exact > 0) { out = out.slice(exact).trim(); }
  else {
    const h1 = out.search(/^# /m);
    if (h1 > 0) out = out.slice(h1).trim();
  }
  return out;
}

function fallbackReadme(ctx) {
  const title = (ctx.meta && ctx.meta.name) ? ctx.meta.name : basename;
  const link = ctx.url || `${ctx.label} problem source unavailable`;
  const codeLines = code.split(/\r?\n/).filter(Boolean).length;
  const hasSort = /\bsort\s*\(/.test(code);
  const hasBinarySearch = /\b(lower_bound|upper_bound|binary_search)\s*\(/.test(code) || /while\s*\([^)]*(?:low|lo|l)\s*<=\s*(?:high|hi|r)/.test(code);
  const hasDp = /\bdp\b|vector\s*<[^>]*>\s*dp|long long\s+dp|int\s+dp/.test(code);
  const bottleneck = hasSort ? 'sorting step' : hasBinarySearch ? 'binary-search loop' : hasDp ? 'dynamic-programming state transitions' : 'single pass over the input data';
  const time = hasSort ? '$O(n \\log n)$' : hasBinarySearch ? '$O(n \\log n)$' : '$O(n)$';

  return `# ${title}

> [Problem on ${ctx.label}](${link})

## Idea

The model-backed editorial generator was unavailable, so this fallback keeps the repository complete without failing CI. The accepted solution is the source of truth: it applies the core observation directly in about $${codeLines}$ lines of C++ and avoids simulation beyond the necessary checks.

## Approach

1. Identify the quantities maintained by the solution and update them in the same order as the accepted code, because each update represents one required condition from the problem.
2. Use the ${bottleneck} as the decisive step, since it is where the solution reduces the search space or verifies feasibility.
3. Return the answer once all required conditions have been checked, because no later state can invalidate an already completed test case.

## Complexity

- **Time:** ${time} — dominated by the ${bottleneck}.
- **Space:** $O(1)$ — aside from the input storage used by the implementation.`;
}

// Run the Claude Code CLI headlessly, feeding the prompt on stdin so no shell
// quoting can mangle the problem statement or the source code.
function runClaude(prompt) {
  return new Promise((resolve) => {
    const child = execFile(
      'claude',
      ['-p', '--model', MODEL, '--output-format', 'text', '--disallowedTools', 'Bash', 'Edit', 'Write'],
      { timeout: CLI_TIMEOUT_MS, maxBuffer: 10 * 1024 * 1024 },
      (err, stdout, stderr) => {
        if (err) {
          const why = err.killed ? `timed out after ${CLI_TIMEOUT_MS}ms` : err.message;
          resolve({ ok: false, reason: why, stderr: (stderr || '').trim().slice(0, 500) });
          return;
        }
        resolve({ ok: true, text: stdout });
      },
    );
    child.stdin.on('error', () => { /* child already gone; the callback reports it */ });
    child.stdin.end(prompt);
  });
}

async function callModel(prompt) {
  // No auth check here on purpose: the CLI resolves credentials itself, from
  // CLAUDE_CODE_OAUTH_TOKEN in CI or the logged-in session on a dev machine.
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await runClaude(prompt);
    if (res.ok && res.text.trim()) return cleanOutput(res.text);
    console.error(`attempt ${attempt}: ${res.reason || 'empty response'}${res.stderr ? ` | ${res.stderr}` : ''}`);
    await new Promise(r => setTimeout(r, 5000 * (attempt + 1)));
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

  // The model answers SKIP when the file has no finished solution to document,
  // rather than reconstructing an algorithm the code does not contain.
  if (readme && /^SKIP\b/i.test(readme.trim())) {
    console.log(`Skipping ${basename}: the model judged the solution unfinished`);
    process.exit(0);
  }

  if (!readme || !readme.startsWith('# ')) {
    // Write nothing rather than a template placeholder. A missing .md is retried
    // by the next run (the workflow rescans every source file); a placeholder in
    // its place would never be revisited, because the file now "has" a README.
    console.error(`::warning::Model generation failed for ${basename}; leaving it for a later run`);
    process.exit(0);
  }

  fs.writeFileSync(mdPath, sanitizeReadmeMd(readme) + '\n');
  console.log(`Generated: ${mdPath}`);
}

main().catch(e => {
  // Never abort the batch over one file, and never leave a half-written README.
  console.error(`::warning::Unexpected failure for ${basename}: ${e && e.message}`);
  process.exit(0);
});
