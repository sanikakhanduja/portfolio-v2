import { useEffect, useState } from 'react';

/**
 * Light/dark theme. index.html sets data-theme before first paint (stored choice, else the system setting).
 * Switching spreads the new theme as a circle from the toggle (View Transitions), the site's ripple idea.
 */
export type Theme = 'light' | 'dark';
const KEY = 'sk-theme';
const root = () => document.documentElement;

export const getTheme = (): Theme => (root().dataset.theme === 'dark' ? 'dark' : 'light');

function stored(): Theme | null {
  try { const v = localStorage.getItem(KEY); return v === 'dark' || v === 'light' ? v : null; } catch { return null; }
}

function apply(t: Theme) {
  root().dataset.theme = t;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t === 'dark' ? '#0E0F11' : '#F1F2EE');
  // canvases listen for this and redraw synchronously, so the transition snapshot is already correct
  window.dispatchEvent(new Event('sk-theme'));
}

export function setTheme(t: Theme, from?: { x: number; y: number }) {
  try { localStorage.setItem(KEY, t); } catch { /* choice just won't persist */ }
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
  if (!doc.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) { apply(t); return; }
  const x = from?.x ?? innerWidth - 40, y = from?.y ?? 30;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  doc.startViewTransition(() => apply(t)).ready.then(() => {
    root().animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 700, easing: 'cubic-bezier(.2,.7,.2,1)', pseudoElement: '::view-transition-new(root)' },
    );
  });
}

/** Current theme; follows the system setting until the visitor picks one. */
export function useTheme(): Theme {
  const [t, setT] = useState<Theme>(getTheme);
  useEffect(() => {
    const sync = () => setT(getTheme());
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const onSystem = () => { if (!stored()) apply(mq.matches ? 'dark' : 'light'); };
    window.addEventListener('sk-theme', sync);
    mq.addEventListener('change', onSystem);
    return () => { window.removeEventListener('sk-theme', sync); mq.removeEventListener('change', onSystem); };
  }, []);
  return t;
}

/** Read a CSS custom property (colour tokens for canvas drawing). */
export const cssVar = (name: string) => getComputedStyle(root()).getPropertyValue(name).trim();
