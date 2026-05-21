// Minh hoạ ống nhựa "thực tế" với hiệu ứng kính, banh bóng 3D, đũa gỗ có vân
// Dùng SVG thuần — không cần ảnh ngoài

const STICKS = [
  { y: 290, angle: 5, tone: 'light' },
  { y: 320, angle: -7, tone: 'dark' },
  { y: 348, angle: 3, tone: 'mid' },
  { y: 378, angle: -4, tone: 'light' },
  { y: 408, angle: 6, tone: 'dark' },
  { y: 438, angle: -3, tone: 'mid' },
  { y: 468, angle: 8, tone: 'light' },
  { y: 498, angle: -6, tone: 'dark' },
]

const BALLS = [
  { cx: 255, cy: 96, color: 'red' },
  { cx: 320, cy: 90, color: 'yellow' },
  { cx: 385, cy: 102, color: 'green' },
  { cx: 285, cy: 128, color: 'blue' },
  { cx: 352, cy: 132, color: 'purple' },
  { cx: 405, cy: 145, color: 'orange' },
  { cx: 245, cy: 162, color: 'pink' },
  { cx: 315, cy: 168, color: 'red' },
  { cx: 380, cy: 175, color: 'green' },
  { cx: 270, cy: 198, color: 'yellow' },
  { cx: 340, cy: 204, color: 'blue' },
  { cx: 398, cy: 210, color: 'purple' },
  { cx: 255, cy: 235, color: 'orange' },
  { cx: 320, cy: 244, color: 'pink' },
  { cx: 390, cy: 252, color: 'red' },
]

const BALL_GRADS = {
  red: { light: '#fecaca', mid: '#ef4444', dark: '#7f1d1d' },
  yellow: { light: '#fef9c3', mid: '#facc15', dark: '#854d0e' },
  green: { light: '#bbf7d0', mid: '#22c55e', dark: '#14532d' },
  blue: { light: '#dbeafe', mid: '#3b82f6', dark: '#1e3a8a' },
  purple: { light: '#e9d5ff', mid: '#a855f7', dark: '#581c87' },
  orange: { light: '#fed7aa', mid: '#fb923c', dark: '#7c2d12' },
  pink: { light: '#fbcfe8', mid: '#ec4899', dark: '#831843' },
}

const STICK_TONES = {
  light: { a: '#fde68a', b: '#d97706', c: '#92400e' },
  mid: { a: '#fbbf24', b: '#b45309', c: '#78350f' },
  dark: { a: '#d97706', b: '#92400e', c: '#451a03' },
}

const TUBE_X = 200
const TUBE_W = 240
const TUBE_Y = 60
const TUBE_H = 470
const TUBE_CX = TUBE_X + TUBE_W / 2

