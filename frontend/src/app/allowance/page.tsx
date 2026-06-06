"use client";

import { useAuth } from '@/context/AuthContext';
import { fetcher, api } from '@/lib/api';
import useSWR from 'swr';
import { Family, PayoutRecord } from '@/types';
import { Banknote, Settings, History, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function AllowancePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [rateInput, setRateInput] = useState<string>('10');
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [payoutAmountInput, setPayoutAmountInput] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'PARENT')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const { data: family, mutate: mutateFamily } = useSWR<Family>(
    user?.role === 'PARENT' ? '/family/me' : null,
    fetcher
  );

  const { data: payoutHistory, mutate: mutateHistory } = useSWR<PayoutRecord[]>(
    user?.role === 'PARENT' ? '/family/payout-history' : null,
    fetcher
  );

  // Note: Added allowanceRate to Family interface dynamically if not present, though it is typed
  const currentRate = (family as any)?.allowanceRate ?? 10;

  useEffect(() => {
    if (family) {
      setRateInput(String((family as any).allowanceRate ?? 10));
    }
  }, [family]);

  if (authLoading || !family) {
    return (
      <main className="page-wrapper">
        <div className="loader-wrap min-h-[50vh]">
          <div className="spinner" />
          <p className="font-bold" style={{ color: 'var(--warm-brown)' }}>Loading Allowance Tracker…</p>
        </div>
      </main>
    );
  }

  const handleUpdateRate = async () => {
    const t = toast.loading('Updating rate...');
    try {
      await api.patch('/family/allowance-rate', { rate: parseInt(rateInput, 10) });
      toast.success('Allowance rate updated!', { id: t });
      setIsEditingRate(false);
      mutateFamily();
    } catch {
      toast.error('Failed to update rate', { id: t });
    }
  };

  const handlePayout = async (childId: number, currentPoints: number) => {
    const inputPoints = parseInt(payoutAmountInput[childId] || '0', 10);
    if (!inputPoints || inputPoints <= 0) {
      toast.error('Please enter a valid points amount');
      return;
    }
    if (inputPoints > currentPoints) {
      toast.error('Child does not have enough points!');
      return;
    }

    const moneyPaid = inputPoints / currentRate;

    const t = toast.loading('Processing payout...');
    try {
      await api.post('/family/payout', {
        childId,
        points: inputPoints,
        money: moneyPaid
      });
      toast.success(`Successfully paid out ฿${moneyPaid.toFixed(2)}`, { id: t });
      setPayoutAmountInput({ ...payoutAmountInput, [childId]: '' });
      mutateFamily();
      mutateHistory();
    } catch {
      toast.error('Failed to process payout', { id: t });
    }
  };

  const children = family.member?.filter(m => m.role === 'CHILD') || [];

  return (
    <main className="page-wrapper max-w-5xl mx-auto space-y-8">
      {/* ── Header ── */}
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-black mb-3 text-shadow flex items-center justify-center gap-3" style={{ color: 'var(--dark-brown)' }}>
          <Banknote className="w-10 h-10 md:w-12 md:h-12 text-[#85bb65]" />
          Allowance Tracker
        </h1>
        <p className="text-lg md:text-xl font-bold" style={{ color: 'var(--warm-brown)' }}>
          Convert stars into real rewards and track payouts
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left Column: Config & Action ── */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Rate Config */}
          <section className="glass-card rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 border-4 border-white" style={{ background: 'linear-gradient(145deg, #F5FFFA 0%, #E0FFF0 100%)' }}>
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-2xl shadow-sm">
                <Settings className="w-8 h-8 text-[#2E8B57]" />
              </div>
              <div>
                <h2 className="text-xl font-black text-[#2E8B57]">Conversion Rate</h2>
                <p className="font-bold text-gray-500 text-sm">How much is a star worth?</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white/60 p-2 pl-4 rounded-full border-2 border-white/50">
              <span className="font-black text-xl text-[#D4AF37]">⭐</span>
              {isEditingRate ? (
                <input
                  type="number"
                  value={rateInput}
                  onChange={(e) => setRateInput(e.target.value)}
                  className="w-16 bg-white font-black text-xl text-center border-2 border-[#2E8B57] rounded-xl outline-none"
                />
              ) : (
                <span className="font-black text-2xl text-[#2E8B57] min-w-[3rem] text-center">{currentRate}</span>
              )}
              <span className="font-black text-gray-500">=</span>
              <span className="font-black text-xl text-[#85bb65]">฿1</span>
              
              {isEditingRate ? (
                <button onClick={handleUpdateRate} className="btn-primary ml-2 px-4 py-2 text-sm">Save</button>
              ) : (
                <button onClick={() => setIsEditingRate(true)} className="btn-secondary ml-2 px-4 py-2 text-sm bg-white hover:bg-gray-50">Edit</button>
              )}
            </div>
          </section>

          {/* Children Payout List */}
          <section className="glass-card rounded-[32px] p-6 md:p-8">
            <h2 className="text-2xl font-black flex items-center gap-2 mb-6" style={{ color: 'var(--dark-brown)' }}>
              <Send className="text-[#85bb65]" />
              Execute Payout
            </h2>

            <div className="space-y-4">
              {children.map(child => {
                // We use totalPoints representing current balance based on previous gamification implementation
                const balance = child.totalPoints || 0;
                const inputValue = parseInt(payoutAmountInput[child.id] || '0', 10);
                const cashValue = (inputValue && !isNaN(inputValue)) ? (inputValue / currentRate).toFixed(2) : '0.00';

                return (
                  <div key={child.id} className="bg-white/60 rounded-2xl p-4 border-2 border-white/40 shadow-sm flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 w-full flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E0FFF0] to-[#F5FFFA] border-2 border-white flex items-center justify-center font-black text-xl text-[#2E8B57]">
                        {child.fullName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-black text-lg" style={{ color: 'var(--dark-brown)' }}>{child.fullName}</h3>
                        <p className="font-bold text-sm text-[#D4AF37]">Balance: {balance} Stars (฿{(balance/currentRate).toFixed(2)})</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0 bg-white p-2 rounded-xl border-2 border-gray-100">
                      <span className="font-black text-[#D4AF37] px-2">⭐</span>
                      <input
                        type="number"
                        placeholder="Points"
                        value={payoutAmountInput[child.id] || ''}
                        onChange={(e) => setPayoutAmountInput({...payoutAmountInput, [child.id]: e.target.value})}
                        className="w-20 bg-gray-50 font-bold p-2 rounded-lg outline-none focus:ring-2 focus:ring-[#85bb65]"
                        max={balance}
                      />
                      <span className="font-black text-gray-400 px-1">=</span>
                      <span className="font-black text-[#85bb65] px-2 min-w-[3rem]">฿{cashValue}</span>
                      <button 
                        onClick={() => handlePayout(child.id, balance)}
                        disabled={balance <= 0 || !inputValue || inputValue > balance}
                        className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: '#85bb65' }}
                      >
                        Payout
                      </button>
                    </div>
                  </div>
                );
              })}
              
              {children.length === 0 && (
                <div className="text-center py-8 text-gray-500 font-bold">
                  No children in the family yet.
                </div>
              )}
            </div>
          </section>

        </div>

        {/* ── Right Column: History ── */}
        <div className="lg:col-span-1">
          <section className="glass-card rounded-[32px] p-6 h-full border-4 border-white">
            <h2 className="text-xl font-black flex items-center gap-2 mb-6" style={{ color: 'var(--dark-brown)' }}>
              <History className="text-[#FFB6C1]" />
              Payout History
            </h2>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {!payoutHistory || payoutHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-400 font-bold text-sm">
                  No payouts made yet.
                </div>
              ) : (
                payoutHistory.map(record => (
                  <div key={record.id} className="bg-white/80 rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-black text-[#2E8B57]">฿{record.moneyPaid.toFixed(2)}</span>
                      <span className="text-xs font-bold text-gray-400">
                        {new Date(record.payoutDate).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-600">To: {record.child?.fullName || 'Child'}</p>
                    <p className="text-xs font-bold text-[#D4AF37] mt-1">Deducted {record.pointsDeducted} Stars</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
