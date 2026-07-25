import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FileText, Download, Award, GraduationCap, BookOpen } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Documents — Francis Phiri | CVs, Dissertation, Publications" },
      { name: "description", content: "Download Francis Phiri's CVs, MSc dissertation, cover letter and peer-reviewed publications." },
      { property: "og:title", content: "Documents — Francis Phiri" },
      { property: "og:description", content: "CVs, dissertation, publications and cover letter." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DocumentsPage,
});

const iconFor = (cat: string) => {
  switch (cat) {
    case "cv": return FileText;
    case "research": return GraduationCap;
    case "publication": return BookOpen;
    case "cover-letter": return Award;
    default: return FileText;
  }
};

function DocumentsPage() {
  const { data: docs } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const { data } = await supabase.from("documents").select("*").order("created_at", { ascending: true });
      return data ?? [];
    },
  });

  const grouped = (docs ?? []).reduce<Record<string, typeof docs>>((acc, d) => {
    (acc[d.category] ||= []).push(d);
    return acc;
  }, {} as Record<string, typeof docs>);

  const categoryLabel: Record<string, string> = {
    cv: "CVs",
    research: "Research",
    publication: "Publications",
    "cover-letter": "Cover Letters",
    certificate: "Certificates",
  };

  return (
    <PageShell>
      <section className="relative overflow-hidden bg-hero">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <FileText size={12} /> Documents
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            Download & share <span className="text-gradient-teal">documents</span>.
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            CVs tailored for industry and academia, MSc dissertation, and peer-reviewed publications.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-12 px-4 py-16 sm:px-6">
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat}>
            <h2 className="font-display text-2xl font-bold">{categoryLabel[cat] ?? cat}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {(items ?? []).map((d) => {
                const Icon = iconFor(d.category);
                const hasFile = !!d.file_url;
                return (
                  <div key={d.id} className="group rounded-xl border border-border bg-card-elevated p-6 shadow-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow">
                    <div className="flex items-start gap-4">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-teal text-primary-foreground shadow-glow">
                        <Icon size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-base font-semibold">{d.title}</h3>
                        {d.description && (
                          <p className="mt-1 text-sm text-muted-foreground">{d.description}</p>
                        )}
                        <div className="mt-4">
                          {hasFile ? (
                            <a
                              href={d.file_url!}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20"
                            >
                              <Download size={14} /> Download
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-2 rounded-md border border-border bg-background/50 px-3 py-1.5 text-xs text-muted-foreground">
                              Available on request — email francophiri97@gmail.com
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </PageShell>
  );
}
