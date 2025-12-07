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

export type FilterType = "all" | "read" | "unread";

export type SortType = "newest" | "oldest" | "unread-first";

export interface NotificationListProps {
  initialFilter?: FilterType;
}

export interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onViewAll: () => void;
  bellIconRef?: React.RefObject<HTMLDivElement | null>;
}
