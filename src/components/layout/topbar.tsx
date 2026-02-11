"use client";

import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { SECTION_TITLES } from "@/lib/constants";
import { ProfileDropdown } from "./profile-dropdown";
import { NotificationCenter } from "./notification-center";
import { useNotifications } from "@/store/use-notifications";

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const unreadCount = useNotifications((s) => s.unreadCount());

  const section = pathname.split("/").pop() || "dashboard";
  const title = SECTION_TITLES[section] || "Dashboard";

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6 h-14 shrink-0"
      style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)", backdropFilter: "blur(8px)" }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg hover:opacity-80"
          style={{ color: "var(--text)" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold" style={{ color: "var(--text)" }}>{title}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="p-2 rounded-lg hover:opacity-80 relative"
            style={{ color: "var(--text-secondary)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center" style={{ background: "var(--danger)" }}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          {notifOpen && <NotificationCenter onClose={() => setNotifOpen(false)} />}
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="p-1.5 rounded-lg hover:opacity-80"
            style={{ color: "var(--text-secondary)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
          {profileOpen && <ProfileDropdown onClose={() => setProfileOpen(false)} />}
        </div>
      </div>
    </header>
  );
}
