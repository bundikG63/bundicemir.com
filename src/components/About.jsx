import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageProvider.jsx'
import Reveal from './Reveal.jsx'
import './About.css'

export default function About() {
  const { about, site, ui } = useLanguage()
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const yName = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : 24, reduced ? 0 : -24])
  const yOrb = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : 200, reduced ? 0 : -200])
  const xOrb = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : -40, reduced ? 0 : 60])

  return (
    <section id="o-meni" className="about section" ref={ref}>
      <motion.div className="about-orb" style={{ y: yOrb, x: xOrb }} aria-hidden="true" />
      <div className="wrap about-grid">
        <div>
          <Reveal>
            <p className="eyebrow">{about.eyebrow}</p>
          </Reveal>
          <motion.h2 style={{ y: yName }}>
            <Reveal delay={0.05} as="span" style={{ display: 'block' }}>
              {about.name}
              <span className="accent">.</span>
            </Reveal>
          </motion.h2>
          <Reveal delay={0.15}>
            <p className="about-role">{about.role}</p>
            <a className="text-link" href={site.github} target="_blank" rel="noopener noreferrer">
              {about.githubLabel} <span aria-hidden="true">↗</span>
            </a>
          </Reveal>
        </div>
        <div className="about-copy">
          <Reveal>
            <p className="large">{about.large}</p>
          </Reveal>
          {about.paragraphs.map((p, i) => (
            <Reveal key={i} delay={0.08 * (i + 1)} as="p">
              {p}
            </Reveal>
          ))}
          <div className="skills">
            {about.skills.map((s, i) => (
              <motion.span
                key={s}
                initial={{ opacity: 0, y: 12, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * i, duration: 0.5 }}
                whileHover={{ y: -3, borderColor: '#b9a1ff' }}
              >
                {s}
              </motion.span>
            ))}
          </div>
          <Reveal delay={0.2}>
            <a className="text-link" href="#vjestine">
              {about.skillsLink} <span aria-hidden="true">↓</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
