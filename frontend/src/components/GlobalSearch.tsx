'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, PlayCircle, Bug, LayoutDashboard, Code, BarChart3, Settings, ArrowRight, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  category: 'Pages' | 'Test Cases' | 'Test Runs' | 'Defects';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  link: string;
}

const ALL_RESULTS: SearchResult[] = [
  // Pages
  { id: 'p1', category: 'Pages', title: 'Dashboard', subtitle: 'Platform overview and quick actions', icon: <LayoutDashboard size={16} />, link: '/' },
  { id: 'p2', category: 'Pages', title: 'Test Generation', subtitle: 'AI test case generator from requirements', icon: <FileText size={16} />, link: '/generate' },
  { id: 'p3', category: 'Pages', title: 'Auto-Scripter', subtitle: 'NLP to Playwright / Cypress code', icon: <Code size={16} />, link: '/scripter' },
  { id: 'p4', category: 'Pages', title: 'Test Runs', subtitle: 'View and manage test execution runs', icon: <PlayCircle size={16} />, link: '/runs' },
  { id: 'p5', category: 'Pages', title: 'Defects (AI)', subtitle: 'AI-analyzed bugs with fix suggestions', icon: <Bug size={16} />, link: '/defects' },
  { id: 'p6', category: 'Pages', title: 'Reports & Analytics', subtitle: 'Charts, trends, and AI quality score', icon: <BarChart3 size={16} />, link: '/reports' },
  { id: 'p7', category: 'Pages', title: 'Settings', subtitle: 'Profile, API keys, integrations', icon: <Settings size={16} />, link: '/settings' },
  // Test Cases
  { id: 'tc1', category: 'Test Cases', title: 'TC-001: Verify successful login', subtitle: 'Happy Path · High Priority', icon: <FileText size={16} />, link: '/generate' },
  { id: 'tc2', category: 'Test Cases', title: 'TC-002: Login fails with wrong password', subtitle: 'Negative · High Priority', icon: <FileText size={16} />, link: '/generate' },
  { id: 'tc3', category: 'Test Cases', title: 'TC-004: Account lockout after 5 attempts', subtitle: 'Edge Case · High Priority', icon: <FileText size={16} />, link: '/generate' },
  { id: 'tc4', category: 'Test Cases', title: 'TC-005: Remember Me persists session', subtitle: 'Edge Case · Low Priority', icon: <FileText size={16} />, link: '/generate' },
  // Test Runs
  { id: 'r1', category: 'Test Runs', title: 'RUN-042: Full Regression Suite', subtitle: 'Passed · 307/312 · 4m 12s', icon: <PlayCircle size={16} />, link: '/runs' },
  { id: 'r2', category: 'Test Runs', title: 'RUN-041: Checkout Smoke Tests', subtitle: 'Failed · 5 errors · Production', icon: <PlayCircle size={16} />, link: '/runs' },
  { id: 'r3', category: 'Test Runs', title: 'RUN-040: Login Module Tests', subtitle: 'Passed · 24/24 · Staging', icon: <PlayCircle size={16} />, link: '/runs' },
  // Defects
  { id: 'd1', category: 'Defects', title: 'DEF-018: Checkout discount bug', subtitle: 'Critical · Open · Checkout Flow', icon: <Bug size={16} />, link: '/defects' },
  { id: 'd2', category: 'Defects', title: 'DEF-017: Remember Me session bug', subtitle: 'High · In Progress · Auth', icon: <Bug size={16} />, link: '/defects' },
];

const RECENT_SEARCHES = ['Login module', 'Failed tests', 'DEF-018', 'Playwright script'];

