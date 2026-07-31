export type LevelStatus = 'completed' | 'current' | 'locked';

export type CultivationLevel = {
  id: string;
  rank: number;
  name: string;
  requiredPoints: number;
  description: string;
  status: LevelStatus;
  progress?: number;
  requirements: string[];
  reward: string;
};

export type CultivationPhase = {
  id: string;
  name: string;
  subtitle: string;
  rankTheme: 'lower' | 'middle' | 'upper';
  levels: CultivationLevel[];
};
