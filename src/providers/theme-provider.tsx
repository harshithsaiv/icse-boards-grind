"use client";

import { useEffect } from "react";
import { useStore } from "@/store/use-store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useStore((s) => s.theme);
  const hydrated = useStore((s) => s._hydrated);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme, hydrated]);

  return <>{children}</>;
}
