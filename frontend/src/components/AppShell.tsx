"use client";

import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

/**
 * AppShell decides which wrapper to apply:
 *
 * /admin/*   → No navbar, no padding (AdminLayout handles everything internally)
 * /login     → No navbar, full-screen centered layout
 * everything else → Sticky Navbar on top + scrollable page body
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && user.role === 'PARENT' && !user.family && pathname !== '/family') {
      router.push('/family');
    }
  }, [user, loading, pathname, router]);

  const isAdmin = pathname?.startsWith("/admin");
  const isAuth  = pathname === "/login" || pathname === "/forgot-password";

  // Admin pages — return children directly. admin/layout.tsx handles its own full-screen layout.
  if (isAdmin) {
    return <>{children}</>;
  }

  // Auth pages (login / forgot-password) — full-screen, no navbar
  if (isAuth) {
    return (
      <div className="auth-shell">
        {children}
      </div>
    );
  }

  // All other user pages — sticky navbar + scrollable content area
  return (
    <div className="user-shell">
      <Navbar />
      <div className="user-content">
        {children}
      </div>
    </div>
  );
}
