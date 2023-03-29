import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { apiBaseQuery } from "./baseQuery";
import { Product } from "../../models/product.model";

enum TagTypes {
  Tag = 'tag',
}

export const productTagsApi = createApi({
  reducerPath: "productTagsApi",
  baseQuery: apiBaseQuery,
  tagTypes: [TagTypes.Tag],
  endpoints: (build) => ({
    getProductTag: build.query<Product.Tag, string>({
      providesTags: [TagTypes.Tag],
      query: (id) => `/product-tags/${id}`
    }),

    getProductTags: build.query<Product.Tag[], void>({
      providesTags: [TagTypes.Tag],
      query: () => `/product-tags`,
    }),

    createProductTag: build.mutation<Product.Tag, Product.Unregistered.Tag>({
      invalidatesTags: [TagTypes.Tag],
      query: (productTag) => ({
        method: 'POST',
        url: `/product-tags`,
        body: productTag,
      })
    }),

    updateProductTag: build.mutation<Product.Tag, Product.Tag>({
      invalidatesTags: [TagTypes.Tag],
      query: (productTag) => ({
        method: 'PATCH',
        url: `/product-tags/${productTag.id}`,
        body: productTag,
      }),
    }),

    deleteProductTag: build.mutation<void, string>({
      invalidatesTags: [TagTypes.Tag],
      query: (id) => ({
        method: 'DELETE',
        url: `/product-tags/${id}`,
      }),
    }),
  })
});

export const { 
  useGetProductTagQuery,
  useGetProductTagsQuery,
  useDeleteProductTagMutation,
  useCreateProductTagMutation,
  useUpdateProductTagMutation,
} = productTagsApi;