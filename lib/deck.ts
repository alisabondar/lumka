import { Card, Suit, Rank, SUIT_COLORS } from './types/card';

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS: Rank[] = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];

export function createDeck(): Card[] {
  const deck: Card[] = [];

  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        suit,
        rank,
        color: SUIT_COLORS[suit],
        id: `${suit}-${rank}`,
      });
    }
  }

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
