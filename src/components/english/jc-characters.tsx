"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import posthog from "posthog-js";
import { JC_CHARACTERS } from "@/lib/julius-caesar-data";

const TRAIT_COLORS = [
  "#7b61ff", "#1a73e8", "#34a853", "#f9ab00", "#ea4335",
  "#e040fb", "#00bcd4",
];

export function JCCharacters() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {JC_CHARACTERS.map((char, ci) => {
        const isOpen = expandedId === char.id;
        return (
          <div
            key={char.id}
            className="rounded-xl p-4 transition-all"
            style={{
              background: "var(--bg-card)",
              border: `1px solid ${isOpen ? "var(--primary)" : "var(--border)"}`,
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4
                  className="text-sm font-bold"
                  style={{ color: "var(--text)" }}
                >
                  {char.name}
                </h4>
                <p
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {char.role}
                </p>
              </div>
            </div>

            {/* Traits */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {char.traits.map((trait, ti) => (
                <span
                  key={trait}
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{
                    background: `${TRAIT_COLORS[(ci + ti) % TRAIT_COLORS.length]}15`,
                    color: TRAIT_COLORS[(ci + ti) % TRAIT_COLORS.length],
                  }}
                >
                  {trait}
                </span>
              ))}
            </div>

            <p
              className="text-xs leading-relaxed mb-3"
              style={{ color: "var(--text)" }}
            >
              {char.significance}
            </p>

            {/* Expandable quotes */}
            <button
              onClick={() => {
                const newState = isOpen ? null : char.id;
                setExpandedId(newState);
                if (newState) {
                  posthog.capture("jc_character_quotes_expanded", {
                    character_id: char.id,
                    character_name: char.name,
                  });
                }
              }}
              className="text-xs font-medium cursor-pointer flex items-center gap-1"
              style={{ color: "var(--primary)" }}
            >
              Key Quotes ({char.keyQuotes.length})
              <motion.svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <polyline points="6 9 12 15 18 9" />
              </motion.svg>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 space-y-2">
                    {char.keyQuotes.map((kq, i) => (
                      <div
                        key={i}
                        className="rounded-lg p-3"
                        style={{
                          background: "rgba(123,97,255,0.05)",
                          border: "1px solid rgba(123,97,255,0.1)",
                        }}
                      >
                        <p
                          className="text-xs italic mb-1"
                          style={{ color: "var(--text)" }}
                        >
                          &ldquo;{kq.quote}&rdquo;
                        </p>
                        <p
                          className="text-[10px]"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {kq.context}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
