export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  team: string;
  date: string;
  imageUrl: string;
  tags: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
  imageUrl?: string;
}

export interface Team {
  name: string;
  description: string;
  responsibilities: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  date: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  content: string;
  date: string;
  category: string;
  imageUrl?: string;
  participants?: string[];
}

export const articles: Article[] = [];

export const news: NewsItem[] = [];

export const gallery: GalleryItem[] = [];

export const activities: Activity[] = [];

export const teams: Team[] = [
  {
    name: "Leaders",
    description: "KHUX의 회장단으로, 학회의 비전과 방향성을 수립하고 활동 전반을 리딩합니다.",
    responsibilities: [
      "학회의 비전과 방향성 수립",
      "운영 프로세스상의 비효율 발견 및 정의",
      "내부 시스템과 인프라 기획 및 구축",
      "학회원들이 성장에 집중할 수 있는 환경 설계",
      "활동 전반에 대한 리더십 제공",
    ],
  },
  {
    name: "Education",
    description: "예비 UX 전문가들을 위해 가장 효율적인 커리큘럼을 기획하고 교육 콘텐츠를 제작합니다.",
    responsibilities: [
      "효율적인 UX/UI 커리큘럼 기획",
      "이론과 실무 간극을 줄이는 교육 콘텐츠 제작",
      "실무 적용 중심의 세션 운영",
      "학회원 간 지식 공유 문화 주도",
      "함께 성장하는 학습 문화 조성",
    ],
  },
  {
    name: "Operations",
    description: "학회의 살림을 책임지며, 구성원들이 깊은 소속감을 느끼고 시너지를 낼 수 있는 조직 문화를 만듭니다.",
    responsibilities: [
      "리크루팅부터 온보딩까지 전반적인 운영 관리",
      "깊은 소속감을 느낄 수 있는 조직 문화 구축",
      "활동 과정에서의 불필요한 마찰 최소화",
      "매끄럽고 즐거운 활동 경험 제공",
      "학회 운영 프로세스 개선 및 관리",
    ],
  },
  {
    name: "Growth",
    description: "학회의 성장에 온전히 집중하는 팀입니다. 학회를 하나의 브랜드로 정의하여 마케팅 전략을 수립합니다.",
    responsibilities: [
      "학회 브랜드 정의 및 마케팅 전략 수립",
      "적극적인 기업 파트너십 유치",
      "외부와의 연결 고리 형성",
      "학회원들의 더 넓은 무대 진출 기회 마련",
      "대외 홍보 및 브랜딩 활동 주도",
    ],
  },
];
