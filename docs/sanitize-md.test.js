const test = require('node:test');
const assert = require('node:assert');
const { sanitizeReadmeMd } = require('./sanitize-md.js');

// Regression: the model splits one formula around a code span, e.g.
//   $\gcd($ `g` $, a_j)$
// Both $ pairs are fragments of a single expression, so KaTeX pairs the
// delimiters wrong and renders the following sentence as math.
test('rejoins a formula split around a code span', () => {
  assert.strictEqual(
    sanitizeReadmeMd('the largest $\\gcd($ `g` $, a_j)$. Every unused number'),
    'the largest $\\gcd(g, a_j)$. Every unused number'
  );
});

test('rejoins when the tail carries braces', () => {
  assert.strictEqual(
    sanitizeReadmeMd('replace `g` with $\\gcd($ `g` $, a_{best})$, and print'),
    'replace `g` with $\\gcd(g, a_{best})$, and print'
  );
});

test('escapes underscores from the inlined identifier', () => {
  assert.strictEqual(
    sanitizeReadmeMd('$\\max($ `last_end` $, x)$'),
    '$\\max(last\\_end, x)$'
  );
});

// The split pattern is legitimate when the first fragment is a complete
// expression, which is what the generator prompt actually asks for.
test('leaves a complete math fragment beside a code span alone', () => {
  const ok = 'we need $a \\geq$ `last_end` before continuing';
  assert.strictEqual(sanitizeReadmeMd(ok), ok);
});

test('leaves two genuinely separate formulas alone', () => {
  const ok = 'compare $x$ with `y` and then $z$ follows';
  assert.strictEqual(sanitizeReadmeMd(ok), ok);
});

// Pre-existing behaviour must not regress.
test('still demotes texttt code vars out of math', () => {
  assert.strictEqual(sanitizeReadmeMd('$\\texttt{sum}$'), '`sum`');
});

test('still repairs a code span closed with a dollar sign', () => {
  assert.strictEqual(sanitizeReadmeMd('set `dp[0] = 0$ and move on'), 'set `dp[0] = 0` and move on');
});
