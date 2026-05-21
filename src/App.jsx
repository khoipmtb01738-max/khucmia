import { useState, useEffect, useRef } from 'react'
import {
  GAME_META,
  STAFF,
  EQUIPMENT,
  RULES,
  PLAY_STEPS,
  TIPS,
} from './data.js'
import { Tube, makeTube } from './Tube.jsx'
import { RealisticTube } from './RealisticTube.jsx'
import { PlaySim } from './PlaySim.jsx'
import { Icon } from './Icon.jsx'

const TEAM_PRESET = [
  { name: 'Đội 1', color: '#dc2626' },
  { name: 'Đội 2', color: '#0ea5e9' },
  { name: 'Đội 3', color: '#16a34a' },
  { name: 'Đội 4', color: '#f59e0b' },
  { name: 'Đội 5', color: '#a855f7' },
]

const NAV_ITEMS = [
  { id: 'hero', icon: 'home', label: 'Giới thiệu' },
  { id: 'staff', icon: 'users', label: 'Đội phụ trách' },
  { id: 'equipment', icon: 'toolbox', label: 'Đạo cụ' },
  { id: 'showcase', icon: 'search', label: 'Minh hoạ' },
  { id: 'rules', icon: 'scroll', label: 'Luật chơi' },
  { id: 'howto', icon: 'target', label: 'Cách chơi' },
  { id: 'playsim', icon: 'film', label: 'Mô phỏng người chơi' },
  { id: 'sim', icon: 'flask', label: 'Thử rút thanh' },
  { id: 'tips', icon: 'bulb', label: 'Mẹo dẫn' },
]

function initialTubes() {
  return TEAM_PRESET.map((t, i) => makeTube(i, t.name, t.color))
}

