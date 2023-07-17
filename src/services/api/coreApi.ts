import { createApi } from '@reduxjs/toolkit/query/react';
import { CreateProductRequest } from '../../models/create-product-request.model';
import { Product } from '../../models/product.model';
import { UpdateProductRequest } from '../../models/update-product-request.model';
import { appBaseQuery } from './baseQuery';
import { Login } from '../../models/login.model';
import { User } from '../../models/user.model';
import { PatchUser } from '../../models/patch-user.model';
import { ClientOrder } from '../../models/order.model';

enum TagTypes {
  Product = 'product',
  Tag = 'tag',

  RefreshToken = "refreshToken",
  AccessToken = "accessToken",

  User = 'user',
  Order = 'order',
}

export const coreApi = createApi({
  reducerPath: 'coreApi',
  baseQuery: appBaseQuery,
  tagTypes: [
    TagTypes.Product,
    TagTypes.Tag,
    TagTypes.RefreshToken, 
    TagTypes.AccessToken, 
    TagTypes.User,
    TagTypes.Order,
  ],
  endpoints: (build) => ({
    // ! Product

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
      invalidatesTags: [TagTypes.Product, TagTypes.User, TagTypes.Order],
      query: ({ id, ...product}) => ({
        method: 'PUT',
        url: `/products/${id}`,
        body: product,
      }),
    }),

    updateThumbnail: build.mutation<void, { id: string, formData: FormData }>({
      invalidatesTags: [TagTypes.Product, TagTypes.User, TagTypes.Order],
      query: ({ id, formData }) => ({
        method: 'PUT',
        url: `/products/${id}/thumbnail`,
        body: formData,
      }),
    }),

    deleteProductThumbnail: build.mutation<void, string>({
      invalidatesTags: [TagTypes.Product, TagTypes.User, TagTypes.Order],
      query: (id) => ({
        method: 'DELETE',
        url: `/products/${id}/thumbnail`,
      }),
    }),

    patchProductThumbs: build.mutation<void, {id: string, formData: FormData}>({
      invalidatesTags: [TagTypes.Product, TagTypes.User, TagTypes.Order],
      query: ({ id, formData }) => ({
        method: 'PATCH',
        url: `/products/${id}/thumbs`,
        body: formData,
      }),
    }),

    deleteProduct: build.mutation<void, string>({
      invalidatesTags: [TagTypes.Product, TagTypes.User, TagTypes.Order],
      query: (id) => ({
        method: 'DELETE',
        url: `/products/${id}`,
      }),
    }),

    // ! Product Tag

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
      invalidatesTags: [TagTypes.Tag, TagTypes.Product, TagTypes.User],
      query: (productTag) => ({
        method: 'PATCH',
        url: `/product-tags/${productTag.id}`,
        body: productTag,
      }),
    }),

    deleteProductTag: build.mutation<void, string>({
      invalidatesTags: [TagTypes.Tag, TagTypes.Product, TagTypes.User],
      query: (id) => ({
        method: 'DELETE',
        url: `/product-tags/${id}`,
      }),
    }),

    // ! Auth

    login: build.mutation<void, Login>({
      invalidatesTags: [TagTypes.RefreshToken, TagTypes.AccessToken],
      query: (login) => ({
        url: 'auth/login',
        method: 'POST',
        body: login,
      }),
    }),

    logout: build.mutation<void, void>({
      invalidatesTags: [TagTypes.RefreshToken, TagTypes.AccessToken],
      query: () => ({
        method: 'POST',
        url: 'auth/logout',
      }),
    }),

    // ! User

    getCurrentUser: build.query<User, void>({
      providesTags: [TagTypes.RefreshToken, TagTypes.AccessToken, TagTypes.User],
      query: () => 'users/current',
    }),

    

    getUsers: build.query<User[], void>({
      query: () => `/users`,
      providesTags: [TagTypes.User],
    }),

    updateUser: build.mutation<void, PatchUser>({
      invalidatesTags: [TagTypes.User, TagTypes.Product],
      query: ({ userId, ...body }) => ({
        method: 'PATCH',
        url: `users/${userId}`,
        body,
      })
    }),

    // ! Checkout Session

    createCheckoutSession: build.mutation<any, void>({
      query: () => ({
        method: 'POST',
        url: `users/current/create-checkout-session`,
      })
    }),

    getCheckoutSession: build.query<any, void>({
      query: () => `users/current/checkout-session`,
      keepUnusedDataFor: 0,
    }),

    // ! Orders

    getOrder: build.query<ClientOrder, string>({
      providesTags: [TagTypes.Order],
      query: (orderId: string) => `orders/${orderId}`,
    }),

    getOrders: build.query<ClientOrder[], void>({
      query: () => `orders`,
      providesTags: [TagTypes.Order],
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

  useGetCurrentUserQuery,
  useLoginMutation,
  useLogoutMutation,
  useUpdateUserMutation,
  useCreateCheckoutSessionMutation,
  useGetCheckoutSessionQuery,
  useGetOrderQuery,
  useGetOrdersQuery,
  useGetUsersQuery,
} = coreApi;