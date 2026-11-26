# Adaptive Dialog (P0)

Use a bottom sheet on narrow viewports and a conventional dialog on wider layouts. The caller owns content and open state; mode selection is configurable and deterministic on hydration.

Proposed props: open, onOpenChange, defaultOpen, breakpoint or explicit presentation override. Reuse overlay semantics and tokens. Preserve form drafts and focus when presentation changes; never mount two active modal focus traps. On unsupported or unmeasured viewport, fall back to an accessible dialog.

Acceptance: mode changes while open preserve content state, keyboard dismissal policy and accessible name; no SSR mismatch, focus loss or scroll leak. Verify resize, zoom, touch and desktop keyboard.
