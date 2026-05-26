import { Card } from '../types/card';
import { Trait } from '../types/trait';
import { State } from '../types/playerState';
import { resolveCardEffect } from './cardEffects';

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  positive: 'A flourishing trait that enhances survival and prosperity',
  neutral: 'An adaptive trait that provides flexibility and balance',
  negative: 'A burdensome trait that tests resilience and adaptation',
  wild: 'An evolutionary catalyst that can transform into any other trait',
};

export function cardToTrait(card: Card): Trait {
  return {
    id: card.id,
    name: card.name,
    category: card.traitCategory,
    description: card.effectText || CATEGORY_DESCRIPTIONS[card.traitCategory] || '',
    apply: (state: State): State => resolveCardEffect(state, card),
  };
}
