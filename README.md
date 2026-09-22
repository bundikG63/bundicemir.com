# Emir Bundić — portfolio

Responsive portfolio za **bundicemir.com**. Čisti HTML, CSS i JavaScript, bez instalacije paketa ili build koraka. Sadržaj je na bosanskom jeziku.

## Lokalni pregled

Otvori `index.html` u browseru ili u ovom folderu pokreni `python3 -m http.server 8000`, pa otvori http://localhost:8000.

## GitHub Pages

1. Kreiraj javni GitHub repozitorij `bundicemir.com` na računu `bundikG63`.
2. Postavi sadržaj ovog foldera direktno u root repozitorija (ne cijeli ZIP).
3. Otvori **Settings → Pages → Build and deployment**.
4. Izaberi **Deploy from a branch**, granu **main**, folder **/(root)**, zatim **Save**.
5. U **Custom domain** upiši `bundicemir.com`. Fajl `CNAME` već sadrži tu domenu.
6. Poveži DNS prema tabeli ispod i uključi **Enforce HTTPS** kada certifikat bude spreman.

Ako želiš prvo koristiti GitHub adresu bez vlastite domene, ukloni `CNAME` i postavku Custom domain, te privremeno prilagodi canonical i og:url u index.html.

## Domena i DNS

Domena nije kupljena niti registrovana ovim kodom. Mora biti u tvom vlasništvu. Prvo dodaj domenu u GitHub Pages postavkama, zatim podesi DNS kod svog registrara.

| Tip | Naziv | Vrijednost |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | bundikG63.github.io |

DNS promjene mogu trebati do 24 sata. GitHub preporučuje i verifikaciju vlasništva domene kroz profil Settings → Pages; TXT vrijednost preuzmi iz svog računa.

Službena dokumentacija: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

## Uređivanje

- `index.html`: tekst, projekti, kontakt i SEO metapodaci.
- `styles.css`: boje, raspored i prilagodba mobilnim uređajima.
- `script.js`: automatska godina u footeru.
- `CNAME`: željena domena.
- `.nojekyll`: objavljivanje statičkih fajlova bez Jekylla.

Kontakt je link na potvrđeni GitHub profil. Privatni e-mail nije javno objavljen. Dodaj željeni poslovni kontakt kada ga odabereš. Opisi predstavljaju rad u okviru Godzilla Developmenta, bez izmišljenih statistika, klijenata ili recenzija. Nema analitike, kolačića, vanjskih fontova niti formulara koji simulira slanje.
