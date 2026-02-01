"use client";

import { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  UserSquare2,
  UserCog,
  UsersRound,
  CalendarCheck2,
  NotebookPen,
  CalendarClock,
  FileCheck2,
  Wallet,
  Utensils,
  LibraryBig,
  Gauge,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [studentsOpen, setStudentsOpen] = useState(false);
  const [academicsOpen, setAcademicsOpen] = useState(false);
  const pathname = usePathname();

  function SidebarSubItem({ label, href }: { label: string; href: string }) {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`block w-full text-left text-sm px-4 py-2 rounded-xl mb-2
        ${isActive ? "bg-white shadow" : "hover:bg-white/50"}`}
      >
        {label}
      </Link>
    );
  }

  function SidebarItem({
    icon,
    label,
    open,
    href,
  }: {
    icon: React.ReactNode;
    label: string;
    open: boolean;
    href?: string;
  }) {
    const isActive = href ? pathname === href : false;

    const content = (
      <div
        className={`
          w-full flex items-center transition rounded-2xl mb-3
          ${open ? "gap-3 px-4 py-2" : "justify-center py-3"}
          ${
            isActive
              ? "bg-white text-[#8b3a16] shadow"
              : open
              ? "bg-[#fde8df] text-[#8b3a16] hover:bg-white"
              : "hover:bg-muted"
          }
        `}
      >
        <div
          className={`flex items-center justify-center rounded-full bg-primary/20
          ${open ? "h-7 w-7" : "h-11 w-11"}`}
        >
          {icon}
        </div>

        {open && <span className="text-sm font-semibold">{label}</span>}
      </div>
    );

    return href ? <Link href={href}>{content}</Link> : content;
  }

  return (
    <aside
      className={`relative h-screen transition-all duration-300 flex flex-col
      ${sidebarOpen ? "w-65" : "w-18"}
      bg-white border-r border-border`}
    >
      {/* LOGO */}
    {/* LOGO */}
<div className="flex items-center justify-center h-22.5 bg-white border-b border-border">
  {sidebarOpen ? (
    <Image
      src="/logo.png"
      alt="Logo"
      width={150}
      height={50}
      className="h-12 w-auto object-contain"
      priority
    />
  ) : (
    <Image
      src="/icons/sidebar/dashboard.png"
      alt="Sidebar Icon"
      width={40}
      height={40}
      className="h-10 w-10 object-contain"
      priority
    />
  )}
</div>


      {/* TOGGLE */}
      <button
        onClick={() => {
          setSidebarOpen(!sidebarOpen);
          setStudentsOpen(false);
          setAcademicsOpen(false);
        }}
        className="absolute top-1/2 -right-4 -translate-y-1/2 z-50
                   h-8 w-8 rounded-full bg-white border border-border shadow
                   flex items-center justify-center"
      >
        {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* MENU */}
      <div
        className={`flex-1 px-3 py-5 overflow-y-auto scrollbar-hide
        ${sidebarOpen ? "bg-primary pr-4" : "bg-white pr-2 space-y-2"}`}
      >
        {/* Dashboard */}
        <SidebarItem
          icon={<Gauge size={18} />}
          label="Dashboard"
          open={sidebarOpen}
          href="/dashboard"
        />

        {/* Students */}
        <div
          className={`rounded-2xl transition mb-4
          ${sidebarOpen ? "bg-[#fde8df] shadow" : ""}`}
        >
          <button
            onClick={() => sidebarOpen && setStudentsOpen(!studentsOpen)}
            className={`w-full flex items-center transition
            ${sidebarOpen ? "gap-3 px-3 py-2" : "justify-center py-3"}`}
          >
            <div
              className={`flex items-center justify-center rounded-full bg-primary/20
              ${sidebarOpen ? "h-8 w-8" : "h-11 w-11"}`}
            >
              <UserSquare2 size={sidebarOpen ? 16 : 20} />
            </div>

            {sidebarOpen && (
              <>
                <span className="text-sm font-semibold flex-1 text-left">
                  Students
                </span>
                <ChevronDown
                  size={16}
                  className={`transition ${
                    studentsOpen ? "rotate-180" : ""
                  }`}
                />
              </>
            )}
          </button>

          {sidebarOpen && studentsOpen && (
            <div className="mt-3 px-2">
              <SidebarSubItem label="Add Student" href="/students/add" />
              <SidebarSubItem label="View Students" href="/students" />
            </div>
          )}
        </div>

        {/* Academics */}
        <div
          className={`rounded-2xl transition mb-4
          ${sidebarOpen ? "bg-[#fde8df] shadow" : ""}`}
        >
          <button
            onClick={() => sidebarOpen && setAcademicsOpen(!academicsOpen)}
            className={`w-full flex items-center transition
            ${sidebarOpen ? "gap-3 px-3 py-2" : "justify-center py-3"}`}
          >
            <div
              className={`flex items-center justify-center rounded-full bg-primary/20
              ${sidebarOpen ? "h-8 w-8" : "h-11 w-11"}`}
            >
              <LibraryBig size={sidebarOpen ? 16 : 20} />
            </div>

            {sidebarOpen && (
              <>
                <span className="text-sm font-semibold flex-1 text-left">
                  Academics
                </span>
                <ChevronDown
                  size={16}
                  className={academicsOpen ? "rotate-180" : ""}
                />
              </>
            )}
          </button>

          {sidebarOpen && academicsOpen && (
            <div className="mt-3 px-2">
              <SidebarSubItem label="Create Class" href="/classes/create" />
              <SidebarSubItem label="View Classes" href="/classes" />
              <SidebarSubItem label="Create Section" href="/sections/create" />
              <SidebarSubItem label="View Sections" href="/sections" />
              <SidebarSubItem
                label="Create Academic Year"
                href="/academicyears/create"
              />
              <SidebarSubItem
                label="View Academic Years"
                href="/academicyears"
              />
              <SidebarSubItem
                label="Assign Class Sections"
                href="/academics/classsections"
              />
            </div>
          )}
        </div>

        {/* Others */}
        <SidebarItem icon={<UserCog size={18} />} label="Teachers" open={sidebarOpen} href="/teachers" />
        <SidebarItem icon={<CalendarCheck2 size={18} />} label="Attendance" open={sidebarOpen} href="/attendance" />
        <SidebarItem icon={<NotebookPen size={18} />} label="Subjects" open={sidebarOpen} href="/subjects" />
        <SidebarItem icon={<CalendarClock size={18} />} label="Timetable" open={sidebarOpen} href="/timetable" />
        <SidebarItem icon={<UsersRound size={18} />} label="Staff" open={sidebarOpen} href="/staff" />
        <SidebarItem icon={<FileCheck2 size={18} />} label="Exams" open={sidebarOpen} href="/exams" />
        <SidebarItem icon={<Wallet size={18} />} label="Fees" open={sidebarOpen} href="/fees" />
        <SidebarItem icon={<Utensils size={18} />} label="Food" open={sidebarOpen} href="/food" />
      </div>
    </aside>
  );
}
