import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Download, ArrowRight, ShieldCheck, BadgeCheck } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/career")({
  head: () => ({
    meta: [
      { title: "Career — Francis Phiri | Data Engineering, Software, ML" },
      {
        name: "description",
        content:
          "Career profile: Junior Data Engineer at KHM Technology building medallion data warehouses, plus prior software and analytics roles.",
      },
      { property: "og:title", content: "Career — Francis Phiri" },
      { property: "og:description", content: "Data engineering, software development and ML experience." },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: "https://francis-phiri-ai-profile.lovable.app/career" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://francis-phiri-ai-profile.lovable.app/career" }],
  }),
  component: CareerPage,
});

const skillGroups = [
  { title: "Data Engineering", items: ["SQL", "Python ETL", "Medallion architecture", "Dimensional modelling", "Airbyte", "Bronze / Silver / Gold", "Stored procedures", "Triggers"] },
  { title: "BI & Analytics", items: ["Power BI", "Metabase", "Executive & marketing reporting", "Data quality", "Data governance"] },
  { title: "Software Engineering", items: ["Python", "C# / ASP.NET Web APIs", "TypeScript", "REST integrations", "Git workflows"] },
  { title: "Cloud / DevOps", items: ["Docker", "CI patterns", "Data platform ops"] },
  { title: "AI / ML", items: ["Deep RL (TD3)", "NLP pipelines", "Model evaluation", "Applied research"] },
  { title: "Automation & Agents", items: ["n8n", "OpenAI / Claude agents", "Kafka", "Product telemetry"] },
];

const projects = [
  { title: "KHM Data Warehouse & Reporting Platform", desc: "Medallion warehouse with Airbyte ingestion, SQL/Python transforms, Metabase + Power BI for business & marketing stakeholders." },
  { title: "Digital Health Systems", desc: "Software features and integrations for digital health workflows at Best Health Solutions." },
  { title: "Institutional Analytics & Student-Success Dashboards", desc: "ETL pipelines and dashboards supporting Wits institutional analytics." },
  { title: "NLP CV Shortlisting System", desc: "NLP pipeline for automated CV screening and shortlisting against role requirements." },
];

function CareerPage() {
  const { data: career } = useQuery({
    queryKey: ["career"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profile_content")
        .select("*")
        .eq("section", "career")
        .order("sort_order");
      return data ?? [];
    },
  });

  return (
    <PageShell>
      <section className="relative overflow-hidden bg-hero">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Briefcase size={12} /> Career Profile
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            Building <span className="text-gradient-teal">data platforms</span> that ship decisions.
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Currently a full-time Junior Data Engineer at KHM Technology. Previously software, data science and data engineering roles across health, higher-ed and industry.
          </p>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Experience</h2>
        <div className="relative mt-10 border-l border-primary/30 pl-6">
          {(career ?? []).map((c, i) => (
            <div key={c.id} className="relative mb-8 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <span className="absolute -left-[31px] top-1.5 grid h-5 w-5 place-items-center rounded-full border-2 border-primary bg-background">
                <span className="h-2 w-2 rounded-full bg-primary" />
              </span>
              <div className={`rounded-xl border p-5 shadow-card ${i === 0 ? "border-primary/40 bg-card-elevated shadow-glow" : "border-border bg-card"}`}>
                {i === 0 && (
                  <span className="mb-2 inline-block rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                    Current role
                  </span>
                )}
                <h3 className="font-display text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.content}</p>
                {c.tags && c.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {c.tags.map((t: string) => (
                      <span key={t} className="rounded-md border border-border bg-background/50 px-2 py-0.5 text-[11px] text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section className="border-t border-border bg-navy-deep/40">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Technical skills</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skillGroups.map((g) => (
              <div key={g.title} className="rounded-xl border border-border bg-card-elevated p-5 shadow-card">
                <h3 className="font-display text-base font-semibold text-primary">{g.title}</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {g.items.map((s) => (
                    <span key={s} className="rounded-md border border-border bg-background/50 px-2 py-1 text-xs text-foreground">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Selected projects</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {projects.map((p) => (
            <div key={p.title} className="group rounded-xl border border-border bg-card-elevated p-6 shadow-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow">
              <h3 className="font-display text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROFESSIONAL MEMBERSHIPS */}
      <section className="border-t border-border bg-navy-deep/40">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <ShieldCheck size={12} /> Professional Memberships
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
              Registered & accountable to <span className="text-gradient-teal">professional bodies</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Formally registered with South Africa's engineering and ICT professional bodies, and bound by their codes of conduct.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-primary/30 bg-card-elevated p-6 shadow-card">
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-teal text-primary-foreground shadow-glow">
                  <BadgeCheck size={20} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-semibold">Engineering Council of South Africa (ECSA)</h3>
                  <p className="mt-1 text-sm text-primary">Candidate Engineer · Reg. No. 2025209354</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Registered on 10 July 2025 under the Engineering Profession Act 46 of 2000 — the formal pathway toward Professional Engineer (Pr.Eng) registration.
                  </p>
                  <Link to="/documents" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                    View certificate <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-primary/30 bg-card-elevated p-6 shadow-card">
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-teal text-primary-foreground shadow-glow">
                  <BadgeCheck size={20} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-semibold">Institute of IT Professionals South Africa (IITPSA)</h3>
                  <p className="mt-1 text-sm text-primary">Associate Member · No. 20250811770 · Valid to 31 Aug 2026</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    SAQA-recognised professional body (SAQA ID 815). Members are bound by IITPSA's Code of Ethics covering integrity, privacy, confidentiality and public interest.
                  </p>
                  <Link to="/documents" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                    View certificate <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="rounded-2xl border border-primary/30 bg-card-elevated p-8 text-center shadow-card">
          <h3 className="font-display text-2xl font-bold">Grab the CV</h3>
          <p className="mt-2 text-muted-foreground">Two-page ATS version or the full academic CV.</p>
          <Link to="/documents" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gradient-teal px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow">
            <Download size={16} /> Go to Documents <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
