interface ScoreTier {
  minScore: number;
  label: string;
  className: string;
}

const SCORE_TIERS: ScoreTier[] = [
  { minScore: 9500, label: 'Tiên Nhân', className: 'score-tag--tien-nhan' },
  { minScore: 8000, label: 'Độ Kiếp', className: 'score-tag--do-kiep' },
  { minScore: 5500, label: 'Đại Thừa', className: 'score-tag--dai-thua' },
  { minScore: 3500, label: 'Luyện Hư', className: 'score-tag--luyen-hu' },
  { minScore: 2000, label: 'Hóa Thần', className: 'score-tag--hoa-than' },
  { minScore: 1000, label: 'Nguyên Anh', className: 'score-tag--nguyen-anh' },
  { minScore: 500, label: 'Kim Đan', className: 'score-tag--kim-dan' },
  { minScore: 250, label: 'Trúc Cơ', className: 'score-tag--truc-co' },
  { minScore: 100, label: 'Luyện Khí', className: 'score-tag--luyen-khi' },
  { minScore: 0, label: 'Phàm Nhân', className: 'score-tag--pham-nhan' },
];

function getTier(score: number): ScoreTier {
  return SCORE_TIERS.find(t => score >= t.minScore) ?? SCORE_TIERS[SCORE_TIERS.length - 1];
}

export default function ScoreTag({ score }: { score: number }) {
  if (score < 0) return null;

  const tier = getTier(score);

  return (
    <span className={`score-tag ${tier.className}`} title={`Điểm tu luyện: ${score}`}>
      <svg className="score-tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      <span className="score-tag-value">{score.toLocaleString()}</span>
      <span className="score-tag-label">{tier.label}</span>
    </span>
  );
}
