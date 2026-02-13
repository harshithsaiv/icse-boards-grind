"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, useRef, type ReactNode } from "react";
import { useAuth } from "@/providers/auth-provider";

export function PostHogProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const initialized = useRef(false);

  // Initialize PostHog once
  useEffect(() => {
    if (initialized.current) return;
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    if (!key || key === "phc_placeholder") return;

    posthog.init(key, {
      api_host: host || "https://us.i.posthog.com",
      capture_pageview: false, // we track manually for SPA
      capture_pageleave: true,
      autocapture: true,
      disable_session_recording: false,
      capture_exceptions: true,
    });
    initialized.current = true;
  }, []);

  // Identify / reset on auth change
  useEffect(() => {
    if (!initialized.current) return;
    if (user) {
      posthog.identify(user.uid, {
        email: user.email ?? undefined,
        name: user.displayName ?? undefined,
      });
    } else {
      posthog.reset();
    }
  }, [user]);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
