'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Settings, User, Bell, KeyRound, Database, Plug, ChevronRight, Save, Check } from 'lucide-react';

type Section = 'profile' | 'notifications' | 'api' | 'integrations' | 'database';

const NAV_ITEMS: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'Profile & Team', icon: <User size={18} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  { id: 'api', label: 'API Keys & AI', icon: <KeyRound size={18} /> },
  { id: 'integrations', label: 'Integrations', icon: <Plug size={18} /> },
  { id: 'database', label: 'Database', icon: <Database size={18} /> },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <div onClick={onChange} style={{
      width: '44px', height: '24px', borderRadius: '12px', cursor: 'pointer',
      background: checked ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
      position: 'relative', transition: 'background 0.3s ease', flexShrink: 0,
    }}>
      <motion.div animate={{ x: checked ? 22 : 2 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{ position: 'absolute', top: '3px', width: '18px', height: '18px', borderRadius: '50%', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }} />
    </div>
  );
}

function InputField({ label, value, type = 'text', placeholder }: { label: string; value: string; type?: string; placeholder?: string }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>{label}</label>
      <input defaultValue={value} type={type} placeholder={placeholder} style={{
        width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)',
        borderRadius: '8px', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s'
      }}
        onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
        onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
      />
    </div>
  );
}

function SettingsRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0', borderBottom: '1px solid var(--border-color)' }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 500, marginBottom: description ? '0.25rem' : 0 }}>{label}</p>
        {description && <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{description}</p>}
      </div>
      <div style={{ marginLeft: '2rem' }}>{children}</div>
    </div>
  );
}

function ProfileSection() {
  const [saved, setSaved] = useState(false);
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  return (
    <div>
      <h2 className="text-xl font-bold" style={{ marginBottom: '1.5rem' }}>Profile & Team</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 2rem' }}>
        <InputField label="Full Name" value="QA Manager" />
        <InputField label="Email Address" value="qa.manager@company.com" type="email" />
        <InputField label="Role" value="QA Lead" />
        <InputField label="Company" value="Tech Innovations Ltd." />
      </div>
      <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
        <h3 className="font-semibold" style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Team Members</h3>
        {['Nimal Perera (QA Engineer)', 'Kamal Silva (Automation Lead)', 'Saman Fernando (Developer)'].map((m) => (
          <div key={m} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', marginBottom: '0.5rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
              {m[0]}
            </div>
            <span style={{ flex: 1, fontSize: '0.9rem' }}>{m}</span>
            <button style={{ background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-muted)', padding: '3px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem' }}>Remove</button>
          </div>
        ))}
      </div>
      <button onClick={handleSave} className="btn-primary" style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
      </button>
    </div>
  );
}

function NotificationsSection() {
  const [prefs, setPrefs] = useState({
    testFailed: true, testPassed: false, newDefect: true, aiInsight: true, weeklyReport: true, browserPush: false,
  });
  const toggle = (key: keyof typeof prefs) => setPrefs((p) => ({ ...p, [key]: !p[key] }));
  const items: { key: keyof typeof prefs; label: string; desc: string }[] = [
    { key: 'testFailed', label: 'Test Run Failed', desc: 'Get notified when any test run produces failures.' },
    { key: 'testPassed', label: 'Test Run Passed', desc: 'Get notified when all tests in a suite pass.' },
    { key: 'newDefect', label: 'New Defect Detected', desc: 'Receive an alert when AI detects a new defect.' },
    { key: 'aiInsight', label: 'AI Insights Ready', desc: 'Get notified when AI generates new analysis or suggestions.' },
    { key: 'weeklyReport', label: 'Weekly Summary Report', desc: 'Receive a weekly email summarizing QA health.' },
    { key: 'browserPush', label: 'Browser Push Notifications', desc: 'Allow TestNova to send push notifications to your browser.' },
  ];
  return (
    <div>
      <h2 className="text-xl font-bold" style={{ marginBottom: '1.5rem' }}>Notifications</h2>
      {items.map((item) => (
        <SettingsRow key={item.key} label={item.label} description={item.desc}>
          <Toggle checked={prefs[item.key]} onChange={() => toggle(item.key)} />
        </SettingsRow>
      ))}
    </div>
  );
}

function ApiSection() {
  const [showKey, setShowKey] = useState(false);
  const [model, setModel] = useState('gemini-3.1-pro');
  return (
    <div>
      <h2 className="text-xl font-bold" style={{ marginBottom: '1.5rem' }}>API Keys & AI Configuration</h2>
      <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px' }}>
        <h3 className="font-semibold" style={{ marginBottom: '1rem' }}>Platform API Key</h3>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input readOnly value={showKey ? 'tn_sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' : '••••••••••••••••••••••••••••••••'} style={{
            flex: 1, padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '0.85rem', outline: 'none'
          }} />
          <button onClick={() => setShowKey(!showKey)} className="btn-secondary" style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>{showKey ? 'Hide' : 'Reveal'}</button>
          <button className="btn-secondary" style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>Regenerate</button>
        </div>
      </div>
      <h3 className="font-semibold" style={{ marginBottom: '1rem' }}>AI Model Selection</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { id: 'gemini-3.1-pro', name: 'Gemini 3.1 Pro', desc: 'Best reasoning & code gen', badge: 'Recommended' },
          { id: 'gpt-4o', name: 'GPT-4o', desc: 'Great for structured output', badge: null },
          { id: 'claude-sonnet', name: 'Claude Sonnet', desc: 'Excellent for analysis', badge: null },
        ].map((m) => (
          <div key={m.id} onClick={() => setModel(m.id)} style={{
            padding: '1.25rem', borderRadius: '10px', cursor: 'pointer',
            border: `1px solid ${model === m.id ? 'var(--accent-primary)' : 'var(--border-color)'}`,
            background: model === m.id ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.02)',
            transition: 'all 0.2s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <p className="font-semibold" style={{ fontSize: '0.95rem' }}>{m.name}</p>
              {m.badge && <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '20px', background: 'rgba(16,185,129,0.15)', color: 'var(--success)', fontWeight: 700 }}>{m.badge}</span>}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m.desc}</p>
          </div>
        ))}
      </div>
      <InputField label="Gemini / OpenAI API Key" value="" type="password" placeholder="Enter your API key..." />
      <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Save size={16} /> Save AI Settings</button>
    </div>
  );
}

