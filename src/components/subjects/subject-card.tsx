"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/use-store";
import { getSubjectColors, getSubjectLabels, type Chapter } from "@/lib/constants";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ChapterRow } from "@/components/subjects/chapter-row";

interface SubjectCardProps {
  subjectKey: string;
}

export function SubjectCard({ subjectKey }: SubjectCardProps) {
  const chapters: Chapter[] = useStore((s) => s.subjects[subjectKey] || []);
  const lang = useStore((s) => s.selectedLanguage) || "kannada";
  const elective = useStore((s) => s.selectedElective) || "computer";
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [newChapterName, setNewChapterName] = useState("");
  const [newDifficulty, setNewDifficulty] = useState(3);

  const labels = getSubjectLabels(lang, elective);
  const colors = getSubjectColors(lang, elective);
  const label = labels[subjectKey] || subjectKey;
  const color = colors[subjectKey] || "var(--primary)";

  const completed = chapters.filter((ch) => ch.status === "completed").length;
  const total = chapters.length;
  const pct = total > 0 ? (completed / total) * 100 : 0;

  function addChapter() {
    if (!newChapterName.trim()) return;

    useStore.getState().update((state) => {
      const existing = state.subjects[subjectKey] || [];
      const newChapter: Chapter = {
        name: newChapterName.trim(),
        status: "not_started",
        difficulty: newDifficulty,
      };
      return {
        subjects: { ...state.subjects, [subjectKey]: [...existing, newChapter] },
      };
    });

    setNewChapterName("");
    setNewDifficulty(3);
    setModalOpen(false);
  }

  return (
    <>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        {/* Header - click to expand */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "16px 20px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          {/* Color dot */}
          <span
            style={{
              width: 12,
              height: 12,
              minWidth: 12,
              borderRadius: "50%",
              background: color,
            }}
          />

          {/* Label + count */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <span
              style={{
                color: "var(--text)",
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              {label}
            </span>
            <span
              style={{
                marginLeft: 10,
                color: "var(--text-secondary)",
                fontSize: 13,
              }}
            >
              {completed}/{total} done
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ width: 120, flexShrink: 0 }}>
            <ProgressBar value={pct} color={color} height={6} />
          </div>

          {/* Chevron */}
          <motion.svg
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-secondary)"
            strokeWidth="2"
            style={{ flexShrink: 0 }}
          >
            <polyline points="6 9 12 15 18 9" />
          </motion.svg>
        </button>

        {/* Expandable body */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <div
                style={{
                  padding: "0 20px 16px",
                  borderTop: "1px solid var(--border)",
                }}
              >
                {/* Chapter list */}
                {chapters.length === 0 ? (
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: 13,
                      padding: "16px 0 8px",
                    }}
                  >
                    No chapters added yet. Add your first chapter to start tracking.
                  </p>
                ) : (
                  <div style={{ paddingTop: 8 }}>
                    {chapters.map((ch, i) => (
                      <ChapterRow
                        key={`${subjectKey}-${i}`}
                        chapter={ch}
                        subjectKey={subjectKey}
                        index={i}
                      />
                    ))}
                  </div>
                )}

                {/* Add Chapter button */}
                <div style={{ paddingTop: 12 }}>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setModalOpen(true)}
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Chapter
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Add Chapter Modal */}
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setNewChapterName("");
          setNewDifficulty(3);
        }}
        title={`Add Chapter — ${label}`}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Chapter name */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 500,
                marginBottom: 6,
                color: "var(--text)",
              }}
            >
              Chapter Name
            </label>
            <input
              type="text"
              value={newChapterName}
              onChange={(e) => setNewChapterName(e.target.value)}
              placeholder="e.g. Refraction of Light"
              onKeyDown={(e) => { if (e.key === "Enter") addChapter(); }}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--bg)",
                color: "var(--text)",
                fontSize: 14,
                outline: "none",
              }}
            />
          </div>

          {/* Difficulty stars */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 500,
                marginBottom: 6,
                color: "var(--text)",
              }}
            >
              Difficulty
            </label>
            <div style={{ display: "flex", gap: 6 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setNewDifficulty(star)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: star <= newDifficulty ? "var(--warning)" : "var(--bg)",
                    color: star <= newDifficulty ? "#fff" : "var(--text-secondary)",
                    fontSize: 16,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 4 }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setModalOpen(false);
                setNewChapterName("");
                setNewDifficulty(3);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={addChapter}
              disabled={!newChapterName.trim()}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
