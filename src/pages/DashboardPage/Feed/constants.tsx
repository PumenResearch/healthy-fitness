import type { ReactNode } from 'react';
import type { ReactionKey } from './types';

export const reactionMeta: Record<ReactionKey, { icon: ReactNode; label: string; color: string }> = {
  like: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 22V11m-5 2v7a2 2 0 0 0 2 2h12.6a2 2 0 0 0 2-1.6l1.4-8A2 2 0 0 0 18 9h-5V4a2 2 0 0 0-2-2 1 1 0 0 0-1 1v2.6a6 6 0 0 1-1.8 4.3L7 11" />
      </svg>
    ),
    label: 'Thích',
    color: '#3b82f6',
  },
  love: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
    label: 'Yêu thích',
    color: '#ec4899',
  },
  fire: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
      </svg>
    ),
    label: 'Đỉnh',
    color: '#ff6b35',
  },
  clap: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 12L3.27 3.13a1 1 0 0 1 1.36-1.23L12 6l7.37-4.1a1 1 0 0 1 1.36 1.23L18 12" />
        <path d="M12 6v10" />
        <path d="M8 17l-2 4" />
        <path d="M16 17l2 4" />
        <path d="M12 16l0 5" />
      </svg>
    ),
    label: 'Tuyệt vời',
    color: '#10b981',
  },
};
