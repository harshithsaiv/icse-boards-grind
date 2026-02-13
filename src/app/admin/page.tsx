"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useStore } from "@/store/use-store";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from "recharts";
import {
  type AdminUser,
  computeTopStats, computeDAU, computeStudyHoursTrend,
  computeLanguageDistribution, computeElectiveDistribution,
  computeLearningStyleDist, computePrepLevelDist,
  computeStreakDist, computeChapterCompletion,
  getUserTotalHours, getUserChaptersDone, getUserTotalChapters,
} from "@/lib/admin-utils";
import { SECOND_LANGUAGES, ELECTIVES } from "@/lib/constants";

const ADMIN_EMAILS = [
  "prajwalbm40@gmail.com",
  "rameshprajwal2001@gmail.com",
  "harshithsaiv2306@gmail.com",
];
const PAGE_SIZE = 20;
const PIE_COLORS = ["#7b61ff", "#ea4335", "#1a73e8", "#f9ab00", "#12b5cb", "#34a853", "#d93025", "#ff6b35", "#e040fb", "#9c27b0"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pieLabel = (props: any) => `${props.name ?? ""} ${((props.percent ?? 0) * 100).toFixed(0)}%`;

type SortKey = "name" | "email" | "streak" | "hours" | "chapters" | "target" | "prepLevel" | "lastActive" | "language" | "elective";
type SortDir = "asc" | "desc";

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const setField = useStore((s) => s.setField);
  const router = useRouter();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Table state
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("streak");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);

  // Modal state
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Force dark theme
  useEffect(() => {
    setField("theme", "dark");
  }, [setField]);

  const isAdmin = !!user?.email && ADMIN_EMAILS.includes(user.email);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const snap = await getDocs(collection(db, "users"));
      const list: AdminUser[] = snap.docs.map((d) => ({
        uid: d.id,
        ...d.data(),
      })) as AdminUser[];
      setUsers(list);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin, fetchUsers]);

  // Compute analytics
  const stats = useMemo(() => computeTopStats(users), [users]);
  const dauData = useMemo(() => computeDAU(users), [users]);
  const hoursTrend = useMemo(() => computeStudyHoursTrend(users), [users]);
  const langDist = useMemo(() => computeLanguageDistribution(users), [users]);
  const electiveDist = useMemo(() => computeElectiveDistribution(users), [users]);
  const learnStyleDist = useMemo(() => computeLearningStyleDist(users), [users]);
  const prepLevelDist = useMemo(() => computePrepLevelDist(users), [users]);
  const streakDist = useMemo(() => computeStreakDist(users), [users]);
  const chapterComp = useMemo(() => computeChapterCompletion(users), [users]);

  // Table filtering, sorting, pagination
  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      if (!q) return true;
      const name = (u.name || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [users, search]);

  const sortedUsers = useMemo(() => {
    const langMap: Record<string, string> = {};
    for (const l of SECOND_LANGUAGES) langMap[l.key] = l.name;
    const electiveMap: Record<string, string> = {};
    for (const e of ELECTIVES) electiveMap[e.key] = e.name;

    const arr = [...filteredUsers];
    arr.sort((a, b) => {
      let av: string | number = 0;
      let bv: string | number = 0;
      switch (sortKey) {
        case "name": av = (a.name || "").toLowerCase(); bv = (b.name || "").toLowerCase(); break;
        case "email": av = (a.email || "").toLowerCase(); bv = (b.email || "").toLowerCase(); break;
        case "streak": av = a.streak || 0; bv = b.streak || 0; break;
        case "hours": av = getUserTotalHours(a); bv = getUserTotalHours(b); break;
        case "chapters": av = getUserChaptersDone(a); bv = getUserChaptersDone(b); break;
        case "target": av = a.targetPercent || 0; bv = b.targetPercent || 0; break;
        case "prepLevel": av = a.prepLevel || ""; bv = b.prepLevel || ""; break;
        case "lastActive": av = a.lastStudyDate || ""; bv = b.lastStudyDate || ""; break;
        case "language": av = langMap[a.selectedLanguage || ""] || ""; bv = langMap[b.selectedLanguage || ""] || ""; break;
        case "elective": av = electiveMap[a.selectedElective || ""] || ""; bv = electiveMap[b.selectedElective || ""] || ""; break;
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filteredUsers, sortKey, sortDir]);

  const pagedUsers = useMemo(() => {
    const start = page * PAGE_SIZE;
    return sortedUsers.slice(start, start + PAGE_SIZE);
  }, [sortedUsers, page]);

  const totalPages = Math.ceil(sortedUsers.length / PAGE_SIZE);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(0);
  };

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return "";
    return sortDir === "asc" ? " \u25B2" : " \u25BC";
  };

  // Auth guard
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)", color: "var(--text)" }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "var(--bg)", color: "var(--text)" }}>
        <div className="text-5xl">403</div>
        <h1 className="text-xl font-bold">Access Denied</h1>
        <p style={{ color: "var(--text-secondary)" }}>You do not have permission to view this page.</p>
        <Button onClick={() => router.push("/")}>Back to Home</Button>
      </div>
    );
  }

  const prepLabels: Record<string, string> = {
    just_started: "Just Started",
    somewhat: "Somewhat",
    mostly_done: "Mostly Done",
  };
  const langMap: Record<string, string> = {};
  for (const l of SECOND_LANGUAGES) langMap[l.key] = l.name;
  const electiveMap: Record<string, string> = {};
  for (const e of ELECTIVES) electiveMap[e.key] = e.name;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 py-3 flex items-center justify-between gap-3 backdrop-blur-lg" style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
        <h1 className="text-lg font-bold truncate">Admin Analytics Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={fetchUsers} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => router.push("/")}>
            Back
          </Button>
        </div>
      </div>

      {error && (
        <div className="mx-4 mt-3 p-3 rounded-lg text-sm" style={{ background: "rgba(234,67,53,0.15)", color: "#ea4335" }}>
          {error}
        </div>
      )}

      <div className="p-4 space-y-6 max-w-7xl mx-auto">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatCard label="Total Users" value={stats.totalUsers} />
          <StatCard label="Onboarded" value={`${stats.onboardedUsers}/${stats.totalUsers}`} />
          <StatCard label="Active Today" value={stats.activeToday} />
          <StatCard label="Active This Week" value={stats.activeThisWeek} />
          <StatCard label="Avg Streak" value={`${stats.avgStreak} days`} />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* DAU Chart */}
          <Card>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>Daily Active Users (30d)</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dauData}>
                  <defs>
                    <linearGradient id="dauGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7b61ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7b61ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)" }} />
                  <Area type="monotone" dataKey="count" stroke="#7b61ff" fill="url(#dauGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Study Hours Trend */}
          <Card>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>Total Study Hours / Day (30d)</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hoursTrend}>
                  <defs>
                    <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1a73e8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1a73e8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)" }} />
                  <Area type="monotone" dataKey="hours" stroke="#1a73e8" fill="url(#hoursGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Language Distribution */}
          <Card>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>Language Distribution</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={langDist} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={pieLabel} labelLine={false} fontSize={11}>
                    {langDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Elective Distribution */}
          <Card>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>Elective Distribution</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={electiveDist} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={pieLabel} labelLine={false} fontSize={11}>
                    {electiveDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Learning Style Distribution */}
          <Card>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>Learning Style Distribution</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={learnStyleDist} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={pieLabel} labelLine={false} fontSize={11}>
                    {learnStyleDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Prep Level Distribution */}
          <Card>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>Prep Level Distribution</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prepLevelDist}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)" }} />
                  <Bar dataKey="count" fill="#7b61ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Streak Distribution */}
          <Card>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>Streak Distribution</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={streakDist}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="range" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)" }} />
                  <Bar dataKey="count" fill="#ea4335" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Chapter Completion by Subject */}
          <Card className="lg:col-span-2">
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>Avg Chapter Completion by Subject (%)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chapterComp} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <YAxis dataKey="subject" type="category" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} width={100} />
                  <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)" }} />
                  <Bar dataKey="avgPct" fill="#1a73e8" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* User Table */}
        <Card>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
              Users ({filteredUsers.length})
            </h3>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="px-3 py-1.5 rounded-lg text-sm w-full sm:w-64 outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {([
                    ["name", "Name"],
                    ["email", "Email"],
                    ["streak", "Streak"],
                    ["hours", "Hours"],
                    ["chapters", "Ch. Done"],
                    ["target", "Target %"],
                    ["prepLevel", "Prep"],
                    ["lastActive", "Last Active"],
                    ["language", "Language"],
                    ["elective", "Elective"],
                  ] as [SortKey, string][]).map(([key, label]) => (
                    <th
                      key={key}
                      className="text-left py-2 px-2 cursor-pointer select-none whitespace-nowrap"
                      style={{ color: "var(--text-secondary)" }}
                      onClick={() => handleSort(key)}
                    >
                      {label}{sortIcon(key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagedUsers.map((u) => (
                  <tr
                    key={u.uid}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ borderBottom: "1px solid var(--border)" }}
                    onClick={() => setSelectedUser(u)}
                  >
                    <td className="py-2 px-2 whitespace-nowrap">{u.name || "N/A"}</td>
                    <td className="py-2 px-2 whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>{u.email || "N/A"}</td>
                    <td className="py-2 px-2">{u.streak || 0}</td>
                    <td className="py-2 px-2">{Math.round(getUserTotalHours(u) * 10) / 10}</td>
                    <td className="py-2 px-2">{getUserChaptersDone(u)}</td>
                    <td className="py-2 px-2">{u.targetPercent || 0}%</td>
                    <td className="py-2 px-2 whitespace-nowrap">{prepLabels[u.prepLevel || ""] || "N/A"}</td>
                    <td className="py-2 px-2 whitespace-nowrap">{u.lastStudyDate || "Never"}</td>
                    <td className="py-2 px-2 whitespace-nowrap">{langMap[u.selectedLanguage || ""] || "N/A"}</td>
                    <td className="py-2 px-2 whitespace-nowrap">{electiveMap[u.selectedElective || ""] || "N/A"}</td>
                  </tr>
                ))}
                {pagedUsers.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-8 text-center" style={{ color: "var(--text-secondary)" }}>
                      {loading ? "Loading users..." : "No users found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
              <Button size="sm" variant="secondary" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                Page {page + 1} of {totalPages}
              </span>
              <Button size="sm" variant="secondary" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          )}
        </Card>

        {/* Firestore Rules Reminder */}
        <Card>
          <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>Firestore Rules Reminder</h3>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Ensure your Firestore security rules allow admin read access. Add this rule:
          </p>
          <pre className="mt-2 p-3 rounded-lg text-xs overflow-x-auto" style={{ background: "var(--bg)", color: "var(--text-secondary)" }}>
{`match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
  allow read: if request.auth != null && request.auth.token.email in [
    "prajwalbm40@gmail.com",
    "rameshprajwal2001@gmail.com",
    "harshithsaiv2306@gmail.com"
  ];
}`}
          </pre>
        </Card>
      </div>

      {/* User Detail Modal */}
      <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </Card>
  );
}

