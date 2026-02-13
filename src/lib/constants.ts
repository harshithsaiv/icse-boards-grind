export interface Chapter {
  name: string;
  status: "not_started" | "in_progress" | "completed" | "needs_revision";
  difficulty: number;
  revisionDate?: string;
  revisionIntervals?: number[];
  revisionsCompleted?: number;
}

export interface Block {
  start: string;
  end: string;
  label: string;
  type: "study" | "meal" | "break" | "sleep";
  subjectKey?: string;
}

export interface Exam {
  date: string;
  subject: string;
  key: string;
  duration: string;
}

export interface SecondLanguage {
  name: string;
  key: string;
  date: string;
  duration: string;
}

export interface Elective {
  name: string;
  key: string;
  date: string;
  duration: string;
  group: string;
}

// 8 core subjects (fixed for all ICSE students)
export const CORE_EXAMS: Exam[] = [
  { date: "2026-02-17", subject: "English Language Paper 1", key: "english_lang", duration: "2hrs" },
  { date: "2026-02-20", subject: "English Literature Paper 2", key: "english_lit", duration: "2hrs" },
  { date: "2026-03-02", subject: "Mathematics", key: "math", duration: "3hrs" },
  { date: "2026-03-09", subject: "Physics", key: "physics", duration: "2hrs" },
  { date: "2026-03-11", subject: "Chemistry", key: "chemistry", duration: "2hrs" },
  { date: "2026-03-13", subject: "Biology", key: "biology", duration: "2hrs" },
  { date: "2026-03-16", subject: "History & Civics", key: "history", duration: "2hrs" },
  { date: "2026-03-18", subject: "Geography", key: "geography", duration: "2hrs" },
];

export const SECOND_LANGUAGES: SecondLanguage[] = [
  { name: "Hindi", key: "hindi", date: "2026-02-26", duration: "3hrs" },
  { name: "Kannada", key: "kannada", date: "2026-03-06", duration: "3hrs" },
  { name: "Tamil", key: "tamil", date: "2026-03-06", duration: "3hrs" },
  { name: "Telugu", key: "telugu", date: "2026-03-06", duration: "3hrs" },
  { name: "Bengali", key: "bengali", date: "2026-03-06", duration: "3hrs" },
  { name: "Malayalam", key: "malayalam", date: "2026-03-06", duration: "3hrs" },
  { name: "Marathi", key: "marathi", date: "2026-03-06", duration: "3hrs" },
  { name: "Gujarati", key: "gujarati", date: "2026-03-06", duration: "3hrs" },
  { name: "Punjabi", key: "punjabi", date: "2026-03-06", duration: "3hrs" },
  { name: "Urdu", key: "urdu", date: "2026-03-06", duration: "3hrs" },
  { name: "French", key: "french", date: "2026-03-06", duration: "3hrs" },
  { name: "German", key: "german", date: "2026-03-06", duration: "3hrs" },
  { name: "Sanskrit", key: "sanskrit", date: "2026-03-06", duration: "3hrs" },
];

export const ELECTIVES: Elective[] = [
  { name: "Computer Applications", key: "computer", date: "2026-03-23", duration: "2hrs", group: "III-A" },
  { name: "Economic Applications", key: "economic_app", date: "2026-03-23", duration: "2hrs", group: "III-A" },
  { name: "Physical Education", key: "physical_ed", date: "2026-03-23", duration: "2hrs", group: "III-A" },
  { name: "Home Science", key: "home_science", date: "2026-03-23", duration: "2hrs", group: "III-A" },
  { name: "Fashion Designing", key: "fashion", date: "2026-03-23", duration: "2hrs", group: "III-A" },
  { name: "Cookery", key: "cookery", date: "2026-03-23", duration: "2hrs", group: "III-A" },
  { name: "Commercial Studies", key: "commercial", date: "2026-03-25", duration: "2hrs", group: "II" },
  { name: "French (Elective)", key: "french_elective", date: "2026-03-25", duration: "2hrs", group: "II" },
  { name: "Economics", key: "economics", date: "2026-03-27", duration: "2hrs", group: "II" },
  { name: "Environmental Science", key: "env_science", date: "2026-03-30", duration: "2hrs", group: "II" },
];

