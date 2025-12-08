"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { FolderOpen, Bell, BarChart3, Settings, Search, X } from "lucide-react";
import { SidebarProps } from "@/types";
import "@/app/components.css";

// Move menuItems outside component to avoid recreation on every render
const MENU_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: FolderOpen },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

function Sidebar({
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

  const handlePageChange = useCallback(
    (page: string) => {
      onPageChange(page);
      if (setIsMobileOpen) {
        setIsMobileOpen(false);
      }
    },
    [onPageChange, setIsMobileOpen]
  );

  const handleCloseMenu = useCallback(() => {
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  }, [setIsMobileOpen]);

  // Filter menu items based on search query
  const filteredMenuItems = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return MENU_ITEMS;
    }
    const query = searchQuery.toLowerCase().trim();
    return MENU_ITEMS.filter((item) =>
      item.label.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && setIsMobileOpen && (
        <div
          data-testid="sidebar-overlay"
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={handleCloseMenu}
        />
      )}

      {/* Sidebar */}
      <div
        data-testid="sidebar-panel"
        className={`w-64 text-white h-screen fixed left-0 top-0 flex flex-col z-30 transform transition-transform duration-300 ease-in-out sidebar-bg ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Mobile Close Button */}
        {isMobileOpen && setIsMobileOpen && (
          <div className="lg:hidden flex justify-end p-4 border-b border-sidebar">
            <button
              onClick={handleCloseMenu}
              className="p-2 rounded-full hover:bg-white/10 transition"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        {/* Search */}
        <div className="p-4 border-b border-sidebar">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white opacity-70 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg text-white placeholder-white/50 border sidebar-search-bg sidebar-search-border"
            />
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {filteredMenuItems.length > 0 ? (
            filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handlePageChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all cursor-pointer ${
                    isActive
                      ? "text-white shadow-md sidebar-menu-active"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })
          ) : (
            <div className="text-center py-8 text-white/50">
              <p className="text-sm">No results found</p>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}

export default memo(Sidebar);
