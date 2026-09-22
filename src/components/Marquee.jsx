import { specialties } from '../data/content.js'
import './Marquee.css'

export default function Marquee() {
  const row = [...specialties, ...specialties, ...specialties]
  return (
    <div className="marquee" aria-label="Područja rada">
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
