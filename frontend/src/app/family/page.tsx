"use client";

import { useState } from 'react';
import useSWR from 'swr';
import { api, fetcher } from '@/lib/api';
import toast from 'react-hot-toast';
import { Copy, Users, Home, UserCheck, Star, KeyRound, UserPlus, Plus } from 'lucide-react';
import { Family, FamilyMember } from '@/types';

export default function FamilyPage() {
  const { data: currentUser } = useSWR<any>('/auth/me', fetcher);
  const { data: family, isLoading, mutate, error } = useSWR<Family>('/family/me', fetcher);
  const [joinCode, setJoinCode] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Penalty Modal State
  const [penaltyChild, setPenaltyChild] = useState<FamilyMember | null>(null);
  const [penaltyPoints, setPenaltyPoints] = useState<number>(10);
  const [penaltyReason, setPenaltyReason] = useState<string>('');
  const [isDeducting, setIsDeducting] = useState(false);

  const handlePenaltyPrompt = (child: FamilyMember) => {
    setPenaltyChild(child);
    setPenaltyPoints(10);
    setPenaltyReason('');
  };

  const submitPenalty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!penaltyChild) return;
    setIsDeducting(true);
    const t = toast.loading('Deducting points...');
    try {
      await api.post(`/auth/users/${penaltyChild.id}/penalty`, { points: penaltyPoints, reason: penaltyReason });
      toast.success('Points deducted.', { id: t });
      setPenaltyChild(null);
      mutate();
    } catch {
      toast.error('Failed to deduct points.', { id: t });
    } finally {
      setIsDeducting(false);
    }
  };

  const isParent = currentUser?.role === 'PARENT';

  // Normalise response: backend returns { familyName, inviteCode, member: [...] }
  const familyName_ = family?.familyName || family?.name || '';
  const inviteCode  = family?.inviteCode || family?.code || '';
  const members     = family?.member || family?.members || [];

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    const t = toast.loading('Creating your family home... 🏠');
    try {
      await api.post('/auth/create-family', { familyName });
      toast.success('Family created! 🎉 Share the invite code with your kids.', { id: t });
      setFamilyName('');
      mutate();
    } catch {
      // Fallback to alternative endpoint
      try {
        await api.post('/families', { familyName });
        toast.success('Family created! 🎉', { id: t });
        setFamilyName('');
        mutate();
      } catch {
        toast.error('Failed to create family. Please try again.', { id: t });
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = toast.loading('Joining family... 🎈');
    try {
      await api.post('/auth/join', { inviteCode: joinCode });
      toast.success('Joined family successfully! 🏠', { id: t });
      mutate();
    } catch {
      toast.error('Failed to join. Check the invite code and try again.', { id: t });
    }
  };

  const copyCode = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
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

  // ── Has a family ──────────────────────────────────────
  const hasFamilyData = !error && family && (familyName_ || inviteCode || members.length > 0);

  if (hasFamilyData) {
    return (
      <main className="page-wrapper">
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
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"
              style={{ background: 'var(--sky-light)' }} />

            <div className="flex items-center gap-5 relative z-10">
              <div className="w-20 h-20 rounded-full flex justify-center items-center text-4xl shadow-sm border-4 border-white shrink-0"
                style={{ background: 'var(--sky-light)' }}>
                🏠
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight mb-2" style={{ color: 'var(--dark-brown)' }}>
                  {familyName_ || 'Your Family'}
                </h1>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: 'var(--pink-light)', color: 'var(--warm-brown)' }}>
                  <Users size={14} strokeWidth={2.5} /> {members.length} Member{members.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            {/* Invite Code */}
            <div className="p-5 rounded-[24px] border-2 shadow-sm flex flex-col items-center gap-2 relative z-10 shrink-0 min-w-[200px]"
              style={{ background: 'var(--bg-cream)', borderColor: 'var(--base-white)' }}>
              <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1" style={{ color: 'var(--warm-brown)' }}>
                <KeyRound size={12} strokeWidth={2.5} /> Invite Code
              </span>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black tracking-widest select-all" style={{ color: 'var(--sky-blue)' }}>
                  {inviteCode || 'N/A'}
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
              <p className="text-[10px] font-bold text-center" style={{ color: 'var(--warm-brown)' }}>
                Share this code with your kids!
              </p>
            </div>
          </div>

          {/* ── Members Grid ── */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-[16px] shadow-sm" style={{ background: 'var(--pink-light)' }}>
                <Users size={20} strokeWidth={2.5} style={{ color: 'var(--baby-pink)' }} />
              </div>
              <h2 className="text-2xl font-black" style={{ color: 'var(--dark-brown)' }}>Family Roster 👨‍👩‍👧‍👦</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {members.length === 0 && (
                <div className="rounded-[24px] p-5 border-2 flex items-center gap-4"
                  style={{ background: 'var(--base-white)', borderColor: 'var(--bg-cream)' }}>
                  <div className="w-14 h-14 rounded-[16px] flex justify-center items-center text-2xl shadow-sm border-2 border-white shrink-0"
                    style={{ background: 'var(--soft-yellow)' }}>
                    🐻
                  </div>
                  <div>
                    <h4 className="text-lg font-black" style={{ color: 'var(--dark-brown)' }}>{currentUser?.fullName || 'You'}</h4>
                    <p className="text-xs font-bold px-2 py-0.5 rounded-full inline-block mt-1"
                      style={{ background: 'var(--bg-cream)', color: 'var(--warm-brown)' }}>Me</p>
                  </div>
                </div>
              )}
              {members.map((m: FamilyMember, i: number) => (
                <div key={m.id ?? i}
                  className="rounded-[24px] p-5 border-2 flex items-center gap-4 hover:-translate-y-1 transition-transform"
                  style={{ background: 'var(--base-white)', borderColor: 'var(--bg-cream)' }}>
                  <div className="w-14 h-14 rounded-[16px] flex justify-center items-center text-2xl shadow-sm border-2 border-white shrink-0"
                    style={{ background: m.role === 'PARENT' ? 'var(--sky-light)' : 'var(--yellow-light)' }}>
                    {m.role === 'PARENT' ? '🐻' : '🐰'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-black truncate" style={{ color: 'var(--dark-brown)' }}>{m.fullName}</h4>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {m.role === 'PARENT' ? (
                        <span className="font-black text-[10px] px-2 py-1 rounded-[8px] flex items-center gap-1 uppercase tracking-wider"
                          style={{ background: 'var(--sky-light)', color: 'var(--sky-blue)' }}>
                          <UserCheck size={10} strokeWidth={3} /> Parent
                        </span>
                      ) : (
                        <span className="font-black text-[10px] px-2 py-1 rounded-[8px] flex items-center gap-1 uppercase tracking-wider"
                          style={{ background: 'var(--yellow-light)', color: '#D4AF37' }}>
                          <Star size={10} strokeWidth={3} /> Child
                        </span>
                      )}
                      <span className="font-black text-[10px] px-2 py-1 rounded-[8px] flex items-center gap-1"
                        style={{ background: 'var(--pink-light)', color: '#FF6B9E' }}>
                        ⭐ {m.totalPoints ?? 0} pts
                      </span>
                    </div>
                  </div>
                  {isParent && m.role === 'CHILD' && (
                    <button
                      onClick={() => handlePenaltyPrompt(m)}
                      className="p-2 rounded-[14px] bg-[#FFE5E5] text-[#D14D4D] border-2 border-white hover:scale-110 transition-transform shadow-sm"
                      title="Deduct Points"
                    >
                      <span className="text-sm font-black">-</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Penalty Modal ── */}
        {penaltyChild && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
            <div className="w-full max-w-sm rounded-[28px] p-7 border-4 border-white shadow-2xl" style={{ background: 'var(--base-white)' }}>
              <div className="text-4xl text-center mb-2">📉</div>
              <h3 className="text-xl font-black text-center mb-4 text-[#D14D4D]">Deduct Points</h3>
              <p className="text-sm font-bold text-center mb-6" style={{ color: 'var(--warm-brown)' }}>
                Taking points from <span style={{ color: 'var(--dark-brown)' }}>{penaltyChild.fullName}</span>
              </p>
              
              <form onSubmit={submitPenalty} className="flex flex-col gap-4">
                <input
                  type="number" value={penaltyPoints} onChange={e => setPenaltyPoints(Number(e.target.value))} min="1" max={penaltyChild.totalPoints || 1000} required
                  placeholder="Points to deduct"
                  className="w-full px-5 py-3.5 rounded-[16px] font-black text-center text-lg"
                  style={{ background: 'var(--bg-cream)', border: '3px solid var(--base-white)', color: '#D14D4D' }}
                />
                <input
                  type="text" value={penaltyReason} onChange={e => setPenaltyReason(e.target.value)} required
                  placeholder="Reason (e.g. woke up late)"
                  className="w-full px-5 py-3.5 rounded-[16px] font-bold"
                  style={{ background: 'var(--bg-cream)', border: '3px solid var(--base-white)', color: 'var(--dark-brown)' }}
                />
                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setPenaltyChild(null)}
                    className="flex-1 py-3 rounded-[16px] font-black border-2 transition-all"
                    style={{ background: 'var(--bg-cream)', color: 'var(--warm-brown)', borderColor: 'var(--base-white)' }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={isDeducting}
                    className="flex-1 py-3 rounded-[16px] font-black border-4 border-white transition-all hover:-translate-y-0.5 disabled:opacity-60 bg-[#FFE5E5] text-[#D14D4D]">
                    {isDeducting ? '...' : 'Deduct'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    );
  }

  // ── No family yet ─────────────────────────────────────
  return (
    <main className="page-wrapper">
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-full max-w-lg">

          {isParent ? (
            /* ── PARENT: Create Family ── */
            <div
              className="rounded-[32px] p-10 md:p-14 border-4 text-center relative overflow-hidden"
              style={{
                background: 'var(--base-white)',
                borderColor: 'var(--sky-light)',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <span className="absolute right-6 top-6 text-4xl opacity-30 pointer-events-none" style={{ animation: 'float 4s ease-in-out infinite' }}>🌟</span>
              <div className="text-6xl mb-6" style={{ animation: 'float 3s ease-in-out infinite' }}>🏠</div>
              <h2 className="text-3xl font-black mb-3" style={{ color: 'var(--dark-brown)' }}>Create Your Family Home</h2>
              <p className="font-bold mb-8" style={{ color: 'var(--warm-brown)' }}>
                Give your family a name to get started! You'll receive an <span style={{ color: 'var(--sky-blue)' }}>invite code</span> to share with your kids.
              </p>

              <form onSubmit={handleCreateFamily} className="flex flex-col items-center gap-4">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Home className="h-5 w-5" strokeWidth={2.5} style={{ color: 'var(--sky-blue)' }} />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Happy House, The Smiths..."
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    className="w-full pl-14 pr-5 py-4 rounded-[20px] font-bold outline-none transition-all"
                    style={{
                      background: 'var(--sky-light)',
                      border: '3px solid var(--bg-cream)',
                      color: 'var(--dark-brown)'
                    }}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full flex justify-center items-center gap-2 py-4 rounded-[20px] font-black text-lg transition-all border-4 border-white hover:-translate-y-0.5 disabled:opacity-60"
                  style={{
                    background: 'var(--sky-blue)',
                    color: 'var(--dark-brown)',
                    boxShadow: '0 4px 12px rgba(181,234,234,0.4)'
                  }}
                >
                  <Plus size={20} strokeWidth={3} />
                  Create Family! 🏠
                </button>
              </form>
            </div>

          ) : (
            /* ── CHILD: Join Family ── */
            <div
              className="rounded-[32px] p-10 md:p-14 border-4 text-center relative overflow-hidden"
              style={{
                background: 'var(--base-white)',
                borderColor: 'var(--soft-yellow)',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <span className="absolute right-6 top-6 text-4xl opacity-30 pointer-events-none" style={{ animation: 'float 4s ease-in-out infinite' }}>🌸</span>
              <div className="text-6xl mb-6" style={{ animation: 'float 3s ease-in-out infinite' }}>💌</div>
              <h2 className="text-3xl font-black mb-3" style={{ color: 'var(--dark-brown)' }}>Join Your Family</h2>
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
          )}

        </div>
      </div>
    </main>
  );
}
