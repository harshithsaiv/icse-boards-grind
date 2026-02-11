"use client";

import { useStore } from "@/store/use-store";
import { STATUS_CYCLE, STATUS_LABELS, type Chapter } from "@/lib/constants";
import { today, daysBetween } from "@/lib/utils";

interface ChapterRowProps {
  chapter: Chapter;
  subjectKey: string;
  index: number;
}

export function ChapterRow({ chapter, subjectKey, index }: ChapterRowProps) {
  const td = today();

  const statusColor: Record<string, string> = {
    not_started: "var(--border)",
    in_progress: "var(--warning)",
    completed: "var(--success)",
    needs_revision: "var(--danger)",
  };

  function cycleStatus() {
    const currentIdx = STATUS_CYCLE.indexOf(chapter.status);
    const nextStatus = STATUS_CYCLE[(currentIdx + 1) % STATUS_CYCLE.length];

    useStore.getState().update((state) => {
      const chapters = [...state.subjects[subjectKey]];
      const updated = { ...chapters[index], status: nextStatus };

      if (nextStatus === "needs_revision") {
        updated.revisionDate = today();
        updated.revisionIntervals = [1, 3, 7];
        updated.revisionsCompleted = 0;
      }

      chapters[index] = updated;
      return { subjects: { ...state.subjects, [subjectKey]: chapters } };
    });
  }

  function deleteChapter() {
    useStore.getState().update((state) => {
      const chapters = state.subjects[subjectKey].filter((_, i) => i !== index);
      return { subjects: { ...state.subjects, [subjectKey]: chapters } };
    });
  }

  // Revision badge info
  let revisionBadge: { text: string; urgent: boolean } | null = null;
  if (chapter.status === "needs_revision" && chapter.revisionDate && chapter.revisionIntervals) {
    const completed = chapter.revisionsCompleted || 0;
    if (completed < chapter.revisionIntervals.length) {
      const nextInterval = chapter.revisionIntervals[completed];
      const dueDate = new Date(chapter.revisionDate + "T00:00:00");
      dueDate.setDate(dueDate.getDate() + nextInterval);
      const dueDateStr = dueDate.toISOString().split("T")[0];
      const daysUntil = daysBetween(td, dueDateStr);

      if (daysUntil <= 0) {
        revisionBadge = { text: "Due today", urgent: true };
      } else if (daysUntil === 1) {
        revisionBadge = { text: "Due tomorrow", urgent: false };
      } else {
        revisionBadge = { text: `Due in ${daysUntil}d`, urgent: false };
      }
    } else {
      revisionBadge = { text: "All revisions done", urgent: false };
    }
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 4px",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Status cycle button */}
      <button
        onClick={cycleStatus}
        style={{
          width: 36,
          height: 36,
          minWidth: 36,
          borderRadius: 8,
          border: `2px solid ${statusColor[chapter.status]}`,
          background: chapter.status === "completed" ? "var(--success)" : "transparent",
          color: chapter.status === "completed" ? "#fff" : statusColor[chapter.status],
          fontSize: 16,
          fontWeight: 700,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.15s ease",
        }}
        title={`Status: ${chapter.status.replace("_", " ")}`}
      >
        {STATUS_LABELS[chapter.status]}
      </button>

      {/* Chapter name + revision badge */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            color: "var(--text)",
            fontSize: 14,
            fontWeight: 500,
            textDecoration: chapter.status === "completed" ? "line-through" : "none",
            opacity: chapter.status === "completed" ? 0.7 : 1,
          }}
        >
          {chapter.name}
        </span>
        {revisionBadge && (
          <span
            style={{
              marginLeft: 8,
              fontSize: 11,
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: 99,
              background: revisionBadge.urgent ? "var(--danger)" : "var(--warning)",
              color: "#fff",
              whiteSpace: "nowrap",
            }}
          >
            {revisionBadge.text}
          </span>
        )}
      </div>

      {/* Difficulty stars */}
      <div
        style={{
          display: "flex",
          gap: 2,
          fontSize: 12,
          color: "var(--warning)",
          flexShrink: 0,
        }}
        title={`Difficulty: ${chapter.difficulty}/5`}
      >
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} style={{ opacity: i < chapter.difficulty ? 1 : 0.25 }}>
            ★
          </span>
        ))}
      </div>

      {/* Delete button */}
      <button
        onClick={deleteChapter}
        style={{
          width: 28,
          height: 28,
          minWidth: 28,
          borderRadius: 6,
          border: "none",
          background: "transparent",
          color: "var(--text-secondary)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.5,
          transition: "opacity 0.15s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.color = "var(--danger)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.5"; e.currentTarget.style.color = "var(--text-secondary)"; }}
        title="Delete chapter"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
        </svg>
      </button>
    </div>
  );
}
