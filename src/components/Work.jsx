import { useLanguage } from '../i18n/LanguageProvider.jsx'
import { ArrowUpRight } from './icons.jsx'
import tandemettle from '../assets/tandemettle-full.webp'
import letterpilot from '../assets/letterpilot-full.webp'
import faco from '../assets/faco.webp'

// Real screenshots. `pan` marks a full-page capture that scrolls inside its frame on hover.
const shots = {
  tandemettle: { src: tandemettle, width: 1440, height: 4986, pan: true },
  letterpilot: { src: letterpilot, width: 1440, height: 6113, pan: true },
  faco: { src: faco, width: 1380, height: 880, pan: false },
}

function Shot({ project, label }) {
  const shot = shots[project.id]
  const img = <img src={shot.src} alt="" width={shot.width} height={shot.height} loading="lazy" decoding="async" />
  const className = `shot${shot.pan ? ' pan' : ''}`
  const style = { '--ratio': shot.height / shot.width }
  if (!project.url) {
    return (
      <div className={className} style={style} role="img" aria-label={project.name}>
        {img}
      </div>
    )
  }
  return (
    <a className={className} style={style} href={project.url} target="_blank" rel="noopener noreferrer" aria-label={label}>
      {img}
    </a>
  )
}

function Credits({ groups }) {
  return (
    <div className="credits">
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
      {work.items.map((p) => {
        const label = work.open.replace('{name}', p.name)
        return (
          <article key={p.id} id={p.id} className={`scene${p.credits ? ' scene-credits' : ''}`} data-scene={p.id}>
            <div className="wrap scene-in">
              <h3 className="scene-name">{p.name}</h3>
              <div className="scene-copy">
                <p className="scene-headline">{p.headline}</p>
                <p className="scene-text">{p.text}</p>
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
              {p.credits ? <Credits groups={p.credits} /> : <Shot project={p} label={label} />}
            </div>
          </article>
        )
      })}
    </section>
  )
}
