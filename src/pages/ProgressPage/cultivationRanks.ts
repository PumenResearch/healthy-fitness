import type { CultivationPhase } from './types';

export type CultivationRankTheme = CultivationPhase['rankTheme'];

export type CultivationRank = {
  id: string;
  rank: number;
  name: string;
  theme: CultivationRankTheme;
  threshold: number;
};

const rankNames = [
  ['luyen-khi', 'Luyện Khí', 'lower'],
  ['truc-co', 'Trúc Cơ', 'lower'],
  ['ket-dan', 'Kết Đan', 'lower'],
  ['nguyen-anh', 'Nguyên Anh', 'lower'],
  ['hoa-than', 'Hóa Thần', 'lower'],
  ['luyen-hu', 'Luyện Hư', 'middle'],
  ['hop-the', 'Hợp Thể', 'middle'],
  ['dai-thua', 'Đại Thừa', 'middle'],
  ['do-kiep', 'Độ Kiếp', 'upper'],
] as const satisfies ReadonlyArray<readonly [string, string, CultivationRankTheme]>;

function getThreshold(rank: number) {
  return Array.from({ length: rank - 1 }, (_, index) => 100 + 50 * (index + 1))
    .reduce((total, points) => total + points, 0);
}

export const cultivationRanks: CultivationRank[] = rankNames.map(([id, name, theme], index) => ({
  id,
  name,
  theme,
  rank: index + 1,
  threshold: getThreshold(index + 1),
}));

export function getCultivationRank(score: number): CultivationRank {
  const normalizedScore = Number.isFinite(score) ? Math.max(0, score) : 0;

  return cultivationRanks.findLast(rank => normalizedScore >= rank.threshold) ?? cultivationRanks[0];
}
