import { Card } from '../types/card';
import { State } from '../types/playerState';
import { cardToTrait } from './cardToTrait';
import { applyTrait } from './traitLogic';
import { ANTES, type Ante } from './challenges';

export type GameStatus = 'playing' | 'won' | 'lost';

export type GameState = {
  round: number;
  status: GameStatus;
  deck: Card[];
  discard: Card[];
  hand: Card[];
  playerState: State;
  selectedCards: Set<string>;
  wildUsedThisRound: boolean;
  selectedChallengeId: string | null;
};

const MAX_ROUNDS = 6;

/**
 * Randomly selects a challenge from the given ante
 */
function selectRandomChallenge(ante: Ante): string {
  const randomIndex = Math.floor(Math.random() * ante.challenges.length);
  return ante.challenges[randomIndex].id;
}

export function createInitialGameState(deck: Card[]): GameState {
  const initialDeck = [...deck];
  const initialHand: Card[] = [];

  for (let i = 0; i < 6 && initialDeck.length > 0; i++) {
    initialHand.push(initialDeck.pop()!);
  }

  const firstAnte = ANTES[0];
  const selectedChallengeId = firstAnte ? selectRandomChallenge(firstAnte) : null;

  return {
    round: 1,
    status: 'playing',
    deck: initialDeck,
    discard: [],
    hand: initialHand,
    playerState: {
      traits: [],
      score: 0,
      stability: 10,
    },
    selectedCards: new Set(),
    wildUsedThisRound: false,
    selectedChallengeId,
  };
}

export function drawCard(state: GameState): GameState {
  if (state.deck.length === 0) {
    return state;
  }

  if (state.hand.length >= 6) {
    return state;
  }

  const newDeck = [...state.deck];
  const drawnCard = newDeck.pop()!;

  const newPlayerState = {
    ...state.playerState,
    stability: Math.max(0, state.playerState.stability - 0.5),
  };

  return {
    ...state,
    deck: newDeck,
    hand: [...state.hand, drawnCard],
    playerState: newPlayerState,
  };
}

export function discardCards(state: GameState, cardIds: string[]): GameState {
  const newHand = state.hand.filter(card => !cardIds.includes(card.id));
  const discardedCards = state.hand.filter(card => cardIds.includes(card.id));

  const newDeck = [...state.deck];
  const cardsNeeded = 6 - newHand.length;

  for (let i = 0; i < cardsNeeded && newDeck.length > 0; i++) {
    newHand.push(newDeck.pop()!);
  }

  const newPlayerState = {
    ...state.playerState,
    stability: Math.max(0, state.playerState.stability - 0.5),
  };

  return {
    ...state,
    deck: newDeck,
    discard: [...state.discard, ...discardedCards],
    hand: newHand,
    selectedCards: new Set(),
    playerState: newPlayerState,
  };
}

export function selectCard(state: GameState, cardId: string): GameState {
  const newSelected = new Set(state.selectedCards);
  if (newSelected.has(cardId)) {
    newSelected.delete(cardId);
  } else {
    newSelected.add(cardId);
  }

  return {
    ...state,
    selectedCards: newSelected,
  };
}

export function applyCardAsTrait(state: GameState, cardId: string): GameState {
  const card = state.hand.find(c => c.id === cardId);
  if (!card) return state;

  const trait = cardToTrait(card);
  const newPlayerState = applyTrait(state.playerState, trait);

  const newHand = state.hand.filter(c => c.id !== cardId);

  return {
    ...state,
    hand: newHand,
    playerState: newPlayerState,
  };
}

export function checkRoundWin(state: GameState): boolean {
  if (state.round > ANTES.length || state.round < 1) {
    return false;
  }

  const currentAnte = ANTES[state.round - 1];
  if (!currentAnte || !state.selectedChallengeId) {
    return false;
  }

  const selectedChallenge = currentAnte.challenges.find(c => c.id === state.selectedChallengeId);
  if (!selectedChallenge) {
    return false;
  }

  return selectedChallenge.check(state.playerState);
}

export function advanceRound(state: GameState): GameState {
  const won = checkRoundWin(state);

  if (!won) {
    return {
      ...state,
      status: 'lost',
    };
  }

  if (state.round >= MAX_ROUNDS) {
    return {
      ...state,
      status: 'won',
    };
  }

  const newDeck = [...state.deck];
  const newHand = [...state.hand];
  const cardsNeeded = 6 - newHand.length;

  for (let i = 0; i < cardsNeeded && newDeck.length > 0; i++) {
    newHand.push(newDeck.pop()!);
  }

  const nextRound = state.round + 1;
  const nextAnte = ANTES[nextRound - 1];
  const selectedChallengeId = nextAnte ? selectRandomChallenge(nextAnte) : null;

  return {
    ...state,
    round: nextRound,
    wildUsedThisRound: false,
    deck: newDeck,
    hand: newHand,
    selectedChallengeId,
  };
}

export function selectChallenge(state: GameState, challengeId: string): GameState {
  return {
    ...state,
    selectedChallengeId: challengeId,
  };
}
