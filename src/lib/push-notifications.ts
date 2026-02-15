"use client";

// Push Notification Utilities for ICSE Boards Grind

export interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  scheduledTime: number; // timestamp in ms
  type: "study_start" | "study_reminder" | "break" | "exam_alert" | "revision_due";
  data?: Record<string, string>;
}

// Check if push notifications are supported
export function isPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

// Get current notification permission status
export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!isPushSupported()) return "unsupported";
  return Notification.permission;
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission | "unsupported"> {
  if (!isPushSupported()) return "unsupported";
  
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return "denied";
  }
}

// Register service worker
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) {
    console.warn("Service workers not supported");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
    console.log("Service Worker registered:", registration.scope);
    return registration;
  } catch (error) {
    console.error("Service Worker registration failed:", error);
    return null;
  }
}

// Get service worker registration
export async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) return null;
  
  try {
    return await navigator.serviceWorker.ready;
  } catch (error) {
    console.error("Error getting service worker:", error);
    return null;
  }
}

// Show a local notification immediately
export async function showNotification(
  title: string,
  options?: NotificationOptions
): Promise<boolean> {
  if (!isPushSupported()) return false;

  const permission = await requestNotificationPermission();
  if (permission !== "granted") return false;

  try {
    const registration = await getServiceWorkerRegistration();
    if (registration) {
      await registration.showNotification(title, {
        icon: "/icons/icon-192x192.svg",
        badge: "/icons/icon-192x192.svg",
        tag: "icse-grind",
        ...options,
      });
      return true;
    }
    
    // Fallback to regular Notification
    new Notification(title, options);
    return true;
  } catch (error) {
    console.error("Error showing notification:", error);
    return false;
  }
}

// Schedule a notification using setTimeout (for same-session notifications)
const scheduledTimeouts: Map<string, NodeJS.Timeout> = new Map();

export function scheduleNotification(notification: ScheduledNotification): string {
  const now = Date.now();
  const delay = notification.scheduledTime - now;

  if (delay <= 0) {
    // Time has passed, show immediately
    showNotification(notification.title, {
      body: notification.body,
      tag: notification.id,
      data: notification.data,
    });
    return notification.id;
  }

  // Cancel existing timeout with same ID
  cancelScheduledNotification(notification.id);

  const timeout = setTimeout(() => {
    showNotification(notification.title, {
      body: notification.body,
      tag: notification.id,
      data: notification.data,
    });
    scheduledTimeouts.delete(notification.id);
    
    // Remove from localStorage
    removeScheduledNotificationFromStorage(notification.id);
  }, delay);

  scheduledTimeouts.set(notification.id, timeout);
  
  // Store in localStorage for persistence
  saveScheduledNotificationToStorage(notification);

  return notification.id;
}

export function cancelScheduledNotification(id: string): void {
  const timeout = scheduledTimeouts.get(id);
  if (timeout) {
    clearTimeout(timeout);
    scheduledTimeouts.delete(id);
  }
  removeScheduledNotificationFromStorage(id);
}

export function cancelAllScheduledNotifications(): void {
  scheduledTimeouts.forEach((timeout) => clearTimeout(timeout));
  scheduledTimeouts.clear();
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem("icse-scheduled-notifications");
  }
}

// LocalStorage helpers for persistence
function saveScheduledNotificationToStorage(notification: ScheduledNotification): void {
  if (typeof localStorage === "undefined") return;
  
  try {
    const stored = localStorage.getItem("icse-scheduled-notifications");
    const notifications: ScheduledNotification[] = stored ? JSON.parse(stored) : [];
    
    // Remove existing with same ID
    const filtered = notifications.filter((n) => n.id !== notification.id);
    filtered.push(notification);
    
    localStorage.setItem("icse-scheduled-notifications", JSON.stringify(filtered));
  } catch (error) {
    console.error("Error saving scheduled notification:", error);
  }
}

function removeScheduledNotificationFromStorage(id: string): void {
  if (typeof localStorage === "undefined") return;
  
  try {
    const stored = localStorage.getItem("icse-scheduled-notifications");
    if (!stored) return;
    
    const notifications: ScheduledNotification[] = JSON.parse(stored);
    const filtered = notifications.filter((n) => n.id !== id);
    localStorage.setItem("icse-scheduled-notifications", JSON.stringify(filtered));
  } catch (error) {
    console.error("Error removing scheduled notification:", error);
  }
}

