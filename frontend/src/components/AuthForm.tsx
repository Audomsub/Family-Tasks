"use client";

import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { UserCheck, Users } from 'lucide-react';

export default function AuthForm({ type, onSwitch }: { type: 'login' | 'register', onSwitch?: () => void }) {
  const [role, setRole] = useState<'PARENT' | 'CHILD'>('PARENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToast = toast.loading(type === 'login' ? 'Logging in...' : 'Creating your account... ✨');
    
    try {
      if (type === 'login') {
        const res = await api.post('/auth/login', { email, password });
        const token = typeof res === 'string' ? res : res.token;
        if (token) {
          toast.success('Welcome back! 🌸', { id: loadingToast });
          login(token);
        } else {
          throw new Error('No token received');
        }
      } else {
        // REGISTER
        if (role === 'PARENT') {
          await api.post('/auth/register', { fullName, email, password, familyName });
          toast.success('Registration successful! 🎉 Please Login.', { id: loadingToast });
          if (onSwitch) onSwitch();
        } else {
          // CHILD registration flow
          if (!inviteCode) throw new Error("Invite code is required for kids!");
          
          // 1. Register with temp family
          await api.post('/auth/register', { fullName, email, password, familyName: 'TempChildFam' });
          
          // 2. Login to get token
          const loginRes = await api.post('/auth/login', { email, password });
          const token = typeof loginRes === 'string' ? loginRes : loginRes.token;
          
          if (token) {
            login(token); // Sets local storage for api.ts
            
            // 3. Join real family
            // Need a tiny delay to ensure localStorage is set before next request
            await new Promise(resolve => setTimeout(resolve, 100));
            
            await api.post('/auth/join', { inviteCode });
            toast.success('Successfully joined family! 🎈', { id: loadingToast });
            // Redirect will happen naturally via AuthContext if token is set
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Action failed. Please try again.', { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-center text-3xl font-black text-[var(--dark-brown)] mb-8 tracking-tight">
        {type === 'login' ? 'Welcome Back 💖' : 'Create Account ✨'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {type === 'register' && (
          <div className="space-y-3 mb-6">
            <label className="block text-sm font-black text-[var(--dark-brown)] uppercase tracking-wider text-center">Who are you? 🤔</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`cursor-pointer rounded-[24px] border-4 p-4 flex flex-col items-center gap-2 transition-all duration-300 ${
                role === 'PARENT' 
                  ? 'border-[var(--sky-blue)] bg-[var(--sky-light)] shadow-sm' 
                  : 'border-[var(--bg-cream)] bg-white hover:border-[var(--sky-light)] hover:bg-[var(--bg-cream)]'
              }`}>
                <input type="radio" name="role" value="PARENT" checked={role === 'PARENT'} onChange={() => setRole('PARENT')} className="sr-only" />
                <div className={`p-3 rounded-full ${role === 'PARENT' ? 'bg-[var(--sky-blue)] text-white' : 'bg-[var(--bg-cream)] text-[var(--warm-brown)]'}`}>
                  <UserCheck size={24} strokeWidth={3} />
                </div>
                <div className={`font-black ${role === 'PARENT' ? 'text-[var(--dark-brown)]' : 'text-[var(--warm-brown)]'}`}>Parent</div>
              </label>

              <label className={`cursor-pointer rounded-[24px] border-4 p-4 flex flex-col items-center gap-2 transition-all duration-300 ${
                role === 'CHILD' 
                  ? 'border-[var(--baby-pink)] bg-[var(--pink-light)] shadow-sm' 
                  : 'border-[var(--bg-cream)] bg-white hover:border-[var(--pink-light)] hover:bg-[var(--bg-cream)]'
              }`}>
                <input type="radio" name="role" value="CHILD" checked={role === 'CHILD'} onChange={() => setRole('CHILD')} className="sr-only" />
                <div className={`p-3 rounded-full ${role === 'CHILD' ? 'bg-[var(--baby-pink)] text-white' : 'bg-[var(--bg-cream)] text-[var(--warm-brown)]'}`}>
                  <Users size={24} strokeWidth={3} />
                </div>
                <div className={`font-black ${role === 'CHILD' ? 'text-[var(--dark-brown)]' : 'text-[var(--warm-brown)]'}`}>Child</div>
              </label>
            </div>
          </div>
        )}

        {type === 'register' && (
          <div>
            <label className="block text-sm font-black text-[var(--dark-brown)] mb-2 uppercase tracking-wider">Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. Papa Bear"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-6 py-4 bg-[var(--bg-cream)] border-4 border-white rounded-[20px] focus:outline-none focus:border-[var(--sky-blue)] focus:bg-white shadow-inner transition-all duration-300 font-bold text-[var(--dark-brown)] placeholder-[var(--warm-brown)]/50"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-black text-[var(--dark-brown)] mb-2 uppercase tracking-wider">Email</label>
          <input 
            type="email" 
            placeholder="bear@family.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-4 bg-[var(--bg-cream)] border-4 border-white rounded-[20px] focus:outline-none focus:border-[var(--sky-blue)] focus:bg-white shadow-inner transition-all duration-300 font-bold text-[var(--dark-brown)] placeholder-[var(--warm-brown)]/50"
            required
          />
        </div>

        {type === 'register' && role === 'PARENT' && (
          <div className="animate-in fade-in duration-300">
            <label className="block text-sm font-black text-[var(--dark-brown)] mb-2 uppercase tracking-wider">Family Name</label>
            <input 
              type="text" 
              placeholder="e.g. The Super Bears"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              className="w-full px-6 py-4 bg-[var(--bg-cream)] border-4 border-white rounded-[20px] focus:outline-none focus:border-[var(--sky-blue)] focus:bg-white shadow-inner transition-all duration-300 font-bold text-[var(--dark-brown)] placeholder-[var(--warm-brown)]/50"
              required
            />
          </div>
        )}

        {type === 'register' && role === 'CHILD' && (
          <div className="animate-in fade-in duration-300">
            <label className="block text-sm font-black text-[var(--dark-brown)] mb-2 uppercase tracking-wider flex items-center gap-2">
              Invite Code <span className="bg-[var(--soft-yellow)] text-[var(--dark-brown)] px-2 py-0.5 rounded-full text-[10px]">(Ask Parent!)</span>
            </label>
            <input 
              type="text" 
              placeholder="e.g. FAM123"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              className="w-full px-6 py-4 bg-[var(--yellow-light)] border-4 border-white rounded-[20px] focus:outline-none focus:border-[var(--soft-yellow)] focus:bg-white shadow-inner transition-all duration-300 font-black text-[var(--dark-brown)] tracking-widest uppercase placeholder-[var(--warm-brown)]/40 text-center"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-black text-[var(--dark-brown)] mb-2 uppercase tracking-wider">Password</label>
          <input 
            type="password" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-6 py-4 bg-[var(--bg-cream)] border-4 border-white rounded-[20px] focus:outline-none focus:border-[var(--sky-blue)] focus:bg-white shadow-inner transition-all duration-300 font-bold text-[var(--dark-brown)] placeholder-[var(--warm-brown)]/50"
            required
          />
        </div>
        
        {type === 'login' && (
          <div className="text-right mt-2">
            <Link href="/forgot-password" className="text-[var(--sky-blue)] text-sm font-black hover:text-[#9CE0E0] transition-colors">Forgot Password?</Link>
          </div>
        )}

        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full flex justify-center items-center gap-2 py-4 rounded-[20px] font-black text-lg transition-all duration-300 border-4 border-white shadow-[0_8px_24px_rgba(181,234,234,0.4)] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(181,234,234,0.6)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${
          type === 'login' 
              ? 'bg-[var(--sky-blue)] text-[var(--dark-brown)] hover:bg-[#9CE0E0]' 
              : 'bg-[var(--baby-pink)] text-[var(--dark-brown)] hover:bg-[#FFC2D8] shadow-[0_8px_24px_rgba(255,212,229,0.4)] hover:shadow-[0_12px_32px_rgba(255,212,229,0.6)]'
          }`}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-4 border-white/40 border-t-white rounded-full animate-spin"></div>
          ) : (
            type === 'login' ? 'Let\'s Go! 🚀' : 'Join the Family! 🎈'
          )}
        </button>
      </form>
    </div>
  );
}
