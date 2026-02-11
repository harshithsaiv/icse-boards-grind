"use client";

import { type SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = "", ...props }: SelectProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>
          {label}
        </label>
      )}
      <select
        className={`w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--primary)]/30 ${className}`}
        style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
