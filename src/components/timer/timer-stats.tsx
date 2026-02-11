"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store/use-store";
import { Card } from "@/components/ui/card";
import { SUBJECT_LABELS, SUBJECT_COLORS } from "@/lib/constants";
import { today } from "@/lib/utils";

export function TimerStats() {
  const data = useStore();
  const td = today();

  const todayLog = (data.studyLog || {})[td];
  const hoursToday = todayLog ? todayLog.hours : 0;
  const sessionsToday = todayLog ? todayLog.sessions : 0;
  const streak = data.streak || 0;

  // Recent sessions for today (last 5)
  const recentSessions = useMemo(() => {
    return (data.timerSessions || [])
      .filter((s) => s.date === td)
      .slice(-5)
      .reverse();
  }, [data.timerSessions, td]);

  // Subject breakdown for today
  const subjectBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    (data.timerSessions || [])
      .filter((s) => s.date === td)
      .forEach((s) => {
        map[s.subject] = (map[s.subject] || 0) + s.minutes;
      });
    return Object.entries(map)
      .map(([key, mins]) => ({
        key,
        label: SUBJECT_LABELS[key] || key,
        color: SUBJECT_COLORS[key] || "var(--text-secondary)",
        minutes: mins,
      }))
      .sort((a, b) => b.minutes - a.minutes);
  }, [data.timerSessions, td]);

  const totalMinutesToday = subjectBreakdown.reduce((sum, s) => sum + s.minutes, 0);

  return (
    <div className="space-y-4">
      {/* Today's Summary */}
      <Card>
        <h3
          className="text-sm font-semibold mb-4"
          style={{ color: "var(--text)" }}
        >
          Today&apos;s Summary
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p
              className="text-2xl font-bold"
              style={{ color: "var(--primary)" }}
            >
              {hoursToday.toFixed(1)}
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--text-secondary)" }}
            >
              Hours
            </p>
          </div>
          <div className="text-center">
            <p
              className="text-2xl font-bold"
              style={{ color: "#16a34a" }}
            >
              {sessionsToday}
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--text-secondary)" }}
            >
              Sessions
            </p>
          </div>
          <div className="text-center">
            <p
              className="text-2xl font-bold"
              style={{ color: "var(--warning)" }}
            >
              {streak}
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--text-secondary)" }}
            >
              Day Streak
            </p>
          </div>
        </div>
      </Card>

      {/* Subject Breakdown */}
      <Card>
        <h3
          className="text-sm font-semibold mb-3"
          style={{ color: "var(--text)" }}
        >
          Subject Breakdown
        </h3>
        {subjectBreakdown.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            No sessions yet today. Start a timer!
          </p>
        ) : (
          <div className="space-y-3">
            {subjectBreakdown.map((item) => {
              const pct =
                totalMinutesToday > 0
                  ? (item.minutes / totalMinutesToday) * 100
                  : 0;
              return (
                <div key={item.key}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ background: item.color }}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--text)" }}
                      >
                        {item.label}
                      </span>
                    </div>
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {item.minutes} min
                    </span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: "var(--border)" }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Recent Sessions */}
      <Card>
        <h3
          className="text-sm font-semibold mb-3"
          style={{ color: "var(--text)" }}
        >
          Recent Sessions
        </h3>
        {recentSessions.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            No sessions recorded today.
          </p>
        ) : (
          <div className="space-y-2">
            {recentSessions.map((session, i) => (
              <div key={i} className="flex items-center gap-3">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    background:
                      SUBJECT_COLORS[session.subject] || "var(--text-secondary)",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: "var(--text)" }}
                  >
                    {SUBJECT_LABELS[session.subject] || session.subject}
                  </p>
                  {session.chapter && (
                    <p
                      className="text-xs truncate"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {session.chapter}
                    </p>
                  )}
                </div>
                <span
                  className="text-xs font-medium shrink-0"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {session.minutes} min
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
