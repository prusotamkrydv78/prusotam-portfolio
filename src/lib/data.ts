export const person = {
  monogram:  'PKY.',
  role:      'Full Stack Developer',
  tagline:   'Open to opportunities.',
  email:     'prusotamkumaryadav78@gmail.com',
  github:    'github.com/prusotamkrydv78',
  githubUrl: 'https://github.com/prusotamkrydv78',
  available: true,
  location:  'India',
  stats: {
    yearsCoding:    3,
    yearsFullstack: 2,
    repos:          72,
    contributions:  391,
  },
  stack: ['React', 'TypeScript', 'Node.js', 'ASP.NET Core', 'React Native'],
}

/* Single source of truth for projects — consumed by Work, About, Proof. */
export interface Project {
  index:       string
  title:       string
  year:        string
  cat:         string
  tags:        string[]
  description: string
  github:      string
  live:        string | null
}

export const projects: Project[] = [
  {
    index: '01',
    title: 'LinkMe',
    year:  '2026',
    cat:   'Full Stack',
    tags:  ['TypeScript', 'C#'],
    description: 'Link-in-bio platform. TypeScript frontend + ASP.NET Core WebAPI, with live preview while editing.',
    github: 'https://github.com/prusotamkrydv78/LinkMe',
    live:   null, // TODO: add LinkMe's live deployment URL (it's counted as a live project in Proof)
  },
  {
    index: '02',
    title: 'Native Ecommerce',
    year:  '2025',
    cat:   'Mobile',
    tags:  ['React Native', '.NET'],
    description: 'Full-stack mobile commerce — customer app, admin panel, and .NET API with JWT auth.',
    github: 'https://github.com/prusotamkrydv78/Native_Eccomerce',
    live:   null,
  },
  {
    index: '03',
    title: 'ChatX',
    year:  '2024',
    cat:   'Real-time',
    tags:  ['Socket.IO', 'Node.js'],
    description: 'Real-time messaging with WebSocket rooms and live user presence. Deployed on Vercel.',
    github: 'https://github.com/prusotamkrydv78/message_app',
    live:   'https://chatx-ten.vercel.app/',
  },
  {
    index: '04',
    title: 'X Clone',
    year:  '2024',
    cat:   'Social',
    tags:  ['React', 'MongoDB'],
    description: 'Twitter clone on the MERN stack — feed, profiles, likes, and retweets from scratch.',
    github: 'https://github.com/prusotamkrydv78/X',
    live:   null,
  },
  {
    index: '05',
    title: 'MongoX Vercel',
    year:  '2023',
    cat:   'Backend',
    tags:  ['Node.js', 'Serverless'],
    description: 'Serverless Node.js + MongoDB on Vercel — connection pooling and cold-start optimization.',
    github: 'https://github.com/prusotamkrydv78/mongoXvercel',
    live:   'https://mongoxvercel.vercel.app/',
  },
  {
    index: '06',
    title: 'Expense Tracker',
    year:  '2023',
    cat:   'Finance',
    tags:  ['React', 'Node.js'],
    description: 'Finance dashboard with charts, categories, and monthly spend reports.',
    github: 'https://github.com/prusotamkrydv78', // TODO: replace with the real Expense Tracker repo URL
    live:   null,
  },
  {
    index: '07',
    title: 'Real Estate App',
    year:  '2023',
    cat:   'Platform',
    tags:  ['Next.js', 'MongoDB'],
    description: 'Property listing platform with map integration and advanced filters.',
    github: 'https://github.com/prusotamkrydv78', // TODO: replace with the real Real Estate App repo URL
    live:   null,
  },
]

export const skills = [
  'REACT.JS', 'TYPESCRIPT', 'NODE.JS', 'ASP.NET CORE', 'REACT NATIVE',
  'MONGODB', 'SOCKET.IO', 'THREE.JS', 'GSAP', 'JWT', 'VERCEL', 'C#', 'REST API',
]

export const stats = [
  { label: 'Years Coding',   value: person.stats.yearsCoding,    suffix: '+' },
  { label: 'Full Stack',     value: person.stats.yearsFullstack, suffix: '+' },
  { label: 'GitHub Repos',   value: person.stats.repos,          suffix: '+' },
  { label: 'Contributions',  value: person.stats.contributions,  suffix: '+' },
]
