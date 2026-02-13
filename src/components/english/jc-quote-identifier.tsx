"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import posthog from "posthog-js";
import { JC_QUOTES } from "@/lib/julius-caesar-data";

export function JCQuoteIdentifier() {
  const shuffledQuotes = useMemo(() => {
    const arr = [...JC_QUOTES];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  const quote = shuffledQuotes[currentIndex];

  const handleSubmit = () => {
    if (!selectedOption) return;
    setSubmitted(true);
    setTotalAnswered((t) => t + 1);
    const isCorrect = selectedOption === quote.correctSpeaker;
    if (isCorrect) {
      setScore((s) => s + 1);
    }
    posthog.capture("jc_quote_answered", {
      quote_id: quote.id,
      correct: isCorrect,
      act: quote.act,
      scene: quote.scene,
    });
  };

  const handleNext = () => {
    setSubmitted(false);
    setSelectedOption(null);
    setCurrentIndex((i) => (i + 1) % shuffledQuotes.length);
  };

  const handleReset = () => {
    posthog.capture("jc_quote_reset", { score, total: totalAnswered });
    setCurrentIndex(0);
    setSelectedOption(null);
    setSubmitted(false);
    setScore(0);
    setTotalAnswered(0);
  };

  return (
    <div className="space-y-4">
      {/* Score */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
          Quote {currentIndex + 1} of {shuffledQuotes.length}
        </span>
        <div className="flex items-center gap-3">
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(52,168,83,0.12)", color: "#34a853" }}
          >
            Score: {score}/{totalAnswered}
          </span>
          {totalAnswered > 0 && (
            <button
              onClick={handleReset}
              className="text-xs cursor-pointer"
              style={{ color: "var(--text-secondary)" }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={quote.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="rounded-xl p-5"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          <p
            className="text-base font-serif italic leading-relaxed mb-1"
            style={{ color: "var(--text)" }}
          >
            &ldquo;{quote.quote}&rdquo;
          </p>
          <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
            Who said this?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {quote.options.map((opt) => {
              const isCorrect = opt === quote.correctSpeaker;
              const isSelected = selectedOption === opt;
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
                  key={opt}
                  onClick={() => !submitted && setSelectedOption(opt)}
                  disabled={submitted}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer disabled:cursor-default text-left"
                  style={{ background: bg, border: `1px solid ${border}`, color }}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              Act {quote.act}, Scene {quote.scene}
            </motion.div>
          )}

          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className="px-5 py-2 rounded-lg text-sm font-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "var(--primary)", color: "#fff" }}
            >
              Submit
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-lg text-sm font-medium cursor-pointer"
              style={{ background: "var(--primary)", color: "#fff" }}
            >
              Next Quote
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
