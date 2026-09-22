import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { contact, site } from '../data/content.js'
import Reveal from './Reveal.jsx'
import './Contact.css'

export default function Contact() {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const yGlow = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : 160, reduced ? 0 : -160])
  const rot = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 90])

  return (
    <section id="kontakt" className="wrap contact-wrap" ref={ref}>
      <Reveal>
        <div className="contact">
          <motion.div className="contact-glow" style={{ y: yGlow }} aria-hidden="true" />
          <motion.div className="contact-ring" style={{ rotate: rot }} aria-hidden="true" />
          <p className="eyebrow">{contact.eyebrow}</p>
          <h2>
            {contact.title}
            <br />
            <span className="gradient-text">{contact.titleAccent}</span>
          </h2>
          <div className="contact-bottom">
            <p>{contact.text}</p>
            <motion.a
              className="button dark"
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {contact.button} <span aria-hidden="true">↗</span>
            </motion.a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
