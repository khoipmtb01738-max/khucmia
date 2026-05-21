// Mô phỏng 5 đội lần lượt chơi: đi tới vị trí → xoay 5 vòng →
// chạy đến ống → rút 1 thanh trong 10s → chạy về.

import { useState, useEffect, useRef } from 'react'
import { makeTube } from './Tube.jsx'
import { Icon } from './Icon.jsx'

const TEAMS = [
  { name: 'Đội 1', color: '#dc2626' },
  { name: 'Đội 2', color: '#0ea5e9' },
  { name: 'Đội 3', color: '#16a34a' },
  { name: 'Đội 4', color: '#f59e0b' },
  { name: 'Đội 5', color: '#a855f7' },
]

const PHASE_LABEL = {
  idle: 'Đang chờ',
  walking: 'Đi tới vạch xoay',
  spinning: 'Xoay tại chỗ 5 vòng',
  running: 'Chạy đến ống nhựa',
  pulling: 'Rút 1 thanh gỗ',
  returning: 'Chạy về chỗ đội',
}

const PHASE_ICON = {
  walking: 'walk',
  spinning: 'person',
  running: 'run',
  pulling: 'hand',
  returning: 'run',
}

// Thời gian cơ sở (ms) cho từng pha (chia cho speed)
const PHASE_DURATION = {
  walking: 1500,
  spinning: 3500,
  running: 1500,
  pulling: 10000,
  returning: 1500,
}

// Vị trí trái (%) của player trong lane theo từng pha
const PLAYER_LEFT = {
  idle: 5,
  walking: 32,
  spinning: 32,
  running: 80,
  pulling: 80,
  returning: 5,
}

function makeTubes() {
  return TEAMS.map((t, i) => makeTube(i, t.name, t.color))
}

