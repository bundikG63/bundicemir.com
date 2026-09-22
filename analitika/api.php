<?php
// API za panel: agregirana statistika u JSON-u. Traži prijavu.
declare(strict_types=1);
require __DIR__ . '/lib.php';
cfg();
if (!is_logged_in()) {
    json_out(['error' => 'unauthorized'], 401);
}
header('X-Content-Type-Options: nosniff');

$pdo = db();
$tz = new DateTimeZone(cfg()['timezone']);
$now = new DateTimeImmutable('now', $tz);
$range = $_GET['range'] ?? '7d';

$end = $now->setTime(23, 59, 59);
switch ($range) {
    case 'today':
        $start = $now->setTime(0, 0, 0);
        break;
    case 'yesterday':
        $start = $now->modify('-1 day')->setTime(0, 0, 0);
        $end = $start->setTime(23, 59, 59);
        break;
    case '30d':
        $start = $now->modify('-29 days')->setTime(0, 0, 0);
        break;
    case '90d':
        $start = $now->modify('-89 days')->setTime(0, 0, 0);
        break;
    case '365d':
        $start = $now->modify('-364 days')->setTime(0, 0, 0);
        break;
    case 'custom':
        $f = DateTimeImmutable::createFromFormat('Y-m-d', (string) ($_GET['from'] ?? ''), $tz);
        $t = DateTimeImmutable::createFromFormat('Y-m-d', (string) ($_GET['to'] ?? ''), $tz);
        if (!$f || !$t) json_out(['error' => 'bad range'], 400);
        if ($t < $f) [$f, $t] = [$t, $f];
        $start = $f->setTime(0, 0, 0);
        $end = min($t->setTime(23, 59, 59), $now->setTime(23, 59, 59));
        break;
    case '7d':
    default:
        $range = '7d';
        $start = $now->modify('-6 days')->setTime(0, 0, 0);
}

$s = $start->getTimestamp();
$e = $end->getTimestamp();
$len = $e - $s + 1;
$ps = $s - $len; // prethodni period za poređenje
$pe = $s - 1;
$days = (int) ceil($len / 86400);
$hourly = $days <= 2;
$offset = $tz->getOffset($now); // sekunde; SQLite grupiše po lokalnom vremenu
$bucketFmt = $hourly ? '%Y-%m-%d %H:00' : '%Y-%m-%d';

function q(PDO $pdo, string $sql, array $p = []): array
{
    $st = $pdo->prepare($sql);
    $st->execute($p);
    return $st->fetchAll();
}
function one(PDO $pdo, string $sql, array $p = [])
{
    $st = $pdo->prepare($sql);
    $st->execute($p);
    return $st->fetchColumn();
}

function kpis(PDO $pdo, int $s, int $e): array
{
    $visits = (int) one($pdo, 'SELECT COUNT(*) FROM sessions WHERE bot=0 AND started BETWEEN ? AND ?', [$s, $e]);
    $visitors = (int) one($pdo, 'SELECT COUNT(DISTINCT vid) FROM sessions WHERE bot=0 AND started BETWEEN ? AND ?', [$s, $e]);
    $pageviews = (int) one($pdo, "SELECT COUNT(*) FROM events WHERE bot=0 AND type='pageview' AND ts BETWEEN ? AND ?", [$s, $e]);
    $clicks = (int) one($pdo, "SELECT COUNT(*) FROM events WHERE bot=0 AND type IN ('click','outbound') AND ts BETWEEN ? AND ?", [$s, $e]);
    $avg = (float) (one($pdo, 'SELECT AVG(duration) FROM sessions WHERE bot=0 AND started BETWEEN ? AND ?', [$s, $e]) ?: 0);
    $bounced = (int) one($pdo, 'SELECT COUNT(*) FROM sessions WHERE bot=0 AND started BETWEEN ? AND ? AND pageviews <= 1 AND clicks = 0 AND duration < 10', [$s, $e]);
    return [
        'visits' => $visits,
        'visitors' => $visitors,
        'pageviews' => $pageviews,
        'clicks' => $clicks,
        'avg_duration' => (int) round($avg),
        'bounce' => $visits ? round($bounced / $visits * 100, 1) : 0,
    ];
}

