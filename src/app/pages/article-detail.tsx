import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router";
import { ArrowLeft, Calendar, User, Tag, Loader2 } from "lucide-react";
import type { Article } from "../data/mock-data";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { apiFetch } from "../../utils/supabase-client";
import { MarkdownRenderer } from "../components/markdown-editor";

export function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;

      try {
        const res = await apiFetch(`/articles/${id}`);
        if (!res.ok) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setArticle(data.article);

        const allRes = await apiFetch("/articles");
        const allData = await allRes.json();
        const related = (allData.articles || [])
          .filter((a: Article) => a.id !== id)
          .slice(0, 2);
        setRelatedArticles(related);
      } catch (error) {
        console.error("Error fetching article:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !article) {
    return <Navigate to="/" replace />;
  }

  const formattedDate = new Date(article.date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            to="/articles"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            아티클 목록으로
          </Link>

          {/* Article Header */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl mb-6">{article.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="px-3 py-1 bg-accent text-accent-foreground rounded-md">
                {article.team}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm px-3 py-1 bg-accent rounded-md text-accent-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative h-64 sm:h-96 mb-12 rounded-lg overflow-hidden bg-muted">
            <ImageWithFallback
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Content */}
          <MarkdownRenderer content={article.content} />

          {/* Related Articles */}
          <div className="mt-16 pt-8 border-t border-border">
            <h3 className="mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedArticles.map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  to={`/articles/${relatedArticle.id}`}
                  className="group block p-4 border border-border rounded-lg hover:shadow-md transition-shadow"
                >
                  <h4 className="mb-2 group-hover:text-primary transition-colors">
                    {relatedArticle.title}
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {relatedArticle.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}