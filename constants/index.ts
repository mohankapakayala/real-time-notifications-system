// Chart colors
export const CHART_COLORS = ["#0A84FF", "#64D2FF"];

// LocalStorage keys
export const STORAGE_KEYS = {
  NOTIFICATIONS: "notifications",
} as const;

// Pagination
export const ITEMS_PER_PAGE = 10;

// Mock notification messages
export const MOCK_NOTIFICATION_MESSAGES = [
  "Your order #ORD-2024-1245 has been shipped",
  "Payment of $299.99 for subscription renewal was successful",
  "New comment from @alex_martin on your post 'Project Update'",
  "Security alert: Login detected from new device in San Francisco",
  "Your document 'Q4_Report.pdf' has been approved",
  "Meeting reminder: Team standup in 15 minutes",
  "Your withdrawal request of $500.00 has been processed",
  "New follower: @sarah_johnson started following you",
  "Your support ticket #TKT-7892 has been resolved",
  "Invoice #INV-4567 is due in 3 days",
  "Your account verification is complete",
  "New message in #general channel from @team_lead",
  "Your backup completed successfully - 2.5 GB stored",
  "System maintenance scheduled for tonight at 2:00 AM",
  "Your subscription will renew on March 15, 2024",
  "New review received: 5 stars for 'Product Launch'",
  "Your password was changed successfully",
  "New assignment: Review PR #234 in repository",
  "Your file 'presentation.pptx' was shared with 3 people",
  "Weekly report is ready for download",
] as const;

// Days of week for analytics
export const DAYS_OF_WEEK = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;

// Mock data for previous days (realistic notification counts)
export const MOCK_DAILY_NOTIFICATION_COUNTS = [8, 12, 15, 10, 18, 14] as const;

// Maximum unread notifications to show in dropdown
export const MAX_DROPDOWN_NOTIFICATIONS = 5;

// Tooltip styles for charts
export const TOOLTIP_STYLE = {
  backgroundColor: "#FFFFFF",
  border: "1px solid #D4D4D8",
  borderRadius: "8px",
} as const;

// App title
export const APP_TITLE = "Real-Time Notification System" as const;

// Color constants
export const COLORS = {
  PRIMARY: "#0A84FF",
  BACKGROUND: "#FAFAFA",
  TEXT_PRIMARY: "#1A1A1A",
  TEXT_SECONDARY: "#71717A",
  BORDER: "#D4D4D8",
  ERROR: "#FF453A",
  SUCCESS: "#30D158",
  WHITE: "#FFFFFF",
} as const;

// Badge display threshold
export const BADGE_MAX_DISPLAY = 9;
