"use client";

import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

async function callApi(messages: Message[]): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "APIエラー");
  return data.text;
}

function StarBadge({ step }: { step: string }) {
  const labels: Record<string, string> = { S: "Situation", T: "Task", A: "Action", R: "Result" };
  const bg: Record<string, string> = { S: "#e8f4f8", T: "#fef9e7", A: "#f0fff0", R: "#fdf0f8" };
  const fg: Record<string, string> = { S: "#2980b9", T: "#d4ac0d", A: "#27ae60", R: "#8e44ad" };
  return (
    <span style={{
      background: bg[step], color: fg[step],
      border: `1.5px solid ${fg[step]}`,
      borderRadius: "4px", padding: "1px 7px",
      fontSize: "11px", fontWeight: 700,
      letterSpacing: "0.05em", marginRight: "6px",
      fontFamily: "monospace",
    }}>
      {step} · {labels[step]}
    </span>
  );
}

function Message({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div style={{
      display: "flex", justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: "18px", gap: "10px", alignItems: "flex-start",
    }}>
      {!isUser && (
        <div style={{
          width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #1a1a2e, #16213e)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, border: "2px solid #e8d5b7",
        }}>✍️</div>
      )}
      <div style={{
        maxWidth: "78%",
        background: isUser ? "linear-gradient(135deg, #2c3e50, #1a252f)" : "#fafaf7",
        color: isUser ? "#f0e6d3" : "#2c2c2c",
        borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
        padding: "14px 18px", fontSize: 14, lineHeight: 1.75,
        boxShadow: isUser ? "0 2px 12px rgba(44,62,80,0.25)" : "0 2px 12px rgba(0,0,0,0.07)",
        border: isUser ? "none" : "1px solid #e8e0d4",
        whiteSpace: "pre-wrap",
      }}>
        {msg.content}
      </div>
      {isUser && (
        <div style={{
          width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #c9a84c, #a07830)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
        }}>👤</div>
      )}
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const reply = await callApi(newMessages);
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "エラーが発生しました。もう一度お試しください。" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div style={{
      minHeight: "100vh", background: "#f5f0e8",
      backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(44,62,80,0.06) 0%, transparent 60%)",
      fontFamily: "'Georgia', 'Noto Serif JP', serif",
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <header style={{
        background: "linear-gradient(135deg, #1a1a2e, #16213e)",
        color: "#e8d5b7", padding: "0 24px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 2px 20px rgba(0,0,0,0.3)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 22 }}>✍️</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: "0.05em" }}>ES 例文ジェネレーター</div>
            <div style={{ fontSize: 10, opacity: 0.6, letterSpacing: "0.08em" }}>POWERED BY CLAUDE · STAR法対応</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["S", "T", "A", "R"].map(s => <StarBadge key={s} step={s} />)}
        </div>
      </header>

      {/* Main */}
      <main style={{
        flex: 1, maxWidth: 780, width: "100%",
        margin: "0 auto", padding: "24px 20px",
        display: "flex", flexDirection: "column",
      }}>
        {isEmpty ? (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 32, paddingBottom: 40,
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
              <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1a1a2e", marginBottom: 8, letterSpacing: "0.02em" }}>
                体験談をESに変換する
              </h1>
              <p style={{ color: "#666", fontSize: 14, lineHeight: 1.8, maxWidth: 420 }}>
                過去の体験談やES原文を貼り付けてください。<br />
                STAR法に沿った就活用例文に書き換えます。
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              {[
                { icon: "⚖️", text: "著作権侵害なし" },
                { icon: "🔄", text: "STAR法で構成" },
                { icon: "🏷️", text: "固有名詞を置換" },
                { icon: "💬", text: "対話でブラッシュアップ" },
              ].map(f => (
                <div key={f.text} style={{
                  background: "white", border: "1px solid #ddd", borderRadius: 20,
                  padding: "6px 14px", fontSize: 12, color: "#444",
                  display: "flex", alignItems: "center", gap: 6,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}>
                  <span>{f.icon}</span>{f.text}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, paddingBottom: 16 }}>
            {messages.map((msg, i) => <Message key={i} msg={msg} />)}
            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 0" }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "linear-gradient(135deg, #1a1a2e, #16213e)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, border: "2px solid #e8d5b7",
                }}>✍️</div>
                <div style={{
                  background: "#fafaf7", border: "1px solid #e8e0d4",
                  borderRadius: "4px 16px 16px 16px",
                  padding: "12px 18px", display: "flex", gap: 6,
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 8, height: 8, borderRadius: "50%", background: "#c9a84c",
                      animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Input */}
        <div style={{
          background: "white", border: "1.5px solid #ddd", borderRadius: 16,
          padding: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          marginTop: isEmpty ? 0 : 8,
        }}>
          {isEmpty && (
            <div style={{ fontSize: 11, color: "#999", marginBottom: 8, letterSpacing: "0.05em" }}>
              📌 体験談・ES原文をここに貼り付け
            </div>
          )}
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isEmpty
              ? "例：大学3年時に〇〇株式会社でインターンシップに参加しました。最初は〇〇という課題があり..."
              : "修正希望や追加の指示を入力（例：もっと簡潔に、結果の数字を追加して）"}
            disabled={loading}
            style={{
              width: "100%", minHeight: isEmpty ? 140 : 72,
              border: "none", outline: "none", resize: "none",
              fontSize: 14, lineHeight: 1.75, color: "#2c2c2c",
              fontFamily: "inherit", background: "transparent",
            }}
          />
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginTop: 8, paddingTop: 8, borderTop: "1px solid #f0ece4",
          }}>
            <span style={{ fontSize: 11, color: "#aaa" }}>⌘+Enter で送信</span>
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              style={{
                background: input.trim() && !loading ? "linear-gradient(135deg, #2c3e50, #1a252f)" : "#ccc",
                color: "white", border: "none", borderRadius: 10,
                padding: "10px 24px", fontSize: 13, fontWeight: 600,
                cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                letterSpacing: "0.05em", transition: "all 0.2s",
                boxShadow: input.trim() && !loading ? "0 2px 10px rgba(44,62,80,0.3)" : "none",
              }}
            >
              {isEmpty ? "✨ 例文を生成" : "送信"}
            </button>
          </div>
        </div>

        {/* Quick suggestions */}
        {!isEmpty && !loading && (
          <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["もっと簡潔にして", "結果の数字を強調して", "STAR法の構成を確認して", "別の言い回しで書き直して", "文字数を350字程度に"].map(s => (
              <button key={s} onClick={() => sendMessage(s)} style={{
                background: "white", border: "1px solid #d4c9b5",
                borderRadius: 16, padding: "5px 12px", fontSize: 12,
                color: "#555", cursor: "pointer", transition: "all 0.15s",
                fontFamily: "inherit",
              }}>
                {s}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
