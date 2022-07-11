import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { apiBaseQuery } from "./baseQuery";
import { ProductTag } from '../../models/product-tag.model';
import { CreateProductTag } from "../../models/create-product-tag.model";
import { ProductTagField } from "../../models/productTagField.model";
import { ProductTagDeclaration } from "../../models/product-tag-declaration.model";
import { METHODS } from "http";

enum TagTypes {
  Tag = 'tag',
}

export const productTagsApi = createApi({
  reducerPath: "productTagsApi",
  baseQuery: apiBaseQuery,
  tagTypes: [TagTypes.Tag],
  endpoints: (build) => ({
    getProductTag: build.query<ProductTag, string>({
      providesTags: [TagTypes.Tag],
      query: (id) => `/product-tags/${id}`
    }),

    getProductTags: build.query<ProductTag[], void>({
      providesTags: [TagTypes.Tag],
      query: () => `/product-tags`,
    }),

    createProductTag: build.mutation<ProductTag, ProductTagDeclaration>({
      invalidatesTags: [TagTypes.Tag],
      query: (productTag) => ({
        method: 'POST',
        url: `/product-tags`,
        body: productTag,
      })
    }),

    updateProductTag: build.mutation<ProductTag, ProductTagDeclaration & { id: string }>({
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