import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router";
import {
  ArrowRight,
  Search,
  Tag,
  User,
  Calendar,
  ChevronRight,
  X,
} from "lucide-react";
import type { Article, NewsItem, GalleryItem, Activity } from "../data/mock-data";
import { articles as mockArticles, news as mockNews, gallery as mockGallery, activities as mockActivities } from "../data/mock-data";
import { apiFetch } from "../../utils/supabase-client";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { FadeInSection } from "../components/fade-in-section";

export function Home() {
  const location = useLocation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // Articles state
  const [articleSearch, setArticleSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // News state
  const [selectedNewsCategory, setSelectedNewsCategory] = useState<string | null>(null);

  // Gallery state
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  // Activities state
  const [selectedActivityCategory, setSelectedActivityCategory] = useState<string | null>(null);
  const [expandedActivityId, setExpandedActivityId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aRes, nRes, gRes, actRes] = await Promise.all([
          apiFetch("/articles"), apiFetch("/news"), apiFetch("/gallery"), apiFetch("/activities"),
        ]);
        const [aData, nData, gData, actData] = await Promise.all([
          aRes.json(), nRes.json(), gRes.json(), actRes.json(),
        ]);
        setArticles((aData.articles || []).length > 0 ? aData.articles : mockArticles);
        setNews((nData.news || []).length > 0 ? nData.news : mockNews);
        setGallery((gData.gallery || []).length > 0 ? gData.gallery : mockGallery);
        setActivities((actData.activities || []).length > 0 ? actData.activities : mockActivities);
      } catch {
        setArticles(mockArticles);
        setNews(mockNews);
        setGallery(mockGallery);
        setActivities(mockActivities);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle hash scroll on load
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location.hash]);

  // Filtered data
  const allTags = Array.from(new Set(articles.flatMap((a) => a.tags || [])));
  const filteredArticles = articles.filter((a) => {
    const matchSearch = a.title?.toLowerCase().includes(articleSearch.toLowerCase()) || a.excerpt?.toLowerCase().includes(articleSearch.toLowerCase());
    const matchTag = selectedTag ? a.tags?.includes(selectedTag) : true;
    return matchSearch && matchTag;
  });

  const newsCategories = Array.from(new Set(news.map((n) => n.category)));
  const filteredNews = selectedNewsCategory ? news.filter((n) => n.category === selectedNewsCategory) : news;

  const galleryCategories = Array.from(new Set(gallery.map((g) => g.category)));
  const filteredGallery = selectedGalleryCategory ? gallery.filter((g) => g.category === selectedGalleryCategory) : gallery;

  const activityCategories = Array.from(new Set(activities.map((a) => a.category)));
  const filteredActivities = selectedActivityCategory ? activities.filter((a) => a.category === selectedActivityCategory) : activities;

  // Team data for about.html style
  const teamCards = [
    { name: "Ops", eng: "Operations Team", icon: "⚙️", color: "lime", desc: "학회의 전체 운영을 책임집니다. 일정 관리, 예산 운용, 팀 간 조율, 행사 기획까지 KHUX가 원활하게 돌아갈 수 있도록 뒷받침하는 팀입니다.", tags: ["일정 관리", "예산 운용", "행사 기획", "팀 조율"] },
    { name: "Brand", eng: "Brand Experience Team", icon: "✦", color: "orange", desc: "KHUX의 브랜드 정체성과 외부 커뮤니케이션을 담당합니다. SNS 콘텐츠, 디자인 에셋, 학회 웹사이트 등 시각적 경험 전반을 설계합니다.", tags: ["SNS 운영", "디자인 에셋", "웹사이트", "비주얼 아이덴티티"] },
    { name: "Education", eng: "Education & Research Team", icon: "📚", color: "blue", desc: "구성원의 성장을 이끄는 학습·연구 팀입니다. UX 방법론, AI 기술, 케이스 스터디를 체계적인 커리큘럼으로 운영합니다.", tags: ["커리큘럼 설계", "스터디 운영", "세미나 기획", "프로젝트 피드백"] },
  ];

  const teamColorMap: Record<string, { bar: string; badge: string; glow: string }> = {
    lime: { bar: "bg-primary", badge: "text-primary", glow: "bg-primary/[0.07] group-hover:bg-primary/[0.12]" },
    orange: { bar: "bg-deep-orange", badge: "text-deep-orange", glow: "bg-deep-orange/[0.07] group-hover:bg-deep-orange/[0.12]" },
    blue: { bar: "bg-deep-blue", badge: "text-deep-blue", glow: "bg-deep-blue/[0.07] group-hover:bg-deep-blue/[0.12]" },
  };

  const activityItems = [
    { num: "01", icon: "🔍", title: "UX 리서치", desc: "사용자 인터뷰, 사용성 테스트, 데이터 분석을 통해 실제 사용자의 니즈와 페인 포인트를 탐구합니다." },
    { num: "02", icon: "🤖", title: "AI 기능 기획", desc: "기존 서비스에 AI를 접목한 새로운 기능을 기획하고, UX 관점에서 실현 가능성을 검증합니다." },
    { num: "03", icon: "🎨", title: "UI/UX 디자인", desc: "Figma를 활용한 와이어프레임, 프로토타입 제작으로 아이디어를 구체적인 화면으로 구현합니다." },
    { num: "04", icon: "📊", title: "케이스 스터디", desc: "국내외 서비스를 분석해 UX 전략, 비즈니스 임팩트, 개선 방안을 도출합니다." },
    { num: "05", icon: "🧑‍💻", title: "프로토타입 구현", desc: "HTML/CSS/JS를 활용해 기획한 UX 아이디어를 직접 작동하는 프로토타입으로 만듭니다." },
    { num: "06", icon: "🤝", title: "스터디 & 세미나", desc: "UX 트렌드, 디자인 시스템, AI 기술 등을 주제로 구성원들이 함께 배우고 성장합니다." },
  ];

  return (
    <div className="w-full">
      {/* ==================== HERO ==================== */}
      <section className="relative min-h-screen flex flex-col justify-end px-6 sm:px-12 pb-20 overflow-hidden">
        {/* Grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)',
          }}
        />
        {/* Glow */}
        <div className="absolute -top-[200px] -left-[200px] w-[700px] h-[700px] rounded-full bg-primary/[0.06] blur-3xl pointer-events-none" />

        <FadeInSection>
          <div className="relative z-10 max-w-5xl">
            <span className="inline-block text-xs font-semibold tracking-[0.12em] uppercase text-primary border border-primary/30 px-3.5 py-1.5 rounded-full mb-7">
              About KHUX
            </span>
            <h1 className="text-5xl sm:text-7xl lg:text-[100px] font-black leading-[0.95] tracking-[-0.04em] mb-8">
              우리는<br /><span className="text-primary">UX를</span><br />연구합니다
            </h1>
            <p className="max-w-xl text-base sm:text-lg text-text-sub leading-relaxed">
              KHUX는 경희대학교 내 UX·AI 연구 학회입니다.<br />
              데이터와 디자인 사이에서 사용자 경험의 미래를 탐구합니다.
            </p>
          </div>
        </FadeInSection>
      </section>

      <hr className="border-border mx-6 sm:mx-12" />

      {/* ==================== ABOUT ==================== */}
      <section id="about" className="py-28 max-w-[1200px] mx-auto px-6 sm:px-12">
        <FadeInSection>
          <p className="text-xs font-bold tracking-[0.15em] uppercase text-primary mb-5">Who We Are</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6">
            사용자 경험을 설계하는<br />경희대 UX 학회
          </h2>
          <p className="text-base text-text-sub leading-relaxed max-w-2xl">
            KHUX(Kyung Hee UX)는 경희대학교 학생들이 UX 디자인과 AI 기술을 중심으로
            실제 프로덕트를 기획·제안·구현하는 학술 연구 학회입니다.
            이론적 탐구와 실무적 적용을 동시에 추구하며,
            서비스 개선 제안부터 실제 프로토타입 제작까지 함께 경험합니다.
          </p>
        </FadeInSection>

        {/* Stats */}
        <FadeInSection>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border border border-border rounded-2xl overflow-hidden mt-16">
            {[
              { num: "3+", label: "활동 팀" },
              { num: "20+", label: "활동 멤버" },
              { num: "10+", label: "프로젝트" },
              { num: "2024", label: "설립 연도" },
            ].map(({ num, label }) => (
              <div key={label} className="bg-surface py-10 px-8 text-center hover:bg-surface2 transition-colors">
                <div className="text-4xl sm:text-5xl font-black tracking-[-0.04em] text-primary leading-none mb-2">{num}</div>
                <div className="text-sm text-muted-foreground font-medium">{label}</div>
              </div>
            ))}
          </div>
        </FadeInSection>
      </section>

      <hr className="border-border mx-6 sm:mx-12" />

      {/* ==================== VISION & MISSION ==================== */}
      <section className="py-28 max-w-[1200px] mx-auto px-6 sm:px-12">
        <FadeInSection>
          <p className="text-xs font-bold tracking-[0.15em] uppercase text-primary mb-5">Vision & Mission</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6">방향과 목표</h2>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <FadeInSection>
            <div className="group bg-surface border border-border rounded-2xl p-10 relative overflow-hidden hover:border-primary/20 hover:-translate-y-1 transition-all duration-500">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="text-3xl mb-5">🔭</div>
              <h3 className="text-xs font-bold tracking-[0.12em] uppercase text-primary mb-4">Vision</h3>
              <p className="text-xl sm:text-[22px] font-bold leading-snug tracking-[-0.02em] text-foreground">
                AI 시대의 UX를 선도하는<br />경희대 최고의 실전 연구 학회
              </p>
              <p className="text-sm text-text-sub mt-3 leading-relaxed">
                기술과 인간의 접점에서 진정한 가치를 만드는
                연구자·디자이너·기획자를 배출합니다.
              </p>
            </div>
          </FadeInSection>
          <FadeInSection>
            <div className="group bg-surface border border-border rounded-2xl p-10 relative overflow-hidden hover:border-primary/20 hover:-translate-y-1 transition-all duration-500">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="text-3xl mb-5">🎯</div>
              <h3 className="text-xs font-bold tracking-[0.12em] uppercase text-primary mb-4">Mission</h3>
              <p className="text-xl sm:text-[22px] font-bold leading-snug tracking-[-0.02em] text-foreground">
                사용자 중심 사고로<br />실제 문제를 해결한다
              </p>
              <p className="text-sm text-text-sub mt-3 leading-relaxed">
                데이터 기반 분석과 디자인 씽킹을 결합해
                현실 서비스에 적용 가능한 UX 솔루션을 제안합니다.
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      <hr className="border-border mx-6 sm:mx-12" />

      {/* ==================== WHAT WE DO ==================== */}
      <section className="py-28 max-w-[1200px] mx-auto px-6 sm:px-12">
        <FadeInSection>
          <p className="text-xs font-bold tracking-[0.15em] uppercase text-primary mb-5">What We Do</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6">활동 분야</h2>
          <p className="text-base text-text-sub leading-relaxed max-w-2xl">
            KHUX는 UX 연구, AI 기능 기획, 브랜드 경험 설계를 중심으로
            다양한 실전 활동을 진행합니다.
          </p>
        </FadeInSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-16">
          {activityItems.map((item) => (
            <FadeInSection key={item.num}>
              <div className="bg-surface border border-border rounded-2xl p-8 flex flex-col gap-4 hover:bg-surface2 hover:border-white/[0.15] hover:-translate-y-1.5 transition-all duration-500 cursor-default">
                <span className="text-xs font-bold tracking-[0.1em] text-muted-foreground">{item.num}</span>
                <span className="text-3xl">{item.icon}</span>
                <h4 className="text-lg font-bold tracking-[-0.02em]">{item.title}</h4>
                <p className="text-sm text-text-sub leading-relaxed">{item.desc}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      <hr className="border-border mx-6 sm:mx-12" />

      {/* ==================== TEAMS ==================== */}
      <section className="py-28 max-w-[1200px] mx-auto px-6 sm:px-12">
        <FadeInSection>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 mb-16">
            <div>
              <p className="text-xs font-bold tracking-[0.15em] uppercase text-primary mb-5">Our Teams</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl">팀 소개</h2>
            </div>
            <p className="text-[15px] text-text-sub leading-relaxed max-w-md">
              KHUX는 세 개의 팀이 각자의 전문성으로 협력하며
              하나의 완성된 UX 학회를 만들어 나갑니다.
            </p>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {teamCards.map((team, i) => {
            const colors = teamColorMap[team.color];
            return (
              <FadeInSection key={team.name}>
                <div className="group rounded-2xl border border-border overflow-hidden hover:-translate-y-2 hover:shadow-[0_32px_64px_rgba(0,0,0,0.5)] transition-all duration-500">
                  {/* Top */}
                  <div className="relative p-9 pb-7 bg-surface overflow-hidden">
                    <div className={`absolute -bottom-[60px] -right-[60px] w-40 h-40 rounded-full ${colors.glow} transition-all duration-500 group-hover:scale-125`} />
                    <span className="absolute top-8 right-8 text-4xl">{team.icon}</span>
                    <span className={`inline-block text-xs font-bold tracking-[0.1em] uppercase ${colors.badge} bg-white/5 border border-white/[0.08] px-3 py-1 rounded-full mb-5`}>
                      Team {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="text-[28px] font-extrabold tracking-[-0.03em] mb-1">{team.name} 팀</div>
                    <div className="text-sm text-muted-foreground font-medium">{team.eng}</div>
                  </div>
                  {/* Color bar */}
                  <div className={`h-[3px] ${colors.bar} opacity-60`} />
                  {/* Body */}
                  <div className="p-8 pt-7 bg-surface2">
                    <p className="text-sm text-text-sub leading-relaxed mb-6">{team.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {team.tags.map((tag) => (
                        <span key={tag} className="text-xs font-semibold text-text-sub bg-white/5 border border-border px-3 py-1 rounded-full group-hover:bg-white/[0.07] group-hover:border-white/[0.12] group-hover:text-foreground transition-all duration-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeInSection>
            );
          })}
        </div>
      </section>

      <hr className="border-border mx-6 sm:mx-12" />

      {/* ==================== ARTICLES ==================== */}
      <section id="articles" className="py-28 max-w-[1200px] mx-auto px-6 sm:px-12">
        <FadeInSection>
          <p className="text-xs font-bold tracking-[0.15em] uppercase text-primary mb-5">Articles</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6">아티클</h2>
          <p className="text-base text-text-sub leading-relaxed max-w-2xl mb-10">
            KHUX 멤버들이 작성한 UX/UI 디자인 관련 아티클을 확인하세요.
          </p>

          <div className="mb-10 space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input type="text" placeholder="아티클 검색..." value={articleSearch} onChange={(e) => setArticleSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Tags:</span>
              <button onClick={() => setSelectedTag(null)}
                className={`text-sm px-3.5 py-1.5 rounded-full transition-all ${selectedTag === null ? "bg-primary text-primary-foreground font-semibold" : "bg-surface border border-border text-text-sub hover:border-white/20 hover:text-foreground"}`}>All</button>
              {allTags.map((tag) => (
                <button key={tag} onClick={() => setSelectedTag(tag)}
                  className={`text-sm px-3.5 py-1.5 rounded-full transition-all ${selectedTag === tag ? "bg-primary text-primary-foreground font-semibold" : "bg-surface border border-border text-text-sub hover:border-white/20 hover:text-foreground"}`}>{tag}</button>
              ))}
            </div>
          </div>
        </FadeInSection>

        {loading ? (
          <div className="text-center py-20"><p className="text-muted-foreground">로딩 중...</p></div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredArticles.map((article) => {
              const formattedDate = new Date(article.date).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
              return (
                <FadeInSection key={article.id}>
                  <a href={`/articles/${article.id}`}
                    className="group block bg-surface border border-border rounded-2xl overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_24px_48px_rgba(0,0,0,0.4)] hover:border-white/[0.15] transition-all duration-500">
                    <div className="relative h-48 overflow-hidden bg-muted">
                      <ImageWithFallback src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /><span>{formattedDate}</span></div>
                        <div className="flex items-center gap-1"><User className="h-3 w-3" /><span>{article.author}</span></div>
                      </div>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{article.title}</h3>
                      <p className="text-sm text-text-sub mb-4 line-clamp-2">{article.excerpt}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Tag className="h-3 w-3 text-muted-foreground" />
                        {article.tags?.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-xs px-2.5 py-1 bg-white/5 border border-border rounded-full text-text-sub">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </a>
                </FadeInSection>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20"><p className="text-muted-foreground">검색 결과가 없습니다.</p></div>
        )}
      </section>

      <hr className="border-border mx-6 sm:mx-12" />

      {/* ==================== ACTIVITIES ==================== */}
      <section id="activities" className="py-28 max-w-[1200px] mx-auto px-6 sm:px-12">
        <FadeInSection>
          <p className="text-xs font-bold tracking-[0.15em] uppercase text-primary mb-5">Activities</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6">활동 내역</h2>
          <p className="text-base text-text-sub leading-relaxed max-w-2xl mb-10">
            세미나, 프로젝트, 워크숍 등 다양한 활동을 소개합니다.
          </p>

          <div className="mb-10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">카테고리:</span>
              <button onClick={() => setSelectedActivityCategory(null)}
                className={`text-sm px-4 py-2 rounded-full transition-all ${selectedActivityCategory === null ? "bg-primary text-primary-foreground font-semibold" : "bg-surface border border-border text-text-sub hover:border-white/20 hover:text-foreground"}`}>전체</button>
              {activityCategories.map((c) => (
                <button key={c} onClick={() => setSelectedActivityCategory(c)}
                  className={`text-sm px-4 py-2 rounded-full transition-all ${selectedActivityCategory === c ? "bg-primary text-primary-foreground font-semibold" : "bg-surface border border-border text-text-sub hover:border-white/20 hover:text-foreground"}`}>{c}</button>
              ))}
            </div>
          </div>
        </FadeInSection>

        <div className="space-y-5">
          {filteredActivities.map((activity) => (
            <FadeInSection key={activity.id}>
              <div className="group bg-surface border border-border rounded-2xl overflow-hidden hover:-translate-y-1 hover:border-white/[0.15] hover:shadow-[0_24px_48px_rgba(0,0,0,0.3)] transition-all duration-500">
                <div className="flex flex-col md:flex-row">
                  {activity.imageUrl && (
                    <div className="md:w-80 flex-shrink-0">
                      <img src={activity.imageUrl} alt={activity.title} className="w-full h-48 md:h-full object-cover" loading="lazy" />
                    </div>
                  )}
                  <div className="flex-1 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full font-semibold">{activity.category}</span>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground"><Calendar className="h-4 w-4" />{activity.date}</div>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-3">{activity.title}</h3>
                    <p className="text-text-sub mb-4">{activity.description}</p>
                    {expandedActivityId === activity.id && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{activity.content}</p>
                      </div>
                    )}
                    <button onClick={() => setExpandedActivityId(expandedActivityId === activity.id ? null : activity.id)}
                      className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors mt-2 font-medium">
                      {expandedActivityId === activity.id ? "접기" : "자세히 보기"}
                      <ChevronRight className={`h-4 w-4 transition-transform ${expandedActivityId === activity.id ? "rotate-90" : ""}`} />
                    </button>
                  </div>
                </div>
              </div>
            </FadeInSection>
          ))}
          {filteredActivities.length === 0 && <div className="text-center py-20"><p className="text-muted-foreground">해당 카테고리의 활동이 없습니다.</p></div>}
        </div>
      </section>

      <hr className="border-border mx-6 sm:mx-12" />

      {/* ==================== GALLERY ==================== */}
      <section id="gallery" className="py-28 max-w-[1200px] mx-auto px-6 sm:px-12">
        <FadeInSection>
          <p className="text-xs font-bold tracking-[0.15em] uppercase text-primary mb-5">Gallery</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6">갤러리</h2>
          <p className="text-base text-text-sub leading-relaxed max-w-2xl mb-10">
            KHUX의 다양한 활동 현장을 사진으로 만나보세요.
          </p>

          <div className="mb-10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">카테고리:</span>
              <button onClick={() => setSelectedGalleryCategory(null)}
                className={`text-sm px-4 py-2 rounded-full transition-all ${selectedGalleryCategory === null ? "bg-primary text-primary-foreground font-semibold" : "bg-surface border border-border text-text-sub hover:border-white/20 hover:text-foreground"}`}>전체</button>
              {galleryCategories.map((c) => (
                <button key={c} onClick={() => setSelectedGalleryCategory(c)}
                  className={`text-sm px-4 py-2 rounded-full transition-all ${selectedGalleryCategory === c ? "bg-primary text-primary-foreground font-semibold" : "bg-surface border border-border text-text-sub hover:border-white/20 hover:text-foreground"}`}>{c}</button>
              ))}
            </div>
          </div>
        </FadeInSection>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filteredGallery.map((item) => (
            <FadeInSection key={item.id}>
              <div className="break-inside-avoid group cursor-pointer" onClick={() => setSelectedImage(item)}>
                <div className="relative overflow-hidden rounded-2xl border border-border bg-surface">
                  <img src={item.imageUrl} alt={item.title} className="w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="inline-block text-xs px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white mb-2">{item.category}</span>
                    <h3 className="text-white font-bold">{item.title}</h3>
                    <p className="text-white/80 text-sm mt-1">{item.description}</p>
                  </div>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
        {filteredGallery.length === 0 && <div className="text-center py-20"><p className="text-muted-foreground">해당 카테고리의 사진이 없습니다.</p></div>}

        {/* Lightbox */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setSelectedImage(null)}>
            <div className="relative max-w-4xl w-full bg-surface rounded-2xl overflow-hidden shadow-2xl border border-border" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                <X className="h-5 w-5" />
              </button>
              <img src={selectedImage.imageUrl} alt={selectedImage.title} className="w-full max-h-[70vh] object-contain bg-black" />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-full font-semibold">{selectedImage.category}</span>
                  <span className="text-sm text-muted-foreground">{selectedImage.date}</span>
                </div>
                <h2 className="text-xl font-bold mb-2">{selectedImage.title}</h2>
                <p className="text-text-sub">{selectedImage.description}</p>
              </div>
            </div>
          </div>
        )}
      </section>

      <hr className="border-border mx-6 sm:mx-12" />

      {/* ==================== NEWS ==================== */}
      <section id="news" className="py-28 max-w-[1200px] mx-auto px-6 sm:px-12">
        <FadeInSection>
          <p className="text-xs font-bold tracking-[0.15em] uppercase text-primary mb-5">News</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6">소식</h2>
          <p className="text-base text-text-sub leading-relaxed max-w-2xl mb-10">
            KHUX의 최신 소식과 활동 내역을 확인하세요.
          </p>

          <div className="mb-10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Category:</span>
              <button onClick={() => setSelectedNewsCategory(null)}
                className={`text-sm px-4 py-2 rounded-full transition-all ${selectedNewsCategory === null ? "bg-primary text-primary-foreground font-semibold" : "bg-surface border border-border text-text-sub hover:border-white/20 hover:text-foreground"}`}>All</button>
              {newsCategories.map((c) => (
                <button key={c} onClick={() => setSelectedNewsCategory(c)}
                  className={`text-sm px-4 py-2 rounded-full transition-all ${selectedNewsCategory === c ? "bg-primary text-primary-foreground font-semibold" : "bg-surface border border-border text-text-sub hover:border-white/20 hover:text-foreground"}`}>{c}</button>
              ))}
            </div>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNews.map((item) => {
            const formattedDate = new Date(item.date).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
            return (
              <FadeInSection key={item.id}>
                <div className="bg-surface border border-border rounded-2xl overflow-hidden hover:-translate-y-1.5 hover:border-white/[0.15] hover:shadow-[0_24px_48px_rgba(0,0,0,0.3)] transition-all duration-500">
                  {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-full font-semibold">{item.category}</span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="h-3 w-3" /><span>{formattedDate}</span></div>
                    </div>
                    <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                    <p className="text-sm text-text-sub leading-relaxed">{item.content}</p>
                  </div>
                </div>
              </FadeInSection>
            );
          })}
        </div>
        {filteredNews.length === 0 && <div className="text-center py-20"><p className="text-muted-foreground">해당 카테고리의 소식이 없습니다.</p></div>}
      </section>

      <hr className="border-border mx-6 sm:mx-12" />

      {/* ==================== CTA ==================== */}
      <section className="py-28">
        <FadeInSection>
          <div className="max-w-[1200px] mx-auto px-6 sm:px-12 text-center">
            <p className="text-xs font-bold tracking-[0.15em] uppercase text-primary mb-5">Join Us</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6">KHUX와 함께 성장하세요</h2>
            <p className="text-base text-text-sub max-w-2xl mx-auto leading-relaxed mb-10">
              UX/UI 디자인에 관심있는 모든 분들을 환영합니다.<br />함께 배우고, 연구하고, 성장하는 커뮤니티에 참여하세요.
            </p>
            <Link
              to="/recruit"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors text-sm font-bold"
            >
              4기 지원하기 <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </FadeInSection>
      </section>
    </div>
  );
}