export function RealisticTube() {
  return (
    <svg viewBox="0 0 640 600" className="realistic-tube">
      <defs>
        {/* === Glass tube gradient (front) === */}
        <linearGradient id="glassFront" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.55" />
          <stop offset="15%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#e0f2fe" stopOpacity="0.35" />
          <stop offset="70%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.55" />
        </linearGradient>

        {/* Top rim metallic */}
        <linearGradient id="rim" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="45%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        {/* Wood gradients per tone */}
        {Object.entries(STICK_TONES).map(([k, v]) => (
          <linearGradient
            key={`wood-${k}`}
            id={`wood-${k}`}
            x1="0"
            x2="0"
            y1="0"
            y2="1"
          >
            <stop offset="0%" stopColor={v.a} />
            <stop offset="45%" stopColor={v.b} />
            <stop offset="100%" stopColor={v.c} />
          </linearGradient>
        ))}

        {/* Ball radial gradients */}
        {Object.entries(BALL_GRADS).map(([k, v]) => (
          <radialGradient
            key={`ball-${k}`}
            id={`ball-${k}`}
            cx="35%"
            cy="30%"
            r="68%"
          >
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="15%" stopColor={v.light} />
            <stop offset="55%" stopColor={v.mid} />
            <stop offset="100%" stopColor={v.dark} />
          </radialGradient>
        ))}

        {/* Floor shadow */}
        <radialGradient id="floorShade" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ===== Floor shadow ===== */}
      <ellipse cx={TUBE_CX} cy={560} rx={160} ry={20} fill="url(#floorShade)" />

      {/* ===== Tube back (glass body) ===== */}
      <rect
        x={TUBE_X}
        y={TUBE_Y}
        width={TUBE_W}
        height={TUBE_H}
        fill="url(#glassFront)"
        rx="6"
      />

      {/* ===== Holes on tube walls (drilled holes) ===== */}
      {STICKS.map((s, i) => (
        <g key={`holes-${i}`}>
          <ellipse cx={TUBE_X + 2} cy={s.y} rx={3} ry={6} fill="#0f172a" opacity="0.55" />
          <ellipse cx={TUBE_X + TUBE_W - 2} cy={s.y} rx={3} ry={6} fill="#0f172a" opacity="0.55" />
        </g>
      ))}

      {/* ===== Sticks (chopsticks through tube) ===== */}
      {STICKS.map((s, i) => {
        const stickX1 = 70
        const stickX2 = 570
        const stickLen = stickX2 - stickX1
        const stickH = 9
        return (
          <g
            key={`stick-${i}`}
            transform={`rotate(${s.angle} ${TUBE_CX} ${s.y})`}
          >
            {/* shadow line under stick */}
            <rect
              x={stickX1 + 2}
              y={s.y - stickH / 2 + 3}
              width={stickLen}
              height={stickH * 0.7}
              fill="#000"
              opacity="0.18"
              rx={stickH / 2}
            />
            {/* stick body */}
            <rect
              x={stickX1}
              y={s.y - stickH / 2}
              width={stickLen}
              height={stickH}
              fill={`url(#wood-${s.tone})`}
              rx={stickH / 2}
            />
            {/* wood grain lines */}
            <line
              x1={stickX1 + 6}
              y1={s.y - 1.5}
              x2={stickX2 - 6}
              y2={s.y - 1.5}
              stroke="#451a03"
              strokeWidth="0.4"
              opacity="0.5"
              strokeDasharray="20 5 8 12"
            />
            <line
              x1={stickX1 + 6}
              y1={s.y + 1.5}
              x2={stickX2 - 6}
              y2={s.y + 1.5}
              stroke="#78350f"
              strokeWidth="0.3"
              opacity="0.45"
              strokeDasharray="14 8 22 4"
            />
            {/* highlight on top */}
            <line
              x1={stickX1 + 4}
              y1={s.y - stickH / 2 + 1.4}
              x2={stickX2 - 4}
              y2={s.y - stickH / 2 + 1.4}
              stroke="#fef3c7"
              strokeWidth="0.6"
              opacity="0.55"
            />
            {/* darker tips */}
            <ellipse cx={stickX1 + 2} cy={s.y} rx={3} ry={stickH / 2} fill="#451a03" opacity="0.7" />
            <ellipse cx={stickX2 - 2} cy={s.y} rx={3} ry={stickH / 2} fill="#451a03" opacity="0.7" />
          </g>
        )
      })}

      {/* ===== Balls inside tube ===== */}
      {BALLS.map((b, i) => (
        <g key={`ball-${i}`}>
          {/* contact shadow under ball */}
          <ellipse cx={b.cx + 1} cy={b.cy + 20} rx={16} ry={3} fill="#000" opacity="0.15" />
          {/* ball body */}
          <circle cx={b.cx} cy={b.cy} r="22" fill={`url(#ball-${b.color})`} />
          {/* main highlight */}
          <ellipse cx={b.cx - 6} cy={b.cy - 8} rx="6" ry="4" fill="#fff" opacity="0.85" />
          {/* small bottom rim light */}
          <ellipse cx={b.cx + 4} cy={b.cy + 12} rx="6" ry="2" fill="#fff" opacity="0.18" />
        </g>
      ))}

      {/* ===== Front glass effects (on top of everything) ===== */}
      {/* Subtle inner shading on right */}
      <rect
        x={TUBE_X + TUBE_W - 22}
        y={TUBE_Y + 6}
        width={20}
        height={TUBE_H - 12}
        fill="#0c4a6e"
        opacity="0.1"
        rx="6"
      />
      {/* Bright left highlight stripes */}
      <rect
        x={TUBE_X + 10}
        y={TUBE_Y + 8}
        width={9}
        height={TUBE_H - 16}
        fill="#fff"
        opacity="0.85"
        rx="4"
      />
      <rect
        x={TUBE_X + 24}
        y={TUBE_Y + 8}
        width={3}
        height={TUBE_H - 16}
        fill="#fff"
        opacity="0.55"
        rx="2"
      />

      {/* ===== Top rim cap ===== */}
      <ellipse cx={TUBE_CX} cy={TUBE_Y} rx={TUBE_W / 2 + 4} ry="11" fill="url(#rim)" />
      <ellipse cx={TUBE_CX} cy={TUBE_Y - 1} rx={TUBE_W / 2} ry="7" fill="#cbd5e1" />
      <ellipse cx={TUBE_CX} cy={TUBE_Y - 2} rx={TUBE_W / 2 - 6} ry="4" fill="#f1f5f9" />

      {/* ===== Bottom open rim ===== */}
      <ellipse
        cx={TUBE_CX}
        cy={TUBE_Y + TUBE_H}
        rx={TUBE_W / 2}
        ry="10"
        fill="#0f172a"
        opacity="0.35"
      />
      <ellipse
        cx={TUBE_CX}
        cy={TUBE_Y + TUBE_H}
        rx={TUBE_W / 2}
        ry="10"
        fill="none"
        stroke="#475569"
        strokeWidth="2.2"
      />

      {/* ===== Tube outline ===== */}
      <rect
        x={TUBE_X}
        y={TUBE_Y}
        width={TUBE_W}
        height={TUBE_H}
        fill="none"
        stroke="#475569"
        strokeWidth="2.2"
        rx="6"
      />
    </svg>
  )
}
