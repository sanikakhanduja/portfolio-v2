import type { PointerEvent } from 'react';

/** The site's signature in miniature: a ring spreads from where the cursor enters a card. */
export function rippleFrom(e: PointerEvent<HTMLElement>) {
  if (e.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const el = e.currentTarget, now = performance.now();
  // at most one ring per card every 4 s, so sweeping across cards stays calm
  if (now - Number(el.dataset.rippled ?? -1e9) < 4000) return;
  el.dataset.rippled = String(now);
  const r = el.getBoundingClientRect();
  const ring = document.createElement('span');
  ring.className = 'card-ripple';
  ring.style.left = `${e.clientX - r.left}px`;
  ring.style.top = `${e.clientY - r.top}px`;
  el.appendChild(ring);
  ring.addEventListener('animationend', () => ring.remove());
}
