import { useState, useEffect } from "react";
import { Loader2, Save, RefreshCw, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { apiFetch, apiFetchAuth } from "../../utils/supabase-client";
import { DEFAULT_RECRUIT_CONFIG } from "../types/recruit-config";
import type { RecruitConfig, RecruitQuestion, RecruitBasicField } from "../types/recruit-config";

const INPUT_CLASS =
  "w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm";


export function AdminRecruitTab() {
  const [config, setConfig] = useState<RecruitConfig>(DEFAULT_RECRUIT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/recruit-config");
      const data = await res.json();
      if (data.config) {
        setConfig({ ...DEFAULT_RECRUIT_CONFIG, ...data.config });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await apiFetchAuth("/recruit-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
      alert("저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const updateBasicField = (id: string, field: keyof RecruitBasicField, value: string | boolean) => {
    setConfig((prev) => ({
      ...prev,
      basicFields: prev.basicFields.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
    }));
  };

  const addBasicField = () => {
    const newF: RecruitBasicField = {
      id: `field_${Date.now()}`,
      label: "새 항목",
      placeholder: "",
      type: "text",
      required: false,
      visible: true,
      deletable: true,
    };
    setConfig((prev) => ({ ...prev, basicFields: [...prev.basicFields, newF] }));
  };

  const deleteBasicField = (id: string) => {
    setConfig((prev) => ({ ...prev, basicFields: prev.basicFields.filter((f) => f.id !== id) }));
  };

  const updateQuestion = (id: string, field: keyof RecruitQuestion, value: string | boolean | number) => {
    setConfig((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)),
    }));
  };

  const addQuestion = () => {
    const newQ: RecruitQuestion = {
      id: `q_${Date.now()}`,
      label: "새 질문",
      placeholder: "답변을 입력해주세요.",
      required: false,
      visible: true,
      type: "textarea",
      rows: 4,
      deletable: true,
    };
    setConfig((prev) => ({ ...prev, questions: [...prev.questions, newQ] }));
  };

  const deleteQuestion = (id: string) => {
    setConfig((prev) => ({ ...prev, questions: prev.questions.filter((q) => q.id !== id) }));
  };

  const moveQuestion = (index: number, dir: -1 | 1) => {
    const next = index + dir;
    if (next < 0 || next >= config.questions.length) return;
    const qs = [...config.questions];
    [qs[index], qs[next]] = [qs[next], qs[index]];
    setConfig((prev) => ({ ...prev, questions: qs }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8 pb-12">

      {/* 기본 설정 */}
      <section>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">기본 설정</h3>
        <div className="space-y-4 p-6 bg-card border border-border rounded-xl">
          <div>
            <label className="block text-sm font-medium mb-2">기수명</label>
            <input type="text" value={config.generation}
              onChange={(e) => setConfig({ ...config, generation: e.target.value })}
              className={INPUT_CLASS} placeholder="KHUX 4기" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">페이지 소개 문구</label>
            <textarea value={config.description} rows={2}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-none"
              placeholder="UX/UI에 관심 있는 경희대학교 학생이라면 누구나 지원 가능합니다." />
          </div>
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium">지원 폼 공개</p>
              <p className="text-xs text-muted-foreground mt-0.5">비공개 시 "현재 모집 기간이 아닙니다" 표시</p>
            </div>
            <button type="button" onClick={() => setConfig({ ...config, isOpen: !config.isOpen })}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${config.isOpen ? "bg-primary" : "bg-muted-foreground/30"}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${config.isOpen ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        </div>
      </section>

      {/* 모집 일정 */}
      <section>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">모집 일정</h3>
        <div className="space-y-4 p-6 bg-card border border-border rounded-xl">
          <div>
            <label className="block text-sm font-medium mb-2">지원 기간</label>
            <div className="flex items-center gap-3">
              <input type="date" value={config.applicationStart}
                onChange={(e) => setConfig({ ...config, applicationStart: e.target.value })} className={INPUT_CLASS} />
              <span className="text-muted-foreground shrink-0">~</span>
              <input type="date" value={config.applicationEnd}
                onChange={(e) => setConfig({ ...config, applicationEnd: e.target.value })} className={INPUT_CLASS} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">면접 일정</label>
            <div className="flex items-center gap-3">
              <input type="date" value={config.interviewStart}
                onChange={(e) => setConfig({ ...config, interviewStart: e.target.value })} className={INPUT_CLASS} />
              <span className="text-muted-foreground shrink-0">~</span>
              <input type="date" value={config.interviewEnd}
                onChange={(e) => setConfig({ ...config, interviewEnd: e.target.value })} className={INPUT_CLASS} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">결과 발표</label>
            <input type="date" value={config.resultDate}
              onChange={(e) => setConfig({ ...config, resultDate: e.target.value })} className={INPUT_CLASS} />
          </div>
        </div>
      </section>

      {/* 기본 정보 항목 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">기본 정보 항목</h3>
          <button onClick={addBasicField}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors">
            <Plus className="h-3.5 w-3.5" />
            항목 추가
          </button>
        </div>
        <div className="space-y-2">
          {config.basicFields.map((f) => (
            <div key={f.id} className={`flex items-center gap-3 px-4 py-3 bg-card border rounded-lg transition-opacity ${f.visible ? "border-border" : "border-border/40 opacity-50"}`}>
              <div className="flex-1 space-y-1">
                <input type="text" value={f.label}
                  onChange={(e) => updateBasicField(f.id, "label", e.target.value)}
                  className="text-sm font-medium bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none pb-0.5 w-full" />
                {f.type !== "select" && (
                  <input type="text" value={f.placeholder}
                    onChange={(e) => updateBasicField(f.id, "placeholder", e.target.value)}
                    className="text-xs text-muted-foreground bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none pb-0.5 w-full"
                    placeholder="예시 텍스트" />
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {f.type !== "select" && (
                  <select value={f.type}
                    onChange={(e) => updateBasicField(f.id, "type", e.target.value)}
                    className="text-xs bg-background border border-border rounded px-2 py-1 focus:outline-none">
                    <option value="text">텍스트</option>
                    <option value="tel">전화번호</option>
                    <option value="email">이메일</option>
                  </select>
                )}
                <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer select-none">
                  <input type="checkbox" checked={f.required}
                    onChange={(e) => updateBasicField(f.id, "required", e.target.checked)} className="rounded" />
                  필수
                </label>
                <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer select-none">
                  <input type="checkbox" checked={f.visible}
                    onChange={(e) => updateBasicField(f.id, "visible", e.target.checked)} className="rounded" />
                  표시
                </label>
                {f.deletable && (
                  <button onClick={() => deleteBasicField(f.id)}
                    className="p-1 text-red-400 hover:bg-red-400/10 rounded transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 질문 항목 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">질문 항목</h3>
          <button onClick={addQuestion}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors">
            <Plus className="h-3.5 w-3.5" />
            질문 추가
          </button>
        </div>
        <div className="space-y-3">
          {config.questions.map((q, i) => (
            <div key={q.id}
              className={`p-4 bg-card border rounded-xl space-y-3 transition-opacity ${q.visible ? "border-border" : "border-border/40 opacity-60"}`}>
              <div className="flex items-start gap-2">
                {/* 순서 변경 */}
                <div className="flex flex-col gap-0.5 shrink-0 pt-0.5">
                  <button onClick={() => moveQuestion(i, -1)} disabled={i === 0}
                    className="p-0.5 rounded hover:bg-muted disabled:opacity-30 transition-colors">
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => moveQuestion(i, 1)} disabled={i === config.questions.length - 1}
                    className="p-0.5 rounded hover:bg-muted disabled:opacity-30 transition-colors">
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* 라벨 */}
                <input type="text" value={q.label}
                  onChange={(e) => updateQuestion(q.id, "label", e.target.value)}
                  className="flex-1 text-sm font-medium bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none pb-0.5" />

                {/* 옵션 */}
                <div className="flex items-center gap-3 shrink-0">
                  <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer select-none">
                    <input type="checkbox" checked={q.required}
                      onChange={(e) => updateQuestion(q.id, "required", e.target.checked)} className="rounded" />
                    필수
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer select-none">
                    <input type="checkbox" checked={q.visible}
                      onChange={(e) => updateQuestion(q.id, "visible", e.target.checked)} className="rounded" />
                    표시
                  </label>
                  <select value={q.type}
                    onChange={(e) => updateQuestion(q.id, "type", e.target.value as RecruitQuestion["type"])}
                    className="text-xs bg-background border border-border rounded px-2 py-1 focus:outline-none">
                    <option value="textarea">장문</option>
                    <option value="text">단문</option>
                    <option value="url">링크</option>
                  </select>
                  {q.deletable && (
                    <button onClick={() => deleteQuestion(q.id)}
                      className="p-1 text-red-400 hover:bg-red-400/10 rounded transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <input type="text" value={q.placeholder}
                onChange={(e) => updateQuestion(q.id, "placeholder", e.target.value)}
                className="w-full text-xs text-muted-foreground px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary"
                placeholder="플레이스홀더 텍스트" />

              {q.type === "textarea" && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>줄 수</span>
                  <input type="number" value={q.rows ?? 4} min={2} max={12}
                    onChange={(e) => updateQuestion(q.id, "rows", Number(e.target.value))}
                    className="w-16 px-2 py-1 bg-background border border-border rounded focus:outline-none text-xs" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 저장 */}
      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          저장
        </button>
        {saved && <span className="text-sm text-emerald-600 font-medium">저장되었습니다!</span>}
        <button onClick={loadConfig}
          className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm hover:bg-muted transition-colors ml-auto">
          <RefreshCw className="h-4 w-4" />
          새로고침
        </button>
      </div>
    </div>
  );
}
