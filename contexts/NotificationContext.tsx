"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Notification, NotificationContextType } from "@/types";

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

const STORAGE_KEY = "notifications";

function createMockNotifications(): Notification[] {
  const now = Date.now();
  return Array.from({ length: 10 }).map((_, index) => ({
    id: `mock-${now}-${index + 1}`,
    message: `Sample notification ${index + 1}`,
    timestamp: new Date(now - (index + 1) * 20 * 60000).toISOString(),
    read: index % 2 === 0 ? false : true,
  }));
}

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  // ---- Load once from localStorage ----
  useEffect(() => {
    const storedNotifications = localStorage.getItem(STORAGE_KEY);

    if (storedNotifications) {
      try {
        setNotifications(JSON.parse(storedNotifications));
        return;
      } catch {}
    }

    // If nothing saved → use mock data
    const mockNotifications = createMockNotifications();
    setNotifications(mockNotifications);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockNotifications));
  }, []);

  // ---- Save changes to localStorage ----
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  // ---- Actions ----
  const addNotification = useCallback(
    (notification: Notification) =>
      setNotifications((prevNotifications) => [
        notification,
        ...prevNotifications,
      ]),
    []
  );

  const markAsRead = useCallback(
    (id: string) =>
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      ),
    []
  );

  const markAsUnread = useCallback(
    (id: string) =>
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id
            ? { ...notification, read: false }
            : notification
        )
      ),
    []
  );

  const markAllAsRead = useCallback(
    () =>
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          read: true,
        }))
      ),
    []
  );

  const deleteNotification = useCallback(
    (id: string) =>
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      ),
    []
  );

  const deleteAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAsUnread,
        markAllAsRead,
        deleteNotification,
        deleteAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error("useNotifications must be used inside Provider");
  return context;
}
