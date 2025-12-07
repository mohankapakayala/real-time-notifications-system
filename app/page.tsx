"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  NotificationProvider,
  useNotifications,
} from "@/contexts/NotificationContext";
import Sidebar from "@/components/Sidebar";
import NotificationList from "@/components/NotificationList";
import Analytics from "@/components/Analytics";
import NotificationDropdown from "@/components/NotificationDropdown";
import { Bell } from "lucide-react";
import { Notification } from "@/types";

function DashboardContent() {
  const [activePage, setActivePage] = useState("notifications");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { unreadCount, addNotification } = useNotifications();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const bellIconRef = useRef<HTMLDivElement>(null);

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
          <div className="flex justify-between items-center mb-6 lg:mb-8">
            <h1
              className="text-2xl lg:text-3xl font-bold"
              style={{ color: "#1A1A1A" }}
            >
              Real-Time Notification System
            </h1>
            <div className="relative">
              <div
                ref={bellIconRef}
                className="cursor-pointer inline-block"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown(!showDropdown);
                }}
                style={{ cursor: "pointer" }}
              >
                <Bell
                  className="w-5 h-5 lg:w-6 lg:h-6 cursor-pointer"
                  style={{ color: "#1A1A1A", cursor: "pointer" }}
                />
                {unreadCount > 0 && (
                  <span
                    className="absolute -top-2 -right-2 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse pointer-events-none"
                    style={{ backgroundColor: "#FF453A" }}
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              <NotificationDropdown
                isOpen={showDropdown}
                onClose={() => setShowDropdown(false)}
                onViewAll={() => {
                  setActivePage("notifications");
                  setShowUnreadOnly(true);
                  setTimeout(() => setShowUnreadOnly(false), 100);
                }}
                bellIconRef={bellIconRef}
              />
            </div>
          </div>

          {/* Content based on active page */}
          <div className="space-y-6">
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

export default function Home() {
  return (
    <NotificationProvider>
      <DashboardContent />
    </NotificationProvider>
  );
}
