"use client";

import { useEffect, useState, useCallback } from "react";
import { useStore } from "@/store/use-store";
import { getExams, type Block } from "@/lib/constants";
import { today } from "@/lib/utils";
import { getDayPlan } from "@/lib/algorithms";
import {
  isPushSupported,
  getNotificationPermission,
  requestNotificationPermission,
  registerServiceWorker,
  restoreScheduledNotifications,
  scheduleStudyNotifications,
  scheduleExamNotifications,
  cancelAllScheduledNotifications,
} from "@/lib/push-notifications";

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(() => {
    if (typeof window === "undefined") return "default";
    return isPushSupported() ? getNotificationPermission() : "unsupported";
  });
  const [isSupported] = useState(() => {
    if (typeof window === "undefined") return false;
    return isPushSupported();
  });
  const [isInitialized, setIsInitialized] = useState(false);

  const data = useStore();
  const selectedLanguage = data.selectedLanguage || "kannada";
  const selectedElective = data.selectedElective || "computer";

  // Initialize on mount and auto-enable notifications
  useEffect(() => {
    if (!isSupported) return;
    
    // Register service worker
    registerServiceWorker().then(async () => {
      // Restore any saved scheduled notifications
      restoreScheduledNotifications();
      
      // Auto-request permission if not yet granted/denied
      if (getNotificationPermission() === "default") {
        const result = await requestNotificationPermission();
        setPermission(result);
      }
      
      setIsInitialized(true);
    });
  }, [isSupported]);

  // Schedule notifications for today's plan
  const scheduleToday = useCallback(() => {
    if (!isSupported || permission !== "granted") return;

    // Load notification preferences
    const savedPrefs = localStorage.getItem("notification-prefs");
    const prefs = savedPrefs ? JSON.parse(savedPrefs) : {
      studyReminders: true,
      examAlerts: true,
      revisionDue: true,
    };

    const td = today();

    // Cancel existing scheduled notifications
    cancelAllScheduledNotifications();

    // Schedule study session notifications
    if (prefs.studyReminders) {
      const blocks = getDayPlan(td, data);
      if (blocks && blocks.length > 0) {
        // Filter out non-study blocks and map to expected format
        const studyBlocks = blocks
          .filter((b: Block) => b.type === "study" && b.subjectKey)
          .map((b: Block) => ({
            start: b.start,
            end: b.end,
            subject: b.subjectKey || "",
            label: b.label,
          }));
        scheduleStudyNotifications(studyBlocks, td);
      }
    }

    // Schedule exam notifications
    if (prefs.examAlerts) {
      const exams = getExams(selectedLanguage, selectedElective);
      scheduleExamNotifications(exams);
    }
  }, [isSupported, permission, data, selectedLanguage, selectedElective]);

  // Auto-schedule when permission is granted or store changes
  useEffect(() => {
    if (isInitialized && permission === "granted") {
      scheduleToday();
    }
  }, [isInitialized, permission, scheduleToday]);

  // Re-schedule at midnight
  useEffect(() => {
    if (!isInitialized || permission !== "granted") return;

    const checkMidnight = () => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        scheduleToday();
      }
    };

    const interval = setInterval(checkMidnight, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [isInitialized, permission, scheduleToday]);

  return {
    isSupported,
    permission,
    isInitialized,
    scheduleToday,
  };
}
