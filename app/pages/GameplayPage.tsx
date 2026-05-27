'use client';

import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { GameState } from '@/lib/game/gameState';
import { Ante } from '@/lib/game/challenges';
import { Tooltip } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
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
type Season = typeof SEASONS[number];

const SEASON_EFFECT_CLASSES: Record<Season, string> = {
  winter: styles.snow,
  spring: styles.blossoms,
  summer: styles.summerDots,
  autumn: styles.leaves,
};

const SEASON_SCENE_CLASSES: Record<Season, string> = {
  winter: styles.winterScene,
  spring: styles.springScene,
  summer: styles.summerScene,
  autumn: styles.autumnScene,
};

const randomFor = (index: number, salt: number) => {
  const value = Math.sin(index * 93.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

const PARTICLES = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  left: `${randomFor(index, 1) * 100}%`,
  delay: `${-(randomFor(index, 2) * 12).toFixed(2)}s`,
  duration: `${(7.5 + randomFor(index, 3) * 8).toFixed(2)}s`,
  size: `${(4 + randomFor(index, 4) * 9).toFixed(2)}px`,
  driftMid: `${(-70 + randomFor(index, 5) * 140).toFixed(2)}px`,
  driftEnd: `${(-90 + randomFor(index, 6) * 180).toFixed(2)}px`,
  opacity: `${(0.42 + randomFor(index, 7) * 0.45).toFixed(2)}`,
  rotation: `${Math.round(randomFor(index, 8) * 360)}deg`,
  spin: `${Math.round(-280 + randomFor(index, 9) * 680)}deg`,
}));

type ParticleStyle = CSSProperties & {
  '--particle-left': string;
  '--particle-delay': string;
  '--particle-duration': string;
  '--particle-size': string;
  '--particle-drift-mid': string;
  '--particle-drift-end': string;
  '--particle-opacity': string;
  '--particle-rotation': string;
  '--particle-spin': string;
};

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
  const canEndRound = isWalkthrough || gameState.hasAppliedCardThisRound;

  const currentSeason = SEASONS[(gameState.round - 1) % SEASONS.length];
  const [displaySeason, setDisplaySeason] = useState(currentSeason);
  const [previousSeason, setPreviousSeason] = useState<Season | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (currentSeason === displaySeason) return;

    let isCancelled = false;
    let transitionTimer: ReturnType<typeof setTimeout> | undefined;
    const outgoingSeason = displaySeason;
    const nextBackground = new window.Image();

    const startTransition = () => {
      if (isCancelled) return;
      setPreviousSeason(outgoingSeason);
      setDisplaySeason(currentSeason);
      setIsTransitioning(true);

      transitionTimer = setTimeout(() => {
        setIsTransitioning(false);
        setPreviousSeason(null);
      }, 850);
    };

    nextBackground.src = `/${currentSeason}.png`;
    if (nextBackground.complete) {
      startTransition();
    } else if (nextBackground.decode) {
      nextBackground.decode().then(startTransition).catch(startTransition);
    } else {
      nextBackground.onload = startTransition;
      nextBackground.onerror = startTransition;
    }

    return () => {
      isCancelled = true;
      if (transitionTimer) {
        clearTimeout(transitionTimer);
      }
      nextBackground.onload = null;
      nextBackground.onerror = null;
    };
  }, [currentSeason, displaySeason]);

  return (
    <main
      className={`${styles.gameplayContainer} ${SEASON_SCENE_CLASSES[displaySeason]} ${isWalkthrough ? styles.walkthroughBackground : ''}`}
      style={{
        backgroundImage: `url(/${displaySeason}.png)`,
      }}
      aria-label={`Gameplay - Round ${gameState.round}, ${currentSeason} season`}
    >
      {!isWalkthrough && previousSeason && (
        <div
          className={`${styles.sceneCrossfade} ${isTransitioning ? styles.sceneCrossfadeLeaving : ''}`}
          style={{
            backgroundImage: `url(/${previousSeason}.png)`,
          }}
          aria-hidden="true"
        />
      )}
      {!isWalkthrough && (
        <div
          className={`${styles.seasonalOverlay} ${isTransitioning ? styles.seasonalOverlayOpaque : ''}`}
          aria-hidden="true"
        />
      )}
      {!isWalkthrough && isTransitioning && (
        <div className={styles.seasonTransition} aria-live="polite">
          {displaySeason}
        </div>
      )}
      {!isWalkthrough && (
        <div
          className={`${styles.particleLayer} ${SEASON_EFFECT_CLASSES[displaySeason]}`}
          aria-hidden="true"
        >
          {PARTICLES.map((particle) => (
            <span
              key={`${displaySeason}-${particle.id}`}
              className={styles.particle}
              style={{
                '--particle-left': particle.left,
                '--particle-delay': particle.delay,
                '--particle-duration': particle.duration,
                '--particle-size': particle.size,
                '--particle-drift-mid': particle.driftMid,
                '--particle-drift-end': particle.driftEnd,
                '--particle-opacity': particle.opacity,
                '--particle-rotation': particle.rotation,
                '--particle-spin': particle.spin,
              } as ParticleStyle}
            />
          ))}
        </div>
      )}
      <GameInfo gameState={gameState} currentAnte={currentAnte} />

      <div className={styles.endRoundButtonWrapper} data-walkthrough="end-round-button">
        {canEndRound ? (
          <GradientButton
            size="large"
            onClick={onEndRound}
            className={styles.iconActionButton}
            aria-label="End round and check challenge requirements"
          >
            <ArrowForwardRoundedIcon fontSize="large" />
          </GradientButton>
        ) : (
          <Tooltip title="Must play a card every round">
            <span>
              <GradientButton
                size="large"
                onClick={onEndRound}
                disabled
                className={styles.iconActionButton}
                aria-label="Apply a card as a trait first to end the round"
              >
                <ArrowForwardRoundedIcon fontSize="large" />
              </GradientButton>
            </span>
          </Tooltip>
        )}
      </div>

      <Deck
        count={gameState.deck.length}
        onClick={onDrawCard}
        isWalkthrough={isWalkthrough}
        disabled={isWalkthrough ? false : handIsFull}
        season={displaySeason}
      />

      {hasSelectedCards && (
        <div className={styles.discardButtonWrapper} data-walkthrough="discard-button">
          <GradientButton
            size="large"
            onClick={onDiscard}
            className={styles.iconActionButton}
            aria-label={`Discard ${gameState.selectedCards.size} selected card${gameState.selectedCards.size > 1 ? 's' : ''}`}
          >
            <DeleteRoundedIcon fontSize="large" />
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
