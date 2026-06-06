"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Search, Trash2, ClipboardList, CheckCircle2, Clock, Check, X, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

type FilterType = "ALL" | "PENDING" | "APPROVED";

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await api.get("/admin/tasks");
      setTasks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const rejectTask = async (taskId: number) => {
    if (!confirm("Are you sure you want to reject and delete this task? 🛑")) return;
    try {
      await api.del(`/admin/tasks/${taskId}`);
      toast.success("Task rejected! 🗑️");
      fetchTasks();
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const approveTask = (taskId: number) => {
    toast.success("Task looks great! ✨ (Approval handled by Parents)");
  };

  const filteredTasks = tasks.filter((t) => {
    const s = search.toLowerCase();
    const match = t.title?.toLowerCase().includes(s) || t.family?.familyName?.toLowerCase().includes(s);
    if (filter === "ALL") return match;
    if (filter === "PENDING") return match && t.status !== "APPROVED";
    if (filter === "APPROVED") return match && t.status === "APPROVED";
    return match;
  });

  return (
    <div className="space-y-6">
      
      {/* ── Page Header ── */}
      <div className="bg-white p-6 rounded-[24px] border-2 border-[var(--soft-yellow)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="bg-[var(--soft-yellow)] text-[var(--warm-brown)] p-3 rounded-[18px] shadow-sm shrink-0">
            <ClipboardList size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[var(--dark-brown)] tracking-tight">Task Inbox</h1>
            <p className="text-[var(--warm-brown)] font-bold text-sm mt-0.5">Review and moderate family chores. ✨</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          {/* Filters */}
          <div className="flex bg-[var(--bg-cream)] rounded-[16px] p-1.5 border-2 border-white shadow-sm overflow-x-auto gap-1">
            {(["ALL", "PENDING", "APPROVED"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-4 py-2 rounded-[12px] text-sm font-black whitespace-nowrap transition-all"
                style={
                  filter === f 
                    ? { background: "var(--base-white)", color: "var(--dark-brown)", boxShadow: "var(--shadow-sm)" } 
                    : { background: "transparent", color: "var(--warm-brown)" }
                }
              >
                {f === "ALL" ? "All" : f === "PENDING" ? "Active" : "Approved"}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[var(--warm-brown)]" strokeWidth={2.5} />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2.5 border-2 border-[var(--soft-yellow)] rounded-[16px] bg-white text-[var(--dark-brown)] placeholder-[var(--warm-brown)] focus:outline-none focus:border-[var(--warm-brown)] transition-all font-bold text-sm"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-48 gap-4">
          <div className="w-10 h-10 border-4 border-[var(--soft-yellow)] border-t-[var(--warm-brown)] rounded-full animate-spin" />
          <p className="text-[var(--warm-brown)] font-bold text-sm">Loading tasks...</p>
        </div>
      )}

      {/* ── Task Grid ── */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredTasks.map((task) => {
            const isApproved = task.status === "APPROVED";
            const isSubmitted = task.status === "SUBMITTED";

            return (
              <div 
                key={task.id} 
                className="rounded-[24px] p-5 shadow-sm border-2 hover:-translate-y-1 transition-all flex flex-col gap-4"
                style={{
                  background: isApproved ? "var(--base-white)" : "var(--yellow-light)",
                  borderColor: isApproved ? "var(--sky-light)" : "var(--base-white)",
                }}
              >
                {/* Status & Points row */}
                <div className="flex items-center justify-between gap-2">
                  {isApproved ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border-2 border-white shadow-sm uppercase"
                      style={{ background: 'var(--mint-green)', color: '#2B7A2B' }}>
                      <CheckCircle2 size={12} strokeWidth={3} /> Approved
                    </span>
                  ) : isSubmitted ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border-2 border-white shadow-sm uppercase"
                      style={{ background: 'var(--sky-light)', color: 'var(--sky-blue)' }}>
                      <AlertCircle size={12} strokeWidth={3} /> Submitted
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border-2 border-white shadow-sm uppercase"
                      style={{ background: 'var(--soft-yellow)', color: 'var(--warm-brown)' }}>
                      <Clock size={12} strokeWidth={3} /> Pending
                    </span>
                  )}
                  
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black border-2 border-white shadow-sm bg-[var(--pink-light)] text-[var(--dark-brown)]">
                    ⭐ {task.points} pts
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-black text-lg leading-tight mb-2" style={{ color: 'var(--dark-brown)' }}>{task.title}</h3>
                  <p className="font-bold text-xs line-clamp-3 p-3 rounded-[12px] border border-white/50"
                    style={{ color: 'var(--warm-brown)', background: 'rgba(255,255,255,0.4)' }}>
                    {task.description || "No description provided."}
                  </p>
                </div>

                {/* Family info */}
                <div className="bg-white rounded-[16px] p-2.5 border-2 border-[var(--bg-cream)] text-xs font-bold flex justify-between items-center" style={{ color: 'var(--warm-brown)' }}>
                  <span>Family:</span>
                  <span style={{ color: 'var(--dark-brown)' }}>{task.family?.familyName || "Unknown"}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1 border-t-2 border-[var(--bg-cream)]">
                  {!isApproved && (
                    <button 
                      onClick={() => approveTask(task.id)}
                      className="flex-1 flex justify-center items-center gap-1.5 py-2.5 rounded-[14px] font-black text-xs transition-colors border-2 border-white shadow-sm"
                      style={{ background: 'var(--mint-green)', color: '#2B7A2B' }}
                    >
                      <Check size={14} strokeWidth={3} /> Approve
                    </button>
                  )}
                  <button 
                    onClick={() => rejectTask(task.id)}
                    className={`flex justify-center items-center gap-1.5 py-2.5 rounded-[14px] font-black text-xs transition-all border-2 border-white shadow-sm bg-[#FFE5E5] text-[#D14D4D] hover:bg-[#FFB3B3] ${isApproved ? 'w-full' : 'w-12 shrink-0'}`}
                    title="Reject Task"
                  >
                    {isApproved ? (
                      <><X size={14} strokeWidth={3} /> Remove</>
                    ) : (
                      <X size={14} strokeWidth={3} />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredTasks.length === 0 && (
        <div className="bg-white rounded-[24px] p-12 text-center border-2 border-[var(--soft-yellow)] shadow-sm">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm" style={{ background: 'var(--yellow-light)' }}>
            <ClipboardList size={28} strokeWidth={2.5} style={{ color: 'var(--warm-brown)' }} />
          </div>
          <h3 className="text-xl font-black mb-2" style={{ color: 'var(--dark-brown)' }}>Inbox Empty!</h3>
          <p className="font-bold text-sm" style={{ color: 'var(--warm-brown)' }}>
            {search ? `No tasks found for "${search}".` : "All tasks have been processed. Great job! 🌟"}
          </p>
        </div>
      )}
    </div>
  );
}
