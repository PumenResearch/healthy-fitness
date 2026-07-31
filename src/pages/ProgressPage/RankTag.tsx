import type { CultivationPhase } from './types';

type RankTagProps = {
  name: string;
  rank: number;
  theme: CultivationPhase['rankTheme'];
  requiredPoints?: number;
};

export default function RankTag({ name, rank, theme, requiredPoints }: RankTagProps) {
  const milestone = requiredPoints === 0
    ? 'Tự động mở khóa · 0 điểm'
    : requiredPoints == null
      ? null
      : `Yêu cầu: ${requiredPoints.toLocaleString('vi-VN')} điểm`;

  return (
    <span
      className={`rank-tag rank-tag--${theme} rank-tag--rank-${rank}`}
      aria-label={milestone ? `${name}. ${milestone}` : name}
    >
      <span className="rank-tag-label">{name}</span>
      {milestone && <span className="rank-tag-milestone">{milestone}</span>}
    </span>
  );
}
