# competitive-programming

My competitive programming solutions — Codeforces and CSES

## Codeforces sync

The `Sync Codeforces Accepted Solutions` workflow runs daily and can also be
started manually from GitHub Actions. It reads accepted submissions from the
Codeforces API, downloads the source for missing C++ solutions, generates
READMEs, and pushes the result.

Repository settings needed:

- Variable `CODEFORCES_HANDLE`: your Codeforces handle.
- Secret `CODEFORCES_COOKIE`: the full `Cookie` request header from a logged-in
  Codeforces browser session.
