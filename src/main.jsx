import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { LanguageProvider } from './i18n/LanguageProvider.jsx'
import './styles/global.css'
import { initAnalitika } from './lib/analitika.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider><App /></LanguageProvider>
  </StrictMode>,
)

initAnalitika()
