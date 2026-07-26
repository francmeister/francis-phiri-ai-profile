import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { askFrancisAI } from "@/lib/chat.functions";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What data engineering experience does Francis have?",
  "What is his MSc research about?",
  "Is he suitable for a PhD in federated learning?",
  "What tools does he use?",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hey — I'm Francis. Ask me anything about my data, software, or research work and I'll answer directly.",
    },
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
    const { data } = await supabase
      .from("chat_sessions")
      .insert({ visitor_type: "other" })
      .select("id")
      .single();
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
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            e instanceof Error
              ? e.message
              : "Sorry — something went wrong. Please try again or email francophiri97@gmail.com.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        aria-label="Open Ask Francis AI"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-gradient-teal text-primary-foreground shadow-glow transition-transform hover:scale-110"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[560px] max-h-[80vh] w-[92vw] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card animate-fade-up">
          <div className="border-b border-border bg-navy-deep/60 p-4">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-teal text-primary-foreground text-xs font-bold">
                FP
              </span>
              <div>
                <div className="text-sm font-semibold">Ask Francis AI</div>
                <div className="text-[11px] text-muted-foreground">
                  Answers about Francis's career & research
                </div>
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-primary-foreground"
                      : "max-w-[90%] whitespace-pre-wrap text-foreground"
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 size={14} className="animate-spin text-primary" /> Thinking…
              </div>
            )}
            {messages.length <= 1 && !loading && (
              <div className="mt-3 space-y-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border bg-navy-deep/40 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={loading || !input.trim()}
              className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-teal text-primary-foreground disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
