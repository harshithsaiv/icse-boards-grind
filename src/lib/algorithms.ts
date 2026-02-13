import { getExams, getSubjectLabels, type Block, type Chapter } from "./constants";
import { dateStr, daysBetween, timeToMin, minToTime, today } from "./utils";
import type { StoreState } from "@/store/use-store";

/* ── helpers ── */

function storeExams(data: Pick<StoreState, "selectedLanguage" | "selectedElective">) {
  return getExams(data.selectedLanguage || "kannada", data.selectedElective || "computer");
}

function storeLabels(data: Pick<StoreState, "selectedLanguage" | "selectedElective">) {
  return getSubjectLabels(data.selectedLanguage || "kannada", data.selectedElective || "computer");
}

/* ── Study session constants ── */
const SESSION_MIN = 25; // minimum useful study session (minutes)
const SESSION_IDEAL = 50; // ideal study session length
const SESSION_MAX = 60; // never schedule longer than this continuously
const SESSION_LIGHT = 40; // lighter sessions after dinner
const BREAK_SHORT = 10;
const BREAK_LONG = 15;

/* ── Revision due chapters ── */

export function getRevisionDueChapters(
  dateString: string,
  subjects: Record<string, Chapter[]>
): {
  subjectKey: string;
  chapterIndex: number;
  chapterName: string;
  interval: number;
}[] {
  const results: {
    subjectKey: string;
    chapterIndex: number;
    chapterName: string;
    interval: number;
  }[] = [];
  Object.keys(subjects).forEach((subjectKey) => {
    (subjects[subjectKey] || []).forEach((ch, idx) => {
      if (
        ch.status === "needs_revision" &&
        ch.revisionDate &&
        ch.revisionIntervals
      ) {
        const completed = ch.revisionsCompleted || 0;
        if (completed < ch.revisionIntervals.length) {
          const interval = ch.revisionIntervals[completed];
          const dueDate = dateStr(
            new Date(
              new Date(ch.revisionDate + "T00:00:00").getTime() +
                interval * 86400000
            )
          );
          if (dueDate === dateString) {
            results.push({
              subjectKey,
              chapterIndex: idx,
              chapterName: ch.name,
              interval,
            });
          }
        }
      }
    });
  });
  return results;
}

/* ── Subject priority ── */

export function getSubjectPriority(
  subjectKey: string,
  targetDate: string,
  data: Pick<
    StoreState,
    "subjects" | "subjectRatings" | "selectedLanguage" | "selectedElective"
  >
): number {
  const exams = storeExams(data);
  const exam = exams.find((e) => e.key === subjectKey);
  if (!exam) return 0;

  const daysUntil = daysBetween(targetDate, exam.date);
  if (daysUntil < 0) return 0;

  const chapters = data.subjects[subjectKey] || [];
  if (chapters.length === 0) return 0.1;

  const incomplete = chapters.filter((c) => c.status !== "completed").length;

  // All chapters completed — no need to study this subject
  if (incomplete === 0) return 0;

  const rating = (data.subjectRatings || {})[subjectKey] || "medium";
  const weakness = rating === "weak" ? 1.0 : rating === "medium" ? 0.5 : 0.2;
  const urgency = Math.min(1.0, 10 / Math.max(daysUntil, 1));
  const chapterLoad =
    chapters.length > 0 ? incomplete / chapters.length : 0;
  const avgDiff =
    chapters
      .filter((c) => c.status !== "completed")
      .reduce((s, c) => s + (c.difficulty || 3), 0) /
    Math.max(incomplete, 1);
  const difficulty = avgDiff / 5;

  return (
    weakness * 0.3 + urgency * 0.35 + chapterLoad * 0.2 + difficulty * 0.15
  );
}

/* ── Build a priority-weighted subject queue ──
 *  Higher priority subjects appear more often in the repeating queue.
 *  Subjects are interleaved so the same subject rarely appears back-to-back. */

