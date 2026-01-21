import {
  createInitialGameState,
  drawCard,
  discardCards,
  selectCard,
  applyCardAsTrait,
  checkRoundWin,
  advanceRound,
  selectChallenge,
  type GameState,
} from '../game/gameState';
import { createDeck, shuffleDeck } from '../deck';
import { ANTES } from '../game/challenges';
import { MAX_HAND_SIZE } from '../utilsAndConstants';
import type { Card } from '../types/card';
import type { State } from '../types/playerState';

describe('gameState', () => {
  let testDeck: Card[];

  beforeEach(() => {
    testDeck = shuffleDeck(createDeck());
  });

  describe('createInitialGameState', () => {
    it('should create initial game state with correct structure', () => {
      const state = createInitialGameState(testDeck);

      expect(state.round).toBe(1);
      expect(state.status).toBe('playing');
      expect(state.hand.length).toBe(MAX_HAND_SIZE);
      expect(state.deck.length).toBe(testDeck.length - MAX_HAND_SIZE);
      expect(state.discard.length).toBe(0);
      expect(state.playerState.traits.length).toBe(0);
      expect(state.playerState.score).toBe(0);
      expect(state.playerState.stability).toBe(10);
      expect(state.selectedCards.size).toBe(0);
      expect(state.wildUsedThisRound).toBe(false);
      expect(state.selectedChallengeId).toBeTruthy();
    });

    it('should select a challenge from the first ante', () => {
      const state = createInitialGameState(testDeck);
      const firstAnte = ANTES[0];

      expect(firstAnte).toBeDefined();
      expect(state.selectedChallengeId).toBeTruthy();
      expect(
        firstAnte.challenges.some((c) => c.id === state.selectedChallengeId)
      ).toBe(true);
    });

    it('should handle empty deck gracefully', () => {
      const emptyDeck: Card[] = [];
      const state = createInitialGameState(emptyDeck);

      expect(state.hand.length).toBe(0);
      expect(state.deck.length).toBe(0);
    });
  });

  describe('drawCard', () => {
    it('should draw a card and add it to hand when hand is not full', () => {
      const state = createInitialGameState(testDeck);
      const stateWithSpace: GameState = {
        ...state,
        hand: state.hand.slice(0, MAX_HAND_SIZE - 1),
      };
      const initialDeckLength = stateWithSpace.deck.length;
      const initialHandLength = stateWithSpace.hand.length;
      const initialStability = stateWithSpace.playerState.stability;

      const newState = drawCard(stateWithSpace);

      expect(newState.hand.length).toBe(initialHandLength + 1);
      expect(newState.deck.length).toBe(initialDeckLength - 1);
      expect(newState.playerState.stability).toBe(initialStability - 0.5);
    });

    it('should not draw if deck is empty', () => {
      const state = createInitialGameState(testDeck);
      const emptyDeckState: GameState = {
        ...state,
        deck: [],
      };

      const newState = drawCard(emptyDeckState);

      expect(newState).toEqual(emptyDeckState);
    });

    it('should not draw if hand is full', () => {
      const state = createInitialGameState(testDeck);
      const fullHandState: GameState = {
        ...state,
        hand: Array(MAX_HAND_SIZE).fill(state.hand[0]),
      };

      const newState = drawCard(fullHandState);

      expect(newState.hand.length).toBe(MAX_HAND_SIZE);
      expect(newState.deck.length).toBe(state.deck.length);
    });

    it('should not reduce stability below 0', () => {
      const state = createInitialGameState(testDeck);
      const lowStabilityState: GameState = {
        ...state,
        hand: state.hand.slice(0, MAX_HAND_SIZE - 1),
        playerState: {
          ...state.playerState,
          stability: 0.3,
        },
      };

      const newState = drawCard(lowStabilityState);

      expect(newState.playerState.stability).toBe(0);
    });
  });

  describe('discardCards', () => {
    it('should discard selected cards and refill hand', () => {
      const state = createInitialGameState(testDeck);
      const cardToDiscard = state.hand[0];
      const initialDeckLength = state.deck.length;
      const initialStability = state.playerState.stability;

      const newState = discardCards(state, [cardToDiscard.id]);

      expect(newState.hand.length).toBe(MAX_HAND_SIZE);
      expect(newState.hand.find((c) => c.id === cardToDiscard.id)).toBeUndefined();
      expect(newState.discard).toContainEqual(cardToDiscard);
      expect(newState.deck.length).toBe(initialDeckLength - 1);
      expect(newState.playerState.stability).toBe(initialStability - 0.5);
      expect(newState.selectedCards.size).toBe(0);
    });

    it('should discard multiple cards', () => {
      const state = createInitialGameState(testDeck);
      const cardsToDiscard = [state.hand[0].id, state.hand[1].id];
      const initialDeckLength = state.deck.length;

      const newState = discardCards(state, cardsToDiscard);

      expect(newState.hand.length).toBe(MAX_HAND_SIZE);
      expect(newState.discard.length).toBe(2);
      expect(newState.deck.length).toBe(initialDeckLength - 2);
    });

    it('should handle discarding when deck is empty', () => {
      const state = createInitialGameState(testDeck);
      const emptyDeckState: GameState = {
        ...state,
        deck: [],
      };
      const cardToDiscard = emptyDeckState.hand[0];

      const newState = discardCards(emptyDeckState, [cardToDiscard.id]);

      expect(newState.hand.length).toBe(MAX_HAND_SIZE - 1);
      expect(newState.discard).toContainEqual(cardToDiscard);
    });
  });

  describe('selectCard', () => {
    it('should select a card when clicked', () => {
      const state = createInitialGameState(testDeck);
      const cardId = state.hand[0].id;

      const newState = selectCard(state, cardId);

      expect(newState.selectedCards.has(cardId)).toBe(true);
    });

    it('should deselect a card when clicked again', () => {
      const state = createInitialGameState(testDeck);
      const cardId = state.hand[0].id;
      const selectedState = selectCard(state, cardId);

      const newState = selectCard(selectedState, cardId);

      expect(newState.selectedCards.has(cardId)).toBe(false);
    });

    it('should handle multiple card selections', () => {
      const state = createInitialGameState(testDeck);
      const card1 = state.hand[0].id;
      const card2 = state.hand[1].id;

      const state1 = selectCard(state, card1);
      const state2 = selectCard(state1, card2);

      expect(state2.selectedCards.has(card1)).toBe(true);
      expect(state2.selectedCards.has(card2)).toBe(true);
    });
  });

  describe('applyCardAsTrait', () => {
    it('should apply a card as a trait and remove it from hand', () => {
      const state = createInitialGameState(testDeck);
      const cardToApply = state.hand[0];
      const initialHandLength = state.hand.length;

      const newState = applyCardAsTrait(state, cardToApply.id);

      expect(newState.hand.length).toBe(initialHandLength - 1);
      expect(newState.hand.find((c) => c.id === cardToApply.id)).toBeUndefined();
      expect(newState.playerState.traits.length).toBe(1);
      expect(newState.playerState.traits[0].id).toBe(cardToApply.id);
    });

    it('should apply positive trait effects correctly', () => {
      const state = createInitialGameState(testDeck);
      const positiveCard = state.hand.find((c) => c.traitCategory === 'positive');
      if (!positiveCard) {
        const testState: GameState = {
          ...state,
          hand: [
            {
              id: 'test-positive',
              name: 'Test Positive',
              traitCategory: 'positive',
            },
            ...state.hand.slice(1),
          ],
        };
        const newState = applyCardAsTrait(testState, 'test-positive');
        expect(newState.playerState.score).toBe(2);
        expect(newState.playerState.stability).toBe(11);
      } else {
        const newState = applyCardAsTrait(state, positiveCard.id);
        expect(newState.playerState.score).toBeGreaterThanOrEqual(2);
        expect(newState.playerState.stability).toBeGreaterThanOrEqual(11);
      }
    });

    it('should return unchanged state if card not found', () => {
      const state = createInitialGameState(testDeck);

      const newState = applyCardAsTrait(state, 'non-existent-id');

      expect(newState).toEqual(state);
    });
  });

  describe('checkRoundWin', () => {
    it('should return false for invalid round', () => {
      const state = createInitialGameState(testDeck);
      const invalidState: GameState = {
        ...state,
        round: 0,
      };

      expect(checkRoundWin(invalidState)).toBe(false);
    });

    it('should return false if no challenge selected', () => {
      const state = createInitialGameState(testDeck);
      const noChallengeState: GameState = {
        ...state,
        selectedChallengeId: null,
      };

      expect(checkRoundWin(noChallengeState)).toBe(false);
    });

    it('should check challenge requirements correctly', () => {
      const state = createInitialGameState(testDeck);
      const currentAnte = ANTES[state.round - 1];
      const challenge = currentAnte.challenges[0];

      const winningState: GameState = {
        ...state,
        selectedChallengeId: challenge.id,
        playerState: createWinningStateForChallenge(challenge),
      };

      const result = checkRoundWin(winningState);
      expect(typeof result).toBe('boolean');
      expect(result).toBe(true);
    });
  });

  describe('advanceRound', () => {
    it('should mark game as lost if round not won', () => {
      const state = createInitialGameState(testDeck);
      const losingState: GameState = {
        ...state,
        playerState: {
          traits: [],
          score: 0,
          stability: 0,
        },
      };

      const newState = advanceRound(losingState);

      expect(newState.status).toBe('lost');
    });

    it('should advance to next round if won', () => {
      const state = createInitialGameState(testDeck);
      expect(state.round).toBeLessThan(6);

      const currentAnte = ANTES[state.round - 1];
      const challenge = currentAnte.challenges[0];
      const winningState: GameState = {
        ...state,
        selectedChallengeId: challenge.id,
        playerState: createWinningStateForChallenge(challenge),
      };

      expect(checkRoundWin(winningState)).toBe(true);

      const newState = advanceRound(winningState);

      expect(newState.round).toBe(state.round + 1);
      expect(newState.status).toBe('playing');
      expect(newState.wildUsedThisRound).toBe(false);
    });

    it('should mark game as won if final round completed', () => {
      const state = createInitialGameState(testDeck);
      const finalRoundState: GameState = {
        ...state,
        round: 6,
        selectedChallengeId: ANTES[5].challenges[0].id,
        playerState: createWinningStateForChallenge(
          ANTES[5].challenges[0]
        ),
      };

      expect(checkRoundWin(finalRoundState)).toBe(true);

      const newState = advanceRound(finalRoundState);

      expect(newState.status).toBe('won');
      expect(newState.round).toBe(6);
    });
  });

  describe('selectChallenge', () => {
    it('should update selected challenge', () => {
      const state = createInitialGameState(testDeck);
      const currentAnte = ANTES[state.round - 1];
      const newChallengeId = currentAnte.challenges[1].id;

      const newState = selectChallenge(state, newChallengeId);

      expect(newState.selectedChallengeId).toBe(newChallengeId);
    });
  });
});

