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

