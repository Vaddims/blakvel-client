import { createSlice, PayloadAction } from '@reduxjs/toolkit'; 
import { RootState } from '../store';

export enum AuthStatus {
  LoggedIn,
  LoggedOut,
  NotRecieved,
}

export interface AuthSliceState {
  readonly status: AuthStatus;
  readonly token: string | null;
}

const initialState: AuthSliceState = {
  status: AuthStatus.NotRecieved,
  token: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      state.status = AuthStatus.LoggedIn;
    },
    setAuthStatus(state, action: PayloadAction<AuthStatus>) {
      state.status = action.payload;
    },
    logout(state) {
      state.status = AuthStatus.LoggedOut;
      state.token = null;
    }
  },
});

export const { 
  setAuthToken,
  setAuthStatus,
  logout,
} = authSlice.actions;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthToken = (state: RootState) => state.auth.token;
export default authSlice.reducer;