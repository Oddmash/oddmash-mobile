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
  const drag = useDrag({ axis: 'y', onCommit: (distance, velocity) => {
    if (!height) return;
    const projected = current - (distance + velocity * 120) / height;
    if (dismissible && projected < points[0]! / 2) { setVisible(false); return; }
    setSelected(nearestSnapPoint(points, projected));
  }});
  const horizontal = presentation === 'dialog';
  const size = height ? `${clamp(current * height - drag.distance, 0, height)}px` : `${current * 100}dvh`;
  return <Overlay open={visible} onDismiss={() => setVisible(false)} dismissible={dismissible} title={title} returnFocusRef={returnFocusRef}
    className={horizontal ? 'om-centered' : 'om-sheet'} style={horizontal ? undefined : {height: size, maxHeight: height ? `${height}px` : '100dvh', bottom: viewport?.bottomInset, transition: drag.dragging ? 'none' : undefined}}>
    {!horizontal && <div key="handle" className="om-sheet-controls"><button type="button" className="om-handle" aria-label="Resize sheet" onKeyDown={(event) => {
      if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const index = points.indexOf(current);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? points.length - 1 : clamp(index + (event.key === 'ArrowUp' ? 1 : -1), 0, points.length - 1);
      setSelected(points[next]!);
    }} {...drag.handlers}><span /></button></div>}
    <div key="content" className="om-overlay-content">{children}</div>
  </Overlay>;
};
