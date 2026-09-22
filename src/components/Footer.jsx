import { site } from '../data/content.js'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="wrap footer">
      <a className="brand" href="#" aria-label="Povratak na početak">
        eb
      </a>
      <span>© {new Date().getFullYear()} {site.name}</span>
      <span>{site.domain}</span>
      <a href="#" className="to-top">
        Na vrh ↑
      </a>
    </footer>
  )
}
