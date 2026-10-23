const VIEW_W = 1440

/**
 * Deterministically builds a row of grass blades for one depth layer.
 * Uses a simple sine-based pseudo-random spread so blade height, lean,
 * shade, and animation timing all vary — no two blades move identically —
 * while staying stable across re-renders (no Math.random).
 */
function makeBlades({ count, minHeight, maxHeight, minWidth, maxWidth, colors, seed }) {
  const blades = []
  for (let i = 0; i < count; i += 1) {
    const spread = count > 1 ? i / (count - 1) : 0
    const jitterX = Math.sin((i + seed) * 12.9898) * 22
    const x = spread * (VIEW_W + 80) - 40 + jitterX

    const noise = Math.sin((i + seed) * 4.51) * 0.5 + 0.5
    const height = minHeight + noise * (maxHeight - minHeight)
    const width = minWidth + ((i + seed) % 4) * ((maxWidth - minWidth) / 4)
    const lean = (i % 2 === 0 ? 1 : -1) * (7 + ((i + seed) % 5) * 3)
    const color = colors[(i + seed) % colors.length]

    const duration = 4.2 + noise * 3.4
    const delay = -(((i + seed) * 0.53) % duration)
    const swayA = -(2 + ((i + seed) % 3))
    const swayB = 2 + ((i + seed + 1) % 4)

    blades.push({ key: `b${seed}-${i}`, x, height, width, lean, color, duration, delay, swayA, swayB })
  }
  return blades
}

function GrassLayer({ blades, viewHeight, className }) {
  return (
    <div className={`grass-layer ${className}`} aria-hidden="true">
      <svg viewBox={`0 0 ${VIEW_W} ${viewHeight}`} preserveAspectRatio="none">
        {blades.map((blade) => (
          <path
            key={blade.key}
            className="grass-blade-anim"
            d={`M ${blade.x} ${viewHeight} Q ${blade.x + blade.lean * 0.6} ${
              viewHeight - blade.height * 0.55
            } ${blade.x + blade.lean} ${viewHeight - blade.height}`}
            stroke={blade.color}
            strokeWidth={blade.width}
            strokeLinecap="round"
            fill="none"
            style={{
              transformOrigin: `${blade.x}px ${viewHeight}px`,
              animationDuration: `${blade.duration}s`,
              animationDelay: `${blade.delay}s`,
              '--sway-a': `${blade.swayA}deg`,
              '--sway-b': `${blade.swayB}deg`,
            }}
          />
        ))}
      </svg>
    </div>
  )
}

const BACK_BLADES = makeBlades({
  count: 58,
  minHeight: 90,
  maxHeight: 190,
  minWidth: 6,
  maxWidth: 10,
  colors: ['#9fc496', '#8fbb85', '#79a86f'],
  seed: 11,
})

const MID_BLADES = makeBlades({
  count: 42,
  minHeight: 160,
  maxHeight: 320,
  minWidth: 10,
  maxWidth: 16,
  colors: ['#5c9a5f', '#4a8a52', '#3f7d4c'],
  seed: 5,
})

const FRONT_BLADES = makeBlades({
  count: 28,
  minHeight: 260,
  maxHeight: 460,
  minWidth: 16,
  maxWidth: 27,
  colors: ['#274f37', '#1f4d36', '#163b2a'],
  seed: 2,
})

const LEAF_PARTICLES = [
  { left: '6%', delay: '0s', duration: '17s', size: 15 },
  { left: '16%', delay: '4s', duration: '21s', size: 10 },
  { left: '28%', delay: '9s', duration: '18s', size: 13 },
  { left: '39%', delay: '1.5s', duration: '23s', size: 9 },
  { left: '52%', delay: '6s', duration: '19s', size: 16 },
  { left: '64%', delay: '11s', duration: '20s', size: 11 },
  { left: '75%', delay: '2.5s', duration: '22s', size: 12 },
  { left: '87%', delay: '8s', duration: '18s', size: 9 },
  { left: '94%', delay: '13s', duration: '24s', size: 14 },
]

const DUST_PARTICLES = [
  { left: '12%', delay: '0s', duration: '14s', size: 4 },
  { left: '33%', delay: '5s', duration: '16s', size: 3 },
  { left: '58%', delay: '2s', duration: '15s', size: 5 },
  { left: '71%', delay: '7s', duration: '13s', size: 3 },
  { left: '90%', delay: '4s', duration: '17s', size: 4 },
]

/**
 * Full-viewport, three-layer animated grass field with drifting leaves and
 * dust motes. Purely decorative — aria-hidden — and the sway/drift
 * animations are globally disabled under prefers-reduced-motion.
 */
export default function GrassField() {
  return (
    <>
      <div className="login__backdrop" aria-hidden="true" />
      <div className="login__sunlight" aria-hidden="true" />

      <GrassLayer blades={BACK_BLADES} viewHeight={220} className="grass-layer--back" />
      <GrassLayer blades={MID_BLADES} viewHeight={360} className="grass-layer--mid" />
      <GrassLayer blades={FRONT_BLADES} viewHeight={500} className="grass-layer--front" />

      <div className="leaf-particles" aria-hidden="true">
        {LEAF_PARTICLES.map((leaf, i) => (
          <svg
            key={i}
            className="leaf-particle"
            style={{ left: leaf.left, animationDelay: leaf.delay, animationDuration: leaf.duration }}
            width={leaf.size}
            height={leaf.size}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M3 21c0-10 6-17 18-17-1 10-7 17-18 17Z" />
          </svg>
        ))}
        {DUST_PARTICLES.map((dust, i) => (
          <span
            key={`dust-${i}`}
            className="dust-particle"
            style={{
              left: dust.left,
              width: dust.size,
              height: dust.size,
              animationDelay: dust.delay,
              animationDuration: dust.duration,
            }}
          />
        ))}
      </div>

      <div className="login__scrim" aria-hidden="true" />
      <div className="login__vignette" aria-hidden="true" />
    </>
  )
}
