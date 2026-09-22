<?php
// Zajedničke funkcije: konfiguracija, baza, parsiranje UA, geo, pomoćne stvari.
declare(strict_types=1);

function cfg(): array
{
    static $cfg = null;
    if ($cfg === null) {
        $file = __DIR__ . '/config.php';
        if (!is_file($file)) {
            http_response_code(500);
            exit('Nedostaje config.php');
        }
        $cfg = require $file;
        date_default_timezone_set($cfg['timezone'] ?? 'UTC');
    }
    return $cfg;
}

function data_dir(): string
{
    static $dir = null;
    if ($dir !== null) {
        return $dir;
    }
    foreach (cfg()['data_dirs'] as $cand) {
        if (!is_dir($cand)) {
            @mkdir($cand, 0750, true);
        }
        if (is_dir($cand) && is_writable($cand)) {
            if (!is_file($cand . '/.htaccess')) {
                @file_put_contents($cand . '/.htaccess', "Require all denied\n");
            }
            return $dir = rtrim($cand, '/');
        }
    }
    http_response_code(500);
    exit('Nema foldera u koji se može pisati');
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }
    $pdo = new PDO('sqlite:' . data_dir() . '/analitika.sqlite', null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    $pdo->exec('PRAGMA journal_mode=WAL');
    $pdo->exec('PRAGMA busy_timeout=3000');
    $pdo->exec('PRAGMA synchronous=NORMAL');
    $pdo->exec('CREATE TABLE IF NOT EXISTS sessions (
        sid TEXT PRIMARY KEY,
        vid TEXT NOT NULL,
        started INTEGER NOT NULL,
        last_seen INTEGER NOT NULL,
        duration INTEGER NOT NULL DEFAULT 0,
        pageviews INTEGER NOT NULL DEFAULT 0,
        clicks INTEGER NOT NULL DEFAULT 0,
        events INTEGER NOT NULL DEFAULT 0,
        entry_path TEXT,
        referrer TEXT,
        ref_host TEXT,
        browser TEXT,
        os TEXT,
        device TEXT,
        screen TEXT,
        lang TEXT,
        tz TEXT,
        country TEXT,
        cc TEXT,
        city TEXT,
        ip_hash TEXT,
        bot INTEGER NOT NULL DEFAULT 0
    )');
    $pdo->exec('CREATE INDEX IF NOT EXISTS sessions_started ON sessions(started)');
    $pdo->exec('CREATE INDEX IF NOT EXISTS sessions_last_seen ON sessions(last_seen)');
    $pdo->exec('CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ts INTEGER NOT NULL,
        sid TEXT NOT NULL,
        vid TEXT NOT NULL,
        type TEXT NOT NULL,
        path TEXT,
        name TEXT,
        value TEXT,
        bot INTEGER NOT NULL DEFAULT 0
    )');
    $pdo->exec('CREATE INDEX IF NOT EXISTS events_ts ON events(ts)');
    $pdo->exec('CREATE INDEX IF NOT EXISTS events_type_ts ON events(type, ts)');
    $pdo->exec('CREATE INDEX IF NOT EXISTS events_sid ON events(sid)');
    $pdo->exec('CREATE TABLE IF NOT EXISTS geo (
        ip_hash TEXT PRIMARY KEY,
        country TEXT, cc TEXT, city TEXT, ts INTEGER NOT NULL
    )');
    $pdo->exec('CREATE TABLE IF NOT EXISTS logins (
        ip_hash TEXT PRIMARY KEY,
        fails INTEGER NOT NULL DEFAULT 0,
        last INTEGER NOT NULL
    )');
    return $pdo;
}

function client_ip(): string
{
    foreach (['HTTP_CF_CONNECTING_IP', 'HTTP_X_REAL_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'] as $k) {
        if (!empty($_SERVER[$k])) {
            $ip = trim(explode(',', $_SERVER[$k])[0]);
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }
    }
    return '0.0.0.0';
}

// Hash IP-a sa dnevnom soli: IP se nigdje ne čuva, a isti posjetilac u istom danu daje isti hash.
function ip_hash(string $ip, string $ua = ''): string
{
    return substr(hash('sha256', cfg()['secret'] . '|' . date('Y-m-d') . '|' . $ip . '|' . $ua), 0, 32);
}

function is_bot(string $ua): bool
{
    if ($ua === '') {
        return true;
    }
    return (bool) preg_match('~bot|crawl|spider|slurp|headless|lighthouse|pagespeed|pingdom|uptime|monitor|python|curl|wget|httpclient|java/|go-http|facebookexternalhit|preview|scan|validator|phantom|selenium|puppeteer|playwright~i', $ua);
}

