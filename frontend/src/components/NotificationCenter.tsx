'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, XCircle, Sparkles, AlertTriangle, X, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Notification {
  id: number;
  type: 'passed' | 'failed' | 'ai' | 'defect';
  title: string;
  body: string;
  time: string;
  read: boolean;
  link: string;
  group: 'Today' | 'Yesterday';
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, type: 'ai', title: 'AI Insight Ready', body: 'TestNova AI analyzed the latest regression run. Pass rate improved by 2.1%.', time: '10 min ago', read: false, link: '/reports', group: 'Today' },
  { id: 2, type: 'failed', title: 'Test Run Failed', body: 'RUN-041 (Checkout Smoke Tests) failed with 5 errors. AI defect analysis complete.', time: '1 hr ago', read: false, link: '/runs', group: 'Today' },
  { id: 3, type: 'defect', title: 'Critical Defect Detected', body: 'DEF-018: Discount calculation bug found. Severity: Critical. Suggested fix available.', time: '3 hrs ago', read: false, link: '/defects', group: 'Today' },
  { id: 4, type: 'passed', title: 'Full Regression Passed ✓', body: 'RUN-042 completed successfully. 307/312 tests passed (98.4% pass rate).', time: '6 hrs ago', read: true, link: '/runs', group: 'Today' },
  { id: 5, type: 'ai', title: 'Auto-Scripter Updated', body: 'AI self-healed a broken selector in the Checkout automation script.', time: 'Yesterday', read: true, link: '/scripter', group: 'Yesterday' },
  { id: 6, type: 'passed', title: 'Login Module Tests Passed', body: 'RUN-040: All 24 login module tests passed. Zero failures.', time: 'Yesterday', read: true, link: '/runs', group: 'Yesterday' },
];

const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  passed:  { icon: <CheckCircle size={16} />,   color: 'var(--success)',         bg: 'rgba(16,185,129,0.12)' },
  failed:  { icon: <XCircle size={16} />,        color: 'var(--error)',           bg: 'rgba(239,68,68,0.12)' },
  ai:      { icon: <Sparkles size={16} />,       color: 'var(--accent-secondary)',bg: 'rgba(139,92,246,0.12)' },
  defect:  { icon: <AlertTriangle size={16} />,  color: 'var(--warning)',         bg: 'rgba(245,158,11,0.12)' },
};

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const unread = notifications.filter((n) => !n.read).length;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const dismiss = (id: number, e: React.MouseEvent) => { e.stopPropagation(); setNotifications((prev) => prev.filter((n) => n.id !== id)); };

  const handleClick = (n: Notification) => {
    markRead(n.id);
    setOpen(false);
    router.push(n.link);
  };

  const groups = ['Today', 'Yesterday'] as const;

  return (
    <div ref={panelRef} style={{ position: 'relative' }}>
      {/* Bell Button */}
      <button
        id="notification-bell-btn"
        onClick={() => setOpen(!open)}
        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px' }}
      >
        <motion.div whileHover={{ rotate: [0, -15, 15, -10, 0] }} transition={{ duration: 0.4 }}>
          <Bell size={20} />
        </motion.div>
        <AnimatePresence>
          {unread > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              style={{
                position: 'absolute', top: '2px', right: '2px',
                minWidth: '16px', height: '16px', borderRadius: '8px',
                background: 'var(--error)', color: 'white',
                fontSize: '0.6rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 8px var(--error)', padding: '0 3px',
              }}
            >
              {unread}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
              position: 'absolute', top: 'calc(100% + 12px)', right: '-8px',
              width: '380px', maxHeight: '520px',
              background: 'rgba(14,14,20,0.97)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              overflow: 'hidden',
              zIndex: 100,
              display: 'flex', flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Notifications</h3>
                {unread > 0 && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{unread} unread</p>}
              </div>
              {unread > 0 && (
                <button onClick={markAllRead} style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                  borderRadius: '20px', padding: '4px 10px',
                  color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                }}>
                  <Check size={12} /> Mark all read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {groups.map((group) => {
                const items = notifications.filter((n) => n.group === group);
                if (!items.length) return null;
                return (
                  <div key={group}>
                    <div style={{ padding: '0.6rem 1.25rem 0.3rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {group}
                    </div>
                    {items.map((n) => {
                      const cfg = typeConfig[n.type];
                      return (
                        <motion.div
                          key={n.id}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20, height: 0 }}
                          onClick={() => handleClick(n)}
                          style={{
                            padding: '0.875rem 1.25rem',
                            display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                            cursor: 'pointer',
                            background: n.read ? 'transparent' : 'rgba(99,102,241,0.04)',
                            borderLeft: n.read ? '3px solid transparent' : '3px solid var(--accent-primary)',
                            transition: 'background 0.2s ease',
                            position: 'relative',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(99,102,241,0.04)')}
                        >
                          {/* Icon */}
                          <div style={{ width: 32, height: 32, borderRadius: '8px', background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: cfg.color, flexShrink: 0 }}>
                            {cfg.icon}
                          </div>
                          {/* Content */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: '0.85rem', fontWeight: n.read ? 400 : 600, marginBottom: '0.2rem', color: n.read ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                              {n.title}
                            </p>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                              {n.body}
                            </p>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>{n.time}</p>
                          </div>
                          {/* Dismiss */}
                          <button onClick={(e) => dismiss(n.id, e)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', opacity: 0, transition: 'opacity 0.2s', padding: '2px', flexShrink: 0 }}
                            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}>
                            <X size={14} />
                          </button>
                          {/* Unread dot */}
                          {!n.read && <div style={{ position: 'absolute', top: '50%', right: '1rem', transform: 'translateY(-50%)', width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-primary)', boxShadow: '0 0 6px var(--accent-primary)' }} />}
                        </motion.div>
                      );
                    })}
                  </div>
                );
              })}
              {notifications.length === 0 && (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Bell size={28} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
                  <p style={{ fontSize: '0.85rem' }}>All caught up! No notifications.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
