// Bosanski je izvorni jezik. Prevodi: src/i18n/en.js i src/i18n/de.js.

export const site = {
  name: 'Emir Bundić',
  domain: 'bundicemir.com',
  github: 'https://github.com/bundikG63',
  email: 'bundicemir@outlook.com',
}

export const nav = [
  { href: '#projekti', label: 'Projekti' },
  { href: '#o-meni', label: 'O meni' },
  { href: '#kontakt', label: 'Kontakt' },
]

export const hero = {
  line: 'Ideje pretvaram u kod koji radi.',
  text: 'Pravim web proizvode, desktop aplikacije i FiveM sisteme. Ispod su četiri projekta, a tri možeš otvoriti odmah.',
  primary: 'Pogledaj projekte',
  secondary: 'Piši mi',
}

export const work = {
  title: 'Projekti',
  open: 'Otvori {name}',
  items: [
    {
      id: 'tandemettle',
      name: 'Tandemettle',
      headline: 'AI usluge za male firme u Njemačkoj.',
      text: 'Stranica i alati firme koja malim timovima uvodi AI u poslove koje već rade: automatizaciju, chatbot za kupce i savjetovanje.',
      facts: [
        'Kalkulator uštede vremena koji unos ne sprema i ne šalje',
        'Chat asistent koji odgovara iz objavljenih usluga i čestih pitanja',
        'Zahtjev za uslugu i PDF pregled usluga na jednom mjestu',
      ],
      url: 'https://tandemettle-99cjxk.polsia.io/',
      host: 'tandemettle-99cjxk.polsia.io',
    },
    {
      id: 'letterpilot',
      name: 'LetterPilot AI',
      headline: 'Službena pisma, objašnjena jednostavnim jezikom.',
      text: 'Učitaš PDF ili fotografiju pisma, dobiješ objašnjenje na svom jeziku i nacrt formalnog odgovora na njemačkom kao A4 PDF.',
      facts: [
        'Svaki rok i iznos pokazuje odlomak pisma iz kojeg dolazi',
        'Objašnjenja na njemačkom, engleskom, bosanskom, hrvatskom, srpskom i turskom',
        'Dva dokumenta besplatno, zatim paketi ili mjesečna pretplata',
      ],
      stack: 'Next.js, Supabase, Stripe, Cloudflare Workers',
      url: 'https://staging.letterpilotai.com/en',
      host: 'staging.letterpilotai.com',
    },
    {
      id: 'faco',
      name: 'FAĆO',
      headline: 'Osobni AI asistent za Windows.',
      text: 'Desktop aplikacija koja razgovara, vodi zadatke i radi s datotekama na računaru, s modelom u oblaku ili potpuno lokalno.',
      facts: [
        'Svaka izmjena na disku i svaka naredba čeka tvoju potvrdu',
        'Radi s Anthropicom, OpenAI-kompatibilnim servisima i lokalnim modelima preko Ollame',
        'API ključevi ostaju u Windows Credential Manageru',
      ],
      stack: 'Tauri 2, React, TypeScript, Rust, SQLite',
    },
    {
      id: 'godzilla',
      name: 'Godzilla',
      headline: 'FiveM roleplay server s vlastitim sistemima.',
      text: 'Custom skripte, launcher i web povezani sa serverom. Sistemi su pisani za ovu zajednicu, a ne kupljeni i zalijepljeni.',
      stack: 'Lua, JavaScript, SQL, FiveM',
      credits: [
        { label: 'Policija', items: ['MDT', 'Forenzika', 'Dispatch', 'SEK jedinica'] },
        { label: 'Poslovi', items: ['Kamiondžija', 'Taxi', 'Bagerista', 'Rudar', 'Šlep služba', 'Ribar'] },
        { label: 'Kriminal', items: ['Pljačka zlatare', 'Oklopno vozilo', 'Mini pljačke', 'Chop shop'] },
        { label: 'Grad', items: ['Stanovi i sefovi', 'Bolnica i hitna', 'Fight Club', 'Dokumenti'] },
        { label: 'Tim servera', items: ['Admin sistem', 'Anticheat', 'Launcher', 'Web i server'] },
      ],
    },
  ],
}

export const about = {
  title: 'O meni',
  large: 'Najviše me zanima trenutak kada ideja postane nešto što ljudi mogu stvarno koristiti.',
  paragraphs: [
    'Radim web proizvode, desktop aplikacije i custom FiveM skripte. Na svakom projektu prolazim cijeli put: od prve skice do verzije koja je objavljena i radi.',
    'Volim razumjeti cijeli problem: šta korisnik treba, kako sistem treba funkcionisati i kako njegove dijelove povezati u smislenu cjelinu.',
  ],
  toolsTitle: 'Čime radim',
  tools: [
    { label: 'Web', items: 'JavaScript, TypeScript, React, Next.js, HTML i CSS' },
    { label: 'Desktop', items: 'Tauri, Rust' },
    { label: 'Podaci', items: 'SQL, SQLite, Supabase' },
    { label: 'Igre', items: 'Lua, FiveM' },
    { label: 'Povezivanje', items: 'API integracije, Stripe, Discord webhookovi' },
  ],
  servicesTitle: 'Šta mogu napraviti',
  services: [
    { title: 'Web proizvodi', text: 'Od prezentacijske stranice do aplikacije s prijavom, plaćanjem i bazom podataka.' },
    { title: 'Desktop aplikacije', text: 'Windows programi s vlastitim sučeljem, lokalnom bazom i sigurnim čuvanjem ključeva.' },
    { title: 'FiveM sistemi', text: 'Custom skripte, gameplay sistemi i alati za tim koji vodi server.' },
    { title: 'Povezivanje sistema', text: 'Web, server, launcher i vanjski servisi spojeni u jedan tok rada.' },
  ],
}

export const contact = {
  title: 'Imaš ideju?',
  text: 'Napiši mi šta gradiš i gdje si zapeo.',
  email: 'Pošalji email',
  github: 'GitHub profil',
}

export const footer = {
  top: 'Na vrh',
}
