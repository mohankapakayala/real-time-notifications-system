"use client";

import React, {
  useState,
  useEffect,
  useRef,
  lazy,
  Suspense,
  useCallback,
} from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import Sidebar from "@/components/Sidebar";
import NotificationDropdown from "@/components/NotificationDropdown";
import { Bell } from "lucide-react";
import Card from "@/components/Card";

// Lazy load heavy components for code splitting
const NotificationList = lazy(() => import("@/components/NotificationList"));
const Analytics = lazy(() => import("@/components/Analytics"));

// Loading fallback component
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
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { unreadCount, addNotification } = useNotifications();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const bellIconRef = useRef<HTMLDivElement>(null);

  // Memoize handlers to prevent unnecessary re-renders
  const handleViewAll = useCallback(() => {
    setActivePage("notifications");
    setShowUnreadOnly(true);
    setTimeout(() => setShowUnreadOnly(false), 100);
  }, []);

  const handleCloseDropdown = useCallback(() => {
    setShowDropdown(false);
  }, []);

  const handleToggleDropdown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown((prev) => !prev);
  }, []);

  // Simulate real-time notifications
  useEffect(() => {
    const generateNotification = async () => {
      try {
        const response = await fetch("/api/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "generate" }),
        });
        const data = await response.json();
        if (data.success && data.notification) {
          addNotification(data.notification);
        }
      } catch (error) {
        console.error("Error generating notification:", error);
      }
    };

    // Generate a notification every 10-30 seconds
    const scheduleNext = () => {
      const delay = Math.random() * 20000 + 10000; // 10-30 seconds
      intervalRef.current = setTimeout(() => {
        generateNotification();
        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [addNotification]);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#FAFAFA" }}>
      <Sidebar activePage={activePage} onPageChange={setActivePage} />

      <main className="flex-1 lg:ml-64 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center gap-4 mb-6 lg:mb-8 relative z-40 pl-12 lg:pl-0">
            <h1
              className="text-xl sm:text-2xl lg:text-3xl font-bold truncate min-w-0 flex-1"
              style={{ color: "#1A1A1A" }}
            >
              Real-Time Notification System
            </h1>
            <div className="relative flex-shrink-0">
              <div
                ref={bellIconRef}
                className="cursor-pointer inline-block relative"
                onClick={handleToggleDropdown}
                style={{ cursor: "pointer" }}
              >
                <Bell
                  className="w-5 h-5 lg:w-6 lg:h-6 cursor-pointer"
                  style={{ color: "#1A1A1A", cursor: "pointer" }}
                />
                {/* Reserve space for badge to prevent layout shift */}
                <span
                  className={`absolute -top-2 -right-2 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center pointer-events-none transition-opacity duration-200 ${
                    unreadCount > 0 ? "animate-pulse" : ""
                  }`}
                  style={{
                    backgroundColor:
                      unreadCount > 0 ? "#FF453A" : "transparent",
                    opacity: unreadCount > 0 ? 1 : 0,
                    minWidth: "20px", // Reserve space even when hidden
                    minHeight: "20px",
                  }}
                  aria-hidden="true"
                >
                  {unreadCount > 0 && (unreadCount > 9 ? "9+" : unreadCount)}
                </span>
              </div>
              <NotificationDropdown
                isOpen={showDropdown}
                onClose={handleCloseDropdown}
                onViewAll={handleViewAll}
                bellIconRef={bellIconRef}
              />
            </div>
          </div>

          {/* Content based on active page */}
          <div className="space-y-6">
            <Suspense fallback={<LoadingFallback />}>
              {activePage === "notifications" && (
                <NotificationList
                  initialFilter={showUnreadOnly ? "unread" : undefined}
                />
              )}
              {activePage === "analytics" && <Analytics />}
              {activePage === "dashboard" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <NotificationList />
                  <Analytics />
                </div>
              )}
            </Suspense>
            {activePage === "settings" && (
              <div
                className="rounded-lg shadow-sm border p-6"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#D4D4D8" }}
              >
                <h2
                  className="text-xl font-bold mb-4"
                  style={{ color: "#1A1A1A" }}
                >
                  Settings
                </h2>
                <p style={{ color: "#6B7280" }}>Settings page coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
