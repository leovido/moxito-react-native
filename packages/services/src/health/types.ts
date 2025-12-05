export type HealthSource = 'ios' | 'android' | 'mock';

export interface HealthDailySummary {
  date: Date;
  steps: number;
  heartRateBpm: number;
  distanceKm: number;
  source: HealthSource;
}

export interface HealthIntegration {
  platform: HealthSource;
  canUse(): boolean;
  requestAuthorization(): Promise<boolean>;
  getDailySummary(date: Date): Promise<HealthDailySummary>;
}
