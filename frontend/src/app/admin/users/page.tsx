"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Search, ShieldAlert, Ban, Unlock, UserCog, Mail, Users } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.get("/admin/users");
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBan = async (userId: number, currentStatus: boolean) => {
    try {
      await api.patch(`/admin/users/${userId}/ban?banned=${!currentStatus}`, {});
      toast.success(currentStatus ? "User unbanned! 🌟" : "User suspended 🛑");
      fetchUsers();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const resetPassword = async (userId: number) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/reset-password`);
      toast.success(
        <div className="flex flex-col">
          <span>Password reset successful! 🔑</span>
          <span className="font-mono bg-[var(--soft-yellow)] p-1.5 rounded-xl mt-2 text-[var(--dark-brown)] font-bold select-all text-center border-2 border-white">{res}</span>
        </div>,
        { duration: 6000 }
      );
    } catch {
      toast.error("Failed to reset password");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    if (role === "SUPER_ADMIN") return "bg-[var(--soft-yellow)] text-[var(--dark-brown)]";
    if (role === "PARENT") return "bg-[var(--sky-light)] text-[var(--dark-brown)]";
    return "bg-[var(--pink-light)] text-[var(--dark-brown)]";
  };

  const getAvatarBg = (role: string) => {
    if (role === "SUPER_ADMIN") return "bg-[var(--mint-green)]";
    if (role === "PARENT") return "bg-[var(--sky-light)]";
    return "bg-[var(--pink-light)]";
  };

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="bg-white rounded-[24px] p-6 border-2 border-[var(--sky-light)] flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="bg-[var(--sky-light)] text-[var(--sky-blue)] p-3 rounded-[18px] shadow-sm flex-shrink-0">
            <Users size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[var(--dark-brown)] tracking-tight">User Management</h1>
            <p className="text-[var(--warm-brown)] font-bold text-sm mt-0.5">Manage family members and their roles.</p>
          </div>
        </div>
        {/* Search */}
        <div className="relative w-full md:w-72 flex-shrink-0">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[var(--sky-blue)]" strokeWidth={2.5} />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 border-2 border-[var(--sky-light)] rounded-[16px] bg-[var(--bg-cream)] text-[var(--dark-brown)] placeholder-[var(--warm-brown)] focus:outline-none focus:bg-white focus:border-[var(--sky-blue)] transition-all duration-200 font-bold text-sm"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* User count pill */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 bg-white px-4 py-1.5 rounded-full border-2 border-[var(--sky-light)] text-sm font-black text-[var(--dark-brown)] shadow-sm">
          <Users size={14} strokeWidth={2.5} className="text-[var(--sky-blue)]" />
          {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""} found
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[24px] overflow-hidden border-2 border-[var(--pink-light)] shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-[var(--pink-light)]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-[var(--dark-brown)] uppercase tracking-wider">User Profile</th>
                <th className="px-6 py-4 text-left text-xs font-black text-[var(--dark-brown)] uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-black text-[var(--dark-brown)] uppercase tracking-wider">Family</th>
                <th className="px-6 py-4 text-left text-xs font-black text-[var(--dark-brown)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-black text-[var(--dark-brown)] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y-2 divide-[var(--bg-cream)]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-[var(--pink-light)] border-t-[var(--baby-pink)] rounded-full animate-spin" />
                      <span className="text-[var(--warm-brown)] font-bold text-sm">Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[var(--sky-light)]/40 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center font-black text-lg border-2 border-white shadow-sm flex-shrink-0 ${getAvatarBg(user.role)}`}>
                        <span className="text-[var(--dark-brown)]">
                          {user.fullName?.[0]?.toUpperCase() || "U"}
                        </span>
                      </div>
                      <div>
                        <div className="font-black text-[var(--dark-brown)] text-sm">{user.fullName}</div>
                        <div className="text-xs font-bold text-[var(--warm-brown)] flex items-center gap-1 mt-0.5">
                          <Mail size={11} strokeWidth={2.5} /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs font-black rounded-full border-2 border-white shadow-sm ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.family ? (
                      <span className="bg-[var(--bg-cream)] px-3 py-1 rounded-[10px] border-2 border-white shadow-sm text-sm font-black text-[var(--warm-brown)]">
                        {user.family.familyName}
                      </span>
                    ) : (
                      <span className="text-[var(--warm-brown)] opacity-40 italic text-sm font-bold">No Family</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.banned ? (
                      <span className="px-3 py-1 inline-flex items-center gap-1.5 text-xs font-black rounded-full bg-[#FFE5E5] text-[#D14D4D] border-2 border-white shadow-sm">
                        <Ban size={12} strokeWidth={2.5} /> Suspended
                      </span>
                    ) : (
                      <span className="px-3 py-1 inline-flex items-center gap-1.5 text-xs font-black rounded-full bg-[var(--mint-green)] text-[#2B7A2B] border-2 border-white shadow-sm">
                        <Unlock size={12} strokeWidth={2.5} /> Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {user.role !== "SUPER_ADMIN" && (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => resetPassword(user.id)}
                          className="p-2 text-[var(--sky-blue)] bg-[var(--sky-light)] hover:bg-[var(--sky-blue)] hover:text-white rounded-[12px] transition-all duration-200 shadow-sm border-2 border-white"
                          title="Reset Password"
                        >
                          <UserCog size={16} strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={() => toggleBan(user.id, user.banned)}
                          className={`p-2 rounded-[12px] transition-all duration-200 shadow-sm border-2 border-white ${
                            user.banned
                              ? "text-[#2B7A2B] bg-[var(--mint-green)] hover:bg-[#A3E5A3]"
                              : "text-[#D14D4D] bg-[#FFE5E5] hover:bg-[#FFB3B3]"
                          }`}
                          title={user.banned ? "Unban User" : "Ban User"}
                        >
                          {user.banned ? <Unlock size={16} strokeWidth={2.5} /> : <Ban size={16} strokeWidth={2.5} />}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="bg-[var(--pink-light)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-white shadow-sm">
                      <ShieldAlert size={28} strokeWidth={2.5} className="text-[var(--baby-pink)]" />
                    </div>
                    <p className="text-[var(--warm-brown)] font-bold">
                      {search ? `No users found matching "${search}" 🥺` : "No users yet."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
