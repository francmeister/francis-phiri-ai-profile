import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logoAsset from "@/assets/francis-phiri-logo.png.asset.json";


const nav = [
  { to: "/", label: "Home" },
  { to: "/career", label: "Career" },
  { to: "/academic", label: "Academic" },
  { to: "/documents", label: "Documents" },
  { to: "/chat", label: "Ask AI" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center" aria-label="Francis Phiri — Home">
          <span className="inline-flex items-center rounded-xl bg-white px-3 py-1.5 shadow-glow">
            <img
              src={logoAsset.url}
              alt="Francis Phiri — Data Engineer & ML Researcher"
              className="h-7 w-auto sm:h-8"
              loading="eager"
              decoding="async"
            />
          </span>
        </Link>


        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/documents"
            className="ml-2 rounded-md bg-gradient-teal px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105"
          >
            Download CV
          </Link>
        </nav>
        <button
          className="md:hidden rounded-md p-2 text-foreground"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur-md md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-card hover:text-foreground"
                activeProps={{ className: "text-foreground bg-card" }}
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
