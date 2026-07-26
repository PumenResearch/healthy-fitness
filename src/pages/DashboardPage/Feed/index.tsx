import { useState } from 'react';
import Leaderboard from '../../../components/Leaderboard';
import FeedPost from './FeedPost';
import type { Post, ReactionKey, Comment } from './types';
import './Feed.css';

const initialPosts: Post[] = [
  {
    id: 'post-1',
    author: 'Lê Minh Anh',
    avatar: 'MA',
    avatarColor: 'linear-gradient(135deg, #e53e3e, #ff6b35)',
    time: '15 phút trước',
    category: { label: 'Chạy bộ', color: '#10b981' },
    title: 'Vừa phá kỷ lục cá nhân! 🏃‍♀️',
    body: 'Sáng nay mình chạy 10km trong 52 phút, nhanh hơn kỷ lục cũ 4 phút. Cảm giác xé gió lúc về đích thật sự tuyệt vời. Các bạn có ai đang rèn chạy bộ dài không?',
    hasImage: true,
    imageGradient: 'linear-gradient(135deg, #0ea5e9 0%, #10b981 60%, #059669 100%)',
    imageEmoji: '🏃‍♀️',
    metrics: { distance: '10.2 km', duration: '52:14', calories: '684 kcal', pace: '5:06 /km' },
    stats: { likes: 128, comments: 24, shares: 6 },
    reactions: { like: 64, love: 30, fire: 22, clap: 12 },
    topReaction: 'like',
    streak: 65,
    comments: [
      { id: 'c1', author: 'Nguyễn Thành', avatar: 'NT', avatarColor: 'linear-gradient(135deg, #e53e3e, #ff6b35)', text: 'Tốc độ cực đỉnh! Mình đang kẹt ở 6:00/km, bí kíp gì share với', time: '10 phút trước' },
      { id: 'c2', author: 'Trần Hoàng', avatar: 'TH', avatarColor: 'linear-gradient(135deg, #8b5cf6, #6366f1)', text: 'Tập interval 400m x 8 help mình đẩy pace tốt lắm 👍', time: '7 phút trước' },
    ],
  },
  {
    id: 'post-2',
    author: 'Huỳnh Gia Huy',
    avatar: 'GH',
    avatarColor: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    time: '1 giờ trước',
    category: { label: 'Tập tạ', color: '#e53e3e' },
    title: 'Push Day hoàn thành 💪',
    body: 'Hôm nay đẩy tạ ngực 80kg x 6 rep, lên được 5kg so với tuần trước. Quá trình tăng tiến chậm mà đều đặn mới là bền vững. Ai cùng đội push/pull/legs không?',
    hasImage: true,
    imageGradient: 'linear-gradient(135deg, #e53e3e 0%, #ff6b35 60%, #f59e0b 100%)',
    imageEmoji: '🏋️',
    metrics: { distance: '8 bài', duration: '62 phút', calories: '412 kcal' },
    stats: { likes: 96, comments: 18, shares: 3 },
    reactions: { like: 50, love: 18, fire: 20, clap: 8 },
    topReaction: 'fire',
    streak: 38,
    comments: [
      { id: 'c3', author: 'Phạm Khang', avatar: 'PK', avatarColor: 'linear-gradient(135deg, #10b981, #059669)', text: '80kg là cột mốc lớn rồi, cố lên sắp chạm 100kg thôi 🔥', time: '45 phút trước' },
    ],
  },
  {
    id: 'post-3',
    author: 'Võ Thảo Nguyên',
    avatar: 'TN',
    avatarColor: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
    time: '3 giờ trước',
    category: { label: 'Dinh dưỡng', color: '#f59e0b' },
    title: 'Bữa trưa năng lượng 🥗',
    body: 'Combo gà xé phở healthy: ức gà 180g, rau xào ít dầu, cơm lứt 1 chén. Đạm 42g, carbs 55g, chỉ 480 kcal mà no đến chiều. Mình sẽ đăng công thức chi tiết lên mục Dinh dưỡng nhé.',
    hasImage: true,
    imageGradient: 'linear-gradient(135deg, #f59e0b 0%, #84cc16 60%, #10b981 100%)',
    imageEmoji: '🥗',
    metrics: { calories: '480 kcal', duration: 'Đạm 42g' },
    stats: { likes: 211, comments: 37, shares: 22 },
    reactions: { like: 80, love: 60, fire: 14, clap: 57 },
    topReaction: 'love',
    streak: 24,
    comments: [
      { id: 'c4', author: 'Lê Minh Anh', avatar: 'MA', avatarColor: 'linear-gradient(135deg, #e53e3e, #ff6b35)', text: 'Đẹp mắt lại đủ chất, xin ngay công thức ạ 🙏', time: '2 giờ trước' },
      { id: 'c5', author: 'Bùi Đức', avatar: 'BD', avatarColor: 'linear-gradient(135deg, #06b6d4, #3b82f6)', text: 'Cơm lứt vs cơm trắng thì khác nhau thế nào nhỉ?', time: '1 giờ trước' },
    ],
  },
  {
    id: 'post-4',
    author: 'Đặng Quốc Bảo',
    avatar: 'QB',
    avatarColor: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    time: 'Hôm qua',
    category: { label: 'Thử thách', color: '#8b5cf6' },
    title: 'Thử thách 30 ngày plank ✨',
    body: 'Mình vừa hoàn thành thử thách plank 30 ngày, từ 30 giây lên 3 phút 20 giây. Ai muốn tham gia đợt sau (khởi đầu đầu tháng sau) thì comment "tham gia" nhé, mình sẽ tạo nhóm nhắc nhở.',
    metrics: { duration: '30 ngày', calories: 'PB 3:20' },
    stats: { likes: 174, comments: 56, shares: 14 },
    reactions: { like: 70, love: 30, fire: 24, clap: 50 },
    topReaction: 'clap',
    streak: 10,
    comments: [
      { id: 'c6', author: 'Nguyễn Thành', avatar: 'NT', avatarColor: 'linear-gradient(135deg, #e53e3e, #ff6b35)', text: 'Tham gia! Đang muốn rèn core lại', time: '20 giờ trước' },
    ],
  },
  {
    id: 'post-5',
    author: 'Bùi Minh Tâm',
    avatar: 'MT',
    avatarColor: 'linear-gradient(135deg, #ec4899, #f43f5e)',
    time: '2 ngày trước',
    category: { label: 'Yoga', color: '#10b981' },
    title: 'Phiên yoga chiều thư giãn 🧘',
    body: 'Sau một ngày ngồi văn phòng, 40 phút yoga stretching giúp lưng và vai nhẹ hẳn. Tập trung vào hít thở và kéo giãn cột sống. Gợi ý: cuối giờ tập tư thế savasana 5 phút để hạ nhiệt.',
    hasImage: true,
    imageGradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 60%, #06b6d4 100%)',
    imageEmoji: '🧘',
    metrics: { duration: '40 phút', calories: '160 kcal' },
    stats: { likes: 88, comments: 12, shares: 4 },
    reactions: { like: 40, love: 34, fire: 6, clap: 8 },
    topReaction: 'love',
    streak: 5,
    comments: [],
  },
  {
    id: 'post-6',
    author: 'Trần Hoàng',
    avatar: 'TH',
    avatarColor: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
    time: '3 ngày trước',
    category: { label: 'Chạy bộ', color: '#10b981' },
    title: 'Ngày đầu tiên chạy bộ 🏃',
    body: 'Hôm nay là lần đầu mình ra công viên chạy bộ sau mấy năm không tập. Chỉ chạy được 2km thôi nhưng cảm giác rất phấn khích. Hy vọng sẽ duy trì được lâu dài!',
    hasImage: true,
    imageGradient: 'linear-gradient(135deg, #64748b 0%, #94a3b8 60%, #cbd5e1 100%)',
    imageEmoji: '🏃',
    metrics: { distance: '2.0 km', duration: '18:30', calories: '142 kcal' },
    stats: { likes: 32, comments: 8, shares: 1 },
    reactions: { like: 18, love: 8, fire: 4, clap: 2 },
    topReaction: 'like',
    streak: 1,
    comments: [],
  },
];

