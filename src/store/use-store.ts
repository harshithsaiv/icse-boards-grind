"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_CHAPTERS, type Chapter, type Block } from "@/lib/constants";

export interface Routine {
  wake: string;
  breakfast: string;
  lunch: string;
  snack: string;
  dinner: string;
  sleep: string;
}

export interface StudyLogEntry {
  hours: number;
  sessions: number;
}

export interface TimerSession {
  date: string;
  subject: string;
  chapter: string;
  minutes: number;
}

export interface ExamAssessment {
  rating: number;
  notes: string;
  date: string;
  skipped?: boolean;
}

export interface CoachMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  planChanges?: ParsedPlanChange[];
}

export interface ParsedPlanChange {
  action: "add" | "remove" | "replace";
  start: string;
  end: string;
  subject?: string;
  label: string;
  applied?: boolean;
}

export interface StoreState {
  onboarded: boolean;
  name: string;
  learningStyle: "visual" | "reading" | "practice" | "mixed";
  studyHours: number;
  subjectRatings: Record<string, "weak" | "medium" | "strong">;
  targetPercent: number;
  prepLevel: "just_started" | "somewhat" | "mostly_done";
  routine: Routine;
  grokApiKey: string;
  subjects: Record<string, Chapter[]>;
  studyLog: Record<string, StudyLogEntry>;
  timerSessions: TimerSession[];
  theme: "light" | "dark";
  streak: number;
  lastStudyDate: string | null;
  planCache: Record<string, Block[]>;
  customPlans: Record<string, Block[]>;
  examAssessments: Record<string, ExamAssessment>;
  lastExamNotification: string | null;
  selectedLanguage: string;
  selectedElective: string;
  coachMessages: Record<string, CoachMessage[]>;
  dailyBriefingCache: Record<string, { content: string; timestamp: number }>;
  solvedPapers: string[];
  _hydrated: boolean;
}

export interface StoreActions {
  setField: <K extends keyof StoreState>(key: K, value: StoreState[K]) => void;
  update: (fn: (state: StoreState) => Partial<StoreState>) => void;
  setAll: (data: Partial<StoreState>) => void;
  resetStore: () => void;
  markHydrated: () => void;
}

const defaultState: StoreState = {
  onboarded: false,
  name: "",
  learningStyle: "mixed",
  studyHours: 8,
  subjectRatings: {},
  targetPercent: 90,
  prepLevel: "somewhat",
  routine: {
    wake: "06:00",
    breakfast: "08:00",
    lunch: "13:00",
    snack: "17:00",
    dinner: "20:30",
    sleep: "22:30",
  },
  grokApiKey: "",
  subjects: JSON.parse(JSON.stringify(DEFAULT_CHAPTERS)),
  studyLog: {},
  timerSessions: [],
  theme: "light",
  streak: 0,
  lastStudyDate: null,
  planCache: {},
  customPlans: {},
  examAssessments: {},
  lastExamNotification: null,
  selectedLanguage: "kannada",
  selectedElective: "computer",
  coachMessages: {},
  dailyBriefingCache: {},
  solvedPapers: [],
  _hydrated: false,
};

export const useStore = create<StoreState & StoreActions>()(
  persist(
    (set) => ({
      ...defaultState,

      setField: (key, value) => set({ [key]: value } as Partial<StoreState>),

      update: (fn) =>
        set((state) => {
          const updates = fn(state);
          return updates;
        }),

      setAll: (data) => set(data),

      resetStore: () => set({ ...defaultState, _hydrated: true }),

      markHydrated: () => set({ _hydrated: true }),
    }),
    {
      name: "icse_grind",
      partialize: (state) => {
        const { _hydrated, setField, update, setAll, resetStore, markHydrated, ...rest } = state;
        return rest;
      },
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
    }
  )
);
