"use client";

import React, { useState, useEffect } from "react";
import { FolderOpen, Bell, BarChart3, Settings, Search, X } from "lucide-react";
import { SidebarProps } from "@/types";

export default function Sidebar({
  activePage,
  onPageChange,
  isMobileOpen = false,
  setIsMobileOpen,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: FolderOpen },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handlePageChange = (page: string) => {
    onPageChange(page);
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && setIsMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`w-64 text-white h-screen fixed left-0 top-0 flex flex-col z-30 transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ backgroundColor: "#0A84FF" }}
      >
        {/* Mobile Close Button */}
        {isMobileOpen && setIsMobileOpen && (
          <div
            className="lg:hidden flex justify-end p-4 border-b"
            style={{ borderColor: "rgba(255,255,255,0.2)" }}
          >
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 transition"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        {/* Search */}
        <div
          className="p-4 border-b"
          style={{ borderColor: "rgba(255,255,255,0.2)" }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white opacity-70 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg text-white placeholder-white/50 border"
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                borderColor: "rgba(255,255,255,0.2)",
              }}
            />
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handlePageChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                  isActive
                    ? "text-white shadow-md"
                    : "text-white/70 hover:text-white"
                }`}
                style={{
                  backgroundColor: isActive
                    ? "rgba(255,255,255,0.2)"
                    : "transparent",
                }}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
