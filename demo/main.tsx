import { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AdaptiveDialog, BottomSheet, PullToRefresh, SwipeAction } from '../src/index.js';
import '../src/styles.css';
import './demo.css';

const filterExample = `import { useRef, useState } from 'react';
import { BottomSheet } from '@oddmash/mobile-interactions/bottom-sheet';
import '@oddmash/mobile-interactions/styles.css';

export function FilterExample() {
  const trigger = useRef(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <button ref={trigger} onClick={() => setOpen(true)}>
        Open filters
      </button>
      <BottomSheet
        title="Filters"
        open={open}
        onOpenChange={setOpen}
        returnFocusRef={trigger}
        snapPoints={[0.5, 0.9]}
      >
        <label>Search <input /></label>
        <button onClick={() => setOpen(false)}>Apply</button>
      </BottomSheet>
    </>
  );
}`;

const App = () => {
  const sheetTrigger = useRef<HTMLButtonElement>(null);
  const dialogTrigger = useRef<HTMLButtonElement>(null);
  const [sheet, setSheet] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [archived, setArchived] = useState(false);
  const [revision, setRevision] = useState(0);
  return <main><header><small>ODDMASH / MOBILE</small><h1>Interactions for the mobile web.</h1><p>Four experimental React primitives. Try them on your own screen.</p><a href="https://github.com/Oddmash/oddmash-mobile">Source and feedback</a></header>
    <section><h2>Bottom Sheet</h2><p>Tap the handle to cycle through sheet heights. You can also drag it or use the arrow keys.</p><button ref={sheetTrigger} onClick={() => setSheet(true)}>Open filters</button><BottomSheet title="Filters" open={sheet} onOpenChange={setSheet} returnFocusRef={sheetTrigger}><label>Search <input placeholder="Search products"/></label><p>Choose filters without leaving the page.</p><button onClick={() => setSheet(false)}>Apply filters</button></BottomSheet><pre>{'import { BottomSheet } from "@oddmash/mobile-interactions/bottom-sheet";'}</pre></section>
    <section><h2>Adaptive Dialog</h2><p>Resize the viewport to switch between dialog and sheet.</p><button ref={dialogTrigger} onClick={() => setDialog(true)}>Edit profile</button><AdaptiveDialog title="Edit profile" open={dialog} onOpenChange={setDialog} returnFocusRef={dialogTrigger}><label>Name <input defaultValue="Alex"/></label><button onClick={() => setDialog(false)}>Done</button></AdaptiveDialog><pre>{'import { AdaptiveDialog } from "@oddmash/mobile-interactions/adaptive-dialog";'}</pre></section>
    <section><h2>Swipe Action</h2><p>Swipe left or select Show actions.</p>{archived ? <button onClick={() => setArchived(false)}>Restore message</button> : <SwipeAction actions={<button onClick={() => setArchived(true)}>Archive</button>}><span>Project update</span></SwipeAction>}<pre>{'import { SwipeAction } from "@oddmash/mobile-interactions/swipe-action";'}</pre></section>
    <section><h2>Pull to Refresh</h2><p>Drag the refresh handle down or use its button.</p><PullToRefresh onRefresh={async () => {await new Promise<void>((resolve) => setTimeout(resolve, 300));setRevision((value) => value + 1);}}><p>Revision {revision}</p></PullToRefresh><pre>{'import { PullToRefresh } from "@oddmash/mobile-interactions/pull-to-refresh";'}</pre></section>
    <section><h2>Installation</h2><p>Build a tarball from the alpha source and install it in your React project.</p><pre>{'pnpm install --frozen-lockfile\npnpm build\npnpm pack'}</pre><pre>pnpm add /path/to/oddmash-mobile-interactions-0.1.0-alpha.0.tgz</pre><pre>{'import "@oddmash/mobile-interactions/styles.css";'}</pre><p>The alpha tarball was checked with React 18 and 19. Browser checks cover Chromium, Firefox, and WebKit. Physical iOS and Android devices and assistive technology are still under evaluation.</p><a href="https://github.com/Oddmash/oddmash-mobile/blob/main/docs/alpha-verification.md">Read the verification results</a></section>
    <section>
      <h2>Render a Bottom Sheet</h2>
      <p>Save this example as <code>FilterExample.jsx</code>, then import and render <code>&lt;FilterExample /&gt;</code> in your React app.</p>
      <pre><code>{filterExample}</code></pre>
      <p>Each snap point is a fraction of the viewport. Keep <code>onOpenChange</code> connected to state so Escape and the close button update the sheet. Pass the trigger ref to restore focus when the sheet closes.</p>
      <p>If the dialog opens without sheet styling, check that <code>@oddmash/mobile-interactions/styles.css</code> is imported. In Next.js App Router, add <code>'use client'</code> at the start of this example because it uses state and event handlers.</p>
    </section>
  </main>;
};

createRoot(document.getElementById('root')!).render(<App />);
