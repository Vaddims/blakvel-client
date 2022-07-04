import { createApi } from '@reduxjs/toolkit/query/react';
import { CreateProduct } from '../../models/create-product.model';
import { Product } from '../../models/product.model';
import { UpdateProduct } from '../../models/update-product.model';
import { apiBaseQuery } from './baseQuery';

enum TagTypes {
  Product = 'product',
}

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: apiBaseQuery,
  tagTypes: [TagTypes.Product],
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

    createProduct: build.mutation<Product, CreateProduct>({
      invalidatesTags: [TagTypes.Product],
      query: (product) => ({
        method: 'POST',
        url: '/products',
        body: product,
      })
    }),

    updateProduct: build.mutation<void, UpdateProduct>({
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
} = productsApi;