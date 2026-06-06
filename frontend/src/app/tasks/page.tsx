"use client";

import { useState } from 'react';
import useSWR from 'swr';
import { api, fetcher } from '@/lib/api';
import TaskCard from '@/components/TaskCard';
import toast from 'react-hot-toast';
import { ClipboardList, Plus, Star, Search, Calendar, UserCircle } from 'lucide-react';
import { Task, Family, FamilyMember } from '@/types';

type FilterType = 'ALL' | 'PENDING' | 'SUBMITTED' | 'APPROVED';

const FILTER_LABELS: Record<FilterType, string> = {
  ALL: 'All Quests',
  PENDING: 'Active',
  SUBMITTED: 'Reviewing',
  APPROVED: 'Completed',
};

export default function TasksPage() {
  const { data: user } = useSWR<any>('/auth/me', fetcher);
  const { data: tasks, error, isLoading, mutate } = useSWR<Task[]>('/task', fetcher);
  const { data: family } = useSWR<Family>('/family/me', fetcher);

  const [title, setTitle]           = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints]         = useState(10);
  const [dueDate, setDueDate]       = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [recurrencePattern, setRecurrencePattern] = useState('NONE');
  const [filter, setFilter]         = useState<FilterType>('ALL');
  const [search, setSearch]         = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Family members list (all members for assignment)
  const members: FamilyMember[] = family?.member || family?.members || [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('Creating quest… 📝');
    try {
      await api.post('/task', {
        title,
        description: description || undefined,
        points,
        dueDate: dueDate || undefined,
        assigneeId: assigneeId ? Number(assigneeId) : undefined,
        recurrencePattern: recurrencePattern === 'NONE' ? undefined : recurrencePattern,
      });
      setTitle('');
      setDescription('');
      setPoints(10);
      setDueDate('');
      setAssigneeId('');
      setRecurrencePattern('NONE');
      setShowCreateModal(false);
      toast.success('Quest created! 🎯', { id: loadingToast });
      mutate();
    } catch {
      toast.error('Failed to create task.', { id: loadingToast });
    }
  };

  const filteredTasks = tasks?.filter((t) => {
    const matchesSearch = t.title?.toLowerCase().includes(search.toLowerCase());
    if (filter === 'ALL') return matchesSearch;
    return matchesSearch && t.status === filter;
  });

  return (
    <main className="page-wrapper">

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-[20px] flex items-center justify-center border-4 border-white shadow-sm -rotate-6 shrink-0"
            style={{ background: 'var(--sky-light)' }}
          >
            <ClipboardList size={28} strokeWidth={2.5} style={{ color: 'var(--sky-blue)' }} />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight" style={{ color: 'var(--dark-brown)' }}>
              Task Board
            </h1>
            <p className="font-bold" style={{ color: 'var(--warm-brown)' }}>
              {user?.role === 'PARENT'
                ? 'Assign chores and reward your kids! ✨'
                : 'Complete your quests to earn stars! 🌟'}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10"
            size={18} strokeWidth={2.5}
            style={{ color: 'var(--warm-brown)' }}
          />
          <input
            type="text"
            placeholder="Search quests…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-full font-bold"
            style={{
              background: 'var(--bg-cream)',
              border: '3px solid var(--base-white)',
              color: 'var(--dark-brown)',
            }}
          />
        </div>
      </div>

      {/* ── Parent Action Row ── */}
      {user?.role === 'PARENT' && (
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            style={{
              background: 'var(--sky-blue)',
              color: 'var(--dark-brown)',
              boxShadow: '0 4px 12px rgba(181,234,234,0.4)',
            }}
          >
            <Plus size={20} strokeWidth={3} />
            Add New Quest
          </button>
        </div>
      )}

      {/* ── Filter Pills ── */}
      <div
        className="flex p-1.5 rounded-[20px] border-2 border-white gap-1 mb-7 overflow-x-auto"
        style={{ background: 'var(--bg-cream)', boxShadow: 'var(--shadow-sm)' }}
      >
        {(Object.keys(FILTER_LABELS) as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-5 py-2.5 rounded-[14px] font-black text-sm whitespace-nowrap transition-all duration-300"
            style={
              filter === f
                ? { background: 'var(--base-white)', color: 'var(--sky-blue)', boxShadow: 'var(--shadow-sm)' }
                : { background: 'transparent', color: 'var(--warm-brown)' }
            }
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      {/* ── Task Grid ── */}
      {isLoading ? (
        <div className="loader-wrap">
          <div className="spinner" />
          <p className="font-bold" style={{ color: 'var(--warm-brown)' }}>Loading quests…</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-[24px] text-center font-bold border-2 border-white"
          style={{ background: '#FFE5E5', color: '#D14D4D' }}>
          Failed to load tasks. Please try again.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTasks?.map((task) => (
            <TaskCard key={task.id} task={task} onUpdate={mutate} role={user?.role} members={members} />
          ))}

          {(!filteredTasks || filteredTasks.length === 0) && (
            <div
              className="col-span-full flex flex-col items-center justify-center py-20 rounded-[40px] border-4 border-dashed text-center"
              style={{ background: 'var(--base-white)', borderColor: 'var(--bg-cream)' }}
            >
              <div className="text-6xl mb-5" style={{ animation: 'float 4s ease-in-out infinite' }}>🍃</div>
              <h3 className="text-2xl font-black mb-2" style={{ color: 'var(--dark-brown)' }}>So Empty Here!</h3>
              <p className="font-bold" style={{ color: 'var(--warm-brown)' }}>
                {filter === 'ALL'
                  ? 'No quests yet. Parents can add some!'
                  : `No quests in "${FILTER_LABELS[filter]}" right now.`}
              </p>
            </div>
          )}
        </div>
      )}
      {/* ── Create Modal ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-lg rounded-[28px] p-7 border-4 border-white shadow-2xl relative overflow-hidden" style={{ background: 'var(--base-white)' }}>
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full mix-blend-multiply filter blur-2xl opacity-60 translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ background: 'var(--sky-light)' }} />

            <div className="flex items-center justify-between mb-6 relative z-10">
              <h3 className="text-xl font-black flex items-center gap-2" style={{ color: 'var(--dark-brown)' }}>
                <Plus size={24} strokeWidth={3} style={{ color: 'var(--sky-blue)' }} /> New Quest
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 rounded-full hover:bg-[var(--bg-cream)] transition-colors">
                <span className="font-black text-gray-400">✕</span>
              </button>
            </div>

            <form onSubmit={handleCreate} className="relative z-10 flex flex-col gap-4 max-h-[80vh] overflow-y-auto custom-scrollbar pr-2">
              <input
                type="text"
                placeholder="Quest title (e.g. Wash Dishes)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-5 py-3.5 rounded-[16px] font-bold"
                style={{ background: 'var(--bg-cream)', border: '3px solid var(--base-white)', color: 'var(--dark-brown)' }}
              />
              <textarea
                placeholder="Details (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-5 py-3.5 rounded-[16px] font-bold min-h-[100px] resize-none"
                style={{ background: 'var(--bg-cream)', border: '3px solid var(--base-white)', color: 'var(--dark-brown)' }}
              />

              <div className="flex gap-3">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-[16px] border-4 border-white flex-1"
                  style={{ background: 'var(--yellow-light)' }}>
                  <Star size={18} strokeWidth={3} style={{ color: '#D4AF37' }} />
                  <input
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    className="w-full bg-transparent outline-none font-black text-lg"
                    style={{ color: '#D4AF37' }}
                    min="1"
                  />
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-[16px] border-4 border-white flex-1"
                  style={{ background: 'var(--sky-light)' }}>
                  <Calendar size={16} strokeWidth={2.5} style={{ color: 'var(--sky-blue)' }} />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-transparent outline-none font-bold text-sm"
                    style={{ color: 'var(--dark-brown)' }}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-[16px] border-4 border-white flex-1"
                  style={{ background: 'var(--pink-light)' }}>
                  <UserCircle size={16} strokeWidth={2.5} style={{ color: '#FF6B9E' }} />
                  <select
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                    className="w-full bg-transparent outline-none font-bold text-sm"
                    style={{ color: 'var(--dark-brown)' }}
                  >
                    <option value="">Anyone</option>
                    {members.map((m: FamilyMember) => (
                      <option key={m.id} value={m.id}>
                        {m.role === 'PARENT' ? '🐻' : '🐰'} {m.fullName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-[16px] border-4 border-white flex-1"
                  style={{ background: '#E0F2FE' }}>
                  <span className="text-sm">🔁</span>
                  <select
                    value={recurrencePattern}
                    onChange={(e) => setRecurrencePattern(e.target.value)}
                    className="w-full bg-transparent outline-none font-bold text-sm"
                    style={{ color: 'var(--dark-brown)' }}
                  >
                    <option value="NONE">One-time</option>
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 px-7 py-3.5 rounded-[16px] font-black border-4 border-white transition-all hover:-translate-y-0.5"
                style={{
                  background: 'var(--sky-blue)',
                  color: 'var(--dark-brown)',
                  boxShadow: '0 4px 12px rgba(181,234,234,0.4)',
                }}
              >
                Add Quest ✨
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
