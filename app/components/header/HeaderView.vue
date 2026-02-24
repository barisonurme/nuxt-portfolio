<template>
    <div class="page-root">
        <!-- Layer order: back → front. Grain sits on top of all particles. -->
        <canvas ref="layer0Canvas" class="particle-canvas layer-0" />
        <canvas ref="layer1Canvas" class="particle-canvas layer-1" />
        <canvas ref="layer2Canvas" class="particle-canvas layer-2" />
        <canvas ref="grainCanvas"  class="grain-canvas" />
        <canvas ref="textParticleCanvas" class="text-particle-canvas" />

        <div ref="cursorEl" class="cursor-dot" />

        <div class="relative flex flex-col w-full h-[calc(100vh-400px)] max-w-7xl justify-center items-center">
            <svg ref="svgEl" viewBox="0 0 400 150" class="w-full max-w-2xl overflow-visible">
                <defs>
                    <clipPath id="cursor-clip">
                        <circle ref="clipCircle" cx="-200" cy="-200" r="0" />
                    </clipPath>
                    <clipPath id="intro-text-clip">
                        <text x="50%" y="115" text-anchor="middle" font-size="80" font-weight="700" font-family="Montserrat, sans-serif">Building things</text>
                    </clipPath>
                    <mask id="fill-mask">
                        <rect x="-100" y="-100" width="800" height="350" fill="white" />
                        <circle ref="maskCircle" cx="-200" cy="-200" r="0" fill="black" />
                    </mask>
                </defs>

                <g clip-path="url(#intro-text-clip)">
                    <text x="50%" y="115" text-anchor="middle" font-size="80" font-weight="700" font-family="Montserrat, sans-serif" class="intro-stroke-1">Building things</text>
                    <text x="50%" y="115" text-anchor="middle" font-size="80" font-weight="700" font-family="Montserrat, sans-serif" class="intro-stroke-2">Building things</text>
                    <text x="50%" y="115" text-anchor="middle" font-size="80" font-weight="700" font-family="Montserrat, sans-serif" class="intro-stroke-3">Building things</text>
                </g>

                <text
                    x="50%" y="115"
                    text-anchor="middle"
                    font-size="80" font-weight="700" font-family="Montserrat, sans-serif"
                    class="fill-layer"
                    mask="url(#fill-mask)"
                >Building things</text>

                <g clip-path="url(#cursor-clip)" style="pointer-events: none">
                    <text x="50%" y="115" text-anchor="middle" font-size="80" font-weight="700" font-family="Montserrat, sans-serif" class="stroke-1">Building things</text>
                    <text x="50%" y="115" text-anchor="middle" font-size="80" font-weight="700" font-family="Montserrat, sans-serif" class="stroke-2">Building things</text>
                    <text x="50%" y="115" text-anchor="middle" font-size="80" font-weight="700" font-family="Montserrat, sans-serif" class="stroke-3">Building things</text>
                </g>
            </svg>
            
            <div class="flex gap-2 items-center justify-center">
                 <ContainerTextFlip :interval=5000 :words="words"
                class="h-auto  bg-muted/0 text-primary! underline!" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { gsap } from 'gsap'
import ContainerTextFlip from '../ui/container-text-flip/ContainerTextFlip.vue'

const cursorEl     = ref(null)
const svgEl        = ref(null)
const clipCircle   = ref(null)
const maskCircle   = ref(null)
const grainCanvas  = ref(null)
const layer0Canvas = ref(null)  // far   – heavy CSS blur
const layer1Canvas = ref(null)  // mid   – light CSS blur
const layer2Canvas = ref(null)  // near  – soft blur
const textParticleCanvas = ref(null)

// ─── Globe config ─────────────────────────────────────────────────────────────
const FOCAL = 1400   // perspective focal length (px)

