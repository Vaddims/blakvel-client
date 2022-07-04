import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import { productsApi } from './api/productsApi';
import { productTagsApi } from './api/productTagsApi';
import { usersApi } from './api/usersApi';
import { setupListeners } from '@reduxjs/toolkit/dist/query';

export const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
    [productTagsApi.reducerPath]: productTagsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    userReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    productsApi.middleware, 
    productTagsApi.middleware, 
    usersApi.middleware,
  ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;