function buildSubjectQueue(
  priorities: { key: string; priority: number }[],
  revisionExamKey?: string
): string[] {
  if (priorities.length === 0) return [];
  if (priorities.length === 1) return [priorities[0].key];

  const totalP = priorities.reduce((s, p) => s + p.priority, 0);
  if (totalP === 0) return priorities.map((p) => p.key);

  // Scale to a cycle length proportional to subject count (min 10 slots)
  const CYCLE = Math.max(10, priorities.length * 3);

  // Assign slot counts proportional to priority, minimum 1 each
  const slotCounts = priorities.map((p) => ({
    key: p.key,
    count: Math.max(1, Math.round((p.priority / totalP) * CYCLE)),
  }));

  // If revision exam, give it extra weight (40% boost)
  if (revisionExamKey) {
    const rev = slotCounts.find((s) => s.key === revisionExamKey);
    if (rev) rev.count = Math.ceil(rev.count * 1.4);
  }

  // Interleave: round-robin through subjects by descending count
  // This ensures no consecutive same-subject blocks
  const result: string[] = [];
  const remaining = slotCounts.map((s) => ({ ...s }));

  while (remaining.some((s) => s.count > 0)) {
    remaining.sort((a, b) => b.count - a.count);
    for (const s of remaining) {
      if (s.count > 0) {
        result.push(s.key);
        s.count--;
      }
    }
  }

  return result;
}

/* ── Pick a chapter name for a subject session ──
 *  Cycles through incomplete chapters instead of always showing the first one. */

function pickChapterName(
  subj: string,
  sessionIndex: number,
  revDueChapters: { subjectKey: string; chapterName: string }[],
  subjects: Record<string, Chapter[]>
): string {
  // First, check if there's a revision-due chapter
  const revIdx = revDueChapters.findIndex((r) => r.subjectKey === subj);
  if (revIdx >= 0) {
    const name = revDueChapters[revIdx].chapterName + " (Revision)";
    revDueChapters.splice(revIdx, 1);
    return name;
  }

  // Otherwise, cycle through incomplete chapters
  const chapters = (subjects[subj] || []).filter(
    (c) => c.status !== "completed"
  );
  if (chapters.length === 0) return "Revision";
  return chapters[sessionIndex % chapters.length].name;
}

/* ── Fill a time gap with study sessions + breaks ── */

function fillGapWithStudy(
  blocks: Block[],
  gapStart: number,
  gapEnd: number,
  subjectQueue: string[],
  queueOffset: number,
  revDueChapters: { subjectKey: string; chapterName: string }[],
  subjects: Record<string, Chapter[]>,
  labels: Record<string, string>,
  isLight: boolean
): number {
  let cursor = gapStart;
  let sessionCount = 0;
  const subjectSessionIndex: Record<string, number> = {};

  while (cursor < gapEnd) {
    const remaining = gapEnd - cursor;
    if (remaining < SESSION_MIN) break;

    // Determine session duration
    const maxLen = isLight ? SESSION_LIGHT : SESSION_MAX;
    const idealLen = isLight ? SESSION_LIGHT : SESSION_IDEAL;
    let studyLen: number;

    if (remaining <= maxLen + BREAK_SHORT) {
      // Not enough for a full session + break + another session, use remaining
      studyLen = Math.min(remaining, maxLen);
    } else {
      studyLen = idealLen;
    }

    // Pick subject from weighted queue
    if (subjectQueue.length === 0) break;
    const subj =
      subjectQueue[(queueOffset + sessionCount) % subjectQueue.length];

    // Track per-subject session index for chapter cycling
    subjectSessionIndex[subj] = subjectSessionIndex[subj] || 0;
    const chapterName = pickChapterName(
      subj,
      subjectSessionIndex[subj],
      revDueChapters,
      subjects
    );
    subjectSessionIndex[subj]++;

    const studyLabel = isLight
      ? `Light Revision \u2014 ${labels[subj] || subj} \u2014 ${chapterName}`
      : `${labels[subj] || subj} \u2014 ${chapterName}`;

    blocks.push({
      start: minToTime(cursor),
      end: minToTime(cursor + studyLen),
      label: studyLabel,
      type: "study",
      subjectKey: subj,
    });

    cursor += studyLen;
    sessionCount++;

    // Add break if there's room for another session after the break
    const stillRemaining = gapEnd - cursor;
    if (stillRemaining >= BREAK_SHORT + SESSION_MIN) {
      const breakLen = sessionCount % 3 === 0 ? BREAK_LONG : BREAK_SHORT;
      const actualBreak = Math.min(breakLen, stillRemaining - SESSION_MIN);
      blocks.push({
        start: minToTime(cursor),
        end: minToTime(cursor + actualBreak),
        label: sessionCount % 3 === 0 ? "Break + Stretch" : "Short Break",
        type: "break",
      });
      cursor += actualBreak;
    }
  }

  return sessionCount;
}

