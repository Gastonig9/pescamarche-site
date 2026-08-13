export interface AppNotification {
  _id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  link?: string;
  data?: Record<string, unknown>;
  createdAt: string;
}

export interface NotificationTemplate {
  _id: string;
  type: string;
  label: string;
  icon: string;
  description: string;
  enabled: boolean;
}

export interface UnreadCount {
  count: number;
}
