# competitive-programming

My competitive programming solutions — Codeforces and CSES

## Codeforces sync

The `Sync Codeforces Accepted Solutions` workflow runs daily and can also be
started manually from GitHub Actions. It reads accepted submissions from the
Codeforces API, downloads the source for missing C++ solutions, generates
READMEs, and pushes the result.

The workflow defaults to Codeforces handle `SohamAggarwal`. Repository settings
needed:

- Secret `CODEFORCES_COOKIE`: the full `Cookie` request header from a logged-in
  Codeforces browser session.

Optional:

- Variable `CODEFORCES_HANDLE`: override the default handle.
