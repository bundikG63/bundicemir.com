import { useLanguage } from '../i18n/LanguageProvider.jsx'
import './Footer.css'

const SEAL_URL = 'https://www.checkdomain.de/unternehmen/garantie/ssl/popup/'
const SEAL_IMG = 'https://www.checkdomain.de/assets/bundles/web/app/widget/seal/img/ssl_certificate/de/150x150.png?20260910-155835'

function SslSeal() {
  const { ui } = useLanguage()
  const open = (e) => {
    e.preventDefault()
    window.open(SEAL_URL + '?host=' + window.location.host, '', 'height=600,width=560,scrollbars=yes')
  }
  return (
    <a className="ssl-seal" href={SEAL_URL} onClick={open} title={ui.ssl}>
      <img src={SEAL_IMG} alt={ui.ssl} width="150" height="150" loading="lazy" />
    </a>
  )
}

export default function Footer() {
  const { site, ui } = useLanguage()
  return (
    <footer className="wrap footer">
      <div className="footer-row">
        <a className="brand" href="#" aria-label={ui.backHome}>
          eb
        </a>
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>{site.domain}</span>
        <a href="#" className="to-top">
          {ui.backTop} ↑
        </a>
      </div>
      <div className="footer-seal">
        <SslSeal />
      </div>
    </footer>
  )
}
