"use client";
import { ReactNode } from "react";
import AnimatedNumber from "./AnimatedNumber";

interface StatCardProps {
  title: number;
  subtitle: string;
  icon: ReactNode;
}

export default function StatCard({ title, subtitle, icon }: StatCardProps) {
  return (
    <div
      className="
        bg-white rounded-2xl p-4 border
        flex items-center justify-between

        transition-all duration-300 ease-out
        hover:shadow-xl hover:-translate-y-1
        active:scale-[0.97]
        cursor-pointer
      "
    >
      {/* Left Content */}
      <div>
        <h3 className="text-2xl font-bold text-black">
          <AnimatedNumber value={title} />
        </h3>

        <div className="flex items-center gap-2 mt-1 text-gray-500">
          {icon}
          <p className="text-sm">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
