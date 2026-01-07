import { State } from '../types/playerState';
import { TraitCategory } from '../types/trait';

export type Challenge = {
  id: string;
  name: string;
  description: string;
  check: (state: State) => boolean;
};

export type Ante = {
  id: string;
  ante: number;
  name: string;
  color: string;
  challenges: Challenge[];
};

// Helper functions for challenge checks
function getTraitCounts(state: State): Record<TraitCategory, number> {
  const counts: Record<TraitCategory, number> = {
    positive: 0,
    neutral: 0,
    negative: 0,
    wild: 0,
  };

  state.traits.forEach(trait => {
    counts[trait.category] = (counts[trait.category] || 0) + 1;
  });

  return counts;
}

function getTotalTraits(state: State): number {
  return state.traits.length;
}

function getCategoryPercentage(state: State, category: TraitCategory): number {
  const total = getTotalTraits(state);
  if (total === 0) return 0;
  const counts = getTraitCounts(state);
  return (counts[category] / total) * 100;
}

function hasDuplicatedTrait(state: State): boolean {
  const traitIds = state.traits.map(t => t.id);
  // Check if any trait ID contains '-dup-' (from wild duplication)
  return traitIds.some(id => id.includes('-dup-'));
}

function getMaxCategoryCount(state: State): number {
  const counts = getTraitCounts(state);
  return Math.max(counts.positive, counts.neutral, counts.negative, counts.wild);
}

// Ante 1 - Survival & Identity
const ante1Challenges: Challenge[] = [
  {
    id: '1A',
    name: 'Viable Genome',
    description: 'At least 3 total traits, Stability ≥ 8',
    check: (state) => getTotalTraits(state) >= 3 && state.stability >= 8,
  },
  {
    id: '1B',
    name: 'Defined Nature',
    description: 'At least 2 traits of the same category, No more than 1 negative',
    check: (state) => {
      const counts = getTraitCounts(state);
      const hasTwoSameCategory = counts.positive >= 2 || counts.neutral >= 2 || counts.negative >= 2 || counts.wild >= 2;
      return hasTwoSameCategory && counts.negative <= 1;
    },
  },
];

// Ante 2 - Adaptation
const ante2Challenges: Challenge[] = [
  {
    id: '2A',
    name: 'Balanced Adaptation',
    description: '≥ 1 positive, ≥ 1 neutral, ≥ 1 negative',
    check: (state) => {
      const counts = getTraitCounts(state);
      return counts.positive >= 1 && counts.neutral >= 1 && counts.negative >= 1;
    },
  },
  {
    id: '2B',
    name: 'Controlled Risk',
    description: 'Negative traits ≤ 30% of total, Stability ≥ 6',
    check: (state) => {
      const negativePercent = getCategoryPercentage(state, 'negative');
      return negativePercent <= 30 && state.stability >= 6;
    },
  },
];

// Ante 3 - Optimization
const ante3Challenges: Challenge[] = [
  {
    id: '3A',
    name: 'Specialization',
    description: '≥ 4 traits of the same category, Score ≥ targetScore',
    check: (state) => {
      const counts = getTraitCounts(state);
      const hasFourSame = counts.positive >= 4 || counts.neutral >= 4 || counts.negative >= 4 || counts.wild >= 4;
      const targetScore = 15; // Base target score for ante 3
      return hasFourSame && state.score >= targetScore;
    },
  },
  {
    id: '3B',
    name: 'Evolutionary Pressure',
    description: 'At least 1 duplicated trait (wild effect), Stability ≥ 5',
    check: (state) => hasDuplicatedTrait(state) && state.stability >= 5,
  },
];

// Ante 4 - Tradeoffs
const ante4Challenges: Challenge[] = [
  {
    id: '4A',
    name: 'Fragile Power',
    description: '≥ 5 positive traits, Stability ≤ 5',
    check: (state) => {
      const counts = getTraitCounts(state);
      return counts.positive >= 5 && state.stability <= 5;
    },
  },
  {
    id: '4B',
    name: 'Adapt or Die',
    description: 'At least 2 negative traits, Score ≥ targetScore × 1.2',
    check: (state) => {
      const counts = getTraitCounts(state);
      const targetScore = 20; // Base target score for ante 4
      return counts.negative >= 2 && state.score >= targetScore * 1.2;
    },
  },
];

// Ante 5 - Endgame
const ante5Challenges: Challenge[] = [
  {
    id: '5A',
    name: 'Dominant Species',
    description: 'Total traits ≥ 10, ≥ 6 traits share a category',
    check: (state) => {
      const total = getTotalTraits(state);
      const counts = getTraitCounts(state);
      const hasSixSame = counts.positive >= 6 || counts.neutral >= 6 || counts.negative >= 6 || counts.wild >= 6;
      return total >= 10 && hasSixSame;
    },
  },
  {
    id: '5B',
    name: 'Evolution Complete',
    description: 'Stability > 0, Score ≥ 30, No category exceeds 60%',
    check: (state) => {
      const finalTargetScore = 30;
      const total = getTotalTraits(state);
      if (total === 0) return false;

      const positivePercent = getCategoryPercentage(state, 'positive');
      const neutralPercent = getCategoryPercentage(state, 'neutral');
      const negativePercent = getCategoryPercentage(state, 'negative');
      const wildPercent = getCategoryPercentage(state, 'wild');

      const noCategoryExceeds60 =
        positivePercent <= 60 &&
        neutralPercent <= 60 &&
        negativePercent <= 60 &&
        wildPercent <= 60;

      return state.stability > 0 && state.score >= finalTargetScore && noCategoryExceeds60;
    },
  },
];

// Ante 6 - Final Evolution
const ante6Challenges: Challenge[] = [
  {
    id: '6A',
    name: 'Perfect Balance',
    description: 'Total traits ≥ 12, Stability ≥ 8, Score ≥ 40',
    check: (state) => {
      return getTotalTraits(state) >= 12 && state.stability >= 8 && state.score >= 40;
    },
  },
  {
    id: '6B',
    name: 'Ultimate Cat',
    description: 'Total traits ≥ 15, All challenge types represented, Stability > 0',
    check: (state) => {
      const counts = getTraitCounts(state);
      const hasAllTypes = counts.positive > 0 && counts.neutral > 0 && counts.negative > 0;
      return getTotalTraits(state) >= 15 && hasAllTypes && state.stability > 0;
    },
  },
];

export const ANTES: Ante[] = [
  {
    id: '1',
    ante: 1,
    name: 'Survival & Identity',
    color: '🟢',
    challenges: ante1Challenges,
  },
  {
    id: '2',
    ante: 2,
    name: 'Adaptation',
    color: '🟡',
    challenges: ante2Challenges,
  },
  {
    id: '3',
    ante: 3,
    name: 'Optimization',
    color: '🟠',
    challenges: ante3Challenges,
  },
  {
    id: '4',
    ante: 4,
    name: 'Tradeoffs',
    color: '🔴',
    challenges: ante4Challenges,
  },
  {
    id: '5',
    ante: 5,
    name: 'Endgame',
    color: '⚫',
    challenges: ante5Challenges,
  },
  {
    id: '6',
    ante: 6,
    name: 'Final Evolution',
    color: '🟣',
    challenges: ante6Challenges,
  },
];

export function checkAnte(state: State, ante: Ante): boolean {
  // Player wins if they meet at least one challenge
  return ante.challenges.some(challenge => challenge.check(state));
}

export function getAnteForRound(round: number): Ante | null {
  if (round < 1 || round > ANTES.length) {
    return null;
  }
  return ANTES[round - 1] || null;
}

