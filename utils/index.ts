import { Notification } from "@/types";

/**
 * Formats a timestamp to a human-readable relative time string
 * @param timestamp - ISO timestamp string
 * @returns Formatted time string (e.g., "Just now", "5m ago", "2h ago", "Yesterday", "3d ago", or time string for older dates)
 */
export function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

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
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

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
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

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