/** Build the full exam list from core + selected language + selected elective */
export function getExams(languageKey: string, electiveKey: string): Exam[] {
  const exams = [...CORE_EXAMS];

  const lang = SECOND_LANGUAGES.find((l) => l.key === languageKey);
  if (lang) {
    exams.push({ date: lang.date, subject: lang.name, key: lang.key, duration: lang.duration });
  }

  const elective = ELECTIVES.find((e) => e.key === electiveKey);
  if (elective) {
    exams.push({ date: elective.date, subject: elective.name, key: elective.key, duration: elective.duration });
  }

  // Sort by date
  exams.sort((a, b) => a.date.localeCompare(b.date));
  return exams;
}

/** Get labels for all subjects including the selected language and elective */
export function getSubjectLabels(languageKey: string, electiveKey: string): Record<string, string> {
  const labels: Record<string, string> = {
    english_lang: "English Language",
    english_lit: "English Literature",
    math: "Mathematics",
    physics: "Physics",
    chemistry: "Chemistry",
    biology: "Biology",
    history: "History & Civics",
    geography: "Geography",
  };

  const lang = SECOND_LANGUAGES.find((l) => l.key === languageKey);
  if (lang) labels[lang.key] = lang.name;

  const elective = ELECTIVES.find((e) => e.key === electiveKey);
  if (elective) labels[elective.key] = elective.name;

  return labels;
}

/** Get colors for all subjects including the selected language and elective */
export function getSubjectColors(languageKey: string, electiveKey: string): Record<string, string> {
  const colors: Record<string, string> = {
    english_lang: "#7b61ff",
    english_lit: "#9c7cff",
    math: "#ea4335",
    physics: "#1a73e8",
    chemistry: "#f9ab00",
    biology: "#12b5cb",
    history: "#d93025",
    geography: "#1e8e3e",
  };

  // Assign colors for language and elective
  const langColors: Record<string, string> = {
    hindi: "#ff6b35", kannada: "#34a853", tamil: "#e040fb", telugu: "#00bfa5",
    bengali: "#ff5722", malayalam: "#3f51b5", marathi: "#ff9800", gujarati: "#8bc34a",
    punjabi: "#009688", urdu: "#795548", french: "#2196f3", german: "#607d8b",
    sanskrit: "#9c27b0",
  };

  const electiveColors: Record<string, string> = {
    computer: "#5f6368", economic_app: "#4caf50", physical_ed: "#ff5252",
    home_science: "#e91e63", fashion: "#ab47bc", cookery: "#ff7043",
    commercial: "#42a5f5", french_elective: "#26a69a", economics: "#66bb6a",
    env_science: "#29b6f6",
  };

  if (langColors[languageKey]) colors[languageKey] = langColors[languageKey];
  if (electiveColors[electiveKey]) colors[electiveKey] = electiveColors[electiveKey];

  return colors;
}

