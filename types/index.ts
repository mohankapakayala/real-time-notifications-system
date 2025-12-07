export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface AnalyticsData {
  labels: string[];
  values: number[];
}

export interface ChartData {
  name: string;
  value: number;
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  deleteAllNotifications: () => void;
}
