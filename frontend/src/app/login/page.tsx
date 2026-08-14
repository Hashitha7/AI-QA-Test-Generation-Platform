'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orbs, setOrbs] = useState<{ x: number; y: number; size: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    setOrbs(
      Array.from({ length: 6 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 200 + Math.random() * 300,
        duration: 8 + Math.random() * 10,
        delay: Math.random() * 5,
      }))
    );
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    // Demo: any credentials work
    router.push('/');
  };

  const fillDemo = () => {
    setEmail('qa.manager@company.com');
    setPassword('TestNova@2026');
  };

  return (
    <div style={{
      minHeight: '100vh', width: '100vw',
      background: 'var(--bg-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Animated Background Orbs */}
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          animate={{
            x: ['0%', '5%', '-5%', '3%', '0%'],
            y: ['0%', '-8%', '5%', '-3%', '0%'],
          }}
          transition={{ duration: orb.duration, delay: orb.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: `${orb.x}%`, top: `${orb.y}%`,
            width: `${orb.size}px`, height: `${orb.size}px`,
            borderRadius: '50%',
            background: i % 2 === 0
              ? 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '100%', maxWidth: '440px',
          padding: '2.5rem',
          background: 'rgba(18,18,22,0.7)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
          boxShadow: '0 25px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.1)',
          position: 'relative', zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99,102,241,0.4)',
          }}>
            <Bug size={22} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              TestNova
            </h1>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '1px' }}>AI QA Platform</p>
          </div>
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Welcome back</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Sign in to your TestNova workspace
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="qa.manager@company.com"
              autoComplete="email"
              style={{
                width: '100%', padding: '0.75rem 1rem',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px', color: 'var(--text-primary)',
                fontSize: '0.9rem', outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--accent-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Password */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Password</label>
              <button type="button" style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                Forgot password?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                style={{
                  width: '100%', padding: '0.75rem 3rem 0.75rem 1rem',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px', color: 'var(--text-primary)',
                  fontSize: '0.9rem', outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--accent-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div onClick={() => setRemember(!remember)} style={{
              width: '18px', height: '18px', borderRadius: '5px', cursor: 'pointer', flexShrink: 0,
              border: `2px solid ${remember ? 'var(--accent-primary)' : 'var(--border-color)'}`,
              background: remember ? 'var(--accent-primary)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}>
              {remember && <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2.5" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></motion.svg>}
            </div>
            <label onClick={() => setRemember(!remember)} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
              Remember me for 30 days
            </label>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ color: 'var(--error)', fontSize: '0.85rem', background: 'rgba(239,68,68,0.08)', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '0.875rem',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              border: 'none', borderRadius: '10px',
              color: 'white', fontWeight: 700, fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.8 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
              transition: 'all 0.2s ease',
              marginTop: '0.5rem',
            }}
            onMouseEnter={(e) => { if (!loading) (e.target as HTMLButtonElement).style.boxShadow = '0 6px 25px rgba(99,102,241,0.5)'; }}
            onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(99,102,241,0.35)'; }}
          >
            {loading ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  style={{ width: 18, height: 18, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }} />
                Signing in…
              </>
            ) : (
              <>Sign In <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        {/* Demo hint */}
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '10px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            <Sparkles size={13} /> Demo Mode
          </p>
          <button onClick={fillDemo} style={{ fontSize: '0.82rem', color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
            Click to fill demo credentials
          </button>
        </div>
      </motion.div>
    </div>
  );
}
