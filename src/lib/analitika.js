// Lagani tracker za vlastitu analitiku (analitika/c.php).
// Šalje: pageview, klikove (linkovi, dugmad, [data-track]), dubinu skrolanja,
// viđene sekcije i trajanje posjete. Bez kolačića: ID-evi žive u localStorage/sessionStorage.

const ENDPOINT = import.meta.env.VITE_ANALITIKA_URL || ''
const HOSTS = ['bundicemir.com', 'www.bundicemir.com']
const SESSION_TTL = 30 * 60 * 1000

function uid() {
  if (crypto.randomUUID) return crypto.randomUUID().replace(/-/g, '')
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join('')
}

function store(kind, key, make) {
  try {
    const s = kind === 'local' ? localStorage : sessionStorage
    let v = s.getItem(key)
    if (!v) { v = make(); s.setItem(key, v) }
    return v
  } catch { return make() }
}

export function initAnalitika() {
  if (!ENDPOINT || typeof window === 'undefined') return
  const params = new URLSearchParams(location.search)
  try {
    if (params.has('_noanalitika')) localStorage.setItem('gz_ignore', '1')
    if (params.has('_analitika')) localStorage.removeItem('gz_ignore')
    if (localStorage.getItem('gz_ignore') === '1') return
  } catch {}
  if (!HOSTS.includes(location.hostname)) return
  if (navigator.webdriver) return

  const vid = store('local', 'gz_vid', uid)
  let sid
  try {
    const last = +sessionStorage.getItem('gz_last') || 0
    if (Date.now() - last > SESSION_TTL) sessionStorage.removeItem('gz_sid')
  } catch {}
  sid = store('session', 'gz_sid', uid)

  const ctx = {
    r: document.referrer || '',
    sw: screen.width, sh: screen.height, vw: innerWidth, vh: innerHeight,
    l: navigator.language, tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }
  let queue = []
  let flushTimer = null
  function send(sync = false) {
    if (!queue.length) return
    const body = JSON.stringify({ sid, vid, ctx, ev: queue })
    queue = []
    try { sessionStorage.setItem('gz_last', String(Date.now())) } catch {}
    if (navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'text/plain' }))) return
    fetch(ENDPOINT, { method: 'POST', body, keepalive: sync, headers: { 'Content-Type': 'text/plain' }, credentials: 'omit', mode: 'cors' }).catch(() => {})
  }
  function track(t, n, v, p = location.pathname) {
    queue.push({ t, p, n, v })
    clearTimeout(flushTimer)
    flushTimer = setTimeout(() => send(), 800)
  }

  // pageview
  track('pageview', document.title, null)

  // klikovi
  const label = (el) => {
    const t = el.dataset.track || el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent || ''
    const s = t.replace(/\s+/g, ' ').trim()
    return s.slice(0, 80) || (el.tagName === 'A' ? el.getAttribute('href') : el.tagName.toLowerCase())
  }
  document.addEventListener('click', (e) => {
    const el = e.target.closest('a, button, [data-track], input[type=submit]')
    if (!el) return
    const href = el.tagName === 'A' ? el.getAttribute('href') || '' : ''
    const section = el.closest('section[id], footer, header, nav')
    const where = section ? (section.id || section.tagName.toLowerCase()) : ''
    const outbound = /^https?:/i.test(href) && !HOSTS.includes(new URL(href, location.href).hostname)
    track(outbound ? 'outbound' : 'click', (where ? where + ' › ' : '') + label(el), href || null)
  }, { capture: true, passive: true })

  // dubina skrolanja
  const sent = new Set()
  const onScroll = () => {
    const doc = document.documentElement
    const max = doc.scrollHeight - innerHeight
    const pct = max <= 0 ? 100 : Math.min(100, Math.round((scrollY / max) * 100))
    for (const m of [25, 50, 75, 100]) {
      if (pct >= m && !sent.has(m)) { sent.add(m); track('scroll', null, m) }
    }
  }
  addEventListener('scroll', onScroll, { passive: true })
  setTimeout(onScroll, 1500)

  // viđene sekcije (bar 40 % vidljivo, jednom po sekciji)
  if ('IntersectionObserver' in window) {
    const seen = new Set()
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (en.isIntersecting && !seen.has(en.target.id)) { seen.add(en.target.id); track('section', en.target.id, null) }
      }
    }, { threshold: 0.4 })
    const observe = () => document.querySelectorAll('section[id]').forEach((s) => io.observe(s))
    observe()
    setTimeout(observe, 2000)
  }

  // trajanje: broji se samo dok je kartica vidljiva
  let visibleSince = document.visibilityState === 'visible' ? Date.now() : 0
  let total = 0
  const leave = () => {
    if (visibleSince) { total += Date.now() - visibleSince; visibleSince = 0 }
    queue.push({ t: 'leave', p: location.pathname, n: null, v: Math.round(total / 1000) })
    send(true)
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') leave()
    else if (!visibleSince) visibleSince = Date.now()
  })
  addEventListener('pagehide', leave)

  // ping svakih 60 s dok je kartica aktivna, da "aktivni sada" bude tačno
  setInterval(() => {
    if (document.visibilityState !== 'visible') return
    const now = Date.now()
    if (visibleSince) total += now - visibleSince
    visibleSince = now
    queue.push({ t: 'leave', p: location.pathname, n: null, v: Math.round(total / 1000) })
    send()
  }, 60000)
}
