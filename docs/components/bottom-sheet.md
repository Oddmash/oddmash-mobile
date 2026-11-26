# Bottom Sheet (P0)

## Scenario
Open filters on a mobile web app, adjust a field while the software keyboard is visible, scroll results and dismiss without losing page position.

## Proposed API
Compound components: Root, Trigger, Portal, Backdrop, Content, Handle, Title, Description, Close. Root accepts controlled open/onOpenChange or defaultOpen; snapPoints and controlled snapPoint/onSnapPointChange; dismissible; modal. Snap points use explicit units or content sizing, validated and sorted. Exact type syntax and default remain an ADR.

## Interaction
- Open at requested/default snap point; drag handle to adjacent or projected valid point.
- Keep scrollable content scrolling until boundary and eligible gesture direction. MVP may restrict dragging to handle if nested handoff is unreliable.
- Cancel short or interrupted drags; respect dismissible=false.
- On keyboard open, keep focused field visible; clamp heights to usable viewport.
- Dismiss via explicit close and Escape where permitted; return focus; preserve scroll.

## Acceptance
- Controlled consumer can reject a close without visual state drift.
- No background scroll leak; nested overlays restore lock correctly.
- 320px viewport, long content, orientation and safe area work.
- Pointer cancellation, rapid reopen, snap resizing and reduced motion are tested.
- VoiceOver/TalkBack and physical iOS/Android keyboards tested before stable release.
