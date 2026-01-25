"use client";

import { useState } from "react";
import Sidebar from "../../src/components/Sidebar/Sidebar";
import { ContentType } from "@/types/content";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Track which content is active
  const [activeContent, setActiveContent] = useState<ContentType>("dashboard");

  return (
    <div className="min-h-screen w-full bg-[#f7ebe7] flex">
      {/* Sidebar – stays SAME */}
      <div className="p-4">
        <Sidebar
          activeContent={activeContent}
          onContentChange={(content: ContentType) => setActiveContent(content)}
        />
      </div>

      {/* Main content – CHANGES */}
      <main className="flex-1 px-6 py-5">
        {children}
      </main>
    </div>
  );
}
