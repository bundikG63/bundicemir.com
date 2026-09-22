<?php
// Panel: prijava lozinkom + dashboard.
declare(strict_types=1);
require __DIR__ . '/lib.php';
$cfg = cfg();
session_start_secure();
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Cache-Control: no-store');

$action = $_GET['a'] ?? '';
if ($action === 'logout') {
    $_SESSION = [];
    session_destroy();
    header('Location: ./');
    exit;
}

$error = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['password'])) {
    $pdo = db();
    $iph = ip_hash(client_ip());
    $st = $pdo->prepare('SELECT fails, last FROM logins WHERE ip_hash = ?');
    $st->execute([$iph]);
    $row = $st->fetch();
    $fails = $row ? (int) $row['fails'] : 0;
    if ($row && $fails >= 8 && time() - (int) $row['last'] < 900) {
        $error = 'Previše pokušaja. Pokušaj ponovo za 15 minuta.';
    } elseif (password_verify((string) $_POST['password'], $cfg['password_hash'])) {
        session_regenerate_id(true);
        $_SESSION['ok'] = true;
        $_SESSION['exp'] = time() + 12 * 3600;
        $pdo->prepare('DELETE FROM logins WHERE ip_hash = ?')->execute([$iph]);
        header('Location: ./');
        exit;
    } else {
        $fails = (time() - (int) ($row['last'] ?? 0) < 900) ? $fails + 1 : 1;
        $pdo->prepare('INSERT OR REPLACE INTO logins (ip_hash, fails, last) VALUES (?,?,?)')->execute([$iph, $fails, time()]);
        $error = 'Pogrešna lozinka.';
    }
}
$logged = is_logged_in();
?>
<!DOCTYPE html>
<html lang="bs">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Analitika · <?= htmlspecialchars($cfg['site']) ?></title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%237c5cff'/%3E%3Cpath d='M8 22 13 14 18 18 24 9' stroke='%23fff' stroke-width='3' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root {
  color-scheme: dark;
  --bg: #09090f; --bg-2: #0e0e17; --panel: #12121c; --panel-2: #171724;
  --text: #f5f4fa; --muted: #a3a2b7; --faint: #6c6b80;
  --accent: #b9a1ff; --accent-2: #7c5cff; --accent-3: #ff7ad9;
  --border: #292936; --border-2: #393345;
  --good: #3ddc97; --bad: #ff6b6b;
  --s1: #9085e9; --s2: #d95926; --s3: #199e70; --s4: #c98500;
  --font: 'Inter', ui-sans-serif, -apple-system, 'Segoe UI', sans-serif;
  --mono: 'JetBrains Mono', ui-monospace, Menlo, monospace;
}
* { box-sizing: border-box; }
html, body { margin: 0; background: var(--bg); color: var(--text); font-family: var(--font); font-size: 15px; line-height: 1.5; }
a { color: var(--accent); text-decoration: none; }
button, input, select { font: inherit; color: inherit; }
.mono { font-family: var(--mono); font-size: 12.5px; }
.wrap { max-width: 1280px; margin: 0 auto; padding: 20px 16px 60px; }

