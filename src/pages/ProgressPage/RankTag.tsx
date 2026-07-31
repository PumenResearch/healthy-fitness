import type { CultivationPhase } from './types';

type RankTagProps = {
  name: string;
  rank: number;
  theme: CultivationPhase['rankTheme'];
};

export default function RankTag({ name, rank, theme }: RankTagProps) {
  return (
    <span className={`rank-tag rank-tag--${theme} rank-tag--rank-${rank}`}>
      {name}
    </span>
  );
}
