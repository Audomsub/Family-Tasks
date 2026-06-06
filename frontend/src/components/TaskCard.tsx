"use client";

import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { Star, CheckCircle2, Clock, Check, AlertCircle } from 'lucide-react';

const STATUS_CONFIG = {
  APPROVED:  { bg: 'bg-[var(--mint-green)]',  text: 'text-[#2B7A2B]',         label: '✅ Approved',  cardBg: 'bg-white',                  border: 'border-[var(--mint-green)]'  },
  SUBMITTED: { bg: 'bg-[var(--sky-light)]',   text: 'text-[var(--sky-blue)]', label: '👀 Reviewing', cardBg: 'bg-white',                  border: 'border-[var(--sky-light)]'   },
  PENDING:   { bg: 'bg-[var(--soft-yellow)]', text: 'text-[var(--dark-brown)]', label: '⏳ Active',   cardBg: 'bg-[var(--yellow-light)]', border: 'border-[var(--base-white)]'  },
};

export default function TaskCard({
  task,
  onUpdate,
  role,
}: {
  task: any;
  onUpdate: () => void;
  role?: string;
}) {
  const status = task.status as keyof typeof STATUS_CONFIG;
  const cfg    = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;

  const handleSubmit = async () => {
    const t = toast.loading('Submitting... 🚀');
    try   { await api.patch(`/task/${task.id}/submit`);  toast.success('Submitted! 🎉', { id: t }); onUpdate(); }
    catch { toast.error('Failed to submit.', { id: t }); }
  };

  const handleApprove = async () => {
    const t = toast.loading('Approving... ⭐');
    try   { await api.patch(`/task/${task.id}/approve`); toast.success('Approved! Points awarded. 🌟', { id: t }); onUpdate(); }
    catch { toast.error('Failed to approve.', { id: t }); }
  };

  return (
    <div className={`${cfg.cardBg} border-2 ${cfg.border} rounded-[24px] p-5 flex flex-col gap-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200`}>

      {/* ── Top row: status badge + points ── */}
      <div className="flex items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black ${cfg.bg} ${cfg.text} border-2 border-white shadow-sm`}>
          {cfg.label}
        </span>
        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black bg-[var(--soft-yellow)] text-[#D4AF37] border-2 border-white shadow-sm">
          <Star size={12} strokeWidth={3} /> {task.points ?? 0} pts
        </span>
      </div>

      {/* ── Content ── */}
      <div className="flex-1">
        <h4 className="text-base font-black text-[var(--dark-brown)] leading-snug mb-1">{task.title}</h4>
        <p className="text-sm font-medium text-[var(--warm-brown)] line-clamp-2">{task.description || 'No description provided.'}</p>
      </div>

      {/* ── Action ── */}
      <div className="border-t-2 border-[var(--bg-cream)] pt-3">
        {status === 'PENDING' && role === 'CHILD' && (
          <button onClick={handleSubmit}
            className="w-full flex justify-center items-center gap-2 bg-[var(--sky-blue)] hover:bg-[#9CE0E0] text-[var(--dark-brown)] py-3 rounded-[16px] font-black text-sm transition-all shadow-sm border-2 border-white">
            <CheckCircle2 size={16} strokeWidth={3} /> I Did It!
          </button>
        )}
        {status === 'PENDING' && role === 'PARENT' && (
          <div className="w-full text-center py-3 rounded-[16px] bg-[var(--bg-cream)] text-[var(--warm-brown)] font-bold text-sm border-2 border-dashed border-[var(--pink-light)]">
            Waiting for child…
          </div>
        )}
        {status === 'SUBMITTED' && role === 'PARENT' && (
          <button onClick={handleApprove}
            className="w-full flex justify-center items-center gap-2 bg-[var(--baby-pink)] hover:bg-[#FFC2D8] text-[var(--dark-brown)] py-3 rounded-[16px] font-black text-sm transition-all shadow-sm border-2 border-white">
            <Check size={16} strokeWidth={3} /> Approve Task
          </button>
        )}
        {status === 'SUBMITTED' && role === 'CHILD' && (
          <div className="w-full text-center py-3 rounded-[16px] bg-[var(--sky-light)] text-[var(--sky-blue)] font-black text-sm border-2 border-white shadow-inner">
            Under Review 👀
          </div>
        )}
        {status === 'APPROVED' && (
          <div className="w-full text-center py-3 rounded-[16px] bg-[var(--mint-green)] text-[#2B7A2B] font-black text-sm border-2 border-white shadow-inner">
            ✨ Completed!
          </div>
        )}
      </div>
    </div>
  );
}
