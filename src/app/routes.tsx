import { createBrowserRouter } from "react-router";
import { Home } from "./pages/home";
import { ArticleDetail } from "./pages/article-detail";
import { Recruit } from "./pages/recruit";
import { AdminLogin } from "./pages/admin-login";
import { AdminDashboard } from "./pages/admin-dashboard";
import { AdminApplications } from "./pages/admin-applications";
import { Layout } from "./components/layout";
import { NotFound } from "./pages/not-found";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "recruit", Component: Recruit },
      { path: "articles/:id", Component: ArticleDetail },
      { path: "*", Component: NotFound },
    ],
  },
  {
    path: "/admin/login",
    Component: AdminLogin,
  },
  {
    path: "/admin/dashboard",
    Component: AdminDashboard,
  },
  {
    path: "/admin/applications",
    Component: AdminApplications,
  },
]);
