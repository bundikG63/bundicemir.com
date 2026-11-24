import { useLanguage } from '../i18n/LanguageProvider.jsx'
import { ArrowDown, Mail } from './icons.jsx'
import tandemettle from '../assets/tandemettle-thumb.webp'
import letterpilot from '../assets/letterpilot-thumb.webp'
import faco from '../assets/faco-thumb.webp'

// Bottom layer first: the stack is drawn back to front.
const layers = [
  { id: 'faco', src: faco },
  { id: 'letterpilot', src: letterpilot },
  { id: 'tandemettle', src: tandemettle },
]

export default function Hero() {
  const { hero, site, work, ui } = useLanguage()
  const [first, last] = site.name.split(' ')
  const names = Object.fromEntries(work.items.map((p) => [p.id, p.name]))

  return (
    <section className="hero" id="top" data-scene="base" aria-labelledby="hero-name">
      <div className="wrap hero-in">
        <div className="hero-copy">
          <h1 className="hero-name" id="hero-name">
            <span>{first}</span> <span>{last}</span>
          </h1>
          <p className="hero-lead">
            <strong>{hero.line}</strong> {hero.text}
          </p>
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

        {/* Decorative: the same projects are linked by name in the strip below. */}
        <div className="stage" aria-hidden="true">
          <div className="stage-in">
            <div className="iso">
              {layers.map((l, i) => (
                <a key={l.id} href={`#${l.id}`} tabIndex={-1} className={`layer c-${l.id}`} style={{ '--i': i }}>
                  <img src={l.src} alt="" width="720" height="450" decoding="async" />
                </a>
              ))}
            </div>
          </div>
          {layers.map((l) => (
            <span key={l.id} className={`chip chip-${l.id} c-${l.id}`}>
              {names[l.id]}
            </span>
          ))}
        </div>

        <nav className="strip" aria-label={ui.jump}>
          {work.items.map((p) => (
            <a key={p.id} className={`tab c-${p.id}`} href={`#${p.id}`}>
              <strong>{p.name}</strong>
              <span>{p.headline}</span>
            </a>
          ))}
        </nav>
      </div>
    </section>
  )
}
