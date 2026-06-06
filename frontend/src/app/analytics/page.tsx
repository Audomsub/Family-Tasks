"use client";

import { useAuth } from '@/context/AuthContext';
import { fetcher } from '@/lib/api';
import useSWR from 'swr';
import { FamilyAnalytics } from '@/types';
import { BarChart3, Users, Star, Target, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'PARENT')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const { data: analytics, isLoading } = useSWR<FamilyAnalytics>(
    user?.role === 'PARENT' ? '/family/analytics' : null,
    fetcher,
    { refreshInterval: 60000 }
  );

  if (authLoading || isLoading) {
    return (
      <main className="page-wrapper">
        <div className="loader-wrap min-h-[50vh]">
          <div className="spinner" />
          <p className="font-bold" style={{ color: 'var(--warm-brown)' }}>Loading Analytics…</p>
        </div>
      </main>
    );
  }

  if (!analytics) return null;

  const totalTasks = analytics.tasks.total || 1; // avoid division by zero
  const completionRate = Math.round((analytics.tasks.approved / totalTasks) * 100);

  return (
    <main className="page-wrapper max-w-5xl mx-auto space-y-8">
      {/* ── Header ── */}
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-black mb-3 text-shadow flex items-center justify-center gap-3" style={{ color: 'var(--dark-brown)' }}>
          <BarChart3 className="w-10 h-10 md:w-12 md:h-12 text-[#E97B94]" />
          Family Dashboard
        </h1>
        <p className="text-lg md:text-xl font-bold" style={{ color: 'var(--warm-brown)' }}>
          Track your family's progress and productivity!
        </p>
      </header>

      {/* ── Key Metrics ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="glass-card rounded-[32px] p-6 text-center border-4 border-white flex flex-col items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #FFE5E5 0%, #FFF5F5 100%)' }}>
          <Star className="w-12 h-12 text-[#FFB6C1] mb-2 drop-shadow-sm" />
          <h3 className="text-3xl font-black" style={{ color: 'var(--dark-brown)' }}>{analytics.totalPointsEarned}</h3>
          <p className="font-bold" style={{ color: 'var(--warm-brown)' }}>Total Stars Earned</p>
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Star className="w-24 h-24" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-card rounded-[32px] p-6 text-center border-4 border-white flex flex-col items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #E5F3FF 0%, #F0F8FF 100%)' }}>
          <Target className="w-12 h-12 text-[#87CEFA] mb-2 drop-shadow-sm" />
          <h3 className="text-3xl font-black" style={{ color: 'var(--dark-brown)' }}>{completionRate}%</h3>
          <p className="font-bold" style={{ color: 'var(--warm-brown)' }}>Completion Rate</p>
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Target className="w-24 h-24" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-card rounded-[32px] p-6 text-center border-4 border-white flex flex-col items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #E5FFE5 0%, #F0FFF0 100%)' }}>
          <Users className="w-12 h-12 text-[#98FB98] mb-2 drop-shadow-sm" />
          <h3 className="text-3xl font-black" style={{ color: 'var(--dark-brown)' }}>{analytics.childrenCount}</h3>
          <p className="font-bold" style={{ color: 'var(--warm-brown)' }}>Active Children</p>
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Users className="w-24 h-24" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── Task Breakdown ── */}
        <section className="glass-card rounded-[32px] p-6 md:p-8">
          <h2 className="text-2xl font-black flex items-center gap-2 mb-6" style={{ color: 'var(--dark-brown)' }}>
            <Target className="text-[#87CEFA]" />
            Task Breakdown
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <span className="font-bold text-lg text-gray-700">Approved</span>
              </div>
              <span className="font-black text-xl text-green-500">{analytics.tasks.approved}</span>
            </div>
            {/* Custom Progress Bar */}
            <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-400 rounded-full" style={{ width: `${(analytics.tasks.approved / totalTasks) * 100}%` }} />
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-yellow-500" />
                <span className="font-bold text-lg text-gray-700">Pending & Submitted</span>
              </div>
              <span className="font-black text-xl text-yellow-500">{analytics.tasks.pending + analytics.tasks.submitted}</span>
            </div>
            <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${((analytics.tasks.pending + analytics.tasks.submitted) / totalTasks) * 100}%` }} />
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-500" />
                <span className="font-bold text-lg text-gray-700">Rejected</span>
              </div>
              <span className="font-black text-xl text-red-500">{analytics.tasks.rejected}</span>
            </div>
            <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-400 rounded-full" style={{ width: `${(analytics.tasks.rejected / totalTasks) * 100}%` }} />
            </div>
          </div>
        </section>

        {/* ── Member Stats ── */}
        <section className="glass-card rounded-[32px] p-6 md:p-8">
          <h2 className="text-2xl font-black flex items-center gap-2 mb-6" style={{ color: 'var(--dark-brown)' }}>
            <Users className="text-[#FFB6C1]" />
            Children Leaderboard
          </h2>
          
          <div className="space-y-4">
            {analytics.members.sort((a, b) => b.totalPoints - a.totalPoints).map((member, index) => (
              <div key={member.id} className="flex items-center gap-4 bg-white/60 rounded-2xl p-4 border-2 border-white/40 shadow-sm transition-transform hover:scale-[1.02]">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFE5E5] to-[#FFF0F0] border-2 border-white flex items-center justify-center font-black text-xl shadow-inner text-[#E97B94]">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-lg" style={{ color: 'var(--dark-brown)' }}>{member.name}</h3>
                  <div className="flex gap-2 text-xs font-bold mt-1">
                    <span className="bg-white px-2 py-0.5 rounded-md text-[#D4AF37]">Lv.{member.level}</span>
                    <span className="bg-white px-2 py-0.5 rounded-md text-red-400">🔥 {member.streak}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-black text-2xl text-[#FFB6C1]">{member.totalPoints}</span>
                  <span className="text-xs font-bold text-gray-400 uppercase">Stars</span>
                </div>
              </div>
            ))}
            
            {analytics.members.length === 0 && (
              <div className="text-center py-8 text-gray-500 font-bold">
                No children in the family yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
