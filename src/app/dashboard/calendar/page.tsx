"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store/use-store";
import { EXAMS, SUBJECT_COLORS, SUBJECT_LABELS, type Block } from "@/lib/constants";
import { today, formatDate, formatTime24, timeToMin, daysBetween } from "@/lib/utils";
import { getDayPlan } from "@/lib/algorithms";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarGrid } from "@/components/calendar/calendar-grid";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function CalendarPage() {
  const data = useStore();
  const td = today();

  const now = new Date();
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentNow, setCurrentNow] = useState(new Date());

  // Auto-refresh every minute
  useEffect(() => {
    const interval = setInterval(() => setCurrentNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const nowMin = currentNow.getHours() * 60 + currentNow.getMinutes();

  // Navigation
  const goToPrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(calYear - 1);
    } else {
      setCalMonth(calMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(calYear + 1);
    } else {
      setCalMonth(calMonth + 1);
    }
  };

  const goToToday = () => {
    const t = new Date();
    setCalMonth(t.getMonth());
    setCalYear(t.getFullYear());
    setSelectedDate(td);
  };

  const isCurrentMonth = calMonth === now.getMonth() && calYear === now.getFullYear();

  // Day click handler
  const handleDayClick = (dateString: string) => {
    setSelectedDate(dateString === selectedDate ? null : dateString);
  };

  // Selected day detail
  const selectedDayPlan = useMemo(() => {
    if (!selectedDate) return null;
    return getDayPlan(selectedDate, data);
  }, [selectedDate, data]);

  const selectedDayExam = useMemo(() => {
    if (!selectedDate) return null;
    return EXAMS.find((e) => e.date === selectedDate) || null;
  }, [selectedDate]);

  const selectedDayStudyMin = useMemo(() => {
    if (!selectedDayPlan) return 0;
    return selectedDayPlan.reduce((sum, b) => {
      if (b.type === "study") return sum + (timeToMin(b.end) - timeToMin(b.start));
      return sum;
    }, 0);
  }, [selectedDayPlan]);

  // Exams this month
  const monthExams = useMemo(() => {
    return EXAMS.filter((e) => {
      const d = new Date(e.date + "T00:00:00");
      return d.getMonth() === calMonth && d.getFullYear() === calYear;
    });
  }, [calMonth, calYear]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Month Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-3"
      >
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={goToPrevMonth}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Button>
          <h2 className="text-xl font-bold min-w-[200px] text-center" style={{ color: "var(--text)" }}>
            {MONTH_NAMES[calMonth]} {calYear}
          </h2>
          <Button variant="ghost" size="sm" onClick={goToNextMonth}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Button>
        </div>

        {!isCurrentMonth && (
          <Button variant="secondary" size="sm" onClick={goToToday}>
            Today
          </Button>
        )}
      </motion.div>

      {/* Exams this month */}
      {monthExams.length > 0 && (
        <Card className="!py-3">
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
            EXAMS THIS MONTH
          </p>
          <div className="flex flex-wrap gap-2">
            {monthExams.map((exam) => {
              const days = daysBetween(td, exam.date);
              return (
                <button
                  key={exam.key}
                  onClick={() => setSelectedDate(exam.date)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all hover:scale-[1.02]"
                  style={{
                    background: `${SUBJECT_COLORS[exam.key]}15`,
                    border: `1px solid ${SUBJECT_COLORS[exam.key]}40`,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: SUBJECT_COLORS[exam.key] }}
                  />
                  <span className="text-xs font-medium" style={{ color: "var(--text)" }}>
                    {exam.subject}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {days === 0 ? "Today" : days > 0 ? `${days}d` : `${Math.abs(days)}d ago`}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {/* Calendar Grid */}
      <Card>
        <CalendarGrid
          month={calMonth}
          year={calYear}
          studyLog={data.studyLog || {}}
          onDayClick={handleDayClick}
          selectedDate={selectedDate}
        />
      </Card>

      {/* Selected Day Detail Panel */}
      {selectedDate && selectedDayPlan && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Card>
            {/* Detail Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold" style={{ color: "var(--text)" }}>
                  {formatDate(selectedDate)}
                </h3>
                {selectedDayExam && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: SUBJECT_COLORS[selectedDayExam.key] }}
                    />
                    <span className="text-xs font-medium" style={{ color: SUBJECT_COLORS[selectedDayExam.key] }}>
                      EXAM: {selectedDayExam.subject} ({selectedDayExam.duration})
                    </span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <span className="text-sm font-bold" style={{ color: "var(--primary)" }}>
                  {Math.floor(selectedDayStudyMin / 60)}h {selectedDayStudyMin % 60}m
                </span>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>study time</p>
              </div>
            </div>

            {/* Blocks list */}
            <div className="space-y-1.5">
              {selectedDayPlan.map((block, i) => {
                const startMin = timeToMin(block.start);
                const endMin = timeToMin(block.end);
                const duration = endMin - startMin;
                const isCurrent = selectedDate === td && nowMin >= startMin && nowMin < endMin;
                const isPast = selectedDate === td && nowMin >= endMin;
                const isStudy = block.type === "study";
                const dotColor = isStudy && block.subjectKey ? SUBJECT_COLORS[block.subjectKey] : undefined;

                return (
                  <div
                    key={`${block.start}-${i}`}
                    className="flex items-center gap-3 py-2 px-3 rounded-lg"
                    style={{
                      opacity: isPast ? 0.5 : 1,
                      background: isCurrent ? "var(--primary-light)" : "transparent",
                      borderLeft: isStudy ? `3px solid ${dotColor || "var(--border)"}` : "3px solid transparent",
                    }}
                  >
                    <span className="text-xs font-mono w-20 shrink-0" style={{ color: "var(--text-secondary)" }}>
                      {formatTime24(block.start)} - {formatTime24(block.end)}
                    </span>
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: dotColor || "var(--border)" }}
                    />
                    <span className="text-sm flex-1 min-w-0 truncate" style={{ color: "var(--text)" }}>
                      {block.label}
                    </span>
                    <span className="text-xs shrink-0" style={{ color: "var(--text-secondary)" }}>
                      {duration}m
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Study subjects breakdown */}
            {(() => {
              const subjectBreakdown: Record<string, number> = {};
              selectedDayPlan.forEach((b) => {
                if (b.type === "study" && b.subjectKey) {
                  const mins = timeToMin(b.end) - timeToMin(b.start);
                  subjectBreakdown[b.subjectKey] = (subjectBreakdown[b.subjectKey] || 0) + mins;
                }
              });
              const entries = Object.entries(subjectBreakdown);
              if (entries.length === 0) return null;

              return (
                <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
                    SUBJECT BREAKDOWN
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {entries.map(([key, mins]) => (
                      <div
                        key={key}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                        style={{
                          background: `${SUBJECT_COLORS[key]}15`,
                          border: `1px solid ${SUBJECT_COLORS[key]}30`,
                        }}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ background: SUBJECT_COLORS[key] }}
                        />
                        <span className="text-xs font-medium" style={{ color: "var(--text)" }}>
                          {SUBJECT_LABELS[key]}
                        </span>
                        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                          {Math.floor(mins / 60)}h {mins % 60}m
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </Card>
        </motion.div>
      )}
    </div>
  );
}
