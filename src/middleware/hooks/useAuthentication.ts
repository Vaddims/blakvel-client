import { UserDto } from "../../dto/user/user.dto";
import { useGetCurrentUserQuery, useLogoutMutation, coreApi } from "../../services/api/coreApi";
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
    dispatch(coreApi.util.resetApiState());
    dispatch(logout());
  }

  return {
    authToken,
    user: user as UserDto | null,
    userIsLoading,
    userIsFetching,
    refetchUser,
    logout: logoutUser,
  }
}
