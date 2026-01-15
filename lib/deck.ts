import { Card } from './types/card';

const POSITIVE_TRAITS = [
  'Lively Instinct',
  'Sharp Senses',
  'Nimble Movement',
  'Efficient Foraging',
  'Resilient Hide',
  'Cooperative Bonds',
  'Clear Signals',
  'Fertile Cycle',
  'Living Memory',
  'Claimed Territory',
  'Clever Tools',
  'Mutual Aid',
  'Clever Mind',
  'Rapid Adaptation',
  'Enduring Form',
  'Natural Authority',
  'Enduring Legacy',
];

const NEUTRAL_TRAITS = [
  'Watchful Instinct',
  'Curious Senses',
  'Shifting Gait',
  'Opportunistic Feeding',
  'Measured Defense',
  'Loose Hierarchy',
  'Adaptive Signals',
  'Seasonal Breeding',
  'Selective Recall',
  'Flexible Territory',
  'Borrowed Tools',
  'Conditional Symbiosis',
  'Adaptive Reasoning',
  'Plastic Traits',
  'Recovering Frame',
  'Contested Dominance',
  'Uncertain Inheritance',
];

const NEGATIVE_TRAITS = [
  'Erratic Instinct',
  'Dulled Senses',
  'Clumsy Movement',
  'Constant Hunger',
  'Brittle Shell',
  'Fractured Bonds',
  'Noisy Signals',
  'Unstable Cycle',
  'Fading Memory',
  'Overextended Range',
  'Crude Implements',
  'Parasitic Dependence',
  'Overthinking Brain',
  'Maladaptive Drift',
  'Fragile Form',
  'Unchecked Aggression',
  'Crumbled Legacy',
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
