import { BaseQueryFn, FetchArgs, FetchBaseQueryError, fetchBaseQuery } from "@reduxjs/toolkit/dist/query";
import type { RootState } from "../store";
import { logout, setAuthToken } from "../slices/authSlice";

export let asyncQueryStrategyUtil: any = {
  getAccessToken: null,
}

export const apiBaseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders(headers, api) {
    const state = api.getState() as RootState;
    const { token } = state.auth;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }
});

type AppBaseQuery = BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
>;

export const appBaseQuery: AppBaseQuery = async (args, api, extraOptions) => {
  const originalResult = await apiBaseQuery(args, api, extraOptions);
  if (originalResult.data) {
    return originalResult;
  }

  switch (originalResult.error?.status) {
    case 401: {
      const accessRequest = await apiBaseQuery('auth/access', api, extraOptions);
      if (accessRequest.error) {
        api.dispatch(logout());
        break;
      }

      const access = accessRequest.data as any;
      api.dispatch(setAuthToken(access.accessToken));
      return await apiBaseQuery(args, api, extraOptions);
    }
  }

  return originalResult;
}
