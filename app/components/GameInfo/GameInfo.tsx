'use client';

import { Paper, Typography, Tooltip } from '@mui/material';
import { GameState } from '@/lib/game/gameState';
import { Ante, getChallengeRequirements } from '@/lib/game/challenges';
import { CATEGORY_NAMES } from '@/lib/types/card';
import type { TraitCategory } from '@/lib/types/trait';
import styles from './GameInfo.module.css';

interface GameInfoProps {
  gameState: GameState;
  currentAnte: Ante;
}

function boardText(text: string): string {
  return text.replace(/\b[A-Z]{2,}\b/g, (word) =>
    word.charAt(0) + word.slice(1).toLocaleLowerCase()
  );
}

export const GameInfo = ({ gameState, currentAnte }: GameInfoProps) => {
  const selectedChallenge = gameState.selectedChallengeId
    ? currentAnte.challenges.find(c => c.id === gameState.selectedChallengeId)
    : null;
  const challengeRequirements = selectedChallenge
    ? getChallengeRequirements(gameState.playerState, selectedChallenge)
    : [];

  const traitCounts = gameState.playerState.traits.reduce((acc, trait) => {
    acc[trait.category] = (acc[trait.category] || 0) + 1;
    return acc;
  }, {} as Record<TraitCategory, number>);

  const traitBreakdown = boardText(`Currently: ${traitCounts.positive || 0} ${CATEGORY_NAMES.positive}, ${traitCounts.neutral || 0} ${CATEGORY_NAMES.neutral}, ${traitCounts.negative || 0} ${CATEGORY_NAMES.negative}, ${traitCounts.wild || 0} ${CATEGORY_NAMES.wild}`);

  return (
    <Paper
      elevation={4}
      data-walkthrough="game-info"
      className={styles.container}
      role="region"
      aria-label="Game information"
    >
      <div className={styles.infoSection}>
        <Typography
          variant="h6"
          component="span"
          className={styles.roundText}
          aria-label={`Round ${gameState.round}`}
        >
          Round {gameState.round}{selectedChallenge && ':'}
        </Typography>
        {selectedChallenge && (
          <Typography
            variant="h6"
            component="span"
            className={styles.challengeText}
            aria-label={`Challenge: ${boardText(selectedChallenge.name)}`}
          >
            {boardText(selectedChallenge.name)}
          </Typography>
        )}
      </div>
      {selectedChallenge && (
        <div className={styles.challengeDescriptionSection}>
          <Typography
            variant="body2"
            sx={{ fontSize: { xs: '0.95rem', sm: '1rem', md: '1.125rem' } }}
            className={styles.challengeDescription}
            aria-label={`Challenge requirement: ${boardText(selectedChallenge.description)}`}
          >
            {boardText(selectedChallenge.description)}
          </Typography>
          <div className={styles.requirementList} aria-label="Challenge requirement progress">
            {challengeRequirements.map((requirement) => (
              <div
                key={requirement.label}
                className={`${styles.requirementItem} ${requirement.met ? styles.requirementMet : styles.requirementMissing}`}
              >
                <span className={styles.requirementStatus} aria-hidden="true">
                  {requirement.met ? '✓' : '•'}
                </span>
                <span className={styles.requirementLabel}>{boardText(requirement.label)}</span>
                {requirement.current && (
                  <span className={styles.requirementCurrent}>{requirement.current}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className={styles.statsRow} role="group" aria-label="Player statistics">
        <div className={styles.statItem} role="status" aria-label={`Score: ${gameState.playerState.score}`}>
          <Typography variant="caption" className={styles.statLabel}>
            Score
          </Typography>
          <Typography variant="body1" className={styles.statValue} aria-hidden="true">
            {gameState.playerState.score}
          </Typography>
        </div>
        <Tooltip
          title="Drawing or discarding cards costs 0.5 stability. If stability reaches zero, you lose!"
          arrow
          placement="bottom"
        >
          <div className={`${styles.statItem} ${styles.statItemHoverable}`} role="status" aria-label={`Stability: ${gameState.playerState.stability}. Drawing or discarding cards costs 0.5 stability. If stability reaches zero, you lose!`}>
            <Typography variant="caption" className={styles.statLabel}>
              Stability
            </Typography>
            <Typography variant="body1" className={styles.statValue} aria-hidden="true">
              {gameState.playerState.stability}
            </Typography>
          </div>
        </Tooltip>
        <Tooltip
          title={traitBreakdown}
          arrow
          placement="bottom"
        >
          <div className={`${styles.statItem} ${styles.statItemHoverable}`} role="status" aria-label={`Traits: ${gameState.playerState.traits.length}. ${traitBreakdown}`}>
            <Typography variant="caption" className={styles.statLabel}>
              Traits
            </Typography>
            <Typography variant="body1" className={styles.statValue} aria-hidden="true">
              {gameState.playerState.traits.length}
            </Typography>
          </div>
        </Tooltip>
      </div>
    </Paper>
  );
};
