import { EXAMS, SUBJECT_LABELS, type Block, type Chapter } from "./constants";
import { dateStr, daysBetween, timeToMin, minToTime, today } from "./utils";
import type { StoreState } from "@/store/use-store";

export function getRevisionDueChapters(
  dateString: string,
  subjects: Record<string, Chapter[]>
): { subjectKey: string; chapterIndex: number; chapterName: string; interval: number }[] {
  const results: { subjectKey: string; chapterIndex: number; chapterName: string; interval: number }[] = [];
  Object.keys(subjects).forEach((subjectKey) => {
    (subjects[subjectKey] || []).forEach((ch, idx) => {
      if (ch.status === "needs_revision" && ch.revisionDate && ch.revisionIntervals) {
        const completed = ch.revisionsCompleted || 0;
        if (completed < ch.revisionIntervals.length) {
          const interval = ch.revisionIntervals[completed];
          const dueDate = dateStr(new Date(new Date(ch.revisionDate + "T00:00:00").getTime() + interval * 86400000));
          if (dueDate === dateString) {
            results.push({ subjectKey, chapterIndex: idx, chapterName: ch.name, interval });
          }
        }
      }
    });
  });
  return results;
}

export function getSubjectPriority(
  subjectKey: string,
  targetDate: string,
  data: Pick<StoreState, "subjects" | "subjectRatings">
): number {
  const exam = EXAMS.find((e) => e.key === subjectKey);
  if (!exam) return 0;

  const daysUntil = daysBetween(targetDate, exam.date);
  if (daysUntil < 0) return 0;

  const chapters = data.subjects[subjectKey] || [];
  if (chapters.length === 0) return 0.1;

  const rating = (data.subjectRatings || {})[subjectKey] || "medium";
  const weakness = rating === "weak" ? 1.0 : rating === "medium" ? 0.5 : 0.2;
  const urgency = Math.min(1.0, 10 / Math.max(daysUntil, 1));
  const incomplete = chapters.filter((c) => c.status !== "completed").length;
  const chapterLoad = chapters.length > 0 ? incomplete / chapters.length : 0;
  const avgDiff =
    chapters.filter((c) => c.status !== "completed").reduce((s, c) => s + (c.difficulty || 3), 0) /
    Math.max(incomplete, 1);
  const difficulty = avgDiff / 5;

  return weakness * 0.3 + urgency * 0.35 + chapterLoad * 0.2 + difficulty * 0.15;
}

