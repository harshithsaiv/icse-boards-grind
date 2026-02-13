"use client";

import { useMemo } from "react";
import { useStore } from "@/store/use-store";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ProgressRing } from "@/components/ui/progress-ring";
import { getExams, getSubjectLabels, getSubjectColors } from "@/lib/constants";
import { today, dateStr, formatDate } from "@/lib/utils";

export default function ProgressPage() {
  const data = useStore();

  const lang = data.selectedLanguage || "kannada";
  const elective = data.selectedElective || "computer";
  const exams = useMemo(() => getExams(lang, elective), [lang, elective]);
  const subjectLabels = useMemo(() => getSubjectLabels(lang, elective), [lang, elective]);
  const subjectColors = useMemo(() => getSubjectColors(lang, elective), [lang, elective]);

  const { totalChapters, completedChapters, overallPct, totalHours, subjectStats } = useMemo(() => {
    let total = 0;
    let completed = 0;
    let hours = 0;
    Object.values(data.studyLog || {}).forEach((log) => { hours += log.hours || 0; });

    const stats: { key: string; label: string; color: string; done: number; total: number; pct: number }[] = [];
    Object.keys(subjectLabels).forEach((key) => {
      const chapters = data.subjects[key] || [];
      const done = chapters.filter((c) => c.status === "completed").length;
      total += chapters.length;
      completed += done;
      stats.push({
        key,
        label: subjectLabels[key],
        color: subjectColors[key],
        done,
        total: chapters.length,
        pct: chapters.length > 0 ? Math.round((done / chapters.length) * 100) : 0,
      });
    });

    return {
      totalChapters: total,
      completedChapters: completed,
      overallPct: total > 0 ? Math.round((completed / total) * 100) : 0,
      totalHours: hours,
      subjectStats: stats,
    };
  }, [data.subjects, data.studyLog, subjectLabels, subjectColors]);

  // Heatmap data (last 60 days)
  const heatmapData = useMemo(() => {
    const now = new Date();
    const log = data.studyLog || {};
    let maxH = 1;
    const days: { date: string; hours: number; month: number }[] = [];
    for (let i = 59; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const ds = dateStr(d);
      const h = log[ds] ? log[ds].hours : 0;
      if (h > maxH) maxH = h;
      days.push({ date: ds, hours: h, month: d.getMonth() });
    }
    return { days, maxH };
  }, [data.studyLog]);

  // Weekly analytics
  const weeklyData = useMemo(() => {
    const now = new Date();
    const log = data.studyLog || {};
    const weeks: { hours: number; sessions: number; label: string }[] = [];
    for (let w = 0; w < 4; w++) {
      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() - w * 7);
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekStart.getDate() - 6);
      let hours = 0;
      let sessions = 0;
      for (let i = 0; i < 7; i++) {
        const d = new Date(weekStart);
        d.setDate(d.getDate() + i);
        const ds = dateStr(d);
        if (log[ds]) { hours += log[ds].hours || 0; sessions += log[ds].sessions || 0; }
      }
      const label = w === 0 ? "This Week" : w === 1 ? "Last Week" : weekStart.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
      weeks.push({ hours: Math.round(hours * 10) / 10, sessions, label });
    }
    return weeks.reverse();
  }, [data.studyLog]);

  const maxWeeklyHours = Math.max(...weeklyData.map((w) => w.hours), 1);

  // Exam assessments
  const assessments = data.examAssessments || {};
  const ratedExams = exams.filter((e) => assessments[e.key] && !assessments[e.key].skipped);

  // Subject distribution from timer sessions this week
  const subjectDist = useMemo(() => {
    const sessions = data.timerSessions || [];
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + (weekStart.getDay() === 0 ? -6 : 1));
    const weekStartStr = dateStr(weekStart);
    const mins: Record<string, number> = {};
    let totalMins = 0;
    sessions.forEach((s) => {
      if (s.date >= weekStartStr && s.subject) {
        mins[s.subject] = (mins[s.subject] || 0) + (s.minutes || 0);
        totalMins += s.minutes || 0;
      }
    });
    return { mins, totalMins };
  }, [data.timerSessions]);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Ring */}
        <Card className="flex flex-col items-center justify-center">
          <ProgressRing radius={85} stroke={10} progress={overallPct / 100} color="var(--primary)">
            <div className="text-center">
              <span className="text-3xl font-bold" style={{ color: "var(--text)" }}>{overallPct}%</span>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Overall</p>
            </div>
          </ProgressRing>
          <div className="flex gap-6 mt-4">
            <div className="text-center">
              <p className="text-lg font-bold" style={{ color: "var(--text)" }}>{totalHours.toFixed(1)}h</p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Total Study</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold" style={{ color: "var(--text)" }}>{completedChapters}</p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Chapters Done</p>
            </div>
          </div>
        </Card>

        {/* Subject Progress */}
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>Subject Progress</h3>
          <div className="space-y-3">
            {subjectStats.map((s) => (
              <div key={s.key} className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                <span className="text-sm w-32 shrink-0 truncate" style={{ color: "var(--text)" }}>{s.label}</span>
                <div className="flex-1">
                  <ProgressBar value={s.pct} color={s.color} />
                </div>
                <span className="text-sm font-medium w-10 text-right" style={{ color: "var(--text-secondary)" }}>{s.pct}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Heatmap */}
      <Card>
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>Study Activity (Last 60 Days)</h3>
        {/* Month labels */}
        <div className="flex mb-1">
          {(() => {
            let lastMonth = -1;
            const spans: { name: string; count: number }[] = [];
            let currentCount = 0;
            heatmapData.days.forEach((day) => {
              if (day.month !== lastMonth) {
                if (lastMonth !== -1) spans.push({ name: monthNames[lastMonth], count: currentCount });
                currentCount = 1;
                lastMonth = day.month;
              } else {
                currentCount++;
              }
            });
            if (lastMonth !== -1) spans.push({ name: monthNames[lastMonth], count: currentCount });
            return spans.map((ms, i) => (
              <span key={i} className="text-[10px]" style={{ color: "var(--text-secondary)", width: ms.count * 14 }}>{ms.name}</span>
            ));
          })()}
        </div>
        <div className="flex flex-wrap gap-1">
          {heatmapData.days.map((day, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-sm"
              style={{
                background: "var(--primary)",
                opacity: day.hours > 0 ? Math.max(0.15, day.hours / heatmapData.maxH) : 0.05,
              }}
              title={`${formatDate(day.date)}: ${day.hours.toFixed(1)}h`}
            />
          ))}
        </div>
      </Card>

      {/* Weekly Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>Weekly Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Study Hours</span>
              <span className="text-sm font-bold" style={{ color: "var(--text)" }}>{weeklyData[3]?.hours || 0}h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Sessions</span>
              <span className="text-sm font-bold" style={{ color: "var(--text)" }}>{weeklyData[3]?.sessions || 0}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>Last 4 Weeks</h3>
          <div className="flex items-end gap-3 h-32">
            {weeklyData.map((w, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{w.hours}h</span>
                <div className="w-full rounded-t-md" style={{
                  height: `${Math.max((w.hours / maxWeeklyHours) * 100, 4)}%`,
                  background: "var(--primary)",
                  opacity: i === 3 ? 1 : 0.5,
                }} />
                <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>{w.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Subject Distribution */}
      {subjectDist.totalMins > 0 && (
        <Card>
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>Subject Distribution (This Week)</h3>
          <div className="space-y-2">
            {Object.entries(subjectDist.mins).sort((a, b) => b[1] - a[1]).map(([key, mins]) => {
              const pct = Math.round((mins / subjectDist.totalMins) * 100);
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: subjectColors[key] }} />
                  <span className="text-sm w-28 truncate" style={{ color: "var(--text)" }}>{subjectLabels[key] || key}</span>
                  <div className="flex-1">
                    <ProgressBar value={pct} color={subjectColors[key]} />
                  </div>
                  <span className="text-sm w-10 text-right" style={{ color: "var(--text-secondary)" }}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Exam Assessments */}
      {ratedExams.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>Exam Self-Assessments</h3>
          <div className="space-y-3">
            {ratedExams.map((exam) => {
              const a = assessments[exam.key];
              return (
                <div key={exam.key} className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: subjectColors[exam.key] }} />
                  <span className="text-sm flex-1" style={{ color: "var(--text)" }}>{exam.subject}</span>
                  <span className="text-sm" style={{ color: "var(--warning)" }}>
                    {"\u2605".repeat(a.rating)}{"\u2606".repeat(5 - a.rating)}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
