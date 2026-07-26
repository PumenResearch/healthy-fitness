import type { ReactionKey } from './types';

export const reactionMeta: Record<ReactionKey, { emoji: string; label: string; color: string }> = {
  like: { emoji: '👍', label: 'Thích', color: '#3b82f6' },
  love: { emoji: '❤️', label: 'Yêu thích', color: '#ec4899' },
  fire: { emoji: '🔥', label: 'Đỉnh', color: '#ff6b35' },
  clap: { emoji: '👏', label: 'Tuyệt vời', color: '#10b981' },
};
