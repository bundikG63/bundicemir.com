import * as bs from '../data/content.js'
import en from './en.js'
import de from './de.js'
export const languages = [{ code: 'bs', label: 'Bosanski' }, { code: 'en', label: 'English' }, { code: 'de', label: 'Deutsch' }]
export const content = { bs, en, de }
export const storageKey = 'bundicemir.language.v1'
export const isLanguage = (value) => Object.hasOwn(content, value)
export const resolveLanguage = (requested, saved) => isLanguage(requested) ? requested : isLanguage(saved) ? saved : 'bs'
export const ui = {
  bs: { menu: 'Meni', closeMenu: 'Zatvori meni', home: 'Emir Bundić — početna', navigation: 'Glavna navigacija', mobileNavigation: 'Mobilna navigacija', language: 'Jezik stranice', skip: 'Preskoči na sadržaj', more: 'Više o projektu', projectParts: 'Povezani dijelovi projekta', specialties: 'Područja rada', backHome: 'Povratak na početak', backTop: 'Na vrh', ssl: 'SSL certifikat' },
  en: { menu: 'Menu', closeMenu: 'Close menu', home: 'Emir Bundić — home', navigation: 'Main navigation', mobileNavigation: 'Mobile navigation', language: 'Website language', skip: 'Skip to content', more: 'More about the project', projectParts: 'Connected parts of the project', specialties: 'Areas of work', backHome: 'Back to home', backTop: 'Back to top', ssl: 'SSL certificate' },
  de: { menu: 'Menü', closeMenu: 'Menü schließen', home: 'Emir Bundić — Startseite', navigation: 'Hauptnavigation', mobileNavigation: 'Mobile Navigation', language: 'Sprache der Website', skip: 'Zum Inhalt springen', more: 'Mehr zum Projekt', projectParts: 'Verbundene Projektbestandteile', specialties: 'Arbeitsbereiche', backHome: 'Zur Startseite', backTop: 'Nach oben', ssl: 'SSL-Zertifikat' },
}
export const metadata = {
  bs: { title: 'Emir Bundić — Developer | bundicemir.com', description: 'Portfolio Emira Bundića. Razvoj FiveM skripti, web rješenja i povezanih sistema. Od ideje do funkcionalnog proizvoda.', locale: 'bs_BA' },
  en: { title: 'Emir Bundić — Developer | bundicemir.com', description: 'Emir Bundić’s portfolio. FiveM scripts, web solutions and connected systems. From an idea to a working product.', locale: 'en_US' },
  de: { title: 'Emir Bundić — Entwickler | bundicemir.com', description: 'Das Portfolio von Emir Bundić. FiveM-Skripte, Weblösungen und vernetzte Systeme. Von der Idee zum funktionierenden Produkt.', locale: 'de_DE' },
}
