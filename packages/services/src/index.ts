export type { HealthDataService } from './health/health-service';
export { healthDataService } from './health/health-service';
export type { HealthDailySummary, HealthIntegration, HealthSource } from './health/types';

// Blockchain exports
export { contractService, ContractService } from './blockchain/contract-service';
export {
  MOXITO_CONTRACT_ADDRESS,
  MOXITO_CONTRACT_ABI,
  scrollSepolia,
  createPublicClientForContract,
} from './blockchain/moxito-contract';
export { createPrivyWalletClient } from './blockchain/privy-wallet-adapter';
export type { Achievement, ContractResponse, UserAchievementData } from './blockchain/types';
