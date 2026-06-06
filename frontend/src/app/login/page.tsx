"use client";

import { useState } from 'react';
import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 flex items-center justify-center relative">
      
      {/* ── Floating Background Shapes ── */}
      <span className="absolute top-[5%] left-[2%] text-6xl opacity-70 pointer-events-none" style={{ animation: 'float 4s ease-in-out infinite' }}>☁️</span>
      <span className="absolute top-[15%] right-[5%] text-5xl opacity-50 pointer-events-none" style={{ animation: 'float 5s ease-in-out infinite 1s' }}>✨</span>
      <span className="absolute bottom-[10%] left-[10%] text-5xl opacity-60 pointer-events-none" style={{ animation: 'float 4.5s ease-in-out infinite 0.5s' }}>🎀</span>
      <span className="absolute bottom-[5%] right-[2%] text-7xl opacity-40 pointer-events-none" style={{ animation: 'float 6s ease-in-out infinite' }}>☁️</span>

      {/* ── Main Card ── */}
      <div 
        className="w-full flex flex-col md:flex-row rounded-[32px] border-4 overflow-hidden z-10 relative my-4"
        style={{ 
          background: 'var(--base-white)', 
          borderColor: 'var(--pink-light)',
          boxShadow: '0 12px 40px rgba(255,212,229,0.4)'
        }}
      >
        
        {/* Left Side: Mascot & Welcome */}
        <div 
          className="hidden md:flex flex-1 p-10 flex-col items-center justify-center text-center border-r-4 border-dashed relative"
          style={{ background: 'var(--sky-light)', borderColor: 'var(--sky-blue)' }}
        >
          {/* Subtle pattern */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle at center, var(--sky-blue) 2px, transparent 2px)', backgroundSize: '20px 20px' }} />
          
          <div className="text-8xl mb-6 relative z-10" style={{ animation: 'float 3s ease-in-out infinite' }}>🐰</div>
          <h2 className="text-4xl font-black mb-4 tracking-tight relative z-10" style={{ color: 'var(--dark-brown)' }}>
            FamilyTask
          </h2>
          <p className="font-bold text-lg relative z-10 max-w-xs" style={{ color: 'var(--warm-brown)' }}>
            {isLogin 
              ? "Hop back in to check your tasks and claim your cute rewards! ✨" 
              : "Join the fun! Organize tasks, earn points, and win rewards together. 🎀"}
          </p>
        </div>

        {/* Right Side: Auth Form */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center" style={{ background: 'var(--base-white)' }}>
          
          {/* Toggle */}
          <div 
            className="flex rounded-full p-1.5 mb-8 border-2"
            style={{ background: 'var(--bg-cream)', borderColor: 'var(--base-white)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}
          >
            <button 
              onClick={() => setIsLogin(true)}
              className="flex-1 py-3 rounded-full font-black text-sm transition-all"
              style={isLogin 
                ? { background: 'var(--base-white)', color: 'var(--sky-blue)', boxShadow: 'var(--shadow-sm)' }
                : { background: 'transparent', color: 'var(--warm-brown)' }
              }
            >
              Log In
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className="flex-1 py-3 rounded-full font-black text-sm transition-all"
              style={!isLogin 
                ? { background: 'var(--base-white)', color: 'var(--baby-pink)', boxShadow: 'var(--shadow-sm)' }
                : { background: 'transparent', color: 'var(--warm-brown)' }
              }
            >
              Register
            </button>
          </div>

          <AuthForm type={isLogin ? 'login' : 'register'} onSwitch={() => setIsLogin(true)} />
          
        </div>
      </div>
    </div>
  );
}
