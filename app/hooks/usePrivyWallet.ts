import { usePrivy } from '@privy-io/expo';
import { useMemo } from 'react';
import type { Address } from 'viem';

export const SCROLL_SEPOLIA_CHAIN_ID = 534351;

export interface WalletState {
  isConnected: boolean;
  address: Address | null;
  chainId: number | null;
  walletType: string | null;
  isOnScrollSepolia: boolean;
}

/**
 * Hook to manage Privy wallet connections and state
 * Extracts wallet information from Privy's user object
 */
export function usePrivyWallet() {
  const { user, isReady } = usePrivy();

  const walletState = useMemo<WalletState>(() => {
    if (!isReady || !user) {
      return {
        isConnected: false,
        address: null,
        chainId: null,
        walletType: null,
        isOnScrollSepolia: false,
      };
    }

    // Get wallet from linked accounts
    const walletAccount = user.linked_accounts?.find(
      (account: { type: string }) => account.type === 'wallet'
    );

    if (!walletAccount || !('address' in walletAccount)) {
      return {
        isConnected: false,
        address: null,
        chainId: null,
        walletType: null,
        isOnScrollSepolia: false,
      };
    }

    const address = walletAccount.address as Address;
    // Privy Expo SDK may not expose chainId directly, so we'll need to check via provider
    // For now, we'll assume the wallet needs to be checked separately
    const chainId = (walletAccount as { chainId?: number }).chainId ?? null;
    const walletType = (walletAccount as { walletClientType?: string }).walletClientType ?? 'unknown';
    const isOnScrollSepolia = chainId === SCROLL_SEPOLIA_CHAIN_ID;

    return {
      isConnected: true,
      address,
      chainId,
      walletType,
      isOnScrollSepolia,
    };
  }, [user, isReady]);

  // Note: Privy Expo SDK may handle wallet connections differently
  // This function may need to be implemented based on actual SDK capabilities
  const connectExternalWallet = async () => {
    // Privy Expo SDK wallet connection is typically handled through their UI components
    // or through the useLoginWithWallet hook if available
    console.warn('connectExternalWallet: Wallet connection should be handled through Privy UI or login flow');
    throw new Error('Wallet connection not yet implemented - use Privy login flow');
  };

  return {
    ...walletState,
    connectExternalWallet,
    isReady,
    user,
  };
}
