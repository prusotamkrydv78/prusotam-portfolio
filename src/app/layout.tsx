import type { Metadata } from 'next'
import { Fraunces, Space_Grotesk, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import '@/styles/globals.css'
import ClientLayout from '@/components/providers/ClientLayout'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Preloader from '@/components/layout/Preloader'

/* Display / headlines — Fraunces variable serif */
const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['SOFT', 'WONK', 'opsz'],
  weight: 'variable',
  style: ['normal', 'italic'],
  variable: '--fraunces',
  display: 'swap',
})

/* Body — Plus Jakarta Sans */
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--jakarta',
  display: 'swap',
})

/* Labels / metadata — Space Grotesk */
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--space-grotesk',
  display: 'swap',
})

/* Code contexts only — JetBrains Mono */
const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-jb-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Prusotam Kumar Yadav — Full Stack Developer',
  description:
    'Full Stack Developer building web applications, mobile apps, and real-time systems. React, TypeScript, Node.js, ASP.NET Core, React Native.',
  keywords: [
    'Full Stack Developer', 'React Developer', 'TypeScript', 'Node.js',
    'ASP.NET Core', 'React Native', 'Prusotam Yadav', 'prusotamkrydv78',
    'Frontend Developer', 'Backend Developer',
  ],
  openGraph: {
    title: 'Prusotam Yadav — Full Stack Developer',
    description: 'Open to opportunities. Building with React, TypeScript, Node.js, and ASP.NET Core.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${jakarta.variable} ${spaceGrotesk.variable} ${mono.variable}`}
    >
      <body>
        <Preloader />
        <ClientLayout>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ClientLayout>
      </body>
    </html>
  )
}
