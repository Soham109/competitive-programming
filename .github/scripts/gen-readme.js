const fs = require('fs');

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

let platformLabel, problemUrl;
if (platform === 'codeforces') {
  platformLabel = 'Codeforces';
  const m = basename.match(/^(\d+)([A-Z]\d?)$/i);
  problemUrl = m
    ? `https://codeforces.com/problemset/problem/${m[1]}/${m[2].toUpperCase()}`
    : `https://codeforces.com/problemset`;
} else if (platform === 'cses') {
  platformLabel = 'CSES';
  problemUrl = `https://cses.fi/problemset/`;
} else {
  platformLabel = platform.charAt(0).toUpperCase() + platform.slice(1);
  problemUrl = '';
}

const prompt = `You are writing a README for a competitive programming solution. Study this example carefully — yours must match its quality and style exactly.

=== EXAMPLE README (2218D) ===
# 2218D

> [Problem on Codeforces](https://codeforces.com/problemset/problem/2218/D)

## Idea

Generate the first primes and pair up consecutive ones. For each position $i$
the answer uses the product $p_i \\cdot p_{i+1}$, which guarantees the required
pairwise property while keeping every value distinct.

## Approach

1. Build a list of primes with a simple trial-division check.
2. Collect $n + 1$ primes so every index $i$ has a valid $p_{i+1}$.
3. Output $p_i \\cdot p_{i+1}$ for $i \\in [0, n)$, using \`long long\` to avoid overflow.

## Complexity

- **Time:** $O(n \\sqrt{p})$ where $p$ is the $(n+1)$-th prime — dominated by trial division.
- **Space:** $O(n)$ for the prime list.

## Notes

- Multiply with \`1LL\` before the second operand to stay in 64-bit range.
=== END EXAMPLE ===

Now write a README for this problem.

Platform: ${platformLabel}
Problem: ${basename}
URL: ${problemUrl}

\`\`\`cpp
${code}
\`\`\`

STRICT FORMATTING RULES — follow every one:

1. **Title line:** \`# ${basename}\` — nothing else on that line.
2. **Problem link:** \`> [Problem on ${platformLabel}](${problemUrl})\` — second line, exactly this format.
3. **## Idea** — 1–3 sentences. State the key mathematical or algorithmic insight. Not "we do X" but WHY X works. Use LaTeX for any math: inline as \`$...$\`, display as \`$$...$$\`.
4. **## Approach** — numbered steps. Each step is one short sentence. Reference variable names from the code. Use LaTeX for formulas, indices, bounds. No bullet points — only numbered list.
5. **## Complexity** — bullet list with **Time:** and **Space:** in bold. Always use $O(...)$ notation in LaTeX. Give a one-clause justification after each.
6. **## Notes** — ONLY include if there is a non-obvious implementation detail (e.g. overflow cast, modular inverse trick, 1-indexed vs 0-indexed subtlety). If nothing is surprising, OMIT this section entirely.
7. **LaTeX rules:**
   - Every variable, formula, bound, and index must be in LaTeX — never write raw "O(n log n)" or "p_i", always \`$O(n \\log n)$\` and \`$p_i$\`.
   - Use \`\\cdot\` for multiplication, \`\\log\`, \`\\sqrt{}\`, \`\\leq\`, \`\\geq\`, \`\\in\`, \`\\infty\` etc.
   - Subscripts: \`$a_i$\`, superscripts: \`$n^2$\`.
   - For sums/products: \`$\\sum_{i=0}^{n} a_i$\`.
8. **No filler.** Never write "We can observe that", "It is clear that", "Note that", "Simply", "Just". Be direct.
9. **Code references** in backticks when mentioning exact variable/function names from the code.
10. Output ONLY the markdown — no preamble, no explanation, nothing before \`# ${basename}\`.`;

async function main() {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await res.json();
  if (!res.ok) { console.error('API error:', JSON.stringify(data)); process.exit(1); }

  const readme = data.content[0].text.trim();
  fs.writeFileSync(mdPath, readme + '\n');
  console.log(`Generated: ${mdPath}`);
}

main().catch(e => { console.error(e); process.exit(1); });
