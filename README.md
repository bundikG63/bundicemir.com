# Emir Bundić — portfolio (bundicemir.com)

React + Vite portfolio sa 3D hero scenom (react-three-fiber), parallax efektima i animiranom pozadinom (Framer Motion + canvas). Sadržaj je dostupan na bosanskom, engleskom i njemačkom jeziku. Bosanski sadržaj je u `src/data/content.js`, a prevodi u `src/i18n/en.js` i `src/i18n/de.js`.

## Pokretanje lokalno

```bash
npm install --legacy-peer-deps
npm run dev        # razvojni server, http://localhost:5173
npm run build      # produkcijski build u folder dist/
npm run preview    # pregled builda, http://localhost:4173
```

## Struktura

- `src/data/content.js` — svi tekstovi (naslovi, projekti, vještine, kontakt). Ovdje mijenjaš sadržaj.
- `src/components/` — sekcije stranice (Hero, Projects, About, Skills, Services, Contact, Footer) i pomoćne komponente:
  - `Background.jsx` — animirana aurora pozadina + mreža čestica koja prati miš.
  - `Hero3D.jsx` — 3D scena (sfera, wireframe, prstenovi, iskre). Učitava se lijeno.
  - `TiltCard.jsx` — kartica sa 3D nagibom prema mišu.
  - `Reveal.jsx` — animacija pojavljivanja pri skrolanju.
- `src/styles/global.css` — boje (CSS varijable), tipografija, dugmad.
- `public/.htaccess` — Apache konfiguracija za host (HTTPS redirect, keširanje, kompresija).
- `legacy/` — stari statički sajt, samo kao referenca. Može se obrisati.

## Deploy na checkdomain hosting

1. `npm run build` — generiše folder `dist/`.
2. Poveži se na hosting FTP/SFTP nalogom (podaci su u checkdomain kontrolnom panelu pod Webhosting → FTP).
3. Obriši stari sadržaj web root foldera (obično `httpdocs`, `html` ili `public_html`).
4. Uploaduj **sadržaj** foldera `dist/` (ne sam folder) u web root: `index.html`, `favicon.svg`, `.htaccess` i folder `assets/`.
5. Provjeri https://bundicemir.com. Ako se vidi stara verzija, isprazni keš u browseru (Ctrl+F5).

Fajl `.htaccess` je skriven; u FTP klijentu uključi prikaz skrivenih fajlova.

## DNS

Ako domena trenutno pokazuje na GitHub Pages (A zapisi 185.199.108–111.153), u checkdomain DNS postavkama promijeni A zapis za `@` i CNAME za `www` na vrijednosti checkdomain webhostinga. Nakon toga u GitHub repou obriši `CNAME` fajl i isključi GitHub Pages da ne bi bilo duplog sajta.

## Animacije i pristupačnost

Sve animacije poštuju `prefers-reduced-motion`: korisnici sa uključenom opcijom "smanji pokrete" vide statičnu verziju.

## Jezici (BS / EN / DE)

Izbor jezika je uvijek dostupan u zaglavlju, uključujući mobilni prikaz. Prevodi obuhvataju sve javne sekcije portfolija, proširene opise projekata, dugmad, oznake pristupačnosti i metapodatke. Tehnički nazivi, brendovi, adrese i identifikatori sekcija ostaju stabilni.

- Direktni linkovi: `/?lang=bs`, `/?lang=en`, `/?lang=de`. Postojeći hash i ostali query parametri se čuvaju.
- Prioritet: podržani jezik u URL-u → sačuvani izbor → bosanski.
- Izbor se pamti lokalno pod `bundicemir.language.v1`; bez dostupnog localStorage prebacivanje i dalje radi.
- Browser Back/Forward vraća prethodni izbor jezika.
- `src/i18n/locales.js` sadrži kratke UI tekstove i SEO opise; `LanguageProvider.jsx` upravlja stanjem.
- Nakon izmjene pokreni postojeći build i objavi novi sadržaj `dist/` na svom hostingu. Prevod se primjenjuje na javni portfolio; zaseban administratorski panel `analitika/` nije mijenjan.
