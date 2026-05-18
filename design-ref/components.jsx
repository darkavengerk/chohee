// components.jsx — Chohee core component library
// Reused across all screens. Components exported to window for cross-file use.

const { useState, useRef, useEffect, useMemo, useCallback, createContext, useContext } = React;

/* ────────── Icons (24px, stroke-based, no fills) ────────── */
const Icon = ({ d, size = 18, stroke = 1.6, fill = "none", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
       stroke="currentColor" strokeWidth={stroke}
       strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
    {typeof d === "string" ? <path d={d} /> : d}
  </svg>
);
const Ico = {
  play:    <polygon points="7 5 19 12 7 19 7 5" fill="currentColor" stroke="none" />,
  pause:   <g><rect x="7" y="5" width="3.2" height="14" fill="currentColor" stroke="none"/><rect x="13.8" y="5" width="3.2" height="14" fill="currentColor" stroke="none"/></g>,
  search:  <g><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" /></g>,
  upload:  <g><path d="M12 4v12" /><path d="m6 10 6-6 6 6" /><path d="M4 20h16" /></g>,
  bell:    <g><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" /><path d="M10 19a2 2 0 0 0 4 0" /></g>,
  user:    <g><circle cx="12" cy="8" r="4" /><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" /></g>,
  heart:   <path d="M12 20s-7-4.5-7-10.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 7 3.5C19 15.5 12 20 12 20Z" />,
  more:    <g><circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none"/></g>,
  plus:    <g><path d="M12 5v14"/><path d="M5 12h14"/></g>,
  music:   <g><path d="M9 18V6l11-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></g>,
  pen:     <g><path d="M16 4l4 4-11 11H5v-4Z"/></g>,
  album:   <g><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/></g>,
  check:   <path d="m5 12 5 5 9-11"/>,
  x:       <g><path d="M6 6l12 12"/><path d="M18 6 6 18"/></g>,
  chevron: <path d="m9 6 6 6-6 6"/>,
  arrow:   <g><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></g>,
  download: <g><path d="M12 4v12"/><path d="m6 14 6 6 6-6"/><path d="M4 20h16"/></g>,
  filter:  <g><path d="M4 5h16"/><path d="M7 12h10"/><path d="M10 19h4"/></g>,
  shuffle: <g><path d="M16 4h5v5"/><path d="M21 4 4 21"/><path d="M16 20h5v-5"/><path d="m15 15 6 6"/><path d="m4 4 6 6"/></g>,
  comment: <path d="M4 5h16v11H9l-5 4Z"/>,
  share:   <g><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4"/><path d="m8.6 13.5 6.8 4"/></g>,
  drag:    <g><circle cx="9" cy="6" r="1.3" fill="currentColor" stroke="none"/><circle cx="9" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="9" cy="18" r="1.3" fill="currentColor" stroke="none"/><circle cx="15" cy="6" r="1.3" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="15" cy="18" r="1.3" fill="currentColor" stroke="none"/></g>,
  sparkle: <g><path d="M12 3v6"/><path d="M12 15v6"/><path d="M3 12h6"/><path d="M15 12h6"/><path d="m6 6 3 3"/><path d="m15 15 3 3"/><path d="m18 6-3 3"/><path d="m9 15-3 3"/></g>,
  trash:   <g><path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M7 7v13h10V7"/></g>,
};

/* ────────── Buttons ────────── */
function Btn({ variant = "primary", size = "md", icon, iconRight, children, onClick, disabled, type = "button", className = "", style }) {
  const sizes = {
    sm: { padding: "6px 12px", fontSize: 12, height: 28, gap: 6 },
    md: { padding: "9px 16px", fontSize: 13, height: 36, gap: 8 },
    lg: { padding: "12px 22px", fontSize: 14, height: 44, gap: 10 },
  };
  const variants = {
    primary: { background: "var(--accent)", color: "var(--accent-fg)", border: "1px solid transparent" },
    secondary: { background: "var(--bg-2)", color: "var(--fg-1)", border: "1px solid var(--bd-1)" },
    ghost: { background: "transparent", color: "var(--fg-2)", border: "1px solid transparent" },
    outline: { background: "transparent", color: "var(--fg-1)", border: "1px solid var(--bd-2)" },
    danger: { background: "transparent", color: "var(--danger)", border: "1px solid color-mix(in oklch, var(--danger) 50%, transparent)" },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={"chohee-btn " + className}
      style={{
        ...sizes[size], ...variants[variant],
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        borderRadius: "var(--r-md)", cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        fontWeight: 500, letterSpacing: "-0.005em",
        fontFamily: "var(--font-sans)",
        transition: "background var(--t-fast), transform var(--t-fast), border-color var(--t-fast)",
        whiteSpace: "nowrap",
        ...style,
      }}>
      {icon && <span style={{ display: "inline-flex" }}><Icon d={icon} size={size === "lg" ? 18 : 16} /></span>}
      <span>{children}</span>
      {iconRight && <span style={{ display: "inline-flex" }}><Icon d={iconRight} size={size === "lg" ? 18 : 16} /></span>}
    </button>
  );
}

function IconBtn({ icon, size = 36, onClick, label, active, style }) {
  return (
    <button onClick={onClick} aria-label={label}
      style={{
        width: size, height: size,
        background: active ? "var(--accent-soft)" : "transparent",
        color: active ? "var(--accent)" : "var(--fg-2)",
        border: "1px solid " + (active ? "color-mix(in oklch, var(--accent) 30%, transparent)" : "transparent"),
        borderRadius: "var(--r-md)", cursor: "pointer",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        transition: "all var(--t-fast)",
        ...style,
      }}>
      <Icon d={icon} size={Math.round(size * 0.5)} />
    </button>
  );
}

function PlayButton({ size = 48, playing = false, onClick, accent = true, style }) {
  return (
    <button onClick={onClick}
      style={{
        width: size, height: size, borderRadius: "50%",
        background: accent ? "var(--accent)" : "var(--bg-3)",
        color: accent ? "var(--accent-fg)" : "var(--fg-1)",
        border: "none", cursor: "pointer",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        boxShadow: accent ? "0 4px 14px color-mix(in oklch, var(--accent) 40%, transparent)" : "var(--sh-1)",
        transition: "transform var(--t-fast)",
        ...style,
      }}
      onMouseDown={e => e.currentTarget.style.transform = "scale(0.94)"}
      onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
      <Icon d={playing ? Ico.pause : Ico.play} size={Math.round(size * 0.42)} />
    </button>
  );
}

/* ────────── Status Badge ────────── */
function StatusBadge({ status, size = "md" }) {
  // status: 'waiting' | 'generating' | 'complete' | 'revision'
  const cfg = {
    waiting:    { color: "var(--st-waiting)",  label: "음악 대기 중", dot: false, pulse: false },
    generating: { color: "var(--st-progress)", label: "생성 중",      dot: true,  pulse: true  },
    complete:   { color: "var(--st-complete)", label: "완성",          dot: false, pulse: false },
    revision:   { color: "var(--st-revision)", label: "보완 요청",     dot: true,  pulse: false },
  };
  const c = cfg[status] || cfg.waiting;
  const sz = size === "sm"
    ? { padding: "2px 8px", fontSize: 10.5, gap: 5 }
    : { padding: "4px 10px", fontSize: 11.5, gap: 6 };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: sz.gap,
      padding: sz.padding, fontSize: sz.fontSize, fontWeight: 500,
      color: c.color, borderRadius: "var(--r-pill)",
      background: `color-mix(in oklch, ${c.color} 12%, transparent)`,
      border: `1px solid color-mix(in oklch, ${c.color} 22%, transparent)`,
      letterSpacing: "-0.005em",
      fontFamily: "var(--font-sans)",
    }}>
      {c.dot && <span className={c.pulse ? "pulse" : ""} style={{
        width: 6, height: 6, borderRadius: "50%", background: c.color,
        boxShadow: c.pulse ? `0 0 8px ${c.color}` : "none",
      }}/>}
      {c.label}
    </span>
  );
}

