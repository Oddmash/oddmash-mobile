# Alpha candidate usage

The proposed 0.1.0-alpha.0 package exposes four components. API may change during alpha. Install from a locally packed tarball until a registry release is verified.

```tsx
import { BottomSheet } from '@oddmash/mobile/bottom-sheet';
import '@oddmash/mobile/styles.css';

export const Filters = () => <BottomSheet defaultOpen title="Filters" snapPoints={[0.5, 0.9]}>Choose a filter</BottomSheet>;
```

Use controlled `open` and `onOpenChange` for an external trigger. Pass its button ref through `returnFocusRef` to restore focus when clicking the trigger does not focus it, as can happen in Safari. Snap points are fractions of the visual viewport; tap the resize handle to cycle through snap points. The handle also supports arrows, Home, End and dragging. Small snap points have a minimum rendered height so the controls and scrollable content stay reachable. Use `dismissible={false}` only with an explicit completion or cancel action inside the content.

| Export | Main inputs |
| --- | --- |
| BottomSheet | open, defaultOpen, onOpenChange, title, snapPoints, snapPoint, onSnapPointChange, dismissible, returnFocusRef |
| AdaptiveDialog | BottomSheet inputs plus breakpoint and presentation |
| SwipeAction | children, actions, open, onOpenChange, direction, actionWidth, label |
| PullToRefresh | children, onRefresh, disabled, threshold, label |

Use the buttons as non-drag alternatives. Swipe Action never automatically commits a destructive action. Pull to Refresh currently uses an explicit pull handle rather than intercepting native page scrolling. Bottom Sheet dragging is handle-only. Nonmodal sheets, compound API, nested scroll handoff, route integrations and device-specific refinements are deferred.

Style with `--om-surface`, `--om-text` and `--om-focus`. No global stylesheet reset is required.

## Verification scope

The alpha candidate includes type checks, gesture tests, and Playwright scenarios for Chromium, Firefox and WebKit. The packed package was installed in clean React 18.3.1 and 19.3.1 projects and checked for subpath imports, server rendering and CSS resolution. The Chromium touch scenario uses emulated input. Next.js hydration, physical iOS and Android devices, assistive technology and comparative performance still require verification.

Run `pnpm install --frozen-lockfile`, `pnpm verify`, `pnpm test:browser`, `pnpm pack`, and `pnpm dev` for the demo. Use Node 24 and the declared pnpm version.
