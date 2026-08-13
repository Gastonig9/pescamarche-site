import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../app/store";
import { markSessionExpired } from "../features/auth/authSlice";

const baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Intercepts 401/403 to trigger the session-expired modal
const baseQueryWithSessionCheck: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401 || result.error?.status === 403) {
    api.dispatch(markSessionExpired());
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithSessionCheck,
  tagTypes: ["Product", "Order", "User"],
  endpoints: () => ({}),
});
