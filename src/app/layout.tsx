"use client";

import { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "@/layout/Header";
import Sidebar from "@/layout/Sidebar";
import Footer from "@/layout/Footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen">
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
          <div className="flex flex-col flex-1">
            <Header brandName="MyApp" onBrandClick={toggleSidebar} />
            <main className="flex-1 p-6 bg-gray-50">{children}</main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
