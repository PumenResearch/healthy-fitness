import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  fetchScoreLeaderboard,
  fetchStreakLeaderboard,
  fetchTienCanhScoreLeaderboard,
  fetchTienCanhStreakLeaderboard,
  type ApiLeaderboardProfile,
} from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { getCultivationRank } from '../../pages/ProgressPage/cultivationRanks';
import './Leaderboard.css';

type RankMetric = 'streak' | 'score' | 'tien_canh_score' | 'tien_canh_streak';
type LoadState = 'loading' | 'ready' | 'error';

type LeaderboardUser = {
  id: string;
  name: string;
  avatar: string;
  avatarColor: string;
  streak: number;
  score: number;
  tienCanhScore: number;
  tienCanhStreak: number;
  rank?: number;
  isCurrentUser?: boolean;
};

const flameIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

const trophyIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

// Icon ngôi sao cho Tiên cảnh
const starIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
  </svg>
);

const metricTabs: { id: RankMetric; label: string; unit: string; icon: ReactNode }[] = [
  { id: 'streak', label: 'Streak', unit: 'ngày', icon: flameIcon },
  { id: 'score', label: 'Score', unit: 'điểm', icon: trophyIcon },
];

const medalIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" />
    <path d="M11 12 5.12 2.2" />
    <path d="m13 12 5.88-9.8" />
    <path d="M8 7h8" />
    <circle cx="12" cy="17" r="5" />
    <path d="M12 18v-2h-.5" />
  </svg>
);

const medals: ReactNode[] = [medalIcon, medalIcon, medalIcon];
const formatScore = (value: number) => value.toLocaleString('vi-VN');

function mapProfile(profile: ApiLeaderboardProfile, currentUserId?: string): LeaderboardUser {
  return {
    id: profile.id,
    name: profile.name,
    avatar: profile.avatar_text || profile.name.slice(0, 2).toUpperCase(),
    avatarColor: profile.avatar_color || 'linear-gradient(135deg, #64748b, #334155)',
    streak: profile.streak,
    score: profile.score,
    tienCanhScore: profile.tien_canh_score ?? 0,
    tienCanhStreak: profile.tien_canh_streak ?? 0,
    rank: profile.rank,
    isCurrentUser: profile.id === currentUserId,
  };
}

type LeaderboardProps = {
  limit?: number;
  metric?: RankMetric;
  title?: string;
  period?: string;
};

const fetchByMetric: Record<RankMetric, (limit: number) => Promise<ApiLeaderboardProfile[]>> = {
  streak: fetchStreakLeaderboard,
  score: fetchScoreLeaderboard,
  tien_canh_score: fetchTienCanhScoreLeaderboard,
  tien_canh_streak: fetchTienCanhStreakLeaderboard,
};

const metricUnit: Record<RankMetric, string> = {
  streak: 'ngày',
  score: 'điểm',
  tien_canh_score: 'điểm',
  tien_canh_streak: 'ngày',
};

