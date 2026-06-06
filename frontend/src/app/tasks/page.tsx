"use client";

import { useState } from 'react';
import useSWR from 'swr';
import { api, fetcher } from '@/lib/api';
import TaskCard from '@/components/TaskCard';
import toast from 'react-hot-toast';
import { ClipboardList, Plus, Star, Search } from 'lucide-react';

type FilterType = 'ALL' | 'PENDING' | 'SUBMITTED' | 'APPROVED';

const FILTER_LABELS: Record<FilterType, string> = {
  ALL: 'All Quests',
  PENDING: 'Active',
  SUBMITTED: 'Reviewing',
  APPROVED: 'Completed',
};

export default function TasksPage() {
  const { data: user } = useSWR<any>('/auth/me', fetcher);
  const { data: tasks, error, isLoading, mutate } = useSWR<any[]>('/task', fetcher);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState(10);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [search, setSearch] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('Creating quest… 📝');
    try {
      await api.post('/task', { title, description, points });
      setTitle('');
      setDescription('');
      setPoints(10);
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
            size={18}
            strokeWidth={2.5}
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

      {/* ── Parent Create Form ── */}
      {user?.role === 'PARENT' && (
        <div
          className="rounded-[28px] p-7 mb-8 relative overflow-hidden border-4"
          style={{
            background: 'var(--base-white)',
            borderColor: 'var(--sky-light)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {/* Decorative blob */}
          <div
            className="absolute top-0 right-0 w-40 h-40 rounded-full mix-blend-multiply filter blur-2xl opacity-60 translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ background: 'var(--sky-light)' }}
          />

          <h3 className="text-xl font-black flex items-center gap-2 mb-5 relative z-10"
            style={{ color: 'var(--dark-brown)' }}>
            <Plus size={22} strokeWidth={3} style={{ color: 'var(--sky-blue)' }} />
            New Quest
          </h3>

          <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-3 relative z-10">
            <input
              type="text"
              placeholder="Quest title (e.g. Wash Dishes)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="flex-1 px-5 py-3.5 rounded-[20px] font-bold"
              style={{ background: 'var(--bg-cream)', border: '3px solid var(--base-white)', color: 'var(--dark-brown)' }}
            />
            <input
              type="text"
              placeholder="Details (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 px-5 py-3.5 rounded-[20px] font-bold"
              style={{ background: 'var(--bg-cream)', border: '3px solid var(--base-white)', color: 'var(--dark-brown)' }}
            />
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-[20px] border-4 border-white shrink-0"
              style={{ background: 'var(--yellow-light)' }}
            >
              <Star size={22} strokeWidth={3} style={{ color: '#D4AF37' }} />
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-14 bg-transparent outline-none font-black text-lg text-center"
                style={{ color: '#D4AF37' }}
                min="1"
              />
            </div>
            <button
              type="submit"
              className="shrink-0 px-7 py-3.5 rounded-[20px] font-black border-4 border-white transition-all hover:-translate-y-0.5"
              style={{
                background: 'var(--sky-blue)',
                color: 'var(--dark-brown)',
                boxShadow: '0 4px 12px rgba(181,234,234,0.4)',
              }}
            >
              Add Quest
            </button>
          </form>
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
        <div
          className="p-6 rounded-[24px] text-center font-bold border-2 border-white"
          style={{ background: '#FFE5E5', color: '#D14D4D' }}
        >
          Failed to load tasks. Please try again.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTasks?.map((task) => (
            <TaskCard key={task.id} task={task} onUpdate={mutate} role={user?.role} />
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
                  ? "No quests yet. Parents can add some!"
                  : `No quests in "${FILTER_LABELS[filter]}" right now.`}
              </p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
