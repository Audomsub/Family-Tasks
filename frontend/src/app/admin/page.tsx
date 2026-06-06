"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Users, Home, ClipboardList, Gift, Sparkles, Trophy, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await api.get("/admin/dashboard/stats");
      setStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!stats) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="w-12 h-12 border-4 border-[var(--pink-light)] border-t-[var(--baby-pink)] rounded-full animate-spin" />
      <p className="text-[var(--warm-brown)] font-bold animate-pulse">Loading cute stats...</p>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Welcome Banner */}
      <div className="bg-white rounded-[24px] p-8 border-2 border-[var(--sky-light)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--soft-yellow)] rounded-full text-[var(--dark-brown)] text-xs font-black tracking-widest uppercase mb-4 border-2 border-white shadow-sm">
            <Sparkles size={14} /> Admin Dashboard
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[var(--dark-brown)] tracking-tight mb-2 leading-tight">
            Hello, Super Admin! 🎀
          </h1>
          <p className="text-[var(--warm-brown)] font-bold leading-relaxed">
            Welcome to your command center. Let's see how our families are doing today and spread some joy!
          </p>
        </div>
        <div className="bg-[var(--sky-light)] w-36 h-36 rounded-[24px] flex items-center justify-center border-2 border-white shadow-md flex-shrink-0">
          <Trophy size={64} className="text-[var(--sky-blue)]" strokeWidth={1.5} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">

        {/* Card 1: Users */}
        <div className="bg-[var(--sky-light)] rounded-[24px] p-6 shadow-sm border-2 border-white overflow-visible hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(181,234,234,0.4)] transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-black text-[var(--warm-brown)] text-xs uppercase tracking-wider">Total Users</h3>
            <div className="bg-white text-[var(--sky-blue)] p-2.5 rounded-[16px] shadow-sm">
              <Users size={20} strokeWidth={2.5} />
            </div>
          </div>
          <p className="text-4xl font-black text-[var(--dark-brown)] tracking-tighter mb-4">{stats.totalUsers}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-bold">
              <span className="text-[var(--warm-brown)]">👨‍👩‍👧 Parents</span>
              <span className="bg-white text-[var(--dark-brown)] px-2.5 py-0.5 rounded-[10px] font-black">{stats.parents}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-bold">
              <span className="text-[var(--warm-brown)]">🧒 Children</span>
              <span className="bg-white text-[var(--dark-brown)] px-2.5 py-0.5 rounded-[10px] font-black">{stats.children}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Families */}
        <div className="bg-[var(--pink-light)] rounded-[24px] p-6 shadow-sm border-2 border-white overflow-visible hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(255,212,229,0.4)] transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-black text-[var(--warm-brown)] text-xs uppercase tracking-wider">Families</h3>
            <div className="bg-white text-[var(--baby-pink)] p-2.5 rounded-[16px] shadow-sm">
              <Home size={20} strokeWidth={2.5} />
            </div>
          </div>
          <p className="text-4xl font-black text-[var(--dark-brown)] tracking-tighter mb-4">{stats.totalFamilies}</p>
          <div className="pt-3 border-t-2 border-white/60">
            <p className="text-sm text-[var(--warm-brown)] font-bold">Growing happily every day! 🏡</p>
          </div>
        </div>

        {/* Card 3: Tasks */}
        <div className="bg-[var(--yellow-light)] rounded-[24px] p-6 shadow-sm border-2 border-white overflow-visible hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(255,241,166,0.4)] transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-black text-[var(--warm-brown)] text-xs uppercase tracking-wider">Tasks</h3>
            <div className="bg-white text-[var(--warm-brown)] p-2.5 rounded-[16px] shadow-sm">
              <ClipboardList size={20} strokeWidth={2.5} />
            </div>
          </div>
          <p className="text-4xl font-black text-[var(--dark-brown)] tracking-tighter mb-4">{stats.totalTasks}</p>
          <div className="pt-3 border-t-2 border-white/60">
            <p className="text-sm text-[var(--warm-brown)] font-bold">Chores waiting to be done! ✨</p>
          </div>
        </div>

        {/* Card 4: Rewards */}
        <div className="bg-[var(--mint-green)]/30 rounded-[24px] p-6 shadow-sm border-2 border-white overflow-visible hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(193,240,193,0.4)] transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-black text-[var(--warm-brown)] text-xs uppercase tracking-wider">Rewards</h3>
            <div className="bg-white text-[#2B7A2B] p-2.5 rounded-[16px] shadow-sm">
              <Gift size={20} strokeWidth={2.5} />
            </div>
          </div>
          <p className="text-4xl font-black text-[var(--dark-brown)] tracking-tighter mb-4">{stats.totalRewards}</p>
          <div className="pt-3 border-t-2 border-white/60">
            <p className="text-sm text-[var(--warm-brown)] font-bold">Prizes for the good kids! 🎁</p>
          </div>
        </div>

      </div>

      {/* Quick summary row */}
      <div className="bg-white rounded-[24px] p-6 border-2 border-[var(--pink-light)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-[var(--pink-light)] p-2 rounded-[12px]">
            <TrendingUp size={18} className="text-[var(--baby-pink)]" strokeWidth={2.5} />
          </div>
          <h2 className="font-black text-[var(--dark-brown)] text-lg">System Overview</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: stats.totalUsers, color: "bg-[var(--sky-light)] text-[var(--sky-blue)]" },
            { label: "Total Families", value: stats.totalFamilies, color: "bg-[var(--pink-light)] text-[var(--baby-pink)]" },
            { label: "Total Tasks", value: stats.totalTasks, color: "bg-[var(--yellow-light)] text-[var(--warm-brown)]" },
            { label: "Total Rewards", value: stats.totalRewards, color: "bg-[var(--mint-green)]/40 text-[#2B7A2B]" },
          ].map((item) => (
            <div key={item.label} className={`${item.color} rounded-[16px] p-4 text-center`}>
              <div className="text-2xl font-black">{item.value}</div>
              <div className="text-xs font-bold mt-1 opacity-80">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
