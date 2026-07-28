import { useAuth } from '../../contexts/AuthContext';

export default function Dashboard() {
  const { profile } = useAuth();
  const stats = [
    { id: 'stat-calories', modifier: 'calories', value: '1,847 kcal', label: 'Calories hôm nay', change: '+12% so với hôm qua', isPositive: true, icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
      </svg>
    )},
    { id: 'stat-workouts', modifier: 'workouts', value: '3/5 bài', label: 'Bài tập hoàn thành', change: '+1 so với hôm qua', isPositive: true, icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
    )},
    { id: 'stat-streak', modifier: 'streak', value: `${profile?.streak ?? 0} ngày`, label: 'Chuỗi ngày tập', change: `Kỷ lục: ${profile?.longest_streak ?? 0} ngày`, isPositive: true, icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2c1.5 2 3 3.5 3 5.5A4.5 4.5 0 0 1 10.5 12c-1.5-2-1.5-3-1.5-3s-.5 1-1 3C6 14.5 7.5 18 12 18s6-3.5 4-8.5C16 6 12 2 12 2z"></path>
        <path d="M12 22a8 8 0 1 0 0-16"></path>
      </svg>
    )},
    { id: 'stat-weight', modifier: 'weight', value: '72.5 kg', label: 'Cân nặng', change: '-0.5kg tuần này', isPositive: true, icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18"></path>
        <rect x="4" y="6" width="16" height="12" rx="2"></rect>
        <path d="M8 10h8"></path>
      </svg>
    )},
  ];

  const weeklyData = [
    { day: 'T2', value: 65 },
    { day: 'T3', value: 80 },
    { day: 'T4', value: 45 },
    { day: 'T5', value: 90 },
    { day: 'T6', value: 70 },
    { day: 'T7', value: 85 },
    { day: 'CN', value: 40 },
  ];

  const activities = [
    { id: 'act-1', name: 'Chest & Triceps', time: '2 giờ trước', duration: '45 phút', color: '#e53e3e', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 6.5h-3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3M17.5 6.5h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-3M6.5 4v16M17.5 4v16M6.5 12h11"/></svg>
    )},
    { id: 'act-2', name: 'Chạy bộ 5km', time: '5 giờ trước', duration: '32 phút', color: '#10b981', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 4v16M17 4v16M9 4v16M5 4v16"/></svg>
    )},
    { id: 'act-3', name: 'Yoga buổi sáng', time: 'Hôm qua', duration: '60 phút', color: '#8b5cf6', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>
    )},
    { id: 'act-4', name: 'Leg Day', time: 'Hôm qua', duration: '50 phút', color: '#3b82f6', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 6.5h-3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3M17.5 6.5h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-3M6.5 4v16M17.5 4v16M6.5 12h11"/></svg>
    )},
  ];

  return (
    <>
      <div className="welcome-section">
        <h1>Xin chào, Thành! 💪</h1>
        <p>Hôm nay là một ngày tuyệt vời để tập luyện</p>
      </div>

      <div className="stats-grid">
        {stats.map(stat => (
          <div key={stat.id} className={`stat-card stat-card--${stat.modifier}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className={`stat-change ${stat.isPositive ? 'positive' : 'negative'}`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card chart-section">
          <div className="card-header">
            <h2 className="card-title">Hoạt động tuần này</h2>
            <button className="card-action">Xem tất cả</button>
          </div>
          <div className="chart-container">
            <div className="chart-bars">
              {weeklyData.map(data => (
                <div key={`chart-${data.day}`} className="chart-bar-wrapper">
                  <div className="chart-bar" style={{ height: `${data.value}%` }} />
                  <span className="chart-label">{data.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-card activity-section">
          <div className="card-header">
            <h2 className="card-title">Hoạt động gần đây</h2>
            <button className="card-action">Xem tất cả</button>
          </div>
          <div className="activity-list">
            {activities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon" style={{ background: activity.color }}>
                  {activity.icon}
                </div>
                <div className="activity-details">
                  <span className="activity-name">{activity.name}</span>
                  <span className="activity-time">{activity.time}</span>
                </div>
                <span className="activity-duration">{activity.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2 className="card-title">Hành động nhanh</h2>
        <div className="actions-grid">
          <button className="action-card" aria-label="Bắt đầu tập luyện">
            <div className="action-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="10 8 16 12 10 16 10 8"></polygon>
              </svg>
            </div>
            <span>Bắt đầu tập luyện</span>
          </button>
          <button className="action-card" aria-label="Thêm bữa ăn">
            <div className="action-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </div>
            <span>Thêm bữa ăn</span>
          </button>
          <button className="action-card" aria-label="Xem báo cáo">
            <div className="action-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
            </div>
            <span>Xem báo cáo</span>
          </button>
        </div>
      </div>
    </>
  );
}