/* ────────── Chip (tag, genre, mood) ────────── */
function Chip({ children, active, onClick, size = "md", icon, accent = false }) {
  const sizes = {
    sm: { padding: "3px 9px", fontSize: 11 },
    md: { padding: "5px 12px", fontSize: 12 },
    lg: { padding: "7px 14px", fontSize: 13 },
  };
  return (
    <button onClick={onClick}
      style={{
        ...sizes[size],
        display: "inline-flex", alignItems: "center", gap: 6,
        borderRadius: "var(--r-pill)",
        background: active || accent ? "var(--accent-soft)" : "var(--bg-2)",
        color: active || accent ? "var(--accent)" : "var(--fg-2)",
        border: "1px solid " + (active || accent ? "color-mix(in oklch, var(--accent) 30%, transparent)" : "var(--bd-1)"),
        cursor: onClick ? "pointer" : "default",
        fontWeight: 500, fontFamily: "var(--font-sans)",
        letterSpacing: "-0.005em",
        transition: "all var(--t-fast)",
      }}>
      {icon && <Icon d={icon} size={12} />}
      {children}
    </button>
  );
}

/* ────────── Avatar ────────── */
function Avatar({ name = "?", size = 36, src, hue = 60 }) {
  const initial = name.slice(0, 1);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: src ? `center/cover url(${src})` : `oklch(0.45 0.08 ${hue})`,
      color: "var(--fg-1)",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontSize: Math.round(size * 0.4), fontWeight: 600,
      border: "1px solid var(--bd-1)",
      fontFamily: "var(--font-serif)",
      flexShrink: 0,
      letterSpacing: 0,
    }}>{!src && initial}</div>
  );
}

