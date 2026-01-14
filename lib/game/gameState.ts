import { Card } from '../types/card';
import { Trait } from '../types/trait';
import { State } from '../types/playerState';
import { cardToTrait } from './cardToTrait';
import { applyTrait } from './traitLogic';
import { ANTES, checkAnte } from './challenges';

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

export function createInitialGameState(deck: Card[]): GameState {
  // Draw initial hand of 6 cards
  const initialDeck = [...deck];
  const initialHand: Card[] = [];

  for (let i = 0; i < 6 && initialDeck.length > 0; i++) {
    initialHand.push(initialDeck.pop()!);
  }

  return {
    round: 1,
    status: 'playing',
    deck: initialDeck,
    discard: [],
    hand: initialHand,
    playerState: {
      traits: [],
      score: 0,
      stability: 10, // Starting stability
    },
    selectedCards: new Set(),
    wildUsedThisRound: false,
    selectedChallengeId: null,
  };
}

export function drawCard(state: GameState): GameState {
  if (state.deck.length === 0) {
    return state; // Can't draw if deck is empty
  }

  if (state.hand.length >= 6) {
    return state; // Can't draw if hand already has 6 or more cards
  }

  const newDeck = [...state.deck];
  const drawnCard = newDeck.pop()!;

  // Decrease stability by 0.5 when drawing
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

  // Replenish hand to 6 cards
  const newDeck = [...state.deck];
  const cardsNeeded = 6 - newHand.length;

  for (let i = 0; i < cardsNeeded && newDeck.length > 0; i++) {
    newHand.push(newDeck.pop()!);
  }

  // Decrease stability by 0.5 when discarding
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

  // Remove card from hand (don't replenish automatically)
  const newHand = state.hand.filter(c => c.id !== cardId);

  return {
    ...state,
    hand: newHand,
    playerState: newPlayerState,
  };
}

export function checkRoundWin(state: GameState): boolean {
  if (state.round > ANTES.length || state.round < 1) {
    return false; // No more antes or invalid round
  }

  const currentAnte = ANTES[state.round - 1];
  if (!currentAnte) {
    return false; // Safety check
  }
  return checkAnte(state.playerState, currentAnte);
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

  // Automatically fill hand to 6 cards when ending round (without affecting points)
  const newDeck = [...state.deck];
  const newHand = [...state.hand];
  const cardsNeeded = 6 - newHand.length;

  for (let i = 0; i < cardsNeeded && newDeck.length > 0; i++) {
    newHand.push(newDeck.pop()!);
  }

  return {
    ...state,
    round: state.round + 1,
    wildUsedThisRound: false,
    deck: newDeck,
    hand: newHand,
    selectedChallengeId: null, // Reset challenge selection for new round
  };
}

export function selectChallenge(state: GameState, challengeId: string): GameState {
  return {
    ...state,
    selectedChallengeId: challengeId,
  };
}

