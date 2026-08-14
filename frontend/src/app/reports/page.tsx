'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { BarChart3, TrendingUp, Award, Target, Zap } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
};

const gridColor = 'rgba(255,255,255,0.04)';
const tickColor = 'rgba(255,255,255,0.35)';

// --- Data ---
const last30days = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
});

const passData = [88, 91, 87, 94, 96, 93, 97, 95, 98, 96, 99, 97, 98, 96, 98, 97, 99, 98, 99, 97, 98, 100, 99, 98, 99, 98, 99, 99, 98, 99];
const failData = [12, 9, 13, 6, 4, 7, 3, 5, 2, 4, 1, 3, 2, 4, 2, 3, 1, 2, 1, 3, 2, 0, 1, 2, 1, 2, 1, 1, 2, 1];

const trendData = {
  labels: last30days,
  datasets: [
    {
      label: 'Passed',
      data: passData,
      borderColor: '#10b981',
      backgroundColor: 'rgba(16,185,129,0.08)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 2,
    },
    {
      label: 'Failed',
      data: failData,
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239,68,68,0.06)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 2,
    },
  ],
};

const coverageData = {
  labels: ['Login & Auth', 'Checkout', 'Product Catalog', 'Search', 'User Profile', 'API Endpoints', 'Payments'],
  datasets: [{
    data: [98, 74, 81, 62, 88, 95, 70],
    backgroundColor: ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#14b8a6'],
    borderWidth: 0,
    hoverOffset: 8,
  }],
};

const weeklyLabels = ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6', 'Wk 7', 'Wk 8'];
const aiGenData = [45, 62, 78, 55, 90, 105, 88, 120];
const manualData = [30, 28, 25, 20, 18, 15, 12, 10];

const generationData = {
  labels: weeklyLabels,
  datasets: [
    {
      label: 'AI Generated',
      data: aiGenData,
      backgroundColor: 'rgba(99,102,241,0.7)',
      borderRadius: 6,
      borderSkipped: false,
    },
    {
      label: 'Manual',
      data: manualData,
      backgroundColor: 'rgba(255,255,255,0.08)',
      borderRadius: 6,
      borderSkipped: false,
    },
  ],
};

// --- Quality Score Ring ---
function QualityRing({ score }: { score: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grade = score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : 'C';
  const color = score >= 90 ? '#10b981' : score >= 80 ? '#6366f1' : '#f59e0b';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const cx = canvas.width / 2, cy = canvas.height / 2, r = 70;
    const startAngle = -Math.PI / 2;
    const pct = score / 100;
    let current = 0;
    const step = pct / 60;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Track
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 12;
      ctx.stroke();
      // Progress
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, startAngle + Math.PI * 2 * current);
      ctx.strokeStyle = color;
      ctx.lineWidth = 12;
      ctx.lineCap = 'round';
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.stroke();
    };

    const interval = setInterval(() => {
      current = Math.min(current + step, pct);
      draw();
      if (current >= pct) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, [score, color]);

  return (
    <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto' }}>
      <canvas ref={canvasRef} width={180} height={180} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '2.5rem', fontWeight: 800, color }}>{score}</span>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase' }}>Grade {grade}</span>
      </div>
    </div>
  );
}

const lineOpts = {
  ...CHART_DEFAULTS,
  scales: {
    x: { ticks: { color: tickColor, maxTicksLimit: 8, font: { size: 11 } }, grid: { color: gridColor } },
    y: { ticks: { color: tickColor, font: { size: 11 } }, grid: { color: gridColor } },
  },
  plugins: {
    legend: { display: true, position: 'top' as const, labels: { color: 'rgba(255,255,255,0.6)', boxWidth: 12, font: { size: 11 } } },
    tooltip: { mode: 'index' as const, intersect: false },
  },
};

const barOpts = {
  ...CHART_DEFAULTS,
  scales: {
    x: { stacked: true, ticks: { color: tickColor, font: { size: 11 } }, grid: { display: false } },
    y: { stacked: true, ticks: { color: tickColor, font: { size: 11 } }, grid: { color: gridColor } },
  },
  plugins: {
    legend: { display: true, position: 'top' as const, labels: { color: 'rgba(255,255,255,0.6)', boxWidth: 12, font: { size: 11 } } },
  },
};

const doughnutOpts = {
  ...CHART_DEFAULTS,
  plugins: {
    legend: {
      display: true, position: 'right' as const,
      labels: { color: 'rgba(255,255,255,0.6)', font: { size: 11 }, padding: 12, boxWidth: 10 },
    },
  },
  cutout: '65%',
};

export default function ReportsPage() {
  const topStats = [
    { label: 'AI Quality Score', value: '94/100', icon: <Award size={22} color="#10b981" />, color: '#10b981' },
    { label: 'Total Tests Run (30d)', value: '8,420', icon: <Target size={22} color="var(--accent-primary)" />, color: 'var(--accent-primary)' },
    { label: 'Avg Pass Rate (30d)', value: '97.4%', icon: <TrendingUp size={22} color="#10b981" />, color: '#10b981' },
    { label: 'AI Tests Generated', value: '643', icon: <Zap size={22} color="var(--accent-secondary)" />, color: 'var(--accent-secondary)' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{ padding: '2rem 3rem', maxWidth: '1400px', width: '100%' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <BarChart3 size={28} color="var(--accent-secondary)" />
              <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              AI-powered quality insights over the last 30 days.
            </p>
          </motion.div>

          {/* Top KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
            {topStats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ padding: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>{s.icon}</div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color, marginTop: '1rem' }}>{s.value}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Charts Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* Line Chart */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="glass-panel" style={{ padding: '1.75rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Test Pass / Fail Trend (30 Days)</h2>
              <div style={{ height: '240px' }}>
                <Line data={trendData} options={lineOpts} />
              </div>
            </motion.div>

            {/* Quality Score */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
              className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem', alignSelf: 'flex-start' }}>AI Quality Score</h2>
              <QualityRing score={94} />
              <div style={{ marginTop: '1.5rem', width: '100%' }}>
                {[
                  { label: 'Test Coverage', pct: 87, color: 'var(--accent-primary)' },
                  { label: 'Automation Rate', pct: 94, color: '#10b981' },
                  { label: 'Defect Detection', pct: 98, color: 'var(--accent-secondary)' },
                ].map((m) => (
                  <div key={m.label} style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{m.label}</span>
                      <span style={{ color: m.color, fontWeight: 600 }}>{m.pct}%</span>
                    </div>
                    <div style={{ height: '5px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${m.pct}%` }} transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
                        style={{ height: '100%', borderRadius: '3px', background: m.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Charts Row 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Bar Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="glass-panel" style={{ padding: '1.75rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>AI vs Manual Test Generation (Weekly)</h2>
              <div style={{ height: '220px' }}>
                <Bar data={generationData} options={barOpts} />
              </div>
            </motion.div>

            {/* Donut Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="glass-panel" style={{ padding: '1.75rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Test Coverage by Module (%)</h2>
              <div style={{ height: '220px' }}>
                <Doughnut data={coverageData} options={doughnutOpts} />
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
