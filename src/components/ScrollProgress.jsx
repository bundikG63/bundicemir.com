import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 })
  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        transformOrigin: '0%',
        scaleX,
        background: 'linear-gradient(90deg, var(--accent), var(--accent-3))',
        zIndex: 60,
        pointerEvents: 'none',
      }}
    />
  )
}
