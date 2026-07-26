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
    category: { label: 'Chạy bộ', color: '#10b981', type: 'workout' },
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
    category: { label: 'Tập tạ', color: '#e53e3e', type: 'workout' },
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
    author: 'Trương Vô Kỵ',
    avatar: 'VK',
    avatarColor: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    time: '1 giờ trước',
    category: { label: 'Thử thách', color: '#8b5cf6', type: 'category' },
    title: 'Hoàn thành Cửu Dương Thần Công 🌅',
    body: 'Sau 1 năm kiên trì, mình đã hoàn thành toàn bộ thử thách Cửu Dương với 9,800 điểm. Con đường tu luyện dài nhưng đáng giá từng giọt mồ hôi!',
    metrics: { duration: '365 ngày', calories: '98,000 kcal' },
    stats: { likes: 542, comments: 89, shares: 45 },
    reactions: { like: 120, love: 180, fire: 150, clap: 92 },
    topReaction: 'love',
    streak: 0,
    score: 9800,
    comments: [],
  },
  {
    id: 'post-4',
    author: 'Lệnh Hồ Xung',
    avatar: 'HX',
    avatarColor: 'linear-gradient(135deg, #6366f1, #06b6d4)',
    time: '2 giờ trước',
    category: { label: 'Thử thách', color: '#8b5cf6', type: 'category' },
    title: 'Độc Cô Cửu Kiếm - Thức thứ 9 ⚔️',
    body: 'Vượt qua thử thách 100 ngày HIIT không nghỉ. Kiếp nạn cuối cùng đã qua, chỉ còn chờ phi thăng thôi!',
    metrics: { duration: '100 ngày', calories: '52,000 kcal' },
    stats: { likes: 389, comments: 67, shares: 32 },
    reactions: { like: 100, love: 120, fire: 110, clap: 59 },
    topReaction: 'love',
    streak: 0,
    score: 8500,
    comments: [],
  },
  {
    id: 'post-5a',
    author: 'Quách Tĩnh',
    avatar: 'QT',
    avatarColor: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    time: '3 giờ trước',
    category: { label: 'Dinh dưỡng', color: '#f59e0b', type: 'category' },
    title: 'Thực đơn Hàng Long Thập Bát Chưởng 🐉',
    body: 'Chế độ ăn 6 bữa/ngày, 3,200 kcal, macro cân bằng hoàn hảo. Tích lũy đủ 6,800 điểm dinh dưỡng trong 8 tháng!',
    hasImage: true,
    imageGradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 60%, #ec4899 100%)',
    imageEmoji: '🐉',
    metrics: { calories: '3,200 kcal', duration: 'Đạm 185g' },
    stats: { likes: 298, comments: 45, shares: 28 },
    reactions: { like: 90, love: 100, fire: 68, clap: 40 },
    topReaction: 'love',
    streak: 0,
    score: 6800,
    comments: [],
  },
  {
    id: 'post-5b',
    author: 'Dương Quá',
    avatar: 'DQ',
    avatarColor: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
    time: '4 giờ trước',
    category: { label: 'Thử thách', color: '#8b5cf6', type: 'category' },
    title: 'Ngọc Nữ Tâm Kinh - Luyện Hư cảnh 🌀',
    body: 'Hoàn thành 60 ngày meditation + cold exposure liên tiếp. Cảm giác vượt qua giới hạn bản thân, chạm vào hư không!',
    metrics: { duration: '60 ngày', calories: '18,000 kcal' },
    stats: { likes: 245, comments: 38, shares: 19 },
    reactions: { like: 80, love: 75, fire: 55, clap: 35 },
    topReaction: 'like',
    streak: 0,
    score: 4200,
    comments: [],
  },
  {
    id: 'post-5c',
    author: 'Trương Tam Phong',
    avatar: 'TP',
    avatarColor: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
    time: '5 giờ trước',
    category: { label: 'Dinh dưỡng', color: '#f59e0b', type: 'category' },
    title: 'Thái Cực quyền dinh dưỡng ☯️',
    body: 'Cân bằng âm dương trong chế độ ăn: 50% thực vật, 30% protein, 20% healthy fats. Đã duy trì 4 tháng liên tục, đạt Hóa Thần!',
    metrics: { calories: '2,100 kcal', duration: 'Đạm 120g' },
    stats: { likes: 187, comments: 29, shares: 15 },
    reactions: { like: 60, love: 65, fire: 32, clap: 30 },
    topReaction: 'love',
    streak: 0,
    score: 2600,
    comments: [],
  },
  {
    id: 'post-5d',
    author: 'Tiểu Long Nữ',
    avatar: 'LN',
    avatarColor: 'linear-gradient(135deg, #38bdf8, #6366f1)',
    time: '6 giờ trước',
    category: { label: 'Thử thách', color: '#8b5cf6', type: 'category' },
    title: 'Thử thách Ngọc Phong 30 ngày 💎',
    body: 'Vượt qua 30 ngày clean eating + intermittent fasting 16:8. Nguyên Anh đã thành, tiếp tục con đường tu luyện!',
    metrics: { duration: '30 ngày', calories: '1,800 kcal/ngày' },
    stats: { likes: 156, comments: 22, shares: 11 },
    reactions: { like: 55, love: 50, fire: 28, clap: 23 },
    topReaction: 'like',
    streak: 0,
    score: 1500,
    comments: [],
  },
  {
    id: 'post-5e',
    author: 'Đoàn Dự',
    avatar: 'DD',
    avatarColor: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    time: '8 giờ trước',
    category: { label: 'Dinh dưỡng', color: '#f59e0b', type: 'category' },
    title: 'Lục Mạch Thần Kiếm dinh dưỡng 🗡️',
    body: 'Kết đan thành công! Meal prep 6 bữa chuẩn macro trong 2 tháng, đạt 720 điểm. Kim Đan đã thành, tiếp tục luyện!',
    hasImage: true,
    imageGradient: 'linear-gradient(135deg, #fbbf24 0%, #84cc16 60%, #10b981 100%)',
    imageEmoji: '🗡️',
    metrics: { calories: '2,400 kcal', duration: 'Đạm 150g' },
    stats: { likes: 98, comments: 16, shares: 7 },
    reactions: { like: 40, love: 28, fire: 18, clap: 12 },
    topReaction: 'like',
    streak: 0,
    score: 720,
    comments: [],
  },
  {
    id: 'post-5f',
    author: 'Hư Trúc',
    avatar: 'HT',
    avatarColor: 'linear-gradient(135deg, #22d3ee, #06b6d4)',
    time: '10 giờ trước',
    category: { label: 'Thử thách', color: '#8b5cf6', type: 'category' },
    title: 'Thiên Sơn Lục Dương Chưởng 🏔️',
    body: 'Xây nền tảng vững chắc với 3 tuần tập core + flexibility mỗi ngày. Trúc Cơ đã thành, cảm giác cơ thể khác hẳn!',
    metrics: { duration: '21 ngày', calories: '8,400 kcal' },
    stats: { likes: 72, comments: 11, shares: 4 },
    reactions: { like: 30, love: 20, fire: 14, clap: 8 },
    topReaction: 'like',
    streak: 0,
    score: 380,
    comments: [],
  },
  {
    id: 'post-5g',
    author: 'Vi Tiểu Bảo',
    avatar: 'VB',
    avatarColor: 'linear-gradient(135deg, #a3e635, #84cc16)',
    time: '12 giờ trước',
    category: { label: 'Dinh dưỡng', color: '#f59e0b', type: 'category' },
    title: 'Bắt đầu Luyện Khí với meal prep 🍱',
    body: 'Tuần đầu tiên chuẩn bị bữa ăn theo công thức healthy. Mới 150 điểm thôi nhưng đã thấy khác biệt rõ ràng!',
    metrics: { calories: '1,900 kcal', duration: 'Đạm 95g' },
    stats: { likes: 45, comments: 8, shares: 2 },
    reactions: { like: 22, love: 12, fire: 6, clap: 5 },
    topReaction: 'like',
    streak: 0,
    score: 150,
    comments: [],
  },
  {
    id: 'post-5h',
    author: 'Lâm Bình Chi',
    avatar: 'BC',
    avatarColor: 'linear-gradient(135deg, #94a3b8, #64748b)',
    time: 'Hôm qua',
    category: { label: 'Dinh dưỡng', color: '#f59e0b', type: 'category' },
    title: 'Ngày đầu bước vào giang hồ 🌿',
    body: 'Mới tham gia cộng đồng, đăng bữa ăn đầu tiên. Phàm Nhân khởi đầu, hy vọng sớm Luyện Khí thành công!',
    metrics: { calories: '1,600 kcal' },
    stats: { likes: 28, comments: 5, shares: 1 },
    reactions: { like: 15, love: 8, fire: 3, clap: 2 },
    topReaction: 'like',
    streak: 0,
    score: 45,
    comments: [],
  },
  {
    id: 'post-5',
    author: 'Bùi Minh Tâm',
    avatar: 'MT',
    avatarColor: 'linear-gradient(135deg, #ec4899, #f43f5e)',
    time: '2 ngày trước',
    category: { label: 'Yoga', color: '#10b981', type: 'workout' },
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
    category: { label: 'Chạy bộ', color: '#10b981', type: 'workout' },
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

const suggestedPeople = [
  { id: 's1', name: 'Coach Phạm Khang', role: 'Huấn luyện viên cá nhân', avatar: 'PK', avatarColor: 'linear-gradient(135deg, #10b981, #059669)', followers: '12.4k' },
  { id: 's2', name: 'Dinh dưỡng Thảo', role: 'Chuyên gia dinh dưỡng', avatar: 'NT', avatarColor: 'linear-gradient(135deg, #8b5cf6, #ec4899)', followers: '8.7k' },
  { id: 's3', name: 'Runner Gia Huy', role: 'VĐV chạy marathon', avatar: 'GH', avatarColor: 'linear-gradient(135deg, #3b82f6, #6366f1)', followers: '6.1k' },
];

const filters = [
  { id: 'all', label: 'Tất cả' },
  { id: 'workout', label: 'Tập luyện' },
  { id: 'food', label: 'Ăn uống' },
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
      </div>

      <div className="feed-layout">
        <div className="feed-main">
          <div className="feed-composer dashboard-card">
            <div className="composer-avatar">NT</div>
            <button className="composer-input">Bạn vừa tập gì hôm nay?</button>
            <button className="feed-new-post-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Đăng bài
            </button>
          </div>

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
          <Leaderboard limit={5} />
        </aside>
      </div>
    </>
  );
}
