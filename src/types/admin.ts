export interface BossStatisticsItem {
  bossName: string;
  storeCount: number;
  staffCount: number;
}

export interface BossStatisticsResponse {
  result: BossStatisticsItem[];
}
