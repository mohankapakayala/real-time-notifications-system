import { Notification, SortType } from "@/types";

/**
 * Debounce function to limit how often a function is called
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Calculates time differences between a timestamp and now
 * @param timestamp - ISO timestamp string
 * @returns Object with time differences in milliseconds, minutes, hours, and days
 */
function calculateTimeDiff(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  return { date, diffMs, diffMins, diffHours, diffDays };
}

/**
 * Formats a timestamp to a human-readable relative time string
 * @param timestamp - ISO timestamp string
 * @returns Formatted time string (e.g., "Just now", "5m ago", "2h ago", "Yesterday", "3d ago", or time string for older dates)
 */
export function formatTime(timestamp: string): string {
  const { date, diffMins, diffHours, diffDays } = calculateTimeDiff(timestamp);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Formats a timestamp to a date string for older dates
 * @param timestamp - ISO timestamp string
 * @returns Formatted date string (e.g., "Just now", "5m ago", "2h ago", "Yesterday", "3d ago", or date string like "Jan 15")
 */
export function formatTimeAsDate(timestamp: string): string {
  const { date, diffMins, diffHours, diffDays } = calculateTimeDiff(timestamp);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Formats a timestamp to a short relative time string
 * @param timestamp - ISO timestamp string
 * @returns Short formatted time string (e.g., "5m", "2h", "3d", or date string like "Jan 15")
 */
export function formatTimeShort(timestamp: string): string {
  const { date, diffMins, diffHours, diffDays } = calculateTimeDiff(timestamp);

  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Creates mock notifications for testing/initialization
 * @returns Array of mock Notification objects
 */
export function createMockNotifications(): Notification[] {
  const now = Date.now();
  return Array.from({ length: 10 }).map((_, index) => ({
    id: `mock-${now}-${index + 1}`,
    message: `Sample notification ${index + 1}`,
    timestamp: new Date(now - (index + 1) * 20 * 60000).toISOString(),
    read: index % 2 === 0 ? false : true,
  }));
}

/**
 * Sorts notifications based on the specified sort type
 * @param notifications - Array of notifications to sort
 * @param sortBy - Sort type (newest, oldest, unread-first)
 * @returns Sorted array of notifications
 */
export function sortNotifications(
  notifications: Notification[],
  sortBy: SortType
): Notification[] {
  return [...notifications].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    } else if (sortBy === "unread-first") {
      // Unread first, then by newest
      if (a.read !== b.read) {
        return a.read ? 1 : -1;
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    return 0;
  });
}

/**
 * Paginates an array of items
 * @param items - Array of items to paginate
 * @param currentPage - Current page number (1-indexed)
 * @param itemsPerPage - Number of items per page
 * @returns Object with paginated items, total pages, start index, and end index
 */
export function paginate<T>(
  items: T[],
  currentPage: number,
  itemsPerPage: number
): {
  paginatedItems: T[];
  totalPages: number;
  startIndex: number;
  endIndex: number;
} {
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    paginatedItems,
    totalPages,
    startIndex,
    endIndex,
  };
}

/**
 * Formats notification count for badge display
 * @param count - Number of unread notifications
 * @param maxDisplay - Maximum number to display before showing "9+"
 * @returns Formatted badge text (e.g., "5" or "9+")
 */
export function formatBadgeCount(count: number, maxDisplay: number = 9): string {
  return count > maxDisplay ? `${maxDisplay}+` : String(count);
}
