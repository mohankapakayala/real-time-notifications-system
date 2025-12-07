'use client';

import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Card from './Card';
import { useNotifications } from '@/contexts/NotificationContext';

const COLORS = ['#0A84FF', '#64D2FF'];

export default function Analytics() {
  const { notifications } = useNotifications();

  // Calculate notifications per day for the last 7 days
  const barData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Mock data for previous days (realistic notification counts)
    const mockData = [8, 12, 15, 10, 18, 14];
    
    const data = days.map((day, index) => {
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
        return { name: day, value: mockData[index] || 0 };
      }
    });
    return data;
  }, [notifications]);

  // Calculate read vs unread
  const pieData = useMemo(() => {
    const readCount = notifications.filter((n) => n.read).length;
    const unreadCount = notifications.filter((n) => !n.read).length;
    const total = notifications.length;

    if (total === 0) {
      return [
        { name: 'Read', value: 0 },
        { name: 'Unread', value: 0 },
      ];
    }

    return [
      { name: 'Read', value: Math.round((readCount / total) * 100) },
      { name: 'Unread', value: Math.round((unreadCount / total) * 100) },
    ];
  }, [notifications]);

  return (
    <Card>
      <h2 className="text-xl font-bold mb-6" style={{ color: '#1A1A1A' }}>Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[300px]">
        {/* Bar Chart */}
        <div>
          <h3 className="text-sm font-medium mb-4" style={{ color: '#71717A' }}>Notifications per Day</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
              <XAxis dataKey="name" stroke="#71717A" />
              <YAxis stroke="#71717A" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D4D4D8',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value" fill="#0A84FF" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart */}
        <div>
          <h3 className="text-sm font-medium mb-4" style={{ color: '#71717A' }}>Read vs Unread</h3>
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
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D4D4D8',
                  borderRadius: '8px',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span style={{ color: '#71717A' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}

