"use client";

interface ProgressBarProps {
  value: number;
  color?: string;
  height?: number;
  className?: string;
}

export function ProgressBar({ value, color = "var(--primary)", height = 6, className = "" }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div
      className={`rounded-full overflow-hidden ${className}`}
      style={{ height, background: "var(--border)" }}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}
