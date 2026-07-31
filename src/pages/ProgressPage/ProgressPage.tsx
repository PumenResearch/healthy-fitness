import RankingTree from './RankingTree';
import { cultivationPhases } from './mockData';
import './ProgressPage.css';

export default function ProgressPage() {
  return (
    <div className="progress-page">
      <header className="welcome-section progress-hero">
        <div>
          <span className="progress-kicker">Đạo lộ rèn luyện</span>
          <h1 className="welcome-title">Tiến trình tu luyện</h1>
          <p className="welcome-subtitle">Xem trước Rank Tag và hiệu ứng đặc trưng của từng cảnh giới.</p>
        </div>
      </header>

      <RankingTree phases={cultivationPhases} />
    </div>
  );
}