/** Get default chapters for all subjects */
export function getDefaultChapters(languageKey: string, electiveKey: string): Record<string, Chapter[]> {
  const chapters: Record<string, Chapter[]> = {
    physics: [
      { name: "Force", status: "not_started", difficulty: 3 },
      { name: "Work, Power & Energy", status: "not_started", difficulty: 3 },
      { name: "Machines", status: "not_started", difficulty: 3 },
      { name: "Refraction of Light at Plane Surfaces", status: "not_started", difficulty: 4 },
      { name: "Refraction Through a Lens", status: "not_started", difficulty: 4 },
      { name: "Spectrum", status: "not_started", difficulty: 2 },
      { name: "Sound", status: "not_started", difficulty: 3 },
      { name: "Current Electricity", status: "not_started", difficulty: 4 },
      { name: "Electrical Power and Household Circuits", status: "not_started", difficulty: 3 },
      { name: "Magnetic Effects of Current", status: "not_started", difficulty: 3 },
      { name: "Calorimetry", status: "not_started", difficulty: 3 },
      { name: "Radioactivity and Nuclear Energy", status: "not_started", difficulty: 3 },
    ],
    chemistry: [
      { name: "The Periodic Table", status: "not_started", difficulty: 3 },
      { name: "Chemical Bonding", status: "not_started", difficulty: 4 },
      { name: "Acids, Bases and Salts", status: "not_started", difficulty: 3 },
      { name: "Analytical Chemistry", status: "not_started", difficulty: 3 },
      { name: "Electrolysis", status: "not_started", difficulty: 4 },
      { name: "Electro Metallurgy", status: "not_started", difficulty: 3 },
      { name: "Study of Compounds - HCl", status: "not_started", difficulty: 3 },
      { name: "Study of Compounds - NH3", status: "not_started", difficulty: 3 },
      { name: "Study of Compounds - HNO3", status: "not_started", difficulty: 3 },
      { name: "Study of Compounds - H2SO4", status: "not_started", difficulty: 3 },
      { name: "Organic Chemistry", status: "not_started", difficulty: 4 },
    ],
    biology: [
      { name: "Structure of Chromosomes", status: "not_started", difficulty: 3 },
      { name: "Genetics & Cell Division", status: "not_started", difficulty: 4 },
      { name: "Photosynthesis", status: "not_started", difficulty: 3 },
      { name: "Transpiration", status: "not_started", difficulty: 3 },
      { name: "Chemical Coordination in Plants", status: "not_started", difficulty: 3 },
      { name: "Circulatory System", status: "not_started", difficulty: 4 },
      { name: "Excretory System", status: "not_started", difficulty: 3 },
      { name: "Nervous System", status: "not_started", difficulty: 4 },
      { name: "Endocrine System", status: "not_started", difficulty: 3 },
      { name: "Reproductive System", status: "not_started", difficulty: 3 },
      { name: "Health & Hygiene", status: "not_started", difficulty: 2 },
      { name: "Pollution", status: "not_started", difficulty: 2 },
      { name: "Population", status: "not_started", difficulty: 2 },
      { name: "Human Evolution", status: "not_started", difficulty: 3 },
    ],
    geography: [
      { name: "Climate", status: "not_started", difficulty: 3 },
      { name: "Soil", status: "not_started", difficulty: 2 },
      { name: "Natural Vegetation", status: "not_started", difficulty: 3 },
      { name: "Water Resources", status: "not_started", difficulty: 3 },
      { name: "Transport", status: "not_started", difficulty: 2 },
      { name: "Agriculture Unit 1 - Types & Major Crops", status: "not_started", difficulty: 3 },
      { name: "Agriculture Unit 2 - Climatic & Soil Conditions", status: "not_started", difficulty: 3 },
      { name: "Agriculture Unit 3 - Tools, Techniques, Changes", status: "not_started", difficulty: 2 },
      { name: "Agriculture Unit 4 - Problems & Government Measures", status: "not_started", difficulty: 2 },
      { name: "Industries - Types, Examples, Factors", status: "not_started", difficulty: 3 },
      { name: "Mineral Resources", status: "not_started", difficulty: 3 },
      { name: "Conventional Energy", status: "not_started", difficulty: 2 },
      { name: "Non-Conventional Energy", status: "not_started", difficulty: 2 },
    ],
    english_lang: [],
    english_lit: [],
    math: [],
    history: [],
  };

  // Add empty chapters for selected language and elective
  chapters[languageKey] = [];
  chapters[electiveKey] = [];

  return chapters;
}

// Static references for backward compatibility (default selections)
export const EXAMS = getExams("kannada", "computer");

export const SUBJECT_COLORS: Record<string, string> = getSubjectColors("kannada", "computer");

export const SUBJECT_LABELS: Record<string, string> = getSubjectLabels("kannada", "computer");

export const DEFAULT_CHAPTERS: Record<string, Chapter[]> = getDefaultChapters("kannada", "computer");

export const MOTIVATIONAL_QUOTES = [
  "Success is the sum of small efforts, repeated day in and day out.",
  "Don't watch the clock; do what it does. Keep going.",
  "The expert in anything was once a beginner.",
  "It always seems impossible until it's done. \u2014 Nelson Mandela",
  "Push yourself, because no one else is going to do it for you.",
  "Hard work beats talent when talent doesn't work hard.",
  "Believe you can and you're halfway there. \u2014 Theodore Roosevelt",
  "The only way to do great work is to love what you do. \u2014 Steve Jobs",
  "Your future is created by what you do today, not tomorrow.",
  "Every champion was once a contender that refused to give up.",
  "Dream big, work hard, stay focused, and surround yourself with good people.",
  "Discipline is choosing between what you want now and what you want most.",
];

export const STATUS_CYCLE = ["not_started", "in_progress", "completed", "needs_revision"] as const;
export const STATUS_LABELS: Record<string, string> = {
  not_started: "",
  in_progress: "~",
  completed: "\u2713",
  needs_revision: "!",
};

export const SECTION_TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  calendar: "Calendar",
  subjects: "Subjects",
  planner: "Planner",
  coach: "AI Coach",
  timer: "Timer",
  progress: "Progress",
  papers: "Practice Papers",
  settings: "Settings",
};
