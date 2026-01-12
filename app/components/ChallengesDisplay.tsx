'use client';

import { Paper, Typography, Button, Chip, Stack } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { GameState } from '@/lib/game/gameState';
import { Ante } from '@/lib/game/challenges';
import styles from './ChallengesDisplay.module.css';

interface ChallengesDisplayProps {
  gameState: GameState;
  currentAnte: Ante;
  onEndRound: () => void;
}

export const ChallengesDisplay = ({
  gameState,
  currentAnte,
  onEndRound
}: ChallengesDisplayProps) => {
  return (
    <Paper elevation={4} className={styles.container}>
      <Typography variant="h6" gutterBottom className={styles.title}>
        Challenges (meet at least one):
      </Typography>
      <Stack spacing={2} className={styles.challengesList}>
        {currentAnte.challenges.map((challenge) => {
          const passed = challenge.check(gameState.playerState);
          return (
            <div
              key={challenge.id}
              className={`${styles.challengeItem} ${passed ? styles.challengeItemPassed : ''}`}
            >
              <Chip label={challenge.id} size="small" color="primary" />
              <Typography variant="body1" className={styles.challengeName}>
                {challenge.name}
              </Typography>
              <Typography variant="body2" className={styles.challengeDescription}>
                {challenge.description}
              </Typography>
              {passed && (
                <CheckCircleIcon className={styles.checkIcon} />
              )}
            </div>
          );
        })}
      </Stack>
      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={onEndRound}
        className={styles.endButton}
      >
        End Round
      </Button>
    </Paper>
  );
};
