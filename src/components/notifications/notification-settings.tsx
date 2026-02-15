"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  isPushSupported,
  getNotificationPermission,
  requestNotificationPermission,
  registerServiceWorker,
  showNotification,
} from "@/lib/push-notifications";

interface NotificationPrefs {
  studyReminders: boolean;
  examAlerts: boolean;
  revisionDue: boolean;
  breakReminders: boolean;
  reminderMinutes: number;
}

interface NotificationSettingsProps {
  onClose?: () => void;
}

export function NotificationSettings({ onClose }: NotificationSettingsProps) {
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(() => {
    if (typeof window === "undefined") return "default";
    return isPushSupported() ? getNotificationPermission() : "unsupported";
  });
  const [isSupported] = useState(() => {
    if (typeof window === "undefined") return false;
    return isPushSupported();
  });
  const [isLoading, setIsLoading] = useState(false);
  const [swRegistered, setSwRegistered] = useState(false);

  // Notification preferences
  const [prefs, setPrefs] = useState<NotificationPrefs>(() => {
    const defaultPrefs: NotificationPrefs = {
      studyReminders: true,
      examAlerts: true,
      revisionDue: true,
      breakReminders: true,
      reminderMinutes: 5,
    };
    if (typeof localStorage === "undefined") {
      return defaultPrefs;
    }
    const saved = localStorage.getItem("notification-prefs");
    if (saved) {
      try {
        return JSON.parse(saved) as NotificationPrefs;
      } catch {
        // ignore
      }
    }
    return defaultPrefs;
  });

  useEffect(() => {
    // Check if SW is registered
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        setSwRegistered(!!reg);
      });
    }
  }, []);

  const handleEnableNotifications = async () => {
    setIsLoading(true);
    
    // Register service worker first
    const registration = await registerServiceWorker();
    setSwRegistered(!!registration);
    
    // Request permission
    const perm = await requestNotificationPermission();
    setPermission(perm);
    
    if (perm === "granted") {
      // Show a test notification
      await showNotification("Notifications Enabled! 🎉", {
        body: "You'll now receive study reminders and exam alerts.",
        tag: "setup-complete",
      });
    }
    
    setIsLoading(false);
  };

  const handleTestNotification = async () => {
    await showNotification("Test Notification 📚", {
      body: "This is how your study reminders will look!",
      tag: "test",
    });
  };

  const handleSavePrefs = () => {
    localStorage.setItem("notification-prefs", JSON.stringify(prefs));
    onClose?.();
  };

  const updatePref = <K extends keyof typeof prefs>(key: K, value: typeof prefs[K]) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  };

  if (!isSupported) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="text-4xl mb-4">😕</div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text)" }}>
            Notifications Not Supported
          </h3>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Your browser doesn&apos;t support push notifications. Try using Chrome, Edge, or Firefox on desktop,
            or add this app to your home screen on mobile.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1" style={{ color: "var(--text)" }}>
          🔔 Push Notifications
        </h3>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Get reminders for study sessions, exams, and revisions
        </p>
      </div>

      {/* Permission Status */}
      <div
        className="p-4 rounded-lg flex items-center gap-4"
        style={{
          background: permission === "granted" ? "var(--success-light)" : "var(--bg-secondary)",
        }}
      >
        <div className="text-2xl">
          {permission === "granted" ? "✅" : permission === "denied" ? "🚫" : "🔔"}
        </div>
        <div className="flex-1">
          <p className="font-medium" style={{ color: "var(--text)" }}>
            {permission === "granted"
              ? "Notifications Enabled"
              : permission === "denied"
              ? "Notifications Blocked"
              : "Notifications Not Enabled"}
          </p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {permission === "granted"
              ? "You'll receive study reminders"
              : permission === "denied"
              ? "Please enable in browser settings"
              : "Enable to get study reminders"}
          </p>
        </div>
        {permission !== "granted" && permission !== "denied" && (
          <Button onClick={handleEnableNotifications} disabled={isLoading}>
            {isLoading ? "Enabling..." : "Enable"}
          </Button>
        )}
        {permission === "granted" && (
          <Button variant="secondary" onClick={handleTestNotification}>
            Test
          </Button>
        )}
      </div>

      {/* Notification Preferences */}
      <AnimatePresence>
        {permission === "granted" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <h4 className="font-medium" style={{ color: "var(--text)" }}>
              Notification Types
            </h4>

            {[
              { key: "studyReminders", label: "Study Session Reminders", emoji: "📚" },
              { key: "examAlerts", label: "Exam Alerts", emoji: "📝" },
              { key: "revisionDue", label: "Revision Due", emoji: "🔄" },
              { key: "breakReminders", label: "Break Reminders", emoji: "☕" },
            ].map(({ key, label, emoji }) => (
              <label
                key={key}
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-opacity-50"
                style={{ background: "var(--bg-secondary)" }}
              >
                <span className="text-lg">{emoji}</span>
                <span className="flex-1" style={{ color: "var(--text)" }}>
                  {label}
                </span>
                <input
                  type="checkbox"
                  checked={prefs[key as keyof typeof prefs] as boolean}
                  onChange={(e) => updatePref(key as keyof typeof prefs, e.target.checked)}
                  className="w-5 h-5 rounded accent-blue-500"
                />
              </label>
            ))}

            <div className="pt-2">
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--text)" }}>
                Remind me before sessions
              </label>
              <select
                value={prefs.reminderMinutes}
                onChange={(e) => updatePref("reminderMinutes", Number(e.target.value))}
                className="w-full p-3 rounded-lg border"
                style={{
                  background: "var(--bg-secondary)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                }}
              >
                <option value={5}>5 minutes before</option>
                <option value={10}>10 minutes before</option>
                <option value={15}>15 minutes before</option>
                <option value={30}>30 minutes before</option>
              </select>
            </div>

            <div className="pt-4 flex gap-3">
              <Button onClick={handleSavePrefs} className="flex-1">
                Save Preferences
              </Button>
              {onClose && (
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Service Worker Status */}
      <div className="text-xs pt-2" style={{ color: "var(--text-secondary)" }}>
        Service Worker: {swRegistered ? "✓ Registered" : "Not registered"}
      </div>
    </Card>
  );
}
