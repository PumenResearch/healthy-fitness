import { useState } from 'react';
import type { ReactNode } from 'react';
import './Leaderboard.css';

type RankMetric = 'streak' | 'score';

type LeaderboardUser = {
  id: string;
  name: string;
  avatar: string;
  avatarColor: string;
  streak: number;
  score: number;
  isCurrentUser?: boolean;
};

const leaderboardUsers: LeaderboardUser[] = [
  { id: 'u1', name: 'Lê Minh Anh', avatar: 'MA', avatarColor: 'linear-gradient(135deg, #e53e3e, #ff6b35)', streak: 47, score: 8420 },
  { id: 'u2', name: 'Huỳnh Gia Huy', avatar: 'GH', avatarColor: 'linear-gradient(135deg, #3b82f6, #6366f1)', streak: 38, score: 6280 },
  { id: 'u3', name: 'Đặng Quốc Bảo', avatar: 'QB', avatarColor: 'linear-gradient(135deg, #06b6d4, #3b82f6)', streak: 31, score: 7150 },
  { id: 'u4', name: 'Võ Thảo Nguyên', avatar: 'TN', avatarColor: 'linear-gradient(135deg, #8b5cf6, #ec4899)', streak: 24, score: 5940 },
  { id: 'u5', name: 'Nguyễn Thành', avatar: 'NT', avatarColor: 'linear-gradient(135deg, #e53e3e, #ff6b35)', streak: 15, score: 4320, isCurrentUser: true },
  { id: 'u6', name: 'Bùi Minh Tâm', avatar: 'MT', avatarColor: 'linear-gradient(135deg, #ec4899, #f43f5e)', streak: 12, score: 3870 },
  { id: 'u7', name: 'Phạm Khang', avatar: 'PK', avatarColor: 'linear-gradient(135deg, #10b981, #059669)', streak: 9, score: 6800 },
  { id: 'u8', name: 'Bùi Đức', avatar: 'BD', avatarColor: 'linear-gradient(135deg, #f59e0b, #f97316)', streak: 6, score: 2540 },
];

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

export default function Leaderboard() {
  const [activeMetric, setActiveMetric] = useState<RankMetric>('streak');

  const sorted = [...leaderboardUsers].sort((a, b) =>
    activeMetric === 'streak' ? b.streak - a.streak : b.score - a.score
  );

  const currentUserRank = sorted.findIndex(u => u.isCurrentUser) + 1;
  const currentUser = leaderboardUsers.find(u => u.isCurrentUser);
  const activeTab = metricTabs.find(t => t.id === activeMetric)!;

  const renderValue = (user: LeaderboardUser) =>
    activeMetric === 'streak' ? `${user.streak}` : formatScore(user.score);

  return (
    <section className="dashboard-card leaderboard-card">
      <div className="leaderboard-head">
        <div className="leaderboard-title-wrap">
          <h2 className="card-title leaderboard-title">Bảng xếp hạng</h2>
          <span className="leaderboard-period">Tuần này</span>
        </div>
        <div className="leaderboard-tabs" role="tablist" aria-label="Chọn thống số xếp hạng">
          {metricTabs.map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeMetric === tab.id}
              className={`leaderboard-tab ${activeMetric === tab.id ? 'active' : ''}`}
              onClick={() => setActiveMetric(tab.id)}
            >
              <span className="leaderboard-tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <ol className="leaderboard-list">
        {sorted.map((user, index) => {
          const rank = index + 1;
          const isTop3 = rank <= 3;
          return (
            <li
              key={user.id}
              className={`leaderboard-row ${user.isCurrentUser ? 'is-current' : ''} ${isTop3 ? `top-${rank}` : ''}`}
            >
              <span className="leaderboard-rank">
                {isTop3 ? <span className="leaderboard-medal">{medals[index]}</span> : rank}
              </span>
              <div className="leaderboard-avatar" style={{ background: user.avatarColor }}>
                {user.avatar}
              </div>
              <div className="leaderboard-info">
                <span className="leaderboard-name">
                  {user.name}
                  {user.isCurrentUser && <span className="leaderboard-you">Bạn</span>}
                </span>
                <span className="leaderboard-sub">
                  {activeMetric === 'streak'
                    ? `${formatScore(user.score)} điểm`
                    : `${user.streak} ngày chuỗi`}
                </span>
              </div>
              <div className="leaderboard-value">
                <span className="leaderboard-value-num">{renderValue(user)}</span>
                <span className="leaderboard-value-unit">{activeTab.unit}</span>
              </div>
            </li>
          );
        })}
      </ol>

      {currentUser && currentUserRank > 3 && (
        <div className="leaderboard-self">
          <span className="leaderboard-self-rank">#{currentUserRank}</span>
          <div className="leaderboard-avatar leaderboard-avatar--sm" style={{ background: currentUser.avatarColor }}>
            {currentUser.avatar}
          </div>
          <div className="leaderboard-self-info">
            <span className="leaderboard-self-name">Vị trí của bạn</span>
            <span className="leaderboard-self-sub">
              {activeMetric === 'streak'
                ? `${currentUser.streak} ngày · ${formatScore(currentUser.score)} điểm`
                : `${formatScore(currentUser.score)} điểm · ${currentUser.streak} ngày`}
            </span>
          </div>
          <div className="leaderboard-value">
            <span className="leaderboard-value-num">{renderValue(currentUser)}</span>
            <span className="leaderboard-value-unit">{activeTab.unit}</span>
          </div>
        </div>
      )}
    </section>
  );
}
