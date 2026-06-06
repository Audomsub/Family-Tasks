"use client";

import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { Trophy, Star, Medal } from 'lucide-react';
import { LeaderboardEntry } from '@/types';

const MEDALS = ['🥇', '🥈', '🥉'];
const PODIUM_HEIGHTS = ['h-40', 'h-28', 'h-20'];
const PODIUM_COLORS = ['var(--soft-yellow)', '#E2E8F0', '#F3D8C7'];
const PODIUM_TEXT   = ['#D4AF37', '#9CA3AF', '#C2714F'];

export default function LeaderboardPage() {
  const { data: leaderboard, error, isLoading } = useSWR<LeaderboardEntry[]>('/leaderboard', fetcher);
  const { data: me } = useSWR<any>('/auth/me', fetcher);

  const getName = (m: LeaderboardEntry) => m.fullName || m.name || m.username || 'Member';
  const getPoints = (m: LeaderboardEntry) => m.totalPoints ?? m.points ?? 0;
  const getAvatar = (m: LeaderboardEntry) => m.role === 'PARENT' ? '🐻' : '🐰';

  const top3   = leaderboard?.slice(0, 3) ?? [];
  const others = leaderboard?.slice(3)    ?? [];

  // Podium order: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);
  const podiumIndices = [1, 0, 2]; // maps podiumOrder back to original rank

  return (
    <main className="page-wrapper">

      {/* ── Page Header ── */}
      <div className="flex items-center gap-4 mb-10">
        <div
          className="w-14 h-14 rounded-[20px] flex items-center justify-center border-4 border-white shadow-sm rotate-6 shrink-0"
          style={{ background: 'var(--soft-yellow)' }}
        >
          <Trophy size={28} strokeWidth={2.5} style={{ color: '#D4AF37' }} />
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tight" style={{ color: 'var(--dark-brown)' }}>
            Hall of Fame 🏆
          </h1>
          <p className="font-bold" style={{ color: 'var(--warm-brown)' }}>
            Who&apos;s the star of the family this week?
          </p>
        </div>
      </div>

      {/* ── Loading / Error ── */}
      {isLoading ? (
        <div className="loader-wrap min-h-[50vh]">
          <div className="spinner" />
          <p className="font-bold" style={{ color: 'var(--warm-brown)' }}>Loading leaderboard…</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-[24px] text-center font-bold border-2 border-white"
          style={{ background: '#FFE5E5', color: '#D14D4D' }}>
          Failed to load leaderboard. Please try again.
        </div>
      ) : !leaderboard || leaderboard.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-[40px] border-4 border-dashed text-center"
          style={{ background: 'var(--base-white)', borderColor: 'var(--bg-cream)' }}>
          <div className="text-6xl mb-5" style={{ animation: 'float 4s ease-in-out infinite' }}>🏆</div>
          <h3 className="text-2xl font-black mb-2" style={{ color: 'var(--dark-brown)' }}>No Rankings Yet!</h3>
          <p className="font-bold" style={{ color: 'var(--warm-brown)' }}>Complete tasks to appear on the leaderboard.</p>
        </div>
      ) : (
        <>
          {/* ── Podium (top 3) ── */}
          {top3.length > 0 && (
            <div
              className="rounded-[32px] p-8 mb-8 relative overflow-hidden border-4 border-white"
              style={{ background: 'linear-gradient(135deg, var(--sky-light) 0%, var(--pink-light) 100%)', boxShadow: 'var(--shadow-md)' }}
            >
              {/* Deco */}
              <span className="absolute left-6 top-6 text-4xl opacity-20 pointer-events-none" style={{ animation: 'float 4s ease-in-out infinite' }}>⭐</span>
              <span className="absolute right-8 top-8 text-3xl opacity-20 pointer-events-none" style={{ animation: 'float 5s ease-in-out infinite 1s' }}>🌟</span>

              <div className="flex justify-center items-end gap-4 h-56">
                {podiumOrder.map((member, podiumIdx) => {
                  const rankIdx = podiumIndices[podiumIdx];
                  const isFirst = rankIdx === 0;
                  return (
                    <div key={rankIdx} className={`flex flex-col items-center ${isFirst ? 'w-36' : 'w-28'}`}>
                      {/* Name card */}
                      <div
                        className="w-full rounded-[20px] p-3 mb-3 text-center border-2 border-white shadow-sm"
                        style={{ background: 'var(--base-white)', animation: `float ${3.5 + rankIdx * 0.5}s ease-in-out infinite` }}
                      >
                        <div className="text-2xl mb-1">{getAvatar(member)}</div>
                        <p className={`font-black truncate ${isFirst ? 'text-base' : 'text-sm'}`}
                          style={{ color: 'var(--dark-brown)' }}>
                          {getName(member)}
                        </p>
                        <p className="text-xs font-black mt-0.5" style={{ color: PODIUM_TEXT[rankIdx] }}>
                          ⭐ {getPoints(member)} pts
                        </p>
                      </div>

                      {/* Podium block */}
                      <div
                        className={`w-full ${PODIUM_HEIGHTS[rankIdx]} rounded-t-[16px] flex flex-col items-center justify-start pt-3`}
                        style={{ background: PODIUM_COLORS[rankIdx] }}
                      >
                        <span className={`${isFirst ? 'text-4xl' : 'text-3xl'}`}>{MEDALS[rankIdx]}</span>
                        <span className="font-black text-sm mt-1" style={{ color: 'var(--dark-brown)' }}>#{rankIdx + 1}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Full Ranking Table ── */}
          <div
            className="rounded-[28px] p-7 border-2"
            style={{ background: 'var(--base-white)', borderColor: 'var(--bg-cream)', boxShadow: 'var(--shadow-sm)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-[14px]" style={{ background: 'var(--yellow-light)' }}>
                <Medal size={18} strokeWidth={3} style={{ color: '#D4AF37' }} />
              </div>
              <h2 className="text-xl font-black" style={{ color: 'var(--dark-brown)' }}>Complete Ranking</h2>
            </div>

            <div className="flex flex-col gap-3">
              {leaderboard.map((member, idx) => {
                const isMe = me && (member.id === me.id || getName(member) === me.fullName);
                const isTop = idx < 3;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-4 rounded-[20px] border-2 transition-all hover:-translate-y-0.5"
                    style={{
                      background: isMe ? 'var(--sky-light)' : isTop ? 'var(--yellow-light)' : 'var(--bg-cream)',
                      borderColor: isMe ? 'var(--sky-blue)' : 'var(--base-white)',
                    }}
                  >
                    {/* Rank badge */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0 border-2 border-white"
                      style={{
                        background: isTop ? PODIUM_COLORS[idx] : 'var(--base-white)',
                        color: isTop ? PODIUM_TEXT[idx] : 'var(--warm-brown)',
                      }}
                    >
                      {isTop ? MEDALS[idx] : `#${idx + 1}`}
                    </div>

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-[14px] flex items-center justify-center text-xl border-2 border-white shrink-0"
                      style={{ background: 'var(--base-white)' }}>
                      {getAvatar(member)}
                    </div>

                    {/* Name */}
                    <span className="flex-1 font-black text-base truncate" style={{ color: 'var(--dark-brown)' }}>
                      {getName(member)}
                      {isMe && (
                        <span className="ml-2 text-xs font-black px-2 py-0.5 rounded-full"
                          style={{ background: 'var(--sky-blue)', color: 'var(--dark-brown)' }}>
                          You!
                        </span>
                      )}
                    </span>

                    {/* Points */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black border-2 border-white"
                      style={{
                        background: isTop ? 'var(--base-white)' : 'var(--base-white)',
                        color: '#D4AF37'
                      }}>
                      <Star size={12} strokeWidth={3} /> {getPoints(member)} pts
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
