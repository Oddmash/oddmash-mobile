# Browser verification

Use Node 24 and the pnpm version declared in the Mobile alpha checkout.

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium firefox webkit
pnpm test:browser
```

Chromium, Firefox, and WebKit run the shared keyboard and pointer scenarios for Bottom Sheet, Adaptive Dialog, Swipe Action, and Pull to Refresh. The touch-specific swipe and pull scenario uses Chromium's emulated touch input, so that scenario is skipped in Firefox and WebKit. Record physical iOS and Android results separately.
