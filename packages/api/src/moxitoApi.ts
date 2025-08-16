import { moxitoApi } from "./baseApi";
import type {
  MoxitoScoreModel,
  MoxitoCheckinModel,
  MoxitoActivity,
} from "@moxito/shared-types";

export const moxitoService = moxitoApi.injectEndpoints({
  endpoints: (builder) => ({
    postScore: builder.mutation<boolean, MoxitoScoreModel>({
      query: (model) => ({
        url: "/scoresActivity",
        method: "POST",
        body: model,
      }),
    }),

    getAllScores: builder.query<MoxitoActivity, { fid: number }>({
      query: ({ fid }) => ({
        url: "/scoresActivity",
        params: { fid },
      }),
    }),

    getAllCheckinsByUser: builder.query<
      MoxitoCheckinModel[],
      { fid: number; startDate: string; endDate: string }
    >({
      query: ({ fid, startDate, endDate }) => ({
        url: "/checkins",
        params: { fid, startDate, endDate },
      }),
    }),
  }),
});
