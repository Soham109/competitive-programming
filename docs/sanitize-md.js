// Fixes common LLM markdown mistakes that break KaTeX in the docs site.
(function () {
  const LATEX_CMD = /\\(?:pmod|mod|equiv|leq|geq|neq|cdot|pm|times|log|sqrt|sum|frac|lfloor|rfloor|lceil|rceil|min|max|dots|ldots|text|texttt|in|left|right)\b|\\[a-zA-Z]+/;

  const MATH_PLACEHOLDER = (i) => `\x00MATH${i}\x00`;

  function unescapeLatexIdent(s) {
    return s.replace(/\\_/g, "_");
  }

  function isLatexOnly(inner) {
    const s = inner.trim();
    if (!LATEX_CMD.test(s)) return false;
    if (/^\\[a-zA-Z]+/.test(s)) return true;
    if (/\s\\[a-zA-Z]+/.test(s)) return true;
    return false;
  }

  // Pull \text{} / \texttt{} code identifiers out of math — they break under marked + KaTeX.
  function demoteCodeVarsInMath(md) {
    return md.replace(/\$([^$\n]+?)\$/g, (full, inner) => {
      // $a \geq \text{last\_end}$ or $a \geq \texttt{last\_end}$
      let m = inner.match(/^(.+?)\s*\\(geq|leq|neq|equiv|ge|le|gt|lt)\s+\\(?:text|texttt)\{([^}]+)\}$/);
      if (m) {
        const v = unescapeLatexIdent(m[3]);
        return `$${m[1]} \\${m[2]}$ \`${v}\``;
      }
      // $\geq \texttt{last\_end}$
      m = inner.match(/^\\(geq|leq|neq|equiv|ge|le|gt|lt)\s+\\(?:text|texttt)\{([^}]+)\}$/);
      if (m) {
        const v = unescapeLatexIdent(m[2]);
        return `$\\${m[1]}$ \`${v}\``;
      }
      // $\texttt{sum}$ or $\text{sum}$ alone → `sum`
      m = inner.match(/^\\(?:text|texttt)\{([^}]+)\}$/);
      if (m) {
        return `\`${unescapeLatexIdent(m[1])}\``;
      }
      // $\max(\texttt{a}, \texttt{b})$ → keep but strip texttt wrappers to plain math identifiers
      if (/\\(?:text|texttt)\{/.test(inner)) {
        const cleaned = inner.replace(/\\(?:text|texttt)\{([^}]+)\}/g, (_, v) =>
          unescapeLatexIdent(v).replace(/_/g, "\\_")
        );
        return `$${cleaned}$`;
      }
      return full;
    });
  }

  function sanitizeReadmeMd(md) {
    let out = md;

    // Normalize common LaTeX delimiters the model may emit into the site's
    // supported KaTeX delimiters.
    out = out.replace(/\\\[([\s\S]+?)\\\]/g, (_, expr) => `$$${expr}$$`);
    out = out.replace(/\\\(([^()\n]+?)\\\)/g, (_, expr) => `$${expr}$`);

    out = demoteCodeVarsInMath(out);

    // Backtick spans that contain LaTeX commands → math mode
    out = out.replace(/`([^`\n]+)`/g, (match, inner) => {
      if (isLatexOnly(inner)) return `$${inner.trim()}$`;
      return match;
    });

    // Isolated math operator then code var: $\geq$ `last_end`
    out = out.replace(
      /\$\\(geq|leq|neq|equiv|cdot|pm|times|ge|le|gt|lt)\$\s+`([a-zA-Z_][a-zA-Z0-9_]*)`/g,
      (_, op, v) => `$\\${op}$ \`${v}\``
    );

    // Model closes a code span with $ instead of `
    out = out.replace(/`([^`\n$]{1,120}?)\$(?=$|[\s,.):;])/gm, (_, inner) => `\`${inner}\``);

    // Adjacent backtick and $ confuse the markdown/KaTeX boundary
    out = out.replace(/(`+)\$/g, "$1 $");
    out = out.replace(/\$(`+)/g, "$ $1");

    return out;
  }

  // Shield $...$ / $$...$$ from marked (underscores inside math become emphasis otherwise).
  function protectMathBlocks(md) {
    const blocks = [];
    let out = md.replace(/\$\$([\s\S]+?)\$\$/g, (_, expr) => {
      const i = blocks.length;
      blocks.push(`$$${expr}$$`);
      return MATH_PLACEHOLDER(i);
    });
    out = out.replace(/\$([^$\n]+?)\$/g, (_, expr) => {
      const i = blocks.length;
      blocks.push(`$${expr}$`);
      return MATH_PLACEHOLDER(i);
    });
    return { text: out, blocks };
  }

  function restoreMathBlocks(html, blocks) {
    return html.replace(/\x00MATH(\d+)\x00/g, (_, i) => blocks[+i] ?? "");
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { sanitizeReadmeMd, protectMathBlocks, restoreMathBlocks };
  } else {
    globalThis.sanitizeReadmeMd = sanitizeReadmeMd;
    globalThis.protectMathBlocks = protectMathBlocks;
    globalThis.restoreMathBlocks = restoreMathBlocks;
  }
})();
