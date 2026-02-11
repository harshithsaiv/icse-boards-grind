"use client";

import { motion } from "framer-motion";

interface StatChipProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}

export function StatChip({ label, value, icon, color = "var(--primary)" }: StatChipProps) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl p-4"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${color}15`, color }}
      >
        {icon}
      </div>
      <div>
        <motion.p
          key={String(value)}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold"
          style={{ color: "var(--text)" }}
        >
          {value}
        </motion.p>
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{label}</p>
      </div>
    </div>
  );
}
