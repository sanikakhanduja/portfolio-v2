import { siCisco } from 'simple-icons';

/**
 * Official company marks in their brand colours: Microsoft's four squares, and Cisco's bridge of bars
 * (cropped from the official logo; the name is always written next to it, so the wordmark is left out).
 */
export default function OrgMark({ org, size = 22 }: { org: string; size?: number }) {
  if (org === 'Microsoft') {
    return (
      <svg viewBox="0 0 21 21" width={size} height={size} aria-hidden="true" className="org-mark">
        <rect x="0" y="0" width="10" height="10" fill="#F25022" />
        <rect x="11" y="0" width="10" height="10" fill="#7FBA00" />
        <rect x="0" y="11" width="10" height="10" fill="#00A4EF" />
        <rect x="11" y="11" width="10" height="10" fill="#FFB900" />
      </svg>
    );
  }
  if (org === 'Cisco') {
    return (
      <svg viewBox="0 5.5 24 5.6" width={Math.round(size * 2.1)} height={Math.round(size * 0.5)} aria-hidden="true" className="org-mark" overflow="hidden">
        <path d={siCisco.path} fill="#049FD9" />
      </svg>
    );
  }
  return null;
}
