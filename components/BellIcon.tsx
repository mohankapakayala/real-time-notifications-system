"use client";

import React, { memo } from "react";
import { Bell } from "lucide-react";
import { formatBadgeCount } from "@/utils";
import { BADGE_MAX_DISPLAY } from "@/constants";
import "@/app/components.css";

interface BellIconProps {
  unreadCount: number;
  onClick: () => void;
  className?: string;
  badgeClassName?: string;
}

const BellIcon = memo(
  ({
    unreadCount,
    onClick,
    className = "w-6 h-6",
    badgeClassName = "w-5 h-5",
  }: BellIconProps) => (
    <div className="cursor-pointer relative" onClick={onClick}>
      <Bell className={`${className} text-primary`} />
      {unreadCount > 0 && (
        <span
          className={`absolute -top-2 -right-2 text-white text-xs font-bold rounded-full ${badgeClassName} flex items-center justify-center animate-pulse notification-badge`}
        >
          {formatBadgeCount(unreadCount, BADGE_MAX_DISPLAY)}
        </span>
      )}
    </div>
  )
);

BellIcon.displayName = "BellIcon";

export default BellIcon;

