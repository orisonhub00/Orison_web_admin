"use client";

import { useState, useEffect, useRef } from "react";
import { User, LogOut, UserCircle } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import { removeAdminToken } from "@/lib/getToken";
import Swal from "sweetalert2";

export default function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [adminData, setAdminData] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    if (path.startsWith("/students")) return "Student Management";
    if (path === "/dashboard") return "Dashboard Overview";
    if (path.startsWith("/academics")) return "Academics";
    if (path.startsWith("/attendance")) return "Attendance";
    if (path.startsWith("/fees")) return "Fees & Payments";
    return "Admin Panel";
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setAdminData(JSON.parse(user));
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to sign out?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#8b3a16",
      confirmButtonText: "Logout",
    });

    if (result.isConfirmed) {
      await logoutAction();
      removeAdminToken();
      localStorage.removeItem("user");
      router.push("/login");
    }
  };

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex-1">
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">
          {getPageTitle(pathname)}
        </h1>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-full transition-colors cursor-pointer"
        >
          <div className="h-9 w-9 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <User size={20} />
          </div>
          <div className="hidden md:block text-left mr-2">
            <p className="text-sm font-semibold text-gray-800 leading-tight">
              {adminData?.name || "Admin"}
            </p>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
              {adminData?.role_id === "admin" ? "Administrator" : "Principal"}
            </p>
          </div>
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-border overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-border bg-gray-50/50">
              <p className="text-sm font-bold text-gray-800">{adminData?.name}</p>
              <p className="text-xs text-gray-500 truncate">{adminData?.email}</p>
            </div>
            
            <div className="p-2">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors cursor-pointer">
                <UserCircle size={18} />
                Profile Details
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
