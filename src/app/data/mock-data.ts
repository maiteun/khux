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
}

export interface Team {
  name: string;
  description: string;
  responsibilities: string[];
}

export const articles: Article[] = [
  {
    id: "1",
    title: "UX 디자인의 미래: AI와 함께하는 사용자 경험",
    excerpt: "인공지능 기술이 UX 디자인 분야에 어떤 혁신을 가져올 수 있는지 살펴봅니다.",
    content: `인공지능 기술의 발전으로 UX 디자인 분야는 새로운 전환점을 맞이하고 있습니다. AI는 사용자의 행동 패턴을 분석하고, 개인화된 경험을 제공하며, 디자이너의 작업 효율성을 높이는 데 크게 기여하고 있습니다.

특히 생성형 AI는 프로토타이핑 과정을 혁신하고 있으며, 머신러닝을 활용한 사용자 분석은 더욱 정교한 인사이트를 제공합니다. 하지만 동시에 우리는 기술과 인간 중심 디자인의 균형을 어떻게 맞출 것인가에 대한 고민도 필요합니다.

본 아티클에서는 AI 시대의 UX 디자이너가 갖춰야 할 역량과 미래 전망에 대해 심도 있게 다룹니다.`,
    author: "김지원",
    team: "Education",
    date: "2026-02-20",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
    tags: ["AI", "UX Design", "Future"],
  },
  {
    id: "2",
    title: "모바일 앱 디자인 트렌드 2026",
    excerpt: "2026년 주목해야 할 모바일 앱 디자인 트렌드를 분석합니다.",
    content: `2026년 모바일 앱 디자인 트렌드는 미니멀리즘과 개인화의 조화를 추구합니다. 사용자들은 더욱 직관적이고 간결한 인터페이스를 원하며, 동시에 자신만의 경험을 원합니다.

다크 모드의 진화, 마이크로 인터랙션의 정교화, 그리고 접근성을 고려한 디자인이 핵심 키워드입니다. 또한 제스처 기반 내비게이션과 음성 인터페이스의 통합이 더욱 중요해지고 있습니다.

본 아티클에서는 실제 사례와 함께 이러한 트렌드를 어떻게 적용할 수 있는지 구체적으로 살펴봅니다.`,
    author: "박서연",
    team: "Brand",
    date: "2026-02-15",
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
    tags: ["Mobile", "Design Trends", "UI"],
  },
  {
    id: "3",
    title: "사용자 리서치 방법론: 인터뷰부터 데이터 분석까지",
    excerpt: "효과적인 사용자 리서치를 위한 다양한 방법론을 소개합니다.",
    content: `사용자 리서치는 성공적인 제품 디자인의 핵심입니다. 이 글에서는 정성적 연구와 정량적 연구 방법을 모두 다루며, 각 상황에 맞는 적절한 리서치 방법을 선택하는 방법을 알아봅니다.

심층 인터뷰, 설문조사, A/B 테스팅, 사용성 테스트 등 다양한 방법론의 장단점을 비교하고, 실제 프로젝트에서 어떻게 활용할 수 있는지 사례를 통해 설명합니다.

또한 리서치 데이터를 효과적으로 분석하고 인사이트를 도출하는 프로세스도 함께 다룹니다.`,
    author: "이준호",
    team: "Education",
    date: "2026-02-10",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
    tags: ["Research", "UX", "Methodology"],
  },
  {
    id: "4",
    title: "디자인 시스템 구축 가이드",
    excerpt: "확장 가능하고 일관성 있는 디자인 시스템을 만드는 방법을 알아봅니다.",
    content: `디자인 시스템은 제품의 일관성을 유지하고 팀의 협업 효율성을 높이는 핵심 도구입니다. 이 아티클에서는 디자인 시스템을 처음부터 구축하는 전체 과정을 다룹니다.

컬러 팔레트, 타이포그래피, 컴포넌트 라이브러리 구성부터 문서화와 유지보수까지, 실무에서 바로 적용할 수 있는 구체적인 가이드를 제공합니다.

또한 Figma와 같은 도구를 활용한 효율적인 디자인 시스템 관리 방법도 함께 소개합니다.`,
    author: "최민지",
    team: "Brand",
    date: "2026-02-05",
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
    tags: ["Design System", "Branding", "Tools"],
  },
];

export const news: NewsItem[] = [
  {
    id: "1",
    title: "KHUX 4기 리크루팅 시작!",
    content:
      "2026년 상반기 KHUX 4기 멤버를 모집합니다. Operation, Education, Brand, PR 팀에서 함께할 열정적인 분들을 기다립니다. 지원 기간은 3월 1일부터 3월 15일까지입니다.",
    date: "2026-02-22",
    category: "Recruitment",
  },
  {
    id: "2",
    title: "KHUX X 테크 기업 협업 프로젝트 진행",
    content:
      "KHUX가 국내 유명 테크 기업과 함께 UX 개선 프로젝트를 진행합니다. 학회 멤버들이 실제 서비스의 사용자 경험을 분석하고 개선안을 제안하는 귀중한 기회가 될 것입니다.",
    date: "2026-02-18",
    category: "Project",
  },
  {
    id: "3",
    title: "2월 정기 세미나 개최 안내",
    content:
      "이번 달 정기 세미나는 '사용자 중심 디자인 사고'를 주제로 진행됩니다. 현직 UX 디자이너를 초청하여 실무 경험을 공유하는 시간을 가질 예정입니다. 2월 28일 오후 7시, 경희대학교 학생회관에서 진행됩니다.",
    date: "2026-02-15",
    category: "Event",
  },
  {
    id: "4",
    title: "KHUX 블로그 리뉴얼 완료",
    content:
      "더 나은 사용자 경험을 제공하기 위해 KHUX 공식 블로그를 전면 리뉴얼했습니다. 새로운 디자인과 개선된 내비게이션으로 학회 소식과 아티클을 더욱 편리하게 접할 수 있습니다.",
    date: "2026-02-10",
    category: "Announcement",
  },
  {
    id: "5",
    title: "3기 멤버 프로젝트 전시회 성황리 종료",
    content:
      "KHUX 3기 멤버들의 1년간의 프로젝트 결과물을 전시하는 행사가 성황리에 종료되었습니다. 많은 학생들이 방문하여 높은 관심을 보여주셨습니다. 프로젝트 결과물은 온라인에서도 확인하실 수 있습니다.",
    date: "2026-02-05",
    category: "Event",
  },
];

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