// Two concentric shells – each rotates independently, creating opposing parallax
const SHELL_DEFS = [
    {
        // Outer: wide starfield, normal mouse direction, slow forward spin
        count:      600,
        rFactor:    0.62,   // radius = Math.max(w,h) * rFactor
        sizeMin:    0.3,  sizeMax:  1.8,
        opacityMin: 0.08, opacityMax: 0.55,
        glowChance: 0.10,
        mouseScale: 1.0,    // tracks mouse normally
        spinRate:   0.00035,
        spinDir:    1,
    },
    {
        // Inner: fewer larger particles, counter-rotates → dramatic opposing drift
        count:      200,
        rFactor:    0.28,
        sizeMin:    1.5,  sizeMax:  4.5,
        opacityMin: 0.10, opacityMax: 0.50,
        glowChance: 0.30,
        mouseScale: -0.65,  // slides opposite direction on mouse move
        spinRate:   0.00055,
        spinDir:    -1,     // spins the other way
    },
]

// Runtime shell state: [{ def, particles[], rotX, rotY, targetRotX, targetRotY, autoSpin }]
const shells = []

// Cached canvas contexts + dimensions
let ctx0 = null, ctx1 = null, ctx2 = null
let ctxTxt = null
let txtOff = null      // offscreen canvas used for destination-in text clip
let txtOffCtx = null
let canvasW = 0, canvasH = 0

// ─── Text-particle config ──────────────────────────────────────────────────────
const TXT_COUNT          = 620
const TXT_REPEL_RADIUS   = 90    // px – repulsion range from cursor
const TXT_REPEL_STRENGTH = 7     // px/frame push force at contact
const TXT_SPRING         = 0.05  // spring back to home
const TXT_DAMPING        = 0.76  // velocity damping
const TXT_CONNECT_DIST   = 28    // px – max distance to draw a connection line

let textParticles = []
let txtSamples    = []           // { nx, ny } normalised [0..1] inside text shape

// ─── Mouse / smoothing ────────────────────────────────────────────────────────
let mouseX = 0, mouseY = 0
let smoothMouseX = 0, smoothMouseY = 0

// ─── Cursor state ─────────────────────────────────────────────────────────────
const HOVER_SCALE = 5
const CURSOR_SIZE = 20
let isHovering = false
let isOnLink = false
let morphTween = null
let prevX = 0, prevY = 0
let tickerX = 0, tickerY = 0
let wasMoving = false

// ─── Grain ────────────────────────────────────────────────────────────────────
let grainOffscreen = null
let grainCtx = null
const GRAIN_TILE = 256

function createGrainOffscreen() {
    grainOffscreen = document.createElement('canvas')
    grainOffscreen.width = GRAIN_TILE
    grainOffscreen.height = GRAIN_TILE
    grainCtx = grainOffscreen.getContext('2d')
}

function drawGrain() {
    const imageData = grainCtx.createImageData(GRAIN_TILE, GRAIN_TILE)
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255 | 0
        data[i] = data[i + 1] = data[i + 2] = v
        data[i + 3] = (Math.random() * 22) | 0
    }
    grainCtx.putImageData(imageData, 0, 0)

    const canvas = grainCanvas.value
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const pat = ctx.createPattern(grainOffscreen, 'repeat')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = pat
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

// ─── Particles ────────────────────────────────────────────────────────────────
function getPrimary() {
    return getComputedStyle(document.documentElement).getPropertyValue('--ui-primary').trim()
}

function initShells() {
    shells.length = 0
    const primary = getPrimary()
    for (const def of SHELL_DEFS) {
        const particles = []
        for (let i = 0; i < def.count; i++) {
            const phi    = Math.acos(1 - 2 * Math.random())
            const theta  = Math.random() * Math.PI * 2
            const isGlow = Math.random() < def.glowChance
            particles.push({
                phi, theta,
                size:    def.sizeMin + Math.random() * (def.sizeMax - def.sizeMin),
                opacity: def.opacityMin + Math.random() * (def.opacityMax - def.opacityMin),
                glow:    isGlow,
                color:   primary,
            })
        }
        shells.push({
            def,
            particles,
            rotX: 0, rotY: 0,
            targetRotX: 0, targetRotY: 0,
            autoSpin: Math.random() * Math.PI * 2,  // random phase offset
        })
    }
}