const trendingTopics = [
  { id: 't1', tag: '#ChayBo10km', count: '1,2k bài đăng' },
  { id: 't2', tag: '#EatClean', count: '980 bài đăng' },
  { id: 't3', tag: '#Plank30Ngay', count: '640 bài đăng' },
  { id: 't4', tag: '#PushPullLegs', count: '512 bài đăng' },
  { id: 't5', tag: '#YogaBuoiChieu', count: '388 bài đăng' },
];

const suggestedPeople = [
  { id: 's1', name: 'Coach Phạm Khang', role: 'Huấn luyện viên cá nhân', avatar: 'PK', avatarColor: 'linear-gradient(135deg, #10b981, #059669)', followers: '12.4k' },
  { id: 's2', name: 'Dinh dưỡng Thảo', role: 'Chuyên gia dinh dưỡng', avatar: 'NT', avatarColor: 'linear-gradient(135deg, #8b5cf6, #ec4899)', followers: '8.7k' },
  { id: 's3', name: 'Runner Gia Huy', role: 'VĐV chạy marathon', avatar: 'GH', avatarColor: 'linear-gradient(135deg, #3b82f6, #6366f1)', followers: '6.1k' },
];

const filters = [
  { id: 'all', label: 'Tất cả' },
  { id: 'following', label: 'Đang theo dõi' },
  { id: 'workout', label: 'Tập luyện' },
  { id: 'nutrition', label: 'Dinh dưỡng' },
  { id: 'challenge', label: 'Thử thách' },
];

