import { createWalletClient, custom, type Address, type WalletClient } from 'viem';
import { scrollSepolia } from './moxito-contract';

/**
 * Creates a viem wallet client from a Privy wallet provider
 * This adapter bridges Privy's wallet provider with viem's wallet client interface
 */
export function createPrivyWalletClient(
  provider: unknown,
  account: Address
): WalletClient {
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
