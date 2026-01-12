'use client';

import { Modal, Paper, Typography, Button, Stack } from '@mui/material';
import { Ante } from '@/lib/game/challenges';
import styles from './ChallengeModal.module.css';

interface ChallengeModalProps {
  ante: Ante;
  onSelectChallenge: (challengeId: string) => void;
}

export const ChallengeModal = ({ ante, onSelectChallenge }: ChallengeModalProps) => {
  return (
    <Modal open={true} className={styles.modalBackdrop}>
      <Paper elevation={24} className={styles.modalPaper}>
        <Typography variant="h4" gutterBottom className={styles.title}>
          {ante.color} {ante.name} - Round {ante.ante}
        </Typography>
        <Typography variant="h6" className={styles.subtitle}>
          Choose one challenge to complete this round:
        </Typography>
        <Stack spacing={2}>
          {ante.challenges.map((challenge) => (
            <Button
              key={challenge.id}
              variant="outlined"
              size="large"
              onClick={() => onSelectChallenge(challenge.id)}
              className={styles.challengeButton}
              sx={{
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                },
              }}
            >
              <div>
                <div className={styles.challengeHeader}>
                  <Typography variant="h6" className={styles.challengeId}>
                    {challenge.id}
                  </Typography>
                  <Typography variant="h6" className={styles.challengeName}>
                    {challenge.name}
                  </Typography>
                </div>
                <Typography variant="body2" className={styles.challengeDescription}>
                  {challenge.description}
                </Typography>
              </div>
            </Button>
          ))}
        </Stack>
      </Paper>
    </Modal>
  );
};

