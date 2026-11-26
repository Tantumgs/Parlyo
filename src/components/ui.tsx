import { useId, type CSSProperties, type ReactNode } from "react";

/* ============================================================
   Shared UI primitives
   ============================================================ */

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="logo-mark">P</div>
      <div className="min-w-0">
        <div className="logo-word">parlyo</div>
        {!compact && <div className="logo-sub">язык · ритм · прогресс</div>}
      </div>
    </div>
  );
}

const LANG_COLORS: Record<string, string> = {
  en: "#d9ff63",
  es: "#ffd166",
  fr: "#8bd3ff",
  de: "#ff9c8a",
};

export function LangMark({ code, size = 30 }: { code: string; size?: number }) {
  const color = LANG_COLORS[code] ?? "#d9ff63";
  return (
    <span
      className="lang-mark"
      style={{
        width: size,
        height: size,
        borderColor: `${color}44`,
        background: `${color}14`,
        color,
        fontSize: Math.max(8, size * 0.3),
        borderRadius: Math.max(8, size * 0.32),
      }}
    >
      {code.toUpperCase()}
    </span>
  );
}

export function ProgressRing({
  value,
  size = 164,
  stroke = 11,
  children,
  className,
  trackClassName,
}: {
  value: number;
  size?: number;
  stroke?: number;
  children?: ReactNode;
  className?: string;
  trackClassName?: string;
}) {
  const gradientId = `ring-${useId().replace(/:/g, "")}`;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(1, Math.max(0, value));
  const offset = circumference * (1 - clamped);

  return (
    <div
      className={`relative ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d9ff63" />
            <stop offset="100%" stopColor="#7ef0d4" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={stroke}
          className={trackClassName}
        />
        {clamped > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 1s cubic-bezier(0.2,0.7,0.2,1)",
              filter: "drop-shadow(0 0 8px rgba(217,255,99,0.4))",
            }}
          />
        )}
      </svg>
      {children && <div className="absolute inset-0">{children}</div>}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  side,
  accent = "lime",
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  side?: ReactNode;
  accent?: "lime" | "coral" | "amber";
}) {
  return (
    <header className="page-head">
      <div className="page-head-copy">
        <div className={`eyebrow ${accent === "lime" ? "eyebrow-lime" : ""}`}>
          <span className={`dot ${accent === "coral" ? "dot-coral" : ""}`} />
          {eyebrow}
        </div>
        <h1 className="display display-page balance">{title}</h1>
        {description && <p className="lead balance">{description}</p>}
      </div>
      {side && <div className="page-head-side">{side}</div>}
    </header>
  );
}

export function ProgressBar({
  value,
  className,
  color,
}: {
  value: number;
  className?: string;
  color?: string;
}) {
  const pct = `${Math.min(100, Math.max(0, value * 100))}%`;
  return (
    <div className={`progress-track ${className ?? ""}`}>
      <div
        className="progress-fill"
        style={color ? { width: pct, background: color, boxShadow: "none" } : { width: pct }}
      />
    </div>
  );
}

export function StatTile({
  icon,
  label,
  value,
  caption,
  accent,
  children,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  caption?: ReactNode;
  accent?: string;
  children?: ReactNode;
}) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between gap-2">
        <span className="eyebrow" style={{ fontSize: 9, letterSpacing: "0.16em" }}>
          {label}
        </span>
        <span className="stat-icon" style={accent ? { color: accent } : undefined}>
          {icon}
        </span>
      </div>
      <div className="stat-value">{value}</div>
      {caption && <div className="stat-caption">{caption}</div>}
      {children}
    </div>
  );
}

export function SparkBars({
  values,
  className,
}: {
  values: number[];
  className?: string;
}) {
  const max = Math.max(1, ...values);
  return (
    <div className={`flex items-end gap-1 ${className ?? ""}`} style={{ height: 30 }}>
      {values.map((value, index) => (
        <span
          key={index}
          style={{
            flex: 1,
            height: `${Math.max(8, (value / max) * 100)}%`,
            borderRadius: 3,
            background:
              value > 0
                ? "linear-gradient(180deg, var(--lime), rgba(217,255,99,0.18))"
                : "rgba(255,255,255,0.07)",
            minWidth: 3,
          }}
        />
      ))}
    </div>
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={`hairline ${className ?? ""}`} />;
}

export function styleVars(vars: Record<string, string>): CSSProperties {
  return vars as CSSProperties;
}
