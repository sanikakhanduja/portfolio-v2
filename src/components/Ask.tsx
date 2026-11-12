import { useState, type FormEvent } from 'react';
import { person, qa } from '../content';
import { useReveal } from '../lib/useReveal';

/** Recruiter bot. Suggested questions answer instantly; typed questions are matched to known answers. */
export default function Ask() {
  const card = useReveal<HTMLDivElement>();
  return (
    <section id="ask" className="sec" aria-labelledby="ask-h">
      <div className="wrap">
        <h2 id="ask-h">Ask about me</h2>
        <p className="sub">Answers come from my résumé.</p>
        <div className="card ask-card" ref={card}><Bot /></div>
      </div>
    </section>
  );
}

function Bot() {
  const [ans, setAns] = useState<{ q: string; a: string; n: number } | null>(null);
  const [input, setInput] = useState('');
  const say = (q: string, a: string) => setAns((p) => ({ q, a, n: (p?.n ?? 0) + 1 }));

  const ask = (e: FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    setInput('');
    const low = q.toLowerCase();
    const hit = qa.find((x) => x.keys.some((k) => low.includes(k)));
    say(q, hit ? hit.a : `I don’t have an answer to that one yet. Email Sanika at ${person.email} and she’ll reply.`);
  };

  return (
    <div className="bot">
      <div className="chips">
        {qa.filter((x) => !x.hidden).map((x) => <button key={x.q} type="button" onClick={() => say(x.q, x.a)}>{x.q}</button>)}
      </div>
      <div className="answer" aria-live="polite">
        {ans ? (
          <>
            <span className="q">{ans.q}</span>
            <p key={ans.n}>{ans.a.split(' ').map((w, i) => <span key={i} className="w" style={{ animationDelay: `${i * 35}ms` }}>{w} </span>)}</p>
          </>
        ) : <span className="q">Pick a question or type your own.</span>}
      </div>
      <form className="ask" onSubmit={ask}>
        <input id="ask-input" value={input} onChange={(e) => setInput(e.target.value)} aria-label="Ask a question about Sanika" placeholder="e.g. Has she worked with RAG?" />
        <button type="submit">Ask</button>
      </form>
    </div>
  );
}