const composeShortcuts = [
  { id: 'workout', label: 'Chia sẻ buổi tập', emoji: '💪', color: '#e53e3e' },
  { id: 'meal', label: 'Đăng bữa ăn', emoji: '🥗', color: '#10b981' },
  { id: 'pr', label: 'Kỷ lục mới', emoji: '🏆', color: '#f59e0b' },
  { id: 'question', label: 'Hỏi đáp', emoji: '💬', color: '#3b82f6' },
];

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [activeFilter, setActiveFilter] = useState('all');
  const [openReactionFor, setOpenReactionFor] = useState<string | null>(null);
  const [userReactions, setUserReactions] = useState<Record<string, ReactionKey | null>>({});
  const [openCommentsFor, setOpenCommentsFor] = useState<Record<string, boolean>>({});
  const [draftComments, setDraftComments] = useState<Record<string, string>>({});

  const toggleReactions = (postId: string) => {
    setOpenReactionFor(prev => prev === postId ? null : postId);
  };

  const pickReaction = (postId: string, reaction: ReactionKey) => {
    const current = userReactions[postId];
    const isTogglingOff = current === reaction;
    setUserReactions(prev => ({ ...prev, [postId]: isTogglingOff ? null : reaction }));
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const nextReactions = { ...p.reactions };
      if (current) nextReactions[current] = Math.max(0, nextReactions[current] - 1);
      if (!isTogglingOff) nextReactions[reaction] += 1;
      const topKey = (Object.keys(nextReactions) as ReactionKey[]).reduce((a, b) =>
        nextReactions[a] >= nextReactions[b] ? a : b
      );
      const likesDelta = isTogglingOff ? -1 : current ? 0 : 1;
      return {
        ...p,
        reactions: nextReactions,
        topReaction: topKey,
        stats: { ...p.stats, likes: p.stats.likes + likesDelta },
      };
    }));
    setOpenReactionFor(null);
  };

  const toggleComments = (postId: string) => {
    setOpenCommentsFor(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleDraftChange = (postId: string, value: string) => {
    setDraftComments(prev => ({ ...prev, [postId]: value }));
  };

  const submitComment = (postId: string) => {
    const text = (draftComments[postId] || '').trim();
    if (!text) return;
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: 'Nguyễn Thành',
      avatar: 'NT',
      avatarColor: 'linear-gradient(135deg, #e53e3e, #ff6b35)',
      text,
      time: 'Vừa xong',
    };
    setPosts(prev => prev.map(p => p.id === postId
      ? { ...p, comments: [...p.comments, newComment], stats: { ...p.stats, comments: p.stats.comments + 1 } }
      : p));
    setDraftComments(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <>
      <div className="welcome-section feed-header">
        <div>
          <h1 className="welcome-title">Bảng tin</h1>
          <p className="welcome-subtitle">Cập nhật hoạt động từ cộng đồng Healthy Fitness</p>
        </div>
        <button className="feed-new-post-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Đăng bài
        </button>
      </div>

      <div className="feed-layout">
        <div className="feed-main">
          <div className="feed-filters">
            {filters.map(f => (
              <button
                key={f.id}
                className={`feed-filter ${activeFilter === f.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="feed-composer dashboard-card">
            <div className="composer-avatar">NT</div>
            <button className="composer-input">Bạn vừa tập gì hôm nay?</button>
          </div>
          <div className="composer-shortcuts">
            {composeShortcuts.map(s => (
              <button key={s.id} className="composer-shortcut">
                <span className="shortcut-emoji" style={{ background: `${s.color}22`, color: s.color }}>{s.emoji}</span>
                {s.label}
              </button>
            ))}
          </div>

          <div className="feed-posts">
            {posts.map((post, index) => (
              <FeedPost
                key={post.id}
                post={post}
                index={index}
                userReaction={userReactions[post.id] ?? null}
                isReactionPickerOpen={openReactionFor === post.id}
                isCommentsOpen={!!openCommentsFor[post.id]}
                draftComment={draftComments[post.id] ?? ''}
                onToggleReactions={toggleReactions}
                onPickReaction={pickReaction}
                onToggleComments={toggleComments}
                onDraftChange={handleDraftChange}
                onSubmitComment={submitComment}
              />
            ))}
          </div>
        </div>

        <aside className="feed-sidebar">
          <Leaderboard />

          <section className="dashboard-card sidebar-card">
            <h2 className="card-title sidebar-card-title">Chủ đề nổi bật</h2>
            <ul className="trending-list">
              {trendingTopics.map(t => (
                <li key={t.id} className="trending-item">
                  <span className="trending-tag">{t.tag}</span>
                  <span className="trending-count">{t.count}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="dashboard-card sidebar-card">
            <h2 className="card-title sidebar-card-title">Gợi ý theo dõi</h2>
            <ul className="suggest-list">
              {suggestedPeople.map(s => (
                <li key={s.id} className="suggest-item">
                  <div className="suggest-avatar" style={{ background: s.avatarColor }}>{s.avatar}</div>
                  <div className="suggest-info">
                    <span className="suggest-name">{s.name}</span>
                    <span className="suggest-role">{s.role} · {s.followers} theo dõi</span>
                  </div>
                  <button className="suggest-follow">Theo dõi</button>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </>
  );
}
