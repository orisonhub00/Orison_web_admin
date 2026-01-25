"use client";

import { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Users,
  ClipboardList,
  BookOpen,
  LayoutGrid,
  CalendarDays,
  Building2,
  FileText,
  PenTool,
  Bus,
  UtensilsCrossed,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import logo from "../../../public/logo.png";
import { ContentType } from "@/types/content";


interface SidebarProps {
  onContentChange: (content: ContentType) => void;
  activeContent: ContentType;
}

export default function Sidebar({ onContentChange, activeContent }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [studentsOpen, setStudentsOpen] = useState(false);
  const [classesOpen, setClassesOpen] = useState(false);


  return (
    <aside
      className={`relative h-screen transition-all duration-300 flex flex-col
      ${sidebarOpen ? "w-[260px]" : "w-[72px]"}
      bg-white border-r border-border`}
    >
      {/* Logo Area (always white) */}
      <div className="flex items-center justify-center h-[90px] bg-white border-b border-border">
        {sidebarOpen ? (
          <Image
            src={logo}
            alt="Logo"
            className="h-12 w-auto object-contain"   // ⬅️ little bigger logo
            priority
          />
        ) : (
          <div className="h-11 w-11 rounded-2xl bg-primary flex items-center justify-center shadow">
            <span className="text-white font-bold text-lg">▣</span>
          </div>
        )}
      </div>

      {/* Toggle Arrow */}
      <button
        onClick={() => {
          setSidebarOpen(!sidebarOpen);
          setStudentsOpen(false);
        }}
        className="absolute top-1/2 -right-4 -translate-y-1/2 z-50
                   h-8 w-8 rounded-full bg-white border border-border shadow
                   flex items-center justify-center hover:opacity-90"
      >
        {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* MENU AREA */}
      <div
        className={`flex-1 transition-all duration-300 px-3  py-5 space-y-3
        ${sidebarOpen
          ? "bg-primary pr-4"     // 🟠 only when open
          : "bg-white pr-2"}                   // ⚪ normal when closed
        `}
      >
          {/* Dashboard Item */}
        <SidebarItem 
          icon={<LayoutGrid size={18} />} 
          label="Dashboard" 
          open={sidebarOpen}
          active={activeContent === "dashboard"}
          onClick={() => onContentChange("dashboard")
          }
          
        />
        {/* Students Dropdown Card */}
        <div
          className={`w-full rounded-2xl  shadow transition
          ${sidebarOpen ? "bg-[#fde8df]" : "bg-transparent shadow-none p-0"}
        `}
        >
          <button
            onClick={() => sidebarOpen && setStudentsOpen(!studentsOpen)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition
            ${sidebarOpen ? "hover:bg-white/40" : "justify-center hover:bg-muted"}
          `}
          >
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <GraduationCap size={16} className="text-primary" />
            </div>

            {sidebarOpen && (
              <>
                <span className="text-sm font-semibold text-[#8b3a16] flex-1 text-left">
                  Students
                </span>
                <ChevronDown
                  size={16}
                  className={`transition ${studentsOpen ? "rotate-180" : ""}`}
                />
              </>
            )}
          </button>

          {/* Dropdown */}
            {sidebarOpen && studentsOpen && (
            <div className="mt-3 space-y-2">
                <button
                onClick={() => {
                  onContentChange("add-student");
                  setStudentsOpen(true);
                }}
                className={`block w-full text-left text-sm px-4 py-2 rounded-xl transition text-[#8b3a16] ${
                  activeContent === "add-student"
                    ? "bg-white shadow"
                    : "hover:bg-white/50"
                }`}
                >
                Add Student
                </button>

                <button
                onClick={() => {
                  onContentChange("view-students");
                  setStudentsOpen(true);
                }}
                className={`block w-full text-left text-sm px-4 py-2 rounded-xl transition text-[#8b3a16] ${
                  activeContent === "view-students"
                    ? "bg-white shadow"
                    : "hover:bg-white/50"
                }`}
                >
                View Students
                </button>
            </div>
            )}
        </div>

      

        {/* Other Items */}
        <SidebarItem icon={<Users size={18} />} label="Teachers" open={sidebarOpen} />
        <SidebarItem icon={<ClipboardList size={18} />} label="Attendance" open={sidebarOpen} />
{/* Classes Dropdown Card */}
<div
  className={`w-full rounded-2xl shadow transition
    ${sidebarOpen ? "bg-[#fde8df]" : "bg-transparent shadow-none p-0"}`}
>
  <button
    onClick={() => sidebarOpen && setClassesOpen(!classesOpen)}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition
      ${sidebarOpen ? "hover:bg-white/40" : "justify-center hover:bg-muted"}`}
  >
    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
      <LayoutGrid size={16} className="text-primary" />
    </div>

    {sidebarOpen && (
      <>
        <span className="text-sm font-semibold text-[#8b3a16] flex-1 text-left">
          Classes
        </span>
        <ChevronDown
          size={16}
          className={`transition ${classesOpen ? "rotate-180" : ""}`}
        />
      </>
    )}
  </button>

  {/* Dropdown options */}
  {sidebarOpen && classesOpen && (
    <div className="mt-3 space-y-2">
      <button
        onClick={() => onContentChange("create-class")}
        className={`block w-full text-left text-sm px-4 py-2 rounded-xl transition text-[#8b3a16] ${
          activeContent === "create-class"
            ? "bg-white shadow"
            : "hover:bg-white/50"
        }`}
      >
        Create Class
      </button>

      <button
        onClick={() => onContentChange("view-classes")}
        className={`block w-full text-left text-sm px-4 py-2 rounded-xl transition text-[#8b3a16] ${
          activeContent === "view-classes"
            ? "bg-white shadow"
            : "hover:bg-white/50"
        }`}
      >
        View Classes
      </button>
    </div>
  )}
</div>
        <SidebarItem icon={<BookOpen size={18} />} label="Subjects" open={sidebarOpen} />
        <SidebarItem icon={<CalendarDays size={18} />} label="Timetable" open={sidebarOpen} />
        <SidebarItem icon={<Building2 size={18} />} label="Staff" open={sidebarOpen} />
        <SidebarItem icon={<FileText size={18} />} label="Academics" open={sidebarOpen} />
        <SidebarItem icon={<PenTool size={18} />} label="Exams" open={sidebarOpen} />
        <SidebarItem icon={<Bus size={18} />} label="Fees" open={sidebarOpen} />
        <SidebarItem icon={<UtensilsCrossed size={18} />} label="Food" open={sidebarOpen} />
      </div>
    </aside>
  );
}

function SidebarItem({
  icon,
  label,
  open,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  open: boolean;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2 rounded-2xl transition
      ${
        active
          ? "bg-white text-[#8b3a16] shadow"
          : open
          ? "bg-[#fde8df] text-[#8b3a16] hover:bg-white"
          : "bg-transparent hover:bg-muted"
      }`}
    >
      <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
        {icon}
      </div>

      {open && <span className="text-sm font-semibold">{label}</span>}
    </button>
  );
}
