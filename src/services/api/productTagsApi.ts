import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { apiBaseQuery } from "./baseQuery";
import { ProductTag } from '../../models/product-tag.model';
import { CreateProductTag } from "../../models/create-product-tag.model";

enum TagTypes {
  Tag = 'tag',
}

export const productTagsApi = createApi({
  reducerPath: "productTagsApi",
  baseQuery: apiBaseQuery,
  tagTypes: [TagTypes.Tag],
  endpoints: (build) => ({
    getProductTags: build.query<ProductTag[], void>({
      providesTags: [TagTypes.Tag],
      query: () => `/product-tags`,
    }),

    createProductTag: build.mutation<void, CreateProductTag>({
      invalidatesTags: [TagTypes.Tag],
      query: (productTag) => ({
        method: 'POST',
        url: `/product-tags`,
        body: productTag,
      })
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
  useGetProductTagsQuery,
  useDeleteProductTagMutation,
} = productTagsApi;