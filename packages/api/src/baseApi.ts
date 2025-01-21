import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const MOXIE_API_BASE = "https://api.moxito.xyz";
export const MOXIE_LAMBDA_BASE =
  "https://gzkks0v6g8.execute-api.us-east-1.amazonaws.com/prod";
export const MOXITO_API_BASE = "https://moxito.xyz/api";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: MOXIE_API_BASE,
  }),
  endpoints: () => ({}),
});

export const lambdaApi = createApi({
  reducerPath: "lambdaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: MOXIE_LAMBDA_BASE,
  }),
  endpoints: () => ({}),
});

export const moxitoApi = createApi({
  reducerPath: "moxitoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: MOXITO_API_BASE,
  }),
  endpoints: () => ({}),
});
