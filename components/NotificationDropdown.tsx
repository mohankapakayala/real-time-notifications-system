"use client";

import React, { useMemo, memo, useRef } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { NotificationDropdownProps } from "@/types";
import { MAX_DROPDOWN_NOTIFICATIONS } from "@/constants";
import { formatTimeAsDate, formatTimeShort, sortNotifications } from "@/utils";
import { useClickOutside } from "@/hooks/useClickOutside";

function NotificationDropdown({
  isOpen,
  onClose,
  onViewAll,
  bellIconRef,
}: NotificationDropdownProps) {
  const { notifications, markAsRead } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Memoize unread notifications calculation
  const unreadNotifications = useMemo(() => {
    const unread = notifications.filter((n) => !n.read);
    return sortNotifications(unread, "newest").slice(
      0,
      MAX_DROPDOWN_NOTIFICATIONS
    );
  }, [notifications]);

  // Close dropdown when clicking outside (but not on the bell icon)
  useClickOutside(
    dropdownRef,
    (event) => {
      const target = event.target as Node;
      const isClickOnBell = bellIconRef?.current?.contains(target);
      if (!isClickOnBell && isOpen) {
        onClose();
      }
    },
    isOpen
  );

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border z-30"
      style={{
        borderColor: "#D4D4D8",
        maxHeight: "500px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {unreadNotifications.length === 0 ? (
        <div className="p-6 text-center" style={{ color: "#71717A" }}>
          <p>No unread notifications</p>
        </div>
      ) : (
        <>
          <div
            className="overflow-y-auto flex-1"
            style={{ maxHeight: "400px" }}
          >
            {unreadNotifications.map((notification, index) => (
              <div
                key={notification.id}
                onClick={() => {
                  markAsRead(notification.id);
                }}
                className="flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                style={{
                  borderBottom:
                    index < unreadNotifications.length - 1
                      ? "1px solid #F4F4F5"
                      : "none",
                }}
              >
                <div
                  className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  style={{ backgroundColor: "#30D158" }}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="font-medium text-sm mb-1"
                    style={{ color: "#1A1A1A" }}
                  >
                    {notification.message}
                  </p>
                  <p className="text-xs" style={{ color: "#A1A1AA" }}>
                    {formatTimeAsDate(notification.timestamp)}
                  </p>
                </div>
                <p
                  className="text-xs flex-shrink-0 mt-2"
                  style={{ color: "#A1A1AA" }}
                >
                  {formatTimeShort(notification.timestamp)}
                </p>
              </div>
            ))}
          </div>
          <div
            className="border-t py-3 px-4"
            style={{ borderColor: "#D4D4D8" }}
          >
            <button
              onClick={() => {
                onViewAll();
                onClose();
              }}
              className="w-full text-center text-sm font-semibold transition-colors hover:opacity-80 cursor-pointer"
              style={{ color: "#0A84FF" }}
            >
              View all
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default memo(NotificationDropdown);
