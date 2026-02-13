"use client";

import { useState, useEffect } from "react";
import posthog from "posthog-js";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/use-store";
import { motion, AnimatePresence } from "framer-motion";
import { friendlyAuthError } from "@/lib/utils";
import { FirebaseError } from "firebase/app";

export default function LoginPage() {
  const { user, login, loginWithGoogle, register } = useAuth();
  const onboarded = useStore((s) => s.onboarded);
  const setField = useStore((s) => s.setField);
  const router = useRouter();

  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Force dark theme on login page
  useEffect(() => {
    setField("theme", "dark");
  }, [setField]);

  useEffect(() => {
    if (user) {
      router.replace(onboarded ? "/dashboard" : "/onboarding");
    }
  }, [user, onboarded, router]);

  if (user) {
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      posthog.capture("user_logged_in", { method: "email" });
      router.replace("/dashboard");
    } catch (err) {
      posthog.capture("login_failed", { method: "email", error: (err as FirebaseError).code });
      setError(friendlyAuthError((err as FirebaseError).code));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await register(email.trim(), password);
      posthog.capture("user_registered", { method: "email" });
      router.replace("/onboarding");
    } catch (err) {
      posthog.capture("registration_failed", { method: "email", error: (err as FirebaseError).code });
      setError(friendlyAuthError((err as FirebaseError).code));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg)" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ background: "var(--primary)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>ICSE Boards Grind</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Your personal study dashboard</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-6" style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-md)" }}>
          {/* Tabs */}
          <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: "var(--bg)" }}>
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: tab === t ? "var(--bg-card)" : "transparent",
                  color: tab === t ? "var(--text)" : "var(--text-secondary)",
                  boxShadow: tab === t ? "var(--shadow)" : "none",
                }}
              >
                {t === "login" ? "Login" : "Register"}
              </button>
            ))}
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-lg text-sm"
                style={{ background: "rgba(248, 81, 73, 0.1)", color: "var(--danger)" }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={tab}
              initial={{ opacity: 0, x: tab === "login" ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: tab === "login" ? 10 : -10 }}
              transition={{ duration: 0.2 }}
              onSubmit={tab === "login" ? handleLogin : handleRegister}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={tab === "login" ? "Your password" : "Min 6 characters"}
                  required
                  minLength={6}
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
                  autoComplete={tab === "login" ? "current-password" : "new-password"}
                />
              </div>
              {tab === "register" && (
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>Confirm Password</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Confirm password"
                    required
                    minLength={6}
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                    style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
                    autoComplete="new-password"
                  />
                </div>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-60"
                style={{ background: "var(--primary)" }}
              >
                {submitting
                  ? tab === "login" ? "Signing in..." : "Creating account..."
                  : tab === "login" ? "Login" : "Create Account"
                }
              </button>
            </motion.form>
          </AnimatePresence>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>

          {/* Google Sign-In */}
          <button
            onClick={async () => {
              setError("");
              setSubmitting(true);
              try {
                await loginWithGoogle();
                posthog.capture("user_logged_in", { method: "google" });
              } catch (err) {
                posthog.capture("login_failed", { method: "google", error: (err as FirebaseError).code });
                setError(friendlyAuthError((err as FirebaseError).code));
              } finally {
                setSubmitting(false);
              }
            }}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: "var(--text-secondary)" }}>
          Cloud synced — study from any device
        </p>
      </motion.div>
    </div>
  );
}
