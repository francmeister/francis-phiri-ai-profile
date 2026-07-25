import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, BookOpen, Award, FlaskConical, Sparkles } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/academic")({
  head: () => ({
    meta: [
      { title: "Academic — Francis Phiri | MSc Wits, 5G/6G ML Research" },
      {
        name: "description",
        content:
          "MSc Engineering at Wits on TD3 deep reinforcement learning for computation offloading in energy-harvesting 5G networks. Published at SATNAC 2024 and IEEE GLOBECOM 2025.",
      },
      { property: "og:title", content: "Academic — Francis Phiri" },
      { property: "og:description", content: "5G/6G, MEC, federated learning and deep RL research." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AcademicPage,
});

const interests = [
  "5G/6G networks", "Mobile edge computing", "Federated learning",
  "Deep reinforcement learning", "Resource allocation", "eMBB/URLLC coexistence",
  "Energy-aware offloading", "Graph learning", "Privacy-aware edge intelligence",
];

function AcademicPage() {
  const { data: sections } = useQuery({
    queryKey: ["academic-sections"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profile_content")
        .select("*")
        .in("section", ["academic", "dissertation", "publication", "phd"])
        .order("sort_order");
      return data ?? [];
    },
  });

  const bySection = (s: string) => (sections ?? []).filter((x) => x.section === s);

  return (
    <PageShell>
      <section className="relative overflow-hidden bg-hero">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <GraduationCap size={12} /> Academic Profile
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            Research on <span className="text-gradient-teal">energy-aware</span> intelligence at the network edge.
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            MSc Engineering, University of the Witwatersrand. Two peer-reviewed publications and one Second-Best Paper Award.
          </p>
        </div>
      </section>

      {/* MSc + Dissertation */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {bySection("academic").map((a) => (
            <div key={a.id} className="rounded-2xl border border-border bg-card-elevated p-6 shadow-card">
              <div className="flex items-center gap-2 text-primary">
                <GraduationCap size={18} />
                <span className="text-xs font-semibold uppercase tracking-wide">Degree</span>
              </div>
              <h3 className="mt-2 font-display text-xl font-semibold">{a.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{a.content}</p>
            </div>
          ))}
          {bySection("dissertation").map((d) => (
            <div key={d.id} className="rounded-2xl border border-primary/40 bg-card-elevated p-6 shadow-glow">
              <div className="flex items-center gap-2 text-primary">
                <FlaskConical size={18} />
                <span className="text-xs font-semibold uppercase tracking-wide">MSc Dissertation</span>
              </div>
              <h3 className="mt-2 font-display text-xl font-semibold">{d.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Research interests */}
      <section className="border-y border-border bg-navy-deep/40">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Research interests</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {interests.map((i) => (
              <span key={i} className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm text-primary">
                {i}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Publications */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Publications</h2>
        <div className="mt-8 space-y-4">
          {bySection("publication").map((p) => {
            const isSatnac = /satnac/i.test(p.title) || /satnac/i.test(p.content);
            const isAward = /award/i.test(p.title) || /award/i.test(p.content);
            return (
              <div key={p.id} className="rounded-xl border border-border bg-card-elevated p-6 shadow-card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-2 text-primary">
                    <BookOpen size={18} />
                    <span className="text-xs font-semibold uppercase tracking-wide">Peer-reviewed</span>
                  </div>
                  {isAward && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-teal px-3 py-1 text-xs font-semibold text-primary-foreground">
                      <Award size={12} /> Award
                    </span>
                  )}
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.content}</p>
                {isSatnac && (
                  <a
                    href="https://www.wits.ac.za/news/latest-news/research-news/2024/2024-10/wits-teams-clinch-coveted-satnac-challenge-awards.html"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20"
                  >
                    <Award size={12} /> Read the Wits news feature on the SATNAC award →
                  </a>
                )}
              </div>
            );
          })}
        </div>

        {/* Award evidence callout */}
        <div className="mt-8 rounded-2xl border border-primary/40 bg-card-elevated p-6 shadow-glow">
          <div className="flex items-center gap-2 text-primary">
            <Award size={18} />
            <span className="text-xs font-semibold uppercase tracking-wide">Award evidence</span>
          </div>
          <h3 className="mt-2 font-display text-lg font-semibold">
            SATNAC 2024 — Second-Best Paper Award
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Featured by the University of the Witwatersrand:{" "}
            <a
              href="https://www.wits.ac.za/news/latest-news/research-news/2024/2024-10/wits-teams-clinch-coveted-satnac-challenge-awards.html"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Wits teams clinch coveted SATNAC Challenge Awards
            </a>
            .
          </p>
        </div>
      </section>


      {/* PhD Direction */}
      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-primary/40 bg-card-elevated p-8 shadow-glow md:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles size={18} />
              <span className="text-xs font-semibold uppercase tracking-wide">For PhD supervisors</span>
            </div>
            <h3 className="mt-2 font-display text-3xl font-bold">Proposed research direction</h3>
            {bySection("phd").map((p) => (
              <p key={p.id} className="mt-3 max-w-3xl text-lg text-foreground">
                “{p.content}”
              </p>
            ))}
            <p className="mt-3 text-sm text-muted-foreground">
              Open to discussions with supervisors in wireless communications, edge intelligence and applied ML.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
