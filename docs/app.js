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
  };

  el.repoLink.href = `https://github.com/${owner}/${repo}`;

  let solutions = []; // {platform, platformLabel, id, codePath, mdPath, key}
  let currentCode = "";

  marked.setOptions({ gfm: true, breaks: false });

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

  // ---- Build the index from one recursive tree call ----
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
      const sibling = `${dir}/${base}.md`;
      const readme = `${dir}/README.md`;
      let mdPath = null;
      if (mdSet.has(sibling)) mdPath = sibling;
      else if (mdSet.has(readme)) mdPath = readme;

      const id = mdPath === readme && parts.length > 2 ? parts[parts.length - 2] : base;

      out.push({
        platform,
        platformLabel: platformLabel(platform),
        id,
        codePath: path,
        mdPath,
        key: path,
      });
    }

    out.sort((a, b) =>
      a.platformLabel.localeCompare(b.platformLabel) ||
      a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: "base" })
    );
    solutions = out;
  }

  // ---- Sidebar render ----
  function renderNav(filterText = "") {
    const q = filterText.trim().toLowerCase();
    const groups = new Map();
    for (const s of solutions) {
      if (q && !(`${s.platformLabel} ${s.id}`.toLowerCase().includes(q))) continue;
      if (!groups.has(s.platformLabel)) groups.set(s.platformLabel, []);
      groups.get(s.platformLabel).push(s);
    }

    el.nav.innerHTML = "";
    if (groups.size === 0) {
      el.nav.innerHTML = `<p class="muted" style="padding:14px 20px">No matches.</p>`;
      return;
    }
    for (const [label, items] of groups) {
      const g = document.createElement("div");
      g.className = "group";
      g.innerHTML =
        `<div class="group-label"><span>${label}</span><span class="count">${items.length}</span></div>`;
      for (const s of items) {
        const a = document.createElement("a");
        a.className = "item";
        a.textContent = s.id;
        a.href = `#${encodeURIComponent(s.key)}`;
        a.dataset.key = s.key;
        g.appendChild(a);
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

  // ---- Render a solution ----
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
      .map(
        (ln, i) =>
          `<span class="code-line"><span class="ln">${i + 1}</span><span class="lc">${ln || " "}</span></span>`
      )
      .join("");
  }

  async function openSolution(key) {
    const s = solutions.find((x) => x.key === key);
    if (!s) { showEmpty(); return; }

    el.empty.hidden = true;
    el.content.hidden = true;
    el.loading.hidden = false;
    highlightActive();
    document.body.classList.remove("nav-open");

    try {
      const reqs = [fetch(RAW(s.codePath))];
      if (s.mdPath) reqs.push(fetch(RAW(s.mdPath)));
      const [codeRes, mdRes] = await Promise.all(reqs);
      const codeText = codeRes.ok ? await codeRes.text() : "// source unavailable";
      currentCode = codeText;

      el.cPlatform.textContent = s.platformLabel;
      el.cId.textContent = s.id;
      el.cSource.href = `https://github.com/${owner}/${repo}/blob/${branch}/${s.codePath}`;

      if (s.mdPath && mdRes && mdRes.ok) {
        el.desc.innerHTML = marked.parse(await mdRes.text());
        el.desc.hidden = false;
      } else {
        el.desc.innerHTML = "";
        el.desc.hidden = true;
      }
      el.fileName.textContent = s.codePath.split("/").pop();
      renderCode(codeText, extLang[ext(s.codePath)]);
      document.title = `${s.id} · ${s.platformLabel}`;

      el.loading.hidden = true;
      el.content.hidden = false;
      el.content.parentElement.scrollTop = 0;
    } catch (err) {
      el.loading.hidden = true;
      el.empty.hidden = false;
    }
  }

  function showEmpty() {
    el.content.hidden = true;
    el.loading.hidden = true;
    el.empty.hidden = false;
  }

  // ---- Routing ----
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

  // ---- Events ----
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
  el.menuToggle.addEventListener("click", () =>
    document.body.classList.toggle("nav-open")
  );
  window.addEventListener("hashchange", route);

  // ---- Boot ----
  (async () => {
    el.brandName.textContent = repo;
    try {
      await loadIndex();
      renderNav();
      el.sideFoot.textContent = `${solutions.length} solution${solutions.length === 1 ? "" : "s"}`;
      route();
    } catch (err) {
      el.nav.innerHTML = `<p class="muted" style="padding:14px 20px">Failed to load repo:<br>${err.message}</p>`;
      el.sideFoot.textContent = "";
    }
  })();
})();
