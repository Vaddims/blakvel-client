import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { Login } from "../../models/login.model";
import { User } from "../../models/user.model";
import { apiBaseQuery } from "./baseQuery";

enum TagTypes {
  RefreshToken = "refreshToken",
  AccessToken = "accessToken",
}

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: apiBaseQuery,
  tagTypes: [TagTypes.RefreshToken, TagTypes.AccessToken],
  endpoints: (build) => ({
    login: build.mutation<void, Login>({
      invalidatesTags: [TagTypes.RefreshToken],
      query: (login) => ({
        url: 'auth/login',
        method: 'POST',
        body: login,
      }),
    }),

    getAccessToken: build.mutation<void, void>({
      invalidatesTags: [TagTypes.AccessToken],
      query: () => ({
        method: 'GET',
        url: 'auth/access-update',
      }),
    }),

    logout: build.mutation<void, void>({
      invalidatesTags: [TagTypes.RefreshToken, TagTypes.AccessToken],
      query: () => ({
        method: 'GET',
        url: 'auth/logout',
      }),
    }),

    getAuthenticatedUser: build.query<User, void>({
      providesTags: [TagTypes.RefreshToken],
      query: () => 'users/current',
    }),
  }),
});

export const {
  useGetAuthenticatedUserQuery,
  useGetAccessTokenMutation,
  useLoginMutation,
  useLogoutMutation,
} = usersApi;