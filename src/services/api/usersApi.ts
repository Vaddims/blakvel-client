import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { Login } from "../../models/login.model";
import { User } from "../../models/user.model";
import { apiBaseQuery, appBaseQuery, asyncQueryStrategyUtil } from "./baseQuery";
import type { RootState } from "../store";

enum TagTypes {
  RefreshToken = "refreshToken",
  AccessToken = "accessToken",
}

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: appBaseQuery,
  tagTypes: [TagTypes.RefreshToken, TagTypes.AccessToken],
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
      providesTags: [TagTypes.RefreshToken, TagTypes.AccessToken],
      query: () => 'users/current',
    }),
  }),
});

// export function initiateAccessTokenGetter(store: any) {
//   async function getAccessToken() {
//     const { data: access } = await usersApi.endpoints.getAccessToken.initiate()(store.dispatch, store.getState, {});
//     return access?.accessToken;
//   }

//   asyncQueryStrategyUtil.getAccessToken = getAccessToken;
// }

export const {
  useGetCurrentUserQuery,
  useLoginMutation,
  useLogoutMutation,
} = usersApi;

