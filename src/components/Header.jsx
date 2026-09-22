import LanguageSwitcher from './LanguageSwitcher.jsx'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageProvider.jsx'
import './Header.css'

export default function Header() {
  const { nav, contact, ui } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const sections = document.querySelectorAll('section[id]')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive('#' + e.target.id)
        })
      },
      { rootMargin: '-15% 0px -60% 0px', threshold: 0 },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const links = [...nav, { href: '#kontakt', label: contact.navLabel, cta: true }]

  return (
    <motion.header
      className={`header wrap ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <a href="#" className="brand" aria-label={ui.home}>
        eb
      </a>
      <button
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? ui.closeMenu : ui.menu}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{ui.menu}</span>
        <span className={`menu-lines ${open ? 'open' : ''}`} aria-hidden="true" />
      </button>
      <nav id="main-nav" aria-label={ui.navigation} className="nav-desktop">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className={l.cta ? 'nav-contact' : 'nav-link'}
            aria-current={active === l.href ? 'location' : undefined}
          >
            {l.label}
            {l.cta && <span aria-hidden="true">↗</span>}
            {!l.cta && active === l.href && (
              <motion.i layoutId="nav-underline" className="nav-underline" />
            )}
          </a>
        ))}
      </nav>
      <LanguageSwitcher />
      <AnimatePresence>
        {open && (
          <motion.nav
            className="nav-mobile"
            aria-label={ui.mobileNavigation}
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {links.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                className={l.cta ? 'nav-contact' : 'nav-link'}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                {l.label}
                {l.cta && <span aria-hidden="true">↗</span>}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
