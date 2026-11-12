import {
  siCplusplus, siPython, siC, siDotnet, siTypescript, siJavascript, siReact, siHtml5, siCss, siNodedotjs, siExpress,
  siMysql, siMongodb, siSupabase, siLangchain, siMilvus, siOllama, siPytorch, siScikitlearn, siPandas, siNumpy,
  siOpencv, siGit, siGithub, siPostman,
} from 'simple-icons';

/** Logos from Simple Icons, drawn in currentColor so they sit in the theme. Brands it doesn't ship get a monogram. */
const ICONS: Record<string, { path: string }> = {
  'C++': siCplusplus, Python: siPython, C: siC, '.NET': siDotnet, TypeScript: siTypescript, JavaScript: siJavascript,
  React: siReact, HTML: siHtml5, CSS: siCss, 'Node.js': siNodedotjs, Express: siExpress, MySQL: siMysql, MongoDB: siMongodb,
  Supabase: siSupabase, LangChain: siLangchain, Milvus: siMilvus, Ollama: siOllama, PyTorch: siPytorch,
  'scikit-learn': siScikitlearn, Pandas: siPandas, NumPy: siNumpy, OpenCV: siOpencv, Git: siGit, GitHub: siGithub, Postman: siPostman,
};
const MONO: Record<string, string> = { 'C#': 'C#', OpenAI: 'AI', Azure: 'Az', 'Azure DevOps': 'DO', 'VS Code': 'VS', Matplotlib: 'Mpl', 'Azure OpenAI': 'AO', RAG: 'RAG' };

export default function TechIcon({ name, size = 24 }: { name: string; size?: number }) {
  const icon = ICONS[name];
  if (icon) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className="tech-icon">
        <path d={icon.path} fill="currentColor" />
      </svg>
    );
  }
  const m = MONO[name] ?? name.slice(0, 2);
  return <span className="tech-mono" style={{ width: size, height: size, fontSize: size * (m.length > 2 ? 0.34 : 0.42) }} aria-hidden="true">{m}</span>;
}
