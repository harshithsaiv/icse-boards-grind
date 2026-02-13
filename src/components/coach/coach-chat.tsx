"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import posthog from "posthog-js";
import { useStore } from "@/store/use-store";
import type { CoachMessage } from "@/store/use-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { sendChatCompletion, type ChatMessage } from "@/lib/ai-service";
import { buildSystemPrompt } from "@/lib/coach-prompts";
import { parsePlanChanges, stripPlanChangeTags, applyPlanChanges } from "@/lib/plan-change-parser";
import { getDayPlan } from "@/lib/algorithms";
import { today, getEffectiveAIKey } from "@/lib/utils";

const QUICK_PROMPTS = [
  "What should I focus on?",
  "Change today's plan",
  "How am I doing?",
  "Motivate me!",
];

export function CoachChat() {
  const data = useStore();
  const td = today();
  const messages: CoachMessage[] = (data.coachMessages || {})[td] || [];

  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamText, scrollToBottom]);

  const addMessage = (msg: CoachMessage) => {
    useStore.getState().update((s) => {
      const existing = (s.coachMessages || {})[td] || [];
      return {
        coachMessages: {
          ...s.coachMessages,
          [td]: [...existing, msg],
        },
      };
    });
  };

  const sendMessage = async (text: string, source: "typed" | "quick_prompt" = "typed") => {
    const apiKey = getEffectiveAIKey(data.grokApiKey);
    if (!text.trim() || streaming) return;

    const userMsg: CoachMessage = {
      role: "user",
      content: text.trim(),
      timestamp: Date.now(),
    };
    addMessage(userMsg);
    posthog.capture("coach_message_sent", {
      source,
      message_length: text.trim().length,
      is_quick_prompt: source === "quick_prompt",
    });
    setInput("");
    setStreaming(true);
    setStreamText("");

    const systemPrompt = buildSystemPrompt(data);
    const chatHistory: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      { role: "user", content: text.trim() },
    ];

    let fullResponse = "";

    await sendChatCompletion(
      apiKey,
      chatHistory,
      (token) => {
        fullResponse += token;
        setStreamText(fullResponse);
      },
      () => {
        const planChanges = parsePlanChanges(fullResponse);
        const assistantMsg: CoachMessage = {
          role: "assistant",
          content: fullResponse,
          timestamp: Date.now(),
          planChanges: planChanges.length > 0 ? planChanges : undefined,
        };
        addMessage(assistantMsg);
        setStreaming(false);
        setStreamText("");
      },
      (error) => {
        addMessage({
          role: "assistant",
          content: `Sorry, I encountered an error: ${error}`,
          timestamp: Date.now(),
        });
        setStreaming(false);
        setStreamText("");
      }
    );
  };

  const handleApplyChanges = (msg: CoachMessage) => {
    if (!msg.planChanges) return;
    const currentPlan = getDayPlan(td, data);
    const newPlan = applyPlanChanges(currentPlan, msg.planChanges);
    useStore.getState().update((s) => ({
      customPlans: { ...s.customPlans, [td]: newPlan },
    }));

    // Mark changes as applied
    useStore.getState().update((s) => {
      const dayMessages = (s.coachMessages || {})[td] || [];
      const updated = dayMessages.map((m) => {
        if (m.timestamp === msg.timestamp && m.planChanges) {
          return { ...m, planChanges: m.planChanges.map((c) => ({ ...c, applied: true })) };
        }
        return m;
      });
      return { coachMessages: { ...s.coachMessages, [td]: updated } };
    });
  };

  const renderMessage = (msg: CoachMessage, i: number) => {
    const isUser = msg.role === "user";
    const displayContent = msg.planChanges ? stripPlanChangeTags(msg.content) : msg.content;
    const allApplied = msg.planChanges?.every((c) => c.applied);

    return (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      >
        <div
          className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm"
          style={{
            background: isUser ? "var(--primary)" : "var(--bg)",
            color: isUser ? "#fff" : "var(--text)",
            border: isUser ? "none" : "1px solid var(--border)",
          }}
        >
          <div className="whitespace-pre-wrap leading-relaxed">
            {displayContent.split(/(\*\*.*?\*\*)/).map((part, j) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={j}>{part.slice(2, -2)}</strong>;
              }
              return <span key={j}>{part}</span>;
            })}
          </div>

          {msg.planChanges && msg.planChanges.length > 0 && (
            <div className="mt-3 p-3 rounded-xl" style={{ background: "var(--primary-light)", border: "1px solid var(--primary)" }}>
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--primary)" }}>
                Suggested Plan Changes ({msg.planChanges.length})
              </p>
              <div className="space-y-1">
                {msg.planChanges.map((change, ci) => (
                  <div key={ci} className="text-xs" style={{ color: "var(--text)" }}>
                    <span className="font-mono">{change.start}-{change.end}</span>{" "}
                    <span className="font-medium">{change.action.toUpperCase()}</span>: {change.label}
                  </div>
                ))}
              </div>
              {!allApplied ? (
                <Button size="sm" onClick={() => handleApplyChanges(msg)} className="mt-2">
                  Apply to Plan
                </Button>
              ) : (
                <p className="text-xs mt-2 font-medium" style={{ color: "var(--success)" }}>Applied!</p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <Card className="flex flex-col" style={{ height: "calc(100vh - 320px)", minHeight: 400 }}>
      <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>Chat with your AI Coach</h3>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1">
        {messages.length === 0 && !streaming && (
          <div className="text-center py-8">
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Ask me anything about your study plan, progress, or get motivation!
            </p>
          </div>
        )}

        {messages.map((msg, i) => renderMessage(msg, i))}

        {streaming && streamText && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div
              className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap"
              style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" }}
            >
              {streamText}
              <span className="inline-block w-1 h-4 ml-0.5 animate-pulse" style={{ background: "var(--primary)" }} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick prompts */}
      <div className="flex flex-wrap gap-2 mb-3">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => sendMessage(prompt, "quick_prompt")}
            disabled={streaming}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-[1.02]"
            style={{
              background: "var(--bg)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border)",
              opacity: streaming ? 0.5 : 1,
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
          placeholder="Ask your AI Coach..."
          disabled={streaming}
          className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
        />
        <Button onClick={() => sendMessage(input)} disabled={!input.trim() || streaming} size="sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </Button>
      </div>
    </Card>
  );
}
