export type ReactionKey = 'like' | 'love' | 'fire' | 'clap';

export type Comment = {
  id: string;
  author: string;
  avatar: string;
  avatarColor: string;
  text: string;
  time: string;
};

export type Post = {
  id: string;
  author: string;
  avatar: string;
  avatarColor: string;
  time: string;
  category: { label: string; color: string; type: 'workout' | 'food' | 'rest' | 'secret' };
  title: string;
  body: string;
  hasImage?: boolean;
  imageGradient?: string;
  imageEmoji?: string;
  imageUrl?: string;
  metrics: {
    distance?: string;
    duration?: string;
    calories?: string;
    pace?: string;
  };
  stats: { likes: number; comments: number; shares: number };
  reactions: Record<ReactionKey, number>;
  topReaction: ReactionKey;
  comments: Comment[];
  streak: number;
  score?: number;
  isNew?: boolean;
};
