'use client';
import { useEffect, useId, useRef } from 'react';
import type { CSSProperties, ReactNode, RefObject } from 'react';

let locks = 0;
let previousOverflow = '';
const lockScroll = () => {
  if (locks++ === 0) { previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; }
  return () => { if (--locks === 0) document.body.style.overflow = previousOverflow; };
};

const outsideDialog = (dialog: HTMLDialogElement, x: number, y: number) => {
  const { left, right, top, bottom } = dialog.getBoundingClientRect();
  return x < left || x > right || y < top || y > bottom;
};

export type OverlayProps = { open: boolean; onDismiss: () => void; dismissible?: boolean; title: string; children: ReactNode; className?: string; style?: CSSProperties; returnFocusRef?: RefObject<HTMLElement | null> };

export const Overlay = ({open, onDismiss, dismissible = true, title, children, className, style, returnFocusRef}: OverlayProps) => {
  const ref = useRef<HTMLDialogElement>(null);
  const backdropPress = useRef<number | null>(null);
  const titleId = useId();
  const focusTarget = useRef(returnFocusRef);
  useEffect(() => { focusTarget.current = returnFocusRef; }, [returnFocusRef]);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.showModal();
    const unlock = lockScroll();
    return () => {
      if (dialog.open) dialog.close();
      unlock();
      const explicitTrigger = focusTarget.current?.current;
      const target = explicitTrigger?.isConnected ? explicitTrigger : trigger;
      if (target?.isConnected) target.focus({preventScroll: true});
    };
  }, [open]);
  return <dialog ref={ref} className={`om-overlay ${className ?? ''}`} style={style} aria-labelledby={titleId}
    onCancel={(event) => {
      if (event.target !== event.currentTarget) return;
      event.preventDefault();
      if (dismissible) onDismiss();
    }}
    onSubmit={(event) => {
      const form = event.target;
      if (event.defaultPrevented || !(form instanceof HTMLFormElement) || form.closest('dialog') !== event.currentTarget) return;
      const submitter = event.nativeEvent.submitter;
      const button = submitter instanceof HTMLButtonElement || submitter instanceof HTMLInputElement ? submitter : null;
      const method = button?.hasAttribute('formmethod') ? button.formMethod : form.method;
      if (method !== 'dialog') return;
      event.preventDefault();
      if (button) event.currentTarget.returnValue = button.value;
      onDismiss();
    }}
    onClose={(event) => {
      const dialog = event.currentTarget;
      if (event.target !== dialog || !open || dialog.open || !dialog.isConnected) return;
      // The controlled state remains authoritative if the browser closes the node directly.
      dialog.showModal();
      onDismiss();
    }}
    onPointerDown={(event) => {
      const { currentTarget, target, button, pointerId, clientX, clientY, isPrimary } = event;
      backdropPress.current = isPrimary && button === 0 && target === currentTarget
        && outsideDialog(currentTarget, clientX, clientY) ? pointerId : null;
    }}
    onPointerCancel={(event) => {
      if (backdropPress.current === event.pointerId) backdropPress.current = null;
    }}
    onPointerUp={(event) => {
      if (backdropPress.current !== event.pointerId || event.target !== event.currentTarget
        || !outsideDialog(event.currentTarget, event.clientX, event.clientY)) {
        backdropPress.current = null;
      }
    }}
    onClick={(event) => {
      const startedOnBackdrop = backdropPress.current !== null;
      backdropPress.current = null;
      if (dismissible && startedOnBackdrop && event.target === event.currentTarget
        && outsideDialog(event.currentTarget, event.clientX, event.clientY)) onDismiss();
    }}>
    {open && <div className="om-overlay-inner"><header className="om-overlay-header"><h2 id={titleId}>{title}</h2>{dismissible && <button type="button" onClick={onDismiss} aria-label="Close dialog">×</button>}</header>{children}</div>}
  </dialog>;
};
