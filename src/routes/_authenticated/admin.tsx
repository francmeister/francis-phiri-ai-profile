import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  HelpCircle,
  MessageSquare,
  Mail,
  User as UserIcon,
  LogOut,
  Plus,
  Trash2,
  Save,
  BarChart3,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Francis Phiri" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Tab = "profile" | "faqs" | "documents" | "chats" | "contact" | "analytics";

function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("profile");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      setUserEmail(u.user.email ?? "");
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    })();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  if (isAdmin === null) {
    return (
      <PageShell>
        <div className="mx-auto max-w-6xl px-4 py-16 text-sm text-muted-foreground">Loading…</div>
      </PageShell>
    );
  }

  if (!isAdmin) {
    return (
      <PageShell>
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <h1 className="font-display text-2xl font-bold">Not authorised</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Signed in as <b>{userEmail}</b>, but this account does not have the admin role.
            Ask the site owner to grant admin access.
          </p>
          <button
            onClick={signOut}
            className="mt-6 inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </PageShell>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof UserIcon }[] = [
    { id: "profile", label: "Profile", icon: UserIcon },
    { id: "faqs", label: "FAQs", icon: HelpCircle },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "chats", label: "Chat history", icon: MessageSquare },
    { id: "contact", label: "Contact", icon: Mail },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold">Admin dashboard</h1>
            <p className="text-sm text-muted-foreground">Signed in as {userEmail}</p>
          </div>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-card"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>

        <div className="mt-8 flex flex-wrap gap-2 border-b border-border">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon size={14} /> {t.label}
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          {tab === "profile" && <ProfilePanel />}
          {tab === "faqs" && <FaqsPanel />}
          {tab === "documents" && <DocumentsPanel />}
          {tab === "chats" && <ChatsPanel />}
          {tab === "contact" && <ContactPanel />}
          {tab === "analytics" && <AnalyticsPanel />}
        </div>
      </section>
    </PageShell>
  );
}

/* ---------- Profile ---------- */
function ProfilePanel() {
  const qc = useQueryClient();
  const { data: items } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profile_content")
        .select("*")
        .order("section")
        .order("sort_order");
      return data ?? [];
    },
  });

  const [draft, setDraft] = useState({
    section: "career",
    title: "",
    content: "",
    sort_order: 0,
  });

  async function add() {
    if (!draft.title || !draft.content) return;
    await supabase.from("profile_content").insert(draft);
    setDraft({ ...draft, title: "", content: "" });
    qc.invalidateQueries({ queryKey: ["admin-profile"] });
  }
  async function save(id: string, patch: Record<string, any>) {
    await supabase.from("profile_content").update(patch).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-profile"] });
  }
  async function del(id: string) {
    if (!confirm("Delete this entry?")) return;
    await supabase.from("profile_content").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-profile"] });
  }

  return (
    <div>
      <Card title="Add profile entry">
        <div className="grid gap-3 md:grid-cols-4">
          <Input
            label="Section"
            value={draft.section}
            onChange={(v) => setDraft({ ...draft, section: v })}
            placeholder="career, academic, dissertation, publication, phd…"
          />
          <Input
            label="Sort"
            value={String(draft.sort_order)}
            onChange={(v) => setDraft({ ...draft, sort_order: Number(v) || 0 })}
          />
          <Input
            label="Title"
            value={draft.title}
            onChange={(v) => setDraft({ ...draft, title: v })}
            className="md:col-span-2"
          />
          <Textarea
            label="Content"
            value={draft.content}
            onChange={(v) => setDraft({ ...draft, content: v })}
            className="md:col-span-4"
          />
        </div>
        <button
          onClick={add}
          className="mt-3 inline-flex items-center gap-2 rounded-md bg-gradient-teal px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus size={14} /> Add
        </button>
      </Card>

      <div className="mt-6 space-y-3">
        {(items ?? []).map((it) => (
          <EditableRow key={it.id} item={it} onSave={save} onDelete={del} />
        ))}
      </div>
    </div>
  );
}

