import { TraitCategory } from './trait';

export interface Card {
  id: string;
  name: string;
  traitCategory: TraitCategory;
}

export const CATEGORY_LABELS: Record<TraitCategory, string> = {
  positive: '🌱 FLOURISH',
  neutral: '⚖️ ADAPT',
  negative: '🪨 BURDEN',
  wild: '✨ CATALYST',
};

export const CATEGORY_COLORS: Record<TraitCategory, string> = {
  positive: '#4ecdc4', // neon-teal
  neutral: '#4FC3F7',  // neon-blue
  negative: '#ff6b6b', // neon-pink
  wild: '#ffe66d',     // neon-yellow
};
