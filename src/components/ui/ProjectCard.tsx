'use client'

import { useRef } from 'react'

interface ProjectCardProps {
  title: string
  codeSnippet: string
  filename: string
  projectColor: string
}

function highlight(code: string): string {
  return code
    .replace(/\/\/.*/g, (m) => `<span class="token-comment">${m}</span>`)
    .replace(/(".*?"|'.*?'|`.*?`)/g, (m) => `<span class="token-string">${m}</span>`)
    .replace(/\b(const|let|var|async|await|return|if|export|import|from|function|interface|type|public|private|void|string|number|boolean|null|undefined|true|false|new)\b/g,
      (m) => `<span class="token-keyword">${m}</span>`)
    .replace(/\b([A-Z][a-zA-Z]*)\b/g, (m) => `<span class="token-type">${m}</span>`)
    .replace(/\b(\d+)\b/g, (m) => `<span class="token-number">${m}</span>`)
}

export default function ProjectCard({ title, codeSnippet, filename, projectColor }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    cardRef.current.style.transform = `perspective(800px) rotateX(${y * -4}deg) rotateY(${x * 4}deg)`
  }

  const onMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)'
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="rounded-lg overflow-hidden transition-transform duration-300"
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        boxShadow: `0 20px 60px ${projectColor}26`,
        fontFamily: 'var(--font-geist-mono), monospace',
      }}
    >
      {/* Window chrome */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-tertiary)' }}
      >
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs" style={{ color: 'var(--text-muted)' }}>{filename}</span>
      </div>

      {/* Code */}
      <pre className="p-5 text-sm leading-relaxed overflow-x-auto"
        style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.7' }}>
        <code
          dangerouslySetInnerHTML={{ __html: highlight(codeSnippet) }}
        />
      </pre>
    </div>
  )
}
