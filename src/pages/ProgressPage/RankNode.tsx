import RankTag from './RankTag';
import type { CultivationLevel, CultivationPhase } from './types';

type RankNodeProps = {
  level: CultivationLevel;
  rankTheme: CultivationPhase['rankTheme'];
  isLast: boolean;
};

export default function RankNode({ level, rankTheme, isLast }: RankNodeProps) {
  return (
    <li className={`rank-node rank-node--${rankTheme} rank-node--rank-${level.rank}`}>
      <div className="rank-node-rail" aria-hidden="true">
        <span className="rank-node-marker">{level.rank}</span>
        {!isLast && <span className="rank-node-vertical-link" />}
      </div>

      <div className="rank-node-content">
        <span className="rank-node-horizontal-link" aria-hidden="true" />
        <h3>
          <RankTag
            name={level.name}
            rank={level.rank}
            theme={rankTheme}
            requiredPoints={level.requiredPoints}
          />
        </h3>
      </div>
    </li>
  );
}