function EditableRow({
  item,
  onSave,
  onDelete,
}: {
  item: {
    id: string;
    section: string;
    title: string;
    content: string;
    sort_order: number | null;
  };
  onSave: (id: string, patch: Record<string, any>) => void;
  onDelete: (id: string) => void;
}) {
  const [title, setTitle] = useState(item.title);
  const [content, setContent] = useState(item.content);
  const [section, setSection] = useState(item.section);
  const [sortOrder, setSortOrder] = useState(item.sort_order ?? 0);
  return (
    <div className="rounded-xl border border-border bg-card-elevated p-4">
      <div className="grid gap-3 md:grid-cols-4">
        <Input label="Section" value={section} onChange={setSection} />
        <Input
          label="Sort"
          value={String(sortOrder)}
          onChange={(v) => setSortOrder(Number(v) || 0)}
        />
        <Input label="Title" value={title} onChange={setTitle} className="md:col-span-2" />
        <Textarea
          label="Content"
          value={content}
          onChange={setContent}
          className="md:col-span-4"
        />
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onSave(item.id, { title, content, section, sort_order: sortOrder })}
          className="inline-flex items-center gap-2 rounded-md bg-primary/15 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/25"
        >
          <Save size={12} /> Save
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="inline-flex items-center gap-2 rounded-md border border-destructive/40 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10"
        >
          <Trash2 size={12} /> Delete
        </button>
      </div>
    </div>
  );
}

