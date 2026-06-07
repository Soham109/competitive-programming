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

const prompt = `You are a strong competitive programmer writing an editorial-quality README for a solution. You are given ONLY the source code — not the problem statement. Your job is to REVERSE-ENGINEER what the problem is asking and, more importantly, explain the INSIGHT that makes the solution work and HOW someone would arrive at it.

Study this gold-standard example. Notice it explains WHY, not WHAT:

=== GOLD EXAMPLE ===
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

Now write the README for this solution.

Problem: ${basename} on ${platformLabel}
URL: ${problemUrl}

\`\`\`cpp
${code}
\`\`\`

Produce EXACTLY these sections:

# ${basename}

> [Problem on ${platformLabel}](${problemUrl})

## Idea
2-5 sentences. State the SINGLE key observation that cracks the problem, and WHY it is true. This is the "aha" — e.g. a divisibility property, an invariant, a greedy exchange argument, a reformulation. If the code uses a non-obvious math fact (e.g. "a number is divisible by 9 iff its digit sum is"), name it explicitly and explain how it connects to the operations in the problem. Do NOT describe code structure here.

## Approach
A short derivation, not a code walkthrough. Walk the reader from the observation to the algorithm: what quantity are we tracking, what choices exist, why the search/greedy/formula is correct and sufficient. Use a numbered list ONLY for the genuine algorithmic steps (the reasoning), 3-6 items. BANNED phrases that just narrate code: "read the input", "initialize a variable", "loop over the string", "call the function", "output YES/NO". Every step must carry reasoning ("because...", "this guarantees...", "it suffices to...").

## Complexity
- **Time:** $O(\\cdot)$ with a one-clause reason tied to the actual bottleneck.
- **Space:** $O(\\cdot)$ with a one-clause reason.

## Notes
ONLY include if there is a genuine non-obvious implementation detail (overflow cast, why a bound like $\\le 9$ suffices, 0/1-indexing trap, modular trick). Omit the whole section otherwise.

HARD RULES:
- LaTeX for EVERY variable, formula, index, modulus and complexity: $p_i$, $O(n \\log n)$, $S + 2a + 6b \\equiv 0 \\pmod 9$. Never write raw math.
- Use \`\\cdot, \\log, \\sqrt{}, \\leq, \\geq, \\in, \\pmod{}, \\equiv$\`.
- Reference actual variable/function names from the code in \`backticks\` when pointing to a concrete piece.
- Be direct and technical. No filler ("We can observe that", "It is clear", "Simply", "Note that").
- Explain the MATH/ALGORITHM, never just what each line does.
- Output ONLY the markdown, starting at \`# ${basename}\`.`;

async function main() {
  const res = await fetch('https://models.inference.ai.azure.com/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: 1400,
      temperature: 0.4,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await res.json();
  if (!res.ok) { console.error('API error:', JSON.stringify(data)); process.exit(1); }

  let readme = data.choices[0].message.content.trim();
  // Strip an outer ```markdown ... ``` fence the model sometimes adds.
  readme = readme.replace(/^```(?:markdown|md)?\s*\n/, '').replace(/\n```\s*$/, '').trim();
  fs.writeFileSync(mdPath, readme + '\n');
  console.log(`Generated: ${mdPath}`);
}

main().catch(e => { console.error(e); process.exit(1); });
