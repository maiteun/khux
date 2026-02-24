import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight, BookOpen, Newspaper, Users, CheckCircle, Search, Target, Lightbulb, Crown, Settings, GraduationCap, TrendingUp } from "lucide-react";
import { teams } from "../data/mock-data";
import type { Article, NewsItem } from "../data/mock-data";
import { ArticleCard } from "../components/article-card";
import { NewsCard } from "../components/news-card";
import { API_BASE_URL } from "../../utils/supabase-client";

export function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch articles
        const articlesRes = await fetch(`${API_BASE_URL}/articles`);
        const articlesData = await articlesRes.json();
        setArticles(articlesData.articles || []);

        // Fetch news
        const newsRes = await fetch(`${API_BASE_URL}/news`);
        const newsData = await newsRes.json();
        setNews(newsData.news || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get all unique tags and categories
  const allTags = Array.from(
    new Set(articles.flatMap((article) => article.tags || []))
  );
  const categories = Array.from(new Set(news.map((item) => item.category)));

  // Filter articles
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? article.tags?.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  // Filter news
  const filteredNews = selectedCategory
    ? news.filter((item) => item.category === selectedCategory)
    : news;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-muted/50 to-background py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6">
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                UX to Product Builder
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8">
              당신의 다음 커리어는 어디를 향하고 있나요?
              <br />
              지금 KHUX에서, AI 시대를 주도할 UXer로 성장하세요.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl mb-2">4</div>
              <div className="text-sm text-muted-foreground">팀</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl mb-2">{articles.length}</div>
              <div className="text-sm text-muted-foreground">아티클</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <Newspaper className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl mb-2">{news.length}</div>
              <div className="text-sm text-muted-foreground">소식</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-b from-background via-muted/20 to-background scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* About KHUX */}
          <div className="max-w-5xl mx-auto mb-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                About KHUX
              </h2>
              <p className="text-xl text-muted-foreground">
                경희대학교 UX/UI 리서치 학회
              </p>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="space-y-6">
                <div className="p-6 bg-card border border-border rounded-xl hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg mb-2">실무 중심 학습</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        이론적 학습뿐만 아니라 실제 프로젝트를 통해 실무 능력을 키우고, 
                        업계 전문가들과의 네트워킹을 통해 미래를 준비합니다.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-card border border-border rounded-xl hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg mb-2">협업과 성장</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        매 학기 정기적인 세미나, 워크숍, 스터디를 진행하며, 
                        멤버들이 자유롭게 아이디어를 공유하고 협업할 수 있는 환경을 제공합니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-card border border-border rounded-xl hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg mb-2">전문 팀 시스템</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        3기부터 모든 학회원이 전문 부서(Leaders, Education, Operations, Growth)에 속하여 
                        각자의 강점을 살린 업무를 담당합니다.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-card border border-border rounded-xl hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg mb-2">실무 프로젝트</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        다양한 기업 및 단체와의 협업 프로젝트를 통해 실무 경험을 쌓을 수 있는 
                        기회를 만들어갑니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="max-w-5xl mx-auto mb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative p-10 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent rounded-2xl border border-primary/20 overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
                    <Target className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl mb-4">Our Mission</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    사용자 중심의 디자인 사고를 통해 더 나은 디지털 경험을 만들고,
                    UX/UI 분야의 미래 인재를 양성합니다.
                  </p>
                </div>
              </div>
              
              <div className="relative p-10 bg-gradient-to-br from-accent via-accent/30 to-transparent rounded-2xl border border-border overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/30 rounded-full blur-3xl group-hover:bg-accent/40 transition-all" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mb-6">
                    <Lightbulb className="h-7 w-7 text-accent-foreground" />
                  </div>
                  <h3 className="text-2xl mb-4">Our Vision</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    국내 최고의 대학 UX/UI 커뮤니티로 성장하여, 업계와 학계를 연결하는
                    플랫폼이 되고자 합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Teams */}
          <div className="max-w-6xl mx-auto mb-20">
            <div className="text-center mb-16">
              <h3 className="text-3xl sm:text-4xl mb-4">Our Teams</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                KHUX를 이끌어가는 4개의 전문 팀을 소개합니다
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Leaders */}
              <div className="group relative p-8 bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 rounded-2xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all" />
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/10 flex items-center justify-center">
                      <Crown className="h-8 w-8 text-amber-600" />
                    </div>
                    <h4 className="text-2xl">Leaders</h4>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {teams[0].description}
                  </p>
                  <div className="space-y-2.5">
                    {teams[0].responsibilities.slice(0, 3).map((responsibility) => (
                      <div key={responsibility} className="flex items-start gap-2.5">
                        <CheckCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground/80">{responsibility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="group relative p-8 bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-2xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all" />
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center">
                      <GraduationCap className="h-8 w-8 text-blue-600" />
                    </div>
                    <h4 className="text-2xl">Education</h4>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {teams[1].description}
                  </p>
                  <div className="space-y-2.5">
                    {teams[1].responsibilities.slice(0, 3).map((responsibility) => (
                      <div key={responsibility} className="flex items-start gap-2.5">
                        <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground/80">{responsibility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Operations */}
              <div className="group relative p-8 bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-2xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all" />
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 flex items-center justify-center">
                      <Settings className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h4 className="text-2xl">Operations</h4>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {teams[2].description}
                  </p>
                  <div className="space-y-2.5">
                    {teams[2].responsibilities.slice(0, 3).map((responsibility) => (
                      <div key={responsibility} className="flex items-start gap-2.5">
                        <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground/80">{responsibility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Growth */}
              <div className="group relative p-8 bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-2xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all" />
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/10 flex items-center justify-center">
                      <TrendingUp className="h-8 w-8 text-purple-600" />
                    </div>
                    <h4 className="text-2xl">Growth</h4>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {teams[3].description}
                  </p>
                  <div className="space-y-2.5">
                    {teams[3].responsibilities.slice(0, 3).map((responsibility) => (
                      <div key={responsibility} className="flex items-start gap-2.5">
                        <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground/80">{responsibility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Join CTA */}
          <div className="max-w-4xl mx-auto text-center p-12 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 rounded-2xl border border-primary/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="relative">
              <h3 className="text-3xl mb-4">Join KHUX</h3>
              <p className="text-lg text-muted-foreground mb-6">
                KHUX는 UX/UI에 열정이 있는 모든 학생들에게 열려있습니다.
                <br />
                함께 성장할 새로운 멤버를 기다립니다.
              </p>
              <p className="text-sm text-muted-foreground">
                리크루팅 일정은 News 섹션에서 확인하실 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section id="articles" className="py-20 bg-muted/30 scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <h2 className="text-4xl sm:text-5xl mb-4">Articles</h2>
            <p className="text-lg text-muted-foreground">
              KHUX 멤버들이 작성한 UX/UI 디자인 관련 아티클을 확인하세요.
              실무 경험과 연구 결과를 공유합니다.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="아티클 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Tags:</span>
              <button
                onClick={() => setSelectedTag(null)}
                className={`text-sm px-3 py-1 rounded-md transition-colors ${
                  selectedTag === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-accent-foreground hover:bg-accent/80"
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`text-sm px-3 py-1 rounded-md transition-colors ${
                    selectedTag === tag
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent text-accent-foreground hover:bg-accent/80"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">
                검색 결과가 없습니다. 다른 검색어를 시도해보세요.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-20 bg-background scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <h2 className="text-4xl sm:text-5xl mb-4">News</h2>
            <p className="text-lg text-muted-foreground">
              KHUX의 최신 소식과 활동 내역을 확인하세요.
              학회의 다양한 이벤트와 공지사항을 전해드립니다.
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Category:</span>
              <button
                onClick={() => setSelectedCategory(null)}
                className={`text-sm px-4 py-2 rounded-md transition-colors ${
                  selectedCategory === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-accent-foreground hover:bg-accent/80"
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`text-sm px-4 py-2 rounded-md transition-colors ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent text-accent-foreground hover:bg-accent/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl mb-4">
            KHUX와 함께 성장하세요
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            UX/UI 디자인에 관심있는 모든 분들을 환영합니다.
            <br />
            함께 배우고, 연구하고, 성장하는 커뮤니티에 참여하세요.
          </p>
          <button
            onClick={() => scrollToSection("about")}
            className="inline-flex items-center justify-center px-6 py-3 bg-primary-foreground text-primary rounded-lg hover:bg-primary-foreground/90 transition-colors"
          >
            자세히 알아보기
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  );
}