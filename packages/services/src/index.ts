// Blockchain exports
export { ContractService, contractService } from './blockchain/contract-service';
export {
  createPublicClientForContract,
  MOXITO_CONTRACT_ABI,
  MOXITO_CONTRACT_ADDRESS,
  scrollSepolia,
} from './blockchain/moxito-contract';
export { createPrivyWalletClient } from './blockchain/privy-wallet-adapter';
export type { Achievement, ContractResponse, UserAchievementData } from './blockchain/types';
export type { HealthDataService } from './health/health-service';
export { healthDataService } from './health/health-service';
export type { HealthDailySummary, HealthIntegration, HealthSource } from './health/types';
