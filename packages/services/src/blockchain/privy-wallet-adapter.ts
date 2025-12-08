import { type Address, createWalletClient, custom, type WalletClient } from 'viem';
import { scrollSepolia } from './moxito-contract';

/**
 * Creates a viem wallet client from a Privy wallet provider
 * This adapter bridges Privy's wallet provider with viem's wallet client interface
 */
export function createPrivyWalletClient(provider: unknown, account: Address): WalletClient {
  // Cast provider to EIP1193Provider-like interface
  // Privy's wallet provider should implement the standard EIP-1193 interface
  const eip1193Provider = provider as {
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  };

  return createWalletClient({
    account,
    chain: scrollSepolia,
    transport: custom(eip1193Provider),
  });
}

/**
 * Attempts to switch the connected wallet to Scroll Sepolia.
 * If the chain is unknown, adds it first.
 */
export async function switchToScrollSepolia(provider: unknown) {
  const eip1193 = provider as {
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  };

  const chainIdHex = '0x82EF3F'; // 534351

  try {
    await eip1193.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    });
    return true;
  } catch (error: any) {
    // If the chain is unknown (error code 4902), try adding it
    const needsAdd = error?.code === 4902 || error?.message?.includes('Unrecognized chain ID');
    if (!needsAdd) {
      throw error;
    }

    await eip1193.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: chainIdHex,
          chainName: 'Scroll Sepolia',
          nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
          rpcUrls: ['https://sepolia-rpc.scroll.io'],
          blockExplorerUrls: ['https://sepolia.scrollscan.com'],
        },
      ],
    });

    // After adding, switch again
    await eip1193.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    });
    return true;
  }
}
