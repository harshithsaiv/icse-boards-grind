"use client";

import { type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--primary)]/30 ${className}`}
        style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
        {...props}
      />
    </div>
  );
}
