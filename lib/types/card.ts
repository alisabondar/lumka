export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'Ace' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'Jack' | 'Queen' | 'King';
export type Color = 'red' | 'black';

export interface Card {
  suit: Suit;
  rank: Rank;
  color: Color;
  id: string; // Unique identifier for each card
}

export const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

export const SUIT_COLORS: Record<Suit, Color> = {
  hearts: 'red',
  diamonds: 'red',
  clubs: 'black',
  spades: 'black',
};

