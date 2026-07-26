import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FileText, Download, Award, GraduationCap, BookOpen, Mail, X, CheckCircle2 } from "lucide-react";
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
      { property: "og:url", content: "https://francis-phiri-ai-profile.lovable.app/documents" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://francis-phiri-ai-profile.lovable.app/documents" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Documents — Francis Phiri",
          about: { "@type": "Person", name: "Francis Phiri" },
          hasPart: [
            { "@type": "CreativeWork", name: "MSc Dissertation — Wits" },
            { "@type": "CreativeWork", name: "Curriculum Vitae" },
            { "@type": "ScholarlyArticle", name: "SATNAC 2024 paper" },
            { "@type": "ScholarlyArticle", name: "IEEE GLOBECOM 2025 paper" },
          ],
        }),
      },
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

type DocRow = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  file_url: string | null;
};

function DocumentsPage() {
  const { data: docs } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const { data } = await supabase.from("documents").select("*").order("created_at", { ascending: true });
      return (data ?? []) as DocRow[];
    },
  });

  const [requesting, setRequesting] = useState<DocRow | null>(null);

  const grouped = (docs ?? []).reduce<Record<string, DocRow[]>>((acc, d) => {
    (acc[d.category] ||= []).push(d);
    return acc;
  }, {});

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
            For documents not directly downloadable, request a copy and Francis will email it to you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-12 px-4 py-16 sm:px-6">
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat}>
            <h2 className="font-display text-2xl font-bold">{categoryLabel[cat] ?? cat}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {items.map((d) => {
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
                        <div className="mt-4 flex flex-wrap gap-2">
                          {hasFile && (
                            <a
                              href={d.file_url!}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20"
                            >
                              <Download size={14} /> Download
                            </a>
                          )}
                          <button
                            onClick={() => setRequesting(d)}
                            className="inline-flex items-center gap-2 rounded-md bg-gradient-teal px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow hover:opacity-90"
                          >
                            <Mail size={14} /> Request by email
                          </button>
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

      {requesting && (
        <RequestModal doc={requesting} onClose={() => setRequesting(null)} />
      )}
    </PageShell>
  );
}

function RequestModal({ doc, onClose }: { doc: DocRow; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", organisation: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/public/document-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: doc.id,
          documentTitle: doc.title,
          ...form,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }
      setStatus("done");
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
      setStatus("error");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-border bg-card-elevated p-6 shadow-glow"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wide text-primary">Request document</div>
            <h3 className="mt-1 font-display text-xl font-bold">{doc.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {status === "done" ? (
          <div className="mt-6 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm">
            <div className="flex items-center gap-2 text-emerald-300">
              <CheckCircle2 size={16} /> <span className="font-semibold">Request sent</span>
            </div>
            <p className="mt-2 text-muted-foreground">
              Thanks {form.name || "for reaching out"} — a confirmation is on its way to{" "}
              <b>{form.email}</b>. Francis will follow up shortly.
            </p>
            <button
              onClick={onClose}
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary/15 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/25"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-3">
            <Field label="Your name" required>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                maxLength={200}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </Field>
            <Field label="Email" required>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                maxLength={320}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </Field>
            <Field label="Organisation (optional)">
              <input
                value={form.organisation}
                onChange={(e) => setForm({ ...form, organisation: e.target.value })}
                maxLength={200}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </Field>
            <Field label="Purpose / message (optional)">
              <textarea
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                maxLength={2000}
                placeholder="e.g. Reviewing your CV for a data engineering role, or requesting the dissertation for PhD supervision review."
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </Field>

            {error && (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center gap-2 rounded-md bg-gradient-teal px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
              >
                <Mail size={14} /> {status === "sending" ? "Sending…" : "Send request"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">
        {label} {required && <span className="text-primary">*</span>}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