function drawGlobe() {
    if (!ctx0) return
    const w = canvasW, h = canvasH
    const cx = w / 2, cy = h / 2

    ctx0.clearRect(0, 0, w, h)
    ctx1.clearRect(0, 0, w, h)
    ctx2.clearRect(0, 0, w, h)

    // Collect projected particles from all shells, then sort globally
    const allProjected = []

    for (const shell of shells) {
        const { def } = shell
        const R = Math.max(w, h) * def.rFactor

        // Each shell tracks the mouse differently
        shell.targetRotY = (smoothMouseX - cx) / cx * 0.28 * def.mouseScale
        shell.targetRotX = (smoothMouseY - cy) / cy * 0.20 * def.mouseScale
        shell.rotX += (shell.targetRotX - shell.rotX) * 0.04
        shell.rotY += (shell.targetRotY - shell.rotY) * 0.04
        shell.autoSpin += def.spinRate * def.spinDir

        const totalRotY = shell.rotY + shell.autoSpin
        const cosRY = Math.cos(totalRotY), sinRY = Math.sin(totalRotY)
        const cosRX = Math.cos(shell.rotX),  sinRX = Math.sin(shell.rotX)

        for (const p of shell.particles) {
            const x = R * Math.sin(p.phi) * Math.cos(p.theta)
            const y = R * Math.cos(p.phi)
            const z = R * Math.sin(p.phi) * Math.sin(p.theta)
            const x1 = x * cosRY + z * sinRY
            const z1 = -x * sinRY + z * cosRY
            const y2 = y * cosRX - z1 * sinRX
            const z2 = y * sinRX + z1 * cosRX
            const scale = FOCAL / (FOCAL + z2)
            allProjected.push({ ...p, sx: cx + x1 * scale, sy: cy + y2 * scale, z: z2, scale, R })
        }
    }

    // Back-to-front across both shells
    allProjected.sort((a, b) => b.z - a.z)

    for (const p of allProjected) {
        const zNorm = (p.z + p.R) / (2 * p.R)
        const ctx = zNorm < 0.34 ? ctx0
                  : zNorm < 0.67 ? ctx1
                  : ctx2

        const size  = Math.max(0.2, p.size * p.scale)
        const alpha = p.opacity * (0.15 + zNorm * 0.85)

        if (p.glow) {
            const gr   = size * 5.5
            const grad = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, gr)
            grad.addColorStop(0, p.color)
            grad.addColorStop(1, 'transparent')
            ctx.globalAlpha = alpha * 0.28
            ctx.fillStyle = grad
            ctx.beginPath()
            ctx.arc(p.sx, p.sy, gr, 0, Math.PI * 2)
            ctx.fill()
        }

        ctx.globalAlpha = alpha
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, size, 0, Math.PI * 2)
        ctx.fill()
    }

    ctx0.globalAlpha = 1
    ctx1.globalAlpha = 1
    ctx2.globalAlpha = 1
}

// ─── Text particles ───────────────────────────────────────────────────────────
function sampleTextPixels() {
    const W = 400, H = 150
    const oc = document.createElement('canvas')
    oc.width = W; oc.height = H
    const c = oc.getContext('2d')
    c.fillStyle = '#fff'
    c.font = 'bold 80px Montserrat, sans-serif'
    c.textAlign = 'center'
    c.textBaseline = 'alphabetic'
    c.fillText('Building things', W / 2, 115)
    const d = c.getImageData(0, 0, W, H).data
    txtSamples = []
    for (let y = 0; y < H; y += 2) {
        for (let x = 0; x < W; x += 2) {
            if (d[(y * W + x) * 4 + 3] > 100)
                txtSamples.push({ nx: x / W, ny: y / H })
        }
    }
}

