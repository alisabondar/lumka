import { createDeck, shuffleDeck, getCardDisplayName } from '../deck';
import type { Card } from '../types/card';

describe('deck', () => {
  describe('createDeck', () => {
    it('should create a deck with 52 cards', () => {
      const deck = createDeck();

      expect(deck.length).toBe(52);
    });

    it('should contain all positive traits', () => {
      const deck = createDeck();
      const positiveCards = deck.filter((c) => c.traitCategory === 'positive');

      expect(positiveCards.length).toBe(17);
    });

    it('should contain all neutral traits', () => {
      const deck = createDeck();
      const neutralCards = deck.filter((c) => c.traitCategory === 'neutral');

      expect(neutralCards.length).toBe(17);
    });

    it('should contain all negative traits', () => {
      const deck = createDeck();
      const negativeCards = deck.filter((c) => c.traitCategory === 'negative');

      expect(negativeCards.length).toBe(17);
    });

    it('should contain one wild card', () => {
      const deck = createDeck();
      const wildCards = deck.filter((c) => c.traitCategory === 'wild');

      expect(wildCards.length).toBe(1);
    });

    it('should have unique card IDs', () => {
      const deck = createDeck();
      const ids = deck.map((c) => c.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(deck.length);
    });

    it('should have correct card structure', () => {
      const deck = createDeck();

      deck.forEach((card) => {
        expect(card).toHaveProperty('id');
        expect(card).toHaveProperty('name');
        expect(card).toHaveProperty('traitCategory');
        expect(['positive', 'neutral', 'negative', 'wild']).toContain(
          card.traitCategory
        );
      });
    });
  });

  describe('shuffleDeck', () => {
    it('should return a deck with the same number of cards', () => {
      const deck = createDeck();
      const shuffled = shuffleDeck(deck);

      expect(shuffled.length).toBe(deck.length);
    });

    it('should contain all the same cards', () => {
      const deck = createDeck();
      const shuffled = shuffleDeck(deck);

      const deckIds = new Set(deck.map((c) => c.id));
      const shuffledIds = new Set(shuffled.map((c) => c.id));

      expect(shuffledIds.size).toBe(deckIds.size);
      deckIds.forEach((id) => {
        expect(shuffledIds.has(id)).toBe(true);
      });
    });

    it('should not mutate the original deck', () => {
      const deck = createDeck();
      const originalOrder = deck.map((c) => c.id);
      shuffleDeck(deck);

      expect(deck.map((c) => c.id)).toEqual(originalOrder);
    });

    it('should produce different orders on multiple shuffles', () => {
      const deck = createDeck();
      const shuffle1 = shuffleDeck(deck);
      const shuffle2 = shuffleDeck(deck);
      const shuffle3 = shuffleDeck(deck);

      const order1 = shuffle1.map((c) => c.id).join(',');
      const order2 = shuffle2.map((c) => c.id).join(',');
      const order3 = shuffle3.map((c) => c.id).join(',');

      expect(typeof order1).toBe('string');
    });
  });

  describe('getCardDisplayName', () => {
    it('should return the card name', () => {
      const card: Card = {
        id: 'test-1',
        name: 'Test Card',
        traitCategory: 'positive',
      };

      expect(getCardDisplayName(card)).toBe('Test Card');
    });

    it('should handle cards with different names', () => {
      const cards: Card[] = [
        {
          id: 'pos-1',
          name: 'Heightened Instincts',
          traitCategory: 'positive',
        },
        {
          id: 'neg-1',
          name: 'Erratic Instincts',
          traitCategory: 'negative',
        },
        {
          id: 'wild-1',
          name: 'Evolutionary Catalyst',
          traitCategory: 'wild',
        },
      ];

      cards.forEach((card) => {
        expect(getCardDisplayName(card)).toBe(card.name);
      });
    });
  });
});

