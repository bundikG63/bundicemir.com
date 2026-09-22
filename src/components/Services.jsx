import { motion } from 'framer-motion'
import { services } from '../data/content.js'
import Reveal from './Reveal.jsx'
import './Services.css'

export default function Services() {
  return (
    <section className="section wrap services" aria-labelledby="services-title">
      <Reveal>
        <p className="eyebrow">{services.eyebrow}</p>
        <h2 id="services-title">{services.title}</h2>
      </Reveal>
      <div className="service-list">
        {services.list.map((s, i) => (
          <motion.div
            key={s.title}
            className="service-row"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.7, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="number">0{i + 1}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
            <span className="service-arrow" aria-hidden="true">
              →
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
