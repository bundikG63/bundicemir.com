<?php
// Kolektor: prima događaje sa sajta (POST JSON preko sendBeacon/fetch).
declare(strict_types=1);
require __DIR__ . '/lib.php';

$cfg = cfg();
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = in_array($origin, $cfg['allowed_origins'], true);
if ($origin !== '' && !$allowed) {
    http_response_code(403);
    exit;
}
if ($allowed) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400');
}
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$raw = file_get_contents('php://input', false, null, 0, 16384);
$in = json_decode((string) $raw, true);
if (!is_array($in) || empty($in['sid']) || empty($in['vid']) || empty($in['ev']) || !is_array($in['ev'])) {
    http_response_code(400);
    exit;
}

$sid = preg_replace('~[^a-zA-Z0-9_-]~', '', (string) $in['sid']);
$vid = preg_replace('~[^a-zA-Z0-9_-]~', '', (string) $in['vid']);
if (strlen($sid) < 8 || strlen($sid) > 64 || strlen($vid) < 8 || strlen($vid) > 64) {
    http_response_code(400);
    exit;
}

$ua = substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 400);
$ip = client_ip();
$iph = ip_hash($ip, $ua);
$bot = is_bot($ua) ? 1 : 0;
$now = time();
$ctx = is_array($in['ctx'] ?? null) ? $in['ctx'] : [];

$pdo = db();
$pdo->beginTransaction();
try {
    $st = $pdo->prepare('SELECT * FROM sessions WHERE sid = ?');
    $st->execute([$sid]);
    $sess = $st->fetch();

    if (!$sess) {
        [$browser, $os, $device] = parse_ua($ua);
        [$country, $cc, $city] = $bot ? [null, null, null] : geo_lookup($iph, $ip);
        $referrer = clean($ctx['r'] ?? null, 500);
        $firstPath = null;
        foreach ($in['ev'] as $e) {
            if (($e['t'] ?? '') === 'pageview') { $firstPath = clean($e['p'] ?? null, 200); break; }
        }
        $screen = null;
        if (!empty($ctx['sw']) && !empty($ctx['sh'])) {
            $screen = (int) $ctx['sw'] . 'x' . (int) $ctx['sh'];
        }
        $pdo->prepare('INSERT INTO sessions (sid, vid, started, last_seen, entry_path, referrer, ref_host, browser, os, device, screen, lang, tz, country, cc, city, ip_hash, bot)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
            ->execute([$sid, $vid, $now, $now, $firstPath, $referrer, ref_host($referrer), $browser, $os, $device, $screen,
                clean($ctx['l'] ?? null, 16), clean($ctx['tz'] ?? null, 64), $country, $cc, $city, $iph, $bot]);
        $sess = ['events' => 0, 'pageviews' => 0, 'clicks' => 0, 'started' => $now, 'bot' => $bot];
    }

    if ((int) $sess['events'] > 500) {
        $pdo->commit();
        http_response_code(204);
        exit;
    }

    $ins = $pdo->prepare('INSERT INTO events (ts, sid, vid, type, path, name, value, bot) VALUES (?,?,?,?,?,?,?,?)');
    $types = ['pageview' => 1, 'click' => 1, 'scroll' => 1, 'section' => 1, 'leave' => 1, 'outbound' => 1];
    $pv = 0; $clicks = 0; $n = 0; $duration = null;
    foreach (array_slice($in['ev'], 0, 50) as $e) {
        if (!is_array($e)) continue;
        $t = (string) ($e['t'] ?? '');
        if ($t === 'ping') continue;
        if (!isset($types[$t])) continue;
        $path = clean($e['p'] ?? null, 200);
        $name = clean($e['n'] ?? null, 120);
        $value = clean(isset($e['v']) ? (string) $e['v'] : null, 300);
        if ($t === 'leave') {
            $d = (int) ($e['v'] ?? 0);
            if ($d > 0) $duration = min($d, 6 * 3600);
            continue; // trajanje ide u sesiju, ne u events
        }
        $ins->execute([$now, $sid, $vid, $t, $path, $name, $value, (int) $sess['bot']]);
        $n++;
        if ($t === 'pageview') $pv++;
        if ($t === 'click' || $t === 'outbound') $clicks++;
    }

    $sql = 'UPDATE sessions SET last_seen = ?, events = events + ?, pageviews = pageviews + ?, clicks = clicks + ?';
    $params = [$now, $n, $pv, $clicks];
    if ($duration !== null) {
        $sql .= ', duration = MAX(duration, ?)';
        $params[] = $duration;
    } else {
        $sql .= ', duration = MAX(duration, ? - started)';
        $params[] = $now;
    }
    $sql .= ' WHERE sid = ?';
    $params[] = $sid;
    $pdo->prepare($sql)->execute($params);
    $pdo->commit();
} catch (Throwable $ex) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    error_log('analitika: ' . $ex->getMessage());
    http_response_code(500);
    exit;
}
http_response_code(204);
