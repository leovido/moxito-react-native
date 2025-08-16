import { baseApi, lambdaApi, moxitoApi } from '@moxito/api';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { logger } from 'redux-logger';
import { moxieReducer } from '../moxieSlice';
import { fitnessReducer } from './fitnessSlice';

export const store = configureStore({
  reducer: {
    fitness: fitnessReducer,
    moxie: moxieReducer,
    [baseApi.reducerPath]: baseApi.reducer,
    [lambdaApi.reducerPath]: lambdaApi.reducer,
    [moxitoApi.reducerPath]: moxitoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    process.env.NODE_ENV === 'development'
      ? getDefaultMiddleware().concat(
          baseApi.middleware,
          lambdaApi.middleware,
          moxitoApi.middleware,
          logger
        )
      : getDefaultMiddleware().concat(
          baseApi.middleware,
          lambdaApi.middleware,
          moxitoApi.middleware
        ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
