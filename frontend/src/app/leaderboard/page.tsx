"use client";
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { User } from '@/types';

export default function LeaderboardPage() {
  const { data: leaderboard, error, isLoading } = useSWR<User[]>('/leaderboard', fetcher);

  const top3 = leaderboard ? leaderboard.slice(0, 3) : [];
  const others = leaderboard ? leaderboard.slice(3) : [];

  return (
    <main className="container" style={{ marginTop: '2rem', maxWidth: '900px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 className="title" style={{ fontSize: '3rem' }}>🏆 Hall of Fame</h2>
        <p className="subtitle">Who's leading the family this week?</p>
      </div>
      
      {isLoading ? (
        <div className="loader-container"><div className="spinner"></div></div>
      ) : error ? (
        <p style={{ color: 'red', textAlign: 'center', fontWeight: 700 }}>Failed to load leaderboard.</p>
      ) : (
        <>
          {/* Podium UI */}
          {top3.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '1rem', marginBottom: '4rem', height: '250px' }}>
              
              {/* 2nd Place */}
              {top3[1] && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '30%' }}>
                  <div className="floating" style={{ backgroundColor: 'var(--base-white)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-pill)', marginBottom: '1rem', boxShadow: 'var(--shadow-soft)', fontWeight: 800, color: 'var(--dark-brown)', textAlign: 'center' }}>
                    {top3[1].name || top3[1].username} <br/><span style={{ color: 'var(--text-muted)' }}>{top3[1].points} pts</span>
                  </div>
                  <div style={{ width: '100%', height: '120px', backgroundColor: '#E2E8F0', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'center', paddingTop: '1rem', fontSize: '3rem' }}>🥈</div>
                </div>
              )}

              {/* 1st Place */}
              {top3[0] && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '35%' }}>
                  <div className="floating" style={{ animationDelay: '0.5s', backgroundColor: 'var(--base-white)', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-pill)', marginBottom: '1.5rem', boxShadow: 'var(--shadow-hover)', border: '2px solid var(--soft-yellow)', fontWeight: 900, color: 'var(--dark-brown)', textAlign: 'center', fontSize: '1.2rem' }}>
                    {top3[0].name || top3[0].username} <br/><span style={{ color: '#D4AF37' }}>{top3[0].points} pts</span>
                  </div>
                  <div style={{ width: '100%', height: '160px', backgroundColor: 'var(--soft-yellow)', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'center', paddingTop: '1rem', fontSize: '4rem' }}>👑</div>
                </div>
              )}

              {/* 3rd Place */}
              {top3[2] && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '30%' }}>
                  <div className="floating" style={{ animationDelay: '1s', backgroundColor: 'var(--base-white)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-pill)', marginBottom: '1rem', boxShadow: 'var(--shadow-soft)', fontWeight: 800, color: 'var(--dark-brown)', textAlign: 'center' }}>
                    {top3[2].name || top3[2].username} <br/><span style={{ color: 'var(--text-muted)' }}>{top3[2].points} pts</span>
                  </div>
                  <div style={{ width: '100%', height: '90px', backgroundColor: '#F3D8C7', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'center', paddingTop: '1rem', fontSize: '2.5rem' }}>🥉</div>
                </div>
              )}
            </div>
          )}

          {/* Full Ranking Table */}
          <div className="card" style={{ backgroundColor: 'var(--base-white)', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--dark-brown)', fontWeight: 800 }}>Complete Ranking</h3>
            {leaderboard && leaderboard.length > 0 ? (
              <ul style={{ listStyle: 'none' }}>
                {leaderboard.map((member, idx) => (
                  <li key={idx} style={{ 
                    padding: '1.25rem 1rem', 
                    borderBottom: '2px dashed var(--bg-cream)', 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: '1.5rem',
                    backgroundColor: idx === 0 ? 'var(--yellow-light)' : 'transparent',
                    borderRadius: idx === 0 ? '16px' : '0'
                  }}>
                    <div style={{ width: '36px', height: '36px', backgroundColor: 'var(--sky-light)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 800, color: 'var(--sky-blue)' }}>
                      #{idx + 1}
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--dark-brown)', flex: 1 }}>{member.name || member.username}</span>
                    <span className="badge" style={{ backgroundColor: 'var(--pink-light)', color: 'var(--dark-brown)' }}>{member.points || 0} pts</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ color: 'var(--text-muted)', fontWeight: 700 }}>No leaderboard data available yet.</p>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}
