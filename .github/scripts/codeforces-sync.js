#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const SOURCE_DIR = 'codeforces';
const DEFAULT_EXTENSIONS = ['.cpp'];

function usage(code = 0) {
  console.log(`Usage: node .github/scripts/codeforces-sync.js --handle <cf-handle> [options]

Options:
  --cookie <cookie>       Codeforces browser Cookie header. Prefer CODEFORCES_COOKIE.
  --commit                Commit downloaded accepted solutions.
  --push                  Push to the current branch upstream. Implies --commit --pull.
  --pull                  Rebase onto upstream before committing.
  --dry-run               Print actions without writing, committing, or pushing.
  --max-submissions N     Scan only the latest N submissions. Default scans all.
  --extensions LIST       Comma-separated extensions to consider existing. Default: .cpp.

Notes:
  Codeforces' API exposes verdicts and metadata, but not submitted source code.
  Downloading source requires a logged-in Codeforces cookie that can view your submissions.`);
  process.exit(code);
}

function parseArgs(argv) {
  const args = {
    handle: process.env.CODEFORCES_HANDLE || '',
    cookie: process.env.CODEFORCES_COOKIE || '',
    commit: false,
    push: false,
    pull: false,
    dryRun: false,
    maxSubmissions: 0,
    extensions: DEFAULT_EXTENSIONS,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const value = () => {
      if (i + 1 >= argv.length) throw new Error(`${arg} needs a value`);
      return argv[++i];
    };

    if (arg === '--handle') args.handle = value();
    else if (arg === '--cookie') args.cookie = value();
    else if (arg === '--commit') args.commit = true;
    else if (arg === '--push') args.push = true;
    else if (arg === '--pull') args.pull = true;
    else if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--max-submissions') args.maxSubmissions = Number(value());
    else if (arg === '--extensions') {
      args.extensions = value()
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean)
        .map((x) => x.startsWith('.') ? x : `.${x}`);
    } else if (arg === '--help' || arg === '-h') usage();
    else throw new Error(`Unknown option: ${arg}`);
  }

  if (args.push) args.commit = true;
  if (args.push) args.pull = true;
  if (!args.handle) throw new Error('Set CODEFORCES_HANDLE or pass --handle <handle>.');
  if (!Number.isFinite(args.maxSubmissions) || args.maxSubmissions < 0) {
    throw new Error('--max-submissions must be a non-negative number.');
  }
  return args;
}

function git(args, options = {}) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    stdio: options.stdio || ['ignore', 'pipe', 'pipe'],
    ...options,
  }).trim();
}

function gitMaybe(args) {
  try {
    return git(args);
  } catch (_) {
    return '';
  }
}

function repoRoot() {
  const root = gitMaybe(['rev-parse', '--show-toplevel']);
  if (!root) throw new Error('Run this inside a git repository.');
  return root;
}

function problemKey(problem) {
  if (!problem || problem.contestId == null || !problem.index) return null;
  return `${problem.contestId}${String(problem.index).toUpperCase()}`;
}

function isCppLanguage(language) {
  return /\b(g\+\+|c\+\+|clang\+\+|msvc)\b/i.test(language || '');
}

function sourceFilename(submission) {
  const key = problemKey(submission.problem);
  if (!key) return null;
  if (isCppLanguage(submission.programmingLanguage)) return `${key}.cpp`;
  return null;
}

function findExistingSource(root, key, extensions) {
  const dir = path.join(root, SOURCE_DIR);
  for (const ext of extensions) {
    const direct = path.join(dir, `${key}${ext}`);
    if (fs.existsSync(direct)) return path.relative(root, direct);
  }

  if (!fs.existsSync(dir)) return null;
  const targets = new Set(extensions.map((ext) => `${key}${ext}`.toLowerCase()));
  for (const file of fs.readdirSync(dir)) {
    if (targets.has(file.toLowerCase())) return path.join(SOURCE_DIR, file);
  }
  return null;
}

function isTracked(file) {
  return gitMaybe(['ls-files', '--error-unmatch', '--', file]) === file;
}

function status(file) {
  return gitMaybe(['status', '--porcelain=v1', '--', file]);
}

