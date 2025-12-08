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
import "@/app/components.css";

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
        <h2 className="text-xl font-bold text-primary">Notifications</h2>
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 text-white rounded-lg transition-colors text-sm font-medium hover:opacity-90 cursor-pointer btn-primary"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Search and Filter */}
      {notifications.length > 0 && (
        <div className="mb-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-icon" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 border-default bg-white focus:input-focus"
            />
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <Filter className="w-4 h-4 mt-1 text-icon" />
            <div className="flex gap-2">
              {(["all", "unread", "read"] as FilterType[]).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    filter === filterType
                      ? "text-white btn-primary"
                      : "btn-secondary hover:opacity-80"
                  }`}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </button>
              ))}
            </div>
            <div
              className="flex items-center gap-2 ml-4 relative"
              ref={sortDropdownRef}
            >
              <ArrowUpDown className="w-4 h-4 text-icon" />
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="px-3 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer border flex items-center gap-2 hover:opacity-80 bg-white text-secondary border-default"
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
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border z-50 min-w-[160px] border-default">
                  {(["newest", "oldest", "unread-first"] as SortType[]).map(
                    (sortOption) => (
                      <button
                        key={sortOption}
                        onClick={() => {
                          setSortBy(sortOption);
                          setShowSortDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors cursor-pointer first:rounded-t-lg last:rounded-b-lg hover:bg-gray-50 ${
                          sortBy === sortOption
                            ? "bg-blue-50 text-primary"
                            : "text-secondary"
                        }`}
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
                className="text-sm transition-colors flex items-center gap-1 cursor-pointer hover:opacity-80 ml-auto text-secondary hover:text-error"
              >
                <Trash2 className="w-3 h-3" />
                Delete all
              </button>
            )}
          </div>
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="text-center py-12 text-secondary">
          <p>No notifications yet</p>
        </div>
      ) : (
        <>
          {filteredNotifications.length === 0 && debouncedSearchQuery.trim() ? (
            <div className="text-center py-8 text-secondary">
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
                    className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-all duration-200 border bg-white hover:opacity-90 ${
                      notification.read
                        ? "border-default"
                        : "border-default notification-unread-border border-l-4"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        notification.read ? "bg-gray-300" : "notification-badge-dot"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={
                          notification.read
                            ? "text-secondary"
                            : "font-medium text-primary"
                        }
                      >
                        {notification.message}
                      </p>
                      <p className="text-xs mt-1 text-muted">
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
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer hover:opacity-90 ${
                          notification.read
                            ? "btn-secondary"
                            : "btn-primary text-white"
                        }`}
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
                        className="transition-colors p-1 cursor-pointer hover:opacity-80 text-muted hover:text-error"
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
                <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-default">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-default ${
                      currentPage === 1
                        ? "pagination-disabled"
                        : "bg-white text-primary"
                    }`}
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
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                                currentPage === page
                                  ? "pagination-active"
                                  : "pagination-inactive"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <span key={page} className="px-2 text-sm text-muted">
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
                    className={`p-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-default ${
                      currentPage === totalPages
                        ? "pagination-disabled"
                        : "bg-white text-primary"
                    }`}
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <span className="text-sm ml-4 text-secondary">
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
