interface StreakTier {
  minDays: number;
  label: string;
  className: string;
}

const STREAK_TIERS: StreakTier[] = [
  { minDays: 60, label: 'Huyền thoại', className: 'streak-tag--legendary' },
  { minDays: 30, label: 'Chiến binh', className: 'streak-tag--warrior' },
  { minDays: 14, label: 'Bền bỉ', className: 'streak-tag--resilient' },
  { minDays: 7, label: 'Kiên trì', className: 'streak-tag--consistent' },
  { minDays: 3, label: 'Khởi động', className: 'streak-tag--warmup' },
  { minDays: 1, label: 'Bắt đầu', className: 'streak-tag--beginner' },
];

function getTier(streak: number): StreakTier {
  return STREAK_TIERS.find(t => streak >= t.minDays) ?? STREAK_TIERS[STREAK_TIERS.length - 1];
}

export default function StreakTag({ streak }: { streak: number }) {
  if (streak <= 0) return null;

  const tier = getTier(streak);

  return (
    <span className={`streak-tag ${tier.className}`} title={`Chuỗi ${streak} ngày tập luyện`}>
      <svg className="streak-tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
      </svg>
      <span className="streak-tag-count">{streak}</span>
      <span className="streak-tag-label">{tier.label}</span>
    </span>
  );
}
