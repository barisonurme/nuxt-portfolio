<template>
    <div class="relative flex flex-col justify-center items-center w-full h-full">
        <div ref="cursorEl" class="cursor-dot" />

        <div class="flex w-full h-[calc(100vh-400px)] justify-center items-center">
        <svg ref="svgEl" viewBox="0 0 600 150" class="w-full max-w-2xl overflow-visible">
            <defs>
                <clipPath id="cursor-clip">
                    <circle ref="clipCircle" cx="-200" cy="-200" r="0" />
                </clipPath>
                <mask id="fill-mask">
                    <rect x="-100" y="-100" width="800" height="350" fill="white" />
                    <circle ref="maskCircle" cx="-200" cy="-200" r="0" fill="black" />
                </mask>
            </defs>

    <!-- Intro strokes: visible everywhere, play once on load -->
    <g>
        <text x="50%" y="115" text-anchor="middle" font-size="100" font-weight="700" font-family="Montserrat, sans-serif" class="intro-stroke-1">Building</text>
        <text x="50%" y="115" text-anchor="middle" font-size="100" font-weight="700" font-family="Montserrat, sans-serif" class="intro-stroke-2">Building</text>
        <text x="50%" y="115" text-anchor="middle" font-size="100" font-weight="700" font-family="Montserrat, sans-serif" class="intro-stroke-3">Building</text>
    </g>

    <text
    x="50%" y="115"
    text-anchor="middle"
    font-size="100" font-weight="700" font-family="Montserrat, sans-serif"
    class="fill-layer"
    mask="url(#fill-mask)"
    >Building</text>

    <g clip-path="url(#cursor-clip)" style="pointer-events: none">
        <text x="50%" y="115" text-anchor="middle" font-size="100" font-weight="700" font-family="Montserrat, sans-serif" class="stroke-1">Building</text>
        <text x="50%" y="115" text-anchor="middle" font-size="100" font-weight="700" font-family="Montserrat, sans-serif" class="stroke-2">Building</text>
        <text x="50%" y="115" text-anchor="middle" font-size="100" font-weight="700" font-family="Montserrat, sans-serif" class="stroke-3">Building</text>
    </g>
</svg>
</div>
</div>
</template>

<script setup>
import { gsap } from 'gsap'

const cursorEl = ref(null)
const svgEl = ref(null)
const clipCircle = ref(null)
const maskCircle = ref(null)

const HOVER_SCALE = 10
const CURSOR_SIZE = 20
let isHovering = false
let prevX = 0
let prevY = 0
let tickerX = 0
let tickerY = 0
let wasMoving = false
function getSvgCoords(e) {
    const pt = svgEl.value.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    return pt.matrixTransform(svgEl.value.getScreenCTM().inverse())
}

function onTextEnter() {
    isHovering = true
    const primary = getComputedStyle(document.documentElement).getPropertyValue('--ui-primary').trim()
    const svgRect = svgEl.value.getBoundingClientRect()
    const svgScale = svgRect.width / 600
    const svgRadius = (CURSOR_SIZE * HOVER_SCALE) / 2 / svgScale
    gsap.to(cursorEl.value, {
        scaleX: HOVER_SCALE,
        scaleY: HOVER_SCALE,
        rotation: 0,
        backgroundColor: 'transparent',
        borderColor: primary,
        duration: 0.4,
        ease: 'power3.out',
        overwrite: 'auto',
    })
    gsap.to([clipCircle.value, maskCircle.value], {
        attr: { r: svgRadius },
        duration: 0.4,
        ease: 'power3.out',
    })
}

function onTextLeave() {
    isHovering = false
    const primary = getComputedStyle(document.documentElement).getPropertyValue('--ui-primary').trim()
    gsap.to(cursorEl.value, {
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        backgroundColor: primary,
        borderColor: 'transparent',
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
        overwrite: 'auto',
    })
    gsap.to([clipCircle.value, maskCircle.value], {
        attr: { r: 0 },
        duration: 0.3,
        ease: 'power3.in',
    })
}

