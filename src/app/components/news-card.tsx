import { Calendar, Tag } from "lucide-react";
import { NewsItem } from "../data/mock-data";

interface NewsCardProps {
  news: NewsItem;
}

export function NewsCard({ news }: NewsCardProps) {
  const formattedDate = new Date(news.date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const categoryColors: Record<string, string> = {
    Recruitment: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    Project: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    Event: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    Announcement: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-xs px-2 py-1 rounded-md ${
            categoryColors[news.category] || "bg-accent text-accent-foreground"
          }`}
        >
          {news.category}
        </span>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{formattedDate}</span>
        </div>
      </div>
      <h3 className="mb-3">{news.title}</h3>
      <p className="text-sm text-muted-foreground">{news.content}</p>
    </div>
  );
}
