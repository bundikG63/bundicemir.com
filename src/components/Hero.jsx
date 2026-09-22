import { lazy, Suspense, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { hero, site } from '../data/content.js'
import './Hero.css'

const Hero3D = lazy(() => import('./Hero3D.jsx'))

const ease = [0.22, 1, 0.36, 1]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
}
const item = {
  hidden: { opacity: 0, y: 32, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease } },
}

function SplitWords({ text, className }) {
  return text.split(' ').map((w, i) => (
    <span key={i}>
      <span className="word-mask">
        <motion.span className={className} variants={item} style={{ display: 'inline-block' }}>
          {w}
        </motion.span>
      </span>{' '}
    </span>
  ))
}

export default function Hero({ reduced }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yCopy = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -120])
  const yArt = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 140])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scaleArt = useTransform(scrollYProgress, [0, 1], [1, 1.15])

  return (
    <section className="hero wrap" aria-labelledby="hero-title" ref={ref}>
      <div className="hero-layout">
        <motion.div
          className="hero-copy"
          style={{ y: yCopy, opacity }}
          variants={container}
          initial="hidden"
          animate="show"
        >
          <h1 id="hero-title">
            <SplitWords text={hero.titleA} />
            <br />
            <SplitWords text={hero.titleB} />
            <SplitWords text={hero.titleAccent} className="gradient-text" />
          </h1>
          <motion.p variants={item}>{hero.text}</motion.p>
          <motion.div className="hero-actions" variants={item}>
            <a className="button" href="#projekti">
              {hero.primary} <span aria-hidden="true">↗</span>
            </a>
            <a className="button secondary" href={site.github} target="_blank" rel="noopener noreferrer">
              {hero.secondary} <span aria-hidden="true">↗</span>
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="code-art"
          aria-hidden="true"
          style={{ y: yArt, scale: scaleArt }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease, delay: 0.3 }}
        >
          <Suspense fallback={<div className="code-art-fallback" />}>
            <Hero3D reduced={reduced} />
          </Suspense>
          <span className="code-symbol">&lt;/&gt;</span>
          <span className="art-caption">
            {hero.caption[0]}
            <br />
            {hero.caption[1]}
          </span>
        </motion.div>
      </div>

      <motion.div
        className="hero-foot"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <span>
          {hero.stack.map((s, i) => (
            <span key={s}>
              {s}
              {i < hero.stack.length - 1 && <em aria-hidden="true"> / </em>}
            </span>
          ))}
        </span>
        <span className="scroll-label">
          {hero.scroll}
          <motion.i
            aria-hidden="true"
            animate={reduced ? {} : { y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          >
            ↓
          </motion.i>
        </span>
      </motion.div>
    </section>
  )
}
