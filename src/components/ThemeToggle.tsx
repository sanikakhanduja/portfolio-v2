import type { MouseEvent } from 'react';
import { setTheme, useTheme } from '../lib/theme';

const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export default function ThemeToggle() {
  const theme = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';
  const click = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTheme(next, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };
  return (
    <button type="button" className="theme-toggle" onClick={click} aria-label={`Switch to ${next} mode`} title={`Switch to ${next} mode`}>
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className={theme}>
        {/* sun rays fade out as the moon's bite slides in */}
        <g className="rays">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line key={a} x1="12" y1="2.5" x2="12" y2="4.5" transform={`rotate(${a} 12 12)`} {...P} />
          ))}
        </g>
        <mask id="moon-bite">
          <rect width="24" height="24" fill="#fff" />
          <circle className="bite" cx="17.5" cy="7.5" r="6.5" fill="#000" />
        </mask>
        <circle className="core" cx="12" cy="12" r="5" mask="url(#moon-bite)" fill="currentColor" />
      </svg>
    </button>
  );
}
