"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Search, Home, Trash2, Users, Calendar, Hash } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminFamiliesPage() {
  const [families, setFamilies] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFamilies();
  }, []);

  const fetchFamilies = async () => {
    setLoading(true);
    try {
      const [familiesData, usersData] = await Promise.all([
        api.get("/admin/families"),
        api.get("/admin/users"),
      ]);
      const familiesWithCounts = familiesData.map((f: any) => {
        const count = usersData.filter((u: any) => u.family?.id === f.id).length;
        return { ...f, memberCount: count };
      });
      setFamilies(familiesWithCounts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteFamily = async (familyId: number) => {
    if (!confirm("Are you sure you want to completely delete this family? 🥺 This action cannot be undone.")) return;
    try {
      await api.del(`/admin/families/${familyId}`);
      toast.success("Family deleted successfully 🏡");
      fetchFamilies();
    } catch {
      toast.error("Failed to delete family");
    }
  };

  const filteredFamilies = families.filter((f) =>
    f.familyName?.toLowerCase().includes(search.toLowerCase()) ||
    f.inviteCode?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="bg-white rounded-[24px] p-6 border-2 border-[var(--sky-light)] flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="bg-[var(--mint-green)] text-[#2B7A2B] p-3 rounded-[18px] shadow-sm flex-shrink-0">
            <Home size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[var(--dark-brown)] tracking-tight">Family Groups</h1>
            <p className="text-[var(--warm-brown)] font-bold text-sm mt-0.5">Manage and view all family homes. 🏡</p>
          </div>
        </div>
        {/* Search */}
        <div className="relative w-full md:w-72 flex-shrink-0">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[#2B7A2B]" strokeWidth={2.5} />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 border-2 border-[var(--mint-green)] rounded-[16px] bg-[var(--bg-cream)] text-[var(--dark-brown)] placeholder-[var(--warm-brown)] focus:outline-none focus:bg-white focus:border-[#2B7A2B] transition-all duration-200 font-bold text-sm"
            placeholder="Search families..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Count pill */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 bg-white px-4 py-1.5 rounded-full border-2 border-[var(--mint-green)]/50 text-sm font-black text-[var(--dark-brown)] shadow-sm">
          <Home size={14} strokeWidth={2.5} className="text-[#2B7A2B]" />
          {filteredFamilies.length} famil{filteredFamilies.length !== 1 ? "ies" : "y"}
        </span>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-48 gap-4">
          <div className="w-10 h-10 border-4 border-[var(--mint-green)] border-t-[#2B7A2B] rounded-full animate-spin" />
          <p className="text-[var(--warm-brown)] font-bold text-sm">Loading families...</p>
        </div>
      )}

      {/* Card Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {filteredFamilies.map((family) => (
            <div
              key={family.id}
              className="bg-white rounded-[24px] p-6 shadow-sm border-2 border-[var(--pink-light)] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(255,212,229,0.35)] transition-all duration-300 flex flex-col"
            >
              {/* Family Header */}
              <div className="flex items-start gap-4 mb-5">
                <div className="w-14 h-14 rounded-[18px] bg-[var(--sky-light)] flex items-center justify-center text-[var(--sky-blue)] border-2 border-white shadow-sm flex-shrink-0">
                  <Home size={28} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-lg text-[var(--dark-brown)] leading-tight truncate">{family.familyName}</h3>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Hash size={11} className="text-[var(--warm-brown)]" />
                    <span className="font-mono bg-[var(--bg-cream)] px-2.5 py-0.5 rounded-[8px] text-xs text-[var(--warm-brown)] font-bold border border-white/80 tracking-widest">
                      {family.inviteCode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-[var(--bg-cream)] rounded-[16px] p-4 border-2 border-white mb-4 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-[var(--warm-brown)] flex items-center gap-1.5">
                    <Users size={14} strokeWidth={2.5} /> Members
                  </span>
                  <span className="text-sm font-black text-[var(--dark-brown)] bg-white px-2.5 py-0.5 rounded-[8px] shadow-sm">{family.memberCount || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-[var(--warm-brown)] flex items-center gap-1.5">
                    <Calendar size={14} strokeWidth={2.5} /> Created
                  </span>
                  <span className="text-sm font-black text-[var(--dark-brown)]">
                    {family.createdAt
                      ? new Date(family.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
                      : "—"}
                  </span>
                </div>
              </div>

              {/* Delete Button */}
              <div className="mt-auto flex justify-end">
                <button
                  onClick={() => deleteFamily(family.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#FFE5E5] text-[#D14D4D] hover:bg-[#FFB3B3] rounded-[14px] font-bold text-sm transition-all duration-200 shadow-sm border-2 border-white"
                >
                  <Trash2 size={14} strokeWidth={2.5} />
                  Delete Family
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredFamilies.length === 0 && (
        <div className="bg-white rounded-[24px] p-12 text-center border-2 border-[var(--pink-light)] shadow-sm">
          <div className="bg-[var(--pink-light)] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
            <Home size={36} strokeWidth={2.5} className="text-[var(--baby-pink)]" />
          </div>
          <h3 className="text-xl font-black text-[var(--dark-brown)] mb-2">No Families Found</h3>
          <p className="text-[var(--warm-brown)] font-bold text-sm">
            {search ? `No results for "${search}". Try a different search! 🥺` : "No families registered yet."}
          </p>
        </div>
      )}

    </div>
  );
}
