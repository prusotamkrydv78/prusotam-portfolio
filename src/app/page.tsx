import Hero          from '@/components/sections/Hero'
import Marquee        from '@/components/sections/Marquee'
import Work           from '@/components/sections/Work'
import Services       from '@/components/sections/Services'
import Process        from '@/components/sections/Process'
import About          from '@/components/sections/About'
import Journey        from '@/components/sections/Journey'
import BentoStack     from '@/components/sections/BentoStack'
import GitHubActivity from '@/components/sections/GitHubActivity'
import Proof          from '@/components/sections/Proof'
import Contact        from '@/components/sections/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Work />
      <Services />
      <Process />
      <About />
      <Journey />
      <BentoStack />
      <GitHubActivity />
      <Proof />
      <Contact />
    </>
  )
}
