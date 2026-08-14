'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Sparkles, FileText, CheckCircle, AlertCircle, XCircle, Copy, Download, ChevronDown, ChevronRight, Tag } from 'lucide-react';

interface TestCase {
  id: string;
  title: string;
  type: 'Happy Path' | 'Edge Case' | 'Negative';
  priority: 'High' | 'Medium' | 'Low';
  steps: string[];
  expectedResult: string;
}

const typeColors = {
  'Happy Path': { bg: 'rgba(16,185,129,0.1)', text: 'var(--success)', border: 'rgba(16,185,129,0.3)' },
  'Edge Case': { bg: 'rgba(245,158,11,0.1)', text: 'var(--warning)', border: 'rgba(245,158,11,0.3)' },
  'Negative': { bg: 'rgba(239,68,68,0.1)', text: 'var(--error)', border: 'rgba(239,68,68,0.3)' },
};

const priorityIcons = {
  'High': <XCircle size={14} color="var(--error)" />,
  'Medium': <AlertCircle size={14} color="var(--warning)" />,
  'Low': <CheckCircle size={14} color="var(--success)" />,
};

import { api } from '@/services/api';

function TestCaseCard({ tc, index }: { tc: TestCase; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const color = typeColors[tc.type] || typeColors['Happy Path'];
  const pIcon = priorityIcons[tc.priority] || priorityIcons['Medium'];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      style={{
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.02)',
        marginBottom: '0.75rem',
        transition: 'border-color 0.2s ease',
      }}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)', minWidth: '60px' }}>{tc.id}</span>
        <span style={{ flex: 1, fontWeight: 500, fontSize: '0.95rem' }}>{tc.title}</span>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{
            fontSize: '0.7rem', fontWeight: 600, padding: '3px 10px', borderRadius: '20px',
            background: color.bg, color: color.text, border: `1px solid ${color.border}`,
            textTransform: 'uppercase', letterSpacing: '0.5px'
          }}>{tc.type}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            {pIcon}<span>{tc.priority}</span>
          </div>
        </div>
        {expanded ? <ChevronDown size={16} color="var(--text-muted)" /> : <ChevronRight size={16} color="var(--text-muted)" />}
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden', borderTop: '1px solid var(--border-color)', padding: '1.25rem', background: 'rgba(0,0,0,0.15)' }}
          >
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem', fontWeight: 600 }}>Test Steps</p>
            <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {tc.steps?.map((step, i) => (
                <li key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{step}</li>
              ))}
            </ol>
            <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(16,185,129,0.05)', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.15)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.35rem', fontWeight: 600 }}>Expected Result</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{tc.expectedResult}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function GeneratePage() {
  const [requirements, setRequirements] = useState('');
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async () => {
    if (!requirements.trim()) return;
    setLoading(true);
    setGenerated(false);
    setTestCases([]);
    try {
      const response = await api.generateTestCases(requirements);
      setTestCases(response.data);
      setGenerated(true);
    } catch (e) {
      console.error(e);
      alert('Failed to generate test cases.');
    } finally {
      setLoading(false);
    }
  };

  const summary = {
    total: testCases.length,
    happy: testCases.filter((t) => t.type === 'Happy Path').length,
    edge: testCases.filter((t) => t.type === 'Edge Case').length,
    negative: testCases.filter((t) => t.type === 'Negative').length,
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{ padding: '2rem 3rem', width: '100%', maxWidth: '1200px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Sparkles size={28} color="var(--accent-secondary)" />
              <h1 className="text-3xl font-bold">AI Test Case Generator</h1>
            </div>
            <p className="text-secondary" style={{ marginBottom: '2rem' }}>
              Paste a user story, requirement, or Jira ticket. Our AI will generate comprehensive test cases instantly.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }} className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>
              <FileText size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Requirement / User Story
            </label>
            <textarea
              id="requirements-input"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder={`Example:\n\nAs a registered user, I want to be able to login to the application using my email and password so that I can access my account dashboard.\n\nAcceptance Criteria:\n- Email field is required and must be a valid email format\n- Password field is required\n- Show error if credentials are invalid\n- Lock account after 5 failed attempts\n- Support "Remember Me" functionality`}
              style={{
                width: '100%',
                minHeight: '200px',
                padding: '1rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem',
                resize: 'vertical',
                outline: 'none',
                lineHeight: 1.7,
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {(['Web App', 'API', 'Mobile'] as const).map((t) => (
                  <button key={t} className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Tag size={12} /> {t}
                  </button>
                ))}
              </div>
              <button
                id="generate-tests-btn"
                className="btn-primary"
                onClick={handleGenerate}
                disabled={loading || !requirements.trim()}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem',
                  opacity: loading || !requirements.trim() ? 0.6 : 1, cursor: loading || !requirements.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      style={{ width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }}
                    />
                    Generating…
                  </>
                ) : (
                  <><Sparkles size={16} /> Generate Test Cases</>
                )}
              </button>
            </div>
          </motion.div>

          <AnimatePresence>
            {generated && testCases.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                  {[
                    { label: 'Total Generated', value: summary.total, color: 'var(--accent-primary)' },
                    { label: 'Happy Path', value: summary.happy, color: 'var(--success)' },
                    { label: 'Edge Cases', value: summary.edge, color: 'var(--warning)' },
                    { label: 'Negative', value: summary.negative, color: 'var(--error)' },
                  ].map((s) => (
                    <div key={s.label} className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="glass-panel" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 className="text-xl font-bold">Generated Test Cases</h2>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                        <Copy size={14} /> Copy All
                      </button>
                      <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                        <Download size={14} /> Export CSV
                      </button>
                    </div>
                  </div>
                  {testCases.map((tc, i) => <TestCaseCard key={tc.id} tc={tc} index={i} />)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
