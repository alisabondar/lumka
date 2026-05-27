import { State } from '../types/playerState';
import { TraitCategory } from '../types/trait';
import { CATEGORY_NAMES } from '../types/card';

export type ChallengeRequirement = {
  label: string;
  met: boolean;
  current?: string;
};

export type Challenge = {
  id: string;
  number: number;
  name: string;
  description: string;
  difficulty: number;
  check: (state: State) => boolean;
};

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

function getCategoryLabel(category: TraitCategory): string {
  return CATEGORY_NAMES[category];
}

function formatCount(count: number): string {
  return `${count}`;
}

function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

function getPatternIndex(challengeNum: number, patternCount: number, advancedPatternCount: number): number {
  const tier = Math.ceil(challengeNum / 10);

  if (tier <= 3) {
    return (challengeNum - 1) % patternCount;
  }

  if (tier <= 6) {
    return (challengeNum - 1) % (patternCount + 5);
  }

  return (challengeNum - 1) % (patternCount + advancedPatternCount);
}

// Start with 10 stability.
function getDifficultyParams(challengeNum: number) {
  const tier = Math.ceil(challengeNum / 10);
  const tierProgress = (challengeNum - 1) % 10;

  return {
    tier,
    tierProgress,
    minTraits: Math.floor(2 + tier * 0.8 + tierProgress * 0.05),
    minScore: Math.floor(4 + tier * 1.6 + tierProgress * 0.15),
    minStability: Math.max(1, Math.floor(7 - tier * 0.5)),
    minCategoryCount: Math.floor(1 + tier * 0.3 + tierProgress * 0.02),
    maxCategoryPct: Math.max(40, 70 - tier * 3),
    minCategoryPct: Math.min(50, 20 + tier * 3),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Challenge Definitions - 100 unique, progressively harder challenges
// ─────────────────────────────────────────────────────────────────────────────

function generateAllChallenges(): Challenge[] {
  const challenges: Challenge[] = [];

  const patterns = [
    // Pattern 0: Trait count + stability
    (num: number, p: ReturnType<typeof getDifficultyParams>) => ({
    name: 'Viable Genome',
      description: `At least ${p.minTraits} traits, Stability ≥ ${p.minStability}`,
      check: (state: State) => getTotalTraits(state) >= p.minTraits && state.stability >= p.minStability,
    }),

    // Pattern 1: Score threshold
    (num: number, p: ReturnType<typeof getDifficultyParams>) => ({
      name: 'Point Threshold',
      description: `Score ≥ ${p.minScore}`,
      check: (state: State) => state.score >= p.minScore,
    }),

    // Pattern 2: Flourish focus
    (num: number, p: ReturnType<typeof getDifficultyParams>) => ({
      name: 'Flourishing Path',
      description: `At least ${p.minCategoryCount} ${getCategoryLabel('positive')} traits`,
      check: (state: State) => getTraitCounts(state).positive >= p.minCategoryCount,
    }),

    // Pattern 3: Adapt focus
    (num: number, p: ReturnType<typeof getDifficultyParams>) => ({
      name: 'Balanced Approach',
      description: `At least ${p.minCategoryCount} ${getCategoryLabel('neutral')} traits`,
      check: (state: State) => getTraitCounts(state).neutral >= p.minCategoryCount,
    }),

    // Pattern 4: Score + stability combo
    (num: number, p: ReturnType<typeof getDifficultyParams>) => ({
      name: 'Optimal Balance',
      description: `Score ≥ ${p.minScore}, Stability ≥ ${p.minStability}`,
      check: (state: State) => state.score >= p.minScore && state.stability >= p.minStability,
    }),

    // Pattern 5: Limited burdens
    (num: number, p: ReturnType<typeof getDifficultyParams>) => {
      const maxNeg = Math.max(0, 4 - Math.floor(p.tier / 2));
      return {
        name: 'Burden Control',
        description: `No more than ${maxNeg} ${getCategoryLabel('negative')} traits, Traits ≥ ${p.minTraits}`,
        check: (state: State) => getTraitCounts(state).negative <= maxNeg && getTotalTraits(state) >= p.minTraits,
      };
    },

    // Pattern 6: Category diversity
    () => ({
      name: 'Diverse Genome',
      description: `≥ 1 ${getCategoryLabel('positive')}, ≥ 1 ${getCategoryLabel('neutral')}, ≥ 1 ${getCategoryLabel('negative')}`,
      check: (state: State) => {
      const counts = getTraitCounts(state);
      return counts.positive >= 1 && counts.neutral >= 1 && counts.negative >= 1;
    },
    }),

    // Pattern 7: Category concentration
    (num: number, p: ReturnType<typeof getDifficultyParams>) => {
      const minSame = Math.floor(2 + p.tier * 0.5);
      return {
    name: 'Specialization',
        description: `At least ${minSame} traits share a category`,
        check: (state: State) => {
      const counts = getTraitCounts(state);
          return counts.positive >= minSame || counts.neutral >= minSame ||
                 counts.negative >= minSame || counts.wild >= minSame;
        },
      };
    },

    // Pattern 8: Catalyst requirement
    (num: number, p: ReturnType<typeof getDifficultyParams>) => {
      const minWild = Math.max(1, Math.floor(p.tier / 3));
      const canUseAdaptFallback = p.tier <= 2;
      return {
        name: 'Catalyst Spark',
        description: canUseAdaptFallback
          ? `At least 1 ${getCategoryLabel('wild')} trait or 2 ${getCategoryLabel('neutral')} traits`
          : `At least ${minWild} ${getCategoryLabel('wild')} trait${minWild > 1 ? 's' : ''}`,
        check: (state: State) => {
          const counts = getTraitCounts(state);
          return counts.wild >= minWild || (canUseAdaptFallback && counts.neutral >= 2);
        },
      };
    },

    // Pattern 9: No category dominance
    (num: number, p: ReturnType<typeof getDifficultyParams>) => ({
      name: 'Even Spread',
      description: `Traits ≥ ${p.minTraits}, no category exceeds ${p.maxCategoryPct}%`,
      check: (state: State) => {
        if (getTotalTraits(state) < p.minTraits) return false;
        const categories: TraitCategory[] = ['positive', 'neutral', 'negative', 'wild'];
        return categories.every(cat => getCategoryPercentage(state, cat) <= p.maxCategoryPct);
      },
    }),
  ];

  const advancedPatterns = [
    // Pattern 10: Flourish majority
    (num: number, p: ReturnType<typeof getDifficultyParams>) => ({
      name: 'Flourish Dominant',
      description: `${getCategoryLabel('positive')} traits ≥ ${p.minCategoryPct}% of total`,
      check: (state: State) => getCategoryPercentage(state, 'positive') >= p.minCategoryPct,
    }),

    // Pattern 11: High score + specific category
    (num: number, p: ReturnType<typeof getDifficultyParams>) => ({
      name: 'Focused Excellence',
      description: `Score ≥ ${p.minScore + 2}, ≥ ${p.minCategoryCount + 1} ${getCategoryLabel('positive')} traits`,
      check: (state: State) => state.score >= p.minScore + 2 && getTraitCounts(state).positive >= p.minCategoryCount + 1,
    }),

    // Pattern 12: Risky build
    (num: number, p: ReturnType<typeof getDifficultyParams>) => {
      const maxStab = Math.max(2, 6 - Math.floor(p.tier / 2));
      return {
        name: 'Edge Walker',
        description: `Stability ≤ ${maxStab}, Traits ≥ ${p.minTraits + 1}`,
        check: (state: State) => state.stability <= maxStab && getTotalTraits(state) >= p.minTraits + 1,
      };
    },

    // Pattern 13: High trait count with stability
    (num: number, p: ReturnType<typeof getDifficultyParams>) => {
      const extraTraits = Math.floor(p.tier / 3) + 1;
      return {
        name: 'Thriving Colony',
        description: `At least ${p.minTraits + extraTraits} traits, Stability ≥ ${p.minStability}`,
        check: (state: State) => getTotalTraits(state) >= p.minTraits + extraTraits && state.stability >= p.minStability,
      };
    },

    // Pattern 14: Multi-category requirements
    (num: number, p: ReturnType<typeof getDifficultyParams>) => {
      const req = Math.floor(1 + p.tier / 3);
      return {
        name: 'Hybrid Vigor',
        description: `≥ ${req} ${getCategoryLabel('positive')}, ≥ ${req} ${getCategoryLabel('neutral')}, Score ≥ ${p.minScore}`,
        check: (state: State) => {
          const counts = getTraitCounts(state);
          return counts.positive >= req && counts.neutral >= req && state.score >= p.minScore;
        },
      };
    },

    // Pattern 15: Complete organism
    (num: number, p: ReturnType<typeof getDifficultyParams>) => ({
      name: 'Complete Organism',
      description: `Traits ≥ ${p.minTraits + 1}, all trait types present, Score ≥ ${p.minScore}`,
      check: (state: State) => {
        const counts = getTraitCounts(state);
        return getTotalTraits(state) >= p.minTraits + 1 &&
               counts.positive > 0 && counts.neutral > 0 && counts.negative > 0 &&
               state.score >= p.minScore;
      },
    }),

    // Pattern 16: Positive ratio
    (num: number, p: ReturnType<typeof getDifficultyParams>) => {
      const ratio = Math.floor(1 + p.tier / 3);
      return {
        name: 'Golden Ratio',
        description: `${getCategoryLabel('positive')} traits ≥ ${ratio} × ${getCategoryLabel('negative')} traits, Traits ≥ ${p.minTraits}`,
        check: (state: State) => {
          const counts = getTraitCounts(state);
          return counts.positive >= counts.negative * ratio && getTotalTraits(state) >= p.minTraits;
        },
      };
    },

    // Pattern 17: Survivor
    (num: number, p: ReturnType<typeof getDifficultyParams>) => ({
      name: 'Survivor',
      description: `Stability > 0, Score ≥ ${p.minScore + 3}, Traits ≥ ${p.minTraits}`,
      check: (state: State) => state.stability > 0 && state.score >= p.minScore + 3 && getTotalTraits(state) >= p.minTraits,
    }),

    // Pattern 18: Positive dominance (positives outnumber negatives)
    (num: number, p: ReturnType<typeof getDifficultyParams>) => {
      const margin = Math.max(1, Math.floor(p.tier / 3));
      return {
        name: 'Flourish Dominance',
        description: `${getCategoryLabel('positive')} traits exceed ${getCategoryLabel('negative')} by at least ${margin}, Traits ≥ ${p.minTraits}`,
        check: (state: State) => {
          const counts = getTraitCounts(state);
          return counts.positive >= counts.negative + margin && getTotalTraits(state) >= p.minTraits;
        },
      };
    },

    // Pattern 19: Ultimate challenge
    (num: number, p: ReturnType<typeof getDifficultyParams>) => ({
      name: 'Perfect Evolution',
      description: `Traits ≥ ${p.minTraits + 2}, Score ≥ ${p.minScore + 4}, Stability ≥ ${p.minStability}`,
      check: (state: State) =>
        getTotalTraits(state) >= p.minTraits + 2 &&
        state.score >= p.minScore + 4 &&
        state.stability >= p.minStability,
    }),
  ];

  // Generate 100 challenges
  for (let i = 1; i <= 100; i++) {
    const params = getDifficultyParams(i);
    const tier = params.tier;

    let patternIndex: number;
    if (tier <= 3) {
      patternIndex = (i - 1) % patterns.length;
    } else if (tier <= 6) {
      patternIndex = (i - 1) % (patterns.length + 5);
    } else {
      patternIndex = (i - 1) % (patterns.length + advancedPatterns.length);
    }

    let challengeData;
    if (patternIndex < patterns.length) {
      challengeData = patterns[patternIndex](i, params);
    } else {
      challengeData = advancedPatterns[patternIndex - patterns.length](i, params);
    }

    challenges.push({
      id: `challenge-${i}`,
      number: i,
      name: challengeData.name,
      description: challengeData.description,
      difficulty: tier,
      check: challengeData.check,
    });
  }

  return challenges;
}

export const CHALLENGES: Challenge[] = generateAllChallenges();

export function getChallenge(num: number): Challenge | null {
  if (num < 1 || num > CHALLENGES.length) return null;
  return CHALLENGES[num - 1];
}

export function checkChallenge(state: State, challenge: Challenge): boolean {
  return challenge.check(state);
}

export function getChallengeRequirements(state: State, challenge: Challenge): ChallengeRequirement[] {
  const params = getDifficultyParams(challenge.number);
  const patternIndex = getPatternIndex(challenge.number, 10, 10);
  const counts = getTraitCounts(state);
  const totalTraits = getTotalTraits(state);

  switch (patternIndex) {
    case 0:
      return [
        { label: `Traits ≥ ${params.minTraits}`, met: totalTraits >= params.minTraits, current: formatCount(totalTraits) },
        { label: `Stability ≥ ${params.minStability}`, met: state.stability >= params.minStability, current: `${state.stability}` },
      ];
    case 1:
      return [
        { label: `Score ≥ ${params.minScore}`, met: state.score >= params.minScore, current: formatCount(state.score) },
      ];
    case 2:
      return [
        {
          label: `${getCategoryLabel('positive')} traits ≥ ${params.minCategoryCount}`,
          met: counts.positive >= params.minCategoryCount,
          current: formatCount(counts.positive),
        },
      ];
    case 3:
      return [
        {
          label: `${getCategoryLabel('neutral')} traits ≥ ${params.minCategoryCount}`,
          met: counts.neutral >= params.minCategoryCount,
          current: formatCount(counts.neutral),
        },
      ];
    case 4:
      return [
        { label: `Score ≥ ${params.minScore}`, met: state.score >= params.minScore, current: formatCount(state.score) },
        { label: `Stability ≥ ${params.minStability}`, met: state.stability >= params.minStability, current: `${state.stability}` },
      ];
    case 5: {
      const maxNeg = Math.max(0, 4 - Math.floor(params.tier / 2));
      return [
        {
          label: `${getCategoryLabel('negative')} traits ≤ ${maxNeg}`,
          met: counts.negative <= maxNeg,
          current: formatCount(counts.negative),
        },
        { label: `Traits ≥ ${params.minTraits}`, met: totalTraits >= params.minTraits, current: formatCount(totalTraits) },
      ];
    }
    case 6:
      return [
        { label: `${getCategoryLabel('positive')} traits ≥ 1`, met: counts.positive >= 1, current: formatCount(counts.positive) },
        { label: `${getCategoryLabel('neutral')} traits ≥ 1`, met: counts.neutral >= 1, current: formatCount(counts.neutral) },
        { label: `${getCategoryLabel('negative')} traits ≥ 1`, met: counts.negative >= 1, current: formatCount(counts.negative) },
      ];
    case 7: {
      const minSame = Math.floor(2 + params.tier * 0.5);
      const largestCategoryCount = Math.max(counts.positive, counts.neutral, counts.negative, counts.wild);
      return [
        {
          label: `Any category traits ≥ ${minSame}`,
          met: largestCategoryCount >= minSame,
          current: formatCount(largestCategoryCount),
        },
      ];
    }
    case 8: {
      const minWild = Math.max(1, Math.floor(params.tier / 3));
      const canUseAdaptFallback = params.tier <= 2;
      return [
        {
          label: canUseAdaptFallback
            ? `${getCategoryLabel('wild')} ≥ 1 or ${getCategoryLabel('neutral')} ≥ 2`
            : `${getCategoryLabel('wild')} traits ≥ ${minWild}`,
          met: counts.wild >= minWild || (canUseAdaptFallback && counts.neutral >= 2),
          current: canUseAdaptFallback
            ? `${counts.wild}/1 or ${counts.neutral}/2`
            : formatCount(counts.wild),
        },
      ];
    }
    case 9: {
      const categoryPercentages = (['positive', 'neutral', 'negative', 'wild'] as TraitCategory[]).map((category) =>
        getCategoryPercentage(state, category)
      );
      const largestCategoryPct = Math.max(...categoryPercentages);
      return [
        { label: `Traits ≥ ${params.minTraits}`, met: totalTraits >= params.minTraits, current: formatCount(totalTraits) },
        {
          label: `Largest category ≤ ${params.maxCategoryPct}%`,
          met: totalTraits >= params.minTraits && largestCategoryPct <= params.maxCategoryPct,
          current: totalTraits === 0 ? '0%' : formatPercentage(largestCategoryPct),
        },
      ];
    }
    case 10:
      return [
        {
          label: `${getCategoryLabel('positive')} share ≥ ${params.minCategoryPct}%`,
          met: getCategoryPercentage(state, 'positive') >= params.minCategoryPct,
          current: formatPercentage(getCategoryPercentage(state, 'positive')),
        },
      ];
    case 11:
      return [
        { label: `Score ≥ ${params.minScore + 2}`, met: state.score >= params.minScore + 2, current: formatCount(state.score) },
        {
          label: `${getCategoryLabel('positive')} traits ≥ ${params.minCategoryCount + 1}`,
          met: counts.positive >= params.minCategoryCount + 1,
          current: formatCount(counts.positive),
        },
      ];
    case 12: {
      const maxStab = Math.max(2, 6 - Math.floor(params.tier / 2));
      return [
        { label: `Stability ≤ ${maxStab}`, met: state.stability <= maxStab, current: `${state.stability}` },
        { label: `Traits ≥ ${params.minTraits + 1}`, met: totalTraits >= params.minTraits + 1, current: formatCount(totalTraits) },
      ];
    }
    case 13: {
      const extraTraits = Math.floor(params.tier / 3) + 1;
      return [
        { label: `Traits ≥ ${params.minTraits + extraTraits}`, met: totalTraits >= params.minTraits + extraTraits, current: formatCount(totalTraits) },
        { label: `Stability ≥ ${params.minStability}`, met: state.stability >= params.minStability, current: `${state.stability}` },
      ];
    }
    case 14: {
      const req = Math.floor(1 + params.tier / 3);
      return [
        { label: `${getCategoryLabel('positive')} traits ≥ ${req}`, met: counts.positive >= req, current: formatCount(counts.positive) },
        { label: `${getCategoryLabel('neutral')} traits ≥ ${req}`, met: counts.neutral >= req, current: formatCount(counts.neutral) },
        { label: `Score ≥ ${params.minScore}`, met: state.score >= params.minScore, current: formatCount(state.score) },
      ];
    }
    case 15:
      return [
        { label: `Traits ≥ ${params.minTraits + 1}`, met: totalTraits >= params.minTraits + 1, current: formatCount(totalTraits) },
        { label: `${getCategoryLabel('positive')} present`, met: counts.positive > 0, current: formatCount(counts.positive) },
        { label: `${getCategoryLabel('neutral')} present`, met: counts.neutral > 0, current: formatCount(counts.neutral) },
        { label: `${getCategoryLabel('negative')} present`, met: counts.negative > 0, current: formatCount(counts.negative) },
        { label: `Score ≥ ${params.minScore}`, met: state.score >= params.minScore, current: formatCount(state.score) },
      ];
    case 16: {
      const ratio = Math.floor(1 + params.tier / 3);
      return [
        {
          label: `${getCategoryLabel('positive')} ≥ ${ratio} × ${getCategoryLabel('negative')}`,
          met: counts.positive >= counts.negative * ratio,
          current: `${counts.positive}:${counts.negative}`,
        },
        { label: `Traits ≥ ${params.minTraits}`, met: totalTraits >= params.minTraits, current: formatCount(totalTraits) },
      ];
    }
    case 17:
      return [
        { label: 'Stability > 0', met: state.stability > 0, current: `${state.stability}` },
        { label: `Score ≥ ${params.minScore + 3}`, met: state.score >= params.minScore + 3, current: formatCount(state.score) },
        { label: `Traits ≥ ${params.minTraits}`, met: totalTraits >= params.minTraits, current: formatCount(totalTraits) },
      ];
    case 18: {
      const margin = Math.max(1, Math.floor(params.tier / 3));
      return [
        {
          label: `${getCategoryLabel('positive')} exceeds ${getCategoryLabel('negative')} by ${margin}`,
          met: counts.positive >= counts.negative + margin,
          current: `${counts.positive} vs ${counts.negative}`,
        },
        { label: `Traits ≥ ${params.minTraits}`, met: totalTraits >= params.minTraits, current: formatCount(totalTraits) },
      ];
    }
    case 19:
      return [
        { label: `Traits ≥ ${params.minTraits + 2}`, met: totalTraits >= params.minTraits + 2, current: formatCount(totalTraits) },
        { label: `Score ≥ ${params.minScore + 4}`, met: state.score >= params.minScore + 4, current: formatCount(state.score) },
        { label: `Stability ≥ ${params.minStability}`, met: state.stability >= params.minStability, current: `${state.stability}` },
      ];
    default:
      return [{ label: challenge.description, met: challenge.check(state) }];
  }
}

export function getDifficultyName(difficulty: number): string {
  const names = [
    'Novice',
    'Beginner',
    'Apprentice',
    'Intermediate',
    'Advanced',
    'Expert',
    'Master',
    'Grandmaster',
    'Legend',
    'Mythic',
  ];
  return names[Math.min(difficulty - 1, names.length - 1)] || 'Unknown';
}

export function getTotalChallengeCount(): number {
  return CHALLENGES.length;
}

export type Ante = {
  id: string;
  ante: number;
  name: string;
  challenges: Challenge[];
};

const ANTE_NAMES = [
  'Survival & Identity',
  'Adaptation',
  'Optimization',
  'Tradeoffs',
  'Endgame',
  'Final Evolution',
  'Transcendence',
  'Apex Predator',
  'Cosmic Being',
  'Ultimate Form',
];

// Group 10 challenges into 10 antes
export const ANTES: Ante[] = Array.from({ length: 10 }, (_, i) => {
  const anteNum = i + 1;
  const startIdx = i * 10;
  const endIdx = startIdx + 10;

  return {
    id: String(anteNum),
    ante: anteNum,
    name: ANTE_NAMES[i] || `Level ${anteNum}`,
    challenges: CHALLENGES.slice(startIdx, endIdx),
  };
});

export function getAnteForRound(round: number): Ante | null {
  if (round < 1 || round > ANTES.length) return null;
  return ANTES[round - 1];
}

export function checkAnte(state: State, ante: Ante): boolean {
  return ante.challenges.some(challenge => challenge.check(state));
}
