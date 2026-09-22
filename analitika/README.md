# Vlastita analitika za bundicemir.com

Mali PHP kolektor + panel, bez kolačića i bez vanjskih servisa. Podaci idu u SQLite.

- `c.php` – kolektor, prima događaje sa sajta (tracker je u `src/lib/analitika.js`).
- `api.php` – agregirana statistika za panel (traži prijavu).
- `index.php` – panel (prijava lozinkom).
- `config.php` – lokalna konfiguracija, **ne commita se** (vidi `config.example.php`).

## Deploy

Hostuje se na poddomeni `analitika.bundicemir.com` (Plesk, checkdomain). Upload cijelog foldera
u document root poddomene, plus `config.php`. Baza se sama kreira u `../analitika-data/`
(izvan web root-a) ili u `data/` ako to nije moguće.

Nova lozinka za panel: `php -r "echo password_hash('lozinka', PASSWORD_DEFAULT);"` i upiši hash u `config.php`.

## Isključi vlastite posjete

Otvori `https://bundicemir.com/?_noanalitika` jednom u browseru; `?_analitika` ponovo uključuje.