function buildTextParticles() {
    textParticles = []
    if (!txtSamples.length || !svgEl.value) return
    const rect = svgEl.value.getBoundingClientRect()
    const sc   = rect.width / 400
    const primary = getPrimary()
    for (let i = 0; i < TXT_COUNT; i++) {
        const s  = txtSamples[Math.floor(Math.random() * txtSamples.length)]
        const hx = rect.left + s.nx * 400 * sc
        const hy = rect.top  + s.ny * 150 * sc
        textParticles.push({
            hx, hy,
            x: hx + (Math.random() - .5) * 3,
            y: hy + (Math.random() - .5) * 3,
            vx: 0, vy: 0,
            r:      .6 + Math.random() * 1.6,
            baseOp: .5  + Math.random() * .45,
            col: primary,
        })
    }
}

function drawTextParticles() {
    if (!ctxTxt || !txtOffCtx || !textParticles.length || !svgEl.value) return

    const rect = svgEl.value.getBoundingClientRect()
    const sc   = rect.width / 400
    const primary = getPrimary()

    txtOffCtx.clearRect(0, 0, canvasW, canvasH)

    // Update physics for all particles first
    for (const p of textParticles) {
        const dx = p.x - smoothMouseX
        const dy = p.y - smoothMouseY
        const dist = Math.sqrt(dx * dx + dy * dy)

        p._reveal = 0
        if (dist < TXT_REPEL_RADIUS) {
            p._reveal = 1 - dist / TXT_REPEL_RADIUS
            if (dist > 0) {
                const force = p._reveal * TXT_REPEL_STRENGTH
                p.vx += (dx / dist) * force
                p.vy += (dy / dist) * force
            }
        }

        p.vx += (p.hx - p.x) * TXT_SPRING
        p.vy += (p.hy - p.y) * TXT_SPRING
        p.vx *= TXT_DAMPING
        p.vy *= TXT_DAMPING
        p.x  += p.vx
        p.y  += p.vy
    }

    // Draw particles first
    for (const p of textParticles) {
        const reveal = p._reveal ?? 0
        const alpha  = p.baseOp * (.12 + reveal * .88)
        const radius = p.r * (1 + reveal * .6)

        // Soft glow halo when revealed by cursor
        if (reveal > .15) {
            const gr   = radius * 5
            const grad = txtOffCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, gr)
            grad.addColorStop(0, primary)
            grad.addColorStop(1, 'transparent')
            txtOffCtx.globalAlpha = alpha * .3 * reveal
            txtOffCtx.fillStyle = grad
            txtOffCtx.beginPath()
            txtOffCtx.arc(p.x, p.y, gr, 0, Math.PI * 2)
            txtOffCtx.fill()
        }

        txtOffCtx.globalAlpha = alpha
        txtOffCtx.fillStyle   = 'white'
        txtOffCtx.beginPath()
        txtOffCtx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        txtOffCtx.fill()
    }

    // Draw connections under particles using destination-over
    txtOffCtx.globalCompositeOperation = 'destination-over'
    txtOffCtx.lineWidth = 0.6
    for (let i = 0; i < textParticles.length; i++) {
        const pi = textParticles[i]
        for (let j = i + 1; j < textParticles.length; j++) {
            const pj = textParticles[j]
            const dx = pi.x - pj.x
            const dy = pi.y - pj.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < TXT_CONNECT_DIST) {
                const t = 1 - dist / TXT_CONNECT_DIST
                txtOffCtx.globalAlpha = t * 0.45
                txtOffCtx.strokeStyle = primary
                txtOffCtx.beginPath()
                txtOffCtx.moveTo(pi.x, pi.y)
                txtOffCtx.lineTo(pj.x, pj.y)
                txtOffCtx.stroke()
            }
        }
    }
    txtOffCtx.globalCompositeOperation = 'source-over'

    // Clip everything to the text letterforms using destination-in
    const fontPx = Math.round(80 * sc)
    txtOffCtx.globalCompositeOperation = 'destination-in'
    txtOffCtx.globalAlpha = 1
    txtOffCtx.fillStyle   = '#fff'
    txtOffCtx.font        = `bold ${fontPx}px Montserrat, sans-serif`
    txtOffCtx.textAlign   = 'center'
    txtOffCtx.textBaseline = 'alphabetic'
    txtOffCtx.fillText('Building things', rect.left + 200 * sc, rect.top + 115 * sc)
    txtOffCtx.globalCompositeOperation = 'source-over'

    ctxTxt.clearRect(0, 0, canvasW, canvasH)
    ctxTxt.drawImage(txtOff, 0, 0)
}

