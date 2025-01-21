import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi, lambdaApi, moxitoApi } from '@moxito/api';
import { moxieReducer } from './moxieSlice';

export const store = configureStore({
  reducer: {
    moxie: moxieReducer,
    [baseApi.reducerPath]: baseApi.reducer,
    [lambdaApi.reducerPath]: lambdaApi.reducer,
    [moxitoApi.reducerPath]: moxitoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      baseApi.middleware,
      lambdaApi.middleware,
      moxitoApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;