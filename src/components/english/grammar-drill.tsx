"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import posthog from "posthog-js";
import { useStore } from "@/store/use-store";
import { Card } from "@/components/ui/card";
import { sendChatCompletionSync } from "@/lib/ai-service";
import {
  GRAMMAR_CATEGORIES,
  getGrammarPrompt,
  parseGrammarResponse,
  type ParsedGrammarQuestion,
} from "@/lib/grammar-prompts";
import { getEffectiveAIKey } from "@/lib/utils";

export function GrammarDrill() {
  const grokApiKey = useStore((s) => s.grokApiKey);
  const grammarDrillStats = useStore((s) => s.grammarDrillStats);
  const update = useStore((s) => s.update);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState<ParsedGrammarQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const generateQuestion = useCallback(
    async (categoryId: string) => {
      setLoading(true);
      setError(null);
      setQuestion(null);
      setSelectedOption(null);
      setSubmitted(false);

      try {
        const prompt = getGrammarPrompt(categoryId);
        const effectiveKey = getEffectiveAIKey(grokApiKey);
        const response = await sendChatCompletionSync(effectiveKey, [
          { role: "user", content: prompt },
        ]);
        const parsed = parseGrammarResponse(response);
        if (!parsed) {
          setError("Could not parse AI response. Try again.");
          return;
        }
        setQuestion(parsed);
        posthog.capture("grammar_question_generated", { category: categoryId });
      } catch (err) {
        setError((err as Error).message);
        posthog.capture("grammar_question_failed", { category: categoryId, error: (err as Error).message });
      } finally {
        setLoading(false);
      }
    },
    [grokApiKey]  // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleSelectCategory = (id: string) => {
    setSelectedCategory(id);
    posthog.capture("grammar_category_selected", { category: id });
    generateQuestion(id);
  };

  const handleSubmit = () => {
    if (selectedOption === null || !question || !selectedCategory) return;
    setSubmitted(true);

    const isCorrect = selectedOption === question.correctIndex;
    posthog.capture("grammar_question_answered", {
      category: selectedCategory,
      correct: isCorrect,
    });
    
    update((state) => {
      const stats = { ...state.grammarDrillStats };
      const prev = stats[selectedCategory] || { attempted: 0, correct: 0 };
      stats[selectedCategory] = {
        attempted: prev.attempted + 1,
        correct: prev.correct + (isCorrect ? 1 : 0),
      };
      return { grammarDrillStats: stats };
    });
  };

  return (
    <div className="space-y-4">
      {/* Free AI banner */}
      {!selectedCategory && (
        <div
          className="rounded-xl px-4 py-3 text-center text-sm"
          style={{
            background: "rgba(52,168,83,0.08)",
            border: "1px solid rgba(52,168,83,0.2)",
            color: "#34a853",
          }}
        >
          AI-powered grammar drills are <strong>free</strong> for the next 4 days — no API key needed!
        </div>
      )}

      {/* Category Selection */}
      {!selectedCategory && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {GRAMMAR_CATEGORIES.map((cat) => {
            const stats = grammarDrillStats[cat.id];
            const accuracy =
              stats && stats.attempted > 0
                ? Math.round((stats.correct / stats.attempted) * 100)
                : null;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className="text-left rounded-xl p-4 transition-all hover:scale-[1.02] cursor-pointer"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
              >
                <p
                  className="font-semibold text-sm mb-1"
                  style={{ color: "var(--text)" }}
                >
                  {cat.label}
                </p>
                <p
                  className="text-xs mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {cat.description}
                </p>
                {stats && (
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background:
                          accuracy !== null && accuracy >= 70
                            ? "rgba(52,168,83,0.12)"
                            : "rgba(234,67,53,0.12)",
                        color:
                          accuracy !== null && accuracy >= 70
                            ? "#34a853"
                            : "#ea4335",
                      }}
                    >
                      {accuracy}% accuracy
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {stats.attempted} attempted
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Active Drill */}
      {selectedCategory && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setQuestion(null);
                setSubmitted(false);
                setSelectedOption(null);
              }}
              className="text-sm font-medium px-3 py-1.5 rounded-lg cursor-pointer"
              style={{
                color: "var(--primary)",
                background: "rgba(123,97,255,0.1)",
              }}
            >
              Back to categories
            </button>
            <span
              className="text-sm font-semibold"
              style={{ color: "var(--text)" }}
            >
              {GRAMMAR_CATEGORIES.find((c) => c.id === selectedCategory)?.label}
            </span>
          </div>

          {loading && (
            <Card>
              <div className="flex items-center justify-center py-12 gap-3">
                <div
                  className="w-5 h-5 border-2 rounded-full animate-spin"
                  style={{
                    borderColor: "var(--border)",
                    borderTopColor: "var(--primary)",
                  }}
                />
                <span
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Generating question...
                </span>
              </div>
            </Card>
          )}

          {error && (
            <Card>
              <div className="text-center py-6">
                <p className="text-sm text-red-500 mb-3">{error}</p>
                <button
                  onClick={() => generateQuestion(selectedCategory)}
                  className="text-sm font-medium px-4 py-2 rounded-lg cursor-pointer"
                  style={{
                    background: "var(--primary)",
                    color: "#fff",
                  }}
                >
                  Try Again
                </button>
              </div>
            </Card>
          )}

          <AnimatePresence mode="wait">
            {question && !loading && (
              <motion.div
                key={question.question}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card>
                  <p
                    className="font-medium text-sm mb-4"
                    style={{ color: "var(--text)" }}
                  >
                    {question.question}
                  </p>

                  <div className="space-y-2 mb-4">
                    {question.options.map((opt, i) => {
                      const isCorrect = i === question.correctIndex;
                      const isSelected = selectedOption === i;
                      let bg = "transparent";
                      let border = "var(--border)";
                      let color = "var(--text)";

                      if (submitted) {
                        if (isCorrect) {
                          bg = "rgba(52,168,83,0.1)";
                          border = "#34a853";
                          color = "#34a853";
                        } else if (isSelected && !isCorrect) {
                          bg = "rgba(234,67,53,0.1)";
                          border = "#ea4335";
                          color = "#ea4335";
                        }
                      } else if (isSelected) {
                        bg = "rgba(123,97,255,0.1)";
                        border = "var(--primary)";
                        color = "var(--primary)";
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => !submitted && setSelectedOption(i)}
                          disabled={submitted}
                          className="w-full text-left px-4 py-3 rounded-lg text-sm transition-all cursor-pointer disabled:cursor-default"
                          style={{ background: bg, border: `1px solid ${border}`, color }}
                        >
                          <span className="font-semibold mr-2">
                            {["A", "B", "C", "D"][i]}.
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {!submitted ? (
                    <button
                      onClick={handleSubmit}
                      disabled={selectedOption === null}
                      className="px-5 py-2 rounded-lg text-sm font-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: "var(--primary)", color: "#fff" }}
                    >
                      Submit
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div
                        className="rounded-lg p-3 text-sm"
                        style={{
                          background:
                            selectedOption === question.correctIndex
                              ? "rgba(52,168,83,0.08)"
                              : "rgba(234,67,53,0.08)",
                          color:
                            selectedOption === question.correctIndex
                              ? "#34a853"
                              : "#ea4335",
                        }}
                      >
                        {selectedOption === question.correctIndex
                          ? "Correct!"
                          : "Incorrect."}{" "}
                        <span style={{ color: "var(--text)" }}>
                          {question.explanation}
                        </span>
                      </div>
                      <button
                        onClick={() => generateQuestion(selectedCategory)}
                        className="px-5 py-2 rounded-lg text-sm font-medium cursor-pointer"
                        style={{ background: "var(--primary)", color: "#fff" }}
                      >
                        Next Question
                      </button>
                    </div>
                  )}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
