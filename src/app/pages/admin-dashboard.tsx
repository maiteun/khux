import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { 
  LogOut, 
  PlusCircle, 
  Edit2, 
  Trash2, 
  FileText, 
  Newspaper as NewspaperIcon,
  Users,
  Search,
  Loader2
} from "lucide-react";
import { supabase, API_BASE_URL } from "../../utils/supabase-client";
import type { Article, NewsItem } from "../data/mock-data";

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"articles" | "news">("articles");
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const token = localStorage.getItem("admin_access_token");
      if (!token) {
        navigate("/admin/login");
        return;
      }
      
      // Verify token is still valid
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        localStorage.removeItem("admin_access_token");
        navigate("/admin/login");
        return;
      }
      
      setAccessToken(token);
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (accessToken) {
      fetchData();
    }
  }, [accessToken]);

  const fetchData = async () => {
    setLoading(true);
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("admin_access_token");
    navigate("/admin/login");
  };

  const handleDeleteArticle = async (id: string) => {
    if (!accessToken || !confirm("정말로 이 아티클을 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        setArticles(articles.filter((a) => a.id !== id));
      } else {
        const error = await res.json();
        console.error("Failed to delete article:", error);
        alert("아티클 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("아티클 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!accessToken || !confirm("정말로 이 뉴스를 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/news/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        setNews(news.filter((n) => n.id !== id));
      } else {
        const error = await res.json();
        console.error("Failed to delete news:", error);
        alert("뉴스 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error deleting news:", error);
      alert("뉴스 삭제 중 오류가 발생했습니다.");
    }
  };

  const filteredArticles = articles.filter(
    (article) =>
      article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNews = news.filter((item) =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">KHUX 관리자</h1>
                <p className="text-xs text-muted-foreground">콘텐츠 관리 시스템</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <LogOut className="h-4 w-4" />
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">전체 아티클</p>
                <p className="text-2xl font-bold">{articles.length}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <NewspaperIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">전체 뉴스</p>
                <p className="text-2xl font-bold">{news.length}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">전체 팀</p>
                <p className="text-2xl font-bold">4</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-border">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("articles")}
                className={`pb-4 px-2 font-medium transition-colors relative ${
                  activeTab === "articles"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  아티클 관리
                </span>
                {activeTab === "articles" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("news")}
                className={`pb-4 px-2 font-medium transition-colors relative ${
                  activeTab === "news"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2">
                  <NewspaperIcon className="h-4 w-4" />
                  뉴스 관리
                </span>
                {activeTab === "news" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === "articles" ? "아티클 검색..." : "뉴스 검색..."}
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
            <PlusCircle className="h-5 w-5" />
            {activeTab === "articles" ? "아티클 추가" : "뉴스 추가"}
          </button>
        </div>

        {/* Content List */}
        {activeTab === "articles" ? (
          <div className="space-y-4">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                아티클이 없습니다
              </div>
            ) : (
              filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} onDelete={handleDeleteArticle} />
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNews.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                뉴스가 없습니다
              </div>
            ) : (
              filteredNews.map((item) => (
                <NewsCardAdmin key={item.id} news={item} onDelete={handleDeleteNews} />
              ))
            )}
          </div>
        )}

        {/* Supabase Notice */}
        <div className="mt-8 p-6 bg-muted/50 border border-border rounded-xl">
          <h4 className="font-medium mb-2">✅ Supabase 연동 완료</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Supabase 데이터베이스와 성공적으로 연결되었습니다. Articles와 News를 실시간으로 관리할 수 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={async () => {
                if (confirm("샘플 데이터를 초기화하시겠습니까? (기존 데이터가 있다면 덮어씌워집니다)")) {
                  try {
                    const res = await fetch(`${API_BASE_URL}/init-sample-data`, {
                      method: "POST",
                    });
                    const data = await res.json();
                    if (data.success) {
                      alert(`샘플 데이터가 초기화되었습니다.\n- Articles: ${data.counts.articles}개\n- News: ${data.counts.news}개`);
                      fetchData();
                    } else {
                      alert("샘플 데이터 초기화에 실패했습니다.");
                    }
                  } catch (error) {
                    console.error("Error initializing sample data:", error);
                    alert("샘플 데이터 초기화 중 오류가 발생했습니다.");
                  }
                }
              }}
              className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors"
            >
              샘플 데이터 초기화
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Article Card Component
function ArticleCard({ article, onDelete }: { article: Article, onDelete: (id: string) => void }) {
  return (
    <div className="p-6 bg-card border border-border rounded-xl hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {article.team}
            </span>
            <span className="text-sm text-muted-foreground">{article.date}</span>
          </div>
          <h3 className="text-lg font-medium mb-2">{article.title}</h3>
          <p className="text-sm text-muted-foreground mb-3">{article.excerpt}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>작성자: {article.author}</span>
            <span>•</span>
            <span>태그: {article.tags.join(", ")}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Edit2 className="h-4 w-4" />
          </button>
          <button className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors" onClick={() => onDelete(article.id)}>
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// News Card Component
function NewsCardAdmin({ news, onDelete }: { news: NewsItem, onDelete: (id: string) => void }) {
  return (
    <div className="p-6 bg-card border border-border rounded-xl hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {news.category}
            </span>
            <span className="text-sm text-muted-foreground">{news.date}</span>
          </div>
          <h3 className="text-lg font-medium mb-2">{news.title}</h3>
          <p className="text-sm text-muted-foreground">{news.content}</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Edit2 className="h-4 w-4" />
          </button>
          <button className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors" onClick={() => onDelete(news.id)}>
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}