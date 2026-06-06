"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/api";
import {
  ShieldCheck, Menu, X, Home, ClipboardList, Gift,
  Users, LogOut, Bell, ChevronDown, Star, Trophy, ShoppingCart, User, Check, BarChart3, Banknote
} from "lucide-react";
import { Task } from "@/types";

const BASE_NAV_LINKS = [
  { href: "/",            label: "Home",      icon: Home,           show: 'ALL' },
  { href: "/tasks",       label: "Quests",    icon: ClipboardList,  show: 'ALL' },
  { href: "/rewards",     label: "Shop",      icon: Gift,           show: 'ALL' },
  { href: "/leaderboard", label: "Rankings",  icon: Trophy,         show: 'ALL' },
  { href: "/groceries",   label: "Groceries", icon: ShoppingCart,   show: 'ALL' },
  { href: "/family",      label: "Family",    icon: Users,          show: 'ALL' },
  { href: "/analytics",   label: "Analytics", icon: BarChart3,      show: 'PARENT' },
  { href: "/allowance",   label: "Allowance", icon: Banknote,       show: 'PARENT' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [bellOpen,     setBellOpen]     = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const bellRef     = useRef<HTMLDivElement>(null);

  // Fetch tasks for notifications
  const { data: tasks } = useSWR<Task[]>(user ? '/task' : null, fetcher, { refreshInterval: 30000 });

  // Notification logic
  const isParent = user?.role === "PARENT";
  const isAdmin  = user?.role === "SUPER_ADMIN";

  const NAV_LINKS = BASE_NAV_LINKS.filter(link => link.show === 'ALL' || (link.show === 'PARENT' && isParent));

  // PARENT: tasks waiting for approval (SUBMITTED)
  // CHILD:  tasks assigned to them that are PENDING
  const notifications = isParent
    ? (tasks?.filter(t => t.status === 'SUBMITTED') ?? [])
    : (tasks?.filter(t => t.status === 'PENDING' && t.assigneeName && t.assigneeName !== 'งานกองกลาง') ?? []);

  const notifCount = notifications.length;

  // Close overlays on route change
  useEffect(() => { setMobileOpen(false); setDropdownOpen(false); setBellOpen(false); }, [pathname]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
      if (bellRef.current && !bellRef.current.contains(e.target as Node))
        setBellOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const avatar = isAdmin ? "👑" : isParent ? "🐻" : "🐰";
  const role   = isAdmin ? "Super Admin" : isParent ? "Parent" : "Child";
  const points = user?.totalPoints ?? 0;

  return (
    <>
      {/* ═══════════════════════════════════
          TOP BAR
      ═══════════════════════════════════ */}
      <header className="navbar-bar">
        <div className="navbar-inner">

          {/* Logo */}
          <Link href="/" className="navbar-logo">
            <span className="navbar-logo-icon">🏠</span>
            <span className="navbar-logo-text">FamilyTask</span>
          </Link>

          {/* Desktop Links */}
          <nav className="navbar-links">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href}
                  className={`navbar-link ${active ? "navbar-link--active" : ""}`}
                >
                  <Icon size={16} strokeWidth={active ? 2.5 : 2} />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right controls */}
          <div className="navbar-right">

            {/* Admin pill */}
            {isAdmin && (
              <Link href="/admin" className="admin-pill">
                <ShieldCheck size={14} strokeWidth={2.5} />
                Admin
              </Link>
            )}

            {/* Stars & Level & Streaks (non-admin) */}
            {!isAdmin && (
              <div className="flex items-center gap-2">
                {user?.currentStreak > 0 && (
                  <div className="stars-pill" style={{ background: '#FFE5E5', color: '#D14D4D', borderColor: '#FFA8A8' }}>
                    🔥 {user.currentStreak}
                  </div>
                )}
                <div className="stars-pill" style={{ background: '#E0F2FE', color: '#0284C7', borderColor: '#BAE6FD' }}>
                  Lv.{user?.level || 1}
                </div>
                <div className="stars-pill">
                  <Star size={13} strokeWidth={3} /> {points}
                </div>
              </div>
            )}

            {/* ── Bell Notification ── */}
            <div className="relative" ref={bellRef}>
              <button
                className="icon-btn"
                aria-label="Notifications"
                onClick={() => setBellOpen(!bellOpen)}
              >
                <Bell size={18} strokeWidth={2} />
                {notifCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white"
                    style={{ background: '#FF6B9E', color: 'white' }}
                  >
                    {notifCount > 9 ? '9+' : notifCount}
                  </span>
                )}
              </button>

              {/* Bell Dropdown */}
              {bellOpen && (
                <div
                  className="absolute right-0 top-full mt-3 w-80 rounded-[20px] border-2 border-white shadow-xl z-[250] overflow-hidden scale-in"
                  style={{ background: 'var(--base-white)' }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b-2"
                    style={{ borderColor: 'var(--bg-cream)' }}>
                    <h4 className="font-black" style={{ color: 'var(--dark-brown)' }}>
                      🔔 Notifications
                    </h4>
                    <span className="text-xs font-black px-2 py-1 rounded-full"
                      style={{ background: notifCount > 0 ? 'var(--pink-light)' : 'var(--bg-cream)', color: notifCount > 0 ? '#FF6B9E' : 'var(--warm-brown)' }}>
                      {notifCount} new
                    </span>
                  </div>

                  {/* Notification list */}
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center py-8 px-5 text-center">
                        <span className="text-3xl mb-2">🎉</span>
                        <p className="font-bold text-sm" style={{ color: 'var(--warm-brown)' }}>
                          {isParent ? "No tasks waiting for review!" : "No active tasks right now!"}
                        </p>
                      </div>
                    ) : (
                      notifications.map((task) => (
                        <button
                          key={task.id}
                          onClick={() => { router.push('/tasks'); setBellOpen(false); }}
                          className="w-full flex items-start gap-3 px-5 py-4 border-b text-left transition-colors hover:bg-[var(--bg-cream)]"
                          style={{ borderColor: 'var(--bg-cream)' }}
                        >
                          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 border-white"
                            style={{ background: isParent ? 'var(--sky-light)' : 'var(--yellow-light)' }}>
                            {isParent ? <Check size={16} strokeWidth={3} style={{ color: 'var(--sky-blue)' }} />
                              : <ClipboardList size={16} strokeWidth={2.5} style={{ color: '#D4AF37' }} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-sm truncate" style={{ color: 'var(--dark-brown)' }}>
                              {task.title}
                            </p>
                            <p className="text-xs font-bold mt-0.5" style={{ color: 'var(--warm-brown)' }}>
                              {isParent ? '👀 Waiting for your approval' : '⏳ Active quest — tap to view'}
                            </p>
                            {task.points && (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full mt-1 inline-block"
                                style={{ background: 'var(--soft-yellow)', color: '#D4AF37' }}>
                                ⭐ {task.points} pts
                              </span>
                            )}
                          </div>
                        </button>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="px-5 py-3 border-t-2" style={{ borderColor: 'var(--bg-cream)' }}>
                      <button
                        onClick={() => { router.push('/tasks'); setBellOpen(false); }}
                        className="w-full py-2.5 rounded-[14px] font-black text-sm transition-all hover:-translate-y-0.5"
                        style={{ background: 'var(--sky-light)', color: 'var(--sky-blue)' }}
                      >
                        View All Tasks →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Avatar Dropdown */}
            <div className="avatar-wrap" ref={dropdownRef}>
              <button className="avatar-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <span className="avatar-emoji">{avatar}</span>
                <span className="avatar-name">{user?.fullName?.split(" ")[0]}</span>
                <ChevronDown size={13} className={`avatar-chevron ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="dropdown scale-in">
                  <div className="dropdown-header">
                    <span className="dropdown-avatar">{avatar}</span>
                    <div>
                      <p className="dropdown-name">{user?.fullName}</p>
                      <p className="dropdown-role">Lv.{user?.level || 1} • {role}</p>
                    </div>
                  </div>
                  {!isAdmin && (
                    <div className="dropdown-points flex gap-3 text-sm">
                      <span style={{ color: '#D4AF37' }}><Star size={12} className="inline mb-0.5" strokeWidth={3} /> {points}</span>
                      {user?.currentStreak > 0 && <span style={{ color: '#D14D4D' }}>🔥 {user.currentStreak}</span>}
                    </div>
                  )}
                  {isAdmin && (
                    <Link href="/admin" className="dropdown-admin-link">
                      <ShieldCheck size={12} /> Admin Panel
                    </Link>
                  )}
                  <div className="dropdown-divider" />
                  <Link href="/profile"   className="dropdown-item"><User size={15}/> My Profile</Link>
                  <Link href="/family"    className="dropdown-item"><Users size={15}/> My Family</Link>
                  <Link href="/tasks"     className="dropdown-item"><ClipboardList size={15}/> My Quests</Link>
                  <Link href="/rewards"   className="dropdown-item"><Gift size={15}/> Reward Shop</Link>
                  <Link href="/groceries" className="dropdown-item"><ShoppingCart size={15}/> Groceries</Link>
                  <div className="dropdown-divider" />
                  <button onClick={logout} className="dropdown-logout">
                    <LogOut size={15}/> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Hamburger (mobile only) */}
            <button className="hamburger-btn" onClick={() => setMobileOpen(true)} aria-label="Menu">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════
          MOBILE BOTTOM SHEET
      ═══════════════════════════════════ */}
      {mobileOpen && (
        <>
          <div className="sheet-backdrop fade-in" onClick={() => setMobileOpen(false)} />
          <div className="sheet slide-in-up">
            <div className="sheet-handle" />

            {/* Profile */}
            <div className="sheet-profile">
              <span className="sheet-avatar">{avatar}</span>
              <div>
                <p className="sheet-name">{user?.fullName}</p>
                <p className="sheet-role">Lv.{user?.level || 1} • {role}</p>
              </div>
              {!isAdmin && (
                <div className="sheet-points flex gap-3">
                  <span style={{ color: '#D4AF37' }}><Star size={13} strokeWidth={3} className="inline mb-0.5" /> {points}</span>
                  {user?.currentStreak > 0 && <span style={{ color: '#D14D4D' }}>🔥 {user.currentStreak}</span>}
                </div>
              )}
            </div>

            {/* Notification summary for mobile */}
            {notifCount > 0 && (
              <button
                onClick={() => { router.push('/tasks'); setMobileOpen(false); }}
                className="mx-4 mb-3 w-[calc(100%-2rem)] flex items-center gap-3 p-4 rounded-[18px] border-2 border-white text-left transition-all"
                style={{ background: 'var(--pink-light)' }}
              >
                <Bell size={18} style={{ color: '#FF6B9E' }} strokeWidth={2.5} />
                <div>
                  <p className="font-black text-sm" style={{ color: 'var(--dark-brown)' }}>
                    {notifCount} task{notifCount !== 1 ? 's' : ''} need{notifCount === 1 ? 's' : ''} attention!
                  </p>
                  <p className="text-xs font-bold" style={{ color: 'var(--warm-brown)' }}>
                    {isParent ? 'Tap to approve' : 'Tap to view quests'}
                  </p>
                </div>
              </button>
            )}

            {/* Nav grid */}
            <div className="sheet-grid">
              {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                  className={`sheet-link ${pathname === href ? "sheet-link--active" : ""}`}
                >
                  <Icon size={22} strokeWidth={2} />
                  {label}
                </Link>
              ))}
            </div>

            {isAdmin && (
              <Link href="/admin" onClick={() => setMobileOpen(false)} className="sheet-admin">
                <ShieldCheck size={20} /> Admin Panel
              </Link>
            )}

            <button onClick={() => { logout(); setMobileOpen(false); }} className="sheet-logout">
              <LogOut size={20} /> Sign Out
            </button>
          </div>
        </>
      )}
    </>
  );
}
