import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { productsApi } from './api/productsApi';
import { usersApi } from './api/usersApi';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
// import { initiateAccessTokenGetter } from './api/getAccessToken';

const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    productsApi.middleware, 
    usersApi.middleware,
  ),
});


// initiateAccessTokenGetter(store, usersApi);
// initiateAccessTokenGetter(store);
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;