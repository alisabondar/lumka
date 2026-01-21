import { applyTrait } from '../game/traitLogic';
import type { State } from '../types/playerState';
import type { Trait } from '../types/trait';

describe('traitLogic', () => {
  describe('applyTrait', () => {
    it('should add trait to state', () => {
      const initialState: State = {
        traits: [],
        score: 0,
        stability: 10,
      };

      const trait: Trait = {
        id: 'test-trait-1',
        name: 'Test Trait',
        category: 'positive',
        description: 'A test trait',
      };

      const newState = applyTrait(initialState, trait);

      expect(newState.traits.length).toBe(1);
      expect(newState.traits[0]).toEqual(trait);
    });

    it('should apply trait effects if apply function exists', () => {
      const initialState: State = {
        traits: [],
        score: 0,
        stability: 10,
      };

      const trait: Trait = {
        id: 'test-trait-2',
        name: 'Score Booster',
        category: 'positive',
        description: 'Increases score',
        apply: (state: State) => ({
          ...state,
          score: state.score + 5,
        }),
      };

      const newState = applyTrait(initialState, trait);

      expect(newState.score).toBe(5);
      expect(newState.stability).toBe(10);
      expect(newState.traits.length).toBe(1);
    });

    it('should handle multiple traits', () => {
      const initialState: State = {
        traits: [],
        score: 0,
        stability: 10,
      };

      const trait1: Trait = {
        id: 'trait-1',
        name: 'Trait 1',
        category: 'positive',
        description: 'First trait',
        apply: (state: State) => ({
          ...state,
          score: state.score + 2,
        }),
      };

      const trait2: Trait = {
        id: 'trait-2',
        name: 'Trait 2',
        category: 'neutral',
        description: 'Second trait',
        apply: (state: State) => ({
          ...state,
          score: state.score + 1,
        }),
      };

      const state1 = applyTrait(initialState, trait1);
      const state2 = applyTrait(state1, trait2);

      expect(state2.traits.length).toBe(2);
      expect(state2.score).toBe(3);
    });

    it('should preserve existing traits when applying new one', () => {
      const initialState: State = {
        traits: [
          {
            id: 'existing-trait',
            name: 'Existing Trait',
            category: 'positive',
            description: 'Already here',
          },
        ],
        score: 5,
        stability: 10,
      };

      const newTrait: Trait = {
        id: 'new-trait',
        name: 'New Trait',
        category: 'neutral',
        description: 'New one',
      };

      const newState = applyTrait(initialState, newTrait);

      expect(newState.traits.length).toBe(2);
      expect(newState.traits[0].id).toBe('existing-trait');
      expect(newState.traits[1].id).toBe('new-trait');
      expect(newState.score).toBe(5);
    });

    it('should handle trait with complex apply function', () => {
      const initialState: State = {
        traits: [],
        score: 10,
        stability: 5,
      };

      const complexTrait: Trait = {
        id: 'complex-trait',
        name: 'Complex Trait',
        category: 'wild',
        description: 'Does multiple things',
        apply: (state: State) => ({
          ...state,
          score: state.score + 3,
          stability: state.stability + 2,
        }),
      };

      const newState = applyTrait(initialState, complexTrait);

      expect(newState.score).toBe(13);
      expect(newState.stability).toBe(7);
      expect(newState.traits.length).toBe(1);
    });
  });
});

