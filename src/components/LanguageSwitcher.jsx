import { useLanguage } from '../i18n/LanguageProvider.jsx'
import { languages } from '../i18n/locales.js'
export default function LanguageSwitcher() {
  const { language, setLanguage, ui } = useLanguage()
  return <div className="language-switcher" role="group" aria-label={ui.language}>
    {languages.map(({ code, label }) => <button key={code} type="button" lang={code} aria-label={label} title={label} aria-pressed={language === code} onClick={() => setLanguage(code)}>{code.toUpperCase()}</button>)}
  </div>
}
