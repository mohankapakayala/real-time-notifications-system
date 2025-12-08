"use client";

import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import Sidebar from "@/components/Sidebar";
import NotificationDropdown from "@/components/NotificationDropdown";
import { Bell, Menu } from "lucide-react";
import Card from "@/components/Card";

const NotificationList = lazy(() => import("@/components/NotificationList"));
const Analytics = lazy(() => import("@/components/Analytics"));

const LoadingFallback = () => (
  <Card>
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  </Card>
);

export default function Home() {
  const [activePage, setActivePage] = useState("notifications");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { unreadCount } = useNotifications();
  const bellIconRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="flex min-h-screen overflow-hidden"
      style={{ backgroundColor: "#FAFAFA" }}
    >
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        onPageChange={setActivePage}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* MAIN */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="relative z-40 mb-6 lg:mb-8">
            {/* TOP ROW (Menu + Title) */}
            <div className="flex justify-between items-center gap-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden p-2 rounded-xl shadow-md"
                style={{ backgroundColor: "#0A84FF" }}
              >
                <Menu className="w-6 h-6 text-white" />
              </button>

              {/* Title — same on mobile */}
              <h1
                className="text-xl sm:text-2xl lg:text-3xl font-bold truncate flex-1"
                style={{ color: "#1A1A1A" }}
              >
                Real-Time Notification System
              </h1>

              {/* Desktop Bell */}
              <div className="hidden lg:block relative">
                <div
                  ref={bellIconRef}
                  className="cursor-pointer relative"
                  onClick={() => setShowDropdown((p) => !p)}
                >
                  <Bell className="w-6 h-6" style={{ color: "#1A1A1A" }} />

                  {unreadCount > 0 && (
                    <span
                      className="absolute -top-2 -right-2 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse"
                      style={{ backgroundColor: "#FF453A" }}
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>

                <NotificationDropdown
                  isOpen={showDropdown}
                  onClose={() => setShowDropdown(false)}
                  onViewAll={() => setActivePage("notifications")}
                  bellIconRef={bellIconRef}
                />
              </div>
            </div>

            {/* MOBILE — Bell Icon BELOW Title */}
            <div className="lg:hidden flex justify-end mt-4">
              <div className="relative" ref={bellIconRef}>
                <div
                  className="cursor-pointer relative"
                  onClick={() => setShowDropdown((p) => !p)}
                >
                  <Bell className="w-7 h-7" style={{ color: "#1A1A1A" }} />

                  {unreadCount > 0 && (
                    <span
                      className="absolute -top-2 -right-2 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse"
                      style={{ backgroundColor: "#FF453A" }}
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>

                <NotificationDropdown
                  isOpen={showDropdown}
                  onClose={() => setShowDropdown(false)}
                  onViewAll={() => setActivePage("notifications")}
                  bellIconRef={bellIconRef}
                />
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <Suspense fallback={<LoadingFallback />}>
            {activePage === "notifications" && <NotificationList />}
            {activePage === "analytics" && <Analytics />}
          </Suspense>
        </div>
      </main>
    </div>
  );
}
