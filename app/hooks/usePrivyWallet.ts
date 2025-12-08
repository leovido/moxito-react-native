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
  walletProvider?: unknown;
}

/**
 * Hook to manage Privy wallet connections and state
 * Extracts wallet information from Privy's user object
 */
export function usePrivyWallet() {
  const privy = usePrivy() as { login?: () => Promise<void>; user?: unknown; isReady?: boolean };
  const { user, isReady } = privy;
  const typedUser =
    (user as {
      linked_accounts?: Array<{
        type: string;
        address?: string;
        chainId?: number;
        walletClientType?: string;
        provider?: unknown;
        wallet?: { provider?: unknown };
        embedded_wallet?: { provider?: unknown };
      }>;
    }) ?? null;

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
    const walletAccount = typedUser?.linked_accounts?.find(
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
    const walletType =
      (walletAccount as { walletClientType?: string }).walletClientType ?? 'unknown';
    const isOnScrollSepolia = chainId === SCROLL_SEPOLIA_CHAIN_ID;
    const walletProvider =
      (walletAccount as { provider?: unknown }).provider ??
      (walletAccount as { wallet?: { provider?: unknown } }).wallet?.provider ??
      (walletAccount as { embedded_wallet?: { provider?: unknown } }).embedded_wallet?.provider ??
      null;

    return {
      isConnected: true,
      address,
      chainId,
      walletType,
      isOnScrollSepolia,
      walletProvider,
    };
  }, [typedUser, isReady, user]);

  const connectExternalWallet = async () => {
    // Trigger Privy login flow; once authenticated, linked wallet will appear in user.linked_accounts
    if (!isReady) {
      throw new Error('Privy is not ready. Please try again in a moment.');
    }

    // If already connected with a wallet, no-op
    const hasWalletLinked =
      typedUser?.linked_accounts?.some((account: { type: string }) => account.type === 'wallet') ??
      false;
    if (hasWalletLinked) {
      return;
    }

    const login = privy.login;
    if (!login) {
      throw new Error(
        'Privy login is not available in this build. Please integrate the Privy login flow.'
      );
    }
    await login();
  };

  return {
    ...walletState,
    connectExternalWallet,
    isReady,
    user,
  };
}
