"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Reset link "sent"! (Mocked)');
      setIsSent(true);
    }
  };

  return (
    <main style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backgroundColor: 'var(--bg-cream)' }}>
      <div className="card" style={{ maxWidth: '450px', width: '100%', padding: '3rem 2rem', textAlign: 'center', borderRadius: '32px' }}>
        
        {!isSent ? (
          <>
            <div className="floating" style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>☁️✉️</div>
            <h2 style={{ color: 'var(--dark-brown)', marginBottom: '1rem', fontWeight: 800, fontSize: '2rem' }}>
              Forgot Password?
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontWeight: 600 }}>
              Don't worry! Enter your username or email and we'll send a magic link to get you back in.
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <input 
                type="text" 
                placeholder="Username or Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '1.25rem', borderRadius: 'var(--radius-pill)', border: '2px solid transparent', backgroundColor: 'var(--sky-light)', fontWeight: 700, textAlign: 'center', fontSize: '1.1rem' }}
                required
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '1.25rem', fontSize: '1.1rem' }}>
                Send Magic Link ✨
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="floating" style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>📬💖</div>
            <h2 style={{ color: 'var(--dark-brown)', marginBottom: '1rem', fontWeight: 800, fontSize: '2rem' }}>
              Check your inbox!
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontWeight: 600 }}>
              We've sent a recovery link to <strong>{email}</strong>. (Note: This is just a demo screen).
            </p>
          </>
        )}

        <div style={{ marginTop: '2.5rem' }}>
          <Link href="/login" style={{ color: 'var(--warm-brown)', fontWeight: 700 }}>
            ← Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}
