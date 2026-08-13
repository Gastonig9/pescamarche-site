import { baseApi } from "../../services/api";

export const locationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPartidos: builder.query<string[], "caba" | "amba">({
      query: (zone) => `/locations/partidos?zone=${zone}`,
    }),
    getBarrios: builder.query<string[], string>({
      query: (partido) =>
        `/locations/barrios?partido=${encodeURIComponent(partido)}`,
      // Skip until a partido is selected
    }),
  }),
  overrideExisting: false,
});

export const { useGetPartidosQuery, useGetBarriosQuery } = locationsApi;
