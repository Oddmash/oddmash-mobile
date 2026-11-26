'use client';
import { useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { getIntent } from './gesture.js';
import type { Axis } from './gesture.js';

type Session = { id: number; x: number; y: number; started: number; active: boolean; target: Element };
type Options = { axis: Axis; canStart?: (event: PointerEvent<HTMLElement>) => boolean; onCommit: (distance: number, velocity: number) => void };

// Nested drag surfaces share the event, so the closest eligible surface owns it.
const claimedPointerDowns = new WeakSet<Event>();

export const useDrag = ({ axis, canStart, onCommit }: Options) => {
  const session = useRef<Session | null>(null);
  const [distance, setDistance] = useState(0);
  const [dragging, setDragging] = useState(false);
  const reset = () => { session.current = null; setDistance(0); setDragging(false); };
  const cancel = ({ id, target }: Session) => {
    reset();
    if (target.hasPointerCapture(id)) target.releasePointerCapture(id);
  };
  const delta = (event: PointerEvent<HTMLElement>, current: Session) => axis === 'x' ? event.clientX - current.x : event.clientY - current.y;
  return {
    distance, dragging,
    handlers: {
      onPointerDown: (event: PointerEvent<HTMLElement>) => {
        if (!event.isPrimary || event.button !== 0 || session.current || canStart?.(event) === false) return;
        if (claimedPointerDowns.has(event.nativeEvent)) return;
        claimedPointerDowns.add(event.nativeEvent);
        const target = event.target instanceof Element ? event.target : event.currentTarget;
        target.setPointerCapture(event.pointerId);
        session.current = { id: event.pointerId, x: event.clientX, y: event.clientY, started: event.timeStamp, active: false, target };
      },
      onPointerMove: (event: PointerEvent<HTMLElement>) => {
        const current = session.current;
        if (!current || current.id !== event.pointerId) return;
        const primary = delta(event, current);
        const cross = axis === 'x' ? event.clientY - current.y : event.clientX - current.x;
        if (!current.active) {
          const intent = getIntent(primary, cross);
          if (intent === 'cross') {
            cancel(current);
            return;
          }
          if (intent === 'pending') return;
          current.active = true;
          setDragging(true);
        }
        setDistance(primary);
      },
      onPointerUp: (event: PointerEvent<HTMLElement>) => {
        const current = session.current;
        if (!current || current.id !== event.pointerId) return;
        const movement = delta(event, current);
        reset();
        if (current.active) onCommit(movement, movement / Math.max(1, event.timeStamp - current.started));
      },
      onPointerCancel: (event: PointerEvent<HTMLElement>) => {
        const current = session.current;
        if (current?.id === event.pointerId) cancel(current);
      },
      onLostPointerCapture: (event: PointerEvent<HTMLElement>) => {
        const current = session.current;
        if (current?.id === event.pointerId && !current.target.hasPointerCapture(current.id)) reset();
      }
    }
  };
};
