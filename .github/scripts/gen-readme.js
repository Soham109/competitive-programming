const fs = require('fs');
const path = require('path');

const filePath = process.argv[2]; // e.g., "codeforces/2050C.cpp"
if (!filePath) { console.error('Usage: node gen-readme.js <path>'); process.exit(1); }

const parts = filePath.split('/');
const platform = parts[0];
const filename = parts[parts.length - 1];
const basename = filename.replace(/\.[^.]+$/, '');
const mdPath = filePath.replace(/\.[^.]+$/, '.md');

if (basename === 'Template') {
  console.log(`Skipping Template file: ${filePath}`);
  process.exit(0);
}
if (fs.existsSync(mdPath)) {
  console.log(`README already exists: ${mdPath}`);
  process.exit(0);
}

const code = fs.readFileSync(filePath, 'utf8').trim();

let platformLabel, problemUrl, problemContext;
if (platform === 'codeforces') {
  platformLabel = 'Codeforces';
  const m = basename.match(/^(\d+)([A-Z]\d?)$/i);
  if (m) {
    problemUrl = `https://codeforces.com/problemset/problem/${m[1]}/${m[2].toUpperCase()}`;
    problemContext = `Codeforces problem ${basename} (${problemUrl}).`;
  } else {
    problemUrl = `https://codeforces.com/problemset`;
    problemContext = `A Codeforces problem named "${basename}".`;
  }
} else if (platform === 'cses') {
  platformLabel = 'CSES';
  problemUrl = `https://cses.fi/problemset/`;
  problemContext = `CSES problem titled "${basename}". The CSES problem set is at cses.fi/problemset.`;
} else {
  platformLabel = platform.charAt(0).toUpperCase() + platform.slice(1);
  problemUrl = '';
  problemContext = `A competitive programming problem named "${basename}" on ${platformLabel}.`;
}

const prompt = `You are documenting a competitive programming solution. Write a README for this problem.

Context: ${problemContext}

Solution code:
\`\`\`cpp
${code}
\`\`\`

Write the README in this exact format — no preamble, no extra text outside it:

# ${basename}

> [Problem on ${platformLabel}](${problemUrl})

## Idea

[1-3 sentences on the core insight or observation that makes the solution work]

## Approach

[numbered steps walking through the algorithm]

## Complexity

[Time and space complexity with brief justification]

Rules:
- Keep it concise and technical
- Only add a "## Notes" section if there is a genuinely non-obvious implementation detail (casting to long long, off-by-one, etc.)
- Do not pad with obvious statements
- Match the tone of a senior competitive programmer`;

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
  if (!res.ok) {
    console.error('API error:', JSON.stringify(data));
    process.exit(1);
  }

  const readme = data.content[0].text.trim();
  fs.writeFileSync(mdPath, readme + '\n');
  console.log(`Generated: ${mdPath}`);
}

main().catch(e => { console.error(e); process.exit(1); });