function IntegrationsSection() {
  const [connected, setConnected] = useState<Record<string, boolean>>({ jira: true, github: false, slack: true, testrail: false });
  const integrations = [
    { id: 'jira', name: 'Jira', desc: 'Sync requirements and auto-create tickets for defects.', color: '#0052CC' },
    { id: 'github', name: 'GitHub', desc: 'Trigger test runs on pull requests and commits.', color: '#e2e8f0' },
    { id: 'slack', name: 'Slack', desc: 'Send test result notifications to Slack channels.', color: '#4A154B' },
    { id: 'testrail', name: 'TestRail', desc: 'Sync test cases and results with TestRail.', color: '#65C1E8' },
  ];
  return (
    <div>
      <h2 className="text-xl font-bold" style={{ marginBottom: '1.5rem' }}>Integrations</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {integrations.map((intg) => (
          <div key={intg.id} style={{ display: 'flex', alignItems: 'center', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '12px', gap: '1rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)', fontSize: '1.2rem', fontWeight: 700, color: intg.color }}>
              {intg.name[0]}
            </div>
            <div style={{ flex: 1 }}>
              <p className="font-semibold">{intg.name}</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{intg.desc}</p>
            </div>
            <button onClick={() => setConnected((p) => ({ ...p, [intg.id]: !p[intg.id] }))} style={{
              padding: '0.5rem 1.25rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s ease',
              background: connected[intg.id] ? 'rgba(16,185,129,0.1)' : 'var(--bg-tertiary)',
              border: `1px solid ${connected[intg.id] ? 'rgba(16,185,129,0.3)' : 'var(--border-color)'}`,
              color: connected[intg.id] ? 'var(--success)' : 'var(--text-secondary)',
            }}>
              {connected[intg.id] ? '✓ Connected' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function DatabaseSection() {
  return (
    <div>
      <h2 className="text-xl font-bold" style={{ marginBottom: '1.5rem' }}>Database Configuration</h2>
      <div style={{ padding: '1rem 1.25rem', background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }} />
        <span style={{ fontSize: '0.9rem', color: 'var(--success)', fontWeight: 600 }}>Connected to PostgreSQL (pgvector)</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 2rem' }}>
        <InputField label="Host" value="localhost" />
        <InputField label="Port" value="5432" />
        <InputField label="Database Name" value="testnova_db" />
        <InputField label="User" value="testnova_user" />
        <InputField label="Password" value="" type="password" placeholder="••••••••••••" />
        <InputField label="Max Connections" value="20" />
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
        <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>Test Connection</button>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}><Save size={15} /> Save Configuration</button>
      </div>
    </div>
  );
}

const SECTION_COMPONENTS: Record<Section, React.ReactNode> = {
  profile: <ProfileSection />,
  notifications: <NotificationsSection />,
  api: <ApiSection />,
  integrations: <IntegrationsSection />,
  database: <DatabaseSection />,
};

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>('profile');
  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{ padding: '2rem 3rem', width: '100%', maxWidth: '1200px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Settings size={28} color="var(--accent-secondary)" />
              <h1 className="text-3xl font-bold">Settings</h1>
            </div>
            <p className="text-secondary" style={{ marginBottom: '2rem' }}>Configure your platform, integrations, and AI models.</p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2rem', alignItems: 'start' }}>
            {/* Settings Nav */}
            <div className="glass-panel" style={{ padding: '1rem' }}>
              {NAV_ITEMS.map((item) => (
                <button key={item.id} onClick={() => setActiveSection(item.id)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '0.25rem',
                  border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', textAlign: 'left',
                  background: activeSection === item.id ? 'rgba(99,102,241,0.12)' : 'transparent',
                  color: activeSection === item.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', fontWeight: activeSection === item.id ? 600 : 400 }}>
                    {item.icon}{item.label}
                  </div>
                  {activeSection === item.id && <ChevronRight size={14} />}
                </button>
              ))}
            </div>
            {/* Settings Content */}
            <motion.div key={activeSection} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="glass-panel" style={{ padding: '2rem' }}>
              {SECTION_COMPONENTS[activeSection]}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
