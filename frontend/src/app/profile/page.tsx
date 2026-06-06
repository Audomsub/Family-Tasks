"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const { logout } = useAuth();
  
  // Try to grab user info from family endpoint for demo
  const { data: family } = useSWR<any>('/family/me', fetcher);
  const me = family?.members?.[0]; // Mocking "me" as the first member since no direct endpoint exists yet

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.error('Profile update not implemented on backend yet. 🛠️');
  };

  return (
    <main className="container" style={{ marginTop: '2rem', maxWidth: '700px' }}>
      
      <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center', marginBottom: '2rem', backgroundImage: 'linear-gradient(to bottom, var(--pink-light), var(--base-white))', border: 'none' }}>
        <div style={{ width: '100px', height: '100px', backgroundColor: 'var(--base-white)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '3.5rem', margin: '0 auto 1.5rem auto', boxShadow: 'var(--shadow-soft)' }}>
          🐰
        </div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--dark-brown)', marginBottom: '0.5rem' }}>{me?.name || me?.username || 'Super User'}</h2>
        <p style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '1.2rem', marginBottom: '2rem' }}>Role: Family Star 🌟</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--dark-brown)' }}>{me?.points || 0}</div>
            <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Points Earned</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--dark-brown)' }}>12</div>
            <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Tasks Done</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: 'var(--dark-brown)', fontWeight: 800, marginBottom: '1.5rem', fontSize: '1.5rem' }}>⚙️ Settings</h3>
        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--warm-brown)', fontWeight: 700 }}>Display Name</label>
            <input 
              type="text" 
              placeholder="Enter your cute name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '2px solid var(--sky-blue)', backgroundColor: 'var(--base-white)', fontWeight: 700 }}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Save Changes ✨</button>
        </form>
      </div>

      <button onClick={logout} className="btn" style={{ width: '100%', padding: '1.25rem', backgroundColor: '#ffcccc', color: 'var(--dark-brown)', fontSize: '1.2rem' }}>
        Log Out 🚪
      </button>

    </main>
  );
}
