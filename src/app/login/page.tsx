"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/use-store";
import { motion, AnimatePresence } from "framer-motion";
import { friendlyAuthError } from "@/lib/utils";
import { FirebaseError } from "firebase/app";

export default function LoginPage() {
  const { user, login, register } = useAuth();
  const onboarded = useStore((s) => s.onboarded);
  const router = useRouter();

  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      router.replace("/dashboard");
    } catch (err) {
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
      router.replace("/onboarding");
    } catch (err) {
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
                style={{ background: "#fef2f2", color: "var(--danger)" }}
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
        </div>

        <p className="text-center text-xs mt-4" style={{ color: "var(--text-secondary)" }}>
          Cloud synced — study from any device
        </p>
      </motion.div>
    </div>
  );
}
