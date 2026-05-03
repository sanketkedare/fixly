import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import Sidebar from "@/components/layout/Sidebar";
import { AuthProvider } from "@/context/AuthContext";
import { LocationProvider } from "@/context/LocationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fixly - All Services, One App",
  description: "Reliable services right at your doorstep",
};

import { StoreProvider } from "@/store/Provider";
import Toaster from "@/components/ui/Toaster";
import ConfirmModal from "@/components/ui/ConfirmModal";
import AuthGate from "@/components/providers/AuthGate";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen text-gray-900`}>
        <StoreProvider>
          <AuthProvider>
            <AuthGate>
              <LocationProvider>
                <div className="flex min-h-screen">
                  <Sidebar />
                  <div className="flex-grow flex flex-col min-h-screen">
                    <QueryProvider>
                      <main className="flex-grow w-full bg-white md:bg-transparent relative overflow-x-hidden">
                        {children}
                      </main>
                      <Toaster />
                      <ConfirmModal />
                    </QueryProvider>
                  </div>
                </div>
              </LocationProvider>
            </AuthGate>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
