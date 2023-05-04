import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { Login } from "../../models/login.model";
import { User } from "../../models/user.model";
import { apiBaseQuery, appBaseQuery, asyncQueryStrategyUtil } from "./baseQuery";
import type { RootState } from "../store";
import { PatchUser } from "../../models/patch-user.model";

enum TagTypes {
  RefreshToken = "refreshToken",
  AccessToken = "accessToken",
  User = 'user',
}

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: appBaseQuery,
  tagTypes: [TagTypes.RefreshToken, TagTypes.AccessToken, TagTypes.User],
  endpoints: (build) => ({
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

    getCurrentUser: build.query<User, void>({
      providesTags: [TagTypes.RefreshToken, TagTypes.AccessToken, TagTypes.User],
      query: () => 'users/current',
    }),

    updateUser: build.mutation<void, PatchUser>({
      invalidatesTags: [TagTypes.User],
      query: ({ userId, ...body }) => ({
        method: 'PATCH',
        url: `users/${userId}`,
        body,
      })
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useLoginMutation,
  useLogoutMutation,
  useUpdateUserMutation,
} = usersApi;

