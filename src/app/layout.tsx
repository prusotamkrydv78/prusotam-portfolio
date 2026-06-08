import type { Metadata } from 'next'
import { Syne, DM_Mono, DM_Sans } from 'next/font/google'
import '@/styles/globals.css'
import ClientLayout from '@/components/providers/ClientLayout'
import Navbar from '@/components/layout/Navbar'

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'Prusotam Kumar Yadav — Full Stack Developer',
  description:
    'Full Stack Developer. React, TypeScript, Node.js, ASP.NET Core, React Native. Building web, mobile, and real-time systems.',
  keywords: [
    'Full Stack Developer', 'React', 'TypeScript', 'Node.js',
    'ASP.NET Core', 'React Native', 'Prusotam Yadav', 'prusotamkrydv78',
  ],
  openGraph: {
    title: 'PK — Full Stack Developer',
    description: 'I write code. I design systems. I obsess over the gap between the two.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} ${dmMono.variable} ${dmSans.variable}`}
    >
      <body>
        <ClientLayout>
          <Navbar />
          <main>{children}</main>
        </ClientLayout>
      </body>
    </html>
  )
}
