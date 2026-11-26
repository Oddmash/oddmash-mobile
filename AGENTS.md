# Oddmash Mobile working agreements

Follow the [organization agreements](https://github.com/Oddmash/.github/blob/main/AGENTS.md) and relevant [Oddmash skills](https://github.com/Oddmash/oddmash-skills).

- Product integration branch: develop. Production release branch: main.
- Planning contracts live under docs/. Proposed APIs are not public promises until released.
- Start authorized work after repository, issue, claim and permission checks. Do not end an implementation turn with only an intention to work.
- Use TypeScript, React 18/19, pnpm and independent module exports. Do not require a router or CSS framework.
- Keep DOM access client-side; SSR imports must be safe. Avoid implicit global gesture cancellation.
- Add regression tests for gesture cancellation, scrolling, viewport changes, keyboard access, focus and reduced motion. Real-device findings are separate from emulation.
- No npm release until the release gate in docs/quality-and-release.md is satisfied.

## GitHub account use

Follow the [Oddmash GitHub account policy](https://github.com/Oddmash/.github/blob/main/docs/github-account-policy.md). Use `arvynoo` for AI-authored commits, issues and PRs with command-scoped authentication and a separate checkout or worktree per session. Only `qtaghdi` gives final approval to and manually merges external contributions.
