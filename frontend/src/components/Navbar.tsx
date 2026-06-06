"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  ShieldCheck, Menu, X, Home, ClipboardList, Gift,
  Users, LogOut, Bell, ChevronDown, Star
} from "lucide-react";

const NAV_LINKS = [
  { href: "/",        label: "Home",    icon: Home },
  { href: "/tasks",   label: "Quests",  icon: ClipboardList },
  { href: "/rewards", label: "Shop",    icon: Gift },
  { href: "/family",  label: "Family",  icon: Users },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close overlays on route change
  useEffect(() => { setMobileOpen(false); setDropdownOpen(false); }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isAdmin  = user?.role === "SUPER_ADMIN";
  const isParent = user?.role === "PARENT";
  const avatar   = isAdmin ? "👑" : isParent ? "🐻" : "🐰";
  const role     = isAdmin ? "Super Admin" : isParent ? "Parent" : "Child";
  const points   = user?.totalPoints ?? 0;

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

            {/* Stars (non-admin) */}
            {!isAdmin && (
              <div className="stars-pill">
                <Star size={13} strokeWidth={3} /> {points}
              </div>
            )}

            {/* Bell */}
            <button className="icon-btn" aria-label="Notifications">
              <Bell size={18} strokeWidth={2} />
              <span className="bell-dot" />
            </button>

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
                      <p className="dropdown-role">{role}</p>
                    </div>
                  </div>
                  {!isAdmin && (
                    <div className="dropdown-points">
                      <Star size={12} strokeWidth={3} /> {points} Stars
                    </div>
                  )}
                  {isAdmin && (
                    <Link href="/admin" className="dropdown-admin-link">
                      <ShieldCheck size={12} /> Admin Panel
                    </Link>
                  )}
                  <div className="dropdown-divider" />
                  <Link href="/family"  className="dropdown-item"><Users size={15}/> My Family</Link>
                  <Link href="/tasks"   className="dropdown-item"><ClipboardList size={15}/> My Quests</Link>
                  <Link href="/rewards" className="dropdown-item"><Gift size={15}/> Reward Shop</Link>
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
                <p className="sheet-role">{role}</p>
              </div>
              {!isAdmin && (
                <div className="sheet-points">
                  <Star size={13} strokeWidth={3} /> {points}
                </div>
              )}
            </div>

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
