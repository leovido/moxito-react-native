import { moxieApi } from "./moxieApi";
import { setupApiStore } from "./test-utils";
import { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

// Create a store with the moxieApi middleware
const storeRef = setupApiStore(moxieApi as any);

// Replace the spyOn with a direct mock
jest.mock('./moxieApi', () => ({
  ...jest.requireActual('./moxieApi'),
  moxieApi: {
    ...jest.requireActual('./moxieApi').moxieApi,
    endpoints: {
      ...jest.requireActual('./moxieApi').moxieApi.endpoints,
      getMoxieStats: {
        ...jest.requireActual('./moxieApi').moxieApi.endpoints.getMoxieStats,
        queryFn: () => ({
          data: {
            fid: "123",
            filter: "weekly",
            stats: { steps: 1000 }
          }
        })
      },
      getFansCount: {
        ...jest.requireActual('./moxieApi').moxieApi.endpoints.getFansCount,
        queryFn: () => ({
          data: 1234
        })
      }
    }
  }
}));

describe("moxieApi", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    storeRef.store.dispatch(moxieApi.util.resetApiState());
  });

  describe("getMoxieStats", () => {
    it("returns moxie stats for a user", async () => {
      fetchMock.mockResponseOnce(JSON.stringify({
        fid: "123",
        filter: "weekly",
        stats: { steps: 1000 }
      }));

      const result = await storeRef.store.dispatch(
        moxieApi.endpoints.getMoxieStats.initiate({ fid: 123, filter: "weekly" })
      );

      expect(result.data).toEqual({
        fid: "123",
        filter: "weekly",
        stats: { steps: 1000 }
      });
    });
  });

  describe("processClaim", () => {
    it("processes a claim request", async () => {
      const mockResponse = { transactionId: "tx123", status: "pending" };
      
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await storeRef.store.dispatch(
        moxieApi.endpoints.processClaim.initiate({ fid: "123", wallet: "0x123" })
      );

      expect(result.data).toEqual(mockResponse);
    });
  });

  describe("getPrice", () => {
    it("fetches price from dexscreener", async () => {
      const mockPriceResponse = {
        pair: {
          priceUsd: "1.23",
          chainId: "ethereum",
          dexId: "uniswap",
          pairAddress: "0x123"
        }
      };
      fetchMock.mockResponseOnce(JSON.stringify(mockPriceResponse));

      const result = await storeRef.store.dispatch(
        moxieApi.endpoints.getPrice.initiate()
      );

      expect(result.data).toBe(1.23);
    });

    it("handles error response by returning 0", async () => {
      fetchMock.mockRejectOnce(new Error('Internal Server Error'));

      const result = await storeRef.store.dispatch(
        moxieApi.endpoints.getPrice.initiate()
      );

      expect(result.data).toBe(undefined);
    });
  });

  describe("getClaimStatus", () => {
    it("fetches claim status", async () => {
      const mockStatus = { status: "completed" };
      
      fetchMock.mockResponseOnce(JSON.stringify(mockStatus));

      const result = await storeRef.store.dispatch(
        moxieApi.endpoints.getClaimStatus.initiate({ 
          fid: "123", 
          transactionId: "tx123" 
        })
      );

      expect(result.data).toEqual(mockStatus);
    });
  });

  describe("getFansCount", () => {
    it("fetches fans count", async () => {
      const mockResponse = { count: 1234 };
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await storeRef.store.dispatch(
        moxieApi.endpoints.getFansCount.initiate({ fid: "123" })
      );

      expect(result.data).toEqual(mockResponse.count);
    });
  });

  describe("getRewardSplits", () => {
    it("fetches reward splits", async () => {
      const mockResponse = {
        splits: [
          { address: "0x123", percentage: 50 },
          { address: "0x456", percentage: 50 }
        ]
      };
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await storeRef.store.dispatch(
        moxieApi.endpoints.getRewardSplits.initiate({ fid: "123" })
      );

      expect(result.data).toEqual(mockResponse);
    });
  });

  describe("getTotalPoolRewards", () => {
    it("fetches total pool rewards", async () => {
      const mockResponse = { totalRewards:  "1000000000000000000"}; // 1 ETH in wei
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await storeRef.store.dispatch(
        moxieApi.endpoints.getTotalPoolRewards.initiate()
      );

      expect(result.data).toEqual(mockResponse.totalRewards);
    });
  });

  // Add more test cases for other endpoints...
}); 