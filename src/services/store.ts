import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { coreApi } from './api/coreApi';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
// import { initiateAccessTokenGetter } from './api/getAccessToken';

const store = configureStore({
  reducer: {
    [coreApi.reducerPath]: coreApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    coreApi.middleware, 
  ),
});


// initiateAccessTokenGetter(store, coreApi);
// initiateAccessTokenGetter(store);
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;