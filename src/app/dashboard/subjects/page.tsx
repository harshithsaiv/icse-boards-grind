"use client";

import { useMemo, useEffect } from "react";
import posthog from "posthog-js";
import { useStore } from "@/store/use-store";
import { getSubjectLabels } from "@/lib/constants";
import { SubjectCard } from "@/components/subjects/subject-card";

export default function SubjectsPage() {
  const lang = useStore((s) => s.selectedLanguage) || "kannada";
  const elective = useStore((s) => s.selectedElective) || "computer";
  const subjectLabels = useMemo(() => getSubjectLabels(lang, elective), [lang, elective]);
  const subjectKeys = Object.keys(subjectLabels);

  useEffect(() => {
    posthog.capture("subjects_page_viewed");
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-3">
      <div style={{ marginBottom: 8 }}>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "var(--text)",
            marginBottom: 4,
          }}
        >
          Subjects
        </h2>
        <p
          style={{
            fontSize: 13,
            color: "var(--text-secondary)",
          }}
        >
          Track your chapters and revision status across all subjects.
        </p>
      </div>

      {subjectKeys.map((key) => (
        <SubjectCard key={key} subjectKey={key} />
      ))}
    </div>
  );
}
