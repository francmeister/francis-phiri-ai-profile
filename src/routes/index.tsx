import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Database, Code2, BrainCircuit, Radio, Download, MessageCircle, Sparkles } from "lucide-react";
import { PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Francis Phiri — Data Engineer & ML Researcher" },
      {
        name: "description",
        content:
          "Francis Phiri — Data Engineer, Software Developer and ML Researcher. Junior Data Engineer at KHM Technology; MSc Wits; SATNAC 2024 & IEEE GLOBECOM 2025.",
      },
      { property: "og:title", content: "Francis Phiri — Data Engineer & ML Researcher" },
      { property: "og:description", content: "Data platforms, intelligent systems, and 5G/6G edge-intelligence research." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://francis-phiri-ai-profile.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://francis-phiri-ai-profile.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Francis Phiri",
          jobTitle: "Data Engineer, Software Developer, Machine Learning Researcher",
          url: "https://francis-phiri-ai-profile.lovable.app/",
          email: "mailto:francophiri97@gmail.com",
          address: { "@type": "PostalAddress", addressLocality: "Johannesburg", addressCountry: "ZA" },
          alumniOf: { "@type": "CollegeOrUniversity", name: "University of the Witwatersrand" },
          worksFor: { "@type": "Organization", name: "KHM Technology" },
          sameAs: ["https://linkedin.com/in/francis-phiri-004b07111"],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Francis Phiri",
          url: "https://francis-phiri-ai-profile.lovable.app/",
        }),
      },
    ],
  }),
  component: Home,
});

const pillars = [
  { icon: Database, title: "Data Engineering", desc: "Medallion warehouses, SQL/Python ETL, Airbyte, Metabase, Power BI." },
  { icon: Code2, title: "Software Development", desc: "ASP.NET Web APIs, Kafka, Docker, product tooling and integrations." },
  { icon: BrainCircuit, title: "ML Research", desc: "Deep reinforcement learning, federated learning, resource allocation." },
  { icon: Radio, title: "5G / 6G Edge Intelligence", desc: "Energy-aware offloading, eMBB/URLLC coexistence, mobile edge computing." },
];

function Home() {
  return (
    <PageShell>
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero">
        <div className="pointer-events-none absolute -top-40 left-1/3 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute top-40 right-10 h-72 w-72 rounded-full bg-teal-glow/10 blur-3xl animate-float-slow" />
        <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-6 md:pt-28">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles size={12} /> Available for engineering & PhD opportunities
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] sm:text-6xl md:text-7xl">
              Francis <span className="text-gradient-teal">Phiri</span>
              <span className="sr-only"> — Data Engineer & Machine Learning Researcher</span>
            </h1>
            <p className="mt-4 text-lg font-semibold text-primary sm:text-xl">
              Data Engineer · Software Developer · Machine Learning Researcher
            </p>
            <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
              I build data platforms, intelligent systems and research-driven technology that turns complex
              information into useful decisions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/career"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-teal px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105"
              >
                View Career Profile <ArrowRight size={16} />
              </Link>
              <Link
                to="/academic"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/50"
              >
                View Academic Profile
              </Link>
              <Link
                to="/documents"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground hover:border-primary/50"
              >
                <Download size={16} /> Download CV
              </Link>
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-5 py-3 text-sm font-semibold text-primary hover:bg-primary/20"
              >
                <MessageCircle size={16} /> Ask the AI Assistant
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">What I work on</h2>
          <p className="mt-3 text-muted-foreground">
            Four intersecting practices — production data engineering, software craft, applied ML, and
            wireless-edge research.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <div
              key={p.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card-elevated p-6 shadow-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-teal text-primary-foreground shadow-glow">
                <p.icon size={20} />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="border-y border-border bg-navy-deep/40">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-3">
          <Stat value="2" label="Peer-reviewed publications" sub="SATNAC 2024 · IEEE GLOBECOM 2025" />
          <Stat value="MSc" label="Wits — Electrical & Information Engineering" sub="TD3 RL for 5G MEC" />
          <Stat value="🏆" label="SATNAC 2024" sub="Second-Best Paper Award" />
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Registered with:</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary">
              <Sparkles size={11} /> ECSA Candidate Engineer · Reg. 2025209354
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary">
              <Sparkles size={11} /> IITPSA Associate Member · No. 20250811770
            </span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-card-elevated p-8 shadow-card md:p-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Recruiting, hiring, or supervising a PhD?
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Ask the AI assistant a specific question, or download the CV that fits your context.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/chat" className="inline-flex items-center gap-2 rounded-lg bg-gradient-teal px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow">
                <MessageCircle size={16} /> Ask Francis AI
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold hover:border-primary/50">
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Stat({ value, label, sub }: { value: string; label: string; sub: string }) {
  return (
    <div>
      <div className="font-display text-4xl font-bold text-gradient-teal">{value}</div>
      <div className="mt-2 font-semibold text-foreground">{label}</div>
      <div className="text-sm text-muted-foreground">{sub}</div>
    </div>
  );
}
