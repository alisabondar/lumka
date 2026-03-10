'use client';

import { useState, useEffect } from 'react';
import { GameState } from '@/lib/game/gameState';
import { Ante } from '@/lib/game/challenges';
import { GameInfo } from '../components/GameInfo';
import { Deck } from '../components/Deck';
import { PlayingHand } from '../components/PlayingHand';
import { GradientButton } from '../components/GradientButton';
import { MAX_HAND_SIZE } from '@/lib/utilsAndConstants';
import styles from './GameplayPage.module.css';

interface GameplayPageProps {
  gameState: GameState;
  currentAnte: Ante;
  onCardClick: (cardId: string) => void;
  onCardDoubleClick: (cardId: string) => void;
  onDiscard: () => void;
  onDrawCard: () => void;
  onEndRound: () => void;
  isWalkthrough?: boolean;
}

const SEASONS = ['winter', 'spring', 'summer', 'autumn'] as const;

export const GameplayPage = ({
  gameState,
  currentAnte,
  onCardClick,
  onCardDoubleClick,
  onDiscard,
  onDrawCard,
  onEndRound,
  isWalkthrough = false,
}: GameplayPageProps) => {
  const hasSelectedCards = gameState.selectedCards.size > 0;
  const handIsFull = gameState.hand.length >= MAX_HAND_SIZE;

  const currentSeason = SEASONS[(gameState.round - 1) % SEASONS.length];
  const [displaySeason, setDisplaySeason] = useState(currentSeason);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (currentSeason === displaySeason) return;
    setIsTransitioning(true);
    const switchTimer = setTimeout(() => {
      setDisplaySeason(currentSeason);
      setIsTransitioning(false);
    }, 400);
    return () => clearTimeout(switchTimer);
  }, [currentSeason, displaySeason]);

  return (
    <main
      className={`${styles.gameplayContainer} ${isWalkthrough ? styles.walkthroughBackground : ''}`}
      style={isWalkthrough ? undefined : {
        backgroundImage: `url(/${displaySeason}.png)`,
      }}
      aria-label={`Gameplay - Round ${gameState.round}, ${currentSeason} season`}
    >
      {!isWalkthrough && (
        <div
          className={`${styles.seasonalOverlay} ${isTransitioning ? styles.seasonalOverlayOpaque : ''}`}
          aria-hidden="true"
        />
      )}
      <GameInfo gameState={gameState} currentAnte={currentAnte} />

      <div className={styles.endRoundButtonWrapper} data-walkthrough="end-round-button">
        <GradientButton
          size="large"
          onClick={onEndRound}
          aria-label="End round and check challenge requirements"
        >
          End Round
        </GradientButton>
      </div>

      <Deck
        count={gameState.deck.length}
        onClick={onDrawCard}
        isWalkthrough={isWalkthrough}
        disabled={handIsFull}
      />

      {hasSelectedCards && (
        <div className={styles.discardButtonWrapper} data-walkthrough="discard-button">
          <GradientButton
            size="large"
            onClick={onDiscard}
            aria-label={`Discard ${gameState.selectedCards.size} selected card${gameState.selectedCards.size > 1 ? 's' : ''}`}
          >
            Discard
          </GradientButton>
        </div>
      )}

      <PlayingHand
        cards={gameState.hand}
        selectedCards={gameState.selectedCards}
        onCardClick={onCardClick}
        onCardDoubleClick={onCardDoubleClick}
      />
    </main>
  );
};
