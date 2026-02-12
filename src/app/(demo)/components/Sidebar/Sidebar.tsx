"use client";

import { useState, useEffect } from "react";
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
import { PERMISSIONS } from "@/constants/permissions";

export default function Sidebar({ 
  mobileOpen, 
  setMobileOpen 
}: { 
  mobileOpen: boolean; 
  setMobileOpen: (open: boolean) => void 
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [studentsOpen, setStudentsOpen] = useState(false);
  const [academicsOpen, setAcademicsOpen] = useState(false);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [roleName, setRoleName] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log("👤 Sidebar Loaded User:", user); // Debug Log
        console.log("🔑 User Permissions:", user.permissions); // Debug Log
        setRoleName(user.role_name || ""); 
        setPermissions(user.permissions || []);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
  }, []);

  const hasPermission = (moduleName: string, action: string = "view") => {
    // ✅ Super Admin sees everything (checking both formats to be safe)
    if (roleName === "Super Admin" || roleName === "SUPER_ADMIN") return true;

    // Debugging specific checks
    const perm = permissions.find((p: any) => p.module === moduleName);
    // console.log(`🔍 Checking ${moduleName}:`, perm); 
    
    if (!perm) return false;

    if (action === "view") return perm.can_view;
    if (action === "create") return perm.can_create;
    if (action === "edit") return perm.can_edit;
    if (action === "delete") return perm.can_delete;

    return false;
  };

  // ✅ Safe check for specific modules
  // Groups are visible if at least "view" is allowed
  const showStudents = hasPermission(PERMISSIONS.STUDENTS, "view") || 
                       hasPermission(PERMISSIONS.STUDENT_LIST, "view") ||
                       hasPermission(PERMISSIONS.STUDENT_ADMISSION, "create");
  
  // Academics group visible if any submodule is visible
  const showAcademics = hasPermission(PERMISSIONS.CLASSES, "view") || 
                        hasPermission(PERMISSIONS.SECTIONS, "view") || 
                        hasPermission(PERMISSIONS.ACADEMIC_YEARS, "view") ||
                        hasPermission(PERMISSIONS.ASSIGN_CLASS_SECTIONS, "view") ||
                        hasPermission(PERMISSIONS.ACADEMICS, "view"); 

  const showTeachers = hasPermission(PERMISSIONS.TEACHERS, "view");
  const showAttendance = hasPermission(PERMISSIONS.ATTENDANCE, "view");
  const showSubjects = hasPermission(PERMISSIONS.SUBJECTS, "view");
  const showTimetable = hasPermission(PERMISSIONS.TIMETABLE, "view");
  const showStaff = hasPermission(PERMISSIONS.STAFF, "view");
  const showExams = hasPermission(PERMISSIONS.EXAMS, "view");
  const showFees = hasPermission(PERMISSIONS.FEES, "view");
  const showFood = hasPermission(PERMISSIONS.FOOD, "view");
  const showRoles = hasPermission(PERMISSIONS.ROLES, "view");



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
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen z-50 bg-white border-r border-border flex flex-col transition-all duration-300
        md:relative md:translate-x-0
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        ${sidebarOpen ? "w-65" : "w-18"}
        `}
      >
        {/* LOGO */}
        <div className="flex items-center justify-center h-22.5 bg-white border-b border-border shrink-0 py-4">
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

        {/* TOGGLE (Desktop Only or inside drawer) */}
        <button
          onClick={() => {
            setSidebarOpen(!sidebarOpen);
            setStudentsOpen(false);
            setAcademicsOpen(false);
          }}
          className="absolute top-1/2 -right-4 -translate-y-1/2 z-50
                     h-8 w-8 rounded-full bg-white border border-border shadow
                     items-center justify-center hidden md:flex"
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
          {showStudents && (
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
                {/* Granular Permission Checks */}
                {hasPermission(PERMISSIONS.STUDENT_ADMISSION, "create") && (
                  <SidebarSubItem label="Add Student" href="/students/add" />
                )}
                {hasPermission(PERMISSIONS.STUDENT_LIST, "view") && (
                  <SidebarSubItem label="View Students" href="/students" />
                )}
              </div>
            )}
          </div>
          )}

          {/* Academics */}
          {showAcademics && (
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
                {hasPermission(PERMISSIONS.CLASSES, "create") && <SidebarSubItem label="Create Class" href="/classes/create" />}
                {hasPermission(PERMISSIONS.CLASSES, "view") && <SidebarSubItem label="View Classes" href="/classes" />}
                
                {hasPermission(PERMISSIONS.SECTIONS, "create") && <SidebarSubItem label="Create Section" href="/sections/create" />}
                {hasPermission(PERMISSIONS.SECTIONS, "view") && <SidebarSubItem label="View Sections" href="/sections" />}
                
                {hasPermission(PERMISSIONS.ACADEMIC_YEARS, "create") && <SidebarSubItem label="Create Academic Year" href="/academicyears/create" />}
                {hasPermission(PERMISSIONS.ACADEMIC_YEARS, "view") && <SidebarSubItem label="View Academic Years" href="/academicyears" />}
                
                {hasPermission(PERMISSIONS.ASSIGN_CLASS_SECTIONS, "view") && (
                  <SidebarSubItem
                    label="Assign Class Sections"
                    href="/academics/classsections"
                  />
                )}
              </div>
            )}
          </div>
          )}

          {/* Others */}
          {showTeachers && <SidebarItem icon={<UserCog size={18} />} label="Teachers" open={sidebarOpen} href="/teachers" />}
          {showAttendance && <SidebarItem icon={<CalendarCheck2 size={18} />} label="Attendance" open={sidebarOpen} href="/attendance" />}
          {showSubjects && <SidebarItem icon={<NotebookPen size={18} />} label="Subjects" open={sidebarOpen} href="/subjects" />}
          {showTimetable && <SidebarItem icon={<CalendarClock size={18} />} label="Timetable" open={sidebarOpen} href="/timetable" />}
          {showStaff && <SidebarItem icon={<UsersRound size={18} />} label="Staff" open={sidebarOpen} href="/staff" />}
          {showExams && <SidebarItem icon={<FileCheck2 size={18} />} label="Exams" open={sidebarOpen} href="/exams" />}
          {showFees && <SidebarItem icon={<Wallet size={18} />} label="Fees" open={sidebarOpen} href="/fees" />}
          {showFood && <SidebarItem icon={<Utensils size={18} />} label="Food" open={sidebarOpen} href="/food" />}
          
          <div className="my-2 border-t border-gray-100/20" />
          {showRoles && <SidebarItem 
            icon={<UserCog size={18} />} 
            label="Roles & Permissions" 
            open={sidebarOpen} 
            href="/roles" 
          />}
        </div>
      </aside>
    </>
  );
}
