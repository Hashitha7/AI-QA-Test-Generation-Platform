'use client';

import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Activity, CheckCircle, Clock, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const stats = [
    { label: 'Tests Generated', value: '1,248', icon: <Zap size={24} color="var(--accent-primary)" />, trend: '+12% this week', trendColor: 'var(--success)' },
    { label: 'Execution Time Saved', value: '42 hrs', icon: <Clock size={24} color="var(--success)" />, trend: '+5 hrs this week', trendColor: 'var(--success)' },
    { label: 'Test Pass Rate', value: '98.5%', icon: <CheckCircle size={24} color="var(--success)" />, trend: '+0.5% this week', trendColor: 'var(--success)' },
    { label: 'Active Automations', value: '156', icon: <Activity size={24} color="var(--warning)" />, trend: '+12 new scripts', trendColor: 'var(--warning)' },
  ];

  const recentActivity = [
    { id: 1, action: 'AI generated 15 test cases for', target: 'Login Module', time: '10 mins ago', status: 'completed' },
    { id: 2, action: 'Auto-Scripter updated selector in', target: 'Checkout Flow', time: '1 hr ago', status: 'self-healed' },
    { id: 3, action: 'Regression Suite finished with', target: '2 failures', time: '3 hrs ago', status: 'failed' },
    { id: 4, action: 'AI analyzed defect in', target: 'Discount Module', time: '5 hrs ago', status: 'completed' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }}>
        <Header />
        
        <div style={{ padding: '2rem 3rem', maxWidth: '1400px', width: '100%' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div>
                <h1 className="text-3xl font-bold" style={{ marginBottom: '0.5rem' }}>Welcome back, Boss 👋</h1>
                <p className="text-secondary">Here's what TestNova AI has been doing for your quality assurance.</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', padding: '4px 6px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '20px', alignItems: 'center' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600, paddingRight: '8px' }}>All Systems Operational</span>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card"
                style={{ padding: '1.5rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                    {stat.icon}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: stat.trendColor, background: `${stat.trendColor}1a`, padding: '4px 8px', borderRadius: '20px' }}>
                    {stat.trend}
                  </span>
                </div>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.35rem' }}>{stat.label}</h3>
                <div className="text-3xl font-bold">{stat.value}</div>
              </motion.div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="glass-panel" style={{ padding: '2rem' }}>
              <h2 className="text-xl font-bold" style={{ marginBottom: '1.5rem' }}>Quick Actions</h2>
              <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'rgba(99,102,241,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'border-color 0.2s' }}>
                  <div>
                    <h3 className="font-semibold" style={{ marginBottom: '0.35rem' }}>Generate from Requirements</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Paste a Jira ticket and let AI write the test cases.</p>
                  </div>
                  <Link href="/generate">
                    <button id="go-to-generate-btn" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}>
                      Generate Now <ArrowRight size={14} />
                    </button>
                  </Link>
                </div>
                <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'rgba(139,92,246,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 className="font-semibold" style={{ marginBottom: '0.35rem' }}>Auto-Script Natural Language</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Write manual steps, get Playwright / Cypress code.</p>
                  </div>
                  <Link href="/scripter">
                    <button id="go-to-scripter-btn" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}>
                      Open Scripter <ArrowRight size={14} />
                    </button>
                  </Link>
                </div>
                <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'rgba(16,185,129,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 className="font-semibold" style={{ marginBottom: '0.35rem' }}>View Latest Test Runs</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Inspect execution results and AI defect analysis.</p>
                  </div>
                  <Link href="/runs">
                    <button id="go-to-runs-btn" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}>
                      View Runs <ArrowRight size={14} />
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className="text-xl font-bold">Recent AI Activity</h2>
                <Link href="/runs" style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>View all →</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {recentActivity.map((activity) => (
                  <div key={activity.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                      background: activity.status === 'completed' ? 'var(--success)' : activity.status === 'self-healed' ? 'var(--warning)' : 'var(--error)',
                      marginTop: '6px',
                      boxShadow: `0 0 8px ${activity.status === 'completed' ? 'var(--success)' : activity.status === 'self-healed' ? 'var(--warning)' : 'var(--error)'}`
                    }} />
                    <div>
                      <p style={{ fontSize: '0.875rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{activity.action} </span>
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom Row - Platform Health */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="glass-panel" style={{ padding: '2rem' }}>
            <h2 className="text-xl font-bold" style={{ marginBottom: '1.5rem' }}>Platform Health</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              {[
                { label: 'AI Engine', status: 'Online', color: 'var(--success)' },
                { label: 'Test Runner', status: 'Online', color: 'var(--success)' },
                { label: 'Database', status: 'Online', color: 'var(--success)' },
                { label: 'Queue (Redis)', status: 'Online', color: 'var(--success)' },
              ].map((service) => (
                <div key={service.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: service.color, boxShadow: `0 0 8px ${service.color}` }} />
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 500 }}>{service.label}</p>
                    <p style={{ fontSize: '0.75rem', color: service.color }}>{service.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
