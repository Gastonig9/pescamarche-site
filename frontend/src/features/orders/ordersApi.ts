import { baseApi } from "../../services/api";
import type { CreateOrderPayload, Order } from "./types";

export interface MpPreferenceResponse {
  preferenceId: string;
  initPoint: string;
}

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<Order, CreateOrderPayload>({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
    }),
    createMpPreference: builder.mutation<MpPreferenceResponse, string>({
      query: (orderId) => ({
        url: `/payments/preference/${orderId}`,
        method: "POST",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useCreateOrderMutation, useCreateMpPreferenceMutation } =
  ordersApi;
