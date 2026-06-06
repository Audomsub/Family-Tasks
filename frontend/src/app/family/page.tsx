"use client";

import { useState } from 'react';
import useSWR from 'swr';
import { api, fetcher } from '@/lib/api';
import toast from 'react-hot-toast';
import { Copy, Users, Home, UserCheck, Star, KeyRound, UserPlus } from 'lucide-react';

export default function FamilyPage() {
  const { data: currentUser } = useSWR<any>('/auth/me', fetcher);
  const { data: family, isLoading, mutate } = useSWR<any>('/family/me', fetcher);
  const [joinCode, setJoinCode] = useState('');

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('Joining family... 🎈');
    try {
      await api.post('/auth/join', { inviteCode: joinCode });
      toast.success('Joined family successfully! 🏠', { id: loadingToast });
      mutate();
    } catch {
      toast.error('Failed to join. Check code.', { id: loadingToast });
    }
  };

  const copyCode = () => {
    if (family?.code || family?.inviteCode) {
      navigator.clipboard.writeText(family.code || family.inviteCode);
      toast.success('Invite code copied! 📋');
    }
  };

  if (isLoading) return (
    <main className="page-wrapper">
      <div className="loader-wrap min-h-[50vh]">
        <div className="spinner" />
        <p className="font-bold" style={{ color: 'var(--warm-brown)' }}>Loading your family...</p>
      </div>
    </main>
  );

  return (
    <main className="page-wrapper">
      {family ? (
        <div className="flex flex-col gap-8">
          
          {/* ── Family Header Card ── */}
          <div 
            className="rounded-[32px] p-8 md:p-10 border-4 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
            style={{ 
              background: 'var(--base-white)', 
              borderColor: 'var(--sky-light)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {/* Background Blob */}
            <div 
              className="absolute top-0 right-0 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"
              style={{ background: 'var(--sky-light)' }}
            />
            
            <div className="flex items-center gap-5 relative z-10">
              <div 
                className="w-20 h-20 rounded-full flex justify-center items-center text-4xl shadow-sm border-4 border-white shrink-0"
                style={{ background: 'var(--sky-light)' }}
              >
                🏠
              </div>
              <div>
                <h2 className="text-3xl font-black tracking-tight mb-2" style={{ color: 'var(--dark-brown)' }}>
                  {family.name || family.familyName || 'Your Family'}
                </h2>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: 'var(--pink-light)', color: 'var(--warm-brown)' }}>
                  <Users size={14} strokeWidth={2.5} /> {family.members?.length || 1} Members
                </div>
              </div>
            </div>

            {/* Invite Code */}
            <div 
              className="p-5 rounded-[24px] border-2 shadow-sm flex flex-col items-center gap-2 relative z-10 shrink-0 min-w-[200px]"
              style={{ background: 'var(--bg-cream)', borderColor: 'var(--base-white)' }}
            >
              <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1" style={{ color: 'var(--warm-brown)' }}>
                <KeyRound size={12} strokeWidth={2.5}/> Invite Code
              </span>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black tracking-widest select-all" style={{ color: 'var(--sky-blue)' }}>
                  {family.code || family.inviteCode || 'N/A'}
                </span>
                <button 
                  onClick={copyCode}
                  className="p-2.5 rounded-[14px] shadow-sm transition-all hover:-translate-y-0.5 border-2 border-white"
                  style={{ background: 'var(--base-white)', color: 'var(--warm-brown)' }}
                  title="Copy Code"
                >
                  <Copy size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>

          {/* ── Members List ── */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-[16px] shadow-sm" style={{ background: 'var(--pink-light)' }}>
                <Users size={20} strokeWidth={2.5} style={{ color: 'var(--baby-pink)' }} />
              </div>
              <h3 className="text-2xl font-black" style={{ color: 'var(--dark-brown)' }}>Family Roster 👨‍👩‍👧‍👦</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {(!family.members || family.members.length === 0) && (
                 <div 
                   className="rounded-[24px] p-5 border-2 flex items-center gap-4"
                   style={{ background: 'var(--base-white)', borderColor: 'var(--bg-cream)' }}
                 >
                 <div 
                   className="w-14 h-14 rounded-full flex justify-center items-center text-2xl shadow-sm border-2 border-white shrink-0"
                   style={{ background: 'var(--soft-yellow)' }}
                 >
                   🐻
                 </div>
                 <div>
                   <h4 className="text-lg font-black" style={{ color: 'var(--dark-brown)' }}>{currentUser?.fullName || 'You'}</h4>
                   <p className="text-xs font-bold px-2 py-0.5 rounded-full inline-block mt-1"
                     style={{ background: 'var(--bg-cream)', color: 'var(--warm-brown)' }}>Me</p>
                 </div>
               </div>
              )}
              {family.members?.map((m: any, i: number) => (
                <div 
                  key={i} 
                  className="rounded-[24px] p-5 border-2 flex items-center gap-4 hover:-translate-y-1 transition-transform"
                  style={{ background: 'var(--base-white)', borderColor: 'var(--bg-cream)' }}
                >
                  <div 
                    className="w-14 h-14 rounded-[16px] flex justify-center items-center text-2xl shadow-sm border-2 border-white shrink-0"
                    style={{ background: m.role === 'PARENT' ? 'var(--sky-light)' : 'var(--yellow-light)' }}
                  >
                    {m.role === 'PARENT' ? '🐻' : '🐰'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-black truncate" style={{ color: 'var(--dark-brown)' }}>{m.name || m.fullName || m.username}</h4>
                    <div className="flex items-center gap-2 mt-1.5">
                      {m.role === 'PARENT' ? (
                        <span 
                          className="font-black text-[10px] px-2 py-1 rounded-[8px] flex items-center gap-1 uppercase tracking-wider"
                          style={{ background: 'var(--sky-light)', color: 'var(--sky-blue)' }}
                        >
                          <UserCheck size={10} strokeWidth={3}/> Parent
                        </span>
                      ) : (
                        <span 
                          className="font-black text-[10px] px-2 py-1 rounded-[8px] flex items-center gap-1 uppercase tracking-wider"
                          style={{ background: 'var(--yellow-light)', color: '#D4AF37' }}
                        >
                          <Star size={10} strokeWidth={3}/> Child
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* ── Child View: Not in a family yet ── */
        <div className="flex justify-center items-center min-h-[60vh]">
          <div 
            className="rounded-[32px] p-10 md:p-14 border-4 max-w-lg w-full text-center relative overflow-hidden"
            style={{ 
              background: 'var(--base-white)', 
              borderColor: 'var(--soft-yellow)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div className="text-6xl mb-6" style={{ animation: 'float 3s ease-in-out infinite' }}>💌</div>
            <h3 className="text-3xl font-black mb-3" style={{ color: 'var(--dark-brown)' }}>Join Your Family</h3>
            <p className="font-bold mb-8" style={{ color: 'var(--warm-brown)' }}>
              Ask your parents for the magic <span style={{ color: 'var(--sky-blue)' }}>Invite Code</span> to enter your home!
            </p>
            
            <form onSubmit={handleJoin} className="flex flex-col items-center gap-4">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5" strokeWidth={2.5} style={{ color: 'var(--soft-yellow)' }} />
                </div>
                <input 
                  type="text" 
                  placeholder="CODE HERE" 
                  value={joinCode} 
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())} 
                  className="w-full pl-14 pr-5 py-4 rounded-[20px] text-center text-xl font-black tracking-[0.2em] outline-none transition-all"
                  style={{ 
                    background: 'var(--yellow-light)', 
                    border: '3px solid var(--bg-cream)',
                    color: 'var(--dark-brown)'
                  }}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full flex justify-center items-center gap-2 py-4 rounded-[20px] font-black text-lg transition-all border-4 border-white hover:-translate-y-0.5"
                style={{ 
                  background: 'var(--sky-blue)', 
                  color: 'var(--dark-brown)',
                  boxShadow: '0 4px 12px rgba(181,234,234,0.4)'
                }}
              >
                <UserPlus size={20} strokeWidth={3} />
                Join Home! 🚀
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