/* prijava */
.login { min-height: 100vh; display: grid; place-items: center; padding: 16px; }
.login form { width: 100%; max-width: 380px; background: var(--panel); border: 1px solid var(--border); border-radius: 18px; padding: 32px 28px; }
.login h1 { margin: 0 0 4px; font-size: 22px; }
.login p { margin: 0 0 20px; color: var(--muted); font-size: 14px; }
.login input { width: 100%; padding: 12px 14px; border-radius: 10px; border: 1px solid var(--border-2); background: var(--bg-2); outline: none; margin-bottom: 12px; }
.login input:focus { border-color: var(--accent-2); }
.login button { width: 100%; padding: 12px; border-radius: 10px; border: 0; background: var(--accent-2); color: #fff; font-weight: 600; cursor: pointer; }
.login .err { color: var(--bad); font-size: 14px; margin: -4px 0 12px; }

/* zaglavlje */
.top { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.brand { display: flex; align-items: center; gap: 12px; }
.brand .logo { width: 38px; height: 38px; border-radius: 10px; background: linear-gradient(135deg, var(--accent-2), var(--accent-3)); display: grid; place-items: center; }
.brand h1 { font-size: 18px; margin: 0; }
.brand .sub { color: var(--muted); font-size: 13px; }
.live { display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 999px; background: var(--panel); border: 1px solid var(--border); font-size: 13px; color: var(--muted); }
.live b { color: var(--text); }
.dot { width: 8px; height: 8px; border-radius: 50%; background: var(--good); box-shadow: 0 0 0 0 rgba(61,220,151,.6); animation: pulse 2s infinite; }
@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(61,220,151,.6);} 70% { box-shadow: 0 0 0 8px rgba(61,220,151,0);} 100% { box-shadow: 0 0 0 0 rgba(61,220,151,0);} }
.controls { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.seg { display: inline-flex; background: var(--panel); border: 1px solid var(--border); border-radius: 10px; padding: 3px; }
.seg button { border: 0; background: transparent; color: var(--muted); padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 13.5px; }
.seg button.on { background: var(--panel-2); color: var(--text); box-shadow: inset 0 0 0 1px var(--border-2); }
.controls input[type=date] { background: var(--panel); border: 1px solid var(--border); border-radius: 8px; padding: 6px 8px; font-size: 13px; color: var(--muted); }
.ghost { border: 1px solid var(--border); background: transparent; color: var(--muted); border-radius: 8px; padding: 6px 12px; cursor: pointer; font-size: 13px; }
.ghost:hover { color: var(--text); border-color: var(--border-2); }

/* mreža */
.grid { display: grid; gap: 14px; grid-template-columns: repeat(12, 1fr); }
.card { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 18px; min-width: 0; }
.card h2 { margin: 0 0 12px; font-size: 14px; font-weight: 600; color: var(--muted); letter-spacing: .01em; display: flex; justify-content: space-between; align-items: center; gap: 8px; }
.card h2 .tools { display: inline-flex; gap: 4px; }
.span-12 { grid-column: span 12; } .span-8 { grid-column: span 8; } .span-6 { grid-column: span 6; } .span-4 { grid-column: span 4; } .span-3 { grid-column: span 3; }
@media (max-width: 1000px) { .span-8, .span-6, .span-4 { grid-column: span 6; } .span-3 { grid-column: span 6; } }
@media (max-width: 640px) { .span-8, .span-6, .span-4, .span-3 { grid-column: span 12; } .card { padding: 14px; } }

/* KPI */
.kpis { display: grid; gap: 12px; grid-template-columns: repeat(6, 1fr); margin-bottom: 14px; }
@media (max-width: 1000px) { .kpis { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 520px) { .kpis { grid-template-columns: repeat(2, 1fr); } }
.kpi { background: var(--panel); border: 1px solid var(--border); border-radius: 14px; padding: 14px 16px; }
.kpi .l { color: var(--muted); font-size: 12.5px; }
.kpi .v { font-size: 26px; font-weight: 700; letter-spacing: -.02em; margin: 2px 0; font-variant-numeric: tabular-nums; }
.kpi .d { font-size: 12px; color: var(--faint); font-variant-numeric: tabular-nums; }
.kpi .d.up { color: var(--good); } .kpi .d.down { color: var(--bad); }

/* grafikoni */
.chart { position: relative; height: 260px; }
.chart.sm { height: 180px; }
.legend { display: flex; gap: 14px; font-size: 12.5px; color: var(--muted); margin-bottom: 6px; }
.legend i { display: inline-block; width: 10px; height: 10px; border-radius: 3px; margin-right: 6px; vertical-align: -1px; }
.tbl { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.tbl th, .tbl td { text-align: left; padding: 6px 4px; border-bottom: 1px solid var(--border); vertical-align: top; }
.tbl th { color: var(--faint); font-weight: 500; font-size: 12px; }
.tbl td.n { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
.tbl tr:last-child td { border-bottom: 0; }
.tbl.hid { display: none; }

/* horizontalne trake */
.bars { display: flex; flex-direction: column; gap: 6px; }
.bar { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 10px; align-items: center; font-size: 13.5px; }
.bar .k { display: flex; align-items: center; gap: 8px; min-width: 0; }
.bar .k span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bar .k small { color: var(--faint); font-family: var(--mono); font-size: 11.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bar .n { font-variant-numeric: tabular-nums; color: var(--muted); white-space: nowrap; }
.bar .n b { color: var(--text); }
.bar .t { grid-column: 1 / -1; height: 6px; border-radius: 4px; background: var(--bg-2); overflow: hidden; }
.bar .t i { display: block; height: 100%; border-radius: 4px; background: var(--s1); }
.empty { color: var(--faint); font-size: 13.5px; padding: 12px 0; }
.flag { font-size: 16px; line-height: 1; }

/* uživo */
.feed { max-height: 420px; overflow: auto; }
.ev { display: grid; grid-template-columns: 72px 84px minmax(0, 1fr); gap: 10px; padding: 7px 0; border-bottom: 1px solid var(--border); font-size: 13px; align-items: start; }
.ev:last-child { border-bottom: 0; }
.ev .t { color: var(--faint); font-family: var(--mono); font-size: 12px; }
.tag { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 11.5px; font-weight: 600; background: var(--panel-2); color: var(--muted); border: 1px solid var(--border); }
.tag.pageview { color: var(--s1); } .tag.click, .tag.outbound { color: var(--s4); } .tag.scroll { color: var(--s3); } .tag.section { color: var(--accent-3); }
.ev .w { color: var(--text); }
.ev .w small { color: var(--faint); display: block; }
.note { color: var(--faint); font-size: 12.5px; margin-top: 14px; }
.error { background: rgba(255,107,107,.1); border: 1px solid rgba(255,107,107,.3); color: var(--bad); padding: 10px 14px; border-radius: 10px; margin-bottom: 14px; display: none; }
.skeleton { opacity: .45; pointer-events: none; }
</style>
</head>
<body>
<?php if (!$logged): ?>
<div class="login">
  <form method="post" autocomplete="off">
    <h1>Analitika</h1>
    <p><?= htmlspecialchars($cfg['site']) ?> · privatni panel</p>
    <?php if ($error): ?><div class="err"><?= htmlspecialchars($error) ?></div><?php endif; ?>
    <input type="password" name="password" placeholder="Lozinka" autofocus required>
    <button type="submit">Prijavi se</button>
  </form>
</div>
<?php else: ?>
<div class="wrap">
  <div class="top">
    <div class="brand">
      <div class="logo"><svg width="20" height="20" viewBox="0 0 32 32" fill="none"><path d="M8 22 13 14 18 18 24 9" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <div><h1>Analitika</h1><div class="sub"><?= htmlspecialchars($cfg['site']) ?></div></div>
      <span class="live" id="live"><span class="dot"></span><b id="liveN">0</b> aktivnih sada</span>
    </div>
    <div class="controls">
      <div class="seg" id="ranges">
        <button data-r="today">Danas</button>
        <button data-r="yesterday">Juče</button>
        <button data-r="7d" class="on">7 dana</button>
        <button data-r="30d">30 dana</button>
        <button data-r="90d">90 dana</button>
        <button data-r="365d">Godina</button>
      </div>
      <input type="date" id="from"> <input type="date" id="to">
      <button class="ghost" id="apply">Primijeni</button>
      <button class="ghost" id="refresh" title="Osvježi">↻</button>
      <a class="ghost" href="?a=logout">Odjava</a>
    </div>
  </div>

  <div class="error" id="err"></div>

  <div class="kpis" id="kpis">
    <div class="kpi"><div class="l">Posjete</div><div class="v" data-k="visits">–</div><div class="d" data-d="visits"></div></div>
    <div class="kpi"><div class="l">Jedinstveni posjetioci</div><div class="v" data-k="visitors">–</div><div class="d" data-d="visitors"></div></div>
    <div class="kpi"><div class="l">Pregledi stranica</div><div class="v" data-k="pageviews">–</div><div class="d" data-d="pageviews"></div></div>
    <div class="kpi"><div class="l">Klikovi</div><div class="v" data-k="clicks">–</div><div class="d" data-d="clicks"></div></div>
    <div class="kpi"><div class="l">Prosj. trajanje posjete</div><div class="v" data-k="avg_duration">–</div><div class="d" data-d="avg_duration"></div></div>
    <div class="kpi"><div class="l">Bounce rate</div><div class="v" data-k="bounce">–</div><div class="d" data-d="bounce"></div></div>
  </div>

  <div class="grid">
    <div class="card span-12">
      <h2><span>Posjete i pregledi <span id="seriesRange" class="mono" style="color:var(--faint)"></span></span>
        <span class="tools"><button class="ghost" id="tblToggle">Tabela</button></span></h2>
      <div class="legend"><span><i style="background:var(--s1)"></i>Posjete</span><span><i style="background:var(--s2)"></i>Pregledi stranica</span></div>
      <div class="chart" id="seriesWrap"><canvas id="series"></canvas></div>
      <table class="tbl hid" id="seriesTbl"><thead><tr><th>Period</th><th style="text-align:right">Posjete</th><th style="text-align:right">Pregledi</th></tr></thead><tbody></tbody></table>
    </div>

    <div class="card span-6"><h2>Aktivnost po satu u danu</h2><div class="chart sm"><canvas id="byHour"></canvas></div></div>
    <div class="card span-6"><h2>Aktivnost po danu u sedmici</h2><div class="chart sm"><canvas id="byDow"></canvas></div></div>

    <div class="card span-4"><h2>Stranice</h2><div class="bars" id="pages"></div></div>
    <div class="card span-4"><h2>Sekcije koje su viđene</h2><div class="bars" id="sections"></div></div>
    <div class="card span-4"><h2>Izvori posjeta</h2><div class="bars" id="referrers"></div></div>

    <div class="card span-8"><h2>Klikovi</h2><table class="tbl" id="clicks"><thead><tr><th>Element</th><th>Link</th><th style="text-align:right">Klikova</th><th style="text-align:right">Posjeta</th></tr></thead><tbody></tbody></table></div>
    <div class="card span-4"><h2>Dubina skrolanja</h2><div class="bars" id="scroll"></div><div class="note">Koliko posjeta je doskrolalo do 25 / 50 / 75 / 100 % stranice.</div></div>

    <div class="card span-3"><h2>Uređaji</h2><div class="bars" id="devices"></div></div>
    <div class="card span-3"><h2>Browseri</h2><div class="bars" id="browsers"></div></div>
    <div class="card span-3"><h2>Operativni sistemi</h2><div class="bars" id="os"></div></div>
    <div class="card span-3"><h2>Trajanje posjete</h2><div class="bars" id="durations"></div></div>

    <div class="card span-4"><h2>Države</h2><div class="bars" id="countries"></div></div>
    <div class="card span-4"><h2>Gradovi</h2><div class="bars" id="cities"></div></div>
    <div class="card span-4"><h2>Jezici i rezolucije</h2><div class="bars" id="langs"></div><div style="height:12px"></div><div class="bars" id="screens"></div></div>

    <div class="card span-6"><h2><span>Aktivni sada</span><span class="mono" style="color:var(--faint)">zadnjih 5 min</span></h2><div class="feed" id="liveList"></div></div>
    <div class="card span-6"><h2><span>Zadnja aktivnost</span><span class="mono" style="color:var(--faint)" id="recentNote">osvježava se svakih 15 s</span></h2><div class="feed" id="recent"></div></div>
  </div>
  <div class="note" id="foot"></div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js" integrity="sha512-CQBWl4fJHWbryGE+Pc7UAxWMUMNMWzWxF4SQo9CgkJIN1kx6djDQZjh3Y8SZ1d+6I+1zze6Z7kHXO7q3UyZAWw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script>
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const C = { s1: css('--s1'), s2: css('--s2'), s3: css('--s3'), s4: css('--s4'), muted: css('--muted'), faint: css('--faint'), border: css('--border'), panel: css('--panel-2'), text: css('--text') };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const nf = new Intl.NumberFormat('bs-BA');
  const fmtDur = (s) => { s = Math.round(s || 0); if (s < 60) return s + ' s'; const m = Math.floor(s / 60), r = s % 60; return m < 60 ? `${m} min ${r} s` : `${Math.floor(m / 60)} h ${m % 60} min`; };
  const flag = (cc) => cc && /^[A-Z]{2}$/.test(cc) ? String.fromCodePoint(...[...cc].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)) : '';
  const ago = (ts, now) => { const d = Math.max(0, now - ts); if (d < 60) return 'prije ' + d + ' s'; if (d < 3600) return 'prije ' + Math.floor(d / 60) + ' min'; if (d < 86400) return 'prije ' + Math.floor(d / 3600) + ' h'; return new Date(ts * 1000).toLocaleDateString('bs-BA'); };
  const tstr = (ts) => new Date(ts * 1000).toLocaleTimeString('bs-BA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  Chart.defaults.font.family = css('--font');
  Chart.defaults.color = C.muted;
  Chart.defaults.borderColor = C.border;
  const tooltip = { backgroundColor: C.panel, titleColor: C.text, bodyColor: C.muted, borderColor: C.border, borderWidth: 1, padding: 10, cornerRadius: 8, displayColors: true, boxPadding: 4 };
  const charts = {};

  let range = '7d', custom = null, timer = null, lastData = null;

  function lineChart(id, labels, datasets) {
    charts[id]?.destroy();
    charts[id] = new Chart($('#' + id), {
      type: 'line',
      data: { labels, datasets: datasets.map((d) => ({ ...d, borderWidth: 2, pointRadius: labels.length > 60 ? 0 : 3, pointHoverRadius: 5, pointBackgroundColor: d.borderColor, pointBorderColor: css('--panel'), pointBorderWidth: 2, tension: .3, fill: false })) },
      options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { legend: { display: false }, tooltip },
        scales: { x: { grid: { display: false }, ticks: { maxTicksLimit: 12, maxRotation: 0 } }, y: { beginAtZero: true, ticks: { precision: 0, maxTicksLimit: 6 }, grid: { color: C.border }, border: { display: false } } } },
    });
  }
  function barChart(id, labels, data, color) {
    charts[id]?.destroy();
    charts[id] = new Chart($('#' + id), {
      type: 'bar',
      data: { labels, datasets: [{ data, backgroundColor: color, borderRadius: 4, borderSkipped: 'bottom', maxBarThickness: 28, categoryPercentage: .8, barPercentage: .9 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { ...tooltip, displayColors: false, callbacks: { label: (c) => nf.format(c.parsed.y) + ' posjeta' } } },
        scales: { x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 24 } }, y: { beginAtZero: true, ticks: { precision: 0, maxTicksLimit: 5 }, grid: { color: C.border }, border: { display: false } } } },
    });
  }

  function bars(id, rows, opts = {}) {
    const el = $('#' + id);
    if (!rows || !rows.length) { el.innerHTML = '<div class="empty">Nema podataka za ovaj period.</div>'; return; }
    const max = Math.max(...rows.map((r) => +r.c)) || 1;
    const total = rows.reduce((a, r) => a + +r.c, 0) || 1;
    el.innerHTML = rows.map((r) => {
      const label = opts.label ? opts.label(r) : esc(r.k);
      const pct = Math.round(+r.c / total * 100);
      return `<div class="bar"><div class="k">${label}</div><div class="n"><b>${nf.format(+r.c)}</b> · ${pct}%</div><div class="t"><i style="width:${Math.max(2, +r.c / max * 100)}%;background:${opts.color || 'var(--s1)'}"></i></div></div>`;
    }).join('');
  }

  function delta(el, cur, prev, inverse = false) {
    if (!el) return;
    if (!prev) { el.textContent = prev === 0 && cur > 0 ? 'novo u ovom periodu' : 'nema poređenja'; el.className = 'd'; return; }
    const p = (cur - prev) / prev * 100;
    const good = inverse ? p <= 0 : p >= 0;
    el.className = 'd ' + (Math.abs(p) < 0.5 ? '' : good ? 'up' : 'down');
    el.textContent = (p >= 0 ? '+' : '') + p.toFixed(0) + '% vs prethodni period';
  }

  function render(d) {
    lastData = d;
    const k = d.kpis, p = d.prev;
    const set = (key, txt) => { $(`[data-k="${key}"]`).textContent = txt; };
    set('visits', nf.format(k.visits)); set('visitors', nf.format(k.visitors)); set('pageviews', nf.format(k.pageviews));
    set('clicks', nf.format(k.clicks)); set('avg_duration', fmtDur(k.avg_duration)); set('bounce', k.bounce + '%');
    for (const key of ['visits', 'visitors', 'pageviews', 'clicks', 'avg_duration']) delta($(`[data-d="${key}"]`), k[key], p[key]);
    delta($('[data-d="bounce"]'), k.bounce, p.bounce, true);

    $('#seriesRange').textContent = d.range.from === d.range.to ? d.range.from : `${d.range.from} → ${d.range.to}`;
    lineChart('series', d.series.map((b) => b.label), [
      { label: 'Posjete', data: d.series.map((b) => b.visits), borderColor: C.s1 },
      { label: 'Pregledi', data: d.series.map((b) => b.pageviews), borderColor: C.s2 },
    ]);
    $('#seriesTbl tbody').innerHTML = d.series.map((b) => `<tr><td>${esc(b.label)}</td><td class="n">${b.visits}</td><td class="n">${b.pageviews}</td></tr>`).join('');

    barChart('byHour', [...Array(24)].map((_, i) => String(i).padStart(2, '0') + 'h'), d.by_hour, C.s1);
    const dow = ['Ned', 'Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub'];
    const order = [1, 2, 3, 4, 5, 6, 0];
    barChart('byDow', order.map((i) => dow[i]), order.map((i) => d.by_dow[i]), C.s1);

    bars('pages', d.pages, { label: (r) => `<span>${esc(r.k)}</span><small>${r.u} posj.</small>` });
    bars('sections', d.sections, { color: 'var(--accent-3)' });
    bars('referrers', d.referrers, { color: 'var(--s3)' });
    bars('devices', d.devices); bars('browsers', d.browsers); bars('os', d.os);
    bars('durations', d.durations, { color: 'var(--s3)' });
    bars('countries', d.countries, { label: (r) => `<span class="flag">${flag(r.cc) || '🌐'}</span><span>${esc(r.k)}</span>` });
    bars('cities', d.cities); bars('langs', d.langs, { color: 'var(--s4)' }); bars('screens', d.screens, { color: 'var(--s4)' });

    const sc = d.scroll, scMax = Math.max(k.visits, ...Object.values(sc)) || 1;
    $('#scroll').innerHTML = ['25', '50', '75', '100'].map((m) => `<div class="bar"><div class="k"><span>${m} %</span></div><div class="n"><b>${nf.format(sc[m])}</b> · ${Math.round(sc[m] / scMax * 100)}%</div><div class="t"><i style="width:${Math.max(2, sc[m] / scMax * 100)}%;background:var(--s3)"></i></div></div>`).join('');

    $('#clicks tbody').innerHTML = d.clicks.length ? d.clicks.map((r) => `<tr><td>${r.type === 'outbound' ? '<span class="tag outbound">vanjski</span> ' : ''}${esc(r.k)}</td><td class="mono" style="color:var(--faint);word-break:break-all">${esc(r.href || '')}</td><td class="n">${nf.format(+r.c)}</td><td class="n">${nf.format(+r.u)}</td></tr>`).join('')
      : '<tr><td colspan="4" class="empty">Još nema klikova u ovom periodu.</td></tr>';

    renderLive(d);
    $('#foot').textContent = `Ukupno ${nf.format(d.total_sessions)} posjeta od početka mjerenja · ${nf.format(d.bots)} bot posjeta isključeno u ovom periodu · vrijeme: ${new Date(d.now * 1000).toLocaleString('bs-BA')}`;
  }

  function renderLive(d) {
    $('#liveN').textContent = d.live.count;
    const who = (r) => `${flag(r.cc)} ${esc(r.city ? r.city + ', ' : '')}${esc(r.country || 'Nepoznato')} · ${esc(r.device)} · ${esc(r.browser)}`;
    $('#liveList').innerHTML = d.live.list.length ? d.live.list.map((r) => `<div class="ev"><div class="t">${ago(r.last_seen, d.now)}</div><div><span class="tag pageview">${esc(r.path || '/')}</span></div><div class="w">${who(r)}<small>${r.pageviews} pregleda · ${r.clicks} klikova · izvor: ${esc(r.ref_host || 'direktno')} · na sajtu ${fmtDur(Math.max(r.duration, r.last_seen - r.started))}</small></div></div>`).join('')
      : '<div class="empty">Trenutno niko nije na sajtu.</div>';
    const what = (r) => {
      if (r.type === 'pageview') return `Otvorio stranicu <b>${esc(r.path || '/')}</b>`;
      if (r.type === 'click' || r.type === 'outbound') return `Kliknuo <b>${esc(r.name || '?')}</b>${r.value ? ` <small class="mono">${esc(r.value)}</small>` : ''}`;
      if (r.type === 'scroll') return `Doskrolao do <b>${esc(r.value)} %</b> na ${esc(r.path || '/')}`;
      if (r.type === 'section') return `Vidio sekciju <b>${esc(r.name)}</b>`;
      return esc(r.type);
    };
    const lbl = { pageview: 'stranica', click: 'klik', outbound: 'vanjski', scroll: 'scroll', section: 'sekcija' };
    $('#recent').innerHTML = d.recent.length ? d.recent.map((r) => `<div class="ev"><div class="t">${tstr(r.ts)}</div><div><span class="tag ${r.type}">${lbl[r.type] || r.type}</span></div><div class="w">${what(r)}<small>#${esc(r.who)} · ${who(r)}</small></div></div>`).join('')
      : '<div class="empty">Još nema zabilježene aktivnosti.</div>';
  }

  async function load(silent = false) {
    const q = new URLSearchParams({ range });
    if (range === 'custom' && custom) { q.set('from', custom[0]); q.set('to', custom[1]); }
    if (!silent) $('.grid').classList.add('skeleton');
    try {
      const r = await fetch('api.php?' + q, { credentials: 'same-origin', cache: 'no-store' });
      if (r.status === 401) { location.reload(); return; }
      if (!r.ok) throw new Error('HTTP ' + r.status);
      render(await r.json());
      $('#err').style.display = 'none';
    } catch (e) {
      $('#err').textContent = 'Greška pri učitavanju podataka: ' + e.message;
      $('#err').style.display = 'block';
    } finally {
      $('.grid').classList.remove('skeleton');
    }
  }

  $('#ranges').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    for (const x of $('#ranges').children) x.classList.toggle('on', x === b);
    range = b.dataset.r; custom = null; $('#from').value = ''; $('#to').value = '';
    load();
  });
  $('#apply').addEventListener('click', () => {
    const f = $('#from').value, t = $('#to').value;
    if (!f || !t) return;
    for (const x of $('#ranges').children) x.classList.remove('on');
    range = 'custom'; custom = [f, t]; load();
  });
  $('#refresh').addEventListener('click', () => load());
  $('#tblToggle').addEventListener('click', () => {
    const t = $('#seriesTbl'), w = $('#seriesWrap');
    const show = t.classList.contains('hid');
    t.classList.toggle('hid', !show); w.style.display = show ? 'none' : '';
    $('#tblToggle').textContent = show ? 'Grafikon' : 'Tabela';
  });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') load(true); });
  timer = setInterval(() => { if (document.visibilityState === 'visible') load(true); }, 15000);
  load();
})();
</script>
<?php endif; ?>
</body>
</html>
