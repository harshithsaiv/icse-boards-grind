"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import posthog from "posthog-js";
import { useAuth } from "@/providers/auth-provider";
import { useStore } from "@/store/use-store";
import { SECOND_LANGUAGES, ELECTIVES, getSubjectLabels, getSubjectColors } from "@/lib/constants";
import { Button } from "@/components/ui/button";

const TOTAL_STEPS = 9;

export default function OnboardingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const setField = useStore((s) => s.setField);
  const update = useStore((s) => s.update);

  // Force dark theme on onboarding page
  useEffect(() => {
    setField("theme", "dark");
  }, [setField]);

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("kannada");
  const [selectedElective, setSelectedElective] = useState("computer");
  const [learningStyle, setLearningStyle] = useState("mixed");
  const [studyHours, setStudyHours] = useState(8);
  const [ratings, setRatings] = useState<Record<string, string>>({});
  const [targetPercent, setTargetPercent] = useState(90);
  const [prepLevel, setPrepLevel] = useState("somewhat");
  const [routine, setRoutine] = useState({
    wake: "06:00", breakfast: "08:00", lunch: "13:00",
    snack: "17:00", dinner: "20:30", sleep: "22:30",
  });
  // Compute dynamic labels/colors based on selections
  const subjectLabels = useMemo(() => getSubjectLabels(selectedLanguage, selectedElective), [selectedLanguage, selectedElective]);
  const subjectColors = useMemo(() => getSubjectColors(selectedLanguage, selectedElective), [selectedLanguage, selectedElective]);

  // Initialize ratings when labels change
  useEffect(() => {
    setRatings((prev) => {
      const r: Record<string, string> = {};
      Object.keys(subjectLabels).forEach((k) => (r[k] = prev[k] || "medium"));
      return r;
    });
  }, [subjectLabels]);

  if (!user) {
    router.replace("/login");
    return null;
  }

  const handleNext = () => {
    if (step === 1 && !name.trim()) return;
    if (step < TOTAL_STEPS) {
      posthog.capture("onboarding_step_completed", { step });
      setStep(step + 1);
    } else {
      // Save all data
      update((s) => ({
        ...s,
        name: name.trim(),
        selectedLanguage,
        selectedElective,
        learningStyle: learningStyle as "visual" | "reading" | "practice" | "mixed",
        studyHours,
        subjectRatings: ratings as Record<string, "weak" | "medium" | "strong">,
        targetPercent,
        prepLevel: prepLevel as "just_started" | "somewhat" | "mostly_done",
        routine,
        onboarded: true,
      }));
      posthog.capture("onboarding_completed", {
        language: selectedLanguage,
        elective: selectedElective,
        learning_style: learningStyle,
        study_hours: studyHours,
        target_percent: targetPercent,
        prep_level: prepLevel,
      });
      router.replace("/dashboard");
    }
  };

  const styleOptions = [
    { value: "visual", label: "Visual", desc: "Diagrams, videos, charts", icon: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" },
    { value: "reading", label: "Reading", desc: "Textbooks, notes, summaries", icon: "M4 19.5A2.5 2.5 0 016.5 17H20" },
    { value: "practice", label: "Practice", desc: "Problems, past papers", icon: "M12 20h9" },
    { value: "mixed", label: "Mixed", desc: "Combination of all styles", icon: "M12 2L2 7l10 5 10-5-10-5z" },
  ];

  const prepOptions = [
    { value: "just_started", label: "Just Started", desc: "Beginning my preparation" },
    { value: "somewhat", label: "Somewhat Prepared", desc: "Covered some topics" },
    { value: "mostly_done", label: "Mostly Done", desc: "Almost finished revising" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="mb-6">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "var(--primary)" }}
              animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
          <p className="text-xs text-center mt-2" style={{ color: "var(--text-secondary)" }}>Step {step} of {TOTAL_STEPS}</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="rounded-2xl p-6" style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-md)" }}>
              {/* Step 1: Name */}
              {step === 1 && (
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: "var(--primary-light)" }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  </div>
                  <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text)" }}>What&apos;s your name?</h2>
                  <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>Let&apos;s personalize your study dashboard</p>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleNext()}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl text-center text-lg outline-none"
                    style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
                    autoFocus
                  />
                </div>
              )}

              {/* Step 2: Second Language */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-bold mb-1 text-center" style={{ color: "var(--text)" }}>Choose your second language</h2>
                  <p className="text-sm mb-4 text-center" style={{ color: "var(--text-secondary)" }}>Select the language you&apos;re taking for ICSE</p>
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {SECOND_LANGUAGES.map((lang) => (
                      <button
                        key={lang.key}
                        onClick={() => setSelectedLanguage(lang.key)}
                        className="w-full p-3 rounded-xl text-left transition-all flex items-center justify-between"
                        style={{
                          background: selectedLanguage === lang.key ? "var(--primary-light)" : "var(--bg)",
                          border: `2px solid ${selectedLanguage === lang.key ? "var(--primary)" : "var(--border)"}`,
                        }}
                      >
                        <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{lang.name}</span>
                        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{lang.date}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Elective */}
              {step === 3 && (
                <div>
                  <h2 className="text-xl font-bold mb-1 text-center" style={{ color: "var(--text)" }}>Choose your elective</h2>
                  <p className="text-sm mb-4 text-center" style={{ color: "var(--text-secondary)" }}>Select your Group II / III elective subject</p>
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {ELECTIVES.map((elective) => (
                      <button
                        key={elective.key}
                        onClick={() => setSelectedElective(elective.key)}
                        className="w-full p-3 rounded-xl text-left transition-all flex items-center justify-between"
                        style={{
                          background: selectedElective === elective.key ? "var(--primary-light)" : "var(--bg)",
                          border: `2px solid ${selectedElective === elective.key ? "var(--primary)" : "var(--border)"}`,
                        }}
                      >
                        <div>
                          <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{elective.name}</span>
                          <span className="text-xs ml-2 px-1.5 py-0.5 rounded" style={{ color: "var(--text-secondary)", background: "var(--bg)" }}>
                            Group {elective.group}
                          </span>
                        </div>
                        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{elective.date}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Learning Style */}
              {step === 4 && (
                <div>
                  <h2 className="text-xl font-bold mb-1 text-center" style={{ color: "var(--text)" }}>How do you learn best?</h2>
                  <p className="text-sm mb-6 text-center" style={{ color: "var(--text-secondary)" }}>We&apos;ll tailor suggestions to your style</p>
                  <div className="grid grid-cols-2 gap-3">
                    {styleOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setLearningStyle(opt.value)}
                        className="p-4 rounded-xl text-left transition-all"
                        style={{
                          background: learningStyle === opt.value ? "var(--primary-light)" : "var(--bg)",
                          border: `2px solid ${learningStyle === opt.value ? "var(--primary)" : "var(--border)"}`,
                        }}
                      >
                        <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{opt.label}</p>
                        <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: Study Hours */}
              {step === 5 && (
                <div className="text-center">
                  <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text)" }}>Daily study target?</h2>
                  <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>Set your daily study hours goal</p>
                  <p className="text-4xl font-bold mb-4" style={{ color: "var(--primary)" }}>{studyHours}h</p>
                  <input
                    type="range" min="2" max="14" value={studyHours}
                    onChange={(e) => setStudyHours(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                    <span>2h</span><span>14h</span>
                  </div>
                </div>
              )}

              {/* Step 6: Subject Confidence */}
              {step === 6 && (
                <div>
                  <h2 className="text-xl font-bold mb-1 text-center" style={{ color: "var(--text)" }}>Rate your confidence</h2>
                  <p className="text-sm mb-4 text-center" style={{ color: "var(--text-secondary)" }}>How prepared are you in each subject?</p>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {Object.keys(subjectLabels).map((key) => (
                      <div key={key} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: subjectColors[key] }} />
                        <span className="text-sm flex-1 truncate" style={{ color: "var(--text)" }}>{subjectLabels[key]}</span>
                        <div className="flex gap-1">
                          {(["weak", "medium", "strong"] as const).map((r) => (
                            <button
                              key={r}
                              onClick={() => setRatings({ ...ratings, [key]: r })}
                              className="px-2 py-1 rounded text-xs font-medium"
                              style={{
                                background: ratings[key] === r ? "var(--primary)" : "var(--bg)",
                                color: ratings[key] === r ? "#fff" : "var(--text-secondary)",
                                border: `1px solid ${ratings[key] === r ? "var(--primary)" : "var(--border)"}`,
                              }}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 7: Target Percentage */}
              {step === 7 && (
                <div className="text-center">
                  <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text)" }}>Target percentage?</h2>
                  <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>What marks are you aiming for?</p>
                  <p className="text-4xl font-bold mb-4" style={{ color: "var(--primary)" }}>{targetPercent}%</p>
                  <input
                    type="range" min="50" max="100" value={targetPercent}
                    onChange={(e) => setTargetPercent(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}

              {/* Step 8: Prep Level */}
              {step === 8 && (
                <div>
                  <h2 className="text-xl font-bold mb-1 text-center" style={{ color: "var(--text)" }}>How prepared are you?</h2>
                  <p className="text-sm mb-6 text-center" style={{ color: "var(--text-secondary)" }}>Your current preparation status</p>
                  <div className="space-y-3">
                    {prepOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setPrepLevel(opt.value)}
                        className="w-full p-4 rounded-xl text-left transition-all"
                        style={{
                          background: prepLevel === opt.value ? "var(--primary-light)" : "var(--bg)",
                          border: `2px solid ${prepLevel === opt.value ? "var(--primary)" : "var(--border)"}`,
                        }}
                      >
                        <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{opt.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 9: Daily Routine */}
              {step === 9 && (
                <div>
                  <h2 className="text-xl font-bold mb-1 text-center" style={{ color: "var(--text)" }}>Your daily routine</h2>
                  <p className="text-sm mb-4 text-center" style={{ color: "var(--text-secondary)" }}>We&apos;ll plan study blocks around your schedule</p>
                  <div className="grid grid-cols-2 gap-3">
                    {(["wake", "breakfast", "lunch", "snack", "dinner", "sleep"] as const).map((key) => (
                      <div key={key}>
                        <label className="block text-xs font-medium mb-1 capitalize" style={{ color: "var(--text-secondary)" }}>{key}</label>
                        <input
                          type="time"
                          value={routine[key]}
                          onChange={(e) => setRoutine({ ...routine, [key]: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg text-sm"
                          style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <Button variant="secondary" onClick={() => setStep(step - 1)} className="flex-1">
              Back
            </Button>
          )}
          <Button onClick={handleNext} className="flex-1" size="lg">
            {step === TOTAL_STEPS ? "Get Started" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
