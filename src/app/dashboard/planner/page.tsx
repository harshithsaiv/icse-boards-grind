"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store/use-store";
import { getSubjectLabels, getSubjectColors, type Block } from "@/lib/constants";
import { today, dateStr, formatDate, formatTime24, timeToMin, minToTime } from "@/lib/utils";
import { getDayPlan, analyzeStudyBalance } from "@/lib/algorithms";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DayPlan } from "@/components/planner/day-plan";

export default function PlannerPage() {
  const data = useStore();
  const td = today();
  const SUBJECT_LABELS = useMemo(() => getSubjectLabels(data.selectedLanguage || "kannada", data.selectedElective || "computer"), [data.selectedLanguage, data.selectedElective]);
  const SUBJECT_COLORS = useMemo(() => getSubjectColors(data.selectedLanguage || "kannada", data.selectedElective || "computer"), [data.selectedLanguage, data.selectedElective]);

  const [planDateObj, setPlanDateObj] = useState(new Date());
  const planDate = dateStr(planDateObj);
  const isPlanToday = planDate === td;

  const [now, setNow] = useState(new Date());
  const nowMin = now.getHours() * 60 + now.getMinutes();

  // Auto-refresh every minute
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Get plan blocks
  const blocks = useMemo(() => getDayPlan(planDate, data), [planDate, data]);
  const hasCustomPlan = !!(data.customPlans || {})[planDate];

  // Balance warnings
  const warnings = useMemo(() => analyzeStudyBalance(blocks, data), [blocks, data]);

  // Study time total
  const totalStudyMin = useMemo(() => {
    return blocks.reduce((sum, b) => {
      if (b.type === "study") {
        return sum + (timeToMin(b.end) - timeToMin(b.start));
      }
      return sum;
    }, 0);
  }, [blocks]);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editType, setEditType] = useState<Block["type"]>("study");
  const [editSubject, setEditSubject] = useState("");
  const [editLabel, setEditLabel] = useState("");
  const [editStart, setEditStart] = useState("08:00");
  const [editEnd, setEditEnd] = useState("09:00");

  // Navigation
  const goToPrev = () => {
    const d = new Date(planDateObj);
    d.setDate(d.getDate() - 1);
    setPlanDateObj(d);
  };

  const goToNext = () => {
    const d = new Date(planDateObj);
    d.setDate(d.getDate() + 1);
    setPlanDateObj(d);
  };

  const goToToday = () => {
    setPlanDateObj(new Date());
  };

  // Open edit modal
  const handleBlockClick = useCallback((block: Block, index: number) => {
    setEditIndex(index);
    setEditType(block.type);
    setEditSubject(block.subjectKey || "");
    setEditLabel(block.label);
    setEditStart(block.start);
    setEditEnd(block.end);
    setEditModalOpen(true);
  }, []);

  // Add new block
  const handleAddBlock = () => {
    setEditIndex(null);
    setEditType("study");
    setEditSubject(Object.keys(SUBJECT_LABELS)[0]);
    setEditLabel("");
    setEditStart("08:00");
    setEditEnd("09:00");
    setEditModalOpen(true);
  };

  // Save block
  const handleSave = () => {
    const newBlock: Block = {
      start: editStart,
      end: editEnd,
      label: editLabel || (editType === "study" && editSubject ? SUBJECT_LABELS[editSubject] : editType.charAt(0).toUpperCase() + editType.slice(1)),
      type: editType,
      ...(editType === "study" && editSubject ? { subjectKey: editSubject } : {}),
    };

    const newBlocks = [...blocks];
    if (editIndex !== null) {
      newBlocks[editIndex] = newBlock;
    } else {
      newBlocks.push(newBlock);
    }

    // Sort by start time
    newBlocks.sort((a, b) => timeToMin(a.start) - timeToMin(b.start));

    // Save custom plan
    useStore.getState().update((s) => {
      if (!s.customPlans) s.customPlans = {};
      s.customPlans[planDate] = newBlocks;
      return { customPlans: s.customPlans };
    });

    setEditModalOpen(false);
  };

  // Delete block
  const handleDelete = () => {
    if (editIndex === null) return;

    const newBlocks = blocks.filter((_, i) => i !== editIndex);

    useStore.getState().update((s) => {
      if (!s.customPlans) s.customPlans = {};
      s.customPlans[planDate] = newBlocks;
      return { customPlans: s.customPlans };
    });

    setEditModalOpen(false);
  };

  // Reset plan
  const handleResetPlan = () => {
    useStore.getState().update((s) => {
      if (s.customPlans) {
        delete s.customPlans[planDate];
      }
      return { customPlans: s.customPlans || {} };
    });
  };

  const subjectOptions = [
    { value: "", label: "-- Select Subject --" },
    ...Object.entries(SUBJECT_LABELS).map(([key, label]) => ({ value: key, label })),
  ];

  const typeOptions = [
    { value: "study", label: "Study" },
    { value: "meal", label: "Meal" },
    { value: "break", label: "Break" },
    { value: "sleep", label: "Sleep" },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Date Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-3"
      >
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={goToPrev}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Button>
          <div className="text-center">
            <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>
              {formatDate(planDate)}
            </h2>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {isPlanToday ? "Today" : planDate}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={goToNext}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {!isPlanToday && (
            <Button variant="secondary" size="sm" onClick={goToToday}>
              Today
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={handleAddBlock}>
            + Add Block
          </Button>
          {hasCustomPlan && (
            <Button variant="ghost" size="sm" onClick={handleResetPlan}>
              Reset Plan
            </Button>
          )}
        </div>
      </motion.div>

      {/* Study Summary */}
      <Card className="!py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--primary)" }}>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
              Total Study Time
            </span>
          </div>
          <span className="text-sm font-bold" style={{ color: "var(--primary)" }}>
            {Math.floor(totalStudyMin / 60)}h {totalStudyMin % 60}m
          </span>
        </div>
        {hasCustomPlan && (
          <div className="mt-2 flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "var(--warning)" }}
            />
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Custom plan active
            </span>
          </div>
        )}
      </Card>

      {/* Balance Warnings */}
      {warnings && warnings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-4"
          style={{
            background: "#fef3c7",
            border: "1px solid #f59e0b",
          }}
        >
          <div className="flex items-start gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" className="shrink-0 mt-0.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div className="space-y-1">
              {warnings.map((w, i) => (
                <p key={i} className="text-sm" style={{ color: "#92400e" }}>
                  {w}
                </p>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Timeline */}
      <DayPlan
        blocks={blocks}
        nowMin={nowMin}
        isPlanToday={isPlanToday}
        onBlockClick={handleBlockClick}
      />

      {/* Edit Block Modal */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)} title={editIndex !== null ? "Edit Block" : "Add Block"}>
        <div className="space-y-4">
          <Select
            label="Block Type"
            options={typeOptions}
            value={editType}
            onChange={(e) => setEditType(e.target.value as Block["type"])}
          />

          {editType === "study" && (
            <Select
              label="Subject"
              options={subjectOptions}
              value={editSubject}
              onChange={(e) => {
                setEditSubject(e.target.value);
                if (e.target.value && !editLabel) {
                  setEditLabel(SUBJECT_LABELS[e.target.value] || "");
                }
              }}
            />
          )}

          <Input
            label="Label"
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            placeholder="Block label"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Time"
              type="time"
              value={editStart}
              onChange={(e) => setEditStart(e.target.value)}
            />
            <Input
              label="End Time"
              type="time"
              value={editEnd}
              onChange={(e) => setEditEnd(e.target.value)}
            />
          </div>

          {editStart && editEnd && timeToMin(editEnd) > timeToMin(editStart) && (
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Duration: {timeToMin(editEnd) - timeToMin(editStart)} minutes
            </p>
          )}

          <div className="flex items-center justify-between pt-2">
            <div>
              {editIndex !== null && (
                <Button variant="danger" size="sm" onClick={handleDelete}>
                  Delete
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!editStart || !editEnd || timeToMin(editEnd) <= timeToMin(editStart)}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
