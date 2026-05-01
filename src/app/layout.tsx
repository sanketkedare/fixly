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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen text-gray-900`}>
        <AuthProvider>
          <LocationProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex-grow flex flex-col min-h-screen">
                <QueryProvider>
                  <main className="flex-grow w-full bg-white md:bg-transparent relative overflow-x-hidden">
                    {children}
                  </main>
                </QueryProvider>
              </div>
            </div>
          </LocationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
