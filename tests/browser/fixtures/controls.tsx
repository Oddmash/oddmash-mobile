import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BottomSheet, SwipeAction } from '../../../src/index.js';
import '../../../src/styles.css';

const Controls = () => {
  const [open, setOpen] = useState(false);
  return <>
    <button type="button" onClick={() => setOpen(true)}>Open compact sheet</button>
    <BottomSheet title="Compact sheet" open={open} onOpenChange={setOpen} snapPoints={[0.05]} dismissible={false}>
      <button type="button" onClick={() => setOpen(false)}>Finish</button>
    </BottomSheet>
    <SwipeAction direction="right" actions={<button type="button">Archive item</button>}>
      <span>Right-swipe item</span>
    </SwipeAction>
  </>;
};

createRoot(document.getElementById('root')!).render(<Controls />);
