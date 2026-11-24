import { useLanguage } from '../i18n/LanguageProvider.jsx'
import { ArrowUpRight } from './icons.jsx'
import tandemettle from '../assets/tandemettle-thumb.webp'
import letterpilot from '../assets/letterpilot-thumb.webp'
import faco from '../assets/faco.webp'

// Pictures for the plain page. In the flight the 3D scene shows the real screens instead.
const shots = {
  tandemettle: { src: tandemettle, width: 720, height: 450 },
  letterpilot: { src: letterpilot, width: 720, height: 450 },
  faco: { src: faco, width: 1380, height: 880 },
}

function Credits({ groups }) {
  return (
    <div className="credits plain">
      {groups.map((g) => (
        <section key={g.label}>
          <h4>{g.label}</h4>
          <ul>
            {g.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

export default function Work() {
  const { work } = useLanguage()

  return (
    <section id="projekti" aria-labelledby="work-title">
      <h2 id="work-title" className="sr">
        {work.title}
      </h2>
      {work.items.map((p, i) => {
        const label = work.open.replace('{name}', p.name)
        const shot = shots[p.id]
        return (
          <article key={p.id} id={p.id} className={`station proj c-${p.id}${i % 2 ? ' flip' : ''}`} data-scene={p.id} data-station>
            <div className="wrap station-in">
              <div className="copy">
                <h3 className="proj-name">{p.name}</h3>
                <p className="proj-headline">{p.headline}</p>
                <p className="proj-text">{p.text}</p>
                {p.facts && (
                  <ul className="facts">
                    {p.facts.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                )}
                {p.stack && <p className="stack">{p.stack}</p>}
                {p.url && (
                  <a className="btn" href={p.url} target="_blank" rel="noopener noreferrer">
                    {label}
                    <ArrowUpRight />
                  </a>
                )}
              </div>
              {p.credits ? (
                <Credits groups={p.credits} />
              ) : (
                <img className="shot plain" src={shot.src} alt="" width={shot.width} height={shot.height} loading="lazy" decoding="async" />
              )}
            </div>
          </article>
        )
      })}
    </section>
  )
}
