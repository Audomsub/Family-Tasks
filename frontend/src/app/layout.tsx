import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import AppShell from "@/components/AppShell";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "FamilyTask — Family Task & Reward Platform",
  description: "Manage family tasks and rewards together, in a fun and kawaii way!",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={nunito.variable}>
      <body>
        <AuthProvider>
          <AppShell>{children}</AppShell>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: "#FFFFFF",
                color: "#5C3D21",
                border: "2px solid #FFEBF2",
                borderRadius: "20px",
                fontWeight: "700",
                fontFamily: "var(--font-nunito), Nunito, sans-serif",
                boxShadow: "0 8px 24px rgba(139,94,52,0.12)",
                padding: "12px 20px",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