// ─── Resize ───────────────────────────────────────────────────────────────────
function resizeCanvases() {
    const w = window.innerWidth
    const h = window.innerHeight
    canvasW = w
    canvasH = h
    ;[grainCanvas, layer0Canvas, layer1Canvas, layer2Canvas, textParticleCanvas].forEach(r => {
        if (!r.value) return
        r.value.width  = w
        r.value.height = h
    })
    if (txtOff) { txtOff.width = w; txtOff.height = h }
    initShells()
    if (txtSamples.length) buildTextParticles()
}

// ─── Render loop ──────────────────────────────────────────────────────────────
let animFrameId = null
let frameCount  = 0

function animate() {
    frameCount++
    smoothMouseX += (mouseX - smoothMouseX) * 0.06
    smoothMouseY += (mouseY - smoothMouseY) * 0.06

    drawGlobe()
    drawTextParticles()
    if (frameCount % 2 === 0) drawGrain()

    animFrameId = requestAnimationFrame(animate)
}

// ─── SVG cursor helpers ───────────────────────────────────────────────────────
function getSvgCoords(e) {
    const pt = svgEl.value.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    return pt.matrixTransform(svgEl.value.getScreenCTM().inverse())
}

function onTextEnter() {
    isHovering = true
    const primary  = getPrimary()
    const svgRect  = svgEl.value.getBoundingClientRect()
    const svgScale = svgRect.width / 600
    const svgRadius = (CURSOR_SIZE * HOVER_SCALE) / 2 / svgScale
    gsap.to(cursorEl.value, {
        scaleX: HOVER_SCALE, scaleY: HOVER_SCALE, rotation: 0,
        backgroundColor: 'transparent', borderColor: primary,
        duration: 0.4, ease: 'power3.out', overwrite: 'auto',
    })
    gsap.to([clipCircle.value, maskCircle.value], {
        attr: { r: svgRadius }, duration: 0.4, ease: 'power3.out',
    })
}

function onTextLeave() {
    isHovering = false
    const primary = getPrimary()
    gsap.to(cursorEl.value, {
        scaleX: 1, scaleY: 1, rotation: 0,
        backgroundColor: primary, borderColor: 'transparent',
        duration: 0.5, ease: 'elastic.out(1, 0.5)', overwrite: 'auto',
    })
    gsap.to([clipCircle.value, maskCircle.value], {
        attr: { r: 0 }, duration: 0.3, ease: 'power3.in',
    })
}

function onLinkEnter() {
    isOnLink = true
    morphTween?.pause()
    // 3-corner right-pointing triangle with rounded corners, coords within 50×50 div
    cursorEl.value.style.clipPath = "path('M 16 15 L 35 23 Q 40 25 35 27 L 16 35 Q 10 38 10 31 L 10 19 Q 10 12 16 15 Z')"
    gsap.to(cursorEl.value, {
        scaleX: 0.9, scaleY: 0.9, rotation: 45,
        borderRadius: '0%',
        duration: 0.2, ease: 'power3.out', overwrite: 'auto',
    })
}

