import { useLanguage } from '../i18n/LanguageProvider.jsx'

export default function About() {
  const { about } = useLanguage()

  return (
    <section id="o-meni" className="station about" data-scene="base" data-station aria-labelledby="about-title">
      <div className="wrap station-in about-in">
        <h2 id="about-title" className="sr">
          {about.title}
        </h2>
        <p className="about-large">{about.large}</p>

        <div className="about-cols">
          <div className="about-text">
            {about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div>
            <h3 className="small-title">{about.toolsTitle}</h3>
            <dl className="tools">
              {about.tools.map((t) => (
                <div key={t.label}>
                  <dt>{t.label}</dt>
                  <dd>{t.items}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <h3 className="small-title">{about.servicesTitle}</h3>
        <ul className="services">
          {about.services.map((s) => (
            <li key={s.title}>
              <strong>{s.title}</strong>
              <span>{s.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
