"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { BarChart3, TrendingUp, Users, Activity, Award, Star } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [users, tasks, families] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/tasks"),
        api.get("/admin/families")
      ]);

      // Top Kids
      const topKids = users
        .filter((u: any) => u.role === "CHILD")
        .sort((a: any, b: any) => (b.totalPoints || 0) - (a.totalPoints || 0))
        .slice(0, 3);

      // Points Dist
      let p0 = 0, p101 = 0, p501 = 0, p1000 = 0;
      users.forEach((u: any) => {
        const pts = u.totalPoints || 0;
        if (pts <= 100) p0++;
        else if (pts <= 500) p101++;
        else if (pts <= 1000) p501++;
        else p1000++;
      });
      const totalU = users.length || 1;

      // Tasks trend
      const now = new Date();
      const last7Days = Array.from({length: 7}, (_, i) => {
        const d = new Date();
        d.setDate(now.getDate() - (6 - i));
        return { 
          label: d.toLocaleDateString('en-US', { weekday: 'short' }), 
          dateStr: d.toISOString().split('T')[0],
          count: 0 
        };
      });

      tasks.forEach((t: any) => {
        if (!t.createdAt) return;
        const taskDate = t.createdAt.split('T')[0];
        const dayMatch = last7Days.find(d => d.dateStr === taskDate);
        if (dayMatch) {
          dayMatch.count++;
        }
      });
      
      const maxTask = Math.max(...last7Days.map(d => d.count), 1);
      const trendData = last7Days.map(d => ({
        ...d,
        percentage: (d.count / maxTask) * 100
      }));

      // Family Engagement
      const activeFamiliesCount = families.filter((f: any) => 
        users.some((u: any) => u.family?.id === f.id)
      ).length;
      const engagementPercent = families.length > 0 ? Math.round((activeFamiliesCount / families.length) * 100) : 0;

      setAnalytics({
        topKids,
        dist: [
          { label: "0-100 pts", value: Math.round((p0/totalU)*100), color: "bg-[var(--sky-blue)]" },
          { label: "101-500 pts", value: Math.round((p101/totalU)*100), color: "bg-[var(--baby-pink)]" },
          { label: "501-1k pts", value: Math.round((p501/totalU)*100), color: "bg-[var(--soft-yellow)]" },
          { label: "1k+ pts", value: Math.round((p1000/totalU)*100), color: "bg-[var(--mint-green)]" }
        ],
        trendData,
        engagementPercent
      });

    } catch (error) {
      console.error(error);
    }
  };

  if (!analytics) return (
    <div className="flex flex-col items-center justify-center h-48 gap-4">
      <div className="w-10 h-10 border-4 border-[var(--sky-light)] border-t-[var(--sky-blue)] rounded-full animate-spin" />
      <p className="text-[var(--warm-brown)] font-bold text-sm">Loading cute insights...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      
      {/* ── Page Header ── */}
      <div className="bg-white p-6 rounded-[24px] border-2 border-[var(--sky-light)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="bg-[var(--sky-light)] text-[var(--sky-blue)] p-3 rounded-[18px] shadow-sm shrink-0">
            <BarChart3 size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[var(--dark-brown)] tracking-tight">System Analytics</h1>
            <p className="text-[var(--warm-brown)] font-bold text-sm mt-0.5">Soft and calm insights into family engagement. 📊</p>
          </div>
        </div>
        
        <div className="flex bg-[var(--bg-cream)] rounded-[16px] p-1.5 border-2 border-white shadow-sm shrink-0">
          <button className="px-4 py-2 rounded-[12px] text-sm font-black transition-all bg-white text-[var(--dark-brown)] shadow-sm">
            Live Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ── Points Distribution ── */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border-2 border-[var(--pink-light)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[var(--pink-light)] p-2 rounded-[14px]">
              <TrendingUp size={18} className="text-[#FF6B9E]" strokeWidth={3} />
            </div>
            <h3 className="font-black text-lg text-[var(--dark-brown)]">Points Distribution</h3>
          </div>
          
          <div className="space-y-4">
            {analytics.dist.map((bar: any, i: number) => (
              <div key={i} className="flex items-center gap-4">
                <span className="w-20 text-xs font-black text-[var(--warm-brown)] text-right uppercase tracking-wider">{bar.label}</span>
                <div className="flex-1 h-5 bg-[var(--bg-cream)] rounded-full overflow-hidden border border-white shadow-inner">
                  <div className={`h-full ${bar.color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${bar.value}%` }}></div>
                </div>
                <span className="w-10 text-sm font-black text-[var(--dark-brown)]">{bar.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Task Completion Trends ── */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border-2 border-[var(--sky-light)] flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[var(--sky-light)] p-2 rounded-[14px]">
              <Activity size={18} className="text-[var(--sky-blue)]" strokeWidth={3} />
            </div>
            <h3 className="font-black text-lg text-[var(--dark-brown)]">Recent Activity (7 Days)</h3>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-2 px-2 mt-auto">
            {analytics.trendData.map((d: any, i: number) => (
              <div key={i} className="w-full flex flex-col items-center gap-2 group">
                <div 
                  className="w-full bg-[var(--sky-blue)] rounded-t-[8px] opacity-70 group-hover:opacity-100 transition-all duration-300 relative" 
                  style={{ height: `${d.percentage || 5}%`, minHeight: '10px' }}
                >
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[var(--dark-brown)] text-white text-[10px] font-black px-2 py-1 rounded-[6px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    {d.count} tasks
                  </div>
                </div>
                <span className="text-[10px] font-black text-[var(--warm-brown)] uppercase">
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Most Active Kids ── */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border-2 border-[var(--soft-yellow)]">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-[var(--yellow-light)] p-2 rounded-[14px]">
              <Award size={18} className="text-[#D4AF37]" strokeWidth={3} />
            </div>
            <h3 className="font-black text-lg text-[var(--dark-brown)]">Most Active Kids 🌟</h3>
          </div>
          
          <div className="space-y-3">
            {analytics.topKids.length === 0 && (
              <p className="text-[var(--warm-brown)] text-sm font-bold">No active kids yet.</p>
            )}
            {analytics.topKids.map((user: any, i: number) => (
              <div key={user.id} className="flex items-center gap-4 bg-[var(--bg-cream)] p-3.5 rounded-[16px] border-2 border-white shadow-sm">
                <div className="w-8 h-8 rounded-[10px] bg-[var(--soft-yellow)] text-[var(--dark-brown)] flex items-center justify-center font-black text-sm border-2 border-white shadow-sm shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-[var(--dark-brown)] text-sm truncate">{user.fullName || "Unknown Kid"}</div>
                  <div className="text-[10px] font-black uppercase text-[var(--warm-brown)] tracking-wider truncate mt-0.5">{user.family?.familyName || "No Family"}</div>
                </div>
                <div className="bg-white px-2.5 py-1.5 rounded-[10px] text-[10px] font-black text-[#D4AF37] border-2 border-[var(--yellow-light)] flex items-center gap-1 shadow-sm shrink-0">
                  <Star size={10} strokeWidth={3} /> {user.totalPoints || 0} pts
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Family Engagement ── */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border-2 border-[var(--mint-green)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[var(--mint-green)]/30 p-2 rounded-[14px]">
              <Users size={18} className="text-[#2B7A2B]" strokeWidth={3} />
            </div>
            <h3 className="font-black text-lg text-[var(--dark-brown)]">Family Engagement</h3>
          </div>
          
          <div className="flex flex-col items-center justify-center h-[200px]">
            <div className="relative w-40 h-40 rounded-full border-8 border-[var(--bg-cream)] flex items-center justify-center overflow-hidden">
               <div className="absolute inset-0 rounded-full" 
                    style={{ background: `conic-gradient(var(--mint-green) ${analytics.engagementPercent}%, transparent 0)` }}>
               </div>
               <div className="absolute inset-3 bg-white rounded-full flex flex-col items-center justify-center shadow-inner z-10 border-4 border-white">
                 <div className="text-3xl font-black text-[var(--dark-brown)]">{analytics.engagementPercent}%</div>
                 <div className="text-[10px] font-black text-[var(--warm-brown)] uppercase tracking-wider mt-0.5 text-center leading-tight">Active<br/>Families</div>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
