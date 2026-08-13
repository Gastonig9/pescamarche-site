import { baseApi } from "../../services/api";
import type {
  AppNotification,
  NotificationTemplate,
  UnreadCount,
} from "./types";

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<AppNotification[], void>({
      query: () => "/notifications",
      providesTags: [{ type: "Notification" as const, id: "LIST" }],
    }),
    getUnreadCount: builder.query<UnreadCount, void>({
      query: () => "/notifications/unread-count",
      providesTags: [{ type: "Notification" as const, id: "UNREAD" }],
    }),
    markRead: builder.mutation<void, string>({
      query: (id) => ({ url: `/notifications/${id}/read`, method: "PATCH" }),
      invalidatesTags: [
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: "UNREAD" },
      ],
    }),
    markAllRead: builder.mutation<void, void>({
      query: () => ({ url: "/notifications/read-all", method: "PATCH" }),
      invalidatesTags: [
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: "UNREAD" },
      ],
    }),
    deleteNotification: builder.mutation<void, string>({
      query: (id) => ({ url: `/notifications/${id}`, method: "DELETE" }),
      invalidatesTags: [
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: "UNREAD" },
      ],
    }),
    getNotificationTemplates: builder.query<NotificationTemplate[], void>({
      query: () => "/notifications/templates",
      providesTags: [{ type: "Notification" as const, id: "TEMPLATES" }],
    }),
    createNotificationTemplate: builder.mutation<
      NotificationTemplate,
      Partial<NotificationTemplate>
    >({
      query: (body) => ({
        url: "/notifications/templates",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Notification", id: "TEMPLATES" }],
    }),
    updateNotificationTemplate: builder.mutation<
      NotificationTemplate,
      { id: string; body: Partial<NotificationTemplate> }
    >({
      query: ({ id, body }) => ({
        url: `/notifications/templates/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Notification", id: "TEMPLATES" }],
    }),
    deleteNotificationTemplate: builder.mutation<void, string>({
      query: (id) => ({
        url: `/notifications/templates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Notification", id: "TEMPLATES" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkReadMutation,
  useMarkAllReadMutation,
  useDeleteNotificationMutation,
  useGetNotificationTemplatesQuery,
  useCreateNotificationTemplateMutation,
  useUpdateNotificationTemplateMutation,
  useDeleteNotificationTemplateMutation,
} = notificationsApi;
