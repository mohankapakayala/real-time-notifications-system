"use client";

import React, { useMemo, memo, useRef, useCallback } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { NotificationDropdownProps } from "@/types";
import { MAX_DROPDOWN_NOTIFICATIONS } from "@/constants";
import { formatTimeAsDate, formatTimeShort, sortNotifications } from "@/utils";
import { useClickOutside } from "@/hooks/useClickOutside";
import "@/app/components.css";

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

  // Memoize click handler for notification items
  const handleNotificationClick = useCallback(
    (id: string) => {
      markAsRead(id);
    },
    [markAsRead]
  );

  // Memoize view all handler
  const handleViewAll = useCallback(() => {
    onViewAll();
    onClose();
  }, [onViewAll, onClose]);

  // Close dropdown when clicking outside (but not on the bell icon)
  const handleClickOutside = useCallback(
    (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      const isClickOnBell = bellIconRef?.current?.contains(target);
      if (!isClickOnBell && isOpen) {
        onClose();
      }
    },
    [bellIconRef, isOpen, onClose]
  );

  useClickOutside(dropdownRef, handleClickOutside, isOpen);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border z-30 border-default flex flex-col max-h-[500px]"
    >
      {unreadNotifications.length === 0 ? (
        <div className="p-6 text-center text-secondary">
          <p>No unread notifications</p>
        </div>
      ) : (
        <>
          <div className="overflow-y-auto flex-1 max-h-[400px]">
            {unreadNotifications.map((notification, index) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id)}
                className={`flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  index < unreadNotifications.length - 1
                    ? "border-b border-default"
                    : ""
                }`}
              >
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 notification-badge-dot" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm mb-1 text-primary">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted">
                    {formatTimeAsDate(notification.timestamp)}
                  </p>
                </div>
                <p className="text-xs flex-shrink-0 mt-2 text-muted">
                  {formatTimeShort(notification.timestamp)}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t py-3 px-4 border-default">
            <button
              onClick={handleViewAll}
              className="w-full text-center text-sm font-semibold transition-colors hover:opacity-80 cursor-pointer text-primary"
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
