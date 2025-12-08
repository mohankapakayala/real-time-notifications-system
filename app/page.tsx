"use client";

import React, {
  useState,
  useRef,
  lazy,
  Suspense,
  useCallback,
  useEffect,
} from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import Sidebar from "@/components/Sidebar";
import NotificationDropdown from "@/components/NotificationDropdown";
import BellIcon from "@/components/BellIcon";
import { Menu } from "lucide-react";
import Card from "@/components/Card";
import { APP_TITLE } from "@/constants";
import "@/app/components.css";

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

  const { unreadCount, addNotification } = useNotifications();
  const bellIconRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Memoized handlers to prevent unnecessary re-renders
  const toggleMobileMenu = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  const toggleDropdown = useCallback(() => {
    setShowDropdown((prev) => !prev);
  }, []);

  const closeDropdown = useCallback(() => {
    setShowDropdown(false);
  }, []);

  const handleViewAll = useCallback(() => {
    setActivePage("notifications");
    setShowDropdown(false);
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
    <div className="flex min-h-screen overflow-hidden bg-background">
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
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-xl shadow-md bg-primary"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6 text-white" />
              </button>

              {/* Title — same on mobile */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate flex-1 text-primary">
                {APP_TITLE}
              </h1>

              {/* Desktop Bell */}
              <div className="hidden lg:block relative" ref={bellIconRef}>
                <BellIcon unreadCount={unreadCount} onClick={toggleDropdown} />
                <NotificationDropdown
                  isOpen={showDropdown}
                  onClose={closeDropdown}
                  onViewAll={handleViewAll}
                  bellIconRef={bellIconRef}
                />
              </div>
            </div>

            {/* MOBILE — Bell Icon BELOW Title */}
            <div className="lg:hidden flex justify-end mt-4">
              <div className="relative" ref={bellIconRef}>
                <BellIcon
                  unreadCount={unreadCount}
                  onClick={toggleDropdown}
                  className="w-7 h-7"
                />
                <NotificationDropdown
                  isOpen={showDropdown}
                  onClose={closeDropdown}
                  onViewAll={handleViewAll}
                  bellIconRef={bellIconRef}
                />
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <Suspense fallback={<LoadingFallback />}>
            {activePage === "notifications" && <NotificationList />}
            {activePage === "analytics" && <Analytics />}
            {activePage === "dashboard" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <NotificationList />
                <Analytics />
              </div>
            )}
            {activePage === "settings" && (
              <Card>
                <h2 className="text-xl font-bold mb-4 text-primary">
                  Settings
                </h2>
                <p className="text-secondary">Settings page coming soon...</p>
              </Card>
            )}
          </Suspense>
        </div>
      </main>
    </div>
  );
}
