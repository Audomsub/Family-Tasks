"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Search, Trash2, Gift, Star, ShoppingBag, Hash } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminRewardsPage() {
  const [rewards, setRewards] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    setLoading(true);
    try {
      const data = await api.get("/admin/rewards");
      setRewards(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteReward = async (rewardId: number) => {
    if (!confirm("Are you sure you want to delete this reward? 🎁")) return;
    try {
      await api.del(`/admin/rewards/${rewardId}`);
      toast.success("Reward deleted successfully! 🗑️");
      fetchRewards();
    } catch {
      toast.error("Failed to delete reward");
    }
  };

  const filteredRewards = rewards.filter((r) => {
    const s = search.toLowerCase();
    return r.name?.toLowerCase().includes(s) || r.family?.familyName?.toLowerCase().includes(s);
  });

  return (
    <div className="space-y-6">
      
      {/* ── Page Header ── */}
      <div className="bg-white p-6 rounded-[24px] border-2 border-[var(--pink-light)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="bg-[var(--pink-light)] text-[var(--baby-pink)] p-3 rounded-[18px] shadow-sm shrink-0">
            <ShoppingBag size={24} strokeWidth={2.5} className="text-[#FF6B9E]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[var(--dark-brown)] tracking-tight">Reward Moderation</h1>
            <p className="text-[var(--warm-brown)] font-bold text-sm mt-0.5">Manage custom rewards created by parents. 🎁</p>
          </div>
        </div>
        
        <div className="relative w-full md:w-72 shrink-0">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[#FF6B9E]" strokeWidth={2.5} />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-2.5 border-2 border-[var(--pink-light)] rounded-[16px] bg-[var(--bg-cream)] text-[var(--dark-brown)] placeholder-[var(--warm-brown)] focus:outline-none focus:bg-white focus:border-[#FF6B9E] transition-all font-bold text-sm"
            placeholder="Search rewards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-48 gap-4">
          <div className="w-10 h-10 border-4 border-[var(--pink-light)] border-t-[var(--baby-pink)] rounded-full animate-spin" />
          <p className="text-[var(--warm-brown)] font-bold text-sm">Loading shop items...</p>
        </div>
      )}

      {/* ── Grid ── */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
          {filteredRewards.map((reward) => (
            <div 
              key={reward.id} 
              className="bg-white rounded-[24px] p-5 shadow-sm border-2 border-[var(--sky-light)] hover:-translate-y-1 hover:border-[var(--sky-blue)] transition-all flex flex-col gap-4"
            >
              
              {/* Header row: Price Tag */}
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-[var(--soft-yellow)] text-[var(--dark-brown)] border-2 border-white shadow-sm">
                  <Star size={12} strokeWidth={3} /> {reward.pointsRequired} pts
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black bg-[var(--bg-cream)] text-[var(--warm-brown)] border-2 border-white uppercase tracking-wider">
                  <Hash size={10} strokeWidth={3} /> Reward
                </span>
              </div>

              {/* Illustration */}
              <div className="bg-[var(--sky-light)] rounded-[16px] h-24 flex items-center justify-center border-2 border-white shadow-inner">
                 <Gift size={36} className="text-[var(--sky-blue)] drop-shadow-md" strokeWidth={1.5} />
              </div>

              <div className="flex-1 text-center">
                <h3 className="font-black text-lg text-[var(--dark-brown)] leading-tight">{reward.name}</h3>
              </div>

              {/* Footer info & action */}
              <div className="pt-3 border-t-2 border-[var(--bg-cream)] flex flex-col gap-3">
                <div className="text-xs font-bold text-[var(--warm-brown)] flex flex-col bg-[var(--bg-cream)] p-2 rounded-[12px]">
                  <span className="opacity-70 text-[10px] uppercase tracking-wider mb-0.5">Family</span>
                  <span className="text-[var(--dark-brown)] truncate w-full">{reward.family?.familyName || "Unknown"}</span>
                </div>
                <button 
                  onClick={() => deleteReward(reward.id)}
                  className="w-full flex justify-center items-center gap-2 p-2.5 bg-[#FFE5E5] text-[#D14D4D] hover:bg-[#FFB3B3] rounded-[14px] font-black text-xs transition-colors border-2 border-white shadow-sm"
                  title="Remove Item"
                >
                  <Trash2 size={14} strokeWidth={2.5} /> Delete Reward
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredRewards.length === 0 && (
        <div className="bg-white rounded-[24px] p-12 text-center border-2 border-[var(--pink-light)] shadow-sm">
          <div className="bg-[var(--pink-light)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
            <ShoppingBag size={28} strokeWidth={2.5} className="text-[#FF6B9E]" />
          </div>
          <h3 className="text-xl font-black text-[var(--dark-brown)] mb-2">Shop is Empty!</h3>
          <p className="text-[var(--warm-brown)] font-bold text-sm">There are no rewards listed by families right now. 🎀</p>
        </div>
      )}
    </div>
  );
}
