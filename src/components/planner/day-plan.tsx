"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { SUBJECT_COLORS, SUBJECT_LABELS, type Block } from "@/lib/constants";
import { formatTime24, timeToMin } from "@/lib/utils";

interface DayPlanProps {
  blocks: Block[];
  nowMin: number;
  isPlanToday: boolean;
  onBlockClick: (block: Block, index: number) => void;
}

export function DayPlan({ blocks, nowMin, isPlanToday, onBlockClick }: DayPlanProps) {
  const renderedBlocks = useMemo(() => {
    return blocks.map((block, i) => {
      const startMin = timeToMin(block.start);
      const endMin = timeToMin(block.end);
      const duration = endMin - startMin;
      const isCurrent = isPlanToday && nowMin >= startMin && nowMin < endMin;
      const isPast = isPlanToday && nowMin >= endMin;
      const isStudy = block.type === "study";
      const dotColor = isStudy && block.subjectKey ? SUBJECT_COLORS[block.subjectKey] : undefined;
      const borderColor = isStudy && block.subjectKey ? SUBJECT_COLORS[block.subjectKey] : "transparent";

      return (
        <motion.div
          key={`${block.start}-${i}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.03, duration: 0.2 }}
          onClick={() => onBlockClick(block, i)}
          className="flex items-stretch gap-3 rounded-xl cursor-pointer transition-all hover:scale-[1.01]"
          style={{
            opacity: isPast ? 0.5 : 1,
            background: isCurrent ? "var(--primary-light)" : "var(--bg-card)",
            boxShadow: isCurrent ? "var(--shadow)" : "none",
            border: "1px solid var(--border)",
            borderLeftWidth: isStudy ? "4px" : "1px",
            borderLeftColor: isStudy ? borderColor : "var(--border)",
            padding: "12px 16px",
          }}
        >
          {/* Time column */}
          <div className="flex flex-col items-end justify-center shrink-0 w-20">
            <span className="text-xs font-mono font-medium" style={{ color: "var(--text-secondary)" }}>
              {formatTime24(block.start)}
            </span>
            <span className="text-xs font-mono" style={{ color: "var(--text-secondary)", opacity: 0.6 }}>
              {formatTime24(block.end)}
            </span>
          </div>

          {/* Dot */}
          <div className="flex items-center shrink-0">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: dotColor || "var(--border)" }}
            />
          </div>

          {/* Label + meta */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>
              {block.label}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              {block.subjectKey && (
                <span
                  className="text-xs font-medium px-1.5 py-0.5 rounded"
                  style={{
                    background: `${SUBJECT_COLORS[block.subjectKey]}20`,
                    color: SUBJECT_COLORS[block.subjectKey],
                  }}
                >
                  {SUBJECT_LABELS[block.subjectKey]}
                </span>
              )}
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {duration} min
              </span>
            </div>
          </div>

          {/* Current indicator */}
          {isCurrent && (
            <div className="flex items-center shrink-0">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "var(--primary)" }}
              />
            </div>
          )}
        </motion.div>
      );
    });
  }, [blocks, nowMin, isPlanToday, onBlockClick]);

  if (blocks.length === 0) {
    return (
      <div className="text-center py-12" style={{ color: "var(--text-secondary)" }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 opacity-40">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <p className="text-sm">No blocks for this day.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {renderedBlocks}
    </div>
  );
}