const categoryColors: Record<string, string> = {
  Pages: 'var(--accent-primary)',
  'Test Cases': '#10b981',
  'Test Runs': 'var(--warning)',
  Defects: 'var(--error)',
};

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = query.trim()
    ? ALL_RESULTS.filter((r) =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        r.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const groupedFiltered: Record<string, SearchResult[]> = {};
  filtered.forEach((r) => {
    if (!groupedFiltered[r.category]) groupedFiltered[r.category] = [];
    groupedFiltered[r.category].push(r);
  });

  const flatResults = filtered;

  const openSearch = useCallback(() => {
    setOpen(true);
    setQuery('');
    setSelectedIndex(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  // Keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [openSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, flatResults.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && flatResults[selectedIndex]) navigate(flatResults[selectedIndex]);
  };

  const navigate = (result: SearchResult) => {
    setOpen(false);
    router.push(result.link);
  };

  return (
    <>
      {/* Search Bar Trigger */}
      <div onClick={openSearch} style={{ position: 'relative', width: '300px', cursor: 'text' }}>
        <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        <div style={{
          width: '100%', padding: '0.5rem 3rem 0.5rem 2.25rem',
          borderRadius: '20px', border: '1px solid var(--border-color)',
          background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)',
          fontSize: '0.85rem', userSelect: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span>Search tests, runs, defects…</span>
          <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(255,255,255,0.07)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            ⌘K
          </span>
        </div>
      </div>

      {/* Command Palette Overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 500 }}
            />

            {/* Palette */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'fixed', top: '12%', left: '50%', transform: 'translateX(-50%)',
                width: '100%', maxWidth: '620px',
                background: 'rgba(12,12,18,0.98)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
                zIndex: 501, overflow: 'hidden',
              }}
            >
              {/* Search Input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <Search size={20} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search for tests, runs, defects, or pages…"
                  style={{
                    flex: 1, background: 'none', border: 'none', outline: 'none',
                    color: 'var(--text-primary)', fontSize: '1rem',
                  }}
                />
                <kbd style={{ padding: '2px 8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>ESC</kbd>
              </div>

              {/* Results / Recent */}
              <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
                {!query.trim() ? (
                  <div style={{ padding: '1rem 1.25rem' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock size={12} /> Recent Searches
                    </p>
                    {RECENT_SEARCHES.map((s) => (
                      <div key={s} onClick={() => setQuery(s)} style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem',
                        borderRadius: '8px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.9rem', transition: 'background 0.15s',
                      }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <Clock size={14} color="var(--text-muted)" />
                        {s}
                        <ArrowRight size={14} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
                      </div>
                    ))}
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', margin: '1.25rem 0 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      Quick Navigate
                    </p>
                    {ALL_RESULTS.filter((r) => r.category === 'Pages').map((r) => (
                      <div key={r.id} onClick={() => navigate(r)} style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem',
                        borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', transition: 'background 0.15s',
                      }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <span style={{ color: categoryColors['Pages'] }}>{r.icon}</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{r.title}</span>
                        <ArrowRight size={14} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
                      </div>
                    ))}
                  </div>
                ) : filtered.length === 0 ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <Search size={32} style={{ opacity: 0.2, marginBottom: '0.75rem' }} />
                    <p style={{ fontSize: '0.9rem' }}>No results for "{query}"</p>
                  </div>
                ) : (
                  <div style={{ padding: '0.5rem' }}>
                    {(Object.entries(groupedFiltered) as [string, SearchResult[]][]).map(([cat, items]) => (
                      <div key={cat}>
                        <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', padding: '0.5rem 0.75rem 0.25rem' }}>
                          {cat}
                        </p>
                        {items.map((result) => {
                          const globalIdx = flatResults.indexOf(result);
                          const isSelected = globalIdx === selectedIndex;
                          return (
                            <motion.div
                              key={result.id}
                              onClick={() => navigate(result)}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '0.65rem 0.75rem', borderRadius: '8px', cursor: 'pointer',
                                background: isSelected ? 'rgba(99,102,241,0.12)' : 'transparent',
                                border: isSelected ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
                                transition: 'all 0.15s ease',
                              }}
                              onMouseEnter={() => setSelectedIndex(globalIdx)}
                            >
                              <div style={{ width: 32, height: 32, borderRadius: '8px', background: `${categoryColors[cat]}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: categoryColors[cat], flexShrink: 0 }}>
                                {result.icon}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: '0.88rem', fontWeight: 500, color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)', marginBottom: '2px' }}>{result.title}</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{result.subtitle}</p>
                              </div>
                              {isSelected && <ArrowRight size={14} color="var(--accent-primary)" style={{ flexShrink: 0 }} />}
                            </motion.div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={{ padding: '0.6rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                {[['↑↓', 'navigate'], ['↵', 'open'], ['esc', 'close']].map(([key, label]) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <kbd style={{ padding: '1px 5px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px' }}>{key}</kbd>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
