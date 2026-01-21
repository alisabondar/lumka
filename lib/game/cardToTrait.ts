import { Card } from '../types/card';
import { Trait } from '../types/trait';
import { State } from '../types/playerState';

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
    description: CATEGORY_DESCRIPTIONS[card.traitCategory] || '',
    apply: (state: State): State => {
      const newState = { ...state };

      if (card.traitCategory === 'positive') {
        newState.score += 2;
        newState.stability += 1;
      } else if (card.traitCategory === 'neutral') {
        newState.score += 1;
      } else if (card.traitCategory === 'negative') {
        newState.score += 1;
        newState.stability = Math.max(0, newState.stability - 2);
      } else if (card.traitCategory === 'wild') {
        newState.score += 1;
      }

      return newState;
    },
  };
}
