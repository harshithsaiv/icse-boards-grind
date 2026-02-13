"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import posthog from "posthog-js";
import { useStore } from "@/store/use-store";
import { Card } from "@/components/ui/card";
import { JC_MCQ_QUESTIONS } from "@/lib/julius-caesar-data";

const QUIZ_SIZE = 10;

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

export function JCQuiz() {
  const jcQuizScores = useStore((s) => s.jcQuizScores);
  const update = useStore((s) => s.update);

  const [questions, setQuestions] = useState(() =>
    pickRandom(JC_MCQ_QUESTIONS, QUIZ_SIZE)
  );
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(QUIZ_SIZE).fill(null)
  );
  const [finished, setFinished] = useState(false);

  const q = questions[currentQ];

  const score = useMemo(() => {
    let s = 0;
    for (let i = 0; i < answers.length; i++) {
      if (answers[i] === questions[i]?.correctIndex) s++;
    }
    return s;
  }, [answers, questions]);

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setSubmitted(true);
    const isCorrect = selectedOption === q.correctIndex;
    posthog.capture("jc_quiz_question_answered", {
      question_id: q.id,
      question_number: currentQ + 1,
      correct: isCorrect,
    });
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQ] = selectedOption;
      return next;
    });
  };

  const handleNext = () => {
    if (currentQ === QUIZ_SIZE - 1) {
      // Finish quiz
      const finalAnswers = [...answers];
      finalAnswers[currentQ] = selectedOption;
      let finalScore = 0;
      for (let i = 0; i < finalAnswers.length; i++) {
        if (finalAnswers[i] === questions[i]?.correctIndex) finalScore++;
      }
      update((state) => ({
        jcQuizScores: [
          ...state.jcQuizScores,
          { score: finalScore, total: QUIZ_SIZE, timestamp: Date.now() },
        ],
      }));
      posthog.capture("jc_quiz_completed", {
        score: finalScore,
        total: QUIZ_SIZE,
        percentage: Math.round((finalScore / QUIZ_SIZE) * 100),
      });
      setFinished(true);
    } else {
      setCurrentQ((i) => i + 1);
      setSelectedOption(null);
      setSubmitted(false);
    }
  };

  const handleRetake = () => {
    posthog.capture("jc_quiz_retake");
    setQuestions(pickRandom(JC_MCQ_QUESTIONS, QUIZ_SIZE));
    setCurrentQ(0);
    setSelectedOption(null);
    setSubmitted(false);
    setAnswers(Array(QUIZ_SIZE).fill(null));
    setFinished(false);
  };

  if (finished) {
    let finalScore = 0;
    for (let i = 0; i < answers.length; i++) {
      if (answers[i] === questions[i]?.correctIndex) finalScore++;
    }
    const pct = Math.round((finalScore / QUIZ_SIZE) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card>
          <div className="text-center py-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold"
              style={{
                background:
                  pct >= 70
                    ? "rgba(52,168,83,0.12)"
                    : pct >= 40
                    ? "rgba(249,171,0,0.12)"
                    : "rgba(234,67,53,0.12)",
                color:
                  pct >= 70 ? "#34a853" : pct >= 40 ? "#f9ab00" : "#ea4335",
              }}
            >
              {pct}%
            </div>
            <h3
              className="text-lg font-bold mb-1"
              style={{ color: "var(--text)" }}
            >
              Quiz Complete!
            </h3>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
              You scored {finalScore} out of {QUIZ_SIZE}
            </p>

            {/* Breakdown */}
            <div className="flex flex-wrap justify-center gap-1.5 mb-6">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium"
                  style={{
                    background:
                      answers[i] === questions[i]?.correctIndex
                        ? "rgba(52,168,83,0.12)"
                        : "rgba(234,67,53,0.12)",
                    color:
                      answers[i] === questions[i]?.correctIndex
                        ? "#34a853"
                        : "#ea4335",
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            {jcQuizScores.length > 0 && (
              <p
                className="text-xs mb-4"
                style={{ color: "var(--text-secondary)" }}
              >
                Previous attempts: {jcQuizScores.length} |
                Best: {Math.max(...jcQuizScores.map((s) => Math.round((s.score / s.total) * 100)))}%
              </p>
            )}

            <button
              onClick={handleRetake}
              className="px-6 py-2.5 rounded-lg text-sm font-medium cursor-pointer"
              style={{ background: "var(--primary)", color: "#fff" }}
            >
              Retake Quiz
            </button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Question {currentQ + 1} of {QUIZ_SIZE}
          </span>
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {Math.round(((currentQ + 1) / QUIZ_SIZE) * 100)}%
          </span>
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: "var(--border)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "var(--primary)" }}
            animate={{ width: `${((currentQ + 1) / QUIZ_SIZE) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <Card>
        <p
          className="font-medium text-sm mb-4 leading-relaxed"
          style={{ color: "var(--text)" }}
        >
          {q.question}
        </p>

        <div className="space-y-2 mb-4">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.correctIndex;
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
                {opt}
              </button>
            );
          })}
        </div>

        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg p-3 text-sm mb-4"
            style={{
              background:
                selectedOption === q.correctIndex
                  ? "rgba(52,168,83,0.08)"
                  : "rgba(234,67,53,0.08)",
            }}
          >
            <span
              style={{
                color:
                  selectedOption === q.correctIndex ? "#34a853" : "#ea4335",
              }}
            >
              {selectedOption === q.correctIndex ? "Correct!" : "Incorrect."}
            </span>{" "}
            <span style={{ color: "var(--text)" }}>{q.explanation}</span>
          </motion.div>
        )}

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
          <button
            onClick={handleNext}
            className="px-5 py-2 rounded-lg text-sm font-medium cursor-pointer"
            style={{ background: "var(--primary)", color: "#fff" }}
          >
            {currentQ === QUIZ_SIZE - 1 ? "Finish Quiz" : "Next Question"}
          </button>
        )}
      </Card>
    </div>
  );
}
