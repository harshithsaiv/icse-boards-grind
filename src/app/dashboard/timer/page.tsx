"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store/use-store";
import { getSubjectLabels } from "@/lib/constants";
import { today } from "@/lib/utils";
import { getDayPlan } from "@/lib/algorithms";
import { Select } from "@/components/ui/select";
import { TimerDisplay } from "@/components/timer/timer-display";
import { TimerStats } from "@/components/timer/timer-stats";
import { AmbientPlayer } from "@/components/timer/ambient-player";

export default function TimerPage() {
  const data = useStore();
  const td = today();

  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");

  const SUBJECT_LABELS = useMemo(() => getSubjectLabels(data.selectedLanguage || "kannada", data.selectedElective || "computer"), [data.selectedLanguage, data.selectedElective]);

  // Build subject options
  const subjectOptions = useMemo(() => {
    const opts = [{ value: "", label: "Select Subject" }];
    Object.keys(SUBJECT_LABELS).forEach((key) => {
      opts.push({ value: key, label: SUBJECT_LABELS[key] });
    });
    return opts;
  }, [SUBJECT_LABELS]);

  // Build chapter options based on selected subject
  const chapterOptions = useMemo(() => {
    const opts = [{ value: "", label: "Select Chapter" }];
    if (selectedSubject && data.subjects[selectedSubject]) {
      data.subjects[selectedSubject].forEach((ch) => {
        opts.push({ value: ch.name, label: ch.name });
      });
    }
    return opts;
  }, [selectedSubject, data.subjects]);

  // Auto-suggest current study block from day plan
  useEffect(() => {
    if (selectedSubject) return; // Don't override manual selection

    const plan = getDayPlan(td, data);
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();

    const currentBlock = plan.find((b) => {
      if (b.type !== "study" || !b.subjectKey) return false;
      const [sh, sm] = b.start.split(":").map(Number);
      const [eh, em] = b.end.split(":").map(Number);
      const startMin = sh * 60 + sm;
      const endMin = eh * 60 + em;
      return nowMin >= startMin && nowMin < endMin;
    });

    if (currentBlock?.subjectKey) {
      setSelectedSubject(currentBlock.subjectKey);
      // Try to pick the first incomplete chapter for this subject
      const chapters = data.subjects[currentBlock.subjectKey] || [];
      const incomplete = chapters.find((c) => c.status !== "completed");
      if (incomplete) {
        setSelectedChapter(incomplete.name);
      }
    }
  }, [td]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset chapter when subject changes
  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    setSelectedChapter("");
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1
          className="text-xl font-bold"
          style={{ color: "var(--text)" }}
        >
          Study Timer
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: "var(--text-secondary)" }}
        >
          Stay focused with timed study sessions
        </p>
      </motion.div>

      {/* Subject / Chapter selection */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6"
      >
        <Select
          label="Subject"
          options={subjectOptions}
          value={selectedSubject}
          onChange={(e) => handleSubjectChange(e.target.value)}
        />
        <Select
          label="Chapter"
          options={chapterOptions}
          value={selectedChapter}
          onChange={(e) => setSelectedChapter(e.target.value)}
          disabled={!selectedSubject}
        />
      </motion.div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left column: Timer + Ambient (wider) */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3 space-y-4"
        >
          <TimerDisplay
            subject={selectedSubject}
            chapter={selectedChapter}
          />
          <AmbientPlayer />
        </motion.div>

        {/* Right column: Stats */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2"
        >
          <TimerStats />
        </motion.div>
      </div>
    </div>
  );
}
