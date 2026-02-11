"use client";

import { type ReactNode } from "react";

interface ButtonProps {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary: { background: "var(--primary)", color: "#fff" },
  secondary: { background: "transparent", color: "var(--text)", border: "1px solid var(--border)" },
  danger: { background: "var(--danger)", color: "#fff" },
  ghost: { background: "transparent", color: "var(--text-secondary)" },
};

const sizeClasses: Record<string, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

export function Button({ variant = "primary", size = "md", className = "", style, children, disabled, onClick, type }: ButtonProps) {
  return (
    <button
      className={`rounded-lg font-medium transition-all cursor-pointer hover:opacity-85 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed ${sizeClasses[size]} ${className}`}
      style={{ ...variantStyles[variant], ...style }}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
