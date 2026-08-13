import { baseApi } from "../../services/api";
import type { Product, ProductInput } from "./types";

export interface BulkImportResult {
  created: number;
  skipped: number;
  errors: string[];
}

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => "/products",
      providesTags: (result) =>
        result
          ? [
              ...result.map((p) => ({
                type: "Product" as const,
                id: p._id || p.id,
              })),
              { type: "Product" as const, id: "LIST" },
            ]
          : [{ type: "Product" as const, id: "LIST" }],
    }),
    createProduct: builder.mutation<Product, Partial<ProductInput>>({
      query: (body) => ({ url: "/products", method: "POST", body }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    updateProduct: builder.mutation<
      Product,
      { id: string; body: Partial<ProductInput> }
    >({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    bulkImportProducts: builder.mutation<BulkImportResult, FormData>({
      query: (formData) => ({
        url: "/products/bulk",
        method: "POST",
        body: formData,
        // Do NOT set Content-Type; browser sets it automatically with boundary
        formData: true,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    clearProducts: builder.mutation<{ deleted: number }, void>({
      query: () => ({ url: "/products", method: "DELETE" }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useBulkImportProductsMutation,
  useClearProductsMutation,
} = productsApi;