export default function Leaderboard({
  limit = 10,
  metric,
  title = 'Bảng xếp hạng',
  period = 'Tuần này',
}: LeaderboardProps) {
  const { user } = useAuth();
  const [selectedMetric, setSelectedMetric] = useState<RankMetric>('streak');
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const requestId = useRef(0);
  const activeMetric = metric ?? selectedMetric;
  const activeTab = metricTabs.find(t => t.id === activeMetric) ?? metricTabs[0];
  const unit = metricUnit[activeMetric];

  const loadLeaderboard = useCallback(async () => {
    const id = ++requestId.current;
    setLoadState('loading');

    try {
      const data = await fetchByMetric[activeMetric](limit);
      if (id !== requestId.current) return;

      setUsers(data.map(profile => mapProfile(profile, user?.id)));
      setLoadState('ready');
    } catch {
      if (id !== requestId.current) return;

      setUsers([]);
      setLoadState('error');
    }
  }, [activeMetric, limit, user?.id]);

  useEffect(() => {
    void loadLeaderboard();
  }, [loadLeaderboard]);

  const renderValue = (leaderboardUser: LeaderboardUser): string => {
    switch (activeMetric) {
      case 'tien_canh_score': return formatScore(leaderboardUser.tienCanhScore);
      case 'tien_canh_streak': return String(leaderboardUser.tienCanhStreak);
      case 'score': return formatScore(leaderboardUser.score);
      default: return String(leaderboardUser.streak);
    }
  };

  const renderSub = (leaderboardUser: LeaderboardUser): string => {
    switch (activeMetric) {
      case 'tien_canh_score': return `${leaderboardUser.tienCanhStreak} ngày chuỗi`;
      case 'tien_canh_streak': return `${formatScore(leaderboardUser.tienCanhScore)} điểm`;
      case 'score': return `${leaderboardUser.streak} ngày chuỗi`;
      default: return `${formatScore(leaderboardUser.score)} điểm`;
    }
  };

  const showState = loadState !== 'ready' || users.length === 0;

  const renderState = () => {
    if (loadState === 'loading') {
      return <p className="leaderboard-state">Đang tải bảng xếp hạng...</p>;
    }

    if (loadState === 'error') {
      return (
        <div className="leaderboard-state leaderboard-state--error" role="alert">
          <p>Không thể tải xếp hạng {activeTab.label}.</p>
          <button className="leaderboard-retry" type="button" onClick={() => void loadLeaderboard()}>
            Thử lại
          </button>
        </div>
      );
    }

    return <p className="leaderboard-state">Chưa có dữ liệu {activeTab.label}.</p>;
  };

  // Icon hiển thị bên cạnh value
  const valueIcon = (activeMetric === 'tien_canh_score' || activeMetric === 'tien_canh_streak')
    ? starIcon
    : activeMetric === 'streak' ? flameIcon : trophyIcon;

  return (
    <section className="dashboard-card leaderboard-card">
      <div className="leaderboard-head">
        <div className="leaderboard-title-wrap">
          <h2 className="card-title leaderboard-title">{title}</h2>
          <span className="leaderboard-period">{period}</span>
        </div>
        {!metric && <div className="leaderboard-tabs" role="tablist" aria-label="Chọn thống số xếp hạng">
          {metricTabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeMetric === tab.id}
              className={`leaderboard-tab ${activeMetric === tab.id ? 'active' : ''}`}
              onClick={() => setSelectedMetric(tab.id)}
            >
              <span className="leaderboard-tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>}
      </div>

      {showState ? renderState() : (
        <ol className="leaderboard-list">
          {users.map((leaderboardUser, index) => {
            const rank = leaderboardUser.rank ?? index + 1;
            const isTop3 = rank <= 3;
            const cultivationRank = activeMetric === 'tien_canh_score'
              ? getCultivationRank(leaderboardUser.tienCanhScore)
              : null;
            return (
              <li
                key={leaderboardUser.id}
                className={`leaderboard-row ${leaderboardUser.isCurrentUser ? 'is-current' : ''} ${isTop3 ? `top-${rank}` : ''}`}
              >
                <span
                  className={`leaderboard-rank${cultivationRank ? ` leaderboard-rank--${cultivationRank.theme} leaderboard-rank--rank-${cultivationRank.rank}` : ''}`}
                  title={cultivationRank ? `${cultivationRank.name} · ${cultivationRank.threshold.toLocaleString('vi-VN')} điểm` : undefined}
                >
                  {cultivationRank ? rank : isTop3 ? <span className="leaderboard-medal">{medals[rank - 1]}</span> : rank}
                </span>
                <div className="leaderboard-avatar" style={{ background: leaderboardUser.avatarColor }}>
                  {leaderboardUser.avatar}
                </div>
                <div className="leaderboard-info">
                  <span className="leaderboard-name">{leaderboardUser.name}</span>
                  <span className="leaderboard-sub">{renderSub(leaderboardUser)}</span>
                </div>
                <div className="leaderboard-value">
                  <span className="leaderboard-value-icon">{valueIcon}</span>
                  <span className="leaderboard-value-num">{renderValue(leaderboardUser)}</span>
                  <span className="leaderboard-value-unit">{unit}</span>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
