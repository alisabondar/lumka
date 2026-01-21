import { createDeck, shuffleDeck } from './deck';
import type { Card } from './types/card';

export const MAX_HAND_SIZE = 6;

export function createNewShuffledDeck(): Card[] {
  return shuffleDeck(createDeck());
}

export function normalizePlayerName(name: string): string {
  return name.trim();
}
