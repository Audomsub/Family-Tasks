"use client";

import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'var(--bg-cream)' }}
    >
      <div
        className="rounded-[32px] p-10 md:p-14 border-4 max-w-md w-full text-center relative overflow-hidden"
        style={{
          background: 'var(--base-white)',
          borderColor: 'var(--sky-light)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {/* Deco */}
        <span className="absolute right-6 top-6 text-4xl opacity-20 pointer-events-none"
          style={{ animation: 'float 4s ease-in-out infinite' }}>🔒</span>

        {/* Icon */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-5xl border-4 border-white shadow-lg mx-auto mb-6"
          style={{ background: 'var(--sky-light)', animation: 'float 3s ease-in-out infinite' }}
        >
          🔑
        </div>

        <h1 className="text-3xl font-black mb-3" style={{ color: 'var(--dark-brown)' }}>
          Forgot Password?
        </h1>

        <div
          className="rounded-[20px] p-5 mb-6 border-2 text-left"
          style={{ background: 'var(--yellow-light)', borderColor: 'var(--soft-yellow)' }}
        >
          <div className="flex items-start gap-3">
            <Lock size={18} strokeWidth={2.5} style={{ color: '#D4AF37', flexShrink: 0, marginTop: 2 }} />
            <div>
              <p className="font-black text-sm mb-1" style={{ color: 'var(--dark-brown)' }}>
                Password reset is not available yet
              </p>
              <p className="font-bold text-sm" style={{ color: 'var(--warm-brown)' }}>
                This feature requires additional backend setup (email service). Please contact your family admin to reset your password manually.
              </p>
            </div>
          </div>
        </div>

        <p className="font-bold text-sm mb-8" style={{ color: 'var(--warm-brown)' }}>
          If you remember your password, you can go back and log in normally.
        </p>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-[20px] font-black border-4 border-white transition-all hover:-translate-y-0.5"
          style={{
            background: 'var(--sky-blue)',
            color: 'var(--dark-brown)',
            boxShadow: '0 4px 12px rgba(181,234,234,0.4)',
          }}
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
          Back to Login
        </Link>
      </div>
    </main>
  );
}
