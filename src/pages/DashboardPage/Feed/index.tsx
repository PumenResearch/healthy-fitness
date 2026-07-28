import { useState, useEffect, useCallback, useRef } from 'react';
import Leaderboard from '../../../components/Leaderboard';
import FeedPost from './FeedPost';
import CreatePostModal from './CreatePostModal';
import { fetchPosts, type ApiPost, type PostFilter } from '../../../lib/api';
import { useToast } from '../../../contexts/ToastContext';
import type { Post, ReactionKey, Comment } from './types';
import './Feed.css';

function apiPostToLocal(apiPost: ApiPost): Post {
  const metrics: Record<string, string> = {};
  if (apiPost.distance) metrics.distance = `${apiPost.distance} km`;
  if (apiPost.duration) metrics.duration = `${apiPost.duration} phút`;
  if (apiPost.calories) metrics.calories = `${apiPost.calories} kcal`;
  if (apiPost.pace) metrics.pace = `${apiPost.pace} /km`;

  const createdAt = new Date(apiPost.created_at);
  const now = new Date();
  const diffMs = now.getTime() - createdAt.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  let time = 'Vừa xong';
  if (diffMin >= 1440) time = `${Math.floor(diffMin / 1440)} ngày trước`;
  else if (diffMin >= 60) time = `${Math.floor(diffMin / 60)} giờ trước`;
  else if (diffMin >= 1) time = `${diffMin} phút trước`;

  return {
    id: apiPost.id,
    author: apiPost.author.name,
    avatar: apiPost.author.avatar_text,
    avatarColor: apiPost.author.avatar_color,
    time,
    category: {
      label: apiPost.category.label,
      color: apiPost.category.color,
      type: apiPost.category.type,
    },
    title: apiPost.title,
    body: apiPost.body,
    hasImage: (apiPost.images && apiPost.images.length > 0) || false,
    imageUrl: apiPost.images?.[0]?.url,
    metrics,
    stats: {
      likes: Object.values(apiPost.reactions).reduce((a, b) => a + b, 0),
      comments: apiPost.commentCount,
      shares: 0,
    },
    reactions: {
      like: apiPost.reactions.like || 0,
      love: apiPost.reactions.love || 0,
      fire: apiPost.reactions.fire || 0,
      clap: apiPost.reactions.clap || 0,
    },
    topReaction: (apiPost.topReaction as ReactionKey) || 'like',
    comments: [],
    streak: apiPost.streak_snapshot,
    score: apiPost.score_snapshot ?? undefined,
  };
}

const filters: { id: PostFilter; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'workout', label: 'Tập luyện' },
  { id: 'category', label: 'Ăn uống' },
];

type LoadState = 'loading' | 'ready' | 'error';

export default function Feed() {
  const { showToast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeFilter, setActiveFilter] = useState<PostFilter>('all');
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [openReactionFor, setOpenReactionFor] = useState<string | null>(null);
  const [userReactions, setUserReactions] = useState<Record<string, ReactionKey | null>>({});
  const [openCommentsFor, setOpenCommentsFor] = useState<Record<string, boolean>>({});
  const [draftComments, setDraftComments] = useState<Record<string, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState<string | undefined>(undefined);
  const loadRequestId = useRef(0);

  const loadPosts = useCallback(async () => {
    const requestId = ++loadRequestId.current;
    setLoadState('loading');

    try {
      const data = await fetchPosts({ limit: 20, filter: activeFilter });
      if (requestId !== loadRequestId.current) return;

      setPosts(data.posts.map(apiPostToLocal));
      setLoadState('ready');
    } catch {
      if (requestId !== loadRequestId.current) return;

      setPosts([]);
      setLoadState('error');
      showToast('Không thể tải bài viết. Vui lòng thử lại.', 'error');
    }
  }, [activeFilter, showToast]);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const handleOpenModal = (category?: string) => {
    setModalCategory(category);
    setIsModalOpen(true);
  };

  const handlePostCreated = () => {
    void loadPosts();
  };

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

  const activeFilterLabel = filters.find(filter => filter.id === activeFilter)?.label || 'đã chọn';

  return (
    <>
      <div className="welcome-section feed-header">
        <div>
          <h1 className="welcome-title">Bảng tin</h1>
          <p className="welcome-subtitle">Cập nhật hoạt động và chia sẻ thành tích cùng cộng đồng Healthy Fitness</p>
        </div>
      </div>

      <div className="feed-layout">
        <div className="feed-main">
          <div className="feed-composer dashboard-card">
            <div className="composer-top-row">
              <div className="composer-avatar">NT</div>
              <button
                className="composer-input"
                onClick={() => handleOpenModal()}
              >
                Bạn vừa tập gì hôm nay? Chia sẻ ngay...
              </button>
              <button
                className="feed-new-post-btn"
                onClick={() => handleOpenModal()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Đăng bài
              </button>
            </div>
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

          <div className="feed-posts" aria-live="polite">
            {loadState === 'loading' && (
              <div className="feed-state dashboard-card">Đang tải bài viết...</div>
            )}

            {loadState === 'error' && (
              <div className="feed-state feed-state--error dashboard-card" role="alert">
                <p>Không thể tải bài viết lúc này.</p>
                <button className="feed-retry" type="button" onClick={() => void loadPosts()}>
                  Thử lại
                </button>
              </div>
            )}

            {loadState === 'ready' && posts.length === 0 && (
              <div className="feed-state dashboard-card">
                {activeFilter === 'all'
                  ? 'Chưa có bài viết nào. Hãy là người đầu tiên chia sẻ hoạt động của bạn!'
                  : `Chưa có bài viết trong mục ${activeFilterLabel}.`}
              </div>
            )}

            {loadState === 'ready' && posts.map((post, index) => (
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

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={handlePostCreated}
        initialCategory={modalCategory}
      />
    </>
  );
}
