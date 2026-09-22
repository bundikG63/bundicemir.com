import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageProvider.jsx'
import TiltCard from './TiltCard.jsx'
import Reveal from './Reveal.jsx'
import './Projects.css'

function More({ text }) {
  const { ui } = useLanguage()
  const [open, setOpen] = useState(false)
  return (
    <div className="more">
      <button className="more-toggle" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {ui.more}
        <motion.span aria-hidden="true" animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.25 }}>
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.p
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 14 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            {text}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Projects() {
  const { projects, ui } = useLanguage()
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const yWord = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : 70, reduced ? 0 : -70])
  const yGlow = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : 120, reduced ? 0 : -160])
  const rotate = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : -3, reduced ? 0 : 3])
  const f = projects.featured

  return (
    <section id="projekti" className="section wrap projects" aria-labelledby="projects-title" ref={ref}>
      <motion.div className="projects-glow" style={{ y: yGlow }} aria-hidden="true" />
      <div className="section-top">
        <Reveal>
          <p className="eyebrow">{projects.eyebrow}</p>
          <h2 id="projects-title">
            {projects.title} <span className="gradient-text">{projects.titleAccent}</span>
          </h2>
        </Reveal>
        <Reveal delay={0.15} as="p">
          {projects.lead}
        </Reveal>
      </div>

      <Reveal>
        <TiltCard className="featured project" max={4}>
          <div className="project-visual">
            <div className="visual-top">
              <span>{f.label}</span>
              <span>{f.number}</span>
            </div>
            <motion.div className="wordmark" style={{ y: yWord, rotate }}>
              {f.wordmark}
              <span>{f.sub}</span>
            </motion.div>
            <div className="system-map" aria-label={ui.projectParts}>
              {f.map.map((m, i) => (
                <span key={m} className="map-node" style={{ '--i': i }}>
                  <b>{m}</b>
                  {i < f.map.length - 1 && <i aria-hidden="true">↔</i>}
                </span>
              ))}
            </div>
          </div>
          <div className="project-copy">
            <div className="tags">
              {f.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
            <More text={f.more} />
          </div>
        </TiltCard>
      </Reveal>

      <div className="project-grid">
        {projects.list.map((p, i) => (
          <Reveal key={i} delay={0.1 * i}>
            <TiltCard className="project small">
              <div className="project-label">
                <span>{p.label}</span>
                <span aria-hidden="true">{p.icon}</span>
              </div>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
              <div className="tags">
                {p.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <More text={p.more} />
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
