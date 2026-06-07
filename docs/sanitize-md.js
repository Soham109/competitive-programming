// Fixes common LLM markdown mistakes that break KaTeX in the docs site.
(function () {
  const LATEX_CMD = /\\(?:pmod|mod|equiv|leq|geq|neq|cdot|pm|times|log|sqrt|sum|frac|lfloor|rfloor|lceil|rceil|min|max|dots|ldots|text|texttt|in|left|right|lfloor|rfloor)\b|\\[a-zA-Z]+/;

  function isLatexOnly(inner) {
    const s = inner.trim();
    if (!LATEX_CMD.test(s)) return false;
    // Pure LaTeX span, or code + trailing LaTeX (e.g. dp[i-j] \pmod{...})
    if (/^\\[a-zA-Z]+/.test(s)) return true;
    if (/\s\\[a-zA-Z]+/.test(s)) return true;
    return false;
  }

  function sanitizeReadmeMd(md) {
    let out = md;

    // Backtick spans that contain LaTeX commands → math mode
    out = out.replace(/`([^`\n]+)`/g, (match, inner) => {
      if (isLatexOnly(inner)) return `$${inner.trim()}$`;
      return match;
    });

    // Isolated math operator then code var: $\geq$ `last_end` → $\geq \texttt{last\_end}$
    out = out.replace(
      /\$\\(geq|leq|neq|equiv|cdot|pm|times)\$\s+`([a-zA-Z_][a-zA-Z0-9_]*)`/g,
      (_, op, v) => `$\\${op} \\texttt{${v.replace(/_/g, "\\_")}}$`
    );

    // Model closes a code span with $ instead of ` (e.g. `dp[0] = 0$)
    out = out.replace(/`([^`\n$]{1,80}?)\$(?=$|[\s,.):;])/gm, (_, inner) => `\`${inner}\``);

    // Adjacent backtick and $ confuse the markdown/KaTeX boundary
    out = out.replace(/(`+)\$/g, "$1 $");
    out = out.replace(/\$(`+)/g, "$ $1");

    return out;
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { sanitizeReadmeMd };
  } else {
    globalThis.sanitizeReadmeMd = sanitizeReadmeMd;
  }
})();
