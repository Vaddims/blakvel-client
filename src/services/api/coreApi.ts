import { createApi } from '@reduxjs/toolkit/query/react';
import { appBaseQuery } from './baseQuery';
import { CustomerProductDto } from '../../dto/product/customer-product.dto';
import { ProductDto } from '../../dto/product/product.dto';
import { ProductTagDto } from '../../dto/product-tag/product-tag.dto';
import { UserDto } from '../../dto/user/user.dto';
import { CustomerUserDto } from '../../dto/user/customer-user.dto';
import { CustomerProductTagDto } from '../../dto/product-tag/customer-product-tag.dto';
import { OrderDto } from '../../dto/order/order.dto';
import { CreateProductDto } from '../../dto/product/create-product.dto';
import { UpdateProductDto } from '../../dto/product/update-product.dto';
import { LoginDto } from '../../dto/auth/login.dto';
import { UpdateUser } from '../../dto/user/update-user.dto';

enum TagTypes {
  Product = 'product',
  Tag = 'tag',

  RefreshToken = "refreshToken",
  AccessToken = "accessToken",

  User = 'user',
  Order = 'order',
}

interface GetProductQueryArg {
  id: string;
  format?: UserDto.Role;
}

interface GetProductTagQueryArg {
  
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

    getProduct: build.query<ProductDto | CustomerProductDto, GetProductQueryArg>({
      providesTags: [TagTypes.Product],
      query: (arg) => {
        const {
          id,
          format = UserDto.Role.Customer,
        } = arg;

        const fetchURLSearchParams = new URLSearchParams();

        return `/products/${id}?${fetchURLSearchParams.toString()}`;
      },
    }),

    getProducts: build.query<ProductDto[], string | void>({
      providesTags: [TagTypes.Product],
      query: (searchParams) => {
        if (searchParams) {
          return `/products?${searchParams}`;
        }

        return '/products';
      },
    }),

    createProduct: build.mutation<ProductDto, CreateProductDto>({
      invalidatesTags: [TagTypes.Product],
      query: (product) => ({
        method: 'POST',
        url: '/products',
        body: product,
      })
    }),

    updateProduct: build.mutation<void, UpdateProductDto & { id: string }>({
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

    getProductTag: build.query<ProductTagDto | CustomerProductTagDto, GetProductTagQueryArg>({
      providesTags: [TagTypes.Tag],
      query: (id) => `/product-tags/${id}`
    }),

    getProductTags: build.query<ProductTagDto[] | CustomerProductTagDto[], void>({
      providesTags: [TagTypes.Tag],
      query: () => `/product-tags`,
    }),

    // TODO REWORK
    createProductTag: build.mutation({
      invalidatesTags: [TagTypes.Tag],
      query: (productTag) => ({
        method: 'POST',
        url: `/product-tags`,
        body: productTag,
      })
    }),

    // TODO REWORK
    updateProductTag: build.mutation({
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

    login: build.mutation<void, LoginDto>({
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

    getCurrentUser: build.query<UserDto, void>({
      providesTags: [TagTypes.RefreshToken, TagTypes.AccessToken, TagTypes.User],
      query: () => 'users/current',
    }),

    getUsers: build.query<UserDto[], void>({
      query: () => `/users`,
      providesTags: [TagTypes.User],
    }),

    updateUser: build.mutation<void, UpdateUser>({
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

    getOrder: build.query<OrderDto, string>({
      providesTags: [TagTypes.Order],
      query: (orderId: string) => `orders/${orderId}`,
    }),

    getOrders: build.query<OrderDto[], void>({
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