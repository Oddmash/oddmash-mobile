'use client';
import { useEffect, useId, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';

let locks = 0;
let previousOverflow = '';
const lockScroll = () => {
  if (locks++ === 0) { previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; }
  return () => { if (--locks === 0) document.body.style.overflow = previousOverflow; };
};

export type OverlayProps = { open: boolean; onDismiss: () => void; dismissible?: boolean; title: string; children: ReactNode; className?: string; style?: CSSProperties };

export const Overlay = ({open, onDismiss, dismissible = true, title, children, className, style}: OverlayProps) => {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.showModal();
    const unlock = lockScroll();
    return () => {
      if (dialog.open) dialog.close();
      unlock();
      if (trigger?.isConnected) trigger.focus({preventScroll: true});
    };
  }, [open]);
  return <dialog ref={ref} className={`om-overlay ${className ?? ''}`} style={style} aria-labelledby={titleId}
    onCancel={(event) => { event.preventDefault(); if (dismissible) onDismiss(); }}
    onClick={(event) => { if (dismissible && event.target === event.currentTarget) onDismiss(); }}>
    {open && <div className="om-overlay-inner"><header className="om-overlay-header"><h2 id={titleId}>{title}</h2>{dismissible && <button type="button" onClick={onDismiss} aria-label="Close dialog">×</button>}</header>{children}</div>}
  </dialog>;
};
