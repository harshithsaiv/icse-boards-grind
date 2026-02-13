"use client";

import { useState, useMemo, useEffect } from "react";
import posthog from "posthog-js";
import { useStore } from "@/store/use-store";
import { StatChip } from "@/components/ui/stat-chip";
import { JCScenes } from "@/components/english/jc-scenes";
import { JCFlashcards } from "@/components/english/jc-flashcards";
import { JCQuiz } from "@/components/english/jc-quiz";
import { JCCharacters } from "@/components/english/jc-characters";
import { JCQuoteIdentifier } from "@/components/english/jc-quote-identifier";
import { GrammarDrill } from "@/components/english/grammar-drill";

type MainTab = "grammar" | "julius-caesar";
type JCSubTab = "flashcards" | "quotes" | "scenes" | "characters" | "quiz";

const JC_SUB_TABS: { id: JCSubTab; label: string }[] = [
  { id: "flashcards", label: "Flashcards" },
  { id: "quotes", label: "Quote Identifier" },
  { id: "scenes", label: "Scenes" },
  { id: "characters", label: "Characters" },
  { id: "quiz", label: "MCQ Quiz" },
];

export default function EnglishPage() {
  const grammarDrillStats = useStore((s) => s.grammarDrillStats);
  const jcFlashcardsReviewed = useStore((s) => s.jcFlashcardsReviewed);
  const jcQuizScores = useStore((s) => s.jcQuizScores);

  const [mainTab, setMainTab] = useState<MainTab>("grammar");
  const [jcSubTab, setJcSubTab] = useState<JCSubTab>("flashcards");

  useEffect(() => {
    posthog.capture("english_page_viewed");
  }, []);

  // Stats
  const grammarStats = useMemo(() => {
    const entries = Object.values(grammarDrillStats);
    const total = entries.reduce((a, e) => a + e.attempted, 0);
    const correct = entries.reduce((a, e) => a + e.correct, 0);
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { total, correct, accuracy };
  }, [grammarDrillStats]);

  const bestQuizScore = useMemo(() => {
    if (jcQuizScores.length === 0) return null;
    return Math.max(
      ...jcQuizScores.map((s) => Math.round((s.score / s.total) * 100))
    );
  }, [jcQuizScores]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
          English Practice
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          Grammar drills (Paper 1) and Julius Caesar revision (Paper 2)
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatChip
          label="Grammar Accuracy"
          value={grammarStats.total > 0 ? `${grammarStats.accuracy}%` : "--"}
          color="#7b61ff"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          }
        />
        <StatChip
          label="Flashcards Reviewed"
          value={jcFlashcardsReviewed.length}
          color="#1a73e8"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M12 4v16" />
            </svg>
          }
        />
        <StatChip
          label="Best Quiz Score"
          value={bestQuizScore !== null ? `${bestQuizScore}%` : "--"}
          color="#34a853"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="7" />
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
            </svg>
          }
        />
      </div>

      {/* Main Tabs */}
      <div className="flex gap-2">
        {(["grammar", "julius-caesar"] as MainTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setMainTab(tab)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
            style={{
              background:
                mainTab === tab ? "var(--primary)" : "var(--bg-card)",
              color: mainTab === tab ? "#fff" : "var(--text-secondary)",
              border: `1px solid ${
                mainTab === tab ? "transparent" : "var(--border)"
              }`,
            }}
          >
            {tab === "grammar" ? "Grammar Drills" : "Julius Caesar"}
          </button>
        ))}
      </div>

      {/* Grammar Drills */}
      {mainTab === "grammar" && <GrammarDrill />}

      {/* Julius Caesar */}
      {mainTab === "julius-caesar" && (
        <div className="space-y-4">
          {/* Sub-tabs */}
          <div className="flex flex-wrap gap-2">
            {JC_SUB_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setJcSubTab(tab.id)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer"
                style={{
                  background:
                    jcSubTab === tab.id
                      ? "rgba(123,97,255,0.15)"
                      : "var(--bg-card)",
                  color:
                    jcSubTab === tab.id ? "#7b61ff" : "var(--text-secondary)",
                  border: `1px solid ${
                    jcSubTab === tab.id
                      ? "rgba(123,97,255,0.3)"
                      : "var(--border)"
                  }`,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {jcSubTab === "flashcards" && <JCFlashcards />}
          {jcSubTab === "quotes" && <JCQuoteIdentifier />}
          {jcSubTab === "scenes" && <JCScenes />}
          {jcSubTab === "characters" && <JCCharacters />}
          {jcSubTab === "quiz" && <JCQuiz />}
        </div>
      )}
    </div>
  );
}
