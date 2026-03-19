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
  Loader2,
  X
} from "lucide-react";
import { supabase, apiFetch, apiFetchAuth, uploadImage } from "../../utils/supabase-client";
import type { Article, NewsItem } from "../data/mock-data";

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"articles" | "news">("articles");
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        navigate("/admin/login");
        return;
      }
      setAuthenticated(true);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/admin/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (authenticated) {
      fetchData();
    }
  }, [authenticated]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const articlesRes = await apiFetch("/articles");
      const articlesData = await articlesRes.json();
      setArticles(articlesData.articles || []);

      const newsRes = await apiFetch("/news");
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
    navigate("/admin/login");
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("정말로 이 아티클을 삭제하시겠습니까?")) return;

    try {
      const res = await apiFetchAuth(`/articles/${id}`, { method: "DELETE" });

      if (res.ok) {
        setArticles(articles.filter((a) => a.id !== id));
      } else {
        const error = await res.json();
        console.error("Failed to delete article:", error);
        alert("아티클 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("인증이 만료되었습니다. 다시 로그인해주세요.");
      navigate("/admin/login");
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm("정말로 이 뉴스를 삭제하시겠습니까?")) return;

    try {
      const res = await apiFetchAuth(`/news/${id}`, { method: "DELETE" });

      if (res.ok) {
        setNews(news.filter((n) => n.id !== id));
      } else {
        const error = await res.json();
        console.error("Failed to delete news:", error);
        alert("뉴스 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error deleting news:", error);
      alert("인증이 만료되었습니다. 다시 로그인해주세요.");
      navigate("/admin/login");
    }
  };

  const handleEditArticle = (article: Article) => {
    setEditingId(article.id);
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      author: article.author,
      team: article.team,
      date: article.date,
      tags: article.tags?.join(", ") || "",
    });
    setImagePreview(article.imageUrl || null);
    setActiveTab("articles");
    setShowAddModal(true);
  };

  const handleEditNews = (newsItem: NewsItem) => {
    setEditingId(newsItem.id);
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      date: newsItem.date,
      category: newsItem.category,
    });
    setImagePreview((newsItem as any).imageUrl || null);
    setActiveTab("news");
    setShowAddModal(true);
  };

  const handleUpdateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setSubmitting(true);
    try {
      let imageUrl = imagePreview || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800";
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const res = await apiFetchAuth(`/articles/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          author: formData.author,
          team: formData.team,
          date: formData.date || new Date().toISOString().split('T')[0],
          imageUrl,
          tags: formData.tags ? formData.tags.split(',').map((t: string) => t.trim()) : [],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setArticles(articles.map(a => a.id === editingId ? data.article : a));
        setShowAddModal(false);
        setFormData({});
        setEditingId(null);
        clearImage();
        alert("아티클이 수정되었습니다!");
      } else {
        const error = await res.json();
        console.error("Failed to update article:", error);
        alert("아티클 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error updating article:", error);
      alert("인증이 만료되었습니다. 다시 로그인해주세요.");
      navigate("/admin/login");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setSubmitting(true);
    try {
      let imageUrl: string | undefined = imagePreview || undefined;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const res = await apiFetchAuth(`/news/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          date: formData.date || new Date().toISOString().split('T')[0],
          category: formData.category,
          ...(imageUrl && { imageUrl }),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setNews(news.map(n => n.id === editingId ? data.news : n));
        setShowAddModal(false);
        setFormData({});
        setEditingId(null);
        clearImage();
        alert("뉴스가 수정되었습니다!");
      } else {
        const error = await res.json();
        console.error("Failed to update news:", error);
        alert("뉴스 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error updating news:", error);
      alert("인증이 만료되었습니다. 다시 로그인해주세요.");
      navigate("/admin/login");
    } finally {
      setSubmitting(false);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let imageUrl = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800";
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const res = await apiFetchAuth("/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          author: formData.author,
          team: formData.team,
          date: formData.date || new Date().toISOString().split('T')[0],
          imageUrl,
          tags: formData.tags ? formData.tags.split(',').map((t: string) => t.trim()) : [],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setArticles([data.article, ...articles]);
        setShowAddModal(false);
        setFormData({});
        clearImage();
        alert("아티클이 추가되었습니다!");
      } else {
        const error = await res.json();
        console.error("Failed to add article:", error);
        alert("아티클 추가에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error adding article:", error);
      alert("인증이 만료되었습니다. 다시 로그인해주세요.");
      navigate("/admin/login");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let imageUrl: string | undefined;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const res = await apiFetchAuth("/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          date: formData.date || new Date().toISOString().split('T')[0],
          category: formData.category,
          ...(imageUrl && { imageUrl }),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setNews([data.news, ...news]);
        setShowAddModal(false);
        setFormData({});
        clearImage();
        alert("뉴스가 추가되었습니다!");
      } else {
        const error = await res.json();
        console.error("Failed to add news:", error);
        alert("뉴스 추가에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error adding news:", error);
      alert("인증이 만료되었습니다. 다시 로그인해주세요.");
      navigate("/admin/login");
    } finally {
      setSubmitting(false);
    }
  };

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
          <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors" onClick={() => setShowAddModal(true)}>
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
                <ArticleCard key={article.id} article={article} onDelete={handleDeleteArticle} onEdit={handleEditArticle} />
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
                <NewsCardAdmin key={item.id} news={item} onDelete={handleDeleteNews} onEdit={handleEditNews} />
              ))
            )}
          </div>
        )}

        {/* Supabase Notice */}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => { setShowAddModal(false); setEditingId(null); clearImage(); }}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background border border-border rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {editingId
                  ? (activeTab === "articles" ? "아티클 수정" : "뉴스 수정")
                  : (activeTab === "articles" ? "아티클 추가" : "뉴스 추가")}
              </h2>
              <button onClick={() => { setShowAddModal(false); setEditingId(null); clearImage(); }} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={editingId
              ? (activeTab === "articles" ? handleUpdateArticle : handleUpdateNews)
              : (activeTab === "articles" ? handleAddArticle : handleAddNews)} className="p-6 space-y-4">
              {activeTab === "articles" ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">제목 *</label>
                    <input
                      type="text"
                      required
                      value={formData.title || ""}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="아티클 제목"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">요약 *</label>
                    <textarea
                      required
                      value={formData.excerpt || ""}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                      rows={2}
                      placeholder="아티클 요약"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">본문 *</label>
                    <textarea
                      required
                      value={formData.content || ""}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                      rows={6}
                      placeholder="아티클 본문"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">작성자 *</label>
                      <input
                        type="text"
                        required
                        value={formData.author || ""}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="작성자 이름"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">팀 *</label>
                      <select
                        required
                        value={formData.team || ""}
                        onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        <option value="">팀 선택</option>
                        <option value="Leaders">Leaders</option>
                        <option value="Education">Education</option>
                        <option value="Operations">Operations</option>
                        <option value="Growth">Growth</option>
                        <option value="Brand">Brand</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">태그 (쉼표로 구분)</label>
                    <input
                      type="text"
                      value={formData.tags || ""}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="UX, Design, Research"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">이미지 첨부 (선택)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                    {imagePreview && (
                      <div className="mt-3 relative inline-block">
                        <img src={imagePreview} alt="미리보기" className="max-h-40 rounded-lg border border-border" />
                        <button
                          type="button"
                          onClick={clearImage}
                          className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">제목 *</label>
                    <input
                      type="text"
                      required
                      value={formData.title || ""}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="뉴스 제목"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">내용 *</label>
                    <textarea
                      required
                      value={formData.content || ""}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                      rows={6}
                      placeholder="뉴스 내용"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">카테고리 *</label>
                    <div className="flex gap-2">
                      <select
                        value={["Recruitment", "Event", "Project", "Announcement"].includes(formData.category || "") ? formData.category : "__custom__"}
                        onChange={(e) => {
                          if (e.target.value === "__custom__") {
                            setFormData({ ...formData, category: "" });
                          } else {
                            setFormData({ ...formData, category: e.target.value });
                          }
                        }}
                        className="w-1/2 px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        <option value="">카테고리 선택</option>
                        <option value="Recruitment">Recruitment</option>
                        <option value="Event">Event</option>
                        <option value="Project">Project</option>
                        <option value="Announcement">Announcement</option>
                        <option value="__custom__">직접 입력</option>
                      </select>
                      {(!formData.category || !["Recruitment", "Event", "Project", "Announcement"].includes(formData.category)) && (
                        <input
                          type="text"
                          required
                          value={formData.category === "__custom__" ? "" : formData.category || ""}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          placeholder="카테고리 직접 입력"
                          className="w-1/2 px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">이미지 첨부 (선택)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                    {imagePreview && (
                      <div className="mt-3 relative inline-block">
                        <img src={imagePreview} alt="미리보기" className="max-h-40 rounded-lg border border-border" />
                        <button
                          type="button"
                          onClick={clearImage}
                          className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingId(null); clearImage(); }}
                  className="flex-1 px-6 py-3 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
                  disabled={submitting}
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {submitting ? (editingId ? "수정 중..." : "추가 중...") : (editingId ? "수정하기" : "추가하기")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Article Card Component
function ArticleCard({ article, onDelete, onEdit }: { article: Article, onDelete: (id: string) => void, onEdit: (article: Article) => void }) {
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
          <button className="p-2 hover:bg-muted rounded-lg transition-colors" onClick={() => onEdit(article)}>
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
function NewsCardAdmin({ news, onDelete, onEdit }: { news: NewsItem, onDelete: (id: string) => void, onEdit: (news: NewsItem) => void }) {
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
          <button className="p-2 hover:bg-muted rounded-lg transition-colors" onClick={() => onEdit(news)}>
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