"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { useStore } from "@/store/use-store";
import { capture } from "@/lib/analytics";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { usePushNotifications } from "@/hooks/use-push-notifications";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const onboarded = useStore((s) => s.onboarded);
  const hydrated = useStore((s) => s._hydrated);
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Initialize push notifications
  usePushNotifications();

  const showCoachBanner = pathname !== "/dashboard/coach" && pathname !== "/dashboard/settings";

  useEffect(() => {
    if (loading || !hydrated) return;
    if (!user) router.replace("/login");
    else if (!onboarded) router.replace("/onboarding");
  }, [user, loading, onboarded, hydrated, router]);

  if (loading || !hydrated || !user || !onboarded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="w-10 h-10 border-3 border-solid rounded-full animate-spin" style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg)" }}>
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {showCoachBanner && (
            <Link href="/dashboard/coach" onClick={() => capture("coach_banner_clicked", { page: pathname })}>
              <div
                className="mb-4 rounded-lg px-4 py-2.5 flex items-center gap-3 cursor-pointer transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #7b61ff, #1a73e8)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" className="shrink-0">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span className="text-xs font-semibold text-white">AI Study Coach — Get personalized help free!</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" className="shrink-0 ml-auto">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </Link>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
