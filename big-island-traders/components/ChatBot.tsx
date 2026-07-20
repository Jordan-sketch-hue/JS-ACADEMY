"use client";
import { useState, useRef, useEffect } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "I want to place a corporate order",
  "What are your prices?",
  "Tell me about WIAG",
  "Book a consultation",
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const { reply } = await res.json();
      setMessages(m => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "Sorry, something went wrong. Call us at 876-885-3250." }]);
    }
    setLoading(false);
  };

  const greet = "Hi! I'm the WIAG gifting assistant. Ask me about pricing, products, or corporate orders — or tap a quick option below.";

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ position:"fixed",bottom:28,right:104,width:56,height:56,borderRadius:"50%",backgroundColor:"#C8A84A",border:"none",cursor:"pointer",zIndex:300,boxShadow:"0 4px 20px rgba(200,168,74,0.35)",display:"flex",alignItems:"center",justifyContent:"center",transition:"transform 0.2s" }}
        onMouseEnter={e=>(e.currentTarget.style.transform="scale(1.1)")}
        onMouseLeave={e=>(e.currentTarget.style.transform="scale(1)")}>
        {open ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#060C1A" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#060C1A" strokeWidth="1.8" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>}
      </button>

      {open && (
        <div style={{ position:"fixed",bottom:100,right:28,width:340,maxHeight:500,backgroundColor:"#0D1933",borderRadius:16,zIndex:300,boxShadow:"0 8px 40px rgba(0,0,0,0.5)",border:"1px solid rgba(91,200,232,0.3)",display:"flex",flexDirection:"column",overflow:"hidden" }}>
          <div style={{ padding:"16px 20px",backgroundColor:"#0D1933",borderBottom:"1px solid rgba(200,168,74,0.15)",display:"flex",alignItems:"center",gap:12 }}>
            <div style={{ width:36,height:36,borderRadius:"50%",backgroundColor:"rgba(200,168,74,0.15)",border:"1px solid rgba(200,168,74,0.3)",display:"flex",alignItems:"center",justifyContent:"center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8A84A" strokeWidth="1.8" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            </div>
            <div>
              <div style={{ fontFamily:"Montserrat,sans-serif",fontWeight:700,fontSize:13,color:"#fff" }}>WIAG Assistant</div>
              <div style={{ fontSize:11,color:"rgba(200,168,74,0.7)" }}>● Powered by AI</div>
            </div>
          </div>

          <div style={{ flex:1,overflowY:"auto",padding:"16px 16px 8px" }}>
            <div style={{ maxWidth:"85%",padding:"10px 14px",borderRadius:"12px 12px 12px 2px",backgroundColor:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.85)",fontSize:13,lineHeight:1.6,marginBottom:12 }}>
              {greet}
            </div>

            {messages.length === 0 && (
              <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:8 }}>
                {STARTERS.map(s => (
                  <button key={s} onClick={() => send(s)}
                    style={{ backgroundColor:"rgba(200,168,74,0.08)",border:"1px solid rgba(200,168,74,0.25)",color:"rgba(200,168,74,0.9)",borderRadius:20,padding:"6px 12px",fontSize:11,cursor:"pointer",fontWeight:600 }}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} style={{ display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:10 }}>
                <div style={{ maxWidth:"82%",padding:"10px 14px",borderRadius:m.role==="user"?"12px 12px 2px 12px":"12px 12px 12px 2px",backgroundColor:m.role==="user"?"#C8A84A":"rgba(255,255,255,0.05)",color:m.role==="user"?"#060C1A":"rgba(255,255,255,0.85)",fontSize:13,lineHeight:1.6,fontWeight:m.role==="user"?600:400 }}>
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display:"flex",justifyContent:"flex-start",marginBottom:10 }}>
                <div style={{ padding:"10px 16px",borderRadius:"12px 12px 12px 2px",backgroundColor:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.35)",fontSize:13 }}>
                  Typing…
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding:"10px 12px",borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",gap:8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key==="Enter" && send(input)}
              placeholder="Ask anything…"
              style={{ flex:1,backgroundColor:"rgba(255,255,255,0.05)",border:"1px solid rgba(200,168,74,0.15)",borderRadius:8,padding:"9px 12px",color:"#fff",fontSize:13,outline:"none",fontFamily:"Inter,sans-serif" }}
            />
            <button onClick={() => send(input)} disabled={loading || !input.trim()}
              style={{ backgroundColor:"#C8A84A",border:"none",borderRadius:8,padding:"9px 14px",color:"#060C1A",fontWeight:900,fontSize:13,cursor:"pointer",opacity:loading||!input.trim()?0.4:1 }}>
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
