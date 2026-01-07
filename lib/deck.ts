import { Card, Suit, Rank, SUIT_COLORS } from './types/card';
import { TraitCategory } from './types/trait';

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS: Rank[] = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];

/**
 * Creates a deck of cards with randomly assigned traits
 * Distribution: 17 positive, 17 neutral, 17 negative, 1 wild
 */
export function createDeck(): Card[] {
  const deck: Card[] = [];

  // Create all 52 cards first
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        suit,
        rank,
        color: SUIT_COLORS[suit],
        id: `${suit}-${rank}`,
        traitCategory: 'neutral', // Placeholder, will be assigned below
      });
    }
  }

  // Assign traits randomly: 17 positive, 17 neutral, 17 negative, 1 wild
  const traitDistribution: TraitCategory[] = [
    ...Array(17).fill('positive' as TraitCategory),
    ...Array(17).fill('neutral' as TraitCategory),
    ...Array(17).fill('negative' as TraitCategory),
    'wild' as TraitCategory,
  ];

  // Shuffle the trait distribution
  for (let i = traitDistribution.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [traitDistribution[i], traitDistribution[j]] = [traitDistribution[j], traitDistribution[i]];
  }

  // Assign traits to cards
  deck.forEach((card, index) => {
    card.traitCategory = traitDistribution[index];
  });

  return deck;
}

/**
 * Shuffles a deck of cards using Fisher-Yates algorithm
 * @param deck - The deck to shuffle
 * @returns A new shuffled deck
 */
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getCardDisplayName(card: Card): string {
  return `${card.rank} of ${card.suit.charAt(0).toUpperCase() + card.suit.slice(1)}`;
}
