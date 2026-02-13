"use client";

import { useState, useRef, useMemo } from "react";
import { useStore } from "@/store/use-store";
import { useAuth } from "@/providers/auth-provider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSubjectLabels, getSubjectColors, SECOND_LANGUAGES, ELECTIVES } from "@/lib/constants";
import { today } from "@/lib/utils";
import { deleteCloudData } from "@/store/firebase-sync";

export default function SettingsPage() {
  const data = useStore();
  const { user } = useAuth();
  const setField = useStore((s) => s.setField);
  const update = useStore((s) => s.update);
  const setAll = useStore((s) => s.setAll);
  const resetStore = useStore((s) => s.resetStore);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lang = data.selectedLanguage || "kannada";
  const elective = data.selectedElective || "computer";
  const SUBJECT_LABELS = useMemo(() => getSubjectLabels(lang, elective), [lang, elective]);
  const SUBJECT_COLORS = useMemo(() => getSubjectColors(lang, elective), [lang, elective]);

  const [name, setName] = useState(data.name || "");
  const [studyHours, setStudyHours] = useState(data.studyHours || 8);
  const [targetPercent, setTargetPercent] = useState(data.targetPercent || 90);
  const [grokApiKey, setGrokApiKey] = useState(data.grokApiKey || "");
  const [routine, setRoutine] = useState(data.routine);
  const [toast, setToast] = useState("");
  const [importStatus, setImportStatus] = useState<"idle" | "confirm" | "error">("idle");
  const [importData, setImportData] = useState<Record<string, unknown> | null>(null);
  const [importError, setImportError] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const saveSettings = () => {
    update((s) => ({
      ...s,
      name,
      studyHours,
      targetPercent,
      grokApiKey,
      routine,
    }));
    showToast("Settings saved!");
  };

  const exportData = () => {
    const state = useStore.getState();
    const { setField: _a, update: _b, setAll: _c, resetStore: _d, markHydrated: _e, _hydrated, ...exportable } = state;
    const blob = new Blob([JSON.stringify(exportable, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `icse-grind-backup-${today()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Data exported!");
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (!parsed || typeof parsed !== "object") throw new Error("Invalid format");
        if (!parsed.subjects && !parsed.studyLog && !parsed.name) {
          throw new Error("Missing required fields (subjects, studyLog, name)");
        }
        setImportData(parsed);
        setImportStatus("confirm");
        setImportError("");
      } catch (err) {
        setImportError((err as Error).message);
        setImportStatus("error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const doImport = (mode: "replace" | "merge") => {
    if (!importData) return;
    if (mode === "replace") {
      setAll(importData);
    } else {
      // Merge: keep newer timestamps, deep merge chapters
      const current = useStore.getState();
      const merged: Record<string, unknown> = { ...importData };
      // Merge studyLog
      if (importData.studyLog && current.studyLog) {
        merged.studyLog = { ...current.studyLog, ...(importData.studyLog as Record<string, unknown>) };
      }
      // Merge subjects (keep existing statuses if newer)
      if (importData.subjects && current.subjects) {
        const mergedSubjects: Record<string, unknown> = {};
        Object.keys(current.subjects).forEach((key) => {
          const imported = (importData.subjects as Record<string, unknown[]>)?.[key];
          if (imported) {
            mergedSubjects[key] = imported;
          } else {
            mergedSubjects[key] = current.subjects[key];
          }
        });
        merged.subjects = mergedSubjects;
      }
      setAll(merged);
    }
    setImportStatus("idle");
    setImportData(null);
    showToast("Data imported successfully!");
  };

  const handleReset = async () => {
    if (!confirm("This will delete ALL your data including progress, settings, and study logs. Are you sure?")) return;
    if (!confirm("This cannot be undone. Really reset everything?")) return;
    if (user) await deleteCloudData(user.uid);
    resetStore();
    window.location.reload();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-sm text-white" style={{ background: "var(--success)" }}>
          {toast}
        </div>
      )}

      {/* Profile */}
      <Card>
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>Profile</h3>
        <div className="space-y-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>
              Study Hours Target: {studyHours}h
            </label>
            <input
              type="range" min="2" max="14" value={studyHours}
              onChange={(e) => setStudyHours(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>
              Target Percentage: {targetPercent}%
            </label>
            <input
              type="range" min="50" max="100" value={targetPercent}
              onChange={(e) => setTargetPercent(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* Subject Selection */}
      <Card>
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>Subjects</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>Second Language</label>
            <select
              value={lang}
              onChange={(e) => setField("selectedLanguage", e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
            >
              {SECOND_LANGUAGES.map((l) => (
                <option key={l.key} value={l.key}>{l.name} ({l.date})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>Elective</label>
            <select
              value={elective}
              onChange={(e) => setField("selectedElective", e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
            >
              {ELECTIVES.map((el) => (
                <option key={el.key} value={el.key}>{el.name} — Group {el.group} ({el.date})</option>
              ))}
            </select>
          </div>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Changing subjects will update your exam dates and study plans.
          </p>
        </div>
      </Card>

      {/* Daily Routine */}
      <Card>
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>Daily Routine</h3>
        <div className="grid grid-cols-2 gap-4">
          {(["wake", "breakfast", "lunch", "snack", "dinner", "sleep"] as const).map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1 capitalize" style={{ color: "var(--text)" }}>{key}</label>
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
      </Card>

      {/* Subject Confidence */}
      <Card>
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>Subject Confidence</h3>
        <div className="space-y-2">
          {Object.keys(SUBJECT_LABELS).map((key) => {
            const current = (data.subjectRatings || {})[key] || "medium";
            return (
              <div key={key} className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: SUBJECT_COLORS[key] }} />
                <span className="text-sm flex-1 min-w-0 truncate" style={{ color: "var(--text)" }}>{SUBJECT_LABELS[key]}</span>
                <div className="flex gap-1">
                  {(["weak", "medium", "strong"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => update((s) => ({
                        subjectRatings: { ...s.subjectRatings, [key]: r },
                      }))}
                      className="px-2.5 py-1 rounded-md text-xs font-medium transition-all"
                      style={{
                        background: current === r ? "var(--primary)" : "var(--bg)",
                        color: current === r ? "#fff" : "var(--text-secondary)",
                        border: `1px solid ${current === r ? "var(--primary)" : "var(--border)"}`,
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* AI Chat */}
      <Card>
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>AI Chat Settings</h3>
        <Input
          label="Grok / Groq API Key"
          value={grokApiKey}
          onChange={(e) => setGrokApiKey(e.target.value)}
          placeholder="Enter your xAI or Groq API key"
          type="password"
        />
        <p className="text-xs mt-2" style={{ color: "var(--text-secondary)" }}>
          Supports xAI Grok (grok-3-mini) and Groq (llama-3.3-70b). Keys starting with &quot;gsk_&quot; use Groq.
        </p>
      </Card>

      {/* Save */}
      <Button onClick={saveSettings} className="w-full" size="lg">Save Settings</Button>

      {/* Data Management */}
      <Card>
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>Data Management</h3>
        <div className="space-y-3">
          <Button onClick={exportData} variant="secondary" className="w-full">
            Export Data as JSON
          </Button>

          <div>
            <Button onClick={() => fileInputRef.current?.click()} variant="secondary" className="w-full">
              Import Data from JSON
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportFile}
            />
          </div>

          {importStatus === "confirm" && (
            <div className="p-4 rounded-lg" style={{ background: "var(--primary-light)", border: "1px solid var(--primary)" }}>
              <p className="text-sm font-medium mb-3" style={{ color: "var(--text)" }}>Import data?</p>
              <div className="flex gap-2">
                <Button onClick={() => doImport("replace")} size="sm">Replace All</Button>
                <Button onClick={() => doImport("merge")} variant="secondary" size="sm">Merge</Button>
                <Button onClick={() => setImportStatus("idle")} variant="ghost" size="sm">Cancel</Button>
              </div>
            </div>
          )}

          {importStatus === "error" && (
            <div className="p-3 rounded-lg text-sm" style={{ background: "#fef2f2", color: "var(--danger)" }}>
              Invalid file: {importError}
            </div>
          )}

          <div className="pt-3 border-t" style={{ borderColor: "var(--border)" }}>
            <Button onClick={handleReset} variant="danger" className="w-full">
              Reset All Data
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