// --- Mini SVG ống nhựa cho từng lane ---
function MiniTube({ tube }) {
  const remaining = tube.balls.length - tube.lost
  const visibleBalls = tube.balls.slice(0, remaining)
  return (
    <svg viewBox="0 0 100 240" className="mini-tube">
      <defs>
        <linearGradient id={`mini-glass-${tube.id}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.6" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="14" rx="33" ry="5" fill="#cbd5e1" />
      <rect x="16" y="14" width="68" height="210" fill={`url(#mini-glass-${tube.id})`} stroke="#94a3b8" strokeWidth="1.4" rx="4" />
      <rect x="22" y="20" width="3" height="200" fill="#fff" opacity="0.85" />
      {visibleBalls.map((b) => (
        <g key={b.id}>
          <circle cx={b.cx} cy={b.cy} r="6" fill={b.color} />
          <circle cx={b.cx - 1.5} cy={b.cy - 1.7} r="1.5" fill="#fff" opacity="0.85" />
        </g>
      ))}
      {tube.sticks.map(
        (s) =>
          s.present && (
            <line
              key={s.id}
              x1="4"
              y1={s.y}
              x2="96"
              y2={s.y + Math.sin((s.angle * Math.PI) / 180) * 8}
              stroke={s.color}
              strokeWidth="3"
              strokeLinecap="round"
            />
          ),
      )}
    </svg>
  )
}

// --- 1 hàng / lane của 1 đội ---
function Lane({ team, tube, isActive, phase, pullTimer, speed, spinCount }) {
  const playerLeft = PLAYER_LEFT[phase] ?? 5
  const baseMs = PHASE_DURATION[phase] || 0
  const moving = phase === 'walking' || phase === 'running' || phase === 'returning'
  const transMs = moving ? baseMs / speed : 0
  const remaining = tube.balls.length - tube.lost

  return (
    <div className={`lane ${isActive ? 'lane-active' : ''}`}>
      <div className="lane-team-area" style={{ borderColor: team.color }}>
        <div className="lane-team-name" style={{ background: team.color }}>{team.name}</div>
        <div className="lane-team-roster">
          <Icon name="users" size={24} strokeWidth={1.8} />
        </div>
        <div className="lane-team-status">
          {isActive ? (
            <span className="lane-cheering">
              <Icon name="megaphone" size={13} /> Đang chơi
            </span>
          ) : (
            <span>Chờ lượt</span>
          )}
        </div>
      </div>

      <div className="lane-track">
        <div className="lane-line" />
        <div className="lane-ground">
          <span className="lane-pos-label lane-pos-start">Xuất phát</span>
          <span className="lane-pos-label lane-pos-spin">Vạch xoay</span>
          <span className="lane-pos-label lane-pos-tube">Ống nhựa</span>
        </div>

        {/* Vạch xoay */}
        <div className="lane-spin-mark">✕</div>

        {/* Ống nhựa của đội này */}
        <div className="lane-tube-wrap">
          <MiniTube tube={tube} />
          <div className="lane-tube-count" style={{ color: team.color }}>
            <strong>{remaining}</strong>/15
          </div>
        </div>

        {/* Người chơi */}
        {isActive && phase !== 'idle' && (
          <div
            className={`player-char phase-${phase}`}
            style={{
              left: `${playerLeft}%`,
              transitionDuration: `${transMs}ms`,
              color: team.color,
            }}
          >
            <span className="char-emoji">
              <Icon name={PHASE_ICON[phase]} size={40} strokeWidth={1.9} />
            </span>
            {phase === 'spinning' && (
              <div className="char-tag char-tag-spin">{spinCount}/5 vòng</div>
            )}
            {phase === 'pulling' && (
              <div className="char-tag char-tag-timer">
                <Icon name="stopwatch" size={12} /> {pullTimer}s
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// --- Component chính ---
export function PlaySim() {
  const [tubes, setTubes] = useState(makeTubes)
  const [currentTeam, setCurrentTeam] = useState(0)
  const [phase, setPhase] = useState('idle')
  const [isPlaying, setIsPlaying] = useState(false)
  const [pullTimer, setPullTimer] = useState(10)
  const [spinCount, setSpinCount] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [lastEvent, setLastEvent] = useState(null) // {team, fell}
  const [isDone, setIsDone] = useState(false)

  const phaseTimer = useRef(null)
  const tickIv = useRef(null)

  function clearAll() {
    if (phaseTimer.current) clearTimeout(phaseTimer.current)
    if (tickIv.current) clearInterval(tickIv.current)
  }

  function reset() {
    clearAll()
    setTubes(makeTubes())
    setCurrentTeam(0)
    setPhase('idle')
    setIsPlaying(false)
    setPullTimer(10)
    setSpinCount(0)
    setLastEvent(null)
    setIsDone(false)
  }

  function start() {
    if (isDone) {
      reset()
      setTimeout(() => {
        setIsPlaying(true)
        setPhase('walking')
      }, 50)
      return
    }
    setIsPlaying(true)
    if (phase === 'idle') setPhase('walking')
  }

  function pause() {
    clearAll()
    setIsPlaying(false)
  }

  function applyPull(teamIdx) {
    setTubes((prev) =>
      prev.map((t, i) => {
        if (i !== teamIdx) return t
        const remaining = t.sticks.filter((s) => s.present)
        if (remaining.length === 0) return t
        const pick = remaining[Math.floor(Math.random() * remaining.length)]
        const sticksAfter = remaining.length - 1
        const pFall = 1 / (sticksAfter + 3)
        const remBalls = t.balls.length - t.lost
        let fell = 0
        for (let j = 0; j < remBalls; j++) if (Math.random() < pFall) fell++
        fell = Math.min(fell, remBalls)
        setLastEvent({ team: teamIdx, fell })
        return {
          ...t,
          sticks: t.sticks.map((s) => (s.id === pick.id ? { ...s, present: false } : s)),
          lost: t.lost + fell,
        }
      }),
    )
  }

  // Trạng thái thay đổi → lên lịch pha kế tiếp
  useEffect(() => {
    if (!isPlaying || phase === 'idle') return
    clearAll()

    const dur = PHASE_DURATION[phase] / speed

    if (phase === 'spinning') {
      setSpinCount(0)
      const tickMs = (PHASE_DURATION.spinning / 5) / speed
      let v = 0
      tickIv.current = setInterval(() => {
        v += 1
        setSpinCount(v)
        if (v >= 5) clearInterval(tickIv.current)
      }, tickMs)
    }

    if (phase === 'pulling') {
      setPullTimer(10)
      const tickMs = 1000 / speed
      tickIv.current = setInterval(() => {
        setPullTimer((t) => Math.max(0, t - 1))
      }, tickMs)
    }

    phaseTimer.current = setTimeout(() => {
      if (tickIv.current) clearInterval(tickIv.current)
      if (phase === 'walking') setPhase('spinning')
      else if (phase === 'spinning') setPhase('running')
      else if (phase === 'running') setPhase('pulling')
      else if (phase === 'pulling') {
        applyPull(currentTeam)
        setPhase('returning')
      } else if (phase === 'returning') {
        if (currentTeam < TEAMS.length - 1) {
          setCurrentTeam((t) => t + 1)
          setPhase('walking')
        } else {
          setIsPlaying(false)
          setIsDone(true)
          setPhase('idle')
        }
      }
    }, dur)

    return clearAll
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, isPlaying, currentTeam, speed])

  useEffect(() => () => clearAll(), [])

  const winner =
    isDone &&
    tubes.reduce((best, t) =>
      t.balls.length - t.lost > best.balls.length - best.lost ? t : best,
    )

  return (
    <div className="playsim">
      {/* Thanh trạng thái */}
      <div className="playsim-status">
        {isDone && winner ? (
          <>
            <Icon name="trophy" size={20} />
            <span>Đội chiến thắng:</span>
            <strong style={{ color: winner.teamColor }}>{winner.name}</strong>
            <span>· còn {winner.balls.length - winner.lost}/15 banh</span>
          </>
        ) : isPlaying ? (
          <>
            <Icon name="arrowRight" size={18} />
            <span>Lượt:</span>
            <strong style={{ color: TEAMS[currentTeam].color }}>
              {TEAMS[currentTeam].name}
            </strong>
            <span>·</span>
            <strong>{PHASE_LABEL[phase]}</strong>
            {phase === 'pulling' && (
              <span className="status-timer">
                <Icon name="stopwatch" size={14} /> {pullTimer}s
              </span>
            )}
          </>
        ) : (
          <span>Nhấn <strong>Bắt đầu</strong> để xem 5 đội lần lượt chơi mô phỏng.</span>
        )}
      </div>

      {/* Điều khiển */}
      <div className="playsim-controls">
        {!isPlaying ? (
          <button className="btn btn-primary btn-lg" onClick={start}>
            <Icon name="play" size={18} />
            {isDone ? 'Chơi lại' : phase === 'idle' ? 'Bắt đầu mô phỏng' : 'Tiếp tục'}
          </button>
        ) : (
          <button className="btn btn-outline btn-lg" onClick={pause}>
            <Icon name="pause" size={18} /> Tạm dừng
          </button>
        )}
        <button className="btn btn-outline" onClick={reset}>
          <Icon name="refresh" size={17} /> Reset
        </button>
        <div className="speed-toggle">
          <span>Tốc độ:</span>
          {[1, 2, 4].map((s) => (
            <button
              key={s}
              className={`speed-btn ${speed === s ? 'speed-active' : ''}`}
              onClick={() => setSpeed(s)}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Sự kiện gần nhất */}
      {lastEvent && (
        <div className="playsim-event">
          {lastEvent.fell === 0 ? (
            <>
              <Icon name="checkCircle" size={18} />
              <span><strong>{TEAMS[lastEvent.team].name}</strong> rút thanh thành công — không có banh nào rơi!</span>
            </>
          ) : (
            <>
              <Icon name="alert" size={18} />
              <span><strong>{TEAMS[lastEvent.team].name}</strong> đã làm rơi <strong>{lastEvent.fell}</strong> banh khỏi ống!</span>
            </>
          )}
        </div>
      )}

      {/* Sân chơi: 5 lane */}
      <div className="playsim-field">
        {TEAMS.map((team, i) => (
          <Lane
            key={i}
            team={team}
            tube={tubes[i]}
            isActive={isPlaying && currentTeam === i}
            phase={isPlaying && currentTeam === i ? phase : 'idle'}
            pullTimer={pullTimer}
            spinCount={spinCount}
            speed={speed}
          />
        ))}
      </div>

      {/* Bảng xếp hạng nhỏ */}
      <div className="playsim-rank">
        <h4>
          <Icon name="trophy" size={18} /> Bảng banh còn lại
        </h4>
        <div className="rank-bars">
          {[...tubes]
            .map((t, i) => ({ ...t, _team: TEAMS[i] }))
            .sort((a, b) => b.balls.length - b.lost - (a.balls.length - a.lost))
            .map((t, i) => {
              const remain = t.balls.length - t.lost
              return (
                <div key={t.id} className="rank-bar-row" style={{ borderLeftColor: t._team.color }}>
                  <span className={`rank-medal rank-${i + 1}`}>{i + 1}</span>
                  <span className="rank-name">{t._team.name}</span>
                  <span className="rank-bar">
                    <span
                      className="rank-bar-fill"
                      style={{ width: `${(remain / 15) * 100}%`, background: t._team.color }}
                    />
                  </span>
                  <span className="rank-num">{remain}/15</span>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
