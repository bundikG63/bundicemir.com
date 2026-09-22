import { useEffect, useRef } from 'react'
import './Background.css'

/**
 * Animirana pozadina: aurora gradijenti (CSS) + mreža čestica (canvas 2D)
 * koja reaguje na miš. Fixed iza cijelog sadržaja.
 */
export default function Background({ reduced }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf = 0
    let w = 0
    let h = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    const mouse = { x: -9999, y: -9999 }
    const particles = []

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const target = Math.round((w * h) / 16000)
      const count = Math.max(40, Math.min(110, target))
      particles.length = 0
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.4 + 0.6,
        })
      }
    }

    const onMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }

    const LINK = 130
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        // blagi privlačenje ka mišu
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const d2 = dx * dx + dy * dy
        if (d2 < 220 * 220) {
          const f = 0.00012
          p.vx += dx * f
          p.vy += dy * f
        }
        p.vx *= 0.995
        p.vy *= 0.995
        p.x += p.vx
        p.y += p.vy
        if (p.x < -20) p.x = w + 20
        if (p.x > w + 20) p.x = -20
        if (p.y < -20) p.y = h + 20
        if (p.y > h + 20) p.y = -20
      }

      ctx.lineWidth = 1
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d = Math.hypot(dx, dy)
          if (d < LINK) {
            const alpha = (1 - d / LINK) * 0.22
            ctx.strokeStyle = `rgba(185,161,255,${alpha})`
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
      for (const p of particles) {
        ctx.fillStyle = 'rgba(209,189,255,0.75)'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf)
      else raf = requestAnimationFrame(draw)
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [reduced])

  return (
    <div className="bg" aria-hidden="true">
      <div className="bg-aurora">
        <span className="blob b1" />
        <span className="blob b2" />
        <span className="blob b3" />
      </div>
      <div className="bg-grid" />
      <canvas ref={canvasRef} className="bg-canvas" />
      <div className="bg-noise" />
    </div>
  )
}
