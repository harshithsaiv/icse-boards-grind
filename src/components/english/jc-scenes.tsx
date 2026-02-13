"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import posthog from "posthog-js";
import { JC_SCENES } from "@/lib/julius-caesar-data";

export function JCScenes() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const acts = [3, 4, 5] as const;

  return (
    <div className="space-y-6">
      {acts.map((act) => {
        const scenes = JC_SCENES.filter((s) => s.act === act);
        return (
          <div key={act}>
            <h3
              className="text-sm font-bold uppercase tracking-wide mb-3"
              style={{ color: "var(--primary)" }}
            >
              Act {act}
            </h3>
            <div className="space-y-2">
              {scenes.map((scene) => {
                const isOpen = expandedId === scene.id;
                return (
                  <div
                    key={scene.id}
                    className="rounded-xl overflow-hidden"
                    style={{
                      background: "var(--bg-card)",
                      border: `1px solid ${isOpen ? "var(--primary)" : "var(--border)"}`,
                    }}
                  >
                    <button
                      onClick={() => {
                        const newState = isOpen ? null : scene.id;
                        setExpandedId(newState);
                        if (newState) {
                          posthog.capture("jc_scene_expanded", {
                            scene_id: scene.id,
                            act: scene.act,
                            scene_number: scene.scene,
                            title: scene.title,
                          });
                        }
                      }}
                      className="w-full flex items-center justify-between px-4 py-3 cursor-pointer"
                    >
                      <div className="text-left">
                        <span
                          className="text-xs font-medium mr-2"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Scene {scene.scene}
                        </span>
                        <span
                          className="text-sm font-semibold"
                          style={{ color: "var(--text)" }}
                        >
                          {scene.title}
                        </span>
                      </div>
                      <motion.svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--text-secondary)"
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
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div
                            className="px-4 pb-4 space-y-3"
                            style={{
                              borderTop: "1px solid var(--border)",
                              paddingTop: 12,
                            }}
                          >
                            <p
                              className="text-sm leading-relaxed"
                              style={{ color: "var(--text)" }}
                            >
                              {scene.summary}
                            </p>
                            <div>
                              <p
                                className="text-xs font-semibold uppercase mb-2"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                Key Events
                              </p>
                              <ul className="space-y-1.5">
                                {scene.keyEvents.map((event, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2 text-sm"
                                    style={{ color: "var(--text)" }}
                                  >
                                    <span
                                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                                      style={{ background: "var(--primary)" }}
                                    />
                                    {event}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {scene.videoUrl && (
                              <div>
                                <p
                                  className="text-xs font-semibold uppercase mb-2"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  Video
                                </p>
                                <video
                                  controls
                                  className="w-full rounded-lg"
                                  style={{ maxHeight: "400px" }}
                                  onPlay={() => {
                                    posthog.capture("jc_scene_video_played", {
                                      scene_id: scene.id,
                                      act: scene.act,
                                      scene_number: scene.scene,
                                      title: scene.title,
                                    });
                                  }}
                                >
                                  <source src={scene.videoUrl} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