/* ---------- FAQs ---------- */
function FaqsPanel() {
  const qc = useQueryClient();
  const { data: items } = useQuery({
    queryKey: ["admin-faqs"],
    queryFn: async () => {
      const { data } = await supabase.from("faq_items").select("*").order("created_at");
      return data ?? [];
    },
  });
  const [draft, setDraft] = useState({ category: "", question: "", answer: "" });

  async function add() {
    if (!draft.question || !draft.answer) return;
    await supabase.from("faq_items").insert(draft);
    setDraft({ category: "", question: "", answer: "" });
    qc.invalidateQueries({ queryKey: ["admin-faqs"] });
  }
  async function toggle(id: string, is_active: boolean) {
    await supabase.from("faq_items").update({ is_active }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-faqs"] });
  }
  async function del(id: string) {
    if (!confirm("Delete FAQ?")) return;
    await supabase.from("faq_items").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-faqs"] });
  }

  return (
    <div>
      <Card title="Add FAQ">
        <div className="grid gap-3">
          <Input
            label="Category"
            value={draft.category}
            onChange={(v) => setDraft({ ...draft, category: v })}
          />
          <Input
            label="Question"
            value={draft.question}
            onChange={(v) => setDraft({ ...draft, question: v })}
          />
          <Textarea
            label="Answer"
            value={draft.answer}
            onChange={(v) => setDraft({ ...draft, answer: v })}
          />
        </div>
        <button
          onClick={add}
          className="mt-3 inline-flex items-center gap-2 rounded-md bg-gradient-teal px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus size={14} /> Add
        </button>
      </Card>
      <div className="mt-6 space-y-3">
        {(items ?? []).map((f) => (
          <div key={f.id} className="rounded-xl border border-border bg-card-elevated p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  {f.category || "General"}
                </div>
                <div className="mt-1 font-semibold">{f.question}</div>
                <p className="mt-1 text-sm text-muted-foreground">{f.answer}</p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={f.is_active}
                    onChange={(e) => toggle(f.id, e.target.checked)}
                  />
                  Active
                </label>
                <button
                  onClick={() => del(f.id)}
                  className="inline-flex items-center gap-1 rounded-md border border-destructive/40 px-2 py-1 text-xs text-destructive hover:bg-destructive/10"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Documents ---------- */
function DocumentsPanel() {
  const qc = useQueryClient();
  const { data: items } = useQuery({
    queryKey: ["admin-documents"],
    queryFn: async () => {
      const { data } = await supabase.from("documents").select("*").order("created_at");
      return data ?? [];
    },
  });
  const [draft, setDraft] = useState({
    category: "cv",
    title: "",
    description: "",
    file_url: "",
  });

  async function add() {
    if (!draft.title) return;
    await supabase.from("documents").insert(draft);
    setDraft({ category: "cv", title: "", description: "", file_url: "" });
    qc.invalidateQueries({ queryKey: ["admin-documents"] });
  }
  async function save(id: string, patch: Record<string, any>) {
    await supabase.from("documents").update(patch).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-documents"] });
  }
  async function del(id: string) {
    if (!confirm("Delete document?")) return;
    await supabase.from("documents").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-documents"] });
  }

  return (
    <div>
      <Card title="Add document">
        <div className="grid gap-3 md:grid-cols-2">
          <Input
            label="Category (cv, research, publication, cover-letter, certificate)"
            value={draft.category}
            onChange={(v) => setDraft({ ...draft, category: v })}
          />
          <Input
            label="Title"
            value={draft.title}
            onChange={(v) => setDraft({ ...draft, title: v })}
          />
          <Input
            label="File URL"
            value={draft.file_url}
            onChange={(v) => setDraft({ ...draft, file_url: v })}
            className="md:col-span-2"
          />
          <Textarea
            label="Description"
            value={draft.description}
            onChange={(v) => setDraft({ ...draft, description: v })}
            className="md:col-span-2"
          />
        </div>
        <button
          onClick={add}
          className="mt-3 inline-flex items-center gap-2 rounded-md bg-gradient-teal px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus size={14} /> Add
        </button>
      </Card>

      <div className="mt-6 space-y-3">
        {(items ?? []).map((d) => (
          <DocRow key={d.id} doc={d} onSave={save} onDelete={del} />
        ))}
      </div>
    </div>
  );
}

function DocRow({
  doc,
  onSave,
  onDelete,
}: {
  doc: {
    id: string;
    category: string;
    title: string;
    description: string | null;
    file_url: string | null;
  };
  onSave: (id: string, patch: Record<string, any>) => void;
  onDelete: (id: string) => void;
}) {
  const [title, setTitle] = useState(doc.title);
  const [category, setCategory] = useState(doc.category);
  const [description, setDescription] = useState(doc.description ?? "");
  const [fileUrl, setFileUrl] = useState(doc.file_url ?? "");
  return (
    <div className="rounded-xl border border-border bg-card-elevated p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Input label="Category" value={category} onChange={setCategory} />
        <Input label="Title" value={title} onChange={setTitle} />
        <Input label="File URL" value={fileUrl} onChange={setFileUrl} className="md:col-span-2" />
        <Textarea
          label="Description"
          value={description}
          onChange={setDescription}
          className="md:col-span-2"
        />
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() =>
            onSave(doc.id, { title, category, description, file_url: fileUrl || null })
          }
          className="inline-flex items-center gap-2 rounded-md bg-primary/15 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/25"
        >
          <Save size={12} /> Save
        </button>
        <button
          onClick={() => onDelete(doc.id)}
          className="inline-flex items-center gap-2 rounded-md border border-destructive/40 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10"
        >
          <Trash2 size={12} /> Delete
        </button>
      </div>
    </div>
  );
}

/* ---------- Chats ---------- */
function ChatsPanel() {
  const { data: sessions } = useQuery({
    queryKey: ["admin-chat-sessions"],
    queryFn: async () => {
      const { data } = await supabase
        .from("chat_sessions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      return data ?? [];
    },
  });
  const [openId, setOpenId] = useState<string | null>(null);
  const { data: messages } = useQuery({
    queryKey: ["admin-chat-messages", openId],
    enabled: !!openId,
    queryFn: async () => {
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", openId!)
        .order("created_at");
      return data ?? [];
    },
  });

  return (
    <div className="grid gap-4 md:grid-cols-[320px_1fr]">
      <div className="max-h-[70vh] overflow-y-auto rounded-xl border border-border bg-card-elevated">
        {(sessions ?? []).map((s) => (
          <button
            key={s.id}
            onClick={() => setOpenId(s.id)}
            className={`block w-full border-b border-border px-4 py-3 text-left text-sm hover:bg-primary/5 ${
              openId === s.id ? "bg-primary/10" : ""
            }`}
          >
            <div className="font-medium">
              {s.visitor_name || s.visitor_email || "Anonymous visitor"}
            </div>
            <div className="text-xs text-muted-foreground">
              {s.visitor_type || "—"} · {new Date(s.created_at).toLocaleString()}
            </div>
          </button>
        ))}
        {(sessions ?? []).length === 0 && (
          <div className="p-4 text-sm text-muted-foreground">No chat sessions yet.</div>
        )}
      </div>
      <div className="rounded-xl border border-border bg-card-elevated p-4">
        {!openId && <div className="text-sm text-muted-foreground">Select a session…</div>}
        {openId && (
          <div className="space-y-3">
            {(messages ?? []).map((m) => (
              <div
                key={m.id}
                className={`rounded-lg p-3 text-sm ${
                  m.role === "assistant"
                    ? "bg-primary/10"
                    : "bg-background/60 border border-border"
                }`}
              >
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  {m.role}
                </div>
                <div className="mt-1 whitespace-pre-wrap">{m.message}</div>
              </div>
            ))}
            {(messages ?? []).length === 0 && (
              <div className="text-sm text-muted-foreground">No messages.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Contact ---------- */
function ContactPanel() {
  const qc = useQueryClient();
  const { data: items } = useQuery({
    queryKey: ["admin-contact"],
    queryFn: async () => {
      const { data } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });
  async function del(id: string) {
    if (!confirm("Delete message?")) return;
    await supabase.from("contact_messages").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-contact"] });
  }
  return (
    <div className="space-y-3">
      {(items ?? []).map((m) => (
        <div key={m.id} className="rounded-xl border border-border bg-card-elevated p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="font-semibold">
                {m.name}{" "}
                <a href={`mailto:${m.email}`} className="text-primary hover:underline">
                  &lt;{m.email}&gt;
                </a>
              </div>
              <div className="text-xs text-muted-foreground">
                {m.organisation || "—"} · {m.reason || "—"} ·{" "}
                {new Date(m.created_at).toLocaleString()}
              </div>
            </div>
            <button
              onClick={() => del(m.id)}
              className="inline-flex items-center gap-2 rounded-md border border-destructive/40 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10"
            >
              <Trash2 size={12} /> Delete
            </button>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm">{m.message}</p>
        </div>
      ))}
      {(items ?? []).length === 0 && (
        <div className="text-sm text-muted-foreground">No contact messages yet.</div>
      )}
    </div>
  );
}

/* ---------- Analytics ---------- */
function AnalyticsPanel() {
  const { data: events } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_analytics")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      return data ?? [];
    },
  });

  const summary = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of events ?? []) counts[e.event_type] = (counts[e.event_type] ?? 0) + 1;
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [events]);

  return (
    <div className="space-y-6">
      <Card title="Event totals (last 500)">
        {summary.length === 0 && (
          <div className="text-sm text-muted-foreground">No analytics events yet.</div>
        )}
        <div className="grid gap-3 md:grid-cols-3">
          {summary.map(([k, v]) => (
            <div key={k} className="rounded-lg border border-border bg-background/50 p-4">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{k}</div>
              <div className="mt-1 font-display text-2xl font-bold text-primary">{v}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Recent events">
        <div className="max-h-[50vh] overflow-y-auto text-xs">
          <table className="w-full">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="p-2">Time</th>
                <th className="p-2">Type</th>
                <th className="p-2">Payload</th>
              </tr>
            </thead>
            <tbody>
              {(events ?? []).map((e) => (
                <tr key={e.id} className="border-t border-border">
                  <td className="p-2 whitespace-nowrap">
                    {new Date(e.created_at).toLocaleString()}
                  </td>
                  <td className="p-2">{e.event_type}</td>
                  <td className="p-2 font-mono">{JSON.stringify(e.event_payload)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ---------- shared UI ---------- */
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card-elevated p-5">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}
function Input({
  label,
  value,
  onChange,
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}
function Textarea({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}
