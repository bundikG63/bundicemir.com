import { useReducedMotion } from 'framer-motion'
import Background from './components/Background.jsx'
import Header from './components/Header.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import Projects from './components/Projects.jsx'
import About from './components/About.jsx'
import Skills from './components/Skills.jsx'
import Services from './components/Services.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const reduced = useReducedMotion()
  return (
    <>
      <a className="skip" href="#main">Preskoči na sadržaj</a>
      <Background reduced={reduced} />
      <ScrollProgress />
      <Header />
      <main id="main">
        <Hero reduced={reduced} />
        <Marquee />
        <Projects />
        <About />
        <Skills />
        <Services />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
