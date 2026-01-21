'use client';

import { useState } from 'react';
import {
  createInitialGameState,
  discardCards,
  selectCard,
  applyCardAsTrait,
  advanceRound,
  drawCard
} from '@/lib/game/gameState';
import type { GameState } from '@/lib/game/gameState';
import { getAnteForRound, getDifficultyName } from '@/lib/game/challenges';
import { createNewShuffledDeck } from '@/lib/utilsAndConstants';
import { IntroPage } from './pages/IntroPage';
import { GameplayPage } from './pages/GameplayPage';
import { OutcomePage } from './pages/OutcomePage';

type Page = 'intro' | 'gameplay' | 'outcome';

const DIFFICULTY_TIER_DIVISOR = 10;

function calculateDifficultyTier(round: number): number {
  return Math.ceil(round / DIFFICULTY_TIER_DIVISOR);
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('intro');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerName, setPlayerName] = useState<string>('');

  const startGame = (name: string) => {
    setPlayerName(name);
    const deck = createNewShuffledDeck();
    const initialState = createInitialGameState(deck);
    setGameState(initialState);
    setCurrentPage('gameplay');
  };

  const checkRoundWin = (state: GameState): boolean => {
    const ante = getAnteForRound(state.round);
    if (!ante || !state.selectedChallengeId) return false;
    const selectedChallenge = ante.challenges.find(c => c.id === state.selectedChallengeId);
    if (!selectedChallenge) return false;
    return selectedChallenge.check(state.playerState);
  };

  const handleCardClick = (cardId: string) => {
    if (!gameState) return;
    setGameState(selectCard(gameState, cardId));
  };

  const handleDiscard = () => {
    if (!gameState || gameState.selectedCards.size === 0) return;
    setGameState(discardCards(gameState, Array.from(gameState.selectedCards)));
  };

  const handleDrawCard = () => {
    if (!gameState || gameState.deck.length === 0) return;
    setGameState(drawCard(gameState));
  };

  const handleApplyCard = (cardId: string) => {
    if (!gameState) return;
    const updatedState = applyCardAsTrait(gameState, cardId);
    setGameState(updatedState);
  };

  const handleEndRound = () => {
    if (!gameState) return;
    const won = checkRoundWin(gameState);
    const newState = won ? advanceRound(gameState) : { ...gameState, status: 'lost' as const };
    setGameState(newState);

    if (newState.status === 'won' || newState.status === 'lost') {
      setCurrentPage('outcome');
    }
  };

  const handlePlayAgain = () => {
    const deck = createNewShuffledDeck();
    const initialState = createInitialGameState(deck);
    setGameState(initialState);
    setCurrentPage('intro');
  };

  if (currentPage === 'intro') {
    return <IntroPage onStart={startGame} />;
  }

  if (currentPage === 'outcome' && gameState) {
    const ante = getAnteForRound(gameState.status === 'won' ? 6 : gameState.round);
    const selectedChallenge = ante?.challenges.find(c => c.id === gameState.selectedChallengeId);
    const challengeNumber = gameState.round;
    const difficultyName = selectedChallenge
      ? getDifficultyName(selectedChallenge.difficulty)
      : getDifficultyName(calculateDifficultyTier(gameState.round));

    return (
      <OutcomePage
        won={gameState.status === 'won'}
        playerName={playerName}
        level={challengeNumber}
        difficulty={difficultyName}
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  if (currentPage === 'gameplay' && gameState) {
    const currentAnte = getAnteForRound(gameState.round);

    if (!currentAnte) {
      return (
        <OutcomePage
          won={false}
          playerName={playerName}
          level={gameState.round}
          difficulty={getDifficultyName(calculateDifficultyTier(gameState.round))}
          onPlayAgain={handlePlayAgain}
        />
      );
    }

    const gameplayProps = {
      gameState,
      currentAnte,
      onCardClick: handleCardClick,
      onCardDoubleClick: handleApplyCard,
      onDiscard: handleDiscard,
      onDrawCard: handleDrawCard,
      onEndRound: handleEndRound,
    };

    return <GameplayPage {...gameplayProps} />;
  }

  return null;
}
