import { BaseQueryFn, FetchArgs, FetchBaseQueryError, fetchBaseQuery } from "@reduxjs/toolkit/dist/query";
import type { RootState } from "../store";
import { logout, setAuthToken } from "../slices/authSlice";
import { BaseQueryApi } from "@reduxjs/toolkit/dist/query/baseQueryTypes";

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
  },
});

type AppBaseQuery = BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
>;

let heartbeatInterval: NodeJS.Timeout | null = null;
let heartbeatApi: BaseQueryApi;
export const HEARTBEAT_INTERVAL_MILISECONDS = 10_000;

export const appBaseQuery: AppBaseQuery = async (args, api, extraOptions) => {
  const originalResult = await apiBaseQuery(args, api, extraOptions);

  if (typeof args === 'object') {
    const { url } = args;
  
    if (url === 'auth/logout') {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
    }
  }

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

      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
      
      heartbeatApi = api;
      heartbeatInterval = setInterval(() => {
        apiBaseQuery({ method: 'POST', url: 'auth/heartbeat'}, heartbeatApi, {});
      }, HEARTBEAT_INTERVAL_MILISECONDS);

      const access = accessRequest.data as any;
      api.dispatch(setAuthToken(access.accessToken));
      return await apiBaseQuery(args, api, extraOptions);
    }
  }

  return originalResult;
}
