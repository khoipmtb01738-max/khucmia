// Component vẽ ống nhựa kèm thanh gỗ và banh — bằng SVG
// Click vào thanh gỗ để rút; banh có thể rơi ra ngoài

import { Icon } from './Icon.jsx'

const STICK_COLORS = ['#dc2626', '#f59e0b', '#16a34a', '#0ea5e9', '#a855f7', '#ec4899']
const BALL_COLORS = ['#fbbf24', '#fb7185', '#34d399', '#60a5fa', '#a78bfa', '#f472b6', '#fb923c']

// Sinh dữ liệu cố định cho 1 ống — gọi 1 lần khi khởi tạo
export function makeTube(id, name, teamColor) {
  const sticks = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    y: 95 + i * 14 + Math.random() * 4, // 95..207
    angle: -22 + Math.random() * 44,
    color: STICK_COLORS[i % STICK_COLORS.length],
    present: true,
  }))
  const balls = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    cx: 24 + Math.random() * 52,
    cy: 30 + Math.random() * 55,
    color: BALL_COLORS[i % BALL_COLORS.length],
  }))
  return { id, name, teamColor, sticks, balls, lost: 0, fellIds: [] }
}

export function Tube({ tube, onPullStick, highlight }) {
  const remaining = tube.balls.length - tube.lost
  const visibleBalls = tube.balls.slice(0, remaining)

  return (
    <div className={`tube-wrap ${highlight ? 'tube-highlight' : ''}`}>
      <div className="tube-name" style={{ background: tube.teamColor }}>
        {tube.name}
      </div>
      <svg viewBox="0 0 100 240" className="tube-svg">
        {/* Thân ống nhựa - hiệu ứng kính trong */}
        <defs>
          <linearGradient id={`glass-${tube.id}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.45" />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id={`stickGrad-${tube.id}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
        </defs>

        {/* Nắp trên */}
        <ellipse cx="50" cy="14" rx="34" ry="6" fill="#cbd5e1" />
        {/* Thân */}
        <rect
          x="16"
          y="14"
          width="68"
          height="210"
          fill={`url(#glass-${tube.id})`}
          stroke="#94a3b8"
          strokeWidth="1.4"
        />
        {/* Đáy mở */}
        <ellipse cx="50" cy="224" rx="34" ry="5" fill="none" stroke="#94a3b8" strokeWidth="1.4" />

        {/* Highlight ánh sáng dọc ống */}
        <rect x="22" y="18" width="4" height="200" fill="#ffffff" opacity="0.55" />

        {/* Banh */}
        {visibleBalls.map((b) => (
          <g key={b.id}>
            <circle cx={b.cx} cy={b.cy} r="6" fill={b.color} />
            <circle cx={b.cx - 1.5} cy={b.cy - 1.7} r="1.6" fill="#fff" opacity="0.85" />
          </g>
        ))}

        {/* Thanh gỗ (rút được) */}
        {tube.sticks.map(
          (s) =>
            s.present && (
              <g
                key={s.id}
                style={{ cursor: 'pointer' }}
                onClick={() => onPullStick(tube.id, s.id)}
                className="stick-g"
              >
                <line
                  x1="0"
                  y1={s.y}
                  x2="100"
                  y2={s.y + Math.sin((s.angle * Math.PI) / 180) * 10}
                  stroke={s.color}
                  strokeWidth="3.4"
                  strokeLinecap="round"
                />
                {/* vùng click rộng hơn */}
                <line
                  x1="0"
                  y1={s.y}
                  x2="100"
                  y2={s.y + Math.sin((s.angle * Math.PI) / 180) * 10}
                  stroke="transparent"
                  strokeWidth="12"
                />
              </g>
            ),
        )}
      </svg>

      <div className="tube-score">
        <span className="tube-score-num">{remaining}</span>
        <span className="tube-score-lbl">/ 15 banh còn lại</span>
      </div>
      {tube.lost > 0 && (
        <div className="tube-lost">
          <Icon name="arrowDown" size={13} strokeWidth={2.4} /> Đã rơi: {tube.lost} banh
        </div>
      )}
    </div>
  )
}
