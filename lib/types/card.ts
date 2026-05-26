import { TraitCategory } from './trait';

export type FoxVariant =
  | 'alert'
  | 'blossom'
  | 'bonus'
  | 'moss'
  | 'scrappy'
  | 'shadow'
  | 'sleepy'
  | 'snow'
  | 'star'
  | 'sun'
  | 'swift'
  | 'wild'
  | 'wise';

export type CardEffect = {
  score?: number;
  stability?: number;
  bonusScorePerTrait?: number;
  bonusScorePerCategory?: Partial<Record<TraitCategory, number>>;
  bonusStabilityPerCategory?: Partial<Record<TraitCategory, number>>;
  ifNoCategory?: {
    category: TraitCategory;
    score?: number;
    stability?: number;
  };
  ifCategoryCountAtLeast?: {
    category: TraitCategory;
    count: number;
    score?: number;
    stability?: number;
  };
  ifTraitCountAtLeast?: {
    count: number;
    score?: number;
    stability?: number;
  };
  ifStabilityAtMost?: {
    amount: number;
    score?: number;
    stability?: number;
  };
  ifStabilityAtLeast?: {
    amount: number;
    score?: number;
    stability?: number;
  };
};

export interface Card {
  id: string;
  name: string;
  traitCategory: TraitCategory;
  flavorText?: string;
  effectText?: string;
  foxVariant?: FoxVariant;
  effect?: CardEffect;
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
