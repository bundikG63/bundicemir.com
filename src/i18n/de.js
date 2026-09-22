import * as bs from '../data/content.js'
export default {
  site: bs.site,
  nav: [{ href: '#projekti', label: 'Projekte' }, { href: '#o-meni', label: 'Über mich' }, { href: '#vjestine', label: 'Kenntnisse' }],
  hero: {
    ...bs.hero,
    titleA: 'Ich verwandle Ideen', titleB: 'in', titleAccent: 'Code, der funktioniert.',
    text: 'Ich entwickle individuelle FiveM-Skripte, Weblösungen und Systeme, die alles zu einem funktionierenden Ganzen verbinden.',
    primary: 'Meine Arbeit entdecken', secondary: 'Mein GitHub', scroll: 'PORTFOLIO ENTDECKEN', caption: ['EMIR BUNDIĆ', 'ENTWICKLER'],
  },
  specialties: ['Individuelle Entwicklung', 'FiveM-Systeme', 'Web-Erlebnisse', 'API-Integrationen'],
  projects: {
    eyebrow: '01 / AUSGEWÄHLTE ARBEITEN', title: 'Vom Code zum', titleAccent: 'Erlebnis.',
    lead: 'Projekte, an denen ich im Rahmen von Godzilla Development gearbeitet habe.',
    featured: {
      ...bs.projects.featured,
      number: 'PROJEKT / 001', sub: 'VERNETZTE ROLEPLAY-SYSTEME', map: ['WEBSITE', 'SERVER', 'LAUNCHER'],
      tags: ['FiveM', 'Web', 'Integrationen'], title: 'Ein Server. Ein vernetztes Ökosystem.',
      text: 'Entwicklung eines individuellen Launchers und Anbindung einer Website an einen FiveM-Server. Systeme, die Spielern und dem Team den Zugang zur Community und ihren Funktionen erleichtern.',
      more: 'Die Arbeit umfasst einen Launcher für den Serverzugang, die Verbindung von Website und Server sowie die Integration eines Nachrichtensystems. Im Mittelpunkt steht das Zusammenspiel der einzelnen Komponenten.',
    },
    list: [
      {
        ...bs.projects.list[0], label: '02 / GAMEPLAY-SYSTEME', title: 'Polizeisysteme mit mehr Tiefe.',
        text: 'Individuelle Polizeiskripte mit Forensik und MDT für ein strukturierteres Roleplay-Erlebnis und die Zusammenarbeit der Polizeiteams.',
        tags: ['FiveM', 'MDT', 'Forensik'],
        more: 'Polizeifunktionen als Gesamtsystem: digitale Aktenführung über das MDT und forensische Elemente, die neue Möglichkeiten für Ermittlungen im Roleplay schaffen.',
      },
      {
        ...bs.projects.list[1], label: '03 / INDIVIDUELLE SKRIPTE', title: 'Jobs, die die Stadt am Laufen halten.',
        text: 'Skripte für Lkw-Fahrer, Taxiunternehmen, Baggerfahrer, Bergleute und Abschleppdienste sowie ein individuelles Adminsystem für das Serverteam.',
        tags: ['Gameplay', 'Jobs', 'Adminwerkzeuge'],
        more: 'Entwicklung verschiedener Gameplay-Abläufe, die auf die Community zugeschnitten sind. Verwaltungswerkzeuge unterstützen die tägliche Arbeit des Teams, das den Server betreibt.',
      },
    ],
  },
  about: {
    ...bs.about, eyebrow: '02 / HINTER DEM CODE', role: 'Entwickler. Gestalter. Problemlöser.', githubLabel: 'Mein GitHub',
    large: 'Mich begeistert besonders der Moment, in dem aus einer Idee etwas wird, das Menschen tatsächlich nutzen können.',
    paragraphs: [
      'Meine Arbeit verbindet Webentwicklung, individuelle FiveM-Skripte und Integrationen. Bei Godzilla Development entwickle ich Funktionen, die das Spielerlebnis mit Werkzeugen zur Verwaltung der Community verbinden.',
      'Ich möchte das gesamte Problem verstehen: was die Nutzer brauchen, wie das System funktionieren soll und wie sich seine Bestandteile sinnvoll verbinden lassen.',
    ],
    skills: ['Lua', 'JavaScript', 'HTML & CSS', 'SQL', 'FiveM', 'API-Integrationen'], skillsLink: 'Meine Kenntnisse entdecken',
  },
  skills: {
    eyebrow: '03 / ENTWICKLUNGSKENNTNISSE', title: 'Das Wissen hinter jedem', titleAccent: 'Projekt.',
    list: [
      { ...bs.skills.list[0], label: 'SPIELEENTWICKLUNG', text: 'Entwicklung und Anpassung von Skripten für Roleplay-Server: von Jobs und Interaktionen bis hin zu Polizeifunktionen und Adminwerkzeugen.', tags: ['Lua', 'FiveM', 'Gameplay-Logik'] },
      { ...bs.skills.list[1], label: 'WEBENTWICKLUNG', text: 'Entwicklung von Weboberflächen und interaktiven Funktionen, die Nutzern den Server und seine Inhalte näherbringen.' },
      { ...bs.skills.list[2], label: 'DATEN & SYSTEME', title: 'SQL & Datenbanken', text: 'Arbeit mit Daten und SQL-Abfragen für Serverskripte sowie Anpassung der Datenbankstruktur an die Anforderungen einzelner Funktionen.', tags: ['SQL', 'Datenbanken', 'Serverdaten'] },
      { ...bs.skills.list[3], label: 'INTEGRATIONEN', title: 'Web, Server & Launcher', text: 'Verknüpfung von Website, FiveM-Server und individuellem Launcher sowie API-Integrationen und Discord-Webhooks für Benachrichtigungen.', tags: ['API-Integrationen', 'Discord-Webhooks', 'Individueller Launcher'] },
    ],
  },
  services: {
    eyebrow: '04 / WAS ICH ENTWICKLE', title: 'Deine Idee. Meine nächste Herausforderung.',
    list: [
      { title: 'Weblösungen', text: 'Portfolio-Websites, Präsentationsseiten und Weboberflächen, die auf den Zweck des Projekts zugeschnitten sind.' },
      { title: 'FiveM-Entwicklung', text: 'Individuelle Skripte, Gameplay-Systeme und Werkzeuge zur Serververwaltung.' },
      { title: 'Systemintegration', text: 'Verbindung von Websites, Servern und weiteren Werkzeugen zu einem gemeinsamen Arbeitsablauf.' },
    ],
  },
  contact: { eyebrow: '05 / DAS NÄCHSTE PROJEKT', title: 'Du hast eine Idee?', titleAccent: 'Lass sie uns umsetzen.', text: 'Besuche mein GitHub-Profil und lass uns über das nächste Projekt sprechen.', button: 'Finde mich auf GitHub', navLabel: 'Kontakt' },
}
