import { baseApi } from "../../services/api";
import type { AuthUser, LoginRequest, LoginResponse } from "./types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    me: builder.query<AuthUser, void>({
      query: () => "/auth/me",
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useMeQuery } = authApi;
