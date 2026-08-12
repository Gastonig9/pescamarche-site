import { baseApi } from "../../services/api";
import type { Order, UpdateOrderStatusInput } from "./types";

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], void>({
      query: () => "/orders",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Order" as const, id })),
              { type: "Order" as const, id: "LIST" },
            ]
          : [{ type: "Order" as const, id: "LIST" }],
    }),
    updateOrderStatus: builder.mutation<
      Order,
      { id: string; body: UpdateOrderStatusInput }
    >({
      query: ({ id, body }) => ({
        url: `/orders/${id}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const { useGetOrdersQuery, useUpdateOrderStatusMutation } = ordersApi;
