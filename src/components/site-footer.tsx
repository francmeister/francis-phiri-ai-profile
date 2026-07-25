import { Link } from "@tanstack/react-router";
import { Mail, Phone, Linkedin, Globe } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-navy-deep/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-teal text-primary-foreground shadow-glow">
              FP
            </span>
            <span className="font-display text-lg font-bold">Francis Phiri</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Data Engineer · Software Developer · Machine Learning Researcher.
            Johannesburg, South Africa.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/career" className="hover:text-primary">Career Profile</Link></li>
            <li><Link to="/academic" className="hover:text-primary">Academic Profile</Link></li>
            <li><Link to="/documents" className="hover:text-primary">Documents</Link></li>
            <li><Link to="/chat" className="hover:text-primary">Ask the AI Assistant</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Mail size={14} className="text-primary" /> francophiri97@gmail.com</li>
            <li className="flex items-center gap-2"><Phone size={14} className="text-primary" /> +27 74 538 5295</li>
            <li className="flex items-center gap-2">
              <Linkedin size={14} className="text-primary" />
              <a href="https://linkedin.com/in/francis-phiri-004b07111" target="_blank" rel="noreferrer" className="hover:text-primary">
                linkedin.com/in/francis-phiri-004b07111
              </a>
            </li>
            <li className="flex items-center gap-2"><Globe size={14} className="text-primary" /> francis-phiri.co.za</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Francis Phiri. Built with intent.
      </div>
    </footer>
  );
}
