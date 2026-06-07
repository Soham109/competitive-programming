(() => {
  const CFG = window.SITE_CONFIG;
  const { owner, repo, branch } = CFG;
  const RAW = (path) =>
    `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${encodeURI(path)}`;

  const extLang = {
    cpp: "cpp", cc: "cpp", cxx: "cpp", c: "c",
    py: "python", java: "java", kt: "kotlin",
    js: "javascript", ts: "typescript", go: "go", rs: "rust",
  };

  const el = {
    nav: document.getElementById("nav"),
    filter: document.getElementById("filter"),
    empty: document.getElementById("empty"),
    loading: document.getElementById("loading"),
    content: document.getElementById("content"),
    cPlatform: document.getElementById("c-platform"),
    cId: document.getElementById("c-id"),
    cSource: document.getElementById("c-source"),
    desc: document.getElementById("desc"),
    code: document.getElementById("code"),
    fileName: document.getElementById("file-name"),
    copyBtn: document.getElementById("copy-btn"),
    sideFoot: document.getElementById("side-foot"),
    repoLink: document.getElementById("repo-link"),
    brandName: document.getElementById("brand-name"),
    menuToggle: document.getElementById("menu-toggle"),
    sidebarToggle: document.getElementById("sidebar-toggle"),
  };

  el.repoLink.href = `https://github.com/${owner}/${repo}`;

  let solutions = [];
  let currentCode = "";
  let cfNames = {};

  const csesCategories = window.CSES_CATEGORIES || {};
  const csesNames = window.CSES_NAMES || {};

  marked.setOptions({ gfm: true, breaks: false });

  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const sanitizeMd = globalThis.sanitizeReadmeMd || ((md) => md);
  const protectMath = globalThis.protectMathBlocks || ((md) => ({ text: md, blocks: [] }));
  const restoreMath = globalThis.restoreMathBlocks || ((html) => html);

  function splitWords(s) {
    return s
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");
  }

  // Single source of truth for display names everywhere (nav, title, H1 rewrite).
  function solutionTitle(s) {
    if (s.platform === "codeforces") return cfNames[s.id.toUpperCase()] || s.id;
    if (s.platform === "cses") return csesNames[norm(s.id)] || splitWords(s.id);
    return s.id;
  }

  function contentHeading(s) {
    const title = solutionTitle(s);
    if (s.platform === "codeforces" && cfNames[s.id.toUpperCase()]) {
      return `${s.id} — ${title}`;
    }
    return title;
  }

  function rewriteMdHeading(md, title) {
    if (!/^# /m.test(md)) return md;
    return md.replace(/^# .+\r?\n/m, `# ${title}\r\n`);
  }

  function parseMarkdown(md) {
    const cleaned = sanitizeMd(md);
    const { text, blocks } = protectMath(cleaned);
    return restoreMath(marked.parse(text), blocks);
  }

  function platformLabel(folder) {
    return CFG.platforms[folder.toLowerCase()] ||
      folder.charAt(0).toUpperCase() + folder.slice(1);
  }

  function basename(path) {
    const f = path.split("/").pop();
    const dot = f.lastIndexOf(".");
    return dot === -1 ? f : f.slice(0, dot);
  }
  function ext(path) {
    const f = path.split("/").pop();
    const dot = f.lastIndexOf(".");
    return dot === -1 ? "" : f.slice(dot + 1).toLowerCase();
  }

  async function loadCFNames() {
    const CACHE_KEY = "cf-problem-names-v1";
    const CACHE_TTL = 86400000;
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { ts, data } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL) return data;
      }
    } catch {}
    try {
      const res = await fetch("https://codeforces.com/api/problemset.problems");
      if (!res.ok) return {};
      const json = await res.json();
      if (json.status !== "OK") return {};
      const map = {};
      for (const p of json.result.problems) {
        map[`${p.contestId}${p.index}`.toUpperCase()] = p.name;
      }
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: map })); } catch {}
      return map;
    } catch {
      return {};
    }
  }

  async function loadIndex() {
    const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const data = await res.json();
    if (data.truncated) console.warn("Tree truncated — repo very large.");

    const files = data.tree.filter((n) => n.type === "blob").map((n) => n.path);
    const ignore = new Set(CFG.ignore.map((s) => s.toLowerCase()));
    const mdSet = new Set(files.filter((p) => p.toLowerCase().endsWith(".md")));

    const out = [];
    for (const path of files) {
      const parts = path.split("/");
      if (parts.length < 2) continue;
      const platform = parts[0];
      if (ignore.has(platform.toLowerCase())) continue;
      const e = ext(path);
      if (!CFG.codeExtensions.includes(e)) continue;

      const dir = parts.slice(0, -1).join("/");
      const base = basename(path);
      if (base.toLowerCase() === "template") continue;

      const sibling = `${dir}/${base}.md`;
      const readme = `${dir}/README.md`;
      let mdPath = null;
      if (mdSet.has(sibling)) mdPath = sibling;
      else if (mdSet.has(readme)) mdPath = readme;

      const id = mdPath === readme && parts.length > 2 ? parts[parts.length - 2] : base;

      out.push({ platform, platformLabel: platformLabel(platform), id, codePath: path, mdPath, key: path });
    }

    out.sort((a, b) =>
      a.platformLabel.localeCompare(b.platformLabel) ||
      a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: "base" })
    );
    solutions = out;
  }

  function makeItem(s) {
    const a = document.createElement("a");
    a.className = "item";
    a.href = `#${encodeURIComponent(s.key)}`;
    a.dataset.key = s.key;
    a.textContent = solutionTitle(s);
    return a;
  }

  function makeCollapseLabel(text, count, collapseKey, targetEl, cls) {
    const div = document.createElement("div");
    div.className = cls;
    const right = count != null
      ? `<span class="count">${count}</span><span class="chevron"></span>`
      : `<span class="chevron"></span>`;
    div.innerHTML = `<span class="label-text">${text}</span><span class="label-right">${right}</span>`;
    div.addEventListener("click", (e) => {
      e.stopPropagation();
      const collapsed = targetEl.classList.toggle("collapsed");
      if (collapseKey) localStorage.setItem(collapseKey, collapsed ? "1" : "0");
    });
    return div;
  }

  function renderNav(filterText = "") {
    const q = filterText.trim().toLowerCase();

    const platforms = new Map();
    for (const s of solutions) {
      const title = solutionTitle(s);
      if (q && !(`${s.platformLabel} ${s.id} ${title}`.toLowerCase().includes(q))) continue;
      if (!platforms.has(s.platformLabel)) platforms.set(s.platformLabel, []);
      platforms.get(s.platformLabel).push(s);
    }

    el.nav.innerHTML = "";
    if (platforms.size === 0) {
      el.nav.innerHTML = `<p class="muted" style="padding:14px 20px">No matches.</p>`;
      return;
    }

    for (const [label, items] of platforms) {
      const g = document.createElement("div");
      g.className = "group";
      const gKey = `nav:${label}`;
      if (localStorage.getItem(gKey) === "1") g.classList.add("collapsed");

      g.appendChild(makeCollapseLabel(label, items.length, gKey, g, "group-label"));

      const isCses = label === "CSES";
      const hasCats = isCses && Object.keys(csesCategories).length > 0;

      if (hasCats && !q) {
        const cats = new Map();
        for (const s of items) {
          const cat = csesCategories[norm(s.id)] || "Other";
          if (!cats.has(cat)) cats.set(cat, []);
          cats.get(cat).push(s);
        }
        for (const [cat, catItems] of cats) {
          const sg = document.createElement("div");
          sg.className = "subgroup";
          const sgKey = `nav:CSES:${cat}`;
          if (localStorage.getItem(sgKey) === "1") sg.classList.add("collapsed");
          sg.appendChild(makeCollapseLabel(cat, catItems.length, sgKey, sg, "subgroup-label"));
          catItems.forEach((s) => sg.appendChild(makeItem(s)));
          g.appendChild(sg);
        }
      } else {
        items.forEach((s) => g.appendChild(makeItem(s)));
      }

      el.nav.appendChild(g);
    }
    highlightActive();
  }

  function highlightActive() {
    const key = decodeURIComponent(location.hash.slice(1));
    el.nav.querySelectorAll(".item").forEach((n) =>
      n.classList.toggle("active", n.dataset.key === key)
    );
  }

  function renderCode(text, language) {
    let html;
    try {
      html = language && hljs.getLanguage(language)
        ? hljs.highlight(text, { language }).value
        : hljs.highlightAuto(text).value;
    } catch {
      html = text.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
    }
    const lines = html.split("\n");
    if (lines.length && lines[lines.length - 1] === "") lines.pop();
    el.code.innerHTML = lines
      .map((ln, i) =>
        `<span class="code-line"><span class="ln">${i + 1}</span><span class="lc">${ln || " "}</span></span>`
      )
      .join("");
  }

  async function openSolution(key) {
    const s = solutions.find((x) => x.key === key);
    if (!s) { showEmpty(); return; }

    highlightActive();
    document.body.classList.remove("nav-open");

    const firstOpen = el.content.hidden;
    if (firstOpen) {
      el.empty.hidden = true;
      el.loading.hidden = false;
    }

    try {
      const reqs = [fetch(RAW(s.codePath))];
      if (s.mdPath) reqs.push(fetch(RAW(s.mdPath)));
      const [codeRes, mdRes] = await Promise.all(reqs);
      const codeText = codeRes.ok ? await codeRes.text() : "// source unavailable";
      currentCode = codeText;

      el.cPlatform.textContent = s.platformLabel;
      el.cId.textContent = contentHeading(s);
      el.cSource.href = `https://github.com/${owner}/${repo}/blob/${branch}/${s.codePath}`;

      if (s.mdPath && mdRes && mdRes.ok) {
        const rawMd = rewriteMdHeading(await mdRes.text(), solutionTitle(s));
        el.desc.innerHTML = parseMarkdown(rawMd);
        renderMathInElement(el.desc, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
          ],
          ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "annotation", "annotation-xml"],
          throwOnError: false,
        });
        el.desc.hidden = false;
      } else {
        el.desc.innerHTML = "";
        el.desc.hidden = true;
      }
      el.fileName.textContent = s.codePath.split("/").pop();
      renderCode(codeText, extLang[ext(s.codePath)]);
      document.title = `${solutionTitle(s)} · ${s.platformLabel}`;

      el.empty.hidden = true;
      el.loading.hidden = true;
      el.content.hidden = false;
      el.content.parentElement.scrollTop = 0;
    } catch (_) {
      el.loading.hidden = true;
      el.content.hidden = true;
      el.empty.hidden = false;
    }
  }

  function showEmpty() {
    el.content.hidden = true;
    el.loading.hidden = true;
    el.empty.hidden = false;
  }

  function route() {
    const key = decodeURIComponent(location.hash.slice(1));
    if (key && solutions.find((x) => x.key === key)) {
      openSolution(key);
    } else if (solutions.length > 0) {
      const first = solutions[0];
      history.replaceState(null, "", `#${encodeURIComponent(first.key)}`);
      openSolution(first.key);
    } else {
      showEmpty();
      highlightActive();
    }
  }

  function setSidebarCollapsed(on) {
    document.body.classList.toggle("sidebar-collapsed", on);
    el.sidebarToggle.textContent = on ? "›" : "‹";
    localStorage.setItem("sidebar-collapsed", on ? "1" : "0");
  }
  el.sidebarToggle.addEventListener("click", () =>
    setSidebarCollapsed(!document.body.classList.contains("sidebar-collapsed"))
  );
  if (localStorage.getItem("sidebar-collapsed") === "1") setSidebarCollapsed(true);

  el.filter.addEventListener("input", (e) => renderNav(e.target.value));
  el.copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      el.copyBtn.textContent = "Copied";
      setTimeout(() => (el.copyBtn.textContent = "Copy"), 1200);
    } catch {
      el.copyBtn.textContent = "Failed";
      setTimeout(() => (el.copyBtn.textContent = "Copy"), 1200);
    }
  });
  el.menuToggle.addEventListener("click", () => document.body.classList.toggle("nav-open"));
  window.addEventListener("hashchange", route);

  (async () => {
    el.brandName.textContent = repo;
    try {
      const [, loadedCFNames] = await Promise.all([loadIndex(), loadCFNames()]);
      cfNames = loadedCFNames;
      renderNav();
      el.sideFoot.textContent = `${solutions.length} solution${solutions.length === 1 ? "" : "s"}`;
      route();
    } catch (err) {
      el.nav.innerHTML = `<p class="muted" style="padding:14px 20px">Failed to load repo:<br>${err.message}</p>`;
      el.sideFoot.textContent = "";
    }
  })();
})();
