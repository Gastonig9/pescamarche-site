import { baseApi } from "../../services/api";
import type { Location, LocationBulkResult } from "./types";

export const locationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLocations: builder.query<Location[], void>({
      query: () => "/locations",
      providesTags: [{ type: "Location" as const, id: "LIST" }],
    }),
    getLocationsCount: builder.query<number, void>({
      query: () => "/locations/count",
      providesTags: [{ type: "Location" as const, id: "COUNT" }],
    }),
    bulkImportLocations: builder.mutation<LocationBulkResult, FormData>({
      query: (formData) => ({
        url: "/locations/bulk",
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: [
        { type: "Location", id: "LIST" },
        { type: "Location", id: "COUNT" },
      ],
    }),
    clearLocations: builder.mutation<{ deleted: number }, void>({
      query: () => ({ url: "/locations", method: "DELETE" }),
      invalidatesTags: [
        { type: "Location", id: "LIST" },
        { type: "Location", id: "COUNT" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLocationsQuery,
  useGetLocationsCountQuery,
  useBulkImportLocationsMutation,
  useClearLocationsMutation,
} = locationsApi;
