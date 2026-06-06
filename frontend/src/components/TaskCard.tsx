"use client";

import { useState } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { Star, CheckCircle2, Clock, Check, Calendar, UserCircle, Trash2, Pencil, X } from 'lucide-react';
import { Task, FamilyMember } from '@/types';

const STATUS_CONFIG = {
  APPROVED:  { bg: 'bg-[var(--mint-green)]',  text: 'text-[#2B7A2B]',           label: '✅ Approved',  cardBg: 'bg-white',                  border: 'border-[var(--mint-green)]'  },
  SUBMITTED: { bg: 'bg-[var(--sky-light)]',   text: 'text-[var(--sky-blue)]',   label: '👀 Reviewing', cardBg: 'bg-white',                  border: 'border-[var(--sky-light)]'   },
  PENDING:   { bg: 'bg-[var(--soft-yellow)]', text: 'text-[var(--dark-brown)]', label: '⏳ Active',    cardBg: 'bg-[var(--yellow-light)]',  border: 'border-[var(--base-white)]'  },
  REJECTED:  { bg: 'bg-[#FFE5E5]',            text: 'text-[#D14D4D]',           label: '❌ Try Again', cardBg: 'bg-[#FFF5F5]',              border: 'border-[#FFA8A8]'            },
};

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return dateStr; }
}

function isDueSoon(dateStr?: string): boolean {
  if (!dateStr) return false;
  try {
    const due = new Date(dateStr);
    const now = new Date();
    const diffDays = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 2;
  } catch { return false; }
}

function isOverdue(dateStr?: string): boolean {
  if (!dateStr) return false;
  try {
    return new Date(dateStr) < new Date();
  } catch { return false; }
}

