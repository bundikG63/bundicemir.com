import { useEffect, useRef } from 'react'
import { useLanguage } from '../i18n/LanguageProvider.jsx'
import tandemettle from '../assets/tandemettle-full.webp'
import letterpilot from '../assets/letterpilot-full.webp'
import faco from '../assets/faco.webp'

// What the 3D scene needs to know about each project, in page order.
const scenes = {
  tandemettle: { color: 0x9dff7a, src: tandemettle, w: 1440, h: 4986 },
  letterpilot: { color: 0x6ea9ff, src: letterpilot, w: 1440, h: 6113 },
  faco: { color: 0xff9a5e, src: faco, w: 1380, h: 880 },
  godzilla: { color: 0xffd400 },
}

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))

/**
 * The fixed canvas behind the page and the route bar at the bottom.
 * Scroll position becomes a station index (0 = entrance, then one per [data-station]);
 * the scene, the fading of each station's text and the route bar all read that index.
 * Without WebGL or with reduced motion the page stays as plain sections with pictures.
 */
export default function Flight() {
  const { work, nav, ui } = useLanguage()
  const canvas = useRef(null)
  const flight = useRef(null)
  const board = work.items.find((p) => p.credits)

  useEffect(() => {
    const root = document.documentElement
    const stations = [...document.querySelectorAll('[data-station]')]
    const links = [...document.querySelectorAll('.route a')]
    let centres = []
    let frame = 0

    const measure = () => {
      centres = stations.map((el) => el.offsetTop + el.offsetHeight / 2)
      apply()
    }
    const apply = () => {
      frame = 0
      const y = scrollY + innerHeight / 2
      let pp = stations.length - 1
      for (let i = 0; i < centres.length - 1; i++) {
        if (y < centres[i + 1]) {
          pp = i + clamp((y - centres[i]) / (centres[i + 1] - centres[i]))
          break
        }
      }
      flight.current?.update(pp)
      const near = Math.round(pp)
      links.forEach((a, i) => a.classList.toggle('on', i === near))
      const gl = root.classList.contains('gl')
      stations.forEach((el, i) => {
        const inner = el.firstElementChild
        // A station taller than the screen is read by scrolling, so it never fades.
        const fade = gl && el.offsetHeight < innerHeight * 1.2
        inner.style.opacity = fade ? clamp(1.3 - Math.abs(pp - i) * 2.6).toFixed(3) : ''
      })
    }
    const request = () => {
      if (!frame) frame = requestAnimationFrame(apply)
    }

    measure()
    const observer = new ResizeObserver(measure)
    stations.forEach((el) => observer.observe(el))
    addEventListener('scroll', request, { passive: true })
    addEventListener('resize', measure)

    let dead = false
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      import('../three/flight.js')
        .then(async ({ createFlight }) => {
          await Promise.all([document.fonts.load('800 200px Unbounded'), document.fonts.load('700 33px "Manrope Variable"')])
          if (dead) return
          const projects = work.items.map((p) => ({ id: p.id, name: p.name, ...scenes[p.id] }))
          flight.current = createFlight(canvas.current, projects, stations.length - 1 - projects.length)
          if (board) flight.current.setBoard(board.name, board.credits)
          root.classList.add('gl')
          measure()
        })
        .catch(() => {
          // No WebGL: the plain page is the page.
        })
    }

    return () => {
      dead = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      removeEventListener('scroll', request)
      removeEventListener('resize', measure)
      flight.current?.dispose()
      flight.current = null
      root.classList.remove('gl')
    }
    // The scene is built once; language changes only redraw the board below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (board) flight.current?.setBoard(board.name, board.credits)
  }, [board])

  const stops = [
    { href: '#top', label: ui.entry },
    ...work.items.map((p) => ({ href: `#${p.id}`, label: p.name })),
    ...nav.filter((n) => n.href !== '#projekti'),
  ]

  return (
    <>
      <canvas ref={canvas} className="flight" aria-hidden="true" />
      <div className="veil" aria-hidden="true" />
      <nav className="route" aria-label={ui.route}>
        {stops.map((s) => (
          <a key={s.href} href={s.href}>
            {s.label}
          </a>
        ))}
      </nav>
    </>
  )
}
