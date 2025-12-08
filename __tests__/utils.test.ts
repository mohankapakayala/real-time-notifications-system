import {
  formatTime,
  formatBadgeCount,
  sortNotifications,
  paginate,
} from "@/utils";
import { Notification } from "@/types";

describe("Utility Functions", () => {
  describe("formatTime", () => {
    it("formats time correctly", () => {
      const now = new Date();
      const result = formatTime(now.toISOString());
      expect(result).toBeTruthy();
    });
  });

  describe("formatBadgeCount", () => {
    it("returns count as string when less than max", () => {
      expect(formatBadgeCount(5, 9)).toBe("5");
    });

    it("returns max+ when count exceeds max", () => {
      expect(formatBadgeCount(15, 9)).toBe("9+");
    });
  });

  describe("sortNotifications", () => {
    const notifications: Notification[] = [
      {
        id: "1",
        message: "Oldest",
        timestamp: new Date("2024-01-01").toISOString(),
        read: false,
      },
      {
        id: "2",
        message: "Newest",
        timestamp: new Date().toISOString(),
        read: false,
      },
    ];

    it("sorts by newest first", () => {
      const result = sortNotifications(notifications, "newest");
      expect(result[0].id).toBe("2");
    });
  });

  describe("paginate", () => {
    const items = Array.from({ length: 25 }, (_, i) => ({
      id: `item-${i}`,
      message: `Item ${i}`,
      timestamp: new Date().toISOString(),
      read: false,
    }));

    it("paginates items correctly", () => {
      const result = paginate(items, 1, 10);
      expect(result.paginatedItems).toHaveLength(10);
      expect(result.totalPages).toBe(3);
    });
  });
});
