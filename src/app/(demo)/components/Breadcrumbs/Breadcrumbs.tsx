"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  if (pathname === "/dashboard" || pathname === "/homepage") return null;

  const pathSegments = pathname.split("/").filter((segment) => segment !== "");
  
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 font-medium">
      <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1.5">
        <Home size={14} />
        Dashboard
      </Link>
      
      {pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
        const isLast = index === pathSegments.length - 1;
        const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

        return (
          <div key={path} className="flex items-center gap-2">
            <ChevronRight size={14} className="text-gray-400" />
            {isLast ? (
              <span className="text-primary font-bold">{label}</span>
            ) : (
              <Link href={path} className="hover:text-primary transition-colors">
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
