export interface Achievement {
  id: number;
  name: string;
  description: string;
  unlockedAt: bigint;
}

export interface ContractResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface UserAchievementData {
  checkInCount: bigint;
  steps10KCount: bigint;
  achievementCount: bigint;
  achievements: Achievement[];
}
