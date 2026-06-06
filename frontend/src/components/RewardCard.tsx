"use client";

import { useState } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { Star, Gift, Lock, Unlock, Trash2, Pencil, X } from 'lucide-react';
import { Reward, RedemptionRecord } from '@/types';

function saveRedemption(record: RedemptionRecord) {
  try {
    const existing: RedemptionRecord[] = JSON.parse(
      localStorage.getItem('redemption_history') || '[]'
    );
    existing.unshift(record);
    localStorage.setItem('redemption_history', JSON.stringify(existing.slice(0, 20)));
  } catch { /* silent */ }
}

export default function RewardCard({
  reward,
  onUpdate,
  userPoints = 0,
  role,
}: {
  reward: Reward;
  onUpdate: () => void;
  userPoints: number;
  role?: string;
}) {
  const pointsRequired = reward.pointsRequired ?? reward.pointsCost ?? 0;
  const isLocked = userPoints < pointsRequired;
  const shortage = pointsRequired - userPoints;

  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState(reward.name);
  const [editDesc, setEditDesc] = useState(reward.description || '');
  const [editPts,  setEditPts]  = useState(pointsRequired);
  const [saving, setSaving] = useState(false);

  const handleRedeem = async () => {
    if (isLocked) { toast.error(`Need ${shortage} more stars! 🌟`); return; }
    const t = toast.loading('Redeeming... 🎁');
    try {
      await api.post(`/rewards/${reward.id}/redeem`, {});
      saveRedemption({ rewardName: reward.name, pointsSpent: pointsRequired, redeemedAt: new Date().toISOString() });
      toast.success(`Redeemed "${reward.name}"! 🎉`, { id: t });
      onUpdate();
    } catch {
      toast.error('Failed to redeem reward.', { id: t });
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${reward.name}"? This cannot be undone.`)) return;
    const t = toast.loading('Deleting...');
    try   { await api.del(`/rewards/${reward.id}`); toast.success('Reward deleted.', { id: t }); onUpdate(); }
    catch { toast.error('Failed to delete.', { id: t }); }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const t = toast.loading('Saving...');
    try {
      await api.put(`/rewards/${reward.id}`, {
        name: editName,
        description: editDesc || undefined,
        pointsRequired: editPts,
      });
      toast.success('Reward updated! ✨', { id: t });
      setShowEdit(false);
      onUpdate();
    } catch {
      toast.error('Failed to update reward.', { id: t });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className={`rounded-[24px] border-2 flex flex-col gap-4 p-5 shadow-sm transition-all duration-200 ${
        isLocked
          ? 'bg-[var(--bg-cream)] border-transparent opacity-80'
          : 'bg-white border-[var(--pink-light)] hover:shadow-md hover:-translate-y-1 hover:border-[var(--baby-pink)]'
      }`}>

        {/* ── Top row: lock + price + PARENT actions ── */}
        <div className="flex items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black border-2 border-white shadow-sm ${
            isLocked ? 'bg-[var(--bg-cream)] text-[var(--warm-brown)]' : 'bg-[var(--mint-green)] text-[#2B7A2B]'
          }`}>
            {isLocked ? <><Lock size={11} strokeWidth={3} /> Locked</> : <><Unlock size={11} strokeWidth={3} /> Unlocked</>}
          </span>
          <div className="flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black border-2 border-white shadow-sm ${
              isLocked ? 'bg-[var(--bg-cream)] text-[var(--warm-brown)]' : 'bg-[var(--soft-yellow)] text-[#D4AF37]'
            }`}>
              <Star size={11} strokeWidth={3} /> {pointsRequired} pts
            </span>
            {role === 'PARENT' && (
              <>
                <button onClick={() => setShowEdit(true)}
                  className="p-1.5 rounded-[10px] border-2 border-white transition-all hover:scale-110"
                  style={{ background: 'var(--sky-light)', color: 'var(--sky-blue)' }} title="Edit reward">
                  <Pencil size={12} strokeWidth={3} />
                </button>
                <button onClick={handleDelete}
                  className="p-1.5 rounded-[10px] border-2 border-white transition-all hover:scale-110"
                  style={{ background: '#FFE5E5', color: '#D14D4D' }} title="Delete reward">
                  <Trash2 size={12} strokeWidth={3} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Illustration ── */}
        <div className={`rounded-[18px] h-28 flex items-center justify-center border-2 ${
          isLocked ? 'bg-white border-[var(--bg-cream)]' : 'bg-[var(--pink-light)] border-white'
        }`}>
          <Gift size={44} className={isLocked ? 'text-[var(--pink-light)]' : 'text-[var(--baby-pink)]'} strokeWidth={1.5} />
        </div>

        {/* ── Name + Description ── */}
        <div className="flex-1 text-center">
          <h4 className="text-base font-black text-[var(--dark-brown)] leading-snug">{reward.name}</h4>
          {reward.description && (
            <p className="text-xs font-medium text-[var(--warm-brown)] mt-1 line-clamp-2">{reward.description}</p>
          )}
        </div>

        {/* ── Action ── */}
        {role === 'CHILD' && (
          <button onClick={handleRedeem} disabled={isLocked}
            className={`w-full flex justify-center items-center gap-2 py-3 rounded-[16px] font-black text-sm border-2 border-white shadow-sm transition-all ${
              isLocked
                ? 'bg-[var(--bg-cream)] text-[var(--warm-brown)] cursor-not-allowed'
                : 'bg-[var(--soft-yellow)] hover:bg-[#FFE57F] text-[var(--dark-brown)] hover:-translate-y-0.5 hover:shadow-md'
            }`}>
            {isLocked ? `Need ${shortage} more ⭐` : '🎁 Redeem Now!'}
          </button>
        )}
        {role === 'PARENT' && (
          <div className="w-full text-center py-3 rounded-[16px] bg-[var(--bg-cream)] text-[var(--warm-brown)] font-bold text-sm border-2 border-dashed border-[var(--pink-light)]">
            In Shop
          </div>
        )}
      </div>

      {/* ── Edit Modal ── */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-md rounded-[28px] p-7 border-4 border-white shadow-2xl" style={{ background: 'var(--base-white)' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black flex items-center gap-2" style={{ color: 'var(--dark-brown)' }}>
                <Pencil size={20} strokeWidth={3} style={{ color: '#FF6B9E' }} /> Edit Reward
              </h3>
              <button onClick={() => setShowEdit(false)} className="p-2 rounded-full hover:bg-[var(--bg-cream)] transition-colors">
                <X size={18} strokeWidth={2.5} style={{ color: 'var(--warm-brown)' }} />
              </button>
            </div>

            <form onSubmit={handleEdit} className="flex flex-col gap-4">
              <input type="text" value={editName} onChange={e => setEditName(e.target.value)} required
                placeholder="Reward name"
                className="w-full px-5 py-3.5 rounded-[16px] font-bold"
                style={{ background: 'var(--bg-cream)', border: '3px solid var(--base-white)', color: 'var(--dark-brown)' }} />
              <input type="text" value={editDesc} onChange={e => setEditDesc(e.target.value)}
                placeholder="Description (optional)"
                className="w-full px-5 py-3.5 rounded-[16px] font-bold"
                style={{ background: 'var(--bg-cream)', border: '3px solid var(--base-white)', color: 'var(--dark-brown)' }} />
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-[16px] border-4 border-white"
                style={{ background: 'var(--yellow-light)' }}>
                <Star size={18} strokeWidth={3} style={{ color: '#D4AF37' }} />
                <input type="number" value={editPts} onChange={e => setEditPts(Number(e.target.value))} min="1"
                  className="w-20 bg-transparent outline-none font-black text-lg"
                  style={{ color: '#D4AF37' }} />
                <span className="font-bold text-sm" style={{ color: '#D4AF37' }}>stars required</span>
              </div>
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setShowEdit(false)}
                  className="flex-1 py-3 rounded-[16px] font-black border-2 transition-all"
                  style={{ background: 'var(--bg-cream)', color: 'var(--warm-brown)', borderColor: 'var(--base-white)' }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 rounded-[16px] font-black border-4 border-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
                  style={{ background: 'var(--baby-pink)', color: 'var(--dark-brown)' }}>
                  {saving ? 'Saving...' : 'Save Changes 🎁'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
