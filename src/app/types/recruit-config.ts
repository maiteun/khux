export interface RecruitBasicField {
  id: string;
  label: string;
  placeholder: string;
  type: "text" | "tel" | "email" | "select";
  required: boolean;
  visible: boolean;
  deletable?: boolean;
}

export interface RecruitQuestion {
  id: string;
  label: string;
  placeholder: string;
  required: boolean;
  visible: boolean;
  type: "textarea" | "url" | "text";
  rows?: number;
  deletable?: boolean; // custom questions can be fully deleted
}

export interface RecruitConfig {
  generation: string;
  isOpen: boolean;
  description: string;
  applicationStart: string;
  applicationEnd: string;
  interviewStart: string;
  interviewEnd: string;
  resultDate: string;
  basicFields: RecruitBasicField[];
  questions: RecruitQuestion[];
}

export const KV_KEY = "recruit:config";

export const DEFAULT_RECRUIT_CONFIG: RecruitConfig = {
  generation: "KHUX 4기",
  isOpen: true,
  description: "UX/UI에 관심 있는 경희대학교 학생이라면 누구나 지원 가능합니다.",
  applicationStart: "2026-03-14",
  applicationEnd: "2026-05-05",
  interviewStart: "2026-05-08",
  interviewEnd: "2026-05-12",
  resultDate: "2026-05-15",
  basicFields: [
    { id: "name",      label: "이름",    placeholder: "홍길동",            type: "text",   required: true,  visible: true },
    { id: "studentId", label: "학번",    placeholder: "2024XXXXXX",       type: "text",   required: true,  visible: true },
    { id: "major",     label: "학과",    placeholder: "산업디자인학과",    type: "text",   required: true,  visible: true },
    { id: "phone",     label: "연락처",  placeholder: "010-0000-0000",    type: "tel",    required: true,  visible: true },
    { id: "email",     label: "이메일",  placeholder: "example@khu.ac.kr", type: "email", required: true,  visible: true },
    { id: "team",      label: "지원 팀", placeholder: "",                  type: "select", required: true,  visible: true },
  ],
  questions: [
    {
      id: "motivation",
      label: "지원 동기",
      placeholder: "KHUX에 지원하게 된 동기와 학회에서 이루고 싶은 목표를 자유롭게 작성해주세요.",
      required: true,
      visible: true,
      type: "textarea",
      rows: 5,
      deletable: false,
    },
    {
      id: "experience",
      label: "관련 경험",
      placeholder: "UX/UI 관련 경험이나 프로젝트가 있다면 작성해주세요. (선택)",
      required: false,
      visible: true,
      type: "textarea",
      rows: 4,
      deletable: false,
    },
    {
      id: "portfolio",
      label: "포트폴리오 링크",
      placeholder: "https://... (선택)",
      required: false,
      visible: true,
      type: "url",
      deletable: false,
    },
  ],
};

/** "2026-03-14" → "2026.03.14" */
export function formatDate(iso: string): string {
  return iso.replace(/-/g, ".");
}