function UserDetailModal({ user, onClose }: { user: AdminUser | null; onClose: () => void }) {
  if (!user) return null;

  const langMap: Record<string, string> = {};
  for (const l of SECOND_LANGUAGES) langMap[l.key] = l.name;
  const electiveMap: Record<string, string> = {};
  for (const e of ELECTIVES) electiveMap[e.key] = e.name;

  const prepLabels: Record<string, string> = {
    just_started: "Just Started",
    somewhat: "Somewhat Prepared",
    mostly_done: "Mostly Done",
  };

  const subjectLabels: Record<string, string> = {
    english_lang: "English Language",
    english_lit: "English Literature",
    math: "Mathematics",
    physics: "Physics",
    chemistry: "Chemistry",
    biology: "Biology",
    history: "History & Civics",
    geography: "Geography",
  };
  for (const l of SECOND_LANGUAGES) subjectLabels[l.key] = l.name;
  for (const e of ELECTIVES) subjectLabels[e.key] = e.name;

  const totalHours = getUserTotalHours(user);
  const chaptersDone = getUserChaptersDone(user);
  const totalChapters = getUserTotalChapters(user);

  return (
    <Modal open={!!user} onClose={onClose} title={user.name || "User Details"}>
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        {/* Basic Info */}
        <div className="space-y-1 text-sm">
          <Row label="Email" value={user.email || "N/A"} />
          <Row label="UID" value={user.uid} mono />
          <Row label="Onboarded" value={user.onboarded ? "Yes" : "No"} />
          <Row label="Streak" value={`${user.streak || 0} days`} />
          <Row label="Last Active" value={user.lastStudyDate || "Never"} />
          <Row label="Total Hours" value={`${Math.round(totalHours * 10) / 10}h`} />
          <Row label="Chapters" value={`${chaptersDone}/${totalChapters}`} />
          <Row label="Target" value={`${user.targetPercent || 0}%`} />
          <Row label="Prep Level" value={prepLabels[user.prepLevel || ""] || "N/A"} />
          <Row label="Learning Style" value={user.learningStyle || "N/A"} />
          <Row label="Language" value={langMap[user.selectedLanguage || ""] || "N/A"} />
          <Row label="Elective" value={electiveMap[user.selectedElective || ""] || "N/A"} />
          <Row label="API Key" value={user.grokApiKey ? "Yes" : "No"} />
        </div>

        {/* Routine */}
        {user.routine && (
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>Routine</p>
            <div className="grid grid-cols-3 gap-1 text-xs">
              {Object.entries(user.routine).map(([k, v]) => (
                <div key={k}>
                  <span style={{ color: "var(--text-secondary)" }}>{k}: </span>{v}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subject Progress */}
        {user.subjects && (
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>Subject Progress</p>
            <div className="space-y-2">
              {Object.entries(user.subjects)
                .filter(([, chapters]) => chapters && chapters.length > 0)
                .map(([key, chapters]) => {
                  const done = chapters.filter((c) => c.status === "completed").length;
                  const pct = Math.round((done / chapters.length) * 100);
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>{subjectLabels[key] || key}</span>
                        <span style={{ color: "var(--text-secondary)" }}>{done}/{chapters.length} ({pct}%)</span>
                      </div>
                      <ProgressBar value={pct} height={4} />
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{label}</span>
      <span className={`text-xs text-right ${mono ? "font-mono" : ""}`} style={{ wordBreak: "break-all" }}>{value}</span>
    </div>
  );
}