function decodeHtml(value) {
  return value
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

function extractSource(html) {
  const match = html.match(/<pre[^>]*id=["']program-source-text["'][^>]*>([\s\S]*?)<\/pre>/i);
  if (!match) return null;
  const code = decodeHtml(match[1]).replace(/\r\n/g, '\n').replace(/[ \t]+\n/g, '\n').trimEnd();
  return code.length > 0 ? `${code}\n` : null;
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'competitive-programming-codeforces-sync/1.0' },
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (_) {
    throw new Error(`Codeforces returned non-JSON response (${res.status}).`);
  }
  if (!res.ok || data.status !== 'OK') {
    throw new Error(data.comment || `Codeforces API error (${res.status}).`);
  }
  return data.result || [];
}

async function fetchSubmissions(handle, maxSubmissions) {
  const pageSize = maxSubmissions > 0 ? Math.min(maxSubmissions, 10000) : 10000;
  let from = 1;
  const all = [];

  while (true) {
    const remaining = maxSubmissions > 0 ? maxSubmissions - all.length : pageSize;
    if (maxSubmissions > 0 && remaining <= 0) break;
    const count = maxSubmissions > 0 ? Math.min(pageSize, remaining) : pageSize;
    const url = `https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}&from=${from}&count=${count}`;
    const page = await fetchJson(url);
    all.push(...page);
    if (page.length < count) break;
    from += page.length;
    await new Promise((resolve) => setTimeout(resolve, 2100));
  }

  return all;
}

function latestAcceptedByProblem(submissions) {
  const byKey = new Map();
  for (const submission of submissions) {
    if (submission.verdict !== 'OK') continue;
    if (!sourceFilename(submission)) continue;
    const key = problemKey(submission.problem);
    const old = byKey.get(key);
    if (!old || submission.creationTimeSeconds > old.creationTimeSeconds) {
      byKey.set(key, submission);
    }
  }
  return [...byKey.values()].sort((a, b) => b.creationTimeSeconds - a.creationTimeSeconds);
}

async function fetchSubmissionSource(submission, cookie) {
  if (!cookie) return { ok: false, reason: 'missing CODEFORCES_COOKIE' };

  const contestId = submission.contestId || submission.problem.contestId;
  const urls = [
    `https://codeforces.com/problemset/submission/${contestId}/${submission.id}`,
    `https://codeforces.com/contest/${contestId}/submission/${submission.id}`,
  ];

  for (const url of urls) {
    const res = await fetch(url, {
      headers: {
        Cookie: cookie,
        'User-Agent': 'Mozilla/5.0 (compatible; accepted-solution-sync)',
        Accept: 'text/html,application/xhtml+xml',
      },
    });
    const html = await res.text();
    const code = extractSource(html);
    if (code) return { ok: true, code, url };
    if (/You are not allowed to view the requested page/i.test(html)) {
      return { ok: false, reason: 'Codeforces rejected the cookie for this submission' };
    }
    if (/cf-mitigated|Just a moment|challenge-platform/i.test(html)) {
      return { ok: false, reason: 'Cloudflare challenge blocked the request' };
    }
  }

  return { ok: false, reason: 'source block not found' };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = repoRoot();
  process.chdir(root);
  fs.mkdirSync(path.join(root, SOURCE_DIR), { recursive: true });

  console.log(`Scanning accepted Codeforces submissions for ${args.handle}...`);
  const submissions = await fetchSubmissions(args.handle, args.maxSubmissions);
  const accepted = latestAcceptedByProblem(submissions);
  const written = [];
  const tracked = [];
  const skipped = [];
  const failed = [];

  for (const submission of accepted) {
    const key = problemKey(submission.problem);
    const filename = sourceFilename(submission);
    const existing = findExistingSource(root, key, args.extensions);

    if (existing && isTracked(existing) && !status(existing)) {
      tracked.push(existing);
      continue;
    }

    const file = existing || path.join(SOURCE_DIR, filename);
    if (existing && status(existing) && !status(existing).startsWith('?? ')) {
      skipped.push({ key, file, reason: 'local file has uncommitted edits' });
      continue;
    }

    const fetched = await fetchSubmissionSource(submission, args.cookie);
    if (!fetched.ok) {
      failed.push({ key, name: submission.problem.name || '', reason: fetched.reason });
      continue;
    }

    if (args.dryRun) {
      console.log(`Would write ${file} from submission ${submission.id}`);
      written.push(file);
    } else {
      fs.writeFileSync(path.join(root, file), fetched.code, 'utf8');
      written.push(file);
      console.log(`Wrote ${file} from submission ${submission.id}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 900));
  }

  console.log(`Accepted C++ problems found: ${accepted.length}`);
  console.log(`Already tracked: ${new Set(tracked).size}`);
  console.log(`Downloaded or ready: ${new Set(written).size}`);

  if (skipped.length > 0) {
    console.log(`Skipped files with local edits: ${skipped.length}`);
    for (const item of skipped.slice(0, 25)) {
      console.log(`  - ${item.file} (${item.key}): ${item.reason}`);
    }
  }

  if (failed.length > 0) {
    console.log(`Could not download source for ${failed.length} accepted problem(s):`);
    for (const item of failed.slice(0, 25)) {
      console.log(`  - ${item.key}${item.name ? ` ${item.name}` : ''}: ${item.reason}`);
    }
    if (failed.length > 25) console.log(`  ...and ${failed.length - 25} more`);
  }

  if (args.commit || args.push || args.pull) {
    throw new Error('Commit/push options are not used by this repo workflow; let the workflow commit generated files.');
  }
}

main().catch((err) => {
  console.error(`codeforces-sync: ${err.message}`);
  process.exit(1);
});
