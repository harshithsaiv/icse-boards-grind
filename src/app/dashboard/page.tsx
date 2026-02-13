"use client";

import { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import posthog from "posthog-js";
import { useStore } from "@/store/use-store";
import { Card } from "@/components/ui/card";
import { StatChip } from "@/components/ui/stat-chip";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getExams, getSubjectColors, getSubjectLabels, MOTIVATIONAL_QUOTES } from "@/lib/constants";
import { today, daysBetween, formatDate, formatTime24, timeToMin } from "@/lib/utils";
import { getDayPlan } from "@/lib/algorithms";

export default function DashboardPage() {
  const data = useStore();
  const td = today();
  const [now, setNow] = useState(new Date());

  const lang = data.selectedLanguage || "kannada";
  const elective = data.selectedElective || "computer";
  const exams = useMemo(() => getExams(lang, elective), [lang, elective]);
  const subjectLabels = useMemo(() => getSubjectLabels(lang, elective), [lang, elective]);
  const subjectColors = useMemo(() => getSubjectColors(lang, elective), [lang, elective]);

  // Auto-refresh every minute
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const todayLog = (data.studyLog || {})[td];
  const hoursToday = todayLog ? todayLog.hours : 0;
  const sessionsToday = todayLog ? todayLog.sessions : 0;
  const target = data.studyHours || 8;

  const chapsDone = useMemo(() => {
    let count = 0;
    Object.values(data.subjects || {}).forEach((chapters) => {
      chapters.forEach((ch) => { if (ch.status === "completed") count++; });
    });
    return count;
  }, [data.subjects]);

  // Next exam countdown
  const nextExam = exams.find((e) => e.date >= td);
  const examDays = nextExam ? daysBetween(td, nextExam.date) : null;

  // Today's plan
  const plan = useMemo(() => getDayPlan(td, data), [td, data]);
  const nowMin = now.getHours() * 60 + now.getMinutes();

  // Upcoming exams
  const upcomingExams = exams.filter((e) => e.date >= td).slice(0, 4);

  // Focus areas
  const focusItems = useMemo(() => {
    const items: { subject: string; color: string; detail: string; tag: string }[] = [];
    Object.keys(subjectLabels).forEach((key) => {
      const rating = (data.subjectRatings || {})[key] || "medium";
      const exam = exams.find((e) => e.key === key);
      const chapters = data.subjects[key] || [];
      const incomplete = chapters.filter((c) => c.status !== "completed").length;
      if (rating === "weak" && exam && exam.date >= td) {
        items.push({ subject: subjectLabels[key], color: subjectColors[key], detail: `${daysBetween(td, exam.date)}d to exam, ${incomplete} chapters left`, tag: "weak" });
      }
      chapters.forEach((ch) => {
        if (ch.status === "needs_revision") {
          items.push({ subject: subjectLabels[key], color: subjectColors[key], detail: ch.name, tag: "revision" });
        }
      });
    });
    return items.slice(0, 6);
  }, [data.subjects, data.subjectRatings, td, exams, subjectLabels, subjectColors]);

  // Motivation quote
  const quote = MOTIVATIONAL_QUOTES[Math.floor(Date.now() / 60000) % MOTIVATIONAL_QUOTES.length];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Motivation Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-4"
        style={{ background: "var(--primary-light)" }}
      >
        <p className="text-sm" style={{ color: "var(--text)" }}>{quote}</p>
      </motion.div>

      {/* AI Coach Promo Banner */}
      <Link href="/dashboard/coach" onClick={() => posthog.capture("coach_banner_clicked")}>
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.01]"
          style={{
            background: "linear-gradient(135deg, #7b61ff, #1a73e8)",
            border: "none",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.2)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-bold text-white">AI Study Coach</p>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}>
                  FREE NOW
                </span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.8)" }}>
                Get personalized study advice, daily briefings &amp; smart plan changes. We&apos;re improving this feature over the next few days — try it free!
              </p>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" className="shrink-0">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </motion.div>
      </Link>

      {/* Exam Countdown */}
      {nextExam && (
        <Card
          className="!p-0 overflow-hidden"
          style={{
            background: examDays !== null && examDays <= 1
              ? "linear-gradient(135deg, #ef4444, #f97316)"
              : examDays !== null && examDays <= 3
              ? "linear-gradient(135deg, #f59e0b, #ef4444)"
              : undefined,
          }}
        >
          <div className="p-5">
            <p className="text-sm font-medium" style={{ color: examDays !== null && examDays <= 3 ? "#fff" : "var(--text-secondary)" }}>Next Exam</p>
            <p className="text-xl font-bold mt-1" style={{ color: examDays !== null && examDays <= 3 ? "#fff" : "var(--text)" }}>{nextExam.subject}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold" style={{ color: examDays !== null && examDays <= 3 ? "#fff" : "var(--primary)" }}>
                {examDays === 0 ? "TODAY" : `${examDays}d`}
              </span>
              <span className="text-sm" style={{ color: examDays !== null && examDays <= 3 ? "rgba(255,255,255,0.8)" : "var(--text-secondary)" }}>
                {formatDate(nextExam.date)} · {nextExam.duration}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatChip
          label="Hours Today"
          value={`${hoursToday.toFixed(1)}h`}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
        />
        <StatChip
          label="Chapters Done"
          value={chapsDone}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
          color="var(--success)"
        />
        <StatChip
          label="Day Streak"
          value={data.streak || 0}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>}
          color="var(--warning)"
        />
        <StatChip
          label="Sessions"
          value={sessionsToday}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>}
          color="#7b61ff"
        />
      </div>

      {/* Hours Progress */}
      <Card>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium" style={{ color: "var(--text)" }}>Study Progress Today</span>
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{hoursToday.toFixed(1)}h / {target}h</span>
        </div>
        <ProgressBar value={(hoursToday / target) * 100} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>Today&apos;s Schedule</h3>
          <div className="space-y-1">
            {plan.slice(0, 10).map((block, i) => {
              const blockStart = timeToMin(block.start);
              const blockEnd = timeToMin(block.end);
              const isCurrent = nowMin >= blockStart && nowMin < blockEnd;
              const isPast = nowMin >= blockEnd;
              const dotColor = block.type === "study" && block.subjectKey ? subjectColors[block.subjectKey] : undefined;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 py-1.5 px-2 rounded-lg text-sm ${isCurrent ? "ring-1 ring-[var(--primary)]" : ""}`}
                  style={{
                    opacity: isPast ? 0.5 : 1,
                    background: isCurrent ? "var(--primary-light)" : "transparent",
                  }}
                >
                  <span className="text-xs font-mono w-16 shrink-0" style={{ color: "var(--text-secondary)" }}>
                    {formatTime24(block.start)}
                  </span>
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: dotColor || "var(--border)" }}
                  />
                  <span style={{ color: "var(--text)" }}>{block.label}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Right column */}
        <div className="space-y-6">
          {/* Upcoming Exams */}
          <Card>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>Upcoming Exams</h3>
            <div className="space-y-3">
              {upcomingExams.map((exam) => {
                const days = daysBetween(td, exam.date);
                return (
                  <div key={exam.key} className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: subjectColors[exam.key] }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{exam.subject}</p>
                      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{formatDate(exam.date)} · {exam.duration}</p>
                    </div>
                    <span
                      className="text-sm font-bold"
                      style={{ color: days <= 3 ? "var(--danger)" : "var(--text-secondary)" }}
                    >
                      {days === 0 ? "TODAY" : `${days}d`}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Focus Areas */}
          <Card>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>Focus Areas</h3>
            {focusItems.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>No focus areas right now. Keep up the good work!</p>
            ) : (
              <div className="space-y-2">
                {focusItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{item.subject}</p>
                      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{item.detail}</p>
                    </div>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: item.tag === "weak" ? "#fef2f2" : "#fffbeb",
                        color: item.tag === "weak" ? "var(--danger)" : "var(--warning)",
                      }}
                    >
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
