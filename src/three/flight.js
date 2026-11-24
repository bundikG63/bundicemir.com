// The flight: a WebGL corridor of light the page travels through as it scrolls.
// Each project is a station with its real screen; streaks stretch with speed.
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

const GAP = 52
const BG = 0x01020a
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const smooth = (t) => t * t * (3 - 2 * t)

function glowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const x = c.getContext('2d')
  const r = x.createRadialGradient(128, 128, 0, 128, 128, 128)
  r.addColorStop(0, 'rgba(255,255,255,1)')
  r.addColorStop(0.25, 'rgba(255,255,255,.42)')
  r.addColorStop(1, 'rgba(255,255,255,0)')
  x.fillStyle = r
  x.fillRect(0, 0, 256, 256)
  return new THREE.CanvasTexture(c)
}

// A plane with rounded corners and plain 0..1 UVs.
function roundedPlane(w, h, r) {
  const s = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.quadraticCurveTo(x + w, y, x + w, y + r)
  s.lineTo(x + w, y + h - r)
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  s.lineTo(x + r, y + h)
  s.quadraticCurveTo(x, y + h, x, y + h - r)
  s.lineTo(x, y + r)
  s.quadraticCurveTo(x, y, x + r, y)
  const g = new THREE.ShapeGeometry(s, 10)
  const p = g.attributes.position
  const uv = g.attributes.uv
  for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / w + 0.5, p.getY(i) / h + 0.5)
  return g
}

function drawBoard(canvas, name, groups) {
  const x = canvas.getContext('2d')
  x.fillStyle = '#ffd400'
  x.fillRect(0, 0, 1600, 1000)
  x.fillStyle = '#0a0a0a'
  x.font = '800 204px Unbounded, sans-serif'
  x.fillText(name.toUpperCase(), 70, 248)
  x.fillRect(74, 306, 1452, 8)
  const step = 1452 / groups.length
  groups.forEach((g, ci) => {
    x.globalAlpha = 0.62
    x.font = '800 27px Unbounded, sans-serif'
    x.fillText(g.label, 74 + ci * step, 404)
    x.globalAlpha = 1
    x.font = '700 33px "Manrope Variable", Manrope, sans-serif'
    g.items.forEach((item, ri) => x.fillText(item, 74 + ci * step, 486 + ri * 66, step - 26))
  })
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{id:string,color:number,src?:string,w?:number,h?:number,name:string}[]} projects
 * @param {number} extra  stations after the projects (about, contact)
 */
