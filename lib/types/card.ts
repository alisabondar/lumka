import { TraitCategory } from './trait';

export interface Card {
  id: string;
  name: string;
  traitCategory: TraitCategory;
}

export const CATEGORY_ICONS: Record<TraitCategory, string> = {
  positive: '🩶',
  neutral: '⚙️',
  negative: '⛓️',
  wild: '✨',
};

export const CATEGORY_NAMES: Record<TraitCategory, string> = {
  positive: 'FLOURISH',
  neutral: 'ADAPT',
  negative: 'BURDEN',
  wild: 'CATALYST',
};

export const CATEGORY_COLORS: Record<TraitCategory, string> = {
  positive: '#4ecdc4',
  neutral: '#4FC3F7',
  negative: '#ff6b6b',
  wild: '#ffe66d',
};