/* ══════════════════════════════════════════
 *  EXAM DAY PLAN
 * ══════════════════════════════════════════ */

function buildExamDayPlan(
  examToday: { key: string; subject: string },
  exams: { date: string; key: string; subject: string }[],
  dateString: string,
  labels: Record<string, string>,
  _data: StoreState,
  t: {
    wakeMin: number;
    breakfastMin: number;
    lunchMin: number;
    snackMin: number;
    dinnerMin: number;
    sleepMin: number;
  }
): Block[] {
  const blocks: Block[] = [];

  // Wake up
  blocks.push({
    start: minToTime(t.wakeMin),
    end: minToTime(t.wakeMin + 30),
    label: "Wake Up + Fresh Up",
    type: "break",
  });

  // Quick review (30-60 min, capped before breakfast)
  const reviewEnd = Math.min(t.wakeMin + 90, t.breakfastMin);
  if (t.wakeMin + 30 < reviewEnd) {
    blocks.push({
      start: minToTime(t.wakeMin + 30),
      end: minToTime(reviewEnd),
      label: `Quick Review \u2014 ${labels[examToday.key] || examToday.subject}`,
      type: "study",
      subjectKey: examToday.key,
    });
  }

  // Breakfast
  blocks.push({
    start: minToTime(t.breakfastMin),
    end: minToTime(t.breakfastMin + 30),
    label: "BREAKFAST",
    type: "meal",
  });

  // Relax + prepare for exam
  blocks.push({
    start: minToTime(t.breakfastMin + 30),
    end: minToTime(t.breakfastMin + 60),
    label: "Relax + Prepare for Exam",
    type: "break",
  });

  // Exam block (3 hours)
  const examStart = t.breakfastMin + 60;
  const examEnd = examStart + 180;
  blocks.push({
    start: minToTime(examStart),
    end: minToTime(examEnd),
    label: `EXAM \u2014 ${examToday.subject}`,
    type: "study",
    subjectKey: examToday.key,
  });

  // Lunch + rest (start at lunch time or after exam, whichever is later)
  const lunchStart = Math.max(t.lunchMin, examEnd);
  blocks.push({
    start: minToTime(lunchStart),
    end: minToTime(lunchStart + 45),
    label: "LUNCH + Rest",
    type: "meal",
  });

  // Rest / Light activity until snack
  const restStart = lunchStart + 45;
  if (restStart < t.snackMin) {
    blocks.push({
      start: minToTime(restStart),
      end: minToTime(t.snackMin),
      label: "Rest / Light Activity",
      type: "break",
    });
  }

  // Evening: prep for next exam if available
  const nextExam = exams.find((e) => e.date > dateString);
  if (nextExam) {
    blocks.push({
      start: minToTime(t.snackMin),
      end: minToTime(t.snackMin + 30),
      label: "Snack Break",
      type: "meal",
    });
    if (t.snackMin + 30 < t.dinnerMin) {
      blocks.push({
        start: minToTime(t.snackMin + 30),
        end: minToTime(t.dinnerMin),
        label: `Light Study \u2014 ${labels[nextExam.key] || nextExam.subject}`,
        type: "study",
        subjectKey: nextExam.key,
      });
    }
  } else if (t.snackMin < t.dinnerMin) {
    // No next exam — just relax
    blocks.push({
      start: minToTime(t.snackMin),
      end: minToTime(t.snackMin + 30),
      label: "Snack Break",
      type: "meal",
    });
    if (t.snackMin + 30 < t.dinnerMin) {
      blocks.push({
        start: minToTime(t.snackMin + 30),
        end: minToTime(t.dinnerMin),
        label: "Free Time / Relax",
        type: "break",
      });
    }
  }

  // Dinner
  blocks.push({
    start: minToTime(t.dinnerMin),
    end: minToTime(t.dinnerMin + 45),
    label: "DINNER",
    type: "meal",
  });

  // Relax before sleep
  if (t.dinnerMin + 45 < t.sleepMin) {
    blocks.push({
      start: minToTime(t.dinnerMin + 45),
      end: minToTime(t.sleepMin),
      label: "Relax + Early Sleep",
      type: "break",
    });
  }

  // Sleep (proper 8-hour block, capped at midnight)
  blocks.push({
    start: minToTime(t.sleepMin),
    end: minToTime(Math.min(t.sleepMin + 480, 1440)),
    label: "SLEEP",
    type: "sleep",
  });

  return blocks;
}

