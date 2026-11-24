import { useLanguage } from '../i18n/LanguageProvider.jsx'
import LanguageSwitcher from './LanguageSwitcher.jsx'
import { ArrowUp, Github } from './icons.jsx'

export default function Contact() {
  const { contact, footer, site } = useLanguage()

  return (
    <section id="kontakt" className="station contact" data-scene="signal" data-station aria-labelledby="contact-title">
      <div className="wrap station-in contact-in">
        <h2 id="contact-title" className="contact-title">
          {contact.title}
        </h2>
        <p className="contact-text">{contact.text}</p>
        <a className="contact-mail" href={`mailto:${site.email}`}>
          {site.email}
        </a>
        <div className="actions">
          <a className="btn" href={site.github} target="_blank" rel="noopener noreferrer">
            {contact.github}
            <Github />
          </a>
        </div>
      </div>
      <footer className="wrap foot">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <LanguageSwitcher />
        <a className="foot-top" href="#top">
          {footer.top}
          <ArrowUp width="16" height="16" />
        </a>
      </footer>
    </section>
  )
}
