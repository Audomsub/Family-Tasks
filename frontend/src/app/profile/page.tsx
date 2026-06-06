"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import useSWR from 'swr';
import { fetcher, api } from '@/lib/api';
import { Star, ClipboardList, CheckCircle2, Trophy, LogOut, User, Gift, History } from 'lucide-react';
import { RedemptionRecord } from '@/types';

export default function ProfilePage() {
  const { logout } = useAuth();
  const { data: user, isLoading } = useSWR<any>('/auth/me', fetcher);
  const { data: tasks } = useSWR<any[]>('/task', fetcher);
  const { data: leaderboard } = useSWR<any[]>('/leaderboard', fetcher);

  const [confirmLogout, setConfirmLogout] = useState(false);

  // Load redemption history from localStorage (populated by RewardCard on each redeem)
  const [redemptionHistory, setRedemptionHistory] = useState<RedemptionRecord[]>([]);
  useEffect(() => {
    try {
      const stored = localStorage.getItem('redemption_history');
      if (stored) setRedemptionHistory(JSON.parse(stored));
    } catch { /* silent */ }
  }, []);

  const totalPoints = user?.totalPoints ?? 0;
  const isParent = user?.role === 'PARENT';
  const roleLabel = isParent ? 'Parent' : 'Child';
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const AVATAR_OPTIONS = ['🐻', '🐰', '🦁', '🦊', '🐶', '🐱', '🐼', '🐯', '🐸', '🦄', '🦖', '🐙', '👾', '👽', '🤠', '😎', '🤖'];
  
  const avatar = user?.avatar || (isParent ? '🐻' : '🐰');

  const handleUpdateAvatar = async (emoji: string) => {
    const t = toast.loading('Updating avatar...');
    try {
      await api.patch('/auth/update-avatar', { avatar: emoji });
      toast.success('Avatar updated!', { id: t });
      setShowAvatarPicker(false);
      // Wait a moment then refresh page to reflect changes globally
      setTimeout(() => window.location.reload(), 500);
    } catch {
      toast.error('Failed to update avatar.', { id: t });
    }
  };

  // Compute stats from tasks
  const approvedTasks = tasks?.filter((t: any) => t.status === 'APPROVED') ?? [];
  const pendingTasks = tasks?.filter((t: any) => t.status === 'PENDING' || t.status === 'SUBMITTED') ?? [];

  // Find rank in leaderboard
  const myRank = leaderboard
    ? leaderboard.findIndex((m: any) => m.id === user?.id || m.fullName === user?.fullName) + 1
    : 0;

  const handleLogout = () => {
    if (confirmLogout) {
      logout();
    } else {
      setConfirmLogout(true);
      setTimeout(() => setConfirmLogout(false), 3000);
    }
  };

  if (isLoading) {
    return (
      <main className="page-wrapper">
        <div className="loader-wrap min-h-[50vh]">
          <div className="spinner" />
          <p className="font-bold" style={{ color: 'var(--warm-brown)' }}>Loading profile…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page-wrapper max-w-2xl mx-auto">

      {/* ── Hero / Avatar Card ── */}
      <div
        className="rounded-[32px] p-8 mb-6 relative flex flex-col items-center text-center border-4"
        style={{
          background: 'linear-gradient(160deg, var(--pink-light) 0%, var(--sky-light) 100%)',
          borderColor: 'var(--base-white)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {/* Deco floaties */}
        <span className="absolute right-6 top-6 text-4xl opacity-40 pointer-events-none" style={{ animation: 'float 4s ease-in-out infinite' }}>✨</span>
        <span className="absolute left-6 bottom-6 text-3xl opacity-30 pointer-events-none" style={{ animation: 'float 5s ease-in-out infinite 1s' }}>🌟</span>

        {/* Avatar */}
        <div className="relative z-10 mb-4 group">
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center text-6xl border-4 border-white shadow-lg cursor-pointer transition-transform hover:scale-105"
            style={{
              background: 'var(--base-white)',
              animation: showAvatarPicker ? 'none' : 'float 3s ease-in-out infinite',
            }}
            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            title="Change Avatar"
          >
            {avatar}
          </div>
          {!showAvatarPicker && (
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-sm border-2 border-[var(--bg-cream)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              ✏️
            </div>
          )}

          {showAvatarPicker && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-[20px] shadow-xl border-4 border-[var(--bg-cream)] p-3 grid grid-cols-4 gap-2 z-50">
              {AVATAR_OPTIONS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => handleUpdateAvatar(emoji)}
                  className="text-2xl p-2 hover:bg-[var(--bg-cream)] rounded-xl transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Name + Role */}
        <h1 className="text-3xl font-black tracking-tight mb-1 relative z-10" style={{ color: 'var(--dark-brown)' }}>
          {user?.fullName || 'Family Member'}
        </h1>
        <div className="flex gap-2 items-center mb-1 relative z-10">
          <span
            className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border-2 border-white"
            style={{
              background: isParent ? 'var(--sky-light)' : 'var(--soft-yellow)',
              color: isParent ? 'var(--sky-blue)' : '#D4AF37',
            }}
          >
            Lv.{user?.level || 1} {roleLabel}
          </span>
          {user?.currentStreak > 0 && (
            <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border-2 border-white bg-[#FFE5E5] text-[#D14D4D]">
              🔥 {user.currentStreak} Streak
            </span>
          )}
        </div>
        <p className="text-sm font-bold relative z-10" style={{ color: 'var(--warm-brown)' }}>
          {user?.email}
        </p>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Stars */}
        <div
          className="rounded-[24px] p-5 flex flex-col items-center gap-2 border-2 border-white hover:-translate-y-1 transition-transform"
          style={{ background: 'var(--base-white)', boxShadow: 'var(--shadow-sm)' }}
        >
          <div className="p-2.5 rounded-[14px]" style={{ background: 'var(--yellow-light)' }}>
            <Star size={20} strokeWidth={3} style={{ color: '#D4AF37' }} />
          </div>
          <div className="text-2xl font-black" style={{ color: '#D4AF37' }}>{totalPoints}</div>
          <div className="text-[11px] font-black uppercase tracking-wider text-center" style={{ color: 'var(--warm-brown)' }}>Stars Earned</div>
        </div>

        {/* Tasks Done */}
        <div
          className="rounded-[24px] p-5 flex flex-col items-center gap-2 border-2 border-white hover:-translate-y-1 transition-transform"
          style={{ background: 'var(--base-white)', boxShadow: 'var(--shadow-sm)' }}
        >
          <div className="p-2.5 rounded-[14px]" style={{ background: 'var(--mint-green)' }}>
            <CheckCircle2 size={20} strokeWidth={3} style={{ color: '#2B7A2B' }} />
          </div>
          <div className="text-2xl font-black" style={{ color: '#2B7A2B' }}>{approvedTasks.length}</div>
          <div className="text-[11px] font-black uppercase tracking-wider text-center" style={{ color: 'var(--warm-brown)' }}>Tasks Done</div>
        </div>

        {/* Rank */}
        <div
          className="rounded-[24px] p-5 flex flex-col items-center gap-2 border-2 border-white hover:-translate-y-1 transition-transform"
          style={{ background: 'var(--base-white)', boxShadow: 'var(--shadow-sm)' }}
        >
          <div className="p-2.5 rounded-[14px]" style={{ background: 'var(--pink-light)' }}>
            <Trophy size={20} strokeWidth={3} style={{ color: '#FF6B9E' }} />
          </div>
          <div className="text-2xl font-black" style={{ color: '#FF6B9E' }}>
            {myRank > 0 ? `#${myRank}` : '—'}
          </div>
          <div className="text-[11px] font-black uppercase tracking-wider text-center" style={{ color: 'var(--warm-brown)' }}>Family Rank</div>
        </div>
      </div>

      {/* ── Active Tasks Summary ── */}
      <div
        className="rounded-[28px] p-6 mb-6 border-2"
        style={{ background: 'var(--base-white)', borderColor: 'var(--sky-light)', boxShadow: 'var(--shadow-sm)' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-[14px]" style={{ background: 'var(--sky-light)' }}>
            <ClipboardList size={18} strokeWidth={3} style={{ color: 'var(--sky-blue)' }} />
          </div>
          <h3 className="font-black text-lg" style={{ color: 'var(--dark-brown)' }}>My Activity</h3>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center p-3 rounded-[16px]" style={{ background: 'var(--bg-cream)' }}>
            <span className="font-bold text-sm" style={{ color: 'var(--warm-brown)' }}>⏳ Active / Reviewing</span>
            <span className="font-black text-sm px-3 py-1 rounded-full" style={{ background: 'var(--soft-yellow)', color: '#D4AF37' }}>
              {pendingTasks.length} tasks
            </span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-[16px]" style={{ background: 'var(--bg-cream)' }}>
            <span className="font-bold text-sm" style={{ color: 'var(--warm-brown)' }}>✅ Completed</span>
            <span className="font-black text-sm px-3 py-1 rounded-full" style={{ background: 'var(--mint-green)', color: '#2B7A2B' }}>
              {approvedTasks.length} tasks
            </span>
          </div>
        </div>
      </div>

      {/* ── Redemption History (CHILD only) ── */}
      {!isParent && (
        <div
          className="rounded-[28px] p-6 mb-6 border-2"
          style={{ background: 'var(--base-white)', borderColor: 'var(--pink-light)', boxShadow: 'var(--shadow-sm)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-[14px]" style={{ background: 'var(--pink-light)' }}>
              <History size={18} strokeWidth={3} style={{ color: '#FF6B9E' }} />
            </div>
            <h3 className="font-black text-lg" style={{ color: 'var(--dark-brown)' }}>Redemption History</h3>
          </div>

          {redemptionHistory.length === 0 ? (
            <div className="text-center py-6 rounded-[16px]" style={{ background: 'var(--bg-cream)' }}>
              <div className="text-3xl mb-2">🎁</div>
              <p className="font-bold text-sm" style={{ color: 'var(--warm-brown)' }}>
                No rewards redeemed yet. Go earn some stars!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {redemptionHistory.slice(0, 5).map((r, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-[16px]"
                  style={{ background: 'var(--bg-cream)' }}>
                  <div className="flex items-center gap-2">
                    <Gift size={14} strokeWidth={2.5} style={{ color: '#FF6B9E' }} />
                    <span className="font-bold text-sm" style={{ color: 'var(--dark-brown)' }}>{r.rewardName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs px-2 py-1 rounded-full"
                      style={{ background: 'var(--soft-yellow)', color: '#D4AF37' }}>
                      -{r.pointsSpent} ⭐
                    </span>
                    <span className="text-[10px] font-bold" style={{ color: 'var(--warm-brown)' }}>
                      {new Date(r.redeemedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Account Info ── */}
      <div
        className="rounded-[28px] p-6 mb-6 border-2"
        style={{ background: 'var(--base-white)', borderColor: 'var(--bg-cream)', boxShadow: 'var(--shadow-sm)' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-[14px]" style={{ background: 'var(--bg-cream)' }}>
            <User size={18} strokeWidth={3} style={{ color: 'var(--warm-brown)' }} />
          </div>
          <h3 className="font-black text-lg" style={{ color: 'var(--dark-brown)' }}>Account Info</h3>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center p-3 rounded-[16px]" style={{ background: 'var(--bg-cream)' }}>
            <span className="font-bold text-sm" style={{ color: 'var(--warm-brown)' }}>Full Name</span>
            <span className="font-black text-sm" style={{ color: 'var(--dark-brown)' }}>{user?.fullName || '—'}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-[16px]" style={{ background: 'var(--bg-cream)' }}>
            <span className="font-bold text-sm" style={{ color: 'var(--warm-brown)' }}>Email</span>
            <span className="font-black text-sm" style={{ color: 'var(--dark-brown)' }}>{user?.email || '—'}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-[16px]" style={{ background: 'var(--bg-cream)' }}>
            <span className="font-bold text-sm" style={{ color: 'var(--warm-brown)' }}>Role</span>
            <span className="font-black text-sm" style={{ color: 'var(--dark-brown)' }}>{roleLabel}</span>
          </div>
        </div>
      </div>

      {/* ── Logout Button ── */}
      <button
        onClick={handleLogout}
        className="w-full flex justify-center items-center gap-3 py-4 rounded-[20px] font-black text-base border-4 border-white transition-all hover:-translate-y-0.5"
        style={{
          background: confirmLogout ? '#FF6B6B' : 'var(--pink-light)',
          color: confirmLogout ? 'white' : 'var(--dark-brown)',
          boxShadow: confirmLogout ? '0 4px 20px rgba(255,107,107,0.4)' : 'var(--shadow-sm)',
        }}
      >
        <LogOut size={20} strokeWidth={2.5} />
        {confirmLogout ? 'Click again to confirm logout 🚪' : 'Sign Out'}
      </button>

    </main>
  );
}
