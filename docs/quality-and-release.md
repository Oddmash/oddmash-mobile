# Quality and release

## Test matrix
| Surface | Evidence required |
| --- | --- |
| Core | State transitions, threshold/velocity boundaries, cancellation, lock reference counts, cleanup |
| React | Controlled/uncontrolled, StrictMode, remount, simultaneous overlays and error states |
| Browsers | Chromium, Firefox and WebKit desktop/emulation; actual Android Chrome and iOS Safari/PWA |
| SSR | React 18/19, Next.js App Router import, hydration, no server DOM usage |
| A11y | Keyboard, 320 CSS px reflow, 200% text size, drag alternatives, focus restoration, contrasts, reduced motion, VoiceOver/TalkBack |
| Performance | Same fixture comparison, gzip incremental size, frame timing during drag; baseline and budget recorded before release |
| Delivery | lint, types, tests, build, package tarball inspection, clean consumer install, documentation links |

Emulation is not physical-device evidence. Report pass/fail/blocked/not run separately with exact revision, versions and reproducible cases. Do not claim WCAG conformity from automated scans only.

## Applicability
Owner: Oddmash maintainer, with scoped contributors where authorized. Required: accessibility, browser support, dependency licensing, reproducibility, public documentation, release recovery and support issue tracker. Optional: visual presets, additional framework adapters, hosted demo. Not applicable in MVP: accounts, billing, persistent user data, telemetry, server-side operations; package runs locally in consumer apps. Unresolved: device access, supported OS versions, exact performance budgets, final dependency decisions.

## Public alpha documentation

The reviewed `main` branch can publish the demo and usage documentation after trusted browser CI, a clean tarball install, and a built-site smoke check. Present physical-device, assistive technology, and performance coverage as recorded in the alpha verification notes. This documentation preview is separate from registry publishing and stable browser support.

## Release
Use develop for integration and main for approved releases. Require normal reviewed PRs and current CI. Set up trusted npm publishing separately; never embed tokens. Document semver, known limitations, changelog, package exports and rollback/deprecation. Generate llms.txt from versioned human documentation and verify URLs. Do not publish until authorization and evidence are complete. Retain prior published versions; prefer corrective release for regressions.
