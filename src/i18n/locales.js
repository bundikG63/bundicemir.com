import * as bs from '../data/content.js'
import en from './en.js'
import de from './de.js'

export const languages = [
  { code: 'bs', label: 'Bosanski' },
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
]
export const content = { bs, en, de }
export const storageKey = 'bundicemir.language.v1'
export const isLanguage = (value) => Object.hasOwn(content, value)
export const resolveLanguage = (requested, saved) => (isLanguage(requested) ? requested : isLanguage(saved) ? saved : 'bs')

export const ui = {
  bs: { menu: 'Meni', closeMenu: 'Zatvori meni', home: 'Emir Bundić, početna', navigation: 'Glavna navigacija', language: 'Jezik stranice', skip: 'Preskoči na sadržaj', entry: 'Ulaz', route: 'Put kroz stranicu' },
  en: { menu: 'Menu', closeMenu: 'Close menu', home: 'Emir Bundić, home', navigation: 'Main navigation', language: 'Website language', skip: 'Skip to content', entry: 'Start', route: 'Route through the page' },
  de: { menu: 'Menü', closeMenu: 'Menü schließen', home: 'Emir Bundić, Startseite', navigation: 'Hauptnavigation', language: 'Sprache der Website', skip: 'Zum Inhalt springen', entry: 'Start', route: 'Weg durch die Seite' },
}

export const metadata = {
  bs: { title: 'Emir Bundić — Developer | bundicemir.com', description: 'Portfolio Emira Bundića: Tandemettle, LetterPilot AI, FAĆO i Godzilla. Web proizvodi, desktop aplikacije i FiveM sistemi.', locale: 'bs_BA' },
  en: { title: 'Emir Bundić — Developer | bundicemir.com', description: 'Emir Bundić’s portfolio: Tandemettle, LetterPilot AI, FAĆO and Godzilla. Web products, desktop apps and FiveM systems.', locale: 'en_US' },
  de: { title: 'Emir Bundić — Entwickler | bundicemir.com', description: 'Das Portfolio von Emir Bundić: Tandemettle, LetterPilot AI, FAĆO und Godzilla. Webprodukte, Desktop-Apps und FiveM-Systeme.', locale: 'de_DE' },
}
