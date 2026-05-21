// Bộ icon SVG nét mảnh dùng chung cho toàn trang
// Dùng: <Icon name="home" size={20} />

const ICONS = {
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20h14V9.5" />
      <path d="M10 20v-6h4v6" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c0-3 2.4-4.8 5.5-4.8s5.5 1.8 5.5 4.8" />
      <path d="M16 5.3a2.8 2.8 0 0 1 0 5.4" />
      <path d="M17 14.4c2.5.4 4 2.2 4 4.6" />
    </>
  ),
  toolbox: (
    <>
      <rect x="3" y="8" width="18" height="11" rx="1.6" />
      <path d="M9 8V6.2A2 2 0 0 1 11 4h2a2 2 0 0 1 2 2.2V8" />
      <path d="M3 13h6m6 0h6" />
      <path d="M10 12h4v3h-4z" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20.5 20.5-4.7-4.7" />
    </>
  ),
  scroll: (
    <>
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M15 3v4h4" />
      <path d="M9.5 12h6M9.5 16h6" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.6" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </>
  ),
  film: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 9.7h18M3 14.3h18M8 5v14M16 5v14" />
    </>
  ),
  flask: (
    <>
      <path d="M9.5 3h5" />
      <path d="M10.5 3v6L5.7 17.6A1.6 1.6 0 0 0 7.1 20h9.8a1.6 1.6 0 0 0 1.4-2.4L13.5 9V3" />
      <path d="M8 14.5h8" />
    </>
  ),
  bulb: (
    <>
      <path d="M9.5 18h5" />
      <path d="M10.5 21h3" />
      <path d="M12 3a6 6 0 0 0-3.8 10.6c.6.5 1 1.3 1.1 2.4h5.4c.1-1.1.5-1.9 1.1-2.4A6 6 0 0 0 12 3Z" />
    </>
  ),
  leaf: (
    <>
      <path d="M4 20C4 11.7 10.7 5 19 5c.8 0 1 .2 1 1 0 8.3-6.7 15-15 15-.8 0-1-.2-1-1Z" />
      <path d="M5 19C9 13 13 9.5 18 7" />
    </>
  ),
  play: <path d="M8 5.1v13.8a1 1 0 0 0 1.5.9l11-6.9a1 1 0 0 0 0-1.7l-11-6.9A1 1 0 0 0 8 5.1Z" />,
  pause: (
    <>
      <rect x="7" y="5" width="3.6" height="14" rx="1" />
      <rect x="13.4" y="5" width="3.6" height="14" rx="1" />
    </>
  ),
  stop: <rect x="6" y="6" width="12" height="12" rx="1.6" />,
  refresh: (
    <>
      <path d="M20 11.5A8 8 0 1 0 18 17" />
      <path d="M20 4v6h-6" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M4 12h15" />
      <path d="m12.5 5.5 7 6.5-7 6.5" />
    </>
  ),
  arrowDown: (
    <>
      <path d="M12 4.5v15" />
      <path d="m5.5 13 6.5 6.5 6.5-6.5" />
    </>
  ),
  cornerUpLeft: (
    <>
      <path d="M9.5 14 4 8.5 9.5 3" />
      <path d="M4 8.5h10.5A5.5 5.5 0 0 1 20 14v6" />
    </>
  ),
  stopwatch: (
    <>
      <circle cx="12" cy="13.5" r="7.5" />
      <path d="M12 9.5v4.5l3 2" />
      <path d="M9.5 2.5h5M12 2.5v3" />
      <path d="m19.2 5.8 1.6-1.6" />
    </>
  ),
  rotate: (
    <>
      <path d="M20 12a8 8 0 1 1-2.4-5.7" />
      <path d="M20 3.5V8h-4.5" />
    </>
  ),
  clipboardCheck: (
    <>
      <rect x="5" y="4.5" width="14" height="16.5" rx="2" />
      <path d="M9 4.5V3.5h6v1" />
      <path d="m9 13 2.3 2.3L16 11" />
    </>
  ),
  megaphone: (
    <>
      <path d="M4 10v4l3.2.5 9 4.5V5L7.2 9.5 4 10Z" />
      <path d="M16 8.6a4 4 0 0 1 0 6.8" />
      <path d="M7.2 14.5V19l3 1.5" />
    </>
  ),
  whistle: (
    <>
      <path d="M2.5 12.5a6 6 0 1 0 6-6h8.5a3 3 0 0 1 0 6H13" />
      <circle cx="8.5" cy="12.5" r="1.4" fill="currentColor" />
    </>
  ),
  mapPin: (
    <>
      <path d="M12 21s-6.5-5.2-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.8 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.6" />
    </>
  ),
  walk: (
    <>
      <circle cx="13" cy="4.6" r="2.1" />
      <path d="M13 6.7v6.1" />
      <path d="m13 9.2-3.6 1.4M13 9.2l3.4 2.3" />
      <path d="m13 12.8-2.7 8M13 12.8l2.8 4 .6 4" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="4.8" r="2.3" />
      <path d="M12 7.1v6.4" />
      <path d="m12 9.6-3.4 1.7M12 9.6l3.4 1.7" />
      <path d="m12 13.5-2.7 6.7M12 13.5l2.7 6.7" />
    </>
  ),
  run: (
    <>
      <circle cx="14.5" cy="4.6" r="2.1" />
      <path d="m14.5 6.7-2.4 4.8 3.4 2.8" />
      <path d="m12.1 11.5-4.3 1.1" />
      <path d="m15.5 14.3 1.4 6.4" />
      <path d="m12.5 12.8-3 7.9" />
      <path d="m14.2 9 4.6 2.3" />
    </>
  ),
  hand: (
    <>
      <path d="M8.5 11V6.3a1.4 1.4 0 0 1 2.8 0V10" />
      <path d="M11.3 10V5.1a1.4 1.4 0 0 1 2.8 0V10" />
      <path d="M14.1 10.2V6.5a1.4 1.4 0 0 1 2.8 0V12" />
      <path d="M16.9 9.7a1.4 1.4 0 0 1 2.8 0v4.8a6 6 0 0 1-6 6h-1a6 6 0 0 1-4.4-1.9l-3.6-4a1.5 1.5 0 0 1 2.2-2l1.8 1.8" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3.5 13.9 9 19.5 11l-5.6 2L12 18.5 10.1 13 4.5 11 10.1 9 12 3.5Z" />
      <path d="M19 3.5v3M20.5 5h-3" />
    </>
  ),
  circle: (
    <>
      <circle cx="12" cy="12" r="7.5" />
      <path d="M9 9.3A4 4 0 0 1 12 7.8" />
    </>
  ),
  tube: (
    <>
      <rect x="8" y="3" width="8" height="18" rx="3.5" />
      <path d="M8 7.5h8" />
    </>
  ),
  stick: (
    <>
      <path d="M5.5 18.5 18.5 5.5" />
      <circle cx="5.5" cy="18.5" r="1" fill="currentColor" />
      <circle cx="18.5" cy="5.5" r="1" fill="currentColor" />
    </>
  ),
  circleDot: (
    <>
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="12" r="2.3" fill="currentColor" />
    </>
  ),
  trophy: (
    <>
      <path d="M7 4.5h10V9a5 5 0 0 1-10 0V4.5Z" />
      <path d="M7 6.5H4.2V8A3 3 0 0 0 7 11M17 6.5h2.8V8a3 3 0 0 1-2.8 3" />
      <path d="M12 14v3.4M9 20.5h6M9.8 17.4h4.4l.5 3.1H9.3l.5-3.1Z" />
    </>
  ),
  star: (
    <path d="M12 3.5 14.6 9l6 .8-4.3 4.2 1 6-5.3-2.8L6.7 20l1-6L3.4 9.8l6-.8L12 3.5Z" />
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12 2.5 2.5L16 9" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4 21.5 19.5H2.5L12 4Z" />
      <path d="M12 10v4.5M12 17.5v.5" />
    </>
  ),
}

export function Icon({ name, size = 20, strokeWidth = 2, className = '', style }) {
  const content = ICONS[name]
  if (!content) return null
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden="true"
    >
      {content}
    </svg>
  )
}