function parse_ua(string $ua): array
{
    $browser = 'Ostalo';
    if (preg_match('~Edg(e|A|iOS)?/~', $ua)) $browser = 'Edge';
    elseif (preg_match('~OPR/|Opera~', $ua)) $browser = 'Opera';
    elseif (preg_match('~SamsungBrowser~', $ua)) $browser = 'Samsung';
    elseif (preg_match('~Firefox/|FxiOS~', $ua)) $browser = 'Firefox';
    elseif (preg_match('~CriOS|Chrome/~', $ua)) $browser = 'Chrome';
    elseif (preg_match('~Safari/~', $ua) && preg_match('~Version/~', $ua)) $browser = 'Safari';

    $os = 'Ostalo';
    if (preg_match('~Windows~', $ua)) $os = 'Windows';
    elseif (preg_match('~iPhone|iPad|iPod~', $ua)) $os = 'iOS';
    elseif (preg_match('~Android~', $ua)) $os = 'Android';
    elseif (preg_match('~Mac OS X|Macintosh~', $ua)) $os = 'macOS';
    elseif (preg_match('~CrOS~', $ua)) $os = 'ChromeOS';
    elseif (preg_match('~Linux~', $ua)) $os = 'Linux';

    $device = 'Desktop';
    if (preg_match('~iPad|Tablet|Tab~', $ua) || (preg_match('~Android~', $ua) && !preg_match('~Mobile~', $ua))) $device = 'Tablet';
    elseif (preg_match('~Mobi|iPhone|Android~', $ua)) $device = 'Mobilni';

    return [$browser, $os, $device];
}

function geo_lookup(string $iph, string $ip): array
{
    if (empty(cfg()['geo']) || $ip === '0.0.0.0' || !filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
        return [null, null, null];
    }
    $pdo = db();
    $st = $pdo->prepare('SELECT country, cc, city FROM geo WHERE ip_hash = ?');
    $st->execute([$iph]);
    if ($row = $st->fetch()) {
        return [$row['country'], $row['cc'], $row['city']];
    }
    $country = $cc = $city = null;
    $ctx = stream_context_create(['http' => ['timeout' => 1.5, 'ignore_errors' => true]]);
    $raw = @file_get_contents('http://ip-api.com/json/' . rawurlencode($ip) . '?fields=status,country,countryCode,city&lang=en', false, $ctx);
    if ($raw !== false) {
        $j = json_decode($raw, true);
        if (is_array($j) && ($j['status'] ?? '') === 'success') {
            $country = $j['country'] ?? null;
            $cc = $j['countryCode'] ?? null;
            $city = $j['city'] ?? null;
        }
    }
    $pdo->prepare('INSERT OR REPLACE INTO geo (ip_hash, country, cc, city, ts) VALUES (?,?,?,?,?)')
        ->execute([$iph, $country, $cc, $city, time()]);
    return [$country, $cc, $city];
}

function ref_host(?string $ref): ?string
{
    if (!$ref) {
        return null;
    }
    $h = strtolower((string) parse_url($ref, PHP_URL_HOST));
    if ($h === '') {
        return null;
    }
    $h = preg_replace('~^(www|m|l|lm)\.~', '', $h);
    if ($h === strtolower(cfg()['site'])) {
        return null;
    }
    $map = [
        'com.google.android.gm' => 'Gmail', 'com.google.android.googlequicksearchbox' => 'Google',
        'com.linkedin.android' => 'LinkedIn', 'com.instagram.android' => 'Instagram', 'com.facebook.katana' => 'Facebook',
    ];
    if (isset($map[$h])) return $map[$h];
    if (str_starts_with($h, 'android-app://')) return $h;
    $names = [
        'google.' => 'Google', 'bing.com' => 'Bing', 'duckduckgo.com' => 'DuckDuckGo', 'yahoo.' => 'Yahoo',
        't.co' => 'X / Twitter', 'twitter.com' => 'X / Twitter', 'x.com' => 'X / Twitter',
        'facebook.com' => 'Facebook', 'fb.com' => 'Facebook', 'instagram.com' => 'Instagram',
        'linkedin.com' => 'LinkedIn', 'lnkd.in' => 'LinkedIn', 'github.com' => 'GitHub',
        'discord.com' => 'Discord', 'discordapp.com' => 'Discord', 'reddit.com' => 'Reddit',
        'youtube.com' => 'YouTube', 'youtu.be' => 'YouTube', 'tiktok.com' => 'TikTok', 'whatsapp.com' => 'WhatsApp',
    ];
    foreach ($names as $k => $v) {
        if (str_contains($h, $k)) return $v;
    }
    return $h;
}

function clean(?string $s, int $max): ?string
{
    if ($s === null) return null;
    $s = trim(preg_replace('~[\x00-\x1F\x7F]~u', ' ', (string) $s));
    if ($s === '') return null;
    if (!mb_check_encoding($s, 'UTF-8')) $s = mb_convert_encoding($s, 'UTF-8', 'UTF-8');
    return mb_substr($s, 0, $max);
}

function json_out($data, int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function session_start_secure(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) return;
    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';
    session_set_cookie_params([
        'lifetime' => 0, 'path' => '/', 'secure' => $secure, 'httponly' => true, 'samesite' => 'Strict',
    ]);
    session_name('analitika');
    session_start();
}

function is_logged_in(): bool
{
    session_start_secure();
    return !empty($_SESSION['ok']) && ($_SESSION['exp'] ?? 0) > time();
}
