import fallback from './data/stats-fallback.json';

/** All copy. Every fact is from the F1 portfolio's verified content (f1_portfolio/src/content). Never invent. */
export const person = {
  name: 'Sanika Khanduja',
  tagline: 'I build AI-powered tools and reliable systems.',
  lookingFor: 'Open to full-time software engineering roles from June 2027',
  email: 'sanakhanduja@gmail.com',
};

export const resume = { href: '/resume.pdf', file: 'Sanika-Khanduja-resume.pdf' };

export const profiles = [
  { label: 'GitHub', href: 'https://github.com/sanikakhanduja' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sanika-khanduja-8432a5280/' },
  { label: 'LeetCode', href: 'https://leetcode.com/u/skz0812/', secondary: true },
  { label: 'Codeforces', href: 'https://codeforces.com/profile/sanakhanduja', secondary: true },
];

/** Hero proof cards. `live` cards take their value from /api/stats when it answers. */
export const proof: { src: string; value: number; suffix?: string; decimals?: number; label: string; live?: 'leetcode' }[] = [
  { src: 'Microsoft', value: 59, suffix: '+', label: 'machines’ incidents it would have caught' },
  { src: 'Cisco', value: 77, suffix: '%', label: 'component-prediction accuracy' },
  { src: 'IGDTUW', value: 9.72, decimals: 2, label: 'CGPA, ranked 4th of 231' },
  { src: 'LeetCode', value: 1711, label: 'contest rating', live: 'leetcode' },
];

/** Last values fetched (12 Nov 2026), incl. rating history; shown if the live request fails. Refresh: curl localhost:5180/api/stats > src/data/stats-fallback.json */
export const statsFallback = fallback;

export type WorkKey = 'ms' | 'cs';

/** Hero internship chips; each links to its diagram in "Inside the work". */
export const internships: { key: WorkKey; org: string; year: string; what: string }[] = [
  { key: 'ms', org: 'Microsoft', year: '’26', what: 'Impact detection for Azure' },
  { key: 'cs', org: 'Cisco', year: '’25', what: 'AI bug-triage co-pilot' },
];
export const work: Record<WorkKey, {
  org: string; year: string; name: string; lead: string; stack: string[];
  steps: [string, string][]; metrics: [string, string][];
}> = {
  ms: {
    org: 'Microsoft', year: '2026', name: 'Disk Layout Impact Detection',
    lead: 'Shows the blast radius of any change to an 80K+ line production config, on every pull request.',
    stack: ['C#', '.NET 8', 'Azure DevOps'],
    steps: [['Config PR', 'opened'], ['Parse', '80K+ lines'], ['Resolve', 'layouts → SKUs'], ['Blast radius', 'affected machines'], ['PR comment', 'in 10–15 s']],
    metrics: [['59+', 'machines’ incidents it would have caught'], ['10–15 s', 'per pull request'], ['80K+', 'lines of config resolved']],
  },
  cs: {
    org: 'Cisco', year: '2025', name: 'CDETS Co-Pilot',
    lead: 'An AI bug-triage platform that retrieves similar past defects to route new ones.',
    stack: ['LangChain', 'Milvus', 'Azure OpenAI'],
    steps: [['Defects', '30,000+'], ['Embed', 'vectors'], ['Milvus', 'similarity search'], ['LangChain', 'RAG'], ['Co-Pilot', '135+ components']],
    metrics: [['77%', 'component-prediction accuracy'], ['30,000+', 'historical defects'], ['1,000+', 'developers evaluating it']],
  },
};

/**
 * Recruiter bot: suggested questions with answers (third person, from the F1 site). `keys` match typed questions;
 * `hidden` entries answer typed questions only and are not shown as chips.
 */
export const qa: { q: string; a: string; keys: string[]; hidden?: boolean }[] = [
  {
    q: 'What did she build at Microsoft?',
    a: 'An impact-detection engine for Azure Hardware Provisioning. It traces any change in an 80K+ line config to the layouts and SKUs it affects, and posts the result on pull requests within 10–15 seconds.',
    keys: ['microsoft', 'azure', 'intern 2026', 'impact', 'config'],
  },
  {
    q: 'What AI work has she done?',
    a: 'At Cisco she built CDETS Co-Pilot, a RAG-based bug-triage platform over 30,000+ past defects with 77% component-prediction accuracy. She also built the computer-vision engine behind AutiCareAI.',
    keys: ['ai', 'ml', 'rag', 'llm', 'cisco', 'langchain', 'machine learning', 'vision'],
  },
  {
    q: 'How strong are her fundamentals?',
    a: 'CGPA 9.72, ranked 4th of 231 in Computer Science, and 690+ problems solved across LeetCode and Codeforces.',
    keys: ['cgpa', 'gpa', 'grades', 'dsa', 'leetcode', 'codeforces', 'fundamental', 'problem'],
  },
  {
    q: 'Does she lead teams?',
    a: 'She’s President of IGDTUW’s Entrepreneurship Cell, leading 200+ members, and mentors 70+ students in competitive programming with GDG IGDTUW.',
    keys: ['lead', 'team', 'president', 'mentor', 'club'],
  },
  {
    q: 'Is she open to roles?',
    a: 'Yes. She’s looking for a full-time software engineering role, starting after she graduates in June 2027.',
    keys: ['open', 'available', 'hire', 'role', 'job', 'graduat', 'full-time', 'start'],
  },
  {
    q: 'Has she done backend work?', hidden: true,
    a: 'Yes. At Microsoft she built the impact-detection engine in C# and .NET 8 on Azure DevOps. She also works with REST APIs, Node.js, Express, MySQL and MongoDB.',
    keys: ['backend', 'back-end', 'api', 'server', 'database', 'node', 'c#', '.net'],
  },
  {
    q: 'What is her tech stack?', hidden: true,
    a: 'Languages: C++, Python and C. Web: React and TypeScript. Backend: Node.js, Express, REST APIs, MySQL and MongoDB. AI/ML: LangChain, RAG, Milvus, PyTorch and scikit-learn. Tools: Git, Azure and Postman.',
    keys: ['stack', 'tech', 'language', 'tools', 'skills', 'framework', 'react', 'python'],
  },
];

/* ---------------- achievements (main focus, right under the hero) ---------------- */
/** Headline results: the number is the point. `count` animates; `pre`/`suf` frame it. */
export const highlights: { pre?: string; count: number; suf?: string; title: string; event: string; detail: string }[] = [
  { pre: 'Top ', count: 0.5, suf: '%', title: 'Semi-finalist', event: 'Flipkart Grid 7.0', detail: 'Top 800 of 160,000+ participants' },
  { pre: 'Rank ', count: 1, title: 'First year, B.Tech', event: 'IGDTUW', detail: 'Out of 1,000+ students' },
  { pre: 'Top ', count: 3, title: '2nd runner-up', event: 'IEEE Wiegnite 3.0', detail: 'Flagship hackathon' },
];
export const results = [
  { event: 'Smart India Hackathon', result: 'Semi-finalist', detail: 'Top 50 of 1,500+ teams' },
  { event: 'Flipkart Runway Challenge', result: 'Round 2', detail: 'Top 420 of 45,000+' },
  { event: 'ICDPN Conference', result: 'Co-authored paper', detail: 'Flood damage forecasting' },
];
export const leadership = [
  { role: 'President, Entrepreneurship Cell, IGDTUW', detail: 'Leading a 200+ member team and the institute’s first flagship E-Summit, with 1,000+ participants.' },
  { role: 'Competitive programming mentor, GDG IGDTUW', detail: 'Mentored 70+ students through structured sessions, live coding and contest prep.' },
];

/* ---------------- projects (overview cards, newest first) ---------------- */
export type ProjectLink = { label: string; href: string };
export const projects: {
  id: string; name: string; org: string; year: string; internal: boolean; work?: WorkKey;
  result: { value: string; label: string }; description: string; stack: string[];
  stages: [string, string][]; links: ProjectLink[];
}[] = [
  {
    id: 'dli', name: 'Disk Layout Impact Detection', org: 'Microsoft', year: '2026', internal: true, work: 'ms',
    result: { value: '59+', label: 'machines’ incidents it would have caught' },
    description: 'Shows the exact blast radius of any change to an 80K+ line production config, and posts it on every relevant pull request.',
    stack: ['C#', '.NET', 'Azure DevOps'],
    stages: [['Config PR', 'opened'], ['Parse', '80K+ lines'], ['Resolve', '3 levels'], ['Blast radius', 'machines'], ['PR comment', '10–15 s']],
    links: [],
  },
  {
    id: 'aca', name: 'AutiCareAI', org: 'Personal project', year: '2026', internal: false,
    result: { value: '3', label: 'behavioural markers tracked from video' },
    description: 'Analyses video for eye contact, facial expressions and social engagement to support early autism screening and progress tracking.',
    stack: ['TypeScript', 'Node.js', 'Express', 'Python', 'OpenCV', 'Supabase'],
    stages: [['Video', 'upload'], ['OpenCV', 'analysis'], ['Markers', '3 behaviours'], ['Store', 'Supabase'], ['Dashboards', '2 views']],
    links: [{ label: 'Live demo', href: 'https://auticareaifrontend.vercel.app/' }, { label: 'GitHub', href: 'https://github.com/joysa21/auticareai' }],
  },
  {
    id: 'cdc', name: 'CDETS Co-Pilot', org: 'Cisco', year: '2025', internal: true, work: 'cs',
    result: { value: '77%', label: 'component-prediction accuracy' },
    description: 'An AI bug-triage platform that retrieves similar past defects to route new ones. Its guidance module is in evaluation by 1,000+ developers.',
    stack: ['LangChain', 'RAG', 'Azure OpenAI', 'Milvus', 'Ollama'],
    stages: [['Defects', '30,000+'], ['Embed', 'vectors'], ['Milvus', 'search'], ['LangChain', 'RAG'], ['Co-Pilot', '135+ components']],
    links: [],
  },
  {
    id: 'fdp', name: 'Flood Damage Prediction', org: 'Research', year: '2024', internal: false,
    result: { value: 'R² 0.98', label: 'paper accepted at ICDPN' },
    description: 'Regression models trained on 20+ years of Indian flood data for long-term damage forecasting.',
    stack: ['Python', 'scikit-learn', 'Pandas', 'NumPy', 'Matplotlib'],
    stages: [['Flood data', '20+ years'], ['Clean', 'Pandas'], ['Models', 'regression'], ['Forecast', 'long-term'], ['Paper', 'ICDPN']],
    links: [{ label: 'Paper', href: 'https://link.springer.com/chapter/10.1007/978-3-032-27691-9_33' }, { label: 'GitHub', href: 'https://github.com/sanikakhanduja/Flood-Damage-Prediction' }],
  },
];

/* ---------------- skills (from the F1 setup sheet; plain names) ---------------- */
export const skills: { area: string; items: string[] }[] = [
  { area: 'Languages', items: ['C++', 'Python', 'C', 'C#', 'TypeScript', 'JavaScript'] },
  { area: 'Web', items: ['React', 'HTML', 'CSS'] },
  { area: 'Backend', items: ['Node.js', 'Express', '.NET', 'MySQL', 'MongoDB', 'Supabase'] },
  { area: 'AI / ML', items: ['OpenAI', 'LangChain', 'Milvus', 'Ollama', 'PyTorch', 'scikit-learn', 'Pandas', 'NumPy', 'OpenCV'] },
  { area: 'Tools', items: ['Git', 'GitHub', 'Azure', 'Azure DevOps', 'Postman', 'VS Code'] },
];
/** Core CS has no logos: shown as plain chips. */
export const coreCS = ['Data structures & algorithms', 'OOP', 'Operating systems', 'DBMS', 'REST APIs', 'RAG'];
