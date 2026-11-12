import Bar from './components/Bar';
import Hero from './components/Hero';
import Achievements from './components/Achievements';
import Work from './components/Work';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Stats from './components/Stats';
import Ask from './components/Ask';
import { BlogPage, BlogTeaser } from './components/Blog';
import Footer from './components/Footer';
import Toast from './components/Toast';

/** Two routes: the one-page portfolio, and /blog. (vercel.json rewrites every path to index.html.) */
export default function App() {
  const onBlog = location.pathname.replace(/\/$/, '') === '/blog';
  return (
    <>
      <Bar onBlog={onBlog} />
      <main id="main">
        {onBlog ? <BlogPage /> : (
          <>
            <Hero />
            <Achievements />
            <Projects />
            <Skills />
            <Stats />
            <Work />
            <Ask />
            <BlogTeaser />
          </>
        )}
      </main>
      <Footer />
      <Toast />
    </>
  );
}
