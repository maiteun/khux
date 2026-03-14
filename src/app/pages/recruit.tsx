import { useState } from "react";
import { CheckCircle, Send, Calendar, Clock, FileText } from "lucide-react";
import { apiFetch } from "../../utils/supabase-client";

interface ApplicationForm {
  name: string;
  studentId: string;
  major: string;
  phone: string;
  email: string;
  team: string;
  motivation: string;
  experience: string;
  portfolio: string;
}

const initialForm: ApplicationForm = {
  name: "",
  studentId: "",
  major: "",
  phone: "",
  email: "",
  team: "",
  motivation: "",
  experience: "",
  portfolio: "",
};

export function Recruit() {
  const [form, setForm] = useState<ApplicationForm>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await apiFetch("/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Submit failed");
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("지원서 제출에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="w-full py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-emerald-600" />
            </div>
            <h1 className="text-3xl mb-4">지원이 완료되었습니다!</h1>
            <p className="text-muted-foreground mb-2">
              KHUX에 관심을 가져주셔서 감사합니다.
            </p>
            <p className="text-muted-foreground">
              서류 검토 후 개별적으로 연락드리겠습니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl mb-4">Recruit</h1>
            <p className="text-lg text-muted-foreground">
              KHUX 4기 멤버를 모집합니다. UX/UI에 관심 있는 경희대학교 학생이라면 누구나 지원 가능합니다.
            </p>
          </div>

          {/* Recruitment Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="p-6 bg-card border border-border rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="font-medium">지원 기간</h3>
              </div>
              <p className="text-sm text-muted-foreground">2026.03.14 ~ 2026.05.05</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="font-medium">면접 일정</h3>
              </div>
              <p className="text-sm text-muted-foreground">2026.05.08 ~ 2026.05.12</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-medium">결과 발표</h3>
              </div>
              <p className="text-sm text-muted-foreground">2026.05.15</p>
            </div>
          </div>

          {/* Teams Description */}
          <div className="mb-12 p-8 bg-gradient-to-br from-primary/5 to-accent/10 rounded-2xl border border-border">
            <h2 className="text-2xl mb-6">모집 팀 소개</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: "Leaders", desc: "학회의 비전과 방향성을 수립하고 활동 전반을 리딩" },
                { name: "Education", desc: "UX/UI 커리큘럼 기획 및 교육 콘텐츠 제작" },
                { name: "Operations", desc: "학회 운영 관리 및 조직 문화 구축" },
                { name: "Growth", desc: "브랜드 전략 수립 및 대외 활동 주도" },
              ].map((team) => (
                <div key={team.name} className="p-4 bg-background/60 rounded-xl">
                  <h4 className="font-medium mb-1">{team.name}</h4>
                  <p className="text-sm text-muted-foreground">{team.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Application Form */}
          <div className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl mb-8">지원서 작성</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">이름 *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="홍길동"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">학번 *</label>
                  <input
                    type="text"
                    name="studentId"
                    value={form.studentId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="2024XXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">학과 *</label>
                  <input
                    type="text"
                    name="major"
                    value={form.major}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="산업디자인학과"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">연락처 *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="010-0000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">이메일 *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="example@khu.ac.kr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">지원 팀 *</label>
                  <select
                    name="team"
                    value={form.team}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">팀을 선택해주세요</option>
                    <option value="Leaders">Leaders</option>
                    <option value="Education">Education</option>
                    <option value="Operations">Operations</option>
                    <option value="Growth">Growth</option>
                  </select>
                </div>
              </div>

              {/* Long-form Questions */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  지원 동기 *
                </label>
                <textarea
                  name="motivation"
                  value={form.motivation}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="KHUX에 지원하게 된 동기와 학회에서 이루고 싶은 목표를 자유롭게 작성해주세요."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  관련 경험
                </label>
                <textarea
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="UX/UI 관련 경험이나 프로젝트가 있다면 작성해주세요. (선택)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  포트폴리오 링크
                </label>
                <input
                  type="url"
                  name="portfolio"
                  value={form.portfolio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="https://... (선택)"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
              >
                {submitting ? (
                  "제출 중..."
                ) : (
                  <>
                    지원서 제출
                    <Send className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
