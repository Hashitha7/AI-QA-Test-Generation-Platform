'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  id: number;
  role: 'user' | 'ai';
  text: string;
  time: string;
}

const QUICK_ACTIONS = [
  'Show me today\'s failing tests',
  'Generate tests for Login module',
  'Analyze latest defect',
  'What is my test pass rate?',
];

const AI_RESPONSES: Record<string, string> = {
  default: "I'm your TestNova AI assistant. I can help you generate test cases, analyze defects, summarize test runs, and answer QA strategy questions. What would you like to do?",
  fail: "📊 Today's failing tests:\n\n• **RUN-041** — Checkout Smoke Tests (5 failures)\n• **DEF-018** — Discount calculation bug (Critical)\n\nWould you like me to analyze the root cause of any of these?",
  generate: "✅ I'll generate test cases for the **Login Module**. Based on the current codebase, I recommend covering:\n\n1. Happy path login\n2. Invalid credentials\n3. Account lockout (5 attempts)\n4. Remember Me\n5. Password reset flow\n\nGo to **Test Generation** page to get the full AI-generated suite!",
  defect: "🔍 Latest defect analysis — **DEF-018** (Critical):\n\n**Root Cause:** `applyDiscount()` resets price on each iteration.\n\n**Fix:** Pass previous discount result as base for next calculation.\n\n**Estimated Fix Time:** 2-3 hours\n**Confidence:** 92%",
  rate: "📈 Your current **test health metrics**:\n\n• Pass Rate (30 days): **97.4%** ↑\n• AI Quality Score: **94/100** (Grade A+)\n• Automation Coverage: **94%**\n• Defect Detection Rate: **98%**\n\nYou're doing great! 🎉",
};

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('fail')) return AI_RESPONSES.fail;
  if (lower.includes('generat') || lower.includes('login')) return AI_RESPONSES.generate;
  if (lower.includes('defect') || lower.includes('analy')) return AI_RESPONSES.defect;
  if (lower.includes('rate') || lower.includes('pass') || lower.includes('health')) return AI_RESPONSES.rate;
  return AI_RESPONSES.default;
}

function now() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function MessageBubble({ msg }: { msg: Message }) {
  const isAI = msg.role === 'ai';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', flexDirection: isAI ? 'row' : 'row-reverse', marginBottom: '1rem' }}
    >
      <div style={{
        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
        background: isAI ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' : 'rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: isAI ? '0 0 10px rgba(99,102,241,0.3)' : 'none',
      }}>
        {isAI ? <Bot size={14} color="white" /> : <User size={14} color="var(--text-secondary)" />}
      </div>
      <div style={{
        maxWidth: '75%', padding: '0.6rem 0.9rem',
        background: isAI ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.07)',
        border: `1px solid ${isAI ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: isAI ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
      }}>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{msg.text}</p>
        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px', textAlign: isAI ? 'left' : 'right' }}>{msg.time}</p>
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', marginBottom: '1rem' }}>
      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Bot size={14} color="white" />
      </div>
      <div style={{ padding: '0.75rem 1rem', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '4px 12px 12px 12px', display: 'flex', gap: '4px', alignItems: 'center' }}>
        {[0, 1, 2].map((i) => (
          <motion.div key={i} animate={{ y: [-3, 0, -3] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)' }} />
        ))}
      </div>
    </div>
  );
}

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: 'ai', text: AI_RESPONSES.default, time: now() }
  ]);
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: 'user', text, time: now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));
    const response = getAIResponse(text);
    const aiMsg: Message = { id: Date.now() + 1, role: 'ai', text: response, time: now() };
    setMessages((prev) => [...prev, aiMsg]);
    setTyping(false);
    if (!open) setUnread((u) => u + 1);
  };

  return (
    <>
      {/* Floating Button */}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
        <AnimatePresence>
          {!open && (
            <motion.button
              id="ai-chat-toggle-btn"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setOpen(true)}
              style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(99,102,241,0.5)',
                position: 'relative',
              }}
            >
              <MessageCircle size={24} color="white" />
              {unread > 0 && (
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  style={{
                    position: 'absolute', top: '-4px', right: '-4px',
                    width: '18px', height: '18px', borderRadius: '50%',
                    background: 'var(--error)', color: 'white',
                    fontSize: '0.65rem', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 8px var(--error)',
                  }}
                >
                  {unread}
                </motion.div>
              )}
            </motion.button>
          )}
        </AnimatePresence>

        {/* Chat Window */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{
                position: 'absolute', bottom: 0, right: 0,
                width: '360px', height: '520px',
                background: 'rgba(14,14,18,0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.12)',
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div style={{
                padding: '1rem 1.25rem',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
              }}>
                <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(99,102,241,0.4)' }}>
                  <Bot size={18} color="white" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>TestNova AI</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 6px var(--success)' }} />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Powered by Gemini · Online</span>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                  <X size={18} />
                </button>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                {messages.map((m) => <MessageBubble key={m.id} msg={m} />)}
                {typing && <TypingIndicator />}
                <div ref={bottomRef} />
              </div>

              {/* Quick Actions */}
              <div style={{ padding: '0 1rem 0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                  {QUICK_ACTIONS.map((qa) => (
                    <button key={qa} onClick={() => sendMessage(qa)} style={{
                      whiteSpace: 'nowrap', padding: '0.35rem 0.75rem', borderRadius: '20px', flexShrink: 0,
                      background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                      color: 'var(--accent-primary)', fontSize: '0.72rem', fontWeight: 500, cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}>
                      {qa}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginRight: '0.25rem' }}>
                  <Sparkles size={12} color="var(--accent-secondary)" />
                </div>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                  placeholder="Ask anything about QA…"
                  style={{
                    flex: 1, padding: '0.5rem 0.75rem',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none',
                  }}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || typing}
                  style={{
                    width: 32, height: 32, borderRadius: '8px', border: 'none', cursor: 'pointer',
                    background: input.trim() && !typing ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' : 'rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Send size={14} color={input.trim() && !typing ? 'white' : 'var(--text-muted)'} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
