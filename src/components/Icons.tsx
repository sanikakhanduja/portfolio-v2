const P = { stroke: 'currentColor', strokeWidth: 1.6, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export const ArrowOut = () => (
  <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" {...P} /></svg>
);
export const Download = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 2v9m0 0L4.5 7.5M8 11l3.5-3.5M3 14h10" {...P} /></svg>
);
export const Doc = () => (
  <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M4 1.5h5.5L13 5v9.5H4zM9.5 1.5V5H13M6.5 8.5h4M6.5 11h4" {...P} /></svg>
);
export const Copy = () => (
  <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M5.5 5.5h8v8h-8zM10.5 5.5v-3h-8v8h3" {...P} /></svg>
);
export const Mail = () => (
  <svg viewBox="0 0 16 16" width="17" height="17" aria-hidden="true"><path d="M2 3.5h12v9H2zM2.5 4l5.5 4.5L13.5 4" {...P} /></svg>
);
