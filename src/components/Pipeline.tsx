import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

export type PipelineHandle = { replay: () => void };

/**
 * A project's architecture as five steps. Plays once when scrolled into view (each step lights in turn,
 * the connector fills toward the next), then rests fully lit. replay() runs it again (cards call it on hover).
 * Horizontal in wide cards, vertical in narrow ones (container query), so labels never shrink.
 */
const Pipeline = forwardRef<PipelineHandle, { stages: [string, string][]; label: string }>(function Pipeline({ stages, label }, ref) {
  const el = useRef<HTMLOListElement>(null);
  const [step, setStep] = useState(stages.length); // complete at rest
  const timer = useRef(0);

  const play = () => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    clearInterval(timer.current);
    let i = 0;
    setStep(0);
    timer.current = window.setInterval(() => {
      i++;
      setStep(i);
      if (i >= stages.length) clearInterval(timer.current);
    }, 520);
  };
  useImperativeHandle(ref, () => ({ replay: play }));

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); play(); } }, { threshold: 0.6 });
    io.observe(el.current!);
    return () => { io.disconnect(); clearInterval(timer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ol ref={el} className="pipe" aria-label={`${label} architecture`}>
      {stages.map(([a, b], i) => (
        <li key={a} className={i < step ? 'on' : i === step ? 'next' : undefined}>
          <span className="pipe-n" aria-hidden="true">{i + 1}</span>
          <span className="pipe-t">{a}</span>
          <span className="pipe-d">{b}</span>
        </li>
      ))}
    </ol>
  );
});
export default Pipeline;
