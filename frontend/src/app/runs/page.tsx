'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { PlayCircle, CheckCircle, XCircle, Clock, AlertCircle, ChevronDown, ChevronRight, BarChart3 } from 'lucide-react';

interface TestRun {
  id: string;
  name: string;
  status: 'Passed' | 'Failed' | 'Running' | 'Queued';
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: string;
  triggeredBy: string;
  timestamp: string;
  environment: string;
}


import { api } from '@/services/api';

const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  Passed: { color: 'var(--success)', bg: 'rgba(16,185,129,0.1)', icon: <CheckCircle size={14} /> },
  Failed: { color: 'var(--error)', bg: 'rgba(239,68,68,0.1)', icon: <XCircle size={14} /> },
  Running: { color: 'var(--accent-primary)', bg: 'rgba(99,102,241,0.1)', icon: <PlayCircle size={14} /> },
  Queued: { color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.05)', icon: <Clock size={14} /> },
};

function PassRateBar({ passed, total }: { passed: number; total: number }) {
  const pct = total > 0 ? Math.round((passed / total) * 100) : 0;
  const barColor = pct >= 95 ? 'var(--success)' : pct >= 70 ? 'var(--warning)' : 'var(--error)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '140px' }}>
      <div style={{ flex: 1, height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.08)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ height: '100%', borderRadius: '3px', background: barColor }}
        />
      </div>
      <span style={{ fontSize: '0.8rem', color: barColor, fontWeight: 600, minWidth: '35px', textAlign: 'right' }}>{pct}%</span>
    </div>
  );
}

function RunRow({ run, index }: { run: TestRun; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = statusConfig[run.status];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      style={{ border: '1px solid var(--border-color)', borderRadius: '10px', marginBottom: '0.6rem', background: 'rgba(255,255,255,0.02)', overflow: 'hidden' }}
    >
      <div onClick={() => setExpanded(!expanded)} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px 160px 100px 28px', gap: '1rem', padding: '1rem 1.25rem', alignItems: 'center', cursor: 'pointer' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{run.id}</span>
        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{run.name}</span>
        <span style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '4px 10px', borderRadius: '20px',
          background: cfg.bg, color: cfg.color, fontSize: '0.75rem', fontWeight: 600, width: 'fit-content',
        }}>
          {run.status === 'Running' ? (
            <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}>{cfg.icon}</motion.span>
          ) : cfg.icon}
          {run.status}
        </span>
        <PassRateBar passed={run.passed} total={run.total} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <Clock size={13} /> {run.duration}
        </div>
        {expanded ? <ChevronDown size={16} color="var(--text-muted)" /> : <ChevronRight size={16} color="var(--text-muted)" />}
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
            style={{ borderTop: '1px solid var(--border-color)', padding: '1.25rem', background: 'rgba(0,0,0,0.15)', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
              {[
                { label: 'Total Tests', value: run.total, color: 'var(--text-primary)' },
                { label: 'Passed', value: run.passed, color: 'var(--success)' },
                { label: 'Failed', value: run.failed, color: 'var(--error)' },
                { label: 'Skipped', value: run.skipped, color: 'var(--warning)' },
                { label: 'Environment', value: run.environment, color: 'var(--accent-primary)' },
              ].map((d) => (
                <div key={d.label} style={{ textAlign: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 700, color: d.color, fontSize: '1.2rem' }}>{d.value}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '3px' }}>{d.label}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '2rem' }}>
              <span>Triggered by: <span style={{ color: 'var(--text-secondary)' }}>{run.triggeredBy}</span></span>
              <span>Started: <span style={{ color: 'var(--text-secondary)' }}>{run.timestamp}</span></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function RunsPage() {
  const [filter, setFilter] = useState('All');
  const [runs, setRuns] = useState<TestRun[]>([]);
  const [loading, setLoading] = useState(true);
  const filters = ['All', 'Passed', 'Failed', 'Running', 'Queued'];

  const loadRuns = async () => {
    try {
      const res = await api.getRuns();
      setRuns(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRuns();
  }, []);

  const handleTriggerRun = async () => {
    try {
      await api.triggerRun();
      loadRuns(); // Reload to show the new run
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = filter === 'All' ? runs : runs.filter((r) => r.status === filter);

  const totalRuns = runs.length;
  const passedRuns = runs.filter((r) => r.status === 'Passed').length;
  const failedRuns = runs.filter((r) => r.status === 'Failed').length;
  const runningRuns = runs.filter((r) => r.status === 'Running').length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{ padding: '2rem 3rem', width: '100%', maxWidth: '1300px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <BarChart3 size={28} color="var(--accent-secondary)" />
                <h1 className="text-3xl font-bold">Test Runs</h1>
              </div>
              <button onClick={handleTriggerRun} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.5rem' }}>
                <PlayCircle size={16} /> Trigger New Run
              </button>
            </div>
            <p className="text-secondary" style={{ marginBottom: '2rem' }}>Track and inspect all automated test execution runs.</p>
          </motion.div>

          {/* Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { label: 'Total Runs', value: totalRuns, color: 'var(--text-primary)', bg: 'rgba(255,255,255,0.05)' },
              { label: 'Passed', value: passedRuns, color: 'var(--success)', bg: 'rgba(16,185,129,0.07)' },
              { label: 'Failed', value: failedRuns, color: 'var(--error)', bg: 'rgba(239,68,68,0.07)' },
              { label: 'Running Now', value: runningRuns, color: 'var(--accent-primary)', bg: 'rgba(99,102,241,0.07)' },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="glass-card" style={{ padding: '1.25rem', background: s.bg }}>
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

          {/* Table Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px 160px 100px 28px', gap: '1rem', padding: '0.5rem 1.25rem', marginBottom: '0.5rem' }}>
            {['Run ID', 'Suite Name', 'Status', 'Pass Rate', 'Duration', ''].map((h) => (
              <span key={h} style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>
            ))}
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No runs found for this filter.</div>
            ) : (
              filtered.map((run, i) => <RunRow key={run.id} run={run} index={i} />)
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
