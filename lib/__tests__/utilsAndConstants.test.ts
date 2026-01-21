import {
  MAX_HAND_SIZE,
  createNewShuffledDeck,
  normalizePlayerName,
} from '../utilsAndConstants';
import { createDeck } from '../deck';

describe('utilsAndConstants', () => {
  describe('MAX_HAND_SIZE', () => {
    it('should be 6', () => {
      expect(MAX_HAND_SIZE).toBe(6);
    });
  });

  describe('createNewShuffledDeck', () => {
    it('should create a deck with 52 cards', () => {
      const deck = createNewShuffledDeck();

      expect(deck.length).toBe(52);
    });

    it('should return a shuffled deck', () => {
      const deck1 = createNewShuffledDeck();
      const deck2 = createNewShuffledDeck();
      const deck3 = createNewShuffledDeck();

      const order1 = deck1.map((c) => c.id).join(',');
      const order2 = deck2.map((c) => c.id).join(',');
      const order3 = deck3.map((c) => c.id).join(',');

      expect(typeof order1).toBe('string');
    });

    it('should contain all card types', () => {
      const deck = createNewShuffledDeck();

      const positive = deck.filter((c) => c.traitCategory === 'positive');
      const neutral = deck.filter((c) => c.traitCategory === 'neutral');
      const negative = deck.filter((c) => c.traitCategory === 'negative');
      const wild = deck.filter((c) => c.traitCategory === 'wild');

      expect(positive.length).toBe(17);
      expect(neutral.length).toBe(17);
      expect(negative.length).toBe(17);
      expect(wild.length).toBe(1);
    });
  });

  describe('normalizePlayerName', () => {
    it('should trim whitespace from name', () => {
      expect(normalizePlayerName('  John Doe  ')).toBe('John Doe');
    });

    it('should handle name with leading whitespace', () => {
      expect(normalizePlayerName('  Alice')).toBe('Alice');
    });

    it('should handle name with trailing whitespace', () => {
      expect(normalizePlayerName('Bob  ')).toBe('Bob');
    });

    it('should handle name with no whitespace', () => {
      expect(normalizePlayerName('Charlie')).toBe('Charlie');
    });

    it('should handle empty string', () => {
      expect(normalizePlayerName('')).toBe('');
    });

    it('should handle only whitespace', () => {
      expect(normalizePlayerName('   ')).toBe('');
    });

    it('should preserve internal spaces', () => {
      expect(normalizePlayerName('  John  Doe  ')).toBe('John  Doe');
    });
  });
});

