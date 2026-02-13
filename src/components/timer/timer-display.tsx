"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import posthog from "posthog-js";
import { useStore } from "@/store/use-store";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { today, playBeep, sendNotification } from "@/lib/utils";

type TimerPhase = "work" | "break";
type Preset = "pomodoro" | "deep" | "custom";

interface TimerDisplayProps {
  subject: string;
  chapter: string;
}

export function TimerDisplay({ subject, chapter }: TimerDisplayProps) {
  const [timerWorkMinutes, setTimerWorkMinutes] = useState(25);
  const [timerBreakMinutes, setTimerBreakMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerTotalSeconds, setTimerTotalSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerPhase, setTimerPhase] = useState<TimerPhase>("work");
  const [preset, setPreset] = useState<Preset>("pomodoro");
  const [customWork, setCustomWork] = useState(30);
  const [customBreak, setCustomBreak] = useState(10);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const logStudyTime = useCallback(() => {
    const td = today();
    useStore.getState().update((s) => {
      const studyLog = { ...s.studyLog };
      const existing = studyLog[td] || { hours: 0, sessions: 0 };
      studyLog[td] = {
        hours: existing.hours + timerWorkMinutes / 60,
        sessions: existing.sessions + 1,
      };

      // Update streak
      let streak = s.streak;
      const lastDate = s.lastStudyDate;
      if (lastDate !== td) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yStr = yesterday.toISOString().split("T")[0];
        streak = lastDate === yStr ? streak + 1 : 1;
      }

      // Push timer session
      const timerSessions = [
        ...s.timerSessions,
        {
          date: td,
          subject: subject || "general",
          chapter: chapter || "",
          minutes: timerWorkMinutes,
        },
      ];

      return {
        studyLog,
        streak,
        lastStudyDate: td,
        timerSessions,
      };
    });
  }, [timerWorkMinutes, subject, chapter]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimerRunning(false);
  }, []);

  const tick = useCallback(() => {
    setTimerSeconds((prev) => {
      if (prev <= 1) {
        // Timer reached zero
        playBeep();
        if (timerPhase === "work") {
          sendNotification(
            "Work Session Complete!",
            `Great job! ${timerWorkMinutes} min session done. Time for a break.`,
            "timer-work-done"
          );
          logStudyTime();
          posthog.capture("timer_completed", {
            subject: subject || "general",
            chapter: chapter || "",
            duration_minutes: timerWorkMinutes,
          });
          // Switch to break phase
          const breakSecs = timerBreakMinutes * 60;
          setTimerPhase("break");
          setTimerTotalSeconds(breakSecs);
          return breakSecs;
        } else {
          // Break finished
          sendNotification(
            "Break Over!",
            "Ready to get back to work?",
            "timer-break-done"
          );
          // Switch to work phase but stop timer
          const workSecs = timerWorkMinutes * 60;
          setTimerPhase("work");
          setTimerTotalSeconds(workSecs);
          stopTimer();
          return workSecs;
        }
      }
      return prev - 1;
    });
  }, [timerPhase, timerWorkMinutes, timerBreakMinutes, logStudyTime, stopTimer]);

  // Timer interval
  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(tick, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerRunning, tick]);

  const applyPreset = useCallback(
    (p: Preset) => {
      setPreset(p);
      stopTimer();
      setTimerPhase("work");
      let work: number, brk: number;
      if (p === "pomodoro") {
        work = 25;
        brk = 5;
      } else if (p === "deep") {
        work = 50;
        brk = 10;
      } else {
        work = customWork;
        brk = customBreak;
      }
      setTimerWorkMinutes(work);
      setTimerBreakMinutes(brk);
      setTimerSeconds(work * 60);
      setTimerTotalSeconds(work * 60);
    },
    [customWork, customBreak, stopTimer]
  );

  const applyCustom = useCallback(() => {
    stopTimer();
    setTimerPhase("work");
    setTimerWorkMinutes(customWork);
    setTimerBreakMinutes(customBreak);
    setTimerSeconds(customWork * 60);
    setTimerTotalSeconds(customWork * 60);
  }, [customWork, customBreak, stopTimer]);

  const handleStart = () => {
    posthog.capture("timer_started", {
      subject: subject || "general",
      chapter: chapter || "",
      duration_minutes: timerWorkMinutes,
      preset,
    });
    setTimerRunning(true);
  };
  const handlePause = () => setTimerRunning(false);
  const handleReset = () => {
    stopTimer();
    setTimerPhase("work");
    const secs = timerWorkMinutes * 60;
    setTimerSeconds(secs);
    setTimerTotalSeconds(secs);
  };

  // Format time
  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const timeDisplay = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Progress calculation
  const progress = timerTotalSeconds > 0 ? timerSeconds / timerTotalSeconds : 0;

  // Ring color
  const ringColor = timerPhase === "work" ? "var(--primary)" : "#16a34a";

  return (
    <Card>
      {/* Preset selector */}
      <div className="flex gap-2 mb-6">
        {(
          [
            { key: "pomodoro", label: "25/5 Pomodoro" },
            { key: "deep", label: "50/10 Deep Focus" },
            { key: "custom", label: "Custom" },
          ] as const
        ).map((p) => (
          <button
            key={p.key}
            onClick={() => applyPreset(p.key)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: preset === p.key ? "var(--primary)" : "var(--bg)",
              color: preset === p.key ? "#fff" : "var(--text-secondary)",
              border: `1px solid ${preset === p.key ? "var(--primary)" : "var(--border)"}`,
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom inputs */}
      {preset === "custom" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex gap-3 mb-6"
        >
          <div className="flex-1">
            <Input
              label="Work (min)"
              type="number"
              min={1}
              max={120}
              value={customWork}
              onChange={(e) => setCustomWork(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
          <div className="flex-1">
            <Input
              label="Break (min)"
              type="number"
              min={1}
              max={60}
              value={customBreak}
              onChange={(e) => setCustomBreak(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
          <div className="flex items-end">
            <Button size="sm" onClick={applyCustom}>
              Apply
            </Button>
          </div>
        </motion.div>
      )}

      {/* Timer ring */}
      <div className="flex flex-col items-center">
        <div className={timerRunning ? "timer-active" : ""}>
          <ProgressRing
            radius={90}
            stroke={8}
            progress={progress}
            color={ringColor}
          >
            <div className="flex flex-col items-center">
              <span
                className="text-4xl font-bold font-mono tracking-wider"
                style={{ color: "var(--text)" }}
              >
                {timeDisplay}
              </span>
              <span
                className="text-sm font-medium mt-1"
                style={{
                  color: timerPhase === "work" ? "var(--primary)" : "#16a34a",
                }}
              >
                {timerPhase === "work" ? "Work" : "Break"}
              </span>
            </div>
          </ProgressRing>
        </div>

        {/* Controls */}
        <div className="flex gap-3 mt-6">
          {!timerRunning ? (
            <Button onClick={handleStart} size="lg">
              <span className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Start
              </span>
            </Button>
          ) : (
            <Button onClick={handlePause} variant="secondary" size="lg">
              <span className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
                Pause
              </span>
            </Button>
          )}
          <Button onClick={handleReset} variant="ghost" size="lg">
            <span className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
              </svg>
              Reset
            </span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
