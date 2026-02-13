"use client";

import { useStore } from "@/store/use-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DailyBriefing } from "@/components/coach/daily-briefing";
import { CoachChat } from "@/components/coach/coach-chat";
import Link from "next/link";

export default function CoachPage() {
  const grokApiKey = useStore((s) => s.grokApiKey);

  if (!grokApiKey) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: "var(--primary-light)" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>AI Study Coach</h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
            Get personalized study advice, daily briefings, and modify your study plan through conversation.
          </p>
          <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
            Add your xAI or Groq API key in Settings to get started.
          </p>
          <Link href="/dashboard/settings">
            <Button>Go to Settings</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <DailyBriefing />
      <CoachChat />
    </div>
  );
}
