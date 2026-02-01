"use client";

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
  const pathname = usePathname();
  // Show Navbar only on public homepage (or other future public pages)
  const showNavbar = pathname === '/homepage';
  // Show Sidebar on non-homepage routes (admin area)
  const showSidebar = pathname !== '/homepage';

  return (
    <div className="flex flex-col min-h-screen">
      {showNavbar && <Navbar />}
      <div className="flex w-full bg-[#f7ebe7] flex-1">
        {/* Sidebar – Fixed and always visible */}
        {showSidebar && (
            <div className="h-screen sticky top-0">
              <Sidebar />
            </div>
        )}

        {/* Main content – changes based on route */}
        <main className={`flex-1 overflow-y-auto ${!showSidebar ? 'w-full' : ''}`}>
          {showSidebar && <Header />}
          <div className="px-6 py-5">
            {showSidebar && <Breadcrumbs />}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
