"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Send, Megaphone, Users, UserCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminAnnouncementsPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("ALL");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    try {
      await api.post("/admin/broadcast", { title, message, targetRole: target });
      toast.success(
        <div className="flex items-center gap-2">
          <Megaphone className="text-[var(--sky-blue)]" size={16} />
          <span>Announcement sent to families! 📢</span>
        </div>
      );
      setTitle("");
      setMessage("");
    } catch {
      toast.error("Failed to send announcement");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* ── Kawaii Header ── */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white text-[var(--sky-blue)] rounded-[20px] shadow-sm border-4 border-[var(--sky-light)] transform rotate-3">
          <Megaphone size={32} strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-black text-[var(--dark-brown)] tracking-tight">System Broadcast 📢</h1>
        <p className="text-sm text-[var(--warm-brown)] font-bold max-w-lg mx-auto">
          Send a cute message or important update to all our lovely families!
        </p>
      </div>

      <div className="bg-white rounded-[32px] border-4 border-[var(--pink-light)] shadow-sm">
        <div className="p-8">
          <form onSubmit={handleSend} className="space-y-8">
            
            {/* ── Target Selection ── */}
            <div className="space-y-4">
              <label className="block text-xs font-black text-[var(--dark-brown)] uppercase tracking-wider">Select Audience 🎯</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <label className={`cursor-pointer rounded-[20px] border-4 p-4 flex flex-col items-center gap-3 transition-all ${
                  target === 'ALL' 
                    ? 'border-[var(--sky-blue)] bg-[var(--sky-light)] shadow-sm' 
                    : 'border-[var(--bg-cream)] bg-white hover:border-[var(--sky-light)]'
                }`}>
                  <input type="radio" name="target" value="ALL" checked={target === 'ALL'} onChange={(e) => setTarget(e.target.value)} className="sr-only" />
                  <div className={`w-12 h-12 flex items-center justify-center rounded-[14px] shadow-sm ${target === 'ALL' ? 'bg-[var(--sky-blue)] text-white' : 'bg-[var(--bg-cream)] text-[var(--warm-brown)]'}`}>
                    <Users size={20} strokeWidth={2.5} />
                  </div>
                  <div className="text-center">
                    <div className={`text-sm font-black ${target === 'ALL' ? 'text-[var(--dark-brown)]' : 'text-[var(--warm-brown)]'}`}>Everyone</div>
                    <div className="text-[10px] text-[var(--warm-brown)] mt-0.5 font-bold uppercase tracking-wider">All Users</div>
                  </div>
                </label>

                <label className={`cursor-pointer rounded-[20px] border-4 p-4 flex flex-col items-center gap-3 transition-all ${
                  target === 'PARENT' 
                    ? 'border-[var(--sky-blue)] bg-[var(--sky-light)] shadow-sm' 
                    : 'border-[var(--bg-cream)] bg-white hover:border-[var(--sky-light)]'
                }`}>
                  <input type="radio" name="target" value="PARENT" checked={target === 'PARENT'} onChange={(e) => setTarget(e.target.value)} className="sr-only" />
                  <div className={`w-12 h-12 flex items-center justify-center rounded-[14px] shadow-sm ${target === 'PARENT' ? 'bg-[var(--sky-blue)] text-white' : 'bg-[var(--bg-cream)] text-[var(--warm-brown)]'}`}>
                    <UserCheck size={20} strokeWidth={2.5} />
                  </div>
                  <div className="text-center">
                    <div className={`text-sm font-black ${target === 'PARENT' ? 'text-[var(--dark-brown)]' : 'text-[var(--warm-brown)]'}`}>Parents Only</div>
                    <div className="text-[10px] text-[var(--warm-brown)] mt-0.5 font-bold uppercase tracking-wider">Admins</div>
                  </div>
                </label>

                <label className={`cursor-pointer rounded-[20px] border-4 p-4 flex flex-col items-center gap-3 transition-all ${
                  target === 'CHILD' 
                    ? 'border-[var(--sky-blue)] bg-[var(--sky-light)] shadow-sm' 
                    : 'border-[var(--bg-cream)] bg-white hover:border-[var(--sky-light)]'
                }`}>
                  <input type="radio" name="target" value="CHILD" checked={target === 'CHILD'} onChange={(e) => setTarget(e.target.value)} className="sr-only" />
                  <div className={`w-12 h-12 flex items-center justify-center rounded-[14px] shadow-sm ${target === 'CHILD' ? 'bg-[var(--sky-blue)] text-white' : 'bg-[var(--bg-cream)] text-[var(--warm-brown)]'}`}>
                    <Users size={20} strokeWidth={2.5} />
                  </div>
                  <div className="text-center">
                    <div className={`text-sm font-black ${target === 'CHILD' ? 'text-[var(--dark-brown)]' : 'text-[var(--warm-brown)]'}`}>Children Only</div>
                    <div className="text-[10px] text-[var(--warm-brown)] mt-0.5 font-bold uppercase tracking-wider">Kids</div>
                  </div>
                </label>

              </div>
            </div>

            {/* ── Input Fields ── */}
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-black text-[var(--dark-brown)] mb-2 uppercase tracking-wider">Message Title 📝</label>
                <input
                  type="text"
                  required
                  className="w-full px-5 py-3.5 bg-[var(--bg-cream)] border-4 border-white rounded-[20px] focus:outline-none focus:border-[var(--sky-blue)] focus:bg-white shadow-inner transition-all font-bold text-[var(--dark-brown)] text-sm"
                  placeholder="e.g., Weekend Challenge is Here!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[var(--dark-brown)] mb-2 uppercase tracking-wider">Message Body 💌</label>
                <textarea
                  required
                  rows={5}
                  className="w-full px-5 py-3.5 bg-[var(--bg-cream)] border-4 border-white rounded-[20px] focus:outline-none focus:border-[var(--sky-blue)] focus:bg-white shadow-inner transition-all font-bold text-[var(--dark-brown)] text-sm resize-none"
                  placeholder="Type your lovely message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* ── Submit Button ── */}
            <div className="pt-6 border-t-2 border-[var(--bg-cream)] flex justify-end">
              <button
                type="submit"
                disabled={isSending || !title || !message}
                className="flex items-center gap-2 px-8 py-3.5 bg-[var(--sky-blue)] text-[var(--dark-brown)] font-black rounded-full shadow-[0_4px_12px_rgba(181,234,234,0.4)] hover:bg-[#9CE0E0] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-4 border-white"
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-4 border-white/40 border-t-[var(--dark-brown)] rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} strokeWidth={3} />
                    Send Announcement
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
