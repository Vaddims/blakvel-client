import { useEffect } from "react";
import { User } from "../../models/user.model";
import { useGetCurrentUserQuery, useLogoutMutation, usersApi } from "../../services/api/usersApi";
import { AuthStatus, logout, selectAuthStatus, selectAuthToken } from "../../services/slices/authSlice";
import { useAppDispatch, useAppSelector } from "./reduxAppHooks";

export function useAuthentication(queryOptions?: Parameters<typeof useGetCurrentUserQuery>[1]) {
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector(selectAuthStatus);
  const authToken = useAppSelector(selectAuthToken);
  const [ logoutUserMutation ] = useLogoutMutation();

  const {
    data: user = null,
    refetch: refetchUser,
    isLoading: userIsLoading,
    isFetching: userIsFetching,
  } = useGetCurrentUserQuery(void 0, {
    skip: authStatus === AuthStatus.LoggedOut,
    ...queryOptions,
  });

  const logoutUser = async () => {
    await logoutUserMutation().unwrap();
    dispatch(usersApi.util.resetApiState());
    dispatch(logout());
  }

  return {
    authToken,
    user: user as User | null,
    userIsLoading,
    userIsFetching,
    refetchUser,
    logout: logoutUser,
  }
}
