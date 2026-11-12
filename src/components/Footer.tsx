import { person, profiles, resume } from '../content';
import { copyText } from '../lib/useCopy';

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot-inner">
        <div>
          <p className="foot-big">Let’s talk.</p>
          <button type="button" className="foot-mail" onClick={() => copyText(person.email, `Email copied · ${person.email}`)}>{person.email}</button>
        </div>
        <nav aria-label="Footer links">
          <a href={resume.href} target="_blank" rel="noopener">Résumé</a>
          {profiles.map((p) => <a key={p.label} href={p.href} target="_blank" rel="noopener">{p.label}</a>)}
        </nav>
      </div>
    </footer>
  );
}
