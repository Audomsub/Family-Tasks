"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users, Home, LayoutDashboard, Megaphone, BarChart3, LogOut,
  ClipboardList, Gift, Sparkles, Smile, Menu, X, ChevronLeft, ChevronRight
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Dashboard",     href: "/admin",                icon: LayoutDashboard },
  { name: "Users",         href: "/admin/users",          icon: Users },
  { name: "Families",      href: "/admin/families",       icon: Home },
  { name: "Tasks",         href: "/admin/tasks",          icon: ClipboardList },
  { name: "Rewards",       href: "/admin/rewards",        icon: Gift },
  { name: "Analytics",     href: "/admin/analytics",      icon: BarChart3 },
  { name: "Announcements", href: "/admin/announcements",  icon: Megaphone },
];

function SidebarBody({
  collapsed,
  mobile = false,
  user,
  logout,
  pathname,
}: {
  collapsed: boolean;
  mobile?: boolean;
  user: any;
  logout: () => void;
  pathname: string;
}) {
  const iconOnly = collapsed && !mobile;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo */}
      <div style={{
        padding: "20px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        borderBottom: "2px solid var(--pink-light)",
        justifyContent: iconOnly ? "center" : "flex-start",
      }}>
        <div style={{
          background: "var(--pink-light)",
          color: "var(--warm-brown)",
          padding: "8px",
          borderRadius: 16,
          border: "1px solid var(--baby-pink)",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Sparkles size={22} />
        </div>
        {!iconOnly && (
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontWeight: 900, fontSize: "1.1rem", color: "var(--dark-brown)", whiteSpace: "nowrap" }}>FamilyAdmin</div>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--warm-brown)", textTransform: "uppercase", letterSpacing: "0.8px" }}>Kawaii Control</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto", overflowX: "hidden" }} className="scrollbar-hide">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} title={iconOnly ? item.name : undefined}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: iconOnly ? 0 : 12,
                justifyContent: iconOnly ? "center" : "flex-start",
                padding: iconOnly ? "12px" : "12px 16px",
                borderRadius: 18,
                marginBottom: 4,
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
                border: "2px solid",
                borderColor: active ? "var(--baby-pink)" : "transparent",
                background: active ? "var(--pink-light)" : "transparent",
                color: active ? "var(--dark-brown)" : "var(--warm-brown)",
                transition: "all 0.15s ease",
              }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = "var(--sky-light)"; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
              >
                <item.icon size={20} style={{ flexShrink: 0, opacity: active ? 1 : 0.6 }} strokeWidth={active ? 2.5 : 2} />
                {!iconOnly && <span style={{ whiteSpace: "nowrap" }}>{item.name}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: "12px 8px", borderTop: "2px solid var(--pink-light)" }}>
        {!iconOnly && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "var(--bg-cream)",
            borderRadius: 16,
            padding: "10px 12px",
            marginBottom: 8,
            border: "2px solid var(--base-white)",
          }}>
            <div style={{
              width: 36, height: 36,
              background: "var(--baby-pink)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Smile size={18} strokeWidth={2.5} style={{ color: "var(--dark-brown)" }} />
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontWeight: 900, fontSize: "0.85rem", color: "var(--dark-brown)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.fullName}
              </div>
              <span style={{
                display: "inline-block",
                background: "var(--soft-yellow)",
                color: "var(--dark-brown)",
                padding: "1px 8px",
                borderRadius: 99,
                fontSize: "10px",
                fontWeight: 800,
                marginTop: 2,
              }}>Super Admin</span>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          title={iconOnly ? "Logout" : undefined}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: iconOnly ? "center" : "flex-start",
            gap: 8,
            width: "100%",
            padding: iconOnly ? "10px" : "10px 16px",
            borderRadius: 16,
            background: "none",
            border: "2px solid transparent",
            color: "var(--warm-brown)",
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: "pointer",
            transition: "all 0.15s ease",
            fontFamily: "inherit",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "#FFE5E5";
            (e.currentTarget as HTMLButtonElement).style.color = "#D14D4D";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#FFB3B3";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "none";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--warm-brown)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
          }}
        >
          <LogOut size={18} strokeWidth={2.5} style={{ flexShrink: 0 }} />
          {!iconOnly && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login");
      else if (user.role !== "SUPER_ADMIN") router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "SUPER_ADMIN") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-cream)" }}>
        <div className="spinner" />
      </div>
    );
  }

  const pageTitle = pathname.split("/").filter(Boolean).pop() ?? "dashboard";
  const readablePage = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);

  return (
    <div className="admin-shell">

      {/* ── Mobile drawer backdrop ── */}
      {drawerOpen && (
        <div
          className="admin-backdrop fade-in"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <div className={`admin-drawer ${drawerOpen ? "is-open" : ""}`} style={{ zIndex: 301 }}>
        <button
          onClick={() => setDrawerOpen(false)}
          style={{
            position: "absolute", top: 16, right: 16,
            background: "var(--bg-cream)", border: "2px solid var(--base-white)",
            borderRadius: 12, width: 32, height: 32,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "var(--warm-brown)", zIndex: 1,
          }}
        >
          <X size={18} />
        </button>
        <SidebarBody collapsed={false} mobile user={user} logout={logout} pathname={pathname} />
      </div>

      {/* ── Desktop sidebar (wrapper needed so collapse btn escapes overflow:hidden) ── */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <aside className={`admin-sidebar ${collapsed ? "is-collapsed" : ""}`}>
          <SidebarBody collapsed={collapsed} user={user} logout={logout} pathname={pathname} />
        </aside>
        {/* Collapse toggle — outside aside so overflow:hidden doesn't clip it */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            position: "absolute", top: 72, right: -16,
            width: 32, height: 32,
            background: "var(--base-white)",
            border: "2px solid var(--pink-light)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            color: "var(--warm-brown)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            zIndex: 10,
            transition: "background 0.15s",
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = "var(--pink-light)")}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "var(--base-white)")}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* ── Main area ── */}
      <main className="admin-main">

        {/* Topbar */}
        <header className="admin-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="hamburger-btn"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--sky-blue)" }} />
              <h2 style={{ fontWeight: 900, fontSize: "1.1rem", color: "var(--dark-brown)", textTransform: "capitalize" }}>
                {readablePage}
              </h2>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Admin mode badge */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "var(--soft-yellow)",
              color: "var(--dark-brown)",
              padding: "5px 12px",
              borderRadius: 99,
              fontSize: "0.75rem",
              fontWeight: 900,
              border: "2px solid var(--base-white)",
              boxShadow: "var(--shadow-sm)",
            }}>
              <Sparkles size={12} /> Admin Mode
            </div>
            {/* Avatar */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ textAlign: "right", display: "none" }} className="admin-name-block">
                <div style={{ fontWeight: 900, fontSize: "0.9rem", color: "var(--dark-brown)" }}>{user.fullName}</div>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--warm-brown)" }}>Super Admin</div>
              </div>
              <div style={{
                width: 40, height: 40,
                background: "var(--baby-pink)",
                borderRadius: 14,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid var(--base-white)",
                boxShadow: "var(--shadow-sm)",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
                onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.transform = "rotate(6deg)")}
                onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.transform = "rotate(0deg)")}
              >
                <Smile size={20} strokeWidth={2.5} style={{ color: "var(--dark-brown)" }} />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable page content */}
        <div className="admin-content">
          {/* Ambient background blobs */}
          <div style={{
            position: "absolute", top: 0, left: 0,
            width: 320, height: 320,
            background: "var(--sky-light)",
            borderRadius: "50%",
            mixBlendMode: "multiply",
            filter: "blur(64px)",
            opacity: 0.5,
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: 40, right: 40,
            width: 400, height: 400,
            background: "var(--pink-light)",
            borderRadius: "50%",
            mixBlendMode: "multiply",
            filter: "blur(72px)",
            opacity: 0.4,
            pointerEvents: "none",
          }} />

          <div className="admin-content-inner">
            {children}
          </div>
        </div>
      </main>

      <style>{`
        @media (min-width: 768px) {
          .admin-name-block { display: block !important; }
        }
      `}</style>
    </div>
  );
}
