"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { DailyBriefing } from "@/components/coach/daily-briefing";
import { CoachChat } from "@/components/coach/coach-chat";

export default function CoachPage() {
  useEffect(() => {
    posthog.capture("coach_page_viewed");
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Free trial banner */}
      <div
        className="rounded-xl p-4 flex items-start gap-3"
        style={{
          background: "linear-gradient(135deg, rgba(123,97,255,0.12), rgba(26,115,232,0.12))",
          border: "1px solid rgba(123,97,255,0.25)",
        }}
      >
        <span className="text-lg mt-0.5">&#9889;</span>
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            AI Coach is free to try right now!
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            We&apos;re making this feature even better in the next 2-3 days. Try it out and let us know what you think!
          </p>
        </div>
      </div>
      <DailyBriefing />
      <CoachChat />
    </div>
  );
}
