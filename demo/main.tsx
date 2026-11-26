import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AdaptiveDialog, BottomSheet, PullToRefresh, SwipeAction } from '../src/index.js';
import '../src/styles.css';
import './demo.css';

const App = () => {
  const [sheet, setSheet] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [archived, setArchived] = useState(false);
  const [revision, setRevision] = useState(0);
  return <main><header><small>ODDMASH / MOBILE</small><h1>Interactions for the mobile web.</h1><p>Four experimental React primitives. Try them on your own screen.</p><a href="https://github.com/Oddmash/oddmash-mobile">Source and feedback</a></header>
    <section><h2>Bottom Sheet</h2><p>Drag the handle or use the arrow keys to change its height.</p><button onClick={() => setSheet(true)}>Open filters</button><BottomSheet title="Filters" open={sheet} onOpenChange={setSheet}><label>Search <input placeholder="Search products"/></label><p>Choose filters without leaving the page.</p><button onClick={() => setSheet(false)}>Apply filters</button></BottomSheet><pre>{'import { BottomSheet } from "@oddmash/mobile/bottom-sheet";'}</pre></section>
    <section><h2>Adaptive Dialog</h2><p>Resize the viewport to switch between dialog and sheet.</p><button onClick={() => setDialog(true)}>Edit profile</button><AdaptiveDialog title="Edit profile" open={dialog} onOpenChange={setDialog}><label>Name <input defaultValue="Alex"/></label><button onClick={() => setDialog(false)}>Done</button></AdaptiveDialog><pre>{'import { AdaptiveDialog } from "@oddmash/mobile/adaptive-dialog";'}</pre></section>
    <section><h2>Swipe Action</h2><p>Swipe left or select Show actions.</p>{archived ? <button onClick={() => setArchived(false)}>Restore message</button> : <SwipeAction actions={<button onClick={() => setArchived(true)}>Archive</button>}><span>Project update</span></SwipeAction>}<pre>{'import { SwipeAction } from "@oddmash/mobile/swipe-action";'}</pre></section>
    <section><h2>Pull to Refresh</h2><p>Drag the refresh handle down or use its button.</p><PullToRefresh onRefresh={async () => {await new Promise<void>((resolve) => setTimeout(resolve, 300));setRevision((value) => value + 1);}}><p>Revision {revision}</p></PullToRefresh><pre>{'import { PullToRefresh } from "@oddmash/mobile/pull-to-refresh";'}</pre></section>
    <section><h2>Installation</h2><p>Alpha package source; registry availability is not yet verified.</p><pre>pnpm add @oddmash/mobile</pre><pre>{'import "@oddmash/mobile/styles.css";'}</pre><p>React 18 and 19 are the target. Physical device and assistive technology coverage is pending.</p></section>
  </main>;
};

createRoot(document.getElementById('root')!).render(<App />);
