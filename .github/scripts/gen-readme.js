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

const prompt = `You are writing a README for a competitive programming solution. Match this example exactly in style, tone, and formatting.

=== EXAMPLE ===
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
=== END EXAMPLE ===

Problem: ${basename} on ${platformLabel}
URL: ${problemUrl}

\`\`\`cpp
${code}
\`\`\`

RULES:
1. Title: \`# ${basename}\` only.
2. Second line: \`> [Problem on ${platformLabel}](${problemUrl})\`
3. ## Idea — 1-3 sentences. Core insight. Why it works. LaTeX for all math.
4. ## Approach — numbered steps, one sentence each. Reference exact variable/function names. LaTeX for formulas/indices/bounds.
5. ## Complexity — bullet list. Bold **Time:** and **Space:**. Always $O(...)$ in LaTeX with justification.
6. ## Notes — ONLY if there is a non-obvious implementation detail. Omit entirely if nothing surprising.
7. LaTeX: every variable, formula, index in $...$. Use \\cdot, \\log, \\sqrt{}, \\leq, \\geq, \\in, \\pmod{}.
8. No filler words. No "We observe", "Note that", "Simply". Be direct.
9. Output ONLY the markdown starting with # ${basename}.`;

async function main() {
  const res = await fetch('https://models.inference.ai.azure.com/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await res.json();
  if (!res.ok) { console.error('API error:', JSON.stringify(data)); process.exit(1); }

  const readme = data.choices[0].message.content.trim();
  fs.writeFileSync(mdPath, readme + '\n');
  console.log(`Generated: ${mdPath}`);
}

main().catch(e => { console.error(e); process.exit(1); });
