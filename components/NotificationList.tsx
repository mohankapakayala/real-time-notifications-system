"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  memo,
  useCallback,
} from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import Card from "./Card";
import {
  Trash2,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";
import { FilterType, SortType, NotificationListProps } from "@/types";
import { ITEMS_PER_PAGE } from "@/constants";
import { formatTime, sortNotifications, paginate } from "@/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { useClickOutside } from "@/hooks/useClickOutside";

function NotificationList({ initialFilter }: NotificationListProps) {
  const {
    notifications,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  } = useNotifications();

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>(initialFilter || "all");
  const [sortBy, setSortBy] = useState<SortType>("newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search query to improve performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    // Apply filter
    if (filter === "read") {
      filtered = filtered.filter((n) => n.read);
    } else if (filter === "unread") {
      filtered = filtered.filter((n) => !n.read);
    }

    // Apply search (using debounced value)
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter((n) =>
        n.message.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    return sortNotifications(filtered, sortBy);
  }, [notifications, filter, debouncedSearchQuery, sortBy]);

  // Reset to page 1 when filter, search, or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, debouncedSearchQuery, sortBy]);

  // Update filter when initialFilter prop changes
  useEffect(() => {
    if (initialFilter) {
      setFilter(initialFilter);
    }
  }, [initialFilter]);

  // Close sort dropdown when clicking outside
  useClickOutside(
    sortDropdownRef,
    () => setShowSortDropdown(false),
    showSortDropdown
  );

  // Calculate pagination
  const {
    paginatedItems: paginatedNotifications,
    totalPages,
    startIndex,
    endIndex,
  } = paginate(filteredNotifications, currentPage, ITEMS_PER_PAGE);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [totalPages]
  );

  const handleNotificationClick = useCallback(
    (id: string, read: boolean) => {
      if (!read) {
        markAsRead(id);
      }
    },
    [markAsRead]
  );

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold" style={{ color: "#1A1A1A" }}>
          Notifications
        </h2>
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 text-white rounded-lg transition-colors text-sm font-medium hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: "#0A84FF" }}
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Search and Filter */}
      {notifications.length > 0 && (
        <div className="mb-4 space-y-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
              style={{ color: "#9CA3AF" }}
            />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: "#D4D4D8", backgroundColor: "#FFFFFF" }}
              onFocus={(e) => (e.target.style.borderColor = "#0A84FF")}
              onBlur={(e) => (e.target.style.borderColor = "#D4D4D8")}
            />
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <Filter className="w-4 h-4 mt-1" style={{ color: "#9CA3AF" }} />
            <div className="flex gap-2">
              {(["all", "unread", "read"] as FilterType[]).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    filter === filterType ? "text-white" : "hover:opacity-80"
                  }`}
                  style={
                    filter === filterType
                      ? { backgroundColor: "#0A84FF" }
                      : {
                          backgroundColor: "#F4F4F5",
                          color: "#71717A",
                          border: "1px solid #D4D4D8",
                        }
                  }
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </button>
              ))}
            </div>
            <div
              className="flex items-center gap-2 ml-4 relative"
              ref={sortDropdownRef}
            >
              <ArrowUpDown className="w-4 h-4" style={{ color: "#9CA3AF" }} />
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="px-3 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer border flex items-center gap-2 hover:opacity-80"
                style={{
                  backgroundColor: "#FFFFFF",
                  color: "#71717A",
                  borderColor: "#D4D4D8",
                }}
              >
                <span>
                  {sortBy === "newest"
                    ? "Newest First"
                    : sortBy === "oldest"
                    ? "Oldest First"
                    : "Unread First"}
                </span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${
                    showSortDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showSortDropdown && (
                <div
                  className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border z-50 min-w-[160px]"
                  style={{ borderColor: "#D4D4D8" }}
                >
                  {(["newest", "oldest", "unread-first"] as SortType[]).map(
                    (sortOption) => (
                      <button
                        key={sortOption}
                        onClick={() => {
                          setSortBy(sortOption);
                          setShowSortDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors cursor-pointer first:rounded-t-lg last:rounded-b-lg hover:bg-gray-50 ${
                          sortBy === sortOption ? "bg-blue-50" : ""
                        }`}
                        style={{
                          color: sortBy === sortOption ? "#0A84FF" : "#71717A",
                        }}
                      >
                        {sortOption === "newest"
                          ? "Newest First"
                          : sortOption === "oldest"
                          ? "Oldest First"
                          : "Unread First"}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
            {notifications.length > 0 && (
              <button
                onClick={deleteAllNotifications}
                className="text-sm transition-colors flex items-center gap-1 cursor-pointer hover:opacity-80 ml-auto"
                style={{ color: "#71717A" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#FF453A")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#71717A")}
              >
                <Trash2 className="w-3 h-3" />
                Delete all
              </button>
            )}
          </div>
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="text-center py-12" style={{ color: "#71717A" }}>
          <p>No notifications yet</p>
        </div>
      ) : (
        <>
          {filteredNotifications.length === 0 && debouncedSearchQuery.trim() ? (
            <div className="text-center py-8" style={{ color: "#71717A" }}>
              <p>No notifications match your search</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                {paginatedNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() =>
                      handleNotificationClick(
                        notification.id,
                        notification.read
                      )
                    }
                    className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-all duration-200 border ${
                      notification.read
                        ? "hover:opacity-90"
                        : "border-l-4 hover:opacity-90"
                    }`}
                    style={
                      notification.read
                        ? { backgroundColor: "#FFFFFF", borderColor: "#D4D4D8" }
                        : {
                            backgroundColor: "#FFFFFF",
                            borderTopColor: "#D4D4D8",
                            borderRightColor: "#D4D4D8",
                            borderBottomColor: "#D4D4D8",
                            borderLeftColor: "#0A84FF",
                          }
                    }
                  >
                    <div
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{
                        backgroundColor: notification.read
                          ? "#D4D4D8"
                          : "#30D158",
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={notification.read ? "" : "font-medium"}
                        style={{
                          color: notification.read ? "#71717A" : "#1A1A1A",
                        }}
                      >
                        {notification.message}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "#A1A1AA" }}>
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (notification.read) {
                            markAsUnread(notification.id);
                          } else {
                            markAsRead(notification.id);
                          }
                        }}
                        className="px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer hover:opacity-90"
                        style={
                          notification.read
                            ? {
                                backgroundColor: "#F4F4F5",
                                color: "#71717A",
                                border: "1px solid #D4D4D8",
                              }
                            : { backgroundColor: "#0A84FF", color: "#FFFFFF" }
                        }
                        aria-label={
                          notification.read ? "Mark as unread" : "Mark as read"
                        }
                      >
                        {notification.read ? "Unread" : "Read"}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="transition-colors p-1 cursor-pointer hover:opacity-80"
                        style={{ color: "#A1A1AA" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "#FF453A")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "#A1A1AA")
                        }
                        aria-label="Delete notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div
                  className="flex items-center justify-center gap-2 mt-6 pt-4 border-t"
                  style={{ borderColor: "#D4D4D8" }}
                >
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor:
                        currentPage === 1 ? "#F4F4F5" : "#FFFFFF",
                      border: "1px solid #D4D4D8",
                      color: currentPage === 1 ? "#A1A1AA" : "#1A1A1A",
                    }}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => {
                        // Show first page, last page, current page, and pages around current
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => goToPage(page)}
                              className="px-3 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                              style={
                                currentPage === page
                                  ? {
                                      backgroundColor: "#0A84FF",
                                      color: "#FFFFFF",
                                    }
                                  : {
                                      backgroundColor: "#FFFFFF",
                                      color: "#71717A",
                                      border: "1px solid #D4D4D8",
                                    }
                              }
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <span
                              key={page}
                              className="px-2 text-sm"
                              style={{ color: "#A1A1AA" }}
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      }
                    )}
                  </div>

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor:
                        currentPage === totalPages ? "#F4F4F5" : "#FFFFFF",
                      border: "1px solid #D4D4D8",
                      color: currentPage === totalPages ? "#A1A1AA" : "#1A1A1A",
                    }}
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <span className="text-sm ml-4" style={{ color: "#71717A" }}>
                    Showing {startIndex + 1}-
                    {Math.min(endIndex, filteredNotifications.length)} of{" "}
                    {filteredNotifications.length}
                  </span>
                </div>
              )}
            </>
          )}
        </>
      )}
    </Card>
  );
}

export default memo(NotificationList);
