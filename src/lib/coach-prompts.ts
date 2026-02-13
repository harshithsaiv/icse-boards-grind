import { getExams, getSubjectLabels } from "./constants";
import { today, daysBetween } from "./utils";
import type { StoreState } from "@/store/use-store";

export function buildStudentContext(data: StoreState): string {
  const lang = data.selectedLanguage || "kannada";
  const elective = data.selectedElective || "computer";
  const exams = getExams(lang, elective);
  const labels = getSubjectLabels(lang, elective);
  const td = today();

  const lines: string[] = [];
  lines.push(`Student: ${data.name || "Student"}`);
  lines.push(`Target: ${data.targetPercent || 90}%`);
  lines.push(`Daily study target: ${data.studyHours || 8} hours`);
  lines.push(`Prep level: ${data.prepLevel || "somewhat"}`);
  lines.push(`Current streak: ${data.streak || 0} days`);
  lines.push(`Today: ${td}`);
  lines.push("");

  // Exam dates with days remaining
  lines.push("=== EXAM SCHEDULE ===");
  exams.forEach((exam) => {
    const days = daysBetween(td, exam.date);
    const status = days < 0 ? "DONE" : days === 0 ? "TODAY" : `${days} days left`;
    lines.push(`${labels[exam.key] || exam.subject}: ${exam.date} (${status}) — ${exam.duration}`);
  });
  lines.push("");

  // Subject ratings and chapter progress
  lines.push("=== SUBJECT STATUS ===");
  Object.keys(labels).forEach((key) => {
    const rating = (data.subjectRatings || {})[key] || "medium";
    const chapters = data.subjects[key] || [];
    const completed = chapters.filter((c) => c.status === "completed").length;
    const inProgress = chapters.filter((c) => c.status === "in_progress").length;
    const needsRevision = chapters.filter((c) => c.status === "needs_revision").length;
    const notStarted = chapters.filter((c) => c.status === "not_started").length;
    lines.push(`${labels[key]}: confidence=${rating}, chapters=${chapters.length} (done=${completed}, in_progress=${inProgress}, needs_revision=${needsRevision}, not_started=${notStarted})`);
  });
  lines.push("");

  // Recent study log
  lines.push("=== RECENT STUDY (last 7 days) ===");
  const log = data.studyLog || {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const entry = log[ds];
    if (entry) {
      lines.push(`${ds}: ${entry.hours.toFixed(1)}h, ${entry.sessions} sessions`);
    } else {
      lines.push(`${ds}: no study`);
    }
  }
  lines.push("");

  // Timer sessions today
  const todaySessions = (data.timerSessions || []).filter((s) => s.date === td);
  if (todaySessions.length > 0) {
    lines.push("=== TODAY'S TIMER SESSIONS ===");
    todaySessions.forEach((s) => {
      lines.push(`${labels[s.subject] || s.subject} — ${s.chapter || "general"}: ${s.minutes} min`);
    });
    lines.push("");
  }

  // Routine
  const r = data.routine || { wake: "06:00", breakfast: "08:00", lunch: "13:00", snack: "17:00", dinner: "20:30", sleep: "22:30" };
  lines.push(`=== DAILY ROUTINE ===`);
  lines.push(`Wake: ${r.wake}, Breakfast: ${r.breakfast}, Lunch: ${r.lunch}, Snack: ${r.snack}, Dinner: ${r.dinner}, Sleep: ${r.sleep}`);

  return lines.join("\n");
}

export function buildSystemPrompt(data: StoreState): string {
  const context = buildStudentContext(data);

  return `You are an AI Study Coach for an ICSE Class 10 student preparing for their board exams. You have access to their complete study data below.

${context}

=== YOUR COACHING GUIDELINES ===

1. Be warm, supportive, but FIRMLY HONEST. Don't sugarcoat when the student is falling behind.
2. When the student wants to study strong subjects over weak ones, PUSH BACK. Cite specific data — exam dates, chapter counts, confidence ratings.
3. Celebrate real achievements with specific numbers ("You completed 3 Physics chapters this week!").
4. Reference actual exam dates and days remaining.
5. Keep responses concise — students are busy. Use bullet points.
6. When suggesting plan changes, output them in this exact format:

[PLAN_CHANGE]
action: add|remove|replace
start: HH:MM
end: HH:MM
subject: subject_key
label: Description of the block
[/PLAN_CHANGE]

7. Only suggest plan changes when the student explicitly asks to modify their plan.
8. Never be preachy or lecture-like. Be a friend who genuinely cares about their exam results.
9. Use the student's name naturally in conversation.`;
}

export function buildDailyBriefingPrompt(data: StoreState): string {
  const context = buildStudentContext(data);

  return `You are an AI Study Coach for an ICSE Class 10 student. Generate a brief daily briefing based on their data.

${context}

Generate a SHORT daily briefing (max 150 words) with these sections:
- A warm 1-line greeting using their name
- **Progress Snapshot**: Key stats from yesterday/this week (hours studied, chapters completed)
- **Today's Focus**: 2-3 specific subjects/chapters they should prioritize today and why
- **Motivation**: A brief, genuine motivational line tied to their actual progress

Keep it punchy and actionable. Use bold for headers. Don't use plan change tags here.`;
}
