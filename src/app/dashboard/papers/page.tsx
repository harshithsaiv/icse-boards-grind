"use client";

import { useMemo, useState, useEffect } from "react";
import { capture } from "@/lib/analytics";
import { useStore } from "@/store/use-store";
import { Card } from "@/components/ui/card";
import { StatChip } from "@/components/ui/stat-chip";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getSubjectLabels, getSubjectColors, ALL_SUBJECT_LABELS, ALL_SUBJECT_COLORS } from "@/lib/constants";
import {
  PRACTICE_PAPERS,
  getPapersForSubjects,
  getAllSubjectsWithPapers,
  getAvailableYears,
  type PracticePaper,
} from "@/lib/practice-papers";

const TYPE_LABELS: Record<string, string> = {
  board: "Board",
  specimen: "Specimen",
  practice: "Practice",
};

const TYPE_COLORS: Record<string, string> = {
  board: "#7b61ff",
  specimen: "#1a73e8",
  practice: "#f9ab00",
};

export default function PapersPage() {
  const lang = useStore((s) => s.selectedLanguage) || "kannada";
  const elective = useStore((s) => s.selectedElective) || "computer";
  const solvedPapers = useStore((s) => s.solvedPapers) || [];
  const update = useStore((s) => s.update);

  const subjectLabels = useMemo(() => getSubjectLabels(lang, elective), [lang, elective]);
  const subjectColors = useMemo(() => getSubjectColors(lang, elective), [lang, elective]);
  const fullSubjectLabels = useMemo(() => ({ ...ALL_SUBJECT_LABELS, ...subjectLabels }), [subjectLabels]);
  const fullSubjectColors = useMemo(() => ({ ...ALL_SUBJECT_COLORS, ...subjectColors }), [subjectColors]);
  const subjectKeys = useMemo(() => Object.keys(subjectLabels), [subjectLabels]);
  const allSubjectKeys = useMemo(() => getAllSubjectsWithPapers(), []);
  const availableYears = useMemo(() => getAvailableYears(), []);

  useEffect(() => {
    capture("papers_page_viewed");
  }, []);

  // Toggle: show only my subjects vs all papers
  const [showAllPapers, setShowAllPapers] = useState(false);
  const effectiveSubjectKeys = showAllPapers ? allSubjectKeys : subjectKeys;

  // Track filter changes
  useEffect(() => {
    if (showAllPapers) {
      capture("papers_show_all_toggled", { show_all: true });
    }
  }, [showAllPapers]);

  // All papers relevant to selected scope (my subjects or all)
  const userPapers = useMemo(() => getPapersForSubjects(effectiveSubjectKeys), [effectiveSubjectKeys]);

  // Filter state
  const [filterSubject, setFilterSubject] = useState<string | null>(null);
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);

  // Filtered papers
  const filteredPapers = useMemo(() => {
    let papers = userPapers;
    if (filterSubject) papers = papers.filter((p) => p.subject === filterSubject);
    if (filterYear) papers = papers.filter((p) => p.year === filterYear);
    if (filterType) papers = papers.filter((p) => p.type === filterType);
    return papers;
  }, [userPapers, filterSubject, filterYear, filterType]);

  // Stats
  const solvedCount = useMemo(
    () => userPapers.filter((p) => solvedPapers.includes(p.id)).length,
    [userPapers, solvedPapers]
  );
  const totalCount = userPapers.length;
  const completionPct = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  // Per-subject stats (use effectiveSubjectKeys when showing all)
  const subjectStats = useMemo(() => {
    const stats: { key: string; label: string; color: string; solved: number; total: number }[] = [];
    for (const key of effectiveSubjectKeys) {
      const papers = userPapers.filter((p) => p.subject === key);
      if (papers.length === 0) continue;
      const solved = papers.filter((p) => solvedPapers.includes(p.id)).length;
      stats.push({
        key,
        label: fullSubjectLabels[key] || subjectLabels[key] || key,
        color: (showAllPapers ? fullSubjectColors : subjectColors)[key] || "#5f6368",
        solved,
        total: papers.length,
      });
    }
    return stats.sort((a, b) => b.total - a.total);
  }, [effectiveSubjectKeys, userPapers, solvedPapers, subjectLabels, subjectColors, fullSubjectLabels, fullSubjectColors, showAllPapers]);

  // Subjects that actually have papers (for filter pills)
  const subjectsWithPapers = useMemo(
    () => subjectStats.map((s) => s.key),
    [subjectStats]
  );

  const labelsForDisplay = showAllPapers ? fullSubjectLabels : subjectLabels;
  const colorsForDisplay = showAllPapers ? fullSubjectColors : subjectColors;

  const toggleSolved = (paperId: string) => {
    const wasSolved = solvedPapers.includes(paperId);
    const paper = userPapers.find((p) => p.id === paperId);
    update((state) => {
      const current = state.solvedPapers || [];
      if (current.includes(paperId)) {
        return { solvedPapers: current.filter((id) => id !== paperId) };
      }
      return { solvedPapers: [...current, paperId] };
    });
    capture(wasSolved ? "paper_unsolved" : "paper_solved", {
      paper_id: paperId,
      subject: paper?.subject,
      year: paper?.year,
      type: paper?.type,
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
          Practice Papers
        </h1>
        <span
          className="px-2 py-0.5 rounded-full text-xs font-semibold"
          style={{ background: "rgba(123,97,255,0.15)", color: "#7b61ff" }}
        >
          {solvedCount}/{totalCount} solved
        </span>
      </div>

      {/* Filter Bar */}
      <div className="space-y-3">
        {/* My subjects vs All papers toggle */}
        <div className="flex flex-wrap gap-2 items-center">
          <FilterPill
            label="My subjects"
            active={!showAllPapers}
            onClick={() => setShowAllPapers(false)}
          />
          <FilterPill
            label="All papers"
            active={showAllPapers}
            onClick={() => setShowAllPapers(true)}
            color="#7b61ff"
          />
        </div>
        {/* Subject pills */}
        <div className="flex flex-wrap gap-2">
          <FilterPill
            label="All Subjects"
            active={filterSubject === null}
            onClick={() => setFilterSubject(null)}
          />
          {subjectsWithPapers.map((key) => (
            <FilterPill
              key={key}
              label={labelsForDisplay[key] || key}
              active={filterSubject === key}
              onClick={() => setFilterSubject(filterSubject === key ? null : key)}
              color={colorsForDisplay[key]}
            />
          ))}
        </div>

        {/* Year + Type pills */}
        <div className="flex flex-wrap gap-2">
          <FilterPill
            label="All Years"
            active={filterYear === null}
            onClick={() => setFilterYear(null)}
          />
          {availableYears.map((y) => (
            <FilterPill
              key={y}
              label={String(y)}
              active={filterYear === y}
              onClick={() => setFilterYear(filterYear === y ? null : y)}
            />
          ))}
          <span className="w-px h-6 self-center" style={{ background: "var(--border)" }} />
          <FilterPill
            label="All Types"
            active={filterType === null}
            onClick={() => setFilterType(null)}
          />
          {(["board", "specimen", "practice"] as const).map((t) => (
            <FilterPill
              key={t}
              label={TYPE_LABELS[t]}
              active={filterType === t}
              onClick={() => setFilterType(filterType === t ? null : t)}
              color={TYPE_COLORS[t]}
            />
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatChip
          label="Papers Solved"
          value={solvedCount}
          color="#34a853"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          }
        />
        <StatChip
          label="Total Papers"
          value={totalCount}
          color="#7b61ff"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          }
        />
        <StatChip
          label="Completion"
          value={`${completionPct}%`}
          color="#1a73e8"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          }
        />
      </div>

      {/* Subject Progress */}
      {subjectStats.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>
            Papers by Subject
          </h3>
          <div className="space-y-3">
            {subjectStats.map((s) => (
              <div key={s.key} className="flex items-center gap-3">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: s.color }}
                />
                <span
                  className="text-sm w-32 shrink-0 truncate"
                  style={{ color: "var(--text)" }}
                >
                  {s.label}
                </span>
                <div className="flex-1">
                  <ProgressBar
                    value={s.total > 0 ? Math.round((s.solved / s.total) * 100) : 0}
                    color={s.color}
                  />
                </div>
                <span
                  className="text-sm font-medium w-12 text-right"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {s.solved}/{s.total}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Paper Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredPapers.map((paper) => (
          <PaperCard
            key={paper.id}
            paper={paper}
            solved={solvedPapers.includes(paper.id)}
            subjectLabel={labelsForDisplay[paper.subject] || paper.subject}
            subjectColor={colorsForDisplay[paper.subject] || "#5f6368"}
            onToggle={() => toggleSolved(paper.id)}
          />
        ))}
        {filteredPapers.length === 0 && (
          <div
            className="col-span-full py-12 text-center text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            No papers match the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}

function FilterPill({
  label,
  active,
  onClick,
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer"
      style={{
        background: active
          ? color || "var(--primary)"
          : "var(--bg-card)",
        color: active ? "#fff" : "var(--text-secondary)",
        border: `1px solid ${active ? "transparent" : "var(--border)"}`,
      }}
    >
      {label}
    </button>
  );
}

function PaperCard({
  paper,
  solved,
  subjectLabel,
  subjectColor,
  onToggle,
}: {
  paper: PracticePaper;
  solved: boolean;
  subjectLabel: string;
  subjectColor: string;
  onToggle: () => void;
}) {
  return (
    <div
      className="rounded-xl p-4 transition-all"
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${solved ? "#34a853" : "var(--border)"}`,
        borderLeft: `3px solid ${solved ? "#34a853" : "var(--border)"}`,
      }}
    >
      {/* Top row: type badge + year */}
      <div className="flex items-center justify-between mb-2">
        <span
          className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase"
          style={{
            background: `${TYPE_COLORS[paper.type]}20`,
            color: TYPE_COLORS[paper.type],
          }}
        >
          {TYPE_LABELS[paper.type]}
        </span>
        <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
          {paper.year}
        </span>
      </div>

      {/* Title (links to respaper) */}
      <a
        href={paper.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-sm font-medium mb-2 hover:underline"
        style={{ color: "var(--text)" }}
      >
        {paper.title}
      </a>

      {/* Bottom row: subject + solved toggle */}
      <div className="flex items-center justify-between">
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-medium"
          style={{ background: `${subjectColor}15`, color: subjectColor }}
        >
          {subjectLabel}
        </span>
        <button
          onClick={onToggle}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer"
          style={{
            background: solved ? "rgba(52,168,83,0.12)" : "transparent",
            color: solved ? "#34a853" : "var(--text-secondary)",
            border: `1px solid ${solved ? "#34a853" : "var(--border)"}`,
          }}
        >
          {solved ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#34a853" stroke="#34a853" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <polyline points="9 12 11.5 14.5 16 9.5" stroke="#fff" strokeWidth="2.5" fill="none" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="3" />
            </svg>
          )}
          {solved ? "Solved" : "Mark Solved"}
        </button>
      </div>
    </div>
  );
}
