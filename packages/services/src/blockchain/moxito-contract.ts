import { createPublicClient, http, type Chain, type PublicClient } from 'viem';

// Scroll Sepolia chain configuration
export const scrollSepolia: Chain = {
  id: 534351,
  name: 'Scroll Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia-rpc.scroll.io'],
    },
    public: {
      http: ['https://sepolia-rpc.scroll.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Scroll Sepolia Explorer',
      url: 'https://sepolia.scrollscan.com',
    },
  },
  testnet: true,
};

// Contract address
export const MOXITO_CONTRACT_ADDRESS = '0x917e5C305aD17996E8c5F409bd7D29202245d215' as const;

// Helper to create read functions that take an address and return uint256
function createUserReadFunction(name: string) {
  return {
    inputs: [
      {
        internalType: 'address' as const,
        name: 'user' as const,
        type: 'address' as const,
      },
    ],
    name,
    outputs: [
      {
        internalType: 'uint256' as const,
        name: '' as const,
        type: 'uint256' as const,
      },
    ],
    stateMutability: 'view' as const,
    type: 'function' as const,
  };
}

// Contract ABI - includes all functions we need
export const MOXITO_CONTRACT_ABI = [
  {
    inputs: [],
    name: 'recordCheckIn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'steps',
        type: 'uint256',
      },
    ],
    name: 'recordSteps',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  createUserReadFunction('getUserCheckInCount'),
  createUserReadFunction('getUserSteps10KCount'),
  createUserReadFunction('getUserAchievementCount'),
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'getUserAchievement',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'description',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'unlockedAt',
            type: 'uint256',
          },
        ],
        internalType: 'struct MoxitoFitness.Achievement',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

/**
 * Creates a public client for reading from the contract
 */
export function createPublicClientForContract(): PublicClient {
  return createPublicClient({
    chain: scrollSepolia,
    transport: http(scrollSepolia.rpcUrls.default.http[0]),
  });
}
