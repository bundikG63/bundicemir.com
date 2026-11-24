import { useEffect, useState } from 'react'
import { useLanguage } from '../i18n/LanguageProvider.jsx'
import LanguageSwitcher from './LanguageSwitcher.jsx'
import { Menu, Close } from './icons.jsx'

export default function Header() {
  const { nav, site, ui } = useLanguage()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // The menu is a phone layout only; leave it when the window grows.
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 861px)')
    const close = () => wide.matches && setOpen(false)
    wide.addEventListener('change', close)
    return () => wide.removeEventListener('change', close)
  }, [])

  return (
    <header className="head">
      <div className="wrap head-in">
        <a className="mark" href="#top" aria-label={ui.home} onClick={() => setOpen(false)}>
          {site.name
            .split(' ')
            .map((w) => w[0])
            .join('')}
        </a>
        <nav className="head-nav" aria-label={ui.navigation}>
          {nav.map((n) => (
            <a key={n.href} href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="head-end">
          <LanguageSwitcher />
          <button
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls="menu"
            aria-label={open ? ui.closeMenu : ui.menu}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </div>
      <div id="menu" className="menu" hidden={!open}>
        <nav className="wrap" aria-label={ui.navigation}>
          {nav.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)}>
              {n.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
