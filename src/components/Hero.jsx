import { useLanguage } from '../i18n/LanguageProvider.jsx'
import { ArrowDown, Mail } from './icons.jsx'
import tandemettle from '../assets/tandemettle-thumb.webp'
import letterpilot from '../assets/letterpilot-thumb.webp'
import faco from '../assets/faco-thumb.webp'

const thumbs = { tandemettle, letterpilot, faco }

export default function Hero() {
  const { hero, site, work, ui } = useLanguage()
  const [first, last] = site.name.split(' ')

  return (
    <section className="hero" id="top" data-scene="base" aria-labelledby="hero-name">
      <div className="wrap hero-in">
        <h1 className="hero-name" id="hero-name">
          <span className="rise">
            <span>{first}</span>
          </span>{' '}
          <span className="rise">
            <span>{last}</span>
          </span>
        </h1>

        <div className="hero-mid">
          <p className="hero-line">{hero.line}</p>
          <p className="hero-text">{hero.text}</p>
          <div className="actions">
            <a className="btn" href="#projekti">
              {hero.primary}
              <ArrowDown />
            </a>
            <a className="btn ghost" href={`mailto:${site.email}`}>
              {hero.secondary}
              <Mail />
            </a>
          </div>
        </div>

        <nav className="strip" aria-label={ui.jump}>
          {work.items.map((p) => (
            <a key={p.id} className={`tile tile-${p.id}`} href={`#${p.id}`}>
              {thumbs[p.id] && <img src={thumbs[p.id]} alt="" width="720" height="450" decoding="async" />}
              <span className="tile-name">{p.name}</span>
            </a>
          ))}
        </nav>
      </div>
    </section>
  )
}