/* ══════════════════════════════════════════
 *  GENERATE DAY PLAN (main entry)
 * ══════════════════════════════════════════ */

export function generateDayPlan(
  dateString: string,
  data: StoreState
): Block[] {
  const exams = storeExams(data);
  const labels = storeLabels(data);
  const routine = data.routine || {
    wake: "06:00",
    breakfast: "08:00",
    lunch: "13:00",
    snack: "17:00",
    dinner: "20:30",
    sleep: "22:30",
  };

  // Parse routine times
  const wakeMin = timeToMin(routine.wake || "06:00");
  const breakfastMin = timeToMin(routine.breakfast || "08:00");
  const lunchMin = timeToMin(routine.lunch || "13:00");
  const snackMin = timeToMin(routine.snack || "17:00");
  const dinnerMin = timeToMin(routine.dinner || "20:30");
  const sleepMin = timeToMin(routine.sleep || "22:30");

  // ── EXAM DAY ──
  const examToday = exams.find((e) => e.date === dateString);
  if (examToday) {
    return buildExamDayPlan(examToday, exams, dateString, labels, data, {
      wakeMin,
      breakfastMin,
      lunchMin,
      snackMin,
      dinnerMin,
      sleepMin,
    });
  }

  // ── REGULAR / REVISION DAY ──
  const blocks: Block[] = [];

  // Check if revision day (1-2 days before an exam)
  const revisionExam = exams.find((e) => {
    const d = daysBetween(dateString, e.date);
    return d >= 1 && d <= 2;
  });

  // Compute subject priorities
  const priorities: { key: string; priority: number }[] = [];
  const revisionDueChapters = getRevisionDueChapters(
    dateString,
    data.subjects
  );
  const revisionSubjects = new Set(
    revisionDueChapters.map((r) => r.subjectKey)
  );

  Object.keys(labels).forEach((key) => {
    let p = getSubjectPriority(key, dateString, data);
    if (revisionSubjects.has(key)) p += 0.3;
    if (revisionExam && key === revisionExam.key) p += 0.4;
    if (p > 0) priorities.push({ key, priority: p });
  });
  priorities.sort((a, b) => b.priority - a.priority);

  // Build weighted subject queue
  const subjectQueue = buildSubjectQueue(priorities, revisionExam?.key);

  // Define fixed daily blocks (sorted by time)
  const fixedBlocks = [
    {
      time: wakeMin,
      duration: 30,
      label: "Wake Up + Fresh Up + Light Exercise",
      type: "break" as const,
    },
    {
      time: breakfastMin,
      duration: 30,
      label: "BREAKFAST",
      type: "meal" as const,
    },
    {
      time: lunchMin,
      duration: 45,
      label: "LUNCH + Rest",
      type: "meal" as const,
    },
    {
      time: snackMin,
      duration: 30,
      label: "Evening Break / Snack",
      type: "meal" as const,
    },
    {
      time: dinnerMin,
      duration: 45,
      label: "DINNER",
      type: "meal" as const,
    },
  ].sort((a, b) => a.time - b.time);

  // Collect study gaps and place fixed blocks
  const gaps: { start: number; end: number; isLight: boolean }[] = [];
  let cursor = wakeMin;

  for (const fb of fixedBlocks) {
    // If fixed block overlaps with cursor due to routine ordering, push forward
    const fbStart = Math.max(fb.time, cursor);
    const fbEnd = fbStart + fb.duration;

    // Collect the gap before this fixed block (if any)
    if (fbStart > cursor) {
      const isAfterDinner = cursor >= dinnerMin + 45;
      gaps.push({ start: cursor, end: fbStart, isLight: isAfterDinner });
    }

    // Place the fixed block
    blocks.push({
      start: minToTime(fbStart),
      end: minToTime(fbEnd),
      label: fb.label,
      type: fb.type,
    });
    cursor = fbEnd;
  }

  // Gap between last fixed block and sleep
  if (cursor < sleepMin) {
    const isAfterDinner = cursor >= dinnerMin + 45;
    gaps.push({ start: cursor, end: sleepMin, isLight: isAfterDinner });
  }

  // Sleep block (proper 8-hour block, capped at midnight)
  blocks.push({
    start: minToTime(sleepMin),
    end: minToTime(Math.min(sleepMin + 480, 1440)),
    label: "SLEEP",
    type: "sleep",
  });

  // Fill all gaps with study sessions + breaks
  const revDueChapters = [...revisionDueChapters];
  let totalSessionsSoFar = 0;

  for (const gap of gaps) {
    if (subjectQueue.length === 0) break;
    const sessionsAdded = fillGapWithStudy(
      blocks,
      gap.start,
      gap.end,
      subjectQueue,
      totalSessionsSoFar,
      revDueChapters,
      data.subjects,
      labels,
      gap.isLight
    );
    totalSessionsSoFar += sessionsAdded;
  }

  // Sort all blocks by start time
  blocks.sort((a, b) => timeToMin(a.start) - timeToMin(b.start));

  return blocks;
}

