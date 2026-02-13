import posthog from "posthog-js";

let initialized = false;

export function initPostHog() {
  if (initialized || typeof window === "undefined") return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  if (!key || key === "phc_placeholder") return;

  posthog.init(key, {
    api_host: host || "https://eu.i.posthog.com",
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: true,
    disable_session_recording: false,
    capture_exceptions: true,
    debug: true,
  });
  initialized = true;
  console.log("[PostHog] Initialized with key:", key.slice(0, 10) + "...");
}

export function capture(event: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!initialized) initPostHog();
  console.log("[PostHog] capture:", event, properties);
  posthog.capture(event, properties);
}

export function identify(uid: string, traits?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!initialized) initPostHog();
  posthog.identify(uid, traits);
}

export function reset() {
  if (typeof window === "undefined") return;
  posthog.reset();
}

export { posthog };
