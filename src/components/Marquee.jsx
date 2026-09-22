import { useLanguage } from '../i18n/LanguageProvider.jsx'
import './Marquee.css'

export default function Marquee() {
  const { specialties, ui } = useLanguage()
  const row = [...specialties, ...specialties, ...specialties]
  return (
    <div className="marquee" aria-label={ui.specialties}>
      <div className="marquee-track">
        {[0, 1].map((k) => (
          <div className="marquee-group" key={k} aria-hidden={k === 1}>
            {row.map((s, i) => (
              <span key={i} className="marquee-item">
                {s}
                <b aria-hidden="true">✳</b>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
