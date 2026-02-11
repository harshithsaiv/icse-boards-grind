"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { EXAMS, SUBJECT_COLORS } from "@/lib/constants";
import { today, dateStr, daysBetween } from "@/lib/utils";
import type { StudyLogEntry } from "@/store/use-store";

interface CalendarGridProps {
  month: number;
  year: number;
  studyLog: Record<string, StudyLogEntry>;
  onDayClick: (dateString: string) => void;
  selectedDate?: string | null;
}

const DAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarGrid({ month, year, studyLog, onDayClick, selectedDate }: CalendarGridProps) {
  const td = today();

  const { cells, daysInMonth, firstDayOffset } = useMemo(() => {
    const dim = new Date(year, month + 1, 0).getDate();
    const fdo = new Date(year, month, 1).getDay();

    const cellData: {
      day: number;
      dateString: string;
      isToday: boolean;
      isExamDay: boolean;
      isRevisionDay: boolean;
      examColor: string | null;
      hasStudy: boolean;
      isCurrentMonth: boolean;
    }[] = [];

    // Empty cells for offset
    for (let i = 0; i < fdo; i++) {
      cellData.push({
        day: 0,
        dateString: "",
        isToday: false,
        isExamDay: false,
        isRevisionDay: false,
        examColor: null,
        hasStudy: false,
        isCurrentMonth: false,
      });
    }

    for (let d = 1; d <= dim; d++) {
      const dateObj = new Date(year, month, d);
      const ds = dateStr(dateObj);
      const isToday = ds === td;

      // Check exam day
      const exam = EXAMS.find((e) => e.date === ds);
      const isExamDay = !!exam;
      const examColor = exam ? SUBJECT_COLORS[exam.key] || "var(--primary)" : null;

      // Check revision day (1-2 days before any exam)
      const isRevisionDay = !isExamDay && EXAMS.some((e) => {
        const diff = daysBetween(ds, e.date);
        return diff >= 1 && diff <= 2;
      });

      // Check study activity
      const logEntry = studyLog[ds];
      const hasStudy = !!(logEntry && logEntry.hours > 0);

      cellData.push({
        day: d,
        dateString: ds,
        isToday,
        isExamDay,
        isRevisionDay,
        examColor,
        hasStudy,
        isCurrentMonth: true,
      });
    }

    return { cells: cellData, daysInMonth: dim, firstDayOffset: fdo };
  }, [month, year, studyLog, td]);

  return (
    <div>
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_HEADERS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold py-2"
            style={{ color: "var(--text-secondary)" }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          if (!cell.isCurrentMonth) {
            return <div key={`empty-${i}`} className="aspect-square" />;
          }

          const isSelected = selectedDate === cell.dateString;

          return (
            <motion.button
              key={cell.dateString}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.008, duration: 0.15 }}
              onClick={() => onDayClick(cell.dateString)}
              className="aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all relative"
              style={{
                background: isSelected
                  ? "var(--primary-light)"
                  : cell.isExamDay
                  ? `${cell.examColor}15`
                  : cell.isRevisionDay
                  ? "var(--primary-light)"
                  : "transparent",
                border: cell.isToday
                  ? "2px solid var(--primary)"
                  : isSelected
                  ? "2px solid var(--primary)"
                  : "1px solid transparent",
                cursor: "pointer",
              }}
            >
              <span
                className="text-sm font-medium"
                style={{
                  color: cell.isExamDay
                    ? cell.examColor || "var(--danger)"
                    : cell.isToday
                    ? "var(--primary)"
                    : "var(--text)",
                }}
              >
                {cell.day}
              </span>

              {/* Indicators row */}
              <div className="flex items-center gap-0.5">
                {cell.isExamDay && (
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: cell.examColor || "var(--danger)" }}
                  />
                )}
                {cell.isRevisionDay && (
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--warning, #f59e0b)" }}
                  />
                )}
                {cell.hasStudy && (
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--success, #22c55e)" }}
                  />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: "var(--primary)" }} />
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: "var(--danger, #ef4444)" }} />
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Exam</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: "var(--warning, #f59e0b)" }} />
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Revision</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: "var(--success, #22c55e)" }} />
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Studied</span>
        </div>
      </div>
    </div>
  );
}
