import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/unbounded/latin-500.css'
import '@fontsource/unbounded/latin-ext-500.css'
import '@fontsource/unbounded/latin-800.css'
import '@fontsource/unbounded/latin-ext-800.css'
import '@fontsource-variable/manrope/wght.css'
import './styles/global.css'
import App from './App.jsx'
import { LanguageProvider } from './i18n/LanguageProvider.jsx'
import { initAnalitika } from './lib/analitika.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)

initAnalitika()
