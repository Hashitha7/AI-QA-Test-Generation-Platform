'use client';

import GlobalSearch from '@/components/GlobalSearch';
import NotificationCenter from '@/components/NotificationCenter';
import { User } from 'lucide-react';

export default function Header() {
  return (
    <header style={{
      height: '70px',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      background: 'rgba(10, 10, 12, 0.6)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      {/* Global Search */}
      <GlobalSearch />

      {/* Right side controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {/* Notification Center */}
        <NotificationCenter />

        {/* User Profile */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          paddingLeft: '1.5rem', borderLeft: '1px solid var(--border-color)',
        }}>
          <div style={{ textAlign: 'right' }}>
            <div className="text-sm font-semibold">QA Manager</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Pro Plan</div>
          </div>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid rgba(99,102,241,0.3)',
            boxShadow: '0 0 10px rgba(99,102,241,0.2)',
          }}>
            <User size={18} color="white" />
          </div>
        </div>
      </div>
    </header>
  );
}
