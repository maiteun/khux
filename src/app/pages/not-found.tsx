import { Link } from "react-router";
import { Home } from "lucide-react";

export function NotFound() {
  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl sm:text-8xl mb-4 text-primary">404</h1>
        <h2 className="text-2xl sm:text-3xl mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          죄송합니다. 요청하신 페이지를 찾을 수 없습니다.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Home className="mr-2 h-5 w-5" />
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
