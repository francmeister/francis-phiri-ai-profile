import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, Linkedin, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Francis Phiri | Johannesburg, South Africa" },
      { name: "description", content: "Contact Francis Phiri for engineering roles, research collaboration or PhD supervision discussions." },
      { property: "og:title", content: "Contact Francis Phiri" },
      { property: "og:description", content: "Email, phone and LinkedIn for Francis Phiri." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://francis-phiri-ai-profile.lovable.app/contact" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://francis-phiri-ai-profile.lovable.app/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", organisation: "", reason: "", message: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("request failed");
      setState("done");
      setForm({ name: "", email: "", organisation: "", reason: "", message: "" });
    } catch {
      setState("error");
    }
  }

  return (
    <PageShell>
      <section className="relative overflow-hidden bg-hero">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            Let's <span className="text-gradient-teal">talk</span>.
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Recruiters, hiring managers, potential collaborators and prospective supervisors — I'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-2">
        <div className="space-y-4">
          <ContactRow icon={MapPin} label="Location" value="Johannesburg, South Africa" />
          <ContactRow icon={Mail} label="Email" value="francophiri97@gmail.com" href="mailto:francophiri97@gmail.com" />
          <ContactRow icon={Phone} label="Phone" value="+27 74 538 5295" href="tel:+27745385295" />
          <ContactRow icon={Linkedin} label="LinkedIn" value="linkedin.com/in/francis-phiri-004b07111" href="https://linkedin.com/in/francis-phiri-004b07111" />
        </div>

        <form onSubmit={submit} className="space-y-3 rounded-2xl border border-border bg-card-elevated p-6 shadow-card">
          <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
          <Field label="Organisation" value={form.organisation} onChange={(v) => setForm({ ...form, organisation: v })} />
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">Reason</label>
            <select
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="">Select…</option>
              <option value="hiring">Hiring / Role opportunity</option>
              <option value="phd">PhD supervision / academia</option>
              <option value="collaboration">Research collaboration</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">Message</label>
            <textarea
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit"
            disabled={state === "loading" || state === "done"}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-teal px-4 py-3 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
          >
            {state === "loading" ? <Loader2 size={16} className="animate-spin" /> : state === "done" ? <CheckCircle2 size={16} /> : <Send size={16} />}
            {state === "done" ? "Message sent — thank you" : "Send message"}
          </button>
          {state === "error" && (
            <p className="text-center text-xs text-destructive">Something went wrong. Please email francophiri97@gmail.com.</p>
          )}
        </form>
      </section>
    </PageShell>
  );
}

function ContactRow({ icon: Icon, label, value, href }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; value: string; href?: string }) {
  const inner = (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card-elevated p-4 shadow-card transition-colors hover:border-primary/40">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-teal text-primary-foreground shadow-glow">
        <Icon size={18} />
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="mt-0.5 text-sm text-foreground">{value}</div>
      </div>
    </div>
  );
  return href ? (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
      {inner}
    </a>
  ) : inner;
}

function Field({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-muted-foreground">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}
