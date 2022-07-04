import { createSlice, PayloadAction } from '@reduxjs/toolkit'; 
import { User } from '../../models/user.model';
import { RootState } from '../store';

export interface UserSliceState {
  user: User | null;
}

const initialState: UserSliceState = {
  user: null,
}

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserSliceState['user']>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export const selectUser = (state: RootState) => state.userReducer.user;
export default userSlice.reducer;