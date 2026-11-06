import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { OfflineDetector } from "@/components/OfflineDetector";
import { MobileSimulator } from "@/components/MobileSimulator";

export const metadata: Metadata = {
  title: "FindBack — Campus Lost & Found",
  description: "A simpler way to reconnect lost belongings with their owners on campus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans bg-atmospheric text-findback-text antialiased">
        <AuthProvider>
          <OfflineDetector />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <BottomNav />
          <MobileSimulator />
        </AuthProvider>
      </body>
    </html>
  );
}
