# Alpha verification

These checks apply to the documentation preview and the packed alpha candidate for `@oddmash/mobile-interactions`.

| Area | Evidence |
| --- | --- |
| Install and package | Frozen pnpm install and build. Installed the tarball in clean React 18.3.1 and 19.3.1 projects. Verified public subpaths, server rendering, and CSS resolution. |
| Browser flows | Playwright 1.65.0 runs the shared cases in Chromium, Firefox, and WebKit. The two skipped project cases use Chromium CDP touch emulation. See [browser verification](browser-verification.md). |
| First use | Built the site and rendered its exact copyable Bottom Sheet example with the packed package in Next.js 16.4.6 App Router. |
| Accessibility checks | Checked the built demo at 320 CSS px with doubled root text size, reduced motion, and focus restoration in all three engines. axe-core 4.14.1 reported zero violations for the tested tags on the Chromium landing page and open sheet. |
| Physical devices and assistive technology | Android Chrome, iOS Safari and PWA, VoiceOver, and TalkBack have no result in this preview. The browser suite uses desktop browsers and emulation. |

## Performance baseline

For a Vite 8.3.8 minified ESM build of the complete package entry with React peer imports externalized, gzip size was 4,149 bytes for JavaScript and 931 bytes for the shipped CSS. App code and React are outside this measurement.

A 390 × 844 headless Chromium viewport on the local machine recorded a p95 animation-frame interval of 16.7 ms at idle (47 intervals) and 16.8 ms during a pointer-driven swipe (95 intervals). This is an initial desktop measurement of the demo. The paired filtering and inbox comparison, device results, and release performance budget remain open.
