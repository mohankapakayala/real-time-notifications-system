"use client";

import React, { useMemo, memo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Label,
} from "recharts";
import Card from "./Card";
import { useNotifications } from "@/contexts/NotificationContext";
import {
  CHART_COLORS,
  DAYS_OF_WEEK,
  MOCK_DAILY_NOTIFICATION_COUNTS,
  TOOLTIP_STYLE,
} from "@/constants";
import "@/app/components.css";

function Analytics() {
  const { notifications } = useNotifications();

  // Calculate notifications per day for the last 7 days
  const barData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const data = DAYS_OF_WEEK.map((day, index) => {
      const dayDate = new Date(today);
      dayDate.setDate(today.getDate() - (6 - index));
      dayDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(dayDate);
      nextDay.setDate(dayDate.getDate() + 1);

      // Check if this is today
      const isToday = dayDate.getTime() === today.getTime();

      if (isToday) {
        // Use actual notification count for today (dynamic)
        const count = notifications.filter((notif) => {
          const notifDate = new Date(notif.timestamp);
          return notifDate >= dayDate && notifDate < nextDay;
        }).length;
        return { name: day, value: count };
      } else {
        // Use mock data for previous days
        return { name: day, value: MOCK_DAILY_NOTIFICATION_COUNTS[index] || 0 };
      }
    });
    return data;
  }, [notifications]);

  // Calculate read vs unread
  const { pieData, readCount, unreadCount } = useMemo(() => {
    const read = notifications.filter((n) => n.read).length;
    const unread = notifications.filter((n) => !n.read).length;
    const total = notifications.length;

    if (total === 0) {
      return {
        pieData: [
          { name: "Read", value: 0 },
          { name: "Unread", value: 0 },
        ],
        readCount: 0,
        unreadCount: 0,
      };
    }

    return {
      pieData: [
        { name: "Read", value: Math.round((read / total) * 100) },
        { name: "Unread", value: Math.round((unread / total) * 100) },
      ],
      readCount: read,
      unreadCount: unread,
    };
  }, [notifications]);

  return (
    <Card>
      <h2 className="text-xl font-bold mb-6 text-primary">Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[300px]">
        {/* Bar Chart */}
        <div>
          <h3 className="text-sm font-medium mb-4 text-secondary">
            Notifications per Day
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
              <XAxis dataKey="name" stroke="#71717A" />
              <YAxis stroke="#71717A" />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="value" fill="#0A84FF" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart */}
        <div>
          <h3 className="text-sm font-medium mb-4 text-secondary">
            Read vs Unread
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
                <Label
                  value={`Unread : ${unreadCount}`}
                  position="center"
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    fill: "#0A84FF",
                  }}
                />
              </Pie>
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(value: number, name: string) => [
                  `${value}% (${name === "Read" ? readCount : unreadCount})`,
                  name,
                ]}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-secondary">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}

export default memo(Analytics);
