import { useLanguage } from '../i18n/LanguageProvider.jsx'
import { ArrowDown, Mail } from './icons.jsx'

export default function Hero() {
  const { hero, site } = useLanguage()
  const [first, last] = site.name.split(' ')

  return (
    <section className="station hero" id="top" data-scene="base" data-station aria-labelledby="hero-name">
      <div className="wrap station-in">
        <h1 className="hero-name" id="hero-name">
          <span>{first}</span> <span>{last}</span>
        </h1>
        <p className="hero-line">{hero.line}</p>
        <p className="hero-text">{hero.text}</p>
        <div className="actions">
          <a className="btn" href="#tandemettle">
            {hero.primary}
            <ArrowDown />
          </a>
          <a className="btn ghost" href={`mailto:${site.email}`}>
            {hero.secondary}
            <Mail />
          </a>
        </div>
      </div>
    </section>
  )
}