export function createFlight(canvas, projects, extra = 2) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
  const phone = matchMedia('(max-width: 760px)').matches
  let dpr = Math.min(devicePixelRatio, phone ? 1.5 : 2)
  renderer.setPixelRatio(dpr)
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(BG)
  scene.fog = new THREE.FogExp2(BG, 0.0135)
  const camera = new THREE.PerspectiveCamera(64, 1, 0.1, 600)

  const stationZ = (i) => -(i + 1) * GAP
  const keys = [9, ...projects.map((_, i) => stationZ(i) + 15)]
  for (let k = 1; k <= extra; k++) keys.push(stationZ(projects.length - 1) + 15 - k * GAP * 0.85)
  const lastKey = keys[keys.length - 1]
  const sides = [0, ...projects.map((_, i) => (i % 2 ? -1 : 1)), ...Array(extra).fill(0)]

  let dirty = 90
  const glow = glowTexture()
  const loader = new THREE.TextureLoader()
  const maxAniso = renderer.capabilities.getMaxAnisotropy()
  const disposables = [glow]

  function shotTexture(p, at) {
    const t = loader.load(p.src, () => (dirty = 60))
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = maxAniso
    const vis = Math.min(1, (p.w * 10) / 16 / p.h)
    t.repeat.set(1, vis)
    t.offset.set(0, (1 - vis) * (1 - at))
    disposables.push(t)
    return t
  }

  // The Godzilla board is drawn, not photographed: it is redrawn when the language changes.
  const boardCanvas = document.createElement('canvas')
  boardCanvas.width = 1600
  boardCanvas.height = 1000
  const boardTexture = new THREE.CanvasTexture(boardCanvas)
  boardTexture.colorSpace = THREE.SRGBColorSpace
  boardTexture.anisotropy = maxAniso
  disposables.push(boardTexture)

  const fades = [] // things that dim as the camera reaches them, so passing through never whites out
  function screen(p, w, at) {
    const g = new THREE.Group()
    const h = w * 0.625
    const r = w * 0.022
    const color = new THREE.Color(p.color)
    const rim = new THREE.Mesh(roundedPlane(w + 0.14, h + 0.14, r + 0.07), new THREE.MeshBasicMaterial({ color: color.clone().multiplyScalar(2.6) }))
    rim.position.z = -0.02
    const face = new THREE.Mesh(roundedPlane(w, h, r), new THREE.MeshBasicMaterial({ map: p.src ? shotTexture(p, at) : boardTexture, color: 0xeeeeee, toneMapped: false }))
    // The light a screen throws on the haze around it.
    const haze = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color, transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending, depthWrite: false }))
    haze.scale.set(w * 1.9, h * 1.9, 1)
    haze.position.z = -0.6
    g.add(haze, rim, face)
    fades.push({ at: g, material: haze.material, base: 0.05, from: 5, span: 16, opacity: true })
    return g
  }

  const mains = []
  projects.forEach((p, i) => {
    const z = stationZ(i)
    const main = screen(p, 15.5, 0)
    main.userData = { side: sides[i + 1], z }
    mains.push(main)
    scene.add(main)
    // Fly-by screens on the way in: other parts of the same page, hung along both walls.
    for (let k = 0; k < 5; k++) {
      const s = k % 2 ? 1 : -1
      const fly = screen(p, 7.2, p.src ? 0.14 + k * 0.17 : 0)
      fly.position.set(s * (10.5 + (k % 3) * 0.8), (k % 2 ? 1 : -1) * (1.4 + (k % 3) * 1.1), z + 40 - k * 6.6)
      fly.rotation.y = -s * 1.12
      fly.rotation.z = s * 0.05 * ((k % 3) - 1)
      scene.add(fly)
    }
    // The gate: rings in the project's colour that the camera passes through.
    for (let k = 0; k < 4; k++) {
      const base = new THREE.Color(p.color).multiplyScalar(k === 0 ? 2.4 : 1.2)
      const ring = new THREE.Mesh(new THREE.TorusGeometry(13.5 + k * 0.5, k === 0 ? 0.095 : 0.045, 8, 160), new THREE.MeshBasicMaterial({ color: base.clone() }))
      ring.position.set(0, 0, z + 24 - k * 3.2)
      scene.add(ring)
      fades.push({ at: ring, material: ring.material, base, from: 1.5, span: 12 })
    }
  })

  // ---- streaks: the light that stretches with speed ----
  const N = phone ? 1300 : 2600
  const farZ = lastKey - 130
  const seed = new Float32Array(N * 4) // x, y, z, length
  const pos = new Float32Array(N * 6)
  const col = new Float32Array(N * 6)
  const white = new THREE.Color(0xdff6ff)
  for (let n = 0; n < N; n++) {
    const a = Math.random() * Math.PI * 2
    const r = 15 + Math.pow(Math.random(), 1.6) * 34
    const z = 30 + Math.random() * (farZ - 30)
    seed.set([Math.cos(a) * r, Math.sin(a) * r * 0.82, z, 0.6 + Math.random() * 2.6], n * 4)
    const zone = Math.round((-z - GAP * 0.5) / GAP)
    const hue = z > -GAP * 0.45 || zone >= projects.length ? 0x35e0ff : projects[Math.max(0, zone)].color
    const c = new THREE.Color(hue).lerp(white, 0.35 + Math.random() * 0.45)
    const dim = Math.random() < 0.12 ? 1.9 : 0.3 + Math.random() * 0.6
    col.set([c.r * dim, c.g * dim, c.b * dim, c.r * dim * 0.05, c.g * dim * 0.05, c.b * dim * 0.05], n * 6)
  }
  const sg = new THREE.BufferGeometry()
  sg.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  sg.setAttribute('color', new THREE.BufferAttribute(col, 3))
  const streaks = new THREE.LineSegments(sg, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }))
  streaks.frustumCulled = false
  scene.add(streaks)
  function stretch(v) {
    const k = 1 + v * 26
    for (let n = 0; n < N; n++) {
      const x = seed[n * 4]
      const y = seed[n * 4 + 1]
      const z = seed[n * 4 + 2]
      const o = n * 6
      pos[o] = x
      pos[o + 1] = y
      pos[o + 2] = z
      pos[o + 3] = x
      pos[o + 4] = y
      pos[o + 5] = z - seed[n * 4 + 3] * k
    }
    sg.attributes.position.needsUpdate = true
  }

  // The light at the end.
  const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: 0xbfefff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }))
  core.scale.set(58, 58, 1)
  scene.add(core)

  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.65, 0.55, 1.0)
  composer.addPass(bloom)
  composer.addPass(new OutputPass())

  let narrow = false
  let baseFov = 64
  function resize() {
    const w = canvas.clientWidth || innerWidth
    const h = canvas.clientHeight || innerHeight
    renderer.setSize(w, h, false)
    composer.setSize(w, h)
    camera.aspect = w / h
    narrow = camera.aspect < 0.8
    baseFov = narrow ? 82 : 64
    // On a tall screen the project's screen hangs above the text instead of beside it.
    for (const m of mains) {
      const { side, z } = m.userData
      if (narrow) {
        m.position.set(0, 7.6, z - 1.5)
        m.rotation.set(-0.06, -side * 0.14, 0)
        m.scale.setScalar(0.62)
      } else {
        m.position.set(side * 8.4, 0.1, z - 1.5)
        m.rotation.set(0, -side * 0.44, 0)
        m.scale.setScalar(1)
      }
    }
    dirty = 30
  }
  resize()

  let pp = 0
  let lastZ = null
  let vel = 0
  let mx = 0
  let my = 0
  let tx = 0
  let ty = 0
  let raf = 0
  let quality = 0 // 0 full, 1 lower resolution, 2 no bloom
  let slow = 0
  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return
    tx = (e.clientX / innerWidth) * 2 - 1
    ty = (e.clientY / innerHeight) * 2 - 1
  }
  addEventListener('pointermove', onMove, { passive: true })
  addEventListener('resize', resize)

  function frame() {
    raf = requestAnimationFrame(frame)
    const seg = Math.min(keys.length - 2, Math.floor(pp))
    const t = pp - seg
    // Dwell at each station, then accelerate through the gap.
    const z = keys[seg] + (keys[seg + 1] - keys[seg]) * smooth(clamp((t - 0.16) / 0.68))
    if (lastZ === null) lastZ = z
    const raw = Math.abs(z - lastZ)
    lastZ = z
    vel += (clamp(raw / 2.2) - vel) * 0.14
    const lag = Math.abs(tx - mx) + Math.abs(ty - my)
    if (vel < 0.002 && lag < 0.002 && dirty <= 0) return
    dirty--
    const start = performance.now()

    mx += (tx - mx) * 0.06
    my += (ty - my) * 0.06
    stretch(vel)
    const near = Math.round(pp)
    const hold = 1 - clamp(Math.abs(pp - near) * 3.2) // 1 while parked at a station
    const side = sides[near] || 0
    if (narrow) {
      camera.position.set(mx * 0.3, 0, z)
      camera.lookAt(0, 0, z - 22)
    } else {
      camera.position.set(mx * 0.7 - side * 1.3 * hold, -my * 0.45, z)
      camera.lookAt(mx * 1.4 + side * 3.4 * hold, -my * 0.9, z - 22)
    }
    camera.rotation.z += vel * 0.05 * Math.sin(z * 0.05)
    camera.fov += (baseFov + vel * 22 - camera.fov) * 0.2
    camera.updateProjectionMatrix()
    core.position.set(0, 0, Math.min(z - 150, lastKey - 54))
    // The end light only rises on the last stretch; earlier it would hang in the fog as a dull ball.
    core.material.opacity = clamp(1 - (z - lastKey) / (GAP * 1.5))
    bloom.strength = 0.65 + vel * 0.25
    for (const f of fades) {
      const k = clamp((z - f.at.position.z - f.from) / f.span)
      if (f.opacity) f.material.opacity = f.base * k
      else f.material.color.copy(f.base).multiplyScalar(0.12 + 0.88 * k)
    }

    if (quality < 2) composer.render()
    else renderer.render(scene, camera)

    // Step the quality down when frames run long while moving.
    if (vel > 0.05) {
      slow = performance.now() - start > 22 ? slow + 1 : Math.max(0, slow - 1)
      if (slow > 24 && quality < 2) {
        quality++
        slow = 0
        if (quality === 1) {
          dpr = 1
          renderer.setPixelRatio(1)
          resize()
        }
      }
    }
  }
  frame()

  return {
    update(progress) {
      pp = clamp(progress, 0, keys.length - 1)
    },
    setBoard(name, groups) {
      drawBoard(boardCanvas, name, groups)
      boardTexture.needsUpdate = true
      dirty = 30
    },
    dispose() {
      cancelAnimationFrame(raf)
      removeEventListener('pointermove', onMove)
      removeEventListener('resize', resize)
      scene.traverse((o) => {
        o.geometry?.dispose()
        o.material?.dispose()
      })
      disposables.forEach((d) => d.dispose())
      composer.dispose()
      renderer.dispose()
    },
  }
}
