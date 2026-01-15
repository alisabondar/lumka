'use client';

import { Paper, Typography, Tooltip } from '@mui/material';
import { GameState } from '@/lib/game/gameState';
import { Ante } from '@/lib/game/challenges';
import type { TraitCategory } from '@/lib/types/trait';
import styles from './GameInfo.module.css';

interface GameInfoProps {
  gameState: GameState;
  currentAnte: Ante;
}

export const GameInfo = ({ gameState, currentAnte }: GameInfoProps) => {
  const selectedChallenge = gameState.selectedChallengeId
    ? currentAnte.challenges.find(c => c.id === gameState.selectedChallengeId)
    : null;

  const traitCounts = gameState.playerState.traits.reduce((acc, trait) => {
    acc[trait.category] = (acc[trait.category] || 0) + 1;
    return acc;
  }, {} as Record<TraitCategory, number>);

  const traitBreakdown = `${traitCounts.negative || 0} negative, ${traitCounts.positive || 0} positive, ${traitCounts.neutral || 0} neutral, ${traitCounts.wild || 0} wild`;

  return (
    <Paper elevation={4} data-walkthrough="game-info" className={styles.container}>
      <div className={styles.infoSection}>
        <Typography variant="body1" component="span" className={styles.roundText}>
          Round {gameState.round}{selectedChallenge && ':'}
        </Typography>
        {selectedChallenge && (
          <Tooltip
            title={selectedChallenge.description}
            arrow
            placement="bottom"
          >
            <Typography variant="body1" component="span" className={styles.challengeText}>
              {selectedChallenge.name}
            </Typography>
          </Tooltip>
        )}
      </div>
      <div className={styles.statsRow}>
        <div className={styles.statItem}>
          <Typography variant="caption" className={styles.statLabel}>
            Score
          </Typography>
          <Typography variant="body1" className={styles.statValue}>
            {gameState.playerState.score}
          </Typography>
        </div>
        <div className={styles.statItem}>
          <Typography variant="caption" className={styles.statLabel}>
            Stability
          </Typography>
          <Typography variant="body1" className={styles.statValue}>
            {gameState.playerState.stability}
          </Typography>
        </div>
        <Tooltip
          title={traitBreakdown}
          arrow
          placement="bottom"
        >
          <div className={`${styles.statItem} ${styles.statItemHoverable}`}>
            <Typography variant="caption" className={styles.statLabel}>
              Traits
            </Typography>
            <Typography variant="body1" className={styles.statValue}>
              {gameState.playerState.traits.length}
            </Typography>
          </div>
        </Tooltip>
      </div>
    </Paper>
  );
};

