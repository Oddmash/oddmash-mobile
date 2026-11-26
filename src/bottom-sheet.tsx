'use client';
import type { ReactNode, RefObject } from 'react';
import { Overlay } from './overlay.js';
import { useControlled } from './use-controlled.js';
import { useDrag } from './use-drag.js';
import { useViewport } from './use-viewport.js';
import { clamp, nearestSnapPoint, normalizeSnapPoints } from './gesture.js';

export type BottomSheetProps = { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; title: string; children: ReactNode; snapPoints?: readonly number[]; snapPoint?: number; defaultSnapPoint?: number; onSnapPointChange?: (point: number) => void; dismissible?: boolean; presentation?: 'sheet' | 'dialog'; returnFocusRef?: RefObject<HTMLElement | null> };

export const BottomSheet = ({open, defaultOpen = false, onOpenChange, title, children, snapPoints = [0.5, 0.9], snapPoint, defaultSnapPoint, onSnapPointChange, dismissible = true, presentation = 'sheet', returnFocusRef}: BottomSheetProps) => {
  const points = normalizeSnapPoints(snapPoints);
  const [visible, setVisible] = useControlled(open, defaultOpen, onOpenChange);
  const [selected, setSelected] = useControlled(snapPoint, defaultSnapPoint ?? points[0]!, onSnapPointChange);
  const current = nearestSnapPoint(points, selected);
  const viewport = useViewport();
  const height = viewport?.height ?? 0;
  const centered = presentation === 'dialog';
  const showHandle = !centered && (points.length > 1 || dismissible);
  const drag = useDrag({ axis: 'y', enabled: visible && showHandle, onCommit: (distance, velocity) => {
    if (!height) return;
    const projected = current - (distance + velocity * 120) / height;
    if (dismissible && projected < points[0]! / 2) { setVisible(false); return; }
    setSelected(nearestSnapPoint(points, projected));
  }});
  const size = height ? `${clamp(current * height - drag.distance, 0, height)}px` : `${current * 100}dvh`;
  const viewportHeight = height ? `${height}px` : '100dvh';
  const index = points.indexOf(current);
  return <Overlay open={visible} onDismiss={() => setVisible(false)} dismissible={dismissible} title={title} returnFocusRef={returnFocusRef}
    className={centered ? 'om-centered' : 'om-sheet'} style={centered ? undefined : {height: size, minHeight: `min(12rem, ${viewportHeight})`, maxHeight: viewportHeight, bottom: viewport?.bottomInset, transition: drag.dragging ? 'none' : undefined}}>
    {showHandle && <div key="handle" className="om-sheet-controls"><button type="button" className="om-handle" aria-label="Resize sheet"
      onClick={(event) => {
        if (event.detail === 0 || !drag.didDrag()) setSelected(points[(index + 1) % points.length]!);
      }}
      onKeyDown={(event) => {
      if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? points.length - 1 : clamp(index + (event.key === 'ArrowUp' ? 1 : -1), 0, points.length - 1);
      setSelected(points[next]!);
    }} {...drag.handlers}><span /></button></div>}
    <div key="content" className="om-overlay-content">{children}</div>
  </Overlay>;
};
