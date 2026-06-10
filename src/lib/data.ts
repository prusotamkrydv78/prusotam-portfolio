export const person = {
  monogram:  'Portfolio.',
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

export type PanelType = 'network' | 'layers' | 'ripple' | 'grid' | 'hex'

export const projects = [
  {
    index: '01',
    title: 'LinkMe',
    year: '2026',
    tags: ['TypeScript', 'C#'],
    description: 'Link-in-bio platform. TypeScript frontend + ASP.NET Core C# WebAPI. Live preview while editing.',
    github: 'https://github.com/prusotamkrydv78/LinkMe',
    live: null as string | null, // TODO: add LinkMe's live deployment URL (it's counted as a live project in Proof)
    panel: 'network' as PanelType,
  },
  {
    index: '02',
    title: 'Native Ecommerce',
    year: '2025',
    tags: ['React Native', '.NET'],
    description: 'Full-stack mobile commerce. Customer app + admin panel + .NET API. JWT auth.',
    github: 'https://github.com/prusotamkrydv78/Native_Eccomerce',
    live: null as string | null,
    panel: 'layers' as PanelType,
  },
  {
    index: '03',
    title: 'ChatX',
    year: '2024',
    tags: ['Socket.IO', 'Node.js'],
    description: 'Real-time chat application. WebSocket-powered with Socket.IO. Live on Vercel.',
    github: 'https://github.com/prusotamkrydv78/message_app',
    live: 'https://chatx-ten.vercel.app/',
    panel: 'ripple' as PanelType,
  },
  {
    index: '04',
    title: 'X Clone',
    year: '2024',
    tags: ['React', 'MongoDB'],
    description: 'Twitter clone. MERN stack. Full social feed architecture from scratch.',
    github: 'https://github.com/prusotamkrydv78/X',
    live: null as string | null,
    panel: 'grid' as PanelType,
  },
  {
    index: '05',
    title: 'MongoX Vercel',
    year: '2023',
    tags: ['Node.js', 'Serverless'],
    description: 'Serverless Node.js + MongoDB on Vercel. Connection pooling, cold start optimization.',
    github: 'https://github.com/prusotamkrydv78/mongoXvercel',
    live: 'https://mongoxvercel.vercel.app/',
    panel: 'hex' as PanelType,
  },
]

export const skills = [
  'REACT.JS', 'TYPESCRIPT', 'NODE.JS', 'ASP.NET CORE', 'REACT NATIVE',
  'MONGODB', 'SOCKET.IO', 'THREE.JS', 'GSAP', 'JWT', 'VERCEL', 'C#', 'REST API',
]

export const stats = [
  { label: 'Years Coding',   value: 3,   suffix: '+' },
  { label: 'Full Stack',     value: 2,   suffix: '+' },
  { label: 'GitHub Repos',   value: 72,  suffix: '+' },
  { label: 'Contributions',  value: 391, suffix: '+' },
]
