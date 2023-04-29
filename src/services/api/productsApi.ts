import { FetchBaseQueryMeta, createApi } from '@reduxjs/toolkit/query/react';
import { CreateProductRequest } from '../../models/create-product-request.model';
import { Product } from '../../models/product.model';
import { UpdateProductRequest } from '../../models/update-product-request.model';
import { appBaseQuery } from './baseQuery';

enum TagTypes {
  Product = 'product',
  Tag = 'tag',
}

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: appBaseQuery,
  tagTypes: [TagTypes.Product, TagTypes.Tag],
  endpoints: (build) => ({
    getProduct: build.query<Product, string>({
      providesTags: [TagTypes.Product],
      query: (id) => `/products/${id}`,
    }),

    getProducts: build.query<Product[], string | void>({
      providesTags: [TagTypes.Product],
      query: (searchParams) => {
        if (searchParams) {
          return `/products?${searchParams}`;
        }

        return '/products';
      },
    }),

    createProduct: build.mutation<Product, CreateProductRequest>({
      invalidatesTags: [TagTypes.Product],
      query: (product) => ({
        method: 'POST',
        url: '/products',
        body: product,
      })
    }),

    updateProduct: build.mutation<void, UpdateProductRequest>({
      invalidatesTags: [TagTypes.Product],
      query: ({ id, ...product}) => ({
        method: 'PUT',
        url: `/products/${id}`,
        body: product,
      }),
    }),

    updateThumbnail: build.mutation<void, { id: string, formData: FormData }>({
      invalidatesTags: [TagTypes.Product],
      query: ({ id, formData }) => ({
        method: 'PUT',
        url: `/products/${id}/thumbnail`,
        body: formData,
      }),
    }),

    deleteProductThumbnail: build.mutation<void, string>({
      invalidatesTags: [TagTypes.Product],
      query: (id) => ({
        method: 'DELETE',
        url: `/products/${id}/thumbnail`,
      }),
    }),

    patchProductThumbs: build.mutation<void, {id: string, formData: FormData}>({
      invalidatesTags: [TagTypes.Product],
      query: ({ id, formData }) => ({
        method: 'PATCH',
        url: `/products/${id}/thumbs`,
        body: formData,
      }),
    }),

    deleteProduct: build.mutation<void, string>({
      invalidatesTags: [TagTypes.Product],
      query: (id) => ({
        method: 'DELETE',
        url: `/products/${id}`,
      }),
    }),

    getProductTag: build.query<Product.Tag, string>({
      providesTags: [TagTypes.Tag],
      query: (id) => `/product-tags/${id}`
    }),

    getProductTags: build.query<Product.Tag[], void>({
      providesTags: [TagTypes.Tag],
      query: () => `/product-tags`,
    }),

    createProductTag: build.mutation<Product.Tag, Product.Unregistered.Tag>({
      invalidatesTags: [TagTypes.Tag, TagTypes.Product],
      query: (productTag) => ({
        method: 'POST',
        url: `/product-tags`,
        body: productTag,
      })
    }),

    updateProductTag: build.mutation<Product.Tag, Product.Tag>({
      invalidatesTags: [TagTypes.Tag, TagTypes.Product],
      query: (productTag) => ({
        method: 'PATCH',
        url: `/product-tags/${productTag.id}`,
        body: productTag,
      }),
    }),

    deleteProductTag: build.mutation<void, string>({
      invalidatesTags: [TagTypes.Tag, TagTypes.Product],
      query: (id) => ({
        method: 'DELETE',
        url: `/product-tags/${id}`,
      }),
    }),
  }),
});

export const { 
  useGetProductQuery, 
  useGetProductsQuery,
  useUpdateProductMutation,
  useUpdateThumbnailMutation,
  useCreateProductMutation,
  useDeleteProductMutation,
  useDeleteProductThumbnailMutation,
  usePatchProductThumbsMutation,

  useGetProductTagQuery,
  useGetProductTagsQuery,
  useUpdateProductTagMutation,
  useCreateProductTagMutation,
  useDeleteProductTagMutation,
} = productsApi;