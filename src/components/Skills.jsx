import { motion } from 'framer-motion'
import { skills } from '../data/content.js'
import Reveal from './Reveal.jsx'
import './Skills.css'

export default function Skills() {
  return (
    <section id="vjestine" className="section wrap skills-section" aria-labelledby="skills-title">
      <Reveal>
        <p className="eyebrow">{skills.eyebrow}</p>
        <h2 id="skills-title">
          {skills.title} <span className="gradient-text">{skills.titleAccent}</span>
        </h2>
      </Reveal>
      <div className="skill-list">
        {skills.list.map((s, i) => (
          <motion.article
            key={s.title}
            className="skill-row"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.7, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ x: 8 }}
          >
            <span className="skill-num" aria-hidden="true">
              0{i + 1}
            </span>
            <div className="skill-main">
              <span className="skill-label">{s.label}</span>
              <h3>{s.title}</h3>
              <div className="tags">
                {s.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
            <p>{s.text}</p>
            <span className="skill-line" aria-hidden="true" />
          </motion.article>
        ))}
      </div>
    </section>
  )
}
