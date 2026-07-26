import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Dashboard.css';

const navItems = [
  { id: 'dashboard', label: 'Tổng quan', path: '/dashboard', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"></rect>
      <rect x="14" y="3" width="7" height="7" rx="1"></rect>
      <rect x="14" y="14" width="7" height="7" rx="1"></rect>
      <rect x="3" y="14" width="7" height="7" rx="1"></rect>
    </svg>
  )},
  { id: 'workouts', label: 'Bài tập', path: '/workouts', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5h-3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3M17.5 6.5h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-3M6.5 4v16M17.5 4v16M6.5 12h11"/>
    </svg>
  )},
  { id: 'nutrition', label: 'Dinh dưỡng', path: '/nutrition', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  )},
  { id: 'progress', label: 'Tiến trình', path: '/progress', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  )},
  { id: 'schedule', label: 'Lịch tập', path: '/schedule', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  )},
  { id: 'settings', label: 'Cài đặt', path: '/settings', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  )},
];

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
  { id: 'stat-streak', modifier: 'streak', value: '15 ngày', label: 'Chuỗi ngày tập', change: 'Kỷ lục: 21 ngày', isPositive: true, icon: (
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

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const openMobileSidebar = () => setMobileSidebarOpen(true);
  const closeMobileSidebar = () => setMobileSidebarOpen(false);

  return (
    <div className="dashboard">
      <div
        className={`sidebar-overlay ${mobileSidebarOpen ? 'active' : ''}`}
        onClick={closeMobileSidebar}
        aria-hidden={!mobileSidebarOpen}
      />
      
      <aside id="primary-sidebar" className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6.5 6.5h-3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3M17.5 6.5h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-3M6.5 4v16M17.5 4v16M6.5 12h11"/>
            </svg>
          </div>
          {!sidebarCollapsed && <span className="brand-name">HEALTHY FITNESS</span>}
          <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Thu gọn thanh bên" aria-expanded={!sidebarCollapsed}>
            <svg className={`chevron-icon ${sidebarCollapsed ? 'rotated' : ''}`} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <Link 
              key={item.id}
              to={item.path}
              className={`nav-item ${location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/') ? 'active' : ''}`}
              title={sidebarCollapsed ? item.label : ''}
              onClick={() => {
                if (window.innerWidth <= 768) closeMobileSidebar();
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              {!sidebarCollapsed && <span className="nav-text">{item.label}</span>}
            </Link>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-avatar">NT</div>
          {!sidebarCollapsed && (
            <div className="user-info">
              <span className="user-name">Nguyễn Thành</span>
              <span className="user-role">Premium Member</span>
            </div>
          )}
        </div>
      </aside>
      
      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <header className="main-header">
          <div className="header-left">
            <button className="mobile-menu-btn" onClick={openMobileSidebar} aria-label="Mở thanh bên" aria-expanded={mobileSidebarOpen} aria-controls="primary-sidebar">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
          <div className="header-search">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" placeholder="Tìm kiếm bài tập, thực phẩm..." aria-label="Tìm kiếm" />
          </div>
          <div className="header-right">
            <button className="header-notification" aria-label="Thông báo">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="notification-badge" aria-label="3 thông báo mới">3</span>
            </button>
            <div className="header-avatar">NT</div>
          </div>
        </header>
        
        <main className="main-body">
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
        </main>
      </div>
    </div>
  );
}
