import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export * from './WorkoutEngine';

const emptyBaseQuery = fetchBaseQuery({ baseUrl: '/' });

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: emptyBaseQuery,
  endpoints: () => ({}),
});

export const lambdaApi = createApi({
  reducerPath: 'lambdaApi',
  baseQuery: emptyBaseQuery,
  endpoints: () => ({}),
});

export const moxitoApi = createApi({
  reducerPath: 'moxitoApi',
  baseQuery: emptyBaseQuery,
  endpoints: () => ({}),
});
