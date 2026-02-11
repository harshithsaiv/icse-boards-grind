"use client";

import { useAuth } from "@/providers/auth-provider";
import { useStore } from "@/store/use-store";
import Link from "next/link";

interface Props {
  onClose: () => void;
}

export function ProfileDropdown({ onClose }: Props) {
  const { logout } = useAuth();
  const theme = useStore((s) => s.theme);
  const setField = useStore((s) => s.setField);
  const name = useStore((s) => s.name) || "Student";

  const toggleTheme = () => {
    setField("theme", theme === "light" ? "dark" : "light");
  };

  return (
    <div
      className="absolute right-0 top-full mt-2 w-56 rounded-xl py-1 z-50"
      style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-md)", border: "1px solid var(--border)" }}
    >
      <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{name}</p>
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>ICSE 2026 Boards</p>
      </div>

      <button
        onClick={() => { toggleTheme(); onClose(); }}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:opacity-80"
        style={{ color: "var(--text)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {theme === "light" ? (
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          ) : (
            <>
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </>
          )}
        </svg>
        {theme === "light" ? "Dark Mode" : "Light Mode"}
      </button>

      <Link
        href="/dashboard/settings"
        onClick={onClose}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:opacity-80"
        style={{ color: "var(--text)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9c.2.65.77 1.09 1.46 1.11H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
        Settings
      </Link>

      <div className="border-t my-1" style={{ borderColor: "var(--border)" }} />

      <button
        onClick={async () => { onClose(); await logout(); }}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:opacity-80"
        style={{ color: "var(--danger)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Sign Out
      </button>
    </div>
  );
}
