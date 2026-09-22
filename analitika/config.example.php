<?php
// Kopiraj u config.php i popuni. config.php se NE commita.
return [
    // Lozinka za panel: php -r "echo password_hash('tvoja-lozinka', PASSWORD_DEFAULT);"
    'password_hash'   => '$2y$10$zamijeni-ovo',
    // Nasumičan string (32+ znakova), koristi se za hash IP adresa i sesije.
    'secret'          => 'zamijeni-ovo-nasumicnim-stringom',
    // Odakle sajt smije slati podatke (CORS).
    'allowed_origins' => ['https://bundicemir.com', 'https://www.bundicemir.com'],
    // Gdje se čuva SQLite baza: prvi folder u koji se može pisati. Prvi je izvan web root-a.
    'data_dirs'       => [__DIR__ . '/../analitika-data', __DIR__ . '/data'],
    'timezone'        => 'Europe/Sarajevo',
    // Država posjetioca preko ip-api.com (samo zemlja i grad se čuvaju, IP se ne čuva).
    'geo'             => true,
    'site'            => 'bundicemir.com',
];
