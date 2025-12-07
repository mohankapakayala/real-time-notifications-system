"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Notification } from "@/types";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  deleteAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

const STORAGE_KEY = "notifications";
const UNREAD_COUNT_KEY = "unreadCount";

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const userDeletedAllRef = useRef(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setNotifications(parsed);
        } catch (e) {
          console.error("Error parsing stored notifications:", e);
          // Initialize with sample data if localStorage is corrupted
          const now = Date.now();
          const sampleNotifications: Notification[] = [
            {
              id: `sample-${now}-1`,
              message: "Your order #ORD-2024-1245 has been shipped",
              timestamp: new Date(now - 15 * 60000).toISOString(),
              read: false,
            },
            {
              id: `sample-${now}-2`,
              message:
                "Payment of $299.99 for subscription renewal was successful",
              timestamp: new Date(now - 55 * 60000).toISOString(),
              read: true,
            },
            {
              id: `sample-${now}-3`,
              message:
                "New comment from @alex_martin on your post 'Project Update'",
              timestamp: new Date(now - 90 * 60000).toISOString(),
              read: true,
            },
            {
              id: `sample-${now}-4`,
              message:
                "Security alert: Login detected from new device in San Francisco",
              timestamp: new Date(now - 135 * 60000).toISOString(),
              read: true,
            },
            {
              id: `sample-${now}-5`,
              message: "Your document 'Q4_Report.pdf' has been approved",
              timestamp: new Date(now - 200 * 60000).toISOString(),
              read: false,
            },
            {
              id: `sample-${now}-6`,
              message: "Meeting reminder: Team standup in 15 minutes",
              timestamp: new Date(now - 250 * 60000).toISOString(),
              read: true,
            },
            {
              id: `sample-${now}-7`,
              message: "Your withdrawal request of $500.00 has been processed",
              timestamp: new Date(now - 300 * 60000).toISOString(),
              read: false,
            },
            {
              id: `sample-${now}-8`,
              message: "New follower: @sarah_johnson started following you",
              timestamp: new Date(now - 360 * 60000).toISOString(),
              read: true,
            },
            {
              id: `sample-${now}-9`,
              message: "Your support ticket #TKT-7892 has been resolved",
              timestamp: new Date(now - 420 * 60000).toISOString(),
              read: true,
            },
            {
              id: `sample-${now}-10`,
              message: "Invoice #INV-4567 is due in 3 days",
              timestamp: new Date(now - 480 * 60000).toISOString(),
              read: false,
            },
          ];
          setNotifications(sampleNotifications);
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(sampleNotifications)
          );
        }
      } else {
        // Initialize with sample data if no stored data
        const now = Date.now();
        const sampleNotifications: Notification[] = [
          {
            id: `sample-${now}-1`,
            message: "Your order #ORD-2024-1245 has been shipped",
            timestamp: new Date(now - 15 * 60000).toISOString(),
            read: false,
          },
          {
            id: `sample-${now}-2`,
            message:
              "Payment of $299.99 for subscription renewal was successful",
            timestamp: new Date(now - 55 * 60000).toISOString(),
            read: true,
          },
          {
            id: `sample-${now}-3`,
            message:
              "New comment from @alex_martin on your post 'Project Update'",
            timestamp: new Date(now - 90 * 60000).toISOString(),
            read: true,
          },
          {
            id: `sample-${now}-4`,
            message:
              "Security alert: Login detected from new device in San Francisco",
            timestamp: new Date(now - 135 * 60000).toISOString(),
            read: true,
          },
          {
            id: `sample-${now}-5`,
            message: "Your document 'Q4_Report.pdf' has been approved",
            timestamp: new Date(now - 200 * 60000).toISOString(),
            read: false,
          },
          {
            id: `sample-${now}-6`,
            message: "Meeting reminder: Team standup in 15 minutes",
            timestamp: new Date(now - 250 * 60000).toISOString(),
            read: true,
          },
          {
            id: `sample-${now}-7`,
            message: "Your withdrawal request of $500.00 has been processed",
            timestamp: new Date(now - 300 * 60000).toISOString(),
            read: false,
          },
          {
            id: `sample-${now}-8`,
            message: "New follower: @sarah_johnson started following you",
            timestamp: new Date(now - 360 * 60000).toISOString(),
            read: true,
          },
          {
            id: `sample-${now}-9`,
            message: "Your support ticket #TKT-7892 has been resolved",
            timestamp: new Date(now - 420 * 60000).toISOString(),
            read: true,
          },
          {
            id: `sample-${now}-10`,
            message: "Invoice #INV-4567 is due in 3 days",
            timestamp: new Date(now - 480 * 60000).toISOString(),
            read: false,
          },
        ];
        setNotifications(sampleNotifications);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleNotifications));
      }
    }
  }, []);

  // Helper function to create mock notifications
  const createMockNotifications = useCallback((): Notification[] => {
    const now = Date.now();
    return [
      {
        id: `mock-${now}-1`,
        message: "Your order #ORD-2024-1245 has been shipped",
        timestamp: new Date(now - 15 * 60000).toISOString(),
        read: false,
      },
      {
        id: `mock-${now}-2`,
        message: "Payment of $299.99 for subscription renewal was successful",
        timestamp: new Date(now - 55 * 60000).toISOString(),
        read: true,
      },
      {
        id: `mock-${now}-3`,
        message: "New comment from @alex_martin on your post 'Project Update'",
        timestamp: new Date(now - 90 * 60000).toISOString(),
        read: true,
      },
      {
        id: `mock-${now}-4`,
        message:
          "Security alert: Login detected from new device in San Francisco",
        timestamp: new Date(now - 135 * 60000).toISOString(),
        read: true,
      },
      {
        id: `mock-${now}-5`,
        message: "Your document 'Q4_Report.pdf' has been approved",
        timestamp: new Date(now - 200 * 60000).toISOString(),
        read: false,
      },
      {
        id: `mock-${now}-6`,
        message: "Meeting reminder: Team standup in 15 minutes",
        timestamp: new Date(now - 250 * 60000).toISOString(),
        read: true,
      },
      {
        id: `mock-${now}-7`,
        message: "Your withdrawal request of $500.00 has been processed",
        timestamp: new Date(now - 300 * 60000).toISOString(),
        read: false,
      },
      {
        id: `mock-${now}-8`,
        message: "New follower: @sarah_johnson started following you",
        timestamp: new Date(now - 360 * 60000).toISOString(),
        read: true,
      },
      {
        id: `mock-${now}-9`,
        message: "Your support ticket #TKT-7892 has been resolved",
        timestamp: new Date(now - 420 * 60000).toISOString(),
        read: true,
      },
      {
        id: `mock-${now}-10`,
        message: "Invoice #INV-4567 is due in 3 days",
        timestamp: new Date(now - 480 * 60000).toISOString(),
        read: false,
      },
    ];
  }, []);

  // Save to localStorage whenever notifications change
  // Also re-initialize with mock data if array becomes empty (only on initial load)
  useEffect(() => {
    if (typeof window !== "undefined") {
      // If notifications array is empty and user didn't explicitly delete all, add mock data
      if (notifications.length === 0 && !userDeletedAllRef.current) {
        // Check if this is the initial load (no stored data)
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
          const mockNotifications = createMockNotifications();
          setNotifications(mockNotifications);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mockNotifications));
          const count = mockNotifications.filter((n) => !n.read).length;
          setUnreadCount(count);
          localStorage.setItem(UNREAD_COUNT_KEY, count.toString());
        } else {
          // If there was stored data but now it's empty, user deleted all - don't re-add
          localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
          setUnreadCount(0);
          localStorage.setItem(UNREAD_COUNT_KEY, "0");
        }
      } else if (notifications.length > 0) {
        // Reset the flag when notifications are added back
        userDeletedAllRef.current = false;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
        const count = notifications.filter((n) => !n.read).length;
        setUnreadCount(count);
        localStorage.setItem(UNREAD_COUNT_KEY, count.toString());
      } else if (notifications.length === 0 && userDeletedAllRef.current) {
        // User explicitly deleted all - clear localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        setUnreadCount(0);
        localStorage.setItem(UNREAD_COUNT_KEY, "0");
      }
    }
  }, [notifications, createMockNotifications]);

  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAsUnread = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: false } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const deleteAllNotifications = useCallback(() => {
    userDeletedAllRef.current = true;
    setNotifications([]);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      setUnreadCount(0);
      localStorage.setItem(UNREAD_COUNT_KEY, "0");
    }
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
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}
