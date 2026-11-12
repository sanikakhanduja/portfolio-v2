import { useEffect, useState } from 'react';

/** One polite live region at the bottom of the screen. */
export default function Toast() {
  const [msg, setMsg] = useState('');
  const [on, setOn] = useState(false);
  useEffect(() => {
    let t = 0;
    const show = (e: Event) => {
      setMsg((e as CustomEvent<string>).detail);
      setOn(true);
      clearTimeout(t);
      t = window.setTimeout(() => setOn(false), 2200);
    };
    window.addEventListener('sk-toast', show);
    return () => { window.removeEventListener('sk-toast', show); clearTimeout(t); };
  }, []);
  return <div className={`toast${on ? ' is-on' : ''}`} role="status" aria-live="polite">{msg}</div>;
}
