import RankNode from './RankNode';
import type { CultivationPhase } from './types';

type RankingTreeProps = {
  phases: CultivationPhase[];
};

export default function RankingTree({ phases }: RankingTreeProps) {
  const ranks = phases.flatMap(phase => phase.levels.map(level => ({ level, rankTheme: phase.rankTheme })));

  return (
    <ol className="ranking-tree rank-tree-list">
      {ranks.map(({ level, rankTheme }, index) => (
        <RankNode key={level.id} level={level} rankTheme={rankTheme} isLast={index === ranks.length - 1} />
      ))}
    </ol>
  );
}
