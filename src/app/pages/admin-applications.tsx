import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import {
  Loader2,
  LogOut,
  ArrowLeft,
  Phone,
  Mail,
  ExternalLink,
  Search,
  User,
  Trash2,
} from "lucide-react";
import { supabase, apiFetchAuth } from "../../utils/supabase-client";

// ── Types ────────────────────────────────────────────────────────────────────

type Status = "pending" | "reviewing" | "accepted" | "rejected";

interface Application {
  id: string;
  name: string;
  studentId: string;
  major: string;
  phone: string;
  email: string;
  team: string;
  motivation: string;
  experience?: string;
  portfolio?: string;
  status: Status;
  submittedAt: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_META: Record<Status, { label: string; color: string; bg: string; symbol: string }> = {
  pending:   { label: "대기중",  color: "text-muted-foreground", bg: "bg-muted/60",          symbol: "—"  },
  reviewing: { label: "검토중",  color: "text-yellow-400",       bg: "bg-yellow-400/10",     symbol: "△"  },
  accepted:  { label: "합격",    color: "text-emerald-400",      bg: "bg-emerald-400/10",    symbol: "○"  },
  rejected:  { label: "불합격",  color: "text-red-400",          bg: "bg-red-400/10",        symbol: "×"  },
};

const TEAM_COLORS: Record<string, string> = {
  Leaders:    "bg-violet-500/20 text-violet-300",
  Education:  "bg-blue-500/20   text-blue-300",
  Operations: "bg-cyan-500/20   text-cyan-300",
  Growth:     "bg-amber-500/20  text-amber-300",
};

const AVATAR_BG = [
  "bg-violet-600", "bg-blue-600", "bg-indigo-600",
  "bg-cyan-600",   "bg-teal-600", "bg-emerald-600",
];

function avatarBg(index: number) {
  return AVATAR_BG[index % AVATAR_BG.length];
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const ymd = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  const hm  = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  return { ymd, hm };
}

// ── Main Component ────────────────────────────────────────────────────────────

export function AdminApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Application | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [teamFilter, setTeamFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(false);

  // ── Auth check ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const check = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) { navigate("/admin/login"); return; }
      fetchApplications();
    };
    check();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!s) navigate("/admin/login");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  // ── Fetch ───────────────────────────────────────────────────────────────────
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await apiFetchAuth("/applications");
      const data = await res.json();
      const sorted = (data.applications || []).sort(
        (a: Application, b: Application) =>
          new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
      );
      setApplications(sorted);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // ── Status update ───────────────────────────────────────────────────────────
  const updateStatus = async (id: string, status: Status) => {
    setUpdating(true);
    try {
      const res = await apiFetchAuth(`/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      setApplications(prev =>
        prev.map(a => a.id === id ? { ...a, status } : a)
      );
      setSelected(prev => prev?.id === id ? { ...prev, status } : prev);
    } catch {
      alert("상태 변경에 실패했습니다.");
    } finally {
      setUpdating(false);
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const deleteApplication = async (id: string) => {
    if (!confirm("지원서를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) return;
    try {
      const res = await apiFetchAuth(`/applications/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setApplications(prev => prev.filter(a => a.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch {
      alert("삭제에 실패했습니다.");
    }
  };

  // ── Filtered list ───────────────────────────────────────────────────────────
  const filtered = applications.filter(a => {
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (teamFilter !== "all" && a.team !== teamFilter) return false;
    if (search && !a.name.includes(search) && !a.major.includes(search)) return false;
    return true;
  });

  // ── Counts ──────────────────────────────────────────────────────────────────
  const counts = {
    total:     applications.length,
    accepted:  applications.filter(a => a.status === "accepted").length,
    reviewing: applications.filter(a => a.status === "reviewing").length,
    rejected:  applications.filter(a => a.status === "rejected").length,
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">

      {/* ── Top bar ──────────────────────────────────────────────────────────── */}
      <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/dashboard"
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Recruiter Dashboard
            </p>
            <h1 className="text-xl font-bold leading-tight">지원서 검토</h1>
          </div>
        </div>

        {/* Stats badges */}
        <div className="flex items-center gap-2">
          <StatBadge label="전체" count={counts.total} active={statusFilter === "all"} onClick={() => setStatusFilter("all")} color="text-foreground" />
          <StatBadge label="합격" count={counts.accepted} active={statusFilter === "accepted"} onClick={() => setStatusFilter("accepted")} color="text-emerald-400" />
          <StatBadge label="보류" count={counts.reviewing} active={statusFilter === "reviewing"} onClick={() => setStatusFilter("reviewing")} color="text-yellow-400" />
          <StatBadge label="불합격" count={counts.rejected} active={statusFilter === "rejected"} onClick={() => setStatusFilter("rejected")} color="text-red-400" />
          <button
            onClick={handleLogout}
            className="ml-2 p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* ── Filter bar ────────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 flex items-center gap-3 px-6 py-3 border-b border-border bg-background/50">
        {/* Search */}
        <div className="relative w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="이름 또는 학과 검색"
            className="w-full pl-9 pr-3 py-2 text-xs bg-muted/40 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/40"
          />
        </div>

        {/* Team filter */}
        <div className="flex items-center gap-1">
          {["all", "Leaders", "Education", "Operations", "Growth"].map(t => (
            <button
              key={t}
              onClick={() => setTeamFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                teamFilter === t
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              {t === "all" ? "전체 팀" : t}
            </button>
          ))}
        </div>

        <div className="ml-auto text-xs text-muted-foreground">
          {filtered.length}명 표시
        </div>
      </div>

      {/* ── Split panel ───────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left: applicant list */}
        <div className="w-[420px] flex-shrink-0 overflow-y-auto border-r border-border">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
              <User className="h-10 w-10 opacity-20" />
              <p className="text-sm">지원자가 없습니다</p>
            </div>
          ) : (
            <ul className="p-3 space-y-2">
              {filtered.map((app, i) => {
                const { ymd, hm } = formatDate(app.submittedAt);
                const meta = STATUS_META[app.status];
                const isSelected = selected?.id === app.id;
                return (
                  <li key={app.id}>
                    <button
                      onClick={() => setSelected(app)}
                      className={`w-full text-left rounded-xl p-4 transition-all border ${
                        isSelected
                          ? "bg-primary/5 border-primary/40"
                          : "bg-card border-border hover:border-border/80 hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Index */}
                        <span className="text-xs text-muted-foreground/50 w-5 flex-shrink-0 text-center font-mono">
                          {String(i + 1).padStart(2, "0")}
                        </span>

                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${avatarBg(i)}`}>
                          {app.name.charAt(0)}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-semibold text-sm truncate">{app.name}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium flex-shrink-0 ${TEAM_COLORS[app.team] ?? "bg-muted text-muted-foreground"}`}>
                              {app.team}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{app.major}</p>
                          <p className="text-xs text-muted-foreground/50 mt-1">{ymd} {hm}</p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
                          <ActionBtn
                            symbol="○"
                            active={app.status === "accepted"}
                            activeClass="text-emerald-400 bg-emerald-400/15"
                            title="합격"
                            onClick={() => updateStatus(app.id, "accepted")}
                          />
                          <ActionBtn
                            symbol="△"
                            active={app.status === "reviewing"}
                            activeClass="text-yellow-400 bg-yellow-400/15"
                            title="검토중"
                            onClick={() => updateStatus(app.id, "reviewing")}
                          />
                          <ActionBtn
                            symbol="×"
                            active={app.status === "rejected"}
                            activeClass="text-red-400 bg-red-400/15"
                            title="불합격"
                            onClick={() => updateStatus(app.id, "rejected")}
                          />
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Right: detail panel */}
        <div className="flex-1 overflow-y-auto">
          {selected ? (
            <DetailPanel
              app={applications.find(a => a.id === selected.id) ?? selected}
              onStatusChange={updateStatus}
              onDelete={deleteApplication}
              updating={updating}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <span className="text-3xl opacity-20">←</span>
              <p className="text-sm">지원자 카드를 선택하면</p>
              <p className="text-sm">지원서를 확인할 수 있어요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatBadge({
  label, count, active, onClick, color,
}: {
  label: string; count: number; active: boolean; onClick: () => void; color: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
        active ? "border-border bg-muted/60" : "border-transparent hover:border-border hover:bg-muted/30"
      }`}
    >
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-bold tabular-nums ${color}`}>{count}</span>
    </button>
  );
}

function ActionBtn({
  symbol, active, activeClass, title, onClick,
}: {
  symbol: string; active: boolean; activeClass: string; title: string; onClick: () => void;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${
        active
          ? activeClass
          : "text-muted-foreground/30 hover:text-muted-foreground hover:bg-muted/60"
      }`}
    >
      {symbol}
    </button>
  );
}

function DetailPanel({
  app,
  onStatusChange,
  onDelete,
  updating,
}: {
  app: Application;
  onStatusChange: (id: string, status: Status) => void;
  onDelete: (id: string) => void;
  updating: boolean;
}) {
  const { ymd, hm } = formatDate(app.submittedAt);
  const meta = STATUS_META[app.status];

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold">{app.name}</h2>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${meta.bg} ${meta.color}`}>
              {meta.symbol} {meta.label}
            </span>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${TEAM_COLORS[app.team] ?? "bg-muted text-muted-foreground"}`}>
              {app.team}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            제출일시: {ymd} {hm}
          </p>
        </div>
        <button
          onClick={() => onDelete(app.id)}
          className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors"
          title="지원서 삭제"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Basic info grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <InfoCell label="학번" value={app.studentId} />
        <InfoCell label="학과" value={app.major} />
        <InfoCell
          label="연락처"
          value={app.phone}
          icon={<Phone className="h-3.5 w-3.5" />}
        />
        <InfoCell
          label="이메일"
          value={app.email}
          icon={<Mail className="h-3.5 w-3.5" />}
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-border mb-8" />

      {/* Q&A */}
      <div className="space-y-6">
        <QABlock
          q="지원 동기"
          a={app.motivation}
        />
        {app.experience && (
          <QABlock
            q="관련 경험"
            a={app.experience}
          />
        )}
        {app.portfolio && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              포트폴리오
            </p>
            <a
              href={app.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {app.portfolio}
            </a>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-border my-8" />

      {/* Status actions */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          상태 변경
        </p>
        <div className="flex gap-2">
          {(["reviewing", "accepted", "rejected"] as const).map(s => {
            const m = STATUS_META[s];
            const isActive = app.status === s;
            return (
              <button
                key={s}
                disabled={updating || isActive}
                onClick={() => onStatusChange(app.id, s)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                  isActive
                    ? `${m.bg} ${m.color} border-current opacity-100`
                    : "border-border text-muted-foreground hover:border-border/80 hover:bg-muted/40 disabled:opacity-40"
                }`}
              >
                {m.symbol} {m.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function InfoCell({
  label, value, icon,
}: {
  label: string; value: string; icon?: React.ReactNode;
}) {
  return (
    <div className="p-4 bg-card border border-border rounded-xl">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-medium flex items-center gap-2">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        {value}
      </p>
    </div>
  );
}

function QABlock({ q, a }: { q: string; a: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        {q}
      </p>
      <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap bg-muted/30 border border-border rounded-xl p-4">
        {a}
      </p>
    </div>
  );
}
