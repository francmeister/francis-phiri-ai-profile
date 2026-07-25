import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Send, Loader2, MessageCircle, Sparkles } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { supabase } from "@/integrations/supabase/client";
import { askFrancisAI } from "@/lib/chat.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Ask Francis AI — Chat about his career, research and fit" },
      { name: "description", content: "Ask an AI assistant anything about Francis Phiri — his data engineering, ML research, projects, tools, publications and PhD readiness." },
      { property: "og:title", content: "Ask Francis AI" },
      { property: "og:description", content: "Chat with an AI trained on Francis's career and research profile." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What data engineering experience does Francis have?",
  "What is his MSc research about?",
  "Does he have Power BI experience?",
  "What projects has he built?",
  "Is he suitable for a PhD in federated learning or telecommunications?",
  "What programming languages and tools does he use?",
];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi, I'm Francis — thanks for stopping by. Ask me anything about my career, research, tools, or PhD plans and I'll answer directly." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const ask = useServerFn(askFrancisAI);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function ensureSession() {
    if (sessionId) return sessionId;
    const { data } = await supabase.from("chat_sessions").insert({ visitor_type: "other" }).select("id").single();
    if (data?.id) setSessionId(data.id);
    return data?.id;
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setLoading(true);
    try {
      const sid = await ensureSession();
      const res = await ask({
        data: {
          messages: next.map((m) => ({ role: m.role, content: m.content })),
          sessionId: sid,
        },
      });
      setMessages((m) => [...m, { role: "assistant", content: res.content }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", content: e instanceof Error ? e.message : "Something went wrong. Please email francophiri97@gmail.com." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <section className="relative overflow-hidden bg-hero">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles size={12} /> AI Assistant
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            Ask <span className="text-gradient-teal">Francis AI</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Get quick, factual answers about Francis's career, research and fit for your role or programme.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
        <div className="rounded-2xl border border-border bg-card-elevated shadow-card">
          <div ref={scrollRef} className="max-h-[60vh] min-h-[380px] space-y-4 overflow-y-auto p-6">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-primary-foreground"
                      : "flex max-w-[90%] gap-3"
                  }
                >
                  {m.role === "assistant" && (
                    <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-teal text-primary-foreground text-xs font-bold">
                      FP
                    </div>
                  )}
                  <p className={m.role === "assistant" ? "whitespace-pre-wrap text-foreground" : ""}>{m.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 size={16} className="animate-spin text-primary" /> Thinking…
              </div>
            )}
          </div>

          {messages.length <= 1 && (
            <div className="grid gap-2 border-t border-border p-4 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-lg border border-border bg-background/60 px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  <MessageCircle size={12} className="mr-2 inline text-primary" />
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border p-4"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about Francis…"
              className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-teal px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-50"
            >
              <Send size={16} /> Send
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Ask Francis AI answers from Francis's profile. If it doesn't know, it will say so — please email francophiri97@gmail.com.
        </p>
      </section>
    </PageShell>
  );
}
