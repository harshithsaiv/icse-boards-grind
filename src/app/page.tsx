"use client";

import { useAuth } from "@/providers/auth-provider";
import { useStore } from "@/store/use-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, loading } = useAuth();
  const onboarded = useStore((s) => s.onboarded);
  const hydrated = useStore((s) => s._hydrated);
  const router = useRouter();

  useEffect(() => {
    if (loading || !hydrated) return;
    if (!user) {
      router.replace("/login");
    } else if (!onboarded) {
      router.replace("/onboarding");
    } else {
      router.replace("/dashboard");
    }
  }, [user, loading, onboarded, hydrated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-solid rounded-full animate-spin" style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }} />
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Loading...</p>
      </div>
    </div>
  );
}
