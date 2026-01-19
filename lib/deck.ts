import { Card } from './types/card';

const POSITIVE_TRAITS = [
  'Heightened Instincts',
  'Keen Senses',
  'Agile Movement',
  'Efficient Forager',
  'Tough Hide',
  'Social Bonds',
  'Clear Communication',
  'High Fertility',
  'Ancestral Memory',
  'Established Territory',
  'Tool Use',
  'Mutual Support',
  'Cunning Intelligence',
  'Rapid Adaptability',
  'Durable Physiology',
  'Dominant Presence',
  'Lasting Lineage'
];

const NEUTRAL_TRAITS = [
  'Vigilant Instincts',
  'Inquisitive Senses',
  'Variable Gait',
  'Opportunistic Foraging',
  'Moderate Defense',
  'Loose Social Structure',
  'Flexible Communication',
  'Seasonal Fertility',
  'Selective Memory',
  'Flexible Territory',
  'Tool Borrowing',
  'Conditional Symbiosis',
  'Adaptive Intelligence',
  'Trait Plasticity',
  'Recovering Physiology',
  'Contested Dominance',
  'Uncertain Lineage'
];

const NEGATIVE_TRAITS = [
  'Erratic Instincts',
  'Impaired Senses',
  'Uncoordinated Movement',
  'Chronic Hunger',
  'Brittle Armor',
  'Fractured Social Bonds',
  'Disruptive Signals',
  'Unstable Reproduction',
  'Memory Loss',
  'Overextended Territory',
  'Crude Tool Use',
  'Parasitic Dependence',
  'Cognitive Overload',
  'Maladaptive Evolution',
  'Fragile Physiology',
  'Unchecked Aggression',
  'Broken Lineage'
];

const WILD_TRAIT = 'Evolutionary Catalyst';

export function createDeck(): Card[] {
  const deck: Card[] = [];

  POSITIVE_TRAITS.forEach((name, index) => {
    deck.push({
      id: `positive-${index}`,
      name,
      traitCategory: 'positive',
    });
  });

  NEUTRAL_TRAITS.forEach((name, index) => {
    deck.push({
      id: `neutral-${index}`,
      name,
      traitCategory: 'neutral',
    });
  });

  NEGATIVE_TRAITS.forEach((name, index) => {
    deck.push({
      id: `negative-${index}`,
      name,
      traitCategory: 'negative',
    });
  });

  deck.push({
    id: 'wild-0',
    name: WILD_TRAIT,
    traitCategory: 'wild',
  });

  return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getCardDisplayName(card: Card): string {
  return card.name;
}
