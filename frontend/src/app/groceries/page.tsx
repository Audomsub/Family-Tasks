"use client";
import { useState } from 'react';
import useSWR from 'swr';
import { api, fetcher } from '@/lib/api';
import GroceryItem from '@/components/GroceryItem';
import toast from 'react-hot-toast';
import { GroceryItem as GroceryType } from '@/types';
import { ShoppingCart, Plus, PackageCheck } from 'lucide-react';

export default function GroceriesPage() {
  const { data: groceries, error, isLoading, mutate } = useSWR<GroceryType[]>('/groceries', fetcher);
  const [name, setName] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const loadingToast = toast.loading('Adding to list... 🛒');
    try {
      await api.post('/groceries', { name: name.trim(), isPurchased: false });
      setName('');
      toast.success('Added to list! 🛒', { id: loadingToast });
      mutate();
    } catch {
      toast.error('Failed to add item.', { id: loadingToast });
    }
  };

  const pendingCount = groceries?.filter(g => !g.isPurchased).length ?? 0;
  const doneCount = groceries?.filter(g => g.isPurchased).length ?? 0;

  return (
    <main className="page-wrapper">

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-[20px] flex items-center justify-center border-4 border-white shadow-sm shrink-0"
            style={{ background: 'var(--sky-light)' }}
          >
            <ShoppingCart size={28} strokeWidth={2.5} style={{ color: 'var(--sky-blue)' }} />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight" style={{ color: 'var(--dark-brown)' }}>
              Shopping List
            </h1>
            <p className="font-bold" style={{ color: 'var(--warm-brown)' }}>
              Keep track of what the family needs! 🛍️
            </p>
          </div>
        </div>

        {/* Stats pills */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className="rounded-[20px] px-5 py-2.5 border-2 font-black text-sm flex items-center gap-2"
            style={{ background: 'var(--sky-light)', borderColor: 'var(--sky-blue)', color: 'var(--sky-blue)' }}
          >
            <ShoppingCart size={15} strokeWidth={3} />
            {pendingCount} left
          </div>
          {doneCount > 0 && (
            <div
              className="rounded-[20px] px-5 py-2.5 border-2 font-black text-sm flex items-center gap-2"
              style={{ background: 'var(--mint-green)', borderColor: 'var(--base-white)', color: '#2B7A2B' }}
            >
              <PackageCheck size={15} strokeWidth={3} />
              {doneCount} done
            </div>
          )}
        </div>
      </div>

      {/* ── Add Item Form ── */}
      <div
        className="rounded-[28px] p-7 mb-8 border-4 relative overflow-hidden"
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
          Add Item
        </h3>

        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 relative z-10">
          <input
            type="text"
            placeholder="e.g. Milk, Eggs, Bread…"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="flex-1 px-5 py-3.5 rounded-[20px] font-bold"
            style={{ background: 'var(--bg-cream)', border: '3px solid var(--base-white)', color: 'var(--dark-brown)' }}
          />
          <button
            type="submit"
            className="shrink-0 px-7 py-3.5 rounded-[20px] font-black border-4 border-white transition-all hover:-translate-y-0.5"
            style={{
              background: 'var(--sky-blue)',
              color: 'var(--dark-brown)',
              boxShadow: '0 4px 12px rgba(181,234,234,0.4)',
            }}
          >
            Add to List
          </button>
        </form>
      </div>

      {/* ── List ── */}
      {isLoading ? (
        <div className="loader-wrap">
          <div className="spinner" />
          <p className="font-bold" style={{ color: 'var(--warm-brown)' }}>Loading list…</p>
        </div>
      ) : error ? (
        <div
          className="p-6 rounded-[24px] text-center font-bold border-2 border-white"
          style={{ background: '#FFE5E5', color: '#D14D4D' }}
        >
          Failed to load groceries. Please try again.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {groceries?.map((item) => (
            <GroceryItem key={item.id} item={item} onUpdate={mutate} />
          ))}
          {(!groceries || groceries.length === 0) && (
            <div
              className="flex flex-col items-center justify-center py-20 rounded-[40px] border-4 border-dashed text-center"
              style={{ background: 'var(--base-white)', borderColor: 'var(--bg-cream)' }}
            >
              <div className="text-6xl mb-5" style={{ animation: 'float 4s ease-in-out infinite' }}>✨</div>
              <h3 className="text-2xl font-black mb-2" style={{ color: 'var(--dark-brown)' }}>All Stocked Up!</h3>
              <p className="font-bold" style={{ color: 'var(--warm-brown)' }}>Add items to your shopping list above.</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
