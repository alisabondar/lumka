'use client';

import { GameState } from '@/lib/game/gameState';
import { Ante } from '@/lib/game/challenges';
import styles from './GameInfo.module.css';

interface GameInfoProps {
  gameState: GameState;
  currentAnte: Ante;
}

export default function GameInfo({ gameState, currentAnte }: GameInfoProps) {
  const selectedChallenge = gameState.selectedChallengeId
    ? currentAnte.challenges.find(c => c.id === gameState.selectedChallengeId)
    : null;

  return (
    <div className={styles.gameInfo}>
      <div className={styles.roundInfo}>
        <h2>Round {gameState.round} of 6</h2>
        <div className={styles.anteInfo}>
          <span className={styles.anteColor}>{currentAnte.color}</span>
          <span className={styles.anteName}>{currentAnte.name}</span>
        </div>
        {selectedChallenge && (
          <div className={styles.selectedChallenge}>
            <span className={styles.selectedChallengeLabel}>Selected Challenge:</span>
            <span className={styles.selectedChallengeText}>
              {selectedChallenge.id} - {selectedChallenge.name}
            </span>
          </div>
        )}
      </div>
      <div className={styles.playerStats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Score:</span>
          <span className={styles.statValue}>{gameState.playerState.score}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Stability:</span>
          <span className={styles.statValue}>{gameState.playerState.stability}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Traits:</span>
          <span className={styles.statValue}>{gameState.playerState.traits.length}</span>
        </div>
      </div>
    </div>
  );
}

