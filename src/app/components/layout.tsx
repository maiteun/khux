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
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <button onClick={scrollToTop} className="flex items-center">
              <div className="text-xl font-semibold tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>KHUX</div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {scrollNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium tracking-wide transition-colors uppercase ${
                    activeSection === item.id
                      ? "text-foreground"
                      : "text-foreground/60 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <Link
                to="/recruit"
                className={`text-sm font-medium tracking-wide transition-colors uppercase ${
                  location.pathname === "/recruit"
                    ? "text-foreground"
                    : "text-foreground/60 hover:text-foreground"
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
            <nav className="md:hidden py-4 space-y-2">
              {scrollNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeSection === item.id
                      ? "text-foreground bg-accent"
                      : "text-foreground/70 hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <Link
                to="/recruit"
                onClick={() => setMobileMenuOpen(false)}
                className={`block w-full text-left px-4 py-2 rounded-md transition-colors ${
                  location.pathname === "/recruit"
                    ? "text-foreground bg-accent"
                    : "text-foreground/70 hover:text-foreground hover:bg-accent"
                }`}
              >
                Recruit
              </Link>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="mb-3">KHUX</h3>
              <p className="text-sm text-muted-foreground">
                Kyunghee University UX/UI Research Society
              </p>
            </div>
            <div>
              <h4 className="mb-3">Teams</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Leaders</li>
                <li>Education</li>
                <li>Operations</li>
                <li>Growth</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3">Pages</h4>
              <ul className="space-y-2">
                {scrollNavItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
                <li>
                  <Link to="/recruit" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Recruit
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3">Contact</h4>
              <p className="text-sm text-muted-foreground">
                Email: khux@khu.ac.kr
              </p>
              <Link
                to="/admin/login"
                className="inline-block mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} KHUX. All rights reserved.{" "}
            <Link
              to="/admin/login"
              className="opacity-30 hover:opacity-100 transition-opacity"
            >
              &bull;
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
