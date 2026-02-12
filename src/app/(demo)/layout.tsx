"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import Header from "./components/Header/Header";
import Breadcrumbs from "./components/Breadcrumbs/Breadcrumbs";
import { usePathname } from "next/navigation";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  // Show Navbar only on public homepage (or other future public pages)
  const showNavbar = pathname === '/homepage';
  // Show Sidebar on non-homepage routes (admin area)
  const showSidebar = pathname !== '/homepage';

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {showNavbar && <Navbar />}
      <div className="flex w-full bg-[#f7ebe7] flex-1 overflow-hidden">
        {/* Sidebar – Fixed and always visible */}
        {showSidebar && (
            <div className="h-screen sticky top-0 z-50">
              <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
            </div>
        )}

        {/* Main content – changes based on route */}
        <main className={`flex-1 overflow-y-auto ${!showSidebar ? 'w-full' : ''}`}>
          {showSidebar && (
            <div className="sticky top-0 z-40 bg-[#f7ebe7]">
              <Header onMenuClick={() => setMobileOpen(true)} />
              <div className="px-6 pt-5 pb-2">
                <Breadcrumbs />
              </div>
            </div>
          )}
          <div className="px-6 pb-5">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
