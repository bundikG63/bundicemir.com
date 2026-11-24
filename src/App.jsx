import { useEffect } from 'react'
import { useLanguage } from './i18n/LanguageProvider.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Work from './components/Work.jsx'
import About from './components/About.jsx'
import Contact from './components/Contact.jsx'

// The light in the room takes the colour of whichever scene crosses the middle of the screen.
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

// Depth: the pointer leans the 3D pieces (--mx, --my on the root, -1..1) and scrolling
// moves them (--sp on the hero, --p on each element marked data-depth, both 0..1).
function useDepth() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = document.documentElement
    const hero = document.getElementById('top')
    const tracked = [...document.querySelectorAll('[data-depth]')]
    const clamp = (v) => Math.min(1, Math.max(0, v))
    let frame = 0
    let target = [0, 0]
    let now = [0, 0]

    const measure = () => {
      const vh = window.innerHeight
      if (hero) hero.style.setProperty('--sp', clamp(window.scrollY / hero.offsetHeight).toFixed(3))
      for (const el of tracked) {
        const r = el.getBoundingClientRect()
        if (r.bottom < -200 || r.top > vh + 200) continue
        el.style.setProperty('--p', clamp((vh - r.top) / (vh + r.height)).toFixed(3))
      }
    }
    const tick = () => {
      frame = 0
      measure()
      now = [now[0] + (target[0] - now[0]) * 0.12, now[1] + (target[1] - now[1]) * 0.12]
      root.style.setProperty('--mx', now[0].toFixed(3))
      root.style.setProperty('--my', now[1].toFixed(3))
      if (Math.abs(target[0] - now[0]) + Math.abs(target[1] - now[1]) > 0.004) request()
    }
    const request = () => {
      if (!frame) frame = requestAnimationFrame(tick)
    }
    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return
      target = [(e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1]
      request()
    }

    measure()
    window.addEventListener('scroll', request, { passive: true })
    window.addEventListener('resize', request)
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', request)
      window.removeEventListener('resize', request)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])
}

export default function App() {
  const { ui } = useLanguage()
  useScene()
  useDepth()

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
