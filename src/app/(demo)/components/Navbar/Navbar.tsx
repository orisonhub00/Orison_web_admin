"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  // Desktop dropdown state
  const [openDropdown, setOpenDropdown] = useState(false);

  // Mobile sidebar open state
  const [mobileOpen, setMobileOpen] = useState(false);

  // Mobile services dropdown open state
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);


  // ✅ Close desktop dropdown when click outside
  useEffect(() => {
    const handleOutsideClick = (e:MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // ✅ Close mobile dropdown when sidebar closes
  useEffect(() => {
    if (!mobileOpen) {
      setMobileServicesOpen(false);
    }
  }, [mobileOpen]);

  return (
    <>
      {/* ✅ DESKTOP NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-white">
        <div className="relative mx-auto flex h-[60px] w-full max-w-[1400px] items-center px-2">
          {/* ✅ Logo close to left border */}
          <Link href="/" className="flex items-center pl-1">
            <Image
              src="/logo.png"
              alt="Orison Logo"
              width={160}
              height={40}
              priority
              className="object-contain"
            />
          </Link>

          {/* ✅ Center menu (Desktop) */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
            {/* Desktop Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpenDropdown((prev) => !prev)}
                className="flex items-center gap-1 text-[14px] font-medium text-foreground hover:text-primary transition"
              >
                Services <span className="text-[11px]">▼</span>
              </button>

              {openDropdown && (
                <div className="absolute left-0 top-10 z-50 min-w-[180px] overflow-hidden rounded-md border border-border bg-white shadow-lg">
                  <Link
                    href="/services/web-development"
                    onClick={() => setOpenDropdown(false)}
                    className="block px-4 py-2 text-[14px] text-foreground border-b border-border hover:bg-muted"
                  >
                    Staff Management
                  </Link>

                  <Link
                    href="/services/mobile-apps"
                    onClick={() => setOpenDropdown(false)}
                    className="block px-4 py-2 text-[14px] text-foreground border-b border-border hover:bg-muted"
                  >
                    Student Management
                  </Link>

                  <Link
                    href="/services/seo"
                    onClick={() => setOpenDropdown(false)}
                    className="block px-4 py-2 text-[14px] text-foreground hover:bg-muted"
                  >
                    SEO
                  </Link>
                </div>
              )}

            </div>

            <Link
              href="/about"
              className="text-[14px] font-medium text-foreground hover:text-primary transition"
            >
              About us
            </Link>
          </nav>

          {/* ✅ Login close to right border (Desktop) */}
          <div className="ml-auto hidden items-center pr-1 md:flex">
            <Link
              href="/login"
              className="rounded-md bg-primary px-6 py-2 text-[14px] font-semibold text-primary-foreground hover:opacity-90 transition"
            >
              Login
            </Link>
          </div>

          {/* ✅ Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="ml-auto flex flex-col gap-1 pr-2 md:hidden"
            aria-label="Open Menu"
          >
            <span className="h-[2px] w-6 bg-foreground" />
            <span className="h-[2px] w-6 bg-foreground" />
            <span className="h-[2px] w-6 bg-foreground" />
          </button>
        </div>
      </header>

      {/* ✅ MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          {/* ✅ MOBILE LEFT SIDEBAR */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="fixed top-0 left-0 h-full w-[80%] max-w-[320px] rounded-r-2xl bg-[#303030] text-white shadow-xl transition-all duration-300"
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between border-b border-white/20 px-5 py-4">
              <Image
                src="/logo.png"
                alt="Orison Logo"
                width={120}
                height={35}
                className="object-contain"
              />

              <button
                onClick={() => {
                  setMobileOpen(false);
                  setMobileServicesOpen(false);
                }}
                className="text-xl font-semibold"
                aria-label="Close Menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Sidebar Links */}
            <div className="p-5">
              <ul className="space-y-5 text-sm">
                {/* Home */}
                <li>
                  <Link
                    href="/"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-left text-white/90 hover:text-white transition"
                  >
                    Home
                  </Link>
                </li>

                {/* Services */}
                <li>
                  <button
                    onClick={() => setMobileServicesOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between text-left text-white/90 hover:text-white transition"
                  >
                    <span>Services</span>
                    <span className="text-xs">
                      {mobileServicesOpen ? "▲" : "▼"}
                    </span>
                  </button>

                  {/* Dropdown Items */}
                  {mobileServicesOpen && (
                    <div className="mt-4 space-y-0 pl-4">
                      <Link
                        href="/services/web-development"
                        onClick={() => {
                          setMobileOpen(false);
                          setMobileServicesOpen(false);
                        }}
                        className="block w-full border-l border-white/20 border-b border-white/20 pb-3 pl-3 text-left text-gray-300 hover:text-white transition"
                      >
                        Staff Management
                      </Link>

                      <Link
                        href="/services/mobile-apps"
                        onClick={() => {
                          setMobileOpen(false);
                          setMobileServicesOpen(false);
                        }}
                        className="block w-full border-l border-white/20 border-b border-white/20 pb-3 pl-3 text-left text-gray-300 hover:text-white transition"
                      >
                        Student Management
                      </Link>

                      <Link
                        href="/services/seo"
                        onClick={() => {
                          setMobileOpen(false);
                          setMobileServicesOpen(false);
                        }}
                        className="block w-full border-l border-white/20 pl-3 text-left text-gray-300 hover:text-white transition"
                      >
                        SEO
                      </Link>
                    </div>
                  )}

                </li>

                {/* About Us */}
                <li>
                  <Link
                    href="/about"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-left text-white/90 hover:text-white transition"
                  >
                    About us
                  </Link>
                </li>

                {/* Login Button */}
                <li className="pt-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
                  >
                    Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