/* ── Public API ── */

export function getDayPlan(dateString: string, data: StoreState): Block[] {
  const custom = (data.customPlans || {})[dateString];
  if (custom && custom.length > 0) return custom;
  return generateDayPlan(dateString, data);
}

export function analyzeStudyBalance(
  blocks: Block[],
  data: StoreState
): string[] | null {
  const exams = storeExams(data);
  const labels = storeLabels(data);
  const subjectMinutes: Record<string, number> = {};
  let totalStudyMin = 0;
  blocks.forEach((b) => {
    if (b.type === "study" && b.subjectKey) {
      const mins = timeToMin(b.end) - timeToMin(b.start);
      subjectMinutes[b.subjectKey] =
        (subjectMinutes[b.subjectKey] || 0) + mins;
      totalStudyMin += mins;
    }
  });
  if (totalStudyMin === 0) return null;

  const warnings: string[] = [];
  const td = today();

  Object.keys(subjectMinutes).forEach((key) => {
    const pct = subjectMinutes[key] / totalStudyMin;
    if (pct > 0.5 && Object.keys(subjectMinutes).length < 3) {
      warnings.push(
        `You're spending ${Math.round(pct * 100)}% of study time on ${labels[key] || key}. Consider diversifying.`
      );
    }
  });

  const upcoming = exams.filter((e) => {
    const d = daysBetween(td, e.date);
    return d > 0 && d <= 10;
  });
  upcoming.forEach((exam) => {
    const days = daysBetween(td, exam.date);
    const chapters = data.subjects[exam.key] || [];
    const incomplete = chapters.filter(
      (c) => c.status !== "completed"
    ).length;
    if (incomplete > 0 && !subjectMinutes[exam.key] && days <= 7) {
      warnings.push(
        `${labels[exam.key] || exam.subject} exam in ${days} days with ${incomplete} chapter${incomplete > 1 ? "s" : ""} left, but it's not in today's plan!`
      );
    }
  });

  return warnings.length > 0 ? warnings : null;
}
