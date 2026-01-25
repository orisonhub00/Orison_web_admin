"use client";

import Sidebar from "../../components/Sidebar/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-[#f7ebe7] flex">
      {/* Sidebar – stays SAME */}
      <div className="p-4">
        <Sidebar />
      </div>

      {/* Main content – CHANGES */}
      <main className="flex-1 px-6 py-5">
        {children}
      </main>
    </div>
  );
}
