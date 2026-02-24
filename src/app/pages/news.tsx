import { useState } from "react";
import { news } from "../data/mock-data";
import { NewsCard } from "../components/news-card";

export function News() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get all unique categories
  const categories = Array.from(new Set(news.map((item) => item.category)));

  // Filter news
  const filteredNews = selectedCategory
    ? news.filter((item) => item.category === selectedCategory)
    : news;

  return (
    <div className="w-full py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl sm:text-5xl mb-4">News</h1>
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
    </div>
  );
}
