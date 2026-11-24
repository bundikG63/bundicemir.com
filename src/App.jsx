import { useEffect } from 'react'
import { useLanguage } from './i18n/LanguageProvider.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Work from './components/Work.jsx'
import About from './components/About.jsx'
import Contact from './components/Contact.jsx'

// The page takes the colours of whichever scene crosses the middle of the screen.
function useScene() {
  useEffect(() => {
    const root = document.documentElement
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) root.dataset.scene = entry.target.dataset.scene
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    document.querySelectorAll('[data-scene]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

export default function App() {
  const { ui } = useLanguage()
  useScene()

  return (
    <>
      <a className="skip" href="#main">
        {ui.skip}
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Work />
        <About />
        <Contact />
      </main>
    </>
  )
}
