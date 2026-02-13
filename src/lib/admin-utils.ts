import type { Chapter } from "./constants";
import { SECOND_LANGUAGES, ELECTIVES } from "./constants";

export interface AdminUser {
  uid: string;
  email?: string;
  name?: string;
  onboarded?: boolean;
  learningStyle?: string;
  studyHours?: number;
  subjectRatings?: Record<string, string>;
  targetPercent?: number;
  prepLevel?: string;
  routine?: {
    wake?: string;
    breakfast?: string;
    lunch?: string;
    snack?: string;
    dinner?: string;
    sleep?: string;
  };
  grokApiKey?: string;
  subjects?: Record<string, Chapter[]>;
  studyLog?: Record<string, { hours: number; sessions: number }>;
  timerSessions?: { date: string; subject: string; chapter: string; minutes: number }[];
  theme?: string;
  streak?: number;
  lastStudyDate?: string | null;
  selectedLanguage?: string;
  selectedElective?: string;
  solvedPapers?: string[];
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function isWithinDays(dateStr: string | null | undefined, n: number): boolean {
  if (!dateStr) return false;
  const target = new Date(dateStr);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - n);
  return target >= cutoff;
}

export function computeTopStats(users: AdminUser[]) {
  const totalUsers = users.length;
  const onboardedUsers = users.filter((u) => u.onboarded).length;
  const todayStr = today();
  const activeToday = users.filter((u) => u.lastStudyDate === todayStr).length;
  const activeThisWeek = users.filter((u) => isWithinDays(u.lastStudyDate, 7)).length;

  let totalStreak = 0;
  let streakCount = 0;
  let totalHours = 0;

  for (const u of users) {
    if (u.streak && u.streak > 0) {
      totalStreak += u.streak;
      streakCount++;
    }
    if (u.studyLog) {
      for (const entry of Object.values(u.studyLog)) {
        totalHours += entry.hours || 0;
      }
    }
  }

  return {
    totalUsers,
    onboardedUsers,
    activeToday,
    activeThisWeek,
    avgStreak: streakCount > 0 ? Math.round((totalStreak / streakCount) * 10) / 10 : 0,
    totalStudyHours: Math.round(totalHours * 10) / 10,
  };
}

export function computeDAU(users: AdminUser[], days = 30): { date: string; count: number }[] {
  const result: { date: string; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = daysAgo(i);
    const count = users.filter((u) => {
      if (u.studyLog && u.studyLog[d] && u.studyLog[d].hours > 0) return true;
      if (u.lastStudyDate === d) return true;
      return false;
    }).length;
    result.push({ date: d.slice(5), count });
  }
  return result;
}

export function computeStudyHoursTrend(users: AdminUser[], days = 30): { date: string; hours: number }[] {
  const result: { date: string; hours: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = daysAgo(i);
    let totalHours = 0;
    for (const u of users) {
      if (u.studyLog && u.studyLog[d]) {
        totalHours += u.studyLog[d].hours || 0;
      }
    }
    result.push({ date: d.slice(5), hours: Math.round(totalHours * 10) / 10 });
  }
  return result;
}

