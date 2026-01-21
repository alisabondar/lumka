import { cardToTrait } from '../game/cardToTrait';
import type { Card } from '../types/card';
import type { State } from '../types/playerState';

describe('cardToTrait', () => {
  describe('cardToTrait', () => {
    it('should convert positive card to trait with correct effects', () => {
      const card: Card = {
        id: 'positive-0',
        name: 'Heightened Instincts',
        traitCategory: 'positive',
      };

      const trait = cardToTrait(card);
      const initialState: State = {
        traits: [],
        score: 0,
        stability: 10,
      };

      const newState = trait.apply!(initialState);

      expect(trait.id).toBe(card.id);
      expect(trait.name).toBe(card.name);
      expect(trait.category).toBe('positive');
      expect(newState.score).toBe(2);
      expect(newState.stability).toBe(11);
    });

    it('should convert neutral card to trait with correct effects', () => {
      const card: Card = {
        id: 'neutral-0',
        name: 'Vigilant Instincts',
        traitCategory: 'neutral',
      };

      const trait = cardToTrait(card);
      const initialState: State = {
        traits: [],
        score: 0,
        stability: 10,
      };

      const newState = trait.apply!(initialState);

      expect(trait.category).toBe('neutral');
      expect(newState.score).toBe(1);
      expect(newState.stability).toBe(10);
    });

    it('should convert negative card to trait with correct effects', () => {
      const card: Card = {
        id: 'negative-0',
        name: 'Erratic Instincts',
        traitCategory: 'negative',
      };

      const trait = cardToTrait(card);
      const initialState: State = {
        traits: [],
        score: 0,
        stability: 10,
      };

      const newState = trait.apply!(initialState);

      expect(trait.category).toBe('negative');
      expect(newState.score).toBe(1);
      expect(newState.stability).toBe(8);
    });

    it('should convert wild card to trait with correct effects', () => {
      const card: Card = {
        id: 'wild-0',
        name: 'Evolutionary Catalyst',
        traitCategory: 'wild',
      };

      const trait = cardToTrait(card);
      const initialState: State = {
        traits: [],
        score: 0,
        stability: 10,
      };

      const newState = trait.apply!(initialState);

      expect(trait.category).toBe('wild');
      expect(newState.score).toBe(1);
      expect(newState.stability).toBe(10);
    });

    it('should not reduce stability below 0', () => {
      const card: Card = {
        id: 'negative-0',
        name: 'Erratic Instincts',
        traitCategory: 'negative',
      };

      const trait = cardToTrait(card);
      const lowStabilityState: State = {
        traits: [],
        score: 0,
        stability: 1,
      };

      const newState = trait.apply!(lowStabilityState);

      expect(newState.stability).toBeGreaterThanOrEqual(0);
    });
  });
});
