"use client";

import { useState } from 'react';
import useSWR from 'swr';
import { api, fetcher } from '@/lib/api';
import RewardCard from '@/components/RewardCard';
import toast from 'react-hot-toast';
import { Gift, Plus, Star } from 'lucide-react';

export default function RewardsPage() {
  const { data: user } = useSWR<any>('/auth/me', fetcher);
  const { data: rewards, error: rError, isLoading: rLoading, mutate: rMutate } = useSWR<any[]>('/rewards', fetcher);
  const { mutate: dMutate } = useSWR<any>('/dashboard/summary', fetcher);
  
  const userPoints = user?.totalPoints || 0;

  const [name, setName] = useState('');
  const [pointsRequired, setPointsRequired] = useState(50);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('Creating reward... 🎁');
    try {
      await api.post('/rewards', { name, pointsRequired });
      setName('');
      setPointsRequired(50);
      toast.success('Reward added to the shop! 🎀', { id: loadingToast });
      rMutate();
    } catch {
      toast.error('Failed to create reward', { id: loadingToast });
    }
  };

  const handleUpdate = () => {
    rMutate();
    dMutate();
  };

  return (
    <main className="page-wrapper">
      
      {/* ── Header & Balance ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div 
            className="w-14 h-14 rounded-[20px] flex items-center justify-center border-4 border-white shadow-sm shrink-0"
            style={{ background: 'var(--pink-light)' }}
          >
            <Gift size={28} strokeWidth={2.5} style={{ color: 'var(--baby-pink)' }} />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight" style={{ color: 'var(--dark-brown)' }}>
              Reward Shop
            </h1>
            <p className="font-bold" style={{ color: 'var(--warm-brown)' }}>
              {user?.role === 'PARENT' ? 'Create exciting rewards for your family! 🛍️' : 'Treat yourself! You\'ve earned it. 🍦'}
            </p>
          </div>
        </div>
        
        {/* Balance Indicator */}
        <div 
          className="rounded-[20px] p-2 pr-5 border-2 shadow-sm flex items-center gap-3 shrink-0"
          style={{ background: 'var(--base-white)', borderColor: 'var(--yellow-light)' }}
        >
          <div 
            className="w-10 h-10 rounded-[14px] flex justify-center items-center"
            style={{ background: 'var(--yellow-light)' }}
          >
            <Star size={20} strokeWidth={3} style={{ color: '#D4AF37' }} />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest leading-none mb-1" style={{ color: 'var(--warm-brown)' }}>My Stars</div>
            <div className="text-xl font-black leading-none" style={{ color: 'var(--dark-brown)' }}>{userPoints}</div>
          </div>
        </div>
      </div>
      
      {/* ── Parent Create Form ── */}
      {user?.role === 'PARENT' && (
        <div 
          className="rounded-[28px] p-7 mb-8 border-4 relative overflow-hidden"
          style={{ 
            background: 'var(--base-white)', 
            borderColor: 'var(--pink-light)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {/* Decorative blob */}
          <div 
            className="absolute top-0 right-0 w-40 h-40 rounded-full mix-blend-multiply filter blur-2xl opacity-60 translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ background: 'var(--pink-light)' }}
          />
          
          <h3 className="text-xl font-black flex items-center gap-2 mb-5 relative z-10" style={{ color: 'var(--dark-brown)' }}>
            <Plus size={22} strokeWidth={3} style={{ color: 'var(--baby-pink)' }} /> 
            Add to Shop
          </h3>
          
          <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-3 relative z-10">
            <input 
              type="text" 
              placeholder="e.g. Extra iPad Time, Ice Cream..." 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
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
                value={pointsRequired} 
                onChange={(e) => setPointsRequired(Number(e.target.value))} 
                className="w-14 bg-transparent outline-none font-black text-lg text-center"
                style={{ color: '#D4AF37' }}
                min="1"
              />
            </div>
            <button 
              type="submit" 
              className="shrink-0 px-7 py-3.5 rounded-[20px] font-black border-4 border-white transition-all hover:-translate-y-0.5"
              style={{ 
                background: 'var(--baby-pink)', 
                color: 'var(--dark-brown)',
                boxShadow: '0 4px 12px rgba(255,212,229,0.4)'
              }}
            >
              Create Reward
            </button>
          </form>
        </div>
      )}

      {/* ── Rewards Grid ── */}
      {rLoading ? (
        <div className="loader-wrap">
          <div className="spinner" />
          <p className="font-bold" style={{ color: 'var(--warm-brown)' }}>Loading shop...</p>
        </div>
      ) : rError ? (
        <div 
          className="p-6 rounded-[24px] text-center font-bold border-2 border-white"
          style={{ background: '#FFE5E5', color: '#D14D4D' }}
        >
          Failed to load rewards.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rewards?.map((reward) => (
            <RewardCard key={reward.id} reward={reward} onUpdate={handleUpdate} userPoints={userPoints} role={user?.role} />
          ))}
          {(!rewards || rewards.length === 0) && (
            <div 
              className="col-span-full flex flex-col items-center justify-center py-20 rounded-[40px] border-4 border-dashed text-center"
              style={{ background: 'var(--base-white)', borderColor: 'var(--bg-cream)' }}
            >
              <div className="text-6xl mb-5" style={{ animation: 'float 4s ease-in-out infinite' }}>🛍️</div>
              <h3 className="text-2xl font-black mb-2" style={{ color: 'var(--dark-brown)' }}>The Shop is Empty!</h3>
              <p className="font-bold" style={{ color: 'var(--warm-brown)' }}>Parents need to stock up the shop first.</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