export function generateDayPlan(dateString: string, data: StoreState): Block[] {
  const routine = data.routine || { wake: "06:00", breakfast: "08:00", lunch: "13:00", snack: "17:00", dinner: "20:30", sleep: "22:30" };
  const blocks: Block[] = [];

  const wake = routine.wake || "06:00";
  const breakfast = routine.breakfast || "08:00";
  const lunch = routine.lunch || "13:00";
  const snack = routine.snack || "17:00";
  const dinner = routine.dinner || "20:30";
  const sleep = routine.sleep || "22:30";

  const wakeMin = timeToMin(wake);
  const breakfastMin = timeToMin(breakfast);
  const lunchMin = timeToMin(lunch);
  const snackMin = timeToMin(snack);
  const dinnerMin = timeToMin(dinner);
  const sleepMin = timeToMin(sleep);

  // Check if exam day
  const examToday = EXAMS.find((e) => e.date === dateString);
  if (examToday) {
    blocks.push({ start: wake, end: minToTime(wakeMin + 30), label: "Wake Up + Fresh Up", type: "break" });
    blocks.push({ start: minToTime(wakeMin + 30), end: minToTime(wakeMin + 60), label: `Quick Review \u2014 ${SUBJECT_LABELS[examToday.key]}`, type: "study", subjectKey: examToday.key });
    blocks.push({ start: breakfast, end: minToTime(breakfastMin + 30), label: "BREAKFAST", type: "meal" });
    blocks.push({ start: minToTime(breakfastMin + 30), end: minToTime(breakfastMin + 60), label: "Relax + Prepare for Exam", type: "break" });
    blocks.push({ start: minToTime(breakfastMin + 60), end: minToTime(breakfastMin + 60 + 180), label: `EXAM \u2014 ${examToday.subject}`, type: "study", subjectKey: examToday.key });
    blocks.push({ start: lunch, end: minToTime(lunchMin + 45), label: "LUNCH + Rest", type: "meal" });
    blocks.push({ start: minToTime(lunchMin + 45), end: snack, label: "Rest / Light Activity", type: "break" });

    const nextExam = EXAMS.find((e) => e.date > dateString);
    if (nextExam) {
      blocks.push({ start: snack, end: minToTime(snackMin + 30), label: "Snack Break", type: "meal" });
      blocks.push({ start: minToTime(snackMin + 30), end: dinner, label: `Light Study \u2014 ${SUBJECT_LABELS[nextExam.key]}`, type: "study", subjectKey: nextExam.key });
    }
    blocks.push({ start: dinner, end: minToTime(dinnerMin + 45), label: "DINNER", type: "meal" });
    blocks.push({ start: minToTime(dinnerMin + 45), end: sleep, label: "Relax + Early Sleep", type: "break" });
    blocks.push({ start: sleep, end: minToTime(sleepMin + 1), label: "SLEEP", type: "sleep" });
    return blocks;
  }

  // Check revision day (1-2 days before exam)
  const revisionExam = EXAMS.find((e) => {
    const d = daysBetween(dateString, e.date);
    return d >= 1 && d <= 2;
  });

  // Compute priorities
  const priorities: { key: string; priority: number }[] = [];
  const revisionDueChapters = getRevisionDueChapters(dateString, data.subjects);
  const revisionSubjects = new Set(revisionDueChapters.map((r) => r.subjectKey));
  Object.keys(SUBJECT_LABELS).forEach((key) => {
    let p = getSubjectPriority(key, dateString, data);
    if (revisionSubjects.has(key)) p += 0.3;
    if (p > 0) priorities.push({ key, priority: p });
  });
  priorities.sort((a, b) => b.priority - a.priority);

  // Build time blocks
  const fixedBlocks = [
    { time: wakeMin, duration: 30, label: "Wake Up + Fresh Up + Light Exercise", type: "break" as const },
    { time: breakfastMin, duration: 30, label: "BREAKFAST", type: "meal" as const },
    { time: lunchMin, duration: 45, label: "LUNCH + Rest", type: "meal" as const },
    { time: snackMin, duration: 30, label: "Evening Break / Snack", type: "meal" as const },
    { time: dinnerMin, duration: 45, label: "DINNER", type: "meal" as const },
    { time: sleepMin, duration: 1, label: "SLEEP", type: "sleep" as const },
  ];
  fixedBlocks.sort((a, b) => a.time - b.time);

  let cursor = wakeMin;
  let subjectIndex = 0;
  let revisionSlots = 0;
  const revDueChapters = [...revisionDueChapters]; // mutable copy

  fixedBlocks.forEach((fb) => {
    if (cursor < fb.time) {
      let gap = fb.time - cursor;
      while (gap >= 20 && subjectIndex < priorities.length * 3) {
        const blockLen = Math.min(gap, 90);
        if (blockLen < 20) break;

        let subj: string | undefined;
        if (revisionExam && revisionSlots < 3) {
          subj = revisionExam.key;
          revisionSlots++;
        } else {
          subj = priorities[subjectIndex % priorities.length]?.key;
          subjectIndex++;
        }

        if (subj) {
          const revChap = revDueChapters.find((r) => r.subjectKey === subj);
          let chapterName: string;
          if (revChap) {
            chapterName = revChap.chapterName + " (Revision)";
            const revIdx = revDueChapters.indexOf(revChap);
            if (revIdx >= 0) revDueChapters.splice(revIdx, 1);
          } else {
            const chapters = (data.subjects[subj] || []).filter((c) => c.status !== "completed");
            chapterName = chapters.length > 0 ? chapters[0].name : "Revision";
          }

          blocks.push({
            start: minToTime(cursor),
            end: minToTime(cursor + blockLen),
            label: `${SUBJECT_LABELS[subj]} \u2014 ${chapterName}`,
            type: "study",
            subjectKey: subj,
          });
        }
        cursor += blockLen;

        if (cursor < fb.time && fb.time - cursor > 20) {
          blocks.push({ start: minToTime(cursor), end: minToTime(cursor + 15), label: "Short Break", type: "break" });
          cursor += 15;
        }
        gap = fb.time - cursor;
      }
    }

    blocks.push({ start: minToTime(fb.time), end: minToTime(fb.time + fb.duration), label: fb.label, type: fb.type });
    cursor = fb.time + fb.duration;
  });

  // After dinner, light revision
  if (cursor < sleepMin) {
    const revSubj = priorities[0]?.key;
    if (revSubj) {
      blocks.push({
        start: minToTime(cursor),
        end: minToTime(sleepMin),
        label: `Light Revision \u2014 ${SUBJECT_LABELS[revSubj]}`,
        type: "study",
        subjectKey: revSubj,
      });
    }
  }

  return blocks;
}

export function getDayPlan(dateString: string, data: StoreState): Block[] {
  const custom = (data.customPlans || {})[dateString];
  if (custom && custom.length > 0) return custom;
  return generateDayPlan(dateString, data);
}

export function analyzeStudyBalance(blocks: Block[], data: StoreState): string[] | null {
  const subjectMinutes: Record<string, number> = {};
  let totalStudyMin = 0;
  blocks.forEach((b) => {
    if (b.type === "study" && b.subjectKey) {
      const mins = timeToMin(b.end) - timeToMin(b.start);
      subjectMinutes[b.subjectKey] = (subjectMinutes[b.subjectKey] || 0) + mins;
      totalStudyMin += mins;
    }
  });
  if (totalStudyMin === 0) return null;

  const warnings: string[] = [];
  const td = today();

  Object.keys(subjectMinutes).forEach((key) => {
    const pct = subjectMinutes[key] / totalStudyMin;
    if (pct > 0.5 && Object.keys(subjectMinutes).length < 3) {
      warnings.push(`You're spending ${Math.round(pct * 100)}% of study time on ${SUBJECT_LABELS[key]}. Consider diversifying.`);
    }
  });

  const upcoming = EXAMS.filter((e) => {
    const d = daysBetween(td, e.date);
    return d > 0 && d <= 10;
  });
  upcoming.forEach((exam) => {
    const days = daysBetween(td, exam.date);
    const chapters = data.subjects[exam.key] || [];
    const incomplete = chapters.filter((c) => c.status !== "completed").length;
    if (incomplete > 0 && !subjectMinutes[exam.key] && days <= 7) {
      warnings.push(`${SUBJECT_LABELS[exam.key]} exam in ${days} days with ${incomplete} chapter${incomplete > 1 ? "s" : ""} left, but it's not in today's plan!`);
    }
  });

  return warnings.length > 0 ? warnings : null;
}
