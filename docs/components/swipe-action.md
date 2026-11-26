# Swipe Action (P0)

Expose contextual actions beside list items, with progressively revealed action buttons. MVP excludes automatic destructive commit on full swipe.

Proposed API: Root, Content, Actions, Action, open/onOpenChange and direction. Provide an always discoverable menu/button alternative for keyboard and assistive technology. Allow vertical page scroll, account for RTL and cancel on ambiguous or multi-touch input.

Acceptance: only intentional horizontal drags reveal actions, vertical scroll remains functional, switching rows closes prior row if configured, Escape closes and returns focus, actions invoke exactly once, and canceled gestures never invoke actions.
