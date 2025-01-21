import { lambdaApi } from "./baseApi";
import type {
  MoxieModel,
  MoxieClaimModel,
  MoxieClaimStatus,
  MoxieSplits,
} from "@moxito/shared-types";

export const moxieApi = lambdaApi.injectEndpoints({
  endpoints: (builder) => ({
    getMoxieStats: builder.query<MoxieModel, { fid: number; filter: string }>({
      query: ({ fid, filter }) => ({
        url: "/moxie-daily",
        params: { fid, filter },
      }),
    }),

    getPrice: builder.query<number, void>({
      query: () => ({
        url: "https://api.dexscreener.com/latest/dex/pairs/base/0x493AD7E1c509dE7c89e1963fe9005EaD49FdD19c",
        method: "GET",
      }),
      transformResponse: (response: { pair: { priceUsd: string } }) =>
        Number(response.pair.priceUsd) || 0,
    }),

    processClaim: builder.mutation<
      MoxieClaimModel,
      { fid: string; wallet: string }
    >({
      query: ({ fid, wallet }) => ({
        url: "/moxie-claim",
        params: { fid, wallet },
        method: "POST",
      }),
    }),

    getClaimStatus: builder.query<
      MoxieClaimStatus,
      { fid: string; transactionId: string }
    >({
      query: ({ fid, transactionId }) => ({
        url: "/moxie-claim-status",
        params: { fid, transactionId },
      }),
    }),

    getRewardSplits: builder.query<MoxieSplits, { fid: string }>({
      query: ({ fid }) => ({
        url: "/moxie-splits",
        params: { fid },
      }),
    }),

    getFansCount: builder.query<number, { fid: string }>({
      query: ({ fid }) => ({
        url: "/moxie-fans-count",
        params: { fid },
      }),
      transformResponse: (response: { fans: number }) => response.fans || 0,
    }),

    getTotalPoolRewards: builder.query<number, void>({
      query: () => ({
        url: "/fitness-rewards",
      }),
      transformResponse: (response: { totalRewards: number }) =>
        response.totalRewards || 0,
    }),
  }),
});