function onLinkLeave() {
    isOnLink = false
    cursorEl.value.style.clipPath = ''
    gsap.to(cursorEl.value, {
        scaleX: 1, scaleY: 1, rotation: 0,
        borderRadius: '50%',
        duration: 0.35, ease: 'power3.out', overwrite: 'auto',
        onComplete: () => morphTween?.play(),
    })
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────
let onMouseMove = null
let onDocMouseOver = null
let onDocMouseOut = null

onMounted(() => {
    const primary = getPrimary()
    gsap.set(cursorEl.value, { xPercent: -50, yPercent: -50, backgroundColor: primary })

    // Cache canvas contexts
    ctx0   = layer0Canvas.value.getContext('2d')
    ctx1   = layer1Canvas.value.getContext('2d')
    ctx2   = layer2Canvas.value.getContext('2d')
    ctxTxt = textParticleCanvas.value.getContext('2d')

    // Offscreen canvas for text-particle destination-in clipping
    txtOff        = document.createElement('canvas')
    txtOff.width  = window.innerWidth
    txtOff.height = window.innerHeight
    txtOffCtx     = txtOff.getContext('2d')

    createGrainOffscreen()
    resizeCanvases()
    window.addEventListener('resize', resizeCanvases)
    animate()

    const textBBox = svgEl.value.querySelector('.fill-layer').getBBox()

  
    gsap.ticker.add(() => {
        const moved = prevX !== tickerX || prevY !== tickerY
        if (!moved && wasMoving && !isHovering && !isOnLink) {
            gsap.to(cursorEl.value, {
                scaleX: 1, scaleY: 1,
                duration: 0.25, ease: 'back.out(2.5)', overwrite: 'auto',
            })
        }
        wasMoving = moved
        tickerX = prevX
        tickerY = prevY
    })

    morphTween = gsap.to(cursorEl.value, {
        keyframes: [
            { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', duration: 2 },
            { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%', duration: 2 },
            { borderRadius: '50% 60% 30% 40% / 40% 50% 60% 50%', duration: 2 },
            { borderRadius: '50% 50% 50% 50% / 50% 50% 50% 50%', duration: 1.5 },
        ],
        repeat: -1, ease: 'sine.inOut',
    })

    onMouseMove = (e) => {
        mouseX = e.clientX
        mouseY = e.clientY

        const dx = e.clientX - prevX
        const dy = e.clientY - prevY
        prevX = e.clientX
        prevY = e.clientY

        const speed   = Math.sqrt(dx * dx + dy * dy)
        const angle   = Math.atan2(dy, dx) * (180 / Math.PI)
        const stretch = Math.min(1 + speed * 3.05, 1.3)

        gsap.to(cursorEl.value, {
            x: e.clientX, y: e.clientY,
            duration: 0.4, ease: 'power3.out', overwrite: 'auto',
        })

        if (!isHovering && !isOnLink) {
            gsap.to(cursorEl.value, {
                scaleX: stretch, scaleY: 1 / stretch, rotation: angle,
                duration: 0.1, ease: 'none', overwrite: 'auto',
            })
        } else if (isOnLink && speed > 0.5) {
            gsap.to(cursorEl.value, {
                rotation: angle,
                duration: 0.5, ease: 'power2.out', overwrite: 'auto',
            })
        }

        const { x, y } = getSvgCoords(e)
        gsap.to([clipCircle.value, maskCircle.value], {
            attr: { cx: x, cy: y }, duration: 0.45, ease: 'power3.out',
        })

        const overText = x >= textBBox.x && x <= textBBox.x + textBBox.width
            && y >= textBBox.y && y <= textBBox.y + textBBox.height
        if (overText && !isHovering) onTextEnter()
        else if (!overText && isHovering) onTextLeave()
    }

    onDocMouseOver = (e) => {
        const link = e.target.closest('a')
        if (link && !isOnLink && !isHovering) onLinkEnter()
    }

    onDocMouseOut = (e) => {
        const link = e.target.closest('a')
        if (link && isOnLink && !e.relatedTarget?.closest('a')) onLinkLeave()
    }

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', onDocMouseOver)
    document.addEventListener('mouseout', onDocMouseOut)

    // Sample text pixels once fonts are ready, then spawn particles
    document.fonts.ready.then(() => {
        sampleTextPixels()
        buildTextParticles()
    })
})

onUnmounted(() => {
    if (animFrameId) cancelAnimationFrame(animFrameId)
    window.removeEventListener('resize', resizeCanvases)
    if (onMouseMove) window.removeEventListener('mousemove', onMouseMove)
    if (onDocMouseOver) document.removeEventListener('mouseover', onDocMouseOver)
    if (onDocMouseOut) document.removeEventListener('mouseout', onDocMouseOut)
})
</script>

<style scoped>
.page-root {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background:
        radial-gradient(ellipse 80% 60% at 25% 50%, color-mix(in srgb, var(--ui-primary) 18%, transparent) 0%, transparent 70%),
        radial-gradient(ellipse 50% 40% at 75% 60%, color-mix(in srgb, var(--ui-primary) 8%, transparent) 0%, transparent 60%);
}

/* ─── Particle canvases ──────────────────────────────────────────────────── */
.particle-canvas {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

/*
 * Depth-of-field blur via CSS filter — GPU-accelerated.
 * Far layer: most blur + slightly dimmed
 * Mid layer: just a hint of blur
 * Near layer: razor sharp
 */
.layer-0 { z-index: 3; filter: blur(5px);   opacity: 0.80; }
.layer-1 { z-index: 4; filter: blur(1.5px); }
.layer-2 { z-index: 5; filter: blur(0.5px); }

/* ─── Grain ──────────────────────────────────────────────────────────────── */
.grain-canvas {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 10;
    mix-blend-mode: soft-light;
    opacity: 0.55;
}

/* ─── Text particles ─────────────────────────────────────────────────────── */
.text-particle-canvas {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 8;
}

/* ─── Cursor ─────────────────────────────────────────────────────────────── */
.cursor-dot {
    position: fixed;
    top: 0;
    left: 0;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 0px solid transparent;
    pointer-events: none;
    z-index: 9999;
}

/* ─── SVG text ───────────────────────────────────────────────────────────── */
.intro-stroke-1,
.intro-stroke-2,
.intro-stroke-3,
.stroke-1,
.stroke-2,
.stroke-3 {
    fill: none;
    stroke: var(--ui-primary);
    stroke-linecap: round;
    stroke-linejoin: round;
}

.intro-stroke-1,
.intro-stroke-2,
.intro-stroke-3 {
    stroke-dasharray: 3000;
    stroke-dashoffset: 3000;
}

.intro-stroke-1 { stroke-width: 2; opacity: 1; animation: draw-stroke 10.8s ease forwards 0s; }
.intro-stroke-2 { stroke-width: 2; opacity: 1; animation: draw-stroke 20.8s ease forwards 0.1s; }
.intro-stroke-3 { stroke-width: 2; opacity: 1; animation: draw-stroke 30.8s ease forwards 0.2s; }

.stroke-1,
.stroke-2,
.stroke-3 {
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
}

.stroke-1 { stroke-width: 1; opacity: 1; }
.stroke-2 { stroke-width: 1; opacity: 1; }
.stroke-3 { stroke-width: 1; opacity: 1; }

.fill-layer {
    fill: currentColor;
    stroke: none;
    fill-opacity: 0;
    animation: fill-in 1.8s ease forwards .5s;
}

@keyframes draw-stroke { to { stroke-dashoffset: 0; } }
@keyframes fill-in     { to { fill-opacity: 1; } }
</style>