function createWinningStateForChallenge(
  challenge: { check: (state: State) => boolean }
): State {
  const getCategory = (i: number, mod: number): 'positive' | 'neutral' | 'negative' | 'wild' => {
    const cat = i % mod;
    if (cat === 0) return 'positive';
    if (cat === 1) return 'neutral';
    if (cat === 2) return 'negative';
    return 'wild';
  };

  const createTrait = (id: string, name: string, category: 'positive' | 'neutral' | 'negative' | 'wild') => ({
    id,
    name,
    category,
    description: 'Test',
  });

  const statesToTry: State[] = [
    {
      traits: Array(50).fill(null).map((_, i) => createTrait(`trait-${i}`, `Trait ${i}`, getCategory(i, 4))),
      score: 200,
      stability: 40,
    },
    {
      traits: [
        ...Array(30).fill(null).map((_, i) => createTrait(`pos-${i}`, `Positive ${i}`, 'positive')),
        ...Array(10).fill(null).map((_, i) => createTrait(`neu-${i}`, `Neutral ${i}`, 'neutral')),
        ...Array(5).fill(null).map((_, i) => createTrait(`neg-${i}`, `Negative ${i}`, 'negative')),
        ...Array(5).fill(null).map((_, i) => createTrait(`wild-${i}`, `Wild ${i}`, 'wild')),
      ],
      score: 150,
      stability: 30,
    },
    {
      traits: Array(20).fill(null).map((_, i) => createTrait(`trait-${i}`, `Trait ${i}`, 'positive')),
      score: 100,
      stability: 25,
    },
    {
      traits: [
        ...Array(10).fill(null).map((_, i) => createTrait(`pos-${i}`, `Positive ${i}`, 'positive')),
        ...Array(10).fill(null).map((_, i) => createTrait(`neu-${i}`, `Neutral ${i}`, 'neutral')),
        ...Array(10).fill(null).map((_, i) => createTrait(`neg-${i}`, `Negative ${i}`, 'negative')),
        ...Array(10).fill(null).map((_, i) => createTrait(`wild-${i}`, `Wild ${i}`, 'wild')),
      ],
      score: 200,
      stability: 20,
    },
    {
      traits: Array(15).fill(null).map((_, i) => createTrait(`trait-${i}`, `Trait ${i}`, i % 2 === 0 ? 'positive' : 'neutral')),
      score: 80,
      stability: 2,
    },
    {
      traits: Array(100).fill(null).map((_, i) => createTrait(`trait-${i}`, `Trait ${i}`, getCategory(i, 4))),
      score: 500,
      stability: 100,
    },
  ];

  for (const state of statesToTry) {
    if (challenge.check(state)) {
      return state;
    }
  }

  return statesToTry[statesToTry.length - 1];
}

