import type { Post, ReactionKey } from '../types';
import { reactionMeta } from '../constants.tsx';
import StreakTag from './StreakTag';
import ScoreTag from './ScoreTag';
import RankTag from '../../../ProgressPage/RankTag';
import { getCultivationRank } from '../../../ProgressPage/cultivationRanks';
import './FeedPost.css';

interface FeedPostProps {
  post: Post;
  index: number;
  userReaction: ReactionKey | null;
  isReactionPickerOpen: boolean;
  isCommentsOpen: boolean;
  draftComment: string;
  onToggleReactions: (postId: string) => void;
  onPickReaction: (postId: string, reaction: ReactionKey) => void;
  onToggleComments: (postId: string) => void;
  onDraftChange: (postId: string, value: string) => void;
  onSubmitComment: (postId: string) => void;
  isTienCanh: boolean;
}

export default function FeedPost({
  post,
  index,
  userReaction,
  isReactionPickerOpen,
  isCommentsOpen,
  draftComment,
  onToggleReactions,
  onPickReaction,
  onToggleComments,
  onDraftChange,
  onSubmitComment,
  isTienCanh,
}: FeedPostProps) {
  const totalReactions = Object.values(post.reactions).reduce((a, b) => a + b, 0);
  const cultivationRank = post.score == null ? null : getCultivationRank(post.score);

  return (
    <article className="feed-post dashboard-card" style={{ animationDelay: `${index * 80}ms` }}>
      <header className="post-header">
        <div className="post-avatar" style={{ background: post.avatarColor }}>{post.avatar}</div>
        <div className="post-meta">
          <div className="post-author-row">
            <span className="post-author">{post.author}</span>
            {isTienCanh && cultivationRank ? (
              <RankTag
                name={cultivationRank.name}
                rank={cultivationRank.rank}
                theme={cultivationRank.theme}
              />
            ) : post.category.type === 'workout' ? (
              <StreakTag streak={post.streak} />
            ) : (
              post.score != null && <ScoreTag score={post.score} />
            )}
            {post.category.type !== 'secret' && (
              <span className="post-category" style={{ background: `${post.category.color}1f`, color: post.category.color }}>
                {post.category.label}
              </span>
            )}
          </div>
          <span className="post-time">{post.time}</span>
        </div>
        <button className="post-menu" aria-label="Tùy chọn bài đăng">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="19" cy="12" r="1"></circle>
            <circle cx="5" cy="12" r="1"></circle>
          </svg>
        </button>
      </header>

      <div className="post-body">
        <h3 className="post-title">{post.title}</h3>
        <p className="post-text">{post.body}</p>

        {post.hasImage && (
          post.imageUrl ? (
            <div className="post-media post-media--image">
              <img src={post.imageUrl} alt="" aria-hidden="true" className="post-media-backdrop" />
              <img src={post.imageUrl} alt={post.title || 'Post image'} className="post-media-img" />
              {(post.metrics.distance || post.metrics.duration || post.metrics.calories || post.metrics.pace) && (
                <div className="post-media-metrics">
                  {post.metrics.distance && <span>📈 {post.metrics.distance}</span>}
                  {post.metrics.duration && <span>⏱️ {post.metrics.duration}</span>}
                  {post.metrics.calories && <span>🔥 {post.metrics.calories}</span>}
                  {post.metrics.pace && <span>⚡ {post.metrics.pace}</span>}
                </div>
              )}
            </div>
          ) : (
            <div className="post-media" style={{ background: post.imageGradient }}>
              <span className="post-media-emoji">{post.imageEmoji}</span>
              <div className="post-media-metrics">
                {post.metrics.distance && <span>📈 {post.metrics.distance}</span>}
                {post.metrics.duration && <span>⏱️ {post.metrics.duration}</span>}
                {post.metrics.calories && <span>🔥 {post.metrics.calories}</span>}
                {post.metrics.pace && <span>⚡ {post.metrics.pace}</span>}
              </div>
            </div>
          )
        )}

        {!post.hasImage && Object.keys(post.metrics).length > 0 && (
          <div className="post-inline-metrics">
            {post.metrics.distance && <span>📈 {post.metrics.distance}</span>}
            {post.metrics.duration && <span>⏱️ {post.metrics.duration}</span>}
            {post.metrics.calories && <span>🔥 {post.metrics.calories}</span>}
            {post.metrics.pace && <span>⚡ {post.metrics.pace}</span>}
          </div>
        )}
      </div>

      <footer className="post-footer">
        <div className="post-reaction-row">
          <div className="post-reaction-summary">
            <span className="reaction-stack">
              {(['fire', 'love', 'like'] as ReactionKey[])
                .filter(r => post.reactions[r] > 0)
                .slice(0, 3)
                .map(r => (
                  <span key={r} className="reaction-stack-icon" style={{ color: reactionMeta[r].color }}>{reactionMeta[r].icon}</span>
                ))}
            </span>
            <span className="reaction-count">{totalReactions}</span>
          </div>
          <span className="post-stat-meta">{post.stats.comments} bình luận · {post.stats.shares} chia sẻ</span>
        </div>

        <div className="post-actions">
          <div className="reaction-wrap">
            <button
              className={`post-action ${userReaction ? 'reacted' : ''}`}
              style={userReaction ? { color: reactionMeta[userReaction].color } : undefined}
              onClick={() => onToggleReactions(post.id)}
            >
              <span className="action-icon">{userReaction ? reactionMeta[userReaction].icon : reactionMeta.like.icon}</span>
              <span>{userReaction ? reactionMeta[userReaction].label : 'Thích'}</span>
            </button>
            {isReactionPickerOpen && (
              <div className="reaction-picker" role="listbox" aria-label="Chọn cảm xúc">
                {(Object.keys(reactionMeta) as ReactionKey[]).map(key => (
                  <button
                    key={key}
                    className="reaction-option"
                    onClick={() => onPickReaction(post.id, key)}
                    aria-label={reactionMeta[key].label}
                    style={{ color: reactionMeta[key].color }}
                  >
                    <span className="reaction-option-icon">{reactionMeta[key].icon}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="post-action" onClick={() => onToggleComments(post.id)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>Bình luận</span>
          </button>
          <button className="post-action">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16 6 12 2 8 6"></polyline>
              <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
            <span>Chia sẻ</span>
          </button>
        </div>

        {isCommentsOpen && (
          <div className="post-comments">
            <div className="comment-list">
              {post.comments.length === 0 && (
                <p className="comment-empty">Chưa có bình luận. Hãy là người đầu tiên!</p>
              )}
              {post.comments.map(c => (
                <div key={c.id} className="comment-item">
                  <div className="comment-avatar" style={{ background: c.avatarColor }}>{c.avatar}</div>
                  <div className="comment-bubble">
                    <span className="comment-author">{c.author}</span>
                    <span className="comment-text">{c.text}</span>
                    <span className="comment-time">{c.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="comment-composer">
              <div className="composer-avatar composer-avatar--sm">NT</div>
              <input
                type="text"
                className="comment-input"
                placeholder="Viết bình luận..."
                value={draftComment}
                onChange={e => onDraftChange(post.id, e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') onSubmitComment(post.id); }}
              />
              <button
                className="comment-send"
                onClick={() => onSubmitComment(post.id)}
                disabled={!draftComment.trim()}
                aria-label="Gửi bình luận"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        )}
      </footer>
    </article>
  );
}
