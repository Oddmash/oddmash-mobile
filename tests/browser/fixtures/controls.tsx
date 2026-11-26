import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BottomSheet, SwipeAction } from '../../../src/index.js';
import '../../../src/styles.css';

const Controls = () => {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [allowClose, setAllowClose] = useState(false);
  const [closeRequests, setCloseRequests] = useState(0);
  return <>
    <button type="button" onClick={() => setOpen(true)}>Open compact sheet</button>
    <BottomSheet title="Compact sheet" open={open} onOpenChange={setOpen} snapPoints={[0.05]} dismissible={false}>
      <button type="button" onClick={() => setOpen(false)}>Finish</button>
    </BottomSheet>
    <button type="button" onClick={() => setDialogOpen(true)}>Open tall dialog</button>
    <BottomSheet title="Tall dialog" open={dialogOpen} presentation="dialog" onOpenChange={(next) => {
      setCloseRequests((count) => count + 1);
      if (allowClose) setDialogOpen(next);
    }}>
      <label><input type="checkbox" checked={allowClose} onChange={(event) => setAllowClose(event.currentTarget.checked)} /> Allow close</label>
      <output>Close requests: {closeRequests}</output>
      <div style={{ height: 900 }} />
      <form method="dialog"><button type="submit" value="finished">Complete tall dialog</button></form>
    </BottomSheet>
    <SwipeAction direction="right" actions={<button type="button">Archive item</button>}>
      <label><input type="checkbox" /> Right-swipe item</label>
    </SwipeAction>
  </>;
};

createRoot(document.getElementById('root')!).render(<Controls />);
