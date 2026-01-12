'use client';

import { Paper, Typography, Chip, Tooltip } from '@mui/material';
import { GameState } from '@/lib/game/gameState';
import { Ante } from '@/lib/game/challenges';
import { SUIT_SYMBOLS, TRAIT_SYMBOLS } from '@/lib/types/card';
import type { Suit, Rank } from '@/lib/types/card';
import styles from './GameInfo.module.css';

interface GameInfoProps {
  gameState: GameState;
  currentAnte: Ante;
}

export const GameInfo = ({ gameState, currentAnte }: GameInfoProps) => {
  const selectedChallenge = gameState.selectedChallengeId
    ? currentAnte.challenges.find(c => c.id === gameState.selectedChallengeId)
    : null;

  // Parse trait ID to get card information (format: "suit-rank")
  const parseCardFromTraitId = (traitId: string) => {
    const parts = traitId.split('-');
    if (parts.length >= 2) {
      const suit = parts[0] as Suit;
      const rank = parts.slice(1).join('-') as Rank;
      return { suit, rank };
    }
    return null;
  };

  return (
    <Paper elevation={4} data-walkthrough="game-info" className={styles.container}>
      <div className={styles.leftSection}>
        <Typography variant="h5" className={styles.roundTitle}>
          Round {gameState.round} of 6
        </Typography>
        <div className={styles.anteInfo}>
          <Typography variant="h6">{currentAnte.color}</Typography>
          <Typography variant="body1" className={styles.anteName}>
            {currentAnte.name}
          </Typography>
        </div>
        {selectedChallenge && (
          <div className={styles.challengeInfo}>
            <Typography variant="caption" className={styles.challengeLabel}>
              Selected Challenge:
            </Typography>
            <Chip
              label={`${selectedChallenge.id} - ${selectedChallenge.name}`}
              size="small"
              color="primary"
            />
          </div>
        )}
      </div>
      <div className={styles.statsSection}>
        <div className={styles.statItem}>
          <Typography variant="caption" className={styles.statLabel}>
            Score
          </Typography>
          <Typography variant="h6" className={styles.statValue} sx={{ color: 'primary.main' }}>
            {gameState.playerState.score}
          </Typography>
        </div>
        <div className={styles.statItem}>
          <Typography variant="caption" className={styles.statLabel}>
            Stability
          </Typography>
          <Typography variant="h6" className={styles.statValue} sx={{ color: 'primary.main' }}>
            {gameState.playerState.stability}
          </Typography>
        </div>
        <Tooltip
          title={
            gameState.playerState.traits.length > 0 ? (
              <div className={styles.tooltipContainer}>
                <div className={styles.tooltipInner}>
                  {gameState.playerState.traits.map((trait, index) => {
                    const cardInfo = parseCardFromTraitId(trait.id);
                    if (!cardInfo) return null;

                    const totalCards = gameState.playerState.traits.length;
                    const maxAngle = totalCards > 8 ? 12.5 : totalCards > 6 ? 15 : 20;
                    const angleStep = totalCards > 1 ? (maxAngle * 2) / (totalCards - 1) : 0;
                    const angle = totalCards > 1 ? -maxAngle + (angleStep * index) : 0;
                    const translateY = Math.abs(Math.sin((angle * Math.PI) / 180)) * 15;
                    const overlap = 45;

                    const cardStyle = {
                      marginLeft: index > 0 ? `-${overlap}px` : 0,
                      transform: `rotate(${angle}deg) translateY(${-translateY}px)`,
                      zIndex: totalCards - index,
                    };

                    const hoverTransform = `rotate(${angle}deg) translateY(${-translateY - 15}px) scale(1.15)`;

                    const isRed = cardInfo.suit === 'hearts' || cardInfo.suit === 'diamonds';

                    return (
                      <div
                        key={trait.id}
                        className={styles.traitCard}
                        style={cardStyle}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = hoverTransform;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = cardStyle.transform;
                        }}
                      >
                        <div className={`${styles.traitCardInner} ${isRed ? styles.traitCardRed : styles.traitCardBlack}`}>
                          <div className={styles.traitSymbol}>
                            {TRAIT_SYMBOLS[trait.category]}
                          </div>
                          <div className={styles.suitSymbol}>{SUIT_SYMBOLS[cardInfo.suit]}</div>
                          <div className={styles.rankSymbol}>{cardInfo.rank}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              ''
            )
          }
          arrow
          placement="bottom"
          componentsProps={{
            tooltip: {
              sx: {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                padding: 0,
                borderRadius: 2,
                maxWidth: '90vw',
                overflow: 'hidden',
              },
            },
            arrow: {
              sx: {
                color: 'rgba(0, 0, 0, 0.9)',
              },
            },
          }}
        >
          <div className={styles.traitsButton}>
            <Typography variant="caption" className={styles.traitsLabel}>
              Traits
            </Typography>
            <Typography variant="h6" className={styles.traitsValue} sx={{ color: 'primary.main' }}>
              {gameState.playerState.traits.length}
            </Typography>
          </div>
        </Tooltip>
      </div>
    </Paper>
  );
};

