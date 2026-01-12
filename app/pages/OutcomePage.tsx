'use client';

import { Container, Typography, Paper } from '@mui/material';
import { GradientButton } from '../components/GradientButton';
import styles from './OutcomePage.module.css';

interface OutcomePageProps {
  won: boolean;
  onPlayAgain: () => void;
}

export const OutcomePage = ({ won, onPlayAgain }: OutcomePageProps) => {
  return (
    <div className={styles.container}>
      <Container maxWidth="md">
        <Paper elevation={24} className={styles.outcomeCard}>
          <Typography
            variant="h2"
            gutterBottom
            className={`${styles.title} ${won ? styles.titleWin : styles.titleLose}`}
          >
            {won ? 'Congrats, you sly cat! 🐱' : "Guess you're not good enough 😿"}
          </Typography>
          <Typography variant="h5" className={styles.subtitle}>
            {won
              ? "You've successfully evolved through all 6 rounds!"
              : 'You failed to meet the challenge requirements.'}
          </Typography>
          <GradientButton size="large" onClick={onPlayAgain}>
            Play Again
          </GradientButton>
        </Paper>
      </Container>
    </div>
  );
};