export function computeLanguageDistribution(users: AdminUser[]): { name: string; count: number }[] {
  const counts: Record<string, number> = {};
  const langMap: Record<string, string> = {};
  for (const l of SECOND_LANGUAGES) langMap[l.key] = l.name;

  for (const u of users) {
    if (u.selectedLanguage) {
      const label = langMap[u.selectedLanguage] || u.selectedLanguage;
      counts[label] = (counts[label] || 0) + 1;
    }
  }

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function computeElectiveDistribution(users: AdminUser[]): { name: string; count: number }[] {
  const counts: Record<string, number> = {};
  const electiveMap: Record<string, string> = {};
  for (const e of ELECTIVES) electiveMap[e.key] = e.name;

  for (const u of users) {
    if (u.selectedElective) {
      const label = electiveMap[u.selectedElective] || u.selectedElective;
      counts[label] = (counts[label] || 0) + 1;
    }
  }

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function computeLearningStyleDist(users: AdminUser[]): { name: string; count: number }[] {
  const counts: Record<string, number> = {};
  const labels: Record<string, string> = {
    visual: "Visual",
    reading: "Reading",
    practice: "Practice",
    mixed: "Mixed",
  };

  for (const u of users) {
    if (u.learningStyle) {
      const label = labels[u.learningStyle] || u.learningStyle;
      counts[label] = (counts[label] || 0) + 1;
    }
  }

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function computePrepLevelDist(users: AdminUser[]): { name: string; count: number }[] {
  const counts: Record<string, number> = {};
  const labels: Record<string, string> = {
    just_started: "Just Started",
    somewhat: "Somewhat Prepared",
    mostly_done: "Mostly Done",
  };

  for (const u of users) {
    if (u.prepLevel) {
      const label = labels[u.prepLevel] || u.prepLevel;
      counts[label] = (counts[label] || 0) + 1;
    }
  }

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function computeStreakDist(users: AdminUser[]): { range: string; count: number }[] {
  const bins = [
    { range: "0", min: 0, max: 0 },
    { range: "1-3", min: 1, max: 3 },
    { range: "4-7", min: 4, max: 7 },
    { range: "8-14", min: 8, max: 14 },
    { range: "15-30", min: 15, max: 30 },
    { range: "30+", min: 31, max: Infinity },
  ];

  const result = bins.map((b) => ({ range: b.range, count: 0 }));
  for (const u of users) {
    const s = u.streak || 0;
    for (let i = 0; i < bins.length; i++) {
      if (s >= bins[i].min && s <= bins[i].max) {
        result[i].count++;
        break;
      }
    }
  }
  return result;
}

export function computeChapterCompletion(users: AdminUser[]): { subject: string; avgPct: number }[] {
  const subjectTotals: Record<string, { total: number; completed: number; count: number }> = {};

  for (const u of users) {
    if (!u.subjects) continue;
    for (const [key, chapters] of Object.entries(u.subjects)) {
      if (!chapters || chapters.length === 0) continue;
      if (!subjectTotals[key]) {
        subjectTotals[key] = { total: 0, completed: 0, count: 0 };
      }
      subjectTotals[key].total += chapters.length;
      subjectTotals[key].completed += chapters.filter((c) => c.status === "completed").length;
      subjectTotals[key].count++;
    }
  }

  // Map subject keys to labels
  const allLabels: Record<string, string> = {
    english_lang: "English Lang",
    english_lit: "English Lit",
    math: "Mathematics",
    physics: "Physics",
    chemistry: "Chemistry",
    biology: "Biology",
    history: "History",
    geography: "Geography",
  };
  for (const l of SECOND_LANGUAGES) allLabels[l.key] = l.name;
  for (const e of ELECTIVES) allLabels[e.key] = e.name;

  return Object.entries(subjectTotals)
    .filter(([, v]) => v.total > 0)
    .map(([key, v]) => ({
      subject: allLabels[key] || key,
      avgPct: Math.round((v.completed / v.total) * 100),
    }))
    .sort((a, b) => b.avgPct - a.avgPct);
}

export function getUserTotalHours(user: AdminUser): number {
  if (!user.studyLog) return 0;
  return Object.values(user.studyLog).reduce((sum, e) => sum + (e.hours || 0), 0);
}

export function getUserChaptersDone(user: AdminUser): number {
  if (!user.subjects) return 0;
  let done = 0;
  for (const chapters of Object.values(user.subjects)) {
    if (!chapters) continue;
    done += chapters.filter((c) => c.status === "completed").length;
  }
  return done;
}

export function getUserTotalChapters(user: AdminUser): number {
  if (!user.subjects) return 0;
  let total = 0;
  for (const chapters of Object.values(user.subjects)) {
    if (!chapters) continue;
    total += chapters.length;
  }
  return total;
}

export function getUserSolvedPaperCount(user: AdminUser): number {
  return user.solvedPapers?.length || 0;
}
