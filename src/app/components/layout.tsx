import { Outlet, Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const isHome = location.pathname === "/";

  const scrollNavItems = [
    { id: "about", label: "About" },
    { id: "articles", label: "Articles" },
    { id: "activities", label: "Activities" },
    { id: "gallery", label: "Gallery" },
    { id: "news", label: "News" },
  ];

  // Track active section on scroll (only on home page)
  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
      const sections = scrollNavItems.map(item => document.getElementById(item.id));
      const scrollPos = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(scrollNavItems[i].id);
          return;
        }
      }
      setActiveSection("");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // Scroll to top on non-home route change
  useEffect(() => {
    if (!isHome) {
      window.scrollTo(0, 0);
    }
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const scrollToSection = (id: string) => {
    if (!isHome) {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    if (!isHome) {
      window.location.href = "/";
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <button onClick={scrollToTop} className="flex items-center">
              <span className="text-lg font-extrabold tracking-tight" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}>
                KH<span className="text-primary">UX</span>
              </span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {scrollNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? "text-foreground"
                      : "text-text-sub hover:text-foreground"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <Link
                to="/recruit"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === "/recruit"
                    ? "text-foreground"
                    : "text-text-sub hover:text-foreground"
                }`}
              >
                Recruit
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 space-y-1">
              {scrollNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-4 py-2.5 rounded-lg transition-colors text-sm ${
                    activeSection === item.id
                      ? "text-foreground bg-surface2"
                      : "text-text-sub hover:text-foreground hover:bg-surface2"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <Link
                to="/recruit"
                onClick={() => setMobileMenuOpen(false)}
                className={`block w-full text-left px-4 py-2.5 rounded-lg transition-colors text-sm ${
                  location.pathname === "/recruit"
                    ? "text-foreground bg-surface2"
                    : "text-text-sub hover:text-foreground hover:bg-surface2"
                }`}
              >
                Recruit
              </Link>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="text-base font-extrabold tracking-tight" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}>
              KH<span className="text-primary">UX</span>
            </span>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} KHUX — Kyung Hee University UX Lab
            </p>
            <Link
              to="/admin/login"
              className="text-xs text-muted-foreground/30 hover:text-muted-foreground transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
