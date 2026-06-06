"use client";

import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { Star, Gift, Lock, Unlock } from 'lucide-react';

export default function RewardCard({
  reward,
  onUpdate,
  userPoints = 0,
  role,
}: {
  reward: any;
  onUpdate: () => void;
  userPoints: number;
  role?: string;
}) {
  const pointsRequired = reward.pointsRequired ?? reward.pointsCost ?? 0;
  const isLocked = userPoints < pointsRequired;
  const shortage = pointsRequired - userPoints;

  const handleRedeem = async () => {
    if (isLocked) { toast.error(`Need ${shortage} more stars! 🌟`); return; }
    const t = toast.loading('Redeeming... 🎁');
    try   { await api.post(`/rewards/${reward.id}/redeem`, {}); toast.success(`Redeemed ${reward.name}! 🎉`, { id: t }); onUpdate(); }
    catch { toast.error('Failed to redeem reward.', { id: t }); }
  };

  return (
    <div className={`rounded-[24px] border-2 flex flex-col gap-4 p-5 shadow-sm transition-all duration-200 ${
      isLocked
        ? 'bg-[var(--bg-cream)] border-transparent opacity-75'
        : 'bg-white border-[var(--pink-light)] hover:shadow-md hover:-translate-y-1 hover:border-[var(--baby-pink)]'
    }`}>

      {/* ── Top row: lock status + price ── */}
      <div className="flex items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black border-2 border-white shadow-sm ${
          isLocked ? 'bg-[var(--bg-cream)] text-[var(--warm-brown)]' : 'bg-[var(--mint-green)] text-[#2B7A2B]'
        }`}>
          {isLocked ? <><Lock size={11} strokeWidth={3} /> Locked</> : <><Unlock size={11} strokeWidth={3} /> Unlocked</>}
        </span>
        <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black border-2 border-white shadow-sm ${
          isLocked ? 'bg-[var(--bg-cream)] text-[var(--warm-brown)]' : 'bg-[var(--soft-yellow)] text-[#D4AF37]'
        }`}>
          <Star size={11} strokeWidth={3} /> {pointsRequired} pts
        </span>
      </div>

      {/* ── Illustration ── */}
      <div className={`rounded-[18px] h-28 flex items-center justify-center border-2 ${
        isLocked ? 'bg-white border-[var(--bg-cream)]' : 'bg-[var(--pink-light)] border-white'
      }`}>
        <Gift size={44} className={isLocked ? 'text-[var(--pink-light)]' : 'text-[var(--baby-pink)]'} strokeWidth={1.5} />
      </div>

      {/* ── Name ── */}
      <div className="flex-1 text-center">
        <h4 className="text-base font-black text-[var(--dark-brown)] leading-snug">{reward.name}</h4>
      </div>

      {/* ── Action ── */}
      {role === 'CHILD' && (
        <button
          onClick={handleRedeem}
          disabled={isLocked}
          className={`w-full flex justify-center items-center gap-2 py-3 rounded-[16px] font-black text-sm border-2 border-white shadow-sm transition-all ${
            isLocked
              ? 'bg-[var(--bg-cream)] text-[var(--warm-brown)] cursor-not-allowed'
              : 'bg-[var(--soft-yellow)] hover:bg-[#FFE57F] text-[var(--dark-brown)] hover:-translate-y-0.5 hover:shadow-md'
          }`}
        >
          {isLocked ? `Need ${shortage} more ⭐` : '🎁 Redeem Now!'}
        </button>
      )}

      {role === 'PARENT' && (
        <div className="w-full text-center py-3 rounded-[16px] bg-[var(--bg-cream)] text-[var(--warm-brown)] font-bold text-sm border-2 border-dashed border-[var(--pink-light)]">
          In Shop
        </div>
      )}
    </div>
  );
}