onMounted(() => {
    const primary = getComputedStyle(document.documentElement).getPropertyValue('--ui-primary').trim()
    gsap.set(cursorEl.value, { xPercent: -50, yPercent: -50, backgroundColor: primary })

    const textBBox = svgEl.value.querySelector('.fill-layer').getBBox()

    // Animate masked strokes via GSAP (CSS animations on SVG inside clip-path are unreliable)
    const strokeEls = svgEl.value.querySelectorAll('.stroke-1, .stroke-2, .stroke-3')
    strokeEls.forEach((el, i) => {
        gsap.fromTo(el,
            { attr: { 'stroke-dashoffset': 5000 } },
            { attr: { 'stroke-dashoffset': 0 }, duration: 2, ease: 'power2.inOut', repeat: -1, yoyo: true, delay: i * 0.4 }
        )
    })

    // Snap back to circle the frame mouse stops moving
    gsap.ticker.add(() => {
        const moved = prevX !== tickerX || prevY !== tickerY
        if (!moved && wasMoving && !isHovering) {
            gsap.to(cursorEl.value, {
                scaleX: 1,
                scaleY: 1,
                duration: 0.25,
                ease: 'back.out(2.5)',
                overwrite: 'auto',
            })
        }
        wasMoving = moved
        tickerX = prevX
        tickerY = prevY
    })

    // Ambient blob morphing at rest
    gsap.to(cursorEl.value, {
        keyframes: [
            { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', duration: 2 },
            { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%', duration: 2 },
            { borderRadius: '50% 60% 30% 40% / 40% 50% 60% 50%', duration: 2 },
            { borderRadius: '50% 50% 50% 50% / 50% 50% 50% 50%', duration: 1.5 },
        ],
        repeat: -1,
        ease: 'sine.inOut',
    })

    window.addEventListener('mousemove', (e) => {
        const dx = e.clientX - prevX
        const dy = e.clientY - prevY
        prevX = e.clientX
        prevY = e.clientY

        const speed = Math.sqrt(dx * dx + dy * dy)
        const angle = Math.atan2(dy, dx) * (180 / Math.PI)
        const stretch = Math.min(1 + speed * 3.05, 1.3)

        // Move position
        gsap.to(cursorEl.value, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.4,
            ease: 'power3.out',
            overwrite: 'auto',
        })

        // Squash & stretch in direction of travel (skip when hovering text)
        if (!isHovering) {
            gsap.to(cursorEl.value, {
                scaleX: stretch,
                scaleY: 1 / stretch,
                rotation: angle,
                duration: 0.1,
                ease: 'none',
                overwrite: 'auto',
            })
        }

        // SVG circles follow with lag
        const { x, y } = getSvgCoords(e)
        gsap.to([clipCircle.value, maskCircle.value], {
            attr: { cx: x, cy: y },
            duration: 0.45,
            ease: 'power3.out',
        })

        // Reliable hover detection via bounding box (avoids SVG pointer-events/mask bugs)
        const overText = x >= textBBox.x && x <= textBBox.x + textBBox.width
            && y >= textBBox.y && y <= textBBox.y + textBBox.height
        if (overText && !isHovering) onTextEnter()
        else if (!overText && isHovering) onTextLeave()
    })
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap');

.cursor-dot {
    position: fixed;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid transparent;
    pointer-events: none;
    z-index: 9999;
}

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
    stroke-dasharray: 5000;
    stroke-dashoffset: 5000;
}

.intro-stroke-1 { stroke-width: 3; animation: draw-stroke 10.8s ease forwards 0s; }
.intro-stroke-2 { stroke-width: 2; opacity: 0.7; animation: draw-stroke 10.8s ease forwards 0.3s; }
.intro-stroke-3 { stroke-width: 1; opacity: 0.5; animation: draw-stroke 10.8s ease forwards 0.6s; }

.stroke-1,
.stroke-2,
.stroke-3 {
    stroke-dasharray: 5000;
}

.stroke-1 { stroke-width: 3; }
.stroke-2 { stroke-width: 2; opacity: 0.7; }
.stroke-3 { stroke-width: 1; opacity: 0.5; }

.fill-layer {
    fill: currentColor;
    stroke: none;
    fill-opacity: 0;
    animation: fill-in 3.8s ease forwards 0s;
}

@keyframes draw-stroke {
    to { stroke-dashoffset: 0; }
}

@keyframes fill-in {
    to { fill-opacity: 1; }
}
</style>
