import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

// Base RTK Query API; feature APIs are added via injectEndpoints.
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["Product", "Order", "Location"],
  endpoints: () => ({}),
});