export default function App() {
  // ---- simulation state ----
  const [tubes, setTubes] = useState(initialTubes())
  const [lastPull, setLastPull] = useState(null) // {tubeId, fell}

  // ---- demo walkthrough state ----
  const [demoStep, setDemoStep] = useState(0) // 0=idle, 1..5
  const [demoTimer, setDemoTimer] = useState(10)
  const demoTimers = useRef([])

  // ---- mobile nav ----
  const [navOpen, setNavOpen] = useState(false)

  // pull a stick from a tube
  function pullStick(tubeId, stickId) {
    setTubes((prev) =>
      prev.map((t) => {
        if (t.id !== tubeId) return t
        const stick = t.sticks.find((s) => s.id === stickId)
        if (!stick || !stick.present) return t

        const sticksBefore = t.sticks.filter((s) => s.present).length
        const sticksAfter = sticksBefore - 1
        const pFall = 1 / (sticksAfter + 3)
        const remaining = t.balls.length - t.lost

        let fell = 0
        for (let i = 0; i < remaining; i++) {
          if (Math.random() < pFall) fell++
        }
        fell = Math.min(fell, remaining)
        setLastPull({ tubeId, fell })

        return {
          ...t,
          sticks: t.sticks.map((s) =>
            s.id === stickId ? { ...s, present: false } : s,
          ),
          lost: t.lost + fell,
        }
      }),
    )
  }

  function resetTubes() {
    setTubes(initialTubes())
    setLastPull(null)
    stopDemo()
  }

  function stopDemo() {
    demoTimers.current.forEach(clearTimeout)
    demoTimers.current = []
    setDemoStep(0)
    setDemoTimer(10)
  }

  function startDemo() {
    stopDemo()
    setDemoStep(1)
    const sched = (ms, fn) => demoTimers.current.push(setTimeout(fn, ms))
    sched(1500, () => setDemoStep(2)) // → xoay 5 vòng
    sched(4800, () => setDemoStep(3)) // → chạy đến ống
    sched(6300, () => setDemoStep(4)) // → rút thanh (10s)
    sched(16300, () => setDemoStep(5)) // → chạy về
    sched(17800, () => setDemoStep(0)) // → kết thúc
  }

  // countdown when demoStep === 4
  useEffect(() => {
    if (demoStep !== 4) return
    setDemoTimer(10)
    const iv = setInterval(() => {
      setDemoTimer((t) => {
        if (t <= 1) {
          clearInterval(iv)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(iv)
  }, [demoStep])

  // cleanup on unmount
  useEffect(() => () => stopDemo(), [])

  // scroll to section
  function scrollTo(id) {
    setNavOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="page">
      {/* ===== NAVBAR ===== */}
      <header className="navbar">
        <div className="nav-inner">
          <div className="nav-brand">
            <span className="nav-icon">
              <Icon name="leaf" size={26} strokeWidth={1.8} />
            </span>
            <div>
              <div className="nav-title">{GAME_META.name}</div>
              <div className="nav-sub">Trò chơi số {GAME_META.number} · {GAME_META.event}</div>
            </div>
          </div>
          <button
            className="nav-toggle"
            onClick={() => setNavOpen((o) => !o)}
            aria-label="Mở/đóng menu"
            aria-expanded={navOpen}
          >
            <Icon name={navOpen ? 'x' : 'menu'} size={24} />
          </button>
          <nav className={`nav-links ${navOpen ? 'nav-open' : ''}`}>
            {NAV_ITEMS.map((n) => (
              <button key={n.id} className="nav-btn" onClick={() => scrollTo(n.id)}>
                <Icon name={n.icon} size={16} />
                <span>{n.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section id="hero" className="hero">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        <div className="hero-inner">
          <div className="hero-badge">
            <Icon name="leaf" size={16} strokeWidth={2} /> Trò chơi số {GAME_META.number}
          </div>
          <h1 className="hero-title">
            <span>Khúc Mía</span>
            <span className="hero-title-accent">Nấu Thành Cơm</span>
          </h1>
          <div className="hero-event">{GAME_META.event}</div>
          <p className="hero-desc">
            Mô phỏng & hướng dẫn trò chơi để Phụ Trách Chính và các Cộng Tác Viên
            cùng hiểu luật, nắm vai trò và tự tin dẫn trò chơi cho các em.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary" onClick={() => scrollTo('howto')}>
              <Icon name="target" size={18} /> Xem cách chơi
            </button>
            <button className="btn btn-outline" onClick={() => scrollTo('sim')}>
              <Icon name="flask" size={18} /> Vào mô phỏng
            </button>
          </div>
          <div className="hero-stats">
            <div><strong>9</strong><span>Ống nhựa</span></div>
            <div><strong>15</strong><span>Banh / ống</span></div>
            <div><strong>10s</strong><span>Mỗi lượt</span></div>
            <div><strong>5</strong><span>Người phụ trách</span></div>
          </div>
        </div>
      </section>

      {/* ===== STAFF ===== */}
      <section id="staff" className="section section-alt">
        <div className="section-head">
          <span className="section-eyebrow">
            <Icon name="users" size={14} /> Đội phụ trách
          </span>
          <h2>Ai làm gì trong trò chơi?</h2>
          <p>5 người phụ trách — mỗi người 1 vai trò rõ ràng để trò chơi diễn ra trơn tru.</p>
        </div>

        {/* Lead card */}
        <div className="lead-card">
          <div className="lead-icon">
            <Icon name={STAFF.lead.icon} size={54} strokeWidth={1.6} />
          </div>
          <div className="lead-info">
            <span className="lead-role">{STAFF.lead.role}</span>
            <h3 className="lead-name">{STAFF.lead.name}</h3>
            <ul className="task-list">
              {STAFF.lead.tasks.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTV cards */}
        <div className="ctv-grid">
          {STAFF.ctvs.map((c, i) => (
            <div key={i} className="ctv-card" style={{ '--ctv-color': c.color }}>
              <div className="ctv-icon">
                <Icon name={c.icon} size={38} strokeWidth={1.7} />
              </div>
              <div className="ctv-role">{c.role}</div>
              <div className="ctv-name">{c.name}</div>
              <ul className="task-list">
                {c.tasks.map((t, j) => (
                  <li key={j}>{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ===== EQUIPMENT ===== */}
      <section id="equipment" className="section">
        <div className="section-head">
          <span className="section-eyebrow">
            <Icon name="toolbox" size={14} /> Đạo cụ chuẩn bị
          </span>
          <h2>Cần những gì để chơi?</h2>
        </div>
        <div className="equip-grid">
          {EQUIPMENT.map((e, i) => (
            <div key={i} className="equip-card">
              <div className="equip-icon">
                <Icon name={e.icon} size={42} strokeWidth={1.7} />
              </div>
              <div className="equip-label">{e.label}</div>
              <div className="equip-count">{e.count}</div>
              <div className="equip-desc">{e.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SHOWCASE — REALISTIC ILLUSTRATION ===== */}
      <section id="showcase" className="section section-alt">
        <div className="section-head">
          <span className="section-eyebrow">
            <Icon name="search" size={14} /> Minh hoạ thực tế
          </span>
          <h2>Ống nhựa khi đã lắp banh và đũa</h2>
          <p>
            Hình minh hoạ chi tiết: ống nhựa trong suốt với 15 trái banh nhiều màu
            đặt bên trong, các thanh đũa gỗ xuyên qua lỗ thân ống đỡ banh không rơi.
          </p>
        </div>

        <div className="showcase">
          <div className="showcase-labels">
            <div className="sc-label sc-label-tube">
              <span className="sc-icon"><Icon name="tube" size={26} /></span>
              <div>
                <h4>Ống nhựa trong suốt</h4>
                <p>Đứng thẳng, trong suốt để dễ quan sát banh và đũa bên trong.</p>
              </div>
            </div>
            <div className="sc-label sc-label-stick">
              <span className="sc-icon"><Icon name="stick" size={26} /></span>
              <div>
                <h4>Thanh gỗ (đũa)</h4>
                <p>Xuyên qua các lỗ ở hai bên thân ống, đỡ banh không rơi xuống.</p>
              </div>
            </div>
          </div>

          <div className="showcase-illust">
            <RealisticTube />
            <div className="sc-caption">Mô hình 1 ống — toàn trò chơi có 9 ống</div>
          </div>

          <div className="showcase-labels">
            <div className="sc-label sc-label-ball">
              <span className="sc-icon"><Icon name="circle" size={26} /></span>
              <div>
                <h4>15 trái banh</h4>
                <p>Đặt sẵn bên trong, tựa trên các thanh gỗ chắn ngang.</p>
              </div>
            </div>
            <div className="sc-label sc-label-hole">
              <span className="sc-icon"><Icon name="circleDot" size={26} /></span>
              <div>
                <h4>Lỗ xuyên thanh</h4>
                <p>Khoan sẵn ngẫu nhiên trên thân ống để xỏ đũa qua.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="sc-bottom">
          <div className="sc-label sc-label-bottom">
            <span className="sc-icon"><Icon name="arrowDown" size={26} /></span>
            <div>
              <h4>Đáy ống mở</h4>
              <p>
                Khi rút thanh đũa, banh không còn đỡ → rơi xuyên qua đáy ra ngoài.
                CTV Bích Thuỳ đếm số banh rơi sau mỗi lượt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== RULES ===== */}
      <section id="rules" className="section">
        <div className="section-head">
          <span className="section-eyebrow">
            <Icon name="scroll" size={14} /> Luật chơi
          </span>
          <h2>Quy định bắt buộc</h2>
          <p>Mọi đội chơi và CTV cần nắm 6 điều dưới đây.</p>
        </div>
        <div className="rules-grid">
          {RULES.map((r, i) => (
            <div key={i} className="rule-row">
              <div className="rule-num">{i + 1}</div>
              <div className="rule-text">{r}</div>
            </div>
          ))}
        </div>
        <div className="winner-box">
          <Icon name="trophy" size={22} />
          <span><strong>Tiêu chí thắng:</strong> Đội còn số banh trong ống NHIỀU NHẤT khi kết thúc.</span>
        </div>
      </section>

      {/* ===== HOW TO PLAY (5 STEPS) ===== */}
      <section id="howto" className="section section-alt">
        <div className="section-head">
          <span className="section-eyebrow">
            <Icon name="target" size={14} /> Cách chơi từng bước
          </span>
          <h2>Một lượt chơi gồm 5 bước</h2>
          <p>Bấm "Diễn thử 1 lượt mẫu" để xem mô phỏng nhân vật đi qua các bước.</p>
        </div>

        <div className="demo-controls">
          {demoStep === 0 ? (
            <button className="btn btn-primary btn-lg" onClick={startDemo}>
              <Icon name="play" size={18} /> Diễn thử 1 lượt mẫu
            </button>
          ) : (
            <button className="btn btn-outline btn-lg" onClick={stopDemo}>
              <Icon name="stop" size={18} /> Dừng mô phỏng
            </button>
          )}
        </div>

        <div className="steps-track">
          {PLAY_STEPS.map((s, i) => {
            const active = demoStep === s.n
            const done = demoStep > s.n
            return (
              <div
                key={s.n}
                className={`step-card ${active ? 'step-active' : ''} ${done ? 'step-done' : ''}`}
              >
                <div className="step-num">{s.n}</div>
                <div
                  className={`step-icon ${active && s.n === 2 ? 'spin-anim' : ''} ${
                    active && s.n === 3 ? 'run-anim' : ''
                  } ${active && s.n === 5 ? 'back-anim' : ''}`}
                >
                  <Icon name={s.icon} size={46} strokeWidth={1.7} />
                </div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
                {active && s.n === 4 && (
                  <div className="step-timer">
                    <Icon name="stopwatch" size={15} /> Còn {demoTimer}s
                  </div>
                )}
                {i < PLAY_STEPS.length - 1 && (
                  <div className="step-arrow">
                    <Icon name="arrowRight" size={22} strokeWidth={2.4} />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {demoStep > 0 && (
          <div className="demo-status">
            <span className="status-dot" /> Đang ở bước {demoStep}/5:{' '}
            <strong>{PLAY_STEPS[demoStep - 1].title}</strong>
          </div>
        )}
      </section>

      {/* ===== PLAY SIMULATION — characters playing ===== */}
      <section id="playsim" className="section">
        <div className="section-head">
          <span className="section-eyebrow">
            <Icon name="film" size={14} /> Mô phỏng người chơi
          </span>
          <h2>Xem 5 đội lần lượt chơi</h2>
          <p>
            Diễn lại đúng luật: mỗi đội cử 1 thành viên → đi tới vạch xoay → xoay 5 vòng →
            chạy đến ống của đội → rút 1 thanh gỗ trong 10 giây → chạy về chỗ.
            Banh có thể rơi ngẫu nhiên — đội còn nhiều banh nhất thắng.
          </p>
        </div>
        <PlaySim />
      </section>

      {/* ===== INTERACTIVE STICK PULL ===== */}
      <section id="sim" className="section section-alt">
        <div className="section-head">
          <span className="section-eyebrow">
            <Icon name="flask" size={14} /> Mô phỏng tương tác
          </span>
          <h2>Thử rút thanh gỗ — Xem banh rơi</h2>
          <p>
            5 ống mẫu (mỗi đội 1 ống). <strong>Bấm vào bất kỳ thanh gỗ nào</strong> để
            rút thử — banh có thể rơi ra một cách ngẫu nhiên, mô phỏng tình huống thực tế.
          </p>
        </div>

        <div className="sim-controls">
          <button className="btn btn-outline" onClick={resetTubes}>
            <Icon name="refresh" size={17} /> Đặt lại toàn bộ ống
          </button>
          {lastPull && (
            <div className="sim-feedback">
              {lastPull.fell === 0 ? (
                <>
                  <Icon name="checkCircle" size={18} /> May mắn! Không có banh nào rơi.
                </>
              ) : (
                <>
                  <Icon name="alert" size={18} /> {lastPull.fell} banh đã rơi khỏi ống!
                </>
              )}
            </div>
          )}
        </div>

        <div className="tubes-row">
          {tubes.map((t) => (
            <Tube
              key={t.id}
              tube={t}
              onPullStick={pullStick}
              highlight={lastPull?.tubeId === t.id}
            />
          ))}
        </div>

        <div className="sim-leaderboard">
          <h3>
            <Icon name="trophy" size={20} /> Bảng xếp hạng hiện tại
          </h3>
          <div className="lb-rows">
            {[...tubes]
              .sort((a, b) => b.balls.length - b.lost - (a.balls.length - a.lost))
              .map((t, i) => {
                const remain = t.balls.length - t.lost
                return (
                  <div
                    key={t.id}
                    className="lb-row"
                    style={{ borderLeftColor: t.teamColor }}
                  >
                    <span className={`lb-rank rank-${i + 1}`}>{i + 1}</span>
                    <span className="lb-name">{t.name}</span>
                    <span className="lb-bar">
                      <span
                        className="lb-bar-fill"
                        style={{
                          width: `${(remain / 15) * 100}%`,
                          background: t.teamColor,
                        }}
                      />
                    </span>
                    <span className="lb-score">{remain}/15</span>
                  </div>
                )
              })}
          </div>
        </div>
      </section>

      {/* ===== TIPS ===== */}
      <section id="tips" className="section">
        <div className="section-head">
          <span className="section-eyebrow">
            <Icon name="bulb" size={14} /> Mẹo dẫn trò chơi
          </span>
          <h2>Lưu ý cho CTV khi tổ chức</h2>
        </div>
        <div className="tips-grid">
          {TIPS.map((t, i) => (
            <div key={i} className="tip-card">
              <span className="tip-bullet">
                <Icon name="sparkle" size={18} />
              </span>
              <p>{t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="footer-brand">
          <Icon name="leaf" size={18} strokeWidth={1.8} />
          <strong>{GAME_META.name}</strong> — {GAME_META.event}
        </div>
        <div className="footer-sub">
          Phụ Trách Chính: {STAFF.lead.name} · CTV:{' '}
          {STAFF.ctvs.map((c) => c.name).join(' · ')}
        </div>
      </footer>
    </div>
  )
}