$cur = kpis($pdo, $s, $e);
$prev = kpis($pdo, $ps, $pe);

// Serija po danu / satu
$series = q($pdo, "SELECT strftime('$bucketFmt', ts + ?, 'unixepoch') AS b,
        COUNT(DISTINCT sid) AS visits, COUNT(*) AS pageviews
    FROM events WHERE bot=0 AND type='pageview' AND ts BETWEEN ? AND ? GROUP BY b ORDER BY b", [$offset, $s, $e]);
$map = [];
foreach ($series as $r) $map[$r['b']] = $r;
$buckets = [];
$cursor = $start;
$step = $hourly ? '+1 hour' : '+1 day';
while ($cursor <= $end) {
    $key = $cursor->format($hourly ? 'Y-m-d H:00' : 'Y-m-d');
    $buckets[] = [
        'b' => $key,
        'label' => $hourly ? $cursor->format('d.m. H:i') : $cursor->format('d.m.'),
        'visits' => (int) ($map[$key]['visits'] ?? 0),
        'pageviews' => (int) ($map[$key]['pageviews'] ?? 0),
    ];
    $cursor = $cursor->modify($step);
    if (count($buckets) > 400) break;
}

// Posjete po satu u danu
$byHour = array_fill(0, 24, 0);
foreach (q($pdo, "SELECT CAST(strftime('%H', started + ?, 'unixepoch') AS INTEGER) AS h, COUNT(*) AS c
    FROM sessions WHERE bot=0 AND started BETWEEN ? AND ? GROUP BY h", [$offset, $s, $e]) as $r) {
    $byHour[(int) $r['h']] = (int) $r['c'];
}
// Posjete po danu u sedmici (0 = nedjelja)
$byDow = array_fill(0, 7, 0);
foreach (q($pdo, "SELECT CAST(strftime('%w', started + ?, 'unixepoch') AS INTEGER) AS d, COUNT(*) AS c
    FROM sessions WHERE bot=0 AND started BETWEEN ? AND ? GROUP BY d", [$offset, $s, $e]) as $r) {
    $byDow[(int) $r['d']] = (int) $r['c'];
}

$top = fn(string $sql, array $p = []) => q($pdo, $sql, $p);

$pages = $top("SELECT COALESCE(path,'/') AS k, COUNT(*) AS c, COUNT(DISTINCT sid) AS u FROM events
    WHERE bot=0 AND type='pageview' AND ts BETWEEN ? AND ? GROUP BY k ORDER BY c DESC LIMIT 15", [$s, $e]);
$sections = $top("SELECT name AS k, COUNT(DISTINCT sid) AS c FROM events
    WHERE bot=0 AND type='section' AND ts BETWEEN ? AND ? GROUP BY k ORDER BY c DESC LIMIT 15", [$s, $e]);
$referrers = $top("SELECT COALESCE(ref_host,'Direktno') AS k, COUNT(*) AS c FROM sessions
    WHERE bot=0 AND started BETWEEN ? AND ? GROUP BY k ORDER BY c DESC LIMIT 15", [$s, $e]);
$clicks = $top("SELECT COALESCE(name,'(bez naziva)') AS k, value AS href, type, COUNT(*) AS c, COUNT(DISTINCT sid) AS u FROM events
    WHERE bot=0 AND type IN ('click','outbound') AND ts BETWEEN ? AND ? GROUP BY k, href ORDER BY c DESC LIMIT 25", [$s, $e]);
$scroll = [];
foreach ([25, 50, 75, 100] as $m) $scroll[(string) $m] = 0;
foreach ($top("SELECT value AS k, COUNT(DISTINCT sid || '|' || COALESCE(path,'')) AS c FROM events
    WHERE bot=0 AND type='scroll' AND ts BETWEEN ? AND ? GROUP BY k", [$s, $e]) as $r) {
    if (isset($scroll[$r['k']])) $scroll[$r['k']] = (int) $r['c'];
}
$dim = fn(string $col) => $top("SELECT COALESCE($col,'Nepoznato') AS k, COUNT(*) AS c FROM sessions
    WHERE bot=0 AND started BETWEEN ? AND ? GROUP BY k ORDER BY c DESC LIMIT 12", [$s, $e]);
$devices = $dim('device');
$browsers = $dim('browser');
$oses = $dim('os');
$countries = $top("SELECT COALESCE(country,'Nepoznato') AS k, cc, COUNT(*) AS c FROM sessions
    WHERE bot=0 AND started BETWEEN ? AND ? GROUP BY k ORDER BY c DESC LIMIT 15", [$s, $e]);
$cities = $top("SELECT city || ', ' || COALESCE(cc,'') AS k, COUNT(*) AS c FROM sessions
    WHERE bot=0 AND city IS NOT NULL AND started BETWEEN ? AND ? GROUP BY k ORDER BY c DESC LIMIT 12", [$s, $e]);
$langs = $dim('lang');
$screens = $dim('screen');
$durations = $top("SELECT CASE
        WHEN duration < 10 THEN '0-10 s' WHEN duration < 30 THEN '10-30 s' WHEN duration < 60 THEN '30-60 s'
        WHEN duration < 180 THEN '1-3 min' WHEN duration < 600 THEN '3-10 min' ELSE '10+ min' END AS k,
        MIN(duration) AS o, COUNT(*) AS c FROM sessions WHERE bot=0 AND started BETWEEN ? AND ? GROUP BY k ORDER BY o", [$s, $e]);

// Uživo: aktivni u zadnjih 5 minuta, i zadnji događaji
$liveSince = time() - 300;
$liveCount = (int) one($pdo, 'SELECT COUNT(*) FROM sessions WHERE bot=0 AND last_seen >= ?', [$liveSince]);
$liveList = $top("SELECT s.sid, s.device, s.browser, s.country, s.cc, s.city, s.ref_host, s.last_seen, s.started, s.duration, s.pageviews, s.clicks,
        (SELECT path FROM events ev WHERE ev.sid = s.sid AND ev.type='pageview' ORDER BY ev.id DESC LIMIT 1) AS path
    FROM sessions s WHERE s.bot=0 AND s.last_seen >= ? ORDER BY s.last_seen DESC LIMIT 20", [$liveSince]);
$recent = $top("SELECT ev.ts, ev.type, ev.path, ev.name, ev.value, s.device, s.browser, s.country, s.cc, s.city, s.ref_host, substr(s.sid,1,6) AS who
    FROM events ev JOIN sessions s ON s.sid = ev.sid WHERE ev.bot=0 ORDER BY ev.id DESC LIMIT 60");
$bots = (int) one($pdo, 'SELECT COUNT(*) FROM sessions WHERE bot=1 AND started BETWEEN ? AND ?', [$s, $e]);
$total = (int) one($pdo, 'SELECT COUNT(*) FROM sessions WHERE bot=0');

json_out([
    'range' => ['key' => $range, 'from' => $start->format('Y-m-d'), 'to' => $end->format('Y-m-d'), 'hourly' => $hourly, 'days' => $days],
    'now' => time(),
    'kpis' => $cur,
    'prev' => $prev,
    'series' => $buckets,
    'by_hour' => $byHour,
    'by_dow' => $byDow,
    'pages' => $pages,
    'sections' => $sections,
    'referrers' => $referrers,
    'clicks' => $clicks,
    'scroll' => $scroll,
    'devices' => $devices,
    'browsers' => $browsers,
    'os' => $oses,
    'countries' => $countries,
    'cities' => $cities,
    'langs' => $langs,
    'screens' => $screens,
    'durations' => $durations,
    'live' => ['count' => $liveCount, 'list' => $liveList],
    'recent' => $recent,
    'bots' => $bots,
    'total_sessions' => $total,
]);
