import type { Address, WalletClient } from 'viem';
import {
  MOXITO_CONTRACT_ADDRESS,
  MOXITO_CONTRACT_ABI,
  createPublicClientForContract,
  scrollSepolia,
} from './moxito-contract';
import type { Achievement, ContractResponse, UserAchievementData } from './types';

export class ContractService {
  private publicClient = createPublicClientForContract();

  /**
   * Get user's check-in count from the contract
   */
  async getUserCheckInCount(userAddress: Address): Promise<ContractResponse<bigint>> {
    try {
      const count = await this.publicClient.readContract({
        address: MOXITO_CONTRACT_ADDRESS,
        abi: MOXITO_CONTRACT_ABI,
        functionName: 'getUserCheckInCount',
        args: [userAddress],
      });

      return { data: count, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Failed to get check-in count'),
      };
    }
  }

  /**
   * Get user's steps 10K count from the contract
   */
  async getUserSteps10KCount(userAddress: Address): Promise<ContractResponse<bigint>> {
    try {
      const count = await this.publicClient.readContract({
        address: MOXITO_CONTRACT_ADDRESS,
        abi: MOXITO_CONTRACT_ABI,
        functionName: 'getUserSteps10KCount',
        args: [userAddress],
      });

      return { data: count, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Failed to get steps 10K count'),
      };
    }
  }

  /**
   * Get user's total achievement count from the contract
   */
  async getUserAchievementCount(userAddress: Address): Promise<ContractResponse<bigint>> {
    try {
      const count = await this.publicClient.readContract({
        address: MOXITO_CONTRACT_ADDRESS,
        abi: MOXITO_CONTRACT_ABI,
        functionName: 'getUserAchievementCount',
        args: [userAddress],
      });

      return { data: count, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Failed to get achievement count'),
      };
    }
  }

  /**
   * Get a specific achievement by index for a user
   */
  async getUserAchievement(
    userAddress: Address,
    index: number
  ): Promise<ContractResponse<Achievement>> {
    try {
      const achievement = await this.publicClient.readContract({
        address: MOXITO_CONTRACT_ADDRESS,
        abi: MOXITO_CONTRACT_ABI,
        functionName: 'getUserAchievement',
        args: [userAddress, BigInt(index)],
      });

      return {
        data: {
          id: Number(achievement.id),
          name: achievement.name,
          description: achievement.description,
          unlockedAt: achievement.unlockedAt,
        },
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Failed to get achievement'),
      };
    }
  }

  /**
   * Get all user achievement data
   */
  async getUserAchievementData(
    userAddress: Address
  ): Promise<ContractResponse<UserAchievementData>> {
    try {
      const [checkInCount, steps10KCount, achievementCount] = await Promise.all([
        this.getUserCheckInCount(userAddress),
        this.getUserSteps10KCount(userAddress),
        this.getUserAchievementCount(userAddress),
      ]);

      if (checkInCount.error || steps10KCount.error || achievementCount.error) {
        return {
          data: null,
          error: new Error('Failed to fetch user data'),
        };
      }

      const count = Number(achievementCount.data ?? 0n);
      const achievements: Achievement[] = [];

      // Fetch all achievements
      for (let i = 0; i < count; i++) {
        const achievementResult = await this.getUserAchievement(userAddress, i);
        if (achievementResult.data) {
          achievements.push(achievementResult.data);
        }
      }

      return {
        data: {
          checkInCount: checkInCount.data ?? 0n,
          steps10KCount: steps10KCount.data ?? 0n,
          achievementCount: achievementCount.data ?? 0n,
          achievements,
        },
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Failed to get user achievement data'),
      };
    }
  }

  /**
   * Record a check-in transaction
   */
  async recordCheckIn(walletClient: WalletClient): Promise<ContractResponse<`0x${string}`>> {
    try {
      const [account] = await walletClient.getAddresses();
      if (!account) {
        return {
          data: null,
          error: new Error('No account found in wallet'),
        };
      }

      const hash = await walletClient.writeContract({
        account,
        chain: scrollSepolia,
        address: MOXITO_CONTRACT_ADDRESS,
        abi: MOXITO_CONTRACT_ABI,
        functionName: 'recordCheckIn',
      });

      return { data: hash, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Failed to record check-in'),
      };
    }
  }

  /**
   * Record steps transaction
   */
  async recordSteps(
    walletClient: WalletClient,
    steps: bigint
  ): Promise<ContractResponse<`0x${string}`>> {
    try {
      const [account] = await walletClient.getAddresses();
      if (!account) {
        return {
          data: null,
          error: new Error('No account found in wallet'),
        };
      }

      const hash = await walletClient.writeContract({
        account,
        chain: scrollSepolia,
        address: MOXITO_CONTRACT_ADDRESS,
        abi: MOXITO_CONTRACT_ABI,
        functionName: 'recordSteps',
        args: [steps],
      });

      return { data: hash, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Failed to record steps'),
      };
    }
  }
}

export const contractService = new ContractService();
