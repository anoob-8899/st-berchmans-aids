'use client';

import React, { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'linways'>('login');
  
  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Signup form state
  const [signupFullName, setSignupFullName] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupRegisterNo, setSignupRegisterNo] = useState('');
  const [signupBatch, setSignupBatch] = useState('2026-2030');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePortalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      onLoginSuccess(data.user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: signupFullName,
          username: signupUsername,
          password: signupPassword,
          email: signupEmail,
          phone: signupPhone,
          registerNumber: signupRegisterNo,
          batch: signupBatch,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccessMsg(data.message || 'Registration submitted for admin approval!');
      setTimeout(() => {
        setMode('login');
        setUsername(signupUsername);
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop open" style={{ display: 'flex', zIndex: 1000 }}>
      <div className="modal-dialog" style={{ maxWidth: '520px', width: '92%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <div className="modal-title" style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700 }}>
            St. Berchmans AI & DS Portal
          </div>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '20px', gap: '4px' }}>
            <button
              onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
              style={{
                padding: '8px 12px',
                fontWeight: 600,
                fontSize: '0.86rem',
                color: mode === 'login' ? '#1C1917' : '#756860',
                borderBottom: mode === 'login' ? '2.5px solid #FDB27C' : 'none',
                background: 'none',
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
              style={{
                padding: '8px 12px',
                fontWeight: 600,
                fontSize: '0.86rem',
                color: mode === 'signup' ? '#1C1917' : '#756860',
                borderBottom: mode === 'signup' ? '2.5px solid #FDB27C' : 'none',
                background: 'none',
                cursor: 'pointer'
              }}
            >
              Student Self-Register
            </button>
            <button
              onClick={() => { setMode('linways'); setErrorMsg(''); setSuccessMsg(''); }}
              style={{
                padding: '8px 12px',
                fontWeight: 600,
                fontSize: '0.86rem',
                color: mode === 'linways' ? '#1C1917' : '#756860',
                borderBottom: mode === 'linways' ? '2.5px solid #FDB27C' : 'none',
                background: 'none',
                cursor: 'pointer'
              }}
            >
              Linways AMS
            </button>
          </div>

          {errorMsg && (
            <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: '8px', fontSize: '0.86rem', marginBottom: '16px' }}>
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div style={{ padding: '12px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', borderRadius: '8px', fontSize: '0.86rem', marginBottom: '16px' }}>
              {successMsg}
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handlePortalLogin}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px', color: '#1C1917' }}>Username *</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #EFEAE3', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px', color: '#1C1917' }}>Password *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #EFEAE3', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#1C1917',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Authenticating...' : 'Sign In to Portal'}
              </button>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleStudentSignup}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px', color: '#1C1917' }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={signupFullName}
                    onChange={(e) => setSignupFullName(e.target.value)}
                    placeholder="e.g. Alan Mathew"
                    style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #EFEAE3', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px', color: '#1C1917' }}>Username *</label>
                  <input
                    type="text"
                    required
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    placeholder="e.g. alan_m"
                    style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #EFEAE3', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px', color: '#1C1917' }}>Password *</label>
                <input
                  type="password"
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #EFEAE3', borderRadius: '6px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px', color: '#1C1917' }}>Institutional Email</label>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="student@sbcollege.ac.in"
                    style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #EFEAE3', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px', color: '#1C1917' }}>Register Number</label>
                  <input
                    type="text"
                    value={signupRegisterNo}
                    onChange={(e) => setSignupRegisterNo(e.target.value)}
                    placeholder="e.g. 26001042"
                    style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #EFEAE3', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px', color: '#1C1917' }}>Batch</label>
                  <select
                    value={signupBatch}
                    onChange={(e) => setSignupBatch(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #EFEAE3', borderRadius: '6px', fontSize: '0.85rem' }}
                  >
                    <option value="2026-2030">2026-2030 (FYUGP)</option>
                    <option value="2025-2029">2025-2029</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px', color: '#1C1917' }}>Phone Number</label>
                  <input
                    type="tel"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #EFEAE3', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#FDB27C',
                  color: '#1C1917',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Submitting Registration...' : 'Submit Student Registration'}
              </button>
            </form>
          )}

          {mode === 'linways' && (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <p style={{ fontSize: '0.88rem', color: '#756860', marginBottom: '16px' }}>
                Access attendance records, internal continuous evaluation (ICE) marks, and examination hall tickets via the Linways AMS Portal.
              </p>
              <a
                href="https://sbcollegev4.linways.com/ams/student/login"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '100%',
                  display: 'inline-block',
                  padding: '12px',
                  background: '#1C1917',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                Launch Linways Student V4 Portal &rarr;
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
