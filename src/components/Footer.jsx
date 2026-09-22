import { site } from '../data/content.js'
import './Footer.css'

const SEAL_URL = 'https://www.checkdomain.de/unternehmen/garantie/ssl/popup/'
const SEAL_IMG = 'https://www.checkdomain.de/assets/bundles/web/app/widget/seal/img/ssl_certificate/de/150x150.png?20260910-155835'

function SslSeal() {
  const open = (e) => {
    e.preventDefault()
    window.open(SEAL_URL + '?host=' + window.location.host, '', 'height=600,width=560,scrollbars=yes')
  }
  return (
    <a className="ssl-seal" href={SEAL_URL} onClick={open} title="SSL certifikat">
      <img src={SEAL_IMG} alt="SSL certifikat" width="150" height="150" loading="lazy" />
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="wrap footer">
      <div className="footer-row">
        <a className="brand" href="#" aria-label="Povratak na početak">
          eb
        </a>
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>{site.domain}</span>
        <a href="#" className="to-top">
          Na vrh ↑
        </a>
      </div>
      <div className="footer-seal">
        <SslSeal />
      </div>
    </footer>
  )
}
