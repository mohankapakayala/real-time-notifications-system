"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Notification, NotificationContextType } from "@/types";
import { STORAGE_KEYS } from "@/constants";
import { createMockNotifications, debounce } from "@/utils";

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const isInitialMount = useRef(true);
  const debouncedSaveRef = useRef<ReturnType<typeof debounce> | null>(null);

  // Memoize unreadCount to prevent recalculation on every render
  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  // Initialize debounced save function
  useEffect(() => {
    debouncedSaveRef.current = debounce((data: Notification[]) => {
      try {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(data));
      } catch (error) {
        console.error("Failed to save notifications to localStorage:", error);
      }
    }, 500); // Debounce by 500ms
  }, []);

  // Load once from localStorage on mount
  useEffect(() => {
    try {
      const storedNotifications = localStorage.getItem(
        STORAGE_KEYS.NOTIFICATIONS
      );

      if (storedNotifications) {
        const parsed = JSON.parse(storedNotifications);
        if (Array.isArray(parsed)) {
          setNotifications(parsed);
          return;
        }
      }
    } catch (error) {
      console.error("Failed to load notifications from localStorage:", error);
    }

    // If nothing saved → use mock data
    const mockNotifications = createMockNotifications();
    setNotifications(mockNotifications);
    if (debouncedSaveRef.current) {
      debouncedSaveRef.current(mockNotifications);
    }
  }, []);

  // Debounced save to localStorage (skip initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (debouncedSaveRef.current) {
      debouncedSaveRef.current(notifications);
    }
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

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<NotificationContextType>(
    () => ({
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAsUnread,
      markAllAsRead,
      deleteNotification,
      deleteAllNotifications,
    }),
    [
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAsUnread,
      markAllAsRead,
      deleteNotification,
      deleteAllNotifications,
    ]
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}

/**
 * Custom hook to access notification context
 * @throws Error if used outside NotificationProvider
 */
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );
  }
  return context;
}