export default function TaskCard({
  task,
  onUpdate,
  role,
  members = [],
}: {
  task: Task;
  onUpdate: () => void;
  role?: string;
  members?: FamilyMember[];
}) {
  const status = task.status as keyof typeof STATUS_CONFIG;
  const cfg    = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
  const due    = formatDate(task.dueDate);
  const dueSoon = isDueSoon(task.dueDate) && status !== 'APPROVED';
  const overdue = isOverdue(task.dueDate) && status !== 'APPROVED';

  const [showEdit, setShowEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc]   = useState(task.description || '');
  const [editPts, setEditPts]     = useState(task.points);
  const [editDate, setEditDate]   = useState(task.dueDate?.split('T')[0] || '');
  const [editAssignee, setEditAssignee] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    const t = toast.loading('Submitting... 🚀');
    try   { await api.patch(`/task/${task.id}/submit`);  toast.success('Submitted! 🎉', { id: t }); onUpdate(); }
    catch { toast.error('Failed to submit.', { id: t }); }
  };

  const handleApprove = async () => {
    const t = toast.loading('Approving... ⭐');
    try   { await api.patch(`/task/${task.id}/approve`); toast.success('Approved! Stars awarded. 🌟', { id: t }); onUpdate(); }
    catch { toast.error('Failed to approve.', { id: t }); }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${task.title}"? This cannot be undone.`)) return;
    const t = toast.loading('Deleting...');
    try   { await api.del(`/task/${task.id}`); toast.success('Task deleted.', { id: t }); onUpdate(); }
    catch { toast.error('Failed to delete.', { id: t }); }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const t = toast.loading('Saving changes...');
    try {
      await api.put(`/task/${task.id}`, {
        title: editTitle,
        description: editDesc || undefined,
        points: editPts,
        dueDate: editDate || undefined,
        assignee_Id: editAssignee ? Number(editAssignee) : undefined,
      });
      toast.success('Task updated! ✨', { id: t });
      setShowEdit(false);
      onUpdate();
    } catch {
      toast.error('Failed to update task.', { id: t });
    } finally {
      setSaving(false);
    }
  };

  const handleReject = async () => {
    const reason = prompt("Why are you rejecting this task? (Required)");
    if (!reason) return;
    const t = toast.loading('Rejecting...');
    try { 
      await api.patch(`/task/${task.id}/reject`, { comment: reason }); 
      toast.success('Task rejected.', { id: t }); 
      onUpdate(); 
    }
    catch { toast.error('Failed to reject.', { id: t }); }
  };

  return (
    <>
      <div className={`${cfg.cardBg} border-2 ${cfg.border} rounded-[24px] p-5 flex flex-col gap-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 relative`}>

        {/* ── Top row: status + points + parent actions ── */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black ${cfg.bg} ${cfg.text} border-2 border-white shadow-sm`}>
              {cfg.label}
            </span>
            {task.recurrencePattern && task.recurrencePattern !== 'NONE' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-black bg-[var(--sky-light)] text-[var(--sky-blue)] border-2 border-white shadow-sm" title={`Repeats: ${task.recurrencePattern}`}>
                🔁
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black bg-[var(--soft-yellow)] text-[#D4AF37] border-2 border-white shadow-sm">
              <Star size={12} strokeWidth={3} /> {task.points ?? 0} pts
            </span>
            {/* PARENT actions — edit & delete */}
            {role === 'PARENT' && status !== 'APPROVED' && status !== 'SUBMITTED' && (
              <>
                <button
                  onClick={() => setShowEdit(true)}
                  className="p-1.5 rounded-[10px] border-2 border-white transition-all hover:scale-110"
                  style={{ background: 'var(--sky-light)', color: 'var(--sky-blue)' }}
                  title="Edit task"
                >
                  <Pencil size={12} strokeWidth={3} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1.5 rounded-[10px] border-2 border-white transition-all hover:scale-110"
                  style={{ background: '#FFE5E5', color: '#D14D4D' }}
                  title="Delete task"
                >
                  <Trash2 size={12} strokeWidth={3} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-black text-[var(--dark-brown)] leading-snug mb-1 break-words">{task.title}</h4>
          {task.description && (
            <p className="text-sm font-medium text-[var(--warm-brown)] line-clamp-3 break-words">{task.description}</p>
          )}
          {status === 'REJECTED' && task.parentComment && (
            <div className="mt-3 p-3 rounded-[12px] bg-[#FFE5E5] border border-[#FFA8A8]">
              <p className="text-xs font-black text-[#D14D4D] mb-1">💬 Parent's Note:</p>
              <p className="text-sm font-medium text-[var(--dark-brown)]">{task.parentComment}</p>
            </div>
          )}
        </div>

        {/* ── Meta badges: due date + assignee ── */}
        {(due || task.assigneeName) && (
          <div className="flex flex-wrap gap-2">
            {due && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[10px] text-[11px] font-black border border-white ${
                overdue
                  ? 'bg-[#FFE5E5] text-[#D14D4D]'
                  : dueSoon
                  ? 'bg-[#FFF3CD] text-[#D97706]'
                  : 'bg-[var(--bg-cream)] text-[var(--warm-brown)]'
              }`}>
                <Calendar size={11} strokeWidth={2.5} />
                {overdue ? '⚠️ Overdue!' : dueSoon ? '🔥 Due Soon!' : ''} {due}
              </span>
            )}
            {task.assigneeName && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[10px] text-[11px] font-black bg-[var(--pink-light)] text-[var(--warm-brown)] border border-white">
                <UserCircle size={11} strokeWidth={2.5} /> {task.assigneeName}
              </span>
            )}
          </div>
        )}

        {/* ── Action button ── */}
        <div className="border-t-2 border-[var(--bg-cream)] pt-3">
          {(status === 'PENDING' || status === 'REJECTED') && role === 'CHILD' && (
            <button onClick={handleSubmit}
              className="w-full flex justify-center items-center gap-2 bg-[var(--sky-blue)] hover:bg-[#9CE0E0] text-[var(--dark-brown)] py-3 rounded-[16px] font-black text-sm transition-all shadow-sm border-2 border-white">
              <CheckCircle2 size={16} strokeWidth={3} /> {status === 'REJECTED' ? 'Resubmit Task' : 'I Did It!'}
            </button>
          )}
          {(status === 'PENDING' || status === 'REJECTED') && role === 'PARENT' && (
            <div className="w-full text-center py-3 rounded-[16px] bg-[var(--bg-cream)] text-[var(--warm-brown)] font-bold text-sm border-2 border-dashed border-[var(--pink-light)]">
              <Clock size={14} strokeWidth={2.5} className="inline mr-1.5 -mt-0.5" /> Waiting for child…
            </div>
          )}
          {status === 'SUBMITTED' && role === 'PARENT' && (
            <div className="flex flex-col sm:flex-row gap-2">
              <button onClick={handleApprove}
                className="flex-[2] flex justify-center items-center gap-2 bg-[var(--baby-pink)] hover:bg-[#FFC2D8] text-[var(--dark-brown)] py-3 rounded-[16px] font-black text-sm transition-all shadow-sm border-2 border-white">
                <Check size={16} strokeWidth={3} /> Approve
              </button>
              <button onClick={handleReject}
                className="flex-1 flex justify-center items-center gap-1 bg-[#FFE5E5] hover:bg-[#FFD1D1] text-[#D14D4D] py-3 rounded-[16px] font-black text-sm transition-all shadow-sm border-2 border-white">
                <X size={16} strokeWidth={3} /> Reject
              </button>
            </div>
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

      {/* ── Edit Modal ── */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-md rounded-[28px] p-7 border-4 border-white shadow-2xl" style={{ background: 'var(--base-white)' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black flex items-center gap-2" style={{ color: 'var(--dark-brown)' }}>
                <Pencil size={20} strokeWidth={3} style={{ color: 'var(--sky-blue)' }} /> Edit Quest
              </h3>
              <button onClick={() => setShowEdit(false)} className="p-2 rounded-full hover:bg-[var(--bg-cream)] transition-colors">
                <X size={18} strokeWidth={2.5} style={{ color: 'var(--warm-brown)' }} />
              </button>
            </div>

            <form onSubmit={handleEdit} className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto custom-scrollbar pr-2">
              <input
                type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} required
                placeholder="Quest title"
                className="w-full px-5 py-3.5 rounded-[16px] font-bold"
                style={{ background: 'var(--bg-cream)', border: '3px solid var(--base-white)', color: 'var(--dark-brown)' }}
              />
              <input
                type="text" value={editDesc} onChange={e => setEditDesc(e.target.value)}
                placeholder="Description (optional)"
                className="w-full px-5 py-3.5 rounded-[16px] font-bold"
                style={{ background: 'var(--bg-cream)', border: '3px solid var(--base-white)', color: 'var(--dark-brown)' }}
              />
              <div className="flex gap-3">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-[16px] border-4 border-white flex-1"
                  style={{ background: 'var(--yellow-light)' }}>
                  <Star size={18} strokeWidth={3} style={{ color: '#D4AF37' }} />
                  <input
                    type="number" value={editPts} onChange={e => setEditPts(Number(e.target.value))} min="1"
                    className="w-16 bg-transparent outline-none font-black text-lg"
                    style={{ color: '#D4AF37' }}
                  />
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-[16px] border-4 border-white flex-1"
                  style={{ background: 'var(--sky-light)' }}>
                  <Calendar size={16} strokeWidth={2.5} style={{ color: 'var(--sky-blue)' }} />
                  <input
                    type="date" value={editDate} onChange={e => setEditDate(e.target.value)}
                    className="bg-transparent outline-none font-bold text-sm flex-1"
                    style={{ color: 'var(--dark-brown)' }}
                  />
                </div>
              </div>
              {members.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-[16px] border-4 border-white"
                  style={{ background: 'var(--pink-light)' }}>
                  <UserCircle size={16} strokeWidth={2.5} style={{ color: '#FF6B9E' }} />
                  <select value={editAssignee} onChange={e => setEditAssignee(e.target.value)}
                    className="bg-transparent outline-none font-bold text-sm flex-1"
                    style={{ color: 'var(--dark-brown)' }}>
                    <option value="">Keep current assignee</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.role === 'PARENT' ? '🐻' : '🐰'} {m.fullName}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setShowEdit(false)}
                  className="flex-1 py-3 rounded-[16px] font-black border-2 transition-all"
                  style={{ background: 'var(--bg-cream)', color: 'var(--warm-brown)', borderColor: 'var(--base-white)' }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 rounded-[16px] font-black border-4 border-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
                  style={{ background: 'var(--sky-blue)', color: 'var(--dark-brown)' }}>
                  {saving ? 'Saving...' : 'Save Changes ✨'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
