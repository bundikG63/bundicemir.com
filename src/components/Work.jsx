import { useLanguage } from '../i18n/LanguageProvider.jsx'
import { ArrowUpRight } from './icons.jsx'
import tandemettle from '../assets/tandemettle-full.webp'
import letterpilot from '../assets/letterpilot-full.webp'
import faco from '../assets/faco.webp'

// Real screenshots. `pan` marks a full-page capture that scrolls inside its frame on hover.
// `detail` is the part of the same capture shown on the small panel floating in front.
const shots = {
  tandemettle: { src: tandemettle, width: 1440, height: 4986, pan: true, detail: '50% 24%' },
  letterpilot: { src: letterpilot, width: 1440, height: 6113, pan: true, detail: '50% 42%' },
  faco: { src: faco, width: 1380, height: 880, pan: false, detail: '58% 30%', zoom: '210%' },
}

function Shot({ project, label }) {
  const shot = shots[project.id]
  const img = <img src={shot.src} alt="" width={shot.width} height={shot.height} loading="lazy" decoding="async" />
  const className = `shot${shot.pan ? ' pan' : ''}`
  const style = { '--ratio': shot.height / shot.width }
  return (
    <div className="shot-stage" data-depth>
      <div className="shot-3d">
        {project.url ? (
          <a className={className} style={style} href={project.url} target="_blank" rel="noopener noreferrer" aria-label={label}>
            {img}
          </a>
        ) : (
          <div className={className} style={style} role="img" aria-label={project.name}>
            {img}
          </div>
        )}
        <div
          className="shot-detail"
          aria-hidden="true"
          style={{
            backgroundImage: `url(${shot.src})`,
            backgroundPosition: shot.detail,
            backgroundSize: shot.zoom ?? '150%',
          }}
        />
      </div>
    </div>
  )
}

function Credits({ groups }) {
  return (
    <div className="credits-stage" data-depth>
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
    </div>
  )
}

export default function Work() {
  const { work } = useLanguage()
  const total = work.items.length

  return (
    <section id="projekti" aria-labelledby="work-title">
      <h2 id="work-title" className="sr">
        {work.title}
      </h2>
      {work.items.map((p, i) => {
        const label = work.open.replace('{name}', p.name)
        const flip = !p.credits && i % 2 === 1
        return (
          <article key={p.id} id={p.id} className={`scene c-${p.id}${flip ? ' flip' : ''}`} data-scene={p.id}>
            <div className="wrap scene-in">
              <div className="scene-copy">
                <p className="scene-count">{work.count.replace('{n}', i + 1).replace('{total}', total)}</p>
                <h3 className="scene-name">{p.name}</h3>
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
