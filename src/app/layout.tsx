import type { Metadata } from 'next'
import { Syne, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import '@/styles/globals.css'
import ClientLayout from '@/components/providers/ClientLayout'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Preloader from '@/components/layout/Preloader'

/*
  Fonts:
  --font-clash   → Syne (Google fallback until Clash Display .woff2 are placed in /public/fonts/)
  --font-cabinet → Plus Jakarta Sans (fallback until Cabinet Grotesk .woff2 available)
  --font-jb-mono → JetBrains Mono (Google Fonts — permanent)

  To upgrade to the real fonts, download from fontshare.com and replace with:
  import localFont from 'next/font/local'
  const clash   = localFont({ src: '../public/fonts/ClashDisplay-Bold.woff2', ... })
  const cabinet = localFont({ src: '../public/fonts/CabinetGrotesk-Medium.woff2', ... })
*/
const clash = Syne({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-clash',
})

const cabinet = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-cabinet',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-jb-mono',
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
      className={`${clash.variable} ${cabinet.variable} ${mono.variable}`}
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
