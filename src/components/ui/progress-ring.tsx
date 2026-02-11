"use client";

interface ProgressRingProps {
  radius: number;
  stroke: number;
  progress: number;
  color?: string;
  children?: React.ReactNode;
  className?: string;
}

export function ProgressRing({ radius, stroke, progress, color = "var(--primary)", children, className = "" }: ProgressRingProps) {
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const offset = circumference * (1 - Math.min(1, Math.max(0, progress)));

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={radius * 2} height={radius * 2} className="-rotate-90">
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="transparent"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="transparent"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