export function getScheduledNotifications(): ScheduledNotification[] {
  if (typeof localStorage === "undefined") return [];
  
  try {
    const stored = localStorage.getItem("icse-scheduled-notifications");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Restore scheduled notifications on app load
export function restoreScheduledNotifications(): void {
  const notifications = getScheduledNotifications();
  const now = Date.now();
  
  notifications.forEach((notification) => {
    if (notification.scheduledTime > now) {
      scheduleNotification(notification);
    } else {
      // Remove expired notifications
      removeScheduledNotificationFromStorage(notification.id);
    }
  });
}

// Schedule study session notifications based on daily plan
export function scheduleStudyNotifications(
  blocks: Array<{ start: string; end: string; subject: string; label?: string }>,
  dateStr: string
): string[] {
  const ids: string[] = [];
  const today = new Date().toISOString().split("T")[0];
  
  // Only schedule for today
  if (dateStr !== today) return ids;

  blocks.forEach((block, index) => {
    const [hours, minutes] = block.start.split(":").map(Number);
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);
    
    // Skip if time has passed
    if (scheduledTime.getTime() <= Date.now()) return;

    const id = `study-${dateStr}-${index}`;
    
    // Schedule notification 5 minutes before
    const reminderTime = new Date(scheduledTime.getTime() - 5 * 60 * 1000);
    if (reminderTime.getTime() > Date.now()) {
      const reminderId = scheduleNotification({
        id: `${id}-reminder`,
        title: "📚 Study Session Starting Soon",
        body: `${block.label || block.subject} starts in 5 minutes`,
        scheduledTime: reminderTime.getTime(),
        type: "study_reminder",
        data: { subject: block.subject, url: "/dashboard/timer" },
      });
      ids.push(reminderId);
    }

    // Schedule notification at start time
    const startId = scheduleNotification({
      id,
      title: "🎯 Time to Study!",
      body: `Start your ${block.label || block.subject} session now`,
      scheduledTime: scheduledTime.getTime(),
      type: "study_start",
      data: { subject: block.subject, url: "/dashboard/timer" },
    });
    ids.push(startId);
  });

  return ids;
}

// Schedule exam reminder notifications
export function scheduleExamNotifications(
  exams: Array<{ date: string; subject: string }>
): string[] {
  const ids: string[] = [];
  const now = new Date();

  exams.forEach((exam) => {
    const examDate = new Date(exam.date + "T09:00:00");
    const daysUntil = Math.floor((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Schedule notifications for 7, 3, 1, and 0 days before
    [7, 3, 1, 0].forEach((daysBefore) => {
      if (daysUntil === daysBefore) {
        const notificationTime = new Date();
        notificationTime.setHours(8, 0, 0, 0); // 8 AM notification
        
        if (notificationTime.getTime() > Date.now()) {
          const id = scheduleNotification({
            id: `exam-${exam.date}-${exam.subject}-${daysBefore}`,
            title: daysBefore === 0 ? "📝 Exam Today!" : `📅 Exam in ${daysBefore} day${daysBefore > 1 ? "s" : ""}`,
            body: `${exam.subject} ${daysBefore === 0 ? "is today. Good luck!" : `exam is coming up. Keep studying!`}`,
            scheduledTime: notificationTime.getTime(),
            type: "exam_alert",
            data: { subject: exam.subject, date: exam.date, url: "/dashboard/calendar" },
          });
          ids.push(id);
        }
      }
    });
  });

  return ids;
}

// Schedule revision reminder
export function scheduleRevisionNotification(
  subject: string,
  chapter: string,
  revisionDate: string
): string {
  const notificationTime = new Date(revisionDate + "T10:00:00"); // 10 AM
  
  return scheduleNotification({
    id: `revision-${subject}-${chapter}-${revisionDate}`,
    title: "🔄 Revision Due",
    body: `Time to revise ${chapter} (${subject})`,
    scheduledTime: notificationTime.getTime(),
    type: "revision_due",
    data: { subject, chapter, url: "/dashboard/subjects" },
  });
}