/* ────────── Input / Textarea ────────── */
function Input({ label, value, onChange, placeholder, type = "text", icon, hint, error, style, ...rest }) {
  return (
    <label style={{ display: "block", ...style }}>
      {label && <div style={{ fontSize: 12, color: "var(--fg-3)", marginBottom: 6, fontWeight: 500 }}>{label}</div>}
      <div style={{
        position: "relative", display: "flex", alignItems: "center",
        background: "var(--bg-3)", borderRadius: "var(--r-md)",
        border: `1px solid ${error ? "var(--danger)" : "var(--bd-1)"}`,
        transition: "border-color var(--t-fast)",
      }}>
        {icon && <span style={{ paddingLeft: 12, color: "var(--fg-3)", display: "inline-flex" }}><Icon d={icon} size={16} /></span>}
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            color: "var(--fg-1)", padding: "10px 14px",
            fontSize: 14, fontFamily: "var(--font-sans)", letterSpacing: "-0.005em",
          }} {...rest}/>
      </div>
      {hint && <div style={{ fontSize: 11, color: error ? "var(--danger)" : "var(--fg-3)", marginTop: 6 }}>{hint}</div>}
    </label>
  );
}

function Textarea({ label, value, onChange, placeholder, rows = 4, serif = false, hint, style }) {
  return (
    <label style={{ display: "block", ...style }}>
      {label && <div style={{ fontSize: 12, color: "var(--fg-3)", marginBottom: 6, fontWeight: 500 }}>{label}</div>}
      <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
        style={{
          width: "100%", background: "var(--bg-3)",
          border: "1px solid var(--bd-1)", borderRadius: "var(--r-md)",
          color: "var(--fg-1)", padding: "12px 14px",
          fontSize: serif ? 16 : 14,
          lineHeight: serif ? 1.85 : 1.55,
          fontFamily: serif ? "var(--font-serif)" : "var(--font-sans)",
          letterSpacing: serif ? "0.01em" : "-0.005em",
          resize: "vertical", outline: "none",
        }}/>
      {hint && <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 6 }}>{hint}</div>}
    </label>
  );
}

