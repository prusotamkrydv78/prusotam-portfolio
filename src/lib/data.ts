export const person = {
  name: "Prusotam Kumar Yadav",
  initials: "PK",
  role: "Full Stack Developer",
  tagline: "Building systems that feel alive.",
  bio: "Full Stack Developer building web apps, mobile applications, and real-time systems. Working with React, TypeScript, Node.js, and ASP.NET Core since 2023.",
  email: "prusotamkumaryadav78@gmail.com",
  github: "https://github.com/prusotamkrydv78",
  location: "India",
  available: true,
  stats: {
    yearsCode: 3,
    yearsFullstack: 2,
    projects: 6,
    repos: 72,
  },
}

export const projects = [
  {
    id: "01",
    title: "LinkMe",
    tagline: "Your links, your identity.",
    description:
      "A Linktree-alternative built full-stack. Users create a personalized link-in-bio page with live preview while editing. TypeScript frontend with ASP.NET Core C# WebAPI backend — showcasing cross-stack proficiency.",
    tags: ["TypeScript", "React", "ASP.NET Core", "C#", "REST API"],
    github: "https://github.com/prusotamkrydv78/LinkMe",
    live: null,
    featured: true,
    color: "#e8a045",
    codeSnippet: `interface LinkItem {
  id: string
  label: string
  url: string
  icon?: string
}

// Live preview sync
const [links, setLinks] = useState<LinkItem[]>([])

const addLink = (link: LinkItem) => {
  setLinks(prev => [...prev, link])
  // WebAPI call — C# backend
  api.post('/links', link)
}`,
    language: "typescript",
    filename: "LinkDialog.tsx",
  },
  {
    id: "02",
    title: "Native Ecommerce",
    tagline: "Mobile commerce, full stack.",
    description:
      "Full-featured React Native ecommerce app with a separate admin panel, JWT authentication, product management via API, and database schema migrations. Three separate apps — customer, admin, and backend — all in one repo.",
    tags: ["React Native", "TypeScript", "ASP.NET Core", "JWT", "Mobile"],
    github: "https://github.com/prusotamkrydv78/Native_Eccomerce",
    live: null,
    featured: true,
    color: "#b87333",
    codeSnippet: `// JWT Auth middleware — ASP.NET Core
[Authorize]
[HttpGet("products")]
public async Task<IActionResult> GetProducts()
{
  var userId = User.GetUserId();
  var products = await _repo
    .GetByUserAsync(userId);
  return Ok(products);
}`,
    language: "csharp",
    filename: "ProductsController.cs",
  },
  {
    id: "03",
    title: "ChatX",
    tagline: "Real-time. No latency excuses.",
    description:
      "Real-time chat application with WebSocket-powered messaging using Socket.IO. MongoDB persistence, Node.js/Express backend, deployed to Vercel. Built to understand event-driven architecture and real-time system design.",
    tags: ["Socket.IO", "React", "Node.js", "MongoDB", "Real-time"],
    github: "https://github.com/prusotamkrydv78/message_app",
    live: "https://chatx-ten.vercel.app/",
    featured: true,
    color: "#e8a045",
    codeSnippet: `// Real-time message handler
socket.on('message:send', async (data) => {
  const msg = await Message.create({
    room: data.roomId,
    sender: socket.userId,
    text: data.text,
  })
  io.to(data.roomId).emit(
    'message:receive', msg
  )
})`,
    language: "javascript",
    filename: "socket.server.js",
  },
  {
    id: "04",
    title: "X Clone",
    tagline: "Social media, from scratch.",
    description:
      "Full-featured Twitter/X clone with post creation, social feed, follow system, and CRUD operations. Built with MERN stack — complex state management, social platform architecture, and real-world data modeling.",
    tags: ["React", "Node.js", "Express", "MongoDB", "MERN"],
    github: "https://github.com/prusotamkrydv78/X",
    live: null,
    featured: false,
    color: "#b87333",
    codeSnippet: `// Social feed query
const feed = await Post.find({
  author: { $in: user.following }
})
.populate('author', 'name avatar')
.sort({ createdAt: -1 })
.limit(20)

res.json({ posts: feed })`,
    language: "javascript",
    filename: "feed.route.js",
  },
  {
    id: "05",
    title: "MongoX Vercel",
    tagline: "Serverless done right.",
    description:
      "A working demonstration of deploying a Node.js + MongoDB backend on Vercel's serverless infrastructure. Proves understanding of cold starts, connection pooling, and serverless deployment patterns.",
    tags: ["Node.js", "MongoDB", "Vercel", "Serverless"],
    github: "https://github.com/prusotamkrydv78/mongoXvercel",
    live: "https://mongoxvercel.vercel.app/",
    featured: false,
    color: "#e8a045",
    codeSnippet: `// Connection pooling for serverless
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = {
    conn: null, promise: null
  }
}

export async function connectDB() {
  if (cached.conn) return cached.conn
  cached.promise = mongoose.connect(URI)
  cached.conn = await cached.promise
  return cached.conn
}`,
    language: "javascript",
    filename: "db.js",
  },
]

export const skills = {
  frontend: [
    "React.js", "React Native", "TypeScript", "JavaScript (ES6+)",
    "Tailwind CSS", "HTML5 / CSS3", "Framer Motion", "Vite",
    "Redux / Zustand", "React Router", "Responsive Design",
  ],
  backend: [
    "Node.js", "Express.js", "ASP.NET Core (C#)", "REST API Design",
    "JWT Authentication", "Socket.IO / WebSocket", "Real-Time Systems",
  ],
  database: [
    "MongoDB / Mongoose", "SQL (via .NET)", "Vercel Serverless", "REST Integration",
  ],
  tools: [
    "Git / GitHub", "GSAP / ScrollTrigger", "React Three Fiber",
    "Vite / Turbopack", "Postman", "VS Code",
  ],
}

export const marqueeRow1 = [
  "React.js", "TypeScript", "Next.js", "Node.js",
  "Express", "GSAP", "Three.js", "Tailwind CSS",
]

export const marqueeRow2 = [
  "ASP.NET Core", "C#", "MongoDB", "React Native",
  "Socket.IO", "Framer Motion", "JWT Auth", "Vercel",
]

export const timeline = [
  {
    period: "2026 — Present",
    title: "Full Stack Developer",
    company: "Independent / Freelance",
    description:
      "Building production applications with TypeScript, React, Node.js, and ASP.NET Core. Exploring cross-platform development with React Native and .NET backends.",
    tech: ["TypeScript", "React", "ASP.NET Core", "React Native"],
  },
  {
    period: "2024 — 2026",
    title: "Full Stack Developer (Self-taught)",
    company: "Personal Projects",
    description:
      "Transitioned from frontend to full stack. Built real-time apps, mobile applications, and REST APIs. Accumulated 391+ GitHub contributions in the last year.",
    tech: ["MERN Stack", "Socket.IO", "MongoDB", "Vercel"],
  },
  {
    period: "2023",
    title: "Started Coding",
    company: "Self-taught",
    description:
      "Began with JavaScript and React. Built first projects, learned Git, and started the journey into full stack development.",
    tech: ["JavaScript", "React", "HTML/CSS"],
  },
]
