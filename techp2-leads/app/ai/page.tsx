"use client";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Sparkles, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

interface Message { role: "user" | "assistant"; content: string; }

const STARTERS = [
  "Draft a follow-up WhatsApp for a hardware store in St. Ann I visited today",
  "Write a pricing proposal for monthly fertiliser supply to a farm co-op",
  "Give me a cold call script for reaching new agriculture leads in Portland",
  "What products should I pitch to a building contractor in St. Thomas?",
  "Help me summarize this call note into a professional follow-up",
];

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text?: string) => {
    const content = text || input.trim();
    if (!content || loading) return;

    const next: Message[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);

    const assistantMsg: Message = { role: "assistant", content: "" };
    setMessages(prev => [...prev, assistantMsg]);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.body) throw new Error("No stream");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: updated[updated.length - 1].content + chunk,
          };
          return updated;
        });
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: "Sorry, something went wrong. Check that ANTHROPIC_API_KEY is set." };
        return updated;
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a]">
      <header className="bg-[#111] border-b border-[#2a2a2a] flex-shrink-0 safe-top">
        <div className="px-4 py-3 flex items-center gap-3 max-w-6xl mx-auto">
          <button onClick={() => router.back()} className="text-[#888]"><ArrowLeft className="w-5 h-5" /></button>
          <div className="flex-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C9930C]" />
            <div>
              <p className="text-[#C9930C] text-[10px] font-semibold tracking-widest uppercase">Agri-H AI</p>
              <p className="text-white text-sm font-bold">Sales Assistant</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button onClick={() => setMessages([])} className="text-[#555] hover:text-[#888]">
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-6xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="space-y-4 py-6">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#1a1200] border border-[#C9930C]/30 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-[#C9930C]" />
              </div>
              <h2 className="text-white font-bold text-lg">AI Sales Assistant</h2>
              <p className="text-[#555] text-sm mt-1">Powered by Claude — your B2B procurement advisor</p>
            </div>
            <div className="space-y-2 mt-6">
              {STARTERS.map((s, i) => (
                <button key={i} onClick={() => send(s)}
                  className="w-full text-left bg-[#111] border border-[#2a2a2a] rounded-xl p-3.5 text-sm text-[#888] hover:border-[#C9930C]/40 hover:text-white transition-fast">
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-[#1a1200] border border-[#C9930C]/40 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C9930C]" />
                  </div>
                )}
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-[#C9930C] text-black font-medium"
                    : "bg-[#111] border border-[#2a2a2a] text-[#ccc]"
                } ${!m.content && m.role === "assistant" ? "animate-pulse" : ""}`}>
                  {m.content || (loading ? "●" : "")}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="flex-shrink-0 bg-[#111] border-t border-[#2a2a2a] px-4 py-3 safe-bottom max-w-6xl mx-auto w-full">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Ask anything about your leads, drafts, proposals..."
            rows={1}
            className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm resize-none focus:outline-none focus:border-[#C9930C] max-h-32"
            style={{ minHeight: "44px" }}
          />
          <button onClick={() => send()} disabled={!input.trim() || loading}
            className="bg-[#C9930C] text-black w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-fast">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
