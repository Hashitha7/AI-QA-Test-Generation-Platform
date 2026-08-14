'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Bug, Sparkles, AlertTriangle, CheckCircle, Clock, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';

interface Defect {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  module: string;
  aiSummary: string;
  rootCause: string;
  suggestedFix: string;
  runId: string;
  detectedAt: string;
}

const severityConfig: Record<string, { color: string; bg: string; border: string }> = {
  Critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' },
  High: { color: '#f97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.3)' },
  Medium: { color: 'var(--warning)', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  Low: { color: 'var(--success)', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)' },
};

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  Open: { color: 'var(--error)', icon: <AlertTriangle size={13} /> },
  'In Progress': { color: 'var(--warning)', icon: <Clock size={13} /> },
  Resolved: { color: 'var(--success)', icon: <CheckCircle size={13} /> },
  Closed: { color: 'var(--text-muted)', icon: <CheckCircle size={13} /> },
};

function DefectCard({ defect, index }: { defect: Defect; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const sev = severityConfig[defect.severity];
  const sta = statusConfig[defect.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.09 }}
      style={{ border: `1px solid ${expanded ? sev.border : 'var(--border-color)'}`, borderRadius: '12px', marginBottom: '0.75rem', background: 'rgba(255,255,255,0.02)', overflow: 'hidden', transition: 'border-color 0.3s' }}
    >
      <div onClick={() => setExpanded(!expanded)} style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)', minWidth: '60px' }}>{defect.id}</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{defect.title}</p>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{defect.module} · Run {defect.runId} · {defect.detectedAt}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', background: sev.bg, color: sev.color, border: `1px solid ${sev.border}`, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{defect.severity}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: sta.color }}>{sta.icon} {defect.status}</span>
        </div>
        {expanded ? <ChevronDown size={16} color="var(--text-muted)" /> : <ChevronRight size={16} color="var(--text-muted)" />}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
            style={{ borderTop: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', background: 'rgba(0,0,0,0.2)' }}>
              {[
                { label: '🤖 AI Analysis Summary', content: defect.aiSummary, color: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.2)' },
                { label: '🔍 Root Cause', content: defect.rootCause, color: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.2)' },
                { label: '✅ AI-Suggested Fix', content: defect.suggestedFix, color: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.2)' },
              ].map((section) => (
                <div key={section.label} style={{ padding: '1rem', background: section.color, border: `1px solid ${section.border}`, borderRadius: '10px' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>{section.label}</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>{section.content}</p>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ExternalLink size={14} /> Create Jira Ticket
                </button>
                <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Mark as In Progress</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function DefectsPage() {
  const [filter, setFilter] = useState('All');
  const [defects, setDefects] = useState<Defect[]>([]);
  const [loading, setLoading] = useState(true);
  const filters = ['All', 'Open', 'In Progress', 'Resolved', 'Closed'];

  useEffect(() => {
    async function loadDefects() {
      try {
        const res = await api.getDefects();
        // Fallback properties for UI that aren't stored in DB yet
        const mapped = res.data.map((d: any) => ({
          ...d,
          aiSummary: d.ai_summary,
          rootCause: d.root_cause,
          suggestedFix: d.suggested_fix,
          runId: 'RUN-GEN',
          detectedAt: new Date().toISOString().split('T')[0]
        }));
        setDefects(mapped);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadDefects();
  }, []);

  const filtered = filter === 'All' ? defects : defects.filter((d) => d.status === filter);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{ padding: '2rem 3rem', width: '100%', maxWidth: '1200px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Bug size={28} color="var(--accent-secondary)" />
              <h1 className="text-3xl font-bold">Defects <span className="heading-gradient">(AI-Analyzed)</span></h1>
            </div>
            <p className="text-secondary" style={{ marginBottom: '2rem' }}>
              Every detected failure is automatically analyzed by AI for root cause and a suggested fix.
            </p>
          </motion.div>

          {/* Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { label: 'Critical', value: defects.filter(d => d.severity === 'Critical').length, color: '#ef4444', bg: 'rgba(239,68,68,0.07)' },
              { label: 'High', value: defects.filter(d => d.severity === 'High').length, color: '#f97316', bg: 'rgba(249,115,22,0.07)' },
              { label: 'Open', value: defects.filter(d => d.status === 'Open').length, color: 'var(--error)', bg: 'rgba(239,68,68,0.05)' },
              { label: 'AI Fixed (Suggested)', value: defects.filter(d => d.status === 'Resolved' || d.status === 'Closed').length, color: 'var(--success)', bg: 'rgba(16,185,129,0.05)' },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="glass-card" style={{ padding: '1.25rem', background: s.bg, textAlign: 'center' }}>
                <Sparkles size={20} color={s.color} style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '2rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {filters.map((f) => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '0.4rem 1rem', borderRadius: '20px', border: '1px solid',
                borderColor: filter === f ? 'var(--accent-primary)' : 'var(--border-color)',
                background: filter === f ? 'rgba(99,102,241,0.15)' : 'transparent',
                color: filter === f ? 'var(--accent-primary)' : 'var(--text-secondary)',
                cursor: 'pointer', fontSize: '0.85rem', fontWeight: filter === f ? 600 : 400, transition: 'all 0.2s ease'
              }}>{f}</button>
            ))}
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No defects found for this filter.</div>
            ) : (
              filtered.map((d, i) => <DefectCard key={d.id} defect={d} index={i} />)
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
