import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router";
import {
  ArrowRight,
  BookOpen,
  Newspaper,
  Users,
  Calendar,
  Target,
  Lightbulb,
  CheckCircle,
  Search,
  Tag,
  User,
  ChevronRight,
  X,
} from "lucide-react";
import type { Article, NewsItem, GalleryItem, Activity } from "../data/mock-data";
import { teams, articles as mockArticles, news as mockNews, gallery as mockGallery, activities as mockActivities } from "../data/mock-data";
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

  const categoryColors: Record<string, string> = {
    Recruitment: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    Project: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    Event: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    Announcement: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  };

  return (
    <div className="w-full">
      {/* ==================== HERO ==================== */}
      <section className="relative bg-background border-b border-border">
        <FadeInSection>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6 text-foreground">
                UX to Product Builder
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed">
                당신의 다음 커리어는 어디를 향하고 있나요?
                <br />
                지금 KHUX에서, AI 시대를 주도할 UXer로 성장하세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/recruit"
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-foreground text-background rounded-md hover:bg-foreground/85 transition-colors text-base font-medium"
                >
                  4기 지원하기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <button
                  onClick={() => {
                    const el = document.getElementById("about");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center justify-center px-8 py-3.5 border border-border text-foreground rounded-md hover:bg-muted transition-colors text-base"
                >
                  학회 소개
                </button>
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* Stats */}
      <section className="py-16 border-b border-border">
        <FadeInSection>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { icon: Users, value: "4", label: "전문 팀" },
                { icon: BookOpen, value: String(articles.length), label: "아티클" },
                { icon: Newspaper, value: String(news.length), label: "소식" },
                { icon: Calendar, value: "3", label: "기수 운영" },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="text-center">
                  <div className="flex justify-center mb-3"><Icon className="h-8 w-8 text-primary" /></div>
                  <div className="text-3xl mb-2">{value}</div>
                  <div className="text-sm text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* ==================== ABOUT ==================== */}
      <section id="about" className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto mb-20">
            <FadeInSection>
              <h2 className="text-3xl sm:text-4xl mb-4 text-center">About KHUX</h2>
              <p className="text-lg text-muted-foreground text-center mb-12">경희대학교 UX/UI 리서치 학회</p>

              <div className="space-y-6 text-foreground/90 leading-relaxed mb-12">
                <p>KHUX는 사용자 경험(UX)과 사용자 인터페이스(UI) 디자인에 관심 있는 학생들이 모여 함께 연구하고 성장하는 학회입니다. 우리는 이론적 학습뿐만 아니라 실제 프로젝트를 통해 실무 능력을 키우고, 업계 전문가들과의 네트워킹을 통해 미래를 준비합니다.</p>
                <p>매 학기 정기적인 세미나, 워크숍, 스터디를 진행하며, 멤버들이 자유롭게 아이디어를 공유하고 협업할 수 있는 환경을 제공합니다. 또한 다양한 기업 및 단체와의 협업 프로젝트를 통해 실무 경험을 쌓을 수 있는 기회를 만들어갑니다.</p>
              </div>
            </FadeInSection>

            {/* Mission & Vision */}
            <FadeInSection>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div className="p-8 bg-background rounded-lg border border-border hover:border-foreground/20 transition-colors">
                  <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center mb-5">
                    <Target className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="text-xl mb-3">Our Mission</h3>
                  <p className="text-muted-foreground leading-relaxed text-[0.9375rem]">
                    사용자 중심의 디자인 사고를 통해 더 나은 디지털 경험을 만들고, UX/UI 분야의 미래 인재를 양성합니다.
                  </p>
                </div>
                <div className="p-8 bg-background rounded-lg border border-border hover:border-foreground/20 transition-colors">
                  <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center mb-5">
                    <Lightbulb className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="text-xl mb-3">Our Vision</h3>
                  <p className="text-muted-foreground leading-relaxed text-[0.9375rem]">
                    국내 최고의 대학 UX/UI 커뮤니티로 성장하여, 업계와 학계를 연결하는 플랫폼이 되고자 합니다.
                  </p>
                </div>
              </div>
            </FadeInSection>

            {/* Teams */}
            <FadeInSection>
              <div className="text-center mb-12">
                <h3 className="text-2xl sm:text-3xl mb-4">Our Teams</h3>
                <p className="text-muted-foreground">KHUX를 이끌어가는 4개의 전문 팀을 소개합니다</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teams.map((team, index) => (
                  <div key={team.name} className="group p-8 bg-card border border-border rounded-lg hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xl">{index + 1}</div>
                      <h4 className="text-2xl">{team.name}</h4>
                    </div>
                    <p className="text-muted-foreground mb-6">{team.description}</p>
                    <div className="space-y-3">
                      <div className="text-sm uppercase tracking-wide text-muted-foreground mb-2">주요 업무</div>
                      {team.responsibilities.map((r) => (
                        <div key={r} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground/80">{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ==================== ARTICLES ==================== */}
      <section id="articles" className="py-20 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="max-w-3xl mb-12">
              <h2 className="text-3xl sm:text-4xl mb-4">Articles</h2>
              <p className="text-lg text-muted-foreground">KHUX 멤버들이 작성한 UX/UI 디자인 관련 아티클을 확인하세요.</p>
            </div>

            <div className="mb-8 space-y-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input type="text" placeholder="아티클 검색..." value={articleSearch} onChange={(e) => setArticleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Tags:</span>
                <button onClick={() => setSelectedTag(null)}
                  className={`text-sm px-3 py-1 rounded-md transition-colors ${selectedTag === null ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground hover:bg-accent/80"}`}>All</button>
                {allTags.map((tag) => (
                  <button key={tag} onClick={() => setSelectedTag(tag)}
                    className={`text-sm px-3 py-1 rounded-md transition-colors ${selectedTag === tag ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground hover:bg-accent/80"}`}>{tag}</button>
                ))}
              </div>
            </div>
          </FadeInSection>

          {loading ? (
            <div className="text-center py-20"><p className="text-muted-foreground">로딩 중...</p></div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => {
                const formattedDate = new Date(article.date).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
                return (
                  <FadeInSection key={article.id}>
                    <a href={`/articles/${article.id}`}
                      className="group block bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
                      <div className="relative h-48 overflow-hidden bg-muted">
                        <ImageWithFallback src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                          <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /><span>{formattedDate}</span></div>
                          <div className="flex items-center gap-1"><User className="h-3 w-3" /><span>{article.author}</span></div>
                        </div>
                        <h3 className="mb-2 group-hover:text-primary transition-colors">{article.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{article.excerpt}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Tag className="h-3 w-3 text-muted-foreground" />
                          {article.tags?.slice(0, 2).map((tag) => (
                            <span key={tag} className="text-xs px-2 py-1 bg-accent rounded-md text-accent-foreground">{tag}</span>
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
        </div>
      </section>

      {/* ==================== ACTIVITIES ==================== */}
      <section id="activities" className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="max-w-3xl mb-12">
              <h2 className="text-3xl sm:text-4xl mb-4">Activities</h2>
              <p className="text-lg text-muted-foreground">세미나, 프로젝트, 워크숍 등 다양한 활동을 소개합니다.</p>
            </div>

            <div className="mb-10">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">카테고리:</span>
                <button onClick={() => setSelectedActivityCategory(null)}
                  className={`text-sm px-4 py-2 rounded-md transition-colors ${selectedActivityCategory === null ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground hover:bg-accent/80"}`}>전체</button>
                {activityCategories.map((c) => (
                  <button key={c} onClick={() => setSelectedActivityCategory(c)}
                    className={`text-sm px-4 py-2 rounded-md transition-colors ${selectedActivityCategory === c ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground hover:bg-accent/80"}`}>{c}</button>
                ))}
              </div>
            </div>
          </FadeInSection>

          <div className="space-y-6">
            {filteredActivities.map((activity) => (
              <FadeInSection key={activity.id}>
                <div className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col md:flex-row">
                    {activity.imageUrl && (
                      <div className="md:w-80 flex-shrink-0">
                        <img src={activity.imageUrl} alt={activity.title} className="w-full h-48 md:h-full object-cover" loading="lazy" />
                      </div>
                    )}
                    <div className="flex-1 p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">{activity.category}</span>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground"><Calendar className="h-4 w-4" />{activity.date}</div>
                      </div>
                      <h3 className="text-xl md:text-2xl font-medium mb-3">{activity.title}</h3>
                      <p className="text-muted-foreground mb-4">{activity.description}</p>
                      {expandedActivityId === activity.id && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{activity.content}</p>
                        </div>
                      )}
                      <button onClick={() => setExpandedActivityId(expandedActivityId === activity.id ? null : activity.id)}
                        className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors mt-2">
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
        </div>
      </section>

      {/* ==================== GALLERY ==================== */}
      <section id="gallery" className="py-20 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="max-w-3xl mb-12">
              <h2 className="text-3xl sm:text-4xl mb-4">Gallery</h2>
              <p className="text-lg text-muted-foreground">KHUX의 다양한 활동 현장을 사진으로 만나보세요.</p>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">카테고리:</span>
                <button onClick={() => setSelectedGalleryCategory(null)}
                  className={`text-sm px-4 py-2 rounded-md transition-colors ${selectedGalleryCategory === null ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground hover:bg-accent/80"}`}>전체</button>
                {galleryCategories.map((c) => (
                  <button key={c} onClick={() => setSelectedGalleryCategory(c)}
                    className={`text-sm px-4 py-2 rounded-md transition-colors ${selectedGalleryCategory === c ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground hover:bg-accent/80"}`}>{c}</button>
                ))}
              </div>
            </div>
          </FadeInSection>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {filteredGallery.map((item) => (
              <FadeInSection key={item.id}>
                <div className="break-inside-avoid group cursor-pointer" onClick={() => setSelectedImage(item)}>
                  <div className="relative overflow-hidden rounded-xl border border-border bg-card">
                    <img src={item.imageUrl} alt={item.title} className="w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="inline-block text-xs px-2 py-1 bg-white/20 backdrop-blur-sm rounded-md text-white mb-2">{item.category}</span>
                      <h3 className="text-white font-medium">{item.title}</h3>
                      <p className="text-white/80 text-sm mt-1">{item.description}</p>
                    </div>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
          {filteredGallery.length === 0 && <div className="text-center py-20"><p className="text-muted-foreground">해당 카테고리의 사진이 없습니다.</p></div>}
        </div>

        {/* Lightbox */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setSelectedImage(null)}>
            <div className="relative max-w-4xl w-full bg-card rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                <X className="h-5 w-5" />
              </button>
              <img src={selectedImage.imageUrl} alt={selectedImage.title} className="w-full max-h-[70vh] object-contain bg-black" />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md">{selectedImage.category}</span>
                  <span className="text-sm text-muted-foreground">{selectedImage.date}</span>
                </div>
                <h2 className="text-xl font-medium mb-2">{selectedImage.title}</h2>
                <p className="text-muted-foreground">{selectedImage.description}</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ==================== NEWS ==================== */}
      <section id="news" className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="max-w-3xl mb-12">
              <h2 className="text-3xl sm:text-4xl mb-4">News</h2>
              <p className="text-lg text-muted-foreground">KHUX의 최신 소식과 활동 내역을 확인하세요.</p>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Category:</span>
                <button onClick={() => setSelectedNewsCategory(null)}
                  className={`text-sm px-4 py-2 rounded-md transition-colors ${selectedNewsCategory === null ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground hover:bg-accent/80"}`}>All</button>
                {newsCategories.map((c) => (
                  <button key={c} onClick={() => setSelectedNewsCategory(c)}
                    className={`text-sm px-4 py-2 rounded-md transition-colors ${selectedNewsCategory === c ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground hover:bg-accent/80"}`}>{c}</button>
                ))}
              </div>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => {
              const formattedDate = new Date(item.date).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
              return (
                <FadeInSection key={item.id}>
                  <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs px-2 py-1 rounded-md ${categoryColors[item.category] || "bg-accent text-accent-foreground"}`}>{item.category}</span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="h-3 w-3" /><span>{formattedDate}</span></div>
                      </div>
                      <h3 className="mb-3">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.content}</p>
                    </div>
                  </div>
                </FadeInSection>
              );
            })}
          </div>
          {filteredNews.length === 0 && <div className="text-center py-20"><p className="text-muted-foreground">해당 카테고리의 소식이 없습니다.</p></div>}
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="py-20 bg-foreground text-background">
        <FadeInSection>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl mb-4 text-background">KHUX와 함께 성장하세요</h2>
            <p className="text-base mb-8 text-background/75 max-w-2xl mx-auto leading-relaxed">
              UX/UI 디자인에 관심있는 모든 분들을 환영합니다.<br />함께 배우고, 연구하고, 성장하는 커뮤니티에 참여하세요.
            </p>
            <Link
              to="/recruit"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-background text-foreground rounded-md hover:bg-background/90 transition-colors text-sm font-medium"
            >
              4기 지원하기 <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </FadeInSection>
      </section>
    </div>
  );
}
