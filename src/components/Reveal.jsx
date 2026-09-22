import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

export default function Reveal({ children, delay = 0, y = 34, className, as = 'div', once = true, ...rest }) {
  const Tag = motion[as] || motion.div
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, margin: '-10% 0px -10% 0px' }}
      transition={{ duration: 0.85, ease, delay }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
