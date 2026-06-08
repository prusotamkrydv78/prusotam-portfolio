import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '@/styles/globals.css'
import LenisProvider from '@/components/providers/LenisProvider'
import { CursorProvider } from '@/components/providers/CursorProvider'
import CustomCursor from '@/components/ui/CustomCursor'
import NoiseBg from '@/components/ui/NoiseBg'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Intro from '@/components/ui/Intro'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Prusotam Kumar Yadav — Full Stack Developer',
  description:
    'Full Stack Developer building web apps, mobile apps, and real-time systems with React, TypeScript, Node.js, and ASP.NET Core.',
  keywords: [
    'Full Stack Developer', 'React Developer', 'Next.js', 'TypeScript',
    'Node.js', 'ASP.NET Core', 'React Native', 'Frontend Developer',
    'Backend Developer', 'Prusotam Yadav', 'prusotamkrydv78',
  ],
  openGraph: {
    title: 'Prusotam Kumar Yadav — Full Stack Developer',
    description: 'Building systems that feel alive.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <CursorProvider>
          <LenisProvider>
            <Intro />
            <CustomCursor />
            <NoiseBg />
            <Navbar />
            <main>{children}</main>
            <Footer />
          </LenisProvider>
        </CursorProvider>
      </body>
    </html>
  )
}
