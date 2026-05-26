import type { Card, CardEffect } from '../types/card';
import type { State } from '../types/playerState';
import type { TraitCategory } from '../types/trait';

const DEFAULT_EFFECTS: Record<TraitCategory, CardEffect> = {
  positive: { score: 2, stability: 1 },
  neutral: { score: 1 },
  negative: { score: 1, stability: -2 },
  wild: { score: 1 },
};

function countCategory(state: State, category: TraitCategory, cardId: string): number {
  return state.traits.filter((trait) => trait.id !== cardId && trait.category === category).length;
}

function applyDelta(state: State, score = 0, stability = 0): State {
  return {
    ...state,
    score: state.score + score,
    stability: Math.max(0, state.stability + stability),
  };
}

export function resolveCardEffect(state: State, card: Card): State {
  const effect = card.effect ?? DEFAULT_EFFECTS[card.traitCategory];
  let next = applyDelta(state, effect.score, effect.stability);

  if (effect.bonusScorePerTrait) {
    next = applyDelta(next, state.traits.length * effect.bonusScorePerTrait);
  }

  if (effect.bonusScorePerCategory) {
    Object.entries(effect.bonusScorePerCategory).forEach(([category, amount]) => {
      next = applyDelta(next, countCategory(state, category as TraitCategory, card.id) * (amount ?? 0));
    });
  }

  if (effect.bonusStabilityPerCategory) {
    Object.entries(effect.bonusStabilityPerCategory).forEach(([category, amount]) => {
      next = applyDelta(next, 0, countCategory(state, category as TraitCategory, card.id) * (amount ?? 0));
    });
  }

  if (effect.ifNoCategory && countCategory(state, effect.ifNoCategory.category, card.id) === 0) {
    next = applyDelta(next, effect.ifNoCategory.score, effect.ifNoCategory.stability);
  }

  if (
    effect.ifCategoryCountAtLeast &&
    countCategory(state, effect.ifCategoryCountAtLeast.category, card.id) >= effect.ifCategoryCountAtLeast.count
  ) {
    next = applyDelta(
      next,
      effect.ifCategoryCountAtLeast.score,
      effect.ifCategoryCountAtLeast.stability,
    );
  }

  if (effect.ifTraitCountAtLeast && state.traits.length >= effect.ifTraitCountAtLeast.count) {
    next = applyDelta(next, effect.ifTraitCountAtLeast.score, effect.ifTraitCountAtLeast.stability);
  }

  if (effect.ifStabilityAtMost && state.stability <= effect.ifStabilityAtMost.amount) {
    next = applyDelta(next, effect.ifStabilityAtMost.score, effect.ifStabilityAtMost.stability);
  }

  if (effect.ifStabilityAtLeast && state.stability >= effect.ifStabilityAtLeast.amount) {
    next = applyDelta(next, effect.ifStabilityAtLeast.score, effect.ifStabilityAtLeast.stability);
  }

  return next;
}