/* ────────── Progress Bar ────────── */
function Progress({ value = 0, label, showValue = true, accent = "var(--accent)" }) {
  return (
    <div>
      {(label || showValue) && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
          <span style={{ color: "var(--fg-2)" }}>{label}</span>
          {showValue && <span className="mono" style={{ color: "var(--fg-3)", fontSize: 11 }}>{Math.round(value)}%</span>}
        </div>
      )}
      <div style={{ height: 6, background: "var(--bg-3)", borderRadius: "var(--r-pill)", overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${value}%`, background: accent,
          borderRadius: "var(--r-pill)", transition: "width var(--t-slow) var(--ease)",
        }}/>
      </div>
    </div>
  );
}

/* ────────── Cover (image-slot wrapper with serif fallback) ────────── */
function Cover({ id, title, size = 200, style, radius = "var(--r-lg)" }) {
  // Uses image-slot web component. Falls back to a typographic placeholder.
  const initial = (title || "·").slice(0, 1);
  const isNumeric = typeof size === "number";
  const fallbackFontSize = isNumeric ? Math.round(size * 0.42) : "clamp(48px, 28cqi, 180px)";
  return (
    <div style={{
      position: "relative", width: size, height: size,
      borderRadius: radius, overflow: "hidden",
      background: `linear-gradient(135deg, oklch(0.28 0.04 ${(id?.charCodeAt(0) || 60) % 360}), oklch(0.2 0.02 60))`,
      boxShadow: "var(--sh-2)",
      flexShrink: 0,
      containerType: isNumeric ? "normal" : "inline-size",
      ...style,
    }}>
      <image-slot id={id} shape="rect" radius={radius} style={{ position: "absolute", inset: 0 }}>
      </image-slot>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-serif)",
        fontSize: fallbackFontSize,
        color: "var(--fg-1)",
        opacity: 0.18,
        pointerEvents: "none",
        letterSpacing: 0,
      }}>{initial}</div>
    </div>
  );
}

/* ────────── Waveform Player ────────── */
function Waveform({ playing, progress = 0.34, onSeek, bars = 92, height = 56, accent = "var(--accent)" }) {
  // Pseudo-random but deterministic bars
  const seed = useMemo(() => {
    const arr = [];
    for (let i = 0; i < bars; i++) {
      // mix of low/mid/high to look like a real song waveform
      const t = i / bars;
      const env = Math.sin(t * Math.PI) * 0.7 + 0.3;
      const noise = ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;
      arr.push(Math.max(0.12, env * (0.4 + noise * 0.6)));
    }
    return arr;
  }, [bars]);
  return (
    <div onClick={e => {
      if (!onSeek) return;
      const rect = e.currentTarget.getBoundingClientRect();
      onSeek((e.clientX - rect.left) / rect.width);
    }}
      style={{
        position: "relative", height, cursor: "pointer",
        display: "flex", alignItems: "center", gap: 2,
        width: "100%",
      }}>
      {seed.map((h, i) => {
        const active = i / bars < progress;
        return (
          <span key={i} style={{
            flex: 1,
            height: `${h * 100}%`,
            background: active ? accent : "var(--bd-2)",
            borderRadius: 2,
            opacity: active ? 1 : 0.65,
            transition: "background var(--t-fast)",
            animation: playing && active && i / bars > progress - 0.03 ? "chohee-wave 0.9s ease-in-out infinite" : "none",
            animationDelay: `${i * 30}ms`,
            transformOrigin: "center",
          }}/>
        );
      })}
    </div>
  );
}

function fmtTime(s) {
  const m = Math.floor(s / 60), ss = String(Math.floor(s % 60)).padStart(2, "0");
  return `${m}:${ss}`;
}

function WaveformPlayer({ duration = 218, height = 64 }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0.31);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <PlayButton playing={playing} onClick={() => setPlaying(p => !p)} size={52}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Waveform playing={playing} progress={progress} onSeek={setProgress} height={height}/>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span className="mono" style={{ fontSize: 11, color: "var(--fg-3)" }}>{fmtTime(progress * duration)}</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--fg-3)" }}>{fmtTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}

/* ────────── Floating Footer Player ────────── */
function FooterPlayer({ track }) {
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0.42);
  if (!track) return null;
  return (
    <div style={{
      position: "absolute", left: 16, right: 16, bottom: 16,
      height: 72, borderRadius: "var(--r-lg)",
      background: "color-mix(in oklch, var(--bg-2) 92%, transparent)",
      backdropFilter: "blur(20px) saturate(160%)",
      WebkitBackdropFilter: "blur(20px) saturate(160%)",
      border: "1px solid var(--bd-1)",
      boxShadow: "var(--sh-3)",
      display: "grid",
      gridTemplateColumns: "auto 1fr auto",
      alignItems: "center",
      padding: "10px 16px",
      gap: 16,
      zIndex: 5,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 220 }}>
        <Cover id={`fp-${track.id}`} title={track.title} size={52} radius="var(--r-sm)" />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{track.title}</div>
          <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 2 }}>{track.artist}</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <IconBtn icon={Ico.shuffle} size={28}/>
          <IconBtn icon={<polygon points="14 5 14 19 4 12" fill="currentColor" stroke="none"/>} size={28}/>
          <PlayButton playing={playing} onClick={() => setPlaying(p => !p)} size={36}/>
          <IconBtn icon={<polygon points="10 5 10 19 20 12" fill="currentColor" stroke="none"/>} size={28}/>
          <IconBtn icon={Ico.heart} size={28}/>
        </div>
        <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 8 }}>
          <span className="mono" style={{ fontSize: 10, color: "var(--fg-3)", minWidth: 32, textAlign: "right" }}>{fmtTime(progress * track.duration)}</span>
          <div onClick={e => {
            const r = e.currentTarget.getBoundingClientRect();
            setProgress((e.clientX - r.left) / r.width);
          }} style={{ flex: 1, height: 4, background: "var(--bg-3)", borderRadius: 2, cursor: "pointer", position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, width: `${progress * 100}%`, background: "var(--accent)", borderRadius: 2 }}/>
          </div>
          <span className="mono" style={{ fontSize: 10, color: "var(--fg-3)", minWidth: 32 }}>{fmtTime(track.duration)}</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <IconBtn icon={Ico.comment} size={32}/>
        <IconBtn icon={Ico.share} size={32}/>
        <IconBtn icon={Ico.more} size={32}/>
      </div>
    </div>
  );
}

/* ────────── Toast ────────── */
function Toast({ kind = "info", title, children }) {
  const colors = {
    info: "var(--info)", success: "var(--success)", warn: "var(--warn)", danger: "var(--danger)",
  };
  return (
    <div style={{
      display: "flex", gap: 12, alignItems: "flex-start",
      padding: "12px 14px", borderRadius: "var(--r-md)",
      background: "var(--bg-2)", border: "1px solid var(--bd-1)",
      boxShadow: "var(--sh-2)",
      borderLeft: `3px solid ${colors[kind]}`,
      minWidth: 280, maxWidth: 360,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{title}</div>
        {children && <div style={{ fontSize: 12, color: "var(--fg-2)", marginTop: 4 }}>{children}</div>}
      </div>
      <button style={{ background: "transparent", border: "none", color: "var(--fg-3)", cursor: "pointer", padding: 2 }}>
        <Icon d={Ico.x} size={14}/>
      </button>
    </div>
  );
}

/* ────────── Follow Button ────────── */
function FollowButton({ following, onChange, size = "md" }) {
  return (
    <button onClick={() => onChange?.(!following)}
      style={{
        padding: size === "sm" ? "4px 12px" : "7px 16px",
        fontSize: size === "sm" ? 12 : 13,
        background: following ? "transparent" : "var(--fg-1)",
        color: following ? "var(--fg-1)" : "var(--bg-0)",
        border: `1px solid ${following ? "var(--bd-2)" : "var(--fg-1)"}`,
        borderRadius: "var(--r-pill)",
        cursor: "pointer", fontWeight: 600, fontFamily: "var(--font-sans)",
        letterSpacing: "-0.005em", transition: "all var(--t-fast)",
        whiteSpace: "nowrap",
      }}>
      {following ? "팔로잉" : "팔로우"}
    </button>
  );
}

/* ────────── Song Card (grid variant) ────────── */
function SongCard({ song, onPlay }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: "flex", flexDirection: "column", gap: 10, cursor: "pointer" }}>
      <div style={{ position: "relative" }}>
        <Cover id={`song-${song.id}`} title={song.title} size="100%"
          style={{ width: "100%", aspectRatio: "1 / 1", height: "auto" }}/>
        <div style={{
          position: "absolute", inset: 0, borderRadius: "var(--r-lg)",
          background: hover ? "linear-gradient(180deg, transparent, oklch(0 0 0 / 0.55))" : "transparent",
          transition: "background var(--t-base)",
          display: "flex", alignItems: "flex-end", justifyContent: "flex-end",
          padding: 12,
        }}>
          {hover && <PlayButton size={40} onClick={e => { e.stopPropagation(); onPlay?.(song); }}/>}
        </div>
      </div>
      <div>
        <div className="serif" style={{ fontSize: 15, fontWeight: 500, letterSpacing: "0.005em",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{song.title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
          <span style={{ fontSize: 12, color: "var(--fg-3)",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{song.artist}</span>
        </div>
      </div>
    </div>
  );
}

/* ────────── Lyrics Card (no music yet) ────────── */
function LyricsCard({ item }) {
  return (
    <div style={{
      padding: 22,
      background: "var(--bg-1)",
      border: "1px solid var(--bd-1)",
      borderRadius: "var(--r-lg)",
      display: "flex", flexDirection: "column", gap: 14,
      minHeight: 220, cursor: "pointer",
      transition: "border-color var(--t-fast), transform var(--t-fast)",
      position: "relative", overflow: "hidden",
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = "var(--bd-2)"}
    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--bd-1)"}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <StatusBadge status={item.status || "waiting"} size="sm"/>
        <span className="mono" style={{ fontSize: 10, color: "var(--fg-3)" }}>{item.lines || 24} lines</span>
      </div>
      <div className="serif" style={{
        fontSize: 14, lineHeight: 1.85, color: "var(--fg-2)",
        letterSpacing: "0.01em",
        flex: 1, overflow: "hidden",
        display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical",
        wordBreak: "keep-all",
      }}>{item.preview}</div>
      <div>
        <div className="serif" style={{ fontSize: 17, fontWeight: 500 }}>{item.title}</div>
        <div style={{ fontSize: 11.5, color: "var(--fg-3)", marginTop: 4 }}>{item.author}</div>
      </div>
    </div>
  );
}

/* ────────── Album Card ────────── */
function AlbumCard({ album }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, cursor: "pointer" }}>
      <div style={{ position: "relative" }}>
        <Cover id={`alb-${album.id}`} title={album.title} size="100%"
          style={{ width: "100%", aspectRatio: "1 / 1", height: "auto" }}/>
        <div style={{
          position: "absolute", top: 10, left: 10,
          fontSize: 10, fontWeight: 500, letterSpacing: "0.05em",
          padding: "3px 8px", borderRadius: "var(--r-pill)",
          background: "oklch(0 0 0 / 0.45)", color: "var(--fg-1)",
          backdropFilter: "blur(8px)", textTransform: "uppercase",
        }}>ALBUM · {album.tracks || 8}곡</div>
      </div>
      <div>
        <div className="serif" style={{ fontSize: 16, fontWeight: 500 }}>{album.title}</div>
        <div style={{ fontSize: 11.5, color: "var(--fg-3)", marginTop: 4 }}>{album.artist}</div>
        {album.concept && (
          <div className="serif" style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 6,
            fontStyle: "italic", letterSpacing: "0.005em" }}>"{album.concept}"</div>
        )}
      </div>
    </div>
  );
}

/* ────────── Track Row (album track list) ────────── */
function TrackRow({ index, track, onPlay, current }) {
  const [hover, setHover] = useState(false);
  const isLyric = track.kind === "lyrics";
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "32px 1fr auto auto",
        alignItems: "center", gap: 16,
        padding: "10px 12px", borderRadius: "var(--r-md)",
        background: hover || current ? "var(--bg-2)" : "transparent",
        cursor: "pointer", transition: "background var(--t-fast)",
      }}>
      <div style={{ textAlign: "center" }}>
        {hover ? <PlayButton size={26} onClick={() => onPlay?.(track)} accent={false}/>
               : <span className="mono" style={{ fontSize: 12, color: current ? "var(--accent)" : "var(--fg-3)" }}>{String(index + 1).padStart(2, "0")}</span>}
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="serif" style={{
          fontSize: 15, fontWeight: 500,
          color: isLyric ? "var(--fg-2)" : (current ? "var(--accent)" : "var(--fg-1)"),
          display: "flex", alignItems: "center", gap: 10,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {track.title}
          {isLyric && <span style={{
            fontSize: 10, fontFamily: "var(--font-sans)", color: "var(--st-waiting)",
            padding: "1px 6px", borderRadius: 4, background: "color-mix(in oklch, var(--st-waiting) 14%, transparent)",
            letterSpacing: 0,
          }}>가사</span>}
        </div>
        <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 2 }}>{track.artist}</div>
      </div>
      {isLyric ? <StatusBadge status={track.status || "waiting"} size="sm"/>
               : <span className="mono" style={{ fontSize: 11, color: "var(--fg-3)" }}>{fmtTime(track.duration)}</span>}
      <IconBtn icon={Ico.more} size={28}/>
    </div>
  );
}

/* ────────── Comment ────────── */
function Comment({ author, time, body, hue = 60, lyricsAnchor }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: "12px 0" }}>
      <Avatar name={author} size={32} hue={hue}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{author}</span>
          <span style={{ fontSize: 11, color: "var(--fg-3)" }}>{time}</span>
        </div>
        {lyricsAnchor && (
          <div className="serif" style={{
            fontSize: 12, color: "var(--fg-3)", fontStyle: "italic",
            marginTop: 6, paddingLeft: 10,
            borderLeft: "2px solid var(--accent)",
          }}>"{lyricsAnchor}"</div>
        )}
        <div style={{ fontSize: 13, color: "var(--fg-2)", marginTop: 6, lineHeight: 1.6, wordBreak: "keep-all" }}>{body}</div>
        <div style={{ display: "flex", gap: 14, marginTop: 8, fontSize: 11, color: "var(--fg-3)" }}>
          <button style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: 0, fontSize: 11 }}>좋아요</button>
          <button style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: 0, fontSize: 11 }}>답글</button>
        </div>
      </div>
    </div>
  );
}

/* ────────── Drop zone ────────── */
function Dropzone({ kind = "audio", file, onFile }) {
  const [dragging, setDragging] = useState(false);
  return (
    <label style={{
      display: "block", padding: 32,
      border: `1.5px dashed ${dragging ? "var(--accent)" : "var(--bd-2)"}`,
      borderRadius: "var(--r-lg)", cursor: "pointer",
      background: dragging ? "var(--accent-soft)" : "var(--bg-1)",
      transition: "all var(--t-fast)",
      textAlign: "center",
    }}
    onDragEnter={e => { e.preventDefault(); setDragging(true); }}
    onDragLeave={() => setDragging(false)}
    onDragOver={e => e.preventDefault()}
    onDrop={e => { e.preventDefault(); setDragging(false); onFile?.(e.dataTransfer.files[0]); }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "var(--bg-3)", color: "var(--accent)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}><Icon d={Ico.upload} size={24}/></div>
        <div>
          <div className="serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>
            {file ? file.name : (kind === "audio" ? "오디오 파일을 끌어다 놓으세요" : "파일을 끌어다 놓으세요")}
          </div>
          <div style={{ fontSize: 12, color: "var(--fg-3)" }}>
            {kind === "audio" ? "MP3, WAV, FLAC · 최대 50MB" : "JPG, PNG · 최소 1000×1000"}
          </div>
        </div>
        <button type="button" style={{
          padding: "8px 18px", fontSize: 12, background: "var(--bg-3)",
          border: "1px solid var(--bd-2)", borderRadius: "var(--r-md)",
          color: "var(--fg-1)", cursor: "pointer", fontFamily: "var(--font-sans)",
        }}>파일 선택</button>
      </div>
    </label>
  );
}

/* ────────── App Chrome (Sidebar + TopBar) ────────── */
function Sidebar({ active = "home", onNav }) {
  const items = [
    { id: "home",    label: "홈",         icon: <g><path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/></g> },
    { id: "search",  label: "둘러보기",   icon: Ico.search },
    { id: "library", label: "라이브러리", icon: Ico.album },
  ];
  const creator = [
    { id: "upload-song",    label: "곡 올리기",     icon: Ico.music },
    { id: "write-lyrics",   label: "가사 쓰기",     icon: Ico.pen },
    { id: "make-album",     label: "앨범 엮기",     icon: Ico.album },
  ];
  return (
    <aside style={{
      width: 248, background: "var(--bg-0)",
      borderRight: "1px solid var(--bd-1)",
      padding: "20px 14px",
      display: "flex", flexDirection: "column", gap: 24,
      height: "100%",
    }}>
      <div style={{ padding: "0 8px 8px", display: "flex", alignItems: "center", gap: 8 }}>
        <Logo size={26}/>
        <span className="serif" style={{ fontSize: 22, fontWeight: 500, letterSpacing: "0.01em" }}>초희</span>
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map(it => (
          <SidebarItem key={it.id} active={active === it.id} icon={it.icon}
                       onClick={() => onNav?.(it.id)} label={it.label}/>
        ))}
      </nav>
      <div>
        <div style={{ padding: "0 12px 8px", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.1em",
          color: "var(--fg-3)", textTransform: "uppercase" }}>창작</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {creator.map(it => (
            <SidebarItem key={it.id} active={active === it.id} icon={it.icon}
                         onClick={() => onNav?.(it.id)} label={it.label}/>
          ))}
        </nav>
      </div>
      <div style={{ marginTop: "auto", padding: "14px 12px", borderTop: "1px solid var(--bd-1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar name="유" size={32} hue={40}/>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>유진</div>
            <div style={{ fontSize: 11, color: "var(--fg-3)" }}>크리에이터</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
function SidebarItem({ active, icon, label, onClick }) {
  return (
    <button onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "9px 12px",
        background: active ? "var(--accent-soft)" : "transparent",
        color: active ? "var(--accent)" : "var(--fg-2)",
        border: "none", borderRadius: "var(--r-md)",
        cursor: "pointer", fontFamily: "var(--font-sans)",
        fontSize: 13, fontWeight: active ? 600 : 500,
        letterSpacing: "-0.005em", textAlign: "left",
        transition: "all var(--t-fast)",
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = "var(--bg-1)"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
      <Icon d={icon} size={17}/>
      <span>{label}</span>
    </button>
  );
}

function TopBar({ children, onSearch }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 16,
      padding: "14px 28px", borderBottom: "1px solid var(--bd-1)",
      background: "color-mix(in oklch, var(--bg-0) 88%, transparent)",
      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      position: "sticky", top: 0, zIndex: 4,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <IconBtn icon={<path d="m15 6-6 6 6 6"/>} size={32}/>
        <IconBtn icon={Ico.chevron} size={32}/>
      </div>
      <div style={{ flex: 1, maxWidth: 480 }}>
        <Input value="" onChange={() => {}} placeholder="곡, 가사, 앨범, 창작자 검색…" icon={Ico.search}/>
      </div>
      {children}
      <IconBtn icon={Ico.bell} size={36}/>
      <Btn variant="outline" size="sm" icon={Ico.upload}>올리기</Btn>
    </div>
  );
}

/* ────────── Logo (wordmark / mark) ────────── */
function Logo({ size = 28, withText = false }) {
  // Symbol: a stylized 'ㅊ' formed by 3 strokes — references "초희" (chohee)
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="15" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1"/>
        <path d="M8 9 H24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M11 14 L21 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M9 23 Q16 17 23 23" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      </svg>
      {withText && <span className="serif" style={{ fontSize: size * 0.85, fontWeight: 500 }}>초희</span>}
    </span>
  );
}

/* ────────── Section heading ────────── */
function SectionHead({ title, kicker, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 18 }}>
      <div>
        {kicker && <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 6 }}>{kicker}</div>}
        <h2 className="serif" style={{ fontSize: 26, fontWeight: 500, letterSpacing: "0.005em" }}>{title}</h2>
      </div>
      {action}
    </div>
  );
}

/* ────────── Export to window ────────── */
Object.assign(window, {
  Icon, Ico, Btn, IconBtn, PlayButton, StatusBadge, Chip, Avatar,
  Input, Textarea, Progress, Cover, Waveform, WaveformPlayer, FooterPlayer,
  Toast, FollowButton, SongCard, LyricsCard, AlbumCard, TrackRow, Comment,
  Dropzone, Sidebar, TopBar, Logo, SectionHead, fmtTime,
});
