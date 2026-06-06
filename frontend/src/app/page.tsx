"use client";

import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import Link from 'next/link';
import { Star, Bell, ClipboardList, Gift, Flame, Trophy, CheckCircle2, Clock, Users } from 'lucide-react';

export default function Home() {
  const { data: user } = useSWR<any>('/auth/me', fetcher);
  const { data, error, isLoading } = useSWR<any>('/dashboard/summary', fetcher);

  const tasks = data?.tasks || [];
  const leaderboard = data?.leaderboard || [];

  const totalPoints = user?.totalPoints || 0;
  const progressPct = Math.min((totalPoints / 500) * 100, 100);

  return (
    <main className="page-wrapper">

      {/* ── Hero Card ── */}
      <div
        className="rounded-[32px] border-2 border-dashed border-[var(--sky-blue)] relative overflow-hidden mb-8"
        style={{ background: 'var(--sky-light)' }}
      >
        {/* Floating deco */}
        <span className="absolute right-[6%] top-[18%] text-5xl opacity-70 pointer-events-none"
          style={{ animation: 'float 4s ease-in-out infinite' }}>☁️</span>
        <span className="absolute left-[8%] bottom-[12%] text-4xl opacity-50 pointer-events-none"
          style={{ animation: 'float 5s ease-in-out infinite 1s' }}>🌟</span>
        <span className="absolute right-[20%] bottom-[20%] text-3xl opacity-40 pointer-events-none"
          style={{ animation: 'float 4.5s ease-in-out infinite 0.5s' }}>✨</span>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10 px-6 md:px-12 py-10">
          {/* Avatar + greeting */}
          <div className="flex items-center gap-6">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-5xl border-4 border-white shadow-lg shrink-0"
              style={{
                background: 'var(--baby-pink)',
                boxShadow: '0 8px 24px rgba(255,212,229,0.5)',
                animation: 'float 3s ease-in-out infinite',
              }}
            >
              {user?.role === 'PARENT' ? '🐻' : '🐰'}
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-1"
                style={{ color: 'var(--dark-brown)' }}>
                Hello, {user?.fullName?.split(' ')[0] || 'Family'}! 👋
              </h1>
              <p className="text-lg font-bold" style={{ color: 'var(--warm-brown)' }}>
                {user?.role === 'PARENT'
                  ? "Ready to manage today's family quests? ✨"
                  : 'Ready to crush some tasks and earn stars? 🌟'}
              </p>
            </div>
          </div>

          {/* Quick action buttons */}
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <Link
              href="/family"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 font-black px-6 py-3 rounded-full border-2 transition-all"
              style={{
                background: 'var(--base-white)',
                color: 'var(--warm-brown)',
                borderColor: 'transparent',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--baby-pink)';
                (e.currentTarget as HTMLElement).style.background = 'var(--pink-light)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                (e.currentTarget as HTMLElement).style.background = 'var(--base-white)';
              }}
            >
              <Users size={18} strokeWidth={2.5} /> Family
            </Link>
            {user?.role === 'PARENT' && (
              <Link
                href="/tasks"
                className="flex-1 md:flex-none flex items-center justify-center gap-2 font-black px-6 py-3 rounded-full border-4 border-white transition-all hover:-translate-y-0.5"
                style={{
                  background: 'var(--sky-blue)',
                  color: 'var(--dark-brown)',
                  boxShadow: '0 8px 24px rgba(181,234,234,0.4)',
                }}
              >
                <ClipboardList size={18} strokeWidth={3} /> Add Task
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Body: Loading / Error / Content ── */}
      {isLoading ? (
        <div className="loader-wrap">
          <div className="spinner" />
          <p className="font-bold" style={{ color: 'var(--warm-brown)' }}>Loading dashboard…</p>
        </div>
      ) : error ? (
        <div
          className="p-6 rounded-[24px] text-center font-bold border-2 border-white"
          style={{ background: '#FFE5E5', color: '#D14D4D' }}
        >
          Failed to load dashboard data. Please try again.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left Column (span-1) ── */}
          <div className="lg:col-span-1 flex flex-col gap-6">

            {/* Stars Card */}
            <div
              className="rounded-[28px] p-7 border-4 relative overflow-hidden group hover:-translate-y-1 transition-transform"
              style={{
                background: 'var(--base-white)',
                borderColor: 'var(--yellow-light)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <span className="absolute -right-4 -top-4 text-8xl opacity-10 group-hover:scale-110 transition-transform duration-500 pointer-events-none">🌟</span>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-[14px]" style={{ background: 'var(--yellow-light)' }}>
                  <Star size={20} strokeWidth={3} style={{ color: '#D4AF37' }} />
                </div>
                <h3 className="font-black text-xl" style={{ color: 'var(--dark-brown)' }}>My Stars</h3>
              </div>

              <div className="text-5xl font-black my-4 drop-shadow-sm" style={{ color: '#D4AF37' }}>
                {totalPoints}
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--warm-brown)' }}>
                  <span>Progress to 500</span>
                  <span>{Math.min(totalPoints, 500)} / 500</span>
                </div>
                <div className="h-4 rounded-full overflow-hidden border border-white" style={{ background: 'var(--bg-cream)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${progressPct}%`, background: 'var(--soft-yellow)' }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Action Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/tasks"
                className="rounded-[28px] p-6 flex flex-col items-center justify-center gap-3 border-4 border-white transition-all duration-300 group hover:-translate-y-1"
                style={{
                  background: 'var(--sky-light)',
                  color: 'var(--sky-blue)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <ClipboardList size={32} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                <span className="font-black text-sm">Tasks</span>
              </Link>
              <Link
                href="/rewards"
                className="rounded-[28px] p-6 flex flex-col items-center justify-center gap-3 border-4 border-white transition-all duration-300 group hover:-translate-y-1"
                style={{
                  background: 'var(--pink-light)',
                  color: '#FF6B9E',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <Gift size={32} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                <span className="font-black text-sm" style={{ color: 'var(--dark-brown)' }}>Rewards</span>
              </Link>
            </div>

            {/* Notifications Card */}
            <div
              className="rounded-[28px] p-6 border-2"
              style={{
                background: 'var(--base-white)',
                borderColor: 'var(--bg-cream)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-[14px]" style={{ background: 'var(--bg-cream)' }}>
                  <Bell size={20} strokeWidth={3} style={{ color: 'var(--warm-brown)' }} />
                </div>
                <h3 className="font-black text-xl" style={{ color: 'var(--dark-brown)' }}>Updates</h3>
              </div>

              <div className="space-y-3">
                <div
                  className="flex items-start gap-3 p-4 rounded-[20px] border-2 border-white"
                  style={{ background: 'var(--sky-light)' }}
                >
                  <span className="text-xl shrink-0">📢</span>
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--dark-brown)' }}>Welcome to FamilyTask!</p>
                    <p className="text-xs font-bold mt-0.5" style={{ color: 'var(--warm-brown)' }}>Complete tasks to earn stars ⭐</p>
                  </div>
                </div>

                {user?.role === 'PARENT' && (
                  <div
                    className="flex items-start gap-3 p-4 rounded-[20px] border-2 border-white"
                    style={{ background: 'var(--pink-light)' }}
                  >
                    <span className="text-xl shrink-0">🌸</span>
                    <div>
                      <p className="text-sm font-bold" style={{ color: 'var(--dark-brown)' }}>Parent Tip</p>
                      <p className="text-xs font-bold mt-0.5" style={{ color: 'var(--warm-brown)' }}>Create rewards so kids stay motivated!</p>
                    </div>
                  </div>
                )}

                {user?.role === 'CHILD' && (
                  <div
                    className="flex items-start gap-3 p-4 rounded-[20px] border-2 border-white"
                    style={{ background: 'var(--yellow-light)' }}
                  >
                    <span className="text-xl shrink-0">🎯</span>
                    <div>
                      <p className="text-sm font-bold" style={{ color: 'var(--dark-brown)' }}>Keep it up!</p>
                      <p className="text-xs font-bold mt-0.5" style={{ color: 'var(--warm-brown)' }}>Complete tasks to unlock rewards.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* ── Right Column (span-2) ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Active Quests Card */}
            <div
              className="rounded-[28px] p-7 border-2"
              style={{
                background: 'var(--base-white)',
                borderColor: 'var(--sky-light)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-[14px]" style={{ background: 'var(--sky-light)' }}>
                    <Flame size={22} strokeWidth={3} style={{ color: 'var(--sky-blue)' }} />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight" style={{ color: 'var(--dark-brown)' }}>Active Quests</h3>
                </div>
                <Link
                  href="/tasks"
                  className="text-sm font-black px-4 py-2 rounded-full transition-colors"
                  style={{ background: 'var(--bg-cream)', color: 'var(--warm-brown)' }}
                >
                  View All →
                </Link>
              </div>

              {tasks.length > 0 ? (
                <div className="space-y-3">
                  {tasks.slice(0, 5).map((task: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-[20px] border-2 border-white gap-3 group hover:shadow-md transition-shadow"
                      style={{ background: 'var(--bg-cream)' }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="mt-0.5 p-2 rounded-full shrink-0"
                          style={{
                            background: task.status === 'APPROVED' ? 'var(--mint-green)' : 'var(--soft-yellow)',
                            color: task.status === 'APPROVED' ? '#2B7A2B' : 'var(--dark-brown)',
                          }}
                        >
                          {task.status === 'APPROVED'
                            ? <CheckCircle2 size={18} strokeWidth={3} />
                            : <Clock size={18} strokeWidth={3} />}
                        </div>
                        <div>
                          <h4 className="text-base font-black" style={{ color: 'var(--dark-brown)' }}>{task.title || 'Quest'}</h4>
                          <p className="text-xs font-bold mt-0.5" style={{ color: 'var(--warm-brown)' }}>{task.description || 'No description'}</p>
                        </div>
                      </div>
                      <div
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-sm border-2 self-start sm:self-auto shrink-0"
                        style={{
                          background: 'var(--base-white)',
                          borderColor: 'var(--yellow-light)',
                          color: '#D4AF37',
                        }}
                      >
                        <Star size={14} strokeWidth={3} /> {task.points || 0}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="text-center py-12 rounded-[24px] border-2 border-dashed"
                  style={{ background: 'var(--sky-light)', borderColor: 'var(--sky-blue)' }}
                >
                  <div className="text-5xl mb-4" style={{ animation: 'float 3s ease-in-out infinite' }}>🎉</div>
                  <h4 className="text-xl font-black mb-2" style={{ color: 'var(--dark-brown)' }}>All Caught Up!</h4>
                  <p className="font-bold mb-6" style={{ color: 'var(--warm-brown)' }}>No pending tasks right now. Time to relax!</p>
                  {user?.role === 'PARENT' && (
                    <Link
                      href="/tasks"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-black border-2 border-white transition-colors hover:-translate-y-0.5"
                      style={{ background: 'var(--sky-blue)', color: 'var(--dark-brown)' }}
                    >
                      <ClipboardList size={18} strokeWidth={3} /> Create a Task
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Top Stars Leaderboard */}
            <div
              className="rounded-[28px] p-7 border-2"
              style={{
                background: 'var(--base-white)',
                borderColor: 'var(--pink-light)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-[14px]" style={{ background: 'var(--pink-light)' }}>
                  <Trophy size={22} strokeWidth={3} style={{ color: '#FF6B9E' }} />
                </div>
                <h3 className="text-2xl font-black tracking-tight" style={{ color: 'var(--dark-brown)' }}>Top Stars 🏆</h3>
              </div>

              {leaderboard.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {leaderboard.slice(0, 3).map((member: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-[24px] p-5 border-2 border-white flex flex-col items-center text-center relative hover:-translate-y-1 transition-transform"
                      style={{ background: 'var(--bg-cream)' }}
                    >
                      {/* Medal badge */}
                      <div
                        className="absolute -top-4 w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-md border-2 border-white"
                        style={{
                          background: idx === 0
                            ? 'var(--soft-yellow)'
                            : idx === 1
                              ? '#E8E8E8'
                              : 'var(--pink-light)',
                        }}
                      >
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                      </div>

                      {/* Avatar */}
                      <div
                        className="w-16 h-16 rounded-[20px] flex items-center justify-center text-3xl mb-3 mt-3 border-2 border-white"
                        style={{ background: 'var(--sky-light)', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.06)' }}
                      >
                        {member.role === 'PARENT' ? '🐻' : '🐰'}
                      </div>

                      <span className="font-black text-lg truncate w-full" style={{ color: 'var(--dark-brown)' }}>
                        {member.name || member.fullName || member.username}
                      </span>
                      <span
                        className="mt-2 px-3 py-1 rounded-full text-xs font-black border-2"
                        style={{
                          background: 'var(--base-white)',
                          borderColor: 'var(--yellow-light)',
                          color: '#D4AF37',
                        }}
                      >
                        ⭐ {member.points || member.totalPoints || 0} pts
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="text-4xl mb-4 opacity-50">🤷</div>
                  <p className="font-bold" style={{ color: 'var(--warm-brown)' }}>No leaderboard data yet. Start doing tasks!</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </main>
  );
}
