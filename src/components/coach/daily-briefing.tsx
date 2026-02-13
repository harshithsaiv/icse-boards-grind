"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store/use-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { sendChatCompletionSync } from "@/lib/ai-service";
import { buildDailyBriefingPrompt } from "@/lib/coach-prompts";
import { today } from "@/lib/utils";

export function DailyBriefing() {
  const data = useStore();
  const td = today();
  const cached = (data.dailyBriefingCache || {})[td];
  const [content, setContent] = useState(cached?.content || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBriefing = async () => {
    if (!data.grokApiKey) return;
    setLoading(true);
    setError("");
    try {
      const prompt = buildDailyBriefingPrompt(data);
      const result = await sendChatCompletionSync(data.grokApiKey, [
        { role: "system", content: prompt },
        { role: "user", content: "Give me my daily briefing." },
      ]);
      setContent(result);
      useStore.getState().update((s) => ({
        dailyBriefingCache: {
          ...s.dailyBriefingCache,
          [td]: { content: result, timestamp: Date.now() },
        },
      }));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!content && data.grokApiKey) {
      fetchBriefing();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <Card>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }} />
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Preparing your daily briefing...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <p className="text-sm" style={{ color: "var(--danger)" }}>Failed to load briefing: {error}</p>
        <Button variant="secondary" size="sm" onClick={fetchBriefing} className="mt-2">Retry</Button>
      </Card>
    );
  }

  if (!content) return null;

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>Daily Briefing</h3>
        <Button variant="ghost" size="sm" onClick={fetchBriefing}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
          </svg>
        </Button>
      </div>
      <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text)" }}>
        {content.split(/(\*\*.*?\*\*)/).map((part, i) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
          }
          return <span key={i}>{part}</span>;
        })}
      </div>
    </Card>
  );
}
