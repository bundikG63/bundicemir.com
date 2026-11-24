import * as bs from '../data/content.js'

const [tandemettle, letterpilot, faco, godzilla] = bs.work.items

export default {
  site: bs.site,
  nav: [
    { href: '#projekti', label: 'Projekte' },
    { href: '#o-meni', label: 'Über mich' },
    { href: '#kontakt', label: 'Kontakt' },
  ],
  hero: {
    line: 'Ich mache aus Ideen Code, der funktioniert.',
    text: 'Ich entwickle Webprodukte, Desktop-Apps und FiveM-Systeme. Unten stehen vier Projekte, drei davon kannst du sofort öffnen.',
    primary: 'Projekte ansehen',
    secondary: 'Schreib mir',
  },
  work: {
    title: 'Projekte',
    open: '{name} öffnen',
    items: [
      {
        ...tandemettle,
        headline: 'KI-Dienstleistungen für kleine Unternehmen in Deutschland.',
        text: 'Website und Werkzeuge eines Unternehmens, das KI in die Abläufe kleiner Teams bringt: Automatisierung, Kunden-Chatbot und Beratung.',
        facts: [
          'Ein Zeitersparnis-Rechner, der Eingaben weder speichert noch sendet',
          'Ein Chat-Assistent, der aus den veröffentlichten Leistungen und FAQ antwortet',
          'Serviceanfrage und PDF-Leistungsübersicht an einem Ort',
        ],
      },
      {
        ...letterpilot,
        headline: 'Behördenbriefe, in einfacher Sprache erklärt.',
        text: 'Du lädst ein PDF oder ein Foto des Briefs hoch und bekommst eine Erklärung in deiner Sprache und einen formellen Antwortentwurf auf Deutsch als A4-PDF.',
        facts: [
          'Jede Frist und jeder Betrag zeigt die Stelle im Brief, aus der sie stammen',
          'Erklärungen auf Deutsch, Englisch, Bosnisch, Kroatisch, Serbisch und Türkisch',
          'Zwei Dokumente kostenlos, danach Pakete oder ein Monatsabo',
        ],
      },
      {
        ...faco,
        headline: 'Ein persönlicher KI-Assistent für Windows.',
        text: 'Eine Desktop-App, die mit dir spricht, Aufgaben führt und mit Dateien auf dem Rechner arbeitet, mit einem Cloud-Modell oder vollständig lokal.',
        facts: [
          'Jede Änderung auf der Festplatte und jeder Befehl wartet auf deine Bestätigung',
          'Läuft mit Anthropic, OpenAI-kompatiblen Diensten und lokalen Modellen über Ollama',
          'API-Schlüssel bleiben in der Windows-Anmeldeinformationsverwaltung',
        ],
      },
      {
        ...godzilla,
        headline: 'Ein FiveM-Roleplay-Server mit eigenen Systemen.',
        text: 'Eigene Skripte, ein Launcher und eine Website, die mit dem Server verbunden sind. Die Systeme wurden für diese Community geschrieben, nicht gekauft und eingefügt.',
        credits: [
          { label: 'Polizei', items: ['MDT', 'Forensik', 'Leitstelle', 'SEK-Einheit'] },
          { label: 'Jobs', items: ['Lkw-Fahrer', 'Taxi', 'Baggerfahrer', 'Bergmann', 'Abschleppdienst', 'Fischer'] },
          { label: 'Kriminalität', items: ['Juwelierraub', 'Geldtransporter', 'Kleine Überfälle', 'Chop Shop'] },
          { label: 'Stadt', items: ['Wohnungen und Tresore', 'Krankenhaus und Rettung', 'Fight Club', 'Dokumente'] },
          { label: 'Serverteam', items: ['Adminsystem', 'Anticheat', 'Launcher', 'Web und Server'] },
        ],
      },
    ],
  },
  about: {
    title: 'Über mich',
    large: 'Mich begeistert besonders der Moment, in dem aus einer Idee etwas wird, das Menschen tatsächlich nutzen können.',
    paragraphs: [
      'Ich entwickle Webprodukte, Desktop-Apps und eigene FiveM-Skripte. Bei jedem Projekt gehe ich den ganzen Weg: von der ersten Skizze bis zur Version, die veröffentlicht ist und läuft.',
      'Ich möchte das gesamte Problem verstehen: was die Nutzer brauchen, wie das System funktionieren soll und wie sich seine Bestandteile sinnvoll verbinden lassen.',
    ],
    toolsTitle: 'Womit ich arbeite',
    tools: [
      { label: 'Web', items: 'JavaScript, TypeScript, React, Next.js, HTML und CSS' },
      { label: 'Desktop', items: 'Tauri, Rust' },
      { label: 'Daten', items: 'SQL, SQLite, Supabase' },
      { label: 'Spiele', items: 'Lua, FiveM' },
      { label: 'Integrationen', items: 'API-Integrationen, Stripe, Discord-Webhooks' },
    ],
    servicesTitle: 'Was ich bauen kann',
    services: [
      { title: 'Webprodukte', text: 'Von der Präsentationsseite bis zur App mit Anmeldung, Bezahlung und Datenbank.' },
      { title: 'Desktop-Apps', text: 'Windows-Programme mit eigener Oberfläche, lokaler Datenbank und sicherer Schlüsselablage.' },
      { title: 'FiveM-Systeme', text: 'Eigene Skripte, Gameplay-Systeme und Werkzeuge für das Team, das den Server betreibt.' },
      { title: 'Vernetzte Systeme', text: 'Website, Server, Launcher und externe Dienste in einem gemeinsamen Ablauf.' },
    ],
  },
  contact: {
    title: 'Du hast eine Idee?',
    text: 'Schreib mir, was du baust und wo du feststeckst.',
    email: 'E-Mail senden',
    github: 'GitHub-Profil',
  },
  footer: { top: 'Nach oben' },
}
